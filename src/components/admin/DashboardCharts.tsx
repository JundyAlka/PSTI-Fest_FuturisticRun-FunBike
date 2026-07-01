"use client";
import {
  ResponsiveContainer, LineChart, Line, BarChart, Bar, PieChart, Pie,
  XAxis, YAxis, Tooltip, CartesianGrid, Cell, Legend,
} from "recharts";

/* ── Types ──────────────────────────────────────────────────────── */
interface CategoryStats {
  code: string; label: string; count: number; verified: number;
  pending: number; rejected: number; quota: number; filled: number;
  remaining: number; fillPercent: number; price: number;
}
interface JerseySize { size: string; count: number }
interface DailyPoint { date: string; count: number }
interface EventStats {
  slug: string; name: string; isOpen: boolean;
  count: number; verified: number; pending: number; rejected: number;
  totalQuota: number; totalFilled: number; totalRemaining: number; fillPercent: number;
  finance: { potential: number; verified: number; outstanding: number };
  presaleRemaining: number; categories: CategoryStats[];
  jerseySizes: JerseySize[]; daily: DailyPoint[];
}
interface TotalStats {
  count: number; verified: number; pending: number; rejected: number;
  totalQuota: number; totalFilled: number; totalRemaining: number; fillPercent: number;
  finance: { potential: number; verified: number; outstanding: number };
  daily: DailyPoint[];
}

interface Props {
  events: EventStats[];
  total: TotalStats;
  filter: string;
}

/* ── Colors ─────────────────────────────────────────────────────── */
const EVENT_LINE_COLORS = ["#00E5FF", "#FF6B2C", "#8B00FF", "#FFD700"];
const STATUS_COLORS: Record<string, string> = {
  Verified: "#4ADE80",
  Pending: "#FF8C00",
  Rejected: "#FF006E",
};
const JERSEY_COLORS = ["#00E5FF", "#8B00FF", "#FF6B2C", "#FFD700", "#4ADE80", "#FF006E"];
const CATEGORY_COLORS = ["#00E5FF", "#8B00FF", "#FF6B2C", "#FFD700", "#4ADE80"];

const OFont = { fontFamily: "Orbitron, sans-serif" };

const tooltipStyle = {
  contentStyle: {
    background: "rgba(15, 21, 53, 0.95)",
    border: "1px solid #1E3A5F",
    borderRadius: 12,
    color: "#fff",
    fontSize: 12,
  },
  itemStyle: { color: "#B0C4DE" },
  labelStyle: { color: "#fff", fontWeight: 700 },
};

function formatShortDate(dateStr: string) {
  const d = new Date(dateStr);
  return d.toLocaleDateString("id-ID", { day: "2-digit", month: "short" });
}

