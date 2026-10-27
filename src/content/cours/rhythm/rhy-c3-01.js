// Leçon du module « rhythm » + les questions de quiz qui s'y rattachent.
// Format « leçon en cartes » décrit dans src/content/README.md.

export default {
  id: "rhy-c3-01", level: 5,
  title: "La syncope : décaler l'accent",
  duration: 7,
  gropiTip: "Tape du pied sur 1-2-3-4 et frappe dans tes mains uniquement sur les « et ». Si ton pied se met à suivre tes mains, ralentis à 60 BPM : c'est lui qui doit tenir la pulsation.",
  cartes: [
    { type: "idee", titre: "L'accent déplacé", texte: [
      "Une syncope, c'est un accent sur un temps faible ou un contretemps, là où l'oreille ne l'attend pas.",
      "Cette petite surprise crée le groove du funk, du reggae, du jazz. Sans elle, le rythme sonne carré.",
    ] },
    { type: "question", quizId: "q-rhy-05" },
    { type: "idee", titre: "Jouer sur les « et »", texte: [
      "Compte « 1 et 2 et 3 et 4 et », puis joue seulement sur les « et » : l'accent glisse d'une croche.",
      "La basse marque les temps, toi tu joues entre. C'est le principe du skank reggae.",
    ] },
    { type: "idee", titre: "La syncope par tenue", texte: [
      "Attaque sur un temps faible et tiens la note par-dessus le temps fort suivant, sans la rejouer.",
      "Elle « vole » l'accent du temps fort. Très courant en bossa nova et en jazz.",
    ] },
    { type: "idee", titre: "Le backbeat", texte: [
      "En rock et en pop, la caisse claire frappe les temps faibles. Ces accents inversés sont la base rythmique du rock'n'roll.",
      "Avec un batteur, sens-les et joue avec eux.",
    ] },
    { type: "question", quizId: "q-rhy-53" },
    { type: "idee", titre: "Un motif syncopé", texte: [
      "Accord sur 1, sur le « et » du 2, sur 3, sur le « et » du 4. Les temps 2 et 4 restent muets.",
      "Compte à voix haute pour placer chaque coup. Une syncope n'est pas du hasard : c'est un décalage précis, régulier dans son irrégularité.",
    ], bloc: {
      type: "rhythm_grid",
      caption: "Syncope classique — accents sur 1, 'et-du-2' et 3, 'et-du-4'",
      data: {
        beats: 4, subdivision: 8,
        highlights: [0, 3, 4, 7],
        muted: [1, 2, 5, 6],
        label: "1 · – · [et] · – · 3 · – · [et] · –",
      },
    } },
    { type: "a-toi", titre: "Le motif sur La mineur",
      consigne: "Sur La mineur, joue le motif : bas sur 1 et 3, haut sur les « et » du 2 et du 4. Entre les coups, la main continue d'aller et venir sans toucher les cordes. Compte « 1 et 2 et 3 et 4 et » à voix haute, au clic.",
      bloc: { type: "strum_pattern", caption: "Bas sur 1 et 3, haut sur le « et » du 2 et du 4", data: { pattern: ["B", "-", "-", "H", "B", "-", "-", "H"], beats: 4, style: "folk", bpm: 60 } },
      bpm: 60, minuteur: 120 },
    { type: "question", quizId: "q-rhy-52" },
    { type: "recap", points: [
      "Syncope : un accent sur un temps faible ou un contretemps.",
      "Deux façons : jouer sur les « et », ou tenir une note par-dessus le temps fort.",
      "Le backbeat accentue les temps faibles : la base du rock.",
    ] },
  ],
  quiz: ["q-rhy-05","q-rhy-52","q-rhy-53"],
};

export const quiz = [
  {id:"q-rhy-05",courseId:"rhythm",lessonId:"rhy-c3-01",lvl:2,q:"Une 'syncope' place l'accent sur…",o:["Le temps fort de chaque mesure","Un temps faible ou un contretemps","La toute fin de la mesure","Le silence entre deux notes"],a:1,exp:"Syncope = accent sur les temps faibles (les 'et' ou les 'e/a'). Source du groove en funk, jazz, reggae, R&B.",xp:30},
  {id:"q-rhy-52",courseId:"rhythm",lessonId:"rhy-c3-01",lvl:1,q:"En rock, sur quels temps la caisse claire frappe-t-elle le plus souvent ?",o:["2 et 4","1 et 3","Seulement le 1","Tous les « et »"],a:0,exp:"C'est le backbeat : l'accent passe sur les temps faibles 2 et 4. Cette inversion des accents est la syncope de base du rock et de la pop.",xp:30},
  {id:"q-rhy-53",courseId:"rhythm",lessonId:"rhy-c3-01",lvl:2,q:"Tu joues un accord sur le « et » du 2 et tu le tiens par-dessus le temps 3. Qu'as-tu créé ?",o:["Une syncope par tenue","Un triolet de croches","Un backbeat sur le 3","Un temps fort doublé"],a:0,exp:"La note attaquée sur le temps faible et tenue sur le temps fort lui « vole » son accent : c'est une syncope par tenue, typique de la bossa et du jazz.",xp:40},
];
