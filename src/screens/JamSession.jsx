// GuitarPath -- screens/JamSession.jsx
// Outil interactif d'improvisation : gamme active, notes cibles, contraintes + backing track
import { useState, useMemo, useEffect, useRef } from "react";
import { FONTS, R } from "../design/tokens.js";
import { useC } from "../design/ThemeContext.jsx";
import { Ti } from "../design/Ti.jsx";
import { Gropi } from "../design/Gropi.jsx";
import { Fretboard } from "../Fretboard.jsx";
import { getScaleNotes, noteToFr, normalizeNote } from "../fretboardUtils.js";
import { generateWalkingBar, toToneNote as toToneNoteFromMidi, toToneTime } from "../music/walkingBass.js";
import { createComper, beatToToneTime } from "../music/compRhythm.js";
import * as Tone from "tone";

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
    desc: "La 6te majeure est ta note caracteristique. Evite de resoudre trop tot.",
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
  { en: "D",  fr: "Re"   }, { en: "E",  fr: "Mi"   }, { en: "F",  fr: "Fa"   },
  { en: "G",  fr: "Sol"  }, { en: "C#", fr: "Do#"  }, { en: "D#", fr: "Re#"  },
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
};

const CONSTRAINTS = [
  { text: "Joue UNIQUEMENT des notes longues. Zero doubles-croches.", level: "Facile" },
  { text: "Chaque phrase doit finir sur une note de l'accord (chord tone).", level: "Facile" },
  { text: "Maximum 4 notes par phrase. Silence entre chaque phrase.", level: "Facile" },
  { text: "Joue une phrase de 2 mesures, silence 2 mesures. Call & response.", level: "Facile" },
  { text: "Reste dans les 3 premieres cordes (aigues) uniquement.", level: "Moyen" },
  { text: "Commence chaque phrase sur un temps fort (temps 1 ou 3).", level: "Moyen" },
  { text: "Utilise le silence pendant au moins 50% du temps.", level: "Moyen" },
  { text: "Monte progressivement en intensite pendant 2 minutes, puis redescends.", level: "Moyen" },
  { text: "Chaque phrase doit contenir exactement une note chromatique (hors gamme).", level: "Difficile" },
  { text: "Cible uniquement les guide tones (3e et 7e) sur les temps 1 et 3.", level: "Difficile" },
  { text: "Construis un solo en 3 actes : calme (1 min) -> montee (2 min) -> climax (30s).", level: "Difficile" },
  { text: "Joue les yeux fermes. Sens le manche, ne le regarde pas.", level: "Difficile" },
];

const makeLevelColor = (C) => ({ "Facile": C.green, "Moyen": C.amber, "Difficile": C.coral });

