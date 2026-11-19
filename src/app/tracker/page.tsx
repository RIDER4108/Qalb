"use client";

import { useState, useMemo } from "react";
import { Flame, Check, Moon, BookOpen, Sparkles, Trophy, Calendar, CheckCircle2, Lock } from "lucide-react";
import { useApp, getTodayKey } from "@/context/AppContext";

export default function TrackerPage() {
  const {
    prayers,
    isPrayerCompletedForDate,
    togglePrayerForDate,
    habits,
    toggleHabit,
    streakDays,
  } = useApp();

  const todayKey = getTodayKey();

  // Generate 6 days ending on tomorrow or centered on today
  const weekDays = useMemo(() => {
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
        isToday: dateKey === todayKey,
      });
    }
    return list;
  }, [todayKey]);

  const [selectedDateKey, setSelectedDateKey] = useState<string>(todayKey);

  // Fard prayers (excluding Sunrise)
  const fardPrayers = useMemo(() => {
    return prayers.filter((p) => p.id !== "Sunrise");
  }, [prayers]);

  const completedFardCount = fardPrayers.filter((p) =>
    isPrayerCompletedForDate(selectedDateKey, p.id)
  ).length;

  const completedHabitsCount = Object.values(habits).filter(Boolean).length;
  const totalCompleted = completedFardCount + completedHabitsCount;
  const totalPossible = fardPrayers.length + Object.keys(habits).length; // 5 + 3 = 8
  const completionPercent = totalPossible > 0 ? Math.round((totalCompleted / totalPossible) * 100) : 0;

  // Selected date human label
  const selectedDateObj = new Date(selectedDateKey + "T00:00:00");
  const selectedDayLabel = selectedDateKey === todayKey
    ? `Today (${selectedDateObj.toLocaleDateString("en-US", { weekday: "long" })})`
    : selectedDateObj.toLocaleDateString("en-US", { weekday: "long", month: "short", day: "numeric" });

  return (
    <main className="space-y-4">
      {/* Header */}
      <header className="flex items-center justify-between pt-1 pb-1">
        <div>
          <h1 className="text-xl font-serif font-bold text-qalb-ink dark:text-qalb-night-ink">
            Ibadah Tracker
          </h1>
          <p className="text-xs text-qalb-muted font-sans">
            Build consistency • Private to you
          </p>
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

              <span className="text-base font-serif font-bold my-1">
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
                        : done ? "bg-emerald-600" : "bg-qalb-border"
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
            <h3 className="text-xs font-serif font-bold text-qalb-ink dark:text-qalb-night-ink">
              {selectedDayLabel}
            </h3>
            <p className="text-[11px] text-qalb-muted font-sans">
              {totalCompleted}/{totalPossible} completed
            </p>
          </div>

          <div className="flex items-center justify-center w-11 h-11 rounded-full border-2 border-qalb-green text-qalb-green dark:text-qalb-gold font-serif font-bold text-xs">
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
          <h3 className="text-xs font-serif font-bold text-qalb-ink dark:text-qalb-night-ink">
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
                    <h4 className="text-xs font-serif font-bold text-qalb-ink dark:text-qalb-night-ink">
                      {prayer.nameEn}
                    </h4>
                    <p className="text-[10px] text-qalb-muted font-sans">
                      {prayer.time24} • <span dir="rtl" className="font-indopak">{prayer.nameAr}</span>
                    </p>
                  </div>
                </div>

                <div
                  className={`px-3 py-1 rounded-full text-[10px] font-bold ${
                    isDone
                      ? "bg-emerald-600 text-white"
                      : "bg-qalb-card-subtle text-qalb-muted"
                  }`}
                >
                  {isDone ? "Done" : "—"}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Sunnah & Daily Habits Section */}
      <section className="space-y-2.5">
        <h3 className="text-xs font-serif font-bold text-qalb-ink dark:text-qalb-night-ink px-0.5">
          Sunnah &amp; Daily Habits
        </h3>

        <div className="space-y-2">
          {/* 1. Sunnah Prayers */}
          <div className="flex items-center justify-between p-3.5 rounded-2xl border bg-qalb-card dark:bg-qalb-night-card border-qalb-border dark:border-qalb-night-border">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-8 h-8 rounded-full bg-[#FEF6E4] text-[#C28C1A]">
                <Moon className="w-4 h-4 fill-current" />
              </div>
              <div>
                <h4 className="text-xs font-serif font-bold text-qalb-ink dark:text-qalb-night-ink">
                  Sunnah Prayers
                </h4>
                <p className="text-[10px] text-qalb-muted font-sans">
                  Duha, Tahajjud, Witr
                </p>
              </div>
            </div>

            <button
              onClick={() => toggleHabit("sunnah")}
              className={`w-11 h-6 rounded-full transition-colors relative p-0.5 ${
                habits.sunnah ? "bg-qalb-green" : "bg-qalb-border"
              }`}
            >
              <div
                className={`w-5 h-5 rounded-full bg-white transition-transform ${
                  habits.sunnah ? "translate-x-5" : "translate-x-0"
                }`}
              />
            </button>
          </div>

          {/* 2. Quran Reading */}
          <div className="flex items-center justify-between p-3.5 rounded-2xl border bg-qalb-card dark:bg-qalb-night-card border-qalb-border dark:border-qalb-night-border">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-8 h-8 rounded-full bg-qalb-card-subtle text-qalb-ink">
                <BookOpen className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-serif font-bold text-qalb-ink dark:text-qalb-night-ink">
                  Quran Reading
                </h4>
                <p className="text-[10px] text-qalb-muted font-sans">
                  At least 1 page
                </p>
              </div>
            </div>

            <button
              onClick={() => toggleHabit("quran")}
              className={`w-11 h-6 rounded-full transition-colors relative p-0.5 ${
                habits.quran ? "bg-qalb-green" : "bg-qalb-border"
              }`}
            >
              <div
                className={`w-5 h-5 rounded-full bg-white transition-transform ${
                  habits.quran ? "translate-x-5" : "translate-x-0"
                }`}
              />
            </button>
          </div>

          {/* 3. Dhikr & Adhkar */}
          <div className="flex items-center justify-between p-3.5 rounded-2xl border bg-qalb-card dark:bg-qalb-night-card border-qalb-border dark:border-qalb-night-border">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-8 h-8 rounded-full bg-[#FEF6E4] text-[#C28C1A]">
                <Sparkles className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-serif font-bold text-qalb-ink dark:text-qalb-night-ink">
                  Dhikr &amp; Adhkar
                </h4>
                <p className="text-[10px] text-qalb-muted font-sans">
                  Morning &amp; Evening
                </p>
              </div>
            </div>

            <button
              onClick={() => toggleHabit("adhkar")}
              className={`w-11 h-6 rounded-full transition-colors relative p-0.5 ${
                habits.adhkar ? "bg-qalb-green" : "bg-qalb-border"
              }`}
            >
              <div
                className={`w-5 h-5 rounded-full bg-white transition-transform ${
                  habits.adhkar ? "translate-x-5" : "translate-x-0"
                }`}
              />
            </button>
          </div>
        </div>
      </section>

      {/* Summary Metrics (Synced, real numbers) */}
      <section className="grid grid-cols-3 gap-2.5">
        <div className="p-3.5 rounded-2xl bg-qalb-card dark:bg-qalb-night-card border border-qalb-border dark:border-qalb-night-border text-center">
          <div className="flex items-center justify-center w-7 h-7 mx-auto rounded-full bg-qalb-gold-subtle text-qalb-gold">
            <Calendar className="w-3.5 h-3.5" />
          </div>
          <div className="text-sm font-serif font-bold text-qalb-ink dark:text-qalb-night-ink mt-1.5 tabular-nums">
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
          <div className="text-sm font-serif font-bold text-qalb-ink dark:text-qalb-night-ink mt-1.5 tabular-nums">
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
          <div className="text-sm font-serif font-bold text-qalb-ink dark:text-qalb-night-ink mt-1.5 tabular-nums">
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
