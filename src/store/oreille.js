// Groply — store/oreille.js
// ENTRAÎNEMENT DE L'OREILLE : données et tirages, en logique PURE (aucun
// React, aucun audio). Les hauteurs sont des numéros MIDI : ce qui sonne est
// décrit exactement, et les tests (test/oreille.test.mjs) le vérifient.
//
// Deux consommateurs :
//  • audioEngine.generateEarTrainingQuestion — l'écran Ear Training, qui
//    ajoute la lecture (play) à ces descriptions ;
//  • store/generateurs.js — les compétences d'écoute de la révision espacée.
//
// ── Progressivité ─────────────────────────────────────────────────────────
// Chaque mode a un ORDRE d'introduction : on commence par quelques éléments
// très contrastés (octave, quinte, tierce majeure), et un nouvel élément
// n'entre qu'une fois les précédents acquis (2 réussites d'affilée chacun).
// Ce qui a déjà été travaillé reste dans le vivier : on ne retire jamais à
// l'élève un intervalle qu'il a déjà rencontré. Le tirage favorise ce qui
// est nouveau ou souvent raté. Tout se déduit de l'historique de révision
// (attempts / successes / streak, cf. reviewEngine) : rien de neuf à stocker.

import { NOTES_DIESES_EN } from "../music/notes.js";
import { epelerDansTonalite, nomFr, simplifier, nomRacineGamme } from "../music/orthographe.js";

// ─────────────────────────────────────────────────────────────────────────
// OUTILS
// ─────────────────────────────────────────────────────────────────────────
export const choisir = (rng, arr) => arr[Math.floor(rng() * arr.length)];
export function melanger(rng, arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(rng() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; }
  return a;
}
export const entre = (rng, a, b) => a + Math.floor(rng() * (b - a + 1));
/** MIDI → note Tone.js en dièses ("C#4"). */
export const midiVersTone = (m) => `${NOTES_DIESES_EN[((m % 12) + 12) % 12]}${Math.floor(m / 12) - 1}`;
const pcDe = (m) => ((m % 12) + 12) % 12;

// ─────────────────────────────────────────────────────────────────────────
// INTERVALLES — les 12, de la seconde mineure à l'octave
// ─────────────────────────────────────────────────────────────────────────
// Les repères décrivent un CARACTÈRE ou un usage typique, sans citer de
// paroles : à chacun d'y associer ses propres chansons.
export const INTERVALLES = {
  1:  { nom: "Seconde mineure",  repere: "Très serrée, grinçante : le motif de suspense des films de requin." },
  2:  { nom: "Seconde majeure",  repere: "Le pas d'une gamme : les deux premières notes d'une gamme qui monte." },
  3:  { nom: "Tierce mineure",   repere: "Douce et un peu triste : l'appel « cou-cou » d'une comptine, ou le début d'une mélodie mineure." },
  4:  { nom: "Tierce majeure",   repere: "Lumineuse et stable : les deux premières notes d'un accord majeur arpégé." },
  5:  { nom: "Quarte juste",     repere: "Affirmée, comme un appel : le début de nombreux hymnes et marches." },
  6:  { nom: "Triton",           repere: "Instable, il « veut » se résoudre : l'intervalle des sirènes et des ambiances inquiétantes." },
  7:  { nom: "Quinte juste",     repere: "Ouverte et héroïque : le départ de nombreux thèmes de films d'aventure et d'espace." },
  8:  { nom: "Sixte mineure",    repere: "Dramatique, doux-amer : une sixte qui a souvent envie de redescendre d'un demi-ton." },
  9:  { nom: "Sixte majeure",    repere: "Chaleureuse et chantante : l'élan de beaucoup d'airs populaires et de jingles." },
  10: { nom: "Septième mineure", repere: "Bluesy, en suspens : la note que la septième de dominante ajoute à l'accord." },
  11: { nom: "Septième majeure", repere: "Presque une octave, très tendue : elle « veut » monter d'un demi-ton." },
  12: { nom: "Octave",           repere: "La même note, plus aiguë : le grand saut d'ouverture de nombreuses mélodies célèbres." },
};
/** Ordre d'introduction : trois intervalles très contrastés d'abord. */
export const ORDRE_INTERVALLES = [12, 7, 4, 5, 2, 3, 9, 10, 1, 11, 8, 6];
export const DEPART_INTERVALLES = 3;
export const SENS = { ascending: "en montant", descending: "en descendant", harmonic: "ensemble" };

