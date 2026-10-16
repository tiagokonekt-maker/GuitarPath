// Leçon du module « neck » + les questions de quiz qui s'y rattachent.
// Format « leçon en cartes » décrit dans src/content/README.md.

const CORDE_6 = {
  type: "fretboard",
  caption: "Corde 6 — les notes sous les points des cases 3, 5, 7, 9 et 12",
  data: {
    frets: 12, startFret: 0,
    showStringNames: false, showFretNumbers: true,
    markerFrets: [3, 5, 7, 9, 12],
    notes: [
      { string: 6, fret: 3,  label: "Sol", color: "amber" },
      { string: 6, fret: 5,  label: "La",  color: "green" },
      { string: 6, fret: 7,  label: "Si",  color: "neutral" },
      { string: 6, fret: 9,  label: "Do#", color: "neutral" },
      { string: 6, fret: 12, label: "Mi",  color: "amber", root: true },
    ],
  },
};

const CORDES_6_ET_5 = {
  type: "fretboard",
  caption: "Tes ancres sur les cordes 6 et 5 — pars du point le plus proche",
  data: {
    frets: 12, startFret: 0,
    showStringNames: true, showFretNumbers: true,
    markerFrets: [3, 5, 7, 9, 12],
    notes: [
      { string: 6, fret: 3,  label: "Sol", color: "amber" },
      { string: 6, fret: 5,  label: "La",  color: "green" },
      { string: 6, fret: 7,  label: "Si",  color: "neutral" },
      { string: 6, fret: 12, label: "Mi",  color: "amber", root: true },
      { string: 5, fret: 3,  label: "Do",  color: "primary" },
      { string: 5, fret: 5,  label: "Ré",  color: "green" },
      { string: 5, fret: 7,  label: "Mi",  color: "neutral" },
      { string: 5, fret: 12, label: "La",  color: "amber", root: true },
    ],
  },
};

export default {
  id: "neck-c1-03", level: 3,
  title: "Les amers visuels du manche",
  duration: 6,
  gropiTip: "Bonne nouvelle : la corde 1 porte exactement les mêmes notes que la corde 6, deux octaves plus haut. Tes repères Sol (3), La (5), Si (7) et Mi (12) valent pour les deux cordes de Mi.",
  cartes: [
    { type: "idee", titre: "Des points, pas des décorations", texte: [
      "Les points incrustés sur le manche sont tes repères de navigation. Sans eux, toutes les cases se ressemblent.",
      "Presque toutes les guitares les placent aux cases 3, 5, 7, 9 et 12, avec un double point en 12 : l'octave de la corde à vide. Puis le cycle reprend : 15, 17, 19, 21.",
    ] },
    { type: "question", quizId: "q-base-15" },
    { type: "idee", titre: "Quatre notes-repères sur la corde 6", texte: [
      "Sous les points de la corde 6 : Sol en case 3, La en case 5, Si en case 7, et Mi en case 12, l'octave.",
      "Le point de la case 9 tombe sur Do#. Ces quatre repères sont ton GPS.",
    ], bloc: CORDE_6 },
    { type: "question", quizId: "q-neck-40" },
    { type: "idee", titre: "Sur la corde 5", texte: [
      "Mêmes points, autres notes. Do sous le point de la case 3, Ré sous celui de la case 5, La en case 12.",
      "Et sous le point de la case 7 ? Compte deux cases depuis Ré.",
    ] },
    { type: "question", quizId: "q-neck-p34-01" },
    { type: "idee", titre: "Ancrer, puis compter", texte: [
      "N'apprends pas les 12 notes de chaque corde d'un coup. Ancre d'abord celles des points, puis déduis le reste par voisinage.",
      "Une case plus haut : un demi-ton plus haut. Une case plus bas : un demi-ton plus bas.",
    ] },
    { type: "question", quizId: "q-neck-41" },
    { type: "a-toi", titre: "Les yeux fermés",
      consigne: "Ferme les yeux et pose l'index sur la corde 6 ou 5, à une case au hasard entre 1 et 12. Ouvre-les, repère le point le plus proche et nomme la note. Le plus d'essais possible en une minute.",
      bloc: CORDES_6_ET_5, minuteur: 60 },
    { type: "recap", points: [
      "Les points sont aux cases 3, 5, 7, 9 et 12 (double point : l'octave).",
      "Corde 6 : Sol 3, La 5, Si 7, Mi 12. Corde 5 : Do 3, Ré 5, Mi 7, La 12.",
      "Pars du point le plus proche et compte : une case = un demi-ton.",
    ] },
  ],
  quiz: ["q-base-15","q-neck-40","q-neck-41","q-neck-p34-01"],
};

export const quiz = [
  {id:"q-base-15",courseId:"neck",lessonId:"neck-c1-03",lvl:2,q:"Quelle case porte traditionnellement un repère double sur le manche ?",o:["La 7e","La 9e","La 12e","La 5e"],a:2,exp:"Les repères simples sont aux cases 3, 5, 7 et 9 ; la case 12 porte un repère double car elle marque l'octave complète.",xp:35},
  {id:"q-neck-40",courseId:"neck",lessonId:"neck-c1-03",lvl:1,q:"Sur la corde 6, quelle note se trouve sous le point de la case 5 ?",o:["La","Sol","Si","Do"],a:0,exp:"Corde 6 : case 3 = Sol, case 5 = La, case 7 = Si, case 12 = Mi. Ces quatre notes-repères, sous les points, servent d'ancres pour déduire les autres.",xp:30},
  {id:"q-neck-41",courseId:"neck",lessonId:"neck-c1-03",lvl:2,q:"Tu connais Sol à la case 3 de la corde 6. Quelle note joues-tu juste à côté, case 4 ?",o:["Sol#","La","Fa#","Sol♭"],a:0,exp:"Une case plus haut = un demi-ton plus haut : Sol devient Sol# (qu'on peut aussi écrire La♭). C'est la méthode des ancres : partir d'une note connue et compter les cases.",xp:40},
  {id:"q-neck-p34-01",courseId:"neck",lessonId:"neck-c1-03",lvl:1,q:"Sur la corde 5, quelle note se trouve sous le point de la case 7 ?",o:["Mi","Ré","Fa","Do"],a:0,exp:"Corde 5 : Do en case 3, Ré en case 5, puis deux cases plus haut (un ton) Mi en case 7. Les points de la corde 5 donnent Do, Ré, Mi : trois notes qui se suivent.",xp:30},
];