export default function DashboardCharts({ events, total, filter }: Props) {
  /* Daily line data: merge all events by date */
  const dailyLineData = (() => {
    if (filter !== "all" || events.length <= 1) {
      const source = events[0]?.daily ?? total.daily;
      return source.map((d) => ({ date: formatShortDate(d.date), count: d.count }));
    }
    const dateMap: Record<string, Record<string, number>> = {};
    for (const ev of events) {
      for (const d of ev.daily) {
        const key = formatShortDate(d.date);
        if (!dateMap[key]) dateMap[key] = {};
        dateMap[key][ev.slug] = d.count;
      }
    }
    return Object.entries(dateMap).map(([date, vals]) => ({ date, ...vals }));
  })();

  /* Category bar data */
  const categoryData = (() => {
    const all: CategoryStats[] = events.flatMap((e) => e.categories);
    const map: Record<string, { label: string; count: number; filled: number; quota: number }> = {};
    for (const c of all) {
      if (!map[c.code]) map[c.code] = { label: c.label, count: 0, filled: 0, quota: 0 };
      map[c.code].count += c.count;
      map[c.code].filled += c.filled;
      map[c.code].quota += c.quota;
    }
    return Object.values(map);
  })();

  /* Jersey bar data */
  const jerseyData = (() => {
    const map: Record<string, number> = {};
    for (const ev of events) {
      for (const j of ev.jerseySizes) {
        map[j.size] = (map[j.size] ?? 0) + j.count;
      }
    }
    const order = ["XS", "S", "M", "L", "XL", "XXL", "XXXL"];
    return Object.entries(map)
      .map(([size, count]) => ({ size, count }))
      .sort((a, b) => {
        const ai = order.indexOf(a.size);
        const bi = order.indexOf(b.size);
        if (ai !== -1 && bi !== -1) return ai - bi;
        if (ai !== -1) return -1;
        if (bi !== -1) return 1;
        return a.size.localeCompare(b.size);
      });
  })();

  /* Status donut data */
  const statusData = [
    { name: "Verified", value: total.verified },
    { name: "Pending", value: total.pending },
    { name: "Rejected", value: total.rejected },
  ].filter((d) => d.value > 0);

  return (
    <div className="grid min-w-0 grid-cols-1 gap-4 lg:grid-cols-2 lg:gap-6">
      {/* ── Daily line chart ──────────────────────────────────── */}
      <div className="card-animated glass-card min-w-0 rounded-2xl border border-[#1E3A5F] p-3 sm:p-5 lg:col-span-2">
        <h3 className="text-white font-bold text-sm mb-4 flex items-center gap-2" style={OFont}>
          <span className="w-2 h-2 rounded-full bg-[#00E5FF]" style={{ boxShadow: "0 0 6px #00E5FF" }} />
          PENDAFTARAN HARIAN
        </h3>
        <div className="-mx-1 overflow-x-auto px-1">
          <div className="h-56 min-w-[520px] sm:min-w-0">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={dailyLineData}>
              <CartesianGrid stroke="#1E3A5F" strokeDasharray="3 3" />
              <XAxis dataKey="date" tick={{ fill: "#B0C4DE", fontSize: 10 }} />
              <YAxis tick={{ fill: "#B0C4DE", fontSize: 10 }} allowDecimals={false} />
              <Tooltip {...tooltipStyle} />
              {filter !== "all" && events.length === 1 ? (
                <Line type="monotone" dataKey="count" stroke={EVENT_LINE_COLORS[0]}
                  strokeWidth={2} dot={{ r: 3, fill: EVENT_LINE_COLORS[0] }} name="Pendaftar" />
              ) : filter === "all" && events.length > 1 ? (
                events.map((ev, i) => (
                  <Line key={ev.slug} type="monotone" dataKey={ev.slug}
                    stroke={EVENT_LINE_COLORS[i % EVENT_LINE_COLORS.length]}
                    strokeWidth={2}
                    dot={{ r: 2, fill: EVENT_LINE_COLORS[i % EVENT_LINE_COLORS.length] }}
                    name={ev.name} />
                ))
              ) : (
                <Line type="monotone" dataKey="count" stroke="#00E5FF" strokeWidth={2}
                  dot={{ r: 3, fill: "#00E5FF" }} name="Pendaftar" />
              )}
              {events.length > 1 && filter === "all" && <Legend />}
            </LineChart>
          </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* ── Category bar chart ────────────────────────────────── */}
      <div className="card-animated glass-card min-w-0 rounded-2xl border border-[#1E3A5F] p-3 sm:p-5">
        <h3 className="text-white font-bold text-sm mb-4" style={OFont}>PER KATEGORI</h3>
        <div className="-mx-1 overflow-x-auto px-1">
          <div className="h-48 min-w-[430px] sm:min-w-0">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={categoryData} layout="vertical">
              <CartesianGrid stroke="#1E3A5F" strokeDasharray="3 3" />
              <XAxis type="number" tick={{ fill: "#B0C4DE", fontSize: 10 }} allowDecimals={false} />
              <YAxis type="category" dataKey="label" tick={{ fill: "#B0C4DE", fontSize: 10 }} width={72} />
              <Tooltip {...tooltipStyle} />
              <Bar dataKey="count" name="Pendaftar" radius={[0, 6, 6, 0]}>
                {categoryData.map((_, i) => (
                  <Cell key={i} fill={CATEGORY_COLORS[i % CATEGORY_COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* ── Jersey size bar chart ─────────────────────────────── */}
      <div className="card-animated glass-card min-w-0 rounded-2xl border border-[#1E3A5F] p-3 sm:p-5">
        <h3 className="text-white font-bold text-sm mb-4" style={OFont}>UKURAN JERSEY</h3>
        <div className="-mx-1 overflow-x-auto px-1">
          <div className="h-48 min-w-[430px] sm:min-w-0">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={jerseyData}>
              <CartesianGrid stroke="#1E3A5F" strokeDasharray="3 3" />
              <XAxis dataKey="size" tick={{ fill: "#B0C4DE", fontSize: 10 }} />
              <YAxis tick={{ fill: "#B0C4DE", fontSize: 10 }} allowDecimals={false} />
              <Tooltip {...tooltipStyle} />
              <Bar dataKey="count" name="Peserta" radius={[6, 6, 0, 0]}>
                {jerseyData.map((_, i) => (
                  <Cell key={i} fill={JERSEY_COLORS[i % JERSEY_COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* ── Status donut ──────────────────────────────────────── */}
      <div className="card-animated glass-card min-w-0 rounded-2xl border border-[#1E3A5F] p-3 sm:p-5">
        <h3 className="text-white font-bold text-sm mb-4" style={OFont}>STATUS PEMBAYARAN</h3>
        <div className="h-48 flex items-center justify-center">
          {statusData.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={statusData} dataKey="value" nameKey="name" cx="50%" cy="50%"
                  innerRadius={45} outerRadius={75} paddingAngle={3} strokeWidth={0}>
                  {statusData.map((d) => (
                    <Cell key={d.name} fill={STATUS_COLORS[d.name] ?? "#B0C4DE"} />
                  ))}
                </Pie>
                <Tooltip {...tooltipStyle} />
                <Legend formatter={(v) => <span style={{ color: "#B0C4DE", fontSize: 11 }}>{v}</span>} />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-[#B0C4DE] text-xs">Belum ada data</p>
          )}
        </div>
      </div>

      {/* ── Quota per category detail ─────────────────────────── */}
      <div className="card-animated glass-card min-w-0 rounded-2xl border border-[#1E3A5F] p-3 sm:p-5">
        <h3 className="text-white font-bold text-sm mb-4" style={OFont}>KUOTA PER KATEGORI</h3>
        <div className="space-y-3">
          {events.flatMap((ev) =>
            ev.categories.map((cat) => (
              <div key={`${ev.slug}-${cat.code}`}>
                <div className="mb-1 flex flex-col gap-1 text-xs min-[430px]:flex-row min-[430px]:justify-between">
                  <span className="min-w-0 break-words text-[#B0C4DE]">
                    {ev.name} — {cat.label}
                  </span>
                  <span className="font-bold" style={{ color: cat.fillPercent >= 90 ? "#FF006E" : "#00E5FF" }}>
                    {cat.filled}/{cat.quota} ({cat.fillPercent}%)
                  </span>
                </div>
                <div className="quota-track" style={{ height: 6 }}>
                  <div className="quota-fill" style={{
                    width: `${Math.min(cat.fillPercent, 100)}%`,
                    background: cat.fillPercent >= 90
                      ? "linear-gradient(90deg, #FF006E, #FF8C00)"
                      : "linear-gradient(90deg, #8B00FF, #2A4FFF, #00E5FF)",
                  }} />
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
