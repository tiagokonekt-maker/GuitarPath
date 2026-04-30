import { useCallback, useRef } from 'react';
import { supabase } from './supabaseClient';

const SAVE_DEBOUNCE_MS = 3000; // sauvegarde 3s après le dernier changement

export function useProgress(userId) {
  const debounceTimer = useRef(null);

  // ── Charger la progression depuis Supabase ──────────────────────────
  const loadProgress = useCallback(async () => {
    if (!userId) return null;

    try {
      const { data, error } = await supabase
        .from('progress')
        .select('*')
        .eq('user_id', userId)
        .single();

      if (error && error.code !== 'PGRST116') {
        // PGRST116 = no rows found (première connexion)
        console.error('loadProgress error:', error);
        return null;
      }

      if (!data) return null;

      // Fusionner xp/level/streak + data JSON
      return {
        xp:     data.xp,
        level:  data.level,
        streak: data.streak,
        ...data.data, // contient completedLessons, quizResults, etc.
      };
    } catch (e) {
      console.warn('Supabase offline, fallback localStorage');
      return null;
    }
  }, [userId]);

  // ── Sauvegarder la progression dans Supabase ────────────────────────
  const saveProgress = useCallback(async (state) => {
    if (!userId) return;

    // Extraire les champs principaux, le reste va dans data JSON
    const { xp, level, streak, ...rest } = state;

    try {
      const { error } = await supabase
        .from('progress')
        .upsert(
          {
            user_id:    userId,
            xp,
            level,
            streak,
            data:       rest,
            updated_at: new Date().toISOString(),
          },
          { onConflict: 'user_id' }
        );

      if (error) {
        console.error('saveProgress error:', error);
        // Fallback : sauvegarde en localStorage
        localStorage.setItem('guitarpath_offline_state', JSON.stringify(state));
      } else {
        // Nettoyage du fallback si sync réussie
        localStorage.removeItem('guitarpath_offline_state');
      }
    } catch (e) {
      console.warn('Supabase offline, sauvegarde locale');
      localStorage.setItem('guitarpath_offline_state', JSON.stringify(state));
    }
  }, [userId]);

  // ── Version debouncée (évite trop d'appels API) ─────────────────────
  const saveProgressDebounced = useCallback((state) => {
    if (debounceTimer.current) clearTimeout(debounceTimer.current);
    debounceTimer.current = setTimeout(() => saveProgress(state), SAVE_DEBOUNCE_MS);
  }, [saveProgress]);

  // ── Sync offline → Supabase au retour en ligne ──────────────────────
  const syncOfflineData = useCallback(async () => {
    if (!userId) return;
    const offline = localStorage.getItem('guitarpath_offline_state');
    if (!offline) return;
    try {
      const state = JSON.parse(offline);
      await saveProgress(state);
      console.log('Sync offline → Supabase OK');
    } catch (e) {
      console.error('Sync offline failed:', e);
    }
  }, [userId, saveProgress]);

  return { loadProgress, saveProgress, saveProgressDebounced, syncOfflineData };
}
