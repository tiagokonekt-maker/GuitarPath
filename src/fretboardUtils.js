// ═══════════════════════════════════════════════════════════════════════════
// GuitarPath — fretboardUtils.js
// Logique musicale pure, séparée du rendu.
// Import : import { getNoteAtPosition, getScaleNotes, ... } from "./fretboardUtils.js"
// ═══════════════════════════════════════════════════════════════════════════

// ───────────────────────────────────────────────────────────────────────────
// CONSTANTES FONDAMENTALES
// ───────────────────────────────────────────────────────────────────────────

// Les 12 notes en notation internationale (sharps par défaut)
export const CHROMATIC_NOTES = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];

// Alias bémols → dièses (sens unique — on normalise toujours vers les dièses)
export const ENHARMONICS = {
  "Db": "C#", "Eb": "D#", "Fb": "E",  "Gb": "F#",
  "Ab": "G#", "Bb": "A#", "Cb": "B",
};

// Noms français des notes (pour l'affichage en mode "french")
export const NOTES_FR = {
  "C": "Do", "C#": "Do#", "D": "Ré", "D#": "Ré#",
  "E": "Mi", "F": "Fa", "F#": "Fa#", "G": "Sol",
  "G#": "Sol#", "A": "La", "A#": "La#", "B": "Si",
};

// Cordes à vide — de la corde 1 (Mi aigu) à la corde 6 (Mi grave)
// Convention Guitar Path : corde 6 = Mi grave (gauche), corde 1 = Mi aigu (droite)
export const OPEN_STRINGS = {
  1: "E",  // Mi aigu
  2: "B",  // Si
  3: "G",  // Sol
  4: "D",  // Ré
  5: "A",  // La
  6: "E",  // Mi grave
};

// Cases avec repères visuels (points incrustés sur le manche)
export const MARKER_FRETS = [3, 5, 7, 9];
export const DOUBLE_MARKER_FRETS = [12];

// ───────────────────────────────────────────────────────────────────────────
// GAMMES — intervalles en demi-tons depuis la fondamentale
// ───────────────────────────────────────────────────────────────────────────
export const SCALES = {
  // Gammes majeures / mineures
  "major":              { name: "Majeure",              intervals: [0, 2, 4, 5, 7, 9, 11] },
  "natural_minor":      { name: "Mineure naturelle",    intervals: [0, 2, 3, 5, 7, 8, 10] },
  "harmonic_minor":     { name: "Mineure harmonique",   intervals: [0, 2, 3, 5, 7, 8, 11] },
  "melodic_minor":      { name: "Mineure mélodique",    intervals: [0, 2, 3, 5, 7, 9, 11] },

  // Pentatoniques
  "pentatonic_major":   { name: "Pentatonique majeure", intervals: [0, 2, 4, 7, 9] },
  "pentatonic_minor":   { name: "Pentatonique mineure", intervals: [0, 3, 5, 7, 10] },
  "blues":              { name: "Blues",                intervals: [0, 3, 5, 6, 7, 10] },

  // Modes de la gamme majeure
  "dorian":             { name: "Dorien",               intervals: [0, 2, 3, 5, 7, 9, 10] },
  "phrygian":           { name: "Phrygien",             intervals: [0, 1, 3, 5, 7, 8, 10] },
  "lydian":             { name: "Lydien",               intervals: [0, 2, 4, 6, 7, 9, 11] },
  "mixolydian":         { name: "Mixolydien",           intervals: [0, 2, 4, 5, 7, 9, 10] },
  "locrian":            { name: "Locrien",              intervals: [0, 1, 3, 5, 6, 8, 10] },

  // Gammes exotiques utiles
  "whole_tone":         { name: "Tons entiers",         intervals: [0, 2, 4, 6, 8, 10] },
  "diminished":         { name: "Diminuée (T-ST)",      intervals: [0, 2, 3, 5, 6, 8, 9, 11] },
};

