// Cache name is tied to the app version (passed in the registration URL as
// ?v=). Bumping version.js on deploy automatically produces a new cache
// name here, which makes the old cache obsolete and triggers cleanup below
// — no manual cache-clearing required from users.
const swUrl = new URL(self.location.href);
const APP_VERSION = swUrl.searchParams.get("v") || "0";
const CACHE_NAME = `h14-mess-${APP_VERSION}`;

const APP_SHELL = [
  "./",
  "./index.html",
  "./styles.css",
  "./version.js",
  "./data.js",
  "./app.js",
  "./manifest.json",
  "./icons/icon-192.png",
  "./icons/icon-512.png",
  "./icons/icon-512-maskable.png",
  "./icons/icon-180.png",
  "./icons/IIT_Kanpur_Logo.png"
];

// Files that should always be fetched fresh when possible (network-first):
// the entry HTML and the menu data, so a new deployment's content shows up
// immediately rather than waiting on the old cached copy.
const NETWORK_FIRST = ["index.html", "data.js", "manifest.json"];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(APP_SHELL))
  );
  // Do NOT auto skip-waiting here — app.js prompts the user to refresh via
  // the update toast, then sends SKIP_WAITING. This avoids yanking content
  // out from under someone mid-use.
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

self.addEventListener("message", (event) => {
  if (event.data && event.data.type === "SKIP_WAITING") {
    self.skipWaiting();
  }
});

self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET") return;

  const isNetworkFirst = NETWORK_FIRST.some((f) => event.request.url.includes(f));

  if (isNetworkFirst) {
    event.respondWith(
      fetch(event.request)
        .then((response) => {
          const copy = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(event.request, copy));
          return response;
        })
        .catch(() => caches.match(event.request))
    );
    return;
  }

  // Cache-first for static/versioned assets, so the app shell works offline.
  event.respondWith(
    caches.match(event.request).then((cached) => {
      if (cached) return cached;
      return fetch(event.request)
        .then((response) => {
          const copy = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(event.request, copy));
          return response;
        })
        .catch(() => cached);
    })
  );
});
