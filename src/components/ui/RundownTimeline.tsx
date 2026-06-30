"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  Clock3, UserRound, Radio, Flag, Dumbbell, Zap, Music2, Gift,
  Trophy, Coffee, Users, PlayCircle, Star, CheckCircle2, Timer,
} from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";
import type { RundownItem } from "@/content/events";

type RundownTimelineProps = {
  items: RundownItem[];
  theme: "run" | "bike";
  /** Event date in YYYY-MM-DD format; needed for live highlighting */
  eventDate?: string | null;
};

/* ── Themes ────────────────────────────────────────────────────── */
const themes = {
  run: {
    line: "linear-gradient(180deg, #00E5FF 0%, #8B00FF 50%, #FF006E 100%)",
    accent: "#00E5FF",
    accentAlt: "#8B00FF",
    accentHot: "#FF006E",
    marker: "#00E5FF",
    markerActive: "#FF006E",
    cardBase:
      "border-[#1E3A5F]/80 bg-gradient-to-br from-[#0B1030]/95 to-[#080C20]/95 text-white shadow-[0_8px_32px_rgba(0,0,0,0.28)]",
    cardActive:
      "border-[#FF006E] bg-gradient-to-br from-[#1B0630]/98 to-[#0A0020]/95 text-white shadow-[0_8px_40px_rgba(255,0,110,0.25)] ring-1 ring-[#FF006E]/50",
    time: "text-[#67F1FF]",
    timeActive: "text-[#FF8BD6]",
    muted: "text-[#8AA8C8]",
    numberBg: "bg-gradient-to-br from-[#00E5FF]/20 to-[#8B00FF]/20 border-[#00E5FF]/30",
    numberText: "#00E5FF",
    liveGlow: "#FF006E",
    tagBg: "bg-[#00E5FF]/[0.08] border-[#00E5FF]/20 text-[#B0D8FF]",
    stepKeyword: ["flag", "start", "countdown", "lomba", "5k", "run"],
    specialCard: "from-[#0B1A10]/95 to-[#081510]/95 border-[#4ADE80]/30",
  },
  bike: {
    line: "linear-gradient(180deg, #C2410C 0%, #F59E0B 50%, #0284C7 100%)",
    accent: "#EA580C",
    accentAlt: "#F59E0B",
    accentHot: "#0284C7",
    marker: "#EA580C",
    markerActive: "#0284C7",
    cardBase:
      "border-orange-100 bg-gradient-to-br from-white/95 to-orange-50/90 text-gray-950 shadow-[0_8px_24px_rgba(124,45,18,0.1)]",
    cardActive:
      "border-sky-300 bg-gradient-to-br from-sky-50/98 to-white text-gray-950 shadow-[0_8px_32px_rgba(2,132,199,0.18)] ring-1 ring-sky-300/60",
    time: "text-[#C2410C]",
    timeActive: "text-[#0369A1]",
    muted: "text-gray-500",
    numberBg: "bg-gradient-to-br from-orange-100 to-amber-100 border-orange-200",
    numberText: "#C2410C",
    liveGlow: "#0284C7",
    tagBg: "bg-orange-50 border-orange-200 text-orange-700",
    stepKeyword: ["start", "ride", "gowes", "finish", "flag"],
    specialCard: "from-amber-50/95 to-white border-amber-300",
  },
} as const;

/* ── Activity icon mapper ──────────────────────────────────────── */
function getActivityIcon(activity: string) {
  const a = activity.toLowerCase();
  if (a.includes("registrasi")) return Users;
  if (a.includes("pembukaan") || a.includes("opening")) return PlayCircle;
  if (a.includes("sambutan")) return Star;
  if (a.includes("briefing")) return CheckCircle2;
  if (a.includes("stretching") || a.includes("pemanasan") || a.includes("warming")) return Dumbbell;
  if (a.includes("persiapan garis") || a.includes("start")) return Flag;
  if (a.includes("countdown") || a.includes("flag off")) return Zap;
  if (a.includes("run") || a.includes("5k") || a.includes("lomba") || a.includes("peserta run")) return Timer;
  if (a.includes("ride") || a.includes("gowes")) return Timer;
  if (a.includes("finish") || a.includes("refreshment")) return Coffee;
  if (a.includes("cooling") || a.includes("cool down")) return Dumbbell;
  if (a.includes("hiburan") || a.includes("music") || a.includes("dj") || a.includes("band") || a.includes("perform")) return Music2;
  if (a.includes("doorprize")) return Gift;
  if (a.includes("pemenang") || a.includes("hadiah") || a.includes("juara")) return Trophy;
  if (a.includes("penutup") || a.includes("dokumentasi")) return Star;
  return Clock3;
}

