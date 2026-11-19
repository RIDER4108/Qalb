"use client";

import { PrayerItem } from "@/types/prayer";
import { Check, Sun, Moon, Sunrise, Sunset, CloudSun } from "lucide-react";

interface PrayerRibbonProps {
  prayers: PrayerItem[];
}

export function PrayerRibbon({ prayers }: PrayerRibbonProps) {
  const getPrayerIcon = (id: PrayerItem["id"]) => {
    switch (id) {
      case "Fajr":
        return <Sunrise className="w-4 h-4 text-sacred-gold" />;
      case "Sunrise":
        return <Sun className="w-4 h-4 text-amber-500" />;
      case "Dhuhr":
        return <Sun className="w-4 h-4 text-sacred-gold" />;
      case "Asr":
        return <CloudSun className="w-4 h-4 text-sacred-gold" />;
      case "Maghrib":
        return <Sunset className="w-4 h-4 text-amber-500" />;
      case "Isha":
        return <Moon className="w-4 h-4 text-sacred-gold" />;
      default:
        return <Sun className="w-4 h-4" />;
    }
  };

  return (
    <section className="space-y-3">
      <div className="flex items-center justify-between px-1">
        <h2 className="text-sm font-semibold tracking-tight text-sacred-ink-primary dark:text-sacred-night-primary font-sans">
          Today's Prayer Schedule
        </h2>
        <span className="text-xs text-sacred-ink-muted dark:text-sacred-night-muted">
          5 Obligatory • 1 Sunrise
        </span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5">
        {prayers.map((prayer) => {
          const isActive = prayer.status === "active";
          const isPassed = prayer.status === "passed";

          return (
            <div
              key={prayer.id}
              className={`relative flex flex-col justify-between p-3.5 rounded-2xl transition-all duration-200 border ${
                isActive
                  ? "bg-sacred-emerald text-white border-sacred-gold shadow-sacred-float dark:bg-sacred-emerald-dark"
                  : isPassed
                  ? "bg-sacred-parchment-card/60 dark:bg-sacred-night-card/40 border-sacred-parchment-border/60 dark:border-sacred-night-border/50 opacity-70"
                  : "bg-sacred-parchment-card dark:bg-sacred-night-card border-sacred-parchment-border dark:border-sacred-night-border hover:border-sacred-gold/50 shadow-sm"
              }`}
            >
              {/* Header row: Icon & Status */}
              <div className="flex items-center justify-between">
                <div
                  className={`p-1.5 rounded-xl ${
                    isActive
                      ? "bg-white/10 text-sacred-gold"
                      : "bg-sacred-parchment-subtle dark:bg-sacred-night-subtle text-sacred-ink-secondary dark:text-sacred-night-secondary"
                  }`}
                >
                  {getPrayerIcon(prayer.id)}
                </div>

                {isActive && (
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold tracking-wide bg-sacred-gold text-sacred-emerald-dark uppercase">
                    Active
                  </span>
                )}
                {isPassed && (
                  <span className="flex items-center gap-0.5 text-[10px] text-sacred-ink-muted dark:text-sacred-night-muted font-medium">
                    <Check className="w-3 h-3 text-emerald-500" />
                  </span>
                )}
              </div>

              {/* Names & Time */}
              <div className="mt-3">
                <div className="flex items-baseline justify-between">
                  <span
                    className={`text-xs font-semibold font-sans ${
                      isActive
                        ? "text-white"
                        : "text-sacred-ink-primary dark:text-sacred-night-primary"
                    }`}
                  >
                    {prayer.nameEn}
                  </span>
                  <span
                    dir="rtl"
                    lang="ar"
                    className={`font-arabic-ui text-xs font-medium ${
                      isActive
                        ? "text-sacred-gold-subtle"
                        : "text-sacred-ink-secondary dark:text-sacred-night-secondary"
                    }`}
                  >
                    {prayer.nameAr}
                  </span>
                </div>

                <div
                  className={`mt-1 text-sm font-bold font-sans tabular-nums ${
                    isActive
                      ? "text-sacred-gold"
                      : "text-sacred-ink-primary dark:text-sacred-night-primary"
                  }`}
                >
                  {prayer.time12}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
