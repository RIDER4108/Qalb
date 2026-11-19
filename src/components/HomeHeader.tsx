"use client";

import { useState } from "react";
import { Bell, Settings, MapPin, Check, ChevronDown, Compass, Moon, Sun } from "lucide-react";
import { LocationConfig } from "@/types/prayer";
import { DEFAULT_LOCATIONS } from "@/services/aladhan";

interface HomeHeaderProps {
  currentLocation: LocationConfig;
  onSelectLocation: (loc: LocationConfig) => void;
  isLoading?: boolean;
}

export function HomeHeader({ currentLocation, onSelectLocation, isLoading }: HomeHeaderProps) {
  const [showLocationModal, setShowLocationModal] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [showNotifModal, setShowNotifModal] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);

  const toggleDark = () => {
    const next = !isDarkMode;
    setIsDarkMode(next);
    document.documentElement.classList.toggle("dark", next);
  };

  return (
    <>
      <header className="flex items-center justify-between pt-1 pb-2">
        {/* Left: Greeting & Location */}
        <div>
          <span className="text-[10px] font-bold uppercase tracking-widest text-qalb-muted font-sans">
            AS-SALAMU ALAIKUM
          </span>
          <button
            onClick={() => setShowLocationModal(true)}
            className="flex items-center gap-1.5 mt-0.5 text-xs font-semibold text-qalb-ink dark:text-qalb-night-ink hover:text-qalb-green transition-colors"
          >
            <MapPin className="w-3.5 h-3.5 text-qalb-gold shrink-0" />
            <span className="truncate max-w-[170px]">
              {isLoading ? "Locating..." : `${currentLocation.city} • Auto-detected`}
            </span>
            <ChevronDown className="w-3 h-3 text-qalb-muted" />
          </button>
        </div>

        {/* Right: Notifications & Settings Buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowNotifModal(true)}
            className="flex items-center justify-center w-9 h-9 rounded-full bg-qalb-card dark:bg-qalb-night-card border border-qalb-border dark:border-qalb-night-border text-qalb-ink dark:text-qalb-night-ink shadow-sm hover:border-qalb-gold transition-colors"
            aria-label="Prayer Notifications"
          >
            <Bell className="w-4 h-4 text-qalb-ink dark:text-qalb-night-ink" />
          </button>

          <button
            onClick={() => setShowSettingsModal(true)}
            className="flex items-center justify-center w-9 h-9 rounded-full bg-qalb-card dark:bg-qalb-night-card border border-qalb-border dark:border-qalb-night-border text-qalb-ink dark:text-qalb-night-ink shadow-sm hover:border-qalb-gold transition-colors"
            aria-label="Settings"
          >
            <Settings className="w-4 h-4 text-qalb-ink dark:text-qalb-night-ink" />
          </button>
        </div>
      </header>

      {/* Location Modal */}
      {showLocationModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
          <div className="w-full max-w-sm rounded-3xl p-5 bg-qalb-card dark:bg-qalb-night-card border border-qalb-border dark:border-qalb-night-border shadow-xl space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-qalb-border dark:border-qalb-night-border">
              <h3 className="text-sm font-serif font-bold text-qalb-ink dark:text-qalb-night-ink">
                Choose Location
              </h3>
              <button
                onClick={() => {
                  if (navigator.geolocation) {
                    navigator.geolocation.getCurrentPosition((pos) => {
                      onSelectLocation({
                        city: "Current GPS",
                        country: "Local",
                        displayName: "Current Location",
                        latitude: pos.coords.latitude,
                        longitude: pos.coords.longitude,
                        method: 2,
                      });
                      setShowLocationModal(false);
                    });
                  }
                }}
                className="flex items-center gap-1 text-xs text-qalb-green dark:text-qalb-gold font-medium hover:underline"
              >
                <Compass className="w-3.5 h-3.5" />
                Use GPS
              </button>
            </div>

            <div className="max-h-64 overflow-y-auto space-y-1 custom-scrollbar">
              {DEFAULT_LOCATIONS.map((loc) => {
                const isSelected = currentLocation.city === loc.city;
                return (
                  <button
                    key={`${loc.city}-${loc.country}`}
                    onClick={() => {
                      onSelectLocation(loc);
                      setShowLocationModal(false);
                    }}
                    className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-left text-xs transition-colors ${
                      isSelected
                        ? "bg-qalb-green text-white font-medium"
                        : "text-qalb-ink dark:text-qalb-night-ink hover:bg-qalb-card-subtle dark:hover:bg-qalb-night-subtle"
                    }`}
                  >
                    <span>{loc.displayName}</span>
                    {isSelected && <Check className="w-4 h-4 text-qalb-gold" />}
                  </button>
                );
              })}
            </div>

            <button
              onClick={() => setShowLocationModal(false)}
              className="w-full py-2.5 rounded-xl text-xs font-semibold bg-qalb-card-subtle dark:bg-qalb-night-subtle text-qalb-ink dark:text-qalb-night-ink"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Settings Modal */}
      {showSettingsModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
          <div className="w-full max-w-sm rounded-3xl p-5 bg-qalb-card dark:bg-qalb-night-card border border-qalb-border dark:border-qalb-night-border shadow-xl space-y-4">
            <h3 className="text-sm font-serif font-bold text-qalb-ink dark:text-qalb-night-ink pb-2 border-b border-qalb-border dark:border-qalb-night-border">
              Preferences & Settings
            </h3>
            
            <div className="flex items-center justify-between py-2">
              <span className="text-xs text-qalb-ink dark:text-qalb-night-ink font-medium">
                Dark Mode
              </span>
              <button
                onClick={toggleDark}
                className="p-2 rounded-full border border-qalb-border dark:border-qalb-night-border bg-qalb-bg dark:bg-qalb-night-subtle text-qalb-ink dark:text-qalb-night-ink"
              >
                {isDarkMode ? <Sun className="w-4 h-4 text-qalb-gold" /> : <Moon className="w-4 h-4 text-qalb-green" />}
              </button>
            </div>

            <div className="pt-2 text-[11px] text-qalb-muted">
              App Version 1.0 • Qalb (قَلْب)
            </div>

            <button
              onClick={() => setShowSettingsModal(false)}
              className="w-full py-2.5 rounded-xl text-xs font-semibold bg-qalb-green text-white"
            >
              Done
            </button>
          </div>
        </div>
      )}

      {/* Notifications Modal */}
      {showNotifModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
          <div className="w-full max-w-sm rounded-3xl p-5 bg-qalb-card dark:bg-qalb-night-card border border-qalb-border dark:border-qalb-night-border shadow-xl space-y-4">
            <h3 className="text-sm font-serif font-bold text-qalb-ink dark:text-qalb-night-ink pb-2 border-b border-qalb-border dark:border-qalb-night-border">
              Adhan Notifications
            </h3>
            <p className="text-xs text-qalb-muted leading-relaxed">
              Timely reminders for the 5 daily prayers (Fajr, Dhuhr, Asr, Maghrib, Isha).
            </p>
            <div className="space-y-2">
              {["Fajr", "Dhuhr", "Asr", "Maghrib", "Isha"].map((prayer) => (
                <div key={prayer} className="flex items-center justify-between py-1.5 px-3 rounded-xl bg-qalb-card-subtle dark:bg-qalb-night-subtle text-xs">
                  <span className="font-medium text-qalb-ink dark:text-qalb-night-ink">{prayer}</span>
                  <span className="text-[10px] font-semibold text-qalb-green dark:text-qalb-gold">Enabled</span>
                </div>
              ))}
            </div>
            <button
              onClick={() => setShowNotifModal(false)}
              className="w-full py-2.5 rounded-xl text-xs font-semibold bg-qalb-green text-white"
            >
              Save Preferences
            </button>
          </div>
        </div>
      )}
    </>
  );
}
