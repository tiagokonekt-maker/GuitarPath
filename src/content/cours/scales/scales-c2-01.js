// Leçon du module « scales » + les questions de quiz qui s'y rattachent.
// Format « leçon en cartes » décrit dans src/content/README.md.

const DO_CORDE_5 = { type: "note_grid", caption: "Do majeur sur la seule corde 5 : la formule T-T-DT-T-T-T-DT se lit dans les écarts (2-2-1-2-2-2-1 cases)", data: {string: 5, stringName: "La", maxFret: 15, highlights: [{fret: 3, label: "Do", color: "amber"}, {fret: 5, label: "Ré", color: "primary"}, {fret: 7, label: "Mi", color: "primary"}, {fret: 8, label: "Fa", color: "primary"}, {fret: 10, label: "Sol", color: "primary"}, {fret: 12, label: "La", color: "primary"}, {fret: 14, label: "Si", color: "primary"}, {fret: 15, label: "Do", color: "amber"}]} };

const DO_OUVERT = { type: "scale_pattern", caption: "Gamme de Do majeur — position ouverte : les mêmes 7 notes, réparties sur les 6 cordes", data: {startFret: 0, endFret: 3, rootColor: "amber", noteColor: "primary", strings: [{frets: [0,1,3], root: []}, {frets: [0,2,3], root: [3]}, {frets: [0,2,3], root: []}, {frets: [0,2], root: []}, {frets: [0,1,3], root: [1]}, {frets: [0,1,3], root: []}], noteMap: {"0,0":"Mi", "1,0":"Fa", "3,0":"Sol", "0,1":"La", "2,1":"Si", "3,1":"Do", "0,2":"Ré", "2,2":"Mi", "3,2":"Fa", "0,3":"Sol", "2,3":"La", "0,4":"Si", "1,4":"Do", "3,4":"Ré", "0,5":"Mi", "1,5":"Fa", "3,5":"Sol"}} };

const TAB_SOL_CORDE_6 = {
  type: "tab",
  caption: "Sol majeur sur la seule corde 6 : 2-2-1-2-2-2-1 cases",
  text: "Tab — corde 6 : cases 3, 5, 7, 8, 10, 12, 14, 15. Sol, La, Si, Do, Ré, Mi, Fa#, Sol.",
  data: { lines: [
    "e|-----------------------------|",
    "B|-----------------------------|",
    "G|-----------------------------|",
    "D|-----------------------------|",
    "A|-----------------------------|",
    "E|-3--5--7--8--10--12--14--15--|",
  ] },
};

export default {
  id: "scales-c2-01", level: 5,
  title: "Qu'est-ce qu'une gamme (vraiment) ?",
  duration: 7,
  gropiTip: "Applique la formule T-T-DT-T-T-T-DT sur la seule corde 5 depuis La à vide : cases 0, 2, 4, 5, 7, 9, 11, 12. Tu viens de construire La majeur sans connaître ses notes.",
  cartes: [
    { type: "idee", titre: "Un menu de notes", texte: [
      "Gamme majeure, mineure, pentatonique… Au fond, une gamme est une sélection ordonnée parmi les 12 sons disponibles : 5, 7 ou 8 notes qui vont bien ensemble.",
      "Moins de choix, mais une garantie : chaque note de la gamme colle avec la tonalité du morceau.",
    ] },
    { type: "idee", titre: "Trois ingrédients", texte: [
      "Une fondamentale, qui donne son nom à la gamme. Un nombre de notes : 5 pour une pentatonique, 7 pour la gamme majeure.",
      "Et une formule d'intervalles : T-T-DT-T-T-T-DT pour le majeur (T = ton, DT = demi-ton).",
    ] },
    { type: "question", quizId: "q-scales-28" },
    { type: "idee", titre: "La formule sur une corde", texte: [
      "Applique T-T-DT-T-T-T-DT depuis Do (corde 5 case 3) : 2 cases, 2, 1, 2, 2, 2, 1.",
      "Tu obtiens Do, Ré, Mi, Fa, Sol, La, Si, Do : les sept notes naturelles, sans un dièse.",
    ], bloc: DO_CORDE_5 },
    { type: "idee", titre: "Les mêmes notes, en position", texte: [
      "Sur une seule corde, la gamme s'étale sur douze cases. En position ouverte, les sept mêmes notes tiennent dans les trois premières cases, réparties sur les six cordes.",
    ], bloc: DO_OUVERT },
    { type: "question", quizId: "q-scales-54" },
    { type: "a-toi", titre: "Construis Sol majeur",
      consigne: "Sur la seule corde 6, depuis Sol (corde 6 case 3), applique la formule : 2, 2, 1, 2, 2, 2, 1 cases. Monte, puis redescends, au clic, en nommant les notes. La septième tombe sur Fa# : la formule l'impose.",
      bloc: TAB_SOL_CORDE_6, bpm: 60, minuteur: 120 },
    { type: "idee", titre: "Retiens la formule", texte: [
      "Majeure, mineures, pentatoniques, blues, modes : quelques familles suffisent pour presque tout jouer.",
      "Retiens chacune par sa formule, pas par ses notes. Tu la reconstruis alors depuis n'importe quelle fondamentale.",
    ] },
    { type: "question", quizId: "q-scales-29" },
    { type: "recap", points: [
      "Une gamme : une fondamentale, un nombre de notes, une formule d'intervalles.",
      "Gamme majeure : T-T-DT-T-T-T-DT, soit 2-2-1-2-2-2-1 cases sur une corde.",
      "Retiens la formule : elle reconstruit la gamme dans toute tonalité.",
    ] },
  ],
  quiz: ["q-scales-28", "q-scales-29", "q-scales-54"],
};

export const quiz = [
  {id:"q-scales-28",courseId:"scales",lessonId:"scales-c2-01",lvl:2,q:"Deux gammes partent de La et ont 7 notes chacune, mais ne sonnent pas pareil. Qu'est-ce qui les distingue ?",o:["Leur formule d'intervalles","Leur note fondamentale","Leur nombre de notes","Le tempo auquel on les joue"],a:0,exp:"Une gamme se définit par sa fondamentale, son nombre de notes et sa formule d'intervalles. Ici les deux premiers sont identiques : seule la formule (T-T-DT… ou T-DT-T…) change, et avec elle la couleur.",xp:40},
  {id:"q-scales-29",courseId:"scales",lessonId:"scales-c2-01",lvl:1,q:"Pourquoi mémoriser une gamme sous forme de formule (T-T-DT…) plutôt que de notes ?",o:["Pour la jouer plus vite", "Pour éviter d'avoir à lire les dièses", "Pour la reconstruire dans toute tonalité", "Pour ne jouer que sur une corde"],a:2,exp:"La formule ne dépend pas de la note de départ : appliquée depuis n'importe quelle fondamentale, elle redonne la gamme.",xp:30},
  {id:"q-scales-54",courseId:"scales",lessonId:"scales-c2-01",lvl:2,q:"Tu appliques la formule T-T-DT-T-T-T-DT en partant de Ré. Quelle est la troisième note ?",o:["Fa#","Fa","Sol","Mi"],a:0,exp:"Ré + un ton = Mi, Mi + un ton = Fa#. La formule impose un ton entier après Mi : Fa naturel ne serait qu'à un demi-ton. D'où Ré majeur : Ré Mi Fa# Sol La Si Do#.",xp:40},
];
