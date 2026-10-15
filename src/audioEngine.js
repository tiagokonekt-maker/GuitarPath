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
  if (!tonePromise) tonePromise = import("tone").then(m => { adopterContexteDuGeste(m); Tone = m; return m; });
  return tonePromise;
}

// ── Déverrouillage iOS ────────────────────────────────────────────────────
// iOS n'autorise la (re)prise d'un AudioContext QUE dans la pile d'appel
// synchrone d'un geste. Or Tone.js est chargé à la demande : `await
// import("tone")` puis `Tone.start()` sortait du geste dès le premier appui,
// d'où le classique « il faut appuyer deux fois pour avoir du son ».
// On crée donc un AudioContext brut, synchrone, dans le geste, et on le donne
// à Tone une fois chargé (adopterContexteDuGeste).
let ctxGeste = null;

/**
 * Catégorie audio « lecture » (Safari 16.4+) : le son de l'app n'est plus
 * coupé par le bouton silencieux de l'iPhone, comme une app de musique.
 * Sans effet ailleurs.
 */
export function activerSessionAudio() {
  try {
    if (typeof navigator !== "undefined" && navigator.audioSession && navigator.audioSession.type !== "playback") {
      navigator.audioSession.type = "playback";
    }
  } catch { /* API absente ou refusée : rien à faire */ }
}

/** Partie SYNCHRONE du déverrouillage : à appeler avant tout await. */
function deverrouillerDansLeGeste() {
  activerSessionAudio();
  try {
    if (Tone) {
      // Tone déjà chargé : reprise immédiate, sans attendre quoi que ce soit.
      const ctx = Tone.getContext();
      if (ctx.state !== "running") ctx.resume().catch(() => {});
      return;
    }
    if (typeof window === "undefined") return;
    // Uniquement le constructeur standard : Tone ne sait pas adopter un
    // webkitAudioContext (iOS < 14.5), qui garde alors le chemin habituel.
    const AC = window.AudioContext;
    if (!AC) return;
    if (!ctxGeste || ctxGeste.state === "closed") ctxGeste = new AC({ latencyHint: "interactive" });
    if (ctxGeste.state !== "running") ctxGeste.resume().catch(() => {});
  } catch { /* le chargement normal de Tone prendra le relais */ }
}

/**
 * Tone.js crée son propre contexte à l'import. S'il n'a encore jamais
 * tourné (currentTime nul : aucun son n'y a jamais été joué, aucun autre
 * écran ne l'utilise), on le remplace par celui créé dans le geste, déjà
 * déverrouillé. Sinon (la Jam ou le métronome l'ont déjà démarré), on garde
 * celui de Tone et on ferme le nôtre : un seul contexte pour toute l'app.
 */
function adopterContexteDuGeste(T) {
  const brut = ctxGeste;
  ctxGeste = null;
  if (!brut) return;
  try {
    const actuel = T.getContext();
    if (actuel.state !== "running" && actuel.currentTime === 0 && brut.state !== "closed") {
      T.setContext(brut, true);
      return;
    }
  } catch { /* on garde le contexte de Tone */ }
  try { brut.close(); } catch { /* noop */ }
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
import { NOTES_DIESES_EN } from "./music/notes.js";
import {
  INTERVALLES, SENS, QUALITES, DEGRES_TONALITE, ORDRE_DEGRES, PROGRESSIONS, ORDRE_PROGRESSIONS,
  tirerIntervalle, tirerAccord, tirerAccordEnTonalite, tirerProgression, tirerDictee,
  accordDansLaTonalite, romainDe, midiVersTone, choisir as choisirO, melanger as melangerO,
} from "./store/oreille.js";
import { planifierTab } from "./tab/tabSon.js";

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
  // Octave 5 : la corde de Mi aigu au-delà de la case 7. Sans elle, ces
  // notes étaient obtenues en accélérant B4, d'où un timbre « chipmunk ».
  "C5":  "C5.mp3",  "Db5": "Db5.mp3", "D5":  "D5.mp3",  "Eb5": "Eb5.mp3",
  "E5":  "E5.mp3",  "F5":  "F5.mp3",  "Gb5": "Gb5.mp3", "G5":  "G5.mp3",
  "Ab5": "Ab5.mp3", "A5":  "A5.mp3",  "Bb5": "Bb5.mp3", "B5":  "B5.mp3",
};

// ── Moteur de cordes (lecteur de tablatures) ─────────────────────────────
// Le sampler déclenche des notes indépendantes : il ne sait ni faire
// glisser une hauteur, ni arrêter une note quand sa corde rejoue. Pour les
// tablatures, chaque note devient une VOIX qui lit l'échantillon de sa note
// de départ et fait varier sa vitesse de lecture pour changer de hauteur :
// vrais bends, vrais slides, hammer-on sans nouvelle attaque. Le plan
// (quand, combien de temps, quelle force, quelle courbe de hauteur) vient de
// tab/tabSon.js, testé à part.
let busGuitare = null;
let buffersCordes = null;          // Tone.ToneAudioBuffers, chargés à la demande
const voixCordes = new Set();      // voix actives, pour que stopAll() les coupe
// Numéro de la lecture en cours. stopAll() le change : une lecture qui se
// réveille APRÈS son chargement vérifie qu'elle est toujours la bonne. Sans
// ça, appuyer sur Arrêter pendant le chargement des échantillons ne servait
// à rien — la tab se jouait quand même une fois le chargement fini.
let generationTab = 0;
const NOMS_ECHANTILLONS = ["C", "Db", "D", "Eb", "E", "F", "Gb", "G", "Ab", "A", "Bb", "B"];
const MIDI_MIN_ECH = 36, MIDI_MAX_ECH = 83;   // C2 → B5 : un échantillon par demi-ton

const BASE_URL = "/audio/guitar/";

// ── Durées : ce qui permet à l'interface de savoir quand le son finit ─────
// L'écran d'entraînement devinait les durées (« 2000 ms pour un accord »,
// « n × 1600 + 400 pour une suite »). Ces valeurs ne tenaient pas compte de
// la queue de relâchement du sampler, d'où un bouton qui repassait en « play »
// alors que le son résonnait encore — et donc plus aucun moyen d'arrêter sur
// la fin. Chaque question porte désormais sa vraie durée, calculée ici.

/** Relâchement du sampler, en secondes. Une corde ne s'arrête pas net. */
export const RELEASE = 1.6;

/**
 * Durée pendant laquelle le bouton reste en « stop » après la dernière note,
 * en millisecondes.
 *
 * Elle est calée sur le relâchement COMPLET, et non sur une estimation de ce
 * qui reste « vraiment audible ». J'avais d'abord mis 700 ms en me disant que
 * le son passait sous le niveau d'écoute au-delà ; c'était un mauvais arbitrage.
 * Deux raisons de voir large :
 *
 *  • la réverbération (1,9 s de decay à 19 %) prolonge encore le son au-delà
 *    du relâchement du sampler ;
 *  • le pire des deux défauts n'est pas symétrique. Un bouton « stop » affiché
 *    sur une fin de résonance très faible ne coûte rien — au contraire, il
 *    laisse la possibilité de couper. Un bouton repassé en « play » alors qu'on
 *    entend encore quelque chose enlève cette possibilité : c'est exactement le
 *    défaut signalé.
 *
 * Dans le doute, on garde donc la main sur le son plus longtemps.
 */
