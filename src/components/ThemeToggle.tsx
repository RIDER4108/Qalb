"use client";

import { useEffect, useState } from "react";
import { Sun, Moon } from "lucide-react";

export function ThemeToggle() {
  const [theme, setTheme] = useState<"light" | "dark">("dark");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const stored = localStorage.getItem("nur-theme");
    if (stored === "light" || stored === "dark") {
      setTheme(stored);
      document.documentElement.classList.toggle("dark", stored === "dark");
    } else {
      // Default to dark mode for evening/night or system preference
      const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
      const initial = prefersDark ? "dark" : "light";
      setTheme(initial);
      document.documentElement.classList.toggle("dark", initial === "dark");
    }
  }, []);

  const toggleTheme = () => {
    const next = theme === "dark" ? "light" : "dark";
    setTheme(next);
    localStorage.setItem("nur-theme", next);
    document.documentElement.classList.toggle("dark", next === "dark");
  };

  if (!mounted) {
    return <div className="w-10 h-10 rounded-full border border-sacred-parchment-border dark:border-sacred-night-border" />;
  }

  return (
    <button
      onClick={toggleTheme}
      aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
      className="relative flex items-center justify-center w-10 h-10 rounded-full transition-all duration-200 border bg-sacred-parchment-card dark:bg-sacred-night-card border-sacred-parchment-border dark:border-sacred-night-border text-sacred-ink-primary dark:text-sacred-night-primary hover:border-sacred-gold hover:text-sacred-gold active:scale-95 shadow-sm"
    >
      {theme === "dark" ? (
        <Sun className="w-4 h-4 text-sacred-gold transition-transform duration-200" />
      ) : (
        <Moon className="w-4 h-4 text-sacred-emerald transition-transform duration-200" />
      )}
    </button>
  );
}
