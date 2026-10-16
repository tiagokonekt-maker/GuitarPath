// Leçon du module « harmony » + les questions de quiz qui s'y rattachent.
// Format « leçon en cartes » décrit dans src/content/README.md.

export default {
  id: "harm-c1-02", level: 2,
  title: "Consonance et dissonance",
  duration: 7,
  gropiTip: "Joue le triton Si-Fa : Si (corde 5 case 2) et Fa (corde 4 case 3). Glisse ensuite vers Do (corde 5 case 3) et Mi (corde 4 case 2). Deux doigts bougent d'une case, et toute la tension se pose.",
  cartes: [
    { type: "idee", titre: "Stable ou tendu", texte: [
      "Pourquoi certains accords sonnent « bien » et d'autres tendus ? Deux notes consonantes s'accordent et sonnent stables ; deux notes dissonantes créent une tension.",
      "Aucune des deux n'est un défaut : c'est leur alternance qui crée l'émotion.",
    ] },
    { type: "idee", titre: "Des rapports simples", texte: [
      "Plus le rapport de fréquences est simple, plus c'est consonant : octave (2:1), puis quinte juste (3:2), puis tierce majeure (5:4), plus douce.",
      "Seconde, septième, triton : rapports complexes, battements audibles, tension. Le triton est le plus tendu, « le diable en musique ».",
    ], bloc: {
      type: "interval_chart",
      caption: "Consonance vs dissonance — les intervalles les plus consonants (quinte, octave) vs les plus dissonants (triton, 7e)",
      data: { highlight: ["P5", "P8", "TT", "m7", "m2"] },
    } },
    { type: "question", quizId: "q-harm-55" },
    { type: "a-toi", titre: "Trois intervalles depuis Do", consigne: "Garde Do (corde 5, case 3) et ajoute sur la corde 4 : Mi en case 2 (tierce majeure), Fa# en case 4 (triton), Sol en case 5 (quinte). Gratte chaque paire et écoute laquelle grince.", bloc: {
      type: "tab",
      caption: "Do + Mi (tierce majeure), Do + Fa# (triton), Do + Sol (quinte juste)",
      text: "Tab — trois paires jouées ensemble : corde 5 case 3 avec corde 4 case 2 ; corde 5 case 3 avec corde 4 case 4 ; corde 5 case 3 avec corde 4 case 5.",
      data: { lines: [
        "e|----------|",
        "B|----------|",
        "G|----------|",
        "D|-2--4--5--|",
        "A|-3--3--3--|",
        "E|----------|",
      ] },
    }, bpm: 50 },
    { type: "question", quizId: "q-base-13" },
    { type: "idee", titre: "Tension, puis résolution", texte: [
      "La musique tonale vit d'un cycle : tension, puis détente. Un accord tendu, comme le V7, appelle un accord stable, le I.",
      "Sans dissonance, pas de tension ; sans tension, pas d'émotion. Le but n'est pas d'éviter la dissonance, mais de la mener quelque part.",
    ] },
    { type: "question", quizId: "q-harm-56" },
    { type: "idee", titre: "Tout dépend du contexte", texte: [
      "Une septième sonne douce en jazz ; une quinte à vide peut sonner agressive en métal.",
      "Le triton, évité au Moyen Âge, est devenu ordinaire en blues et en rock : le riff de « Black Sabbath » (1970) est bâti dessus. L'oreille s'habitue, et les dissonances acceptées s'élargissent.",
    ] },
    { type: "recap", points: [
      "Consonance = stabilité (octave, quinte), dissonance = tension (seconde, triton, septième).",
      "La tension se résout vers un accord stable : V7 → I.",
      "Ce qui sonne tendu dépend du style et de l'époque.",
    ] },
  ],
  quiz: ["q-base-13","q-harm-55","q-harm-56"],
};

export const quiz = [
  {id:"q-base-13",courseId:"harmony",lessonId:"harm-c1-02",lvl:1,q:"Deux notes qui sonnent tendues ensemble, sans stabilité, sont dites…",o:["Dissonantes","Consonantes","Enharmoniques","Chromatiques"],a:0,exp:"La dissonance crée la tension, la consonance la stabilité. Aucune n'est un défaut : c'est leur alternance qui donne vie à la musique.",xp:30},
  {id:"q-harm-55",courseId:"harmony",lessonId:"harm-c1-02",lvl:1,q:"Lequel de ces intervalles sonne le plus consonant ?",o:["L'octave","La seconde majeure","Le triton","La septième mineure"],a:0,exp:"L'octave (rapport 2:1) est la consonance absolue : les deux notes se fondent presque en une. Seconde, triton et septième produisent des battements, donc de la tension.",xp:30},
  {id:"q-harm-56",courseId:"harmony",lessonId:"harm-c1-02",lvl:2,q:"Un accord tendu (V7) laisse place à un accord stable (I). Comment appelle-t-on ce mouvement ?",o:["Une résolution","Une modulation","Une syncope","Une inversion"],a:0,exp:"La tension créée par la dissonance se résout sur un accord consonant : c'est la résolution. Ce va-et-vient tension → détente est le moteur de la musique tonale.",xp:40},
];
