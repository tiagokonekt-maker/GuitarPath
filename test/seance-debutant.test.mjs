// Séance du jour d'un débutant : l'étape « Jouer » propose un morceau
// d'Outils › Morceaux (ou un exercice de Premiers pas), jamais la Jam Session.
import { test } from "node:test";
import assert from "node:assert/strict";
import { planSeance, seanceDebutant, choisirJeuDebutant, MORCEAUX_DEBUTANT } from "../src/store/seance.js";
import { reducer } from "../src/store/reducer.js";
import { defaultState, todayStr } from "../src/store/state.js";
import { morceauParId } from "../src/morceaux/catalogue.js";
import { COURSES, QUIZ, EXERCISES } from "../src/content/index.js";

const content = { courses: COURSES, quiz: QUIZ, exercises: EXERCISES };
const today = todayStr();
const debut = COURSES.find(c => c.id === "debut").lessons.map(l => l.id);
const faites = (ids) => Object.fromEntries(ids.map(id => [id, "2026-09-01"]));
const debutant = (ids, extra = {}) => ({
  ...defaultState(),
  onboarding: { ...defaultState().onboarding, done: true, experience: "debutant" },
  completedLessons: faites(ids), ...extra,
});
const jouer = (state, duree = 15, jour = today) =>
  planSeance({ duree, state, content, today: jour, revisionDisponible: 5 }).etapes.find(e => e.id === "jouer");
const jusqua = (id) => debut.slice(0, debut.indexOf(id) + 1);
// Tout Premiers pas sauf une leçon d'accordage : encore débutant, mélodies vues.
const presqueFini = () => debutant(debut.filter(id => id !== "debut-c1-06"));

test("débutant : Premiers pas pas fini → séance débutant ; fini → séance normale", () => {
  assert.equal(seanceDebutant(debutant(jusqua("debut-c2-03")), content), true);
  assert.equal(seanceDebutant(debutant(debut), content), false);
  // Parcours par défaut (onboarding pas fait) : même règle que le Parcours.
  assert.equal(seanceDebutant({ ...defaultState(), completedLessons: faites(["debut-c1-01"]) }, content), true);
});

test("joueur confirmé qui feuillette Premiers pas : il garde la Jam Session", () => {
  const confirme = { ...debutant(["debut-c1-01", "neck-c1-01"]), onboarding: { ...defaultState().onboarding, done: true, experience: "joue" } };
  assert.equal(seanceDebutant(confirme, content), false);
  const e = jouer(confirme);
  assert.equal(e.morceau, undefined);
  assert.match(e.detail, /Jam/);
});

test("l'étape Jouer d'un débutant n'envoie jamais en Jam, quelle que soit sa progression", () => {
  for (let i = 1; i < debut.length; i++) {
    for (const duree of [5, 15, 30]) {
      const e = jouer(debutant(debut.slice(0, i)), duree);
      assert.ok(e.debutant, `${debut[i - 1]} · ${duree} min`);
      assert.ok(e.morceau || e.exercice || e.outil, "une activité concrète est proposée");
      assert.doesNotMatch(e.detail, /Jam/);
      if (e.morceau) assert.ok(morceauParId(e.morceau), `${e.morceau} existe`);
    }
  }
});

test("accords Sol, Mim, Do, Ré appris → Premiers accords", () => {
  const e = jouer(debutant(jusqua("debut-c2-03")));
  assert.equal(e.morceau, "premiers-accords");
  assert.match(e.detail, /Premiers accords/);
});

test("avant les accords : un exercice de Premiers pas débloqué, pas un morceau", () => {
  const e = jouer(debutant(jusqua("debut-c1-04")));
  assert.equal(e.morceau, undefined);
  assert.equal(e.exercice?.mod, "debut");
  assert.ok(["debut-c1-01", "debut-c1-04"].includes(e.exercice.courseLink));
});

test("« Premières mélodies » faite → Frère Jacques, Au clair de la lune, Ode à la joie en rotation", () => {
  const etat = presqueFini();
  assert.ok(seanceDebutant(etat, content));
  const vus = new Set(["2026-10-01", "2026-10-02", "2026-10-03"].map(j => jouer(etat, 15, j).morceau));
  assert.deepEqual([...vus].sort(), ["au-clair-de-la-lune", "frere-jacques", "ode-a-la-joie"]);
});

test("le choix est stable dans la journée (même jour → même morceau)", () => {
  const etat = presqueFini();
  assert.equal(jouer(etat, 15, "2026-10-05").morceau, jouer(etat, 30, "2026-10-05").morceau);
});

test("30 min : l'exercice de « Jouer » n'est jamais celui de « Guitare en main »", () => {
  for (let i = 1; i < debut.length; i++) {
    const p = planSeance({ duree: 30, state: debutant(debut.slice(0, i)), content, today, revisionDisponible: 5 });
    const g = p.etapes.find(e => e.id === "guitare"), j = p.etapes.find(e => e.id === "jouer");
    if (g && j.exercice) assert.notEqual(g.exercice.id, j.exercice.id);
  }
});

test("l'étape se coche avec le temps joué dans le lecteur de morceaux (horsJam)", () => {
  let st = debutant(jusqua("debut-c2-03"));
  assert.equal(jouer(st).fait, false);
  st = reducer(st, { type: "JAM_PROGRES", secondes: 3600, horsJam: true });
  assert.equal(jouer(st).fait, true);
  assert.equal(st.jam.secondes, 0, "le lecteur de morceaux ne compte pas dans les heures de jam (badges)");
  assert.equal(st.jam.secondesJour, 3600);
});

test("un exercice proposé se coche quand il est fait aujourd'hui", () => {
  const st = debutant(jusqua("debut-c1-04"));
  const e = jouer(st);
  assert.ok(e.exercice);
  const fait = { ...st, completedExercises: { [e.exercice.id]: { lastAt: today } } };
  assert.equal(jouer(fait).fait, true);
});

test("morceaux débutants : ils existent, sont « débutant », et dépendent de leçons de Premiers pas", () => {
  for (const m of MORCEAUX_DEBUTANT) {
    assert.equal(morceauParId(m.morceau)?.niveau, "debutant", m.morceau);
    for (const id of m.requis) assert.ok(debut.includes(id), `${id} est une leçon de Premiers pas`);
  }
  assert.deepEqual(choisirJeuDebutant(debutant([]), { exercises: [] }, today), { outil: "tuner" });
});
