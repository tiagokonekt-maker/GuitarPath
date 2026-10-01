import { test } from "node:test";
import assert from "node:assert/strict";
import { planifierTab, REGLAGES, CORDE_MIDI } from "../src/tab/tabSon.js";

// rng constant : pas de variation aléatoire, pour des valeurs exactes.
const fixe = () => 0.5;   // 0.5 → variation de vélocité nulle ; décalage = 3,5 ms
const plan = (evs, o = {}) => planifierTab(evs, { bpm: 60, rng: fixe, ...o });   // 60 BPM : 1 col = 0,25 s
const J = REGLAGES.decalageMaxMs / 2000;   // décalage produit par fixe()

test("une note résonne jusqu'à ce que la MÊME corde rejoue — plus de note coupée à la double-croche", () => {
  const { voix } = plan([{ type: "note", fret: 5, col: 0, string: 1 }, { type: "note", fret: 7, col: 8, string: 1 }]);
  assert.equal(voix.length, 2);
  assert.ok(Math.abs(voix[0].fin - voix[1].debut) < 1e-9, "la première s'arrête pile quand la corde rejoue");
  assert.ok(voix[0].fin - voix[0].debut > 1.9, `elle sonne ${(voix[0].fin - voix[0].debut).toFixed(2)} s, pas 0,25 s`);
});

test("une note sur une AUTRE corde ne coupe pas la première (elles sonnent ensemble)", () => {
  const { voix } = plan([{ type: "note", fret: 5, col: 0, string: 1 }, { type: "note", fret: 7, col: 2, string: 2 }]);
  const c1 = voix.find(v => v.corde === 1);
  assert.ok(c1.fin > 1, "la corde 1 continue de sonner pendant la corde 2");
});

test("une note isolée ne sonne pas indéfiniment", () => {
  const { voix } = plan([{ type: "note", fret: 5, col: 0, string: 1 }]);
  assert.ok(Math.abs((voix[0].fin - voix[0].debut) - REGLAGES.resonanceFinale) < 1e-9);
});

test("bend : la hauteur MONTE en continu depuis la case jouée, sans nouvelle attaque", () => {
  const { voix } = plan([{ type: "bend", fromFret: 7, toFret: 9, col: 0, string: 3 }]);
  assert.equal(voix.length, 1, "une seule voix : pas de seconde attaque");
  const h = voix[0].hauteurs;
  assert.equal(h[0].midi, CORDE_MIDI[3] + 7, "on part bien de la case jouée (Ré, pas la note d'arrivée)");
  assert.equal(h.at(-1).midi, CORDE_MIDI[3] + 9);
  assert.equal(h.at(-1).forme, "rampe", "montée continue, pas un saut");
  assert.ok(h.at(-1).t > h[1].t && h.at(-1).t <= REGLAGES.bendDelaiS + REGLAGES.bendDureeMax + 1e-9);
});

test("slide : glissement continu jusqu'à la case d'arrivée, arrivée avant sa colonne", () => {
  const { voix } = plan([{ type: "slide_up", fromFret: 5, toFret: 7, col: 0, toCol: 2, string: 5 }]);
  assert.equal(voix.length, 1, "pas d'escalier de notes intermédiaires");
  const h = voix[0].hauteurs;
  assert.deepEqual([h[0].midi, h[1].midi], [CORDE_MIDI[5] + 5, CORDE_MIDI[5] + 7]);
  assert.equal(h[1].forme, "rampe");
  assert.ok(h[1].t < 2 * 0.25, "le glissé est fini avant la colonne d'arrivée");
});

test("hammer-on : changement de hauteur INSTANTANÉ, dans la même voix (pas de médiator)", () => {
  const { voix } = plan([{ type: "hammer", fromFret: 5, toFret: 7, col: 0, toCol: 2, string: 3 }]);
  assert.equal(voix.length, 1);
  const h = voix[0].hauteurs;
  assert.equal(h[1].forme, "saut");
  assert.ok(Math.abs(h[1].t - 0.5) < 1e-9, "l'arrivée tombe sur sa colonne (2 × 0,25 s)");
  assert.ok(voix[0].fin > voix[0].debut + 0.5, "la voix continue de sonner après l'arrivée");
});

test("note étouffée : un « tchk » court et sourd, plus un silence", () => {
  const { voix } = plan([{ type: "mute", col: 0, string: 6 }]);
  assert.equal(voix.length, 1);
  assert.ok(voix[0].etouffee);
  assert.ok(voix[0].fin - voix[0].debut <= REGLAGES.etouffeeDuree + 1e-9);
});

test("accord : gratté de la corde grave vers l'aiguë, à quelques millisecondes d'écart", () => {
  const accord = [1, 2, 3, 4, 5].map(s => ({ type: "note", fret: 0, col: 0, string: s }));
  const { voix } = plan(accord);
  const ordre = [...voix].sort((a, b) => a.debut - b.debut).map(v => v.corde);
  assert.deepEqual(ordre, [5, 4, 3, 2, 1]);
  const etalement = voix.reduce((m, v) => Math.max(m, v.debut), 0) - voix.reduce((m, v) => Math.min(m, v.debut), 9);
  assert.ok(etalement > 0.03 && etalement < 0.07, `étalement ${Math.round(etalement * 1000)} ms`);
});

test("deux notes seules sur la même colonne ne sont pas « grattées » (ce n'est pas un accord)", () => {
  const { voix } = plan([{ type: "note", fret: 0, col: 0, string: 1 }, { type: "note", fret: 0, col: 0, string: 2 }]);
  assert.ok(Math.abs(voix[0].debut - voix[1].debut) < 1e-9);
});

test("accents : le temps est joué plus fort que le « et », lui-même plus fort que les doubles", () => {
  const { voix } = plan([0, 1, 2].map(c => ({ type: "note", fret: 5, col: c, string: 1 })));
  const [temps, double, croche] = voix.map(v => v.velocite);
  assert.ok(temps > croche && croche > double, `${temps} > ${croche} > ${double}`);
});

test("humanisation : jamais deux fois exactement pareil, jamais en avance sur la grille", () => {
  const evs = Array.from({ length: 16 }, (_, i) => ({ type: "note", fret: 5, col: i * 4, string: 1 }));
  const { voix } = planifierTab(evs, { bpm: 60 });   // vrai aléatoire
  assert.ok(new Set(voix.map(v => v.velocite.toFixed(3))).size > 5, "les forces varient");
  for (const v of voix) {
    const grille = v.ev.col * 0.25;
    assert.ok(v.debut >= grille && v.debut <= grille + REGLAGES.decalageMaxMs / 1000 + 1e-9, "jamais avant la grille");
  }
});

test("réglages ajustables à l'oreille, sans toucher au code", () => {
  const { voix } = plan([{ type: "note", fret: 5, col: 0, string: 1 }], { reglages: { resonanceFinale: 0.8 } });
  assert.ok(Math.abs((voix[0].fin - voix[0].debut) - 0.8) < 1e-9);
});

test("entrée vide : aucun plantage", () => {
  assert.deepEqual(planifierTab([]), { voix: [], duree: 0 });
});
