// Leçon du module « neck » + les questions de quiz qui s'y rattachent.
// Format « leçon en cartes » décrit dans src/content/README.md.

const CORDE_5 = {
  type: "note_grid",
  caption: "Corde 5 (La) — notes naturelles à mémoriser",
  data: {
    string: 5, stringName: "La", maxFret: 12,
    highlights: [
      { fret: 0,  label: "La",  color: "amber" },
      { fret: 2,  label: "Si",  color: "green" },
      { fret: 3,  label: "Do",  color: "primary" },
      { fret: 5,  label: "Ré",  color: "amber" },
      { fret: 7,  label: "Mi",  color: "green" },
      { fret: 8,  label: "Fa",  color: "green" },
      { fret: 10, label: "Sol", color: "green" },
      { fret: 12, label: "La",  color: "amber" },
    ],
  },
};

export default {
  id: "neck-c2-02", level: 3,
  title: "Les notes de la corde de La (corde 5)",
  duration: 7,
  gropiTip: "Sur la corde 5, les points des cases 3, 5 et 7 donnent Do, Ré et Mi, trois notes qui se suivent. Joue-les en remontant : un petit Do-Ré-Mi sous tes yeux, facile à retenir.",
  cartes: [
    { type: "idee", titre: "Ta deuxième ancre", texte: [
      "La corde 5 porte la fondamentale des barrés en forme de La. Ses notes naturelles : La (0), Si (2), Do (3), Ré (5), Mi (7), Fa (8), Sol (10), La (12).",
      "Les demi-tons Si-Do et Mi-Fa tombent entre les cases 2-3 et 7-8.",
    ], bloc: CORDE_5 },
    { type: "question", quizId: "q-base-17" },
    { type: "idee", titre: "Le décalage de 5 cases", texte: [
      "La corde 5 est accordée 5 demi-tons plus haut que la corde 6. Pour une même note, à la même hauteur, recule donc de 5 cases.",
      "Le La de la case 5 sur la corde 6, c'est la corde 5 à vide.",
    ], bloc: {
      type: "fretboard",
      caption: "Même note La — corde 6 case 5 et corde 5 à vide",
      data: {
        frets: 7, startFret: 0,
        showStringNames: true, showFretNumbers: true,
        markerFrets: [3, 5],
        notes: [
          { string: 6, fret: 5, label: "La", color: "amber", root: true },
          { string: 5, fret: 0, label: "La", color: "amber", root: true },
        ],
      },
    } },
    { type: "question", quizId: "q-neck-44" },
    { type: "idee", titre: "Les barrés en forme de La", texte: [
      "Dans cette forme, la fondamentale est sur la corde 5. Barré en case 3 : Do majeur. En case 5 : Ré majeur. En case 7 : Mi majeur.",
      "Avec la corde 6, tu sais nommer n'importe quel barré majeur ou mineur.",
    ] },
    { type: "question", quizId: "q-neck-43" },
    { type: "idee", titre: "Une note, deux places", texte: [
      "Mi (corde 6, case 0) et Mi (corde 5, case 7). Do (corde 6, case 8) et Do (corde 5, case 3).",
      "Quand tu cherches une note, pense à ces paires : prends celle qui est la plus proche de ta main.",
    ] },
    { type: "a-toi", titre: "Les paires en une minute",
      consigne: "Pour chaque note naturelle, La, Si, Do, Ré, Mi, Fa, Sol : joue-la sur la corde 5, puis retrouve-la sur la corde 6. Nomme-la à voix haute. Tout le tour en 60 secondes, puis recommence plus vite.",
      bloc: CORDE_5, minuteur: 60 },
    { type: "question", quizId: "q-neck-p34-03" },
    { type: "recap", points: [
      "Corde 5 : La 0, Si 2, Do 3, Ré 5, Mi 7, Fa 8, Sol 10, La 12.",
      "Même note, même hauteur : 5 cases plus tôt sur la corde 5 que sur la corde 6.",
      "Un barré en forme de La porte le nom de sa note sur la corde 5.",
    ] },
  ],
  quiz: ["q-base-17","q-neck-43","q-neck-44","q-neck-p34-03"],
};

export const quiz = [
  {id:"q-base-17",courseId:"neck",lessonId:"neck-c2-02",lvl:2,q:"Sur la corde de La (corde 5), quelle note trouve-t-on case 3 ?",o:["Do","Si","Ré","Do#"],a:0,exp:"Depuis La à vide : case 1 La#, case 2 Si, case 3 Do. Cette corde porte la fondamentale des accords barrés en forme de La.",xp:35},
  {id:"q-neck-43",courseId:"neck",lessonId:"neck-c2-02",lvl:2,q:"Un barré en forme de La, fondamentale sur la corde 5 case 5, donne quel accord majeur ?",o:["Ré majeur","Do majeur","Mi majeur","Sol majeur"],a:0,exp:"La forme de La place la fondamentale sur la corde 5. Corde 5 case 5 = Ré : Ré majeur. Case 3 donnerait Do, case 7 Mi, case 10 Sol.",xp:40},
  {id:"q-neck-44",courseId:"neck",lessonId:"neck-c2-02",lvl:2,q:"Do est à la case 8 de la corde 6. Où joues-tu ce même Do, à la même hauteur, sur la corde 5 ?",o:["Case 3","Case 13","Case 5","Case 10"],a:0,exp:"La corde 5 est accordée 5 demi-tons plus haut que la corde 6 : pour la même note, on recule de 5 cases. 8 − 5 = 3 : Do (corde 5, case 3).",xp:40},
  {id:"q-neck-p34-03",courseId:"neck",lessonId:"neck-c2-02",lvl:2,q:"Sur la corde 5, quelle note joues-tu à la case 10 ?",o:["Sol","Fa","La","Fa#"],a:0,exp:"Corde 5 : Mi (7), Fa (8), Fa# (9), Sol (10). Autre chemin : la case 12 est l'octave, La ; deux cases plus bas, un ton en dessous, c'est Sol.",xp:35},
];
