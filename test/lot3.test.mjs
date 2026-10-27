// Lot 3 : trois leçons ajoutées au palier 5 (p-i-m-a, capodastre, valse et
// 6/8), le picking Travis et le CAGED (neck-04, venu du palier 9) au palier 7.
//   palier 5 : 11 → 14 leçons, 2 → 3 unités (palier-5-3 APPARAÎT) ;
//   palier 7 : 11 → 13 leçons, 2 → 3 unités (palier-7-3 APPARAÎT) ;
//   palier 9 : 17 → 16 leçons, 3 unités (mêmes identifiants, contenu décalé).
// Un joueur qui avait validé le palier 5 (ou 7) sous les identifiants
// d'avant, et qui avance au palier suivant, ne doit rien perdre : aucune
// unité ouverte ne se referme, aucun coffre déjà ouvert n'est reproposé,
// aucune vérification réussie n'est à repasser.
import { test } from "node:test";
import assert from "node:assert/strict";
import { buildUnits, buildPath, DATE_ENTRELACEMENT } from "../src/store/pathEngine.js";
import { COURSES, QUIZ, EXERCISES } from "../src/content/index.js";
import { defaultState } from "../src/store/state.js";

const content = { courses: COURSES, quiz: QUIZ, exercises: EXERCISES };

// Découpages d'AVANT le lot 3, figés : c'est sous ces identifiants que la
// progression a été enregistrée.
const ANCIEN = {
  5: {
    "palier-5-1": ["neck-c3-01", "scales-c2-01", "harm-c2-01", "scales-c2-02", "neck-c3-02", "harm-c2-02"],
    "palier-5-2": ["rhy-c3-01", "scales-c2-03", "neck-c3-03", "harm-c6-01", "scales-c2-05"],
  },
  7: {
    "palier-7-1": ["neck-05", "harm-c3-01", "harm-c3-02", "harmony-03", "harm-c3-03", "scales-c4-01"],
    "palier-7-2": ["harm-c5-01", "harm-c5-02", "harm-c6-02", "harm-c8-01", "impro-02"],
  },
};
const NOUVELLES = { 5: ["rhy-doigts-01", "harm-capo-01", "rhy-mes-01"], 7: ["rhy-doigts-02", "neck-04"] };

const unitesActuelles = (level) => buildUnits(COURSES).filter(u => u.level === level);
const unitesDuPalier = (level) => ANCIEN[level]
  ?? Object.fromEntries(unitesActuelles(level).map(u => [u.id, u.lessons.map(l => l.id)]));

test("découpage du lot 3 : palier-5-3 et palier-7-3 apparaissent, le palier 9 garde ses 3 unités", () => {
  assert.deepEqual(unitesActuelles(5).map(u => u.id), ["palier-5-1", "palier-5-2", "palier-5-3"]);
  assert.deepEqual(unitesActuelles(7).map(u => u.id), ["palier-7-1", "palier-7-2", "palier-7-3"]);
  assert.deepEqual(unitesActuelles(9).map(u => u.id), ["palier-9-1", "palier-9-2", "palier-9-3"]);
  for (const level of [5, 7]) {
    const lecons = unitesActuelles(level).flatMap(u => u.lessons.map(l => l.id));
    for (const id of [...Object.values(ANCIEN[level]).flat(), ...NOUVELLES[level]]) assert.ok(lecons.includes(id), `${id} au palier ${level}`);
  }
  assert.ok(!unitesActuelles(9).some(u => u.lessons.some(l => l.id === "neck-04")), "neck-04 a quitté le palier 9");
});

/**
 * Tout fait et validé jusqu'au palier `jusqua` inclus (identifiants d'avant
 * le lot 3), puis, au palier suivant : `faites` (leçons) et `validees` (unités).
 */
function joueur(date, jusqua, { faites = [], validees = [] } = {}) {
  const s = defaultState();
  s.onboarding = { ...s.onboarding, done: true, experience: "joue" };
  const unites = {};
  for (const u of buildUnits(COURSES).filter(x => x.level < 5)) unites[u.id] = u.lessons.map(l => l.id);
  for (let level = 5; level <= jusqua; level++) Object.assign(unites, unitesDuPalier(level));
  const lecons = [...Object.values(unites).flat(), ...faites];
  for (const id of lecons) s.completedLessons[id] = date;
  for (const id of [...Object.keys(unites), ...validees]) {
    s.unitChecks[id] = { passed: true, best: 90, attempts: 1, lastAttemptAt: date };
    s.claimedUnits[id] = date;
  }
  return { s, validees: [...Object.keys(unites), ...validees] };
}

