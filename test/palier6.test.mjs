// Palier 6 agrandi (pentatonique en 4 leçons + 4 leçons de technique) :
// 13 → 20 leçons, donc 3 → 4 unités (palier-6-1 … palier-6-4), et le contenu
// de palier-6-1 … 6-3 change. Un joueur qui avait TOUT validé au palier 6
// sous les identifiants d'avant, et qui avance au palier 7, ne doit rien
// perdre : aucune unité ouverte ne se referme, aucun coffre déjà ouvert
// n'est reproposé, aucune vérification réussie n'est à repasser.
import { test } from "node:test";
import assert from "node:assert/strict";
import { buildUnits, buildPath, DATE_ENTRELACEMENT, UNITES_AJOUTEES } from "../src/store/pathEngine.js";
import { COURSES, QUIZ, EXERCISES } from "../src/content/index.js";
import { defaultState } from "../src/store/state.js";

const content = { courses: COURSES, quiz: QUIZ, exercises: EXERCISES };

// Découpage du palier 6 AVANT l'ajout des leçons (13 leçons, 3 unités) et
// du palier 7, figés ici : c'est sous ces identifiants que la progression a
// été enregistrée.
const ANCIEN_PALIER_6 = {
  "palier-6-1": ["rhy-c2-03", "scales-c2-04", "harm-c2-03", "scales-c3-01", "rhy-c3-02"],
  "palier-6-2": ["rhy-c3-03", "scales-c3-02", "scales-c3-03", "rhy-c4-03", "harm-c2-04"],
  "palier-6-3": ["rhy-c5-01", "scales-c3-04", "impro-01"],
};
const PALIER_7 = {
  "palier-7-1": ["neck-05", "harm-c3-01", "harm-c3-02", "harmony-03", "harm-c3-03", "scales-c4-01"],
  "palier-7-2": ["harm-c5-01", "harm-c5-02", "harm-c6-02", "harm-c8-01", "impro-02"],
};
const NOUVELLES = ["scales-c3-05", "scales-c3-06", "scales-c3-07", "rhy-tech-01", "rhy-tech-02", "rhy-tech-03", "rhy-tech-04"];

/**
 * Tout fait et validé jusqu'au palier 6 inclus (identifiants d'avant), plus
 * `palier7` : { leçons faites, unités validées }.
 */
function joueur(date, { faites7 = [], validees7 = [] } = {}) {
  const s = defaultState();
  s.onboarding = { ...s.onboarding, done: true, experience: "joue" };
  const avant6 = buildUnits(COURSES).filter(u => u.level < 6);
  const unitesValidees = [...avant6.map(u => u.id), ...Object.keys(ANCIEN_PALIER_6), ...validees7];
  const lecons = [...avant6.flatMap(u => u.lessons.map(l => l.id)), ...Object.values(ANCIEN_PALIER_6).flat(), ...faites7];
  for (const id of lecons) s.completedLessons[id] = date;
  for (const id of unitesValidees) {
    s.unitChecks[id] = { passed: true, best: 90, attempts: 1, lastAttemptAt: date };
    s.claimedUnits[id] = date;
  }
  return s;
}

/** Unités ouvertes AVANT la modification, pour ce joueur (palier 7 compris). */
const ouvertesAvant = (faites7, validees7) => {
  const ids = [...Object.keys(ANCIEN_PALIER_6), "palier-7-1"];
  if (validees7.includes("palier-7-1") || PALIER_7["palier-7-2"].some(l => faites7.includes(l))) ids.push("palier-7-2");
  return ids;
};

test("le palier 6 agrandi : 4 unités, nouvelles leçons dedans, palier 7 inchangé", () => {
  const u6 = buildUnits(COURSES).filter(u => u.level === 6);
  assert.deepEqual(u6.map(u => u.id), ["palier-6-1", "palier-6-2", "palier-6-3", "palier-6-4"]);
  const lecons6 = u6.flatMap(u => u.lessons.map(l => l.id));
  for (const id of [...Object.values(ANCIEN_PALIER_6).flat(), ...NOUVELLES]) assert.ok(lecons6.includes(id), id);
  const u7 = Object.fromEntries(buildUnits(COURSES).filter(u => u.level === 7).map(u => [u.id, u.lessons.map(l => l.id)]));
  for (const [id, lecons] of Object.entries(PALIER_7)) assert.deepEqual(u7[id], lecons, id);
});

