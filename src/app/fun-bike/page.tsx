import EventNavbar from "@/components/EventNavbar";
import EventThemeProvider from "@/components/EventThemeProvider";
import Link from "next/link";
import {
  ArrowRight,
  Bike,
  Calendar,
  CheckCircle,
  Gift,
  Map,
  MapPin,
  Music,
  Navigation,
  Package,
  ShieldCheck,
  Shirt,
  Sun,
  Ticket,
  Clock,
} from "lucide-react";
import type { Metadata } from "next";
import { Suspense } from "react";
import FunBikeCountdown from "./FunBikeCountdown";
import FunBikeFaq from "./FunBikeFaq";
import ScrollProgressBar from "@/components/ui/ScrollProgressBar";
import HoverTiltCard from "@/components/ui/HoverTiltCard";
import RundownTimeline from "@/components/ui/RundownTimeline";
import RundownActions from "@/components/ui/RundownActions";
import MarqueeSponsors from "@/components/ui/MarqueeSponsors";
import AnimatedIcon from "@/components/ui/AnimatedIcon";
import SectionHeading from "@/components/ui/SectionHeading";
import TbdBadge, { hasAnnouncedValue } from "@/components/ui/TbdBadge";
import QuotaMeter from "@/components/QuotaMeter";
import { CONTACT_EMAIL, FEST_FULL_NAME, FEST_NAME, FEST_YEAR, ORGANIZER_NAME } from "@/content/brand";
import { EVENTS } from "@/content/events";
import { getPublicEventOps } from "@/lib/eventOps";
import { EVENT_SEO, eventJsonLd, eventMetadata, withOperationalEventSeo } from "@/lib/seo";
import { formatEventDate, formatWibTime } from "@/lib/eventDate";

const seo = EVENT_SEO["fun-bike"];
const event = EVENTS["fun-bike"];
export const dynamic = "force-dynamic";
export async function generateMetadata(): Promise<Metadata> {
  const ops = await getPublicEventOps("fun-bike");
  return eventMetadata(withOperationalEventSeo(seo, ops.eventDate, ops.location));
}

const navLinks = [
  { label: "Beranda", href: "#hero" },
  { label: "Paket", href: "#package" },
  { label: "Rute", href: "#route" },
  { label: "Rundown", href: "#timeline" },
  { label: "Jersey", href: "#jersey" },
  { label: "FAQ", href: "#faq" },
  { label: "Daftar", href: "/fun-bike/daftar", isRoute: true },
];

function formatCurrency(amount: number | null) {
  if (!hasAnnouncedValue(amount)) return null;
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(amount as number);
}

