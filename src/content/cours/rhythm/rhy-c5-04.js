// Leçon du module « rhythm » + les questions de quiz qui s'y rattachent.
// Format « leçon en cartes » décrit dans src/content/README.md.

const AM7_BASSES = { type: "chord_diagram", caption: "Am7 avec ses deux basses à vide : La (corde 5) et Mi (corde 6)", data: { name: "Am7", frets: [0, 0, 2, 0, 1, 0], fingers: [0, 0, 2, 0, 1, 0], startFret: 1 } };

const DEMI_BOSSA = {
  type: "tab",
  caption: "Bossa simplifiée : le pouce sur les temps, les doigts sur les « et » — Am7 puis D7",
  text: "Tab — mesure 1, Am7 : pouce sur La (corde 5 à vide) aux temps 1 et 3, sur Mi (corde 6 à vide) aux temps 2 et 4 ; doigts sur les cordes 4, 3 et 2 (cases 2, 0, 1) à chaque « et ». Mesure 2, D7 : pouce sur Ré (corde 4 à vide) et La (corde 5 à vide), doigts sur les cordes 3, 2 et 1 (cases 2, 1, 2).",
  data: { lines: [
    "e|----------------|--2---2---2---2-|",
    "B|--1---1---1---1-|--1---1---1---1-|",
    "G|--0---0---0---0-|--2---2---2---2-|",
    "D|--2---2---2---2-|0-------0-------|",
    "A|0-------0-------|----0-------0---|",
    "E|----0-------0---|----------------|",
  ] },
};

const ANTICIPATION = {
  type: "tab",
  caption: "L'anticipation : D7 arrive sur le « et » du 4, avant la barre de mesure",
  text: "Tab — mesure 1 comme avant, sauf le dernier « et » : les doigts jouent déjà D7 (cordes 3, 2 et 1, cases 2, 1, 2). Mesure 2 : la basse Ré (corde 4 à vide) tombe sur le 1, sous un accord déjà là.",
  data: { lines: [
    "e|--------------2-|------2---2---2-|",
    "B|--1---1---1---1-|------1---1---1-|",
    "G|--0---0---0---2-|------2---2---2-|",
    "D|--2---2---2-----|0-------0-------|",
    "A|0-------0-------|----0-------0---|",
    "E|----0-------0---|----------------|",
  ] },
};

export default {
  id: "rhy-c5-04", level: 9,
  title: "Bossa nova : le pattern classique",
  duration: 9,
  gropiTip: "Écoute ton pouce : la basse doit tomber sur chaque temps comme une horloge, en alternant fondamentale et quinte. Sur Am7, c'est La (corde 5 à vide) puis Mi (corde 6 à vide).",
  cartes: [
    { type: "idee", titre: "Une guitare, une voix", texte: [
      "La bossa nova naît à Rio à la fin des années 1950 : le rythme de la samba, simplifié pour une seule guitare sous la voix, avec des accords venus du jazz.",
      "Un son épuré et intime, et une difficulté : la main droite.",
    ] },
    { type: "idee", titre: "Deux couches, une main", texte: [
      "Le pouce tient la basse sur les cordes graves, régulière, en alternant fondamentale et quinte.",
      "Index, majeur et annulaire pincent l'accord sur les cordes aiguës, entre les basses. Pas de médiator.",
    ], bloc: AM7_BASSES },
    { type: "question", quizId: "q-rhy-54" },
    { type: "idee", titre: "Des accords de septième", texte: [
      "La bossa joue rarement des triades simples : m7, maj7, 7, souvent avec une 9e. Peu de cordes, beaucoup de couleur.",
      "Pour commencer : Am7 et D7, deux accords que tu connais, avec des basses à vide.",
    ] },
    { type: "question", quizId: "q-rhy-39" },
    { type: "a-toi", titre: "Le pouce, puis les doigts",
      consigne: "Au clic : d'abord le pouce seul, une basse par temps, La et Mi sur Am7, Ré et La sur D7. Puis les doigts seuls, sur les « et ». Puis les deux ensemble, comme dans la tab. Lentement : l'indépendance vient en jouant, pas en forçant.",
      bloc: DEMI_BOSSA, bpm: 60, minuteur: 180 },
    { type: "idee", titre: "L'accord en avance", texte: [
      "Ce qui fait glisser la bossa : l'accord suivant arrive souvent sur le « et » du 4, un demi-temps avant la barre de mesure.",
      "Le pouce, lui, reste sur le temps : la basse du nouvel accord tombe sur le 1.",
    ], bloc: ANTICIPATION },
    { type: "question", quizId: "q-rhy-06" },
    { type: "a-toi", titre: "Am7, D7 en avance",
      consigne: "Boucle Am7 et D7 avec l'anticipation de la tab : D7 sur le dernier « et », et Am7 de même en revenant. Quand c'est fluide, monte de 60 à 70.",
      bloc: ANTICIPATION, bpm: 60, minuteur: 120 },
    { type: "recap", points: [
      "Aux doigts : le pouce sur les temps, les doigts sur les « et ».",
      "Des accords de septième, peu de cordes : Am7 et D7 pour commencer.",
      "L'accord suivant arrive sur le « et » du 4 ; la basse reste sur le 1.",
    ] },
  ],
  quiz: ["q-rhy-39","q-rhy-54","q-rhy-06","q-rhy-10"],
};

export const quiz = [
  {id:"q-rhy-39",courseId:"rhythm",lessonId:"rhy-c5-04",lvl:3,q:"Dans la bossa nova, que fait le pouce pendant que les doigts jouent le motif syncopé ?",o:["Il tient une pulsation régulière sur les cordes graves","Il double exactement le motif joué par les doigts","Il reste immobile pendant toute la mesure","Il étouffe les cordes entre chaque accord"],a:0,exp:"Le pouce maintient une base régulière, les doigts syncopent au-dessus : deux couches indépendantes jouées par une seule main. C'est ce qui rend la bossa difficile — et c'est l'exercice d'indépendance le plus payant qui soit.",xp:40},
  {id:"q-rhy-54",courseId:"rhythm",lessonId:"rhy-c5-04",lvl:1,q:"Comment joue-t-on habituellement la bossa nova à la guitare ?",o:["Aux doigts, sans médiator","Au médiator, en aller-retour","Au médiator, en coups bas","Au bottleneck, en slide"],a:0,exp:"La bossa se joue en fingerstyle : le pouce tient la basse, les doigts placent les accords syncopés. C'est ce qui permet à une seule main de jouer deux couches indépendantes.",xp:30},
];
