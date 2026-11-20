"use client";

import { useState } from "react";
import { Smartphone, Plus, RotateCcw, Volume2, VolumeX, AlertTriangle } from "lucide-react";
import { useApp } from "@/context/AppContext";

interface DhikrPreset {
  id: string;
  arabic: string;
  name: string;
  meaning: string;
  target: number;
}

const PRESETS: DhikrPreset[] = [
  { id: "subhanallah", arabic: "سُبْحَانَ ٱللَّٰهِ", name: "SubhanAllah", meaning: "Glory be to Allah", target: 33 },
  { id: "alhamdulillah", arabic: "ٱلْحَمْدُ لِلَّٰهِ", name: "Alhamdulillah", meaning: "Praise be to Allah", target: 33 },
  { id: "allahuakbar", arabic: "ٱللَّٰهُ أَكْبَرُ", name: "Allahu Akbar", meaning: "Allah is the Greatest", target: 34 },
  { id: "astaghfirullah", arabic: "أَسْتَغْفِرُ ٱللَّٰهَ", name: "Astaghfirullah", meaning: "I ask Allah for forgiveness", target: 33 },
  { id: "lailahaillallah", arabic: "لَا إِلَٰهَ إِلَّا ٱللَّٰهُ", name: "La ilaha illa Allah", meaning: "None has the right to be worshipped but Allah", target: 33 },
  { id: "bihamdihi", arabic: "سُبْحَانَ ٱللَّٰهِ وَبِحَمْدِهِ", name: "SubhanAllahi wa bihamdihi", meaning: "Glory be to Allah and His is the praise", target: 100 },
];

