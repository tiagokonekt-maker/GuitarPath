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

// ── Pool de la vérification d'unité ───────────────────────────────────────
// Avant, le pool faisait exactement la taille de l'échantillon sur les
// premiers paliers (8 questions pour 8 tirées) : les questions étaient
// toujours les mêmes, et refaire la vérification juste après avoir vu les
// corrections revenait à la valider de mémoire.
import { getUnitQuizPool } from "../src/store/pathEngine.js";

const contenuAvecQuiz = () => {
  const courses = [
    { id: "neck", title: "N", lessons: [
      { id: "n1", level: 1, quiz: ["qn1", "qn2"] },
      { id: "n2", level: 1, quiz: ["qn3"] },
      { id: "n3", level: 2, quiz: ["qn4"] },
    ] },
    { id: "scales", title: "S", lessons: [
      { id: "s1", level: 1, quiz: ["qs1"] },
      { id: "s2", level: 2, quiz: ["qs2"] },
    ] },
  ];
  const quiz = [
    { id: "qn1", courseId: "neck",   lessonId: "n1", lvl: 1 },
    { id: "qn2", courseId: "neck",   lessonId: "n1", lvl: 2 },
    { id: "qn3", courseId: "neck",   lessonId: "n2", lvl: 1 },
    { id: "qn4", courseId: "neck",   lessonId: "n3", lvl: 3 },
    { id: "qs1", courseId: "scales", lessonId: "s1", lvl: 1 },
    { id: "qs2", courseId: "scales", lessonId: "s2", lvl: 2 },
    // Question de module sans leçon de rattachement : admissible en renfort
    { id: "qn5", courseId: "neck",   lessonId: null, lvl: 2 },
    // Autre module : jamais admissible
    { id: "qh1", courseId: "harmony", lessonId: null, lvl: 1 },
  ];
  return { courses, quiz };
};

test("sans banque fournie, le pool garde son comportement historique", () => {
  const { courses } = contenuAvecQuiz();
  const u = buildUnits(courses)[0];
  const pool = getUnitQuizPool(u);
  assert.ok(Array.isArray(pool));
  assert.deepEqual([...pool].sort(), ["qn1", "qn2", "qn3", "qs1"].sort());
});

test("le pool s'élargit avec le renfort du même module", () => {
  const { courses, quiz } = contenuAvecQuiz();
  const u = buildUnits(courses)[0];
  const done = { n1: "2026-01-01", n2: "2026-01-01", s1: "2026-01-01", n3: "2026-01-01" };
  const pool = getUnitQuizPool(u, quiz, done);
  assert.ok(pool.length > pool.core.length, "le renfort doit apporter des questions");
  assert.ok(pool.extra.includes("qn5"), "une question de module sans leçon est admissible");
  assert.ok(pool.extra.includes("qn4"), "une leçon complétée hors unité est admissible");
});

test("le renfort n'admet jamais un autre module", () => {
  const { courses, quiz } = contenuAvecQuiz();
  const u = buildUnits(courses)[0];
  const pool = getUnitQuizPool(u, quiz, { n1: "x", n2: "x", n3: "x", s1: "x", s2: "x" });
  assert.ok(!pool.includes("qh1"), "harmony n'est pas un module de cette unité");
});

test("le renfort n'admet jamais une leçon non complétée", () => {
  const { courses, quiz } = contenuAvecQuiz();
  const u = buildUnits(courses)[0];
  // n3 n'est PAS complétée : sa question qn4 ne doit pas apparaître.
  const pool = getUnitQuizPool(u, quiz, { n1: "x", n2: "x", s1: "x" });
  assert.ok(!pool.includes("qn4"), "on ne teste pas sur du contenu jamais ouvert");
});

test("aucun doublon entre le coeur et le renfort", () => {
  const { courses, quiz } = contenuAvecQuiz();
  const u = buildUnits(courses)[0];
  const pool = getUnitQuizPool(u, quiz, { n1: "x", n2: "x", n3: "x", s1: "x", s2: "x" });
  assert.equal(new Set(pool).size, pool.length);
  for (const id of pool.core) assert.ok(!pool.extra.includes(id));
});

test("le nombre de questions de vérification ne dépasse jamais le stock", () => {
  const { courses } = contenuAvecQuiz();
  for (const u of buildUnits(courses)) {
    const stock = new Set(u.lessons.flatMap(l => l.quiz || [])).size;
    assert.ok(u.checkSize <= Math.max(3, stock),
      `${u.id} demande ${u.checkSize} questions pour ${stock} disponibles`);
  }
});
