import { test } from "node:test";
import assert from "node:assert/strict";
import { LIGHT, DARK } from "../src/design/tokens.js";

const lum = (h) => { const c = h.replace("#", ""); const v = [0, 2, 4].map(i => parseInt(c.slice(i, i + 2), 16) / 255).map(x => x <= .03928 ? x / 12.92 : ((x + .055) / 1.055) ** 2.4); return .2126 * v[0] + .7152 * v[1] + .0722 * v[2]; };
const ratio = (a, b) => { const [x, y] = [lum(a), lum(b)].sort((p, q) => q - p); return (x + .05) / (y + .05); };
const THEMES = { LIGHT, DARK };

for (const [nom, T] of Object.entries(THEMES)) {
  test(`${nom} — onPrimaryBtn existe et le texte des boutons pleins atteint AA (4,5:1) sur primaryBtn`, () => {
    assert.ok(/^#[0-9A-Fa-f]{6}$/.test(T.onPrimaryBtn), "onPrimaryBtn manquant ou mal formé");
    assert.ok(ratio(T.onPrimaryBtn, T.primaryBtn) >= 4.5, `${ratio(T.onPrimaryBtn, T.primaryBtn).toFixed(2)}:1`);
  });
  test(`${nom} — texte et icônes sur un aplat primary ou de module : au moins 3:1 (grande taille, icônes)`, () => {
    for (const k of ["primary", "amber", "green", "purple", "pink", "coral", "blue", "teal", "danger"]) {
      const r = ratio(T.onPrimaryBtn, T[k]);
      assert.ok(r >= 3, `${nom} : onPrimaryBtn sur ${k} = ${r.toFixed(2)}:1`);
    }
  });
}

test("en sombre, le blanc fixe échouerait sur le bouton principal : c'est ce que ce jeton évite", () => {
  assert.ok(ratio("#FFFFFF", DARK.primaryBtn) < 4.5, "le blanc ne passerait pas en sombre");
  assert.ok(ratio(DARK.onPrimaryBtn, DARK.primaryBtn) >= 4.5);
});

test("index.css reste aligné sur tokens.js pour ce jeton", async () => {
  const { readFileSync } = await import("node:fs");
  const css = readFileSync(new URL("../src/index.css", import.meta.url), "utf8");
  const bloc = (re) => re.exec(css)[1];
  const clair = bloc(/:root,\s*\[data-theme="light"\]\s*\{([\s\S]*?)\}/), sombre = bloc(/\[data-theme="dark"\]\s*\{([\s\S]*?)\}/);
  assert.match(clair, new RegExp(`--gr-on-primary-btn:\\s*${LIGHT.onPrimaryBtn}`, "i"));
  assert.match(sombre, new RegExp(`--gr-on-primary-btn:\\s*${DARK.onPrimaryBtn}`, "i"));
});
