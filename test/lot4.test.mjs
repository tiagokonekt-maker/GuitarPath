// Lot 4 : les quatre longues leçons d'impro des paliers 8 et 9 sont scindées
// en deux (impro-03 → impro-03 + impro-03b, impro-06 → + impro-06b au
// palier 8 ; impro-04 → + impro-04b, impro-05 → + impro-05b au palier 9), et
// une leçon 3NPS (scales-3nps-01) rejoint le palier 8.
//   palier 8 : 17 → 20 leçons, 3 → 4 unités (palier-8-4 APPARAÎT) ;
//   palier 9 : 16 → 18 leçons, 3 unités (mêmes identifiants, contenu décalé).
// Les identifiants des premières moitiés sont conservés : une leçon déjà
// faite le reste.
//
// Un joueur qui avait validé le palier 8 sous les identifiants d'avant, et
// qui avance au palier 9, ne doit rien perdre ; un joueur qui avait validé
// le palier 9, le dernier, ne doit rien voir casser en fin de parcours.
import { test } from "node:test";
import assert from "node:assert/strict";
import { buildUnits, buildPath, getNextLesson, getPathStats, UNITES_AJOUTEES, DATE_ENTRELACEMENT } from "../src/store/pathEngine.js";
import { COURSES, QUIZ, EXERCISES } from "../src/content/index.js";
import { defaultState } from "../src/store/state.js";

const content = { courses: COURSES, quiz: QUIZ, exercises: EXERCISES };

// Découpages d'AVANT le lot 4, figés : c'est sous ces identifiants que la
// progression a été enregistrée.
const ANCIEN = {
  8: {
    "palier-8-1": ["rhy-c5-02", "scales-c4-02", "harm-c3-04", "scales-c4-03", "scales-c5-01", "harm-c5-03"],
    "palier-8-2": ["rhy-c5-03", "scales-c5-02", "scales-c5-03", "scales-c5-04", "harm-c6-03", "scales-c5-05"],
    "palier-8-3": ["scales-c5-06", "harm-c6-04", "scales-c5-07", "impro-03", "impro-06"],
  },
  9: {
    "palier-9-1": ["rhy-c5-04", "harm-c4-01", "scales-c6-01", "harm-c4-02", "rhy-c5-05", "harm-c7-01"],
    "palier-9-2": ["neck-06", "scales-c6-02", "harm-c7-02", "rhy-c6-01", "harm-c7-03", "scales-c6-03"],
    "palier-9-3": ["rhy-c6-02", "harm-c8-02", "impro-04", "impro-05"],
  },
};
const NOUVELLES = { 8: ["scales-3nps-01", "impro-03b", "impro-06b"], 9: ["impro-04b", "impro-05b"] };

const unitesActuelles = (level) => buildUnits(COURSES).filter(u => u.level === level);

test("découpage du lot 4 : palier-8-4 apparaît, le palier 9 garde ses 3 unités", () => {
  assert.deepEqual(unitesActuelles(8).map(u => u.id), ["palier-8-1", "palier-8-2", "palier-8-3", "palier-8-4"]);
  assert.deepEqual(unitesActuelles(9).map(u => u.id), ["palier-9-1", "palier-9-2", "palier-9-3"]);
  for (const level of [8, 9]) {
    const lecons = unitesActuelles(level).flatMap(u => u.lessons.map(l => l.id));
    for (const id of [...Object.values(ANCIEN[level]).flat(), ...NOUVELLES[level]]) assert.ok(lecons.includes(id), `${id} au palier ${level}`);
  }
  // Chaque seconde moitié suit immédiatement la première dans le palier.
  for (const [a, b] of [["impro-03", "impro-03b"], ["impro-06", "impro-06b"], ["impro-04", "impro-04b"], ["impro-05", "impro-05b"]]) {
    const seq = buildUnits(COURSES).flatMap(u => u.lessons.map(l => l.id));
    assert.equal(seq.indexOf(b), seq.indexOf(a) + 1, `${b} juste après ${a}`);
  }
});

test("lot 4 : chaque moitié tient en 10 minutes, avec au moins 3 questions à elle", () => {
  const lecons = new Map(COURSES.flatMap(c => c.lessons).map(l => [l.id, l]));
  for (const id of ["impro-03", "impro-03b", "impro-04", "impro-04b", "impro-05", "impro-05b", "impro-06", "impro-06b", "scales-3nps-01"]) {
    const l = lecons.get(id);
    assert.ok(l?.cartes?.length, `${id} en cartes`);
    assert.ok(l.duration <= 10, `${id} : ${l.duration} min`);
    assert.ok(l.quiz.length >= 3, `${id} : ${l.quiz.length} question(s)`);
    const questions = l.cartes.filter(c => c.type === "question" && c.quizId).map(c => c.quizId);
    for (const q of questions) assert.ok(l.quiz.includes(q), `${id} : la carte ${q} vient de son propre quiz`);
  }
});

/**
 * Tout fait et validé jusqu'au palier `jusqua` inclus (identifiants d'avant
 * le lot 4 pour les paliers 8 et 9), puis, au palier suivant : `faites`
 * (leçons) et `validees` (unités).
 */
