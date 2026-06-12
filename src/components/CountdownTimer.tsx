"use client";
import { useEffect, useState } from "react";

// Target: June 22, 2026
const TARGET = new Date("2026-06-22T05:00:00+07:00").getTime();

export default function CountdownTimer() {
  const [time, setTime] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    const tick = () => {
      const now = Date.now();
      const diff = Math.max(TARGET - now, 0);
      setTime({
        days: Math.floor(diff / 86400000),
        hours: Math.floor((diff % 86400000) / 3600000),
        minutes: Math.floor((diff % 3600000) / 60000),
        seconds: Math.floor((diff % 60000) / 1000),
      });
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  const pads = (n: number) => String(n).padStart(2, "0");

  return (
    <div className="stagger-list flex items-center gap-3 sm:gap-5 flex-wrap justify-center">
      {[
        { value: time.days, label: "HARI" },
        { value: time.hours, label: "JAM" },
        { value: time.minutes, label: "MENIT" },
        { value: time.seconds, label: "DETIK" },
      ].map((item, i) => (
        <div key={i} className="floating-soft flex flex-col items-center">
          <div
            className="card-animated glass-card w-16 h-16 sm:w-20 sm:h-20 flex items-center justify-center glow-cyan"
            style={{ fontFamily: "Orbitron, sans-serif" }}
          >
            <span className="text-2xl sm:text-3xl font-bold text-[#00E5FF] tabular-nums">
              {pads(item.value)}
            </span>
          </div>
          <span className="text-[10px] sm:text-xs text-[#B0C4DE] mt-1 tracking-widest" style={{ fontFamily: "Orbitron, sans-serif" }}>
            {item.label}
          </span>
        </div>
      ))}
    </div>
  );
}
