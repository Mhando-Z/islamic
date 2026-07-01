"use client";

import { useApp } from "@/context/AppContext";

export default function LanguageToggle() {
  const { lang, setLang } = useApp();

  return (
    <div className="inline-flex items-center rounded-full bg-ink-light/70 border border-gold/25 p-1 text-xs font-body">
      {["en", "sw"].map((code) => (
        <button
          key={code}
          onClick={() => setLang(code)}
          className={`px-2.5 py-1 rounded-full transition-colors ${
            lang === code
              ? "bg-gold text-ink font-semibold"
              : "text-parchment-dim/70 hover:text-parchment"
          }`}
          aria-pressed={lang === code}
        >
          {code.toUpperCase()}
        </button>
      ))}
    </div>
  );
}
