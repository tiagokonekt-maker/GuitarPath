import { test } from "node:test";
import assert from "node:assert/strict";
import {
  nettoyerProps, nomEvenementValide, PROPS_AUTORISEES, MAX_PROPS,
  statistiquesDesactivees, enregistrerPreferenceStatistiques, ANALYTICS_OFF_KEY,
} from "../src/analyticsProps.js";
import { purgerDonneesPersonnelles, purgerSuppressionCompte } from "../src/store/compte.js";

const memoire = (init = {}) => {
  const m = new Map(Object.entries(init));
  return {
    getItem: k => (m.has(k) ? m.get(k) : null),
    setItem: (k, v) => m.set(k, String(v)),
    removeItem: k => m.delete(k),
    dump: () => Object.fromEntries(m),
  };
};

// ── Minimisation ─────────────────────────────────────────────────────────
test("REVIEW_ANSWER : l'historique de révision n'est jamais envoyé", () => {
  const history = Object.fromEntries(Array.from({ length: 500 }, (_, i) => [`q${i}`, { box: 3, due: "2026-10-01" }]));
  const p = nettoyerProps("review_answer", { questionId: "q12", correct: true, history, xp: 30 });
  assert.deepEqual(p, { questionId: "q12", correct: true, xp: 30 });
  assert.ok(JSON.stringify(p).length < 100);
});

test("EXERCISE_MASTERY_ANSWER : rien d'autre que le nom de l'événement", () => {
  assert.deepEqual(nettoyerProps("exercise_mastery_answer", { history: { a: 1 } }), {});
});

test("liste blanche : les clés hors liste sont écartées", () => {
  assert.deepEqual(
    nettoyerProps("quiz_session_completed", { id: "Titre libre", title: "Titre libre", xp: 90, score: "3/5" }),
    { xp: 90, score: "3/5" },
  );
  assert.deepEqual(
    nettoyerProps("submit_unit_check", { unitId: "u1", pct: 80, passPct: 70, wrongIds: ["a", "b"] }),
    { unitId: "u1", pct: 80, passPct: 70 },
  );
});

test("les dérivés xp_gained / level_up_to sont admis pour toute action listée", () => {
  assert.deepEqual(nettoyerProps("lesson_completed", { id: "l1", title: "x", xp_gained: 20, level_up_to: 3 }),
    { id: "l1", xp_gained: 20, level_up_to: 3 });
});

test("hors liste blanche : seules les primitives courtes passent, 12 clés au plus", () => {
  const props = {
    ok: true, n: 3, s: "court", long: "x".repeat(81), juste: "y".repeat(80),
    nan: NaN, inf: Infinity, nul: null, obj: { a: 1 }, tab: [1], fn: () => 1, und: undefined,
  };
  assert.deepEqual(nettoyerProps("evenement_inconnu", props), { ok: true, n: 3, s: "court", juste: "y".repeat(80) });

  const beaucoup = Object.fromEntries(Array.from({ length: 30 }, (_, i) => [`k${i}`, i]));
  assert.equal(Object.keys(nettoyerProps("evenement_inconnu", beaucoup)).length, MAX_PROPS);
});

test("onboarding_completed : le profil de niveau (objet) et la date ne partent pas", () => {
  const p = nettoyerProps("onboarding_completed", {
    goal: "fun", timePerWeek: "1-2h", skillLevels: { neck: 2 }, overallTier: "debutant",
    startXp: 120, completedAt: new Date().toISOString(), experience: "quelques",
  });
  assert.deepEqual(p, { goal: "fun", timePerWeek: "1-2h", overallTier: "debutant", experience: "quelques" });
});

test("props invalides → objet vide ; nom d'événement contrôlé", () => {
  for (const v of [null, undefined, "x", 3, [1, 2]]) assert.deepEqual(nettoyerProps("screen_view", v), {});
  assert.equal(nomEvenementValide("screen_view"), "screen_view");
  for (const v of ["", null, 12, "e".repeat(121)]) assert.equal(nomEvenementValide(v), null);
});

test("chaque liste blanche reste sous la limite de clés", () => {
  for (const [ev, cles] of Object.entries(PROPS_AUTORISEES)) assert.ok(cles.length + 2 <= MAX_PROPS, ev);
});

// ── Opposition ───────────────────────────────────────────────────────────
test("préférence d'opposition : écriture, lecture, retrait", () => {
  const s = memoire();
  assert.equal(statistiquesDesactivees(s), false);
  enregistrerPreferenceStatistiques(s, false);
  assert.equal(s.getItem(ANALYTICS_OFF_KEY), "1");
  assert.equal(statistiquesDesactivees(s), true);
  enregistrerPreferenceStatistiques(s, true);
  assert.equal(s.getItem(ANALYTICS_OFF_KEY), null);
  // Stockage qui lève : on considère la collecte non refusée, sans planter.
  const casse = { getItem() { throw new Error("bloqué"); }, setItem() { throw new Error("bloqué"); }, removeItem() {} };
  assert.equal(statistiquesDesactivees(casse), false);
  enregistrerPreferenceStatistiques(casse, false);
});

test("l'opposition est une préférence d'appareil : elle survit aux purges de compte", () => {
  const s = memoire({ [ANALYTICS_OFF_KEY]: "1", groply_state: "{}" });
  purgerDonneesPersonnelles(s);
  assert.equal(s.getItem(ANALYTICS_OFF_KEY), "1");
  purgerSuppressionCompte(s, "alice");
  assert.equal(s.getItem(ANALYTICS_OFF_KEY), "1");
});