export const QUEUE_AUDIBLE_MS = Math.round(RELEASE * 1000);

/**
 * Durée d'une valeur de note Tone.js en SECONDES, au tempo de référence
 * (120) — FIXE. Les lectures de ce module convertissent toujours leurs durées
 * avec cette fonction au lieu de passer "4n" à Tone : "4n" se lit au tempo
 * du Transport, que la Jam et le métronome modifient. Après une Jam à 70,
 * un intervalle durait 0,86 s au lieu de 0,5 s, et `durationMs` (calculé ici
 * à 120) ne correspondait plus au son.
 * Formes acceptées : nombre (secondes), "4n", "8n." (pointée), "8t"
 * (triolet), "1m" (mesure de 4 temps), "0.5" (secondes en texte).
 */
const RONDE_120 = 2;   // une ronde à 120 BPM, en secondes
function secondes(v) {
  if (typeof v === "number") return v;
  const m = /^(\d+(?:\.\d+)?)([nmt])(\.?)$/.exec(String(v ?? "").trim());
  if (m && parseFloat(m[1]) > 0) {
    const n = parseFloat(m[1]);
    let s = m[2] === "m" ? n * RONDE_120 : RONDE_120 / n;
    if (m[2] === "t") s *= 2 / 3;
    if (m[3]) s *= 1.5;
    return s;
  }
  const brut = parseFloat(v);
  return Number.isFinite(brut) ? brut : 1;
}
/** Exposé pour les tests : durée d'une valeur de note, en secondes (120 BPM fixe). */
export const dureeEnSecondes = secondes;

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

const CHROMATIC = NOTES_DIESES_EN;
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
function buildVoicingFromIntervals(rootName, intervals) {
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
function strumInto(notes, duration, when, direction = "down", spread = 0.026, cible = sampler) {
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
    try { cible.triggerAttackRelease(note, secondes(duration), t, velocity); } catch { /* noop */ }
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

// ── Sortie maître : ce qui permet de couper le son INSTANTANÉMENT ─────────
// La chaîne est : sampler → réverbération → sortie maître → haut-parleurs.
// Couper la sortie maître fait taire tout, y compris la queue de
// réverbération, en quelques millisecondes — sans toucher au réglage de
// relâchement du sampler, qui doit rester à 1,6 s pour que les accords
// résonnent naturellement en lecture normale.
let sortieMaitre = null;

// ── Registre des notes à venir ────────────────────────────────────────────
// Le vrai problème de « stop ne coupe pas » : une note remise au contexte
// audio (`triggerAttackRelease(note, duree, instantFutur)`) est IRRÉVOCABLE.
// `releaseAll()` ne relâche que ce qui sonne DÉJÀ ; la deuxième note d'un
// intervalle planifiée à +0,65 s, ou les notes suivantes d'une gamme,
// partaient donc quand même. C'est ce que tu as constaté en arrêtant entre
// les deux notes d'un intervalle.
//
// Deux mécanismes annulables : les notes passent par un bus propre à chaque
// lecture, que stopAll() ferme (voir nouvelleLecture, plus bas) ; les rappels
// d'interface (surlignage, curseur, fin) passent par des minuteurs JavaScript
// enregistrés ici.
let enAttente = [];

/** Programme une lecture différée, annulable par stopAll(). */
function differer(fn, ms) {
  if (ms <= 0) { fn(); return; }
  const id = setTimeout(() => {
    enAttente = enAttente.filter(x => x !== id);
    fn();
  }, ms);
  enAttente.push(id);
  return id;
}

/** Annule toutes les lectures différées non encore parties. */
function annulerEnAttente() {
  for (const id of enAttente) clearTimeout(id);
  enAttente = [];
}

// ── Lectures planifiées dans le temps AUDIO ───────────────────────────────
// Les minuteurs ci-dessus rendaient l'arrêt possible, mais au prix de la
// précision : un setTimeout peut glisser de 10 à 50 ms (onglet chargé,
// mobile en économie d'énergie), ce qui s'entend sur une dictée rythmique
// ou une gamme. Désormais chaque lecture (gamme, rythme, suite, intervalle)
// planifie TOUTES ses notes d'avance, à l'échantillon près, sur un sampler
// et un bus de gain qui lui sont propres. L'arrêt reste immédiat : stopAll()
// ferme ce bus et le libère, ce qui emporte les notes pas encore jouées.
// Le sampler de lecture ne coûte presque rien : il lit les buffers déjà
// décodés (chargerBuffersCordes), rien n'est rechargé.
let lectureEnCours = null;   // { sampler, bus }

function nouvelleLecture() {
  arreterLecturePlanifiee();
  const bus = new Tone.Gain(1).connect(busGuitare);
  const s = new Tone.Sampler({ urls: urlsCordes(buffersCordes), release: RELEASE }).connect(bus);
  lectureEnCours = { sampler: s, bus };
  return s;
}

function arreterLecturePlanifiee() {
  const l = lectureEnCours;
  lectureEnCours = null;
  if (!l || !Tone) return;
  try {
    const t = Tone.immediate();
    l.bus.gain.cancelScheduledValues(t);
    l.bus.gain.setValueAtTime(l.bus.gain.value, t);
    l.bus.gain.linearRampToValueAtTime(0, t + 0.008);
  } catch { /* noop */ }
  // Libération après la rampe : les notes futures disparaissent avec le bus.
  setTimeout(() => {
    try { l.sampler.dispose(); } catch { /* noop */ }
    try { l.bus.dispose(); } catch { /* noop */ }
  }, 60);
}

/** Départ d'une lecture planifiée : un peu d'avance pour tout planifier à temps. */
const departLecture = () => Tone.now() + 0.03;

/**
 * Rappel visuel synchronisé sur l'instant AUDIO `t` : minuteur calculé
 * depuis l'horloge audio (donc sans dérive cumulée), annulable par stopAll().
 */
function visuelA(t, fn) {
  differer(fn, Math.max(0, (t - Tone.immediate()) * 1000));
}

let restaurationTimer = null;

/**
 * Rouvre la sortie maître. Appelé au début de CHAQUE lecture : sans ça, une
 * lecture lancée juste après un stop resterait muette le temps de la
 * fenêtre de coupure.
 */
function reveillerSortie() {
  if (restaurationTimer) { clearTimeout(restaurationTimer); restaurationTimer = null; }
  if (!sortieMaitre || !Tone) return;
  try {
    sortieMaitre.gain.cancelScheduledValues(Tone.now());
    sortieMaitre.gain.value = 1;
  } catch { /* noop */ }
  try { if (sampler) sampler.release = RELEASE; } catch { /* noop */ }
}

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
    try {
      // Une nouvelle tentative repart d'une chaîne propre : sans ça, chaque
      // échec laissait une sortie et une réverbération orphelines.
      libererChaine();
      // Une guitare est toujours entendue dans une pièce. Un signal trop
      // sec et frontal sonne artificiel, même avec de vrais samples — un
      // peu plus d'espace et de longueur suffisent à replacer l'instrument
      // dans un lieu plutôt que dans un haut-parleur.
      // La sortie maître se place APRÈS la réverbération, pour que la coupure
      // emporte aussi la queue de réverb. Placée avant, on couperait les notes
      // mais la réverb continuerait de sonner une seconde et demie.
      sortieMaitre = new Tone.Gain(1).toDestination();
      const reverb = new Tone.Reverb({ decay: 1.9, wet: 0.19 });
      reverb.connect(sortieMaitre);
      busGuitare = reverb;   // les voix de corde de playTab passent par le même chemin

      // Les échantillons sont décodés UNE fois, dans les buffers partagés
      // avec le moteur de cordes (playTab). Avant, le Sampler et playTab
      // chargeaient chacun leur copie : deux fois la mémoire décodée.
      const buffers = await chargerBuffersCordes();
      sampler = new Tone.Sampler({
        urls: urlsCordes(buffers),
        release: RELEASE,
      }).connect(reverb);
      isLoaded = true;
      return true;
    } catch (err) {
      loadError = err;
      warn("Erreur samples:", err);
      throw err;
    }
  })();

  loadPromise.catch(() => { loadPromise = null; isLoaded = false; });
  return loadPromise;
}

