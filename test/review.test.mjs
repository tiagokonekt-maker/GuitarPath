import { test } from "node:test";
import assert from "node:assert/strict";
import {
  getPriorityScore, updateReviewHistory, buildReviewSession, buildMasterySession,
  getReviewStats, isEligible, nextInterval, NEW_SCORE, QUALITY, EASE_MIN, EASE_MAX, INTERVAL_MAX,
} from "../src/store/reviewEngine.js";

const done = { "neck-l1": "2026-01-01" };
const q = (id, over = {}) => ({ id, courseId: "neck", lessonId: "neck-l1", xp: 30, ...over });
const banque = (n, over = {}) => Array.from({ length: n }, (_, i) => q(`q${i}`, over));

test("un item jamais vu est classé NOUVEAU, pas À REVOIR", () => {
  // Avant, tout item inconnu renvoyait 80 : le compteur « à revoir » était
  // saturé en permanence, d'où le « 99+ » affiché à vie.
  assert.equal(getPriorityScore("inconnu", {}, done, "2026-08-13"), NEW_SCORE);
});

test("un item revu récemment n'est pas dû", () => {
  const h = { a: { attempts: 3, successes: 3, streak: 3, lastSeen: "2026-08-12", interval: 10, ease: 2.2 } };
  assert.equal(getPriorityScore("a", h, done, "2026-08-13"), 0);
});

test("un item en retard remonte en priorité avec le retard", () => {
  const h = (lastSeen) => ({ a: { attempts: 4, successes: 3, streak: 2, lastSeen, interval: 4, ease: 2.2 } });
  const peu = getPriorityScore("a", h("2026-08-08"), done, "2026-08-13");
  const beaucoup = getPriorityScore("a", h("2026-06-01"), done, "2026-08-13");
  assert.ok(beaucoup > peu && peu > 0);
});

test("un item difficile (ease bas) revient plus vite qu'un item facile", () => {
  const mk = (ease) => ({ a: { attempts: 5, successes: 4, streak: 2, lastSeen: "2026-08-01", interval: 4, ease } });
  assert.ok(getPriorityScore("a", mk(1.4), done, "2026-08-13")
          > getPriorityScore("a", mk(2.6), done, "2026-08-13"));
});

test("l'ease s'ajuste selon la qualité et reste borné", () => {
  let h = {};
  for (let i = 0; i < 30; i++) h = updateReviewHistory(h, "a", QUALITY.AGAIN, "2026-08-13");
  assert.ok(h.a.ease >= EASE_MIN);
  let g = {};
  for (let i = 0; i < 30; i++) g = updateReviewHistory(g, "a", QUALITY.EASY, "2026-08-13");
  assert.ok(g.a.ease <= EASE_MAX);
});

test("l'ancien appel booléen fonctionne toujours", () => {
  const h = updateReviewHistory({}, "a", true, "2026-08-13");
  assert.equal(h.a.successes, 1);
  assert.equal(h.a.streak, 1);
  const k = updateReviewHistory(h, "a", false, "2026-08-13");
  assert.equal(k.a.streak, 0, "un échec remet la série d'item à zéro");
  assert.equal(k.a.interval, 0, "et le remet à revoir dans la journée");
});

test("les intervalles croissent et restent plafonnés", () => {
  let h = {};
  const suite = [];
  for (let i = 0; i < 12; i++) {
    h = updateReviewHistory(h, "a", QUALITY.GOOD, "2026-08-13");
    suite.push(h.a.interval);
  }
  for (let i = 1; i < suite.length; i++) assert.ok(suite[i] >= suite[i - 1]);
  assert.ok(Math.max(...suite) <= INTERVAL_MAX);
  assert.equal(nextInterval({ streak: 5, interval: 200, ease: 2.5 }, QUALITY.EASY) <= INTERVAL_MAX, true);
});

test("la session respecte la taille demandée et ne répète jamais un item", () => {
  const { questions } = buildReviewSession(banque(60), {}, done, { targetCount: 12 });
  assert.equal(questions.length, 12);
  assert.equal(new Set(questions.map(x => x.id)).size, 12);
});

test("le plafond de nouveaux items est respecté quand il y a des items dus", () => {
  const items = banque(40);
  // 20 items déjà vus et en retard → largement de quoi remplir.
  const h = {};
  for (let i = 0; i < 20; i++) {
    h[`q${i}`] = { attempts: 3, successes: 1, streak: 1, lastSeen: "2026-01-01", interval: 1, ease: 2.0 };
  }
  const { questions } = buildReviewSession(items, h, done, { targetCount: 12, maxNew: 3, today: "2026-08-13" });
  const nouveaux = questions.filter(x => !h[x.id]).length;
  assert.ok(nouveaux <= 3, `${nouveaux} nouveaux dans la session`);
});

test("le plafond ne laisse jamais une session vide s'il n'y a que des nouveaux", () => {
  const { questions } = buildReviewSession(banque(30), {}, done, { targetCount: 10, maxNew: 2 });
  assert.equal(questions.length, 10);
});

test("jamais plus de 2 questions de manche d'affilée, ni plus que le maximum", () => {
  const items = [...banque(10), ...banque(20).map((x, i) => ({ ...x, id: `f${i}`, type: "fretboard" }))];
  const { questions } = buildReviewSession(items, {}, done, { targetCount: 20, maxFretboard: 5 });
  const frets = questions.filter(x => x.type === "fretboard").length;
  assert.ok(frets <= 5);
  for (let i = 2; i < questions.length; i++) {
    const trois = questions.slice(i - 2, i + 1);
    assert.ok(!trois.every(x => x.type === "fretboard"), "3 questions de manche d'affilée");
  }
});

test("aucune leçon terminée : session vide et raison explicite", () => {
  const r = buildReviewSession(banque(20), {}, {}, { targetCount: 10 });
  assert.equal(r.questions.length, 0);
  assert.equal(r.reason, "no_lessons_completed");
});

test("isEligible accepte les deux conventions de champs", () => {
  assert.equal(isEligible({ id: "a", lessonId: "neck-l1" }, done), true);
  assert.equal(isEligible({ id: "a", lessonId: "autre" }, done), false);
  assert.equal(isEligible({ id: "a", courseLink: "neck-l1" }, done), true);   // exercice
  assert.equal(isEligible({ id: "a", mod: "neck" }, done), true);             // par préfixe
  assert.equal(isEligible({ id: "a", mod: "rhythm" }, done), false);
});

test("les stats séparent la dette de révision du stock de nouveautés", () => {
  const items = banque(10);
  const h = { q0: { attempts: 2, successes: 0, streak: 0, lastSeen: "2026-01-01", interval: 0, ease: 1.8 } };
  const s = getReviewStats(items, h, done);
  assert.equal(s.eligible, 10);
  assert.equal(s.neverSeen, 9);
  assert.equal(s.toReview, 1);
  assert.ok(s.toReview < 99, "plus de plafond artificiel");
});

test("la session unifiée alterne quiz et exercices", () => {
  const pools = [
    { type: "quiz",     items: banque(10),                                    history: {} },
    { type: "exercise", items: banque(10).map((x, i) => ({ ...x, id: `e${i}` })), history: {} },
  ];
  const { session } = buildMasterySession(pools, done, { targetCount: 8, maxSameTypeConsecutive: 2, maxNew: 8 });
  assert.equal(session.length, 8);
  for (let i = 2; i < session.length; i++) {
    const trois = session.slice(i - 2, i + 1);
    assert.ok(!trois.every(x => x.type === trois[0].type), "3 items du même type d'affilée");
  }
});
