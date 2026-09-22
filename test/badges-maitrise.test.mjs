// Vérifie que les badges d'ancrage se déclenchent réellement, avec le vrai
// module badges.js modifié — pas une réimplémentation.
import { test } from "node:test";
import assert from "node:assert/strict";
import { BADGES, computeNewBadges } from "../src/store/badges.js";

const contenu = () => ({
  courses: [{ id: "m", lessons: [
    { id: "a", quiz: ["q1", "q2"] },
    { id: "b", quiz: ["q3", "q4"] },
    { id: "c", quiz: ["q5", "q6"] },
  ] }],
  quiz: [1,2,3,4,5,6].map(n => ({ id: `q${n}` })),
});

const ancrer = (...ids) => Object.fromEntries(
  ids.map(id => [id, { interval: 21, successes: 5, ease: 2.2, lastSeen: "2026-01-01" }])
);

const etatVide = () => ({
  xp: 0, streak: 0, completedLessons: {}, completedExercises: {}, quizResults: {},
  reviewHistory: {}, wrongQuiz: [], unlockedBadges: [], practiceLibre: { count: 0 },
  dailyChallengeCount: 0, weeklyGoals: { sessions: 0 },
});

test("le badge anchor_1 existe dans le catalogue", () => {
  assert.ok(BADGES.some(b => b.id === "anchor_1"));
  assert.ok(BADGES.some(b => b.id === "anchor_10"));
  assert.ok(BADGES.some(b => b.id === "anchor_30"));
});

test("anchor_1 se déclenche au premier ancrage, pas avant", () => {
  const content = contenu();
  const avant = {
    ...etatVide(),
    completedLessons: { a: "x" },
    quizResults: { q1: { correct: true }, q2: { correct: true } },
    reviewHistory: { q1: { interval: 5, successes: 2, ease: 2.2 }, q2: { interval: 5, successes: 2, ease: 2.2 } },
  };
  assert.ok(!computeNewBadges(avant, content).includes("anchor_1"));

  const apres = { ...avant, reviewHistory: ancrer("q1", "q2") };
  assert.ok(computeNewBadges(apres, content).includes("anchor_1"));
});

test("un badge déjà débloqué n'est pas re-signalé", () => {
  const content = contenu();
  const s = {
    ...etatVide(),
    completedLessons: { a: "x" },
    quizResults: { q1: { correct: true }, q2: { correct: true } },
    reviewHistory: ancrer("q1", "q2"),
    unlockedBadges: ["anchor_1"],
  };
  assert.ok(!computeNewBadges(s, content).includes("anchor_1"));
});

test("anchor_10 ne se déclenche pas avec seulement 3 leçons ancrées", () => {
  const content = contenu();
  const s = {
    ...etatVide(),
    completedLessons: { a: "x", b: "x", c: "x" },
    quizResults: Object.fromEntries([1,2,3,4,5,6].map(n => [`q${n}`, { correct: true }])),
    reviewHistory: ancrer("q1","q2","q3","q4","q5","q6"),
  };
  const nouveaux = computeNewBadges(s, content);
  assert.ok(nouveaux.includes("anchor_1"));
  assert.ok(!nouveaux.includes("anchor_10"), "3 leçons ancrées ne suffisent pas pour 10");
});

test("le calcul ne plante pas sans contenu ni progression", () => {
  assert.doesNotThrow(() => computeNewBadges(etatVide(), { courses: [], quiz: [] }));
});
