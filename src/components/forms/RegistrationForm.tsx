"use client";
/* eslint-disable @next/next/no-img-element */
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Check, ChevronRight, ChevronLeft, User, Trophy, CreditCard, AlertCircle, QrCode } from "lucide-react";

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

type FormData = {
  // Step 1
  fullName: string; gender: string; birthPlace: string;
  birthDate: string; phone: string; email: string; address: string;
  city: string; province: string;
  // Step 2
  category: string; jerseySize: string; bibName: string;
  emergencyName: string; emergencyPhone: string; bloodType: string;
  medicalHistory: string; runningClub: string;
  // Step 3
  paymentMethod: string; agreeTerms: boolean; agreeHealth: boolean;
};

const initial: FormData = {
  fullName: "", gender: "", birthPlace: "", birthDate: "", phone: "", email: "",
  address: "", city: "", province: "",
  category: "5K", jerseySize: "", bibName: "", emergencyName: "", emergencyPhone: "",
  bloodType: "", medicalHistory: "", runningClub: "",
  paymentMethod: "", agreeTerms: false, agreeHealth: false,
};

function InputField({ label, id, error, required, children }: {
  label: string; id: string; error?: string; required?: boolean; children: React.ReactNode;
}) {
  return (
    <div>
      <label htmlFor={id} className="block text-sm font-medium text-[#B0C4DE] mb-1.5">
        {label} {required && <span className="text-[#FF006E]">*</span>}
      </label>
      {children}
      {error && <p className="text-[#FF006E] text-xs mt-1">{error}</p>}
    </div>
  );
}

