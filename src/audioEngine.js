// Groply — src/audioEngine.js
// Moteur audio Tone.js + samples FatBoy acoustic_guitar_steel
// Noms de fichiers : Ab2.mp3, Bb3.mp3, Db4.mp3, Eb3.mp3, Gb3.mp3 (convention bemols)

// ── Tone.js est chargé DYNAMIQUEMENT ──────────────────────────────────────
// Avant : `import * as Tone from "tone"` en statique. Comme audioEngine était
// importé par EarTraining, FretboardExplorer, QuizScreen et ToolboxScreen —
// tous préchargés au démarrage — Tone.js (~200 Ko gzip) se retrouvait dans le
// chemin critique du premier écran, y compris pour quelqu'un qui ne jouera
// jamais une note.
let Tone = null;
let tonePromise = null;

async function chargerTone() {
  if (Tone) return Tone;
  if (!tonePromise) tonePromise = import("tone").then(m => { Tone = m; return m; });
  return tonePromise;
}

/** Vrai si Tone.js est déjà en mémoire (permet d'éviter un await inutile). */
export const isToneReady = () => Tone !== null;

// fretboardUtils, en revanche, est importé STATIQUEMENT : le module n'importe
// rien lui-même (aucun risque de cycle), il est léger, et les 4
// `await import("./fretboardUtils.js")` qu'il y avait ici créaient une requête
// réseau déclenchée au moment du clic, capable d'échouer silencieusement
// (chunk manquant, souci de cache) sans aucune erreur visible.
// C'était la cause du "la suite d'accords ne joue aucun son" : playProgression
// est la seule fonction de lecture à en dépendre au moment de l'appel, alors
// que playChord et playInterval n'en ont pas besoin — d'où le fait que les
// autres modes fonctionnaient et que celui-là, spécifiquement, restait muet.
import { CHORD_TYPES, normalizeNote, getScaleNotes, getChordNotes } from "./fretboardUtils.js";

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

/**
 * URLs complètes des samples — utilisées par les Réglages pour proposer
 * « rendre l'audio disponible hors-ligne » (le service worker les met alors
 * en cache). Le precache automatique serait plusieurs mégaoctets imposés sur
 * le réseau mobile de l'utilisateur : ça se demande.
 */
export const listSampleUrls = () => Object.values(SAMPLE_URLS).map(f => BASE_URL + f);
export const SAMPLE_COUNT = Object.keys(SAMPLE_URLS).length;

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
const DEV = typeof import.meta !== "undefined" && import.meta.env?.DEV;
const warn = (...a) => { if (DEV) console.warn("[audioEngine]", ...a); };

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
  // IMPORTANT : en cas d'échec, `loadPromise` est remis à null (voir plus
  // bas). Avant, la promesse rejetée restait mémorisée : si le premier
  // chargement échouait — réseau coupé, un .mp3 manquant — `ensureLoaded()`
  // renvoyait false pour le reste de la session. Plus aucun son jusqu'au
  // rechargement complet de l'app, et sans aucun message.
  loadPromise = (async () => {
    await chargerTone();
    return new Promise((resolve, reject) => {
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
          warn("Erreur samples:", err);
          reject(err);
        },
      }).connect(reverb);

    } catch (err) {
      loadError = err;
      reject(err);
    }
    });
  })();

  loadPromise.catch(() => { loadPromise = null; isLoaded = false; });
  return loadPromise;
}

/** Remet le moteur à zéro pour permettre une nouvelle tentative. */
export function resetAudio() {
  try { sampler?.dispose?.(); } catch { /* noop */ }
  sampler = null; loadPromise = null; isLoaded = false; loadError = null;
}

/**
 * À appeler EN PREMIER dans le gestionnaire d'appui, avant toute autre
 * opération asynchrone.
 *
 * iOS Safari exige que l'AudioContext soit créé ou reprix à l'intérieur d'un
 * geste utilisateur direct. L'ancienne version faisait :
 *     await loadAudio();          // téléchargement de ~60 samples
 *     await Tone.start();         // ← la chaîne du geste est déjà rompue
 * Symptôme classique : « il faut appuyer deux fois pour avoir du son ».
 *
 * On démarre donc le contexte d'abord, on charge ensuite.
 */
