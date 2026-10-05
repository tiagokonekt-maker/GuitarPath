import { test } from "node:test";
import assert from "node:assert/strict";
import { vivierDuDomaine, planSeance, choisirExercice, dureeParDefaut, objectifJoursSemaine, questionsPour, joursDeLaSemaine, indexJour } from "../src/store/seance.js";
import { reducer } from "../src/store/reducer.js";
import { defaultState, mergeStates, todayStr, weekStr } from "../src/store/state.js";
import { COURSES, QUIZ, EXERCISES } from "../src/content.js";

const content = { courses: COURSES, quiz: QUIZ, exercises: EXERCISES };
const today = todayStr();
const toutesLecons = Object.fromEntries(COURSES.flatMap(c => c.lessons).map(l => [l.id, "2026-09-01"]));
const base = (extra = {}) => ({ ...defaultState(), completedLessons: toutesLecons, ...extra });

test("la durée par défaut suit le temps indiqué au test d'accueil", () => {
  assert.equal(dureeParDefaut("short"), 5);
  assert.equal(dureeParDefaut("medium"), 15);
  assert.equal(dureeParDefaut("long"), 30);
  assert.equal(dureeParDefaut(undefined), 15);
  assert.equal(objectifJoursSemaine("long"), 5);
});

test("5 et 15 min : Révision puis Jouer ; 30 min : avec un vrai exercice entre les deux", () => {
  assert.deepEqual(planSeance({ duree: 5, state: base(), content, today }).etapes.map(e => e.id), ["revision", "jouer"]);
  assert.deepEqual(planSeance({ duree: 15, state: base(), content, today }).etapes.map(e => e.id), ["revision", "jouer"]);
  const p30 = planSeance({ duree: 30, state: base(), content, today });
  assert.deepEqual(p30.etapes.map(e => e.id), ["revision", "guitare", "jouer"]);
  assert.ok(p30.etapes[1].exercice?.id, "un exercice réel est proposé");
});

test("les durées annoncées tombent juste (pas de séance de 30 min qui en dure 45)", () => {
  assert.equal(planSeance({ duree: 5, state: base(), content, today }).totalMinutes, 5);
  assert.equal(planSeance({ duree: 15, state: base(), content, today }).totalMinutes, 15);
  const p = planSeance({ duree: 30, state: base(), content, today });
  assert.ok(p.totalMinutes >= 30 && p.totalMinutes <= 33, `30 min annoncées → ${p.totalMinutes}`);
});

test("l'objectif du test d'accueil oriente vraiment la séance", () => {
  const jouer = (o) => planSeance({ duree: 15, objectif: o, state: base(), content, today }).etapes.find(e => e.id === "jouer").minutes;
  const rev = (o) => planSeance({ duree: 15, objectif: o, state: base(), content, today }).etapes.find(e => e.id === "revision").minutes;
  assert.ok(jouer("impro") > jouer("global"), "Improviser : on joue plus longtemps");
  assert.ok(rev("theorie") > rev("global"), "La théorie : on révise plus longtemps");
  // Chaque objectif, y compris ceux dont le module ne « gagne » jamais par
  // défaut : sans ça, ignorer l'objectif passait inaperçu (le manche sort
  // déjà en tête sans aucune préférence).
  for (const [objectif, modules] of [["manche", ["neck"]], ["theorie", ["scales", "harmony"]], ["impro", ["impro"]]]) {
    const ex = choisirExercice(base(), content, objectif);
    assert.ok(modules.includes(ex.mod), `${objectif} → exercice du module ${ex.mod}, attendu ${modules}`);
  }
});

test("l'exercice proposé n'est jamais lié à une leçon non faite", () => {
  const debutant = { ...defaultState(), completedLessons: { "neck-c1-01": "x", "neck-c1-02": "x" } };
  const ex = choisirExercice(debutant, content, "global");
  if (ex) {
    assert.ok(!ex.courseLink || debutant.completedLessons[ex.courseLink], `${ex.id} renvoie à ${ex.courseLink}, pas encore faite`);
    assert.ok(!(ex.unlockedBy || []).some(id => !debutant.completedLessons[id]), `${ex.id} n'est pas débloqué`);
  }
  assert.equal(choisirExercice({ ...defaultState() }, content, "global"), null, "aucune leçon faite : aucun exercice");
});

