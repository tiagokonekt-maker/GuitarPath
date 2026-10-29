// Leçon du module « scales » + les questions de quiz qui s'y rattachent.
// Format « leçon en cartes » décrit dans src/content/README.md.

export default {
  id: "scales-c1-05", level: 3,
  title: "Les intervalles simples : seconde, tierce, quarte, quinte",
  duration: 8,
  gropiTip: "Erreur fréquente : oublier de compter la note de départ. Do→Sol, c'est Do-Ré-Mi-Fa-Sol : 5 notes, donc une quinte, même s'il n'y a que 4 pas entre elles.",
  cartes: [
    { type: "idee", titre: "Nommer une distance", texte: [
      "Un intervalle, c'est la distance entre deux notes. Tu sais la mesurer en demi-tons ; elle porte aussi un nom : seconde, tierce, quarte, quinte…",
      "Toute la musique en parle ainsi, des accords aux solos.",
    ] },
    { type: "idee", titre: "Compter les noms de notes", texte: [
      "On compte les noms, bornes comprises. Do→Mi : Do (1), Ré (2), Mi (3), c'est une tierce.",
      "Seconde : Do→Ré. Tierce : Do→Mi. Quarte : Do→Fa. Quinte : Do→Sol. Sixte : Do→La.",
    ] },
    { type: "question", quizId: "q-scales-22" },
    { type: "idee", titre: "Majeure ou mineure ?", texte: [
      "Un même nom recouvre deux tailles. Tierce majeure : 4 demi-tons (Do→Mi). Tierce mineure : 3 (Do→Mi♭).",
      "Ce seul demi-ton sépare un accord majeur d'un accord mineur. Quarte et quinte, elles, sont « justes » : 5 et 7 demi-tons.",
    ], bloc: {
      type: "interval_chart",
      caption: "Les intervalles — focus sur seconde, tierce, quarte, quinte",
      data: { highlight: ["M2", "m3", "M3", "P4", "P5", "M6"] },
    } },
    { type: "question", quizId: "q-scales-23" },
    { type: "idee", titre: "Sur une corde, des cases", texte: [
      "Sur une seule corde, une case vaut un demi-ton. Tierce majeure : 4 cases. Quarte juste : 5. Quinte juste : 7. Octave : 12.",
      "La théorie est littéralement sous tes doigts.",
    ] },
    { type: "question", quizId: "q-scales-24" },
    { type: "a-toi", titre: "Tierce, quarte, quinte",
      consigne: "Corde 5 : joue La à vide puis la case 4, une tierce majeure. Puis La et la case 5, une quarte. Puis La et la case 7, une quinte. Au clic, chante chaque intervalle juste après l'avoir joué.",
      bloc: {
        type: "tab",
        caption: "Depuis La à vide : tierce majeure (Do#), quarte (Ré), quinte (Mi)",
        text: "Tab — corde 5 : 0 puis 4 ; 0 puis 5 ; 0 puis 7.",
        data: { lines: [
          "e|----------------------|",
          "B|----------------------|",
          "G|----------------------|",
          "D|----------------------|",
          "A|-0--4----0--5----0--7-|",
          "E|----------------------|",
        ] },
      }, bpm: 60 },
    { type: "question", quizId: "q-scales-p34-01" },
    { type: "recap", points: [
      "On nomme un intervalle en comptant les notes, bornes comprises.",
      "Tierce majeure 4 demi-tons, mineure 3 ; quarte juste 5, quinte juste 7.",
      "Sur une corde, une case = un demi-ton : l'intervalle se lit en cases.",
    ] },
  ],
  quiz: ["q-scales-22","q-scales-23","q-scales-24","q-scales-p34-01"],
};

export const quiz = [
  {id:"q-scales-22",courseId:"scales",lessonId:"scales-c1-05",lvl:2,q:"En montant de Sol à Do, quel intervalle obtiens-tu ?",o:["Une tierce","Une quinte","Une quarte","Une sixte"],a:2,exp:"On compte les noms de notes, bornes comprises : Sol (1), La (2), Si (3), Do (4). Quatre notes, donc une quarte — ici une quarte juste, 5 demi-tons.",xp:35},
  {id:"q-scales-23",courseId:"scales",lessonId:"scales-c1-05",lvl:2,q:"Une tierce majeure correspond à combien de demi-tons ?",o:["3","5","2","4"],a:3,exp:"Tierce majeure = 4 demi-tons (Do→Mi). Tierce mineure = 3 demi-tons (Do→Mib) — ce seul demi-ton distingue un accord majeur d'un accord mineur.",xp:35},
  {id:"q-scales-24",courseId:"scales",lessonId:"scales-c1-05",lvl:3,q:"Sur une seule corde de guitare, comment mesure-t-on visuellement un intervalle ?",o:["Une case d'écart vaut un demi-ton","Le nombre de cases divisé par 2","Toujours 12 cases quel que soit l'intervalle","Ça dépend de la corde utilisée"],a:0,exp:"Sur une seule corde, l'intervalle en demi-tons correspond exactement au nombre de cases d'écart — tierce majeure = 4 cases, quinte = 7 cases.",xp:45},
  {id:"q-scales-p34-01",courseId:"scales",lessonId:"scales-c1-05",lvl:2,q:"En montant de Ré à Si, quel intervalle obtiens-tu ?",o:["Une sixte","Une quinte","Une septième","Une quarte"],a:0,exp:"Ré (1), Mi (2), Fa (3), Sol (4), La (5), Si (6) : six noms de notes, donc une sixte. Ici une sixte majeure, 9 demi-tons : 9 cases sur une même corde.",xp:35},
];
