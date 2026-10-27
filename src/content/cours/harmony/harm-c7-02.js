// Leçon du module « harmony » + les questions de quiz qui s'y rattachent.
// Format « leçon en cartes » décrit dans src/content/README.md.

export default {
  id: "harm-c7-02", level: 9,
  title: "La substitution tritonique",
  duration: 9,
  gropiTip: "Moyen mnémotechnique : la substitution tritonique a sa fondamentale un demi-ton au-dessus de l'accord visé. Vers Do : Réb7. Vers Sol : Lab7. Vers Fa : Solb7.",
  cartes: [
    { type: "idee", titre: "Un V7 en remplace un autre", texte: [
      "Le principe : un accord de dominante peut être remplacé par l'accord 7 situé un triton plus loin, 6 demi-tons.",
      "Exemple en Sol majeur : D7, la dominante, devient Ab7. Même fonction, couleur inattendue. Un outil central du jazz moderne.",
    ] },
    { type: "question", quizId: "q-harm-47" },
    { type: "idee", titre: "Les guide tones de G7", texte: [
      "G7 = Sol Si Ré Fa : la 3e est Si, la 7e est Fa. Entre elles, un triton.",
      "Db7 = Ré♭ Fa La♭ Do♭. Regarde ses 3e et 7e, et compare avec celles de G7.",
    ], bloc: { type: "chord_diagram", caption: "G7 « shell » (3x34xx) — Sol à la basse, Fa (7e) et Si (3e) au-dessus", data: {name: "G7", frets: [3,-1,3,4,-1,-1], fingers: [1,0,2,3,0,0], startFret: 1} } },
    { type: "idee", titre: "Seule la basse bouge", texte: [
      "En shell, passer de G7 à Db7 ne change que la basse : les deux notes du haut restent sur les mêmes cases.",
      "Comme ces deux notes disent la couleur de l'accord, Db7 tire vers Cmaj7 exactement comme G7.",
    ], bloc: { type: "chord_diagram", caption: "Db7 « shell » (x434xx) — seule la basse bouge : Fa et Si (Dob) restent sur les mêmes cases", data: {name: "Db7", frets: [-1,4,3,4,-1,-1], fingers: [0,2,1,3,0,0], startFret: 1} } },
    { type: "question", quizId: "q-harm-48" },
    { type: "idee", titre: "La basse chromatique", texte: [
      "Le gain principal : la ligne de basse. Am7 - D7 - Gmaj7 saute de quarte en quarte : La, Ré, Sol.",
      "Am7 - Ab7 - Gmaj7 descend par demi-tons : La, La♭, Sol. Plus lisse, plus « jazz ».",
    ] },
    { type: "question", quizId: "q-harm-49" },
    { type: "idee", titre: "Quand l'utiliser", texte: [
      "Sur n'importe quel V7 qui résout vers son I. Alterne les deux versions d'une grille à l'autre : V7 la première fois, la substitution la suivante.",
      "On peut aussi l'enrichir d'extensions altérées (♭9, #9) pour encore plus de tension avant la résolution.",
    ] },
    { type: "a-toi", titre: "Dm7 - Db7 - Cmaj7 en shells",
      consigne: "Joue la tab au clic, quatre temps par accord : Dm7, Db7, Cmaj7, Cmaj7. Écoute la basse descendre Ré, Ré♭, Do. Tour suivant, remplace Db7 par G7 (3x34xx) : compare les deux chemins. Alterne une grille sur deux.",
      bloc: {
        type: "tab",
        caption: "Dm7 (x535xx), Db7 (x434xx), Cmaj7 (x324xx) : la basse descend par demi-tons",
        text: "Tab — Dm7 : corde 5 case 5, corde 4 case 3, corde 3 case 5 ; Db7 : corde 5 case 4, corde 4 case 3, corde 3 case 4 ; Cmaj7 : corde 5 case 3, corde 4 case 2, corde 3 case 4.",
        data: { lines: [
          "e|-----------------|",
          "B|-----------------|",
          "G|-5-----4-----4---|",
          "D|-3-----3-----2---|",
          "A|-5-----4-----3---|",
          "E|-----------------|",
        ] },
      }, bpm: 70, minuteur: 120 },
    { type: "recap", points: [
      "Un V7 se remplace par l'accord 7 un triton plus loin : G7 → Db7.",
      "Les deux accords partagent leurs guide tones, rôles inversés.",
      "Dm7 - Db7 - Cmaj7 : la basse descend par demi-tons, Ré, Ré♭, Do.",
    ] },
  ],
  quiz: ["q-harm-47", "q-harm-48", "q-harm-49", "q-impro-08", "q-impro-06"],
};

export const quiz = [
  {id:"q-harm-47",courseId:"harmony",lessonId:"harm-c7-02",lvl:1,q:"Avec la substitution tritonique, par quel accord remplace-t-on G7 ?",o:["D7","Db7","C7","Ab7"],a:1,exp:"Un triton (6 demi-tons) au-dessus de Sol : Réb. G7 devient Db7.",xp:30},
  {id:"q-harm-48",courseId:"harmony",lessonId:"harm-c7-02",lvl:2,q:"Pourquoi G7 et Db7 sont-ils interchangeables ?",o:["Ils ont la même fondamentale","Ils ont le même nombre de notes","Ils partagent les mêmes guide tones","Ils sont dans la même gamme majeure"],a:2,exp:"G7 a Si et Fa ; Db7 a Fa et Do♭ (= Si). Mêmes guide tones, rôles inversés : ils résolvent de la même façon.",xp:40},
  {id:"q-harm-49",courseId:"harmony",lessonId:"harm-c7-02",lvl:1,q:"Dm7 - Db7 - Cmaj7 : que fait la basse ?",o:["Elle saute de quarte en quarte","Elle reste sur Do","Elle monte par tons","Elle descend par demi-tons"],a:3,exp:"Ré → Réb → Do : une descente chromatique, au lieu des sauts Ré → Sol → Do.",xp:30},
  {id:"q-impro-08",courseId:"impro",lessonId:"harm-c7-02",lvl:3,q:"Substitution tritonique appliquée à Dm7-G7-Cmaj7 donne…",o:["Dm7-Db7-Cmaj7","Dm7-G7-C#maj7","D#m7-G7-Cmaj7","Dm7-Bb7-Cmaj7"],a:0,exp:"Sub trito du V (G7) = Db7. Donc Dm7-Db7-Cmaj7. La basse descend chromatiquement Ré→Réb→Do. Mouvement très élégant.",xp:65},
];
