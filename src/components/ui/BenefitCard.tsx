import { BadgeCheck, CupSoda, Medal, Music, Ticket, Trophy, type LucideIcon } from "lucide-react";
import type { Benefit } from "@/content/events";
import TbdBadge, { hasAnnouncedValue } from "./TbdBadge";

const ICONS: Record<string, LucideIcon> = {
  BadgeCheck,
  Trophy,
  Medal,
  Ticket,
  CupSoda,
  Music,
};

const TBD_MICROCOPY: Record<string, string> = {
  "champion-prize": "Nominal atau trofi untuk Juara Umum 1–3 dan Pelajar 1–3 sedang difinalkan.",
  "race-pack": "Isi final jersey, BIB warna per kategori, goodie bag, serta kotak centang refreshment dan medali sedang dikunci.",
};

export default function BenefitCard({ benefit }: { benefit: Benefit }) {
  const Icon = ICONS[benefit.icon] ?? BadgeCheck;
  const ready = benefit.status === "ready" && hasAnnouncedValue(benefit.value);

  return (
    <article className="benefit-card card-animated group min-w-0 rounded-2xl border border-[#1E3A5F] bg-[#0E1534]/80 p-5 shadow-[0_18px_45px_rgba(0,0,0,0.18)] backdrop-blur-md transition-[border-color,box-shadow,transform] duration-300 hover:border-[#00E5FF]/45 hover:shadow-[0_20px_55px_rgba(0,229,255,0.10)] sm:p-6">
      <div className="benefit-icon mb-5 flex size-12 items-center justify-center rounded-full border border-[#00E5FF]/25 bg-gradient-to-br from-[#00E5FF]/20 via-[#4A4FFF]/15 to-[#8B00FF]/25 text-[#5CEBFF] shadow-[0_0_24px_rgba(0,229,255,0.12)] transition-transform duration-300 group-hover:scale-105 group-hover:rotate-3">
        <Icon size={22} strokeWidth={1.9} aria-hidden="true" />
      </div>
      <h3 className="mb-3 text-base font-bold text-white sm:text-lg" style={{ fontFamily: "Orbitron, sans-serif" }}>
        {benefit.title}
      </h3>
      {ready ? (
        <p className="text-sm leading-6 text-[#B8C7DE]">{benefit.value}</p>
      ) : (
        <TbdBadge microcopy={TBD_MICROCOPY[benefit.id] ?? "Detail final sedang disiapkan panitia."} className="w-full" />
      )}
    </article>
  );
}
