// Service Worker for Qalb Islamic PWA
const CACHE_NAME = "qalb-cache-v2";
const STATIC_ASSETS = [
  "/manifest.json",
  "/qalb-logo.png",
  "/icon-192x192.png",
  "/icon-512x512.png",
];

// Immediately activate new Service Worker without waiting for old tabs to close
self.addEventListener("install", (event) => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(STATIC_ASSETS).catch(() => {});
    })
  );
});

// Purge stale caches and immediately take control of all open clients
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(
          keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))
        )
      )
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET") return;
  const url = new URL(event.request.url);

  // Never intercept or cache the Service Worker script itself
  if (url.pathname === "/sw.js") return;

  // 1. HTML Page Navigations & Next.js RSC/Data requests: ALWAYS NetworkFirst
  const isNavigation =
    event.request.mode === "navigate" ||
    (event.request.headers.get("accept") || "").includes("text/html");
  const isNextData =
    url.pathname.startsWith("/_next/data/") ||
    url.searchParams.has("_rsc") ||
    event.request.headers.has("rsc");

  if (isNavigation || isNextData) {
    event.respondWith(
      fetch(event.request)
        .then((response) => {
          if (response && response.status === 200 && response.type === "basic") {
            const clone = response.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(event.request, clone));
          }
          return response;
        })
        .catch(() =>
          caches.match(event.request).then((cached) => cached || caches.match("/"))
        )
    );
    return;
  }

  // 2. External Islamic APIs: NetworkFirst with cache fallback
  if (
    url.hostname.includes("aladhan.com") ||
    url.hostname.includes("quran.com") ||
    url.hostname.includes("alquran.cloud")
  ) {
    event.respondWith(
      fetch(event.request)
        .then((response) => {
          if (response && response.status === 200) {
            const clone = response.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(event.request, clone));
          }
          return response;
        })
        .catch(() => caches.match(event.request))
    );
    return;
  }

  // 3. Content-hashed Next.js static bundles: CacheFirst (safe because filenames are hashed per build)
  if (url.origin === self.location.origin && url.pathname.startsWith("/_next/static/")) {
    event.respondWith(
      caches.match(event.request).then((cachedResponse) => {
        if (cachedResponse) return cachedResponse;
        return fetch(event.request).then((response) => {
          if (response && response.status === 200) {
            const clone = response.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(event.request, clone));
          }
          return response;
        });
      })
    );
    return;
  }

  // 4. Other same-origin assets (icons, manifest, etc.): NetworkFirst with cache fallback
  if (url.origin === self.location.origin) {
    event.respondWith(
      fetch(event.request)
        .then((response) => {
          if (response && response.status === 200) {
            const clone = response.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(event.request, clone));
          }
          return response;
        })
        .catch(() => caches.match(event.request))
    );
  }
});
