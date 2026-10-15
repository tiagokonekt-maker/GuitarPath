// Leçon du module « debut » + les questions de quiz qui s'y rattachent.
// Format décrit dans src/content/README.md.

export default {
  id: "debut-c2-06", level: 0, unite: 2,
  title: "Ta première progression : Sol, Ré, Mi mineur, Do",
  duration: 8,
  content: [
    { type: "p", text: "Une progression, c'est une suite d'accords qui tourne en boucle. Celle-ci est sans doute la plus célèbre de la musique populaire : Sol, Ré, Mi mineur, Do. Elle accompagne des centaines de chansons pop, rock et folk. Avec tout ce que tu as appris, tu as les moyens de la jouer en entier." },
    { type: "h", text: "Les quatre accords" },
    { type: "chord_diagram", caption: "1. Sol (G) — 320003", data: { name: "G", frets: [3, 2, 0, 0, 0, 3], fingers: [2, 1, 0, 0, 0, 3], startFret: 1 } },
    { type: "chord_diagram", caption: "2. Ré (D) — xx0232", data: { name: "D", frets: [-1, -1, 0, 2, 3, 2], fingers: [0, 0, 0, 1, 3, 2], startFret: 1 } },
    { type: "chord_diagram", caption: "3. Mi mineur (Em) — 022000", data: { name: "Em", frets: [0, 2, 2, 0, 0, 0], fingers: [0, 2, 3, 0, 0, 0], startFret: 1 } },
    { type: "chord_diagram", caption: "4. Do (C) — x32010", data: { name: "C", frets: [-1, 3, 2, 0, 1, 0], fingers: [0, 3, 2, 0, 1, 0], startFret: 1 } },
    { type: "h", text: "Étape 1 : une mesure par accord, quatre coups vers le bas" },
    { type: "p", text: "Métronome à 60 BPM. Quatre coups vers le bas sur Sol, quatre sur Ré, quatre sur Mi mineur, quatre sur Do, et on recommence. Ne t'arrête pas si un accord n'est pas parfait : garde le rythme, la main gauche rattrapera. Fais tourner la boucle pendant deux minutes." },
    { type: "h", text: "Étape 2 : repérer les passages difficiles" },
    { type: "p", text: "Les changements qui coincent le plus souvent ici : Ré vers Mi mineur (les doigts changent tous de place) et Mi mineur vers Do. Isole le passage qui te pose problème et travaille-le seul avec l'exercice « une minute de changements », puis remets-le dans la boucle." },
    { type: "h", text: "Étape 3 : avec la rythmique passe-partout" },
    { type: "strum_pattern", caption: "Une mesure par accord : bas, bas-haut, haut-bas-haut", data: { pattern: ["B", "-", "B", "H", "-", "H", "B", "H"], beats: 4, style: "folk", bpm: 70 } },
    { type: "p", text: "Quand la boucle en quatre coups est fluide, remplace-les par la rythmique bas, bas-haut, haut-bas-haut, une mesure par accord. Si c'est trop rapide, garde deux mesures par accord le temps de prendre tes marques." },
    { type: "h", text: "Pourquoi ça sonne si bien ?" },
    { type: "p", text: "Ces quatre accords appartiennent tous à la même tonalité, Sol majeur. Sol est l'accord « maison », celui sur lequel la musique semble se reposer ; Ré crée une petite tension qui donne envie de revenir ; Mi mineur apporte une touche de mélancolie ; Do ouvre l'espace. Tu découvriras tout ça en détail dans le module Harmonie." },
    { type: "tip", text: "Essaie de démarrer la boucle ailleurs : Mi mineur, Do, Sol, Ré. Ce sont exactement les mêmes accords, et pourtant l'ambiance devient plus sombre, plus mélancolique. Même boucle, autre point de départ, autre émotion." },
  ],
  quiz: ["q-debut-39", "q-debut-40", "q-debut-41"],
};

export const quiz = [
  {id:"q-debut-39",courseId:"debut",lessonId:"debut-c2-06",lvl:1,q:"Un accord ne sonne pas parfaitement pendant que tu fais tourner la progression. Que fais-tu ?",o:["Tu t'arrêtes et tu recommences du début","Tu gardes le rythme et tu continues","Tu ralentis jusqu'à ce qu'il sonne","Tu sautes l'accord suivant"],a:1,exp:"Le rythme d'abord : la boucle doit continuer. Un accord imparfait passe, un arrêt casse tout. Les passages difficiles se travaillent à part.",xp:25},
  {id:"q-debut-40",courseId:"debut",lessonId:"debut-c2-06",lvl:2,q:"Dans quelle tonalité se trouve la progression Sol, Ré, Mi mineur, Do ?",o:["Do majeur","Ré majeur","Sol majeur","La mineur"],a:2,exp:"Les quatre accords appartiennent à Sol majeur, et Sol est l'accord sur lequel la boucle se repose. Démarrée sur Mi mineur, la même boucle prend une couleur plus sombre.",xp:30},
  {id:"q-debut-41",courseId:"debut",lessonId:"debut-c2-06",lvl:1,q:"Le passage de Ré à Mi mineur te bloque. Quelle est la méthode la plus efficace ?",o:["Le travailler seul, en boucle, puis le remettre dans la progression","Éviter cette progression","Jouer plus vite pour ne pas y penser","Remplacer Mi mineur par un autre accord"],a:0,exp:"On isole le changement difficile (exercice « une minute de changements ») puis on le réintègre. C'est comme ça que tous les guitaristes progressent.",xp:25},
];
