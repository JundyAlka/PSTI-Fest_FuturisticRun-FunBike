import { Award, Trophy } from "lucide-react";
import AnimatedSectionTitle from "@/components/AnimatedSectionTitle";
import TbdBadge from "@/components/ui/TbdBadge";
import {
  formatPrizeValue,
  PRIZES,
  PRIZE_FIELDS,
  resolvedPrizeValue,
} from "@/data/prizes";

const headers = {
  juara1: "Juara I",
  juara2: "Juara II",
  juara3: "Juara III",
  harapan: "Harapan 1 & 2",
} as const;

export default function RunChampionsSection({ settings }: { settings: Record<string, string> }) {
  const rows = PRIZES.map((prize) => ({
    ...prize,
    values: Object.fromEntries(PRIZE_FIELDS.map((field) => [field, resolvedPrizeValue(prize, field, settings)])),
  }));
  const totalPool = rows.reduce((total, row) => (
    total + PRIZE_FIELDS.reduce((subtotal, field) => {
      const value = row.values[field];
      return subtotal + (typeof value === "number" ? value : 0);
    }, 0)
  ), 0);

  return (
    <section id="hadiah" className="section-reveal relative overflow-hidden py-8 sm:py-14">
      <div className="absolute inset-0 bg-[#080C20]" />
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#FFD700]/70 to-transparent" />

      <div className="relative z-10 mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="mb-8 text-center sm:mb-10">
          <div className="badge-neon mb-4 inline-block">HADIAH FUTURISTIC RUN</div>
          <AnimatedSectionTitle text="TABEL HADIAH PEMENANG" className="mb-4 text-4xl font-black sm:text-5xl" />
          <p className="mx-auto max-w-2xl text-sm leading-6 text-[#B0C4DE] sm:text-base">
            Nominal final kategori Umum dan SMP. Alokasi hadiah kategori SD akan diumumkan setelah ditetapkan panitia.
          </p>
        </div>

        <div className="mb-6 flex items-center justify-center gap-3 rounded-2xl border border-[#FFD700]/30 bg-[#FFD700]/[0.07] px-5 py-4 text-center">
          <Trophy size={22} className="shrink-0 text-[#FFD700]" />
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#B0C4DE]">Total Prize Pool</p>
            <p className="mt-1 text-2xl font-black text-[#FFD700] sm:text-3xl" style={{ fontFamily: "Orbitron, sans-serif" }}>
              {formatPrizeValue(totalPool)}
            </p>
          </div>
        </div>

        <div className="overflow-x-auto rounded-2xl border border-[#1E3A5F] bg-[#0B1030]/90 shadow-[0_0_36px_rgba(255,215,0,0.08)]">
          <table className="w-full min-w-[760px] border-collapse text-left">
            <thead>
              <tr className="border-b border-[#FFD700]/25 bg-[#FFD700]/[0.06]">
                <th className="px-5 py-4 text-xs font-black uppercase tracking-[0.14em] text-[#FFD700]">Kategori</th>
                {PRIZE_FIELDS.map((field) => (
                  <th key={field} className="px-4 py-4 text-center text-xs font-black uppercase tracking-[0.1em] text-[#FFD700]">
                    {headers[field]}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr key={row.kategori} className="border-b border-white/[0.06] last:border-b-0 hover:bg-white/[0.025]">
                  <th className="px-5 py-4 text-sm font-black text-white">
                    <span className="inline-flex items-center gap-2"><Award size={16} className="text-[#00E5FF]" />{row.kategori}</span>
                  </th>
                  {PRIZE_FIELDS.map((field) => {
                    const value = row.values[field];
                    return (
                      <td key={field} className="px-4 py-4 text-center text-sm font-semibold text-[#D7E8FF]">
                        {value === null ? <TbdBadge className="border-[#FFD700]/20 bg-[#FFD700]/5 text-[#D7E8FF]" /> : formatPrizeValue(value)}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