test("un exercice jamais fait passe avant un exercice déjà fait", () => {
  const ex1 = choisirExercice(base(), content, "global");
  const apres = base({ completedExercises: { [ex1.id]: { completedAt: today, lastAt: today, count: 1 } } });
  assert.notEqual(choisirExercice(apres, content, "global").id, ex1.id);
});

test("les étapes faites se lisent dans la VRAIE progression, jamais cochées à la main", () => {
  let s = base();
  let p = planSeance({ duree: 30, state: s, content, today });
  assert.equal(p.prochaine.id, "revision"); assert.equal(p.terminee, false);

  s = reducer(s, { type: "REVIEW_SESSION_DONE", xp: 40, score: "5/6" });
  p = planSeance({ duree: 30, state: s, content, today });
  assert.ok(p.etapes[0].fait, "révision terminée → étape faite");
  assert.equal(p.prochaine.id, "guitare");

  s = reducer(s, { type: "COMPLETE_EXERCISE", id: p.etapes[1].exercice.id, xp: 50 });
  p = planSeance({ duree: 30, state: s, content, today });
  assert.equal(p.prochaine.id, "jouer");

  const cible = p.etapes[2].secondesCible;
  s = reducer(s, { type: "JAM_PROGRES", secondes: cible - 30 });
  assert.equal(planSeance({ duree: 30, state: s, content, today }).prochaine.id, "jouer", "30 s de moins : pas encore");
  s = reducer(s, { type: "JAM_PROGRES", secondes: 30 });
  p = planSeance({ duree: 30, state: s, content, today });
  assert.equal(p.terminee, true); assert.equal(p.prochaine, null);
});

test("la révision reste « faite » même si l'historique (10 entrées) l'a fait disparaître", () => {
  let s = reducer(base(), { type: "REVIEW_SESSION_DONE", xp: 20, score: "2/3" });
  s = { ...s, sessionHistory: [] };
  assert.ok(planSeance({ duree: 5, state: s, content, today }).etapes[0].fait);
});

test("le temps de jeu d'un autre jour ne compte pas pour aujourd'hui", () => {
  const s = base({ jam: { ...defaultState().jam, jour: "2026-01-01", secondesJour: 9999 } });
  assert.equal(planSeance({ duree: 5, state: s, content, today }).etapes.find(e => e.id === "jouer").fait, false);
});

test("JAM_PROGRES : le compteur du jour repart à zéro un nouveau jour", () => {
  const hier = base({ jam: { ...defaultState().jam, jour: "2026-01-01", secondesJour: 500 } });
  const s = reducer(hier, { type: "JAM_PROGRES", secondes: 40 });
  assert.equal(s.jam.jour, today); assert.equal(s.jam.secondesJour, 40);
  assert.equal(reducer(s, { type: "JAM_PROGRES", secondes: 20 }).jam.secondesJour, 60, "même jour : ça s'additionne");
});

test("MARK_STREAK note le jour de pratique, une seule fois, même si la série est déjà comptée", () => {
  let s = reducer(base(), { type: "MARK_STREAK" });
  assert.deepEqual(joursDeLaSemaine(s, weekStr()), [today]);
  s = reducer(s, { type: "MARK_STREAK" });
  assert.deepEqual(joursDeLaSemaine(s, weekStr()), [today], "pas de doublon");
  const ancienne = base({ semaine: { cle: "2020-W01", jours: ["2020-01-01"] } });
  assert.deepEqual(joursDeLaSemaine(reducer(ancienne, { type: "MARK_STREAK" }), weekStr()), [today], "nouvelle semaine : on repart à zéro");
});

