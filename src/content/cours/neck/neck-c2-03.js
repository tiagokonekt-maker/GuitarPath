// Leçon du module « neck » + les questions de quiz qui s'y rattachent.
// Format « leçon en cartes » décrit dans src/content/README.md.

export default {
  id: "neck-c2-03", level: 4,
  title: "Les notes de la corde de Ré (corde 4)",
  duration: 7,
  gropiTip: "Tu connais déjà la case 5 de la corde 4 : c'est le Sol qui sert à accorder la corde 3 à l'oreille. Pars de là pour remonter : La en case 7, Si en 9, Do en 10.",
  cartes: [
    { type: "idee", titre: "La corde des accords ouverts", texte: [
      "Moins utilisée comme ancre que les cordes 6 et 5, la corde 4 est au cœur des accords ouverts Ré, Sol et Do.",
      "Ses notes naturelles : Ré (0), Mi (2), Fa (3), Sol (5), La (7), Si (9), Do (10), Ré (12).",
    ], bloc: {
      type: "note_grid",
      caption: "Corde 4 (Ré) — notes naturelles",
      data: {
        string: 4, stringName: "Ré", maxFret: 12,
        highlights: [
          { fret: 0,  label: "Ré",  color: "amber" },
          { fret: 2,  label: "Mi",  color: "green" },
          { fret: 3,  label: "Fa",  color: "green" },
          { fret: 5,  label: "Sol", color: "amber" },
          { fret: 7,  label: "La",  color: "green" },
          { fret: 9,  label: "Si",  color: "green" },
          { fret: 10, label: "Do",  color: "primary" },
          { fret: 12, label: "Ré",  color: "amber" },
        ],
      },
    } },
    { type: "question", quizId: "q-neck-29" },
    { type: "idee", titre: "Dix cases d'avance", texte: [
      "Chaque corde sonne une quarte, 5 demi-tons, au-dessus de sa voisine grave. Deux cordes plus haut, c'est donc 10 cases d'avance.",
      "La corde 4 à vide est le même Ré que celui de la corde 6, case 10.",
    ] },
    { type: "question", quizId: "q-neck-31-app" },
    { type: "idee", titre: "L'octave, deux cases plus loin", texte: [
      "Une note de la corde 6 se retrouve une octave plus haut sur la corde 4, deux cases plus loin.",
      "Sol (corde 6, case 3) devient Sol (corde 4, case 5). La (corde 6, case 5) devient La (corde 4, case 7).",
    ] },
    { type: "idee", titre: "Dans tes accords ouverts", texte: [
      "Dans Ré, la corde 4 à vide est la fondamentale. Dans Sol, ce même Ré est la quinte.",
      "Dans Do, la case 2 de la corde 4 donne Mi : la tierce de l'accord.",
    ] },
    { type: "question", quizId: "q-neck-p34-04" },
    { type: "a-toi", titre: "Tous les Sol des cordes graves",
      consigne: "Trouve Sol sur la corde 6, puis sur la 5, puis sur la 4, et rejoue-les en boucle en nommant la corde. Recommence avec La, Do et Ré. Les quatre notes en 60 secondes.",
      bloc: {
        type: "fretboard",
        caption: "Sol sur les trois cordes graves — cordes 6, 5 et 4",
        data: {
          frets: 12, startFret: 0,
          showStringNames: true, showFretNumbers: true,
          markerFrets: [3, 5, 7, 9, 12],
          notes: [
            { string: 6, fret: 3,  label: "Sol", color: "amber", root: true },
            { string: 5, fret: 10, label: "Sol", color: "amber", root: true },
            { string: 4, fret: 5,  label: "Sol", color: "amber", root: true },
          ],
        },
      }, minuteur: 60 },
    { type: "question", quizId: "q-neck-30" },
    { type: "recap", points: [
      "Corde 4 : Ré 0, Mi 2, Fa 3, Sol 5, La 7, Si 9, Do 10, Ré 12.",
      "Même hauteur : corde 4 à vide = corde 6 case 10.",
      "Octave : de la corde 6 à la corde 4, deux cases plus loin.",
    ] },
  ],
  quiz: ["q-neck-29", "q-neck-30", "q-neck-31", "q-neck-09", "q-neck-p34-04", "q-neck-31-app"],
};

export const quiz = [
  {id:"q-neck-29",courseId:"neck",lessonId:"neck-c2-03",lvl:1,q:"Sur la corde 4 (Ré), quelle note est à la case 5 ?",o:["Sol","Fa#","La","Mi"],a:0,exp:"Corde 4 à vide = Ré, puis Mi (2), Fa (3), Sol (5).",xp:30},
  {id:"q-neck-30",courseId:"neck",lessonId:"neck-c2-03",lvl:1,q:"Sur la corde 4, où sont les deux demi-tons naturels (Mi-Fa et Si-Do) ?",o:["Cases 3-4 et 10-11","Cases 2-3 et 9-10","Cases 4-5 et 11-12","Cases 1-2 et 8-9"],a:1,exp:"Mi est case 2 et Fa case 3 ; Si est case 9 et Do case 10.",xp:30},
  {id:"q-neck-31",courseId:"neck",lessonId:"neck-c2-03",lvl:2,q:"La corde 4 à vide sonne exactement comme…",o:["La corde 6, case 5","La corde 5, case 7","La corde 6, case 10","La corde 6, case 12"],a:2,exp:"Corde 4 case X = corde 6 case X+10 : la corde 4 à vide (Ré) est la même note, à la même hauteur, que la corde 6 case 10.",xp:40},
  {id:"q-neck-31-app",courseId:"neck",lessonId:"neck-c2-03",lvl:2,q:"La corde 3 à vide sonne exactement comme…",o:["La corde 5, case 5","La corde 5, case 10","La corde 6, case 10","La corde 4, case 7"],a:1,exp:"Deux cordes plus grave, c'est 10 cases d'avance : la corde 3 à vide (Sol) est la même note, à la même hauteur, que la corde 5 case 10.",xp:30},
  {id:"q-neck-p34-04",courseId:"neck",lessonId:"neck-c2-03",lvl:2,q:"Sur la corde 4, quelle note joues-tu à la case 10 ?",o:["Do","Si","Do#","La#"],a:0,exp:"Corde 4 : La (7), Si (9), puis Do (10), juste à côté, car Si-Do n'est qu'un demi-ton. L'octave Ré est en case 12, un ton plus haut.",xp:35},
];
