// Groply — src/music/orthographe.js
// ORTHOGRAPHE DES NOTES : écrire chaque note comme un musicien l'écrirait
// dans sa tonalité — Sib en Fa majeur (et non La#), Mib-Solb-Sib pour Mib m,
// Solb comme note bleue du blues en Do.
//
// ── Pourquoi un module à part ─────────────────────────────────────────────
// Toute la logique interne (fretboardUtils, audio, quiz, progression
// stockée) travaille en CLASSES DE HAUTEUR écrites en dièses : "A#" et "Bb"
// y sont la même chose, et c'est voulu — comparer, chercher une case, nommer
// un échantillon n'a pas besoin d'orthographe. Mais montrer « La# » à un
// élève qui joue en Fa majeur lui enseigne une faute. Ce module ne sert donc
// QU'À L'AFFICHAGE : il prend une fondamentale et une structure (gamme ou
// accord, en intervalles) et rend des noms orthographiés. Il ne change
// aucune classe de hauteur (vérifié par test/orthographe.test.mjs).
//
// ── Les trois règles ─────────────────────────────────────────────────────
// 1. Une note = une LETTRE + une altération. Dans une gamme de 7 notes,
//    chaque degré prend la lettre suivante (Fa Sol La Sib Do Ré Mi : jamais
//    deux La). Ailleurs (pentatoniques, blues, accords), la lettre vient du
//    NUMÉRO de l'intervalle : la tierce mineure est une tierce (Do → Mib,
//    pas Ré#), la quinte diminuée une quinte (note bleue Do → Solb, La → Mib).
// 2. La fondamentale est choisie entre ses deux écritures (Do#/Réb…) pour
//    que l'ensemble porte le MOINS d'altérations, sans double altération :
//    Réb majeur (5 bémols) plutôt que Do# (7 dièses), mais Do# m (4 dièses)
//    plutôt que Réb m (8 bémols). À égalité (Fa#/Solb, Mib m/Ré# m), la
//    tonalité usuelle l'emporte : Fa#, Mib m.
// 3. Les doubles altérations (Sibb de Do dim7, Fa## de Sol# majeur)
//    sont justes en théorie mais illisibles sur une pastille de 26 px. Les
//    fonctions d'AFFICHAGE (`noms*`, `carteNoms`) les remplacent par leur
//    enharmonique simple (Sibb → La) ; les fonctions `epeler*` rendent
//    l'orthographe théorique brute pour qui veut l'enseigner (le contenu des
//    leçons écrit déjà 𝄫 là où il l'enseigne).
// 4. Dob, Fab, Mi#, Si# (altération d'une note dont l'enharmonique est
//    NATURELLE) ne sont gardés que là où la théorie les impose : gammes
//    heptatoniques (Solb majeur → Dob, Do# majeur → Mi#, Si#) et accords
//    (Lab m = Lab-Dob-Mib). Hors gamme heptatonique (pentatoniques, blues,
//    tons entiers…) et pour une note chromatique placée dans une tonalité
//    (nomDansTonalite), l'affichage prend la note naturelle : Fa blues =
//    Fa Lab Sib Si Do Mib, et non … Dob …

import { LETTRES_FR, LETTRES_EN, NATUREL, NOTES_DIESES_EN } from "./notes.js";
import { SCALES, CHORD_TYPES } from "../fretboardUtils.js";

// ─────────────────────────────────────────────────────────────────────────
// NOTE ORTHOGRAPHIÉE : { l: lettre (0 = Do … 6 = Si), acc: -2..2 }
// ─────────────────────────────────────────────────────────────────────────
export const note = (l, acc = 0) => ({ l, acc });
/** Classe de hauteur (0-11) d'une note orthographiée. */
export const pcDe = (n) => (((NATUREL[n.l] + n.acc) % 12) + 12) % 12;
const suffixe = (acc) => (acc > 0 ? "#".repeat(acc) : "b".repeat(-acc));
/** "Sib", "Fa#", "Sibb". */
export const nomFr = (n) => LETTRES_FR[n.l] + suffixe(n.acc);
/** "Bb", "F#", "Bbb". */
export const nomEn = (n) => LETTRES_EN[n.l] + suffixe(n.acc);
const nomEnLangue = (n, langue) => (langue === "en" ? nomEn(n) : nomFr(n));

