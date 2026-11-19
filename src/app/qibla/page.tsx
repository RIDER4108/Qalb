"use client";

import { useState, useEffect } from "react";
import { Navigation, Locate } from "lucide-react";
import { useApp } from "@/context/AppContext";

export default function QiblaPage() {
  const { currentLocation, qiblaInfo, setLocation } = useApp();
  const [heading, setHeading] = useState<number>(42);
  const [calibrating, setCalibrating] = useState<boolean>(false);

  const qiblaBearing = qiblaInfo.bearing;
  const cardinal = qiblaInfo.cardinal;
  const distanceKm = qiblaInfo.distanceKm;

  const lat = currentLocation.latitude ?? 21.4225;
  const lng = currentLocation.longitude ?? 39.8262;
  const coordsStr = `${lat >= 0 ? lat.toFixed(2) + "°N" : Math.abs(lat).toFixed(2) + "°S"} ${
    lng >= 0 ? lng.toFixed(2) + "°E" : Math.abs(lng).toFixed(2) + "°W"
  }`;

  useEffect(() => {
    // Compass orientation from device sensor
    const handleOrientation = (e: DeviceOrientationEvent) => {
      const anyEvent = e as any;
      if (anyEvent.webkitCompassHeading !== undefined) {
        setHeading(Math.round(anyEvent.webkitCompassHeading));
      } else if (e.alpha !== null) {
        setHeading(Math.round(360 - e.alpha));
      }
    };

    if (typeof window !== "undefined" && "DeviceOrientationEvent" in window) {
      window.addEventListener("deviceorientation", handleOrientation, true);
    }

    return () => {
      if (typeof window !== "undefined") {
        window.removeEventListener("deviceorientation", handleOrientation, true);
      }
    };
  }, []);

  // Compute rotation angle difference
  const diff = ((qiblaBearing - heading + 540) % 360) - 180;
  const isAligned = Math.abs(diff) <= 4;
  const turnDirection = diff > 0 ? `${Math.abs(Math.round(diff))}° right` : `${Math.abs(Math.round(diff))}° left`;

  const handleLocate = () => {
    setCalibrating(true);
    if (typeof navigator !== "undefined" && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setLocation({
            city: "Current GPS",
            country: "Local",
            displayName: "Current Location",
            latitude: pos.coords.latitude,
            longitude: pos.coords.longitude,
            method: 2,
          });
          setCalibrating(false);
        },
        () => setCalibrating(false)
      );
    } else {
      setTimeout(() => setCalibrating(false), 1000);
    }
  };

  return (
    <main className="space-y-4">
      {/* Header */}
      <header className="flex items-center justify-between pt-1 pb-1">
        <div>
          <h1 className="text-xl font-bold text-qalb-ink dark:text-qalb-night-ink">
            Qibla Finder
          </h1>
          <p className="text-xs text-qalb-muted font-sans">
            Face the Kaaba • Al-Masjid Al-Haram
          </p>
        </div>

        <button
          onClick={handleLocate}
          className="flex items-center justify-center w-9 h-9 rounded-full bg-qalb-card dark:bg-qalb-night-card border border-qalb-border dark:border-qalb-night-border text-qalb-ink dark:text-qalb-night-ink shadow-sm hover:border-qalb-gold"
          title="Update Location GPS"
        >
          <Locate className={`w-4 h-4 ${calibrating ? "animate-spin text-qalb-gold" : ""}`} />
        </button>
      </header>

      {/* Main Compass Card */}
      <section className="p-6 rounded-3xl bg-qalb-card dark:bg-qalb-night-card border border-qalb-border dark:border-qalb-night-border shadow-qalb-card text-center space-y-4">
        {/* Status Pill */}
        <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-semibold bg-[#FEF6E4] text-[#C28C1A]">
          <span className="w-2 h-2 rounded-full bg-[#C28C1A] animate-pulse" />
          <span>{isAligned ? "Aligned with Kaaba" : "Rotate device to align"}</span>
        </div>

        {/* Circular Compass Dial */}
        <div className="relative w-64 h-64 sm:w-72 sm:h-72 mx-auto my-2">
          {/* Outer Ring with Cardinal Directions */}
          <div
            className="absolute inset-0 rounded-full border-2 border-qalb-border dark:border-qalb-night-border bg-qalb-card-subtle/50 dark:bg-qalb-night-subtle/50 flex items-center justify-center transition-transform duration-300 ease-out"
            style={{ transform: `rotate(${-heading}deg)` }}
          >
            {/* Cardinal Markers */}
            <span className="absolute top-2 font-bold text-xs text-red-600 font-sans">N</span>
            <span className="absolute bottom-2 font-bold text-xs text-qalb-muted font-sans">S</span>
            <span className="absolute left-3 font-bold text-xs text-qalb-muted font-sans">W</span>
            <span className="absolute right-3 font-bold text-xs text-qalb-muted font-sans">E</span>

            {/* Kaaba Marker Icon stationed at Qibla Bearing */}
            <div
              className="absolute inset-0 flex items-start justify-center pointer-events-none"
              style={{ transform: `rotate(${qiblaBearing}deg)` }}
            >
              <div className="flex flex-col items-center mt-2">
                <div className="w-8 h-8 rounded-full bg-qalb-gold text-white flex items-center justify-center shadow-md border-2 border-white">
                  <span className="text-xs font-bold">🕋</span>
                </div>
              </div>
            </div>

            {/* Inner Dial Graduations */}
            <div className="w-48 h-48 rounded-full border border-dashed border-qalb-border dark:border-qalb-night-border" />
          </div>

          {/* Compass Needle pointing to Qibla */}
          <div
            className="absolute inset-0 flex items-center justify-center pointer-events-none transition-transform duration-300 ease-out"
            style={{ transform: `rotate(${diff}deg)` }}
          >
            <div className="w-1.5 h-24 bg-qalb-green rounded-full shadow-sm" />
          </div>

          {/* Center Display: Heading */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="w-20 h-20 rounded-full bg-qalb-card dark:bg-qalb-night-card border border-qalb-border dark:border-qalb-night-border shadow-md flex flex-col items-center justify-center">
              <span className="text-lg font-bold text-qalb-ink dark:text-qalb-night-ink tabular-nums">
                {heading}°
              </span>
              <span className="text-[9px] uppercase tracking-wider font-bold text-qalb-muted">
                HEADING
              </span>
            </div>
          </div>
        </div>

        {/* Alignment Instruction Banner */}
        <div
          className={`py-3 px-5 rounded-2xl text-xs font-bold text-white shadow-sm flex items-center justify-center gap-2 transition-colors ${
            isAligned ? "bg-emerald-600" : "bg-qalb-green"
          }`}
        >
          <Navigation className="w-4 h-4 fill-current" />
          <span>
            {isAligned ? `FACING KAABA (${qiblaBearing}° ${cardinal})` : `QIBLA ${qiblaBearing}° ${cardinal} • ${turnDirection}`}
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

      {/* Manual Compass Adjust Slider Card */}
      <section className="p-4 sm:p-5 rounded-2xl bg-qalb-card dark:bg-qalb-night-card border border-qalb-border dark:border-qalb-night-border shadow-qalb-card space-y-3">
        <div className="flex items-center justify-between text-xs">
          <span className="font-bold text-qalb-ink dark:text-qalb-night-ink">
            Manual Adjust
          </span>
          <span className="font-bold text-qalb-gold tabular-nums">{heading.toFixed(1)}°</span>
        </div>

        <input
          type="range"
          min="0"
          max="360"
          value={heading}
          onChange={(e) => setHeading(Number(e.target.value))}
          className="w-full h-1.5 bg-qalb-border dark:bg-qalb-night-border rounded-lg appearance-none cursor-pointer accent-qalb-green"
        />

        <div className="flex items-center justify-between text-xs pt-1">
          <button
            onClick={() => setHeading((prev) => (prev - 5 + 360) % 360)}
            className="px-3 py-1.5 rounded-xl border border-qalb-border bg-qalb-card-subtle text-qalb-ink font-semibold"
          >
            - 5°
          </button>
          <span className="text-[11px] text-qalb-muted">Drag to simulate compass</span>
          <button
            onClick={() => setHeading((prev) => (prev + 5) % 360)}
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
          <div className="flex items-start gap-2.5">
            <span className="flex items-center justify-center w-5 h-5 rounded-full bg-qalb-card-subtle text-qalb-ink font-bold text-[10px] shrink-0 mt-0.5">
              1
            </span>
            <p>Hold phone flat and away from metal objects or electronic devices.</p>
          </div>
          <div className="flex items-start gap-2.5">
            <span className="flex items-center justify-center w-5 h-5 rounded-full bg-qalb-card-subtle text-qalb-ink font-bold text-[10px] shrink-0 mt-0.5">
              2
            </span>
            <p>Rotate slowly until the green needle points directly to the Kaaba icon.</p>
          </div>
          <div className="flex items-start gap-2.5">
            <span className="flex items-center justify-center w-5 h-5 rounded-full bg-qalb-card-subtle text-qalb-ink font-bold text-[10px] shrink-0 mt-0.5">
              3
            </span>
            <p>Calibrate by moving phone in a figure-8 motion if accuracy seems offset.</p>
          </div>
          <div className="flex items-start gap-2.5">
            <span className="flex items-center justify-center w-5 h-5 rounded-full bg-qalb-card-subtle text-qalb-ink font-bold text-[10px] shrink-0 mt-0.5">
              4
            </span>
            <p>Use in an open area for highest magnetic compass accuracy.</p>
          </div>
        </div>
      </section>
    </main>
  );
}