// ───────────────────────────────────────────────────────────────────────────
// ACCORDS — intervalles en demi-tons depuis la fondamentale
// ───────────────────────────────────────────────────────────────────────────
export const CHORD_TYPES = {
  // Triades
  "maj":    { name: "Majeur",          intervals: [0, 4, 7] },
  "min":    { name: "Mineur",          intervals: [0, 3, 7] },
  "dim":    { name: "Diminué",         intervals: [0, 3, 6] },
  "aug":    { name: "Augmenté",        intervals: [0, 4, 8] },
  "sus2":   { name: "Sus2",            intervals: [0, 2, 7] },
  "sus4":   { name: "Sus4",            intervals: [0, 5, 7] },

  // Tétrades
  "maj7":   { name: "Maj7",            intervals: [0, 4, 7, 11] },
  "min7":   { name: "Mineur 7",        intervals: [0, 3, 7, 10] },
  "dom7":   { name: "Dominante 7",     intervals: [0, 4, 7, 10] },
  "min7b5": { name: "Mi-diminué (ø)",  intervals: [0, 3, 6, 10] },
  "dim7":   { name: "Diminué 7",       intervals: [0, 3, 6, 9] },
  "maj9":   { name: "Maj9",            intervals: [0, 4, 7, 11, 14] },
  "min9":   { name: "Mineur 9",        intervals: [0, 3, 7, 10, 14] },
  "add9":   { name: "Add9",            intervals: [0, 4, 7, 14] },
};

// ───────────────────────────────────────────────────────────────────────────
// NOMS DES INTERVALLES
// ───────────────────────────────────────────────────────────────────────────
export const INTERVAL_NAMES = {
  0:  { short: "R",   name: "Fondamentale",   fr: "Fondamentale" },
  1:  { short: "b2",  name: "Minor 2nd",      fr: "Seconde mineure" },
  2:  { short: "2",   name: "Major 2nd",      fr: "Seconde majeure" },
  3:  { short: "b3",  name: "Minor 3rd",      fr: "Tierce mineure" },
  4:  { short: "3",   name: "Major 3rd",      fr: "Tierce majeure" },
  5:  { short: "4",   name: "Perfect 4th",    fr: "Quarte juste" },
  6:  { short: "b5",  name: "Dim 5th",        fr: "Triton" },
  7:  { short: "5",   name: "Perfect 5th",    fr: "Quinte juste" },
  8:  { short: "b6",  name: "Minor 6th",      fr: "Sixte mineure" },
  9:  { short: "6",   name: "Major 6th",      fr: "Sixte majeure" },
  10: { short: "b7",  name: "Minor 7th",      fr: "Septième mineure" },
  11: { short: "7",   name: "Major 7th",      fr: "Septième majeure" },
  12: { short: "8",   name: "Octave",         fr: "Octave" },
  14: { short: "9",   name: "Major 9th",      fr: "Neuvième majeure" },
};

// ═══════════════════════════════════════════════════════════════════════════
// HELPERS — FONCTIONS PURES
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Normalise une note vers sa forme sharp canonique.
 * "Bb" → "A#", "Do" → "C", etc.
 */
export function normalizeNote(note) {
  if (!note) return null;
  // Conversion depuis le français
  const frToEn = Object.fromEntries(Object.entries(NOTES_FR).map(([en, fr]) => [fr, en]));
  if (frToEn[note]) return frToEn[note];
  // Résolution des bémols
  if (ENHARMONICS[note]) return ENHARMONICS[note];
  return note;
}

/**
 * Retourne la note à une position donnée du manche.
 * @param {number} string - Numéro de corde (1=Mi aigu, 6=Mi grave)
 * @param {number} fret   - Numéro de case (0=corde à vide)
 * @returns {string} - Note (ex: "C#")
 */
export function getNoteAtPosition(string, fret) {
  const openNote = OPEN_STRINGS[string];
  if (!openNote) return null;
  const openIdx = CHROMATIC_NOTES.indexOf(openNote);
  return CHROMATIC_NOTES[(openIdx + fret) % 12];
}

/**
 * Retourne toutes les positions (string, fret) d'une note donnée.
 * @param {string} note        - Note à chercher (ex: "C", "F#")
 * @param {number} maxFret     - Case maximum (défaut 12)
 * @param {number[]} strings   - Cordes à inclure (défaut toutes)
 * @returns {Array<{string, fret}>}
 */