export default function TasbihPage() {
  const {
    tasbihCount,
    tasbihCycles,
    tasbihTodayTotal,
    incrementTasbih,
    resetTasbih,
    resetTasbihCount,
    resetTasbihCycles,
    resetTasbihTotal,
  } = useApp();

  const [selectedPreset, setSelectedPreset] = useState<DhikrPreset>(PRESETS[0]);
  const [hapticEnabled, setHapticEnabled] = useState<boolean>(true);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(false);
  const [showAddModal, setShowAddModal] = useState<boolean>(false);
  const [isPressing, setIsPressing] = useState<boolean>(false);
  const [confirmResetTotal, setConfirmResetTotal] = useState<boolean>(false);

  // Custom preset form
  const [newArabic, setNewArabic] = useState("");
  const [newName, setNewName] = useState("");
  const [newTarget, setNewTarget] = useState("33");

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

    incrementTasbih(selectedPreset.target);
  };

  const target = selectedPreset.target;
  const remainingInCycle = target - tasbihCount;
  const percentInCycle = Math.min(100, Math.round((tasbihCount / target) * 100));

  // Dynamic day highlight for the weekly bar chart (Mon=0..Sun=6)
  const [activeDayIdx, setActiveDayIdx] = useState<number>(() => {
    const d = new Date().getDay();
    return d === 0 ? 6 : d - 1;
  });

  useEffect(() => {
    const d = new Date().getDay();
    setActiveDayIdx(d === 0 ? 6 : d - 1);
  }, []);

  const weekData = [
    { day: "M", height: "45%", active: activeDayIdx === 0 },
    { day: "T", height: "60%", active: activeDayIdx === 1 },
    { day: "W", height: "40%", active: activeDayIdx === 2 },
    { day: "T", height: "70%", active: activeDayIdx === 3 },
    { day: "F", height: "85%", active: activeDayIdx === 4 },
    { day: "S", height: "30%", active: activeDayIdx === 5 },
    { day: "S", height: "20%", active: activeDayIdx === 6 },
  ];

  return (
    <main className="space-y-4">
      {/* Header */}
      <header className="flex items-center justify-between pt-1 pb-1">
        <div>
          <h1 className="text-xl font-bold text-qalb-ink dark:text-qalb-night-ink">
            Tasbih
          </h1>
          <p className="text-xs text-qalb-muted font-sans">
            Remember Allah with every tap
          </p>
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
            onClick={() => setShowAddModal(true)}
            className="flex items-center justify-center w-9 h-9 rounded-full bg-qalb-card dark:bg-qalb-night-card border border-qalb-border dark:border-qalb-night-border text-qalb-ink dark:text-qalb-night-ink shadow-sm hover:border-qalb-gold"
            title="Add Custom Preset"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* Preset Pills Carousel */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 custom-scrollbar">
        {PRESETS.map((preset) => {
          const isSelected = selectedPreset.id === preset.id;
          return (
            <button
              key={preset.id}
              onClick={() => {
                setSelectedPreset(preset);
                resetTasbih();
              }}
              className={`flex flex-col items-center justify-center px-4 py-2 rounded-2xl border transition-all shrink-0 min-w-[120px] text-center ${
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
                strokeDashoffset={2 * Math.PI * 82 * (1 - tasbihCount / target)}
                strokeLinecap="round"
                transform="rotate(-90 100 100)"
                className="transition-all duration-150 ease-out"
              />
            </svg>

            {/* Decluttered Inside: Only current cycle count */}
            <div className="relative z-10 flex flex-col items-center justify-center pointer-events-none">
              <span className="text-5xl sm:text-6xl font-bold text-qalb-ink dark:text-qalb-night-ink tracking-tight tabular-nums">
                {tasbihCount}
              </span>
              <span className="text-xs font-semibold text-qalb-muted font-sans mt-0.5">
                / {target}
              </span>
              <span className="mt-2 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#E3F2ED] text-[#1D7A5C]">
                {tasbihCycles} cycles • {percentInCycle}%
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
          <strong className="text-qalb-green dark:text-qalb-gold">{tasbihCycles}x completed</strong>
        </p>

        {/* 3 Separate Reset Buttons */}
        <div className="flex items-center justify-center gap-2 pt-1 flex-wrap">
          {/* Reset Count */}
          <button
            onClick={resetTasbihCount}
            className="flex items-center gap-1.5 py-2 px-4 rounded-xl text-xs font-semibold bg-qalb-card dark:bg-qalb-night-card border border-qalb-border dark:border-qalb-night-border text-qalb-ink dark:text-qalb-night-ink hover:border-qalb-gold transition-all active:scale-95 shadow-xs"
          >
            <RotateCcw className="w-3.5 h-3.5 text-qalb-muted" />
            <span>Reset Count</span>
          </button>

          {/* Reset Cycles */}
          <button
            onClick={resetTasbihCycles}
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

      {/* Moved Out: Daily & Weekly Total Stats Cards */}
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
          <span className="text-[10px] font-bold uppercase tracking-wider text-qalb-muted">
            WEEKLY GOAL
          </span>
          <div className="text-xl font-bold text-qalb-ink dark:text-qalb-night-ink tabular-nums">
            5,000
          </div>
          <div className="w-full h-1.5 rounded-full bg-qalb-card-subtle dark:bg-qalb-night-subtle overflow-hidden">
            <div
              className="h-full bg-qalb-gold rounded-full transition-all duration-300"
              style={{ width: `${Math.min(100, (tasbihTodayTotal / 5000) * 100)}%` }}
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
          <span className="text-[10px] text-qalb-muted">
            Daily consistency
          </span>
        </div>

        <div className="flex items-end justify-between pt-4 pb-1 h-28 px-2">
          {weekData.map((item, idx) => (
            <div key={idx} className="flex flex-col items-center gap-2 h-full justify-end">
              <div className="w-7 sm:w-8 h-20 rounded-full bg-qalb-card-subtle dark:bg-qalb-night-subtle relative flex items-end overflow-hidden p-0.5">
                <div
                  className={`w-full rounded-full transition-all duration-500 ${
                    item.active ? "bg-qalb-gold" : "bg-[#1D7A5C]"
                  }`}
                  style={{ height: item.height }}
                />
              </div>
              <span
                className={`text-[10px] font-bold ${
                  item.active ? "text-qalb-gold" : "text-qalb-muted"
                }`}
              >
                {item.day}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* Add Custom Preset Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
          <div className="w-full max-w-sm rounded-3xl p-5 bg-qalb-card dark:bg-qalb-night-card border border-qalb-border dark:border-qalb-night-border shadow-xl space-y-3">
            <h3 className="text-sm font-bold text-qalb-ink dark:text-qalb-night-ink">
              Add Custom Dhikr
            </h3>
            <input
              type="text"
              placeholder="Arabic text (e.g. سُبْحَانَ اللَّهِ)"
              dir="rtl"
              value={newArabic}
              onChange={(e) => setNewArabic(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-xl border bg-qalb-card-subtle border-qalb-border outline-none font-quran leading-[2.0]"
            />
            <input
              type="text"
              placeholder="Title / Transliteration (e.g. SubhanAllah)"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-xl border bg-qalb-card-subtle border-qalb-border outline-none font-sans"
            />
            <input
              type="number"
              placeholder="Target Count (e.g. 33 or 100)"
              value={newTarget}
              onChange={(e) => setNewTarget(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-xl border bg-qalb-card-subtle border-qalb-border outline-none font-sans"
            />
            <div className="flex gap-2 pt-2">
              <button
                onClick={() => setShowAddModal(false)}
                className="flex-1 py-2 text-xs font-semibold rounded-xl bg-qalb-card-subtle text-qalb-ink"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  if (newName) {
                    PRESETS.push({
                      id: `custom-${Date.now()}`,
                      arabic: newArabic || newName,
                      name: newName,
                      meaning: "Custom Dhikr",
                      target: parseInt(newTarget, 10) || 33,
                    });
                    setShowAddModal(false);
                  }
                }}
                className="flex-1 py-2 text-xs font-semibold rounded-xl bg-qalb-green text-white"
              >
                Add
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
