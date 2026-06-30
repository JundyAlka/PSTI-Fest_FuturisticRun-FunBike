"use client";
import { useState, useMemo } from "react";
import { ChevronDown, HelpCircle, Search } from "lucide-react";
import { hasAnnouncedValue } from "@/components/ui/TbdBadge";

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

export default function FunBikeFaq({
  settings = {},
  fallbackItems = [],
}: {
  settings?: Record<string, string>;
  fallbackItems?: FaqItem[];
}) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const [searchQuery, setSearchQuery] = useState("");

  const items = parseFaqSetting(settings.faq) ?? fallbackItems;

  const filteredItems = useMemo(() => {
    if (!searchQuery.trim()) return items;
    const query = searchQuery.toLowerCase();
    return items.filter(
      (item) => item.q.toLowerCase().includes(query) || item.a.toLowerCase().includes(query)
    );
  }, [items, searchQuery]);

  return (
    <div>
      {/* Search Bar */}
      <div className="mb-8 relative max-w-xl mx-auto">
        <div className="relative flex items-center">
          <Search size={18} className="absolute left-4 text-[#FF6B2C] pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari pertanyaan seputar rute, jenis sepeda, helm, biaya..."
            className="w-full bg-white border border-gray-200 focus:border-[#FF6B2C] rounded-2xl pl-12 pr-4 py-3.5 text-sm sm:text-base text-gray-900 placeholder-gray-400 outline-none transition-all duration-300 shadow-sm focus:ring-2 focus:ring-[#FF6B2C]/20"
          />
        </div>
      </div>

      {filteredItems.length === 0 ? (
        <div className="text-center py-12 rounded-2xl border border-dashed border-gray-300 bg-gray-50">
          <p className="text-gray-500 font-medium mb-2">Tidak ditemukan pertanyaan dengan kata kunci tersebut.</p>
          <button
            onClick={() => setSearchQuery("")}
            className="text-[#FF6B2C] text-sm font-bold underline cursor-pointer"
          >
            Reset Pencarian
          </button>
        </div>
      ) : (
        <div className="stagger-list space-y-3.5">
          {filteredItems.map((item, i) => {
            const isOpen = openIndex === i;
            return (
              <div
                key={item.q}
                className={`card-animated overflow-hidden rounded-2xl border transition-all duration-300 ${
                  isOpen
                    ? "bg-white border-[#FF6B2C] shadow-lg ring-1 ring-[#FF6B2C]/20"
                    : "bg-white/90 border-gray-200 hover:border-[#FF6B2C]/40 shadow-sm"
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
                          ? "bg-gradient-to-br from-[#FF6B2C] to-[#F59E0B] text-white"
                          : "bg-orange-50 border border-orange-200 text-[#FF6B2C]"
                      }`}
                    >
                      <HelpCircle size={18} />
                    </div>
                    <span
                      className={`text-sm sm:text-base font-bold transition-colors leading-snug ${
                        isOpen ? "text-[#C2410C]" : "text-gray-900 group-hover:text-[#FF6B2C]"
                      }`}
                    >
                      {item.q}
                    </span>
                  </div>
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 transition-transform duration-300 ${
                      isOpen ? "rotate-180 bg-orange-50 text-[#FF6B2C]" : "text-gray-400"
                    }`}
                  >
                    <ChevronDown size={18} />
                  </div>
                </button>
                {isOpen && (
                  <div className="px-5 pb-6 sm:px-6 sm:pb-7 pt-1 border-t border-dashed border-gray-200">
                    <div className="ml-4 border-l-2 border-[#FF6B2C]/40 pl-5 text-sm sm:text-base leading-relaxed text-gray-600">
                      {item.a}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
