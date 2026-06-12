import Link from "next/link";
import Image from "next/image";
import CountdownTimer from "@/components/CountdownTimer";
import { ArrowRight, MapPin, Calendar, Users, Zap, Bike, ChevronDown } from "lucide-react";
import type { Metadata } from "next";
import ScrollProgressBar from "@/components/ui/ScrollProgressBar";
import { hubMetadata, EVENT_SEO, eventJsonLd } from "@/lib/seo";

export const metadata: Metadata = hubMetadata;

export default function HubPage() {
  return (
    <>
    <main className="page-animate relative min-h-screen bg-[#0A0E27]">
      <ScrollProgressBar color="#8B00FF" />
      {/* ======== HERO SECTION ======== */}
      <section className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden">
        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#050816] via-[#0A0E27] to-[#0A0E27]" />
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(0,229,255,1) 1px, transparent 1px), linear-gradient(90deg, rgba(0,229,255,1) 1px, transparent 1px)",
            backgroundSize: "60px 60px",
          }}
        />
        {/* Glow orbs */}
        <div className="absolute top-1/4 left-1/4 w-[400px] h-[400px] rounded-full blur-3xl opacity-15 bg-[#8B00FF]" />
        <div className="absolute top-1/3 right-1/4 w-[300px] h-[300px] rounded-full blur-3xl opacity-10 bg-[#FF6B2C]" />

        <div className="relative z-20 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-12 text-center">
          {/* Badge */}
          <div className="badge-neon inline-block mb-6 fade-in-up">
            HIMATEKNO UMPWR PRESENTS
          </div>

          {/* Title */}
          <h1
            className="fade-in-up-delay-1 mb-4"
            style={{
              fontFamily: "Orbitron, sans-serif",
              fontSize: "clamp(2.5rem, 7vw, 5rem)",
              fontWeight: 900,
              lineHeight: 1.1,
            }}
          >
            <span
              style={{
                background: "linear-gradient(135deg, #00E5FF 0%, #ffffff 35%, #FFD700 70%, #FF6B2C 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              PSTI FEST
            </span>
            <br />
            <span className="text-white text-4xl sm:text-5xl lg:text-6xl">2026</span>
          </h1>

          <p
            className="fade-in-up-delay-2 text-[#B0C4DE] tracking-[3px] mb-3 text-sm sm:text-base"
            style={{ fontFamily: "Rajdhani, sans-serif" }}
          >
            DUA EVENT . SATU FESTIVAL . TANPA BATAS
          </p>

          <p className="fade-in-up-delay-2 max-w-2xl mx-auto text-[#D7E8FF] text-base sm:text-lg leading-relaxed mb-8">
            PSTI FEST 2026 menghadirkan dua pengalaman tak terlupakan: berlari menembus malam neon atau
            gowes menyongsong matahari terbit. Pilih eventmu, daftarkan dirimu!
          </p>

          <div className="fade-in-up-delay-2 flex flex-wrap justify-center gap-4 text-[#B0C4DE] text-sm mb-10">
            <span className="flex items-center gap-1.5">
              <MapPin size={14} className="text-[#00E5FF]" />
              Purworejo, Jawa Tengah
            </span>
            <span className="flex items-center gap-1.5">
              <Calendar size={14} className="text-[#00E5FF]" />
              22 Juni 2026
            </span>
            <span className="flex items-center gap-1.5">
              <Users size={14} className="text-[#00E5FF]" />
              500+ Peserta
            </span>
          </div>

          {/* Countdown */}
          <div className="fade-in-up-delay-3 mb-8">
            <p className="text-[#B0C4DE] text-xs tracking-widest mb-3" style={{ fontFamily: "Orbitron, sans-serif" }}>
              HITUNG MUNDUR MENUJU HARI H
            </p>
            <CountdownTimer />
          </div>
        </div>

        <a
          href="#events"
          className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-1 text-[#B0C4DE] opacity-60 hover:opacity-100 transition-opacity"
        >
          <span className="text-xs tracking-widest" style={{ fontFamily: "Orbitron, sans-serif" }}>SCROLL</span>
          <ChevronDown size={20} className="animate-bounce" />
        </a>
      </section>

      {/* ======== SPLIT-SCREEN EVENT CARDS ======== */}
      <section id="events" className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-[#0A0E27] via-[#0F1535] to-[#0A0E27]" />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <div className="badge-neon inline-block mb-4">PILIH EVENTMU</div>
            <h2
              className="section-title text-4xl sm:text-5xl font-black mb-4"
              style={{ fontFamily: "Orbitron, sans-serif" }}
            >
              EVENT PSTI FEST 2026
            </h2>
            <div className="w-24 h-1 mx-auto rounded-full bg-gradient-to-r from-[#00E5FF] via-[#FFD700] to-[#FF6B2C]" />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
            {/* ── FuturisticRun Card ── */}
            <Link
              href="/futuristic-run"
              className="group card-animated relative rounded-3xl overflow-hidden border border-[#1E3A5F] hover:border-[#00E5FF]/50 transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_0_40px_rgba(0,229,255,0.15)]"
            >
              <div className="relative bg-[#080C20] rounded-3xl overflow-hidden h-full flex flex-col">
                {/* Top accent */}
                <div className="h-1 w-full bg-gradient-to-r from-[#8B00FF] via-[#00E5FF] to-[#8B00FF]" />

                {/* Image area */}
                <div className="relative h-52 sm:h-60 overflow-hidden">
                  <Image
                    src="/hero-runner.png"
                    alt="Futuristic RUN 2026 night runner"
                    fill
                    sizes="(max-width: 1024px) 100vw, 50vw"
                    className="object-cover object-top group-hover:scale-105 transition-transform duration-700"
                    style={{ filter: "brightness(0.6) saturate(1.3)" }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#080C20] via-[#080C20]/30 to-transparent" />

                  {/* Date badge */}
                  <div className="absolute top-4 right-4 bg-[#080C20]/80 backdrop-blur-sm border border-[#00E5FF]/30 rounded-lg px-3 py-1.5 text-center">
                    <div className="text-[#00E5FF] text-lg font-black leading-none" style={{ fontFamily: "Orbitron, sans-serif" }}>22</div>
                    <div className="text-[#B0C4DE] text-[0.6rem] tracking-wider">JUN 2026</div>
                  </div>

                  {/* Title overlay */}
                  <div className="absolute bottom-4 left-5 right-5">
                    <div className="inline-flex items-center gap-1.5 bg-[#8B00FF]/20 border border-[#8B00FF]/40 rounded-full px-3 py-1 mb-2">
                      <Zap size={10} className="text-[#8B00FF]" />
                      <span className="text-[0.6rem] font-bold tracking-widest text-[#C4B5FD]" style={{ fontFamily: "Orbitron, sans-serif" }}>NEON NIGHT RUN</span>
                    </div>
                    <h3 className="text-3xl sm:text-4xl font-black text-white leading-tight" style={{ fontFamily: "Orbitron, sans-serif" }}>
                      FUTURISTIC<br />RUN 2026
                    </h3>
                  </div>
                </div>

                {/* Content */}
                <div className="p-5 sm:p-6 flex-1 flex flex-col">
                  <p className="text-[#B0C4DE] text-sm leading-relaxed mb-4">
                    Lari malam bertema cyberpunk dengan atmosfer neon yang memukau. Satu kategori Run 5K,
                    jersey eksklusif, dan energi komunitas.
                  </p>

                  {/* Metadata chips */}
                  <div className="flex flex-wrap gap-2 mb-5">
                    <span className="inline-flex items-center gap-1.5 bg-[#00E5FF]/10 border border-[#00E5FF]/20 rounded-full px-3 py-1 text-xs text-[#00E5FF] font-medium">
                      <Zap size={11} /> Run 5K
                    </span>
                    <span className="inline-flex items-center gap-1.5 bg-[#00E5FF]/10 border border-[#00E5FF]/20 rounded-full px-3 py-1 text-xs text-[#00E5FF] font-medium">
                      <Users size={11} /> 200 Peserta
                    </span>
                    <span className="inline-flex items-center gap-1.5 bg-[#FFD700]/10 border border-[#FFD700]/20 rounded-full px-3 py-1 text-xs text-[#FFD700] font-bold" style={{ fontFamily: "Orbitron, sans-serif" }}>
                      Rp 200.000
                    </span>
                  </div>

                  {/* CTA */}
                  <div className="mt-auto flex items-center justify-center gap-2 bg-gradient-to-r from-[#8B00FF]/20 to-[#00E5FF]/20 border border-[#00E5FF]/30 rounded-xl py-3 px-5 text-[#00E5FF] font-bold text-sm group-hover:from-[#8B00FF]/30 group-hover:to-[#00E5FF]/30 group-hover:border-[#00E5FF]/50 transition-all duration-300" style={{ fontFamily: "Orbitron, sans-serif", letterSpacing: "1px" }}>
                    LIHAT EVENT <ArrowRight size={15} className="group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </div>
            </Link>

            {/* ── Fun Bike Card ── */}
            <Link
              href="/fun-bike"
              className="group card-animated relative rounded-3xl overflow-hidden border border-[#E5E7EB]/20 hover:border-[#FF6B2C]/50 transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_0_40px_rgba(255,107,44,0.15)]"
            >
              <div className="relative rounded-3xl overflow-hidden h-full flex flex-col" style={{ background: "linear-gradient(180deg, #FFF8F0 0%, #FFFFFF 100%)" }}>
                {/* Top accent */}
                <div className="h-1 w-full bg-gradient-to-r from-[#FF6B2C] via-[#F59E0B] to-[#7BC142]" />

                {/* Sunrise visual area */}
                <div className="relative h-52 sm:h-60 overflow-hidden" style={{ background: "linear-gradient(180deg, #FDE68A 0%, #FED7AA 30%, #FFEDD5 60%, #FFF7ED 100%)" }}>
                  {/* Decorative sun rays */}
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[200px] h-[200px]">
                    <div className="absolute inset-0 rounded-full opacity-30" style={{ background: "radial-gradient(circle, #F59E0B 0%, transparent 70%)" }} />
                    <div className="absolute inset-4 rounded-full opacity-20" style={{ background: "radial-gradient(circle, #FF6B2C 0%, transparent 60%)" }} />
                  </div>

                  {/* Mountain silhouette */}
                  <div className="absolute bottom-0 left-0 right-0 h-20">
                    <svg viewBox="0 0 600 80" className="absolute bottom-0 w-full h-full" preserveAspectRatio="none">
                      <path d="M0,80 L0,50 Q80,20 160,45 Q240,15 320,40 Q400,10 480,35 Q540,20 600,40 L600,80 Z" fill="#7BC142" opacity="0.15" />
                      <path d="M0,80 L0,55 Q100,30 200,50 Q300,25 400,48 Q500,22 600,45 L600,80 Z" fill="#7BC142" opacity="0.1" />
                    </svg>
                  </div>

                  {/* Cyclist icon group */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="relative">
                      <div className="text-7xl drop-shadow-lg group-hover:scale-110 transition-transform duration-500">🚴</div>
                      <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-16 h-2 bg-black/5 rounded-full blur-sm" />
                    </div>
                  </div>

                  {/* Gradient fade to card body */}
                  <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-[#FFF8F0] to-transparent" />

                  {/* Date badge */}
                  <div className="absolute top-4 right-4 bg-white/80 backdrop-blur-sm border border-[#FF6B2C]/30 rounded-lg px-3 py-1.5 text-center shadow-sm">
                    <div className="text-[#FF6B2C] text-lg font-black leading-none" style={{ fontFamily: "Orbitron, sans-serif" }}>22</div>
                    <div className="text-gray-500 text-[0.6rem] tracking-wider">JUN 2026</div>
                  </div>

                  {/* Title overlay */}
                  <div className="absolute bottom-3 left-5 right-5">
                    <div className="inline-flex items-center gap-1.5 bg-[#FF6B2C]/15 border border-[#FF6B2C]/30 rounded-full px-3 py-1 mb-2">
                      <Bike size={10} className="text-[#FF6B2C]" />
                      <span className="text-[0.6rem] font-bold tracking-widest text-[#FF6B2C]" style={{ fontFamily: "Orbitron, sans-serif" }}>SUNRISE RIDE</span>
                    </div>
                    <h3 className="text-3xl sm:text-4xl font-black text-gray-900 leading-tight" style={{ fontFamily: "Orbitron, sans-serif" }}>
                      FUN BIKE<br />2026
                    </h3>
                  </div>
                </div>

                {/* Content */}
                <div className="p-5 sm:p-6 flex-1 flex flex-col">
                  <p className="text-gray-600 text-sm leading-relaxed mb-4">
                    Gowes santai menyambut matahari terbit dengan rute indah Purworejo.
                    Satu paket seru untuk semua level pesepeda!
                  </p>

                  {/* Metadata chips */}
                  <div className="flex flex-wrap gap-2 mb-5">
                    <span className="inline-flex items-center gap-1.5 bg-[#FF6B2C]/8 border border-[#FF6B2C]/20 rounded-full px-3 py-1 text-xs text-[#FF6B2C] font-medium">
                      <Bike size={11} /> Fun Ride
                    </span>
                    <span className="inline-flex items-center gap-1.5 bg-[#FF6B2C]/8 border border-[#FF6B2C]/20 rounded-full px-3 py-1 text-xs text-[#FF6B2C] font-medium">
                      <Users size={11} /> 300 Peserta
                    </span>
                    <span className="inline-flex items-center gap-1.5 bg-[#7BC142]/8 border border-[#7BC142]/20 rounded-full px-3 py-1 text-xs text-[#5A9A2F] font-bold" style={{ fontFamily: "Orbitron, sans-serif" }}>
                      Rp 150.000
                    </span>
                  </div>

                  {/* CTA */}
                  <div className="mt-auto flex items-center justify-center gap-2 bg-gradient-to-r from-[#FF6B2C]/10 to-[#F59E0B]/10 border border-[#FF6B2C]/30 rounded-xl py-3 px-5 text-[#FF6B2C] font-bold text-sm group-hover:from-[#FF6B2C]/20 group-hover:to-[#F59E0B]/20 group-hover:border-[#FF6B2C]/50 transition-all duration-300" style={{ fontFamily: "Orbitron, sans-serif", letterSpacing: "1px" }}>
                    LIHAT EVENT <ArrowRight size={15} className="group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* ======== ABOUT PSTI FEST ======== */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 bg-[#0A0E27]" />
        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="badge-neon inline-block mb-4">TENTANG KAMI</div>
          <h2
            className="section-title text-3xl sm:text-4xl font-black mb-6"
            style={{ fontFamily: "Orbitron, sans-serif" }}
          >
            TENTANG PSTI FEST
          </h2>
          <p className="text-[#B0C4DE] text-lg leading-relaxed mb-6">
            <span className="text-white font-semibold">PSTI FEST 2026</span> adalah festival tahunan yang
            diselenggarakan oleh{" "}
            <span className="text-[#00E5FF] font-semibold">Himatekno Universitas Muhammadiyah Purworejo</span>.
            Festival ini menggabungkan teknologi, olahraga, dan komunitas dalam rangkaian event yang menginspirasi.
          </p>
          <p className="text-[#B0C4DE] leading-relaxed mb-8">
            Tahun ini, PSTI FEST menghadirkan dua event utama: <span className="text-[#00E5FF]">Futuristic RUN 2026</span> —
            lari malam bertema cyberpunk, dan <span className="text-[#FF6B2C]">Fun Bike 2026</span> — gowes sunrise
            yang menyenangkan. Keduanya dirancang untuk semua kalangan, dari pemula hingga berpengalaman.
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 stagger-list">
            {[
              { value: "2", label: "Event Seru", color: "#FFD700" },
              { value: "500+", label: "Total Peserta", color: "#00E5FF" },
              { value: "1", label: "Festival", color: "#FF006E" },
              { value: "2026", label: "Edisi Perdana", color: "#8B00FF" },
            ].map((stat) => (
              <div key={stat.label} className="card-animated glass-card p-5 rounded-2xl text-center border border-[#1E3A5F]">
                <div className="text-3xl font-black mb-1" style={{ fontFamily: "Orbitron, sans-serif", color: stat.color }}>
                  {stat.value}
                </div>
                <div className="text-[#B0C4DE] text-xs">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ======== SPONSOR SECTION ======== */}
      <section className="relative py-16 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-[#0A0E27] via-[#0F1535] to-[#0A0E27]" />
        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="badge-neon inline-block mb-4">DIDUKUNG OLEH</div>
          <h2
            className="text-2xl font-black text-white mb-8"
            style={{ fontFamily: "Orbitron, sans-serif" }}
          >
            SPONSOR & PARTNER
          </h2>
          <div className="grid grid-cols-3 sm:grid-cols-5 gap-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <div
                key={i}
                className="card-animated glass-card rounded-xl p-4 flex items-center justify-center border border-[#1E3A5F]/50 h-20"
              >
                <span className="text-[#B0C4DE]/40 text-xs text-center" style={{ fontFamily: "Orbitron, sans-serif" }}>
                  SPONSOR {i + 1}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ======== GLOBAL FOOTER ======== */}
      <footer className="relative border-t border-[#1E3A5F] bg-[#080C20]">
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#00E5FF]/50 to-transparent" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
            <div>
              <h3 className="text-white font-bold text-sm mb-2" style={{ fontFamily: "Orbitron, sans-serif" }}>PSTI FEST 2026</h3>
              <p className="text-[#B0C4DE] text-sm leading-relaxed">
                Festival olahraga dan teknologi tahunan oleh Himatekno UMPWR.
              </p>
            </div>
            <div>
              <h3 className="text-white font-bold text-sm mb-2" style={{ fontFamily: "Orbitron, sans-serif" }}>EVENT</h3>
              <ul className="space-y-2 text-sm">
                <li><Link href="/futuristic-run" className="text-[#B0C4DE] hover:text-[#00E5FF] transition-colors">Futuristic RUN 2026</Link></li>
                <li><Link href="/fun-bike" className="text-[#B0C4DE] hover:text-[#FF6B2C] transition-colors">Fun Bike 2026</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="text-white font-bold text-sm mb-2" style={{ fontFamily: "Orbitron, sans-serif" }}>KONTAK</h3>
              <ul className="space-y-2 text-sm text-[#B0C4DE]">
                <li>info@pstifest.com</li>
                <li>+62 812-3456-7890</li>
              </ul>
            </div>
          </div>
          <div className="mt-8 pt-6 border-t border-[#1E3A5F] flex flex-col sm:flex-row justify-between items-center gap-4">
            <p className="text-[#B0C4DE] text-xs">
              &copy; 2026 <span className="text-[#00E5FF]">PSTI FEST</span>. All rights reserved.
            </p>
            <div className="flex gap-4">
              <Link href="/kebijakan-privasi" className="text-[#B0C4DE] hover:text-white text-xs transition-colors">
                Kebijakan Privasi
              </Link>
              <Link href="/syarat-ketentuan" className="text-[#B0C4DE] hover:text-white text-xs transition-colors">
                Syarat & Ketentuan
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </main>
      {/* JSON-LD for both events */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify([
          eventJsonLd(EVENT_SEO["futuristic-run"]),
          eventJsonLd(EVENT_SEO["fun-bike"]),
        ]) }}
      />
    </>
  );
}