/** Note à `numero` (1 = unisson, 3 = tierce, 9 = neuvième…) et `demiTons` au-dessus de `n`. */
export function intervalle(n, numero, demiTons) {
  const l = (n.l + numero - 1) % 7;
  let acc = ((pcDe(n) + demiTons - NATUREL[l]) % 12 + 12) % 12;
  if (acc > 6) acc -= 12;
  return note(l, acc);
}

/**
 * Remplace une double altération par son enharmonique simple : la note
 * naturelle si elle existe (Sibb → La, Fa## → Sol), sinon l'altération
 * simple dans le même sens (Mi## → Fa#). Ne touche pas aux autres notes.
 */
export function simplifier(n) {
  if (Math.abs(n.acc) < 2) return n;
  const pc = pcDe(n);
  const nat = NATUREL.indexOf(pc);
  if (nat !== -1) return note(nat);
  return n.acc > 0 ? note(NATUREL.indexOf(pc - 1), 1) : note(NATUREL.indexOf((pc + 1) % 12), -1);
}

const LETTRE_EN = { C: 0, D: 1, E: 2, F: 3, G: 4, A: 5, B: 6 };
const LETTRE_FR = { Do: 0, "Ré": 1, Re: 1, Mi: 2, Fa: 3, Sol: 4, La: 5, Si: 6 };
/**
 * Lit un nom de note, anglais ou français, avec ou sans octave :
 * "Bb", "A#3", "Sib", "Ré#", "Re", "Fa##" → { l, acc } (null si illisible).
 */
