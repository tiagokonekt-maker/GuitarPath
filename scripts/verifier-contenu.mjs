#!/usr/bin/env node
// Groply — scripts/verifier-contenu.mjs
// Contrôles d'intégrité du contenu pédagogique. À lancer après chaque import
// de pack ou modification du contenu (src/content/).
//
//     node scripts/verifier-contenu.mjs
//
// Vérifie : identifiants uniques, index de bonne réponse valide, quiz orphelins
// référencés par une leçon, couverture par module et par palier de difficulté,
// volumétrie d'XP face à la courbe de niveaux, et fichiers de leçon
// cohérents avec les index (aucun fichier oublié, nom = identifiant).

import { COURSES, QUIZ, EXERCISES } from "../src/content/index.js";
import { totalXpForLevel } from "../src/store/leveling.js";
import { TESTABLE_MODULES, PLACEMENT_LEVELS, availableModules } from "../src/store/placementEngine.js";
import { buildUnits, getUnitQuizPool } from "../src/store/pathEngine.js";
import { LESSON_XP } from "../src/store/xp.js";
import { GROPI_CATALOGUE } from "../src/store/gropiCatalogue.js";
import { validerCartes, texteDeCarte, controlerQuestionsCadeaux } from "../src/lecon/cartes.js";
import { readdirSync } from "node:fs";
import { fileURLToPath } from "node:url";

/**
 * Tous les blocs d'une leçon soumis aux contrôles musicaux : ceux de
 * `content` (leçon article) et ceux des `cartes` (leçon en cartes) — le
 * diagramme d'une carte, plus son texte sous forme de pseudo-bloc pour le
 * contrôle des positions « note (corde X case Y) ». `i` sert d'étiquette.
 */
function blocsDe(l) {
  const out = (l.content || []).map((b, i) => ({ b, i }));
  (l.cartes || []).forEach((c, k) => {
    const i = `carte ${k + 1}`;
    if (c?.bloc) out.push({ b: c.bloc, i });
    const texte = [texteDeCarte(c), c?.q, ...(c?.o || []), c?.exp].filter(t => typeof t === "string").join(" ");
    if (texte.trim()) out.push({ b: { type: "texte-carte", text: texte }, i });
  });
  return out;
}

let alertes = 0;
const ko = (m) => { alertes++; console.log("  ⚠ " + m); };
const titre = (t) => console.log("\n=== " + t + " ===");

// ── Fichiers ───────────────────────────────────────────────────────────────
// Une leçon = un fichier cours/<module>/<id>.js, importé par l'index du
// module. Un fichier créé mais oublié dans l'index n'apparaîtrait nulle
// part, sans aucune erreur : on le signale ici.
titre("Fichiers");
const DOSSIER_COURS = fileURLToPath(new URL("../src/content/cours/", import.meta.url));
for (const c of COURSES) {
  const fichiers = readdirSync(DOSSIER_COURS + c.id).filter(n => n.endsWith(".js") && n !== "index.js").map(n => n.slice(0, -3));
  const ids = new Set((c.lessons || []).map(l => l.id));
  for (const n of fichiers) if (!ids.has(n)) ko(`cours/${c.id}/${n}.js n'est pas importé par cours/${c.id}/index.js (ou son id diffère du nom du fichier)`);
}
for (const q of QUIZ) {
  const c = COURSES.find(c => (c.lessons || []).some(l => l.id === q.lessonId));
  if (!c) ko(`quiz ${q.id} : leçon ${q.lessonId} introuvable`);
}

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

