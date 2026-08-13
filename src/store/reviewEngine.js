// Groply — store/reviewEngine.js
// Moteur de révision espacée.
//
// ── Ce qui change (audit §7.6) ────────────────────────────────────────────
// L'ancienne version était un « SM-2 simplifié » à intervalles FIXES
// [0, 1, 4, 10, 30] jours indexés sur un compteur de succès consécutifs.
// Trois manques :
//   • aucun facteur de facilité par item : une question difficile et une
//     question évidente suivaient exactement la même trajectoire ;
//   • réponse binaire : dans SM-2, la qualité du rappel est graduée, ce qui
//     est précisément l'information qui pilote l'espacement ;
//   • aucun plafond de nouveaux items par jour : avec 178 items éligibles,
//     le compteur « à revoir » était structurellement saturé, d'où le
//     `Math.min(…, 99)` d'affichage. Un badge « 99+ » permanent n'est pas
//     un signal, c'est du bruit.
//
// Cette version ajoute :
//   • un `ease` par item (1.3 → 2.7), ajusté à chaque réponse ;
//   • une qualité de réponse graduée : "again" | "hard" | "good" | "easy"
//     (l'ancien booléen reste accepté, pour ne casser aucun appelant) ;
//   • un intervalle calculé (et non tabulé), plafonné à 180 jours ;
//   • la séparation stricte « items DUS » / « items NOUVEAUX », avec un
//     plafond quotidien de nouveaux items.
//
// L'historique reste dans le même format de clés (reviewHistory pour le
// quiz, exerciseHistory pour les exercices) : les données déjà accumulées
// continuent d'être lues, les champs nouveaux (`ease`, `interval`, `due`)
// sont simplement absents au début et recalculés à la première réponse.

import { todayStr, daysBetween, dayStr } from "./dates.js";

export const EASE_MIN     = 1.3;
export const EASE_MAX     = 2.7;
export const EASE_START   = 2.2;
export const INTERVAL_MAX = 180;

/** Qualités de réponse acceptées, du plus faible au plus fort. */
export const QUALITY = { AGAIN: "again", HARD: "hard", GOOD: "good", EASY: "easy" };

/** Convertit un ancien booléen `correct` en qualité graduée. */
export const qualityFromBool = (correct) => (correct ? QUALITY.GOOD : QUALITY.AGAIN);

/** Ajustement du facteur de facilité selon la qualité de la réponse. */
const EASE_DELTA = { again: -0.30, hard: -0.15, good: 0, easy: +0.15 };

const clampEase = (e) => Math.max(EASE_MIN, Math.min(EASE_MAX, Number(e) || EASE_START));

/**
 * Prochain intervalle en jours, à partir de l'état précédent et de la
 * qualité de la réponse. Formule SM-2 : interval × ease, avec des paliers
 * fixes pour les deux premières réussites (sinon les premiers intervalles
 * sont trop longs et le premier oubli passe inaperçu).
 */
export function nextInterval(prev, quality) {
  const streak = prev?.streak || 0;
  const ease = clampEase(prev?.ease);
  const interval = prev?.interval || 0;

  if (quality === QUALITY.AGAIN) return 0;          // à revoir dans la journée
  if (streak === 0) return quality === QUALITY.EASY ? 2 : 1;
  if (streak === 1) return quality === QUALITY.HARD ? 2 : quality === QUALITY.EASY ? 6 : 4;

  const factor = quality === QUALITY.HARD ? 1.2 : quality === QUALITY.EASY ? ease * 1.3 : ease;
  return Math.min(INTERVAL_MAX, Math.max(1, Math.round((interval || 4) * factor)));
}

/**
 * Score de priorité. Générique : ne dépend que d'une clé et d'un objet
 * d'historique, jamais du type d'item (quiz ou exercice).
 *
 * Convention : 0 = pas encore dû, > 0 = à revoir, et un item JAMAIS VU
 * renvoie désormais `NEW_SCORE` — une valeur repérable, pour pouvoir le
 * compter séparément au lieu de le noyer dans les « à revoir ».
 */