export default function RegistrationForm() {
  const [step, setStep] = useState(0);
  const [form, setForm] = useState<FormData>(initial);
  const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>({});
  const [submitting, setSubmitting] = useState(false);
  const [payment, setPayment] = useState<PaymentInfo>(defaultPayment);

  useEffect(() => {
    fetch("/api/payment-info?eventType=futuristic-run")
      .then((r) => r.json())
      .then((data) => {
        if (!data.error) setPayment(data);
      })
      .catch(() => {}); // fallback to defaults
  }, []);

  const feeFormatted = new Intl.NumberFormat("id-ID", {
    style: "currency", currency: "IDR", minimumFractionDigits: 0,
  }).format(payment.registrationFee);

  const [apiError, setApiError] = useState("");
  const router = useRouter();

  const set = (k: keyof FormData, v: string | boolean) =>
    setForm((f) => ({ ...f, [k]: v }));

  const inp = "neon-input w-full rounded-xl px-4 py-3 text-sm";

  const validateStep = (s: number): boolean => {
    const e: typeof errors = {};
    if (s === 0) {
      if (form.fullName.length < 3) e.fullName = "Minimal 3 karakter";
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
      if (!form.bibName || form.bibName.length > 12) e.bibName = "Maks 12 karakter";
      if (!form.emergencyName) e.emergencyName = "Wajib diisi";
      if (!form.emergencyPhone) e.emergencyPhone = "Wajib diisi";
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

  const next = () => { if (validateStep(step)) setStep((s) => s + 1); };
  const back = () => setStep((s) => s - 1);

  const submit = async () => {
    if (!validateStep(2)) return;
    setSubmitting(true);
    setApiError("");
    try {
      const payload = {
        fullName: form.fullName, nik: "", gender: form.gender,
        birthPlace: form.birthPlace, birthDate: form.birthDate,
        phone: form.phone, email: form.email, address: form.address,
        city: form.city, province: form.province,
        eventType: "futuristic-run",
        category: form.category, jerseySize: form.jerseySize,
        bibName: form.bibName, emergencyContactName: form.emergencyName,
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
      router.push(`/konfirmasi?reg=${data.regNumber}`);
    } catch {
      setApiError("Koneksi gagal. Periksa jaringan Anda.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="card-animated glass-card rounded-2xl border border-[#1E3A5F] overflow-hidden">
      {/* Step indicator */}
      <div className="p-6 border-b border-[#1E3A5F]">
        <div className="flex items-center justify-between">
          {steps.map((s, i) => (
            <div key={i} className="flex items-center flex-1">
              <div className="flex flex-col items-center">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 ${
                    i < step ? "bg-[#2A4FFF]" : i === step ? "bg-[#00E5FF] glow-cyan" : "bg-[#1E3A5F]"
                  }`}
                >
                  {i < step ? (
                    <Check size={16} className="text-white" />
                  ) : (
                    <s.icon size={16} className={i === step ? "text-[#0A0E27]" : "text-[#B0C4DE]"} />
                  )}
                </div>
                <span
                  className={`text-xs mt-1.5 font-medium hidden sm:block ${
                    i === step ? "text-[#00E5FF]" : i < step ? "text-[#2A4FFF]" : "text-[#B0C4DE]"
                  }`}
                  style={{ fontFamily: "Orbitron, sans-serif", fontSize: "0.6rem", letterSpacing: "1px" }}
                >
                  {s.label.toUpperCase()}
                </span>
              </div>
              {i < steps.length - 1 && (
                <div className="flex-1 mx-2 h-px">
                  <div
                    className="h-full transition-all duration-500"
                    style={{
                      background: i < step ? "linear-gradient(90deg, #2A4FFF, #00E5FF)" : "#1E3A5F",
                    }}
                  />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="p-6 sm:p-8">
        {/* Step 1 */}
        {step === 0 && (
          <div className="section-reveal space-y-5">
            <h3 className="text-white font-bold text-lg mb-6" style={{ fontFamily: "Orbitron, sans-serif" }}>
              DATA DIRI
            </h3>
            <div className="stagger-list grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div className="sm:col-span-2">
                <InputField label="Nama Lengkap" id="fullName" error={errors.fullName} required>
                  <input id="fullName" className={inp} placeholder="Nama lengkap Anda" value={form.fullName} onChange={(e) => set("fullName", e.target.value)} />
                </InputField>
              </div>
              <InputField label="Jenis Kelamin" id="gender" error={errors.gender} required>
                <select id="gender" className={inp} value={form.gender} onChange={(e) => set("gender", e.target.value)}>
                  <option value="">Pilih</option>
                  <option value="male">Laki-laki</option>
                  <option value="female">Perempuan</option>
                </select>
              </InputField>
              <InputField label="Tempat Lahir" id="birthPlace" error={errors.birthPlace} required>
                <input id="birthPlace" className={inp} placeholder="Kota tempat lahir" value={form.birthPlace} onChange={(e) => set("birthPlace", e.target.value)} />
              </InputField>
              <InputField label="Tanggal Lahir" id="birthDate" error={errors.birthDate} required>
                <input id="birthDate" type="date" className={inp} value={form.birthDate} onChange={(e) => set("birthDate", e.target.value)} />
              </InputField>
              <InputField label="Nomor HP / WhatsApp" id="phone" error={errors.phone} required>
                <input id="phone" className={inp} placeholder="08xxxxxxxxxx" value={form.phone} onChange={(e) => set("phone", e.target.value)} />
              </InputField>
              <InputField label="Email" id="email" error={errors.email} required>
                <input id="email" type="email" className={inp} placeholder="email@contoh.com" value={form.email} onChange={(e) => set("email", e.target.value)} />
              </InputField>
              <div className="sm:col-span-2">
                <InputField label="Alamat Lengkap" id="address" error={errors.address} required>
                  <textarea id="address" className={inp} rows={2} placeholder="Jalan, nomor, kelurahan, kecamatan" value={form.address} onChange={(e) => set("address", e.target.value)} />
                </InputField>
              </div>
              <InputField label="Kota / Kabupaten" id="city" error={errors.city} required>
                <input id="city" className={inp} placeholder="Nama kota" value={form.city} onChange={(e) => set("city", e.target.value)} />
              </InputField>
              <InputField label="Provinsi" id="province" error={errors.province} required>
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
          <div className="section-reveal space-y-5">
            <h3 className="text-white font-bold text-lg mb-6" style={{ fontFamily: "Orbitron, sans-serif" }}>
              DATA LOMBA
            </h3>
            {/* Category locked to 5K */}
            <div className="card-animated p-4 rounded-xl border border-[#8B00FF]/40 bg-[#8B00FF]/10 flex items-center justify-between">
              <div>
                <div className="text-xs text-[#B0C4DE] mb-0.5">Kategori Lomba</div>
                <div className="text-white font-bold" style={{ fontFamily: "Orbitron, sans-serif" }}>⚡ RUN 5K</div>
              </div>
              <div className="text-right">
                <div className="text-xs text-[#B0C4DE] mb-0.5">Biaya</div>
                <div className="text-[#FFD700] font-black" style={{ fontFamily: "Orbitron, sans-serif" }}>Rp 200.000</div>
              </div>
            </div>
            <div className="stagger-list grid grid-cols-1 sm:grid-cols-2 gap-5">
              <InputField label="Ukuran Jersey" id="jerseySize" error={errors.jerseySize} required>
                <select id="jerseySize" className={inp} value={form.jerseySize} onChange={(e) => set("jerseySize", e.target.value)}>
                  <option value="">Pilih ukuran</option>
                  {["XS","S","M","L","XL","XXL","XXXL"].map((s) => <option key={s} value={s}>{s}</option>)}
                </select>
              </InputField>
              <InputField label="Nama di BIB" id="bibName" error={errors.bibName} required>
                <input id="bibName" className={inp} placeholder="Maks 12 karakter" maxLength={12} value={form.bibName} onChange={(e) => set("bibName", e.target.value.toUpperCase())} />
              </InputField>
              <InputField label="Golongan Darah" id="bloodType" error={errors.bloodType} required>
                <select id="bloodType" className={inp} value={form.bloodType} onChange={(e) => set("bloodType", e.target.value)}>
                  <option value="">Pilih</option>
                  {["A+","A-","B+","B-","AB+","AB-","O+","O-"].map((t) => <option key={t}>{t}</option>)}
                </select>
              </InputField>
              <InputField label="Nama Kontak Darurat" id="emergencyName" error={errors.emergencyName} required>
                <input id="emergencyName" className={inp} placeholder="Nama kontak darurat" value={form.emergencyName} onChange={(e) => set("emergencyName", e.target.value)} />
              </InputField>
              <InputField label="Nomor Kontak Darurat" id="emergencyPhone" error={errors.emergencyPhone} required>
                <input id="emergencyPhone" className={inp} placeholder="08xxxxxxxxxx" value={form.emergencyPhone} onChange={(e) => set("emergencyPhone", e.target.value)} />
              </InputField>
              <div className="sm:col-span-2">
                <InputField label="Riwayat Penyakit" id="medicalHistory">
                  <textarea id="medicalHistory" className={inp} rows={2} placeholder="Opsional — jika ada kondisi medis tertentu" value={form.medicalHistory} onChange={(e) => set("medicalHistory", e.target.value)} />
                </InputField>
              </div>
              <div className="sm:col-span-2">
                <InputField label="Komunitas / Klub Lari" id="runningClub">
                  <input id="runningClub" className={inp} placeholder="Opsional — nama komunitas lari Anda" value={form.runningClub} onChange={(e) => set("runningClub", e.target.value)} />
                </InputField>
              </div>
            </div>
          </div>
        )}

        {/* Step 3 */}
        {step === 2 && (
          <div className="section-reveal space-y-6">
            <h3 className="text-white font-bold text-lg mb-6" style={{ fontFamily: "Orbitron, sans-serif" }}>
              KONFIRMASI & PEMBAYARAN
            </h3>

            {/* Summary */}
            <div className="card-animated glass-card rounded-xl p-5 border border-[#00E5FF]/20 space-y-2">
              <h4 className="text-[#00E5FF] font-semibold text-sm mb-3" style={{ fontFamily: "Orbitron, sans-serif" }}>
                RINGKASAN PENDAFTARAN
              </h4>
              {[
                { label: "Nama", value: form.fullName },
                { label: "Kategori", value: "Run 5K" },
                { label: "Jersey", value: form.jerseySize || "-" },
                { label: "Nama BIB", value: form.bibName || "-" },
                { label: "Email", value: form.email },
                { label: "Total Bayar", value: feeFormatted },
              ].map((row) => (
                <div key={row.label} className="flex justify-between text-sm">
                  <span className="text-[#B0C4DE]">{row.label}</span>
                  <span className={`text-white font-medium ${row.label === "Total Bayar" ? "text-[#FFD700] font-black" : ""}`}>
                    {row.value}
                  </span>
                </div>
              ))}
            </div>

            {/* Payment method */}
            <div>
              <label className="block text-sm font-medium text-[#B0C4DE] mb-3">
                Metode Pembayaran <span className="text-[#FF006E]">*</span>
              </label>
              <div className="stagger-list grid grid-cols-2 gap-3 mb-4">
                {[
                  payment.transferEnabled && { value: "transfer", label: "Transfer Bank", icon: "🏦", desc: payment.bankName },
                  payment.qrisEnabled && { value: "qris", label: "QRIS", icon: "📱", desc: "Scan & bayar langsung" },
                ].filter((m): m is PaymentMethodOption => Boolean(m)).map((m) => (
                  <button
                    key={m.value}
                    type="button"
                    onClick={() => set("paymentMethod", m.value)}
                    className={`card-animated p-4 rounded-xl border text-center transition-all duration-200 cursor-pointer ${
                      form.paymentMethod === m.value
                        ? "border-[#00E5FF] bg-[#00E5FF]/10"
                        : "border-[#1E3A5F] hover:border-[#00E5FF]/40"
                    }`}
                  >
                    <div className="text-2xl mb-1">{m.icon}</div>
                    <div className={`text-xs font-bold mb-0.5 ${form.paymentMethod === m.value ? "text-[#00E5FF]" : "text-white"}`}>{m.label}</div>
                    <div className="text-[10px] text-[#B0C4DE]">{m.desc}</div>
                  </button>
                ))}
              </div>

              {/* Transfer Bank details */}
              {form.paymentMethod === "transfer" && (
                <div className="card-animated rounded-xl border border-[#00E5FF]/20 bg-[#00E5FF]/5 p-5 space-y-3">
                  <div className="text-[#00E5FF] font-bold text-xs tracking-widest" style={{ fontFamily: "Orbitron, sans-serif" }}>INFO REKENING</div>
                  {[
                    { label: "Bank", value: payment.bankName },
                    { label: "No. Rekening", value: payment.bankAccount },
                    { label: "Atas Nama", value: payment.bankHolder },
                    { label: "Jumlah Transfer", value: `${feeFormatted} (tepat)` },
                  ].map(row => (
                    <div key={row.label} className="flex justify-between text-sm">
                      <span className="text-[#B0C4DE]">{row.label}</span>
                      <span className="text-white font-semibold">{row.value}</span>
                    </div>
                  ))}
                  <div className="pt-2 border-t border-[#1E3A5F] text-xs text-[#B0C4DE]">
                    ⚠️ Transfer <strong className="text-white">tepat {feeFormatted}</strong>. Upload bukti transfer setelah mendaftar.
                  </div>
                </div>
              )}

              {/* QRIS details */}
              {form.paymentMethod === "qris" && (
                <div className="card-animated rounded-xl border border-[#8B00FF]/30 bg-[#8B00FF]/5 p-5">
                  <div className="text-[#8B00FF] font-bold text-xs tracking-widest mb-4" style={{ fontFamily: "Orbitron, sans-serif" }}>PEMBAYARAN QRIS</div>
                  <div className="flex flex-col items-center gap-4">
                    <div className="w-48 h-48 bg-white rounded-2xl p-3 flex items-center justify-center">
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
                      <div className="text-white font-bold text-sm">{payment.bankHolder}</div>
                      <div className="text-[#B0C4DE] text-xs mt-1">NMID: {payment.qrisNmid}</div>
                      <div className="text-[#FFD700] font-black mt-2" style={{ fontFamily: "Orbitron, sans-serif" }}>{feeFormatted}</div>
                    </div>
                    <div className="text-xs text-[#B0C4DE] text-center bg-[#1E3A5F]/50 rounded-xl p-3">
                      1. Buka aplikasi m-banking / e-wallet<br/>
                      2. Pilih menu <strong className="text-white">Scan QR / QRIS</strong><br/>
                      3. Scan kode di atas & bayar <strong className="text-white">{feeFormatted}</strong><br/>
                      4. Screenshot bukti & upload setelah submit
                    </div>
                  </div>
                </div>
              )}

              {errors.paymentMethod && <p className="text-[#FF006E] text-xs mt-2">{errors.paymentMethod}</p>}
            </div>

            {/* Checkboxes */}
            <div className="space-y-3">
              {[
                { key: "agreeTerms" as keyof FormData, label: "Saya menyetujui Syarat & Ketentuan Futuristic RUN 2026" },
                { key: "agreeHealth" as keyof FormData, label: "Saya menyatakan dalam kondisi sehat dan siap mengikuti event" },
              ].map(({ key, label }) => (
                <label key={key} className="flex items-start gap-3 cursor-pointer group">
                  <div
                    className={`w-5 h-5 rounded-md border flex-shrink-0 mt-0.5 flex items-center justify-center transition-all duration-200 ${
                      form[key] ? "bg-[#00E5FF] border-[#00E5FF]" : "border-[#1E3A5F] group-hover:border-[#00E5FF]/50"
                    }`}
                    onClick={() => set(key, !form[key])}
                  >
                    {form[key] && <Check size={12} className="text-[#0A0E27]" />}
                  </div>
                  <span className="text-sm text-[#B0C4DE] group-hover:text-white transition-colors">{label}</span>
                </label>
              ))}
              {(errors.agreeTerms || errors.agreeHealth) && (
                <p className="text-[#FF006E] text-xs">Semua persetujuan wajib dicentang</p>
              )}
            </div>
          </div>
        )}

        {/* Navigation */}
        {apiError && (
          <div className="flex items-center gap-2 bg-[#FF006E]/10 border border-[#FF006E]/30 rounded-xl p-3 mt-6">
            <AlertCircle size={16} className="text-[#FF006E] flex-shrink-0" />
            <p className="text-[#FF006E] text-sm">{apiError}</p>
          </div>
        )}
        <div className="flex gap-3 mt-4">
          {step > 0 && (
            <button
              onClick={back}
              disabled={submitting}
              className="btn-outline-neon flex items-center gap-2 px-6 py-3 rounded-xl text-sm cursor-pointer flex-1 sm:flex-none justify-center disabled:opacity-50"
            >
              <ChevronLeft size={16} /> KEMBALI
            </button>
          )}
          <button
            onClick={step < 2 ? next : submit}
            disabled={submitting}
            className="btn-neon flex items-center justify-center gap-2 px-8 py-3 rounded-xl text-sm cursor-pointer flex-1 disabled:opacity-60"
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
