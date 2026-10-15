import { test } from "node:test";
import assert from "node:assert/strict";
import { pickTip, pertinence, contexteGropi, ajouterVu, fusionnerVus, rngDepuis, GROPI_CATALOGUE, GROPI_VUS_MAX } from "../src/store/gropiTips.js";
import { POSE_ROLE, POSE_PAR_TYPE } from "../src/design/gropiPoses.js";
import { reducer } from "../src/store/reducer.js";
import { defaultState, mergeStates } from "../src/store/state.js";
import { COURSES } from "../src/content/index.js";
import { buildPath } from "../src/store/pathEngine.js";

const S = (over = {}) => ({ ...defaultState(), ...over });
const JOUR = "2026-10-15";   // un jeudi

// Simule N jours d'affichage : chaque jour, le conseil retenu est noté
// (GROPI_TIP_VU), exactement comme le fait l'écran d'accueil.
function simuler(state, ctx, n, jour0 = new Date("2026-10-01T12:00:00")) {
  let s = state;
  const ids = [];
  for (let i = 0; i < n; i++) {
    const d = new Date(jour0.getTime() + i * 86400000);
    const jour = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
    const t = pickTip(s, { ...ctx, jour });
    ids.push(t.id);
    s = reducer(s, { type: "GROPI_TIP_VU", id: t.id, jour });
  }
  return { s, ids };
}

// ── Catalogue ──────────────────────────────────────────────────────────────
test("catalogue : ~120+ entrées, ids uniques, trois types, champs valides", () => {
  assert.ok(GROPI_CATALOGUE.length >= 120, `${GROPI_CATALOGUE.length} entrées`);
  const ids = GROPI_CATALOGUE.map(t => t.id);
  assert.equal(new Set(ids).size, ids.length, "ids uniques");
  const modules = new Set(["all", ...COURSES.map(c => c.id)]);
  const lecons = new Set(COURSES.flatMap(c => c.lessons.map(l => l.id)));
  for (const t of GROPI_CATALOGUE) {
    assert.ok(["tip", "anecdote", "progress"].includes(t.type), t.id);
    assert.ok(Array.isArray(t.modules) && t.modules.every(m => modules.has(m)), `${t.id} : modules`);
    for (const l of t.lecons || []) assert.ok(lecons.has(l), `${t.id} : leçon ${l}`);
    if (t.niveau) assert.ok(t.niveau[0] <= t.niveau[1] && t.niveau[0] >= 0 && t.niveau[1] <= 9, `${t.id} : niveau`);
    if (t.type !== "progress") assert.equal(typeof t.text, "string", `${t.id} : texte fixe`);
    if (t.pose) assert.ok(Object.values(POSE_ROLE).includes(t.pose), `${t.id} : pose`);
  }
  for (const type of ["tip", "anecdote", "progress"]) assert.ok(GROPI_CATALOGUE.some(t => t.type === type), type);
});

test("chaque module du parcours a des conseils et des anecdotes dédiés", () => {
  for (const c of COURSES) {
    assert.ok(GROPI_CATALOGUE.some(t => t.type === "tip" && t.modules.includes(c.id)), `conseil pour ${c.id}`);
    assert.ok(GROPI_CATALOGUE.some(t => t.type === "anecdote" && t.modules.includes(c.id)), `anecdote pour ${c.id}`);
  }
});

test("chaque leçon porte un gropiTip court", () => {
  for (const c of COURSES) for (const l of c.lessons) {
    assert.equal(typeof l.gropiTip, "string", `${l.id} : gropiTip manquant`);
    assert.ok(l.gropiTip.length >= 30 && l.gropiTip.length <= 260, `${l.id} : ${l.gropiTip.length} caractères`);
  }
});

// ── Sélection ──────────────────────────────────────────────────────────────
test("pickTip est déterministe : même état, même jour → même conseil", () => {
  const ctx = { moduleCourant: "scales", palier: 3, jour: JOUR };
  assert.deepEqual(pickTip(S(), ctx), pickTip(S(), ctx));
});

