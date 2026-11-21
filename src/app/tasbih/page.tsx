"use client";

import { useState, useEffect } from "react";
import {
  Smartphone,
  Plus,
  RotateCcw,
  Volume2,
  VolumeX,
  AlertTriangle,
  MoreVertical,
  Edit2,
  Trash2,
  X,
} from "lucide-react";
import { useApp } from "@/context/AppContext";
import { DhikrPreset, DEFAULT_PRESETS } from "@/data/tasbihPresets";

export default function TasbihPage() {
  const {
    tasbihTodayTotal,
    tasbihHistory,
    tasbihProgress,
    tasbihPresets,
    activeTasbihId,
    setActiveTasbihId,
    incrementTasbih,
    resetTasbihCount,
    resetTasbihCycles,
    resetTasbihTotal,
    addTasbih,
    editTasbih,
    deleteTasbih,
  } = useApp();

  const selectedPreset =
    tasbihPresets.find((p) => p.id === activeTasbihId) ||
    tasbihPresets[0] ||
    DEFAULT_PRESETS[0];

  const [hapticEnabled, setHapticEnabled] = useState<boolean>(true);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(false);
  const [isPressing, setIsPressing] = useState<boolean>(false);
  const [confirmResetTotal, setConfirmResetTotal] = useState<boolean>(false);

  // Dropdown menu state
  const [menuAnchor, setMenuAnchor] = useState<{ id: string; top: number; left: number } | null>(null);

  // Add / Edit Modal state
  const [showModal, setShowModal] = useState<boolean>(false);
  const [modalMode, setModalMode] = useState<"add" | "edit">("add");
  const [editingPresetId, setEditingPresetId] = useState<string | null>(null);

  // Custom preset form fields
  const [formArabic, setFormArabic] = useState("");
  const [formName, setFormName] = useState("");
  const [formMeaning, setFormMeaning] = useState("");
  const [formTarget, setFormTarget] = useState("33");

  // Close dropdown on scroll
  useEffect(() => {
    if (!menuAnchor) return;
    const handleScroll = () => setMenuAnchor(null);
    window.addEventListener("scroll", handleScroll, true);
    return () => window.removeEventListener("scroll", handleScroll, true);
  }, [menuAnchor]);

  const handleSelectPreset = (preset: DhikrPreset) => {
    setActiveTasbihId(preset.id);
  };

  const handleOpenAddModal = () => {
    setModalMode("add");
    setEditingPresetId(null);
    setFormArabic("");
    setFormName("");
    setFormMeaning("");
    setFormTarget("33");
    setMenuAnchor(null);
    setShowModal(true);
  };

  const handleOpenEditModal = (preset: DhikrPreset) => {
    setModalMode("edit");
    setEditingPresetId(preset.id);
    setFormArabic(preset.arabic || "");
    setFormName(preset.name || "");
    setFormMeaning(preset.meaning || "");
    setFormTarget(String(preset.target || 33));
    setMenuAnchor(null);
    setShowModal(true);
  };

  const handleDeletePreset = (presetId: string) => {
    setMenuAnchor(null);
    deleteTasbih(presetId);
  };

  const handleSubmitModal = () => {
    const trimmedName = formName.trim();
    if (!trimmedName) return;

    const targetNum = Math.max(1, parseInt(formTarget, 10) || 33);
    const arabicText = formArabic.trim() || trimmedName;

    if (modalMode === "edit" && editingPresetId) {
      editTasbih(editingPresetId, {
        name: trimmedName,
        arabic: arabicText,
        target: targetNum,
      });
      setShowModal(false);
    } else {
      addTasbih({
        name: trimmedName,
        arabic: arabicText,
        meaning: formMeaning.trim() || "Custom Dhikr",
        target: targetNum,
      });
      setShowModal(false);
    }
  };

  const playClickSound = () => {
    if (!soundEnabled) return;
    try {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(650, audioCtx.currentTime);
      gain.gain.setValueAtTime(0.06, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.04);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.04);
    } catch (e) {}
  };

  const handleCircleTap = () => {
    setIsPressing(true);
    setTimeout(() => setIsPressing(false), 120);

    playClickSound();
    if (hapticEnabled && typeof navigator !== "undefined" && navigator.vibrate) {
      navigator.vibrate(25);
    }

    incrementTasbih(selectedPreset.target, selectedPreset.id);
  };

  const currentCount = tasbihProgress[selectedPreset.id]?.count ?? 0;
  const currentCycles = tasbihProgress[selectedPreset.id]?.cycles ?? 0;
  const target = selectedPreset.target;
  const remainingInCycle = Math.max(0, target - currentCount);
  const percentInCycle = Math.min(100, Math.round((currentCount / target) * 100));

  interface DayBarItem {
    day: string;
    dateKey: string;
    count: number;
    height: string;
    active: boolean;
  }

  const [weekData, setWeekData] = useState<DayBarItem[]>([]);
  const [weekTotalCount, setWeekTotalCount] = useState<number>(0);

  // Compute real daily totals from localStorage keyed by YYYY-MM-DD
  useEffect(() => {
    const now = new Date();
    const currentDay = now.getDay(); // 0 is Sunday, 1 is Monday ... 6 is Saturday
    const distanceToMonday = currentDay === 0 ? 6 : currentDay - 1; // 0 for Mon, 4 for Fri, etc.

    const monday = new Date(now);
    monday.setDate(now.getDate() - distanceToMonday);

    const dayLetters = ["M", "T", "W", "T", "F", "S", "S"];
    const rawDays = dayLetters.map((letter, idx) => {
      const d = new Date(monday);
      d.setDate(monday.getDate() + idx);
      const yyyy = d.getFullYear();
      const mm = String(d.getMonth() + 1).padStart(2, "0");
      const dd = String(d.getDate()).padStart(2, "0");
      const dateKey = `${yyyy}-${mm}-${dd}`;
      const isToday = idx === distanceToMonday;
      const isFuture = idx > distanceToMonday;
      // Real count from localStorage (fallback to tasbihTodayTotal for today)
      const count = isFuture ? 0 : (tasbihHistory[dateKey] ?? (isToday ? tasbihTodayTotal : 0));
      return {
        day: letter,
        dateKey,
        count,
        active: isToday,
      };
    });

    const total = rawDays.reduce((acc, d) => acc + d.count, 0);
    setWeekTotalCount(total);

    // Benchmark scaling: proportional to maxCount (minimum benchmark 100)
    const maxCount = Math.max(100, ...rawDays.map((d) => d.count));

    const bars: DayBarItem[] = rawDays.map((d) => ({
      ...d,
      height: d.count > 0 ? `${Math.min(100, Math.max(12, Math.round((d.count / maxCount) * 100)))}%` : "0%",
    }));

    setWeekData(bars);
  }, [tasbihHistory, tasbihTodayTotal]);

  return (
    <main className="space-y-4">
      {/* Header */}
      <header className="flex items-center justify-between pt-1 pb-1">
        <div className="flex items-center gap-2.5">
          <img src="/qalb-logo.png" alt="Qalb" className="w-8 h-8 rounded-lg object-cover" />
          <div>
            <h1 className="text-xl font-bold text-qalb-ink dark:text-qalb-night-ink">
              Tasbih
            </h1>
            <p className="text-xs text-qalb-muted font-sans">
              Remember Allah with every tap
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setHapticEnabled(!hapticEnabled)}
            className={`flex items-center justify-center w-9 h-9 rounded-full border transition-all ${
              hapticEnabled
                ? "bg-qalb-green text-white border-qalb-green shadow-sm"
                : "bg-qalb-card dark:bg-qalb-night-card border-qalb-border dark:border-qalb-night-border text-qalb-muted"
            }`}
            title={hapticEnabled ? "Haptic Vibration Enabled" : "Enable Vibration"}
          >
            <Smartphone className="w-4 h-4" />
          </button>

          <button
            onClick={handleOpenAddModal}
            className="flex items-center justify-center w-9 h-9 rounded-full bg-qalb-card dark:bg-qalb-night-card border border-qalb-border dark:border-qalb-night-border text-qalb-ink dark:text-qalb-night-ink shadow-sm hover:border-qalb-gold"
            title="Add Custom Preset"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* Preset Pills Carousel */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 custom-scrollbar">
        {tasbihPresets.map((preset) => {
          const isSelected = selectedPreset.id === preset.id;
          return (
            <div key={preset.id} className="relative shrink-0">
              <button
                type="button"
                onClick={() => handleSelectPreset(preset)}
                className={`flex flex-col items-center justify-center pl-4 pr-7 py-2 rounded-2xl border transition-all min-w-[124px] text-center ${
                  isSelected
                    ? "bg-qalb-green text-white border-qalb-green shadow-sm"
                    : "bg-qalb-card dark:bg-qalb-night-card border-qalb-border dark:border-qalb-night-border text-qalb-ink dark:text-qalb-night-ink hover:border-qalb-gold/60"
                }`}
              >
                <span
                  dir="rtl"
                  lang="ar"
                  className={`font-quran text-xs font-semibold leading-[2.0] ${
                    isSelected ? "text-white" : "text-qalb-ink dark:text-qalb-night-ink"
                  }`}
                >
                  {preset.arabic}
                </span>
                <span
                  className={`text-[10px] mt-0.5 font-sans ${
                    isSelected ? "text-white/80" : "text-qalb-muted"
                  }`}
                >
                  {preset.name} • {preset.target}
                </span>
              </button>

              {/* Three-dots menu button */}
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  const rect = e.currentTarget.getBoundingClientRect();
                  const dropdownWidth = 112;
                  const left = Math.max(
                    8,
                    Math.min(rect.right - dropdownWidth, window.innerWidth - dropdownWidth - 8)
                  );
                  setMenuAnchor((prev) =>
                    prev?.id === preset.id
                      ? null
                      : { id: preset.id, top: rect.bottom + 6, left }
                  );
                }}
                aria-label={`Options for ${preset.name}`}
                title="Options"
                className={`absolute top-2 right-1.5 p-1 rounded-full transition-colors ${
                  isSelected
                    ? "text-white/80 hover:text-white hover:bg-white/20"
                    : "text-qalb-muted hover:text-qalb-ink dark:hover:text-qalb-night-ink hover:bg-black/5 dark:hover:bg-white/5"
                }`}
              >
                <MoreVertical className="w-3.5 h-3.5" />
              </button>
            </div>
          );
        })}
      </div>

      {/* Main Interactive Tasbih Counter Card */}
      <section className="p-6 rounded-3xl bg-qalb-card dark:bg-qalb-night-card border border-qalb-border dark:border-qalb-night-border shadow-qalb-card text-center space-y-4">
        {/* Preset Target Tag */}
        <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-semibold bg-[#E3F2ED] text-[#1D7A5C]">
          <span>
            {selectedPreset.name} • Target {selectedPreset.target}
          </span>
        </div>

        {/* Arabic Dhikr Text in Scheherazade New font */}
        <div className="space-y-1">
          <div
            dir="rtl"
            lang="ar"
            className="font-quran text-3xl sm:text-4xl font-bold text-qalb-green dark:text-qalb-gold py-1 leading-[2.2]"
          >
            {selectedPreset.arabic}
          </div>
          <p className="text-xs text-qalb-muted font-sans">
            {selectedPreset.meaning}
          </p>
        </div>

        {/* Decluttered Interactive Tappable Circle Button */}
        <div className="flex flex-col items-center justify-center my-2">
          <button
            onClick={handleCircleTap}
            aria-label="Tap to count Dhikr"
            className={`relative flex items-center justify-center w-56 h-56 sm:w-64 sm:h-64 rounded-full transition-transform duration-150 select-none outline-none focus:ring-4 focus:ring-qalb-gold/20 ${
              isPressing ? "scale-95 shadow-inner" : "hover:scale-[1.02] shadow-md active:scale-95"
            }`}
          >
            {/* SVG Progress Ring */}
            <svg className="absolute inset-0 w-full h-full" viewBox="0 0 200 200">
              <circle
                cx="100"
                cy="100"
                r="82"
                fill="none"
                stroke="#F1EEE7"
                strokeWidth="7"
                className="dark:stroke-qalb-night-subtle"
              />
              <circle
                cx="100"
                cy="100"
                r="82"
                fill="none"
                stroke="#1D7A5C"
                strokeWidth="7"
                strokeDasharray={2 * Math.PI * 82}
                strokeDashoffset={2 * Math.PI * 82 * (1 - currentCount / target)}
                strokeLinecap="round"
                transform="rotate(-90 100 100)"
                className="transition-all duration-150 ease-out"
              />
            </svg>

            {/* Decluttered Inside: Only current cycle count */}
            <div className="relative z-10 flex flex-col items-center justify-center pointer-events-none">
              <span className="text-5xl sm:text-6xl font-bold text-qalb-ink dark:text-qalb-night-ink tracking-tight tabular-nums">
                {currentCount}
              </span>
              <span className="text-xs font-semibold text-qalb-muted font-sans mt-0.5">
                / {target}
              </span>
              <span className="mt-2 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#E3F2ED] text-[#1D7A5C]">
                {currentCycles} cycles • {percentInCycle}%
              </span>
              <span className="text-[10px] text-qalb-muted mt-2 uppercase tracking-wider font-semibold">
                Tap Circle
              </span>
            </div>
          </button>
        </div>

        {/* Subtitle helper */}
        <p className="text-[11px] text-qalb-muted">
          {remainingInCycle} left to complete cycle •{" "}
          <strong className="text-qalb-green dark:text-qalb-gold">{currentCycles}x completed</strong>
        </p>

        {/* 3 Separate Reset Buttons */}
        <div className="flex items-center justify-center gap-2 pt-1 flex-wrap">
          {/* Reset Count */}
          <button
            onClick={() => resetTasbihCount(selectedPreset.id)}
            className="flex items-center gap-1.5 py-2 px-4 rounded-xl text-xs font-semibold bg-qalb-card dark:bg-qalb-night-card border border-qalb-border dark:border-qalb-night-border text-qalb-ink dark:text-qalb-night-ink hover:border-qalb-gold transition-all active:scale-95 shadow-xs"
          >
            <RotateCcw className="w-3.5 h-3.5 text-qalb-muted" />
            <span>Reset Count</span>
          </button>

          {/* Reset Cycles */}
          <button
            onClick={() => resetTasbihCycles(selectedPreset.id)}
            className="flex items-center gap-1.5 py-2 px-4 rounded-xl text-xs font-semibold bg-qalb-card dark:bg-qalb-night-card border border-qalb-border dark:border-qalb-night-border text-qalb-ink dark:text-qalb-night-ink hover:border-qalb-gold transition-all active:scale-95 shadow-xs"
          >
            <RotateCcw className="w-3.5 h-3.5 text-qalb-muted" />
            <span>Reset Cycles</span>
          </button>

          {/* Reset Total — with one-tap confirmation */}
          {confirmResetTotal ? (
            <button
              onClick={() => { resetTasbihTotal(); setConfirmResetTotal(false); }}
              className="flex items-center gap-1.5 py-2 px-4 rounded-xl text-xs font-semibold bg-red-600 text-white border border-red-600 transition-all active:scale-95 shadow-xs"
            >
              <AlertTriangle className="w-3.5 h-3.5" />
              <span>Confirm Reset</span>
            </button>
          ) : (
            <button
              onClick={() => setConfirmResetTotal(true)}
              className="flex items-center gap-1.5 py-2 px-4 rounded-xl text-xs font-semibold bg-qalb-card dark:bg-qalb-night-card border border-qalb-border dark:border-qalb-night-border text-qalb-ink dark:text-qalb-night-ink hover:border-red-400 transition-all active:scale-95 shadow-xs"
            >
              <RotateCcw className="w-3.5 h-3.5 text-qalb-muted" />
              <span>Reset Total</span>
            </button>
          )}
        </div>

        {/* Haptic & Sound Controls */}
        <div className="flex items-center justify-center gap-2">
          {/* Haptic Pill */}
          <button
            onClick={() => setHapticEnabled(!hapticEnabled)}
            className={`flex items-center gap-1.5 py-2 px-4 rounded-xl text-xs font-semibold border transition-all active:scale-95 shadow-xs ${
              hapticEnabled
                ? "bg-qalb-green text-white border-qalb-green"
                : "bg-qalb-card dark:bg-qalb-night-card border-qalb-border dark:border-qalb-night-border text-qalb-muted"
            }`}
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span>{hapticEnabled ? "Haptic On" : "Haptic Off"}</span>
          </button>

          {/* Sound Pill */}
          <button
            onClick={() => setSoundEnabled(!soundEnabled)}
            className={`flex items-center gap-1.5 py-2 px-4 rounded-xl text-xs font-semibold border transition-all active:scale-95 shadow-xs ${
              soundEnabled
                ? "bg-qalb-green text-white border-qalb-green"
                : "bg-qalb-card dark:bg-qalb-night-card border-qalb-border dark:border-qalb-night-border text-qalb-muted"
            }`}
          >
            {soundEnabled ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5" />}
            <span>{soundEnabled ? "Sound On" : "Sound Off"}</span>
          </button>
        </div>
      </section>

      {/* Daily & Weekly Total Stats Cards */}
      <section className="grid grid-cols-2 gap-2.5">
        <div className="p-4 rounded-2xl bg-qalb-card dark:bg-qalb-night-card border border-qalb-border dark:border-qalb-night-border shadow-qalb-card space-y-1.5">
          <span className="text-[10px] font-bold uppercase tracking-wider text-qalb-muted">
            TODAY'S TOTAL
          </span>
          <div className="text-xl font-bold text-qalb-ink dark:text-qalb-night-ink tabular-nums">
            {tasbihTodayTotal.toLocaleString()}
          </div>
          <div className="w-full h-1.5 rounded-full bg-qalb-card-subtle dark:bg-qalb-night-subtle overflow-hidden">
            <div
              className="h-full bg-emerald-600 rounded-full transition-all duration-300"
              style={{ width: `${Math.min(100, (tasbihTodayTotal / 500) * 100)}%` }}
            />
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-qalb-card dark:bg-qalb-night-card border border-qalb-border dark:border-qalb-night-border shadow-qalb-card space-y-1.5">
          <span className="text-[10px] font-bold uppercase tracking-wider text-qalb-muted font-sans">
            WEEKLY PROGRESS
          </span>
          <div className="text-xl font-bold text-qalb-ink dark:text-qalb-night-ink tabular-nums">
            {weekTotalCount.toLocaleString()} / 5,000
          </div>
          <div className="w-full h-1.5 rounded-full bg-qalb-card-subtle dark:bg-qalb-night-subtle overflow-hidden">
            <div
              className="h-full bg-qalb-gold rounded-full transition-all duration-300"
              style={{ width: `${Math.min(100, (weekTotalCount / 5000) * 100)}%` }}
            />
          </div>
        </div>
      </section>

      {/* "This Week" Bar Chart Card */}
      <section className="p-4 sm:p-5 rounded-2xl bg-qalb-card dark:bg-qalb-night-card border border-qalb-border dark:border-qalb-night-border shadow-qalb-card space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-bold text-qalb-ink dark:text-qalb-night-ink">
            This Week
          </h3>
          <span className="text-[10px] text-qalb-muted font-sans">
            {weekTotalCount.toLocaleString()} total • Daily consistency
          </span>
        </div>

        <div className="flex items-end justify-between pt-4 pb-1 h-32 px-2">
          {weekData.map((item, idx) => (
            <div key={idx} className="flex flex-col items-center gap-1.5 h-full justify-end">
              {/* Vertical Bar Track */}
              <div
                className={`w-7 sm:w-8 h-20 rounded-full relative flex items-end overflow-hidden p-0.5 transition-all ${
                  item.active
                    ? "bg-[#EAF7EE] dark:bg-emerald-950/40 border-2 border-qalb-green dark:border-qalb-gold shadow-xs"
                    : "bg-qalb-card-subtle dark:bg-qalb-night-subtle border-2 border-transparent"
                }`}
                title={`${item.count} dhikr on ${item.dateKey}`}
              >
                <div
                  className={`w-full rounded-full transition-all duration-500 ${
                    item.active ? "bg-qalb-green dark:bg-qalb-gold" : "bg-[#1D7A5C]"
                  }`}
                  style={{ height: item.height }}
                />
              </div>

              {/* Day Letter Badge */}
              {item.active ? (
                <div className="w-6 h-6 rounded-full bg-qalb-green dark:bg-qalb-gold text-white dark:text-qalb-night-bg flex items-center justify-center text-[10px] font-bold shadow-xs">
                  {item.day}
                </div>
              ) : (
                <div className="w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold text-qalb-muted font-sans">
                  {item.day}
                </div>
              )}

              {/* Tiny gold dot indicator directly below active day badge */}
              <div className="h-1.5 flex items-center justify-center">
                {item.active ? (
                  <span className="w-1.5 h-1.5 rounded-full bg-qalb-gold shadow-xs" />
                ) : (
                  <span className="w-1.5 h-1.5 rounded-full bg-transparent" />
                )}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Floating Three-Dots Dropdown Menu */}
      {menuAnchor && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={(e) => {
              e.stopPropagation();
              setMenuAnchor(null);
            }}
          />
          <div
            className="fixed z-50 w-28 rounded-xl bg-qalb-card dark:bg-qalb-night-card border border-qalb-border dark:border-qalb-night-border shadow-lg py-1 text-xs"
            style={{ top: `${menuAnchor.top}px`, left: `${menuAnchor.left}px` }}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => {
                const targetPreset = tasbihPresets.find((p) => p.id === menuAnchor.id);
                if (targetPreset) handleOpenEditModal(targetPreset);
                setMenuAnchor(null);
              }}
              className="w-full flex items-center gap-2 px-3 py-1.5 text-left text-qalb-ink dark:text-qalb-night-ink hover:bg-qalb-card-subtle dark:hover:bg-qalb-night-subtle transition-colors"
            >
              <Edit2 className="w-3.5 h-3.5 text-qalb-muted" />
              <span>Edit</span>
            </button>

            <button
              type="button"
              disabled={tasbihPresets.length <= 1}
              onClick={() => {
                handleDeletePreset(menuAnchor.id);
                setMenuAnchor(null);
              }}
              className={`w-full flex items-center gap-2 px-3 py-1.5 text-left transition-colors ${
                tasbihPresets.length <= 1
                  ? "text-qalb-muted/40 cursor-not-allowed"
                  : "text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30"
              }`}
              title={tasbihPresets.length <= 1 ? "Cannot delete the last remaining Tasbih" : "Delete Tasbih"}
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Delete</span>
            </button>
          </div>
        </>
      )}

      {/* Add / Edit Tasbih Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
          <div className="w-full max-w-sm rounded-3xl p-5 bg-qalb-card dark:bg-qalb-night-card border border-qalb-border dark:border-qalb-night-border shadow-xl space-y-3.5">
            <div className="flex items-center justify-between pb-1 border-b border-qalb-border/50 dark:border-qalb-night-border/50">
              <h3 className="text-sm font-bold text-qalb-ink dark:text-qalb-night-ink">
                {modalMode === "edit" ? "Edit Tasbih" : "Add Custom Dhikr"}
              </h3>
              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="p-1 rounded-full text-qalb-muted hover:text-qalb-ink dark:hover:text-qalb-night-ink"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-[10px] font-semibold text-qalb-muted mb-1 uppercase tracking-wider">
                  Arabic Text (Optional)
                </label>
                <input
                  type="text"
                  placeholder="سُبْحَانَ ٱللَّٰهِ"
                  dir="rtl"
                  lang="ar"
                  value={formArabic}
                  onChange={(e) => setFormArabic(e.target.value)}
                  className="w-full px-3 py-2 text-sm rounded-xl border bg-qalb-card-subtle dark:bg-qalb-night-subtle border-qalb-border dark:border-qalb-night-border text-qalb-ink dark:text-qalb-night-ink outline-none focus:border-qalb-gold font-quran leading-[2.0]"
                />
              </div>

              <div>
                <label className="block text-[10px] font-semibold text-qalb-muted mb-1 uppercase tracking-wider">
                  Title / Transliteration *
                </label>
                <input
                  type="text"
                  placeholder="e.g. SubhanAllah"
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl border bg-qalb-card-subtle dark:bg-qalb-night-subtle border-qalb-border dark:border-qalb-night-border text-qalb-ink dark:text-qalb-night-ink outline-none focus:border-qalb-gold font-sans"
                />
              </div>

              <div>
                <label className="block text-[10px] font-semibold text-qalb-muted mb-1 uppercase tracking-wider">
                  Target Count *
                </label>
                <input
                  type="number"
                  min="1"
                  placeholder="33"
                  value={formTarget}
                  onChange={(e) => setFormTarget(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl border bg-qalb-card-subtle dark:bg-qalb-night-subtle border-qalb-border dark:border-qalb-night-border text-qalb-ink dark:text-qalb-night-ink outline-none focus:border-qalb-gold font-sans"
                />
              </div>
            </div>

            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="flex-1 py-2 text-xs font-semibold rounded-xl bg-qalb-card-subtle dark:bg-qalb-night-subtle text-qalb-ink dark:text-qalb-night-ink border border-qalb-border dark:border-qalb-night-border hover:bg-qalb-border/30 transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={!formName.trim()}
                onClick={handleSubmitModal}
                className="flex-1 py-2 text-xs font-semibold rounded-xl bg-qalb-green text-white hover:bg-emerald-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-xs"
              >
                {modalMode === "edit" ? "Save Changes" : "Add"}
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
