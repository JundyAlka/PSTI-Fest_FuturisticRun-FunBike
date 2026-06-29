import { NextRequest, NextResponse } from "next/server";
import { insforge } from "@/lib/insforge";
import { getEventCategories } from "@/lib/utils";
import { rateLimitOr429 } from "@/lib/rateLimit";
import { checkInsforgeHealth, serviceUnavailable } from "@/lib/insforgeHealth";

export async function GET(req: NextRequest) {
  try {
    const rl = rateLimitOr429(req, "quota", 30, 60_000);
    if (!rl.allowed) return rl.response;

    const health = await checkInsforgeHealth();
    if (!health.ok) return serviceUnavailable("Informasi kuota sementara tidak tersedia. Coba lagi beberapa saat.");

    const eventType = req.nextUrl.searchParams.get("eventType") ?? "futuristic-run";

    // Get categories from DB
    const categories = await getEventCategories(eventType);

    const result: Record<string, { total: number; filled: number; remaining: number }> = {};

    for (const cat of categories) {
      // Count participants not rejected
      const { data: participants, error } = await insforge.database
        .from("participants")
        .select("id", { count: "exact" })
        .eq("event_type", eventType)
        .eq("category", cat.code)
        .neq("payment_status", "rejected");

      if (error) throw error;

      const filled = participants?.length ?? 0;
      const total = cat.quota ?? 200;
      result[cat.code] = { total, filled, remaining: Math.max(0, total - filled) };
    }

    return NextResponse.json(result);
  } catch (err) {
    console.error("[GET /api/quota]", err);
    return serviceUnavailable("Informasi kuota sementara tidak tersedia. Coba lagi beberapa saat.");
  }
}