export const NEW_SCORE = -1;

export function getPriorityScore(itemId, history, completedLessons, today = todayStr()) {
  const h = history?.[itemId];
  if (!h) return NEW_SCORE;                        // jamais vu → pool « nouveaux »

  const { attempts = 0, successes = 0, lastSeen = "", streak = 0 } = h;
  const interval = h.interval != null ? h.interval : [0, 1, 4, 10, 30][Math.min(streak, 4)];
  const daysSince = lastSeen ? (daysBetween(lastSeen, today) ?? 999) : 999;

  if (daysSince < interval && streak > 0) return 0; // pas encore dû

  const successRate = attempts > 0 ? successes / attempts : 0;
  const failurePriority = (1 - successRate) * 50;
  const overdue = Math.min((daysSince - interval) * 3, 30);   // retard, pas juste ancienneté
  const neverSucceeded = successes === 0 && attempts > 0 ? 20 : 0;
  const hardItem = clampEase(h.ease) <= 1.6 ? 10 : 0;         // item difficile → revient plus vite

  return Math.max(1, Math.round(failurePriority + overdue + neverSucceeded + hardItem));
}

/** Un item est-il « dû » (déjà vu, et l'intervalle est écoulé) ? */
export const isDue = (itemId, history, today = todayStr()) =>
  getPriorityScore(itemId, history, null, today) > 0;

/** Un item est-il « nouveau » (jamais présenté) ? */
export const isNew = (itemId, history) => !history?.[itemId];

// ─────────────────────────────────────────────────────────────────────────
// FILTRE D'ÉLIGIBILITÉ
// Une question de quiz porte lessonId/courseId ; un exercice porte
// courseLink/mod. On accepte les deux conventions.
// ─────────────────────────────────────────────────────────────────────────
export function isEligible(item, completedLessons) {
  const lessonId = item.lessonId ?? item.courseLink ?? null;
  const courseId = item.courseId ?? item.mod ?? null;

  if (lessonId && !completedLessons?.[lessonId]) return false;
  if (!lessonId && courseId) {
    const coursePrefix = courseId + "-";
    const hasCourseLesson = Object.keys(completedLessons || {}).some(id => id.startsWith(coursePrefix));
    if (!hasCourseLesson) return false;
  }
  return true;
}

/** Combien de nouveaux items par session, selon le temps disponible déclaré. */
export const NEW_PER_SESSION = { short: 3, medium: 5, long: 8 };
export const newItemsQuota = (timePerWeek) => NEW_PER_SESSION[timePerWeek] ?? 5;

