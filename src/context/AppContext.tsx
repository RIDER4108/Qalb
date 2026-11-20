"use client";

import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from "react";
import { LocationConfig, PrayerItem, PrayerTimings, HijriDate, AladhanApiResponse } from "@/types/prayer";
import { DEFAULT_LOCATIONS, getPrayerTimesByCity, getPrayerTimesByCoords, computePrayerSchedule } from "@/services/aladhan";
import { computeQibla, QiblaCalculationResult } from "@/utils/qibla";
import { ADHKAR_COLLECTION } from "@/data/adhkar";
import { DhikrPreset, DEFAULT_PRESETS } from "@/data/tasbihPresets";

export { type DhikrPreset, DEFAULT_PRESETS } from "@/data/tasbihPresets";

export interface HabitStatus {
  sunnah: boolean;
  quran: boolean;
  adhkar: boolean;
}

export interface TasbihProgressItem {
  count: number;
  cycles: number;
}

export interface AppContextType {
  // Today Date Key (YYYY-MM-DD)
  todayKey: string;

  // Location & Timings
  currentLocation: LocationConfig;
  setLocation: (loc: LocationConfig) => void;
  prayerTimings: PrayerTimings | null;
  hijriDate: HijriDate | null;
  prayers: PrayerItem[];
  nextPrayer: PrayerItem | null;
  isLoadingPrayers: boolean;
  qiblaInfo: QiblaCalculationResult;

  // Prayer Tracking
  isPrayerCompletedToday: (prayerName: string) => boolean;
  togglePrayerToday: (prayerName: string) => void;
  isPrayerCompletedForDate: (dateKey: string, prayerName: string) => boolean;
  togglePrayerForDate: (dateKey: string, prayerName: string) => void;
  todayCompletedCount: number;

  // Habits
  habits: HabitStatus;
  toggleHabit: (habitKey: keyof HabitStatus) => void;
  isHabitCompletedForDate: (dateKey: string, habitKey: keyof HabitStatus) => boolean;
  toggleHabitForDate: (dateKey: string, habitKey: keyof HabitStatus) => void;

  // Tasbih
  tasbihCount: number;
  tasbihCycles: number;
  tasbihTodayTotal: number;
  tasbihHistory: Record<string, number>;
  tasbihProgress: Record<string, TasbihProgressItem>;
  tasbihPresets: DhikrPreset[];
  activeTasbihId: string;
  setActiveTasbihId: (id: string) => void;
  incrementTasbih: (target: number, tasbihId?: string) => void;
  resetTasbih: (tasbihId?: string) => void;
  resetTasbihCount: (tasbihId?: string) => void;
  resetTasbihCycles: (tasbihId?: string) => void;
  resetTasbihTotal: () => void;
  deleteTasbihProgress: (tasbihId: string) => void;
  addTasbih: (presetData: Omit<DhikrPreset, "id"> | DhikrPreset) => DhikrPreset;
  editTasbih: (id: string, updatedFields: Partial<DhikrPreset>) => void;
  deleteTasbih: (id: string) => void;

  // GPS
  gpsPermissionDenied: boolean;
  requestGpsLocation: () => void;

  // Adhkar
  adhkarCounts: Record<string, number>;
  incrementAdhkar: (id: string, target: number) => void;
  resetAdhkar: () => void;
  completedMorningAdhkarCount: number;

  // Streak
  streakDays: number;

  // Reminders
  reminders: Record<string, boolean>;
  toggleReminder: (prayerName: string) => void;
  saveReminders: (updated: Record<string, boolean>) => void;
}

const AppContext = createContext<AppContextType | null>(null);

