"use client";

import { useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const formatTime = (s) => {
  if (!s || !isFinite(s)) return "0:00";
  const m = Math.floor(s / 60);
  const sec = Math.floor(s % 60)
    .toString()
    .padStart(2, "0");
  return `${m}:${sec}`;
};

export default function StudyNameRow({ entry, lang, t }) {
  const [open, setOpen] = useState(false);
  const [audioState, setAudioState] = useState("idle"); // idle | playing | unavailable
  const [progress, setProgress] = useState(0); // 0 -> 1
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const audioRef = useRef(null);
  const tr = entry.translations[lang];

  const playAudio = (e) => {
    e.stopPropagation();
    if (!audioRef.current)
      audioRef.current = new Audio(
        `https://www.islamicity.org/mediaassets/MP3/other/covers/99-names-of-Allah/${entry?.number >= 10 ? "0" : "00"}${entry.number}.mp3?v06092021`,
      );
    audioRef.current.currentTime = 0;
    setProgress(0);
    setCurrentTime(0);
    setAudioState("playing");
    audioRef.current.play().catch(() => setAudioState("unavailable"));

    audioRef.current.ontimeupdate = () => {
      setCurrentTime(audioRef.current.currentTime);
      if (audioRef.current.duration) {
        setDuration(audioRef.current.duration);
        setProgress(audioRef.current.currentTime / audioRef.current.duration);
      }
    };
    audioRef.current.onended = () => {
      setAudioState("idle");
      setProgress(0);
      setCurrentTime(0);
    };
    audioRef.current.onerror = () => {
      setAudioState("unavailable");
      setProgress(0);
    };
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
                {audioState === "playing" ? (
                  <span className="flex items-end gap-[2px] h-3.5 w-3.5">
                    {[0, 1, 2].map((i) => (
                      <motion.span
                        key={i}
                        className="w-[3px] bg-ink rounded-full"
                        animate={{ height: ["30%", "100%", "30%"] }}
                        transition={{
                          duration: 0.6,
                          repeat: Infinity,
                          ease: "easeInOut",
                          delay: i * 0.15,
                        }}
                      />
                    ))}
                  </span>
                ) : (
                  <span>▶</span>
                )}
                {t.study.playAudio}
              </button>

              <AnimatePresence>
                {audioState === "playing" && (
                  <motion.div
                    initial={{ opacity: 0, y: -4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -4 }}
                    transition={{ duration: 0.18 }}
                    className="mt-3 flex items-center gap-2.5"
                  >
                    <div className="relative h-1.5 flex-1 rounded-full bg-ink500/10 overflow-hidden">
                      <motion.div
                        className="absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-terracotta via-gold-soft to-terracotta bg-[length:200%_100%]"
                        style={{ width: `${Math.min(progress * 100, 100)}%` }}
                        animate={{ backgroundPosition: ["0% 0%", "200% 0%"] }}
                        transition={{
                          duration: 1.6,
                          repeat: Infinity,
                          ease: "linear",
                        }}
                      />
                      <motion.div
                        className="absolute inset-y-0 w-2 rounded-full bg-gold-soft/60 blur-[3px]"
                        style={{ left: `${Math.min(progress * 100, 100)}%` }}
                      />
                    </div>
                    <span className="text-[10px] font-mono text-ink500/40 tabular-nums shrink-0">
                      {formatTime(currentTime)} / {formatTime(duration)}
                    </span>
                  </motion.div>
                )}
              </AnimatePresence>

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
