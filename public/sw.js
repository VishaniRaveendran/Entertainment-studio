/* Minimal service worker for offline shell */
const CACHE = 'entertainment-studio-v1';

self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE).then((cache) => cache.addAll(['/', '/index.html', '/logo.png', '/manifest.json'])).catch(() => {})
  );
  self.skipWaiting();
});

self.addEventListener('activate', (e) => {
  e.waitUntil(caches.keys().then((keys) => Promise.all(keys.map((k) => k !== CACHE && caches.delete(k)))));
  self.clients.claim();
});

self.addEventListener('fetch', (e) => {
  if (e.request.mode !== 'navigate') return;
  e.respondWith(
    fetch(e.request).catch(() => caches.match('/index.html').then((r) => r || caches.match('/')))
  );
});
