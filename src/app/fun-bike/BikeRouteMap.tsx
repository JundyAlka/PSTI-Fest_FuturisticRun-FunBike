"use client";

import { useEffect, useRef, useState } from "react";
import { MapPin, Navigation } from "lucide-react";
import type { LngLatBoundsLike, Map as MapLibreMap } from "maplibre-gl";

const routeCoordinates: [number, number][] = [
  [110.0090583, -7.7130878],
  [110.0122, -7.7119],
  [110.0163, -7.7126],
  [110.0181, -7.7162],
  [110.0145, -7.7197],
  [110.0099, -7.7204],
  [110.0065, -7.7174],
  [110.0090583, -7.7130878],
];

const checkpoints = [
  { label: "Start", coord: routeCoordinates[0] },
  { label: "Checkpoint 1", coord: routeCoordinates[2] },
  { label: "Checkpoint 2", coord: routeCoordinates[4] },
  { label: "Finish", coord: routeCoordinates[routeCoordinates.length - 1] },
];

export default function BikeRouteMap() {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<MapLibreMap | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;
    let cancelled = false;

    async function initMap() {
      const maplibregl = await import("maplibre-gl");
      if (cancelled || !containerRef.current) return;

      const map = new maplibregl.Map({
        container: containerRef.current,
        center: routeCoordinates[0],
        zoom: 14,
        attributionControl: false,
        interactive: true,
        style: {
          version: 8,
          sources: {},
          layers: [
            { id: "background", type: "background", paint: { "background-color": "#FFF7ED" } },
          ],
        },
      });

      mapRef.current = map;

      map.on("load", () => {
        map.addSource("bike-route", {
          type: "geojson",
          data: {
            type: "Feature",
            properties: {},
            geometry: {
              type: "LineString",
              coordinates: routeCoordinates,
            },
          },
        });

        map.addLayer({
          id: "route-glow",
          type: "line",
          source: "bike-route",
          layout: { "line-cap": "round", "line-join": "round" },
          paint: {
            "line-color": "#38BDF8",
            "line-width": 12,
            "line-opacity": 0.18,
          },
        });

        map.addLayer({
          id: "route-main",
          type: "line",
          source: "bike-route",
          layout: { "line-cap": "round", "line-join": "round" },
          paint: {
            "line-color": "#FF6B2C",
            "line-width": 5,
            "line-opacity": 0.92,
          },
        });

        checkpoints.forEach((checkpoint, index) => {
          const marker = document.createElement("div");
          marker.className = "flex h-9 w-9 items-center justify-center rounded-full border-2 border-white bg-[#FF6B2C] text-xs font-black text-white shadow-lg";
          marker.textContent = index === 0 ? "S" : index === checkpoints.length - 1 ? "F" : String(index);

          new maplibregl.Marker({ element: marker, anchor: "center" })
            .setLngLat(checkpoint.coord)
            .setPopup(new maplibregl.Popup({ offset: 18 }).setText(checkpoint.label))
            .addTo(map);
        });

        const bounds: LngLatBoundsLike = [
          [110.0052, -7.7216],
          [110.0193, -7.7107],
        ];
        map.fitBounds(bounds, { padding: 34, duration: 0 });
        setReady(true);
      });
    }

    initMap();

    return () => {
      cancelled = true;
      mapRef.current?.remove();
      mapRef.current = null;
    };
  }, []);

  return (
    <div className="relative overflow-hidden rounded-2xl border border-orange-200 bg-white shadow-inner">
      <div className="absolute inset-0 bg-[linear-gradient(rgba(251,146,60,0.14)_1px,transparent_1px),linear-gradient(90deg,rgba(56,189,248,0.14)_1px,transparent_1px)] bg-[size:32px_32px]" />
      <div ref={containerRef} className="relative h-[320px] w-full sm:h-[380px]" />
      {!ready ? (
        <div className="absolute inset-0 grid place-items-center bg-[#FFF7ED]/80">
          <div className="flex items-center gap-2 rounded-full border border-orange-200 bg-white px-4 py-2 text-sm font-bold text-gray-700 shadow-sm">
            <Navigation size={16} className="text-[#FF6B2C]" />
            Memuat peta rute
          </div>
        </div>
      ) : null}
      <div className="pointer-events-none absolute left-4 top-4 rounded-2xl border border-white/80 bg-white/90 p-3 shadow-lg backdrop-blur">
        <p className="flex items-center gap-2 text-xs font-black uppercase tracking-[0.16em] text-gray-500">
          <MapPin size={14} className="text-[#FF6B2C]" />
          Rute Fun Ride
        </p>
        <p className="mt-1 text-sm font-semibold text-gray-900">Start & finish Alun-Alun Purworejo</p>
      </div>
    </div>
  );
}
