import EventNavbar from "@/components/EventNavbar";
import EventThemeProvider from "@/components/EventThemeProvider";
import Link from "next/link";
import { Bike, MapPin, Calendar, ChevronDown, Clock, Gift, Trophy, Shirt, Medal, Camera, Music, Coffee, Shield, ArrowRight, CheckCircle } from "lucide-react";
import type { Metadata } from "next";
import { Suspense } from "react";
import FunBikeCountdown from "./FunBikeCountdown";
import FunBikeFaq from "./FunBikeFaq";
import ScrollProgressBar from "@/components/ui/ScrollProgressBar";
import AnimatedIcon from "@/components/ui/AnimatedIcon";
import HoverTiltCard from "@/components/ui/HoverTiltCard";
import { EVENT_SEO, eventMetadata, eventJsonLd } from "@/lib/seo";

const seo = EVENT_SEO["fun-bike"];
export const metadata: Metadata = eventMetadata(seo);

const navLinks = [
  { label: "Beranda", href: "#hero" },
  { label: "Tentang", href: "#about" },
  { label: "Paket", href: "#package" },
  { label: "Rute", href: "#route" },
  { label: "Jadwal", href: "#timeline" },
  { label: "FAQ", href: "#faq" },
  { label: "Daftar", href: "/fun-bike/daftar", isRoute: true },
];

