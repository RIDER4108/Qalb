"use client";

import { useEffect, useRef, useState } from "react";
import { Play, Pause, Volume2, VolumeX, X, RotateCcw } from "lucide-react";

interface AudioPlayerBarProps {
  audioUrl: string;
  surahName: string;
  reciterName?: string;
  onClose?: () => void;
}

export function AudioPlayerBar({
  audioUrl,
  surahName,
  reciterName = "Mishary Rashid Alafasy (Vocal Only)",
  onClose,
}: AudioPlayerBarProps) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isMuted, setIsMuted] = useState(false);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleTimeUpdate = () => setCurrentTime(audio.currentTime);
    const handleLoadedMetadata = () => setDuration(audio.duration);
    const handleEnded = () => setIsPlaying(false);

    audio.addEventListener("timeupdate", handleTimeUpdate);
    audio.addEventListener("loadedmetadata", handleLoadedMetadata);
    audio.addEventListener("ended", handleEnded);

    return () => {
      audio.removeEventListener("timeupdate", handleTimeUpdate);
      audio.removeEventListener("loadedmetadata", handleLoadedMetadata);
      audio.removeEventListener("ended", handleEnded);
    };
  }, [audioUrl]);

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

  const toggleMute = () => {
    if (!audioRef.current) return;
    audioRef.current.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const time = Number(e.target.value);
    setCurrentTime(time);
    if (audioRef.current) {
      audioRef.current.currentTime = time;
    }
  };

  const formatTime = (secs: number) => {
    if (isNaN(secs)) return "00:00";
    const mins = Math.floor(secs / 60);
    const rem = Math.floor(secs % 60);
    return `${mins.toString().padStart(2, "0")}:${rem.toString().padStart(2, "0")}`;
  };

  return (
    <div className="fixed bottom-20 inset-x-0 z-40 flex justify-center px-4 animate-in slide-in-from-bottom duration-200">
      <audio ref={audioRef} src={audioUrl} preload="metadata" />

      <div className="w-full max-w-lg p-3 sm:p-4 rounded-3xl border shadow-qalb-float backdrop-blur-xl bg-qalb-card/95 dark:bg-qalb-night-card/95 border-qalb-border dark:border-qalb-night-border flex flex-col gap-2">
        {/* Top Info Row */}
        <div className="flex items-center justify-between">
          <div className="truncate pr-2">
            <h4 className="text-xs sm:text-sm font-bold text-qalb-ink dark:text-qalb-night-ink truncate">
              {surahName}
            </h4>
            <p className="text-[11px] text-qalb-gold font-medium truncate font-sans">
              {reciterName}
            </p>
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            <button
              onClick={() => {
                if (audioRef.current) audioRef.current.currentTime = 0;
              }}
              title="Restart"
              className="p-1.5 rounded-full text-qalb-muted hover:text-qalb-ink dark:hover:text-white"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={toggleMute}
              title={isMuted ? "Unmute" : "Mute"}
              className="p-1.5 rounded-full text-qalb-muted hover:text-qalb-ink dark:hover:text-white"
            >
              {isMuted ? <VolumeX className="w-4 h-4 text-red-500" /> : <Volume2 className="w-4 h-4" />}
            </button>
            {onClose && (
              <button
                onClick={onClose}
                title="Close player"
                className="p-1.5 rounded-full text-qalb-muted hover:text-qalb-ink dark:hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Progress Slider */}
        <div className="flex items-center gap-2">
          <span className="text-[10px] text-qalb-muted tabular-nums w-8 font-sans">
            {formatTime(currentTime)}
          </span>
          <input
            type="range"
            min={0}
            max={duration || 100}
            value={currentTime}
            onChange={handleSeek}
            className="flex-1 h-1.5 bg-qalb-card-subtle dark:bg-qalb-night-subtle rounded-lg appearance-none cursor-pointer accent-qalb-green dark:accent-qalb-gold"
          />
          <span className="text-[10px] text-qalb-muted tabular-nums w-8 text-right font-sans">
            {formatTime(duration)}
          </span>

          <button
            onClick={togglePlay}
            aria-label={isPlaying ? "Pause recitation" : "Play recitation"}
            className="flex items-center justify-center w-8 h-8 rounded-full bg-qalb-green dark:bg-qalb-gold text-white dark:text-qalb-night-bg hover:opacity-90 active:scale-95 transition-all shadow-sm shrink-0 ml-1"
          >
            {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 ml-0.5" />}
          </button>
        </div>
      </div>
    </div>
  );
}
