"use client";

import { useState, useEffect } from "react";
import { Smartphone, Plus, RotateCcw, Volume2, VolumeX, Hand, Check } from "lucide-react";

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
  const [selectedPreset, setSelectedPreset] = useState<DhikrPreset>(PRESETS[0]);
  const [count, setCount] = useState<number>(16);
  const [totalToday, setTotalToday] = useState<number>(1247);
  const [cycles, setCycles] = useState<number>(7);
  const [hapticEnabled, setHapticEnabled] = useState<boolean>(true);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(false);
  const [showAddModal, setShowAddModal] = useState<boolean>(false);
  const [newArabic, setNewArabic] = useState("");
  const [newName, setNewName] = useState("");
  const [newTarget, setNewTarget] = useState("33");

  useEffect(() => {
    const saved = localStorage.getItem("qalb-tasbih-count");
    if (saved) {
      try {
        const data = JSON.parse(saved);
        setCount(data.count ?? 16);
        setTotalToday(data.totalToday ?? 1247);
        setCycles(data.cycles ?? 7);
      } catch (e) {}
    }
  }, []);

  const saveStats = (c: number, total: number, cyc: number) => {
    localStorage.setItem(
      "qalb-tasbih-count",
      JSON.stringify({ count: c, totalToday: total, cycles: cyc })
    );
  };

  const playClickSound = () => {
    if (!soundEnabled) return;
    try {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(600, audioCtx.currentTime);
      gain.gain.setValueAtTime(0.08, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.05);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.05);
    } catch (e) {}
  };

  const handleTap = () => {
    playClickSound();
    if (hapticEnabled && typeof navigator !== "undefined" && navigator.vibrate) {
      navigator.vibrate(25);
    }

    const nextCount = count + 1;
    const nextTotal = totalToday + 1;

    if (nextCount >= selectedPreset.target) {
      if (hapticEnabled && typeof navigator !== "undefined" && navigator.vibrate) {
        navigator.vibrate([50, 50, 50]);
      }
      setCount(0);
      setCycles(cycles + 1);
      setTotalToday(nextTotal);
      saveStats(0, nextTotal, cycles + 1);
    } else {
      setCount(nextCount);
      setTotalToday(nextTotal);
      saveStats(nextCount, nextTotal, cycles);
    }
  };

  const handleReset = () => {
    setCount(0);
    saveStats(0, totalToday, cycles);
  };

  const target = selectedPreset.target;
  const remainingInCycle = target - count;
  const percentInCycle = Math.round((count / target) * 100);

  // Weekly dummy distribution matching screenshot (M, T, W, T, F, S, S)
  const weekData = [
    { day: "M", height: "55%", active: false },
    { day: "T", height: "80%", active: false },
    { day: "W", height: "40%", active: false },
    { day: "T", height: "95%", active: false },
    { day: "F", height: "70%", active: false },
    { day: "S", height: "60%", active: false },
    { day: "S", height: "85%", active: true }, // Current Sunday highlighted in gold
  ];

  return (
    <main className="space-y-4">
      {/* Header */}
      <header className="flex items-center justify-between pt-1 pb-1">
        <div>
          <h1 className="text-xl font-serif font-bold text-qalb-ink dark:text-qalb-night-ink">
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
      <div className="flex items-center gap-2 overflow-x-auto pb-1.5 custom-scrollbar">
        {PRESETS.map((preset) => {
          const isSelected = selectedPreset.id === preset.id;
          return (
            <button
              key={preset.id}
              onClick={() => {
                setSelectedPreset(preset);
                setCount(0);
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
                className={`font-amiri text-xs font-semibold leading-none ${
                  isSelected ? "text-white" : "text-qalb-ink dark:text-qalb-night-ink"
                }`}
              >
                {preset.arabic}
              </span>
              <span
                className={`text-[10px] mt-1 font-sans ${
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

        {/* Arabic Dhikr Text */}
        <div className="space-y-1">
          <div
            dir="rtl"
            lang="ar"
            className="font-amiri text-3xl sm:text-4xl font-bold text-qalb-green dark:text-qalb-gold"
          >
            {selectedPreset.arabic}
          </div>
          <p className="text-xs text-qalb-muted font-serif">
            {selectedPreset.meaning}
          </p>
        </div>

        {/* Circular Progress Display */}
        <div className="relative flex items-center justify-center my-3">
          <svg className="w-52 h-52 sm:w-60 sm:h-60" viewBox="0 0 200 200">
            {/* Background ring */}
            <circle
              cx="100"
              cy="100"
              r="80"
              fill="none"
              stroke="#F1EEE7"
              strokeWidth="6"
            />
            {/* Progress ring */}
            <circle
              cx="100"
              cy="100"
              r="80"
              fill="none"
              stroke="#1D7A5C"
              strokeWidth="6"
              strokeDasharray={2 * Math.PI * 80}
              strokeDashoffset={2 * Math.PI * 80 * (1 - count / target)}
              strokeLinecap="round"
              transform="rotate(-90 100 100)"
              className="transition-all duration-200"
            />
          </svg>

          {/* Center Content */}
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-4xl sm:text-5xl font-serif font-bold text-qalb-ink dark:text-qalb-night-ink tracking-tight tabular-nums">
              {totalToday}
            </span>
            <span className="text-xs font-semibold text-qalb-muted font-sans mt-0.5">
              {count} / {target}
            </span>
            <span className="mt-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#E3F2ED] text-[#1D7A5C]">
              {cycles} cycles • {percentInCycle}%
            </span>
          </div>
        </div>

        {/* Big TAP TO COUNT Button */}
        <div>
          <button
            onClick={handleTap}
            className="w-full max-w-xs mx-auto py-3.5 px-6 rounded-full font-bold text-sm tracking-wider uppercase text-white bg-qalb-green hover:bg-qalb-green-dark active:scale-95 transition-all shadow-md flex items-center justify-center gap-2"
          >
            <Hand className="w-4 h-4" />
            <span>TAP TO COUNT</span>
          </button>
          <p className="text-[11px] text-qalb-muted mt-2">
            {remainingInCycle} left to complete cycle • <strong className="text-qalb-green dark:text-qalb-gold">{cycles}x completed</strong>
          </p>
        </div>

        {/* Auxiliary Controls: Reset, Haptic Toggle, Sound Toggle */}
        <div className="flex items-center justify-center gap-2 pt-2">
          <button
            onClick={handleReset}
            className="flex items-center gap-1.5 py-2 px-3.5 rounded-xl text-xs font-semibold bg-qalb-card-subtle dark:bg-qalb-night-subtle text-qalb-ink dark:text-qalb-night-ink hover:border-qalb-gold border border-qalb-border dark:border-qalb-night-border"
          >
            <RotateCcw className="w-3.5 h-3.5 text-qalb-muted" />
            <span>Reset</span>
          </button>

          <button
            onClick={() => setHapticEnabled(!hapticEnabled)}
            className={`flex items-center gap-1.5 py-2 px-3.5 rounded-xl text-xs font-semibold border transition-colors ${
              hapticEnabled
                ? "bg-qalb-green text-white border-qalb-green"
                : "bg-qalb-card-subtle dark:bg-qalb-night-subtle text-qalb-ink dark:text-qalb-night-ink border-qalb-border"
            }`}
          >
            <span>+ Tap • Haptic</span>
          </button>

          <button
            onClick={() => setSoundEnabled(!soundEnabled)}
            className="flex items-center gap-1.5 py-2 px-3.5 rounded-xl text-xs font-semibold bg-qalb-card-subtle dark:bg-qalb-night-subtle text-qalb-ink dark:text-qalb-night-ink hover:border-qalb-gold border border-qalb-border dark:border-qalb-night-border"
          >
            {soundEnabled ? <Volume2 className="w-3.5 h-3.5 text-qalb-green" /> : <VolumeX className="w-3.5 h-3.5 text-qalb-muted" />}
            <span>Sound</span>
          </button>
        </div>
      </section>

      {/* Statistics Cards (Screenshot 6) */}
      <section className="grid grid-cols-2 gap-2.5">
        <div className="p-4 rounded-2xl bg-qalb-card dark:bg-qalb-night-card border border-qalb-border dark:border-qalb-night-border shadow-qalb-card space-y-1.5">
          <span className="text-[10px] font-bold uppercase tracking-wider text-qalb-muted">
            TODAY'S TOTAL
          </span>
          <div className="text-xl font-serif font-bold text-qalb-ink dark:text-qalb-night-ink tabular-nums">
            {totalToday.toLocaleString()}
          </div>
          <div className="w-full h-1.5 rounded-full bg-qalb-card-subtle dark:bg-qalb-night-subtle overflow-hidden">
            <div className="h-full bg-emerald-600 rounded-full w-3/4" />
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-qalb-card dark:bg-qalb-night-card border border-qalb-border dark:border-qalb-night-border shadow-qalb-card space-y-1.5">
          <span className="text-[10px] font-bold uppercase tracking-wider text-qalb-muted">
            WEEKLY GOAL
          </span>
          <div className="text-xl font-serif font-bold text-qalb-ink dark:text-qalb-night-ink tabular-nums">
            5,000
          </div>
          <div className="w-full h-1.5 rounded-full bg-qalb-card-subtle dark:bg-qalb-night-subtle overflow-hidden">
            <div className="h-full bg-qalb-gold rounded-full w-3/5" />
          </div>
        </div>
      </section>

      {/* "This Week" Bar Chart Card */}
      <section className="p-4 sm:p-5 rounded-2xl bg-qalb-card dark:bg-qalb-night-card border border-qalb-border dark:border-qalb-night-border shadow-qalb-card space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-serif font-bold text-qalb-ink dark:text-qalb-night-ink">
            This Week
          </h3>
          <span className="text-[10px] text-qalb-muted">
            Tap to view details
          </span>
        </div>

        {/* 7-day capsule bars */}
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
            <h3 className="text-sm font-serif font-bold text-qalb-ink dark:text-qalb-night-ink">
              Add Custom Dhikr
            </h3>
            <input
              type="text"
              placeholder="Arabic text (e.g. سُبْحَانَ اللَّهِ)"
              dir="rtl"
              value={newArabic}
              onChange={(e) => setNewArabic(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-xl border bg-qalb-card-subtle border-qalb-border outline-none"
            />
            <input
              type="text"
              placeholder="Title / Transliteration (e.g. SubhanAllah)"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-xl border bg-qalb-card-subtle border-qalb-border outline-none"
            />
            <input
              type="number"
              placeholder="Target Count (e.g. 33 or 100)"
              value={newTarget}
              onChange={(e) => setNewTarget(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-xl border bg-qalb-card-subtle border-qalb-border outline-none"
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
