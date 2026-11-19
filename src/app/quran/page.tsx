"use client";

import { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import { getAllChapters } from "@/services/quran";
import { Chapter } from "@/types/quran";
import { Search, ArrowLeft } from "lucide-react";

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
    <main className="space-y-4">
      {/* Header */}
      <header className="flex items-center justify-between pt-1 pb-1">
        <div className="flex items-center gap-3">
          <Link
            href="/"
            className="flex items-center justify-center w-9 h-9 rounded-full border border-qalb-border dark:border-qalb-night-border bg-qalb-card dark:bg-qalb-night-card text-qalb-ink dark:text-qalb-night-ink hover:text-qalb-gold hover:border-qalb-gold transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <h1 className="text-xl font-serif font-bold tracking-tight text-qalb-ink dark:text-qalb-night-ink">
              The Noble Quran
            </h1>
            <p className="text-xs text-qalb-muted font-sans">
              114 Chapters • Verified Uthmani Script
            </p>
          </div>
        </div>
      </header>

      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-qalb-muted" />
        <input
          type="text"
          placeholder="Search by Surah name, meaning, or number..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-10 pr-4 py-3 rounded-2xl border text-xs sm:text-sm transition-all outline-none bg-qalb-card dark:bg-qalb-night-card border-qalb-border dark:border-qalb-night-border text-qalb-ink dark:text-qalb-night-ink placeholder:text-qalb-muted focus:border-qalb-gold shadow-sm font-sans"
        />
      </div>

      {/* Revelation Filter Pills */}
      <div className="flex items-center gap-2">
        <button
          onClick={() => setFilterPlace("all")}
          className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all border ${
            filterPlace === "all"
              ? "bg-qalb-green text-white border-qalb-green shadow-sm"
              : "bg-qalb-card dark:bg-qalb-night-card text-qalb-muted border-qalb-border dark:border-qalb-night-border hover:border-qalb-gold"
          }`}
        >
          All (114)
        </button>
        <button
          onClick={() => setFilterPlace("makkah")}
          className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all border ${
            filterPlace === "makkah"
              ? "bg-qalb-green text-white border-qalb-green shadow-sm"
              : "bg-qalb-card dark:bg-qalb-night-card text-qalb-muted border-qalb-border dark:border-qalb-night-border hover:border-qalb-gold"
          }`}
        >
          Makki
        </button>
        <button
          onClick={() => setFilterPlace("madinah")}
          className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all border ${
            filterPlace === "madinah"
              ? "bg-qalb-green text-white border-qalb-green shadow-sm"
              : "bg-qalb-card dark:bg-qalb-night-card text-qalb-muted border-qalb-border dark:border-qalb-night-border hover:border-qalb-gold"
          }`}
        >
          Madani
        </button>
      </div>

      {/* Loading Skeleton */}
      {isLoading && (
        <div className="grid grid-cols-1 gap-2.5">
          {Array.from({ length: 8 }).map((_, i) => (
            <div
              key={i}
              className="h-16 rounded-2xl animate-pulse bg-qalb-card dark:bg-qalb-night-card border border-qalb-border dark:border-qalb-night-border"
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
        <div className="space-y-2">
          {filteredChapters.map((ch) => (
            <Link
              key={ch.id}
              href={`/quran/${ch.id}`}
              className="group flex items-center justify-between p-3.5 rounded-2xl transition-all duration-200 border bg-qalb-card dark:bg-qalb-night-card border-qalb-border dark:border-qalb-night-border hover:border-qalb-gold/60 shadow-sm active:scale-99"
            >
              {/* Left: Number badge & English names */}
              <div className="flex items-center gap-3">
                <div className="flex items-center justify-center w-9 h-9 rounded-xl font-bold text-xs bg-qalb-card-subtle dark:bg-qalb-night-subtle text-qalb-green dark:text-qalb-gold border border-qalb-border dark:border-qalb-night-border font-sans shrink-0">
                  {ch.id}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-xs sm:text-sm font-serif font-bold text-qalb-ink dark:text-qalb-night-ink group-hover:text-qalb-green dark:group-hover:text-qalb-gold transition-colors">
                      {ch.name_simple}
                    </h3>
                    <span className="text-[9px] px-1.5 py-0.5 rounded-md uppercase font-semibold bg-qalb-card-subtle dark:bg-qalb-night-subtle text-qalb-muted">
                      {ch.revelation_place === "makkah" ? "Makki" : "Madani"}
                    </span>
                  </div>
                  <p className="text-[11px] text-qalb-muted font-sans">
                    {ch.translated_name.name} • {ch.verses_count} Verses
                  </p>
                </div>
              </div>

              {/* Right: Arabic Title */}
              <div
                dir="rtl"
                lang="ar"
                className="font-amiri text-xl font-bold text-qalb-green dark:text-qalb-gold leading-none"
              >
                {ch.name_arabic}
              </div>
            </Link>
          ))}

          {filteredChapters.length === 0 && (
            <div className="text-center py-12 text-xs text-qalb-muted">
              No Surahs found matching &quot;{searchQuery}&quot;.
            </div>
          )}
        </div>
      )}
    </main>
  );
}
