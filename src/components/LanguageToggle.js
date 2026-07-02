"use client";
import { useContext } from "react";
import { useApp } from "@/context/AppContext";
import DataContext from "@/context/DataContext";

export default function LanguageToggle() {
  const { lang, setLang } = useApp();
  const { setLanguage } = useContext(DataContext);

  const handleLanguageChange = (newLang) => {
    setLang(newLang);
    setLanguage(newLang);
  };

  return (
    <div className="inline-flex items-center rounded-full bg-ink-light/70 border border-gold/25 p-1 text-xs font-body">
      {["en", "sw"].map((code) => (
        <button
          key={code}
          onClick={() => handleLanguageChange(code)}
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
