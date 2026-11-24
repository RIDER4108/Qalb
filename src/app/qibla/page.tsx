"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { Navigation, Locate, AlertCircle, Compass, X } from "lucide-react";
import { useApp } from "@/context/AppContext";

export default function QiblaPage() {
  const { currentLocation, qiblaInfo, requestGpsLocation, gpsPermissionDenied } = useApp();
  const [heading, setHeading] = useState<number>(0);
  const [continuousHeading, setContinuousHeading] = useState<number>(0);
  const [calibrating, setCalibrating] = useState<boolean>(false);
  const [needsIosPermission, setNeedsIosPermission] = useState<boolean>(false);
  const [compassActive, setCompassActive] = useState<boolean>(false);
  const [hasSensorLock, setHasSensorLock] = useState<boolean>(false);
  const [lowAccuracy, setLowAccuracy] = useState<boolean>(false);
  const [dismissedCalibrationHint, setDismissedCalibrationHint] = useState<boolean>(false);

  const smoothedHeadingRef = useRef<number>(0);
  const continuousHeadingRef = useRef<number>(0);
  const hasSensorLockRef = useRef<boolean>(false);
  const hasReceivedAbsoluteEventRef = useRef<boolean>(false);

  const qiblaBearing = qiblaInfo.bearing;
  const cardinal = qiblaInfo.cardinal;
  const distanceKm = qiblaInfo.distanceKm;

  const lat = currentLocation.latitude ?? 21.4225;
  const lng = currentLocation.longitude ?? 39.8262;
  const coordsStr = `${lat >= 0 ? lat.toFixed(2) + "°N" : Math.abs(lat).toFixed(2) + "°S"} ${
    lng >= 0 ? lng.toFixed(2) + "°E" : Math.abs(lng).toFixed(2) + "°W"
  }`;

  // Helper to get screen orientation angle (handles landscape vs portrait rotation)
  const getScreenOrientationAngle = (): number => {
    if (typeof window === "undefined") return 0;
    if (window.screen?.orientation?.angle !== undefined) {
      return window.screen.orientation.angle;
    }
    if (typeof (window as any).orientation === "number") {
      return (window as any).orientation;
    }
    return 0;
  };

  // Anti-Jitter Smoothing with Low-Pass Filter
  // Properly handles 359° -> 0° wrap-around using shortest angular distance
  const applyHeading = useCallback((rawHeading: number, accuracy?: number | null) => {
    const normalized = ((rawHeading % 360) + 360) % 360;

    // First sensor lock directly snaps to prevent slow convergence from 0°
    if (!hasSensorLockRef.current) {
      hasSensorLockRef.current = true;
      setHasSensorLock(true);
      smoothedHeadingRef.current = normalized;
      continuousHeadingRef.current = normalized;
      setHeading(Math.round(normalized));
      setContinuousHeading(normalized);
      setCompassActive(true);
      return;
    }

    // Compute shortest angular difference in [-180, 180]
    let diff = normalized - smoothedHeadingRef.current;
    while (diff > 180) diff -= 360;
    while (diff < -180) diff += 360;

    // Adaptive low-pass filter:
    // For small micro-jitters (|diff| <= 10°), alpha is 0.18 for steady dampening
    // For larger deliberate rotations, alpha increases to 0.45 for responsiveness
    const absDiff = Math.abs(diff);
    const alpha = absDiff > 30 ? 0.45 : absDiff > 10 ? 0.30 : 0.18;

    const delta = alpha * diff;
    smoothedHeadingRef.current = ((smoothedHeadingRef.current + delta) % 360 + 360) % 360;
    continuousHeadingRef.current += delta;

    setHeading(Math.round(smoothedHeadingRef.current));
    setContinuousHeading(continuousHeadingRef.current);
    setCompassActive(true);

    if (accuracy !== undefined && accuracy !== null) {
      // webkitCompassAccuracy: negative or > 25 indicates low magnetic sensor accuracy
      setLowAccuracy(accuracy < 0 || accuracy > 25);
    }
  }, []);

  // Android Absolute Orientation handler (deviceorientationabsolute)
  const handleAbsoluteOrientation = useCallback((e: DeviceOrientationEvent) => {
    if (e.alpha !== null) {
      hasReceivedAbsoluteEventRef.current = true;
      const screenAngle = getScreenOrientationAngle();
      const trueHeading = ((360 - e.alpha + screenAngle) % 360 + 360) % 360;
      applyHeading(trueHeading);
    }
  }, [applyHeading]);

  // Standard orientation handler (iOS webkitCompassHeading, and Android fallback)
  const handleStandardOrientation = useCallback((e: DeviceOrientationEvent) => {
    const anyEvent = e as any;
    if (anyEvent.webkitCompassHeading !== undefined && anyEvent.webkitCompassHeading !== null) {
      // iOS: webkitCompassHeading is true degrees clockwise from North
      applyHeading(anyEvent.webkitCompassHeading, anyEvent.webkitCompassAccuracy);
    } else if (!hasReceivedAbsoluteEventRef.current && e.alpha !== null) {
      // Fallback for Android/devices where absolute wasn't fired
      const screenAngle = getScreenOrientationAngle();
      const trueHeading = ((360 - e.alpha + screenAngle) % 360 + 360) % 360;
      applyHeading(trueHeading);
    }
  }, [applyHeading]);

  const startCompassListeners = useCallback(() => {
    if (typeof window === "undefined") return;

    // On Android Chrome, prefer deviceorientationabsolute
    if ("ondeviceorientationabsolute" in window) {
      window.addEventListener(
        "deviceorientationabsolute",
        handleAbsoluteOrientation as EventListener,
        true
      );
    }

    // Standard deviceorientation for iOS webkitCompassHeading and fallback
    window.addEventListener(
      "deviceorientation",
      handleStandardOrientation as EventListener,
      true
    );
  }, [handleAbsoluteOrientation, handleStandardOrientation]);

  useEffect(() => {
    if (typeof window === "undefined" || !("DeviceOrientationEvent" in window)) return;

    const DevOrient = DeviceOrientationEvent as any;
    if (typeof DevOrient.requestPermission === "function") {
      // iOS 13+ requires explicit user gesture to access compass
      setNeedsIosPermission(true);
    } else {
      // Android / browsers start listeners directly
      startCompassListeners();
    }

    return () => {
      if (typeof window !== "undefined") {
        window.removeEventListener(
          "deviceorientationabsolute",
          handleAbsoluteOrientation as EventListener,
          true
        );
        window.removeEventListener(
          "deviceorientation",
          handleStandardOrientation as EventListener,
          true
        );
      }
    };
  }, [startCompassListeners, handleAbsoluteOrientation, handleStandardOrientation]);

  const handleIosPermission = async () => {
    try {
      const DevOrient = DeviceOrientationEvent as any;
      const permission = await DevOrient.requestPermission();
      if (permission === "granted") {
        setNeedsIosPermission(false);
        startCompassListeners();
      }
    } catch (err) {
      console.error("iOS compass permission error:", err);
    }
  };

  const handleLocate = () => {
    setCalibrating(true);
    requestGpsLocation();
    setTimeout(() => setCalibrating(false), 1500);
  };

  const handleManualAdjust = (newVal: number) => {
    const normalized = ((newVal % 360) + 360) % 360;
    hasSensorLockRef.current = true;
    setHasSensorLock(true);
    let diff = normalized - smoothedHeadingRef.current;
    while (diff > 180) diff -= 360;
    while (diff < -180) diff += 360;

    smoothedHeadingRef.current = normalized;
    continuousHeadingRef.current += diff;
    setHeading(Math.round(normalized));
    setContinuousHeading(continuousHeadingRef.current);
    setCompassActive(true);
  };

  // Compute rotation angle difference
  const diff = ((qiblaBearing - heading + 540) % 360) - 180;
  const isAligned = Math.abs(diff) <= 5;
  const turnDirection =
    diff > 0 ? `${Math.abs(Math.round(diff))}° right` : `${Math.abs(Math.round(diff))}° left`;

  const showCalibrationHint = !dismissedCalibrationHint && (!hasSensorLock || lowAccuracy);

  return (
    <main className="space-y-4">
      {/* Header */}
      <header className="flex items-center justify-between pt-1 pb-1">
        <div className="flex items-center gap-2.5">
          <img src="/qalb-logo.png" alt="Qalb" className="w-8 h-8 rounded-lg object-cover" />
          <div>
            <h1 className="text-xl font-bold text-qalb-ink dark:text-qalb-night-ink">
              Qibla Finder
            </h1>
            <p className="text-xs text-qalb-muted font-sans">
              Face the Kaaba • Al-Masjid Al-Haram
            </p>
          </div>
        </div>

        <button
          onClick={handleLocate}
          className="flex items-center justify-center w-9 h-9 rounded-full bg-qalb-card dark:bg-qalb-night-card border border-qalb-border dark:border-qalb-night-border text-qalb-ink dark:text-qalb-night-ink shadow-sm hover:border-qalb-gold"
          title="Update GPS Location"
        >
          <Locate className={`w-4 h-4 ${calibrating ? "animate-spin text-qalb-gold" : ""}`} />
        </button>
      </header>

      {/* GPS Permission Denied Banner */}
      {gpsPermissionDenied && (
        <div className="flex items-start gap-3 p-3.5 rounded-2xl bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-700/50 text-amber-800 dark:text-amber-300">
          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
          <div className="text-xs">
            <p className="font-semibold">Location permission denied</p>
            <p className="text-amber-700 dark:text-amber-400 mt-0.5">
              Enable location access in your browser settings for accurate Qibla direction.
            </p>
          </div>
          <button
            onClick={handleLocate}
            className="ml-auto text-xs font-semibold text-amber-900 dark:text-amber-200 underline shrink-0"
          >
            Retry
          </button>
        </div>
      )}

      {/* iOS Compass Permission Request Button */}
      {needsIosPermission && (
        <div className="flex items-center gap-3 p-3.5 rounded-2xl bg-[#E3F2ED] dark:bg-emerald-950/40 border border-[#1D7A5C]/30 text-qalb-ink dark:text-qalb-night-ink">
          <Navigation className="w-4 h-4 text-qalb-green dark:text-qalb-gold shrink-0" />
          <p className="text-xs font-medium flex-1">
            Tap to enable the device compass for real-time Qibla direction.
          </p>
          <button
            onClick={handleIosPermission}
            className="text-xs font-bold text-white bg-qalb-green dark:bg-qalb-gold dark:text-qalb-night-bg px-3.5 py-1.5 rounded-xl shadow-xs active:scale-95 transition-all"
          >
            Enable Compass
          </button>
        </div>
      )}

      {/* Calibration Hint Banner (dismissible, shown before lock or on low accuracy) */}
      {showCalibrationHint && (
        <div className="flex items-center justify-between gap-3 p-3 rounded-2xl bg-qalb-gold-subtle/80 dark:bg-qalb-night-subtle border border-qalb-gold/30 text-qalb-ink dark:text-qalb-night-ink transition-all animate-in fade-in">
          <div className="flex items-center gap-2.5 text-xs">
            <Compass className="w-4 h-4 text-qalb-gold shrink-0 animate-pulse" />
            <span className="font-medium">
              Move your phone in a figure-8 motion to calibrate
            </span>
          </div>
          <button
            onClick={() => setDismissedCalibrationHint(true)}
            aria-label="Dismiss calibration hint"
            className="p-1 rounded-full text-qalb-muted hover:text-qalb-ink dark:hover:text-white"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Main Compass Card */}
      <section className="p-6 rounded-3xl bg-qalb-card dark:bg-qalb-night-card border border-qalb-border dark:border-qalb-night-border shadow-qalb-card text-center space-y-4">
        {/* Status Pill */}
        <div
          className={`inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-semibold transition-colors ${
            isAligned
              ? "bg-[#E3F2ED] text-[#1D7A5C]"
              : compassActive
              ? "bg-[#FEF6E4] text-[#C28C1A]"
              : "bg-qalb-card-subtle dark:bg-qalb-night-subtle text-qalb-muted"
          }`}
        >
          <span
            className={`w-2 h-2 rounded-full ${
              isAligned
                ? "bg-[#1D7A5C]"
                : compassActive
                ? "bg-[#C28C1A] animate-pulse"
                : "bg-qalb-muted"
            }`}
          />
          <span>
            {isAligned
              ? "Aligned with Kaaba ✓"
              : compassActive
              ? "Rotate device to align"
              : "Waiting for compass…"}
          </span>
        </div>

        {/* Circular Compass Dial Container */}
        <div className="relative w-64 h-64 sm:w-72 sm:h-72 mx-auto my-2">
          {/* Fixed 12 o'clock Phone Heading Indicator at top */}
          <div className="absolute -top-1 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center pointer-events-none">
            <div
              className={`w-1 h-3 rounded-full transition-colors duration-200 ${
                isAligned ? "bg-emerald-500 shadow-sm shadow-emerald-400" : "bg-qalb-gold"
              }`}
            />
            <div
              className={`w-0 h-0 border-l-[4px] border-l-transparent border-r-[4px] border-r-transparent border-t-[5px] transition-colors duration-200 ${
                isAligned ? "border-t-emerald-500" : "border-t-qalb-gold"
              }`}
            />
          </div>

          {/* Outer Ring with Cardinal Directions — rotates smoothly by -continuousHeading */}
          <div
            className="absolute inset-0 rounded-full border-2 border-qalb-border dark:border-qalb-night-border bg-qalb-card-subtle/50 dark:bg-qalb-night-subtle/50 flex items-center justify-center transition-transform duration-150 ease-out"
            style={{ transform: `rotate(${-continuousHeading}deg)` }}
          >
            {/* Cardinal Markers locked to the dial */}
            <span className="absolute top-2.5 font-bold text-xs text-red-600 font-sans">N</span>
            <span className="absolute bottom-2.5 font-bold text-xs text-qalb-muted font-sans">S</span>
            <span className="absolute left-3.5 font-bold text-xs text-qalb-muted font-sans">W</span>
            <span className="absolute right-3.5 font-bold text-xs text-qalb-muted font-sans">E</span>

            {/* Kaaba Marker stationed inside the rotating dial at rotate(${qiblaBearing}deg) */}
            <div
              className="absolute inset-0 flex items-start justify-center pointer-events-none"
              style={{ transform: `rotate(${qiblaBearing}deg)` }}
            >
              <div className="flex flex-col items-center mt-2.5">
                {/* Kaaba Badge */}
                <div
                  className={`w-9 h-9 rounded-full flex items-center justify-center shadow-md border-2 transition-all duration-200 ${
                    isAligned
                      ? "bg-emerald-600 text-white border-white scale-110 shadow-emerald-300 dark:shadow-emerald-950"
                      : "bg-qalb-gold text-white border-white"
                  }`}
                >
                  <span className="text-sm">🕋</span>
                </div>
                {/* Pointer guide toward Kaaba */}
                <div
                  className={`w-0.5 h-16 transition-colors duration-200 ${
                    isAligned ? "bg-emerald-500" : "bg-qalb-gold/60"
                  }`}
                />
              </div>
            </div>

            {/* Inner Dial Graduations */}
            <div className="w-48 h-48 rounded-full border border-dashed border-qalb-border dark:border-qalb-night-border" />
          </div>

          {/* Center Display: Live Heading Number */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
            <div className="w-20 h-20 rounded-full bg-qalb-card dark:bg-qalb-night-card border border-qalb-border dark:border-qalb-night-border shadow-md flex flex-col items-center justify-center">
              <span className="text-lg font-bold text-qalb-ink dark:text-qalb-night-ink tabular-nums">
                {heading}°
              </span>
              <span className="text-[9px] uppercase tracking-wider font-bold text-qalb-muted font-sans">
                HEADING
              </span>
            </div>
          </div>
        </div>

        {/* Alignment Instruction Banner */}
        <div
          className={`py-3 px-5 rounded-2xl text-xs font-bold text-white shadow-sm flex items-center justify-center gap-2 transition-colors duration-200 ${
            isAligned ? "bg-emerald-600" : "bg-qalb-green"
          }`}
        >
          <Navigation className="w-4 h-4 fill-current" />
          <span>
            {isAligned
              ? `FACING KAABA (${qiblaBearing}° ${cardinal})`
              : `QIBLA ${qiblaBearing}° ${cardinal} • ${turnDirection}`}
          </span>
        </div>

        {/* Distance & Coordinates Row */}
        <div className="grid grid-cols-2 gap-2.5 pt-2">
          <div className="p-3 rounded-2xl bg-qalb-card-subtle dark:bg-qalb-night-subtle text-center">
            <span className="text-[9px] font-bold uppercase tracking-wider text-qalb-muted font-sans">
              DISTANCE TO KAABA
            </span>
            <div className="text-sm font-bold text-qalb-ink dark:text-qalb-night-ink mt-0.5 tabular-nums">
              {distanceKm.toLocaleString()} km
            </div>
          </div>

          <div className="p-3 rounded-2xl bg-qalb-card-subtle dark:bg-qalb-night-subtle text-center">
            <span className="text-[9px] font-bold uppercase tracking-wider text-qalb-muted font-sans">
              YOUR LOCATION
            </span>
            <div className="text-sm font-bold text-qalb-ink dark:text-qalb-night-ink mt-0.5 tabular-nums truncate">
              {coordsStr}
            </div>
          </div>
        </div>
      </section>

      {/* Manual Adjust Slider Card (fallback / test verification) */}
      <section className="p-4 sm:p-5 rounded-2xl bg-qalb-card dark:bg-qalb-night-card border border-qalb-border dark:border-qalb-night-border shadow-qalb-card space-y-3">
        <div className="flex items-center justify-between text-xs">
          <span className="font-bold text-qalb-ink dark:text-qalb-night-ink">
            Manual Adjust
          </span>
          <span className="font-bold text-qalb-gold tabular-nums">{heading}°</span>
        </div>

        <input
          type="range"
          min="0"
          max="360"
          value={heading}
          onChange={(e) => handleManualAdjust(Number(e.target.value))}
          className="w-full h-1.5 bg-qalb-border dark:bg-qalb-night-border rounded-lg appearance-none cursor-pointer accent-qalb-green"
        />

        <div className="flex items-center justify-between text-xs pt-1">
          <button
            onClick={() => handleManualAdjust(heading - 5)}
            className="px-3 py-1.5 rounded-xl border border-qalb-border bg-qalb-card-subtle text-qalb-ink font-semibold"
          >
            - 5°
          </button>
          <span className="text-[11px] text-qalb-muted font-sans">Drag to simulate compass</span>
          <button
            onClick={() => handleManualAdjust(heading + 5)}
            className="px-3 py-1.5 rounded-xl border border-qalb-border bg-qalb-card-subtle text-qalb-ink font-semibold"
          >
            + 5°
          </button>
        </div>
      </section>

      {/* Accuracy Instructions */}
      <section className="p-5 rounded-2xl bg-qalb-card dark:bg-qalb-night-card border border-qalb-border dark:border-qalb-night-border shadow-qalb-card space-y-3">
        <h3 className="text-xs font-bold text-qalb-ink dark:text-qalb-night-ink">
          How to find Qibla accurately
        </h3>

        <div className="space-y-2.5 text-xs text-qalb-muted font-sans">
          {[
            "Hold phone flat and away from metal objects or electronic devices.",
            "Rotate slowly until the Kaaba icon aligns with the top indicator.",
            "Move phone in a figure-8 motion if accuracy seems offset or drifting.",
            "Use in an open area for highest magnetic compass accuracy.",
          ].map((tip, i) => (
            <div key={i} className="flex items-start gap-2.5">
              <span className="flex items-center justify-center w-5 h-5 rounded-full bg-qalb-card-subtle text-qalb-ink font-bold text-[10px] shrink-0 mt-0.5">
                {i + 1}
              </span>
              <p>{tip}</p>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
