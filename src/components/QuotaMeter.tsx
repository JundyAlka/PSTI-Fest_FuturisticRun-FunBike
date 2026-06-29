"use client";

import { useEffect, useRef, useState } from "react";
import TbdBadge from "@/components/ui/TbdBadge";

type QuotaMeterProps = {
  category?: string;
  fallbackTotal?: number;
  eventType?: string;
};

type QuotaState = {
  total: number;
  filled: number;
  remaining: number;
};

export default function QuotaMeter({ category = "5K", fallbackTotal = 0, eventType = "futuristic-run" }: QuotaMeterProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [retryKey, setRetryKey] = useState(0);
  const [quota, setQuota] = useState<QuotaState>({
    total: fallbackTotal,
    filled: 0,
    remaining: fallbackTotal,
  });
  const [displayPercent, setDisplayPercent] = useState(0);
  const [displayFilled, setDisplayFilled] = useState(0);
  const [displayRemaining, setDisplayRemaining] = useState(0);

  const filledPercent = quota.total > 0 ? Math.min(100, Math.round((quota.filled / quota.total) * 100)) : 0;
  const visualPercent = filledPercent > 0 ? Math.max(filledPercent, 4) : 0;

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reducedMotion) {
      const timeout = window.setTimeout(() => setVisible(true), 0);
      return () => window.clearTimeout(timeout);
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        setVisible(true);
        observer.disconnect();
      },
      { threshold: 0.45 }
    );

    observer.observe(element);

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    let alive = true;
    const resetTimer = window.setTimeout(() => {
      if (!alive) return;
      setLoading(true);
      setError(false);
    }, 0);

    fetch(`/api/quota?eventType=${encodeURIComponent(eventType)}`, { cache: "no-store" })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to load quota");
        return res.json();
      })
      .then((data) => {
        const next = data?.[category];
        const total = Number(next?.total) || fallbackTotal;
        const filled = Number(next?.filled) || 0;
        const remaining = Number.isFinite(Number(next?.remaining))
          ? Number(next.remaining)
          : Math.max(0, total - filled);

        if (alive) setQuota({ total, filled, remaining });
      })
      .catch(() => {
        if (alive) {
          setError(true);
          setQuota({ total: fallbackTotal, filled: 0, remaining: fallbackTotal });
        }
      })
      .finally(() => {
        if (alive) setLoading(false);
      });

    return () => {
      alive = false;
      window.clearTimeout(resetTimer);
    };
  }, [category, fallbackTotal, eventType, retryKey]);

  useEffect(() => {
    if (!visible || loading) return;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reducedMotion) {
      const timeout = window.setTimeout(() => {
        setDisplayPercent(filledPercent);
        setDisplayFilled(quota.filled);
        setDisplayRemaining(quota.remaining);
      }, 0);
      return () => window.clearTimeout(timeout);
    }

    let raf = 0;
    let frame = 0;
    const totalFrames = 58;

    const animate = () => {
      frame += 1;
      const progress = Math.min(frame / totalFrames, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplayPercent(Math.round(filledPercent * eased));
      setDisplayFilled(Math.round(quota.filled * eased));
      setDisplayRemaining(Math.round(quota.remaining * eased));

      if (frame < totalFrames) {
        raf = requestAnimationFrame(animate);
      }
    };

    raf = requestAnimationFrame(animate);

    return () => cancelAnimationFrame(raf);
  }, [filledPercent, loading, quota.filled, quota.remaining, visible]);

  return (
    <div ref={ref} className="quota-meter">
      {loading ? (
        <div className="space-y-3">
          <div className="flex items-center justify-between gap-3">
            <div className="skeleton-shimmer h-4 w-24 rounded" />
            <div className="skeleton-shimmer h-4 w-20 rounded" />
          </div>
          <div className="skeleton-shimmer h-3 w-full rounded-full" />
          <div className="flex items-center justify-between gap-3">
            <div className="skeleton-shimmer h-3 w-32 rounded" />
            <div className="skeleton-shimmer h-3 w-16 rounded" />
          </div>
        </div>
      ) : error ? (
        <div className="rounded-xl border border-[#FF8C00]/30 bg-[#FF8C00]/10 p-4 text-sm">
          <div className="mb-2 font-semibold text-[#FFB000]">Kuota belum bisa dimuat.</div>
          <p className="mb-3 text-[#B0C4DE]">Coba lagi sebentar. Pendaftaran tetap mengikuti kuota resmi panitia.</p>
          <button
            type="button"
            onClick={() => setRetryKey((key) => key + 1)}
            className="min-h-11 rounded-full border border-[#FFB000]/40 px-4 py-2 text-xs font-bold text-[#FFB000] transition-colors hover:bg-[#FFB000]/10"
          >
            Coba lagi
          </button>
        </div>
      ) : quota.total <= 0 ? (
        <div className="flex items-center justify-between gap-3 text-sm">
          <span className="text-[#B0C4DE]">Kuota Tersedia</span>
          <TbdBadge className="border-[#00E5FF]/20 bg-[#00E5FF]/5 text-[#D7E8FF]" />
        </div>
      ) : (
        <>
          <div className="mb-2 flex items-center justify-between gap-3 text-sm">
            <span className="inline-flex items-center gap-2 rounded-full border border-[#00E5FF]/25 bg-[#00E5FF]/10 px-3 py-1 text-xs font-bold uppercase tracking-[0.16em] text-[#00E5FF]">
              Sisa Slot
            </span>
            <span className="font-bold text-[#00E5FF]" style={{ fontFamily: "Orbitron, sans-serif" }}>
              {`${displayRemaining} tersisa`}
            </span>
          </div>

          <div
            className="quota-track"
            role="progressbar"
            aria-label={`Kuota ${category} terisi ${filledPercent} persen`}
            aria-valuenow={filledPercent}
            aria-valuemin={0}
            aria-valuemax={100}
          >
            <div
              className={`quota-fill ${visible ? "is-active" : ""}`}
              style={{ width: visible ? `${visualPercent}%` : "0%" }}
            >
              <span className="quota-fill-glint" />
            </div>
            <div className="quota-markers">
              {[25, 50, 75].map((marker) => (
                <span key={marker} style={{ left: `${marker}%` }} />
              ))}
            </div>
          </div>

          <div className="mt-2 flex items-center justify-between gap-3 text-xs text-[#B0C4DE]">
            <span>{`Terisi ${displayFilled} dari ${quota.total} peserta`}</span>
            <span className="font-semibold text-[#00E5FF]">{displayPercent}% terisi</span>
          </div>
        </>
      )}
    </div>
  );
}