function joueur(date, jusqua, { faites = [], validees = [] } = {}) {
  const s = defaultState();
  s.onboarding = { ...s.onboarding, done: true, experience: "joue" };
  const unites = {};
  for (const u of buildUnits(COURSES).filter(x => x.level < 8)) unites[u.id] = u.lessons.map(l => l.id);
  for (let level = 8; level <= jusqua; level++) Object.assign(unites, ANCIEN[level]);
  const lecons = [...Object.values(unites).flat(), ...faites];
  for (const id of lecons) s.completedLessons[id] = date;
  for (const id of [...Object.keys(unites), ...validees]) {
    s.unitChecks[id] = { passed: true, best: 90, attempts: 1, lastAttemptAt: date };
    s.claimedUnits[id] = date;
  }
  return { s, validees: [...Object.keys(unites), ...validees] };
}

// `ajout` : le cas a besoin d'une entrée UNITES_AJOUTEES["palier-8-4"] dans
// src/store/pathEngine.js (voir l'explication plus bas).
const SCENARIOS = [
  { nom: "palier 8 validé, palier 9 vierge", jusqua: 8, faites: [], validees: [], ajout: true },
  { nom: "palier 8 validé, 9-1 entamé", jusqua: 8, faites: ["rhy-c5-04", "harm-c4-01"], validees: [] },
  { nom: "palier 8 validé, 9-1 validé, 9-2 entamé", jusqua: 8,
    faites: [...ANCIEN[9]["palier-9-1"], "neck-06"], validees: ["palier-9-1"] },
];

/** Unités du palier 9 ouvertes AVANT le lot 4 pour ce joueur. */
function ouvertesAvant(sc) {
  const unites = ANCIEN[9];
  const ids = Object.keys(unites);
  const ouvertes = [ids[0]];
  for (let i = 1; i < ids.length; i++) {
    if (sc.validees.includes(ids[i - 1]) || unites[ids[i]].some(l => sc.faites.includes(l))) ouvertes.push(ids[i]);
  }
  return ouvertes;
}

function verifierAcquis(path, validees) {
  const par = Object.fromEntries(path.map(u => [u.id, u]));
  for (const id of validees) {
    if (!par[id]) continue;
    assert.equal(par[id].bonusClaimed, true, `${id} : coffre déjà ouvert`);
    assert.equal(par[id].bonusClaimable, false, `${id} : coffre non reproposé`);
    assert.equal(par[id].needsCheck, false, `${id} : pas de vérification à repasser`);
  }
  for (const u of path) if (u.bonusClaimable) assert.ok(!validees.includes(u.id), `${u.id} : coffre reproposé`);
  for (const u of path.filter(x => x.done > 0)) assert.ok(u.unlocked, `${u.id} (entamée) reste ouverte`);
}

// Le cas « palier 9 vierge » : la précédente de palier-9-1 est désormais la
// nouvelle palier-8-4 (3NPS, impro-03b, impro-06b + impro-03 et impro-06
// déjà faites). Sans vérification réussie, elle n'est pas franchie et
// referme palier-9-1, que le joueur avait ouverte en validant palier-8-3.
// Il faut l'entrée UNITES_AJOUTEES["palier-8-4"] (date de mise en service
// du lot 4) dans pathEngine.js : tant qu'elle manque, ce cas est `todo`.
for (const date of ["2026-09-01", DATE_ENTRELACEMENT, "2026-10-20"]) for (const sc of SCENARIOS) {
  const todo = sc.ajout && !UNITES_AJOUTEES["palier-8-4"]
    ? "il manque UNITES_AJOUTEES[\"palier-8-4\"] dans src/store/pathEngine.js" : false;
  test(`lot 4 — ${sc.nom} (progression du ${date})`, { todo }, () => {
    const { s, validees } = joueur(date, sc.jusqua, sc);
    const path = buildPath(content, s);
    const par = Object.fromEntries(path.map(u => [u.id, u]));
    const ouvertes = new Set(path.filter(u => u.unlocked).flatMap(u => u.lessons.map(l => l.id)));

    // 1. Rien de ce qui était ouvert ne se referme.
    for (const l of Object.values(ANCIEN[8]).flat()) assert.ok(ouvertes.has(l), `${l} reste accessible`);
    for (const id of ouvertesAvant(sc)) assert.ok(par[id]?.unlocked, `${id} reste ouverte`);
    for (const l of ouvertesAvant(sc).flatMap(id => ANCIEN[9][id])) assert.ok(ouvertes.has(l), `${l} reste accessible`);

    // 2. Aucun coffre reproposé, aucune vérification réussie à repasser.
    verifierAcquis(path, validees);

    // 3. Les nouvelles leçons du palier validé sont accessibles.
    for (const l of NOUVELLES[8]) assert.ok(ouvertes.has(l), `${l} accessible`);
  });
}

