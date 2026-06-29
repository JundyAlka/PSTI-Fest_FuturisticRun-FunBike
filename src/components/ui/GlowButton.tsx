"use client";
import Link from "next/link";
import { type ReactNode } from "react";
import { motion, useReducedMotion } from "framer-motion";

interface GlowButtonProps {
  children: ReactNode;
  href?: string;
  onClick?: () => void;
  accentColor?: string;
  outline?: boolean;
  className?: string;
  target?: "_blank";
  rel?: string;
  ariaLabel?: string;
}

export default function GlowButton({ children, href, onClick, accentColor = "#00E5FF", outline = false, className = "", target, rel, ariaLabel }: GlowButtonProps) {
  const reducedMotion = useReducedMotion();
  const cls = `relative inline-flex min-h-11 items-center justify-center gap-2 overflow-hidden rounded-xl px-8 py-3 font-bold transition-transform duration-300 hover:scale-[1.03] ${className}`;
  const inner = <><span className="shine-sweep" />{children}</>;

  if (outline) {
    const content = (
      <motion.span
        className={cls}
        style={{ background: "transparent", border: `1px solid ${accentColor}`, color: accentColor }}
        whileTap={reducedMotion ? undefined : { scale: 0.98 }}
      >
        {inner}
      </motion.span>
    );
    return href ? <Link href={href} target={target} rel={rel} aria-label={ariaLabel}>{content}</Link> : <button onClick={onClick} aria-label={ariaLabel}>{content}</button>;
  }
  const content = (
    <motion.span
      className={cls}
      style={{ background: `linear-gradient(135deg, ${accentColor}, ${accentColor}cc)`, color: "#07111f", boxShadow: `0 0 28px ${accentColor}55` }}
      whileTap={reducedMotion ? undefined : { scale: 0.98 }}
    >
      {inner}
    </motion.span>
  );
  return href ? <Link href={href} target={target} rel={rel} aria-label={ariaLabel}>{content}</Link> : <button onClick={onClick} aria-label={ariaLabel}>{content}</button>;
}
