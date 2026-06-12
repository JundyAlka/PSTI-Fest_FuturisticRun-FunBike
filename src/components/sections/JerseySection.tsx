import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ShieldCheck, Sparkles, Sun, Zap } from "lucide-react";
import AnimatedSectionTitle from "@/components/AnimatedSectionTitle";

const specs = [
  { label: "Material", value: "100% Polyester Dryfit Premium" },
  { label: "Teknologi", value: "Anti-sweat, Quick-dry, UV Protection" },
  { label: "Desain", value: "Blue Neon Race Jersey" },
  { label: "Ukuran", value: "XS - S - M - L - XL - XXL - XXXL" },
];

const highlights = [
  { icon: Sparkles, label: "Motif neon eksklusif" },
  { icon: ShieldCheck, label: "Dryfit premium" },
  { icon: Sun, label: "UV protection" },
];

export default function JerseySection() {
  return (
    <section
      id="jersey"
      className="section-reveal relative overflow-hidden py-20 sm:py-24"
      style={{
        background:
          "radial-gradient(ellipse at 50% 0%, rgba(0,229,255,0.18) 0%, transparent 48%), radial-gradient(ellipse at 16% 52%, rgba(42,79,255,0.2) 0%, transparent 46%), radial-gradient(ellipse at 86% 58%, rgba(139,0,255,0.18) 0%, transparent 46%), #080A22",
      }}
    >
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#00E5FF]/70 to-transparent" />
      <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-[#8B00FF]/70 to-transparent" />
      <div
        className="absolute inset-0 opacity-[0.045]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(0,229,255,1) 1px, transparent 1px), linear-gradient(90deg, rgba(139,0,255,1) 1px, transparent 1px)",
          backgroundSize: "54px 54px",
        }}
      />

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="section-reveal-delay-1 mx-auto mb-10 max-w-4xl text-center sm:mb-12">
          <div className="badge-neon mb-4 inline-block">EKSKLUSIF 2026</div>
          <AnimatedSectionTitle text="JERSEY EKSKLUSIF" className="text-4xl font-black sm:text-5xl" />
          <p className="mx-auto mt-4 max-w-2xl text-sm leading-6 text-[#B0C4DE] sm:text-base">
            Desain resmi Futuristic RUN 2026 dengan warna biru elektrik, aksen cyan, dan detail neon yang selaras
            dengan konsep race night.
          </p>
        </div>

        <div className="card-animated relative overflow-hidden rounded-2xl border border-[#00E5FF]/25 bg-[#090C2C] shadow-[0_0_60px_rgba(0,229,255,0.16)]">
          <div className="absolute -inset-px bg-gradient-to-r from-[#00E5FF]/35 via-transparent to-[#8B00FF]/35" />
          <div className="relative aspect-[2560/1418] min-h-[260px] sm:min-h-[360px] lg:min-h-[520px]">
            <Image
              src="/jersey-banner-landscape.jpeg"
              alt="Banner jersey eksklusif Futuristic RUN 2026"
              fill
              sizes="(min-width: 1280px) 1200px, 100vw"
              className="object-cover"
              priority
            />
          </div>
        </div>

        <div className="card-animated mt-6 overflow-hidden rounded-2xl border border-[#00E5FF]/20 bg-[#080A22]/80 shadow-[0_0_44px_rgba(42,79,255,0.16)]">
          <div className="grid gap-0 lg:grid-cols-[0.95fr_1.05fr]">
            <div className="border-b border-[#1E3A5F]/80 p-5 sm:p-7 lg:border-b-0 lg:border-r">
              <p className="mb-3 text-sm font-bold text-[#FFB000]" style={{ fontFamily: "Rajdhani, sans-serif" }}>
                LIMITED EDITION JERSEY 2026
              </p>
              <h3
                className="mb-4 text-3xl font-black text-white sm:text-4xl"
                style={{ fontFamily: "Orbitron, sans-serif" }}
              >
                FUTURISTIC RUN
              </h3>
              <p className="max-w-xl text-sm leading-6 text-[#B0C4DE] sm:text-base">
                Jersey gratis untuk peserta terdaftar. Ukuran dipilih saat pendaftaran, jadi pastikan ukuran yang
                dipilih sudah tepat.
              </p>

              <div className="stagger-list mt-6 grid grid-cols-1 gap-3 sm:grid-cols-3">
                {highlights.map(({ icon: Icon, label }) => (
                  <div key={label} className="card-animated rounded-xl border border-[#00E5FF]/15 bg-[#0B1030]/80 p-3">
                    <Icon size={18} className="mb-2 text-[#00E5FF]" />
                    <p className="text-xs font-semibold leading-4 text-white sm:text-sm">{label}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="p-5 sm:p-7">
              <div className="divide-y divide-[#1E3A5F]/75 border-y border-[#1E3A5F]/75">
                {specs.map((spec) => (
                  <div key={spec.label} className="table-row-animated grid grid-cols-[92px_1fr] gap-4 py-3.5 text-sm sm:grid-cols-[112px_1fr]">
                    <span className="font-semibold text-[#00E5FF]">{spec.label}</span>
                    <span className="text-[#C6D4F1]">{spec.value}</span>
                  </div>
                ))}
              </div>

              <Link
                href="/daftar"
                className="btn-neon mt-6 inline-flex w-full items-center justify-center gap-2 rounded-full px-8 py-4 text-sm font-bold sm:w-auto"
              >
                <Zap size={16} />
                DAPATKAN JERSEY SEKARANG
                <ArrowRight size={16} />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