test("stable dans la journée : le conseil noté revient tel quel, même si le contexte change", () => {
  const ctx = { moduleCourant: "rhythm", palier: 4, jour: JOUR };
  const t1 = pickTip(S(), ctx);
  const s = reducer(S(), { type: "GROPI_TIP_VU", id: t1.id, jour: JOUR });
  assert.equal(pickTip(s, ctx).id, t1.id);
  assert.equal(pickTip(s, { ...ctx, moduleCourant: "harmony" }).id, t1.id, "le même toute la journée");
  assert.notEqual(pickTip(s, { ...ctx, jour: "2026-10-16" }).id, t1.id, "le lendemain, autre chose");
});

test("« Un autre conseil » en propose un différent, qui devient celui du jour", () => {
  const ctx = { moduleCourant: "impro", palier: 7, jour: JOUR };
  let s = S();
  const t1 = pickTip(s, ctx);
  s = reducer(s, { type: "GROPI_TIP_VU", id: t1.id, jour: JOUR });
  const t2 = pickTip(s, { ...ctx, nouveau: true });
  assert.notEqual(t2.id, t1.id);
  s = reducer(s, { type: "GROPI_TIP_VU", id: t2.id, jour: JOUR });
  assert.equal(pickTip(s, ctx).id, t2.id);
});

test("aucune répétition avant d'avoir épuisé le pool du contexte", () => {
  const ctx = { moduleCourant: "harmony", palier: 7 };
  const s0 = S({ completedLessons: { a: "2026-01-01", b: "2026-01-02", c: "2026-01-03" }, streak: 4 });
  // Taille du pool éligible pour ce contexte.
  const n = GROPI_CATALOGUE.filter(t => {
    if (t.niveau && (7 < t.niveau[0] || 7 > t.niveau[1])) return false;
    try { if (t.cond && !t.cond(s0, { ...ctx, jourSemaine: 3 })) return false; } catch { return false; }
    return pertinence(t, ctx) > 0;
  }).length;
  const { ids } = simuler(s0, ctx, Math.min(n - 4, 60));
  assert.equal(new Set(ids).size, ids.length, "aucun doublon tant que le pool n'est pas épuisé");
});

test("pool épuisé : on repart des plus anciens, jamais du dernier montré", () => {
  const cat = [
    { id: "x1", type: "tip", modules: ["all"], text: "1" },
    { id: "x2", type: "tip", modules: ["all"], text: "2" },
    { id: "x3", type: "tip", modules: ["all"], text: "3" },
  ];
  const { ids } = simuler(S(), { catalogue: cat }, 9);
  assert.deepEqual(new Set(ids.slice(0, 3)).size, 3, "un tour complet d'abord");
  for (let i = 1; i < ids.length; i++) assert.notEqual(ids[i], ids[i - 1], "jamais deux fois de suite");
});

test("les conseils du module et de la leçon en cours passent devant", () => {
  const ctx = { moduleCourant: "rhythm", leconCourante: "rhy-c5-05", titreLecon: "Gypsy jazz : la pompe Django", palier: 9, jour: JOUR };
  const t = pickTip(S({ completedLessons: { x: "2026-01-01" }, streak: 1 }), { ...ctx, rng: () => 0.1 });
  const e = GROPI_CATALOGUE.find(x => x.id === t.id);
  assert.ok(pertinence(e, ctx) >= 2, `${t.id} doit concerner le rythme ou la leçon (pertinence ${pertinence(e, ctx)})`);
  // Sur 20 jours, l'écrasante majorité des conseils non génériques sont du module.
  const { ids } = simuler(S({ completedLessons: { x: "2026-01-01" }, streak: 1 }), ctx, 20);
  const pertinents = ids.filter(id => { const x = GROPI_CATALOGUE.find(y => y.id === id); return pertinence(x, ctx) >= 2; });
  assert.ok(pertinents.length >= 15, `${pertinents.length}/20 pertinents`);
});

