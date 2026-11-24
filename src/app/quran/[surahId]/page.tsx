"use client";

import { useEffect, useState, use } from "react";
import Link from "next/link";
import { getChapterDetails, getChapterVerses } from "@/services/quran";
import { Chapter, Verse } from "@/types/quran";
import { QuranReader } from "@/components/QuranReader";
import { ArrowLeft, ChevronLeft, ChevronRight, AlertCircle, RefreshCw } from "lucide-react";

interface SurahPageProps {
  params: Promise<{
    surahId: string;
  }>;
}

export default function SurahDetailPage({ params }: SurahPageProps) {
  const resolvedParams = use(params);
  const surahId = parseInt(resolvedParams.surahId, 10);

  const [chapter, setChapter] = useState<Chapter | null>(null);
  const [verses, setVerses] = useState<Verse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadSurah() {
      if (isNaN(surahId) || surahId < 1 || surahId > 114) {
        setError("Invalid Surah number. Please choose between 1 and 114.");
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      setError(null);

      try {
        const [chData, vData] = await Promise.all([
          getChapterDetails(surahId),
          getChapterVerses(surahId, 1, 300),
        ]);

        setChapter(chData);
        setVerses(vData.verses);
      } catch (err: any) {
        console.error("Failed to load surah:", err);
        setError("Failed to load Surah verses. Please check your internet connection.");
      } finally {
        setIsLoading(false);
      }
    }

    loadSurah();
  }, [surahId]);

  const prevSurahId = surahId > 1 ? surahId - 1 : null;
  const nextSurahId = surahId < 114 ? surahId + 1 : null;

  return (
    <main className="space-y-4">
      {/* Top Header */}
      <header className="flex items-center justify-between pt-1 pb-1">
        <div className="flex items-center gap-3">
          <Link
            href="/quran"
            className="flex items-center justify-center w-9 h-9 rounded-full border border-qalb-border dark:border-qalb-night-border bg-qalb-card dark:bg-qalb-night-card text-qalb-ink dark:text-qalb-night-ink hover:text-qalb-gold hover:border-qalb-gold transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div className="truncate">
            <h1 className="text-base font-serif font-bold tracking-tight text-qalb-ink dark:text-qalb-night-ink truncate">
              {chapter ? chapter.name_simple : `Surah ${surahId}`}
            </h1>
            <p className="text-[11px] text-qalb-muted font-sans">
              {chapter ? `${chapter.name_complex} • Chapter ${chapter.id}` : "Loading..."}
            </p>
          </div>
        </div>
      </header>

      {/* Error state */}
      {error && (
        <div className="flex items-center justify-between p-3.5 rounded-2xl bg-red-50 dark:bg-red-950/30 text-red-700 dark:text-red-400 text-xs">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
          <button
            onClick={() => window.location.reload()}
            className="flex items-center gap-1 font-semibold underline ml-2"
          >
            <RefreshCw className="w-3 h-3" />
            Retry
          </button>
        </div>
      )}

      {/* Loading Skeleton */}
      {isLoading && (
        <div className="space-y-3">
          <div className="h-44 rounded-3xl animate-pulse bg-qalb-card dark:bg-qalb-night-card border border-qalb-border dark:border-qalb-night-border" />
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="h-28 rounded-3xl animate-pulse bg-qalb-card dark:bg-qalb-night-card border border-qalb-border dark:border-qalb-night-border"
            />
          ))}
        </div>
      )}

      {/* Reader Content */}
      {!isLoading && chapter && verses.length > 0 && (
        <>
          <QuranReader
            chapter={chapter}
            verses={verses}
          />

          {/* Surah Navigation (Prev / Next) */}
          <nav className="flex items-center justify-between pt-4 pb-8 border-t border-qalb-border dark:border-qalb-night-border">
            {prevSurahId ? (
              <Link
                href={`/quran/${prevSurahId}`}
                className="flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold border transition-all bg-qalb-card dark:bg-qalb-night-card border-qalb-border dark:border-qalb-night-border hover:border-qalb-gold text-qalb-ink dark:text-qalb-night-ink shadow-sm"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Previous Surah</span>
              </Link>
            ) : (
              <div />
            )}

            {nextSurahId ? (
              <Link
                href={`/quran/${nextSurahId}`}
                className="flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold border transition-all bg-qalb-card dark:bg-qalb-night-card border-qalb-border dark:border-qalb-night-border hover:border-qalb-gold text-qalb-ink dark:text-qalb-night-ink shadow-sm"
              >
                <span>Next Surah</span>
                <ChevronRight className="w-4 h-4" />
              </Link>
            ) : (
              <div />
            )}
          </nav>
        </>
      )}
    </main>
  );
}
