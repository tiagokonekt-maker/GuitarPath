import { test } from "node:test";
import assert from "node:assert/strict";
import { BADGES, computeNewBadges } from "../src/store/badges.js";
import { defaultState, mergeStates } from "../src/store/state.js";
import { reducer } from "../src/store/reducer.js";

// Les trois compteurs des badges (le compteur de jam porte aussi le temps du
// jour, pour la séance du jour : on ne fige pas la liste complète des champs).
const compteurs = (j) => ({ seances: j.seances, secondes: j.secondes, contraintes: j.contraintes });
import { COURSES, QUIZ, EXERCISES } from "../src/content.js";

const content = { courses: COURSES, quiz: QUIZ, exercises: EXERCISES };
const debloques = (state) => computeNewBadges({ ...defaultState(), ...state }, content);
const maitrise = (n = 9) => ({ attempts: n, successes: n, streak: n, lastSeen: "2026-09-01", ease: 2.5, interval: 30 });
const histoire = (familles) => Object.fromEntries(familles.map(f => [`gen:${f}`, maitrise()]));

// Icônes réellement présentes dans le jeu d'icônes de l'app (vérifiées à l'écran
// ou déjà utilisées ailleurs). « target » et « lock-open » n'en font pas partie.
const ICONES_CONNUES = new Set(["flag", "guitar-pick", "help-circle", "flame", "star", "bolt", "trophy", "circle-check", "target-arrow", "medal",
  "map-2", "music", "stack-2", "metronome", "wand", "crown", "book-2", "books", "dice-5", "mountain", "calendar-check", "anchor",
  "baby-carriage", "campfire", "sword", "sparkles", "ear", "music-plus", "clock"]);

test("chaque badge utilise une icône qui existe (plus de carré vide)", () => {
  for (const b of BADGES) assert.ok(ICONES_CONNUES.has(b.icon.replace("ti-", "")), `${b.id} : icône inconnue « ${b.icon} »`);
});

test("les identifiants de badges sont uniques", () => {
  assert.equal(new Set(BADGES.map(b => b.id)).size, BADGES.length);
});

test("« 100 exercices » (impossible avec 36 exercices) est remplacé par « Tous les exercices », atteignable", () => {
  assert.ok(!BADGES.some(b => b.id === "ex_100"));
  const tous = Object.fromEntries(EXERCISES.map(e => [e.id, { completedAt: "2026-09-01", count: 1 }]));
  assert.ok(debloques({ completedExercises: tous }).includes("ex_all"));
  const presque = Object.fromEntries(EXERCISES.slice(1).map(e => [e.id, { completedAt: "2026-09-01", count: 1 }]));
  assert.ok(!debloques({ completedExercises: presque }).includes("ex_all"), "il en manque un : pas de badge");
});

test("compétences : un badge au premier niveau 3, rien avant", () => {
  assert.ok(!debloques({ reviewHistory: { "gen:notes-corde-6": maitrise(5) } }).includes("comp_first"), "5 réussites = niveau 2 seulement");
  assert.ok(debloques({ reviewHistory: { "gen:notes-corde-6": maitrise(8) } }).includes("comp_first"));
});

test("compétences : une erreur récente fait redescendre, le badge attend la consolidation", () => {
  const h = { "gen:notes-corde-6": { attempts: 12, successes: 9, streak: 0, lastSeen: "2026-09-01", ease: 2, interval: 1 } };
  assert.ok(!debloques({ reviewHistory: h }).includes("comp_first"));
});

test("Manche cartographié : les 6 cordes au niveau 3, pas 5", () => {
  const six = ["notes-corde-6", "notes-corde-5", "notes-corde-4", "notes-corde-3", "notes-corde-2", "notes-corde-1"];
  assert.ok(!debloques({ reviewHistory: histoire(six.slice(0, 5)) }).includes("comp_manche"));
  assert.ok(debloques({ reviewHistory: histoire(six) }).includes("comp_manche"));
});

test("Oreille affûtée et Bâtisseur d'accords : chacun ses trois compétences", () => {
  assert.ok(debloques({ reviewHistory: histoire(["oreille-hauteur", "oreille-intervalles", "oreille-accords"]) }).includes("comp_oreille"));
  assert.ok(!debloques({ reviewHistory: histoire(["oreille-hauteur", "oreille-intervalles"]) }).includes("comp_oreille"));
  assert.ok(debloques({ reviewHistory: histoire(["triades", "accords-7", "guide-tones"]) }).includes("comp_accords"));
});

test("les badges de compétences visent des compétences qui existent", async () => {
  const { FAMILLES } = await import("../src/store/generateurs.js");
  const ids = new Set(FAMILLES.map(f => f.id));
  for (const f of ["notes-corde-6", "notes-corde-5", "notes-corde-4", "notes-corde-3", "notes-corde-2", "notes-corde-1",
    "oreille-hauteur", "oreille-intervalles", "oreille-accords", "triades", "accords-7", "guide-tones"]) assert.ok(ids.has(f), f);
});

test("Jam Session : séances, temps et contraintes via le reducer", () => {
  let s = defaultState();
  for (let i = 0; i < 10; i++) s = reducer(s, { type: "JAM_PROGRES", seance: true });
  s = reducer(s, { type: "JAM_PROGRES", secondes: 3600 });
  for (let i = 0; i < 10; i++) s = reducer(s, { type: "JAM_PROGRES", contrainte: true });
  assert.deepEqual(compteurs(s.jam), { seances: 10, secondes: 3600, contraintes: 10 });
  const b = computeNewBadges(s, content);
  for (const id of ["jam_1", "jam_10", "jam_c10"]) assert.ok(b.includes(id), id);
  assert.ok(!b.includes("jam_5h"), "1 h de jam ne donne pas le badge 5 h");
});

test("JAM_PROGRES : une valeur aberrante ne gonfle pas le temps, et aucune XP n'est donnée", () => {
  const s = reducer(defaultState(), { type: "JAM_PROGRES", secondes: 1e9 });
  assert.equal(s.jam.secondes, 3600, "plafonné à 1 h par envoi");
  assert.equal(reducer(defaultState(), { type: "JAM_PROGRES", secondes: -50 }).jam.secondes, 0);
  assert.equal(s.xp, 0);
});

test("JAM_PROGRES sur un ancien état sans champ jam : pas de NaN", () => {
  const ancien = { ...defaultState() }; delete ancien.jam;
  assert.deepEqual(compteurs(reducer(ancien, { type: "JAM_PROGRES", seance: true, secondes: 30 }).jam), { seances: 1, secondes: 30, contraintes: 0 });
});

test("synchro entre appareils : le compteur de jam ne recule jamais (max champ par champ)", () => {
  const a = { ...defaultState(), jam: { seances: 4, secondes: 900, contraintes: 1 } };
  const b = { ...defaultState(), jam: { seances: 2, secondes: 2000, contraintes: 5 } };
  assert.deepEqual(compteurs(mergeStates(a, b).jam), { seances: 4, secondes: 2000, contraintes: 5 });
  assert.deepEqual(mergeStates(b, a).jam, mergeStates(a, b).jam, "le merge est commutatif");
  const sansJam = { ...defaultState() }; delete sansJam.jam;
  assert.deepEqual(compteurs(mergeStates(sansJam, a).jam), compteurs(a.jam), "un appareil resté sur l'ancienne version ne fait rien perdre");
});
