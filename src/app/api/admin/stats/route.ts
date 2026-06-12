import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { insforge } from "@/lib/insforge";
import { getEventCategories } from "@/lib/utils";

export async function GET(req: NextRequest) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const eventType = req.nextUrl.searchParams.get("eventType") ?? "futuristic-run";

  // Get categories from DB
  const dbCategories = await getEventCategories(eventType);
  const categories = dbCategories.map((c) => c.code);

  const countRows = async (status?: string, category?: string) => {
    let query = insforge.database
      .from("participants")
      .select("*", { count: "exact", head: true })
      .eq("event_type", eventType);

    if (status) query = query.eq("payment_status", status);
    if (category) query = query.eq("category", category);

    const { count, error } = await query;
    if (error) throw error;
    return count ?? 0;
  };

  const [total, verified, pending, rejected, byCatFull] = await Promise.all([
    countRows(),
    countRows("verified"),
    countRows("pending"),
    countRows("rejected"),
    Promise.all(categories.map(async (cat) => ({
      category: cat,
      count: await countRows(undefined, cat),
      verified: await countRows("verified", cat),
    }))),
  ]);

  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 6);
  sevenDaysAgo.setHours(0, 0, 0, 0);

  const { data: recentRows, error: recentError } = await insforge.database
    .from("participants")
    .select("created_at")
    .eq("event_type", eventType)
    .gte("created_at", sevenDaysAgo.toISOString());

  if (recentError) throw recentError;

  const dailyMap: Record<string, number> = {};
  for (let i = 0; i < 7; i++) {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    const key = d.toLocaleDateString("id-ID", { day: "2-digit", month: "short" });
    dailyMap[key] = 0;
  }
  for (const r of recentRows ?? []) {
    const key = new Date(r.created_at).toLocaleDateString("id-ID", { day: "2-digit", month: "short" });
    if (key in dailyMap) dailyMap[key]++;
  }
  const daily = Object.entries(dailyMap).map(([date, count]) => ({ date, count }));

  return NextResponse.json({ total, verified, pending, rejected, byCat: byCatFull, daily });
}
