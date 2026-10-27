// Leçon du module « harmony » + les questions de quiz qui s'y rattachent.
// Format « leçon en cartes » décrit dans src/content/README.md.

export default {
  id: "harm-c6-01", level: 5,
  title: "I-IV-V : le blues et le rock",
  duration: 8,
  gropiTip: "Astuce de manche : I = barré avec la fondamentale sur la corde 6, IV = même case mais fondamentale sur la corde 5, V = deux cases plus loin sur la corde 5. En La : cases 5, 5 et 7.",
  cartes: [
    { type: "idee", titre: "Trois accords, toute une histoire", texte: [
      "I-IV-V : blues, rock'n'roll, country et folk reposent sur ces trois accords.",
      "I, le repos ; IV, le départ ; V, la tension qui ramène au I. En Mi : Mi, La, Si.",
    ] },
    { type: "question", quizId: "q-harm-35" },
    { type: "idee", titre: "En bref : l'accord 7", texte: [
      "Le blues joue des accords 7 : A7, D7, E7. Un accord 7, c'est un accord majeur plus une 7e mineure, 10 demi-tons au-dessus de la fondamentale : A7 = La, Do#, Mi + Sol.",
      "Cette note de plus le rend tendu : il « veut bouger ». Tu connais déjà leurs formes ouvertes.",
    ], bloc: {
      type: "chord_diagram",
      caption: "A7 — I7 du blues en La (0 0 2 0 2 0)",
      data: { name: "A7 (I)", frets: [0,0,2,0,2,0], fingers: [0,0,2,0,3,0], startFret: 1 },
    } },
    { type: "idee", titre: "Le blues 12 mesures", texte: [
      "Quatre mesures de I, deux de IV, deux de I, puis une de V, une de IV et deux de I.",
      "En La : A7 ×4, D7 ×2, A7 ×2, E7, D7, A7 ×2.",
    ], bloc: {
      type: "chord_diagram",
      caption: "D7 — IV7 du blues en La (× × 0 2 1 2)",
      data: { name: "D7 (IV)", frets: [-1,-1,0,2,1,2], fingers: [0,0,0,2,1,3], startFret: 1 },
    } },
    { type: "idee", titre: "Des 7 partout", texte: [
      "Dans une gamme majeure, seul le V porte naturellement un accord 7. Le blues en met sur I, IV et V.",
      "Cette licence fait toute sa couleur, rugueuse et tendue.",
    ], bloc: {
      type: "chord_diagram",
      caption: "E7 — V7 du blues en La (0 2 0 1 0 0)",
      data: { name: "E7 (V)", frets: [0,2,0,1,0,0], fingers: [0,2,0,1,0,0], startFret: 1 },
    } },
    { type: "question", quizId: "q-harm-37" },
    { type: "a-toi", titre: "Ta première grille",
      consigne: "Accompagne la grille en La : A7 ×4, D7 ×2, A7 ×2, E7, D7, A7 ×2. Quatre coups vers le bas par mesure, au clic, en comptant les mesures. Change d'accord sans t'arrêter : deux tours complets.",
      bloc: { type: "strum_pattern", caption: "4 noires vers le bas — une mesure par case de la grille", data: { pattern: ["B", "B", "B", "B"], beats: 4, style: "folk", bpm: 70 } },
      bpm: 70, minuteur: 120 },
    { type: "idee", titre: "Variantes et transposition", texte: [
      "Quick change : le IV dès la mesure 2, puis retour au I. Turnaround : la dernière mesure passe sur le V pour relancer la grille.",
      "Même grille en Mi : E7, A7, B7.",
    ] },
    { type: "question", quizId: "q-harm-36" },
    { type: "recap", points: [
      "I-IV-V : repos, départ, tension. En La : La, Ré, Mi.",
      "Accord 7 = majeur + 7e mineure (10 demi-tons) : A7 = La, Do#, Mi, Sol.",
      "Blues 12 mesures : I ×4, IV ×2, I ×2, V, IV, I ×2, en accords 7.",
    ] },
  ],
  quiz: ["q-harm-35", "q-harm-36", "q-harm-37"],
};

export const quiz = [
  {id:"q-harm-35",courseId:"harmony",lessonId:"harm-c6-01",lvl:1,q:"En La, quels sont les accords I, IV et V ?",o:["La - Ré - Mi","La - Do - Mi","La - Ré - Fa#","La - Sol - Ré"],a:0,exp:"Gamme de La majeur : La (I), Si, Do#, Ré (IV), Mi (V)… Donc La - Ré - Mi.",xp:30},
  {id:"q-harm-36",courseId:"harmony",lessonId:"harm-c6-01",lvl:1,q:"Dans un blues 12 mesures standard, combien de mesures de I au début ?",o:["2","4","1","8"],a:1,exp:"4 mesures de I, 2 de IV, 2 de I, 1 de V, 1 de IV, 2 de I.",xp:30},
  {id:"q-harm-37",courseId:"harmony",lessonId:"harm-c6-01",lvl:2,q:"Pourquoi I, IV et V sont-ils souvent des accords 7 dans un blues ?",o:["C'est la règle de la gamme majeure","Pour éviter les accords barrés","C'est une licence propre au blues","Parce que la basse joue la 7e"],a:2,exp:"Dans une gamme majeure, seul le V porte naturellement un accord 7 (en Do : G7, alors que le I serait Cmaj7). Jouer des accords 7 sur I, IV et V est une licence propre au blues, qui fait toute sa couleur.",xp:40},
];
