// Leçon du module « rhythm » + les questions de quiz qui s'y rattachent.
// Format « leçon en cartes » décrit dans src/content/README.md.

const SILENCE_ET_DU_2 = {
  type: "rhythm_grid",
  caption: "Silence rythmique sur le 'et' du 2 — la case grise ne sonne pas",
  data: {
    beats: 4, subdivision: 8,
    accents: [0, 2, 4, 6],
    muted: [3],
    label: "1 · et · 2 · [silence] · 3 · et · 4 · et",
  },
};

export default {
  id: "rhy-c2-04", level: 4,
  title: "Les silences : la musique dans le vide",
  duration: 7,
  gropiTip: "Un silence se joue aussi précisément qu'une note : sur le pattern du cours, étouffe l'accord pile sur le « et » du 2, et relance pile sur le 3. Compte le silence à voix basse.",
  cartes: [
    { type: "idee", titre: "Chaque valeur a son silence", texte: [
      "Un silence bien placé pèse autant qu'une note : en jazz, on parle d'« espace ».",
      "Soupir : une noire. Demi-soupir : une croche. Quart de soupir : une double-croche. Demi-pause : deux temps. Pause : une mesure entière.",
    ] },
    { type: "question", quizId: "q-rhy-49-app" },
    { type: "idee", titre: "Couper le son", texte: [
      "Deux gestes. La paume droite se pose sur les cordes juste après l'attaque.",
      "Ou le doigt gauche relâche sa pression sans quitter la corde : la note s'éteint aussitôt. Plus rapide, parfait pour les silences courts d'un riff.",
    ] },
    { type: "question", quizId: "q-rhy-50" },
    { type: "idee", titre: "Un silence écrit", texte: [
      "Un silence rythmique fait partie du riff : il se place aussi précisément qu'une note.",
      "Ici, l'accord s'éteint pile sur le « et » du 2 et repart sur le 3.",
    ], bloc: SILENCE_ET_DU_2 },
    { type: "idee", titre: "Le ghost strum", texte: [
      "Pendant le silence, la main droite continue son balancier sans toucher les cordes : le groove reste vivant.",
      "En solo, un silence après une phrase intense crée une attente, et la note suivante frappe plus fort.",
    ] },
    { type: "question", quizId: "q-rhy-51" },
    { type: "a-toi", titre: "Joue le silence",
      consigne: "Sur La mineur, au clic : des croches, avec l'accord étouffé pile sur le « et » du 2, par la paume ou en relâchant les doigts. Ta main droite remonte quand même, dans le vide. Compte « 1 et 2 chut 3 et 4 et ».",
      bloc: SILENCE_ET_DU_2, bpm: 60, minuteur: 60 },
    { type: "question", quizId: "q-rhy-p34-01" },
    { type: "recap", points: [
      "Soupir = une noire, demi-soupir = une croche, pause = une mesure.",
      "Pour couper : paume droite sur les cordes, ou doigt gauche qui relâche.",
      "Pendant le silence, la main droite continue son balancier.",
    ] },
  ],
  quiz: ["q-rhy-49", "q-rhy-50", "q-rhy-51", "q-rhy-02", "q-rhy-p34-01", "q-rhy-49-app"],
};

export const quiz = [
  {id:"q-rhy-49",courseId:"rhythm",lessonId:"rhy-c2-04",lvl:1,q:"Quelle durée vaut un soupir ?",o:["Une croche","Une blanche","Une ronde","Une noire"],a:3,exp:"Soupir = silence d'une noire. Demi-soupir = une croche, demi-pause = 2 temps, pause = une mesure entière.",xp:30},
  {id:"q-rhy-49-app",courseId:"rhythm",lessonId:"rhy-c2-04",lvl:1,q:"Combien de soupirs faut-il pour remplir une mesure de 4/4 ?",o:["Quatre","Deux","Huit","Un seul"],a:0,exp:"Un soupir vaut une noire, et une mesure de 4/4 contient quatre noires : quatre soupirs, autant qu'une pause.",xp:25},
  {id:"q-rhy-50",courseId:"rhythm",lessonId:"rhy-c2-04",lvl:1,q:"Comment couper une note proprement, sans bouger la main gauche ?",o:["Relâcher la pression du doigt","Gratter plus fort la corde suivante","Appuyer plus fort sur la case","Changer de position sur le manche"],a:0,exp:"Sans déplacer le doigt, relâche légèrement la pression : la note s'éteint aussitôt. L'autre technique : poser la paume droite sur les cordes.",xp:30},
  {id:"q-rhy-51",courseId:"rhythm",lessonId:"rhy-c2-04",lvl:2,q:"À quoi sert le ghost strum pendant un silence ?",o:["À faire sonner les cordes à vide","À garder le mouvement et le groove","À accorder la guitare entre deux phrases","À marquer la fin du morceau"],a:1,exp:"La main droite continue son mouvement sans toucher les cordes : le groove reste vivant, même quand rien ne sonne.",xp:40},
  {id:"q-rhy-p34-01",courseId:"rhythm",lessonId:"rhy-c2-04",lvl:2,q:"En 4/4, une mesure contient une demi-pause et une blanche. Combien de temps de silence ?",o:["2 temps","1 temps","4 temps","3 temps"],a:0,exp:"La demi-pause vaut une blanche de silence : 2 temps. La blanche jouée occupe les 2 autres. Une pause, elle, ferait taire toute la mesure.",xp:30},
];
