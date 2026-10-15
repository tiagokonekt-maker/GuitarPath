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

import { supabase } from "./supabase/supabaseClient.js";
import { ANALYTICS_QUEUE_KEY as QUEUE_KEY, estRejetDefinitif, evenementsDe } from "./store/compte.js";
import {
  nettoyerProps, nomEvenementValide,
  statistiquesDesactivees, enregistrerPreferenceStatistiques,
} from "./analyticsProps.js";

// Rétention : les événements sont supprimés en base après 13 mois par une
// tâche pg_cron (sql/03-limites-et-retention.sql), qui plafonne aussi la
// taille de `props` et le débit d'insertion par compte.

const FLUSH_INTERVAL_MS = 8000;
const MAX_BATCH = 25;

let userId = null;
let queue = [];
let flushTimer = null;
let started = false;

// ── Taxonomie des événements ────────────────────────────────────────────
// Garder cette liste à jour évite les événements "orphelins" mal nommés
// dispersés dans le code. Un event = un nom stable + quelques props
// primitives, filtrées par la liste blanche de analyticsProps.js.
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

  // Placement (émis par OnboardingScreen via la prop onEvent)
  PLACEMENT_STARTED:  "placement_test_started",
  PLACEMENT_ANSWERED: "placement_question_answered",
  PLACEMENT_MODULE:   "placement_module_result",
  PLACEMENT_DONE:     "placement_completed",

  // Contenu
  LESSON_OPENED:  "lesson_opened",
  BADGE_UNLOCKED: "badge_unlocked",
  AUDIO_UNLOCKED: "audio_unlocked",
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
  "JAM_PROGRES",       // compteur de temps : la séance est déjà tracée par PRACTICE_DONE
  "UNLOCK_BADGES",     // App.jsx émet déjà un badge_unlocked par badge, avec son id
]);

// ── Cycle de vie ─────────────────────────────────────────────────────────
// `beforeunload` n'est pas fiable sur iOS (l'événement n'est souvent jamais
// émis quand l'utilisateur revient à l'écran d'accueil). `pagehide` +
// `visibilitychange` couvrent les cas réels.
const onHidden = () => { if (document.visibilityState === "hidden") { persistQueueToStorage(); flush(); } };
const onPageHide = () => persistQueueToStorage();

export function initAnalytics(currentUserId) {
  setAnalyticsUser(currentUserId);
  if (started) return;
  started = true;

  loadQueueFromStorage();
  // Événements laissés par un autre compte (même appareil) : ils seraient
  // refusés par la RLS avec le jeton de celui-ci, et bloqueraient la file.
  queue = evenementsDe(queue, userId);
  flushTimer = setInterval(flush, FLUSH_INTERVAL_MS);
  window.addEventListener("online", flush);
  window.addEventListener("pagehide", onPageHide);
  document.addEventListener("visibilitychange", onHidden);
}

/** Arrête proprement : vide la file et retire les écouteurs. */
export function stopAnalytics() {
  if (!started) return;
  started = false;
  clearInterval(flushTimer);
  flushTimer = null;
  window.removeEventListener("online", flush);
  window.removeEventListener("pagehide", onPageHide);
  document.removeEventListener("visibilitychange", onHidden);
  persistQueueToStorage();
  userId = null;
}

export function setAnalyticsUser(currentUserId) {
  const nouveau = currentUserId || null;
  if (nouveau !== userId) queue = evenementsDe(queue, nouveau);
  userId = nouveau;
}

/** Vide la file (mémoire + stockage) : à la déconnexion ou au changement de compte. */
export function resetAnalytics() {
  queue = [];
  try { localStorage.removeItem(QUEUE_KEY); } catch { /* noop */ }
}

