// Leçon du module « harmony » + les questions de quiz qui s'y rattachent.
// Format « leçon en cartes » décrit dans src/content/README.md.

export default {
  id: "harm-c4-01", level: 9,
  title: "La 9e, la 11e, la 13e : les extensions",
  duration: 9,
  gropiTip: "Pour nommer une extension, ajoute 7 au degré : 2 + 7 = 9, 4 + 7 = 11, 6 + 7 = 13. Sur Do, la 9e est donc Ré, la 11e Fa et la 13e La.",
  cartes: [
    { type: "idee", titre: "Au-delà de la 7e", texte: [
      "Continue d'empiler des tierces après la 7e : tu obtiens la 9e, la 11e et la 13e. Ce sont les extensions.",
      "9e = 2e à l'octave, 11e = 4e, 13e = 6e. Elles colorent l'accord sans changer sa fonction.",
    ] },
    { type: "question", quizId: "q-harm-p89-c401-01" },
    { type: "idee", titre: "La 9e, la plus facile", texte: [
      "Cmaj9 = Do Mi Sol Si Ré, lumineux. Dm9 = Ré Fa La Do Mi, doux. G9 = Sol Si Ré Fa La, bluesy.",
      "La 9e se pose sur presque tous les accords sans les déranger.",
    ], bloc: {
      type: "chord_diagram",
      caption: "Am9 — Am7 + 9e (Si) : × 0 5 5 0 0 = La Sol Do Si Mi. Doux, chaleureux, néo-soul",
      data: { name: "Am9", frets: [-1,0,5,5,0,0], fingers: [0,0,1,2,0,0], startFret: 4 },
    } },
    { type: "idee", titre: "La 11e, délicate", texte: [
      "Sur un accord majeur, la 11 naturelle tombe un demi-ton au-dessus de la 3e : elle frotte. On la hausse d'un demi-ton : Cmaj7#11 = Do Mi Sol Si Fa#, une couleur lydienne.",
      "Sur un m7, la 11 passe sans problème : Dm11 = Ré Fa La Do Mi Sol.",
    ] },
    { type: "idee", titre: "La 13e et les choix", texte: [
      "G13 complet compte sept notes : injouable. On garde la fondamentale, la 3e, la 7e, puis l'extension voulue.",
      "On sacrifie d'abord la quinte, puis la 9e et la 11e.",
    ] },
    { type: "question", quizId: "q-harm-23" },
    { type: "idee", titre: "Les extensions altérées", texte: [
      "Sur une dominante, on altère : ♭9, #9, #11, ♭13.",
      "Le 7#9, l'accord de « Purple Haze » de Jimi Hendrix, fait sonner la 3e majeure et la #9, qui sonne comme une 3e mineure : majeur et mineur à la fois.",
    ] },
    { type: "question", quizId: "q-harm-p89-c401-02" },
    { type: "a-toi", titre: "Ajoute la 9e",
      consigne: "Alterne Am7 (x02010) et Am9 (x05500), quatre temps chacun au clic : écoute le Si qui s'ajoute. Puis G (320003) contre Gmaj9 (300002) : le La de la 9e, sur la corde 5, et le Fa# sur la corde 1. Termine par Am9 - Gmaj9 en boucle.",
      bloc: {
        type: "chord_diagram",
        caption: "Gmaj9 — Gmaj7 + 9e (La) : lumineux, jazz/bossa",
        data: { name: "Gmaj9", frets: [3,0,0,0,0,2], fingers: [2,0,0,0,0,1], startFret: 1 },
      }, bpm: 70, minuteur: 120 },
    { type: "recap", points: [
      "9e = 2e, 11e = 4e, 13e = 6e, une octave plus haut.",
      "Sur un accord majeur, préfère la #11 ; sur un m7, la 11 passe.",
      "À la guitare : fondamentale, 3e, 7e, puis l'extension. La quinte part en premier.",
    ] },
  ],
  quiz: ["q-harm-23","q-harm-13","q-harm-16","q-harm-p89-c401-01","q-harm-p89-c401-02"],
};

export const quiz = [
  {id:"q-harm-23",courseId:"harmony",lessonId:"harm-c4-01",lvl:3,q:"Dans le voicing pratique de G13 à quatre notes, lesquelles garde-t-on ?",o:["Sol, Si, Fa, Mi","Sol, Ré, La, Do","Sol, Si, Ré, Mi","Si, Ré, Fa, La"],a:0,exp:"G13 complet = Sol Si Ré Fa La Do Mi : sept notes, injouables telles quelles. On garde la fondamentale (Sol), la tierce (Si), la 7e (Fa) et la 13e (Mi), et on omet quinte, 9e et 11e. Sol Si Ré Mi, sans 7e, serait un simple G6.",xp:60},
  {id:"q-harm-p89-c401-01",courseId:"harmony",lessonId:"harm-c4-01",lvl:2,q:"Quelle note est la 9e de Gmaj9 ?",o:["La","Do","Mi","Fa#"],a:0,exp:"La 9e est la 2e une octave plus haut : sur Sol, c'est La. Do serait la 11e, Mi la 13e, et Fa# est la 7e majeure de l'accord.",xp:35},
  {id:"q-harm-p89-c401-02",courseId:"harmony",lessonId:"harm-c4-01",lvl:3,q:"Sur Cmaj7, quelle note donne une couleur de 11e sans frotter contre le Mi ?",o:["Fa#","Fa","Sol","Mi♭"],a:0,exp:"Fa, la 11 naturelle, est collé un demi-ton au-dessus du Mi : il frotte. Fa#, la #11, est à un ton du Mi : la couleur lydienne, sans friction. Sol est la quinte, et Mi♭ entrerait en conflit avec la tierce majeure.",xp:50},
];
