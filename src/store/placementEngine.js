// Groply — store/placementEngine.js
// Test de placement adaptatif à l'inscription.
// Principe : réutiliser les quiz existants (déjà tagués courseId + lvl 1-3),
// sans inventer de nouveau contenu. Mécanique "en escalier" :
//   1. Question pivot (lvl 2) sur le module.
//   2. Bonne réponse → question lvl 3 (teste le haut) ; mauvaise → lvl 1 (teste le bas).
//   3. Le croisement des deux réponses donne le niveau du module.
//
// Les codes A1-B2 ci-dessous sont une mécanique de calcul PUREMENT interne
// (comme un enum) — ils ne sont jamais affichés à l'utilisateur. L'écran de
// résultat utilise exclusivement les grades réels (store/grades.js), via
// startFromOverallTier() plus bas : aucune notation façon langues à l'écran.
//
// Le module Impro n'a aucun quiz dédié dans le contenu actuel — son niveau
// est donc déduit (moyenne) des 4 modules réellement testés, jamais inventé
// à partir de rien.

import { GRADES } from "./grades.js";
import { totalXpForLevel } from "./leveling.js";

export const TESTABLE_MODULES = ["neck", "scales", "harmony", "rhythm"];

const TIER_ORDER = ["A1", "A2", "B1", "B2"];
export const TIER_VALUE = { A1: 1, A2: 2, B1: 3, B2: 4 };

// Réponse "je ne sais pas" : traitée comme une réponse fausse pour
// l'escalier de difficulté (on redescend), mais jamais affichée comme un
// échec — c'est un signal honnête, pas une erreur d'inattention.
export const DONT_KNOW = "__dont_know__";

// Pont test de placement → grade réel affiché au reveal. Volontairement
// plafonné à "chevalier_riffs" : Seigneur du solo et Star légendaire se
// gagnent en jouant dans l'app dans le temps, pas en 8 questions le jour
// de l'inscription.
const STARTING_GRADE_BY_TIER = {
  A1: "bebe_rockeur",
  A2: "gratteur_dimanche",
  B1: "campeur_feu_camp",
  B2: "chevalier_riffs",
};

/**
 * Convertit le résultat global du test en grade réel + XP de départ
 * cohérent avec la courbe de niveaux existante (leveling.js) — pas un
 * chiffre inventé à part.
 */
export function startFromOverallTier(overallTier) {
  const gradeId = STARTING_GRADE_BY_TIER[overallTier] || "bebe_rockeur";
  const grade = GRADES.find(g => g.id === gradeId) || GRADES[0];
  return { grade, startXp: totalXpForLevel(grade.minLevel) };
}

// Niveau neutre utilisé uniquement si le stock de questions venait à
// manquer pour un module (filet de sécurité, ne devrait pas arriver vu
// le volume actuel de quiz disponibles).
const FALLBACK_TIER = "A2";

function pickRandom(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

/**
 * Choisit une question QCM standard (exclut les quiz "fretboard interactif",
 * qui ont besoin d'un composant à part) non encore utilisée, pour un module
 * et un niveau de difficulté donnés.
 */
export function pickQuestion(quizBank, moduleId, lvl, excludeIds) {
  const pool = (quizBank || []).filter(q =>
    q.courseId === moduleId &&
    q.lvl === lvl &&
    q.type !== "fretboard" &&
    Array.isArray(q.o) &&
    !excludeIds.has(q.id)
  );
  if (pool.length === 0) return null;
  return pickRandom(pool);
}

/** Croise les 2 réponses (pivot lvl 2, puis finale lvl 1 ou 3) → niveau du module. */
export function computeModuleTier(pivotCorrect, finalCorrect) {
  if (!pivotCorrect && !finalCorrect) return "A1";
  if (!pivotCorrect && finalCorrect)  return "A2";
  if (pivotCorrect && !finalCorrect)  return "B1";
  return "B2";
}

/** Impro : pas de quiz dédié → moyenne (arrondie) des modules réellement testés. */
export function inferImproTier(skillLevels) {
  const values = TESTABLE_MODULES
    .map(m => TIER_VALUE[skillLevels[m]])
    .filter(Boolean);
  if (values.length === 0) return FALLBACK_TIER;
  const avg = values.reduce((a, b) => a + b, 0) / values.length;
  const idx = Math.max(0, Math.min(3, Math.round(avg) - 1));
  return TIER_ORDER[idx];
}

/**
 * Titre global affiché sur l'écran de résultat : moyenne arrondie des
 * 4 modules testés (garde le côté "reveal" motivant), PAS le plus faible —
 * le module le plus faible est signalé séparément via weakestModule(),
 * pour que Gropi puisse insister dessus sans plomber le résultat global.
 */
export function computeOverallTier(skillLevels) {
  const values = TESTABLE_MODULES
    .map(m => TIER_VALUE[skillLevels[m]])
    .filter(Boolean);
  if (values.length === 0) return FALLBACK_TIER;
  const avg = values.reduce((a, b) => a + b, 0) / values.length;
  const idx = Math.max(0, Math.min(3, Math.round(avg) - 1));
  return TIER_ORDER[idx];
}

/** Module le plus faible parmi les modules réellement testés (pour l'insistance de Gropi). */
export function weakestModule(skillLevels) {
  let weakest = null, weakestVal = 5;
  for (const m of TESTABLE_MODULES) {
    const v = TIER_VALUE[skillLevels[m]];
    if (v && v < weakestVal) { weakestVal = v; weakest = m; }
  }
  return weakest;
}
