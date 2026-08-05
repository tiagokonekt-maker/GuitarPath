// GuitarPath -- src/audioEngine.js
// Moteur audio Tone.js + samples FatBoy acoustic_guitar_steel
// Noms de fichiers : Ab2.mp3, Bb3.mp3, Db4.mp3, Eb3.mp3, Gb3.mp3 (convention bemols)

import * as Tone from "tone";

// ─────────────────────────────────────────────────────────────────────────
// SAMPLES — noms exacts des fichiers dans public/audio/guitar/
// Convention FatBoy : bemols (Ab, Bb, Db, Eb, Gb) pas dièses
// ─────────────────────────────────────────────────────────────────────────
const SAMPLE_URLS = {
  "A2":  "A2.mp3",  "A3":  "A3.mp3",  "A4":  "A4.mp3",
  "B2":  "B2.mp3",  "B3":  "B3.mp3",  "B4":  "B4.mp3",
  "C2":  "C2.mp3",  "C3":  "C3.mp3",  "C4":  "C4.mp3",
  "D2":  "D2.mp3",  "D3":  "D3.mp3",  "D4":  "D4.mp3",
  "E2":  "E2.mp3",  "E3":  "E3.mp3",  "E4":  "E4.mp3",
  "F2":  "F2.mp3",  "F3":  "F3.mp3",  "F4":  "F4.mp3",
  "G2":  "G2.mp3",  "G3":  "G3.mp3",  "G4":  "G4.mp3",
  "Ab2": "Ab2.mp3", "Ab3": "Ab3.mp3", "Ab4": "Ab4.mp3",
  "Bb2": "Bb2.mp3", "Bb3": "Bb3.mp3", "Bb4": "Bb4.mp3",
  "Db2": "Db2.mp3", "Db3": "Db3.mp3", "Db4": "Db4.mp3",
  "Eb2": "Eb2.mp3", "Eb3": "Eb3.mp3", "Eb4": "Eb4.mp3",
  "Gb2": "Gb2.mp3", "Gb3": "Gb3.mp3", "Gb4": "Gb4.mp3",
};

const BASE_URL = "/audio/guitar/";

// ─────────────────────────────────────────────────────────────────────────
// CONVERSION : note GuitarPath (C#, D#...) -> notation Tone.js avec octave
// Tone.js accepte les deux : "C#4" ou "Db4"
// On utilise les bemols pour coller aux noms de fichiers
// ─────────────────────────────────────────────────────────────────────────
const SHARP_TO_FLAT = {
  "C#": "Db", "D#": "Eb", "F#": "Gb", "G#": "Ab", "A#": "Bb",
};

function toToneNote(note, octave) {
  const flat = SHARP_TO_FLAT[note];
  return `${flat || note}${octave}`;
}

const CHROMATIC = ["C","C#","D","D#","E","F","F#","G","G#","A","A#","B"];
const OPEN_STRINGS = { 1:"E4", 2:"B3", 3:"G3", 4:"D3", 5:"A2", 6:"E2" };

// ─────────────────────────────────────────────────────────────────────────
// VOICING GUITARE — un accord de guitare fait sonner 5 à 6 cordes, pas 3
// notes isolées. Un simple empilement de la triade sonne creux et
// synthétique ; on double la fondamentale et la tierce à l'octave pour
// retrouver l'épaisseur d'un vrai accord plaqué.
// ─────────────────────────────────────────────────────────────────────────
function midiOf(name, octave) { return CHROMATIC.indexOf(name) + 12 * (octave + 1); }
function fromMidi(midi) {
  return toToneNote(CHROMATIC[((midi % 12) + 12) % 12], Math.floor(midi / 12) - 1);
}

