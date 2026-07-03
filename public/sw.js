const VERSION = "v1";

const STATIC_CACHE = `static-${VERSION}`;
const API_CACHE = `api-${VERSION}`;
const AUDIO_CACHE = `audio-${VERSION}`;

const OFFLINE_URL = "/offline.html";
const SHELL_URL = "/"; // fallback for uncached routes

const APP_SHELL = [
  "/",
  "/assign",
  "/study",
  "/offline.html",
  "/manifest.json",
  "/favicon.ico",
];

self.addEventListener("install", (event) => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(STATIC_CACHE).then((cache) => cache.addAll(APP_SHELL)),
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    (async () => {
      const keys = await caches.keys();
      await Promise.all(
        keys
          .filter(
            (key) => ![STATIC_CACHE, API_CACHE, AUDIO_CACHE].includes(key),
          )
          .map((key) => caches.delete(key)),
      );
      await self.clients.claim();
    })(),
  );
});

self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET") return;

  const url = new URL(event.request.url);

  if (url.protocol !== "http:" && url.protocol !== "https:") return;

  if (
    url.pathname.startsWith("/_next/webpack") ||
    url.pathname.includes("hot-update") ||
    url.pathname.includes("turbopack")
  ) {
    return;
  }

  // Navigation (HTML pages) — Network First, SPA fallback when offline
  if (event.request.mode === "navigate") {
    event.respondWith(navigationHandler(event.request));
    return;
  }

  // Next.js client-side navigations (RSC fetches) also need a fallback,
  // since they don't have mode === "navigate"
  if (
    event.request.headers.get("RSC") === "1" ||
    event.request.headers.get("Next-Router-Prefetch") === "1"
  ) {
    event.respondWith(navigationHandler(event.request));
    return;
  }

  if (
    url.pathname.startsWith("/api") ||
    (event.request.destination === "" &&
      event.request.headers.get("accept")?.includes("application/json"))
  ) {
    event.respondWith(networkFirst(event.request, API_CACHE));
    return;
  }

  if (
    event.request.destination === "audio" ||
    /\.(mp3|wav|ogg|m4a)$/i.test(url.pathname)
  ) {
    event.respondWith(cacheFirst(event.request, AUDIO_CACHE));
    return;
  }

  if (event.request.destination === "image") {
    event.respondWith(cacheFirst(event.request, STATIC_CACHE));
    return;
  }

  if (event.request.destination === "font") {
    event.respondWith(cacheFirst(event.request, STATIC_CACHE));
    return;
  }

  if (
    event.request.destination === "script" ||
    event.request.destination === "style"
  ) {
    event.respondWith(cacheFirst(event.request, STATIC_CACHE));
    return;
  }
});

// ---- Navigation-specific handler ----
// async function navigationHandler(request) {
//   const cache = await caches.open(STATIC_CACHE);

//   try {
//     const response = await fetch(request);
//     if (response.ok) {
//       cache.put(request, response.clone());
//     }
//     return response;
//   } catch {
//     // 1. Try an exact cache match for this route
//     let cached = await cache.match(request);
//     if (cached) return cached;

//     // 2. Try matching while ignoring query params (?_rsc=, ?utm=, etc.)
//     cached = await cache.match(request, { ignoreSearch: true });
//     if (cached) return cached;

//     // 3. Fall back to the cached app shell so the SPA can boot and
//     //    render from IndexedDB, instead of showing a dead-end page
//     const shell = await cache.match(SHELL_URL);
//     if (shell) return shell;

//     // 4. Truly nothing cached (e.g. first-ever load happened offline)
//     return caches.match(OFFLINE_URL);
//   }
// }
async function navigationHandler(request) {
  const cache = await caches.open(STATIC_CACHE);
  const url = new URL(request.url);

  try {
    const response = await fetch(request);
    if (response.ok) cache.put(request, response.clone());
    return response;
  } catch {
    let cached = await cache.match(request);
    if (cached) return cached;

    cached = await cache.match(request, { ignoreSearch: true });
    if (cached) return cached;

    // Fall back to nearest cached section root
    const section = "/" + url.pathname.split("/")[1]; // "/assign" or "/study"
    cached = await cache.match(section);
    if (cached) return cached;

    // Then the app root
    cached = await cache.match("/");
    if (cached) return cached;

    return caches.match(OFFLINE_URL);
  }
}
async function cacheFirst(request, cacheName) {
  const cache = await caches.open(cacheName);
  const cached = await cache.match(request);
  if (cached) return cached;

  try {
    const response = await fetch(request);
    if (response.ok) cache.put(request, response.clone());
    return response;
  } catch {
    if (request.mode === "navigate") return caches.match(OFFLINE_URL);
    return new Response("Offline", { status: 503, statusText: "Offline" });
  }
}

async function networkFirst(request, cacheName = STATIC_CACHE) {
  const cache = await caches.open(cacheName);
  try {
    const response = await fetch(request);
    if (response.ok) cache.put(request, response.clone());
    return response;
  } catch {
    const cached = await cache.match(request);
    if (cached) return cached;
    if (request.mode === "navigate") return caches.match(OFFLINE_URL);
    return new Response("Offline", { status: 503, statusText: "Offline" });
  }
}
