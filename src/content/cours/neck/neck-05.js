// Leçon du module « neck » + les questions de quiz qui s'y rattachent.
// Format « leçon en cartes » décrit dans src/content/README.md.

const DO_FONDAMENTAL = {
  type: "chord_diagram",
  caption: "Do majeur — état fondamental sur les cordes 3-2-1 (Do, Mi, Sol)",
  data: { name: "Do", frets: [-1,-1,-1,5,5,3], fingers: [0,0,0,3,4,1], startFret: 3 },
};

export default {
  id: "neck-05", level: 7,
  title: "Triades — l'unité minimale d'harmonie",
  duration: 9,
  gropiTip: "Pour passer d'une triade majeure à mineure, baisse seulement la tierce d'une case. Do sur cordes 3-2-1 (cases 5, 5, 3) devient Do mineur en reculant la corde 2 en case 4 (Mi♭).",
  cartes: [
    { type: "idee", titre: "Trois cordes, un accord", texte: [
      "Tu connais les triades et leurs inversions. Ici, on les pose sur le manche, trois cordes voisines à la fois.",
      "Le set le plus utilisé : cordes 3-2-1, aigu et brillant. Do à l'état fondamental : Do (corde 3 case 5), Mi (corde 2 case 5), Sol (corde 1 case 3).",
    ], bloc: DO_FONDAMENTAL },
    { type: "idee", titre: "Les inversions, plus haut", texte: [
      "1re inversion : Mi (corde 3 case 9), Sol (corde 2 case 8), Do (corde 1 case 8).",
      "2e inversion : Sol (corde 3 case 12), Do (corde 2 case 13), Mi (corde 1 case 12).",
      "C'est toujours la note la plus grave qui nomme la position.",
    ], bloc: {
      type: "chord_diagram",
      caption: "Do majeur — triade en 2e inversion, Sol à la basse (cordes 1-2-3, case 12)",
      data: {
        name: "Do", frets: [-1,-1,-1,12,13,12],
        fingers: [0,0,0,1,3,2], startFret: 11,
      },
    } },
    { type: "question", quizId: "q-neck-15" },
    { type: "idee", titre: "Les autres sets", texte: [
      "Cordes 4-3-2, son plus rond : Do (corde 4 case 10), Mi (corde 3 case 9), Sol (corde 2 case 8).",
      "Cordes 5-4-3, médium-grave, idéal pour les vamps funk : Do (corde 5 case 3), Mi (corde 4 case 2), Sol sur la corde 3 à vide.",
    ], bloc: { type: "fretboard_interactive", mode: "chord", root: "C", chord: "maj", caption: "Do majeur — visualise Do Mi Sol sur tout le manche", displayMode: "notes", lang: "fr", compact: true } },
    { type: "idee", titre: "Majeur ou mineur : une case", texte: [
      "Pour passer de majeur à mineur, baisse seulement la tierce d'un demi-ton.",
      "Sur les cordes 3-2-1, le Mi (corde 2 case 5) recule en case 4 : Mi♭. Do devient Do mineur, les deux autres doigts ne bougent pas.",
    ], bloc: {
      type: "chord_diagram",
      caption: "Do mineur — cordes 3-2-1 : Do, Mi♭, Sol",
      data: { name: "Cm", frets: [-1,-1,-1,5,4,3], fingers: [0,0,0,3,2,1], startFret: 3 },
    } },
    { type: "question", quizId: "q-neck-16" },
    { type: "a-toi", titre: "Trois Do sur le set aigu",
      consigne: "Joue Do à l'état fondamental, puis en 1re et en 2e inversion, et redescends. Quatre temps chacun au clic, en grattant seulement les cordes 3-2-1. Dis à voix haute la note de basse de chaque position.",
      bloc: {
        type: "tab",
        caption: "Do majeur sur les cordes 3-2-1 : fondamental, 1re inversion, 2e inversion, et retour",
        text: "Tab — accords de trois notes : cases 5, 5, 3 (cordes 3, 2, 1) ; puis 9, 8, 8 ; puis 12, 13, 12 ; puis 9, 8, 8 ; puis 5, 5, 3.",
        data: { lines: [
          "e|-3-----8-----12----8-----3-----|",
          "B|-5-----8-----13----8-----5-----|",
          "G|-5-----9-----12----9-----5-----|",
          "D|-------------------------------|",
          "A|-------------------------------|",
          "E|-------------------------------|",
        ] },
      }, bpm: 60, minuteur: 90 },
    { type: "idee", titre: "Inversions = mouvement", texte: [
      "Au lieu de sauter de Do à Sol, choisis la forme de Sol la plus proche. Sur les cordes 3-2-1 : Si (corde 3 case 4), Ré (corde 2 case 3), Sol (corde 1 case 3), sa 1re inversion.",
      "Depuis Do (cases 5, 5, 3), le Sol reste et les deux autres notes glissent d'une ou deux cases : c'est le voice-leading.",
    ] },
    { type: "question", quizId: "q-neck-17" },
    { type: "recap", points: [
      "Une triade tient sur trois cordes voisines : sets 3-2-1, 4-3-2 et 5-4-3.",
      "Sur le set 3-2-1, Do se joue cases 5-5-3, 9-8-8 et 12-13-12 : la note grave nomme la position.",
      "Majeur → mineur : la tierce recule d'une case ; entre deux accords, prends la forme la plus proche.",
    ] },
  ],
  quiz: ["q-neck-15", "q-neck-16", "q-neck-17"],
};

export const quiz = [
  {id:"q-neck-15",courseId:"neck",lessonId:"neck-05",lvl:3,q:"Sur les cordes 3-2-1, quelle note est sur la corde 3 dans Do majeur en 1re inversion ?",o:["Mi","Do","Sol","Si"],a:0,exp:"1re inversion = la tierce à la basse. Sur le set 3-2-1 : Mi (corde 3 case 9), Sol (corde 2 case 8), Do (corde 1 case 8). La note la plus grave nomme la position.",xp:45},
  {id:"q-neck-16",courseId:"neck",lessonId:"neck-05",lvl:3,q:"Quelle triade contient les notes Mi-Sol-Si ?",o:["Mi majeur","Sol majeur","Mi mineur","Si diminué"],a:2,exp:"Mi-Sol-Si : intervalle Mi→Sol = 3dt (tierce mineure), Mi→Si = 7dt (quinte juste). Triade mineure = 1-♭3-5. Donc Em (Mi mineur).",xp:45},
  {id:"q-neck-17",courseId:"neck",lessonId:"neck-05",lvl:3,q:"Tu joues une triade Sol-Do-Mi. Quel accord et quelle inversion ?",o:["Do majeur, état fondamental","Sol majeur, 1ère inversion","Mi mineur, 2e inversion","Do majeur, 2e inversion"],a:3,exp:"Notes Sol-Do-Mi = Do-Mi-Sol réordonné. C'est Do majeur. Basse = Sol (la 5e), donc 2e inversion. Indication 'Do/Sol' en symbole.",xp:55},
];
