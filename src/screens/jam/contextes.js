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
    // Joué par le pack rock, mais en accords pleins : un power chord
    // effacerait la b7 qui fait entendre le mode.
    compVoicing: "triad",
  },

  // ── Styles avec plusieurs grilles ────────────────────────────────────
  // `grilles` : progressions au choix (la première par défaut, `chords` en
  // est la copie) ; une grille peut proposer sa propre gamme (`scale`).
  // `gammes` : gammes conseillées, au choix. `tonalites` : tonalités
  // conseillées (valeurs internes en dièses).
  {
    id: "rock",
    label: "Rock",
    color: C.pink, colorL: C.pinkL, colorD: C.pinkD, colorB: C.pinkBorder,
    scale: "pentatonic_minor",
    gammes: ["pentatonic_minor", "pentatonic_major"],
    tonalites: ["E", "A", "D", "G"],
    desc: "Croches droites, caisse claire sur 2 et 4, basse qui pousse. La penta mineure pour le mordant, la majeure pour chanter.",
    targetDesc: "Fondamentale et quinte sur les temps forts, tierce de l'accord pour la couleur",
    bpm: 112,
    grilles: [
      { id: "I-IV-V", label: "I–IV–V", chords: [
        { degree: 0, quality: "maj", bars: 2 },
        { degree: 5, quality: "maj", bars: 2 },
        { degree: 7, quality: "maj", bars: 1 },
        { degree: 5, quality: "maj", bars: 1 },
        { degree: 0, quality: "maj", bars: 2 },
      ]},
      { id: "I-bVII-IV", label: "I–♭VII–IV", chords: [
        { degree: 0,  quality: "maj", bars: 2 },
        { degree: 10, quality: "maj", bars: 1 },
        { degree: 5,  quality: "maj", bars: 1 },
      ]},
      { id: "vi-IV-I-V", label: "vi–IV–I–V", scale: "pentatonic_major", chords: [
        { degree: 9, quality: "min", bars: 1 },
        { degree: 5, quality: "maj", bars: 1 },
        { degree: 0, quality: "maj", bars: 1 },
        { degree: 7, quality: "maj", bars: 1 },
      ]},
    ],
  },
  {
    id: "jazz_swing",
    label: "Jazz swing",
    color: C.purple, colorL: C.purpleL, colorD: C.purpleD, colorB: C.purpleBorder,
    scale: "major",
    gammes: ["major", "harmonic_minor", "blues"],
    tonalites: ["C", "F", "A#", "G"],
    desc: "Croches ternaires, ride « ding-ding-a-ding », walking bass. Joue les arpèges : un mode par accord.",
    targetDesc: "3e et 7e de chaque accord sur les temps forts (dorien sur ii, mixolydien sur V)",
    bpm: 140,
    grilles: [
      { id: "251-majeur", label: "ii–V–I majeur", chords: [
        { degree: 2, quality: "min7", bars: 2 },
        { degree: 7, quality: "dom7", bars: 2 },
        { degree: 0, quality: "maj7", bars: 2 },
        { degree: 9, quality: "dom7", bars: 2 },
      ]},
      { id: "251-mineur", label: "ii–V–i mineur", scale: "harmonic_minor", chords: [
        { degree: 2, quality: "min7b5", bars: 2 },
        { degree: 7, quality: "dom7",   bars: 2 },
        { degree: 0, quality: "min7",   bars: 4 },
      ]},
      { id: "anatole", label: "I–VI–ii–V", chords: [
        { degree: 0, quality: "maj7", bars: 1 },
        { degree: 9, quality: "dom7", bars: 1 },
        { degree: 2, quality: "min7", bars: 1 },
        { degree: 7, quality: "dom7", bars: 1 },
      ]},
      { id: "blues-jazz", label: "Blues jazz", scale: "blues", chords: [
        { degree: 0, quality: "dom7", bars: 1 },
        { degree: 5, quality: "dom7", bars: 1 },
        { degree: 0, quality: "dom7", bars: 2 },
        { degree: 5, quality: "dom7", bars: 2 },
        { degree: 0, quality: "dom7", bars: 1 },
        { degree: 9, quality: "dom7", bars: 1 },
        { degree: 2, quality: "min7", bars: 1 },
        { degree: 7, quality: "dom7", bars: 1 },
        { degree: 0, quality: "dom7", bars: 1 },
        { degree: 7, quality: "dom7", bars: 1 },
      ]},
    ],
  },
  {
    id: "bossa",
    label: "Bossa nova",
    color: C.teal, colorL: C.tealL, colorD: C.tealD, colorB: C.tealBorder,
    scale: "major",
    gammes: ["major", "dorian"],
    tonalites: ["C", "F", "D", "G"],
    desc: "Binaire et syncopé : clave au cerclage, basse fondamentale-quinte, accords maj7 et 7(9). Joue doux, laisse respirer.",
    targetDesc: "7e majeure sur Imaj7, 9e sur le V7(9), notes longues",
    bpm: 132,
    grilles: [
      { id: "I-ii-V", label: "Imaj7–ii7–V7", chords: [
        { degree: 0, quality: "maj7", bars: 2 },
        { degree: 2, quality: "min7", bars: 1 },
        { degree: 7, quality: "dom9", bars: 1 },
      ]},
      { id: "relatif", label: "Vers le relatif mineur", chords: [
        { degree: 0,  quality: "maj7",   bars: 2 },
        { degree: 11, quality: "min7b5", bars: 1 },
        { degree: 4,  quality: "dom7",   bars: 1 },
        { degree: 9,  quality: "min7",   bars: 2 },
        { degree: 2,  quality: "min7",   bars: 1 },
        { degree: 7,  quality: "dom9",   bars: 1 },
      ]},
      { id: "vamp-dorien", label: "Vamp dorien", scale: "dorian", chords: [
        { degree: 0, quality: "min7", bars: 2 },
        { degree: 5, quality: "dom9", bars: 2 },
      ]},
    ],
  },
  {
    id: "ballade",
    label: "Ballade pop",
    color: C.blue, colorL: C.blueL, colorD: C.blueD, colorB: C.blueBorder,
    scale: "pentatonic_major",
    gammes: ["pentatonic_major", "major"],
    tonalites: ["C", "G", "D", "A"],
    desc: "Lent et posé : piano en arpèges, basse tenue. Chaque note compte — joue moins, fais-la chanter.",
    targetDesc: "Tierce et fondamentale de l'accord, notes tenues sur le 1",
    bpm: 72,
    grilles: [
      { id: "I-V-vi-IV", label: "I–V–vi–IV", chords: [
        { degree: 0, quality: "maj", bars: 1 },
        { degree: 7, quality: "maj", bars: 1 },
        { degree: 9, quality: "min", bars: 1 },
        { degree: 5, quality: "maj", bars: 1 },
      ]},
      { id: "vi-IV-I-V", label: "vi–IV–I–V", chords: [
        { degree: 9, quality: "min", bars: 1 },
        { degree: 5, quality: "maj", bars: 1 },
        { degree: 0, quality: "maj", bars: 1 },
        { degree: 7, quality: "maj", bars: 1 },
      ]},
      { id: "I-vi-IV-V", label: "I–vi–IV–V", chords: [
        { degree: 0, quality: "maj", bars: 1 },
        { degree: 9, quality: "min", bars: 1 },
        { degree: 5, quality: "maj", bars: 1 },
        { degree: 7, quality: "maj", bars: 1 },
      ]},
    ],
  },
].map(c => (c.grilles && !c.chords ? { ...c, chords: c.grilles[0].chords } : c));

/** Contexte effectif : grille et gamme choisies appliquées. */
export function appliquerChoix(ctx, grilleId, scaleKey) {
  const grille = ctx.grilles?.find(g => g.id === grilleId) || ctx.grilles?.[0] || null;
  return {
    ...ctx,
    grilleId: grille?.id ?? null,
    chords: grille?.chords ?? ctx.chords,
    scale: scaleKey || grille?.scale || ctx.scale,
  };
}

/** Libellé du « feel » rythmique d'un pack, pour l'interface. */
export function feelLabel(pack) {
  if (!pack) return null;
  const sub = pack.feel?.subdivision;
  if (sub && sub % 3 === 0) return "Shuffle (ternaire)";
  if ((pack.feel?.swing ?? 0) >= 0.5) return "Swing (croches ternaires)";
  if (sub === 16) return "Binaire, doubles-croches";
  return "Binaire";
}
