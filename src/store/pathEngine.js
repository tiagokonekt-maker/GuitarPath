// Groply — store/pathEngine.js
// Moteur du Parcours : découpe les modules en unités de 3-4 leçons,
// les entrelace en spirale (on revisite chaque compétence à profondeur
// croissante), et calcule le déverrouillage par groupe.
//
// Règles :
//   • Unités de 3 leçons ; si la dernière n'en contient qu'1, elle fusionne
//     avec la précédente (unités de 3 ou 4, jamais 1).
//   • Ordre spiralaire : Manche U1 → Gammes U1 → Harmonie U1 → Rythme U1
//     → Impro U1 → Manche U2 → … Les modules importés (packs) s'ajoutent
//     à la rotation après les modules de base.
//   • Si l'onboarding a identifié un module préféré, il passe en tête de
//     rotation (personnalisation) — mais l'ordre spiralaire entre les
//     autres modules reste inchangé, aucun module n'est retiré.
//   • Une unité est débloquée si : c'est la première, OU la précédente est
//     complète, OU elle contient déjà une leçon complétée (reprise d'une
//     progression existante — personne ne perd son avancement).
//   • Dans une unité débloquée, TOUTES les leçons sont accessibles,
//     dans n'importe quel ordre.
//   • Toutes les leçons vues ne suffisent pas à "compléter" l'unité : il
//     faut aussi réussir la vérification de fin d'unité (score ≥ seuil,
//     tentatives illimitées). Tant que ce n'est pas fait, l'unité est
//     "à vérifier" — la suivante reste verrouillée et le coffre attend.
//   • Unité complète (leçons + vérification) → un coffre de +40 XP est
//     réclamable (une seule fois).

export const UNIT_BONUS_XP = 40;
export const UNIT_CHECK_PASS_PCT = 70;   // % minimum pour valider une unité
export const UNIT_CHECK_MAX_QUESTIONS = 8;
export const MODULE_ORDER = ["neck", "scales", "harmony", "rhythm", "impro"];
export const MAX_LEVEL = 9;
// Au-delà de ce nombre de leçons, un palier est scindé en deux unités
// successives : le document de refonte visait 10-14 leçons par étape
// ("franchissable en 1-2 semaines"), mais certains paliers (7, 9) en
// comptent jusqu'à 19 une fois le contenu réel réparti.
const SPLIT_THRESHOLD = 15;

/**
 * Construit la séquence d'unités PAR PALIER (sans statut).
 *
 * C'est le cœur de la refonte pédagogique : une unité n'est plus un groupe
 * de 3 leçons d'une seule discipline, c'est un palier entier — manche,
 * gammes, harmonie et rythme mélangés selon ce qui est réellement
 * accessible à ce stade, pas selon une étiquette de matière. Le Palier 1
 * (4 leçons, une par discipline) n'aurait aucun sens éclaté en 4 unités
 * séparées : le mélange est la leçon elle-même, pas d'une simple présentation.
 *
 * Chaque leçon reçoit ici son propre courseId/courseTitle d'origine (le
 * champ n'existe pas nativement sur l'objet leçon dans content.js) — c'est
 * ce qui permet au reste de l'app (thème visuel, "prochaine leçon", badges
 * par module) de continuer à savoir de quelle discipline elle vient, même
 * regroupée dans une unité multi-disciplines.
 */
export function buildUnits(courses = []) {
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
    // Ordre fixe et déterministe à l'intérieur d'un palier — jamais
    // aléatoire, l'apprenant doit toujours savoir dans quel ordre les
    // disciplines se présentent. Le tri est stable : deux leçons d'un
    // même cours gardent leur ordre d'origine.
    lessons.sort((a, b) => MODULE_ORDER.indexOf(a.courseId) - MODULE_ORDER.indexOf(b.courseId));

    const chunks = lessons.length > SPLIT_THRESHOLD
      ? [lessons.slice(0, Math.ceil(lessons.length / 2)), lessons.slice(Math.ceil(lessons.length / 2))]
      : [lessons];

    chunks.forEach((chunk, partIdx) => {
      units.push({
        id: chunks.length > 1 ? `palier-${level}-${partIdx + 1}` : `palier-${level}`,
        level,
        title: chunks.length > 1 ? `Palier ${level} · partie ${partIdx + 1}` : `Palier ${level}`,
        courseIds: [...new Set(chunk.map(l => l.courseId))],
        lessons: chunk,
      });
    });
  }
  return units;
}

/**
 * Le parcours complet avec statuts :
 * chaque unité reçoit { done, total, complete, unlocked, isCurrent,
 * bonusClaimable, bonusClaimed, index }.
 * @param {string|string[]|null} priorityModules - conservé pour compatibilité
 *        d'appel, mais sans effet sur l'ordre : celui-ci suit désormais les
 *        paliers, dans un ordre fixe (1 à 9), plus une rotation de modules.
 *        La vraie personnalisation par la faiblesse détectée au placement
 *        se fera au niveau du déblocage initial (à implémenter), pas de
 *        l'ordre de présentation.
 */
export function buildPath(content, state, priorityModules = null) {
  const completed = state?.completedLessons || {};
  const claimed   = state?.claimedUnits || {};
  const checks    = state?.unitChecks || {};
  const units = buildUnits(content?.courses || []);

  let prevComplete = true;      // la toute première unité est toujours ouverte
  let currentAssigned = false;

  return units.map((u, i) => {
    const done = u.lessons.filter(l => completed[l.id]).length;
    const total = u.lessons.length;
    const lessonsComplete = total > 0 && done === total;
    const check = checks[u.id] || null;
    const checkPassed = !!check?.passed;
    const complete = lessonsComplete && checkPassed;
    const needsCheck = lessonsComplete && !checkPassed;
    const unlocked = i === 0 || prevComplete || done > 0;
    const isCurrent = unlocked && !complete && !currentAssigned;
    if (isCurrent) currentAssigned = true;
    prevComplete = complete;

    return {
      ...u, index: i, done, total, complete, unlocked, isCurrent,
      lessonsComplete, needsCheck, check,
      bonusClaimable: complete && !claimed[u.id],
      bonusClaimed: !!claimed[u.id],
    };
  });
}

/**
 * Pool de questions pour la vérification de fin d'unité : union des quiz
 * déjà associés à chaque leçon de l'unité (pas de nouveau contenu à créer).
 * Retourne une liste d'IDs de quiz, dédupliquée, dans l'ordre des leçons.
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
 * Utilisé par l'Accueil ("Prochain objectif") pour suivre le même ordre
 * que le Parcours.
 */
export function getNextLesson(content, state) {
  const completed = state?.completedLessons || {};
  let pendingCheckUnit = null;
  for (const u of buildPath(content, state)) {
    if (!u.unlocked) continue;
    if (u.needsCheck && !pendingCheckUnit) pendingCheckUnit = u;
    for (const lesson of u.lessons) {
      if (!completed[lesson.id]) {
        const course = (content?.courses || []).find(c => c.id === lesson.courseId);
        return { course, lesson, unit: u };
      }
    }
  }
  // Plus aucune leçon à faire dans le débloqué, mais une unité attend sa
  // vérification : on le signale plutôt que de renvoyer null silencieusement.
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
