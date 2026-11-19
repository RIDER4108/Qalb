"use client";

import { useState, useRef } from "react";
import { BookOpen, Play, Pause, Share2, Bookmark, Check } from "lucide-react";

export function DailyAyahCard() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Verse 2:286 vocal-only recitation (Mishary Rashid Alafasy)
  const audioSrc = "https://verses.quran.com/Alafasy/mp3/002286.mp3";

  const togglePlay = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play();
      setIsPlaying(true);
    }
  };

  const handleShare = () => {
    const text = `لَا يُكَلِّفُ اللَّهُ نَفْسًا إِلَّا وُسْعَهَا\n\n"Allah does not burden a soul beyond that it can bear."\n[Surah Al-Baqarah 2:286] — via Qalb`;
    if (navigator.share) {
      navigator.share({ title: "Daily Ayah", text }).catch(() => {});
    } else {
      navigator.clipboard.writeText(text);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    }
  };

  return (
    <section className="p-5 sm:p-6 rounded-3xl bg-qalb-card dark:bg-qalb-night-card border border-qalb-border dark:border-qalb-night-border shadow-qalb-card space-y-4">
      <audio
        ref={audioRef}
        src={audioSrc}
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
            <h3 className="text-xs font-serif font-bold text-qalb-ink dark:text-qalb-night-ink">
              Daily Ayah
            </h3>
            <p className="text-[10px] text-qalb-muted">
              Surah Al-Baqarah 2:286
            </p>
          </div>
        </div>

        {/* Vocal Recitation Play Button */}
        <button
          onClick={togglePlay}
          aria-label={isPlaying ? "Pause audio recitation" : "Play vocal recitation"}
          className="flex items-center justify-center w-8 h-8 rounded-full bg-qalb-green dark:bg-qalb-gold text-white dark:text-qalb-night-bg hover:opacity-90 active:scale-95 transition-all shadow-xs"
        >
          {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 ml-0.5 fill-current" />}
        </button>
      </div>

      {/* Scripture: Strict dir="rtl", Amiri Font, generous line-height */}
      <div className="py-2 text-center">
        <p
          dir="rtl"
          lang="ar"
          className="font-amiri text-2xl sm:text-3xl font-bold text-qalb-ink dark:text-qalb-night-ink leading-[2.2]"
        >
          لَا يُكَلِّفُ اللَّهُ نَفْسًا إِلَّا وُسْعَهَا
        </p>

        {/* Transliteration */}
        <p className="mt-2 text-xs italic font-serif text-qalb-muted">
          La yukallifullahu nafsan illa wus'aha
        </p>

        {/* Translation */}
        <p className="mt-1 text-xs sm:text-sm text-qalb-ink dark:text-qalb-night-ink font-sans leading-relaxed">
          "Allah does not burden a soul beyond that it can bear."
        </p>
      </div>

      {/* Action Buttons: Share & Save */}
      <div className="grid grid-cols-2 gap-2.5 pt-1">
        <button
          onClick={handleShare}
          className="flex items-center justify-center gap-1.5 py-2.5 px-4 rounded-xl text-xs font-semibold bg-qalb-card-subtle dark:bg-qalb-night-subtle text-qalb-ink dark:text-qalb-night-ink hover:border-qalb-gold border border-qalb-border dark:border-qalb-night-border transition-colors active:scale-98"
        >
          {isCopied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Share2 className="w-3.5 h-3.5 text-qalb-muted" />}
          <span>{isCopied ? "Copied" : "Share"}</span>
        </button>

        <button
          onClick={() => setIsSaved(!isSaved)}
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
