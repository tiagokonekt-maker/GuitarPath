import { useCallback, useRef, useState } from 'react';
import { supabase, getCachedAccessToken, SUPABASE_REST, SUPABASE_KEY } from './supabaseClient';
import { cleHorsLigne, interpreterChargementProgression, purgerSuppressionCompte } from '../store/compte.js';
import { sauvegarderSansEcraser, versLigne, creerFile } from '../store/synchro.js';

// ── Ce qui change ─────────────────────────────────────────────────────────
// 1. `updated_at` est LU au chargement et renvoyé à l'appelant : le merge
//    peut ainsi départager deux appareils sur autre chose que `Math.max`.
// 2. Le repli hors-ligne est écrit AVANT la tentative réseau, puis nettoyé
//    en cas de succès. Avant, un onglet fermé pendant la requête perdait la
//    session : le repli n'était écrit que dans le `catch`.
// 3. `flush()` fait une sauvegarde synchrone « best effort » via
//    `fetch(keepalive)`, appelable depuis `visibilitychange` / `pagehide` —
//    le seul moment où le navigateur garantit encore de laisser passer une
//    requête sur mobile.
// 4. Plus aucun `console.log` en production.
// 5. `loadProgress` LÈVE une erreur quand le chargement échoue, et ne renvoie
//    `null` que s'il n'y a vraiment aucune ligne. Avant, les deux cas
//    renvoyaient `null` et l'app écrasait la progression cloud.
// 6. Le repli hors-ligne est indexé par userId : un autre compte connecté
//    ensuite sur le même appareil ne le synchronise plus dans le sien.
// 7. Plus d'écrasement entre appareils : chaque écriture est conditionnée
//    à la version cloud lue en dernier (`updated_at`, voir store/synchro.js).
//    En cas de conflit, on relit, on fusionne via `fusionner` (fourni par
//    App) et on réessaie. Toutes les opérations cloud passent par une file :
//    une seule à la fois, dans l'ordre.

const DEV = typeof import.meta !== 'undefined' && import.meta.env?.DEV;

const log = (...a) => { if (DEV) console.warn('[groply/progress]', ...a); };

const writeOffline = (userId, state) => {
  try { localStorage.setItem(cleHorsLigne(userId), JSON.stringify(state)); } catch { /* quota */ }
};
const clearOffline = (userId) => {
  try { localStorage.removeItem(cleHorsLigne(userId)); } catch { /* noop */ }
};