/** Remet le moteur à zéro pour permettre une nouvelle tentative. */
export function resetAudio() {
  libererChaine();
  loadPromise = null; isLoaded = false; loadError = null;
}

/** Libère sampler, réverbération et sortie maître (pas les buffers partagés). */
function libererChaine() {
  arreterLecturePlanifiee();
  for (const n of [sampler, busGuitare, sortieMaitre]) {
    try { n?.dispose?.(); } catch { /* déjà libéré */ }
  }
  sampler = null; busGuitare = null; sortieMaitre = null;
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
  // Synchrone, AVANT le premier await : c'est ce qui garde le geste.
  deverrouillerDansLeGeste();
  try {
    await chargerTone();
    // Tone.getContext() et non Tone.context : ce dernier est figé à l'import
    // et ne suit pas le contexte adopté (adopterContexteDuGeste).
    if (Tone.getContext().state !== "running") await Tone.start();
    return Tone.getContext().state === "running";
  } catch { return false; }
}

async function ensureLoaded() {
  // Les fonctions de lecture appellent ensureLoaded() en premier : la partie
  // synchrone du déverrouillage s'exécute donc encore dans le geste, même
  // pour un appelant qui n'a pas appelé unlockAudio().
  deverrouillerDansLeGeste();
  try {
    await chargerTone();
  } catch { return false; }

  // Le contexte d'abord — y compris l'état "interrupted" propre à iOS (appel
  // entrant, retrait du casque, dialogue système), que Tone.context.resume()
  // ne traite pas : cf. Tone.js #767.
  const ctx = Tone.getContext();
  if (ctx.state !== "running") {
    try {
      await Tone.start();
      if (ctx.state !== "running") await ctx.rawContext?.resume?.();
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
    if (document.visibilityState !== "hidden") return;
    try {
      // On coupe ce que CE module a lancé : la suite d'accords en cours et
      // les cordes qui résonnent.
      stopProgression();
      sampler?.releaseAll?.();

      // On ne suspend SURTOUT PAS l'AudioContext.
      //
      // L'AudioContext est partagé avec tout le reste de l'application —
      // JamSession, le métronome de la boîte à outils — qui possèdent leur
      // propre transport et leurs propres instruments. Le suspendre ici
      // coupait leur lecture, et rien ne la réveillait : il suffisait de
      // changer d'onglet pendant un jam pour que le son disparaisse
      // définitivement, avec un bouton qui affichait toujours "en cours".
      //
      // Le gain de batterie ne valait pas ça, d'autant que le navigateur
      // limite déjà l'audio en arrière-plan et qu'iOS suspend le contexte
      // de lui-même quand l'app passe en fond.
    } catch { /* noop */ }
  });
}

// ─────────────────────────────────────────────────────────────────────────
// API PUBLIQUE
// ─────────────────────────────────────────────────────────────────────────

export async function playNote(note, duration = "4n") {
  if (!await ensureLoaded()) return;
  stopAll();
  reveillerSortie();
  try { sampler.triggerAttackRelease(note, secondes(duration), Tone.now()); }
  catch (e) { warn("playNote:", e); }
}

export async function playChord(notes, duration = "2n", opts = {}) {
  if (!await ensureLoaded()) return;
  // Un nouvel accord ÉCRASE le précédent. Avant, il fallait attendre la fin
  // de la résonance : cliquer sur un deuxième accord dans la boîte à outils ne
  // faisait rien tant que le premier sonnait.
  stopAll();
  reveillerSortie();
  const { strum = true, direction = "down", spread = 0.026 } = opts;
  const duree = secondes(duration);
  try {
    if (!strum) { sampler.triggerAttackRelease(notes, duree, Tone.now()); return; }
    strumInto(notes, duree, Tone.now(), direction, spread);
  }
  catch (e) { warn("playChord:", e); }
}

/**
 * Joue une gamme note à note.
 * Toutes les notes sont planifiées d'avance dans le temps audio (voir
 * nouvelleLecture) : aucune gigue de minuteur entre deux notes, et stopAll()
 * coupe toujours net.
 * @param onStep(index, note) appelé À CHAQUE note, à l'instant où elle sonne
 *        (minuteur calculé depuis l'horloge audio, voir visuelA).
 */
export async function playScale(notes, bpm = 80, onStep) {
  if (!await ensureLoaded()) return;
  stopAll();            // une nouvelle gamme écrase la précédente
  reveillerSortie();
  const spb = 60 / bpm;
  try {
    const s = nouvelleLecture();
    const t0 = departLecture();
    notes.forEach((note, i) => {
      const t = t0 + i * spb;
      try { s.triggerAttackRelease(note, spb * 0.85, t); } catch { /* noop */ }
      if (onStep) visuelA(t, () => onStep(i, note));
    });
    // Signale la fin, pour éteindre le dernier surlignage.
    if (onStep) visuelA(t0 + notes.length * spb, () => onStep(-1, null));
  } catch (e) { warn("playScale:", e); }
}

// ─────────────────────────────────────────────────────────────────────────
// ÉCOUTE — questions d'oreille et de rythme générées (store/generateurs.js)
// ─────────────────────────────────────────────────────────────────────────

/**
 * Instants (en secondes depuis le début) d'une dictée rythmique : 8 clics
 * (4 de décompte + 4 temps marqués) et les attaques de la mesure. Pur, sans
 * audio : testé à part (test/audioTiming.test.mjs).
 */