test("pertinence : leçon > mot-clé du titre > module > générique > hors sujet", () => {
  const e = { modules: ["scales"], lecons: ["scales-c5-02"], mots: ["dorien"] };
  assert.equal(pertinence(e, { moduleCourant: "scales", leconCourante: "scales-c5-02" }), 4);
  assert.equal(pertinence(e, { moduleCourant: "harmony", titreLecon: "Le DORIEN" }), 3);
  assert.equal(pertinence(e, { moduleCourant: "scales" }), 2);
  assert.equal(pertinence({ modules: ["all"] }, { moduleCourant: "scales" }), 1);
  assert.equal(pertinence(e, { moduleCourant: "rhythm" }), 0);
  assert.equal(pertinence(e, {}), 1, "sans contexte, tout se vaut");
});

test("le palier filtre : pas de conseil de modes au palier 1", () => {
  const { ids } = simuler(S(), { moduleCourant: "scales", palier: 1 }, 25);
  for (const id of ids) {
    const e = GROPI_CATALOGUE.find(x => x.id === id);
    if (e.niveau) assert.ok(e.niveau[0] <= 1 && e.niveau[1] >= 1, `${id} hors palier`);
  }
});

test("rappels de progression : au plus 1 sur 4", () => {
  const s0 = S({ streak: 9, streakFreezes: 2, level: 5, unlockedBadges: ["a", "b"], dailyChallengeCount: 5,
    completedLessons: Object.fromEntries(Array.from({ length: 12 }, (_, i) => [`l${i}`, "2026-01-01"])),
    jam: { ...defaultState().jam, seances: 3 }, semaine: { cle: "2026-W42", jours: ["a", "b", "c"] } });
  const { ids } = simuler(s0, { moduleCourant: "neck", palier: 4, toReview: 25 }, 40);
  const types = ids.map(id => GROPI_CATALOGUE.find(x => x.id === id).type);
  for (let i = 0; i + 4 <= types.length; i++) {
    const n = types.slice(i, i + 4).filter(t => t === "progress").length;
    assert.ok(n <= 1, `fenêtre ${i} : ${n} rappels`);
  }
  assert.ok(types.includes("progress"), "les rappels existent quand même");
  assert.ok(types.includes("tip") && types.includes("anecdote"), "mélange conseils / anecdotes");
});

test("rappel prioritaire : 25 questions en retard → Gropi le dit d'abord", () => {
  const t = pickTip(S({ completedLessons: { x: "2026-01-01" }, streak: 2 }), { moduleCourant: "neck", palier: 3, toReview: 25, jour: JOUR });
  assert.equal(t.id, "p-revisions");
  assert.match(t.text, /25 questions/);
  assert.equal(t.pose, "think");
});

test("débutant sans leçon : on l'invite à commencer, avec le salut", () => {
  const t = pickTip(S(), { moduleCourant: "debut", palier: 0, jour: JOUR });
  assert.equal(t.id, "p-premiere-lecon");
  assert.equal(t.pose, POSE_ROLE.accueil);
});

test("la pose suit le type ; le libellé aussi", () => {
  const { s } = simuler(S({ completedLessons: { x: "2026-01-01" }, streak: 1 }), { moduleCourant: "scales", palier: 6 }, 12);
  for (const id of s.gropiVus) {
    const e = GROPI_CATALOGUE.find(x => x.id === id);
    const t = pickTip({ ...s, gropiJour: { date: JOUR, id } }, { moduleCourant: "scales", palier: 6, jour: JOUR });
    if (t.id !== id) continue;   // un rappel dont la condition ne tient plus
    assert.equal(t.pose, e.pose || POSE_PAR_TYPE[e.type]);
    assert.ok(t.label.length > 0);
  }
  assert.equal(POSE_PAR_TYPE.tip, "idea");
  assert.equal(POSE_PAR_TYPE.anecdote, "histoire");
});

test("jour de la semaine injecté : le conseil du lundi n'apparaît qu'un lundi", () => {
  const e = GROPI_CATALOGUE.find(x => x.id === "t-lundi");
  assert.equal(e.cond(S(), { jourSemaine: 1 }), true);
  assert.equal(e.cond(S(), { jourSemaine: 4 }), false);
  const { ids } = simuler(S(), {}, 7 * 12);
  const lundis = ids.filter(id => id === "t-lundi");
  assert.ok(lundis.length <= 1, "jamais répété");
});

