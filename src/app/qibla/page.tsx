"use client";

import { useState, useEffect } from "react";
import { Compass, Navigation, Locate, RotateCw } from "lucide-react";

export default function QiblaPage() {
  const [heading, setHeading] = useState<number>(42);
  const [qiblaBearing, setQiblaBearing] = useState<number>(58); // 58 deg NE
  const [distanceKm, setDistanceKm] = useState<number>(6842);
  const [coordsStr, setCoordsStr] = useState<string>("21.38°N 39.85°E");
  const [hasCompassSensor, setHasCompassSensor] = useState<boolean>(false);
  const [calibrating, setCalibrating] = useState<boolean>(false);

  // Kaaba coordinates
  const KAABA_LAT = 21.422487;
  const KAABA_LNG = 39.826206;

  // Calculate Qibla bearing and distance given lat/lng
  const calculateQibla = (lat: number, lng: number) => {
    const latRad = (lat * Math.PI) / 180;
    const lngRad = (lng * Math.PI) / 180;
    const kLatRad = (KAABA_LAT * Math.PI) / 180;
    const kLngRad = (KAABA_LNG * Math.PI) / 180;

    const y = Math.sin(kLngRad - lngRad);
    const x =
      Math.cos(latRad) * Math.tan(kLatRad) -
      Math.sin(latRad) * Math.cos(kLngRad - lngRad);

    let qibla = (Math.atan2(y, x) * 180) / Math.PI;
    qibla = (qibla + 360) % 360;
    setQiblaBearing(Math.round(qibla));

    // Great circle distance (Haversine)
    const R = 6371; // Earth radius in km
    const dLat = kLatRad - latRad;
    const dLng = kLngRad - lngRad;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(latRad) * Math.cos(kLatRad) * Math.sin(dLng / 2) * Math.sin(dLng / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    setDistanceKm(Math.round(R * c));
    setCoordsStr(`${lat.toFixed(2)}°N ${lng.toFixed(2)}°E`);
  };

  useEffect(() => {
    // Attempt to read Geolocation
    if (typeof navigator !== "undefined" && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          calculateQibla(pos.coords.latitude, pos.coords.longitude);
        },
        () => {
          // Default to London/Makkah
          calculateQibla(21.38, 39.85);
        }
      );
    }

    // Attempt to read device compass orientation
    const handleOrientation = (e: DeviceOrientationEvent) => {
      const anyEvent = e as any;
      if (anyEvent.webkitCompassHeading !== undefined) {
        // iOS
        setHeading(Math.round(anyEvent.webkitCompassHeading));
        setHasCompassSensor(true);
      } else if (e.alpha !== null) {
        // Android
        setHeading(Math.round(360 - e.alpha));
        setHasCompassSensor(true);
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
  const isAligned = Math.abs(diff) <= 3;
  const turnDirection = diff > 0 ? `${Math.abs(Math.round(diff))}° right` : `${Math.abs(Math.round(diff))}° left`;

  return (
    <main className="space-y-4">
      {/* Header */}
      <header className="flex items-center justify-between pt-1 pb-1">
        <div>
          <h1 className="text-xl font-serif font-bold text-qalb-ink dark:text-qalb-night-ink">
            Qibla Finder
          </h1>
          <p className="text-xs text-qalb-muted font-sans">
            Face the Kaaba • Al-Masjid Al-Haram
          </p>
        </div>

        <button
          onClick={() => {
            setCalibrating(true);
            setTimeout(() => setCalibrating(false), 1500);
          }}
          className="flex items-center justify-center w-9 h-9 rounded-full bg-qalb-card dark:bg-qalb-night-card border border-qalb-border dark:border-qalb-night-border text-qalb-ink dark:text-qalb-night-ink shadow-sm hover:border-qalb-gold"
          title="Calibrate GPS"
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
              <span className="text-lg font-serif font-bold text-qalb-ink dark:text-qalb-night-ink tabular-nums">
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
            {isAligned ? "FACING QIBLA (58° NE)" : `QIBLA ${qiblaBearing}° NE • ${turnDirection}`}
          </span>
        </div>

        {/* Distance & Coordinates Row */}
        <div className="grid grid-cols-2 gap-2.5 pt-2">
          <div className="p-3 rounded-2xl bg-qalb-card-subtle dark:bg-qalb-night-subtle text-center">
            <span className="text-[9px] font-bold uppercase tracking-wider text-qalb-muted">
              DISTANCE TO KAABA
            </span>
            <div className="text-sm font-serif font-bold text-qalb-ink dark:text-qalb-night-ink mt-0.5 tabular-nums">
              {distanceKm.toLocaleString()} km
            </div>
          </div>

          <div className="p-3 rounded-2xl bg-qalb-card-subtle dark:bg-qalb-night-subtle text-center">
            <span className="text-[9px] font-bold uppercase tracking-wider text-qalb-muted">
              YOUR LOCATION
            </span>
            <div className="text-sm font-serif font-bold text-qalb-ink dark:text-qalb-night-ink mt-0.5 tabular-nums truncate">
              {coordsStr}
            </div>
          </div>
        </div>
      </section>

      {/* Manual Compass Adjust Slider Card (Screenshot 9) */}
      <section className="p-4 sm:p-5 rounded-2xl bg-qalb-card dark:bg-qalb-night-card border border-qalb-border dark:border-qalb-night-border shadow-qalb-card space-y-3">
        <div className="flex items-center justify-between text-xs">
          <span className="font-serif font-bold text-qalb-ink dark:text-qalb-night-ink">
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

      {/* How to find Qibla accurately card */}
      <section className="p-5 rounded-2xl bg-qalb-card dark:bg-qalb-night-card border border-qalb-border dark:border-qalb-night-border shadow-qalb-card space-y-3">
        <h3 className="text-xs font-serif font-bold text-qalb-ink dark:text-qalb-night-ink">
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
