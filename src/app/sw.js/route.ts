import { game } from "@/data/game";
import { allPageKeys, pathFor } from "@/i18n/alternates";
import { LOCALES, paths } from "@/i18n/locale";

/**
 * Service worker généré pour rester synchronisé avec les données :
 * - pré-cache toutes les pages de la checklist à l'installation ;
 * - pages : réseau d'abord, cache si hors ligne ;
 * - fichiers /_next/static : cache d'abord (noms versionnés).
 */
export function GET() {
  // Toutes les pages, en français et en anglais, plus la sauvegarde.
  const pages = [
    ...allPageKeys().flatMap((key) =>
      LOCALES.map((l) => pathFor(key, l)).filter((x): x is string => !!x),
    ),
    ...LOCALES.map((l) => paths(l).backup),
  ];
  const cacheName = `platinecity-${game.version}`;

  const source = `
const CACHE = ${JSON.stringify(cacheName)};
const PAGES = ${JSON.stringify(pages)};

self.addEventListener("install", (event) => {
  event.waitUntil(caches.open(CACHE).then((c) => c.addAll(PAGES)).then(() => self.skipWaiting()));
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((k) => k.startsWith("platinecity-") && k !== CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (event) => {
  const req = event.request;
  if (req.method !== "GET") return;
  const url = new URL(req.url);
  if (url.origin !== self.location.origin) return;

  if (url.pathname.startsWith("/_next/static/") || /\\.(png|woff2|ico)$/.test(url.pathname)) {
    event.respondWith(
      caches.match(req).then((hit) => hit || fetch(req).then((res) => {
        if (res.ok) { const copy = res.clone(); caches.open(CACHE).then((c) => c.put(req, copy)); }
        return res;
      }))
    );
    return;
  }

  if (req.mode === "navigate" || req.headers.get("accept")?.includes("text/html")) {
    event.respondWith(
      fetch(req).then((res) => {
        if (res.ok) { const copy = res.clone(); caches.open(CACHE).then((c) => c.put(req, copy)); }
        return res;
      }).catch(() => caches.match(req, { ignoreSearch: true }).then((hit) => hit || caches.match("/")))
    );
  }
});
`;

  return new Response(source, {
    headers: {
      "Content-Type": "application/javascript; charset=utf-8",
      "Cache-Control": "no-cache, no-store, must-revalidate",
      "Service-Worker-Allowed": "/",
    },
  });
}
