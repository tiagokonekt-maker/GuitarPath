// Groply — music/shapeQuestions.js
// Génère des questions « montre-moi cette forme d'accord » depuis la
// bibliothèque de formes validées (chordShapes.js).
//
// Progression volontairement crescendo, calquée sur les unités du Parcours :
//   niveau 1 — la forme la plus connue, en position ouverte
//   niveau 2 — une forme barrée simple (majeur / mineur)
//   niveau 3 — une forme AUTRE que la position ouverte, avec indice CAGED
//   niveau 4 — septièmes et accords étendus, position libre
//
// Aucune donnée saisie à la main : tout vient de chordShapes.js, dont les
// 233 formes ont déjà été validées contre la théorie (notes justes, doigtés
// cohérents, écartement jouable). Il n'y a donc pas de nouveau risque
// d'erreur musicale introduit ici.

import { getChordShapes } from "./chordShapes.js";
import { CHORD_TYPES, noteToFr } from "../fretboardUtils.js";

// Tonalités usuelles à la guitare — on évite les tonalités rares en début de
// parcours, elles n'apportent rien pédagogiquement et découragent.
const COMMON_ROOTS  = ["E", "A", "D", "G", "C"];
const EXTENDED_ROOTS = ["E", "A", "D", "G", "C", "F", "B", "F#"];

const LEVEL_SPEC = {
  1: { roots: COMMON_ROOTS,   qualities: ["maj", "min"],                       openOnly: true,  xp: 45 },
  2: { roots: COMMON_ROOTS,   qualities: ["maj", "min"],                       barreOnly: true, xp: 50 },
  3: { roots: COMMON_ROOTS,   qualities: ["maj", "min", "dom7"],               notOpen: true,   xp: 55 },
  4: { roots: EXTENDED_ROOTS, qualities: ["dom7", "min7", "maj7", "add9"],     xp: 60 },
};

/** Positions à presser d'une forme, au format attendu par le validateur. */
function shapeToPositions(shape) {
  // shape.frets est indexé de la 6e corde (index 0) à la 1re (index 5).
  // Le manche numérote les cordes 6 (grave) à 1 (aiguë).
  return shape.frets
    .map((fret, i) => ({ string: 6 - i, fret }))
    .filter(p => p.fret > 0);   // ni cordes à vide, ni cordes étouffées
}

/**
 * Cordes à vide qui SONNENT dans la forme (fret === 0, ni étouffée).
 * Le manche affiche leur note comme n'importe quelle autre — rien ne les
 * distingue visuellement d'une case à presser — donc un utilisateur les
 * sélectionne naturellement. On les transmet comme positions "neutres" :
 * ni exigées, ni pénalisées si cliquées.
 */
function shapeToOpenPositions(shape) {
  return shape.frets
    .map((fret, i) => ({ string: 6 - i, fret }))
    .filter(p => p.fret === 0);
}

/**
 * Génère une question de forme d'accord.
 *
 * @param level 1 à 4
 * @param rng   injectable pour des tests reproductibles
 * @returns une question au format quiz, ou null si aucune forme ne convient
 */
export function makeShapeQuestion(level = 1, rng = Math.random) {
  const spec = LEVEL_SPEC[Math.max(1, Math.min(4, level))] || LEVEL_SPEC[1];

  // On tente plusieurs combinaisons : selon la tonalité et la qualité,
  // certaines formes sont écartées par la validation de chordShapes.
  for (let attempt = 0; attempt < 24; attempt++) {
    const root = spec.roots[Math.floor(rng() * spec.roots.length)];
    const quality = spec.qualities[Math.floor(rng() * spec.qualities.length)];
    const all = getChordShapes(root, quality, 10, CHORD_TYPES[quality]?.intervals || null);
    if (!all.length) continue;

    let pool = all;
    if (spec.openOnly)  pool = all.filter(s => s.isOpen);
    if (spec.barreOnly) pool = all.filter(s => s.barre);
    if (spec.notOpen)   pool = all.filter(s => !s.isOpen);
    if (!pool.length) continue;

    const shape = pool[Math.floor(rng() * pool.length)];
    const positions = shapeToPositions(shape);
    const openPositions = shapeToOpenPositions(shape);
    // Moins de 2 doigts, il n'y a pas de forme à reproduire.
    if (positions.length < 2) continue;

    const rootFr = noteToFr(root);
    const sym = CHORD_TYPES[quality]?.sym ?? "";
    const chordName = `${rootFr}${sym}`;

    // L'énoncé change selon le niveau : c'est lui qui porte la progression
    // pédagogique, pas seulement la difficulté de la forme.
    let q, hint;
    if (spec.openOnly) {
      q = `Montre la forme de ${chordName} en position ouverte`;
      hint = `Les cordes à vide sonnent : ne place que les doigts nécessaires.`;
    } else if (spec.barreOnly) {
      q = `Montre ${chordName} en barré, ${shape.label.toLowerCase()}`;
      hint = `L'index barre la case ${shape.startFret}.`;
    } else if (spec.notOpen) {
      q = `Montre ${chordName} ailleurs qu'en position ouverte`;
      hint = `Indice CAGED : cherche la ${shape.label.toLowerCase()}, vers la case ${shape.startFret}.`;
    } else {
      q = `Montre ${chordName} — ${shape.label.toLowerCase()}`;
      hint = `Autour de la case ${shape.startFret}.`;
    }

    return {
      id: `shape-${root}-${quality}-${shape.label.replace(/\s+/g, "")}-${Math.floor(rng() * 1e4)}`,
      type: "fretboard",
      courseId: "harmony",
      lvl: Math.min(3, level),   // le Parcours n'expose que 3 niveaux
      q,
      hint,
      concept: { type: "find_shape", positions, neutralPositions: openPositions },
      // Mode "all" : toutes les positions attendues, aucune de trop — c'est
      // exactement la validation d'une forme. ("exact" n'est pas un mode
      // reconnu du validateur, il retomberait sur "all" sans le dire.)
      selectionRules: { mode: "all" },
      display: { showNotes: false },
      fretRange: [Math.max(0, shape.startFret - 1), Math.min(12, shape.startFret + 4)],
      xp: spec.xp,
      exp: `${chordName} · ${shape.label} · case ${shape.startFret}. `
         + `Cases à presser : ${positions.map(p => `c${p.string}f${p.fret}`).join(", ")}.`,
    };
  }
  return null;
}

/** Plusieurs questions distinctes pour un niveau donné. */
export function makeShapeQuestions(level, count = 3, rng = Math.random) {
  const out = [];
  const seen = new Set();
  for (let i = 0; i < count * 8 && out.length < count; i++) {
    const q = makeShapeQuestion(level, rng);
    if (!q) continue;
    const key = q.q;   // évite de proposer deux fois le même énoncé
    if (seen.has(key)) continue;
    seen.add(key);
    out.push(q);
  }
  return out;
}
