import { useCallback, useRef } from 'react';
import { supabase, getCachedAccessToken, SUPABASE_REST, SUPABASE_KEY } from './supabaseClient';

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

const OFFLINE_KEY = 'groply_offline_state';
const LEGACY_OFFLINE_KEY = 'guitarpath_offline_state';
const DEV = typeof import.meta !== 'undefined' && import.meta.env?.DEV;

const log = (...a) => { if (DEV) console.warn('[groply/progress]', ...a); };

const writeOffline = (state) => {
  try { localStorage.setItem(OFFLINE_KEY, JSON.stringify(state)); } catch { /* quota */ }
};
const clearOffline = () => {
  try { localStorage.removeItem(OFFLINE_KEY); } catch { /* noop */ }
};

export function useProgress(userId) {
  const inFlight = useRef(false);

  // ── Charger la progression depuis Supabase ──────────────────────────
  const loadProgress = useCallback(async () => {
    if (!userId) return null;
    try {
      // `maybeSingle()` plutôt que `single()` : à la première connexion il
      // n'y a pas de ligne, et `single()` renvoyait alors une erreur qu'il
      // fallait reconnaître par son code (PGRST116).
      const { data, error } = await supabase
        .from('progress')
        .select('xp, level, streak, data, updated_at')
        .eq('user_id', userId)
        .maybeSingle();

      if (error) { log('load', error.message); return null; }
      if (!data) return null;

      return {
        ...(data.data && typeof data.data === 'object' ? data.data : {}),
        xp: data.xp,
        level: data.level,
        streak: data.streak,
        cloudUpdatedAt: data.updated_at || '',
      };
    } catch (e) {
      log('load offline', e?.message);
      return null;
    }
  }, [userId]);

  // ── Sauvegarder la progression ──────────────────────────────────────
  const saveProgress = useCallback(async (state) => {
    if (!userId || !state) return false;

    // `cloudUpdatedAt` est une métadonnée de lecture, elle n'a rien à faire
    // dans la colonne `data`.
    const { xp, level, streak, cloudUpdatedAt, ...rest } = state;

    // Repli écrit d'emblée : si la requête n'aboutit pas (onglet fermé,
    // réseau coupé en cours de route), la session n'est pas perdue.
    writeOffline(state);

    try {
      inFlight.current = true;
      const { error } = await supabase
        .from('progress')
        .upsert({
          user_id: userId,
          xp, level, streak,
          data: rest,
          updated_at: new Date().toISOString(),
        }, { onConflict: 'user_id' });

      if (error) { log('save', error.message); return false; }
      clearOffline();
      return true;
    } catch (e) {
      log('save offline', e?.message);
      return false;
    } finally {
      inFlight.current = false;
    }
  }, [userId]);

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
   * Le repli localStorage est écrit dans tous les cas : si la requête
   * n'aboutit pas, `syncOfflineData()` reprendra au prochain démarrage.
   */
  const flush = useCallback((state) => {
    if (!userId || !state) return;
    writeOffline(state);

    const token = getCachedAccessToken();
    if (!SUPABASE_REST || !token) return;   // le repli local suffira

    const { xp, level, streak, cloudUpdatedAt, ...rest } = state;
    try {
      fetch(`${SUPABASE_REST}/progress?on_conflict=user_id`, {
        method: 'POST',
        keepalive: true,
        headers: {
          'Content-Type': 'application/json',
          apikey: SUPABASE_KEY,
          Authorization: `Bearer ${token}`,
          Prefer: 'resolution=merge-duplicates,return=minimal',
        },
        body: JSON.stringify({
          user_id: userId, xp, level, streak, data: rest,
          updated_at: new Date().toISOString(),
        }),
      }).then(() => clearOffline()).catch(() => { /* le repli local prendra le relais */ });
    } catch {
      /* idem */
    }
  }, [userId]);

  // ── Sync offline → Supabase au retour en ligne ──────────────────────
  const syncOfflineData = useCallback(async () => {
    if (!userId) return;
    let raw = null;
    try {
      raw = localStorage.getItem(OFFLINE_KEY) || localStorage.getItem(LEGACY_OFFLINE_KEY);
    } catch { return; }
    if (!raw) return;
    try {
      const state = JSON.parse(raw);
      const ok = await saveProgress(state);
      if (ok) { try { localStorage.removeItem(LEGACY_OFFLINE_KEY); } catch {} }
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
      if (error) return { ok: false, error: error.message };
      try {
        localStorage.removeItem(OFFLINE_KEY);
        localStorage.removeItem('groply_state');
        localStorage.removeItem('groply_content');
      } catch { /* noop */ }
      await supabase.auth.signOut();
      return { ok: true };
    } catch (e) {
      return { ok: false, error: e?.message || 'Erreur inconnue.' };
    }
  }, [userId]);

  return { loadProgress, saveProgress, flush, syncOfflineData, deleteAccount };
}
