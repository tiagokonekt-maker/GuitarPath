// Module 0 « Premiers pas » (debut) : place dans le parcours, règle
// obligatoire / facultatif, placement, badges. Sur le VRAI contenu.
import { test } from "node:test";
import assert from "node:assert/strict";
import { COURSES, QUIZ, EXERCISES } from "../src/content/index.js";
import { buildUnits, buildPath, getNextLesson, debutFacultatif } from "../src/store/pathEngine.js";
import { availableModules, buildPlacementQueue } from "../src/store/placementEngine.js";
import { computeNewBadges } from "../src/store/badges.js";
import { defaultState } from "../src/store/state.js";

const content = { courses: COURSES, quiz: QUIZ, exercises: EXERCISES };
const debut = COURSES.find(c => c.id === "debut");
const unites = buildUnits(COURSES);
const unitesDebut = unites.filter(u => u.prelude);
const premierPalier = unites.find(u => !u.prelude);

const avecOnboarding = (onboarding, extra = {}) => ({
  ...defaultState(),
  ...extra,
  onboarding: { ...defaultState().onboarding, done: true, ...onboarding },
});
// Ce qu'enregistre OnboardingScreen pour « Je débute complètement ».
const debutantDeclare = (extra) => avecOnboarding({ skipped: true, overallTier: "A1",
  skillLevels: { neck: "A1", scales: "A1", harmony: "A1", rhythm: "A1", impro: "A1" } }, extra);
// Ce qu'il enregistre pour un joueur qui a passé le test.
const joueurTeste = (tier, extra) => avecOnboarding({ skipped: false, overallTier: tier }, extra);

const toutFait = (units) => {
  const completedLessons = {}, unitChecks = {};
  for (const u of units) {
    for (const l of u.lessons) completedLessons[l.id] = "2026-10-01";
    unitChecks[u.id] = { passed: true, score: 100, attempts: 1 };
  }
  return { completedLessons, unitChecks };
};

test("le module debut est le premier module et ses unités ouvrent le parcours", () => {
  assert.equal(COURSES[0].id, "debut");
  assert.deepEqual(unitesDebut.map(u => u.id), ["debut-1", "debut-2", "debut-3"]);
  assert.deepEqual(unites.slice(0, 3).map(u => u.id), ["debut-1", "debut-2", "debut-3"]);
  assert.equal(premierPalier.id, "palier-1");
  // Aucune leçon de debut ne se glisse dans un palier, et rien n'est perdu.
  const idsDebut = new Set(debut.lessons.map(l => l.id));
  assert.equal(unitesDebut.flatMap(u => u.lessons).length, debut.lessons.length);
  for (const u of unites.filter(u => !u.prelude)) assert.ok(u.lessons.every(l => !idsDebut.has(l.id)), u.id);
  for (const u of unitesDebut) assert.ok(u.lessons.length >= 2 && u.lessons.length <= 8, u.id);
});

test("nouveau débutant (onboarding pas encore fait) : le parcours commence par debut", () => {
  const path = buildPath(content, defaultState());
  assert.equal(path[0].id, "debut-1");
  assert.equal(path[0].isCurrent, true);
  assert.equal(path[0].optional, false);
  assert.equal(path[1].unlocked, false);
  assert.equal(path.find(u => u.id === "palier-1").unlocked, false);
  assert.equal(getNextLesson(content, defaultState()).lesson.id, debut.lessons[0].id);
});

test("débutant déclaré à l'onboarding : debut obligatoire, palier 1 verrouillé tant que debut n'est pas fini", () => {
  const etat = debutantDeclare();
  assert.equal(debutFacultatif(etat, unites), false);
  const path = buildPath(content, etat);
  assert.equal(path[0].isCurrent, true);
  assert.equal(path.find(u => u.id === "palier-1").unlocked, false);
  assert.equal(getNextLesson(content, etat).unit.id, "debut-1");

  // Debut terminé (leçons + vérifications) : le palier 1 s'ouvre et devient courant.
  const fini = debutantDeclare(toutFait(unitesDebut));
  const apres = buildPath(content, fini);
  const p1 = apres.find(u => u.id === "palier-1");
  assert.equal(p1.unlocked, true);
  assert.equal(p1.isCurrent, true);
  assert.ok(apres.filter(u => u.prelude).every(u => u.complete && !u.optional));
});

test("joueur qui a passé le test (même A1) : debut facultatif, ouvert, jamais bloquant", () => {
  for (const tier of ["A1", "A2", "B1", "B2"]) {
    const etat = joueurTeste(tier);
    assert.equal(debutFacultatif(etat, unites), true, tier);
    const path = buildPath(content, etat);
    const prelude = path.filter(u => u.prelude);
    assert.ok(prelude.every(u => u.unlocked && u.optional && !u.isCurrent), tier);
    // Signalé par `optional` (pastille à l'écran), pas par le titre.
    assert.ok(prelude.every(u => !u.title.includes("facultatif")), tier);
    const p1 = path.find(u => u.id === "palier-1");
    assert.equal(p1.unlocked, true, tier);
    assert.notEqual(getNextLesson(content, etat).unit.id.startsWith("debut"), true, tier);
  }
  // A1 : on commence au palier 1.
  assert.equal(buildPath(content, joueurTeste("A1")).find(u => u.isCurrent).id, "palier-1");
});

