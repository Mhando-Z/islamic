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
    if (!audioRef.current)
      audioRef.current = new Audio(
        `https://www.islamicity.org/mediaassets/MP3/other/covers/99-names-of-Allah/00${entry.number}.mp3?v06092021`,
      );
    audioRef.current.currentTime = 0;
    setAudioState("playing");
    audioRef.current.play().catch(() => setAudioState("unavailable"));
    audioRef.current.onended = () => setAudioState("idle");
    audioRef.current.onerror = () => setAudioState("unavailable");
  };

  return (
    <motion.div
      layout
      className="overflow-hidden rounded-xl2 bg-parchment text-ink500 shadow-card"
    >
      <button
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center gap-3.5 px-4 py-3.5 text-left"
      >
        <div className="flex items-center justify-center font-mono text-xs rounded-full w-9 h-9 shrink-0 bg-ink/90 text-gold-soft">
          {entry.number}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-baseline gap-2">
            <span className="text-lg font-display">
              {entry.transliteration}
            </span>
            <span className="font-display arabic-text text-ink500/70">
              {entry.arabic}
            </span>
          </div>
          <p className="text-xs font-semibold text-terracotta">{tr.name}</p>
        </div>
        <motion.span
          animate={{ rotate: open ? 180 : 0 }}
          className="shrink-0 text-ink500/40"
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
            transition={{ duration: 0.22 }}
          >
            <div className="px-4 pt-1 pb-4 border-t border-ink500/10">
              <p className="text-[11px] uppercase tracking-wide text-ink500/40 mt-3 mb-1">
                {t.study.meaningLabel}
              </p>
              <p className="text-sm leading-relaxed text-ink500/80">
                {tr.meaning}
              </p>
              <button
                onClick={playAudio}
                className="mt-3 inline-flex items-center gap-2 text-sm text-ink bg-gold-soft/50 px-3 py-1.5 rounded-full"
              >
                <span>▶</span>
                {t.study.playAudio}
              </button>
              {audioState === "unavailable" && (
                <p className="text-[11px] text-ink500/40 mt-2">
                  {lang === "sw"
                    ? "Sauti haipatikani bado."
                    : "Audio not available yet."}
                </p>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
