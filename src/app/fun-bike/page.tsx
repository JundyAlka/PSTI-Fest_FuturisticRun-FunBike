import EventNavbar from "@/components/EventNavbar";
import EventThemeProvider from "@/components/EventThemeProvider";
import Link from "next/link";
import {
  ArrowRight,
  Bike,
  Calendar,
  CheckCircle,
  ExternalLink,
  Gift,
  MapPin,
  Music,
  Navigation,
  Package,
  ShieldCheck,
  Shirt,
  Sun,
  Ticket,
  Clock,
  Trophy,
} from "lucide-react";
import type { Metadata } from "next";
import { Suspense } from "react";
import FunBikeCountdown from "./FunBikeCountdown";
import FunBikeFaq from "./FunBikeFaq";
import RulesSection from "@/components/sections/RulesSection";
import RouteMapImage from "@/components/ui/RouteMapImage";
import ScrollProgressBar from "@/components/ui/ScrollProgressBar";
import HoverTiltCard from "@/components/ui/HoverTiltCard";
import RundownTimeline from "@/components/ui/RundownTimeline";
import RundownActions from "@/components/ui/RundownActions";
import MarqueeSponsors from "@/components/ui/MarqueeSponsors";
import AnimatedIcon from "@/components/ui/AnimatedIcon";
import SectionHeading from "@/components/ui/SectionHeading";
import LocationMap from "@/components/ui/LocationMap";
import { hasAnnouncedValue } from "@/components/ui/TbdBadge";
import QuotaMeter from "@/components/QuotaMeter";
import { CONTACT_EMAIL, DEFAULT_WHATSAPP, FEST_FULL_NAME, FEST_NAME, FEST_YEAR, ORGANIZER_NAME } from "@/content/brand";
import { EVENTS, type EventLocation } from "@/content/events";
import { getPublicEventOps } from "@/lib/eventOps";
import { resolveEventLocation } from "@/lib/eventLocation";
import { EVENT_SEO, eventJsonLd, eventMetadata, withOperationalEventSeo } from "@/lib/seo";
import { formatEventDate, formatWibTime } from "@/lib/eventDate";

const seo = EVENT_SEO["fun-bike"];
const event = EVENTS["fun-bike"];
export const dynamic = "force-dynamic";
export async function generateMetadata(): Promise<Metadata> {
  const ops = await getPublicEventOps("fun-bike");
  const location = resolveEventLocation(event.location as EventLocation, ops.settings);
  return eventMetadata(withOperationalEventSeo(seo, ops.eventDate, location.label));
}

const navLinks = [
  { label: "Beranda", href: "#hero" },
  { label: "Paket", href: "#package" },
  { label: "Rute", href: "#route" },
  { label: "Rundown", href: "#timeline" },
  { label: "Jersey", href: "#jersey" },
  { label: "FAQ", href: "#faq" },
];

function formatCurrency(amount: number | null) {
  if (!hasAnnouncedValue(amount)) return null;
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(amount as number);
}

function formatPrizeAmount(value: string | undefined) {
  const trimmed = value?.trim();
  if (!trimmed) return "Diumumkan saat technical meeting";
  const numeric = Number(trimmed.replace(/[^\d]/g, ""));
  if (!Number.isFinite(numeric) || numeric <= 0) return trimmed;
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(numeric);
}

function googleMapsUrl(location: EventLocation) {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${location.lat},${location.lng}`)}`;
}

function whatsappUrl(phone: string) {
  const number = phone.replace(/\D/g, "");
  return number ? `https://wa.me/${number}` : null;
}

