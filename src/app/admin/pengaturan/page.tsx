"use client";
/* eslint-disable @next/next/no-img-element */
import { useEffect, useState } from "react";
import { Settings, Save, ToggleLeft, ToggleRight, CreditCard, Building2, QrCode, Upload, Loader2 } from "lucide-react";
import LoadingPanel from "@/components/LoadingPanel";
import { DEFAULT_EVENT_DATES, normalizeEventDate } from "@/lib/eventDate";
import { DEFAULT_PRIZE_SETTINGS, PRIZES, PRIZE_FIELDS, prizeSettingKey } from "@/data/prizes";

interface SettingsState {
  [key: string]: string;
  registration_open: string;
  quota_5k: string;
  quota_funbike: string;
  event_date: string;
  event_location: string;
  early_bird_deadline: string;
  registration_deadline: string;
  // Payment settings
  payment_bank_name: string;
  payment_bank_account: string;
  payment_bank_holder: string;
  payment_qris_nmid: string;
  payment_qris_image_url: string;
  registration_fee: string;
  payment_transfer_enabled: string;
  payment_qris_enabled: string;
  benefit_prize_details: string;
  benefit_race_pack_contents: string;
  location_lat: string;
  location_lng: string;
  location_plus_code: string;
}

type EventType = "futuristic-run" | "fun-bike";

const defaultSettings: SettingsState = {
  registration_open: "true",
  quota_5k: "200",
  quota_funbike: "300",
  event_date: DEFAULT_EVENT_DATES["futuristic-run"],
  event_location: "",
  early_bird_deadline: "",
  registration_deadline: "",
  payment_bank_name: "BRI",
  payment_bank_account: "",
  payment_bank_holder: "Himatekno UMP",
  payment_qris_nmid: "",
  payment_qris_image_url: "",
  registration_fee: "200000",
  payment_transfer_enabled: "true",
  payment_qris_enabled: "true",
  benefit_prize_details: "",
  benefit_race_pack_contents: "",
  location_lat: "",
  location_lng: "",
  location_plus_code: "",
  ...DEFAULT_PRIZE_SETTINGS,
};

function toDateTimeLocal(value: string): string {
  return value.slice(0, 16);
}

function fromDateTimeLocal(value: string): string {
  return `${value}:00+07:00`;
}

function SectionCard({ icon: Icon, title, color = "#00E5FF", children }: {
  icon: React.ElementType; title: string; color?: string; children: React.ReactNode;
}) {
  return (
    <div className="card-animated glass-card rounded-2xl p-6 border border-[#1E3A5F]">
      <div className="flex items-center gap-2 mb-5">
        <Icon size={16} style={{ color }} />
        <h2 className="text-white font-bold text-sm" style={{ fontFamily: "Orbitron, sans-serif" }}>
          {title}
        </h2>
      </div>
      {children}
    </div>
  );
}

function Toggle({ label, desc, value, onChange }: { label: string; desc: string; value: boolean; onChange: (v: boolean) => void }) {
  return (
    <div className="card-animated flex items-center justify-between p-4 rounded-xl bg-[#0A0E27] border border-[#1E3A5F]">
      <div>
        <div className="text-white font-semibold text-sm">{label}</div>
        <div className="text-[#B0C4DE] text-xs mt-0.5">{desc}</div>
      </div>
      <button
        onClick={() => onChange(!value)}
        className={`transition-colors flex-shrink-0 ${value ? "text-[#00E5FF]" : "text-[#B0C4DE]"}`}
      >
        {value ? <ToggleRight size={36} /> : <ToggleLeft size={36} />}
      </button>
    </div>
  );
}