export async function unlockAudio() {
  try {
    await chargerTone();
    if (Tone.context.state !== "running") await Tone.start();
    return Tone.context.state === "running";
  } catch { return false; }
}

async function ensureLoaded() {
  try {
    await chargerTone();
  } catch { return false; }

  // Le contexte d'abord — y compris l'état "interrupted" propre à iOS (appel
  // entrant, retrait du casque, dialogue système), que Tone.context.resume()
  // ne traite pas : cf. Tone.js #767.
  const etat = Tone.context.state;
  if (etat !== "running") {
    try {
      await Tone.start();
      if (Tone.context.state !== "running") await Tone.context.rawContext?.resume?.();
    } catch { /* on tente quand même la lecture */ }
  }

  if (!isLoaded) {
    try { await loadAudio(); } catch { return false; }
  }
  return isLoaded;
}

/**
 * Met le contexte audio en veille quand l'app passe en arrière-plan.
 * Sans ça, l'AudioContext continue de tourner et consomme de la batterie
 * pendant que l'écran est éteint.
 */
if (typeof document !== "undefined") {
  document.addEventListener("visibilitychange", () => {
    if (!Tone) return;
    try {
      if (document.visibilityState === "hidden") {
        stopProgression();
        sampler?.releaseAll?.();
        Tone.context.rawContext?.suspend?.();
      }
    } catch { /* noop */ }
  });
}

// ─────────────────────────────────────────────────────────────────────────
// API PUBLIQUE
// ─────────────────────────────────────────────────────────────────────────

export async function playNote(note, duration = "4n") {
  if (!await ensureLoaded()) return;
  try { sampler.triggerAttackRelease(note, duration); }
  catch (e) { warn("playNote:", e); }
}

export async function playChord(notes, duration = "2n", opts = {}) {
  if (!await ensureLoaded()) return;
  const { strum = true, direction = "down", spread = 0.026 } = opts;
  try {
    if (!strum) { sampler.triggerAttackRelease(notes, duration); return; }
    strumInto(notes, duration, Tone.now(), direction, spread);
  }
  catch (e) { warn("playChord:", e); }
}

/**
 * Joue une gamme note à note.
 * @param onStep(index, note) appelé À CHAQUE note, synchronisé sur l'horloge
 *        AUDIO via Tone.Draw — pas sur un minuteur séparé, qui dériverait et
 *        désynchroniserait l'affichage du son.
 */
export async function playScale(notes, bpm = 80, onStep) {
  if (!await ensureLoaded()) return;
  const spb = 60 / bpm;
  try {
    const now = Tone.now();
    notes.forEach((note, i) => {
      const t = now + i * spb;
      sampler.triggerAttackRelease(note, spb * 0.85, t);
      if (onStep) Tone.Draw.schedule(() => onStep(i, note), t);
    });
    // Signale la fin, pour éteindre le dernier surlignage.
    if (onStep) Tone.Draw.schedule(() => onStep(-1, null), now + notes.length * spb);
  } catch (e) { warn("playScale:", e); }
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
  } catch (e) { warn("playInterval:", e); }
}

// Joue une gamme depuis root + scaleKey (utilise fretboardUtils)
export async function playScaleFromRoot(root, scaleKey, bpm = 80, onStep) {
  const notes = getScaleNotes(root, scaleKey);
  if (!notes.length) return;
  const toneNotes = notes.map((note, i) => toToneNote(note, i < 5 ? 3 : 4));
  // On renvoie le NOM de la note (Do, Ré...), pas la note Tone.js avec son
  // octave : c'est le nom qui permet d'illuminer toutes ses positions sur
  // le manche.
  await playScale(toneNotes, bpm, onStep ? (i) => onStep(i, notes[i] ?? null) : undefined);
  return notes;
}

/**
 * Arpège un accord : ses notes une par une, en montant.
 *
 * Pour un accord PLAQUÉ, illuminer le manche n'apporte rien — toutes les
 * notes sonnent, donc tout s'allume, ce qui revient à l'affichage statique.
 * Arpégé, en revanche, on entend chaque degré séparément et on voit
 * exactement quelle case le produit. C'est la façon dont on apprend une
 * forme d'accord.
 */
