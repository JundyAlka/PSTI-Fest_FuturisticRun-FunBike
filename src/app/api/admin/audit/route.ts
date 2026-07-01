import { NextRequest, NextResponse } from "next/server";
import Papa from "papaparse";
import { requireAdmin } from "@/lib/adminAuth";
import { insforge } from "@/lib/insforge";
import { writeActivityLog } from "@/lib/serverAudit";

export async function GET(req: NextRequest) {
  const session = await requireAdmin();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = req.nextUrl;
  const format = searchParams.get("format") ?? "json";
  const eventType = searchParams.get("eventType") ?? "all";
  const action = searchParams.get("action") ?? "all";
  const limit = Math.min(5000, Math.max(50, Number(searchParams.get("limit") ?? "1000") || 1000));

  let query = insforge.database
    .from("activity_logs")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(limit);

  if (eventType !== "all") query = query.eq("event_type", eventType);
  if (action !== "all") query = query.eq("action", action);

  const { data, error } = await query;
  if (error) return NextResponse.json({ error: "Log audit gagal dimuat" }, { status: 500 });

  const rows = (data ?? []).map((row) => ({
    "Waktu": row.created_at ? new Date(row.created_at).toLocaleString("id-ID") : "",
    "Aktor": row.actor_label ?? row.actor_type,
    "Tipe Aktor": row.actor_type,
    "Event": row.event_type ?? "-",
    "Aksi": row.action,
    "Entitas": row.entity_type ?? "-",
    "ID Entitas": row.entity_id ?? "-",
    "Halaman": row.page_url ?? "-",
    "IP": row.ip_address ?? "-",
    "User Agent": row.user_agent ?? "-",
    "Metadata": typeof row.metadata === "string" ? row.metadata : JSON.stringify(row.metadata ?? {}),
  }));

  if (format === "csv") {
    void writeActivityLog({
      actorType: "admin",
      actorLabel: session.user.email ?? "admin",
      eventType: eventType === "all" ? null : eventType,
      action: "audit_exported",
      entityType: "activity_logs",
      entityId: eventType,
      metadata: { actionFilter: action, rowCount: rows.length },
    }, req);

    return new NextResponse(Papa.unparse(rows, { quotes: true }), {
      status: 200,
      headers: {
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition": `attachment; filename="audit-aktivitas-${Date.now()}.csv"`,
      },
    });
  }

  return NextResponse.json({ logs: data ?? [] });
}
