"use client";
import CountdownTimer from "@/components/ui/CountdownTimer";

export default function FunBikeCountdown({ targetIso }: { targetIso: string }) {
  return (
    <CountdownTimer
      targetIso={targetIso}
      accentColor="#C2410C"
      textColor="#4B5563"
      surfaceClassName="border-2 border-[#F97316]/45 bg-white shadow-[0_8px_24px_rgba(194,65,12,0.14)]"
    />
  );
}
