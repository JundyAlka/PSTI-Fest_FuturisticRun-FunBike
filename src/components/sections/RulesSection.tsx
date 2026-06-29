"use client";
import { useState } from "react";
import { ChevronDown, Shield } from "lucide-react";
import AnimatedSectionTitle from "@/components/AnimatedSectionTitle";
import TbdBadge, { hasAnnouncedValue } from "@/components/ui/TbdBadge";

function parseSettingList(value: string | undefined) {
  if (!hasAnnouncedValue(value)) return null;
  try {
    const parsed = JSON.parse(value as string);
    if (Array.isArray(parsed)) return parsed.map(String).filter(Boolean);
  } catch {
    return (value as string).split(/\r?\n|;/).map((item) => item.trim()).filter(Boolean);
  }
  return null;
}

export default function RulesSection({ settings = {} }: { settings?: Record<string, string> }) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const settingRules = parseSettingList(settings.rules);
  const rules = settingRules?.map((content, index) => ({
    title: index === 0 ? "Ketentuan Resmi" : `Ketentuan ${index + 1}`,
    content,
  })) ?? [];

  return (
    <section id="rules" className="section-reveal relative py-6 sm:py-10 overflow-hidden bg-[#0A0E27]">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="section-reveal-delay-1 text-center mb-10">
          <div className="badge-neon inline-block mb-4">KETENTUAN</div>
          <AnimatedSectionTitle text="PERATURAN" className="text-4xl sm:text-5xl font-black mb-4" />
          <div className="w-24 h-1 mx-auto rounded-full bg-gradient-to-r from-[#00E5FF] to-[#FF006E]" />
        </div>

        {rules.length === 0 ? (
          <div className="card-animated mx-auto max-w-xl rounded-2xl border border-[#1E3A5F] bg-[#0B1030]/80 p-8 text-center">
            <div className="flex justify-center">
              <TbdBadge
                label="Sedang dipersiapkan"
                microcopy="Ketentuan resmi akan diumumkan melalui website dan kanal resmi panitia."
                className="max-w-md"
              />
            </div>
          </div>
        ) : (
        <div className="stagger-list space-y-3">
          {rules.map((rule, i) => (
            <div
              key={i}
              className="card-animated glass-card rounded-xl border border-[#1E3A5F] overflow-hidden transition-all duration-300 hover:border-[#00E5FF]/30"
            >
              <button
                onClick={() => setOpenIndex(openIndex === i ? null : i)}
                className="w-full flex items-center justify-between p-5 text-left cursor-pointer group"
              >
                <div className="flex items-center gap-3">
                  <div
                    className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                    style={{ background: "rgba(0,229,255,0.1)", border: "1px solid rgba(0,229,255,0.2)" }}
                  >
                    <Shield size={14} className="text-[#00E5FF]" />
                  </div>
                  <span className="text-white font-semibold text-sm sm:text-base group-hover:text-[#00E5FF] transition-colors">
                    {rule.title}
                  </span>
                </div>
                <ChevronDown
                  size={18}
                  className={`text-[#00E5FF] flex-shrink-0 transition-transform duration-300 ${
                    openIndex === i ? "rotate-180" : ""
                  }`}
                />
              </button>
              <div className={`accordion-content ${openIndex === i ? "open" : ""}`}>
                <div className="px-5 pb-5">
                  <div className="pl-11 text-[#B0C4DE] text-sm leading-relaxed border-l-2 border-[#00E5FF]/30 ml-4">
                    {rule.content}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
        )}
      </div>
    </section>
  );
}
