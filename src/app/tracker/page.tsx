"use client";

import { useState, useEffect } from "react";
import { Flame, Check, Minus, Moon, BookOpen, Sparkles, Trophy, Calendar, CheckCircle2, Lock } from "lucide-react";

interface PrayerStatus {
  id: string;
  name: string;
  time: string;
  arabic: string;
  done: boolean;
}

export default function TrackerPage() {
  const [selectedDayIndex, setSelectedDayIndex] = useState(2); // Wednesday 18 selected by default
  const [fardPrayers, setFardPrayers] = useState<PrayerStatus[]>([
    { id: "fajr", name: "Fajr", time: "05:12", arabic: "الفجر", done: true },
    { id: "dhuhr", name: "Dhuhr", time: "12:24", arabic: "الظهر", done: false },
    { id: "asr", name: "Asr", time: "15:42", arabic: "العصر", done: false },
    { id: "maghrib", name: "Maghrib", time: "18:08", arabic: "المغرب", done: false },
    { id: "isha", name: "Isha", time: "19:34", arabic: "العشاء", done: false },
  ]);

  const [habits, setHabits] = useState({
    sunnah: true,
    quran: false,
    adhkar: true,
  });

  const [streakDays, setStreakDays] = useState(12);

  // Load from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("qalb-tracker-data");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed.fard) setFardPrayers(parsed.fard);
        if (parsed.habits) setHabits(parsed.habits);
      } catch (e) {}
    }
  }, []);

  const saveTracker = (fard: PrayerStatus[], h: typeof habits) => {
    localStorage.setItem("qalb-tracker-data", JSON.stringify({ fard, habits: h }));
  };

  const toggleFard = (id: string) => {
    const updated = fardPrayers.map((p) => (p.id === id ? { ...p, done: !p.done } : p));
    setFardPrayers(updated);
    saveTracker(updated, habits);
    if (typeof navigator !== "undefined" && navigator.vibrate) {
      navigator.vibrate(20);
    }
  };

  const toggleHabit = (key: keyof typeof habits) => {
    const updated = { ...habits, [key]: !habits[key] };
    setHabits(updated);
    saveTracker(fardPrayers, updated);
  };

  const completedFard = fardPrayers.filter((p) => p.done).length;
  const completedHabits = Object.values(habits).filter(Boolean).length;
  const totalCompleted = completedFard + completedHabits;
  const totalItems = fardPrayers.length + Object.keys(habits).length; // 5 + 3 = 8
  const completionPercent = Math.round((totalCompleted / totalItems) * 100);

  // 6 Days in week strip matching screenshot
  const days = [
    { dayName: "Mon", dateNum: 16, dots: [true, true, true, true, false] },
    { dayName: "Tue", dateNum: 17, dots: [true, true, true, true, true] },
    { dayName: "Wed", dateNum: 18, dots: [true, true, true, true, false] },
    { dayName: "Thu", dateNum: 19, dots: [true, true, false, false, false] },
    { dayName: "Fri", dateNum: 20, dots: [false, false, false, false, false] },
    { dayName: "Sat", dateNum: 21, dots: [false, false, false, false, false] },
  ];

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

        {/* Streak Badge */}
        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-qalb-green dark:bg-qalb-green-dark text-white text-xs font-bold font-sans shadow-sm">
          <Flame className="w-3.5 h-3.5 fill-current text-qalb-gold" />
          <span>{streakDays} days</span>
        </div>
      </header>

      {/* 6-Day Horizontal Date Strip */}
      <div className="grid grid-cols-6 gap-1.5">
        {days.map((d, index) => {
          const isSelected = selectedDayIndex === index;
          return (
            <button
              key={d.dateNum}
              onClick={() => setSelectedDayIndex(index)}
              className={`flex flex-col items-center justify-between py-2.5 px-1 rounded-2xl border transition-all text-center ${
                isSelected
                  ? "bg-qalb-green text-white border-qalb-green shadow-sm"
                  : "bg-qalb-card dark:bg-qalb-night-card border-qalb-border dark:border-qalb-night-border text-qalb-ink dark:text-qalb-night-ink hover:border-qalb-gold/60"
              }`}
            >
              <span className={`text-[10px] font-sans ${isSelected ? "text-white/80" : "text-qalb-muted"}`}>
                {d.dayName}
              </span>
              <span className="text-base font-serif font-bold my-1">
                {d.dateNum}
              </span>

              {/* 5 Prayer dots */}
              <div className="flex items-center gap-0.5 mt-1">
                {d.dots.map((dot, i) => (
                  <span
                    key={i}
                    className={`w-1 h-1 rounded-full ${
                      isSelected
                        ? dot ? "bg-white" : "bg-white/30"
                        : dot ? "bg-emerald-600" : "bg-qalb-border"
                    }`}
                  />
                ))}
              </div>
            </button>
          );
        })}
      </div>

      {/* Today's Ibadah Progress Card */}
      <section className="p-4 sm:p-5 rounded-2xl bg-qalb-card dark:bg-qalb-night-card border border-qalb-border dark:border-qalb-night-border shadow-qalb-card space-y-2.5">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xs font-serif font-bold text-qalb-ink dark:text-qalb-night-ink">
              Today's Ibadah
            </h3>
            <p className="text-[11px] text-qalb-muted">
              Thursday • {totalCompleted}/{totalItems} completed
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

      {/* Fard Prayers Section (1/5) */}
      <section className="space-y-2.5">
        <div className="flex items-center justify-between px-0.5">
          <h3 className="text-xs font-serif font-bold text-qalb-ink dark:text-qalb-night-ink">
            Fard Prayers
          </h3>
          <span className="text-[11px] font-bold text-qalb-green dark:text-qalb-gold">
            {completedFard}/5
          </span>
        </div>

        <div className="space-y-2">
          {fardPrayers.map((prayer) => (
            <div
              key={prayer.id}
              onClick={() => toggleFard(prayer.id)}
              className={`flex items-center justify-between p-3.5 rounded-2xl border transition-all cursor-pointer ${
                prayer.done
                  ? "bg-[#EAF7EE] dark:bg-emerald-950/20 border-[#BCE1CE] dark:border-emerald-900/50"
                  : "bg-qalb-card dark:bg-qalb-night-card border-qalb-border dark:border-qalb-night-border hover:border-qalb-gold/60"
              }`}
            >
              <div className="flex items-center gap-3">
                <div
                  className={`flex items-center justify-center w-6 h-6 rounded-full transition-colors ${
                    prayer.done
                      ? "bg-emerald-600 text-white"
                      : "border border-qalb-border dark:border-qalb-night-border text-transparent"
                  }`}
                >
                  <Check className="w-3.5 h-3.5 stroke-[3]" />
                </div>
                <div>
                  <h4 className="text-xs font-serif font-bold text-qalb-ink dark:text-qalb-night-ink">
                    {prayer.name}
                  </h4>
                  <p className="text-[10px] text-qalb-muted font-sans">
                    {prayer.time} • <span dir="rtl" className="font-amiri">{prayer.arabic}</span>
                  </p>
                </div>
              </div>

              <div
                className={`px-3 py-1 rounded-full text-[10px] font-bold ${
                  prayer.done
                    ? "bg-emerald-600 text-white"
                    : "bg-qalb-card-subtle text-qalb-muted"
                }`}
              >
                {prayer.done ? "Done" : "—"}
              </div>
            </div>
          ))}
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
                <p className="text-[10px] text-qalb-muted">
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
                <p className="text-[10px] text-qalb-muted">
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
                <p className="text-[10px] text-qalb-muted">
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

      {/* 3 Streak & Summary Metric Cards (Screenshot 11) */}
      <section className="grid grid-cols-3 gap-2.5">
        <div className="p-3.5 rounded-2xl bg-qalb-card dark:bg-qalb-night-card border border-qalb-border dark:border-qalb-night-border text-center">
          <div className="flex items-center justify-center w-7 h-7 mx-auto rounded-full bg-qalb-gold-subtle text-qalb-gold">
            <Calendar className="w-3.5 h-3.5" />
          </div>
          <div className="text-sm font-serif font-bold text-qalb-ink dark:text-qalb-night-ink mt-1.5 tabular-nums">
            12 days
          </div>
          <div className="text-[10px] text-qalb-muted mt-0.5">
            Current streak
          </div>
        </div>

        <div className="p-3.5 rounded-2xl bg-qalb-card dark:bg-qalb-night-card border border-qalb-border dark:border-qalb-night-border text-center">
          <div className="flex items-center justify-center w-7 h-7 mx-auto rounded-full bg-[#E3F2ED] text-[#1D7A5C]">
            <Trophy className="w-3.5 h-3.5" />
          </div>
          <div className="text-sm font-serif font-bold text-qalb-ink dark:text-qalb-night-ink mt-1.5 tabular-nums">
            28 days
          </div>
          <div className="text-[10px] text-qalb-muted mt-0.5">
            Best streak
          </div>
        </div>

        <div className="p-3.5 rounded-2xl bg-qalb-card dark:bg-qalb-night-card border border-qalb-border dark:border-qalb-night-border text-center">
          <div className="flex items-center justify-center w-7 h-7 mx-auto rounded-full bg-[#F3EBF9] text-[#7C3AED]">
            <CheckCircle2 className="w-3.5 h-3.5" />
          </div>
          <div className="text-sm font-serif font-bold text-qalb-ink dark:text-qalb-night-ink mt-1.5 tabular-nums">
            87%
          </div>
          <div className="text-[10px] text-qalb-muted mt-0.5">
            This month
          </div>
        </div>
      </section>

      {/* Privacy Reassurance Banner */}
      <section className="flex items-center gap-2.5 p-3.5 rounded-2xl border bg-qalb-card dark:bg-qalb-night-card border-qalb-border dark:border-qalb-night-border text-xs text-qalb-muted">
        <Lock className="w-4 h-4 text-qalb-green shrink-0" />
        <p className="text-[11px] leading-relaxed">
          Stored only on your device. No account needed. Your worship is private.
        </p>
      </section>
    </main>
  );
}
