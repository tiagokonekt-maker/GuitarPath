// Garde-fous issus de l'audit des quiz et de l'ordre des prérequis.
// Les règles générales (≥ 3 questions par leçon article, pas de doublon
// d'énoncé, pas de « selon la leçon », pas de citation d'une leçon future)
// sont dans scripts/verifier-contenu.mjs ; ici, les cas précis corrigés.
import { test } from "node:test";
import assert from "node:assert/strict";
import { COURSES, QUIZ, EXERCISES } from "../src/content/index.js";
import { buildUnits } from "../src/store/pathEngine.js";

const Q = Object.fromEntries(QUIZ.map(q => [q.id, q]));
const bonne = (id) => Q[id].o[Q[id].a];
const lecons = COURSES.flatMap(c => c.lessons);

test("faits musicaux corrigés", () => {
  assert.equal(bonne("q-neck-08"), "Quinte diminuée");            // Mi → Si♭ : 5 lettres
  assert.ok(!Q["q-neck-08"].o.includes("Quarte augmentée"));
  assert.equal(bonne("q-neck-06"), "6");                          // un Do par corde, cases 0-12
  assert.equal(bonne("q-impro-09"), "Mi phrygien dominant");
  assert.equal(bonne("q-scales-48"), "La mineure harmonique");     // même gamme, vue depuis La
  assert.ok(!Q["q-impro-09"].o.some(o => /harmonique/.test(o)));
});

test("pivot Do → Sol : une seule réponse commune aux deux tonalités", () => {
  const DO = ["Do majeur", "Ré mineur", "Mi mineur", "Fa majeur", "Sol majeur", "La mineur", "Si diminué"];
  const SOL = ["Sol majeur", "La mineur", "Si mineur", "Do majeur", "Ré majeur", "Mi mineur", "Fa# diminué"];
  const communs = Q["q-harm-22"].o.filter(o => DO.includes(o) && SOL.includes(o));
  assert.deepEqual(communs, [bonne("q-harm-22")]);
});

test("tension sur G7 : Fa n'est plus à la fois piège et réponse", () => {
  assert.ok(!Q["q-impro-06"].o.some(o => /^Fa\b/.test(o)));
  assert.notEqual(bonne("q-impro-28"), "Fa, la septième");
});

test("questions supprimées : plus aucune référence", () => {
  const supprimees = ["q-harm-25", "q-harm-18"];
  for (const id of supprimees) {
    assert.equal(Q[id], undefined);
    for (const l of lecons) {
      assert.ok(!(l.quiz || []).includes(id), `${l.id} cite ${id}`);
      for (const c of l.cartes || []) assert.notEqual(c.quizId, id);
    }
    for (const e of EXERCISES) assert.ok(!JSON.stringify(e).includes(`"${id}"`));
  }
});

test("prérequis : chaque leçon vient après ce dont elle a besoin", () => {
  const rang = new Map();
  buildUnits(COURSES).forEach((u, i) => u.lessons.forEach((l, j) => rang.set(l.id, i * 100 + j)));
  const avant = [
    ["scales-c1-06", "neck-03"],      // intervalles complets avant inversions/triton
    ["harm-c2-04", "neck-05"],        // inversions avant les triades sur le manche
    ["scales-c2-02", "neck-05"],
    ["harm-c3-02", "harmony-03"],     // accords de 7e avant leurs arpèges
    ["harm-c6-01", "scales-c3-04"],   // forme du blues avant la gamme blues
    ["harm-c6-01", "rhy-c5-01"],      // … et avant le shuffle / quick change
    ["harm-c5-01", "scales-c4-02"],   // harmonisation avant les modes
    ["impro-intro-01", "impro-intro-02"],
  ];
  for (const [a, b] of avant) assert.ok(rang.get(a) < rang.get(b), `${a} doit précéder ${b}`);
  const lvl = Object.fromEntries(lecons.map(l => [l.id, l.level]));
  assert.ok(lvl["impro-intro-01"] <= 3, "la première impro arrive tôt");
  assert.equal(Q["q-neck-23"].lessonId, "scales-c3-02");          // bend en penta : leçon de penta
});
