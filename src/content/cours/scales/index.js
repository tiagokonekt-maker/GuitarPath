// ═══════════════════════════════════════════════════════════════════════
// MODULE 2 — GAMMES & MODES
// ═══════════════════════════════════════════════════════════════════════
// Ordre des leçons = ordre de cette liste.
import * as scalesC101 from "./scales-c1-01.js";
import * as scalesC102 from "./scales-c1-02.js";
import * as scalesC103 from "./scales-c1-03.js";
import * as scalesC104 from "./scales-c1-04.js";
import * as scalesC105 from "./scales-c1-05.js";
import * as scalesC106 from "./scales-c1-06.js";
import * as scalesC201 from "./scales-c2-01.js";
import * as scalesC202 from "./scales-c2-02.js";
import * as scalesC203 from "./scales-c2-03.js";
import * as scalesC204 from "./scales-c2-04.js";
import * as scalesC205 from "./scales-c2-05.js";
import * as scalesC301 from "./scales-c3-01.js";
import * as scalesC302 from "./scales-c3-02.js";
import * as scalesC303 from "./scales-c3-03.js";
import * as scalesC304 from "./scales-c3-04.js";
import * as scalesC305 from "./scales-c3-05.js";
import * as scalesC306 from "./scales-c3-06.js";
import * as scalesC307 from "./scales-c3-07.js";
import * as scalesC401 from "./scales-c4-01.js";
import * as scalesC402 from "./scales-c4-02.js";
import * as scalesC403 from "./scales-c4-03.js";
import * as scalesC501 from "./scales-c5-01.js";
import * as scalesC502 from "./scales-c5-02.js";
import * as scalesC503 from "./scales-c5-03.js";
import * as scalesC504 from "./scales-c5-04.js";
import * as scalesC505 from "./scales-c5-05.js";
import * as scalesC506 from "./scales-c5-06.js";
import * as scalesC507 from "./scales-c5-07.js";
import * as scales3nps01 from "./scales-3nps-01.js";
import * as scalesC601 from "./scales-c6-01.js";
import * as scalesC602 from "./scales-c6-02.js";
import * as scalesC603 from "./scales-c6-03.js";

export const LECONS = [
  scalesC101,
  scalesC102,
  scalesC103,
  scalesC104,
  scalesC105,
  scalesC106,
  scalesC201,
  scalesC202,
  scalesC203,
  scalesC204,
  scalesC205,
  scalesC301,
  scalesC302,
  scalesC303,
  scalesC304,
  scalesC305,  // palier 6 : pentatonique position 2 (suite de scales-c3-02, position 1)
  scalesC306,  // palier 6 : positions 3, 4 et 5
  scalesC307,  // palier 6 : relier les 5 positions
  scalesC401,
  scalesC402,
  scalesC403,
  scalesC501,
  scalesC502,
  scalesC503,
  scalesC504,
  scalesC505,
  scalesC506,
  scalesC507,
  scales3nps01, // palier 8, lot 4 : formes 3NPS, après les sept modes
  scalesC601,
  scalesC602,
  scalesC603,
];

export default {
  id: "scales",
  title: "Gammes & modes",
  icon: "🎼",
  color: "#1D9E75",
  colorL: "#E1F5EE",
  desc: "Pentatoniques, gamme majeure, 7 modes en profondeur",
};
