"use client";

import { useEffect, useState, use, useRef } from "react";
import Link from "next/link";
import { getParahVerses, ParahAyah } from "@/services/quran";
import { PARAHS_LIST, ParahMeta } from "@/data/parahs";
import { useApp } from "@/context/AppContext";
import {
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  AlertCircle,
  RefreshCw,
  Copy,
  Check,
  Play,
  Pause,
  Minus,
  Plus,
  SkipBack,
  SkipForward,
  X,
} from "lucide-react";

interface ParahPageProps {
  params: Promise<{
    juzId: string;
  }>;
}

export default function ParahDetailPage({ params }: ParahPageProps) {
  const resolvedParams = use(params);
  const juzId = parseInt(resolvedParams.juzId, 10);
  const { setIsAudioActive } = useApp();

  const [meta, setMeta] = useState<ParahMeta | null>(null);
  const [ayahs, setAyahs] = useState<ParahAyah[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Audio Playback State
  const [currentAyahIndex, setCurrentAyahIndex] = useState<number | null>(null);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // UI Settings
  const [fontSizeLevel, setFontSizeLevel] = useState<number>(1);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const arabicSizes = [
    "text-xl sm:text-2xl leading-[2.3]",
    "text-2xl sm:text-3xl leading-[2.4]",
    "text-3xl sm:text-4xl leading-[2.5]",
    "text-4xl sm:text-5xl leading-[2.6]",
  ];

  useEffect(() => {
    return () => {
      setIsAudioActive(false);
    };
  }, [setIsAudioActive]);

  useEffect(() => {
    async function loadParah() {
      if (isNaN(juzId) || juzId < 1 || juzId > 30) {
        setError("Invalid Parah number. Please choose between 1 and 30.");
        setIsLoading(false);
        return;
      }

      const foundMeta = PARAHS_LIST.find((p) => p.id === juzId) || null;
      setMeta(foundMeta);
      setIsLoading(true);
      setError(null);

      try {
        const data = await getParahVerses(juzId);
        setAyahs(data);
      } catch (err: any) {
        console.error("Failed to load Parah ayahs:", err);
        setError("Unable to load Parah verses. Please check your internet connection.");
      } finally {
        setIsLoading(false);
      }
    }

    loadParah();
  }, [juzId]);

  const handleCopyAyah = (key: string, arabic: string, translation: string, surah: string) => {
    const textToCopy = `${arabic}\n\n"${translation}"\n[${surah} • Parah ${juzId}] — via Qalb`;
    navigator.clipboard.writeText(textToCopy);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  // Main banner tap: auto-starts Parah recitation from Ayah 1 (or resumes current)
  const handleMainListenTap = () => {
    if (!audioRef.current || ayahs.length === 0) return;

    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
      setIsAudioActive(false);
      return;
    }

    const targetIndex = currentAyahIndex !== null ? currentAyahIndex : 0;
    const targetAyah = ayahs[targetIndex];
    if (!targetAyah) return;

    setCurrentAyahIndex(targetIndex);
    setIsPlaying(true);
    setIsAudioActive(true);

    if (audioRef.current.src !== targetAyah.audioUrl) {
      audioRef.current.src = targetAyah.audioUrl;
    }

    // Synchronously initiate audio playback inside user tap handler
    audioRef.current.play().catch((err) => {
      console.warn("Autoplay blocked or interrupted:", err);
      setIsPlaying(false);
      setIsAudioActive(false);
    });

    const el = document.getElementById(`parah-ayah-${targetAyah.number}`);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  };

  const handleTogglePlayAyah = (index: number) => {
    if (!audioRef.current || !ayahs[index]) return;

    if (currentAyahIndex === index) {
      if (isPlaying) {
        audioRef.current.pause();
        setIsPlaying(false);
        setIsAudioActive(false);
      } else {
        audioRef.current.play().catch(console.warn);
        setIsPlaying(true);
        setIsAudioActive(true);
      }
      return;
    }

    const ayah = ayahs[index];
    setCurrentAyahIndex(index);
    setIsPlaying(true);
    setIsAudioActive(true);

    audioRef.current.src = ayah.audioUrl;
    audioRef.current.currentTime = 0;
    // Synchronously initiate playback on tap
    audioRef.current.play().catch(console.warn);

    const el = document.getElementById(`parah-ayah-${ayah.number}`);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  };

  const handleAudioEnded = () => {
    if (currentAyahIndex === null) return;

    if (currentAyahIndex + 1 < ayahs.length) {
      const nextIndex = currentAyahIndex + 1;
      const nextAyah = ayahs[nextIndex];
      setCurrentAyahIndex(nextIndex);
      setIsPlaying(true);
      setIsAudioActive(true);

      if (audioRef.current) {
        audioRef.current.src = nextAyah.audioUrl;
        audioRef.current.play().catch(console.warn);
      }

      const el = document.getElementById(`parah-ayah-${nextAyah.number}`);
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "center" });
      }
    } else {
      setIsPlaying(false);
      setCurrentAyahIndex(null);
      setIsAudioActive(false);
    }
  };

  const handleNextAyah = () => {
    if (currentAyahIndex !== null && currentAyahIndex + 1 < ayahs.length) {
      handleTogglePlayAyah(currentAyahIndex + 1);
    }
  };

  const handlePrevAyah = () => {
    if (currentAyahIndex !== null && currentAyahIndex > 0) {
      handleTogglePlayAyah(currentAyahIndex - 1);
    }
  };

  const handleCloseAudio = () => {
    if (audioRef.current) {
      audioRef.current.pause();
    }
    setIsPlaying(false);
    setCurrentAyahIndex(null);
    setIsAudioActive(false);
  };

  const prevJuzId = juzId > 1 ? juzId - 1 : null;
  const nextJuzId = juzId < 30 ? juzId + 1 : null;

  return (
    <main className="space-y-4">
      {/* Hidden audio element for continuous recitation */}
      <audio
        ref={audioRef}
        onEnded={handleAudioEnded}
        onError={() => {
          setIsPlaying(false);
          setIsAudioActive(false);
        }}
        preload="none"
      />

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
              {meta ? `Parah ${meta.id} (${meta.nameEnglish})` : `Parah ${juzId}`}
            </h1>
            <p className="text-[11px] text-qalb-muted font-sans truncate">
              {meta ? `${meta.startRef} – ${meta.endRef}` : "Juz of the Noble Quran"}
            </p>
          </div>
        </div>
      </header>

      {/* Error State */}
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

      {/* Parah Content */}
      {!isLoading && meta && ayahs.length > 0 && (
        <>
          {/* Parah Banner Card */}
          <section className="relative overflow-hidden rounded-3xl p-5 sm:p-7 text-center border shadow-qalb-card bg-qalb-card dark:bg-qalb-night-card border-qalb-border dark:border-qalb-night-border space-y-3">
            <div className="flex items-center justify-center gap-2">
              <span className="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-qalb-card-subtle dark:bg-qalb-night-subtle text-qalb-green dark:text-qalb-gold font-sans">
                Parah {meta.id} (Juz {meta.id})
              </span>
              <span className="px-3 py-1 rounded-full text-[10px] font-medium text-qalb-muted bg-qalb-card-subtle dark:bg-qalb-night-subtle font-sans">
                {ayahs.length} Verses
              </span>
            </div>

            <h1 className="text-xl sm:text-2xl font-bold text-qalb-ink dark:text-qalb-night-ink">
              {meta.nameEnglish}
            </h1>

            <div
              dir="rtl"
              lang="ar"
              className="font-quran text-3xl sm:text-4xl font-bold text-qalb-green dark:text-qalb-gold py-1 leading-[2.2]"
            >
              {meta.nameArabic}
            </div>

            <p className="text-xs text-qalb-muted max-w-sm mx-auto font-sans">
              {meta.startRef} to {meta.endRef}
            </p>

            {/* Action Controls: Auto-Starting Audio & Font Zoom Controls */}
            <div className="pt-2 flex flex-wrap items-center justify-center gap-2.5">
              <button
                onClick={handleMainListenTap}
                className="flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold transition-all duration-200 bg-qalb-green dark:bg-qalb-gold text-white dark:text-qalb-night-bg hover:opacity-90 active:scale-95 shadow-sm"
              >
                {isPlaying ? (
                  <Pause className="w-3.5 h-3.5" />
                ) : (
                  <Play className="w-3.5 h-3.5 ml-0.5 fill-current" />
                )}
                <span>
                  {isPlaying
                    ? "Pause Recitation"
                    : currentAyahIndex !== null
                    ? `Resume Ayah ${ayahs[currentAyahIndex]?.numberInSurah}`
                    : "Listen Vocal Recitation"}
                </span>
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

          {/* Ayahs List with dynamic bottom padding when player is active */}
          <div
            className={`space-y-3.5 transition-all duration-200 ${
              currentAyahIndex !== null ? "pb-40 sm:pb-44" : "pb-20"
            }`}
          >
            {ayahs.map((ayah, index) => {
              const isFirstInSurah =
                index === 0 || ayahs[index - 1].surahNumber !== ayah.surahNumber;
              const isThisAyahActive = currentAyahIndex === index;
              const isThisAyahPlaying = isThisAyahActive && isPlaying;
              const copyKey = `${ayah.surahNumber}:${ayah.numberInSurah}`;
              const isCopied = copiedKey === copyKey;

              return (
                <div key={ayah.number || index} className="space-y-3.5">
                  {/* Surah Header Separator when entering a new Surah */}
                  {isFirstInSurah && (
                    <div className="pt-4 pb-2 text-center space-y-1">
                      <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-xs font-bold bg-qalb-card-subtle dark:bg-qalb-night-subtle text-qalb-green dark:text-qalb-gold border border-qalb-border dark:border-qalb-night-border font-sans">
                        <span>Surah {ayah.surahNameEnglish}</span>
                        {ayah.surahNameArabic && <span>• {ayah.surahNameArabic}</span>}
                      </div>

                      {ayah.surahNumber !== 1 && ayah.surahNumber !== 9 && (
                        <div
                          dir="rtl"
                          lang="ar"
                          className="font-quran text-2xl font-semibold text-qalb-green dark:text-qalb-gold pt-2 leading-[2.2]"
                        >
                          بِسْمِ ٱللَّهِ ٱلرَّحْمَـٰنِ ٱلرَّحِيمِ
                        </div>
                      )}
                    </div>
                  )}

                  {/* Individual Ayah Card */}
                  <article
                    id={`parah-ayah-${ayah.number}`}
                    className={`p-4 sm:p-5 rounded-3xl border transition-all duration-200 shadow-qalb-card ${
                      isThisAyahActive
                        ? "border-qalb-gold ring-2 ring-qalb-gold/30 bg-qalb-gold-subtle/15 dark:bg-qalb-night-subtle/70"
                        : "bg-qalb-card dark:bg-qalb-night-card border-qalb-border dark:border-qalb-night-border hover:border-qalb-gold/40"
                    }`}
                  >
                    {/* Ayah Header Row */}
                    <div className="flex items-center justify-between pb-3 border-b border-qalb-border/50 dark:border-qalb-night-border/50">
                      <div className="flex items-center gap-2">
                        <span
                          className={`flex items-center justify-center w-7 h-7 rounded-full text-xs font-bold font-sans border transition-colors ${
                            isThisAyahActive
                              ? "bg-qalb-gold text-white border-qalb-gold"
                              : "bg-qalb-card-subtle dark:bg-qalb-night-subtle text-qalb-green dark:text-qalb-gold border-qalb-border dark:border-qalb-night-border"
                          }`}
                        >
                          {ayah.numberInSurah}
                        </span>
                        <span className="text-[11px] font-medium text-qalb-muted font-sans">
                          {ayah.surahNameEnglish} {ayah.surahNumber}:{ayah.numberInSurah}
                        </span>
                      </div>

                      <div className="flex items-center gap-1.5">
                        {/* Play / Pause button on every Ayah card */}
                        <button
                          onClick={() => handleTogglePlayAyah(index)}
                          aria-label={
                            isThisAyahPlaying
                              ? `Pause Ayah ${ayah.numberInSurah}`
                              : `Play Ayah ${ayah.numberInSurah}`
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
                          onClick={() =>
                            handleCopyAyah(
                              copyKey,
                              ayah.textUthmani,
                              ayah.translation,
                              ayah.surahNameEnglish
                            )
                          }
                          className="p-1.5 rounded-lg text-qalb-muted hover:text-qalb-gold transition-colors"
                          title="Copy Ayah"
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
                        {ayah.textUthmani}
                        <span className="inline-flex items-center justify-center mx-2 text-qalb-gold text-base sm:text-lg align-middle select-none">
                          ۝{ayah.numberInSurah}
                        </span>
                      </p>
                    </div>

                    {/* Translation Text */}
                    {ayah.translation && (
                      <div className="pt-2 border-t border-qalb-border/30 dark:border-qalb-night-border/30">
                        <p className="text-xs sm:text-sm leading-relaxed text-qalb-ink/90 dark:text-qalb-night-ink/90 font-sans">
                          {ayah.translation}
                        </p>
                        <span className="inline-block mt-1 text-[10px] text-qalb-muted font-sans">
                          Translation: Saheeh International
                        </span>
                      </div>
                    )}
                  </article>
                </div>
              );
            })}
          </div>

          {/* Bottom Parah Prev / Next Navigation */}
          <nav className="flex items-center justify-between pt-4 pb-8 border-t border-qalb-border dark:border-qalb-night-border">
            {prevJuzId ? (
              <Link
                href={`/quran/juz/${prevJuzId}`}
                className="flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold border transition-all bg-qalb-card dark:bg-qalb-night-card border-qalb-border dark:border-qalb-night-border hover:border-qalb-gold text-qalb-ink dark:text-qalb-night-ink shadow-sm"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Previous Parah</span>
              </Link>
            ) : (
              <div />
            )}

            {nextJuzId ? (
              <Link
                href={`/quran/juz/${nextJuzId}`}
                className="flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold border transition-all bg-qalb-card dark:bg-qalb-night-card border-qalb-border dark:border-qalb-night-border hover:border-qalb-gold text-qalb-ink dark:text-qalb-night-ink shadow-sm"
              >
                <span>Next Parah</span>
                <ChevronRight className="w-4 h-4" />
              </Link>
            ) : (
              <div />
            )}
          </nav>

          {/* Floating Ayah Playback Controller Bar: z-50, sits cleanly above BottomNav */}
          {currentAyahIndex !== null && (
            <div className="fixed bottom-[74px] sm:bottom-20 inset-x-3 z-50 max-w-lg mx-auto animate-in slide-in-from-bottom duration-200">
              <div className="p-3.5 rounded-2xl border shadow-qalb-float backdrop-blur-xl bg-qalb-card/95 dark:bg-qalb-night-card/95 border-qalb-gold/40 flex items-center justify-between gap-3 text-qalb-ink dark:text-qalb-night-ink">
                <div className="flex-1 truncate">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-qalb-gold/20 text-qalb-gold font-sans">
                      Ayah {ayahs[currentAyahIndex]?.numberInSurah}
                    </span>
                    <span className="text-xs font-bold truncate">
                      {ayahs[currentAyahIndex]?.surahNameEnglish} (Parah {juzId})
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
                    title={isPlaying ? "Pause" : "Play"}
                  >
                    {isPlaying ? (
                      <Pause className="w-4 h-4" />
                    ) : (
                      <Play className="w-4 h-4 ml-0.5 fill-current" />
                    )}
                  </button>

                  <button
                    onClick={handleNextAyah}
                    disabled={currentAyahIndex === ayahs.length - 1}
                    className="p-1.5 rounded-lg text-qalb-muted hover:text-qalb-ink dark:hover:text-white disabled:opacity-30"
                    title="Next Ayah"
                  >
                    <SkipForward className="w-4 h-4" />
                  </button>

                  <button
                    onClick={handleCloseAudio}
                    className="p-1.5 rounded-lg text-qalb-muted hover:text-qalb-ink dark:hover:text-white ml-1"
                    title="Close"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </main>
  );
}
