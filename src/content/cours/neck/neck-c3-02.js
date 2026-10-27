// Leçon du module « neck » + les questions de quiz qui s'y rattachent.
// Format « leçon en cartes » décrit dans src/content/README.md.

const OCTAVE_C5_C3 = {
  type: "fretboard",
  caption: "Pattern octave c5→c3 (+2 cases) — même logique que c6→c4",
  data: {
    frets: 8, startFret: 2,
    showStringNames: true, showFretNumbers: true,
    markerFrets: [3, 5, 7],
    notes: [
      { string: 5, fret: 3,  label: "Do",  color: "primary", root: true },
      { string: 3, fret: 5,  label: "Do",  color: "primary", root: true },
      { string: 5, fret: 5,  label: "Ré",  color: "amber",   root: true },
      { string: 3, fret: 7,  label: "Ré",  color: "amber",   root: true },
      { string: 5, fret: 7,  label: "Mi",  color: "green",   root: true },
      { string: 3, fret: 9,  label: "Mi",  color: "green",   root: true },
    ],
  },
};

const TAB_OCTAVES = {
  type: "tab",
  caption: "Corde 5, puis son octave sur la corde 3 : Do, Ré, Mi",
  text: "Tab — corde 5 case 3 puis corde 3 case 5 ; corde 5 case 5 puis corde 3 case 7 ; corde 5 case 7 puis corde 3 case 9.",
  data: { lines: [
    "e|-------------------|",
    "B|-------------------|",
    "G|----5-----7-----9--|",
    "D|-------------------|",
    "A|-3-----5-----7-----|",
    "E|-------------------|",
  ] },
};

export default {
  id: "neck-c3-02", level: 5,
  title: "Pattern octave 2 : corde 5 → corde 3",
  duration: 6,
  gropiTip: "Tu utilises déjà ce pattern sans le savoir : dans La mineur (x02210), la corde 5 à vide et la corde 3 case 2 sont deux La à une octave d'écart.",
  cartes: [
    { type: "idee", titre: "Même forme, une corde plus haut", texte: [
      "Deuxième forme d'octave : de la corde 5 à la corde 3, deux cases plus haut. Le même « L » à l'envers que la forme corde 6 → corde 4.",
      "La, corde 5 à vide → La (corde 3 case 2). Si (corde 5 case 2) → Si (corde 3 case 4).",
    ], bloc: OCTAVE_C5_C3 },
    { type: "question", quizId: "q-neck-27" },
    { type: "idee", titre: "Pourquoi deux cases", texte: [
      "De la corde 5 à la corde 3, il y a deux quartes : 5 + 5 = 10 demi-tons. L'octave en compte 12 : il manque 2 demi-tons, donc 2 cases.",
      "Même calcul entre les cordes 6 et 4 : voilà pourquoi les deux formes sont identiques.",
    ] },
    { type: "question", quizId: "q-neck-28" },
    { type: "idee", titre: "Lire la forme à l'envers", texte: [
      "De la corde 3 vers la corde 5, tu descends d'une octave en reculant de deux cases. Mi (corde 3 case 9) → Mi (corde 5 case 7).",
      "Une note entendue dans le médium se retrouve ainsi dans le grave.",
    ] },
    { type: "idee", titre: "Quatre cordes reliées", texte: [
      "Avec les deux formes, une note grave sur la corde 6 ou 5 trouve son octave deux cordes plus loin, deux cases plus haut.",
      "On peut même continuer : Sol (corde 4 case 5) → Sol (corde 2 case 8). Trois cases cette fois, on verra pourquoi dans la leçon suivante.",
    ] },
    { type: "question", quizId: "q-neck-05" },
    { type: "a-toi", titre: "Quatre places pour une note",
      consigne: "Joue Do, Ré puis Mi sur la corde 5, chacun suivi de son octave sur la corde 3, comme la tab. Puis cherche les mêmes notes sur la corde 6 avec leur octave sur la corde 4. Nomme chaque note, au clic.",
      bloc: TAB_OCTAVES, bpm: 60, minuteur: 120 },
    { type: "recap", points: [
      "Octave corde 5 → corde 3 : une corde sautée, deux cases plus haut.",
      "Deux quartes font 10 demi-tons : il manque 2 cases pour l'octave.",
      "À l'envers, de la corde 3 vers la corde 5 : on recule de deux cases.",
    ] },
  ],
  quiz: ["q-neck-05","q-neck-27","q-neck-28"],
};

export const quiz = [
  {id:"q-neck-05",courseId:"neck",lessonId:"neck-c3-02",lvl:2,q:"Tu joues Ré sur la corde 3, case 7. Où trouves-tu le Ré une octave plus bas, sur la corde 5 ?",o:["Case 5","Case 7","Case 9","Case 3"],a:0,exp:"Le motif corde 5 → corde 3 (+2 cases) se lit aussi à l'envers : de la corde 3 vers la corde 5, on recule de 2 cases. Ré (corde 3 case 7) → Ré (corde 5 case 5).",xp:40},
  {id:"q-neck-27",courseId:"neck",lessonId:"neck-c3-02",lvl:1,q:"Tu joues Do sur la corde 5, case 3. Où est son octave la plus proche, sur la corde 3 ?",o:["Case 5", "Case 3", "Case 1", "Case 7"],a:0,exp:"Pattern c5 → c3 : deux cases plus haut. Do case 3 corde 5 → Do case 5 corde 3.",xp:30},
  {id:"q-neck-28",courseId:"neck",lessonId:"neck-c3-02",lvl:2,q:"Pourquoi faut-il +2 cases pour trouver l'octave de la corde 5 sur la corde 3 ?",o:["Les cordes sont écartées de 12 demi-tons", "L'écart entre c5 et c3 vaut 10 demi-tons", "La corde 3 est accordée plus bas", "C'est une simple convention d'écriture"],a:1,exp:"Deux quartes consécutives = 10 demi-tons. L'octave en faisant 12, il manque 2 demi-tons, donc 2 cases.",xp:40},
];
