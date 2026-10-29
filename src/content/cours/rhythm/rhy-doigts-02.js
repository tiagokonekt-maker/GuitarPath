// Leçon du module « rhythm » + les questions de quiz qui s'y rattachent.
// Format « leçon en cartes » décrit dans src/content/README.md.
// Le picking Travis : basse alternée au pouce sur Do et Sol, notes aiguës
// sur les contretemps, puis une petite mélodie pincée sur la corde 1.
// Suite des doigts p-i-m-a (rhy-doigts-01, palier 5).

const DO = { type: "chord_diagram", caption: "Do (x32010) : le pouce alterne la corde 5 et la corde 4", data: { name: "C", frets: [-1, 3, 2, 0, 1, 0], fingers: [0, 3, 2, 0, 1, 0], startFret: 1 } };
const SOL = { type: "chord_diagram", caption: "Sol (320033) : le pouce alterne la corde 6 et la corde 4", data: { name: "G", frets: [3, 2, 0, 0, 3, 3], fingers: [2, 1, 0, 0, 3, 4], startFret: 1 } };

const TAB_BASSES = {
  type: "tab",
  caption: "Le pouce seul : une basse par temps, Do puis Sol",
  text: "Tab — Do : corde 5 case 3, corde 4 case 2, corde 5 case 3, corde 4 case 2. Sol : corde 6 case 3, corde 4 à vide, corde 6 case 3, corde 4 à vide. Une note par temps.",
  data: { lines: [
    "e|----------------|----------------|",
    "B|----------------|----------------|",
    "G|----------------|----------------|",
    "D|----2-------2---|----0-------0---|",
    "A|3-------3-------|----------------|",
    "E|----------------|3-------3-------|",
  ] },
};

const TAB_ENTRE = {
  type: "tab",
  caption: "Basses sur les temps, notes aiguës sur les « et »",
  text: "Tab — Do : les basses de la corde 5 case 3 et de la corde 4 case 2 sur les temps ; corde 3 à vide et corde 2 case 1 sur les « et ». Sol : basses corde 6 case 3 et corde 4 à vide ; corde 3 à vide et corde 2 case 3 sur les « et ».",
  data: { lines: [
    "e|----------------|----------------|",
    "B|------1-------1-|------3-------3-|",
    "G|--0-------0-----|--0-------0-----|",
    "D|----2-------2---|----0-------0---|",
    "A|3-------3-------|----------------|",
    "E|----------------|3-------3-------|",
  ] },
};

const TAB_MELODIE = {
  type: "tab",
  caption: "Travis complet : la mélodie pincée sur la corde 1, avec la basse",
  text: "Tab — comme la précédente, avec en plus la corde 1 pincée en même temps que la basse. Do : corde 1 à vide sur le temps 1, corde 1 case 3 sur le temps 3. Sol : corde 1 case 3 sur le temps 1.",
  data: { lines: [
    "e|0-------3-------|3---------------|",
    "B|------1-------1-|------3-------3-|",
    "G|--0-------0-----|--0-------0-----|",
    "D|----2-------2---|----0-------0---|",
    "A|3-------3-------|----------------|",
    "E|----------------|3-------3-------|",
  ] },
};

