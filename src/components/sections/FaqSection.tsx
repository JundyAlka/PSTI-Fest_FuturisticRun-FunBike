"use client";
import { useState } from "react";
import { ChevronDown, HelpCircle } from "lucide-react";
import AnimatedSectionTitle from "@/components/AnimatedSectionTitle";
import TbdBadge, { hasAnnouncedValue } from "@/components/ui/TbdBadge";
import { FEST_NAME } from "@/content/brand";

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

export default function FaqSection({
  settings = {},
  contactPerson,
}: {
  settings?: Record<string, string>;
  contactPerson?: string | null;
}) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const faqs = parseFaqSetting(settings.faq);
  const contact = contactPerson ?? settings.contact_person;

  return (
    <section id="faq" className="section-reveal relative overflow-hidden py-6 sm:py-10">
      <div className="absolute inset-0 bg-gradient-to-b from-[#0A0E27] via-[#0F1535] to-[#0A0E27]" />

      <div className="relative z-10 mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <div className="section-reveal-delay-1 mb-10 text-center">
          <div className="badge-neon mb-4 inline-block">BANTUAN</div>
          <AnimatedSectionTitle text="FAQ" className="mb-4 text-4xl font-black sm:text-5xl" />
          <p className="text-[#B0C4DE]">Pertanyaan resmi dari admin {FEST_NAME}</p>
          <div className="mx-auto mt-4 h-1 w-24 rounded-full bg-gradient-to-r from-[#8B00FF] to-[#00E5FF]" />
        </div>

        {!faqs?.length ? (
          <div className="card-animated mx-auto max-w-xl rounded-2xl border border-[#1E3A5F] bg-[#0B1030]/80 p-8 text-center">
            <div className="mb-3 flex justify-center">
              <TbdBadge />
            </div>
            <p className="text-sm leading-6 text-[#B0C4DE]">
              FAQ resmi akan tampil setelah admin mengisi key <span className="font-mono text-[#00E5FF]">faq</span> di settings.
            </p>
          </div>
        ) : (
          <div className="stagger-list space-y-3">
            {faqs.map((faq, i) => (
              <div
                key={faq.q}
                className="card-animated glass-card overflow-hidden rounded-xl border border-[#1E3A5F] transition-all duration-300 hover:border-[#8B00FF]/30"
              >
                <button
                  onClick={() => setOpenIndex(openIndex === i ? null : i)}
                  className="group flex w-full cursor-pointer items-center justify-between p-5 text-left"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg"
                      style={{ background: "rgba(139,0,255,0.1)", border: "1px solid rgba(139,0,255,0.2)" }}
                    >
                      <HelpCircle size={14} className="text-[#8B00FF]" />
                    </div>
                    <span className="pr-4 text-sm font-medium text-white transition-colors group-hover:text-[#00E5FF] sm:text-base">
                      {faq.q}
                    </span>
                  </div>
                  <ChevronDown
                    size={18}
                    className={`flex-shrink-0 text-[#8B00FF] transition-transform duration-300 ${openIndex === i ? "rotate-180" : ""}`}
                  />
                </button>
                <div className={`accordion-content ${openIndex === i ? "open" : ""}`}>
                  <div className="px-5 pb-5">
                    <div className="ml-4 border-l-2 border-[#8B00FF]/30 pl-11 text-sm leading-relaxed text-[#B0C4DE]">
                      {faq.a}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="section-reveal-delay-2 mt-10 text-center">
          <p className="mb-3 text-sm text-[#B0C4DE]">Masih punya pertanyaan lain?</p>
          {contact ? (
            <a
              href={`https://wa.me/${contact.replace(/\D/g, "")}`}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-outline-neon inline-flex cursor-pointer items-center gap-2 rounded-full px-6 py-3 text-sm"
            >
              Hubungi Panitia via WhatsApp
            </a>
          ) : (
            <TbdBadge />
          )}
        </div>
      </div>
    </section>
  );
}