// Construit un empilement ASCENDANT (indispensable : un grattage parcourt
// les cordes de la plus grave à la plus aiguë, dans cet ordre).
// On part des INTERVALLES réels (0, 4, 7, 14, 17, 21...) et non des noms de
// notes : réduits à une octave, une onzième (17) serait indistinguable d'un
// sus4 (5), et une treizième (21) d'une sixte (9). L'information d'octave
// des extensions est ce qui fait toute leur couleur.
function buildVoicingFromIntervals(rootName, intervals, voices) {
  if (!intervals?.length) return [];
  let degrees = [...new Set(intervals)].sort((a, b) => a - b);
  // Une guitare a 6 cordes : un accord étendu ne peut pas tout faire sonner.
  // La quinte juste est le degré le plus dispensable (elle n'apporte aucune
  // couleur harmonique), c'est celle qu'un guitariste laisse tomber en
  // premier pour garder la fondamentale, la tierce, la septième et les
  // extensions qui caractérisent l'accord.
  if (degrees.length > 5) degrees = degrees.filter(d => d !== 7);
  const target = Math.min(6, Math.max(5, degrees.length + 1));
  const LOW = midiOf("C", 2), HIGH = midiOf("B", 4);
  const bass = midiOf(rootName, 2);
  // Décalage d'octave adaptatif : empiler l'accord une octave au-dessus de
  // la basse sonne mieux (basse dégagée, accord bien posé), mais sur une
  // fondamentale aiguë avec une 13e, ça sort de la plage échantillonnée et
  // l'extension — donc la couleur même de l'accord — serait perdue. Dans ce
  // cas on pose l'accord directement sur la basse.
  const span = Math.max(...degrees);
  const bump = (bass + span + 12 <= HIGH) ? 12 : 0;
  const rel = new Set([0]);
  let i = 0, guard = 0;
  while (rel.size < target && guard < 60) {
    const off = degrees[i % degrees.length];
    const val = off + bump + 12 * Math.floor(i / degrees.length);
    if (bass + val <= HIGH) rel.add(val);
    i++; guard++;
  }
  return [...rel]
    .sort((a, b) => a - b)
    .map(r => bass + r)
    .filter(m => m >= LOW && m <= HIGH)
    .map(fromMidi);
}

// ─────────────────────────────────────────────────────────────────────────
// GRATTAGE — étale les cordes dans le temps et fait varier l'intensité.
// C'est ce qui distingue le plus un accord "joué" d'un accord "déclenché" :
// à intensité identique et à la milliseconde près, l'oreille entend un
// orgue, pas une guitare.
// ─────────────────────────────────────────────────────────────────────────
function strumInto(notes, duration, when, direction = "down", spread = 0.026) {
  const ordered = direction === "down" ? notes : [...notes].reverse();
  const n = ordered.length;
  ordered.forEach((note, i) => {
    // Intensité : le médiator attaque un peu moins fort la première corde,
    // appuie au centre du mouvement, s'allège en fin de course.
    const curve = Math.sin(((i + 0.6) / n) * Math.PI);
    const velocity = Math.max(0.35, Math.min(1, 0.55 + curve * 0.35 + (Math.random() - 0.5) * 0.07));
    // Écart entre cordes légèrement irrégulier — un geste humain n'est
    // jamais parfaitement régulier.
    const jitter = (Math.random() - 0.5) * spread * 0.35;
    const t = when + i * spread + jitter;
    try { sampler.triggerAttackRelease(note, duration, t, velocity); } catch { /* noop */ }
  });
}

// Calcule la note Tone.js depuis corde + case
export function getToneNoteAtPosition(string, fret) {
  const open     = OPEN_STRINGS[string];
  const openNote = open.slice(0, -1);
  const openOct  = parseInt(open.slice(-1));
  const openIdx  = CHROMATIC.indexOf(openNote);
  const total    = openIdx + fret;
  return toToneNote(CHROMATIC[total % 12], openOct + Math.floor(total / 12));
}

// ─────────────────────────────────────────────────────────────────────────
// ETAT INTERNE
// ─────────────────────────────────────────────────────────────────────────
let sampler      = null;
let loadPromise  = null;
let isLoaded     = false;
let loadError    = null;

export function isAudioLoaded() { return isLoaded; }
export function getLoadError()  { return loadError; }

