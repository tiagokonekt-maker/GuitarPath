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

const CHROMATIC = ["C","C#","D","D#","E","F","F#","G","G#","A","A#","B"];

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
 * @returns [{ beat, midi, dur, velocity, ghost }]
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
