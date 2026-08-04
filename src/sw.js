const CACHE = 'guitarpath-v1';
const ASSETS = ['/', '/index.html', '/manifest.json'];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(ASSETS)));
});

self.addEventListener('fetch', e => {
  const req = e.request;
  const url = new URL(req.url);

  // Ne jamais intercepter : les requêtes non-GET (POST/PUT vers Supabase etc.),
  // le cross-origin (API, CDN), et tout ce qui ressemble à une requête interne
  // du serveur de dev Vite (HMR, @vite/client, @react-refresh...). Un service
  // worker n'a rien à faire sur ces requêtes-là, les intercepter casse le
  // live-reload en dev et peut renvoyer des réponses invalides.
  if (req.method !== 'GET') return;
  if (url.origin !== self.location.origin) return;
  if (url.pathname.startsWith('/@') || url.pathname.includes('/node_modules/.vite/')) return;
  if (url.searchParams.has('t')) return; // requêtes HMR timestampées

  e.respondWith(
    caches.match(req).then(cached => cached || fetch(req).catch(() => cached))
  );
});