import { test } from "node:test";
import assert from "node:assert/strict";
import {
  buildPlacementQueue, availableModules, pickQuestion, startFromScore, computeModuleTier,
  computeOverallTier, weakestModule, dailyTargetFromTime, placementQuestionCount,
  MAX_STARTING_LEVEL, TESTABLE_MODULES,
} from "../src/store/placementEngine.js";
import { totalXpForLevel } from "../src/store/leveling.js";

const banque = (modules, levels = [1, 2, 3]) =>
  modules.flatMap(m => levels.flatMap(lvl => [
    { id: `${m}-${lvl}-a`, courseId: m, lvl, o: ["a", "b", "c", "d"], a: 0 },
    { id: `${m}-${lvl}-b`, courseId: m, lvl, o: ["a", "b", "c", "d"], a: 1 },
  ]));

test("l'impro entre dans le test dès qu'elle a des questions", () => {
  // Avant le retag du contenu, aucune question ne portait courseId "impro" :
  // l'objectif n°1 du produit était le seul module non évalué.
  assert.ok(availableModules(banque(TESTABLE_MODULES)).includes("impro"));
});

test("un module sans contenu suffisant est écarté proprement", () => {
  const b = [...banque(["neck", "scales"]), { id: "i-1", courseId: "impro", lvl: 1, o: ["a", "b"], a: 0 }];
  const mods = availableModules(b);
  assert.ok(!mods.includes("impro"), "impro n'a de questions qu'au palier 1");
  assert.deepEqual(mods, ["neck", "scales"]);
  // Et la file ne contient pas de trous.
  const queue = buildPlacementQueue(b);
  assert.equal(queue.length, 6);
  assert.ok(queue.every(x => mods.includes(x.moduleId)));
});

test("la file monte en difficulté globalement, pas module par module", () => {
  const queue = buildPlacementQueue(banque(TESTABLE_MODULES));
  const niveaux = queue.map(x => x.lvl);
  for (let i = 1; i < niveaux.length; i++) assert.ok(niveaux[i] >= niveaux[i - 1]);
  assert.equal(placementQuestionCount(banque(TESTABLE_MODULES)), 15);
});

test("le placement ne peut plus créditer la moitié de l'XP du contenu", () => {
  // Avant : jusqu'à 6 650 XP pour 12 QCM.
  const parfait = startFromScore(15, 15);
  assert.equal(parfait.level, MAX_STARTING_LEVEL);
  assert.equal(parfait.startXp, totalXpForLevel(MAX_STARTING_LEVEL));
  assert.ok(parfait.startXp < 2000, `startXp = ${parfait.startXp}`);
});

test("le mapping score → niveau est continu et borné", () => {
  assert.equal(startFromScore(0, 12).level, 1);
  assert.ok(startFromScore(3, 12).level < startFromScore(9, 12).level);
  assert.equal(startFromScore(12, 12).level, MAX_STARTING_LEVEL);
  // Robustesse : division par zéro, valeurs absurdes
  assert.equal(startFromScore(0, 0).level, 1);
  assert.equal(startFromScore(99, 12).level, MAX_STARTING_LEVEL);
  assert.equal(startFromScore(-5, 12).level, 1);
});

test("le tier d'un module vient du nombre de bonnes réponses", () => {
  assert.equal(computeModuleTier(0), "A1");
  assert.equal(computeModuleTier(3), "B2");
  assert.equal(computeModuleTier(99), "B2");
  assert.equal(computeModuleTier(undefined), "A1");
});

test("le module le plus faible est identifié parmi les modules testés", () => {
  const levels = { neck: "B2", scales: "A2", harmony: "B1", rhythm: "A1", impro: "B1" };
  assert.equal(weakestModule(levels), "rhythm");
  assert.equal(weakestModule(levels, ["neck", "harmony"]), "harmony");
  assert.equal(computeOverallTier(levels), "B1");
  assert.equal(weakestModule({}), null);
});

test("pickQuestion ne ressort jamais une question déjà posée", () => {
  const b = banque(["neck"]);
  const used = new Set();
  const a = pickQuestion(b, "neck", 1, used); used.add(a.id);
  const c = pickQuestion(b, "neck", 1, used); used.add(c.id);
  assert.notEqual(a.id, c.id);
  assert.equal(pickQuestion(b, "neck", 1, used), null, "stock épuisé → null, pas de doublon");
});

test("le temps déclaré dimensionne la session du jour", () => {
  assert.ok(dailyTargetFromTime("short") < dailyTargetFromTime("long"));
  assert.equal(dailyTargetFromTime(undefined), dailyTargetFromTime("medium"));
});
