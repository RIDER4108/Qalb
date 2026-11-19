"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, CircleDot, BookOpen, Compass, CalendarCheck } from "lucide-react";

export function BottomNav() {
  const pathname = usePathname();

  const tabs = [
    { name: "Home", href: "/", icon: Home, isActive: pathname === "/" },
    { name: "Tasbih", href: "/tasbih", icon: CircleDot, isActive: pathname === "/tasbih" },
    { name: "Adhkar", href: "/adhkar", icon: BookOpen, isActive: pathname === "/adhkar" },
    { name: "Qibla", href: "/qibla", icon: Compass, isActive: pathname === "/qibla" },
    { name: "Tracker", href: "/tracker", icon: CalendarCheck, isActive: pathname === "/tracker" },
  ];

  return (
    <nav className="fixed bottom-0 inset-x-0 z-40 bg-qalb-card/95 dark:bg-qalb-night-card/95 border-t border-qalb-border dark:border-qalb-night-border backdrop-blur-lg">
      <div className="mx-auto max-w-lg flex items-center justify-around py-2 px-2 safe-bottom">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <Link
              key={tab.name}
              href={tab.href}
              className={`flex flex-col items-center justify-center py-1 px-3 rounded-2xl transition-all duration-150 ${
                tab.isActive
                  ? "text-qalb-green dark:text-qalb-gold font-semibold"
                  : "text-qalb-muted hover:text-qalb-ink dark:hover:text-white"
              }`}
            >
              <div className="relative">
                <Icon className="w-5 h-5 transition-transform" />
                {tab.isActive && (
                  <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-qalb-green dark:bg-qalb-gold" />
                )}
              </div>
              <span className="text-[10px] mt-1 tracking-tight font-sans">
                {tab.name}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
