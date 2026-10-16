// Leçon du module « scales » + les questions de quiz qui s'y rattachent.
// Format « leçon en cartes » décrit dans src/content/README.md.

const BLUES_LA = {
  type: "scale_pattern",
  caption: "Gamme blues de La — penta mineure + note bleue Ré# (case 6 c5, case 8 c3)",
  data: {
    startFret: 4, endFret: 9,
    rootColor: "amber", noteColor: "primary", accentColor: "coral", accentLabel: "note bleue",
    strings: [
      { frets: [5, 8], root: [5] },
      { frets: [5, 6, 7], root: [], accent: [6] },
      { frets: [5, 7], root: [7] },
      { frets: [5, 7, 8], root: [], accent: [8] },
      { frets: [5, 8], root: [] },
      { frets: [5, 8], root: [5] },
    ],
    noteMap: {
      "5,0":"La","8,0":"Do",
      "5,1":"Ré","6,1":"Ré#","7,1":"Mi",
      "5,2":"Sol","7,2":"La",
      "5,3":"Do","7,3":"Ré","8,3":"Ré#",
      "5,4":"Mi","8,4":"Sol",
      "5,5":"La","8,5":"Do",
    },
  },
};

export default {
  id: "scales-c3-04", level: 6,
  title: "La gamme blues : l'ajout de la blue note",
  duration: 8,
  gropiTip: "Fais chanter la blue note au bend : sur la corde 3, tire le Ré (case 7) d'un demi-ton pour atteindre Ré#, ou d'un ton pour arriver sur Mi. Écoute bien la justesse.",
  cartes: [
    { type: "idee", titre: "Une note de plus", texte: [
      "Gamme blues = pentatonique mineure + ♭5 : 1 - ♭3 - 4 - ♭5 - 5 - ♭7. Six notes.",
      "En La : La, Do, Ré, Ré#, Mi, Sol. La nouvelle venue, Ré# (ou Mi♭), se glisse entre la quarte et la quinte.",
    ] },
    { type: "idee", titre: "Pourquoi « bleue »", texte: [
      "La ♭5 sonne très tendue face à la fondamentale, et elle frotte d'un demi-ton contre la quinte.",
      "Cette tension, proche d'une inflexion de voix, donne au blues sa couleur plaintive.",
    ] },
    { type: "question", quizId: "q-impro-19" },
    { type: "idee", titre: "Une note de passage", texte: [
      "La règle d'or : la blue note se traverse, elle ne se pose pas. Tenue longtemps, elle sonne fausse ; effleurée, elle sonne blues.",
      "Le geste typique : Ré (4), Ré# (♭5), Mi (5). La blue note sert de pont vers la quinte.",
    ] },
    { type: "idee", titre: "Sur le manche", texte: [
      "Reprends la position 1 de La, case 5, et ajoute Ré# (corde 5 case 6), entre le Ré et le Mi.",
      "Tu la retrouves aussi sur la corde 3 : Ré# (corde 3 case 8), juste après le Ré de la case 7.",
    ], bloc: BLUES_LA },
    { type: "question", quizId: "q-scales-p6-c34-01" },
    { type: "a-toi", titre: "Ton premier lick blues",
      consigne: "Corde 5 : Ré, Ré#, Mi en glissant d'un doigt à l'autre, sans t'arrêter sur la case 6. Puis Sol et La sur la corde 4, et laisse sonner le La. Lentement au clic, puis improvise autour pendant une minute.",
      bloc: {
        type: "tab",
        caption: "Lick blues en La : Ré, Ré#, Mi, puis Sol et La — la note bleue en passage",
        text: "Tab — corde 5 : cases 5, 6, 7 (Ré, Ré#, Mi) ; puis corde 4 : cases 5 et 7 (Sol, La).",
        data: { lines: [
          "e|-------------------|",
          "B|-------------------|",
          "G|-------------------|",
          "D|-------------5--7--|",
          "A|-5--6--7-----------|",
          "E|-------------------|",
        ] },
      }, bpm: 60, minuteur: 60 },
    { type: "question", quizId: "q-impro-01" },
    { type: "recap", points: [
      "Gamme blues = pentatonique mineure + ♭5 ; en La, La Do Ré Ré# Mi Sol.",
      "La blue note se traverse : Ré → Ré# → Mi, jamais tenue.",
      "En position 1 : Ré# en case 6 sur la corde 5, en case 8 sur la corde 3.",
    ] },
  ],
  quiz: ["q-scales-08","q-impro-01","q-fret-scales-03","q-impro-19","q-scales-p6-c34-01"],
};

export const quiz = [
  {id:"q-scales-08",courseId:"scales",lessonId:"scales-c3-04",lvl:3,q:"La 'gamme blues' ajoute quelle note à la pentatonique mineure ?",o:["La ♭5","La 2","La 6","La 7"],a:0,exp:"Gamme blues = penta mineure + ♭5 ('blue note'). En La : ajoute Ré# entre Ré (4) et Mi (5). 6 notes au total. La ♭5 crée la tension blues caractéristique.",xp:40},
  {id:"q-impro-01",courseId:"impro",lessonId:"scales-c3-04",lvl:1,q:"Sur un blues en La majeur, quelle gamme commencer ?",o:["La gamme majeure de La", "La pentatonique mineure", "Do majeur, la relative", "Mi pentatonique mineure"],a:1,exp:"La pentatonique mineure de La sonne juste sur tout blues en La (A7-D7-E7). Le ♭3 et la ♭7 de la penta s'accordent avec les dominantes.",xp:30},
  {id:"q-fret-scales-03",type:"fretboard",courseId:"scales",lessonId:"scales-c3-04",lvl:2,q:"Trouve toutes les notes de la gamme blues de La sur le manche",concept:{type:"find_scale",root:"A",quality:"blues"},selectionRules:{mode:"all"},display:{showNotes:false},hint:"Blues = pentatonique mineure + note bleue (♭5 = Ré#).",xp:55,exp:"Blues de La : La-Do-Ré-Ré#-Mi-Sol. La note bleue Ré# est la caracteristique."},
  {id:"q-impro-19",courseId:"impro",lessonId:"scales-c3-04",lvl:1,q:"La « blue note » ajoutée à la pentatonique mineure est…",o:["La seconde majeure","La sixte majeure","La quinte diminuée","La septième majeure"],a:2,exp:"La quinte diminuée, entre la quarte et la quinte. Elle ne se tient pas : c'est une note de passage, à traverser plutôt qu'à poser, et c'est cette tension fugace qui donne sa couleur au blues.",xp:30},
  {id:"q-scales-p6-c34-01",courseId:"scales",lessonId:"scales-c3-04",lvl:2,q:"Dans la position 1 de La, où se joue la blue note sur la corde 5 ?",o:["Case 6, entre Ré et Mi","Case 8, juste après le Mi","Case 4, juste avant le Ré","Case 7, à la place du Mi"],a:0,exp:"Sur la corde 5, Ré est en case 5 et Mi en case 7 : Ré#, la ♭5 de La, tombe entre les deux, en case 6.",xp:35},
];
