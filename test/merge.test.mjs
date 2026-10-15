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
  const apresReset = base({ resetAt: "2026-08-13T10:00:00.000Z", resetEpoch: 1 });
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
  const cloudReset = base({ resetAt: "2026-08-13T10:00:00.000Z", resetEpoch: 1, theme: "dark" });
  const m = mergeStates(local, cloudReset);
  assert.equal(m.xp, 0);
  assert.equal(m.theme, local.theme, "la préférence de thème locale est conservée");
});

test("un appareil resté sur l'ancienne époque ne ressuscite pas la progression, même s'il a joué après le reset", () => {
  // Ancienne règle (comparaison de dates) : l'appareil qui avait joué le 12,
  // après un reset le 10, réimposait TOUTE sa progression, y compris les
  // 4 200 XP d'avant le reset. On ne peut pas séparer les deux : l'époque
  // la plus récente gagne.
  const reset = base({ resetAt: "2026-08-10T10:00:00.000Z", resetEpoch: 1 });
  const ancien = base({ xp: 4200, lastSessionDate: "2026-08-12" });
  assert.equal(mergeStates(reset, ancien).xp, 0);
  assert.equal(mergeStates(ancien, reset).xp, 0);
});

test("même époque : fusion normale, la progression d'après le reset s'additionne", () => {
  const a = base({ resetEpoch: 2, xp: 300, completedLessons: { "neck-c1-01": "2026-08-11" } });
  const b = base({ resetEpoch: 2, xp: 500, completedLessons: { "neck-c1-02": "2026-08-12" } });
  const m = mergeStates(a, b);
  assert.equal(m.xp, 500);
  assert.deepEqual(Object.keys(m.completedLessons).sort(), ["neck-c1-01", "neck-c1-02"]);
  assert.equal(m.resetEpoch, 2);
});

test("un état antérieur aux époques mais déjà réinitialisé démarre à l'époque 1", () => {
  // Les deux appareils ont vu le même reset (avant cette version) : aucun
  // ne doit écraser l'autre.
  const a = base({ resetAt: "2026-08-10T10:00:00.000Z", xp: 100 });
  const b = base({ resetAt: "2026-08-10T10:00:00.000Z", xp: 250 });
  delete a.resetEpoch; delete b.resetEpoch;
  const m = mergeStates(a, b);
  assert.equal(m.resetEpoch, 1);
  assert.equal(m.xp, 250);
});

test("révision espacée : l'entrée la plus récente gagne, même avec moins de tentatives", () => {
  const local = base({ reviewHistory: { q1: { attempts: 9, successes: 9, streak: 9, lastSeen: "2026-08-01", interval: 30 } } });
  const cloud = base({ reviewHistory: { q1: { attempts: 4, successes: 3, streak: 0, lastSeen: "2026-08-20", interval: 1 } } });
  assert.equal(mergeStates(local, cloud).reviewHistory.q1.lastSeen, "2026-08-20");
  assert.equal(mergeStates(cloud, local).reviewHistory.q1.interval, 1);
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

test("onboarding : `experience` survit à la synchro", () => {
  const ob = (over) => ({ ...defaultState().onboarding, done: true, completedAt: "2026-10-01", ...over });
  // Fait sur l'autre appareil seulement : on récupère tout, experience compris.
  const m1 = mergeStates(base(), base({ onboarding: ob({ experience: "confirme" }) }));
  assert.equal(m1.onboarding.done, true);
  assert.equal(m1.onboarding.experience, "confirme");
  // Le côté retenu (local) date d'avant la question : l'autre la complète.
  const ancien = { ...ob({}) }; delete ancien.experience;
  const m2 = mergeStates(base({ onboarding: ancien }), base({ onboarding: ob({ experience: "debutant" }) }));
  assert.equal(m2.onboarding.experience, "debutant");
  // Aucun des deux ne la connaît : null, pas undefined.
  assert.equal(mergeStates(base({ onboarding: ancien }), base({ onboarding: ancien })).onboarding.experience, null);
});
