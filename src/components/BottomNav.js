"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { useApp } from "@/context/AppContext";

const TABS = [
  {
    href: "/",
    key: "today",
    icon: (active) => (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
        <circle
          cx="12"
          cy="12"
          r="8"
          stroke="currentColor"
          strokeWidth="1.6"
          fill={active ? "currentColor" : "none"}
          fillOpacity={active ? 0.15 : 0}
        />
        <circle cx="12" cy="12" r="2.4" fill="currentColor" />
      </svg>
    ),
  },
  {
    href: "/assign",
    key: "assign",
    icon: (active) => (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
        <rect
          x="4"
          y="4.5"
          width="16"
          height="15"
          rx="2.4"
          stroke="currentColor"
          strokeWidth="1.6"
          fill={active ? "currentColor" : "none"}
          fillOpacity={active ? 0.12 : 0}
        />
        <path
          d="M8 3.5v3M16 3.5v3M7 10h10M7 13.5h6"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
        />
      </svg>
    ),
  },
  {
    href: "/study",
    key: "study",
    icon: (active) => (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
        <path
          d="M4 5.5c2-1 5-1 8 .5 3-1.5 6-1.5 8-.5v13c-2-1-5-1-8 .5-3-1.5-6-1.5-8-.5v-13Z"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinejoin="round"
          fill={active ? "currentColor" : "none"}
          fillOpacity={active ? 0.1 : 0}
        />
        <path d="M12 6v13" stroke="currentColor" strokeWidth="1.6" />
      </svg>
    ),
  },
];

export default function BottomNav() {
  const pathname = usePathname();
  const { t } = useApp();

  return (
    <nav className="fixed bottom-[-13] left-0 right-0 z-40 flex justify-center pointer-events-none">
      <div className="pointer-events-auto mx-auto max-w-md w-full px-4 pb-[max(0.9rem,env(safe-area-inset-bottom))] pt-2">
        <div className="flex items-stretch justify-between rounded-2xl border border-gold/20 bg-ink-light/90 backdrop-blur-md shadow-card px-2 py-1.5">
          {TABS.map((tab) => {
            const active = pathname === tab.href;
            return (
              <Link
                key={tab.key}
                href={tab.href}
                className="relative flex-1 flex flex-col items-center gap-1 py-1.5 rounded-xl text-parchment-dim/60 data-[active=true]:text-gold"
                data-active={active}
              >
                {active && (
                  <motion.div
                    layoutId="nav-pill"
                    className="absolute inset-0 rounded-xl bg-gold/10"
                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                  />
                )}
                <span className="relative">{tab.icon(active)}</span>
                <span className="relative text-[11px] font-medium">
                  {t.nav[tab.key]}
                </span>
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
