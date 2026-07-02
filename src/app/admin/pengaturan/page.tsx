"use client";
/* eslint-disable @next/next/no-img-element */
import { useEffect, useState } from "react";
import { Settings, Save, ToggleLeft, ToggleRight, CreditCard, Building2, QrCode, Upload, Loader2, AlertCircle, BadgeDollarSign } from "lucide-react";
import LoadingPanel from "@/components/LoadingPanel";
import { DEFAULT_EVENT_DATES, normalizeEventDate } from "@/lib/eventDate";
import { DEFAULT_PRIZE_SETTINGS, PRIZES, PRIZE_FIELDS, prizeSettingKey } from "@/data/prizes";
import { formatPricingCurrency, type PricingSnapshot, type PricingTier } from "@/lib/pricing";
import { EVENTS } from "@/content/events";

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
  payment_dana_enabled: string;
  payment_dana_number: string;
  payment_dana_holder: string;
  payment_qris_nmid: string;
  payment_qris_merchant_name: string;
  payment_qris_image_url: string;
  payment_qris_image_key: string;
  payment_instructions: string;
  payment_deadline_hours: string;
  registration_fee: string;
  payment_transfer_enabled: string;
  payment_qris_enabled: string;
  benefit_prize_details: string;
  benefit_race_pack_contents: string;
  location_lat: string;
  location_lng: string;
  location_plus_code: string;
  event_location_address: string;
  racepack_location: string;
  contact_person: string;
  contact_person_name: string;
  contact_person_whatsapp: string;
  bike_prize_amount: string;
  bike_route_note: string;
  faq: string;
  rules: string;
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
  payment_bank_account: "007801112841503",
  payment_bank_holder: "SYIFA FITRIYANTI",
  payment_dana_enabled: "false",
  payment_dana_number: "",
  payment_dana_holder: "",
  payment_qris_nmid: "",
  payment_qris_merchant_name: "SYIFA FITRIYANTI",
  payment_qris_image_url: "",
  payment_qris_image_key: "",
  payment_instructions: "Bayar sesuai nominal, simpan bukti pembayaran, lalu unggah bukti untuk diverifikasi panitia.",
  payment_deadline_hours: "24",
  registration_fee: "120000",
  payment_transfer_enabled: "true",
  payment_qris_enabled: "true",
  benefit_prize_details: "",
  benefit_race_pack_contents: "",
  location_lat: "",
  location_lng: "",
  location_plus_code: "",
  event_location_address: "",
  racepack_location: "Kampus Plaosan",
  contact_person: "+62 856-4390-9808",
  contact_person_name: "Bimo Putra",
  contact_person_whatsapp: "+62 856-4390-9808",
  bike_prize_amount: "",
  bike_route_note: "Rute masih dalam tahap survei dan belum final.",
  faq: EVENTS["futuristic-run"].faq.map((item) => `${item.q} | ${item.a}`).join("\n"),
  rules: EVENTS["futuristic-run"].rules.join("\n"),
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
    <div className="card-animated glass-card min-w-0 rounded-2xl border border-[#1E3A5F] p-4 sm:p-6">
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
    <div className="card-animated flex items-start justify-between gap-3 rounded-xl border border-[#1E3A5F] bg-[#0A0E27] p-4 sm:items-center">
      <div className="min-w-0">
        <div className="text-white font-semibold text-sm">{label}</div>
        <div className="text-[#B0C4DE] text-xs mt-0.5">{desc}</div>
      </div>
      <button
        type="button"
        onClick={() => onChange(!value)}
        aria-pressed={value}
        aria-label={`${value ? "Nonaktifkan" : "Aktifkan"} ${label}`}
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
  const [saveError, setSaveError] = useState("");
  const [activeTab, setActiveTab] = useState<"event" | "pricing" | "payment">("event");
  const [pricing, setPricing] = useState<PricingSnapshot | null>(null);
  const [pricingCapacity, setPricingCapacity] = useState(0);
  const [pricingLoading, setPricingLoading] = useState(true);
  const [savingPricing, setSavingPricing] = useState(false);

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
        set("payment_qris_image_key", data.key ?? "");
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
      .then((data) => {
        const ev = EVENTS[eventType];
        const cleanFaq = (!data.faq || data.faq.includes("[object Object]"))
          ? ev.faq.map((item) => `${item.q} | ${item.a}`).join("\n")
          : data.faq;
        const cleanRules = (!data.rules || data.rules.includes("[object Object]"))
          ? ev.rules.join("\n")
          : data.rules;

        setSettings((prev) => ({
          ...prev,
          ...data,
          payment_dana_enabled: "false",
          payment_dana_number: "",
          payment_dana_holder: "",
          faq: cleanFaq,
          rules: cleanRules,
          event_date: normalizeEventDate(data.event_date) ?? DEFAULT_EVENT_DATES[eventType],
        }));
      })
      .finally(() => setLoading(false));
  }, [eventType]);

  useEffect(() => {
    fetch(`/api/admin/pricing?event=${eventType}`, { cache: "no-store" })
      .then((response) => response.json())
      .then((data: PricingSnapshot) => {
        setPricing(data);
        setPricingCapacity(data.tiers.reduce((sum, tier) => sum + tier.quota, 0));
      })
      .finally(() => setPricingLoading(false));
  }, [eventType]);

  const selectEventType = (nextEventType: EventType) => {
    if (nextEventType === eventType) return;
    setLoading(true);
    setPricingLoading(true);
    setPricing(null);
    setPricingCapacity(0);
    setSaved(false);
    setSettings({
      ...defaultSettings,
      event_date: DEFAULT_EVENT_DATES[nextEventType],
      registration_fee: nextEventType === "fun-bike" ? "150000" : "120000",
      event_location: "Alun-Alun Purworejo",
      event_location_address: "Alun-Alun Purworejo, Purworejo, Jawa Tengah",
      location_lat: "-7.7130878",
      location_lng: "110.0090583",
      location_plus_code: "72P5+QJ",
      racepack_location: nextEventType === "futuristic-run" ? "Kampus Plaosan" : "",
      contact_person: "+62 856-4390-9808",
      contact_person_name: "Bimo Putra",
      contact_person_whatsapp: "+62 856-4390-9808",
      payment_bank_name: "BRI",
      payment_bank_account: "007801112841503",
      payment_bank_holder: "SYIFA FITRIYANTI",
      payment_qris_merchant_name: "SYIFA FITRIYANTI",
      bike_route_note: nextEventType === "fun-bike" ? "Rute masih dalam tahap survei dan belum final." : "",
      faq: EVENTS[nextEventType].faq.map((item) => `${item.q} | ${item.a}`).join("\n"),
      rules: EVENTS[nextEventType].rules.join("\n"),
    });
    setEventType(nextEventType);
  };

  const handleSave = async () => {
    setSaveError("");
    const required: Array<[boolean, Array<keyof SettingsState>, string]> = [
      [settings.payment_transfer_enabled === "true", ["payment_bank_name", "payment_bank_account", "payment_bank_holder"], "Lengkapi seluruh data rekening bank."],
      [settings.payment_qris_enabled === "true", ["payment_qris_image_url", "payment_qris_nmid", "payment_qris_merchant_name"], "QRIS aktif memerlukan gambar, NMID, dan nama merchant."],
    ];
    const invalid = required.find(([enabled, keys]) => enabled && keys.some((key) => !settings[key]?.trim()));
    if (invalid) {
      setSaveError(invalid[2]);
      return;
    }
    if (![settings.payment_transfer_enabled, settings.payment_qris_enabled].includes("true")) {
      setSaveError("Aktifkan minimal satu metode pembayaran.");
      return;
    }
    const deadlineHours = Number(settings.payment_deadline_hours);
    if (!Number.isInteger(deadlineHours) || deadlineHours < 1 || deadlineHours > 168) {
      setSaveError("Batas waktu pembayaran harus 1–168 jam.");
      return;
    }

    setSaving(true);
    const payload = Object.fromEntries(Object.entries({
      ...settings,
      payment_dana_enabled: "false",
      payment_dana_number: "",
      payment_dana_holder: "",
    }).filter(([key]) => {
      if (key === "registration_fee") return false;
      if (eventType === "fun-bike") return key !== "quota_5k" && !key.startsWith("prize_") && !key.startsWith("benefit_");
      return key !== "quota_funbike" && key !== "registration_fee";
    }));
    try {
      const response = await fetch(`/api/admin/settings?eventType=${eventType}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Pengaturan gagal disimpan.");
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (error) {
      setSaveError(error instanceof Error ? error.message : "Pengaturan gagal disimpan.");
    } finally {
      setSaving(false);
    }
  };

  const set = (key: keyof SettingsState, value: string) =>
    setSettings((s) => ({ ...s, [key]: value }));

  const inp = "neon-input w-full rounded-xl px-4 py-3 text-sm";

  const tabs = [
    { id: "event" as const, label: "Event & Kuota", icon: Settings },
    { id: "pricing" as const, label: "Tier Harga", icon: BadgeDollarSign },
    { id: "payment" as const, label: "Pembayaran", icon: CreditCard },
  ];

  const feeFormatted = formatPricingCurrency(pricing?.currentPrice);

  const updatePricingTier = (id: string, patch: Partial<PricingTier>) => {
    setPricing((current) => {
      if (!current) return current;
      let tiers = current.tiers.map((tier) => tier.id === id ? { ...tier, ...patch } : tier);
      if (id === "presale1" && (patch.quota !== undefined || patch.active !== undefined)) {
        const presale = tiers.find((tier) => tier.id === "presale1");
        tiers = tiers.map((tier) => tier.id === "normal"
          ? { ...tier, quota: presale?.active ? Math.max(0, pricingCapacity - (presale.quota ?? 0)) : pricingCapacity }
          : tier);
      }
      return { ...current, tiers };
    });
  };

  const savePricing = async () => {
    if (!pricing) return;
    setSavingPricing(true);
    setSaveError("");
    try {
      const response = await fetch(`/api/admin/pricing?event=${eventType}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tiers: pricing.tiers }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Tier harga gagal disimpan.");
      const refreshed = await fetch(`/api/admin/pricing?event=${eventType}`, { cache: "no-store" });
      const refreshedPricing: PricingSnapshot = await refreshed.json();
      setPricing(refreshedPricing);
      setPricingCapacity(refreshedPricing.tiers.reduce((sum, tier) => sum + tier.quota, 0));
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (error) {
      setSaveError(error instanceof Error ? error.message : "Tier harga gagal disimpan.");
    } finally {
      setSavingPricing(false);
    }
  };

  return (
    <div className="page-animate w-full min-w-0 max-w-3xl overflow-x-hidden p-4 sm:p-6 lg:p-8">
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
      <div className="card-animated mb-6 grid grid-cols-1 gap-1 rounded-xl border border-[#1E3A5F] p-1 glass-card min-[430px]:grid-cols-3">
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
                        value={
                          key === "event_date" && settings[key]
                            ? toDateTimeLocal(settings[key])
                            : type === "date" && settings[key]
                            ? settings[key].split("T")[0]
                            : settings[key]
                        }
                        placeholder={placeholder}
                        onChange={(e) => set(
                          key,
                          key === "event_date" && e.target.value ? fromDateTimeLocal(e.target.value) : e.target.value,
                        )}
                        required={key === "event_date"}
                      />
                    </div>
                  ))}
                  {eventType === "fun-bike" && (
                    <div>
                      <label className="block text-[#B0C4DE] text-sm mb-1.5">Alamat Titik Kumpul</label>
                      <input
                        type="text"
                        className={inp}
                        value={settings.event_location_address}
                        placeholder="Alun-Alun Purworejo, Purworejo, Jawa Tengah"
                        onChange={(e) => set("event_location_address", e.target.value)}
                      />
                    </div>
                  )}
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
                </div>
              </SectionCard>

              <SectionCard icon={Settings} title={eventType === "fun-bike" ? "KONTEN FUTURISTIC BIKE" : "KONTEN FUTURISTIC RUN"} color={eventType === "fun-bike" ? "#FF6B2C" : "#00E5FF"}>
                <div className="space-y-4">
                  <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-2 bg-[#0A0E27] p-3 rounded-xl border border-[#1E3A5F]">
                    <span className="text-xs text-[#B0C4DE]">Muat template FAQ & Ketentuan terperinci terbaru dari sistem web:</span>
                    <button
                      type="button"
                      onClick={() => {
                        const ev = EVENTS[eventType];
                        set("faq", ev.faq.map((item) => `${item.q} | ${item.a}`).join("\n"));
                        set("rules", ev.rules.join("\n"));
                      }}
                      className="btn-outline-neon text-xs px-3 py-1.5 rounded-lg flex items-center justify-center gap-1.5 font-semibold cursor-pointer shrink-0 hover:bg-[#00E5FF]/10 transition-colors"
                    >
                      🔄 Muat Template Detail Web
                    </button>
                  </div>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <label className="block text-[#B0C4DE] text-sm mb-1.5">Nama Contact Person</label>
                      <input
                        type="text"
                        className={inp}
                        value={settings.contact_person_name}
                        placeholder="Bimo Putra"
                        onChange={(e) => set("contact_person_name", e.target.value)}
                      />
                    </div>
                    <div>
                      <label className="block text-[#B0C4DE] text-sm mb-1.5">Nomor WhatsApp</label>
                      <input
                        type="tel"
                        className={inp}
                        value={settings.contact_person_whatsapp || settings.contact_person}
                        placeholder="Contoh: 081234567890"
                        onChange={(e) => {
                          const value = e.target.value.replace(/[^0-9+]/g, "");
                          set("contact_person_whatsapp", value);
                          set("contact_person", value);
                        }}
                      />
                    </div>
                  </div>
                  {eventType === "futuristic-run" && (
                    <div>
                      <label className="block text-[#B0C4DE] text-sm mb-1.5">Lokasi Race Pack</label>
                      <input
                        type="text"
                        className={inp}
                        value={settings.racepack_location}
                        placeholder="Kampus Plaosan"
                        onChange={(e) => set("racepack_location", e.target.value)}
                      />
                    </div>
                  )}
                  {eventType === "fun-bike" && <div>
                    <label className="block text-[#B0C4DE] text-sm mb-1.5">Nominal Uang Pembinaan</label>
                    <input
                      type="text"
                      className={inp}
                      value={settings.bike_prize_amount}
                      placeholder="Kosongkan untuk: Diumumkan saat technical meeting"
                      onChange={(e) => set("bike_prize_amount", e.target.value)}
                    />
                    <p className="text-[#B0C4DE] text-xs mt-1">Fun Ride bukan lomba waktu; nominal ini hanya untuk apresiasi/penghargaan.</p>
                  </div>}
                  {eventType === "fun-bike" && <div>
                    <label className="block text-[#B0C4DE] text-sm mb-1.5">Catatan Rute</label>
                    <input
                      type="text"
                      className={inp}
                      value={settings.bike_route_note}
                      placeholder="Rute masih dalam tahap survei dan belum final."
                      onChange={(e) => set("bike_route_note", e.target.value)}
                    />
                  </div>}
                  <div>
                    <label className="block text-[#B0C4DE] text-sm mb-1.5">FAQ ({eventType === "fun-bike" ? "Futuristic Bike" : "Futuristic Run"})</label>
                    <textarea
                      className={`${inp} min-h-40 resize-y`}
                      value={settings.faq}
                      placeholder={eventType === "fun-bike"
                        ? "Kapan dan di mana pelaksanaan Futuristic Bike 2026? | Futuristic Bike dilaksanakan pada Minggu pagi, 2 Agustus 2026...\nApakah acara ini merupakan lomba balap sepeda? | Bukan. Futuristic Bike adalah kegiatan Fun Ride..."
                        : "Kapan dan di mana tepatnya Futuristic Run 2026? | Futuristic Run diselenggarakan pada Sabtu malam, 1 Agustus 2026...\nBerapa jarak tempuh rute? | Jarak lari resmi adalah 5 kilometer..."}
                      onChange={(e) => set("faq", e.target.value)}
                      maxLength={5000}
                    />
                    <p className="text-[#B0C4DE] text-xs mt-1">Format: satu baris per FAQ. Pisahkan pertanyaan dan jawaban dengan tanda pipa (|).</p>
                  </div>
                  <div>
                    <label className="block text-[#B0C4DE] text-sm mb-1.5">Peraturan & Ketentuan Resmi ({eventType === "fun-bike" ? "Futuristic Bike" : "Futuristic Run"})</label>
                    <textarea
                      className={`${inp} min-h-40 resize-y`}
                      value={settings.rules}
                      placeholder={eventType === "fun-bike"
                        ? "01. Pendaftaran & Identitas | Peserta wajib mendaftar dengan identitas asli yang sah. • Pendaftaran baru dianggap selesai setelah bukti transfer diverifikasi...\n02. Kelayakan Sepeda | Peserta wajib menggunakan sepeda dalam kondisi prima..."
                        : "01. Registrasi & Identitas | Peserta wajib mendaftar menggunakan identitas asli (KTP/SIM). • Pendaftaran dinyatakan sah setelah verifikasi...\n02. Kesiapan Fisik & Medis | Peserta wajib sehat jasmani dan rohani..."}
                      onChange={(e) => set("rules", e.target.value)}
                      maxLength={5000}
                    />
                    <p className="text-[#B0C4DE] text-xs mt-1">Format: satu pasal per baris. Pisahkan judul pasal dan poin-poin dengan tanda pipa (|). Pisahkan antar poin dengan tanda bullet (•).</p>
                  </div>
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
                      help: "Konten ini langsung menggantikan badge Informasi menyusul di halaman Run.",
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
                  <p className="text-xs leading-5 text-[#B0C4DE]">Kosongkan nominal kategori SD untuk menampilkan “Informasi menyusul”. Nilai kategori lain memakai nominal anggaran sebagai default.</p>
                </div>
              </SectionCard>}
            </>
          )}

          {/* ── PAYMENT TAB ── */}
          {activeTab === "pricing" && (
            pricingLoading ? <LoadingPanel label="Memuat tier harga" /> : (
              <div className="space-y-6">
                <SectionCard icon={BadgeDollarSign} title="PRICING TIER" color="#FFD700">
                  <div className="mb-5 grid gap-3 sm:grid-cols-3">
                    <div className="rounded-xl border border-[#00E5FF]/20 bg-[#00E5FF]/5 p-4"><p className="text-xs text-[#B0C4DE]">Tier Aktif</p><p className="mt-1 font-bold text-[#00E5FF]">{pricing?.currentTier?.label ?? "Habis"}</p></div>
                    <div className="rounded-xl border border-[#FFD700]/20 bg-[#FFD700]/5 p-4"><p className="text-xs text-[#B0C4DE]">Harga Saat Ini</p><p className="mt-1 font-bold text-[#FFD700]">{formatPricingCurrency(pricing?.currentPrice)}</p></div>
                    <div className="rounded-xl border border-[#8B00FF]/20 bg-[#8B00FF]/5 p-4"><p className="text-xs text-[#B0C4DE]">Sisa Presale</p><p className="mt-1 font-bold text-[#C4B5FD]">{pricing?.presaleRemaining ?? 0} slot</p></div>
                  </div>
                  <div className="space-y-4">
                    {pricing?.tiers.map((tier) => (
                      <div key={tier.id} className="rounded-2xl border border-[#1E3A5F] bg-[#0A0E27] p-4">
                        <div className="mb-4 flex items-center justify-between gap-3">
                          <div><p className="font-bold text-white">{tier.label}</p><p className="text-xs text-[#B0C4DE]">Urutan {tier.order}</p></div>
                          <Toggle label="Aktif" desc={tier.active ? "Tier digunakan" : "Tier dilewati"} value={tier.active} onChange={(active) => updatePricingTier(tier.id, { active })} />
                        </div>
                        <div className="grid gap-4 sm:grid-cols-2">
                          <div><label className="mb-1.5 block text-sm text-[#B0C4DE]">Harga (Rp)</label><input type="number" className={inp} min={1} step={1000} value={tier.price} onChange={(event) => updatePricingTier(tier.id, { price: Number(event.target.value) })} /></div>
                          <div><label className="mb-1.5 block text-sm text-[#B0C4DE]">Kuota</label><input type="number" className={inp} min={0} value={tier.quota} readOnly={tier.id === "normal"} onChange={(event) => updatePricingTier(tier.id, { quota: Number(event.target.value) })} />{tier.id === "normal" && <p className="mt-1 text-xs text-[#B0C4DE]">Otomatis mengikuti sisa kuota event.</p>}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </SectionCard>
                <button type="button" onClick={savePricing} disabled={savingPricing} className="btn-neon flex min-h-11 w-full items-center justify-center gap-2 rounded-xl px-8 text-sm font-bold disabled:opacity-50 sm:w-auto">
                  {savingPricing ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}{savingPricing ? "Menyimpan..." : "SIMPAN TIER HARGA"}
                </button>
              </div>
            )
          )}

          {activeTab === "payment" && (
            <>
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
                    <label className="block text-[#B0C4DE] text-sm mb-1.5">Nama Merchant</label>
                    <input
                      type="text"
                      className={inp}
                      value={settings.payment_qris_merchant_name}
                      placeholder="Nama merchant pada QRIS"
                      onChange={(e) => set("payment_qris_merchant_name", e.target.value)}
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
                        <div className="text-white font-bold text-sm">{settings.payment_qris_merchant_name || "Nama merchant"}</div>
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

              <SectionCard icon={CreditCard} title="INSTRUKSI & BATAS PEMBAYARAN" color="#FFD700">
                <div className="space-y-4">
                  <div>
                    <label className="block text-[#B0C4DE] text-sm mb-1.5">Instruksi Umum</label>
                    <textarea
                      className={`${inp} min-h-32 resize-y`}
                      value={settings.payment_instructions}
                      onChange={(e) => set("payment_instructions", e.target.value)}
                      maxLength={2000}
                      placeholder="Tulis instruksi pembayaran. Baris baru akan dipertahankan."
                    />
                    <p className="mt-1 text-xs text-[#B0C4DE]">Mendukung paragraf/baris baru, maksimal 2.000 karakter.</p>
                  </div>
                  <div>
                    <label className="block text-[#B0C4DE] text-sm mb-1.5">Batas Waktu Setelah Daftar (jam)</label>
                    <input
                      type="number"
                      className={inp}
                      value={settings.payment_deadline_hours}
                      onChange={(e) => set("payment_deadline_hours", e.target.value)}
                      min={1}
                      max={168}
                    />
                  </div>
                </div>
              </SectionCard>
            </>
          )}

          {saveError && (
            <div role="alert" className="flex items-start gap-2 rounded-xl border border-red-400/30 bg-red-500/10 p-4 text-sm text-red-200">
              <AlertCircle size={17} className="mt-0.5 shrink-0" />
              <span>{saveError}</span>
            </div>
          )}

          {/* Save button */}
          {activeTab !== "pricing" && (
            <div className="sticky bottom-6 z-40 mt-8 flex justify-end">
              <button
                onClick={handleSave}
                disabled={saving}
                className="btn-neon shadow-[0_0_20px_rgba(0,229,255,0.4)] flex items-center gap-2 px-8 py-3 rounded-xl text-sm font-bold disabled:opacity-50 cursor-pointer w-full sm:w-auto justify-center"
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
      )}
    </div>
  );
}
