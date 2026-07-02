"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import CounterBead from "./CounterBead";
import { useApp } from "@/context/AppContext";

export default function TodayNameItem({ entry, target, lang, t }) {
  const [open, setOpen] = useState(false);
  const { getCount, increment, resetCount } = useApp();
  const count = getCount(entry.number);
  const pct = target > 0 ? Math.min(count / target, 1) : 0;
  const done = target > 0 && count >= target;
  const tr = entry.translations[lang];

  return (
    <motion.div
      layout
      className="rounded-xl2 bg-parchment text-ink500 shadow-card overflow-hidden"
    >
      <button
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center gap-3 px-4 py-3.5 text-left"
      >
        <div
          className={`w-9 h-9 shrink-0 rounded-full flex items-center justify-center font-mono text-xs ${
            done ? "bg-sage text-ink" : "bg-ink/90 text-gold-soft"
          }`}
        >
          {done ? "✓" : entry.number}
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-baseline gap-2">
            <span className="font-display text-lg">
              {entry.transliteration}
            </span>
            <span className="font-display arabic-text text-ink500/70">
              {entry.arabic}
            </span>
          </div>
          <p className="text-xs text-terracotta font-semibold">{tr.name}</p>
          <div className="mt-1.5 h-1.5 rounded-full bg-ink500/10 overflow-hidden">
            <motion.div
              className={`h-full rounded-full ${done ? "bg-sage" : "bg-terracotta"}`}
              initial={false}
              animate={{ width: `${pct * 100}%` }}
              transition={{ type: "spring", stiffness: 90, damping: 20 }}
            />
          </div>
          <p className="text-[11px] text-ink500/60 mt-1 font-mono">
            {count} / {target} {t.today.times}
          </p>
        </div>
        <motion.span
          animate={{ rotate: open ? 180 : 0 }}
          className="shrink-0 text-ink500/50"
        >
          ▾
        </motion.span>
      </button>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
          >
            <div className="px-4 pb-5 pt-1 flex flex-col items-center border-t border-ink500/10">
              <p className="text-xs text-ink500/60 mt-3 mb-1">{tr.meaning}</p>
              <div className="mt-3">
                <CounterBead
                  count={count}
                  target={target}
                  label={entry.transliteration}
                  onTap={() => increment(entry.number)}
                />
              </div>
              <p className="text-xs text-ink500/50 mt-3">
                {done ? t.today.completed : t.today.tapToCount}
              </p>
              {count > 0 && (
                <button
                  onClick={() => {
                    if (confirm(t.today.resetConfirm)) resetCount(entry.number);
                  }}
                  className="mt-3 text-[11px] text-ink500   rounded-3xl border border-ink500/20 px-3 py-1.5 hover:bg-ink500/5 transition"
                >
                  {t.today.reset}
                </button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
