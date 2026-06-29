"use client";
/* eslint-disable @next/next/no-img-element */
import { useState, useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Check, ChevronRight, ChevronLeft, User, Trophy, CreditCard, AlertCircle, QrCode, Copy, CheckCheck, Sparkles } from "lucide-react";
import { trackFormStart, trackFormStep, trackFormSubmit } from "@/lib/analytics";

const provinces = [
  "Aceh","Sumatera Utara","Sumatera Barat","Riau","Kepulauan Riau","Jambi","Bengkulu",
  "Sumatera Selatan","Kepulauan Bangka Belitung","Lampung","DKI Jakarta","Banten",
  "Jawa Barat","Jawa Tengah","DI Yogyakarta","Jawa Timur","Bali","Nusa Tenggara Barat",
  "Nusa Tenggara Timur","Kalimantan Barat","Kalimantan Tengah","Kalimantan Selatan",
  "Kalimantan Timur","Kalimantan Utara","Sulawesi Utara","Gorontalo","Sulawesi Tengah",
  "Sulawesi Barat","Sulawesi Selatan","Sulawesi Tenggara","Maluku","Maluku Utara",
  "Papua","Papua Barat","Papua Selatan","Papua Tengah","Papua Pegunungan","Papua Barat Daya",
];

const steps = [
  { label: "Data Diri", icon: User },
  { label: "Data Lomba", icon: Trophy },
  { label: "Pembayaran", icon: CreditCard },
];

interface PaymentInfo {
  bankName: string;
  bankAccount: string;
  bankHolder: string;
  qrisNmid: string;
  qrisImageUrl: string;
  registrationFee: number;
  transferEnabled: boolean;
  qrisEnabled: boolean;
}

type PaymentMethodOption = {
  value: "transfer" | "qris";
  label: string;
  icon: string;
  desc: string;
};

const defaultPayment: PaymentInfo = {
  bankName: "BRI",
  bankAccount: "—",
  bankHolder: "Himatekno UMP",
  qrisNmid: "—",
  qrisImageUrl: "",
  registrationFee: 200000,
  transferEnabled: true,
  qrisEnabled: true,
};

interface RegistrationFormProps {
  eventType?: "futuristic-run" | "fun-bike" | string;
  categoryLabel?: string;
  defaultPrice?: number;
}

type FormData = {
  fullName: string; nik: string; gender: string; birthPlace: string;
  birthDate: string; phone: string; email: string; address: string;
  city: string; province: string;
  category: string; jerseySize: string; bibName: string; bikeType: string;
  emergencyName: string; emergencyPhone: string; bloodType: string;
  medicalHistory: string; runningClub: string;
  paymentMethod: string; agreeTerms: boolean; agreeHealth: boolean;
};

function makeInitial(eventType: string): FormData {
  return {
    fullName: "", nik: "", gender: "", birthPlace: "", birthDate: "", phone: "", email: "",
    address: "", city: "", province: "",
    category: eventType === "fun-bike" ? "funbike" : "5K",
    jerseySize: "", bibName: "", bikeType: "",
    emergencyName: "", emergencyPhone: "",
    bloodType: "", medicalHistory: "", runningClub: "",
    paymentMethod: "", agreeTerms: false, agreeHealth: false,
  };
}

/* ── Theme type ── */
type FormTheme = {
  container: string;
  inner: string;
  input: string;
  stepBase: string;
  stepActive: string;
  stepDone: string;
  btnPrimary: string;
  btnBack: string;
  textH: string;       // heading
  textP: string;       // primary
  textS: string;       // secondary
  textM: string;       // muted
  textLabel: string;   // input label
  accent: string;      // accent hex
  accent2: string;     // secondary accent hex
  accentGlow: string;  // rgba prefix
  iconBg: string;      // step icon bg for section header
  iconBorder: string;
  iconColor: string;
  borderColor: string; // divider
  checkActive: string; // checkbox active classes
  checkInactive: string;
  errorBg: string;
  errorBorder: string;
  qrBg: string;        // QR image container
};

const darkTheme: FormTheme = {
  container: "glass-premium",
  inner: "glass-inner",
  input: "glass-input",
  stepBase: "glass-step-circle",
  stepActive: "glass-step-active",
  stepDone: "glass-step-done",
  btnPrimary: "btn-neon",
  btnBack: "border border-white/[0.08] text-[#8BA3C4] hover:bg-white/[0.04] hover:border-white/[0.15]",
  textH: "text-white",
  textP: "text-white",
  textS: "text-[#8BA3C4]",
  textM: "text-[#4A6080]",
  textLabel: "text-[#8BA3C4]",
  accent: "#00E5FF",
  accent2: "#8B00FF",
  accentGlow: "rgba(0,229,255,",
  iconBg: "",
  iconBorder: "",
  iconColor: "#00E5FF",
  borderColor: "border-white/[0.06]",
  checkActive: "bg-[#00E5FF] border-[#00E5FF] shadow-[0_0_8px_rgba(0,229,255,0.4)]",
  checkInactive: "border-[#1E3A5F] bg-[#0A0E27]/50 group-hover:border-[#00E5FF]/40",
  errorBg: "bg-[#FF006E]/10",
  errorBorder: "border-[#FF006E]/30",
  qrBg: "bg-white",
};

