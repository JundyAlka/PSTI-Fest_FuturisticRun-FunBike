"use client";
import Link from "next/link";
import { type ReactNode } from "react";

interface GlowButtonProps {
  children: ReactNode;
  href?: string;
  onClick?: () => void;
  accentColor?: string;
  outline?: boolean;
  className?: string;
}

export default function GlowButton({ children, href, onClick, accentColor = "#00E5FF", outline = false, className = "" }: GlowButtonProps) {
  const cls = `relative overflow-hidden rounded-xl px-8 py-3 font-bold transition-all duration-300 hover:scale-105 ${outline ? "" : ""} ${className}`;
  if (outline) {
    const content = (
      <span className={cls} style={{ background: "transparent", border: `1px solid ${accentColor}`, color: accentColor }}>
        <span className="shine-sweep" />
        {children}
      </span>
    );
    return href ? <Link href={href}>{content}</Link> : <button onClick={onClick}>{content}</button>;
  }
  const content = (
    <span className={cls} style={{ background: `linear-gradient(135deg, ${accentColor}, ${accentColor}cc)`, color: "#000" }}>
      <span className="shine-sweep" />
      {children}
    </span>
  );
  return href ? <Link href={href}>{content}</Link> : <button onClick={onClick}>{content}</button>;
}
