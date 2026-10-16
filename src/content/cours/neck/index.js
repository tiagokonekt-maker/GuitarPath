// ═══════════════════════════════════════════════════════════════════════
// MODULE 1 — VISUALISATION DU MANCHE
// ═══════════════════════════════════════════════════════════════════════
// Ordre des leçons = ordre de cette liste.
import * as neck03 from "./neck-03.js";
import * as neck04 from "./neck-04.js";
import * as neck05 from "./neck-05.js";
import * as neck06 from "./neck-06.js";
import * as neckC101 from "./neck-c1-01.js";
import * as neckC102 from "./neck-c1-02.js";
import * as neckC103 from "./neck-c1-03.js";
import * as neckC201 from "./neck-c2-01.js";
import * as neckC202 from "./neck-c2-02.js";
import * as neckC203 from "./neck-c2-03.js";
import * as neckC204 from "./neck-c2-04.js";
import * as neckC205 from "./neck-c2-05.js";
import * as neckC301 from "./neck-c3-01.js";
import * as neckC302 from "./neck-c3-02.js";
import * as neckC303 from "./neck-c3-03.js";
import * as neckPow01 from "./neck-pow-01.js";

export const LECONS = [
  neck03,
  neck04,
  neck05,
  neck06,
  neckC101,
  neckC102,
  neckC103,
  neckC201,
  neckC202,
  neckPow01,   // palier 3 : power chords (fondamentale corde 6 ou 5, après neck-c2-01/02)
  neckC203,
  neckC204,
  neckC205,
  neckC301,
  neckC302,
  neckC303,
];

export default {
  id: "neck",
  title: "Visualisation du manche",
  icon: "🗺️",
  color: "#BA7517",
  colorL: "#FAEEDA",
  desc: "Cartographier le manche, intervalles, CAGED, connexions",
};
