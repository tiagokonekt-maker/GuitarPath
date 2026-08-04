// Groply — store/placementEngine.js
// Test de placement adaptatif à l'inscription.
// Principe : réutiliser les quiz existants (déjà tagués courseId + lvl 1-3),
// sans inventer de nouveau contenu. Mécanique "en escalier global" :
//   1. Palier facile (lvl 1) sur les 4 modules testables, dans l'ordre.
//   2. Palier intermédiaire (lvl 2) sur les 4 modules.
//   3. Palier difficile (lvl 3) sur les 4 modules.
//   → 12 questions, une vraie montée en difficulté globale plutôt qu'un
//     pivot isolé par module : on réussit d'abord des choses simples avant
//     de tomber sur ce qu'on ne sait pas encore, jamais l'inverse.
// Le niveau d'un module = nombre de bonnes réponses sur ses 3 questions
// (0 à 3), pas un simple croisement de 2 réponses — plus robuste face à
// une réponse chanceuse ou une inattention isolée.
//
// Les codes A1-B2 ci-dessous sont une mécanique de calcul PUREMENT interne
// (comme un enum) — ils ne sont jamais affichés à l'utilisateur. L'écran de
// résultat utilise exclusivement les grades réels (store/grades.js), via
// startFromOverallTier() plus bas : aucune notation façon langues à l'écran.
//
// Le module Impro n'a aucun quiz dédié dans le contenu actuel — son niveau
// est donc déduit (moyenne) des 4 modules réellement testés, jamais inventé
// à partir de rien.

import { gradeForLevel } from "./grades.js";
import { totalXpForLevel } from "./leveling.js";

export const TESTABLE_MODULES = ["neck", "scales", "harmony", "rhythm"];

const TIER_ORDER = ["A1", "A2", "B1", "B2"];
export const TIER_VALUE = { A1: 1, A2: 2, B1: 3, B2: 4 };

// Réponse "je ne sais pas" : traitée comme une réponse fausse pour
// l'escalier de difficulté (on redescend), mais jamais affichée comme un
// échec — c'est un signal honnête, pas une erreur d'inattention.
export const DONT_KNOW = "__dont_know__";

// Niveau de départ maximal atteignable par le test — volontairement
// plafonné au seuil de "Chevalier des riffs" : Seigneur du solo et Star
// légendaire se gagnent en jouant dans l'app dans le temps, pas en
// 12 questions le jour de l'inscription.
const MAX_STARTING_LEVEL = 15;

/**
 * Convertit le score global (nombre de bonnes réponses sur les 12) en
 * niveau de départ réel + grade affiché — mapping CONTINU (niveau 1 à 15),
 * pas un classement en 4 paliers discrets collés aux seuils des grades.
 * Deux personnes avec un score proche démarrent à un niveau proche, pas
 * dans des paniers différents séparés par un saut de plusieurs niveaux ;
 * et une seule question qui bascule ne déplace le résultat que d'un
 * niveau, pas d'un grade entier — beaucoup moins sensible au hasard d'une
 * question isolée qu'un classement par paliers.
 */
export function startFromScore(totalCorrect, totalQuestions) {
  const ratio = totalQuestions > 0 ? totalCorrect / totalQuestions : 0;
  const level = Math.max(1, Math.min(MAX_STARTING_LEVEL,
    Math.round(1 + ratio * (MAX_STARTING_LEVEL - 1))
  ));
  const grade = gradeForLevel(level);
  return { grade, startXp: totalXpForLevel(level), level };
}

// Niveau neutre utilisé uniquement si le stock de questions venait à
// manquer pour un module (filet de sécurité, ne devrait pas arriver vu
// le volume actuel de quiz disponibles).
const FALLBACK_TIER = "A2";

function pickRandom(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

// 3 paliers de difficulté (facile, intermédiaire, difficile), chacun
// traversant les 4 modules testables dans le même ordre.
export const PLACEMENT_LEVELS = [1, 2, 3];
export const PLACEMENT_QUESTION_COUNT = TESTABLE_MODULES.length * PLACEMENT_LEVELS.length; // 12

/**
 * Construit la file des 12 questions du test, palier par palier : d'abord
 * les 4 questions faciles (une par module), puis les 4 intermédiaires,
 * puis les 4 difficiles. Donne une vraie sensation de montée en difficulté
 * globale — pas un aller-retour facile/difficile module par module.
 */
export function buildPlacementQueue() {
  const queue = [];
  for (const lvl of PLACEMENT_LEVELS) {
    for (const moduleId of TESTABLE_MODULES) {
      queue.push({ moduleId, lvl });
    }
  }
  return queue;
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

/**
 * Comme pickQuestion, mais pioche en priorité une question "manche
 * interactif" (type fretboard) si demandé et disponible — utilisé
 * uniquement pour la première question du palier facile (module Manche),
 * pour ouvrir le test sur quelque chose de concret ("trouve tous les Do
 * sur le manche") plutôt que directement un QCM de vocabulaire théorique.
 * Se replie sur pickQuestion si aucune question fretboard n'est dispo.
 */
export function pickPlacementQuestion(quizBank, moduleId, lvl, excludeIds, preferFretboard = false) {
  if (preferFretboard) {
    const fretPool = (quizBank || []).filter(q =>
      q.courseId === moduleId && q.lvl === lvl && q.type === "fretboard" && !excludeIds.has(q.id)
    );
    if (fretPool.length > 0) return { ...pickRandom(fretPool), moduleId };
  }
  const q = pickQuestion(quizBank, moduleId, lvl, excludeIds);
  return q ? { ...q, moduleId } : null;
}

/**
 * Niveau d'un module à partir du nombre de bonnes réponses sur ses 3
 * questions (facile/intermédiaire/difficile), de 0 à 3 — remplace l'ancien
 * calcul par pivot + question finale (2 questions, croisement binaire).
 * Plus robuste : une réponse chanceuse ou une inattention isolée ne
 * bascule plus le résultat d'un cran entier.
 */
export function computeModuleTier(correctCount) {
  const idx = Math.max(0, Math.min(TIER_ORDER.length - 1, correctCount));
  return TIER_ORDER[idx];
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
