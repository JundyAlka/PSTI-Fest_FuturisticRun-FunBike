"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { ExternalLink, MapPin, Navigation } from "lucide-react";
import GlowButton from "./GlowButton";

export type LocationMapProps = {
  lat: number;
  lng: number;
  label: string;
  plusCode?: string;
  theme: "run" | "bike";
};

export default function LocationMap({ lat, lng, label, plusCode, theme }: LocationMapProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const [nearViewport, setNearViewport] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const isRun = theme === "run";
  const accent = isRun ? "#00E5FF" : "#FF6B2C";

  useEffect(() => {
    const node = rootRef.current;
    if (!node) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        setNearViewport(true);
        observer.disconnect();
      },
      { rootMargin: "300px 0px" }
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  const urls = useMemo(() => {
    const destination = `${lat},${lng}`;
    return {
      embed: `https://www.google.com/maps?q=${encodeURIComponent(destination)}&z=16&output=embed`,
      directions: `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(destination)}`,
      place: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(destination)}`,
    };
  }, [lat, lng]);

  return (
    <div ref={rootRef} className="flex flex-col gap-0 overflow-hidden rounded-2xl">
      {/* Map frame with gradient border */}
      <div
        className={`relative overflow-hidden rounded-t-2xl p-px ${isRun ? "bg-gradient-to-br from-[#00E5FF] via-[#8B00FF] to-[#00E5FF]" : "bg-gradient-to-br from-[#FF6B2C] via-[#F59E0B] to-[#38BDF8]"}`}
      >
        <div className={`relative overflow-hidden rounded-[calc(1rem-1px)] ${isRun ? "bg-[#070B20]" : "bg-[#FFF7ED]"}`} style={{ aspectRatio: "16/10" }}>
          {!loaded && <div className="location-map-skeleton absolute inset-0 bg-[#0B1230]" aria-hidden="true" />}

          {nearViewport ? (
            <iframe
              title={`Peta lokasi ${label}`}
              src={urls.embed}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className={`absolute inset-0 h-full w-full border-0 transition-opacity duration-500 ${loaded ? "opacity-100" : "opacity-0"}`}
              style={isRun ? { filter: "invert(0.9) hue-rotate(180deg) saturate(1.1) contrast(0.95) brightness(0.82)" } : { filter: "saturate(0.9) contrast(0.96)" }}
              onLoad={() => setLoaded(true)}
            />
          ) : null}

          <div className={`pointer-events-none absolute inset-0 ${isRun ? "bg-[radial-gradient(circle_at_center,transparent_30%,rgba(7,11,32,0.15)_65%,rgba(7,11,32,0.55)_100%)]" : "bg-[radial-gradient(circle_at_center,transparent_30%,rgba(255,247,237,0.04)_60%,rgba(124,45,18,0.18)_100%)]"}`} />
          <div className="pointer-events-none absolute inset-0 rounded-[calc(1rem-1px)] ring-1 ring-inset ring-white/10" />

          {/* Center marker */}
          <div className="location-map-marker pointer-events-none absolute left-1/2 top-1/2 z-20 flex size-12 -translate-x-1/2 -translate-y-1/2 items-center justify-center" style={{ color: accent }} aria-hidden="true">
            <span className="location-map-pulse absolute left-1/2 top-1/2 size-12 rounded-full border-2" style={{ borderColor: accent, boxShadow: `0 0 28px ${accent}` }} />
            <span className="location-map-pulse absolute left-1/2 top-1/2 size-12 rounded-full border" style={{ borderColor: accent, boxShadow: `0 0 20px ${accent}`, animationDelay: "1.2s" }} />
            <span className="relative flex size-12 items-center justify-center rounded-full border border-white/40 bg-[#070B20]/95 shadow-2xl backdrop-blur-md" style={{ boxShadow: `0 0 30px ${accent}99` }}>
              <MapPin size={24} strokeWidth={2.4} />
            </span>
          </div>
        </div>
      </div>

      {/* Info card below map */}
      <div className={`rounded-b-2xl border-x border-b p-4 ${isRun ? "border-[#1E3A5F]/60 bg-[#070B20]/95" : "border-orange-200/60 bg-white"}`}>
        <div className="flex items-center gap-3 mb-3">
          <span className="flex size-9 shrink-0 items-center justify-center rounded-xl" style={{ color: accent, background: `${accent}18`, border: `1px solid ${accent}44` }}>
            <MapPin size={17} aria-hidden="true" />
          </span>
          <div className="min-w-0">
            <p className="text-[0.6rem] font-bold uppercase tracking-[0.16em]" style={{ color: accent }}>Start & Finish</p>
            <h3 className={`truncate text-sm font-black sm:text-base ${isRun ? "text-white" : "text-gray-900"}`} style={{ fontFamily: "Orbitron, sans-serif" }}>{label}</h3>
            {plusCode ? <p className={`mt-0.5 text-[10px] ${isRun ? "text-[#B8C7DE]" : "text-gray-500"}`}>Plus Code: {plusCode}</p> : null}
          </div>
        </div>
        <div className="grid grid-cols-2 gap-2">
          <GlowButton href={urls.directions} target="_blank" rel="noopener noreferrer" ariaLabel={`Petunjuk arah ke ${label}`} accentColor={accent} className="w-full px-3 py-2 text-[0.68rem] sm:text-xs">
            <Navigation size={14} /> Petunjuk Arah
          </GlowButton>
          <GlowButton href={urls.place} target="_blank" rel="noopener noreferrer" ariaLabel={`Buka ${label} di Google Maps`} accentColor={accent} outline className="w-full px-3 py-2 text-[0.68rem] sm:text-xs">
            <ExternalLink size={14} /> Buka di Maps
          </GlowButton>
        </div>
      </div>
    </div>
  );
}
