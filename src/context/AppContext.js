"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  useCallback,
} from "react";
import { DAYS, dictionary } from "@/data/dictionary";

const AppCtx = createContext(null);

const LANG_KEY = "husna:lang";
const ASSIGN_KEY = "husna:assignments";
const COUNTS_KEY = "husna:counts";

function emptyAssignments() {
  return DAYS.reduce((acc, d) => ({ ...acc, [d]: [] }), {});
}

function todayISO() {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

// JS Date.getDay(): 0=Sun,1=Mon,...6=Sat -> map to our DAYS (mon..sun)
export function todayDayCode() {
  const jsDay = new Date().getDay();
  const map = ["sun", "mon", "tue", "wed", "thu", "fri", "sat"];
  return map[jsDay];
}

function safeParse(str, fallback) {
  try {
    const v = JSON.parse(str);
    return v ?? fallback;
  } catch {
    return fallback;
  }
}

export function AppProvider({ children }) {
  const [lang, setLang] = useState("en");
  const [assignments, setAssignments] = useState(emptyAssignments());
  const [counts, setCounts] = useState({});
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const l = localStorage.getItem(LANG_KEY);
    const a = localStorage.getItem(ASSIGN_KEY);
    const c = localStorage.getItem(COUNTS_KEY);
    if (l === "en" || l === "sw") setLang(l);
    if (a) setAssignments({ ...emptyAssignments(), ...safeParse(a, {}) });
    if (c) setCounts(safeParse(c, {}));
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (hydrated) localStorage.setItem(LANG_KEY, lang);
  }, [lang, hydrated]);

  useEffect(() => {
    if (hydrated) localStorage.setItem(ASSIGN_KEY, JSON.stringify(assignments));
  }, [assignments, hydrated]);

  useEffect(() => {
    if (hydrated) localStorage.setItem(COUNTS_KEY, JSON.stringify(counts));
  }, [counts, hydrated]);

  const t = useMemo(() => dictionary[lang], [lang]);

  const assignName = useCallback((day, nameNumber, target) => {
    setAssignments((prev) => {
      const list = prev[day] || [];
      if (list.some((x) => x.nameNumber === nameNumber)) return prev;
      return { ...prev, [day]: [...list, { nameNumber, target }] };
    });
  }, []);

  const unassignName = useCallback((day, nameNumber) => {
    setAssignments((prev) => ({
      ...prev,
      [day]: (prev[day] || []).filter((x) => x.nameNumber !== nameNumber),
    }));
  }, []);

  const updateTarget = useCallback((day, nameNumber, target) => {
    setAssignments((prev) => ({
      ...prev,
      [day]: (prev[day] || []).map((x) =>
        x.nameNumber === nameNumber ? { ...x, target } : x,
      ),
    }));
  }, []);

  const countKey = useCallback(
    (nameNumber, dateISO = todayISO()) => `${dateISO}_${nameNumber}`,
    [],
  );

  const getCount = useCallback(
    (nameNumber, dateISO = todayISO()) =>
      counts[countKey(nameNumber, dateISO)] || 0,
    [counts, countKey],
  );

  const increment = useCallback(
    (nameNumber, step = 1) => {
      const key = countKey(nameNumber);
      setCounts((prev) => ({ ...prev, [key]: (prev[key] || 0) + step }));
    },
    [countKey],
  );

  const resetCount = useCallback(
    (nameNumber) => {
      const key = countKey(nameNumber);
      setCounts((prev) => ({ ...prev, [key]: 0 }));
    },
    [countKey],
  );

  const weekStats = useMemo(() => {
    const today = new Date();
    let total = 0;
    const activeDates = new Set();
    for (const key of Object.keys(counts)) {
      const [dateISO] = key.split("_");
      const d = new Date(dateISO + "T00:00:00");
      const diffDays = (today - d) / 86400000;
      if (diffDays >= 0 && diffDays < 7) {
        total += counts[key];
        if (counts[key] > 0) activeDates.add(dateISO);
      }
    }
    return { total, daysActive: activeDates.size };
  }, [counts]);

  const value = {
    lang,
    setLang,
    t,
    assignments,
    assignName,
    unassignName,
    updateTarget,
    getCount,
    increment,
    resetCount,
    weekStats,
    hydrated,
  };

  return <AppCtx.Provider value={value}>{children}</AppCtx.Provider>;
}

export function useApp() {
  const ctx = useContext(AppCtx);
  if (!ctx) throw new Error("useApp must be used within AppProvider");
  return ctx;
}
