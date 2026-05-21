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
      const reverb = new Tone.Reverb({ decay: 1.2, wet: 0.12 });
      reverb.toDestination();

      sampler = new Tone.Sampler({
        urls: SAMPLE_URLS,
        baseUrl: BASE_URL,
        release: 1.2,
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

export async function playChord(notes, duration = "2n") {
  if (!await ensureLoaded()) return;
  try { sampler.triggerAttackRelease(notes, duration); }
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
  const { getChordNotes } = await import("./fretboardUtils.js");
  const notes = getChordNotes(root, chordType);
  if (!notes.length) return;
  const voiced = notes.map((note, i) => toToneNote(note, i === 0 ? 2 : i <= 2 ? 3 : 4));
  await playChord(voiced);
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
