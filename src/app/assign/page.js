"use client";

import { useMemo, useState } from "react";
import { useApp, todayDayCode } from "@/context/AppContext";
import { DAYS } from "@/data/dictionary";
import { namesData } from "@/data/names";
import PageHeader from "@/components/PageHeader";
import NameCard from "@/components/NameCard";
import AddNameRow from "@/components/AddNameRow";

export default function AssignPage() {
  const { t, lang, assignments, assignName, unassignName, hydrated } = useApp();
  const [selectedDay, setSelectedDay] = useState(todayDayCode());
  const [query, setQuery] = useState("");

  const dayList = assignments[selectedDay] || [];
  const assignedNumbers = new Set(dayList.map((x) => x.nameNumber));

  const assignedEntries = useMemo(
    () =>
      dayList
        .map((a) => ({
          a,
          entry: namesData.find((n) => n.number === a.nameNumber),
        }))
        .filter((x) => x.entry),
    [dayList],
  );

  const filteredAvailable = useMemo(() => {
    const q = query.trim().toLowerCase();
    return namesData.filter((n) => {
      if (assignedNumbers.has(n.number)) return false;
      if (!q) return true;
      const tr = n.translations[lang];
      return (
        n.transliteration.toLowerCase().includes(q) ||
        tr.name.toLowerCase().includes(q) ||
        tr.meaning.toLowerCase().includes(q) ||
        String(n.number) === q
      );
    });
  }, [query, assignedNumbers, lang]);

  if (!hydrated) return null;

  return (
    <div>
      <PageHeader
        eyebrow={t.appName}
        title={t.assign.heading}
        subheading={t.assign.subheading}
      />

      <div className="px-5">
        <div className="flex gap-2 overflow-x-auto pb-1 -mx-1 px-1 no-scrollbar">
          {DAYS.map((d) => (
            <button
              key={d}
              onClick={() => setSelectedDay(d)}
              className={`shrink-0 px-3.5 py-2 rounded-full text-sm font-medium border transition-colors ${
                selectedDay === d
                  ? "bg-gold text-ink border-gold"
                  : "border-gold/25 text-parchment-dim/70"
              }`}
            >
              {t.daysShort[d]}
            </button>
          ))}
        </div>
      </div>

      <div className="px-5 mt-5">
        <h2 className="text-sm uppercase tracking-wide text-gold/70 mb-2">
          {t.days[selectedDay]}
        </h2>
        <div className="flex flex-col gap-2.5">
          {assignedEntries.length === 0 && (
            <p className="text-parchment-dim/60 text-sm py-2">
              {t.assign.noneYet}
            </p>
          )}
          {assignedEntries.map(({ a, entry }) => (
            <NameCard
              key={entry.number}
              entry={entry}
              lang={lang}
              number={entry.number}
              right={
                <div className="flex flex-col items-end gap-1.5">
                  <span className="font-mono text-xs text-terracotta bg-terracotta/10 px-2 py-0.5 rounded-full">
                    {a.target}
                  </span>
                  <button
                    onClick={() => unassignName(selectedDay, entry.number)}
                    className="text-[11px] cursor-pointer text-ink500 underline underline-offset-2"
                  >
                    {t.assign.removeButton}
                  </button>
                </div>
              }
            />
          ))}
        </div>
      </div>

      <div className="px-5 mt-7">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={t.assign.searchPlaceholder}
          className="w-full rounded-full bg-ink-light/70 border border-gold/20 px-4 py-2.5 text-sm text-parchment placeholder:text-parchment-dim/40 focus:outline-none focus:border-gold/50 mb-3"
        />
        <div className="flex flex-col gap-2.5">
          {filteredAvailable.map((entry) => (
            <AddNameRow
              key={entry.number}
              entry={entry}
              lang={lang}
              t={t}
              onAdd={(num, target) => assignName(selectedDay, num, target)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
