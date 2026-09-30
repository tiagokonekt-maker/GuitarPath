// Groply — store/generateurs.js
// Questions GÉNÉRÉES : des variantes à l'infini, dans toutes les tonalités,
// pour qu'on ne puisse plus apprendre la réponse par cœur — il faut avoir
// compris. Logique pure (aucun React, aucun audio) : testée par node --test.
//
// ── Trois règles de conception ──────────────────────────────────────────
// 1. Rien avant la leçon. Chaque famille déclare la leçon qui l'enseigne
//    (`lecon`) ; elle n'apparaît qu'une fois cette leçon terminée. On ne
//    demande jamais ce qui n'a pas été vu.
// 2. La difficulté suit l'élève. Chaque famille a 3 niveaux (ex. corde 6 :
//    cases 0-7 en notes naturelles → 0-12 → avec les dièses). Le niveau se
//    déduit de l'historique de révision de la famille : il monte avec les
//    réussites, redescend d'un cran après une erreur. Aucune donnée
//    nouvelle à stocker : l'historique existe déjà (reviewEngine).
// 3. Une famille = un identifiant stable (`gen:<famille>`). La révision
//    espacée existante la programme donc comme n'importe quelle question :
//    elle revient au bon moment si tu oublies, s'espace si tu maîtrises.
//
// Les explications ne donnent pas que la réponse : elles montrent le
// raisonnement (compter les cases, empiler les intervalles), pour que
// l'erreur serve à apprendre la méthode.

// ─────────────────────────────────────────────────────────────────────────
// THÉORIE : notes orthographiées (lettre + altération)
// ─────────────────────────────────────────────────────────────────────────
const LETTRES_FR = ["Do", "Ré", "Mi", "Fa", "Sol", "La", "Si"];
const LETTRES_EN = ["C", "D", "E", "F", "G", "A", "B"];
const NATUREL    = [0, 2, 4, 5, 7, 9, 11];   // demi-tons depuis Do

/** Une note = { l: index de lettre (0=Do…6=Si), acc: -2..2 }. */
export const N = (l, acc = 0) => ({ l, acc });
export const pc = (n) => (((NATUREL[n.l] + n.acc) % 12) + 12) % 12;
const suffixe = (acc) => (acc > 0 ? "#".repeat(acc) : "b".repeat(-acc));
export const nom = (n) => LETTRES_FR[n.l] + suffixe(n.acc);
const nomEn = (n) => LETTRES_EN[n.l] + suffixe(n.acc);

/** Note située à `numero` (1 = unisson, 3 = tierce…) et `demiTons` au-dessus. */
export function intervalle(n, numero, demiTons) {
  const l = (n.l + numero - 1) % 7;
  let acc = ((pc(n) + demiTons - NATUREL[l]) % 12 + 12) % 12;
  if (acc > 6) acc -= 12;
  return N(l, acc);
}
const simple = (n) => Math.abs(n.acc) <= 1;   // on évite les doubles altérations

// Fondamentales rangées par difficulté (cycle des quintes : les tonalités
// les plus courantes d'abord, comme dans la leçon sur le cycle).
const RACINES = {
  1: [N(0), N(4), N(3)],                                   // Do, Sol, Fa
  2: [N(0), N(4), N(3), N(1), N(5), N(6, -1), N(2)],       // + Ré, La, Sib, Mi
  3: [N(0), N(4), N(3), N(1), N(5), N(6, -1), N(2), N(2, -1), N(6), N(5, -1), N(3, 1), N(1, -1)], // + Mib, Si, Lab, Fa#, Réb
};

// Intervalles : [nom, numéro, demi-tons]
const INTERVALLES = {
  seconde_maj: ["seconde majeure", 2, 2], tierce_min: ["tierce mineure", 3, 3], tierce_maj: ["tierce majeure", 3, 4],
  quarte: ["quarte juste", 4, 5], quinte: ["quinte juste", 5, 7],
  sixte_min: ["sixte mineure", 6, 8], sixte_maj: ["sixte majeure", 6, 9],
  septieme_min: ["septième mineure", 7, 10], septieme_maj: ["septième majeure", 7, 11],
};

// Accords : [numéro, demi-tons] au-dessus de la fondamentale
const ACCORDS = {
  maj:  { fr: "majeur",  sym: "",     pile: [[3, 4], [5, 7]] },
  min:  { fr: "mineur",  sym: "m",    pile: [[3, 3], [5, 7]] },
  dim:  { fr: "diminué", sym: "dim",  pile: [[3, 3], [5, 6]] },
  aug:  { fr: "augmenté", sym: "aug", pile: [[3, 4], [5, 8]] },
  maj7: { fr: "majeur 7", sym: "maj7", pile: [[3, 4], [5, 7], [7, 11]] },
  m7:   { fr: "mineur 7", sym: "m7",   pile: [[3, 3], [5, 7], [7, 10]] },
  "7":  { fr: "7 (dominante)", sym: "7", pile: [[3, 4], [5, 7], [7, 10]] },
  m7b5: { fr: "demi-diminué", sym: "m7♭5", pile: [[3, 3], [5, 6], [7, 10]] },
  dim7: { fr: "diminué 7", sym: "dim7", pile: [[3, 3], [5, 6], [7, 9]] },
};
export const notesAccord = (r, type) => [r, ...ACCORDS[type].pile.map(([k, d]) => intervalle(r, k, d))];
const symbole = (r, type) => nomEn(r) + ACCORDS[type].sym;
const symboleFr = (r, type) => `${symbole(r, type)} (${nom(r)} ${ACCORDS[type].fr})`;

const GAMME_MAJ = [[1, 0], [2, 2], [3, 4], [4, 5], [5, 7], [6, 9], [7, 11]];
export const gammeMajeure = (r) => GAMME_MAJ.map(([k, d]) => intervalle(r, k, d));
const PENTA_MIN = [[1, 0], [3, 3], [4, 5], [5, 7], [7, 10]];
export const pentaMineure = (r) => PENTA_MIN.map(([k, d]) => intervalle(r, k, d));

