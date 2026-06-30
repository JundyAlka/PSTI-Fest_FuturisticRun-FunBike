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

export default function FunBikeCekPage() {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<RegResult | null>(null);

  const accentColor = "#FF6B2C";

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
    <EventThemeProvider eventType="fun-bike">
      <main className="page-animate min-h-screen bg-[#FFF7ED] relative overflow-hidden text-slate-900">
        <EventNavbar
          brand={{ title: "Futuristic Bike", subtitle: "2026", href: "/fun-bike" }}
          navLinks={[{ label: "Kembali ke Info", href: "/fun-bike", isRoute: true }]}
          registerPath="/fun-bike/daftar"
          registerLabel="DAFTAR"
          theme="light"
          accentColor="#FF6B2C"
        />

        <div className="absolute top-0 right-1/4 w-[500px] h-[500px] rounded-full blur-3xl opacity-25 bg-gradient-to-r from-orange-300 to-amber-200 pointer-events-none" />

        <div className="relative z-10 mx-auto max-w-2xl px-4 pb-24 pt-28 sm:px-6">
          <button
            type="button"
            onClick={() => router.back()}
            aria-label="Kembali"
            className="mb-8 inline-flex min-h-11 items-center gap-2 rounded-xl border border-orange-300 bg-white/80 px-4 text-sm font-bold tracking-wider text-slate-700 shadow-sm transition hover:border-orange-400 hover:bg-orange-50"
            style={{ fontFamily: "Orbitron, sans-serif" }}
          >
            <ArrowLeft size={16} />
            KEMBALI
          </button>

          <div className="text-center mb-10">
            <div className="badge-sunrise inline-block mb-4">CEK STATUS</div>
            <h1 className="text-3xl font-black text-slate-900 mb-3 sm:text-5xl" style={{ fontFamily: "Orbitron, sans-serif" }}>
              CEK REGISTRASI
            </h1>
            <p className="text-slate-600">Masukkan nomor registrasi Futuristic Bike Anda</p>
          </div>

          {/* Search */}
          <div className="card-animated glass-premium-light rounded-2xl border border-orange-200/80 p-6 mb-6 shadow-md bg-white/70">
            <div className="flex flex-col gap-3 sm:flex-row">
              <input
                className="w-full flex-1 min-h-12 rounded-xl border border-orange-200 bg-white px-4 py-3 text-sm text-slate-800 placeholder-slate-400 focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500/20 shadow-inner"
                placeholder="Contoh: FB2026-0001"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && check()}
              />
              <button
                onClick={check}
                disabled={loading || !query.trim()}
                className="btn-sunrise flex min-h-12 items-center justify-center gap-2 rounded-xl px-8 py-3 text-sm cursor-pointer disabled:opacity-50 font-bold tracking-wider"
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
            <div className="card-animated glass-premium-light rounded-2xl border border-orange-200 p-5 sm:p-6 shadow-lg bg-white/90">
              {result.found ? (
                <div className="space-y-4">
                  <div className="text-center">
                    <div className="text-xs text-slate-500 tracking-widest mb-1" style={{ fontFamily: "Orbitron, sans-serif" }}>
                      NOMOR REGISTRASI
                    </div>
                    <div className="text-2xl font-black" style={{ fontFamily: "Orbitron, sans-serif", color: accentColor }}>
                      {result.regNumber}
                    </div>
                  </div>
                  <div className="h-px bg-orange-200 my-4" />
                  <div className="space-y-3 rounded-2xl border border-orange-100 bg-orange-50/50 p-4">
                    {[
                      { label: "Nama", value: result.name },
                      { label: "Kategori", value: result.category },
                      { label: "Pembayaran", value: undefined, node: statusBadge(result.paymentStatusCode ?? result.paymentStatus ?? result.status ?? "") },
                      ...(result.bibNumber ? [{ label: "No. BIB", value: String(result.bibNumber) }] : []),
                    ].map((row) => (
                      <div key={row.label} className="flex flex-col gap-1 text-sm min-[420px]:flex-row min-[420px]:items-center min-[420px]:justify-between">
                        <span className="text-slate-600 font-medium">{row.label}</span>
                        {row.node ?? <span className="text-slate-900 font-bold">{row.value}</span>}
                      </div>
                    ))}
                  </div>

                  {result.rejectionReason && (
                    <div className="rounded-2xl border border-red-300 bg-red-50 p-4 text-left text-sm text-red-800">
                      <p className="font-semibold text-red-900">Catatan panitia</p>
                      <p className="mt-1">{result.rejectionReason}</p>
                    </div>
                  )}

                  {result.paymentProof && (
                    <div className="rounded-2xl border border-slate-200 bg-white p-4 text-left shadow-sm">
                      <p className="mb-2 text-sm font-semibold text-slate-800">Bukti pembayaran tersimpan</p>
                      {result.paymentProof.endsWith(".pdf") ? (
                        <a href={result.paymentProof} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-orange-600 hover:underline">
                          <FileText size={16} /> Lihat bukti PDF
                        </a>
                      ) : (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={result.paymentProof} alt="Bukti pembayaran" className="max-h-72 w-full rounded-xl object-contain" />
                      )}
                    </div>
                  )}

                  <div className="rounded-2xl border border-orange-200 bg-orange-50/80 p-4 text-left">
                    <p className="text-sm font-bold text-slate-900">Langkah lanjut</p>
                    <p className="mt-1 text-sm leading-relaxed text-slate-600">
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
                          href={`/konfirmasi?reg=${encodeURIComponent(result.regNumber ?? query)}&event=fun-bike#upload-bukti`}
                          className="btn-sunrise inline-flex min-h-11 items-center justify-center gap-2 rounded-xl px-4 text-sm font-bold"
                        >
                          <Upload size={15} /> Upload Bukti
                        </Link>
                      ) : null}
                      <Link
                        href="/fun-bike"
                        className="inline-flex min-h-11 items-center justify-center rounded-xl border border-orange-200 bg-white px-4 text-sm font-semibold text-slate-700 transition hover:bg-orange-100"
                      >
                        Lihat Info Fun Bike
                      </Link>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-4">
                  <AlertCircle size={32} className="text-red-500 mx-auto mb-3" />
                  <p className="text-slate-700 text-sm font-medium">{result.message ?? "Nomor registrasi tidak ditemukan"}</p>
                </div>
              )}
            </div>
          )}
        </div>
      </main>
    </EventThemeProvider>
  );
}
