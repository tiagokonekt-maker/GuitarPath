// Leçon du module « impro » + les questions de quiz qui s'y rattachent.
// Format « leçon en cartes » décrit dans src/content/README.md.
// Vocabulaire, 2 sur 2 : couleurs jazz (9e, 11e, pentatonique sur la quinte).
// Suite d'impro-06 (licks blues), scindée en deux au lot 4. La substitution
// tritonique est laissée à harm-c7-02 (palier 9).

const LICK_MI_PENTA = {
  type: "tab",
  caption: "Sur Am7, un lick en Mi pentatonique mineure qui finit sur Si, la 9e",
  text: "Tab — Ré (corde 1 case 10), Si (corde 1 case 7), La (corde 2 case 10), Sol (corde 2 case 8), Mi (corde 3 case 9), Ré (corde 3 case 7), puis Si (corde 4 case 9), tenu avec vibrato.",
  data: { lines: [
    "e|-10-7-----------|----------------|",
    "B|------10-8------|----------------|",
    "G|-----------9-7--|----------------|",
    "D|----------------|9~~~------------|",
    "A|----------------|----------------|",
    "E|----------------|----------------|",
  ] },
};

export default {
  id: "impro-06b", level: 8,
  title: "Vocabulaire jazz : 9e, 11e et pentatonique décalée",
  duration: 8,
  gropiTip: "Sur un Lam7 qui sonne, joue Si (corde 1 case 7), puis La (corde 1 case 5) : la première flotte, la seconde conclut. Garde la 9 pour les phrases qui doivent relancer.",
  cartes: [
    { type: "idee", titre: "Au-delà de l'accord", texte: [
      "La 9e et la 11e colorent un accord sans le contredire. Sur Am7 : Si (9e) et Ré (11e).",
      "On les vise pour la couleur, pas pour conclure.",
    ] },
    { type: "idee", titre: "Finir sur la 9", texte: [
      "Sur Cmaj7, finir sur Ré, la 9e, laisse la phrase flotter : ni tension franche, ni repos complet.",
      "Un effet très présent en jazz et en bossa.",
    ] },
    { type: "question", quizId: "q-impro-15" },
    { type: "idee", titre: "La pentatonique de la quinte", texte: [
      "Sur Am7, joue Mi pentatonique mineure : Mi, Sol, La, Si, Ré, soit 5, ♭7, 1, 9 et 11 de l'accord.",
      "Le Do (♭3) disparaît, la 9e et la 11e arrivent : le son reste mineur, en plus ouvert.",
    ], bloc: { type: "fretboard_interactive", mode: "scale", root: "E", scale: "pentatonic_minor", caption: "Pentatonique mineure de Mi sur Am7 — la 9 et la 11 en couleur", displayMode: "notes", lang: "fr", compact: true } },
    { type: "question", quizId: "q-impro-subpenta-lot4-app" },
    { type: "idee", titre: "Le piège", texte: [
      "Do pentatonique majeure sur Am7 n'est pas une substitution : Do, Ré, Mi, Sol, La, ce sont exactement les notes de La pentatonique mineure.",
      "Même gamme, autre point de départ : rien de neuf pour l'oreille.",
    ] },
    { type: "question", quizId: "q-impro-piege-lot4" },
    { type: "a-toi", titre: "Am7 en couleurs",
      consigne: "Fais tourner Am7 (en boucle, ou la Jam en Modal Dorien, tonalité La). Une minute en La pentatonique mineure, puis la tab en Mi pentatonique mineure, qui finit sur la 9e. Laquelle sonne plus ouverte ? Puis improvise en passant de l'une à l'autre.",
      bloc: LICK_MI_PENTA, bpm: 70, minuteur: 180 },
    { type: "recap", points: [
      "La 9e et la 11e colorent sans conclure : finir sur la 9 laisse flotter.",
      "Sur un m7, la pentatonique mineure de sa quinte apporte la 9e et la 11e.",
      "La pentatonique majeure de la relative n'est pas une substitution : mêmes notes.",
    ] },
  ],
  quiz: ["q-impro-subpenta-lot4","q-impro-piege-lot4","q-impro-15","q-impro-11", "q-impro-subpenta-lot4-app"],
};

export const quiz = [
  {id:"q-impro-subpenta-lot4",courseId:"impro",lessonId:"impro-06b",lvl:3,q:"Sur Am7, tu remplaces La pentatonique mineure par Mi pentatonique mineure. Quelles couleurs gagnes-tu ?",o:["La 9e et la 11e","La 3e majeure et la 7e majeure","La ♭5 et la ♭9","Aucune, les notes sont identiques"],a:0,exp:"Mi penta mineure = Mi Sol La Si Ré : sur Am7, Si est la 9e et Ré la 11e. Le Do (♭3) disparaît, la couleur reste mineure mais s'ouvre. Ni tierce majeure, ni ♭5, ni ♭9 n'y figurent.",xp:45},
  {id:"q-impro-subpenta-lot4-app",courseId:"impro",lessonId:"impro-06b",lvl:3,q:"Sur Dm7, tu joues La pentatonique mineure, celle de la quinte. Quelles notes deviennent la 9e et la 11e ?",o:["Mi et Sol","Fa et La","Do et Mi","Si et Ré"],a:0,exp:"La penta mineure = La Do Ré Mi Sol. Sur Dm7 : La est la quinte, Do la ♭7, Ré la fondamentale, Mi la 9e et Sol la 11e. Fa (♭3) disparaît.",xp:40},
  {id:"q-impro-piege-lot4",courseId:"impro",lessonId:"impro-06b",lvl:3,q:"Pourquoi Do pentatonique majeure n'apporte-t-elle rien de neuf sur Am7 ?",o:["Elle a les notes de La penta mineure","Elle contient la tierce majeure de La","Elle n'a pas la 7e mineure de La","Elle sort de la tonalité de La mineur"],a:0,exp:"Do penta majeure = Do Ré Mi Sol La, les cinq notes de La penta mineure. C'est la même gamme vue depuis un autre point de départ : aucune couleur nouvelle. Elle contient bien Sol, la 7e de Am7, et pas de Do#.",xp:40},
];
