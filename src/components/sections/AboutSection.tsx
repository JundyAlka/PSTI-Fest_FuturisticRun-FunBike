import { CheckCircle, Trophy, Medal, Tag, Coffee, Music } from "lucide-react";
import AnimatedStatNumber from "@/components/AnimatedStatNumber";
import AnimatedSectionTitle from "@/components/AnimatedSectionTitle";

const benefits = [
  { icon: CheckCircle, text: "Sertifikat digital peserta" },
  { icon: Trophy, text: "Jersey running eksklusif" },
  { icon: Medal, text: "Finisher medal" },
  { icon: Tag, text: "Race bib bernomor" },
  { icon: Coffee, text: "Snack & minuman di checkpoint" },
  { icon: Music, text: "Hiburan & atraksi di rute" },
];

export default function AboutSection() {
  return (
    <section id="about" className="section-reveal relative py-24 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-[#0A0E27] via-[#0F1535] to-[#0A0E27]" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section label */}
        <div className="text-center mb-16">
          <div className="badge-neon inline-block mb-4">TENTANG EVENT</div>
          <AnimatedSectionTitle text="TENTANG FUTURISTIC RUN" className="text-4xl sm:text-5xl font-black mb-4" />
          <div className="w-24 h-1 mx-auto rounded-full bg-gradient-to-r from-[#00E5FF] to-[#8B00FF]" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Text */}
          <div className="slide-in-left">
            <p className="text-[#B0C4DE] text-lg leading-relaxed mb-6">
              <span className="text-white font-semibold">Futuristic RUN 2026</span> adalah event lari bertemakan
              futuristik yang diselenggarakan oleh{" "}
              <span className="text-[#00E5FF] font-semibold">Himatekno Universitas Muhammadiyah Purworejo</span>. Berlari di bawah sinar neon,
              musik energetik, dan atmosfer masa depan yang memukau di bumi Purworejo.
            </p>
            <p className="text-[#B0C4DE] leading-relaxed mb-8">
              Rasakan sensasi berlari menembus waktu dengan kostum futuristik, lampu LED di jalur, dan pengalaman yang
              tidak akan terlupakan. Bergabunglah bersama ratusan runner dan jadilah bagian dari legenda.
            </p>

            <div className="stagger-list grid grid-cols-1 sm:grid-cols-2 gap-3">
              {benefits.map((b, i) => (
                <div
                  key={i}
                  className="card-animated flex items-center gap-3 glass-card p-3 rounded-xl border border-[#1E3A5F] hover:border-[#00E5FF]/40 transition-all duration-300 group"
                >
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#00E5FF]/20 to-[#2A4FFF]/20 flex items-center justify-center flex-shrink-0 group-hover:from-[#00E5FF]/40 transition-all">
                    <b.icon size={16} className="text-[#00E5FF]" />
                  </div>
                  <span className="text-sm text-[#B0C4DE] group-hover:text-white transition-colors">{b.text}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Stats visual */}
          <div className="stagger-list slide-in-right grid grid-cols-2 gap-4">
            {[
              { value: "200", label: "Kuota Peserta", sub: "Run 5K", color: "#00E5FF" },
              { value: "5K", label: "Jarak Tempuh", sub: "Satu kategori", color: "#8B00FF" },
              { value: "6+", label: "Checkpoint", sub: "Sepanjang rute", color: "#FF006E" },
              { value: "2026", label: "Tahun Event", sub: "Himatekno UMP", color: "#FF8C00" },
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
      </div>
    </section>
  );
}
