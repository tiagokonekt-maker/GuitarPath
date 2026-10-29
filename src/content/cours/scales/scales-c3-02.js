// Leçon du module « scales » + les questions de quiz qui s'y rattachent.
// Format « leçon en cartes » décrit dans src/content/README.md.
// Pentatonique, étape 1 sur 4 : la position 1 par cœur (doigtés, les trois
// La, la case du bend). Suite : scales-c3-05 (position 2), scales-c3-06
// (positions 3 à 5), scales-c3-07 (relier les 5 positions).

const POSITION_1 = {
  type: "scale_pattern",
  caption: "La pentatonique mineure — Position 1 (case 5) : les La en ambre",
  data: {
    startFret: 4, endFret: 9,
    rootColor: "amber", noteColor: "primary",
    strings: [
      { frets: [5, 8], root: [5] },
      { frets: [5, 7], root: [] },
      { frets: [5, 7], root: [7] },
      { frets: [5, 7], root: [] },
      { frets: [5, 8], root: [] },
      { frets: [5, 8], root: [5] },
    ],
    noteMap: {
      "5,0": "La", "8,0": "Do",
      "5,1": "Ré", "7,1": "Mi",
      "5,2": "Sol", "7,2": "La",
      "5,3": "Do", "7,3": "Ré",
      "5,4": "Mi", "8,4": "Sol",
      "5,5": "La", "8,5": "Do",
    },
  },
};

const TROIS_LA = {
  type: "fretboard",
  caption: "Les trois La de la position 1 : grave, médium, aigu",
  data: {
    frets: 5, startFret: 4,
    showStringNames: true, showFretNumbers: true,
    notes: [
      { string: 6, fret: 5, label: "La", color: "amber", root: true },
      { string: 4, fret: 7, label: "La", color: "amber", root: true },
      { string: 1, fret: 5, label: "La", color: "amber", root: true },
    ],
  },
};

const TAB_PAR_TROIS = {
  type: "tab",
  caption: "La position 1 par groupes de trois notes, en montant",
  text: "Tab — en croches, par groupes de trois notes qui repartent chaque fois de la deuxième note du groupe précédent : corde 6 cases 5 et 8, corde 5 case 5 ; puis corde 6 case 8, corde 5 cases 5 et 7 ; puis corde 5 cases 5 et 7, corde 4 case 5 ; et ainsi de suite jusqu'à la corde 3 case 7.",
  data: { lines: [
    "e|----------------|----------------|----------------|",
    "B|----------------|----------------|----------------|",
    "G|----------------|------------5---|5-7-------------|",
    "D|----------------|5---5-7-5-7---7-|----------------|",
    "A|----5---5-7-5-7-|--7-------------|----------------|",
    "E|5-8---8---------|----------------|----------------|",
  ] },
};

export default {
  id: "scales-c3-02", level: 6,
  title: "La pentatonique, position 1 : la connaître par cœur",
  duration: 8,
  gropiTip: "Joue la position 1 en ne nommant à voix haute que les La. Quand tu tombes sur les trois sans regarder, la forme est dans tes doigts.",
  cartes: [
    { type: "idee", titre: "Cinq positions, une à la fois", texte: [
      "La pentatonique de La se joue en cinq formes qui couvrent tout le manche. On les apprend une par une, en commençant par la position 1, case 5.",
      "Cette leçon la rend automatique ; les suivantes ajoutent les quatre autres, puis les relient.",
    ] },
    { type: "question", quizId: "q-impro-18" },
    { type: "idee", titre: "Un doigt par case", texte: [
      "Index sur toute la case 5. Annulaire pour la case 7, auriculaire pour la case 8.",
      "Le majeur se repose : il servira bientôt à soutenir les bends. La main reste fixe, sans glisser.",
    ], bloc: POSITION_1 },
    { type: "idee", titre: "Les trois La", texte: [
      "La grave : corde 6, case 5. La médium : corde 4, case 7. La aigu : corde 1, case 5.",
      "Ce sont tes points d'arrivée : une phrase qui finit sur un La sonne conclue.",
    ], bloc: TROIS_LA },
    { type: "question", quizId: "q-scales-pos1-01-app" },
    { type: "a-toi", titre: "Par groupes de trois",
      consigne: "Monte la position 1 par groupes de trois notes, comme la tab, au clic à 60. Puis redescends de la même façon. Ça rompt l'automatisme de la gamme récitée : tu dois voir la forme.",
      bloc: TAB_PAR_TROIS, bpm: 60, minuteur: 120 },
    { type: "idee", titre: "La case du bend", texte: [
      "Sur la corde 3, la case 7 donne Ré. Tirée d'un ton, elle monte jusqu'à Mi, une autre note de la gamme : c'est le bend le plus joué de la position.",
      "Tu le travailleras dans la leçon sur le bend juste.",
    ] },
    { type: "question", quizId: "q-neck-23-app" },
    { type: "question", quizId: "q-scales-pos1-02" },
    { type: "recap", points: [
      "Position 1 en La : cases 5 à 8, index en 5, annulaire en 7, auriculaire en 8.",
      "Trois La : corde 6 case 5, corde 4 case 7, corde 1 case 5.",
      "Corde 3 case 7 : le Ré qu'on tire d'un ton jusqu'au Mi.",
    ] },
  ],
  quiz: ["q-impro-18", "q-neck-23", "q-scales-pos1-01", "q-scales-pos1-02", "q-scales-pos1-01-app", "q-neck-23-app"],
};

