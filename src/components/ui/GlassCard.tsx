import { type ReactNode } from "react";

interface GlassCardProps {
  children: ReactNode;
  className?: string;
  borderColor?: string;
  hover?: boolean;
  light?: boolean;
}

export default function GlassCard({ children, className = "", borderColor = "#00E5FF", hover = true, light = false }: GlassCardProps) {
  return (
    <div
      className={`relative overflow-hidden rounded-2xl p-6 transition-transform duration-300 will-change-transform ${hover ? "hover:-translate-y-1 hover:scale-[1.02]" : ""} ${className}`}
      style={{
        background: light ? "rgba(255,255,255,0.82)" : "rgba(255,255,255,0.03)",
        backdropFilter: "blur(10px)",
        border: light ? "1px solid rgba(255,255,255,0.7)" : "1px solid rgba(255,255,255,0.08)",
      }}
    >
      <div
        className="pointer-events-none absolute inset-0 rounded-2xl opacity-30"
        style={{
          background: `linear-gradient(135deg, ${borderColor}, transparent)`,
          maskImage: "linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0)",
          maskComposite: "exclude",
          padding: 1,
        }}
      />
      <div className="relative z-10">{children}</div>
    </div>
  );
}
