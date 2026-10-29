// Leçon du module « harmony » + les questions de quiz qui s'y rattachent.
// Format « leçon en cartes » décrit dans src/content/README.md.

const DOUZE_TRIADES = {
  type: "degree_chart",
  caption: "Les 12 triades majeures — vert : groupe 1, ambre : groupe 2, corail : groupe 3",
  data: {
    boxes: [
      { top: "Do",  label: "Do – Mi – Sol",     sub: "0 alt.", tint: "green" },
      { top: "Sol", label: "Sol – Si – Ré",      sub: "1#",     tint: "green" },
      { top: "Fa",  label: "Fa – La – Do",       sub: "1♭",     tint: "green" },
      { top: "Ré",  label: "Ré – Fa# – La",      sub: "2#",     tint: "amber" },
      { top: "La",  label: "La – Do# – Mi",      sub: "3#",     tint: "amber" },
      { top: "Mi",  label: "Mi – Sol# – Si",     sub: "4#",     tint: "amber" },
      { top: "Sib", label: "Sib – Ré – Fa",      sub: "2♭",     tint: "amber" },
      { top: "Mib", label: "Mib – Sol – Sib",    sub: "3♭",     tint: "amber" },
      { top: "Si",  label: "Si – Ré# – Fa#",     sub: "5#",     tint: "coral" },
      { top: "Fa#", label: "Fa# – La# – Do#",    sub: "6#",     tint: "coral" },
      { top: "Do#", label: "Do# – Mi# – Sol#",  sub: "7#",     tint: "coral" },
      { top: "Sol#",label: "Sol# – Si# – Ré#",  sub: "= Lab (4♭)",     tint: "coral" },
    ],
  },
};

export default {
  id: "harm-c2-03", level: 6,
  title: "Les 12 triades majeures — mémorisation",
  duration: 7,
  gropiTip: "Retiens par familles : Do, Fa et Sol ont leurs trois notes naturelles ; Ré, Mi et La n'ont que leur tierce diésée (Fa#, Sol#, Do#). Six triades en une seule phrase.",
  cartes: [
    { type: "idee", titre: "12 triades, 3 groupes", texte: [
      "12 notes, donc 12 triades majeures. Tout apprendre d'un coup décourage : on les range en trois groupes, du plus simple au plus altéré.",
      "Sous chaque triade, l'armure de sa tonalité, qui suit le cycle des quintes.",
    ], bloc: DOUZE_TRIADES },
    { type: "idee", titre: "Groupe 1 : Do, Sol, Fa", texte: [
      "Do : Do-Mi-Sol. Sol : Sol-Si-Ré. Fa : Fa-La-Do.",
      "Trois triades sans aucune altération, et trois accords que tu joues déjà en position ouverte. Commence par elles.",
    ] },
    { type: "question", quizId: "q-harm-p6-c203-01" },
    { type: "idee", titre: "Groupe 2 : les tonalités courantes", texte: [
      "Ré : Ré-Fa#-La. La : La-Do#-Mi. Mi : Mi-Sol#-Si. Seule la tierce est diésée.",
      "Si♭ : Si♭-Ré-Fa. Mi♭ : Mi♭-Sol-Si♭. Ce groupe couvre l'essentiel de la pop et du rock.",
    ] },
    { type: "question", quizId: "q-harm-26-app" },
    { type: "idee", titre: "Groupe 3 : les plus altérées", texte: [
      "Si : Si-Ré#-Fa#. Fa# : Fa#-La#-Do#. Do# : Do#-Mi#-Sol#. Sol# : Sol#-Si#-Ré#.",
      "Mi# sonne comme Fa, Si# comme Do. Mais une tierce porte toujours le nom situé deux lettres plus loin : Do → Mi, Sol → Si.",
    ] },
    { type: "question", quizId: "q-harm-27" },
    { type: "a-toi", titre: "Nomme les notes sous tes doigts",
      consigne: "Plaque Ré et nomme chaque corde : Ré à vide, La (corde 3 case 2), Ré (corde 2 case 3), Fa# (corde 1 case 2). Trois notes, la triade. Fais de même avec La et Mi, puis change d'accord toutes les quatre mesures au clic.",
      bloc: { type: "chord_diagram", caption: "Ré majeur — xx0232 : Ré, La, Ré, Fa#", data: { name: "D", frets: [-1, -1, 0, 2, 3, 2], fingers: [0, 0, 0, 1, 3, 2], startFret: 1 } },
      bpm: 60 },
    { type: "question", quizId: "q-harm-57" },
    { type: "recap", points: [
      "Triade majeure = fondamentale, tierce majeure, quinte juste.",
      "Do, Sol, Fa : sans altération ; Ré, La, Mi : tierce diésée.",
      "La tierce est toujours deux lettres plus loin : Do# → Mi#, pas Fa.",
    ] },
  ],
  quiz: ["q-harm-26", "q-harm-27", "q-harm-57", "q-harm-p6-c203-01", "q-harm-26-app"],
};

export const quiz = [
  {id:"q-harm-26",courseId:"harmony",lessonId:"harm-c2-03",lvl:1,q:"Quelles sont les notes de la triade de Ré majeur ?",o:["Ré-Fa-La", "Ré-Fa#-La", "Ré-Fa#-La#", "Ré-Sol-La"],a:1,exp:"Triade majeure = fondamentale, tierce majeure, quinte juste : Ré, Fa#, La.",xp:30},
  {id:"q-harm-26-app",courseId:"harmony",lessonId:"harm-c2-03",lvl:1,q:"Tu connais Ré majeur. Quelles sont les notes de la triade de Ré mineur ?",o:["Ré-Fa-La","Ré-Fa#-La","Ré-Fa-La♭","Ré-Mi-La"],a:0,exp:"Mineur = 1-♭3-5 : on baisse la tierce d'un demi-ton. Ré-Fa#-La devient Ré-Fa-La.",xp:25},
  {id:"q-harm-27",courseId:"harmony",lessonId:"harm-c2-03",lvl:2,q:"Pourquoi la tierce de Do# majeur s'écrit-elle Mi# et non Fa ?",o:["Parce que Fa n'existe pas en Do#", "Pour éviter d'écrire un bémol dans l'accord", "Parce qu'une tierce est deux lettres plus loin", "Parce que Mi# sonne plus aigu que Fa"],a:2,exp:"Une tierce est deux lettres plus loin : Do → Mi. Élevé d'un demi-ton, c'est Mi#, qui sonne comme Fa.",xp:40},
  {id:"q-harm-57",courseId:"harmony",lessonId:"harm-c2-03",lvl:2,q:"Quelles sont les notes de la triade de Mi♭ majeur ?",o:["Mi♭ - Sol - Si♭","Mi♭ - Sol♭ - Si♭","Mi♭ - Sol - Si","Mi♭ - La♭ - Si♭"],a:0,exp:"Tierce majeure au-dessus de Mi♭ : Sol (4 demi-tons). Quinte juste : Si♭ (7 demi-tons). Mi♭ - Sol♭ - Si♭ serait Mi♭ mineur.",xp:40},
  {id:"q-harm-p6-c203-01",courseId:"harmony",lessonId:"harm-c2-03",lvl:1,q:"Laquelle de ces triades majeures ne contient aucune altération ?",o:["Fa majeur","Ré majeur","Mi majeur","La majeur"],a:0,exp:"Fa majeur = Fa, La, Do : trois notes naturelles. Ré, Mi et La majeurs ont chacun une tierce diésée (Fa#, Sol#, Do#).",xp:30},
];
