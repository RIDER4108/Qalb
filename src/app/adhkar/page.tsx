"use client";

import { useState } from "react";
import { RotateCcw, Hand, Check } from "lucide-react";
import { ADHKAR_COLLECTION, AdhkarItem } from "@/data/adhkar";
import { useApp } from "@/context/AppContext";

export default function AdhkarPage() {
  const { adhkarCounts, incrementAdhkar, resetAdhkar } = useApp();
  const [activeCategory, setActiveCategory] = useState<AdhkarItem["category"]>("morning");

  const categories: { id: AdhkarItem["category"]; label: string; total: number }[] = [
    { id: "morning", label: "Morning", total: 6 },
    { id: "evening", label: "Evening", total: 4 },
    { id: "after_salah", label: "After Salah", total: 3 },
    { id: "sleep", label: "Sleep", total: 2 },
  ];

  const currentItems = ADHKAR_COLLECTION.filter((item) => item.category === activeCategory);

  const completedCount = currentItems.filter(
    (item) => (adhkarCounts[item.id] || 0) >= item.targetCount
  ).length;

  const totalTargetRepetitions = currentItems.reduce((acc, item) => acc + item.targetCount, 0);
  const currentTotalReps = currentItems.reduce(
    (acc, item) => acc + Math.min(item.targetCount, adhkarCounts[item.id] || 0),
    0
  );

  const progressPercent = totalTargetRepetitions > 0
    ? Math.round((currentTotalReps / totalTargetRepetitions) * 100)
    : 0;

  const handleTap = (id: string, target: number) => {
    if (typeof navigator !== "undefined" && navigator.vibrate) {
      navigator.vibrate(20);
    }
    incrementAdhkar(id, target);
  };

  return (
    <main className="space-y-4">
      {/* Header */}
      <header className="flex items-center justify-between pt-1 pb-1">
        <div>
          <h1 className="text-xl font-serif font-bold text-qalb-ink dark:text-qalb-night-ink">
            Adhkar
          </h1>
          <p className="text-xs text-qalb-muted font-sans">
            Hisn al-Muslim • Fortress of the Muslim
          </p>
        </div>

        <button
          onClick={resetAdhkar}
          className="flex items-center justify-center w-9 h-9 rounded-full bg-qalb-card dark:bg-qalb-night-card border border-qalb-border dark:border-qalb-night-border text-qalb-muted hover:text-qalb-ink shadow-sm"
          title="Reset Counts"
        >
          <RotateCcw className="w-4 h-4" />
        </button>
      </header>

      {/* Category Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 custom-scrollbar">
        {categories.map((c) => {
          const isSelected = activeCategory === c.id;
          return (
            <button
              key={c.id}
              onClick={() => setActiveCategory(c.id)}
              className={`px-4 py-2 rounded-2xl text-xs font-semibold whitespace-nowrap transition-all border ${
                isSelected
                  ? "bg-qalb-green text-white border-qalb-green shadow-sm"
                  : "bg-qalb-card dark:bg-qalb-night-card border-qalb-border dark:border-qalb-night-border text-qalb-ink dark:text-qalb-night-ink hover:border-qalb-gold/60"
              }`}
            >
              <span>{c.label}</span>
              {isSelected && <span className="ml-1.5 opacity-80 text-[10px] font-sans">{c.total} duas</span>}
            </button>
          );
        })}
      </div>

      {/* Progress Bar Card */}
      <section className="p-4 rounded-2xl bg-qalb-card dark:bg-qalb-night-card border border-qalb-border dark:border-qalb-night-border shadow-qalb-card space-y-2">
        <div className="flex items-center justify-between text-xs">
          <span className="font-serif font-bold text-qalb-ink dark:text-qalb-night-ink capitalize">
            {activeCategory} Adhkar Progress
          </span>
          <span className="font-bold text-qalb-green dark:text-qalb-gold tabular-nums">
            {currentTotalReps}/{totalTargetRepetitions}
          </span>
        </div>

        <div className="w-full h-1.5 rounded-full bg-qalb-card-subtle dark:bg-qalb-night-subtle overflow-hidden">
          <div
            className="h-full bg-qalb-green dark:bg-qalb-gold rounded-full transition-all duration-300"
            style={{ width: `${progressPercent}%` }}
          />
        </div>

        <div className="flex items-center justify-between text-[11px] text-qalb-muted pt-0.5 font-sans">
          <span>{currentItems.length - completedCount} duas remaining</span>
          <span>Tap card to count</span>
        </div>
      </section>

      {/* Adhkar Cards List with IndoPak Font */}
      <div className="space-y-3.5">
        {currentItems.map((item, idx) => {
          const count = adhkarCounts[item.id] || 0;
          const isDone = count >= item.targetCount;
          const remaining = item.targetCount - count;

          return (
            <article
              key={item.id}
              onClick={() => handleTap(item.id, item.targetCount)}
              className={`p-5 rounded-3xl border transition-all duration-200 cursor-pointer shadow-qalb-card ${
                isDone
                  ? "bg-[#F3F9F5] dark:bg-qalb-night-card border-[#BCE1CE] dark:border-emerald-900/50"
                  : "bg-qalb-card dark:bg-qalb-night-card border-qalb-border dark:border-qalb-night-border hover:border-qalb-gold/60"
              }`}
            >
              {/* Header: Number & Source + Counter */}
              <div className="flex items-center justify-between pb-3 border-b border-qalb-border/60 dark:border-qalb-night-border/60">
                <div className="flex items-center justify-center w-7 h-7 rounded-full text-xs font-bold bg-qalb-card-subtle dark:bg-qalb-night-subtle text-qalb-ink dark:text-qalb-night-ink">
                  {idx + 1}
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-medium text-qalb-muted font-sans">
                    {item.source}
                  </span>
                  <span
                    className={`px-2 py-0.5 rounded-full text-[10px] font-bold tabular-nums font-sans ${
                      isDone
                        ? "bg-emerald-600 text-white"
                        : "bg-qalb-green text-white dark:bg-qalb-gold dark:text-qalb-night-bg"
                    }`}
                  >
                    {count}/{item.targetCount}
                  </span>
                </div>
              </div>

              {/* Arabic Scripture in IndoPak Nastaliq font with generous line-height */}
              <div className="py-4">
                <p
                  dir="rtl"
                  lang="ar"
                  className="font-indopak text-2xl sm:text-3xl text-qalb-ink dark:text-qalb-night-ink leading-[2.3] text-right"
                >
                  {item.arabic}
                </p>
              </div>

              {/* Transliteration */}
              <p className="text-xs italic font-serif text-qalb-gold leading-relaxed">
                {item.transliteration}
              </p>

              {/* English Translation */}
              <p className="mt-1.5 text-xs text-qalb-ink dark:text-qalb-night-ink font-sans leading-relaxed">
                "{item.translation}"
              </p>

              {/* Tap to Count Action Button */}
              <div className="pt-3 border-t border-qalb-border/40 dark:border-qalb-night-border/40 flex items-center justify-center">
                <div
                  className={`flex items-center gap-1.5 py-1.5 px-4 rounded-full text-xs font-semibold transition-colors ${
                    isDone
                      ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300"
                      : "bg-qalb-card-subtle dark:bg-qalb-night-subtle text-qalb-ink dark:text-qalb-night-ink"
                  }`}
                >
                  {isDone ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Completed</span>
                    </>
                  ) : (
                    <>
                      <Hand className="w-3.5 h-3.5 text-qalb-green" />
                      <span>Tap to count • {remaining} left</span>
                    </>
                  )}
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </main>
  );
}