// ─────────────────────────────────────────────────────────────────────────
// CONSTRUCTION DE LA SESSION (quiz)
// ─────────────────────────────────────────────────────────────────────────
export function buildReviewSession(allQuestions, reviewHistory, completedLessons, options = {}) {
  const {
    targetCount = 12,
    maxFretboard = 5,
    today = todayStr(),
    maxNew = 5,               // plafond de NOUVEAUX items dans la session
    lookaheadQuestions = null,
  } = options;

  const eligible = (allQuestions || []).filter(q => isEligible(q, completedLessons));
  if (eligible.length === 0) return { questions: [], reason: "no_lessons_completed", stats: emptyStats() };

  const scored = [], fresh = [];
  for (const q of eligible) {
    const score = getPriorityScore(q.id, reviewHistory, completedLessons, today);
    if (score === NEW_SCORE) fresh.push(q);
    else if (score > 0) scored.push({ question: q, score });
  }

  // Tri par priorité, ordre aléatoire entre items de score égal — sans ce
  // départage, deux sessions consécutives servent la même suite.
  scored.sort((a, b) => (b.score - a.score) || (Math.random() - 0.5));

  const session = [];
  let fretboardCount = 0;
  const canAdd = (q) => {
    if (session.length >= targetCount) return false;
    const isFret = q.type === "fretboard";
    if (isFret) {
      if (fretboardCount >= maxFretboard) return false;
      const lastTwo = session.slice(-2);
      if (lastTwo.length === 2 && lastTwo.every(x => x.type === "fretboard")) return false;
    }
    if (session.some(x => x.id === q.id)) return false;
    return true;
  };
  const add = (q) => { session.push(q); if (q.type === "fretboard") fretboardCount++; };

  // 1. Les items DUS d'abord — c'est la dette de mémoire, elle passe avant
  //    toute nouveauté. Un maximum de 70 % de la session leur est réservé
  //    pour ne jamais bloquer totalement la découverte.
  const dueBudget = Math.max(1, Math.floor(targetCount * 0.7));
  for (const { question } of scored) {
    if (session.length >= dueBudget) break;
    if (canAdd(question)) add(question);
  }

  // 2. Les NOUVEAUX, plafonnés.
  let added = 0;
  for (const q of fresh) {
    if (added >= maxNew) break;
    if (canAdd(q)) { add(q); added++; }
  }

  // 3. Reste des dus, si la place le permet.
  for (const { question } of scored) {
    if (session.length >= targetCount) break;
    if (canAdd(question)) add(question);
  }

  // 4. Reste des nouveaux (le plafond ne doit pas laisser une session vide).
  for (const q of fresh) {
    if (session.length >= targetCount) break;
    if (canAdd(q)) add(q);
  }

  // 5. Items pas encore dus, du plus anciennement vu au plus récent.
  if (session.length < targetCount) {
    const notDue = eligible
      .filter(q => !session.some(s => s.id === q.id))
      .map(q => ({ q, lastSeen: reviewHistory?.[q.id]?.lastSeen || "2000-01-01" }))
      .sort((a, b) => a.lastSeen.localeCompare(b.lastSeen));
    for (const { q } of notDue) { if (!canAdd(q)) break; add(q); }
  }

  // 6. Contenu légèrement en avance, borné, fourni par l'appelant.
  if (session.length < targetCount && Array.isArray(lookaheadQuestions)) {
    for (const q of lookaheadQuestions) { if (!canAdd(q)) continue; add(q); }
  }

  return {
    questions: session,
    reason: scored.length === 0 && fresh.length === 0 ? "all_recent" : "normal",
    stats: {
      total: session.length,
      fretboard: fretboardCount,
      mcq: session.length - fretboardCount,
      dueCount: scored.length,
      newCount: fresh.length,
      newInSession: session.filter(q => isNew(q.id, reviewHistory)).length,
    },
  };
}

const emptyStats = () => ({ total: 0, fretboard: 0, mcq: 0, dueCount: 0, newCount: 0, newInSession: 0 });

// ─────────────────────────────────────────────────────────────────────────
// SESSION UNIFIÉE (quiz + exercices)
// ─────────────────────────────────────────────────────────────────────────
export function buildMasterySession(pools, completedLessons, options = {}) {
  const {
    targetCount = 8,
    maxSameTypeConsecutive = 2,
    today = todayStr(),
    maxNew = 4,
  } = options;

  const due = [], fresh = [];
  for (const { type, items, history } of pools || []) {
    for (const item of items || []) {
      if (!isEligible(item, completedLessons)) continue;
      const score = getPriorityScore(item.id, history, completedLessons, today);
      if (score === NEW_SCORE) fresh.push({ type, item, history, score: 0 });
      else if (score > 0) due.push({ type, item, history, score });
    }
  }
  if (due.length === 0 && fresh.length === 0) {
    return { session: [], reason: "no_lessons_completed" };
  }
  due.sort((a, b) => (b.score - a.score) || (Math.random() - 0.5));

  const session = [];
  const canAdd = (x) => {
    if (session.length >= targetCount) return false;
    if (session.some(s => s.item.id === x.item.id && s.type === x.type)) return false;
    const lastFew = session.slice(-maxSameTypeConsecutive);
    return !(lastFew.length === maxSameTypeConsecutive && lastFew.every(s => s.type === x.type));
  };
  const add = (x) => session.push({ type: x.type, item: x.item });

  for (const x of due)   { if (canAdd(x)) add(x); }
  let added = 0;
  for (const x of fresh) { if (added < maxNew && canAdd(x)) { add(x); added++; } }
  for (const x of [...due, ...fresh]) { if (canAdd(x)) add(x); }

  return { session, reason: due.length === 0 ? "all_recent" : "normal" };
}

