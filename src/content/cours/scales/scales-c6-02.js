// Leçon du module « scales » + les questions de quiz qui s'y rattachent.
// Format « leçon en cartes » décrit dans src/content/README.md.

export default {
  id: "scales-c6-02", level: 9,
  title: "La gamme mineure mélodique",
  duration: 9,
  gropiTip: "Pour la retenir : c'est la gamme majeure avec la tierce abaissée. La majeur (La-Si-Do#-Ré-Mi-Fa#-Sol#) devient La mineur mélodique dès que Do# redevient Do.",
  cartes: [
    { type: "idee", titre: "La 6 et la 7 remontent", texte: [
      "Pars de La mineur naturel et monte deux notes d'un demi-ton : la 6e et la 7e. Tu obtiens La, Si, Do, Ré, Mi, Fa#, Sol# : La mineur mélodique.",
      "Seule la tierce mineure, Do, la rend encore mineure.",
    ], bloc: {
      type: "scale_pattern",
      caption: "La mineure mélodique (jazz) — note clé : Fa# (6M) et Sol# (7M) vs éolien",
      data: {
        startFret: 4, endFret: 9,
        rootColor: "amber", noteColor: "primary",
        strings: [
          { frets: [5, 7, 8], root: [5] },
          { frets: [5, 7, 9], root: [] },
          { frets: [6, 7, 9], root: [7] },
          { frets: [5, 7, 9], root: [] },
          { frets: [5, 7, 9], root: [] },
          { frets: [5, 7, 8], root: [5] },
        ],
        noteMap: {
          "5,0":"La","7,0":"Si","8,0":"Do",
          "5,1":"Ré","7,1":"Mi","9,1":"Fa#",
          "6,2":"Sol#","7,2":"La","9,2":"Si",
          "5,3":"Do","7,3":"Ré","9,3":"Mi",
          "5,4":"Mi","7,4":"Fa#","9,4":"Sol#",
          "5,5":"La","7,5":"Si","8,5":"Do",
        }
      },
    } },
    { type: "idee", titre: "Deux versions", texte: [
      "En musique classique, elle monte avec la 6 et la 7 majeures, puis redescend en mineure naturelle.",
      "Le jazz garde la forme montante dans les deux sens. C'est celle qu'on travaille ici.",
    ] },
    { type: "question", quizId: "q-scales-p89-c602-01" },
    { type: "idee", titre: "Mineure, mais lumineuse", texte: [
      "Une seule note dit « mineur », tout le reste sonne majeur : une couleur ambiguë, raffinée.",
      "Sa place naturelle : l'accord mineur à 7e majeure, Am(maj7), qui réunit la ♭3 et la 7 majeure.",
    ] },
    { type: "idee", titre: "Sept modes, trois très utiles", texte: [
      "Elle a sept modes, elle aussi. En jazz, trois servent sans cesse : le 4e, lydien ♭7, sur une dominante qui ne résout pas ; le 6e, locrien #2, sur un m7♭5 ; le 7e, la gamme altérée, sur un V7 qui résout.",
      "Pas d'urgence : ils viendront avec le jazz.",
    ] },
    { type: "question", quizId: "q-scales-21" },
    { type: "a-toi", titre: "Monter et descendre pareil",
      consigne: "Fais sonner Am(maj7) en position ouverte (x02110), quatre temps, puis joue la tab au clic à 60 : la même gamme en montant et en descendant, Fa# et Sol# compris. Ensuite, deux minutes d'impro dans la position case 5 sur cet accord.",
      bloc: {
        type: "tab",
        caption: "La mineure mélodique, position case 5 : montée et descente avec les mêmes notes",
        text: "Tab — mesure 1 : corde 2 cases 5, 7, 9 (Mi, Fa#, Sol#), corde 1 cases 5, 7, 8 (La, Si, Do). Mesure 2 : corde 1 cases 7 et 5 (Si, La), corde 2 cases 9, 7, 5 (Sol#, Fa#, Mi), corde 3 cases 7 et 5 (Ré, Do), corde 4 case 7 (La).",
        data: { lines: [
          "e|----------5--7--8--|-7--5--------------------|",
          "B|-5--7--9-----------|-------9--7--5-----------|",
          "G|-------------------|----------------7--5-----|",
          "D|-------------------|----------------------7--|",
          "A|-------------------|-------------------------|",
          "E|-------------------|-------------------------|",
        ] },
      }, bpm: 60, minuteur: 150 },
    { type: "question", quizId: "q-impro-12" },
    { type: "recap", points: [
      "Mineure mélodique (jazz) = 1-2-♭3-4-5-6-7, la même en montant et en descendant.",
      "C'est la majeure avec une tierce mineure ; son accord type : m(maj7).",
      "Ses modes servent en jazz : lydien ♭7, locrien #2, gamme altérée.",
    ] },
  ],
  quiz: ["q-scales-21","q-impro-12","q-scales-13","q-scales-15","q-scales-p89-c602-01"],
};

export const quiz = [
  {id:"q-scales-21",courseId:"scales",lessonId:"scales-c6-02",lvl:3,q:"La gamme mineure mélodique 'jazz' a quelle formule ?",o:["1-2-♭3-4-5-♭6-♭7","1-2-♭3-4-5-6-7","1-♭2-♭3-4-5-♭6-7","1-2-3-4-5-6-♭7"],a:1,exp:"Mélodique jazz = 1-2-♭3-4-5-6-7. Mineure naturelle avec 6 ET 7 majeures. La mélodique jazz = La-Si-Do-Ré-Mi-Fa#-Sol#. Presque une majeure avec juste ♭3.",xp:55},
  {id:"q-impro-12",courseId:"impro",lessonId:"scales-c6-02",lvl:3,q:"Sur un accord altéré G7alt (V7 vers Cm), quelle gamme ?",o:["Sol altéré","Sol mixolydien","Sol lydien","Sol majeur"],a:0,exp:"La gamme altérée est le 7e mode de la mineure mélodique : Lab mélodique = Lab Sib Do♭ Réb Mib Fa Sol, donc Sol altéré = Sol Lab Sib Do♭ Réb Mib Fa, avec toutes les altérations possibles de G7 (♭9, #9, ♭5, ♭13). Mixolydien, lydien et majeur ignorent ces altérations.",xp:75},
  {id:"q-scales-p89-c602-01",courseId:"scales",lessonId:"scales-c6-02",lvl:3,q:"Quelles sont les notes de Ré mineur mélodique (forme jazz) ?",o:["Ré Mi Fa Sol La Si Do#","Ré Mi Fa Sol La Si♭ Do#","Ré Mi Fa Sol La Si Do","Ré Mi Fa# Sol La Si Do#"],a:0,exp:"Ré mineur naturel (Ré Mi Fa Sol La Si♭ Do) avec la 6 et la 7 remontées : Si et Do#. Si♭ + Do#, c'est l'harmonique ; Si + Do, le dorien ; avec Fa#, c'est Ré majeur.",xp:50},
];
