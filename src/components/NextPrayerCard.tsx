"use client";

import { useEffect, useState } from "react";
import { Clock } from "lucide-react";
import { PrayerItem, PrayerTimings } from "@/types/prayer";
import { computePrayerSchedule, NextPrayerComputation } from "@/services/aladhan";

interface NextPrayerCardProps {
  timings: PrayerTimings;
  onScheduleUpdate?: (prayers: PrayerItem[]) => void;
}

export function NextPrayerCard({ timings, onScheduleUpdate }: NextPrayerCardProps) {
  const [computation, setComputation] = useState<NextPrayerComputation | null>(null);

  useEffect(() => {
    const update = () => {
      const schedule = computePrayerSchedule(timings);
      setComputation(schedule.nextPrayerInfo);
      if (onScheduleUpdate) {
        onScheduleUpdate(schedule.prayers);
      }
    };

    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, [timings, onScheduleUpdate]);

  if (!computation) {
    return (
      <div className="w-full h-32 rounded-3xl bg-qalb-card dark:bg-qalb-night-card animate-pulse border border-qalb-border dark:border-qalb-night-border" />
    );
  }

  const { nextPrayer, secondsRemaining, progressPercent } = computation;

  // Format countdown like the screenshot: "7h 27m 12s"
  const hours = Math.floor(secondsRemaining / 3600);
  const mins = Math.floor((secondsRemaining % 3600) / 60);
  const secs = secondsRemaining % 60;
  const countdownPill = `${hours}h ${mins}m ${secs}s`;

  return (
    <section className="p-5 rounded-3xl bg-qalb-card dark:bg-qalb-night-card border border-qalb-border dark:border-qalb-night-border shadow-qalb-card space-y-3.5">
      {/* Top Row: Prayer name + Time & Countdown Pill */}
      <div className="flex items-center justify-between">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-qalb-gold font-sans">
            NEXT PRAYER • {nextPrayer.nameEn.toUpperCase()}
          </span>
          <div className="flex items-baseline gap-2 mt-0.5">
            <span className="text-2xl font-serif font-bold text-qalb-ink dark:text-qalb-night-ink tracking-tight">
              {nextPrayer.time24}
            </span>
            <span
              dir="rtl"
              lang="ar"
              className="font-amiri text-lg font-bold text-qalb-muted"
            >
              {nextPrayer.nameAr}
            </span>
          </div>
        </div>

        {/* Live Countdown Pill in Dark Forest Green */}
        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-qalb-green dark:bg-qalb-green-dark text-white text-xs font-semibold font-sans shadow-sm">
          <Clock className="w-3.5 h-3.5 text-qalb-gold" />
          <span className="tabular-nums">{countdownPill}</span>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full h-1.5 rounded-full bg-qalb-card-subtle dark:bg-qalb-night-subtle overflow-hidden">
        <div
          className="h-full bg-qalb-gold rounded-full transition-all duration-1000 ease-linear"
          style={{ width: `${progressPercent}%` }}
        />
      </div>

      {/* Footnote */}
      <div className="flex items-center justify-between text-xs text-qalb-muted">
        <span>{hours > 0 ? `${hours}h ${mins}m until ${nextPrayer.nameEn}` : `${mins}m until ${nextPrayer.nameEn}`} • Stay mindful</span>
      </div>
    </section>
  );
}
