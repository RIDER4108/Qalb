"use client";

import { useState, useEffect } from "react";
import { Share, X, PlusSquare } from "lucide-react";

export function IosInstallBanner() {
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;

    // Check if dismissed previously in this session
    const isDismissed = sessionStorage.getItem("qalb-ios-banner-dismissed") === "true";
    if (isDismissed) return;

    // Detect iOS devices (iPhone, iPad, iPod, or iPadOS on MacIntel)
    const ua = window.navigator.userAgent.toLowerCase();
    const isIosDevice =
      /iphone|ipad|ipod/.test(ua) ||
      (window.navigator.platform === "MacIntel" && window.navigator.maxTouchPoints > 1);

    // Detect if already installed / running in standalone PWA mode
    const isStandalone =
      (window.navigator as any).standalone === true ||
      window.matchMedia("(display-mode: standalone)").matches;

    // Show only on iOS browser when NOT installed
    if (isIosDevice && !isStandalone) {
      setShowBanner(true);
    }
  }, []);

  const handleDismiss = () => {
    setShowBanner(false);
    try {
      sessionStorage.setItem("qalb-ios-banner-dismissed", "true");
    } catch (_) {}
  };

  if (!showBanner) return null;

  return (
    <aside
      aria-label="Install Qalb on iPhone"
      className="fixed bottom-20 inset-x-3 z-50 max-w-md mx-auto animate-in slide-in-from-bottom duration-300"
    >
      <div className="relative flex items-start gap-3 p-3.5 rounded-2xl bg-qalb-card/95 dark:bg-qalb-night-card/95 backdrop-blur-md border border-qalb-gold/40 shadow-qalb-float text-qalb-ink dark:text-qalb-night-ink">
        {/* App Icon */}
        <img
          src="/icon-192x192.png"
          alt="Qalb"
          className="w-10 h-10 rounded-xl object-cover shrink-0 border border-qalb-border dark:border-qalb-night-border shadow-xs"
        />

        {/* Content */}
        <div className="flex-1 pr-5">
          <div className="flex items-center gap-1.5">
            <span className="text-xs font-bold text-qalb-green dark:text-qalb-gold">
              Install Qalb App
            </span>
            <span className="text-[9px] font-semibold px-1.5 py-0.5 rounded-full bg-qalb-gold-subtle dark:bg-qalb-night-subtle text-qalb-gold font-sans">
              iOS PWA
            </span>
          </div>

          <p className="text-xs font-medium text-qalb-ink dark:text-qalb-night-ink mt-0.5 leading-snug">
            Install Qalb on iPhone: Tap Share (<span className="font-bold text-qalb-green dark:text-qalb-gold">↑</span>) → <span className="font-bold">Add to Home Screen</span>.
          </p>

          <div className="flex items-center gap-2 mt-1.5 text-[11px] text-qalb-muted font-sans">
            <span className="inline-flex items-center gap-1">
              <Share className="w-3 h-3 text-qalb-gold" /> Tap Share
            </span>
            <span>•</span>
            <span className="inline-flex items-center gap-1">
              <PlusSquare className="w-3 h-3 text-qalb-green dark:text-qalb-gold" /> Add to Home Screen
            </span>
          </div>
        </div>

        {/* Dismiss Button */}
        <button
          onClick={handleDismiss}
          aria-label="Dismiss install banner"
          className="absolute top-2.5 right-2.5 p-1 rounded-full text-qalb-muted hover:text-qalb-ink dark:hover:text-white transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </aside>
  );
}
