// Leçon du module « scales » + les questions de quiz qui s'y rattachent.
// Format « leçon en cartes » décrit dans src/content/README.md.
// Pentatonique, étape 3 sur 4 : les positions 3 (case 10), 4 (case 12) et
// 5 (case 15, ou case 3 une octave plus bas). Suite : scales-c3-07.

const POSITION_3 = {
  type: "scale_pattern",
  caption: "La pentatonique mineure — Position 3 (case 10) : les La en ambre",
  data: {
    startFret: 8, endFret: 13,
    rootColor: "amber", noteColor: "primary",
    strings: [
      { frets: [10, 12], root: [] },
      { frets: [10, 12], root: [12] },
      { frets: [10, 12], root: [] },
      { frets: [9, 12], root: [] },
      { frets: [10, 13], root: [10] },
      { frets: [10, 12], root: [] },
    ],
    noteMap: {
      "10,0": "Ré", "12,0": "Mi",
      "10,1": "Sol", "12,1": "La",
      "10,2": "Do", "12,2": "Ré",
      "9,3": "Mi", "12,3": "Sol",
      "10,4": "La", "13,4": "Do",
      "10,5": "Ré", "12,5": "Mi",
    },
  },
};

const POSITION_4 = {
  type: "scale_pattern",
  caption: "La pentatonique mineure — Position 4 (case 12) : les La en ambre",
  data: {
    startFret: 11, endFret: 16,
    rootColor: "amber", noteColor: "primary",
    strings: [
      { frets: [12, 15], root: [] },
      { frets: [12, 15], root: [12] },
      { frets: [12, 14], root: [] },
      { frets: [12, 14], root: [14] },
      { frets: [13, 15], root: [] },
      { frets: [12, 15], root: [] },
    ],
    noteMap: {
      "12,0": "Mi", "15,0": "Sol",
      "12,1": "La", "15,1": "Do",
      "12,2": "Ré", "14,2": "Mi",
      "12,3": "Sol", "14,3": "La",
      "13,4": "Do", "15,4": "Ré",
      "12,5": "Mi", "15,5": "Sol",
    },
  },
};

const POSITION_5 = {
  type: "scale_pattern",
  caption: "La pentatonique mineure — Position 5 (case 15) : les La en ambre",
  data: {
    startFret: 13, endFret: 18,
    rootColor: "amber", noteColor: "primary",
    strings: [
      { frets: [15, 17], root: [17] },
      { frets: [15, 17], root: [] },
      { frets: [14, 17], root: [] },
      { frets: [14, 17], root: [14] },
      { frets: [15, 17], root: [] },
      { frets: [15, 17], root: [17] },
    ],
    noteMap: {
      "15,0": "Sol", "17,0": "La",
      "15,1": "Do", "17,1": "Ré",
      "14,2": "Mi", "17,2": "Sol",
      "14,3": "La", "17,3": "Do",
      "15,4": "Ré", "17,4": "Mi",
      "15,5": "Sol", "17,5": "La",
    },
  },
};

const TAB_POSITION_3 = {
  type: "tab",
  caption: "La position 3 en montant, une note par temps",
  text: "Tab — une note par temps : corde 6 cases 10 et 12, corde 5 cases 10 et 12, corde 4 cases 10 et 12, corde 3 cases 9 et 12, corde 2 cases 10 et 13, corde 1 cases 10 et 12.",
  data: { lines: [
    "e|----------------|----------------|--------10--12--|",
    "B|----------------|----------------|10--13----------|",
    "G|----------------|--------9---12--|----------------|",
    "D|----------------|10--12----------|----------------|",
    "A|--------10--12--|----------------|----------------|",
    "E|10--12----------|----------------|----------------|",
  ] },
};

