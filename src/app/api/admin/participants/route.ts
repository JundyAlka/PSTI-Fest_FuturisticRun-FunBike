import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/adminAuth";
import { insforge } from "@/lib/insforge";
import { writeActivityLog } from "@/lib/serverAudit";

type ParticipantRow = Record<string, unknown> & {
  event_type?: string;
  eventType?: string;
  category?: string;
  payment_status?: string;
  full_name?: string;
  email?: string;
  reg_number?: string;
  created_at?: string;
};

export async function GET(req: NextRequest) {
  const session = await requireAdmin();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = req.nextUrl;
  const page = Math.max(1, parseInt(searchParams.get("page") ?? "1"));
  const limit = Math.min(100, Math.max(1, parseInt(searchParams.get("limit") ?? "20")));
  const category = searchParams.get("category");
  const status = searchParams.get("status");
  const search = searchParams.get("search")?.trim().slice(0, 80);
  const eventType = searchParams.get("eventType") ?? "futuristic-run";

  const from = (page - 1) * limit;

  const { data: allRows, error } = await insforge.database
    .from("participants")
    .select("*");

  if (error) {
    console.error("[admin/participants]", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }

  let list = (allRows ?? []) as ParticipantRow[];

  if (eventType && eventType !== "all") {
    list = list.filter((p) => (p.event_type ?? p.eventType ?? "futuristic-run") === eventType);
  }
  if (category && category !== "all") {
    list = list.filter((p) => p.category === category);
  }
  if (status && status !== "all") {
    list = list.filter((p) => p.payment_status === status);
  }
  if (search) {
    const q = search.toLowerCase();
    list = list.filter((p) =>
      String(p.full_name ?? "").toLowerCase().includes(q) ||
      String(p.email ?? "").toLowerCase().includes(q) ||
      String(p.reg_number ?? "").toLowerCase().includes(q)
    );
  }

  list.sort((a, b) => new Date(b.created_at || 0).getTime() - new Date(a.created_at || 0).getTime());

  const total = list.length;
  const participants = list.slice(from, from + limit);

  return NextResponse.json({
    participants,
    meta: { total, page, limit, pages: Math.ceil(total / limit) },
  });
}

export async function DELETE(req: NextRequest) {
  const session = await requireAdmin();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = req.nextUrl;
  const idParam = searchParams.get("id");
  const body = await req.json().catch(() => ({}));
  const ids: number[] = Array.isArray(body?.ids) ? body.ids : (idParam ? [Number(idParam)] : []);

  if (ids.length === 0) {
    return NextResponse.json({ error: "ID peserta tidak ditemukan" }, { status: 400 });
  }

  const { error } = await insforge.database
    .from("participants")
    .delete()
    .in("id", ids);

  if (error) {
    console.error("[admin/participants DELETE]", error);
    return NextResponse.json({ error: "Gagal menghapus peserta" }, { status: 500 });
  }

  void writeActivityLog({
    actorType: "admin",
    actorLabel: session.user.email ?? "admin",
    action: "participants_deleted",
    entityType: "participants",
    entityId: ids.join(","),
    metadata: { ids, deletedCount: ids.length },
  }, req);

  return NextResponse.json({ success: true, deletedCount: ids.length });
}
