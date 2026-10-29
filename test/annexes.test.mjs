// Annexes : leçons facultatives (changer ses cordes, régler son ampli,
// écrire un premier morceau). Elles forment une unité placée après le
// palier 9, toujours ouverte, jamais courante, sans vérification ni coffre,
// et ne changent RIEN au reste du parcours. Voir pathEngine.estModuleAnnexe.
import { test } from "node:test";
import assert from "node:assert/strict";
import {
  buildUnits, buildPath, getNextLesson, getPathStats, debutFacultatif, estModuleAnnexe,
  UNITES_AJOUTEES, idUniteAvantScission, DATE_ENTRELACEMENT,
} from "../src/store/pathEngine.js";
import { availableModules, buildPlacementQueue, TESTABLE_MODULES } from "../src/store/placementEngine.js";
import { validerCartes } from "../src/lecon/cartes.js";
import { BADGES } from "../src/store/badges.js";
import { COURSES, QUIZ, EXERCISES } from "../src/content/index.js";
import { defaultState } from "../src/store/state.js";

const content = { courses: COURSES, quiz: QUIZ, exercises: EXERCISES };
const sansAnnexes = { ...content, courses: COURSES.filter(c => !estModuleAnnexe(c)) };
const annexes = COURSES.find(c => c.id === "annexes");
const quizParId = new Map(QUIZ.map(q => [q.id, q]));

const joueur = (extra = {}) => ({
  ...defaultState(),
  onboarding: { ...defaultState().onboarding, done: true, experience: "joue" },
  ...extra,
});
const debutant = (extra = {}) => ({
  ...defaultState(),
  onboarding: { ...defaultState().onboarding, done: true, experience: "debutant" },
  ...extra,
});
/** Fait les `n` premières leçons proposées par getNextLesson (vérifications réussies au passage). */
function progresser(state, n, date = "2027-01-10") {
  let s = state;
  for (let pas = 0; pas < n; pas++) {
    const nx = getNextLesson(content, s);
    if (!nx) break;
    if (nx.needsCheck) s = { ...s, unitChecks: { ...s.unitChecks, [nx.unit.id]: { passed: true, attempts: 1, lastAttemptAt: date } } };
    else s = { ...s, completedLessons: { ...s.completedLessons, [nx.lesson.id]: date } };
  }
  return s;
}
const sansChampsAnnexe = (u) => ({ id: u.id, unlocked: u.unlocked, isCurrent: u.isCurrent, optional: u.optional,
  complete: u.complete, needsCheck: u.needsCheck, bonusClaimable: u.bonusClaimable, index: u.index,
  lessons: u.lessons.map(l => l.id) });

// ── Le contenu ────────────────────────────────────────────────────────────

test("le module annexes existe, facultatif, avec ses 3 leçons", () => {
  assert.ok(annexes, "module annexes enregistré dans src/content/index.js");
  assert.equal(annexes.facultatif, true);
  assert.ok(!annexes.prelude);
  assert.deepEqual(annexes.lessons.map(l => l.id), ["annexes-cordes", "annexes-ampli", "annexes-morceau"]);
});

test("chaque leçon d'annexe : 6 à 10 cartes, ≥ 3 questions -annexe, un « À toi de jouer », un récap, un gropiTip", () => {
  for (const l of annexes.lessons) {
    assert.equal(l.annexe, true, l.id);
    assert.equal(l.level, undefined, `${l.id} : pas de palier`);
    const { erreurs, alertes } = validerCartes(l, quizParId);
    assert.deepEqual(erreurs, [], l.id);
    assert.deepEqual(alertes, [], l.id);
    assert.ok(l.cartes.length >= 6 && l.cartes.length <= 10, `${l.id} : ${l.cartes.length} cartes`);
    const propres = QUIZ.filter(q => q.lessonId === l.id);
    assert.ok(propres.length >= 3, `${l.id} : ${propres.length} questions`);
    for (const q of propres) {
      assert.match(q.id, /-annexe$/, q.id);
      assert.equal(q.courseId, "annexes", q.id);
      assert.ok(l.quiz.includes(q.id), `${q.id} dans le quiz de ${l.id}`);
    }
    assert.ok(l.cartes.filter(c => c.type === "question").length >= 3, `${l.id} : questions au fil des cartes`);
    assert.ok(l.cartes.some(c => c.type === "a-toi"), l.id);
    assert.equal(l.cartes.at(-1).type, "recap", l.id);
    assert.ok(typeof l.gropiTip === "string" && l.gropiTip.length > 0 && l.gropiTip.length <= 220, l.id);
  }
});

test("les questions d'annexe n'entrent pas dans le test de placement", () => {
  assert.ok(!TESTABLE_MODULES.includes("annexes"));
  assert.ok(!availableModules(QUIZ).includes("annexes"));
  for (let i = 0; i < 5; i++) assert.ok(buildPlacementQueue(QUIZ).every(x => x.moduleId !== "annexes"));
});

// ── Le parcours ne bouge pas ──────────────────────────────────────────────

