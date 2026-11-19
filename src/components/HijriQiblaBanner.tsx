"use client";

import Link from "next/link";
import { Navigation } from "lucide-react";
import { useEffect, useState } from "react";
import { useApp } from "@/context/AppContext";

export function HijriQiblaBanner() {
  const { hijriDate, qiblaInfo } = useApp();
  const [timeStr, setTimeStr] = useState<string>("");

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const options: Intl.DateTimeFormatOptions = {
        day: "numeric",
        month: "long",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      };
      const formatted = now.toLocaleDateString("en-GB", options).replace(",", " •");
      setTimeStr(formatted);
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  if (!hijriDate) {
    return (
      <div className="w-full h-28 rounded-3xl animate-pulse bg-qalb-card dark:bg-qalb-night-card border border-qalb-border dark:border-qalb-night-border" />
    );
  }

  return (
    <section className="relative overflow-hidden rounded-3xl p-5 sm:p-6 text-white shadow-qalb-float bg-qalb-green dark:bg-qalb-green-dark border border-qalb-green-dark">
      <div className="absolute -top-10 -right-10 w-44 h-44 rounded-full bg-white/5 pointer-events-none" />

      <div className="relative z-10 flex items-center justify-between gap-3">
        {/* Left Side: Hijri & Gregorian Dates */}
        <div className="space-y-1">
          <span className="text-[10px] font-bold uppercase tracking-widest text-[#B5D4C7] font-sans">
            TODAY • HIJRI DATE
          </span>
          <h2 className="text-xl sm:text-2xl font-serif font-bold text-white tracking-tight leading-snug">
            {hijriDate.day} {hijriDate.month.en} {hijriDate.year}
          </h2>
          <p className="text-xs text-white/70 font-sans">
            {timeStr || `${new Date().toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })}`}
          </p>
        </div>

        {/* Right Side: Embedded Qibla Card */}
        <Link
          href="/qibla"
          className="shrink-0 group flex flex-col items-center justify-center px-3.5 py-2.5 rounded-2xl bg-white/10 hover:bg-white/15 border border-white/15 transition-all text-center min-w-[85px] active:scale-95"
          title="Open Qibla Finder"
        >
          <span className="text-[10px] uppercase font-bold tracking-wider text-white/80">
            QIBLA
          </span>
          <span className="text-sm font-bold text-white font-sans mt-0.5">
            {qiblaInfo.bearing}° {qiblaInfo.cardinal}
          </span>
          <div className="mt-1 flex items-center justify-center w-5 h-5 rounded-full bg-white/20 text-white">
            <Navigation className="w-3 h-3 group-hover:rotate-45 transition-transform" />
          </div>
        </Link>
      </div>
    </section>
  );
}
