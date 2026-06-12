import { type ReactNode } from "react";

interface GlassCardProps {
  children: ReactNode;
  className?: string;
  borderColor?: string;
  hover?: boolean;
}

export default function GlassCard({ children, className = "", borderColor = "#00E5FF", hover = true }: GlassCardProps) {
  return (
    <div
      className={`rounded-2xl p-6 transition-all ${hover ? "hover:scale-[1.02] hover:-translate-y-1" : ""} ${className}`}
      style={{
        background: "rgba(255,255,255,0.03)",
        backdropFilter: "blur(10px)",
        border: "1px solid rgba(255,255,255,0.08)",
      }}
    >
      <div
        className="absolute inset-0 rounded-2xl opacity-30"
        style={{
          background: `linear-gradient(135deg, ${borderColor}, transparent)`,
        }}
      />
      <div className="relative z-10">{children}</div>
    </div>
  );
}
