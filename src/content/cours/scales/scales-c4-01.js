// Leçon du module « scales » + les questions de quiz qui s'y rattachent.
// Format « leçon en cartes » décrit dans src/content/README.md.

export default {
  id: "scales-c4-01", level: 7,
  title: "Mineur naturel et majeur : deux faces d'une même pièce",
  duration: 7,
  gropiTip: "Pour comparer les deux formules : la mineure naturelle, c'est la majeure avec la 3, la 6 et la 7 abaissées d'un demi-ton. Do majeur devient Do mineur avec Mi♭, La♭ et Si♭.",
  cartes: [
    { type: "idee", titre: "Pas des contraires", texte: [
      "Avant les modes, une étape clé : majeur et mineur ne s'opposent pas.",
      "Ce sont deux façons d'écouter les mêmes notes. Tout dépend de la note sur laquelle ton oreille se repose.",
    ] },
    { type: "idee", titre: "La formule mineure", texte: [
      "Majeure : T-T-DT-T-T-T-DT. Mineure naturelle : T-DT-T-T-DT-T-T. Les demi-tons changent de place, et le caractère avec : plus sombre, plus introspectif.",
      "Depuis La : La, Si, Do, Ré, Mi, Fa, Sol. Aucune altération.",
    ], bloc: {
      type: "scale_pattern",
      caption: "La mineur naturel (= éolien) — position case 5. Mêmes notes que Do majeur",
      data: {
        startFret: 4, endFret: 8,
        rootColor: "primary", noteColor: "green", accentColor: "coral", accentLabel: "Fa, sixte mineure (couleur de l'éolien)",
        strings: [
          { frets: [5, 7, 8], root: [5] },
          { frets: [5, 7, 8], root: [], accent: [8] },
          { frets: [5, 7], root: [7] },
          { frets: [4, 5, 7], root: [] },
          { frets: [5, 6, 8], root: [], accent: [6] },
          { frets: [5, 7, 8], root: [5] },
        ],
        noteMap: {
          "5,0":"La","7,0":"Si","8,0":"Do",
          "5,1":"Ré","7,1":"Mi","8,1":"Fa",
          "5,2":"Sol","7,2":"La",
          "4,3":"Si","5,3":"Do","7,3":"Ré",
          "5,4":"Mi","6,4":"Fa","8,4":"Sol",
          "5,5":"La","7,5":"Si","8,5":"Do",
        },
      },
    } },
    { type: "question", quizId: "q-scales-34" },
    { type: "idee", titre: "Les tonalités relatives", texte: [
      "Do majeur et La mineur ont exactement les mêmes sept notes : La mineur est la relative de Do. Elle se trouve sur le 6e degré, un ton et demi sous la tonique.",
      "Autres paires : Sol / Mim, Ré / Sim, La / Fa#m, Fa / Rém.",
    ] },
    { type: "question", quizId: "q-logic-04" },
    { type: "idee", titre: "La note de repos décide", texte: [
      "Joue ces sept notes en commençant et en finissant tes phrases sur Do : tu entends du majeur, lumineux.",
      "Mêmes notes, mais tu reviens toujours sur La : ça devient mineur, mélancolique. L'oreille recentre la gamme sur la note qu'elle entend comme repos. C'est ce qui rend les modes possibles.",
    ] },
    { type: "a-toi", titre: "Deux phrases, deux ambiances",
      consigne: "Plaque un Lam ouvert, puis joue la première phrase : elle se pose sur La. Plaque un Do, puis la seconde : elle se pose sur Do. Au clic à 60, quatre fois chaque. Mêmes notes, écoute l'ambiance basculer.",
      bloc: {
        type: "tab",
        caption: "Phrase 1 qui se pose sur La (mineur), phrase 2 qui se pose sur Do (majeur) — position case 5",
        text: "Tab — phrase 1 : corde 2 case 5, corde 3 cases 7, 5 et 4, corde 4 case 7, tenue (Mi, Ré, Do, Si, La). Phrase 2 : corde 2 cases 8, 6 et 5, corde 3 cases 7 et 5, tenue (Sol, Fa, Mi, Ré, Do).",
        data: { lines: [
          "e|-------------------------------------|",
          "B|-5--------------------8--6--5--------|",
          "G|----7--5--4--------------------7--5--|",
          "D|-------------7-----------------------|",
          "A|-------------------------------------|",
          "E|-------------------------------------|",
        ] },
      }, bpm: 60, minuteur: 120 },
    { type: "question", quizId: "q-scales-35" },
    { type: "recap", points: [
      "Mineure naturelle : T-DT-T-T-DT-T-T ; La mineur = La Si Do Ré Mi Fa Sol.",
      "Chaque tonalité majeure a sa relative mineure, sur son 6e degré : mêmes notes.",
      "C'est la note de repos qui fait entendre majeur ou mineur.",
    ] },
  ],
  quiz: ["q-logic-04","q-scales-34","q-scales-35"],
};

export const quiz = [
  {id:"q-logic-04",courseId:"harmony",lessonId:"scales-c4-01",lvl:2,q:"Le 'relatif mineur' d'une tonalité majeure est sur quel degré ?",o:["3e","4e","7e","6e"],a:3,exp:"Relatif mineur = 6e degré. Do majeur → La mineur (6e degré = La). Mêmes notes, fondamentale différente, couleur opposée.",xp:45},
  {id:"q-scales-34",courseId:"scales",lessonId:"scales-c4-01",lvl:1,q:"Quelle est la formule de la gamme mineure naturelle ?",o:["T-T-DT-T-T-T-DT", "T-DT-T-T-T-T-DT", "DT-T-T-T-DT-T-T", "T-DT-T-T-DT-T-T"],a:3,exp:"Mineure naturelle : T-DT-T-T-DT-T-T. Depuis La : La-Si-Do-Ré-Mi-Fa-Sol, sans altération.",xp:30},
  {id:"q-scales-35",courseId:"scales",lessonId:"scales-c4-01",lvl:2,q:"Do majeur et La mineur naturel ont les mêmes notes. Qu'est-ce qui change l'ambiance ?",o:["La note sur laquelle on se pose", "Le nombre de notes jouées dans la gamme", "Le tempo du morceau", "L'accordage de la guitare"],a:0,exp:"Mêmes 7 notes, fondamentale différente : on entend du majeur en se posant sur Do, du mineur en se posant sur La.",xp:40},
];
