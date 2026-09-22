// Groply — store/mastery.js
// Paliers de maîtrise : remplacer « faite / pas faite » par une échelle.
//
// ── Le problème ───────────────────────────────────────────────────────────
// Une leçon était binaire : `completedLessons[id]` existe ou non. Conséquences :
//   • le parcours s'épuise vite — 108 cases à cocher, et c'est fini ;
//   • « leçon complétée » ne dit rien de ce qui est retenu. On peut avoir lu
//     une leçon en janvier et n'en avoir aucun souvenir en mars, l'app affiche
//     la même coche ;
//   • la révision espacée tourne en arrière-plan sans que rien ne la montre.
//     Tout ce travail de mémorisation n'apparaît nulle part.
//
// ── Les trois paliers ─────────────────────────────────────────────────────
//
//   1 · VU        la leçon a été lue.
//   2 · COMPRIS   toutes ses questions ont été réussies au moins une fois.
//   3 · ANCRÉ     ses questions tiennent dans la durée : leur intervalle de
//                 révision a dépassé 21 jours.
//
// Le troisième palier est le point important, pour deux raisons.
//
// D'abord il est HONNÊTE. Il ne se déclare pas, il se constate : atteindre un
// intervalle de 21 jours demande environ six révisions réussies, étalées sur
// cinq à six semaines de calendrier réel. C'est la définition opérationnelle
// de « je le sais » — pas « je l'ai su le jour où je l'ai lu ».
//
// Ensuite il est INFALSIFIABLE par la répétition. On ne peut pas ancrer une
// leçon en une soirée : le temps fait partie du critère. C'est le seul palier
// de l'application qu'on ne peut pas obtenir en cliquant vite.
//
// Effet sur la durée de vie du produit : 108 leçons deviennent 324 objectifs,
// sans écrire une ligne de contenu supplémentaire. Et le dernier tiers ne
// s'atteint qu'en revenant régulièrement, ce qui est exactement le
// comportement qu'une application d'apprentissage doit encourager.

import { daysBetween, todayStr } from "./dates.js";

// ── Paliers ────────────────────────────────────────────────────────────────
export const MASTERY = {
  LOCKED:     0,   // pas encore ouverte
  SEEN:       1,   // lue
  UNDERSTOOD: 2,   // questions réussies
  ANCHORED:   3,   // questions retenues dans la durée
};

export const MASTERY_LABELS = {
  0: "À découvrir",
  1: "Vu",
  2: "Compris",
  3: "Ancré",
};

export const MASTERY_HINTS = {
  0: "Ouvre la leçon pour commencer",
  1: "Réussis ses questions pour passer à « compris »",
  2: "Reviens la réviser dans les semaines qui viennent pour l'ancrer",
  3: "Retenu dans la durée",
};

/**
 * Intervalle de révision, en jours, à partir duquel une question est
 * considérée comme ancrée.
 *
 * 21 jours n'est pas arbitraire : avec la progression de reviewEngine
 * (1, 4, puis × facteur de facilité), il faut environ six révisions réussies
 * pour y arriver — soit cinq à six semaines de calendrier. En dessous, on
 * mesurerait surtout la mémoire à court terme.
 */
export const ANCHOR_DAYS = 21;

/**
 * Part des questions d'une leçon à ancrer pour que la leçon le soit.
 *
 * Pas 100 % : le calendrier de révision ne dépend pas entièrement de
 * l'utilisateur — une question tirée plus tard qu'une autre prend du retard
 * sans que ce soit de sa faute. 80 % récompense le travail réel sans le
 * suspendre à un aléa de tirage.
 *
 * En revanche le palier « compris » exige TOUTES les questions : là, il
 * s'agit seulement de les avoir réussies une fois, ce qui dépend entièrement
 * de l'utilisateur.
 */
export const ANCHOR_RATIO = 0.8;

const quizRequisPourAncrer = (n) => Math.max(1, Math.ceil(n * ANCHOR_RATIO));

// ── Maîtrise d'une question isolée ─────────────────────────────────────────

/** Une question a-t-elle été réussie au moins une fois ? */
export const questionReussie = (state, quizId) =>
  !!state?.quizResults?.[quizId]?.correct;

