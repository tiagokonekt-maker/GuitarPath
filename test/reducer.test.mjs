import { test } from "node:test";
import assert from "node:assert/strict";
import { reducer } from "../src/store/reducer.js";
import { defaultState, todayStr, daysAgoStr } from "../src/store/state.js";
import { DAILY_REPEAT_CAP, DAILY_PRACTICE_CAP, REPEAT_MAX } from "../src/store/xp.js";

const S = (over = {}) => ({ ...defaultState(), ...over });
const run = (state, ...actions) => actions.reduce((s, a) => reducer(s, a), state);

test("une leçon ne rapporte de l'XP qu'une seule fois", () => {
  const a = { type: "COMPLETE_LESSON", id: "neck-c1-01", title: "T" };
  const s1 = reducer(S(), a);
  assert.equal(s1.xp, 30);
  const s2 = reducer(s1, a);
  assert.equal(s2.xp, 30, "relire une leçon ne rapporte rien");
});

test("un exercice répété rapporte une XP d'entretien réduite et plafonnée", () => {
  const a = { type: "COMPLETE_EXERCISE", id: "ex-1", title: "E", xp: 60 };
  let s = reducer(S(), a);
  assert.equal(s.xp, 60, "1re fois : XP pleine");
  s = reducer(s, a);
  assert.equal(s.xp, 60 + 15, "2e fois : 25 % borné à 15");
  assert.equal(s.completedExercises["ex-1"].count, 2);
  assert.equal(s.lastGain.first, false);
});

test("répéter un quiz ne farme plus le niveau", () => {
  const a = { type: "QUIZ_ANSWER", id: "q-1", correct: true, xp: 40 };
  let s = reducer(S(), a);
  const apres1 = s.xp;
  for (let i = 0; i < 200; i++) s = reducer(s, a);
  assert.ok(s.xp <= apres1 + DAILY_REPEAT_CAP,
    `200 répétitions ne peuvent pas dépasser le plafond du jour (${s.xp} XP)`);
});

test("le plafond d'entretien s'applique tous types confondus", () => {
  let s = S();
  s = reducer(s, { type: "QUIZ_ANSWER", id: "q1", correct: true, xp: 40 });
  s = reducer(s, { type: "COMPLETE_EXERCISE", id: "e1", xp: 60 });
  const base = s.xp;
  for (let i = 0; i < 50; i++) {
    s = reducer(s, { type: "QUIZ_ANSWER", id: "q1", correct: true, xp: 40 });
    s = reducer(s, { type: "COMPLETE_EXERCISE", id: "e1", xp: 60 });
  }
  assert.ok(s.xp - base <= DAILY_REPEAT_CAP);
  assert.equal(s.dailyXp.date, todayStr());
});

test("une réussite acquise ne se dé-valide pas sur une erreur ultérieure", () => {
  let s = reducer(S(), { type: "QUIZ_ANSWER", id: "q1", correct: true, xp: 40 });
  s = reducer(s, { type: "QUIZ_ANSWER", id: "q1", correct: false, xp: 40 });
  assert.equal(s.quizResults.q1.correct, true);
  assert.ok(s.wrongQuiz.includes("q1"), "elle repart quand même en révision");
  // Et surtout : la re-réussir ne redonne pas l'XP de première fois.
  const avant = s.xp;
  s = reducer(s, { type: "QUIZ_ANSWER", id: "q1", correct: true, xp: 40 });
  assert.ok(s.xp - avant <= REPEAT_MAX);
});

test("la pratique libre est plafonnée par jour", () => {
  let s = S();
  for (let i = 0; i < 10; i++) s = reducer(s, { type: "PRACTICE_DONE", minutes: 10 });
  assert.equal(s.xp, 50 * DAILY_PRACTICE_CAP);
  assert.equal(s.practiceLibre.count, 10, "le compteur d'activité continue, lui");
});

test("le défi du jour ne peut pas être validé deux fois", () => {
  const a = { type: "DAILY_CHALLENGE_DONE" };
  let s = reducer(S(), a);
  assert.equal(s.xp, 80);
  s = reducer(s, a);
  assert.equal(s.xp, 80);
  assert.equal(s.dailyChallengeCount, 1);
});

test("le coffre d'unité reste réclamable une seule fois", () => {
  const a = { type: "CLAIM_UNIT_BONUS", unitId: "palier-1", xp: 60 };
  let s = reducer(S(), a);
  assert.equal(s.xp, 60);
  s = reducer(s, a);
  assert.equal(s.xp, 60);
});

