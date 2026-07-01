"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const PRESETS = [33, 99, 100, 300, 1000];

export default function AddNameRow({ entry, lang, t, onAdd }) {
  const [open, setOpen] = useState(false);
  const [target, setTarget] = useState(99);
  const [custom, setCustom] = useState("");
  const tr = entry.translations[lang];

  const confirm = () => {
    const val = custom ? parseInt(custom, 10) : target;
    if (!val || val <= 0) return;
    onAdd(entry.number, val);
    setOpen(false);
    setCustom("");
  };

  return (
    <motion.div layout className="rounded-xl2 bg-parchment text-ink500 shadow-card overflow-hidden">
      <button
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center gap-3.5 px-4 py-3.5 text-left"
      >
        <div className="w-9 h-9 shrink-0 rounded-full bg-ink/90 text-gold-soft font-mono text-xs flex items-center justify-center">
          {entry.number}
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-baseline gap-2 flex-wrap">
            <span className="font-display text-lg">{entry.transliteration}</span>
            <span className="font-display arabic-text text-ink500/70">{entry.arabic}</span>
          </div>
          <p className="text-xs text-terracotta font-semibold">{tr.name}</p>
        </div>
        <span className="shrink-0 text-xl text-gold-deep leading-none">{open ? "–" : "+"}</span>
      </button>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.22 }}
          >
            <div className="px-4 pb-4 pt-1 border-t border-ink500/10">
              <p className="text-xs text-ink500/60 mt-2 mb-2">{t.assign.targetLabel}</p>
              <div className="flex flex-wrap gap-2">
                {PRESETS.map((p) => (
                  <button
                    key={p}
                    onClick={() => {
                      setTarget(p);
                      setCustom("");
                    }}
                    className={`px-3 py-1.5 rounded-full text-sm font-mono border ${
                      !custom && target === p
                        ? "bg-terracotta text-parchment border-terracotta"
                        : "border-ink500/20 text-ink500/70"
                    }`}
                  >
                    {p}
                  </button>
                ))}
                <input
                  type="number"
                  min="1"
                  placeholder={t.assign.customTarget}
                  value={custom}
                  onChange={(e) => setCustom(e.target.value)}
                  className="w-20 px-2.5 py-1.5 rounded-full text-sm font-mono border border-ink500/20 bg-transparent focus:outline-none focus:border-terracotta"
                />
              </div>
              <button
                onClick={confirm}
                className="mt-3 w-full rounded-full bg-ink text-parchment py-2 text-sm font-semibold"
              >
                {t.assign.addButton}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
