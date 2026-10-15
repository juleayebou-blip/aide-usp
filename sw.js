// Service worker : met l'application en cache pour un usage hors ligne.
// Changer le numéro de version à chaque modification de contenu pour forcer la mise à jour.
const VERSION = "aide-usp-v0.9.1";
const ESSENTIELS = ["index.html", "data.js"];
const FACULTATIFS = ["./", "manifest.json", "icon-192.png", "icon-512.png"];

self.addEventListener("install", e => {
  e.waitUntil((async () => {
    const c = await caches.open(VERSION);
    /* les fichiers essentiels doivent être enregistrés, sinon l'installation échoue et l'ancienne version reste en place */
    await Promise.all(ESSENTIELS.map(f => c.add(new Request(f, { cache: "reload" }))));
    await Promise.all(FACULTATIFS.map(f => c.add(new Request(f, { cache: "reload" })).catch(() => null)));
    await self.skipWaiting();
  })());
});
self.addEventListener("activate", e => {
  e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== VERSION).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});
self.addEventListener("fetch", e => {
  if (e.request.method !== "GET") return;
  e.respondWith((async () => {
    const c = await caches.open(VERSION);
    const r = await c.match(e.request, { ignoreSearch: true });
    if (r) return r;
    try {
      const rep = await fetch(e.request);
      if (rep && rep.ok) c.put(e.request, rep.clone());
      return rep;
    } catch (err) {
      /* hors ligne : pour toute page, renvoyer l'application enregistrée */
      const p = await c.match("index.html");
      if (p && (e.request.mode === "navigate" || e.request.destination === "document")) return p;
      return Response.error();
    }
  })());
});
