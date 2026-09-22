import { test } from "node:test";
import assert from "node:assert/strict";
import {
  MASTERY, lessonMastery, masteryStats, prochainesAAncrer, bloquantes,
  questionAncree, questionReussie, revisionsRestantes,
  ANCHOR_DAYS, ANCHOR_RATIO,
} from "../src/store/mastery.js";

const lecon = (quiz = ["q1","q2","q3"]) => ({ id: "l1", level: 1, title: "Test", quiz });
const idx = new Map(["q1","q2","q3","q4","q5"].map(id => [id, { id }]));

const etat = (over = {}) => ({
  completedLessons: {}, quizResults: {}, reviewHistory: {}, ...over,
});
const reussi = (...ids) => Object.fromEntries(ids.map(id => [id, { correct: true, attempts: 1 }]));
const ancre = (...ids) => Object.fromEntries(ids.map(id => [id, { interval: ANCHOR_DAYS, successes: 5, ease: 2.2, lastSeen: "2026-01-01" }]));

test("une leçon non ouverte est au palier 0", () => {
  const m = lessonMastery(lecon(), etat(), idx);
  assert.equal(m.level, MASTERY.LOCKED);
});

test("une leçon lue passe au palier « vu »", () => {
  const m = lessonMastery(lecon(), etat({ completedLessons: { l1: "2026-01-01" } }), idx);
  assert.equal(m.level, MASTERY.SEEN);
  assert.equal(m.label, "Vu");
});

test("« compris » exige TOUTES les questions réussies", () => {
  const base = { completedLessons: { l1: "2026-01-01" } };
  const partiel = lessonMastery(lecon(), etat({ ...base, quizResults: reussi("q1","q2") }), idx);
  assert.equal(partiel.level, MASTERY.SEEN, "2 sur 3 ne suffit pas");
  const complet = lessonMastery(lecon(), etat({ ...base, quizResults: reussi("q1","q2","q3") }), idx);
  assert.equal(complet.level, MASTERY.UNDERSTOOD);
});

test("« ancré » exige 80 % des questions retenues dans la durée", () => {
  const base = { completedLessons: { l1: "2026-01-01" }, quizResults: reussi("q1","q2","q3") };
  // 3 questions → il en faut ceil(3 × 0.8) = 3
  const deux = lessonMastery(lecon(), etat({ ...base, reviewHistory: ancre("q1","q2") }), idx);
  assert.equal(deux.level, MASTERY.UNDERSTOOD);
  const trois = lessonMastery(lecon(), etat({ ...base, reviewHistory: ancre("q1","q2","q3") }), idx);
  assert.equal(trois.level, MASTERY.ANCHORED);
});

test("sur 5 questions, 4 ancrées suffisent", () => {
  const l = lecon(["q1","q2","q3","q4","q5"]);
  const st = etat({
    completedLessons: { l1: "x" },
    quizResults: reussi("q1","q2","q3","q4","q5"),
    reviewHistory: ancre("q1","q2","q3","q4"),
  });
  const m = lessonMastery(l, st, idx);
  assert.equal(m.requisPourAncrer, 4);
  assert.equal(m.level, MASTERY.ANCHORED);
});

test("un intervalle trop court n'ancre pas", () => {
  const st = etat({
    completedLessons: { l1: "x" },
    quizResults: reussi("q1","q2","q3"),
    reviewHistory: Object.fromEntries(["q1","q2","q3"].map(id =>
      [id, { interval: ANCHOR_DAYS - 1, successes: 4, ease: 2.2 }])),
  });
  assert.equal(lessonMastery(lecon(), st, idx).level, MASTERY.UNDERSTOOD);
});

test("un intervalle élevé sans aucune réussite n'ancre pas", () => {
  // Garde-fou contre un état corrompu ou un import bricolé.
  const st = etat({
    completedLessons: { l1: "x" },
    quizResults: reussi("q1","q2","q3"),
    reviewHistory: Object.fromEntries(["q1","q2","q3"].map(id =>
      [id, { interval: 99, successes: 0, ease: 2.2 }])),
  });
  assert.equal(lessonMastery(lecon(), st, idx).level, MASTERY.UNDERSTOOD);
});

test("une leçon sans question plafonne à « vu » et est signalée", () => {
  const m = lessonMastery(lecon([]), etat({ completedLessons: { l1: "x" } }), idx);
  assert.equal(m.level, MASTERY.SEEN);
  assert.equal(m.masterable, false);
  assert.equal(m.total, 0);
});

test("une référence de quiz morte est ignorée, pas comptée", () => {
  const l = lecon(["q1", "q-inexistant"]);
  const st = etat({ completedLessons: { l1: "x" }, quizResults: reussi("q1") });
  const m = lessonMastery(l, st, idx);
  assert.equal(m.total, 1, "la référence morte ne gonfle pas le dénominateur");
  assert.equal(m.level, MASTERY.UNDERSTOOD);
});

