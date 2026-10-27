// Leçon du module « scales » + les questions de quiz qui s'y rattachent.
// Format « leçon en cartes » décrit dans src/content/README.md.
// Lot 4 : les formes en 3 notes par corde (3NPS), en fin de palier 8, après
// les sept modes (scales-c5-01 … scales-c5-07) : chaque forme démarre sur
// un degré, donc sur un mode.

// Hauteur des cordes à vide, corde 6 → corde 1 (Mi La Ré Sol Si Mi).
const VIDE = [4, 9, 2, 7, 11, 4];
const NOM = { 0: "Do", 2: "Ré", 4: "Mi", 6: "Fa#", 7: "Sol", 9: "La", 11: "Si" };
const SOL = 7;

/** Une forme 3NPS de Sol majeur : trois cases par corde, de la corde 6 à la corde 1. */
function forme(caption, cases) {
  const noteMap = {};
  const strings = cases.map((frets, idx) => {
    for (const fr of frets) noteMap[`${fr},${idx}`] = NOM[(VIDE[idx] + fr) % 12];
    return { frets, root: frets.filter(fr => (VIDE[idx] + fr) % 12 === SOL) };
  });
  const toutes = cases.flat();
  return {
    type: "scale_pattern", caption,
    data: { startFret: Math.min(...toutes), endFret: Math.max(...toutes), rootColor: "amber", noteColor: "primary", strings, noteMap },
  };
}

const FORME_1 = forme("Gamme de Sol majeur — forme 1 en 3NPS, départ sur Sol (case 3)",
  [[3, 5, 7], [3, 5, 7], [4, 5, 7], [4, 5, 7], [5, 7, 8], [5, 7, 8]]);
const FORME_2 = forme("Gamme de Sol majeur — forme 2 en 3NPS, départ sur La (case 5) : La dorien",
  [[5, 7, 8], [5, 7, 9], [5, 7, 9], [5, 7, 9], [7, 8, 10], [7, 8, 10]]);
const FORME_3 = forme("Gamme de Sol majeur — forme 3 en 3NPS, départ sur Si (case 7) : Si phrygien",
  [[7, 8, 10], [7, 9, 10], [7, 9, 10], [7, 9, 11], [8, 10, 12], [8, 10, 12]]);

const ALTERNE_FORME_1 = {
  type: "tab",
  caption: "La forme 1 en montant : trois notes par corde, en triolets",
  text: "Tab — corde 6 cases 3, 5, 7 ; corde 5 cases 3, 5, 7 ; corde 4 cases 4, 5, 7 ; corde 3 cases 4, 5, 7 ; corde 2 cases 5, 7, 8 ; corde 1 cases 5, 7, 8. De Sol (corde 6 case 3) à Do (corde 1 case 8).",
  data: { lines: [
    "e|------------------------------5-7-8-|",
    "B|------------------------5-7-8-------|",
    "G|------------------4-5-7-------------|",
    "D|------------4-5-7-------------------|",
    "A|------3-5-7-------------------------|",
    "E|3-5-7-------------------------------|",
  ] },
};

