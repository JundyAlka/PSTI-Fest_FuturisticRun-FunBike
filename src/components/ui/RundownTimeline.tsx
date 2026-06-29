"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Clock3, UserRound, Radio } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";
import type { RundownItem } from "@/content/events";

type RundownTimelineProps = {
  items: RundownItem[];
  theme: "run" | "bike";
  /** Event date in YYYY-MM-DD format; needed for live highlighting */
  eventDate?: string | null;
};

const themes = {
  run: {
    line: "linear-gradient(180deg, #00E5FF, #8B00FF 55%, #FF006E)",
    marker: "#00E5FF",
    markerActive: "#FF006E",
    card: "border-[#1E3A5F] bg-[#0B1030]/92 text-white shadow-[0_14px_36px_rgba(0,0,0,0.22)]",
    cardActive:
      "border-[#FF006E] bg-[#1B0630]/95 text-white shadow-[0_14px_36px_rgba(255,0,110,0.18)] ring-1 ring-[#FF006E]/40",
    time: "text-[#67F1FF]",
    timeActive: "text-[#FF8BD6]",
    muted: "text-[#B0C4DE]",
    pic: "border-[#00E5FF]/15 bg-[#00E5FF]/[0.06] text-[#D7E8FF]",
    liveGlow: "#FF006E",
  },
  bike: {
    line: "linear-gradient(180deg, #C2410C, #F59E0B 55%, #0284C7)",
    marker: "#EA580C",
    markerActive: "#0284C7",
    card: "border-orange-100 bg-white text-gray-950 shadow-[0_12px_28px_rgba(124,45,18,0.08)]",
    cardActive:
      "border-sky-300 bg-sky-50 text-gray-950 shadow-[0_12px_28px_rgba(2,132,199,0.14)] ring-1 ring-sky-300/50",
    time: "text-[#C2410C]",
    timeActive: "text-[#0369A1]",
    muted: "text-gray-500",
    pic: "border-orange-100 bg-orange-50 text-gray-700",
    liveGlow: "#0284C7",
  },
} as const;

/**
 * Parse "HH.MM" into { hours, minutes } or null.
 */
function parseHM(s: string): { hours: number; minutes: number } | null {
  const match = s.match(/^(\d{1,2})[.:](\d{2})$/);
  if (!match) return null;
  return { hours: Number(match[1]), minutes: Number(match[2]) };
}

/**
 * Determine which rundown item is currently active (hari-H only).
 * Returns the index of the active item, or -1 if none.
 */
function getActiveIndex(items: RundownItem[], eventDate: string): number {
  const now = new Date();
  // Check if today is event date (in WIB, UTC+7)
  const wibOffset = 7 * 60; // minutes
  const utcMs = now.getTime() + now.getTimezoneOffset() * 60_000;
  const wibDate = new Date(utcMs + wibOffset * 60_000);
  const todayISO = `${wibDate.getFullYear()}-${String(wibDate.getMonth() + 1).padStart(2, "0")}-${String(wibDate.getDate()).padStart(2, "0")}`;

  if (todayISO !== eventDate.slice(0, 10)) return -1;

  const wibMinutes = wibDate.getHours() * 60 + wibDate.getMinutes();

  for (let i = items.length - 1; i >= 0; i--) {
    const parts = items[i].time.split("-");
    const start = parseHM(parts[0]);
    const end = parts[1] ? parseHM(parts[1]) : null;
    if (!start) continue;
    const startMin = start.hours * 60 + start.minutes;
    const endMin = end ? end.hours * 60 + end.minutes : startMin + 30;
    if (wibMinutes >= startMin && wibMinutes < endMin) return i;
  }
  return -1;
}

