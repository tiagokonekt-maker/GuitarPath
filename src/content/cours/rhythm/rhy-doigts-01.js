// Leçon du module « rhythm » + les questions de quiz qui s'y rattachent.
// Format « leçon en cartes » décrit dans src/content/README.md.
// Jouer aux doigts : p-i-m-a, un doigt par corde, le pouce sur la basse.
// Arpèges sur Am, C, G, Em (accords ouverts vus en Premiers pas).

const TAB_AM = {
  type: "tab",
  caption: "La mineur en p-i-m-a : basse au pouce, puis cordes 3, 2, 1",
  text: "Tab — La mineur : corde 5 à vide (pouce), corde 3 case 2 (index), corde 2 case 1 (majeur), corde 1 à vide (annulaire). Deux fois par mesure, en croches.",
  data: { lines: [
    "e|------0-------0-|",
    "B|----1-------1---|",
    "G|--2-------2-----|",
    "D|----------------|",
    "A|0-------0-------|",
    "E|----------------|",
  ] },
};

const TAB_GRILLE = {
  type: "tab",
  caption: "La mineur, Do, Sol, Mi mineur : seul le pouce change de corde",
  text: "Tab — une mesure par accord, p-i-m-a deux fois. La mineur : basse corde 5 à vide. Do : basse corde 5 case 3. Sol : basse corde 6 case 3, corde 1 case 3. Mi mineur : basse corde 6 à vide, cordes aiguës à vide.",
  data: { lines: [
    "e|------0-------0-|------0-------0-|------3-------3-|------0-------0-|",
    "B|----1-------1---|----1-------1---|----0-------0---|----0-------0---|",
    "G|--2-------2-----|--0-------0-----|--0-------0-----|--0-------0-----|",
    "D|----------------|----------------|----------------|----------------|",
    "A|0-------0-------|3-------3-------|----------------|----------------|",
    "E|----------------|----------------|3-------3-------|0-------0-------|",
  ] },
};

export default {
  id: "rhy-doigts-01", level: 5,
  title: "Jouer aux doigts : p-i-m-a",
  duration: 9,
  gropiTip: "Avant de jouer, pose l'index, le majeur et l'annulaire sur les cordes 3, 2 et 1, comme sur des touches : la main trouve sa place, et le pouce n'a plus qu'à chercher la basse.",
  cartes: [
    { type: "idee", titre: "Quatre doigts, quatre lettres", texte: [
      "p pour le pouce, i pour l'index, m pour le majeur, a pour l'annulaire : les initiales viennent de l'espagnol, la langue de la guitare classique.",
      "Le pouce joue les basses, cordes 6, 5 et 4. Les trois autres doigts se partagent les aiguës, un doigt par corde : i sur la 3, m sur la 2, a sur la 1.",
    ] },
    { type: "idee", titre: "La main en place", texte: [
      "Poignet légèrement arqué, au-dessus de la rosace. Le pouce pousse sa corde vers le bas, un peu en avant des autres doigts.",
      "L'index, le majeur et l'annulaire tirent leur corde vers la paume, sans la soulever. Pas de médiator : c'est la pulpe du doigt qui fait sonner.",
    ] },
    { type: "question", quizId: "q-rhy-pima-01-lot3" },
    { type: "idee", titre: "Le motif p-i-m-a sur La mineur", texte: [
      "Plaque La mineur. Le pouce joue la corde 5 à vide, la fondamentale. Puis i, m et a montent : cordes 3, 2 et 1.",
      "Quatre notes égales en croches, deux motifs par mesure : p-i-m-a, p-i-m-a.",
    ], bloc: TAB_AM },
    { type: "a-toi", titre: "p-i-m-a au clic",
      consigne: "La mineur, motif p-i-m-a deux fois par mesure, au clic à 60 : deux notes par clic. Chaque note au même volume, le pouce ne cogne pas plus fort que les autres doigts.",
      bloc: TAB_AM, bpm: 60, minuteur: 120 },
    { type: "idee", titre: "Le pouce cherche la basse", texte: [
      "Chaque accord a sa basse : la corde 5 à vide pour La mineur, Do (corde 5 case 3) pour Do, Sol (corde 6 case 3) pour Sol, la corde 6 à vide pour Mi mineur.",
      "La main droite ne change pas : seul le pouce saute de corde. L'index, le majeur et l'annulaire restent sur les cordes 3, 2 et 1.",
    ], bloc: TAB_GRILLE },
    { type: "question", quizId: "q-rhy-pima-02-lot3" },
    { type: "a-toi", titre: "La grille aux doigts",
      consigne: "La mineur, Do, Sol, Mi mineur : une mesure chacun, p-i-m-a deux fois, au clic à 60. Prépare la basse suivante pendant le dernier « a » de la mesure.",
      bloc: TAB_GRILLE, bpm: 60, minuteur: 180 },
    { type: "question", quizId: "q-rhy-pima-03-lot3" },
    { type: "recap", points: [
      "p = pouce sur les basses ; i, m, a = un doigt par corde, sur les cordes 3, 2 et 1.",
      "Le motif p-i-m-a : basse, puis les trois cordes aiguës en montant, en notes égales.",
      "D'un accord à l'autre, seul le pouce change de corde : il cherche la fondamentale.",
    ] },
  ],
  quiz: ["q-rhy-pima-01-lot3", "q-rhy-pima-02-lot3", "q-rhy-pima-03-lot3"],
};

export const quiz = [
  {id:"q-rhy-pima-01-lot3",courseId:"rhythm",lessonId:"rhy-doigts-01",lvl:1,q:"Avec la règle « un doigt par corde », quel doigt joue la corde 2 ?",o:["Le majeur (m)","L'index (i)","L'annulaire (a)","Le pouce (p)"],a:0,exp:"L'index sur la corde 3, le majeur sur la corde 2, l'annulaire sur la corde 1 ; le pouce garde les basses.",xp:25},
  {id:"q-rhy-pima-02-lot3",courseId:"rhythm",lessonId:"rhy-doigts-01",lvl:2,q:"Tu passes de La mineur à Sol en arpège p-i-m-a. Qu'est-ce qui change à la main droite ?",o:["Le pouce passe de la corde 5 à la 6","L'index passe de la corde 3 à la 4","Les trois doigts descendent d'une corde","Rien, le pouce reste sur la corde 5"],a:0,exp:"La basse de Sol est sur la corde 6, case 3 : seul le pouce se déplace. L'index, le majeur et l'annulaire restent sur les cordes 3, 2 et 1.",xp:30},
  {id:"q-rhy-pima-03-lot3",courseId:"rhythm",lessonId:"rhy-doigts-01",lvl:2,q:"En arpège p-i-m-a, ta basse sonne bien plus fort que les trois autres notes. Que corriges-tu ?",o:["Le pouce attaque plus doucement","L'index tire plus fort que les autres","Tu joues la basse avec l'index","Tu grattes la basse au médiator"],a:0,exp:"Un arpège sonne quand ses notes sont égales : on dose l'attaque du pouce plutôt que de forcer les autres doigts.",xp:30},
];
