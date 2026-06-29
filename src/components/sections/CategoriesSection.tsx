import Link from "next/link";
import { Zap, ArrowRight, Shirt, Medal, Tag, Droplets, Trophy, FileText, Gift, Footprints } from "lucide-react";
import QuotaMeter from "@/components/QuotaMeter";
import HoverTiltCard from "@/components/ui/HoverTiltCard";
import TbdBadge from "@/components/ui/TbdBadge";
import AnimatedIcon from "@/components/ui/AnimatedIcon";
import SectionHeading from "@/components/ui/SectionHeading";
import { FEST_YEAR } from "@/content/brand";
import { EVENTS } from "@/content/events";

const event = EVENTS["futuristic-run"];

const facilities = [
  { icon: Shirt, motion: "sway" as const, label: `Jersey Eksklusif ${event.name} ${FEST_YEAR}` },
  { icon: Medal, motion: "rotate" as const, label: "Finisher Medal" },
  { icon: Tag, motion: "pulse" as const, label: "Race BIB (Timing Chip)" },
  { icon: Footprints, motion: "bounce" as const, label: "Totebag Eksklusif" },
  { icon: Droplets, motion: "sway" as const, label: "Water Station & Refreshment" },
  { icon: Trophy, motion: "rotate" as const, label: "Podium 1-2-3 Putra & Putri" },
  { icon: FileText, motion: "pulse" as const, label: "Race Result & e-Sertifikat" },
  { icon: Gift, motion: "bounce" as const, label: "Doorprize & Hiburan" },
];

type CategoriesSectionProps = {
  price?: number | null;
  quota?: number | null;
  categoryLabel?: string | null;
};

function formatPrice(price: number | null | undefined) {
  if (!price || price <= 0) return null;
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(price);
}

