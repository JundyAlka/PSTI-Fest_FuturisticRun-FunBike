import { type ReactNode } from "react";

interface SectionHeadingProps {
  eyebrow: string;
  title: string;
  subtitle?: string;
  accentColor?: string;
  accentColor2?: string;
  className?: string;
}

export default function SectionHeading({
  eyebrow,
  title,
  subtitle,
  accentColor = "#00E5FF",
  accentColor2 = "#8B00FF",
  className = "",
}: SectionHeadingProps) {
  return (
    <div className={`text-center mb-14 ${className}`}>
      <div
        className="inline-block mb-4 px-3 py-1 rounded-full text-xs tracking-[2px] uppercase font-bold"
        style={{
          fontFamily: "Orbitron, sans-serif",
          background: `${accentColor}15`,
          border: `1px solid ${accentColor}`,
          color: accentColor,
        }}
      >
        {eyebrow}
      </div>
      <h2
        className="text-4xl sm:text-5xl font-black mb-4"
        style={{
          fontFamily: "Orbitron, sans-serif",
          background: `linear-gradient(135deg, ${accentColor}, #ffffff 40%, ${accentColor2})`,
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          backgroundClip: "text",
        }}
      >
        {title}
      </h2>
      <div
        className="w-24 h-1 mx-auto rounded-full"
        style={{ background: `linear-gradient(to right, ${accentColor}, ${accentColor2})` }}
      />
      {subtitle && <p className="text-sm mt-4 opacity-70" style={{ color: "var(--text-secondary, #B0C4DE)" }}>{subtitle}</p>}
    </div>
  );
}