export default function RundownTimeline({ items, theme, eventDate }: RundownTimelineProps) {
  const reducedMotion = useReducedMotion();
  const colors = themes[theme];
  const containerRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<(HTMLLIElement | null)[]>([]);
  const [activeIndex, setActiveIndex] = useState(-1);

  // Live highlight: check every 30s
  useEffect(() => {
    if (!eventDate) return;

    const update = () => setActiveIndex(getActiveIndex(items, eventDate));
    update();
    const interval = setInterval(update, 30_000);
    return () => clearInterval(interval);
  }, [items, eventDate]);

  // Auto-scroll to active item
  useEffect(() => {
    if (activeIndex < 0 || reducedMotion) return;
    const el = itemRefs.current[activeIndex];
    if (!el) return;
    // Small delay to allow DOM to settle
    const timeout = setTimeout(() => {
      el.scrollIntoView({ behavior: "smooth", block: "center" });
    }, 400);
    return () => clearTimeout(timeout);
    // Only auto-scroll on first mount or when activeIndex changes
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeIndex]);

  const setItemRef = useCallback(
    (index: number) => (el: HTMLLIElement | null) => {
      itemRefs.current[index] = el;
    },
    [],
  );

  return (
    <div className="relative" data-testid={`rundown-${theme}`} ref={containerRef}>
      {/* Timeline vertical line */}
      <div
        aria-hidden="true"
        className="absolute bottom-4 left-[15px] top-4 w-px sm:left-[131px]"
        style={{ background: colors.line }}
      />

      <ol className="space-y-4 sm:space-y-5">
        {items.map((item, index) => {
          const isActive = index === activeIndex;
          const markerColor = isActive ? colors.markerActive : colors.marker;
          const cardClass = isActive ? colors.cardActive : colors.card;
          const timeClass = isActive ? colors.timeActive : colors.time;

          return (
            <motion.li
              key={`${item.time}-${item.activity}`}
              ref={setItemRef(index)}
              className="relative grid min-w-0 grid-cols-[32px_minmax(0,1fr)] gap-3 sm:grid-cols-[116px_32px_minmax(0,1fr)] sm:gap-4"
              initial={reducedMotion ? false : { opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-48px" }}
              transition={{
                duration: reducedMotion ? 0 : 0.38,
                delay: reducedMotion ? 0 : index * 0.07,
                ease: "easeOut",
              }}
            >
              {/* Desktop time column */}
              <div className="hidden pt-4 text-right sm:block">
                <p
                  className={`text-sm font-bold tabular-nums ${timeClass}`}
                  style={{ fontFamily: "Rajdhani, sans-serif" }}
                >
                  {item.time}
                </p>
                {item.duration && <p className={`mt-1 text-xs ${colors.muted}`}>{item.duration}</p>}
              </div>

              {/* Marker */}
              <div
                className="relative z-10 mt-4 flex h-8 w-8 items-center justify-center rounded-full border-2 bg-white"
                style={{
                  borderColor: markerColor,
                  boxShadow: isActive
                    ? `0 0 20px ${markerColor}88, 0 0 40px ${markerColor}44`
                    : `0 0 16px ${markerColor}55`,
                }}
              >
                {isActive ? (
                  <Radio size={14} style={{ color: markerColor }} className="animate-pulse" />
                ) : (
                  <span className="h-2.5 w-2.5 rounded-full" style={{ background: markerColor }} />
                )}
              </div>

              {/* Card */}
              <article className={`min-w-0 rounded-2xl border p-4 transition-all duration-500 sm:p-5 ${cardClass}`}>
                {/* Mobile time badge */}
                <div className="mb-2 flex flex-wrap items-center gap-x-3 gap-y-1 sm:hidden">
                  <span
                    className={`inline-flex items-center gap-1.5 text-sm font-bold tabular-nums ${timeClass}`}
                    style={{ fontFamily: "Rajdhani, sans-serif" }}
                  >
                    <Clock3 size={14} /> {item.time}
                  </span>
                  {item.duration && <span className={`text-xs ${colors.muted}`}>{item.duration}</span>}
                  {isActive && (
                    <span
                      className="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[0.6rem] font-bold uppercase tracking-wider text-white"
                      style={{ background: colors.liveGlow }}
                    >
                      <Radio size={10} className="animate-pulse" /> LIVE
                    </span>
                  )}
                </div>

                {/* Activity title + LIVE badge (desktop) */}
                <div className="flex items-center gap-2">
                  <h3 className="text-[0.95rem] font-bold leading-6 sm:text-base">{item.activity}</h3>
                  {isActive && (
                    <span
                      className="hidden items-center gap-1 rounded-full px-2 py-0.5 text-[0.6rem] font-bold uppercase tracking-wider text-white sm:inline-flex"
                      style={{ background: colors.liveGlow }}
                    >
                      <Radio size={10} className="animate-pulse" /> LIVE
                    </span>
                  )}
                </div>

                {/* PIC badge */}
                {item.pic && (
                  <div
                    className={`mt-3 inline-flex min-h-8 max-w-full items-center gap-2 rounded-lg border px-3 py-1.5 text-xs font-semibold ${colors.pic}`}
                  >
                    <UserRound size={13} className="shrink-0" />
                    <span className="min-w-0 break-words">PIC: {item.pic}</span>
                  </div>
                )}
              </article>
            </motion.li>
          );
        })}
      </ol>
    </div>
  );
}
