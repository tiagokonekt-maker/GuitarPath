// Groply — test/swing.test.mjs
// Swing partagé batterie / basse / accompagnement (src/jam/music/groove.js).
// Le défaut corrigé : avec un pack, le Transport est à swing 0 et seule la
// batterie swinguait — les croches faibles de la basse et de l'accompagnement
// tombaient droites, à côté de la charleston (« flam »). Et le funk 16 ne
// swinguait que la croche « et », jamais les doubles-croches « e » et « a ».
import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "fs";
import { swingBeat, swingRatio, stepPosition, packSwing, companionSwing } from "../src/jam/music/groove.js";
import { generateDrumBar } from "../src/jam/generators/drums.js";
import { generateWalkingBar } from "../src/music/walkingBass.js";
import { createComper } from "../src/music/compRhythm.js";

const BLUES = JSON.parse(readFileSync(new URL("../src/jam/packs/blues-shuffle.json", import.meta.url)));
const FUNK  = JSON.parse(readFileSync(new URL("../src/jam/packs/funk-16.json", import.meta.url)));
const proche = (a, b, eps = 1e-9) => Math.abs(a - b) < eps;

test("swingBeat : binaire = identité, temps forts jamais déplacés", () => {
  for (const b of [0, 0.25, 0.5, 1.5, 3.75]) assert.equal(swingBeat(b, 0.5, 2), b);
  for (const b of [0, 1, 2, 3]) {
    assert.ok(proche(swingBeat(b, 2 / 3, 2), b));
    assert.ok(proche(swingBeat(b, 0.6, 4), b));
  }
});

test("swingBeat : croche faible repoussée au ratio, au niveau croche", () => {
  assert.ok(proche(swingBeat(1.5, 2 / 3, 2), 1 + 2 / 3));
  assert.ok(proche(swingBeat(3.5, 0.6, 2), 3.6));
});

test("swingBeat : au niveau double-croche, « e » et « a » swinguent, « et » reste en place", () => {
  const r = 0.6;
  assert.ok(proche(swingBeat(0.25, r, 4), r * 0.5));
  assert.ok(proche(swingBeat(0.5, r, 4), 0.5));
  assert.ok(proche(swingBeat(0.75, r, 4), 0.5 + r * 0.5));
});

test("swingBeat : niveau ternaire (triolets) = pas de swing ajouté", () => {
  assert.equal(swingBeat(1 / 3, 0.66, 3), 1 / 3);
});

test("swingBeat : l'ordre des positions est toujours conservé", () => {
  for (const niveau of [2, 4]) {
    let prev = -1;
    for (let i = 0; i <= 64; i++) {
      const p = swingBeat(i / 16, 0.68, niveau);
      assert.ok(p > prev, `croissant (niveau ${niveau}, pas ${i})`);
      prev = p;
    }
  }
});

test("stepPosition : comportement historique conservé (croches, triolets)", () => {
  // Grille en croches, swing de croches (défaut) : identique à avant.
  assert.ok(proche(stepPosition(1, 8, 0.66), 0.66 / 4));
  assert.ok(proche(stepPosition(2, 8, 0.66), 0.25));
  // Grille en triolets : jamais déformée, elle porte déjà son shuffle.
  for (let s = 0; s < 12; s++) assert.ok(proche(stepPosition(s, 12, 0.62), s / 12));
});

test("stepPosition : pack en doubles-croches → les pas impairs swinguent", () => {
  const r = 0.6;
  assert.ok(proche(stepPosition(1, 16, r, 4, 4) * 4, r * 0.5));
  assert.ok(proche(stepPosition(2, 16, r, 4, 4) * 4, 0.5));
  assert.ok(proche(stepPosition(3, 16, r, 4, 4) * 4, 0.5 + r * 0.5));
  // Une grille en croches dans un pack en doubles : rien ne bouge.
  assert.ok(proche(stepPosition(1, 8, r, 4, 4) * 4, 0.5));
});

