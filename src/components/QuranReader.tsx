"use client";

import { useState, useRef, useEffect } from "react";
import { Chapter, Verse } from "@/types/quran";
import { getAyahAudioUrl } from "@/services/quran";
import { Volume2, Copy, Check, Minus, Plus, Play, Pause, SkipBack, SkipForward, X } from "lucide-react";

interface QuranReaderProps {
  chapter: Chapter;
  verses: Verse[];
  onPlayChapterAudio: () => void;
  isPlayingAudio?: boolean;
}

export function QuranReader({
  chapter,
  verses,
  onPlayChapterAudio,
  isPlayingAudio = false,
}: QuranReaderProps) {
  const [fontSizeLevel, setFontSizeLevel] = useState<number>(1);
  const [copiedVerse, setCopiedVerse] = useState<string | null>(null);

  // Per-Ayah Audio Recitation State
  const [currentAyahIndex, setCurrentAyahIndex] = useState<number | null>(null);
  const [isPlayingAyah, setIsPlayingAyah] = useState<boolean>(false);
  const ayahAudioRef = useRef<HTMLAudioElement | null>(null);

  const arabicSizes = [
    "text-xl sm:text-2xl leading-[2.3]",
    "text-2xl sm:text-3xl leading-[2.4]",
    "text-3xl sm:text-4xl leading-[2.5]",
    "text-4xl sm:text-5xl leading-[2.6]",
  ];

  const handleCopyVerse = (verseKey: string, arabicText: string, translationText?: string) => {
    const textToCopy = `${arabicText}\n\n"${translationText || ""}"\n[Surah ${chapter.name_simple} ${verseKey}] — via Qalb`;
    navigator.clipboard.writeText(textToCopy);
    setCopiedVerse(verseKey);
    setTimeout(() => setCopiedVerse(null), 2000);
  };

  // Play / Pause specific Ayah
  const handleTogglePlayAyah = (index: number) => {
    if (!ayahAudioRef.current) return;

    if (currentAyahIndex === index) {
      if (isPlayingAyah) {
        ayahAudioRef.current.pause();
        setIsPlayingAyah(false);
      } else {
        ayahAudioRef.current.play().catch(console.warn);
        setIsPlayingAyah(true);
      }
      return;
    }

    // Start new Ayah
    const verse = verses[index];
    const url = getAyahAudioUrl(chapter.id, verse.verse_number);
    setCurrentAyahIndex(index);
    setIsPlayingAyah(true);

    ayahAudioRef.current.src = url;
    ayahAudioRef.current.currentTime = 0;
    ayahAudioRef.current.play().catch(console.warn);

    // Smooth scroll to the playing verse card
    const el = document.getElementById(`verse-${verse.verse_number}`);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  };

  // Advance to next Ayah onEnded
  const handleAyahEnded = () => {
    if (currentAyahIndex === null) return;

    if (currentAyahIndex + 1 < verses.length) {
      const nextIndex = currentAyahIndex + 1;
      const nextVerse = verses[nextIndex];
      setCurrentAyahIndex(nextIndex);
      setIsPlayingAyah(true);

      if (ayahAudioRef.current) {
        ayahAudioRef.current.src = getAyahAudioUrl(chapter.id, nextVerse.verse_number);
        ayahAudioRef.current.play().catch(console.warn);
      }

      const el = document.getElementById(`verse-${nextVerse.verse_number}`);
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "center" });
      }
    } else {
      setIsPlayingAyah(false);
      setCurrentAyahIndex(null);
    }
  };

  const handleNextAyah = () => {
    if (currentAyahIndex !== null && currentAyahIndex + 1 < verses.length) {
      handleTogglePlayAyah(currentAyahIndex + 1);
    }
  };

  const handlePrevAyah = () => {
    if (currentAyahIndex !== null && currentAyahIndex > 0) {
      handleTogglePlayAyah(currentAyahIndex - 1);
    }
  };

  const handleCloseAyahAudio = () => {
    if (ayahAudioRef.current) {
      ayahAudioRef.current.pause();
    }
    setIsPlayingAyah(false);
    setCurrentAyahIndex(null);
  };

  const isBismillahOmitted = chapter.id === 1 || chapter.id === 9;

  return (
    <div className="space-y-4">
      {/* Hidden Audio element for continuous per-ayah recitation */}
      <audio
        ref={ayahAudioRef}
        onEnded={handleAyahEnded}
        onError={() => setIsPlayingAyah(false)}
        preload="none"
      />

      {/* Chapter Banner */}
      <section className="relative overflow-hidden rounded-3xl p-5 sm:p-7 text-center border shadow-qalb-card bg-qalb-card dark:bg-qalb-night-card border-qalb-border dark:border-qalb-night-border space-y-3">
        <div className="flex items-center justify-center gap-2">
          <span className="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-qalb-card-subtle dark:bg-qalb-night-subtle text-qalb-green dark:text-qalb-gold font-sans">
            Surah {chapter.id} • {chapter.revelation_place}
          </span>
          <span className="px-3 py-1 rounded-full text-[10px] font-medium text-qalb-muted bg-qalb-card-subtle dark:bg-qalb-night-subtle font-sans">
            {chapter.verses_count} Verses
          </span>
        </div>

        <h1 className="text-xl sm:text-2xl font-bold text-qalb-ink dark:text-qalb-night-ink">
          {chapter.name_simple}
        </h1>

        <div
          dir="rtl"
          lang="ar"
          className="font-quran text-3xl sm:text-4xl font-bold text-qalb-green dark:text-qalb-gold py-1 leading-[2.2]"
        >
          سُورَةُ {chapter.name_arabic}
        </div>

        <p className="text-xs text-qalb-muted max-w-sm mx-auto font-sans">
          {chapter.translated_name.name}
        </p>

        {/* Action Controls: Audio Recitation & Font Size */}
        <div className="pt-2 flex flex-wrap items-center justify-center gap-2.5">
          <button
            onClick={() => {
              handleCloseAyahAudio();
              onPlayChapterAudio();
            }}
            className="flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold transition-all duration-200 bg-qalb-green dark:bg-qalb-gold text-white dark:text-qalb-night-bg hover:opacity-90 active:scale-95 shadow-sm"
          >
            <Volume2 className="w-3.5 h-3.5" />
            <span>{isPlayingAudio ? "Playing Chapter..." : "Listen Full Surah"}</span>
          </button>

          {/* Font Zoom Controls */}
          <div className="flex items-center gap-1 p-1 rounded-full border border-qalb-border dark:border-qalb-night-border bg-qalb-card-subtle dark:bg-qalb-night-subtle">
            <button
              onClick={() => setFontSizeLevel((prev) => Math.max(0, prev - 1))}
              disabled={fontSizeLevel === 0}
              className="p-1 rounded-full text-qalb-muted hover:text-qalb-ink disabled:opacity-30"
              title="Decrease Arabic font size"
            >
              <Minus className="w-3 h-3" />
            </button>
            <span className="text-[10px] font-bold px-1.5 text-qalb-muted font-sans">
              A
            </span>
            <button
              onClick={() => setFontSizeLevel((prev) => Math.min(arabicSizes.length - 1, prev + 1))}
              disabled={fontSizeLevel === arabicSizes.length - 1}
              className="p-1 rounded-full text-qalb-muted hover:text-qalb-ink disabled:opacity-30"
              title="Increase Arabic font size"
            >
              <Plus className="w-3 h-3" />
            </button>
          </div>
        </div>
      </section>

      {/* Traditional Bismillah in IndoPak Script */}
      {!isBismillahOmitted && (
        <div className="text-center py-2 my-1">
          <div
            dir="rtl"
            lang="ar"
            className="font-quran text-2xl sm:text-3xl font-semibold text-qalb-green dark:text-qalb-gold tracking-wide leading-[2.2]"
          >
            بِسْمِ ٱللَّهِ ٱلرَّحْمَـٰنِ ٱلرَّحِيمِ
          </div>
        </div>
      )}

      {/* Verses List */}
      <div className="space-y-3.5 pb-20">
        {verses.map((verse, index) => {
          const translation = verse.translations?.[0]?.text?.replace(/<[^>]*>/g, "");
          const isCopied = copiedVerse === verse.verse_key;
          const isThisAyahActive = currentAyahIndex === index;
          const isThisAyahPlaying = isThisAyahActive && isPlayingAyah;

          return (
            <article
              key={verse.id}
              id={`verse-${verse.verse_number}`}
              className={`p-4 sm:p-5 rounded-3xl border transition-all duration-200 shadow-qalb-card ${
                isThisAyahActive
                  ? "border-qalb-gold ring-2 ring-qalb-gold/30 bg-qalb-gold-subtle/15 dark:bg-qalb-night-subtle/70"
                  : "bg-qalb-card dark:bg-qalb-night-card border-qalb-border dark:border-qalb-night-border hover:border-qalb-gold/40"
              }`}
            >
              {/* Verse Header Row */}
              <div className="flex items-center justify-between pb-3 border-b border-qalb-border/50 dark:border-qalb-night-border/50">
                <div className="flex items-center gap-2">
                  <span
                    className={`flex items-center justify-center w-7 h-7 rounded-full text-xs font-bold font-sans border transition-colors ${
                      isThisAyahActive
                        ? "bg-qalb-gold text-white border-qalb-gold"
                        : "bg-qalb-card-subtle dark:bg-qalb-night-subtle text-qalb-green dark:text-qalb-gold border-qalb-border dark:border-qalb-night-border"
                    }`}
                  >
                    {verse.verse_number}
                  </span>
                  <span className="text-[11px] font-medium text-qalb-muted font-sans">
                    {verse.verse_key}
                  </span>
                </div>

                <div className="flex items-center gap-1.5">
                  {/* Play / Pause this individual Ayah */}
                  <button
                    onClick={() => handleTogglePlayAyah(index)}
                    aria-label={
                      isThisAyahPlaying
                        ? `Pause Ayah ${verse.verse_number}`
                        : `Play Ayah ${verse.verse_number}`
                    }
                    className={`flex items-center justify-center w-7 h-7 rounded-xl border transition-all duration-200 active:scale-95 ${
                      isThisAyahPlaying
                        ? "bg-qalb-green dark:bg-qalb-gold text-white dark:text-qalb-night-bg border-transparent shadow-xs"
                        : "bg-qalb-card-subtle dark:bg-qalb-night-subtle text-qalb-ink dark:text-qalb-night-ink border-qalb-border dark:border-qalb-night-border hover:border-qalb-gold hover:text-qalb-gold"
                    }`}
                    title={isThisAyahPlaying ? "Pause Recitation" : "Listen from this Ayah"}
                  >
                    {isThisAyahPlaying ? (
                      <Pause className="w-3.5 h-3.5" />
                    ) : (
                      <Play className="w-3.5 h-3.5 ml-0.5 fill-current" />
                    )}
                  </button>

                  {/* Copy Verse */}
                  <button
                    onClick={() => handleCopyVerse(verse.verse_key, verse.text_uthmani, translation)}
                    className="p-1.5 rounded-lg text-qalb-muted hover:text-qalb-gold transition-colors"
                    title="Copy Verse"
                  >
                    {isCopied ? (
                      <Check className="w-3.5 h-3.5 text-emerald-500" />
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )}
                  </button>
                </div>
              </div>

              {/* Arabic Scripture: Strict dir="rtl", Scheherazade New Font, line-height >= 2.2 */}
              <div className="pt-4 pb-3">
                <p
                  dir="rtl"
                  lang="ar"
                  className={`font-quran font-normal text-qalb-ink dark:text-qalb-night-ink text-right select-text leading-[2.2] ${arabicSizes[fontSizeLevel]}`}
                  style={{ wordSpacing: "0.15em" }}
                >
                  {verse.text_uthmani}
                  <span className="inline-flex items-center justify-center mx-2 text-qalb-gold text-base sm:text-lg align-middle select-none">
                    ۝{verse.verse_number}
                  </span>
                </p>
              </div>

              {/* Translation Text */}
              {translation && (
                <div className="pt-2 border-t border-qalb-border/30 dark:border-qalb-night-border/30">
                  <p className="text-xs sm:text-sm leading-relaxed text-qalb-ink/90 dark:text-qalb-night-ink/90 font-sans">
                    {translation}
                  </p>
                  <span className="inline-block mt-1 text-[10px] text-qalb-muted font-sans">
                    Translation: Saheeh International / Clear Quran
                  </span>
                </div>
              )}
            </article>
          );
        })}
      </div>

      {/* Floating Ayah Playback Controller Bar */}
      {currentAyahIndex !== null && (
        <div className="fixed bottom-20 inset-x-3 z-40 max-w-lg mx-auto animate-in slide-in-from-bottom duration-200">
          <div className="p-3.5 rounded-2xl border shadow-qalb-float backdrop-blur-xl bg-qalb-card/95 dark:bg-qalb-night-card/95 border-qalb-gold/40 flex items-center justify-between gap-3 text-qalb-ink dark:text-qalb-night-ink">
            <div className="flex-1 truncate">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-qalb-gold/20 text-qalb-gold font-sans">
                  Ayah {verses[currentAyahIndex]?.verse_number} of {verses.length}
                </span>
                <span className="text-xs font-bold truncate">
                  Surah {chapter.name_simple}
                </span>
              </div>
              <p className="text-[11px] text-qalb-muted font-sans truncate mt-0.5">
                Mishary Rashid Alafasy • Vocal Recitation
              </p>
            </div>

            <div className="flex items-center gap-1 shrink-0">
              <button
                onClick={handlePrevAyah}
                disabled={currentAyahIndex === 0}
                className="p-1.5 rounded-lg text-qalb-muted hover:text-qalb-ink dark:hover:text-white disabled:opacity-30"
                title="Previous Ayah"
              >
                <SkipBack className="w-4 h-4" />
              </button>

              <button
                onClick={() => handleTogglePlayAyah(currentAyahIndex)}
                className="flex items-center justify-center w-8 h-8 rounded-full bg-qalb-green dark:bg-qalb-gold text-white dark:text-qalb-night-bg shadow-sm hover:opacity-90 active:scale-95 transition-all"
                title={isPlayingAyah ? "Pause" : "Play"}
              >
                {isPlayingAyah ? (
                  <Pause className="w-4 h-4" />
                ) : (
                  <Play className="w-4 h-4 ml-0.5 fill-current" />
                )}
              </button>

              <button
                onClick={handleNextAyah}
                disabled={currentAyahIndex === verses.length - 1}
                className="p-1.5 rounded-lg text-qalb-muted hover:text-qalb-ink dark:hover:text-white disabled:opacity-30"
                title="Next Ayah"
              >
                <SkipForward className="w-4 h-4" />
              </button>

              <button
                onClick={handleCloseAyahAudio}
                className="p-1.5 rounded-lg text-qalb-muted hover:text-qalb-ink dark:hover:text-white ml-1"
                title="Close"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