/**
 * Une question est-elle ancrée ?
 * On se fie à l'intervalle courant de la révision espacée : c'est lui qui
 * encode le fait qu'elle a été retrouvée plusieurs fois, de plus en plus
 * espacément.
 */
export function questionAncree(state, quizId) {
  const h = state?.reviewHistory?.[quizId];
  if (!h) return false;
  if ((h.interval || 0) < ANCHOR_DAYS) return false;
  // Un échec récent remet le compteur à zéro dans reviewEngine (streak 0,
  // interval 0), donc l'intervalle suffit — mais on vérifie quand même qu'il
  // y a eu au moins une réussite, pour ne pas ancrer sur un état corrompu.
  return (h.successes || 0) > 0;
}

/** Niveau de maîtrise d'une question : 0, 1 (réussie), 2 (ancrée). */
export function questionMastery(state, quizId) {
  if (questionAncree(state, quizId)) return 2;
  if (questionReussie(state, quizId)) return 1;
  return 0;
}

// ── Maîtrise d'une leçon ───────────────────────────────────────────────────

/**
 * Niveau de maîtrise d'une leçon, avec le détail de ce qui manque.
 *
 * @param lesson    la leçon (doit porter son tableau `quiz`)
 * @param state     l'état de progression
 * @param quizIndex Map id → question, pour écarter les références mortes
 * @returns {{
 *   level:number, label:string, hint:string,
 *   masterable:boolean,           // une leçon sans question ne peut pas dépasser « vu »
 *   total:number,                 // questions rattachées et existantes
 *   reussies:number, ancrees:number,
 *   requisPourAncrer:number,
 *   pct:number                    // avancement 0-100 sur les trois paliers
 * }}
 */
export function lessonMastery(lesson, state, quizIndex = null) {
  const completee = !!state?.completedLessons?.[lesson?.id];

  const ids = (lesson?.quiz || []).filter(id => !quizIndex || quizIndex.has(id));
  const total = ids.length;
  const reussies = ids.filter(id => questionReussie(state, id)).length;
  const ancrees = ids.filter(id => questionAncree(state, id)).length;
  const requis = quizRequisPourAncrer(total);

  // Une leçon sans question rattachée ne peut pas être évaluée. On la plafonne
  // à « vu » et on le signale, plutôt que de lui accorder un palier qu'on n'a
  // pas mesuré. Les agrégats l'excluent de leurs dénominateurs, pour ne pas
  // rendre le 100 % inatteignable à cause d'un trou de contenu.
  const masterable = total > 0;

  let level = MASTERY.LOCKED;
  if (completee) level = MASTERY.SEEN;
  if (completee && masterable && reussies === total) level = MASTERY.UNDERSTOOD;
  if (completee && masterable && reussies === total && ancrees >= requis) level = MASTERY.ANCHORED;

  // Avancement continu, pour une barre de progression qui bouge à chaque
  // question plutôt que par sauts de palier.
  let pct = 0;
  if (completee) {
    pct = 33;
    if (masterable) {
      pct += Math.round(33 * (total ? reussies / total : 0));
      pct += Math.round(34 * (requis ? Math.min(1, ancrees / requis) : 0));
    } else {
      pct = 33;
    }
  }

  return {
    level,
    label: MASTERY_LABELS[level],
    hint: MASTERY_HINTS[level],
    masterable,
    total, reussies, ancrees,
    requisPourAncrer: requis,
    pct: Math.min(100, pct),
  };
}

// ── Agrégats ───────────────────────────────────────────────────────────────

/**
 * Répartition des leçons par palier, sur l'ensemble du contenu ou un module.
 *
 * `objectifs` est le chiffre à afficher : le nombre total de paliers
 * atteignables. C'est lui qui montre que le parcours ne se résume pas à
 * cocher 108 cases.
 */