// Armures (cycle des quintes)
const ARMURES = { "Do": [0, ""], "Sol": [1, "#"], "Ré": [2, "#"], "La": [3, "#"], "Mi": [4, "#"], "Si": [5, "#"], "Fa#": [6, "#"],
  "Fa": [1, "b"], "Sib": [2, "b"], "Mib": [3, "b"], "Lab": [4, "b"], "Réb": [5, "b"] };

// Manche
const CORDE_MIDI = { 6: 40, 5: 45, 4: 50, 3: 55, 2: 59, 1: 64 };
const NOM_CORDE = { 6: "Mi grave", 5: "La", 4: "Ré", 3: "Sol", 2: "Si", 1: "Mi aigu" };
const NOMS_PC = ["Do", "Do#", "Ré", "Ré#", "Mi", "Fa", "Fa#", "Sol", "Sol#", "La", "La#", "Si"];
export const noteManche = (corde, cas) => NOMS_PC[(CORDE_MIDI[corde] + cas) % 12];
const estNaturelle = (corde, cas) => !noteManche(corde, cas).includes("#");

// ─────────────────────────────────────────────────────────────────────────
// OUTILS DE TIRAGE
// ─────────────────────────────────────────────────────────────────────────
const choisir = (rng, arr) => arr[Math.floor(rng() * arr.length)];
function melanger(rng, arr) { const a = [...arr]; for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(rng() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; }
const RARES = new Set(["Mi#", "Si#", "Fab", "Dob"]);
/** Classe de hauteur d'un nom de note FR (null si ce n'est pas une note). */
function pcDeNom(n) {
  const m = /^(Do|Ré|Mi|Fa|Sol|La|Si)(#{0,2}|b{0,2})$/.exec(n); if (!m) return null;
  const acc = m[2].startsWith("#") ? m[2].length : -m[2].length;
  return ((NATUREL[LETTRES_FR.indexOf(m[1])] + acc) % 12 + 12) % 12;
}
/**
 * QCM : la bonne réponse + 3 leurres DISTINCTS, dans un ordre aléatoire.
 * Quand la réponse est une note, aucun leurre ne peut avoir le même son
 * (sinon il serait juste lui aussi), et les orthographes rares (Mi#, Si#,
 * Fab, Dob) ne servent jamais de piège.
 */
function qcm(rng, bonne, leurresCandidats) {
  const pcBonne = pcDeNom(bonne);
  const leurres = [...new Set(leurresCandidats.filter(x =>
    x !== bonne && !RARES.has(x) && (pcBonne == null || pcDeNom(x) !== pcBonne)))];
  if (leurres.length < 3) return null;   // pas assez de leurres fiables : on retire
  const o = melanger(rng, [bonne, ...melanger(rng, leurres).slice(0, 3)]);
  return { o, a: o.indexOf(bonne) };
}
const liste = (notes) => notes.map(nom).join(" - ");

// ─────────────────────────────────────────────────────────────────────────
// FAMILLES
// Chaque famille : { id, titre, module, lecon (prérequis), niveaux: [libellé
// par niveau], generer(niveau, rng) → { q, o, a, exp } | null }
// ─────────────────────────────────────────────────────────────────────────
/**
 * Explication « méthode » : le chemin par les notes naturelles, depuis la
 * corde à vide (cases 0-7) ou depuis la case 12, l'octave (cases 8-12) —
 * c'est plus court, et c'est le repère enseigné dans les leçons.
 */
function cheminManche(corde, cas) {
  const note = noteManche(corde, cas);
  if (cas === 0) return `À vide, la corde ${corde} donne ${note}.`;
  if (cas === 12) return `La case 12 est l'octave de la corde à vide : ${note}, comme à vide.`;
  const depuis12 = cas >= 8, pas = [];
  if (depuis12) { for (let c = 12; c >= cas; c--) if (estNaturelle(corde, c) || c === cas) pas.push(`${noteManche(corde, c)} (${c})`); }
  else { for (let c = 0; c <= cas; c++) if (estNaturelle(corde, c) || c === cas) pas.push(`${noteManche(corde, c)} (${c})`); }
  const alt = note.includes("#") ? ` Case ${cas} tombe entre deux notes naturelles : c'est ${note}, un demi-ton ${depuis12 ? "sous" : "au-dessus de"} ${noteManche(corde, cas + (depuis12 ? 1 : -1))}.` : "";
  return `${depuis12 ? "Depuis l'octave (case 12)" : "Depuis la corde à vide"}, par les notes naturelles : ${pas.join(" → ")}.${alt}`;
}

function familleCorde(corde, lecon, suffixeId) {
  const plage = { 1: [0, 7, true], 2: [0, 12, true], 3: [0, 12, false] };  // [min, max, naturelles seules]
  return {
    id: `notes-corde-${suffixeId}`, module: "neck", lecon,
    titre: `Notes de la corde ${corde} (${NOM_CORDE[corde]})`,
    niveaux: ["cases 0 à 7, notes naturelles", "cases 0 à 12, notes naturelles", "cases 0 à 12, avec les dièses"],
    generer(niv, rng) {
      const [a, b, nat] = plage[niv];
      const cases = []; for (let c = a; c <= b; c++) if (!nat || estNaturelle(corde, c)) cases.push(c);
      const cas = choisir(rng, cases), bonne = noteManche(corde, cas);
      const chemin = cheminManche(corde, cas);
      // Retrouver une case (niveau 2+) ou nommer une note
      if (niv >= 2 && rng() < 0.5) {
        const positions = cases.filter(c => noteManche(corde, c) === bonne);
        if (positions.length === 1) {
          const r = qcm(rng, `Case ${cas}`, [cas - 1, cas + 1, cas + 2, cas - 2, cas + 3, cas + 5].filter(c => c >= 0 && c <= 12 && noteManche(corde, c) !== bonne).map(c => `Case ${c}`));
          if (r) return { q: `Sur la corde ${corde} (${NOM_CORDE[corde]}), à quelle case se trouve ${bonne} ?`, ...r, exp: chemin };
        }
      }
      const voisins = [cas - 2, cas - 1, cas + 1, cas + 2, cas + 3].filter(c => c >= 0 && c <= 13).map(c => noteManche(corde, c))
        .filter(n => !nat || !n.includes("#"));
      const r = qcm(rng, bonne, [...voisins, ...NOMS_PC.filter(n => !nat || !n.includes("#"))]);
      return r && { q: `Corde ${corde} (${NOM_CORDE[corde]}), case ${cas} : quelle note ?`, ...r, exp: chemin };
    },
  };
}

function familleOctave(depart, arrivee, lecon, id) {
  return {
    id, module: "neck", lecon, titre: `Octaves : corde ${depart} → corde ${arrivee}`,
    niveaux: ["cases 1 à 7", "cases 1 à 10", "cases 1 à 10, en partant de la note"],
    generer(niv, rng) {
      const max = niv === 1 ? 7 : 10, cas = 1 + Math.floor(rng() * max), note = noteManche(depart, cas), bonne = `Case ${cas + 2}`;
      const r = qcm(rng, bonne, [cas, cas + 1, cas + 3, cas - 2, cas + 5, cas - 1].filter(c => c >= 0 && c <= 12).map(c => `Case ${c}`));
      const q = niv === 3 ? `Tu joues ${note} sur la corde ${depart}, case ${cas}. Sur quelle case de la corde ${arrivee} est son octave ?`
                          : `Corde ${depart}, case ${cas}. Où est l'octave, sur la corde ${arrivee} ?`;
      return r && { q, ...r, exp: `Pattern corde ${depart} → corde ${arrivee} : deux cordes plus haut, deux cases plus loin. Case ${cas} → case ${cas + 2} (${note}).` };
    },
  };
}

/**
 * Voisin à un ton ou un demi-ton, orthographié comme dans les leçons :
 * un ton change de lettre (Mi + 1 ton = Fa#) ; un demi-ton tombe sur la
 * note naturelle voisine si elle existe (Mi → Fa), sinon garde la lettre et
 * s'altère — dièse en montant (Do → Do#), bémol en descendant (Ré → Réb).
 */
function voisin(d, pas, sens) {
  const cible = ((pc(d) + sens * pas) % 12 + 12) % 12;
  if (pas === 2) return intervalle(d, sens > 0 ? 2 : 7, sens > 0 ? 2 : 10);
  const lVoisine = (d.l + (sens > 0 ? 1 : 6)) % 7;
  if (NATUREL[lVoisine] === cible) return N(lVoisine, 0);
  return N(d.l, d.acc + sens);
}
const familleTonsDemiTons = {
  id: "tons-demi-tons", module: "scales", lecon: "scales-c1-03", titre: "Tons et demi-tons",
  niveaux: ["au-dessus, depuis une note naturelle", "au-dessus ou en dessous", "depuis une note altérée"],
  generer(niv, rng) {
    const departs = niv === 3 ? RACINES[3].filter(n => n.acc !== 0) : [N(0), N(1), N(2), N(3), N(4), N(5), N(6)];
    const d = choisir(rng, departs), pas = rng() < 0.5 ? 2 : 1, sens = niv >= 2 && rng() < 0.4 ? -1 : 1;
    const r = voisin(d, pas, sens);
    if (!simple(r)) return null;
    const bonne = nom(r);
    const leurres = [voisin(d, 3 - pas, sens), voisin(d, pas, -sens), voisin(d, 3 - pas, -sens), voisin(voisin(d, 2, sens), 1, sens), N(d.l, d.acc)]
      .filter(simple).map(nom);
    const res = qcm(rng, bonne, leurres);
    const qui = `${pas === 2 ? "un ton" : "un demi-ton"} ${sens < 0 ? "en dessous de" : "au-dessus de"} ${nom(d)}`;
    return res && { q: `Quelle note est ${qui} ?`, ...res,
      exp: `${pas === 2 ? "Un ton = 2 demi-tons = 2 cases" : "Un demi-ton = 1 case"}. ${nom(d)} ${sens < 0 ? "−" : "+"} ${pas} demi-ton${pas > 1 ? "s" : ""} = ${bonne}. Rappel : Mi-Fa et Si-Do ne sont séparés que d'un demi-ton.` };
  },
};

function familleIntervalles(id, lecon, titre, cles) {
  return {
    id, module: "scales", lecon, titre,
    niveaux: ["depuis Do, Sol ou Fa", "depuis Do, Sol, Fa, Ré, La, Mi, Sib", "depuis des notes altérées"],
    generer(niv, rng) {
      const cle = choisir(rng, cles), [nomI, num, dt] = INTERVALLES[cle];
      if (niv === 1 && rng() < 0.35) {   // format « combien de demi-tons » au premier niveau
        const res = qcm(rng, String(dt), [dt - 1, dt + 1, dt + 2, dt - 2].filter(x => x > 0).map(String));
        return res && { q: `Combien de demi-tons contient une ${nomI} ?`, ...res, exp: `${nomI[0].toUpperCase() + nomI.slice(1)} = ${dt} demi-tons, soit ${dt} cases sur une même corde.` };
      }
      const r = choisir(rng, RACINES[niv]), c = intervalle(r, num, dt);
      if (!simple(c)) return null;
      const bonne = nom(c);
      const leurres = [intervalle(r, num, dt - 1), intervalle(r, num, dt + 1), intervalle(r, num - 1, dt - 1), intervalle(r, num + 1, dt + 1), intervalle(r, num + 1, dt + 2)].filter(simple).map(nom);
      const res = qcm(rng, bonne, leurres);
      return res && { q: `Quelle est la ${nomI} de ${nom(r)} ?`, ...res,
        exp: `${nomI[0].toUpperCase() + nomI.slice(1)} = ${dt} demi-tons, et la note porte le nom situé ${num - 1} lettre${num > 2 ? "s" : ""} plus loin : ${nom(r)} → ${bonne}.` };
    },
  };
}

const familleDegres = {
  id: "degres-majeur", module: "scales", lecon: "scales-c2-03", titre: "Degrés de la gamme majeure",
  niveaux: ["en Do, Sol, Fa", "7 tonalités", "12 tonalités, avec les noms des degrés"],
  generer(niv, rng) {
    const NOMS = ["tonique", "sus-tonique", "médiante", "sous-dominante", "dominante", "sus-dominante", "sensible"];
    const r = choisir(rng, RACINES[niv]), g = gammeMajeure(r);
    if (!g.every(simple)) return null;
    const k = 1 + Math.floor(rng() * 6), bonne = nom(g[k]);
    const res = qcm(rng, bonne, [...g.filter((_, i) => i !== k).map(nom), nom(intervalle(g[k], 1, 1)), nom(intervalle(g[k], 1, -1))].filter(x => !/(##|bb)/.test(x)));
    const libelle = niv === 3 && rng() < 0.5 ? `la ${NOMS[k]} (${k + 1}e degré)` : `le ${k + 1}e degré`;
    return res && { q: `Quel est ${libelle} de ${nom(r)} majeur ?`, ...res,
      exp: `${nom(r)} majeur : ${liste(g)}. Le ${k + 1}e degré est ${bonne}.` };
  },
};

const familleArmures = {
  id: "armures", module: "scales", lecon: "scales-c2-04", titre: "Armures (cycle des quintes)",
  niveaux: ["Do, Sol, Ré, Fa", "jusqu'à 4 altérations", "toutes les tonalités"],
  generer(niv, rng) {
    const pool = { 1: ["Do", "Sol", "Ré", "Fa"], 2: ["Do", "Sol", "Ré", "La", "Mi", "Fa", "Sib", "Mib", "Lab"], 3: Object.keys(ARMURES) }[niv];
    const t = choisir(rng, pool), [n, s] = ARMURES[t];
    const dire = (k, x) => k === 0 ? "Aucune altération" : `${k} ${x === "#" ? "dièse" : "bémol"}${k > 1 ? "s" : ""}`;
    const bonne = dire(n, s);
    const res = qcm(rng, bonne, [dire(n + 1, s || "#"), dire(Math.max(0, n - 1), s || "b"), dire(n || 1, s === "#" ? "b" : "#"), dire(n + 2, s || "#")]);
    const sens = s === "#" ? `${t} est à ${n} quinte${n > 1 ? "s" : ""} au-dessus de Do : un dièse de plus par quinte` : s === "b" ? `${t} est à ${n} quinte${n > 1 ? "s" : ""} en dessous de Do : un bémol de plus par quinte` : "Do majeur n'a aucune altération";
    return res && { q: `Combien d'altérations à l'armure de ${t} majeur ?`, ...res, exp: `${sens}. Donc : ${bonne.toLowerCase()}.` };
  },
};

const famillePenta = {
  id: "penta-mineure", module: "scales", lecon: "scales-c3-01", titre: "Pentatonique mineure",
  niveaux: ["en La, Mi, Ré", "7 tonalités", "12 tonalités"],
  generer(niv, rng) {
    const pool = { 1: [N(5), N(2), N(1)], 2: [N(5), N(2), N(1), N(4), N(0), N(6), N(3, 1)], 3: RACINES[3].concat([N(5), N(2)]) }[niv];
    const r = choisir(rng, pool), p = pentaMineure(r);
    if (!p.every(simple)) return null;
    const dedans = new Set(p.map(pc));
    const hors = [intervalle(r, 2, 2), intervalle(r, 3, 4), intervalle(r, 6, 8), intervalle(r, 7, 11), intervalle(r, 2, 1), intervalle(r, 6, 9)].filter(n => simple(n) && !dedans.has(pc(n)));
    const cible = choisir(rng, p.slice(1));
    const res = qcm(rng, nom(cible), hors.map(nom));
    return res && { q: `Laquelle de ces notes appartient à la pentatonique mineure de ${nom(r)} ?`, ...res,
      exp: `Penta mineure = 1 - ♭3 - 4 - 5 - ♭7. En ${nom(r)} : ${liste(p)}.` };
  },
};

const familleRelative = {
  id: "relative-mineure", module: "scales", lecon: "scales-c4-01", titre: "Relatives mineures",
  niveaux: ["Do, Sol, Fa", "7 tonalités", "12 tonalités"],
  generer(niv, rng) {
    const r = choisir(rng, RACINES[niv]), rel = intervalle(r, 6, 9);
    if (!simple(rel)) return null;
    const bonne = `${nom(rel)} mineur`;
    const res = qcm(rng, bonne, [intervalle(r, 3, 4), intervalle(r, 5, 7), intervalle(r, 6, 8), intervalle(r, 2, 2), intervalle(r, 4, 5)].filter(simple).map(n => `${nom(n)} mineur`));
    return res && { q: `Quelle est la relative mineure de ${nom(r)} majeur ?`, ...res,
      exp: `La relative mineure est sur le 6e degré (une tierce mineure sous la tonique) : ${nom(r)} → ${nom(rel)}. Mêmes notes, autre point d'appui.` };
  },
};

const familleTriades = {
  id: "triades", module: "harmony", lecon: "harm-c2-02", titre: "Construire une triade",
  niveaux: ["triades majeures, tonalités courantes", "majeures et mineures", "les 4 types, 12 fondamentales"],
  generer(niv, rng) {
    const types = { 1: ["maj"], 2: ["maj", "min"], 3: ["maj", "min", "dim", "aug"] }[niv];
    const t = choisir(rng, types), r = choisir(rng, RACINES[Math.max(2, niv)]), notes = notesAccord(r, t);
    if (!notes.every(simple)) return null;
    const bonne = liste(notes);
    const autres = ["maj", "min", "dim", "aug"].filter(x => x !== t).map(x => notesAccord(r, x)).filter(ns => ns.every(simple)).map(liste);
    const res = qcm(rng, bonne, [...autres, liste([r, intervalle(r, 3, 4), intervalle(r, 5, 6)]), liste([r, intervalle(r, 4, 5), intervalle(r, 5, 7)])]);
    const recette = { maj: "tierce majeure (4 demi-tons) + quinte juste (7)", min: "tierce mineure (3) + quinte juste (7)", dim: "tierce mineure (3) + quinte diminuée (6)", aug: "tierce majeure (4) + quinte augmentée (8)" }[t];
    return res && { q: `Quelles sont les notes de ${nom(r)} ${ACCORDS[t].fr} ?`, ...res,
      exp: `${ACCORDS[t].fr[0].toUpperCase() + ACCORDS[t].fr.slice(1)} = fondamentale + ${recette}. ${nom(r)} → ${bonne}.` };
  },
};

const RECETTE_7 = {
  maj7: "tierce majeure, quinte juste, septième majeure", m7: "tierce mineure, quinte juste, septième mineure",
  "7": "tierce majeure, quinte juste, septième mineure", m7b5: "tierce mineure, quinte diminuée, septième mineure",
  dim7: "tierce mineure, quinte diminuée, septième diminuée",
};
const familleSeptiemes = {
  id: "accords-7", module: "harmony", lecon: "harm-c3-02", titre: "Accords de septième",
  niveaux: ["maj7, m7 et 7", "maj7, m7 et 7, plus de tonalités", "les 5 types"],
  generer(niv, rng) {
    const types = niv < 3 ? ["maj7", "m7", "7"] : ["maj7", "m7", "7", "m7b5", "dim7"];
    const t = choisir(rng, types), r = choisir(rng, RACINES[Math.max(1, niv)]), notes = notesAccord(r, t);
    if (!notes.every(simple)) return null;
    const bonne = liste(notes);
    const autres = ["maj7", "m7", "7", "m7b5"].filter(x => x !== t).map(x => notesAccord(r, x)).filter(ns => ns.every(simple)).map(liste);
    const res = qcm(rng, bonne, [...autres, liste([r, intervalle(r, 3, 4), intervalle(r, 5, 7), intervalle(r, 6, 9)])]);
    return res && { q: `Quelles sont les notes de ${symboleFr(r, t)} ?`, ...res,
      exp: `${symbole(r, t)} = fondamentale + ${RECETTE_7[t]} : ${bonne}.` };
  },
};

const familleGuideTones = {
  id: "guide-tones", module: "harmony", lecon: "harm-c3-03", titre: "Guide tones (3e et 7e)",
  niveaux: ["accords 7", "accords 7, maj7 et m7", "12 fondamentales"],
  generer(niv, rng) {
    const t = niv === 1 ? "7" : choisir(rng, ["7", "maj7", "m7"]), r = choisir(rng, RACINES[niv]), ns = notesAccord(r, t);
    if (!ns.every(simple)) return null;
    const bonne = `${nom(ns[1])} et ${nom(ns[3])}`;
    const res = qcm(rng, bonne, [`${nom(ns[0])} et ${nom(ns[2])}`, `${nom(ns[0])} et ${nom(ns[1])}`, `${nom(ns[2])} et ${nom(ns[3])}`, `${nom(ns[1])} et ${nom(ns[2])}`]);
    return res && { q: `Quelles sont les guide tones de ${symboleFr(r, t)} ?`, ...res,
      exp: `Les guide tones sont la 3e et la 7e : ce sont elles qui disent si l'accord est majeur, mineur ou de dominante. ${symbole(r, t)} = ${liste(ns)} → ${bonne}.` };
  },
};

const familleHarmonisation = {
  id: "accords-de-la-gamme", module: "harmony", lecon: "harm-c5-01", titre: "Accords de la gamme majeure",
  niveaux: ["en Do, Sol, Fa", "7 tonalités", "12 tonalités"],
  generer(niv, rng) {
    const QUAL = ["majeur", "mineur", "mineur", "majeur", "majeur", "mineur", "diminué"];
    const r = choisir(rng, RACINES[niv]), g = gammeMajeure(r);
    if (!g.every(simple)) return null;
    const k = Math.floor(rng() * 7), bonne = `${nom(g[k])} ${QUAL[k]}`;
    const res = qcm(rng, bonne, [`${nom(g[k])} ${QUAL[k] === "majeur" ? "mineur" : "majeur"}`, `${nom(g[(k + 1) % 7])} ${QUAL[(k + 1) % 7]}`, `${nom(g[(k + 6) % 7])} ${QUAL[(k + 6) % 7]}`, `${nom(g[k])} diminué`, `${nom(g[(k + 2) % 7])} ${QUAL[(k + 2) % 7]}`]);
    const ROMAINS = ["I", "ii", "iii", "IV", "V", "vi", "vii°"];
    return res && { q: `En ${nom(r)} majeur, quel accord se trouve sur le ${k + 1}e degré ?`, ...res,
      exp: `Harmonisation de la gamme majeure : I, ii, iii, IV, V, vi, vii°. Le ${k + 1}e degré (${ROMAINS[k]}) de ${nom(r)} majeur est ${bonne}.` };
  },
};

function familleMode(nomMode, lecon, num, dt, descr) {
  return {
    id: `mode-${nomMode}`, module: "scales", lecon, titre: `Note caractéristique : ${nomMode}`,
    niveaux: ["depuis des notes naturelles simples", "7 fondamentales", "12 fondamentales"],
    generer(niv, rng) {
      const r = choisir(rng, RACINES[niv]), c = intervalle(r, num, dt);
      if (!simple(c)) return null;
      const bonne = nom(c);
      const res = qcm(rng, bonne, [intervalle(r, num, dt + (dt % 2 ? 1 : -1)), intervalle(r, num, dt + 1), intervalle(r, num, dt - 1), intervalle(r, 3, 3), intervalle(r, 5, 7)].filter(simple).map(nom));
      return res && { q: `Quelle est la note caractéristique de ${nom(r)} ${nomMode} ?`, ...res,
        exp: `La note caractéristique du ${nomMode} est ${descr}. Depuis ${nom(r)} : ${bonne}.` };
    },
  };
}

// ─────────────────────────────────────────────────────────────────────────
// OREILLE ET RYTHME — questions à écouter
// Chaque question porte `audio` : la description exacte de ce qui sera joué
// (audioEngine.jouerEcoute). Les tests comparent cette description à la
// bonne réponse : ce qu'on entend est forcément ce qui est corrigé.
// ─────────────────────────────────────────────────────────────────────────
const NOMS_TONE = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];
export const midiVersTone = (m) => `${NOMS_TONE[m % 12]}${Math.floor(m / 12) - 1}`;
const nomMidi = (m) => NOMS_PC[m % 12];
const entre = (rng, a, b) => a + Math.floor(rng() * (b - a + 1));

const familleHauteur = {
  id: "oreille-hauteur", module: "scales", lecon: "scales-c1-03", titre: "Oreille : hauteur, ton, demi-ton", ecoute: true,
  niveaux: ["plus haute ou plus basse", "ton ou demi-ton, en montant", "ton ou demi-ton, en montant ou en descendant"],
  generer(niv, rng) {
    const base = entre(rng, 50, 62);
    if (niv === 1) {
      const ecart = entre(rng, 5, 12) * (rng() < 0.5 ? 1 : -1), deux = base + ecart;
      const o = ["Plus haute", "Plus basse"], a = ecart > 0 ? 0 : 1;
      return { q: "Écoute les deux notes. La deuxième est-elle plus haute ou plus basse que la première ?", o, a,
        audio: { type: "intervalle", notes: [midiVersTone(base), midiVersTone(deux)], mode: "ascending" },
        exp: `Tu as entendu ${nomMidi(base)} puis ${nomMidi(deux)} : la deuxième note est ${ecart > 0 ? "plus haute" : "plus basse"}, de ${Math.abs(ecart)} demi-tons.` };
    }
    const pas = rng() < 0.5 ? 1 : 2, sens = niv === 3 && rng() < 0.5 ? -1 : 1, deux = base + sens * pas;
    const o = niv === 2 ? ["Un demi-ton", "Un ton"] : ["Demi-ton en montant", "Ton en montant", "Demi-ton en descendant", "Ton en descendant"];
    const a = niv === 2 ? pas - 1 : (sens > 0 ? 0 : 2) + (pas - 1);
    return { q: niv === 2 ? "Écoute les deux notes. Sont-elles séparées d'un ton ou d'un demi-ton ?" : "Écoute les deux notes. Quel écart, et dans quel sens ?", o, a,
      audio: { type: "intervalle", notes: [midiVersTone(base), midiVersTone(deux)], mode: "ascending" },
      exp: `${nomMidi(base)} puis ${nomMidi(deux)} : ${pas === 1 ? "un demi-ton, les deux notes sont collées (1 case)" : "un ton, il y a une note entre les deux (2 cases)"}${niv === 3 ? `, en ${sens > 0 ? "montant" : "descendant"}` : ""}.` };
  },
};

const familleIntervallesOreille = {
  id: "oreille-intervalles", module: "scales", lecon: "scales-c1-05", titre: "Oreille : intervalles", ecoute: true,
  niveaux: ["tierce majeure, quinte ou octave", "seconde, tierce, quarte ou quinte", "tierce mineure ou majeure, quarte, quinte — parfois jouées ensemble"],
  generer(niv, rng) {
    const choix = {
      1: [["Tierce majeure", 4], ["Quinte juste", 7], ["Octave", 12]],
      2: [["Seconde majeure", 2], ["Tierce majeure", 4], ["Quarte juste", 5], ["Quinte juste", 7]],
      3: [["Tierce mineure", 3], ["Tierce majeure", 4], ["Quarte juste", 5], ["Quinte juste", 7]],
    }[niv];
    const [nomI, dt] = choisir(rng, choix), base = entre(rng, 45, 57), ensemble = niv === 3 && rng() < 0.4;
    const o = melanger(rng, choix.map(c => c[0]));
    return { q: ensemble ? "Écoute les deux notes jouées ensemble. Quel intervalle ?" : "Écoute les deux notes. Quel intervalle entends-tu ?", o, a: o.indexOf(nomI),
      audio: { type: "intervalle", notes: [midiVersTone(base), midiVersTone(base + dt)], mode: ensemble ? "harmonic" : "ascending" },
      exp: `C'était une ${nomI.toLowerCase()} : ${dt} demi-tons, de ${nomMidi(base)} à ${nomMidi(base + dt)}.` };
  },
};

const QUALITES = { maj: ["Majeur", [0, 4, 7]], min: ["Mineur", [0, 3, 7]], dim: ["Diminué", [0, 3, 6]], aug: ["Augmenté", [0, 4, 8]] };
const familleQualiteOreille = {
  id: "oreille-accords", module: "harmony", lecon: "harm-c2-01", titre: "Oreille : qualité d'accord", ecoute: true,
  niveaux: ["majeur ou mineur", "les 4 types de triades", "les 4 types, parfois arpégés"],
  generer(niv, rng) {
    const types = niv === 1 ? ["maj", "min"] : ["maj", "min", "dim", "aug"];
    const t = choisir(rng, types), racine = entre(rng, 48, 55), arpege = niv === 3 && rng() < 0.5;
    const notes = [...QUALITES[t][1], 12].map(i => racine + i);
    const o = types.map(x => QUALITES[x][0]);
    const couleur = { maj: "tierce majeure : le son le plus stable et lumineux", min: "tierce mineure : plus sombre", dim: "tierce mineure et quinte diminuée : tendu, instable", aug: "tierce majeure et quinte augmentée : suspendu, étrange" }[t];
    return { q: arpege ? "Écoute l'accord joué note à note. Quelle qualité ?" : "Écoute l'accord. Quelle qualité ?", o, a: o.indexOf(QUALITES[t][0]),
      audio: { type: "accord", notes: notes.map(midiVersTone), arpege },
      exp: `${QUALITES[t][0]} (${couleur}). Notes : ${notes.slice(0, 3).map(nomMidi).join(" - ")}.` };
  },
};

// Figures rythmiques par temps : [nom lisible, cases qui sonnent]
const FIGURES = {
  2: { noire: ["noire", [0]], croches: ["2 croches", [0, 1]], silence: ["silence", []], contretemps: ["silence + croche", [1]] },
  4: { noire: ["noire", [0]], croches: ["2 croches", [0, 2]], doubles: ["4 doubles", [0, 1, 2, 3]], croche2d: ["croche + 2 doubles", [0, 2, 3]], deuxdcroche: ["2 doubles + croche", [0, 1, 2]] },
};
const familleDictee = {
  id: "rythme-dictee", module: "rhythm", lecon: "rhy-c2-04", titre: "Rythme : dictée", ecoute: true,
  niveaux: ["noires et croches", "noires, croches et silences", "avec des doubles-croches"],
  generer(niv, rng) {
    const pas = niv === 3 ? 4 : 2;
    const permises = niv === 1 ? ["noire", "croches"] : niv === 2 ? ["noire", "croches", "silence", "contretemps"] : ["noire", "croches", "doubles", "croche2d", "deuxdcroche"];
    const tirer = () => { const m = Array.from({ length: 4 }, () => choisir(rng, permises)); if (niv === 2 || niv === 1) m[0] = choisir(rng, ["noire", "croches"]); return m; };
    const mesure = tirer();
    const cle = (m) => m.join(",");
    const variantes = new Map([[cle(mesure), mesure]]);
    for (let essai = 0; essai < 60 && variantes.size < 4; essai++) {   // leurres : 1 ou 2 temps changés
      const v = [...mesure]; const nb = rng() < 0.6 ? 1 : 2;
      for (let k = 0; k < nb; k++) { const i = niv <= 2 ? entre(rng, 1, 3) : entre(rng, 0, 3); v[i] = choisir(rng, permises.filter(f => f !== v[i])); }
      variantes.set(cle(v), v);
    }
    if (variantes.size < 4) return null;
    const mesures = melanger(rng, [...variantes.values()]);
    const attaques = (m) => m.flatMap((f, t) => FIGURES[pas][f][1].map(c => t * pas + c));
    const decrire = (m) => m.map(f => FIGURES[pas][f][0]).join(" · ");
    return { q: "Écoute la mesure (après le décompte). Quelle grille correspond ?", o: mesures.map(decrire), a: mesures.findIndex(m => cle(m) === cle(mesure)),
      grilles: mesures.map(m => ({ pas, attaques: attaques(m) })),
      audio: { type: "rythme", bpm: niv === 3 ? 66 : 76, pas, attaques: attaques(mesure) },
      exp: `Tu as entendu : ${decrire(mesure)}. Astuce : compte « 1 et 2 et 3 et 4 et » à voix haute pendant l'écoute.` };
  },
};

const familleBinaire = {
  id: "rythme-binaire-ternaire", module: "rhythm", lecon: "rhy-c2-03", titre: "Rythme : binaire ou ternaire", ecoute: true,
  niveaux: ["croches continues, tempo lent", "croches continues, tempo plus rapide", "avec des silences"],
  generer(niv, rng) {
    const swing = rng() < 0.5, bpm = niv === 1 ? 80 : entre(rng, 96, 116);
    let attaques = [0, 1, 2, 3, 4, 5, 6, 7];
    if (niv === 3) attaques = attaques.filter(i => i % 2 === 0 || rng() < 0.6);   // on garde les temps, on retire des croches
    const o = ["Binaire (croches égales)", "Ternaire (longue-courte, shuffle)"];
    return { q: "Écoute la mesure. Binaire ou ternaire ?", o, a: swing ? 1 : 0,
      audio: { type: "rythme", bpm, pas: 2, attaques, swing },
      exp: swing ? "Ternaire : chaque temps est divisé en trois, et on joue la 1re et la 3e partie. Ça balance : longue, courte." : "Binaire : chaque temps est coupé en deux moitiés égales. C'est régulier, droit." };
  },
};

const familleOreilleManche = {
  id: "oreille-manche", module: "neck", lecon: "neck-c2-01", titre: "Oreille : retrouver la note sur la corde 6", ecoute: true,
  niveaux: ["cases 3, 5, 7 ou 12", "notes naturelles, cases 1 à 12", "toutes les cases, voisines proches"],
  generer(niv, rng) {
    const pool = { 1: [3, 5, 7, 12], 2: [1, 3, 5, 7, 8, 10, 12], 3: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12] }[niv];
    const cas = choisir(rng, pool);
    const leurres = niv === 3 ? [cas - 2, cas - 1, cas + 1, cas + 2].filter(c => c >= 1 && c <= 12) : pool;
    const nb = niv === 1 ? 3 : 4;
    const autres = melanger(rng, leurres.filter(c => c !== cas)).slice(0, nb - 1);
    if (autres.length < nb - 1) return null;
    const o = melanger(rng, [cas, ...autres]).map(c => `Case ${c}`);
    return { q: "Tu entends la corde 6 à vide, puis une note de la même corde. À quelle case est-elle ?", o, a: o.indexOf(`Case ${cas}`),
      audio: { type: "intervalle", notes: [midiVersTone(40), midiVersTone(40 + cas)], mode: "ascending" },
      exp: `La corde à vide sonne Mi. La note entendue est ${noteManche(6, cas)}, ${cas} demi-tons plus haut : case ${cas}.${cas === 12 ? " C'est l'octave : la même note, plus aiguë." : ""}` };
  },
};

const DEGRES_ACCORDS = { I: [0, [0, 4, 7], "I (tonique)"], IV: [5, [0, 4, 7], "IV (sous-dominante)"], V: [7, [0, 4, 7], "V (dominante)"], vi: [9, [0, 3, 7], "vi (relatif mineur)"] };
const familleFonctions = {
  id: "oreille-fonctions", module: "harmony", lecon: "harm-c6-01", titre: "Oreille : quel accord arrive ?", ecoute: true,
  niveaux: ["IV ou V", "I, IV ou V", "dans une tonalité différente à chaque fois"],
  generer(niv, rng, contexte) {
    // Le vi n'est proposé qu'une fois la progression pop (I-V-vi-IV) étudiée :
    // le niveau ne garantit pas à lui seul que la leçon a été vue.
    const avecVi = niv === 3 && !!contexte?.completedLessons?.["harm-c6-02"];
    const choix = niv === 1 ? ["IV", "V"] : avecVi ? ["I", "IV", "V", "vi"] : ["I", "IV", "V"];
    const d = choisir(rng, choix), tonique = niv === 3 ? entre(rng, 45, 55) : choisir(rng, [48, 50, 52]);
    const accord = (deg) => { const [dec, pile] = DEGRES_ACCORDS[deg]; return [...pile, 12].map(i => tonique + dec + i); };
    const o = choix.map(k => DEGRES_ACCORDS[k][2]);
    const nomT = NOMS_PC[tonique % 12];
    const pourquoi = { I: "c'était encore la tonique : aucun mouvement", IV: "le IV s'éloigne de la tonique en douceur, sans tension", V: "le V crée une tension qui appelle le retour à la tonique", vi: "le vi est mineur : même famille que le I, en plus sombre" }[d];
    return { q: "Écoute : d'abord l'accord I (la tonique), puis un autre accord. Lequel ?", o, a: o.indexOf(DEGRES_ACCORDS[d][2]),
      audio: { type: "suite", accords: [accord("I").map(midiVersTone), accord(d).map(midiVersTone)] },
      exp: `C'était le ${DEGRES_ACCORDS[d][2]} : ${pourquoi}. Ici, en ${nomT} majeur.` };
  },
};

export const FAMILLES = [
  familleCorde(6, "neck-c2-01", "6"),
  familleCorde(5, "neck-c2-02", "5"),
  familleCorde(4, "neck-c2-03", "4"),
  familleCorde(3, "neck-c2-04", "3"),
  familleCorde(2, "neck-c2-05", "2"),
  familleCorde(1, "neck-c2-05", "1"),
  familleTonsDemiTons,
  familleIntervalles("intervalles-simples", "scales-c1-05", "Intervalles : seconde, tierce, quarte, quinte", ["seconde_maj", "tierce_min", "tierce_maj", "quarte", "quinte"]),
  familleIntervalles("intervalles-complets", "scales-c1-06", "Intervalles : sixte et septième", ["sixte_min", "sixte_maj", "septieme_min", "septieme_maj"]),
  familleOctave(6, 4, "neck-c3-01", "octaves-6-4"),
  familleOctave(5, 3, "neck-c3-02", "octaves-5-3"),
  familleDegres,
  familleTriades,
  familleArmures,
  famillePenta,
  familleRelative,
  familleSeptiemes,
  familleGuideTones,
  familleHarmonisation,
  familleMode("dorien", "scales-c5-02", 6, 9, "la sixte majeure"),
  familleMode("phrygien", "scales-c5-03", 2, 1, "la seconde mineure (♭2)"),
  familleMode("lydien", "scales-c5-04", 4, 6, "la quarte augmentée (#4)"),
  familleMode("mixolydien", "scales-c5-05", 7, 10, "la septième mineure (♭7)"),
  familleHauteur,
  familleIntervallesOreille,
  familleQualiteOreille,
  familleDictee,
  familleBinaire,
  familleOreilleManche,
  familleFonctions,
];
const PAR_ID = new Map(FAMILLES.map(f => [f.id, f]));
export const idQuestion = (familleId) => `gen:${familleId}`;
export const familleDe = (questionId) => PAR_ID.get(String(questionId).replace(/^gen:/, "")) || null;

// ─────────────────────────────────────────────────────────────────────────
// ADAPTATION
// ─────────────────────────────────────────────────────────────────────────
/**
 * Niveau d'une famille (1 à 3), déduit de son historique de révision :
 * 3 réussites → niveau 2, 8 réussites → niveau 3. Une erreur à la dernière
 * réponse fait redescendre d'un cran : on consolide avant de remonter.
 * Règle volontairement simple, pour pouvoir l'expliquer à l'élève.
 */
export function niveauFamille(historique) {
  const h = historique || {};
  const reussites = h.successes || 0;
  let n = reussites >= 8 ? 3 : reussites >= 3 ? 2 : 1;
  if ((h.attempts || 0) > 0 && (h.streak || 0) === 0) n = Math.max(1, n - 1);
  return n;
}
/** Réussites qui manquent pour atteindre le niveau suivant (null au niveau max). */
export function avantNiveauSuivant(historique) {
  const r = historique?.successes || 0;
  return r >= 8 ? null : r >= 3 ? 8 - r : 3 - r;
}

/** Familles débloquées : celles dont la leçon est terminée. */
export const famillesDisponibles = (completedLessons) => FAMILLES.filter(f => completedLessons?.[f.lecon]);

/**
 * Une question de la famille, au niveau de l'élève. Plusieurs tentatives :
 * un tirage peut être rejeté (double altération, pas assez de leurres
 * fiables) plutôt que de produire une question bancale.
 */
export function genererQuestion(famille, niveau, rng = Math.random, contexte = null) {
  for (let essai = 0; essai < 25; essai++) {
    const q = famille.generer(niveau, rng, contexte);
    if (q && q.o.length >= 2 && new Set(q.o).size === q.o.length && q.a >= 0 && q.a < q.o.length) {
      return {
        ...q,
        id: idQuestion(famille.id),
        courseId: famille.module,
        lessonId: famille.lecon,
        lvl: niveau,
        xp: 20 + 10 * niveau,
        genere: true,
        famille: famille.titre,
        niveauFamille: niveau,
        libelleNiveau: famille.niveaux[niveau - 1],
        ecoute: !!famille.ecoute,
      };
    }
  }
  return null;
}

/**
 * Une instance par famille débloquée, au niveau de l'élève : à mêler au
 * vivier de la révision. Le moteur de révision choisit ensuite, comme pour
 * les questions écrites, ce qui est dû ou nouveau.
 */
export function questionsGenereesPour(state, rng = Math.random) {
  const hist = state?.reviewHistory || {};
  return famillesDisponibles(state?.completedLessons)
    .map(f => genererQuestion(f, niveauFamille(hist[idQuestion(f.id)]), rng, { completedLessons: state?.completedLessons }))
    .filter(Boolean);
}

/**
 * Les compétences débloquées, sous forme d'éléments légers ({ id, lessonId })
 * — sans générer de question. Permet au moteur de révision de compter ce qui
 * est dû ou nouveau (getReviewStats), par exemple pour la recommandation.
 */
export const itemsGeneres = (completedLessons) =>
  famillesDisponibles(completedLessons).map(f => ({ id: idQuestion(f.id), lessonId: f.lecon }));

/** Domaine d'affichage d'une compétence. */
export const domaineDe = (f) => f.module === "rhythm" ? "Rythme" : f.ecoute ? "Oreille" : f.module === "neck" ? "Manche" : "Théorie";

/** Vue d'ensemble pour l'écran de progression : famille, niveau, ce qui reste. */
export function progressionFamilles(state) {
  const hist = state?.reviewHistory || {};
  return famillesDisponibles(state?.completedLessons).map(f => {
    const h = hist[idQuestion(f.id)];
    const niveau = niveauFamille(h);
    return { id: f.id, titre: f.titre, module: f.module, domaine: domaineDe(f), niveau, libelle: f.niveaux[niveau - 1], restant: avantNiveauSuivant(h), commencee: !!h, derniereFois: h?.lastSeen || null };
  });
}
