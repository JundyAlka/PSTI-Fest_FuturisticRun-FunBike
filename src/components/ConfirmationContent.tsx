"use client";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { CheckCircle, Download, Share2, Home, ArrowRight, Upload, AlertCircle, Loader2, FileText } from "lucide-react";
import { Suspense, useRef, useState } from "react";
import { PAYMENT_PROOF_MAX_SIZE, PAYMENT_PROOF_TYPES } from "@/lib/validations";
import { trackPaymentProof } from "@/lib/analytics";

function Content() {
  const params = useSearchParams();
  const reg = params.get("reg") || "FR2026-0000";
  const event = params.get("event") || "futuristic-run";
  const isFunBike = event === "fun-bike";

  // Upload state
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [uploadError, setUploadError] = useState("");

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadError("");

    if (!PAYMENT_PROOF_TYPES.includes(file.type)) {
      setUploadError("Format tidak didukung. Gunakan JPG, PNG, WebP, atau PDF.");
      return;
    }
    if (file.size > PAYMENT_PROOF_MAX_SIZE) {
      setUploadError("Ukuran file maksimal 5MB.");
      return;
    }

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await fetch(`/api/upload-proof?regNumber=${encodeURIComponent(reg)}`, {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (!res.ok) {
        setUploadError(data.error || "Gagal mengunggah bukti pembayaran.");
      } else {
        setUploadSuccess(true);
        trackPaymentProof(event, reg);
      }
    } catch {
      setUploadError("Terjadi kesalahan jaringan. Coba lagi.");
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const eventName = isFunBike ? "Fun Bike 2026" : "Futuristic RUN 2026";
  const accentColor = isFunBike ? "#FF6B2C" : "#00E5FF";
  const accentColor2 = isFunBike ? "#7BC142" : "#2A4FFF";
  const bgGlow = isFunBike
    ? "from-[#FF6B2C]/20 to-[#F59E0B]/20"
    : "from-[#00E5FF]/20 to-[#2A4FFF]/20";

  const handleDownloadPDF = () => {
    const printWindow = window.open("", "_blank", "width=600,height=800");
    if (!printWindow) return;
    printWindow.document.write(`<!DOCTYPE html><html><head><title>Bukti Pendaftaran - ${reg}</title>
      <style>
        body { font-family: Arial, sans-serif; padding: 40px; color: #0A0E27; }
        .header { text-align: center; border-bottom: 3px solid ${accentColor}; padding-bottom: 20px; margin-bottom: 20px; }
        .header h1 { font-size: 24px; margin: 0; color: ${accentColor}; }
        .header h2 { font-size: 14px; color: #666; margin: 5px 0 0; }
        .reg-number { font-size: 32px; font-weight: 900; color: ${accentColor}; text-align: center; margin: 20px 0; letter-spacing: 2px; }
        .info { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin: 20px 0; }
        .info-item label { display: block; font-size: 11px; color: #999; text-transform: uppercase; }
        .info-item span { display: block; font-size: 14px; font-weight: 600; }
        .steps { margin: 20px 0; padding: 15px; background: #f5f5f5; border-radius: 8px; }
        .steps h3 { font-size: 14px; margin: 0 0 10px; }
        .steps ol { margin: 0; padding-left: 20px; font-size: 13px; line-height: 1.8; }
        .footer { text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee; font-size: 11px; color: #999; }
        @media print { body { padding: 20px; } }
      </style></head><body>
      <div class="header"><h1>PSTI FEST 2026</h1><h2>${eventName}</h2></div>
      <div class="reg-number">${reg}</div>
      <div class="info">
        <div class="info-item"><label>Event</label><span>${eventName}</span></div>
        <div class="info-item"><label>Tanggal Event</label><span>22 Juni 2026</span></div>
        <div class="info-item"><label>Lokasi</label><span>Purworejo, Jawa Tengah</span></div>
        <div class="info-item"><label>Status</label><span>Menunggu Pembayaran</span></div>
      </div>
      <div class="steps"><h3>Langkah Selanjutnya:</h3><ol>
        <li>Cek email untuk instruksi pembayaran</li>
        <li>Selesaikan pembayaran dalam 1×24 jam</li>
        <li>Upload bukti pembayaran di pstifest.com/konfirmasi</li>
        <li>Tunggu verifikasi dari panitia (1×24 jam kerja)</li>
        <li>Ambil Race Pack pada 20–21 Juni 2026</li>
      </ol></div>
      <div class="footer"><p>Dicetak: ${new Date().toLocaleString("id-ID")}</p><p>&copy; 2026 PSTI FEST — pstifest.com</p></div>
      <script>window.onload = () => { setTimeout(() => window.print(), 300); }</script>
      </body></html>`);
    printWindow.document.close();
  };

  const shareText = `Saya baru mendaftar ${eventName}! Reg: ${reg} 🏃\nDaftar juga di pstifest.com`;
  const shareUrl = "https://pstifest.com";

  return (
    <div className="section-reveal relative z-10 max-w-lg mx-auto px-4 sm:px-6 py-28 text-center">
      {/* Success icon */}
      <div className="flex justify-center mb-8">
        <div className="relative">
          <div
            className={`w-28 h-28 rounded-full bg-gradient-to-br ${bgGlow} flex items-center justify-center border-2`}
            style={{ borderColor: `${accentColor}80` }}
          >
            <CheckCircle size={52} style={{ color: accentColor }} strokeWidth={1.5} />
          </div>
          <div
            className="absolute -top-2 -right-2 w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white"
            style={{ background: `linear-gradient(135deg, ${accentColor}, ${accentColor2})` }}
          >
            ✓
          </div>
        </div>
      </div>

      <div className="badge-neon inline-block mb-4">SUKSES</div>

      <h1 className="text-3xl sm:text-4xl font-black text-white mb-2" style={{ fontFamily: "Orbitron, sans-serif" }}>
        PENDAFTARAN
      </h1>
      <h2
        className="text-2xl sm:text-3xl font-black mb-6"
        style={{
          fontFamily: "Orbitron, sans-serif",
          background: `linear-gradient(135deg, ${accentColor}, ${accentColor2})`,
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          backgroundClip: "text",
        }}
      >
        BERHASIL!
      </h2>

      {/* Reg card */}
      <div className="glass-premium rounded-2xl p-6 border mb-6 text-left" style={{ borderColor: `${accentColor}30` }}>
        <div className="text-center mb-4">
          <div className="text-xs text-[#B0C4DE] tracking-widest mb-1" style={{ fontFamily: "Orbitron, sans-serif" }}>
            NOMOR REGISTRASI
          </div>
          <div
            className="text-2xl font-black"
            style={{ fontFamily: "Orbitron, sans-serif", color: accentColor }}
          >
            {reg}
          </div>
        </div>
        <div className="h-px bg-gradient-to-r from-transparent to-transparent mb-4" style={{ backgroundImage: `linear-gradient(90deg, transparent, ${accentColor}40, transparent)` }} />
        <p className="text-[#B0C4DE] text-sm text-center leading-relaxed">
          Konfirmasi pendaftaran telah dikirim ke email Anda. Simpan nomor registrasi ini untuk keperluan selanjutnya.
        </p>
      </div>

      {/* Steps */}
      <div className="glass-premium rounded-2xl p-6 border mb-8 text-left" style={{ borderColor: "rgba(255,255,255,0.06)" }}>
        <h3 className="text-white font-semibold text-sm mb-4" style={{ fontFamily: "Orbitron, sans-serif" }}>
          LANGKAH SELANJUTNYA
        </h3>
        <div className="stagger-list space-y-3">
          {[
            { num: "01", text: "Cek email Anda untuk instruksi pembayaran" },
            { num: "02", text: "Selesaikan pembayaran dalam 1×24 jam" },
            { num: "03", text: "Tunggu verifikasi dari panitia (1×24 jam kerja)" },
            { num: "04", text: "Ambil Race Pack pada 20–21 Juni 2026" },
            { num: "05", text: `Hadir dan nikmati ${eventName}! 🏁` },
          ].map((s) => (
            <div key={s.num} className="flex items-start gap-3">
              <div
                className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 text-xs font-bold"
                style={{
                  background: `${accentColor}15`,
                  border: `1px solid ${accentColor}40`,
                  color: accentColor,
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

      {/* Payment Proof Upload */}
      <div className="glass-premium rounded-2xl p-6 border mb-6 text-left" style={{ borderColor: `${accentColor}30` }}>
        <h3 className="text-white font-semibold text-sm mb-3" style={{ fontFamily: "Orbitron, sans-serif" }}>
          UPLOAD BUKTI PEMBAYARAN
        </h3>

        {uploadSuccess ? (
          <div className="flex items-center gap-2 text-green-400 text-sm">
            <CheckCircle size={16} />
            <span>Bukti pembayaran berhasil diunggah! Tunggu verifikasi panitia.</span>
          </div>
        ) : (
          <>
            <p className="text-[#B0C4DE] text-xs mb-3">
              Selesaikan pembayaran terlebih dahulu, lalu upload bukti transfer di sini.
            </p>
            <label
              className="flex items-center justify-center gap-2 cursor-pointer rounded-xl border-2 border-dashed py-4 px-4 transition-colors hover:border-opacity-80"
              style={{ borderColor: `${accentColor}60`, color: accentColor }}
            >
              {uploading ? (
                <>
                  <Loader2 size={18} className="animate-spin" />
                  <span className="text-sm">Mengunggah...</span>
                </>
              ) : (
                <>
                  <Upload size={18} />
                  <span className="text-sm font-semibold">Pilih File (JPG/PNG/WebP/PDF, maks 5MB)</span>
                </>
              )}
              <input
                ref={fileInputRef}
                type="file"
                accept=".jpg,.jpeg,.png,.webp,.pdf"
                className="hidden"
                onChange={handleUpload}
                disabled={uploading}
              />
            </label>
            {uploadError && (
              <div className="flex items-start gap-2 mt-3 text-red-400 text-xs">
                <AlertCircle size={14} className="flex-shrink-0 mt-0.5" />
                <span>{uploadError}</span>
              </div>
            )}
          </>
        )}
      </div>

      {/* Actions */}
      <div className="flex flex-col sm:flex-row gap-3 mb-3">
        <button
          onClick={handleDownloadPDF}
          className="btn-neon flex items-center justify-center gap-2 px-6 py-3 rounded-xl text-sm flex-1 cursor-pointer"
        >
          <FileText size={16} />
          Download Bukti PDF
        </button>
        <button
          className="btn-outline-neon flex items-center justify-center gap-2 px-6 py-3 rounded-xl text-sm flex-1 cursor-pointer"
          onClick={() => navigator.share?.({ title: eventName, text: shareText, url: shareUrl })}
        >
          <Share2 size={16} />
          Bagikan
        </button>
      </div>

      {/* Social Share Links */}
      <div className="flex justify-center gap-3 mb-4">
        <a
          href={`https://wa.me/?text=${encodeURIComponent(shareText)}`}
          target="_blank" rel="noopener noreferrer"
          className="text-xs text-[#B0C4DE] hover:text-green-400 transition-colors"
        >WhatsApp</a>
        <span className="text-[#1E3A5F]">|</span>
        <a
          href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`}
          target="_blank" rel="noopener noreferrer"
          className="text-xs text-[#B0C4DE] hover:text-[#1DA1F2] transition-colors"
        >Twitter/X</a>
        <span className="text-[#1E3A5F]">|</span>
        <a
          href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}&quote=${encodeURIComponent(shareText)}`}
          target="_blank" rel="noopener noreferrer"
          className="text-xs text-[#B0C4DE] hover:text-[#4267B2] transition-colors"
        >Facebook</a>
      </div>

      <Link
        href="/"
        className="mt-4 flex items-center justify-center gap-2 text-sm text-[#B0C4DE] hover:text-[#00E5FF] transition-colors"
      >
        <Home size={14} /> Kembali ke PSTI FEST <ArrowRight size={14} />
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
