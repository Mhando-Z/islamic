# 99 Names of Allah tracker

A mobile-first Next.js web app for reciting, tracking, and studying the 99
Beautiful Names of Allah (Asma-ul-Husna), bilingual in English and Swahili.
It works fully offline once loaded — see [Offline support](#offline-support)
below.

## What the app does

- **Today** — shows only the names assigned to today's weekday. Each one is a
  tap-to-count "tasbih bead": a gold ring fills in as you tap, with a soft
  pulse animation on every tap, tracking your recitations against a target
  you set. The count resets automatically the next day.
- **Plan** — pick any day of the week, search all 99 names, and assign a
  recitation target to that day (33 / 99 / 100 / 300 / 1000, or a custom
  number). Assignments repeat every week on that weekday.
- **Study** — browse and search all 99 names with Arabic script,
  transliteration, translation, meaning, and a Play button for audio
  recitation.
- **Language toggle** — switch the whole interface and every name's
  translation between English (EN) and Swahili (SW) instantly, at any time.
- **Works online and offline** — once you've opened the app one time with a
  connection, it keeps working with no internet at all: you can still see
  your plan, tap through recitations, and study the names.

## Offline support

This app is installable and fully usable without an internet connection,
using only browser-native APIs — **no extra packages were installed** to make
this work:

- **IndexedDB** (`lib/idb.js`) stores your language choice, weekly
  assignments, and recitation counts directly in the browser. This replaces
  `localStorage` so data survives reliably and scales better as your history
  grows. All reads/writes go through a small hand-written promise wrapper
  around the native `indexedDB` API — nothing external.
- **A service worker** (`public/sw.js`), written by hand with the native
  Service Worker + Cache Storage APIs, caches the app shell (Today, Plan,
  Study, and the app's static assets) the first time you visit. On later
  visits — even with no network at all — the service worker serves those
  pages straight from the cache and refreshes them in the background whenever
  a connection is available.
- **A web app manifest** (`public/manifest.webmanifest`) lets you install
  Husna to your home screen/app drawer like a native app.

Together: open the app once online, and from then on your plan, your
recitation counts, and the names themselves are all available offline —
nothing to configure.

## Getting started

```bash
npm install
npm run dev
```

Then open http://localhost:3000. On first load, `next/font` fetches Amiri,
Work Sans, and JetBrains Mono from Google Fonts — any normal internet
connection is enough for that one-time fetch.

To build for production:

```bash
npm run build
npm run start
```

## Adding audio

`data/names.js` points each name at `/audio/asma-ul-husna/<slug>.mp3` (e.g.
`/audio/asma-ul-husna/ar-rahman.mp3`). Drop matching mp3 files into
`public/audio/asma-ul-husna/` and the Study page's Play button will work
immediately — no code changes needed. Until files are added, tapping Play
shows a graceful "audio not available yet" message instead of failing.

## A note on accuracy

The Arabic script, transliteration, and name order in `data/names.js` were
cross-checked against a published reference list. The short English and
Swahili meanings are original paraphrases written for this app, meant for
everyday study rather than a scholarly translation — please have a
knowledgeable teacher or trusted source review the wording (especially the
Swahili) before using this for formal teaching. `data/names.js` is a plain
array, so corrections are easy to make directly in that file.

## Project structure

```
app/            Next.js App Router pages (Today, Plan, Study)
components/     UI components (counter, cards, nav, header, service worker registration)
context/        AppContext — language, assignments, counts (IndexedDB-backed)
lib/idb.js      Zero-dependency IndexedDB key-value helper
public/sw.js    Hand-written offline service worker
data/           names.js (99 names) and dictionary.js (UI copy, EN/SW)
scripts/        one-time generator used to build data/names.js
```
