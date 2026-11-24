"use client";

import { useEffect, useState } from "react";
import { Sun, Moon } from "lucide-react";
import { useApp } from "@/context/AppContext";

export function ThemeToggle() {
  const { theme, toggleTheme } = useApp();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="w-10 h-10 rounded-full border border-qalb-border dark:border-qalb-night-border" />
    );
  }

  return (
    <button
      onClick={toggleTheme}
      aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
      className="relative flex items-center justify-center w-10 h-10 rounded-full transition-all duration-200 border bg-qalb-card dark:bg-qalb-night-card border-qalb-border dark:border-qalb-night-border text-qalb-ink dark:text-qalb-night-ink hover:border-qalb-gold hover:text-qalb-gold active:scale-95 shadow-sm"
    >
      {theme === "dark" ? (
        <Sun className="w-4 h-4 text-qalb-gold transition-transform duration-200" />
      ) : (
        <Moon className="w-4 h-4 text-qalb-green transition-transform duration-200" />
      )}
    </button>
  );
}
