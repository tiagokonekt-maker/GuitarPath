// Leçon du module « neck » + les questions de quiz qui s'y rattachent.
// Format « leçon en cartes » décrit dans src/content/README.md.

export default {
  id: "neck-c2-04", level: 4,
  title: "Les notes de la corde de Sol (corde 3)",
  duration: 7,
  gropiTip: "Le Si de la case 4 est le repère « bizarre » de la corde 3 : c'est le même Si que la corde 2 à vide, celui qui sert à accorder à l'oreille. Joue les deux ensemble pour les entendre fusionner.",
  cartes: [
    { type: "idee", titre: "La corde 3, case par case", texte: [
      "Ses notes naturelles : Sol (0), La (2), Si (4), Do (5), Ré (7), Mi (9), Fa (10), Sol (12).",
      "Demi-tons naturels : Si-Do entre les cases 4 et 5, Mi-Fa entre 9 et 10.",
    ], bloc: {
      type: "note_grid",
      caption: "Corde 3 (Sol) — attention : Si arrive dès la case 4",
      data: {
        string: 3, stringName: "Sol", maxFret: 12,
        highlights: [
          { fret: 0,  label: "Sol", color: "amber" },
          { fret: 2,  label: "La",  color: "green" },
          { fret: 4,  label: "Si",  color: "green" },
          { fret: 5,  label: "Do",  color: "primary" },
          { fret: 7,  label: "Ré",  color: "amber" },
          { fret: 9,  label: "Mi",  color: "green" },
          { fret: 10, label: "Fa",  color: "green" },
          { fret: 12, label: "Sol", color: "amber" },
        ],
      },
    } },
    { type: "question", quizId: "q-neck-22" },
    { type: "idee", titre: "Le Si de la case 4", texte: [
      "De Sol à Si, il y a 4 demi-tons : Si arrive dès la case 4, pas en 7 comme sur les cordes de Mi.",
      "C'est le même Si que la corde 2 à vide : entre ces deux cordes, l'écart est une tierce majeure, pas une quarte.",
    ] },
    { type: "question", quizId: "q-neck-21" },
    { type: "idee", titre: "La corde des bends", texte: [
      "Médium-aiguë et souple, la corde 3 se prête aux tirés. Le Ré de la case 7, tiré d'un ton jusqu'à Mi, est un geste de base du blues.",
      "En La pentatonique, les deux notes sont dans la gamme : ce bend sonne juste.",
    ] },
    { type: "idee", titre: "Trois Sol, trois octaves", texte: [
      "Sol (corde 6, case 3), Sol (corde 3, case 0), Sol (corde 1, case 3) : un même nom, trois octaves.",
      "Relier les cordes ainsi, c'est voir le manche en entier.",
    ] },
    { type: "question", quizId: "q-neck-45" },
    { type: "a-toi", titre: "Le bend de la case 7",
      consigne: "Joue Mi (corde 3, case 9) pour avoir la note cible en tête. Puis joue Ré (corde 3, case 7) et pousse la corde vers le plafond, avec deux doigts, jusqu'à retrouver ce Mi. Alterne note cible et bend pendant une minute.",
      bloc: {
        type: "tab",
        caption: "Note cible, puis bend d'un ton de la case 7 à la hauteur de la case 9",
        text: "Tab — corde 3 : 9, puis 7b9 (case 7 tirée d'un ton), puis 9, puis 7b9r7 (tirée puis relâchée).",
        data: { lines: [
          "e|---------------------------|",
          "B|---------------------------|",
          "G|-9----7b9----9----7b9r7----|",
          "D|---------------------------|",
          "A|---------------------------|",
          "E|---------------------------|",
        ] },
      }, minuteur: 60 },
    { type: "recap", points: [
      "Corde 3 : Sol 0, La 2, Si 4, Do 5, Ré 7, Mi 9, Fa 10, Sol 12.",
      "Le Si de la case 4 sonne comme la corde 2 à vide.",
      "Ré (case 7) tiré d'un ton jusqu'à Mi : le bend de base du blues.",
    ] },
  ],
  quiz: ["q-neck-21","q-neck-22","q-neck-45"],
};

export const quiz = [
  {id:"q-neck-21",courseId:"neck",lessonId:"neck-c2-04",lvl:2,q:"Sur la corde 3 (Sol), à quelle case trouve-t-on la note Si ?",o:["Case 7","Case 5","Case 2","Case 4"],a:3,exp:"De Sol à Si, il y a 4 demi-tons : Si arrive dès la case 4, alors qu'il est en case 7 sur les cordes de Mi. C'est le même Si que la corde 2 à vide.",xp:35},
  {id:"q-neck-22",courseId:"neck",lessonId:"neck-c2-04",lvl:2,q:"Sur la corde 3 (Sol), quelle note trouve-t-on à la case 5 ?",o:["Do","Ré","La","Si"],a:0,exp:"Case 0 Sol, 2 La, 4 Si, 5 Do : le demi-ton Si-Do tombe entre les cases 4 et 5, exactement comme sur les autres cordes.",xp:35},
  {id:"q-neck-45",courseId:"neck",lessonId:"neck-c2-04",lvl:1,q:"Sur la corde 3, quelle note joues-tu à la case 9 ?",o:["Mi","Ré","Fa","Do#"],a:0,exp:"Corde 3 : Sol (0), La (2), Si (4), Do (5), Ré (7), Mi (9). Le demi-ton Mi-Fa tombe entre les cases 9 et 10.",xp:30},
];
