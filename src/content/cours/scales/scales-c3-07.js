// Leçon du module « scales » + les questions de quiz qui s'y rattachent.
// Format « leçon en cartes » décrit dans src/content/README.md.
// Pentatonique, étape 4 sur 4 : relier les 5 positions de La mineur sur
// tout le manche (cases 5, 8, 10, 12, 15, puis 17 = la position 1 à
// l'octave). S'appuie sur scales-c3-02, -05 et -06 ; les glissés de
// rhy-tech-04 (vus juste avant dans le palier) servent aux changements.

const CARTE_MANCHE = {
  type: "fretboard",
  caption: "Le départ de chaque position sur la corde 6 : La, Do, Ré, Mi, Sol, La",
  data: {
    frets: 14, startFret: 4,
    showStringNames: true, showFretNumbers: true,
    notes: [
      { string: 6, fret: 5, label: "La", color: "amber", root: true },
      { string: 6, fret: 8, label: "Do", color: "primary" },
      { string: 6, fret: 10, label: "Ré", color: "primary" },
      { string: 6, fret: 12, label: "Mi", color: "primary" },
      { string: 6, fret: 15, label: "Sol", color: "primary" },
      { string: 6, fret: 17, label: "La", color: "amber", root: true },
    ],
  },
};

const TAB_DIAGONALE = {
  type: "tab",
  caption: "La diagonale : deux notes par corde, une position de plus à chaque corde",
  text: "Tab — une note par temps : corde 6 cases 5 et 8, corde 5 cases 7 et 10, corde 4 cases 10 et 12, corde 3 cases 12 et 14, corde 2 cases 15 et 17, puis corde 1 case 17, le La aigu.",
  data: { lines: [
    "e|----------------|----------------|--------17------|",
    "B|----------------|----------------|15--17----------|",
    "G|----------------|--------12--14--|----------------|",
    "D|----------------|10--12----------|----------------|",
    "A|--------7---10--|----------------|----------------|",
    "E|5---8-----------|----------------|----------------|",
  ] },
};

export default {
  id: "scales-c3-07", level: 6,
  title: "Relier les 5 positions sur tout le manche",
  duration: 9,
  gropiTip: "Choisis une seule note, le Mi par exemple, et trouve-la dans chacune des cinq positions, de la case 5 à la case 17. Tu relies les formes par ce qu'elles ont en commun.",
  cartes: [
    { type: "idee", titre: "La carte du manche", texte: [
      "Sur la corde 6, chaque position part d'une note de la gamme : La case 5, Do case 8, Ré case 10, Mi case 12, Sol case 15.",
      "Case 17, on retrouve La : c'est la position 1, une octave plus haut. Les cinq formes tournent en boucle.",
    ], bloc: CARTE_MANCHE },
    { type: "question", quizId: "q-scales-relier-01" },
    { type: "idee", titre: "Elles s'emboîtent", texte: [
      "Le haut d'une position est toujours le bas de la suivante : 1 et 2 partagent les cases 7 et 8, 2 et 3 les cases 9 et 10, 3 et 4 les cases 12 et 13.",
      "Tu ne changes jamais de gamme, seulement de zone.",
    ] },
    { type: "idee", titre: "Trois façons de changer", texte: [
      "Changer de doigt sur une note commune, comme dans le raccord 1→2. Glisser vers une note de la position suivante, en gardant le doigt sur la corde. Ou monter deux notes par corde en diagonale.",
      "La diagonale traverse les cinq positions en six cordes.",
    ] },
    { type: "question", quizId: "q-scales-relier-02" },
    { type: "a-toi", titre: "La diagonale",
      consigne: "Du La grave (corde 6, case 5) au La aigu (corde 1, case 17), deux notes par corde, au clic à 60. Puis redescends. Les changements de position se font en glissant l'index vers la note suivante.",
      bloc: TAB_DIAGONALE, bpm: 60, minuteur: 120 },
    { type: "question", quizId: "q-scales-relier-03" },
    { type: "a-toi", titre: "Trois minutes sur tout le manche",
      consigne: "Improvise en La mineur : une phrase courte par position, de la position 1 à la position 1 une octave plus haut, puis redescends. Termine chaque phrase sur un La.",
      bloc: CARTE_MANCHE, bpm: 70, minuteur: 180 },
    { type: "recap", points: [
      "Départs sur la corde 6 : cases 5, 8, 10, 12, 15, puis 17 (position 1 à l'octave).",
      "Le haut d'une position est le bas de la suivante : on change de zone, pas de gamme.",
      "Pour passer d'une forme à l'autre : changer de doigt, glisser, ou la diagonale.",
    ] },
  ],
  quiz: ["q-scales-relier-01", "q-scales-relier-02", "q-scales-relier-03"],
};

export const quiz = [
  {id:"q-scales-relier-01",courseId:"scales",lessonId:"scales-c3-07",lvl:2,q:"En La pentatonique mineure, après la position 5 (case 15), quelle forme trouves-tu à partir de la case 17 ?",o:["La position 1, une octave plus haut","La position 2, une octave plus haut","Une sixième position, propre à l'aigu","La position 4, rejouée plus haut"],a:0,exp:"Case 17 sur la corde 6, c'est La, comme en case 5 : douze cases plus haut, la position 1 recommence. Les cinq formes tournent en boucle.",xp:35},
  {id:"q-scales-relier-02",courseId:"scales",lessonId:"scales-c3-07",lvl:2,q:"Tu passes de la position 3 à la position 4 en La mineur. Quelle case ont-elles en commun ?",o:["Case 12","Case 10","Case 15","Case 8"],a:0,exp:"La position 3 va de la case 9 à la case 13, la position 4 de la case 12 à la case 15 : leurs notes des cases 12 et 13 sont communes.",xp:35},
  {id:"q-scales-relier-03",courseId:"scales",lessonId:"scales-c3-07",lvl:3,q:"Tu improvises en La mineur en position 4, autour de la case 12. Tu veux redescendre vers le grave sans quitter la gamme. Quelle position rejoins-tu ?",o:["La position 3, autour de la case 10","La position 5, autour de la case 15","La position 1, autour de la case 17","Aucune : il faut changer de gamme"],a:0,exp:"Vers le grave, la position voisine de la 4 est la 3 (cases 9 à 13). La 5 et la position 1 à l'octave sont plus haut, vers l'aigu.",xp:40},
];
