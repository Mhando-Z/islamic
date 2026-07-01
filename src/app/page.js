"use client";

import { useMemo } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { useApp, todayDayCode } from "@/context/AppContext";
import { namesData } from "@/data/names";
import TodayNameItem from "@/components/TodayNameItem";
import PageHeader from "@/components/PageHeader";

export default function TodayPage() {
  const { t, lang, assignments, getCount, hydrated } = useApp();
  const dayCode = todayDayCode();
  const dayName = t.days[dayCode];

  const todaysAssignments = assignments[dayCode] || [];

  const entries = useMemo(
    () =>
      todaysAssignments
        .map((a) => ({
          a,
          entry: namesData.find((n) => n.number === a.nameNumber),
        }))
        .filter((x) => x.entry),
    [todaysAssignments],
  );

  const allDone =
    entries.length > 0 &&
    entries.every(({ a, entry }) => getCount(entry.number) >= a.target);

  if (!hydrated) return null;

  return (
    <div>
      <PageHeader
        eyebrow={dayName}
        title={t.today.heading}
        subheading={t.appTagline}
      />

      <div className="px-5 flex flex-col gap-3">
        {entries.length === 0 && (
          <div className="rounded-xl2 border border-dashed border-gold/25 px-5 py-8 text-center">
            <p className="text-parchment-dim/70">{t.today.empty}</p>
            <Link
              href="/assign"
              className="inline-block mt-3 text-sm text-gold underline underline-offset-4"
            >
              {t.today.emptyCta}
            </Link>
          </div>
        )}

        {allDone && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-xl2 bg-sage/15 border border-sage/40 px-4 py-3 text-center text-sage"
          >
            {t.today.allDone}
          </motion.div>
        )}

        {entries.map(({ a, entry }) => (
          <TodayNameItem
            key={entry.number}
            entry={entry}
            target={a.target}
            lang={lang}
            t={t}
          />
        ))}
      </div>

      <WeekStatsStrip />
    </div>
  );
}

function WeekStatsStrip() {
  const { t, weekStats } = useApp();
  return (
    <div className="px-5 mt-8">
      <div className="rounded-xl2 border border-gold/15 px-4 py-3.5 flex items-center justify-between">
        <div>
          <p className="text-[11px] uppercase tracking-wide text-gold/60">
            {t.stats.totalRecited}
          </p>
          <p className="font-mono text-2xl text-parchment mt-0.5">
            {weekStats.total}
          </p>
        </div>
        <div className="text-right">
          <p className="text-[11px] uppercase tracking-wide text-gold/60">
            {t.stats.daysActive}
          </p>
          <p className="font-mono text-2xl text-parchment mt-0.5">
            {weekStats.daysActive}/7
          </p>
        </div>
      </div>
      <p className="text-center text-parchment-dim/40 text-xs mt-6 pb-2">
        {t.footer}
      </p>
    </div>
  );
}
