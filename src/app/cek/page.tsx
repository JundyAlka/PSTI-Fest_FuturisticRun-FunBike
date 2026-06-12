"use client";
import { useState } from "react";
import { Search, CheckCircle, XCircle, Clock, AlertCircle } from "lucide-react";

type RegResult = {
  found: boolean;
  regNumber?: string;
  name?: string;
  category?: string;
  paymentStatus?: string;
  status?: string;
  bibNumber?: number;
  message?: string;
};

export default function CekPage() {
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<RegResult | null>(null);

  const isFunBike = result?.regNumber?.startsWith("FB");
  const accentColor = isFunBike ? "#FF6B2C" : "#00E5FF";

  const check = async () => {
    if (!query.trim()) return;
    setLoading(true);
    setResult(null);
    try {
      const res = await fetch(`/api/check-registration?regNumber=${encodeURIComponent(query.trim())}`);
      const data = await res.json();
      setResult(data);
    } catch {
      setResult({ found: false, message: "Gagal menghubungi server" });
    } finally {
      setLoading(false);
    }
  };

  const statusBadge = (status: string) => {
    const map: Record<string, { color: string; icon: typeof CheckCircle; label: string }> = {
      pending: { color: "#F59E0B", icon: Clock, label: "Menunggu Verifikasi" },
      verified: { color: "#10B981", icon: CheckCircle, label: "Terverifikasi" },
      rejected: { color: "#EF4444", icon: XCircle, label: "Ditolak" },
      registered: { color: "#3B82F6", icon: CheckCircle, label: "Terdaftar" },
    };
    const s = map[status] ?? { color: "#6B7280", icon: AlertCircle, label: status };
    return (
      <div className="flex items-center gap-2">
        <s.icon size={16} style={{ color: s.color }} />
        <span className="text-sm font-semibold" style={{ color: s.color }}>{s.label}</span>
      </div>
    );
  };

  return (
    <main
      className="page-animate min-h-screen relative overflow-hidden"
      style={{ background: "linear-gradient(180deg, #0A0E27 0%, #0F1535 50%, #0A0E27 100%)" }}
    >
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] rounded-full blur-3xl opacity-10 bg-gradient-to-r from-[#00E5FF] to-[#8B00FF]" />

      <div className="relative z-10 max-w-lg mx-auto px-4 sm:px-6 pt-28 pb-20">
        <div className="text-center mb-10">
          <div className="badge-neon inline-block mb-4">CEK STATUS</div>
          <h1 className="text-4xl sm:text-5xl font-black text-white mb-3" style={{ fontFamily: "Orbitron, sans-serif" }}>
            CEK PENDAFTARAN
          </h1>
          <p className="text-[#B0C4DE]">Masukkan nomor registrasi Anda untuk melihat status</p>
        </div>

        {/* Search */}
        <div className="card-animated glass-card rounded-2xl border border-[#1E3A5F] p-6 mb-6">
          <div className="flex gap-3">
            <input
              className="neon-input flex-1 rounded-xl px-4 py-3 text-sm"
              placeholder="Contoh: FR2026-0001"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && check()}
            />
            <button
              onClick={check}
              disabled={loading || !query.trim()}
              className="btn-neon flex items-center gap-2 px-6 py-3 rounded-xl text-sm cursor-pointer disabled:opacity-50"
            >
              {loading ? (
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <Search size={16} />
              )}
              CEK
            </button>
          </div>
        </div>

        {/* Result */}
        {result && (
          <div className="card-animated glass-card rounded-2xl border p-6" style={{ borderColor: `${accentColor}40` }}>
            {result.found ? (
              <div className="space-y-4">
                <div className="text-center">
                  <div className="text-xs text-[#B0C4DE] tracking-widest mb-1" style={{ fontFamily: "Orbitron, sans-serif" }}>
                    NOMOR REGISTRASI
                  </div>
                  <div className="text-2xl font-black" style={{ fontFamily: "Orbitron, sans-serif", color: accentColor }}>
                    {result.regNumber}
                  </div>
                </div>
                <div className="h-px" style={{ backgroundImage: `linear-gradient(90deg, transparent, ${accentColor}40, transparent)` }} />
                <div className="space-y-3">
                  {[
                    { label: "Nama", value: result.name },
                    { label: "Kategori", value: result.category },
                    { label: "Status", value: undefined, node: statusBadge(result.paymentStatus ?? result.status ?? "") },
                    ...(result.bibNumber ? [{ label: "No. BIB", value: String(result.bibNumber) }] : []),
                  ].map((row) => (
                    <div key={row.label} className="flex justify-between text-sm">
                      <span className="text-[#B0C4DE]">{row.label}</span>
                      {row.node ?? <span className="text-white font-semibold">{row.value}</span>}
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="text-center py-4">
                <AlertCircle size={32} className="text-[#FF006E] mx-auto mb-3" />
                <p className="text-[#B0C4DE] text-sm">{result.message ?? "Nomor registrasi tidak ditemukan"}</p>
              </div>
            )}
          </div>
        )}
      </div>
    </main>
  );
}
