"use client";

import { useState, useMemo, useEffect, useCallback } from "react";
import { Flame, Check, Moon, BookOpen, Sparkles, Trophy, Calendar, CheckCircle2, Lock } from "lucide-react";
import { useApp, HabitStatus } from "@/context/AppContext";

interface HabitDefinition {
  key: keyof HabitStatus;
  title: string;
  subtitle: string;
  icon: typeof Moon;
  iconBg: string;
  iconColor: string;
}

const HABIT_DEFINITIONS: HabitDefinition[] = [
  {
    key: "sunnah",
    title: "Sunnah Prayers",
    subtitle: "Duha, Tahajjud, Witr",
    icon: Moon,
    iconBg: "bg-[#FEF6E4] dark:bg-amber-950/30",
    iconColor: "text-[#C28C1A] dark:text-amber-400",
  },
  {
    key: "quran",
    title: "Quran Reading",
    subtitle: "At least 1 page",
    icon: BookOpen,
    iconBg: "bg-qalb-card-subtle dark:bg-qalb-night-subtle",
    iconColor: "text-qalb-ink dark:text-qalb-night-ink",
  },
  {
    key: "adhkar",
    title: "Dhikr & Adhkar",
    subtitle: "Morning & Evening",
    icon: Sparkles,
    iconBg: "bg-[#FEF6E4] dark:bg-amber-950/30",
    iconColor: "text-[#C28C1A] dark:text-amber-400",
  },
];

