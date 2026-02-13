// service-worker.js
// Fixes: stale index.html/script.js being served forever (buttons "do nothing")

const CACHE = "powderfiles-cache-v2";

// List only truly static assets you want available offline.
// (You can add skifree-bg.png too so background works offline.)
const ASSETS = [
  "./",
  "./index.html",
  "./style.css",
  "./script.js",
  "./manifest.json",
  "./assets/skifree-bg.png",
  "./icons/icon-192.png",
  "./icons/icon-512.png",
  "./icons/apple-touch-icon-180.png"
];

self.addEventListener("install", (event) => {
  // Force the updated SW to take control ASAP
  self.skipWaiting();

  event.waitUntil(
    caches.open(CACHE).then((cache) => cache.addAll(ASSETS)).catch(() => {
      // If any asset fails (e.g., first deploy timing), still install SW
    })
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    (async () => {
      // Remove older caches so old HTML/JS can't keep winning
      const keys = await caches.keys();
      await Promise.all(keys.map((k) => (k !== CACHE ? caches.delete(k) : Promise.resolve())));
      await self.clients.claim();
    })()
  );
});

self.addEventListener("fetch", (event) => {
  const req = event.request;

  // Only handle GET
  if (req.method !== "GET") return;

  const url = new URL(req.url);

  // -----------------------------
  // 1) HTML / navigation requests
  // Network-first so updates appear immediately
  // -----------------------------
  const isHTML =
    req.mode === "navigate" ||
    (req.headers.get("accept") || "").includes("text/html");

  if (isHTML) {
    event.respondWith(
      (async () => {
        try {
          const fresh = await fetch(req);
          // Update cached index.html for offline fallback
          const cache = await caches.open(CACHE);
          cache.put("./index.html", fresh.clone());
          return fresh;
        } catch (e) {
          // Offline fallback
          const cached = await caches.match("./index.html");
          return cached || new Response("Offline", { status: 503, headers: { "Content-Type": "text/plain" } });
        }
      })()
    );
    return;
  }

  // -----------------------------
  // 2) Static assets (JS/CSS/images)
  // Cache-first, but allow query-string cache busting
  // -----------------------------
  const isStatic =
    url.origin === self.location.origin &&
    (url.pathname.endsWith(".js") ||
      url.pathname.endsWith(".css") ||
      url.pathname.endsWith(".png") ||
      url.pathname.endsWith(".jpg") ||
      url.pathname.endsWith(".jpeg") ||
      url.pathname.endsWith(".gif") ||
      url.pathname.endsWith(".svg") ||
      url.pathname.endsWith(".webp") ||
      url.pathname.endsWith(".ico") ||
      url.pathname.endsWith(".json"));

  if (isStatic) {
    event.respondWith(
      (async () => {
        const cached = await caches.match(req, { ignoreSearch: true });
        if (cached) return cached;

        try {
          const fresh = await fetch(req);
          const cache = await caches.open(CACHE);
          cache.put(req, fresh.clone());
          return fresh;
        } catch (e) {
          // If we couldn't fetch and no cache exists, fail gracefully
          return new Response("", { status: 504 });
        }
      })()
    );
    return;
  }

  // -----------------------------
  // 3) Everything else: just network
  // (important so Supabase requests are never cached)
  // -----------------------------
  return;
});