// ─────────────────────────────────────────────────────────────────────────
// MISE À JOUR DE L'HISTORIQUE après une réponse
// Signature rétrocompatible : `correct` accepte un booléen (ancien appel)
// ou une qualité graduée ("again" | "hard" | "good" | "easy").
// ─────────────────────────────────────────────────────────────────────────
export function updateReviewHistory(history, itemId, correct, today = todayStr()) {
  const quality = typeof correct === "string" ? correct : qualityFromBool(correct);
  const ok = quality !== QUALITY.AGAIN;
  const prev = history?.[itemId] || { attempts: 0, successes: 0, streak: 0, lastSeen: "", ease: EASE_START, interval: 0 };

  const ease = clampEase((prev.ease ?? EASE_START) + (EASE_DELTA[quality] ?? 0));
  const streak = ok ? (prev.streak || 0) + 1 : 0;
  const interval = nextInterval({ ...prev, streak: prev.streak || 0 }, quality);

  return {
    ...history,
    [itemId]: {
      attempts: (prev.attempts || 0) + 1,
      successes: (prev.successes || 0) + (ok ? 1 : 0),
      streak,
      lastSeen: today,
      ease,
      interval,
      due: interval > 0 ? dayStr(new Date(new Date(`${today}T12:00:00`).getTime() + interval * 86400000)) : today,
      quality,
    },
  };
}

// ─────────────────────────────────────────────────────────────────────────
// STATS POUR L'AFFICHAGE
// « à revoir » et « nouveaux » sont désormais deux nombres distincts : le
// premier est une dette qu'on peut solder, le second un stock qui grandit
// avec le contenu. Les mélanger produisait un « 99+ » permanent.
// ─────────────────────────────────────────────────────────────────────────
export function getReviewStats(allQuestions, reviewHistory, completedLessons) {
  const today = todayStr();
  const eligible = (allQuestions || []).filter(q => isEligible(q, completedLessons));
  let toReview = 0, neverSeen = 0, mastered = 0;
  for (const q of eligible) {
    const score = getPriorityScore(q.id, reviewHistory, completedLessons, today);
    if (score === NEW_SCORE) neverSeen++;
    else if (score > 0) toReview++;
    if ((reviewHistory?.[q.id]?.interval || 0) >= 30) mastered++;
  }
  return {
    eligible: eligible.length,
    toReview,                    // plus de plafond artificiel à 99
    neverSeen,
    mastered,
    pctMastered: eligible.length > 0 ? Math.round((mastered / eligible.length) * 100) : 0,
  };
}

export function getMasteryStats(pools, completedLessons) {
  const today = todayStr();
  let eligible = 0, toReview = 0, neverSeen = 0, mastered = 0;
  for (const { items, history } of pools || []) {
    for (const it of items || []) {
      if (!isEligible(it, completedLessons)) continue;
      eligible++;
      const score = getPriorityScore(it.id, history, completedLessons, today);
      if (score === NEW_SCORE) neverSeen++;
      else if (score > 0) toReview++;
      if ((history?.[it.id]?.interval || 0) >= 30) mastered++;
    }
  }
  return {
    eligible, neverSeen, mastered, toReview,
    pctMastered: eligible > 0 ? Math.round((mastered / eligible) * 100) : 0,
  };
}
