// Taille de la vérification de fin d'unité : 2 questions par leçon, entre 6
// et 12 (pathEngine.unitCheckSize), seuil de 70 % inchangé, rappel
// proportionnel (unitCheckSampler.buildSample). Sur le contenu réel.
import { test } from "node:test";
import assert from "node:assert/strict";
import {
  unitCheckSize, bonnesReponsesRequises, buildUnits, buildPath,
  UNIT_CHECK_PASS_PCT, UNIT_CHECK_MIN_QUESTIONS, UNIT_CHECK_MAX_QUESTIONS,
} from "../src/store/pathEngine.js";
import { buildSample, MAX_RAPPEL } from "../src/store/unitCheckSampler.js";
import { COURSES, QUIZ, EXERCISES } from "../src/content/index.js";
import { defaultState } from "../src/store/state.js";

const content = { courses: COURSES, quiz: QUIZ, exercises: EXERCISES };

test("formule : min(12, max(6, 2 × leçons))", () => {
  const attendu = { 0: 6, 1: 6, 2: 6, 3: 6, 4: 8, 5: 10, 6: 12, 7: 12, 8: 12, 20: 12 };
  for (const [n, q] of Object.entries(attendu)) assert.equal(unitCheckSize(Number(n)), q, `${n} leçons`);
  assert.equal(unitCheckSize(undefined), UNIT_CHECK_MIN_QUESTIONS);
  for (let n = 0; n <= 30; n++) {
    const q = unitCheckSize(n);
    assert.ok(q >= UNIT_CHECK_MIN_QUESTIONS && q <= UNIT_CHECK_MAX_QUESTIONS);
    if (n > 0) assert.ok(q >= unitCheckSize(n - 1), "croissante");
  }
});

test("seuil : bonnes réponses requises cohérentes avec le pourcentage arrondi de l'écran", () => {
  assert.equal(UNIT_CHECK_PASS_PCT, 70);
  assert.deepEqual([6, 8, 10, 12].map(bonnesReponsesRequises), [5, 6, 7, 9]);
  for (let n = 1; n <= 15; n++) {
    const k = bonnesReponsesRequises(n);
    assert.ok(Math.round((k / n) * 100) >= UNIT_CHECK_PASS_PCT, `${k}/${n} valide`);
    if (k > 0) assert.ok(Math.round(((k - 1) / n) * 100) < UNIT_CHECK_PASS_PCT, `${k - 1}/${n} ne valide pas`);
  }
  // Au plancher, une erreur permise, pas deux.
  assert.equal(6 - bonnesReponsesRequises(6), 1);
});

test("contenu réel : chaque unité du parcours vise 2 questions par leçon, bornées", () => {
  for (const u of buildUnits(COURSES).filter(x => !x.annexe)) {
    assert.equal(u.checkSize, unitCheckSize(u.lessons.length), u.id);
    assert.ok(u.checkSize >= 6 && u.checkSize <= 12, `${u.id} : ${u.checkSize}`);
  }
});

test("contenu réel, meilleur cas : l'échantillon atteint la cible, rappel ≤ ⌊cible/4⌋, sans doublon ni contenu non vu", () => {
  const units = buildUnits(COURSES).filter(x => !x.annexe);
  const niveau = new Map(COURSES.flatMap(c => c.lessons.map(l => [l.id, l.level])));
  const completed = {};
  for (const u of units) {
    const ech = buildSample(u, content, completed);
    assert.equal(ech.length, u.checkSize, `${u.id} : ${ech.length}/${u.checkSize}`);
    assert.equal(new Set(ech.map(q => q.id)).size, ech.length, u.id);
    const ids = new Set(u.lessons.map(l => l.id));
    // Le cœur = les quiz cités par les leçons de l'unité (y compris des
    // questions de révision rattachées à des leçons plus anciennes).
    const coeur = new Set(u.lessons.flatMap(l => l.quiz || []));
    for (const q of ech) assert.ok(coeur.has(q.id) || !q.lessonId || ids.has(q.lessonId) || completed[q.lessonId], `${u.id} : ${q.id} non vu`);
    const rappels = ech.filter(q => !coeur.has(q.id) && u.level != null && niveau.get(q.lessonId) < u.level);
    assert.ok(rappels.length <= Math.min(MAX_RAPPEL, Math.floor(u.checkSize / 4)), `${u.id} : ${rappels.length} rappels`);
    for (const l of u.lessons) completed[l.id] = "2027-01-01";
  }
});

test("le rappel existe dès qu'il y a un palier antérieur complété (petite vérification comprise)", () => {
  const units = buildUnits(COURSES).filter(x => !x.annexe);
  const cible = units.find(u => u.level >= 3 && u.checkSize >= 8);
  const completed = {};
  for (const u of units) { if (u === cible) break; for (const l of u.lessons) completed[l.id] = "2027-01-01"; }
  const niveau = new Map(COURSES.flatMap(c => c.lessons.map(l => [l.id, l.level])));
  const coeur = new Set(cible.lessons.flatMap(l => l.quiz || []));
  let vu = false;
  for (let i = 0; i < 10 && !vu; i++) {
    vu = buildSample(cible, content, completed).some(q => !coeur.has(q.id) && niveau.get(q.lessonId) < cible.level);
  }
  assert.ok(vu, `${cible.id} : au moins un rappel`);
});

test("une vérification réussie sous l'ancienne taille (15 questions) reste acquise", () => {
  const units = buildUnits(COURSES).filter(x => !x.annexe);
  const u = units.find(x => !x.prelude);
  const completedLessons = Object.fromEntries(u.lessons.map(l => [l.id, "2026-10-01"]));
  const state = {
    ...defaultState(),
    onboarding: { ...defaultState().onboarding, done: true, experience: "joue" },
    completedLessons,
    unitChecks: { [u.id]: { passed: true, best: 73, attempts: 2, lastAttemptAt: "2026-10-01" } },
  };
  const p = buildPath(content, state).find(x => x.id === u.id);
  assert.equal(p.complete, true);
  assert.equal(p.needsCheck, false);
  assert.equal(p.bonusClaimable, true);
});