/**
 * Deux notes séparées de `dt` demi-tons. `notes` est toujours [grave, aiguë] ;
 * c'est `mode` qui décide de l'ordre de lecture (en descendant, l'aiguë
 * sonne d'abord — cf. audioEngine.playInterval).
 */
export function tirerIntervalle(rng, dt, mode = "ascending") {
  const base = entre(rng, 45, 57);              // La2 → La3 : l'octave reste sous Mi5
  return { dt, mode, midi: [base, base + dt] };
}

// ─────────────────────────────────────────────────────────────────────────
// QUALITÉS D'ACCORD
// ─────────────────────────────────────────────────────────────────────────
// Clés alignées sur fretboardUtils.CHORD_TYPES.
export const QUALITES = {
  maj:    { nom: "Majeur",         sym: "",     iv: [0, 4, 7],     couleur: "tierce majeure et quinte juste : stable, lumineux" },
  min:    { nom: "Mineur",         sym: "m",    iv: [0, 3, 7],     couleur: "tierce mineure et quinte juste : plus sombre" },
  aug:    { nom: "Augmenté",       sym: "aug",  iv: [0, 4, 8],     couleur: "deux tierces majeures : suspendu, étrange" },
  dim:    { nom: "Diminué",        sym: "dim",  iv: [0, 3, 6],     couleur: "deux tierces mineures : tendu, instable" },
  dom7:   { nom: "Septième (7)",   sym: "7",    iv: [0, 4, 7, 10], couleur: "majeur + septième mineure : bluesy, appelle une résolution" },
  min7:   { nom: "Mineur 7 (m7)",  sym: "m7",   iv: [0, 3, 7, 10], couleur: "mineur + septième mineure : doux, détendu" },
  maj7:   { nom: "Majeur 7 (maj7)", sym: "maj7", iv: [0, 4, 7, 11], couleur: "majeur + septième majeure : rêveur, jazzy" },
  sus4:   { nom: "Sus4",           sym: "sus4", iv: [0, 5, 7],     couleur: "la quarte remplace la tierce : en attente, ni majeur ni mineur" },
  sus2:   { nom: "Sus2",           sym: "sus2", iv: [0, 2, 7],     couleur: "la seconde remplace la tierce : ouvert, aérien" },
  min7b5: { nom: "Demi-diminué (m7♭5)", sym: "m7♭5", iv: [0, 3, 6, 10], couleur: "diminué + septième mineure : sombre, appelle un V" },
  dim7:   { nom: "Diminué 7 (dim7)", sym: "dim7", iv: [0, 3, 6, 9], couleur: "tierces mineures empilées : très tendu, symétrique" },
};
/** Ordre d'introduction de l'écran Ear Training : majeur et mineur d'abord. */
export const ORDRE_QUALITES = ["maj", "min", "aug", "dim", "dom7", "min7", "maj7", "sus4", "sus2"];
export const DEPART_QUALITES = 2;

/** Accord en position serrée, fondamentale à la basse, doublée à l'octave. */
export function voicingAccord(racine, iv) {
  return [...iv.map(i => racine + i), racine + 12];
}
export function tirerAccord(rng, qualite) {
  const racine = entre(rng, 48, 55);            // Do3 → Sol3
  return { qualite, racine, midi: voicingAccord(racine, QUALITES[qualite].iv) };
}

