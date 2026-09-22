// Groply — Service Worker v9
//
// ── Ce qui a changé depuis la v8 ──────────────────────────────────────────
// Trois bugs réels, tous apparus après le retrait de la webfont Tabler
// (remplacée par des SVG inline) :
//
// 1. Ce fichier interceptait encore les requêtes vers cdn.jsdelivr.net et
//    fonts.googleapis.com pour les mettre en cache, en les re-fetchant
//    lui-même depuis l'intérieur du service worker. Un fetch() fait DEPUIS
//    un service worker est jugé par la directive CSP `connect-src`, et non
//    par `style-src`/`font-src` comme le serait le <link> d'origine — c'est
//    une nuance du navigateur, pas une erreur de configuration du CSP.
//    Résultat observé : "violates connect-src… action has been blocked."
//    cdn.jsdelivr.net n'a plus aucune raison d'être intercepté : les icônes
//    sont désormais des SVG intégrés à l'application, plus une webfont.
//    Google Fonts n'a plus besoin d'être mis en cache par le SW non plus —
//    un <link> direct suffit, profite du cache HTTP normal du navigateur
//    (très long, ces polices ne changent jamais), et n'est plus intercepté
//    du tout ici. C'est plus simple ET ça règle le blocage CSP à la racine.
//
// 2. `TypeError: Failed to execute 'clone' on 'Response'` dans le
//    gestionnaire de navigation. La combinaison `event.preloadResponse` +
//    `.clone()` + `cache.put()` est documentée comme fragile selon les
//    navigateurs : le corps de la réponse préchargée peut déjà être engagé
//    dans un autre flux de lecture au moment du clone. Plutôt que de
//    chasser ce comportement spécifique au moteur, on simplifie : on
//    renvoie la page directement, sans tenter de la mettre en cache au vol.
//    Le repli hors-ligne continue de fonctionner via /index.html et
//    /offline.html, déjà précachés à l'installation.
//
// 3. La version est incrémentée pour forcer le remplacement de tout cache
//    existant contenant ces comportements fautifs chez les utilisateurs qui
//    ont déjà la v8 installée.

const VERSION     = 'v9';
const APP_CACHE   = `groply-app-${VERSION}`;
const MEDIA_CACHE = 'groply-media-v2';
const AUDIO_CACHE = 'groply-audio-v1';
const CACHES = [APP_CACHE, MEDIA_CACHE, AUDIO_CACHE];

const PRECACHE = [
  '/',
  '/index.html',
  '/offline.html',
  '/manifest.json',
  '/logo.svg',
  '/icon-192.png',
  '/apple-touch-icon.png',
  '/mascotte-think.svg',
  '/mascotte-wave.svg',
];

const isAudio       = (url) => url.pathname.startsWith('/audio/');
const isMedia        = (url) => /\.(?:jpe?g|png|webp|avif|svg|gif)$/i.test(url.pathname);
const isHashedAsset  = (url) => url.pathname.startsWith('/assets/');

self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(APP_CACHE).then(c =>
      Promise.allSettled(PRECACHE.map(u => c.add(new Request(u, { cache: 'reload' })).catch(() => {})))
    )
  );
});

self.addEventListener('activate', (e) => {
  e.waitUntil((async () => {
    const keys = await caches.keys();
    await Promise.all(keys.filter(k => !CACHES.includes(k)).map(k => caches.delete(k)));
    if (self.registration.navigationPreload) {
      try { await self.registration.navigationPreload.enable(); } catch { /* non supporté */ }
    }
    await self.clients.claim();
  })());
});

const echec = (type = 'ressource') =>
  new Response(`Groply hors-ligne : ${type} indisponible.`, {
    status: 504,
    statusText: 'Gateway Timeout',
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });

async function cacheFirst(request, cacheName, type) {
  const cache = await caches.open(cacheName);
  const hit = await cache.match(request);
  if (hit) return hit;
  try {
    const res = await fetch(request);
    if (res && res.status === 200 && res.type !== 'opaque') {
      cache.put(request, res.clone());
    }
    return res;
  } catch {
    return echec(type);
  }
}

async function networkFirst(request, cacheName, type) {
  const cache = await caches.open(cacheName);
  try {
    const res = await fetch(request);
    if (res && res.ok) cache.put(request, res.clone());
    return res;
  } catch {
    const hit = await cache.match(request);
    return hit || echec(type);
  }
}

self.addEventListener('fetch', (e) => {
  const { request } = e;
  if (request.method !== 'GET') return;

  let url;
  try { url = new URL(request.url); } catch { return; }

  // On ne touche jamais aux appels d'API, ni à aucun domaine tiers : plus
  // aucun hôte externe n'est intercepté par ce service worker. Les polices
  // Google Fonts se chargent normalement par le <link> de la page, soumises
  // aux bonnes directives CSP (style-src/font-src), et profitent du cache
  // HTTP natif du navigateur.
  if (url.origin !== self.location.origin) return;

  // ── Navigation : réseau d'abord, page hors-ligne en dernier recours ────
  // Simplifié : plus de clone()/cache.put() sur la réponse préchargée ou
  // fraîchement récupérée — c'était la source du crash. Le document HTML
  // change rarement sans nouveau déploiement (qui incrémente VERSION et
  // vide le cache de toute façon), donc ne pas le mettre en cache au vol
  // ne coûte presque rien, et élimine le risque entièrement.
  if (request.mode === 'navigate') {
    e.respondWith((async () => {
      try {
        const preload = await e.preloadResponse;
        if (preload) return preload;
        return await fetch(request);
      } catch {
        const cache = await caches.open(APP_CACHE);
        return (await cache.match('/index.html'))
            || (await cache.match('/offline.html'))
            || echec('page');
      }
    })());
    return;
  }

  if (isAudio(url))       { e.respondWith(cacheFirst(request, AUDIO_CACHE, 'son'));    return; }
  if (isHashedAsset(url)) { e.respondWith(cacheFirst(request, APP_CACHE, 'script'));   return; }
  if (isMedia(url))       { e.respondWith(cacheFirst(request, MEDIA_CACHE, 'image'));  return; }

  e.respondWith(networkFirst(request, APP_CACHE, 'fichier'));
});

self.addEventListener('message', (e) => {
  const data = e.data;
  if (data === 'SKIP_WAITING' || data?.type === 'SKIP_WAITING') self.skipWaiting();

  if (data?.type === 'PRECACHE_AUDIO' && Array.isArray(data.urls)) {
    e.waitUntil((async () => {
      const cache = await caches.open(AUDIO_CACHE);
      let ok = 0;
      for (const u of data.urls) {
        try { await cache.add(new Request(u, { cache: 'reload' })); ok++; } catch { /* on continue */ }
      }
      const clients = await self.clients.matchAll();
      for (const c of clients) c.postMessage({ type: 'AUDIO_CACHED', count: ok, total: data.urls.length });
    })());
  }
});
