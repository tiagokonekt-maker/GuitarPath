// Leçon du module « rhythm » + les questions de quiz qui s'y rattachent.
// Format « leçon en cartes » décrit dans src/content/README.md.

export default {
  id: "rhy-c1-01", level: 1,
  title: "Qu'est-ce que le rythme ?",
  duration: 6,
  gropiTip: "Mets le métronome à 60 BPM, compte 4 temps avec lui, puis coupe le son et continue à taper du pied. Rallume-le au bout de 8 temps : tombes-tu encore pile sur le clic ?",
  cartes: [
    { type: "idee", titre: "La pulsation, l'ancre", texte: [
      "Le rythme mélange trois idées souvent confondues. La première, la pulsation : un battement régulier, celui que tu tapes du pied, celui que produit le métronome.",
      "Sans pulsation stable, pas de groove ni de jeu à plusieurs. Jouer « en mesure », c'est rester calé dessus.",
    ], bloc: {
      type: "rhythm_grid",
      caption: "La pulsation — 4 battements strictement égaux",
      data: {
        beats: 4, subdivision: 4,
        accents: [],
        label: "1 · 2 · 3 · 4 — même durée, sans exception",
      },
    } },
    { type: "question", quizId: "q-base-07" },
    { type: "idee", titre: "Le tempo, en BPM", texte: [
      "Le tempo, c'est la vitesse de la pulsation, en battements par minute (BPM). À 60 BPM, un battement par seconde.",
      "Il donne aussi l'ambiance : ballades vers 60–80 BPM, funk souvent 90–110, rock énergique 120–160.",
    ] },
    { type: "question", quizId: "q-base-06" },
    { type: "a-toi", titre: "Une minute sur la pulsation", consigne: "Pose Mi mineur. Tape du pied avec le clic et gratte un coup vers le bas par battement, en comptant « 1, 2, 3, 4 ». Une minute sans accélérer ni ralentir : plus dur qu'il n'y paraît.", bloc: { type: "strum_pattern", caption: "4 noires vers le bas — compte « 1, 2, 3, 4 »", data: { pattern: ["B", "B", "B", "B"], beats: 4, style: "folk", bpm: 60 } }, bpm: 60, minuteur: 60 },
    { type: "idee", titre: "Le rythme, ce qu'on pose dessus", texte: [
      "Troisième idée : le rythme musical, la façon dont les notes se placent par rapport à la pulsation. Longues ou courtes, sur le temps ou entre les temps.",
      "Mêmes notes, autre rythme : un tout autre morceau.",
    ] },
    { type: "question", quizId: "q-rhy-28" },
    { type: "idee", titre: "Le temps intérieur", texte: [
      "Les grands musiciens ont une pulsation intégrée, qui ne dépend ni d'un métronome ni d'un batteur. James Brown arrêtait et relançait son orchestre d'un claquement de doigts.",
      "Ce n'est pas un don : ça se construit, séance après séance, au métronome.",
    ] },
    { type: "question", quizId: "q-rhy-27" },
    { type: "recap", points: [
      "Pulsation = le battement régulier ; tempo = sa vitesse, en BPM.",
      "Le rythme, c'est la place des notes sur cette pulsation.",
      "Le métronome construit ton temps intérieur.",
    ] },
  ],
  quiz: ["q-base-06","q-base-07","q-rhy-27","q-rhy-28"],
};

export const quiz = [
  {id:"q-base-06",courseId:"rhythm",lessonId:"rhy-c1-01",lvl:1,q:"Ton métronome est réglé à 120 BPM. Combien de battements entends-tu par seconde ?",o:["2","1","4","12"],a:0,exp:"BPM = battements par minute : 120 battements en 60 secondes, soit 2 par seconde. À 60 BPM, c'est un battement par seconde, un bon repère pour estimer un tempo.",xp:25},
  {id:"q-base-07",courseId:"rhythm",lessonId:"rhy-c1-01",lvl:1,q:"La 'pulsation' d'un morceau correspond à…",o:["La hauteur des notes jouées","Le nombre de cordes utilisées","Le battement régulier de fond","La durée totale du morceau"],a:2,exp:"La pulsation est ce battement régulier qu'on tape du pied naturellement. Tout le rythme s'organise autour d'elle.",xp:25},
  {id:"q-rhy-27",courseId:"rhythm",lessonId:"rhy-c1-01",lvl:1,q:"Entre un guitariste qui joue des notes savantes mal placées et un autre qui joue des notes simples bien placées…",o:["Le second sonne nettement mieux","Les deux sonnent équivalents","Le premier sonne nettement mieux","Tout dépend de l'accordage employé"],a:0,exp:"Une note juste au mauvais moment s'entend comme une erreur ; une note simple bien placée s'entend comme de la musique. C'est le rythme, pas le vocabulaire, qui sépare le plus nettement l'amateur du professionnel.",xp:25},
  {id:"q-rhy-28",courseId:"rhythm",lessonId:"rhy-c1-01",lvl:2,q:"La pulsation d'un morceau, c'est…",o:["Le dessin rythmique de la mélodie", "La régularité sur laquelle on tape du pied", "La vitesse des notes les plus rapides du morceau", "L'accentuation des temps forts"],a:1,exp:"La pulsation est la grille régulière ; le rythme est ce qu'on pose dessus. On peut jouer beaucoup de notes sur une pulsation lente, et peu sur une rapide — ce sont deux choses distinctes.",xp:30},
];
