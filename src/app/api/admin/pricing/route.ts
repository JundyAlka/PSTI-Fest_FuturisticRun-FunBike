import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/adminAuth";
import { insforge } from "@/lib/insforge";
import { normalizePricingEvent, type PricingTier } from "@/lib/pricing";

export async function GET(req: NextRequest) {
  if (!await requireAdmin()) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const eventType = normalizePricingEvent(req.nextUrl.searchParams.get("event"));
  if (!eventType) return NextResponse.json({ error: "Event tidak valid" }, { status: 400 });

  const { data, error } = await insforge.database.rpc("get_current_pricing_v1", { p_event_type: eventType });
  if (error) return NextResponse.json({ error: "Tier harga gagal dimuat" }, { status: 500 });
  return NextResponse.json(data);
}

export async function POST(req: NextRequest) {
  if (!await requireAdmin()) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const eventType = normalizePricingEvent(req.nextUrl.searchParams.get("event"));
  if (!eventType) return NextResponse.json({ error: "Event tidak valid" }, { status: 400 });

  const body = await req.json() as { tiers?: PricingTier[] };
  if (!Array.isArray(body.tiers) || !body.tiers.length || body.tiers.length > 10) {
    return NextResponse.json({ error: "Data tier tidak valid" }, { status: 400 });
  }

  for (const tier of body.tiers) {
    if (!tier.id || !tier.label || !Number.isInteger(tier.price) || tier.price <= 0
      || !Number.isInteger(tier.quota) || tier.quota < 0 || !Number.isInteger(tier.order) || tier.order <= 0
      || typeof tier.active !== "boolean") {
      return NextResponse.json({ error: `Tier '${tier.id || "unknown"}' tidak valid` }, { status: 400 });
    }
  }

  const { data, error } = await insforge.database.rpc("save_pricing_tiers_atomic_v1", {
    p_event_type: eventType,
    p_tiers: body.tiers,
  });
  if (error) {
    const detail = JSON.stringify(error);
    const message = detail.includes("PRICING_QUOTA_TOO_LOW")
      ? "Total kuota tier aktif harus mencakup seluruh kuota event."
      : "Tier harga gagal disimpan secara atomik.";
    return NextResponse.json({ error: message }, { status: 400 });
  }

  return NextResponse.json({ success: true, updated: data });
}
