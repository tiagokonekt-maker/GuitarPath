// Leçon du module « harmony » + les questions de quiz qui s'y rattachent.
// Format « leçon en cartes » décrit dans src/content/README.md.

export default {
  id: "harm-c7-03", level: 9,
  title: "Les modulations : changer de tonalité",
  duration: 9,
  gropiTip: "Pour moduler vers une tonalité, glisse son accord V7 juste avant : de Do vers Mi, passe par Si7 ; de Do vers Fa, par Do7. Un seul accord, et l'oreille suit.",
  cartes: [
    { type: "idee", titre: "Changer de tonalité", texte: [
      "Moduler, c'est déplacer le centre du morceau vers une autre tonique, en cours de route.",
      "Pour quoi faire ? Relancer l'énergie (un dernier refrain plus haut), changer d'ambiance, ou explorer, comme le jazz qui passe d'une tonalité à l'autre en permanence.",
    ] },
    { type: "idee", titre: "Par accord pivot", texte: [
      "La plus douce : un accord commun aux deux tonalités sert de charnière. De Do vers Fa, Rém est le ii de Do et le vi de Fa : Do - Rém - C7 - Fa.",
      "Plus deux tonalités sont voisines sur le cercle, plus elles partagent d'accords.",
    ], bloc: {
      type: "circle_of_fifths",
      caption: "Do et Sol sont voisins sur le cercle — elles partagent presque toutes leurs notes",
      data: {
        highlight: ["Do", "Sol"],
        showMinors: true,
      },
    } },
    { type: "question", quizId: "q-harm-22" },
    { type: "idee", titre: "Par la dominante", texte: [
      "On annonce la nouvelle tonique avec son propre V7. Vers Mi mineur : B7, puis Em. Vers Fa : C7, puis Fa.",
      "Le V7 contient la sensible de la nouvelle tonalité : l'oreille comprend avant même d'y arriver. C'est la modulation la plus courante en jazz.",
    ] },
    { type: "question", quizId: "q-harm-p89-c703-01" },
    { type: "idee", titre: "Relative", texte: [
      "Do majeur et La mineur ont les mêmes notes. Passer de l'un à l'autre déplace seulement le centre : le repos se fait sur Lam au lieu de Do.",
      "Beaucoup de chansons alternent ainsi couplet mineur et refrain majeur.",
    ] },
    { type: "idee", titre: "Directe", texte: [
      "Aucune préparation : on saute dans la nouvelle tonalité. L'effet est franc, parfois spectaculaire.",
      "C'est le coup classique du dernier refrain monté d'un demi-ton ou d'un ton en pop.",
    ] },
    { type: "question", quizId: "q-harm-p89-c703-02" },
    { type: "a-toi", titre: "Deux chemins vers Ré",
      consigne: "Quatre temps par accord au clic. Tour 1, direct : Do, Fa, Sol, Do, puis tout de suite Ré, Sol, La, Ré. Tour 2, préparé : Do, Fa, Sol, Do, A7, Ré, Sol, La, Ré. Écoute comme A7 annonce l'arrivée.",
      bloc: { type: "chord_diagram", caption: "A7 (× 0 2 0 2 0) : la dominante de Ré, avec son Do#", data: { name: "A7", frets: [-1,0,2,0,2,0], fingers: [0,0,2,0,3,0], startFret: 1 } },
      bpm: 70, minuteur: 180 },
    { type: "recap", points: [
      "Pivot : un accord commun aux deux tonalités sert de charnière.",
      "Dominante : le V7 de la nouvelle tonalité l'annonce.",
      "Relative : mêmes notes, autre centre ; directe : un saut sans préparation.",
    ] },
  ],
  quiz: ["q-harm-22","q-impro-08","q-impro-10","q-harm-p89-c703-01","q-harm-p89-c703-02"],
};

export const quiz = [
  {id:"q-harm-22",courseId:"harmony",lessonId:"harm-c7-03",lvl:3,q:"Pour moduler de Do majeur à Sol majeur, lequel de ces accords peut servir de pivot ?",o:["La mineur","Fa majeur","Ré majeur","Si mineur"],a:0,exp:"Un pivot appartient aux deux tonalités. La mineur est le vi de Do et le ii de Sol : Do - Lam - D7 - Sol module sans choc. Fa majeur (Fa naturel) n'existe qu'en Do ; Ré majeur et Si mineur (avec Fa#) n'existent qu'en Sol.",xp:55},
  {id:"q-harm-p89-c703-01",courseId:"harmony",lessonId:"harm-c7-03",lvl:2,q:"Tu es en Do majeur et tu veux arriver en Ré majeur. Quel accord glisser juste avant le Ré ?",o:["A7","D7","G7","E7"],a:0,exp:"A7 est le V7 de Ré : son Do# est la sensible de Ré majeur. D7 est l'accord d'arrivée lui-même, G7 ramène vers Do, E7 prépare La.",xp:40},
  {id:"q-harm-p89-c703-02",courseId:"harmony",lessonId:"harm-c7-03",lvl:2,q:"Un morceau passe de Do majeur à La mineur. Qu'est-ce qui change vraiment ?",o:["Le centre, avec les mêmes notes","Trois notes de la gamme","Toutes les notes, un ton plus bas","Une note : le Fa devient Fa#"],a:0,exp:"La mineur est la relative de Do majeur : même armure, mêmes sept notes. Seul le repos se déplace, de Do vers La.",xp:40},
];