export function planRythme(spec) {
  const { bpm = 70, pas = 2, attaques = [], swing = false } = spec || {};
  const spb = 60 / bpm, t0 = 4 * spb;   // la mesure commence après le décompte
  const quand = (i) => {
    const temps = Math.floor(i / pas), sous = i % pas;
    const frac = swing && pas === 2 ? (sous === 0 ? 0 : 2 / 3) : sous / pas;
    return t0 + (temps + frac) * spb;
  };
  return {
    clics: Array.from({ length: 8 }, (_, b) => ({ t: b * spb, fort: b === 0 || b === 4 })),
    attaques: attaques.map(quand),
    duree: Math.max(0.08, (spb / pas) * (swing ? 0.6 : 0.8)),
    totalMs: 8 * spb * 1000,
  };
}

/**
 * Joue une mesure rythmique, précédée d'un décompte de 4 clics.
 * @param spec.bpm        tempo
 * @param spec.pas        cases par temps (2 = croches, 4 = doubles-croches)
 * @param spec.attaques   index des cases qui sonnent, sur une mesure de 4 temps
 * @param spec.swing      true = croches ternaires (longue-courte, rapport 2/3-1/3)
 * Tout est planifié dans le temps audio, sur le bus de la lecture : la
 * dictée tombe exactement en place, et stopAll() coupe net, même au milieu
 * du décompte. Les temps restent marqués par un clic léger pendant la
 * mesure, pour que l'élève sache toujours où est le « 1 ».
 * @returns la durée totale en millisecondes
 */
export async function playRythme(spec) {
  if (!await ensureLoaded()) return 0;
  stopAll();
  reveillerSortie();
  const { note = "A3", clic = "E5" } = spec || {};
  const plan = planRythme(spec);
  try {
    const s = nouvelleLecture();
    const t0 = departLecture();
    for (const c of plan.clics) {
      try { s.triggerAttackRelease(clic, 0.05, t0 + c.t, c.fort ? 0.5 : 0.3); } catch { /* noop */ }
    }
    for (const t of plan.attaques) {
      try { s.triggerAttackRelease(note, plan.duree, t0 + t, 0.85); } catch { /* noop */ }
    }
  } catch (e) { warn("playRythme:", e); }
  return plan.totalMs;
}

/**
 * Suite d'accords donnés NOTE PAR NOTE (pas par nom) : la question d'oreille
 * maîtrise exactement ce qui sonne, et les tests peuvent le vérifier.
 * Même grattage que le reste de l'app, planifié dans le temps audio.
 */
export async function playSuite(accords, secondesParAccord = 1.6) {
  if (!await ensureLoaded()) return;
  stopAll();
  reveillerSortie();
  try {
    const s = nouvelleLecture();
    const t0 = departLecture();
    accords.forEach((notes, i) => {
      try { strumInto(notes, secondesParAccord * 0.9, t0 + i * secondesParAccord, i % 2 ? "up" : "down", 0.026, s); } catch { /* noop */ }
    });
  } catch (e) { warn("playSuite:", e); }
}

// Dictée mélodique : accord de référence, puis la mélodie, note à note.
const MELODIE_ECART = 0.7;          // secondes entre deux notes (~86 BPM)
const MELODIE_DEPART = 1.6;         // la mélodie attend la fin du grattage de référence
const MELODIE_NOTE = 0.6;           // durée tenue de chaque note

/**
 * Durée d'une dictée mélodique, en millisecondes (calendrier de playMelodie,
 * relâchement compris). Pure : testée sans audio.
 */
export function dureeMelodieMs(nbNotes, avecReference = true) {
  const depart = avecReference ? MELODIE_DEPART : 0;
  return Math.round((depart + Math.max(0, nbNotes - 1) * MELODIE_ECART + MELODIE_NOTE) * 1000) + QUEUE_AUDIBLE_MS;
}

/**
 * Joue une mélodie (notes Tone.js), précédée d'un accord de référence qui
 * installe la tonalité. Tout est planifié dans le temps audio, sur le bus
 * de la lecture : l'écart entre les notes est exact, et stopAll() coupe net,
 * même entre deux notes.
 * @returns la durée totale en millisecondes
 */
export async function playMelodie(notes, { reference = null } = {}) {
  if (!await ensureLoaded()) return 0;
  stopAll();
  reveillerSortie();
  const avecRef = !!reference?.length;
  try {
    const s = nouvelleLecture();
    const t0 = departLecture();
    if (avecRef) strumInto(reference, MELODIE_DEPART * 0.85, t0, "down", 0.03, s);
    const debut = t0 + (avecRef ? MELODIE_DEPART : 0);
    notes.forEach((note, i) => {
      try { s.triggerAttackRelease(note, MELODIE_NOTE, debut + i * MELODIE_ECART, 0.85); } catch { /* noop */ }
    });
  } catch (e) { warn("playMelodie:", e); }
  return dureeMelodieMs(notes.length, avecRef);
}

/** Point d'entrée unique pour les questions d'écoute générées. */
export async function jouerEcoute(spec) {
  if (!spec) return;
  if (spec.type === "suite") return playSuite(spec.accords);
  if (spec.type === "melodie") return playMelodie(spec.notes, { reference: spec.reference });
  if (spec.type === "intervalle") return playInterval(spec.notes[0], spec.notes[1], spec.mode || "ascending");
  if (spec.type === "accord") return spec.arpege ? playScale(spec.notes, 150) : playChord(spec.notes, "2n");
  if (spec.type === "rythme") return playRythme(spec);
}

export const ECART_INTERVALLE_MS = 650;

