"use client";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { AlertCircle, ArrowRight, CheckCircle, Copy, CreditCard, FileText, Home, Loader2, QrCode, RefreshCw, Share2, Upload } from "lucide-react";
import { Suspense, useCallback, useEffect, useRef, useState } from "react";
import { PAYMENT_PROOF_MAX_SIZE, PAYMENT_PROOF_TYPES } from "@/lib/validations";
import { trackPaymentProof } from "@/lib/analytics";
import { DEFAULT_SITE_URL, FEST_FULL_NAME, FEST_NAME } from "@/content/brand";
import { EVENTS } from "@/content/events";
import { TBD_LABEL } from "@/components/ui/TbdBadge";

type PaymentInfo = {
  bankName: string;
  bankAccount: string;
  bankHolder: string;
  qrisNmid: string;
  qrisImageUrl: string;
  registrationFee: number;
  transferEnabled: boolean;
  qrisEnabled: boolean;
};

type RegistrationStatus = {
  found: boolean;
  paymentStatus?: "pending" | "verified" | "rejected" | string;
  status?: string;
  paymentProof?: string | null;
  rejectionReason?: string | null;
  message?: string;
};

function ConfirmationGate({ loading, message }: { loading?: boolean; message?: string }) {
  return (
    <div className="relative z-10 mx-auto flex min-h-[calc(100vh-5rem)] max-w-xl items-center px-4 py-24 sm:px-6">
      <div className="glass-premium w-full rounded-2xl border border-white/10 p-6 text-center sm:p-8">
        {loading ? (
          <Loader2 size={42} className="mx-auto animate-spin text-[#00E5FF]" />
        ) : (
          <AlertCircle size={42} className="mx-auto text-[#F59E0B]" />
        )}
        <h1 className="mt-5 text-xl font-black text-white sm:text-2xl" style={{ fontFamily: "Orbitron, sans-serif" }}>
          {loading ? "MEMERIKSA REGISTRASI" : "REGISTRASI BELUM DITEMUKAN"}
        </h1>
        <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-[#B0C4DE]">
          {loading
            ? "Kami sedang memastikan nomor registrasi Anda tersimpan di database."
            : message ?? "Selesaikan formulir pendaftaran terlebih dahulu. Halaman pembayaran hanya dapat dibuka dengan nomor registrasi yang valid."}
        </p>
        {!loading && (
          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            <Link href="/futuristic-run/daftar" className="btn-neon inline-flex min-h-12 items-center justify-center rounded-xl px-4 text-sm">
              Daftar Futuristic Run
            </Link>
            <Link href="/fun-bike/daftar" className="btn-outline-neon inline-flex min-h-12 items-center justify-center rounded-xl px-4 text-sm">
              Daftar Futuristic Bike
            </Link>
            <Link href="/cek" className="inline-flex min-h-12 items-center justify-center rounded-xl border border-white/10 px-4 text-sm font-semibold text-[#D7E8FF] sm:col-span-2">
              Sudah daftar? Cek Registrasi
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}

function Content() {
  const params = useSearchParams();
  const reg = params.get("reg")?.trim().toUpperCase() ?? "";
  const isRegFormatValid = /^(FR|FB)2026-\d{4,}$/.test(reg);
  const event = reg.startsWith("FB") ? "fun-bike" : "futuristic-run";
  const isFunBike = event === "fun-bike";

  // Upload state
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [uploadError, setUploadError] = useState("");
  const [localPreview, setLocalPreview] = useState<{ url: string; type: string; name: string } | null>(null);
  const [copied, setCopied] = useState("");
  const [paymentInfo, setPaymentInfo] = useState<PaymentInfo | null>(null);
  const [paymentLoading, setPaymentLoading] = useState(true);
  const [paymentError, setPaymentError] = useState("");
  const [registrationStatus, setRegistrationStatus] = useState<RegistrationStatus | null>(null);
  const [statusLoading, setStatusLoading] = useState(true);

  const loadPaymentInfo = useCallback(() => {
    setPaymentLoading(true);
    setPaymentError("");
    fetch(`/api/payment-info?eventType=${encodeURIComponent(event)}`, { cache: "no-store" })
      .then(async (res) => {
        if (!res.ok) throw new Error("payment-info");
        return res.json();
      })
      .then((data: PaymentInfo) => setPaymentInfo(data))
      .catch(() => setPaymentError("Instruksi pembayaran belum bisa dimuat. Coba lagi sebentar."))
      .finally(() => setPaymentLoading(false));
  }, [event]);

  const loadRegistrationStatus = useCallback(() => {
    if (!isRegFormatValid) {
      setRegistrationStatus({ found: false, message: "Nomor registrasi tidak valid. Silakan daftar atau cek nomor registrasi Anda." });
      setStatusLoading(false);
      return;
    }
    setStatusLoading(true);
    fetch(`/api/check-registration?regNumber=${encodeURIComponent(reg)}`, { cache: "no-store" })
      .then(async (res) => {
        if (!res.ok) throw new Error("check-registration");
        return res.json();
      })
      .then((data: RegistrationStatus) => setRegistrationStatus(data))
      .catch(() => setRegistrationStatus({ found: false, message: "Status pembayaran belum bisa dimuat." }))
      .finally(() => setStatusLoading(false));
  }, [isRegFormatValid, reg]);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      loadRegistrationStatus();
    }, 0);
    return () => window.clearTimeout(timer);
  }, [loadRegistrationStatus]);

  useEffect(() => {
    if (!registrationStatus?.found) return;
    const timer = window.setTimeout(loadPaymentInfo, 0);
    return () => window.clearTimeout(timer);
  }, [loadPaymentInfo, registrationStatus?.found]);

  useEffect(() => {
    return () => {
      if (localPreview) URL.revokeObjectURL(localPreview.url);
    };
  }, [localPreview]);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadError("");

    if (!isRegFormatValid || !registrationStatus?.found) {
      setUploadError("Registrasi belum ditemukan. Selesaikan pendaftaran atau cek nomor registrasi Anda.");
      return;
    }

    if (!PAYMENT_PROOF_TYPES.includes(file.type)) {
      setUploadError("Format tidak didukung. Gunakan JPG, PNG, WebP, atau PDF.");
      return;
    }
    if (file.size > PAYMENT_PROOF_MAX_SIZE) {
      setUploadError("Ukuran file maksimal 5MB.");
      return;
    }

    const preview = { url: URL.createObjectURL(file), type: file.type, name: file.name };
    setLocalPreview((current) => {
      if (current) URL.revokeObjectURL(current.url);
      return preview;
    });
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
        setRegistrationStatus((current) => ({
          ...(current ?? { found: true }),
          found: true,
          paymentStatus: "pending",
          paymentProof: preview.url,
          rejectionReason: null,
        }));
        trackPaymentProof(event, reg);
      }
    } catch {
      setUploadError("Terjadi kesalahan jaringan. Coba lagi.");
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const eventName = `${isFunBike ? EVENTS["fun-bike"].name : EVENTS["futuristic-run"].name} 2026`;
  const accentColor = isFunBike ? "#FF6B2C" : "#00E5FF";
  const accentColor2 = isFunBike ? "#7BC142" : "#2A4FFF";
  const bgGlow = isFunBike
    ? "from-[#FF6B2C]/20 to-[#F59E0B]/20"
    : "from-[#00E5FF]/20 to-[#2A4FFF]/20";

  if (!isRegFormatValid) {
    return <ConfirmationGate message="Halaman ini memerlukan nomor registrasi yang valid. Silakan selesaikan pendaftaran terlebih dahulu." />;
  }

  if (statusLoading) {
    return <ConfirmationGate loading />;
  }

  if (!registrationStatus?.found) {
    return <ConfirmationGate message={registrationStatus?.message} />;
  }

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
      <div class="header"><h1>${FEST_FULL_NAME}</h1><h2>${eventName}</h2></div>
      <div class="reg-number">${reg}</div>
      <div class="info">
        <div class="info-item"><label>Event</label><span>${eventName}</span></div>
        <div class="info-item"><label>Tanggal Event</label><span>${TBD_LABEL}</span></div>
        <div class="info-item"><label>Lokasi</label><span>${TBD_LABEL}</span></div>
        <div class="info-item"><label>Status</label><span>Menunggu Pembayaran</span></div>
      </div>
      <div class="steps"><h3>Langkah Selanjutnya:</h3><ol>
        <li>Cek email untuk instruksi pembayaran</li>
        <li>Selesaikan pembayaran dalam 1x24 jam</li>
        <li>Upload bukti pembayaran di halaman konfirmasi ${FEST_NAME}</li>
        <li>Tunggu verifikasi dari panitia (1x24 jam kerja)</li>
        <li>Ambil Race Pack sesuai jadwal resmi panitia</li>
      </ol></div>
      <div class="footer"><p>Dicetak: ${new Date().toLocaleString("id-ID")}</p><p>&copy; 2026 ${FEST_NAME}</p></div>
      <script>window.onload = () => { setTimeout(() => window.print(), 300); }</script>
      </body></html>`);
    printWindow.document.close();
  };

  const shareText = `Saya baru mendaftar ${eventName}! Reg: ${reg}`;
  const shareUrl = process.env.NEXT_PUBLIC_SITE_URL || DEFAULT_SITE_URL;
  const feeFormatted = paymentInfo
    ? new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(paymentInfo.registrationFee)
    : TBD_LABEL;
  const paymentProof = localPreview?.url ?? registrationStatus?.paymentProof ?? null;
  const paymentStatus = registrationStatus?.paymentStatus ?? "pending";
  const isRejected = paymentStatus === "rejected";
  const proofAlreadyUploaded = Boolean(paymentProof) || uploadSuccess;
  const canUpload = !proofAlreadyUploaded || isRejected;
  const copyText = async (label: string, value: string) => {
    if (!value || value === "-") return;
    await navigator.clipboard?.writeText(value);
    setCopied(label);
    window.setTimeout(() => setCopied(""), 1300);
  };

  return (
      <div className="section-reveal relative z-10 mx-auto max-w-2xl px-4 py-24 text-center sm:px-6 sm:py-28">
      {/* Success icon */}
      <div className="flex justify-center mb-8">
        <div className="relative">
          <div
            className={`w-28 h-28 rounded-full bg-gradient-to-br ${bgGlow} flex items-center justify-center border-2`}
            style={{ borderColor: `${accentColor}80` }}
          >
            <CheckCircle size={52} style={{ color: accentColor }} strokeWidth={1.5} />
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
            { num: "02", text: "Selesaikan pembayaran dalam 1x24 jam" },
            { num: "03", text: "Tunggu verifikasi dari panitia (1x24 jam kerja)" },
            { num: "04", text: "Ambil Race Pack sesuai jadwal resmi panitia" },
            { num: "05", text: `Hadir dan nikmati ${eventName}!` },
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

      {/* Payment status */}
      <div className="glass-premium rounded-2xl border p-5 text-left mb-6" style={{ borderColor: `${accentColor}30` }}>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs tracking-widest text-[#B0C4DE]" style={{ fontFamily: "Orbitron, sans-serif" }}>
              STATUS PEMBAYARAN
            </p>
            <div className="mt-2 flex items-center gap-2">
              {statusLoading ? (
                <>
                  <Loader2 size={18} className="animate-spin text-[#B0C4DE]" />
                  <span className="text-sm text-[#B0C4DE]">Memuat status...</span>
                </>
              ) : isRejected ? (
                <>
                  <AlertCircle size={18} className="text-red-400" />
                  <span className="text-sm font-bold text-red-300">Pembayaran ditolak</span>
                </>
              ) : proofAlreadyUploaded ? (
                <>
                  <CheckCircle size={18} className="text-green-400" />
                  <span className="text-sm font-bold text-green-300">Bukti sudah diupload</span>
                </>
              ) : (
                <>
                  <AlertCircle size={18} className="text-yellow-300" />
                  <span className="text-sm font-bold text-yellow-200">Menunggu bukti pembayaran</span>
                </>
              )}
            </div>
          </div>
          <Link
            href="/cek"
            className="inline-flex min-h-11 items-center justify-center rounded-xl border border-white/10 px-4 text-sm font-semibold text-[#D7E8FF] transition hover:bg-white/5"
          >
            Cek Status
          </Link>
        </div>
        {isRejected && (
          <div className="mt-4 rounded-xl border border-red-400/20 bg-red-500/10 p-3 text-sm text-red-100">
            {registrationStatus?.rejectionReason
              ? `Catatan panitia: ${registrationStatus.rejectionReason}`
              : "Bukti sebelumnya belum valid. Silakan upload ulang bukti pembayaran yang benar."}
          </div>
        )}
      </div>

      {/* Payment instructions */}
      <div className="glass-premium rounded-2xl border p-5 text-left mb-6" style={{ borderColor: `${accentColor}30` }}>
        <h3 className="text-white font-semibold text-sm mb-4" style={{ fontFamily: "Orbitron, sans-serif" }}>
          INSTRUKSI PEMBAYARAN
        </h3>
        {paymentLoading ? (
          <div className="space-y-3">
            <div className="skeleton-shimmer h-11" />
            <div className="skeleton-shimmer h-24" />
          </div>
        ) : paymentError ? (
          <div className="rounded-xl border border-red-400/20 bg-red-500/10 p-4 text-sm text-red-100">
            <p>{paymentError}</p>
            <button
              type="button"
              onClick={loadPaymentInfo}
              className="mt-3 inline-flex min-h-11 items-center gap-2 rounded-xl bg-white/10 px-4 font-semibold text-white"
            >
              <RefreshCw size={15} /> Coba Lagi
            </button>
          </div>
        ) : paymentInfo ? (
          <div className="space-y-4">
            <div className="grid gap-3 sm:grid-cols-2">
              <button
                type="button"
                onClick={() => copyText("nominal", String(paymentInfo.registrationFee))}
                className="rounded-2xl border border-[#FFD700]/25 bg-[#FFD700]/10 p-4 text-left transition hover:bg-[#FFD700]/15"
              >
                <span className="block text-xs text-[#B0C4DE]">Nominal Transfer</span>
                <span className="mt-1 block text-xl font-black text-[#FFD700]" style={{ fontFamily: "Orbitron, sans-serif" }}>
                  {feeFormatted}
                </span>
                <span className="mt-2 inline-flex items-center gap-1 text-xs text-[#D7E8FF]">
                  <Copy size={13} /> {copied === "nominal" ? "Tersalin" : "Salin nominal"}
                </span>
              </button>
              <button
                type="button"
                onClick={() => copyText("rekening", paymentInfo.bankAccount)}
                className="rounded-2xl border border-[#00E5FF]/25 bg-[#00E5FF]/10 p-4 text-left transition hover:bg-[#00E5FF]/15"
              >
                <span className="block text-xs text-[#B0C4DE]">Rekening {paymentInfo.bankName}</span>
                <span className="mt-1 block break-all text-xl font-black text-[#00E5FF]" style={{ fontFamily: "Orbitron, sans-serif" }}>
                  {paymentInfo.bankAccount}
                </span>
                <span className="mt-2 inline-flex items-center gap-1 text-xs text-[#D7E8FF]">
                  <Copy size={13} /> {copied === "rekening" ? "Tersalin" : "Salin rekening"}
                </span>
              </button>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              {paymentInfo.transferEnabled && (
                <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                  <div className="mb-2 flex items-center gap-2 text-sm font-bold text-white">
                    <CreditCard size={17} style={{ color: accentColor }} />
                    Transfer Bank
                  </div>
                  <ol className="space-y-1.5 text-sm leading-relaxed text-[#B0C4DE]">
                    <li>1. Transfer tepat sesuai nominal.</li>
                    <li>2. Tujuan: {paymentInfo.bankHolder}.</li>
                    <li>3. Simpan bukti transfer lalu upload di bawah.</li>
                  </ol>
                </div>
              )}
              {paymentInfo.qrisEnabled && (
                <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                  <div className="mb-2 flex items-center gap-2 text-sm font-bold text-white">
                    <QrCode size={17} style={{ color: accentColor }} />
                    QRIS
                  </div>
                  <ol className="space-y-1.5 text-sm leading-relaxed text-[#B0C4DE]">
                    <li>1. Scan QRIS dari email atau halaman pendaftaran.</li>
                    <li>2. Pastikan nominal sama: {feeFormatted}.</li>
                    <li>3. Screenshot bukti pembayaran lalu upload.</li>
                  </ol>
                  {paymentInfo.qrisNmid && paymentInfo.qrisNmid !== "-" && (
                    <p className="mt-2 break-all text-xs text-[#B0C4DE]">NMID: {paymentInfo.qrisNmid}</p>
                  )}
                </div>
              )}
            </div>
          </div>
        ) : null}
      </div>

      {/* Payment Proof Upload */}
      <div id="upload-bukti" className="glass-premium scroll-mt-28 rounded-2xl p-6 border mb-6 text-left" style={{ borderColor: `${accentColor}30` }}>
        <h3 className="text-white font-semibold text-sm mb-3" style={{ fontFamily: "Orbitron, sans-serif" }}>
          UPLOAD BUKTI PEMBAYARAN
        </h3>

        {proofAlreadyUploaded && !isRejected ? (
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-green-400 text-sm">
              <CheckCircle size={16} />
              <span>Bukti pembayaran sudah diupload. Tunggu verifikasi panitia.</span>
            </div>
            {paymentProof && (
              <div className="rounded-2xl border border-white/10 bg-white/5 p-3">
                {paymentProof.endsWith(".pdf") || localPreview?.type === "application/pdf" ? (
                  <a href={paymentProof} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-[#00E5FF]">
                    <FileText size={16} /> Lihat file bukti pembayaran
                  </a>
                ) : (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={paymentProof} alt="Preview bukti pembayaran" className="max-h-72 w-full rounded-xl object-contain" />
                )}
              </div>
            )}
          </div>
        ) : uploadSuccess ? (
          <div className="flex items-center gap-2 text-green-400 text-sm">
            <CheckCircle size={16} />
            <span>Bukti pembayaran berhasil diunggah! Tunggu verifikasi panitia.</span>
          </div>
        ) : (
          <>
            <p className="text-[#B0C4DE] text-xs mb-3">
              {canUpload
                ? "Selesaikan pembayaran terlebih dahulu, lalu upload bukti transfer/QRIS di sini."
                : "Bukti pembayaran sudah tersimpan."}
            </p>
            <label
              className="flex min-h-14 cursor-pointer items-center justify-center gap-2 rounded-xl border-2 border-dashed px-4 py-4 transition-colors hover:border-opacity-80"
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
                  <span className="text-sm font-semibold">{isRejected ? "Upload Ulang Bukti" : "Pilih File"} (JPG/PNG/WebP/PDF, maks 5MB)</span>
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
        <Home size={14} /> Kembali ke {FEST_NAME} <ArrowRight size={14} />
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