test("la série continue, se gèle, puis repart", () => {
  // Jour J-1 → J : +1
  let s = reducer(S({ streak: 4, lastSessionDate: daysAgoStr(1) }), { type: "MARK_STREAK" });
  assert.equal(s.streak, 5);
  // Deux sessions le même jour : pas de double comptage
  s = reducer(s, { type: "MARK_STREAK" });
  assert.equal(s.streak, 5);
  // Un jour manqué + un gel disponible → sauvée
  s = reducer(S({ streak: 6, streakFreezes: 1, lastSessionDate: daysAgoStr(2) }), { type: "MARK_STREAK" });
  assert.equal(s.streak, 7);
  assert.equal(s.streakFreezes, 1, "le gel dépensé est regagné au palier de 7 jours");
  // Un jour manqué sans gel → repart à 1
  s = reducer(S({ streak: 6, streakFreezes: 0, lastSessionDate: daysAgoStr(2) }), { type: "MARK_STREAK" });
  assert.equal(s.streak, 1);
  // Trois jours manqués → repart à 1
  s = reducer(S({ streak: 6, streakFreezes: 2, lastSessionDate: daysAgoStr(3) }), { type: "MARK_STREAK" });
  assert.equal(s.streak, 1);
});

test("UPDATE_WEEKLY réinitialise au changement de semaine et ignore un champ inconnu", () => {
  let s = reducer(S({ weeklyGoals: { sessions: 9, exercises: 9, quizzes: 9, week: "2020-W01" } }),
                  { type: "UPDATE_WEEKLY", field: "sessions" });
  assert.equal(s.weeklyGoals.sessions, 1);
  assert.equal(s.weeklyGoals.quizzes, 0);
  const t = reducer(s, { type: "UPDATE_WEEKLY", field: "n_importe_quoi" });
  assert.equal(t.weeklyGoals.sessions, 1);
});

// ─────────────────────────────────────────────────────────────────────────
// RESET
//
// Comportement changé : avant, RESET gardait `onboarding.done = true` avec
// l'objectif et le temps disponible conservés — l'idée étant qu'un
// utilisateur qui réinitialise sa progression après des mois d'usage
// connaît déjà l'app, et que réimposer 12 questions serait de la friction
// gratuite.
//
// Ce raisonnement suppose un reset « je veux repartir proprement dans ma
// pratique ». Il en existe un autre, tout aussi légitime : « je veux un
// compte neuf pour tout retester depuis le départ ». Dans ce second cas,
// sauter le placement est gênant — ça laisse le parcours au niveau 1 sans
// jamais pouvoir vérifier que le test fonctionne, et ça ne correspond pas
// à ce que « repartir de zéro » veut dire.
//
// RESET repart donc entièrement de `defaultState()`, seul le thème est
// conservé — l'onboarding y compris, ce qui redéclenche le test de
// placement au prochain chargement de l'app.
// ─────────────────────────────────────────────────────────────────────────

test("RESET horodate, garde le thème, réinitialise aussi l'onboarding", () => {
  const s = reducer(S({
    xp: 5000, theme: "dark",
    onboarding: { ...defaultState().onboarding, done: true, goal: "impro", timePerWeek: "long", startXp: 1680 },
  }), { type: "RESET" });
  assert.equal(s.xp, 0);
  assert.equal(s.theme, "dark");
  assert.equal(s.onboarding.done, false, "l'onboarding redémarre : le placement sera redemandé");
  assert.equal(s.onboarding.goal, null, "les réponses précédentes ne sont plus présupposées");
  assert.equal(s.onboarding.timePerWeek, null);
  assert.equal(s.onboarding.startXp, 0);
  assert.ok(s.resetAt, "resetAt est renseigné : c'est ce qui protège du merge");
});

test("après un RESET, l'onboarding peut être refait normalement", () => {
  const resetState = reducer(S({ onboarding: { ...defaultState().onboarding, done: true } }), { type: "RESET" });
  const replaye = reducer(resetState, {
    type: "COMPLETE_ONBOARDING", goal: "harmonie", startXp: 500, overallTier: "A2",
  });
  assert.equal(replaye.onboarding.done, true);
  assert.equal(replaye.onboarding.goal, "harmonie");
  assert.equal(replaye.xp, 500, "l'XP de départ du nouveau placement est bien créditée");
});

test("COMPLETE_ONBOARDING ne crédite l'XP de départ qu'une fois", () => {
  const a = { type: "COMPLETE_ONBOARDING", goal: "impro", startXp: 1680, overallTier: "B2" };
  let s = reducer(S(), a);
  assert.equal(s.xp, 1680);
  s = reducer(s, a);
  assert.equal(s.xp, 1680);
});

test("SET_THEME rejette une valeur invalide", () => {
  assert.equal(reducer(S(), { type: "SET_THEME", theme: "arc-en-ciel" }).theme, "auto");
  assert.equal(reducer(S(), { type: "SET_THEME", theme: "dark" }).theme, "dark");
});

test("une action inconnue ne crée pas un nouvel objet d'état", () => {
  const s = S();
  assert.equal(reducer(s, { type: "TOTALEMENT_INCONNU" }), s);
});

test("l'historique de sessions est borné à 10 entrées", () => {
  let s = S();
  for (let i = 0; i < 25; i++) s = reducer(s, { type: "COMPLETE_LESSON", id: `l-${i}`, title: `L${i}` });
  assert.equal(s.sessionHistory.length, 10);
});
