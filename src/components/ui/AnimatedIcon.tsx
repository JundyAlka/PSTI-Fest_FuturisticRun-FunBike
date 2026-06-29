"use client";
import { type ReactNode } from "react";
import { motion, useInView, useReducedMotion } from "framer-motion";
import { useRef } from "react";

interface AnimatedIconProps {
  children: ReactNode;
  color?: string;
  size?: number;
  animate?: "spin" | "bounce" | "pulse" | "sway" | "rotate" | "none";
  className?: string;
}

const animations = {
  spin: { animate: { rotate: 360 }, transition: { duration: 2, repeat: Infinity, ease: "linear" as const } },
  bounce: { animate: { y: [-4, 4, -4] }, transition: { duration: 1.5, repeat: Infinity, ease: "easeInOut" as const } },
  pulse: { animate: { scale: [1, 1.15, 1] }, transition: { duration: 1.5, repeat: Infinity, ease: "easeInOut" as const } },
  sway: { animate: { rotate: [-8, 8, -8] }, transition: { duration: 2, repeat: Infinity, ease: "easeInOut" as const } },
  rotate: { animate: { rotate: [0, 10, -10, 0] }, transition: { duration: 2, repeat: Infinity, ease: "easeInOut" as const } },
  none: { animate: {}, transition: {} },
};

export default function AnimatedIcon({ children, color = "#00E5FF", size = 28, animate = "sway", className = "" }: AnimatedIconProps) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.35 });
  const reducedMotion = useReducedMotion();
  const anim = animations[animate] || animations.sway;
  const active = !reducedMotion && inView;

  return (
    <motion.div
      ref={ref}
      className={`inline-flex items-center justify-center ${className}`}
      style={{ width: size, height: size, color }}
      animate={active ? anim.animate : {}}
      transition={active ? anim.transition : {}}
      whileHover={reducedMotion ? undefined : { scale: 1.18, rotate: 12, transition: { duration: 0.2 } }}
    >
      {children}
    </motion.div>
  );
}
