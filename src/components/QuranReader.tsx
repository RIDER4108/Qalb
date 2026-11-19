"use client";

import { useState } from "react";
import { Chapter, Verse } from "@/types/quran";
import { Volume2, Share2, Copy, Check, Type, Minus, Plus } from "lucide-react";

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
  const [fontSizeLevel, setFontSizeLevel] = useState<number>(2); // 1 = sm, 2 = md, 3 = lg, 4 = xl
  const [copiedVerse, setCopiedVerse] = useState<string | null>(null);

  // Font size classes for Arabic scripture
  const arabicSizes = [
    "text-xl sm:text-2xl leading-[2.2]",
    "text-2xl sm:text-3xl leading-[2.3]",
    "text-3xl sm:text-4xl leading-[2.4]",
    "text-4xl sm:text-5xl leading-[2.5]",
  ];

  const handleCopyVerse = (verseKey: string, arabicText: string, translationText?: string) => {
    const textToCopy = `${arabicText}\n\n"${translationText || ""}"\n[Surah ${chapter.name_simple} ${verseKey}]`;
    navigator.clipboard.writeText(textToCopy);
    setCopiedVerse(verseKey);
    setTimeout(() => setCopiedVerse(null), 2000);
  };

  const isBismillahOmitted = chapter.id === 1 || chapter.id === 9; // Fatihah verse 1 is Bismillah; At-Tawbah has no Bismillah

  return (
    <div className="space-y-6">
      {/* Chapter Banner */}
      <section className="relative overflow-hidden rounded-3xl p-6 sm:p-8 text-center border shadow-sacred-card bg-sacred-parchment-card dark:bg-sacred-night-card border-sacred-parchment-border dark:border-sacred-night-border">
        {/* Subtle background ornamentation */}
        <div className="absolute inset-0 bg-gradient-to-b from-sacred-emerald-light/30 dark:from-sacred-emerald-dark/20 to-transparent pointer-events-none" />

        <div className="relative z-10 space-y-3">
          <div className="flex items-center justify-center gap-2">
            <span className="px-3 py-1 rounded-full text-[11px] font-semibold uppercase tracking-wider bg-sacred-emerald-light dark:bg-sacred-emerald-dark text-sacred-emerald dark:text-sacred-gold">
              Surah {chapter.id} • {chapter.revelation_place}
            </span>
            <span className="px-3 py-1 rounded-full text-[11px] font-medium text-sacred-ink-secondary dark:text-sacred-night-secondary bg-sacred-parchment-subtle dark:bg-sacred-night-subtle">
              {chapter.verses_count} Verses
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-bold text-sacred-ink-primary dark:text-sacred-night-primary font-sans">
            {chapter.name_simple}
          </h1>

          <div
            dir="rtl"
            lang="ar"
            className="font-amiri text-4xl sm:text-5xl font-bold text-sacred-emerald dark:text-sacred-gold py-1"
          >
            سُورَةُ {chapter.name_arabic}
          </div>

          <p className="text-sm text-sacred-ink-secondary dark:text-sacred-night-secondary max-w-sm mx-auto">
            {chapter.translated_name.name}
          </p>

          {/* Action Row: Audio Recitation & Font Size Controls */}
          <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
            <button
              onClick={onPlayChapterAudio}
              className="flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-semibold transition-all duration-200 bg-sacred-emerald dark:bg-sacred-gold text-white dark:text-sacred-night-bg hover:opacity-90 active:scale-95 shadow-sm"
            >
              <Volume2 className="w-4 h-4" />
              <span>{isPlayingAudio ? "Playing Recitation..." : "Listen Vocal Recitation"}</span>
            </button>

            {/* Font Zoom Controls */}
            <div className="flex items-center gap-1 p-1 rounded-full border border-sacred-parchment-border dark:border-sacred-night-border bg-sacred-parchment-subtle dark:bg-sacred-night-subtle">
              <button
                onClick={() => setFontSizeLevel((prev) => Math.max(0, prev - 1))}
                disabled={fontSizeLevel === 0}
                className="p-1.5 rounded-full text-sacred-ink-secondary dark:text-sacred-night-secondary hover:text-sacred-ink-primary dark:hover:text-white disabled:opacity-40"
                title="Decrease Arabic font size"
              >
                <Minus className="w-3.5 h-3.5" />
              </button>
              <span className="text-[11px] font-medium px-1 text-sacred-ink-secondary dark:text-sacred-night-secondary">
                A
              </span>
              <button
                onClick={() => setFontSizeLevel((prev) => Math.min(arabicSizes.length - 1, prev + 1))}
                disabled={fontSizeLevel === arabicSizes.length - 1}
                className="p-1.5 rounded-full text-sacred-ink-secondary dark:text-sacred-night-secondary hover:text-sacred-ink-primary dark:hover:text-white disabled:opacity-40"
                title="Increase Arabic font size"
              >
                <Plus className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Traditional Bismillah Calligraphy Header if not Surah 9 */}
      {!isBismillahOmitted && (
        <div className="text-center py-4 my-2">
          <div
            dir="rtl"
            lang="ar"
            className="font-amiri text-2xl sm:text-3xl font-semibold text-sacred-emerald dark:text-sacred-gold tracking-wide"
          >
            بِسْمِ ٱللَّهِ ٱلرَّحْمَـٰنِ ٱلرَّحِيمِ
          </div>
        </div>
      )}

      {/* Verses List */}
      <div className="space-y-4">
        {verses.map((verse) => {
          const translation = verse.translations?.[0]?.text?.replace(/<[^>]*>/g, ""); // strip any html footnote tags
          const isCopied = copiedVerse === verse.verse_key;

          return (
            <article
              key={verse.id}
              id={`verse-${verse.verse_number}`}
              className="p-5 sm:p-7 rounded-3xl border transition-all duration-200 bg-sacred-parchment-card dark:bg-sacred-night-card border-sacred-parchment-border dark:border-sacred-night-border hover:border-sacred-gold/40 shadow-sacred-card"
            >
              {/* Verse Header Row */}
              <div className="flex items-center justify-between pb-4 border-b border-sacred-parchment-border/60 dark:border-sacred-night-border/60">
                {/* Verse Key Badge */}
                <div className="flex items-center gap-2">
                  <span className="flex items-center justify-center w-8 h-8 rounded-full text-xs font-bold bg-sacred-emerald-light dark:bg-sacred-night-subtle text-sacred-emerald dark:text-sacred-gold font-sans border border-sacred-parchment-border dark:border-sacred-night-border">
                    {verse.verse_number}
                  </span>
                  <span className="text-xs font-medium text-sacred-ink-muted dark:text-sacred-night-muted">
                    {verse.verse_key}
                  </span>
                </div>

                {/* Verse Actions */}
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => handleCopyVerse(verse.verse_key, verse.text_uthmani, translation)}
                    className="p-2 rounded-full text-sacred-ink-secondary dark:text-sacred-night-secondary hover:text-sacred-gold hover:bg-sacred-parchment-subtle dark:hover:bg-sacred-night-subtle transition-colors"
                    title="Copy Verse"
                  >
                    {isCopied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>

              {/* Arabic Scripture: Strict dir="rtl", Amiri Font, generous line-height >= 2.2 to prevent harakat clipping */}
              <div className="pt-6 pb-5">
                <p
                  dir="rtl"
                  lang="ar"
                  className={`font-amiri font-normal text-sacred-ink-primary dark:text-sacred-night-primary text-right select-text ${arabicSizes[fontSizeLevel]}`}
                  style={{ wordSpacing: "0.15em" }}
                >
                  {verse.text_uthmani}
                  <span className="inline-flex items-center justify-center mx-2 text-sacred-gold text-lg sm:text-xl align-middle select-none">
                    ۝{verse.verse_number}
                  </span>
                </p>
              </div>

              {/* Translation Text */}
              {translation && (
                <div className="pt-3 border-t border-sacred-parchment-border/40 dark:border-sacred-night-border/40">
                  <p className="text-sm sm:text-base leading-relaxed text-sacred-ink-secondary dark:text-sacred-night-secondary font-sans">
                    {translation}
                  </p>
                  <span className="inline-block mt-2 text-[11px] text-sacred-ink-muted dark:text-sacred-night-muted">
                    Translation: Saheeh International / Clear Quran
                  </span>
                </div>
              )}
            </article>
          );
        })}
      </div>
    </div>
  );
}
