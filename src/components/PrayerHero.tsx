"use client";

import { useEffect, useState } from "react";
import { HijriDate, PrayerItem, PrayerTimings } from "@/types/prayer";
import { computePrayerSchedule, NextPrayerComputation } from "@/services/aladhan";
import { Clock, Calendar, Sparkles } from "lucide-react";

interface PrayerHeroProps {
  timings: PrayerTimings;
  hijriDate: HijriDate;
  onScheduleUpdate?: (prayers: PrayerItem[]) => void;
}

export function PrayerHero({ timings, hijriDate, onScheduleUpdate }: PrayerHeroProps) {
  const [computation, setComputation] = useState<NextPrayerComputation | null>(null);

  useEffect(() => {
    // Initial compute
    const initial = computePrayerSchedule(timings);
    setComputation(initial.nextPrayerInfo);
    if (onScheduleUpdate) {
      onScheduleUpdate(initial.prayers);
    }

    // Live ticker every 1 second
    const interval = setInterval(() => {
      const updated = computePrayerSchedule(timings);
      setComputation(updated.nextPrayerInfo);
      if (onScheduleUpdate) {
        onScheduleUpdate(updated.prayers);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [timings, onScheduleUpdate]);

  if (!computation) {
    return (
      <div className="w-full h-56 rounded-3xl animate-pulse bg-sacred-emerald/20 dark:bg-sacred-night-card border border-sacred-parchment-border dark:border-sacred-night-border" />
    );
  }

  const { nextPrayer, currentPrayer, formattedCountdown, progressPercent } = computation;

  return (
    <section className="relative overflow-hidden rounded-3xl p-6 sm:p-7 text-white shadow-sacred-float bg-gradient-to-br from-[#164E3D] via-[#103E30] to-[#0B2A20] border border-sacred-emerald-dark dark:border-sacred-night-border">
      {/* Subtle architectural background motifs */}
      <div className="absolute -top-12 -right-12 w-48 h-48 rounded-full border border-sacred-gold/15 pointer-events-none" />
      <div className="absolute -top-8 -right-8 w-40 h-40 rounded-full border border-sacred-gold/10 pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-sacred-gold/5 blur-3xl pointer-events-none rounded-full" />

      {/* Top Meta: Hijri Date */}
      <div className="relative z-10 flex items-center justify-between pb-4 border-b border-white/10">
        <div className="flex items-center gap-2 text-xs font-medium text-sacred-gold-subtle/90">
          <Calendar className="w-3.5 h-3.5 text-sacred-gold" />
          <span>
            {hijriDate.day} {hijriDate.month.en} {hijriDate.year} {hijriDate.designation.abbreviated}
          </span>
        </div>
        <div
          dir="rtl"
          lang="ar"
          className="font-amiri text-sm font-semibold text-sacred-gold tracking-wide leading-none"
        >
          {hijriDate.day} {hijriDate.month.ar} {hijriDate.year} هـ
        </div>
      </div>

      {/* Hero Body: Next Prayer & Countdown */}
      <div className="relative z-10 pt-5 pb-4">
        <div className="flex items-start justify-between">
          <div>
            <span className="text-xs uppercase tracking-wider text-sacred-gold-subtle/80 font-sans font-medium">
              Next Prayer
            </span>
            <div className="flex items-baseline gap-3 mt-1">
              <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-white font-sans">
                {nextPrayer.nameEn}
              </h1>
              <span
                dir="rtl"
                lang="ar"
                className="font-amiri text-2xl sm:text-3xl text-sacred-gold font-bold leading-none"
              >
                {nextPrayer.nameAr}
              </span>
            </div>
            <p className="mt-1 text-sm text-sacred-gold-subtle/80 flex items-center gap-1.5 font-sans">
              <Clock className="w-3.5 h-3.5 text-sacred-gold" />
              Scheduled at {nextPrayer.time12}
            </p>
          </div>

          {/* Countdown Clock Box */}
          <div className="text-right">
            <span className="text-[11px] uppercase tracking-wider text-sacred-gold-subtle/80 font-medium">
              Time Remaining
            </span>
            <div className="mt-1 px-3 py-1.5 rounded-2xl bg-black/25 backdrop-blur-md border border-sacred-gold/20 inline-block">
              <span className="text-2xl sm:text-3xl font-bold tracking-tight text-sacred-gold font-sans tabular-nums">
                {formattedCountdown}
              </span>
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mt-6 space-y-1.5">
          <div className="flex items-center justify-between text-[11px] text-sacred-gold-subtle/70">
            <span>
              {currentPrayer ? `Current: ${currentPrayer.nameEn} (${currentPrayer.time12})` : "Prayer Transition"}
            </span>
            <span className="tabular-nums">{Math.round(progressPercent)}% elapsed</span>
          </div>
          <div className="w-full h-1.5 rounded-full bg-white/10 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-sacred-gold/80 to-sacred-gold rounded-full transition-all duration-1000 ease-linear"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
