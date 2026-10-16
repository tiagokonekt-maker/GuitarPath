// Leçon du module « rhythm » + les questions de quiz qui s'y rattachent.
// Format « leçon en cartes » décrit dans src/content/README.md.

const FUNK = { type: "strum_pattern", caption: "Groove funk — quelques coups francs (B/H), des ghost notes (×) partout ailleurs : la main ne s'arrête jamais", data: {pattern: ["B", "x", "x", "H", "x", "x", "B", "x", "x", "x", "B", "x", "B", "x", "x", "x"], beats: 4, style: "funk", bpm: 90} };

export default {
  id: "rhy-c3-03", level: 6,
  title: "Le groove : qu'est-ce qui fait qu'un rythme 'sent bon' ?",
  duration: 8,
  gropiTip: "Joue des croches sur Am en ne faisant vraiment sonner que les temps 2 et 4, comme la caisse claire, et effleure à peine les autres coups. Le flux reste continu et le groove apparaît.",
  cartes: [
    { type: "idee", titre: "Ce qui fait bouger", texte: [
      "Le groove, c'est la sensation physique de mouvement : ton pied tape tout seul.",
      "Trois ingrédients reviennent toujours : la précision du placement, des accents bien choisis et la répétition d'un motif. Le squelette le plus courant : le backbeat, accent sur 2 et 4.",
    ], bloc: { type: "rhythm_grid", caption: "Le backbeat — 8 croches régulières, accent sur 2 et 4 : le squelette de la plupart des grooves", data: {beats: 4, subdivision: 8, accents: [2,6], label: "1 · et · 2 · et · 3 · et · 4 · et"} } },
    { type: "idee", titre: "La précision d'abord", texte: [
      "Pas « à peu près » sur le temps : exactement sur le temps, ou exactement sur le contretemps.",
      "Ce n'est pas de la rigidité : cette ancre stable donne à l'oreille un repère, et c'est elle qui libère le groove.",
    ] },
    { type: "question", quizId: "q-rhy-33" },
    { type: "idee", titre: "Répéter, placer", texte: [
      "Un motif joué une fois intéresse ; répété huit fois, il groove. Le corps de l'auditeur l'anticipe.",
      "Puis vient le micro-timing : jouer un rien après le clic détend (« laid-back »), un rien avant pousse (« on top »). Ça vient avec l'écoute et la pratique.",
    ] },
    { type: "idee", titre: "Les ghost notes", texte: [
      "Des coups de médiator sur des cordes étouffées par la main gauche : un « tchk » à peine audible entre les coups francs.",
      "Elles ne sont pas là pour être entendues, mais pour que le flux ne s'arrête jamais.",
    ], bloc: FUNK },
    { type: "question", quizId: "q-rhy-34" },
    { type: "idee", titre: "Se caler sur le grave", texte: [
      "En groupe, le groove naît du verrouillage entre la basse et la grosse caisse. Quand elles tombent ensemble, tout tient.",
      "Ton travail de guitariste : écouter ce grave et t'y accrocher.",
    ] },
    { type: "question", quizId: "q-rhy-56" },
    { type: "a-toi", titre: "Ton premier groove funk",
      consigne: "Sur Am, la main gauche relâchée pour étouffer : les × en ghost notes, puis serre l'accord juste pour les coups francs. Lentement au clic, la main droite en doubles-croches sans jamais s'arrêter. Enregistre-toi et écoute si le temps « coule ».",
      bloc: FUNK, bpm: 60, minuteur: 120 },
    { type: "recap", points: [
      "Groove = précision, accents et répétition.",
      "Les ghost notes gardent le flux continu sans encombrer.",
      "En groupe, cale-toi sur la basse et la grosse caisse.",
    ] },
  ],
  quiz: ["q-rhy-33","q-rhy-34","q-rhy-56"],
};

export const quiz = [
  {id:"q-rhy-33",courseId:"rhythm",lessonId:"rhy-c3-03",lvl:2,q:"Deux guitaristes jouent les mêmes notes au même tempo, et un seul « groove ». Qu'est-ce qui change ?",o:["Le choix des positions d'accords sur le manche", "Le volume général de l'instrument", "Le placement et le dosage des accents", "Le type de cordes installées"],a:2,exp:"Le groove tient à des écarts de quelques millisecondes et à la hiérarchie des accents. C'est mesurable, et c'est travaillable — contrairement à ce que laisse croire le mot « feeling ».",xp:30},
  {id:"q-rhy-34",courseId:"rhythm",lessonId:"rhy-c3-03",lvl:3,q:"Les ghost notes servent à…",o:["Remplir les silences avec des notes bien audibles", "Marquer plus nettement les temps forts", "Atteindre des tempos plus rapides", "Garder le mouvement avec des attaques étouffées"],a:3,exp:"Ce sont des attaques étouffées par la main gauche : on entend la percussion, pas la hauteur. Elles remplissent la grille rythmique sans encombrer l'harmonie, et c'est le cœur du jeu funk.",xp:40},
  {id:"q-rhy-56",courseId:"rhythm",lessonId:"rhy-c3-03",lvl:1,q:"En groupe, avec quels instruments le guitariste rythmique doit-il d'abord se caler ?",o:["La basse et la grosse caisse","Le chant et les chœurs","Le clavier et les nappes","Les cymbales et la cloche"],a:0,exp:"Le groove d'un groupe repose sur le verrouillage entre la basse et la grosse caisse. Le guitariste s'accroche à ce grave pour que tout le monde tombe au même endroit.",xp:30},
];
