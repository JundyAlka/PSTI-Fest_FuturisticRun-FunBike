"use client";
import CountdownTimerUi from "@/components/ui/CountdownTimer";

export default function CountdownTimer({ targetDate }: { targetDate: string | null }) {
  return (
    <CountdownTimerUi
      targetDate={targetDate}
      accentColor="#00E5FF"
      textColor="#B0C4DE"
      surfaceClassName="glass-card glow-cyan"
    />
  );
}
