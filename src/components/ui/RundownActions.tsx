"use client";

import { CalendarPlus, Download } from "lucide-react";
import type { RundownItem } from "@/content/events";
import { eventDateOnly, formatTanggalID } from "@/lib/eventDate";

type RundownActionsProps = {
  items: RundownItem[];
  eventName: string;
  eventDate: string | null;
  theme: "run" | "bike";
};

/**
 * Build a plain-text rundown for PDF-like download (as .txt, no heavy lib needed).
 */
function buildRundownText(items: RundownItem[], eventName: string, eventDate: string | null): string {
  const header = `SUSUNAN ACARA — ${eventName}${eventDate ? `\nTanggal: ${formatTanggalID(eventDate)}` : ""}\n${"═".repeat(50)}\n\n`;
  const body = items
    .map(
      (item, i) =>
        `${String(i + 1).padStart(2, " ")}. [${item.time}] ${item.activity}${item.duration ? `  (${item.duration})` : ""}${item.pic ? `\n      PIC: ${item.pic}` : ""}`,
    )
    .join("\n\n");
  return header + body + `\n\n${"═".repeat(50)}\nDiunduh dari website resmi ${eventName}\n`;
}

/**
 * Build an .ics calendar file for the event.
 */
function buildICS(eventName: string, eventDate: string, startTime: string, endTime: string): string {
  const parseTime = (t: string) => t.replace(".", "");
  const dateOnly = eventDateOnly(eventDate);
  const compactDate = dateOnly.replace(/-/g, "");
  const dtStart = `${compactDate}T${parseTime(startTime)}00`;
  const dtEnd = `${compactDate}T${parseTime(endTime)}00`;

  return [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//FuturisticVibes//EventRundown//ID",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    "BEGIN:VEVENT",
    `DTSTART;TZID=Asia/Jakarta:${dtStart}`,
    `DTEND;TZID=Asia/Jakarta:${dtEnd}`,
    `SUMMARY:${eventName}`,
    `DESCRIPTION:Susunan Acara ${eventName}. Lihat detail di website resmi.`,
    "STATUS:CONFIRMED",
    `UID:${dateOnly}-${eventName.replace(/\s+/g, "-").toLowerCase()}@futuristicvibes.id`,
    "END:VEVENT",
    "END:VCALENDAR",
  ].join("\r\n");
}

function downloadBlob(content: string, filename: string, mimeType: string) {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

const styles = {
  run: {
    btn: "border-[#1E3A5F] bg-[#0B1030]/90 text-[#D7E8FF] hover:border-[#00E5FF]/50 hover:bg-[#0B1030]",
    icon: "#00E5FF",
  },
  bike: {
    btn: "border-gray-200 bg-white text-gray-700 hover:border-[#FF6B2C]/40 hover:bg-orange-50",
    icon: "#FF6B2C",
  },
} as const;

export default function RundownActions({ items, eventName, eventDate, theme }: RundownActionsProps) {
  const s = styles[theme];

  const handleDownloadRundown = () => {
    const text = buildRundownText(items, eventName, eventDate);
    const safeName = eventName.replace(/\s+/g, "_").toLowerCase();
    downloadBlob(text, `rundown_${safeName}.txt`, "text/plain;charset=utf-8");
  };

  const handleAddToCalendar = () => {
    if (!eventDate) return;
    // Extract first and last rundown times
    const firstTime = items[0]?.time.split("-")[0] || "06.00";
    const lastTime = items[items.length - 1]?.time.split("-")[1] || items[items.length - 1]?.time.split("-")[0] || "09.00";
    const ics = buildICS(eventName, eventDate, firstTime, lastTime);
    const safeName = eventName.replace(/\s+/g, "_").toLowerCase();
    downloadBlob(ics, `${safeName}.ics`, "text/calendar;charset=utf-8");
  };

  return (
    <div className="mt-8 flex flex-wrap justify-center gap-3">
      <button
        type="button"
        onClick={handleDownloadRundown}
        className={`inline-flex cursor-pointer items-center gap-2 rounded-xl border px-5 py-3 text-sm font-semibold transition-all duration-300 ${s.btn}`}
      >
        <Download size={16} style={{ color: s.icon }} />
        Unduh Rundown
      </button>
      {eventDate && (
        <button
          type="button"
          onClick={handleAddToCalendar}
          className={`inline-flex cursor-pointer items-center gap-2 rounded-xl border px-5 py-3 text-sm font-semibold transition-all duration-300 ${s.btn}`}
        >
          <CalendarPlus size={16} style={{ color: s.icon }} />
          Tambahkan ke Kalender
        </button>
      )}
    </div>
  );
}
