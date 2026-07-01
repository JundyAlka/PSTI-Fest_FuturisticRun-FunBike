import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/adminAuth";
import { insforge } from "@/lib/insforge";
import { ALLOWED_SETTING_KEYS } from "@/lib/validations";
import { normalizeEventDate } from "@/lib/eventDate";
import { writeActivityLog } from "@/lib/serverAudit";

const allowedKeys = new Set<string>(ALLOWED_SETTING_KEYS);
const eventTypes = new Set(["futuristic-run", "fun-bike"]);

function getEventType(req: NextRequest) {
  const eventType = req.nextUrl.searchParams.get("eventType") ?? "futuristic-run";
  return eventTypes.has(eventType) ? eventType : null;
}

export async function GET(req: NextRequest) {
  const session = await requireAdmin();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const eventType = getEventType(req);
  if (!eventType) return NextResponse.json({ error: "Event tidak valid" }, { status: 400 });

  const [settingsResult, categoryResult] = await Promise.all([
    insforge.database.from("event_settings").select("key, value").eq("event_type", eventType),
    insforge.database
      .from("event_categories")
      .select("price")
      .eq("event_type", eventType)
      .order("id", { ascending: true })
      .limit(1)
      .maybeSingle(),
  ]);

  if (settingsResult.error || categoryResult.error) {
    return NextResponse.json({ error: "Pengaturan gagal dimuat" }, { status: 500 });
  }

  const map = Object.fromEntries((settingsResult.data ?? []).map((setting) => [setting.key, setting.value]));
  if (categoryResult.data?.price) map.registration_fee = String(categoryResult.data.price);
  return NextResponse.json(map);
}

export async function POST(req: NextRequest) {
  const session = await requireAdmin();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const eventType = getEventType(req);
  if (!eventType) return NextResponse.json({ error: "Event tidak valid" }, { status: 400 });

  const body = await req.json() as Record<string, unknown>;
  const safeBody: Record<string, string> = {};

  for (const [key, value] of Object.entries(body)) {
    if (!allowedKeys.has(key)) {
      return NextResponse.json({ error: `Pengaturan '${key}' tidak dikenali.` }, { status: 400 });
    }
    const longKeys = ["payment_instructions", "faq", "rules", "benefit_prize_details", "benefit_race_pack_contents"];
    const maxLength = longKeys.includes(key) ? 5000 : 500;
    if (typeof value !== "string" || value.length > maxLength) {
      return NextResponse.json({ error: `Nilai '${key}' tidak valid.` }, { status: 400 });
    }
    if (key === "event_date" && !normalizeEventDate(value)) {
      return NextResponse.json({ error: "Tanggal event harus berupa waktu WIB yang valid." }, { status: 400 });
    }
    safeBody[key] = value.trim();
  }

  safeBody.payment_dana_enabled = "false";
  safeBody.payment_dana_number = "";
  safeBody.payment_dana_holder = "";

  if (!Object.keys(safeBody).length) {
    return NextResponse.json({ error: "Tidak ada pengaturan untuk disimpan." }, { status: 400 });
  }

  const { data, error } = await insforge.database.rpc("save_event_settings_atomic_v1", {
    p_event_type: eventType,
    p_settings: safeBody,
  });

  if (error) {
    const detail = JSON.stringify(error);
    const messages: Record<string, string> = {
      SETTINGS_BANK_REQUIRED: "Lengkapi nama bank, nomor rekening, dan nama pemilik rekening.",
      SETTINGS_DANA_REQUIRED: "Lengkapi nomor DANA dan nama akun DANA.",
      SETTINGS_QRIS_REQUIRED: "QRIS aktif memerlukan gambar, NMID, dan nama merchant.",
      SETTINGS_METHOD_REQUIRED: "Aktifkan minimal satu metode pembayaran.",
      SETTINGS_DEADLINE_INVALID: "Batas waktu pembayaran harus 1–168 jam.",
      SETTINGS_FEE_INVALID: "Biaya pendaftaran harus lebih dari nol.",
    };
    const match = Object.entries(messages).find(([marker]) => detail.includes(marker));
    console.error("[POST /api/admin/settings] atomic save failed", error);
    return NextResponse.json(
      { error: match?.[1] ?? "Pengaturan gagal disimpan secara atomik." },
      { status: match ? 400 : 500 },
    );
  }

  void writeActivityLog({
    actorType: "admin",
    actorLabel: session.user.email ?? "admin",
    eventType,
    action: "settings_updated",
    entityType: "event_settings",
    entityId: eventType,
    metadata: {
      keys: Object.keys(safeBody),
    },
  }, req);

  return NextResponse.json({ success: true, updated: data });
}