test("rng injecté : tirage reproductible", () => {
  const a = rngDepuis("x"), b = rngDepuis("x");
  for (let i = 0; i < 5; i++) assert.equal(a(), b());
  const ctx = { moduleCourant: "impro", palier: 8, jour: JOUR };
  assert.equal(pickTip(S(), { ...ctx, rng: () => 0.99 }).id, pickTip(S(), { ...ctx, rng: () => 0.99 }).id);
});

test("catalogue vide ou contexte hors sujet : repli sans planter", () => {
  const t = pickTip(S(), { catalogue: [], jour: JOUR });
  assert.equal(t.id, "defaut");
  assert.ok(t.text.length > 0);
  assert.doesNotThrow(() => pickTip(undefined, {}));
});

test("contexteGropi : prochaine leçon de l'unité courante", () => {
  const content = { courses: COURSES, quiz: [] };
  const state = S({ onboarding: { ...defaultState().onboarding, done: true, experience: "debutant", skipped: true, overallTier: "A1" } });
  const ctx = contexteGropi(buildPath(content, state), state, { toReview: 3 });
  assert.equal(ctx.moduleCourant, "debut");
  assert.equal(ctx.leconCourante, "debut-c1-01");
  assert.equal(ctx.palier, 0);
  assert.equal(ctx.toReview, 3);
  assert.ok(ctx.leconsRestantes > 0);
  assert.deepEqual(contexteGropi([], {}), { moduleCourant: null, leconCourante: null, titreLecon: "", palier: null, leconsRestantes: null });
});

// ── État : historique et merge ─────────────────────────────────────────────
test("GROPI_TIP_VU : conseil du jour + historique sans doublon, plafonné", () => {
  let s = reducer(S(), { type: "GROPI_TIP_VU", id: "a", jour: JOUR });
  assert.deepEqual(s.gropiJour, { date: JOUR, id: "a" });
  assert.deepEqual(s.gropiVus, ["a"]);
  const meme = reducer(s, { type: "GROPI_TIP_VU", id: "a", jour: JOUR });
  assert.equal(meme, s, "déjà noté : même objet, pas de rendu");
  s = reducer(s, { type: "GROPI_TIP_VU", id: "b", jour: JOUR });
  s = reducer(s, { type: "GROPI_TIP_VU", id: "a", jour: "2026-10-16" });
  assert.deepEqual(s.gropiVus, ["b", "a"], "revu → passe en fin");
  assert.equal(reducer(s, { type: "GROPI_TIP_VU" }).gropiVus, s.gropiVus, "action mal formée ignorée");
  let v = [];
  for (let i = 0; i < 400; i++) v = ajouterVu(v, `t${i}`);
  assert.equal(v.length, GROPI_VUS_MAX);
  assert.equal(v[v.length - 1], "t399");
});

test("merge : union de l'historique, conseil du jour le plus récent", () => {
  const L = S({ gropiVus: ["a", "b"], gropiJour: { date: "2026-10-14", id: "b" } });
  const C = S({ gropiVus: ["c", "a"], gropiJour: { date: "2026-10-15", id: "c" } });
  const m = mergeStates(L, C);
  assert.deepEqual(new Set(m.gropiVus), new Set(["a", "b", "c"]));
  assert.deepEqual(m.gropiVus.slice(-2), ["a", "b"], "l'ordre local fait foi en fin de liste");
  assert.deepEqual(m.gropiJour, { date: "2026-10-15", id: "c" });
  assert.deepEqual(mergeStates(C, L).gropiJour, { date: "2026-10-15", id: "c" }, "le plus récent, quel que soit le côté");
  assert.deepEqual(fusionnerVus(undefined, ["x"]), ["x"]);
});

test("migration : un ancien état sans historique Gropi reçoit des valeurs sûres", () => {
  const ancien = { ...defaultState() };
  delete ancien.gropiVus; delete ancien.gropiJour;
  const m = mergeStates(ancien, { ...ancien, gropiVus: "nimporte", gropiJour: null });
  assert.deepEqual(m.gropiVus, []);
  assert.deepEqual(m.gropiJour, { date: "", id: "" });
});
