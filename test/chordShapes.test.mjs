import { test } from "node:test";
import assert from "node:assert/strict";
import { getChordShapes, hasShapes } from "../src/music/chordShapes.js";
import { CHORD_TYPES } from "../src/fretboardUtils.js";

const CHROMATIC = ["C","C#","D","D#","E","F","F#","G","G#","A","A#","B"];
const OPEN = [4, 9, 2, 7, 11, 4]; // E A D G B E, en classes de hauteur

// Intervalles présents dans une forme placée, relatifs à la fondamentale.
const intervallesDe = (shape, root) => {
  const r = CHROMATIC.indexOf(root);
  return new Set(shape.frets
    .map((f, s) => (f < 0 ? null : (OPEN[s] + f - r + 120) % 12))
    .filter(i => i !== null));
};

const qualites = Object.keys(CHORD_TYPES).filter(hasShapes);

// La validation de getChordShapes ne rejette que les notes ÉTRANGÈRES : une
// forme incomplète (un dim7 sans sa 7e diminuée) passait. Ce test vérifie
// l'inverse : toutes les notes de l'accord sont là, sauf la quinte juste,
// qu'on omet couramment.
test("chaque forme contient toutes les notes de l'accord (quinte juste facultative)", () => {
  for (const q of qualites) {
    const formule = CHORD_TYPES[q].intervals.map(i => i % 12).filter(i => i !== 7);
    for (const root of CHROMATIC) {
      for (const shape of getChordShapes(root, q, 12, CHORD_TYPES[q].intervals)) {
        const presents = intervallesDe(shape, root);
        for (const i of formule) {
          assert.ok(presents.has(i),
            `${root}${CHORD_TYPES[q].sym} (${shape.label}) : intervalle ${i} absent`);
        }
      }
    }
  }
});

test("chaque qualité a au moins une forme valide pour chaque fondamentale", () => {
  for (const q of qualites) {
    for (const root of CHROMATIC) {
      const formes = getChordShapes(root, q, 12, CHORD_TYPES[q].intervals);
      assert.ok(formes.length > 0, `aucune forme pour ${root}${CHORD_TYPES[q].sym}`);
    }
  }
});
