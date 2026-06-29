import ParticleCanvas from "@/components/ParticleCanvas";
import CountdownTimer from "@/components/CountdownTimer";
import Link from "next/link";
import { MapPin, Calendar, ChevronDown, Zap, ArrowRight } from "lucide-react";
import { ORGANIZER_NAME, FEST_YEAR } from "@/content/brand";
import { EVENTS } from "@/content/events";
import TbdBadge from "@/components/ui/TbdBadge";
import { eventStartIso, formatEventDate } from "@/lib/eventDate";

const event = EVENTS["futuristic-run"];

export default function HeroSection({ eventDate, locationLabel }: { eventDate: string | null; locationLabel: string }) {
  return (
    <section
      id="hero"
      className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden bg-[#050816]"
    >
      <picture className="absolute inset-0 z-0 block">
        <source media="(max-width: 767px)" srcSet="/hero-main-mobile.webp" type="image/webp" />
        <img
          src="/hero-main-banner.png"
          alt={`${event.name} ${FEST_YEAR} night runner banner`}
          className="h-full w-full object-cover object-[60%_center] sm:object-[38%_center]"
          fetchPriority="high"
          decoding="async"
          style={{
            transform: "translateY(54px) scale(1.05)",
            filter: "brightness(1.18) contrast(1.06) saturate(1.12)",
          }}
        />
      </picture>

      {/* Mobile: vertical gradient so runner shows behind text; Desktop: left-to-right gradient */}
      <div className="absolute inset-0 z-10 bg-[linear-gradient(180deg,rgba(5,8,22,0.72)_0%,rgba(5,8,22,0.45)_35%,rgba(5,8,22,0.55)_65%,rgba(5,8,22,0.85)_100%)] sm:bg-[linear-gradient(90deg,rgba(5,8,22,0.96)_0%,rgba(7,11,32,0.78)_38%,rgba(7,11,32,0.20)_62%,rgba(7,11,32,0)_100%)]" />
      <div className="absolute inset-0 z-10 hidden sm:block bg-[linear-gradient(180deg,rgba(5,8,22,0.12)_0%,rgba(5,8,22,0)_46%,rgba(5,8,22,0.62)_100%)]" />

      <div className="absolute inset-0 z-10">
        <ParticleCanvas />
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-48 bg-gradient-to-t from-[#0A0E27] to-transparent z-10" />

      <div
        className="absolute inset-0 opacity-[0.05] sm:opacity-[0.07] z-10"
        style={{
          backgroundImage:
            "linear-gradient(rgba(0,229,255,1) 1px, transparent 1px), linear-gradient(90deg, rgba(0,229,255,1) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />

      <div className="relative z-20 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 sm:pt-28 pb-14 sm:pb-20 flex items-center">
        <div className="max-w-3xl text-center lg:text-left">
          <div className="badge-neon inline-block mb-5 fade-in-up">
            {ORGANIZER_NAME} PRESENTS
          </div>

          <h1
            className="fade-in-up-delay-1 mb-3"
            style={{
              fontFamily: "Orbitron, sans-serif",
              fontSize: "clamp(2.35rem, 8vw, 5.5rem)",
              fontWeight: 900,
              lineHeight: 1.05,
              letterSpacing: "0",
            }}
          >
            <span
              style={{
                background: "linear-gradient(135deg, #00E5FF 0%, #ffffff 40%, #8B00FF 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              FUTURISTIC
            </span>
            <br />
            <span className="text-white">RUN</span>
            <span
              style={{
                background: "linear-gradient(135deg, #FF8C00, #FFD700)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              {" "}{FEST_YEAR}
            </span>
          </h1>

          <p
            className="fade-in-up-delay-2 text-[#00E5FF] font-semibold tracking-[4px] mb-4 text-sm sm:text-base"
            style={{ fontFamily: "Rajdhani, sans-serif" }}
          >
            {event.tagline.toUpperCase()}
          </p>

          <p className="fade-in-up-delay-2 max-w-2xl mx-auto lg:mx-0 text-[#D7E8FF] text-sm sm:text-lg leading-relaxed mb-5 sm:mb-7">
            {event.name} {FEST_YEAR} adalah lari malam 5K bertema neon/cyberpunk. Rasakan garis start pukul 20.00,
            lampu kota, musik malam, jersey eksklusif, dan energi komunitas runner.
          </p>

          <div className="fade-in-up-delay-2 flex flex-wrap justify-center lg:justify-start gap-3 sm:gap-4 text-[#B0C4DE] text-sm mb-5 sm:mb-8">
            <span className="flex items-center gap-1.5">
              <MapPin size={14} className="text-[#00E5FF]" />
              {locationLabel}
            </span>
            <span className="flex items-center gap-1.5">
              <Calendar size={14} className="text-[#00E5FF]" />
              {formatEventDate(eventDate) ?? <TbdBadge label="TBA" microcopy="Segera diumumkan" className="border-[#00E5FF]/20 bg-[#00E5FF]/5 text-[#D7E8FF]" />}
            </span>
            <span className="flex items-center gap-1.5">
              <Zap size={14} className="text-[#00E5FF]" />
              Run 5K
            </span>
          </div>

          <div className="fade-in-up-delay-3 flex flex-col sm:flex-row gap-3 justify-center lg:justify-start mb-6 sm:mb-10">
            <Link
              href="/futuristic-run/daftar"
              className="relative overflow-hidden btn-neon flex items-center justify-center gap-2 px-7 sm:px-8 py-4 rounded-full text-sm font-bold cursor-pointer"
            >
              <span className="shine-sweep" />
              <Zap size={16} />
              DAFTAR
              <ArrowRight size={16} />
            </Link>
            <Link
              href="/cek"
              className="btn-outline-neon flex items-center justify-center gap-2 px-7 sm:px-8 py-4 rounded-full text-sm font-semibold cursor-pointer"
            >
              Cek Registrasi
            </Link>
          </div>

          <div className="fade-in-up-delay-4">
            <p className="text-[#B0C4DE] text-xs tracking-widest mb-3" style={{ fontFamily: "Orbitron, sans-serif" }}>
              HITUNG MUNDUR MENUJU HARI H
            </p>
            <CountdownTimer targetDate={eventStartIso(eventDate, event.startTime)} />
          </div>
        </div>
      </div>

      <a
        href="#about"
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-1 text-[#B0C4DE] opacity-60 hover:opacity-100 transition-opacity"
      >
        <span className="text-xs tracking-widest" style={{ fontFamily: "Orbitron, sans-serif" }}>
          SCROLL
        </span>
        <ChevronDown size={20} className="animate-bounce" />
      </a>
    </section>
  );
}
