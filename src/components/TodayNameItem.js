"use client";

import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import CounterBead from "./CounterBead";
import { useApp } from "@/context/AppContext";

const formatTime = (s) => {
  if (!s || !isFinite(s)) return "0:00";
  const m = Math.floor(s / 60);
  const sec = Math.floor(s % 60)
    .toString()
    .padStart(2, "0");
  return `${m}:${sec}`;
};

export default function TodayNameItem({ entry, target, lang, t, description }) {
  const [open, setOpen] = useState(false);
  const { getCount, increment, resetCount } = useApp();
  const count = getCount(entry.number);
  const pct = target > 0 ? Math.min(count / target, 1) : 0;
  const done = target > 0 && count >= target;
  const tr = entry.translations[lang];
  const [audioState, setAudioState] = useState("idle"); // idle | playing | unavailable
  const [progress, setProgress] = useState(0); // 0 -> 1
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const audioRef = useRef(null);

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
              <p className="text-sm text-ink500/80 max-w-90 text-center mt-3 mb-1">
                {description || tr.meaning}
              </p>
              <button
                onClick={playAudio}
                className="mt-3 mb-3 inline-flex  items-center gap-2 text-sm text-ink bg-gold-soft/50 px-3 py-1.5 rounded-full"
              >
                {audioState === "playing" ? (
                  <span className="flex items-end gap-0.5 h-3.5 w-3.5">
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

              {audioState === "unavailable" && (
                <p className="text-[11px] text-ink500/40 mt-2">
                  {lang === "sw"
                    ? "Sauti haipatikani bado."
                    : "Audio not available yet."}
                </p>
              )}
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
