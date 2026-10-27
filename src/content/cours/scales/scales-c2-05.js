// Leçon du module « scales » + les questions de quiz qui s'y rattachent.
// Format « leçon en cartes » décrit dans src/content/README.md.

const SOL_POSITION_1 = {
  type: "scale_pattern",
  caption: "Sol majeur — Position 1 (fondamentale case 3, corde 6)",
  data: {
    startFret: 1, endFret: 5,
    rootColor: "green", noteColor: "primary",
    strings: [
      { frets: [3, 5],    root: [3] },
      { frets: [2, 3, 5], root: [] },
      { frets: [2, 4, 5], root: [] },
      { frets: [2, 4],    root: [] },
      { frets: [1, 3, 5], root: [] },
      { frets: [2, 3],    root: [3] },
    ],
    noteMap: {
      "3,0": "Sol","5,0": "La",
      "2,1": "Si", "3,1": "Do","5,1": "Ré",
      "2,2": "Mi", "4,2": "Fa#","5,2": "Sol",
      "2,3": "La", "4,3": "Si",
      "1,4": "Do", "3,4": "Ré","5,4": "Mi",
      "2,5": "Fa#","3,5": "Sol",
    },
  },
};

const DO_POSITION_2 = {
  type: "scale_pattern",
  caption: "Do majeur — Position 2 (fondamentale case 3, corde 5)",
  data: {
    startFret: 0, endFret: 5,
    rootColor: "primary", noteColor: "green",
    strings: [
      { frets: [], root: [] },
      { frets: [3, 5], root: [3] },
      { frets: [2, 3, 5], root: [] },
      { frets: [2, 4], root: [] },
      { frets: [1, 3, 5], root: [1] },
      { frets: [1, 3], root: [] },
    ],
    noteMap: {
      "3,1":"Do","5,1":"Ré",
      "2,2":"Mi","3,2":"Fa","5,2":"Sol",
      "2,3":"La","4,3":"Si",
      "1,4":"Do","3,4":"Ré","5,4":"Mi",
      "1,5":"Fa","3,5":"Sol",
    }
  },
};

export default {
  id: "scales-c2-05", level: 5,
  title: "Jouer la gamme majeure sur le manche",
  duration: 9,
  gropiTip: "Piège fréquent : jouer Fa au lieu de Fa# en Sol majeur. Dans la position 1, le Fa# est case 4 corde 4 et case 2 corde 1 : vise-les exprès en montant et en descendant.",
  cartes: [
    { type: "idee", titre: "Position 1 : fondamentale sur la corde 6", texte: [
      "La théorie passe dans les doigts. Pour Sol majeur, pars de Sol (corde 6 case 3).",
      "La forme tient entre les cases 1 et 5 : index en 2, majeur en 3, annulaire en 4, auriculaire en 5. L'index recule d'une case pour le Do de la corde 2.",
    ], bloc: SOL_POSITION_1 },
    { type: "question", quizId: "q-scales-33" },
    { type: "idee", titre: "Trois mots d'ordre", texte: [
      "Lentement : 60 au clic, chaque note claire. À voix haute : nomme les notes en jouant, ça relie les doigts à la tête.",
      "Et repère les Sol : ce sont tes points d'appui dans la position.",
    ] },
    { type: "a-toi", titre: "Sol majeur, position 1",
      consigne: "Monte et redescends la position au clic, une note par temps, en nommant chaque note. À chaque Sol, tiens la note deux temps. Trois allers-retours sans t'arrêter.",
      bloc: SOL_POSITION_1, bpm: 60, minuteur: 180 },
    { type: "idee", titre: "Une forme qui se déplace", texte: [
      "Glisse la forme entière le long du manche : la fondamentale change, la gamme suit.",
      "Fondamentale en case 5 de la corde 6 : La majeur. En case 7 : Si majeur. Même doigté, autre tonalité.",
    ] },
    { type: "question", quizId: "q-scales-p5-c205-01" },
    { type: "idee", titre: "Position 2 : fondamentale sur la corde 5", texte: [
      "Même principe, une corde plus haut. Pour Do majeur, pars de Do (corde 5 case 3) : la position couvre les cases 1 à 5, dans le médium.",
    ], bloc: DO_POSITION_2 },
    { type: "idee", titre: "Une à la fois", texte: [
      "Douze cases plus haut, Sol revient : Sol (corde 6 case 15). La position 1 s'y rejoue telle quelle, dans l'aigu.",
      "Maîtrise une position à fond avant d'en ajouter une autre ; les relier viendra ensuite.",
    ] },
    { type: "question", quizId: "q-scales-32" },
    { type: "recap", points: [
      "Position 1 : fondamentale sur la corde 6, un doigt par case.",
      "Position 2 : fondamentale sur la corde 5, même principe.",
      "Glisser la forme change la tonalité : case 5 sur la corde 6, La majeur.",
    ] },
  ],
  quiz: ["q-fret-scales-01","q-scales-32","q-scales-33","q-scales-p5-c205-01"],
};

export const quiz = [
  {id:"q-fret-scales-01",type:"fretboard",courseId:"scales",lessonId:"scales-c2-05",lvl:1,q:"Sélectionne les notes de Do majeur sur les cases 0-3",concept:{type:"find_scale",root:"C",quality:"major"},selectionRules:{mode:"all"},fretRange:[0,3],display:{showNotes:false},hint:"Do majeur = Do Ré Mi Fa Sol La Si.",xp:45,exp:"Do majeur en position ouverte : 7 notes naturelles cases 0-3."},
  {id:"q-scales-32",courseId:"scales",lessonId:"scales-c2-05",lvl:1,q:"Dans la position 1 de Sol majeur, où se trouve la fondamentale ?",o:["Corde 5, case 3", "Corde 6, case 3", "Corde 4, case 5", "Corde 6, case 5"],a:1,exp:"Position 1 = fondamentale sur la corde 6. Sol est à la case 3 de la corde 6.",xp:30},
  {id:"q-scales-33",courseId:"scales",lessonId:"scales-c2-05",lvl:1,q:"Dans la position 1 de Sol majeur, où se trouve le Sol situé une octave au-dessus de la fondamentale ?",o:["Corde 4, case 5","Corde 5, case 5","Corde 3, case 5","Corde 4, case 3"],a:0,exp:"Motif d'octave corde 6 → corde 4 : deux cordes plus loin, deux cases plus haut. Sol (corde 6 case 3) → Sol (corde 4 case 5). Repérer les fondamentales donne les points d'appui de la position.",xp:30},
  {id:"q-scales-p5-c205-01",courseId:"scales",lessonId:"scales-c2-05",lvl:2,q:"Tu glisses la position 1 pour poser la fondamentale en case 8 de la corde 6. Quelle gamme joues-tu ?",o:["Do majeur","Si majeur","Ré majeur","La majeur"],a:0,exp:"Corde 6 case 8 = Do. Même forme, nouvelle fondamentale : Do majeur. Si majeur serait en case 7, La majeur en case 5.",xp:35},
];
