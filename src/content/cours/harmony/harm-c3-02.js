// Leçon du module « harmony » + les questions de quiz qui s'y rattachent.
// Format « leçon en cartes » décrit dans src/content/README.md.

export default {
  id: "harm-c3-02", level: 7,
  title: "Les 5 types d'accords de septième",
  duration: 9,
  gropiTip: "Pars de Cmaj7 et baisse une note d'un demi-ton à chaque fois : la 7e (C7), puis la tierce (Cm7), puis la quinte (Cm7b5), puis encore la 7e (Cdim7). Les 5 types en un seul chemin.",
  cartes: [
    { type: "idee", titre: "Cinq couleurs", texte: [
      "Une triade, plus une 7e mineure ou majeure : cinq combinaisons suffisent pour la grande majorité des accords de pop, rock, jazz, bossa et soul.",
      "Maj7, m7, 7, m7♭5 et dim7. Chacun a sa couleur et sa place dans la tonalité.",
    ] },
    { type: "idee", titre: "Maj7 et m7", texte: [
      "Maj7 = 1-3-5-7, Cmaj7 = Do Mi Sol Si : lumineux, rêveur. Sa place : le I et le IV en majeur.",
      "m7 = 1-♭3-5-♭7, Am7 = La Do Mi Sol : doux, détendu. Sa place : les ii, iii et vi en majeur.",
    ], bloc: {
      type: "chord_diagram",
      caption: "Fmaj7 — accord Maj7 (× × 3 2 1 0)",
      data: { name: "Fmaj7", frets: [-1,-1,3,2,1,0], fingers: [0,0,3,2,1,0], startFret: 1 },
    } },
    { type: "question", quizId: "q-harm-05-app" },
    { type: "idee", titre: "7 : le moteur", texte: [
      "Dominante = 1-3-5-♭7, G7 = Sol Si Ré Fa. Tendu, bluesy, il veut avancer. Sa place : le V, en majeur comme en mineur.",
      "Tu en joues déjà plusieurs : E7, A7, D7, B7.",
    ], bloc: {
      type: "chord_diagram",
      caption: "D7 — accord dominante (× × 0 2 1 2)",
      data: { name: "D7", frets: [-1,-1,0,2,1,2], fingers: [0,0,0,2,1,3], startFret: 1 },
    } },
    { type: "idee", titre: "Le triton qui se résout", texte: [
      "Entre la 3e et la 7e d'une dominante, il y a toujours un triton. Dans G7 : Si et Fa, 6 demi-tons.",
      "Vers Do, Si monte d'un demi-ton sur Do et Fa descend d'un demi-ton sur Mi. Ces deux petits pas rendent V7 → I si satisfaisant.",
    ] },
    { type: "question", quizId: "q-harm-06" },
    { type: "idee", titre: "m7♭5 et dim7", texte: [
      "m7♭5 (demi-diminué) = 1-♭3-♭5-♭7, Bm7♭5 = Si Ré Fa La : instable, sombre. Sa place : le vii en majeur, le ii d'un ii-V-i mineur.",
      "dim7 = 1-♭3-♭5-𝄫7, Cdim7 = Do Mi♭ Sol♭ Si𝄫 (qui sonne La). Toutes ses notes sont à 3 demi-tons : un accord de passage, jamais de repos.",
    ] },
    { type: "question", quizId: "q-harm-08" },
    { type: "a-toi", titre: "Les cinq sur Do",
      consigne: "Forme de La barrée en case 3 : Cmaj7, C7, Cm7, Cm7♭5, Cdim7. À chaque accord, une seule note descend d'un demi-ton. Quatre temps chacun, nomme le type à voix haute. Puis joue-les dans le désordre, yeux fermés, et reconnais-les à l'oreille.",
      bloc: {
        type: "tab",
        caption: "Cmaj7 (x35453), C7 (x35353), Cm7 (x35343), Cm7♭5 (x3434x), Cdim7 (x3424x)",
        text: "Tab — cinq accords, basse Do corde 5 case 3 : Cmaj7 cases 3, 5, 4, 5, 3 ; C7 cases 3, 5, 3, 5, 3 ; Cm7 cases 3, 5, 3, 4, 3 ; Cm7♭5 cases 3, 4, 3, 4 ; Cdim7 cases 3, 4, 2, 4 (cordes 5 à 1).",
        data: { lines: [
          "e|-3----3----3--------------|",
          "B|-5----5----4----4----4----|",
          "G|-4----3----3----3----2----|",
          "D|-5----5----5----4----4----|",
          "A|-3----3----3----3----3----|",
          "E|--------------------------|",
        ] },
      }, bpm: 60, minuteur: 120 },
    { type: "recap", points: [
      "Maj7 (1-3-5-7) lumineux, m7 (1-♭3-5-♭7) doux, 7 (1-3-5-♭7) tendu.",
      "m7♭5 (1-♭3-♭5-♭7) et dim7 (1-♭3-♭5-𝄫7) : instables, ils mènent ailleurs.",
      "La dominante contient un triton entre 3e et 7e : il se résout par deux demi-tons.",
    ] },
  ],
  quiz: ["q-harm-05","q-harm-06","q-harm-08","q-logic-09","q-fret-harm-03","q-fret-harm-04","q-fret-harm-05","q-harm-02", "q-harm-05-app"],
};

