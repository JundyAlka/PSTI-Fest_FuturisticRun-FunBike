import { NextRequest, NextResponse } from "next/server";
import { insforge } from "@/lib/insforge";
import { rateLimitOr429 } from "@/lib/rateLimit";
import { resolveEventDate, type EventDateSlug } from "@/lib/eventDate";

const PAYMENT_TIMEOUT_MS = 8_000;
const PAYMENT_SETTING_KEYS = [
  "payment_bank_name",
  "payment_bank_account",
  "payment_bank_holder",
  "payment_dana_number",
  "payment_dana_holder",
  "payment_dana_enabled",
  "payment_qris_nmid",
  "payment_qris_merchant_name",
  "payment_qris_image_url",
  "payment_instructions",
  "payment_deadline_hours",
  "registration_fee",
  "payment_transfer_enabled",
  "payment_qris_enabled",
  "event_date",
  "event_location",
] as const;

type PaymentInfoResponse = {
  methods: Array<"bank" | "dana" | "qris">;
  bank: { enabled: boolean; name: string; account: string; holder: string };
  dana: { enabled: boolean; number: string; holder: string };
  qris: { enabled: boolean; nmid: string; imageUrl: string; merchantName: string };
  bankName: string;
  bankAccount: string;
  bankHolder: string;
  qrisNmid: string;
  qrisImageUrl: string;
  registrationFee: number;
  transferEnabled: boolean;
  qrisEnabled: boolean;
  eventDate: string;
  eventLocation: string;
  generalInstructions: string;
  paymentDeadlineHours: number;
  source: "database" | "cache" | "default";
  warning?: string;
};

const paymentCache = new Map<EventDateSlug, PaymentInfoResponse>();

function defaults(eventType: EventDateSlug): PaymentInfoResponse {
  const bank = { enabled: true, name: "BRI", account: "007801112841503", holder: "SYIFA FITRIYANTI" };
  const dana = { enabled: false, number: "", holder: "" };
  const qris = {
    enabled: true,
    nmid: "ID1026540800533",
    imageUrl: "/qris-payment.png",
    merchantName: "FUTURISTIC VIBES, HIBURAN",
  };
  return {
    methods: ["bank", "qris"],
    bank,
    dana,
    qris,
    bankName: bank.name,
    bankAccount: bank.account,
    bankHolder: bank.holder,
    qrisNmid: qris.nmid,
    qrisImageUrl: qris.imageUrl,
    registrationFee: eventType === "fun-bike" ? 150_000 : 120_000,
    transferEnabled: bank.enabled,
    qrisEnabled: qris.enabled,
    eventDate: resolveEventDate(eventType, null),
    eventLocation: "-",
    generalInstructions: "Transfer ke rekening resmi, simpan bukti pembayaran, lalu unggah bukti untuk diverifikasi panitia.",
    paymentDeadlineHours: 24,
    source: "default",
  };
}

async function withTimeout<T>(operation: PromiseLike<T>): Promise<T> {
  let timer: ReturnType<typeof setTimeout> | undefined;
  try {
    return await Promise.race([
      Promise.resolve(operation),
      new Promise<never>((_, reject) => {
        timer = setTimeout(() => reject(new Error("PAYMENT_INFO_TIMEOUT")), PAYMENT_TIMEOUT_MS);
      }),
    ]);
  } finally {
    if (timer) clearTimeout(timer);
  }
}

async function loadSettings(eventType: EventDateSlug) {
  let lastError: unknown;
  for (let attempt = 0; attempt < 2; attempt += 1) {
    try {
      const [settingsResult, categoryResult] = await withTimeout(Promise.all([
        insforge.database
          .from("event_settings")
          .select("key, value")
          .eq("event_type", eventType)
          .in("key", [...PAYMENT_SETTING_KEYS]),
        insforge.database.rpc("get_current_pricing_v1", { p_event_type: eventType }),
      ]));
      if (settingsResult.error) throw settingsResult.error;
      if (categoryResult.error) throw categoryResult.error;
      const rawPricing = categoryResult.data as { currentPrice?: number } | Array<{ currentPrice?: number }> | null;
      const pricing = Array.isArray(rawPricing) ? rawPricing[0] ?? null : rawPricing;
      return { settings: settingsResult.data ?? [], activePrice: pricing?.currentPrice };
    } catch (error) {
      lastError = error;
    }
  }
  throw lastError;
}

