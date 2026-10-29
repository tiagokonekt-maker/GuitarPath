// Leçon du module « scales » + les questions de quiz qui s'y rattachent.
// Format « leçon en cartes » décrit dans src/content/README.md.

const SOL_POSITION_1 = {
  type: "scale_pattern",
  caption: "Sol majeur pos. 1 — fondamentale case 3, corde 6. Formule T-T-DT-T-T-T-DT",
  data: {
    startFret: 1, endFret: 5,
    rootColor: "green", noteColor: "primary",
    strings: [
      { frets: [3, 5], root: [3] },
      { frets: [2, 3, 5], root: [] },
      { frets: [2, 4, 5], root: [] },
      { frets: [2, 4], root: [] },
      { frets: [1, 3, 5], root: [] },
      { frets: [3, 5], root: [3] },
    ],
    noteMap: {
      "3,0":"Sol","5,0":"La",
      "2,1":"Si","3,1":"Do","5,1":"Ré",
      "2,2":"Mi","4,2":"Fa#","5,2":"Sol",
      "2,3":"La","4,3":"Si",
      "1,4":"Do","3,4":"Ré","5,4":"Mi",
      "3,5":"Sol","5,5":"La",
    }
  },
};

export default {
  id: "scales-c2-02", level: 5,
  title: "La gamme majeure : la matrice de tout",
  duration: 8,
  gropiTip: "Moyen mnémotechnique : la gamme majeure, c'est deux blocs T-T-DT séparés par un ton. Do-Ré-Mi-Fa, puis Sol-La-Si-Do. Retiens un bloc de 4 notes, tu as la gamme.",
  cartes: [
    { type: "idee", titre: "La formule", texte: [
      "Ton, ton, demi-ton, ton, ton, ton, demi-ton : T-T-DT-T-T-T-DT. Depuis n'importe quelle note, cette formule donne une gamme majeure.",
      "C'est la gamme de référence : on en déduit les modes et l'harmonie des accords.",
    ] },
    { type: "question", quizId: "q-scales-01-app" },
    { type: "idee", titre: "Do majeur, sans altération", texte: [
      "Depuis Do : un ton, Ré ; un ton, Mi ; un demi-ton, Fa. Puis Sol, La, Si, et un demi-ton pour retomber sur Do.",
      "Les sept notes naturelles, pas un dièse ni un bémol : c'est pour ça que Do majeur sert de modèle.",
    ] },
    { type: "idee", titre: "Les deux demi-tons", texte: [
      "Ils tombent entre les degrés 3 et 4, puis 7 et 8 : Mi-Fa et Si-Do en Do majeur.",
      "Ces petits pas, surtout Si qui tire vers Do, donnent au majeur son caractère lumineux et conclusif.",
    ] },
    { type: "question", quizId: "q-scales-56" },
    { type: "idee", titre: "Et depuis Sol ?", texte: [
      "Depuis Sol : La, Si, demi-ton vers Do, puis Ré, Mi… et un ton après Mi.",
      "Attention : de Mi à Fa, il n'y a qu'un demi-ton. À toi de trouver la note.",
    ] },
    { type: "question", quizId: "q-scales-55" },
    { type: "idee", titre: "Douze gammes majeures", texte: [
      "Une par note. Plus on s'éloigne de Do, plus il y a d'altérations : Sol a 1 dièse, Ré 2, La 3, Mi 4. Côté bémols : Fa en a 1, Si♭ 2, Mi♭ 3.",
      "Cet ordre suit le cycle des quintes, qu'on retrouvera bientôt.",
    ] },
    { type: "a-toi", titre: "Sol majeur sous les doigts",
      consigne: "Pose la fondamentale, Sol (corde 6 case 3). Monte la gamme note par note au clic, un doigt par case, en nommant chaque note, puis redescends. Le Fa# de la corde 4 fait toute la différence avec Do majeur.",
      bloc: SOL_POSITION_1, bpm: 60, minuteur: 120 },
    { type: "recap", points: [
      "Gamme majeure : T-T-DT-T-T-T-DT, depuis n'importe quelle note.",
      "Demi-tons entre les degrés 3-4 et 7-8 : Mi-Fa et Si-Do en Do.",
      "Do majeur n'a aucune altération ; Sol majeur a un dièse, Fa#.",
    ] },
  ],
  quiz: ["q-scales-01","q-scales-55","q-scales-56", "q-scales-01-app"],
};

export const quiz = [
  {id:"q-scales-01",courseId:"scales",lessonId:"scales-c2-02",lvl:1,q:"La formule en tons et demi-tons de la gamme majeure est…",o:["T-DT-T-T-DT-T-T","T-T-DT-T-T-T-DT","T-T-T-DT-T-T-DT","DT-T-T-T-DT-T-T"],a:1,exp:"T-T-DT-T-T-T-DT. Demi-tons entre 3-4 et 7-8. Cette structure asymétrique crée le 'son majeur' (sensation de luminosité, attraction du Si vers le Do).",xp:30},
  {id:"q-scales-01-app",courseId:"scales",lessonId:"scales-c2-02",lvl:1,q:"Applique la formule de la gamme majeure depuis Ré : quelle est la 7e note ?",o:["Do#","Do","Si","La#"],a:0,exp:"Ré, Mi, Fa#, Sol, La, Si, Do#, Ré : après Si, un ton entier mène à Do#, puis le demi-ton final ramène à Ré.",xp:25},
  {id:"q-scales-55",courseId:"scales",lessonId:"scales-c2-02",lvl:1,q:"En construisant Sol majeur avec la formule, quelle note altérée apparaît ?",o:["Fa#","Do#","Si♭","Sol#"],a:0,exp:"Sol La Si Do Ré Mi, puis un ton après Mi : Fa#, et le demi-ton final ramène à Sol. Sol majeur a un seul dièse, Fa#.",xp:30},
  {id:"q-scales-56",courseId:"scales",lessonId:"scales-c2-02",lvl:2,q:"Dans la gamme majeure, entre quels degrés tombent les deux demi-tons ?",o:["3-4 et 7-8","2-3 et 6-7","1-2 et 5-6","4-5 et 7-8"],a:0,exp:"T-T-DT-T-T-T-DT : le premier demi-ton arrive après deux tons (degrés 3-4), le second à la fin (7-8). En Do : Mi-Fa et Si-Do.",xp:40},
];