// ─────────────────────────────────────────────────────────────────────────
// TONALITÉS — les plus courantes, pour des noms lisibles
// ─────────────────────────────────────────────────────────────────────────
export const TONALITES_MAJ = [0, 7, 2, 9, 4, 5, 10, 3];   // Do Sol Ré La Mi Fa Sib Mib
export const TONALITES_MIN = [9, 4, 11, 2, 7, 0, 5];      // La Mi Si Ré Sol Do Fa
const gammeDe = (mineur) => (mineur ? "natural_minor" : "major");

/** "Sib majeur", "Fa# mineur". */
export const nomTonalite = (toniquePc, mineur = false) =>
  `${nomRacineGamme(NOTES_DIESES_EN[pcDe(toniquePc)], gammeDe(mineur))} ${mineur ? "mineur" : "majeur"}`;

/** Nom d'une note DANS une tonalité ("Sib" en Fa majeur, jamais "La#"). */
export function nomDansLaTonalite(pc, toniquePc, mineur = false) {
  const n = epelerDansTonalite(pcDe(pc), NOTES_DIESES_EN[pcDe(toniquePc)], gammeDe(mineur));
  return n ? nomFr(simplifier(n)) : NOTES_DIESES_EN[pcDe(pc)];
}
/** Symbole d'accord dans une tonalité : "Rém", "Sib", "Mi7". */
export const accordDansLaTonalite = (toniquePc, semi, type, mineur = false) =>
  nomDansLaTonalite(toniquePc + semi, toniquePc, mineur) + (QUALITES[type]?.sym ?? "");

// ─────────────────────────────────────────────────────────────────────────
// ACCORD EN TONALITÉ (remplace « accord complet »)
// ─────────────────────────────────────────────────────────────────────────
// Nommer un accord dans l'absolu demande l'oreille absolue. Ici, la tonalité
// est annoncée et la tonique jouée d'abord : on reconnaît l'accord par sa
// RELATION à la tonique — ce que l'oreille relative sait faire.
// `fonction` cite des chiffres romains : elle ne s'affiche qu'une fois la
// leçon du chiffrage faite. Avant, `fonctionNoms` dit la même chose en mots,
// et `libelle` nomme le degré sans chiffre (annonce du vivier).
export const DEGRES_TONALITE = {
  "I":    { semi: 0,  type: "maj",  libelle: "l'accord de tonique",
            fonction: "la tonique : aucun mouvement, on est « à la maison »",
            fonctionNoms: "la tonique : aucun mouvement, on est « à la maison »" },
  "IV":   { semi: 5,  type: "maj",  libelle: "la sous-dominante",
            fonction: "la sous-dominante : on s'éloigne en douceur",
            fonctionNoms: "la sous-dominante : on s'éloigne en douceur" },
  "V":    { semi: 7,  type: "maj",  libelle: "la dominante",
            fonction: "la dominante : une tension qui appelle le retour",
            fonctionNoms: "la dominante : une tension qui appelle le retour" },
  "vi":   { semi: 9,  type: "min",  libelle: "le relatif mineur",
            fonction: "le relatif mineur : même famille que le I, en plus sombre",
            fonctionNoms: "le relatif mineur : même famille que l'accord de tonique, en plus sombre" },
  "ii":   { semi: 2,  type: "min",  libelle: "l'accord mineur du 2e degré",
            fonction: "le ii : mineur, il prépare souvent le V",
            fonctionNoms: "l'accord bâti sur la 2e note de la gamme : mineur, il prépare souvent la dominante" },
  "iii":  { semi: 4,  type: "min",  libelle: "l'accord mineur du 3e degré",
            fonction: "le iii : mineur, proche du I (deux notes en commun)",
            fonctionNoms: "l'accord bâti sur la 3e note de la gamme : mineur, proche de la tonique (deux notes en commun)" },
  "V7":   { semi: 7,  type: "dom7", libelle: "la dominante avec sa septième",
            fonction: "la dominante avec sa septième : la tension la plus forte",
            fonctionNoms: "la dominante avec sa septième : la tension la plus forte" },
  "vii°": { semi: 11, type: "dim",  libelle: "l'accord diminué de la sensible",
            fonction: "le vii° : diminué, il bascule vers la tonique",
            fonctionNoms: "l'accord bâti sur la sensible : diminué, il bascule vers la tonique" },
};
export const ORDRE_DEGRES = ["I", "IV", "V", "vi", "ii", "iii", "V7", "vii°"];
export const DEPART_DEGRES = 3;

