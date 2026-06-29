import { MapPin, RadioTower, ShieldCheck, Waves } from "lucide-react";
import AnimatedSectionTitle from "@/components/AnimatedSectionTitle";
import TbdBadge, { hasAnnouncedValue } from "@/components/ui/TbdBadge";
import { EVENTS } from "@/content/events";

const event = EVENTS["futuristic-run"];

export default function RacepackSection({ racepackLocation }: { racepackLocation?: string | null }) {
  const location = hasAnnouncedValue(racepackLocation) ? racepackLocation : null;

  return (
    <section id="racepack" className="section-reveal relative overflow-hidden py-6 sm:py-10">
      <div className="absolute inset-0 bg-gradient-to-b from-[#080C20] via-[#0A0E27] to-[#070A20]" />

      <div className="relative z-10 mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="mb-10 text-center">
          <div className="badge-neon mb-4 inline-block">RACEPACK & SUPPORT</div>
          <AnimatedSectionTitle text="PENGAMBILAN RACEPACK" className="mb-4 text-4xl font-black sm:text-5xl" />
          <p className="mx-auto max-w-2xl text-sm leading-6 text-[#B0C4DE] sm:text-base">
            Informasi teknis racepack, water station, pacer, dan marshal untuk lari malam 5K.
          </p>
        </div>

        <div className="grid gap-5 lg:grid-cols-[0.95fr_1.05fr]">
          <div className="card-animated rounded-2xl border border-[#00E5FF]/25 bg-[#08102D]/90 p-6">
            <h3 className="mb-5 text-xl font-black text-white" style={{ fontFamily: "Orbitron, sans-serif" }}>
              Jadwal Ambil
            </h3>
            <div className="space-y-4">
              <div className="rounded-xl border border-[#1E3A5F] bg-white/[0.03] p-4">
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#00E5FF]">Tanggal</p>
                <p className="mt-1 text-lg font-bold text-white">30-31 Juli</p>
              </div>
              <div className="rounded-xl border border-[#1E3A5F] bg-white/[0.03] p-4">
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#00E5FF]">Jam</p>
                <p className="mt-1 text-lg font-bold text-white">08.00-16.00 WIB</p>
              </div>
              <div className="rounded-xl border border-[#1E3A5F] bg-white/[0.03] p-4">
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#00E5FF]">Lokasi</p>
                <div className="mt-2 flex items-center gap-2 text-white">
                  <MapPin size={16} className="text-[#00E5FF]" />
                  {location ? <span className="font-bold">{location}</span> : <TbdBadge />}
                </div>
              </div>
            </div>
          </div>

          <div className="stagger-list grid gap-4 sm:grid-cols-2">
            {[
              { icon: Waves, label: "Water station", value: "Dekat Caramel", color: "#00E5FF" },
              { icon: RadioTower, label: "Pacer", value: "Dari PASI", color: "#FFD700" },
              { icon: ShieldCheck, label: "Marshal", value: "Panitia event", color: "#8B00FF" },
              { icon: MapPin, label: "Isi Racepack", value: event.racepack.filter((item) => !item.includes("Pengambilan")).slice(0, 4).join(", "), color: "#FF006E" },
            ].map(({ icon: Icon, label, value, color }) => (
              <div key={label} className="card-animated rounded-2xl border border-[#1E3A5F] bg-[#0B1030]/90 p-5">
                <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl border" style={{ borderColor: `${color}55`, background: `${color}18` }}>
                  <Icon size={19} style={{ color }} />
                </div>
                <p className="text-xs font-black uppercase tracking-[0.18em] text-[#B0C4DE]">{label}</p>
                <p className="mt-2 text-sm font-semibold leading-6 text-white">{value}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
