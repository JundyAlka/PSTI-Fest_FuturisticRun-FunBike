import Image from "next/image";
import { Map, Navigation } from "lucide-react";

export default function RouteMapImage({ theme = "run" }: { theme?: "run" | "bike" }) {
  const isRun = theme === "run";
  
  return (
    <div className={`relative overflow-hidden rounded-3xl border shadow-2xl ${isRun ? "border-[#00E5FF]/20 bg-[#0B1030]/85" : "border-orange-100 bg-white"}`}>
      <div className={`absolute inset-0 ${isRun ? "bg-[radial-gradient(circle_at_center,transparent_20%,rgba(7,11,32,0.6)_100%)]" : "bg-[linear-gradient(rgba(251,146,60,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(56,189,248,0.05)_1px,transparent_1px)] bg-[size:32px_32px]"}`} />
      
      <div className="relative p-2">
        <div className={`relative aspect-[4/3] w-full overflow-hidden rounded-2xl sm:aspect-video lg:aspect-[2/1] ${isRun ? "bg-[#070B20]" : "bg-orange-50"}`}>
          <Image
            src="/route-map.jpg"
            alt="Rute Event"
            fill
            className="object-cover transition-transform duration-700 hover:scale-105"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
          
          <div className="pointer-events-none absolute inset-0 rounded-2xl ring-1 ring-inset ring-black/10" />
        </div>
      </div>
      
      <div className={`border-t px-5 py-4 ${isRun ? "border-white/10" : "border-gray-100"}`}>
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
  );
}
