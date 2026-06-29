import { Medal, Trophy } from "lucide-react";
import AnimatedSectionTitle from "@/components/AnimatedSectionTitle";
import { EVENTS } from "@/content/events";
import TbdBadge, { hasAnnouncedValue } from "@/components/ui/TbdBadge";

const event = EVENTS["futuristic-run"];

export default function RunChampionsSection({ settings }: { settings: Record<string, string> }) {
  return (
    <section id="juara" className="section-reveal relative overflow-hidden py-6 sm:py-10">
      <div className="absolute inset-0 bg-[#080C20]" />
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#FFD700]/70 to-transparent" />

      <div className="relative z-10 mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <div className="mb-10 text-center">
          <div className="badge-neon mb-4 inline-block">KATEGORI JUARA</div>
          <AnimatedSectionTitle text="PODIUM FUTURISTIC RUN" className="mb-4 text-4xl font-black sm:text-5xl" />
          <p className="mx-auto max-w-2xl text-sm leading-6 text-[#B0C4DE] sm:text-base">
            Kategori pemenang final untuk Run 5K, sesuai framing notulen: umum dan pelajar.
          </p>
        </div>

        <div className="stagger-list grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {event.juara.map((champion, index) => {
            const isFirst = champion.label.endsWith("1");
            const color = isFirst ? "#FFD700" : champion.label.includes("Umum") ? "#00E5FF" : "#8B00FF";
            const prize = settings[`prize_${champion.id.replace("-", "_")}`]?.trim() || champion.prize;
            return (
              <div
                key={champion.id}
                className="card-animated rounded-2xl border border-[#1E3A5F] bg-[#0B1030]/88 p-5 transition-all duration-300 hover:-translate-y-1"
                style={{ boxShadow: `0 0 28px ${color}18` }}
              >
                <div className="mb-4 flex items-center justify-between gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl border" style={{ borderColor: `${color}55`, background: `${color}18` }}>
                    {isFirst ? <Trophy size={20} style={{ color }} /> : <Medal size={20} style={{ color }} />}
                  </div>
                  <span className="text-xs font-black tracking-[0.2em] text-[#B0C4DE]" style={{ fontFamily: "Orbitron, sans-serif" }}>
                    #{index + 1}
                  </span>
                </div>
                <h3 className="text-lg font-black text-white" style={{ fontFamily: "Orbitron, sans-serif" }}>
                  {champion.label}
                </h3>
                <div className="mt-4 border-t border-white/8 pt-4">
                  {hasAnnouncedValue(prize) ? (
                    <p className="text-sm font-semibold leading-6 text-[#D7E8FF]">{prize}</p>
                  ) : (
                    <TbdBadge microcopy="Nominal atau bentuk hadiah belum difinalkan." className="w-full" />
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
