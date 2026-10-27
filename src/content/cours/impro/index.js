// ═══════════════════════════════════════════════════════════════════════
// MODULE 5 — IMPROVISATION
// ═══════════════════════════════════════════════════════════════════════
// Ordre des leçons = ordre de cette liste.
import * as improIntro01 from "./impro-intro-01.js";
import * as improIntro02 from "./impro-intro-02.js";
import * as impro01 from "./impro-01.js";
import * as impro02 from "./impro-02.js";
import * as impro03 from "./impro-03.js";
import * as impro03b from "./impro-03b.js";
import * as impro04 from "./impro-04.js";
import * as impro04b from "./impro-04b.js";
import * as impro05 from "./impro-05.js";
import * as impro05b from "./impro-05b.js";
import * as impro06 from "./impro-06.js";
import * as impro06b from "./impro-06b.js";

export const LECONS = [
  improIntro01,
  improIntro02,
  impro01,
  impro02,
  impro03,
  impro03b,  // lot 4 : seconde moitié d'impro-03
  impro04,
  impro04b,  // lot 4 : seconde moitié d'impro-04
  impro05,
  impro05b,  // lot 4 : seconde moitié d'impro-05
  impro06,
  impro06b,  // lot 4 : seconde moitié d'impro-06
];

export default {
  id: "impro",
  title: "Improvisation",
  icon: "🎵",
  color: "#D4537E",
  colorL: "#FBEAF1",
  desc: "Phrasing, ciblage des notes d'accord, tension/résolution, langage musical",
};