// ─────────────────────────────────────────────────────────────────────────
// BACKING TRACK PLAYER — Version Pro
// Samples FatBoy guitare steel + basse compressée + batterie procédurale
// Chaîne audio : instruments -> reverb/delay -> compresseur master
// ─────────────────────────────────────────────────────────────────────────
function BackingTrackPlayer({ context, root, bpm }) {
  const C = useC();
  const [playing, setPlaying]       = useState(false);
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
  // Refs master chain
  const reverbRef   = useRef(null);
  const delayRef    = useRef(null);
  const compRef     = useRef(null);

  // Arrêt si contexte ou root change
  useEffect(() => { if (playing) stopBacking(); }, [context.id, root]);
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
  };

  function getVoicedChord(rootNote, quality, style = "jazz") {
    const iBlues = style === "blues" || style === "blues12";
    const voicing = iBlues && quality === "dom7"
      ? VOICINGS.dom7b
      : VOICINGS[quality] || VOICINGS.min7;

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

  function getBassPattern(rootNote, quality, style, nextRoot, barIdx) {
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
      energy: 3,
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
        const chordRoot = transposeNote(root, chord.degree);
        const voiced    = getVoicedChord(chordRoot, chord.quality, style);
        // L'accord SUIVANT est indispensable : c'est lui qui détermine la
        // note d'approche du 4e temps, le geste qui fait qu'une walking bass
        // avance au lieu de tourner en rond.
        const nextChord = barMap[(barIdx + 1) % totalBars];
        const nextRoot  = transposeNote(root, nextChord.degree);
        const bassPattern = getBassPattern(chordRoot, chord.quality, style, nextRoot, barIdx);

        // ── Accompagnement rythmé ──────────────────────────────────
        // Avant : un seul accord tenu sur la mesure entière ("1m"). C'est
        // ce qui restait de plus "amateur" — un accompagnateur ne tient
        // pas un accord quatre temps durant, il place des accents et il
        // laisse du silence. C'est aussi ce qui rend un playback jouable :
        // le soliste a besoin de repères rythmiques.
        const compHits = comperRef.current?.nextBar(barIdx, 3) || [];
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
        bassPattern.forEach(({ note, time: t, dur, velocity }) => {
          bassRef.current?.triggerAttackRelease(
            note, dur,
            Tone.Time(time) + Tone.Time(t),
            velocity ?? 0.8
          );
        });

        Tone.getDraw().schedule(() => {
          setBeat(barIdx % totalBars);
          const chordIdx = progression.reduce((acc, c, i) => {
            const start = progression.slice(0, i).reduce((s, x) => s + x.bars, 0);
            return (barIdx % totalBars) >= start ? i : acc;
          }, 0);
          setCurrentChord(chordIdx);
        }, time);

      }, Array.from({ length: totalBars }, (_, i) => i), "1m");

      // ── Séquenceur batterie ───────────────────────────────────────────
      const drumPattern = getDrumPattern(style);
      const beatPart = new Tone.Part((time, event) => {
        playDrum(event.type, time, event.velocity ?? 0.8);
      }, [
        ...drumPattern.kick.map(t  => ({ time: t, type: "kick"  })),
        ...drumPattern.snare.map(t => ({ time: t, type: "snare" })),
        ...drumPattern.hihat.map(t => ({ time: t, type: "hihat" })),
      ]);
      beatPart.loop = true;
      beatPart.loopEnd = "1m";
      beatSeqRef.current = beatPart;

      // Shuffle pour blues
      if (drumPattern.shuffle) {
        Tone.getTransport().swing     = 0.5;
        Tone.getTransport().swingSubdivision = "8n";
      } else {
        Tone.getTransport().swing = 0;
      }

      seqRef.current.start(0);
      beatPart.start(0);
      Tone.getTransport().start();
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
    setPlaying(false);
    setBeat(0);
    setCurrentChord(0);
  }

  const toggle = () => playing ? stopBacking() : startBacking();

  const progression = context.chords;
  const totalBars   = progression.reduce((s, c) => s + c.bars, 0);

  return (
    <div style={{
      background: C.surface,
      border: `1.5px solid ${playing ? context.color : C.border}`,
      borderRadius: R.lg, padding: "14px 14px 12px",
      transition: "border-color 0.3s, box-shadow 0.3s",
      boxShadow: playing ? `0 0 20px ${context.color}22` : "none",
    }}>

      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
        <div>
          <div style={{ fontSize: 10, fontWeight: 700, color: C.text3, fontFamily: FONTS.ui, textTransform: "uppercase", letterSpacing: "0.08em" }}>
            Backing Track
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 3 }}>
            <span style={{ fontSize: 13, fontWeight: 600, color: playing ? context.colorD : C.text2, fontFamily: FONTS.ui }}>
              {bpm} BPM
            </span>
            {playing && (
              <span style={{ fontSize: 10, color: context.color, fontFamily: FONTS.ui, fontWeight: 600 }}>
                EN COURS
              </span>
            )}
          </div>
        </div>

        <button onClick={toggle} disabled={loading} style={{
          width: 52, height: 52, borderRadius: "50%", border: "none",
          background: loading
            ? C.surface2
            : playing
            ? `linear-gradient(135deg, ${context.color}, ${shade(context.color, -45)})`
            : `linear-gradient(135deg, ${C.primary}, ${shade(C.primary, -45)})`,
          cursor: loading ? "default" : "pointer",
          display: "flex", alignItems: "center", justifyContent: "center",
          boxShadow: playing
            ? `0 4px 18px ${context.color}66`
            : loading ? "none"
            : "0 4px 14px rgba(76,66,200,0.35)",
          transition: "all 0.2s",
        }}>
          {loading
            ? <Ti name="loader" size={22} color={C.text3} />
            : <Ti name={playing ? "player-stop" : "player-play"} size={22} color="#fff" />
          }
        </button>
      </div>

      {playError && (
        <div style={{
          display: "flex", alignItems: "center", gap: 8, marginBottom: 10,
          padding: "9px 12px", borderRadius: R.md,
          background: C.coralL, border: `1px solid ${C.coral}`,
        }}>
          <Ti name="alert-circle" size={15} color={C.coralD} style={{ flexShrink: 0 }} />
          <span style={{ fontSize: 12, color: C.coralD, fontFamily: FONTS.ui, lineHeight: 1.4, flex: 1 }}>
            {playError}
          </span>
          <button onClick={startBacking} style={{
            background: "none", border: "none", color: C.coralD, fontWeight: 700,
            fontSize: 12, fontFamily: FONTS.ui, cursor: "pointer", flexShrink: 0, textDecoration: "underline",
          }}>
            Réessayer
          </button>
        </div>
      )}

      {/* Visualiseur mesures */}
      <div style={{ display: "flex", gap: 3, marginBottom: 10 }}>
        {Array.from({ length: totalBars }).map((_, i) => (
          <div key={i} style={{
            flex: 1, height: 5, borderRadius: 3,
            background: playing && i === beat
              ? context.color
              : playing && i < beat
              ? `${context.color}44`
              : C.border,
            transition: "background 0.08s",
          }} />
        ))}
      </div>

      {/* Accords de la progression */}
      <div style={{ display: "flex", gap: 5, flexWrap: "wrap" }}>
        {progression.map((chord, i) => {
          const chordRoot   = transposeNote(root, chord.degree);
          const chordRootFr = ROOTS_FR.find(r => r.en === chordRoot)?.fr ?? chordRoot;
          const qualLabel   = { maj7:"maj7", min7:"m7", dom7:"7" }[chord.quality];
          const isActive    = playing && i === currentChord;
          return (
            <div key={i} style={{
              padding: "5px 11px", borderRadius: R.pill,
              background: isActive ? context.colorL : C.bg,
              border: `1.5px solid ${isActive ? context.color : C.border}`,
              fontSize: 12, fontWeight: isActive ? 700 : 400,
              color: isActive ? context.colorD : C.text2,
              fontFamily: FONTS.ui, transition: "all 0.12s",
              boxShadow: isActive ? `0 2px 8px ${context.color}33` : "none",
            }}>
              {chordRootFr}{qualLabel}
              <span style={{ fontSize: 9, color: isActive ? context.color : C.text3, marginLeft: 4 }}>
                x{chord.bars}
              </span>
            </div>
          );
        })}
      </div>

    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────