export default function PengaturanPage() {
  const [eventType, setEventType] = useState<EventType>("futuristic-run");
  const [settings, setSettings] = useState<SettingsState>(defaultSettings);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [activeTab, setActiveTab] = useState<"event" | "payment">("event");

  const [qrisUploading, setQrisUploading] = useState(false);
  const [qrisUploadError, setQrisUploadError] = useState("");

  const handleQrisUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setQrisUploadError("");
    const allowed = ["image/jpeg", "image/png", "image/webp"];
    if (!allowed.includes(file.type)) {
      setQrisUploadError("Format harus JPG, PNG, atau WebP.");
      return;
    }
    if (file.size > 3 * 1024 * 1024) {
      setQrisUploadError("Ukuran file maksimal 3MB.");
      return;
    }
    setQrisUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await fetch(`/api/upload-qris?eventType=${eventType}`, {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (!res.ok) {
        setQrisUploadError(data.error || "Gagal mengunggah QRIS.");
      } else {
        set("payment_qris_image_url", data.url);
      }
    } catch {
      setQrisUploadError("Terjadi kesalahan jaringan.");
    } finally {
      setQrisUploading(false);
      e.target.value = "";
    }
  };

  useEffect(() => {
    fetch(`/api/admin/settings?eventType=${eventType}`)
      .then((r) => r.json())
      .then((data) => setSettings((prev) => ({
        ...prev,
        ...data,
        event_date: normalizeEventDate(data.event_date) ?? DEFAULT_EVENT_DATES[eventType],
      })))
      .finally(() => setLoading(false));
  }, [eventType]);

  const selectEventType = (nextEventType: EventType) => {
    if (nextEventType === eventType) return;
    setLoading(true);
    setSaved(false);
    setSettings({
      ...defaultSettings,
      event_date: DEFAULT_EVENT_DATES[nextEventType],
      registration_fee: nextEventType === "fun-bike" ? "150000" : "200000",
    });
    setEventType(nextEventType);
  };

  const handleSave = async () => {
    setSaving(true);
    const payload = Object.fromEntries(Object.entries(settings).filter(([key]) => {
      if (eventType === "fun-bike") return key !== "quota_5k" && !key.startsWith("prize_") && !key.startsWith("benefit_");
      return key !== "quota_funbike";
    }));
    await fetch(`/api/admin/settings?eventType=${eventType}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const set = (key: keyof SettingsState, value: string) =>
    setSettings((s) => ({ ...s, [key]: value }));

  const inp = "neon-input w-full rounded-xl px-4 py-3 text-sm";

  const tabs = [
    { id: "event" as const, label: "Event & Kuota", icon: Settings },
    { id: "payment" as const, label: "Pembayaran", icon: CreditCard },
  ];

  const feeFormatted = new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(
    parseInt(settings.registration_fee || "0")
  );

  return (
    <div className="page-animate p-6 sm:p-8 max-w-3xl">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-black text-white mb-1" style={{ fontFamily: "Orbitron, sans-serif" }}>
          PENGATURAN
        </h1>
        <p className="text-[#B0C4DE] text-sm">Konfigurasi event, kuota, tanggal, hadiah, dan sistem pembayaran</p>
      </div>

      <div className="mb-4 grid grid-cols-2 gap-2 rounded-xl border border-[#1E3A5F] bg-[#080C20] p-1" aria-label="Pilih event">
        {([
          { id: "futuristic-run" as const, label: "Futuristic Run" },
          { id: "fun-bike" as const, label: "Futuristic Bike" },
        ]).map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => selectEventType(item.id)}
            className={`min-h-11 rounded-lg px-3 text-xs font-bold transition-colors ${eventType === item.id ? "bg-[#00E5FF] text-[#07111F]" : "text-[#B0C4DE] hover:text-white"}`}
            style={{ fontFamily: "Orbitron, sans-serif" }}
          >
            {item.label}
          </button>
        ))}
      </div>

      {/* Tabs */}
      <div className="card-animated flex gap-2 mb-6 p-1 glass-card rounded-xl border border-[#1E3A5F]">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-semibold transition-all duration-200 ${
              activeTab === tab.id
                ? "bg-[#00E5FF] text-[#0A0E27]"
                : "text-[#B0C4DE] hover:text-white"
            }`}
            style={{ fontFamily: "Orbitron, sans-serif", fontSize: "0.7rem", letterSpacing: "1px" }}
          >
            <tab.icon size={14} />
            {tab.label.toUpperCase()}
          </button>
        ))}
      </div>

      {loading ? (
        <LoadingPanel label="Memuat pengaturan" />
      ) : (
        <div className="stagger-list space-y-6">
          {/* ── EVENT TAB ── */}
          {activeTab === "event" && (
            <>
              <SectionCard icon={Settings} title="STATUS PENDAFTARAN">
                <Toggle
                  label="Pendaftaran Terbuka"
                  desc={settings.registration_open === "true" ? "Peserta dapat mendaftar sekarang" : "Pendaftaran sedang ditutup"}
                  value={settings.registration_open === "true"}
                  onChange={(v) => set("registration_open", v ? "true" : "false")}
                />
              </SectionCard>

              <SectionCard icon={Settings} title="KUOTA PESERTA" color="#8B00FF">
                <div>
                  <label className="block text-xs font-medium mb-1.5" style={{ color: "#8B00FF" }}>{eventType === "futuristic-run" ? "Run 5K" : "Fun Ride"}</label>
                  <input
                    type="number"
                    className={inp}
                    value={eventType === "futuristic-run" ? settings.quota_5k : settings.quota_funbike}
                    onChange={(e) => set(eventType === "futuristic-run" ? "quota_5k" : "quota_funbike", e.target.value)}
                    min={1}
                    max={9999}
                  />
                  <p className="text-[#B0C4DE] text-xs mt-1">Total slot yang tersedia untuk event terpilih</p>
                </div>
              </SectionCard>

              <SectionCard icon={Settings} title="INFO EVENT" color="#FF8C00">
                <div className="space-y-4">
                  {[
                    { key: "event_date" as keyof SettingsState, label: "Tanggal dan Jam Mulai (WIB)", type: "datetime-local" },
                    { key: "event_location" as keyof SettingsState, label: "Lokasi Event", type: "text", placeholder: "Nama venue / lokasi" },
                    { key: "early_bird_deadline" as keyof SettingsState, label: "Batas Early Bird", type: "date" },
                    { key: "registration_deadline" as keyof SettingsState, label: "Batas Pendaftaran", type: "date" },
                  ].map(({ key, label, type, placeholder }) => (
                    <div key={key}>
                      <label className="block text-[#B0C4DE] text-sm mb-1.5">{label}</label>
                      <input
                        type={type}
                        className={inp}
                        value={key === "event_date" ? toDateTimeLocal(settings[key]) : settings[key]}
                        placeholder={placeholder}
                        onChange={(e) => set(
                          key,
                          key === "event_date" && e.target.value ? fromDateTimeLocal(e.target.value) : e.target.value,
                        )}
                        required={key === "event_date"}
                      />
                    </div>
                  ))}
                  {eventType === "futuristic-run" && (
                    <div className="grid gap-4 sm:grid-cols-3">
                      {[
                        { key: "location_lat" as keyof SettingsState, label: "Latitude", placeholder: "-7.7130878" },
                        { key: "location_lng" as keyof SettingsState, label: "Longitude", placeholder: "110.0090583" },
                        { key: "location_plus_code" as keyof SettingsState, label: "Plus Code", placeholder: "72P5+QJ" },
                      ].map(({ key, label, placeholder }) => (
                        <div key={key}>
                          <label className="block text-[#B0C4DE] text-sm mb-1.5">{label}</label>
                          <input type="text" className={inp} value={settings[key]} placeholder={placeholder} onChange={(e) => set(key, e.target.value)} />
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </SectionCard>

              {eventType === "futuristic-run" && <SectionCard icon={Settings} title="BENEFIT PESERTA" color="#00E5FF">
                <div className="space-y-4">
                  {[
                    {
                      key: "benefit_prize_details" as keyof SettingsState,
                      label: "Detail Hadiah Juara",
                      placeholder: "Contoh: nominal/trofi Juara Umum 1–3 dan Pelajar 1–3",
                      help: "Kosongkan sampai nominal atau bentuk hadiah sudah final.",
                    },
                    {
                      key: "benefit_race_pack_contents" as keyof SettingsState,
                      label: "Isi Final Race Pack + BIB",
                      placeholder: "Contoh: Jersey, BIB warna per kategori, goodie bag, kotak centang refreshment & medali",
                      help: "Konten ini langsung menggantikan badge Segera diumumkan di halaman Run.",
                    },
                  ].map(({ key, label, placeholder, help }) => (
                    <div key={key}>
                      <label className="mb-1.5 block text-sm text-[#B0C4DE]">{label}</label>
                      <textarea
                        className={`${inp} min-h-24 resize-y`}
                        value={settings[key]}
                        placeholder={placeholder}
                        onChange={(e) => set(key, e.target.value)}
                        maxLength={500}
                      />
                      <p className="mt-1 text-xs text-[#B0C4DE]">{help}</p>
                    </div>
                  ))}
                </div>
              </SectionCard>}

              {eventType === "futuristic-run" && <SectionCard icon={Settings} title="HADIAH PER KATEGORI" color="#FFD700">
                <div className="space-y-6">
                  {PRIZES.map((prize) => (
                    <div key={prize.kategori} className="rounded-xl border border-[#1E3A5F] bg-[#0A0E27] p-4">
                      <h3 className="mb-3 text-sm font-black text-white">{prize.kategori}</h3>
                      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                        {PRIZE_FIELDS.map((field) => {
                          const key = prizeSettingKey(prize.kategori, field);
                          const labels = { juara1: "Juara I", juara2: "Juara II", juara3: "Juara III", harapan: "Harapan 1 & 2" };
                          return (
                            <div key={key}>
                              <label className="mb-1.5 block text-xs text-[#B0C4DE]">{labels[field]}</label>
                              <input
                                type={field === "harapan" ? "text" : "number"}
                                className={inp}
                                value={settings[key] ?? ""}
                                placeholder={prize.kategori.startsWith("SD") ? "Belum dialokasikan" : field === "harapan" ? "Piagam" : "Nominal rupiah"}
                                min={field === "harapan" ? undefined : 0}
                                step={field === "harapan" ? undefined : 1000}
                                maxLength={field === "harapan" ? 100 : undefined}
                                onChange={(e) => set(key, e.target.value)}
                              />
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                  <p className="text-xs leading-5 text-[#B0C4DE]">Kosongkan nominal kategori SD untuk menampilkan “Segera diumumkan”. Nilai kategori lain memakai nominal anggaran sebagai default.</p>
                </div>
              </SectionCard>}
            </>
          )}

          {/* ── PAYMENT TAB ── */}
          {activeTab === "payment" && (
            <>
              {/* Biaya pendaftaran */}
              <SectionCard icon={CreditCard} title="BIAYA PENDAFTARAN">
                <div>
                  <label className="block text-[#B0C4DE] text-sm mb-1.5">Biaya Run 5K (Rp)</label>
                  <input
                    type="number"
                    className={inp}
                    value={settings.registration_fee}
                    onChange={(e) => set("registration_fee", e.target.value)}
                    min={0}
                    step={1000}
                  />
                  <div className="mt-2 p-3 rounded-xl bg-[#FFD700]/5 border border-[#FFD700]/20 flex items-center justify-between">
                    <span className="text-[#B0C4DE] text-xs">Tampil di form pendaftaran</span>
                    <span className="text-[#FFD700] font-black text-sm" style={{ fontFamily: "Orbitron, sans-serif" }}>
                      {feeFormatted}
                    </span>
                  </div>
                </div>
              </SectionCard>

              {/* Metode pembayaran toggle */}
              <SectionCard icon={CreditCard} title="METODE PEMBAYARAN AKTIF" color="#8B00FF">
                <div className="space-y-3">
                  <Toggle
                    label="Transfer Bank"
                    desc="Peserta dapat memilih transfer bank manual"
                    value={settings.payment_transfer_enabled === "true"}
                    onChange={(v) => set("payment_transfer_enabled", v ? "true" : "false")}
                  />
                  <Toggle
                    label="QRIS"
                    desc="Peserta dapat membayar via QRIS (scan QR)"
                    value={settings.payment_qris_enabled === "true"}
                    onChange={(v) => set("payment_qris_enabled", v ? "true" : "false")}
                  />
                </div>
              </SectionCard>

              {/* Transfer Bank */}
              <SectionCard icon={Building2} title="REKENING BANK" color="#00E5FF">
                <div className="space-y-4">
                  {[
                    { key: "payment_bank_name" as keyof SettingsState, label: "Nama Bank", placeholder: "Contoh: BRI, BNI, Mandiri" },
                    { key: "payment_bank_account" as keyof SettingsState, label: "Nomor Rekening", placeholder: "Contoh: 1234-5678-9012-3456" },
                    { key: "payment_bank_holder" as keyof SettingsState, label: "Atas Nama", placeholder: "Nama pemilik rekening" },
                  ].map(({ key, label, placeholder }) => (
                    <div key={key}>
                      <label className="block text-[#B0C4DE] text-sm mb-1.5">{label}</label>
                      <input
                        type="text"
                        className={inp}
                        value={settings[key]}
                        placeholder={placeholder}
                        onChange={(e) => set(key, e.target.value)}
                      />
                    </div>
                  ))}

                  {/* Preview */}
                  {settings.payment_bank_account && (
                    <div className="p-4 rounded-xl border border-[#00E5FF]/20 bg-[#00E5FF]/5 space-y-2">
                      <div className="text-[#00E5FF] text-xs font-bold tracking-widest mb-2" style={{ fontFamily: "Orbitron, sans-serif" }}>
                        PREVIEW TAMPILAN PESERTA
                      </div>
                      {[
                        { label: "Bank", value: settings.payment_bank_name || "-" },
                        { label: "No. Rekening", value: settings.payment_bank_account },
                        { label: "Atas Nama", value: settings.payment_bank_holder || "-" },
                        { label: "Jumlah Transfer", value: `${feeFormatted} (tepat)` },
                      ].map((r) => (
                        <div key={r.label} className="flex justify-between text-sm">
                          <span className="text-[#B0C4DE]">{r.label}</span>
                          <span className="text-white font-semibold">{r.value}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </SectionCard>

              {/* QRIS */}
              <SectionCard icon={QrCode} title="QRIS" color="#8B00FF">
                <div className="space-y-4">
                  <div>
                    <label className="block text-[#B0C4DE] text-sm mb-1.5">NMID (Nomor Merchant)</label>
                    <input
                      type="text"
                      className={inp}
                      value={settings.payment_qris_nmid}
                      placeholder="Contoh: ID1020304050607"
                      onChange={(e) => set("payment_qris_nmid", e.target.value)}
                    />
                  </div>

                  <div>
                    <label className="block text-[#B0C4DE] text-sm mb-1.5">Gambar QR Code</label>
                    <label className="flex items-center justify-center gap-2 cursor-pointer rounded-xl border-2 border-dashed border-[#8B00FF]/40 py-3 px-4 text-[#8B00FF] hover:border-[#8B00FF]/70 transition-colors">
                      {qrisUploading ? (
                        <>
                          <Loader2 size={16} className="animate-spin" />
                          <span className="text-sm">Mengunggah...</span>
                        </>
                      ) : (
                        <>
                          <Upload size={16} />
                          <span className="text-sm font-semibold">Upload Gambar QRIS (JPG/PNG/WebP, maks 3MB)</span>
                        </>
                      )}
                      <input
                        type="file"
                        accept=".jpg,.jpeg,.png,.webp"
                        className="hidden"
                        onChange={handleQrisUpload}
                        disabled={qrisUploading}
                      />
                    </label>
                    {qrisUploadError && (
                      <p className="text-red-400 text-xs mt-1.5">{qrisUploadError}</p>
                    )}
                    {settings.payment_qris_image_url && (
                      <p className="text-green-400 text-xs mt-1.5">✓ Gambar berhasil diupload</p>
                    )}
                  </div>

                  {/* QRIS Preview */}
                  <div className="p-4 rounded-xl border border-[#8B00FF]/20 bg-[#8B00FF]/5">
                    <div className="text-[#8B00FF] text-xs font-bold tracking-widest mb-3" style={{ fontFamily: "Orbitron, sans-serif" }}>
                      PREVIEW QR CODE
                    </div>
                    <div className="flex flex-col sm:flex-row items-center gap-4">
                      <div className="w-32 h-32 bg-white rounded-xl p-2 flex items-center justify-center flex-shrink-0">
                        {settings.payment_qris_image_url ? (
                          <img
                            src={settings.payment_qris_image_url}
                            alt="QRIS"
                            className="w-full h-full object-contain rounded"
                            onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
                          />
                        ) : (
                          <div className="w-full h-full border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center text-gray-400">
                            <QrCode size={28} />
                            <span className="text-[9px] mt-1 text-center">Belum ada QR</span>
                          </div>
                        )}
                      </div>
                      <div>
                        <div className="text-white font-bold text-sm">{settings.payment_bank_holder || "Himatekno UMP"}</div>
                        {settings.payment_qris_nmid && (
                          <div className="text-[#B0C4DE] text-xs mt-0.5">NMID: {settings.payment_qris_nmid}</div>
                        )}
                        <div className="text-[#FFD700] font-black mt-1" style={{ fontFamily: "Orbitron, sans-serif" }}>
                          {feeFormatted}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </SectionCard>
            </>
          )}

          {/* Save button */}
          <button
            onClick={handleSave}
            disabled={saving}
            className="btn-neon flex items-center gap-2 px-8 py-3 rounded-xl text-sm font-bold disabled:opacity-50 cursor-pointer w-full sm:w-auto justify-center"
          >
            {saving ? (
              <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : saved ? (
              "✓"
            ) : (
              <Save size={16} />
            )}
            {saved ? "✓ TERSIMPAN!" : saving ? "Menyimpan..." : "SIMPAN PENGATURAN"}
          </button>
        </div>
      )}
    </div>
  );
}
