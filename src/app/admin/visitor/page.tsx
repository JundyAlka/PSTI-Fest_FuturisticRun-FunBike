"use client";
import { useEffect, useState, useCallback } from "react";
import { Users, Eye, MousePointerClick, ShieldCheck, Activity, RefreshCw } from "lucide-react";

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

interface StatsResponse { 
  visitors: VisitorStats;
  activity: ActivityLog[];
}

function eventName(value: string | null) {
  if (value === "fun-bike") return "Fun Bike";
  if (value === "futuristic-run") return "Futuristic Run";
  if (value === "hub") return "Landing Hub";
  return value ?? "-";
}

const OFont = { fontFamily: "Orbitron, sans-serif" };

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

export default function VisitorDashboard() {
  const [data, setData] = useState<StatsResponse | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchStats = useCallback(async (showLoading = false) => {
    if (showLoading) setLoading(true);
    try {
      const res = await fetch(`/api/admin/stats`);
      const json: StatsResponse = await res.json();
      setData(json);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void fetchStats(true);
    const timer = window.setInterval(() => void fetchStats(false), 20_000);
    return () => window.clearInterval(timer);
  }, [fetchStats]);

  return (
    <div className="page-animate w-full min-w-0 max-w-full overflow-x-hidden p-4 sm:p-6 lg:p-8">
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between">
        <div className="min-w-0">
          <h1 className="text-xl sm:text-2xl font-black text-white" style={OFont}>VISITOR DASHBOARD</h1>
          <p className="text-[#B0C4DE] text-sm mt-1">Pantau pergerakan visitor secara real-time</p>
        </div>
        <div className="flex w-full flex-wrap gap-2 sm:w-auto">
          <button
            onClick={() => fetchStats(true)}
            className="btn-outline-neon flex min-h-11 w-full items-center justify-center gap-2 rounded-xl px-4 py-2 text-xs sm:w-auto cursor-pointer"
          >
            <RefreshCw size={14} className={loading ? "animate-spin" : ""} /> Refresh
          </button>
        </div>
      </div>

      <div className="card-animated glass-card relative overflow-hidden rounded-2xl border border-[#1E3A5F] p-4 sm:p-5">
        <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#00E5FF] to-transparent" />
        <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="flex items-center gap-2">
              <Activity size={16} className="text-[#00E5FF]" />
              <h2 className="text-sm font-black text-white" style={OFont}>LIVE VISITOR RADAR</h2>
            </div>
            <p className="mt-1 text-xs text-[#B0C4DE]">Pantau visitor aktif, termasuk yang tertarik tapi belum mendaftar.</p>
          </div>
          <span className="inline-flex min-h-8 items-center gap-2 rounded-full border border-[#4ADE80]/30 bg-[#4ADE80]/10 px-3 text-xs font-bold text-[#4ADE80]">
            <span className="size-2 animate-pulse rounded-full bg-[#4ADE80]" /> LIVE
          </span>
        </div>

        <div className="mb-5 grid grid-cols-2 gap-3 lg:grid-cols-4">
          {[
            { label: "Aktif sekarang", value: data?.visitors.activeNow ?? 0, icon: Eye, color: "#00E5FF" },
            { label: "Visitor hari ini", value: data?.visitors.today ?? 0, icon: Users, color: "#8B5CF6" },
            { label: "Belum daftar", value: data?.visitors.unregisteredActive ?? 0, icon: MousePointerClick, color: "#FF8C00" },
            { label: "Konversi hari ini", value: data?.visitors.registeredToday ?? 0, icon: ShieldCheck, color: "#4ADE80" },
          ].map((item) => (
            <div key={item.label} className="rounded-xl border border-[#1E3A5F] bg-[#0A0E27]/70 p-3">
              <div className="mb-2 flex items-center gap-2 text-[10px] text-[#B0C4DE]">
                <item.icon size={13} style={{ color: item.color }} />
                <span>{item.label}</span>
              </div>
              <div className="text-2xl font-black" style={{ ...OFont, color: item.color }}>{item.value}</div>
            </div>
          ))}
        </div>

        <div className="grid gap-2 sm:grid-cols-3">
          {(data?.visitors.byEvent.length ? data.visitors.byEvent : [{ eventType: "hub", active: 0, today: 0, unregistered: 0 }]).map((item) => (
            <div key={item.eventType} className="rounded-xl border border-[#1E3A5F]/80 bg-[#080C20]/70 p-3">
              <div className="mb-2 flex items-center justify-between gap-2">
                <span className="text-xs font-bold text-white">{eventName(item.eventType)}</span>
                <span className="rounded-full bg-[#00E5FF]/10 px-2 py-0.5 text-[10px] text-[#00E5FF]">{item.active} live</span>
              </div>
              <div className="text-[11px] text-[#B0C4DE]">Hari ini {item.today} visitor - belum daftar {item.unregistered}</div>
            </div>
          ))}
        </div>

        {!!data?.visitors.recent.length && (
          <div className="mt-4 grid gap-2 sm:grid-cols-2">
            {data.visitors.recent.map((visitor) => (
              <div key={visitor.sessionId} className="rounded-xl border border-[#1E3A5F]/70 bg-[#050817]/50 p-3">
                <div className="flex items-center justify-between gap-3">
                  <span className="truncate text-xs font-semibold text-white">{visitor.currentPath ?? "/"}</span>
                  <span className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] ${visitor.registered ? "bg-[#4ADE80]/10 text-[#4ADE80]" : "bg-[#FF8C00]/10 text-[#FF8C00]"}`}>
                    {visitor.registered ? "daftar" : "belum"}
                  </span>
                </div>
                <p className="mt-1 text-[11px] text-[#B0C4DE]">{eventName(visitor.eventType)} - {visitor.deviceType ?? "device"} - {visitor.pageViews} views</p>
                <p className="text-[10px] text-[#5A7899] mt-1">Terakhir dilihat: {new Date(visitor.lastSeenAt).toLocaleTimeString("id-ID")}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* AKTIVITAS TERBARU */}
      <div className="card-animated glass-card rounded-2xl border border-[#1E3A5F] p-4 sm:p-5 mt-6">
        <div className="mb-4 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Activity size={16} className="text-[#FFD700]" />
            <h2 className="text-sm font-black text-white" style={OFont}>AKTIVITAS TERBARU</h2>
          </div>
          <a href="/api/admin/audit?format=csv&limit=5000" className="text-xs font-semibold text-[#00E5FF] hover:text-white">CSV</a>
        </div>
        <div className="space-y-2">
          {(data?.activity?.length ? data.activity : []).slice(0, 15).map((log) => (
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
          {!data?.activity?.length && <p className="rounded-xl border border-[#1E3A5F]/70 p-4 text-xs text-[#B0C4DE]">Belum ada aktivitas terekam.</p>}
        </div>
      </div>
    </div>
  );
}
