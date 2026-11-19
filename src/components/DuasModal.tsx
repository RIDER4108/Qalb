"use client";

import { useState } from "react";
import { X, Search, Heart, Copy, Check } from "lucide-react";
import { DUAS_COLLECTION, DuaItem } from "@/data/duas";

interface DuasModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function DuasModal({ isOpen, onClose }: DuasModalProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [search, setSearch] = useState("");
  const [copiedId, setCopiedId] = useState<string | null>(null);

  if (!isOpen) return null;

  const categories = [
    { id: "all", label: "All" },
    { id: "daily", label: "Daily" },
    { id: "forgiveness", label: "Forgiveness" },
    { id: "anxiety", label: "Anxiety & Relief" },
    { id: "guidance", label: "Guidance" },
    { id: "family", label: "Family & Parents" },
  ];

  const filtered = DUAS_COLLECTION.filter((d) => {
    const matchCat = selectedCategory === "all" || d.category === selectedCategory;
    const matchSearch =
      d.title.toLowerCase().includes(search.toLowerCase()) ||
      d.translation.toLowerCase().includes(search.toLowerCase()) ||
      d.arabic.includes(search);
    return matchCat && matchSearch;
  });

  const handleCopy = (item: DuaItem) => {
    const text = `${item.title}\n\n${item.arabic}\n\n${item.transliteration}\n\n"${item.translation}"\n\n[${item.reference}]`;
    navigator.clipboard.writeText(text);
    setCopiedId(item.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        className="fixed inset-0"
        onClick={onClose}
      />
      <div className="relative z-10 w-full max-w-lg max-h-[88vh] rounded-t-3xl sm:rounded-3xl flex flex-col bg-qalb-bg dark:bg-qalb-night-bg border border-qalb-border dark:border-qalb-night-border shadow-2xl overflow-hidden animate-in slide-in-from-bottom duration-250">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-qalb-border dark:border-qalb-night-border flex items-center justify-between bg-qalb-card dark:bg-qalb-night-card">
          <div className="flex items-center gap-2">
            <div className="flex items-center justify-center w-8 h-8 rounded-full bg-qalb-gold/15 text-qalb-gold">
              <Heart className="w-4 h-4 fill-current" />
            </div>
            <div>
              <h2 className="text-base font-bold text-qalb-ink dark:text-qalb-night-ink">
                Essential Duas
              </h2>
              <p className="text-[11px] text-qalb-muted font-sans">
                From the Quran &amp; Sahih Sunnah
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-full text-qalb-muted hover:text-qalb-ink dark:hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search & Categories */}
        <div className="p-4 space-y-3 border-b border-qalb-border/60 dark:border-qalb-night-border/60 bg-qalb-bg dark:bg-qalb-night-bg">
          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-qalb-muted" />
            <input
              type="text"
              placeholder="Search Duas by keyword or meaning..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border bg-qalb-card dark:bg-qalb-night-card border-qalb-border dark:border-qalb-night-border text-qalb-ink dark:text-qalb-night-ink placeholder:text-qalb-muted focus:border-qalb-gold outline-none font-sans"
            />
          </div>

          {/* Category Chips */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 custom-scrollbar">
            {categories.map((c) => (
              <button
                key={c.id}
                onClick={() => setSelectedCategory(c.id)}
                className={`px-3 py-1 rounded-full text-[11px] font-medium whitespace-nowrap transition-colors ${
                  selectedCategory === c.id
                    ? "bg-qalb-green text-white dark:bg-qalb-gold dark:text-qalb-night-bg"
                    : "bg-qalb-card dark:bg-qalb-night-card text-qalb-muted border border-qalb-border dark:border-qalb-night-border hover:border-qalb-gold"
                }`}
              >
                {c.label}
              </button>
            ))}
          </div>
        </div>

        {/* Duas List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar">
          {filtered.map((item) => {
            const isCopied = copiedId === item.id;
            return (
              <article
                key={item.id}
                className="p-4 rounded-2xl border bg-qalb-card dark:bg-qalb-night-card border-qalb-border dark:border-qalb-night-border space-y-2.5 shadow-sm"
              >
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-bold text-qalb-green dark:text-qalb-gold font-sans uppercase tracking-wider">
                    {item.title}
                  </h3>
                  <button
                    onClick={() => handleCopy(item)}
                    className="p-1.5 rounded-lg text-qalb-muted hover:text-qalb-gold transition-colors"
                    title="Copy Dua"
                  >
                    {isCopied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>

                {/* Arabic in IndoPak Font */}
                <div className="py-1">
                  <p
                    dir="rtl"
                    lang="ar"
                    className="font-quran text-xl sm:text-2xl text-qalb-ink dark:text-qalb-night-ink leading-[2.3] text-right"
                  >
                    {item.arabic}
                  </p>
                </div>

                {/* Transliteration */}
                <p className="text-xs italic text-qalb-gold font-sans">
                  {item.transliteration}
                </p>

                {/* Translation */}
                <p className="text-xs text-qalb-ink dark:text-qalb-night-ink leading-relaxed font-sans">
                  "{item.translation}"
                </p>

                <div className="pt-1 border-t border-qalb-border/50 dark:border-qalb-night-border/50 text-[10px] text-qalb-muted font-sans">
                  Source: {item.reference}
                </div>
              </article>
            );
          })}

          {filtered.length === 0 && (
            <div className="text-center py-8 text-xs text-qalb-muted font-sans">
              No Duas found matching your search.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
