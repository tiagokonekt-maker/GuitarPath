// Leçon du module « rhythm » + les questions de quiz qui s'y rattachent.
// Format « leçon en cartes » décrit dans src/content/README.md.
// Les mesures à trois : la valse en 3/4 (basse, gratté, gratté) et le 6/8
// (deux pulsations de trois croches), en arpège comme House of the Rising
// Sun. Vient après les doigts p-i-m-a (rhy-doigts-01, même palier).

const TROIS_TEMPS = { type: "strum_pattern", caption: "3/4 : trois coups par mesure, le premier appuyé", data: { pattern: ["B", "B", "B"], beats: 3, style: "folk", bpm: 90 } };
const SIX_HUIT = { type: "strum_pattern", caption: "6/8 : six croches en deux groupes de trois, appuis sur 1 et sur 4", data: { pattern: ["B", "B", "B", "B", "B", "B"], beats: 2, style: "folk", bpm: 50 } };

const TAB_VALSE = {
  type: "tab",
  caption: "Valse : la basse sur 1, deux grattés légers sur 2 et 3 (Do, Do, Sol, Sol)",
  text: "Tab — Do : corde 5 case 3 seule sur le temps 1, puis cordes 3, 2, 1 ensemble (à vide, case 1, à vide) sur les temps 2 et 3, deux mesures. Sol : corde 6 case 3 sur le temps 1, puis cordes 3, 2, 1 (à vide, à vide, case 3) sur 2 et 3, deux mesures.",
  data: { lines: [
    "e|----0---0---|----0---0---|----3---3---|----3---3---|",
    "B|----1---1---|----1---1---|----0---0---|----0---0---|",
    "G|----0---0---|----0---0---|----0---0---|----0---0---|",
    "D|------------|------------|------------|------------|",
    "A|3-----------|3-----------|------------|------------|",
    "E|------------|------------|3-----------|3-----------|",
  ] },
};

const TAB_SIX_HUIT = {
  type: "tab",
  caption: "Arpège en 6/8 : La mineur puis Do, une note par croche",
  text: "Tab — La mineur : corde 5 à vide, corde 3 case 2, corde 2 case 1, corde 1 à vide, corde 2 case 1, corde 3 case 2. Do : corde 5 case 3, corde 3 à vide, corde 2 case 1, corde 1 à vide, corde 2 case 1, corde 3 à vide.",
  data: { lines: [
    "e|------0-----|------0-----|",
    "B|----1---1---|----1---1---|",
    "G|--2-------2-|--0-------0-|",
    "D|------------|------------|",
    "A|0-----------|3-----------|",
    "E|------------|------------|",
  ] },
};

