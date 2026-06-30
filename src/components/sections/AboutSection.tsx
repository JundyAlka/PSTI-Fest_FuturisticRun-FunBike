import AnimatedStatNumber from "@/components/AnimatedStatNumber";
import AnimatedSectionTitle from "@/components/AnimatedSectionTitle";
import BenefitGrid from "@/components/ui/BenefitGrid";
import { FEST_YEAR, ORGANIZER_NAME } from "@/content/brand";
import { EVENTS, type Benefit } from "@/content/events";
import { hasAnnouncedValue } from "@/components/ui/TbdBadge";

const event = EVENTS["futuristic-run"];

const BENEFIT_SETTING_KEYS: Partial<Record<Benefit["id"], string>> = {
  "champion-prize": "benefit_prize_details",
  "race-pack": "benefit_race_pack_contents",
};

function resolveBenefits(settings: Record<string, string>): Benefit[] {
  return event.benefits.map((benefit) => {
    const settingKey = BENEFIT_SETTING_KEYS[benefit.id];
    if (!settingKey || !hasAnnouncedValue(settings[settingKey])) return benefit;
    return { ...benefit, value: settings[settingKey].trim(), status: "ready" };
  });
}

export default function AboutSection({ settings = {}, quota }: { settings?: Record<string, string>; quota?: number | null }) {
  const benefits = resolveBenefits(settings);

  return (
    <section id="about" className="section-reveal relative py-6 sm:py-10 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-[#0A0E27] via-[#0F1535] to-[#0A0E27]" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section label */}
        <div className="text-center mb-10">
          <div className="badge-neon inline-block mb-4">TENTANG EVENT</div>
          <AnimatedSectionTitle text={`TENTANG ${event.name.toUpperCase()}`} className="text-4xl sm:text-5xl font-black mb-4" />
          <div className="w-24 h-1 mx-auto rounded-full bg-gradient-to-r from-[#00E5FF] to-[#8B00FF]" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Text */}
          <div className="slide-in-left">
            <p className="text-[#B0C4DE] text-lg leading-relaxed mb-6">
              <span className="text-white font-semibold">{event.name} {FEST_YEAR}</span> adalah event lari malam bertema
              futuristik yang diselenggarakan oleh{" "}
              <span className="text-[#00E5FF] font-semibold">{ORGANIZER_NAME}</span>. Berlari di bawah sinar neon,
              musik energetik, dan atmosfer masa depan.
            </p>
            <p className="text-[#B0C4DE] leading-relaxed mb-8">
              Rasakan sensasi {event.alias} dengan visual neon, race pack, dan pengalaman komunitas yang dirancang
              untuk peserta pemula maupun runner aktif.
            </p>

          </div>

          {/* Stats visual */}
          <div className="stagger-list slide-in-right grid grid-cols-2 gap-4">
            {[
              { value: String(quota ?? 200), label: "Kuota Peserta", sub: "Run 5K", color: "#00E5FF" },
              { value: "5K", label: "Jarak Tempuh", sub: "Satu kategori", color: "#8B00FF" },
              { value: "6+", label: "Checkpoint", sub: "Sepanjang rute", color: "#FF006E" },
              { value: FEST_YEAR, label: "Tahun Event", sub: ORGANIZER_NAME, color: "#FF8C00" },
            ].map((stat, i) => (
              <div
                key={i}
                className="card-animated glass-card p-6 rounded-2xl text-center border border-[#1E3A5F] hover:border-opacity-60 transition-all duration-300 group"
                style={{ borderColor: `${stat.color}22` }}
              >
                <AnimatedStatNumber value={stat.value} color={stat.color} />
                <div className="text-white font-semibold text-sm mb-0.5">{stat.label}</div>
                <div className="text-[#B0C4DE] text-xs">{stat.sub}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-10 sm:mt-12">
          <div className="mb-5">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#00E5FF]">Fasilitas Peserta</p>
            <h3 className="mt-2 text-2xl font-black text-white sm:text-3xl" style={{ fontFamily: "Orbitron, sans-serif" }}>
              Benefit yang kamu dapatkan
            </h3>
          </div>
          <BenefitGrid benefits={benefits} />
        </div>
      </div>
    </section>
  );
}
