// Leçon du module « impro » + les questions de quiz qui s'y rattachent.
// Format « leçon en cartes » décrit dans src/content/README.md.
// Construire un solo, 2 sur 2 : le sommet, le registre, la conclusion.
// Suite d'impro-05, scindée en deux au lot 4 ; q-impro-13 vient de
// l'ancienne leçon impro-05.

const SOMMET = {
  type: "tab",
  caption: "Un lick de sommet dans l'aigu, La pentatonique mineure à la case 15",
  text: "Tab — Ré (corde 2 case 15) tiré d'un ton jusqu'à Mi, puis Sol (corde 1 case 15) et La (corde 1 case 17), tenu avec vibrato.",
  data: { lines: [
    "e|-------15--17~~~|",
    "B|15b17-----------|",
    "G|----------------|",
    "D|----------------|",
    "A|----------------|",
    "E|----------------|",
  ] },
};

export default {
  id: "impro-05b", level: 9,
  title: "Construire un solo : le sommet",
  duration: 8,
  gropiTip: "Garde ta meilleure idée pour le climax : choisis un lick qui t'enthousiasme et interdis-toi de le jouer avant le dernier tiers du solo. Sa première apparition n'en aura que plus d'impact.",
  cartes: [
    { type: "idee", titre: "Le sommet aux deux tiers", texte: [
      "Le moment le plus intense arrive vers les deux tiers du solo, pas à la fin.",
      "Sur 12 mesures, vers la mesure 8 ; sur 32, vers la 21. Le dernier tiers redescend et conclut.",
    ] },
    { type: "question", quizId: "q-impro-13" },
    { type: "idee", titre: "Voyager sur le manche", texte: [
      "En La : le médium d'abord, autour des cases 5 à 8 ; l'aigu pour le sommet, des cases 12 à 17 ; puis le retour.",
      "Les notes aiguës portent plus d'énergie : garde-les pour le moment clé.",
    ], bloc: { type: "fretboard_interactive", mode: "scale", root: "A", scale: "pentatonic_minor", caption: "Pentatonique mineure de La — registre complet pour ton voyage", displayMode: "notes", lang: "fr", compact: true } },
    { type: "question", quizId: "q-impro-registre-lot4" },
    { type: "idee", titre: "Conclure", texte: [
      "Après le sommet, redescends en registre et en densité.",
      "Termine sur la tonique, une note longue, avec vibrato : l'oreille sait que c'est fini.",
    ] },
    { type: "question", quizId: "q-impro-fin-lot4" },
    { type: "a-toi", titre: "Douze mesures, un sommet",
      consigne: "Lance la Jam en Blues 12 mesures, tonalité La (ou un La7 en boucle), et enregistre-toi. Quatre mesures calmes en position 1, puis monte vers la case 12, place ce lick vers la mesure 8, redescends et finis sur La. Rejoue plusieurs grilles.",
      bloc: SOMMET, bpm: 80, minuteur: 240 },
    { type: "idee", titre: "Écouter sa courbe", texte: [
      "Réécoute-toi et note l'intensité de chaque mesure, de 1 à 10.",
      "Le sommet est-il vers les deux tiers ? Sinon, rejoue en t'imposant la contrainte.",
    ] },
    { type: "recap", points: [
      "Le sommet vers les deux tiers, puis une descente qui conclut.",
      "Le registre raconte l'histoire : médium, aigu au sommet, retour.",
      "Finis sur la tonique, en note longue, et réécoute ta courbe.",
    ] },
  ],
  quiz: ["q-impro-13","q-impro-registre-lot4","q-impro-fin-lot4"],
};

export const quiz = [
  {id:"q-impro-13",courseId:"impro",lessonId:"impro-05b",lvl:2,q:"Ton solo dure 24 mesures. Où placer son point culminant ?",o:["Vers la mesure 16","Dès la mesure 1","Pile à la mesure 12","Sur la toute dernière mesure"],a:0,exp:"Un climax vers les deux tiers (16 mesures sur 24) laisse le temps de monter, puis de redescendre et de conclure. Trop tôt, il ne reste nulle part où aller ; tout à la fin, le solo s'arrête sans résolution.",xp:50},
  {id:"q-impro-registre-lot4",courseId:"impro",lessonId:"impro-05b",lvl:2,q:"Ton solo commence en position 1, case 5. Où placer tes notes les plus aiguës ?",o:["Au sommet, vers les deux tiers","Dès la toute première phrase","Partout, en quantité égale","Seulement sur la note finale"],a:0,exp:"L'aigu porte le plus d'énergie : réservé au sommet, il fait monter la courbe. Joué dès le début ou partout, il ne surprend plus ; sur la note finale, il empêche de conclure en douceur.",xp:30},
  {id:"q-impro-fin-lot4",courseId:"impro",lessonId:"impro-05b",lvl:2,q:"Ton solo se termine. Quelle dernière phrase conclut le mieux ?",o:["Une descente qui finit sur la tonique","Un trait rapide arrêté net","Une note tenue sur la 7e","Le lick du début, en plus fort"],a:0,exp:"La tonique est le point de repos : y arriver en redescendant ferme le récit. Un trait coupé net ou une 7e tenue laissent l'oreille en attente, et rejouer plus fort relance au lieu de conclure.",xp:30},
];
