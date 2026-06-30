"use client";
import { useState } from "react";
import { ChevronDown, Shield, CheckCircle2, BookOpen, Layers } from "lucide-react";
import AnimatedSectionTitle from "@/components/AnimatedSectionTitle";
import { hasAnnouncedValue } from "@/components/ui/TbdBadge";
import { EVENTS } from "@/content/events";

function parseSettingList(value: string | undefined): string[] | null {
  if (!hasAnnouncedValue(value)) return null;
  try {
    const parsed = JSON.parse(value as string);
    if (Array.isArray(parsed)) return parsed.map(String).filter(Boolean);
  } catch {
    return (value as string).split(/\r?\n|;/).map((item) => item.trim()).filter(Boolean);
  }
  return null;
}

interface RuleParsed {
  numberBadge: string;
  title: string;
  points: string[];
}

function parseRuleString(raw: string, idx: number): RuleParsed {
  const numberBadge = (idx + 1).toString().padStart(2, "0");
  if (raw.includes("|")) {
    const [titlePart, ...bodyParts] = raw.split("|");
    const title = titlePart.trim().replace(/^\d+[\.\-\)]\s*/, "");
    const bodyText = bodyParts.join("|").trim();
    const points = bodyText
      .split(/(?:•|;|\.\s+(?=[A-Z]))/)
      .map((p) => p.trim())
      .filter((p) => p.length > 3);
    return {
      numberBadge,
      title: title || `Ketentuan ${numberBadge}`,
      points: points.length > 0 ? points : [bodyText],
    };
  }
  if (raw.includes(":")) {
    const [titlePart, ...bodyParts] = raw.split(":");
    const title = titlePart.trim().replace(/^\d+[\.\-\)]\s*/, "");
    const bodyText = bodyParts.join(":").trim();
    const points = bodyText
      .split(/(?:•|;|\.\s+(?=[A-Z]))/)
      .map((p) => p.trim())
      .filter((p) => p.length > 3);
    return {
      numberBadge,
      title: title || `Ketentuan ${numberBadge}`,
      points: points.length > 0 ? points : [bodyText],
    };
  }
  return {
    numberBadge,
    title: idx === 0 ? "Ketentuan Umum & Registrasi" : `Ketentuan Pelaksanaan ${numberBadge}`,
    points: [raw],
  };
}

