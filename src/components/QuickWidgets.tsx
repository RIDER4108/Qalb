"use client";

import Link from "next/link";
import { BookOpen, Sparkles, ArrowRight, Compass } from "lucide-react";

export function QuickWidgets() {
  return (
    <section className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-1">
      {/* Continue Reading Card */}
      <Link
        href="/quran/1"
        className="group relative flex items-center justify-between p-4 rounded-2xl transition-all duration-200 border bg-sacred-parchment-card dark:bg-sacred-night-card border-sacred-parchment-border dark:border-sacred-night-border hover:border-sacred-gold shadow-sm active:scale-98"
      >
        <div className="flex items-center gap-3.5">
          <div className="flex items-center justify-center w-11 h-11 rounded-2xl bg-sacred-emerald-light dark:bg-sacred-emerald-dark text-sacred-emerald dark:text-sacred-gold transition-colors">
            <BookOpen className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[11px] font-semibold uppercase tracking-wider text-sacred-gold">
              Continue Reading
            </span>
            <h3 className="text-sm font-bold text-sacred-ink-primary dark:text-sacred-night-primary group-hover:text-sacred-emerald dark:group-hover:text-sacred-gold transition-colors">
              Al-Fatihah • الفاتحة
            </h3>
            <p className="text-xs text-sacred-ink-secondary dark:text-sacred-night-secondary">
              Chapter 1 • 7 Verses
            </p>
          </div>
        </div>

        <div className="flex items-center justify-center w-8 h-8 rounded-full border border-sacred-parchment-border dark:border-sacred-night-border text-sacred-ink-muted dark:text-sacred-night-muted group-hover:border-sacred-gold group-hover:text-sacred-gold group-hover:translate-x-0.5 transition-all">
          <ArrowRight className="w-4 h-4" />
        </div>
      </Link>

      {/* Explore All Surahs Card */}
      <Link
        href="/quran"
        className="group relative flex items-center justify-between p-4 rounded-2xl transition-all duration-200 border bg-sacred-parchment-card dark:bg-sacred-night-card border-sacred-parchment-border dark:border-sacred-night-border hover:border-sacred-gold shadow-sm active:scale-98"
      >
        <div className="flex items-center gap-3.5">
          <div className="flex items-center justify-center w-11 h-11 rounded-2xl bg-sacred-gold-subtle dark:bg-[#221B0E] text-sacred-gold transition-colors">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[11px] font-semibold uppercase tracking-wider text-sacred-emerald dark:text-sacred-gold">
              The Noble Quran
            </span>
            <h3 className="text-sm font-bold text-sacred-ink-primary dark:text-sacred-night-primary group-hover:text-sacred-emerald dark:group-hover:text-sacred-gold transition-colors">
              Browse 114 Surahs
            </h3>
            <p className="text-xs text-sacred-ink-secondary dark:text-sacred-night-secondary">
              Verified Uthmani Script & Audio
            </p>
          </div>
        </div>

        <div className="flex items-center justify-center w-8 h-8 rounded-full border border-sacred-parchment-border dark:border-sacred-night-border text-sacred-ink-muted dark:text-sacred-night-muted group-hover:border-sacred-gold group-hover:text-sacred-gold group-hover:translate-x-0.5 transition-all">
          <ArrowRight className="w-4 h-4" />
        </div>
      </Link>
    </section>
  );
}
