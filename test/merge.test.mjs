import { test } from "node:test";
import assert from "node:assert/strict";
import { mergeStates, defaultState } from "../src/store/state.js";

const base = (over = {}) => ({ ...defaultState(), ...over });

test("les objectifs hebdo ne régressent plus lors d'une synchro", () => {
  // Bug §2.2 : "2026-W9" > "2026-W12" en comparaison de chaînes.
  const local = base({ weeklyGoals: { sessions: 3, exercises: 1, quizzes: 0, week: "2026-W09" } });
  const cloud = base({ weeklyGoals: { sessions: 7, exercises: 5, quizzes: 4, week: "2026-W12" } });
  const m = mergeStates(local, cloud);
  assert.equal(m.weeklyGoals.week, "2026-W12");
  assert.equal(m.weeklyGoals.sessions, 7);
});

test("l'ancien format de semaine non paddé est encore compris", () => {
  const local = base({ weeklyGoals: { sessions: 3, exercises: 0, quizzes: 0, week: "2026-W9" } });
  const cloud = base({ weeklyGoals: { sessions: 7, exercises: 0, quizzes: 0, week: "2026-W12" } });
  assert.equal(mergeStates(local, cloud).weeklyGoals.sessions, 7);
});

test("même semaine : max champ par champ", () => {
  const local = base({ weeklyGoals: { sessions: 5, exercises: 1, quizzes: 9, week: "2026-W12" } });
  const cloud = base({ weeklyGoals: { sessions: 2, exercises: 6, quizzes: 3, week: "2026-W12" } });
  const m = mergeStates(local, cloud);
  assert.deepEqual(
    { s: m.weeklyGoals.sessions, e: m.weeklyGoals.exercises, q: m.weeklyGoals.quizzes },
    { s: 5, e: 6, q: 9 }
  );
});

test("un RESET n'est plus annulé par l'autre appareil", () => {
  // Bug §2.3 : Math.max(0, 4200) → 4200, la progression ressuscitait.
  const apresReset = base({ resetAt: "2026-08-13T10:00:00.000Z" });
  const autreAppareil = base({
    xp: 4200, unlockedBadges: ["xp_2000"],
    completedLessons: { "neck-c1-01": "2026-01-01" },
    lastSessionDate: "2026-08-10",
  });
  const m = mergeStates(apresReset, autreAppareil);
  assert.equal(m.xp, 0);
  assert.equal(m.unlockedBadges.length, 0);
  assert.equal(Object.keys(m.completedLessons).length, 0);
});

test("le RESET gagne aussi quand il arrive par le cloud", () => {
  const local = base({ xp: 4200, lastSessionDate: "2026-08-10" });
  const cloudReset = base({ resetAt: "2026-08-13T10:00:00.000Z", theme: "dark" });
  const m = mergeStates(local, cloudReset);
  assert.equal(m.xp, 0);
  assert.equal(m.theme, local.theme, "la préférence de thème locale est conservée");
});

test("une activité POSTÉRIEURE au reset n'est pas effacée", () => {
  // Reset le 10, puis l'autre appareil a joué le 12 : sa progression compte.
  const reset = base({ resetAt: "2026-08-10T10:00:00.000Z" });
  const actif = base({ xp: 500, lastSessionDate: "2026-08-12" });
  assert.equal(mergeStates(reset, actif).xp, 500);
});

test("le merge est commutatif sur la progression", () => {
  const a = base({ xp: 900, streak: 4, completedLessons: { l1: "2026-01-02" }, lastSessionDate: "2026-08-01" });
  const b = base({ xp: 400, streak: 9, completedLessons: { l1: "2026-01-01", l2: "2026-02-01" }, lastSessionDate: "2026-08-05" });
  const ab = mergeStates(a, b), ba = mergeStates(b, a);
  assert.equal(ab.xp, ba.xp);
  assert.equal(ab.streak, ba.streak);
  assert.deepEqual(Object.keys(ab.completedLessons).sort(), Object.keys(ba.completedLessons).sort());
  // Première complétion : on garde la date la plus ancienne, des deux côtés.
  assert.equal(ab.completedLessons.l1, "2026-01-01");
  assert.equal(ba.completedLessons.l1, "2026-01-01");
});

test("un quiz réussi sur un seul appareil reste réussi", () => {
  const a = base({ quizResults: { q1: { correct: true, attempts: 1, lastAttempt: "2026-08-01" } } });
  const b = base({ quizResults: { q1: { correct: false, attempts: 3, lastAttempt: "2026-08-05" } } });
  const m = mergeStates(a, b);
  assert.equal(m.quizResults.q1.correct, true);
  assert.equal(m.quizResults.q1.attempts, 3);
});

test("le plafond d'XP d'entretien n'est pas contournable en changeant d'appareil", () => {
  const a = base({ dailyXp: { date: "2026-08-13", repeat: 100, practice: 2 } });
  const b = base({ dailyXp: { date: "2026-08-13", repeat: 40,  practice: 1 } });
  const m = mergeStates(a, b);
  assert.equal(m.dailyXp.repeat, 100);
  assert.equal(m.dailyXp.practice, 2);
});

test("un état cloud vide ou corrompu ne casse rien", () => {
  assert.equal(mergeStates(base({ xp: 300 }), null).xp, 300);
  assert.equal(mergeStates(base({ xp: 300 }), {}).xp, 300);
  assert.equal(mergeStates(base({ xp: 300 }), { xp: Infinity }).xp, 300);
});
