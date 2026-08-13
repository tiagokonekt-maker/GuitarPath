// Groply — Service Worker v8
//
// ── Ce qui change (audit §2.8) ────────────────────────────────────────────
// 1. Le dernier handler faisait `.catch(() => {})`, ce qui renvoie `undefined`
//    à respondWith() → erreur réseau brute dans la page, au lieu d'un échec
//    propre. Il renvoie maintenant une réponse explicite.
// 2. Le precache embarquait 6 photos JPEG (~780 Ko) dès l'installation, sur
//    le réseau mobile de l'utilisateur. Elles passent en cache paresseux.
// 3. Les samples audio (~60 .mp3) n'étaient pas gérés : la fonction audio,
//    cœur du produit, ne marchait pas hors-ligne alors que l'app se présente
//    comme une PWA offline. Ils sont maintenant mis en cache à la demande,
//    dans un cache dédié à durée de vie longue.
// 4. Stratégie explicite par type de ressource au lieu d'un cache-first
//    global, qui figeait indéfiniment tout fichier non hashé.
// 5. Le SW ne s'active plus de force (`skipWaiting` à l'install) : il attend
//    le signal de la page, qui prévient l'utilisateur. Recharger sous les
//    doigts de quelqu'un au milieu d'un exercice n'est pas acceptable.

const VERSION    = 'v8';
const APP_CACHE  = `groply-app-${VERSION}`;   // coquille + assets hashés
const CDN_CACHE  = 'groply-cdn-v2';           // polices + icônes
const MEDIA_CACHE = 'groply-media-v2';        // images de décor
const AUDIO_CACHE = 'groply-audio-v1';        // samples de guitare
const CACHES = [APP_CACHE, CDN_CACHE, MEDIA_CACHE, AUDIO_CACHE];

const CDN_HOSTS = ['fonts.googleapis.com', 'fonts.gstatic.com', 'cdn.jsdelivr.net'];

// Strictement la coquille : ce qui est indispensable pour afficher QUELQUE
// CHOSE hors-ligne. Tout le reste arrive à la demande.
const PRECACHE = [
  '/',
  '/index.html',
  '/offline.html',
  '/manifest.json',
  '/logo.svg',
  '/icon-192.png',
  '/apple-touch-icon.png',
  '/mascotte-think.svg',   // utilisée par offline.html et l'écran d'erreur
  '/mascotte-wave.svg',
];

const isAudio = (url) => url.pathname.startsWith('/audio/');
const isMedia = (url) => /\.(?:jpe?g|png|webp|avif|svg|gif)$/i.test(url.pathname);
const isHashedAsset = (url) => url.pathname.startsWith('/assets/');

self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(APP_CACHE).then(c =>
      // `allSettled` + `catch` individuel : un seul fichier absent ne doit
      // pas faire échouer toute l'installation du service worker.
      Promise.allSettled(PRECACHE.map(u => c.add(new Request(u, { cache: 'reload' })).catch(() => {})))
    )
    // Pas de skipWaiting() ici : c'est la page qui décide, après avoir
    // prévenu l'utilisateur.
  );
});

self.addEventListener('activate', (e) => {
  e.waitUntil((async () => {
    const keys = await caches.keys();
    await Promise.all(keys.filter(k => !CACHES.includes(k)).map(k => caches.delete(k)));
    // Navigation Preload : le navigateur lance la requête réseau en
    // parallèle du démarrage du SW, ce qui supprime le délai qu'il ajoute.
    if (self.registration.navigationPreload) {
      try { await self.registration.navigationPreload.enable(); } catch { /* non supporté */ }
    }
    await self.clients.claim();
  })());
});

/** Réponse d'échec propre — jamais `undefined`, qui produit une erreur réseau. */
const echec = (type = 'ressource') =>
  new Response(`Groply hors-ligne : ${type} indisponible.`, {
    status: 504,
    statusText: 'Gateway Timeout',
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });

/** Cache d'abord, réseau en secours. Pour l'immuable (assets hashés, audio). */
async function cacheFirst(request, cacheName, type) {
  const cache = await caches.open(cacheName);
  const hit = await cache.match(request);
  if (hit) return hit;
  try {
    const res = await fetch(request);
    // On ne met en cache que les réponses complètes et valides. Une réponse
    // 206 (Range) ou opaque en cache rend la ressource inutilisable ensuite.
    if (res && res.status === 200 && res.type !== 'opaque') {
      cache.put(request, res.clone());
    }
    return res;
  } catch {
    return echec(type);
  }
}

/** Réseau d'abord, cache en secours. Pour ce qui peut changer. */
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

  // On ne touche jamais aux appels d'API : la synchronisation de progression
  // doit voir les vraies erreurs réseau pour déclencher son repli local.
  if (url.hostname.endsWith('.supabase.co')) return;

  // ── Ressources externes ────────────────────────────────────────────────
  if (url.origin !== self.location.origin) {
    if (CDN_HOSTS.includes(url.hostname)) {
      e.respondWith(cacheFirst(request, CDN_CACHE, 'police'));
    }
    return;   // tout autre domaine : on laisse passer sans intercepter
  }

  // ── Navigation : réseau d'abord, page hors-ligne en dernier recours ────
  if (request.mode === 'navigate') {
    e.respondWith((async () => {
      try {
        const preload = await e.preloadResponse;
        if (preload) {
          const cache = await caches.open(APP_CACHE);
          cache.put(request, preload.clone());
          return preload;
        }
        const res = await fetch(request);
        if (res.ok) {
          const cache = await caches.open(APP_CACHE);
          cache.put(request, res.clone());
        }
        return res;
      } catch {
        const cache = await caches.open(APP_CACHE);
        return (await cache.match('/index.html'))
            || (await cache.match('/offline.html'))
            || echec('page');
      }
    })());
    return;
  }

  // ── Samples audio : immuables, cache dédié ─────────────────────────────
  if (isAudio(url))       { e.respondWith(cacheFirst(request, AUDIO_CACHE, 'son'));    return; }
  // ── Assets hashés par Vite : immuables ────────────────────────────────
  if (isHashedAsset(url)) { e.respondWith(cacheFirst(request, APP_CACHE, 'script'));   return; }
  // ── Images de décor : cache paresseux ─────────────────────────────────
  if (isMedia(url))       { e.respondWith(cacheFirst(request, MEDIA_CACHE, 'image'));  return; }

  // ── Le reste (manifest, fichiers racine non hashés) ───────────────────
  e.respondWith(networkFirst(request, APP_CACHE, 'fichier'));
});

self.addEventListener('message', (e) => {
  const data = e.data;
  if (data === 'SKIP_WAITING' || data?.type === 'SKIP_WAITING') self.skipWaiting();

  // Préchargement explicite des samples, déclenché par l'app quand
  // l'utilisateur active « rendre l'audio disponible hors-ligne ». On ne
  // télécharge jamais plusieurs mégaoctets sans le lui demander.
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
