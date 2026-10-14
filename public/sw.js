// Groply — Service Worker v10
//
// ── Ce qui change depuis la v9 : mise à jour AUTOMATIQUE ──────────────────
// Jusqu'ici, une nouvelle version restait en attente ("waiting") tant que
// l'utilisateur n'avait pas cliqué sur le bandeau "Mettre à jour" affiché
// par l'app. En pratique, ce clic n'arrivait pas toujours : un bandeau
// discret qu'on ne remarque pas, ou qu'on remet à plus tard, et la nouvelle
// version n'était jamais appliquée — recharger la page ne suffit PAS à
// contourner un service worker déjà actif, contrairement à l'intuition.
//
// Pire : si la version installée a un bug dans son propre gestionnaire de
// navigation (ce qui est arrivé avec le bug `.clone()` de la v8 ci-dessous),
// elle peut se mettre à servir indéfiniment une page HTML mise en cache au
// moment de son installation — laquelle référence d'anciens fichiers JS.
// Dans ce cas, la personne reste bloquée sur une ancienne version, sans
// aucun moyen d'en sortir elle-même.
//
// Cette version appelle `self.skipWaiting()` automatiquement dès la fin de
// l'installation, au lieu d'attendre un message de la page. Combiné à
// `self.clients.claim()` dans `activate` (déjà présent), une nouvelle
// version prend le contrôle de tous les onglets ouverts SANS action de
// l'utilisateur. Le rechargement de page qui suit est géré côté App.jsx,
// avec un garde-fou : il attend que l'onglet passe en arrière-plan avant de
// recharger, pour ne jamais couper quelqu'un en pleine leçon — sauf si
// l'onglet reste actif sans interruption pendant plus de 10 minutes, auquel
// cas on recharge quand même plutôt que de laisser tourner indéfiniment une
// version obsolète.
//
// ── Ce qui avait changé depuis la v8 (toujours valable) ───────────────────
// Trois bugs réels, tous apparus après le retrait de la webfont Tabler
// (remplacée par des SVG inline) :
//
// 1. Ce fichier interceptait encore les requêtes vers cdn.jsdelivr.net et
//    fonts.googleapis.com pour les mettre en cache, en les re-fetchant
//    lui-même depuis l'intérieur du service worker. Un fetch() fait DEPUIS
//    un service worker est jugé par la directive CSP `connect-src`, et non
//    par `style-src`/`font-src` comme le serait le <link> d'origine — c'est
//    une nuance du navigateur, pas une erreur de configuration du CSP.
//    cdn.jsdelivr.net n'a plus aucune raison d'être intercepté : les icônes
//    sont désormais des SVG intégrés à l'application, plus une webfont.
//
// 2. `TypeError: Failed to execute 'clone' on 'Response'` dans le
//    gestionnaire de navigation. La combinaison `event.preloadResponse` +
//    `.clone()` + `cache.put()` est documentée comme fragile selon les
//    navigateurs. On renvoie désormais la page directement, sans tenter de
//    la mettre en cache au vol. Le repli hors-ligne continue de fonctionner
//    via /index.html et /offline.html, déjà précachés à l'installation.
//    C'est CE bug qui a laissé des utilisateurs bloqués sur la v8 — la
//    mise à jour automatique de cette version est justement ce qui permet
//    de les en sortir sans intervention manuelle.
//
// 3. La version est incrémentée à chaque changement, pour forcer le
//    remplacement de tout cache existant chez les utilisateurs qui ont
//    encore une version antérieure installée.

const VERSION     = 'v10';
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
    caches.open(APP_CACHE)
      .then(c =>
        Promise.allSettled(PRECACHE.map(u => c.add(new Request(u, { cache: 'reload' })).catch(() => {})))
      )
      // Auto-activation : on ne reste plus en "waiting" à espérer un clic.
      // Combiné à clients.claim() dans activate, ce service worker prend le
      // contrôle de tous les onglets ouverts dès qu'il est installé.
      .then(() => self.skipWaiting())
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
  // Conservé pour compatibilité : ne fait plus rien de nécessaire depuis
  // que l'installation appelle skipWaiting() elle-même, mais un appel
  // supplémentaire est sans risque (skipWaiting est idempotent).
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
