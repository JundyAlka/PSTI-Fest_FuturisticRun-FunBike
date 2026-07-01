"use client";
import { useState, useEffect, useCallback, useRef } from "react";
import Image from "next/image";
import { Map, Minus, Plus, X, ZoomIn } from "lucide-react";
import { createPortal } from "react-dom";

export default function RouteMapImage({ theme = "run" }: { theme?: "run" | "bike" }) {
  const isRun = theme === "run";
  const [isOpen, setIsOpen] = useState(false);
  const [scale, setScale] = useState(1);
  const pinchRef = useRef<{ distance: number; scale: number } | null>(null);

  const clampScale = useCallback((next: number) => Math.min(4, Math.max(1, next)), []);
  const updateScale = useCallback((next: number) => setScale(clampScale(next)), [clampScale]);
  const openModal = useCallback(() => {
    setScale(1);
    pinchRef.current = null;
    setIsOpen(true);
  }, []);

  const distance = (touches: React.TouchList) => {
    const [first, second] = [touches.item(0), touches.item(1)];
    if (!first || !second) return 0;
    return Math.hypot(first.clientX - second.clientX, first.clientY - second.clientY);
  };

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
      pinchRef.current = null;
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  return (
    <>
      <div 
        className={`group relative overflow-hidden rounded-3xl border shadow-2xl cursor-pointer transition-all hover:shadow-orange-500/10 ${isRun ? "border-[#00E5FF]/20 bg-[#0B1030]/85" : "border-orange-100 bg-white"}`}
        onClick={openModal}
      >
        <div className={`absolute inset-0 ${isRun ? "bg-[radial-gradient(circle_at_center,transparent_20%,rgba(7,11,32,0.6)_100%)]" : "bg-[linear-gradient(rgba(251,146,60,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(56,189,248,0.05)_1px,transparent_1px)] bg-[size:32px_32px]"}`} />
        
        <div className="relative p-2">
          <div className={`relative w-full overflow-hidden rounded-2xl ${isRun ? "bg-[#070B20]" : "bg-orange-50"}`}>
            <Image
              src="/route-map.jpg"
              alt="Rute Event"
              width={1200}
              height={800}
              className="w-full h-auto object-cover transition-transform duration-700 group-hover:scale-105"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
            
            <div className="pointer-events-none absolute inset-0 rounded-2xl ring-1 ring-inset ring-black/10" />
            
            {/* Hover overlay hint */}
            <div className="absolute inset-0 flex items-center justify-center bg-black/0 transition-colors duration-300 group-hover:bg-black/25">
              <div className="flex translate-y-4 items-center gap-2 rounded-full bg-black/75 px-5 py-2.5 text-sm font-bold text-white opacity-0 backdrop-blur-md transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
                <ZoomIn size={18} /> Klik untuk perbesar
              </div>
            </div>
          </div>
        </div>
        
        <div className={`border-t px-5 py-4 relative z-10 ${isRun ? "border-white/10" : "border-gray-100"}`}>
          <div className="flex items-center gap-3">
            <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${isRun ? "bg-[#00E5FF]/10 text-[#00E5FF]" : "bg-orange-100 text-orange-600"}`}>
              <Map size={20} />
            </div>
            <div>
              <h4 className={`font-black ${isRun ? "text-white" : "text-gray-900"}`} style={{ fontFamily: "Orbitron, sans-serif" }}>
                {isRun ? "PETA RUTE SEMENTARA" : "RUTE MASIH DISURVEI"}
              </h4>
              <p className={`text-xs ${isRun ? "text-[#B0C4DE]" : "text-gray-500"}`}>
                {isRun ? "Detail rute dan check-point final akan diumumkan menyusul." : "Rute Fun Bike belum final dan masih dalam tahap survei panitia."}
              </p>
            </div>
          </div>
        </div>
      </div>

      {isOpen && createPortal(
        <div 
          className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-black/95 backdrop-blur-xl transition-all duration-300"
          onClick={() => setIsOpen(false)}
        >
          {/* Header Action */}
          <div className="absolute top-0 left-0 right-0 flex items-center justify-between p-4 z-[110] bg-gradient-to-b from-black/80 to-transparent">
            <div className="text-white/80 text-xs font-semibold px-4 tracking-widest uppercase">Gunakan dua jari untuk zoom</div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white backdrop-blur-md transition-colors hover:bg-white/25"
                onClick={(event) => {
                  event.stopPropagation();
                  updateScale(scale - 0.5);
                }}
                aria-label="Perkecil peta rute"
              >
                <Minus size={18} />
              </button>
              <button
                type="button"
                className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white backdrop-blur-md transition-colors hover:bg-white/25"
                onClick={(event) => {
                  event.stopPropagation();
                  updateScale(scale + 0.5);
                }}
                aria-label="Perbesar peta rute"
              >
                <Plus size={18} />
              </button>
              <button 
                type="button"
                className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white backdrop-blur-md hover:bg-white/25 transition-colors cursor-pointer"
                onClick={(event) => {
                  event.stopPropagation();
                  setIsOpen(false);
                }}
                aria-label="Tutup peta rute"
              >
                <X size={20} />
              </button>
            </div>
          </div>
          
          {/* Scrollable / Zoomable container */}
          <div
            className="h-full w-full overflow-auto overscroll-contain"
            onClick={(e) => e.stopPropagation()}
            onTouchStart={(event) => {
              if (event.touches.length === 2) {
                pinchRef.current = { distance: distance(event.touches), scale };
              }
            }}
            onTouchMove={(event) => {
              if (event.touches.length !== 2 || !pinchRef.current) return;
              event.preventDefault();
              const nextDistance = distance(event.touches);
              if (nextDistance <= 0 || pinchRef.current.distance <= 0) return;
              updateScale(pinchRef.current.scale * (nextDistance / pinchRef.current.distance));
            }}
            onTouchEnd={() => {
              pinchRef.current = null;
            }}
            style={{ touchAction: "none" }}
          >
            <div className="flex min-h-full items-center justify-center p-2 sm:p-8">
              <Image
                src="/route-map.jpg" 
                alt="Peta Rute Full" 
                width={1200}
                height={800}
                className="h-auto w-full max-w-none select-none object-contain transition-transform duration-100 md:max-w-6xl"
                draggable={false}
                style={{ transform: `scale(${scale})`, transformOrigin: "center center", touchAction: "none" }}
              />
            </div>
          </div>
        </div>,
        document.body
      )}
    </>
  );
}
