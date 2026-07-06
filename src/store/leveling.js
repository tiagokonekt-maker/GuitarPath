// Groply — store/leveling.js
// Source de vérité UNIQUE pour la courbe d'XP et de niveaux.
// Remplace l'ancienne formule linéaire `Math.floor(xp / 300) + 1`
// dupliquée dans reducer.js, HomeScreen.jsx et ProgressScreen.jsx.
//
// Courbe : le niveau n → n+1 coûte  min(150 + (n-1)×50, 800) XP.
//   Niv 1→2 : 150 XP   (≈ 5 leçons — dopamine du départ)
//   Niv 2→3 : 200 XP
//   Niv 5→6 : 350 XP
//   Niv 10→11 : 600 XP
//   Niv 14+ : plafonné à 800 XP/niveau (les hauts niveaux restent atteignables)

const BASE = 150;
const STEP = 50;
const CAP  = 800;

/** XP nécessaire pour passer du niveau n au niveau n+1. */
export function xpNeededForLevel(n) {
  return Math.min(BASE + (n - 1) * STEP, CAP);
}

/** XP total cumulé requis pour ATTEINDRE le niveau n (niveau 1 = 0 XP). */
export function totalXpForLevel(n) {
  let total = 0;
  for (let i = 1; i < n; i++) total += xpNeededForLevel(i);
  return total;
}

/** Niveau correspondant à un total d'XP donné. */
export function levelFromXp(xp) {
  const safe = Math.max(0, Number(xp) || 0);
  let level = 1;
  let remaining = safe;
  while (remaining >= xpNeededForLevel(level)) {
    remaining -= xpNeededForLevel(level);
    level += 1;
    if (level > 500) break; // garde-fou
  }
  return level;
}

/**
 * Tout ce dont un écran a besoin pour afficher la progression :
 *   { level, xpInLevel, xpNeeded, xpToNext, pct, totalForNext }
 */
export function levelProgress(xp) {
  const safe = Math.max(0, Number(xp) || 0);
  const level = levelFromXp(safe);
  const floor = totalXpForLevel(level);
  const xpNeeded = xpNeededForLevel(level);
  const xpInLevel = safe - floor;
  return {
    level,
    xpInLevel,
    xpNeeded,
    xpToNext: xpNeeded - xpInLevel,
    pct: Math.round((xpInLevel / xpNeeded) * 100),
    totalForNext: floor + xpNeeded,
  };
}