export default {
  id: "scales-c3-06", level: 6,
  title: "Pentatonique, positions 3, 4 et 5",
  duration: 9,
  gropiTip: "Chaque position garde une corde « à trois cases d'écart » qui la trahit : corde 2 en position 3 (cases 10 et 13), corde 6 en position 4 (12 et 15). Repère-la et la forme se reconstruit autour.",
  cartes: [
    { type: "idee", titre: "Trois formes de plus", texte: [
      "Chaque position part de la note suivante de la gamme, sur la corde 6 : Ré case 10 (position 3), Mi case 12 (position 4), Sol case 15 (position 5).",
      "Le haut de chaque forme est le bas de la suivante, comme entre les positions 1 et 2.",
    ] },
    { type: "idee", titre: "Position 3, case 10", texte: [
      "De la case 9 à la case 13. La corde 3 descend d'une case (9 et 12), la corde 2 monte d'une case (10 et 13) : c'est le petit décalage de cette forme.",
      "Ses La : corde 5 case 12, corde 2 case 10.",
    ], bloc: POSITION_3 },
    { type: "question", quizId: "q-scales-pos345-01" },
    { type: "idee", titre: "Position 4, case 12", texte: [
      "De la case 12 à la case 15. Index sur la case 12, presque partout ; la corde 2 commence en case 13.",
      "Ses La : corde 5 case 12 et corde 3 case 14. La case 12, c'est aussi l'octave des cordes à vide.",
    ], bloc: POSITION_4 },
    { type: "question", quizId: "q-scales-pos345-02" },
    { type: "idee", titre: "Position 5, case 15… ou case 3", texte: [
      "De la case 14 à la case 17, elle part du Sol de la corde 6. Ses La : cordes 6 et 1 case 17, corde 3 case 14.",
      "Douze cases plus bas, la même forme se joue entre les cases 2 et 5 : c'est le « sous-sol » du manche, juste sous la position 1.",
    ], bloc: POSITION_5 },
    { type: "question", quizId: "q-scales-pos345-03" },
    { type: "a-toi", titre: "Une minute par position",
      consigne: "Une minute sur la position 3 (la tab), une sur la position 4, une sur la position 5 : monte et descends au clic à 60, en t'arrêtant sur chaque La.",
      bloc: TAB_POSITION_3, bpm: 60, minuteur: 180 },
    { type: "recap", points: [
      "Position 3 : case 10 (Ré) ; position 4 : case 12 (Mi) ; position 5 : case 15 (Sol).",
      "Le haut d'une position est toujours le bas de la suivante.",
      "La position 5 existe aussi douze cases plus bas, entre les cases 2 et 5.",
    ] },
  ],
  quiz: ["q-scales-pos345-01", "q-scales-pos345-02", "q-scales-pos345-03"],
};

export const quiz = [
  {id:"q-scales-pos345-01",courseId:"scales",lessonId:"scales-c3-06",lvl:2,q:"En La pentatonique mineure, quelle note de la corde 6 sert de départ à la position 3 ?",o:["Ré, case 10","Do, case 8","Mi, case 12","Sol, case 15"],a:0,exp:"Les positions suivent les notes de la gamme sur la corde 6 : La (5), Do (8), Ré (10), Mi (12), Sol (15). La position 3 part donc du Ré, case 10.",xp:30},
  {id:"q-scales-pos345-02",courseId:"scales",lessonId:"scales-c3-06",lvl:2,q:"Tu joues la position 4 de La pentatonique mineure. Où poses-tu l'index, sur presque toutes les cordes ?",o:["Case 12","Case 10","Case 14","Case 15"],a:0,exp:"La position 4 s'étend de la case 12 à la case 15 : index en 12, sauf sur la corde 2 qui commence en 13.",xp:30},
  {id:"q-scales-pos345-03",courseId:"scales",lessonId:"scales-c3-06",lvl:3,q:"Pourquoi la position 5 se joue-t-elle aussi bien entre les cases 2 et 5 qu'entre les cases 14 et 17 ?",o:["Douze cases font une octave","Les cordes graves sont plus tendues","Les deux formes n'ont pas les mêmes notes","La case 12 inverse les cordes"],a:0,exp:"Douze cases plus haut, chaque note revient à l'octave : la même forme donne les mêmes notes, une octave plus aiguë.",xp:40},
];
