"use client";

import { useState } from "react";
import { MapPin, ChevronDown, Check, Compass } from "lucide-react";
import { DEFAULT_LOCATIONS } from "@/services/aladhan";
import { LocationConfig } from "@/types/prayer";

interface LocationSelectorProps {
  currentLocation: LocationConfig;
  onSelectLocation: (loc: LocationConfig) => void;
  isLoading?: boolean;
}

export function LocationSelector({
  currentLocation,
  onSelectLocation,
  isLoading = false,
}: LocationSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [geoError, setGeoError] = useState<string | null>(null);
  const [isDetecting, setIsDetecting] = useState(false);

  const handleDetectGeo = () => {
    if (!navigator.geolocation) {
      setGeoError("Geolocation is not supported by your browser");
      return;
    }

    setIsDetecting(true);
    setGeoError(null);

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setIsDetecting(false);
        setIsOpen(false);
        onSelectLocation({
          city: "Local Device",
          country: "GPS",
          displayName: "Current Location",
          latitude: pos.coords.latitude,
          longitude: pos.coords.longitude,
          method: 2, // ISNA or standard
        });
      },
      (err) => {
        setIsDetecting(false);
        setGeoError(err.message || "Location access denied");
      },
      { timeout: 10000 }
    );
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        disabled={isLoading}
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-200 border bg-sacred-parchment-card dark:bg-sacred-night-card border-sacred-parchment-border dark:border-sacred-night-border text-sacred-ink-primary dark:text-sacred-night-primary hover:border-sacred-gold shadow-sm active:scale-98"
      >
        <MapPin className="w-3.5 h-3.5 text-sacred-gold shrink-0" />
        <span className="truncate max-w-[130px] font-sans">
          {isLoading ? "Updating..." : currentLocation.displayName}
        </span>
        <ChevronDown className="w-3 h-3 text-sacred-ink-muted dark:text-sacred-night-muted transition-transform duration-200" />
      </button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-40 bg-black/20 dark:bg-black/40 backdrop-blur-[1px]"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute left-0 mt-2 w-64 z-50 rounded-2xl p-2 shadow-sacred-float border bg-sacred-parchment-card dark:bg-sacred-night-card border-sacred-parchment-border dark:border-sacred-night-border animate-in fade-in zoom-in-95 duration-150">
            <div className="px-3 py-2 border-b border-sacred-parchment-border dark:border-sacred-night-border flex items-center justify-between">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-sacred-ink-muted dark:text-sacred-night-muted">
                Select City
              </span>
              <button
                onClick={handleDetectGeo}
                disabled={isDetecting}
                className="flex items-center gap-1 text-[11px] font-medium text-sacred-emerald dark:text-sacred-gold hover:underline"
              >
                <Compass className="w-3 h-3" />
                {isDetecting ? "Detecting..." : "GPS"}
              </button>
            </div>

            {geoError && (
              <p className="px-3 py-1.5 text-[11px] text-red-500 bg-red-50 dark:bg-red-950/30 rounded-lg my-1">
                {geoError}
              </p>
            )}

            <div className="max-h-60 overflow-y-auto py-1 space-y-0.5 custom-scrollbar">
              {DEFAULT_LOCATIONS.map((loc) => {
                const isSelected =
                  currentLocation.city === loc.city &&
                  currentLocation.country === loc.country;
                return (
                  <button
                    key={`${loc.city}-${loc.country}`}
                    onClick={() => {
                      onSelectLocation(loc);
                      setIsOpen(false);
                    }}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-left text-xs transition-colors ${
                      isSelected
                        ? "bg-sacred-emerald-light dark:bg-sacred-emerald-dark/60 text-sacred-emerald dark:text-sacred-gold font-medium"
                        : "text-sacred-ink-secondary dark:text-sacred-night-secondary hover:bg-sacred-parchment-subtle dark:hover:bg-sacred-night-subtle"
                    }`}
                  >
                    <span>{loc.displayName}</span>
                    {isSelected && <Check className="w-3.5 h-3.5 text-sacred-gold" />}
                  </button>
                );
              })}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
