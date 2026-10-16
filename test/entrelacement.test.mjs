// Entrelacement des modules dans un palier + compatibilité avec l'ancien
// découpage (blocs d'un seul module). Voir store/pathEngine.js, points 6 et
// « Compatibilité » au-dessus de buildPath.
import { test } from "node:test";
import assert from "node:assert/strict";
import {
  buildUnits, buildPath, getNextLesson, MODULES_PRATIQUES, MODULES_APPLICATION, DATE_ENTRELACEMENT,
} from "../src/store/pathEngine.js";
import { defaultState } from "../src/store/state.js";
import { COURSES } from "../src/content/index.js";

const AVANT = "2026-01-10";   // progression acquise sous l'ancien découpage
const APRES = "2027-01-10";   // progression acquise sous le nouveau
assert.ok(AVANT < DATE_ENTRELACEMENT && APRES > DATE_ENTRELACEMENT);

// Un palier scindé qui reproduit l'ancien palier 6 : 5 gammes, 2 harmonie,
// 5 rythme, 3 impro (15 leçons → 3 unités de 5), précédé d'un palier simple.
function fixture() {
  const mk = (mod, n, level, prefix = mod) =>
    Array.from({ length: n }, (_, i) => ({ id: `${prefix}-${level}-${i + 1}`, level, title: `${mod} ${i + 1}` }));
  return { courses: [
    { id: "neck", title: "Manche", lessons: [...mk("neck", 2, 1)] },
    { id: "scales", title: "Gammes", lessons: [...mk("scales", 1, 1), ...mk("scales", 5, 2)] },
    { id: "harmony", title: "Harmonie", lessons: [...mk("harmony", 2, 2)] },
    { id: "rhythm", title: "Rythme", lessons: [...mk("rhythm", 5, 2)] },
    { id: "impro", title: "Impro", lessons: [...mk("impro", 3, 2)] },
  ], quiz: [], exercises: [] };
}
const joueur = (extra = {}) => ({
  ...defaultState(),
  onboarding: { ...defaultState().onboarding, done: true, experience: "joue" },
  ...extra,
});
const palier2 = (units) => units.filter(u => u.level === 2);

// ── Le découpage ──────────────────────────────────────────────────────────

test("un palier scindé n'est plus découpé en blocs d'un seul module", () => {
  const anciens = palier2(buildUnits(fixture().courses, null, { regroupementHistorique: true }));
  const nouveaux = palier2(buildUnits(fixture().courses));
  assert.ok(anciens.some(u => new Set(u.lessons.map(l => l.courseId)).size === 1), "l'ancien découpage avait des blocs mono-module");
  for (const u of nouveaux) assert.ok(new Set(u.lessons.map(l => l.courseId)).size >= 2, `${u.id} mélange les modules`);
});

test("mêmes identifiants et mêmes tailles d'unité qu'avant : seul le contenu change", () => {
  const anciens = buildUnits(fixture().courses, null, { regroupementHistorique: true });
  const nouveaux = buildUnits(fixture().courses);
  assert.deepEqual(nouveaux.map(u => [u.id, u.lessons.length]), anciens.map(u => [u.id, u.lessons.length]));
});

test("l'ordre interne de chaque module est conservé", () => {
  const seq = palier2(buildUnits(fixture().courses)).flatMap(u => u.lessons);
  for (const c of fixture().courses) {
    const attendu = c.lessons.filter(l => l.level === 2).map(l => l.id);
    assert.deepEqual(seq.filter(l => l.courseId === c.id).map(l => l.id), attendu, c.id);
  }
});

test("l'impro (module d'application) reste en fin de palier", () => {
  const seq = palier2(buildUnits(fixture().courses)).flatMap(u => u.lessons.map(l => l.courseId));
  const premiere = seq.findIndex(m => MODULES_APPLICATION.includes(m));
  assert.ok(seq.slice(premiere).every(m => MODULES_APPLICATION.includes(m)));
});

test("chaque unité commence par une leçon pratique quand elle en contient une", () => {
  for (const u of buildUnits(fixture().courses)) {
    if (u.lessons.some(l => MODULES_PRATIQUES.includes(l.courseId))) {
      assert.ok(MODULES_PRATIQUES.includes(u.lessons[0].courseId), `${u.id} commence par ${u.lessons[0].courseId}`);
    }
  }
});

test("le module le plus faible (placement) ouvre l'unité qui le contient", () => {
  const state = joueur({ onboarding: { ...joueur().onboarding, weakestModule: "harmony" } });
  for (const u of buildUnits(fixture().courses, state)) {
    if (u.lessons.some(l => l.courseId === "harmony")) assert.equal(u.lessons[0].courseId, "harmony", u.id);
  }
});

// ── Compatibilité avec une progression acquise sous l'ancien découpage ────

