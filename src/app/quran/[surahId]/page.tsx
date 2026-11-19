"use client";

import { useEffect, useState, use } from "react";
import Link from "next/link";
import { getChapterDetails, getChapterVerses, getChapterAudio, DEFAULT_RECITER_NAME } from "@/services/quran";
import { Chapter, Verse } from "@/types/quran";
import { QuranReader } from "@/components/QuranReader";
import { AudioPlayerBar } from "@/components/AudioPlayerBar";
import { ThemeToggle } from "@/components/ThemeToggle";
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
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [showAudioPlayer, setShowAudioPlayer] = useState(false);
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

        // Fetch vocal-only audio
        try {
          const audioData = await getChapterAudio(surahId);
          setAudioUrl(audioData.audio_file.audio_url);
        } catch (audioErr) {
          console.warn("Failed to fetch chapter audio:", audioErr);
        }
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
    <main className="space-y-6">
      {/* Top Header */}
      <header className="flex items-center justify-between pt-2 pb-1">
        <div className="flex items-center gap-3">
          <Link
            href="/quran"
            className="flex items-center justify-center w-9 h-9 rounded-full border border-sacred-parchment-border dark:border-sacred-night-border bg-sacred-parchment-card dark:bg-sacred-night-card text-sacred-ink-secondary dark:text-sacred-night-secondary hover:text-sacred-gold hover:border-sacred-gold transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div className="truncate">
            <h1 className="text-base font-bold tracking-tight text-sacred-ink-primary dark:text-sacred-night-primary font-sans truncate">
              {chapter ? chapter.name_simple : `Surah ${surahId}`}
            </h1>
            <p className="text-xs text-sacred-ink-muted dark:text-sacred-night-muted">
              {chapter ? `${chapter.name_complex} • Chapter ${chapter.id}` : "Loading..."}
            </p>
          </div>
        </div>

        <ThemeToggle />
      </header>

      {/* Error state */}
      {error && (
        <div className="flex items-center justify-between p-4 rounded-2xl bg-red-50 dark:bg-red-950/30 text-red-700 dark:text-red-400 text-xs">
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
        <div className="space-y-4">
          <div className="h-48 rounded-3xl animate-pulse bg-sacred-parchment-card dark:bg-sacred-night-card border border-sacred-parchment-border dark:border-sacred-night-border" />
          {Array.from({ length: 5 }).map((_, i) => (
            <div
              key={i}
              className="h-32 rounded-3xl animate-pulse bg-sacred-parchment-card dark:bg-sacred-night-card border border-sacred-parchment-border dark:border-sacred-night-border"
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
            onPlayChapterAudio={() => {
              if (audioUrl) {
                setShowAudioPlayer(true);
              }
            }}
            isPlayingAudio={showAudioPlayer}
          />

          {/* Surah Navigation (Prev / Next) */}
          <nav className="flex items-center justify-between pt-6 pb-8 border-t border-sacred-parchment-border dark:border-sacred-night-border">
            {prevSurahId ? (
              <Link
                href={`/quran/${prevSurahId}`}
                className="flex items-center gap-2 px-4 py-2.5 rounded-full text-xs font-semibold border transition-all bg-sacred-parchment-card dark:bg-sacred-night-card border-sacred-parchment-border dark:border-sacred-night-border hover:border-sacred-gold text-sacred-ink-primary dark:text-sacred-night-primary shadow-sm"
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
                className="flex items-center gap-2 px-4 py-2.5 rounded-full text-xs font-semibold border transition-all bg-sacred-parchment-card dark:bg-sacred-night-card border-sacred-parchment-border dark:border-sacred-night-border hover:border-sacred-gold text-sacred-ink-primary dark:text-sacred-night-primary shadow-sm"
              >
                <span>Next Surah</span>
                <ChevronRight className="w-4 h-4" />
              </Link>
            ) : (
              <div />
            )}
          </nav>

          {/* Vocal-only audio player */}
          {showAudioPlayer && audioUrl && (
            <AudioPlayerBar
              audioUrl={audioUrl}
              surahName={`Surah ${chapter.name_simple} (${chapter.name_arabic})`}
              reciterName={DEFAULT_RECITER_NAME}
              onClose={() => setShowAudioPlayer(false)}
            />
          )}
        </>
      )}
    </main>
  );
}
