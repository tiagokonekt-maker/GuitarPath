import { test } from "node:test";
import assert from "node:assert/strict";
import { buildUnits, buildPath, getNextLesson, getPathStats, unitBonusXp, unitCheckSize, moduleOrderFor }
  from "../src/store/pathEngine.js";
import { defaultState } from "../src/store/state.js";

// Reproduit la répartition réelle du contenu : 4, 6, 7, 10, 13, 15, 18, 16, 19
const REPARTITION = [4, 6, 7, 10, 13, 15, 18, 16, 19];
const MODULES = ["neck", "scales", "harmony", "rhythm", "impro"];

function contenuRealiste() {
  const courses = MODULES.map(id => ({ id, title: id, lessons: [] }));
  let n = 0;
  REPARTITION.forEach((count, i) => {
    const level = i + 1;
    for (let k = 0; k < count; k++) {
      const c = courses[k % courses.length];
      c.lessons.push({ id: `l-${++n}`, level, title: `Leçon ${n}`, quiz: [`q-${n}a`, `q-${n}b`] });
    }
  });
  return { courses, quiz: [], exercises: [] };
}

test("aucune unité ne dépasse 8 leçons ni ne descend sous 2", () => {
  const units = buildUnits(contenuRealiste().courses);
  for (const u of units) {
    assert.ok(u.lessons.length <= 8, `${u.id} a ${u.lessons.length} leçons`);
    assert.ok(u.lessons.length >= 2, `${u.id} a ${u.lessons.length} leçons`);
  }
});

test("aucune leçon n'est perdue ni dupliquée dans le découpage", () => {
  const content = contenuRealiste();
  const total = REPARTITION.reduce((a, b) => a + b, 0);
  const units = buildUnits(content.courses);
  const ids = units.flatMap(u => u.lessons.map(l => l.id));
  assert.equal(ids.length, total);
  assert.equal(new Set(ids).size, total);
});

test("les identifiants d'unité sont uniques", () => {
  const units = buildUnits(contenuRealiste().courses);
  assert.equal(new Set(units.map(u => u.id)).size, units.length);
});

test("le coffre et la vérification sont proportionnels à la taille", () => {
  assert.ok(unitBonusXp(6) > unitBonusXp(3));
  assert.ok(unitCheckSize(8) > unitCheckSize(3));
  assert.ok(unitBonusXp(0) >= 20 && unitBonusXp(100) <= 150, "restent bornés");
  assert.ok(unitCheckSize(0) >= 4 && unitCheckSize(100) <= 14);
});

test("une leçon sans niveau est rattachée au dernier palier, pas ignorée", () => {
  const content = { courses: [{ id: "neck", title: "N", lessons: [
    { id: "a", level: 1 }, { id: "b", level: 1 }, { id: "orpheline" },
  ] }] };
  const ids = buildUnits(content.courses).flatMap(u => u.lessons.map(l => l.id));
  assert.ok(ids.includes("orpheline"));
});

test("un module inconnu (pack importé) va en fin de rotation, pas en tête", () => {
  const content = { courses: [
    { id: "pack-perso", title: "P", lessons: [{ id: "p1", level: 1 }] },
    { id: "neck", title: "N", lessons: [{ id: "n1", level: 1 }] },
  ] };
  const first = buildUnits(content.courses)[0].lessons[0].id;
  assert.equal(first, "n1", "avant, indexOf() === -1 le faisait passer premier");
});

test("le module le plus faible passe en tête de l'ordre interne", () => {
  const state = { ...defaultState(), onboarding: {
    ...defaultState().onboarding, done: true, weakestModule: "rhythm", preferredModule: "impro",
  } };
  assert.deepEqual(moduleOrderFor(state).slice(0, 2), ["rhythm", "impro"]);
  const u = buildUnits(contenuRealiste().courses, state)[0];
  assert.equal(u.lessons[0].courseId, "rhythm");
});

test("seule la première unité est ouverte sans progression ni placement", () => {
  const content = contenuRealiste();
  const path = buildPath(content, defaultState());
  assert.equal(path[0].unlocked, true);
  assert.equal(path[1].unlocked, false);
  assert.equal(path[0].isCurrent, true);
});

test("le placement ouvre réellement des paliers (audit §7.2)", () => {
  const content = contenuRealiste();
  const state = { ...defaultState(), onboarding: {
    ...defaultState().onboarding, done: true, overallTier: "B2",
  } };
  const path = buildPath(content, state);
  assert.equal(path.slice(0, 3).every(u => u.unlocked), true, "3 unités ouvertes pour un B2");
  assert.equal(path.slice(0, 3).every(u => u.complete), false, "mais aucune n'est cochée à sa place");
  // Et on ne renvoie pas un joueur testé B2 travailler le palier 1.
  const current = path.find(u => u.isCurrent);
  assert.equal(current.index, 3);
});

test("une unité contenant déjà une leçon faite reste ouverte", () => {
  const content = contenuRealiste();
  const units = buildUnits(content.courses);
  const cible = units[4];
  const state = { ...defaultState(), completedLessons: { [cible.lessons[0].id]: "2026-01-01" } };
  assert.equal(buildPath(content, state)[4].unlocked, true);
});

test("les leçons finies sans vérification réussie ne débloquent pas la suite", () => {
  const content = contenuRealiste();
  const units = buildUnits(content.courses);
  const completedLessons = {};
  for (const l of units[0].lessons) completedLessons[l.id] = "2026-01-01";
  const sansCheck = buildPath(content, { ...defaultState(), completedLessons });
  assert.equal(sansCheck[0].needsCheck, true);
  assert.equal(sansCheck[0].complete, false);
  assert.equal(sansCheck[1].unlocked, false);
  assert.equal(sansCheck[0].bonusClaimable, false);

  const avecCheck = buildPath(content, {
    ...defaultState(), completedLessons,
    unitChecks: { [units[0].id]: { passed: true, score: 90, attempts: 1 } },
  });
  assert.equal(avecCheck[0].complete, true);
  assert.equal(avecCheck[1].unlocked, true);
  assert.equal(avecCheck[0].bonusClaimable, true);
});

test("getNextLesson suit l'ordre du parcours et signale la vérification en attente", () => {
  const content = contenuRealiste();
  const units = buildUnits(content.courses);
  assert.equal(getNextLesson(content, defaultState()).lesson.id, units[0].lessons[0].id);

  const completedLessons = {};
  for (const l of units[0].lessons) completedLessons[l.id] = "2026-01-01";
  const next = getNextLesson(content, { ...defaultState(), completedLessons });
  assert.equal(next.needsCheck, true);
  assert.equal(next.unit.id, units[0].id);
});

test("getPathStats reste cohérent", () => {
  const content = contenuRealiste();
  const stats = getPathStats(content, defaultState());
  assert.equal(stats.totalLessons, REPARTITION.reduce((a, b) => a + b, 0));
  assert.equal(stats.doneLessons, 0);
  assert.equal(stats.pct, 0);
  assert.ok(stats.units >= REPARTITION.length);
});

test("un contenu vide ne fait rien planter", () => {
  assert.deepEqual(buildUnits([]), []);
  assert.deepEqual(buildPath({ courses: [] }, defaultState()), []);
  assert.equal(getNextLesson({ courses: [] }, defaultState()), null);
  assert.equal(getPathStats({ courses: [] }, defaultState()).pct, 0);
});