export default function FunBikePage() {
  return (
    <EventThemeProvider eventType="fun-bike">
      <main className="page-animate min-h-screen" style={{ background: "linear-gradient(180deg, #FFF8F0 0%, #FFFFFF 30%, #F0FDF4 60%, #FFF8F0 100%)" }}>
        <ScrollProgressBar color="#FF6B2C" />
        <EventNavbar
          brand={{ title: "FUN BIKE", subtitle: "2026", href: "/" }}
          navLinks={navLinks}
          registerPath="/fun-bike/daftar"
          registerLabel="DAFTAR SEKARANG"
          theme="light"
          accentColor="#FF6B2C"
        />

        {/* ======== HERO ======== */}
        <section id="hero" className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden">
          <div className="absolute inset-0" style={{ background: "linear-gradient(180deg, #FF7F2A22 0%, #84CC1622 40%, #38BDF822 70%, #FFF8F0 100%)" }} />
          <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-[#FF6B2C] via-[#F59E0B] to-[#7BC142]" />

          {/* Decorative orbs */}
          <div className="absolute top-1/4 right-1/4 w-[300px] h-[300px] rounded-full blur-3xl opacity-20 bg-[#FF6B2C]" />
          <div className="absolute bottom-1/3 left-1/4 w-[250px] h-[250px] rounded-full blur-3xl opacity-15 bg-[#7BC142]" />

          <div className="relative z-20 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-16 text-center">
            <div className="badge-sunrise inline-block mb-5 fade-in-up">PSTI FEST 2026 PRESENTS</div>

            <h1 className="fade-in-up-delay-1 mb-4" style={{ fontFamily: "Orbitron, sans-serif", fontSize: "clamp(2.5rem, 7vw, 5rem)", fontWeight: 900, lineHeight: 1.1 }}>
              <span style={{ background: "linear-gradient(135deg, #FF6B2C 0%, #F59E0B 50%, #7BC142 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
                FUN BIKE
              </span>
              <br />
              <span className="text-gray-900">2026</span>
            </h1>

            <p className="fade-in-up-delay-2 text-[#FF6B2C] font-semibold tracking-[4px] mb-4 text-sm sm:text-base" style={{ fontFamily: "Rajdhani, sans-serif" }}>
              RIDE THE SUNRISE . FEEL THE JOY
            </p>

            <p className="fade-in-up-delay-2 max-w-2xl mx-auto text-gray-600 text-base sm:text-lg leading-relaxed mb-6">
              Gowes santai menyambut matahari terbit dengan rute indah Purworejo.
              Satu paket seru untuk semua level pesepeda — dari pemula sampai pro!
            </p>

            <div className="fade-in-up-delay-2 flex flex-wrap justify-center gap-4 text-gray-500 text-sm mb-8">
              <span className="flex items-center gap-1.5"><MapPin size={14} className="text-[#FF6B2C]" /> Purworejo, Jawa Tengah</span>
              <span className="flex items-center gap-1.5"><Calendar size={14} className="text-[#FF6B2C]" /> 22 Juni 2026</span>
              <span className="flex items-center gap-1.5"><Bike size={14} className="text-[#FF6B2C]" /> Fun Ride</span>
            </div>

            <div className="fade-in-up-delay-3 flex flex-col sm:flex-row gap-3 justify-center mb-10">
              <Link href="/fun-bike/daftar" className="relative overflow-hidden btn-sunrise flex items-center justify-center gap-2 px-8 py-4 rounded-full text-sm font-bold cursor-pointer">
                <span className="shine-sweep" />
                <Bike size={16} /> DAFTAR SEKARANG <ArrowRight size={16} />
              </Link>
              <a href="#about" className="btn-outline-sunrise flex items-center justify-center gap-2 px-8 py-4 rounded-full text-sm font-semibold cursor-pointer">
                Lihat Informasi
              </a>
            </div>

            <div className="fade-in-up-delay-4">
              <p className="text-gray-500 text-xs tracking-widest mb-3" style={{ fontFamily: "Orbitron, sans-serif" }}>HITUNG MUNDUR MENUJU HARI H</p>
              <Suspense fallback={null}><FunBikeCountdown /></Suspense>
            </div>
          </div>

          <a href="#about" className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-1 text-gray-400 hover:text-[#FF6B2C] transition-colors">
            <span className="text-xs tracking-widest" style={{ fontFamily: "Orbitron, sans-serif" }}>SCROLL</span>
            <ChevronDown size={20} className="animate-bounce" />
          </a>
        </section>

        {/* ======== STATS ======== */}
        <section className="py-12 bg-white">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 stagger-list">
              {[
                { value: "300", label: "Kuota Peserta", color: "#FF6B2C" },
                { value: "15K", label: "Jarak Rute", color: "#7BC142" },
                { value: "6+", label: "Titik Kumpul", color: "#38BDF8" },
                { value: "2026", label: "Tahun Event", color: "#F59E0B" },
              ].map((stat) => (
                <div key={stat.label} className="card-animated glass-card-light p-6 rounded-2xl text-center">
                  <div className="text-3xl font-black mb-1" style={{ fontFamily: "Orbitron, sans-serif", color: stat.color }}>{stat.value}</div>
                  <div className="text-gray-600 text-xs">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ======== ABOUT ======== */}
        <section id="about" className="py-20 overflow-hidden">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-14">
              <div className="badge-sunrise inline-block mb-4">TENTANG EVENT</div>
              <h2 className="text-4xl sm:text-5xl font-black text-gray-900 mb-4" style={{ fontFamily: "Orbitron, sans-serif" }}>
                TENTANG FUN BIKE
              </h2>
              <div className="w-24 h-1 mx-auto rounded-full bg-gradient-to-r from-[#FF6B2C] to-[#7BC142]" />
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div className="slide-in-left">
                <p className="text-gray-600 text-lg leading-relaxed mb-6">
                  <span className="text-gray-900 font-semibold">Fun Bike 2026</span> adalah event gowes santai bertema sunrise ride yang
                  diselenggarakan oleh <span className="text-[#FF6B2C] font-semibold">Himatekno UMPWR</span>. Bersepeda menyusuri rute indah
                  Purworejo saat matahari terbit — pengalaman yang menyegarkan dan tak terlupakan.
                </p>
                <p className="text-gray-500 leading-relaxed mb-8">
                  Terbuka untuk semua jenis sepeda dan semua level pesepeda. Tidak ada kompetisi — yang penting
                  kebersamaan, kesehatan, dan menikmati perjalanan!
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 stagger-list">
                  {[
                    { icon: Shirt, text: "Jersey cycling eksklusif" },
                    { icon: Medal, text: "Finisher medal" },
                    { icon: Coffee, text: "Snack & minuman di rest point" },
                    { icon: Gift, text: "Doorprize menarik" },
                    { icon: Camera, text: "Dokumentasi profesional" },
                    { icon: Music, text: "Hiburan di titik finish" },
                  ].map((b, i) => (
                    <div key={i} className="card-animated flex items-center gap-3 glass-card-light p-3 rounded-xl border border-gray-100 hover:border-[#FF6B2C]/30 transition-all duration-300 group">
                      <div className="w-8 h-8 rounded-lg bg-[#FF6B2C]/10 flex items-center justify-center flex-shrink-0 group-hover:bg-[#FF6B2C]/20 transition-all">
                        <b.icon size={16} className="text-[#FF6B2C]" />
                      </div>
                      <span className="text-sm text-gray-600 group-hover:text-gray-900 transition-colors">{b.text}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="stagger-list slide-in-right grid grid-cols-2 gap-4">
                {[
                  { value: "300", label: "Kuota Peserta", sub: "Fun Ride", color: "#FF6B2C" },
                  { value: "15K", label: "Jarak Rute", sub: "Satu rute", color: "#7BC142" },
                  { value: "5+", label: "Rest Point", sub: "Sepanjang rute", color: "#38BDF8" },
                  { value: "06:00", label: "Start Pagi", sub: "Sunrise ride", color: "#F59E0B" },
                ].map((stat) => (
                  <div key={stat.label} className="card-animated glass-card-light p-6 rounded-2xl text-center border border-gray-100 hover:shadow-lg transition-all duration-300">
                    <div className="text-3xl font-black mb-1" style={{ fontFamily: "Orbitron, sans-serif", color: stat.color }}>{stat.value}</div>
                    <div className="text-gray-800 font-semibold text-sm mb-0.5">{stat.label}</div>
                    <div className="text-gray-400 text-xs">{stat.sub}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ======== PACKAGE (Single Hero Card) ======== */}
        <section id="package" className="py-20 overflow-hidden" style={{ background: "linear-gradient(180deg, #FFF7ED 0%, #FFFFFF 100%)" }}>
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-14">
              <div className="badge-sunrise inline-block mb-4">PAKET LOMBA</div>
              <h2 className="text-4xl sm:text-5xl font-black text-gray-900 mb-4" style={{ fontFamily: "Orbitron, sans-serif" }}>SATU PAKET SERU</h2>
              <div className="w-24 h-1 mx-auto rounded-full bg-gradient-to-r from-[#FF6B2C] to-[#F59E0B]" />
              <p className="text-gray-500 text-sm mt-4">Satu paket lengkap, tanpa ribet — langsung gowes!</p>
            </div>

            <div className="card-animated relative max-w-2xl mx-auto">
              <div className="absolute -inset-1 rounded-3xl blur-xl opacity-30" style={{ background: "linear-gradient(135deg, #FF6B2C, #7BC142)" }} />
              <HoverTiltCard maxTilt={5} glareColor="#FF6B2C">
              <div className="relative bg-white rounded-3xl overflow-hidden border border-[#FF6B2C]/20 shadow-xl">
                <div className="h-1.5 w-full bg-gradient-to-r from-[#FF6B2C] via-[#F59E0B] to-[#7BC142]" />
                <div className="p-8 sm:p-12">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 mb-8">
                    <div className="w-20 h-20 rounded-2xl flex items-center justify-center text-4xl flex-shrink-0 bg-[#FF6B2C]/10 border border-[#FF6B2C]/20">
                      🚴
                    </div>
                    <div>
                      <div className="text-gray-400 text-sm mb-1 tracking-widest" style={{ fontFamily: "Rajdhani, sans-serif" }}>FUN BIKE 2026</div>
                      <h3 className="text-4xl sm:text-5xl font-black text-gray-900" style={{ fontFamily: "Orbitron, sans-serif" }}>FUN RIDE</h3>
                      <p className="text-gray-500 text-sm">Terbuka untuk semua usia dan jenis sepeda</p>
                    </div>
                  </div>

                  <div className="text-center mb-8 p-6 rounded-2xl bg-gradient-to-br from-[#FFF7ED] to-[#F0FDF4] border border-[#FF6B2C]/10">
                    <div className="text-gray-500 text-sm mb-1 tracking-widest">BIAYA PENDAFTARAN</div>
                    <div className="text-5xl font-black text-[#FF6B2C]" style={{ fontFamily: "Orbitron, sans-serif" }}>Rp 150.000</div>
                    <div className="text-gray-400 text-sm mt-1">per peserta</div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-8 stagger-list">
                    {[
                      { icon: "👕", label: "Jersey Cycling Eksklusif" },
                      { icon: "🥇", label: "Finisher Medal" },
                      { icon: "🎒", label: "Goodie Bag" },
                      { icon: "💧", label: "Water Station & Snack" },
                      { icon: "📸", label: "Dokumentasi Foto" },
                      { icon: "🎁", label: "Doorprize & Hiburan" },
                      { icon: "📜", label: "e-Sertifikat Peserta" },
                      { icon: "🏥", label: "Tim Medis Siaga" },
                    ].map((f) => (
                      <div key={f.label} className="card-animated flex items-center gap-3 p-3 rounded-xl bg-gray-50 border border-gray-100">
                        <span className="text-xl flex-shrink-0">{f.icon}</span>
                        <span className="text-gray-600 text-sm">{f.label}</span>
                      </div>
                    ))}
                  </div>

                  <Link href="/fun-bike/daftar" className="relative overflow-hidden w-full flex items-center justify-center gap-3 py-4 rounded-2xl font-black text-base transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl bg-gradient-to-r from-[#FF6B2C] to-[#F59E0B] text-white" style={{ fontFamily: "Orbitron, sans-serif", letterSpacing: "2px" }}>
                    <span className="shine-sweep" />
                    <Bike size={20} /> DAFTAR SEKARANG <ArrowRight size={20} />
                  </Link>
                </div>
              </div>
              </HoverTiltCard>
            </div>
          </div>
        </section>

        {/* ======== RACE PACK / GOODIE ======== */}
        <section className="py-20 bg-white overflow-hidden">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-14">
              <div className="badge-sunrise inline-block mb-4">RACE PACK</div>
              <h2 className="text-4xl font-black text-gray-900 mb-4" style={{ fontFamily: "Orbitron, sans-serif" }}>GOODIE BAG</h2>
              <div className="w-24 h-1 mx-auto rounded-full bg-gradient-to-r from-[#FF6B2C] to-[#7BC142]" />
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 stagger-list max-w-3xl mx-auto">
              {[
                { emoji: "👕", name: "Jersey Cycling", desc: "Dryfit premium" },
                { emoji: "🏷️", name: "Nomor Peserta", desc: "ID tag sepeda" },
                { emoji: "🎒", name: "Totebag", desc: "Eksklusif PSTI" },
                { emoji: "💧", name: "Tumbler", desc: "Reusable bottle" },
              ].map((item) => (
                <div key={item.name} className="card-animated glass-card-light p-5 rounded-2xl text-center border border-gray-100 hover:shadow-lg transition-all duration-300 group hover:-translate-y-1">
                  <div className="text-4xl mb-3">{item.emoji}</div>
                  <div className="text-gray-900 font-bold text-sm mb-0.5">{item.name}</div>
                  <div className="text-gray-400 text-xs">{item.desc}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ======== ROUTE + MEETING POINT ======== */}
        <section id="route" className="py-20 overflow-hidden" style={{ background: "linear-gradient(180deg, #F0FDF4 0%, #FFF8F0 100%)" }}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-14">
              <div className="badge-sunrise inline-block mb-4">RUTE & LOKASI</div>
              <h2 className="text-4xl font-black text-gray-900 mb-4" style={{ fontFamily: "Orbitron, sans-serif" }}>RUTE PERJALANAN</h2>
              <div className="w-24 h-1 mx-auto rounded-full bg-gradient-to-r from-[#7BC142] to-[#38BDF8]" />
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="card-animated glass-card-light p-6 rounded-2xl border border-gray-100">
                <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2" style={{ fontFamily: "Orbitron, sans-serif" }}>
                  <MapPin size={20} className="text-[#FF6B2C]" /> DETAIL RUTE
                </h3>
                <ul className="space-y-3 text-gray-600 text-sm">
                  {[
                    "Jarak tempuh: ±15 km",
                    "Medan: Jalan aspal datar, sedikit tanjakan ringan",
                    "Start & Finish: Alun-alun Purworejo",
                    "Rute melewati: Sawah, pedesaan, dan jalur hijau",
                    "Marking rute: Pita warna & petunjuk arah setiap 2 km",
                  ].map((item) => (
                    <li key={item} className="flex items-start gap-2">
                      <CheckCircle size={14} className="text-[#7BC142] mt-0.5 flex-shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="card-animated glass-card-light p-6 rounded-2xl border border-gray-100">
                <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2" style={{ fontFamily: "Orbitron, sans-serif" }}>
                  <Clock size={20} className="text-[#FF6B2C]" /> TITIK KUMPUL & JAM
                </h3>
                <div className="space-y-4 text-sm">
                  {[
                    { time: "05:00", event: "Titik kumpul dibuka di Alun-alun Purworejo", color: "#FF6B2C" },
                    { time: "05:30", event: "Briefing keselamatan & pemanasan bersama", color: "#F59E0B" },
                    { time: "06:00", event: "FLAG OFF — Gowes bersama dimulai!", color: "#7BC142" },
                    { time: "08:00", event: "Rest point — snack & minum", color: "#38BDF8" },
                    { time: "09:00", event: "Finish — hiburan, doorprize & foto bersama", color: "#FF6B2C" },
                  ].map((item) => (
                    <div key={item.time} className="flex items-start gap-3">
                      <div className="w-14 text-center rounded-lg py-1 px-2 flex-shrink-0 text-xs font-bold" style={{ background: `${item.color}15`, color: item.color, fontFamily: "Orbitron, sans-serif", border: `1px solid ${item.color}30` }}>
                        {item.time}
                      </div>
                      <span className="text-gray-600 pt-0.5">{item.event}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ======== TIMELINE ======== */}
        <section id="timeline" className="py-20 bg-white overflow-hidden">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-14">
              <div className="badge-sunrise inline-block mb-4">JADWAL</div>
              <h2 className="text-4xl font-black text-gray-900 mb-4" style={{ fontFamily: "Orbitron, sans-serif" }}>TIMELINE EVENT</h2>
              <div className="w-24 h-1 mx-auto rounded-full bg-gradient-to-r from-[#FF6B2C] to-[#7BC142]" />
            </div>
            <div className="space-y-4 stagger-list">
              {[
                { date: "1 Mei 2026", title: "Pembukaan Pendaftaran", desc: "Pendaftaran Fun Bike 2026 resmi dibuka.", color: "#FF6B2C" },
                { date: "14 Juni 2026", title: "Batas Pendaftaran", desc: "Pendaftaran ditutup pukul 23:59 WIB.", color: "#F59E0B" },
                { date: "17 Juni 2026", title: "Pengumuman Nomor Peserta", desc: "Nomor peserta diumumkan via email & website.", color: "#7BC142" },
                { date: "20–21 Juni 2026", title: "Pengambilan Race Pack", desc: "Ambil jersey, goodie bag, & nomor peserta.", color: "#38BDF8" },
                { date: "22 Juni 2026", title: "HARI H — FUN BIKE 2026", desc: "Start 06:00 WIB. Ride The Sunrise! 🚴", color: "#FF6B2C", isLast: true },
              ].map((ev) => (
                <div key={ev.date} className={`card-animated glass-card-light p-5 rounded-xl border transition-all duration-300 hover:shadow-md ${ev.isLast ? "border-[#FF6B2C]/40 shadow-lg" : "border-gray-100"}`}>
                  <div className="flex items-center gap-2 mb-1">
                    <Calendar size={12} style={{ color: ev.color }} />
                    <span className="text-xs font-semibold" style={{ color: ev.color, fontFamily: "Orbitron, sans-serif" }}>{ev.date}</span>
                  </div>
                  <h3 className="text-gray-900 font-bold mb-1 flex items-center gap-2">
                    {ev.isLast && <Bike size={14} style={{ color: ev.color }} />}
                    {ev.title}
                  </h3>
                  <p className="text-gray-500 text-sm">{ev.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ======== BENEFITS GRID ======== */}
        <section className="py-20 overflow-hidden" style={{ background: "linear-gradient(180deg, #FFF7ED 0%, #FFFFFF 100%)" }}>
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-14">
              <div className="badge-sunrise inline-block mb-4">BENEFIT</div>
              <h2 className="text-4xl font-black text-gray-900 mb-4" style={{ fontFamily: "Orbitron, sans-serif" }}>YANG KAMU DAPATKAN</h2>
              <div className="w-24 h-1 mx-auto rounded-full bg-gradient-to-r from-[#FF6B2C] to-[#7BC142]" />
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 stagger-list">
              {[
                { icon: Shirt, label: "Jersey Eksklusif", color: "#FF6B2C", anim: "sway" as const },
                { icon: Medal, label: "Finisher Medal", color: "#F59E0B", anim: "rotate" as const },
                { icon: Gift, label: "Doorprize", color: "#7BC142", anim: "bounce" as const },
                { icon: Camera, label: "Dokumentasi", color: "#38BDF8", anim: "pulse" as const },
                { icon: Coffee, label: "Snack & Minum", color: "#FF6B2C", anim: "sway" as const },
                { icon: Music, label: "Hiburan", color: "#F59E0B", anim: "bounce" as const },
                { icon: Trophy, label: "e-Sertifikat", color: "#7BC142", anim: "none" as const },
                { icon: Shield, label: "Asuransi Event", color: "#38BDF8", anim: "none" as const },
              ].map((b) => (
                <div key={b.label} className="card-animated glass-card-light p-5 rounded-2xl text-center border border-gray-100 hover:shadow-lg transition-all duration-300 group hover:-translate-y-1">
                  <div className="w-12 h-12 mx-auto mb-3 rounded-xl flex items-center justify-center transition-all" style={{ background: `${b.color}12` }}>
                    <AnimatedIcon color={b.color} size={22} animate={b.anim}>
                      <b.icon size={22} />
                    </AnimatedIcon>
                  </div>
                  <div className="text-gray-900 font-semibold text-sm">{b.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ======== DOORPRIZE ======== */}
        <section className="py-20 bg-white overflow-hidden">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="badge-sunrise inline-block mb-4">HADIAH</div>
            <h2 className="text-4xl font-black text-gray-900 mb-4" style={{ fontFamily: "Orbitron, sans-serif" }}>DOORPRIZE</h2>
            <div className="w-24 h-1 mx-auto rounded-full bg-gradient-to-r from-[#FF6B2C] to-[#F59E0B] mb-8" />
            <p className="text-gray-500 mb-8">Semua peserta berkesempatan memenangkan doorprize menarik di acara puncak!</p>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 stagger-list">
              {["🚲 Sepeda Gunung", "⌚ Smartwatch", "🎧 Earbuds TWS", "📱 Power Bank", "🎒 Tas Ransel", "🎁 Kejutan Lainnya"].map((prize) => (
                <div key={prize} className="card-animated shimmer-showcase glass-card-light p-4 rounded-xl border border-gray-100 hover:shadow-md transition-all duration-300 hover:-translate-y-1">
                  <span className="text-gray-800 font-semibold text-sm">{prize}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ======== SPONSOR ======== */}
        <section className="py-16 overflow-hidden" style={{ background: "linear-gradient(180deg, #FFFFFF 0%, #FFF8F0 100%)" }}>
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="badge-sunrise inline-block mb-4">DIDUKUNG OLEH</div>
            <h2 className="text-2xl font-black text-gray-900 mb-8" style={{ fontFamily: "Orbitron, sans-serif" }}>SPONSOR & PARTNER</h2>
            <div className="grid grid-cols-3 sm:grid-cols-5 gap-4">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="card-animated glass-card-light rounded-xl p-4 flex items-center justify-center border border-gray-100 h-20">
                  <span className="text-gray-300 text-xs text-center" style={{ fontFamily: "Orbitron, sans-serif" }}>SPONSOR {i + 1}</span>
                </div>
              ))}
            </div>
            <div className="marquee-track mt-6">
              {["Himatekno UMPWR", "PSTI FEST", "Purworejo Sport", "Bike Community", "Sunrise Coffee", "Green Cycling ID", "FunBike Store", "SportMax", "Local Bike Shop", "Cycling ID"].map((name, i) => (
                <div key={i} className="mx-8 py-2 px-6 rounded-xl border border-gray-200 bg-white/50 text-gray-400 text-sm whitespace-nowrap flex-shrink-0" style={{ fontFamily: "Orbitron, sans-serif" }}>{name}</div>
              ))}
              {["Himatekno UMPWR", "PSTI FEST", "Purworejo Sport", "Bike Community", "Sunrise Coffee", "Green Cycling ID", "FunBike Store", "SportMax", "Local Bike Shop", "Cycling ID"].map((name, i) => (
                <div key={`dup-${i}`} className="mx-8 py-2 px-6 rounded-xl border border-gray-200 bg-white/50 text-gray-400 text-sm whitespace-nowrap flex-shrink-0" style={{ fontFamily: "Orbitron, sans-serif" }}>{name}</div>
              ))}
            </div>
          </div>
        </section>

        {/* ======== RULES + FAQ ======== */}
        <section id="faq" className="py-20 bg-white overflow-hidden">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-14">
              <div className="badge-sunrise inline-block mb-4">BANTUAN</div>
              <h2 className="text-4xl font-black text-gray-900 mb-4" style={{ fontFamily: "Orbitron, sans-serif" }}>RULES & FAQ</h2>
              <div className="w-24 h-1 mx-auto rounded-full bg-gradient-to-r from-[#FF6B2C] to-[#7BC142]" />
            </div>
            <Suspense fallback={null}><FunBikeFaq /></Suspense>
            <div className="mt-10 text-center">
              <p className="text-gray-500 text-sm mb-3">Masih punya pertanyaan?</p>
              <a href="https://wa.me/6281234567890" target="_blank" rel="noopener noreferrer" className="btn-outline-sunrise inline-flex items-center gap-2 px-6 py-3 rounded-full text-sm cursor-pointer">
                💬 Hubungi Panitia via WhatsApp
              </a>
            </div>
          </div>
        </section>

        {/* ======== CTA FINAL ======== */}
        <section className="py-20 overflow-hidden" style={{ background: "linear-gradient(135deg, #FF6B2C 0%, #F59E0B 50%, #7BC142 100%)" }}>
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-4xl sm:text-5xl font-black text-white mb-4" style={{ fontFamily: "Orbitron, sans-serif" }}>
              SIAP GOWES?
            </h2>
            <p className="text-white/80 text-lg mb-8">Jangan sampai kehabisan kuota! Daftarkan dirimu di Fun Bike 2026 sekarang.</p>
            <Link href="/fun-bike/daftar" className="inline-flex items-center gap-2 px-10 py-4 rounded-full bg-white text-[#FF6B2C] font-black text-base transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl" style={{ fontFamily: "Orbitron, sans-serif", letterSpacing: "2px" }}>
              <Bike size={20} /> DAFTAR SEKARANG <ArrowRight size={20} />
            </Link>
          </div>
        </section>

        {/* ======== FOOTER ======== */}
        <footer className="bg-gray-900 border-t border-gray-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
              <div>
                <h3 className="text-white font-bold text-sm mb-2" style={{ fontFamily: "Orbitron, sans-serif" }}>FUN BIKE 2026</h3>
                <p className="text-gray-400 text-sm leading-relaxed">Event gowes sunrise PSTI FEST 2026.</p>
              </div>
              <div>
                <h3 className="text-white font-bold text-sm mb-2" style={{ fontFamily: "Orbitron, sans-serif" }}>EVENT LAIN</h3>
                <ul className="space-y-2 text-sm">
                  <li><Link href="/futuristic-run" className="text-gray-400 hover:text-[#00E5FF] transition-colors">Futuristic RUN 2026</Link></li>
                  <li><Link href="/" className="text-gray-400 hover:text-white transition-colors">PSTI FEST Hub</Link></li>
                </ul>
              </div>
              <div>
                <h3 className="text-white font-bold text-sm mb-2" style={{ fontFamily: "Orbitron, sans-serif" }}>KONTAK</h3>
                <ul className="space-y-2 text-sm text-gray-400">
                  <li>info@pstifest.com</li>
                  <li>+62 812-3456-7890</li>
                </ul>
              </div>
            </div>
            <div className="mt-8 pt-6 border-t border-gray-800 text-center">
              <p className="text-gray-500 text-xs">&copy; 2026 <span className="text-[#FF6B2C]">PSTI FEST</span>. All rights reserved.</p>
            </div>
          </div>
        </footer>
      </main>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(eventJsonLd(seo)) }}
      />
    </EventThemeProvider>
  );
}
