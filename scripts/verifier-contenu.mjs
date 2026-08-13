#!/usr/bin/env node
// Groply — scripts/verifier-contenu.mjs
// Contrôles d'intégrité du contenu pédagogique. À lancer après chaque import
// de pack ou modification de content.js.
//
//     node scripts/verifier-contenu.mjs
//
// Vérifie : identifiants uniques, index de bonne réponse valide, quiz orphelins
// référencés par une leçon, couverture par module et par palier de difficulté,
// et volumétrie d'XP face à la courbe de niveaux.

import { COURSES, QUIZ, EXERCISES } from "../src/content.js";
import { totalXpForLevel } from "../src/store/leveling.js";
import { TESTABLE_MODULES, PLACEMENT_LEVELS, availableModules } from "../src/store/placementEngine.js";
import { buildUnits } from "../src/store/pathEngine.js";
import { LESSON_XP } from "../src/store/xp.js";

let alertes = 0;
const ko = (m) => { alertes++; console.log("  ⚠ " + m); };
const titre = (t) => console.log("\n=== " + t + " ===");

// ── Identifiants ──────────────────────────────────────────────────────────
titre("Identifiants");
const lecons = COURSES.flatMap(c => (c.lessons || []).map(l => ({ ...l, courseId: c.id })));
for (const [nom, liste] of [["leçons", lecons], ["quiz", QUIZ], ["exercices", EXERCISES]]) {
  const ids = liste.map(x => x.id);
  const doublons = ids.filter((id, i) => ids.indexOf(id) !== i);
  if (doublons.length) ko(`${nom} : identifiants en double → ${[...new Set(doublons)].join(", ")}`);
  const sansId = liste.filter(x => !x.id).length;
  if (sansId) ko(`${nom} : ${sansId} item(s) sans identifiant`);
}
console.log(`  ${COURSES.length} modules · ${lecons.length} leçons · ${QUIZ.length} quiz · ${EXERCISES.length} exercices`);

// ── Cohérence des quiz ────────────────────────────────────────────────────
titre("Cohérence des quiz");
for (const q of QUIZ) {
  if (q.type === "fretboard") continue;
  if (!Array.isArray(q.o) || q.o.length < 2) { ko(`${q.id} : moins de 2 options`); continue; }
  if (typeof q.a !== "number" || q.a < 0 || q.a >= q.o.length) ko(`${q.id} : index de réponse hors bornes (a=${q.a}, ${q.o.length} options)`);
  if (new Set(q.o).size !== q.o.length) ko(`${q.id} : options en double`);
  // La bonne réponse ne doit jamais figurer dans l'énoncé — c'est la règle de
  // conception que le contenu s'est fixée, autant la vérifier.
  const bonne = String(q.o[q.a] ?? "").toLowerCase();
  if (bonne.length > 6 && String(q.q || "").toLowerCase().includes(bonne)) {
    ko(`${q.id} : la bonne réponse apparaît dans l'énoncé`);
  }
  if (!q.exp) ko(`${q.id} : pas d'explication`);
  if (!(q.xp > 0)) ko(`${q.id} : xp manquant ou nul`);
}

// ── Références croisées ───────────────────────────────────────────────────
titre("Références croisées");
const idsQuiz = new Set(QUIZ.map(q => q.id));
const idsLecons = new Set(lecons.map(l => l.id));
for (const l of lecons) {
  for (const qid of l.quiz || []) if (!idsQuiz.has(qid)) ko(`leçon ${l.id} référence un quiz inexistant : ${qid}`);
}
for (const q of QUIZ) {
  if (q.lessonId && !idsLecons.has(q.lessonId)) ko(`quiz ${q.id} référence une leçon inexistante : ${q.lessonId}`);
}
const utilises = new Set(lecons.flatMap(l => l.quiz || []));
const orphelins = QUIZ.filter(q => !utilises.has(q.id));
if (orphelins.length) console.log(`  ${orphelins.length} quiz ne sont référencés par aucune leçon (utilisables en révision uniquement)`);

// ── Couverture par module ─────────────────────────────────────────────────
titre("Couverture par module");
for (const m of TESTABLE_MODULES) {
  const q = QUIZ.filter(x => x.courseId === m);
  const e = EXERCISES.filter(x => x.mod === m);
  const parNiveau = PLACEMENT_LEVELS.map(lvl => q.filter(x => x.lvl === lvl && x.type !== "fretboard").length);
  const ligne = `  ${m.padEnd(8)} ${String(q.length).padStart(3)} quiz  ${String(e.length).padStart(2)} exos  paliers [${parNiveau.join(", ")}]`;
  console.log(ligne);
  if (q.length === 0) ko(`${m} : AUCUNE question de quiz — le module ne peut pas être évalué`);
  else if (parNiveau.some(n => n === 0)) ko(`${m} : un palier de difficulté est vide, le module sera écarté du test de placement`);
}
const testables = availableModules(QUIZ);
console.log(`  Modules testables au placement : ${testables.join(", ") || "aucun"}`);
for (const m of TESTABLE_MODULES) if (!testables.includes(m)) ko(`${m} n'entre pas dans le test de placement`);

// ── Découpage du parcours ─────────────────────────────────────────────────
titre("Découpage du parcours");
const unites = buildUnits(COURSES);
const tailles = unites.map(u => u.lessons.length);
console.log(`  ${unites.length} unités · tailles : ${tailles.join(", ")}`);
if (Math.max(...tailles) > 8) ko(`une unité fait ${Math.max(...tailles)} leçons (cible : 8 maximum)`);
if (Math.min(...tailles) < 2) ko(`une unité fait ${Math.min(...tailles)} leçon (cible : 2 minimum)`);
const idsUnites = unites.map(u => u.id);
if (new Set(idsUnites).size !== idsUnites.length) ko("identifiants d'unité en double");
const lecInUnites = unites.flatMap(u => u.lessons.map(l => l.id));
if (lecInUnites.length !== lecons.length) ko(`${lecons.length - lecInUnites.length} leçon(s) perdue(s) dans le découpage`);
for (const u of unites) if (u.checkSize > new Set(u.lessons.flatMap(l => l.quiz || [])).size) {
  ko(`${u.id} : ${u.checkSize} questions de vérification demandées, seulement ${new Set(u.lessons.flatMap(l => l.quiz || [])).size} disponibles`);
}

// ── Économie d'XP ─────────────────────────────────────────────────────────
titre("Économie d'XP");
const xpLecons = lecons.length * LESSON_XP;
const xpQuiz = QUIZ.reduce((a, q) => a + (q.xp || 0), 0);
const xpExos = EXERCISES.reduce((a, e) => a + (e.xp || 0), 0);
const xpCoffres = unites.reduce((a, u) => a + (u.bonusXp || 0), 0);
const total = xpLecons + xpQuiz + xpExos + xpCoffres;
console.log(`  leçons ${xpLecons} + quiz ${xpQuiz} + exercices ${xpExos} + coffres ${xpCoffres} = ${total} XP unique`);
for (const n of [10, 20, 30]) {
  const besoin = totalXpForLevel(n);
  const pct = Math.round((besoin / total) * 100);
  console.log(`  niveau ${n} : ${besoin} XP (${pct} % du contenu)`);
  if (besoin > total) ko(`le niveau ${n} n'est pas atteignable avec le contenu actuel`);
}

console.log(alertes === 0 ? "\n✓ Aucune anomalie." : `\n${alertes} anomalie(s) à traiter.`);
process.exit(alertes === 0 ? 0 : 1);