/** Basse proche de la tonique : un IV ou un V ne saute pas d'une octave. */
const basseDegre = (toniqueMidi, semi) => toniqueMidi + (semi > 6 ? semi - 12 : semi);

export function tirerAccordEnTonalite(rng, degre, toniquePc = choisir(rng, TONALITES_MAJ)) {
  const d = DEGRES_TONALITE[degre];
  const toniqueMidi = 45 + pcDe(toniquePc - 9);           // La2 → Sol#3
  const reference = voicingAccord(toniqueMidi, QUALITES.maj.iv);
  const cible = voicingAccord(basseDegre(toniqueMidi, d.semi), QUALITES[d.type].iv);
  return { degre, toniquePc, reference, midi: cible, nom: accordDansLaTonalite(toniquePc, d.semi, d.type), tonalite: nomTonalite(toniquePc) };
}

// ─────────────────────────────────────────────────────────────────────────
// SUITES D'ACCORDS — majeures et mineures, toutes de 4 accords (compter les
// accords ne doit jamais suffire à éliminer une réponse)
// ─────────────────────────────────────────────────────────────────────────
// [demi-tons depuis la tonique, type, chiffre romain]
export const PROGRESSIONS = {
  "I-IV-V-I":     { mineur: false, degres: [[0, "maj", "I"], [5, "maj", "IV"], [7, "maj", "V"], [0, "maj", "I"]] },
  "I-V-vi-IV":    { mineur: false, degres: [[0, "maj", "I"], [7, "maj", "V"], [9, "min", "vi"], [5, "maj", "IV"]] },
  "i-iv-v-i":     { mineur: true,  degres: [[0, "min", "i"], [5, "min", "iv"], [7, "min", "v"], [0, "min", "i"]] },
  "I-vi-IV-V":    { mineur: false, degres: [[0, "maj", "I"], [9, "min", "vi"], [5, "maj", "IV"], [7, "maj", "V"]] },
  "i-VI-III-VII": { mineur: true,  degres: [[0, "min", "i"], [8, "maj", "VI"], [3, "maj", "III"], [10, "maj", "VII"]] },
  // Mineur harmonique : la sensible rend le V majeur.
  "i-iv-V-i":     { mineur: true, harmonique: true, degres: [[0, "min", "i"], [5, "min", "iv"], [7, "maj", "V"], [0, "min", "i"]] },
  "I-vi-ii-V":    { mineur: false, degres: [[0, "maj", "I"], [9, "min", "vi"], [2, "min", "ii"], [7, "maj", "V"]] },
  // Cadence andalouse : descend jusqu'au V majeur (mineur harmonique).
  "i-VII-VI-V":   { mineur: true, harmonique: true, degres: [[0, "min", "i"], [10, "maj", "VII"], [8, "maj", "VI"], [7, "maj", "V"]] },
  "I-IV-vi-V":    { mineur: false, degres: [[0, "maj", "I"], [5, "maj", "IV"], [9, "min", "vi"], [7, "maj", "V"]] },
  "i-VI-VII-i":   { mineur: true,  degres: [[0, "min", "i"], [8, "maj", "VI"], [10, "maj", "VII"], [0, "min", "i"]] },
};
export const ORDRE_PROGRESSIONS = Object.keys(PROGRESSIONS);
export const DEPART_PROGRESSIONS = 3;
/** "i – VI – III – VII" */
export const romainDe = (cle) => PROGRESSIONS[cle].degres.map(d => d[2]).join(" – ");

