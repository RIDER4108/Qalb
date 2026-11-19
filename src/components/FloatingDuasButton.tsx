"use client";

import { useState } from "react";
import { Heart } from "lucide-react";
import { DuasModal } from "./DuasModal";

export function FloatingDuasButton() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <div className="fixed bottom-20 right-4 z-40 pointer-events-auto">
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
