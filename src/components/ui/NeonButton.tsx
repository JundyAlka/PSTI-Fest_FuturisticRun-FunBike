"use client";
import Link from "next/link";
import { type ReactNode } from "react";

interface NeonButtonProps {
  children: ReactNode;
  href?: string;
  onClick?: () => void;
  accentColor?: string;
  size?: "sm" | "md" | "lg";
  className?: string;
}

export default function NeonButton({ children, href, onClick, accentColor = "#00E5FF", size = "md", className = "" }: NeonButtonProps) {
  const sizeClasses = { sm: "px-4 py-2 text-xs", md: "px-6 py-3 text-sm", lg: "px-8 py-4 text-base" };
  const glow = `0 0 20px ${accentColor}40`;
  return href ? (
    <Link href={href} className={`inline-block rounded-xl font-bold transition-all duration-300 hover:scale-105 ${sizeClasses[size]} ${className}`} style={{ background: accentColor, color: "#000", boxShadow: glow }}>
      {children}
    </Link>
  ) : (
    <button onClick={onClick} className={`rounded-xl font-bold transition-all duration-300 hover:scale-105 ${sizeClasses[size]} ${className}`} style={{ background: accentColor, color: "#000", boxShadow: glow }}>
      {children}
    </button>
  );
}
