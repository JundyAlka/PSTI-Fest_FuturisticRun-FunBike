import { NextRequest, NextResponse } from "next/server";
import { insforge } from "@/lib/insforge";
import { getEventCategories } from "@/lib/utils";

export async function GET(req: NextRequest) {
  try {
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
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