export function getPositionsOfNote(note, maxFret = 12, strings = [1, 2, 3, 4, 5, 6]) {
  const target = normalizeNote(note);
  const positions = [];
  for (const s of strings) {
    for (let f = 0; f <= maxFret; f++) {
      if (getNoteAtPosition(s, f) === target) {
        positions.push({ string: s, fret: f });
      }
    }
  }
  return positions;
}

/**
 * Retourne les notes d'une gamme pour une fondamentale donnée.
 * @param {string} root      - Fondamentale (ex: "A", "G#")
 * @param {string} scaleKey  - Clé de SCALES (ex: "pentatonic_minor")
 * @returns {string[]}       - Liste de notes (ex: ["A", "C", "D", "E", "G"])
 */
export function getScaleNotes(root, scaleKey) {
  const scale = SCALES[scaleKey];
  if (!scale) return [];
  const rootNorm = normalizeNote(root);
  const rootIdx = CHROMATIC_NOTES.indexOf(rootNorm);
  if (rootIdx === -1) return [];
  return scale.intervals.map(interval => CHROMATIC_NOTES[(rootIdx + interval) % 12]);
}

/**
 * Retourne les notes d'un accord pour une fondamentale donnée.
 * @param {string} root       - Fondamentale (ex: "C", "A")
 * @param {string} chordType  - Clé de CHORD_TYPES (ex: "min7")
 * @returns {string[]}
 */
export function getChordNotes(root, chordType) {
  const chord = CHORD_TYPES[chordType];
  if (!chord) return [];
  const rootNorm = normalizeNote(root);
  const rootIdx = CHROMATIC_NOTES.indexOf(rootNorm);
  if (rootIdx === -1) return [];
  return chord.intervals.map(interval => CHROMATIC_NOTES[(rootIdx + interval) % 12]);
}

/**
 * Retourne toutes les positions d'une gamme sur le manche.
 * @param {string} root      - Fondamentale
 * @param {string} scaleKey  - Clé de SCALES
 * @param {number} maxFret   - Case max (défaut 12)
 * @returns {Array<{string, fret, note, interval, degree}>}
 */
export function getScalePositions(root, scaleKey, maxFret = 12) {
  const scale = SCALES[scaleKey];
  if (!scale) return [];
  const scaleNotes = getScaleNotes(root, scaleKey);
  const rootNorm = normalizeNote(root);
  const rootIdx = CHROMATIC_NOTES.indexOf(rootNorm);

  const positions = [];
  for (let s = 1; s <= 6; s++) {
    for (let f = 0; f <= maxFret; f++) {
      const note = getNoteAtPosition(s, f);
      const noteIdx = CHROMATIC_NOTES.indexOf(note);
      if (scaleNotes.includes(note)) {
        // Calcul de l'intervalle en demi-tons depuis la fondamentale
        const semitones = (noteIdx - rootIdx + 12) % 12;
        const degreeIdx = scale.intervals.indexOf(semitones);
        positions.push({
          string: s,
          fret: f,
          note,
          interval: semitones,
          // Degré dans la gamme (1-based), ex: 1 = fondamentale, 5 = quinte
          degree: degreeIdx + 1,
          isRoot: note === rootNorm,
        });
      }
    }
  }
  return positions;
}

/**
 * Retourne toutes les positions des notes d'un accord sur le manche.
 * @param {string} root      - Fondamentale
 * @param {string} chordType - Clé de CHORD_TYPES
 * @param {number} maxFret   - Case max (défaut 12)
 * @returns {Array<{string, fret, note, interval, isRoot}>}
 */
