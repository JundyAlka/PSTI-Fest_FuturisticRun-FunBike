"use client";
import { motion } from "framer-motion";
import { type ReactNode } from "react";

interface MarqueeSponsorsProps {
  items: ReactNode[];
  speed?: number;
}

export default function MarqueeSponsors({ items, speed = 30 }: MarqueeSponsorsProps) {
  const doubled = [...items, ...items];
  return (
    <div className="overflow-hidden py-6">
      <motion.div
        className="flex gap-12 whitespace-nowrap"
        animate={{ x: ["0%", "-50%"] }}
        transition={{ duration: speed, repeat: Infinity, ease: "linear" }}
      >
        {doubled.map((item, i) => (
          <div key={i} className="flex-shrink-0 opacity-60 hover:opacity-100 transition-opacity duration-300">
            {item}
          </div>
        ))}
      </motion.div>
    </div>
  );
}
