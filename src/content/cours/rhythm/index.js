// ═══════════════════════════════════════════════════════════════════════
// MODULE 4 — RYTHME & PHRASING
// ═══════════════════════════════════════════════════════════════════════
// Ordre des leçons = ordre de cette liste.
import * as rhyC101 from "./rhy-c1-01.js";
import * as rhyC102 from "./rhy-c1-02.js";
import * as rhyC103 from "./rhy-c1-03.js";
import * as rhyC201 from "./rhy-c2-01.js";
import * as rhyC202 from "./rhy-c2-02.js";
import * as rhyC203 from "./rhy-c2-03.js";
import * as rhyC204 from "./rhy-c2-04.js";
import * as rhyC301 from "./rhy-c3-01.js";
import * as rhyC302 from "./rhy-c3-02.js";
import * as rhyC303 from "./rhy-c3-03.js";
import * as rhyC401 from "./rhy-c4-01.js";
import * as rhyC402 from "./rhy-c4-02.js";
import * as rhyC403 from "./rhy-c4-03.js";
import * as rhyC501 from "./rhy-c5-01.js";
import * as rhyC502 from "./rhy-c5-02.js";
import * as rhyC503 from "./rhy-c5-03.js";
import * as rhyC504 from "./rhy-c5-04.js";
import * as rhyC505 from "./rhy-c5-05.js";
import * as rhyC601 from "./rhy-c6-01.js";
import * as rhyC602 from "./rhy-c6-02.js";
import * as rhyRoutine01 from "./rhy-routine-01.js";
import * as rhyMed01 from "./rhy-med-01.js";
import * as rhyMed02 from "./rhy-med-02.js";
import * as rhyTech01 from "./rhy-tech-01.js";
import * as rhyTech02 from "./rhy-tech-02.js";
import * as rhyTech03 from "./rhy-tech-03.js";
import * as rhyTech04 from "./rhy-tech-04.js";

export const LECONS = [
  rhyC101,
  rhyC102,
  rhyC103,
  rhyRoutine01, // palier 2 : routine de pratique (après le métronome)
  rhyC201,
  rhyC202,
  rhyC203,
  rhyC204,
  rhyC301,
  rhyC302,
  rhyC303,
  // Palier 6 : techniques de main gauche. Leur place dans cette liste règle
  // leur position dans le palier (entrelacement avec les gammes, voir
  // pathEngine.js › entrelacer) : bend et vibrato après la position 1 de la
  // pentatonique, legato et slides après la position 2, avant les positions 3-5.
  rhyTech01,   // le bend juste
  rhyTech02,   // le vibrato
  rhyC401,
  rhyMed01,    // palier 3 : médiator alterné (après le mouvement pendulaire)
  rhyC402,
  rhyMed02,    // palier 4 : changer de corde au médiator
  rhyC403,
  rhyTech03,   // palier 6 : hammer-on et pull-off
  rhyTech04,   // palier 6 : les slides
  rhyC501,
  rhyC502,
  rhyC503,
  rhyC504,
  rhyC505,
  rhyC601,
  rhyC602,
];

export default {
  id: "rhythm",
  title: "Rythme & phrasing",
  icon: "🥁",
  color: "#D85A30",
  colorL: "#FAECE7",
  desc: "Subdivisions, syncopes, placement, phrasing musical",
};
