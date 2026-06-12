"use client";
import { type ReactNode } from "react";
import { motion } from "framer-motion";

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
  const anim = animations[animate] || animations.sway;

  return (
    <motion.div
      className={`inline-flex items-center justify-center ${className}`}
      style={{ width: size, height: size, color }}
      animate={anim.animate}
      transition={anim.transition}
      whileHover={{ scale: 1.2, rotate: 15, transition: { duration: 0.2 } }}
    >
      {children}
    </motion.div>
  );
}
