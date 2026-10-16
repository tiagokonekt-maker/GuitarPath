// Leçon du module « rhythm » + les questions de quiz qui s'y rattachent.
// Format « leçon en cartes » décrit dans src/content/README.md.

const ET_DU_4 = {
  type: "rhythm_grid",
  caption: "L'accord change sur le 'et du 4', une croche avant le prochain temps 1",
  data: {
    beats: 4, subdivision: 8,
    highlights: [7],
    label: "1 · et · 2 · et · 3 · et · 4 · et ← nouvel accord ici, tenu sur le 1 suivant",
  },
};

export default {
  id: "rhy-c3-02", level: 6,
  title: "L'anticipation : jouer avant le temps",
  duration: 7,
  gropiTip: "Piège classique : jouer le nouvel accord sur le « et » du 4, puis le rejouer sur le 1. Laisse-le sonner sans rien rejouer sur le 1 : c'est cette tenue qui fait l'anticipation.",
  cartes: [
    { type: "idee", titre: "Arriver avant l'heure", texte: [
      "L'anticipation est une syncope précise : au lieu de jouer l'accord sur le 1, tu le joues sur le « et » du 4 de la mesure d'avant, et tu le tiens par-dessus le 1.",
      "Le temps 1 est anticipé d'une croche.",
    ], bloc: ET_DU_4 },
    { type: "idee", titre: "Un élan vers l'avant", texte: [
      "Sur le temps, un changement sonne solide mais statique. Anticipé, il donne de l'élan : la phrase semble se pencher vers la suite.",
      "Le tempo, lui, ne bouge pas.",
    ] },
    { type: "question", quizId: "q-rhy-06" },
    { type: "idee", titre: "Bossa, jazz, pop", texte: [
      "En bossa nova, les accords changent souvent un « et » avant le temps : c'est une part de sa légèreté.",
      "En jazz, on parle aussi de jouer « devant » le temps, qui pousse, ou « derrière », qui détend. Le placement est un choix.",
    ] },
    { type: "idee", titre: "Délibérée, pas approximative", texte: [
      "Une anticipation tombe exactement sur le « et » du 4. Arriver « à peu près » en avance sonne comme une erreur de timing.",
      "La précision fait toute la différence.",
    ] },
    { type: "question", quizId: "q-rhy-43" },
    { type: "a-toi", titre: "Anticipe tes changements",
      consigne: "Am, F, C, G, une mesure chacun, en croches au clic. D'abord, change sur le 1. Puis change sur le « et » du 4 de la mesure d'avant, et tiens l'accord par-dessus le 1. Compare les deux versions.",
      bloc: ET_DU_4, bpm: 70 },
    { type: "question", quizId: "q-rhy-42" },
    { type: "recap", points: [
      "Anticiper : jouer l'accord du 1 sur le « et » du 4 précédent.",
      "On le tient par-dessus le 1, sans le rejouer.",
      "Précise et voulue, elle donne de l'élan ; approximative, c'est une erreur.",
    ] },
  ],
  quiz: ["q-rhy-06","q-rhy-42","q-rhy-43"],
};

export const quiz = [
  {id:"q-rhy-06",courseId:"rhythm",lessonId:"rhy-c3-02",lvl:3,q:"L''anticipation harmonique' en jazz/bossa consiste à…",o:["Ralentir légèrement le tempo avant chaque accord", "Ajouter un silence juste avant le temps 1", "Jouer la note du 1 sur le « et » du 4 précédent", "Jouer plus fort sur le premier temps"],a:2,exp:"Anticipation = jouer la note/accord cible un demi-temps avant le temps fort. Crée fluidité, 'glisse' rythmique. Très utilisé en bossa nova.",xp:50},
  {id:"q-rhy-42",courseId:"rhythm",lessonId:"rhy-c3-02",lvl:1,q:"Tu as anticipé l'accord sur le « et » du 4. Que fais-tu sur le temps 1 suivant ?",o:["Tu le laisses sonner, sans regratter","Tu le grattes à nouveau, plus fort","Tu reviens à l'accord précédent","Tu étouffes toutes les cordes"],a:0,exp:"L'anticipation remplace l'attaque du 1 : l'accord arrive une croche plus tôt et on le tient par-dessus le temps fort. Le regratter sur le 1 annulerait l'effet.",xp:30},
  {id:"q-rhy-43",courseId:"rhythm",lessonId:"rhy-c3-02",lvl:2,q:"Qu'est-ce qui distingue une anticipation d'une erreur de timing ?",o:["Elle tombe précisément sur le « et »", "Elle est jouée plus doucement", "Elle n'arrive qu'à la toute fin du morceau", "Elle se joue sans médiator"],a:0,exp:"L'anticipation est délibérée et précise : exactement sur le « et » du 4. Approximative, elle sonne comme une erreur.",xp:40},
];
