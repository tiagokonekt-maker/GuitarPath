// Leçon du module « debut » + les questions de quiz qui s'y rattachent.
// Format « leçon en cartes » décrit dans src/content/README.md.

export default {
  id: "debut-c1-05", level: 0, unite: 1,
  title: "Les cordes et l'accordeur",
  duration: 7,
  gropiTip: "Avant de tourner une mécanique, suis la corde du doigt jusqu'à sa clé : tendre la mauvaise corde en croyant accorder l'autre, c'est l'erreur classique qui finit par la casser.",
  cartes: [
    { type: "idee", titre: "Accordée, sinon rien ne sonne", texte: [
      "Désaccordée, une guitare sonne faux même avec des doigts parfaits : la cause n°1 des « je n'y arrive pas ».",
      "Accorder prend une minute. Mais d'abord, le nom de tes cordes.",
    ] },
    { type: "idee", titre: "Mi, La, Ré, Sol, Si, Mi", texte: [
      "La corde 1 est la plus fine (aiguë) ; la corde 6, la plus grosse (grave), est la plus proche de ton visage.",
      "De la 6 à la 1 : Mi, La, Ré, Sol, Si, Mi. Deux Mi, à deux octaves d'écart. Pour t'en souvenir : « Mon Lapin Ronge Sept Salades Mûres ».",
    ] },
    { type: "question", quizId: "q-debut-14" },
    { type: "idee", titre: "Les lettres de l'accordeur", texte: [
      "Beaucoup d'accordeurs écrivent les notes en anglais : Mi = E, La = A, Ré = D, Sol = G, Si = B.",
      "Tes cordes à vide donnent donc, de la 6 à la 1 : E A D G B E.",
    ] },
    { type: "question", quizId: "q-debut-17" },
    { type: "idee", titre: "Trop basse ? On tend", texte: [
      "Joue une corde à vide. Trop basse : tourne la mécanique (la clé sur la tête du manche) pour la tendre. Trop haute : détends-la. Un quart de tour change déjà beaucoup.",
      "Vérifie que l'accordeur affiche la BONNE note : une corde trop tendue peut casser.",
    ] },
    { type: "question", quizId: "q-debut-16" },
    { type: "a-toi", titre: "Accorde ta guitare", consigne: "Ouvre Outils → Accordeur et autorise le micro. Accorde les six cordes, de la 6 à la 1. Astuce de pro : arrive à la note par en dessous ; si tu dépasses, redescends puis remonte. L'accord tient mieux." },
    { type: "idee", titre: "Quand réaccorder ?", texte: [
      "À chaque séance, souvent après des cordes neuves, et après un coup de froid ou de chaleur.",
      "Et dès que tes accords sonnent faux alors que tes doigts sont bien placés : vérifie l'accordage avant de douter de toi.",
    ] },
    { type: "recap", points: [
      "De la corde 6 à la 1 : Mi La Ré Sol Si Mi, soit E A D G B E.",
      "Trop basse : on tend ; trop haute : on détend, doucement.",
      "On arrive à la note par en dessous, et on accorde à chaque séance.",
    ] },
  ],
  quiz: ["q-debut-14", "q-debut-15", "q-debut-16", "q-debut-17"],
};

export const quiz = [
  {id:"q-debut-14",courseId:"debut",lessonId:"debut-c1-05",lvl:1,q:"De la plus grosse corde à la plus fine, quels sont les noms des cordes à vide ?",o:["Mi La Ré Sol Si Mi","Mi Si Sol Ré La Mi","Do Ré Mi Fa Sol La","Mi La Ré Sol Do Mi"],a:0,exp:"Mi (6), La (5), Ré (4), Sol (3), Si (2), Mi (1). Moyen mnémotechnique : « Mon Lapin Ronge Sept Salades Mûres ».",xp:25},
  {id:"q-debut-15",courseId:"debut",lessonId:"debut-c1-05",lvl:1,q:"Laquelle est la corde 1 ?",o:["La plus grosse, la plus grave","La plus fine, la plus aiguë","Celle du milieu, accordée en Sol","Celle accordée en La"],a:1,exp:"La numérotation part de la corde la plus fine : la corde 1 est le Mi aigu, la corde 6 le Mi grave.",xp:25},
  {id:"q-debut-16",courseId:"debut",lessonId:"debut-c1-05",lvl:1,q:"L'accordeur indique que ta corde est trop basse. Que fais-tu ?",o:["Tu tends la corde avec la mécanique","Tu détends la corde avec la mécanique","Tu appuies plus fort avec la main gauche","Tu changes de corde"],a:0,exp:"Plus une corde est tendue, plus elle sonne aigu. Trop basse : on la tend, doucement, en surveillant l'accordeur.",xp:25},
  {id:"q-debut-17",courseId:"debut",lessonId:"debut-c1-05",lvl:2,q:"En notation anglaise, que donnent les six cordes à vide, de la corde 6 à la corde 1 ?",o:["A B C D E F","E A D G B E","E B G D A E","C D E F G A"],a:1,exp:"Mi = E, La = A, Ré = D, Sol = G, Si = B : E A D G B E. Beaucoup d'accordeurs affichent ces lettres.",xp:30},
];
