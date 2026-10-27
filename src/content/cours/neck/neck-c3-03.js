// Leçon du module « neck » + les questions de quiz qui s'y rattachent.
// Format « leçon en cartes » décrit dans src/content/README.md.

const QUATRE_FORMES = {
  type: "fretboard",
  caption: "4 patterns d'octaves — +2 cases (grave) vs +3 cases (aigu, cassure c3→c2)",
  data: {
    frets: 8, startFret: 4,
    showStringNames: true, showFretNumbers: true,
    markerFrets: [5, 7, 9],
    notes: [
      { string: 6, fret: 5,  label: "La",  color: "amber", root: true },
      { string: 4, fret: 7,  label: "La",  color: "amber", root: true },
      { string: 5, fret: 5,  label: "Ré",  color: "green", root: true },
      { string: 3, fret: 7,  label: "Ré",  color: "green", root: true },
      { string: 4, fret: 7,  label: "La",  color: "coral", root: false },
      { string: 2, fret: 10, label: "La",  color: "coral", root: false },
      { string: 3, fret: 7,  label: "Ré",  color: "primary",root: false },
      { string: 1, fret: 10, label: "Ré",  color: "primary",root: false },
    ],
  },
};

const TAB_LA = {
  type: "tab",
  caption: "Six La par sauts d'octave : 6 → 4 → 2, puis 5 → 3 → 1",
  text: "Tab — corde 6 case 5, corde 4 case 7, corde 2 case 10 ; puis corde 5 à vide, corde 3 case 2, corde 1 case 5. Six La.",
  data: { lines: [
    "e|-----------------5--|",
    "B|-------10-----------|",
    "G|--------------2-----|",
    "D|----7---------------|",
    "A|-----------0--------|",
    "E|-5------------------|",
  ] },
};

export default {
  id: "neck-c3-03", level: 5,
  title: "Patterns octaves 3 et 4 : l'asymétrie corde 2-3",
  duration: 7,
  gropiTip: "Le pattern 3 se cache dans Ré ouvert (xx0232) : corde 4 à vide = Ré, corde 2 case 3 = Ré, une octave pile à +3 cases. Et dans Sol (320003), corde 3 à vide et corde 1 case 3 font le pattern 4.",
  cartes: [
    { type: "idee", titre: "Dans l'aigu, trois cases", texte: [
      "Les deux dernières formes d'octave partent des cordes 4 et 3. Elles traversent la cassure entre les cordes 3 et 2 : il faut trois cases au lieu de deux.",
      "Forme 3 : corde 4 → corde 2, +3 cases. Mi (corde 4 case 2) → Mi (corde 2 case 5). Sol (corde 4 case 5) → Sol (corde 2 case 8).",
    ] },
    { type: "idee", titre: "D'où vient la case en plus", texte: [
      "Corde 4 → corde 3 : une quarte, 5 demi-tons. Corde 3 → corde 2 : seulement 4, une tierce majeure. Total : 9.",
      "Pour l'octave, il en faut 12 : il manque 3 demi-tons, donc 3 cases.",
    ] },
    { type: "question", quizId: "q-neck-36" },
    { type: "idee", titre: "Forme 4 : corde 3 → corde 1", texte: [
      "Même cassure, même règle : +3 cases.",
      "Sol à vide → Sol (corde 1 case 3). Do (corde 3 case 5) → Do (corde 1 case 8).",
    ] },
    { type: "idee", titre: "Les quatre formes", texte: [
      "+2 dans le grave : corde 6 → 4, corde 5 → 3.",
      "+3 dans l'aigu : corde 4 → 2, corde 3 → 1, parce que l'octave passe par-dessus la cassure Sol-Si.",
    ], bloc: QUATRE_FORMES },
    { type: "question", quizId: "q-neck-37" },
    { type: "idee", titre: "Une note, trois octaves", texte: [
      "Enchaîne les formes : Do (corde 5 case 3), puis Do (corde 3 case 5), puis Do (corde 1 case 8). Trois Do, chacun une octave au-dessus du précédent.",
      "Avec la corde 6 et ces quatre formes, tu retrouves une note dans toutes les zones du manche.",
    ] },
    { type: "a-toi", titre: "La chasse aux La",
      consigne: "Pars de La (corde 6 case 5) et saute d'octave en octave : corde 4, puis corde 2. Recommence depuis la corde 5 à vide : corde 3, puis corde 1. Nomme chaque La à voix haute, au clic. Puis refais-le avec Do.",
      bloc: TAB_LA, bpm: 60, minuteur: 120 },
    { type: "question", quizId: "q-neck-35" },
    { type: "recap", points: [
      "+2 cases dans le grave : corde 6 → 4, corde 5 → 3.",
      "+3 cases dans l'aigu : corde 4 → 2, corde 3 → 1.",
      "La cassure Sol-Si (4 demi-tons au lieu de 5) explique la case en plus.",
    ] },
  ],
  quiz: ["q-neck-35", "q-neck-36", "q-neck-37", "q-neck-06", "q-neck-09"],
};

export const quiz = [
  {id:"q-neck-35",courseId:"neck",lessonId:"neck-c3-03",lvl:1,q:"Ré, corde 4 à vide. Où est son octave sur la corde 2 ?",o:["Case 2","Case 3","Case 4","Case 5"],a:1,exp:"Pattern c4 → c2 : +3 cases (et non +2). Corde 2 case 3 = Ré.",xp:30},
  {id:"q-neck-36",courseId:"neck",lessonId:"neck-c3-03",lvl:2,q:"Pourquoi faut-il +3 cases, et non +2, de la corde 4 à la corde 2 ?",o:["La corde 2 est plus fine que la 4","Les cordes aiguës sont plus tendues","L'écart c3-c2 n'est que d'une tierce","Par convention d'écriture des tablatures"],a:2,exp:"Entre c3 et c2, l'accordage fait une tierce (4 demi-tons) au lieu d'une quarte (5) : il manque une case, qu'on compense en allant +3.",xp:40},
  {id:"q-neck-37",courseId:"neck",lessonId:"neck-c3-03",lvl:1,q:"Lequel de ces sauts d'octave demande +2 cases ?",o:["Corde 4 → corde 2","Corde 3 → corde 1","Aucun, c'est toujours +3","Corde 5 → corde 3"],a:3,exp:"+2 dans le grave (c6 → c4, c5 → c3), +3 dans l'aigu (c4 → c2, c3 → c1), à cause de la cassure entre c3 et c2.",xp:30},
];
