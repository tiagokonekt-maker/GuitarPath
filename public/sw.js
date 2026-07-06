// Groply — Service Worker v6
const CACHE = 'groply-v6';
const CDN_CACHE = 'groply-cdn-v1';

// Domaines externes indispensables hors ligne : polices + icônes Tabler.
// (Idéalement à auto-héberger à terme — en attendant, on les met en cache.)
const CDN_HOSTS = [
  'fonts.googleapis.com',
  'fonts.gstatic.com',
  'cdn.jsdelivr.net',
];

const PRECACHE = [
  '/',
  '/index.html',
  '/manifest.json',
  '/offline.html',
  '/logo.svg',
  '/favicon.svg',
  '/icon-192.png',
  '/icon-512.png',
  '/icon-maskable.png',
  '/apple-touch-icon.png',
  '/guitar.webp',
  '/sunset.jpg',
  '/lavender.jpg',
  '/beach.jpg',
  '/ocean.jpg',
  '/sunrise.jpg',
  '/mascotte-celebrate.svg',
  '/mascotte-happy.svg',
  '/mascotte-think.svg',
  '/mascotte-wave.svg',
  '/mascotte-rocker.svg',
  '/mascotte-idea.svg',
  '/mascotte-pride.svg',
  '/mascotte-listen.svg',
];

self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE)
      .then(c => Promise.allSettled(PRECACHE.map(u => c.add(u).catch(() => {}))))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys()
      .then(keys => Promise.all(
        keys.filter(k => k !== CACHE && k !== CDN_CACHE).map(k => caches.delete(k))
      ))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (e) => {
  const { request } = e;
  const url = new URL(request.url);
  if (request.method !== 'GET') return;

  // ── CDN polices/icônes : cache-first (rend la PWA vraiment offline) ──
  if (url.origin !== self.location.origin) {
    if (CDN_HOSTS.includes(url.hostname)) {
      e.respondWith(
        caches.match(request).then(cached => {
          if (cached) return cached;
          return fetch(request).then(res => {
            if (res && res.status === 200) {
              const clone = res.clone();
              caches.open(CDN_CACHE).then(c => c.put(request, clone));
            }
            return res;
          });
        })
      );
    }
    return;
  }

  if (request.mode === 'navigate') {
    e.respondWith(
      fetch(request)
        .then(res => {
          if (res.ok) caches.open(CACHE).then(c => c.put(request, res.clone()));
          return res;
        })
        .catch(() => caches.match('/offline.html').then(r => r || caches.match('/index.html')))
    );
    return;
  }

  e.respondWith(
    caches.match(request).then(cached => {
      if (cached) return cached;
      return fetch(request).then(res => {
        if (!res || res.status !== 200 || res.type === 'opaque') return res;
        caches.open(CACHE).then(c => c.put(request, res.clone()));
        return res;
      }).catch(() => {});
    })
  );
});

self.addEventListener('message', (e) => {
  if (e.data === 'SKIP_WAITING') self.skipWaiting();
});