const lightTheme: FormTheme = {
  container: "glass-premium-light",
  inner: "glass-inner-light",
  input: "glass-input-light",
  stepBase: "glass-step-light",
  stepActive: "glass-step-light-active",
  stepDone: "glass-step-light-done",
  btnPrimary: "btn-sunrise-form",
  btnBack: "border border-gray-200 text-gray-500 hover:bg-gray-50 hover:border-gray-300",
  textH: "text-gray-900",
  textP: "text-gray-800",
  textS: "text-gray-500",
  textM: "text-gray-400",
  textLabel: "text-gray-500",
  accent: "#FF6B2C",
  accent2: "#7BC142",
  accentGlow: "rgba(255,107,44,",
  iconBg: "",
  iconBorder: "",
  iconColor: "#FF6B2C",
  borderColor: "border-gray-100",
  checkActive: "bg-[#FF6B2C] border-[#FF6B2C] shadow-[0_0_8px_rgba(255,107,44,0.3)]",
  checkInactive: "border-gray-300 bg-white group-hover:border-[#FF6B2C]/50",
  errorBg: "bg-red-50",
  errorBorder: "border-red-200",
  qrBg: "bg-white shadow-lg shadow-black/10",
};

function InputField({ label, id, error, required, theme, children }: {
  label: string; id: string; error?: string; required?: boolean; theme: FormTheme; children: React.ReactNode;
}) {
  return (
    <div>
      <label htmlFor={id} className={`block text-xs font-semibold uppercase tracking-wider mb-2 ${theme.textLabel}`}>
        {label} {required && <span className="text-[#FF006E]">*</span>}
      </label>
      {children}
      {error && <p className="text-[#FF006E] text-xs mt-1.5 flex items-center gap-1"><AlertCircle size={11} />{error}</p>}
    </div>
  );
}

