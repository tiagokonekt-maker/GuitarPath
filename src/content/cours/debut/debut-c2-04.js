// Leçon du module « debut » + les questions de quiz qui s'y rattachent.
// Format « leçon en cartes » décrit dans src/content/README.md.

export default {
  id: "debut-c2-04", level: 0, unite: 2,
  title: "Changer d'accord sans s'arrêter",
  duration: 7,
  gropiTip: "Pendant que tu grattes un accord, dis déjà dans ta tête le nom du suivant : ton cerveau prépare le trajet des doigts avant même que ta main bouge.",
  cartes: [
    { type: "idee", titre: "Le vrai défi : enchaîner", texte: [
      "Poser un accord, c'est la moitié du chemin. L'autre : passer au suivant sans casser le rythme.",
    ] },
    { type: "idee", titre: "Les doigts pivots", texte: [
      "Les doigts communs à deux accords restent posés : ne les soulève pas.",
      "De Do à La mineur, l'index (corde 2, case 1) et le majeur (corde 4, case 2) restent en place. Seul l'annulaire passe de la corde 5 en case 3 à la corde 3 en case 2.",
    ], bloc: { type: "chord_diagram", caption: "Do (C) — index et majeur resteront en place pour La mineur", data: { name: "C", frets: [-1, 3, 2, 0, 1, 0], fingers: [0, 3, 2, 0, 1, 0], startFret: 1 } } },
    { type: "question", quizId: "q-debut-33" },
    { type: "idee", titre: "Glisser ou déplacer d'un bloc", texte: [
      "Un doigt change de case sur la même corde ? Fais-le glisser le long de la corde : il guide toute la main.",
      "Rien en commun, comme entre Mi mineur et Sol ? Déplace tous les doigts ensemble, comme un tampon, pas un doigt après l'autre.",
    ] },
    { type: "idee", titre: "Pars un peu en avance", texte: [
      "Le changement doit être DÉJÀ fait quand le temps arrive. Quitte l'accord sur le dernier coup de la mesure : sur les cordes à vide, personne ne l'entend.",
      "Un trou dans le rythme, lui, s'entend tout de suite.",
    ] },
    { type: "question", quizId: "q-debut-35" },
    { type: "a-toi", titre: "Une minute de changements", consigne: "Mi mineur, La mineur, Mi mineur… Un coup par accord, le plus de changements possible en une minute. Ne compte que ceux qui sonnent bien et note ton score : demain, il grimpera. Puis Do et La mineur, Sol et Ré.", bloc: { type: "chord_diagram", caption: "La mineur (Am) — x02210 : le duo de Mi mineur une corde plus loin, plus l'index", data: { name: "Am", frets: [-1, 0, 2, 2, 1, 0], fingers: [0, 0, 2, 3, 1, 0], startFret: 1 } }, minuteur: 60 },
    { type: "question", quizId: "q-debut-34" },
    { type: "recap", points: [
      "Garde en place les doigts communs aux deux accords.",
      "Sinon, glisse le long de la corde ou déplace la forme d'un bloc.",
      "Quitte l'accord sur le dernier coup : le suivant tombe pile sur le temps.",
    ] },
  ],
  quiz: ["q-debut-33", "q-debut-34", "q-debut-35"],
};

export const quiz = [
  {id:"q-debut-33",courseId:"debut",lessonId:"debut-c2-04",lvl:1,q:"Entre Do et La mineur, combien de doigts doivent vraiment bouger ?",o:["Aucun","Un seul, l'annulaire","Deux","Les trois"],a:1,exp:"L'index (corde 2, case 1) et le majeur (corde 4, case 2) sont communs aux deux accords. Seul l'annulaire passe de la corde 5 case 3 à la corde 3 case 2.",xp:25},
  {id:"q-debut-34",courseId:"debut",lessonId:"debut-c2-04",lvl:1,q:"Quand aucun doigt n'est commun entre deux accords, comment les déplacer ?",o:["Un doigt après l'autre, en commençant par l'index","Tous ensemble, d'un bloc","En regardant chaque doigt se poser un par un","En s'arrêtant de jouer une mesure"],a:1,exp:"Déplacer la forme d'un bloc, comme un tampon, est bien plus rapide que de reconstruire l'accord doigt par doigt.",xp:25},
  {id:"q-debut-35",courseId:"debut",lessonId:"debut-c2-04",lvl:2,q:"Pourquoi quitter un accord un peu avant le temps suivant ?",o:["Pour que le nouvel accord soit en place pile sur le temps","Parce que le dernier coup doit toujours être silencieux","Pour reposer la main gauche","Pour jouer plus vite que le métronome"],a:0,exp:"Le changement doit être terminé quand le temps fort arrive. Un coup sur les cordes à vide juste avant passe inaperçu ; un trou dans le rythme, non.",xp:30},
];
