// Leçon du module « impro » + les questions de quiz qui s'y rattachent.
// Format « leçon en cartes » décrit dans src/content/README.md.
// Tension et résolution, 2 sur 2 : notes à éviter et tension de la
// dominante. Suite d'impro-03 (approches et enclosure) ; q-impro-28 vient
// de l'ancienne leçon impro-03, scindée en deux (lot 4).

const CADENCE = {
  type: "tab",
  caption: "G7 → Cmaj7 : Lab se pose sur Sol, puis Si et Fa se resserrent sur Do et Mi",
  text: "Tab — mesure 1 (G7) : Si (corde 3 case 4), Ré (corde 2 case 3), Fa (corde 2 case 6), Lab (corde 1 case 4). Mesure 2 (Cmaj7) : Sol (corde 1 case 3), tenu. Mesure 3 (G7) : Si et Fa ensemble. Mesure 4 (Cmaj7) : Do (corde 3 case 5) et Mi (corde 2 case 5) ensemble.",
  data: { lines: [
    "e|------------4---|3---------------|----------------|----------------|",
    "B|----3---6-------|----------------|6---------------|5---------------|",
    "G|4---------------|----------------|4---------------|5---------------|",
    "D|----------------|----------------|----------------|----------------|",
    "A|----------------|----------------|----------------|----------------|",
    "E|----------------|----------------|----------------|----------------|",
  ] },
};

export default {
  id: "impro-03b", level: 8,
  title: "Tension et résolution : notes à éviter et dominante",
  duration: 8,
  gropiTip: "Pose Si (corde 3 case 4) et Fa (corde 2 case 6) ensemble, puis ramène les deux doigts sur la case 5 : Do et Mi. Deux doigts qui se resserrent, c'est toute la cadence V-I.",
  cartes: [
    { type: "idee", titre: "Les notes à éviter", texte: [
      "Certaines notes de la gamme frottent trop si on les tient sur l'accord : les avoid notes.",
      "Sur Cmaj7, le Fa (degré 4) est un demi-ton au-dessus de Mi, la tierce. Pas interdit : en passage, vers Mi ou Sol, jamais tenu sur le temps fort.",
    ], bloc: { type: "fretboard_interactive", mode: "scale", root: "C", scale: "major", caption: "Do majeur sur Cmaj7 — Fa (4e, degré 4) est l'avoid note", displayMode: "degrees", lang: "fr", compact: true } },
    { type: "question", quizId: "q-impro-avoid-lot4" },
    { type: "idee", titre: "La dominante veut résoudre", texte: [
      "G7 contient Si et Fa. Vers Do, Si monte d'un demi-ton sur Do, Fa descend d'un demi-ton sur Mi.",
      "Ce double glissement est le moteur de la cadence V-I. Le viser dans un solo, c'est faire entendre la résolution.",
    ] },
    { type: "question", quizId: "q-impro-28" },
    { type: "idee", titre: "Plus de tension sur G7", texte: [
      "Sur la dominante, tu peux pousser encore : Lab, la ♭9, frotte un demi-ton au-dessus de Sol.",
      "Il descend se poser sur Sol, la quinte de Cmaj7. Sur G7 seulement : sur Cmaj7, il sonnerait faux.",
    ] },
    { type: "question", quizId: "q-impro-06" },
    { type: "a-toi", titre: "G7, Cmaj7 : résoudre",
      consigne: "Alterne G7 et Cmaj7, une mesure chacun (enregistre la boucle, ou lance la Jam en Jazz ii-V-I, tonalité Do). Joue la tab : Lab sur Sol, puis Si et Fa qui se resserrent sur Do et Mi. Ensuite, improvise en Do majeur : sur chaque Cmaj7, arrive sur Mi ou Do.",
      bloc: CADENCE, bpm: 70, minuteur: 180 },
    { type: "recap", points: [
      "Une note à éviter passe, elle ne se pose pas : Fa sur Cmaj7.",
      "Sur G7 → Do, Si monte sur Do et Fa descend sur Mi.",
      "La ♭9 (Lab) tend la dominante et se pose sur Sol.",
    ] },
  ],
  quiz: ["q-impro-avoid-lot4","q-impro-28","q-impro-06"],
};

export const quiz = [
  {id:"q-impro-28",courseId:"impro",lessonId:"impro-03b",lvl:3,q:"Sur Sol7 qui résout vers Do, vers quelle note le Si (tierce de Sol7) a-t-il tendance à monter ?",o:["Do","Ré","Si♭","La"],a:0,exp:"Le Si est la sensible de Do : un demi-ton sous la tonique, il monte naturellement sur Do. Avec le Fa (7e de Sol7) qui descend sur Mi, c'est ce double mouvement par demi-tons qui donne à la dominante sa force d'appel.",xp:40},
  {id:"q-impro-avoid-lot4",courseId:"impro",lessonId:"impro-03b",lvl:2,q:"Tu improvises en Do majeur sur un Cmaj7. Quelle note éviter de tenir sur un temps fort ?",o:["Fa","Mi","Sol","Si"],a:0,exp:"Fa, la quarte, est un demi-ton au-dessus de Mi, la tierce de l'accord : tenu, il brouille Cmaj7. Mi, Sol et Si font partie de l'accord. Le Fa reste utilisable en passage, vers Mi ou Sol.",xp:30},
];
