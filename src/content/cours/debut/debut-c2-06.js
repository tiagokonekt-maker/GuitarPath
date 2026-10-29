// Leçon du module « debut » + les questions de quiz qui s'y rattachent.
// Format « leçon en cartes » décrit dans src/content/README.md.

export default {
  id: "debut-c2-06", level: 0, unite: 2,
  title: "Ta première progression : Sol, Ré, Mi mineur, Do",
  duration: 8,
  gropiTip: "Dans le module Harmonie, tu verras cette boucle notée I-V-vi-IV : ce sont les degrés des accords dans la tonalité. Le même code fonctionne dans toutes les tonalités.",
  cartes: [
    { type: "idee", titre: "La boucle la plus célèbre", texte: [
      "Une progression, c'est une suite d'accords qui tourne en boucle. Sol, Ré, Mi mineur, Do accompagne des centaines de chansons pop, rock et folk.",
      "Tu connais déjà les quatre : Sol (320003), Ré (xx0232), Mi mineur (022000) et Do (x32010).",
    ] },
    { type: "a-toi", titre: "Étape 1 : une mesure par accord", consigne: "Quatre coups vers le bas sur Sol, puis Ré, Mi mineur, Do, et on recommence. Un accord raté ? Ne t'arrête pas : garde le rythme, la main gauche rattrapera. Deux minutes de boucle.", bloc: { type: "chord_diagram", caption: "1. Sol (G) — 320003, le départ de la boucle", data: { name: "G", frets: [3, 2, 0, 0, 0, 3], fingers: [2, 1, 0, 0, 0, 3], startFret: 1 } }, bpm: 60, minuteur: 120 },
    { type: "question", quizId: "q-debut-39" },
    { type: "idee", titre: "Isole le passage qui coince", texte: [
      "Les changements qui coincent le plus ici : Ré vers Mi mineur (tous les doigts bougent) et Mi mineur vers Do.",
      "Travaille seul le passage difficile avec « une minute de changements », puis remets-le dans la boucle.",
    ], bloc: { type: "chord_diagram", caption: "2. Ré (D) — xx0232 : vers Mi mineur, tous les doigts bougent", data: { name: "D", frets: [-1, -1, 0, 2, 3, 2], fingers: [0, 0, 0, 1, 3, 2], startFret: 1 } } },
    { type: "question", quizId: "q-debut-41" },
    { type: "a-toi", titre: "Étape 2 : avec la passe-partout", consigne: "Quand la boucle en quatre coups est fluide, joue la rythmique passe-partout, une mesure par accord. Trop rapide ? Garde deux mesures par accord, le temps de prendre tes marques.", bloc: { type: "strum_pattern", caption: "Une mesure par accord : bas, bas-haut, haut-bas-haut", data: { pattern: ["B", "-", "B", "H", "-", "H", "B", "H"], beats: 4, style: "folk", bpm: 70 } }, bpm: 70 },
    { type: "idee", titre: "Pourquoi ça sonne si bien ?", texte: [
      "Les quatre accords appartiennent à la même tonalité, Sol majeur. Sol est la « maison », où la musique se repose ; Ré crée une tension qui donne envie de revenir ; Mi mineur apporte de la mélancolie ; Do ouvre l'espace.",
    ] },
    { type: "question", quizId: "q-debut-40-app" },
    { type: "a-toi", titre: "Change de point de départ", consigne: "Pars de Mi mineur : Mi mineur, Do, Sol, Ré. Mêmes accords, et pourtant l'ambiance devient plus sombre.", bloc: { type: "chord_diagram", caption: "3. Mi mineur (Em) — 022000, le nouveau départ", data: { name: "Em", frets: [0, 2, 2, 0, 0, 0], fingers: [0, 2, 3, 0, 0, 0], startFret: 1 } }, bpm: 60 },
    { type: "recap", points: [
      "Sol, Ré, Mi mineur, Do : une mesure chacun, sans jamais casser le rythme.",
      "Le passage qui coince se travaille à part, puis revient dans la boucle.",
      "Les quatre accords sont en Sol majeur ; partir de Mi mineur assombrit l'ambiance.",
    ] },
  ],
  quiz: ["q-debut-39", "q-debut-40", "q-debut-41", "q-debut-40-app"],
};

export const quiz = [
  {id:"q-debut-39",courseId:"debut",lessonId:"debut-c2-06",lvl:1,q:"Un accord ne sonne pas parfaitement pendant que tu fais tourner la progression. Que fais-tu ?",o:["Tu t'arrêtes et tu recommences du début","Tu gardes le rythme et tu continues","Tu ralentis jusqu'à ce qu'il sonne","Tu sautes l'accord suivant"],a:1,exp:"Le rythme d'abord : la boucle doit continuer. Un accord imparfait passe, un arrêt casse tout. Les passages difficiles se travaillent à part.",xp:25},
  {id:"q-debut-40",courseId:"debut",lessonId:"debut-c2-06",lvl:2,q:"Dans quelle tonalité se trouve la progression Sol, Ré, Mi mineur, Do ?",o:["Do majeur","Ré majeur","Sol majeur","La mineur"],a:2,exp:"Les quatre accords appartiennent à Sol majeur, et Sol est l'accord sur lequel la boucle se repose. Démarrée sur Mi mineur, la même boucle prend une couleur plus sombre.",xp:30},
  {id:"q-debut-40-app",courseId:"debut",lessonId:"debut-c2-06",lvl:2,q:"La boucle Do, Sol, La mineur, Fa suit le même schéma que Sol, Ré, Mi mineur, Do. Dans quelle tonalité est-elle ?",o:["Do majeur","Sol majeur","Fa majeur","Ré mineur"],a:0,exp:"Même schéma : le premier accord est la « maison ». Sol, Ré, Mi mineur, Do est en Sol majeur ; Do, Sol, La mineur, Fa est en Do majeur.",xp:30},
  {id:"q-debut-41",courseId:"debut",lessonId:"debut-c2-06",lvl:1,q:"Le passage de Ré à Mi mineur te bloque. Quelle est la méthode la plus efficace ?",o:["Le travailler seul, puis le réintégrer","Éviter cette progression","Jouer plus vite pour ne pas y penser","Remplacer Mi mineur par un autre accord"],a:0,exp:"On isole le changement difficile (exercice « une minute de changements ») puis on le réintègre. C'est comme ça que tous les guitaristes progressent.",xp:25},
];