export function useProgress(userId) {
  // `updated_at` de la dernière version cloud connue : null = pas de ligne.
  const jetonRef = useRef(null);
  // Une seule file par instance du hook (créée au premier rendu).
  const [enFile] = useState(creerFile);

  // Lecture brute, sans lever d'erreur : { statut, progression?, erreur? }.
  // `maybeSingle()` plutôt que `single()` : à la première connexion il n'y a
  // pas de ligne, et `single()` renvoyait alors une erreur (PGRST116).
  const lire = useCallback(async () => {
    try {
      const reponse = await supabase
        .from('progress')
        .select('xp, level, streak, data, updated_at')
        .eq('user_id', userId)
        .maybeSingle();
      return interpreterChargementProgression(reponse);
    } catch (e) {
      return { statut: 'erreur', erreur: e };
    }
  }, [userId]);

  // ── Charger la progression depuis Supabase ──────────────────────────
  // Renvoie la progression, `null` s'il n'y a pas encore de ligne (première
  // connexion), et LÈVE une erreur si on ne sait pas (réseau, RLS, 5xx…) :
  // l'appelant ne doit surtout pas écrire dans le cloud dans ce dernier cas.
  // Passe par la file : une relecture ne peut pas s'intercaler au milieu
  // d'une sauvegarde et remplacer le jeton par une version plus ancienne.
  const loadProgress = useCallback(() => enFile(async () => {
    if (!userId) return null;
    const r = await lire();
    if (r.statut === 'erreur') {
      log('load', r.erreur?.message);
      throw new Error(r.erreur?.message || 'Chargement de la progression impossible');
    }
    jetonRef.current = r.progression?.cloudUpdatedAt || null;
    return r.progression;
  }), [userId, lire, enFile]);

  // Écriture conditionnelle : insertion s'il n'y a pas encore de ligne,
  // sinon mise à jour SEULEMENT si la ligne est encore à la version `jeton`.
  const ecrire = useCallback(async (state, jeton) => {
    const ligne = { ...versLigne(userId, state), updated_at: new Date().toISOString() };
    try {
      if (!jeton) {
        const { data, error } = await supabase.from('progress').insert(ligne).select('updated_at');
        // 23505 : la ligne existe déjà (créée entre-temps par un autre appareil).
        if (error) return error.code === '23505' ? { statut: 'conflit' } : { statut: 'erreur', erreur: error };
        return { statut: 'ok', jeton: data?.[0]?.updated_at ?? null };
      }
      const { data, error } = await supabase
        .from('progress')
        .update(ligne)
        .eq('user_id', userId)
        .eq('updated_at', jeton)
        .select('updated_at');
      if (error) return { statut: 'erreur', erreur: error };
      if (!data?.length) return { statut: 'conflit' };
      return { statut: 'ok', jeton: data[0].updated_at };
    } catch (e) {
      return { statut: 'erreur', erreur: e };
    }
  }, [userId]);

  // ── Sauvegarder la progression ──────────────────────────────────────
  // `fusionner(progressionCloud)` est appelée en cas de conflit : elle doit
  // renvoyer l'état fusionné (et l'appliquer à l'app).
  const saveProgress = useCallback((state, fusionner) => enFile(async () => {
    if (!userId || !state) return false;

    // Repli écrit d'emblée : si la requête n'aboutit pas (onglet fermé,
    // réseau coupé en cours de route), la session n'est pas perdue.
    writeOffline(userId, state);

    const r = await sauvegarderSansEcraser({
      etat: state,
      jeton: jetonRef.current,
      ecrire,
      lire,
      fusionner: fusionner || ((cloud) => cloud),
    });
    if (!r.ok) { log('save', r.raison, r.erreur?.message); return false; }
    jetonRef.current = r.jeton;
    clearOffline(userId);
    return true;
  }), [userId, ecrire, lire, enFile]);

  /**
   * Sauvegarde de dernière chance, appelable depuis `visibilitychange` ou
   * `pagehide` — c'est-à-dire au moment où l'utilisateur ferme l'app.
   * Sans elle, jusqu'à 3 secondes de progression étaient perdues côté cloud
   * à chaque fermeture (audit §2.4), et le geste normal sur mobile est
   * précisément « je termine mon quiz, je ferme l'app ».
   *
   * `fetch(..., { keepalive: true })` est le bon outil : contrairement à
   * `sendBeacon`, il accepte les en-têtes exigés par PostgREST (apikey,
   * Authorization, Prefer), et le navigateur s'engage à livrer la requête
   * même après la fermeture de l'onglet.
   *
   * Même règle que saveProgress, sans possibilité de fusionner (la page se
   * ferme) : on n'écrit que si le cloud est encore à notre version. Sinon la
   * requête ne modifie rien, le repli local reste, et la fusion se fera à la
   * prochaine ouverture.
   */
  const flush = useCallback((state) => {
    if (!userId || !state) return;
    writeOffline(userId, state);

    const token = getCachedAccessToken();
    if (!SUPABASE_REST || !token) return;   // le repli local suffira

    const jeton = jetonRef.current;
    const ligne = { ...versLigne(userId, state), updated_at: new Date().toISOString() };
    const url = jeton
      ? `${SUPABASE_REST}/progress?user_id=eq.${userId}&updated_at=eq.${encodeURIComponent(jeton)}`
      : `${SUPABASE_REST}/progress`;
    try {
      fetch(url, {
        method: jeton ? 'PATCH' : 'POST',
        keepalive: true,
        headers: {
          'Content-Type': 'application/json',
          apikey: SUPABASE_KEY,
          Authorization: `Bearer ${token}`,
          Prefer: 'return=representation',
        },
        body: JSON.stringify(ligne),
      })
        .then(r => (r.ok ? r.json() : []))
        .then(lignes => {
          // Une ligne renvoyée = écriture réellement faite. Un PATCH qui ne
          // trouve pas la version attendue répond 200 avec un tableau vide.
          if (Array.isArray(lignes) && lignes[0]?.updated_at) {
            jetonRef.current = lignes[0].updated_at;
            clearOffline(userId);
          }
        })
        .catch(() => { /* le repli local prendra le relais */ });
    } catch {
      /* idem */
    }
  }, [userId]);

  // ── Sync offline → Supabase au retour en ligne ──────────────────────
  // Le repli est d'abord FUSIONNÉ dans l'état courant (il peut contenir une
  // session que l'état local n'a plus, par exemple si un autre compte est
  // passé sur l'appareil entre-temps), puis le tout est sauvegardé.
  const syncOfflineData = useCallback(async (fusionner) => {
    if (!userId || !fusionner) return;
    let raw = null;
    try {
      raw = localStorage.getItem(cleHorsLigne(userId));
    } catch { return; }
    if (!raw) return;
    try {
      await saveProgress(fusionner(JSON.parse(raw)), fusionner);
    } catch (e) {
      log('sync', e?.message);
    }
  }, [userId, saveProgress]);

  /**
   * Suppression du compte et de toutes les données associées (RGPD art. 17).
   * Passe par une Edge Function : la suppression d'un utilisateur `auth`
   * exige la clé `service_role`, qui ne doit JAMAIS être présente côté
   * client. Le SQL de la fonction est dans sql/02-delete-account.sql.
   */
  const deleteAccount = useCallback(async () => {
    if (!userId) return { ok: false, error: 'Aucune session.' };
    try {
      const { error } = await supabase.functions.invoke('delete-account', { body: {} });
      if (error) {
        // Le message générique de supabase-js (« Edge Function returned a
        // non-2xx status code ») n'aide personne : on lit celui de la fonction.
        let message = error.message;
        try { message = (await error.context?.json())?.error || message; } catch { /* corps illisible */ }
        return { ok: false, error: message };
      }
      purgerSuppressionCompte(localStorage, userId);
      jetonRef.current = null;
      await supabase.auth.signOut();
      return { ok: true };
    } catch (e) {
      return { ok: false, error: e?.message || 'Erreur inconnue.' };
    }
  }, [userId]);

  return { loadProgress, saveProgress, flush, syncOfflineData, deleteAccount };
}