function RoutePlaceholder() {
  return (
    <div className="overflow-hidden rounded-3xl border border-[#38BDF8]/30 bg-white shadow-xl">
      <div className="flex items-center justify-between gap-3 border-b border-gray-100 bg-gradient-to-r from-[#FFF7ED] via-[#FFFBEB] to-[#EFF6FF] p-4">
        <div className="flex items-center gap-2">
          <Map size={18} className="text-[#38BDF8]" />
          <span className="text-sm font-black text-gray-900" style={{ fontFamily: "Orbitron, sans-serif" }}>
            Komponen Rute
          </span>
        </div>
        <TbdBadge label="Rute sedang disurvei / diukur ulang" className="border-[#38BDF8]/30 bg-[#38BDF8]/10 text-gray-700" />
      </div>
      <div className="relative min-h-[320px] bg-[linear-gradient(135deg,#EFF6FF_0%,#FFFFFF_45%,#FFF7ED_100%)] p-5">
        <div
          className="absolute inset-0 opacity-40"
          style={{
            backgroundImage:
              "linear-gradient(rgba(56,189,248,0.4) 1px, transparent 1px), linear-gradient(90deg, rgba(251,146,60,0.28) 1px, transparent 1px)",
            backgroundSize: "36px 36px",
          }}
        />
        <div className="relative z-10 grid h-full min-h-[280px] place-items-center rounded-2xl border border-dashed border-[#38BDF8]/45 bg-white/70 p-6 text-center">
          <div>
            <Navigation size={42} className="mx-auto mb-4 text-[#38BDF8]" />
            <h3 className="mb-2 text-xl font-black text-gray-900" style={{ fontFamily: "Orbitron, sans-serif" }}>
              Siap Diisi Maps / Gambar / GPX
            </h3>
            <p className="mx-auto max-w-md text-sm leading-6 text-gray-500">
              Slot ini sengaja tidak menampilkan jarak atau lintasan palsu. Nanti bisa diisi Google Maps embed, gambar rute statis,
              atau hasil GPX setelah survei selesai.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default async function FunBikePage() {
  const ops = await getPublicEventOps("fun-bike");
  const priceLabel = formatCurrency(ops.price);
  const contact = ops.contactPerson ?? ops.settings.contact_person;
  const routeStatus = ops.settings.route_status || "Rute sedang disurvei / diukur ulang";
  const operationalSeo = withOperationalEventSeo(seo, ops.eventDate, ops.location);

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
            <div className="badge-sunrise mb-5 inline-block fade-in-up">{FEST_FULL_NAME} PRESENTS</div>
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
              Ride pagi bertema sunrise untuk satu paket Fun Ride. Panitia berkoordinasi dengan PLF dan ICF untuk rute,
              flow start, dan pengalaman gowes yang rapi.
            </p>

            <div className="fade-in-up-delay-2 mb-8 flex flex-wrap justify-center gap-4 text-sm text-gray-500">
              <span className="flex items-center gap-1.5"><MapPin size={14} className="text-[#FF6B2C]" />{ops.location ?? <TbdBadge className="border-[#FF6B2C]/20 bg-[#FF6B2C]/10 text-gray-700" />}</span>
              <span className="flex items-center gap-1.5"><Calendar size={14} className="text-[#FF6B2C]" />{formatEventDate(ops.eventDate)} • Mulai {formatWibTime(ops.eventDate)} WIB</span>
              <span className="flex items-center gap-1.5"><Bike size={14} className="text-[#FF6B2C]" />Fun Ride</span>
            </div>

            <div className="fade-in-up-delay-3 mb-10 flex flex-col justify-center gap-3 sm:flex-row">
              <Link href="/fun-bike/daftar" className="btn-sunrise relative flex cursor-pointer items-center justify-center gap-2 overflow-hidden rounded-full px-8 py-4 text-sm font-bold">
                <span className="shine-sweep" />
                <Bike size={16} /> DAFTAR <ArrowRight size={16} />
              </Link>
              <Link href="/cek" className="btn-outline-sunrise flex cursor-pointer items-center justify-center gap-2 rounded-full px-8 py-4 text-sm font-semibold">
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
              titleFontFamily="Rajdhani, sans-serif"
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
                        <TbdBadge className="border-[#FF6B2C]/30 bg-[#FF6B2C]/10 px-4 py-2 text-gray-700" />
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
              <div className="badge-sunrise mb-4 inline-block">RUTE & TITIK KUMPUL</div>
              <h2 className="mb-4 text-4xl font-black text-gray-900" style={{ fontFamily: "Orbitron, sans-serif" }}>RUTE SEDANG DIFINALKAN</h2>
              <TbdBadge label={routeStatus} className="border-[#38BDF8]/30 bg-[#38BDF8]/10 text-gray-700" />
            </div>
            <div className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
              <RoutePlaceholder />
              <div className="space-y-4">
                {[
                  { icon: MapPin, label: "Titik kumpul", value: ops.location },
                  { icon: ShieldCheck, label: "Status rute", value: routeStatus },
                  { icon: Navigation, label: "Format siap isi", value: "Google Maps embed / gambar rute / GPX" },
                ].map(({ icon: Icon, label, value }) => (
                  <div key={label} className="card-animated rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
                    <Icon size={20} className="mb-3 text-[#FF6B2C]" />
                    <p className="text-xs font-black uppercase tracking-[0.18em] text-gray-400">{label}</p>
                    <div className="mt-2 text-sm font-semibold text-gray-800">{value || <TbdBadge className="border-[#FF6B2C]/20 bg-[#FF6B2C]/10 text-gray-700" />}</div>
                  </div>
                ))}
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
              <h3 className="mb-5 text-center text-2xl font-black text-gray-950" style={{ fontFamily: "Rajdhani, sans-serif" }}>
                INFO PELAKSANAAN
              </h3>
              <div className="grid gap-4 sm:grid-cols-2">
                {[
                  { icon: Music, label: "Hiburan", value: "Band SUNFLOW & Ollsame", color: "#0369A1" },
                  { icon: Gift, label: "Doorprize", value: "Hadiah pembelian panitia + dukungan sponsor", color: "#C2410C" },
                  { icon: Navigation, label: "Status rute", value: "Rute sedang disurvei dan diukur ulang", color: "#0284C7" },
                  { icon: ShieldCheck, label: "Koordinasi", value: "Pelaksanaan dikoordinasikan bersama PLF & ICF", color: "#B45309" },
                ].map(({ icon: Icon, label, value, color }) => (
                  <article key={label} className="card-animated rounded-2xl border border-gray-100 bg-gradient-to-br from-white to-gray-50 p-5 shadow-sm">
                    <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl border" style={{ borderColor: `${color}33`, background: `${color}0F` }}>
                      <Icon size={18} style={{ color }} />
                    </div>
                    <p className="text-xs font-black uppercase tracking-[0.14em] text-gray-500">{label}</p>
                    <p className="mt-2 text-sm font-semibold leading-6 text-gray-900">{value}</p>
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
            <div className="grid gap-5 lg:grid-cols-3">
              {[
                { icon: Shirt, title: "Jersey Fun Bike", items: ["Desain sudah fiks", "Tema sunrise cerah", "Dipilih ukurannya saat daftar"] },
                { icon: Package, title: "Racepack / Goodie", items: event.racepack },
                { icon: Ticket, title: "Benefit", items: event.benefit },
              ].map(({ icon: Icon, title, items }) => (
                <div key={title} className="card-animated rounded-3xl border border-gray-100 bg-white p-6 shadow-sm">
                  <AnimatedIcon color="#FF6B2C" animate={title.includes("Jersey") ? "sway" : title.includes("Racepack") ? "bounce" : "pulse"} className="mb-4">
                    <Icon size={24} />
                  </AnimatedIcon>
                  <h3 className="mb-4 text-lg font-black text-gray-900" style={{ fontFamily: "Orbitron, sans-serif" }}>{title}</h3>
                  <ul className="space-y-3">
                    {items.map((item) => (
                      <li key={item} className="flex items-start gap-2 text-sm text-gray-600">
                        <CheckCircle size={15} className="mt-0.5 flex-shrink-0 text-[#7BC142]" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="overflow-hidden bg-white pb-5 pt-4 sm:py-20">
          <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
            <div className="grid gap-6 lg:grid-cols-2">
              <div className="rounded-3xl border border-gray-100 bg-gradient-to-br from-[#FFF7ED] to-white p-6">
                <AnimatedIcon color="#FF6B2C" animate="bounce" className="mb-4">
                  <Gift size={24} />
                </AnimatedIcon>
                <h2 className="mb-4 text-3xl font-black text-gray-900" style={{ fontFamily: "Orbitron, sans-serif" }}>DOORPRIZE</h2>
                <div className="grid gap-3 sm:grid-cols-2">
                  {event.doorprize.map((item) => (
                    <div key={item} className="shimmer-showcase rounded-xl border border-white bg-white/75 p-4 text-sm font-semibold text-gray-700 shadow-sm">{item}</div>
                  ))}
                </div>
              </div>
              <div className="rounded-3xl border border-gray-100 bg-gradient-to-br from-[#EFF6FF] to-white p-6">
                <AnimatedIcon color="#38BDF8" animate="sway" className="mb-4">
                  <Music size={24} />
                </AnimatedIcon>
                <h2 className="mb-4 text-3xl font-black text-gray-900" style={{ fontFamily: "Orbitron, sans-serif" }}>HIBURAN</h2>
                <div className="grid gap-3 sm:grid-cols-2">
                  {event.hiburan.map((item) => (
                    <div key={item} className="rounded-xl border border-white bg-white/75 p-4 text-sm font-semibold text-gray-700 shadow-sm">
                      {item}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="faq" className="overflow-hidden bg-white pb-12 pt-5 sm:py-20">
          <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
            <div className="mb-14 text-center">
              <div className="badge-sunrise mb-4 inline-block">BANTUAN</div>
              <h2 className="mb-4 text-4xl font-black text-gray-900" style={{ fontFamily: "Orbitron, sans-serif" }}>FAQ</h2>
            </div>
            <Suspense fallback={null}><FunBikeFaq settings={ops.settings} /></Suspense>
            <div className="mt-10 text-center">
              <p className="mb-3 text-sm text-gray-500">Contact person</p>
              {contact ? (
                <a href={`https://wa.me/${contact.replace(/\D/g, "")}`} target="_blank" rel="noopener noreferrer" className="btn-outline-sunrise inline-flex cursor-pointer items-center gap-2 rounded-full px-6 py-3 text-sm">
                  Hubungi Panitia
                </a>
              ) : (
                <TbdBadge className="border-[#FF6B2C]/20 bg-[#FF6B2C]/10 text-gray-700" />
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
                  <li>{contact ?? <TbdBadge />}</li>
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
