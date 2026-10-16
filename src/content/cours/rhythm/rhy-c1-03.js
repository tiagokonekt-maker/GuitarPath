// Leçon du module « rhythm » + les questions de quiz qui s'y rattachent.
// Format « leçon en cartes » décrit dans src/content/README.md.

export default {
  id: "rhy-c1-03", level: 2,
  title: "Le métronome : ton meilleur ennemi",
  duration: 7,
  gropiTip: "Note dans un carnet le tempo propre de chaque exercice, avec la date. En relisant ton mois (60, 65, 70 BPM…), tu verras noir sur blanc que les petits paliers finissent par payer.",
  cartes: [
    { type: "idee", titre: "Ce que le clic révèle", texte: [
      "Sans repère extérieur, on accélère dans les passages faciles et on ralentit dans les difficiles. C'est naturel, et on ne l'entend pas.",
      "Le métronome montre ces écarts sans pitié. S'en servir pour progresser, au lieu de les cacher, c'est ça, le travail sérieux.",
    ] },
    { type: "question", quizId: "q-rhy-13" },
    { type: "idee", titre: "Commence lentement", texte: [
      "Joue toujours au tempo où tout est propre. Une erreur ? Ralentis.",
      "Démarre vers 50 à 60 % du tempo visé. Quand c'est net plusieurs fois de suite, monte de 5 BPM et recommence. La vitesse vient de la répétition propre, pas de l'effort.",
    ] },
    { type: "question", quizId: "q-rhy-14" },
    { type: "a-toi", titre: "Trouve ton tempo propre", consigne: "Enchaîne Mi mineur et Do, quatre coups vers le bas chacun, au clic. Quatre tours sans accroc ? Monte de 5 BPM. Un changement en retard ? Redescends. Note le tempo où tu t'arrêtes : c'est ton tempo propre du jour.", bloc: { type: "chord_diagram", caption: "Do majeur (C) — x32010, cordes 5 à 1", data: { name: "C", frets: [-1, 3, 2, 0, 1, 0], fingers: [0, 3, 2, 0, 1, 0], startFret: 1 } }, bpm: 60, minuteur: 120 },
    { type: "idee", titre: "Le clic sur 2 et 4", texte: [
      "Règle le métronome à la moitié de ton tempo et entends chaque clic comme le temps 2 ou le 4. Pour jouer à 80, clic à 40.",
      "Les temps 1 et 3, c'est toi qui les portes. Tu sens le backbeat, comme avec un batteur.",
    ], bloc: {
      type: "rhythm_grid",
      caption: "Métronome sur 2 et 4 — les temps 1 et 3 sont à imaginer",
      data: {
        beats: 4, subdivision: 4,
        accents: [1, 3],
        muted: [0, 2],
        label: "(1) · CLIC · (3) · CLIC — le clic ne marque que 2 et 4",
      },
    } },
    { type: "question", quizId: "q-rhy-15" },
    { type: "a-toi", titre: "Le clic sur 2 et 4", consigne: "Clic à 40 BPM, entendu comme 2 et 4 : tu joues donc à 80. Sur Mi mineur, un coup vers le bas par temps, en comptant « 1, 2, 3, 4 » ; le clic doit tomber sur 2 et 4. Perdu ? Arrête, recompte, reprends.", bpm: 40, minuteur: 60 },
    { type: "idee", titre: "Pour plus tard", texte: [
      "Deux variantes plus dures. Un clic par mesure : à 30 BPM pour jouer à 120, tu comptes 1-2-3-4 entre deux clics.",
      "Le clic en contretemps : chaque clic devient un « et ». Idéal pour le groove syncopé. Et pour tout le reste, cinq minutes de clic par jour suffisent à transformer ton sens du temps.",
    ] },
    { type: "recap", points: [
      "Le métronome révèle où tu accélères et où tu ralentis.",
      "Tempo propre d'abord, puis paliers de 5 BPM.",
      "Clic sur 2 et 4 : c'est toi qui portes les temps 1 et 3.",
    ] },
  ],
  quiz: ["q-rhy-13", "q-rhy-14", "q-rhy-15"],
};

export const quiz = [
  {id:"q-rhy-13",courseId:"rhythm",lessonId:"rhy-c1-03",lvl:1,q:"À quoi sert d'abord un métronome quand on travaille ?",o:["À rendre le jeu plus mécanique","À compter les mesures d'un morceau","À révéler où on accélère ou on ralentit","À jouer plus vite qu'on ne le pourrait"],a:2,exp:"Le métronome ne te fait pas jouer plus vite : il te montre où tu décales. On accélère presque toujours dans les passages faciles et on ralentit dans les difficiles — sans référence extérieure, on ne l'entend pas.",xp:25},
  {id:"q-rhy-14",courseId:"rhythm",lessonId:"rhy-c1-03",lvl:2,q:"Un passage ne passe pas à 100 bpm. Que fais-tu ?",o:["Tu sautes le passage pour y revenir plus tard","Tu répètes à 100 jusqu'à ce que ça finisse par passer","Tu joues plus fort pour te donner de l'élan","Tu descends au tempo où c'est propre, puis tu montes par paliers"],a:3,exp:"Répéter à un tempo où c'est raté, c'est mémoriser l'erreur. On descend jusqu'au tempo où les notes sont justes et régulières, puis on monte de 5 en 5. Plus lent sur une séance, bien plus rapide sur un mois.",xp:30},
  {id:"q-rhy-15",courseId:"rhythm",lessonId:"rhy-c1-03",lvl:3,q:"Mettre le métronome sur les temps 2 et 4 seulement, ça sert à…",o:["Renforcer sa pulsation intérieure", "Réduire le bruit pendant le travail", "Simplifier le comptage des mesures", "Pouvoir jouer deux fois plus vite"],a:0,exp:"Avec un clic seulement sur 2 et 4, c'est toi qui portes les temps 1 et 3. C'est l'exercice de tempo le plus révélateur qui soit — et c'est aussi la place du clic dans le jazz et la soul.",xp:40},
];
