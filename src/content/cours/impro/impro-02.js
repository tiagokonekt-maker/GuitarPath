// Leçon du module « impro » + les questions de quiz qui s'y rattachent.
// Format « leçon en cartes » décrit dans src/content/README.md.

export default {
  id: "impro-02", level: 7,
  title: "Cibler les notes d'accord",
  duration: 9,
  gropiTip: "Avant d'improviser sur Am7, égrène La, Do, Mi, Sol en noires à 60 BPM, en montant puis en descendant, dans une seule position. Ces 4 notes dans les doigts, tes atterrissages deviennent réflexes.",
  cartes: [
    { type: "idee", titre: "Dedans ou à côté", texte: [
      "Ce qui fait sonner un solo sur l'accord : arriver sur une note de l'accord, une chord tone, sur les temps forts.",
      "Sur Am7 : La, Do, Mi, Sol. Sur G7 : Sol, Si, Ré, Fa. Elles font partie de l'accord, elles sonnent juste à coup sûr.",
    ], bloc: { type: "fretboard_interactive", mode: "chord", root: "A", chord: "min7", caption: "Am7 — toutes les chord tones sur le manche", displayMode: "notes", lang: "fr", compact: true } },
    { type: "question", quizId: "q-impro-22" },
    { type: "idee", titre: "La 3e et la 7e d'abord", texte: [
      "Parmi les chord tones, la 3e dit majeur ou mineur, la 7e dit quel type de 7e. Ce sont les guide tones.",
      "Sur Am7 : Do et Sol. Sur G7 : Si et Fa.",
    ], bloc: { type: "fretboard_interactive", mode: "chord", root: "G", chord: "dom7", caption: "G7 — guide tones : Si (3e) et Fa (7e mineure)", displayMode: "intervals", lang: "fr", compact: true } },
    { type: "idee", titre: "Les notes de passage", texte: [
      "Entre deux cibles, tu peux jouer n'importe quelle note de la gamme, et même une note hors gamme si elle passe vite.",
      "Ce qui compte : atterrir sur une chord tone au temps fort.",
    ] },
    { type: "question", quizId: "q-impro-25" },
    { type: "a-toi", titre: "Atterrir sur Am7",
      consigne: "Égrène les notes de Am7 de la tab en noires au clic, en montant puis en descendant. Puis, sur un Lam tenu ou en boucle, improvise dans la pentatonique, position 1 : chaque phrase finit sur La, Do, Mi ou Sol, au temps 1.",
      bloc: {
        type: "tab",
        caption: "Les notes de Am7 (La Do Mi Sol) dans la position 1 de la pentatonique, case 5",
        text: "Tab — corde 6 cases 5 et 8, corde 5 case 7, corde 4 cases 5 et 7, corde 3 case 5, corde 2 cases 5 et 8, corde 1 cases 5 et 8 (La, Do, Mi, Sol, La, Do, Mi, Sol, La, Do).",
        data: { lines: [
          "e|-------------------------5--8--|",
          "B|-------------------5--8--------|",
          "G|----------------5--------------|",
          "D|----------5--7-----------------|",
          "A|-------7-----------------------|",
          "E|-5--8--------------------------|",
        ] },
      }, bpm: 60, minuteur: 120 },
    { type: "idee", titre: "Quand l'accord change", texte: [
      "Sur un blues en La, la pentatonique de La sert toute la grille. L'étape suivante : suivre chaque accord.",
      "A7 contient Do# (corde 3 case 6). Quand D7 arrive, vise Do (corde 3 case 5), sa 7e : un demi-ton plus bas, et le changement s'entend. Ses autres guide tones aussi sont de bonnes cibles.",
    ], bloc: {
      type: "chord_diagram",
      caption: "D7 — accord dominante (× × 0 2 1 2)",
      data: { name: "D7", frets: [-1,-1,0,2,1,2], fingers: [0,0,0,2,1,3], startFret: 1 },
    } },
    { type: "question", quizId: "q-impro-26" },
    { type: "a-toi", titre: "A7, D7 : un demi-ton",
      consigne: "Alterne A7 et D7, deux mesures chacun au clic. Sur A7, pose Do# (corde 3 case 6) au temps 1. Sur D7, glisse d'une case vers Do (corde 3 case 5). Puis improvise autour, en gardant ces deux arrivées.",
      bpm: 70, minuteur: 120 },
    { type: "recap", points: [
      "Les chord tones sonnent juste : place-les sur les temps forts.",
      "La 3e et la 7e résument l'accord : Do et Sol sur Am7, Si et Fa sur G7.",
      "Quand l'accord change, change de cible : Do# sur A7, Do ou Fa# sur D7.",
    ] },
  ],
  quiz: ["q-impro-25","q-impro-26","q-impro-22","q-impro-04"],
};

export const quiz = [
  {id:"q-impro-25",courseId:"impro",lessonId:"impro-02",lvl:2,q:"Sur un blues en La, on peut jouer La pentatonique mineure sur les trois accords. Pourquoi ?",o:["Parce que la gamme sert la tonalité entière", "Parce que le blues ne suit aucune règle", "Parce que les trois accords sont mineurs", "Parce que le tempo d'un blues reste toujours lent"],a:0,exp:"On improvise sur la tonalité, pas sur chaque accord. C'est ce qui rend le blues abordable — et suivre les accords un par un, en ciblant leurs notes, est justement l'étape suivante.",xp:30},
  {id:"q-impro-26",courseId:"impro",lessonId:"impro-02",lvl:2,q:"Blues en La : l'accord passe de A7 à D7. Quelle note est la tierce de D7 ?",o:["Fa#","Fa","Do#","La"],a:0,exp:"D7 = Ré Fa# La Do. Sa tierce, Fa#, n'existe ni dans A7 ni dans La pentatonique mineure : la viser quand D7 arrive fait entendre le changement, tout comme le Do (sa 7e), qui remplace le Do# de A7. Ce sont les guide tones de D7.",xp:40},
  {id:"q-impro-22",courseId:"impro",lessonId:"impro-02",lvl:2,q:"Pendant un solo, poser une note de l'accord en cours produit…",o:["Une tension à résoudre","Une sensation de stabilité","Une dissonance marquée","Un effet de surprise"],a:1,exp:"Les notes de l'accord sont les points de repos. Celles qui n'en font pas partie créent du mouvement. Savoir alterner les deux est la mécanique de base du phrasé, bien avant tout vocabulaire.",xp:30},
];
