// Leçon du module « scales » + les questions de quiz qui s'y rattachent.
// Format « leçon en cartes » décrit dans src/content/README.md.

const DO_MAJ_LA_MIN = {
  type: "scale_pattern",
  caption: "Do pentatonique majeure = La pentatonique mineure — même forme, fondamentale différente",
  data: {
    startFret: 4, endFret: 9,
    rootColor: "green", noteColor: "primary", accentColor: "coral",
    strings: [
      { frets: [5, 8], root: [8] },
      { frets: [5, 7], root: [] },
      { frets: [5, 7], root: [] },
      { frets: [5, 7], root: [5] },
      { frets: [5, 8], root: [] },
      { frets: [5, 8], root: [8] },
    ],
    noteMap: {
      "5,0":"La","8,0":"Do",
      "5,1":"Ré","7,1":"Mi",
      "5,2":"Sol","7,2":"La",
      "5,3":"Do","7,3":"Ré",
      "5,4":"Mi","8,4":"Sol",
      "5,5":"La","8,5":"Do",
    },
  },
};

export default {
  id: "scales-c3-03", level: 6,
  title: "Pentatonique majeure et son lien avec la mineure",
  duration: 7,
  gropiTip: "Raccourci : pour une pentatonique majeure, place la forme mineure position 1 trois cases plus bas. Ré majeur (case 10 corde 6) ? Forme mineure case 7, et pose tes phrases sur Ré.",
  cartes: [
    { type: "idee", titre: "La sœur lumineuse", texte: [
      "Pentatonique majeure : 1 - 2 - 3 - 5 - 6. C'est la gamme majeure sans le 4 et le 7, ses notes les plus tendues. En Do : Do, Ré, Mi, Sol, La.",
      "Son caractère : joyeux, ouvert. On l'entend beaucoup en country, en folk, en gospel et en pop.",
    ] },
    { type: "question", quizId: "q-scales-06" },
    { type: "idee", titre: "Mêmes notes, autre maison", texte: [
      "Compare : Do pentatonique majeure = Do Ré Mi Sol La. La pentatonique mineure = La Do Ré Mi Sol.",
      "Les cinq mêmes notes ! Seule change la fondamentale, la note où l'on se pose. Ce sont des pentatoniques relatives.",
    ], bloc: DO_MAJ_LA_MIN },
    { type: "question", quizId: "q-scales-07" },
    { type: "idee", titre: "Trois demi-tons plus bas", texte: [
      "Toute pentatonique majeure a sa relative mineure 3 demi-tons plus bas : Do et La, Sol et Mi, Ré et Si, La et Fa#, Fa et Ré.",
      "Ce sont les mêmes paires que les tonalités relatives du cycle des quintes.",
    ] },
    { type: "idee", titre: "Tu la connais déjà", texte: [
      "Ta position 1 de La mineure, case 5, est aussi la pentatonique majeure de Do. Rien ne change sous les doigts.",
      "Sur un morceau en Do majeur, joue cette forme mais commence et termine tes phrases sur Do (case 8 corde 6). Le même dessin sonne majeur.",
    ] },
    { type: "question", quizId: "q-impro-21" },
    { type: "a-toi", titre: "Une forme, deux couleurs",
      consigne: "Au clic, monte et descends la forme en partant du Do (corde 6, case 8) et en finissant sur un Do. Puis rejoue-la en partant et finissant sur le La de la case 5. Écoute : mêmes notes, l'une sonne claire, l'autre sombre.",
      bloc: DO_MAJ_LA_MIN, bpm: 60 },
    { type: "question", quizId: "q-impro-05" },
    { type: "recap", points: [
      "Pentatonique majeure : 1 - 2 - 3 - 5 - 6 ; en Do, Do Ré Mi Sol La.",
      "Do pentatonique majeure = La pentatonique mineure : mêmes notes, autre repos.",
      "La relative mineure est 3 demi-tons sous la majeure : même forme, autre note d'arrivée.",
    ] },
  ],
  quiz: ["q-scales-06","q-scales-07","q-impro-04","q-impro-05","q-impro-21"],
};

export const quiz = [
  {id:"q-scales-06",courseId:"scales",lessonId:"scales-c3-03",lvl:2,q:"La pentatonique majeure de Sol contient quelles notes ?",o:["Sol-La-Do-Ré-Mi","Sol-Si-Do-Ré-Fa","Sol-La-Si-Ré-Mi","Sol-La-Si-Do-Ré"],a:2,exp:"Penta majeure = 1-2-3-5-6. Sol majeure = Sol-La-Si-Do-Ré-Mi-Fa#. Penta = retire 4 (Do) et 7 (Fa#). Donc Sol-La-Si-Ré-Mi.",xp:40},
  {id:"q-scales-07",courseId:"scales",lessonId:"scales-c3-03",lvl:2,q:"La pentatonique majeure de Do contient les MÊMES NOTES que la pentatonique mineure de…",o:["Mi","Sol","Ré","La"],a:3,exp:"Do penta maj = Do-Ré-Mi-Sol-La. La penta min = La-Do-Ré-Mi-Sol. Mêmes notes ! Relation de pentatoniques 'relatives' (la min = 6e degré de maj).",xp:50},
  {id:"q-impro-04",courseId:"impro",lessonId:"scales-c3-03",lvl:2,q:"En jouant La pentatonique mineure sur un Cmaj7, ça sonne…",o:["Juste : toutes ses notes vont","Faux : la plupart des notes frottent","Sombre : l'accord devient mineur","Vide : il manque la tierce"],a:0,exp:"La pentatonique mineure de La (La Do Ré Mi Sol) contient exactement les notes de Do pentatonique majeure. Sur Cmaj7, tout sonne juste, et le Fa, la note à éviter sur cet accord, en est absent.",xp:55},
  {id:"q-impro-05",courseId:"impro",lessonId:"scales-c3-03",lvl:3,q:"Une chanson country en Sol majeur. Quelle pentatonique mineure, déjà connue, te donne les notes de Sol pentatonique majeure ?",o:["Mi pentatonique mineure","Sol pentatonique mineure","Si pentatonique mineure","Ré pentatonique mineure"],a:0,exp:"Sol penta majeure = Sol La Si Ré Mi. Mi penta mineure = Mi Sol La Si Ré : les mêmes notes, car Mi est la relative mineure de Sol. Tu reprends la forme de Mi mineure et tu te poses sur Sol.",xp:60},
  {id:"q-impro-21",courseId:"impro",lessonId:"scales-c3-03",lvl:2,q:"Tu connais La pentatonique mineure en position 1 (case 5). Pour jouer Do pentatonique majeure, que fais-tu ?",o:["Même forme, repos sur Do","Même forme, 3 cases plus haut","Même forme, avec la ♭5 en plus","Nouvelle forme, 2 cases plus bas"],a:0,exp:"Do pentatonique majeure et La pentatonique mineure ont les mêmes cinq notes. Sous les doigts, rien ne change : c'est la note sur laquelle tu te poses (Do au lieu de La) qui fait entendre le majeur. Décaler la forme de 3 cases donnerait Do pentatonique mineure.",xp:30},
];