export default function RulesSection({
  settings = {},
  theme = "run",
}: {
  settings?: Record<string, string>;
  theme?: "run" | "bike";
}) {
  const [openIndices, setOpenIndices] = useState<Set<number>>(new Set([0]));
  const isBike = theme === "bike";

  const settingRules = parseSettingList(settings.rules);
  const fallbackRules = isBike ? EVENTS["fun-bike"].rules : EVENTS["futuristic-run"].rules;
  const rawRules = settingRules ?? fallbackRules;
  const parsedRules = rawRules.map((r, i) => parseRuleString(r, i));

  const allOpen = openIndices.size === parsedRules.length;

  const toggleIndex = (idx: number) => {
    const next = new Set(openIndices);
    if (next.has(idx)) {
      next.delete(idx);
    } else {
      next.add(idx);
    }
    setOpenIndices(next);
  };

  const toggleAll = () => {
    if (allOpen) {
      setOpenIndices(new Set());
    } else {
      setOpenIndices(new Set(parsedRules.map((_, i) => i)));
    }
  };

  return (
    <section
      id="rules"
      className={`section-reveal relative py-12 sm:py-20 overflow-hidden ${
        isBike
          ? "bg-[linear-gradient(180deg,#FFFFFF_0%,#FFF8F0_50%,#FFF7ED_100%)] text-gray-900"
          : "bg-[#0A0E27] text-white"
      }`}
    >
      {/* Background Accents */}
      <div
        className={`pointer-events-none absolute -top-40 left-1/2 h-96 w-96 -translate-x-1/2 rounded-full blur-3xl opacity-20 ${
          isBike ? "bg-[#FF6B2C]" : "bg-[#00E5FF]"
        }`}
      />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="section-reveal-delay-1 text-center mb-12">
          <div className={isBike ? "badge-sunrise inline-block mb-4" : "badge-neon inline-block mb-4"}>
            REGULASI & ATURAN
          </div>
          <AnimatedSectionTitle
            text="KETENTUAN RESMI"
            disableGradient={isBike}
            className={`text-4xl sm:text-5xl font-black mb-4 ${
              isBike ? "text-gray-900" : "text-white"
            }`}
          />
          <p
            className={`max-w-2xl mx-auto text-sm sm:text-base leading-relaxed ${
              isBike ? "text-gray-600" : "text-[#B0C4DE]"
            }`}
          >
            {isBike
              ? "Peraturan penting dan tata tertib Fun Ride demi kenyamanan, keselamatan, serta kebersamaan seluruh peleton."
              : "Regulasi resmi pendaftaran, kesiapan fisik, dan tata tertib rute 5K demi kenyamanan dan keselamatan pelari."}
          </p>
          <div
            className={`w-28 h-1.5 mx-auto rounded-full mt-5 ${
              isBike
                ? "bg-gradient-to-r from-[#FF6B2C] via-[#F59E0B] to-[#0284C7]"
                : "bg-gradient-to-r from-[#00E5FF] to-[#FF006E]"
            }`}
          />
        </div>

        {/* Action bar */}
        <div className="flex items-center justify-between mb-6 px-1">
          <div className="flex items-center gap-2 text-xs font-bold tracking-wider uppercase opacity-75">
            <BookOpen size={16} className={isBike ? "text-[#FF6B2C]" : "text-[#00E5FF]"} />
            <span>Total {parsedRules.length} Poin Ketentuan</span>
          </div>
          <button
            onClick={toggleAll}
            className={`flex items-center gap-2 text-xs sm:text-sm font-bold px-4 py-2 rounded-full transition-all cursor-pointer ${
              isBike
                ? "bg-orange-100 text-[#C2410C] hover:bg-orange-200"
                : "bg-[#1E3A5F] text-[#00E5FF] hover:bg-[#00E5FF]/20 border border-[#00E5FF]/30"
            }`}
          >
            <Layers size={14} />
            {allOpen ? "Tutup Semua" : "Buka Semua"}
          </button>
        </div>

        {/* Rules Grid / Stagger List */}
        <div className="stagger-list space-y-4">
          {parsedRules.map((rule, i) => {
            const isOpen = openIndices.has(i);
            return (
              <div
                key={i}
                className={`card-animated rounded-2xl border transition-all duration-300 overflow-hidden ${
                  isBike
                    ? isOpen
                      ? "bg-white border-[#FF6B2C] shadow-lg ring-1 ring-[#FF6B2C]/20"
                      : "bg-white/80 border-orange-100 hover:border-[#FF6B2C]/40 shadow-sm"
                    : isOpen
                    ? "glass-card border-[#00E5FF] shadow-[0_0_25px_rgba(0,229,255,0.15)] bg-[#0D1336]"
                    : "glass-card border-[#1E3A5F] hover:border-[#00E5FF]/40"
                }`}
              >
                <button
                  onClick={() => toggleIndex(i)}
                  className="w-full flex items-center justify-between p-5 sm:p-6 text-left cursor-pointer group gap-4"
                >
                  <div className="flex items-center gap-4">
                    <div
                      className={`w-10 h-10 sm:w-11 sm:h-11 rounded-xl flex items-center justify-center font-black text-sm sm:text-base flex-shrink-0 transition-transform group-hover:scale-105 ${
                        isBike
                          ? isOpen
                            ? "bg-gradient-to-br from-[#FF6B2C] to-[#F59E0B] text-white shadow-md"
                            : "bg-orange-50 text-[#FF6B2C] border border-orange-200"
                          : isOpen
                          ? "bg-gradient-to-br from-[#00E5FF] to-[#8B00FF] text-[#0A0E27] shadow-[0_0_15px_rgba(0,229,255,0.4)]"
                          : "bg-[#141E46] text-[#00E5FF] border border-[#00E5FF]/30"
                      }`}
                      style={{ fontFamily: "Orbitron, sans-serif" }}
                    >
                      {rule.numberBadge}
                    </div>

                    <div>
                      <h3
                        className={`font-black text-base sm:text-lg transition-colors leading-snug ${
                          isBike
                            ? isOpen
                              ? "text-[#C2410C]"
                              : "text-gray-900 group-hover:text-[#FF6B2C]"
                            : isOpen
                            ? "text-[#00E5FF]"
                            : "text-white group-hover:text-[#00E5FF]"
                        }`}
                      >
                        {rule.title}
                      </h3>
                      <p
                        className={`text-xs mt-0.5 ${
                          isBike ? "text-gray-500" : "text-gray-400"
                        }`}
                      >
                        {rule.points.length} poin ketetapan
                      </p>
                    </div>
                  </div>

                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 transition-transform duration-300 ${
                      isOpen ? "rotate-180" : ""
                    } ${
                      isBike
                        ? "bg-orange-50 text-[#FF6B2C]"
                        : "bg-white/5 text-[#00E5FF]"
                    }`}
                  >
                    <ChevronDown size={18} />
                  </div>
                </button>

                {isOpen && (
                  <div className="px-5 pb-6 sm:px-6 sm:pb-7 pt-1 border-t border-dashed transition-all duration-300 border-gray-500/15">
                    <ul className="space-y-3 mt-3">
                      {rule.points.map((pt, pIdx) => (
                        <li key={pIdx} className="flex items-start gap-3">
                          <CheckCircle2
                            size={18}
                            className={`mt-0.5 flex-shrink-0 ${
                              isBike ? "text-[#FF6B2C]" : "text-[#00E5FF]"
                            }`}
                          />
                          <span
                            className={`text-sm sm:text-base leading-relaxed font-medium ${
                              isBike ? "text-gray-700" : "text-[#B0C4DE]"
                            }`}
                          >
                            {pt}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