export default function TrackerPage() {
  const {
    todayKey,
    prayers,
    isPrayerCompletedForDate,
    togglePrayerForDate,
    isHabitCompletedForDate,
    toggleHabitForDate,
    streakDays,
  } = useApp();

  const [selectedDateKey, setSelectedDateKey] = useState<string>(todayKey);
  const [clientWeekday, setClientWeekday] = useState<string>("");
  const [clientTodayKey, setClientTodayKey] = useState<string>(todayKey);

  // Compute 6 dynamic days strip centered on local today
  const generateWeekDays = useCallback((baseKey: string) => {
    const list: { dayName: string; dateNum: number; dateKey: string; isToday: boolean }[] = [];
    const now = new Date();
    // 4 days prior, today, 1 day after
    for (let i = -4; i <= 1; i++) {
      const d = new Date(now);
      d.setDate(d.getDate() + i);
      const dayName = d.toLocaleDateString("en-US", { weekday: "short" });
      const dateNum = d.getDate();
      const dateKey = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(
        d.getDate()
      ).padStart(2, "0")}`;
      list.push({
        dayName,
        dateNum,
        dateKey,
        isToday: dateKey === baseKey,
      });
    }
    return list;
  }, []);

  const [weekDays, setWeekDays] = useState<{ dayName: string; dateNum: number; dateKey: string; isToday: boolean }[]>(
    () => generateWeekDays(todayKey)
  );

  // Refresh client weekday, selected date, and week days strictly on client mount in user's local timezone
  useEffect(() => {
    const now = new Date();
    const currentWeekdayName = now.toLocaleDateString("en-US", { weekday: "long" });
    setClientWeekday(currentWeekdayName);
    setClientTodayKey(todayKey);
    setSelectedDateKey(todayKey);
    setWeekDays(generateWeekDays(todayKey));
  }, [todayKey, generateWeekDays]);

  // Fard prayers (excluding Sunrise)
  const fardPrayers = useMemo(() => {
    return prayers.filter((p) => p.id !== "Sunrise");
  }, [prayers]);

  const completedFardCount = fardPrayers.filter((p) =>
    isPrayerCompletedForDate(selectedDateKey, p.id)
  ).length;

  const completedHabitsCount = HABIT_DEFINITIONS.filter((h) =>
    isHabitCompletedForDate(selectedDateKey, h.key)
  ).length;

  const totalCompleted = completedFardCount + completedHabitsCount;
  const totalPossible = fardPrayers.length + HABIT_DEFINITIONS.length; // 5 + 3 = 8
  const completionPercent = totalPossible > 0 ? Math.round((totalCompleted / totalPossible) * 100) : 0;

  // Selected date human labels computed dynamically from selectedDateKey
  const selectedDateObj = useMemo(() => {
    const parts = selectedDateKey.split("-").map(Number);
    if (parts.length === 3) {
      return new Date(parts[0], parts[1] - 1, parts[2]);
    }
    return new Date();
  }, [selectedDateKey]);

  const isSelectedToday = selectedDateKey === clientTodayKey;

  const selectedWeekdayName = useMemo(() => {
    return selectedDateObj.toLocaleDateString("en-US", { weekday: "long" });
  }, [selectedDateObj]);

  const selectedFullLabel = useMemo(() => {
    return selectedDateObj.toLocaleDateString("en-US", {
      weekday: "long",
      month: "short",
      day: "numeric",
    });
  }, [selectedDateObj]);

  return (
    <main className="space-y-4">
      {/* Header */}
      <header className="flex items-center justify-between pt-1 pb-1">
        <div className="flex items-center gap-2.5">
          <img src="/qalb-logo.png" alt="Qalb" className="w-8 h-8 rounded-lg object-cover" />
          <div>
            <h1 className="text-xl font-bold text-qalb-ink dark:text-qalb-night-ink tracking-tight">
              Ibadah Tracker
            </h1>
            <p className="text-xs text-qalb-muted font-sans">
              Build consistency • Private to you
            </p>
          </div>
        </div>

        {/* Real Dynamic Streak Badge */}
        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-qalb-green dark:bg-qalb-green-dark text-white text-xs font-bold font-sans shadow-sm">
          <Flame className="w-3.5 h-3.5 fill-current text-qalb-gold" />
          <span>{streakDays} {streakDays === 1 ? "day" : "days"}</span>
        </div>
      </header>

      {/* Dynamic Date Strip centered on Today */}
      <div className="grid grid-cols-6 gap-1.5">
        {weekDays.map((d) => {
          const isSelected = selectedDateKey === d.dateKey;
          // Count completed prayers for this day to show 5 dots
          const dayFardPrayed = ["fajr", "dhuhr", "asr", "maghrib", "isha"].map((name) =>
            isPrayerCompletedForDate(d.dateKey, name)
          );

          return (
            <button
              key={d.dateKey}
              onClick={() => setSelectedDateKey(d.dateKey)}
              className={`flex flex-col items-center justify-between py-2.5 px-1 rounded-2xl border transition-all text-center ${
                isSelected
                  ? "bg-qalb-green text-white border-qalb-green shadow-sm"
                  : "bg-qalb-card dark:bg-qalb-night-card border-qalb-border dark:border-qalb-night-border text-qalb-ink dark:text-qalb-night-ink hover:border-qalb-gold/60"
              }`}
            >
              <div className="flex items-center gap-1">
                <span className={`text-[10px] font-sans ${isSelected ? "text-white/80" : "text-qalb-muted"}`}>
                  {d.dayName}
                </span>
                {d.isToday && (
                  <span className={`w-1.5 h-1.5 rounded-full ${isSelected ? "bg-qalb-gold" : "bg-qalb-green"}`} />
                )}
              </div>

              <span className="text-base font-bold my-1">
                {d.dateNum}
              </span>

              {/* 5 Prayer Dots */}
              <div className="flex items-center gap-0.5 mt-1">
                {dayFardPrayed.map((done, i) => (
                  <span
                    key={i}
                    className={`w-1 h-1 rounded-full ${
                      isSelected
                        ? done ? "bg-white" : "bg-white/30"
                        : done ? "bg-emerald-600" : "bg-qalb-border dark:bg-qalb-night-border"
                    }`}
                  />
                ))}
              </div>
            </button>
          );
        })}
      </div>

      {/* Progress Card */}
      <section className="p-4 sm:p-5 rounded-2xl bg-qalb-card dark:bg-qalb-night-card border border-qalb-border dark:border-qalb-night-border shadow-qalb-card space-y-2.5">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xs font-bold text-qalb-ink dark:text-qalb-night-ink">
              {isSelectedToday ? "Today's Ibadah" : selectedFullLabel}
            </h3>
            <p className="text-[11px] text-qalb-muted font-sans">
              {isSelectedToday ? (clientWeekday || selectedWeekdayName) : selectedWeekdayName} • {totalCompleted}/{totalPossible} completed
            </p>
          </div>

          <div className="flex items-center justify-center w-11 h-11 rounded-full border-2 border-qalb-green text-qalb-green dark:text-qalb-gold font-bold text-xs">
            {completionPercent}%
          </div>
        </div>

        <div className="w-full h-1.5 rounded-full bg-qalb-card-subtle dark:bg-qalb-night-subtle overflow-hidden">
          <div
            className="h-full bg-qalb-green dark:bg-qalb-gold rounded-full transition-all duration-500"
            style={{ width: `${completionPercent}%` }}
          />
        </div>
      </section>

      {/* Fard Prayers Section (Synced with live Aladhan times & Home checkboxes) */}
      <section className="space-y-2.5">
        <div className="flex items-center justify-between px-0.5">
          <h3 className="text-xs font-bold text-qalb-ink dark:text-qalb-night-ink">
            Fard Prayers
          </h3>
          <span className="text-[11px] font-bold text-qalb-green dark:text-qalb-gold">
            {completedFardCount}/5
          </span>
        </div>

        <div className="space-y-2">
          {fardPrayers.map((prayer) => {
            const isDone = isPrayerCompletedForDate(selectedDateKey, prayer.id);

            return (
              <div
                key={prayer.id}
                onClick={() => togglePrayerForDate(selectedDateKey, prayer.id)}
                className={`flex items-center justify-between p-3.5 rounded-2xl border transition-all cursor-pointer ${
                  isDone
                    ? "bg-[#EAF7EE] dark:bg-emerald-950/20 border-[#BCE1CE] dark:border-emerald-900/50"
                    : "bg-qalb-card dark:bg-qalb-night-card border-qalb-border dark:border-qalb-night-border hover:border-qalb-gold/60"
                }`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`flex items-center justify-center w-6 h-6 rounded-full transition-colors ${
                      isDone
                        ? "bg-emerald-600 text-white"
                        : "border border-qalb-border dark:border-qalb-night-border text-transparent"
                    }`}
                  >
                    <Check className="w-3.5 h-3.5 stroke-[3]" />
                  </div>
                  <div>
                    <h4 className={`text-xs font-bold transition-colors ${
                      isDone ? "text-qalb-ink dark:text-qalb-night-ink" : "text-qalb-ink dark:text-qalb-night-ink"
                    }`}>
                      {prayer.nameEn}
                    </h4>
                    <p className="text-[10px] text-qalb-muted font-sans">
                      {prayer.time24} • <span dir="rtl" className="font-arabic-ui text-[11px]">{prayer.nameAr}</span>
                    </p>
                  </div>
                </div>

                <div
                  className={`px-3 py-1 rounded-full text-[10px] font-bold ${
                    isDone
                      ? "bg-emerald-600 text-white"
                      : "bg-qalb-card-subtle dark:bg-qalb-night-subtle text-qalb-muted dark:text-qalb-night-muted"
                  }`}
                >
                  {isDone ? "Done" : "—"}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Sunnah & Daily Habits Section (Converted from toggle switches to circular task checkboxes) */}
      <section className="space-y-2.5">
        <div className="flex items-center justify-between px-0.5">
          <h3 className="text-xs font-bold text-qalb-ink dark:text-qalb-night-ink">
            Sunnah &amp; Daily Habits
          </h3>
          <span className="text-[11px] font-bold text-qalb-green dark:text-qalb-gold">
            {completedHabitsCount}/3
          </span>
        </div>

        <div className="space-y-2">
          {HABIT_DEFINITIONS.map((h) => {
            const isDone = isHabitCompletedForDate(selectedDateKey, h.key);
            const Icon = h.icon;

            return (
              <div
                key={h.key}
                onClick={() => toggleHabitForDate(selectedDateKey, h.key)}
                className={`flex items-center justify-between p-3.5 rounded-2xl border transition-all cursor-pointer ${
                  isDone
                    ? "bg-[#EAF7EE] dark:bg-emerald-950/20 border-[#BCE1CE] dark:border-emerald-900/50"
                    : "bg-qalb-card dark:bg-qalb-night-card border-qalb-border dark:border-qalb-night-border hover:border-qalb-gold/60"
                }`}
              >
                <div className="flex items-center gap-3">
                  {/* Matching circular checkbox */}
                  <div
                    className={`flex items-center justify-center w-6 h-6 rounded-full transition-colors ${
                      isDone
                        ? "bg-emerald-600 text-white"
                        : "border border-qalb-border dark:border-qalb-night-border text-transparent"
                    }`}
                  >
                    <Check className="w-3.5 h-3.5 stroke-[3]" />
                  </div>

                  {/* Habit Category Icon */}
                  <div className={`flex items-center justify-center w-8 h-8 rounded-full ${h.iconBg} ${h.iconColor}`}>
                    <Icon className="w-4 h-4" />
                  </div>

                  <div>
                    <h4
                      className={`text-xs font-bold transition-all ${
                        isDone
                          ? "line-through text-qalb-muted dark:text-qalb-night-muted"
                          : "text-qalb-ink dark:text-qalb-night-ink"
                      }`}
                    >
                      {h.title}
                    </h4>
                    <p className="text-[10px] text-qalb-muted font-sans">
                      {h.subtitle}
                    </p>
                  </div>
                </div>

                <div
                  className={`px-3 py-1 rounded-full text-[10px] font-bold ${
                    isDone
                      ? "bg-emerald-600 text-white"
                      : "bg-qalb-card-subtle dark:bg-qalb-night-subtle text-qalb-muted dark:text-qalb-night-muted"
                  }`}
                >
                  {isDone ? "Done" : "—"}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Summary Metrics (Synced, real numbers) */}
      <section className="grid grid-cols-3 gap-2.5">
        <div className="p-3.5 rounded-2xl bg-qalb-card dark:bg-qalb-night-card border border-qalb-border dark:border-qalb-night-border text-center">
          <div className="flex items-center justify-center w-7 h-7 mx-auto rounded-full bg-qalb-gold-subtle text-qalb-gold">
            <Calendar className="w-3.5 h-3.5" />
          </div>
          <div className="text-sm font-bold text-qalb-ink dark:text-qalb-night-ink mt-1.5 tabular-nums">
            {streakDays} {streakDays === 1 ? "day" : "days"}
          </div>
          <div className="text-[10px] text-qalb-muted mt-0.5 font-sans">
            Current streak
          </div>
        </div>

        <div className="p-3.5 rounded-2xl bg-qalb-card dark:bg-qalb-night-card border border-qalb-border dark:border-qalb-night-border text-center">
          <div className="flex items-center justify-center w-7 h-7 mx-auto rounded-full bg-[#E3F2ED] text-[#1D7A5C]">
            <Trophy className="w-3.5 h-3.5" />
          </div>
          <div className="text-sm font-bold text-qalb-ink dark:text-qalb-night-ink mt-1.5 tabular-nums">
            {Math.max(streakDays, streakDays > 0 ? streakDays : 0)} {streakDays === 1 ? "day" : "days"}
          </div>
          <div className="text-[10px] text-qalb-muted mt-0.5 font-sans">
            Best streak
          </div>
        </div>

        <div className="p-3.5 rounded-2xl bg-qalb-card dark:bg-qalb-night-card border border-qalb-border dark:border-qalb-night-border text-center">
          <div className="flex items-center justify-center w-7 h-7 mx-auto rounded-full bg-[#F3EBF9] text-[#7C3AED]">
            <CheckCircle2 className="w-3.5 h-3.5" />
          </div>
          <div className="text-sm font-bold text-qalb-ink dark:text-qalb-night-ink mt-1.5 tabular-nums">
            {completedFardCount > 0 ? `${Math.round((completedFardCount / 5) * 100)}%` : "0%"}
          </div>
          <div className="text-[10px] text-qalb-muted mt-0.5 font-sans">
            Today
          </div>
        </div>
      </section>

      {/* Privacy Notice */}
      <section className="flex items-center gap-2.5 p-3.5 rounded-2xl border bg-qalb-card dark:bg-qalb-night-card border-qalb-border dark:border-qalb-night-border text-xs text-qalb-muted">
        <Lock className="w-4 h-4 text-qalb-green shrink-0" />
        <p className="text-[11px] leading-relaxed">
          Stored only on your device. No account needed. Your worship is private.
        </p>
      </section>
    </main>
  );
}
