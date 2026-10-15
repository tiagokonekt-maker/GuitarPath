// Groply — jam/music/walkingBass.js
// Générateur de ligne de basse.
//
// Le générateur précédent répétait le même arpège à chaque mesure
// (R-5-6-b7, indéfiniment). C'est la cause principale du rendu "cheap" :
// aucun échantillon ne rattrape une ligne mécanique.
//
// Ce qui définit une VRAIE walking bass :
//   1. elle CONDUIT vers l'accord suivant — le 4e temps est une note
//      d'approche, chromatique ou diatonique, qui annonce le changement ;
//   2. elle a un CONTOUR — elle monte, elle descend, elle ne tourne pas
//      en rond sur les mêmes quatre notes ;
//   3. elle VARIE — un bassiste ne joue jamais deux fois la même mesure ;
//   4. elle RESPIRE — quelques croches, quelques silences, pas un train
//      de noires identiques.
//
// JavaScript pur, testable en Node.

import { NOTES_DIESES_EN } from "./notes.js";

const CHROMATIC = NOTES_DIESES_EN;   // classes de hauteur internes (music/notes.js)

const midiOf = (name, oct) => CHROMATIC.indexOf(name) + 12 * (oct + 1);
const nameOfMidi = (m) => CHROMATIC[((m % 12) + 12) % 12];
const octOfMidi  = (m) => Math.floor(m / 12) - 1;

/** Intervalles des qualités d'accord utiles à la basse. */
const CHORD_TONES = {
  maj:   [0, 4, 7],
  min:   [0, 3, 7],
  dom7:  [0, 4, 7, 10],
  maj7:  [0, 4, 7, 11],
  min7:  [0, 3, 7, 10],
  min7b5:[0, 3, 6, 10],
  dim7:  [0, 3, 6, 9],
  dom9:  [0, 4, 7, 10],   // la 9e reste au piano : la basse marche sur l'accord de 7e
};

/**
 * Plage réelle d'une walking bass.
 * Cordes à vide d'une basse électrique : Mi1=28, La1=33, Ré2=38, Sol2=43.
 * Une ligne de walking vit essentiellement entre Mi1 et Do3 — au-dessus,
 * ça cesse de sonner comme une basse et ça vient encombrer le registre du
 * soliste.
 */
const BASS_LOW = 28, BASS_HIGH = 48;

function clampToBass(midi) {
  while (midi < BASS_LOW) midi += 12;
  while (midi > BASS_HIGH) midi -= 12;
  return midi;
}

/**
 * Note d'approche vers une cible.
 * C'est LE geste qui fait sonner une walking bass. Trois façons classiques :
 *   - chromatique par en dessous (la plus courante)
 *   - chromatique par au-dessus
 *   - la quinte de la cible (approche "dominante", très jazz)
 */
function approachNote(targetMidi, style, rng) {
  const r = rng();
  if (style === "blues") {
    // Le blues privilégie l'approche chromatique par en dessous.
    return r < 0.7 ? targetMidi - 1 : targetMidi + 1;
  }
  if (r < 0.45) return targetMidi - 1;        // chromatique dessous
  if (r < 0.70) return targetMidi + 1;        // chromatique dessus
  return targetMidi - 5;                       // quinte au-dessous
}

/**
 * Génère une mesure de walking bass.
 *
 * @param opts.rootName   fondamentale de l'accord courant ("C", "F#"...)
 * @param opts.quality    "dom7", "min7"...
 * @param opts.nextRoot   fondamentale de l'accord SUIVANT (pour l'approche)
 * @param opts.style      "blues" | "jazz" | "simple"
 * @param opts.barIndex   pour alterner le contour
 * @param opts.energy     1..5 — densité et ornements
 * @param opts.rng        générateur aléatoire injectable (tests reproductibles)
 * @returns [{ beat, midi, dur, velocity, ghost }] — `beat` est DROIT (1.5 =
 *          croche faible) ; le rendu y applique le swing du style avec
 *          swingBeat() (jam/music/groove.js), comme pour la batterie.
 */
