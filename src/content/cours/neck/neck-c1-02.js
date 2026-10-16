// Leçon du module « neck » + les questions de quiz qui s'y rattachent.
// Format « leçon en cartes » décrit dans src/content/README.md.

const EM = { type: "chord_diagram", caption: "Mi mineur (Em) — 022000 : trois Mi, sur les cordes 6, 4 et 1", data: { name: "Em", frets: [0, 2, 2, 0, 0, 0], fingers: [0, 2, 3, 0, 0, 0], startFret: 1 } };

export default {
  id: "neck-c1-02", level: 2,
  title: "La logique des octaves",
  duration: 6,
  gropiTip: "Avant-goût du chapitre 3 : depuis la corde 6, l'octave la plus proche est deux cordes plus haut et deux cases plus loin. La corde 6 case 5 (La) → La corde 4 case 7.",
  cartes: [
    { type: "idee", titre: "+12 cases = une octave", texte: [
      "Sur n'importe quelle corde, monter de 12 cases redonne la même note, une octave plus aiguë.",
      "Mi à vide sur la corde 6, Mi case 12, Mi case 24 si ta guitare en a autant. D'où le double point de la case 12 : tu es une octave au-dessus de la corde à vide.",
    ] },
    { type: "question", quizId: "q-base-08" },
    { type: "a-toi", titre: "Deux fois le même Mi", consigne: "Sur la corde 6, joue la corde à vide puis la case 12, plusieurs fois au clic. Même nom, autre hauteur. Fais pareil sur la corde 5 : La à vide, puis La case 12.", bpm: 60 },
    { type: "question", quizId: "q-neck-38" },
    { type: "idee", titre: "L'octave sur une autre corde", texte: [
      "Pas besoin de monter si haut : l'octave se trouve aussi sur une autre corde.",
      "Mi existe à six endroits pour trois hauteurs : grave (corde 6 à vide), médium (corde 5 case 7, corde 4 case 2), aigu (corde 3 case 9, corde 2 case 5, corde 1 à vide).",
    ], bloc: {
      type: "fretboard",
      caption: "Mi à 3 octaves — même note, 3 timbres différents (grave → aigu)",
      data: {
        frets: 13, startFret: 0,
        showStringNames: true, showFretNumbers: true,
        markerFrets: [3, 5, 7, 9, 12],
        notes: [
          { string: 6, fret: 0,  label: "Mi", color: "amber", root: true },
          { string: 5, fret: 7,  label: "Mi", color: "amber", root: true },
          { string: 4, fret: 2,  label: "Mi", color: "amber", root: true },
          { string: 3, fret: 9, label: "Mi", color: "amber", root: true },
          { string: 2, fret: 5,  label: "Mi", color: "amber", root: true },
          { string: 1, fret: 0,  label: "Mi", color: "amber", root: true },
        ],
      },
    } },
    { type: "question", quizId: "q-neck-39" },
    { type: "idee", titre: "Tu en joues déjà trois", texte: [
      "Ton Mi mineur contient trois Mi : corde 6 à vide, corde 4 case 2, corde 1 à vide. Trois octaves dans un seul accord.",
      "Choisir l'octave, c'est choisir un timbre : en solo, rejouer une phrase une octave plus haut fait monter l'intensité.",
    ], bloc: EM },
    { type: "a-toi", titre: "Les Mi de ton Mi mineur", consigne: "Pose Em et joue seulement les cordes 6, 4 et 1 : trois Mi, du grave à l'aigu. Ensuite, sans accord, retrouve les trois autres : corde 5 case 7, corde 3 case 9, corde 2 case 5.", bloc: EM, bpm: 60 },
    { type: "recap", points: [
      "Même corde, +12 cases = la même note une octave plus haut.",
      "Une note existe aussi à l'octave sur d'autres cordes, sans monter si haut.",
      "Même note, autre corde ou autre octave = un autre timbre.",
    ] },
  ],
  quiz: ["q-base-08","q-neck-38","q-neck-39"],
};

export const quiz = [
  {id:"q-base-08",courseId:"neck",lessonId:"neck-c1-02",lvl:1,q:"Sur une même corde, combien de cases faut-il monter pour retrouver la même note à l'octave ?",o:["7","8","10","12"],a:3,exp:"12 cases = 12 demi-tons = une octave complète. La note porte le même nom, une octave plus haut.",xp:30},
  {id:"q-neck-38",courseId:"neck",lessonId:"neck-c1-02",lvl:1,q:"Tu joues Sol sur la corde 6, case 3. Où rejoues-tu ce Sol une octave plus haut, sur la même corde ?",o:["Case 15","Case 12","Case 10","Case 13"],a:0,exp:"Même corde, +12 cases = une octave : 3 + 12 = 15. Le nom de la note ne change pas, seule sa hauteur double.",xp:30},
  {id:"q-neck-39",courseId:"neck",lessonId:"neck-c1-02",lvl:2,q:"Le Mi de la corde 6 à vide se retrouve une octave plus haut sur la corde 5. À quelle case ?",o:["Case 7","Case 5","Case 2","Case 12"],a:0,exp:"Mi (corde 5, case 7) sonne une octave au-dessus de la corde 6 à vide. Le même Mi existe aussi sur la corde 4, case 2 : deux positions pour une même hauteur.",xp:40},
];
