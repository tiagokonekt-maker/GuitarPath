// ═══════════════════════════════════════════════════════════════════════════
// Groply — contenu pédagogique
// Point d'entrée unique : import { COURSES, QUIZ, EXERCISES } from "./content/index.js"
//
// Le contenu vit dans un fichier par leçon (cours/<module>/<id>.js), avec
// les questions de quiz de cette leçon dans le même fichier, et un fichier
// d'exercices par module (exercices/<module>.js). Voir README.md dans ce
// dossier pour ajouter ou modifier une leçon.
//
// `node scripts/verifier-contenu.mjs` (lancé par `npm test`) contrôle la
// cohérence de l'ensemble, y compris les fichiers oubliés dans un index.
// ═══════════════════════════════════════════════════════════════════════════

import neck, { LECONS as leconsNeck } from "./cours/neck/index.js";
import scales, { LECONS as leconsScales } from "./cours/scales/index.js";
import harmony, { LECONS as leconsHarmony } from "./cours/harmony/index.js";
import rhythm, { LECONS as leconsRhythm } from "./cours/rhythm/index.js";
import impro, { LECONS as leconsImpro } from "./cours/impro/index.js";

import exosNeck from "./exercices/neck.js";
import exosScales from "./exercices/scales.js";
import exosHarmony from "./exercices/harmony.js";
import exosRhythm from "./exercices/rhythm.js";
import exosImpro from "./exercices/impro.js";

// Ordre des modules = ordre d'affichage du parcours.
const MODULES = [
  [neck, leconsNeck],
  [scales, leconsScales],
  [harmony, leconsHarmony],
  [rhythm, leconsRhythm],
  [impro, leconsImpro],
];

export const COURSES = MODULES.map(([meta, lecons]) => ({
  ...meta,
  lessons: lecons.map(l => l.default),
}));

export const QUIZ = MODULES.flatMap(([, lecons]) => lecons.flatMap(l => l.quiz ?? []));

export const EXERCISES = [
  ...exosNeck,
  ...exosScales,
  ...exosHarmony,
  ...exosRhythm,
  ...exosImpro,
];
