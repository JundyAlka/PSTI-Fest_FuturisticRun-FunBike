import { CalendarDays, Clock3, Gift, MapPinned, Music, ShieldCheck } from "lucide-react";
import AnimatedSectionTitle from "@/components/AnimatedSectionTitle";
import RundownTimeline from "@/components/ui/RundownTimeline";
import RundownActions from "@/components/ui/RundownActions";
import { EVENTS } from "@/content/events";
import { formatEventDate } from "@/lib/eventDate";

const event = EVENTS["futuristic-run"];

const technicalInfo = [
  { icon: Music, label: "Hiburan", value: "Band SUNFLOW & Ollsame di area finish.", color: "#00E5FF" },
  { icon: Gift, label: "Doorprize", value: "Doorprize pembelian panitia + dukungan sponsor, diundi saat acara.", color: "#FFD700" },
  { icon: MapPinned, label: "Status Rute", value: "Rute 5K start/finish Alun-Alun Purworejo, dengan peta lokasi dan arahan marshal.", color: "#FF006E" },
  { icon: ShieldCheck, label: "Koordinasi", value: "Pelaksanaan dikoordinasikan bersama PLF & ICF, tim medis, dan marshal panitia.", color: "#8B00FF" },
];

export default function TimelineSection({ eventDate }: { eventDate: string }) {
  return (
    <section id="timeline" className="section-reveal relative overflow-hidden py-6 sm:py-10">
      <div className="absolute inset-0 bg-gradient-to-b from-[#0A0E27] via-[#070A20] to-[#0A0E27]" />
      <div
        className="absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(0,229,255,1) 1px, transparent 1px), linear-gradient(90deg, rgba(139,0,255,1) 1px, transparent 1px)",
          backgroundSize: "48px 48px",
        }}
      />

      <div className="relative z-10 mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <div className="section-reveal-delay-1 mb-8 text-center sm:mb-10">
          <div className="badge-neon mb-4 inline-block">DETAIL ACARA</div>
          <AnimatedSectionTitle text="SUSUNAN ACARA" className="mb-4 text-4xl font-black sm:text-5xl" />
          <div className="mx-auto mb-5 flex max-w-2xl flex-wrap justify-center gap-2 text-sm">
            <span className="inline-flex min-h-9 items-center gap-2 rounded-full border border-[#00E5FF]/20 bg-[#00E5FF]/[0.06] px-3 text-[#D7E8FF]">
              <CalendarDays size={15} className="text-[#00E5FF]" />
              {formatEventDate(eventDate)}
            </span>
            <span className="inline-flex min-h-9 items-center gap-2 rounded-full border border-[#8B00FF]/25 bg-[#8B00FF]/[0.07] px-3 text-[#D7E8FF]">
              <Clock3 size={15} className="text-[#C084FC]" /> {event.eventTime}
            </span>
          </div>
          <p className="mx-auto max-w-3xl text-sm leading-7 text-[#B0C4DE] sm:text-base">
            {event.deskripsiPelaksanaan}
          </p>
          <div className="mx-auto mt-5 h-1 w-24 rounded-full bg-gradient-to-r from-[#00E5FF] to-[#FF006E]" />
        </div>

        <RundownTimeline items={event.rundown} theme="run" eventDate={eventDate} />

        <RundownActions
          items={event.rundown}
          eventName={event.name}
          eventDate={eventDate}
          theme="run"
        />

        <div className="mt-12 sm:mt-16">
          <h3 className="mb-5 text-center text-xl font-black text-white sm:text-2xl" style={{ fontFamily: "Orbitron, sans-serif" }}>
            INFO TEKNIS PELAKSANAAN
          </h3>
          <div className="grid gap-4 sm:grid-cols-2">
            {technicalInfo.map(({ icon: Icon, label, value, color }) => (
              <article key={label} className="card-animated rounded-2xl border border-[#1E3A5F] bg-[#0B1030]/90 p-5">
                <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl border" style={{ borderColor: `${color}55`, background: `${color}16` }}>
                  <Icon size={18} style={{ color }} />
                </div>
                <p className="text-xs font-black uppercase tracking-[0.14em] text-[#B0C4DE]">{label}</p>
                <p className="mt-2 text-sm font-semibold leading-6 text-white">{value}</p>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
