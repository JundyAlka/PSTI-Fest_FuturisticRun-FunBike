"use client";

import { useEffect, useMemo } from "react";
import { usePathname } from "next/navigation";

function eventFromPath(pathname: string) {
  if (pathname.startsWith("/fun-bike")) return "fun-bike";
  if (pathname.startsWith("/futuristic-run") || pathname.startsWith("/daftar") || pathname.startsWith("/cek")) return "futuristic-run";
  return "hub";
}

function ensureSessionId() {
  const key = "fv-visitor-session";
  const existing = localStorage.getItem(key);
  if (existing) return existing;
  const generated = crypto.randomUUID?.() ?? `${Date.now()}-${Math.random().toString(36).slice(2)}`;
  localStorage.setItem(key, generated);
  return generated;
}

export default function VisitorTracker() {
  const pathname = usePathname();
  const eventType = useMemo(() => eventFromPath(pathname), [pathname]);

  useEffect(() => {
    if (pathname.startsWith("/admin") || pathname.startsWith("/api")) return;
    let cancelled = false;

    const sendHeartbeat = () => {
      if (cancelled) return;
      const payload = JSON.stringify({
        sessionId: ensureSessionId(),
        eventType,
        path: pathname,
        referrer: document.referrer || "",
        screen: `${window.innerWidth}x${window.innerHeight}`,
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      });

      if (navigator.sendBeacon) {
        navigator.sendBeacon("/api/visitor/heartbeat", payload);
        return;
      }

      void fetch("/api/visitor/heartbeat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: payload,
        keepalive: true,
      });
    };

    sendHeartbeat();
    const timer = window.setInterval(sendHeartbeat, 20_000);
    return () => {
      cancelled = true;
      window.clearInterval(timer);
    };
  }, [eventType, pathname]);

  return null;
}