export const quiz = [
  {id:"q-harm-05",courseId:"harmony",lessonId:"harm-c3-02",lvl:1,q:"Un accord m7 (mineur 7) contient les degrés…",o:["1-♭3-5-♭7","1-3-5-7","1-3-5-♭7","1-♭3-5-7"],a:0,exp:"m7 = mineur + septième mineure = 1-♭3-5-♭7. Son funk, modal, jazz. Ex : Am7 = La-Do-Mi-Sol.",xp:30},
  {id:"q-harm-05-app",courseId:"harmony",lessonId:"harm-c3-02",lvl:1,q:"Quelles notes forment l'accord Dm7 ?",o:["Ré-Fa-La-Do","Ré-Fa#-La-Do","Ré-Fa-La-Do#","Ré-Fa#-La-Do#"],a:0,exp:"m7 = 1-♭3-5-♭7 : Ré, Fa (tierce mineure), La, Do (septième mineure).",xp:25},
  {id:"q-harm-06",courseId:"harmony",lessonId:"harm-c3-02",lvl:2,q:"Quel accord contient Sol-Si-Ré-Fa ?",o:["Gmaj7","G7","Gm7","Gm7b5"],a:1,exp:"Sol-Si-Ré-Fa = 1-3-5-♭7 (Fa = 7e mineure de Sol). Donc G7 (dominante). Si c'était Fa#, ce serait Gmaj7.",xp:40},
  {id:"q-harm-08",courseId:"harmony",lessonId:"harm-c3-02",lvl:3,q:"Quelle est la différence entre m7b5 et dim7 ?",o:["Aucune, ce sont deux noms du même accord", "La quinte : juste pour l'un, diminuée pour l'autre", "La fondamentale, un demi-ton plus haut", "La 7e : mineure pour m7♭5, diminuée pour dim7"],a:3,exp:"m7b5 = 1-♭3-♭5-♭7. dim7 = 1-♭3-♭5-bb7 (= 6 enharmonique). Sur Si : Bm7b5 = Si-Ré-Fa-La. Bdim7 = Si-Ré-Fa-Lab.",xp:55},
  {id:"q-logic-09",courseId:"harmony",lessonId:"harm-c3-02",lvl:3,q:"Lequel de ces accords ne contient aucun triton ?",o:["Cmaj7","G7","Bm7♭5","Bdim7"],a:0,exp:"G7 et Bm7♭5 contiennent Si-Fa, Bdim7 en contient deux (Si-Fa et Ré-La♭). Cmaj7 (Do Mi Sol Si) n'en a aucun : c'est un accord de repos, alors que le triton d'une dominante demande à se résoudre.",xp:65},
  {id:"q-fret-harm-03",type:"fretboard",courseId:"harmony",lessonId:"harm-c3-02",lvl:3,q:"Trouve toutes les notes de Am7 (La Do Mi Sol)",concept:{type:"find_chord",root:"A",quality:"min7"},selectionRules:{mode:"all"},display:{showNotes:false},hint:"Am7 = Am + Sol (7e mineure). 4 notes sur tout le manche.",xp:55,exp:"Am7 : La-Do-Mi-Sol. La 7e mineure Sol est la couleur funk/jazz."},
  {id:"q-fret-harm-04",type:"fretboard",courseId:"harmony",lessonId:"harm-c3-02",lvl:3,q:"Trouve toutes les notes de G7 (Sol Si Ré Fa)",concept:{type:"find_chord",root:"G",quality:"dom7"},selectionRules:{mode:"all"},display:{showNotes:false},hint:"G7 : guide tones = Si (3e) et Fa (7e mineure).",xp:55,exp:"G7 : Sol-Si-Ré-Fa. Si et Fa sont les guide tones qui définissent la tension dominante."},
  {id:"q-fret-harm-05",type:"fretboard",courseId:"harmony",lessonId:"harm-c3-02",lvl:3,q:"Trouve toutes les notes de Cmaj7 (Do Mi Sol Si)",concept:{type:"find_chord",root:"C",quality:"maj7"},selectionRules:{mode:"all"},display:{showNotes:false},hint:"Cmaj7 : guide tones = Mi (3e) et Si (7e majeure).",xp:60,exp:"Cmaj7 : Do-Mi-Sol-Si. La 7e majeure Si (vs Sib de C7) donne la couleur douce."},
];
