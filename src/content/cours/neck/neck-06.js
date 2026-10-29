// Leçon du module « neck » + les questions de quiz qui s'y rattachent.
// Format « leçon en cartes » décrit dans src/content/README.md.

const ZONE_CASE_8 = {
  type: "fretboard",
  caption: "Cmaj7 zone case 8 — notes d'accord (violet) + gamme de Do majeur (vert)",
  data: {
    frets: 6, startFret: 7,
    showStringNames: true, showFretNumbers: true,
    markerFrets: [9, 12],
    notes: [
      { string: 6, fret: 8,  label: "Do",  color: "primary", root: true },
      { string: 6, fret: 10, label: "Ré",  color: "green" },
      { string: 5, fret: 10, label: "Sol", color: "primary" },
      { string: 4, fret: 9,  label: "Si",  color: "primary" },
      { string: 4, fret: 10, label: "Do",  color: "primary", root: true },
      { string: 3, fret: 9,  label: "Mi",  color: "primary" },
      { string: 3, fret: 10, label: "Fa",  color: "green" },
      { string: 2, fret: 8,  label: "Sol", color: "primary" },
      { string: 2, fret: 10, label: "La",  color: "green" },
      { string: 1, fret: 8,  label: "Do",  color: "primary", root: true },
      { string: 1, fret: 10, label: "Ré",  color: "green" },
    ],
  },
};

const ARPEGE_CMAJ7 = {
  type: "tab",
  caption: "L'arpège de Cmaj7 dans la zone de la case 8, en montant",
  text: "Tab — Do (corde 6 case 8), Mi (corde 5 case 7), Sol (corde 5 case 10), Si (corde 4 case 9), Do (corde 4 case 10), Mi (corde 3 case 9), Sol (corde 2 case 8), Si (corde 1 case 7), Do (corde 1 case 8).",
  data: { lines: [
    "e|---------------------------7--8--|",
    "B|------------------------8--------|",
    "G|---------------------9-----------|",
    "D|---------------9--10-------------|",
    "A|-------7--10---------------------|",
    "E|-8-------------------------------|",
  ] },
};

export default {
  id: "neck-06", level: 9,
  title: "Connexions accords-gammes-arpèges",
  duration: 9,
  gropiTip: "Teste les guide tones sur Rém7 → Sol7 : la 7e de Rém7 (Do) descend d'un demi-ton vers Si, tierce de Sol7, et le Fa reste en place. Deux notes suffisent pour entendre l'enchaînement.",
  cartes: [
    { type: "idee", titre: "Trois vues d'une même zone", texte: [
      "L'accord plaque ses notes, l'arpège les égrène, la gamme ajoute celles qui manquent.",
      "Les trois occupent la même zone du manche : les voir ensemble, c'est jouer dans l'harmonie.",
    ] },
    { type: "idee", titre: "Cmaj7 à la case 8", texte: [
      "Forme de Mi barrée à la case 8 : Do, Sol, Si, Mi, Sol, Do.",
      "Ses quatre notes, Do, Mi, Sol, Si, jouées une à une : l'arpège.",
    ], bloc: { type: "chord_diagram", caption: "Cmaj7 — forme de Mi barrée, case 8 (8 10 9 9 8 8)", data: { name: "Cmaj7", frets: [8, 10, 9, 9, 8, 8], fingers: [1, 4, 2, 3, 1, 1], startFret: 8 } } },
    { type: "idee", titre: "La gamme remplit les trous", texte: [
      "La gamme de Do majeur ajoute Ré, Fa et La : 9e, 11e et 13e. Accord, arpège, gamme : sans bouger la main.",
    ], bloc: ZONE_CASE_8 },
    { type: "question", quizId: "q-neck-19-app" },
    { type: "idee", titre: "Posé ou en mouvement", texte: [
      "Une phrase qui finit sur 1, 3, 5 ou 7 sonne posée ; sur 2, 4 ou 6, elle reste en mouvement.",
      "Sur Am7, La pentatonique mineure contient l'arpège entier, plus le Ré.",
    ] },
    { type: "question", quizId: "q-neck-18" },
    { type: "a-toi", titre: "Un accord, une minute",
      consigne: "Plaque Cmaj7 case 8, égrène l'arpège en noires au clic, puis une minute d'impro en Do majeur dans la zone : chaque phrase finit sur Do, Mi, Sol ou Si. Recommence avec Dm7 (forme de La barrée, case 5).",
      bloc: ARPEGE_CMAJ7, bpm: 60, minuteur: 120 },
    { type: "idee", titre: "Les guide tones", texte: [
      "La 3e et la 7e définissent l'accord, et bougent peu d'un accord à l'autre.",
      "Dm7 → G7 : Do descend d'un demi-ton sur Si, Fa reste en place.",
    ] },
    { type: "question", quizId: "q-neck-20" },
    { type: "recap", points: [
      "Accord, arpège et gamme partagent la même zone du manche.",
      "La gamme ajoute 9e, 11e et 13e autour des quatre notes de l'accord.",
      "La 3e et la 7e résument l'accord : suis-les d'un accord à l'autre.",
    ] },
  ],
  quiz: ["q-neck-18", "q-neck-19", "q-neck-20", "q-neck-19-app"],
};

export const quiz = [
  {id:"q-neck-18",courseId:"neck",lessonId:"neck-06",lvl:2,q:"Quelles notes de La pentatonique mineure forment l'arpège de Am7 ?",o:["La, Do, Mi, Sol","La, Do#, Mi, Sol","La, Do, Ré, Mi","La, Ré, Mi, Sol"],a:0,exp:"La penta mineure = La Do Ré Mi Sol. Am7 = La Do Mi Sol : quatre des cinq notes. Seul le Ré (la quarte) n'appartient pas à l'accord. Viser ces quatre notes, c'est jouer « dans » l'accord sans changer de gamme.",xp:40},
  {id:"q-neck-19",courseId:"neck",lessonId:"neck-06",lvl:2,q:"Dans la zone de Cmaj7 à la case 8, quelles notes la gamme de Do majeur ajoute-t-elle à l'arpège ?",o:["Ré, Fa et La","Do, Mi et Sol","Ré, Fa# et La","Si, Ré et Fa"],a:0,exp:"L'arpège Cmaj7 donne Do Mi Sol Si. La gamme de Do majeur complète avec les trois notes restantes : Ré, Fa et La (9e, 11e et 13e). Accord, arpège et gamme occupent la même zone du manche.",xp:55},
  {id:"q-neck-19-app",courseId:"neck",lessonId:"neck-06",lvl:2,q:"Dans la zone de Gmaj7, quelles notes la gamme de Sol majeur ajoute-t-elle à l'arpège ?",o:["La, Do et Mi","Sol, Si et Ré","La, Do# et Mi","Si, Ré et Fa#"],a:0,exp:"L'arpège Gmaj7 donne Sol Si Ré Fa#. La gamme de Sol majeur complète avec les trois notes restantes : La, Do et Mi (9e, 11e et 13e).",xp:30},
  {id:"q-neck-20",courseId:"neck",lessonId:"neck-06",lvl:3,q:"Sur G7, quelles notes sont les guide tones ?",o:["Sol et Ré","Sol et Si","Si et Fa","Ré et Fa"],a:2,exp:"G7 = Sol-Si-Ré-Fa. Guide tones = 3e (Si) + 7e (Fa). Ces 2 notes définissent que c'est G7 (et pas Gm7 ou Gmaj7).",xp:50},
];
