import { test } from "node:test";
import assert from "node:assert/strict";
import { FAMILLES, genererQuestion, niveauFamille, avantNiveauSuivant, famillesDisponibles, questionsGenereesPour, progressionFamilles, idQuestion } from "../src/store/generateurs.js";
import { COURSES } from "../src/content.js";
import { buildReviewSession, updateReviewHistory } from "../src/store/reviewEngine.js";

// ── Oracle INDÉPENDANT : il relit l'énoncé et recalcule, sans le générateur ──
const LET = ["Do", "Ré", "Mi", "Fa", "Sol", "La", "Si"], NAT = [0, 2, 4, 5, 7, 9, 11];
const EN = { C: 0, D: 1, E: 2, F: 3, G: 4, A: 5, B: 6 };
function lire(n) {                        // "Fa#" → { l: 3, acc: 1, pc: 6 }
  const m = /^(Do|Ré|Mi|Fa|Sol|La|Si)(#{0,2}|b{0,2})$/.exec(n.trim()); if (!m) return null;
  const l = LET.indexOf(m[1]), acc = m[2].startsWith("#") ? m[2].length : -m[2].length;
  return { l, acc, pc: ((NAT[l] + acc) % 12 + 12) % 12 };
}
function lireEn(sym) {                    // "F#m7" → { note, type }
  const m = /^([A-G])(#|b)?(.*)$/.exec(sym); const l = EN[m[1]], acc = m[2] === "#" ? 1 : m[2] === "b" ? -1 : 0;
  return { note: { l, acc, pc: ((NAT[l] + acc) % 12 + 12) % 12 }, type: m[3] };
}
/** Vérifie qu'une note est bien à `num` lettres et `dt` demi-tons de la fondamentale. */
const estA = (n, r, num, dt) => n && n.pc === (r.pc + dt) % 12 && n.l === (r.l + num - 1) % 7;
const OUVERT = { 6: 4, 5: 9, 4: 2, 3: 7, 2: 11, 1: 4 };
const MAJ = [0, 2, 4, 5, 7, 9, 11];
const INTERV = { "seconde majeure": [2, 2], "tierce mineure": [3, 3], "tierce majeure": [3, 4], "quarte juste": [4, 5], "quinte juste": [5, 7], "sixte mineure": [6, 8], "sixte majeure": [6, 9], "septième mineure": [7, 10], "septième majeure": [7, 11] };
const TRIADE = { "majeur": [[3, 4], [5, 7]], "mineur": [[3, 3], [5, 7]], "diminué": [[3, 3], [5, 6]], "augmenté": [[3, 4], [5, 8]] };
const SEPT = { maj7: [[3, 4], [5, 7], [7, 11]], m7: [[3, 3], [5, 7], [7, 10]], "7": [[3, 4], [5, 7], [7, 10]], "m7♭5": [[3, 3], [5, 6], [7, 10]], dim7: [[3, 3], [5, 6], [7, 9]] };
const ARMURE = { "Do": "Aucune altération", "Sol": "1 dièse", "Ré": "2 dièses", "La": "3 dièses", "Mi": "4 dièses", "Si": "5 dièses", "Fa#": "6 dièses", "Fa": "1 bémol", "Sib": "2 bémols", "Mib": "3 bémols", "Lab": "4 bémols", "Réb": "5 bémols" };
const MODE = { dorien: [6, 9], phrygien: [2, 1], lydien: [4, 6], mixolydien: [7, 10] };
const QUAL_DEGRE = ["majeur", "mineur", "mineur", "majeur", "majeur", "mineur", "diminué"];
const NOMS_DEGRES = ["tonique", "sus-tonique", "médiante", "sous-dominante", "dominante", "sus-dominante", "sensible"];

const TONE = { C: 0, "C#": 1, D: 2, "D#": 3, E: 4, F: 5, "F#": 6, G: 7, "G#": 8, A: 9, "A#": 10, B: 11 };
const midi = (t) => { const m = /^([A-G]#?)(-?\d)$/.exec(t); return TONE[m[1]] + 12 * (+m[2] + 1); };
const DT_NOM = { "Seconde majeure": 2, "Tierce mineure": 3, "Tierce majeure": 4, "Quarte juste": 5, "Quinte juste": 7, "Octave": 12 };
const QUAL = { Majeur: [0, 4, 7], Mineur: [0, 3, 7], "Diminué": [0, 3, 6], "Augmenté": [0, 4, 8] };

/** Renvoie null si la question est juste, sinon la raison. */
function verifier(fid, niv, q) {
  const bonne = q.o[q.a]; let m;
  if (fid.startsWith("notes-corde-")) {
    const corde = +fid.slice(-1);
    if ((m = /case (\d+) : quelle note/.exec(q.q))) {
      const cas = +m[1], n = lire(bonne);
      if (n.pc !== (OUVERT[corde] + cas) % 12) return `corde ${corde} case ${cas} ≠ ${bonne}`;
      if (niv === 1 && (cas > 7 || n.acc)) return "niveau 1 hors plage";
      if (niv === 2 && n.acc) return "niveau 2 : dièse";
      return null;
    }
    m = /à quelle case se trouve (\S+) \?/.exec(q.q); const cas = +/Case (\d+)/.exec(bonne)[1];
    if (lire(m[1]).pc !== (OUVERT[corde] + cas) % 12) return `case ${cas} ≠ ${m[1]}`;
    for (const o of q.o) if (o !== bonne && (OUVERT[corde] + +/\d+/.exec(o)[0]) % 12 === lire(m[1]).pc) return "un leurre est aussi juste";
    return null;
  }
  if (fid.startsWith("octaves")) { m = /case (\d+)/.exec(q.q); return bonne === `Case ${+m[1] + 2}` ? null : `octave de case ${m[1]} ≠ ${bonne}`; }
  if (fid === "tons-demi-tons") {
    m = /est (un ton|un demi-ton) (au-dessus de|en dessous de) (\S+) \?/.exec(q.q);
    const d = lire(m[3]), pas = m[1] === "un ton" ? 2 : 1, sens = m[2].startsWith("au") ? 1 : -1, n = lire(bonne);
    if (n.pc !== ((d.pc + sens * pas) % 12 + 12) % 12) return `${m[0]} ≠ ${bonne}`;
    if (pas === 2 && n.l !== (d.l + (sens > 0 ? 1 : 6)) % 7) return "un ton doit changer de lettre";
    if (pas === 1 && n.acc !== 0 && n.l === d.l && Math.sign(n.acc - d.acc) !== sens) return "altération dans le mauvais sens";
    return null;
  }
  if (fid.startsWith("intervalles")) {
    if ((m = /Combien de demi-tons contient une (.+) \?/.exec(q.q))) return +bonne === INTERV[m[1]][1] ? null : `${m[1]} ≠ ${bonne}`;
    m = /Quelle est la (.+) de (\S+) \?/.exec(q.q); const [num, dt] = INTERV[m[1]];
    return estA(lire(bonne), lire(m[2]), num, dt) ? null : `${m[1]} de ${m[2]} ≠ ${bonne}`;
  }
  if (fid === "degres-majeur") {
    m = /Quel est (?:le (\d)e degré|la ([a-zé-]+) \((\d)e degré\)) de (\S+) majeur/.exec(q.q);
    const k = +(m[1] || m[3]) - 1; if (m[2] && NOMS_DEGRES[k] !== m[2]) return "nom de degré faux";
    return estA(lire(bonne), lire(m[4]), k + 1, MAJ[k]) ? null : `degré ${k + 1} de ${m[4]} ≠ ${bonne}`;
  }
  if (fid === "armures") { m = /armure de (\S+) majeur/.exec(q.q); return ARMURE[m[1]] === bonne ? null : `${m[1]} ≠ ${bonne}`; }
  if (fid === "penta-mineure") {
    m = /pentatonique mineure de (\S+) \?/.exec(q.q); const r = lire(m[1]); const set = new Set([0, 3, 5, 7, 10].map(x => (r.pc + x) % 12));
    if (!set.has(lire(bonne).pc)) return `${bonne} hors penta de ${m[1]}`;
    for (const o of q.o) if (o !== bonne && set.has(lire(o).pc)) return `leurre ${o} est dans la penta`;
    return null;
  }
  if (fid === "relative-mineure") { m = /relative mineure de (\S+) majeur/.exec(q.q); return estA(lire(bonne.replace(" mineur", "")), lire(m[1]), 6, 9) ? null : `relative de ${m[1]} ≠ ${bonne}`; }
  if (fid === "triades") {
    m = /notes de (\S+) (majeur|mineur|diminué|augmenté) \?/.exec(q.q); const r = lire(m[1]), ns = bonne.split(" - ").map(lire);
    const ok = ns.length === 3 && ns[0].pc === r.pc && TRIADE[m[2]].every(([k, d], i) => estA(ns[i + 1], r, k, d));
    return ok ? null : `${m[1]} ${m[2]} ≠ ${bonne}`;
  }
  if (fid === "accords-7") {
    m = /notes de (\S+) \(/.exec(q.q); const { note: r, type } = lireEn(m[1]), ns = bonne.split(" - ").map(lire);
    const ok = ns.length === 4 && ns[0].pc === r.pc && ns[0].l === r.l && SEPT[type].every(([k, d], i) => estA(ns[i + 1], r, k, d));
    return ok ? null : `${m[1]} ≠ ${bonne}`;
  }
  if (fid === "guide-tones") {
    m = /guide tones de (\S+) \(/.exec(q.q); const { note: r, type } = lireEn(m[1]); const [t, s] = bonne.split(" et ").map(lire);
    return estA(t, r, 3, SEPT[type][0][1]) && estA(s, r, 7, SEPT[type][2][1]) ? null : `guide tones de ${m[1]} ≠ ${bonne}`;
  }
  if (fid === "accords-de-la-gamme") {
    m = /En (\S+) majeur, quel accord se trouve sur le (\d)e degré/.exec(q.q); const k = +m[2] - 1;
    const [n, qual] = bonne.split(" ");
    return estA(lire(n), lire(m[1]), k + 1, MAJ[k]) && qual === QUAL_DEGRE[k] ? null : `degré ${k + 1} de ${m[1]} ≠ ${bonne}`;
  }
  if (fid.startsWith("mode-")) {
    m = /caractéristique de (\S+) (\S+) \?/.exec(q.q); const [num, dt] = MODE[m[2]];
    return estA(lire(bonne), lire(m[1]), num, dt) ? null : `${m[1]} ${m[2]} ≠ ${bonne}`;
  }
  if (fid === "oreille-hauteur") {
    const [a1, a2] = q.audio.notes.map(midi), d = a2 - a1;
    if (niv === 1) return (bonne === "Plus haute") === (d > 0) && Math.abs(d) >= 5 ? null : `écart ${d} ≠ ${bonne}`;
    const attendu = niv === 2 ? (Math.abs(d) === 1 ? "Un demi-ton" : "Un ton") : `${Math.abs(d) === 1 ? "Demi-ton" : "Ton"} en ${d > 0 ? "montant" : "descendant"}`;
    return [1, 2].includes(Math.abs(d)) && bonne === attendu ? null : `écart ${d} ≠ ${bonne}`;
  }
  if (fid === "oreille-intervalles") { const [a1, a2] = q.audio.notes.map(midi); return a2 - a1 === DT_NOM[bonne] ? null : `${a2 - a1} demi-tons ≠ ${bonne}`; }
  if (fid === "oreille-accords") {
    const ns = q.audio.notes.map(midi), r = ns[0], rel = ns.slice(0, 3).map(n => n - r);
    return JSON.stringify(rel) === JSON.stringify(QUAL[bonne]) && ns[3] - r === 12 ? null : `${rel} ≠ ${bonne}`;
  }
  if (fid === "rythme-dictee") {
    const juste = JSON.stringify(q.grilles[q.a].attaques) === JSON.stringify(q.audio.attaques);
    const autres = q.grilles.filter((_, i) => i !== q.a).map(g => JSON.stringify(g.attaques));
    const distinctes = new Set([...autres, JSON.stringify(q.audio.attaques)]).size === q.grilles.length;
    const pasOk = q.grilles.every(g => g.pas === (niv === 3 ? 4 : 2)) && q.audio.pas === q.grilles[0].pas;
    if (!juste) return "la grille marquée juste ne correspond pas à ce qui est joué";
    if (!distinctes) return "deux grilles sonnent pareil";
    if (!pasOk) return "subdivision incohérente";
    if (niv < 3 && q.audio.attaques.some(i => i >= 8)) return "attaque hors mesure";
    return null;
  }
  if (fid === "oreille-manche") {
    const [a1, a2] = q.audio.notes.map(midi);
    return a1 === 40 && bonne === `Case ${a2 - a1}` ? null : `écart ${a2 - a1} ≠ ${bonne}`;
  }
  if (fid === "oreille-fonctions") {
    const [I, X] = q.audio.accords.map(acc => acc.map(midi));
    const dec = ((X[0] - I[0]) % 12 + 12) % 12, qual = X.slice(0, 3).map(n => n - X[0]).join(",");
    const attendu = { 0: "I (tonique)", 5: "IV (sous-dominante)", 7: "V (dominante)", 9: "vi (relatif mineur)" }[dec];
    const qualOk = dec === 9 ? qual === "0,3,7" : qual === "0,4,7";
    if (I.slice(0, 3).map(n => n - I[0]).join(",") !== "0,4,7") return "l'accord de départ n'est pas une tonique majeure";
    return attendu === bonne && qualOk ? null : `décalage ${dec} (${qual}) ≠ ${bonne}`;
  }
  if (fid === "rythme-binaire-ternaire") return (bonne.startsWith("Ternaire")) === !!q.audio.swing ? null : `swing=${q.audio.swing} ≠ ${bonne}`;
  if (fid === "rythme-lecture-mesure") {
    const positions = [...q.grilleQuestion.attaques].sort((a, b) => a - b);
    // Part de 0 : un silence placé AVANT la première note doit compter, lui
    // aussi — l'ignorer est ce qui a fait planter cette vérification au
    // premier essai, sur un cas où la mesure commence par un silence.
    let dureeTotale = 0, prev = 0;
    for (const p of positions) { dureeTotale += (p - prev) / 4; prev = p; }
    dureeTotale += (16 - prev) / 4;
    if (Math.abs(dureeTotale - 4) > 1e-6) return `la mesure ne fait pas 4 temps (${dureeTotale})`;
    return +bonne === positions.length ? null : `${positions.length} attaque(s) dans la grille ≠ ${bonne}`;
  }
  if (fid === "rythme-sens-du-geste") {
    const m = /position « ([^»]+) »/.exec(q.q); const txt = m[1];
    const temps = /^(\d)$/.exec(txt); let pas;
    if (temps) pas = (+temps[1] - 1) * 4;
    else { const m2 = /^(e|et|a) du (\d)$/.exec(txt); const sub = { e: 1, et: 2, a: 3 }[m2[1]]; pas = (+m2[2] - 1) * 4 + sub; }
    const attendu = pas % 2 === 0 ? "Vers le bas" : "Vers le haut";
    return bonne === attendu ? null : `position ${txt} (pas ${pas}) ≠ ${bonne}`;
  }
  return `famille non couverte par l'oracle : ${fid}`;
}

function rng(graine) { let x = graine >>> 0; return () => ((x = (x * 1664525 + 1013904223) >>> 0) / 2 ** 32); }

test("chaque famille est rattachée à une leçon qui existe vraiment dans le parcours", () => {
  const ids = new Set(COURSES.flatMap(c => c.lessons.map(l => l.id)));
  for (const f of FAMILLES) assert.ok(ids.has(f.lecon), `${f.id} → leçon inconnue ${f.lecon}`);
});

test("toutes les questions générées sont justes (oracle indépendant, 400 par famille et par niveau)", () => {
  const r = rng(42); let total = 0; const erreurs = [];
  for (const f of FAMILLES) for (const niv of [1, 2, 3]) for (let i = 0; i < 400; i++) {
    const q = genererQuestion(f, niv, r);
    assert.ok(q, `${f.id} niveau ${niv} : aucune question produite`);
    assert.ok(q.o.length >= 2 && q.o.length <= 4, `${f.id} : ${q.o.length} options`); assert.equal(new Set(q.o).size, q.o.length, `${f.id} : options en double`);
    if (f.ecoute) assert.ok(q.audio && q.ecoute, `${f.id} : question d'écoute sans description audio`); else assert.ok(!q.audio, `${f.id} : audio inattendu`);
    const raison = verifier(f.id, niv, q); total++;
    if (raison) erreurs.push(`${f.id} niv.${niv} — ${raison} | ${q.q} → ${q.o.join(" / ")}`);
  }
  assert.deepEqual(erreurs.slice(0, 8), [], `${erreurs.length} question(s) fausse(s) sur ${total}`);
});

test("aucun leurre n'a le même son que la bonne réponse (il serait juste lui aussi)", () => {
  const r = rng(7);
  for (const f of FAMILLES) for (const niv of [1, 2, 3]) for (let i = 0; i < 150; i++) {
    const q = genererQuestion(f, niv, r), b = lire(q.o[q.a]); if (!b) continue;
    for (const o of q.o) if (o !== q.o[q.a]) { const x = lire(o); if (x) assert.notEqual(x.pc, b.pc, `${f.id} : ${o} sonne comme ${q.o[q.a]}`); }
  }
});

test("la bonne réponse est répartie sur les 4 positions", () => {
  const r = rng(3), pos = [0, 0, 0, 0];
  for (const f of FAMILLES) for (let i = 0; i < 200; i++) { const q = genererQuestion(f, 2, r); if (q.o.length === 4) pos[q.a]++; }
  const total = pos.reduce((a, b) => a + b, 0);
  for (const p of pos) assert.ok(p / total > 0.2 && p / total < 0.3, `répartition déséquilibrée : ${pos}`);
});

test("rien avant la leçon : une famille n'est proposée qu'une fois sa leçon terminée", () => {
  assert.deepEqual(famillesDisponibles({}), []);
  assert.deepEqual(famillesDisponibles({ "neck-c2-01": "2026-01-01" }).map(f => f.id), ["notes-corde-6", "oreille-manche"]);
  const modes = famillesDisponibles({ "scales-c5-02": "x" }).map(f => f.id);
  assert.deepEqual(modes, ["mode-dorien"], "seul le mode étudié est proposé, pas les autres");
});

test("le niveau d'une famille suit les réussites, et redescend d'un cran après une erreur", () => {
  assert.equal(niveauFamille(undefined), 1);
  assert.equal(niveauFamille({ attempts: 3, successes: 3, streak: 3 }), 2);
  assert.equal(niveauFamille({ attempts: 9, successes: 8, streak: 5 }), 3);
  assert.equal(niveauFamille({ attempts: 10, successes: 8, streak: 0 }), 2, "une erreur fait consolider au niveau inférieur");
  assert.equal(niveauFamille({ attempts: 2, successes: 1, streak: 0 }), 1, "jamais sous le niveau 1");
  assert.equal(avantNiveauSuivant({ successes: 1 }), 2);
  assert.equal(avantNiveauSuivant({ successes: 5 }), 3);
  assert.equal(avantNiveauSuivant({ successes: 9 }), null);
});

test("au niveau 1 de la corde 6, jamais de dièse ni de case au-delà de 7", () => {
  const f = FAMILLES.find(x => x.id === "notes-corde-6"), r = rng(11);
  for (let i = 0; i < 300; i++) { const q = genererQuestion(f, 1, r); assert.ok(!q.q.includes("#") && !q.o.join("").includes("#")); }
});

test("l'identifiant est stable par famille : la révision espacée suit la famille, pas la question", () => {
  const f = FAMILLES[0];
  assert.equal(genererQuestion(f, 1, rng(1)).id, genererQuestion(f, 3, rng(2)).id);
  assert.equal(genererQuestion(f, 1, rng(1)).id, idQuestion(f.id));
});

test("intégration : le moteur de révision existant accepte et programme les questions générées", () => {
  const state = { completedLessons: { "neck-c2-01": "2026-01-01", "scales-c1-05": "2026-01-02" }, reviewHistory: {} };
  const gen = questionsGenereesPour(state, rng(5));
  assert.deepEqual(gen.map(q => q.id).sort(), ["gen:intervalles-simples", "gen:notes-corde-6", "gen:oreille-intervalles", "gen:oreille-manche"],
    "la leçon des intervalles débloque la version écrite ET la version à l'oreille");
  const session = buildReviewSession(gen, {}, state.completedLessons, { targetCount: 6, maxNew: 6 });
  assert.equal(session.questions.length, 4, "les quatre compétences débloquées sont proposées");
  // Une réussite met à jour l'historique de la FAMILLE, qui fait monter son niveau
  let h = {};
  for (let i = 0; i < 3; i++) h = updateReviewHistory(h, idQuestion("notes-corde-6"), true, `2026-02-0${i + 1}`);
  const prog = progressionFamilles({ ...state, reviewHistory: h });
  assert.equal(prog.find(p => p.id === "notes-corde-6").niveau, 2);
  assert.equal(genererQuestion(FAMILLES[0], prog[0].niveau, rng(9)).libelleNiveau, "cases 0 à 12, notes naturelles");
});

test("oreille et rythme : ne se débloquent qu'après leur leçon, et seulement elles", () => {
  const ids = (lecons) => famillesDisponibles(Object.fromEntries(lecons.map(l => [l, "x"]))).map(f => f.id);
  assert.deepEqual(ids(["scales-c1-03"]), ["tons-demi-tons", "oreille-hauteur"]);
  assert.deepEqual(ids(["rhy-c2-04"]), ["rythme-dictee"]);
  assert.deepEqual(ids(["rhy-c2-03"]), ["rythme-binaire-ternaire"]);
  assert.deepEqual(ids(["harm-c2-01"]), ["oreille-accords"], "les accords à l'oreille attendent la leçon sur les 4 types");
});

test("binaire ou ternaire : les deux réponses tombent à peu près autant", () => {
  const f = FAMILLES.find(x => x.id === "rythme-binaire-ternaire"), r = rng(21); let t = 0;
  for (let i = 0; i < 400; i++) t += genererQuestion(f, 1, r).a;
  assert.ok(t > 150 && t < 250, `déséquilibre : ${t}/400 ternaires`);
});

test("« quel accord arrive ? » : jamais le vi avant la leçon sur la progression pop, puis bien présent", () => {
  const f = FAMILLES.find(x => x.id === "oreille-fonctions"), r = rng(31);
  const sansLecon = Array.from({ length: 300 }, () => genererQuestion(f, 3, r, { completedLessons: { "harm-c6-01": "x" } }));
  assert.ok(sansLecon.every(q => !q.o.some(o => o.startsWith("vi"))), "le vi apparaît alors que sa leçon n'est pas faite");
  const avecLecon = Array.from({ length: 300 }, () => genererQuestion(f, 3, r, { completedLessons: { "harm-c6-01": "x", "harm-c6-02": "x" } }));
  assert.ok(avecLecon.some(q => q.o[q.a].startsWith("vi")), "le vi devrait apparaître une fois la leçon faite");
  for (const q of avecLecon) assert.equal(verifier("oreille-fonctions", 3, q), null);
});

test("itemsGeneres : une entrée par compétence débloquée, comptée par le moteur de révision", async () => {
  const { itemsGeneres, domaineDe } = await import("../src/store/generateurs.js");
  const { getReviewStats } = await import("../src/store/reviewEngine.js");
  const lecons = { "neck-c2-01": "x", "rhy-c2-03": "x" };
  const items = itemsGeneres(lecons);
  assert.deepEqual(items.map(i => i.id).sort(), ["gen:notes-corde-6", "gen:oreille-manche", "gen:rythme-binaire-ternaire"]);
  const stats = getReviewStats(items, {}, lecons);
  assert.equal(stats.total ?? items.length, 3);
  assert.deepEqual([...new Set(FAMILLES.map(domaineDe))].sort(), ["Manche", "Oreille", "Rythme", "Théorie"]);
});

test("après une erreur au niveau max : le niveau affiché ET le message restent cohérents", () => {
  const h = { attempts: 12, successes: 9, streak: 0 };
  assert.equal(niveauFamille(h), 2, "on consolide au niveau 2");
  assert.equal(avantNiveauSuivant(h), 1, "une seule réussite pour remonter, pas « niveau max »");
  assert.equal(avantNiveauSuivant({ attempts: 13, successes: 10, streak: 1 }), null, "après la réussite suivante : de nouveau au max");
  assert.equal(avantNiveauSuivant({ attempts: 5, successes: 4, streak: 0 }), 1, "même règle au niveau 2 redescendu au 1");
  assert.equal(avantNiveauSuivant({ attempts: 2, successes: 1, streak: 0 }), 2, "au niveau 1, rien à consolider : il manque 2 réussites");
});

test("lire une mesure : rien avant rhy-c2-01, puis croches et silences débloqués par leur propre leçon", () => {
  const f = FAMILLES.find(x => x.id === "rythme-lecture-mesure"), r = rng(41);
  assert.deepEqual(famillesDisponibles({}).filter(x => x.id === f.id), []);
  for (let i = 0; i < 60; i++) {
    const q = genererQuestion(f, 1, r, { completedLessons: { "rhy-c2-01": "x" } });
    assert.ok(!/croche|silence/i.test(q.exp), `niveau 1 sans les leçons suivantes ne devrait montrer ni croche ni silence : ${q.exp}`);
  }
  let vuCroche = false, vuSilence = false;
  for (let i = 0; i < 80; i++) {
    const q = genererQuestion(f, 3, r, { completedLessons: { "rhy-c2-01": "x", "rhy-c2-02": "x", "rhy-c2-04": "x" } });
    // L'oracle général ne passe jamais de contexte : il ne voit donc jamais
    // ces questions avec silences. Il faut les vérifier ICI, précisément.
    assert.equal(verifier(f.id, 3, q), null, q.q + " → " + q.o[q.a]);
    if (/croche/i.test(q.exp)) vuCroche = true; if (/soupir/i.test(q.exp)) vuSilence = true;
  }
  assert.ok(vuCroche && vuSilence, "une fois les 3 leçons faites, croches et silences doivent apparaître");
});

test("lire une mesure : niveau 3 demandé mais leçon des silences non faite → pas de silence quand même", () => {
  const f = FAMILLES.find(x => x.id === "rythme-lecture-mesure"), r = rng(17);
  for (let i = 0; i < 80; i++) {
    const q = genererQuestion(f, 3, r, { completedLessons: { "rhy-c2-01": "x", "rhy-c2-02": "x" } });
    assert.ok(!/soupir/i.test(q.exp), "la leçon rhy-c2-04 n'est pas faite : aucun silence ne doit apparaître");
  }
});

test("le sens du geste : paire → vers le bas, impaire → vers le haut, sur toutes les positions", () => {
  const f = FAMILLES.find(x => x.id === "rythme-sens-du-geste"), r = rng(23);
  const vues = new Set();
  for (let i = 0; i < 300; i++) {
    const q = genererQuestion(f, 3, r, { completedLessons: { "rhy-c4-01": "x", "rhy-c2-02": "x" } });
    assert.equal(verifier(f.id, 3, q), null);
    vues.add(q.q.match(/« ([^»]+) »/)[1]);
  }
  assert.ok(vues.size >= 10, `assez de positions différentes vues : ${vues.size}`);
});

test("le sens du geste : sans la leçon des doubles-croches, reste sur temps et « et » seulement", () => {
  const f = FAMILLES.find(x => x.id === "rythme-sens-du-geste"), r = rng(9);
  for (let i = 0; i < 60; i++) {
    const q = genererQuestion(f, 3, r, { completedLessons: { "rhy-c4-01": "x" } });
    assert.ok(/^\d$|^et du \d$/.test(q.q.match(/« ([^»]+) »/)[1]), `position inattendue sans la leçon des doubles : ${q.q}`);
  }
});
