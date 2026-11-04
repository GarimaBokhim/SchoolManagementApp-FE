// Service worker for EliteKhaneyPani PWA (app shell caching + offline fallback).
const CACHE_VERSION = "elitekhaneypani-v2";
const CORE_ASSETS = [
  "/elitekhaneypani",
  "/manifest.json",
  "/assets/logo.png",
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches
      .open(CACHE_VERSION)
      .then((cache) => cache.addAll(CORE_ASSETS))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(
          keys
            .filter((key) => key !== CACHE_VERSION)
            .map((key) => caches.delete(key))
        )
      )
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (event) => {
  const { request } = event;

  if (request.method !== "GET") return;

  const url = new URL(request.url);

  // Never cache API calls - they carry auth/session data and must stay fresh.
  if (url.pathname.startsWith("/api/")) return;

  // Navigation requests: network-first with cache fallback for offline support.
  if (request.mode === "navigate") {
    event.respondWith(
      fetch(request).catch(() => caches.match(request).then((res) => res || caches.match("/elitekhaneypani")))
    );
    return;
  }

  // Prefer current deployment assets and use the cache only when offline.
  event.respondWith(
    fetch(request)
      .then((response) => {
        if (response.ok && url.origin === self.location.origin) {
          return caches
            .open(CACHE_VERSION)
            .then((cache) => cache.put(request, response.clone()))
            .then(() => response);
        }
        return response;
      })
      .catch(() => caches.match(request).then((cached) => cached || Response.error()))
  );
});