export function generateWalkingBar(opts) {
  const {
    rootName, quality = "dom7", nextRoot = rootName,
    style = "jazz", barIndex = 0, energy = 3,
    rng = Math.random,
  } = opts;

  const tones = CHORD_TONES[quality] || CHORD_TONES.dom7;
  const rootIdx = CHROMATIC.indexOf(rootName);
  if (rootIdx < 0) return [];

  // Octave de départ : on reste dans la zone grave, là où une basse parle.
  const rootMidi = clampToBass(midiOf(rootName, 1));
  const nextRootMidi = clampToBass(midiOf(nextRoot, 1));

  // Contour alterné : une mesure qui monte, la suivante qui descend.
  // Sans ça, la ligne tourne en rond et c'est exactement ce qui s'entend
  // comme "boucle".
  const ascending = (barIndex % 2 === 0) ? rng() < 0.7 : rng() < 0.3;

  const notes = [];

  // ── Temps 1 : la fondamentale, presque toujours ────────────────────
  // C'est elle qui pose l'accord. On s'en écarte parfois (inversion), mais
  // rarement — sinon l'harmonie devient floue.
  let first = rootMidi;
  if (rng() < 0.12 && energy >= 3) {
    // Départ sur la quinte : donne une couleur d'inversion.
    first = clampToBass(rootMidi + 7);
  }
  notes.push({ beat: 0, midi: first, dur: "4n", velocity: 0.82 });

  // ── Temps 2 et 3 : notes de l'accord, en suivant le contour ────────
  const available = tones
    .map(t => clampToBass(rootMidi + t))
    .filter(m => m !== first);
  const sorted = [...new Set(available)].sort((a, b) => ascending ? a - b : b - a);

  const pick2 = sorted[Math.floor(rng() * Math.min(2, sorted.length))] ?? clampToBass(rootMidi + 7);
  notes.push({ beat: 1, midi: pick2, dur: "4n", velocity: 0.74 });

  const rest = sorted.filter(m => m !== pick2);
  const pick3 = rest[Math.floor(rng() * Math.min(2, rest.length))] ?? clampToBass(rootMidi + 10);
  notes.push({ beat: 2, midi: pick3, dur: "4n", velocity: 0.78 });

  // ── Temps 4 : LA note d'approche ───────────────────────────────────
  // Le geste le plus important de toute la ligne. Elle conduit l'oreille
  // vers l'accord suivant et donne cette sensation d'avancée continue.
  const approach = clampToBass(approachNote(nextRootMidi, style, rng));
  notes.push({ beat: 3, midi: approach, dur: "4n", velocity: 0.80, approach: true });

  // ── Respiration : croches de liaison occasionnelles ────────────────
  // Un bassiste glisse parfois une croche entre deux temps. Rare, mais
  // c'est ce qui distingue une ligne vivante d'un métronome harmonique.
  if (energy >= 3 && rng() < 0.18 + energy * 0.04) {
    const between = Math.floor(rng() * 3);   // entre les temps 1-2, 2-3 ou 3-4
    const from = notes[between].midi, to = notes[between + 1].midi;
    if (Math.abs(to - from) > 2) {
      const passing = from + Math.sign(to - from) * (Math.abs(to - from) > 3 ? 2 : 1);
      notes.push({
        beat: between + 0.5, midi: clampToBass(passing),
        dur: "8n", velocity: 0.55, passing: true,
      });
    }
  }

  // ── Ghost note : très légère, purement rythmique ───────────────────
  if (energy >= 4 && rng() < 0.15) {
    notes.push({ beat: 3.5, midi: clampToBass(rootMidi - 12), dur: "16n", velocity: 0.22, ghost: true });
  }

  notes.sort((a, b) => a.beat - b.beat);
  return notes;
}

// ─────────────────────────────────────────────────────────────────────────
// BASSE SELON LE STYLE (bassStyle des packs src/jam/packs/*.json)
// Une walking bass sur un rock ou une ballade sonne faux : chaque style a sa
// façon de tenir les fondamentales. `approach` choisit le générateur :
//   walking        → walking bass jazz (ci-dessus)
//   shuffleWalk    → walking bass blues (approches chromatiques par dessous)
//   rootEighths    → rock : fondamentale en croches, octave et quinte
//   syncopated16   → funk : doubles-croches syncopées, octaves
//   bossaRootFifth → bossa : fondamentale (1) / quinte (3), avec l'anticipation
//   sustainedRoots → ballade : fondamentales tenues (rondes, blanches)
// Même format de sortie que generateWalkingBar : `beat` DROIT, le swing est
// appliqué au rendu (companionSwing), comme pour la batterie.
// ─────────────────────────────────────────────────────────────────────────

export const BASS_APPROACHES = ["walking", "shuffleWalk", "rootEighths", "syncopated16", "bossaRootFifth", "sustainedRoots"];

/** Septième utile à la basse selon la qualité (la quinte pour une triade). */
const septieme = (quality) => ({ maj7: 11, dom7: 10, dom9: 10, min7: 10, min7b5: 10, dim7: 9 }[quality] ?? 7);
/** Quinte de l'accord (diminuée pour m7b5 et dim7). */
const quinte = (quality) => (quality === "min7b5" || quality === "dim7" ? 6 : 7);

