"use client";
import CountdownTimerUi from "@/components/ui/CountdownTimer";

export default function CountdownTimer({ targetIso }: { targetIso: string }) {
  return (
    <CountdownTimerUi
      targetIso={targetIso}
      accentColor="#00E5FF"
      textColor="#B0C4DE"
      surfaceClassName="glass-card glow-cyan"
    />
  );
}