const SCENARIOS = [
  { nom: "palier 7-1 entamé", faites7: ["neck-05", "harm-c3-01"], validees7: [] },
  { nom: "palier 7-1 validé, 7-2 entamé", faites7: [...PALIER_7["palier-7-1"], "harm-c5-01"], validees7: ["palier-7-1"] },
];

for (const date of ["2026-09-01", DATE_ENTRELACEMENT, "2026-11-20"]) for (const sc of SCENARIOS) {
  test(`compatibilité (${sc.nom}, progression du ${date})`, () => {
    const path = buildPath(content, joueur(date, sc));
    const par = Object.fromEntries(path.map(u => [u.id, u]));

    // 1. Rien de ce qui était ouvert ne se referme : ni les unités, ni les
    //    leçons qu'elles contenaient (même déplacées dans une autre unité).
    for (const id of ouvertesAvant(sc.faites7, sc.validees7)) assert.ok(par[id]?.unlocked, `${id} reste ouverte`);
    const ouvertes = new Set(path.filter(u => u.unlocked).flatMap(u => u.lessons.map(l => l.id)));
    for (const l of Object.values(ANCIEN_PALIER_6).flat()) assert.ok(ouvertes.has(l), `${l} reste accessible`);

    // 2. Une unité du palier 7 qui contient une leçon faite reste ouverte.
    for (const u of path.filter(x => x.level === 7 && x.done > 0)) assert.ok(u.unlocked, `${u.id} (entamée) reste ouverte`);

    // 3. Aucun coffre déjà ouvert n'est reproposé ; aucune vérification
    //    réussie n'est à repasser.
    const reclames = [...Object.keys(ANCIEN_PALIER_6), ...sc.validees7];
    for (const id of reclames) {
      assert.equal(par[id].bonusClaimed, true, `${id} : coffre déjà ouvert`);
      assert.equal(par[id].bonusClaimable, false, `${id} : coffre non reproposé`);
      assert.equal(par[id].check?.passed, true, `${id} : vérification acquise`);
      assert.equal(par[id].needsCheck, false, `${id} : pas de vérification à repasser`);
    }
    for (const u of path) if (u.bonusClaimable) assert.ok(!reclames.includes(u.id), `${u.id} : coffre reproposé`);

    // Les nouvelles leçons du palier 6 sont accessibles (rien de bloquant
    // n'est ajouté derrière un palier déjà validé).
    for (const l of NOUVELLES) assert.ok(ouvertes.has(l), `${l} accessible`);
  });
}

// Palier 6 tout juste validé, palier 7 encore vierge. La précédente de
// palier-7-1 est désormais la NOUVELLE palier-6-4 : un joueur qui avait validé
// tout le palier AVANT sa mise en service garde palier-7-1 ouverte (règle
// UNITES_AJOUTEES de pathEngine.js) ; un joueur qui valide 6-1 à 6-3 APRÈS
// doit faire 6-4 avant de passer au palier 7.
for (const date of ["2026-09-01", "2026-10-15"]) {
  test(`palier 6 validé avant l'ajout de 6-4 (${date}) : palier-7-1 reste ouverte`, () => {
    const path = buildPath(content, joueur(date));
    assert.ok(path.find(u => u.id === "palier-7-1").unlocked);
    const p64 = path.find(u => u.id === "palier-6-4");
    assert.equal(p64.complete, false, "6-4 n'est pas marquée faite");
    assert.equal(p64.check, null, "sa vérification reste à passer");
  });
}
for (const date of [UNITES_AJOUTEES["palier-6-4"], "2026-11-20"]) {
  test(`palier 6-1 à 6-3 validés après l'ajout (${date}) : 6-4 reste à faire`, () => {
    const path = buildPath(content, joueur(date));
    assert.equal(path.find(u => u.id === "palier-7-1").unlocked, false);
  });
}
