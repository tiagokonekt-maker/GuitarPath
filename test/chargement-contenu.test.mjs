// Chargement du contenu côté app : index généré (métadonnées + quiz +
// exercices, sans le corps des leçons) et corps chargés à la demande.
// Voir scripts/generer-index-app.mjs et src/lecon/corpsLecon.js.
import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { relative } from "node:path";
import { COURSES, QUIZ, EXERCISES } from "../src/content/index.js";
import * as App from "../src/content/index-app.js";
import { CORPS } from "../src/content/corps-lecons.js";
import { fichiersPerimes, FICHIER_INDEX_APP, CHAMPS_CORPS, RACINE } from "../scripts/generer-index-app.mjs";
import { chargerCorpsLecon } from "../src/lecon/corpsLecon.js";

const sansCorps = (l) => { const r = { ...l }; for (const c of CHAMPS_CORPS) delete r[c]; return r; };
const lecons = COURSES.flatMap(c => c.lessons);

test("index de l'app à jour (sinon : node scripts/generer-index-app.mjs)", async () => {
  const perimes = await fichiersPerimes();
  assert.deepEqual(perimes.map(f => relative(RACINE, f)), [],
    "Index de l'app périmé — lance : node scripts/generer-index-app.mjs");
});

test("index de l'app = index complet moins le corps des leçons", () => {
  assert.deepEqual(App.COURSES, COURSES.map(c => ({ ...c, lessons: c.lessons.map(sansCorps) })));
  assert.deepEqual(App.QUIZ, QUIZ);
  assert.deepEqual(App.EXERCISES, EXERCISES);
});

test("aucun corps de leçon ni import dans l'index chargé au démarrage", () => {
  const src = readFileSync(FICHIER_INDEX_APP, "utf8");
  assert.doesNotMatch(src, /^\s*import\s/m);
  assert.doesNotMatch(src, /import\(/);
  for (const c of CHAMPS_CORPS) assert.doesNotMatch(src, new RegExp(`"${c}"\\s*:`));
  for (const l of App.COURSES.flatMap(c => c.lessons)) {
    for (const c of CHAMPS_CORPS) assert.equal(l[c], undefined, `${l.id}.${c}`);
  }
});

test("chaque leçon avec un corps a son chargeur, qui rend la leçon complète", async () => {
  const avecCorps = lecons.filter(l => CHAMPS_CORPS.some(c => l[c] !== undefined));
  assert.ok(avecCorps.length > 0);
  assert.deepEqual(Object.keys(CORPS).sort(), avecCorps.map(l => l.id).sort());
  for (const l of avecCorps) {
    const m = await CORPS[l.id]();
    assert.equal(m.default, l, `${l.id} : le chargeur doit pointer sur le fichier de la leçon`);
  }
});

test("chargerCorpsLecon : met en cache, refuse un id inconnu", async () => {
  const l = lecons[0];
  const a = await chargerCorpsLecon(l.id);
  assert.equal(a, l);
  assert.equal(await chargerCorpsLecon(l.id), a);
  await assert.rejects(chargerCorpsLecon("lecon-qui-n-existe-pas"));
});