/** Joueur qui, sous l'ancien découpage, a fini le palier 1 et l'ancien
 *  bloc 2-1 (vérification réussie, coffre ouvert) et entamé le bloc 2-2. */
function joueurHistorique() {
  const anciens = buildUnits(fixture().courses, null, { regroupementHistorique: true });
  const p1 = anciens.find(u => u.id === "palier-1");
  const b1 = anciens.find(u => u.id === "palier-2-1");
  const b2 = anciens.find(u => u.id === "palier-2-2");
  const completedLessons = {};
  for (const l of [...p1.lessons, ...b1.lessons, b2.lessons[0]]) completedLessons[l.id] = AVANT;
  return { anciens, b1, b2, state: joueur({
    completedLessons,
    unitChecks: {
      "palier-1": { passed: true, score: 90, attempts: 1, lastAttemptAt: AVANT },
      "palier-2-1": { passed: true, score: 85, attempts: 1, lastAttemptAt: AVANT },
    },
    claimedUnits: { "palier-1": AVANT, "palier-2-1": AVANT },
  }) };
}

test("compat : coffres ouverts et vérifications réussies restent acquis", () => {
  const { state } = joueurHistorique();
  const path = buildPath(fixture(), state);
  const u1 = path.find(u => u.id === "palier-2-1");
  assert.equal(u1.bonusClaimed, true);
  assert.equal(u1.bonusClaimable, false, "jamais re-crédité");
  assert.equal(u1.check.passed, true);
  assert.equal(u1.needsCheck, false, "pas de nouvelle vérification");
  // Une fois ses leçons ACTUELLES faites, l'unité est complète, sans repasser la vérification.
  const tout = { ...state.completedLessons };
  for (const l of u1.lessons) tout[l.id] = APRES;
  const apres = buildPath(fixture(), { ...state, completedLessons: tout }).find(u => u.id === "palier-2-1");
  assert.equal(apres.complete, true);
  assert.equal(apres.needsCheck, false);
  assert.equal(apres.bonusClaimable, false);
});

test("compat : aucune leçon ouverte ou faite sous l'ancien découpage n'est reverrouillée", () => {
  const { b2, state } = joueurHistorique();
  const path = buildPath(fixture(), state);
  const ouvertes = new Set(path.filter(u => u.unlocked).flatMap(u => u.lessons.map(l => l.id)));
  // L'ancien bloc 2-2 était ouvert (2-1 complet), l'ancien 2-1 fait.
  for (const l of b2.lessons) assert.ok(ouvertes.has(l.id), `${l.id} était ouverte`);
  for (const id of Object.keys(state.completedLessons)) assert.ok(ouvertes.has(id), `${id} était faite`);
  // La vérification réussie de palier-2-1 ouvre palier-2-2, comme avant.
  assert.equal(path.find(u => u.id === "palier-2-2").unlocked, true);
});

test("compat : un nouveau joueur n'hérite pas de l'ancien découpage", () => {
  // Même progression par identifiants, mais acquise APRÈS l'entrelacement,
  // et sur le NOUVEAU découpage : palier 1 + nouvelle unité 2-1.
  const nouveaux = buildUnits(fixture().courses);
  const completedLessons = {};
  for (const u of nouveaux.filter(u => u.id === "palier-1" || u.id === "palier-2-1")) {
    for (const l of u.lessons) completedLessons[l.id] = APRES;
  }
  const state = joueur({
    completedLessons,
    unitChecks: {
      "palier-1": { passed: true, attempts: 1, lastAttemptAt: APRES },
      "palier-2-1": { passed: true, attempts: 1, lastAttemptAt: APRES },
    },
  });
  const path = buildPath(fixture(), state);
  assert.equal(path.find(u => u.id === "palier-2-2").unlocked, true);
  assert.equal(path.find(u => u.id === "palier-2-3").unlocked, false, "rien n'est ouvert par anticipation");
});

test("compat : une valeur de leçon non datée (ancien format) compte comme antérieure", () => {
  const { anciens } = joueurHistorique();
  const completedLessons = {};
  for (const u of anciens.filter(u => u.id === "palier-1" || u.id === "palier-2-1")) {
    for (const l of u.lessons) completedLessons[l.id] = true;
  }
  const state = joueur({ completedLessons, unitChecks: {
    "palier-1": { passed: true }, "palier-2-1": { passed: true },
  } });
  const b2 = anciens.find(u => u.id === "palier-2-2");
  const path = buildPath(fixture(), state);
  const ouvertes = new Set(path.filter(u => u.unlocked).flatMap(u => u.lessons.map(l => l.id)));
  for (const l of b2.lessons) assert.ok(ouvertes.has(l.id));
});

// ── Contenu réel : propriétés (pas de séquence exacte, le contenu bouge) ──

const contenuReel = { courses: COURSES, quiz: [], exercises: [] };

