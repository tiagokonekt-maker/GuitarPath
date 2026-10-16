// Leçon du module « harmony » + les questions de quiz qui s'y rattachent.
// Format « leçon en cartes » décrit dans src/content/README.md.
// Fa par étapes : le petit Fa (xx3211), le changement Do–Fa, puis le Fa
// complet (133211) qui prépare le barré forme Mi (harm-acc-04).

const FA_PETIT = { type: "chord_diagram", caption: "Petit Fa (F) — xx3211 : l'index appuie les cordes 1 et 2", data: { name: "F", frets: [-1, -1, 3, 2, 1, 1], fingers: [0, 0, 3, 2, 1, 1], startFret: 1, barre: { fret: 1, from: 4, to: 5 } } };
const DO = { type: "chord_diagram", caption: "Do (C) — x32010 : le point de départ", data: { name: "C", frets: [-1, 3, 2, 0, 1, 0], fingers: [0, 3, 2, 0, 1, 0], startFret: 1 } };
const FA = { type: "chord_diagram", caption: "Fa complet (F) — 133211 : l'index barre les six cordes", data: { name: "F", frets: [1, 3, 3, 2, 1, 1], fingers: [1, 3, 4, 2, 1, 1], startFret: 1, barre: { fret: 1, from: 0, to: 5 } } };

export default {
  id: "harm-acc-03", level: 4,
  title: "Le petit Fa, puis le Fa complet",
  duration: 9,
  gropiTip: "Si la corde 2 frise dans ton petit Fa, regarde où tombe le pli de ton index : déplace-le d'un millimètre vers la tête ou vers le chevalet, la corde trouvera la partie dure du doigt.",
  cartes: [
    { type: "idee", titre: "Pourquoi Fa fait peur", texte: [
      "Fa n'a pas de forme simple à vide : un doigt doit appuyer plusieurs cordes à la fois. C'est le premier vrai cap du guitariste.",
      "On y va par étapes : le petit Fa d'abord, le Fa complet ensuite.",
    ] },
    { type: "idee", titre: "Le petit Fa (xx3211)", texte: [
      "L'index se couche sur les cordes 1 et 2, case 1. Majeur sur la corde 3 case 2, annulaire sur la corde 4 case 3.",
      "Gratte seulement les quatre cordes aiguës : Fa, La, Do et Fa.",
    ], bloc: FA_PETIT },
    { type: "question", quizId: "q-harm-fa-new-01" },
    { type: "idee", titre: "Faire sonner les cordes 1 et 2", texte: [
      "Place l'index juste derrière la frette, un peu roulé sur son côté, côté pouce : la partie osseuse appuie mieux que la pulpe.",
      "Joue les cordes une par une. Une corde frise ? Rapproche l'index de la frette avant d'appuyer plus fort.",
    ] },
    { type: "idee", titre: "De Do à Fa", texte: [
      "Bonne nouvelle : la forme de Do se décale d'une corde vers l'aigu. L'annulaire passe de la corde 5 à la corde 4, le majeur de la corde 4 à la corde 3, en gardant leurs cases.",
      "L'index reste en case 1 et se couche sur la corde 1.",
    ], bloc: DO },
    { type: "question", quizId: "q-harm-fa-new-02" },
    { type: "a-toi", titre: "Do ↔ petit Fa",
      consigne: "Do, quatre coups, puis petit Fa, quatre coups. Déplace annulaire et majeur ensemble, d'un bloc. Deux minutes au clic : à la fin, le Fa doit sonner dès le premier coup.",
      bloc: FA_PETIT, bpm: 60, minuteur: 120 },
    { type: "idee", titre: "Vers le Fa complet", texte: [
      "C'est la forme de Mi décalée d'une case, l'index jouant le rôle du sillet sur les six cordes. Majeur sur la corde 3 case 2, annulaire sur la corde 5 case 3, auriculaire sur la corde 4 case 3.",
      "Étape intermédiaire : x33211, sans la corde 6. Le petit Fa suffit déjà pour la plupart des chansons.",
    ], bloc: FA },
    { type: "question", quizId: "q-harm-fa-new-03" },
    { type: "recap", points: [
      "Petit Fa (xx3211) : l'index couché sur les cordes 1 et 2, quatre cordes grattées.",
      "De Do à Fa, la forme se décale d'une corde vers l'aigu ; l'index reste en case 1.",
      "Fa complet (133211) = la forme de Mi, une case plus haut, l'index en barré.",
    ] },
  ],
  quiz: ["q-harm-fa-new-01", "q-harm-fa-new-02", "q-harm-fa-new-03"],
};

export const quiz = [
  {id:"q-harm-fa-new-01",courseId:"harmony",lessonId:"harm-acc-03",lvl:1,q:"Dans le petit Fa (xx3211), quel doigt appuie deux cordes à la fois ?",o:["L'index","Le majeur","L'annulaire","L'auriculaire"],a:0,exp:"L'index se couche sur les cordes 1 et 2 en case 1 ; majeur et annulaire n'appuient qu'une corde chacun.",xp:25},
  {id:"q-harm-fa-new-02",courseId:"harmony",lessonId:"harm-acc-03",lvl:2,q:"Pour passer de Do (x32010) au petit Fa (xx3211), que font l'annulaire et le majeur ?",o:["Ils se décalent d'une corde vers l'aigu","Ils montent de deux cases","Ils restent exactement en place","Ils se décalent vers les graves"],a:0,exp:"Annulaire de la corde 5 à la corde 4 (case 3), majeur de la corde 4 à la corde 3 (case 2) : même forme, une corde plus loin.",xp:30},
  {id:"q-harm-fa-new-03",courseId:"harmony",lessonId:"harm-acc-03",lvl:2,q:"Le Fa complet (133211) reprend la forme de quel accord ouvert, une case plus haut ?",o:["Mi","La","Ré","Do"],a:0,exp:"Mi = 022100. Décale-le d'une case et barre la case 1 avec l'index : 133211, c'est Fa.",xp:30},
];
