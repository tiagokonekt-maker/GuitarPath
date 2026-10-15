// Leçon du module « debut » + les questions de quiz qui s'y rattachent.
// Format décrit dans src/content/README.md.

export default {
  id: "debut-c1-01", level: 0, unite: 1,
  title: "Tenir ta guitare",
  duration: 6,
  content: [
    { type: "p", text: "Bienvenue ! Avant la toute première note, on règle la chose la plus sous-estimée de la guitare : la façon de la tenir. Une bonne posture, c'est un instrument qui tient tout seul, des épaules relâchées et deux mains libres de faire leur travail. Une mauvaise posture, c'est des douleurs au poignet au bout de dix minutes et des accords qui sonnent mal sans que tu comprennes pourquoi." },
    { type: "h", text: "Assis : la position de départ" },
    { type: "p", text: "Assieds-toi sur une chaise sans accoudoirs, le dos droit mais pas raide, les deux pieds à plat. Pose le creux de la guitare sur ta cuisse droite (si tu es droitier). Le dos de la caisse vient contre ton ventre et ta poitrine, la guitare est presque verticale : elle ne doit pas être couchée sur tes genoux, cordes vers le plafond." },
    { type: "p", text: "Ton avant-bras droit se pose sur le haut de la caisse, à peu près au niveau du coude. C'est lui qui stabilise la guitare. Le manche part vers la gauche, légèrement relevé : la tête de la guitare arrive à peu près à hauteur de ton épaule, jamais plus bas que la caisse." },
    { type: "h", text: "Debout : la même chose, avec une sangle" },
    { type: "p", text: "Debout, c'est la sangle qui porte la guitare. Règle-la pour que l'instrument se retrouve à peu près à la même hauteur qu'en position assise. Une guitare portée très bas a l'air cool, mais elle tord le poignet gauche : garde ça pour plus tard. Si tu passes souvent d'assis à debout, vérifie que tes mains retrouvent la même position dans les deux cas." },
    { type: "h", text: "Les trois pièges du débutant" },
    { type: "p", text: "Premier piège : pencher la guitare vers toi pour voir les cordes. Ça déplace tout l'angle du poignet gauche. Penche plutôt un peu la tête. Deuxième piège : remonter l'épaule droite ou gauche sans t'en rendre compte. Fais régulièrement le point : épaules basses, mâchoire détendue. Troisième piège : retenir le manche avec la main gauche. La main gauche est faite pour appuyer sur les cordes, pas pour porter l'instrument." },
    { type: "tip", text: "Le test du lâcher : installe-toi, puis lâche complètement le manche avec ta main gauche. La guitare doit rester en place, tenue par ta cuisse, ton ventre et ton avant-bras droit. Si elle pique du nez, rapproche-la de ton corps et appuie un peu plus l'avant-bras sur la caisse." },
    { type: "ref", text: "Tu es gaucher ? Deux options : une guitare pour gaucher (tout est inversé, tu poses la guitare sur ta cuisse gauche), ou une guitare de droitier, que beaucoup de gauchers jouent très bien. Dans les deux cas, cette leçon reste valable en miroir. Choisis une option et tiens-t'y dès le départ." },
  ],
  quiz: ["q-debut-01", "q-debut-02", "q-debut-03"],
};

export const quiz = [
  {id:"q-debut-01",courseId:"debut",lessonId:"debut-c1-01",lvl:1,q:"Assis, pour un droitier, où se pose la guitare ?",o:["Sur la cuisse droite, caisse contre le ventre","À plat sur les deux genoux, cordes vers le plafond","Sur la cuisse gauche, manche vers le sol","Entre les deux genoux, manche à la verticale"],a:0,exp:"Le creux de la guitare se pose sur la cuisse droite, le dos de la caisse contre ton ventre. Couchée à plat, elle t'obligerait à tordre le poignet gauche pour atteindre les cordes.",xp:25},
  {id:"q-debut-02",courseId:"debut",lessonId:"debut-c1-01",lvl:1,q:"Tu lâches le manche et ta guitare pique du nez. Qu'est-ce que ça veut dire ?",o:["Que ta main gauche doit serrer plus fort","Qu'elle n'est pas assez calée contre toi","Que ta sangle est trop courte","Que c'est normal, c'est toujours comme ça"],a:1,exp:"Bien installée, la guitare tient seule entre ta cuisse, ton ventre et ton avant-bras droit. La main gauche n'est pas là pour la porter : elle doit être libre d'appuyer sur les cordes.",xp:25},
  {id:"q-debut-03",courseId:"debut",lessonId:"debut-c1-01",lvl:2,q:"Pourquoi éviter de pencher la guitare vers toi pour voir les cordes ?",o:["Ça désaccorde l'instrument","Ça abîme le manche avec le temps","Ça tord ton poignet gauche et fausse la position des doigts","Ça empêche d'entendre ce que tu joues"],a:2,exp:"Incliner la guitare change tout l'angle de la main gauche : les doigts arrivent de travers sur les cordes. Garde la guitare presque verticale et penche plutôt légèrement la tête.",xp:30},
];
