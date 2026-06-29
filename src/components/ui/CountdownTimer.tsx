"use client";
import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import TbdBadge from "./TbdBadge";

type CountdownTimerProps = {
  targetDate: string | null;
  accentColor?: string;
  textColor?: string;
  surfaceClassName?: string;
};

function partsUntil(targetDate: string) {
  const diff = new Date(targetDate).getTime() - Date.now();
  return {
    days: Math.floor(diff / 86400000),
    hours: Math.floor((diff % 86400000) / 3600000),
    minutes: Math.floor((diff % 3600000) / 60000),
    seconds: Math.floor((diff % 60000) / 1000),
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
          <span
            className="absolute text-[1.8rem] font-bold tabular-nums sm:text-4xl opacity-50"
            style={{ color: accentColor }}
          >
            {text}
          </span>
        )}
      </div>
      <span className="mt-1 text-[10px] font-bold tracking-[0.08em] sm:text-xs" style={{ color: "currentColor", fontFamily: "Rajdhani, sans-serif" }}>
        {label}
      </span>
    </div>
  );
}

export default function CountdownTimer({
  targetDate,
  accentColor = "#00E5FF",
  textColor = "#B0C4DE",
  surfaceClassName = "glass-card glow-cyan",
}: CountdownTimerProps) {
  const [mounted, setMounted] = useState(false);
  const [available, setAvailable] = useState<boolean | null>(targetDate ? null : false);
  const [time, setTime] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    let intervalId: number | undefined;
    const activationId = window.setTimeout(() => {
      setMounted(true);
      if (!targetDate || !Number.isFinite(new Date(targetDate).getTime()) || new Date(targetDate).getTime() <= Date.now()) {
        setAvailable(false);
        return;
      }

      setAvailable(true);
      const tick = () => {
        if (new Date(targetDate).getTime() <= Date.now()) {
          setAvailable(false);
          if (intervalId) window.clearInterval(intervalId);
          return;
        }
        setTime(partsUntil(targetDate));
      };
      tick();
      intervalId = window.setInterval(tick, 1000);
    }, 0);

    return () => {
      window.clearTimeout(activationId);
      if (intervalId) window.clearInterval(intervalId);
    };
  }, [targetDate]);

  const items = useMemo(
    () => [
      { value: time.days, label: "HARI" },
      { value: time.hours, label: "JAM" },
      { value: time.minutes, label: "MENIT" },
      { value: time.seconds, label: "DETIK" },
    ],
    [time]
  );

  if (available === false) {
    return <TbdBadge microcopy="Tanggal resmi masih dikunci panitia." className="mx-auto sm:w-auto" />;
  }

  return (
    <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-5" style={{ color: textColor }} data-no-scroll-reveal>
      {items.map((item) => (
        <Digit
          key={item.label}
          {...item}
          accentColor={accentColor}
          surfaceClassName={surfaceClassName}
          mounted={mounted && available === true}
        />
      ))}
    </div>
  );
}