export async function playInterval(note1, note2, mode = "ascending") {
  if (!await ensureLoaded()) return;
  stopAll();            // écrase une lecture en cours
  reveillerSortie();
  try {
    if (mode === "harmonic") {
      sampler.triggerAttackRelease([note1, note2], secondes("2n"), Tone.now());
      return;
    }
    const [premiere, seconde] = mode === "descending" ? [note2, note1] : [note1, note2];
    // Les deux notes sont planifiées dans le temps audio, sur le bus de la
    // lecture : l'écart est exact, et arrêter entre les deux notes coupe
    // bien la seconde (stopAll ferme et libère ce bus).
    const s = nouvelleLecture();
    const t0 = departLecture();
    s.triggerAttackRelease(premiere, secondes("4n"), t0);
    s.triggerAttackRelease(seconde, secondes("4n"), t0 + ECART_INTERVALLE_MS / 1000);
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

// ─────────────────────────────────────────────────────────────────────────
// TABLATURE — lecture d'une séquence analysée par tab/tabParser.js
// ─────────────────────────────────────────────────────────────────────────

/**
 * Joue une séquence d'évènements de tablature (sortie de tabParser.parseTab).
 *
 * Convention rythmique ASSUMÉE, pas mesurée : chaque colonne de caractère
 * vaut `subdivision` d'une noire (double-croche, 0.25, par défaut) au
 * tempo `bpm`. Voir tab/tabParser.js pour le raisonnement complet — l'ASCII
 * n'encode pas de vrai rythme, ce choix en impose un pour pouvoir jouer.
 *
 * Techniques et leur rendu réel avec un sampler à échantillons fixes (pas
 * de synthèse, donc pas de hauteur continûment variable) :
 *   note/mute   déclenchement direct — la note étouffée ne produit aucun son.
 *   hammer/pull deux notes rapprochées, la seconde plus douce (pas
 *               d'attaque au médiator) — pleinement authentique.
 *   slide       enchaînement RAPIDE des cases intermédiaires plutôt qu'un
 *               glissando continu — s'entend comme un slide, pas comme une
 *               vraie glissade de hauteur.
 *   bend        joue directement la hauteur CIBLE, sans geste de montée —
 *               compromis assumé (voir la conversation produit), pas un
 *               oubli.
 *
 * @param evenements    sortie de parseTab(texte).evenements
 * @param opts.bpm          tempo, 90 par défaut
 * @param opts.subdivision  fraction de noire par colonne (0.25 = double-croche)
 * @param opts.onEvent(ev)  appelé à l'instant sonore de chaque évènement,
 *                          synchronisé sur le MÊME minuteur que le son
 *                          (comme onStep dans playScale) — pour un curseur
 *                          visuel qui ne dérive jamais du son.
 * @param opts.onDone()     appelé une fois la séquence terminée.
 */
/**
 * Charge (une fois) les échantillons de guitare sous forme de buffers bruts.
 * UNIQUE source décodée : le Sampler principal (loadAudio), les lectures
 * planifiées et les voix de corde (playTab) lisent tous ces mêmes buffers.
 * Pas de délai ici : un réseau lent doit pouvoir finir ; c'est l'appelant
 * qui décide s'il attend (voir avecDelai dans playTab).
 */
let promesseCordes = null;
function chargerBuffersCordes() {
  if (buffersCordes?.loaded) return Promise.resolve(buffersCordes);
  if (!promesseCordes) {
    promesseCordes = new Promise((resolve, reject) => {
      const b = new Tone.ToneAudioBuffers({
        urls: SAMPLE_URLS, baseUrl: BASE_URL,
        onload: () => { buffersCordes = b; resolve(b); },
        onerror: (e) => {
          try { b.dispose(); } catch { /* noop */ }
          reject(e instanceof Error ? e : new Error(String(e)));
        },
      });
    });
    // Un échec n'est pas mémorisé : la tentative suivante recharge.
    promesseCordes.catch(() => { promesseCordes = null; });
  }
  return promesseCordes;
}

/** { "A2": ToneAudioBuffer… } : forme attendue par Tone.Sampler pour des buffers déjà décodés. */
const urlsCordes = (buffers) =>
  Object.fromEntries(Object.keys(SAMPLE_URLS).map(n => [n, buffers.get(n)]));

/** Rejette si `promesse` n'aboutit pas dans le délai (sans l'interrompre). */
function avecDelai(promesse, ms) {
  let minuteur = null;
  return Promise.race([
    promesse,
    new Promise((_, reject) => { minuteur = setTimeout(() => reject(new Error("délai dépassé")), ms); }),
  ]).finally(() => clearTimeout(minuteur));
}

/** Échantillon le plus proche d'une hauteur MIDI (un par demi-ton, C2 → B5). */
function echantillonPour(midi) {
  const m = Math.max(MIDI_MIN_ECH, Math.min(MIDI_MAX_ECH, Math.round(midi)));
  return { nom: NOMS_ECHANTILLONS[m % 12] + (Math.floor(m / 12) - 1), base: m };
}
const vitessePour = (midi, base) => Math.pow(2, (midi - base) / 12);

/** Joue une voix du plan (tab/tabSon.js) : attaque, courbe de hauteur, arrêt. */
function jouerVoix(v, t0) {
  const depart = v.hauteurs[0].midi;
  const { nom, base } = echantillonPour(depart);
  const T = t0 + v.debut, Tfin = t0 + v.fin;
  const src = new Tone.ToneBufferSource(buffersCordes.get(nom));
  const gain = new Tone.Gain(0);
  let filtre = null;
  if (v.etouffee) {
    // « Tchk » : la corde étouffée ne garde que son attaque, sourde.
    filtre = new Tone.Filter({ frequency: 1100, type: "lowpass", rolloff: -24 });
    src.chain(filtre, gain, busGuitare);
  } else {
    src.chain(gain, busGuitare);
  }
  // Courbe de hauteur = vitesse de lecture de l'échantillon.
  src.playbackRate.setValueAtTime(vitessePour(depart, base), T);
  for (const p of v.hauteurs.slice(1)) {
    const r = vitessePour(p.midi, base);
    if (p.forme === "rampe") src.playbackRate.exponentialRampToValueAtTime(r, T + p.t);
    else src.playbackRate.setValueAtTime(r, T + p.t);
  }
  // Attaque quasi immédiate ; à la fin, extinction rapide (la corde rejoue ou
  // la note s'arrête), plus sèche encore pour une note étouffée.
  gain.gain.setValueAtTime(0, T);
  gain.gain.linearRampToValueAtTime(v.velocite, T + 0.004);
  gain.gain.setTargetAtTime(0, Tfin, v.etouffee ? 0.01 : 0.03);
  src.start(T);
  src.stop(Tfin + 0.3);
  const voix = { src, gain };
  voixCordes.add(voix);
  src.onended = () => {
    voixCordes.delete(voix);
    try { src.dispose(); gain.dispose(); filtre?.dispose(); } catch { /* noop */ }
  };
}

/**
 * Joue une tablature avec le moteur de cordes. Rendu (détails dans
 * tab/tabSon.js) : chaque note résonne jusqu'à ce que sa corde rejoue ;
 * bends et slides glissent en continu ; hammer-on et pull-off changent de
 * hauteur sans nouvelle attaque ; une note étouffée fait « tchk » ; les
 * accords sont grattés du grave vers l'aigu ; les temps sont accentués et
 * chaque note varie légèrement, comme sous de vrais doigts.
 *
 * @param evenements    sortie de parseTab(texte).evenements ou grilleVersEvenements
 * @param opts.bpm, opts.subdivision (0.25 = double-croche par colonne)
 * @param opts.onEvent(ev)  appelé à l'instant de chaque évènement (curseur visuel)
 * @param opts.onDone()     appelé une fois la séquence terminée
 * @param opts.reglages     surcharge partielle des réglages sonores (tabSon.js)
 */
export async function playTab(evenements, opts = {}) {
  if (!await ensureLoaded()) return;
  stopAll();
  reveillerSortie();
  const { bpm = 90, subdivision = 0.25, onEvent, onDone } = opts;
  if (!Array.isArray(evenements) || evenements.length === 0) { onDone?.(); return; }
  const maLecture = ++generationTab;

  try {
    await avecDelai(chargerBuffersCordes(), 8000);
    if (!busGuitare) throw new Error("bus guitare absent");
  } catch (e) {
    // Repli : l'ancien lecteur à sampler. Aucune régression, juste l'ancien
    // rendu si le moteur de cordes n'a pas pu démarrer sur cet appareil.
    warn("moteur de cordes indisponible, repli sur le sampler :", e);
    return playTabSampler(evenements, opts);
  }

  if (maLecture !== generationTab) return;   // arrêtée pendant le chargement : on ne joue rien
  const { voix } = planifierTab(evenements, { bpm, subdivision, reglages: opts.reglages });
  const AVANCE_MS = 80;   // l'audio est planifié à l'échantillon près, un peu à l'avance
  const t0 = Tone.now() + AVANCE_MS / 1000;
  try { for (const v of voix) jouerVoix(v, t0); } catch (e) { warn("playTab:", e); }

  // Curseur et fin : minuteurs annulables, que stopAll() coupe aussi.
  const spc = (60 / bpm) * subdivision;
  for (const ev of evenements) differer(() => onEvent?.(ev), AVANCE_MS + ev.col * spc * 1000);
  const dernierCol = Math.max(...evenements.map(e => e.toCol ?? e.col));
  differer(() => onDone?.(), AVANCE_MS + (dernierCol + 2) * spc * 1000);
}

/*
 * ANCIEN LECTEUR — conservé comme REPLI si le moteur de cordes échoue.
 * (Sampler : notes coupées à une case, bend sans glissement, slide en escalier.)
 */
async function playTabSampler(evenements, opts = {}) {
  if (!await ensureLoaded()) return;
  stopAll();
  reveillerSortie();

  const { bpm = 90, subdivision = 0.25, onEvent, onDone } = opts;
  if (!Array.isArray(evenements) || evenements.length === 0) { onDone?.(); return; }

  const secParColonne = (60 / bpm) * subdivision;
  const dureeNote = secParColonne;
  // toCol (liaisons issues de la grille de saisie) peut dépasser col.
  const dernierCol = Math.max(...evenements.map(e => e.toCol ?? e.col));

  try {
    for (const ev of evenements) {
      const tMs = ev.col * secParColonne * 1000;

      if (ev.type === "mute") {
        differer(() => { onEvent?.(ev); }, tMs);   // aucun son, juste le curseur
        continue;
      }

      if (ev.type === "note") {
        const note = getToneNoteAtPosition(ev.string, ev.fret);
        differer(() => {
          onEvent?.(ev);
          try { sampler.triggerAttackRelease(note, dureeNote, Tone.now(), 0.75); }
          catch (e) { warn("playTab note:", e); }
        }, tMs);
        continue;
      }

      if (ev.type === "bend") {
        // La hauteur d'arrivée, directement — voir le commentaire de tête.
        const note = getToneNoteAtPosition(ev.string, ev.toFret);
        differer(() => {
          onEvent?.(ev);
          try { sampler.triggerAttackRelease(note, dureeNote, Tone.now(), 0.75); }
          catch (e) { warn("playTab bend:", e); }
        }, tMs);
        continue;
      }

      if (ev.type === "hammer" || ev.type === "pull") {
        const noteDepart  = getToneNoteAtPosition(ev.string, ev.fromFret);
        const noteArrivee = getToneNoteAtPosition(ev.string, ev.toFret);
        // Avec toCol (grille de saisie), la note d'arrivée tombe sur SA
        // colonne ; sans (texte collé), 75 ms après, comme avant.
        const ecart = ev.toCol != null ? (ev.toCol - ev.col) * secParColonne : 0.075;
        differer(() => {
          onEvent?.(ev);
          try {
            sampler.triggerAttackRelease(noteDepart, Math.max(0.04, ecart), Tone.now(), 0.75);
            // Seconde note plus douce, sans attaque au médiator — c'est le
            // doigt seul qui la produit sur un hammer-on ou un pull-off.
            sampler.triggerAttackRelease(noteArrivee, dureeNote * 0.9, Tone.now() + ecart, 0.45);
          } catch (e) { warn("playTab hammer/pull:", e); }
        }, tMs);
        continue;
      }

      if (ev.type === "slide_up" || ev.type === "slide_down") {
        const pas = ev.fromFret <= ev.toFret ? 1 : -1;
        const cases = [];
        for (let f = ev.fromFret; pas > 0 ? f <= ev.toFret : f >= ev.toFret; f += pas) cases.push(f);
        // Avec toCol, l'arrivée du slide tombe sur sa propre colonne.
        const dureeGlissando = ev.toCol != null
          ? (ev.toCol - ev.col) * secParColonne
          : Math.min(0.16, dureeNote * 0.5);
        differer(() => {
          onEvent?.(ev);
          cases.forEach((f, i) => {
            const note = getToneNoteAtPosition(ev.string, f);
            const estArrivee = i === cases.length - 1;
            const t = Tone.now() + (cases.length > 1 ? (i / (cases.length - 1)) * dureeGlissando : 0);
            try {
              sampler.triggerAttackRelease(
                note, estArrivee ? dureeNote : 0.045, t, estArrivee ? 0.75 : 0.4,
              );
            } catch (e) { warn("playTab slide:", e); }
          });
        }, tMs);
        continue;
      }
    }

    differer(() => onDone?.(), (dernierCol + 2) * secParColonne * 1000);
  } catch (e) { warn("playTab:", e); }
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
// Minuteurs des accords à venir. C'est ce tableau qui rend l'arrêt possible.
let progressionTimers = [];
let progressionTimer = null;

/**
 * Enchaîne des accords, avec un callback synchronisé pour surligner l'accord
 * en cours dans l'interface.
 *
 * ── Pourquoi des minuteurs JavaScript et non le Transport de Tone ─────────
 * Trois approches ont été essayées, autant l'écrire :
 *
 *  1. `Tone.Sequence` + `Transport` : après un stop()/cancel(), le transport
 *     gardait sa position et refusait de redémarrer proprement — la lecture
 *     suivante partait en silence.
 *  2. Tout planifier d'avance dans le contexte audio (`Tone.now() + i * durée`) :
 *     ça réglait le silence, mais rendait l'arrêt IMPOSSIBLE. Une fois une
 *     note remise au contexte audio, on ne peut plus l'annuler — d'où le
 *     bouton stop qui ne stoppait rien. C'était une régression de ma part.
 *  3. Celle-ci : un minuteur par accord. Au déclenchement, l'accord est
 *     gratté immédiatement (et son grattage interne, lui, reste planifié à
 *     la milliseconde dans le contexte audio). `clearTimeout` sur les
 *     minuteurs restants suffit alors à interrompre réellement la suite.
 *
 * La précision d'un setTimeout est de quelques millisecondes ; sur des
 * accords espacés de 1,6 s, c'est inaudible. Et l'arrêt fonctionne.
 */
export async function playProgression(chords, secondsPerChord = 1.5, onStep) {
  if (!await ensureLoaded()) return;
  stopAll();
  reveillerSortie();

  const voicedChords = chords.map(({ root, type }) =>
    buildVoicingFromIntervals(normalizeNote(root), CHORD_TYPES[type]?.intervals || [])
  );

  voicedChords.forEach((voiced, idx) => {
    const jouer = () => {
      // Alternance du sens de grattage (bas / haut), comme un vrai jeu
      // rythmique plutôt que le même coup identique en boucle.
      const direction = idx % 2 === 0 ? "down" : "up";
      // Micro-décalage : quelques millisecondes d'imprécision, ce qui suffit
      // à sortir du rendu "machine" parfaitement métronomique.
      const humanize = (Math.random() - 0.5) * 0.012;
      strumInto(voiced, secondsPerChord * 0.9, Tone.now() + 0.02 + humanize, direction);
      onStep?.(idx);
    };
    if (idx === 0) jouer();
    else progressionTimers.push(setTimeout(jouer, idx * secondsPerChord * 1000));
  });

  // Signale la fin, pour éteindre le dernier surlignage.
  const totalMs = voicedChords.length * secondsPerChord * 1000 + 200;
  progressionTimer = setTimeout(() => {
    progressionTimer = null;
    onStep?.(-1);
  }, totalMs);
}

/**
 * Interrompt réellement la suite d'accords : les accords à venir sont
 * annulés, et les cordes qui sonnent encore sont relâchées.
 */
export function stopProgression() {
  for (const t of progressionTimers) clearTimeout(t);
  progressionTimers = [];
  if (progressionTimer) { clearTimeout(progressionTimer); progressionTimer = null; }
  // On ne coupe PAS le son ici : c'est le rôle de stopAll(), qui sait le
  // faire net en raccourcissant le relâchement. Appeler releaseAll() ici
  // produisait un fondu de 1,6 s — le « stop qui ne stoppe pas ».
  // stopProgression() reste utilisable seul pour annuler les accords À VENIR
  // sans toucher à celui qui sonne (changement de question, par exemple).
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
    try { sampler.triggerAttackRelease(note, secondes(duration), now + i * gap, velocity); }
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

/**
 * Coupe TOUT, instantanément : notes qui sonnent, notes à venir, queue de
 * réverbération.
 *
 * Trois choses à faire, et il en manquait deux :
 *
 *  1. ANNULER LES NOTES À VENIR. Une note remise au contexte audio est
 *     irrévocable — c'est pour ça que la deuxième note d'un intervalle partait
 *     malgré le stop. Elles passent maintenant par le bus de leur lecture,
 *     fermé et libéré ici (arreterLecturePlanifiee), et les rappels visuels
 *     par des minuteurs annulables.
 *  2. FERMER LA SORTIE MAÎTRE. Une rampe de 8 ms : assez court pour être perçu
 *     comme instantané, assez long pour éviter le clic d'une coupure à zéro.
 *     C'est ça qui rend le silence immédiat, réverbération comprise.
 *  3. RELÂCHER LES VOIX, pour qu'elles ne reprennent pas à la réouverture de
 *     la sortie.
 *
 * Ce qui NE change PAS : le relâchement du sampler reste à 1,6 s en lecture
 * normale. Les accords résonnent exactement comme avant — c'était bien ainsi,
 * et rien ici n'y touche. Le raccourcissement est temporaire et n'existe que
 * pendant la fenêtre de coupure.
 */
function couperVoixCordes() {
  if (!Tone || !voixCordes.size) return;
  const t = Tone.now();
  for (const v of voixCordes) {
    try { v.gain.gain.cancelScheduledValues(t); v.gain.gain.setTargetAtTime(0, t, 0.01); v.src.stop(t + 0.1); } catch { /* noop */ }
  }
  voixCordes.clear();
}

export function stopAll() {
  generationTab++;
  couperVoixCordes();
  annulerEnAttente();           // rappels visuels et minuteurs encore à venir
  arreterLecturePlanifiee();    // notes planifiées d'avance : leur bus se ferme
  progressionTimers.forEach(clearTimeout);
  progressionTimers = [];
  if (progressionTimer) { clearTimeout(progressionTimer); progressionTimer = null; }

  if (!Tone || !sampler) return;
  try {
    const maintenant = Tone.now();

    // 1. Silence immédiat de la sortie.
    if (sortieMaitre) {
      sortieMaitre.gain.cancelScheduledValues(maintenant);
      sortieMaitre.gain.setValueAtTime(sortieMaitre.gain.value, maintenant);
      sortieMaitre.gain.linearRampToValueAtTime(0, maintenant + 0.008);
    }

    // 2. Libération des voix, avec un relâchement court le temps de la coupure.
    sampler.release = 0.02;
    sampler.releaseAll();

    // 3. Réouverture après la fenêtre de coupure. La fenêtre couvre l'étalement
    //    maximal d'un grattage (6 cordes × 65 ms = 325 ms) : une corde qui
    //    aurait été attaquée juste après le stop est ainsi relâchée avant que
    //    la sortie ne se rouvre, donc jamais entendue.
    if (restaurationTimer) clearTimeout(restaurationTimer);
    restaurationTimer = setTimeout(() => {
      restaurationTimer = null;
      try {
        sampler.releaseAll();
        sampler.release = RELEASE;
        if (sortieMaitre) {
          const t = Tone.now();
          sortieMaitre.gain.cancelScheduledValues(t);
          sortieMaitre.gain.setValueAtTime(0, t);
          sortieMaitre.gain.linearRampToValueAtTime(1, t + 0.01);
        }
      } catch { /* noop */ }
    }, 380);
  } catch { /* noop */ }
}

/** Alias explicite, pour les appelants qui veulent « tout arrêter ». */
export const stopEverything = stopAll;

// ─────────────────────────────────────────────────────────────────────────
// ENTRAÎNEMENT DE L'OREILLE — génération de questions
// ─────────────────────────────────────────────────────────────────────────
/**
 * Durée totale audible d'une lecture, en millisecondes.
 * @param finDerniereAttaque  instant de la dernière attaque, en secondes
 * @param dureeNote           valeur de note Tone.js ou secondes
 */
const dureeMs = (finDerniereAttaque, dureeNote) =>
  Math.round((finDerniereAttaque + secondes(dureeNote)) * 1000) + QUEUE_AUDIBLE_MS;

// Ancien vivier de l'écran (avant la progressivité) : reste celui des
// appelants qui ne précisent rien (QuizScreen via makeEarQuizQuestion).
const INTERVALLES_HISTORIQUES = [3, 4, 5, 7, 9, 10, 12];
const QUALITES_HISTORIQUES = ["maj", "min", "dom7", "min7"];

/** Bonne réponse + jusqu'à 3 leurres du vivier (ou tout le vivier). */
function optionsDe(rng, pool, bonne, toutes) {
  if (toutes) return [...pool];
  return melangerO(rng, [bonne, ...melangerO(rng, pool.filter(x => x !== bonne)).slice(0, 3)]);
}

/**
 * Question d'oreille pour l'écran Ear Training (et le quiz).
 *
 * Les hauteurs viennent de store/oreille.js (logique pure, testée) ; ce
 * module n'y ajoute que la lecture et sa durée.
 *
 * @param type  "interval" | "chord_quality" | "chord_full" | "progression" | "dictation"
 * @param opts.pool          vivier d'éléments proposés (sinon : vivier historique)
 * @param opts.cible         élément à faire entendre (sinon : tiré dans le vivier)
 * @param opts.sens          intervalles : "ascending" | "descending" | "harmonic" | "mix"
 * @param opts.niveau        dictée : niveau 1 à 5
 * @param opts.toutesOptions true = une option par élément du vivier (écran
 *                           Ear Training) ; sinon 4 options au plus (quiz)
 * @param opts.rng           générateur aléatoire (tests)
 */
export function generateEarTrainingQuestion(type = "interval", opts = {}) {
  const rng = opts.rng || Math.random;
  const toutes = !!opts.toutesOptions;

  if (type === "interval") {
    const pool = opts.pool?.length ? opts.pool : INTERVALLES_HISTORIQUES;
    const dt = opts.cible ?? choisirO(rng, pool);
    const sens = !opts.sens || opts.sens === "mix"
      ? (opts.sens === "mix" ? choisirO(rng, ["ascending", "descending", "harmonic"]) : "ascending")
      : opts.sens;
    const { midi } = tirerIntervalle(rng, dt, sens);
    const note1 = midiVersTone(midi[0]), note2 = midiVersTone(midi[1]);
    const options = optionsDe(rng, pool, dt, toutes)
      .map(i => ({ key: i, semitones: i, label: INTERVALLES[i].nom }));
    return {
      type: "interval",
      mode: sens,
      note1, note2,
      answer: dt,
      options,
      repere: INTERVALLES[dt].repere,
      consigne: `Écoute l'intervalle (${SENS[sens]})`,
      detail: `${dt} demi-ton${dt > 1 ? "s" : ""}, ${SENS[sens]}`,
      play: () => playInterval(note1, note2, sens),
      // Mélodique : la 2e note attaque à 0,65 s et dure « 4n » (0,5 s).
      // Harmonique : les deux notes ensemble, « 2n ».
      durationMs: sens === "harmonic" ? dureeMs(0, "2n") : dureeMs(ECART_INTERVALLE_MS / 1000, "4n"),
    };
  }

  if (type === "chord_quality") {
    const pool = opts.pool?.length ? opts.pool : QUALITES_HISTORIQUES;
    const q = opts.cible ?? choisirO(rng, pool);
    const notes = tirerAccord(rng, q).midi.map(midiVersTone);
    const options = optionsDe(rng, pool, q, toutes).map(k => ({ key: k, label: QUALITES[k].nom }));
    const ARPEGE_BPM = 150, pas = 60 / ARPEGE_BPM;
    return {
      type: "chord_quality",
      notes,
      answer: q,
      options,
      repere: `${QUALITES[q].nom} : ${QUALITES[q].couleur}.`,
      consigne: "Écoute l'accord",
      play: () => playChord(notes, "2n", { spread: 0.065 }),
      // Grattage étalé : la dernière corde attaque à (n-1) × 0,065 s.
      durationMs: dureeMs((notes.length - 1) * 0.065, "2n"),
      // Le même accord, note à note : on entend chaque intervalle.
      playArpege: () => playScale(notes, ARPEGE_BPM),
      arpegeDurationMs: dureeMs((notes.length - 1) * pas, pas * 0.85),
    };
  }

  if (type === "chord_full") {
    // ACCORD EN TONALITÉ. L'ancienne version demandait de nommer un accord
    // dans l'absolu (« La mineur ») : c'est l'oreille absolue, qui ne
    // s'entraîne pas ainsi — la note de référence Do, facultative, n'y
    // changeait presque rien. Désormais la tonalité est annoncée, l'accord de
    // tonique sonne d'abord, puis l'accord à reconnaître : on le situe par
    // rapport à la tonique, ce que l'oreille relative sait faire.
    const pool = opts.pool?.length ? opts.pool : ORDRE_DEGRES.slice(0, 4);
    const degre = opts.cible ?? choisirO(rng, pool);
    const t = tirerAccordEnTonalite(rng, degre);
    const ref = t.reference.map(midiVersTone), cible = t.midi.map(midiVersTone);
    const SEC = 1.6;
    const options = optionsDe(rng, pool, degre, toutes).map(d => ({
      key: d,
      label: `${accordDansLaTonalite(t.toniquePc, DEGRES_TONALITE[d].semi, DEGRES_TONALITE[d].type)} (${d})`,
    }));
    return {
      type: "chord_full",
      notes: cible,
      reference: ref,
      tonalite: t.tonalite,
      answer: degre,
      options,
      repere: `${t.nom} est ${DEGRES_TONALITE[degre].fonction}.`,
      consigne: `Tonalité : ${t.tonalite}. Écoute la tonique, puis l'accord`,
      play: () => playSuite([ref, cible], SEC),
      // Le 2e accord attaque à 1,6 s (+ étalement du grattage) et sonne 90 %.
      durationMs: dureeMs(SEC + 6 * 0.026, SEC * 0.9),
      playReference: () => playChord(ref, "2n"),
      referenceLabel: "l'accord de tonique",
    };
  }

  if (type === "progression") {
    const SEC_PAR_ACCORD = 1.6;
    const pool = opts.pool?.length ? opts.pool : ORDRE_PROGRESSIONS.slice(0, 4);
    const cle = opts.cible ?? choisirO(rng, pool);
    const p = tirerProgression(rng, cle);
    const accords = p.accords.map(a => a.map(midiVersTone));
    const options = optionsDe(rng, pool, cle, toutes).map(k => ({ key: k, label: romainDe(k) }));
    return {
      type: "progression",
      accords,
      // Fondamentales (dièses, valeurs internes) et types : forme historique.
      chords: PROGRESSIONS[cle].degres.map(([semi, type]) => ({ root: NOTES_DIESES_EN[(p.toniquePc + semi) % 12], type })),
      tonic: NOTES_DIESES_EN[p.toniquePc],
      tonicFr: p.tonalite,
      tonalite: p.tonalite,
      roman: p.romain,
      noms: p.noms,
      answer: cle,
      options,
      // Les degrés en chiffres romains se lisent dans toutes les tonalités ;
      // l'orthographe des accords (Dom – Lab – Mib – Sib) vient avec la
      // correction, une fois la tonalité dévoilée.
      repere: `En ${p.tonalite} : ${p.noms.join(" – ")}.`,
      consigne: "Écoute la suite (le premier accord est la tonique)",
      play: () => playSuite(accords, SEC_PAR_ACCORD),
      durationMs: dureeMs((accords.length - 1) * SEC_PAR_ACCORD + 6 * 0.026, SEC_PAR_ACCORD * 0.9),
    };
  }

  if (type === "dictation") {
    const d = tirerDictee(rng, opts.niveau || 1);
    const notes = d.midi.map(midiVersTone), reference = d.reference.map(midiVersTone);
    return {
      type: "dictation",
      ...d,
      notes,
      referenceNotes: reference,
      answer: d.degres.join("-"),
      options: [],
      consigne: `Tonalité : ${d.tonalite}. La mélodie part de la tonique (${d.touches[0].nom})`,
      play: () => playMelodie(notes, { reference }),
      durationMs: dureeMelodieMs(notes.length, true),
      playReference: () => playMelodie([notes[0]], { reference }),
      referenceLabel: "la tonique",
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
