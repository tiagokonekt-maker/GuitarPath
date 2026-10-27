// Leçon du module « scales » + les questions de quiz qui s'y rattachent.
// Format « leçon en cartes » décrit dans src/content/README.md.

export default {
  id: "scales-c5-03", level: 8,
  title: "Phrygien — l'âme andalouse",
  duration: 9,
  gropiTip: "Fais le test sur la corde 1 : joue Mi-Fa-Mi (cases 0-1-0), puis Mi-Fa#-Mi (cases 0-2-0). Le premier sonne andalou, le second bien plus neutre : un seul demi-ton change tout.",
  cartes: [
    { type: "idee", titre: "Le 3e mode", texte: [
      "Do majeur joué depuis Mi : Mi, Fa, Sol, La, Si, Do, Ré. C'est Mi phrygien.",
      "Pour une oreille occidentale, c'est le plus « exotique » des modes : sombre, dramatique, aux couleurs espagnoles. On l'entend dans le flamenco comme dans le metal.",
    ] },
    { type: "idee", titre: "La seconde mineure", texte: [
      "Formule : 1-♭2-♭3-4-5-♭6-♭7. Face à la mineure naturelle, une seule différence : la seconde est mineure.",
      "Collée à un demi-ton de la fondamentale, cette note crée une tension forte qui retombe sur la tonique. Fais-la entendre sur un temps fort.",
    ], bloc: {
      type: "scale_pattern",
      caption: "Mi phrygien — case 0. Note caractéristique : Fa, la seconde mineure (case 1 c6, case 1 c1)",
      data: {
        startFret: 0, endFret: 4,
        rootColor: "coral", noteColor: "primary",
        strings: [
          { frets: [0, 1, 3], root: [0], accent: [1] },
          { frets: [0, 2, 3], root: [] },
          { frets: [0, 2], root: [] },
          { frets: [0, 2, 4], root: [] },
          { frets: [0, 1], root: [] },
          { frets: [0, 1, 3], root: [0], accent: [1] },
        ],
        noteMap: {
          "0,0":"Mi","1,0":"Fa","3,0":"Sol",
          "0,1":"La","2,1":"Si","3,1":"Do",
          "0,2":"Ré","2,2":"Mi",
          "0,3":"Sol","2,3":"La","4,3":"Si",
          "0,4":"Si","1,4":"Do",
          "0,5":"Mi","1,5":"Fa","3,5":"Sol",
        }
      },
    } },
    { type: "question", quizId: "q-scales-p89-c503-01" },
    { type: "idee", titre: "La cadence andalouse", texte: [
      "Lam – Sol – Fa – Mi : la boucle du flamenco. Elle se repose sur Mi, avec les notes de Do majeur : c'est du Mi phrygien.",
      "Le Fa → Mi des basses, à la fin, fait entendre la seconde mineure qui se résout.",
    ] },
    { type: "idee", titre: "Le phrygien dominant", texte: [
      "Sur l'accord final, souvent Mi majeur, la tierce monte : Mi, Fa, Sol#, La, Si, Do, Ré. C'est le phrygien dominant, la couleur du flamenco, du klezmer et de bien des musiques du Moyen-Orient.",
      "Il ne vient pas de la gamme majeure, mais de la mineure harmonique, au palier suivant.",
    ] },
    { type: "question", quizId: "q-scales-18" },
    { type: "a-toi", titre: "Fa qui retombe sur Mi",
      consigne: "Fais tourner Am, G, F, E, une mesure chacun, au clic à 70 : enregistre-toi ou utilise une boucle. Sur le Mi, joue la tab : elle descend de Fa à Fa et fait deux fois retomber Fa sur Mi. Puis improvise en position ouverte, en finissant tes phrases par Fa → Mi.",
      bloc: {
        type: "tab",
        caption: "Mi phrygien en position ouverte : la seconde mineure Fa retombe sur Mi",
        text: "Tab — corde 1 cases 1 et 0 (Fa, Mi), corde 2 cases 3, 1, 0 (Ré, Do, Si), corde 3 case 2 (La), corde 4 cases 3 et 2 (Fa, Mi).",
        data: { lines: [
          "e|-1--0--------------------|",
          "B|-------3--1--0-----------|",
          "G|----------------2--------|",
          "D|-------------------3--2--|",
          "A|-------------------------|",
          "E|-------------------------|",
        ] },
      }, bpm: 70, minuteur: 150 },
    { type: "question", quizId: "q-scales-61" },
    { type: "recap", points: [
      "Phrygien = 1-♭2-♭3-4-5-♭6-♭7 ; Mi phrygien = notes de Do majeur depuis Mi.",
      "Sa note caractéristique, la ♭2, retombe d'un demi-ton sur la fondamentale.",
      "Avec une tierce majeure, il devient phrygien dominant : la couleur flamenco.",
    ] },
  ],
  quiz: ["q-scales-18","q-scales-61","q-scales-62","q-scales-p89-c503-01"],
};

export const quiz = [
  {id:"q-scales-18",courseId:"scales",lessonId:"scales-c5-03",lvl:3,q:"Le mode phrygien dominant a quelle formule ?",o:["1-♭2-♭3-4-5-♭6-♭7","1-2-♭3-4-5-6-7","1-♭2-3-4-5-♭6-♭7","1-♭2-♭3-4-♭5-♭6-♭7"],a:2,exp:"Phrygien dominant = phrygien avec 3 majeure (au lieu de ♭3). Formule 1-♭2-3-4-5-♭6-♭7. Mode du flamenco authentique, du klezmer juif, et du Moyen-Orient.",xp:55},
  {id:"q-scales-61",courseId:"scales",lessonId:"scales-c5-03",lvl:3,q:"La cadence andalouse Lam - Sol - Fa - Mi se pose sur quel accord, donc dans quel mode ?",o:["Mi, en Mi phrygien","La, en La éolien","Fa, en Fa lydien","Sol, en Sol mixolydien"],a:0,exp:"La boucle s'arrête et se repose sur Mi : c'est lui la tonique. Les notes sont celles de Do majeur jouées depuis Mi : Mi phrygien. Le Fa → Mi final fait entendre la ♭2 caractéristique.",xp:50},
  {id:"q-scales-62",courseId:"scales",lessonId:"scales-c5-03",lvl:1,q:"En Mi phrygien, quelle note est la note caractéristique, la ♭2 ?",o:["Fa","Fa#","Ré","Sol"],a:0,exp:"Mi phrygien = Mi Fa Sol La Si Do Ré. Le Fa, à un demi-ton de la fondamentale, est sa signature. Avec Fa#, on retrouverait Mi éolien.",xp:30},
  {id:"q-scales-p89-c503-01",courseId:"scales",lessonId:"scales-c5-03",lvl:2,q:"Tu joues La phrygien. Quelle note est sa ♭2, à mettre en avant ?",o:["Si♭","Si","Do","Sol"],a:0,exp:"La ♭2 est à un demi-ton au-dessus de la fondamentale : La → Si♭. Si serait la seconde majeure (La éolien ou dorien), Do la tierce mineure, Sol la septième.",xp:40},
];