export default {
  id: "scales-3nps-01", level: 8,
  title: "Les gammes en 3 notes par corde (3NPS)",
  duration: 10,
  gropiTip: "Dans la forme 1, repère les trois Sol : Sol (corde 6 case 3), Sol (corde 4 case 5) et Sol (corde 2 case 8). Marque-les d'un accent en jouant : ces repères t'évitent de te perdre quand les formes s'enchaînent.",
  cartes: [
    { type: "idee", titre: "Pourquoi trois notes par corde", texte: [
      "Dans les positions classiques, certaines cordes ont deux notes, d'autres trois : la main droite change sans cesse de schéma.",
      "En 3NPS, chaque corde a exactement trois notes. Le geste se répète : idéal pour le médiator alterné, le legato et la vitesse.",
    ] },
    { type: "idee", titre: "Sept formes", texte: [
      "La gamme majeure a sept notes ; chaque forme 3NPS démarre sur l'une d'elles, sur la corde 6.",
      "En Sol majeur : sur Sol, La, Si, Do, Ré, Mi et Fa#. Elles s'emboîtent le long du manche, chacune chevauchant la suivante.",
    ] },
    { type: "question", quizId: "q-scales-3nps-01-lot4" },
    { type: "idee", titre: "Forme 1, sur Sol", texte: [
      "Départ sur Sol (corde 6 case 3), arrivée sur Do (corde 1 case 8). L'écart est large : six cases.",
      "Ouvre la main, laisse le pouce descendre derrière le manche, et accepte de glisser légèrement d'une case sur les cordes 3 à 1.",
    ], bloc: FORME_1 },
    { type: "idee", titre: "Forme 2, sur La : le dorien", texte: [
      "Même gamme, départ sur La (corde 6 case 5).",
      "Jouée de La à La, en tournant autour de La, elle fait entendre La dorien : chaque forme 3NPS porte le nom d'un mode.",
    ], bloc: FORME_2 },
    { type: "question", quizId: "q-scales-3nps-02-lot4" },
    { type: "idee", titre: "Forme 3, sur Si : le phrygien", texte: [
      "Départ sur Si (corde 6 case 7). Centrée sur Si, la même gamme sonne Si phrygien.",
      "Les formes suivantes partent de Do (lydien), Ré (mixolydien), Mi (éolien) et Fa# (locrien) : continue le motif à la case suivante.",
    ], bloc: FORME_3 },
    { type: "a-toi", titre: "Alterné, de 60 à 90",
      consigne: "Forme 1 en montant puis en descendant, médiator alterné strict, trois notes par temps. Commence à 60. Deux passages propres de suite : +10 BPM, jusqu'à 90. Puis en legato : une attaque par corde, les deux autres notes en hammer-on.",
      bloc: ALTERNE_FORME_1, bpm: 60, minuteur: 300 },
    { type: "question", quizId: "q-scales-3nps-03-lot4" },
    { type: "recap", points: [
      "3NPS : trois notes sur chaque corde, un geste régulier pour les deux mains.",
      "Sept formes, une par note de la gamme : chacune démarre sur un mode.",
      "Médiator alterné en triolets de 60 à 90 BPM, puis la version legato.",
    ] },
  ],
  quiz: ["q-scales-3nps-01-lot4","q-scales-3nps-02-lot4","q-scales-3nps-03-lot4"],
};

export const quiz = [
  {id:"q-scales-3nps-01-lot4",courseId:"scales",lessonId:"scales-3nps-01",lvl:3,q:"Combien de formes 3NPS faut-il pour couvrir une gamme majeure sur tout le manche ?",o:["7","5","3","12"],a:0,exp:"Une forme par note de la gamme, soit sept : chacune démarre sur un degré différent, sur la corde 6. Cinq, c'est le nombre de positions de la pentatonique (et du système CAGED).",xp:40},
  {id:"q-scales-3nps-02-lot4",courseId:"scales",lessonId:"scales-3nps-01",lvl:3,q:"Tu joues Sol majeur en 3NPS à partir de Si sur la corde 6. Si Si reste ton centre, quel mode fais-tu entendre ?",o:["Si phrygien","Si locrien","Si dorien","Si éolien"],a:0,exp:"Si est le 3e degré de Sol majeur : centré sur Si, on entend le 3e mode, le phrygien (Si Do Ré Mi Fa# Sol La). Le locrien partirait de Fa#, le dorien de La, l'éolien de Mi.",xp:45},
  {id:"q-scales-3nps-03-lot4",courseId:"scales",lessonId:"scales-3nps-01",lvl:3,q:"En 3NPS au médiator alterné strict, comment est attaquée la première note de chaque nouvelle corde ?",o:["Une corde vers le bas, la suivante vers le haut","Toujours vers le bas","Toujours vers le haut","Au hasard, selon la position de la main"],a:0,exp:"Trois notes, c'est un nombre impair : bas-haut-bas sur une corde, donc haut-bas-haut sur la suivante. Le sens d'attaque alterne d'une corde à l'autre, ce qui demande de travailler les deux passages de corde.",xp:40},
];
