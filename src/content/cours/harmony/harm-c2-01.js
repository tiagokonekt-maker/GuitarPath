// Leçon du module « harmony » + les questions de quiz qui s'y rattachent.
// Format « leçon en cartes » décrit dans src/content/README.md.

const TAB_QUATRE_TRIADES = {
  type: "tab",
  caption: "Les quatre triades de Do, fondamentale fixe : majeure, mineure, diminuée, augmentée",
  text: "Tab — à chaque fois Do (corde 5 case 3), puis la tierce et la quinte sur la corde 4 : cases 2 et 5 (majeure), 1 et 5 (mineure), 1 et 4 (diminuée), 2 et 6 (augmentée).",
  data: { lines: [
    "e|-------------------------------------|",
    "B|-------------------------------------|",
    "G|-------------------------------------|",
    "D|----2--5-----1--5-----1--4-----2--6--|",
    "A|-3--------3--------3--------3--------|",
    "E|-------------------------------------|",
  ] },
};

export default {
  id: "harm-c2-01", level: 5,
  title: "Les 4 types de triades",
  duration: 8,
  gropiTip: "Pour passer de majeur à mineur, baisse juste la tierce d'une case. Sur Mi ouvert, lève le doigt de la corde 3 (case 1) : tu obtiens Mim, et toute l'ambiance bascule.",
  cartes: [
    { type: "idee", titre: "Trois notes empilées", texte: [
      "Une triade, c'est trois notes empilées par tierces : 1, 3, 5. C'est l'unité de base des accords.",
      "Il en existe quatre types, chacun avec sa couleur. Tout dépend des deux tierces qui la composent.",
    ] },
    { type: "idee", titre: "Majeure : 1-3-5", texte: [
      "Tierce majeure (4 demi-tons), puis tierce mineure (3) : la quinte juste tombe à 7 demi-tons de la fondamentale.",
      "Son brillant, stable. La majeur : La, Do#, Mi.",
    ], bloc: {
      type: "chord_diagram",
      caption: "La majeur — triade majeure ouverte (1-3-5)",
      data: { name: "A", frets: [-1,0,2,2,2,0], fingers: [0,0,1,2,3,0], startFret: 1 },
    } },
    { type: "question", quizId: "q-harm-01" },
    { type: "idee", titre: "Mineure : 1-♭3-5", texte: [
      "La tierce descend d'un demi-ton : 3 puis 4 demi-tons. La quinte ne bouge pas.",
      "Un seul demi-ton d'écart, et le son devient doux, mélancolique. La mineur : La, Do, Mi.",
    ], bloc: {
      type: "chord_diagram",
      caption: "La mineur — triade mineure ouverte (1-♭3-5)",
      data: { name: "Am", frets: [-1,0,2,2,1,0], fingers: [0,0,2,3,1,0], startFret: 1 },
    } },
    { type: "idee", titre: "Diminuée : 1-♭3-♭5", texte: [
      "Deux tierces mineures, 3 + 3 : la quinte tombe à 6 demi-tons. Son tendu, instable, qui demande à se résoudre.",
      "On la trouve sur le 7e degré de la gamme majeure : Si diminué en Do.",
    ], bloc: {
      type: "chord_diagram",
      caption: "Si diminué — triade diminuée (1-♭3-♭5)",
      data: { name: "Bdim", frets: [-1,2,3,4,3,-1], fingers: [0,1,2,4,3,0], startFret: 1 },
    } },
    { type: "question", quizId: "q-harm-02" },
    { type: "idee", titre: "Augmentée : 1-3-#5", texte: [
      "Deux tierces majeures, 4 + 4 : la quinte monte à 8 demi-tons. Son flottant, ambigu.",
      "Elle est symétrique : Do augmenté, Mi augmenté et Sol# augmenté sonnent avec les mêmes trois notes.",
    ] },
    { type: "question", quizId: "q-harm-04" },
    { type: "a-toi", titre: "Quatre couleurs depuis Do",
      consigne: "Garde Do sur la corde 5 et joue les quatre triades en arpège, comme la tab : majeure, mineure, diminuée, augmentée. Seules la tierce et la quinte bougent. Écoute la couleur changer : brillant, sombre, tendu, flottant.",
      bloc: TAB_QUATRE_TRIADES, bpm: 60, minuteur: 120 },
    { type: "recap", points: [
      "Majeure 4+3, mineure 3+4 : la tierce fait la différence.",
      "Diminuée 3+3 (quinte ♭5), augmentée 4+4 (quinte #5).",
      "Brillant, mélancolique, tendu, flottant : quatre couleurs.",
    ] },
  ],
  quiz: ["q-harm-01","q-harm-02","q-harm-03","q-harm-04"],
};

export const quiz = [
  {id:"q-harm-01",courseId:"harmony",lessonId:"harm-c2-01",lvl:1,q:"Une triade majeure se compose de…",o:["1-3-5","1-♭3-5","1-3-♭5","1-2-5"],a:0,exp:"Triade majeure : fondamentale + tierce majeure (4dt) + quinte juste (7dt). Formule 1-3-5. C'est la triade de référence.",xp:25},
  {id:"q-harm-02",courseId:"harmony",lessonId:"harm-c2-01",lvl:2,q:"Une triade diminuée se compose de…",o:["1-3-5","1-♭3-♭5","1-♭3-5","1-3-#5"],a:1,exp:"Diminuée = 1-♭3-♭5. Tierce mineure (3dt) + quinte diminuée (6dt). Très instable. Trouvée sur le 7e degré de la gamme majeure.",xp:35},
  {id:"q-harm-03",courseId:"harmony",lessonId:"harm-c2-01",lvl:2,q:"Quelles notes forment l'accord de Si majeur ?",o:["Si-Ré-Fa#","Si-Ré-Fa","Si-Ré#-Fa#","Si-Ré#-Fa"],a:2,exp:"Si majeur = Si + (Si+4dt = Ré#) + (Si+7dt = Fa#). Notes : Si-Ré#-Fa#. Triade majeure classique.",xp:40},
  {id:"q-harm-04",courseId:"harmony",lessonId:"harm-c2-01",lvl:3,q:"Une triade augmentée a quelle particularité ?",o:["Sa fondamentale est doublée à l'octave", "Elle contient 4 notes au lieu de 3", "Sa tierce est mineure au lieu de majeure", "Sa quinte est augmentée d'un demi-ton"],a:3,exp:"Augmentée = 1-3-#5. Quinte augmentée (8dt au lieu de 7dt). Symétrique : on peut empiler des tierces majeures à l'infini. Aug = Caug = Eaug = Lab aug (mêmes notes, fondamentales différentes).",xp:50},
];
