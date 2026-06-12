"use client";
import { useEffect, useState } from "react";
import { Users, CheckCircle, Clock, XCircle, TrendingUp, Download } from "lucide-react";
import Link from "next/link";
import { getPaymentStatusColor, CATEGORY_LABELS } from "@/lib/utils";
import LoadingPanel from "@/components/LoadingPanel";

interface Stats {
  total: number; verified: number; pending: number; rejected: number;
  byCat: { category: string; count: number; verified: number }[];
  daily: { date: string; count: number }[];
}

interface Participant {
  id: number; reg_number: string; full_name: string; email: string;
  category: string; payment_status: string; payment_amount: number; created_at: string;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [recent, setRecent] = useState<Participant[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch("/api/admin/stats?eventType=futuristic-run").then((r) => r.json()),
      fetch("/api/admin/participants?limit=8&eventType=futuristic-run").then((r) => r.json()),
    ]).then(([s, p]) => {
      setStats(s);
      setRecent(p.participants ?? []);
    }).finally(() => setLoading(false));
  }, []);

  const statCards = stats ? [
    { label: "Total Peserta", value: stats.total, icon: Users, color: "#00E5FF", bg: "rgba(0,229,255,0.1)" },
    { label: "Terverifikasi", value: stats.verified, icon: CheckCircle, color: "#00E5FF", bg: "rgba(0,229,255,0.1)" },
    { label: "Menunggu", value: stats.pending, icon: Clock, color: "#FF8C00", bg: "rgba(255,140,0,0.1)" },
    { label: "Ditolak", value: stats.rejected, icon: XCircle, color: "#FF006E", bg: "rgba(255,0,110,0.1)" },
  ] : [];

  const maxDaily = stats ? Math.max(...stats.daily.map((d) => d.count), 1) : 1;

  return (
    <div className="page-animate p-6 sm:p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-black text-white" style={{ fontFamily: "Orbitron, sans-serif" }}>
            DASHBOARD
          </h1>
          <p className="text-[#B0C4DE] text-sm mt-1">Futuristic RUN 2026 — Overview</p>
        </div>
        <a
          href="/api/admin/export?eventType=futuristic-run"
          className="btn-outline-neon flex items-center gap-2 px-4 py-2 rounded-xl text-xs cursor-pointer"
        >
          <Download size={14} /> Export CSV
        </a>
      </div>

      {loading ? (
        <LoadingPanel label="Memuat dashboard" />
      ) : (
        <>
          {/* Stat cards */}
          <div className="stagger-list grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {statCards.map((card) => (
              <div
                key={card.label}
                className="card-animated glass-card rounded-2xl p-5 border border-[#1E3A5F] hover:border-[#00E5FF]/30 transition-all duration-300"
                style={{ background: card.bg }}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: `${card.color}20`, border: `1px solid ${card.color}30` }}>
                    <card.icon size={16} style={{ color: card.color }} />
                  </div>
                </div>
                <div className="text-3xl font-black mb-1" style={{ fontFamily: "Orbitron, sans-serif", color: card.color }}>
                  {card.value}
                </div>
                <div className="text-[#B0C4DE] text-sm">{card.label}</div>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            {/* Daily chart */}
            <div className="card-animated lg:col-span-2 glass-card rounded-2xl p-6 border border-[#1E3A5F]">
              <div className="flex items-center gap-2 mb-6">
                <TrendingUp size={16} className="text-[#00E5FF]" />
                <h3 className="text-white font-bold text-sm" style={{ fontFamily: "Orbitron, sans-serif" }}>
                  PENDAFTAR 7 HARI TERAKHIR
                </h3>
              </div>
              <div className="flex items-end gap-2 h-32">
                {stats?.daily.map((d) => (
                  <div key={d.date} className="flex-1 flex flex-col items-center gap-1">
                    <span className="text-[#00E5FF] text-xs font-bold">{d.count || ""}</span>
                    <div className="progress-fill-animated w-full rounded-t-md transition-all duration-500" style={{
                      height: `${(d.count / maxDaily) * 100}%`,
                      minHeight: d.count > 0 ? "4px" : "0",
                      background: "linear-gradient(180deg, #00E5FF, #2A4FFF)",
                      boxShadow: d.count > 0 ? "0 0 8px rgba(0,229,255,0.4)" : "none",
                    }} />
                    <span className="text-[#B0C4DE] text-[9px]">{d.date}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Per category */}
            <div className="card-animated glass-card rounded-2xl p-6 border border-[#1E3A5F]">
              <h3 className="text-white font-bold text-sm mb-5" style={{ fontFamily: "Orbitron, sans-serif" }}>
                PER KATEGORI
              </h3>
              <div className="space-y-4">
                {stats?.byCat.map((cat) => {
                  const colors: Record<string, string> = { "5K": "#8B00FF" };
                  const color = colors[cat.category] ?? "#00E5FF";
                  return (
                    <div key={cat.category}>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="font-semibold" style={{ color }}>{CATEGORY_LABELS[cat.category]}</span>
                        <span className="text-[#B0C4DE]">{cat.count} peserta</span>
                      </div>
                      <div className="h-1.5 bg-[#1E3A5F] rounded-full">
                        <div className="progress-fill-animated h-full rounded-full transition-all duration-700" style={{
                          width: `${stats.total > 0 ? (cat.count / stats.total) * 100 : 0}%`,
                          background: `linear-gradient(90deg, ${color}, ${color}88)`,
                        }} />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Recent participants */}
          <div className="card-animated glass-card rounded-2xl border border-[#1E3A5F] overflow-hidden">
            <div className="flex items-center justify-between p-5 border-b border-[#1E3A5F]">
              <h3 className="text-white font-bold text-sm" style={{ fontFamily: "Orbitron, sans-serif" }}>
                PESERTA TERBARU
              </h3>
              <Link href="/admin/peserta" className="text-[#00E5FF] text-xs hover:underline">
                Lihat semua →
              </Link>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-[#1E3A5F]">
                    {["No. Reg", "Nama", "Kategori", "Status", "Biaya", "Tanggal"].map((h) => (
                      <th key={h} className="px-4 py-3 text-left text-[#B0C4DE] text-xs font-semibold" style={{ fontFamily: "Orbitron, sans-serif" }}>
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {recent.map((p, i) => (
                    <tr key={p.id} className={`table-row-animated border-b border-[#1E3A5F]/50 hover:bg-white/3 transition-colors ${i % 2 === 0 ? "" : "bg-white/[0.01]"}`}>
                      <td className="px-4 py-3 font-mono text-[#00E5FF] text-xs">{p.reg_number}</td>
                      <td className="px-4 py-3 text-white font-medium">{p.full_name}</td>
                      <td className="px-4 py-3">
                        <span className="text-xs px-2 py-1 rounded-full" style={{ background: "rgba(0,229,255,0.1)", color: "#00E5FF", border: "1px solid rgba(0,229,255,0.2)" }}>
                          {p.category}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span className="text-xs font-semibold" style={{ color: getPaymentStatusColor(p.payment_status) }}>
                          ● {p.payment_status}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-[#FFD700] font-semibold text-xs">
                        Rp {(p.payment_amount ?? 0).toLocaleString("id-ID")}
                      </td>
                      <td className="px-4 py-3 text-[#B0C4DE] text-xs">
                        {new Date(p.created_at).toLocaleDateString("id-ID")}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
