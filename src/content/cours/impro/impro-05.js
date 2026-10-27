// Leçon du module « impro » + les questions de quiz qui s'y rattachent.
// Format « leçon en cartes » décrit dans src/content/README.md.
// Construire un solo, 1 sur 2 : le motif et les trois actes.
// Suite : impro-05b (le sommet, le registre, la conclusion).

const MOTIF = {
  type: "tab",
  caption: "Un motif de trois notes, puis deux variantes : déplacé d'un cran, puis étiré",
  text: "Tab — mesure 1 : Do (corde 3 case 5), Ré (corde 3 case 7), Mi (corde 2 case 5). Mesure 2, déplacé : Ré, Mi, Sol (corde 2 case 8). Mesure 3, étiré : Do tenu, puis Ré et Mi. Mesure 4 : La (corde 4 case 7), tenu.",
  data: { lines: [
    "e|----------------|----------------|----------------|----------------|",
    "B|----5-----------|--5-8-----------|------------5---|----------------|",
    "G|5-7-------------|7---------------|5-------7-------|----------------|",
    "D|----------------|----------------|----------------|7---------------|",
    "A|----------------|----------------|----------------|----------------|",
    "E|----------------|----------------|----------------|----------------|",
  ] },
};

export default {
  id: "impro-05", level: 9,
  title: "Construire un solo : motif et trois actes",
  duration: 8,
  gropiTip: "Prends les trois premières notes que tu joues, même par hasard, et répète-les en changeant une seule chose à la fois. Un accident répété devient une intention.",
  cartes: [
    { type: "idee", titre: "Une histoire, pas une liste", texte: [
      "Un solo n'est pas une suite de licks bout à bout. Il a un début, un développement et une fin, comme un récit.",
    ] },
    { type: "idee", titre: "Le motif", texte: [
      "Une cellule de trois à six notes, posée puis transformée : déplacée, étirée, rythme changé.",
      "L'oreille la reconnaît et suit son évolution. C'est le fil qui relie tes phrases.",
    ] },
    { type: "question", quizId: "q-rhy-12" },
    { type: "idee", titre: "Trois actes", texte: [
      "Acte 1, environ un quart du solo : peu de notes, longues, registre médium.",
      "Acte 2, la moitié : densité, registre et intensité montent. Acte 3 : le sommet, puis la descente vers la tonique.",
    ] },
    { type: "question", quizId: "q-impro-acte1-lot4" },
    { type: "a-toi", titre: "Un motif qui évolue",
      consigne: "Fais tourner un Lam (en boucle, ou la Jam en Blues mineur, tonalité La). Joue le motif, puis ses deux variantes, et finis sur La. Ensuite, deux minutes : invente un motif de trois notes et fais-le évoluer en ne changeant qu'un élément à la fois.",
      bloc: MOTIF, bpm: 70, minuteur: 180 },
    { type: "idee", titre: "Monter la courbe", texte: [
      "Registre, densité, tension : fais-les monter ensemble, peu à peu.",
      "Commencer au maximum ne laisse nulle part où aller, et l'oreille s'habitue en quelques secondes.",
    ] },
    { type: "question", quizId: "q-impro-29" },
    { type: "recap", points: [
      "Un solo raconte : un début, un développement, une fin.",
      "Un motif court, répété et transformé, relie les phrases.",
      "Acte 1 calme et médium ; l'intensité monte peu à peu.",
    ] },
  ],
  quiz: ["q-rhy-12","q-impro-acte1-lot4","q-impro-29"],
};

export const quiz = [
  {id:"q-rhy-12",courseId:"rhythm",lessonId:"impro-05",lvl:3,q:"Un 'motif' musical est…",o:["Une phrase courte, répétée et transformée", "Un thème complet de plusieurs mesures", "Un solo entier, du début à la fin", "Un riff de 16 mesures qui tourne en boucle"],a:0,exp:"Motif = cellule mélodique courte (3-6 notes), répétée et développée. Outils : transposition, augmentation, inversion, séquence. Base de la composition.",xp:50},
  {id:"q-impro-29",courseId:"impro",lessonId:"impro-05",lvl:3,q:"Comment construire l'intensité d'un solo dans la durée ?",o:["En faisant monter registre, densité et tension", "En répétant la même phrase du début à la fin", "En jouant fort et vite dès la première note", "En alternant au hasard les nuances et les tempos"],a:0,exp:"Un solo est une courbe, pas un plateau. Commencer bas et clairsemé laisse de la place pour monter — commencer au maximum ne laisse nulle part où aller, et l'oreille s'habitue en quelques secondes.",xp:40},
  {id:"q-impro-acte1-lot4",courseId:"impro",lessonId:"impro-05",lvl:2,q:"Les quatre premières mesures de ton solo : quel jeu choisir ?",o:["Peu de notes, longues, en médium","Un trait rapide dans l'aigu","Ton lick le plus spectaculaire","Un bend sur chaque note"],a:0,exp:"Le premier acte pose le décor : peu de notes, longues, dans le médium. Le trait rapide, l'aigu et le lick spectaculaire servent plus tard, quand l'intensité doit monter.",xp:30},
];
