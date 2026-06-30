import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/adminAuth";
import { insforge } from "@/lib/insforge";
import { getEventCategories, getEventInfo } from "@/lib/utils";

/**
 * GET /api/admin/stats
 *
 * Returns comprehensive per-event + total aggregated stats.
 * Query params:
 *   - dateFrom (ISO string, optional) – filter registrations from this date
 *   - dateTo   (ISO string, optional) – filter registrations until this date
 *   - days     (number, default 30) – how many days of daily time series
 *
 * Shape: { events: EventStats[], total: TotalStats }
 */

type CategoryStats = {
  code: string;
  label: string;
  count: number;
  verified: number;
  pending: number;
  rejected: number;
  quota: number;
  filled: number;
  remaining: number;
  fillPercent: number;
  price: number;
};

type JerseySizeCount = { size: string; count: number };
type DailyPoint = { date: string; count: number };

type EventStats = {
  slug: string;
  name: string;
  isOpen: boolean;
  count: number;
  verified: number;
  pending: number;
  rejected: number;
  totalQuota: number;
  totalFilled: number;
  totalRemaining: number;
  fillPercent: number;
  finance: {
    potential: number;
    verified: number;
    outstanding: number;
  };
  presaleRemaining: number;
  categories: CategoryStats[];
  jerseySizes: JerseySizeCount[];
  daily: DailyPoint[];
};

type TotalStats = {
  count: number;
  verified: number;
  pending: number;
  rejected: number;
  totalQuota: number;
  totalFilled: number;
  totalRemaining: number;
  fillPercent: number;
  finance: {
    potential: number;
    verified: number;
    outstanding: number;
  };
  daily: DailyPoint[];
};