export function masteryStats(content, state, moduleId = null) {
  const quizIndex = new Map((content?.quiz || []).map(q => [q.id, q]));
  const lecons = (content?.courses || [])
    .filter(c => !moduleId || c.id === moduleId)
    .flatMap(c => (c.lessons || []).map(l => ({ ...l, courseId: c.id })));

  const paliers = [0, 0, 0, 0];
  let masterables = 0, sansQuiz = 0, sommePct = 0;

  for (const l of lecons) {
    const m = lessonMastery(l, state, quizIndex);
    paliers[m.level]++;
    if (m.masterable) masterables++; else sansQuiz++;
    sommePct += m.pct;
  }

  const total = lecons.length;
  return {
    total,
    sansQuiz,
    // Une leçon sans question ne compte que pour un palier (vu).
    objectifs: masterables * 3 + sansQuiz,
    atteints: paliers[1] + paliers[2] * 2 + paliers[3] * 3,
    aDecouvrir: paliers[0],
    vues: paliers[1],
    comprises: paliers[2],
    ancrees: paliers[3],
    pctMoyen: total ? Math.round(sommePct / total) : 0,
  };
}

/**
 * Leçons les plus proches de l'ancrage : comprises, avec déjà au moins une
 * question ancrée, triées par ce qu'il reste à faire.
 *
 * C'est la liste qui donne une raison de revenir — « il te manque une
 * question sur celle-ci » est un objectif net, là où « réviser » ne l'est pas.
 */
export function prochainesAAncrer(content, state, limite = 5) {
  const quizIndex = new Map((content?.quiz || []).map(q => [q.id, q]));
  const lecons = (content?.courses || [])
    .flatMap(c => (c.lessons || []).map(l => ({ ...l, courseId: c.id })));

  return lecons
    .map(l => ({ lesson: l, m: lessonMastery(l, state, quizIndex) }))
    .filter(x => x.m.level === MASTERY.UNDERSTOOD && x.m.masterable)
    .map(x => ({ ...x, reste: x.m.requisPourAncrer - x.m.ancrees }))
    .sort((a, b) => a.reste - b.reste || b.m.ancrees - a.m.ancrees)
    .slice(0, limite);
}

/**
 * Questions d'une leçon qui bloquent son passage au palier suivant.
 * Sert à proposer une session ciblée plutôt qu'une révision générique.
 */
export function bloquantes(lesson, state, quizIndex = null) {
  const ids = (lesson?.quiz || []).filter(id => !quizIndex || quizIndex.has(id));
  const m = lessonMastery(lesson, state, quizIndex);

  if (m.level === MASTERY.SEEN) {
    // Il manque des réussites.
    return ids.filter(id => !questionReussie(state, id));
  }
  if (m.level === MASTERY.UNDERSTOOD) {
    // Il manque des ancrages : les questions pas encore ancrées, les moins
    // avancées d'abord.
    return ids
      .filter(id => !questionAncree(state, id))
      .sort((a, b) => (state?.reviewHistory?.[b]?.interval || 0) - (state?.reviewHistory?.[a]?.interval || 0));
  }
  return [];
}

/**
 * Nombre de révisions réussies encore nécessaires pour ancrer une question,
 * estimé depuis son intervalle courant. Sert à afficher une attente réaliste
 * plutôt qu'un objectif flou.
 */
export function revisionsRestantes(state, quizId) {
  const h = state?.reviewHistory?.[quizId];
  let interval = h?.interval || 0;
  const ease = Math.max(1.3, Math.min(2.7, h?.ease || 2.2));
  let n = 0;
  // On rejoue la progression de reviewEngine : 1, 4, puis × facteur.
  while (interval < ANCHOR_DAYS && n < 20) {
    interval = interval === 0 ? 1 : interval === 1 ? 4 : Math.round(interval * ease);
    n++;
  }
  return n;
}

/** Jours calendaires minimum avant qu'une question puisse être ancrée. */
export function joursAvantAncrage(state, quizId, aujourdhui = todayStr()) {
  const h = state?.reviewHistory?.[quizId];
  if (!h) return null;
  if (questionAncree(state, quizId)) return 0;
  let interval = h.interval || 0, jours = 0;
  const ease = Math.max(1.3, Math.min(2.7, h.ease || 2.2));
  let n = 0;
  while (interval < ANCHOR_DAYS && n < 20) {
    const suivant = interval === 0 ? 1 : interval === 1 ? 4 : Math.round(interval * ease);
    jours += suivant;
    interval = suivant;
    n++;
  }
  // On retire le temps déjà écoulé depuis la dernière révision.
  const ecoule = h.lastSeen ? (daysBetween(h.lastSeen, aujourdhui) ?? 0) : 0;
  return Math.max(0, jours - ecoule);
}
