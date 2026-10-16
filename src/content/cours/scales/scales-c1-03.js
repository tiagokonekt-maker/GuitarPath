// Leçon du module « scales » + les questions de quiz qui s'y rattachent.
// Format « leçon en cartes » décrit dans src/content/README.md.

export default {
  id: "scales-c1-03", level: 2,
  title: "Tons et demi-tons : la mesure des distances",
  duration: 7,
  gropiTip: "Vérifie les demi-tons naturels sur la corde 2 : Si à vide, Do case 1, puis Mi case 5, Fa case 6. Une seule case d'écart à chaque fois, alors que Do→Ré en demande deux.",
  cartes: [
    { type: "idee", titre: "Le demi-ton : une case", texte: [
      "Pour comprendre une gamme, il faut mesurer les distances entre les notes. Deux unités suffisent.",
      "Le demi-ton, la plus petite : une case d'écart sur la même corde. Do → Do#, Mi → Fa, Si → Do.",
    ] },
    { type: "idee", titre: "Le ton : deux cases", texte: [
      "Un ton = deux demi-tons = deux cases. Do → Ré (en passant par Do#), Fa → Sol, Sol → La.",
      "Sur la corde 4 : Ré à vide, puis Mi en case 2, là où ton majeur se pose dans l'accord de Do. Un ton, deux cases.",
    ] },
    { type: "question", quizId: "q-base-11" },
    { type: "idee", titre: "Les demi-tons naturels", texte: [
      "Entre deux notes naturelles voisines, l'écart est d'un ton… sauf entre Mi et Fa, et entre Si et Do : un demi-ton seulement.",
      "Retiens-le : « Mi-Fa, Si-Do, ce sont eux qui se collent ».",
    ], bloc: {
      type: "note_grid",
      caption: "Demi-tons naturels — Mi→Fa (cases 0-1) et Si→Do (cases 7-8) collés sur corde 6",
      data: {
        string: 6, stringName: "Mi grave", maxFret: 12,
        highlights: [
          { fret: 0,  label: "Mi",  color: "amber" },
          { fret: 1,  label: "Fa",  color: "coral" },
          { fret: 3,  label: "Sol", color: "neutral" },
          { fret: 5,  label: "La",  color: "neutral" },
          { fret: 7,  label: "Si",  color: "amber" },
          { fret: 8,  label: "Do",  color: "coral" },
          { fret: 10, label: "Ré",  color: "neutral" },
          { fret: 12, label: "Mi",  color: "amber" },
        ],
      },
    } },
    { type: "question", quizId: "q-base-12" },
    { type: "idee", titre: "Le dessin des écarts fait la gamme", texte: [
      "De Do à Do, les écarts sont : ton, ton, demi-ton, ton, ton, ton, demi-ton. Ce dessin, c'est la gamme majeure.",
      "Change le dessin et tu changes de gamme : mineure, modes… Toute la théorie repose sur ces suites d'écarts.",
    ] },
    { type: "a-toi", titre: "Do majeur sur une seule corde", consigne: "Sur la corde 2, de Do (case 1) à Do (case 13), une note par clic. Dis l'écart à voix haute : « ton, ton, demi », puis « ton, ton, ton, demi ». Les deux demi-tons tombent sur Mi-Fa et Si-Do.", bloc: {
      type: "tab",
      caption: "La gamme de Do majeur sur la corde 2 : Do Ré Mi Fa Sol La Si Do",
      text: "Tab — corde 2 : cases 1, 3, 5, 6, 8, 10, 12, 13.",
      data: { lines: [
        "e|----------------------------|",
        "B|-1--3--5--6--8--10--12--13--|",
        "G|----------------------------|",
        "D|----------------------------|",
        "A|----------------------------|",
        "E|----------------------------|",
      ] },
    }, bpm: 60 },
    { type: "question", quizId: "q-scales-51" },
    { type: "recap", points: [
      "Demi-ton = 1 case, ton = 2 cases.",
      "Les deux demi-tons naturels : Mi-Fa et Si-Do.",
      "Gamme majeure : ton, ton, demi-ton, ton, ton, ton, demi-ton.",
    ] },
  ],
  quiz: ["q-base-11","q-base-12","q-scales-51"],
};

export const quiz = [
  {id:"q-base-11",courseId:"scales",lessonId:"scales-c1-03",lvl:1,q:"Un ton entier représente combien de demi-tons ?",o:["1","3","2","4"],a:2,exp:"Un ton = 2 demi-tons = 2 cases sur la guitare. Le demi-ton reste la plus petite unité du système occidental.",xp:30},
  {id:"q-base-12",courseId:"scales",lessonId:"scales-c1-03",lvl:1,q:"Entre lesquelles de ces paires de notes naturelles n'y a-t-il qu'un demi-ton ?",o:["Do et Ré","Sol et La","La et Si","Mi et Fa"],a:3,exp:"Mi-Fa et Si-Do sont les deux seules paires naturelles séparées d'un simple demi-ton. Toutes les autres sont à un ton entier.",xp:30},
  {id:"q-scales-51",courseId:"scales",lessonId:"scales-c1-03",lvl:2,q:"De Mi à Sol en montant, quelle est la distance ?",o:["Un ton et demi","Deux tons","Un ton","Deux tons et demi"],a:0,exp:"Mi → Fa = un demi-ton (demi-ton naturel), Fa → Sol = un ton. Total : un ton et demi, soit 3 demi-tons — 3 cases sur une même corde.",xp:40},
];
