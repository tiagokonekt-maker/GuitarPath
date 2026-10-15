// ═══════════════════════════════════════════════════════════════════════
// MODULE 5 — IMPROVISATION
// ═══════════════════════════════════════════════════════════════════════
// Ordre des leçons = ordre de cette liste.
import * as improIntro01 from "./impro-intro-01.js";
import * as improIntro02 from "./impro-intro-02.js";
import * as impro01 from "./impro-01.js";
import * as impro02 from "./impro-02.js";
import * as impro03 from "./impro-03.js";
import * as impro04 from "./impro-04.js";
import * as impro05 from "./impro-05.js";
import * as impro06 from "./impro-06.js";

export const LECONS = [
  improIntro01,
  improIntro02,
  impro01,
  impro02,
  impro03,
  impro04,
  impro05,
  impro06,
];

export default {
  id: "impro",
  title: "Improvisation",
  icon: "🎵",
  color: "#D4537E",
  colorL: "#FBEAF1",
  desc: "Phrasing, ciblage des notes d'accord, tension/résolution, langage musical",
};