export function getChordPositions(root, chordType, maxFret = 12) {
  const chord = CHORD_TYPES[chordType];
  if (!chord) return [];
  const chordNotes = getChordNotes(root, chordType);
  const rootNorm = normalizeNote(root);
  const rootIdx = CHROMATIC_NOTES.indexOf(rootNorm);

  const positions = [];
  for (let s = 1; s <= 6; s++) {
    for (let f = 0; f <= maxFret; f++) {
      const note = getNoteAtPosition(s, f);
      const noteIdx = CHROMATIC_NOTES.indexOf(note);
      if (chordNotes.includes(note)) {
        const semitones = (noteIdx - rootIdx + 12) % 12;
        const degreeIdx = chord.intervals.indexOf(semitones);
        positions.push({
          string: s,
          fret: f,
          note,
          interval: semitones,
          degree: degreeIdx + 1,
          isRoot: note === rootNorm,
        });
      }
    }
  }
  return positions;
}

/**
 * Calcule l'intervalle en demi-tons entre deux notes.
 * @param {string} from - Note de départ
 * @param {string} to   - Note d'arrivée
 * @returns {number}    - Nombre de demi-tons (0-11)
 */
export function getInterval(from, to) {
  const a = CHROMATIC_NOTES.indexOf(normalizeNote(from));
  const b = CHROMATIC_NOTES.indexOf(normalizeNote(to));
  if (a === -1 || b === -1) return null;
  return (b - a + 12) % 12;
}

/**
 * Retourne le nom français d'une note.
 * @param {string} note - Note en notation anglaise (ex: "C#")
 * @returns {string}    - "Do#"
 */
export function noteToFr(note) {
  return NOTES_FR[normalizeNote(note)] || note;
}

/**
 * Retourne les positions pour un set de notes surlignées (usage direct dans <Fretboard />).
 * @param {string[]} notes   - Liste de notes à afficher (ex: ["C", "E", "G"])
 * @param {number}   maxFret - Case max
 * @returns {Array<{string, fret, note, isRoot}>}
 */
export function getHighlightPositions(notes, maxFret = 12) {
  if (!notes || notes.length === 0) return [];
  const normalized = notes.map(normalizeNote);
  const positions = [];
  for (let s = 1; s <= 6; s++) {
    for (let f = 0; f <= maxFret; f++) {
      const note = getNoteAtPosition(s, f);
      if (normalized.includes(note)) {
        positions.push({
          string: s,
          fret: f,
          note,
          isRoot: f === 0 ? false : undefined, // le caller peut surcharger
        });
      }
    }
  }
  return positions;
}

/**
 * Génère un manche complet sous forme de tableau 2D.
 * Retourne notes[string][fret] pour tout le manche.
 * @param {number} maxFret
 * @returns {Object} - { [string]: { [fret]: string } }
 */
export function buildFretboardMap(maxFret = 12) {
  const map = {};
  for (let s = 1; s <= 6; s++) {
    map[s] = {};
    for (let f = 0; f <= maxFret; f++) {
      map[s][f] = getNoteAtPosition(s, f);
    }
  }
  return map;
}

// ═══════════════════════════════════════════════════════════════════════════
// QUIZ HELPERS
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Génère les positions correctes pour un quiz "Trouve toutes les X".
 * @param {string} targetNote - Note à trouver
 * @param {number} maxFret
 * @returns {Array<{string, fret}>}
 */
export function getQuizTargetPositions(targetNote, maxFret = 12) {
  return getPositionsOfNote(targetNote, maxFret);
}

/**
 * Vérifie si un clic utilisateur correspond à une position correcte.
 * @param {number} clickedString
 * @param {number} clickedFret
 * @param {Array<{string, fret}>} correctPositions
 * @returns {boolean}
 */
export function isCorrectPosition(clickedString, clickedFret, correctPositions) {
  return correctPositions.some(p => p.string === clickedString && p.fret === clickedFret);
}

/**
 * Vérifie si toutes les positions correctes ont été trouvées.
 * @param {Array<{string, fret}>} selected  - Ce que l'utilisateur a cliqué
 * @param {Array<{string, fret}>} correct   - Les bonnes réponses
 * @returns {{ complete: boolean, misses: number, extras: number }}
 */
export function checkQuizCompletion(selected, correct) {
  const hits = selected.filter(s => isCorrectPosition(s.string, s.fret, correct));
  const extras = selected.length - hits.length;
  return {
    complete: hits.length === correct.length && extras === 0,
    found: hits.length,
    total: correct.length,
    misses: correct.length - hits.length,
    extras,
  };
}