const SCENARIOS = [
  // Joueur au palier 6 (palier 5 validé avant le lot 3).
  { nom: "palier 5 validé, palier 6 vierge", jusqua: 5, suivant: 6, faites: [], validees: [] },
  { nom: "palier 5 validé, 6-1 entamé", jusqua: 5, suivant: 6, faites: ["rhy-c2-03", "scales-c2-04"], validees: [] },
  { nom: "palier 5 validé, 6-1 validé, 6-2 entamé", jusqua: 5, suivant: 6,
    faites: [...unitesDuPalier(6)["palier-6-1"], "rhy-c3-03"], validees: ["palier-6-1"] },
  // Joueur au palier 8 (palier 7 validé avant le lot 3).
  { nom: "palier 7 validé, palier 8 vierge", jusqua: 7, suivant: 8, faites: [], validees: [] },
  { nom: "palier 7 validé, 8-1 entamé", jusqua: 7, suivant: 8, faites: ["rhy-c5-02", "scales-c4-02"], validees: [] },
  { nom: "palier 7 validé, 8-1 validé, 8-2 entamé", jusqua: 7, suivant: 8,
    faites: [...unitesDuPalier(8)["palier-8-1"], "rhy-c5-03"], validees: ["palier-8-1"] },
];

/** Unités ouvertes AVANT le lot 3 pour ce joueur, au palier suivant. */
function ouvertesAvant(sc) {
  const unites = unitesDuPalier(sc.suivant);
  const ids = Object.keys(unites);
  const ouvertes = [ids[0]];
  for (let i = 1; i < ids.length; i++) {
    if (sc.validees.includes(ids[i - 1]) || unites[ids[i]].some(l => sc.faites.includes(l))) ouvertes.push(ids[i]);
  }
  return ouvertes;
}

// Les cas « palier suivant vierge » : la précédente de palier-6-1 (resp.
// palier-8-1) est devenue la nouvelle palier-5-3 (resp. palier-7-3). Pour une
// progression d'AVANT sa mise en service, la règle UNITES_AJOUTEES de
// pathEngine.js la rend franchissable.

for (const date of ["2026-09-01", DATE_ENTRELACEMENT, "2026-10-20"]) for (const sc of SCENARIOS) {
  test(`lot 3 — ${sc.nom} (progression du ${date})`, () => {
    const { s, validees } = joueur(date, sc.jusqua, sc);
    const path = buildPath(content, s);
    const par = Object.fromEntries(path.map(u => [u.id, u]));
    const ouvertes = new Set(path.filter(u => u.unlocked).flatMap(u => u.lessons.map(l => l.id)));

    // 1. Rien de ce qui était ouvert ne se referme : les leçons du palier
    //    validé (même déplacées dans une autre unité), et les unités du
    //    palier suivant ouvertes avant le lot 3.
    for (const l of Object.values(unitesDuPalier(sc.jusqua)).flat()) assert.ok(ouvertes.has(l), `${l} reste accessible`);
    for (const id of ouvertesAvant(sc)) assert.ok(par[id]?.unlocked, `${id} reste ouverte`);
    for (const l of ouvertesAvant(sc).flatMap(id => unitesDuPalier(sc.suivant)[id])) assert.ok(ouvertes.has(l), `${l} reste accessible`);
    for (const u of path.filter(x => x.done > 0)) assert.ok(u.unlocked, `${u.id} (entamée) reste ouverte`);

    // 2. Aucun coffre déjà ouvert n'est reproposé ; aucune vérification
    //    réussie n'est à repasser.
    for (const id of validees) {
      if (!par[id]) continue;
      assert.equal(par[id].bonusClaimed, true, `${id} : coffre déjà ouvert`);
      assert.equal(par[id].bonusClaimable, false, `${id} : coffre non reproposé`);
      assert.equal(par[id].needsCheck, false, `${id} : pas de vérification à repasser`);
    }
    for (const u of path) if (u.bonusClaimable) assert.ok(!validees.includes(u.id), `${u.id} : coffre reproposé`);

    // Les nouvelles leçons du palier validé sont accessibles (rien de
    // bloquant n'est ajouté derrière un palier déjà validé).
    for (const l of NOUVELLES[sc.jusqua]) assert.ok(ouvertes.has(l), `${l} accessible`);
  });
}

// La nouvelle unité n'est jamais marquée faite à la place du joueur : ses
// leçons, sa vérification et son coffre restent à gagner.
test("palier-5-3 et palier-7-3 : jamais validées d'office", () => {
  const { s } = joueur("2026-10-20", 7);
  const path = buildPath(content, s);
  for (const id of ["palier-5-3", "palier-7-3"]) {
    const u = path.find(x => x.id === id);
    assert.equal(u.complete, false, `${id} n'est pas marquée faite`);
    assert.equal(u.check, null, `${id} : sa vérification reste à passer`);
    assert.equal(u.bonusClaimed, false, `${id} : son coffre reste à ouvrir`);
  }
});
