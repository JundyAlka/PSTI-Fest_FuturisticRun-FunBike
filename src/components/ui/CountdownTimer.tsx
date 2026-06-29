"use client";

import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";

type CountdownProps = {
  targetIso: string;
  accentColor?: string;
  textColor?: string;
  surfaceClassName?: string;
};

const EVENT_DURATION_MS = 6 * 60 * 60 * 1000;

type CountdownState = {
  status: "upcoming" | "live" | "finished";
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
};

function calculateState(targetMs: number): CountdownState {
  const now = Date.now();
  if (now >= targetMs + EVENT_DURATION_MS) {
    return { status: "finished", days: 0, hours: 0, minutes: 0, seconds: 0 };
  }
  if (now >= targetMs) {
    return { status: "live", days: 0, hours: 0, minutes: 0, seconds: 0 };
  }

  const diff = targetMs - now;
  return {
    status: "upcoming",
    days: Math.floor(diff / 86_400_000),
    hours: Math.floor((diff % 86_400_000) / 3_600_000),
    minutes: Math.floor((diff % 3_600_000) / 60_000),
    seconds: Math.floor((diff % 60_000) / 1_000),
  };
}

function Digit({
  value,
  label,
  accentColor,
  surfaceClassName,
  mounted,
}: {
  value: number;
  label: string;
  accentColor: string;
  surfaceClassName: string;
  mounted: boolean;
}) {
  const reducedMotion = useReducedMotion();
  const text = mounted ? String(value).padStart(2, "0") : "--";

  return (
    <div className="flex flex-col items-center" data-no-scroll-reveal>
      <div
        className={`relative flex h-16 w-16 items-center justify-center overflow-hidden rounded-2xl sm:h-20 sm:w-20 ${surfaceClassName}`}
        style={{ fontFamily: "Rajdhani, sans-serif" }}
      >
        {mounted ? (
          <AnimatePresence mode="popLayout" initial={false}>
            <motion.span
              key={text}
              className="absolute text-[1.8rem] font-bold tabular-nums sm:text-4xl"
              style={{ color: accentColor }}
              initial={reducedMotion ? false : { y: 18, opacity: 0, rotateX: -70 }}
              animate={{ y: 0, opacity: 1, rotateX: 0 }}
              exit={reducedMotion ? undefined : { y: -18, opacity: 0, rotateX: 70 }}
              transition={{ duration: reducedMotion ? 0 : 0.24, ease: "easeOut" }}
            >
              {text}
            </motion.span>
          </AnimatePresence>
        ) : (
          <span className="absolute text-[1.8rem] font-bold tabular-nums opacity-50 sm:text-4xl" style={{ color: accentColor }}>
            {text}
          </span>
        )}
      </div>
      <span className="mt-1 text-[10px] font-bold tracking-[0.08em] sm:text-xs" style={{ fontFamily: "Rajdhani, sans-serif" }}>
        {label}
      </span>
    </div>
  );
}

export default function Countdown({
  targetIso,
  accentColor = "#00E5FF",
  textColor = "#B0C4DE",
  surfaceClassName = "glass-card glow-cyan",
}: CountdownProps) {
  const [mounted, setMounted] = useState(false);
  const [time, setTime] = useState<CountdownState>({ status: "upcoming", days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    const targetMs = Date.parse(targetIso);
    const tick = () => setTime(calculateState(targetMs));
    let intervalId: number | undefined;
    const activationId = window.setTimeout(() => {
      setMounted(true);
      tick();
      intervalId = window.setInterval(tick, 1000);
    }, 0);
    return () => {
      window.clearTimeout(activationId);
      if (intervalId) window.clearInterval(intervalId);
    };
  }, [targetIso]);

  const items = useMemo(
    () => [
      { value: time.days, label: "HARI" },
      { value: time.hours, label: "JAM" },
      { value: time.minutes, label: "MENIT" },
      { value: time.seconds, label: "DETIK" },
    ],
    [time],
  );

  if (mounted && time.status !== "upcoming") {
    return (
      <span
        className="inline-flex rounded-full border px-5 py-2 text-sm font-black tracking-[0.12em]"
        style={{ borderColor: `${accentColor}66`, color: accentColor }}
      >
        {time.status === "live" ? "SEDANG BERLANGSUNG" : "SELESAI"}
      </span>
    );
  }

  return (
    <div
      className="flex flex-wrap items-center justify-center gap-3 sm:gap-5"
      style={{ color: textColor }}
      data-no-scroll-reveal
      suppressHydrationWarning
    >
      {items.map((item) => (
        <Digit key={item.label} {...item} accentColor={accentColor} surfaceClassName={surfaceClassName} mounted={mounted} />
      ))}
    </div>
  );
}
