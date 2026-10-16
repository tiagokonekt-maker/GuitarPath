// Liens leçons ↔ morceaux (src/content/liens-morceaux.js).
import { test } from "node:test";
import assert from "node:assert/strict";
import { LIENS_MORCEAUX, morceauxDeLecon, leconsDuMorceau } from "../src/content/liens-morceaux.js";
import { MORCEAUX } from "../src/morceaux/catalogue.js";
import { COURSES } from "../src/content/index.js";

const lecons = new Set(COURSES.flatMap(c => c.lessons.map(l => l.id)));
const morceaux = new Set(MORCEAUX.map(m => m.id));

test("chaque leçon et chaque morceau liés existent, sans doublon", () => {
  for (const [lecon, ids] of Object.entries(LIENS_MORCEAUX)) {
    assert.ok(lecons.has(lecon), `leçon inconnue : ${lecon}`);
    assert.ok(Array.isArray(ids) && ids.length > 0, `${lecon} : liste vide`);
    assert.equal(new Set(ids).size, ids.length, `${lecon} : doublon`);
    for (const id of ids) assert.ok(morceaux.has(id), `${lecon} → morceau inconnu : ${id}`);
  }
});

test("les liens demandés sont présents", () => {
  assert.ok(morceauxDeLecon("debut-c2-06").includes("premiers-accords"));
  assert.ok(morceauxDeLecon("debut-c2-05").includes("premiers-accords"));
  for (const m of ["frere-jacques", "au-clair-de-la-lune", "ode-a-la-joie"]) assert.ok(morceauxDeLecon("debut-c3-03").includes(m));
  assert.ok(morceauxDeLecon("scales-c3-04").includes("blues-en-la"));
  assert.ok(morceauxDeLecon("rhy-c5-01").includes("blues-en-la"));
});

test("Premiers pas ne renvoie qu'à des morceaux débutants (sauf la leçon des symboles, pour ses hammer-ons)", () => {
  const niveau = new Map(MORCEAUX.map(m => [m.id, m.niveau]));
  for (const [lecon, ids] of Object.entries(LIENS_MORCEAUX)) {
    if (!lecon.startsWith("debut-") || lecon === "debut-c3-02") continue;
    for (const id of ids) assert.equal(niveau.get(id), "debutant", `${lecon} → ${id}`);
  }
});

test("helpers : leçon sans lien → liste vide ; recherche inverse cohérente", () => {
  assert.deepEqual(morceauxDeLecon("inexistante"), []);
  assert.ok(leconsDuMorceau("blues-en-la").length >= 2);
  for (const id of leconsDuMorceau("blues-en-la")) assert.ok(LIENS_MORCEAUX[id].includes("blues-en-la"));
});