export default {
  id: "rhy-doigts-02", level: 7,
  title: "Le picking Travis : le pouce alterné",
  duration: 10,
  gropiTip: "Commence chaque séance par trente secondes de pouce seul, en chantonnant autre chose : s'il tient sans que tu y penses, il est prêt à porter la mélodie.",
  cartes: [
    { type: "idee", titre: "Un pouce métronome", texte: [
      "Le picking Travis, du nom du guitariste Merle Travis, repose sur le pouce : il alterne deux basses, une par temps, sans jamais s'arrêter. Les doigts ajoutent les notes aiguës par-dessus.",
      "Sur Do, le pouce alterne Do (corde 5 case 3) et Mi (corde 4 case 2) : corde 5, corde 4, corde 5, corde 4.",
    ], bloc: DO },
    { type: "question", quizId: "q-rhy-travis-01-lot3" },
    { type: "idee", titre: "Les basses de Sol", texte: [
      "Sur Sol, joué 320033, le pouce alterne Sol (corde 6 case 3) et la corde 4 à vide, Ré.",
      "Les basses sautent une corde : 6, 4, 6, 4. Garde le pouce souple, il rebondit de l'une à l'autre sans que la main bouge.",
    ], bloc: SOL },
    { type: "a-toi", titre: "Le pouce seul",
      consigne: "Do une mesure, Sol une mesure : uniquement les basses, une par clic, à 70. Deux minutes sans que le pouce ne s'arrête, même au changement d'accord.",
      bloc: TAB_BASSES, bpm: 70, minuteur: 120 },
    { type: "idee", titre: "Une note entre les basses", texte: [
      "Ajoute l'index et le majeur sur les « et » : entre deux basses, une note aiguë, corde 3 puis corde 2.",
      "Le pouce tient les temps, les doigts se glissent sur les contretemps : basse, aigu, basse, aigu.",
    ], bloc: TAB_ENTRE },
    { type: "question", quizId: "q-rhy-travis-02-lot3" },
    { type: "idee", titre: "La mélodie par-dessus", texte: [
      "Dernière étape : l'annulaire pince la corde 1 en même temps que la basse, sur les temps 1 et 3.",
      "Sur Do : Mi (corde 1 à vide), puis Sol (corde 1 case 3) avec l'auriculaire. Sur Sol : Sol (corde 1 case 3). Le pouce, lui, continue exactement comme avant.",
    ], bloc: TAB_MELODIE },
    { type: "a-toi", titre: "Travis complet",
      consigne: "Do une mesure, Sol une mesure, au clic à 60 : un clic par basse. D'abord basses et notes des « et », puis ajoute la mélodie pincée. Si le pouce hésite, retire la mélodie le temps qu'il se stabilise.",
      bloc: TAB_MELODIE, bpm: 60, minuteur: 180 },
    { type: "question", quizId: "q-rhy-travis-03-lot3" },
    { type: "recap", points: [
      "Le pouce alterne deux basses, une par temps : cordes 5 et 4 sur Do, 6 et 4 sur Sol.",
      "Les doigts jouent les notes aiguës sur les « et », entre les basses.",
      "La mélodie se pince avec la basse ; si le pouce flanche, on la retire et on ralentit.",
    ] },
  ],
  quiz: ["q-rhy-travis-01-lot3", "q-rhy-travis-02-lot3", "q-rhy-travis-03-lot3"],
};

export const quiz = [
  {id:"q-rhy-travis-01-lot3",courseId:"rhythm",lessonId:"rhy-doigts-02",lvl:2,q:"En picking Travis sur Do, entre quelles cordes le pouce alterne-t-il ?",o:["Cordes 5 et 4","Cordes 6 et 5","Cordes 4 et 3","Cordes 3 et 2"],a:0,exp:"La fondamentale Do est sur la corde 5, case 3 ; la basse suivante, Mi, sur la corde 4, case 2. Le pouce va de l'une à l'autre.",xp:30},
  {id:"q-rhy-travis-02-lot3",courseId:"rhythm",lessonId:"rhy-doigts-02",lvl:2,q:"Dans le picking Travis de base, où tombent les notes aiguës jouées aux doigts ?",o:["Sur les « et », entre les basses","Sur les temps, avec les basses","Seulement sur le temps 1","Seulement en fin de mesure"],a:0,exp:"Le pouce tient les temps 1, 2, 3, 4 ; les doigts se glissent sur les contretemps. Une note de mélodie peut ensuite être pincée avec une basse.",xp:30},
  {id:"q-rhy-travis-03-lot3",courseId:"rhythm",lessonId:"rhy-doigts-02",lvl:2,q:"Ton pouce s'arrête dès que tu ajoutes la mélodie. Que fais-tu ?",o:["Tu retires la mélodie et ralentis","Tu joues la mélodie plus fort","Tu supprimes une basse sur deux","Tu accélères pour garder l'élan"],a:0,exp:"Le pouce est la base du picking Travis : on le stabilise d'abord, seul puis avec les notes des « et », et on réintroduit la mélodie à un tempo plus lent.",xp:30},
];
