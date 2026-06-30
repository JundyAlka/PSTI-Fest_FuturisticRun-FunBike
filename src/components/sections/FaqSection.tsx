"use client";
import { useState, useMemo } from "react";
import { ChevronDown, HelpCircle, Search, MessageSquareCode } from "lucide-react";
import AnimatedSectionTitle from "@/components/AnimatedSectionTitle";
import { hasAnnouncedValue } from "@/components/ui/TbdBadge";
import { CONTACT_EMAIL, DEFAULT_CONTACT_NAME, DEFAULT_WHATSAPP, FEST_NAME } from "@/content/brand";

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
  fallbackItems = [],
}: {
  settings?: Record<string, string>;
  contactPerson?: string | null;
  fallbackItems?: FaqItem[];
}) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const [searchQuery, setSearchQuery] = useState("");

  const faqs = parseFaqSetting(settings.faq) ?? fallbackItems;
  const contact = settings.contact_person_whatsapp?.trim() || contactPerson || settings.contact_person || DEFAULT_WHATSAPP;
  const contactName = settings.contact_person_name?.trim() || DEFAULT_CONTACT_NAME;
  const whatsappNumber = contact?.replace(/\D/g, "");

  const filteredFaqs = useMemo(() => {
    if (!searchQuery.trim()) return faqs;
    const query = searchQuery.toLowerCase();
    return faqs.filter(
      (item) => item.q.toLowerCase().includes(query) || item.a.toLowerCase().includes(query)
    );
  }, [faqs, searchQuery]);

  return (
    <section id="faq" className="section-reveal relative overflow-hidden py-12 sm:py-20">
      <div className="absolute inset-0 bg-gradient-to-b from-[#0A0E27] via-[#0D1336] to-[#0A0E27]" />
      <div className="pointer-events-none absolute top-1/4 right-0 h-80 w-80 rounded-full bg-[#8B00FF]/15 blur-3xl" />

      <div className="relative z-10 mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <div className="section-reveal-delay-1 mb-10 text-center">
          <div className="badge-neon mb-4 inline-block">BANTUAN & INFORMASI</div>
          <AnimatedSectionTitle text="FAQ" className="mb-3 text-4xl font-black sm:text-5xl text-white" />
          <p className="text-[#B0C4DE] text-sm sm:text-base max-w-xl mx-auto">
            Temukan jawaban cepat atas pertanyaan seputar pelaksanaan teknis, registrasi, dan fasilitas {FEST_NAME}.
          </p>
          <div className="mx-auto mt-5 h-1.5 w-24 rounded-full bg-gradient-to-r from-[#8B00FF] to-[#00E5FF]" />
        </div>

        {/* Search Bar */}
        <div className="mb-8 relative max-w-xl mx-auto">
          <div className="relative flex items-center">
            <Search size={18} className="absolute left-4 text-[#00E5FF] pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari pertanyaan atau kata kunci (contoh: rute, pembayaran, cut off)..."
              className="w-full bg-[#141E46]/80 border border-[#1E3A5F] focus:border-[#00E5FF] rounded-2xl pl-12 pr-4 py-3.5 text-sm sm:text-base text-white placeholder-gray-400 outline-none transition-all duration-300 shadow-inner focus:ring-2 focus:ring-[#00E5FF]/20"
            />
          </div>
        </div>

        {/* FAQ Accordion List */}
        {filteredFaqs.length === 0 ? (
          <div className="text-center py-12 rounded-2xl border border-dashed border-[#1E3A5F] bg-[#141E46]/40">
            <p className="text-gray-400 font-medium mb-2">Tidak ditemukan pertanyaan dengan kata kunci tersebut.</p>
            <button
              onClick={() => setSearchQuery("")}
              className="text-[#00E5FF] text-sm font-bold underline cursor-pointer"
            >
              Reset Pencarian
            </button>
          </div>
        ) : (
          <div className="stagger-list space-y-3.5">
            {filteredFaqs.map((faq, i) => {
              const isOpen = openIndex === i;
              return (
                <div
                  key={faq.q}
                  className={`card-animated rounded-2xl border transition-all duration-300 overflow-hidden ${
                    isOpen
                      ? "glass-card border-[#00E5FF] shadow-[0_0_20px_rgba(0,229,255,0.12)] bg-[#101840]"
                      : "glass-card border-[#1E3A5F] hover:border-[#8B00FF]/40"
                  }`}
                >
                  <button
                    onClick={() => setOpenIndex(isOpen ? null : i)}
                    className="group flex w-full cursor-pointer items-center justify-between p-5 sm:p-6 text-left gap-4"
                  >
                    <div className="flex items-center gap-3.5">
                      <div
                        className={`flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl transition-all duration-300 ${
                          isOpen
                            ? "bg-gradient-to-br from-[#00E5FF] to-[#8B00FF] text-[#0A0E27]"
                            : "bg-[#141E46] border border-[#8B00FF]/30 text-[#8B00FF]"
                        }`}
                      >
                        <HelpCircle size={18} />
                      </div>
                      <span
                        className={`text-sm sm:text-base font-bold transition-colors leading-snug ${
                          isOpen ? "text-[#00E5FF]" : "text-white group-hover:text-[#00E5FF]"
                        }`}
                      >
                        {faq.q}
                      </span>
                    </div>
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 transition-transform duration-300 ${
                        isOpen ? "rotate-180 bg-white/10 text-[#00E5FF]" : "text-gray-400"
                      }`}
                    >
                      <ChevronDown size={18} />
                    </div>
                  </button>
                  {isOpen && (
                    <div className="px-5 pb-6 sm:px-6 sm:pb-7 pt-1 border-t border-dashed border-gray-600/20">
                      <div className="ml-4 border-l-2 border-[#00E5FF]/40 pl-5 text-sm sm:text-base leading-relaxed text-[#B0C4DE]">
                        {faq.a}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        <div className="section-reveal-delay-2 mt-12 rounded-3xl border border-[#1E3A5F] bg-gradient-to-br from-[#141E46]/90 to-[#0A0E27] p-6 sm:p-8 text-center">
          <div className="w-12 h-12 rounded-2xl bg-[#8B00FF]/20 border border-[#8B00FF]/40 flex items-center justify-center mx-auto mb-4 text-[#00E5FF]">
            <MessageSquareCode size={24} />
          </div>
          <h3 className="text-xl font-bold text-white mb-2">Masih Butuh Bantuan Teknis?</h3>
          <p className="mb-6 text-sm text-[#B0C4DE] max-w-md mx-auto">
            Tim panitia {contactName} siap membantu menjawab kendala pendaftaran dan verifikasi pembayaran Anda.
          </p>
          {whatsappNumber ? (
            <a
              href={`https://wa.me/${whatsappNumber}`}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-outline-neon inline-flex cursor-pointer items-center gap-2.5 rounded-full px-8 py-3.5 text-sm font-bold"
            >
              Chat WhatsApp {contactName}
            </a>
          ) : (
            <a href={`mailto:${CONTACT_EMAIL}`} className="btn-outline-neon inline-flex cursor-pointer items-center gap-2.5 rounded-full px-8 py-3.5 text-sm font-bold">
              Hubungi Email Resmi
            </a>
          )}
        </div>
      </div>
    </section>
  );
}