test("packSwing : niveau de swing = subdivision du pack", () => {
  assert.equal(packSwing(FUNK, 96).stepsPerBeat, 4);
  assert.ok(packSwing(FUNK, 96).ratio > 0.5);
  assert.equal(packSwing(BLUES, 88).stepsPerBeat, 3);
  assert.equal(packSwing({ feel: {} }, 100).stepsPerBeat, 2);
});

test("generateDrumBar : en funk 16, les doubles-croches « e » et « a » sont swinguées", () => {
  const pack = {
    feel: { subdivision: 16, swing: 1 },
    humanize: { jitterMs: 0, velSigma: 0 },   // sans humanisation : positions exactes
    drumPatterns: [{ id: "p", grid: { hihat: "xxxxxxxxxxxxxxxx" } }],
  };
  const spb = 0.75;   // 80 BPM : swingRatio(1, 80) = 2/3
  const r = swingRatio(1, 80);
  const evs = generateDrumBar(pack, { patternId: "p", ghostNotes: true }, {
    barStartTime: 0, secPerBeat: spb, beatsPerBar: 4, bpm: 80, energy: 3,
  });
  assert.equal(evs.length, 16);
  assert.ok(proche(evs[1].time, r * 0.5 * spb, 1e-6), `« e » swingué (${evs[1].time})`);
  assert.ok(proche(evs[2].time, 0.5 * spb, 1e-6), "« et » en place");
  assert.ok(proche(evs[3].time, (0.5 + r * 0.5) * spb, 1e-6), "« a » swingué");
});

test("blues shuffle : la croche faible de la basse et de l'accompagnement tombe sur la charleston", () => {
  const sw = companionSwing(BLUES, 88);
  assert.equal(sw.stepsPerBeat, 2);
  assert.ok(proche(sw.ratio, 2 / 3));
  // Le « et » de chaque temps = 3e case du triolet de la grille batterie.
  const tambour = packSwing(BLUES, 88);
  for (let temps = 0; temps < 4; temps++) {
    const basse = swingBeat(temps + 0.5, sw.ratio, sw.stepsPerBeat);
    const charleston = stepPosition(temps * 3 + 2, 12, tambour.ratio, 4, tambour.stepsPerBeat) * 4;
    assert.ok(proche(basse, charleston), `temps ${temps + 1} : ${basse} = ${charleston}`);
  }
});

test("blues : toutes les positions de la walking bass et du comping tombent sur la grille de triolets", () => {
  const sw = companionSwing(BLUES, 88);
  const surGrille = (b) => {
    const p = swingBeat(b, sw.ratio, sw.stepsPerBeat) * 3;   // en cases de triolet
    return proche(p, Math.round(p), 1e-6);
  };
  let rng = 0.1;
  const alea = () => { rng = (rng * 9301 + 0.49297) % 1; return rng; };
  for (let bar = 0; bar < 200; bar++) {
    const notes = generateWalkingBar({ rootName: "A", nextRoot: "D", style: "blues", barIndex: bar, energy: 5, rng: alea });
    for (const n of notes) assert.ok(surGrille(n.beat), `basse beat ${n.beat}`);
  }
  const comper = createComper("blues", alea);
  for (let bar = 0; bar < 200; bar++) {
    for (const h of comper.nextBar(bar, 4)) assert.ok(surGrille(h.beat), `comping beat ${h.beat}`);
  }
});

test("funk 16 : les croches de l'accompagnement restent droites, comme la charleston", () => {
  const sw = companionSwing(FUNK, 96);
  assert.equal(sw.stepsPerBeat, 4);
  assert.ok(proche(swingBeat(1.5, sw.ratio, sw.stepsPerBeat), 1.5));
  assert.ok(proche(swingBeat(3.5, sw.ratio, sw.stepsPerBeat), 3.5));
  // Une double-croche éventuelle tomberait exactement avec la batterie.
  assert.ok(proche(swingBeat(0.25, sw.ratio, sw.stepsPerBeat), stepPosition(1, 16, sw.ratio, 4, 4) * 4));
});
