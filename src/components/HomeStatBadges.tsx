"use client";

import Link from "next/link";
import { CircleDot, BookOpen, Flame } from "lucide-react";
import { useApp } from "@/context/AppContext";

export function HomeStatBadges() {
  const { tasbihTodayTotal, completedMorningAdhkarCount, streakDays } = useApp();

  return (
    <section className="grid grid-cols-3 gap-2.5">
      {/* 1. Tasbih Card */}
      <Link
        href="/tasbih"
        className="flex flex-col items-center justify-center p-3 sm:p-3.5 rounded-2xl text-center bg-qalb-card dark:bg-qalb-night-card border border-qalb-border dark:border-qalb-night-border shadow-qalb-card hover:border-qalb-gold/60 transition-all active:scale-98"
      >
        <div className="flex items-center justify-center w-8 h-8 rounded-full bg-[#E3F2ED] text-[#1D7A5C]">
          <CircleDot className="w-4 h-4 stroke-[2.5]" />
        </div>
        <span className="mt-2 text-base font-bold text-qalb-ink dark:text-qalb-night-ink tabular-nums">
          {tasbihTodayTotal.toLocaleString()}
        </span>
        <span className="text-[10px] text-qalb-muted mt-0.5 truncate max-w-full font-sans">
          Tasbih today
        </span>
      </Link>

      {/* 2. Morning Adhkar Card */}
      <Link
        href="/adhkar"
        className="flex flex-col items-center justify-center p-3 sm:p-3.5 rounded-2xl text-center bg-qalb-card dark:bg-qalb-night-card border border-qalb-border dark:border-qalb-night-border shadow-qalb-card hover:border-qalb-gold/60 transition-all active:scale-98"
      >
        <div className="flex items-center justify-center w-8 h-8 rounded-full bg-[#FEF6E4] text-[#C28C1A]">
          <BookOpen className="w-4 h-4 stroke-[2.5]" />
        </div>
        <span className="mt-2 text-base font-bold text-qalb-ink dark:text-qalb-night-ink tabular-nums">
          {completedMorningAdhkarCount}/6
        </span>
        <span className="text-[10px] text-qalb-muted mt-0.5 truncate max-w-full font-sans">
          Morning Adhkar
        </span>
      </Link>

      {/* 3. Salah Streak Card */}
      <Link
        href="/tracker"
        className="flex flex-col items-center justify-center p-3 sm:p-3.5 rounded-2xl text-center bg-qalb-card dark:bg-qalb-night-card border border-qalb-border dark:border-qalb-night-border shadow-qalb-card hover:border-qalb-gold/60 transition-all active:scale-98"
      >
        <div className="flex items-center justify-center w-8 h-8 rounded-full bg-[#F3EBF9] text-[#7C3AED]">
          <Flame className="w-4 h-4 fill-current stroke-none" />
        </div>
        <span className="mt-2 text-base font-bold text-qalb-ink dark:text-qalb-night-ink tabular-nums">
          {streakDays} {streakDays === 1 ? "day" : "days"}
        </span>
        <span className="text-[10px] text-qalb-muted mt-0.5 truncate max-w-full font-sans">
          Salah streak
        </span>
      </Link>
    </section>
  );
}