export default {
  id: "rhy-mes-01", level: 5,
  title: "Valse et 6/8 à la guitare",
  duration: 9,
  gropiTip: "Pour sentir le 6/8, dis « a-na-nas, a-na-nas » en jouant : deux groupes de trois syllabes, l'appui sur chaque « a ». Ton pied ne tape que sur ces deux appuis.",
  cartes: [
    { type: "idee", titre: "Compter jusqu'à trois", texte: [
      "Une valse compte ses mesures par trois : UN-deux-trois, UN-deux-trois. C'est la mesure à 3/4, trois noires par mesure.",
      "Le premier temps porte l'appui, les deux autres répondent, plus légers.",
    ], bloc: TROIS_TEMPS },
    { type: "idee", titre: "Basse, gratté, gratté", texte: [
      "À la guitare, le temps 1 se joue avec la basse seule : la fondamentale de l'accord, au pouce ou au médiator.",
      "Sur 2 et 3, deux petits grattés vers le bas, sur les trois cordes aiguës seulement. Pour Do : basse Do (corde 5 case 3), puis cordes 3, 2 et 1.",
    ], bloc: TAB_VALSE },
    { type: "question", quizId: "q-rhy-valse-01-app" },
    { type: "a-toi", titre: "Ta première valse",
      consigne: "Do, Do, Sol, Sol : basse puis deux grattés, au clic à 90, un clic par temps. Compte « UN-deux-trois » à voix haute pendant les deux premiers tours.",
      bloc: TAB_VALSE, bpm: 90, minuteur: 120 },
    { type: "idee", titre: "Le 6/8 : deux grands temps", texte: [
      "En 6/8, six croches se groupent par trois : UN-deux-trois-QUATRE-cinq-six. Deux pulsations par mesure, sur 1 et sur 4.",
      "Le 3/4 contient aussi six croches, mais groupées par deux : UN-et-deux-et-trois-et, trois pulsations. Même nombre de notes, un tout autre balancement.",
    ], bloc: SIX_HUIT },
    { type: "question", quizId: "q-rhy-valse-02-app" },
    { type: "idee", titre: "L'arpège en 6/8", texte: [
      "House of the Rising Sun se joue ainsi : sur La mineur, la basse au pouce, puis les cordes 3, 2, 1, 2, 3, une note par croche.",
      "La basse tombe sur la première pulsation, la corde 1 sur la seconde : ce sont elles qu'on appuie un peu.",
    ], bloc: TAB_SIX_HUIT },
    { type: "a-toi", titre: "Six croches, deux appuis",
      consigne: "La mineur puis Do, une mesure chacun, une note par croche. Le clic, à 50, marque les deux pulsations : basse sur l'un, corde 1 sur l'autre. Compte « UN-deux-trois-QUATRE-cinq-six ».",
      bloc: TAB_SIX_HUIT, bpm: 50, minuteur: 120 },
    { type: "question", quizId: "q-rhy-valse-03-lot3" },
    { type: "recap", points: [
      "3/4 : trois temps, appui sur le 1 ; à la guitare, basse puis deux grattés légers.",
      "6/8 : six croches groupées par trois, deux pulsations, sur 1 et sur 4.",
      "Même nombre de croches en 3/4 et en 6/8 : c'est leur groupement qui change le balancement.",
    ] },
  ],
  quiz: ["q-rhy-valse-01-lot3", "q-rhy-valse-02-lot3", "q-rhy-valse-03-lot3", "q-rhy-valse-01-app", "q-rhy-valse-02-app"],
};

export const quiz = [
  {id:"q-rhy-valse-01-lot3",courseId:"rhythm",lessonId:"rhy-mes-01",lvl:1,q:"En valse « basse, gratté, gratté », sur quel temps joues-tu la basse ?",o:["Sur le temps 1","Sur le temps 2","Sur le temps 3","Sur les temps 1 et 3"],a:0,exp:"La basse marque le premier temps, l'appui de la mesure ; les temps 2 et 3 sont les deux grattés plus légers.",xp:25},
  {id:"q-rhy-valse-01-app",courseId:"rhythm",lessonId:"rhy-mes-01",lvl:1,q:"Valse sur l'accord de Sol : quelle note joues-tu à la basse, sur le temps 1 ?",o:["Sol","Ré","Si","Do"],a:0,exp:"Le temps 1 porte la basse seule, la fondamentale de l'accord : Sol (corde 6 case 3). Les temps 2 et 3 sont les deux grattés légers.",xp:25},
  {id:"q-rhy-valse-02-lot3",courseId:"rhythm",lessonId:"rhy-mes-01",lvl:1,q:"En 6/8, combien de pulsations le pied bat-il par mesure ?",o:["Deux","Trois","Six","Quatre"],a:0,exp:"Six croches groupées par trois donnent deux pulsations, sur 1 et sur 4. Le 3/4, lui, en a trois.",xp:25},
  {id:"q-rhy-valse-02-app",courseId:"rhythm",lessonId:"rhy-mes-01",lvl:2,q:"En 12/8, les douze croches se groupent par trois. Combien de pulsations le pied bat-il par mesure ?",o:["4","3","6","12"],a:0,exp:"Comme en 6/8, chaque pulsation regroupe trois croches : douze croches font quatre pulsations, sur 1, 4, 7 et 10. C'est le balancement du blues lent.",xp:30},
  {id:"q-rhy-valse-03-lot3",courseId:"rhythm",lessonId:"rhy-mes-01",lvl:2,q:"Une mesure contient six croches, groupées 1-2-3 puis 4-5-6. Quelle mesure est-ce ?",o:["Du 6/8","Du 3/4","Du 4/4","Du 12/8"],a:0,exp:"Groupées par trois, les six croches font deux pulsations : c'est le 6/8. Groupées par deux, elles feraient les trois temps d'un 3/4.",xp:30},
];
