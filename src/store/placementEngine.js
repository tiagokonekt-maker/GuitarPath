// Groply — store/placementEngine.js
// Test de placement à l'inscription.
//
// ── Ce qui change (audit §7.2, §7.3, §7.4) ────────────────────────────────
//
// 1. LE TEST N'EST PLUS DÉCRIT COMME « ADAPTATIF ». Il ne l'était pas :
//    buildPlacementQueue() renvoyait une file FIXE, sans aucun branchement
//    sur les réponses. C'est un test à forme fixe, et c'est très bien — il
//    fallait juste arrêter de le documenter autrement. Le nom des fonctions
//    et les commentaires disent maintenant ce que le code fait.
//
// 2. LES MODULES TESTÉS SONT DÉDUITS DU CONTENU RÉEL. L'impro était exclue
//    en dur, parce qu'aucune question ne portait `courseId: "impro"` (les 15
//    questions q-impro-* étaient taguées « harmony »). Une fois le contenu
//    retagué, l'impro entre automatiquement dans le test : c'est l'objectif
//    n°1 du produit, il ne pouvait pas rester le seul module non évalué.
//    Si un module n'a pas assez de questions, il est écarté proprement au
//    lieu de produire des trous dans la file.
//
// 3. L'XP DE DÉPART EST FORTEMENT RÉDUITE, ET REMPLACÉE PAR DU DÉBLOCAGE.
//    Avant : jusqu'à 6 650 XP pour 12 QCM, soit la moitié de toute l'XP du
//    contenu — pendant que le Parcours restait verrouillé au palier 1.
//    Grade avancé, contenu de débutant : promesse non tenue.
//    Maintenant : plafond au niveau 8 (~1 680 XP, ~13 % du contenu), et le
//    résultat ouvre réellement des paliers via pathEngine (headstart).

import { gradeForLevel } from "./grades.js";
import { totalXpForLevel } from "./leveling.js";

/** Modules candidats au test, dans l'ordre de passage. */
export const TESTABLE_MODULES = ["neck", "scales", "harmony", "rhythm", "impro"];

const TIER_ORDER = ["A1", "A2", "B1", "B2"];
export const TIER_VALUE = { A1: 1, A2: 2, B1: 3, B2: 4 };

/**
 * Réponse « je ne sais pas » : comptée comme fausse pour le calcul du
 * niveau, mais jamais présentée comme un échec — c'est un signal honnête.
 */
export const DONT_KNOW = "__dont_know__";

/**
 * Niveau de départ maximal atteignable par le test.
 * Volontairement bas : 12 questions renseignent sur ce qu'on SAIT, pas sur
 * ce qu'on sait FAIRE avec une guitare dans les mains. Les grades élevés se
 * gagnent en jouant dans l'app.
 */
export const MAX_STARTING_LEVEL = 8;

export const PLACEMENT_LEVELS = [1, 2, 3];

const FALLBACK_TIER = "A2";

