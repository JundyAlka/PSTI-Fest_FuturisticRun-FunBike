"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AlertCircle, ArrowLeft, CheckCircle, Clock, FileText, Search, Upload, XCircle } from "lucide-react";
import EventNavbar from "@/components/EventNavbar";
import EventThemeProvider from "@/components/EventThemeProvider";

type RegResult = {
  found: boolean;
  regNumber?: string;
  name?: string;
  category?: string;
  paymentStatus?: string;
  paymentStatusCode?: string;
  status?: string;
  bibNumber?: number;
  paymentProof?: string | null;
  rejectionReason?: string | null;
  message?: string;
};

export default function CekPage() {
  const router = useRouter();
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
      const normalizedReg = query.trim().toUpperCase();
      const res = await fetch(`/api/check-registration?reg=${encodeURIComponent(normalizedReg)}`, {
        cache: "no-store",
      });
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
    <EventThemeProvider eventType="futuristic-run">
      <main
        className="page-animate min-h-screen relative overflow-hidden"
        style={{ background: "linear-gradient(180deg, #0A0E27 0%, #0F1535 50%, #0A0E27 100%)" }}
      >
        <EventNavbar
          brand={{ title: "Futuristic Run", subtitle: "2026", href: "/futuristic-run" }}
          navLinks={[{ label: "Kembali ke Info", href: "/futuristic-run", isRoute: true }]}
          registerPath="/futuristic-run/daftar"
          registerLabel="DAFTAR"
          theme="dark"
          accentColor="#00E5FF"
        />

        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] rounded-full blur-3xl opacity-10 bg-gradient-to-r from-[#00E5FF] to-[#8B00FF]" />

        <div className="relative z-10 mx-auto max-w-2xl px-4 pb-24 pt-28 sm:px-6">
          <button
            type="button"
            onClick={() => router.back()}
            aria-label="Kembali"
            className="mb-8 inline-flex min-h-11 items-center gap-2 rounded-xl border border-[#00E5FF]/25 bg-[#071229]/70 px-4 text-sm font-bold tracking-wider text-[#D7E8FF] shadow-[0_0_18px_rgba(0,229,255,0.10)] transition hover:border-[#00E5FF]/50 hover:bg-[#00E5FF]/10"
            style={{ fontFamily: "Orbitron, sans-serif" }}
          >
            <ArrowLeft size={16} />
            BACK
          </button>

          <div className="text-center mb-10">
            <div className="badge-neon inline-block mb-4">CEK STATUS</div>
            <h1 className="text-3xl font-black text-white mb-3 sm:text-5xl" style={{ fontFamily: "Orbitron, sans-serif" }}>
              CEK PENDAFTARAN
            </h1>
            <p className="text-[#B0C4DE]">Masukkan nomor registrasi Anda untuk melihat status</p>
          </div>

          {/* Search */}
          <div className="card-animated glass-card rounded-2xl border border-[#1E3A5F] p-6 mb-6">
            <div className="flex flex-col gap-3 sm:flex-row">
              <input
                className="neon-input flex-1 min-h-12 rounded-xl px-4 py-3 text-sm"
                placeholder="Contoh: FR2026-0001"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && check()}
              />
              <button
                onClick={check}
                disabled={loading || !query.trim()}
                className="btn-neon flex min-h-12 items-center justify-center gap-2 rounded-xl px-8 py-3 text-sm cursor-pointer disabled:opacity-50 font-bold tracking-wider"
              >
                {loading ? (
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <Search size={16} />
                )}
                CEK STATUS
              </button>
            </div>
          </div>

          {/* Result */}
          {result && (
            <div className="card-animated glass-card rounded-2xl border p-5 sm:p-6" style={{ borderColor: `${accentColor}40` }}>
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
                  <div className="space-y-3 rounded-2xl border border-white/8 bg-white/5 p-4">
                    {[
                      { label: "Nama", value: result.name },
                      { label: "Kategori", value: result.category },
                      { label: "Pembayaran", value: undefined, node: statusBadge(result.paymentStatusCode ?? result.paymentStatus ?? result.status ?? "") },
                      ...(result.bibNumber ? [{ label: "No. BIB", value: String(result.bibNumber) }] : []),
                    ].map((row) => (
                      <div key={row.label} className="flex flex-col gap-1 text-sm min-[420px]:flex-row min-[420px]:items-center min-[420px]:justify-between">
                        <span className="text-[#B0C4DE]">{row.label}</span>
                        {row.node ?? <span className="text-white font-semibold">{row.value}</span>}
                      </div>
                    ))}
                  </div>

                  {result.rejectionReason && (
                    <div className="rounded-2xl border border-red-400/20 bg-red-500/10 p-4 text-left text-sm text-red-100">
                      <p className="font-semibold text-red-200">Catatan panitia</p>
                      <p className="mt-1">{result.rejectionReason}</p>
                    </div>
                  )}

                  {result.paymentProof && (
                    <div className="rounded-2xl border border-white/10 bg-white/5 p-4 text-left">
                      <p className="mb-2 text-sm font-semibold text-white">Bukti pembayaran tersimpan</p>
                      {result.paymentProof.endsWith(".pdf") ? (
                        <a href={result.paymentProof} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-[#00E5FF]">
                          <FileText size={16} /> Lihat bukti PDF
                        </a>
                      ) : (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={result.paymentProof} alt="Bukti pembayaran" className="max-h-72 w-full rounded-xl object-contain" />
                      )}
                    </div>
                  )}

                  <div className="rounded-2xl border border-[#00E5FF]/20 bg-[#00E5FF]/8 p-4 text-left">
                    <p className="text-sm font-bold text-white">Langkah lanjut</p>
                    <p className="mt-1 text-sm leading-relaxed text-[#B0C4DE]">
                      {result.paymentStatusCode === "verified"
                        ? "Pembayaran sudah terverifikasi. Simpan nomor registrasi dan ikuti informasi race pack dari panitia."
                        : result.paymentStatusCode === "rejected"
                          ? "Upload ulang bukti pembayaran yang valid melalui halaman konfirmasi."
                          : result.paymentProof
                            ? "Bukti sudah masuk. Tunggu verifikasi panitia dalam 1x24 jam kerja."
                            : "Selesaikan pembayaran, lalu upload bukti pembayaran melalui halaman konfirmasi."}
                    </p>
                    <div className="mt-4 flex flex-col gap-2 sm:flex-row">
                      {result.paymentStatusCode === "rejected" || !result.paymentProof ? (
                        <Link
                          href={`/konfirmasi?reg=${encodeURIComponent(result.regNumber ?? query)}${isFunBike ? "&event=fun-bike" : "&event=futuristic-run"}#upload-bukti`}
                          className="btn-neon inline-flex min-h-11 items-center justify-center gap-2 rounded-xl px-4 text-sm"
                        >
                          <Upload size={15} /> Upload Bukti
                        </Link>
                      ) : null}
                      {result.paymentStatusCode === "verified" ? (
                        <Link
                          href={`/konfirmasi?reg=${encodeURIComponent(result.regNumber ?? query)}&event=futuristic-run`}
                          className="btn-neon inline-flex min-h-11 items-center justify-center gap-2 rounded-xl px-4 text-sm"
                        >
                          <FileText size={15} /> Unduh PDF Terverifikasi
                        </Link>
                      ) : null}
                      <Link
                        href={isFunBike ? "/fun-bike" : "/futuristic-run"}
                        className="inline-flex min-h-11 items-center justify-center rounded-xl border border-white/10 px-4 text-sm font-semibold text-[#D7E8FF] transition hover:bg-white/5"
                      >
                        Lihat Info Event
                      </Link>
                    </div>
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
    </EventThemeProvider>
  );
}