// Figures rock, une valeur par croche : intervalle depuis la fondamentale,
// ou "A" = note d'approche vers l'accord suivant.
const FIGURES_ROCK = [
  { id: "droit",   weight: 0.34, notes: [0, 0, 0, 0, 0, 0, 0, 0] },
  { id: "octave",  weight: 0.24, notes: [0, 0, 12, 0, 0, 0, 12, 0] },
  { id: "quinte",  weight: 0.22, notes: [0, 0, 0, 0, 5, 5, 0, 0] },
  { id: "relance", weight: 0.20, notes: [0, 0, 0, 0, 0, 0, 5, "A"] },
];

// Figures funk, en doubles-croches : { beat, i (intervalle | "7" | "A"), dur, v }.
const FIGURES_FUNK = [
  { id: "funk-a", weight: 0.36, notes: [
    { beat: 0, i: 0, dur: "8n", v: 0.86 }, { beat: 0.75, i: 0, dur: "16n", v: 0.6 },
    { beat: 1.5, i: 12, dur: "16n", v: 0.7 }, { beat: 2, i: 0, dur: "8n", v: 0.8 },
    { beat: 2.75, i: 5, dur: "16n", v: 0.6 }, { beat: 3.5, i: "7", dur: "16n", v: 0.66 },
  ]},
  { id: "funk-b", weight: 0.34, notes: [
    { beat: 0, i: 0, dur: "8n", v: 0.86 }, { beat: 1, i: -12, dur: "16n", v: 0.24, ghost: true },
    { beat: 1.25, i: 0, dur: "16n", v: 0.64 }, { beat: 2.5, i: 0, dur: "8n", v: 0.76 },
    { beat: 3, i: 5, dur: "16n", v: 0.64 }, { beat: 3.25, i: 12, dur: "16n", v: 0.7 },
    { beat: 3.75, i: "A", dur: "16n", v: 0.6 },
  ]},
  { id: "funk-c", weight: 0.30, notes: [
    { beat: 0, i: 0, dur: "4n", v: 0.86 }, { beat: 1.75, i: 0, dur: "16n", v: 0.62 },
    { beat: 2, i: 5, dur: "8n", v: 0.72 }, { beat: 3, i: 12, dur: "16n", v: 0.7 },
    { beat: 3.5, i: 0, dur: "16n", v: 0.62 },
  ]},
];

function tirage(items, rng) {
  const total = items.reduce((s, i) => s + i.weight, 0);
  let r = rng() * total;
  for (const i of items) { r -= i.weight; if (r <= 0) return i; }
  return items[items.length - 1];
}

/**
 * Une mesure de basse dans le style demandé.
 * @param opts  mêmes champs que generateWalkingBar + `approach`,
 *              `ghostNotes`, `octaveJumps` (champs de bassStyle du pack)
 */
