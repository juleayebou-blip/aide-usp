// Service worker : met l'application en cache pour un usage hors ligne.
// Changer le numéro de version à chaque modification de contenu pour forcer la mise à jour.
const VERSION = "aide-usp-v0.4";
const FICHIERS = ["./", "index.html", "data.js", "manifest.json", "icon-192.png", "icon-512.png"];

self.addEventListener("install", e => {
  e.waitUntil(caches.open(VERSION).then(c => c.addAll(FICHIERS)).then(() => self.skipWaiting()));
});
self.addEventListener("activate", e => {
  e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== VERSION).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});
self.addEventListener("fetch", e => {
  if (e.request.method !== "GET") return;
  e.respondWith(
    caches.match(e.request).then(r => r || fetch(e.request).then(rep => {
      const copie = rep.clone(); caches.open(VERSION).then(c => c.put(e.request, copie)); return rep;
    }).catch(() => caches.match("index.html")))
  );
});