test("synchro : jours de la semaine réunis, temps du jour sans recul, dernière révision la plus récente", () => {
  const w = weekStr();
  const a = { ...defaultState(), semaine: { cle: w, jours: ["2026-10-05"] }, jam: { ...defaultState().jam, jour: today, secondesJour: 120 }, derniereRevision: "2026-10-04" };
  const b = { ...defaultState(), semaine: { cle: w, jours: ["2026-10-06"] }, jam: { ...defaultState().jam, jour: today, secondesJour: 300 }, derniereRevision: "2026-10-06" };
  const m = mergeStates(a, b);
  assert.deepEqual(m.semaine.jours, ["2026-10-05", "2026-10-06"]);
  assert.equal(m.jam.secondesJour, 300);
  assert.equal(m.derniereRevision, "2026-10-06");
  const vieux = { ...defaultState(), semaine: { cle: "2020-W01", jours: ["2020-01-01"] } };
  assert.equal(mergeStates(vieux, a).semaine.cle, w, "la semaine la plus récente l'emporte");
  const sansChamps = { ...defaultState() }; delete sansChamps.semaine; delete sansChamps.derniereRevision;
  assert.deepEqual(mergeStates(sansChamps, a).semaine.jours, ["2026-10-05"], "un appareil à l'ancienne version ne fait rien perdre");
});

test("utilitaires : questions par durée, jour de la semaine", () => {
  assert.equal(questionsPour(3), 4);
  assert.equal(indexJour("2026-10-05"), 0, "le 5 octobre 2026 est un lundi");
  assert.equal(indexJour("2026-10-11"), 6, "le 11 octobre 2026 est un dimanche");
});

test("réviser un domaine : uniquement ses questions, écrites et générées", async () => {
  const { questionsGenereesPour, familleDe, domaineDe } = await import("../src/store/generateurs.js");
  const vivier = [...QUIZ, ...questionsGenereesPour(base())];
  const oreille = vivierDuDomaine(vivier, "Oreille");
  assert.ok(oreille.length > 0 && oreille.every(q => familleDe(q.id) && domaineDe(familleDe(q.id)) === "Oreille"), "Oreille : seulement des compétences d'écoute");
  const manche = vivierDuDomaine(vivier, "Manche");
  assert.ok(manche.some(q => !familleDe(q.id)) && manche.some(q => familleDe(q.id)), "Manche : questions écrites ET générées");
  assert.ok(manche.every(q => familleDe(q.id) ? domaineDe(familleDe(q.id)) === "Manche" : q.courseId === "neck"));
  const theorie = vivierDuDomaine(vivier, "Théorie");
  assert.ok(theorie.every(q => familleDe(q.id) ? domaineDe(familleDe(q.id)) === "Théorie" : ["scales", "harmony"].includes(q.courseId)));
  assert.deepEqual(vivierDuDomaine(vivier, "Inconnu"), []);
});

test("compte neuf : la séance renvoie au Parcours, pas vers une révision vide", () => {
  const p = planSeance({ duree: 15, state: { ...defaultState() }, content, today });
  assert.equal(p.vide, true); assert.deepEqual(p.etapes, []);
});

test("rien à réviser : l'étape est faite d'office et son temps va au jeu (sinon blocage)", () => {
  const p = planSeance({ duree: 15, state: base(), content, today, revisionDisponible: 0 });
  const rev = p.etapes.find(e => e.id === "revision"), jouer = p.etapes.find(e => e.id === "jouer");
  assert.ok(rev.fait && rev.aJour); assert.equal(rev.minutes, 0);
  assert.equal(jouer.minutes, 15, "les 15 minutes vont au jeu");
  assert.equal(p.prochaine.id, "jouer");
});

test("jamais plus de questions annoncées qu'il n'en existe", () => {
  const p = planSeance({ duree: 30, state: base(), content, today, revisionDisponible: 2 });
  assert.equal(p.etapes[0].questions, 2);
  assert.match(p.etapes[0].detail, /^2 questions/);
});
