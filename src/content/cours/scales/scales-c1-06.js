// Leçon du module « scales » + les questions de quiz qui s'y rattachent.
// Format « leçon en cartes » décrit dans src/content/README.md.

export default {
  id: "scales-c1-06", level: 3,
  title: "Les intervalles complets : sixtes, septièmes, octave",
  duration: 7,
  gropiTip: "Astuce de calcul : un intervalle et son renversement font toujours 12 demi-tons. Do→La = sixte majeure (9), La→Do = tierce mineure (3). Et le triton (6) se renverse en triton !",
  cartes: [
    { type: "idee", titre: "Sixtes : la couleur vocale", texte: [
      "Sixte majeure : 9 demi-tons (Do→La). Sixte mineure : 8 (Do→La♭).",
      "Chantantes, un peu romantiques : on les entend dans les ballades, le R&B, la bossa nova, et dans beaucoup de mélodies vocales.",
    ] },
    { type: "idee", titre: "Septièmes : la tension", texte: [
      "Septième majeure : 11 demi-tons (Do→Si), une couleur jazz, lumineuse.",
      "Septième mineure : 10 (Do→Si♭), tendue, qui veut bouger. C'est elle qui colore les accords « 7 » comme G7 ou A7, au cœur du blues et du jazz.",
    ] },
    { type: "question", quizId: "q-scales-25" },
    { type: "idee", titre: "Le triton", texte: [
      "6 demi-tons, entre la quarte juste (5) et la quinte juste (7) : trois tons entiers, d'où son nom.",
      "Très instable, surnommé « diabolus in musica », il a longtemps été évité. C'est aujourd'hui un pilier du blues, du jazz et du metal.",
    ], bloc: {
      type: "interval_chart",
      caption: "Les 12 intervalles — triton (TT) et septièmes en surbrillance",
      data: { highlight: ["TT", "m7", "M7", "P8"] },
    } },
    { type: "question", quizId: "q-scales-26" },
    { type: "idee", titre: "Toute l'octave sur une corde", texte: [
      "Depuis une note : +1 et +2 secondes, +3 et +4 tierces, +5 quarte, +6 triton, +7 quinte, +8 et +9 sixtes, +10 et +11 septièmes.",
      "+12 : l'octave, même note plus aiguë, si consonante que l'oreille l'entend presque comme une seule.",
    ] },
    { type: "question", quizId: "q-scales-27" },
    { type: "a-toi", titre: "Les grands intervalles depuis La",
      consigne: "Corde 5 : joue La à vide, puis la case 7 (quinte), 9 (sixte majeure), 10 (septième mineure), 12 (octave), en revenant à vide entre chaque. Nomme chaque intervalle. Puis recommence depuis la case 2 : tout se décale de deux cases.",
      bloc: {
        type: "tab",
        caption: "Depuis La à vide : quinte, sixte majeure, septième mineure, octave",
        text: "Tab — corde 5 : 0 puis 7 ; 0 puis 9 ; 0 puis 10 ; 0 puis 12.",
        data: { lines: [
          "e|--------------------------------|",
          "B|--------------------------------|",
          "G|--------------------------------|",
          "D|--------------------------------|",
          "A|-0--7----0--9----0--10----0--12-|",
          "E|--------------------------------|",
        ] },
      }, minuteur: 120 },
    { type: "question", quizId: "q-scales-p34-02" },
    { type: "recap", points: [
      "Sixtes : 8 (mineure) et 9 (majeure) demi-tons. Septièmes : 10 et 11.",
      "Le triton (6 demi-tons) est l'intervalle le plus instable.",
      "Octave : 12 demi-tons, 12 cases sur une même corde.",
    ] },
  ],
  quiz: ["q-scales-25","q-scales-26","q-scales-27","q-scales-p34-02"],
};

export const quiz = [
  {id:"q-scales-25",courseId:"scales",lessonId:"scales-c1-06",lvl:2,q:"Combien de demi-tons contient une septième mineure ?",o:["9","10","11","12"],a:1,exp:"Septième mineure = 10 demi-tons (Do→Sib). C'est elle qui donne leur couleur à tous les accords '7' (G7, A7...) : l'âme du blues et du jazz.",xp:35},
  {id:"q-scales-26",courseId:"scales",lessonId:"scales-c1-06",lvl:3,q:"Le triton se situe exactement entre quels deux intervalles ?",o:["Tierce majeure et quarte juste", "Quinte juste et sixte mineure", "Quarte juste et quinte juste", "Sixte majeure et septième"],a:2,exp:"Le triton (6 demi-tons) tombe entre la quarte juste (5) et la quinte juste (7) — surnommé 'diabolus in musica' au Moyen-Âge, aujourd'hui central dans le blues, le jazz et le metal.",xp:45},
  {id:"q-scales-27",courseId:"scales",lessonId:"scales-c1-06",lvl:2,q:"Une octave représente combien de demi-tons ?",o:["10","7","14","12"],a:3,exp:"Octave = 12 demi-tons = 12 cases sur une même corde. Même note, mais deux fois plus aiguë (ou grave).",xp:35},
  {id:"q-scales-p34-02",courseId:"scales",lessonId:"scales-c1-06",lvl:2,q:"Tu joues Do, puis le La juste au-dessus. Combien de demi-tons as-tu franchis ?",o:["9","8","10","7"],a:0,exp:"Do→La est une sixte majeure : 9 demi-tons, soit 9 cases sur une même corde. 8 demi-tons donneraient La♭, la sixte mineure.",xp:35},
];