test("le headstart du placement compte les paliers, pas les unités debut", () => {
  const path = buildPath(content, joueurTeste("B2"));
  const paliers = path.filter(u => !u.prelude);
  assert.ok(paliers.slice(0, 3).every(u => u.headstart && u.unlocked));
  assert.equal(paliers[3].headstart, false);
  assert.equal(path.find(u => u.isCurrent).id, paliers[3].id);
});

test("utilisateur existant avec progression : jamais renvoyé ni bloqué par debut", () => {
  // Onboarding fait avant l'arrivée du module (pas de `skipped`), progression
  // jusqu'au palier 2 : rien ne change pour lui.
  const avant = unites.filter(u => !u.prelude).slice(0, 2);
  const etat = avecOnboarding({ overallTier: "A1" }, toutFait(avant));
  const path = buildPath(content, etat);
  assert.ok(path.filter(u => u.prelude).every(u => u.optional && u.unlocked && !u.isCurrent));
  const courant = path.find(u => u.isCurrent);
  assert.equal(courant.id, unites.filter(u => !u.prelude)[2].id);
  assert.ok(!getNextLesson(content, etat).lesson.id.startsWith("debut"));
});

test("ancien compte migré (skipped sans niveau) ou progression sans onboarding : debut facultatif", () => {
  const leconPalier = premierPalier.lessons[0].id;
  const migre = avecOnboarding({ skipped: true, overallTier: null }, { completedLessons: { [leconPalier]: "2026-01-01" } });
  assert.equal(debutFacultatif(migre, unites), true);
  // Même un état « débutant déclaré » qui a déjà une leçon de palier faite
  // n'est pas bloqué : une progression existante prime toujours.
  const etat = debutantDeclare({ completedLessons: { [leconPalier]: "2026-01-01" } });
  assert.equal(debutFacultatif(etat, unites), true);
  const p1 = buildPath(content, etat).find(u => u.id === "palier-1");
  assert.equal(p1.unlocked, true);
  assert.equal(p1.isCurrent, true);
});

test("un joueur confirmé qui ouvre une leçon de debut n'est pas ramené dessus", () => {
  const etat = joueurTeste("B1", { completedLessons: { [debut.lessons[0].id]: "2026-10-01" } });
  const path = buildPath(content, etat);
  assert.equal(path.find(u => u.id === "debut-1").isCurrent, false);
  assert.ok(!path.find(u => u.isCurrent).prelude);
  assert.ok(!getNextLesson(content, etat).unit.prelude);
});

test("le champ onboarding.experience, s'il est conservé, prime sur la déduction", () => {
  assert.equal(debutFacultatif(avecOnboarding({ experience: "debutant", skipped: false, overallTier: "B1" }), unites), false);
  assert.equal(debutFacultatif(avecOnboarding({ experience: "confirme", skipped: true, overallTier: "A1" }), unites), true);
});

test("debut n'entre jamais dans le test de placement", () => {
  assert.ok(!availableModules(QUIZ).includes("debut"));
  assert.ok(buildPlacementQueue(QUIZ).every(x => x.moduleId !== "debut"));
});

test("chaque leçon de debut a des questions, toutes rattachées au module debut", () => {
  for (const l of debut.lessons) {
    assert.ok((l.quiz || []).length >= 3, l.id);
    for (const qid of l.quiz) assert.equal(QUIZ.find(q => q.id === qid)?.courseId, "debut", qid);
  }
  assert.ok(EXERCISES.filter(e => e.mod === "debut").length >= 4);
});

test("badges : « Premiers pas franchis » à la fin de debut, et debut ne compte pas dans « 5 modules finis »", () => {
  const base = { ...defaultState(), unlockedBadges: [] };
  const leconsDebut = Object.fromEntries(debut.lessons.map(l => [l.id, "2026-10-01"]));
  assert.ok(computeNewBadges({ ...base, completedLessons: leconsDebut }, content).includes("debut_done"));
  const presque = Object.fromEntries(debut.lessons.slice(1).map(l => [l.id, "2026-10-01"]));
  assert.ok(!computeNewBadges({ ...base, completedLessons: presque }, content).includes("debut_done"));

  const horsDebut = Object.fromEntries(COURSES.filter(c => c.id !== "debut").flatMap(c => c.lessons).map(l => [l.id, "2026-10-01"]));
  assert.ok(computeNewBadges({ ...base, completedLessons: horsDebut }, content).includes("all_modules"));
});
