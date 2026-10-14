// GuitarPath -- screens/jam/harmonie.js
// Données et fonctions PURES de la Jam : tonalités, accords, voicings,
// motifs de basse et de batterie. Sorties de JamSession.jsx telles quelles
// (aucune logique modifiée) : elles étaient recréées à chaque rendu du
// lecteur alors qu'elles ne dépendent d'aucun état.
import { normalizeNote } from "../../fretboardUtils.js";
import { generateWalkingBar, toToneNote as toToneNoteFromMidi, toToneTime } from "../../music/walkingBass.js";

export const ROOTS_FR = [
  { en: "A",  fr: "La"   }, { en: "B",  fr: "Si"   }, { en: "C",  fr: "Do"   },
  { en: "D",  fr: "Ré"   }, { en: "E",  fr: "Mi"   }, { en: "F",  fr: "Fa"   },
  { en: "G",  fr: "Sol"  }, { en: "C#", fr: "Do#"  }, { en: "D#", fr: "Ré#"  },
  { en: "F#", fr: "Fa#"  }, { en: "G#", fr: "Sol#" }, { en: "A#", fr: "La#"  },
];

export const CHROMATIC = ["C","C#","D","D#","E","F","F#","G","G#","A","A#","B"];
const SHARP_TO_FLAT = { "C#":"Db","D#":"Eb","F#":"Gb","G#":"Ab","A#":"Bb" };

export function transposeNote(root, semitones) {
  const idx = CHROMATIC.indexOf(root);
  return CHROMATIC[(idx + semitones) % 12];
}

const CHORD_INTERVALS = {
  maj7:  [0, 4, 7, 11],
  min7:  [0, 3, 7, 10],
  dom7:  [0, 4, 7, 10],
  maj:   [0, 4, 7],
  min:   [0, 3, 7],
};
const QUALITE_LABEL = { maj7: "maj7", min7: "m7", dom7: "7", maj: "", min: "m" };

/** Notes (noms anglais) d'un accord de la grille, transposé dans la tonalité. */
export function notesAccord(root, chord) {
  const r = transposeNote(root, chord.degree);
  return (CHORD_INTERVALS[chord.quality] || CHORD_INTERVALS.dom7).map(i => transposeNote(r, i));
}
export const nomAccord = (root, chord) => {
  const r = transposeNote(root, chord.degree);
  return (ROOTS_FR.find(x => x.en === r)?.fr ?? r) + (QUALITE_LABEL[chord.quality] ?? "");
};

// ── Voicings d'accords réalistes (positions de guitare) ──────────────────
// Intervalles depuis la root, construits pour sonner comme une vraie main
const VOICINGS = {
  // Voicing jazz : root basse, 3e, 5e, 7e en ordre montant
  min7:  { intervals: [0, 10, 15, 19], desc: "x-R-b7-3-5" },
  maj7:  { intervals: [0, 11, 16, 19], desc: "x-R-7-3-5"  },
  dom7:  { intervals: [0, 10, 16, 19], desc: "x-R-b7-3-5" },
  // Pour le blues : accords ouverts plus puissants
  dom7b: { intervals: [0, 7, 10, 16],  desc: "R-5-b7-3"   },
  // Triades. Sans elles, le bVII majeur du mixolydien retombait sur le
  // voicing m7 par défaut : en La, le Sol affiché « Sol » sonnait Sol m7
  // (Sol-Si♭-Ré-Fa) — deux notes étrangères au mode (Si♭ et Fa), sur
  // l'accord même qui doit le faire entendre.
  maj:   { intervals: [0, 4, 7, 16],   desc: "R-3-5-3"    },
  min:   { intervals: [0, 3, 7, 15],   desc: "R-b3-5-b3"  },
};