test("l'avancement reste entre 0 et 100 et progresse par étapes", () => {
  const base = { completedLessons: { l1: "x" } };
  const p0 = lessonMastery(lecon(), etat(), idx).pct;
  const p1 = lessonMastery(lecon(), etat(base), idx).pct;
  const p2 = lessonMastery(lecon(), etat({ ...base, quizResults: reussi("q1","q2","q3") }), idx).pct;
  const p3 = lessonMastery(lecon(), etat({ ...base, quizResults: reussi("q1","q2","q3"), reviewHistory: ancre("q1","q2","q3") }), idx).pct;
  assert.equal(p0, 0);
  assert.ok(p1 > p0 && p2 > p1 && p3 > p2, `${p0} < ${p1} < ${p2} < ${p3}`);
  assert.equal(p3, 100);
});

test("les agrégats excluent les leçons sans question du dénominateur", () => {
  const content = { courses: [{ id: "m", lessons: [
    { id: "a", quiz: ["q1"] }, { id: "b", quiz: ["q2"] }, { id: "c", quiz: [] },
  ] }], quiz: [{ id: "q1" }, { id: "q2" }] };
  const s = masteryStats(content, etat());
  assert.equal(s.total, 3);
  assert.equal(s.sansQuiz, 1);
  // 2 leçons évaluables × 3 paliers + 1 leçon non évaluable × 1 palier
  assert.equal(s.objectifs, 7);
});

test("les paliers atteints se cumulent correctement", () => {
  const content = { courses: [{ id: "m", lessons: [
    { id: "a", quiz: ["q1"] }, { id: "b", quiz: ["q2"] },
  ] }], quiz: [{ id: "q1" }, { id: "q2" }] };
  const st = etat({
    completedLessons: { a: "x", b: "x" },
    quizResults: reussi("q1","q2"),
    reviewHistory: ancre("q1"),
  });
  const s = masteryStats(content, st);
  assert.equal(s.ancrees, 1);
  assert.equal(s.comprises, 1);
  assert.equal(s.atteints, 3 + 2);
});

test("prochainesAAncrer ne remonte que des leçons comprises", () => {
  const content = { courses: [{ id: "m", lessons: [
    { id: "a", quiz: ["q1","q2"] },   // comprise, 1 ancrée sur 2 requises
    { id: "b", quiz: ["q3"] },        // seulement vue
  ] }], quiz: [{id:"q1"},{id:"q2"},{id:"q3"}] };
  const st = etat({
    completedLessons: { a: "x", b: "x" },
    quizResults: reussi("q1","q2"),
    reviewHistory: ancre("q1"),
  });
  const p = prochainesAAncrer(content, st);
  assert.equal(p.length, 1);
  assert.equal(p[0].lesson.id, "a");
  assert.equal(p[0].reste, 1);
});

test("bloquantes renvoie ce qui manque, selon le palier", () => {
  const l = lecon();
  // Palier « vu » : les questions pas encore réussies
  const vu = etat({ completedLessons: { l1: "x" }, quizResults: reussi("q1") });
  assert.deepEqual(bloquantes(l, vu, idx).sort(), ["q2","q3"]);
  // Palier « compris » : les questions pas encore ancrées
  const compris = etat({
    completedLessons: { l1: "x" }, quizResults: reussi("q1","q2","q3"),
    reviewHistory: ancre("q1"),
  });
  assert.deepEqual(bloquantes(l, compris, idx).sort(), ["q2","q3"]);
  // Palier « ancré » : plus rien
  const ancree = etat({
    completedLessons: { l1: "x" }, quizResults: reussi("q1","q2","q3"),
    reviewHistory: ancre("q1","q2","q3"),
  });
  assert.deepEqual(bloquantes(l, ancree, idx), []);
});

test("l'ancrage demande un nombre réaliste de révisions", () => {
  // Depuis zéro, avec un facteur de facilité moyen.
  const n = revisionsRestantes(etat(), "q1");
  assert.ok(n >= 4 && n <= 8, `${n} révisions — doit rester dans une fourchette crédible`);
  // Une question déjà bien avancée en demande moins.
  const avance = etat({ reviewHistory: { q1: { interval: 15, successes: 5, ease: 2.2 } } });
  assert.ok(revisionsRestantes(avance, "q1") < n);
});

test("un état vide ou incomplet ne fait rien planter", () => {
  assert.equal(lessonMastery(null, null).level, MASTERY.LOCKED);
  assert.equal(lessonMastery({ id: "x" }, {}).level, MASTERY.LOCKED);
  assert.equal(masteryStats(null, null).total, 0);
  assert.deepEqual(prochainesAAncrer(null, null), []);
  assert.equal(questionReussie(null, "q"), false);
  assert.equal(questionAncree(null, "q"), false);
});
