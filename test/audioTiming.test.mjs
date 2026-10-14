// Groply — test/audioTiming.test.mjs
// Durées et instants de lecture du moteur audio (src/audioEngine.js), sans
// audio : Tone.js n'est chargé qu'à la première lecture, l'import reste
// possible en Node.
import { test } from "node:test";
import assert from "node:assert/strict";
import { dureeEnSecondes, planRythme, generateEarTrainingQuestion, RELEASE } from "../src/audioEngine.js";

const proche = (a, b, eps = 1e-9) => Math.abs(a - b) < eps;

test("durées en secondes, à 120 BPM fixe — indépendantes du tempo du Transport", () => {
  assert.equal(dureeEnSecondes("4n"), 0.5);
  assert.equal(dureeEnSecondes("2n"), 1);
  assert.equal(dureeEnSecondes("8n"), 0.25);
  assert.equal(dureeEnSecondes("1n"), 2);
  assert.ok(proche(dureeEnSecondes("8n."), 0.375));
  assert.ok(proche(dureeEnSecondes("8t"), 0.25 * 2 / 3));
  assert.equal(dureeEnSecondes("1m"), 2);
  assert.equal(dureeEnSecondes(0.3), 0.3);
  assert.equal(dureeEnSecondes("0.4"), 0.4);
  assert.equal(dureeEnSecondes("n'importe quoi"), 1);
});

test("durationMs d'un intervalle = durée réellement jouée (2e note à 0,65 s, « 4n » = 0,5 s)", () => {
  const q = generateEarTrainingQuestion("interval");
  assert.equal(q.durationMs, Math.round((0.65 + 0.5) * 1000) + Math.round(RELEASE * 1000));
});

test("dictée rythmique : décompte, temps marqués et attaques aux bons instants", () => {
  const p = planRythme({ bpm: 60, pas: 2, attaques: [0, 1, 2, 7] });
  assert.equal(p.clics.length, 8);
  assert.deepEqual(p.clics.map(c => c.t), [0, 1, 2, 3, 4, 5, 6, 7]);
  assert.deepEqual(p.clics.map(c => c.fort), [true, false, false, false, true, false, false, false]);
  assert.deepEqual(p.attaques, [4, 4.5, 5, 7.5]);
  assert.equal(p.totalMs, 8000);
});

test("dictée rythmique ternaire : la croche faible à 2/3 du temps", () => {
  const p = planRythme({ bpm: 60, pas: 2, attaques: [1, 3], swing: true });
  assert.ok(proche(p.attaques[0], 4 + 2 / 3));
  assert.ok(proche(p.attaques[1], 5 + 2 / 3));
});

test("dictée en doubles-croches : quatre attaques régulières par temps", () => {
  const p = planRythme({ bpm: 120, pas: 4, attaques: [0, 1, 2, 3] });
  assert.deepEqual(p.attaques, [2, 2.125, 2.25, 2.375]);
});
