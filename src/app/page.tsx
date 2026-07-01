import Link from "next/link";
import Image from "next/image";
import CountdownTimer from "@/components/CountdownTimer";
import { ArrowRight, MapPin, Calendar, Users, Zap, Bike, ChevronDown } from "lucide-react";
import type { Metadata } from "next";
import ScrollProgressBar from "@/components/ui/ScrollProgressBar";
import TbdBadge, { hasAnnouncedValue } from "@/components/ui/TbdBadge";
import { FEST_FULL_NAME, FEST_NAME, ORGANIZER_NAME, CONTACT_EMAIL, DEFAULT_WHATSAPP } from "@/content/brand";
import { EVENT_LIST, type EventContent } from "@/content/events";
import { getPublicEventsOps, type PublicEventOps } from "@/lib/eventOps";
import { hubMetadata, EVENT_SEO, eventJsonLd, withOperationalEventSeo } from "@/lib/seo";
import { formatEventDate, normalizeEventDate } from "@/lib/eventDate";

export const metadata: Metadata = hubMetadata;
export const dynamic = "force-dynamic";

function formatCurrency(amount: number | null) {
  if (!hasAnnouncedValue(amount)) return null;
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(amount as number);
}

function formatDateLabel(date: string) {
  return formatEventDate(date);
}

function dateBadge(date: string) {
  const normalized = normalizeEventDate(date);
  if (!normalized) return null;
  const parsed = new Date(normalized);
  const parts = new Intl.DateTimeFormat("id-ID", {
    day: "2-digit",
    month: "short",
    timeZone: "Asia/Jakarta",
  }).formatToParts(parsed);
  return {
    day: parts.find((part) => part.type === "day")?.value ?? "",
    month: (parts.find((part) => part.type === "month")?.value ?? "").toUpperCase(),
  };
}

function totalQuota(ops: Record<string, PublicEventOps>) {
  const values = Object.values(ops).map((item) => item.quota).filter((quota): quota is number => hasAnnouncedValue(quota));
  return values.length > 0 ? values.reduce((sum, quota) => sum + quota, 0) : null;
}