// ── Qualité des quiz ──────────────────────────────────────────────────────
// Règles issues de l'audit des quiz (voir src/content/README.md, « Questions
// de quiz ») : chaque leçon article est évaluée par au moins 3 questions ; pas
// de question en double ; pas de question « selon la leçon » (on vérifie une
// compétence, pas la mémoire du texte) ; une leçon ne cite jamais en révision
// une question d'une leçon placée PLUS LOIN dans le parcours (ordre par défaut
// de buildUnits). L'écart de forme entre la bonne réponse et les autres choix
// n'est qu'un rappel (ℹ) : il faut parfois une réponse plus précise.
titre("Qualité des quiz");
{
  const MIN_QUESTIONS = 3;
  for (const l of lecons) {
    if (l.cartes === undefined && (l.quiz || []).length < MIN_QUESTIONS) ko(`leçon ${l.id} : ${(l.quiz || []).length} question(s) dans son quiz (minimum ${MIN_QUESTIONS})`);
  }
  const norm = (t) => String(t || "").toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[^a-z0-9#♭]+/g, " ").trim();
  const vus = new Map();
  for (const q of QUIZ) {
    const k = norm(q.q);
    if (vus.has(k)) ko(`${q.id} : même énoncé que ${vus.get(k)}`);
    else vus.set(k, q.id);
    if (/selon la le[cç]on|que conseille la le[cç]on|d'apr[eè]s la le[cç]on/i.test(q.q || "")) ko(`${q.id} : question « selon la leçon » — interroger la compétence, pas le texte`);
  }
  // Rang de chaque leçon dans le parcours par défaut (unités dans l'ordre).
  const rang = new Map();
  buildUnits(COURSES).forEach((u, i) => u.lessons.forEach(l => rang.set(l.id, i)));
  const proprietaire = new Map(QUIZ.map(q => [q.id, q.lessonId]));
  for (const l of lecons) for (const qid of l.quiz || []) {
    const ailleurs = proprietaire.get(qid);
    if (ailleurs && ailleurs !== l.id && rang.get(ailleurs) > rang.get(l.id)) {
      ko(`leçon ${l.id} cite ${qid}, rattachée à ${ailleurs} qui vient plus loin dans le parcours`);
    }
  }
  let rappels = 0;
  for (const q of QUIZ) {
    if (!Array.isArray(q.o) || typeof q.a !== "number") continue;
    const autres = q.o.filter((_, i) => i !== q.a);
    const bonne = q.o[q.a] || "";
    const maxAutres = Math.max(...autres.map(o => o.length));
    const detailSeul = /[(=]/.test(bonne) && !autres.some(o => /[(=]/.test(o));
    if ((bonne.length > maxAutres * 1.4 && bonne.length - maxAutres > 10) || detailSeul) {
      rappels++;
      console.log(`  ℹ ${q.id} : la bonne réponse se distingue des autres par sa forme (longueur ou précision entre parenthèses)`);
    }
  }
  console.log(`  ${QUIZ.length} questions contrôlées${rappels ? ` · ${rappels} rappel(s) de forme` : ""}`);
}

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
// ── Vérification d'unité : le meilleur cas atteint-il un minimum exploitable ? ──
//
// `checkSize` (15) est une CIBLE, pas une garantie — c'est voulu (voir
// pathEngine.js et unitCheckSampler.js). La comparer directement au cœur
// d'UNE unité isolée, comme le faisait ce script avant, redonnait une
// alerte sur la quasi-totalité des unités : 15 fut choisi précisément pour
// dépasser ce qu'un cœur isolé fournit, quitte à piocher dans le renfort et
// le rappel — deux pools qui n'existent qu'une fois qu'un utilisateur a
// réellement progressé, donc invisibles à ce script qui ne regarde que le
// contenu, sans état de progression.
//
// La question qu'il reste légitime de poser ICI, sans état utilisateur :
// même dans le MEILLEUR DES CAS — tout le contenu qui précède cette unité
// dans le parcours est supposé complété — la vérification reste-t-elle
// exploitable ? Un plancher de 6 (pas 15) : suffisant pour qu'un contrôle
// vaille la peine d'exister, sans faux positif sur les unités légitimement
// modestes en tout début de parcours.
const PLANCHER_VERIFICATION = 6;
const disponibiliteMax = [];
for (let i = 0; i < unites.length; i++) {
  const u = unites[i];
  // Simule : "si j'avais fait tout ce qui précède cette unité dans le
  // parcours, dans l'ordre". C'est le scénario le plus favorable — et
  // atteignable, un utilisateur qui progresse normalement y arrive un jour.
  const completeAvant = {};
  for (let j = 0; j < i; j++) for (const l of unites[j].lessons) completeAvant[l.id] = true;

  const pool = getUnitQuizPool(u, QUIZ, completeAvant, COURSES);
  disponibiliteMax.push(pool.length);
  if (pool.length < PLANCHER_VERIFICATION) {
    ko(`${u.id} : même avec tout le contenu antérieur complété, seulement ${pool.length} questions disponibles (minimum souhaité : ${PLANCHER_VERIFICATION})`);
  }
}
const moyenne = Math.round(disponibiliteMax.reduce((a, b) => a + b, 0) / disponibiliteMax.length);
console.log(`  vérification, meilleur cas par unité : min ${Math.min(...disponibiliteMax)} · moy ${moyenne} · max ${Math.max(...disponibiliteMax)} (cible 15)`);

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

// ── Cohérence musicale (notes, gammes, accords, rythmes) ──────────────────
// Chaque diagramme est RECALCULÉ depuis ses données brutes (cases, cordes)
// et comparé à ce que sa légende annonce — jamais l'inverse. C'est ainsi
// qu'un audit a trouvé un Si diminué qui jouait en réalité un Ré augmenté,
// une gamme de La dorien sans tierce mineure, et un accord Cmaj7 « shell »
// sans 3e. Convention de données : frets[0] = corde 6 (Mi grave), voir
// diagrams.jsx. Logique volontairement autonome (aucune dépendance au
// moteur audio), pour que ce script reste exécutable seul, sans navigateur.
titre("Cohérence musicale");

const LETTRES = ["Do", "Ré", "Mi", "Fa", "Sol", "La", "Si"];
const NATUREL = [0, 2, 4, 5, 7, 9, 11];
const CORDE_MIDI = { 6: 40, 5: 45, 4: 50, 3: 55, 2: 59, 1: 64 };
const noteDeCorde = (corde, fret) => ((CORDE_MIDI[corde] + fret) % 12 + 12) % 12;
const pcDeNom = (nom) => {
  const m = /^(Do|Ré|Re|Mi|Fa|Sol|La|Si)(#{0,2}|b{0,2})$/.exec(String(nom || "").trim());
  if (!m) return null;
  const l = LETTRES.indexOf(m[1].replace("Re", "Ré"));
  const acc = m[2].startsWith("#") ? m[2].length : -m[2].length;
  return ((NATUREL[l] + acc) % 12 + 12) % 12;
};
const nomDePc = (pc) => LETTRES[NATUREL.indexOf(((NATUREL.find(n => n === pc)) ?? -1))] ?? null;
// Table inverse complète (toutes les classes de hauteur, y compris altérées) :
const NOMS_PC = ["Do", "Do#", "Ré", "Ré#", "Mi", "Fa", "Fa#", "Sol", "Sol#", "La", "La#", "Si"];

// -- 1. Diagrammes d'accords : chaque case rejouée, comparée au nom affiché --
const FORMULES_ACCORD = {
  "": [0, 4, 7], "m": [0, 3, 7], "dim": [0, 3, 6], "aug": [0, 4, 8],
  "maj7": [0, 4, 7, 11], "m7": [0, 3, 7, 10], "7": [0, 4, 7, 10],
  "m7b5": [0, 3, 6, 10], "dim7": [0, 3, 6, 9], "6": [0, 4, 7, 9], "m6": [0, 3, 7, 9],
  "9": [0, 4, 7, 10, 2], "add9": [0, 4, 7, 2], "sus2": [0, 2, 7], "sus4": [0, 5, 7],
};
function notesDiagramme(frets) {
  const out = [];
  frets.forEach((f, i) => { if (f >= 0) out.push(noteDeCorde(6 - i, f)); });
  return out;
}
const LETTRE_ANGLAISE_PC = { C:0, D:2, E:4, F:5, G:7, A:9, B:11 };
const RACINES_FR = ["Do", "Ré", "Re", "Mi", "Fa", "Sol", "La", "Si"];
/**
 * Les diagrammes nomment leurs accords tantôt en anglais (Cmaj7, Bdim, G7),
 * tantôt en français (Do, Sol) : les 2 conventions coexistent dans le
 * contenu. Sans gérer l'anglais, ce contrôle ne couvrait que 2 accords sur
 * 32 — silencieusement, en apparence « aucune anomalie ».
 */
function racineEtTypeAccord(nomBrut) {
  const nom = nomBrut.replace(/\s*\([^)]*\)/g, "").split("/")[0].trim();   // retire "(I)", "/E"...
  for (const r of RACINES_FR) if (nom === r) return { racine: pcDeNom(r), type: "" };
  const m = /^([A-G])(#|b)?(.*)$/.exec(nom);
  if (!m) return null;
  const pc = ((LETTRE_ANGLAISE_PC[m[1]] + (m[2] === "#" ? 1 : m[2] === "b" ? -1 : 0)) % 12 + 12) % 12;
  return { racine: pc, type: m[3] };
}
let diagrammesVerifies = 0;
for (const c of COURSES) for (const l of c.lessons) blocsDe(l).forEach(({ b, i }) => {
  if (b.type !== "chord_diagram" || !Array.isArray(b.data?.frets)) return;
  const info = racineEtTypeAccord(b.data.name || "");
  if (!info) return;   // nom non reconnu : on ne peut rien recalculer, on passe
  diagrammesVerifies++;
  const joues = new Set(notesDiagramme(b.data.frets));
  if (!joues.has(info.racine)) { ko(`${l.id}/${i} « ${b.data.name} » : la fondamentale (${NOMS_PC[info.racine]}) n'est jouée sur aucune corde`); return; }
  const formule = FORMULES_ACCORD[info.type];
  if (!formule) return;   // type d'accord non répertorié ici : pas de faux négatif
  const attendu = new Set(formule.map(d => (info.racine + d) % 12));
  const hors = [...joues].filter(pc => !attendu.has(pc));
  if (hors.length) ko(`${l.id}/${i} « ${b.data.name} » : notes hors accord → ${hors.map(pc => NOMS_PC[pc]).join(", ")} (cases ${JSON.stringify(b.data.frets)})`);
});

// -- 2. Gammes/modes : chaque note du schéma dans la gamme annoncée, fondamentale correctement marquée --
const FORMULES_GAMME = {
  "majeure": [0,2,4,5,7,9,11], "ionien": [0,2,4,5,7,9,11],
  "mineure naturelle": [0,2,3,5,7,8,10], "mineur naturel": [0,2,3,5,7,8,10], "éolien": [0,2,3,5,7,8,10],
  "mineure harmonique": [0,2,3,5,7,8,11], "mineure mélodique": [0,2,3,5,7,9,11],
  "dorien": [0,2,3,5,7,9,10], "phrygien": [0,1,3,5,7,8,10], "lydien": [0,2,4,6,7,9,11],
  "mixolydien": [0,2,4,5,7,9,10], "locrien": [0,1,3,5,6,8,10],
  "pentatonique mineure": [0,3,5,7,10], "am pentatonique": [0,3,5,7,10],
  "pentatonique majeure": [0,2,4,7,9], "blues": [0,3,5,6,7,10],
};
function formuleDepuisLegende(cap) {
  const tete = cap.toLowerCase().split(/ — | = |\(/)[0];
  const ordre = ["dorien","phrygien","mixolydien","lydien","locrien","éolien","ionien",
    "mineure harmonique","mineure mélodique","blues","pentatonique mineure","pentatonique majeure",
    "am pentatonique","mineur naturel","mineure","mineur","majeure","majeur"];
  for (const k of ordre) if (tete.includes(k)) return FORMULES_GAMME[k === "mineur" ? "mineure naturelle" : k === "majeur" ? "majeure" : k];
  return null;
}
function racineDepuisLegende(cap) {
  if (/\bAm\b/.test(cap.split(/ — /)[0])) return pcDeNom("La");
  const m = /(?:^|de |gamme )(Do#?|Ré#?|Mi|Fa#?|Sol#?|La#?|Si|Sib|Mib|Lab|Réb|Solb)\b/.exec(cap);
  return m ? pcDeNom(m[1]) : null;
}
let gammesVerifiees = 0;
for (const c of COURSES) for (const l of c.lessons) blocsDe(l).forEach(({ b, i }) => {
  if (b.type !== "scale_pattern" || !Array.isArray(b.data?.strings)) return;
  const racine = racineDepuisLegende(b.caption), formule = formuleDepuisLegende(b.caption);
  if (racine == null || !formule) return;   // légende non reconnue : pas de faux négatif
  gammesVerifiees++;
  const attendu = new Set(formule.map(d => (racine + d) % 12));
  const toutes = [], racinesMarquees = [];
  b.data.strings.forEach((s, idx) => {
    const corde = 6 - idx;
    for (const fr of s.frets || []) toutes.push({ corde, fr, pc: noteDeCorde(corde, fr) });
    for (const fr of s.root || []) racinesMarquees.push(noteDeCorde(corde, fr));
  });
  const hors = toutes.filter(n => !attendu.has(n.pc));
  if (hors.length) ko(`${l.id}/${i} scale_pattern « ${b.caption.slice(0,60)} » : notes hors gamme → ${hors.map(n => `c${n.corde} case ${n.fr} (${NOMS_PC[n.pc]})`).join(", ")}`);
  const manquantes = [...attendu].filter(pc => !toutes.some(n => n.pc === pc));
  if (manquantes.length) ko(`${l.id}/${i} scale_pattern « ${b.caption.slice(0,60)} » : note(s) de la gamme absente(s) du schéma → ${manquantes.map(pc => NOMS_PC[pc]).join(", ")}`);
  const fausseRacine = racinesMarquees.filter(pc => pc !== racine);
  if (fausseRacine.length) ko(`${l.id}/${i} scale_pattern : fondamentale marquée sur la mauvaise note → ${fausseRacine.map(pc => NOMS_PC[pc]).join(", ")} au lieu de ${NOMS_PC[racine]}`);
});

// -- 3. Étiquettes de notes sur le manche (fretboard, caged_form, note_grid) --
let etiquettesVerifiees = 0;
function verifierEtiquette(lid, i, corde, fret, label, ou) {
  const dit = pcDeNom(label);
  if (dit == null) return;   // étiquette d'intervalle (R, m3, P5…) ou non reconnue : hors de ce contrôle
  etiquettesVerifiees++;
  const reel = noteDeCorde(corde, fret);
  if (dit !== reel) ko(`${lid}/${i} ${ou} — c${corde} case ${fret} étiquetée « ${label} », en réalité ${NOMS_PC[reel]}`);
}
for (const c of COURSES) for (const l of c.lessons) blocsDe(l).forEach(({ b, i }) => {
  if ((b.type === "fretboard" || b.type === "caged_form") && Array.isArray(b.data?.notes)) {
    for (const n of b.data.notes) verifierEtiquette(l.id, i, n.string, n.fret, n.label, b.type);
  }
  if (b.type === "note_grid" && Array.isArray(b.data?.highlights) && b.data.string) {
    for (const n of b.data.highlights) verifierEtiquette(l.id, i, b.data.string, n.fret, n.label, "note_grid");
  }
  // noteMap des schémas de gammes : clé "case,indexCorde" (index 0 = corde 6).
  // Absent des contrôles d'origine — c'est le même angle mort qui avait
  // laissé passer un Cmaj7 shell cassé deux fois pendant l'audit : la
  // position pouvait être juste pendant que SON ÉTIQUETTE mentait.
  if (b.type === "scale_pattern" && b.data?.noteMap) {
    for (const [cle, label] of Object.entries(b.data.noteMap)) {
      const [fr, idx] = cle.split(",").map(Number);
      verifierEtiquette(l.id, i, 6 - idx, fr, label, "scale_pattern noteMap");
    }
  }
});

// -- 4. Positions « note (corde X case Y) » dans le texte, les quiz et les exercices --
const NOTE_RE = "(Do|Ré|Re|Mi|Fa|Sol|La|Si)(#|b)?";
const MOTIFS_POSITION = [
  new RegExp(`${NOTE_RE}\\s*\\(\\s*(?:corde|c)\\s*(\\d)\\s*,?\\s*case\\s*(\\d+)`, "g"),
  new RegExp(`${NOTE_RE}\\s*\\(\\s*case\\s*(\\d+)\\s*,?\\s*(?:corde|c)\\s*(\\d)`, "g"),
  new RegExp(`${NOTE_RE}\\s+(?:en\\s+)?(?:corde|c)\\s*(\\d)\\s*,?\\s*case\\s*(\\d+)`, "g"),
];
let positionsVerifiees = 0;
function controlerTexte(id, texte) {
  for (const [k, re] of MOTIFS_POSITION.entries()) for (const m of texte.matchAll(re)) {
    let note, alt, corde, fret;
    if (k === 1) [, note, alt, fret, corde] = m; else [, note, alt, corde, fret] = m;
    corde = +corde; fret = +fret;
    if (corde < 1 || corde > 6 || fret < 0 || fret > 24) continue;
    // Faux positif connu : le 3e motif (sans parenthèses) ne distingue pas
    // « La corde 3 case 12 » (l'article « la » + corde) de « La » la note.
    // Les deux premiers motifs, parenthésés, ne posent pas ce problème — une
    // parenthèse juste après « La » signale toujours une position annotée.
    if (k === 2 && note === "La" && !alt) continue;
    positionsVerifiees++;
    const dit = pcDeNom(note + (alt || "")), reel = noteDeCorde(corde, fret);
    if (dit !== reel) ko(`${id} — « ${m[0]} » : corde ${corde} case ${fret} = ${NOMS_PC[reel]}, pas ${note}${alt || ""}`);
  }
}
for (const c of COURSES) for (const l of c.lessons) blocsDe(l).forEach(({ b, i }) => {
  for (const t of [b.text, b.caption]) if (t) controlerTexte(`${l.id}/${i}`, t);
});
for (const q of QUIZ) controlerTexte(q.id, `${q.q} ${(q.o || []).join(" ")} ${q.exp || ""}`);
for (const e of EXERCISES) if (Array.isArray(e.steps)) controlerTexte(e.id, e.steps.join(" "));
// Les conseils de Gropi citent aussi des positions : même contrôle.
for (const c of COURSES) for (const l of c.lessons) if (l.gropiTip) controlerTexte(`${l.id}/gropiTip`, l.gropiTip);
for (const t of GROPI_CATALOGUE) if (typeof t.text === "string") controlerTexte(`gropi:${t.id}`, t.text);

console.log(`  ${diagrammesVerifies} diagramme(s) d'accord, ${gammesVerifiees} schéma(s) de gamme, ${etiquettesVerifiees} étiquette(s) de note, ${positionsVerifiees} position(s) en texte libre — tous RECALCULÉS, pas seulement relus.`);

// ── Leçons en cartes ─────────────────────────────────────────────────────
// Format `cartes` (src/content/README.md, « Leçons en cartes ») : types de
// carte connus, champs requis, réponse dans les bornes, quizId existant,
// structure (une question, un « À toi de jouer », le récap en dernier).
// Les diagrammes des cartes passent aussi par les contrôles musicaux
// ci-dessus (blocsDe). Une idée de plus de 70 mots, un nombre de cartes hors
// 6–10 ou une longue suite d'idées sans question : simple avertissement.
titre("Leçons en cartes");
{
  const quizParId = new Map(QUIZ.map(q => [q.id, q]));
  const enCartes = lecons.filter(l => l.cartes !== undefined);
  let nbCartes = 0, nbAvert = 0;
  for (const l of enCartes) {
    const { erreurs, alertes: avert } = validerCartes(l, quizParId);
    erreurs.forEach(ko);
    for (const a of avert) { nbAvert++; console.log("  ℹ " + a); }
    nbCartes += Array.isArray(l.cartes) ? l.cartes.length : 0;
    for (const c of l.cartes || []) {
      if (c?.quizId && !(l.quiz || []).includes(c.quizId)) console.log(`  ℹ ${l.id} : la carte question ${c.quizId} n'est pas dans le quiz de la leçon`);
    }
  }
  console.log(`  ${enCartes.length} leçon(s) en cartes · ${nbCartes} cartes${nbAvert ? ` · ${nbAvert} avertissement(s)` : ""}`);
}

// ── Questions cadeaux ────────────────────────────────────────────────────
// Bloquant (src/content/README.md, « Questions de quiz ») : une question ne
// donne pas sa réponse. 1) Pas de doigté en 6 caractères (« x02220 ») dans un
// énoncé, sauf DOIGTE_AUTORISE (décoder la notation est la compétence).
// 2) Dans une leçon en cartes, la bonne réponse n'est pas écrite sur la carte
// juste avant la question, sauf REPONSE_PRECEDENTE_AUTORISEE (faux positifs
// justifiés). Les deux listes sont dans src/lecon/cartes.js.
titre("Questions cadeaux");
{
  const erreurs = controlerQuestionsCadeaux(lecons, QUIZ);
  erreurs.forEach(ko);
  if (!erreurs.length) console.log("  aucun doigté dans les énoncés, aucune réponse lue sur la carte précédente");
}

// ── Conseils de Gropi ───────────────────────────────────────────────────
// Intégrité du catalogue (ids uniques, types connus, modules connus) : ça,
// c'est bloquant. Une leçon sans gropiTip, en revanche, n'est qu'un rappel
// (pas une anomalie) : le parcours retombe sur un message générique.
titre("Conseils de Gropi");
{
  const ids = GROPI_CATALOGUE.map(t => t.id);
  const doublons = ids.filter((id, i) => ids.indexOf(id) !== i);
  if (doublons.length) ko(`catalogue Gropi : ids en double → ${[...new Set(doublons)].join(", ")}`);
  const MODULES_OK = new Set(["all", ...COURSES.map(c => c.id)]);
  const idsLecons = new Set(lecons.map(l => l.id));
  for (const t of GROPI_CATALOGUE) {
    if (!["tip", "anecdote", "progress"].includes(t.type)) ko(`gropi:${t.id} : type inconnu « ${t.type} »`);
    for (const m of t.modules || []) if (!MODULES_OK.has(m)) ko(`gropi:${t.id} : module inconnu « ${m} »`);
    for (const l of t.lecons || []) if (!idsLecons.has(l)) ko(`gropi:${t.id} : leçon inconnue « ${l} »`);
  }
  const parType = GROPI_CATALOGUE.reduce((a, t) => ({ ...a, [t.type]: (a[t.type] || 0) + 1 }), {});
  console.log(`  catalogue : ${GROPI_CATALOGUE.length} entrées (${Object.entries(parType).map(([k, v]) => `${k} ${v}`).join(" · ")})`);
  const sansTip = lecons.filter(l => typeof l.gropiTip !== "string" || !l.gropiTip.trim());
  console.log(sansTip.length
    ? `  ℹ ${sansTip.length} leçon(s) sans gropiTip (rappel, non bloquant) : ${sansTip.map(l => l.id).join(", ")}`
    : `  ${lecons.length} leçons, toutes avec un gropiTip`);
}

console.log(alertes === 0 ? "\n✓ Aucune anomalie." : `\n${alertes} anomalie(s) à traiter.`);
process.exit(alertes === 0 ? 0 : 1);
