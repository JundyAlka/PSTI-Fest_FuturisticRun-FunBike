"use client";
import { useState } from "react";
import { ChevronDown, HelpCircle } from "lucide-react";
import TbdBadge, { hasAnnouncedValue } from "@/components/ui/TbdBadge";

type FaqItem = { q: string; a: string };

function parseFaqSetting(value: string | undefined): FaqItem[] | null {
  if (!hasAnnouncedValue(value)) return null;
  try {
    const parsed = JSON.parse(value as string);
    if (Array.isArray(parsed)) {
      return parsed
        .map((item) => ({ q: String(item.q ?? item.question ?? ""), a: String(item.a ?? item.answer ?? "") }))
        .filter((item) => item.q && item.a);
    }
  } catch {
    return (value as string)
      .split(/\r?\n/)
      .map((line) => {
        const [question, ...answer] = line.split("|");
        return { q: question?.trim() ?? "", a: answer.join("|").trim() };
      })
      .filter((item) => item.q && item.a);
  }
  return null;
}

export default function FunBikeFaq({ settings = {} }: { settings?: Record<string, string> }) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const items = parseFaqSetting(settings.faq);

  if (!items?.length) {
    return (
      <div className="card-animated mx-auto rounded-2xl border border-gray-100 bg-white p-8 text-center shadow-sm">
        <div className="mb-3 flex justify-center">
          <TbdBadge className="border-[#FF6B2C]/20 bg-[#FF6B2C]/10 text-gray-700" />
        </div>
        <p className="text-sm leading-6 text-gray-500">
          FAQ resmi akan tampil setelah admin mengisi key <span className="font-mono text-[#FF6B2C]">faq</span> di settings.
        </p>
      </div>
    );
  }

  return (
    <div className="stagger-list space-y-3">
      {items.map((item, i) => (
        <div
          key={item.q}
          className="card-animated glass-card-light overflow-hidden rounded-xl border border-gray-100 transition-all duration-300 hover:border-[#FF6B2C]/30"
        >
          <button
            onClick={() => setOpenIndex(openIndex === i ? null : i)}
            className="group flex w-full cursor-pointer items-center justify-between p-5 text-left"
          >
            <div className="flex items-center gap-3">
              <div
                className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg"
                style={{
                  background: "rgba(255,107,44,0.1)",
                  border: "1px solid rgba(255,107,44,0.2)",
                }}
              >
                <HelpCircle size={14} className="text-[#FF6B2C]" />
              </div>
              <span className="pr-4 text-sm font-medium text-gray-900 transition-colors group-hover:text-[#FF6B2C] sm:text-base">
                {item.q}
              </span>
            </div>
            <ChevronDown
              size={18}
              className={`flex-shrink-0 text-[#FF6B2C] transition-transform duration-300 ${openIndex === i ? "rotate-180" : ""}`}
            />
          </button>
          <div className={`accordion-content ${openIndex === i ? "open" : ""}`}>
            <div className="px-5 pb-5">
              <div className="ml-4 border-l-2 border-[#FF6B2C]/30 pl-11 text-sm leading-relaxed text-gray-600">
                {item.a}
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