export default async function FunBikePage() {
  const ops = await getPublicEventOps("fun-bike");
  const priceLabel = formatCurrency(ops.price);
  const location = resolveEventLocation(event.location as EventLocation, ops.settings);
  const locationLabel = location.label || "Alun-Alun Purworejo";
  const locationAddress = ops.settings.event_location_address?.trim() || "Alun-Alun Purworejo, Purworejo, Jawa Tengah";
  const routeNote = ops.settings.bike_route_note?.trim() || "Rute masih dalam tahap survei dan belum final.";
  const contactPhone = ops.settings.contact_person_whatsapp?.trim() || ops.contactPerson || ops.settings.contact_person || DEFAULT_WHATSAPP;
  const contactHref = contactPhone ? whatsappUrl(contactPhone) : null;
  const prizeAmount = formatPrizeAmount(ops.settings.bike_prize_amount);
  const operationalSeo = withOperationalEventSeo(seo, ops.eventDate, locationLabel);

  return (
    <EventThemeProvider eventType="fun-bike">
      <main className="page-animate min-h-screen bg-[#FFF8F0]">
        <ScrollProgressBar color="#FF6B2C" />
        <EventNavbar
          brand={{ title: event.name, subtitle: FEST_YEAR, href: "/" }}
          navLinks={navLinks}
          registerPath="/fun-bike/daftar"
          registerLabel="DAFTAR"
          theme="light"
          accentColor="#FF6B2C"
        />

        <section id="hero" className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden">
          <div className="absolute inset-0 bg-[linear-gradient(180deg,#FFF7ED_0%,#FFFBEB_36%,#E0F2FE_72%,#FFFFFF_100%)]" />
          <div className="absolute inset-x-0 top-0 h-2 bg-gradient-to-r from-[#FF6B2C] via-[#F59E0B] to-[#38BDF8]" />
          <div className="absolute left-1/2 top-20 h-52 w-52 -translate-x-1/2 rounded-full bg-[#F59E0B]/25 blur-3xl" />

          <div className="relative z-10 mx-auto w-full max-w-7xl px-4 pb-16 pt-28 text-center sm:px-6 lg:px-8">
            <div className="mb-5 inline-block fade-in-up rounded-full bg-gradient-to-r from-[#FF6B2C] via-[#F59E0B] to-[#38BDF8] p-[2px] shadow-lg shadow-[#FF6B2C]/20">
              <div className="rounded-full bg-[#FFF8F0] px-5 py-2 text-xs font-black tracking-[0.25em]" style={{ fontFamily: "Orbitron, sans-serif" }}>
                <span className="bg-gradient-to-r from-[#FF6B2C] to-[#0284C7] bg-clip-text text-transparent">{FEST_FULL_NAME} PRESENTS</span>
              </div>
            </div>
            <h1 className="fade-in-up-delay-1 mb-4" style={{ fontFamily: "Orbitron, sans-serif", fontSize: "clamp(2.5rem, 7vw, 5rem)", fontWeight: 900, lineHeight: 1.1 }}>
              <span className="bg-gradient-to-r from-[#FF6B2C] via-[#F59E0B] to-[#38BDF8] bg-clip-text text-transparent">
                {event.name}
              </span>
              <br />
              <span className="text-gray-900">{FEST_YEAR}</span>
            </h1>
            <p className="fade-in-up-delay-2 mb-4 text-sm font-semibold tracking-[4px] text-[#FF6B2C] sm:text-base" style={{ fontFamily: "Rajdhani, sans-serif" }}>
              RIDE PAGI . SUNRISE CERAH . FUN RIDE
            </p>
            <p className="mx-auto mb-6 max-w-2xl text-base leading-relaxed text-gray-600 sm:text-lg">
              Ride pagi bertema sunrise, satu paket Fun Ride. Koordinasi bersama PLF & ICF.
            </p>

            <div className="fade-in-up-delay-2 mb-8 flex flex-wrap justify-center gap-3 text-sm text-gray-700">
              <span className="inline-flex min-h-10 items-center gap-1.5 rounded-full border border-orange-200 bg-white/75 px-3 font-semibold shadow-sm"><MapPin size={14} className="text-[#FF6B2C]" />{locationLabel} (start & finish)</span>
              <span className="inline-flex min-h-10 items-center gap-1.5 rounded-full border border-orange-200 bg-white/75 px-3 font-semibold shadow-sm"><Calendar size={14} className="text-[#FF6B2C]" />{formatEventDate(ops.eventDate)} - Mulai {formatWibTime(ops.eventDate)} WIB</span>
              <span className="inline-flex min-h-10 items-center gap-1.5 rounded-full border border-sky-200 bg-white/75 px-3 font-semibold shadow-sm"><Bike size={14} className="text-[#FF6B2C]" />Fun Ride</span>
            </div>

            <div className="fade-in-up-delay-3 mb-10 flex flex-col justify-center gap-3 sm:flex-row">
              <Link href="/fun-bike/daftar" className="btn-sunrise relative flex cursor-pointer items-center justify-center gap-2 overflow-hidden rounded-full px-8 py-4 text-sm font-bold">
                <span className="shine-sweep" />
                <Bike size={16} /> DAFTAR <ArrowRight size={16} />
              </Link>
              <Link href="/fun-bike/cek" className="btn-outline-sunrise flex cursor-pointer items-center justify-center gap-2 rounded-full px-8 py-4 text-sm font-semibold">
                Cek Registrasi
              </Link>
            </div>

            <div className="fade-in-up-delay-4">
              <p className="mb-3 text-xs tracking-widest text-gray-500" style={{ fontFamily: "Orbitron, sans-serif" }}>HITUNG MUNDUR START PAGI</p>
              <Suspense fallback={null}><FunBikeCountdown targetIso={ops.eventDate} /></Suspense>
            </div>
          </div>
        </section>

        <section id="package" className="overflow-hidden bg-white pb-12 pt-10 sm:py-20">
          <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
            <SectionHeading
              eyebrow="Paket"
              title="FUN RIDE"
              subtitle="Satu paket final, tanpa pilihan jarak atau kategori ganda."
              accentColor="#C2410C"
              accentColor2="#0284C7"
              lightSurface
              titleFontFamily="Orbitron, sans-serif"
              titleClass="text-5xl sm:text-6xl lg:text-7xl"
              disableGradient={false}
              className="mb-10 sm:mb-14"
            />

            <div className="card-animated relative mx-auto max-w-2xl">
              <div className="absolute -inset-1 rounded-3xl bg-gradient-to-r from-[#FF6B2C] via-[#F59E0B] to-[#38BDF8] opacity-30 blur-xl" />
              <HoverTiltCard maxTilt={5} glareColor="#FF6B2C">
                <div className="relative overflow-hidden rounded-3xl border border-[#FF6B2C]/20 bg-white shadow-xl">
                  <div className="h-1.5 w-full bg-gradient-to-r from-[#FF6B2C] via-[#F59E0B] to-[#38BDF8]" />
                  <div className="p-8 sm:p-12">
                    <div className="mb-8 flex flex-col gap-6 sm:flex-row sm:items-center">
                      <div className="flex h-20 w-20 flex-shrink-0 items-center justify-center rounded-2xl border border-[#FF6B2C]/20 bg-[#FF6B2C]/10">
                        <Bike size={34} className="text-[#FF6B2C]" />
                      </div>
                      <div>
                        <div className="mb-1 text-sm tracking-widest text-gray-400" style={{ fontFamily: "Rajdhani, sans-serif" }}>{event.name} {FEST_YEAR}</div>
                        <h3 className="text-4xl font-black text-gray-900 sm:text-5xl" style={{ fontFamily: "Orbitron, sans-serif" }}>FUN RIDE</h3>
                        <p className="text-sm text-gray-500">Paket ride pagi bertema sunrise.</p>
                      </div>
                    </div>

                    <div className="mb-6 rounded-2xl border border-[#FF6B2C]/10 bg-gradient-to-br from-[#FFF7ED] to-[#EFF6FF] p-6 text-center">
                      <div className="mb-1 text-sm tracking-widest text-gray-500">HTM</div>
                      {priceLabel ? (
                        <div className="text-4xl font-black text-[#FF6B2C] sm:text-5xl" style={{ fontFamily: "Orbitron, sans-serif" }}>{priceLabel}</div>
                      ) : (
                        <div className="text-lg font-black text-[#FF6B2C]" style={{ fontFamily: "Orbitron, sans-serif" }}>Mengikuti pengaturan panitia</div>
                      )}
                    </div>

                    <div className="mb-8 rounded-xl border border-[#38BDF8]/20 bg-[#EFF6FF]/55 p-4">
                      <QuotaMeter category={ops.categoryCode ?? event.categoryCode} fallbackTotal={ops.quota ?? 0} eventType="fun-bike" />
                    </div>

                    <div className="mb-8 grid gap-3 sm:grid-cols-2">
                      {event.benefit.map((item) => (
                        <div key={item} className="flex items-center gap-3 rounded-xl border border-gray-100 bg-gray-50 p-3">
                          <AnimatedIcon color="#7BC142" size={16} animate={item.toLowerCase().includes("jersey") ? "sway" : item.toLowerCase().includes("door") ? "bounce" : "pulse"}>
                            <CheckCircle size={16} />
                          </AnimatedIcon>
                          <span className="text-sm text-gray-600">{item}</span>
                        </div>
                      ))}
                    </div>

                    <Link href="/fun-bike/daftar" className="flex w-full items-center justify-center gap-3 rounded-2xl bg-gradient-to-r from-[#FF6B2C] to-[#F59E0B] py-4 text-base font-black text-white transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl" style={{ fontFamily: "Orbitron, sans-serif", letterSpacing: "2px" }}>
                      <Bike size={20} /> DAFTAR SEKARANG <ArrowRight size={20} />
                    </Link>
                  </div>
                </div>
              </HoverTiltCard>
            </div>
          </div>
        </section>

        <section id="route" className="overflow-hidden bg-[linear-gradient(180deg,#EFF6FF_0%,#FFF7ED_100%)] py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mb-12 text-center">
              <div className="badge-sunrise mb-4 inline-block">LOKASI & RUTE</div>
              <h2 className="mb-4 text-4xl font-black text-gray-900" style={{ fontFamily: "Orbitron, sans-serif" }}>START, FINISH, DAN RUTE FUN RIDE</h2>
              <p className="mx-auto max-w-2xl text-sm leading-6 text-gray-600">
                Lokasi start dan finish memakai titik Alun-Alun Purworejo. Rute Fun Bike masih dalam tahap survei dan belum final.
              </p>
            </div>

            <div className="rounded-3xl border border-orange-100 bg-white p-4 shadow-xl sm:p-6">
              <div className="mb-5 flex flex-col gap-2 border-b border-gray-100 pb-4 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <p className="text-xs font-black uppercase tracking-[0.18em] text-[#FF6B2C]">LOKASI & RUTE</p>
                  <h3 className="mt-1 text-2xl font-black text-gray-900" style={{ fontFamily: "Orbitron, sans-serif" }}>{locationLabel}</h3>
                </div>
                <p className="text-sm font-semibold text-gray-500">Start & finish Fun Ride</p>
              </div>

              <div className="grid gap-6 lg:grid-cols-2">
                <LocationMap {...location} label={locationLabel} theme="bike" />
                <RouteMapImage theme="bike" />
              </div>

              <div className="mt-6 grid gap-4 lg:grid-cols-[0.9fr_1.1fr]">
                <article className="rounded-2xl border border-orange-100 bg-[#FFF7ED] p-5">
                  <MapPin size={22} className="mb-3 text-[#FF6B2C]" />
                  <p className="text-xs font-black uppercase tracking-[0.18em] text-gray-500">Titik Kumpul</p>
                  <h4 className="mt-2 text-xl font-black text-gray-900" style={{ fontFamily: "Orbitron, sans-serif" }}>{locationLabel}</h4>
                  <p className="mt-2 text-sm leading-6 text-gray-600">{locationAddress}</p>
                  <a
                    href={googleMapsUrl(location)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-4 inline-flex min-h-11 items-center gap-2 rounded-full bg-[#FF6B2C] px-5 text-sm font-black text-white shadow-lg transition hover:-translate-y-0.5 hover:shadow-xl"
                  >
                    <ExternalLink size={16} /> Buka di Google Maps
                  </a>
                </article>
                <article className="rounded-2xl border border-sky-100 bg-[#EFF6FF] p-5">
                  <Navigation size={22} className="mb-3 text-[#0284C7]" />
                  <p className="text-xs font-black uppercase tracking-[0.18em] text-gray-500">Catatan Rute</p>
                  <p className="mt-2 text-sm font-semibold leading-6 text-gray-800">
                    {routeNote}
                  </p>
                  <p className="mt-3 text-xs leading-5 text-gray-500">Checkpoint, jarak tempuh, dan arahan teknis akan diumumkan setelah survei rute panitia selesai.</p>
                </article>
              </div>
            </div>
            <div className="mt-6 rounded-3xl border border-amber-100 bg-gradient-to-br from-[#FFFBEB] to-white p-6">
              <AnimatedIcon color="#B45309" animate="bounce" className="mb-4">
                <Trophy size={24} />
              </AnimatedIcon>
              <h2 className="mb-3 text-3xl font-black text-gray-900" style={{ fontFamily: "Orbitron, sans-serif" }}>HADIAH & APRESIASI</h2>
              <p className="text-sm font-semibold leading-6 text-gray-800">
                Uang pembinaan + piala penghargaan + doorprize utama. Futuristic Bike adalah Fun Ride, bukan lomba waktu.
              </p>
              <div className="mt-4 rounded-2xl border border-amber-200 bg-white/80 p-4">
                <p className="text-xs font-black uppercase tracking-[0.18em] text-gray-500">Nominal uang pembinaan</p>
                <p className="mt-1 text-xl font-black text-[#B45309]" style={{ fontFamily: "Orbitron, sans-serif" }}>{prizeAmount}</p>
              </div>
            </div>
          </div>
        </section>

        <section id="timeline" className="overflow-hidden bg-white py-14 sm:py-20">
          <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
            <div className="mb-10 text-center sm:mb-14">
              <div className="badge-sunrise mb-4 inline-block">DETAIL ACARA</div>
              <h2 className="mb-4 text-4xl font-black text-gray-950" style={{ fontFamily: "Rajdhani, sans-serif" }}>SUSUNAN ACARA</h2>
              <div className="mx-auto mb-5 flex max-w-2xl flex-wrap justify-center gap-2 text-sm">
                <span className="inline-flex min-h-9 items-center gap-2 rounded-full border border-orange-200 bg-orange-50 px-3 font-semibold text-gray-700">
                  <Calendar size={15} className="text-[#C2410C]" />
                  {formatEventDate(ops.eventDate)}
                </span>
                <span className="inline-flex min-h-9 items-center gap-2 rounded-full border border-sky-200 bg-sky-50 px-3 font-semibold text-gray-700">
                  <Clock size={15} className="text-[#0369A1]" /> {event.eventTime}
                </span>
              </div>
              <p className="mx-auto max-w-3xl text-sm leading-7 text-gray-600 sm:text-base">
                {event.deskripsiPelaksanaan}
              </p>
              <div className="mx-auto mt-5 h-1 w-24 rounded-full bg-gradient-to-r from-[#C2410C] via-[#F59E0B] to-[#0284C7]" />
            </div>

            <RundownTimeline items={event.rundown} theme="bike" eventDate={ops.eventDate} />

            <RundownActions
              items={event.rundown}
              eventName={event.name}
              eventDate={ops.eventDate}
              theme="bike"
            />

            <div className="mt-12 sm:mt-16">
              <div className="mb-8 text-center">
                <div className="badge-sunrise mb-4 inline-block">INFO PENTING</div>
                <h3 className="text-3xl font-black text-gray-950 sm:text-4xl" style={{ fontFamily: "Orbitron, sans-serif" }}>
                  INFO PELAKSANAAN
                </h3>
              </div>
              <div className="grid gap-5 sm:grid-cols-2">
                {[
                  { icon: Music, label: "Hiburan", value: "Band SUNFLOW & Ollsame", color: "#0ea5e9", bg: "from-sky-50 to-white", border: "border-sky-200" },
                  { icon: Gift, label: "Doorprize", value: "Doorprize pembelian panitia + dukungan sponsor, diundi saat acara", color: "#f97316", bg: "from-orange-50 to-white", border: "border-orange-200" },
                  { icon: Trophy, label: "Apresiasi", value: `Uang pembinaan: ${prizeAmount}`, color: "#eab308", bg: "from-yellow-50 to-white", border: "border-yellow-200" },
                  { icon: ShieldCheck, label: "Koordinasi", value: "Pelaksanaan dikoordinasikan bersama PLF & ICF", color: "#84cc16", bg: "from-lime-50 to-white", border: "border-lime-200" },
                ].map(({ icon: Icon, label, value, color, bg, border }) => (
                  <article key={label} className={`card-animated relative overflow-hidden rounded-3xl border-2 ${border} bg-gradient-to-br ${bg} p-6 shadow-lg transition-all hover:-translate-y-1 hover:shadow-xl group`}>
                    <div className="absolute -right-6 -top-6 h-24 w-24 rounded-full opacity-10 transition-transform duration-500 group-hover:scale-150" style={{ backgroundColor: color }} />
                    <div className="relative z-10 flex items-start gap-5">
                      <div className="flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-2xl bg-white shadow-sm ring-1 ring-black/5">
                        <AnimatedIcon color={color} size={26} animate="sway">
                          <Icon size={26} />
                        </AnimatedIcon>
                      </div>
                      <div>
                        <p className="mb-1 text-xs font-black uppercase tracking-[0.2em]" style={{ color }}>{label}</p>
                        <p className="text-sm font-bold leading-relaxed text-gray-800 sm:text-base">{value}</p>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section id="jersey" className="overflow-hidden bg-[linear-gradient(180deg,#FFF7ED_0%,#FFFFFF_100%)] pb-6 pt-12 sm:py-20">
          <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
            <div className="mb-12 text-center">
              <div className="badge-sunrise mb-4 inline-block">JERSEY & RACEPACK</div>
              <h2 className="mb-4 text-4xl font-black text-gray-900" style={{ fontFamily: "Orbitron, sans-serif" }}>JERSEY FUN BIKE SUDAH FIKS</h2>
              <p className="mx-auto max-w-2xl text-sm leading-6 text-gray-500">
                Paket peserta berisi jersey Fun Bike, racepack/goodie, dan kebutuhan ride pagi sesuai ketentuan panitia.
              </p>
            </div>
            <div className="grid gap-6 lg:grid-cols-3">
              {[
                { icon: Shirt, title: "Jersey Fun Bike", items: ["Desain sudah fiks", "Tema sunrise cerah", "Dipilih ukurannya saat daftar"] },
                { icon: Package, title: "Racepack / Goodie", items: event.racepack },
                { icon: Ticket, title: "Benefit", items: event.benefit },
              ].map(({ icon: Icon, title, items }) => (
                <div key={title} className="card-animated rounded-3xl border-2 border-orange-200 bg-white p-7 shadow-md hover:shadow-lg transition-all relative overflow-hidden group">
                  <div className="absolute top-0 right-0 -mr-6 -mt-6 w-32 h-32 rounded-full bg-orange-50 opacity-50 group-hover:scale-150 transition-transform duration-500" />
                  <div className="relative z-10">
                    <AnimatedIcon color="#FF6B2C" animate={title.includes("Jersey") ? "sway" : title.includes("Racepack") ? "bounce" : "pulse"} className="mb-5">
                      <Icon size={28} />
                    </AnimatedIcon>
                    <h3 className="mb-5 text-xl font-black text-gray-900" style={{ fontFamily: "Orbitron, sans-serif" }}>{title}</h3>
                    <ul className="space-y-4">
                      {items.map((item) => (
                        <li key={item} className="flex items-start gap-3 text-sm font-medium text-gray-700">
                          <CheckCircle size={18} className="flex-shrink-0 mt-0.5 text-[#FF6B2C]" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="overflow-hidden bg-white pb-5 pt-4 sm:py-20">
          <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
            <div className="grid gap-6 lg:grid-cols-2">
              <div className="rounded-3xl border-2 border-orange-200 bg-gradient-to-br from-[#FFF7ED] to-white p-6 shadow-md">
                <AnimatedIcon color="#FF6B2C" animate="bounce" className="mb-4">
                  <Gift size={24} />
                </AnimatedIcon>
                <h2 className="mb-4 text-3xl font-black text-gray-900" style={{ fontFamily: "Orbitron, sans-serif" }}>DOORPRIZE</h2>
                <div className="grid gap-3 sm:grid-cols-2">
                  {event.doorprize.map((item) => (
                    <div key={item} className="shimmer-showcase rounded-xl border border-orange-100 bg-white/75 p-4 text-sm font-semibold text-gray-700 shadow-sm">{item}</div>
                  ))}
                </div>
              </div>
              <div className="rounded-3xl border-2 border-sky-200 bg-gradient-to-br from-[#EFF6FF] to-white p-6 shadow-md">
                <AnimatedIcon color="#38BDF8" animate="sway" className="mb-4">
                  <Music size={24} />
                </AnimatedIcon>
                <h2 className="mb-4 text-3xl font-black text-gray-900" style={{ fontFamily: "Orbitron, sans-serif" }}>HIBURAN</h2>
                <div className="grid gap-3 sm:grid-cols-2">
                  {event.hiburan.map((item) => (
                    <div key={item} className="rounded-xl border border-sky-100 bg-white/75 p-4 text-sm font-semibold text-gray-700 shadow-sm">
                      {item}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        <RulesSection settings={ops.settings} theme="bike" />

        <section id="faq" className="overflow-hidden bg-white pb-12 pt-5 sm:py-20">
          <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
            <div className="mb-14 text-center">
              <div className="badge-sunrise mb-4 inline-block">BANTUAN</div>
              <h2 className="mb-4 text-4xl font-black text-gray-900" style={{ fontFamily: "Orbitron, sans-serif" }}>FAQ</h2>
            </div>
            <Suspense fallback={null}><FunBikeFaq settings={ops.settings} fallbackItems={event.faq} /></Suspense>
            <div className="mt-10 text-center">
              <p className="mb-3 text-sm text-gray-500">Contact person</p>
              {contactHref ? (
                <a href={contactHref} target="_blank" rel="noopener noreferrer" className="btn-outline-sunrise inline-flex cursor-pointer items-center gap-2 rounded-full px-6 py-3 text-sm">
                  Chat WhatsApp
                </a>
              ) : (
                <a href={`mailto:${CONTACT_EMAIL}`} className="btn-outline-sunrise inline-flex cursor-pointer items-center gap-2 rounded-full px-6 py-3 text-sm">
                  Hubungi panitia PSTI Fest
                </a>
              )}
            </div>
          </div>
        </section>

        <section className="overflow-hidden bg-white py-12">
          <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
            <div className="mb-6 text-center">
              <div className="badge-sunrise mb-3 inline-block">DIDUKUNG OLEH</div>
              <h2 className="text-2xl font-black text-gray-900" style={{ fontFamily: "Orbitron, sans-serif" }}>SPONSOR & PARTNER</h2>
            </div>
            <MarqueeSponsors
              speed={34}
              items={["Himatekno UMPWR", FEST_NAME, "PLF", "ICF", "SUNFLOW", "Ollsame"].map((name) => (
                <div key={name} className="rounded-xl border border-gray-200 bg-white px-6 py-3 text-sm font-bold text-gray-500 shadow-sm" style={{ fontFamily: "Orbitron, sans-serif" }}>
                  {name}
                </div>
              ))}
            />
          </div>
        </section>

        <section className="overflow-hidden bg-gradient-to-r from-[#FF6B2C] via-[#F59E0B] to-[#38BDF8] py-20">
          <div className="mx-auto max-w-3xl px-4 text-center sm:px-6 lg:px-8">
            <Sun size={42} className="mx-auto mb-5 text-white" />
            <h2 className="mb-4 text-4xl font-black text-white sm:text-5xl" style={{ fontFamily: "Orbitron, sans-serif" }}>SIAP RIDE PAGI?</h2>
            <p className="mb-8 text-lg text-white/85">Ambil slot Fun Ride dan ikuti sunrise ride {FEST_NAME}.</p>
            <Link href="/fun-bike/daftar" className="inline-flex items-center gap-2 rounded-full bg-white px-10 py-4 text-base font-black text-[#FF6B2C] transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl" style={{ fontFamily: "Orbitron, sans-serif", letterSpacing: "2px" }}>
              <Bike size={20} /> DAFTAR SEKARANG <ArrowRight size={20} />
            </Link>
          </div>
        </section>

        <footer className="border-t border-gray-800 bg-gray-900">
          <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-3 text-center sm:text-left">
              <div>
                <h3 className="mb-2 text-sm font-bold text-white" style={{ fontFamily: "Orbitron, sans-serif" }}>{event.name} {FEST_YEAR}</h3>
                <p className="text-sm leading-relaxed text-gray-400">Event gowes sunrise {FEST_FULL_NAME} oleh {ORGANIZER_NAME}.</p>
              </div>
              <div>
                <h3 className="mb-2 text-sm font-bold text-white" style={{ fontFamily: "Orbitron, sans-serif" }}>EVENT LAIN</h3>
                <ul className="space-y-2 text-sm">
                  <li><Link href="/futuristic-run" className="text-gray-400 transition-colors hover:text-[#00E5FF]">Futuristic Run {FEST_YEAR}</Link></li>
                  <li><Link href="/" className="text-gray-400 transition-colors hover:text-white">{FEST_NAME} Hub</Link></li>
                </ul>
              </div>
              <div>
                <h3 className="mb-2 text-sm font-bold text-white" style={{ fontFamily: "Orbitron, sans-serif" }}>KONTAK</h3>
                <ul className="space-y-2 text-sm text-gray-400">
                  <li>{CONTACT_EMAIL}</li>
                  <li>{contactPhone ? "Chat WhatsApp" : "Hubungi panitia PSTI Fest"}</li>
                </ul>
              </div>
            </div>
            <div className="mt-8 border-t border-gray-800 pt-6 text-center">
              <p className="text-xs text-gray-500">&copy; {FEST_YEAR} <span className="text-[#FF6B2C]">{FEST_NAME}</span>. All rights reserved.</p>
            </div>
          </div>
        </footer>
      </main>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(eventJsonLd(operationalSeo)) }}
      />
    </EventThemeProvider>
  );
}
