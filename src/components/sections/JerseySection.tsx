import Image from "next/image";
import Link from "next/link";
import { ArrowRight, CheckSquare, Palette, ShieldCheck, Sparkles, Sun, Tag, Zap } from "lucide-react";
import AnimatedSectionTitle from "@/components/AnimatedSectionTitle";
import TbdBadge from "@/components/ui/TbdBadge";

const specs = [
  { label: "Material", value: "100% Polyester Dryfit Premium" },
  { label: "Teknologi", value: "Anti-sweat, Quick-dry, UV Protection" },
  { label: "Desain", value: "Blue Neon Race Jersey" },
  { label: "Ukuran", value: "XS - S - M - L - XL - XXL - XXXL" },
];

const highlights = [
  { icon: Sparkles, label: "Motif neon eksklusif" },
  { icon: ShieldCheck, label: "Dryfit premium" },
  { icon: Palette, label: "Logo final memakai placeholder revisi" },
];

export default function JerseySection() {
  return (
    <section
      id="jersey"
      className="section-reveal relative overflow-hidden py-6 sm:py-10"
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
          <AnimatedSectionTitle text="JERSEY & BIB" className="text-4xl font-black sm:text-5xl" />
          <p className="mx-auto mt-4 max-w-2xl text-sm leading-6 text-[#B0C4DE] sm:text-base">
            Perlengkapan peserta untuk lari malam: jersey neon, BIB dengan pembeda kategori dan warna, refreshment,
            serta medali sesuai ketentuan final panitia.
          </p>
        </div>

        <div className="card-animated relative overflow-hidden rounded-2xl border border-[#00E5FF]/25 bg-[#090C2C] shadow-[0_0_60px_rgba(0,229,255,0.16)]">
          <div className="absolute -inset-px bg-gradient-to-r from-[#00E5FF]/35 via-transparent to-[#8B00FF]/35" />
          <div className="relative aspect-[2560/1418] min-h-[260px] sm:min-h-[360px] lg:min-h-[520px]">
            <Image
              src="/jersey-banner-landscape.jpeg"
              alt="Banner jersey eksklusif Futuristic Run 2026"
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
                Futuristic Run
              </h3>
              <p className="max-w-xl text-sm leading-6 text-[#B0C4DE] sm:text-base">
                Jersey memakai placeholder logo sampai revisi final disahkan. Ukuran dipilih saat pendaftaran, jadi
                pastikan ukuran yang dipilih sudah tepat.
              </p>

              <div className="stagger-list mt-6 grid grid-cols-1 gap-3 sm:grid-cols-3">
                {highlights.map(({ icon: Icon, label }) => (
                  <div key={label} className="card-animated rounded-xl border border-[#00E5FF]/15 bg-[#0B1030]/80 p-3">
                    <Icon size={18} className="mb-2 text-[#00E5FF]" />
                    <p className="text-xs font-semibold leading-4 text-white sm:text-sm">{label}</p>
                  </div>
                ))}
              </div>

              <div className="mt-5 rounded-xl border border-[#FFD700]/25 bg-[#FFD700]/8 p-4">
                <p className="mb-2 text-xs font-black uppercase tracking-[0.18em] text-[#FFD700]">Status logo</p>
                <TbdBadge label="Placeholder sampai revisi final" className="border-[#FFD700]/30 bg-[#FFD700]/10 text-[#FFD700]" />
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

              <div className="mt-6 grid gap-3 sm:grid-cols-2">
                {[
                  { icon: Tag, label: "BIB dibedakan per kategori dan warna" },
                  { icon: CheckSquare, label: "Refreshment" },
                  { icon: CheckSquare, label: "Medali" },
                  { icon: Sun, label: "Aksen reflektif untuk suasana malam" },
                ].map(({ icon: Icon, label }) => (
                  <div key={label} className="flex items-center gap-3 rounded-xl border border-[#00E5FF]/15 bg-[#0B1030]/80 p-3">
                    <Icon size={17} className="text-[#00E5FF]" />
                    <span className="text-sm font-semibold text-[#C6D4F1]">{label}</span>
                  </div>
                ))}
              </div>

              <Link
                href="/futuristic-run/daftar"
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
