import { Calendar, Flag } from "lucide-react";
import AnimatedSectionTitle from "@/components/AnimatedSectionTitle";

const events = [
  { date: "1 Mei 2026", title: "Pembukaan Pendaftaran", desc: "Pendaftaran Early Bird dibuka untuk kategori Run 5K.", color: "#00E5FF", done: true },
  { date: "31 Mei 2026", title: "Batas Early Bird", desc: "Harga spesial early bird berakhir. Daftar sebelum kehabisan!", color: "#8B00FF", done: false },
  { date: "14 Juni 2026", title: "Batas Pendaftaran Normal", desc: "Pendaftaran reguler resmi ditutup pada pukul 23:59 WIB.", color: "#FF006E", done: false },
  { date: "17 Juni 2026", title: "Pengumuman BIB Number", desc: "Nomor BIB peserta diumumkan via email & website.", color: "#FF8C00", done: false },
  { date: "20–21 Juni 2026", title: "Pengambilan Race Pack", desc: "Ambil jersey, bib, & perlengkapan di lokasi yang ditentukan.", color: "#FFD700", done: false },
  { date: "22 Juni 2026", title: "HARI H — FUTURISTIC RUN 2026", desc: "Start pukul 05:00 WIB. Run The Future, Shine The Night! 🏁", color: "#00E5FF", done: false, isLast: true },
];

export default function TimelineSection() {
  return (
    <section id="timeline" className="section-reveal relative py-24 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-[#0A0E27] via-[#0F1535] to-[#0A0E27]" />

      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="section-reveal-delay-1 text-center mb-16">
          <div className="badge-neon inline-block mb-4">JADWAL</div>
          <AnimatedSectionTitle text="TIMELINE EVENT" className="text-4xl sm:text-5xl font-black mb-4" />
          <div className="w-24 h-1 mx-auto rounded-full bg-gradient-to-r from-[#00E5FF] to-[#FF006E]" />
        </div>

        <div className="relative">
          {/* Center line */}
          <div className="absolute left-6 sm:left-1/2 top-0 bottom-0 w-px sm:-translate-x-1/2 timeline-line opacity-30" />

          <div className="stagger-list space-y-8">
            {events.map((ev, i) => {
              const isRight = i % 2 === 0;
              return (
                <div
                  key={i}
                  className={`relative flex items-center gap-6 sm:gap-0 ${
                    isRight ? "sm:flex-row" : "sm:flex-row-reverse"
                  }`}
                >
                  {/* Card */}
                  <div className={`flex-1 ${isRight ? "sm:pr-10 sm:text-right" : "sm:pl-10"} pl-14 sm:pl-0`}>
                    <div
                      className={`card-animated glass-card p-5 rounded-xl border transition-all duration-300 hover:scale-[1.02] ${
                        ev.isLast ? "border-[#00E5FF]/50 glow-cyan" : "border-[#1E3A5F] hover:border-opacity-60"
                      }`}
                      style={!ev.isLast ? { borderColor: `${ev.color}22` } : undefined}
                    >
                      <div className="flex items-center gap-2 mb-1" style={isRight ? { justifyContent: "flex-end" } : {}}>
                        <Calendar size={12} style={{ color: ev.color }} />
                        <span className="text-xs font-semibold" style={{ color: ev.color, fontFamily: "Orbitron, sans-serif" }}>
                          {ev.date}
                        </span>
                      </div>
                      <h4 className="text-white font-bold mb-1 flex items-center gap-2" style={isRight ? { justifyContent: "flex-end" } : {}}>
                        {ev.isLast && <Flag size={14} style={{ color: ev.color }} />}
                        {ev.title}
                      </h4>
                      <p className="text-[#B0C4DE] text-sm">{ev.desc}</p>
                    </div>
                  </div>

                  {/* Dot */}
                  <div
                    className="motion-glow absolute left-6 sm:left-1/2 sm:-translate-x-1/2 w-5 h-5 rounded-full border-2 border-[#0A0E27] flex items-center justify-center flex-shrink-0 z-10"
                    style={{
                      background: ev.done ? ev.color : `${ev.color}33`,
                      borderColor: ev.color,
                      boxShadow: `0 0 12px ${ev.color}80`,
                    }}
                  >
                    {ev.done && <div className="w-2 h-2 rounded-full bg-white" />}
                  </div>

                  {/* Right side spacer */}
                  <div className="hidden sm:flex flex-1" />
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
