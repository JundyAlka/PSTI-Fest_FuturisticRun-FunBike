"use client";
import { useEffect, useRef, useState } from "react";
import { motion, useInView, useReducedMotion } from "framer-motion";

interface StatCounterProps {
  value: number;
  suffix?: string;
  prefix?: string;
  label?: string;
  color?: string;
  duration?: number;
}

export default function StatCounter({ value, suffix = "", prefix = "", label, color = "#00E5FF", duration = 1.2 }: StatCounterProps) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.5 });
  const reducedMotion = useReducedMotion();
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    if (!inView) return;
    if (reducedMotion) {
      const timeout = window.setTimeout(() => setDisplay(value), 0);
      return () => window.clearTimeout(timeout);
    }

    let raf = 0;
    const start = performance.now();
    const total = Math.max(duration * 1000, 1);

    const tick = (now: number) => {
      const progress = Math.min((now - start) / total, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplay(Math.round(value * eased));
      if (progress < 1) raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [duration, inView, reducedMotion, value]);

  return (
    <div ref={ref} className="text-center">
      <div className="flex items-baseline justify-center gap-1">
        {prefix && <span className="text-2xl font-bold opacity-60" style={{ color }}>{prefix}</span>}
        <motion.span
          className="text-4xl font-black tabular-nums md:text-5xl"
          style={{ color, fontFamily: "Orbitron, sans-serif" }}
          initial={{ opacity: 0, y: reducedMotion ? 0 : 14 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: reducedMotion ? 0 : 0.45 }}
        >
          {display.toLocaleString("id-ID")}
        </motion.span>
        {suffix && <span className="text-xl font-bold opacity-60" style={{ color }}>{suffix}</span>}
      </div>
      {label && <p className="mt-2 text-xs uppercase tracking-wider opacity-70" style={{ color }}>{label}</p>}
    </div>
  );
}