export async function GET(req: NextRequest) {
  const session = await requireAdmin();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = req.nextUrl;
  const dateFrom = searchParams.get("dateFrom") ?? undefined;
  const dateTo = searchParams.get("dateTo") ?? undefined;
  const days = Math.min(90, Math.max(7, parseInt(searchParams.get("days") ?? "30")));

  // Discover events from DB
  const { data: dbEvents } = await insforge.database
    .from("events")
    .select("slug, name, is_open")
    .order("id", { ascending: true });

  const eventSlugs: Array<{ slug: string; name: string; isOpen: boolean }> =
    (dbEvents ?? []).map((e: { slug: string; name: string; is_open: boolean }) => ({
      slug: e.slug,
      name: e.name,
      isOpen: e.is_open,
    }));

  // Fallback if DB has no events
  if (eventSlugs.length === 0) {
    eventSlugs.push(
      { slug: "futuristic-run", name: "Futuristic Run", isOpen: true },
      { slug: "fun-bike", name: "Futuristic Bike", isOpen: true }
    );
  }

  // Fetch all participants at once (non-rejected counted for quota)
  let participantsQuery = insforge.database
    .from("participants")
    .select("id, event_type, category, jersey_size, payment_status, payment_amount, created_at");

  if (dateFrom) participantsQuery = participantsQuery.gte("created_at", dateFrom);
  if (dateTo) participantsQuery = participantsQuery.lte("created_at", dateTo);

  const { data: allParticipants, error: pErr } = await participantsQuery;
  if (pErr) {
    console.error("[admin/stats] participants fetch error:", pErr);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }

  const participants = (allParticipants ?? []) as Array<{
    id: number;
    event_type: string;
    category: string;
    jersey_size: string;
    payment_status: string;
    payment_amount: number;
    created_at: string;
  }>;

  // Presale settings
  const { data: presaleSettings } = await insforge.database
    .from("event_settings")
    .select("event_type, key, value")
    .in("key", ["presale_quota", "presale_used"]);

  const presaleMap: Record<string, { quota: number; used: number }> = {};
  for (const s of (presaleSettings ?? []) as Array<{ event_type: string; key: string; value: string }>) {
    if (!presaleMap[s.event_type]) presaleMap[s.event_type] = { quota: 100, used: 0 };
    if (s.key === "presale_quota") presaleMap[s.event_type].quota = parseInt(s.value) || 100;
    if (s.key === "presale_used") presaleMap[s.event_type].used = parseInt(s.value) || 0;
  }

  // Daily time series template
  const buildDailyMap = (): Record<string, number> => {
    const map: Record<string, number> = {};
    for (let i = 0; i < days; i++) {
      const d = new Date();
      d.setDate(d.getDate() - (days - 1 - i));
      const key = d.toISOString().slice(0, 10);
      map[key] = 0;
    }
    return map;
  };

  const totalDailyMap = buildDailyMap();

  // Process per event
  const eventStatsArr: EventStats[] = await Promise.all(
    eventSlugs.map(async (evt) => {
      const eventParticipants = participants.filter((p) => p.event_type === evt.slug);

      const count = eventParticipants.length;
      const verified = eventParticipants.filter((p) => p.payment_status === "verified").length;
      const pending = eventParticipants.filter((p) => p.payment_status === "pending").length;
      const rejected = eventParticipants.filter((p) => p.payment_status === "rejected").length;

      // Finance
      const potential = eventParticipants
        .filter((p) => p.payment_status !== "rejected")
        .reduce((sum, p) => sum + (p.payment_amount ?? 0), 0);
      const verifiedFinance = eventParticipants
        .filter((p) => p.payment_status === "verified")
        .reduce((sum, p) => sum + (p.payment_amount ?? 0), 0);
      const outstanding = eventParticipants
        .filter((p) => p.payment_status === "pending")
        .reduce((sum, p) => sum + (p.payment_amount ?? 0), 0);

      // Categories
      const dbCategories = await getEventCategories(evt.slug);
      const dbInfo = await getEventInfo(evt.slug);
      const categories: CategoryStats[] = dbCategories.map((cat) => {
        const catParticipants = eventParticipants.filter((p) => p.category === cat.code);
        const catCount = catParticipants.length;
        const catVerified = catParticipants.filter((p) => p.payment_status === "verified").length;
        const catPending = catParticipants.filter((p) => p.payment_status === "pending").length;
        const catRejected = catParticipants.filter((p) => p.payment_status === "rejected").length;
        const filled = catParticipants.filter((p) => p.payment_status !== "rejected").length;
        const remaining = Math.max(0, cat.quota - filled);
        return {
          code: cat.code,
          label: cat.label,
          count: catCount,
          verified: catVerified,
          pending: catPending,
          rejected: catRejected,
          quota: cat.quota,
          filled,
          remaining,
          fillPercent: cat.quota > 0 ? Math.round((filled / cat.quota) * 100) : 0,
          price: cat.price,
        };
      });

      const totalQuota = categories.reduce((s, c) => s + c.quota, 0);
      const totalFilled = categories.reduce((s, c) => s + c.filled, 0);
      const totalRemaining = Math.max(0, totalQuota - totalFilled);

      // Jersey sizes
      const jerseySizeMap: Record<string, number> = {};
      for (const p of eventParticipants) {
        const s = p.jersey_size ?? "?";
        jerseySizeMap[s] = (jerseySizeMap[s] ?? 0) + 1;
      }
      const jerseySizes: JerseySizeCount[] = Object.entries(jerseySizeMap)
        .map(([size, cnt]) => ({ size, count: cnt }))
        .sort((a, b) => b.count - a.count);

      // Daily
      const dailyMap = buildDailyMap();
      for (const p of eventParticipants) {
        const key = new Date(p.created_at).toISOString().slice(0, 10);
        if (key in dailyMap) dailyMap[key]++;
        if (key in totalDailyMap) totalDailyMap[key]++;
      }
      const daily: DailyPoint[] = Object.entries(dailyMap).map(([date, cnt]) => ({
        date,
        count: cnt,
      }));

      // Presale
      const ps = presaleMap[evt.slug];
      const presaleRemaining = ps ? Math.max(0, ps.quota - ps.used) : 0;

      return {
        slug: evt.slug,
        name: dbInfo?.name ?? evt.name,
        isOpen: dbInfo?.is_open ?? evt.isOpen,
        count,
        verified,
        pending,
        rejected,
        totalQuota,
        totalFilled,
        totalRemaining,
        fillPercent: totalQuota > 0 ? Math.round((totalFilled / totalQuota) * 100) : 0,
        finance: {
          potential,
          verified: verifiedFinance,
          outstanding,
        },
        presaleRemaining,
        categories,
        jerseySizes,
        daily,
      };
    })
  );

  // Aggregate total
  const totalDaily: DailyPoint[] = Object.entries(totalDailyMap).map(([date, cnt]) => ({
    date,
    count: cnt,
  }));

  const total: TotalStats = {
    count: eventStatsArr.reduce((s, e) => s + e.count, 0),
    verified: eventStatsArr.reduce((s, e) => s + e.verified, 0),
    pending: eventStatsArr.reduce((s, e) => s + e.pending, 0),
    rejected: eventStatsArr.reduce((s, e) => s + e.rejected, 0),
    totalQuota: eventStatsArr.reduce((s, e) => s + e.totalQuota, 0),
    totalFilled: eventStatsArr.reduce((s, e) => s + e.totalFilled, 0),
    totalRemaining: eventStatsArr.reduce((s, e) => s + e.totalRemaining, 0),
    fillPercent: 0,
    finance: {
      potential: eventStatsArr.reduce((s, e) => s + e.finance.potential, 0),
      verified: eventStatsArr.reduce((s, e) => s + e.finance.verified, 0),
      outstanding: eventStatsArr.reduce((s, e) => s + e.finance.outstanding, 0),
    },
    daily: totalDaily,
  };
  total.fillPercent = total.totalQuota > 0 ? Math.round((total.totalFilled / total.totalQuota) * 100) : 0;

  return NextResponse.json({ events: eventStatsArr, total });
}
