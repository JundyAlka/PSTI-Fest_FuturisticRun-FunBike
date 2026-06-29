"use client";
import CountdownTimer from "@/components/ui/CountdownTimer";

export default function FunBikeCountdown({ targetDate }: { targetDate: string | null }) {
  return (
    <CountdownTimer
      targetDate={targetDate}
      accentColor="#C2410C"
      textColor="#4B5563"
      surfaceClassName="border-2 border-[#F97316]/45 bg-white shadow-[0_8px_24px_rgba(194,65,12,0.14)]"
    />
  );
}