test("identifiants, ordre et contenu des unités de palier inchangés par les annexes", () => {
  for (const state of [null, joueur(), debutant()]) {
    const avec = buildUnits(COURSES, state);
    const sans = buildUnits(sansAnnexes.courses, state);
    assert.deepEqual(
      avec.filter(u => !u.annexe).map(u => [u.id, u.lessons.map(l => l.id), u.checkSize, u.bonusXp]),
      sans.map(u => [u.id, u.lessons.map(l => l.id), u.checkSize, u.bonusXp]));
    // L'unité Annexes vient en dernier : les index des autres ne bougent pas.
    assert.equal(avec.at(-1).id, "annexes");
    assert.equal(avec.filter(u => u.annexe).length, 1);
    // Ancien découpage (compatibilité) : idem.
    assert.deepEqual(
      buildUnits(COURSES, state, { regroupementHistorique: true }).filter(u => !u.annexe).map(u => u.id),
      buildUnits(sansAnnexes.courses, state, { regroupementHistorique: true }).map(u => u.id));
  }
});

test("règles de compatibilité intactes : UNITES_AJOUTEES, idUniteAvantScission", () => {
  assert.equal(UNITES_AJOUTEES.annexes, undefined);
  assert.equal(idUniteAvantScission("annexes"), null);
});

test("statuts du parcours identiques avec ou sans annexes, à toutes les étapes", () => {
  const AVANT = "2026-01-10";
  assert.ok(AVANT < DATE_ENTRELACEMENT);
  const etats = [
    defaultState(), joueur(), debutant(),
    progresser(debutant(), 25), progresser(joueur(), 60),
    joueur({ onboarding: { ...joueur().onboarding, overallTier: "B2" } }),
    // Progression d'avant l'entrelacement (leconsOuvertesHistorique).
    progresser(debutant(), 40, AVANT),
  ];
  for (const s of etats) {
    // Même en ayant lu toutes les annexes : rien ne change ailleurs.
    const avecLues = { ...s, completedLessons: { ...s.completedLessons,
      ...Object.fromEntries(annexes.lessons.map(l => [l.id, "2027-02-01"])) } };
    for (const st of [s, avecLues]) {
      const avec = buildPath(content, st).filter(u => !u.annexe).map(sansChampsAnnexe);
      const sans = buildPath(sansAnnexes, st).map(sansChampsAnnexe);
      assert.deepEqual(avec, sans);
    }
  }
});

test("l'unité Annexes : toujours ouverte, facultative, jamais courante, sans vérification ni coffre", () => {
  for (const s of [defaultState(), debutant(), joueur(), progresser(debutant(), 30)]) {
    const u = buildPath(content, s).find(x => x.id === "annexes");
    assert.equal(u.unlocked, true);
    assert.equal(u.optional, true);
    assert.equal(u.isCurrent, false);
    assert.equal(u.needsCheck, false);
    assert.equal(u.bonusClaimable, false);
    assert.equal(u.bonusXp, 0);
    assert.equal(u.checkSize, 0);
  }
  // Toutes les annexes lues : complète, mais toujours ni vérification ni coffre.
  const lues = Object.fromEntries(annexes.lessons.map(l => [l.id, "2027-02-01"]));
  const u = buildPath(content, debutant({ completedLessons: lues })).find(x => x.id === "annexes");
  assert.equal(u.complete, true);
  assert.equal(u.needsCheck, false);
  assert.equal(u.bonusClaimable, false);
});

test("getNextLesson ne propose jamais une annexe, même vérification en attente ou parcours fini", () => {
  let s = debutant();
  for (let pas = 0; pas < 400; pas++) {
    const nx = getNextLesson(content, s);
    if (!nx) break;
    assert.ok(!nx.unit.annexe, `pas ${pas} : annexe proposée`);
    if (nx.lesson) assert.ok(!nx.lesson.annexe, nx.lesson.id);
    s = progresser(s, 1);
  }
  assert.equal(getNextLesson(content, s), null, "parcours terminé sans lire les annexes");
});

test("getPathStats ignore les annexes (100 % atteignable sans elles)", () => {
  const s = defaultState();
  const avec = getPathStats(content, s);
  const sans = getPathStats(sansAnnexes, s);
  assert.equal(avec.totalLessons, sans.totalLessons);
  assert.equal(avec.units, sans.units);
  assert.ok(!avec.currentUnit?.annexe);
});

test("lire une annexe ne rend pas « Premiers pas » facultatif pour un débutant", () => {
  const s = { ...defaultState(), completedLessons: { "annexes-cordes": "2027-01-01" } };
  assert.equal(debutFacultatif(s, buildUnits(COURSES, s)), false);
  assert.equal(debutFacultatif(s), false, "même sans les unités (repli sur le préfixe)");
  const path = buildPath(content, s);
  assert.equal(path.find(u => u.isCurrent)?.id, "debut-1");
});

test("le badge « 5 modules finis » n'exige pas les annexes", () => {
  const badge = BADGES.find(b => b.id === "all_modules");
  const completedLessons = {};
  for (const c of COURSES) if (!estModuleAnnexe(c)) for (const l of c.lessons) completedLessons[l.id] = "2027-01-01";
  assert.equal(badge.cond({ ...defaultState(), completedLessons }, content), true);
});
