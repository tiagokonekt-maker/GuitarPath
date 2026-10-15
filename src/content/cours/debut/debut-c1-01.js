// Leçon du module « debut » + les questions de quiz qui s'y rattachent.
// Format « leçon en cartes » décrit dans src/content/README.md.

export default {
  id: "debut-c1-01", level: 0, unite: 1,
  title: "Tenir ta guitare",
  duration: 6,
  gropiTip: "Fais le test de profil : prends-toi en photo avec ton téléphone en position assise. La guitare doit être presque verticale et la tête du manche à hauteur d'épaule, pas plus bas que la caisse.",
  cartes: [
    { type: "idee", titre: "Bien tenue, la guitare tient seule", texte: [
      "Avant la première note, on règle ta posture. Bien installée, la guitare tient toute seule, tes épaules sont relâchées et tes deux mains restent libres.",
      "Mal installée, c'est le poignet qui souffre et des accords qui sonnent mal.",
    ] },
    { type: "idee", titre: "Assis : sur la cuisse droite", texte: [
      "Chaise sans accoudoirs, dos droit, pieds à plat. Le creux de la guitare sur ta cuisse droite (si tu es droitier), la caisse contre ton ventre.",
      "Elle est presque verticale, pas couchée. Ton avant-bras droit, posé sur la caisse, la stabilise ; la tête du manche arrive à hauteur d'épaule.",
    ] },
    { type: "question", quizId: "q-debut-01" },
    { type: "idee", titre: "Debout : la sangle porte tout", texte: [
      "Règle la sangle pour retrouver la hauteur de la position assise.",
      "Une guitare portée très bas a l'air cool, mais elle tord le poignet gauche. Garde ça pour plus tard.",
    ] },
    { type: "idee", titre: "Trois pièges à éviter", texte: [
      "Pencher la guitare pour voir les cordes : ça tord le poignet gauche. Penche plutôt la tête.",
      "Remonter les épaules : garde-les basses, mâchoire détendue. Et porter le manche de la main gauche : elle appuie sur les cordes, elle ne tient pas la guitare.",
    ] },
    { type: "question", quizId: "q-debut-03" },
    { type: "a-toi", titre: "Le test du lâcher", consigne: "Installe-toi, puis lâche complètement le manche. La guitare doit rester en place, tenue par ta cuisse, ton ventre et ton avant-bras droit. Elle pique du nez ? Rapproche-la de ton corps et appuie un peu plus l'avant-bras sur la caisse." },
    { type: "question", quizId: "q-debut-02" },
    { type: "idee", titre: "Et si tu es gaucher ?", texte: [
      "Deux options : une guitare pour gaucher (tout est inversé, elle se pose sur ta cuisse gauche) ou une guitare de droitier, que beaucoup de gauchers jouent très bien.",
      "Cette leçon vaut en miroir. Choisis et tiens-t'y dès le départ.",
    ] },
    { type: "recap", points: [
      "Assis : creux de la guitare sur la cuisse droite, caisse contre le ventre, guitare presque verticale.",
      "Ta cuisse, ton ventre et ton avant-bras droit tiennent la guitare, pas ta main gauche.",
      "Épaules basses, poignet droit : penche la tête plutôt que la guitare.",
    ] },
  ],
  quiz: ["q-debut-01", "q-debut-02", "q-debut-03"],
};

export const quiz = [
  {id:"q-debut-01",courseId:"debut",lessonId:"debut-c1-01",lvl:1,q:"Assis, pour un droitier, où se pose la guitare ?",o:["Sur la cuisse droite, caisse contre le ventre","À plat sur les deux genoux, cordes vers le plafond","Sur la cuisse gauche, manche vers le sol","Entre les deux genoux, manche à la verticale"],a:0,exp:"Le creux de la guitare se pose sur la cuisse droite, le dos de la caisse contre ton ventre. Couchée à plat, elle t'obligerait à tordre le poignet gauche pour atteindre les cordes.",xp:25},
  {id:"q-debut-02",courseId:"debut",lessonId:"debut-c1-01",lvl:1,q:"Tu lâches le manche et ta guitare pique du nez. Qu'est-ce que ça veut dire ?",o:["Que ta main gauche doit serrer plus fort","Qu'elle n'est pas assez calée contre toi","Que ta sangle est trop courte","Que c'est normal, c'est toujours comme ça"],a:1,exp:"Bien installée, la guitare tient seule entre ta cuisse, ton ventre et ton avant-bras droit. La main gauche n'est pas là pour la porter : elle doit être libre d'appuyer sur les cordes.",xp:25},
  {id:"q-debut-03",courseId:"debut",lessonId:"debut-c1-01",lvl:2,q:"Pourquoi éviter de pencher la guitare vers toi pour voir les cordes ?",o:["Ça désaccorde l'instrument","Ça abîme le manche avec le temps","Ça tord ton poignet gauche et fausse la position des doigts","Ça empêche d'entendre ce que tu joues"],a:2,exp:"Incliner la guitare change tout l'angle de la main gauche : les doigts arrivent de travers sur les cordes. Garde la guitare presque verticale et penche plutôt légèrement la tête.",xp:30},
];
