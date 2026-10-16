// Leçon du module « scales » + les questions de quiz qui s'y rattachent.
// Format « leçon en cartes » décrit dans src/content/README.md.
// Pentatonique, étape 2 sur 4 : la position 2 (cases 7 à 10) et le passage
// depuis la position 1 (scales-c3-02). Suite : scales-c3-06.

const POSITION_2 = {
  type: "scale_pattern",
  caption: "La pentatonique mineure — Position 2 (case 8) : les La en ambre",
  data: {
    startFret: 6, endFret: 11,
    rootColor: "amber", noteColor: "primary",
    strings: [
      { frets: [8, 10], root: [] },
      { frets: [7, 10], root: [] },
      { frets: [7, 10], root: [7] },
      { frets: [7, 9], root: [] },
      { frets: [8, 10], root: [10] },
      { frets: [8, 10], root: [] },
    ],
    noteMap: {
      "8,0": "Do", "10,0": "Ré",
      "7,1": "Mi", "10,1": "Sol",
      "7,2": "La", "10,2": "Do",
      "7,3": "Ré", "9,3": "Mi",
      "8,4": "Sol", "10,4": "La",
      "8,5": "Do", "10,5": "Ré",
    },
  },
};

const TAB_POSITION_2 = {
  type: "tab",
  caption: "La position 2 en montant, deux notes par corde",
  text: "Tab — en croches : corde 6 cases 8 et 10, corde 5 cases 7 et 10, corde 4 cases 7 et 10, corde 3 cases 7 et 9, corde 2 cases 8 et 10, corde 1 cases 8 et 10.",
  data: { lines: [
    "e|----------------|------8-10------|",
    "B|----------------|--8-10----------|",
    "G|------------7-9-|----------------|",
    "D|--------7-10----|----------------|",
    "A|----7-10--------|----------------|",
    "E|8-10------------|----------------|",
  ] },
};

const TAB_RACCORD = {
  type: "tab",
  caption: "Le raccord : la position 1 sur les cordes graves, la position 2 sur les aiguës",
  text: "Tab — en croches : corde 6 cases 5 et 8, corde 5 cases 5 et 7, corde 4 cases 5 et 7 (position 1) ; puis corde 4 case 10, corde 3 cases 7 et 9, corde 2 cases 8 et 10, corde 1 cases 8 et 10 (position 2).",
  data: { lines: [
    "e|----------------|------8-10------|",
    "B|----------------|--8-10----------|",
    "G|--------------7-|9---------------|",
    "D|--------5-7-10--|----------------|",
    "A|----5-7---------|----------------|",
    "E|5-8-------------|----------------|",
  ] },
};

export default {
  id: "scales-c3-05", level: 6,
  title: "Pentatonique, position 2 et le raccord 1→2",
  duration: 8,
  gropiTip: "Le passage se fait sur la corde 4 : le La de la case 7, joué à l'annulaire en position 1, se rejoue à l'index. Ce simple changement de doigt t'a déplacé d'une position.",
  cartes: [
    { type: "idee", titre: "Elle part du Do", texte: [
      "La position 2 commence là où la position 1 s'arrête : sur le Do de la corde 6, case 8, la ♭3 de La.",
      "Mêmes cinq notes, La Do Ré Mi Sol, rangées autrement entre les cases 7 et 10.",
    ], bloc: POSITION_2 },
    { type: "question", quizId: "q-scales-63" },
    { type: "idee", titre: "Les doigts", texte: [
      "Index sur la case 7 (cordes 5, 4 et 3), majeur sur la case 8 (cordes 6, 2 et 1), annulaire sur la 9, auriculaire sur la 10.",
      "Les La sont sur la corde 4 case 7 et sur la corde 2 case 10.",
    ] },
    { type: "question", quizId: "q-scales-pos2-01" },
    { type: "a-toi", titre: "La position 2 seule",
      consigne: "Monte la position 2 au clic à 60, une note par croche, puis redescends. Pars et termine sur le La de la corde 4, case 7.",
      bloc: TAB_POSITION_2, bpm: 60, minuteur: 90 },
    { type: "idee", titre: "Des notes en commun", texte: [
      "Le haut de la position 1 (cases 7 et 8) est exactement le bas de la position 2 : Do, Mi, La, Ré, Sol, Do.",
      "Pour passer de l'une à l'autre, il suffit de changer de doigt sur une note commune, puis de continuer dans la nouvelle forme.",
    ] },
    { type: "question", quizId: "q-scales-64" },
    { type: "a-toi", titre: "Le raccord 1→2",
      consigne: "Cordes 6 à 4 en position 1 ; sur le La de la corde 4, case 7, change de doigt et finis en position 2. Puis redescends par le même chemin. Au clic à 60, puis à 70.",
      bloc: TAB_RACCORD, bpm: 60, minuteur: 120 },
    { type: "recap", points: [
      "Position 2 en La : cases 7 à 10, elle démarre sur le Do de la corde 6, case 8.",
      "Ses La : corde 4 case 7 et corde 2 case 10.",
      "Le raccord : les cases 7 et 8 sont communes aux deux positions ; on change de doigt et on continue.",
    ] },
  ],
  quiz: ["q-scales-63", "q-scales-64", "q-scales-pos2-01"],
};

export const quiz = [
  {id:"q-scales-63",courseId:"scales",lessonId:"scales-c3-05",lvl:1,q:"En La pentatonique mineure, sur quelle note démarre la position 2 ?",o:["Do","Ré","Mi","Sol"],a:0,exp:"Chaque position démarre sur une note de la gamme : position 1 sur La, position 2 sur Do (la ♭3, case 8 de la corde 6), puis Ré, Mi et Sol.",xp:30},
  {id:"q-scales-64",courseId:"scales",lessonId:"scales-c3-05",lvl:2,q:"Quelle case sert de passage entre les positions 1 et 2 de La pentatonique mineure ?",o:["Case 8","Case 5","Case 10","Case 12"],a:0,exp:"La position 1 s'étend des cases 5 à 8, la position 2 des cases 7 à 10 : leurs notes des cases 7 et 8 sont communes, dont le Do de la corde 6, case 8. Changer de doigt sur ce pivot relie les deux formes.",xp:40},
  {id:"q-scales-pos2-01",courseId:"scales",lessonId:"scales-c3-05",lvl:2,q:"Position 2 de La pentatonique mineure : sur quelles cases trouves-tu ses La ?",o:["Corde 4 case 7, corde 2 case 10","Corde 6 case 8, corde 1 case 8","Corde 5 case 7, corde 3 case 9","Corde 5 case 10, corde 2 case 8"],a:0,exp:"Corde 4 case 7 et corde 2 case 10 donnent La. Les cases 8 des cordes 6 et 1 sont des Do, la corde 5 case 7 un Mi, la corde 2 case 8 un Sol.",xp:30},
];
