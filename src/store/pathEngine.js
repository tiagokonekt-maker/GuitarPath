// Groply — store/pathEngine.js
// Moteur du Parcours : découpe le contenu en unités, calcule le déblocage,
// et applique la personnalisation issue du test de placement.
//
// ── Ce qui change par rapport à la version précédente ─────────────────────
//
// 1. TAILLE DES UNITÉS. Le seuil de scission était à 15 leçons, alors que
//    la répartition réelle du contenu est :
//      Palier : 1  2  3  4   5   6   7   8   9
//      Leçons : 4  6  7  10  13  15  18  16  19   (108 au total)
//    Seuls les paliers 7, 8 et 9 étaient donc scindés, ce qui donnait des
//    unités de 4 leçons au début et de 15 au milieu. Le verrou étant total
//    (toutes les leçons + une vérification réussie), il fallait enchaîner
//    15 leçons d'affilée pour ouvrir le palier 7 — exactement là où le
//    décrochage est le plus probable. Le seuil passe à 8, avec une
//    scission en autant de parts que nécessaire (plus seulement en deux).
//
// 2. RÉCOMPENSE PROPORTIONNELLE. Le coffre valait 40 XP pour 4 leçons comme
//    pour 15. Il vaut désormais 10 XP par leçon de l'unité.
//
// 3. VÉRIFICATION PROPORTIONNELLE. 8 questions pour valider 15 leçons, avec
//    6 bonnes réponses suffisantes, laissait passer quelqu'un ayant compris
//    la moitié. Le nombre de questions dépend maintenant de la taille.
//
// 4. PERSONNALISATION RÉELLEMENT BRANCHÉE (audit §7.2). Le test de placement
//    remplissait `weakestModule` / `preferredModule` / `overallTier` que
//    PERSONNE ne lisait. Désormais :
//      • `overallTier` ouvre d'emblée les premiers paliers (un joueur testé
//        B2 ne recommence pas par « les cordes s'appellent Mi La Ré Sol Si
//        Mi ») — sans jamais cocher une leçon à sa place ;
//      • `weakestModule` puis `preferredModule` passent en tête de l'ordre
//        interne d'un palier ;
//      • `timePerWeek` dimensionne la session du jour (dailyTarget).

export const UNIT_CHECK_PASS_PCT = 70;
export const MODULE_ORDER = ["neck", "scales", "harmony", "rhythm", "impro"];
export const MAX_LEVEL = 9;

/** Au-delà de ce nombre de leçons, un palier est scindé en plusieurs unités. */
const SPLIT_THRESHOLD = 8;
/** Taille cible d'une unité après scission. */
const TARGET_UNIT_SIZE = 6;

/** XP du coffre de fin d'unité, proportionnelle à l'effort. */
export const UNIT_BONUS_PER_LESSON = 10;
export const unitBonusXp = (lessonCount) =>
  Math.max(20, Math.min(150, Math.round((lessonCount || 0) * UNIT_BONUS_PER_LESSON)));
/** Conservé pour compatibilité d'import (valeur indicative, non normative). */
export const UNIT_BONUS_XP = 40;

/** Nombre de questions de vérification, proportionnel à la taille de l'unité. */
export const unitCheckSize = (lessonCount) =>
  Math.max(4, Math.min(14, Math.round(4 + (lessonCount || 0) / 2)));
export const UNIT_CHECK_MAX_QUESTIONS = 14;   // borne haute

/** Nombre de paliers ouverts d'emblée selon le résultat du placement. */
const TIER_HEADSTART = { A1: 0, A2: 1, B1: 2, B2: 3 };

/**
 * Ordre des modules à l'intérieur d'un palier, personnalisé :
 * module le plus faible d'abord (c'est là qu'il faut travailler), puis le
 * module choisi comme objectif, puis l'ordre canonique. Aucun module n'est
 * retiré, seul l'ordre change.
 */
export function moduleOrderFor(state) {
  const ob = state?.onboarding || {};
  const head = [];
  for (const m of [ob.weakestModule, ob.preferredModule]) {
    if (m && MODULE_ORDER.includes(m) && !head.includes(m)) head.push(m);
  }
  return [...head, ...MODULE_ORDER.filter(m => !head.includes(m))];
}

