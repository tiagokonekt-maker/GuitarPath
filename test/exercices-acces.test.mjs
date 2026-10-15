// Groply — test/exercices-acces.test.mjs
// Les exercices doivent être ATTEIGNABLES : l'onglet Pratique les liste par
// domaine selon leur déblocage (store/seance.js → exerciceDebloque), règle
// partagée avec la séance du jour. Un courseLink ou unlockedBy qui pointe vers
// une leçon inexistante rendrait l'exercice invisible pour toujours.
import { test } from "node:test";
import assert from "node:assert/strict";
import { COURSES, EXERCISES } from "../src/content/index.js";
import { exerciceDebloque, exercicesDesModules, choisirExercice } from "../src/store/seance.js";

const content = { courses: COURSES, exercises: EXERCISES };
const idsLecons = new Set(COURSES.flatMap(c => c.lessons.map(l => l.id)));
const toutesFaites = Object.fromEntries([...idsLecons].map(id => [id, true]));
const MODULES = COURSES.map(c => c.id);

test("chaque exercice pointe vers des leçons qui existent, dans un module connu", () => {
  for (const e of EXERCISES) {
    assert.ok(MODULES.includes(e.mod), `${e.id} : module inconnu ${e.mod}`);
    for (const id of [...(e.unlockedBy || []), e.courseLink].filter(Boolean)) {
      assert.ok(idsLecons.has(id), `${e.id} : leçon requise inexistante ${id}`);
    }
  }
});

test("aucune leçon faite : seuls les exercices sans prérequis sont ouverts ; toutes faites : tous", () => {
  for (const e of EXERCISES) {
    const libre = !e.unlockedBy?.length && !e.courseLink;
    assert.equal(exerciceDebloque(e, {}), libre, e.id);
    assert.equal(exerciceDebloque(e, toutesFaites), true, e.id);
  }
});

test("un exercice Premiers pas s'ouvre dès que sa leçon liée est faite", () => {
  const debut = EXERCISES.filter(e => e.mod === "debut");
  assert.ok(debut.length > 0, "le module debut a des exercices");
  for (const e of debut) {
    const requises = [...(e.unlockedBy || []), e.courseLink].filter(Boolean);
    const faites = Object.fromEntries(requises.map(id => [id, true]));
    assert.equal(exerciceDebloque(e, faites), true, e.id);
    const { dispo } = exercicesDesModules(content, { completedLessons: faites }, ["debut"]);
    assert.ok(dispo.some(x => x.id === e.id), `${e.id} listé dans le domaine Premiers pas`);
  }
});

test("exercicesDesModules : partition débloqués / verrouillés, niveau croissant", () => {
  const moitie = Object.fromEntries([...idsLecons].filter((_, i) => i % 2 === 0).map(id => [id, true]));
  for (const mods of [["debut"], ["neck"], ["scales", "harmony"], ["rhythm"], ["impro"]]) {
    const { dispo, verrouilles } = exercicesDesModules(content, { completedLessons: moitie }, mods);
    const total = EXERCISES.filter(e => mods.includes(e.mod)).length;
    assert.equal(dispo.length + verrouilles.length, total, mods.join("+"));
    assert.ok(dispo.every(e => exerciceDebloque(e, moitie)));
    assert.ok(verrouilles.every(e => !exerciceDebloque(e, moitie)));
    for (let i = 1; i < dispo.length; i++) assert.ok((dispo[i - 1].lvl || 1) <= (dispo[i].lvl || 1));
  }
});

test("la séance ne propose qu'un exercice débloqué (même règle que la liste)", () => {
  const faites = { [EXERCISES.find(e => e.courseLink)?.courseLink]: true };
  const ex = choisirExercice({ completedLessons: faites, completedExercises: {} }, content, "global");
  if (ex) assert.ok(exerciceDebloque(ex, faites));
  const sansLecon = choisirExercice({ completedLessons: {}, completedExercises: {} }, content, "global");
  const libres = EXERCISES.filter(e => exerciceDebloque(e, {}));
  if (libres.length === 0) assert.equal(sansLecon, null);
  else assert.ok(libres.includes(sansLecon));
});
