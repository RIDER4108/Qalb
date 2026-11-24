"use client";

import { useState } from "react";
import { Heart } from "lucide-react";
import { DuasModal } from "./DuasModal";
import { useApp } from "@/context/AppContext";

export function FloatingDuasButton() {
  const [isOpen, setIsOpen] = useState(false);
  const { isAudioActive } = useApp();

  return (
    <>
      <div
        className={`fixed right-4 z-40 transition-all duration-300 ${
          isAudioActive
            ? "bottom-20 opacity-0 pointer-events-none translate-y-3 scale-90"
            : "bottom-20 opacity-100 pointer-events-auto translate-y-0 scale-100"
        }`}
      >
        <button
          onClick={() => setIsOpen(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-full shadow-lg transition-all duration-200 bg-qalb-gold hover:bg-qalb-gold-hover text-white font-medium text-xs active:scale-95 border border-white/20"
          aria-label="Open Essential Duas"
        >
          <Heart className="w-3.5 h-3.5 fill-current" />
          <span>Duas</span>
        </button>
      </div>

      <DuasModal isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </>
  );
}
