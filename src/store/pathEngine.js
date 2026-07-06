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
//   • Une unité est débloquée si : c'est la première, OU la précédente est
//     complète, OU elle contient déjà une leçon complétée (reprise d'une
//     progression existante — personne ne perd son avancement).
//   • Dans une unité débloquée, TOUTES les leçons sont accessibles,
//     dans n'importe quel ordre.
//   • Unité complète → un coffre de +40 XP est réclamable (une seule fois).

export const UNIT_SIZE = 3;
export const UNIT_BONUS_XP = 40;
export const MODULE_ORDER = ["neck", "scales", "harmony", "rhythm", "impro"];

/** Découpe les leçons d'un module en unités de 3 (fusion si reste de 1). */
export function chunkLessons(lessons, size = UNIT_SIZE) {
  const out = [];
  for (let i = 0; i < lessons.length; i += size) out.push(lessons.slice(i, i + size));
  if (out.length >= 2 && out[out.length - 1].length === 1) {
    const orphan = out.pop();
    out[out.length - 1] = [...out[out.length - 1], ...orphan];
  }
  return out;
}

/** Construit la séquence d'unités entrelacées (sans statut). */
export function buildUnits(courses = []) {
  const ordered = [
    ...MODULE_ORDER.map(id => courses.find(c => c.id === id)).filter(Boolean),
    ...courses.filter(c => !MODULE_ORDER.includes(c.id)),
  ];
  const perModule = ordered
    .map(c => ({ course: c, chunks: chunkLessons(c.lessons || []) }))
    .filter(m => m.chunks.length > 0);

  const units = [];
  const maxRounds = perModule.reduce((a, m) => Math.max(a, m.chunks.length), 0);
  for (let round = 0; round < maxRounds; round++) {
    for (const m of perModule) {
      if (round < m.chunks.length) {
        units.push({
          id: `${m.course.id}-u${round + 1}`,   // stable tant que l'ordre des leçons l'est
          courseId: m.course.id,
          courseTitle: m.course.title,
          courseDesc: m.course.desc || "",
          moduleUnitIndex: round + 1,
          moduleUnitCount: m.chunks.length,
          lessons: m.chunks[round],
        });
      }
    }
  }
  return units;
}

/**
 * Le parcours complet avec statuts :
 * chaque unité reçoit { done, total, complete, unlocked, isCurrent,
 * bonusClaimable, bonusClaimed, index }.
 */
export function buildPath(content, state) {
  const completed = state?.completedLessons || {};
  const claimed   = state?.claimedUnits || {};
  const units = buildUnits(content?.courses || []);

  let prevComplete = true;      // la toute première unité est toujours ouverte
  let currentAssigned = false;

  return units.map((u, i) => {
    const done = u.lessons.filter(l => completed[l.id]).length;
    const total = u.lessons.length;
    const complete = total > 0 && done === total;
    const unlocked = i === 0 || prevComplete || done > 0;
    const isCurrent = unlocked && !complete && !currentAssigned;
    if (isCurrent) currentAssigned = true;
    prevComplete = complete;

    return {
      ...u, index: i, done, total, complete, unlocked, isCurrent,
      bonusClaimable: complete && !claimed[u.id],
      bonusClaimed: !!claimed[u.id],
    };
  });
}

/**
 * Prochaine leçon dans l'ordre du parcours (unités débloquées uniquement).
 * Retourne { course, lesson, unit } ou null si tout est complété.
 * Utilisé par l'Accueil ("Prochain objectif") pour suivre le même ordre
 * que le Parcours.
 */
export function getNextLesson(content, state) {
  const completed = state?.completedLessons || {};
  for (const u of buildPath(content, state)) {
    if (!u.unlocked) continue;
    for (const lesson of u.lessons) {
      if (!completed[lesson.id]) {
        const course = (content?.courses || []).find(c => c.id === u.courseId);
        return { course, lesson, unit: u };
      }
    }
  }
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
