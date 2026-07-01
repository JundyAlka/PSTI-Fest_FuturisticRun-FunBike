import { NextRequest, NextResponse } from "next/server";
import { insforge } from "@/lib/insforge";
import { getClientIp, writeActivityLog } from "@/lib/serverAudit";

function deviceType(userAgent: string) {
  const ua = userAgent.toLowerCase();
  if (/ipad|tablet/.test(ua)) return "tablet";
  if (/mobi|android|iphone/.test(ua)) return "mobile";
  return "desktop";
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const sessionId = String(body.sessionId ?? "").slice(0, 120);
    const eventType = String(body.eventType ?? "hub").slice(0, 40);
    const path = String(body.path ?? "/").slice(0, 500);
    const referrer = String(body.referrer ?? "").slice(0, 500);

    if (!sessionId) return NextResponse.json({ ok: true });

    const now = new Date().toISOString();
    const userAgent = req.headers.get("user-agent") ?? "";
    const ip = getClientIp(req);
    const metadata = {
      screen: typeof body.screen === "string" ? body.screen.slice(0, 40) : null,
      timezone: typeof body.timezone === "string" ? body.timezone.slice(0, 80) : null,
    };

    const { data: existing } = await insforge.database
      .from("visitor_sessions")
      .select("session_id, page_views, current_path")
      .eq("session_id", sessionId)
      .maybeSingle();

    if (existing) {
      await insforge.database
        .from("visitor_sessions")
        .update({
          last_seen_at: now,
          event_type: eventType,
          current_path: path,
          referrer: referrer || null,
          ip_address: ip,
          user_agent: userAgent || null,
          device_type: deviceType(userAgent),
          page_views: Number(existing.page_views ?? 0) + (existing.current_path === path ? 0 : 1),
          metadata,
        })
        .eq("session_id", sessionId);
    } else {
      await insforge.database.from("visitor_sessions").insert([
        {
          session_id: sessionId,
          first_seen_at: now,
          last_seen_at: now,
          event_type: eventType,
          current_path: path,
          referrer: referrer || null,
          ip_address: ip,
          user_agent: userAgent || null,
          device_type: deviceType(userAgent),
          page_views: 1,
          metadata,
        },
      ]);
      void writeActivityLog({
        actorType: "visitor",
        actorLabel: sessionId,
        eventType,
        action: "visitor_first_seen",
        entityType: "visitor_session",
        entityId: sessionId,
        pageUrl: path,
        metadata,
      }, req);
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("[visitor heartbeat]", error);
    return NextResponse.json({ ok: true });
  }
}
