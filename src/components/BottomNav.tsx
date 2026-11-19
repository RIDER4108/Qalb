"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, BookOpen, Compass, Heart } from "lucide-react";

export function BottomNav() {
  const pathname = usePathname();

  const isHome = pathname === "/";
  const isQuran = pathname.startsWith("/quran");

  return (
    <nav className="fixed bottom-4 inset-x-0 z-40 flex justify-center px-4 pointer-events-none">
      <div className="pointer-events-auto flex items-center gap-1 p-1.5 rounded-full border shadow-sacred-float backdrop-blur-xl bg-sacred-parchment-card/90 dark:bg-sacred-night-card/90 border-sacred-parchment-border/80 dark:border-sacred-night-border/80">
        <Link
          href="/"
          className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold transition-all duration-200 ${
            isHome
              ? "bg-sacred-emerald text-white shadow-sm dark:bg-sacred-gold dark:text-sacred-night-bg"
              : "text-sacred-ink-secondary dark:text-sacred-night-secondary hover:text-sacred-ink-primary dark:hover:text-white"
          }`}
        >
          <Home className="w-4 h-4" />
          <span>Home</span>
        </Link>

        <Link
          href="/quran"
          className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold transition-all duration-200 ${
            isQuran
              ? "bg-sacred-emerald text-white shadow-sm dark:bg-sacred-gold dark:text-sacred-night-bg"
              : "text-sacred-ink-secondary dark:text-sacred-night-secondary hover:text-sacred-ink-primary dark:hover:text-white"
          }`}
        >
          <BookOpen className="w-4 h-4" />
          <span>Quran</span>
        </Link>
      </div>
    </nav>
  );
}