export function getTodayKey(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [todayKey, setTodayKey] = useState<string>(() => getTodayKey());
  const [currentLocation, setCurrentLocation] = useState<LocationConfig>(DEFAULT_LOCATIONS[0]);
  const [prayerTimings, setPrayerTimings] = useState<PrayerTimings | null>(null);
  const [hijriDate, setHijriDate] = useState<HijriDate | null>(null);
  const [prayers, setPrayers] = useState<PrayerItem[]>([]);
  const [nextPrayer, setNextPrayer] = useState<PrayerItem | null>(null);
  const [isLoadingPrayers, setIsLoadingPrayers] = useState<boolean>(true);

  // Qibla Info
  const [qiblaInfo, setQiblaInfo] = useState<QiblaCalculationResult>(() =>
    computeQibla(DEFAULT_LOCATIONS[0].latitude || 21.4225, DEFAULT_LOCATIONS[0].longitude || 39.8262)
  );

  // GPS
  const [gpsPermissionDenied, setGpsPermissionDenied] = useState<boolean>(false);

  // Prayer Checkbox history: { [dateKey]: { [prayerKey]: boolean } }
  const [prayerHistory, setPrayerHistory] = useState<Record<string, Record<string, boolean>>>({});

  // Habits history: { [dateKey]: { sunnah: boolean; quran: boolean; adhkar: boolean } }
  const [habitHistory, setHabitHistory] = useState<Record<string, HabitStatus>>({});

  // Tasbih state & history
  const [activeTasbihId, setActiveTasbihId] = useState<string>("subhanallah");
  const [tasbihProgress, setTasbihProgress] = useState<Record<string, TasbihProgressItem>>({});
  const [tasbihTodayTotal, setTasbihTodayTotal] = useState<number>(0);
  const [tasbihHistory, setTasbihHistory] = useState<Record<string, number>>({});
  const [tasbihPresets, setTasbihPresets] = useState<DhikrPreset[]>(DEFAULT_PRESETS);
  const isTasbihHydratedRef = useRef<boolean>(false);

  const currentActiveProgress = tasbihProgress[activeTasbihId] || { count: 0, cycles: 0 };
  const tasbihCount = currentActiveProgress.count;
  const tasbihCycles = currentActiveProgress.cycles;

  // Adhkar
  const [adhkarCounts, setAdhkarCounts] = useState<Record<string, number>>({});

  // Reminders
  const [reminders, setReminders] = useState<Record<string, boolean>>({
    Fajr: true,
    Dhuhr: true,
    Asr: true,
    Maghrib: true,
    Isha: true,
  });

  // Load state on mount with automatic daily rollover check
  useEffect(() => {
    const today = getTodayKey();
    setTodayKey(today);

    // Location
    const savedLoc = localStorage.getItem("qalb-location");
    if (savedLoc) {
      try {
        const parsed = JSON.parse(savedLoc);
        setCurrentLocation(parsed);
      } catch (e) {}
    }

    // Prayer History
    const savedPrayers = localStorage.getItem("qalb-prayer-history");
    if (savedPrayers) {
      try {
        setPrayerHistory(JSON.parse(savedPrayers));
      } catch (e) {}
    }

    // Habits History
    const savedHabitHistory = localStorage.getItem("qalb-habit-history");
    if (savedHabitHistory) {
      try {
        setHabitHistory(JSON.parse(savedHabitHistory));
      } catch (e) {}
    }

    // Tasbih History
    let loadedHistory: Record<string, number> = {};
    const savedTasbihHistory = localStorage.getItem("qalb-tasbih-history");
    if (savedTasbihHistory) {
      try {
        loadedHistory = JSON.parse(savedTasbihHistory);
        setTasbihHistory(loadedHistory);
      } catch (e) {}
    }

    // Per-Tasbih Progress Items
    let loadedItems: Record<string, TasbihProgressItem> = {};
    const savedProgress = localStorage.getItem("qalb-tasbih-progress");
    if (savedProgress) {
      try {
        loadedItems = JSON.parse(savedProgress) || {};
      } catch (e) {}
    }

    const savedTasbih = localStorage.getItem("qalb-tasbih");
    let savedActiveId = "subhanallah";
    let savedTodayTotal = 0;

    if (savedTasbih) {
      try {
        const parsed = JSON.parse(savedTasbih);
        if (parsed.items && typeof parsed.items === "object") {
          loadedItems = { ...parsed.items, ...loadedItems };
        } else if (parsed.count != null || parsed.cycles != null) {
          // Migration from legacy single count
          if (!loadedItems["subhanallah"]) {
            loadedItems["subhanallah"] = {
              count: parsed.count ?? 0,
              cycles: parsed.cycles ?? 0,
            };
          }
        }
        if (parsed.activeId) {
          savedActiveId = parsed.activeId;
        }
        savedTodayTotal = parsed.todayTotal ?? 0;
      } catch (e) {}
    }

    setTasbihProgress(loadedItems);

    // Hydrate Tasbih Presets
    let loadedPresets: DhikrPreset[] = DEFAULT_PRESETS;
    try {
      const savedPresets = localStorage.getItem("qalb-tasbih-presets") || localStorage.getItem("qalb-tasbih-list");
      if (savedPresets) {
        const parsed = JSON.parse(savedPresets);
        if (Array.isArray(parsed) && parsed.length > 0) {
          loadedPresets = parsed;
        }
      } else {
        const savedCustoms = localStorage.getItem("qalb-custom-tasbihs");
        if (savedCustoms) {
          const parsedCustoms = JSON.parse(savedCustoms);
          if (Array.isArray(parsedCustoms) && parsedCustoms.length > 0) {
            loadedPresets = [...DEFAULT_PRESETS, ...parsedCustoms];
          }
        }
      }
    } catch (e) {
      console.error("Failed to load tasbih presets:", e);
    }
    setTasbihPresets(loadedPresets);
    isTasbihHydratedRef.current = true;

    // Active Tasbih restoration
    const savedSelectedId = localStorage.getItem("qalb-selected-tasbih-id");
    let chosenActiveId = savedActiveId;
    if (savedSelectedId) {
      chosenActiveId = savedSelectedId;
    }
    if (loadedPresets.some((p) => p.id === chosenActiveId)) {
      setActiveTasbihId(chosenActiveId);
    } else if (loadedPresets.length > 0) {
      setActiveTasbihId(loadedPresets[0].id);
    }

    // Check if the saved date matches today's local date (YYYY-MM-DD)
    const savedDate = localStorage.getItem("qalb-active-date");
    if (savedDate && savedDate !== today) {
      // Day has changed/rolled over: automatically clear stale daily state
      const todayTotal = loadedHistory[today] || 0;
      setTasbihTodayTotal(todayTotal);
      localStorage.setItem(
        "qalb-tasbih",
        JSON.stringify({
          activeId: savedActiveId,
          todayTotal,
          items: loadedItems,
          count: loadedItems[savedActiveId]?.count ?? 0,
          cycles: loadedItems[savedActiveId]?.cycles ?? 0,
        })
      );
      localStorage.setItem("qalb-tasbih-progress", JSON.stringify(loadedItems));

      // Clear today's adhkar counts
      setAdhkarCounts({});
      localStorage.removeItem("qalb-adhkar");

      // Update active date to today
      localStorage.setItem("qalb-active-date", today);
    } else {
      // Same day or first launch: normal hydration
      localStorage.setItem("qalb-active-date", today);

      const todayTotal = loadedHistory[today] ?? savedTodayTotal;
      setTasbihTodayTotal(todayTotal);
      localStorage.setItem("qalb-tasbih-progress", JSON.stringify(loadedItems));

      const savedAdhkar = localStorage.getItem("qalb-adhkar");
      if (savedAdhkar) {
        try {
          setAdhkarCounts(JSON.parse(savedAdhkar));
        } catch (e) {}
      }
    }

    // Reminders
    const savedReminders = localStorage.getItem("qalb-reminders");
    if (savedReminders) {
      try {
        setReminders(JSON.parse(savedReminders));
      } catch (e) {}
    }
  }, []);

  // Persist Tasbih Presets to localStorage (guarded against hydration overwrite)
  useEffect(() => {
    if (!isTasbihHydratedRef.current) return;
    try {
      localStorage.setItem("qalb-tasbih-presets", JSON.stringify(tasbihPresets));
      localStorage.setItem("qalb-tasbih-list", JSON.stringify(tasbihPresets));
      const customOnly = tasbihPresets.filter((p) => p.isCustom || p.id.startsWith("custom-"));
      localStorage.setItem("qalb-custom-tasbihs", JSON.stringify(customOnly));
    } catch (e) {
      console.error("Failed to persist tasbih presets:", e);
    }
  }, [tasbihPresets]);

  // Update Qibla when location changes
  useEffect(() => {
    const lat = currentLocation.latitude ?? 21.4225;
    const lng = currentLocation.longitude ?? 39.8262;
    // Compute local bearing first (instant feedback)
    setQiblaInfo(computeQibla(lat, lng));
    // Then fetch authoritative bearing from Aladhan Qibla API
    fetch(`https://api.aladhan.com/v1/qibla/${lat}/${lng}`, { cache: "no-store" })
      .then((r) => r.json())
      .then((json) => {
        if (json?.data?.direction != null) {
          const bearing = Math.round(json.data.direction);
          setQiblaInfo((prev) => ({ ...prev, bearing }));
        }
      })
      .catch(() => {}); // silently fall back to Haversine result
  }, [currentLocation]);

  // Load Prayer Timings
  const fetchTimings = useCallback(async (loc: LocationConfig) => {
    setIsLoadingPrayers(true);
    try {
      let res: AladhanApiResponse;
      if (loc.latitude && loc.longitude) {
        res = await getPrayerTimesByCoords(loc.latitude, loc.longitude, loc.method || 2);
      } else {
        res = await getPrayerTimesByCity(loc.city, loc.country, loc.method || 4);
      }
      setPrayerTimings(res.data.timings);
      setHijriDate(res.data.date.hijri);
      const computed = computePrayerSchedule(res.data.timings);
      setPrayers(computed.prayers);
      setNextPrayer(computed.nextPrayerInfo.nextPrayer);
    } catch (err) {
      console.error("Failed to fetch timings:", err);
    } finally {
      setIsLoadingPrayers(false);
    }
  }, []);

  useEffect(() => {
    fetchTimings(currentLocation);
  }, [currentLocation, fetchTimings]);

  // Periodic ticker for next prayer + midnight re-fetch and daily rollover
  useEffect(() => {
    if (!prayerTimings) return;
    let lastKey = getTodayKey();
    const interval = setInterval(() => {
      const computed = computePrayerSchedule(prayerTimings);
      setPrayers(computed.prayers);
      setNextPrayer(computed.nextPrayerInfo.nextPrayer);
      // Detect day rollover and re-fetch timings for the new day
      const currentKey = getTodayKey();
      if (currentKey !== lastKey) {
        lastKey = currentKey;
        setTodayKey(currentKey);
        setTasbihTodayTotal(0);
        setAdhkarCounts({});
        localStorage.setItem("qalb-active-date", currentKey);
        fetchTimings(currentLocation);
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [prayerTimings, currentLocation, fetchTimings]);

  const setLocation = (loc: LocationConfig) => {
    setCurrentLocation(loc);
    localStorage.setItem("qalb-location", JSON.stringify(loc));
  };

  // GPS location request
  const requestGpsLocation = useCallback(() => {
    if (typeof navigator === "undefined" || !navigator.geolocation) {
      setGpsPermissionDenied(true);
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const loc: LocationConfig = {
          city: "Current Location",
          country: "GPS",
          displayName: "Current Location (GPS)",
          latitude: pos.coords.latitude,
          longitude: pos.coords.longitude,
          method: 2,
        };
        setCurrentLocation(loc);
        localStorage.setItem("qalb-location", JSON.stringify(loc));
        setGpsPermissionDenied(false);
      },
      () => setGpsPermissionDenied(true),
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 60000 }
    );
  }, []);

  // Prayer Checkbox Sync
  const isPrayerCompletedForDate = (dateKey: string, prayerName: string) => {
    const normalized = prayerName.toLowerCase();
    return Boolean(prayerHistory[dateKey]?.[normalized]);
  };

  const isPrayerCompletedToday = (prayerName: string) => {
    return isPrayerCompletedForDate(todayKey, prayerName);
  };

  const togglePrayerForDate = (dateKey: string, prayerName: string) => {
    const normalized = prayerName.toLowerCase();
    setPrayerHistory((prev) => {
      const dayData = prev[dateKey] || {};
      const updatedDay = {
        ...dayData,
        [normalized]: !dayData[normalized],
      };
      const updated = {
        ...prev,
        [dateKey]: updatedDay,
      };
      localStorage.setItem("qalb-prayer-history", JSON.stringify(updated));
      return updated;
    });
  };

  const togglePrayerToday = (prayerName: string) => {
    togglePrayerForDate(todayKey, prayerName);
  };

  // Completed Fard prayers today
  const todayFardCompleted = ["fajr", "dhuhr", "asr", "maghrib", "isha"].filter(
    (p) => Boolean(prayerHistory[todayKey]?.[p])
  ).length;

  // Habits state for today (defaults to false for all habits on a fresh day)
  const habits: HabitStatus = habitHistory[todayKey] || {
    sunnah: false,
    quran: false,
    adhkar: false,
  };

  const isHabitCompletedForDate = (dateKey: string, habitKey: keyof HabitStatus): boolean => {
    return Boolean(habitHistory[dateKey]?.[habitKey]);
  };

  const toggleHabitForDate = (dateKey: string, habitKey: keyof HabitStatus) => {
    setHabitHistory((prev) => {
      const dayHabits = prev[dateKey] || { sunnah: false, quran: false, adhkar: false };
      const updatedDay: HabitStatus = {
        ...dayHabits,
        [habitKey]: !dayHabits[habitKey],
      };
      const updated = {
        ...prev,
        [dateKey]: updatedDay,
      };
      localStorage.setItem("qalb-habit-history", JSON.stringify(updated));
      return updated;
    });
  };

  const toggleHabit = (habitKey: keyof HabitStatus) => {
    toggleHabitForDate(todayKey, habitKey);
  };

  // Tasbih actions
  const incrementTasbih = (target: number, tasbihId?: string) => {
    const id = typeof tasbihId === "string" && tasbihId ? tasbihId : activeTasbihId || "subhanallah";
    const today = getTodayKey();
    const nextTotal = (tasbihHistory[today] || tasbihTodayTotal || 0) + 1;

    setTasbihHistory((prev) => {
      const updated = { ...prev, [today]: nextTotal };
      localStorage.setItem("qalb-tasbih-history", JSON.stringify(updated));
      return updated;
    });
    setTasbihTodayTotal(nextTotal);

    setTasbihProgress((prev) => {
      const current = prev[id] || { count: 0, cycles: 0 };
      const nextCount = current.count + 1;
      let updatedItem: TasbihProgressItem;

      if (nextCount >= target) {
        updatedItem = { count: 0, cycles: current.cycles + 1 };
      } else {
        updatedItem = { count: nextCount, cycles: current.cycles };
      }

      const updatedMap = { ...prev, [id]: updatedItem };
      try {
        const payload = {
          activeId: id,
          todayTotal: nextTotal,
          items: updatedMap,
          count: updatedItem.count,
          cycles: updatedItem.cycles,
        };
        localStorage.setItem("qalb-tasbih", JSON.stringify(payload));
        localStorage.setItem("qalb-tasbih-progress", JSON.stringify(updatedMap));
      } catch (e) {}
      return updatedMap;
    });
  };

  const resetTasbih = (tasbihId?: string) => {
    resetTasbihCount(tasbihId);
  };

  const resetTasbihCount = (tasbihId?: string) => {
    const id = typeof tasbihId === "string" && tasbihId ? tasbihId : activeTasbihId || "subhanallah";
    setTasbihProgress((prev) => {
      const current = prev[id] || { count: 0, cycles: 0 };
      const updatedItem = { count: 0, cycles: current.cycles };
      const updatedMap = { ...prev, [id]: updatedItem };
      try {
        const payload = {
          activeId: id,
          todayTotal: tasbihTodayTotal,
          items: updatedMap,
          count: 0,
          cycles: current.cycles,
        };
        localStorage.setItem("qalb-tasbih", JSON.stringify(payload));
        localStorage.setItem("qalb-tasbih-progress", JSON.stringify(updatedMap));
      } catch (e) {}
      return updatedMap;
    });
  };

  const resetTasbihCycles = (tasbihId?: string) => {
    const id = typeof tasbihId === "string" && tasbihId ? tasbihId : activeTasbihId || "subhanallah";
    setTasbihProgress((prev) => {
      const current = prev[id] || { count: 0, cycles: 0 };
      const updatedItem = { count: current.count, cycles: 0 };
      const updatedMap = { ...prev, [id]: updatedItem };
      try {
        const payload = {
          activeId: id,
          todayTotal: tasbihTodayTotal,
          items: updatedMap,
          count: current.count,
          cycles: 0,
        };
        localStorage.setItem("qalb-tasbih", JSON.stringify(payload));
        localStorage.setItem("qalb-tasbih-progress", JSON.stringify(updatedMap));
      } catch (e) {}
      return updatedMap;
    });
  };

  const resetTasbihTotal = () => {
    const today = getTodayKey();
    setTasbihHistory((prev) => {
      const updated = { ...prev, [today]: 0 };
      localStorage.setItem("qalb-tasbih-history", JSON.stringify(updated));
      return updated;
    });
    setTasbihTodayTotal(0);
    try {
      const current = tasbihProgress[activeTasbihId] || { count: 0, cycles: 0 };
      const payload = {
        activeId: activeTasbihId,
        todayTotal: 0,
        items: tasbihProgress,
        count: current.count,
        cycles: current.cycles,
      };
      localStorage.setItem("qalb-tasbih", JSON.stringify(payload));
    } catch (e) {}
  };

  const deleteTasbihProgress = (tasbihId: string) => {
    setTasbihProgress((prev) => {
      const updated = { ...prev };
      delete updated[tasbihId];
      try {
        localStorage.setItem("qalb-tasbih-progress", JSON.stringify(updated));
        const current = updated[activeTasbihId] || { count: 0, cycles: 0 };
        const payload = {
          activeId: activeTasbihId,
          todayTotal: tasbihTodayTotal,
          items: updated,
          count: current.count,
          cycles: current.cycles,
        };
        localStorage.setItem("qalb-tasbih", JSON.stringify(payload));
      } catch (e) {}
      return updated;
    });
  };

  const selectTasbih = useCallback((id: string) => {
    setActiveTasbihId(id);
    try {
      localStorage.setItem("qalb-selected-tasbih-id", id);
    } catch (e) {}
  }, []);

  const addTasbih = useCallback((presetData: Omit<DhikrPreset, "id"> | DhikrPreset): DhikrPreset => {
    const id = "id" in presetData && presetData.id ? presetData.id : `custom-${Date.now()}`;
    const newPreset: DhikrPreset = {
      id,
      name: presetData.name,
      arabic: presetData.arabic,
      meaning: presetData.meaning || "Custom Dhikr",
      target: presetData.target || 33,
      isCustom: true,
    };

    setTasbihPresets((prev) => {
      const updated = [...prev, newPreset];
      try {
        localStorage.setItem("qalb-tasbih-presets", JSON.stringify(updated));
        localStorage.setItem("qalb-tasbih-list", JSON.stringify(updated));
        const customOnly = updated.filter((p) => p.isCustom || p.id.startsWith("custom-"));
        localStorage.setItem("qalb-custom-tasbihs", JSON.stringify(customOnly));
      } catch (e) {}
      return updated;
    });

    selectTasbih(id);
    return newPreset;
  }, [selectTasbih]);

  const editTasbih = useCallback((id: string, updatedFields: Partial<DhikrPreset>) => {
    setTasbihPresets((prev) => {
      const updated = prev.map((p) => {
        if (p.id === id) {
          return { ...p, ...updatedFields };
        }
        return p;
      });
      try {
        localStorage.setItem("qalb-tasbih-presets", JSON.stringify(updated));
        localStorage.setItem("qalb-tasbih-list", JSON.stringify(updated));
        const customOnly = updated.filter((p) => p.isCustom || p.id.startsWith("custom-"));
        localStorage.setItem("qalb-custom-tasbihs", JSON.stringify(customOnly));
      } catch (e) {}
      return updated;
    });
  }, []);

  const deleteTasbih = useCallback((id: string) => {
    setTasbihPresets((prev) => {
      if (prev.length <= 1) return prev; // Protect very last remaining Tasbih
      const updated = prev.filter((p) => p.id !== id);
      try {
        localStorage.setItem("qalb-tasbih-presets", JSON.stringify(updated));
        localStorage.setItem("qalb-tasbih-list", JSON.stringify(updated));
        const customOnly = updated.filter((p) => p.isCustom || p.id.startsWith("custom-"));
        localStorage.setItem("qalb-custom-tasbihs", JSON.stringify(customOnly));
      } catch (e) {}

      // If active tasbih was deleted, switch active to the first remaining tasbih
      setActiveTasbihId((currentActiveId) => {
        if (currentActiveId === id) {
          const nextId = updated[0]?.id || DEFAULT_PRESETS[0].id;
          try {
            localStorage.setItem("qalb-selected-tasbih-id", nextId);
          } catch (e) {}
          return nextId;
        }
        return currentActiveId;
      });

      return updated;
    });
    deleteTasbihProgress(id);
  }, [deleteTasbihProgress]);

  // Adhkar actions
  const incrementAdhkar = (id: string, target: number) => {
    setAdhkarCounts((prev) => {
      const current = prev[id] || 0;
      if (current >= target) return prev;
      const updated = { ...prev, [id]: current + 1 };
      localStorage.setItem("qalb-adhkar", JSON.stringify(updated));
      return updated;
    });
  };

  const resetAdhkar = () => {
    setAdhkarCounts({});
    localStorage.removeItem("qalb-adhkar");
  };

  // Count of completed morning adhkar
  const morningItems = ADHKAR_COLLECTION.filter((i) => i.category === "morning");
  const completedMorningAdhkarCount = morningItems.filter(
    (i) => (adhkarCounts[i.id] || 0) >= i.targetCount
  ).length;

  // Streak Calculation (consecutive days with at least 1 prayer completed)
  const calculateStreak = () => {
    let streak = 0;
    const now = new Date();
    // Check backwards from today or yesterday
    for (let i = 0; i < 365; i++) {
      const d = new Date(now);
      d.setDate(d.getDate() - i);
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(
        d.getDate()
      ).padStart(2, "0")}`;
      const dayPrayers = prayerHistory[key];
      const hasAnyPrayer = dayPrayers && Object.values(dayPrayers).some(Boolean);
      if (hasAnyPrayer) {
        streak++;
      } else if (i === 0) {
        // If today has no prayer yet, don't break streak if yesterday had prayers
        continue;
      } else {
        break;
      }
    }
    return streak;
  };

  const streakDays = calculateStreak();

  // Reminders
  const toggleReminder = (prayerName: string) => {
    setReminders((prev) => {
      const updated = { ...prev, [prayerName]: !prev[prayerName] };
      localStorage.setItem("qalb-reminders", JSON.stringify(updated));
      return updated;
    });
  };

  const saveReminders = (updated: Record<string, boolean>) => {
    setReminders(updated);
    localStorage.setItem("qalb-reminders", JSON.stringify(updated));
  };

  return (
    <AppContext.Provider
      value={{
        todayKey,
        currentLocation,
        setLocation,
        prayerTimings,
        hijriDate,
        prayers,
        nextPrayer,
        isLoadingPrayers,
        qiblaInfo,
        isPrayerCompletedToday,
        togglePrayerToday,
        isPrayerCompletedForDate,
        togglePrayerForDate,
        todayCompletedCount: todayFardCompleted,
        habits,
        toggleHabit,
        isHabitCompletedForDate,
        toggleHabitForDate,
        tasbihCount,
        tasbihCycles,
        tasbihTodayTotal,
        tasbihHistory,
        tasbihProgress,
        tasbihPresets,
        activeTasbihId,
        setActiveTasbihId: selectTasbih,
        incrementTasbih,
        resetTasbih,
        resetTasbihCount,
        resetTasbihCycles,
        resetTasbihTotal,
        deleteTasbihProgress,
        addTasbih,
        editTasbih,
        deleteTasbih,
        gpsPermissionDenied,
        requestGpsLocation,
        adhkarCounts,
        incrementAdhkar,
        resetAdhkar,
        completedMorningAdhkarCount,
        streakDays,
        reminders,
        toggleReminder,
        saveReminders,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp(): AppContextType {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useApp must be used within an AppProvider");
  }
  return context;
}
