// ═══════════════════════════════════════════════════════════════════════════
// Groply — analyticsProps.js
// Minimisation des événements analytiques (RGPD art. 5.1.c) et préférence
// d'opposition. Fonctions pures, sans dépendance à Supabase ni au DOM, pour
// être testables sous Node (test/analytics-props.test.mjs) — analytics.js,
// lui, importe le client Supabase, qui exige `import.meta.env`.
//
// ── Pourquoi ce module ────────────────────────────────────────────────────
// `trackAction` recopiait l'action ENTIÈRE du reducer dans `props` :
// REVIEW_ANSWER et EXERCISE_MASTERY_ANSWER transportent tout l'historique de
// révision (plusieurs dizaines de Ko… à chaque réponse), SUBMIT_UNIT_CHECK la
// liste des questions ratées, COMPLETE_ONBOARDING le profil de niveau
// complet. Rien de tout ça ne sert à la mesure d'audience, et la politique de
// confidentialité promet « des noms d'événements et quelques identifiants
// techniques » : le code doit tenir cette promesse, pas la base.
// ═══════════════════════════════════════════════════════════════════════════

/** Préférence d'APPAREIL (pas une donnée de compte) : survit à la purge. */
export const ANALYTICS_OFF_KEY = "groply_analytics_off";

export const MAX_PROPS = 12;
export const MAX_LONGUEUR_TEXTE = 80;
export const MAX_LONGUEUR_EVENEMENT = 120;   // = contrainte analytics_event_court

// Dérivés calculés par trackAction, admis pour toute action.
const CLES_COMMUNES = ["xp_gained", "level_up_to"];

/**
 * Liste blanche par événement : seules ces clés sont conservées. Un
 * événement absent de la liste garde ses valeurs primitives (filet de
 * sécurité pour une action ajoutée plus tard), dans la limite de MAX_PROPS.
 * Une liste vide = le nom de l'événement suffit.
 */
export const PROPS_AUTORISEES = {
  // Navigation / auth
  screen_view:                 ["screen"],
  app_open:                    [],
  // Onboarding & placement (émis par OnboardingScreen)
  onboarding_step_view:        ["step"],
  onboarding_step_back:        ["step"],
  onboarding_completed:        ["goal", "preferredModule", "timePerWeek", "overallTier", "weakestModule", "startLevel", "skipped", "experience"],
  complete_onboarding:         ["goal", "preferredModule", "timePerWeek", "overallTier", "weakestModule", "startLevel", "skipped", "experience"],
  placement_question_answered: ["module", "questionId", "correct", "fretboard", "dontKnow"],
  placement_module_result:     ["module", "tier", "correctCount"],
  placement_completed:         ["overallTier", "weakestModule"],
  // Contenu (actions du reducer, après ACTION_EVENT_MAP)
  lesson_completed:            ["id"],
  exercise_completed:          ["id", "xp"],
  quiz_answered:               ["id", "correct", "xp"],
  review_answer:               ["questionId", "correct", "xp"],
  exercise_mastery_answer:     [],                       // l'historique n'est jamais envoyé
  review_session_completed:    ["xp", "score"],
  quiz_session_completed:      ["xp", "score"],          // `id`/`title` = titre libre : non
  daily_challenge_completed:   [],
  practice_session_completed:  ["minutes"],
  submit_unit_check:           ["unitId", "pct", "passPct"],
  unit_bonus_claimed:          ["unitId", "xp"],
  badge_unlocked:              ["badge"],
  theme_changed:               ["theme"],
  add_xp:                      ["xp"],
  progress_reset:              [],
};

const primitiveAdmise = (v) =>
  typeof v === "boolean" ||
  (typeof v === "number" && Number.isFinite(v)) ||
  (typeof v === "string" && v.length <= MAX_LONGUEUR_TEXTE);

/** Nom d'événement exploitable, ou null. */
export function nomEvenementValide(event) {
  return typeof event === "string" && event.length > 0 && event.length <= MAX_LONGUEUR_EVENEMENT
    ? event : null;
}

/**
 * Ne garde que des primitives courtes : chaîne ≤ 80 caractères (une chaîne
 * plus longue est écartée, pas tronquée — c'est presque toujours du texte
 * libre), nombre fini, booléen. Objets, tableaux, null, fonctions : écartés.
 * Au plus MAX_PROPS clés, et seulement celles de la liste blanche quand
 * l'événement en a une.
 */
export function nettoyerProps(event, props) {
  const sortie = {};
  if (!props || typeof props !== "object" || Array.isArray(props)) return sortie;
  const liste = PROPS_AUTORISEES[event];
  const admises = liste ? new Set([...liste, ...CLES_COMMUNES]) : null;
  let n = 0;
  for (const [cle, valeur] of Object.entries(props)) {
    if (n >= MAX_PROPS) break;
    if (admises && !admises.has(cle)) continue;
    if (cle.length > 40 || !primitiveAdmise(valeur)) continue;
    sortie[cle] = valeur;
    n++;
  }
  return sortie;
}

// ── Opposition (Réglages → Statistiques d'utilisation) ───────────────────
/** Vrai si l'utilisateur a désactivé les statistiques sur cet appareil. */
export function statistiquesDesactivees(storage) {
  try { return storage?.getItem(ANALYTICS_OFF_KEY) === "1"; } catch { return false; }
}

export function enregistrerPreferenceStatistiques(storage, actif) {
  try {
    if (actif) storage.removeItem(ANALYTICS_OFF_KEY);
    else storage.setItem(ANALYTICS_OFF_KEY, "1");
  } catch { /* stockage indisponible : la préférence ne tiendra que pour la session */ }
}
