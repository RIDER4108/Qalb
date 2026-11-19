"use client";

import { Check, Sun } from "lucide-react";
import { useApp } from "@/context/AppContext";

interface TodayPrayersGridProps {
  onOpenTimetable?: () => void;
}

export function TodayPrayersGrid({ onOpenTimetable }: TodayPrayersGridProps) {
  const { prayers, nextPrayer, isPrayerCompletedToday, togglePrayerToday } = useApp();

  return (
    <section className="space-y-3">
      {/* Header */}
      <div className="flex items-center justify-between px-0.5">
        <h2 className="text-base font-serif font-bold text-qalb-ink dark:text-qalb-night-ink">
          Today's Prayers
        </h2>
        <button
          onClick={onOpenTimetable}
          className="text-xs font-semibold text-qalb-gold hover:text-qalb-gold-hover transition-colors"
        >
          Timetable
        </button>
      </div>

      {/* 2-Column Grid Adjusted so there is no space left */}
      <div className="grid grid-cols-2 gap-2.5">
        {prayers.map((prayer) => {
          // Exactly matching the next prayer banner
          const isNext = nextPrayer?.id === prayer.id;
          const isDone = isPrayerCompletedToday(prayer.id);
          const isSunrise = prayer.id === "Sunrise";

          return (
            <div
              key={prayer.id}
              onClick={() => !isSunrise && togglePrayerToday(prayer.id)}
              className={`relative flex flex-col justify-between rounded-2xl transition-all duration-200 cursor-pointer overflow-hidden border shadow-sm ${
                isNext
                  ? "bg-qalb-green text-white border-qalb-green shadow-qalb-float"
                  : "bg-qalb-card dark:bg-qalb-night-card text-qalb-ink dark:text-qalb-night-ink border-qalb-border dark:border-qalb-night-border hover:border-qalb-gold/60"
              }`}
            >
              {/* Card Body */}
              <div className="p-3.5 sm:p-4 flex flex-col justify-between flex-1">
                {/* Top Row: Name and Indicator */}
                <div className="flex items-center justify-between">
                  <span
                    className={`text-xs font-serif font-bold tracking-tight ${
                      isNext ? "text-white" : "text-qalb-ink dark:text-qalb-night-ink"
                    }`}
                  >
                    {prayer.nameEn}
                  </span>

                  {isDone ? (
                    <div className="flex items-center justify-center w-5 h-5 rounded-full bg-white text-qalb-green shadow-xs">
                      <Check className="w-3.5 h-3.5 stroke-[3]" />
                    </div>
                  ) : isSunrise ? (
                    <Sun className="w-4 h-4 text-qalb-muted" />
                  ) : isNext ? (
                    <div className="w-4 h-4 rounded-full border border-white/50" />
                  ) : (
                    <div className="w-4 h-4 rounded-full border border-qalb-border dark:border-qalb-night-border" />
                  )}
                </div>

                {/* Bottom Row: Scheduled Time & Arabic Name */}
                <div className="mt-2.5 flex items-end justify-between">
                  <span
                    className={`text-lg sm:text-xl font-serif font-bold tracking-tight tabular-nums ${
                      isNext ? "text-white" : "text-qalb-ink dark:text-qalb-night-ink"
                    }`}
                  >
                    {prayer.time24}
                  </span>
                  <span
                    dir="rtl"
                    lang="ar"
                    className={`font-indopak text-xs font-semibold ${
                      isNext ? "text-white/90" : "text-qalb-muted"
                    }`}
                  >
                    {prayer.nameAr}
                  </span>
                </div>
              </div>

              {/* Flush NEXT Badge pinned to the bottom of the active card */}
              {isNext && (
                <div className="w-full bg-qalb-green-dark py-1 text-center">
                  <span className="text-[9px] font-bold tracking-widest text-white/90 uppercase font-sans">
                    NEXT
                  </span>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}
