"use client";

import { useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function StudyNameRow({ entry, lang, t }) {
  const [open, setOpen] = useState(false);
  const [audioState, setAudioState] = useState("idle"); // idle | playing | unavailable
  const audioRef = useRef(null);
  const tr = entry.translations[lang];

  const playAudio = (e) => {
    e.stopPropagation();
    if (!audioRef.current) audioRef.current = new Audio(entry.audio);
    audioRef.current.currentTime = 0;
    setAudioState("playing");
    audioRef.current
      .play()
      .catch(() => setAudioState("unavailable"));
    audioRef.current.onended = () => setAudioState("idle");
    audioRef.current.onerror = () => setAudioState("unavailable");
  };

  return (
    <motion.div layout className="rounded-xl2 bg-parchment text-ink500 shadow-card overflow-hidden">
      <button onClick={() => setOpen((o) => !o)} className="w-full flex items-center gap-3.5 px-4 py-3.5 text-left">
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
        <motion.span animate={{ rotate: open ? 180 : 0 }} className="shrink-0 text-ink500/40">
          ▾
        </motion.span>
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
              <p className="text-[11px] uppercase tracking-wide text-ink500/40 mt-3 mb-1">
                {t.study.meaningLabel}
              </p>
              <p className="text-sm text-ink500/80 leading-relaxed">{tr.meaning}</p>
              <button
                onClick={playAudio}
                className="mt-3 inline-flex items-center gap-2 text-sm text-ink bg-gold-soft/50 px-3 py-1.5 rounded-full"
              >
                <span>▶</span>
                {t.study.playAudio}
              </button>
              {audioState === "unavailable" && (
                <p className="text-[11px] text-ink500/40 mt-2">
                  {lang === "sw" ? "Sauti haipatikani bado." : "Audio not available yet."}
                </p>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
