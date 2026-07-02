"use client";
import { useEffect, useState, useCallback, useMemo } from "react";
import {
  Users, CheckCircle, Clock, XCircle, DollarSign, TrendingUp,
  Download, RefreshCw, Activity, AlertTriangle, Zap, Filter,
  Eye, Radio, MousePointerClick, ShieldCheck,
} from "lucide-react";
import Link from "next/link";
import { formatCurrency } from "@/lib/utils";
import LoadingPanel from "@/components/LoadingPanel";
import DashboardCharts from "@/components/admin/DashboardCharts";

/* ── Types ────────────────────────────────────────────────────────── */
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
interface VisitorStats {
  activeNow: number;
  today: number;
  unregisteredActive: number;
  registeredToday: number;
  byEvent: Array<{ eventType: string; active: number; today: number; unregistered: number }>;
  recent: Array<{
    sessionId: string;
    eventType: string | null;
    currentPath: string | null;
    deviceType: string | null;
    registered: boolean;
    pageViews: number;
    lastSeenAt: string;
  }>;
}
interface ActivityLog {
  id: number;
  createdAt: string;
  actorType: string;
  actorLabel: string | null;
  eventType: string | null;
  action: string;
  entityType: string | null;
  entityId: string | null;
  pageUrl: string | null;
}
interface StatsResponse { events: EventStats[]; total: TotalStats; visitors: VisitorStats; activity: ActivityLog[] }
interface HealthResponse {
  status: string;
  services: { insforge: { ok: boolean; latencyMs: number } };
  checkedAt: string;
}

/* ── Accent colors per event ──────────────────────────────────────── */
const EVENT_COLORS: Record<string, string> = {
  "futuristic-run": "#00E5FF",
  "fun-bike": "#FF6B2C",
};
function eventColor(slug: string) { return EVENT_COLORS[slug] ?? "#00E5FF"; }

function actionLabel(action: string) {
  const map: Record<string, string> = {
    visitor_first_seen: "Visitor baru",
    analytics_landing_view: "Landing dilihat",
    analytics_cta_click: "CTA diklik",
    analytics_form_start: "Form dimulai",
    analytics_form_step_complete: "Step form selesai",
    analytics_form_submit: "Submit form",
    registration_created: "Pendaftaran masuk",
    payment_proof_uploaded: "Bukti bayar diunggah",
    payment_verified: "Pembayaran diverifikasi",
    payment_rejected: "Pembayaran ditolak",
    payment_verified_bulk: "Bulk verify",
    settings_updated: "Pengaturan diubah",
    participants_exported: "Export peserta",
    audit_exported: "Export audit",
    participants_deleted: "Peserta dihapus",
  };
  return map[action] ?? action.replace(/_/g, " ");
}

function eventName(value: string | null) {
  if (value === "fun-bike") return "Fun Bike";
  if (value === "futuristic-run") return "Futuristic Run";
  if (value === "hub") return "Landing Hub";
  return value ?? "-";
}

