import { test } from "node:test";
import assert from "node:assert/strict";
import { levelFromXp, totalXpForLevel, xpNeededForLevel, levelProgress, sanitizeXp, MAX_LEVEL }
  from "../src/store/leveling.js";

test("la courbe est monotone et plafonnée", () => {
  for (let n = 1; n < 40; n++) {
    assert.ok(xpNeededForLevel(n) <= xpNeededForLevel(n + 1));
    assert.ok(xpNeededForLevel(n) <= 500);
  }
});

test("levelFromXp et totalXpForLevel sont réciproques", () => {
  for (let n = 1; n <= MAX_LEVEL; n++) {
    const floor = totalXpForLevel(n);
    assert.equal(levelFromXp(floor), n, `plancher du niveau ${n}`);
    if (n < MAX_LEVEL) assert.equal(levelFromXp(floor - 1), n - 1 || 1);
  }
});

test("le grade maximum est atteignable avec le contenu de l'app", () => {
  // Contenu mesuré : 108 leçons × 30 + 6 465 (quiz) + ~2 500 (exercices)
  // + ~1 080 (coffres) ≈ 13 300 XP unique.
  const XP_CONTENU = 13300;
  assert.ok(totalXpForLevel(30) < XP_CONTENU,
    `niveau 30 = ${totalXpForLevel(30)} XP, doit rester sous ${XP_CONTENU}`);
});

test("le placement ne peut pas créditer plus de 15 % de l'XP du contenu", () => {
  assert.ok(totalXpForLevel(8) < 13300 * 0.15,
    `placement max = ${totalXpForLevel(8)} XP`);
});

test("les entrées corrompues ne donnent jamais un niveau élevé", () => {
  // Avant : levelFromXp(Infinity) === 501 → grade « Star légendaire ».
  for (const v of [Infinity, -Infinity, NaN, -500, null, undefined, "abc", {}, []]) {
    assert.equal(levelFromXp(v), 1, `levelFromXp(${String(v)})`);
  }
  assert.ok(levelFromXp(10 ** 12) <= MAX_LEVEL);
  assert.equal(sanitizeXp(Infinity), 0);
  assert.equal(sanitizeXp(-1), 0);
  assert.equal(sanitizeXp("250"), 250);
});

test("levelProgress reste dans les bornes", () => {
  for (const xp of [0, 1, 119, 120, 5000, 12500, 10 ** 9]) {
    const p = levelProgress(xp);
    assert.ok(p.pct >= 0 && p.pct <= 100, `pct=${p.pct} pour ${xp}`);
    assert.ok(p.xpInLevel >= 0);
    assert.ok(p.xpToNext >= 0);
  }
  assert.equal(levelProgress(totalXpForLevel(MAX_LEVEL)).isMax, true);
});
