"use client";

import { motion } from "framer-motion";

export default function NameCard({
  entry,
  lang,
  number,
  right,
  onClick,
  selected = false,
}) {
  const tr = entry.translations[lang];

  return (
    <motion.div
      layout
      onClick={onClick}
      className={`group rounded-xl2 bg-parchment text-ink500 px-4 py-3.5 flex items-center gap-3.5 shadow-card border ${
        selected ? "border-terracotta" : "border-transparent"
      } ${onClick ? "cursor-pointer active:scale-[0.99]" : ""} transition-colors`}
      whileTap={onClick ? { scale: 0.98 } : undefined}
    >
      <div className="w-9 h-9 shrink-0 rounded-full bg-ink/90 text-gold-soft font-mono text-xs flex items-center justify-center">
        {number}
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex items-baseline gap-2 flex-wrap">
          <span className="font-display text-lg text-ink500">{entry.transliteration}</span>
          <span className="font-display text-lg arabic-text text-ink500/70">{entry.arabic}</span>
        </div>
        <p className="text-sm font-semibold text-terracotta mt-0.5">{tr.name}</p>
        <p className="text-xs text-ink500/70 mt-0.5 leading-snug">{tr.meaning}</p>
      </div>

      {right && <div className="shrink-0">{right}</div>}
    </motion.div>
  );
}
