"use client";

import { useEffect, useRef, useState } from "react";

type AnimatedStatNumberProps = {
  value: string;
  color: string;
};

function splitStat(value: string) {
  const match = value.match(/^(\d+)(.*)$/);
  if (!match) return { number: 0, suffix: value };
  return { number: Number(match[1]), suffix: match[2] ?? "" };
}

export default function AnimatedStatNumber({ value, color }: AnimatedStatNumberProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [display, setDisplay] = useState(value);
  const [isChanging, setIsChanging] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const { number, suffix } = splitStat(value);
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (prefersReducedMotion || number === 0) {
      const timeout = window.setTimeout(() => setDisplay(value), 0);
      return () => window.clearTimeout(timeout);
    }

    let frame = 0;
    let raf = 0;
    let hasStarted = false;
    const totalFrames = 54;
    const start = number > 1000 ? Math.max(1900, number - 86) : 0;

    const animate = () => {
      frame += 1;
      const progress = Math.min(frame / totalFrames, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const next = Math.round(start + (number - start) * eased);

      setIsChanging(frame < totalFrames);
      setDisplay(`${next}${suffix}`);

      if (frame < totalFrames) {
        raf = requestAnimationFrame(animate);
      } else {
        setDisplay(value);
        setIsChanging(false);
      }
    };

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting || hasStarted) return;
        hasStarted = true;
        setIsChanging(true);
        raf = requestAnimationFrame(animate);
        observer.disconnect();
      },
      { threshold: 0.35 }
    );

    observer.observe(element);

    return () => {
      observer.disconnect();
      cancelAnimationFrame(raf);
    };
  }, [value]);

  return (
    <div
      ref={ref}
      className={`stat-number-rolling text-4xl font-black mb-1 ${isChanging ? "is-changing" : ""}`}
      style={{
        fontFamily: "Orbitron, sans-serif",
        color,
        textShadow: `0 0 20px ${color}80`,
      }}
    >
      {display}
    </div>
  );
}