export async function playArpeggioFromRoot(root, chordType, bpm = 132, onStep) {
  const names = getChordNotes(root, chordType);
  if (!names.length) return;
  // Empilement ascendant sur deux octaves pour rester dans une tessiture
  // confortable, quel que soit le nombre de notes de l'accord.
  const toneNotes = names.map((n, i) => toToneNote(n, i < 3 ? 3 : 4));
  await playScale(toneNotes, bpm, onStep ? (i) => onStep(i, names[i] ?? null) : undefined);
  return names;
}

// Joue un accord depuis root + chordType
export async function playChordFromRoot(root, chordType, onStep) {
  const intervals = CHORD_TYPES[chordType]?.intervals;
  if (!intervals) return;
  const voiced = buildVoicingFromIntervals(normalizeNote(root), intervals);
  await playChord(voiced, "2n");
  // Un accord sonne d'un bloc : on illumine donc TOUTES ses notes ensemble,
  // puis on éteint. Le grattage étale les cordes sur ~26 ms, trop court pour
  // qu'un surlignage note par note soit lisible.
  if (onStep) {
    const names = getChordNotes(root, chordType);
    onStep(0, names);
    setTimeout(() => onStep(-1, null), 1400);
  }
}

// ─────────────────────────────────────────────────────────────────────────
// PROGRESSION D'ACCORDS — enchaîne plusieurs accords, en boucle, avec un
// callback synchronisé sur l'audio (Tone.Draw) pour surligner l'accord en
// cours dans l'interface sans dépendre d'un minuteur séparé qui dériverait.
// ─────────────────────────────────────────────────────────────────────────
let progressionSeq = null;
let progressionTimer = null;

export async function playProgression(chords, secondsPerChord = 1.5, onStep) {
  if (!await ensureLoaded()) return;
  stopProgression();
  const voicedChords = chords.map(({ root, type }) =>
    buildVoicingFromIntervals(normalizeNote(root), CHORD_TYPES[type]?.intervals || [])
  );
  // Scheduling direct depuis Tone.now(), sans Tone.Sequence ni Transport.
  // Sequence + Transport imposait un état global partagé : après un
  // stop()/cancel(), le transport gardait sa position et refusait de
  // redémarrer proprement, d'où des relances silencieuses. strumInto()
  // planifie déjà ses notes dans le contexte audio, le Transport n'apportait
  // rien ici — et un accord de plus ne justifie pas une horloge globale.
  const start = Tone.now() + 0.05;
  voicedChords.forEach((voiced, idx) => {
    // Alternance du sens de grattage (bas / haut), comme un vrai jeu
    // rythmique plutôt que le même coup identique en boucle.
    const direction = idx % 2 === 0 ? "down" : "up";
    // Micro-décalage : quelques millisecondes d'imprécision, ce qui suffit
    // à sortir du rendu "machine" parfaitement métronomique.
    const humanize = (Math.random() - 0.5) * 0.012;
    const when = start + idx * secondsPerChord + humanize;
    strumInto(voiced, secondsPerChord * 0.9, when, direction);
    Tone.Draw.schedule(() => onStep?.(idx), when);
  });

  // Signale la fin, pour éteindre le dernier surlignage.
  const totalMs = voicedChords.length * secondsPerChord * 1000 + 300;
  progressionTimer = setTimeout(() => {
    progressionTimer = null;
    onStep?.(-1);
  }, totalMs);
}

export function stopProgression() {
  if (progressionTimer) { clearTimeout(progressionTimer); progressionTimer = null; }
  if (progressionSeq) {
    try { progressionSeq.stop(); progressionSeq.dispose(); } catch {}
    progressionSeq = null;
  }
  // Plus de Transport à arrêter : les notes sont planifiées directement dans
  // le contexte audio. On coupe simplement ce qui sonne encore.
  try { sampler?.releaseAll?.(); } catch { /* noop */ }
}

// ─────────────────────────────────────────────────────────────────────────
// FANFARES — récompenses sonores
// ─────────────────────────────────────────────────────────────────────────
// Choix de conception : pas de "ding" de synthé générique. On a une vraie
// guitare échantillonnée sous la main, donc la récompense est un geste de
// guitariste — un arpège très rapide en montant, joué léger, dans l'aigu.
// C'est ce qu'un prof fait spontanément quand un élève réussit son passage :
// il balance une petite fioriture. Ça reste dans l'univers de l'instrument
// au lieu de sonner comme une notification de téléphone.
//
// Règle importante : ces fanfares ne déclenchent JAMAIS le chargement des
// samples. Si l'audio n'est pas déjà en mémoire, on ne joue rien — imposer
// plusieurs mégaoctets de téléchargement pour un jingle de 400 ms serait
// absurde, surtout en 4G.