// ─────────────────────────────────────────────────────────────────────────
// CHARGEMENT
// ─────────────────────────────────────────────────────────────────────────
export function loadAudio() {
  if (loadPromise) return loadPromise;
  loadPromise = new Promise((resolve, reject) => {
    try {
      // Une guitare est toujours entendue dans une pièce. Un signal trop
      // sec et frontal sonne artificiel, même avec de vrais samples — un
      // peu plus d'espace et de longueur suffisent à replacer l'instrument
      // dans un lieu plutôt que dans un haut-parleur.
      const reverb = new Tone.Reverb({ decay: 1.9, wet: 0.19 });
      reverb.toDestination();

      sampler = new Tone.Sampler({
        urls: SAMPLE_URLS,
        baseUrl: BASE_URL,
        release: 1.6,
        onload: () => { isLoaded = true; resolve(true); },
        onerror: (err) => {
          loadError = err;
          console.warn("[audioEngine] Erreur samples:", err);
          reject(err);
        },
      }).connect(reverb);

    } catch (err) {
      loadError = err;
      reject(err);
    }
  });
  return loadPromise;
}

async function ensureLoaded() {
  if (!isLoaded) {
    try { await loadAudio(); } catch { return false; }
  }
  if (Tone.context.state !== "running") await Tone.start();
  return isLoaded;
}

// ─────────────────────────────────────────────────────────────────────────
// API PUBLIQUE
// ─────────────────────────────────────────────────────────────────────────

export async function playNote(note, duration = "4n") {
  if (!await ensureLoaded()) return;
  try { sampler.triggerAttackRelease(note, duration); }
  catch (e) { console.warn("[audioEngine] playNote:", e); }
}

export async function playChord(notes, duration = "2n", opts = {}) {
  if (!await ensureLoaded()) return;
  const { strum = true, direction = "down", spread = 0.026 } = opts;
  try {
    if (!strum) { sampler.triggerAttackRelease(notes, duration); return; }
    strumInto(notes, duration, Tone.now(), direction, spread);
  }
  catch (e) { console.warn("[audioEngine] playChord:", e); }
}

export async function playScale(notes, bpm = 80) {
  if (!await ensureLoaded()) return;
  const spb = 60 / bpm;
  try {
    const now = Tone.now();
    notes.forEach((note, i) => {
      sampler.triggerAttackRelease(note, spb * 0.85, now + i * spb);
    });
  } catch (e) { console.warn("[audioEngine] playScale:", e); }
}

export async function playInterval(note1, note2, mode = "ascending") {
  if (!await ensureLoaded()) return;
  try {
    const now = Tone.now();
    if (mode === "harmonic") {
      sampler.triggerAttackRelease([note1, note2], "2n", now);
    } else if (mode === "descending") {
      sampler.triggerAttackRelease(note2, "4n", now);
      sampler.triggerAttackRelease(note1, "4n", now + 0.65);
    } else {
      sampler.triggerAttackRelease(note1, "4n", now);
      sampler.triggerAttackRelease(note2, "4n", now + 0.65);
    }
  } catch (e) { console.warn("[audioEngine] playInterval:", e); }
}

// Joue une gamme depuis root + scaleKey (utilise fretboardUtils)
export async function playScaleFromRoot(root, scaleKey, bpm = 80) {
  const { getScaleNotes } = await import("./fretboardUtils.js");
  const notes = getScaleNotes(root, scaleKey);
  if (!notes.length) return;
  const toneNotes = notes.map((note, i) => toToneNote(note, i < 5 ? 3 : 4));
  await playScale(toneNotes, bpm);
}

// Joue un accord depuis root + chordType
export async function playChordFromRoot(root, chordType) {
  const { CHORD_TYPES, normalizeNote } = await import("./fretboardUtils.js");
  const intervals = CHORD_TYPES[chordType]?.intervals;
  if (!intervals) return;
  await playChord(buildVoicingFromIntervals(normalizeNote(root), intervals), "2n");
}

// ─────────────────────────────────────────────────────────────────────────
// PROGRESSION D'ACCORDS — enchaîne plusieurs accords, en boucle, avec un
// callback synchronisé sur l'audio (Tone.Draw) pour surligner l'accord en
// cours dans l'interface sans dépendre d'un minuteur séparé qui dériverait.
// ─────────────────────────────────────────────────────────────────────────
let progressionSeq = null;