export function generateBassBar(opts) {
  const {
    approach = "walking", rootName, quality = "dom7", nextRoot = rootName,
    barIndex = 0, energy = 3, rng = Math.random,
    ghostNotes = true, octaveJumps = 0,
  } = opts;

  if (approach === "walking" || approach === "shuffleWalk" || !BASS_APPROACHES.includes(approach)) {
    const notes = generateWalkingBar({
      rootName, quality, nextRoot, barIndex, energy, rng,
      style: approach === "shuffleWalk" ? "blues" : "jazz",
    });
    return ghostNotes ? notes : notes.filter(n => !n.ghost);
  }

  if (CHROMATIC.indexOf(rootName) < 0) return [];
  const rootMidi = clampToBass(midiOf(rootName, 1));
  const nextMidi = clampToBass(midiOf(CHROMATIC.includes(nextRoot) ? nextRoot : rootName, 1));
  const changement = nextMidi !== rootMidi;
  // Une note au-dessus de la fondamentale, ramenée dans la tessiture ; si le
  // repli la confond avec la fondamentale, on prend la quinte.
  const audessus = (i) => {
    if (i === 0) return rootMidi;
    const m = clampToBass(rootMidi + i);
    return m === rootMidi ? clampToBass(rootMidi + quinte(quality)) : m;
  };
  // Approche chromatique par dessous (ou par dessus), la plus naturelle hors jazz.
  const approcheVers = () => clampToBass(rng() < 0.7 ? nextMidi - 1 : nextMidi + 1);
  const notes = [];

  if (approach === "rootEighths") {
    const fig = tirage(FIGURES_ROCK, rng);
    // Calme : des noires ; à partir de 3, les croches qui « poussent ».
    const pas = energy <= 2 ? 1 : 0.5;
    for (let beat = 0; beat < 4; beat += pas) {
      const k = Math.round(beat * 2);
      let tok = fig.notes[k];
      if (tok === 5) tok = quinte(quality);
      let midi = tok === "A" ? (changement ? approcheVers() : audessus(quinte(quality))) : audessus(tok);
      // Sauts d'octave occasionnels sur les croches faibles (bassStyle.octaveJumps).
      if (tok === 0 && k % 2 === 1 && octaveJumps > 0 && rng() < octaveJumps) midi = audessus(12);
      notes.push({
        beat, midi,
        // Croches un peu courtes : la basse rock « pousse », elle ne s'étale pas.
        dur: pas === 1 ? "4n" : "8n",
        velocity: k === 0 ? 0.86 : k % 2 === 0 ? 0.78 : 0.64,
        ...(tok === "A" && changement ? { approach: true } : {}),
      });
    }
  } else if (approach === "syncopated16") {
    const fig = tirage(FIGURES_FUNK, rng);
    for (const n of fig.notes) {
      if (n.ghost && !(ghostNotes && energy >= 3)) continue;
      if (energy <= 2 && n.v < 0.62 && n.beat !== 0) continue;
      let midi;
      if (n.i === "A") midi = changement ? approcheVers() : audessus(12);
      else if (n.i === "7") midi = audessus(septieme(quality));
      else if (n.i === 5) midi = audessus(quinte(quality));
      else if (n.i === -12) midi = clampToBass(rootMidi - 12);
      else midi = audessus(n.i);
      if (n.i === 0 && n.beat !== 0 && octaveJumps > 0 && rng() < octaveJumps) midi = audessus(12);
      notes.push({ beat: n.beat, midi, dur: n.dur, velocity: n.v, ...(n.ghost ? { ghost: true } : {}) });
    }
  } else if (approach === "bossaRootFifth") {
    // « 1 . . & 3 . . & » : fondamentale (noire pointée) + rappel sur le &
    // du 2, quinte (noire pointée) + croche sur le & du 4. Cette dernière
    // ANTICIPE l'accord suivant quand il change : la basse de bossa
    // annonce l'harmonie une croche avant la barre de mesure.
    const q = quinte(quality);
    // Quinte en dessous quand la tessiture le permet (son typique de la
    // bossa, la basse « se balance »), sinon au-dessus.
    const fifth = rootMidi + q - 12 >= BASS_LOW ? rootMidi + q - 12 : audessus(q);
    notes.push({ beat: 0,   midi: rootMidi, dur: "4n.", velocity: 0.82 });
    if (energy >= 2) notes.push({ beat: 1.5, midi: rootMidi, dur: "8n", velocity: 0.52 });
    notes.push({ beat: 2,   midi: fifth,    dur: "4n.", velocity: 0.74 });
    if (energy >= 2 || changement) {
      notes.push(changement
        ? { beat: 3.5, midi: nextMidi, dur: "8n", velocity: 0.62, anticipate: true }
        : { beat: 3.5, midi: fifth,    dur: "8n", velocity: 0.5 });
    }
  } else if (approach === "sustainedRoots") {
    // Ballade : la basse TIENT. Ronde à faible énergie, blanches ensuite,
    // et seulement à forte énergie un petit mouvement vers l'accord suivant.
    if (energy <= 2) {
      notes.push({ beat: 0, midi: rootMidi, dur: "1n", velocity: 0.74 });
    } else if (energy === 3) {
      notes.push({ beat: 0, midi: rootMidi, dur: "2n", velocity: 0.78 });
      notes.push({ beat: 2, midi: rng() < 0.7 ? rootMidi : audessus(quinte(quality)), dur: "2n", velocity: 0.66 });
    } else {
      notes.push({ beat: 0, midi: rootMidi, dur: "2n", velocity: 0.8 });
      notes.push({ beat: 2, midi: audessus(quinte(quality)), dur: "4n", velocity: 0.68 });
      notes.push(changement
        ? { beat: 3, midi: approcheVers(), dur: "4n", velocity: 0.64, approach: true }
        : { beat: 3, midi: audessus(12), dur: "4n", velocity: 0.6 });
    }
  }

  notes.sort((a, b) => a.beat - b.beat);
  return notes;
}

/** Convertit en notation Tone.js ("Bb2", "F#1"...). */
export function toToneNote(midi) {
  const SHARP_TO_FLAT = { "C#":"Db","D#":"Eb","F#":"Gb","G#":"Ab","A#":"Bb" };
  const n = nameOfMidi(midi);
  return `${SHARP_TO_FLAT[n] || n}${octOfMidi(midi)}`;
}

/** Position Tone.js ("0:2:0") depuis un temps fractionnaire. */
export function toToneTime(beat) {
  const whole = Math.floor(beat);
  const sixteenths = Math.round((beat - whole) * 4);
  return `0:${whole}:${sixteenths}`;
}
