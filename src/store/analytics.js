// Groply — analytics.js
// Tracking d'événements produit, écrit dans Supabase (table analytics_events).
// Aucune dépendance externe : pas de compte tiers à créer, tout reste dans
// ta propre base. Un sink alternatif (PostHog, etc.) pourra être branché
// plus tard en remplaçant uniquement `flush()`.
//
// ── Mise en place côté Supabase (à exécuter une fois, SQL Editor) ─────────
//
//   create table analytics_events (
//     id         uuid primary key default gen_random_uuid(),
//     user_id    uuid references auth.users(id),
//     event      text not null,
//     props      jsonb default '{}'::jsonb,
//     created_at timestamptz default now()
//   );
//
//   alter table analytics_events enable row level security;
//
//   -- Un utilisateur ne peut écrire que ses propres événements
//   create policy "insert own events" on analytics_events
//     for insert to authenticated
//     with check (auth.uid() = user_id);
//
//   -- Personne ne relit ses propres events depuis le client (dashboard = SQL Editor / Studio)
//   -- (pas de policy SELECT => lecture uniquement via le rôle service, donc via toi)
//
// ─────────────────────────────────────────────────────────────────────────

import { supabase } from "../supabase/supabaseClient.js";

const QUEUE_KEY = "groply_analytics_queue";
const FLUSH_INTERVAL_MS = 8000;
const MAX_BATCH = 25;

let userId = null;
let queue = [];
let flushTimer = null;
let started = false;

// ── Taxonomie des événements ────────────────────────────────────────────
// Garder cette liste à jour évite les événements "orphelins" mal nommés
// dispersés dans le code. Un event = un nom stable + des props libres.
export const EVENTS = {
  // Onboarding
  ONBOARDING_STARTED:   "onboarding_started",
  ONBOARDING_STEP_VIEW: "onboarding_step_view",
  ONBOARDING_STEP_BACK: "onboarding_step_back",
  ONBOARDING_COMPLETED: "onboarding_completed",
  ONBOARDING_SKIPPED:   "onboarding_skipped",

  // Navigation
  SCREEN_VIEW: "screen_view",
  APP_OPEN:    "app_open",

  // Auth
  SIGN_UP:  "sign_up",
  SIGN_IN:  "sign_in",
  SIGN_OUT: "sign_out",
};

// ── Correspondance action du reducer → nom d'événement propre ──────────
// Toute action non listée ici est quand même trackée sous son type brut
// (fallback), pour ne jamais perdre un signal silencieusement.
const ACTION_EVENT_MAP = {
  COMPLETE_LESSON:      "lesson_completed",
  COMPLETE_EXERCISE:    "exercise_completed",
  QUIZ_ANSWER:          "quiz_answered",
  REVIEW_SESSION_DONE:  "review_session_completed",
  QUIZ_SESSION_DONE:    "quiz_session_completed",
  DAILY_CHALLENGE_DONE: "daily_challenge_completed",
  PRACTICE_DONE:        "practice_session_completed",
  UNLOCK_BADGES:        "badge_unlocked",
  CLAIM_UNIT_BONUS:     "unit_bonus_claimed",
  SET_THEME:            "theme_changed",
  RESET:                "progress_reset",
};

// Actions trop fréquentes / peu informatives pour justifier une ligne
// analytics à chaque frappe (ex: sauvegarde de progression intermédiaire).
const IGNORED_ACTIONS = new Set([
  "SAVE_EXERCISE_PROGRESS",
  "ROTATE_DAILY",
  "MARK_STREAK",       // dérivé de app_open + date, pas un choix utilisateur
  "DISMISS_GROPI_TIP",
  "UPDATE_WEEKLY",
]);

// ── Cycle de vie ─────────────────────────────────────────────────────────
export function initAnalytics(currentUserId) {
  userId = currentUserId || null;
  if (started) return;
  started = true;

  loadQueueFromStorage();
  flushTimer = setInterval(flush, FLUSH_INTERVAL_MS);
  window.addEventListener("online", flush);
  window.addEventListener("beforeunload", persistQueueToStorage);
  document.addEventListener("visibilitychange", () => {
    if (document.visibilityState === "hidden") persistQueueToStorage();
  });
}

export function setAnalyticsUser(currentUserId) {
  userId = currentUserId || null;
}

// ── API publique ──────────────────────────────────────────────────────────
/** Track un événement libre (vues d'écran, étapes d'onboarding, etc.) */
export function track(event, props = {}) {
  if (!event) return;
  queue.push({
    user_id: userId,
    event,
    props,
    created_at: new Date().toISOString(),
  });
  if (queue.length >= MAX_BATCH) flush();
}

/**
 * Track une action de reducer. À appeler juste après avoir calculé le
 * nouvel état, dans le wrapper de dispatch de App.jsx :
 *
 *   const dispatch = useCallback((action) => {
 *     setState(prev => {
 *       const next = reducer(prev, action);
 *       trackAction(action, prev, next);
 *       return next;
 *     });
 *   }, []);
 */
export function trackAction(action, prevState, nextState) {
  if (!action?.type || IGNORED_ACTIONS.has(action.type)) return;
  const event = ACTION_EVENT_MAP[action.type] || action.type.toLowerCase();

  const props = { ...action };
  delete props.type;

  // Quelques dérivés utiles pour l'analyse, calculés une fois ici plutôt
  // que recalculés dans chaque dashboard.
  if (nextState && prevState) {
    const xpGained = (nextState.xp || 0) - (prevState.xp || 0);
    if (xpGained > 0) props.xp_gained = xpGained;
    if ((nextState.level || 0) > (prevState.level || 0)) props.level_up_to = nextState.level;
  }

  track(event, props);
}

// ── Envoi ────────────────────────────────────────────────────────────────
async function flush() {
  if (queue.length === 0) return;
  if (!navigator.onLine) { persistQueueToStorage(); return; }

  const batch = queue.splice(0, MAX_BATCH);
  try {
    const { error } = await supabase.from("analytics_events").insert(batch);
    if (error) throw error;
  } catch {
    // Échec réseau/RLS : on remet en file pour retenter plus tard,
    // sans bloquer l'expérience utilisateur (analytics = best-effort).
    queue = [...batch, ...queue];
    persistQueueToStorage();
  }
}

function persistQueueToStorage() {
  try {
    if (queue.length === 0) { localStorage.removeItem(QUEUE_KEY); return; }
    localStorage.setItem(QUEUE_KEY, JSON.stringify(queue.slice(0, 200)));
  } catch { /* stockage plein ou indisponible : on laisse tomber ces events */ }
}

function loadQueueFromStorage() {
  try {
    const raw = localStorage.getItem(QUEUE_KEY);
    if (raw) queue = [...JSON.parse(raw), ...queue];
    localStorage.removeItem(QUEUE_KEY);
  } catch { /* ignore */ }
}