/** Joue une suite de notes très rapprochées, en fondu d'intensité. */
function fioriture(notes, { gap = 0.055, duration = "8n", from = 0.62, to = 0.30 } = {}) {
  if (!isLoaded || !sampler || !Tone) return false;
  const now = Tone.now() + 0.01;
  notes.forEach((note, i) => {
    // L'intensité décroît le long de la montée : le geste s'allège, comme
    // un vrai balayage au médiator qui finit en effleurement.
    const t = notes.length === 1 ? 0 : i / (notes.length - 1);
    const velocity = from + (to - from) * t;
    try { sampler.triggerAttackRelease(note, duration, now + i * gap, velocity); }
    catch { /* noop */ }
  });
  return true;
}

/**
 * Leçon terminée — arpège majeur avec neuvième, court et lumineux.
 * La neuvième (le Ré sur un accord de Do) est ce qui donne la couleur
 * "ouverte, ça continue" plutôt qu'un accord parfait qui referme la phrase.
 * C'est exactement le message : bravo, et enchaîne.
 */
export function playLessonComplete() {
  return fioriture(["C4", "E4", "G4", "D4"], { gap: 0.052, duration: "8n" });
}

/**
 * Unité validée — même idée, mais la montée va plus loin et se termine sur
 * l'octave : une phrase qui se referme, parce que là on a vraiment bouclé
 * quelque chose.
 */
export function playUnitComplete() {
  return fioriture(["C3", "G3", "C4", "E4", "G4", "C4"], { gap: 0.062, duration: "4n", to: 0.42 });
}

/** Coffre ouvert — deux notes tenues, plus larges, façon carillon. */
export function playChestOpen() {
  return fioriture(["G3", "D4"], { gap: 0.10, duration: "2n", from: 0.55, to: 0.45 });
}

/** Badge débloqué — quarte ascendante, courte et affirmative. */
export function playBadgeUnlocked() {
  return fioriture(["D4", "G4"], { gap: 0.085, duration: "4n", from: 0.58, to: 0.48 });
}

export function stopAll() {
  try { sampler?.releaseAll(); } catch {}
}

