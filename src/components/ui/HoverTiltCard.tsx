"use client";
import { type ReactNode, useRef, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";

interface HoverTiltCardProps {
  children: ReactNode;
  className?: string;
  maxTilt?: number;
  glareColor?: string;
}

export default function HoverTiltCard({ children, className = "", maxTilt = 10, glareColor = "#ffffff" }: HoverTiltCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const reducedMotion = useReducedMotion();
  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(0);
  const [glareX, setGlareX] = useState(50);
  const [glareY, setGlareY] = useState(50);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (reducedMotion || window.matchMedia("(pointer: coarse)").matches) return;
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;
    setRotateX((0.5 - y) * maxTilt * 2);
    setRotateY((x - 0.5) * maxTilt * 2);
    setGlareX(x * 100);
    setGlareY(y * 100);
  };

  const handleMouseLeave = () => {
    setRotateX(0);
    setRotateY(0);
    setGlareX(50);
    setGlareY(50);
  };

  return (
    <motion.div
      ref={cardRef}
      className={`relative ${className}`}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      animate={reducedMotion ? undefined : { rotateX, rotateY, transition: { type: "spring", stiffness: 200, damping: 25 } }}
      style={{ transformStyle: "preserve-3d", perspective: "1000px" }}
    >
      <div
        className="absolute inset-0 rounded-2xl pointer-events-none opacity-20"
        style={{
          background: `radial-gradient(circle at ${glareX}% ${glareY}%, ${glareColor}30 0%, transparent 50%)`,
        }}
      />
      {children}
    </motion.div>
  );
}
