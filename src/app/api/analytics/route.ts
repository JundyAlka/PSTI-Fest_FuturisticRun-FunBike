import { NextRequest, NextResponse } from "next/server";
import { insforge } from "@/lib/insforge";
import { writeActivityLog } from "@/lib/serverAudit";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { event, eventType, meta, ts, url, ref } = body;

    if (!event || !eventType) {
      return NextResponse.json({ error: "Missing event or eventType" }, { status: 400 });
    }

    // Insert into analytics_events table (must be created in InsForge)
    await insforge.database.from("analytics_events").insert([
      {
        event_name: event,
        event_type: eventType,
        meta: meta ? JSON.stringify(meta) : null,
        page_url: url ?? null,
        referrer: ref ?? null,
        created_at: ts ? new Date(ts).toISOString() : new Date().toISOString(),
      },
    ]);

    void writeActivityLog({
      actorType: "visitor",
      actorLabel: typeof meta?.regNumber === "string" ? meta.regNumber : undefined,
      eventType,
      action: `analytics_${event}`,
      entityType: "analytics_event",
      pageUrl: url ?? null,
      metadata: {
        ...(meta && typeof meta === "object" ? meta : {}),
        referrer: ref ?? null,
      },
    }, req);

    return NextResponse.json({ ok: true });
  } catch (err) {
    // Silently fail — analytics should never return errors to client
    console.error("[analytics] Error:", err);
    return NextResponse.json({ ok: true });
  }
}
