"use client";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { AlertCircle, ArrowRight, CheckCircle, Clock, Copy, CreditCard, Download, FileText, Home, Loader2, MessageCircle, QrCode, RefreshCw, Smartphone, Upload, X } from "lucide-react";
import { Suspense, useCallback, useEffect, useRef, useState } from "react";
import { PAYMENT_PROOF_MAX_SIZE, PAYMENT_PROOF_TYPES } from "@/lib/validations";
import { trackPaymentProof } from "@/lib/analytics";
import { DEFAULT_CONTACT_NAME, DEFAULT_WHATSAPP } from "@/content/brand";
import { EVENTS } from "@/content/events";
import { TBD_LABEL } from "@/components/ui/TbdBadge";
import { formatTanggalID, formatWibTime } from "@/lib/eventDate";
import { createRegistrationPdf } from "@/lib/registrationPdf";

type PaymentInfo = {
  methods: Array<"bank" | "dana" | "qris">;
  bank: { enabled: boolean; name: string; account: string; holder: string };
  dana: { enabled: boolean; number: string; holder: string };
  qris: { enabled: boolean; nmid: string; imageUrl: string; merchantName: string };
  registrationFee: number;
  eventDate: string;
  eventLocation: string;
  generalInstructions: string;
  paymentDeadlineHours: number;
};

type RegistrationStatus = {
  found: boolean;
  eventType?: string;
  name?: string;
  phone?: string;
  email?: string;
  category?: string;
  jerseySize?: string;
  bikeType?: string | null;
  emergencyContactName?: string | null;
  emergencyContactPhone?: string | null;
  paymentMethod?: string | null;
  paymentStatus?: "pending" | "verified" | "rejected" | string;
  paymentStatusCode?: "pending" | "verified" | "rejected" | string;
  status?: string;
  paymentProof?: string | null;
  paymentAmount?: number;
  registrationCreatedAt?: string;
  rejectionReason?: string | null;
  message?: string;
};

type ConfirmationEventType = "futuristic-run" | "fun-bike";

