"use client";

import { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import { getAllChapters } from "@/services/quran";
import { Chapter } from "@/types/quran";
import { Search, BookOpen, Sparkles, ArrowLeft } from "lucide-react";
import { ThemeToggle } from "@/components/ThemeToggle";

export default function QuranCatalogPage() {
  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterPlace, setFilterPlace] = useState<"all" | "makkah" | "madinah">("all");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      try {
        const data = await getAllChapters();
        setChapters(data);
      } catch (err: any) {
        console.error("Failed to load chapters:", err);
        setError("Unable to load Surah index. Please check your internet connection.");
      } finally {
        setIsLoading(false);
      }
    }
    load();
  }, []);

  const filteredChapters = useMemo(() => {
    return chapters.filter((ch) => {
      const matchesSearch =
        ch.name_simple.toLowerCase().includes(searchQuery.toLowerCase()) ||
        ch.translated_name.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        ch.name_arabic.includes(searchQuery) ||
        ch.id.toString() === searchQuery.trim();

      const matchesPlace =
        filterPlace === "all" || ch.revelation_place === filterPlace;

      return matchesSearch && matchesPlace;
    });
  }, [chapters, searchQuery, filterPlace]);

  return (
    <main className="space-y-6">
      {/* Header */}
      <header className="flex items-center justify-between pt-2 pb-1">
        <div className="flex items-center gap-3">
          <Link
            href="/"
            className="flex items-center justify-center w-9 h-9 rounded-full border border-sacred-parchment-border dark:border-sacred-night-border bg-sacred-parchment-card dark:bg-sacred-night-card text-sacred-ink-secondary dark:text-sacred-night-secondary hover:text-sacred-gold hover:border-sacred-gold transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <h1 className="text-xl font-bold tracking-tight text-sacred-ink-primary dark:text-sacred-night-primary font-sans">
              The Noble Quran
            </h1>
            <p className="text-xs text-sacred-ink-muted dark:text-sacred-night-muted">
              114 Chapters • Verified Uthmani Script
            </p>
          </div>
        </div>

        <ThemeToggle />
      </header>

      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-sacred-ink-muted dark:text-sacred-night-muted" />
        <input
          type="text"
          placeholder="Search by Surah name, meaning, or number..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-10 pr-4 py-3 rounded-2xl border text-sm transition-all outline-none bg-sacred-parchment-card dark:bg-sacred-night-card border-sacred-parchment-border dark:border-sacred-night-border text-sacred-ink-primary dark:text-sacred-night-primary placeholder:text-sacred-ink-muted dark:placeholder:text-sacred-night-muted focus:border-sacred-gold shadow-sm font-sans"
        />
      </div>

      {/* Revelation Filter Pills */}
      <div className="flex items-center gap-2">
        <button
          onClick={() => setFilterPlace("all")}
          className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition-all ${
            filterPlace === "all"
              ? "bg-sacred-emerald text-white dark:bg-sacred-gold dark:text-sacred-night-bg shadow-sm"
              : "bg-sacred-parchment-card dark:bg-sacred-night-card text-sacred-ink-secondary dark:text-sacred-night-secondary border border-sacred-parchment-border dark:border-sacred-night-border hover:border-sacred-gold"
          }`}
        >
          All (114)
        </button>
        <button
          onClick={() => setFilterPlace("makkah")}
          className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition-all ${
            filterPlace === "makkah"
              ? "bg-sacred-emerald text-white dark:bg-sacred-gold dark:text-sacred-night-bg shadow-sm"
              : "bg-sacred-parchment-card dark:bg-sacred-night-card text-sacred-ink-secondary dark:text-sacred-night-secondary border border-sacred-parchment-border dark:border-sacred-night-border hover:border-sacred-gold"
          }`}
        >
          Makki
        </button>
        <button
          onClick={() => setFilterPlace("madinah")}
          className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition-all ${
            filterPlace === "madinah"
              ? "bg-sacred-emerald text-white dark:bg-sacred-gold dark:text-sacred-night-bg shadow-sm"
              : "bg-sacred-parchment-card dark:bg-sacred-night-card text-sacred-ink-secondary dark:text-sacred-night-secondary border border-sacred-parchment-border dark:border-sacred-night-border hover:border-sacred-gold"
          }`}
        >
          Madani
        </button>
      </div>

      {/* Loading Skeleton */}
      {isLoading && (
        <div className="grid grid-cols-1 gap-3">
          {Array.from({ length: 8 }).map((_, i) => (
            <div
              key={i}
              className="h-20 rounded-2xl animate-pulse bg-sacred-parchment-card dark:bg-sacred-night-card border border-sacred-parchment-border dark:border-sacred-night-border"
            />
          ))}
        </div>
      )}

      {/* Error state */}
      {error && (
        <div className="p-4 rounded-2xl bg-red-50 dark:bg-red-950/30 text-red-700 dark:text-red-400 text-xs">
          {error}
        </div>
      )}

      {/* Chapters Grid */}
      {!isLoading && !error && (
        <div className="space-y-2.5">
          {filteredChapters.map((ch) => (
            <Link
              key={ch.id}
              href={`/quran/${ch.id}`}
              className="group flex items-center justify-between p-3.5 sm:p-4 rounded-2xl transition-all duration-200 border bg-sacred-parchment-card dark:bg-sacred-night-card border-sacred-parchment-border dark:border-sacred-night-border hover:border-sacred-gold shadow-sm active:scale-99"
            >
              {/* Left: Number badge & English names */}
              <div className="flex items-center gap-3.5">
                <div className="flex items-center justify-center w-10 h-10 rounded-2xl font-bold text-xs bg-sacred-emerald-light dark:bg-sacred-night-subtle text-sacred-emerald dark:text-sacred-gold border border-sacred-parchment-border dark:border-sacred-night-border font-sans shrink-0">
                  {ch.id}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-bold text-sacred-ink-primary dark:text-sacred-night-primary group-hover:text-sacred-emerald dark:group-hover:text-sacred-gold transition-colors font-sans">
                      {ch.name_simple}
                    </h3>
                    <span className="text-[10px] px-1.5 py-0.5 rounded-md uppercase font-semibold bg-sacred-parchment-subtle dark:bg-sacred-night-subtle text-sacred-ink-muted dark:text-sacred-night-muted">
                      {ch.revelation_place === "makkah" ? "Makki" : "Madani"}
                    </span>
                  </div>
                  <p className="text-xs text-sacred-ink-secondary dark:text-sacred-night-secondary">
                    {ch.translated_name.name} • {ch.verses_count} Verses
                  </p>
                </div>
              </div>

              {/* Right: Arabic Title */}
              <div
                dir="rtl"
                lang="ar"
                className="font-amiri text-2xl font-bold text-sacred-emerald dark:text-sacred-gold leading-none"
              >
                {ch.name_arabic}
              </div>
            </Link>
          ))}

          {filteredChapters.length === 0 && (
            <div className="text-center py-12 text-sm text-sacred-ink-muted dark:text-sacred-night-muted">
              No Surahs found matching &quot;{searchQuery}&quot;.
            </div>
          )}
        </div>
      )}
    </main>
  );
}
