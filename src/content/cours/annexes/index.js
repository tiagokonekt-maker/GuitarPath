// ═══════════════════════════════════════════════════════════════════════════
// ANNEXES — leçons pratiques facultatives
// ═══════════════════════════════════════════════════════════════════════════
// Hors progression : changer ses cordes, régler son ampli, écrire un premier
// morceau. `facultatif: true` les range dans une unité « Annexes » placée
// APRÈS le palier 9, toujours ouverte, sans vérification ni coffre, jamais
// « courante » ni proposée comme prochaine leçon : elles ne bloquent rien
// (voir `estModuleAnnexe` dans src/store/pathEngine.js). Leurs questions
// (courseId "annexes", ids suffixés `-annexe`) n'entrent pas dans le test de
// placement. Les leçons n'ont pas de `level` (pas de palier) et portent
// `annexe: true`.
//
// Ordre des leçons = ordre de cette liste.
import * as cordes from "./annexes-cordes.js";
import * as ampli from "./annexes-ampli.js";
import * as morceau from "./annexes-morceau.js";

export const LECONS = [
  cordes,
  ampli,
  morceau,
];

export default {
  id: "annexes",
  title: "Annexes",
  icon: "📎",
  color: "#7A6F66",
  colorL: "#F1EEEA",
  desc: "Changer ses cordes, régler son ampli, écrire ton premier morceau",
  facultatif: true,
};