// COMPOSANT PRINCIPAL
// ─────────────────────────────────────────────────────────────────────────
export function JamSession({ onBack }) {
  const C = useC();
  const LEVEL_COLOR = makeLevelColor(C);
  const CONTEXTS = makeContexts(C);
  const [contextId, setContextId] = useState("blues_minor");
  const [root, setRoot]           = useState("A");
  const [displayMode, setDisplayMode] = useState("notes");
  const [constraint, setConstraint]   = useState(null);
  const [showRootPicker, setShowRootPicker] = useState(false);

  const ctx    = CONTEXTS.find(c => c.id === contextId);
  const rootFr = ROOTS_FR.find(r => r.en === root)?.fr ?? root;
  const activeNotes = useMemo(() => getScaleNotes(root, ctx.scale), [root, ctx.scale]);

  const randomConstraint = () => {
    const next = CONSTRAINTS[Math.floor(Math.random() * CONSTRAINTS.length)];
    setConstraint(next);
  };

  const transposeSemitone = (dir) => {
    const idx = CHROMATIC.indexOf(root);
    setRoot(CHROMATIC[(idx + dir + 12) % 12]);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh", background: C.bg }}>

      {/* Header */}
      <div style={{ padding: "14px 16px 12px", display: "flex", alignItems: "center", gap: 10, borderBottom: `1px solid ${C.border}`, background: C.surface, position: "sticky", top: 0, zIndex: 10 }}>
        <button onClick={onBack} style={{ background: "none", border: "none", cursor: "pointer", color: C.text2, padding: 0 }}>
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
              <button key={c.id} onClick={() => setContextId(c.id)} style={{
                flexShrink: 0, padding: "8px 14px", borderRadius: R.pill,
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
        <BackingTrackPlayer context={ctx} root={root} bpm={ctx.bpm} />

        {/* Tonique */}
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <div style={{ fontSize: 11, fontWeight: 600, color: C.text3, fontFamily: FONTS.ui, textTransform: "uppercase", letterSpacing: "0.08em", width: 60 }}>Tonique</div>
          <button onClick={() => transposeSemitone(-1)} style={{ width: 34, height: 34, borderRadius: 10, border: `1px solid ${C.border}`, background: C.surface, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Ti name="chevron-left" size={16} color={C.text2} />
          </button>
          <button onClick={() => setShowRootPicker(!showRootPicker)} style={{ flex: 1, height: 34, borderRadius: 10, border: `1.5px solid ${ctx.color}`, background: ctx.colorL, cursor: "pointer", fontSize: 16, fontWeight: 700, color: ctx.colorD, fontFamily: FONTS.ui }}>
            {rootFr}
          </button>
          <button onClick={() => transposeSemitone(1)} style={{ width: 34, height: 34, borderRadius: 10, border: `1px solid ${C.border}`, background: C.surface, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Ti name="chevron-right" size={16} color={C.text2} />
          </button>
        </div>

        {/* Picker tonique */}
        {showRootPicker && (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(6, 1fr)", gap: 6, background: C.surface, border: `1px solid ${C.border}`, borderRadius: R.lg, padding: 10 }}>
            {ROOTS_FR.map(r => (
              <button key={r.en} onClick={() => { setRoot(r.en); setShowRootPicker(false); }} style={{
                padding: "8px 4px", borderRadius: 8,
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
          {[{ key: "notes", label: "Notes" }, { key: "intervals", label: "Intervalles" }, { key: "degrees", label: "Degres" }].map(m => (
            <button key={m.key} onClick={() => setDisplayMode(m.key)} style={{
              flex: 1, padding: "7px 0", borderRadius: 8,
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
            <Fretboard mode="scale" root={root} scale={ctx.scale} displayMode={displayMode} lang="fr" compact={true} />
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

        {/* Contrainte */}
        <div style={{ background: constraint ? C.amberL : C.surface, border: `1px solid ${constraint ? C.amberBorder : C.border}`, borderRadius: R.lg, padding: "12px 14px" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: constraint ? 8 : 0 }}>
            <div style={{ fontSize: 10, fontWeight: 700, color: constraint ? C.amberD : C.text3, fontFamily: FONTS.ui, textTransform: "uppercase", letterSpacing: "0.08em" }}>
              Contrainte du moment
            </div>
            <button onClick={randomConstraint} style={{ padding: "5px 12px", borderRadius: R.pill, border: `1px solid ${C.amber}`, background: C.amber, color: "#fff", fontSize: 11, fontWeight: 700, cursor: "pointer", fontFamily: FONTS.ui }}>
              {constraint ? "Nouvelle" : "Tirer"}
            </button>
          </div>
          {constraint ? (
            <>
              <div style={{ fontSize: 13, color: C.amberD, fontFamily: FONTS.title, lineHeight: 1.55, fontWeight: 500 }}>{constraint.text}</div>
              <div style={{ fontSize: 10, fontFamily: FONTS.ui, marginTop: 4, color: LEVEL_COLOR[constraint.level] }}>{constraint.level}</div>
            </>
          ) : (
            <div style={{ fontSize: 12, color: C.text3, fontFamily: FONTS.ui }}>Tire une contrainte pour booster ta creativite</div>
          )}
        </div>

        {/* Rappels */}
        <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: R.lg, padding: "12px 14px" }}>
          <div style={{ fontSize: 10, fontWeight: 700, color: C.text3, fontFamily: FONTS.ui, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 8 }}>Rappels</div>
          {["Silence = note. Utilise-le.", "Arrive sur une chord tone sur les temps forts.", "Une bonne phrase monte puis descend.", "Le climax aux 2/3 du solo, pas a la fin."].map((tip, i) => (
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
