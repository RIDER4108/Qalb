"use client";

import { useEffect, useState, useCallback } from "react";
import { HomeHeader } from "@/components/HomeHeader";
import { HijriQiblaBanner } from "@/components/HijriQiblaBanner";
import { NextPrayerCard } from "@/components/NextPrayerCard";
import { TodayPrayersGrid } from "@/components/TodayPrayersGrid";
import { HomeStatBadges } from "@/components/HomeStatBadges";
import { DailyAyahCard } from "@/components/DailyAyahCard";
import { QuickAccessList } from "@/components/QuickAccessList";
import { DEFAULT_LOCATIONS, getPrayerTimesByCity, getPrayerTimesByCoords, computePrayerSchedule } from "@/services/aladhan";
import { AladhanApiResponse, LocationConfig, PrayerItem } from "@/types/prayer";
import { AlertCircle, RefreshCw } from "lucide-react";

export default function HomePage() {
  const [currentLocation, setCurrentLocation] = useState<LocationConfig>(DEFAULT_LOCATIONS[0]);
  const [apiData, setApiData] = useState<AladhanApiResponse["data"] | null>(null);
  const [prayers, setPrayers] = useState<PrayerItem[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const loadPrayerTimes = useCallback(async (location: LocationConfig) => {
    setIsLoading(true);
    setError(null);
    try {
      let res: AladhanApiResponse;
      if (location.latitude && location.longitude) {
        res = await getPrayerTimesByCoords(location.latitude, location.longitude, location.method || 2);
      } else {
        res = await getPrayerTimesByCity(location.city, location.country, location.method || 4);
      }
      setApiData(res.data);
      const computed = computePrayerSchedule(res.data.timings);
      setPrayers(computed.prayers);
    } catch (err: any) {
      console.error("Prayer fetch error:", err);
      setError("Unable to load live prayer times. Please check your internet connection.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    const stored = localStorage.getItem("qalb-location");
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        setCurrentLocation(parsed);
        loadPrayerTimes(parsed);
        return;
      } catch (e) {
        // ignore
      }
    }
    loadPrayerTimes(DEFAULT_LOCATIONS[0]);
  }, [loadPrayerTimes]);

  const handleSelectLocation = (loc: LocationConfig) => {
    setCurrentLocation(loc);
    localStorage.setItem("qalb-location", JSON.stringify(loc));
    loadPrayerTimes(loc);
  };

  return (
    <main className="space-y-4">
      {/* 1. App Header: As-Salamu Alaykum + Location + Action Icons */}
      <HomeHeader
        currentLocation={currentLocation}
        onSelectLocation={handleSelectLocation}
        isLoading={isLoading}
      />

      {/* Error state */}
      {error && (
        <div className="flex items-center justify-between p-3.5 rounded-2xl bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900/50 text-red-700 dark:text-red-400 text-xs">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
          <button
            onClick={() => loadPrayerTimes(currentLocation)}
            className="flex items-center gap-1 font-semibold underline ml-2"
          >
            <RefreshCw className="w-3 h-3" />
            Retry
          </button>
        </div>
      )}

      {/* 2. Top Hijri & Qibla Banner Card */}
      {isLoading && !apiData ? (
        <div className="w-full h-28 rounded-3xl animate-pulse bg-qalb-card dark:bg-qalb-night-card border border-qalb-border dark:border-qalb-night-border" />
      ) : apiData ? (
        <HijriQiblaBanner
          hijriDate={apiData.date.hijri}
          qiblaBearing={58}
        />
      ) : null}

      {/* 3. Next Prayer Card with Live Countdown & Progress Bar */}
      {apiData && (
        <NextPrayerCard
          timings={apiData.timings}
          onScheduleUpdate={setPrayers}
        />
      )}

      {/* 4. Today's Prayers Rectangles (Adjusted 2-column grid, zero wasted space) */}
      {prayers.length > 0 && (
        <TodayPrayersGrid
          prayers={prayers}
          onOpenTimetable={() => {}}
        />
      )}

      {/* 5. Stat Badges (Tasbih today, Morning Adhkar, Salah streak) */}
      <HomeStatBadges />

      {/* 6. Daily Ayah Card with Verified Scripture & Vocal Audio */}
      <DailyAyahCard />

      {/* 7. Quick Access Rectangles & Privacy Banner */}
      <QuickAccessList />
    </main>
  );
}