export function tirerProgression(rng, cle, toniquePc) {
  const p = PROGRESSIONS[cle];
  const t = toniquePc ?? choisir(rng, p.mineur ? TONALITES_MIN : TONALITES_MAJ);
  const toniqueMidi = 45 + pcDe(t - 9);
  const accords = p.degres.map(([semi, type]) => voicingAccord(basseDegre(toniqueMidi, semi), QUALITES[type].iv));
  // Orthographe dans la tonalité : en Do mineur, i – VI – III – VII s'écrit
  // Dom – Lab – Mib – Sib (et non Sol# – Ré# – La#).
  const noms = p.degres.map(([semi, type]) => accordDansLaTonalite(t, semi, type, p.mineur));
  return { cle, toniquePc: t, mineur: p.mineur, accords, noms, romain: romainDe(cle), tonalite: nomTonalite(t, p.mineur) };
}

// ─────────────────────────────────────────────────────────────────────────
// CHIFFRES ROMAINS : d'abord les NOMS d'accords, les chiffres ensuite
// ─────────────────────────────────────────────────────────────────────────
// « I – V – vi – IV » ne dit rien à qui n'a pas appris le chiffrage. Les
// réponses sont donc d'abord des noms d'accords depuis la tonique annoncée
// (« Sol – Ré – Mim – Do »). Les chiffres romains n'apparaissent qu'après la
// leçon qui les enseigne (harm-c5-02, « Le chiffrage romain et le système
// Nashville ») : dans la correction (noms = chiffres), et comme format de
// réponse, à petite dose (1 question sur 5) qui grandit avec la pratique,
// sans jamais remplacer les noms (55 % au plus).
export const LECON_CHIFFRES_ROMAINS = "harm-c5-02";
/** Historique des questions de suites posées en chiffres romains (Ear Training). */
export const CLE_SUITES_ROMAINS = "ear:progression:chiffres-romains";
export const PART_ROMAINS = { depart: 0.2, max: 0.55, succesPleins: 20, niveauMax: 3 };

/** La leçon du chiffrage est-elle faite ? (`completedLessons` de l'état) */
export const chiffresRomainsAppris = (completedLessons) => !!completedLessons?.[LECON_CHIFFRES_ROMAINS];

/**
 * Part des questions de suites posées en chiffres romains (0 à 0,55).
 *  • leçon pas faite → 0 : jamais de chiffres ;
 *  • leçon faite → 20 %, puis jusqu'à 55 % selon l'avancement, le plus
 *    favorable de : `succes` (réussites EN CHIFFRES ROMAINS, plein à 20) et
 *    `niveau` (1 à 3, niveau de la compétence de révision : 1 → 20 %,
 *    2 → 37,5 %, 3 → 55 %).
 */
export function partChiffresRomains({ leconFaite = false, succes = 0, niveau = 1 } = {}) {
  if (!leconFaite) return 0;
  const { depart, max, succesPleins, niveauMax } = PART_ROMAINS;
  const parSucces = Math.min(1, Math.max(0, succes || 0) / succesPleins);
  const parNiveau = (Math.min(niveauMax, Math.max(1, niveau || 1)) - 1) / (niveauMax - 1);
  return depart + (max - depart) * Math.max(parSucces, parNiveau);
}
/** Tirage du format d'une question de suite : "romains" ou "noms". */
export const formatSuite = (rng, params) => (rng() < partChiffresRomains(params) ? "romains" : "noms");

/**
 * Toniques possibles pour un groupe de suites : celles de leur mode, ou, si
 * majeures et mineures se côtoient, les toniques communes (Do Sol Ré La Mi
 * Fa) : toutes les options s'écrivent alors depuis la même tonique.
 */
export function toniquesPour(cles) {
  const modes = new Set(cles.map(k => PROGRESSIONS[k].mineur));
  if (modes.size === 1) return modes.has(true) ? TONALITES_MIN : TONALITES_MAJ;
  return TONALITES_MAJ.filter(t => TONALITES_MIN.includes(t));
}
/** Les accords d'une suite depuis une tonique : ["Sol", "Ré", "Mim", "Do"]. */
export const nomsSuite = (cle, toniquePc) =>
  PROGRESSIONS[cle].degres.map(([semi, type]) => accordDansLaTonalite(toniquePc, semi, type, PROGRESSIONS[cle].mineur));
