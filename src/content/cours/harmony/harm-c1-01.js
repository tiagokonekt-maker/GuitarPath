// Leçon du module « harmony » + les questions de quiz qui s'y rattachent.
// Format « leçon en cartes » décrit dans src/content/README.md.

const SOL = { type: "chord_diagram", caption: "Sol majeur (G) — 320003 : la « maison » de la suite Sol, Do, Ré, Sol", data: { name: "G", frets: [3, 2, 0, 0, 0, 3], fingers: [2, 1, 0, 0, 0, 3], startFret: 1 } };

export default {
  id: "harm-c1-01", level: 1,
  title: "Qu'est-ce que l'harmonie ?",
  duration: 6,
  gropiTip: "Fredonne un La pendant que tu grattes Lam, puis Fa, puis Ré : la même note change de couleur selon l'accord en dessous. C'est exactement ça, l'harmonie.",
  cartes: [
    { type: "idee", titre: "Le troisième pilier", texte: [
      "La mélodie : des notes jouées une par une, à l'horizontale. Le rythme : leur durée et leur place dans le temps.",
      "L'harmonie : plusieurs notes jouées ensemble, à la verticale. Dans une chanson pop, le chant porte la mélodie, la batterie le rythme, les accords l'harmonie.",
    ] },
    { type: "idee", titre: "Tu en fais déjà", texte: [
      "Chaque accord que tu grattes, c'est de l'harmonie : plusieurs notes qui sonnent ensemble et créent une couleur.",
      "Do, par exemple, superpose cinq notes : Do, Mi, Sol, Do, Mi.",
    ], bloc: { type: "chord_diagram", caption: "Do (C) — x32010 : cinq notes jouées ensemble, c'est déjà de l'harmonie", data: {name: "C", frets: [-1,3,2,0,1,0], fingers: [0,3,2,0,1,0], startFret: 1} } },
    { type: "question", quizId: "q-base-05" },
    { type: "a-toi", titre: "Horizontal, puis vertical", consigne: "Pose ton accord de Do. Joue ses cordes une à une, de la 5 à la 1 : c'est une mélodie. Puis gratte-les ensemble : c'est de l'harmonie. Mêmes notes, deux dimensions.", bloc: { type: "tab", caption: "Horizontal puis vertical : les notes de Do une par une (mélodie), puis toutes ensemble (harmonie)", text: "Tab : Do (corde 5 case 3), Mi (corde 4 case 2), Sol (corde 3 à vide), Do (corde 2 case 1), Mi (corde 1 à vide) l'une après l'autre, puis les cinq en même temps.", data: { lines: ["e|---------0---0--|","B|-------1-----1--|","G|-----0-------0--|","D|---2---------2--|","A|-3-----------3--|","E|----------------|"] } }, bpm: 60 },
    { type: "question", quizId: "q-harm-53" },
    { type: "idee", titre: "Une note centrale : la tonique", texte: [
      "Pop, rock, folk, blues, jazz : presque tout repose sur le système tonal. Une note centrale, la tonique, attire toutes les autres.",
      "Les accords s'en éloignent puis y reviennent, comme on rentre à la maison. Comprendre ça, c'est pouvoir analyser, improviser et transposer au lieu d'apprendre des recettes.",
    ] },
    { type: "question", quizId: "q-harm-54-app" },
    { type: "a-toi", titre: "Entends la maison", consigne: "Joue Sol, Do, Ré, Sol, quatre coups par accord au clic. Le dernier Sol sonne comme une arrivée. Rejoue la suite en t'arrêtant sur Ré : la phrase reste en suspens.", bloc: SOL, bpm: 60 },
    { type: "recap", points: [
      "Mélodie = horizontal, harmonie = vertical, rythme = le temps.",
      "Un accord, c'est déjà de l'harmonie : plusieurs notes ensemble.",
      "La musique tonale tourne autour d'une note maison, la tonique.",
    ] },
  ],
  quiz: ["q-base-05","q-harm-53","q-harm-54", "q-harm-54-app"],
};

export const quiz = [
  {id:"q-base-05",courseId:"harmony",lessonId:"harm-c1-01",lvl:1,q:"L'harmonie, en musique, désigne avant tout…",o:["Plusieurs sons joués simultanément","Une suite de notes jouées seule","La vitesse d'un morceau","Le placement des accents"],a:0,exp:"L'harmonie naît de la superposition des sons. La mélodie est horizontale (une note après l'autre), l'harmonie verticale (plusieurs notes ensemble).",xp:25},
  {id:"q-harm-53",courseId:"harmony",lessonId:"harm-c1-01",lvl:1,q:"Tu joues Do, Mi et Sol l'une après l'autre, puis les trois ensemble. Quand fais-tu de l'harmonie ?",o:["Quand les trois sonnent ensemble","Quand tu les joues l'une après l'autre","Dans les deux cas, de la même façon","Dans aucun des deux cas"],a:0,exp:"Une note après l'autre, c'est une ligne mélodique (l'horizontal). Plusieurs notes ensemble, c'est de l'harmonie (le vertical) : ici, l'accord de Do.",xp:30},
  {id:"q-harm-54",courseId:"harmony",lessonId:"harm-c1-01",lvl:2,q:"Dans le système tonal de la pop, du rock ou du blues, autour de quoi la musique s'organise-t-elle ?",o:["Une note centrale, la tonique","Un tempo fixe, toujours le même","Une seule corde de la guitare","Un accord unique, joué en boucle"],a:0,exp:"Le système tonal gravite autour d'une note de repos, la tonique. Notes et accords s'en éloignent puis y reviennent : c'est ce qui donne à une chanson son sentiment de « maison ».",xp:40},
  {id:"q-harm-54-app",courseId:"harmony",lessonId:"harm-c1-01",lvl:1,q:"Tu joues Sol, Do, Ré, Sol, mais tu t'arrêtes sur Ré. Pourquoi la phrase semble-t-elle inachevée ?",o:["Elle n'est pas revenue sur Sol, la tonique","Ré est un accord trop aigu pour finir","Le tempo ralentit sur le dernier accord","Ré se joue avec moins de cordes que Sol"],a:0,exp:"Dans cette suite, Sol est la tonique, la maison. S'arrêter sur Ré, c'est rester dehors : la musique réclame le retour sur Sol.",xp:25},
];
