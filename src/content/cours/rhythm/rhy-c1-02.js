// Leçon du module « rhythm » + les questions de quiz qui s'y rattachent.
// Format « leçon en cartes » décrit dans src/content/README.md.

export default {
  id: "rhy-c1-02", level: 2,
  title: "La mesure à 4/4 : le temps de référence",
  duration: 7,
  gropiTip: "Quand tu grattes en 4/4, appuie un peu plus le coup du temps 1 que les trois autres. Ton oreille apprend à repérer le début de chaque mesure, et tu ne te perds plus dans la grille.",
  cartes: [
    { type: "idee", titre: "Lire 4/4", texte: [
      "La mesure range la pulsation en groupes réguliers. Elle s'écrit comme une fraction.",
      "Le chiffre du haut donne le nombre de temps par mesure ; celui du bas, la valeur d'un temps (4 = la noire). En 4/4 : quatre temps, une noire chacun. C'est le cadre de presque tout le rock, la pop et le blues.",
    ] },
    { type: "question", quizId: "q-base-14-app" },
    { type: "idee", titre: "Temps forts, temps faibles", texte: [
      "Les quatre temps n'ont pas le même poids : 1 et 3 sont forts, 2 et 4 faibles.",
      "En rock et en pop, la caisse claire frappe souvent sur 2 et 4 : ce contre-accent, le backbeat, fait le groove moderne.",
    ], bloc: {
      type: "rhythm_grid",
      caption: "4/4 en noires — temps forts (1+3) vs temps faibles (2+4)",
      data: {
        beats: 4, subdivision: 4,
        accents: [0, 2],
        label: "1 fort · 2 faible · 3 fort · 4 faible",
      },
    } },
    { type: "idee", titre: "Compter les mesures", texte: [
      "Chaque groupe « 1-2-3-4 » forme une mesure. Les chansons pop vont par blocs de 4 : intro de 4 ou 8 mesures, couplet de 8 ou 16…",
      "Cette structure s'appelle la grille. Le blues, par exemple, tient sur une grille de 12 mesures en 4/4. Connaître la grille, c'est savoir où tu en es.",
    ] },
    { type: "question", quizId: "q-rhy-29" },
    { type: "a-toi", titre: "Compte tes mesures", consigne: "Sur Mi mineur, quatre coups vers le bas par mesure, le 1 un peu plus appuyé. Compte à voix haute « 1-2-3-4, 2-2-3-4, 3-2-3-4… » : numéro de mesure, puis temps. Change pour La mineur toutes les 4 mesures.", bloc: { type: "strum_pattern", caption: "4 noires vers le bas — compte « 1, 2, 3, 4 »", data: { pattern: ["B", "B", "B", "B"], beats: 4, style: "folk", bpm: 70 } }, bpm: 70, minuteur: 120 },
    { type: "idee", titre: "Les autres mesures", texte: [
      "3/4 : trois temps, la valse. 6/8 : six croches, ressenties en deux groupes de trois. 12/8 : quatre groupes de trois, le slow blues.",
      "Plus rares : 5/4 (« Take Five ») ou 7/4 (« Money » de Pink Floyd), qu'on écoute en comptant pour sentir l'asymétrie.",
    ] },
    { type: "question", quizId: "q-rhy-30" },
    { type: "recap", points: [
      "4/4 : en haut le nombre de temps, en bas la valeur du temps (la noire).",
      "Temps forts 1 et 3 ; le backbeat accentue 2 et 4.",
      "Les chansons s'organisent en grilles de 4, 8, 12 ou 16 mesures.",
    ] },
  ],
  quiz: ["q-base-14","q-rhy-29","q-rhy-30", "q-base-14-app"],
};

export const quiz = [
  {id:"q-base-14",courseId:"rhythm",lessonId:"rhy-c1-02",lvl:1,q:"Dans une signature en 4/4, que représente le chiffre du haut ?",o:["La durée de chaque note dans la mesure", "Le nombre de temps par mesure", "Le tempo, en battements par minute", "Le nombre de mesures du morceau"],a:1,exp:"Le chiffre du haut donne le nombre de temps par mesure, celui du bas l'unité de temps (4 = la noire).",xp:30},
  {id:"q-base-14-app",courseId:"rhythm",lessonId:"rhy-c1-02",lvl:1,q:"Une chanson est écrite en 3/4. Combien de temps compte chaque mesure ?",o:["Trois","Quatre","Deux","Six"],a:0,exp:"Le chiffre du haut donne le nombre de temps : 3/4 = trois temps par mesure, une noire chacun. C'est la mesure de la valse.",xp:25},
  {id:"q-rhy-29",courseId:"rhythm",lessonId:"rhy-c1-02",lvl:2,q:"Dans une signature 4/4, que signifie le chiffre du bas ?",o:["Le nombre de mesures du morceau","Le tempo auquel jouer","L'unité de temps : la noire","Le nombre de cordes à gratter"],a:2,exp:"Le haut dit combien de temps par mesure, le bas dit quelle valeur vaut un temps — 4 désigne la noire. En 6/8, le 8 désigne la croche, et tout le comptage change.",xp:30},
  {id:"q-rhy-30",courseId:"rhythm",lessonId:"rhy-c1-02",lvl:2,q:"Comment remplit-on exactement une mesure de 3/4 ?",o:["Trois noires","Quatre noires","Six noires","Trois blanches"],a:0,exp:"3/4 : 3 temps par mesure, la noire valant un temps. Trois noires, ou une blanche et une noire, ou une blanche pointée. C'est la mesure de la valse.",xp:40},
];
