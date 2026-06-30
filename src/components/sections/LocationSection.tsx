import { ExternalLink, MapPin, MapPinned } from "lucide-react";
import AnimatedSectionTitle from "@/components/AnimatedSectionTitle";
import LocationMap from "@/components/ui/LocationMap";
import RouteMapImage from "@/components/ui/RouteMapImage";
import { EVENTS, type EventLocation } from "@/content/events";
import { resolveEventLocation } from "@/lib/eventLocation";

const event = EVENTS["futuristic-run"];

export default function LocationSection({ settings }: { settings: Record<string, string> }) {
  const location = resolveEventLocation(event.location as EventLocation, settings);
  const address = settings.event_location_address?.trim() || "Alun-Alun Purworejo, Purworejo, Jawa Tengah";
  const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${location.lat},${location.lng}`)}`;
  return (
    <section id="location" className="section-reveal relative overflow-hidden py-10 sm:py-16">
      <div className="absolute inset-0 bg-gradient-to-b from-[#080C20] via-[#0C1230] to-[#080C20]" />
      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-8 text-center sm:mb-10">
          <div className="badge-neon mb-4 inline-flex items-center gap-2"><MapPinned size={14} /> LOKASI & RUTE</div>
          <AnimatedSectionTitle text="TEMUKAN TITIK START & RUTE" className="mb-4 text-4xl font-black sm:text-5xl" />
          <p className="mx-auto max-w-2xl text-sm leading-6 text-[#B0C4DE] sm:text-base">Pusat kegiatan Futuristic Run, mulai dari persiapan hingga garis finish.</p>
        </div>
        
        <div className="grid gap-6 lg:grid-cols-2">
          <LocationMap {...location} theme="run" />
          <RouteMapImage theme="run" />
        </div>
        
        <div className="mt-6 rounded-2xl border border-[#00E5FF]/20 bg-[#0B1030]/85 p-5 shadow-[0_0_28px_rgba(0,229,255,0.08)]">
          <MapPin size={22} className="mb-3 text-[#00E5FF]" />
          <p className="text-xs font-black uppercase tracking-[0.18em] text-[#B0C4DE]">Titik Kumpul</p>
          <h3 className="mt-2 text-2xl font-black text-white" style={{ fontFamily: "Orbitron, sans-serif" }}>{location.label}</h3>
          <p className="mt-2 text-sm leading-6 text-[#B0C4DE]">{address}</p>
          <a
            href={mapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-outline-neon mt-4 inline-flex min-h-11 items-center gap-2 rounded-full px-5 text-sm"
          >
            <ExternalLink size={16} /> Buka di Google Maps
          </a>
        </div>
      </div>
    </section>
  );
}
