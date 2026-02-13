/* service-worker.js
   PowderFiles — safe SW that won't "freeze" your JS updates
   - Network-first for HTML so new builds load immediately
   - Cache-first for static assets
   - Never caches Supabase/API calls
*/

const CACHE = "powderfiles-cache-v3";

const STATIC_ASSETS = [
  "./",
  "./index.html",
  "./style.css",
  "./script.js",
  "./manifest.json",
  "./assets/skifree-bg.png",
  "./icons/icon-192.png",
  "./icons/icon-512.png",
  "./icons/apple-touch-icon-180.png",
];

self.addEventListener("install", (event) => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE).then((cache) => cache.addAll(STATIC_ASSETS)).catch(() => {})
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    (async () => {
      const keys = await caches.keys();
      await Promise.all(keys.map((k) => (k !== CACHE ? caches.delete(k) : Promise.resolve())));
      await self.clients.claim();
    })()
  );
});

self.addEventListener("fetch", (event) => {
  const req = event.request;
  if (req.method !== "GET") return;

  const url = new URL(req.url);

  // IMPORTANT: Never cache Supabase / external API calls
  if (url.origin !== self.location.origin) return;

  const accept = req.headers.get("accept") || "";

  // 1) HTML navigation: network-first
  if (req.mode === "navigate" || accept.includes("text/html")) {
    event.respondWith(
      (async () => {
        try {
          const fresh = await fetch(req);
          const cache = await caches.open(CACHE);
          cache.put("./index.html", fresh.clone());
          return fresh;
        } catch {
          const cached = await caches.match("./index.html");
          return cached || new Response("Offline", { status: 503 });
        }
      })()
    );
    return;
  }

  // 2) Static assets: cache-first
  const isStatic =
    url.pathname.endsWith(".js") ||
    url.pathname.endsWith(".css") ||
    url.pathname.endsWith(".png") ||
    url.pathname.endsWith(".jpg") ||
    url.pathname.endsWith(".jpeg") ||
    url.pathname.endsWith(".gif") ||
    url.pathname.endsWith(".svg") ||
    url.pathname.endsWith(".webp") ||
    url.pathname.endsWith(".ico") ||
    url.pathname.endsWith(".json");

  if (isStatic) {
    event.respondWith(
      (async () => {
        const cached = await caches.match(req, { ignoreSearch: true });
        if (cached) return cached;

        const fresh = await fetch(req);
        const cache = await caches.open(CACHE);
        cache.put(req, fresh.clone());
        return fresh;
      })()
    );
  }
});
