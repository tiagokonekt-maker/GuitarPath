// Leçon du module « scales » + les questions de quiz qui s'y rattachent.
// Format « leçon en cartes » décrit dans src/content/README.md.

const POSITION_1 = {
  type: "scale_pattern",
  caption: "La pentatonique mineure — Position 1 (case 5), la plus utilisée",
  data: {
    startFret: 4, endFret: 9,
    rootColor: "amber", noteColor: "primary", accentColor: "coral",
    strings: [
      { frets: [5, 8], root: [5] },
      { frets: [5, 7], root: [] },
      { frets: [5, 7], root: [7] },
      { frets: [5, 7], root: [] },
      { frets: [5, 8], root: [] },
      { frets: [5, 8], root: [5] },
    ],
    noteMap: {
      "5,0":"La","8,0":"Do",
      "5,1":"Ré","7,1":"Mi",
      "5,2":"Sol","7,2":"La",
      "5,3":"Do","7,3":"Ré",
      "5,4":"Mi","8,4":"Sol",
      "5,5":"La","8,5":"Do",
    },
  },
};

export default {
  id: "scales-c3-01", level: 6,
  title: "La pentatonique mineure : la gamme universelle",
  duration: 8,
  gropiTip: "Improvise 4 notes dans la position 1, puis termine toujours sur un La (case 5 corde 6, case 7 corde 4 ou case 5 corde 1). Ton oreille sentira qu'elle est rentrée à la maison.",
  cartes: [
    { type: "idee", titre: "Cinq notes, partout", texte: [
      "« Penta » veut dire cinq : la pentatonique n'a que 5 notes, contre 7 pour la gamme majeure.",
      "Blues, rock, pop, soul, funk : c'est la gamme la plus jouée à la guitare. Moins de notes, moins de risques de fausse note.",
    ] },
    { type: "idee", titre: "La formule", texte: [
      "Pentatonique mineure : 1 - ♭3 - 4 - 5 - ♭7. La fondamentale, la tierce mineure, la quarte, la quinte et la septième mineure.",
      "En La : La, Do, Ré, Mi, Sol.",
    ] },
    { type: "question", quizId: "q-scales-05-app" },
    { type: "idee", titre: "Pourquoi elle sonne juste", texte: [
      "Elle part de la gamme mineure naturelle et en retire le 2e et le 6e degré, les deux notes qui forment des demi-tons tendus.",
      "Restent 5 notes qui vont sur presque tout accord mineur et sur le blues.",
    ] },
    { type: "question", quizId: "q-logic-10" },
    { type: "idee", titre: "La position 1, case 5", texte: [
      "Deux notes par corde, de la case 5 à la case 8 : index sur la case 5, annulaire sur la 7, auriculaire sur la 8.",
      "Les La, en ambre, sont tes points d'appui : cordes 6 et 1 case 5, corde 4 case 7.",
    ], bloc: POSITION_1 },
    { type: "a-toi", titre: "Monte, descends, au clic",
      consigne: "Joue la position 1 de la corde 6 à la corde 1, puis redescends : une note par clic, à 60 BPM. Pars et termine sur le La grave. Deux minutes, sans accélérer. Refais-le chaque jour d'une semaine.",
      bloc: POSITION_1, bpm: 60, minuteur: 120 },
    { type: "idee", titre: "Sur quoi la jouer", texte: [
      "Sur un blues, sur une progression en mineur, sur la plupart des solos rock. En La mineur, c'est ton terrain sûr.",
      "Ton outil de survie en improvisation : tu peux penser au rythme et au phrasé avant de penser aux notes.",
    ] },
    { type: "question", quizId: "q-impro-17" },
    { type: "recap", points: [
      "Pentatonique mineure : 1 - ♭3 - 4 - 5 - ♭7 ; en La, La Do Ré Mi Sol.",
      "Sans le 2 et le ♭6, pas de demi-ton tendu : elle sonne juste presque partout.",
      "Position 1 en La : cases 5 à 8, deux notes par corde.",
    ] },
  ],
  quiz: ["q-scales-05","q-logic-10","q-fret-scales-02","q-impro-16","q-impro-17","q-impro-20", "q-scales-05-app"],
};