function ConfirmationGate({ loading, message, eventType }: { loading?: boolean; message?: string; eventType: ConfirmationEventType }) {
  const isFunBike = eventType === "fun-bike";
  return (
    <div className="relative z-10 mx-auto flex min-h-[calc(100vh-5rem)] max-w-xl items-center px-4 py-24 sm:px-6">
      <div className={`${isFunBike ? "glass-premium-light border-orange-200/70" : "glass-premium border-white/10"} w-full rounded-2xl border p-6 text-center sm:p-8`}>
        {loading ? (
          <Loader2 size={42} className={`mx-auto animate-spin ${isFunBike ? "text-[#FF7A18]" : "text-[#00E5FF]"}`} />
        ) : (
          <AlertCircle size={42} className="mx-auto text-[#F59E0B]" />
        )}
        <h1 className={`mt-5 text-xl font-black sm:text-2xl ${isFunBike ? "text-slate-900" : "text-white"}`} style={{ fontFamily: "Orbitron, sans-serif" }}>
          {loading ? "MEMERIKSA REGISTRASI" : "REGISTRASI BELUM DITEMUKAN"}
        </h1>
        <p className={`mx-auto mt-3 max-w-md text-sm leading-relaxed ${isFunBike ? "text-slate-600" : "text-[#B0C4DE]"}`}>
          {loading
            ? "Kami sedang memastikan nomor registrasi Anda tersimpan di database."
            : message ?? "Selesaikan formulir pendaftaran terlebih dahulu. Halaman pembayaran hanya dapat dibuka dengan nomor registrasi yang valid."}
        </p>
        {!loading && (
          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            <Link href="/futuristic-run/daftar" className={`${isFunBike ? "btn-sunrise" : "btn-neon"} inline-flex min-h-12 items-center justify-center rounded-xl px-4 text-sm`}>
              Daftar Futuristic Run
            </Link>
            <Link href="/fun-bike/daftar" className={`${isFunBike ? "btn-outline-sunrise" : "btn-outline-neon"} inline-flex min-h-12 items-center justify-center rounded-xl px-4 text-sm`}>
              Daftar Futuristic Bike
            </Link>
            <Link href={isFunBike ? "/fun-bike/cek" : "/cek"} className={`inline-flex min-h-12 items-center justify-center rounded-xl border px-4 text-sm font-semibold sm:col-span-2 ${isFunBike ? "border-slate-200 bg-white/70 text-slate-700" : "border-white/10 text-[#D7E8FF]"}`}>
              Sudah daftar? Cek Registrasi
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}

function Content({ eventType }: { eventType: ConfirmationEventType }) {
  const params = useSearchParams();
  const reg = params.get("reg")?.trim().toUpperCase() ?? "";
  const isRegFormatValid = /^(FR|FB)2026-\d{4,}$/.test(reg);
  const event: ConfirmationEventType = reg.startsWith("FB")
    ? "fun-bike"
    : reg.startsWith("FR") ? "futuristic-run" : eventType;
  const isFunBike = event === "fun-bike";
  const accessTokenParam = params.get("accessToken");

  const getRegistrationHeaders = useCallback(() => {
    const headers: Record<string, string> = {};
    const storedToken = typeof window !== "undefined" ? sessionStorage.getItem(`registration-access:${reg}`) : null;
    const storedContact = typeof window !== "undefined" ? sessionStorage.getItem(`registration-contact:${reg}`) : null;
    const accessToken = accessTokenParam ?? storedToken;
    if (accessToken) headers["X-Registration-Token"] = accessToken;
    if (storedContact) headers["X-Registration-Contact"] = storedContact;
    return headers;
  }, [accessTokenParam, reg]);

  // Upload state
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [uploadError, setUploadError] = useState("");
  const [localPreview, setLocalPreview] = useState<{ url: string; type: string; name: string; file: File } | null>(null);
  const [copied, setCopied] = useState("");
  const [paymentInfo, setPaymentInfo] = useState<PaymentInfo | null>(null);
  const [paymentLoading, setPaymentLoading] = useState(true);
  const [paymentError, setPaymentError] = useState("");
  const paymentRequestRef = useRef<AbortController | null>(null);
  const [registrationStatus, setRegistrationStatus] = useState<RegistrationStatus | null>(null);
  const [statusLoading, setStatusLoading] = useState(true);
  const [qrisZoomOpen, setQrisZoomOpen] = useState(false);
  const [generatingPdf, setGeneratingPdf] = useState(false);
  const [pdfError, setPdfError] = useState("");
  const [pdfSuccess, setPdfSuccess] = useState(false);

  const loadPaymentInfo = useCallback(async () => {
    paymentRequestRef.current?.abort();
    const controller = new AbortController();
    paymentRequestRef.current = controller;
    setPaymentLoading(true);
    setPaymentError("");
    const timeout = window.setTimeout(() => controller.abort(), 18_000);
    try {
      const response = await fetch(`/api/payment-info?eventType=${encodeURIComponent(event)}`, {
        cache: "no-store",
        signal: controller.signal,
      });
      if (!response.ok) throw new Error("payment-info");
      setPaymentInfo(await response.json() as PaymentInfo);
    } catch {
      if (paymentRequestRef.current === controller) {
        setPaymentError("Instruksi pembayaran belum bisa dimuat. Coba lagi atau hubungi panitia.");
      }
    } finally {
      window.clearTimeout(timeout);
      if (paymentRequestRef.current === controller) {
        paymentRequestRef.current = null;
        setPaymentLoading(false);
      }
    }
  }, [event]);

  const loadRegistrationStatus = useCallback(() => {
    if (!isRegFormatValid) {
      setRegistrationStatus({ found: false, message: "Nomor registrasi tidak valid. Silakan daftar atau cek nomor registrasi Anda." });
      setStatusLoading(false);
      return;
    }
    setStatusLoading(true);
    fetch(`/api/check-registration?reg=${encodeURIComponent(reg)}`, { cache: "no-store", headers: getRegistrationHeaders() })
      .then(async (res) => {
        if (!res.ok) throw new Error("check-registration");
        return res.json();
      })
      .then((data: RegistrationStatus) => setRegistrationStatus(data))
      .catch(() => setRegistrationStatus({ found: false, message: "Status pembayaran belum bisa dimuat." }))
      .finally(() => setStatusLoading(false));
  }, [getRegistrationHeaders, isRegFormatValid, reg]);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      loadRegistrationStatus();
    }, 0);
    return () => window.clearTimeout(timer);
  }, [loadRegistrationStatus]);

  useEffect(() => {
    if (!registrationStatus?.found) return;
    const timer = window.setTimeout(loadPaymentInfo, 0);
    return () => {
      window.clearTimeout(timer);
      const request = paymentRequestRef.current;
      paymentRequestRef.current = null;
      request?.abort();
    };
  }, [loadPaymentInfo, registrationStatus?.found]);

  useEffect(() => {
    return () => {
      if (localPreview) URL.revokeObjectURL(localPreview.url);
    };
  }, [localPreview]);

  useEffect(() => {
    if (!qrisZoomOpen) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setQrisZoomOpen(false);
    };
    document.addEventListener("keydown", closeOnEscape);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", closeOnEscape);
    };
  }, [qrisZoomOpen]);

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

    const preview = { url: URL.createObjectURL(file), type: file.type, name: file.name, file };
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
        headers: getRegistrationHeaders(),
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
          paymentProof: data.url,
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
  const accentColor = isFunBike ? "#FF7A18" : "#00E5FF";
  const accentColor2 = isFunBike ? "#F59E0B" : "#8B00FF";
  const bgGlow = isFunBike
    ? "from-[#FF7A18]/20 to-[#38BDF8]/20"
    : "from-[#00E5FF]/20 to-[#2A4FFF]/20";

  if (!isRegFormatValid) {
    return <ConfirmationGate eventType={event} message="Halaman ini memerlukan nomor registrasi yang valid. Silakan selesaikan pendaftaran terlebih dahulu." />;
  }

  if (statusLoading) {
    return <ConfirmationGate eventType={event} loading />;
  }

  if (!registrationStatus?.found) {
    return <ConfirmationGate eventType={event} message={registrationStatus?.message} />;
  }

  // Nominal peserta harus berasal dari snapshot harga yang dikunci saat registrasi.
  const totalAmount = registrationStatus?.paymentAmount;
  const feeFormatted = totalAmount
    ? new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(totalAmount)
    : TBD_LABEL;
  const paymentDeadline = paymentInfo && registrationStatus?.registrationCreatedAt
    ? new Date(new Date(registrationStatus.registrationCreatedAt).getTime() + paymentInfo.paymentDeadlineHours * 60 * 60 * 1000)
    : null;
  const paymentProof = localPreview?.url ?? registrationStatus?.paymentProof ?? null;
  const paymentStatus = registrationStatus?.paymentStatusCode ?? registrationStatus?.paymentStatus ?? "pending";
  const isRejected = paymentStatus === "rejected";
  const isVerified = paymentStatus === "verified";
  const proofAlreadyUploaded = Boolean(registrationStatus?.paymentProof) || uploadSuccess;
  const proofReadyForPdf = proofAlreadyUploaded && Boolean(paymentProof);
  const canUpload = !proofAlreadyUploaded || isRejected;
  const cardClass = isFunBike ? "glass-premium-light border-orange-200/70" : "glass-premium";
  const headingClass = isFunBike ? "text-slate-900" : "text-white";
  const mutedClass = isFunBike ? "text-slate-600" : "text-[#B0C4DE]";
  const subtleSurfaceClass = isFunBike
    ? "border-slate-200 bg-white/75 text-slate-700"
    : "border-white/10 bg-white/5 text-[#B0C4DE]";
  const primaryButtonClass = isFunBike ? "btn-sunrise" : "btn-neon";
  const secondaryButtonClass = isFunBike ? "btn-outline-sunrise" : "btn-outline-neon";
  const whatsappNumber = DEFAULT_WHATSAPP.replace(/\D/g, "").replace(/^0/, "62");
  const whatsappText = `Halo panitia ${eventName}, saya ${registrationStatus.name ?? "peserta"}, no registrasi ${reg}. Berikut bukti pembayaran saya (PDF terlampir).`;
  const copyText = async (label: string, value: string) => {
    if (!value || value === "-") return;
    await navigator.clipboard?.writeText(value);
    setCopied(label);
    window.setTimeout(() => setCopied(""), 1300);
  };

  const loadProofForPdf = async () => {
    let blob: Blob;
    if (localPreview?.file) {
      blob = localPreview.file;
    } else if (registrationStatus.paymentProof) {
      const response = await fetch(registrationStatus.paymentProof, { cache: "no-store" });
      if (!response.ok) throw new Error("Bukti pembayaran tersimpan, tetapi filenya tidak dapat dibaca.");
      blob = await response.blob();
    } else {
      throw new Error("Upload bukti pembayaran terlebih dahulu agar PDF lengkap dapat dibuat.");
    }

    let mimeType = blob.type.toLowerCase();
    const sourceName = localPreview?.name ?? registrationStatus.paymentProof ?? "";
    const normalizedSourceName = decodeURIComponent(sourceName.split("?")[0]).toLowerCase();
    if (!["image/jpeg", "image/jpg", "image/png", "image/webp", "application/pdf"].includes(mimeType)) {
      mimeType = normalizedSourceName.endsWith(".pdf") ? "application/pdf"
        : normalizedSourceName.endsWith(".png") ? "image/png"
        : normalizedSourceName.endsWith(".webp") ? "image/webp" : "image/jpeg";
    }

    if (mimeType === "image/webp") {
      const bitmap = await createImageBitmap(blob);
      const canvas = document.createElement("canvas");
      canvas.width = bitmap.width;
      canvas.height = bitmap.height;
      const context = canvas.getContext("2d");
      if (!context) throw new Error("Preview gambar tidak dapat diproses.");
      context.drawImage(bitmap, 0, 0);
      bitmap.close();
      const pngBlob = await new Promise<Blob>((resolve, reject) => {
        canvas.toBlob((result) => result ? resolve(result) : reject(new Error("Konversi gambar gagal.")), "image/png");
      });
      return { bytes: await pngBlob.arrayBuffer(), mimeType: "image/png" };
    }

    if (mimeType === "image/jpg") mimeType = "image/jpeg";
    if (!["image/jpeg", "image/png", "application/pdf"].includes(mimeType)) {
      throw new Error("Format bukti tidak dapat ditanam ke PDF. Gunakan JPG, PNG, atau PDF.");
    }
    return { bytes: await blob.arrayBuffer(), mimeType };
  };

  const handleDownloadPDF = async () => {
    if (!proofReadyForPdf || generatingPdf) {
      setPdfError("Upload bukti pembayaran terlebih dahulu agar PDF lengkap dapat dibuat.");
      return;
    }
    setGeneratingPdf(true);
    setPdfError("");
    setPdfSuccess(false);
    try {
      const proof = await loadProofForPdf();
      const eventDate = paymentInfo
        ? `${formatTanggalID(paymentInfo.eventDate)} ${formatWibTime(paymentInfo.eventDate)} WIB`
        : isFunBike ? "Minggu, 2 Agustus 2026 05.00 WIB" : "Sabtu, 1 Agustus 2026 18.00 WIB";
      const pdfBytes = await createRegistrationPdf({
        regNumber: reg,
        eventName,
        accent: isFunBike ? [1, 0.478, 0.094] : [0, 0.898, 1],
        participant: {
          name: registrationStatus.name ?? "-",
          phone: registrationStatus.phone,
          email: registrationStatus.email,
          category: registrationStatus.category,
          jerseySize: registrationStatus.jerseySize,
          bikeType: isFunBike ? registrationStatus.bikeType ?? "-" : undefined,
          emergencyContactName: registrationStatus.emergencyContactName ?? undefined,
          emergencyContactPhone: registrationStatus.emergencyContactPhone ?? undefined,
        },
        eventDate,
        eventLocation: paymentInfo?.eventLocation && paymentInfo.eventLocation !== "-"
          ? paymentInfo.eventLocation : "Alun-Alun Purworejo",
        paymentAmount: feeFormatted,
        paymentMethod: registrationStatus.paymentMethod === "qris" ? "QRIS" : "Transfer Bank",
        paymentStatus: isVerified ? "Terverifikasi" : isRejected ? "Ditolak" : "Menunggu Verifikasi",
        proof,
        printedAt: new Date().toLocaleString("id-ID", { timeZone: "Asia/Jakarta" }) + " WIB",
      });
      const pdfBlob = new Blob([pdfBytes as BlobPart], { type: "application/pdf" });
      const url = URL.createObjectURL(pdfBlob);
      const anchor = document.createElement("a");
      anchor.href = url;
      anchor.download = `Bukti-Pendaftaran-${reg}.pdf`;
      document.body.appendChild(anchor);
      anchor.click();
      anchor.remove();
      setPdfSuccess(true);
      window.setTimeout(() => URL.revokeObjectURL(url), 1_000);
    } catch (error) {
      setPdfError(error instanceof Error ? error.message : "PDF gagal dibuat. Silakan coba lagi.");
    } finally {
      setGeneratingPdf(false);
    }
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

      <div className={`${isFunBike ? "badge-sunrise" : "badge-neon"} inline-block mb-4`}>SUKSES</div>

      <h1 className={`text-3xl sm:text-4xl font-black mb-2 ${headingClass}`} style={{ fontFamily: "Orbitron, sans-serif" }}>
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
      <div className={`${cardClass} rounded-2xl p-6 border mb-6 text-left`} style={{ borderColor: `${accentColor}30` }}>
        <div className="text-center mb-4">
          <div className={`text-xs tracking-widest mb-1 ${mutedClass}`} style={{ fontFamily: "Orbitron, sans-serif" }}>
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
        <p className={`${mutedClass} text-sm text-center leading-relaxed`}>
          Simpan nomor registrasi ini untuk keperluan selanjutnya.
        </p>
      </div>

      {/* Steps */}
      <div className={`${cardClass} rounded-2xl p-6 border mb-8 text-left`} style={{ borderColor: isFunBike ? "rgba(255,122,24,0.22)" : "rgba(255,255,255,0.06)" }}>
        <h3 className={`${headingClass} font-semibold text-sm mb-4`} style={{ fontFamily: "Orbitron, sans-serif" }}>
          LANGKAH SELANJUTNYA
        </h3>
        <div className="stagger-list space-y-3">
          {[
            { num: "01", text: "Selesaikan pembayaran dalam 24 jam sesuai instruksi di halaman ini." },
            { num: "02", text: "Unduh PDF bukti pendaftaran + bukti bayar (lihat Sprint Y)." },
            { num: "03", text: `Kirim PDF ke WA panitia (${DEFAULT_CONTACT_NAME.split(" ")[0]}) lewat tombol yang tersedia.` },
            { num: "04", text: "Tunggu verifikasi panitia (1x24 jam kerja)." },
            { num: "05", text: "Ambil Race Pack sesuai jadwal resmi panitia." },
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
              <p className={`${mutedClass} text-sm pt-1`}>{s.text}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Payment status */}
      <div className={`${cardClass} rounded-2xl border p-5 text-left mb-6`} style={{ borderColor: `${accentColor}30` }}>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className={`text-xs tracking-widest ${mutedClass}`} style={{ fontFamily: "Orbitron, sans-serif" }}>
              STATUS PEMBAYARAN
            </p>
            <div className="mt-2 flex items-center gap-2">
              {statusLoading ? (
                <>
                  <Loader2 size={18} className={`animate-spin ${mutedClass}`} />
                  <span className={`text-sm ${mutedClass}`}>Memuat status...</span>
                </>
              ) : isVerified ? (
                <>
                  <CheckCircle size={18} className="text-green-400" />
                  <span className={`text-sm font-bold ${isFunBike ? "text-green-700" : "text-green-300"}`}>Terverifikasi</span>
                </>
              ) : isRejected ? (
                <>
                  <AlertCircle size={18} className="text-red-400" />
                  <span className={`text-sm font-bold ${isFunBike ? "text-red-700" : "text-red-300"}`}>Pembayaran ditolak</span>
                </>
              ) : proofAlreadyUploaded ? (
                <>
                  <CheckCircle size={18} className="text-green-400" />
                  <span className={`text-sm font-bold ${isFunBike ? "text-green-700" : "text-green-300"}`}>Menunggu verifikasi</span>
                </>
              ) : (
                <>
                  <AlertCircle size={18} className="text-yellow-300" />
                  <span className={`text-sm font-bold ${isFunBike ? "text-amber-700" : "text-yellow-200"}`}>Menunggu bukti pembayaran</span>
                </>
              )}
            </div>
          </div>
          <button
            type="button"
            onClick={loadRegistrationStatus}
            className={`inline-flex min-h-11 items-center justify-center rounded-xl border px-4 text-sm font-semibold transition ${isFunBike ? "border-orange-200 bg-orange-50 text-[#C25400] hover:bg-orange-100" : "border-white/10 text-[#D7E8FF] hover:bg-white/5"}`}
          >
            Cek Status
          </button>
        </div>
        {isRejected && (
          <div className={`mt-4 rounded-xl border border-red-400/20 bg-red-500/10 p-3 text-sm ${isFunBike ? "text-red-700" : "text-red-100"}`}>
            {registrationStatus?.rejectionReason
              ? `Catatan panitia: ${registrationStatus.rejectionReason}`
              : "Bukti sebelumnya belum valid. Silakan upload ulang bukti pembayaran yang benar."}
          </div>
        )}
      </div>

      {/* Payment instructions */}
      <div className={`${cardClass} rounded-2xl border p-5 text-left mb-6`} style={{ borderColor: `${accentColor}30` }}>
        <h3 className={`${headingClass} font-semibold text-sm mb-4`} style={{ fontFamily: "Orbitron, sans-serif" }}>
          INSTRUKSI PEMBAYARAN
        </h3>
        {paymentLoading ? (
          <div className="space-y-3">
            <div className={`${isFunBike ? "skeleton-shimmer-light" : "skeleton-shimmer"} h-11`} />
            <div className={`${isFunBike ? "skeleton-shimmer-light" : "skeleton-shimmer"} h-24`} />
          </div>
        ) : paymentError ? (
          <div className={`rounded-xl border border-red-400/20 bg-red-500/10 p-4 text-sm ${isFunBike ? "text-red-700" : "text-red-100"}`}>
            <p>{paymentError}</p>
            <p className="mt-2 text-xs text-red-100/80">Jangan melakukan pembayaran ke rekening yang belum terverifikasi.</p>
            <button
              type="button"
              onClick={loadPaymentInfo}
              className={`mt-3 inline-flex min-h-11 items-center gap-2 rounded-xl px-4 font-semibold ${isFunBike ? "bg-red-100 text-red-700" : "bg-white/10 text-white"}`}
            >
              <RefreshCw size={15} /> Coba Lagi
            </button>
          </div>
        ) : paymentInfo ? (
          <div className="space-y-4">
            <div className={`rounded-2xl border p-4 ${isFunBike ? "border-amber-300/70 bg-amber-50" : "border-[#FFD700]/25 bg-[#FFD700]/10"}`}>
              <span className={`block text-xs ${mutedClass}`}>Total Bayar</span>
              <div className="mt-1 flex flex-wrap items-center justify-between gap-3">
                <span className={`text-2xl font-black ${isFunBike ? "text-[#C25400]" : "text-[#FFD700]"}`} style={{ fontFamily: "Orbitron, sans-serif" }}>
                  {feeFormatted}
                </span>
                <button
                  type="button"
                  onClick={() => copyText("nominal", String(totalAmount ?? ""))}
                  className={`inline-flex min-h-11 items-center gap-2 rounded-xl px-4 text-xs font-semibold ${isFunBike ? "bg-orange-100 text-[#C25400]" : "bg-white/10 text-white"}`}
                >
                  <Copy size={14} /> {copied === "nominal" ? "Tersalin" : "Salin nominal"}
                </button>
              </div>
              <div className={`mt-3 flex items-start gap-2 border-t pt-3 text-xs ${isFunBike ? "border-amber-200 text-slate-700" : "border-white/10 text-[#D7E8FF]"}`}>
                <Clock size={14} className="mt-0.5 shrink-0" />
                <span>
                  Batas pembayaran {paymentInfo.paymentDeadlineHours} jam setelah daftar
                  {paymentDeadline ? `, hingga ${paymentDeadline.toLocaleString("id-ID", { timeZone: "Asia/Jakarta" })} WIB` : ""}.
                </span>
              </div>
            </div>

            <div className={`whitespace-pre-line rounded-2xl border p-4 text-sm leading-relaxed ${subtleSurfaceClass}`}>
              {paymentInfo.generalInstructions}
            </div>

            {!paymentInfo.methods.length && (
              <div className={`rounded-xl border border-amber-400/30 bg-amber-500/10 p-4 text-sm ${isFunBike ? "text-amber-800" : "text-amber-100"}`}>
                Metode pembayaran belum tersedia. Hubungi panitia sebelum melakukan pembayaran.
              </div>
            )}

            <div className="grid gap-4 sm:grid-cols-2">
              {paymentInfo.bank.enabled && (
                <div className={`rounded-2xl border p-4 ${isFunBike ? "border-orange-200 bg-orange-50/80" : "border-[#00E5FF]/25 bg-[#00E5FF]/5"}`}>
                  <div className={`mb-3 flex items-center gap-2 text-sm font-bold ${headingClass}`}>
                    <CreditCard size={17} style={{ color: accentColor }} /> Transfer Bank
                  </div>
                  <p className={`text-xs ${mutedClass}`}>{paymentInfo.bank.name}</p>
                  <p className="mt-1 break-all text-xl font-black" style={{ color: accentColor }}>{paymentInfo.bank.account}</p>
                  <p className={`mt-1 text-xs ${mutedClass}`}>a.n. {paymentInfo.bank.holder}</p>
                  <button
                    type="button"
                    onClick={() => copyText("bank", paymentInfo.bank.account)}
                    className={`mt-4 inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-xl px-4 text-sm font-semibold ${isFunBike ? "bg-orange-100 text-[#C25400]" : "bg-[#00E5FF]/10 text-[#00E5FF]"}`}
                  >
                    <Copy size={14} /> {copied === "bank" ? "Tersalin" : "Salin nomor rekening"}
                  </button>
                </div>
              )}

              {paymentInfo.dana.enabled && (
                <div className="rounded-2xl border border-[#118EEA]/30 bg-[#118EEA]/10 p-4">
                  <div className={`mb-3 flex items-center gap-2 text-sm font-bold ${headingClass}`}>
                    <Smartphone size={17} className="text-[#52B6F8]" /> DANA
                  </div>
                  <p className="break-all text-xl font-black text-[#52B6F8]">{paymentInfo.dana.number}</p>
                  <p className={`mt-1 text-xs ${mutedClass}`}>a.n. {paymentInfo.dana.holder}</p>
                  <button
                    type="button"
                    onClick={() => copyText("dana", paymentInfo.dana.number)}
                    className="mt-4 inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-xl bg-[#118EEA]/20 px-4 text-sm font-semibold text-[#8DD2FF]"
                  >
                    <Copy size={14} /> {copied === "dana" ? "Tersalin" : "Salin nomor DANA"}
                  </button>
                </div>
              )}

              {paymentInfo.qris.enabled && (
                <div className={`rounded-2xl border p-4 sm:col-span-2 ${isFunBike ? "border-sky-200 bg-sky-50/80" : "border-[#8B00FF]/30 bg-[#8B00FF]/10"}`}>
                  <div className={`mb-4 flex items-center gap-2 text-sm font-bold ${headingClass}`}>
                    <QrCode size={17} className={isFunBike ? "text-sky-600" : "text-[#C084FC]"} /> QRIS
                  </div>
                  <div className="grid items-center gap-5 sm:grid-cols-[minmax(0,15rem)_1fr]">
                    <button
                      type="button"
                      onClick={() => setQrisZoomOpen(true)}
                      className="mx-auto aspect-square w-full max-w-60 cursor-zoom-in rounded-2xl bg-white p-3"
                      aria-label="Perbesar gambar QRIS"
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={paymentInfo.qris.imageUrl} alt={`QRIS ${paymentInfo.qris.merchantName}`} className="h-full w-full object-contain" />
                    </button>
                    <div>
                      <p className={`font-bold ${headingClass}`}>{paymentInfo.qris.merchantName}</p>
                      <p className={`mt-1 break-all text-xs ${mutedClass}`}>NMID: {paymentInfo.qris.nmid}</p>
                      <ol className={`mt-4 space-y-1.5 text-sm ${mutedClass}`}>
                        <li>1. Buka aplikasi bank atau dompet digital.</li>
                        <li>2. Scan QRIS dan isi nominal tepat {feeFormatted}.</li>
                        <li>3. Simpan lalu unggah bukti pembayaran.</li>
                      </ol>
                      <a
                        href={paymentInfo.qris.imageUrl}
                        download={`QRIS-${event}.png`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`mt-4 inline-flex min-h-11 items-center gap-2 rounded-xl px-4 text-sm font-semibold ${isFunBike ? "bg-sky-100 text-sky-700" : "bg-[#8B00FF]/25 text-[#D8B4FE]"}`}
                      >
                        <Download size={15} /> Unduh QRIS
                      </a>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        ) : null}
      </div>

      {/* Payment Proof Upload */}
      <div id="upload-bukti" className={`${cardClass} scroll-mt-28 rounded-2xl p-6 border mb-6 text-left`} style={{ borderColor: `${accentColor}30` }}>
        <h3 className={`${headingClass} font-semibold text-sm mb-3`} style={{ fontFamily: "Orbitron, sans-serif" }}>
          UPLOAD BUKTI PEMBAYARAN
        </h3>

        {localPreview && !proofAlreadyUploaded && (
          <div className={`mb-4 rounded-2xl border p-3 ${isFunBike ? "border-slate-200 bg-white" : "border-white/10 bg-white/5"}`}>
            <p className={`mb-2 text-xs font-semibold ${mutedClass}`}>Preview: {localPreview.name}</p>
            {localPreview.type === "application/pdf" ? (
              <object data={localPreview.url} type="application/pdf" className="h-64 w-full rounded-xl bg-white" aria-label="Preview bukti pembayaran PDF">
                <a href={localPreview.url} target="_blank" rel="noopener noreferrer" style={{ color: accentColor }}>Lihat bukti PDF</a>
              </object>
            ) : (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={localPreview.url} alt="Preview bukti pembayaran" className="max-h-72 w-full rounded-xl object-contain" />
            )}
          </div>
        )}

        {proofAlreadyUploaded && !isRejected ? (
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-green-400 text-sm">
              <CheckCircle size={16} />
              <span>{isVerified ? "Pembayaran sudah terverifikasi." : "Bukti pembayaran sudah diupload. Tunggu verifikasi panitia."}</span>
            </div>
            {paymentProof && (
              <div className={`rounded-2xl border p-3 ${isFunBike ? "border-slate-200 bg-white" : "border-white/10 bg-white/5"}`}>
                {(/\.pdf(?:$|\?)/i.test(paymentProof) || localPreview?.type === "application/pdf") ? (
                  <object data={paymentProof} type="application/pdf" className="h-64 w-full rounded-xl bg-white" aria-label="Preview bukti pembayaran PDF">
                    <a href={paymentProof} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-11 items-center gap-2 text-sm font-semibold" style={{ color: accentColor }}>
                      <FileText size={16} /> Lihat file bukti pembayaran
                    </a>
                  </object>
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
            <p className={`${mutedClass} text-xs mb-3`}>
              {canUpload
                ? "Selesaikan pembayaran terlebih dahulu, lalu upload bukti Transfer Bank/DANA/QRIS di sini."
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
          disabled={!proofReadyForPdf || generatingPdf}
          className={`${primaryButtonClass} flex items-center justify-center gap-2 px-6 py-3 rounded-xl text-sm flex-1 cursor-pointer disabled:cursor-not-allowed disabled:opacity-50`}
        >
          {generatingPdf ? <Loader2 size={16} className="animate-spin" /> : <Download size={16} />}
          {generatingPdf ? "Membuat PDF..." : "Unduh PDF Bukti"}
        </button>
        <a
          href={`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(whatsappText)}`}
          target="_blank"
          rel="noopener noreferrer"
          className={`${secondaryButtonClass} flex items-center justify-center gap-2 px-6 py-3 rounded-xl text-sm flex-1 cursor-pointer`}
        >
          <MessageCircle size={16} />
          Kirim bukti ke WA {DEFAULT_CONTACT_NAME.split(" ")[0]}
        </a>
      </div>
      {!proofReadyForPdf && (
        <p className="mb-2 text-xs font-semibold text-amber-600">Upload bukti pembayaran terlebih dahulu agar PDF lengkap dapat dibuat.</p>
      )}
      {pdfError && <p className="mb-2 text-xs font-semibold text-red-500">{pdfError}</p>}
      {pdfSuccess && <p className="mb-2 text-xs font-semibold text-green-600">PDF berhasil diunduh. Lampirkan file tersebut saat membuka WhatsApp.</p>}
      <p className={`mb-4 text-xs ${mutedClass}`}>Unduh PDF terlebih dahulu, lalu buka WhatsApp dan lampirkan file PDF yang barusan diunduh.</p>

      <Link
        href={isFunBike ? "/fun-bike" : "/futuristic-run"}
        className={`mt-4 flex items-center justify-center gap-2 text-sm transition-colors ${mutedClass}`}
        style={{ ['--hover-color' as string]: accentColor }}
      >
        <Home size={14} /> Kembali ke {isFunBike ? "Futuristic Bike" : "Futuristic Run"} <ArrowRight size={14} />
      </Link>

      {qrisZoomOpen && paymentInfo?.qris.imageUrl && (
        <div
          className="fixed inset-0 z-[120] flex items-center justify-center bg-black/85 p-4 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
          aria-label="Pratinjau QRIS"
          onClick={() => setQrisZoomOpen(false)}
        >
          <div className="relative w-full max-w-xl rounded-3xl bg-white p-4" onClick={(event) => event.stopPropagation()}>
            <button
              type="button"
              onClick={() => setQrisZoomOpen(false)}
              className="absolute right-3 top-3 z-10 flex min-h-11 min-w-11 items-center justify-center rounded-full bg-black/70 text-white"
              aria-label="Tutup pratinjau QRIS"
            >
              <X size={20} />
            </button>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={paymentInfo.qris.imageUrl} alt={`QRIS ${paymentInfo.qris.merchantName}`} className="max-h-[80vh] w-full object-contain" />
          </div>
        </div>
      )}
    </div>
  );
}

export default function ConfirmationContent({ eventType = "futuristic-run" }: { eventType?: ConfirmationEventType }) {
  return (
    <Suspense fallback={<div className={`min-h-screen flex items-center justify-center ${eventType === "fun-bike" ? "text-slate-600" : "text-[#B0C4DE]"}`}>Loading...</div>}>
      <Content eventType={eventType} />
    </Suspense>
  );
}

