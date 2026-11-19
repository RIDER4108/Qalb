"use client";

import { useEffect, useState, useCallback } from "react";
import { LocationSelector } from "@/components/LocationSelector";
import { ThemeToggle } from "@/components/ThemeToggle";
import { PrayerHero } from "@/components/PrayerHero";
import { PrayerRibbon } from "@/components/PrayerRibbon";
import { QuickWidgets } from "@/components/QuickWidgets";
import { DEFAULT_LOCATIONS, getPrayerTimesByCity, getPrayerTimesByCoords, computePrayerSchedule } from "@/services/aladhan";
import { AladhanApiResponse, LocationConfig, PrayerItem } from "@/types/prayer";
import { Sparkles, AlertCircle, RefreshCw } from "lucide-react";

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
      setError("Unable to load live prayer times. Please check your connection.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    // Check if user stored a preferred location
    const stored = localStorage.getItem("nur-location");
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
    localStorage.setItem("nur-location", JSON.stringify(loc));
    loadPrayerTimes(loc);
  };

  return (
    <main className="space-y-6">
      {/* Top Header */}
      <header className="flex items-center justify-between pt-2 pb-1">
        <div className="flex items-center gap-2.5">
          <div className="flex items-center justify-center w-9 h-9 rounded-2xl bg-sacred-emerald dark:bg-sacred-emerald-dark text-sacred-gold shadow-sm border border-sacred-gold/30">
            <span className="font-amiri text-lg font-bold">ن</span>
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h1 className="text-base font-bold tracking-tight text-sacred-ink-primary dark:text-sacred-night-primary font-sans">
                Nur
              </h1>
              <span
                dir="rtl"
                lang="ar"
                className="font-amiri text-xs font-semibold text-sacred-gold"
              >
                نُور
              </span>
            </div>
            <p className="text-[11px] text-sacred-ink-muted dark:text-sacred-night-muted">
              Sacred Companion
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <LocationSelector
            currentLocation={currentLocation}
            onSelectLocation={handleSelectLocation}
            isLoading={isLoading}
          />
          <ThemeToggle />
        </div>
      </header>

      {/* Error state if API fails */}
      {error && (
        <div className="flex items-center justify-between p-4 rounded-2xl bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900/50 text-red-700 dark:text-red-400 text-xs">
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

      {/* Main Hero Card */}
      {isLoading && !apiData ? (
        <div className="w-full h-56 rounded-3xl animate-pulse bg-sacred-emerald/20 dark:bg-sacred-night-card border border-sacred-parchment-border dark:border-sacred-night-border" />
      ) : apiData ? (
        <PrayerHero
          timings={apiData.timings}
          hijriDate={apiData.date.hijri}
          onScheduleUpdate={setPrayers}
        />
      ) : null}

      {/* Prayer Schedule Daily Ribbon */}
      {prayers.length > 0 && <PrayerRibbon prayers={prayers} />}

      {/* Quick Navigation Widgets */}
      <QuickWidgets />
    </main>
  );
}
