// Leçon du module « neck » + les questions de quiz qui s'y rattachent.
// Format « leçon en cartes » décrit dans src/content/README.md.

const OCTAVE_C6_C4 = {
  type: "fretboard",
  caption: "Pattern octave c6→c4 (+2 cases) — La, Do, Sol et leurs octaves",
  data: {
    frets: 8, startFret: 2,
    showStringNames: true, showFretNumbers: true,
    markerFrets: [3, 5, 7],
    notes: [
      { string: 6, fret: 3,  label: "Sol", color: "amber",   root: true },
      { string: 4, fret: 5,  label: "Sol", color: "amber",   root: true },
      { string: 6, fret: 5,  label: "La",  color: "green",   root: true },
      { string: 4, fret: 7,  label: "La",  color: "green",   root: true },
      { string: 6, fret: 8,  label: "Do",  color: "primary", root: true },
      { string: 4, fret: 10, label: "Do",  color: "primary", root: true },
    ],
  },
};

const TAB_OCTAVES = {
  type: "tab",
  caption: "Corde 6, puis son octave sur la corde 4 : Sol, La, Do, Si, Ré",
  text: "Tab — corde 6 case 3 puis corde 4 case 5 ; corde 6 case 5 puis corde 4 case 7 ; corde 6 case 8 puis corde 4 case 10 ; corde 6 case 7 puis corde 4 case 9 ; corde 6 case 10 puis corde 4 case 12.",
  data: { lines: [
    "e|----------------------------------|",
    "B|----------------------------------|",
    "G|----------------------------------|",
    "D|----5-----7-----10-----9------12--|",
    "A|----------------------------------|",
    "E|-3-----5-----8------7-----10------|",
  ] },
};

export default {
  id: "neck-c3-01", level: 5,
  title: "Pattern octave 1 : corde 6 → corde 4",
  duration: 7,
  gropiTip: "Pour des octaves doublées propres : index sur la corde 6, annulaire sur la corde 4, et laisse l'index effleurer la corde 5 pour l'étouffer. Tu peux alors gratter sans faire sonner celle du milieu.",
  cartes: [
    { type: "idee", titre: "Une note, deux places", texte: [
      "Retrouver chaque note case par case, c'est long. Les formes d'octave te donnent la même note ailleurs, instantanément.",
      "Première forme : de la corde 6 à la corde 4, deux cases plus haut. Mi à vide sur la corde 6 → Mi (corde 4 case 2). Sol (corde 6 case 3) → Sol (corde 4 case 5).",
    ], bloc: OCTAVE_C6_C4 },
    { type: "idee", titre: "Une forme qui voyage", texte: [
      "Une corde sautée, deux cases plus loin : la forme dessine un « L » à l'envers.",
      "Elle se déplace telle quelle sur tout le manche. Tu la reconnais d'un coup d'œil, quelle que soit la note.",
    ] },
    { type: "question", quizId: "q-neck-32" },
    { type: "idee", titre: "Déduire la corde 4", texte: [
      "Tu connais la corde 6 ? Alors tu connais la corde 4. Do est case 8 sur la corde 6, donc Do (corde 4 case 10).",
      "Plus besoin d'apprendre la corde 4 à part : tu la déduis, deux cases plus loin.",
    ] },
    { type: "question", quizId: "q-neck-33" },
    { type: "idee", titre: "Les octaves doublées", texte: [
      "Joue les deux notes ensemble : la mélodie sonne plus large, plus pleine. C'est une technique courante en jazz et en funk, popularisée à la guitare par Wes Montgomery.",
      "Un riff sur la corde 6 s'enrichit aussitôt de son octave sur la corde 4.",
    ] },
    { type: "question", quizId: "q-neck-34" },
    { type: "a-toi", titre: "Cinq notes, dix positions",
      consigne: "Joue chaque note sur la corde 6, puis son octave sur la corde 4 : Sol, La, Do, Si, Ré. Nomme-les à voix haute, au clic. Puis plaque chaque paire ensemble, la corde 5 étouffée.",
      bloc: TAB_OCTAVES, bpm: 60, minuteur: 120 },
    { type: "recap", points: [
      "Octave corde 6 → corde 4 : une corde sautée, deux cases plus haut.",
      "La forme se déplace telle quelle : la corde 6 te donne la corde 4.",
      "Jouées ensemble, les deux notes font des octaves doublées.",
    ] },
  ],
  quiz: ["q-neck-32", "q-neck-33", "q-neck-34"],
};

export const quiz = [
  {id:"q-neck-32",courseId:"neck",lessonId:"neck-c3-01",lvl:1,q:"Tu cherches La sur la corde 4. Il est case 5 sur la corde 6 : où le trouves-tu ?",o:["Case 5","Case 9","Case 7","Case 3"],a:2,exp:"Pattern c6 → c4 : deux cases plus loin. La, corde 6 case 5 → corde 4 case 7.",xp:30},
  {id:"q-neck-33",courseId:"neck",lessonId:"neck-c3-01",lvl:1,q:"Quelle forme dessine le pattern d'octave c6 → c4 sur le manche ?",o:["Une ligne droite verticale","Un carré de quatre cases","Une diagonale de trois cordes","Un « L » à l'envers"],a:3,exp:"Une corde sautée, deux cases plus loin : une forme en « L » à l'envers, qui se déplace telle quelle sur tout le manche.",xp:30},
  {id:"q-neck-34",courseId:"neck",lessonId:"neck-c3-01",lvl:2,q:"À quoi ce pattern sert-il souvent en jeu ?",o:["Jouer une mélodie en octaves doublées","Accorder la corde 4 à l'oreille","Trouver rapidement les accords barrés en La","Éviter les notes à vide dans un riff"],a:0,exp:"Deux notes à une octave d'écart, jouées ensemble : la technique des octaves, popularisée à la guitare par Wes Montgomery.",xp:40},
];
