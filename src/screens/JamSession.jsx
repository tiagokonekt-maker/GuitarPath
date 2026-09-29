// GuitarPath -- screens/JamSession.jsx
// Outil interactif d'improvisation : gamme active, notes cibles, contraintes + backing track
import { useState, useMemo, useEffect, useRef } from "react";
import { useWakeLock } from "../hooks/useWakeLock.js";
import { FONTS, R } from "../design/tokens.js";
import { useC } from "../design/ThemeContext.jsx";
import { Ti } from "../design/Ti.jsx";
import { Gropi } from "../design/Gropi.jsx";
import { Fretboard } from "../Fretboard.jsx";
import { getScaleNotes, noteToFr, normalizeNote } from "../fretboardUtils.js";
import { generateWalkingBar, toToneNote as toToneNoteFromMidi, toToneTime } from "../music/walkingBass.js";
import { createComper, beatToToneTime } from "../music/compRhythm.js";
import * as Tone from "tone";

// ── jamEngine, enfin branché — mais pas tel quel ──────────────────────────
// jamEngine.js fait tourner sa PROPRE horloge sur son PROPRE AudioContext
// (`createClock`, `new AudioContext()`) — entièrement indépendante de
// `Tone.getTransport()`, que cet écran utilise déjà pour les accords et la
// basse. Faire tourner les deux côte à côte aurait introduit deux horloges
// distinctes, susceptibles de dériver l'une par rapport à l'autre au fil
// d'une session longue — exactement le genre de bug qui ne se voit pas en
// test rapide et qui devient audible après plusieurs minutes.
//
// La vraie valeur de jamEngine n'est pas son horloge (Tone.Transport fait
// déjà ce travail très bien ici) : c'est son algorithme de génération —
// planner (forme longue) + director (décisions de phrase) + generateDrumBar
// (grille → évènements). Ces trois morceaux sont du JavaScript pur, sans
// audio, conçus pour être importés indépendamment. On les branche donc
// directement DANS la boucle par mesure qui existe déjà (le
// `Tone.Sequence` plus bas), à la place de l'ancien motif statique qui
// bouclait à l'identique — sans toucher au chargement des échantillons ni
// à leur lecture (`playDrum`), qui restent celles de cet écran.
import { createPlanner, createDirector } from "../jam/arrangement/arranger.js";
import { generateDrumBar } from "../jam/generators/drums.js";

// Chemin des packs à vérifier : je n'ai pas de confirmation directe de
// l'emplacement réel de ces deux fichiers dans le dépôt (aucun en-tête n'y
// fait référence, contrairement aux modules .js). Si l'import échoue au
// build, c'est le seul détail à corriger — le reste de cette intégration
// n'en dépend pas.
import BLUES_SHUFFLE_PACK from "../jam/packs/blues-shuffle.json";
import FUNK_16_PACK from "../jam/packs/funk-16.json";

// Seuls les styles qui ont un vrai pack passent sur le nouveau moteur. Pour
// "jazz" et "rock", aucun pack n'existe aujourd'hui : plutôt que d'en
// fabriquer un sans les données ou l'oreille pour le valider, ces deux
// styles gardent le système statique existant, plus bas — inchangé.
const PACK_PAR_STYLE = {
  blues:   BLUES_SHUFFLE_PACK,
  blues12: BLUES_SHUFFLE_PACK,
  funk:    FUNK_16_PACK,
};

// Assombrit une couleur hex d'une quantité fixe, quel que soit le thème.
// Les boutons de lecture utilisaient `colorD` (celui de `context`, ou
// `C.primaryD`) comme second point de dégradé — or ce token est une couleur
// de TEXTE, claire en thème sombre pour rester lisible sur un fond teinté,
// pas une couleur de fond de bouton. Résultat en thème sombre : un dégradé
// qui allait vers une teinte pâle, avec l'icône blanche presque invisible
// dessus. `shade()` assombrit toujours PAR RAPPORT à la couleur de base,
// donc le résultat reste correct dans les deux thèmes.
function shade(hex, amount) {
  const h = hex.replace("#", "");
  const num = parseInt(h, 16);
  let r = (num >> 16) + amount, g = ((num >> 8) & 0xff) + amount, b = (num & 0xff) + amount;
  r = Math.max(0, Math.min(255, r));
  g = Math.max(0, Math.min(255, g));
  b = Math.max(0, Math.min(255, b));
  return "#" + ((r << 16) | (g << 8) | b).toString(16).padStart(6, "0");
}

// ─────────────────────────────────────────────────────────────────────────
// CONTEXTES
// ─────────────────────────────────────────────────────────────────────────
const makeContexts = (C) => [
  {
    id: "blues_minor",
    label: "Blues mineur",
    color: C.amber, colorL: C.amberL, colorD: C.amberD, colorB: C.amberBorder,
    scale: "pentatonic_minor",
    desc: "Le terrain de jeu du rock et du blues. La pentatonique mineure sonne sur tout.",
    targetDesc: "Fondamentale, tierce mineure, quinte",
    bpm: 80,
    // Vraie grille de blues mineur, pas un accord en boucle : le IVm et le
    // V7 sont ce qui donne des points de résolution à travailler.
    chords: [
      { degree: 0, quality: "min7", bars: 4 },
      { degree: 5, quality: "min7", bars: 2 },
      { degree: 0, quality: "min7", bars: 2 },
      { degree: 7, quality: "dom7", bars: 2 },
      { degree: 0, quality: "min7", bars: 2 },
    ],
  },
  {
    id: "blues_12",
    label: "Blues 12 mesures",
    color: C.primary, colorL: C.primaryL, colorD: C.primaryD, colorB: C.primaryBorder,
    scale: "blues",
    desc: "La note bleue (b5) est ta couleur signature.",
    targetDesc: "Fondamentale, tierce mineure, note bleue",
    bpm: 80,
    // Progression blues 12 mesures : I7-I7-I7-I7-IV7-IV7-I7-I7-V7-IV7-I7-V7
    chords: [
      { degree: 0,  quality: "dom7", bars: 4 },
      { degree: 5,  quality: "dom7", bars: 2 },
      { degree: 0,  quality: "dom7", bars: 2 },
      { degree: 7,  quality: "dom7", bars: 1 },
      { degree: 5,  quality: "dom7", bars: 1 },
      { degree: 0,  quality: "dom7", bars: 1 },
      { degree: 7,  quality: "dom7", bars: 1 },
    ],
  },
  {
    id: "jazz_251",
    label: "Jazz ii-V-I",
    color: C.green, colorL: C.greenL, colorD: C.greenD, colorB: C.greenBorder,
    scale: "major",
    desc: "Cible les guide tones (3e et 7e) de chaque accord sur les temps forts.",
    targetDesc: "3e (couleur), 7e majeure ou mineure (tension)",
    bpm: 120,
    // ii-V-I : Dm7 (2 bars) - G7 (2 bars) - Cmaj7 (4 bars)
    chords: [
      { degree: 2,  quality: "min7", bars: 2 },
      { degree: 7,  quality: "dom7", bars: 2 },
      { degree: 0,  quality: "maj7", bars: 4 },
    ],
  },
  {
    id: "modal_dorian",
    label: "Modal Dorien",
    color: "#185FA5", colorL: "#E6F1FB", colorD: "#042C53", colorB: "#A0BFE0",
    scale: "dorian",
    desc: "La sixte majeure est ta note caractéristique. Évite de résoudre trop tôt.",
    targetDesc: "Fondamentale, 6te majeure (couleur dorien), tierce mineure",
    bpm: 90,
    // Im7 - IV7 : c'est ce va-et-vient qui FAIT entendre le dorien.
    // Un Im7 seul en boucle ne révèle rien — la 6te majeure, qui est la
    // note caractéristique du mode, ne s'entend que par contraste avec le
    // IV majeur. Un seul accord ne donne rien à travailler.
    chords: [
      { degree: 0, quality: "min7", bars: 2 },
      { degree: 5, quality: "dom7", bars: 2 },
    ],
  },
  {
    id: "modal_mixo",
    label: "Modal Mixolydien",
    color: C.coral, colorL: C.coralL, colorD: C.coralD, colorB: C.coralBorder,
    scale: "mixolydian",
    desc: "Son rock/funk. La b7 naturelle donne la couleur dominante.",
    targetDesc: "Fondamentale, tierce majeure, 7e mineure (couleur)",
    bpm: 100,
    // I7 - bVII : la cadence qui signe le mixolydien. Le bVII majeur est ce
    // qui distingue le mode d'un simple accord de dominante tenu.
    chords: [
      { degree: 0,  quality: "dom7", bars: 2 },
      { degree: 10, quality: "maj",  bars: 2 },
    ],
  },
];

const ROOTS_FR = [
  { en: "A",  fr: "La"   }, { en: "B",  fr: "Si"   }, { en: "C",  fr: "Do"   },
  { en: "D",  fr: "Ré"   }, { en: "E",  fr: "Mi"   }, { en: "F",  fr: "Fa"   },
  { en: "G",  fr: "Sol"  }, { en: "C#", fr: "Do#"  }, { en: "D#", fr: "Ré#"  },
  { en: "F#", fr: "Fa#"  }, { en: "G#", fr: "Sol#" }, { en: "A#", fr: "La#"  },
];

