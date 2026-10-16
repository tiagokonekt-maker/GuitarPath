// Leçon du module « neck » + les questions de quiz qui s'y rattachent.
// Format « leçon en cartes » décrit dans src/content/README.md.

const CORDE_6 = {
  type: "note_grid",
  caption: "Corde 6 complète — notes naturelles (colorées) et demi-tons (gris)",
  data: {
    string: 6, stringName: "Mi grave", maxFret: 12,
    highlights: [
      { fret: 0,  label: "Mi",  color: "amber" },
      { fret: 1,  label: "Fa",  color: "green" },
      { fret: 3,  label: "Sol", color: "green" },
      { fret: 5,  label: "La",  color: "amber" },
      { fret: 7,  label: "Si",  color: "green" },
      { fret: 8,  label: "Do",  color: "primary" },
      { fret: 10, label: "Ré",  color: "green" },
      { fret: 12, label: "Mi",  color: "amber" },
    ],
  },
};

export default {
  id: "neck-c2-01", level: 3,
  title: "Les notes de la corde de Mi grave (corde 6)",
  duration: 7,
  gropiTip: "Repère imparable : sur la corde 6, le point de la case 7 tombe sur Si, et la case juste après donne Do. « Point 7 = Si, case 8 = Do » : plus jamais de doute sur le Do grave.",
  cartes: [
    { type: "idee", titre: "Ta corde-ancre", texte: [
      "La corde 6 porte la fondamentale de la plupart des accords barrés : la connaître, c'est tenir une bonne partie du manche.",
      "Ses notes naturelles : Mi (0), Fa (1), Sol (3), La (5), Si (7), Do (8), Ré (10), Mi (12). Entre elles, les cases grises : Fa#, Sol#, La#, Do#, Ré#.",
    ], bloc: CORDE_6 },
    { type: "question", quizId: "q-base-16" },
    { type: "idee", titre: "Deux paires collées", texte: [
      "Entre deux notes naturelles, il y a en général deux cases : un ton. Deux paires font exception, avec une seule case d'écart : Mi-Fa et Si-Do.",
      "Ce sont les deux demi-tons naturels. Ils sont au même endroit de la suite des notes sur toutes les cordes.",
    ] },
    { type: "question", quizId: "q-neck-p34-02" },
    { type: "idee", titre: "Ancres et voisins", texte: [
      "Tu cherches Do ? Juste après Si, sous le point de la case 7 : case 8. Fa# ? Juste après Fa : case 2. Ré ? Deux cases après Do : case 10.",
      "Avec les ancres et leurs voisines, chaque note se trouve en moins de deux secondes.",
    ] },
    { type: "idee", titre: "Le nom de tes barrés", texte: [
      "Un barré en forme de Mi prend le nom de la note sous l'index, sur la corde 6. Barré en case 5 : La majeur. En case 7 : Si majeur.",
      "Connaître cette corde, c'est transposer n'importe quel barré.",
    ] },
    { type: "question", quizId: "q-neck-42" },
    { type: "a-toi", titre: "La corde 6 à voix haute",
      consigne: "Joue la corde 6 case par case, de 0 à 12, en nommant chaque note à voix haute, puis redescends. Ensuite, vise au hasard Sol, Do, Ré et La# : moins de deux secondes chacune.",
      bloc: CORDE_6, minuteur: 90 },
    { type: "question", quizId: "q-neck-03" },
    { type: "recap", points: [
      "Corde 6 : Mi 0, Fa 1, Sol 3, La 5, Si 7, Do 8, Ré 10, Mi 12.",
      "Mi-Fa et Si-Do sont collés (une case) ; ailleurs, deux cases.",
      "Un barré en forme de Mi porte le nom de sa note sur la corde 6.",
    ] },
  ],
  quiz: ["q-base-16","q-neck-03","q-neck-42","q-neck-p34-02"],
};

export const quiz = [
  {id:"q-base-16",courseId:"neck",lessonId:"neck-c2-01",lvl:2,q:"Sur la corde de Mi grave (corde 6), quelle note trouve-t-on case 3 ?",o:["Fa","La","Fa#","Sol"],a:3,exp:"Depuis Mi à vide : case 1 Fa, case 2 Fa#, case 3 Sol. C'est cette corde qui porte la fondamentale des accords barrés en forme de Mi.",xp:35},
  {id:"q-neck-42",courseId:"neck",lessonId:"neck-c2-01",lvl:2,q:"Un accord barré en forme de Mi, barré à la case 8, donne quel accord majeur ?",o:["Do majeur","Si majeur","Ré majeur","La majeur"],a:0,exp:"En forme de Mi, la fondamentale est sur la corde 6, sous le barré. Corde 6 case 8 = Do : c'est un Do majeur. Case 5 donnerait La, case 7 Si, case 10 Ré.",xp:40},
  {id:"q-neck-p34-02",courseId:"neck",lessonId:"neck-c2-01",lvl:2,q:"Sur la corde 6, entre quelles cases tombe le demi-ton naturel Si-Do ?",o:["Cases 7 et 8","Cases 8 et 9","Cases 6 et 7","Cases 4 et 5"],a:0,exp:"Corde 6 : Si en case 7, Do en case 8, une seule case d'écart. L'autre demi-ton naturel, Mi-Fa, tombe entre la corde à vide et la case 1.",xp:35},
];
