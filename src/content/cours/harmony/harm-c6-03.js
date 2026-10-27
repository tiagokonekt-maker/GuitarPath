// Leçon du module « harmony » + les questions de quiz qui s'y rattachent.
// Format « leçon en cartes » décrit dans src/content/README.md.

const CMAJ7 = {
  type: "chord_diagram",
  caption: "Cmaj7 — I, résolution (× 3 2 0 0 0)",
  data: { name: "Cmaj7 (I)", frets: [-1,3,2,0,0,0], fingers: [0,3,2,0,0,0], startFret: 1 },
};

export default {
  id: "harm-c6-03", level: 8,
  title: "ii-V-I : le moteur du jazz",
  duration: 10,
  gropiTip: "Chasse aux ii-V cachés : dès qu'un accord m7 est suivi d'un accord 7 dont la fondamentale est une quarte plus haut (Am7-D7, Em7-A7), tu en tiens un. Entoure-les sur tes grilles.",
  cartes: [
    { type: "idee", titre: "La cellule du jazz", texte: [
      "Dm7, G7, Cmaj7 : le ii, le V et le I de Do majeur. Le ii prépare, le V tend, le I résout.",
      "Ce que I-IV-V est au blues, ii-V-I l'est au jazz : la plupart des standards en enchaînent, souvent dans plusieurs tonalités d'affilée.",
    ], bloc: {
      type: "chord_diagram",
      caption: "Dm7 — ii de Do majeur (× × 0 2 1 1)",
      data: { name: "Dm7 (ii)", frets: [-1,-1,0,2,1,1], fingers: [0,0,0,2,1,1], startFret: 1 },
    } },
    { type: "idee", titre: "Presque rien ne bouge", texte: [
      "De Dm7 à G7, le Do (7e de Dm7) descend d'un demi-ton sur Si, la 3e de G7. Le Fa, lui, reste.",
      "De G7 à Cmaj7, même économie : la 3e et la 7e de G7 avancent chacune d'un demi-ton vers une note de Cmaj7.",
    ], bloc: {
      type: "chord_diagram",
      caption: "G7 — V de Do majeur, tension (3 2 0 0 0 1)",
      data: { name: "G7 (V)", frets: [3,2,0,0,0,1], fingers: [3,2,0,0,0,1], startFret: 1 },
    } },
    { type: "question", quizId: "q-impro-03" },
    { type: "idee", titre: "La basse", texte: [
      "Ré, Sol, Do : chaque fondamentale descend d'une quinte, ou monte d'une quarte. C'est le mouvement de basse le plus attractif de la musique tonale.",
      "Pour trouver un ii-V-I dans n'importe quelle tonalité : pars du I, remonte d'une quinte pour le V, puis encore d'une quinte pour le ii.",
    ] },
    { type: "question", quizId: "q-harm-16" },
    { type: "idee", titre: "En mineur", texte: [
      "En La mineur : Bm7♭5, E7, Am7. Le ii devient demi-diminué.",
      "Le V devient une dominante (E7 plutôt que Em7) : son Sol#, emprunté à la mineure harmonique, tire vers La et rend la résolution aussi forte qu'en majeur.",
    ] },
    { type: "question", quizId: "q-logic-05" },
    { type: "a-toi", titre: "Boucle ii-V-I",
      consigne: "Dm7, G7, Cmaj7, Cmaj7 : quatre temps par accord au clic. Tour 1 : les accords seuls. Ensuite, improvise en Do majeur et vise une note par accord au temps 1 : Fa sur Dm7, Si sur G7, Mi sur Cmaj7. Les mêmes sept notes, mais la grille s'entend.",
      bloc: CMAJ7, bpm: 70, minuteur: 180 },
    { type: "question", quizId: "q-harm-17" },
    { type: "recap", points: [
      "ii-V-I : le ii prépare, le V tend, le I résout (Dm7 - G7 - Cmaj7 en Do).",
      "La basse descend de quinte en quinte ; les guide tones bougent par demi-tons.",
      "En mineur : ii demi-diminué et V dominante (Bm7♭5 - E7 - Am7 en La mineur).",
    ] },
  ],
  quiz: ["q-harm-16","q-harm-17","q-impro-03","q-logic-05","q-fret-harm-07","q-harm-19","q-harm-20","q-harm-21"],
};

export const quiz = [
  {id:"q-harm-16",courseId:"harmony",lessonId:"harm-c6-03",lvl:2,q:"En La majeur, le ii-V-I est…",o:["Bm-E-A","Cm7-F7-Bbmaj7","Em7-A7-Dmaj7","Bm7-E7-Amaj7"],a:3,exp:"En La majeur : ii=Si mineur, V=Mi (majeur), I=La. En accords 7 : Bm7-E7-Amaj7. Cellule fondamentale du jazz dans cette tonalité.",xp:45},
  {id:"q-harm-17",courseId:"harmony",lessonId:"harm-c6-03",lvl:3,q:"Pourquoi le ii-V-I sonne 'résolu' ?",o:["La basse descend de quinte en quinte","Une coïncidence historique, rien de plus","Le tempo accélère avant l'accord final","Toutes les notes montent vers l'aigu"],a:0,exp:"La basse descend de quinte en quinte (Ré → Sol → Do, soit une quarte vers le haut à chaque fois), et les guide tones avancent par demi-tons : Do → Si et Fa reste (ii → V), puis Fa → Mi et Si reste (V → I). Double mouvement, résolution très forte.",xp:55},
  {id:"q-impro-03",courseId:"impro",lessonId:"harm-c6-03",lvl:3,q:"Dans Dm7 - G7 - Cmaj7, quelle note de G7 rejoint le Mi de Cmaj7 par un simple demi-ton ?",o:["Fa","Ré","Sol","Si"],a:0,exp:"Le Fa, 7e de G7, descend d'un demi-ton sur Mi, la tierce de Cmaj7. Ré monte d'un ton entier, Sol saute d'une tierce, et Si monte plutôt sur Do. Viser ce Fa → Mi fait entendre la résolution, même en jouant Do majeur sur toute la grille.",xp:60},
  {id:"q-logic-05",courseId:"harmony",lessonId:"harm-c6-03",lvl:3,q:"En Mi mineur, quel est le ii-V-i ?",o:["F#m7♭5 - B7 - Em7","F#m7 - B7 - Em7","F#m7♭5 - Bm7 - Em7","Am7 - D7 - Em7"],a:0,exp:"En mineur, le ii est demi-diminué (F#m7♭5) et le V devient une dominante (B7, avec le Ré# de Mi mineure harmonique) pour résoudre fort sur Em7. C'est l'une des deux cellules d'« Autumn Leaves », en alternance avec le ii-V-I de Sol majeur.",xp:65},
  {id:"q-fret-harm-07",type:"fretboard",courseId:"harmony",lessonId:"harm-c6-03",lvl:3,q:"ii-V-I : trouve toutes les fondamentales Ré (ancres du ii)",concept:{type:"find_note",root:"D"},selectionRules:{mode:"all"},display:{showNotes:false},hint:"Ré est à vide sur la corde 4.",xp:50,exp:"Ré en : corde 6 case 10, corde 5 case 5, corde 4 à vide, corde 3 case 7, corde 2 case 3, corde 1 case 10. Ancres du ii dans le ii-V-I."},
];