// ─────────────────────────────────────────────────────────────────────────
// ENTRAÎNEMENT DE L'OREILLE — génération de questions
// ─────────────────────────────────────────────────────────────────────────
export function generateEarTrainingQuestion(type = "interval") {
  const NOTES = ["C","C#","D","D#","E","F","F#","G","G#","A","A#","B"];
  const INTERVAL_NAMES = {
    3:  "Tierce mineure",
    4:  "Tierce majeure",
    5:  "Quarte juste",
    7:  "Quinte juste",
    9:  "Sixte majeure",
    10: "Septième mineure",
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
      { key: "maj",  label: "Major",    intervals: [0,4,7]    },
      { key: "min",  label: "Minor",    intervals: [0,3,7]    },
      { key: "dom7", label: "Dom7",     intervals: [0,4,7,10] },
      { key: "min7", label: "Minor 7",  intervals: [0,3,7,10] },
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
      play:    () => playChord(notes, "2n", { spread: 0.065 }),
    };
  }

  if (type === "chord_full") {
    // Identifier l'accord COMPLET : fondamentale ET qualite ("La mineur"),
    // pas seulement la qualite. Nettement plus exigeant que chord_quality,
    // qui demande juste "majeur ou mineur ?" sans jamais dire lequel.
    //
    // Pour que ce soit faisable, on donne d'abord un repere tonal : la
    // tonique est jouee seule avant l'accord. Sans ce repere, identifier
    // une fondamentale absolue releve de l'oreille absolue — une capacite
    // rare, qui ne s'entraine pas de cette facon.
    const qualities = [
      { key: "maj",  suffix: "",    intervals: [0,4,7]    },
      { key: "min",  suffix: "m",   intervals: [0,3,7]    },
      { key: "dom7", suffix: "7",        intervals: [0,4,7,10] },
      { key: "min7", suffix: "m7",       intervals: [0,3,7,10] },
    ];

    const rootIdx = Math.floor(Math.random() * 12);
    const root    = NOTES[rootIdx];
    const quality = qualities[Math.floor(Math.random() * qualities.length)];
    const notes   = quality.intervals.map((i, idx) =>
      toToneNote(NOTES[(rootIdx + i) % 12], idx === 0 ? 2 : 3)
    );
    const answerKey = root + "|" + quality.key;

    // Distracteurs choisis pour etre discriminants : on melange des
    // variantes de qualite sur la MEME fondamentale (le piege utile) et
    // des fondamentales voisines. Tirer 3 accords au hasard dans les 48
    // possibles rendrait la question triviale par elimination.
    const candidates = [];
    for (const q of qualities) {
      if (q.key !== quality.key) candidates.push({ root, quality: q });
    }
    for (const shift of [2, 5, 7, 9]) {
      const r = NOTES[(rootIdx + shift) % 12];
      candidates.push({ root: r, quality });
    }
    const distractors = candidates.sort(() => Math.random() - 0.5).slice(0, 3);

    const options = [{ root, quality }, ...distractors]
      .sort(() => Math.random() - 0.5)
      .map(c => ({
        key: c.root + "|" + c.quality.key,
        label: (c.root + c.quality.suffix) || c.root,
      }));

    // Note de reference FIXE (Do), et non la fondamentale de la reponse.
    // Ma premiere version jouait toToneNote(root, 3) — c'est-a-dire la
    // fondamentale de l'accord a identifier. Une reference doit etre un
    // point d'ancrage connu et invariable ; utiliser la note qu'on demande
    // de trouver n'a aucun sens. Elle est en plus OPTIONNELLE : l'accord
    // se joue directement, la reference n'arrive que si on la demande.
    const referenceNote = toToneNote("C", 3);

    return {
      type:    "chord_full",
      notes,
      root,
      answer:  answerKey,
      options,
      // Action principale : l'accord, directement.
      play:    () => playChord(notes, "2n", { spread: 0.065 }),
      // Aide optionnelle, declenchee par un bouton distinct.
      playReference: () => playNote(referenceNote, "2n"),
      referenceLabel: "Do",
    };
  }

  if (type === "progression") {
    // Suites d'accords courantes, en degres plutot qu'en notes fixes : la
    // question est transposee dans une tonalite aleatoire a chaque fois,
    // donc on ne peut pas la reussir en memorisant des hauteurs absolues.
    // C'est ce qui distingue la reconnaissance d'une PROGRESSION de celle
    // d'un accord isole : on ecoute les rapports entre accords, pas les
    // notes elles-memes.
    const progressions = [
      { key: "I-V-vi-IV",  label: "I - V - vi - IV",   degrees: [[0,"maj"],[7,"maj"],[9,"min"],[5,"maj"]] },
      { key: "ii-V-I",     label: "ii - V - I",        degrees: [[2,"min7"],[7,"dom7"],[0,"maj7"]] },
      { key: "I-IV-V",     label: "I - IV - V",        degrees: [[0,"maj"],[5,"maj"],[7,"maj"]] },
      { key: "i-iv-v",     label: "i - iv - v (mineur)", degrees: [[0,"min"],[5,"min"],[7,"min"]] },
      { key: "I-vi-IV-V",  label: "I - vi - IV - V",   degrees: [[0,"maj"],[9,"min"],[5,"maj"],[7,"maj"]] },
      // i - VI - III - VII : la suite "epique" (Zeppelin, metal, folk nordique).
      // En contexte mineur ces degres s'ecrivent en bemols (Abm, Eb, Bb en
      // Do mineur), mais l'affichage se fait en chiffres romains — donc
      // aucune ambiguite d'ecriture pour l'utilisateur.
      { key: "i-VI-III-VII", label: "i - VI - III - VII", degrees: [[0,"min"],[8,"maj"],[3,"maj"],[10,"maj"]] },
      // Deux suites ajoutees pour equilibrer les groupes : il faut au moins
      // 4 suites de MEME longueur pour pouvoir proposer 4 options qui ont
      // toutes le meme nombre d'accords que ce qui a ete joue.
      { key: "I-vi-ii-V",  label: "I - vi - ii - V",  degrees: [[0,"maj"],[9,"min"],[2,"min7"],[7,"dom7"]] },
      { key: "vi-IV-I",    label: "vi - IV - I",      degrees: [[9,"min"],[5,"maj"],[0,"maj"]] },
    ];

    const rootIdx = Math.floor(Math.random() * 12);
    const chosen  = progressions[Math.floor(Math.random() * progressions.length)];
    const chords  = chosen.degrees.map(([semi, type]) => ({
      root: NOTES[(rootIdx + semi) % 12],
      type,
    }));

    // Distracteurs de MEME LONGUEUR que la suite jouee. Sans ce filtre,
    // une suite de 3 accords pouvait avoir des options a 4 accords — le
    // simple comptage des accords entendus suffisait alors a eliminer des
    // reponses, sans rien ecouter d'harmonique.
    const sameLength = progressions.filter(
      p => p.key !== chosen.key && p.degrees.length === chosen.degrees.length
    );
    const distractors = sameLength.sort(() => Math.random() - 0.5).slice(0, 3);
    // Libelles NOMMES plutot qu'en chiffres romains : "La mineur - Fa - Do
    // - Sol" au lieu de "i - VI - III - VII". Les degres sont justes mais
    // demandent de connaitre la tonique pour etre utiles ; nommer les
    // accords rend la reponse directement lisible et verifiable a la
    // guitare. La tonalite etant tiree au hasard, chaque option doit etre
    // recalculee dans cette meme tonalite — sinon la bonne reponse serait
    // reconnaissable a sa seule tonique.
    const SUFFIX = { maj:"", min:"m", dom7:"7", maj7:"maj7", min7:"m7" };
    const nameProg = (p) => p.degrees
      .map(([semi, t]) => NOTES[(rootIdx + semi) % 12] + SUFFIX[t])
      .join(" - ");

    const options = [chosen, ...distractors]
      .sort(() => Math.random() - 0.5)
      .map(p => ({ key: p.key, label: nameProg(p), roman: p.label }));

    return {
      type:    "progression",
      chords,
      tonic:   NOTES[rootIdx],
      tonicFr: NOTES[rootIdx],
      roman:   chosen.label,
      answer:  chosen.key,
      options,
      // 1,6 s par accord : assez pour entendre chaque couleur sans perdre
      // le fil de la suite. Plus lent, la coherence harmonique se dissout.
      play:    () => playProgression(chords, 1.6),
    };
  }

  return null;
}

