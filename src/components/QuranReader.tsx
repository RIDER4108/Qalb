"use client";

import { useState } from "react";
import { Chapter, Verse } from "@/types/quran";
import { Volume2, Copy, Check, Minus, Plus } from "lucide-react";

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

  const isBismillahOmitted = chapter.id === 1 || chapter.id === 9;

  return (
    <div className="space-y-4">
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

        <h1 className="text-xl sm:text-2xl font-serif font-bold text-qalb-ink dark:text-qalb-night-ink">
          {chapter.name_simple}
        </h1>

        <div
          dir="rtl"
          lang="ar"
          className="font-indopak text-3xl sm:text-4xl font-bold text-qalb-green dark:text-qalb-gold py-1"
        >
          سُورَةُ {chapter.name_arabic}
        </div>

        <p className="text-xs text-qalb-muted max-w-sm mx-auto font-sans">
          {chapter.translated_name.name}
        </p>

        {/* Action Controls: Audio Recitation & Font Size */}
        <div className="pt-2 flex flex-wrap items-center justify-center gap-2.5">
          <button
            onClick={onPlayChapterAudio}
            className="flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold transition-all duration-200 bg-qalb-green dark:bg-qalb-gold text-white dark:text-qalb-night-bg hover:opacity-90 active:scale-95 shadow-sm"
          >
            <Volume2 className="w-3.5 h-3.5" />
            <span>{isPlayingAudio ? "Playing Recitation..." : "Listen Vocal Recitation"}</span>
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
            <span className="text-[10px] font-bold px-1.5 text-qalb-muted">
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
            className="font-indopak text-2xl sm:text-3xl font-semibold text-qalb-green dark:text-qalb-gold tracking-wide"
          >
            بِسْمِ ٱللَّهِ ٱلرَّحْمَـٰنِ ٱلرَّحِيمِ
          </div>
        </div>
      )}

      {/* Verses List */}
      <div className="space-y-3.5">
        {verses.map((verse) => {
          const translation = verse.translations?.[0]?.text?.replace(/<[^>]*>/g, "");
          const isCopied = copiedVerse === verse.verse_key;

          return (
            <article
              key={verse.id}
              id={`verse-${verse.verse_number}`}
              className="p-4 sm:p-5 rounded-3xl border transition-all duration-200 bg-qalb-card dark:bg-qalb-night-card border-qalb-border dark:border-qalb-night-border hover:border-qalb-gold/40 shadow-qalb-card"
            >
              {/* Verse Header Row */}
              <div className="flex items-center justify-between pb-3 border-b border-qalb-border/50 dark:border-qalb-night-border/50">
                <div className="flex items-center gap-2">
                  <span className="flex items-center justify-center w-7 h-7 rounded-full text-xs font-bold bg-qalb-card-subtle dark:bg-qalb-night-subtle text-qalb-green dark:text-qalb-gold font-sans border border-qalb-border dark:border-qalb-night-border">
                    {verse.verse_number}
                  </span>
                  <span className="text-[11px] font-medium text-qalb-muted font-sans">
                    {verse.verse_key}
                  </span>
                </div>

                <button
                  onClick={() => handleCopyVerse(verse.verse_key, verse.text_uthmani, translation)}
                  className="p-1.5 rounded-lg text-qalb-muted hover:text-qalb-gold transition-colors"
                  title="Copy Verse"
                >
                  {isCopied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              </div>

              {/* Arabic Scripture: Strict dir="rtl", IndoPak Font, line-height >= 2.2 */}
              <div className="pt-4 pb-3">
                <p
                  dir="rtl"
                  lang="ar"
                  className={`font-indopak font-normal text-qalb-ink dark:text-qalb-night-ink text-right select-text ${arabicSizes[fontSizeLevel]}`}
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
    </div>
  );
}
