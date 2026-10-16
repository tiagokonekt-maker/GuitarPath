// Leçon du module « rhythm » + les questions de quiz qui s'y rattachent.
// Format « leçon en cartes » décrit dans src/content/README.md.

const NOIRES = {
  type: "rhythm_grid",
  caption: "Noire — 1 attaque par temps",
  data: {
    beats: 4, subdivision: 4,
    highlights: [0, 1, 2, 3],
    label: "4 attaques sur 4 temps",
  },
};

export default {
  id: "rhy-c2-01", level: 3,
  title: "Rondes, blanches, noires : les valeurs de base",
  duration: 7,
  gropiTip: "Retiens la blanche pointée : 2 temps + la moitié (1 temps) = 3 temps, soit une mesure entière de 3/4. Tiens-en une en comptant « 1-2-3 » à voix haute pour la sentir.",
  cartes: [
    { type: "idee", titre: "La noire : l'unité", texte: [
      "Les valeurs rythmiques mesurent la durée des sons. La référence en 4/4 : la noire, qui vaut 1 temps, un clic du métronome.",
      "À 60 BPM, une noire dure une seconde ; à 120 BPM, une demi-seconde.",
    ], bloc: NOIRES },
    { type: "idee", titre: "La blanche : 2 temps", texte: [
      "La blanche vaut 2 noires : deux blanches remplissent une mesure de 4/4.",
      "Tiens la note pendant les deux temps, et relâche-la pile au moment de jouer la suivante.",
    ], bloc: {
      type: "rhythm_grid",
      caption: "Blanche — 1 attaque toutes les 2 cases, la case grise reste tenue",
      data: {
        beats: 4, subdivision: 4,
        highlights: [0, 2],
        muted: [1, 3],
        label: "2 attaques, chacune tenue 2 temps",
      },
    } },
    { type: "question", quizId: "q-rhy-25" },
    { type: "idee", titre: "La ronde : 4 temps", texte: [
      "La ronde vaut 4 temps : une seule note pour toute la mesure. À 60 BPM, elle dure quatre secondes.",
      "Les solos l'adorent pour tenir une note avec du vibrato ou un bend.",
    ], bloc: {
      type: "rhythm_grid",
      caption: "Ronde — 1 seule attaque, tenue toute la mesure",
      data: {
        beats: 4, subdivision: 4,
        highlights: [0],
        muted: [1, 2, 3],
        label: "1 attaque, tenue 4 temps",
      },
    } },
    { type: "question", quizId: "q-base-19" },
    { type: "idee", titre: "Toujours la moitié", texte: [
      "Chaque valeur vaut la moitié de la précédente : ronde = 2 blanches = 4 noires = 8 croches = 16 doubles-croches.",
      "On peut toujours diviser une valeur en deux.",
    ] },
    { type: "idee", titre: "Le point", texte: [
      "Un point après une note ajoute la moitié de sa valeur. Noire pointée : 1 temps et demi. Blanche pointée : 3 temps.",
      "Noire pointée puis croche, longue-courte : c'est le balancement de base du shuffle.",
    ] },
    { type: "question", quizId: "q-rhy-26" },
    { type: "a-toi", titre: "Rondes, blanches, noires",
      consigne: "Sur La (corde 5 à vide), au clic : 4 mesures en rondes, 4 en blanches, 4 en noires, puis redescends. Compte « 1, 2, 3, 4 » à voix haute. Le tempo ne bouge pas : seule la densité change.",
      bloc: NOIRES, bpm: 60 },
    { type: "recap", points: [
      "Noire = 1 temps, blanche = 2, ronde = 4 (une mesure de 4/4).",
      "Chaque valeur vaut la moitié de la précédente.",
      "Le point ajoute la moitié : blanche pointée = 3 temps.",
    ] },
  ],
  quiz: ["q-base-19", "q-rhy-25", "q-rhy-26"],
};

export const quiz = [
  {id:"q-base-19",courseId:"rhythm",lessonId:"rhy-c2-01",lvl:2,q:"En 4/4, combien de temps dure une ronde ?",o:["2","1","4","8"],a:2,exp:"La ronde vaut 4 temps, la blanche 2, la noire 1. Chaque valeur vaut la moitié de la précédente.",xp:35},
  {id:"q-rhy-25",courseId:"rhythm",lessonId:"rhy-c2-01",lvl:1,q:"Une mesure de 4/4 contient une blanche et une noire. Que manque-t-il pour la compléter ?",o:["Encore une noire","Encore une blanche","Une ronde entière","Rien, elle est pleine"],a:0,exp:"Blanche (2 temps) + noire (1 temps) = 3 temps. Il en manque un : une noire.",xp:25},
  {id:"q-rhy-26",courseId:"rhythm",lessonId:"rhy-c2-01",lvl:2,q:"En 3/4, une blanche pointée occupe…",o:["La moitié de la mesure","Deux mesures complètes","Un temps et demi seulement","La mesure entière"],a:3,exp:"La blanche vaut 2 temps, le point en ajoute 1 : 3 temps, soit toute la mesure en 3/4. C'est l'accord tenu typique de la valse.",xp:30},
];