export default function RegistrationForm({ eventType = "futuristic-run", categoryLabel, defaultPrice }: RegistrationFormProps) {
  const isFunBike = eventType === "fun-bike";
  const catLabel = categoryLabel ?? (isFunBike ? "Futuristic Bike Ride" : "RUN 5K");
  const t = isFunBike ? lightTheme : darkTheme;
  const [step, setStep] = useState(0);
  const [form, setForm] = useState<FormData>(makeInitial(eventType));
  const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>({});
  const [submitting, setSubmitting] = useState(false);
  const [payment, setPayment] = useState<PaymentInfo>(defaultPayment);
  const [paymentLoading, setPaymentLoading] = useState(true);
  const [paymentError, setPaymentError] = useState(false);
  const [paymentRetryKey, setPaymentRetryKey] = useState(0);

  useEffect(() => {
    let alive = true;
    const resetTimer = window.setTimeout(() => {
      if (!alive) return;
      setPaymentLoading(true);
      setPaymentError(false);
    }, 0);

    fetch(`/api/payment-info?eventType=${encodeURIComponent(eventType)}`)
      .then((r) => {
        if (!r.ok) throw new Error("Failed to load payment info");
        return r.json();
      })
      .then((data) => {
        if (!alive) return;
        if (!data.error) {
          setPayment(data);
        } else {
          setPaymentError(true);
        }
      })
      .catch(() => {
        if (alive) setPaymentError(true);
      })
      .finally(() => {
        if (alive) setPaymentLoading(false);
      });

    return () => {
      alive = false;
      window.clearTimeout(resetTimer);
    };
  }, [eventType, paymentRetryKey]);

  const fee = defaultPrice ?? payment.registrationFee;

  const feeFormatted = new Intl.NumberFormat("id-ID", {
    style: "currency", currency: "IDR", minimumFractionDigits: 0,
  }).format(fee);

  const [apiError, setApiError] = useState("");
  const router = useRouter();
  const [copied, setCopied] = useState(false);
  const draftKey = `reg-draft-${eventType}`;
  const formStartTracked = useRef(false);

  useEffect(() => {
    if (!formStartTracked.current) {
      formStartTracked.current = true;
      trackFormStart(eventType);
    }
  }, [eventType]);

  useEffect(() => {
    let timeout: ReturnType<typeof setTimeout> | undefined;
    try {
      const saved = localStorage.getItem(draftKey);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed && typeof parsed === "object") {
          timeout = setTimeout(() => {
            setForm((f) => ({ ...f, ...parsed }));
          }, 0);
        }
      }
    } catch { /* ignore */ }
    return () => {
      if (timeout) clearTimeout(timeout);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const saveTimer = useRef<any>(null);
  const autosave = useCallback((data: FormData) => {
    clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(() => {
      try { localStorage.setItem(draftKey, JSON.stringify(data)); } catch { /* ignore */ }
    }, 800);
  }, [draftKey]);

  const clearDraft = () => {
    try { localStorage.removeItem(draftKey); } catch { /* ignore */ }
  };

  const set = (k: keyof FormData, v: string | boolean) => {
    setForm((f) => {
      const next = { ...f, [k]: v };
      autosave(next);
      return next;
    });
  };

  const inp = `${t.input} w-full rounded-xl px-4 py-3.5 text-sm`;

  const validateStep = (s: number): boolean => {
    const e: typeof errors = {};
    if (s === 0) {
      if (form.fullName.length < 3) e.fullName = "Minimal 3 karakter";
      if (form.nik && !/^\d{16}$/.test(form.nik)) e.nik = "NIK harus 16 digit angka";
      if (!form.gender) e.gender = "Wajib dipilih";
      if (!form.birthPlace) e.birthPlace = "Wajib diisi";
      if (!form.birthDate) e.birthDate = "Wajib diisi";
      if (!/^08[0-9]{8,11}$/.test(form.phone)) e.phone = "Format: 08xxxxxxxxxx";
      if (!/\S+@\S+\.\S+/.test(form.email)) e.email = "Format email tidak valid";
      if (!form.address) e.address = "Wajib diisi";
      if (!form.city) e.city = "Wajib diisi";
      if (!form.province) e.province = "Wajib dipilih";
    }
    if (s === 1) {
      if (!form.jerseySize) e.jerseySize = "Wajib dipilih";
      if (!isFunBike && (!form.bibName || form.bibName.length > 12)) e.bibName = "Maks 12 karakter";
      if (!form.emergencyName) e.emergencyName = "Wajib diisi";
      if (!/^08[0-9]{8,11}$/.test(form.emergencyPhone)) e.emergencyPhone = "Format HP darurat: 08xxxxxxxxxx";
      if (!form.bloodType) e.bloodType = "Wajib dipilih";
    }
    if (s === 2) {
      if (!form.paymentMethod) e.paymentMethod = "Wajib dipilih";
      if (!form.agreeTerms) e.agreeTerms = "Wajib disetujui";
      if (!form.agreeHealth) e.agreeHealth = "Wajib disetujui";
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const next = () => {
    if (validateStep(step)) {
      trackFormStep(eventType, step);
      setStep((s) => s + 1);
    }
  };
  const back = () => setStep((s) => s - 1);

  const submit = async () => {
    if (!validateStep(2)) return;
    setSubmitting(true);
    setApiError("");
    try {
      const payload = {
        fullName: form.fullName, nik: form.nik || "", gender: form.gender,
        birthPlace: form.birthPlace, birthDate: form.birthDate,
        phone: form.phone, email: form.email, address: form.address,
        city: form.city, province: form.province,
        eventType,
        category: form.category, jerseySize: form.jerseySize,
        bibName: isFunBike ? "" : form.bibName,
        bikeType: isFunBike ? form.bikeType : undefined,
        emergencyContactName: form.emergencyName,
        emergencyContactPhone: form.emergencyPhone, bloodType: form.bloodType,
        medicalHistory: form.medicalHistory || undefined,
        runningClub: form.runningClub || undefined,
        paymentMethod: form.paymentMethod,
      };
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        setApiError(data.message ?? "Pendaftaran gagal. Coba lagi.");
        return;
      }
      if (typeof data.regNumber !== "string" || !/^(FR|FB)2026-\d{4,}$/.test(data.regNumber)) {
        setApiError("Pendaftaran belum dapat dikonfirmasi. Silakan cek status atau hubungi panitia.");
        return;
      }
      trackFormSubmit(eventType, data.regNumber);
      clearDraft();
      router.push(`/konfirmasi?reg=${data.regNumber}&event=${eventType}`);
    } catch {
      setApiError("Koneksi gagal. Periksa jaringan Anda.");
    } finally {
      setSubmitting(false);
    }
  };

  const eventName = isFunBike ? "Futuristic Bike 2026" : "Futuristic Run 2026";

  // Section header icon bg/border per theme
  const sectionIconBg1 = isFunBike ? "rgba(255,107,44,0.1)" : "rgba(0,229,255,0.12)";
  const sectionIconBorder1 = isFunBike ? "rgba(255,107,44,0.25)" : "rgba(0,229,255,0.25)";
  const sectionIconColor1 = isFunBike ? "#FF6B2C" : "#00E5FF";
  const sectionIconBg2 = isFunBike ? "rgba(245,158,11,0.1)" : "rgba(139,0,255,0.12)";
  const sectionIconBorder2 = isFunBike ? "rgba(245,158,11,0.25)" : "rgba(139,0,255,0.25)";
  const sectionIconColor2 = isFunBike ? "#F59E0B" : "#8B00FF";
  const sectionIconBg3 = isFunBike ? "rgba(123,193,66,0.1)" : "rgba(255,215,0,0.1)";
  const sectionIconBorder3 = isFunBike ? "rgba(123,193,66,0.25)" : "rgba(255,215,0,0.2)";
  const sectionIconColor3 = isFunBike ? "#7BC142" : "#FFD700";

  return (
    <div className={`${t.container} rounded-2xl sm:rounded-3xl overflow-hidden relative`}>
      {/* Top accent line */}
      <div className="absolute top-0 left-0 right-0 h-[2px]" style={{ background: `linear-gradient(90deg, transparent, ${t.accent}, transparent)` }} />

      {/* Step indicator */}
      <div className={`p-4 sm:p-8 border-b ${t.borderColor}`}>
        <div className="flex items-center justify-between max-w-md mx-auto">
          {steps.map((s, i) => (
            <div key={i} className="flex items-center flex-1">
              <div className="flex flex-col items-center">
                <div
                  className={`w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl flex items-center justify-center transition-all duration-500 ${
                    i < step ? t.stepDone : i === step ? t.stepActive : t.stepBase
                  }`}
                >
                  {i < step ? (
                    <Check size={18} style={{ color: isFunBike ? "#7BC142" : "#2A4FFF" }} />
                  ) : (
                    <s.icon size={18} className={i === step ? "" : ""} style={{ color: i === step ? t.accent : (isFunBike ? "#9CA3AF" : "#4A6080") }} />
                  )}
                </div>
                <span
                  className={`text-[10px] mt-2 font-bold tracking-[1.5px] hidden sm:block transition-colors duration-300`}
                  style={{
                    fontFamily: "Orbitron, sans-serif",
                    color: i === step ? t.accent : i < step ? (isFunBike ? "#7BC142" : "#2A4FFF") : (isFunBike ? "#9CA3AF" : "#4A6080"),
                  }}
                >
                  {s.label.toUpperCase()}
                </span>
              </div>
              {i < steps.length - 1 && (
                <div className={`flex-1 mx-2 sm:mx-3 h-[2px] rounded-full overflow-hidden ${isFunBike ? "bg-gray-200" : "bg-[#1E3A5F]/40"}`}>
                  <div
                    className="h-full rounded-full transition-all duration-700 ease-out"
                    style={{
                      width: i < step ? "100%" : "0%",
                      background: i < step ? `linear-gradient(90deg, ${isFunBike ? "#7BC142" : "#2A4FFF"}, ${t.accent})` : "transparent",
                    }}
                  />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="p-4 sm:p-8 lg:p-10">
        {/* Step 1 */}
        {step === 0 && (
          <div className="section-reveal space-y-6">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: sectionIconBg1, border: `1px solid ${sectionIconBorder1}` }}>
                <User size={18} style={{ color: sectionIconColor1 }} />
              </div>
              <div>
                <h3 className={`${t.textH} font-black text-lg`} style={{ fontFamily: "Orbitron, sans-serif", letterSpacing: "2px" }}>DATA DIRI</h3>
                <p className={`text-xs ${t.textM}`}>Informasi pribadi peserta</p>
              </div>
            </div>
            <div className="stagger-list grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div className="sm:col-span-2">
                <InputField label="Nama Lengkap" id="fullName" error={errors.fullName} required theme={t}>
                  <input id="fullName" className={inp} placeholder="Nama lengkap Anda" value={form.fullName} onChange={(e) => set("fullName", e.target.value)} />
                </InputField>
              </div>
              <div className="sm:col-span-2">
                <InputField label="NIK (16 digit)" id="nik" error={errors.nik} theme={t}>
                  <input id="nik" className={inp} placeholder="16 digit NIK sesuai KTP" maxLength={16} value={form.nik} onChange={(e) => set("nik", e.target.value.replace(/\D/g, ""))} />
                  <p className={`text-xs mt-1.5 ${t.textM}`}>Opsional — untuk mencegah pendaftaran ganda</p>
                </InputField>
              </div>
              <InputField label="Jenis Kelamin" id="gender" error={errors.gender} required theme={t}>
                <select id="gender" className={inp} value={form.gender} onChange={(e) => set("gender", e.target.value)}>
                  <option value="">Pilih</option>
                  <option value="male">Laki-laki</option>
                  <option value="female">Perempuan</option>
                </select>
              </InputField>
              <InputField label="Tempat Lahir" id="birthPlace" error={errors.birthPlace} required theme={t}>
                <input id="birthPlace" className={inp} placeholder="Kota tempat lahir" value={form.birthPlace} onChange={(e) => set("birthPlace", e.target.value)} />
              </InputField>
              <InputField label="Tanggal Lahir" id="birthDate" error={errors.birthDate} required theme={t}>
                <input id="birthDate" type="date" className={inp} value={form.birthDate} onChange={(e) => set("birthDate", e.target.value)} />
              </InputField>
              <InputField label="Nomor HP / WhatsApp" id="phone" error={errors.phone} required theme={t}>
                <input id="phone" className={inp} placeholder="08xxxxxxxxxx" value={form.phone} onChange={(e) => set("phone", e.target.value)} />
              </InputField>
              <InputField label="Email" id="email" error={errors.email} required theme={t}>
                <input id="email" type="email" className={inp} placeholder="email@contoh.com" value={form.email} onChange={(e) => set("email", e.target.value)} />
              </InputField>
              <div className="sm:col-span-2">
                <InputField label="Alamat Lengkap" id="address" error={errors.address} required theme={t}>
                  <textarea id="address" className={inp} rows={2} placeholder="Jalan, nomor, kelurahan, kecamatan" value={form.address} onChange={(e) => set("address", e.target.value)} />
                </InputField>
              </div>
              <InputField label="Kota / Kabupaten" id="city" error={errors.city} required theme={t}>
                <input id="city" className={inp} placeholder="Nama kota" value={form.city} onChange={(e) => set("city", e.target.value)} />
              </InputField>
              <InputField label="Provinsi" id="province" error={errors.province} required theme={t}>
                <select id="province" className={inp} value={form.province} onChange={(e) => set("province", e.target.value)}>
                  <option value="">Pilih provinsi</option>
                  {provinces.map((p) => <option key={p} value={p}>{p}</option>)}
                </select>
              </InputField>
            </div>
          </div>
        )}

        {/* Step 2 */}
        {step === 1 && (
          <div className="section-reveal space-y-6">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: sectionIconBg2, border: `1px solid ${sectionIconBorder2}` }}>
                <Trophy size={18} style={{ color: sectionIconColor2 }} />
              </div>
              <div>
                <h3 className={`${t.textH} font-black text-lg`} style={{ fontFamily: "Orbitron, sans-serif", letterSpacing: "2px" }}>DATA LOMBA</h3>
                <p className={`text-xs ${t.textM}`}>Kategori & informasi lomba</p>
              </div>
            </div>
            {/* Category locked */}
            <div className={`${t.inner} p-4 sm:p-5 rounded-2xl flex flex-col min-[430px]:flex-row min-[430px]:items-center min-[430px]:justify-between gap-3`} style={{ borderColor: isFunBike ? "rgba(245,158,11,0.2)" : "rgba(139,0,255,0.2)" }}>
              <div className="flex items-center gap-3">
                <div className="text-2xl">{isFunBike ? "🚴" : "⚡"}</div>
                <div>
                  <div className={`text-[10px] uppercase tracking-widest font-semibold mb-0.5 ${t.textM}`}>Kategori Lomba</div>
                  <div className={`${t.textH} font-black`} style={{ fontFamily: "Orbitron, sans-serif", letterSpacing: "1px" }}>{catLabel}</div>
                </div>
              </div>
              <div className="min-[430px]:text-right">
                <div className={`text-[10px] uppercase tracking-widest font-semibold mb-0.5 ${t.textM}`}>Biaya</div>
                <div className="text-[#FFD700] font-black text-lg" style={{ fontFamily: "Orbitron, sans-serif" }}>{feeFormatted}</div>
              </div>
            </div>
            <div className="stagger-list grid grid-cols-1 sm:grid-cols-2 gap-5">
              <InputField label="Ukuran Jersey" id="jerseySize" error={errors.jerseySize} required theme={t}>
                <select id="jerseySize" className={inp} value={form.jerseySize} onChange={(e) => set("jerseySize", e.target.value)}>
                  <option value="">Pilih ukuran</option>
                  {["XS","S","M","L","XL","XXL","XXXL"].map((s) => <option key={s} value={s}>{s}</option>)}
                </select>
              </InputField>
              {!isFunBike && (
                <InputField label="Nama di BIB" id="bibName" error={errors.bibName} required theme={t}>
                  <input id="bibName" className={inp} placeholder="Maks 12 karakter" maxLength={12} value={form.bibName} onChange={(e) => set("bibName", e.target.value.toUpperCase())} />
                </InputField>
              )}
              {isFunBike && (
                <InputField label="Jenis Sepeda" id="bikeType" theme={t}>
                  <select id="bikeType" className={inp} value={form.bikeType} onChange={(e) => set("bikeType", e.target.value)}>
                    <option value="">Pilih (opsional)</option>
                    <option value="road">Road Bike</option>
                    <option value="mtb">Mountain Bike (MTB)</option>
                    <option value="hybrid">Hybrid</option>
                    <option value="folding">Folding Bike</option>
                    <option value="bmx">BMX</option>
                    <option value="other">Lainnya</option>
                  </select>
                </InputField>
              )}
              <InputField label="Golongan Darah" id="bloodType" error={errors.bloodType} required theme={t}>
                <select id="bloodType" className={inp} value={form.bloodType} onChange={(e) => set("bloodType", e.target.value)}>
                  <option value="">Pilih</option>
                  {["A+","A-","B+","B-","AB+","AB-","O+","O-"].map((bt) => <option key={bt}>{bt}</option>)}
                </select>
              </InputField>
              <InputField label="Nama Kontak Darurat" id="emergencyName" error={errors.emergencyName} required theme={t}>
                <input id="emergencyName" className={inp} placeholder="Nama kontak darurat" value={form.emergencyName} onChange={(e) => set("emergencyName", e.target.value)} />
              </InputField>
              <InputField label="Nomor Kontak Darurat" id="emergencyPhone" error={errors.emergencyPhone} required theme={t}>
                <input id="emergencyPhone" className={inp} placeholder="08xxxxxxxxxx" value={form.emergencyPhone} onChange={(e) => set("emergencyPhone", e.target.value)} />
              </InputField>
              <div className="sm:col-span-2">
                <InputField label="Riwayat Penyakit" id="medicalHistory" theme={t}>
                  <textarea id="medicalHistory" className={inp} rows={2} placeholder="Opsional — jika ada kondisi medis tertentu" value={form.medicalHistory} onChange={(e) => set("medicalHistory", e.target.value)} />
                </InputField>
              </div>
              {!isFunBike && (
                <div className="sm:col-span-2">
                  <InputField label="Komunitas / Klub Lari" id="runningClub" theme={t}>
                    <input id="runningClub" className={inp} placeholder="Opsional — nama komunitas lari Anda" value={form.runningClub} onChange={(e) => set("runningClub", e.target.value)} />
                  </InputField>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Step 3 */}
        {step === 2 && (
          <div className="section-reveal space-y-6">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: sectionIconBg3, border: `1px solid ${sectionIconBorder3}` }}>
                <CreditCard size={18} style={{ color: sectionIconColor3 }} />
              </div>
              <div>
                <h3 className={`${t.textH} font-black text-lg`} style={{ fontFamily: "Orbitron, sans-serif", letterSpacing: "2px" }}>KONFIRMASI & PEMBAYARAN</h3>
                <p className={`text-xs ${t.textM}`}>Review data dan selesaikan pembayaran</p>
              </div>
            </div>

            {/* Summary */}
            <div className={`${t.inner} rounded-2xl p-4 sm:p-6 space-y-3`} style={{ borderColor: `${t.accentGlow}0.15)` }}>
              <div className="flex items-center gap-2 mb-4">
                <Sparkles size={14} style={{ color: t.accent }} />
                <h4 className="font-bold text-xs tracking-[2px]" style={{ fontFamily: "Orbitron, sans-serif", color: t.accent }}>RINGKASAN PENDAFTARAN</h4>
              </div>
              {[
                { label: "Nama", value: form.fullName },
                { label: "Kategori", value: catLabel },
                { label: "Jersey", value: form.jerseySize || "-" },
                ...(!isFunBike ? [{ label: "Nama BIB", value: form.bibName || "-" }] : []),
                ...(isFunBike && form.bikeType ? [{ label: "Jenis Sepeda", value: form.bikeType }] : []),
                { label: "Email", value: form.email },
                { label: "Total Bayar", value: paymentLoading ? "..." : feeFormatted },
              ].map((row) => (
                <div key={row.label} className={`flex items-start justify-between gap-4 text-sm py-1.5 border-b last:border-0 ${isFunBike ? "border-gray-100" : "border-white/[0.04]"}`}>
                  <span className={`${t.textS} flex-shrink-0`}>{row.label}</span>
                  <span className={`${t.textP} min-w-0 break-words text-right font-semibold ${row.label === "Total Bayar" ? "text-[#FFD700] font-black text-base" : ""}`}>{row.value}</span>
                </div>
              ))}
            </div>

            {paymentLoading ? (
              <div className="space-y-4">
                <div className="skeleton-shimmer h-4 w-32 rounded" />
                <div className="grid grid-cols-1 min-[430px]:grid-cols-2 gap-3">
                  <div className="skeleton-shimmer h-24 rounded-xl" />
                  <div className="skeleton-shimmer h-24 rounded-xl" />
                </div>
                <div className="skeleton-shimmer h-32 rounded-xl" />
              </div>
            ) : paymentError ? (
              <div className={`${t.inner} rounded-2xl p-5 text-sm`}>
                <div className="mb-2 font-bold" style={{ color: t.accent }}>Info pembayaran belum bisa dimuat.</div>
                <p className={t.textM}>Coba lagi sebentar. Jika masih gagal, hubungi panitia sebelum melakukan pembayaran.</p>
                <button
                  type="button"
                  onClick={() => setPaymentRetryKey((key) => key + 1)}
                  className="mt-4 min-h-11 rounded-full px-4 py-2 text-xs font-bold"
                  style={{ border: `1px solid ${t.accent}`, color: t.accent }}
                >
                  Coba lagi
                </button>
              </div>
            ) : (
            <>
            {/* Payment method */}
            <div>
              <label className={`block text-xs font-semibold uppercase tracking-wider mb-3 ${t.textLabel}`}>
                Metode Pembayaran <span className="text-[#FF006E]">*</span>
              </label>
              <div className="stagger-list grid grid-cols-1 min-[430px]:grid-cols-2 gap-3 mb-4">
                {[
                  payment.transferEnabled && { value: "transfer", label: "Transfer Bank", icon: "🏦", desc: payment.bankName },
                  payment.qrisEnabled && { value: "qris", label: "QRIS", icon: "📱", desc: "Scan & bayar langsung" },
                ].filter((m): m is PaymentMethodOption => Boolean(m)).map((m) => (
                  <button
                    key={m.value}
                    type="button"
                    onClick={() => set("paymentMethod", m.value)}
                    className={`${t.inner} p-4 sm:p-5 rounded-2xl text-center transition-all duration-300 cursor-pointer group ${
                      form.paymentMethod === m.value
                        ? isFunBike ? "border-[#FF6B2C] shadow-[0_0_20px_rgba(255,107,44,0.12)]" : ""
                        : isFunBike ? "hover:border-gray-200" : "hover:border-white/[0.12]"
                    }`}
                    style={form.paymentMethod === m.value && !isFunBike ? { borderColor: t.accent, boxShadow: `0 0 20px ${t.accentGlow}0.15)` } : {}}
                  >
                    <div className="text-3xl mb-2">{m.icon}</div>
                    <div className="text-xs font-bold mb-0.5" style={{ color: form.paymentMethod === m.value ? t.accent : (isFunBike ? "#374151" : "#fff") }}>{m.label}</div>
                    <div className={`text-[10px] ${t.textM}`}>{m.desc}</div>
                  </button>
                ))}
              </div>

              {/* Transfer Bank details */}
              {form.paymentMethod === "transfer" && (
                <div className={`${t.inner} rounded-2xl p-4 sm:p-6 space-y-3`} style={{ borderColor: `${t.accentGlow}0.15)` }}>
                  <div className="flex flex-col min-[430px]:flex-row min-[430px]:items-center min-[430px]:justify-between gap-3 mb-2">
                    <div className="font-bold text-xs tracking-[2px]" style={{ fontFamily: "Orbitron, sans-serif", color: t.accent }}>INFO REKENING</div>
                    <button
                      type="button"
                      onClick={() => {
                        const text = `${payment.bankName}\n${payment.bankAccount}\n${payment.bankHolder}\n${feeFormatted} (tepat)`;
                        navigator.clipboard.writeText(text).then(() => {
                          setCopied(true);
                          setTimeout(() => setCopied(false), 2000);
                        });
                      }}
                      className="flex items-center gap-1.5 text-xs font-semibold transition-colors cursor-pointer px-3 py-1.5 rounded-lg"
                      style={{ color: t.accent, background: `${t.accentGlow}0.08)` }}
                    >
                      {copied ? <CheckCheck size={13} /> : <Copy size={13} />}
                      {copied ? "Tersalin!" : "Salin Semua"}
                    </button>
                  </div>
                  {[
                    { label: "Bank", value: payment.bankName },
                    { label: "No. Rekening", value: payment.bankAccount },
                    { label: "Atas Nama", value: payment.bankHolder },
                    { label: "Jumlah Transfer", value: `${feeFormatted} (tepat)` },
                  ].map(row => (
                    <div key={row.label} className={`flex items-start justify-between gap-4 text-sm py-1.5 border-b last:border-0 ${isFunBike ? "border-gray-100" : "border-white/[0.04]"}`}>
                      <span className={`${t.textS} flex-shrink-0`}>{row.label}</span>
                      <span className={`${t.textP} min-w-0 break-words text-right font-semibold`}>{row.value}</span>
                    </div>
                  ))}
                  <div className={`pt-3 border-t text-xs flex items-start gap-2 ${isFunBike ? "border-gray-100 text-gray-400" : "border-white/[0.06] text-[#5A7899]"}`}>
                    <AlertCircle size={14} className="flex-shrink-0 mt-0.5 text-[#F59E0B]" />
                    <span>Transfer <strong className={t.textP}>tepat {feeFormatted}</strong>. Upload bukti transfer setelah mendaftar.</span>
                  </div>
                </div>
              )}

              {/* QRIS details */}
              {form.paymentMethod === "qris" && (
                <div className={`${t.inner} rounded-2xl p-4 sm:p-6`} style={{ borderColor: isFunBike ? "rgba(123,193,66,0.2)" : "rgba(139,0,255,0.15)" }}>
                  <div className="font-bold text-xs tracking-[2px] mb-5" style={{ fontFamily: "Orbitron, sans-serif", color: isFunBike ? "#7BC142" : "#8B00FF" }}>PEMBAYARAN QRIS</div>
                  <div className="flex flex-col items-center gap-4">
                    <div className={`w-48 h-48 sm:w-52 sm:h-52 rounded-2xl p-3 flex items-center justify-center ${t.qrBg}`}>
                      {payment.qrisImageUrl ? (
                        <img src={payment.qrisImageUrl} alt="QRIS" className="w-full h-full object-contain rounded" />
                      ) : (
                        <div className="w-full h-full rounded-xl border-2 border-dashed border-gray-300 flex flex-col items-center justify-center text-gray-500 text-center p-2">
                          <QrCode size={32} className="mb-1" />
                          <div className="text-xs font-bold">QRIS</div>
                          <div className="text-[10px]">{payment.bankHolder}</div>
                        </div>
                      )}
                    </div>
                    <div className="text-center">
                      <div className={`${t.textP} font-bold text-sm`}>{payment.bankHolder}</div>
                      <div className={`text-xs mt-1 ${t.textM}`}>NMID: {payment.qrisNmid}</div>
                      <div className="text-[#FFD700] font-black text-lg mt-2" style={{ fontFamily: "Orbitron, sans-serif" }}>{feeFormatted}</div>
                    </div>
                    <div className={`text-xs text-center rounded-xl p-4 space-y-0.5 ${isFunBike ? "bg-gray-50 text-gray-500" : "text-[#5A7899] glass-inner"}`}>
                      <span>1. Buka aplikasi m-banking / e-wallet</span><br/>
                      <span>2. Pilih menu <strong className={t.textP}>Scan QR / QRIS</strong></span><br/>
                      <span>3. Scan kode di atas & bayar <strong className={t.textP}>{feeFormatted}</strong></span><br/>
                      <span>4. Screenshot bukti & upload setelah submit</span>
                    </div>
                  </div>
                </div>
              )}

              {errors.paymentMethod && <p className="text-[#FF006E] text-xs mt-2 flex items-center gap-1"><AlertCircle size={11} />{errors.paymentMethod}</p>}
            </div>

            {/* Checkboxes */}
            <div className="space-y-3">
              {[
                { key: "agreeTerms" as keyof FormData, label: `Saya menyetujui Syarat & Ketentuan ${eventName}` },
                { key: "agreeHealth" as keyof FormData, label: "Saya menyatakan dalam kondisi sehat dan siap mengikuti event" },
              ].map(({ key, label }) => (
                <label key={key} className="flex items-start gap-3 cursor-pointer group">
                  <div
                    className={`w-5 h-5 rounded-lg border flex-shrink-0 mt-0.5 flex items-center justify-center transition-all duration-300 ${
                      form[key] ? t.checkActive : t.checkInactive
                    }`}
                    onClick={() => set(key, !form[key])}
                  >
                    {form[key] && <Check size={12} className="text-white" />}
                  </div>
                  <span className={`text-sm transition-colors ${isFunBike ? "text-gray-500 group-hover:text-gray-700" : "text-[#5A7899] group-hover:text-[#8BA3C4]"}`}>{label}</span>
                </label>
              ))}
              {(errors.agreeTerms || errors.agreeHealth) && (
                <p className="text-[#FF006E] text-xs flex items-center gap-1"><AlertCircle size={11} />Semua persetujuan wajib dicentang</p>
              )}
            </div>
          </>
          )}
          </div>
        )}

        {/* Error message */}
        {apiError && (
          <div className={`flex items-center gap-2 ${t.errorBg} border ${t.errorBorder} rounded-xl p-4 mt-6`}>
            <AlertCircle size={16} className="text-[#FF006E] flex-shrink-0" />
            <p className="text-[#FF006E] text-sm">{apiError}</p>
          </div>
        )}

        {/* Navigation buttons */}
        <div className="flex flex-col min-[430px]:flex-row gap-3 mt-8">
          {step > 0 && (
            <button
              onClick={back}
              disabled={submitting}
              className={`flex items-center gap-2 px-6 py-3.5 rounded-xl text-sm cursor-pointer flex-1 min-[430px]:flex-none justify-center disabled:opacity-50 transition-all duration-300 font-semibold ${t.btnBack}`}
              style={{ fontFamily: "Orbitron, sans-serif", letterSpacing: "1px" }}
            >
              <ChevronLeft size={16} /> KEMBALI
            </button>
          )}
          <button
            onClick={step < 2 ? next : submit}
            disabled={submitting}
            className={`${t.btnPrimary} flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl text-sm cursor-pointer flex-1 disabled:opacity-60`}
          >
            {submitting ? (
              <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Mendaftarkan...</>
            ) : step < 2 ? (
              <><span>LANJUT</span> <ChevronRight size={16} /></>
            ) : (
              <><span>SUBMIT PENDAFTARAN</span> <Check size={16} /></>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
