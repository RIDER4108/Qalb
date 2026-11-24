"use client";

import { useState, useEffect, useRef } from "react";
import { BookOpen, Play, Pause, Share2, Bookmark, Check } from "lucide-react";
import { DAILY_AYAHS, getClientDailyAyah, DailyAyahItem } from "@/data/dailyAyahs";

export function DailyAyahCard() {
  // Initialize with deterministic fallback, then compute client-side on mount
  const [ayah, setAyah] = useState<DailyAyahItem>(() => DAILY_AYAHS[0]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Compute Daily Ayah client-side using user's local date (dayOfYear % ayahsList.length)
  useEffect(() => {
    const todayAyah = getClientDailyAyah(new Date());
    setAyah(todayAyah);

    // Check saved state from localStorage
    try {
      const savedKey = `qalb_saved_ayah_${todayAyah.id}`;
      setIsSaved(localStorage.getItem(savedKey) === "true");
    } catch (_) {}

    // Check at midnight interval to auto-rotate if the app remains open
    const interval = setInterval(() => {
      const refreshedAyah = getClientDailyAyah(new Date());
      setAyah((prev) => (prev.id !== refreshedAyah.id ? refreshedAyah : prev));
    }, 60000);

    return () => clearInterval(interval);
  }, []);

  const togglePlay = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play().catch((err) => {
        console.warn("Audio playback interrupted:", err);
        setIsPlaying(false);
      });
      setIsPlaying(true);
    }
  };

  const handleToggleSave = () => {
    const nextSaved = !isSaved;
    setIsSaved(nextSaved);
    try {
      const savedKey = `qalb_saved_ayah_${ayah.id}`;
      if (nextSaved) {
        localStorage.setItem(savedKey, "true");
      } else {
        localStorage.removeItem(savedKey);
      }
    } catch (_) {}
  };

  const handleShare = () => {
    const text = `${ayah.arabic}\n\n"${ayah.translation}"\n[Surah ${ayah.surahName} ${ayah.surahNumber}:${ayah.ayahNumber}] — via Qalb`;
    if (typeof navigator !== "undefined" && navigator.share) {
      navigator.share({ title: `Daily Ayah - Surah ${ayah.surahName}`, text }).catch(() => {});
    } else if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(text);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    }
  };

  return (
    <section className="p-5 sm:p-6 rounded-3xl bg-qalb-card dark:bg-qalb-night-card border border-qalb-border dark:border-qalb-night-border shadow-qalb-card space-y-4">
      <audio
        ref={audioRef}
        src={ayah.audioUrl}
        onEnded={() => setIsPlaying(false)}
        preload="none"
      />

      {/* Top Meta Row */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="flex items-center justify-center w-8 h-8 rounded-full bg-qalb-gold-subtle dark:bg-qalb-night-subtle text-qalb-gold">
            <BookOpen className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-xs font-bold text-qalb-ink dark:text-qalb-night-ink">
              Daily Ayah
            </h3>
            <p className="text-[10px] text-qalb-muted font-sans">
              Surah {ayah.surahName} {ayah.surahNumber}:{ayah.ayahNumber}
            </p>
          </div>
        </div>

        {/* Vocal Recitation Play Button */}
        <button
          onClick={togglePlay}
          aria-label={isPlaying ? "Pause audio recitation" : "Play vocal recitation"}
          className="flex items-center justify-center w-8 h-8 rounded-full bg-qalb-green dark:bg-qalb-gold text-white dark:text-qalb-night-bg hover:opacity-90 active:scale-95 transition-all shadow-xs"
        >
          {isPlaying ? (
            <Pause className="w-3.5 h-3.5" />
          ) : (
            <Play className="w-3.5 h-3.5 ml-0.5 fill-current" />
          )}
        </button>
      </div>

      {/* Scripture: Strict dir="rtl", IndoPak/Scheherazade Font, generous line-height */}
      <div className="py-2 text-center">
        <p
          dir="rtl"
          lang="ar"
          className="font-quran text-2xl sm:text-3xl font-bold text-qalb-ink dark:text-qalb-night-ink leading-[2.3]"
        >
          {ayah.arabic}
        </p>

        {/* Transliteration */}
        {ayah.transliteration && (
          <p className="mt-2 text-xs italic font-sans text-qalb-muted leading-relaxed">
            {ayah.transliteration}
          </p>
        )}

        {/* Translation */}
        <p className="mt-1.5 text-xs sm:text-sm text-qalb-ink dark:text-qalb-night-ink font-sans leading-relaxed">
          &ldquo;{ayah.translation}&rdquo;
        </p>
      </div>

      {/* Action Buttons: Share & Save */}
      <div className="grid grid-cols-2 gap-2.5 pt-1">
        <button
          onClick={handleShare}
          className="flex items-center justify-center gap-1.5 py-2.5 px-4 rounded-xl text-xs font-semibold bg-qalb-card-subtle dark:bg-qalb-night-subtle text-qalb-ink dark:text-qalb-night-ink hover:border-qalb-gold border border-qalb-border dark:border-qalb-night-border transition-colors active:scale-98"
        >
          {isCopied ? (
            <Check className="w-3.5 h-3.5 text-emerald-500" />
          ) : (
            <Share2 className="w-3.5 h-3.5 text-qalb-muted" />
          )}
          <span>{isCopied ? "Copied" : "Share"}</span>
        </button>

        <button
          onClick={handleToggleSave}
          className={`flex items-center justify-center gap-1.5 py-2.5 px-4 rounded-xl text-xs font-semibold transition-colors active:scale-98 ${
            isSaved
              ? "bg-qalb-green text-white"
              : "bg-qalb-green dark:bg-qalb-gold text-white dark:text-qalb-night-bg hover:opacity-90"
          }`}
        >
          <Bookmark className={`w-3.5 h-3.5 ${isSaved ? "fill-current" : ""}`} />
          <span>{isSaved ? "Saved" : "Save"}</span>
        </button>
      </div>
    </section>
  );
}