/**
 * Convertit une question d'oreille au format des questions de quiz.
 *
 * Le quiz attend { q, o: [libellés], a: index, exp }. L'entraînement d'oreille
 * produit { options, answer, play() }. Cet adaptateur fait le pont, ce qui
 * permet de mélanger théorie et oreille dans une même série — c'est
 * l'imprévisibilité qui rend le quiz vivant.
 *
 * @param mode "interval" | "chord_quality"
 */
export function makeEarQuizQuestion(mode = "interval") {
  const ear = generateEarTrainingQuestion(mode);
  if (!ear) return null;

  if (mode === "interval") {
    // INTERVAL_NAMES ne produit que des chaînes : les branches `label.fr` /
    // `label.short` de l'ancienne version ne pouvaient jamais s'exécuter, et
    // auraient masqué un changement de format au lieu de le signaler.
    const labels = ear.options.map(o => String(o.label));
    const answerIdx = ear.options.findIndex(o => o.semitones === ear.answer);
    if (answerIdx < 0) return null;
    return {
      id: `ear-int-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      type: "ear",
      courseId: "scales",
      lvl: 2,
      q: "Quel intervalle entends-tu ?",
      o: labels,
      a: answerIdx,
      exp: "Écoute la distance entre les deux notes : c'est elle qui définit l'intervalle.",
      play: ear.play,
    };
  }

  const labels = ear.options.map(o => o.label);
  const answerIdx = ear.options.findIndex(o => o.key === ear.answer);
  if (answerIdx < 0) return null;
  return {
    id: `ear-chord-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
    type: "ear",
    courseId: "harmony",
    lvl: 2,
    q: "Quelle est la couleur de cet accord ?",
    o: labels,
    a: answerIdx,
    exp: "La tierce décide du caractère majeur ou mineur ; la septième ajoute la tension.",
    play: ear.play,
  };
}
