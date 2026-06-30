import { NextRequest, NextResponse } from "next/server";
import { insforge } from "@/lib/insforge";
import { normalizePricingEvent, type PricingSnapshot } from "@/lib/pricing";
import { rateLimitOr429 } from "@/lib/rateLimit";

export async function GET(req: NextRequest) {
  const rateLimit = rateLimitOr429(req, "pricing", 60, 60_000);
  if (!rateLimit.allowed) return rateLimit.response;

  const eventType = normalizePricingEvent(req.nextUrl.searchParams.get("event"));
  if (!eventType) {
    return NextResponse.json({ error: "Event tidak valid" }, { status: 400 });
  }

  const { data, error } = await insforge.database.rpc("get_current_pricing_v1", {
    p_event_type: eventType,
  });
  if (error || !data) {
    console.error("[GET /api/pricing]", error);
    return NextResponse.json({ error: "Harga sementara tidak tersedia" }, { status: 503 });
  }

  return NextResponse.json(data as PricingSnapshot, {
    headers: { "Cache-Control": "no-store" },
  });
}
