"use client";

import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

const SIZE = 190;
const STROKE = 8;
const R = (SIZE - STROKE) / 2;
const CIRC = 2 * Math.PI * R;

export default function CounterBead({ count, target, onTap, label }) {
  const [pulses, setPulses] = useState([]);
  const pct = target > 0 ? Math.min(count / target, 1) : 0;
  const done = target > 0 && count >= target;

  const handleTap = useCallback(() => {
    if (done) return;
    const id = Date.now() + Math.random();
    setPulses((p) => [...p, id]);
    setTimeout(() => setPulses((p) => p.filter((x) => x !== id)), 650);
    onTap?.();
  }, [onTap, done]);

  return (
    <div className="relative flex flex-col items-center">
      <div className="relative" style={{ width: SIZE, height: SIZE }}>
        <AnimatePresence>
          {pulses.map((id) => (
            <motion.span
              key={id}
              initial={{ opacity: 0.5, scale: 0.85 }}
              animate={{ opacity: 0, scale: 1.35 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className="absolute inset-0 rounded-full border-2 border-terracotta pointer-events-none"
            />
          ))}
        </AnimatePresence>

        <svg width={SIZE} height={SIZE} className="-rotate-90">
          <circle
            cx={SIZE / 2}
            cy={SIZE / 2}
            r={R}
            fill="none"
            stroke="rgba(243,235,216,0.12)"
            strokeWidth={STROKE}
          />
          <motion.circle
            cx={SIZE / 2}
            cy={SIZE / 2}
            r={R}
            fill="none"
            stroke={done ? "#7FA98A" : "#C9A24B"}
            strokeWidth={STROKE}
            strokeLinecap="round"
            strokeDasharray={CIRC}
            initial={false}
            animate={{ strokeDashoffset: CIRC * (1 - pct) }}
            transition={{ type: "spring", stiffness: 90, damping: 18 }}
          />
        </svg>

        <motion.button
          onClick={handleTap}
          whileTap={{ scale: 0.9 }}
          className="absolute inset-[14px] rounded-full flex flex-col items-center justify-center
                     bg-gradient-to-b from-ink-lighter to-ink-light border border-gold/25 shadow-glow
                     disabled:opacity-90"
          disabled={done}
          aria-label={label}
        >
          <span className="font-mono text-4xl text-parchment tabular-nums">{count}</span>
          <span className="font-mono text-xs text-parchment-dim/60 mt-0.5">/ {target}</span>
        </motion.button>
      </div>
    </div>
  );
}