function fromSettings(
  eventType: EventDateSlug,
  settings: Array<{ key: string; value: string }>,
  activePrice?: number,
): PaymentInfoResponse {
  const fallback = defaults(eventType);
  const map = Object.fromEntries(settings.map((setting) => [setting.key, setting.value]));
  const bankName = map.payment_bank_name || fallback.bank.name;
  const bankAccount = map.payment_bank_account || fallback.bank.account;
  const bankHolder = map.payment_bank_holder || fallback.bank.holder;
  const bank = {
    enabled: map.payment_transfer_enabled === "true" && Boolean(bankName && bankAccount && bankHolder),
    name: bankName,
    account: bankAccount,
    holder: bankHolder,
  };
  const dana = {
    enabled: false,
    number: "",
    holder: "",
  };
  const qris = {
    enabled: map.payment_qris_enabled === "true" && Boolean((map.payment_qris_nmid || fallback.qris.nmid) && (map.payment_qris_image_url || fallback.qris.imageUrl) && (map.payment_qris_merchant_name || map.payment_bank_holder || fallback.qris.merchantName)),
    nmid: map.payment_qris_nmid || fallback.qris.nmid,
    imageUrl: map.payment_qris_image_url || fallback.qris.imageUrl,
    merchantName: map.payment_qris_merchant_name || map.payment_bank_holder || fallback.qris.merchantName,
  };
  const parsedFee = Number.parseInt(map.registration_fee ?? "", 10);
  const methods: PaymentInfoResponse["methods"] = [];
  if (bank.enabled) methods.push("bank");
  if (qris.enabled) methods.push("qris");

  return {
    methods,
    bank,
    dana,
    qris,
    bankName: bank.name,
    bankAccount: bank.account,
    bankHolder: bank.holder,
    qrisNmid: qris.nmid,
    qrisImageUrl: qris.imageUrl,
    registrationFee: Number.isFinite(activePrice) && Number(activePrice) > 0
      ? Number(activePrice)
      : Number.isFinite(parsedFee) && parsedFee > 0 ? parsedFee : fallback.registrationFee,
    transferEnabled: bank.enabled,
    qrisEnabled: qris.enabled,
    eventDate: resolveEventDate(eventType, map.event_date),
    eventLocation: map.event_location || "-",
    generalInstructions: map.payment_instructions || fallback.generalInstructions,
    paymentDeadlineHours: Math.min(168, Math.max(1, Number.parseInt(map.payment_deadline_hours ?? "24", 10) || 24)),
    source: "database",
  };
}

export async function GET(req: NextRequest) {
  const requestedEventType = req.nextUrl.searchParams.get("eventType");
  const eventType: EventDateSlug = requestedEventType === "fun-bike" ? "fun-bike" : "futuristic-run";
  const rateLimit = rateLimitOr429(req, "payment-info", 30, 60_000);

  if (!rateLimit.allowed) {
    return NextResponse.json(
      { ...defaults(eventType), warning: "Terlalu banyak permintaan. Menampilkan data default." },
      { headers: { "Cache-Control": "no-store" } },
    );
  }

  try {
    const { settings, activePrice } = await loadSettings(eventType);
    const response = fromSettings(eventType, settings, activePrice);
    paymentCache.set(eventType, response);
    return NextResponse.json(response, { headers: { "Cache-Control": "public, max-age=60, stale-while-revalidate=300" } });
  } catch (error) {
    console.error("[GET /api/payment-info] using fallback", error);
    const cached = paymentCache.get(eventType);
    return NextResponse.json({
      ...(cached ?? defaults(eventType)),
      source: cached ? "cache" : "default",
      warning: "Data pembayaran terbaru belum tersedia. Hubungi panitia jika informasi tidak lengkap.",
    });
  }
}
