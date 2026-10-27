// ═══════════════════════════════════════════════════════════════════════
// MODULE 3 — HARMONIE
// ═══════════════════════════════════════════════════════════════════════
// Ordre des leçons = ordre de cette liste.
import * as harmony03 from "./harmony-03.js";
import * as harmC101 from "./harm-c1-01.js";
import * as harmC102 from "./harm-c1-02.js";
import * as harmC201 from "./harm-c2-01.js";
import * as harmC202 from "./harm-c2-02.js";
import * as harmC203 from "./harm-c2-03.js";
import * as harmC204 from "./harm-c2-04.js";
import * as harmC301 from "./harm-c3-01.js";
import * as harmC302 from "./harm-c3-02.js";
import * as harmC303 from "./harm-c3-03.js";
import * as harmC304 from "./harm-c3-04.js";
import * as harmC401 from "./harm-c4-01.js";
import * as harmC402 from "./harm-c4-02.js";
import * as harmC501 from "./harm-c5-01.js";
import * as harmC502 from "./harm-c5-02.js";
import * as harmC503 from "./harm-c5-03.js";
import * as harmC601 from "./harm-c6-01.js";
import * as harmCapo01 from "./harm-capo-01.js";
import * as harmC602 from "./harm-c6-02.js";
import * as harmC603 from "./harm-c6-03.js";
import * as harmC604 from "./harm-c6-04.js";
import * as harmC701 from "./harm-c7-01.js";
import * as harmC702 from "./harm-c7-02.js";
import * as harmC703 from "./harm-c7-03.js";
import * as harmC801 from "./harm-c8-01.js";
import * as harmC802 from "./harm-c8-02.js";
import * as harmAcc01 from "./harm-acc-01.js";
import * as harmAcc02 from "./harm-acc-02.js";
import * as harmAcc03 from "./harm-acc-03.js";
import * as harmAcc04 from "./harm-acc-04.js";
import * as harmAcc05 from "./harm-acc-05.js";

export const LECONS = [
  harmC101,
  harmC102,
  harmAcc01,   // palier 2 : La, Mi, Ré mineur (accords ouverts)
  harmAcc02,   // palier 3 : E7, A7, D7, B7
  harmAcc03,   // palier 4 : petit Fa puis Fa complet
  harmAcc04,   // palier 4 : barré forme Mi (après le Fa complet)
  harmAcc05,   // palier 4 : barré forme La (après la forme Mi)
  harmC201,
  harmC202,
  harmC203,
  harmC204,
  harmC301,
  harmC302,
  harmony03,   // arpèges : après les accords de 7e (harm-c3-01/02)
  harmC303,
  harmC304,
  harmC401,
  harmC402,
  harmC501,
  harmC502,
  harmC503,
  harmC601,
  harmCapo01,  // palier 5 : capodastre et transposition (après I-IV-V)
  harmC602,
  harmC603,
  harmC604,
  harmC701,
  harmC702,
  harmC703,
  harmC801,
  harmC802,
];

export default {
  id: "harmony",
  title: "Harmonie",
  icon: "🎵",
  color: "#7F77DD",
  colorL: "#EEEDFE",
  desc: "Triades, accords 7, progressions, ciblage en impro",
};
