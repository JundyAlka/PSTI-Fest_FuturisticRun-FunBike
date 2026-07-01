import { NextRequest } from "next/server";
import { insforge } from "@/lib/insforge";

type AuditPayload = {
  actorType: "visitor" | "participant" | "admin" | "system";
  actorLabel?: string | null;
  eventType?: string | null;
  action: string;
  entityType?: string | null;
  entityId?: string | number | null;
  pageUrl?: string | null;
  metadata?: Record<string, unknown>;
};

function requestIp(req?: NextRequest) {
  return req?.headers.get("x-forwarded-for")?.split(",")[0]?.trim()
    ?? req?.headers.get("x-real-ip")
    ?? null;
}

export async function writeActivityLog(payload: AuditPayload, req?: NextRequest) {
  try {
    await insforge.database.from("activity_logs").insert([
      {
        actor_type: payload.actorType,
        actor_label: payload.actorLabel ?? null,
        event_type: payload.eventType ?? null,
        action: payload.action,
        entity_type: payload.entityType ?? null,
        entity_id: payload.entityId == null ? null : String(payload.entityId),
        page_url: payload.pageUrl ?? req?.nextUrl.pathname ?? null,
        ip_address: requestIp(req),
        user_agent: req?.headers.get("user-agent") ?? null,
        metadata: payload.metadata ?? {},
      },
    ]);
  } catch (error) {
    console.error("[audit] activity log failed", error);
  }
}

export function getClientIp(req: NextRequest) {
  return requestIp(req);
}