test("contenu réel : unités de 2 à 8 leçons, rien de perdu, mêmes ids qu'avant", () => {
  const nouveaux = buildUnits(COURSES);
  const anciens = buildUnits(COURSES, null, { regroupementHistorique: true });
  assert.deepEqual(nouveaux.map(u => [u.id, u.lessons.length]), anciens.map(u => [u.id, u.lessons.length]));
  for (const u of nouveaux) assert.ok(u.lessons.length >= 2 && u.lessons.length <= 8, `${u.id} : ${u.lessons.length}`);
  const ids = nouveaux.flatMap(u => u.lessons.map(l => l.id));
  assert.equal(new Set(ids).size, COURSES.reduce((n, c) => n + c.lessons.length, 0));
});

test("contenu réel : ordre interne des modules conservé, impro en fin de palier", () => {
  const units = buildUnits(COURSES).filter(u => !u.prelude);
  for (const level of new Set(units.map(u => u.level))) {
    const seq = units.filter(u => u.level === level).flatMap(u => u.lessons);
    for (const c of COURSES) {
      const attendu = c.lessons.filter(l => l.level === level).map(l => l.id);
      assert.deepEqual(seq.filter(l => l.courseId === c.id).map(l => l.id), attendu, `palier ${level}, ${c.id}`);
    }
    const mods = seq.map(l => l.courseId);
    const i = mods.findIndex(m => MODULES_APPLICATION.includes(m));
    if (i >= 0) assert.ok(mods.slice(i).every(m => MODULES_APPLICATION.includes(m)), `palier ${level}`);
  }
});

/** Ancienne règle de déblocage, rejouée sur l'ancien découpage. */
function ancienDeblocage(state) {
  const units = buildUnits(COURSES, state, { regroupementHistorique: true });
  const faites = state.completedLessons, checks = state.unitChecks;
  let prev = true;
  const ouvertes = new Set();
  units.forEach((u, i) => {
    const done = u.lessons.filter(l => faites[l.id]).length;
    const complete = done === u.lessons.length && !!checks[u.id]?.passed;
    if (i === 0 || prev || done > 0) for (const l of u.lessons) ouvertes.add(l.id);
    prev = complete;
  });
  return { units, ouvertes };
}

test("contenu réel : un débutant qui progressait sous l'ancien découpage ne perd jamais rien", () => {
  const { units } = ancienDeblocage(joueur());
  let state = joueur({ onboarding: { ...joueur().onboarding, experience: "debutant" }, completedLessons: {}, unitChecks: {}, claimedUnits: {} });
  // On suit l'ancien parcours, unité par unité ; à chaque étape, tout ce que
  // l'ancienne règle ouvrait doit l'être encore, et rien d'acquis ne se perd.
  for (const u of units) {
    for (const l of u.lessons) {
      state = { ...state, completedLessons: { ...state.completedLessons, [l.id]: AVANT } };
    }
    state = { ...state,
      unitChecks: { ...state.unitChecks, [u.id]: { passed: true, attempts: 1, lastAttemptAt: AVANT } },
      claimedUnits: { ...state.claimedUnits, [u.id]: AVANT } };
    const avant = ancienDeblocage(state).ouvertes;
    const path = buildPath(contenuReel, state);
    const maintenant = new Set(path.filter(x => x.unlocked).flatMap(x => x.lessons.map(l => l.id)));
    for (const id of avant) assert.ok(maintenant.has(id), `après ${u.id} : ${id} reverrouillée`);
    for (const x of path) {
      if (state.claimedUnits[x.id]) assert.equal(x.bonusClaimable, false, `${x.id} re-crédité`);
      if (state.unitChecks[x.id]) assert.equal(x.needsCheck, false, `${x.id} : vérification redemandée`);
    }
  }
});

test("contenu réel : un nouveau joueur n'a jamais d'unité ouverte sans raison", () => {
  for (const experience of ["debutant", "joue"]) {
    let state = joueur({ onboarding: { ...joueur().onboarding, experience }, completedLessons: {}, unitChecks: {} });
    for (let pas = 0; pas < 400; pas++) {
      const path = buildPath(contenuReel, state);
      path.forEach((u, i) => {
        const p = path[i - 1];
        const raison = i === 0 || u.done > 0 || u.optional || u.headstart || u.check?.passed
          || (p && (p.complete || p.optional || p.headstart || p.check?.passed));
        assert.ok(!u.unlocked || raison, `${experience} : ${u.id} ouverte sans raison (pas ${pas})`);
      });
      const n = getNextLesson(contenuReel, state);
      if (!n) break;
      if (n.needsCheck) state = { ...state, unitChecks: { ...state.unitChecks, [n.unit.id]: { passed: true, attempts: 1, lastAttemptAt: APRES } } };
      else state = { ...state, completedLessons: { ...state.completedLessons, [n.lesson.id]: APRES } };
    }
  }
});
