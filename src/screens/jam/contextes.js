// GuitarPath -- screens/jam/contextes.js
// Styles de la Jam : gamme, grille d'accords, tempo et couleurs par contexte.

export const makeContexts = (C) => [
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
