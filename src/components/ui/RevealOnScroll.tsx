"use client";
import { type ReactNode } from "react";
import { motion } from "framer-motion";

interface RevealOnScrollProps {
  children: ReactNode;
  delay?: number;
  stagger?: number;
  direction?: "up" | "down" | "left" | "right";
  distance?: number;
  duration?: number;
  className?: string;
}

export default function RevealOnScroll({
  children,
  delay = 0,
  stagger = 0.07,
  direction = "up",
  distance = 40,
  duration = 0.6,
  className = "",
}: RevealOnScrollProps) {
  const dirs = { up: [0, distance], down: [0, -distance], left: [distance, 0], right: [-distance, 0] };
  const [dx, dy] = dirs[direction] || dirs.up;

  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.15 }}
      transition={{ delay, staggerChildren: stagger, delayChildren: 0 }}
      variants={{
        hidden: {},
        visible: { transition: { staggerChildren: stagger, delayChildren: delay } },
      }}
      className={className}
    >
      {Array.isArray(children) ? (
        (children as ReactNode[]).map((child, i) => (
          <motion.div
            key={i}
            variants={{
              hidden: { opacity: 0, x: dx, y: dy },
              visible: { opacity: 1, x: 0, y: 0, transition: { duration, ease: "easeOut" } },
            }}
          >
            {child}
          </motion.div>
        ))
      ) : (
        <motion.div
          variants={{
            hidden: { opacity: 0, x: dx, y: dy },
            visible: { opacity: 1, x: 0, y: 0, transition: { duration, ease: "easeOut" } },
          }}
        >
          {children}
        </motion.div>
      )}
    </motion.div>
  );
}
