// Leçon du module « harmony » + les questions de quiz qui s'y rattachent.
// Format « leçon en cartes » décrit dans src/content/README.md.

export default {
  id: "harm-c6-02", level: 7,
  title: "I-V-vi-IV : la progression pop",
  duration: 7,
  gropiTip: "Joue la boucle en Sol (Sol-Ré-Mim-Do) avec un capodaste en case 2 : mêmes doigtés, mais tu sonnes en La (La-Mi-Fa#m-Ré). Le réflexe idéal pour s'adapter à la voix d'un chanteur.",
  cartes: [
    { type: "idee", titre: "La grille de la pop", texte: [
      "Si I-IV-V est l'ADN du blues, I-V-vi-IV est celui de la pop : d'innombrables chansons reposent dessus.",
      "En Do : Do, Sol, Lam, Fa. En Sol : Sol, Ré, Mim, Do.",
    ], bloc: {
      type: "degree_chart",
      caption: "I-V-vi-IV en Do majeur",
      data: {
        boxes: [
          { top: "I",  label: "Do — Tonique",         sub: "T",  tint: "green" },
          { top: "V",  label: "Sol — Dominante",       sub: "D",  tint: "coral" },
          { top: "vi", label: "La mineur — Tonique",   sub: "T",  tint: "green" },
          { top: "IV", label: "Fa — Sous-dominante",   sub: "SD", tint: "amber" },
        ],
      },
    } },
    { type: "question", quizId: "q-harm-30" },
    { type: "idee", titre: "Pourquoi elle marche", texte: [
      "Le vi, relatif mineur, apporte une touche de mélancolie sans casser l'ambiance majeure.",
      "La boucle est circulaire : le IV ramène vers le I sans jamais conclure pour de bon. Elle peut tourner tout un couplet, tout un refrain.",
    ] },
    { type: "question", quizId: "q-harm-31" },
    { type: "idee", titre: "Mêmes accords, autre ordre", texte: [
      "Commence sur le mineur, vi-IV-I-V, et la même palette sonne plus sombre. IV-I-V-vi part de la sous-dominante et laisse la boucle en suspens.",
      "Quatre accords, plusieurs émotions.",
    ] },
    { type: "a-toi", titre: "La boucle en trois tonalités",
      consigne: "Une mesure par accord, au clic : en Do (Do Sol Lam Fa), en Sol (Sol Ré Mim Do), en Ré (Ré La Sim Sol). Puis capo case 2 sur la version en Sol : tu sonnes en La (La Mi Fa#m Ré), pour suivre la voix d'un chanteur.",
      bloc: {
        type: "chord_diagram",
        caption: "Sim — barré forme de La mineur, case 2 (le vi de Ré)",
        data: { name: "Bm", frets: [-1,2,4,4,3,2], fingers: [0,1,3,4,2,1], startFret: 1 },
      }, bpm: 70, minuteur: 180 },
    { type: "question", quizId: "q-harm-59" },
    { type: "idee", titre: "Le support, pas la star", texte: [
      "Une grille aussi courante peut sembler paresseuse. Mais sa simplicité laisse toute la place à la mélodie, aux paroles et à l'arrangement.",
      "Change la main droite : grattée, arpégée, en palm mute, lente ou rapide. Même grille, autre morceau.",
    ] },
    { type: "a-toi", titre: "Change la main droite",
      consigne: "Garde la boucle en Do et joue-la trois fois : d'abord grattée, puis arpégée note à note, puis en accords courts et étouffés. Une mesure par accord. Écoute à quel point le morceau change.",
      bpm: 80, minuteur: 120 },
    { type: "recap", points: [
      "I-V-vi-IV : en Do, Do Sol Lam Fa ; en Sol, Sol Ré Mim Do ; en Ré, Ré La Sim Sol.",
      "Le vi apporte la mélancolie, le IV relance la boucle vers le I.",
      "Le capo transpose sans changer de doigtés ; la main droite fait le style.",
    ] },
  ],
  quiz: ["q-harm-30", "q-harm-31", "q-harm-59"],
};

export const quiz = [
  {id:"q-harm-30",courseId:"harmony",lessonId:"harm-c6-02",lvl:1,q:"En Do majeur, que donne la progression I-V-vi-IV ?",o:["Do-Fa-Sol-La m", "Do-Sol-La m-Fa", "Do-La m-Fa-Sol", "Do-Sol-Fa-Mi m"],a:1,exp:"I = Do, V = Sol, vi = La mineur, IV = Fa.",xp:30},
  {id:"q-harm-31",courseId:"harmony",lessonId:"harm-c6-02",lvl:2,q:"Dans I-V-vi-IV, quel rôle joue l'accord vi ?",o:["Il crée la tension principale", "Il change de tonalité", "Il apporte une touche mélancolique", "Il remplace la tonique à la fin de la grille"],a:2,exp:"Le vi, relatif mineur, ajoute une couleur mélancolique sans casser l'ambiance majeure du morceau.",xp:40},
  {id:"q-harm-59",courseId:"harmony",lessonId:"harm-c6-02",lvl:2,q:"En Ré majeur, que donne la progression I-V-vi-IV ?",o:["Ré - La - Si m - Sol","Ré - Sol - Si m - La","Ré - La - Fa# m - Sol","Ré - Mi m - Si m - Sol"],a:0,exp:"Ré majeur : I = Ré, V = La, vi = Si mineur, IV = Sol.",xp:40},
];
