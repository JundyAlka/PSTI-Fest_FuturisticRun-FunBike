import { Calendar, type LucideIcon } from "lucide-react";
import AnimatedIcon from "@/components/ui/AnimatedIcon";

export type TimelineItem = {
  time: string;
  label: string;
  color?: string;
  icon?: LucideIcon;
};

export default function Timeline({
  items,
  accentColor = "#00E5FF",
  light = false,
}: {
  items: TimelineItem[];
  accentColor?: string;
  light?: boolean;
}) {
  return (
    <div className="relative">
      <div
        className="absolute left-4 top-0 bottom-0 w-px opacity-45 sm:left-1/2 sm:-translate-x-1/2"
        style={{ background: `linear-gradient(180deg, ${accentColor}, transparent)` }}
      />
      <div className="stagger-list space-y-5">
        {items.map((item, index) => {
          const isRight = index % 2 === 1;
          const color = item.color ?? accentColor;
          const Icon = item.icon ?? Calendar;
          return (
            <div key={`${item.time}-${item.label}`} className={`relative flex gap-5 sm:gap-0 ${isRight ? "sm:flex-row-reverse" : ""}`}>
              <div className={`w-full pl-12 sm:w-1/2 sm:pl-0 ${isRight ? "sm:pl-8" : "sm:pr-8 sm:text-right"}`}>
                <div
                  className={`card-animated rounded-2xl border p-4 transition-transform duration-300 hover:-translate-y-1 ${
                    light ? "border-gray-100 bg-white shadow-sm" : "border-[#1E3A5F] bg-[#080C24]/88 shadow-[0_0_30px_rgba(0,0,0,0.24)] backdrop-blur"
                  }`}
                >
                  <div className={`mb-2 flex items-center gap-2 ${isRight ? "" : "sm:justify-end"}`}>
                    <Calendar size={13} style={{ color }} />
                    <span className="text-sm font-bold tabular-nums tracking-[0.08em]" style={{ color, fontFamily: "Rajdhani, sans-serif" }}>
                      {item.time}
                    </span>
                  </div>
                  <h3 className={`text-sm font-bold leading-6 sm:text-base ${light ? "text-gray-900" : "text-white"}`}>{item.label}</h3>
                </div>
              </div>

              <div
                className={`absolute left-4 top-4 z-10 flex h-8 w-8 -translate-x-1/2 items-center justify-center rounded-full border-2 sm:left-1/2 ${
                  light ? "bg-white" : "bg-[#080C24]"
                }`}
                style={{ borderColor: color, boxShadow: `0 0 16px ${color}66` }}
              >
                <AnimatedIcon color={color} size={14} animate="pulse">
                  <Icon size={14} />
                </AnimatedIcon>
              </div>
              <div className="hidden w-1/2 sm:block" />
            </div>
          );
        })}
      </div>
    </div>
  );
}
