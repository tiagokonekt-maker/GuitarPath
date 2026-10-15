// Leçon du module « debut » + les questions de quiz qui s'y rattachent.
// Format « leçon en cartes » décrit dans src/content/README.md.

const QUATRE_COUPS = { type: "strum_pattern", caption: "Ton premier geste : 4 coups vers le bas, un par temps", data: { pattern: ["B", "B", "B", "B"], beats: 4, style: "folk", bpm: 60 } };

export default {
  id: "debut-c1-03", level: 0, unite: 1,
  title: "La main droite : médiator ou doigts",
  duration: 6,
  gropiTip: "Joue tes 4 coups vers le bas face à un miroir et regarde ton coude : il doit rester posé sur la caisse pendant que ton poignet fait le travail.",
  cartes: [
    { type: "idee", titre: "Médiator ou doigts", texte: [
      "La main droite fait sonner les notes : rythme, volume, caractère.",
      "Tu peux jouer au médiator (le petit triangle en plastique, ou plectre) ou aux doigts. Pour tes premiers accords, commence au médiator.",
    ] },
    { type: "idee", titre: "Tenir le médiator", texte: [
      "Index légèrement plié, médiator à plat sur le côté de sa dernière phalange, pointe vers les cordes. Referme le pouce par-dessus : seuls 2 à 3 mm de pointe dépassent.",
      "Serre juste assez pour qu'il ne tourne pas. Pour débuter, prends-le fin ou médium (0,5 à 0,7 mm) : il pardonne les maladresses.",
    ] },
    { type: "question", quizId: "q-debut-08" },
    { type: "idee", titre: "Le geste vient du poignet", texte: [
      "Ton avant-bras reste posé sur la caisse. Le mouvement vient surtout du poignet, comme pour secouer un thermomètre ou sécher des doigts mouillés.",
      "Gratter depuis l'épaule fatigue vite et manque de précision.",
    ] },
    { type: "question", quizId: "q-debut-09" },
    { type: "a-toi", titre: "4 coups vers le bas", consigne: "Cordes à vide, sans main gauche : 4 coups vers le bas, un par clic, en comptant « 1, 2, 3, 4 » à voix haute. Vise un son égal sur toutes les cordes. Toutes les deux minutes, secoue la main droite pour la détendre.", bloc: QUATRE_COUPS, bpm: 60 },
    { type: "idee", titre: "Jouer aux doigts", texte: [
      "Le pouce joue les trois cordes graves (6, 5 et 4) ; index, majeur et annulaire se partagent les cordes 3, 2 et 1, un doigt par corde. On les note p, i, m, a.",
      "Gratter au pouce ou à l'ongle de l'index, c'est plus doux : parfait pour jouer tard le soir.",
    ] },
    { type: "question", quizId: "q-debut-10" },
    { type: "recap", points: [
      "Médiator à plat sur l'index, pouce par-dessus, 2 à 3 mm de pointe.",
      "Le geste vient du poignet, avant-bras posé sur la caisse.",
      "Aux doigts : le pouce pour les cordes 6, 5 et 4 ; i, m, a pour les cordes 3, 2 et 1.",
    ] },
  ],
  quiz: ["q-debut-08", "q-debut-09", "q-debut-10"],
};

export const quiz = [
  {id:"q-debut-08",courseId:"debut",lessonId:"debut-c1-03",lvl:1,q:"Combien de pointe du médiator doit dépasser de tes doigts ?",o:["Quasiment rien, il doit être caché","Environ 2 à 3 millimètres","La moitié du médiator","Au moins 1 centimètre"],a:1,exp:"2 à 3 mm suffisent. Avec plus de pointe, le médiator accroche les cordes et tourne ; avec moins, tu rates les cordes.",xp:25},
  {id:"q-debut-09",courseId:"debut",lessonId:"debut-c1-03",lvl:1,q:"D'où vient principalement le mouvement pour gratter les cordes ?",o:["De l'épaule, tout le bras bouge","Du poignet, aidé par l'avant-bras","Des doigts qui tiennent le médiator","Du coude, qui se soulève de la caisse"],a:1,exp:"L'avant-bras reste posé sur la caisse et le poignet fait l'essentiel du travail. Gratter depuis l'épaule fatigue vite et manque de précision.",xp:25},
  {id:"q-debut-10",courseId:"debut",lessonId:"debut-c1-03",lvl:2,q:"En jeu aux doigts, quel doigt joue habituellement les cordes 6, 5 et 4 ?",o:["L'index","Le majeur","Le pouce","L'annulaire"],a:2,exp:"Le pouce (p) s'occupe des basses, cordes 6, 5 et 4. Index (i), majeur (m) et annulaire (a) se partagent les cordes 3, 2 et 1.",xp:30},
];
