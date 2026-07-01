"use client";

import { useMemo, useState, useContext } from "react";
import { useApp } from "@/context/AppContext";
import { namesData, TOTAL_NAMES } from "@/data/names";
import PageHeader from "@/components/PageHeader";
import StudyNameRow from "@/components/StudyNameRow";

export default function StudyPage() {
  const { t, lang, hydrated } = useApp();
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return namesData;
    return namesData.filter((n, index) => {
      const tr = n.translations[lang];
      return (
        n.transliteration.toLowerCase().includes(q) ||
        tr.name.toLowerCase().includes(q) ||
        tr.meaning.toLowerCase().includes(q) ||
        String(n.number) === q
      );
    });
  }, [query, lang]);

  if (!hydrated) return null;

  return (
    <div>
      <PageHeader
        eyebrow={`${TOTAL_NAMES} ${lang === "sw" ? "majina" : "names"}`}
        title={t.study.heading}
        subheading={t.study.subheading}
      />

      <div className="px-5">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={t.study.searchPlaceholder}
          className="w-full rounded-full bg-ink-light/70 border border-gold/20 px-4 py-2.5 text-sm text-parchment placeholder:text-parchment-dim/40 focus:outline-none focus:border-gold/50 mb-4"
        />

        {filtered.length === 0 ? (
          <p className="py-6 text-sm text-center text-parchment-dim/60">
            {t.study.noResults}
          </p>
        ) : (
          <div className="flex flex-col gap-2.5 pb-2">
            {filtered.map((entry) => (
              <StudyNameRow
                key={entry.number}
                entry={entry}
                lang={lang}
                t={t}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
