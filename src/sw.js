// Groply — Service Worker v3
// Cache-first assets · Network-first navigation · Offline fallback propre
// Mis à jour : icônes PNG + audio précachés, gestion SKIP_WAITING robuste

const CACHE = 'groply-v3';

// Assets garantis offline (chemin statique, pas de hash Vite)
const PRECACHE = [
  '/',
  '/index.html',
  '/manifest.json',
  '/offline.html',
  '/logo.svg',
  '/favicon.svg',
  '/guitar.webp',
  '/sunset.jpg',
  '/lavender.jpg',
  '/beach.jpg',
  '/ocean.jpg',
  '/sunrise.jpg',
  '/icon-192.png',
  '/icon-512.png',
  '/icon-192-mask.png',
  '/apple-touch-icon.png',
];

// ── INSTALL ───────────────────────────────────────────────────────────────────
self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE)
      .then(cache => Promise.allSettled(PRECACHE.map(u => cache.add(u).catch(() => {}))))
      .then(() => self.skipWaiting())
  );
});

// ── ACTIVATE : purge les anciens caches ───────────────────────────────────────
self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

// ── FETCH ─────────────────────────────────────────────────────────────────────
self.addEventListener('fetch', (e) => {
  const { request } = e;
  const url = new URL(request.url);

  // Ignore non-GET et cross-origin (Supabase, fonts Google, etc.)
  if (request.method !== 'GET') return;
  if (url.origin !== self.location.origin) return;

  // Navigation HTML → network-first, fallback offline.html
  if (request.mode === 'navigate') {
    e.respondWith(
      fetch(request)
        .then(res => {
          // On met en cache la dernière version reçue
          if (res.ok) {
            const clone = res.clone();
            caches.open(CACHE).then(c => c.put(request, clone));
          }
          return res;
        })
        .catch(() =>
          caches.match('/offline.html').then(r => r || caches.match('/index.html'))
        )
    );
    return;
  }

  // Assets JS/CSS/images/audio → cache-first, réseau en fallback avec mise en cache
  e.respondWith(
    caches.match(request).then(cached => {
      if (cached) return cached;
      return fetch(request).then(res => {
        if (!res || res.status !== 200 || res.type === 'opaque') return res;
        const clone = res.clone();
        caches.open(CACHE).then(c => c.put(request, clone));
        return res;
      }).catch(() => {});
    })
  );
});

// ── MESSAGE : rechargement propre depuis l'app ────────────────────────────────
self.addEventListener('message', (e) => {
  if (e.data === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});