/* ── Parse time string ─────────────────────────────────────────── */
function parseHM(s: string): { hours: number; minutes: number } | null {
  const match = s.match(/^(\d{1,2})[.:](\d{2})$/);
  if (!match) return null;
  return { hours: Number(match[1]), minutes: Number(match[2]) };
}

/* ── Detect active item ────────────────────────────────────────── */
function getActiveIndex(items: RundownItem[], eventDate: string): number {
  const now = new Date();
  const wibOffset = 7 * 60;
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

/* ── Card accent variety based on index ───────────────────────── */
function getCardAccent(index: number, themeKey: "run" | "bike") {
  if (themeKey === "run") {
    const palette = [
      { border: "#00E5FF", glow: "rgba(0,229,255,0.08)", num: "#00E5FF" },
      { border: "#8B00FF", glow: "rgba(139,0,255,0.08)", num: "#C084FC" },
      { border: "#2A4FFF", glow: "rgba(42,79,255,0.08)", num: "#7EA8FF" },
      { border: "#FF006E", glow: "rgba(255,0,110,0.06)", num: "#FF8BD6" },
      { border: "#FFD700", glow: "rgba(255,215,0,0.06)", num: "#FFD700" },
    ];
    return palette[index % palette.length];
  } else {
    const palette = [
      { border: "#EA580C", glow: "rgba(234,88,12,0.08)", num: "#EA580C" },
      { border: "#F59E0B", glow: "rgba(245,158,11,0.08)", num: "#D97706" },
      { border: "#0284C7", glow: "rgba(2,132,199,0.08)", num: "#0284C7" },
      { border: "#10B981", glow: "rgba(16,185,129,0.07)", num: "#059669" },
    ];
    return palette[index % palette.length];
  }
}

/* ── Main component ────────────────────────────────────────────── */
export default function RundownTimeline({ items, theme, eventDate }: RundownTimelineProps) {
  const reducedMotion = useReducedMotion();
  const colors = themes[theme];
  const containerRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<(HTMLLIElement | null)[]>([]);
  const [activeIndex, setActiveIndex] = useState(-1);

  useEffect(() => {
    if (!eventDate) return;
    const update = () => setActiveIndex(getActiveIndex(items, eventDate));
    update();
    const interval = setInterval(update, 30_000);
    return () => clearInterval(interval);
  }, [items, eventDate]);

  useEffect(() => {
    if (activeIndex < 0 || reducedMotion) return;
    const el = itemRefs.current[activeIndex];
    if (!el) return;
    const timeout = setTimeout(() => {
      el.scrollIntoView({ behavior: "smooth", block: "center" });
    }, 400);
    return () => clearTimeout(timeout);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeIndex]);

  const setItemRef = useCallback(
    (index: number) => (el: HTMLLIElement | null) => {
      itemRefs.current[index] = el;
    },
    [],
  );

  const isRun = theme === "run";

  return (
    <div className="relative" data-testid={`rundown-${theme}`} ref={containerRef}>
      {/* ── Vertical timeline line ── */}
      <div
        aria-hidden="true"
        className="absolute bottom-4 top-4 w-[2px] left-[19px] sm:left-[139px]"
        style={{ background: colors.line, opacity: 0.6, borderRadius: 999 }}
      />

      <ol className="space-y-3 sm:space-y-4">
        {items.map((item, index) => {
          const isActive = index === activeIndex;
          const accent = getCardAccent(index, theme);
          const ActivityIcon = getActivityIcon(item.activity);
          const isHighlight =
            item.activity.toLowerCase().includes("flag") ||
            item.activity.toLowerCase().includes("countdown") ||
            item.activity.toLowerCase().includes("5k") ||
            item.activity.toLowerCase().includes("ride");

          return (
            <motion.li
              key={`${item.time}-${item.activity}`}
              ref={setItemRef(index)}
              className="relative grid min-w-0 grid-cols-[40px_minmax(0,1fr)] gap-3 sm:grid-cols-[124px_40px_minmax(0,1fr)] sm:gap-4"
              initial={reducedMotion ? false : { opacity: 0, x: -16 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{
                duration: reducedMotion ? 0 : 0.42,
                delay: reducedMotion ? 0 : index * 0.055,
                ease: [0.22, 1, 0.36, 1],
              }}
            >
              {/* ── Desktop time column ── */}
              <div className="hidden sm:flex flex-col items-end justify-start pt-[18px] gap-0.5">
                <span
                  className={`text-[0.8rem] font-black tabular-nums leading-tight ${isActive ? colors.timeActive : colors.time}`}
                  style={{ fontFamily: "Rajdhani, sans-serif" }}
                >
                  {item.time}
                </span>
                {item.duration && (
                  <span
                    className={`text-[0.68rem] font-semibold tabular-nums px-1.5 py-0.5 rounded-md ${isRun ? "bg-[#00E5FF]/10 text-[#67F1FF]" : "bg-orange-50 text-orange-600"}`}
                  >
                    {item.duration}
                  </span>
                )}
              </div>

              {/* ── Marker dot ── */}
              <div className="relative z-10 mt-[14px] flex h-10 w-10 shrink-0 items-center justify-center">
                {/* outer ring */}
                <div
                  className="absolute inset-0 rounded-full"
                  style={{
                    border: `2px solid ${isActive ? colors.markerActive : accent.border}`,
                    boxShadow: isActive
                      ? `0 0 20px ${colors.markerActive}99, 0 0 40px ${colors.markerActive}44`
                      : `0 0 12px ${accent.border}55`,
                    background: isRun ? "#0B1030" : "#fff",
                  }}
                />
                {/* inner icon */}
                {isActive ? (
                  <Radio
                    size={16}
                    className="relative z-10 animate-pulse"
                    style={{ color: colors.markerActive }}
                  />
                ) : (
                  <ActivityIcon
                    size={15}
                    className="relative z-10"
                    style={{ color: accent.border }}
                  />
                )}
              </div>

              {/* ── Card ── */}
              <article
                className={`group relative min-w-0 overflow-hidden rounded-2xl border transition-all duration-500 ${
                  isActive
                    ? colors.cardActive
                    : colors.cardBase
                }`}
                style={
                  isActive
                    ? {}
                    : {
                        borderColor: `${accent.border}40`,
                        background: isRun
                          ? `linear-gradient(135deg, #0B1030ee, #080C20ee)`
                          : undefined,
                        boxShadow: `0 4px 24px ${accent.glow}, inset 0 1px 0 ${accent.border}10`,
                      }
                }
              >
                {/* Highlight stripe for main events */}
                {isHighlight && !isActive && (
                  <div
                    className="absolute left-0 top-0 bottom-0 w-1 rounded-l-2xl"
                    style={{
                      background: isRun
                        ? "linear-gradient(180deg, #00E5FF, #8B00FF)"
                        : "linear-gradient(180deg, #EA580C, #F59E0B)",
                    }}
                  />
                )}

                {/* Hover shimmer */}
                <div
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                  style={{
                    background: `radial-gradient(circle at 0% 50%, ${accent.glow} 0%, transparent 70%)`,
                  }}
                />

                <div className={`relative p-4 sm:p-5 ${isHighlight ? "pl-5 sm:pl-6" : ""}`}>
                  {/* ── Mobile time badge row ── */}
                  <div className="mb-2.5 flex flex-wrap items-center gap-x-2 gap-y-1.5 sm:hidden">
                    <span
                      className={`inline-flex items-center gap-1.5 text-sm font-black tabular-nums ${isActive ? colors.timeActive : colors.time}`}
                      style={{ fontFamily: "Rajdhani, sans-serif" }}
                    >
                      <Clock3 size={13} /> {item.time}
                    </span>
                    {item.duration && (
                      <span
                        className={`text-[0.65rem] font-semibold px-1.5 py-0.5 rounded-md ${isRun ? "bg-[#00E5FF]/10 text-[#67F1FF]" : "bg-orange-50 text-orange-600"}`}
                      >
                        {item.duration}
                      </span>
                    )}
                    {isActive && (
                      <span
                        className="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[0.6rem] font-bold uppercase tracking-wider text-white"
                        style={{ background: colors.liveGlow }}
                      >
                        <Radio size={10} className="animate-pulse" /> LIVE
                      </span>
                    )}
                  </div>

                  {/* ── Activity row ── */}
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-3 min-w-0">
                      {/* Step number bubble */}
                      <div
                        className={`mt-0.5 hidden sm:flex shrink-0 h-6 w-6 items-center justify-center rounded-full border text-[0.65rem] font-black ${colors.numberBg}`}
                        style={{ color: colors.numberText }}
                      >
                        {index + 1}
                      </div>

                      <div className="min-w-0">
                        <h3
                          className={`text-[0.95rem] font-bold leading-snug sm:text-base ${
                            isHighlight ? (isRun ? "text-white" : "text-gray-900") : ""
                          }`}
                        >
                          {item.activity}
                        </h3>

                        {/* PIC badge */}
                        {item.pic && (
                          <div
                            className={`mt-2 inline-flex items-center gap-1.5 rounded-lg border px-2.5 py-1 text-[0.72rem] font-semibold ${colors.tagBg}`}
                          >
                            <UserRound size={11} className="shrink-0 opacity-70" />
                            <span className="min-w-0 break-words">PIC: {item.pic}</span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* LIVE badge (desktop) */}
                    {isActive && (
                      <span
                        className="hidden sm:inline-flex shrink-0 items-center gap-1 rounded-full px-2.5 py-1 text-[0.6rem] font-black uppercase tracking-wider text-white"
                        style={{ background: colors.liveGlow, boxShadow: `0 0 14px ${colors.liveGlow}99` }}
                      >
                        <Radio size={10} className="animate-pulse" /> LIVE
                      </span>
                    )}

                    {/* Highlight badge */}
                    {isHighlight && !isActive && (
                      <span
                        className="hidden sm:inline-flex shrink-0 items-center gap-1 rounded-full px-2 py-0.5 text-[0.6rem] font-black uppercase tracking-wider"
                        style={{
                          background: isRun ? "rgba(0,229,255,0.12)" : "rgba(234,88,12,0.1)",
                          color: isRun ? "#00E5FF" : "#EA580C",
                          border: `1px solid ${isRun ? "rgba(0,229,255,0.3)" : "rgba(234,88,12,0.3)"}`,
                        }}
                      >
                        <Zap size={9} /> KEY
                      </span>
                    )}
                  </div>
                </div>
              </article>
            </motion.li>
          );
        })}
      </ol>

      {/* End cap */}
      <div className="mt-5 ml-[15px] sm:ml-[135px] flex items-center gap-3">
        <div
          className="h-5 w-5 rounded-full border-2 flex items-center justify-center shrink-0"
          style={{
            borderColor: isRun ? "#FF006E" : "#0284C7",
            background: isRun ? "rgba(255,0,110,0.15)" : "rgba(2,132,199,0.15)",
            boxShadow: isRun ? "0 0 16px rgba(255,0,110,0.4)" : "0 0 16px rgba(2,132,199,0.4)",
          }}
        >
          <Star size={9} style={{ color: isRun ? "#FF006E" : "#0284C7" }} />
        </div>
        <span
          className="text-xs font-bold tracking-widest uppercase opacity-60"
          style={{ color: isRun ? "#FF006E" : "#0284C7", fontFamily: "Orbitron, sans-serif" }}
        >
          Selesai
        </span>
      </div>
    </div>
  );
}
