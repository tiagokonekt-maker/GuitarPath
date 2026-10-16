// Leçon du module « scales » + les questions de quiz qui s'y rattachent.
// Format « leçon en cartes » décrit dans src/content/README.md.

const CHROMA = {
  type: "note_grid",
  caption: "Gamme chromatique sur corde 5 — 12 sons, case par case",
  data: {
    string: 5, stringName: "La", maxFret: 12,
    highlights: [
      { fret: 0,  label: "La",  color: "amber" },
      { fret: 1,  label: "La#", color: "neutral" },
      { fret: 2,  label: "Si",  color: "green" },
      { fret: 3,  label: "Do",  color: "primary" },
      { fret: 4,  label: "Do#", color: "neutral" },
      { fret: 5,  label: "Ré",  color: "amber" },
      { fret: 6,  label: "Ré#", color: "neutral" },
      { fret: 7,  label: "Mi",  color: "green" },
      { fret: 8,  label: "Fa",  color: "green" },
      { fret: 9,  label: "Fa#", color: "neutral" },
      { fret: 10, label: "Sol", color: "green" },
      { fret: 11, label: "Sol#",color: "neutral" },
      { fret: 12, label: "La",  color: "amber" },
    ],
  },
};

export default {
  id: "scales-c1-02", level: 2,
  title: "Les altérations : dièses et bémols",
  duration: 7,
  gropiTip: "Remonte la corde 6 case par case en nommant les notes avec des dièses, puis redescends en les nommant avec des bémols (Mi♭, Ré♭, Si♭...). Même case, autre nom.",
  cartes: [
    { type: "idee", titre: "Des notes entre les notes", texte: [
      "Entre certaines notes naturelles se glissent des notes intermédiaires, les altérations : ce sont les cases que tu sautes en jouant Do, Ré, Mi sur une corde.",
    ] },
    { type: "idee", titre: "Le dièse (#) : une case vers l'aigu", texte: [
      "Un dièse monte la note d'un demi-ton. Fa (corde 6, case 1) devient Fa# (corde 6, case 2).",
      "Tu en joues déjà un : dans ton accord de Ré, le majeur pose Fa# (corde 1, case 2).",
    ] },
    { type: "question", quizId: "q-base-10" },
    { type: "idee", titre: "Le bémol (♭) : une case vers le grave", texte: [
      "Un bémol baisse la note d'un demi-ton. Mi (corde 4, case 2) devient Mi♭ en case 1.",
      "Une même case peut porter deux noms : La# et Si♭ sonnent pareil. Dièse en montant, bémol en descendant, le plus souvent.",
    ] },
    { type: "question", quizId: "q-scales-50" },
    { type: "idee", titre: "Mi-Fa et Si-Do : rien entre les deux", texte: [
      "Entre Mi et Fa, et entre Si et Do, il n'y a pas de note intermédiaire : elles sont déjà à une case l'une de l'autre.",
      "Mi# sonnerait comme Fa, Fa♭ comme Mi : des noms qui existent sur le papier, tu verras pourquoi plus tard.",
    ] },
    { type: "idee", titre: "12 sons : la gamme chromatique", texte: [
      "7 notes naturelles + 5 altérations = 12 sons, puis l'octave. Monter case par case sur une corde, c'est jouer cette gamme chromatique.",
    ], bloc: CHROMA },
    { type: "question", quizId: "q-base-09" },
    { type: "a-toi", titre: "La chromatique sur la corde 5", consigne: "De La à vide jusqu'à la case 12, une case par clic, en nommant chaque note avec des dièses. Redescends avec des bémols : La♭, Sol♭… Repère Si-Do et Mi-Fa, collés.", bloc: CHROMA, bpm: 60 },
    { type: "recap", points: [
      "Dièse (#) = un demi-ton plus haut, une case vers l'aigu.",
      "Bémol (♭) = un demi-ton plus bas, une case vers le grave.",
      "Pas d'altération entre Mi-Fa ni entre Si-Do : 12 sons en tout.",
    ] },
  ],
  quiz: ["q-base-09","q-base-10","q-scales-50"],
};

export const quiz = [
  {id:"q-base-09",courseId:"scales",lessonId:"scales-c1-02",lvl:1,q:"Combien de sons différents existe-t-il avant que la boucle recommence à l'octave ?",o:["12","7","5","24"],a:0,exp:"7 notes naturelles plus 5 altérations donnent 12 sons — exactement les 12 cases d'une corde avant l'octave.",xp:30},
  {id:"q-base-10",courseId:"scales",lessonId:"scales-c1-02",lvl:1,q:"Un dièse (#) placé devant une note signifie…",o:["Un demi-ton plus bas","Un demi-ton plus haut","Un ton plus haut","Une octave plus haut"],a:1,exp:"Le dièse monte la note d'un demi-ton, le bémol la descend d'un demi-ton. Sur la guitare : une case dans un sens ou dans l'autre.",xp:30},
  {id:"q-scales-50",courseId:"scales",lessonId:"scales-c1-02",lvl:1,q:"Si est à la case 7 de la corde 6. Où joues-tu Si♭ sur cette corde ?",o:["Case 6","Case 8","Case 5","Case 9"],a:0,exp:"Le bémol abaisse la note d'un demi-ton, soit une case vers le grave : Si♭ est à la case 6. Case 8, ce serait Do.",xp:30},
];
