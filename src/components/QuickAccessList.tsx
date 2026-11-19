"use client";

import Link from "next/link";
import { CircleDot, Sun, Compass, CalendarCheck, BookOpen, ShieldCheck, ChevronRight } from "lucide-react";
import { useApp } from "@/context/AppContext";

export function QuickAccessList() {
  const { qiblaInfo, todayCompletedCount } = useApp();

  const items = [
    {
      title: "Tasbih",
      subtitle: "Continue dhikr",
      href: "/tasbih",
      icon: CircleDot,
      iconBg: "bg-[#E3F2ED] text-[#1D7A5C]",
    },
    {
      title: "Morning Adhkar",
      subtitle: "6 duas left",
      href: "/adhkar",
      icon: Sun,
      iconBg: "bg-[#FEF6E4] text-[#C28C1A]",
    },
    {
      title: "Qibla",
      subtitle: `${qiblaInfo.bearing}° ${qiblaInfo.cardinal}`,
      href: "/qibla",
      icon: Compass,
      iconBg: "bg-[#EBF2FE] text-[#2563EB]",
    },
    {
      title: "Tracker",
      subtitle: `${todayCompletedCount}/5 today`,
      href: "/tracker",
      icon: CalendarCheck,
      iconBg: "bg-[#F3EBF9] text-[#7C3AED]",
    },
    {
      title: "Noble Quran",
      subtitle: "114 Surahs • Vocal recitations",
      href: "/quran",
      icon: BookOpen,
      iconBg: "bg-qalb-green-light text-qalb-green",
    },
  ];

  return (
    <section className="space-y-3">
      {/* Header */}
      <h2 className="text-base font-serif font-bold text-qalb-ink dark:text-qalb-night-ink px-0.5">
        Quick Access
      </h2>

      {/* Adjusted Quick Access Rectangles */}
      <div className="space-y-2.5">
        {items.map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.title}
              href={item.href}
              className="group flex items-center justify-between p-3.5 sm:p-4 rounded-2xl transition-all duration-200 border bg-qalb-card dark:bg-qalb-night-card border-qalb-border dark:border-qalb-night-border hover:border-qalb-gold/60 shadow-qalb-card active:scale-99"
            >
              <div className="flex items-center gap-3.5">
                <div
                  className={`flex items-center justify-center w-10 h-10 rounded-2xl ${item.iconBg} shrink-0 transition-transform group-hover:scale-105`}
                >
                  <Icon className="w-5 h-5 stroke-[2.2]" />
                </div>
                <div>
                  <h3 className="text-xs sm:text-sm font-serif font-bold text-qalb-ink dark:text-qalb-night-ink group-hover:text-qalb-green dark:group-hover:text-qalb-gold transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-[11px] text-qalb-muted font-sans">
                    {item.subtitle}
                  </p>
                </div>
              </div>

              <ChevronRight className="w-4 h-4 text-qalb-muted group-hover:text-qalb-gold group-hover:translate-x-0.5 transition-all" />
            </Link>
          );
        })}

        {/* Private & Ad-Free Banner Card */}
        <div className="flex items-start gap-3 p-4 rounded-2xl border bg-qalb-card dark:bg-qalb-night-card border-qalb-border dark:border-qalb-night-border shadow-qalb-card">
          <div className="flex items-center justify-center w-8 h-8 rounded-full bg-[#EAF7EE] text-[#1E824C] shrink-0 mt-0.5">
            <ShieldCheck className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-xs font-semibold text-qalb-ink dark:text-qalb-night-ink">
              Private &amp; Ad-Free • Offline Ready
            </h4>
            <p className="text-[11px] text-qalb-muted leading-relaxed mt-0.5">
              No tracking. No ads. Your ibadah stays between you and Allah.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
