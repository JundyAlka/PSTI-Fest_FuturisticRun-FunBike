"use client";
import { useRef } from "react";
import { motion, useInView } from "framer-motion";

interface StatCounterProps {
  value: number;
  suffix?: string;
  prefix?: string;
  label?: string;
  color?: string;
  duration?: number;
}

export default function StatCounter({ value, suffix = "", prefix = "", label, color = "#00E5FF", duration = 2 }: StatCounterProps) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.5 });

  return (
    <div ref={ref} className="text-center">
      <div className="flex items-baseline justify-center gap-1">
        {prefix && <span className="text-2xl font-bold opacity-60" style={{ color }}>{prefix}</span>}
        <motion.span
          className="text-4xl md:text-5xl font-black"
          style={{ color, fontFamily: "Orbitron, sans-serif" }}
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
        >
          {inView ? value.toLocaleString() : "0"}
        </motion.span>
        {suffix && <span className="text-xl font-bold opacity-60" style={{ color }}>{suffix}</span>}
      </div>
      {label && <p className="text-xs uppercase tracking-wider mt-2 opacity-70" style={{ color }}>{label}</p>}
    </div>
  );
}
