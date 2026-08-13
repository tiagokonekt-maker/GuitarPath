// Groply — store/leveling.js
// Source de vérité UNIQUE pour la courbe d'XP et de niveaux.
//
// ── Recalibrage (audit §7.4) ──────────────────────────────────────────────
// Ancienne courbe : min(150 + (n-1)×50, 800)
//   → niveau 30 (« Star légendaire ») = 18 650 XP
//   → or tout le contenu de l'app ne contient qu'environ 13 300 XP unique
//     (108 leçons × 30 + 6 465 XP de quiz + ~2 500 XP d'exercices + coffres)
//   → le grade maximum était mathématiquement INATTEIGNABLE en finissant
//     l'app. Un sommet qu'on ne peut pas atteindre n'est pas un objectif,
//     c'est une frustration.
//
// Nouvelle courbe : min(120 + (n-1)×40, 500)
//   Niv  1→2  : 120 XP  (4 leçons — la première marche doit être courte)
//   Niv  5→6  : 280 XP
//   Niv 10→11 : 500 XP  (plafond atteint)
//
// Repères cumulés :
//   niv  5 →    720 XP  (~5 % du contenu)
//   niv 10 →  2 520 XP  (~19 %)
//   niv 15 →  5 000 XP  (~38 %)
//   niv 20 →  7 500 XP  (~56 %)
//   niv 30 → 12 500 XP  (~94 %)  ← finir le contenu = Star légendaire
//
// Effet sur les comptes existants : la courbe étant MOINS chère, personne
// ne perd de niveau — ils sont recalculés à la hausse au premier chargement
// (loadState fait déjà `s.level = levelFromXp(s.xp)`).

const BASE = 120;
const STEP = 40;
const CAP  = 500;

/** Niveau maximum représentable — borne dure contre les états corrompus. */
export const MAX_LEVEL = 60;

/** XP nécessaire pour passer du niveau n au niveau n+1. */
export function xpNeededForLevel(n) {
  const lvl = Math.max(1, Math.min(MAX_LEVEL, Math.floor(Number(n) || 1)));
  return Math.min(BASE + (lvl - 1) * STEP, CAP);
}

/** XP total cumulé requis pour ATTEINDRE le niveau n (niveau 1 = 0 XP). */
export function totalXpForLevel(n) {
  const target = Math.max(1, Math.min(MAX_LEVEL, Math.floor(Number(n) || 1)));
  let total = 0;
  for (let i = 1; i < target; i++) total += xpNeededForLevel(i);
  return total;
}

/**
 * Niveau correspondant à un total d'XP donné.
 *
 * CORRECTIF : l'ancienne version sortait de la boucle à `level > 500` mais
 * RENVOYAIT la valeur atteinte — `levelFromXp(Infinity)` rendait donc 501,
 * ce qui donnait le grade maximum à n'importe quel état corrompu (ou à un
 * fichier de progression fabriqué puis réimporté). Le résultat est
 * désormais borné, et les entrées non finies sont rejetées avant la boucle.
 */
export function levelFromXp(xp) {
  const raw = Number(xp);
  if (!Number.isFinite(raw) || raw <= 0) return 1;
  const safe = Math.min(raw, totalXpForLevel(MAX_LEVEL));
  let level = 1;
  let remaining = safe;
  while (level < MAX_LEVEL && remaining >= xpNeededForLevel(level)) {
    remaining -= xpNeededForLevel(level);
    level += 1;
  }
  return level;
}

/** Normalise une valeur d'XP venant du stockage local ou du cloud. */
export function sanitizeXp(xp) {
  const raw = Number(xp);
  if (!Number.isFinite(raw) || raw < 0) return 0;
  return Math.min(Math.round(raw), totalXpForLevel(MAX_LEVEL));
}

/**
 * Tout ce dont un écran a besoin pour afficher la progression :
 *   { level, xpInLevel, xpNeeded, xpToNext, pct, totalForNext, isMax }
 */
export function levelProgress(xp) {
  const safe = sanitizeXp(xp);
  const level = levelFromXp(safe);
  const floor = totalXpForLevel(level);
  const xpNeeded = xpNeededForLevel(level);
  const xpInLevel = safe - floor;
  const isMax = level >= MAX_LEVEL;
  return {
    level,
    xpInLevel,
    xpNeeded,
    xpToNext: isMax ? 0 : xpNeeded - xpInLevel,
    pct: isMax ? 100 : Math.max(0, Math.min(100, Math.round((xpInLevel / xpNeeded) * 100))),
    totalForNext: floor + xpNeeded,
    isMax,
  };
}
