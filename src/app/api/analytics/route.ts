import { NextRequest, NextResponse } from "next/server";
import { insforge } from "@/lib/insforge";

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

    return NextResponse.json({ ok: true });
  } catch (err) {
    // Silently fail — analytics should never return errors to client
    console.error("[analytics] Error:", err);
    return NextResponse.json({ ok: true });
  }
}