/** Découpe une liste en parts aussi égales que possible, ≥ 2 items chacune. */
function chunkEvenly(list, threshold = SPLIT_THRESHOLD, target = TARGET_UNIT_SIZE) {
  if (list.length <= threshold) return [list];
  const parts = Math.max(2, Math.ceil(list.length / target));
  const size = Math.ceil(list.length / parts);
  const out = [];
  for (let i = 0; i < list.length; i += size) out.push(list.slice(i, i + size));
  // Si la dernière part est orpheline (1 leçon), on la fusionne.
  if (out.length > 1 && out[out.length - 1].length === 1) {
    out[out.length - 2] = [...out[out.length - 2], ...out.pop()];
  }
  return out;
}

/**
 * Construit la séquence d'unités PAR PALIER (sans statut).
 * Chaque leçon reçoit son courseId/courseTitle d'origine, ce qui permet au
 * reste de l'app (thème visuel, « prochaine leçon », badges par module) de
 * savoir de quelle discipline elle vient même regroupée.
 */
export function buildUnits(courses = [], state = null) {
  const order = moduleOrderFor(state);
  const allLessons = courses.flatMap(c =>
    (c.lessons || []).map(l => ({ ...l, courseId: c.id, courseTitle: c.title }))
  );
  // Leçons sans level explicite (contenu importé, oubli) : rattachées au
  // dernier palier plutôt qu'exclues silencieusement du Parcours.
  for (const l of allLessons) if (l.level == null) l.level = MAX_LEVEL;

  const units = [];
  for (let level = 1; level <= MAX_LEVEL; level++) {
    const lessons = allLessons.filter(l => l.level === level);
    if (lessons.length === 0) continue;

    // Ordre déterministe et stable : jamais aléatoire. Un module inconnu
    // (pack importé) va en fin de rotation plutôt qu'en tête, ce que
    // faisait `indexOf` en renvoyant -1.
    const rank = (id) => { const i = order.indexOf(id); return i === -1 ? order.length : i; };
    lessons.sort((a, b) => rank(a.courseId) - rank(b.courseId));

    const chunks = chunkEvenly(lessons);
    chunks.forEach((chunk, partIdx) => {
      // Le nombre de questions de vérification ne peut pas dépasser le stock
      // réellement disponible : demander 7 questions quand les leçons de
      // l'unité n'en référencent que 5 produirait une vérification tronquée,
      // dont le pourcentage de réussite ne voudrait plus rien dire.
      const stock = new Set(chunk.flatMap(l => l.quiz || [])).size;
      const checkSize = Math.max(3, Math.min(unitCheckSize(chunk.length), stock || 3));
      units.push({
        id: chunks.length > 1 ? `palier-${level}-${partIdx + 1}` : `palier-${level}`,
        level,
        part: chunks.length > 1 ? partIdx + 1 : null,
        parts: chunks.length,
        title: chunks.length > 1 ? `Palier ${level} · partie ${partIdx + 1}` : `Palier ${level}`,
        courseIds: [...new Set(chunk.map(l => l.courseId))],
        lessons: chunk,
        bonusXp: unitBonusXp(chunk.length),
        checkSize,
        quizPoolSize: stock,
      });
    });
  }
  return units;
}

/**
 * Le parcours complet avec statuts :
 * { done, total, complete, unlocked, isCurrent, bonusClaimable, bonusClaimed,
 *   headstart, index }
 *
 * Règles de déblocage :
 *   • la première unité est toujours ouverte ;
 *   • une unité est ouverte si la précédente est complète (leçons +
 *     vérification réussie) ;
 *   • une unité contenant déjà une leçon complétée reste ouverte (reprise
 *     d'une progression existante — personne ne perd son avancement) ;
 *   • les N premières unités sont ouvertes d'emblée si le test de placement
 *     a établi un niveau élevé (`headstart`). Elles ne sont PAS marquées
 *     comme faites : l'utilisateur peut les survoler ou les travailler.
 */