export async function playProgression(chords, secondsPerChord = 1.5, onStep) {
  if (!await ensureLoaded()) return;
  stopProgression();
  const { CHORD_TYPES, normalizeNote } = await import("./fretboardUtils.js");
  const voicedChords = chords.map(({ root, type }) =>
    buildVoicingFromIntervals(normalizeNote(root), CHORD_TYPES[type]?.intervals || [])
  );
  progressionSeq = new Tone.Sequence((time, idx) => {
    // Alternance du sens de grattage (bas / haut) comme un vrai jeu
    // rythmique, plutôt que le même coup identique en boucle.
    const direction = idx % 2 === 0 ? "down" : "up";
    // Micro-décalage : quelques millisecondes d'imprécision, ce qui
    // suffit à sortir du rendu "machine" parfaitement métronomique.
    const humanize = (Math.random() - 0.5) * 0.012;
    strumInto(voicedChords[idx], secondsPerChord * 0.9, time + humanize, direction);
    Tone.Draw.schedule(() => onStep?.(idx), time);
  }, voicedChords.map((_, idx) => idx), secondsPerChord);
  progressionSeq.start(0);
  Tone.getTransport().start();
}

export function stopProgression() {
  if (progressionSeq) {
    try { progressionSeq.stop(); progressionSeq.dispose(); } catch {}
    progressionSeq = null;
  }
  try { Tone.getTransport().stop(); Tone.getTransport().cancel(); } catch {}
}

export function stopAll() {
  try { sampler?.releaseAll(); } catch {}
}

// ─────────────────────────────────────────────────────────────────────────
// EAR TRAINING — generation de questions
// ─────────────────────────────────────────────────────────────────────────
export function generateEarTrainingQuestion(type = "interval") {
  const NOTES = ["C","C#","D","D#","E","F","F#","G","G#","A","A#","B"];
  const INTERVAL_NAMES = {
    3:  "Tierce mineure",
    4:  "Tierce majeure",
    5:  "Quarte juste",
    7:  "Quinte juste",
    9:  "Sixte majeure",
    10: "Septieme mineure",
    12: "Octave",
  };

  if (type === "interval") {
    const intervals   = [3, 4, 5, 7, 9, 10, 12];
    const semitones   = intervals[Math.floor(Math.random() * intervals.length)];
    const rootIdx     = Math.floor(Math.random() * 12);
    const root        = NOTES[rootIdx];
    const topIdx      = (rootIdx + semitones) % 12;
    const top         = NOTES[topIdx];
    const octaveTop   = rootIdx + semitones >= 12 ? 4 : 3;
    const note1       = toToneNote(root, 3);
    const note2       = toToneNote(top, octaveTop);

    const distractors = intervals.filter(i => i !== semitones)
      .sort(() => Math.random() - 0.5).slice(0, 3);
    const options = [semitones, ...distractors]
      .sort(() => Math.random() - 0.5)
      .map(i => ({ semitones: i, label: INTERVAL_NAMES[i] }));

    return {
      type: "interval",
      note1, note2,
      answer: semitones,
      options,
      play: () => playInterval(note1, note2, "ascending"),
    };
  }

  if (type === "chord_quality") {
    const qualities = [
      { key: "maj",  label: "Majeur",   intervals: [0,4,7]    },
      { key: "min",  label: "Mineur",   intervals: [0,3,7]    },
      { key: "dom7", label: "Dom7",     intervals: [0,4,7,10] },
      { key: "min7", label: "Mineur 7", intervals: [0,3,7,10] },
    ];
    const rootIdx = Math.floor(Math.random() * 12);
    const root    = NOTES[rootIdx];
    const quality = qualities[Math.floor(Math.random() * qualities.length)];
    const notes   = quality.intervals.map((i, idx) => {
      return toToneNote(NOTES[(rootIdx + i) % 12], idx === 0 ? 2 : 3);
    });

    return {
      type:    "chord_quality",
      notes,
      answer:  quality.key,
      options: qualities.map(q => ({ key: q.key, label: q.label })),
      play:    () => playChord(notes),
    };
  }

  return null;
}
