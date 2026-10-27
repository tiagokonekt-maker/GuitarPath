// Leçon du module « impro » + les questions de quiz qui s'y rattachent.
// Format « leçon en cartes » décrit dans src/content/README.md.
// Tension et résolution, 1 sur 2 : approches chromatiques et enclosure.
// Suite : impro-03b (notes à éviter, tension de la dominante).

const APPROCHES_DO = {
  type: "tab",
  caption: "Trois arrivées sur Do (3e de Am) : par en dessous, par au-dessus, puis encadré",
  text: "Tab — corde 3 : Si (corde 3 case 4) puis Do (corde 3 case 5) ; Do# (corde 3 case 6) puis Do ; enfin Do#, Si, Do : l'enclosure. Chaque Do tombe sur un temps fort.",
  data: { lines: [
    "e|----------------|----------------|----------------|----------------|",
    "B|----------------|----------------|----------------|----------------|",
    "G|------------4---|5-----------6---|5-------6---4---|5---------------|",
    "D|----------------|----------------|----------------|----------------|",
    "A|----------------|----------------|----------------|----------------|",
    "E|----------------|----------------|----------------|----------------|",
  ] },
};

export default {
  id: "impro-03", level: 8,
  title: "Tension et résolution : les approches",
  duration: 8,
  gropiTip: "Une note d'approche ne se tient pas : joue Si ou Do# sur le contretemps, puis pose Do sur le temps fort. Si tu t'attardes sur l'approche, la tension sonne comme une fausse note.",
  cartes: [
    { type: "idee", titre: "Tendre, puis détendre", texte: [
      "Une note instable crée une attente ; la note stable qui suit la comble.",
      "Plus l'attente est nette, plus l'arrivée fait du bien. C'est le moteur de toute phrase.",
    ] },
    { type: "idee", titre: "L'approche chromatique", texte: [
      "Une note à un demi-ton de ta cible, jouée juste avant elle.",
      "Pour viser Do, la 3e de Am : Si par en dessous, Do# par au-dessus. L'oreille devine l'arrivée et la savoure.",
    ], bloc: { type: "fretboard_interactive", mode: "highlight", notes: ["C", "C#", "B"], caption: "Approches chromatiques de Do — Si (bas) et Do# (haut)", displayMode: "notes", lang: "fr", compact: true } },
    { type: "question", quizId: "q-impro-27" },
    { type: "idee", titre: "Courte, sur le contretemps", texte: [
      "L'approche passe vite, de préférence sur un temps faible ; la cible tombe sur le temps fort.",
      "Tenue sur le temps, la même note sonne fausse. Ce n'est pas la note qui compte, c'est où elle va.",
    ] },
    { type: "question", quizId: "q-impro-approche-lot4" },
    { type: "idee", titre: "L'enclosure", texte: [
      "Encadre la cible par ses deux voisines : au-dessus, en dessous, puis la cible. Pour Do : Do#, Si, Do.",
      "L'oreille tourne autour avant d'atterrir. C'est un geste typique du bebop.",
    ] },
    { type: "question", quizId: "q-impro-10" },
    { type: "a-toi", titre: "Trois arrivées sur Do",
      consigne: "Fais tourner un Lam (en boucle, ou la Jam en Blues mineur, tonalité La). Joue la tab : Si → Do, Do# → Do, puis l'enclosure, chaque Do sur un temps fort. Ensuite, improvise dans la pentatonique et glisse une approche avant chaque fin de phrase.",
      bloc: APPROCHES_DO, bpm: 70, minuteur: 180 },
    { type: "recap", points: [
      "Une approche est à un demi-ton de la cible, juste avant elle.",
      "L'approche passe sur un temps faible, la cible tombe sur le temps fort.",
      "L'enclosure encadre la cible : au-dessus, en dessous, puis la cible.",
    ] },
  ],
  quiz: ["q-impro-27","q-impro-approche-lot4","q-impro-10"],
};

export const quiz = [
  {id:"q-impro-27",courseId:"impro",lessonId:"impro-03",lvl:2,q:"Une note qui n'appartient pas à l'accord en cours est…",o:["Toujours une faute à éviter", "Réservée au répertoire jazz", "Utilisable si elle se résout ensuite", "À placer uniquement en toute fin de phrase"],a:2,exp:"Ce qui rend une note « fausse » n'est pas son choix mais son traitement. Posée et tenue, elle heurte ; traversée vers une note stable, elle crée le mouvement dont la phrase a besoin.",xp:30},
  {id:"q-impro-approche-lot4",courseId:"impro",lessonId:"impro-03",lvl:2,q:"Tu vises Mi au temps 1. Quelle note jouer juste avant, en approche chromatique par en dessous ?",o:["Ré#","Ré","Fa","Do"],a:0,exp:"Ré# (ou Mib) est un demi-ton sous Mi : c'est l'approche chromatique par en dessous. Ré est à un ton entier, Fa approche par au-dessus, et Do est une tierce plus bas.",xp:30},
];
