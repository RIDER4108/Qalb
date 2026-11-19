"use client";

import { HomeHeader } from "@/components/HomeHeader";
import { HijriQiblaBanner } from "@/components/HijriQiblaBanner";
import { NextPrayerCard } from "@/components/NextPrayerCard";
import { TodayPrayersGrid } from "@/components/TodayPrayersGrid";
import { HomeStatBadges } from "@/components/HomeStatBadges";
import { DailyAyahCard } from "@/components/DailyAyahCard";
import { QuickAccessList } from "@/components/QuickAccessList";
import { useApp } from "@/context/AppContext";

export default function HomePage() {
  const { isLoadingPrayers } = useApp();

  return (
    <main className="space-y-4">
      {/* 1. App Header: As-Salamu Alaykum + Location + Action Icons */}
      <HomeHeader />

      {/* 2. Top Hijri & Qibla Banner Card */}
      <HijriQiblaBanner />

      {/* 3. Next Prayer Card with Live Countdown & Progress Bar */}
      <NextPrayerCard />

      {/* 4. Today's Prayers Rectangles (Adjusted 2-column grid, zero wasted space) */}
      <TodayPrayersGrid onOpenTimetable={() => {}} />

      {/* 5. Stat Badges (Tasbih today, Morning Adhkar, Salah streak) */}
      <HomeStatBadges />

      {/* 6. Daily Ayah Card with Verified Scripture & Vocal Audio */}
      <DailyAyahCard />

      {/* 7. Quick Access Rectangles & Privacy Banner */}
      <QuickAccessList />
    </main>
  );
}
