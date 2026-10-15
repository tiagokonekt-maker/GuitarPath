// Leçon du module « debut » + les questions de quiz qui s'y rattachent.
// Format décrit dans src/content/README.md.

export default {
  id: "debut-c1-03", level: 0, unite: 1,
  title: "La main droite : médiator ou doigts",
  duration: 6,
  content: [
    { type: "p", text: "La main gauche choisit les notes, la main droite les fait sonner. C'est elle qui donne le rythme, le volume et le caractère de ce que tu joues. Tu peux jouer avec un médiator (le petit triangle en plastique, qu'on appelle aussi plectre ou « mediator ») ou directement avec les doigts. Les deux sont utiles : commence par le médiator pour gratter tes premiers accords." },
    { type: "h", text: "Tenir le médiator" },
    { type: "p", text: "Plie légèrement l'index. Pose le médiator à plat sur le côté de la dernière phalange de l'index, pointe dirigée vers les cordes, puis referme le pouce par-dessus. Seuls 2 ou 3 millimètres de pointe dépassent. Trop de pointe et le médiator accroche les cordes ; pas assez et tu les rates." },
    { type: "p", text: "La bonne pression : assez pour qu'il ne tourne pas entre tes doigts, pas plus. Pour débuter en grattant des accords, choisis un médiator fin ou médium (entre 0,5 et 0,7 mm environ) : il plie un peu et pardonne les attaques maladroites." },
    { type: "h", text: "Le geste : le poignet, pas tout le bras" },
    { type: "p", text: "Ton avant-bras reste posé sur la caisse. Le mouvement vient surtout du poignet, un peu comme si tu secouais un thermomètre ou que tu faisais sécher tes doigts mouillés, avec l'aide de l'avant-bras. Gratter avec tout le bras depuis l'épaule fatigue vite et manque de précision." },
    { type: "strum_pattern", caption: "Ton premier geste : 4 coups vers le bas, un par temps", data: { pattern: ["B", "B", "B", "B"], beats: 4, style: "folk", bpm: 60 } },
    { type: "p", text: "Essaie sur les cordes à vide (sans main gauche) : 4 coups vers le bas, réguliers, en comptant « 1, 2, 3, 4 » à voix haute. Vise un son égal sur toutes les cordes, ni trop fort ni trop timide." },
    { type: "h", text: "Jouer aux doigts" },
    { type: "p", text: "Sans médiator, le pouce s'occupe des trois cordes graves (6, 5 et 4) et l'index, le majeur et l'annulaire des trois cordes aiguës (3, 2 et 1), un doigt par corde. On note souvent p, i, m, a (pouce, index, majeur, annulaire). Tu peux aussi gratter simplement avec le pouce, ou avec l'ongle de l'index en allers-retours : c'est plus doux qu'un médiator, parfait pour jouer tard le soir." },
    { type: "tip", text: "Le piège n°1 de la main droite : la crispation. Si ton poignet est raide, ton rythme sera raide. Toutes les deux minutes, arrête-toi et secoue la main droite comme pour l'égoutter, puis reprends. Le médiator doit être tenu, pas étranglé." },
  ],
  quiz: ["q-debut-08", "q-debut-09", "q-debut-10"],
};

export const quiz = [
  {id:"q-debut-08",courseId:"debut",lessonId:"debut-c1-03",lvl:1,q:"Combien de pointe du médiator doit dépasser de tes doigts ?",o:["Quasiment rien, il doit être caché","Environ 2 à 3 millimètres","La moitié du médiator","Au moins 1 centimètre"],a:1,exp:"2 à 3 mm suffisent. Avec plus de pointe, le médiator accroche les cordes et tourne ; avec moins, tu rates les cordes.",xp:25},
  {id:"q-debut-09",courseId:"debut",lessonId:"debut-c1-03",lvl:1,q:"D'où vient principalement le mouvement pour gratter les cordes ?",o:["De l'épaule, tout le bras bouge","Du poignet, aidé par l'avant-bras","Des doigts qui tiennent le médiator","Du coude, qui se soulève de la caisse"],a:1,exp:"L'avant-bras reste posé sur la caisse et le poignet fait l'essentiel du travail. Gratter depuis l'épaule fatigue vite et manque de précision.",xp:25},
  {id:"q-debut-10",courseId:"debut",lessonId:"debut-c1-03",lvl:2,q:"En jeu aux doigts, quel doigt joue habituellement les cordes 6, 5 et 4 ?",o:["L'index","Le majeur","Le pouce","L'annulaire"],a:2,exp:"Le pouce (p) s'occupe des basses, cordes 6, 5 et 4. Index (i), majeur (m) et annulaire (a) se partagent les cordes 3, 2 et 1.",xp:30},
];