function pickRandom(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

const usableQuestions = (quizBank, moduleId, lvl) =>
  (quizBank || []).filter(q =>
    q.courseId === moduleId && q.lvl === lvl && Array.isArray(q.o) && q.o.length >= 2
  );

/**
 * Modules réellement testables avec le contenu fourni : il faut au moins
 * une question par palier de difficulté, sinon le résultat du module serait
 * calculé sur moins de 3 réponses et ne voudrait rien dire.
 */
export function availableModules(quizBank) {
  if (!quizBank || quizBank.length === 0) return [...TESTABLE_MODULES];
  return TESTABLE_MODULES.filter(m =>
    PLACEMENT_LEVELS.every(lvl => usableQuestions(quizBank, m, lvl).length > 0)
  );
}

/**
 * File du test, palier par palier : d'abord toutes les questions faciles
 * (une par module), puis les intermédiaires, puis les difficiles. Montée en
 * difficulté globale, pas un aller-retour module par module.
 */
export function buildPlacementQueue(quizBank = null) {
  const modules = quizBank ? availableModules(quizBank) : [...TESTABLE_MODULES];
  const queue = [];
  for (const lvl of PLACEMENT_LEVELS) {
    for (const moduleId of modules) queue.push({ moduleId, lvl });
  }
  return queue;
}

/** Nombre de questions de la file (dépend du contenu disponible). */
export function placementQuestionCount(quizBank = null) {
  return buildPlacementQueue(quizBank).length;
}
/** Valeur historique, conservée pour les imports existants. */
export const PLACEMENT_QUESTION_COUNT = TESTABLE_MODULES.length * PLACEMENT_LEVELS.length;

/** Question QCM standard non encore utilisée, pour un module et un palier. */
export function pickQuestion(quizBank, moduleId, lvl, excludeIds) {
  const pool = usableQuestions(quizBank, moduleId, lvl)
    .filter(q => q.type !== "fretboard" && !excludeIds.has(q.id));
  return pool.length === 0 ? null : pickRandom(pool);
}

/**
 * Comme pickQuestion, mais privilégie une question « manche interactif »
 * si demandé et disponible — pour ouvrir le test sur du concret plutôt que
 * sur un QCM de vocabulaire.
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
 * Score global → niveau de départ + grade affiché. Mapping CONTINU : deux
 * personnes avec un score proche démarrent à un niveau proche, et une seule
 * question qui bascule ne déplace le résultat que d'un niveau.
 */
export function startFromScore(totalCorrect, totalQuestions) {
  const answered = Math.max(1, Number(totalQuestions) || 1);
  const ratio = Math.max(0, Math.min(1, (Number(totalCorrect) || 0) / answered));
  const level = Math.max(1, Math.min(MAX_STARTING_LEVEL,
    Math.round(1 + ratio * (MAX_STARTING_LEVEL - 1))
  ));
  return { grade: gradeForLevel(level), startXp: totalXpForLevel(level), level, startLevel: level };
}

/** Niveau d'un module = nombre de bonnes réponses sur ses 3 questions. */
export function computeModuleTier(correctCount) {
  const idx = Math.max(0, Math.min(TIER_ORDER.length - 1, Number(correctCount) || 0));
  return TIER_ORDER[idx];
}

const averageTier = (skillLevels, modules) => {
  const values = modules.map(m => TIER_VALUE[skillLevels?.[m]]).filter(Boolean);
  if (values.length === 0) return FALLBACK_TIER;
  const avg = values.reduce((a, b) => a + b, 0) / values.length;
  return TIER_ORDER[Math.max(0, Math.min(3, Math.round(avg) - 1))];
};

/**
 * Niveau d'un module non testé (faute de contenu) : moyenne des modules
 * réellement testés. Jamais inventé à partir de rien.
 */
export function inferMissingTier(skillLevels, testedModules = TESTABLE_MODULES) {
  return averageTier(skillLevels, testedModules);
}
/** Alias historique (l'impro était le seul cas). */
export const inferImproTier = (skillLevels) =>
  averageTier(skillLevels, ["neck", "scales", "harmony", "rhythm"]);

/** Titre global affiché : moyenne arrondie des modules testés. */
export function computeOverallTier(skillLevels, testedModules = TESTABLE_MODULES) {
  return averageTier(skillLevels, testedModules);
}

/** Module le plus faible parmi ceux réellement testés. */
export function weakestModule(skillLevels, testedModules = TESTABLE_MODULES) {
  let weakest = null, weakestVal = 5;
  for (const m of testedModules) {
    const v = TIER_VALUE[skillLevels?.[m]];
    if (v && v < weakestVal) { weakestVal = v; weakest = m; }
  }
  return weakest;
}

/**
 * Taille de la session du jour selon le temps déclaré à l'onboarding.
 * C'est le premier usage réel de `timePerWeek`, qui n'était jusqu'ici
 * stocké que pour rien.
 */
export const DAILY_TARGET = { short: 6, medium: 12, long: 18 };
export const dailyTargetFromTime = (timePerWeek) => DAILY_TARGET[timePerWeek] ?? 12;