/* ── Component ────────────────────────────────────────────────────── */
export default function AdminDashboard() {
  const [data, setData] = useState<StatsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [health, setHealth] = useState<HealthResponse | null>(null);
  const [healthLoading, setHealthLoading] = useState(false);
  const [filter, setFilter] = useState<string>("all"); // "all" | event slug
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");

  /* Fetch stats */
  useEffect(() => {
    let cancelled = false;
    async function fetchStats(showLoading = false) {
      if (showLoading) setLoading(true);
      const params = new URLSearchParams();
      if (dateFrom) params.set("dateFrom", new Date(dateFrom).toISOString());
      if (dateTo) params.set("dateTo", new Date(dateTo + "T23:59:59").toISOString());
      const res = await fetch(`/api/admin/stats?${params}`);
      const json: StatsResponse = await res.json();
      if (!cancelled) { setData(json); setLoading(false); }
    }
    void fetchStats(true);
    const timer = window.setInterval(() => void fetchStats(false), 20_000);
    return () => {
      cancelled = true;
      window.clearInterval(timer);
    };
  }, [dateFrom, dateTo]);

  /* Fetch health */
  const fetchHealth = useCallback(async () => {
    setHealthLoading(true);
    try {
      const res = await fetch("/api/health");
      const json = await res.json();
      setHealth(json);
    } catch { setHealth(null); }
    setHealthLoading(false);
  }, []);

  useEffect(() => {
    let cancelled = false;
    async function init() {
      setHealthLoading(true);
      try {
        const res = await fetch("/api/health");
        const json = await res.json();
        if (!cancelled) setHealth(json);
      } catch { if (!cancelled) setHealth(null); }
      if (!cancelled) setHealthLoading(false);
    }
    void init();
    return () => { cancelled = true; };
  }, []);

  /* Derived data */
  const filteredEvents = useMemo(() => {
    if (!data) return [];
    return filter === "all" ? data.events : data.events.filter((e) => e.slug === filter);
  }, [data, filter]);

  const summary = useMemo(() => {
    if (!data) return null;
    if (filter === "all") return data.total;
    const e = data.events.find((ev) => ev.slug === filter);
    if (!e) return data.total;
    return {
      count: e.count, verified: e.verified, pending: e.pending, rejected: e.rejected,
      totalQuota: e.totalQuota, totalFilled: e.totalFilled, totalRemaining: e.totalRemaining,
      fillPercent: e.fillPercent, finance: e.finance, daily: e.daily,
    } as TotalStats;
  }, [data, filter]);

  const OFont = { fontFamily: "Orbitron, sans-serif" };

  return (
    <div className="page-animate w-full min-w-0 max-w-full overflow-x-hidden p-4 sm:p-6 lg:p-8">
      {/* ── Header ──────────────────────────────────────────────── */}
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between">
        <div className="min-w-0">
          <h1 className="text-xl sm:text-2xl font-black text-white" style={OFont}>COMMAND CENTER</h1>
          <p className="text-[#B0C4DE] text-sm mt-1">Dashboard pusat kendali multi-event</p>
        </div>
        <div className="flex w-full flex-wrap gap-2 sm:w-auto">
          <a
            href="/api/admin/audit?format=csv&limit=5000"
            className="btn-outline-neon flex min-h-11 w-full items-center justify-center gap-2 rounded-xl px-4 py-2 text-xs sm:w-auto"
          >
            <Download size={14} /> Unduh Audit
          </a>
          <Link
            href="/admin/peserta?status=pending"
            className="btn-outline-neon flex min-h-11 w-full items-center justify-center gap-2 rounded-xl px-4 py-2 text-xs sm:w-auto"
          >
            <Clock size={14} /> Verifikasi Pending
          </Link>
        </div>
      </div>

      {/* ── Filters ─────────────────────────────────────────────── */}
      <div className="card-animated glass-card mb-6 flex flex-col gap-3 rounded-xl border border-[#1E3A5F] p-3 sm:flex-row sm:flex-wrap sm:items-center">
        <Filter size={14} className="hidden text-[#B0C4DE] sm:block" />
        {/* Event filter tabs */}
        <div className="grid w-full grid-cols-1 gap-1 rounded-lg border border-[#1E3A5F] bg-[#080C20] p-1 min-[430px]:grid-cols-3 sm:w-auto">
          <button
            onClick={() => setFilter("all")}
            className={`px-3 py-1.5 rounded-md text-xs font-bold transition-all ${
              filter === "all" ? "bg-[#00E5FF] text-[#0A0E27]" : "text-[#B0C4DE] hover:text-white"
            }`}
            style={OFont}
          >
            SEMUA
          </button>
          {data?.events.map((ev) => (
            <button
              key={ev.slug}
              onClick={() => setFilter(ev.slug)}
              className={`px-3 py-1.5 rounded-md text-xs font-bold transition-all ${
                filter === ev.slug ? "text-[#0A0E27]" : "text-[#B0C4DE] hover:text-white"
              }`}
              style={{ ...OFont, background: filter === ev.slug ? eventColor(ev.slug) : "transparent" }}
            >
              {ev.name.toUpperCase()}
            </button>
          ))}
        </div>
        {/* Date range */}
        <div className="grid w-full grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] items-center gap-2 sm:ml-auto sm:flex sm:w-auto">
          <input type="date" value={dateFrom} onChange={(e) => setDateFrom(e.target.value)}
            className="neon-input min-w-0 rounded-lg px-2 py-1.5 text-xs sm:w-32" />
          <span className="text-[#B0C4DE] text-xs">—</span>
          <input type="date" value={dateTo} onChange={(e) => setDateTo(e.target.value)}
            className="neon-input min-w-0 rounded-lg px-2 py-1.5 text-xs sm:w-32" />
        </div>
      </div>

      {loading ? (
        <LoadingPanel label="Memuat dashboard" />
      ) : (
        <>
          <div className="mb-6 grid grid-cols-1">

            <div className="card-animated glass-card rounded-2xl border border-[#1E3A5F] p-4 sm:p-5">
              <div className="mb-4 flex items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <Activity size={16} className="text-[#FFD700]" />
                  <h2 className="text-sm font-black text-white" style={OFont}>AKTIVITAS TERBARU</h2>
                </div>
                <a href="/api/admin/audit?format=csv&limit=5000" className="text-xs font-semibold text-[#00E5FF] hover:text-white">CSV</a>
              </div>
              <div className="space-y-2">
                {(data?.activity.length ? data.activity : []).slice(0, 8).map((log) => (
                  <div key={log.id} className="rounded-xl border border-[#1E3A5F]/70 bg-[#0A0E27]/60 p-3">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <p className="truncate text-xs font-bold text-white">{actionLabel(log.action)}</p>
                        <p className="mt-1 truncate text-[11px] text-[#B0C4DE]">
                          {eventName(log.eventType)} - {log.actorLabel ?? log.actorType}
                        </p>
                      </div>
                      <span className="shrink-0 text-[10px] text-[#5A7899]">{new Date(log.createdAt).toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" })}</span>
                    </div>
                  </div>
                ))}
                {!data?.activity.length && <p className="rounded-xl border border-[#1E3A5F]/70 p-4 text-xs text-[#B0C4DE]">Belum ada aktivitas terekam.</p>}
              </div>
            </div>
          </div>
          {/* ── Summary stat cards ──────────────────────────────── */}
          <div className="stagger-list mb-6 grid grid-cols-1 gap-3 min-[430px]:grid-cols-2 lg:grid-cols-4 lg:gap-4">
            {[
              { label: "Total Pendaftar", value: summary?.count ?? 0, icon: Users, color: "#00E5FF" },
              { label: "Terverifikasi", value: summary?.verified ?? 0, icon: CheckCircle, color: "#4ADE80" },
              { label: "Menunggu", value: summary?.pending ?? 0, icon: Clock, color: "#FF8C00" },
              { label: "Ditolak", value: summary?.rejected ?? 0, icon: XCircle, color: "#FF006E" },
            ].map((c) => (
              <div
                key={c.label}
            className="card-animated glass-card min-w-0 rounded-2xl border border-[#1E3A5F] p-4 transition-all duration-300 hover:border-opacity-60 sm:p-5"
                style={{ borderColor: `${c.color}20` }}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="w-9 h-9 rounded-xl flex items-center justify-center"
                    style={{ background: `${c.color}15`, border: `1px solid ${c.color}25` }}>
                    <c.icon size={16} style={{ color: c.color }} />
                  </div>
                </div>
                <div className="text-3xl font-black mb-1" style={{ ...OFont, color: c.color }}>
                  {c.value}
                </div>
                <div className="text-[#B0C4DE] text-sm">{c.label}</div>
              </div>
            ))}
          </div>

          {/* ── Per-event cards ──────────────────────────────────── */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
            {filteredEvents.map((ev) => {
              const accent = eventColor(ev.slug);
              return (
                <div key={ev.slug} className="card-animated glass-card min-w-0 rounded-2xl border border-[#1E3A5F] p-4 sm:p-5 space-y-4">
                  {/* Event header */}
                  <div className="flex flex-col gap-3 min-[430px]:flex-row min-[430px]:items-center min-[430px]:justify-between">
                    <div className="flex min-w-0 flex-wrap items-center gap-2">
                      <div className="w-3 h-3 rounded-full" style={{ background: accent, boxShadow: `0 0 8px ${accent}` }} />
                      <h3 className="text-white font-bold text-sm" style={OFont}>{ev.name.toUpperCase()}</h3>
                      {ev.isOpen ? (
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#4ADE80]/10 text-[#4ADE80] border border-[#4ADE80]/20">OPEN</span>
                      ) : (
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#FF006E]/10 text-[#FF006E] border border-[#FF006E]/20">CLOSED</span>
                      )}
                    </div>
                    <a href={`/api/admin/export?eventType=${ev.slug}`}
                      className="flex min-h-9 items-center justify-center gap-1 rounded-lg border border-[#1E3A5F] px-3 text-[10px] text-[#B0C4DE] transition-colors hover:border-[#00E5FF]/40 hover:text-white min-[430px]:border-0 min-[430px]:px-0">
                      <Download size={12} /> Excel
                    </a>
                  </div>

                  {/* Stat row */}
                  <div className="grid grid-cols-2 gap-3 min-[430px]:grid-cols-4 min-[430px]:gap-2">
                    {[
                      { l: "Total", v: ev.count },
                      { l: "Verified", v: ev.verified },
                      { l: "Pending", v: ev.pending },
                      { l: "Rejected", v: ev.rejected },
                    ].map((s) => (
                      <div key={s.l} className="text-center">
                        <div className="text-lg font-black" style={{ ...OFont, color: accent }}>{s.v}</div>
                        <div className="text-[#B0C4DE] text-[10px]">{s.l}</div>
                      </div>
                    ))}
                  </div>

                  {/* Quota progress */}
                  <div>
                    <div className="flex items-center justify-between text-xs mb-1.5">
                      <span className="text-[#B0C4DE]">
                        Kuota: {ev.totalFilled}/{ev.totalQuota}
                      </span>
                      <span style={{ color: accent }} className="font-bold">{ev.fillPercent}%</span>
                    </div>
                    <div className="quota-track">
                      <div className="quota-fill" style={{ width: `${Math.min(ev.fillPercent, 100)}%` }}>
                        <div className="quota-fill-glint" />
                      </div>
                    </div>
                    {ev.presaleRemaining > 0 && (
                      <div className="mt-2 flex items-center gap-1.5">
                        <Zap size={11} className="text-[#FFD700]" />
                        <span className="text-[#FFD700] text-[10px] font-semibold">
                          Presale: sisa {ev.presaleRemaining} slot
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Finance */}
                  <div className="grid grid-cols-1 gap-2 min-[430px]:grid-cols-3">
                    {[
                      { l: "Potensial", v: ev.finance.potential, c: "#B0C4DE" },
                      { l: "Terverifikasi", v: ev.finance.verified, c: "#4ADE80" },
                      { l: "Outstanding", v: ev.finance.outstanding, c: "#FF8C00" },
                    ].map((f) => (
                      <div key={f.l} className="rounded-xl p-2.5 border border-[#1E3A5F]/60 bg-[#0F1535]/50">
                        <div className="text-[10px] text-[#B0C4DE] mb-0.5">{f.l}</div>
                        <div className="text-xs font-bold truncate" style={{ color: f.c }}>
                          {formatCurrency(f.v)}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>

          {/* ── Finance total cards ─────────────────────────────── */}
          {filter === "all" && (
            <div className="stagger-list grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
              {[
                { label: "Total Potensial", value: summary?.finance.potential ?? 0, icon: DollarSign, color: "#B0C4DE" },
                { label: "Total Terverifikasi", value: summary?.finance.verified ?? 0, icon: CheckCircle, color: "#4ADE80" },
                { label: "Total Outstanding", value: summary?.finance.outstanding ?? 0, icon: TrendingUp, color: "#FF8C00" },
              ].map((c) => (
                <div key={c.label} className="card-animated glass-card min-w-0 rounded-2xl border border-[#1E3A5F] p-4 sm:p-5">
                  <div className="flex items-center gap-2 mb-2">
                    <c.icon size={14} style={{ color: c.color }} />
                    <span className="text-[#B0C4DE] text-xs">{c.label}</span>
                  </div>
                  <div className="break-words text-lg font-black sm:text-xl" style={{ ...OFont, color: c.color }}>
                    {formatCurrency(c.value)}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* ── Charts ──────────────────────────────────────────── */}
          <DashboardCharts
            events={filteredEvents}
            total={summary!}
            filter={filter}
          />

          {/* ── Health panel ────────────────────────────────────── */}
          <div className="card-animated glass-card mt-6 min-w-0 rounded-2xl border border-[#1E3A5F] p-4 sm:p-5">
            <div className="mb-4 flex flex-col gap-3 min-[430px]:flex-row min-[430px]:items-center min-[430px]:justify-between">
              <div className="flex items-center gap-2">
                <Activity size={16} className="text-[#00E5FF]" />
                <h3 className="text-white font-bold text-sm" style={OFont}>STATUS INSFORGE</h3>
              </div>
              <button
                onClick={fetchHealth}
                disabled={healthLoading}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs text-[#B0C4DE] border border-[#1E3A5F] hover:border-[#00E5FF]/50 hover:text-white transition-all disabled:opacity-50"
              >
                <RefreshCw size={12} className={healthLoading ? "animate-spin" : ""} /> Refresh
              </button>
            </div>
            {health ? (
              <div className="flex flex-wrap items-center gap-4">
                <div className="flex items-center gap-2">
                  {health.services.insforge.ok ? (
                    <div className="w-3 h-3 rounded-full bg-[#4ADE80]" style={{ boxShadow: "0 0 8px #4ADE80" }} />
                  ) : (
                    <AlertTriangle size={14} className="text-[#FF006E]" />
                  )}
                  <span className={`text-sm font-semibold ${health.services.insforge.ok ? "text-[#4ADE80]" : "text-[#FF006E]"}`}>
                    {health.status === "ok" ? "Operational" : "Degraded"}
                  </span>
                </div>
                <span className="text-[#B0C4DE] text-xs">
                  Latency: {health.services.insforge.latencyMs}ms
                </span>
                <span className="text-[#B0C4DE] text-xs sm:ml-auto">
                  Cek terakhir: {new Date(health.checkedAt).toLocaleString("id-ID")}
                </span>
              </div>
            ) : (
              <p className="text-[#B0C4DE] text-xs">Memuat status...</p>
            )}
          </div>
        </>
      )}
    </div>
  );
}