export default function CategoriesSection({ price, quota, categoryLabel }: CategoriesSectionProps) {
  const priceLabel = formatPrice(price);
  const category = categoryLabel ?? event.categoryLabel;

  return (
    <section id="categories" className="section-reveal relative py-6 sm:py-10 overflow-hidden">
      <div className="absolute inset-0 bg-[#0A0E27]" />
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: "radial-gradient(circle at 1px 1px, rgba(139,0,255,1) 1px, transparent 0)",
          backgroundSize: "40px 40px",
        }}
      />
      {/* Top glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] rounded-full opacity-20 blur-3xl"
        style={{ background: "radial-gradient(circle, #8B00FF 0%, transparent 70%)" }} />

      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Paket Lomba"
          title="KATEGORI LOMBA"
          subtitle="Satu kategori, satu perjuangan bersama kita berlari."
          accentColor="#00E5FF"
          accentColor2="#8B00FF"
          className="section-reveal-delay-1"
        />
        {/* Single featured card */}
        <div className="card-animated relative max-w-2xl mx-auto">
          {/* Glow ring */}
          <div className="absolute -inset-1 rounded-3xl blur-xl opacity-40"
            style={{ background: "linear-gradient(135deg, #8B00FF, #00E5FF)" }} />

          <HoverTiltCard maxTilt={6} glareColor="#8B00FF">
          <div className="relative glass-card rounded-3xl overflow-hidden border"
            style={{ borderColor: "rgba(139,0,255,0.4)", background: "rgba(10,14,39,0.95)" }}>

            {/* Top accent line */}
            <div className="h-1 w-full" style={{ background: "linear-gradient(90deg, #8B00FF, #00E5FF, #8B00FF)" }} />

            {/* POPULER badge */}
            <div className="absolute top-5 right-5 text-xs font-bold px-3 py-1 rounded-full"
              style={{ background: "rgba(139,0,255,0.15)", border: "1px solid rgba(139,0,255,0.6)", color: "#8B00FF", fontFamily: "Orbitron, sans-serif", fontSize: "0.6rem", letterSpacing: "2px" }}>
              SATU-SATUNYA
            </div>

            <div className="p-8 sm:p-12">
              {/* Header */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 mb-8">
                <div className="w-20 h-20 rounded-2xl flex items-center justify-center text-4xl flex-shrink-0"
                  style={{ background: "linear-gradient(135deg, rgba(139,0,255,0.2), rgba(0,229,255,0.1))", border: "1px solid rgba(139,0,255,0.3)" }}>
                  âš¡
                </div>
                <div>
                  <div className="text-[#B0C4DE] text-sm mb-1 tracking-widest" style={{ fontFamily: "Rajdhani, sans-serif" }}>
                    {event.name.toUpperCase()} {FEST_YEAR}
                  </div>
                  <h3 className="text-4xl sm:text-5xl font-black mb-1" style={{ fontFamily: "Orbitron, sans-serif", color: "#8B00FF", textShadow: "0 0 30px rgba(139,0,255,0.5)" }}>
                    RUN 5K
                  </h3>
                  <p className="text-[#B0C4DE] text-sm">{category}. Final satu kategori, tanpa 3K/10K.</p>
                </div>
              </div>

              {/* Price */}
              <div className="card-animated text-center mb-8 p-6 rounded-2xl" style={{ background: "linear-gradient(135deg, rgba(139,0,255,0.1), rgba(0,229,255,0.05))", border: "1px solid rgba(139,0,255,0.2)" }}>
                <div className="text-[#B0C4DE] text-sm mb-1 tracking-widest">BIAYA PENDAFTARAN</div>
                {priceLabel ? (
                  <div className="text-4xl font-black sm:text-5xl" style={{ fontFamily: "Orbitron, sans-serif", color: "#FFD700", textShadow: "0 0 20px rgba(255,215,0,0.4)" }}>
                    {priceLabel}
                  </div>
                ) : (
                  <div className="mt-3 flex justify-center">
                    <TbdBadge className="border-[#FFD700]/30 bg-[#FFD700]/10 px-4 py-2 text-[#FFD700]" />
                  </div>
                )}
                <div className="text-[#B0C4DE] text-sm mt-1">per peserta</div>
              </div>

              {/* Facilities grid */}
              <div className="stagger-list grid grid-cols-1 sm:grid-cols-2 gap-3 mb-8">
                {facilities.map((f) => (
                  <div key={f.label} className="card-animated flex items-center gap-3 p-3 rounded-xl"
                    style={{ background: "rgba(139,0,255,0.05)", border: "1px solid rgba(139,0,255,0.1)" }}>
                    <AnimatedIcon color="#00E5FF" size={20} animate={f.motion} className="flex-shrink-0">
                      <f.icon size={20} />
                    </AnimatedIcon>
                    <span className="text-[#B0C4DE] text-sm">{f.label}</span>
                  </div>
                ))}
              </div>

              {/* Quota info */}
              <div className="card-animated mb-8 p-4 rounded-xl" style={{ background: "rgba(0,229,255,0.05)", border: "1px solid rgba(0,229,255,0.15)" }}>
                <QuotaMeter category="5K" fallbackTotal={quota ?? 0} />
              </div>

              {/* CTA */}
              <Link
                href="/futuristic-run/daftar"
                className="relative overflow-hidden w-full flex items-center justify-center gap-3 py-4 rounded-2xl font-black text-base transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl"
                style={{
                  background: "linear-gradient(135deg, #8B00FF, #2A4FFF)",
                  color: "white",
                  fontFamily: "Orbitron, sans-serif",
                  letterSpacing: "2px",
                  boxShadow: "0 0 30px rgba(139,0,255,0.4)",
                }}
              >
                <span className="shine-sweep" />
                <Zap size={20} />
                DAFTAR SEKARANG
                <ArrowRight size={20} />
              </Link>
            </div>
          </div>
          </HoverTiltCard>
        </div>
      </div>
    </section>
  );
}