export const quiz = [
  {id:"q-scales-05",courseId:"scales",lessonId:"scales-c3-01",lvl:1,q:"La pentatonique mineure suit la formule…",o:["1-2-3-5-6","1-♭3-4-5-♭7","1-2-♭3-4-5-♭6-♭7","1-3-5-7"],a:1,exp:"Penta mineure = 1-♭3-4-5-♭7. 5 notes seulement. Elle retire le 2 et le ♭6 de la mineure naturelle (les notes qui créent les demi-tons les plus tendus).",xp:30},
  {id:"q-scales-05-app",courseId:"scales",lessonId:"scales-c3-01",lvl:1,q:"Applique la formule de la pentatonique mineure depuis Mi : quelles notes obtiens-tu ?",o:["Mi, Sol, La, Si, Ré","Mi, Sol#, La, Si, Ré","Mi, Sol, La, Si♭, Ré","Mi, Fa#, La, Si, Ré"],a:0,exp:"1 Mi, ♭3 Sol (3 demi-tons), 4 La, 5 Si, ♭7 Ré. Sol# ferait une tierce majeure, Si♭ une quinte diminuée.",xp:25},
  {id:"q-logic-10",courseId:"scales",lessonId:"scales-c3-01",lvl:3,q:"Pourquoi la pentatonique 'sonne juste' sur tant de progressions différentes ?",o:["Elle retire les notes à risque, 2 et ♭6","Elle contient les notes de tous les accords","Elle ne garde que les notes de l'accord","Elle évite la tierce, ni majeure ni mineure"],a:0,exp:"Penta mineure = 1-♭3-4-5-♭7. Elle évite le 2 (forme demi-ton avec ♭3) et ♭6 (forme demi-ton avec 5). Sans ces 2 demi-tons tendus, elle 'pose' sur quasi tous les accords mineurs et blues.",xp:65},
  {id:"q-fret-scales-02",type:"fretboard",courseId:"scales",lessonId:"scales-c3-01",lvl:1,q:"Sélectionne les notes de la pentatonique mineure de La (cases 5-8)",concept:{type:"find_scale",root:"A",quality:"pentatonic_minor"},selectionRules:{mode:"all"},fretRange:[4,9],display:{showNotes:false},hint:"Position 1 classique autour de la case 5.",xp:50,exp:"Pentatonique mineure de La position 1 : La-Do-Ré-Mi-Sol."},
  {id:"q-impro-16",courseId:"impro",lessonId:"scales-c3-01",lvl:1,q:"Improviser, c'est d'abord…",o:["Jouer le plus de notes possible","Jouer sans réfléchir du tout","Reproduire un solo appris par cœur","Faire des choix dans un cadre connu"],a:3,exp:"On n'improvise jamais à partir de rien : on choisit, en temps réel, parmi des possibilités qu'on connaît. Plus le cadre est maîtrisé, plus les choix sont libres — c'est exactement l'inverse de l'intuition courante.",xp:25},
  {id:"q-impro-17",courseId:"impro",lessonId:"scales-c3-01",lvl:1,q:"Sur un morceau en La mineur, par quelle gamme commencer pour improviser ?",o:["La pentatonique mineure de La","La gamme chromatique complète","Mi phrygien","Do majeur"],a:0,exp:"La pentatonique mineure de La ne contient aucune note qui puisse sonner franchement fausse sur cette tonalité. C'est ce qui en fait le point de départ universel : on peut se concentrer sur le rythme et le phrasé avant de penser aux notes.",xp:25},
  {id:"q-impro-20",courseId:"impro",lessonId:"scales-c3-01",lvl:2,q:"Un débutant en impro joue sans jamais s'arrêter. Quel est le premier conseil ?",o:["Apprendre davantage de gammes avant de jouer", "Monter progressivement en vitesse à chaque tour", "Changer de position sur le manche", "Laisser des silences entre des phrases courtes"],a:3,exp:"Un flux ininterrompu ne s'entend pas comme de la musique mais comme un exercice. Jouer quatre notes puis se taire deux temps transforme immédiatement le résultat, sans rien apprendre de nouveau.",xp:30},
];
