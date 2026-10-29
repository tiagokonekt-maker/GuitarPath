// Leçon du module « harmony » + les questions de quiz qui s'y rattachent.
// Format « leçon en cartes » décrit dans src/content/README.md.
// Les quatre accords de septième ouverts (E7, A7, D7, B7) et la grille de
// blues en La, jouée au son du blues avant d'en faire la théorie (palier 6).

const E7 = { type: "chord_diagram", caption: "E7 — 020100 : Mi, sans l'annulaire", data: { name: "E7", frets: [0, 2, 0, 1, 0, 0], fingers: [0, 2, 0, 1, 0, 0], startFret: 1 } };
const A7 = { type: "chord_diagram", caption: "A7 — x02020 : La, avec la corde 3 à vide", data: { name: "A7", frets: [-1, 0, 2, 0, 2, 0], fingers: [0, 0, 2, 0, 3, 0], startFret: 1 } };
const D7 = { type: "chord_diagram", caption: "D7 — xx0212 : un triangle à l'envers", data: { name: "D7", frets: [-1, -1, 0, 2, 1, 2], fingers: [0, 0, 0, 2, 1, 3], startFret: 1 } };
const B7 = { type: "chord_diagram", caption: "B7 — x21202 : quatre doigts, la corde 2 à vide", data: { name: "B7", frets: [-1, 2, 1, 2, 0, 2], fingers: [0, 2, 1, 3, 0, 4], startFret: 1 } };

export default {
  id: "harm-acc-02", level: 3,
  title: "Les accords de septième : E7, A7, D7 et B7",
  duration: 8,
  gropiTip: "Joue Mi puis E7, La puis A7 : quatre coups chacun. Écoute la septième arriver : l'accord semble soudain vouloir aller ailleurs. Cette envie de bouger, c'est tout le moteur du blues.",
  cartes: [
    { type: "idee", titre: "Le son du blues", texte: [
      "Ajoute à un accord majeur une note placée un ton sous l'octave, la septième : il se met à « tirer » vers un autre accord. C'est le son du blues et du vieux rock.",
      "On l'écrit avec un 7 : E7 se dit « Mi sept ».",
    ] },
    { type: "idee", titre: "E7 : Mi, un doigt en moins", texte: [
      "Plaque Mi, puis soulève l'annulaire : la corde 4 sonne à vide.",
      "Ce Ré à vide est la septième de Mi. Les six cordes sonnent.",
    ], bloc: E7 },
    { type: "idee", titre: "A7 : La, avec un trou", texte: [
      "Plaque La avec le majeur sur la corde 4 et l'annulaire sur la corde 2, case 2. La corde 3 reste à vide.",
      "Ce Sol à vide est la septième de La. On gratte depuis la corde 5.",
    ], bloc: A7 },
    { type: "question", quizId: "q-harm-sept-new-01" },
    { type: "idee", titre: "D7 : un triangle à l'envers", texte: [
      "Majeur sur la corde 3 case 2, index sur la corde 2 case 1, annulaire sur la corde 1 case 2. Gratte de la corde 4 à la corde 1.",
      "Le Do (corde 2, case 1) est la septième de Ré.",
    ], bloc: D7 },
    { type: "idee", titre: "B7 : le plus costaud", texte: [
      "Quatre doigts : index sur la corde 4 case 1, majeur sur la corde 5 case 2, annulaire sur la corde 3 case 2, auriculaire sur la corde 1 case 2. La corde 2 sonne à vide.",
      "B7 appelle Mi : on l'entend souvent juste avant de revenir sur Mi.",
    ], bloc: B7 },
    { type: "question", quizId: "q-harm-sept-new-02" },
    { type: "a-toi", titre: "Ton premier blues en La",
      consigne: "La grille de 12 mesures : A7 (4 mesures), D7 (2), A7 (2), E7, D7, A7, E7 (1 chacun). Quatre coups vers le bas par mesure, au clic. Puis essaie un balancement « long-court » sur chaque temps.",
      bloc: D7, bpm: 70 },
    { type: "question", quizId: "q-harm-sept-new-03" },
    { type: "recap", points: [
      "La septième (un ton sous l'octave) donne à l'accord une envie de bouger : le son du blues.",
      "E7 et A7 : Mi et La avec une corde à vide de plus ; D7 et B7 : de nouvelles formes.",
      "Blues en La : A7, D7 et E7 sur 12 mesures ; B7 mène vers Mi.",
    ] },
  ],
  quiz: ["q-harm-sept-new-01", "q-harm-sept-new-02", "q-harm-sept-new-03"],
};

export const quiz = [
  {id:"q-harm-sept-new-01",courseId:"harmony",lessonId:"harm-acc-02",lvl:1,q:"Tu tiens l'accord de Mi. Comment obtiens-tu E7 ?",o:["Tu soulèves le doigt de la corde 4","Tu ajoutes un doigt sur la corde 1","Tu soulèves le doigt de la corde 3","Tu étouffes la corde 6"],a:0,exp:"En libérant la corde 4, on fait sonner Ré à vide : la septième de Mi. E7 = 020100.",xp:25},
  {id:"q-harm-sept-new-02",courseId:"harmony",lessonId:"harm-acc-02",lvl:2,q:"Quel accord de septième appelle le plus naturellement Mi ?",o:["B7","A7","D7","E7"],a:0,exp:"Si est la quinte de Mi : B7 est l'accord de dominante de Mi, sa tension se résout sur Mi.",xp:30},
  {id:"q-harm-sept-new-03",courseId:"harmony",lessonId:"harm-acc-02",lvl:2,q:"Quels accords forment la grille d'un blues en La ?",o:["A7, D7 et E7","A7, B7 et E7","B7, D7 et E7","A7, D7 et B7"],a:0,exp:"Le blues en La tourne sur La, Ré et Mi (les degrés I, IV et V), souvent tous joués en septième.",xp:30},
];
