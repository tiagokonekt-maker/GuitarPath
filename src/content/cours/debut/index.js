// ═══════════════════════════════════════════════════════════════════════
// MODULE 0 — PREMIERS PAS
// ═══════════════════════════════════════════════════════════════════════
// Module d'initiation pour les débutants complets : posture, accordage,
// premiers accords, lecture de tablature. Il ne suit PAS le découpage par
// paliers des autres modules : `prelude: true` le place en tête du parcours,
// en unités propres (champ `unite` de chaque leçon, titres dans `unites`).
// Pour quelqu'un qui joue déjà, ces unités sont facultatives : voir
// `debutFacultatif` dans src/store/pathEngine.js.
//
// Ordre des leçons = ordre de cette liste.
import * as debutC101 from "./debut-c1-01.js";
import * as debutC102 from "./debut-c1-02.js";
import * as debutC103 from "./debut-c1-03.js";
import * as debutC104 from "./debut-c1-04.js";
import * as debutC105 from "./debut-c1-05.js";
import * as debutC106 from "./debut-c1-06.js";
import * as debutC201 from "./debut-c2-01.js";
import * as debutC202 from "./debut-c2-02.js";
import * as debutC203 from "./debut-c2-03.js";
import * as debutC204 from "./debut-c2-04.js";
import * as debutC205 from "./debut-c2-05.js";
import * as debutC206 from "./debut-c2-06.js";
import * as debutC301 from "./debut-c3-01.js";
import * as debutC302 from "./debut-c3-02.js";
import * as debutC303 from "./debut-c3-03.js";

export const LECONS = [
  debutC101,
  debutC102,
  debutC103,
  debutC104,
  debutC105,
  debutC106,
  debutC201,
  debutC202,
  debutC203,
  debutC204,
  debutC205,
  debutC206,
  debutC301,
  debutC302,
  debutC303,
];

export default {
  id: "debut",
  title: "Premiers pas",
  icon: "🌱",
  color: "#2A8FA8",
  colorL: "#E3F3F7",
  desc: "Posture, accordage, premiers accords, lire une tablature",
  prelude: true,
  unites: ["Prendre en main", "Premiers accords", "Lire une tablature"],
};