export function buildPath(content, state, priorityModules = null) {
  const completed = state?.completedLessons || {};
  const claimed   = state?.claimedUnits || {};
  const checks    = state?.unitChecks || {};
  const units = buildUnits(content?.courses || [], state);

  const tier = state?.onboarding?.overallTier;
  const headstartCount = state?.onboarding?.done ? (TIER_HEADSTART[tier] ?? 0) : 0;

  // `prevPassable` plutôt que `prevComplete` : une unité ouverte par le
  // placement est franchissable sans être faite, sinon le déblocage
  // s'arrêterait net au bout du headstart et le joueur se retrouverait
  // sans aucune unité « courante ».
  let prevPassable = true;
  let currentAssigned = false;

  return units.map((u, i) => {
    const done = u.lessons.filter(l => completed[l.id]).length;
    const total = u.lessons.length;
    const lessonsComplete = total > 0 && done === total;
    const check = checks[u.id] || null;
    const checkPassed = !!check?.passed;
    const complete = lessonsComplete && checkPassed;
    const needsCheck = lessonsComplete && !checkPassed;
    const headstart = i < headstartCount;
    const unlocked = i === 0 || prevPassable || done > 0 || headstart;
    // « Unité courante » = la première ouverte non terminée qui n'est pas un
    // simple palier ouvert par le placement : on ne veut pas envoyer un
    // joueur testé B2 travailler le palier 1.
    const isCurrent = unlocked && !complete && !currentAssigned && (!headstart || done > 0);
    if (isCurrent) currentAssigned = true;
    prevPassable = complete || headstart;

    return {
      ...u, index: i, done, total, complete, unlocked, isCurrent,
      lessonsComplete, needsCheck, check, headstart,
      bonusClaimable: complete && !claimed[u.id],
      bonusClaimed: !!claimed[u.id],
    };
  });
}

/**
 * Pool de questions pour la vérification de fin d'unité : union des quiz
 * associés à chaque leçon de l'unité, dédupliqués, dans l'ordre des leçons.
 */
export function getUnitQuizPool(unit) {
  const seen = new Set();
  const ids = [];
  for (const lesson of unit?.lessons || []) {
    for (const qid of lesson.quiz || []) {
      if (!seen.has(qid)) { seen.add(qid); ids.push(qid); }
    }
  }
  return ids;
}

/**
 * Prochaine leçon dans l'ordre du parcours (unités débloquées uniquement).
 * Retourne { course, lesson, unit } ou null si tout est complété.
 */
export function getNextLesson(content, state) {
  const completed = state?.completedLessons || {};
  const path = buildPath(content, state);
  let pendingCheckUnit = null;

  // Priorité à l'unité courante (celle que l'app considère « en cours »),
  // pour ne pas renvoyer un joueur expérimenté vers un palier ouvert par le
  // placement mais volontairement survolé.
  const ordered = [...path.filter(u => u.isCurrent), ...path];
  const seen = new Set();

  for (const u of ordered) {
    if (!u.unlocked || seen.has(u.id)) continue;
    seen.add(u.id);
    if (u.needsCheck && !pendingCheckUnit) pendingCheckUnit = u;
    for (const lesson of u.lessons) {
      if (!completed[lesson.id]) {
        const course = (content?.courses || []).find(c => c.id === lesson.courseId);
        return { course, lesson, unit: u };
      }
    }
  }
  if (pendingCheckUnit) return { course: null, lesson: null, unit: pendingCheckUnit, needsCheck: true };
  return null;
}

/** Statistiques globales du parcours (pour l'en-tête de l'écran). */
export function getPathStats(content, state) {
  const path = buildPath(content, state);
  const totalLessons = path.reduce((a, u) => a + u.total, 0);
  const doneLessons  = path.reduce((a, u) => a + u.done, 0);
  const currentUnit  = path.find(u => u.isCurrent) || null;
  return {
    units: path.length,
    completedUnits: path.filter(u => u.complete).length,
    totalLessons, doneLessons,
    pct: totalLessons > 0 ? Math.round((doneLessons / totalLessons) * 100) : 0,
    currentUnit,
  };
}
