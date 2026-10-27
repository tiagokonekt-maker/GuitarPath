// Leçon du module « harmony » + les questions de quiz qui s'y rattachent.
// Format « leçon en cartes » décrit dans src/content/README.md.

export default {
  id: "harm-c3-04", level: 8,
  title: "Les voicings shell : économe et efficace",
  duration: 8,
  gropiTip: "Depuis le G7 shell (cases 3-2-3), monte le doigt de la corde 4 d'une case (Fa → Fa#) : Gmaj7. Recule plutôt celui de la corde 5 (Si → Sib) : Gm7. Un doigt, un nouveau type.",
  cartes: [
    { type: "idee", titre: "Trois notes suffisent", texte: [
      "Un voicing, c'est une façon de disposer les notes d'un accord sur le manche. Le shell (« coquille ») n'en garde que trois : la fondamentale, la 3e et la 7e.",
      "Trois cordes, trois doigts : la base du comping jazz.",
    ], bloc: {
      type: "chord_diagram",
      caption: "G7 shell — fondamentale c6 case 3 (Sol-Si-Fa)",
      data: { name: "G7", frets: [3,2,3,-1,-1,-1], fingers: [2,1,3,0,0,0], startFret: 1 },
    } },
    { type: "idee", titre: "La quinte, la moins utile", texte: [
      "La 3e dit majeur ou mineur, la 7e dit maj7, 7 ou m7. La quinte, elle, est la même dans Cmaj7, C7 et Cm7 : elle ne distingue rien.",
      "On la laisse tomber sans que l'oreille perde le nom de l'accord.",
    ] },
    { type: "question", quizId: "q-harm-38" },
    { type: "idee", titre: "Les formes sur la corde 6", texte: [
      "Fondamentale sur la corde 6, 7e sur la corde 4 : même case pour une 7e mineure, une case plus haut pour une 7e majeure.",
      "La 3e est sur la corde 5 : une case sous la fondamentale si elle est majeure, deux cases si elle est mineure. Ici Dm7 : Ré, Fa, Do.",
    ], bloc: {
      type: "chord_diagram",
      caption: "Dm7 shell — fondamentale c6 case 10 (Ré-Fa-Do)",
      data: { name: "Dm7", frets: [10,8,10,-1,-1,-1], fingers: [2,1,3,0,0,0], startFret: 7 },
    } },
    { type: "question", quizId: "q-harm-40" },
    { type: "idee", titre: "Les formes sur la corde 5", texte: [
      "Même logique un groupe de cordes plus haut. Cmaj7 : Do (corde 5 case 3), Mi (corde 4 case 2), Si (corde 3 case 4).",
      "Alterner fondamentale corde 6 et corde 5 permet d'enchaîner les accords sans quitter une petite zone du manche.",
    ] },
    { type: "a-toi", titre: "ii-V-I en shells",
      consigne: "Dm7 (fondamentale corde 5 case 5), G7 (corde 6 case 3), Cmaj7 (corde 5 case 3) : quatre temps chacun au clic, en coups secs. Les doigts bougent à peine d'un accord à l'autre. Quand c'est fluide, joue un coup par temps, bien court : le son jazz est là.",
      bloc: {
        type: "tab",
        caption: "Dm7 (x535xx), G7 (323xxx), Cmaj7 (x324xx) : trois shells dans la même zone",
        text: "Tab — Dm7 : corde 5 case 5, corde 4 case 3, corde 3 case 5 ; G7 : corde 6 case 3, corde 5 case 2, corde 4 case 3 ; Cmaj7 : corde 5 case 3, corde 4 case 2, corde 3 case 4.",
        data: { lines: [
          "e|-----------------|",
          "B|-----------------|",
          "G|-5-----------4---|",
          "D|-3-----3-----2---|",
          "A|-5-----2-----3---|",
          "E|-------3---------|",
        ] },
      }, bpm: 70, minuteur: 120 },
    { type: "question", quizId: "q-harm-39" },
    { type: "recap", points: [
      "Shell = fondamentale + 3e + 7e : la quinte est omise.",
      "Corde 6 : 3e sur la corde 5, 7e sur la corde 4 ; même logique depuis la corde 5.",
      "Dm7, G7, Cmaj7 en shells : un ii-V-I jazz sans quitter la position.",
    ] },
  ],
  quiz: ["q-harm-38", "q-harm-39", "q-harm-40", "q-harm-09", "q-harm-12"],
};

export const quiz = [
  {id:"q-harm-38",courseId:"harmony",lessonId:"harm-c3-04",lvl:1,q:"Quelles notes contient un voicing shell ?",o:["Fondamentale, 3e et 5e","Fondamentale, 3e et 7e","3e, 5e et 7e","Fondamentale, 5e et octave"],a:1,exp:"Fondamentale + 3e + 7e : les notes qui définissent la qualité de l'accord. La quinte est omise.",xp:30},
  {id:"q-harm-39",courseId:"harmony",lessonId:"harm-c3-04",lvl:2,q:"Pourquoi peut-on omettre la quinte ?",o:["Elle sonne faux sur tous les accords de 7e","Elle est trop difficile à doigter ici","Elle résonne déjà dans la fondamentale","Elle masque la tierce et la septième"],a:2,exp:"La quinte est le 3e harmonique naturel de la fondamentale : elle est déjà présente dans le son de la corde.",xp:40},
  {id:"q-harm-40",courseId:"harmony",lessonId:"harm-c3-04",lvl:2,q:"Cmaj7 shell, fondamentale corde 6 case 8 : où placer la 3e (Mi) ?",o:["Corde 5, case 8","Corde 4, case 10","Corde 5, case 10","Corde 5, case 7"],a:3,exp:"Corde 5 case 7 = Mi. Le shell complet : Do (c6 case 8), Mi (c5 case 7), Si (c4 case 9).",xp:40},
];
