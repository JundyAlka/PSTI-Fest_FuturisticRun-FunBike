"use client";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { CheckCircle, Download, Share2, Home, ArrowRight } from "lucide-react";
import { Suspense } from "react";

function Content() {
  const params = useSearchParams();
  const reg = params.get("reg") || "FR2026-0000";

  return (
    <div className="section-reveal relative z-10 max-w-lg mx-auto px-4 sm:px-6 py-28 text-center">
      {/* Success icon */}
      <div className="flex justify-center mb-8">
        <div className="relative">
          <div className="w-28 h-28 rounded-full bg-gradient-to-br from-[#00E5FF]/20 to-[#2A4FFF]/20 flex items-center justify-center border-2 border-[#00E5FF]/50 glow-cyan">
            <CheckCircle size={52} className="text-[#00E5FF]" strokeWidth={1.5} />
          </div>
          <div className="absolute -top-2 -right-2 w-8 h-8 bg-gradient-to-br from-[#00E5FF] to-[#2A4FFF] rounded-full flex items-center justify-center text-xs font-bold text-white">
            ✓
          </div>
        </div>
      </div>

      <div className="badge-neon inline-block mb-4">SUKSES</div>

      <h1
        className="text-3xl sm:text-4xl font-black text-white mb-2"
        style={{ fontFamily: "Orbitron, sans-serif" }}
      >
        PENDAFTARAN
      </h1>
      <h2
        className="text-2xl sm:text-3xl font-black mb-6"
        style={{
          fontFamily: "Orbitron, sans-serif",
          background: "linear-gradient(135deg, #00E5FF, #2A4FFF)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          backgroundClip: "text",
        }}
      >
        BERHASIL!
      </h2>

      {/* Reg card */}
      <div className="card-animated glass-card rounded-2xl p-6 border border-[#00E5FF]/30 mb-6 text-left">
        <div className="text-center mb-4">
          <div className="text-xs text-[#B0C4DE] tracking-widest mb-1" style={{ fontFamily: "Orbitron, sans-serif" }}>
            NOMOR REGISTRASI
          </div>
          <div
            className="text-2xl font-black glow-cyan-text"
            style={{ fontFamily: "Orbitron, sans-serif", color: "#00E5FF" }}
          >
            {reg}
          </div>
        </div>
        <div className="h-px bg-gradient-to-r from-transparent via-[#00E5FF]/30 to-transparent mb-4" />
        <p className="text-[#B0C4DE] text-sm text-center leading-relaxed">
          Konfirmasi pendaftaran telah dikirim ke email Anda. Simpan nomor registrasi ini untuk keperluan selanjutnya.
        </p>
      </div>

      {/* Steps */}
      <div className="card-animated glass-card rounded-xl p-5 border border-[#1E3A5F] mb-8 text-left">
        <h3 className="text-white font-semibold text-sm mb-4" style={{ fontFamily: "Orbitron, sans-serif" }}>
          LANGKAH SELANJUTNYA
        </h3>
        <div className="stagger-list space-y-3">
          {[
            { num: "01", text: "Cek email Anda untuk instruksi pembayaran" },
            { num: "02", text: "Selesaikan pembayaran dalam 1×24 jam" },
            { num: "03", text: "Tunggu verifikasi dari panitia (1×24 jam kerja)" },
            { num: "04", text: "Ambil Race Pack pada 20–21 Juni 2026" },
            { num: "05", text: "Hadir dan nikmati Futuristic RUN 2026! 🏁" },
          ].map((s) => (
            <div key={s.num} className="flex items-start gap-3">
              <div
                className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 text-xs font-bold"
                style={{
                  background: "rgba(0,229,255,0.1)",
                  border: "1px solid rgba(0,229,255,0.3)",
                  color: "#00E5FF",
                  fontFamily: "Orbitron, sans-serif",
                }}
              >
                {s.num}
              </div>
              <p className="text-[#B0C4DE] text-sm pt-1">{s.text}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-col sm:flex-row gap-3">
        <button className="btn-neon flex items-center justify-center gap-2 px-6 py-3 rounded-xl text-sm flex-1 cursor-pointer">
          <Download size={16} />
          Download Bukti
        </button>
        <button
          className="btn-outline-neon flex items-center justify-center gap-2 px-6 py-3 rounded-xl text-sm flex-1 cursor-pointer"
          onClick={() => navigator.share?.({ title: "Futuristic RUN 2026", text: `Saya baru mendaftar Futuristic RUN 2026! Reg: ${reg}`, url: "https://futuristicrun.com" })}
        >
          <Share2 size={16} />
          Bagikan
        </button>
      </div>

      <Link
        href="/"
        className="mt-4 flex items-center justify-center gap-2 text-sm text-[#B0C4DE] hover:text-[#00E5FF] transition-colors"
      >
        <Home size={14} /> Kembali ke Beranda <ArrowRight size={14} />
      </Link>
    </div>
  );
}

export default function ConfirmationContent() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center text-[#B0C4DE]">Loading...</div>}>
      <Content />
    </Suspense>
  );
}
