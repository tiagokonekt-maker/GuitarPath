import { test } from "node:test";
import assert from "node:assert/strict";
import { buildPath, idUniteAvantScission } from "../src/store/pathEngine.js";
import { COURSES, QUIZ, EXERCISES } from "../src/content/index.js";
import { defaultState } from "../src/store/state.js";

const content = { courses: COURSES, quiz: QUIZ, exercises: EXERCISES };

test("identifiant d'avant scission", () => {
  assert.equal(idUniteAvantScission("palier-2-1"), "palier-2");
  assert.equal(idUniteAvantScission("palier-2"), null);
  assert.equal(idUniteAvantScission("debut-1"), null);
});

// Les paliers 2 à 4 ont été scindés en ajoutant des leçons : un joueur qui
// avait réussi la vérification de « palier-2 » (et ouvert son coffre) ne doit
// ni la repasser, ni voir le coffre reproposé, ni perdre l'ouverture du palier 3.
test("une vérification réussie sous l'ancien identifiant vaut pour chaque partie", () => {
  const s = defaultState();
  s.onboarding = { ...s.onboarding, done: true, experience: "intermediaire" };
  const unites = buildPath(content, s);
  const parts = unites.filter(u => u.id.startsWith("palier-2-"));
  assert.ok(parts.length >= 2, "le palier 2 est bien scindé");
  for (const u of unites.filter(u => /^palier-[12](-|$)/.test(u.id))) for (const l of u.lessons) s.completedLessons[l.id] = "2026-09-01";
  s.unitChecks = { "palier-1": { passed: true, best: 90, lastAttemptAt: "2026-09-01" }, "palier-2": { passed: true, best: 85, lastAttemptAt: "2026-09-02" } };
  s.claimedUnits = { "palier-1": "2026-09-01", "palier-2": "2026-09-02" };
  const apres = buildPath(content, s);
  for (const u of apres.filter(u => u.id.startsWith("palier-2-"))) {
    assert.equal(u.check?.passed, true, `${u.id} : vérification héritée`);
    assert.equal(u.bonusClaimed, true, `${u.id} : coffre déjà ouvert`);
    assert.equal(u.bonusClaimable, false);
  }
  assert.ok(apres.find(u => u.id.startsWith("palier-3")).unlocked, "le palier 3 reste ouvert");
});