function EventCard({ event, ops }: { event: EventContent; ops: PublicEventOps }) {
  const isBike = event.slug === "fun-bike";
  const badge = dateBadge(ops.eventDate);
  const price = formatCurrency(ops.price);
  const category = ops.categoryLabel ?? event.categoryLabel;
  const quota = ops.quota ? `${ops.quota} Peserta` : null;

  return (
    <Link
      href={event.route}
      className={`hub-event-card group card-animated relative rounded-2xl sm:rounded-3xl overflow-hidden border transition-all duration-500 hover:-translate-y-2 ${
        isBike
          ? "border-[#E5E7EB]/20 hover:border-[#FF6B2C]/50 hover:shadow-[0_0_40px_rgba(255,107,44,0.15)]"
          : "border-[#1E3A5F] hover:border-[#00E5FF]/50 hover:shadow-[0_0_40px_rgba(0,229,255,0.15)]"
      }`}
    >
      <div
        className={`relative rounded-2xl sm:rounded-3xl overflow-hidden h-full flex flex-col ${isBike ? "" : "bg-[#080C20]"}`}
        style={isBike ? { background: "linear-gradient(180deg, #FFF8F0 0%, #FFFFFF 100%)" } : undefined}
      >
        <div
          className="h-1 w-full"
          style={{
            background: isBike
              ? "linear-gradient(90deg, #FF6B2C, #F59E0B, #7BC142)"
              : "linear-gradient(90deg, #8B00FF, #00E5FF, #8B00FF)",
          }}
        />

        <div
          className="hub-event-media relative h-36 min-[430px]:h-44 sm:h-60 overflow-hidden"
          style={isBike ? { background: "linear-gradient(180deg, #FDE68A 0%, #FED7AA 30%, #FFEDD5 60%, #FFF7ED 100%)" } : undefined}
        >
          {isBike ? (
            <>
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[200px] h-[200px]">
                <div className="absolute inset-0 rounded-full opacity-30" style={{ background: "radial-gradient(circle, #F59E0B 0%, transparent 70%)" }} />
                <div className="absolute inset-4 rounded-full opacity-20" style={{ background: "radial-gradient(circle, #FF6B2C 0%, transparent 60%)" }} />
              </div>
              <div className="absolute bottom-0 left-0 right-0 h-20">
                <svg viewBox="0 0 600 80" className="absolute bottom-0 w-full h-full" preserveAspectRatio="none" aria-hidden="true">
                  <path d="M0,80 L0,50 Q80,20 160,45 Q240,15 320,40 Q400,10 480,35 Q540,20 600,40 L600,80 Z" fill="#7BC142" opacity="0.15" />
                  <path d="M0,80 L0,55 Q100,30 200,50 Q300,25 400,48 Q500,22 600,45 L600,80 Z" fill="#7BC142" opacity="0.1" />
                </svg>
              </div>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="relative">
                  <div className="w-16 h-16 sm:w-24 sm:h-24 rounded-full bg-white/45 border border-white/70 shadow-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-500">
                    <Bike size={36} className="sm:hidden text-[#FF6B2C]" />
                    <Bike size={54} className="hidden sm:block text-[#FF6B2C]" />
                  </div>
                  <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-16 h-2 bg-black/5 rounded-full blur-sm" />
                </div>
              </div>
              <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-[#FFF8F0] to-transparent" />
            </>
          ) : (
            <>
              <Image
                src="/hero-runner.png"
                alt={`${event.name} night runner`}
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover object-top group-hover:scale-105 transition-transform duration-700"
                style={{ filter: "brightness(0.6) saturate(1.3)" }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#080C20] via-[#080C20]/30 to-transparent" />
            </>
          )}

          <div
            className={`absolute top-2 right-2 sm:top-4 sm:right-4 backdrop-blur-sm rounded-lg px-2 py-1 sm:px-3 sm:py-1.5 text-center ${
              isBike
                ? "bg-white/80 border border-[#FF6B2C]/30 shadow-sm"
                : "bg-[#080C20]/80 border border-[#00E5FF]/30"
            }`}
          >
            {badge && (
              <>
                <div className={`text-sm sm:text-lg font-black leading-none ${isBike ? "text-[#FF6B2C]" : "text-[#00E5FF]"}`} style={{ fontFamily: "Orbitron, sans-serif" }}>
                  {badge.day}
                </div>
                <div className={`${isBike ? "text-gray-500" : "text-[#B0C4DE]"} text-[0.5rem] sm:text-[0.6rem] tracking-wider`}>{badge.month}</div>
              </>
            )}
          </div>

          <div className="absolute bottom-3 left-3 right-3 sm:bottom-4 sm:left-5 sm:right-5">
            <div
              className={`inline-flex items-center gap-1 sm:gap-1.5 rounded-full px-2 py-1 sm:px-3 mb-2 ${
                isBike
                  ? "bg-[#FF6B2C]/15 border border-[#FF6B2C]/30"
                  : "bg-[#8B00FF]/20 border border-[#8B00FF]/40"
              }`}
            >
              {isBike ? <Bike size={10} className="text-[#FF6B2C]" /> : <Zap size={10} className="text-[#8B00FF]" />}
              <span
                className={`text-[0.48rem] min-[430px]:text-[0.55rem] sm:text-[0.6rem] font-bold tracking-wider sm:tracking-widest ${
                  isBike ? "text-[#FF6B2C]" : "text-[#C4B5FD]"
                }`}
                style={{ fontFamily: "Orbitron, sans-serif" }}
              >
                {event.hero.tema.toUpperCase()}
              </span>
            </div>
            <h3
              className={`text-lg min-[430px]:text-2xl sm:text-4xl font-black leading-tight ${isBike ? "text-gray-900" : "text-white"}`}
              style={{ fontFamily: "Orbitron, sans-serif" }}
            >
              {event.name.toUpperCase()}
            </h3>
            <p className={`mt-1 text-[0.58rem] sm:text-xs ${isBike ? "text-gray-600" : "text-[#B0C4DE]"}`}>Alias {event.alias}</p>
          </div>
        </div>

        <div className="p-3 min-[430px]:p-4 sm:p-6 flex-1 flex flex-col">
          <p className={`hub-event-copy text-[0.68rem] min-[430px]:text-xs sm:text-sm leading-relaxed mb-3 sm:mb-4 ${isBike ? "text-gray-600" : "text-[#B0C4DE]"}`}>
            {event.hero.description}
          </p>

          <div className="hub-event-meta flex flex-wrap gap-1 min-[430px]:gap-1.5 sm:gap-2 mb-4 sm:mb-5">
            <span className={`inline-flex items-center gap-0.5 min-[430px]:gap-1 rounded-full px-1.5 py-0.5 min-[430px]:px-2 min-[430px]:py-1 sm:px-3 text-[0.55rem] min-[430px]:text-[0.62rem] sm:text-xs font-medium ${isBike ? "bg-[#FF6B2C]/8 border border-[#FF6B2C]/20 text-[#FF6B2C]" : "bg-[#00E5FF]/10 border border-[#00E5FF]/20 text-[#00E5FF]"}`}>
              {isBike ? <><Bike size={9} className="min-[430px]:hidden" /><Bike size={10} className="hidden min-[430px]:block" /></> : <><Zap size={9} className="min-[430px]:hidden" /><Zap size={10} className="hidden min-[430px]:block" /></>} {category}
            </span>
            {quota ? (
              <span className={`hidden min-[430px]:inline-flex items-center gap-1 rounded-full px-2 py-1 sm:px-3 text-[0.62rem] sm:text-xs font-medium ${isBike ? "bg-[#FF6B2C]/8 border border-[#FF6B2C]/20 text-[#FF6B2C]" : "bg-[#00E5FF]/10 border border-[#00E5FF]/20 text-[#00E5FF]"}`}>
                <Users size={11} /> {quota}
              </span>
            ) : (
              <TbdBadge className="hidden min-[430px]:inline-flex" />
            )}
            {price ? (
              <>
                <span className={`inline-flex items-center gap-0.5 min-[430px]:gap-1 rounded-full px-1.5 py-0.5 min-[430px]:px-2 min-[430px]:py-1 sm:px-3 text-[0.5rem] min-[430px]:text-[0.62rem] sm:text-xs font-bold ${isBike ? "bg-[#7BC142]/8 border border-[#7BC142]/20 text-[#5A9A2F]" : "bg-[#FFD700]/10 border border-[#FFD700]/20 text-[#FFD700]"}`} style={{ fontFamily: "Orbitron, sans-serif" }}>
                  {!isBike && ops.currentTierLabel ? `${ops.currentTierLabel} ` : ""}{price}
                </span>
                {!isBike && ops.presaleQuota ? (
                  <span className={`inline-flex rounded-full px-2 py-1 text-[0.55rem] font-bold ${ops.presaleRemaining && ops.presaleRemaining > 0 ? "bg-[#00E5FF]/10 text-[#00E5FF]" : "bg-[#FF006E]/10 text-[#FF006E]"}`}>
                    {ops.presaleRemaining && ops.presaleRemaining > 0 ? `Sisa ${ops.presaleRemaining}/${ops.presaleQuota}` : "Presale Habis"}
                  </span>
                ) : null}
                {!isBike && ops.normalPrice && ops.normalPrice !== ops.price ? (
                  <span className="text-[0.55rem] text-[#B0C4DE] line-through">Normal {formatCurrency(ops.normalPrice)}</span>
                ) : null}
              </>
            ) : (
              <TbdBadge />
            )}
          </div>

          <div
            className={`mt-auto flex items-center justify-center gap-1.5 sm:gap-2 rounded-xl py-2.5 sm:py-3 px-3 sm:px-5 font-bold text-[0.65rem] sm:text-sm transition-all duration-300 ${
              isBike
                ? "bg-gradient-to-r from-[#FF6B2C]/10 to-[#F59E0B]/10 border border-[#FF6B2C]/30 text-[#FF6B2C] group-hover:from-[#FF6B2C]/20 group-hover:to-[#F59E0B]/20"
                : "bg-gradient-to-r from-[#8B00FF]/20 to-[#00E5FF]/20 border border-[#00E5FF]/30 text-[#00E5FF] group-hover:from-[#8B00FF]/30 group-hover:to-[#00E5FF]/30"
            }`}
            style={{ fontFamily: "Orbitron, sans-serif", letterSpacing: "1px" }}
          >
            LIHAT<span className="hidden min-[430px]:inline"> EVENT</span>
            <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
          </div>
        </div>
      </div>
    </Link>
  );
}

export default async function HubPage() {
  const ops = await getPublicEventsOps(EVENT_LIST.map((event) => event.slug));
  const quota = totalQuota(ops);
  const primaryDate = ops["futuristic-run"].eventDate;
  const primaryLocation = ops["futuristic-run"].location
    ?? ops["fun-bike"].location
    ?? EVENT_LIST[0].location?.label
    ?? EVENT_LIST[1].location?.label;
  const hubJsonLd = EVENT_LIST.map((item) => eventJsonLd(withOperationalEventSeo(
    EVENT_SEO[item.slug],
    ops[item.slug].eventDate,
    ops[item.slug].location
  )));

  return (
    <>
      <main className="page-animate relative min-h-screen bg-[#0A0E27]">
        <ScrollProgressBar color="#8B00FF" />

        <section className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-[#050816] via-[#0A0E27] to-[#0A0E27]" />
          <div
            className="absolute inset-0 opacity-[0.04]"
            style={{
              backgroundImage:
                "linear-gradient(rgba(0,229,255,1) 1px, transparent 1px), linear-gradient(90deg, rgba(0,229,255,1) 1px, transparent 1px)",
              backgroundSize: "60px 60px",
            }}
          />

          <div className="absolute top-1/4 left-1/4 w-[400px] h-[400px] rounded-full blur-3xl opacity-15 bg-[#8B00FF]" />
          <div className="absolute top-1/3 right-1/4 w-[300px] h-[300px] rounded-full blur-3xl opacity-10 bg-[#FF6B2C]" />

          <div className="relative z-20 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 sm:pt-24 pb-12 text-center -mt-16 sm:mt-0">
            <div className="badge-neon inline-block mb-6 fade-in-up">{ORGANIZER_NAME} PRESENTS</div>

            <h1 className="fade-in-up-delay-1 mb-4" style={{ fontFamily: "Orbitron, sans-serif", fontSize: "clamp(2.35rem, 7vw, 5rem)", fontWeight: 900, lineHeight: 1.1 }}>
              <span
                style={{
                  background: "linear-gradient(135deg, #00E5FF 0%, #ffffff 35%, #FFD700 70%, #FF6B2C 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
              >
                {FEST_FULL_NAME}
              </span>
            </h1>

            <p className="fade-in-up-delay-2 text-[#B0C4DE] tracking-[3px] mb-3 text-sm sm:text-base" style={{ fontFamily: "Rajdhani, sans-serif" }}>
              DUA EVENT . SATU VIBES . TANPA BATAS
            </p>

            <p className="fade-in-up-delay-2 max-w-2xl mx-auto text-[#D7E8FF] text-base sm:text-lg leading-relaxed mb-8">
              {FEST_FULL_NAME} menghadirkan {EVENT_LIST[0].name} (alias {EVENT_LIST[0].alias}) dan {EVENT_LIST[1].name} (alias {EVENT_LIST[1].alias}).
              Pilih pengalamanmu: lari malam neon atau ride pagi sunrise.
            </p>

            <div className="fade-in-up-delay-2 flex flex-wrap justify-center gap-4 text-[#B0C4DE] text-sm mb-10">
              <span className="flex items-center gap-1.5">
                <MapPin size={14} className="text-[#00E5FF]" />
                {hasAnnouncedValue(primaryLocation) ? primaryLocation : <TbdBadge />}
              </span>
              <span className="flex items-center gap-1.5">
                <Calendar size={14} className="text-[#00E5FF]" />
                {formatDateLabel(primaryDate)}
              </span>
              <span className="flex items-center gap-1.5">
                <Users size={14} className="text-[#00E5FF]" />
                {quota ? `${quota}+ Peserta` : <TbdBadge />}
              </span>
            </div>

            <div className="fade-in-up-delay-3 mb-8">
              <p className="text-[#B0C4DE] text-xs tracking-widest mb-3" style={{ fontFamily: "Orbitron, sans-serif" }}>
                HITUNG MUNDUR MENUJU HARI H
              </p>
              <CountdownTimer targetIso={primaryDate} />
            </div>
          </div>

          <a href="#events" className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-1 text-[#B0C4DE] opacity-60 hover:opacity-100 transition-opacity">
            <span className="text-xs tracking-widest" style={{ fontFamily: "Orbitron, sans-serif" }}>SCROLL</span>
            <ChevronDown size={20} className="animate-bounce" />
          </a>
        </section>

        <section id="events" className="relative pb-4 pt-14 sm:py-20 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-[#0A0E27] via-[#0F1535] to-[#0A0E27]" />

          <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-10 sm:mb-14">
              <div className="badge-neon inline-block mb-4">PILIH EVENTMU</div>
              <h2 className="section-title text-3xl sm:text-5xl font-black mb-4 px-2" style={{ fontFamily: "Orbitron, sans-serif" }}>
                EVENT {FEST_FULL_NAME}
              </h2>
              <div className="w-24 h-1 mx-auto rounded-full bg-gradient-to-r from-[#00E5FF] via-[#FFD700] to-[#FF6B2C]" />
            </div>

            <div className="hub-event-grid grid grid-cols-2 gap-3 sm:gap-5 lg:gap-8">
              {EVENT_LIST.map((event) => (
                <EventCard key={event.slug} event={event} ops={ops[event.slug]} />
              ))}
            </div>
          </div>
        </section>

        <section className="relative pb-4 pt-4 sm:py-20 overflow-hidden">
          <div className="absolute inset-0 bg-[#0A0E27]" />
          <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="badge-neon inline-block mb-4">TENTANG KAMI</div>
            <h2 className="section-title text-3xl sm:text-4xl font-black mb-6" style={{ fontFamily: "Orbitron, sans-serif" }}>
              TENTANG {FEST_NAME.toUpperCase()}
            </h2>
            <p className="text-[#B0C4DE] text-lg leading-relaxed mb-6">
              <span className="text-white font-semibold">{FEST_FULL_NAME}</span> adalah festival olahraga dan teknologi yang diselenggarakan oleh{" "}
              <span className="text-[#00E5FF] font-semibold">{ORGANIZER_NAME}</span>.
            </p>
            <p className="text-[#B0C4DE] leading-relaxed mb-8">
              Tahun ini, festival menghadirkan dua event utama: <span className="text-[#00E5FF]">{EVENT_LIST[0].name}</span> dan{" "}
              <span className="text-[#FF6B2C]">{EVENT_LIST[1].name}</span>. Keduanya dirancang untuk peserta yang ingin bergerak, berkumpul, dan menikmati event dengan identitas visual yang kuat.
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 stagger-list">
              {[
                { value: String(EVENT_LIST.length), label: "Event Seru", color: "#FFD700" },
                { value: quota ? `${quota}+` : null, label: "Total Kuota", color: "#00E5FF" },
                { value: "1", label: "Festival", color: "#FF006E" },
                { value: "2026", label: "Edisi", color: "#8B00FF" },
              ].map((stat) => (
                <div key={stat.label} className="card-animated glass-card p-5 rounded-2xl text-center border border-[#1E3A5F]">
                  <div className="text-3xl font-black mb-1" style={{ fontFamily: "Orbitron, sans-serif", color: stat.color }}>
                    {stat.value ?? <TbdBadge />}
                  </div>
                  <div className="text-[#B0C4DE] text-xs">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="relative pb-12 pt-4 sm:py-16 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-[#0A0E27] via-[#0F1535] to-[#0A0E27]" />
          <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="badge-neon inline-block mb-4">DIDUKUNG OLEH</div>
            <h2 className="text-2xl font-black text-white mb-8" style={{ fontFamily: "Orbitron, sans-serif" }}>
              SPONSOR & PARTNER
            </h2>
            <div className="flex flex-wrap justify-center gap-4">
              {Array.from({ length: 5 }).map((_, i) => (
                <div
                  key={i}
                  className="card-animated glass-card flex h-20 basis-[calc((100%-2rem)/3)] items-center justify-center rounded-xl border border-[#1E3A5F]/50 p-3 sm:min-w-0 sm:flex-1 sm:basis-0 sm:p-4"
                >
                  <TbdBadge label={`Sponsor ${i + 1}`} />
                </div>
              ))}
            </div>
          </div>
        </section>

        <footer className="relative border-t border-[#1E3A5F] bg-[#080C20]">
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#00E5FF]/50 to-transparent" />
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 text-center sm:text-left">
              <div>
                <h3 className="text-white font-bold text-sm mb-2" style={{ fontFamily: "Orbitron, sans-serif" }}>{FEST_FULL_NAME}</h3>
                <p className="text-[#B0C4DE] text-sm leading-relaxed">Festival olahraga dan teknologi tahunan oleh {ORGANIZER_NAME}.</p>
              </div>
              <div>
                <h3 className="text-white font-bold text-sm mb-2" style={{ fontFamily: "Orbitron, sans-serif" }}>EVENT</h3>
                <ul className="space-y-2 text-sm">
                  {EVENT_LIST.map((event) => (
                    <li key={event.slug}>
                      <Link href={event.route} className="text-[#B0C4DE] hover:text-white transition-colors">
                        {event.name} 2026
                      </Link>
                    </li>
                  ))}
                  <li>
                    <Link href="/cek" className="text-[#B0C4DE] hover:text-white transition-colors">
                      Cek Registrasi
                    </Link>
                  </li>
                </ul>
              </div>
              <div>
                <h3 className="text-white font-bold text-sm mb-2" style={{ fontFamily: "Orbitron, sans-serif" }}>KONTAK</h3>
                <ul className="space-y-2 text-sm text-[#B0C4DE]">
                  <li>{CONTACT_EMAIL}</li>
                  <li>{ops["futuristic-run"].contactPerson ?? ops["fun-bike"].contactPerson ?? DEFAULT_WHATSAPP}</li>
                </ul>
              </div>
            </div>
            <div className="mt-8 pt-6 border-t border-[#1E3A5F] flex flex-col sm:flex-row justify-between items-center gap-4">
              <p className="text-[#B0C4DE] text-xs">
                &copy; 2026 <span className="text-[#00E5FF]">{FEST_NAME}</span>. All rights reserved.
              </p>
              <div className="flex gap-4">
                <Link href="/kebijakan-privasi" className="text-[#B0C4DE] hover:text-white text-xs transition-colors">Kebijakan Privasi</Link>
                <Link href="/syarat-ketentuan" className="text-[#B0C4DE] hover:text-white text-xs transition-colors">Syarat & Ketentuan</Link>
              </div>
            </div>
          </div>
        </footer>
      </main>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(hubJsonLd) }}
      />
    </>
  );
}
