// Leçon du module « impro » + les questions de quiz qui s'y rattachent.
// Format « leçon en cartes » décrit dans src/content/README.md.

const QUESTION_REPONSE = { type: "tab", caption: "Question (La-Do-Mi, qui monte et reste en suspens), silence, puis réponse (Mi-Do-La, qui redescend se poser)", text: "Tab : question = La (corde 6 case 5), Do (corde 6 case 8), Mi (corde 5 case 7) ; un silence ; réponse = Mi (corde 5 case 7), Do (corde 6 case 8), La (corde 6 case 5).", data: { lines: ["e|----------------------|","B|----------------------|","G|----------------------|","D|----------------------|","A|-----7---------7------|","E|-5-8-------------8-5--|"] } };

export default {
  id: "impro-intro-02", level: 4,
  title: "Question et réponse : ta première vraie phrase",
  duration: 7,
  gropiTip: "Chante ta question à voix basse avant de la jouer : si tu peux la fredonner, tu sauras lui répondre. Astuce : ta réponse peut reprendre le début de la question et changer seulement la fin.",
  cartes: [
    { type: "idee", titre: "Une conversation", texte: [
      "Tu sais placer La, Do et Mi en rythme. Étape suivante : le phrasé.",
      "Une courte « question », puis une « réponse » qui lui fait écho, comme dans une conversation.",
    ] },
    { type: "idee", titre: "En suspens, puis posée", texte: [
      "Blues, gospel, chants de travail : une phrase en appelle une autre.",
      "La question finit en l'air, sur une note instable ; la réponse reprend son matériau et se pose, souvent sur la tonique.",
    ] },
    { type: "question", quizId: "q-impro-34" },
    { type: "idee", titre: "Ta première question-réponse", texte: [
      "La, Do, Mi monte et reste en suspens. Un silence. Puis les mêmes notes redescendent se poser sur La.",
      "Écoute, puis joue lentement.",
    ], bloc: QUESTION_REPONSE },
    { type: "idee", titre: "Le silence est une note", texte: [
      "On a souvent peur du vide et on remplit tout. Pourtant l'espace rend la phrase lisible, comme la ponctuation à l'oral.",
    ] },
    { type: "question", quizId: "q-impro-35" },
    { type: "a-toi", titre: "Cinq conversations",
      consigne: "Au clic, joue la question de la tab, laisse un temps de silence, puis invente ta réponse avec La, Do et Mi, en finissant sur La. Cinq fois, avec un rythme différent.",
      bloc: QUESTION_REPONSE, bpm: 70 },
    { type: "question", quizId: "q-rhy-11" },
    { type: "recap", points: [
      "Une question finit en suspens, la réponse se pose sur une note stable.",
      "La réponse reprend les notes de la question et change la fin.",
      "Le silence entre les deux ponctue la phrase : ne le remplis pas.",
    ] },
  ],
  quiz: ["q-rhy-11","q-impro-34","q-impro-35"],
};

export const quiz = [
  {id:"q-rhy-11",courseId:"rhythm",lessonId:"impro-intro-02",lvl:2,q:"Dans une phrase musicale type 'question-réponse', la phrase 'question' finit typiquement sur…",o:["La tonique, pour bien conclure","Une note stable et reposante","Un silence de toute une mesure","Une note instable, en suspens"],a:3,exp:"Question = tension = fin sur note instable (3, 6, 7). Réponse = résolution = fin sur tonique ou note stable. Structure universelle.",xp:40},
  {id:"q-impro-34",courseId:"impro",lessonId:"impro-intro-02",lvl:2,q:"Ta question monte La - Do - Mi et reste en suspens. Quelle réponse la conclut le mieux ?",o:["Mi - Do - La, qui redescend sur La","La - Do - Mi, rejouée à l'identique","Mi - Mi - Mi, sur la note du haut","Do - Mi - Do, qui s'arrête sur Do"],a:0,exp:"Une réponse reprend le matériau de la question et le mène vers un point de repos. Redescendre jusqu'à La, la note de base en La mineur, ferme la phrase. Répéter la question ou finir en l'air laisse l'oreille en attente.",xp:40},
  {id:"q-impro-35",courseId:"impro",lessonId:"impro-intro-02",lvl:2,q:"Dans une phrase de question-réponse, le silence entre les deux sert à…",o:["Rien, c'est un vide à éviter", "Économiser de l'énergie entre deux phrases", "Ponctuer, comme dans une phrase parlée", "Attendre que le rythme reparte"],a:2,exp:"Le silence fonctionne comme la ponctuation d'une phrase parlée — sans lui, la question et la réponse se mélangent en un flux confus.",xp:30},
];
