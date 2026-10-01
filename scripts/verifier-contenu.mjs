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
import { buildUnits, getUnitQuizPool } from "../src/store/pathEngine.js";
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
for (const c of COURSES) for (const l of c.lessons) (l.content || []).forEach((b, i) => {
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
for (const c of COURSES) for (const l of c.lessons) (l.content || []).forEach((b, i) => {
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
for (const c of COURSES) for (const l of c.lessons) (l.content || []).forEach((b, i) => {
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
for (const c of COURSES) for (const l of c.lessons) (l.content || []).forEach((b, i) => {
  for (const t of [b.text, b.caption]) if (t) controlerTexte(`${l.id}/${i}`, t);
});
for (const q of QUIZ) controlerTexte(q.id, `${q.q} ${(q.o || []).join(" ")} ${q.exp || ""}`);
for (const e of EXERCISES) if (Array.isArray(e.steps)) controlerTexte(e.id, e.steps.join(" "));

console.log(`  ${diagrammesVerifies} diagramme(s) d'accord, ${gammesVerifiees} schéma(s) de gamme, ${etiquettesVerifiees} étiquette(s) de note, ${positionsVerifiees} position(s) en texte libre — tous RECALCULÉS, pas seulement relus.`);

console.log(alertes === 0 ? "\n✓ Aucune anomalie." : `\n${alertes} anomalie(s) à traiter.`);
process.exit(alertes === 0 ? 0 : 1);
