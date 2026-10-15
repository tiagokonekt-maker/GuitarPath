import { test } from "node:test";
import assert from "node:assert/strict";
import { empilerAscendant } from "../src/audioEngine.js";

const midi = (n) => {
  const m = n.match(/^([A-G])(b|#)?(\d)$/);
  const base = { C: 0, D: 2, E: 4, F: 5, G: 7, A: 9, B: 11 }[m[1]] + (m[2] === "#" ? 1 : m[2] === "b" ? -1 : 0);
  return (Number(m[3]) + 1) * 12 + base;
};

// La gamme jouée par l'Explorateur doit MONTER, quelle que soit sa tonique
// (l'ancienne règle « 5 premières notes à l'octave 3 » faisait redescendre
// la pentatonique de La : A3 puis C3).
test("gammes et arpèges toujours empilés en montant", () => {
  const cas = [["A", "C", "D", "E", "G"], ["E", "F#", "G#", "A", "B", "C#", "D#"], ["G", "B", "D", "F"], ["F#", "A#", "C#"]];
  for (const notes of cas) {
    const m = empilerAscendant(notes).map(midi);
    for (let i = 1; i < m.length; i++) assert.ok(m[i] > m[i - 1], `${notes.join(" ")} : ${m.join(" ")}`);
    assert.ok(m[0] >= midi("C2") && m.at(-1) <= midi("B5"));
  }
  assert.deepEqual(empilerAscendant(["A", "C", "D", "E", "G"]), ["A3", "C4", "D4", "E4", "G4"]);
});