/** "Sol – Ré – Mim – Do" */
export const libelleNomsSuite = (cle, toniquePc) => nomsSuite(cle, toniquePc).join(" – ");
/** La tonique seule (« Sib ») : l'annoncer ne trahit pas majeur ou mineur. */
export const nomTonique = (toniquePc) => nomDansLaTonalite(toniquePc, toniquePc);

/**
 * Correction d'une suite tirée (tirerProgression) : avant la leçon, les noms
 * seulement ; après, les noms ET les chiffres, pour apprendre le lien.
 * « Sol – Ré – Mim – Do = I – V – vi – IV en Sol majeur. »
 */
export const correctionSuite = (p, leconFaite) => (leconFaite
  ? `${p.noms.join(" – ")} = ${p.romain} en ${p.tonalite}.`
  : `En ${p.tonalite} : ${p.noms.join(" – ")}.`);

/** Une suite hors question (annonce du vivier) : en Do majeur ou en La mineur. */
export function exempleSuite(cle, leconFaite) {
  const mineur = PROGRESSIONS[cle].mineur, t = mineur ? 9 : 0;
  const ex = `en ${nomTonalite(t, mineur)} : ${libelleNomsSuite(cle, t)}`;
  return leconFaite ? `${romainDe(cle)} (${ex})` : `la suite ${ex}`;
}
/** Un degré hors question (annonce du vivier) : « la dominante (V) » ou « la dominante ». */
export const exempleDegre = (degre, leconFaite) =>
  (leconFaite ? `${DEGRES_TONALITE[degre].libelle} (${degre})` : DEGRES_TONALITE[degre].libelle);

// ─────────────────────────────────────────────────────────────────────────
// DICTÉE MÉLODIQUE — 3 à 5 notes, dans la gamme, en partant de la tonique
// ─────────────────────────────────────────────────────────────────────────
export const NIVEAUX_DICTEE = [
  { n: 3, degreMax: 2, sautMax: 1, mineur: false, libelle: "3 notes, de la tonique à la tierce, par degrés conjoints" },
  { n: 4, degreMax: 4, sautMax: 2, mineur: false, libelle: "4 notes, de la tonique à la quinte" },
  { n: 4, degreMax: 7, sautMax: 4, mineur: false, libelle: "4 notes, sur toute l'octave, avec des sauts" },
  { n: 5, degreMax: 7, sautMax: 7, mineur: false, libelle: "5 notes, sur toute l'octave" },
  { n: 5, degreMax: 7, sautMax: 4, mineur: true,  libelle: "5 notes, en mineur" },
];
/** Demi-tons de chaque degré (index 0 = tonique, 7 = octave). */
export const ECHELLES = { majeur: [0, 2, 4, 5, 7, 9, 11, 12], mineur: [0, 2, 3, 5, 7, 8, 10, 12] };
export const SEUILS_DICTEE = [0, 3, 7, 12, 18];

/** Les touches de réponse : un bouton par degré permis, nommé dans la tonalité. */
export function touchesDictee(toniquePc, niveau) {
  const p = NIVEAUX_DICTEE[Math.max(1, Math.min(NIVEAUX_DICTEE.length, niveau)) - 1];
  const e = p.mineur ? ECHELLES.mineur : ECHELLES.majeur;
  return Array.from({ length: p.degreMax + 1 }, (_, d) => {
    const nom = nomDansLaTonalite(toniquePc + e[d], toniquePc, p.mineur);
    return { degre: d, numero: d + 1, nom: d === 7 ? `${nom} aigu` : nom };
  });
}