export function getVoicedChord(rootNote, quality, style = "jazz") {
  const iBlues = style === "blues" || style === "blues12";
  const voicing = iBlues && quality === "dom7"
    ? VOICINGS.dom7b
    : VOICINGS[quality] || VOICINGS.dom7;

  const rootIdx = CHROMATIC.indexOf(rootNote);
  if (rootIdx < 0) return [];

  // ── Voicing SANS FONDAMENTALE ────────────────────────────────────
  // En groupe, un pianiste ne joue pas la fondamentale : c'est le
  // bassiste qui la tient. Jouer les deux produit exactement ce qu'on
  // veut éviter — deux instruments qui se disputent le même registre
  // grave, et l'accompagnement qui masque la ligne de basse.
  //
  // On retire donc le degré 0 et on ne garde que ce qui donne la
  // couleur : tierce, septième, quinte, extensions.
  const rootless = voicing.intervals.filter(i => i % 12 !== 0);
  const degrees = rootless.length ? rootless : voicing.intervals;

  // Position du voicing : la note la plus grave doit rester AU-DESSUS de
  // la plage de la basse (qui monte jusqu'à MIDI 48).
  const COMP_MIN_MIDI = 52;    // Mi3 — plancher de l'accompagnement
  const lowestDegree = Math.min(...degrees);
  let base = 36 + rootIdx;
  // On remonte par octaves jusqu'à dégager la basse, sans jamais partir
  // dans l'aigu où joue le guitariste.
  while (base + lowestDegree < COMP_MIN_MIDI) base += 12;
  while (base + lowestDegree >= COMP_MIN_MIDI + 12) base -= 12;

  return degrees.map(interval => {
    const midi = base + interval;
    const name = CHROMATIC[((midi % 12) + 12) % 12];
    const oct  = Math.floor(midi / 12) - 1;
    return `${SHARP_TO_FLAT[name] || name}${oct}`;
  });
}

export function getBassPattern(rootNote, quality, style, nextRoot, barIdx, energy = 3) {
  // Délègue au générateur de walking bass. L'ancienne version répétait le
  // même arpège (R-5-6-b7) à chaque mesure, indéfiniment : c'était la
  // cause principale du rendu mécanique, bien avant la qualité des
  // échantillons. Le nouveau générateur produit des notes d'approche vers
  // l'accord suivant, un contour alterné et des variations de mesure en
  // mesure.
  const bluesy = style === "blues" || style === "blues12";
  const notes = generateWalkingBar({
    rootName: normalizeNote(rootNote),
    quality: quality || "dom7",
    nextRoot: normalizeNote(nextRoot || rootNote),
    style: bluesy ? "blues" : "jazz",
    barIndex: barIdx || 0,
    energy,
  });
  return notes.map(n => ({
    note: toToneNoteFromMidi(n.midi),
    time: toToneTime(n.beat),
    dur: n.dur,
    velocity: n.velocity,
  }));
}

// ── Patterns de batterie selon le style ────────────────────────────────
export function getDrumPattern(style) {
  if (style === "blues" || style === "blues12") {
    return {
      kick:  ["0:0:0", "0:2:0"],
      snare: ["0:1:0", "0:3:0"],
      hihat: ["0:0:0","0:0:2","0:1:0","0:1:2","0:2:0","0:2:2","0:3:0","0:3:2"],
      shuffle: true,
    };
  }
  if (style === "jazz") {
    return {
      kick:  ["0:0:0", "0:2:2"],
      snare: ["0:1:0", "0:3:0"],
      hihat: ["0:0:0","0:0:3","0:1:2","0:2:0","0:2:3","0:3:2"],
      shuffle: false,
    };
  }
  if (style === "funk") {
    return {
      kick:  ["0:0:0","0:0:3","0:2:0","0:2:2"],
      snare: ["0:1:0","0:3:0","0:3:2"],
      hihat: ["0:0:0","0:0:1","0:0:2","0:0:3","0:1:0","0:1:1","0:1:2","0:1:3","0:2:0","0:2:1","0:2:2","0:2:3","0:3:0","0:3:1","0:3:2","0:3:3"],
      shuffle: false,
    };
  }
  // Rock
  return {
    kick:  ["0:0:0","0:0:2","0:2:0"],
    snare: ["0:1:0","0:3:0"],
    hihat: ["0:0:0","0:0:2","0:1:0","0:1:2","0:2:0","0:2:2","0:3:0","0:3:2"],
    shuffle: false,
  };
}

const STYLE_PAR_CONTEXTE = {
  blues_minor:  "blues",
  blues_12:     "blues12",
  jazz_251:     "jazz",
  modal_dorian: "funk",
  modal_mixo:   "rock",
};
export const getStyle = (contextId) => STYLE_PAR_CONTEXTE[contextId] || "rock";