export const quiz = [
  {id:"q-impro-18",courseId:"impro",lessonId:"scales-c3-02",lvl:1,q:"Pourquoi la pentatonique est-elle plus facile à improviser que la gamme majeure ?",o:["Elle se joue à une vitesse plus élevée","Elle retire les deux notes les plus instables","Elle ne possède qu'une seule position","Elle n'a pas de tonique définie"],a:1,exp:"Cinq notes au lieu de sept : on a retiré la quarte et la septième, celles qui demandent une résolution. Moins de notes à surveiller, donc plus d'attention disponible pour le placement rythmique.",xp:25},
  {id:"q-neck-23",courseId:"scales",lessonId:"scales-c3-02",lvl:3,q:"Dans la position 1 de La pentatonique mineure, le bend le plus naturel se joue sur la corde 3, à quelle case ?",o:["Case 5","Case 7","Case 9","Case 3"],a:1,exp:"Ré (corde 3 case 7), tiré d'un ton jusqu'au Mi : les deux notes sont dans la gamme, le bend sonne juste.",xp:45},
  {id:"q-neck-23-app",courseId:"scales",lessonId:"scales-c3-02",lvl:2,q:"Position 1 de La pentatonique mineure : tu tires d'un ton le Sol de la corde 2, case 8. Quelle note atteins-tu ?",o:["La","Sol#","Si","La#"],a:0,exp:"Un ton = deux cases : Sol (corde 2 case 8) monte à la hauteur de La (corde 2 case 10), une note de la gamme. Le bend sonne juste.",xp:30},
  {id:"q-scales-pos1-01",courseId:"scales",lessonId:"scales-c3-02",lvl:1,q:"Position 1 de La pentatonique mineure : où se trouve le La médium, entre le grave et l'aigu ?",o:["Corde 4, case 7","Corde 5, case 7","Corde 3, case 5","Corde 2, case 8"],a:0,exp:"La (corde 4 case 7). Corde 5 case 7 donne Mi, corde 3 case 5 donne Do, corde 2 case 8 donne Sol.",xp:25},
  {id:"q-scales-pos1-01-app",courseId:"scales",lessonId:"scales-c3-02",lvl:1,q:"La position 1 de Sol pentatonique mineure, c'est celle de La, deux cases plus bas. Où se trouve son Sol médium ?",o:["Corde 4, case 5","Corde 4, case 7","Corde 5, case 5","Corde 3, case 5"],a:0,exp:"Toute la forme descend de deux cases : le La médium, corde 4 case 7, devient Sol (corde 4 case 5).",xp:25},
  {id:"q-scales-pos1-02",courseId:"scales",lessonId:"scales-c3-02",lvl:2,q:"Dans la position 1, quel doigt joue les notes de la case 8 ?",o:["L'auriculaire","L'annulaire","Le majeur","L'index"],a:0,exp:"Un doigt par case : index en 5, (majeur en 6, inutilisé ici), annulaire en 7, auriculaire en 8. La main ne bouge pas.",xp:30},
];
