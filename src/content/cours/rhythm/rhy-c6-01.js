// Leçon du module « rhythm » + les questions de quiz qui s'y rattachent.
// Format « leçon en cartes » décrit dans src/content/README.md.

const GAMME_DO = { type: "tab", caption: "La gamme de Do de l'exercice : joue-la pile sur le clic, puis derrière, puis devant", text: "Tab : Do (corde 5 case 3), Ré (corde 4 à vide), Mi (corde 4 case 2), Fa (corde 4 case 3), Sol (corde 3 à vide), La (corde 3 case 2), Si (corde 2 à vide), Do (corde 2 case 1).", data: { lines: ["e|------------------|","B|-------------0-1--|","G|---------0-2------|","D|---0-2-3----------|","A|-3----------------|","E|------------------|"] } };

export default {
  id: "rhy-c6-01", level: 9,
  title: "Jouer laid-back, on-top, in-the-pocket",
  duration: 8,
  gropiTip: "Enregistre une minute de noires sur un clic à 60 BPM, puis réécoute. Si le clic disparaît presque, c'est que tu es pile dessus : ta note le masque. S'il ressort, tu es devant ou derrière.",
  cartes: [
    { type: "idee", titre: "Mêmes notes, autre feel", texte: [
      "Deux guitaristes jouent les mêmes notes au même tempo, et pourtant l'un sonne détendu, l'autre pressé.",
      "La différence tient en quelques millisecondes : où tombe l'attaque par rapport au temps. Derrière, dessus ou devant.",
    ], bloc: { type: "rhythm_grid", caption: "L'attaque tombe pile sur le temps. Laid-back la glisse un rien vers la droite, on-top un rien vers la gauche", data: { beats: 4, subdivision: 16, highlights: [0, 4, 8, 12], muted: [1, 2, 3, 5, 6, 7, 9, 10, 11, 13, 14, 15], label: "1 · e · et · a · 2 · e · et · a · 3 · e · et · a · 4 · e · et · a" } } },
    { type: "idee", titre: "Laid-back : derrière", texte: [
      "L'attaque arrive un rien après le clic, sans que le tempo ralentisse.",
      "Le son se pose, détendu, chaleureux : un placement fréquent en blues et en soul.",
    ] },
    { type: "question", quizId: "q-rhy-35" },
    { type: "idee", titre: "On-top : devant", texte: [
      "L'attaque arrive un rien avant le clic. Le son pousse, urgent, plein d'énergie : celui du rock nerveux et des tempos rapides.",
    ] },
    { type: "idee", titre: "In the pocket", texte: [
      "Être dans la poche, ce n'est pas forcément être pile sur le clic : c'est tomber au même endroit que la basse et la batterie.",
      "Un groupe dans la poche sonne comme une seule main.",
    ] },
    { type: "question", quizId: "q-rhy-40" },
    { type: "idee", titre: "Un choix, pas une erreur", texte: [
      "Un retard involontaire est une erreur de tempo. Un retard choisi, et tenu du début à la fin, est un feel.",
      "Ce qui les sépare : la régularité.",
    ] },
    { type: "a-toi", titre: "Trois placements",
      consigne: "Clic à 60, enregistre-toi. Joue la gamme deux fois pile sur le clic : ta note doit le couvrir. Puis deux fois juste derrière, puis deux fois juste devant, sans changer de tempo. Réécoute : entends-tu les trois feels ?",
      bloc: GAMME_DO, bpm: 60, minuteur: 180 },
    { type: "question", quizId: "q-rhy-timing-lot4" },
    { type: "recap", points: [
      "Laid-back : un rien derrière le temps, son posé. On-top : un rien devant, son qui pousse.",
      "In the pocket : au même endroit que la basse et la batterie.",
      "Un feel est un choix tenu ; enregistre-toi pour l'entendre.",
    ] },
  ],
  quiz: ["q-rhy-35","q-rhy-40","q-rhy-timing-lot4","q-rhy-07","q-rhy-09"],
};

export const quiz = [
  {id:"q-rhy-35",courseId:"rhythm",lessonId:"rhy-c6-01",lvl:3,q:"Jouer « laid-back » signifie placer les notes…",o:["Très légèrement après le temps", "Juste avant le temps, en avance", "Exactement sur le temps", "En dehors de la mesure"],a:0,exp:"Un placement très légèrement en retard, sans perdre le tempo — d'où l'impression de détente du jazz et de la soul. Jouer « on top » (juste devant) produit l'effet inverse : urgence, poussée, et c'est le placement du rock.",xp:40},
  {id:"q-rhy-40",courseId:"rhythm",lessonId:"rhy-c6-01",lvl:3,q:"Jouer « in the pocket », c'est…",o:["Jouer le plus vite possible sans perdre la justesse","S'aligner précisément sur le placement de la section rythmique","Jouer systématiquement en avance sur le temps","Jouer très fort pour dominer le reste du groupe"],a:1,exp:"Le « pocket » est le placement collectif du groupe. Être dedans, ce n'est pas être mathématiquement sur le clic : c'est être au même endroit que la basse et la batterie, quel que soit cet endroit.",xp:40},
  {id:"q-rhy-timing-lot4",courseId:"rhythm",lessonId:"rhy-c6-01",lvl:3,q:"Tu te réécoutes sur un clic : on entend nettement le clic juste avant chacune de tes notes. Où te places-tu ?",o:["Derrière le temps","Devant le temps","Pile sur le temps","En dehors du tempo"],a:0,exp:"Le clic sonne d'abord, ta note ensuite : tu joues derrière le temps. Pile dessus, ta note masquerait le clic ; devant, c'est ta note qu'on entendrait en premier.",xp:40},
];
