// Leçon du module « harmony » + les questions de quiz qui s'y rattachent.
// Format « leçon en cartes » décrit dans src/content/README.md.

export default {
  id: "harm-c3-01", level: 7,
  title: "Pourquoi ajouter une 7e ?",
  duration: 8,
  gropiTip: "Pour trouver la 7e mineure sans calcul, descends d'un ton depuis la fondamentale à l'octave : depuis Do, ça donne Sib. Un demi-ton seulement sous l'octave, c'est la 7e majeure (Si).",
  cartes: [
    { type: "idee", titre: "Une quatrième note", texte: [
      "Une triade empile 1-3-5. Un accord de septième ajoute une tierce de plus : 1-3-5-7.",
      "Cette 4e note change toute la couleur : plus riche, plus élaborée. C'est le son de base du jazz, de la bossa et de la soul.",
    ] },
    { type: "idee", titre: "Quelle 7e ?", texte: [
      "Deux possibilités. La 7e mineure est à 10 demi-tons de la fondamentale : depuis Do, Sib. La 7e majeure est à 11 demi-tons : Si.",
      "Un seul demi-ton d'écart, deux couleurs très différentes.",
    ] },
    { type: "question", quizId: "q-harm-32" },
    { type: "idee", titre: "Cmaj7 : lumineux", texte: [
      "Majeur + 7e majeure : Do, Mi, Sol, Si.",
      "Le Si frotte à un demi-ton sous le Do de l'octave : une tension douce, rêveuse. L'accord reste stable, avec une invitation à continuer.",
    ], bloc: {
      type: "chord_diagram",
      caption: "Cmaj7 — majeur + 7e maj = lumineux, jazz, stable",
      data: { name: "Cmaj7", frets: [-1,3,2,0,0,0], fingers: [0,3,2,0,0,0], startFret: 1 },
    } },
    { type: "idee", titre: "Am7 : doux", texte: [
      "Mineur + 7e mineure : La, Do, Mi, Sol.",
      "Le Sol adoucit l'accord mineur et lui donne un côté détendu, funky, très présent en soul et en R&B.",
    ], bloc: {
      type: "chord_diagram",
      caption: "Am7 — mineur + 7e min = doux, funky, modal",
      data: { name: "Am7", frets: [0,0,2,0,1,0], fingers: [0,0,2,0,1,0], startFret: 1 },
    } },
    { type: "idee", titre: "G7 : tendu", texte: [
      "Majeur + 7e mineure : Sol, Si, Ré, Fa. C'est l'accord de dominante, cousin des E7, A7 et D7 que tu joues déjà.",
      "Entre Si et Fa : 6 demi-tons, un triton. Cette tension demande à se résoudre vers Do.",
    ], bloc: {
      type: "chord_diagram",
      caption: "G7 — majeur + 7e min = tendu, blues, dominant",
      data: { name: "G7", frets: [3,2,0,0,0,1], fingers: [3,2,0,0,0,1], startFret: 1 },
    } },
    { type: "question", quizId: "q-harm-33" },
    { type: "a-toi", titre: "Triades, puis 7e",
      consigne: "Joue Do, Sol, Lam, Fa, une mesure chacun au clic. Puis la même boucle en 7e : Cmaj7, G7, Am7, Fmaj7. Souvent, un seul doigt bouge ou se lève. Écoute ce que la 7e ajoute.",
      bloc: {
        type: "chord_diagram",
        caption: "Fmaj7 — accord Maj7 (× × 3 2 1 0)",
        data: { name: "Fmaj7", frets: [-1,-1,3,2,1,0], fingers: [0,0,3,2,1,0], startFret: 1 },
      }, bpm: 60, minuteur: 120 },
    { type: "question", quizId: "q-harm-34" },
    { type: "recap", points: [
      "Accord de 7e = triade + une 7e : mineure à 10 demi-tons, majeure à 11.",
      "Cmaj7 lumineux, Am7 doux, G7 tendu.",
      "G7 = majeur + 7e mineure : son triton Si-Fa appelle Do.",
    ] },
  ],
  quiz: ["q-harm-32", "q-harm-33", "q-harm-34"],
};

export const quiz = [
  {id:"q-harm-32",courseId:"harmony",lessonId:"harm-c3-01",lvl:1,q:"Depuis Do, combien de demi-tons séparent la fondamentale de sa 7e mineure (Sib) ?",o:["9", "10", "11", "12"],a:1,exp:"7e mineure = 10 demi-tons (Do → Sib). La 7e majeure en fait 11 (Do → Si) : un seul demi-ton d'écart, deux couleurs très différentes.",xp:30},
  {id:"q-harm-33",courseId:"harmony",lessonId:"harm-c3-01",lvl:2,q:"Qu'est-ce qui définit un accord de dominante, comme G7 ?",o:["Triade mineure + 7e mineure", "Triade majeure + 7e majeure", "Triade majeure + 7e mineure", "Triade diminuée + 7e mineure"],a:2,exp:"Dominante = triade majeure + 7e mineure : G7 = Sol-Si-Ré-Fa.",xp:40},
  {id:"q-harm-34",courseId:"harmony",lessonId:"harm-c3-01",lvl:2,q:"Pourquoi G7 appelle-t-il une résolution vers Do ?",o:["Il n'a pas de quinte juste","Sa fondamentale est plus grave","Il contient une 7e majeure","Il contient un triton"],a:3,exp:"Si et Fa sont séparés de 6 demi-tons : un triton, l'intervalle le plus instable. Il se résout naturellement vers Do-Mi.",xp:40},
];