export function lireNote(nom) {
  if (nom && typeof nom === "object" && Number.isInteger(nom.l)) return nom;
  const s = String(nom ?? "").trim().replace(/♯/g, "#").replace(/♭/g, "b");
  const m = /^(Do|Ré|Re|Mi|Fa|Sol|La|Si|[A-G])(#{1,2}|b{1,2})?(-?\d+)?$/.exec(s);
  if (!m) return null;
  const l = m[1].length === 1 ? LETTRE_EN[m[1]] : LETTRE_FR[m[1]];
  const alt = m[2] || "";
  return note(l, alt.startsWith("#") ? alt.length : alt ? -alt.length : 0);
}
/** Classe de hauteur d'un nom quelconque ("Bb", "Sib", "A#3"…), ou null. */
export const pcDeNom = (nom) => { const n = lireNote(nom); return n ? pcDe(n) : null; };

// ─────────────────────────────────────────────────────────────────────────
// DEGRÉS : quelle LETTRE pour quel intervalle
// ─────────────────────────────────────────────────────────────────────────
// Numéro d'intervalle par défaut pour un écart en demi-tons (règle 1). Les
// altérés suivent l'usage des grilles : b9, #9, #11, 13.
const NUMERO_PAR_DEFAUT = {
  0: 1, 1: 2, 2: 2, 3: 3, 4: 3, 5: 4, 6: 5, 7: 5, 8: 5, 9: 6, 10: 7, 11: 7,
  12: 1, 13: 2, 14: 2, 15: 2, 16: 3, 17: 4, 18: 4, 19: 5, 20: 6, 21: 6,
};
// Hors accord (gammes non heptatoniques, notes chromatiques dans une
// tonalité), la sixte mineure est une sixte (Lab en Do), pas une quinte
// augmentée : c'est la seule différence avec les accords, où 8 demi-tons
// sont le #5 de l'accord augmenté.
const NUMERO_GAMME = { ...NUMERO_PAR_DEFAUT, 8: 6 };
// Exceptions par type d'accord : la 7e diminuée est une SEPTIÈME (Do dim7 =
// Do-Mib-Solb-Sibb), pas une sixte.
const NUMEROS_ACCORD = { dim7: [1, 3, 5, 7] };
// Gamme par tons : Do Ré Mi Fa# Sol# Sib (usage le plus courant), plutôt
// que Do Ré Mi Solb Lab Sib que donnerait la règle par défaut.
const NUMEROS_GAMME = { whole_tone: [1, 2, 3, 4, 5, 7] };

/** Numéros d'intervalle d'une gamme (règle 1). */
export function numerosGamme(intervalles, scaleKey) {
  if (scaleKey && NUMEROS_GAMME[scaleKey]) return NUMEROS_GAMME[scaleKey];
  if (intervalles.length === 7) return intervalles.map((_, i) => i + 1);
  return intervalles.map(i => NUMERO_GAMME[i % 12]);
}
/** Numéros d'intervalle d'un accord (règle 1). */
export function numerosAccord(intervalles, chordKey) {
  if (chordKey && NUMEROS_ACCORD[chordKey]) return NUMEROS_ACCORD[chordKey];
  return intervalles.map(i => NUMERO_PAR_DEFAUT[i] ?? NUMERO_PAR_DEFAUT[i % 12]);
}

/** Écrit les notes d'une structure depuis une fondamentale orthographiée. */
export const epelerDepuis = (racine, intervalles, numeros) =>
  intervalles.map((dt, i) => intervalle(racine, numeros[i], dt));

// ─────────────────────────────────────────────────────────────────────────
// CHOIX DE LA FONDAMENTALE (règle 2)
// ─────────────────────────────────────────────────────────────────────────
// Départage des égalités : la tonalité usuelle, selon la couleur.
const USUELLE_MAJEURE = [note(0), note(1, -1), note(1), note(2, -1), note(2), note(3), note(3, 1), note(4), note(5, -1), note(5), note(6, -1), note(6)];
const USUELLE_MINEURE = [note(0), note(0, 1), note(1), note(2, -1), note(2), note(3), note(3, 1), note(4), note(4, 1), note(5), note(6, -1), note(6)];
/** Une structure est « mineure » si elle a une tierce mineure et pas de majeure. */
const estMineure = (intervalles) => {
  const r = intervalles.map(i => i % 12);
  return r.includes(3) && !r.includes(4);
};
/** Les écritures candidates d'une classe de hauteur : la naturelle, sinon dièse et bémol. */
function candidats(pc) {
  const nat = NATUREL.indexOf(pc);
  if (nat !== -1) return [note(nat)];
  return [note(NATUREL.indexOf(pc - 1), 1), note(NATUREL.indexOf((pc + 1) % 12), -1)];
}
const cout = (notes) => notes.reduce((s, n) => s + (Math.abs(n.acc) >= 2 ? 10 : Math.abs(n.acc)), 0);

/**
 * Fondamentale orthographiée pour une structure donnée.
 * @param racine     nom quelconque ("A#", "Bb", "Sib") ou classe de hauteur
 * @param intervalles intervalles de la structure
 * @param numeros    numéros d'intervalle (lettres) de la structure
 */
export function choisirRacine(racine, intervalles, numeros) {
  const pc = typeof racine === "number" ? ((racine % 12) + 12) % 12 : pcDeNom(racine);
  if (pc == null) return null;
  const options = candidats(pc);
  if (options.length === 1) return options[0];
  const usuelle = (estMineure(intervalles) ? USUELLE_MINEURE : USUELLE_MAJEURE)[pc];
  let meilleure = null, meilleurCout = Infinity;
  for (const r of options) {
    const c = cout(epelerDepuis(r, intervalles, numeros));
    const egal = c === meilleurCout;
    if (c < meilleurCout || (egal && r.l === usuelle.l && r.acc === usuelle.acc)) {
      meilleure = r; meilleurCout = c;
    }
  }
  return meilleure;
}

// ─────────────────────────────────────────────────────────────────────────
// GAMMES ET ACCORDS — orthographe théorique brute
// ─────────────────────────────────────────────────────────────────────────
const structureGamme = (gamme) => {
  const intervalles = Array.isArray(gamme) ? gamme : SCALES[gamme]?.intervals;
  if (!intervalles) return null;
  return { intervalles, numeros: numerosGamme(intervalles, Array.isArray(gamme) ? null : gamme) };
};
const structureAccord = (accord) => {
  const intervalles = Array.isArray(accord) ? accord : CHORD_TYPES[accord]?.intervals;
  if (!intervalles) return null;
  return { intervalles, numeros: numerosAccord(intervalles, Array.isArray(accord) ? null : accord) };
};

/**
 * Notes orthographiées d'une gamme : epelerGamme("A#", "major") → Sib Do Ré Mib Fa Sol La.
 * `racine` peut être une note déjà orthographiée ({l, acc}) : elle est alors
 * respectée telle quelle (pour une gamme dans une tonalité imposée).
 */
export function epelerGamme(racine, gamme) {
  const st = structureGamme(gamme);
  if (!st) return [];
  const r = typeof racine === "object" && racine ? racine : choisirRacine(racine, st.intervalles, st.numeros);
  return r ? epelerDepuis(r, st.intervalles, st.numeros) : [];
}

/** Notes orthographiées d'un accord : epelerAccord("A#", "dom7") → Sib Ré Fa Lab. */
export function epelerAccord(racine, accord) {
  const st = structureAccord(accord);
  if (!st) return [];
  const r = typeof racine === "object" && racine ? racine : choisirRacine(racine, st.intervalles, st.numeros);
  return r ? epelerDepuis(r, st.intervalles, st.numeros) : [];
}

/** Fondamentale orthographiée d'une gamme (Sib pour "A#" majeur, Do# pour "C#" mineur). */
export const racineGamme = (racine, gamme) => epelerGamme(racine, gamme)[0] ?? null;
/** Fondamentale orthographiée d'un accord. */
export const racineAccord = (racine, accord) => epelerAccord(racine, accord)[0] ?? null;

/**
 * Orthographie une classe de hauteur DANS une tonalité : par la lettre du
 * degré si la note est dans la gamme, sinon par le degré chromatique (b2,
 * b3, b5, b6, b7 depuis la tonique — la note bleue de La est Mib). Une
 * double altération est évitée en essayant la lettre voisine.
 * @param pcOuNom    classe de hauteur ou nom de note
 * @param tonique    nom de la tonique (ou note orthographiée)
 * @param gamme      clé de SCALES ou intervalles de la tonalité
 */
export function epelerDansTonalite(pcOuNom, tonique, gamme = "major") {
  const pc = typeof pcOuNom === "number" ? ((pcOuNom % 12) + 12) % 12 : pcDeNom(pcOuNom);
  const st = structureGamme(gamme);
  if (pc == null || !st) return null;
  const notesGamme = epelerGamme(tonique, gamme);
  if (!notesGamme.length) return null;
  const dansGamme = notesGamme.find(n => pcDe(n) === pc);
  if (dansGamme) return dansGamme;
  const t = notesGamme[0];
  const dt = (pc - pcDe(t) + 12) % 12;
  const num = NUMERO_GAMME[dt];
  let n = intervalle(t, num, dt);
  if (Math.abs(n.acc) >= 2) {
    for (const autre of [num - 1, num + 1]) {
      const essai = intervalle(t, ((autre - 1 + 7) % 7) + 1, dt);
      if (Math.abs(essai.acc) < Math.abs(n.acc)) n = essai;
    }
  }
  return n;
}

// ─────────────────────────────────────────────────────────────────────────
// AFFICHAGE — noms prêts à montrer (doubles altérations simplifiées)
// ─────────────────────────────────────────────────────────────────────────
/**
 * Dob → Si, Fab → Mi, Mi# → Fa, Si# → Do (règle 4) ; les doubles
 * altérations sont aussi ramenées à leur enharmonique simple. Les autres
 * notes sont rendues telles quelles.
 */
export function simplifierRare(n) {
  const s = simplifier(n);
  const nat = NATUREL.indexOf(pcDe(s));
  return s.acc !== 0 && nat !== -1 ? note(nat) : s;
}
const estHeptatonique = (gamme) => (Array.isArray(gamme) ? gamme : SCALES[gamme]?.intervals)?.length === 7;

const pourAffichage = (notes, langue, simplifierDoubles, rares = false) =>
  notes.map(n => nomEnLangue(rares ? simplifierRare(n) : simplifierDoubles ? simplifier(n) : n, langue));

/** ["Fa", "Sol", "La", "Sib", "Do", "Ré", "Mi"] pour nomsGamme("F", "major"). */
export const nomsGamme = (racine, gamme, { langue = "fr", simplifierDoubles = true } = {}) =>
  pourAffichage(epelerGamme(racine, gamme), langue, simplifierDoubles, simplifierDoubles && !estHeptatonique(gamme));

/** ["Sib", "Ré", "Fa", "Lab"] pour nomsAccord("A#", "dom7"). */
export const nomsAccord = (racine, accord, { langue = "fr", simplifierDoubles = true } = {}) =>
  pourAffichage(epelerAccord(racine, accord), langue, simplifierDoubles);

/** Nom affiché de la fondamentale d'une gamme : "Sib" pour ("A#", "major"). */
export const nomRacineGamme = (racine, gamme, langue = "fr") => {
  const r = racineGamme(racine, gamme);
  return r ? nomEnLangue(r, langue) : String(racine ?? "");
};
/** Nom affiché de la fondamentale d'un accord : "Mib" pour ("D#", "min"). */
export const nomRacineAccord = (racine, accord, langue = "fr") => {
  const r = racineAccord(racine, accord);
  return r ? nomEnLangue(r, langue) : String(racine ?? "");
};

/** Symbole d'accord orthographié : symboleAccord("A#", "min") → "Sibm" ("Bbm" en anglais). */
export const symboleAccord = (racine, accord, langue = "fr") =>
  nomRacineAccord(racine, accord, langue) + (CHORD_TYPES[accord]?.sym ?? "");

/** Nom affiché d'une note dans une tonalité ("Mib" pour la note bleue de La). */
export const nomDansTonalite = (pcOuNom, tonique, gamme = "major", { langue = "fr", simplifierDoubles = true } = {}) => {
  const n = epelerDansTonalite(pcOuNom, tonique, gamme);
  if (!n) return String(pcOuNom ?? "");
  // Règle 4 : Dob/Fab/Mi#/Si# gardés seulement pour un degré d'une gamme
  // heptatonique ; une note chromatique ou de pentatonique prend la naturelle.
  const degre = estHeptatonique(gamme) && epelerGamme(tonique, gamme).some(g => g.l === n.l && g.acc === n.acc);
  const affichee = !simplifierDoubles ? n : degre ? simplifier(n) : simplifierRare(n);
  return nomEnLangue(affichee, langue);
};

/**
 * Table « note interne (dièses, anglais) → nom affiché » pour une gamme ou
 * un accord : c'est ce que consulte le manche pour étiqueter ses pastilles
 * sans rien changer à ses positions. carteNoms("F", { gamme: "major" })
 * .get("A#") === "Sib".
 */
export function carteNoms(racine, { gamme, accord, langue = "fr" } = {}) {
  const notes = gamme ? epelerGamme(racine, gamme) : accord ? epelerAccord(racine, accord) : [];
  const rares = !!gamme && !estHeptatonique(gamme);   // règle 4
  const carte = new Map();
  for (const n of notes) {
    const cle = NOTES_DIESES_EN[pcDe(n)];
    if (!carte.has(cle)) carte.set(cle, nomEnLangue(rares ? simplifierRare(n) : simplifier(n), langue));
  }
  return carte;
}