// Joueur EN COURS de palier 8 (palier 7 validé). Les 3 leçons ajoutées
// redécoupent le palier en 4 unités de 5 : des leçons jamais commencées,
// ouvertes sous l'ancien découpage, glissent vers l'unité suivante,
// fermée tant que la précédente n'est pas validée :
//   8-1 validée, 8-2 vierge        → rhy-c5-03 et scales-c5-05 passent en palier-8-3 ;
//   8-1 et 8-2 validées, 8-3 vierge → impro-03 et impro-06 passent en palier-8-4.
// Une progression d'avant DATE_ENTRELACEMENT n'est pas touchée (les leçons
// ouvertes sous l'ancien découpage y sont rejouées). UNITES_AJOUTEES n'y
// peut rien (il ne joue qu'une fois TOUTES les autres parties validées) :
// il faudrait figer le découpage d'avant le lot 4 dans pathEngine.js. Ces
// cas sont ACCEPTÉS (décision du 27/10/2026, app pas encore commercialisée :
// seuls des comptes de test sont concernés) : pour une progression d'après
// DATE_ENTRELACEMENT, on vérifie seulement que rien de FAIT n'est perdu et
// qu'aucun acquis n'est à repasser ; les leçons jamais commencées peuvent
// attendre la vérification de l'unité précédente.
const EN_COURS_8 = [
  { nom: "palier 7 validé, 8-1 validé, 8-2 vierge", validees: ["palier-8-1"], ouvertes: ["palier-8-2"] },
  { nom: "palier 7 validé, 8-1 et 8-2 validés, 8-3 vierge", validees: ["palier-8-1", "palier-8-2"], ouvertes: ["palier-8-3"] },
];
for (const date of ["2026-09-01", "2026-10-20"]) for (const sc of EN_COURS_8) {
  const recent = date >= DATE_ENTRELACEMENT;
  test(`lot 4 — ${sc.nom} (progression du ${date})`, () => {
    const { s, validees } = joueur(date, 7, { faites: sc.validees.flatMap(id => ANCIEN[8][id]), validees: sc.validees });
    const path = buildPath(content, s);
    const ouvertes = new Set(path.filter(u => u.unlocked).flatMap(u => u.lessons.map(l => l.id)));
    // Toujours : les leçons faites restent accessibles.
    for (const l of sc.validees.flatMap(id => ANCIEN[8][id])) assert.ok(ouvertes.has(l), `${l} (faite) reste accessible`);
    // Progression ancienne : les leçons des unités ouvertes à l'époque aussi.
    if (!recent) for (const l of sc.ouvertes.flatMap(id => ANCIEN[8][id])) assert.ok(ouvertes.has(l), `${l} reste accessible`);
    verifierAcquis(path, validees);
  });
}

// Fin de parcours : palier 9 (le dernier) validé sous les identifiants
// d'avant. Pas de palier suivant à ouvrir : on vérifie que rien ne casse.
for (const date of ["2026-09-01", DATE_ENTRELACEMENT, "2026-10-20"]) {
  test(`lot 4 — palier 9 validé, fin du parcours (progression du ${date})`, () => {
    const { s, validees } = joueur(date, 9);
    const path = buildPath(content, s);
    const ouvertes = new Set(path.filter(u => u.unlocked).flatMap(u => u.lessons.map(l => l.id)));

    // Les Annexes (facultatives, voir test/annexes.test.mjs) viennent après.
    const parcours = path.filter(u => !u.annexe);
    assert.equal(parcours[parcours.length - 1].id, "palier-9-3", "le parcours finit toujours sur palier-9-3");
    for (const l of [...Object.values(ANCIEN[8]).flat(), ...Object.values(ANCIEN[9]).flat()]) assert.ok(ouvertes.has(l), `${l} reste accessible`);
    for (const l of [...NOUVELLES[8], ...NOUVELLES[9]]) assert.ok(ouvertes.has(l), `${l} accessible`);
    verifierAcquis(path, validees);

    // Les nouvelles leçons restent à faire : la prochaine leçon proposée en
    // est une, et aucune unité ne se croit terminée à tort.
    const suite = getNextLesson(content, s);
    assert.ok(suite?.lesson, "une prochaine leçon est proposée");
    assert.ok([...NOUVELLES[8], ...NOUVELLES[9]].includes(suite.lesson.id), `prochaine leçon : ${suite.lesson.id}`);
    for (const id of ["palier-8-4", "palier-9-3"]) assert.equal(path.find(u => u.id === id).complete, false, `${id} pas terminée`);
    const stats = getPathStats(content, s);
    assert.equal(stats.totalLessons - stats.doneLessons, NOUVELLES[8].length + NOUVELLES[9].length);
  });
}

// La nouvelle unité n'est jamais marquée faite à la place du joueur : ses
// leçons, sa vérification et son coffre restent à gagner (avec ou sans
// l'entrée UNITES_AJOUTEES).
test("palier-8-4 : jamais validée d'office", () => {
  const { s } = joueur("2026-10-20", 9);
  const u = buildPath(content, s).find(x => x.id === "palier-8-4");
  assert.equal(u.complete, false);
  assert.equal(u.check, null, "sa vérification reste à passer");
  assert.equal(u.bonusClaimed, false, "son coffre reste à ouvrir");
});
