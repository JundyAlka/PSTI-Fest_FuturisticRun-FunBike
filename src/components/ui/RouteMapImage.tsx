"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import { Map, X, ZoomIn } from "lucide-react";
import { createPortal } from "react-dom";

export default function RouteMapImage({ theme = "run" }: { theme?: "run" | "bike" }) {
  const isRun = theme === "run";
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  return (
    <>
      <div 
        className={`group relative overflow-hidden rounded-3xl border shadow-2xl cursor-pointer transition-all hover:shadow-orange-500/10 ${isRun ? "border-[#00E5FF]/20 bg-[#0B1030]/85" : "border-orange-100 bg-white"}`}
        onClick={() => setIsOpen(true)}
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
                PETA RUTE SEMENTARA
              </h4>
              <p className={`text-xs ${isRun ? "text-[#B0C4DE]" : "text-gray-500"}`}>
                Detail rute dan check-point final akan diumumkan menyusul.
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
            <button 
              className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white backdrop-blur-md hover:bg-white/25 transition-colors cursor-pointer"
              onClick={() => setIsOpen(false)}
            >
              <X size={20} />
            </button>
          </div>
          
          {/* Scrollable / Zoomable container */}
          <div className="h-full w-full overflow-auto touch-pan-x touch-pan-y" onClick={(e) => e.stopPropagation()}>
            <div className="flex min-h-full items-center justify-center p-2 sm:p-8">
              <Image
                src="/route-map.jpg" 
                alt="Peta Rute Full" 
                width={1200}
                height={800}
                className="w-full h-auto max-w-none md:max-w-6xl object-contain pointer-events-auto" 
                style={{ touchAction: "pan-x pan-y pinch-zoom" }}
              />
            </div>
          </div>
        </div>,
        document.body
      )}
    </>
  );
}
