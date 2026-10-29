// Groply — test/exercices-couverture.test.mjs
// Chaque leçon du parcours (Premiers pas et paliers 1 à 9) a au moins un
// exercice « guitare en main » qui lui est rattaché : `courseLink` = l'id de
// la leçon, et `unlockedBy` (s'il est donné) la contient. Les leçons
// d'annexe (champ `annexe`) ne sont pas concernées.
import { test } from "node:test";
import assert from "node:assert/strict";
import { COURSES, EXERCISES } from "../src/content/index.js";
import { CHALLENGE_TYPES } from "../src/fretboardValidator.js";
import { SCALES, CHORD_TYPES } from "../src/fretboardUtils.js";

const MODULES = ["debut", "neck", "scales", "harmony", "rhythm", "impro"];
const lecons = COURSES
  .filter(c => MODULES.includes(c.id))
  .flatMap(c => c.lessons)
  .filter(l => !l.annexe && Number.isInteger(l.level) && l.level >= 0 && l.level <= 9);

test("chaque leçon des paliers 0 à 9 a au moins un exercice rattaché", () => {
  const sans = lecons.filter(l => !EXERCISES.some(e =>
    e.courseLink === l.id && (!e.unlockedBy?.length || e.unlockedBy.includes(l.id))));
  assert.deepEqual(sans.map(l => l.id), []);
});

test("identifiants d'exercice uniques", () => {
  const ids = EXERCISES.map(e => e.id);
  assert.equal(new Set(ids).size, ids.length);
});

test("unlockedBy contient la leçon liée", () => {
  for (const e of EXERCISES) if (e.courseLink && e.unlockedBy?.length) {
    assert.ok(e.unlockedBy.includes(e.courseLink), `${e.id} : unlockedBy sans ${e.courseLink}`);
  }
});

test("champs requis : exercice guidé ou exercice sur le manche", () => {
  for (const e of EXERCISES) {
    assert.ok(e.title && e.mod && e.lvl >= 1 && e.lvl <= 3 && e.dur > 0 && e.xp > 0, e.id);
    assert.ok(typeof e.tip === "string" && e.tip.length > 0, `${e.id} : tip`);
    if (e.type === "fretboard_exercise") {
      assert.ok(Array.isArray(e.stages) && e.stages.length > 0, `${e.id} : stages`);
      for (const s of e.stages) {
        const c = s.concept || {};
        assert.ok(CHALLENGE_TYPES[c.type], `${e.id} : type ${c.type}`);
        if (c.type === "find_scale") assert.ok(SCALES[c.quality], `${e.id} : gamme ${c.quality}`);
        if (c.type === "find_chord") assert.ok(CHORD_TYPES[c.quality], `${e.id} : accord ${c.quality}`);
        if (c.type === "find_interval") assert.ok(Number.isInteger(c.interval) && c.interval >= 0 && c.interval < 12, `${e.id} : intervalle`);
        assert.ok(s.instruction && s.exp, `${e.id} : consigne et explication`);
      }
    } else {
      assert.ok(Array.isArray(e.steps) && e.steps.length >= 3, `${e.id} : au moins 3 étapes`);
    }
  }
});
