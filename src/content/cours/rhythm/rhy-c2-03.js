// Leçon du module « rhythm » + les questions de quiz qui s'y rattachent.
// Format « leçon en cartes » décrit dans src/content/README.md.

const TRIOLETS = {
  type: "rhythm_grid",
  caption: "1 mesure en triolets de croches — 4 groupes de 3 notes égales",
  data: {
    beats: 4, subdivision: 12,
    accents: [0, 3, 6, 9],
    counters: ["1","trip","let","2","trip","let","3","trip","let","4","trip","let"],
    label: "1-trip-let · 2-trip-let · 3-trip-let · 4-trip-let",
  },
};

export default {
  id: "rhy-c2-03", level: 6,
  title: "Les triolets : le feel ternaire",
  duration: 8,
  gropiTip: "Pour sentir le triolet, dis « cho-co-lat » sur chaque clic du métronome à 60 BPM : trois syllabes égales par temps, l'appui sur « cho ». Dès qu'une syllabe traîne, ce n'est plus un triolet.",
  cartes: [
    { type: "idee", titre: "Trois dans un temps", texte: [
      "Un triolet de croches, c'est 3 notes égales dans un temps, au lieu de 2. Sur une mesure de 4/4 : 12 notes.",
      "On compte « 1-trip-let, 2-trip-let… » ou « tri-o-let » : une syllabe par note, l'appui sur la première.",
    ], bloc: TRIOLETS },
    { type: "question", quizId: "q-rhy-31" },
    { type: "idee", titre: "Binaire ou ternaire", texte: [
      "Binaire : chaque temps coupé en 2. Un son régulier, carré : le rock et la pop, le plus souvent.",
      "Ternaire : chaque temps coupé en 3. Un son qui balance : le blues, le swing, le shuffle.",
    ] },
    { type: "idee", titre: "Le shuffle", texte: [
      "Dans chaque triolet, on ne joue que la 1re et la 3e note. La première dure deux tiers du temps, la seconde un tiers : une paire longue-courte.",
      "Le swing jazz assouplit ce rapport selon le tempo et le musicien : ça s'imite à l'écoute.",
    ] },
    { type: "a-toi", titre: "Binaire, ternaire, sans s'arrêter",
      consigne: "Sur une corde à vide, au clic : 2 mesures de croches (« 1 et 2 et »), puis 2 mesures de triolets (« 1-trip-let »), en boucle. Passe de l'un à l'autre sans t'arrêter. Si tu te perds, ralentis.",
      bloc: TRIOLETS, bpm: 60, minuteur: 120 },
    { type: "idee", titre: "Ternaire sans triolets écrits", texte: [
      "Souvent, la partition note des croches normales et indique « shuffle » ou « swing » en tête : à toi de jouer ternaire.",
      "Les mesures composées le notent d'office. En 6/8, deux groupes de 3 croches, « 1-2-3 4-5-6 », accents sur 1 et 4. En 12/8 : quatre groupes de 3.",
    ] },
    { type: "question", quizId: "q-rhy-04" },
    { type: "idee", titre: "3 contre 2", texte: [
      "Quand tu joues des triolets pendant que la basse joue des croches, deux découpages du même temps cohabitent : c'est un polyrythme.",
      "À ne pas confondre avec le polymètre, qui superpose deux signatures, par exemple 4/4 et 3/4.",
    ] },
    { type: "question", quizId: "q-logic-06" },
    { type: "recap", points: [
      "Triolet de croches = 3 notes égales par temps : « 1-trip-let ».",
      "Shuffle = 1re et 3e note du triolet : long-court.",
      "6/8 et 12/8 sont ternaires d'office : groupes de 3 croches.",
    ] },
  ],
  quiz: ["q-rhy-03","q-rhy-04","q-logic-06","q-rhy-31","q-rhy-32"],
};

export const quiz = [
  {id:"q-rhy-03",courseId:"rhythm",lessonId:"rhy-c2-03",lvl:2,q:"Un triolet de croches contient combien de notes par temps ?",o:["2","4","6","3"],a:3,exp:"Triolet de croches = 3 notes égales sur 1 temps. Subdivision impaire. Base du shuffle blues, du swing, du feel ternaire.",xp:30},
  {id:"q-rhy-04",courseId:"rhythm",lessonId:"rhy-c2-03",lvl:3,q:"En 6/8, on compte typiquement…",o:["2 groupes de 3 croches", "6 temps égaux, comme en 6/4", "3 noires par mesure", "6 noires par mesure"],a:0,exp:"6/8 se compte en 2 grands temps de 3 croches : '1-2-3 4-5-6' avec accents sur 1 et 4. Feel ternaire. Folk celtique, ballades.",xp:45},
  {id:"q-logic-06",courseId:"rhythm",lessonId:"rhy-c2-03",lvl:2,q:"Tu joues des triolets pendant que la basse joue des croches. Comment s'appelle cette superposition ?",o:["Un polyrythme 3 contre 2","Un polymètre 3/4 contre 4/4","Une syncope sur les « et »","Un shuffle joué en binaire"],a:0,exp:"Même tempo, deux découpages différents du temps : 3 notes contre 2. C'est un polyrythme. Le polymètre, lui, superpose deux signatures, donc des mesures de longueurs différentes.",xp:50},
  {id:"q-rhy-31",courseId:"rhythm",lessonId:"rhy-c2-03",lvl:2,q:"Comment compte-t-on un triolet de croches à voix haute ?",o:["1-o-let, 2-o-let", "1-et, 2-et, 3-et", "1-e-et-a, 2-e-et-a", "1-2-3-4"],a:0,exp:"« Tri-o-let » ou « 1-o-let » : trois syllabes régulières par temps. Prononcer le découpage est le moyen le plus fiable de sentir un ternaire quand on vient d'un binaire.",xp:30},
  {id:"q-rhy-32",courseId:"rhythm",lessonId:"rhy-c2-03",lvl:3,q:"Quelle est la différence entre jouer en 12/8 et jouer des triolets en 4/4 ?",o:["Le 12/8 se joue nécessairement plus vite","Aucune à l'oreille : seule l'écriture change","Le 12/8 compte quatre temps de moins","Le 12/8 se joue aux doigts, sans médiator"],a:1,exp:"Les deux donnent quatre temps subdivisés en trois. La différence est d'écriture et d'intention : on note en 12/8 quand le ternaire est la norme du morceau, et en triolets quand c'est un écart ponctuel dans un contexte binaire.",xp:40},
];
