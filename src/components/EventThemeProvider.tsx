"use client";

import React from "react";

export type EventType = "futuristic-run" | "fun-bike" | string;

type ThemeVars = Record<string, string>;

const THEMES: Record<string, ThemeVars> = {
  "futuristic-run": {
    "--bg-base": "#0A0E27",
    "--bg-surface": "#0F1535",
    "--accent-1": "#00E5FF",
    "--accent-2": "#8B00FF",
    "--accent-3": "#FF006E",
    "--text-primary": "#FFFFFF",
    "--text-secondary": "#B0C4DE",
    "--text-accent": "#FFD700",
    "--border-color": "#1E3A5F",
  },
  "fun-bike": {
    "--bg-base": "#FFF8F0",
    "--bg-surface": "#FFFFFF",
    "--accent-1": "#FF6B2C",
    "--accent-2": "#7BC142",
    "--accent-3": "#38BDF8",
    "--text-primary": "#1A1A2E",
    "--text-secondary": "#4B5563",
    "--text-accent": "#FF6B2C",
    "--border-color": "#E5E7EB",
  },
};

const DEFAULT_THEME = THEMES["futuristic-run"];

interface EventThemeProviderProps {
  eventType?: EventType;
  children: React.ReactNode;
  className?: string;
}

export default function EventThemeProvider({
  eventType = "futuristic-run",
  children,
  className,
}: EventThemeProviderProps) {
  const vars = THEMES[eventType] ?? DEFAULT_THEME;

  return (
    <div className={className} style={vars as React.CSSProperties}>
      {children}
    </div>
  );
}
