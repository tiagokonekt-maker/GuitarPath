// Les contrastes sont une propriété VÉRIFIABLE du design system : autant les
// tester. Ce fichier échoue si quelqu'un « ajuste » une couleur et repasse
// sous le seuil AA sans s'en rendre compte.
import { test } from "node:test";
import assert from "node:assert/strict";
import { LIGHT, DARK } from "../src/design/tokens.js";

const canal = (c) => { const s = c / 255; return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4; };
const lum = (hex) => {
  const h = hex.replace("#", "");
  const [r, g, b] = [0, 2, 4].map(i => parseInt(h.substr(i, 2), 16));
  return 0.2126 * canal(r) + 0.7152 * canal(g) + 0.0722 * canal(b);
};
export const ratio = (a, b) => {
  const [l1, l2] = [lum(a), lum(b)];
  const [hi, lo] = [Math.max(l1, l2), Math.min(l1, l2)];
  return (hi + 0.05) / (lo + 0.05);
};

const THEMES = [["LIGHT", LIGHT], ["DARK", DARK]];
const ACCENTS = ["amber", "green", "purple", "pink", "coral", "blue", "teal", "danger"];

const AA = 4.5;          // WCAG 1.4.3 texte normal
const AA_NON_TEXTE = 3;  // WCAG 1.4.11 composants d'interface

for (const [nom, C] of THEMES) {
  test(`${nom} — les textes atteignent AA sur le fond ET sur les cartes`, () => {
    for (const cle of ["text", "text2", "text3"]) {
      for (const fond of ["bg", "surface"]) {
        const r = ratio(C[cle], C[fond]);
        assert.ok(r >= AA, `${nom}.${cle} sur ${fond} = ${r.toFixed(2)}:1`);
      }
    }
  });

  test(`${nom} — le texte des boutons primaires atteint AA`, () => {
    const encre = nom === "LIGHT" ? "#FFFFFF" : "#18130F";
    const r = ratio(encre, C.primaryBtn);
    assert.ok(r >= AA, `texte sur primaryBtn = ${r.toFixed(2)}:1`);
  });

  test(`${nom} — chaque accent a une variante d'encre lisible`, () => {
    for (const a of ACCENTS) {
      const r = ratio(C[`${a}Ink`], C.surface);
      assert.ok(r >= AA, `${nom}.${a}Ink sur surface = ${r.toFixed(2)}:1`);
    }
  });

  test(`${nom} — le texte des encarts teintés est lisible sur son fond`, () => {
    for (const a of ACCENTS.filter(x => x !== "danger")) {
      const r = ratio(C[`${a}D`], C[`${a}L`]);
      assert.ok(r >= AA, `${nom}.${a}D sur ${a}L = ${r.toFixed(2)}:1`);
    }
  });

  test(`${nom} — bordures de contrôle et anneau de focus atteignent 3:1`, () => {
    for (const fond of ["bg", "surface"]) {
      assert.ok(ratio(C.borderStrong, fond === "bg" ? C.bg : C.surface) >= AA_NON_TEXTE,
        `borderStrong sur ${fond}`);
      assert.ok(ratio(C.focus, fond === "bg" ? C.bg : C.surface) >= AA_NON_TEXTE,
        `focus sur ${fond}`);
    }
  });

  test(`${nom} — aucune clé de couleur ne manque`, () => {
    const requises = ["bg", "surface", "surface2", "border", "borderStrong", "borderSoft",
      "text", "text2", "text3", "primary", "primaryBtn", "primaryInk", "primaryL", "primaryD",
      "focus", "success", "danger"];
    for (const a of ACCENTS) requises.push(a, `${a}Ink`, `${a}L`, `${a}D`, `${a}Border`);
    for (const k of requises) assert.ok(C[k], `${nom}.${k} est absent`);
  });
}

test("les deux thèmes exposent exactement les mêmes clés", () => {
  const l = Object.keys(LIGHT).sort(), d = Object.keys(DARK).sort();
  assert.deepEqual(l, d, "une clé présente dans un seul thème = crash au changement de thème");
});