const CHROMATIC = ["C","C#","D","D#","E","F","F#","G","G#","A","A#","B"];
const SHARP_TO_FLAT = { "C#":"Db","D#":"Eb","F#":"Gb","G#":"Ab","A#":"Bb" };

function toFlat(note) { return SHARP_TO_FLAT[note] || note; }
function transposeNote(root, semitones) {
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
function notesAccord(root, chord) {
  const r = transposeNote(root, chord.degree);
  return (CHORD_INTERVALS[chord.quality] || CHORD_INTERVALS.dom7).map(i => transposeNote(r, i));
}
const nomAccord = (root, chord) => {
  const r = transposeNote(root, chord.degree);
  return (ROOTS_FR.find(x => x.en === r)?.fr ?? r) + (QUALITE_LABEL[chord.quality] ?? "");
};

// Contraintes : une limite claire, tenue 2 minutes. `contextes` restreint
// une contrainte aux styles où elle a un sens musical (absent = tous).
const CONSTRAINTS = [
  { text: "Joue UNIQUEMENT des notes longues. Zéro double-croche.", level: "Facile" },
  { text: "Chaque phrase doit finir sur une note de l'accord.", level: "Facile" },
  { text: "4 notes maximum par phrase, et un silence entre chaque phrase.", level: "Facile" },
  { text: "Joue une phrase de 2 mesures, puis 2 mesures de silence : question-réponse.", level: "Facile" },
  { text: "Fais entendre la sixte majeure au moins une fois par phrase : c'est elle qui signe le dorien.", level: "Facile", contextes: ["modal_dorian"] },
  { text: "Reste uniquement sur les 3 cordes aiguës.", level: "Moyen" },
  { text: "Commence chaque phrase sur un temps fort (1 ou 3).", level: "Moyen" },
  { text: "Utilise le silence pendant au moins 50 % du temps.", level: "Moyen" },
  { text: "Monte progressivement en intensité pendant 2 minutes, puis redescends.", level: "Moyen" },
  { text: "Glisse la note bleue (quinte diminuée) dans chaque phrase, en note de passage.", level: "Moyen", contextes: ["blues_12"] },
  { text: "Termine tes phrases sur la septième mineure plutôt que sur la fondamentale.", level: "Moyen", contextes: ["modal_mixo"] },
  { text: "Sur l'accord IVm7, vise sa tierce mineure : elle sort de ta penta et fait entendre le changement.", level: "Difficile", contextes: ["blues_minor"] },
  { text: "Chaque phrase contient exactement une note chromatique (hors gamme).", level: "Difficile" },
  { text: "Cible uniquement les guide tones (3e et 7e) sur les temps 1 et 3.", level: "Difficile" },
  { text: "Relie les accords : la 7e de chaque accord descend d'un demi-ton vers la 3e du suivant.", level: "Difficile", contextes: ["jazz_251"] },
  { text: "Construis un solo en 3 actes : calme (1 min), montée (2 min), sommet (30 s).", level: "Difficile" },
  { text: "Joue les yeux fermés. Sens le manche, ne le regarde pas.", level: "Difficile" },
];
const NIVEAUX_CONTRAINTE = ["Facile", "Moyen", "Difficile"];
const DUREE_CONTRAINTE = 120;          // secondes de jeu réel
const SEUIL_SESSION = 180;             // 3 min de jeu réel pour compter une session

/** Niveau de départ des contraintes, d'après le niveau de l'app — modifiable ensuite. */
const niveauParDefaut = (niveauApp) => (niveauApp >= 16 ? "Difficile" : niveauApp >= 6 ? "Moyen" : "Facile");
const fmtDuree = (sec) => `${Math.floor(sec / 60)}:${String(Math.max(0, sec) % 60).padStart(2, "0")}`;

const BPM_MIN = 40;
const BPM_MAX = 200;

const makeLevelColor = (C) => ({ "Facile": C.green, "Moyen": C.amber, "Difficile": C.coral });

// ─────────────────────────────────────────────────────────────────────────
// BACKING TRACK PLAYER — Version Pro
// Samples FatBoy guitare steel + basse compressée + batterie procédurale
// Chaîne audio : instruments -> reverb/delay -> compresseur master
// ─────────────────────────────────────────────────────────────────────────
function BackingTrackPlayer({ context, root, bpm, onBpmChange, onChord, onSecondeJouee, onLecture }) {
  const C = useC();
  const [playing, setPlaying]       = useState(false);
  const [compte, setCompte]         = useState(null);   // décompte 1-2-3-4 avant l'entrée
  const [rampe, setRampe]           = useState(false);  // +5 BPM toutes les 2 grilles
  // Le « groupe » se dirige : intensité (1 calme → 5 intense) et mixage.
  // Les trois moteurs acceptaient déjà une intensité, mais recevaient
  // toujours 3 en dur. Couper un instrument sert à travailler avec moins
  // de soutien (sans basse, on doit faire entendre l'harmonie soi-même).
  const [energie, setEnergie]       = useState(3);
  const [coupes, setCoupes]         = useState({ accords: false, basse: false, batterie: false });
  const [reglagesOuverts, setReglagesOuverts] = useState(false);
  // L'écran reste allumé pendant qu'on joue : guitare en main, on ne
  // touche pas le téléphone, et il se mettait en veille en pleine session.
  useWakeLock(playing);
  const [beat, setBeat]             = useState(0);
  const [currentChord, setCurrentChord] = useState(0);
  const [loading, setLoading]       = useState(false);
  const [playError, setPlayError]   = useState(null);

  // Refs instruments
  const samplerRef  = useRef(null); // guitare steel samples
  const bassRef     = useRef(null); // basse synthétique
  const kickRef     = useRef(null); // grosse caisse
  const snareRef    = useRef(null); // caisse claire
  const hihatRef    = useRef(null); // charleston
  const seqRef      = useRef(null); // séquenceur principal
  const beatSeqRef  = useRef(null); // séquenceur batterie
  const bassFilterRef  = useRef(null);
  const bassCompRef    = useRef(null);
  const kickCompRef    = useRef(null);
  const snareFilterRef = useRef(null);
  const comperRef      = useRef(null);
  const drumsRef       = useRef(null);
  const drumsLoadedRef = useRef(false);
  const drumRRRef      = useRef({});   // dernier échantillon joué par élément
  const plannerRef     = useRef(null); // forme longue (jamEngine) — actif uniquement si un pack existe pour ce style
  const directorRef    = useRef(null); // décisions de phrase (jamEngine)
  // Refs master chain
  const reverbRef   = useRef(null);
  const delayRef    = useRef(null);
  const compRef     = useRef(null);

  // La tonalité et le tempo sont RELUS à chaque mesure (refs) au lieu d'être
  // figés au démarrage : changer de tonalité ou de tempo en jouant s'entend
  // dès la mesure suivante, sans couper la musique.
  const rootRef    = useRef(root);   rootRef.current = root;
  const rampeRef   = useRef(rampe);  rampeRef.current = rampe;
  const onChordRef = useRef(onChord); onChordRef.current = onChord;
  const onBpmRef   = useRef(onBpmChange); onBpmRef.current = onBpmChange;
  const playingRef = useRef(false);  playingRef.current = playing;
  const energieRef = useRef(energie); energieRef.current = energie;
  const coupesRef  = useRef(coupes);  coupesRef.current = coupes;
  const mesureRef  = useRef(0);       // dernière mesure jouée, pour ajuster le plan en direct
  const onSecondeRef = useRef(onSecondeJouee); onSecondeRef.current = onSecondeJouee;
  const onLectureRef = useRef(onLecture); onLectureRef.current = onLecture;
  useEffect(() => { onLectureRef.current?.(playing); }, [playing]);

  // Temps de jeu réel, décompte exclu : c'est lui qui fera compter la
  // session dans la série et l'XP (voir JamSession).
  useEffect(() => {
    if (!playing || compte != null) return;
    const t = setInterval(() => onSecondeRef.current?.(), 1000);
    return () => clearInterval(t);
  }, [playing, compte]);
  useEffect(() => { try { Tone.getTransport().bpm.value = bpm; } catch { /* noop */ } }, [bpm]);

  // Changer de STYLE en jouant change la grille, le son et la batterie :
  // on relance aussitôt, plutôt que de s'arrêter en silence.
  const contexteRef = useRef(context.id);
  useEffect(() => {
    if (contexteRef.current === context.id) return;
    contexteRef.current = context.id;
    if (playingRef.current) { stopBacking(); startBacking(); }
  }, [context.id]);
  useEffect(() => () => stopBacking(), []);

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

  function getVoicedChord(rootNote, quality, style = "jazz") {
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

    const SHARP_TO_FLAT = { "C#":"Db","D#":"Eb","F#":"Gb","G#":"Ab","A#":"Bb" };
    return degrees.map(interval => {
      const midi = base + interval;
      const name = CHROMATIC[((midi % 12) + 12) % 12];
      const oct  = Math.floor(midi / 12) - 1;
      return `${SHARP_TO_FLAT[name] || name}${oct}`;
    });
  }

  function getBassPattern(rootNote, quality, style, nextRoot, barIdx, energy = 3) {
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
  function getDrumPattern(style) {
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

  function getStyle(contextId) {
    const map = {
      blues_minor:  "blues",
      blues_12:     "blues12",
      jazz_251:     "jazz",
      modal_dorian: "funk",
      modal_mixo:   "rock",
    };
    return map[contextId] || "rock";
  }

  /**
   * Joue un élément de batterie.
   * Choisit l'échantillon selon la dynamique, en évitant de rejouer le même
   * que la fois précédente : c'est ce round-robin qui empêche deux frappes
   * successives de sonner rigoureusement identiques.
   */
  function playDrum(type, time, velocity = 0.8) {
    const COUNTS = { kick: 3, snare: 2, hihat: 3, hihatOpen: 2, ride: 2, crash: 2, tomLow: 1, tomMid: 1 };
    if (drumsLoadedRef.current && drumsRef.current) {
      const n = COUNTS[type] || 1;
      // La dynamique choisit la zone d'échantillons, le round-robin choisit
      // lequel dans cette zone.
      let idx = Math.min(n - 1, Math.floor(velocity * n));
      const last = drumRRRef.current[type];
      if (n > 1 && idx === last) idx = (idx + 1) % n;
      drumRRRef.current[type] = idx;
      try {
        const player = drumsRef.current.player(`${type}${idx}`);
        player.volume.value = -6 + (velocity - 0.8) * 12;
        player.start(time);
      } catch { /* échantillon absent : on saute */ }
      return;
    }
    // Repli synthétique
    if (type === "kick")  kickRef.current?.triggerAttackRelease("C1", "8n", time);
    if (type === "snare") snareRef.current?.triggerAttackRelease("8n", time);
    if (type === "hihat") hihatRef.current?.triggerAttackRelease("32n", time);
  }

  // ── Démarrage du backing ────────────────────────────────────────────────
  async function startBacking() {
    setLoading(true);
    setPlayError(null);
    try {
      await Tone.start();
      await Tone.getContext().resume();
      Tone.getTransport().bpm.value = bpm;
      Tone.getTransport().cancel();

      // ── Chaîne master ─────────────────────────────────────────────────
      compRef.current = new Tone.Compressor({
        threshold: -18, ratio: 4, attack: 0.003, release: 0.25,
      }).toDestination();

      reverbRef.current = new Tone.Reverb({
        decay: context.id === "jazz_251" ? 2.5 : 1.8,
        wet: context.id === "jazz_251" ? 0.18 : 0.12,
        preDelay: 0.02,
      });
      await reverbRef.current.generate();
      reverbRef.current.connect(compRef.current);

      // Delay subtil pour le jazz
      if (context.id === "jazz_251") {
        delayRef.current = new Tone.FeedbackDelay({
          delayTime: "8n.", feedback: 0.15, wet: 0.08,
        });
        delayRef.current.connect(reverbRef.current);
      }

      const masterOut = delayRef.current || reverbRef.current;

      // ── Sampler guitare steel (accords) ───────────────────────────────
      const SAMPLE_URLS_LOCAL = {
        "A2":"A2.mp3","A3":"A3.mp3","A4":"A4.mp3",
        "B2":"B2.mp3","B3":"B3.mp3","B4":"B4.mp3",
        "C3":"C3.mp3","C4":"C4.mp3","D3":"D3.mp3","D4":"D4.mp3",
        "E2":"E2.mp3","E3":"E3.mp3","E4":"E4.mp3",
        "F3":"F3.mp3","F4":"F4.mp3","G3":"G3.mp3","G4":"G4.mp3",
        "Ab2":"Ab2.mp3","Ab3":"Ab3.mp3","Ab4":"Ab4.mp3",
        "Bb2":"Bb2.mp3","Bb3":"Bb3.mp3","Bb4":"Bb4.mp3",
        "Db3":"Db3.mp3","Db4":"Db4.mp3","Eb3":"Eb3.mp3","Eb4":"Eb4.mp3",
        "Gb3":"Gb3.mp3","Gb4":"Gb4.mp3",
      };

      // ── Accompagnement : piano électrique (Rhodes) ────────────────────
      // La guitare échantillonnée sonnait artificielle, et c'est structurel :
      // un accord de guitare est un GESTE (le médiator traverse les cordes,
      // chaque corde a une pression et un étouffement propres). Aucun
      // échantillonnage note à note ne le restitue vraiment.
      //
      // Un clavier, lui, frappe chaque note indépendamment — il n'y a aucun
      // geste à simuler, donc un Rhodes échantillonné sonne juste tout de
      // suite. C'est en plus le son classique de l'accompagnement blues,
      // jazz et funk, et son timbre laisse de la place à la guitare solo au
      // lieu de lui disputer la même bande de fréquences.
      //
      // Source : jRhodes de Jeff Learman, licence CC0 (déclarée dans le
      // fichier d'origine).
      // Piano ACOUSTIQUE, pas électrique.
      // Le Rhodes était une erreur de ma part : c'est un instrument
      // électromécanique, il sonne électronique par nature. Pour un rendu
      // naturel il faut un piano à cordes.
      // Source : Salamander Grand Piano V2, Alexander Holm, licence CC-BY
      // (attribution obligatoire — à créditer dans les mentions de l'app).
      const RHODES_SAMPLES = {
        "C2": "C2.mp3", "Gb2": "Gb2.mp3", "A2": "A2.mp3",
        "Eb3": "Eb3.mp3", "A3": "A3.mp3", "C4": "C4.mp3",
        "Gb4": "Gb4.mp3", "C5": "C5.mp3",
      };

      try {
        samplerRef.current = await new Promise((resolve, reject) => {
          const s = new Tone.Sampler({
            urls: RHODES_SAMPLES,
            baseUrl: "/audio/piano/",
            release: 1.4,
            // L'accompagnement se tient DERRIÈRE. Il pose l'harmonie et le rythme,
            // il ne doit jamais attirer l'oreille : c'est le guitariste le soliste.
            volume: context.id === "jazz_251" ? -22 : -25,
            onload: () => resolve(s),
            onerror: (e) => reject(e),
          });
          setTimeout(() => reject(new Error("délai dépassé")), 6000);
        });
      } catch {
        // Repli sur la guitare existante si le Rhodes n'est pas installé.
        samplerRef.current = new Tone.Sampler({
          urls: SAMPLE_URLS_LOCAL,
          baseUrl: "/audio/guitar/",
          release: 2.0,
          volume: context.id === "jazz_251" ? -8 : -10,
        });
      }
      samplerRef.current.connect(masterOut);

      // ── Basse échantillonnée ──────────────────────────────────────────
      // La version précédente était un Tone.Synth en dents de scie : c'est
      // littéralement un synthétiseur soustractif, aucun filtrage ne peut
      // le faire passer pour une basse électrique.
      //
      // Contrairement à la batterie, la basse est TRÈS bien servie par
      // l'échantillonnage : elle est monophonique, son timbre est homogène
      // sur toute la tessiture, et surtout elle est presque toujours
      // enregistrée en direct — donc pas de pièce, pas d'overheads, pas de
      // diaphonie entre micros à recréer. C'est le problème de réalisme le
      // plus facile à résoudre du trio batterie/basse/accompagnement.
      // Notes réellement échantillonnées, tous les 6 demi-tons.
      // Correspondances relevées dans le fichier SFZ d'origine (Killer Bass
      // de Karoryfer, CC0) : les noms de fichiers du pack utilisaient une
      // convention d'octave décalée, ceux-ci sont convertis en notation
      // Tone.js (do central = C4). Tone.Sampler interpole entre ces points.
      const BASS_SAMPLES = {
        "C1": "C1.mp3", "Gb1": "Gb1.mp3",
        "C2": "C2.mp3", "Gb2": "Gb2.mp3",
        "C3": "C3.mp3", "Gb3": "Gb3.mp3",
        "C4": "C4.mp3", "Gb4": "Gb4.mp3",
        "A4": "A4.mp3",
      };

      let bassLoaded = false;
      try {
        bassRef.current = await new Promise((resolve, reject) => {
          const s = new Tone.Sampler({
            urls: BASS_SAMPLES,
            baseUrl: "/audio/bass/",
            release: 0.9,
            volume: -9,
            onload: () => resolve(s),
            onerror: (e) => reject(e),
          });
          // Filet de sécurité : si le chargement ne répond pas, on n'attend
          // pas indéfiniment, on bascule sur le repli.
          setTimeout(() => reject(new Error("délai dépassé")), 6000);
        });
        bassLoaded = true;
      } catch {
        // Repli : synthé, mais réglé pour être le moins désagréable possible
        // (onde triangulaire plutôt que dents de scie — beaucoup moins de
        // harmoniques agressives, plus proche d'une basse assourdie).
        bassRef.current = new Tone.Synth({
          oscillator: { type: "triangle" },
          envelope: { attack: 0.012, decay: 0.2, sustain: 0.55, release: 0.5 },
          volume: -14,
        });
      }

      // Le filtrage précédent coupait à 280 Hz : bien trop bas. Toute la
      // définition d'une basse — l'attaque du doigt ou du médiator, la
      // corde qui parle — vit entre 700 Hz et 2,5 kHz. Couper à 280 Hz
      // supprimait exactement ce qui la rend reconnaissable, et ne laissait
      // qu'un bourdon sourd.
      const bassFilter = new Tone.Filter({
        frequency: bassLoaded ? 3500 : 900,
        type: "lowpass",
        rolloff: -12,
      });
      const bassComp = new Tone.Compressor({ threshold: -18, ratio: 4, attack: 0.008, release: 0.12 });
      bassFilterRef.current = bassFilter;
      bassCompRef.current = bassComp;
      bassRef.current.chain(bassFilter, bassComp, compRef.current);

      // ── Batterie échantillonnée ───────────────────────────────────
      // Remplace MembraneSynth / NoiseSynth : c'était de la synthèse pure,
      // le dernier instrument artificiel du trio. Une batterie de synthèse
      // sonne comme une boîte à rythmes, pas comme un batteur.
      //
      // Plusieurs échantillons par élément, choisis selon la dynamique ET
      // en évitant de rejouer le même deux fois de suite : sans ça, deux
      // frappes successives sont rigoureusement identiques, ce que l'oreille
      // repère immédiatement comme mécanique.
      const DRUM_FILES = {
        kick:      ["kick1.mp3", "kick2.mp3", "kick3.mp3"],
        snare:     ["snare1.mp3", "snare2.mp3"],
        hihat:     ["hihat1.mp3", "hihat2.mp3", "hihat3.mp3"],
        hihatOpen: ["hihatOpen1.mp3", "hihatOpen2.mp3"],
        ride:      ["ride1.mp3", "ride2.mp3"],
        crash:     ["crash1.mp3", "crash2.mp3"],
        tomLow:    ["tomLow1.mp3"],
        tomMid:    ["tomMid1.mp3"],
      };

      const drumUrls = {};
      for (const [inst, files] of Object.entries(DRUM_FILES)) {
        files.forEach((f, i) => { drumUrls[`${inst}${i}`] = f; });
      }

      let drumsLoaded = false;
      try {
        drumsRef.current = await new Promise((resolve, reject) => {
          const p = new Tone.Players({
            urls: drumUrls,
            baseUrl: "/audio/drums/",
            onload: () => resolve(p),
            onerror: (e) => reject(e),
          });
          setTimeout(() => reject(new Error("délai dépassé")), 8000);
        });
        drumsRef.current.connect(compRef.current);
        drumsLoaded = true;
      } catch {
        drumsRef.current = null;
      }
      drumsLoadedRef.current = drumsLoaded;

      // Repli synthétique, uniquement si les échantillons sont absents.
      if (!drumsLoaded) {
        kickRef.current = new Tone.MembraneSynth({
          pitchDecay: 0.08, octaves: 6,
          envelope: { attack: 0.001, decay: 0.35, sustain: 0, release: 0.1 },
          volume: -8,
        });
        const kickComp = new Tone.Compressor({ threshold: -12, ratio: 8 });
        kickCompRef.current = kickComp;
        kickRef.current.chain(kickComp, compRef.current);

        snareRef.current = new Tone.NoiseSynth({
          noise: { type: "white" },
          envelope: { attack: 0.001, decay: 0.18, sustain: 0, release: 0.05 },
          volume: -18,
        });
        const snareFilter = new Tone.Filter({ frequency: 1800, type: "highpass" });
        snareFilterRef.current = snareFilter;
        snareRef.current.chain(snareFilter, reverbRef.current);

        hihatRef.current = new Tone.NoiseSynth({
          noise: { type: "white" },
          envelope: { attack: 0.001, decay: 0.04, sustain: 0, release: 0.02 },
          volume: -26,
        }).connect(compRef.current);
      }

      // ── Séquenceur principal (accords + basse) ────────────────────────
      const style      = getStyle(context.id);
      const pack       = PACK_PAR_STYLE[style] || null;
      if (pack) {
        plannerRef.current  = createPlanner({ baseEnergy: energieRef.current });
        directorRef.current = createDirector(pack);
      }
      const progression = context.chords;
      let barMap = [];
      for (const chord of progression) {
        for (let b = 0; b < chord.bars; b++) barMap.push(chord);
      }
      const totalBars = barMap.length;

      // Accompagnateur avec mémoire : sans elle, le tirage aléatoire
      // répéterait le même motif plusieurs mesures de suite.
      comperRef.current = createComper(
        (style === "blues" || style === "blues12") ? "blues" : "jazz"
      );

      seqRef.current = new Tone.Sequence((time, barIdx) => {
        const chord     = barMap[barIdx % totalBars];
        const rootNow   = rootRef.current;
        const chordRoot = transposeNote(rootNow, chord.degree);
        const voiced    = getVoicedChord(chordRoot, chord.quality, style);
        // L'accord SUIVANT est indispensable : c'est lui qui détermine la
        // note d'approche du 4e temps, le geste qui fait qu'une walking bass
        // avance au lieu de tourner en rond.
        const nextChord = barMap[(barIdx + 1) % totalBars];
        const nextRoot  = transposeNote(rootNow, nextChord.degree);
        mesureRef.current = barIdx;
        // Intensité : celle du plan (qui ajoute les respirations d'une vraie
        // forme — intro, montée, relâche) quand un pack existe, sinon celle
        // choisie par la personne.
        let section = null;
        if (pack && plannerRef.current) {
          plannerRef.current.ensurePlannedUpTo(barIdx + 24);
          section = plannerRef.current.sectionAt(barIdx);
        }
        const energieMesure = section?.energy ?? energieRef.current;
        const coupe = coupesRef.current;
        const bassPattern = getBassPattern(chordRoot, chord.quality, style, nextRoot, barIdx, energieMesure);

        // ── Accompagnement rythmé ──────────────────────────────────
        // Avant : un seul accord tenu sur la mesure entière ("1m"). C'est
        // ce qui restait de plus "amateur" — un accompagnateur ne tient
        // pas un accord quatre temps durant, il place des accents et il
        // laisse du silence. C'est aussi ce qui rend un playback jouable :
        // le soliste a besoin de repères rythmiques.
        const compHits = coupe.accords ? [] : (comperRef.current?.nextBar(barIdx, energieMesure) || []);
        // L'anticipation joue l'accord de la mesure SUIVANTE une croche
        // avant : le geste le plus caractéristique du comping.
        const nextVoiced = getVoicedChord(nextRoot, nextChord.quality, style);
        for (const hit of compHits) {
          const humanize = (Math.random() - 0.5) * 0.008;
          samplerRef.current?.triggerAttackRelease(
            hit.anticipate ? nextVoiced : voiced,
            hit.dur,
            Tone.Time(time) + Tone.Time(beatToToneTime(hit.beat)) + humanize,
            hit.velocity
          );
        }

        // Basse walking — la dynamique compte autant que les notes : une
        // fondamentale s'appuie, une note d'approche reste discrète, une
        // ghost note est presque inaudible. Sans ça, toutes les notes
        // sortent au même niveau et la ligne redevient mécanique.
        if (!coupe.basse) bassPattern.forEach(({ note, time: t, dur, velocity }) => {
          bassRef.current?.triggerAttackRelease(
            note, dur,
            Tone.Time(time) + Tone.Time(t),
            velocity ?? 0.8
          );
        });

        // ── Batterie vivante (jamEngine), uniquement si un pack existe ──
        // Remplace le motif statique : forme longue (planner) + décision
        // de phrase (director) + grille → évènements (generateDrumBar),
        // rejoués par la MÊME fonction playDrum() qu'avant — mêmes
        // échantillons, même round-robin, seule la source des évènements
        // change. Le temps renvoyé par generateDrumBar est déjà une valeur
        // absolue compatible avec `time` (le même repère que Tone.js utilise
        // ici), donc aucune conversion n'est nécessaire.
        if (pack && section && directorRef.current && !coupe.batterie) {
          const decision = directorRef.current.decideBar(barIdx, section, section.energy);
          const bpmNow = Tone.getTransport().bpm.value;
          const events = generateDrumBar(pack, decision, {
            barStartTime: time,
            secPerBeat: 60 / bpmNow,
            beatsPerBar: 4,
            bpm: bpmNow,
            energy: section.energy,
          });
          for (const ev of events) playDrum(ev.instrument, ev.time, ev.velocity);
        }

        // Montée de tempo progressive : +5 BPM toutes les deux grilles,
        // appliquée pile au début de la mesure.
        if (rampeRef.current && barIdx > 0 && barIdx % (totalBars * 2) === 0) {
          const nb = Math.min(BPM_MAX, Math.round(Tone.getTransport().bpm.value) + 5);
          Tone.getTransport().bpm.setValueAtTime(nb, time);
          Tone.getDraw().schedule(() => onBpmRef.current?.(nb), time);
        }

        Tone.getDraw().schedule(() => {
          setBeat(barIdx % totalBars);
          const chordIdx = progression.reduce((acc, c, i) => {
            const start = progression.slice(0, i).reduce((s, x) => s + x.bars, 0);
            return (barIdx % totalBars) >= start ? i : acc;
          }, 0);
          setCurrentChord(chordIdx);
          onChordRef.current?.(chordIdx);
        }, time);

      }, Array.from({ length: totalBars }, (_, i) => i), "1m");

      // ── Séquenceur batterie — SEULEMENT si aucun pack n'existe pour ce
      // style (jazz, rock aujourd'hui). Sinon la batterie est déjà générée
      // ci-dessus, bar par bar, dans la boucle principale.
      let beatPart = null;
      if (!pack) {
        const drumPattern = getDrumPattern(style);
        beatPart = new Tone.Part((time, event) => {
          if (coupesRef.current.batterie) return;
          playDrum(event.type, time, event.velocity ?? 0.8);
        }, [
          ...drumPattern.kick.map(t  => ({ time: t, type: "kick"  })),
          ...drumPattern.snare.map(t => ({ time: t, type: "snare" })),
          ...drumPattern.hihat.map(t => ({ time: t, type: "hihat" })),
        ]);
        beatPart.loop = true;
        beatPart.loopEnd = "1m";
        beatSeqRef.current = beatPart;

        // Shuffle pour blues — uniquement pertinent pour l'ancien système :
        // le nouveau applique déjà son propre swing (pack.feel.swing),
        // directement sur le temps de chaque frappe. Appliquer le swing du
        // Transport EN PLUS aurait doublé l'effet.
        if (drumPattern.shuffle) {
          Tone.getTransport().swing     = 0.5;
          Tone.getTransport().swingSubdivision = "8n";
        } else {
          Tone.getTransport().swing = 0;
        }
      } else {
        Tone.getTransport().swing = 0;
      }

      // Décompte : 4 clics sur la première mesure, affichés en grand, puis
      // tout entre ensemble sur le 1. Sans lui, on devait rentrer « au vol ».
      const transport = Tone.getTransport();
      for (let i = 0; i < 4; i++) {
        transport.schedule((t) => {
          playDrum("hihat", t, i === 0 ? 0.95 : 0.7);
          Tone.getDraw().schedule(() => setCompte(i + 1), t);
        }, `0:${i}:0`);
      }
      transport.schedule((t) => Tone.getDraw().schedule(() => setCompte(null), t), "1m");
      seqRef.current.start("1m");
      if (beatPart) beatPart.start("1m");
      // Le décompte est en cours DÈS le lancement : sans ça, le temps de
      // jeu (qui ne tourne que hors décompte) partait avant le premier clic.
      setCompte(1);
      transport.start();
      setPlaying(true);

    } catch (e) {
      console.warn("[BackingTrackPlayer] Erreur:", e);
      setPlayError(e?.message || "Le lecteur n'a pas pu démarrer.");
    }
    setLoading(false);
  }

  // ── Arrêt propre ────────────────────────────────────────────────────────
  function stopBacking() {
    [seqRef, beatSeqRef].forEach(r => {
      try { r.current?.stop(); r.current?.dispose(); r.current = null; } catch {}
    });
    [samplerRef, bassRef, kickRef, snareRef, hihatRef, drumsRef, reverbRef, delayRef, compRef,
     bassFilterRef, bassCompRef, kickCompRef, snareFilterRef].forEach(r => {
      try { r.current?.releaseAll?.(); r.current?.dispose(); r.current = null; } catch {}
    });
    try { Tone.getTransport().stop(); Tone.getTransport().cancel(); } catch {}
    plannerRef.current = null;
    directorRef.current = null;
    setPlaying(false);
    setCompte(null);
    setBeat(0);
    setCurrentChord(0);
    onChordRef.current?.(null);
  }

  const toggle = () => playing ? stopBacking() : startBacking();

  const progression = context.chords;
  const totalBars   = progression.reduce((s, c) => s + c.bars, 0);

  // ── Mode scène ──────────────────────────────────────────────────────────
  // On joue guitare en main, téléphone posé à un mètre : l'accord en cours
  // doit se lire de loin (grand), l'accord suivant doit s'anticiper, et les
  // mesures restantes dans l'accord doivent se voir d'un coup d'œil.
  const idx       = playing ? currentChord : 0;
  const accord    = progression[idx];
  const suivant   = progression[(idx + 1) % progression.length];
  const debutAcc  = progression.slice(0, idx).reduce((s, c) => s + c.bars, 0);
  const mesureDansAccord = playing && compte == null ? beat - debutAcc : -1;
  const changerTempo = (d) => onBpmChange?.(Math.max(BPM_MIN, Math.min(BPM_MAX, bpm + d)));
  const changerEnergie = (d) => {
    const n = Math.max(1, Math.min(5, energie + d));
    if (n === energie) return;
    setEnergie(n);
    // Le plan à venir est recalculé : l'effet s'entend dans les 2 mesures.
    plannerRef.current?.nudgeEnergy(n - energie, mesureRef.current);
  };
  const LIBELLE_ENERGIE = ["", "Très calme", "Calme", "Normal", "Soutenu", "Intense"];
  const carre = { width: 40, height: 40, borderRadius: R.sm, border: `1.5px solid ${C.border}`, background: C.surface, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", color: C.text2, fontWeight: 800, fontSize: 16, fontFamily: FONTS.ui, padding: 0 };

  return (
    <div style={{
      background: C.surface,
      border: `1.5px solid ${playing ? context.color : C.border}`,
      borderRadius: R.lg, padding: "14px 14px 12px",
      transition: "border-color 0.3s, box-shadow 0.3s",
      boxShadow: playing ? `0 0 20px ${context.color}22` : "none",
    }}>

      {/* Accord en cours (grand) + accord suivant + bouton lecture */}
      <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
        <div style={{ flex: 1, minWidth: 0 }} aria-live="polite">
          <div style={{ fontSize: 10.5, fontWeight: 700, color: C.text3, fontFamily: FONTS.ui, textTransform: "uppercase", letterSpacing: "0.08em" }}>
            {compte != null ? "Prépare-toi" : playing ? "Maintenant" : "Premier accord"}
          </div>
          <div style={{ fontSize: compte != null ? 46 : 40, fontWeight: 800, lineHeight: 1.05, letterSpacing: "-1px", fontFamily: FONTS.title, color: playing ? context.colorD : C.text, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
            {compte != null ? `${compte}…` : nomAccord(root, accord)}
          </div>
          {/* Une pastille par mesure de l'accord en cours : on voit combien il en reste */}
          <div aria-hidden="true" style={{ display: "flex", gap: 4, marginTop: 6, height: 6 }}>
            {Array.from({ length: accord.bars }, (_, b) => (
              <div key={b} style={{ width: 18, height: 6, borderRadius: 3, background: b <= mesureDansAccord ? context.color : C.border, transition: "background .08s" }} />
            ))}
          </div>
          <div style={{ fontSize: 13, color: C.text2, fontFamily: FONTS.ui, marginTop: 7 }}>
            Ensuite : <b style={{ color: C.text }}>{nomAccord(root, suivant)}</b>
          </div>
        </div>

        <button onClick={toggle} disabled={loading} className="gr-focus"
          aria-label={loading ? "Chargement des sons" : playing ? "Arrêter le backing track" : "Lancer le backing track"}
          style={{
            width: 64, height: 64, borderRadius: "50%", border: "none", flexShrink: 0,
            background: loading ? C.surface2 : playing
              ? `linear-gradient(135deg, ${context.color}, ${shade(context.color, -45)})`
              : `linear-gradient(135deg, ${C.primary}, ${shade(C.primary, -45)})`,
            cursor: loading ? "default" : "pointer",
            display: "flex", alignItems: "center", justifyContent: "center",
            boxShadow: loading ? "none" : `0 4px 16px ${(playing ? context.color : C.primary)}55`,
            transition: "background 0.2s, box-shadow 0.2s",
          }}>
          {loading
            ? <Ti name="loader" size={24} color={C.text3} />
            : <Ti name={playing ? "player-pause" : "player-play"} size={26} color="#fff" />}
        </button>
      </div>

      {playError && (
        <div role="alert" style={{
          display: "flex", alignItems: "center", gap: 8, marginTop: 10,
          padding: "9px 12px", borderRadius: R.md,
          background: C.coralL, border: `1px solid ${C.coral}`,
        }}>
          <Ti name="alert-circle" size={15} color={C.coralD} style={{ flexShrink: 0 }} />
          <span style={{ fontSize: 12, color: C.coralD, fontFamily: FONTS.ui, lineHeight: 1.4, flex: 1 }}>
            {playError}
          </span>
          <button onClick={startBacking} className="gr-focus" style={{
            background: "none", border: "none", color: C.coralD, fontWeight: 700, padding: "6px 4px",
            fontSize: 12, fontFamily: FONTS.ui, cursor: "pointer", flexShrink: 0, textDecoration: "underline",
          }}>
            Réessayer
          </button>
        </div>
      )}

      {/* La grille complète, l'accord en cours mis en avant */}
      <div style={{ display: "flex", gap: 3, margin: "14px 0 8px" }} aria-hidden="true">
        {Array.from({ length: totalBars }).map((_, i) => (
          <div key={i} style={{
            flex: 1, height: 5, borderRadius: 3,
            background: playing && compte == null && i === beat ? context.color
              : playing && compte == null && i < beat ? `${context.color}44` : C.border,
            transition: "background 0.08s",
          }} />
        ))}
      </div>
      <div style={{ display: "flex", gap: 5, flexWrap: "wrap" }}>
        {progression.map((chord, i) => {
          const isActive = playing && compte == null && i === currentChord;
          return (
            <div key={i} style={{
              padding: "5px 11px", borderRadius: R.pill,
              background: isActive ? context.colorL : C.bg,
              border: `1.5px solid ${isActive ? context.color : C.border}`,
              fontSize: 12.5, fontWeight: isActive ? 800 : 500,
              color: isActive ? context.colorD : C.text2,
              fontFamily: FONTS.ui, transition: "background 0.12s, border-color 0.12s",
            }}>
              {nomAccord(root, chord)}
              <span style={{ fontSize: 10, color: isActive ? context.color : C.text3, marginLeft: 4 }}>
                ×{chord.bars}
              </span>
            </div>
          );
        })}
      </div>

      {/* Tempo : réglable, y compris en jouant, et montée progressive */}
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 14, paddingTop: 12, borderTop: `1px solid ${C.border}` }}>
        <div role="group" aria-label="Tempo" style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <button onClick={() => changerTempo(-5)} aria-label="Ralentir de 5" className="gr-focus" style={carre}>−</button>
          <div style={{ minWidth: 52, textAlign: "center" }}>
            <div style={{ fontSize: 18, fontWeight: 800, color: C.text, lineHeight: 1, fontFamily: FONTS.ui }}>{bpm}</div>
            <div style={{ fontSize: 9.5, color: C.text3, marginTop: 2, fontFamily: FONTS.ui }}>BPM</div>
          </div>
          <button onClick={() => changerTempo(5)} aria-label="Accélérer de 5" className="gr-focus" style={carre}>+</button>
        </div>
        <div style={{ flex: 1 }} />
        <button onClick={() => setRampe(r => !r)} aria-pressed={rampe} className="gr-focus" style={{
          height: 40, padding: "0 12px", borderRadius: R.sm, cursor: "pointer", fontFamily: FONTS.ui,
          border: `1.5px solid ${rampe ? context.color : C.border}`,
          background: rampe ? context.colorL : C.surface,
          color: rampe ? context.colorD : C.text2, fontWeight: 700, fontSize: 12, textAlign: "left", lineHeight: 1.2,
        }}>
          Accélération
          <div style={{ fontSize: 10, fontWeight: 600, color: rampe ? context.colorD : C.text3 }}>+5 toutes les 2 grilles</div>
        </button>
      </div>

      {/* Réglages du groupe : repliés par défaut, pour garder la scène lisible */}
      <button onClick={() => setReglagesOuverts(o => !o)} aria-expanded={reglagesOuverts} className="gr-focus" style={{
        display: "flex", alignItems: "center", gap: 6, width: "100%", marginTop: 10, padding: "8px 2px",
        background: "none", border: "none", cursor: "pointer", fontFamily: FONTS.ui,
        fontSize: 12, fontWeight: 700, color: C.text2, textAlign: "left",
      }}>
        <span aria-hidden="true" style={{ display: "inline-block", transform: reglagesOuverts ? "rotate(90deg)" : "none", transition: "transform .15s" }}>›</span>
        Régler le groupe
        <span style={{ fontWeight: 500, color: C.text3 }}>
          · {LIBELLE_ENERGIE[energie].toLowerCase()}{Object.values(coupes).some(Boolean) ? ` · sans ${Object.entries(coupes).filter(([, v]) => v).map(([k]) => k).join(", ")}` : ""}
        </span>
      </button>
      {reglagesOuverts && (
        <div style={{ paddingTop: 4 }}>
          <div role="group" aria-label="Intensité du groupe" style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ fontSize: 12, color: C.text2, fontFamily: FONTS.ui, width: 64 }}>Intensité</span>
            <button onClick={() => changerEnergie(-1)} aria-label="Plus calme" disabled={energie === 1} className="gr-focus" style={{ ...carre, opacity: energie === 1 ? .4 : 1 }}>−</button>
            <div style={{ flex: 1, textAlign: "center" }}>
              <div aria-hidden="true" style={{ display: "flex", gap: 4, justifyContent: "center" }}>
                {[1, 2, 3, 4, 5].map(n => <span key={n} style={{ width: 16, height: 8, borderRadius: 4, background: n <= energie ? context.color : C.border }} />)}
              </div>
              <div style={{ fontSize: 11, color: C.text2, marginTop: 3, fontFamily: FONTS.ui }}>{LIBELLE_ENERGIE[energie]}</div>
            </div>
            <button onClick={() => changerEnergie(1)} aria-label="Plus intense" disabled={energie === 5} className="gr-focus" style={{ ...carre, opacity: energie === 5 ? .4 : 1 }}>+</button>
          </div>
          <div role="group" aria-label="Instruments" style={{ display: "flex", gap: 6, marginTop: 10 }}>
            {[["accords", "Accords"], ["basse", "Basse"], ["batterie", "Batterie"]].map(([k, label]) => (
              <button key={k} onClick={() => setCoupes(c => ({ ...c, [k]: !c[k] }))} aria-pressed={!coupes[k]} className="gr-focus" style={{
                flex: 1, height: 40, borderRadius: R.sm, cursor: "pointer", fontFamily: FONTS.ui, fontSize: 12, fontWeight: 700,
                border: `1.5px ${coupes[k] ? "dashed" : "solid"} ${coupes[k] ? C.border : context.color}`,
                background: coupes[k] ? C.surface : context.colorL,
                color: coupes[k] ? C.text3 : context.colorD, textDecoration: coupes[k] ? "line-through" : "none",
              }}>{label}</button>
            ))}
          </div>
          <div style={{ fontSize: 11, color: C.text3, marginTop: 6, fontFamily: FONTS.ui }}>
            Coupe la basse pour faire entendre l'harmonie toi-même.
          </div>
        </div>
      )}

    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────
// COMPOSANT PRINCIPAL
// ─────────────────────────────────────────────────────────────────────────
export function JamSession({ onBack, dispatch, state }) {
  const C = useC();
  const LEVEL_COLOR = makeLevelColor(C);
  const CONTEXTS = makeContexts(C);
  const [contextId, setContextId] = useState("blues_minor");
  const [root, setRoot]           = useState("A");
  const [displayMode, setDisplayMode] = useState("notes");
  const [constraint, setConstraint]   = useState(null);
  const [showRootPicker, setShowRootPicker] = useState(false);
  const [bpm, setBpm] = useState(CONTEXTS[0].bpm);
  const [accordIdx, setAccordIdx] = useState(null);   // accord en cours de lecture (null = arrêt)
  const [enLecture, setEnLecture] = useState(false);

  // ── La pratique compte ──────────────────────────────────────────────────
  // 3 minutes de jeu réel (décompte exclu) comptent comme une séance de
  // pratique libre : mêmes actions que l'écran Pratique (PRACTICE_DONE,
  // MARK_STREAK, UPDATE_WEEKLY). L'XP reste soumise au plafond quotidien du
  // reducer : on affiche donc ce qui a VRAIMENT été crédité, pas un chiffre
  // promis. Une séance au plus par visite de l'écran.
  const [secondesJouees, setSecondesJouees] = useState(0);
  const [sessionComptee, setSessionComptee] = useState(null);   // null | { xp }
  const attenteGainRef = useRef(false);
  useEffect(() => {
    if (sessionComptee || secondesJouees < SEUIL_SESSION || !dispatch) return;
    attenteGainRef.current = true;
    setSessionComptee({ xp: null });
    dispatch({ type: "MARK_STREAK" });
    dispatch({ type: "UPDATE_WEEKLY", field: "sessions" });
    // En dernier : lastGain décrit la dernière action traitée.
    dispatch({ type: "PRACTICE_DONE", minutes: Math.round(secondesJouees / 60) });
  }, [secondesJouees, sessionComptee, dispatch]);
  useEffect(() => {
    if (!attenteGainRef.current || state?.lastGain?.kind !== "practice") return;
    attenteGainRef.current = false;
    setSessionComptee({ xp: state.lastGain.xp || 0 });
  }, [state?.lastGain]);

  // ── Contraintes : adaptées au style et au niveau, tenues 2 minutes ─────
  const [niveauContrainte, setNiveauContrainte] = useState(() => niveauParDefaut(state?.level || 1));
  const [resteContrainte, setResteContrainte] = useState(DUREE_CONTRAINTE);
  const [contraintesTenues, setContraintesTenues] = useState(0);
  const unSecondeDePlus = () => {
    setSecondesJouees(n => n + 1);
    setResteContrainte(r => (constraintRef.current && r > 0 ? r - 1 : r));
  };
  const constraintRef = useRef(null);

  const ctx    = CONTEXTS.find(c => c.id === contextId);
  const rootFr = ROOTS_FR.find(r => r.en === root)?.fr ?? root;
  const activeNotes = useMemo(() => getScaleNotes(root, ctx.scale), [root, ctx.scale]);

  // ── Le manche suit les accords ──────────────────────────────────────────
  // Pendant la lecture, les notes de l'accord en cours s'allument sur la
  // gamme : c'est la compétence « jouer les changements » (leçon impro-04),
  // pratiquée au lieu d'être seulement décrite. Le manche n'allume que les
  // notes présentes dans la gamme affichée ; celles qui en sortent (la
  // tierce majeure du IV7 sur un blues, par exemple) sont signalées à part,
  // parce que c'est justement là que se joue le changement.
  const accordEnCours = accordIdx != null ? ctx.chords[accordIdx] : null;
  const notesDeLAccord = useMemo(
    () => (accordEnCours ? notesAccord(root, accordEnCours) : []),
    [accordEnCours, root]
  );
  const dansLaGamme = (n) => activeNotes.some(g => normalizeNote(g) === normalizeNote(n));
  const choisirContexte = (c) => { setContextId(c.id); setBpm(c.bpm); };

  constraintRef.current = constraint;
  const tenue = constraint && resteContrainte === 0;
  const contrainteTenueRef = useRef(null);
  useEffect(() => {
    if (tenue && contrainteTenueRef.current !== constraint) {
      contrainteTenueRef.current = constraint;
      setContraintesTenues(n => n + 1);
    }
  }, [tenue, constraint]);
  const randomConstraint = (niveau = niveauContrainte) => {
    const candidates = CONSTRAINTS.filter(c =>
      c.level === niveau && (!c.contextes || c.contextes.includes(contextId)) && c !== constraint);
    const pool = candidates.length ? candidates : CONSTRAINTS.filter(c => c.level === niveau);
    setConstraint(pool[Math.floor(Math.random() * pool.length)]);
    setResteContrainte(DUREE_CONTRAINTE);
  };

  const transposeSemitone = (dir) => {
    const idx = CHROMATIC.indexOf(root);
    setRoot(CHROMATIC[(idx + dir + 12) % 12]);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh", background: C.bg }}>

      {/* Header */}
      <div style={{ padding: "14px 16px 12px", display: "flex", alignItems: "center", gap: 10, borderBottom: `1px solid ${C.border}`, background: C.surface, position: "sticky", top: 0, zIndex: 10 }}>
        <button onClick={onBack} aria-label="Retour aux outils" className="gr-focus" style={{ width: 40, height: 40, margin: "-4px 0 -4px -8px", background: "none", border: "none", borderRadius: R.sm, cursor: "pointer", color: C.text2, padding: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <Ti name="chevron-left" size={22} />
        </button>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 16, fontWeight: 700, color: C.text, fontFamily: FONTS.title }}>Jam Session</div>
          <div style={{ fontSize: 11, color: C.text3, fontFamily: FONTS.ui }}>{rootFr} - {ctx.label}</div>
        </div>
        <Gropi pose="rocker" size={46} anim="wiggle" />
      </div>

      <div style={{ padding: "14px 16px", display: "flex", flexDirection: "column", gap: 12, overflowY: "auto", paddingBottom: 32 }}>

        {/* Selecteur contexte */}
        <div style={{ overflowX: "auto", WebkitOverflowScrolling: "touch" }}>
          <div style={{ display: "flex", gap: 8, paddingBottom: 4 }}>
            {CONTEXTS.map(c => (
              <button key={c.id} onClick={() => choisirContexte(c)} aria-pressed={contextId === c.id} className="gr-focus" style={{
                flexShrink: 0, padding: "10px 14px", borderRadius: R.pill,
                border: `1.5px solid ${contextId === c.id ? c.color : C.border}`,
                background: contextId === c.id ? c.colorL : C.surface,
                color: contextId === c.id ? c.colorD : C.text2,
                fontSize: 12, fontWeight: contextId === c.id ? 600 : 400,
                cursor: "pointer", fontFamily: FONTS.ui, whiteSpace: "nowrap",
              }}>
                {c.label}
              </button>
            ))}
          </div>
        </div>

        {/* Description */}
        <div style={{ background: ctx.colorL, border: `1px solid ${ctx.colorB}`, borderRadius: R.lg, padding: "10px 14px" }}>
          <div style={{ fontSize: 12, color: ctx.colorD, fontFamily: FONTS.title, lineHeight: 1.5 }}>{ctx.desc}</div>
        </div>

        {/* Backing track player */}
        <BackingTrackPlayer context={ctx} root={root} bpm={bpm} onBpmChange={setBpm} onChord={setAccordIdx} onSecondeJouee={unSecondeDePlus} onLecture={setEnLecture} />

        {/* Séance de pratique : on voit ce qu'il reste pour qu'elle compte */}
        {(secondesJouees > 0 || sessionComptee) && (
          <div role="status" style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 12px", borderRadius: R.md, background: sessionComptee ? C.greenL : C.surface, border: `1px solid ${sessionComptee ? C.greenBorder : C.border}` }}>
            {sessionComptee ? (
              <>
                <Ti name="check" size={16} color={C.greenD} />
                <div style={{ fontSize: 12.5, color: C.greenD, fontFamily: FONTS.ui, lineHeight: 1.4 }}>
                  <b>Séance comptée</b> dans ta série et tes objectifs
                  {sessionComptee.xp > 0 ? ` · +${sessionComptee.xp} XP` : sessionComptee.xp === 0 ? " · XP de pratique du jour déjà au maximum" : ""}
                </div>
              </>
            ) : (
              <>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 12, color: C.text2, fontFamily: FONTS.ui }}>
                    Encore <b>{fmtDuree(SEUIL_SESSION - secondesJouees)}</b> de jeu pour que la séance compte
                  </div>
                  <div aria-hidden="true" style={{ height: 4, borderRadius: 2, background: C.border, marginTop: 6, overflow: "hidden" }}>
                    <div style={{ width: `${Math.min(100, (secondesJouees / SEUIL_SESSION) * 100)}%`, height: "100%", background: ctx.color, transition: "width 1s linear" }} />
                  </div>
                </div>
              </>
            )}
          </div>
        )}

        {/* Tonique */}
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <div style={{ fontSize: 11, fontWeight: 600, color: C.text3, fontFamily: FONTS.ui, textTransform: "uppercase", letterSpacing: "0.08em", width: 60 }}>Tonique</div>
          <button onClick={() => transposeSemitone(-1)} aria-label="Un demi-ton plus bas" className="gr-focus" style={{ width: 40, height: 40, borderRadius: 10, border: `1px solid ${C.border}`, background: C.surface, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Ti name="chevron-left" size={16} color={C.text2} />
          </button>
          <button onClick={() => setShowRootPicker(!showRootPicker)} aria-expanded={showRootPicker} aria-label={`Tonique : ${rootFr}. Choisir une autre tonique`} className="gr-focus" style={{ flex: 1, height: 40, borderRadius: 10, border: `1.5px solid ${ctx.color}`, background: ctx.colorL, cursor: "pointer", fontSize: 16, fontWeight: 700, color: ctx.colorD, fontFamily: FONTS.ui }}>
            {rootFr}
          </button>
          <button onClick={() => transposeSemitone(1)} aria-label="Un demi-ton plus haut" className="gr-focus" style={{ width: 40, height: 40, borderRadius: 10, border: `1px solid ${C.border}`, background: C.surface, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Ti name="chevron-right" size={16} color={C.text2} />
          </button>
        </div>

        {/* Picker tonique */}
        {showRootPicker && (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(6, 1fr)", gap: 6, background: C.surface, border: `1px solid ${C.border}`, borderRadius: R.lg, padding: 10 }}>
            {ROOTS_FR.map(r => (
              <button key={r.en} onClick={() => { setRoot(r.en); setShowRootPicker(false); }} aria-pressed={root === r.en} className="gr-focus" style={{
                minHeight: 40, padding: "8px 4px", borderRadius: 8,
                border: `1px solid ${root === r.en ? ctx.color : C.border}`,
                background: root === r.en ? ctx.colorL : C.bg,
                color: root === r.en ? ctx.colorD : C.text,
                fontSize: 12, fontWeight: root === r.en ? 700 : 400,
                cursor: "pointer", fontFamily: FONTS.ui,
              }}>{r.fr}</button>
            ))}
          </div>
        )}

        {/* Affichage manche */}
        <div style={{ display: "flex", gap: 6 }}>
          {[{ key: "notes", label: "Notes" }, { key: "intervals", label: "Intervalles" }, { key: "degrees", label: "Degrés" }].map(m => (
            <button key={m.key} onClick={() => setDisplayMode(m.key)} aria-pressed={displayMode === m.key} className="gr-focus" style={{
              flex: 1, minHeight: 40, padding: "7px 0", borderRadius: 8,
              border: `1px solid ${displayMode === m.key ? ctx.color : C.border}`,
              background: displayMode === m.key ? ctx.colorL : C.surface,
              color: displayMode === m.key ? ctx.colorD : C.text3,
              fontSize: 11, fontWeight: displayMode === m.key ? 600 : 400,
              cursor: "pointer", fontFamily: FONTS.ui,
            }}>{m.label}</button>
          ))}
        </div>

        {/* Manche */}
        <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: R.lg, overflow: "hidden" }}>
          <div style={{ padding: "8px 8px 4px", overflowX: "auto", WebkitOverflowScrolling: "touch" }}>
            <Fretboard mode="scale" root={root} scale={ctx.scale} displayMode={displayMode} lang="fr" compact={true}
              flashNotes={notesDeLAccord.length ? notesDeLAccord : null} />
          </div>
          <div style={{ padding: "8px 12px 10px", borderTop: `1px solid ${C.border}`, minHeight: 44, display: "flex", alignItems: "center", gap: 6, flexWrap: "wrap" }} aria-live="polite">
            {accordEnCours ? (
              <>
                <span style={{ fontSize: 11, fontWeight: 700, color: C.text3, fontFamily: FONTS.ui, marginRight: 2 }}>
                  Notes de {nomAccord(root, accordEnCours)} :
                </span>
                {notesDeLAccord.map(n => {
                  const dedans = dansLaGamme(n);
                  return (
                    <span key={n} title={dedans ? "Dans ta gamme" : "Hors de ta gamme : c'est la note qui fait entendre le changement"} style={{
                      padding: "3px 8px", borderRadius: R.pill, fontSize: 12, fontWeight: 800, fontFamily: FONTS.ui,
                      background: dedans ? ctx.colorL : C.surface,
                      border: `1.5px ${dedans ? "solid" : "dashed"} ${dedans ? ctx.color : C.text3}`,
                      color: dedans ? ctx.colorD : C.text,
                    }}>{noteToFr(n)}{dedans ? "" : " *"}</span>
                  );
                })}
                {notesDeLAccord.some(n => !dansLaGamme(n)) && (
                  <span style={{ fontSize: 11, color: C.text3, fontFamily: FONTS.ui, width: "100%" }}>
                    * hors de ta gamme : c'est elle qui fait entendre le changement d'accord.
                  </span>
                )}
              </>
            ) : (
              <span style={{ fontSize: 12, color: C.text3, fontFamily: FONTS.ui }}>
                Lance le backing : les notes de chaque accord s'allumeront sur le manche.
              </span>
            )}
          </div>
        </div>

        {/* Notes + cibles */}
        <div style={{ display: "flex", gap: 10 }}>
          <div style={{ flex: 1, background: C.surface, border: `1px solid ${C.border}`, borderRadius: R.lg, padding: "10px 12px" }}>
            <div style={{ fontSize: 10, fontWeight: 700, color: C.text3, fontFamily: FONTS.ui, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 6 }}>Gamme</div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
              {activeNotes.map((note, i) => (
                <div key={note} style={{ padding: "4px 8px", borderRadius: R.pill, background: i === 0 ? ctx.colorL : C.bg, border: `1px solid ${i === 0 ? ctx.color : C.border}`, fontSize: 12, fontWeight: i === 0 ? 700 : 400, color: i === 0 ? ctx.colorD : C.text2, fontFamily: FONTS.ui }}>
                  {noteToFr(note)}{i === 0 ? " R" : ""}
                </div>
              ))}
            </div>
          </div>
          <div style={{ flex: 1, background: ctx.colorL, border: `1px solid ${ctx.colorB}`, borderRadius: R.lg, padding: "10px 12px" }}>
            <div style={{ fontSize: 10, fontWeight: 700, color: ctx.colorD, fontFamily: FONTS.ui, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 6 }}>Cibles</div>
            <div style={{ fontSize: 11, color: ctx.colorD, fontFamily: FONTS.ui, lineHeight: 1.5 }}>{ctx.targetDesc}</div>
          </div>
        </div>

        {/* Contrainte : adaptée au style et au niveau, chronométrée */}
        <div style={{ background: constraint ? C.amberL : C.surface, border: `1px solid ${constraint ? C.amberBorder : C.border}`, borderRadius: R.lg, padding: "12px 14px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
            <div style={{ flex: 1, fontSize: 10.5, fontWeight: 700, color: constraint ? C.amberD : C.text3, fontFamily: FONTS.ui, textTransform: "uppercase", letterSpacing: "0.08em" }}>
              Contrainte du moment
            </div>
            {contraintesTenues > 0 && (
              <span style={{ fontSize: 11, fontWeight: 700, color: C.amberD, fontFamily: FONTS.ui }}>{contraintesTenues} tenue{contraintesTenues > 1 ? "s" : ""}</span>
            )}
          </div>
          <div role="group" aria-label="Difficulté des contraintes" style={{ display: "flex", gap: 4, marginBottom: 10, background: C.surface2, borderRadius: R.sm, padding: 3 }}>
            {NIVEAUX_CONTRAINTE.map(n => (
              <button key={n} onClick={() => { setNiveauContrainte(n); if (constraint) randomConstraint(n); }} aria-pressed={niveauContrainte === n} className="gr-focus" style={{
                flex: 1, minHeight: 34, borderRadius: R.sm - 2, border: "none", cursor: "pointer", fontFamily: FONTS.ui, fontSize: 12, fontWeight: 700,
                background: niveauContrainte === n ? C.surface : "transparent", color: niveauContrainte === n ? LEVEL_COLOR[n] : C.text3,
                boxShadow: niveauContrainte === n ? `0 0 0 1.5px ${C.border}` : "none",
              }}>{n}</button>
            ))}
          </div>
          {constraint ? (
            <>
              <div id="contrainte-texte" aria-live="polite" style={{ fontSize: 14, color: C.amberD, fontFamily: FONTS.title, lineHeight: 1.5, fontWeight: 600 }}>{constraint.text}</div>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginTop: 10 }}>
                {tenue ? (
                  <div style={{ flex: 1, display: "flex", alignItems: "center", gap: 6, fontSize: 12.5, fontWeight: 700, color: C.greenD, fontFamily: FONTS.ui }}>
                    <Ti name="check" size={15} color={C.greenD} /> Tenue 2 minutes, bravo.
                  </div>
                ) : (
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 12, color: C.amberD, fontFamily: FONTS.ui }}>
                      {!enLecture ? "Lance le backing : le chrono tourne pendant que tu joues." : <>Tiens-la encore <b>{fmtDuree(resteContrainte)}</b></>}
                    </div>
                    <div aria-hidden="true" style={{ height: 4, borderRadius: 2, background: C.amberBorder, marginTop: 6, overflow: "hidden" }}>
                      <div style={{ width: `${((DUREE_CONTRAINTE - resteContrainte) / DUREE_CONTRAINTE) * 100}%`, height: "100%", background: C.amber, transition: "width 1s linear" }} />
                    </div>
                  </div>
                )}
                <button onClick={() => randomConstraint()} className="gr-focus" style={{ minHeight: 36, padding: "0 14px", borderRadius: R.pill, border: `1px solid ${C.amber}`, background: tenue ? C.amber : C.surface, color: tenue ? "#fff" : C.amberD, fontSize: 12, fontWeight: 700, cursor: "pointer", fontFamily: FONTS.ui }}>
                  {tenue ? "Suivante" : "Changer"}
                </button>
              </div>
            </>
          ) : (
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <div style={{ flex: 1, fontSize: 12.5, color: C.text2, fontFamily: FONTS.ui, lineHeight: 1.45 }}>
                Une limite claire, tenue 2 minutes : c'est ce qui fait progresser en impro.
              </div>
              <button onClick={() => randomConstraint()} className="gr-focus" style={{ minHeight: 36, padding: "0 14px", borderRadius: R.pill, border: "none", background: C.amber, color: "#fff", fontSize: 12, fontWeight: 700, cursor: "pointer", fontFamily: FONTS.ui }}>
                Tirer
              </button>
            </div>
          )}
        </div>

        {/* Rappels */}
        <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: R.lg, padding: "12px 14px" }}>
          <div style={{ fontSize: 10, fontWeight: 700, color: C.text3, fontFamily: FONTS.ui, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 8 }}>Rappels</div>
          {["Silence = note. Utilise-le.", "Arrive sur une note de l'accord sur les temps forts.", "Une bonne phrase monte puis descend.", "Le sommet d'un solo se place vers les deux tiers, pas à la fin."].map((tip, i) => (
            <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 8, marginBottom: i < 3 ? 6 : 0 }}>
              <div style={{ width: 4, height: 4, borderRadius: "50%", background: ctx.color, marginTop: 6, flexShrink: 0 }} />
              <div style={{ fontSize: 12, color: C.text2, fontFamily: FONTS.ui, lineHeight: 1.5 }}>{tip}</div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}