export function tirerDictee(rng, niveau = 1, toniquePc) {
  const niv = Math.max(1, Math.min(NIVEAUX_DICTEE.length, niveau));
  const p = NIVEAUX_DICTEE[niv - 1];
  const t = toniquePc ?? choisir(rng, p.mineur ? TONALITES_MIN : TONALITES_MAJ);
  const e = p.mineur ? ECHELLES.mineur : ECHELLES.majeur;
  const toniqueMidi = 55 + pcDe(t - 7);                    // Sol3 → Fa#4 : l'octave reste sous Mi5
  const degres = [0];
  while (degres.length < p.n) {
    const prec = degres[degres.length - 1];
    const possibles = [];
    for (let d = 0; d <= p.degreMax; d++) if (d !== prec && Math.abs(d - prec) <= p.sautMax) possibles.push(d);
    degres.push(choisir(rng, possibles));
  }
  const touches = touchesDictee(t, niv);
  return {
    niveau: niv, mineur: p.mineur, toniquePc: t, toniqueMidi, degres,
    midi: degres.map(d => toniqueMidi + e[d]),
    // Accord de la tonique, une octave sous la mélodie : il installe la tonalité.
    reference: voicingAccord(toniqueMidi - 12, p.mineur ? QUALITES.min.iv : QUALITES.maj.iv),
    touches,
    noms: degres.map(d => touches[d].nom),
    tonalite: nomTonalite(t, p.mineur),
    libelle: p.libelle,
  };
}

// ─────────────────────────────────────────────────────────────────────────
// ADAPTATION — vivier progressif et niveaux
// ─────────────────────────────────────────────────────────────────────────
/** Clé d'historique d'un élément d'un mode : "ear:interval:7". */
export const cleItem = (mode, item) => `ear:${mode}:${item}`;
/** Un élément est acquis après 2 réussites d'affilée. */
export const estAcquis = (h) => (h?.streak || 0) >= 2;

/**
 * Vivier d'un mode : les `depart` premiers éléments de `ordre`, plus tous
 * ceux déjà travaillés (jamais retirés), plus le SUIVANT quand tout le
 * vivier est acquis.
 * @returns { pool, nouveau, total } — `nouveau` : l'élément qui vient d'entrer.
 */
export function poolAdaptatif(ordre, depart, historique, cle) {
  const h = historique || {};
  let k = Math.min(depart, ordre.length);
  ordre.forEach((x, i) => { if ((h[cle(x)]?.attempts || 0) > 0) k = Math.max(k, i + 1); });
  let nouveau = null;
  if (k < ordre.length && ordre.slice(0, k).every(x => estAcquis(h[cle(x)]))) { nouveau = ordre[k]; k++; }
  return { pool: ordre.slice(0, k), nouveau, total: ordre.length };
}

/**
 * Tirage pondéré dans le vivier : un élément jamais entendu ou souvent raté
 * revient plus souvent ; jamais deux fois de suite le même.
 */
export function choisirItem(rng, pool, historique, cle, precedent = null) {
  const h = historique || {};
  const poids = pool.map(x => {
    if (x === precedent && pool.length > 1) return 0;
    const e = h[cle(x)];
    if (!e?.attempts) return 4;
    return 1 + (estAcquis(e) ? 0 : 2) + 2 * (1 - (e.successes || 0) / e.attempts);
  });
  const total = poids.reduce((a, b) => a + b, 0);
  let r = rng() * total;
  for (let i = 0; i < pool.length; i++) { r -= poids[i]; if (r < 0 && poids[i] > 0) return pool[i]; }
  return pool.find((_, i) => poids[i] > 0) ?? pool[0];
}

/**
 * Niveau (1 à seuils.length) déduit des réussites, comme les compétences
 * générées : il monte avec les réussites et redescend d'un cran après une
 * erreur à la dernière réponse.
 */
export function niveauProgressif(h, seuils = SEUILS_DICTEE) {
  const r = h?.successes || 0;
  let n = 1;
  seuils.forEach((s, i) => { if (r >= s) n = i + 1; });
  if ((h?.attempts || 0) > 0 && (h?.streak || 0) === 0) n = Math.max(1, n - 1);
  return n;
}

/** Précision en % (null tant qu'il n'y a pas de réponse). */
export const precision = (h) => (h?.attempts ? Math.round(((h.successes || 0) / h.attempts) * 100) : null);