// ── API publique ──────────────────────────────────────────────────────────
/** Track un événement libre (vues d'écran, étapes d'onboarding, etc.) */
export function track(event, props = {}) {
  const nom = nomEvenementValide(event);
  if (!nom || collecteRefusee()) return;
  queue.push({
    user_id: userId,
    event: nom,
    // Minimisation : uniquement quelques primitives, jamais d'historique ni
    // de contenu de réponse (voir analyticsProps.js).
    props: nettoyerProps(nom, props),
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
  // prevState/nextState sont OPTIONNELS : le dispatch de App.jsx ne fait plus
  // d'effet de bord dans l'updater React (il pouvait être appelé deux fois),
  // donc il n'a pas les deux états sous la main au moment de l'appel.
  if (!action?.type || IGNORED_ACTIONS.has(action.type)) return;
  const event = ACTION_EVENT_MAP[action.type] || action.type.toLowerCase();

  // Copie brute, filtrée ensuite par track() → nettoyerProps().
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
  if (collecteRefusee()) { queue = []; return; }
  if (queue.length === 0) return;
  if (!navigator.onLine) { persistQueueToStorage(); return; }

  const batch = queue.splice(0, MAX_BATCH);
  try {
    const { error, status } = await supabase.from("analytics_events").insert(batch);
    // Refus définitif (RLS, schéma…) : retenter ne ferait que bloquer la file.
    if (error && estRejetDefinitif(status)) return;
    if (error) throw error;
  } catch {
    // Échec réseau ou refus temporaire : on remet en file pour retenter plus tard,
    // sans bloquer l'expérience utilisateur (analytics = best-effort).
    // Sauf si l'utilisateur s'est opposé entre-temps : on abandonne le lot.
    if (collecteRefusee()) { queue = []; return; }
    queue = evenementsDe([...batch, ...queue], userId);
    persistQueueToStorage();
  }
}

function persistQueueToStorage() {
  try {
    if (queue.length === 0 || collecteRefusee()) { localStorage.removeItem(QUEUE_KEY); return; }
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


// ── Façade ────────────────────────────────────────────────────────────────
// Une seule surface d'appel pour l'app, ce qui permet de brancher un autre
// sink plus tard sans toucher aux appelants.
//
// `Do Not Track` est respecté : c'est de l'analytique première partie, sans
// cookie tiers ni traçage publicitaire, mais un signal explicite de l'agent
// utilisateur mérite d'être suivi.
const dntActif = () => {
  try {
    return navigator.doNotTrack === "1" || window.doNotTrack === "1" ||
           navigator.globalPrivacyControl === true;
  } catch { return false; }
};

// Opposition dans l'app (Réglages → Statistiques d'utilisation). Copie en
// mémoire en plus du localStorage : si le stockage est indisponible (navigation
// privée stricte), le choix tient au moins jusqu'à la fermeture de l'onglet.
let refusMemoire = false;
let uidCourant = null;   // dernier compte passé à analytics.start()
function collecteRefusee() {
  if (refusMemoire) return true;
  try { return statistiquesDesactivees(localStorage); } catch { return false; }
}

/** État affiché par le réglage : vrai si des statistiques peuvent être envoyées. */
export function statistiquesActivees() { return !collecteRefusee(); }
/** Vrai si le navigateur envoie déjà Do Not Track / GPC (le réglage est alors sans effet). */
export function signalNavigateurRefus() { return dntActif(); }

/**
 * Active ou désactive la collecte sur cet appareil. À la désactivation, la
 * file (mémoire + stockage) est vidée : rien de ce qui était en attente ne
 * part. La préférence est une donnée d'appareil, hors de la purge par compte.
 */
export function definirStatistiquesActivees(actif) {
  refusMemoire = !actif;
  enregistrerPreferenceStatistiques(localStorage, actif);
  if (!actif) {
    stopAnalytics();
    resetAnalytics();
  } else if (uidCourant && !dntActif()) {
    initAnalytics(uidCourant);
  }
}

export const analytics = {
  start(uid) {
    uidCourant = uid || null;
    if (dntActif() || collecteRefusee()) return;
    initAnalytics(uid);
  },
  stop()     { uidCourant = null; stopAnalytics(); },
  reset()    { resetAnalytics(); },
  track(event, props) { if (!started) return; track(event, props); },
  trackAction(action)  { if (!started) return; trackAction(action); },
};
