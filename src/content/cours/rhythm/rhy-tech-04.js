// Leçon du module « rhythm » (Rythme & phrasing) + ses questions de quiz.
// Format « leçon en cartes » décrit dans src/content/README.md.
// Technique, 4 sur 4 : les glissés (/ et \), arriver sur une note, en
// sortir, et changer de position (pentatonique : position 1 → 2, vues dans
// scales-c3-02 et scales-c3-05, avant cette leçon dans le palier).
// Le lecteur de tab ne lit un glissé qu'avec ses deux cases (5/7, 7\5) :
// les glissés d'arrivée et de sortie sont donc écrits depuis / vers une
// case précise.

const TAB_GLISSES = {
  type: "tab",
  caption: "Arriver en glissant, puis sortir en glissant, dans la position 1",
  text: "Tab — corde 3 : glissé de la case 5 à la case 7 (Ré), tenu ; corde 2 : cases 5 puis 8 ; corde 1 : case 5 (La) ; pour finir, corde 3 : glissé descendant de la case 7 à la case 5.",
  data: { lines: [
    "e|----------------|5---------------|",
    "B|--------5---8---|----------------|",
    "G|5/7-------------|--------7\\5-----|",
    "D|----------------|----------------|",
    "A|----------------|----------------|",
    "E|----------------|----------------|",
  ] },
};

const TAB_CHANGEMENT = {
  type: "tab",
  caption: "Le glissé qui change de position : corde 3, case 7 vers case 9, et retour",
  text: "Tab — une note par temps : corde 4 cases 5 et 7, corde 3 case 5, puis glissé de la case 7 à la case 9 (on passe en position 2) ; corde 2 cases 8 et 10, corde 1 cases 8 et 10. Retour : corde 1 cases 10 et 8, corde 2 cases 10 et 8, glissé de la case 9 à la case 7 sur la corde 3 (retour en position 1), corde 3 case 5, corde 4 cases 7 et 5.",
  data: { lines: [
    "e|----------------|--------8---10--|10--8-----------|----------------|",
    "B|----------------|8---10----------|--------10--8---|----------------|",
    "G|--------5---7/9-|----------------|----------------|9\\7-5-----------|",
    "D|5---7-----------|----------------|----------------|--------7---5---|",
    "A|----------------|----------------|----------------|----------------|",
    "E|----------------|----------------|----------------|----------------|",
  ] },
};

export default {
  id: "rhy-tech-04", level: 6,
  title: "Les slides : glisser d'une note à l'autre",
  duration: 8,
  gropiTip: "Pour un glissé de sortie, relâche la pression en route : la note s'éteint pendant qu'elle descend, sans grésillement au bout. Aucun besoin de viser une case d'arrivée.",
  cartes: [
    { type: "idee", titre: "Glisser sans relâcher", texte: [
      "5/7 : attaque la case 5, puis glisse le doigt jusqu'à la case 7 sans le décoller ni relâcher la pression. Une seule attaque, la note voyage.",
      "7\\5, c'est le même geste vers le grave.",
    ] },
    { type: "idee", titre: "Arriver sur le temps", texte: [
      "Dans une phrase, c'est la note d'arrivée qui compte : elle tombe sur le temps. Le départ se joue donc un peu avant.",
      "Glisse vite, et tiens la note d'arrivée : on doit l'entendre clairement.",
    ] },
    { type: "question", quizId: "q-rhy-slide-01-tech" },
    { type: "idee", titre: "Entrer dans une note, en sortir", texte: [
      "Glissé d'arrivée : pars une ou deux cases sous la note visée et glisse jusqu'à elle, comme 5/7 vers le Ré de la corde 3. La note s'annonce.",
      "Glissé de sortie : après la note, glisse vers le grave en relâchant peu à peu. Elle s'éteint en descendant.",
    ], bloc: TAB_GLISSES },
    { type: "a-toi", titre: "Glissés d'arrivée et de sortie",
      consigne: "Joue la tab au clic à 60 : le Ré de la corde 3 arrive par un glissé, pile sur le premier temps. La dernière note sort en glissant vers le grave.",
      bloc: TAB_GLISSES, bpm: 60, minuteur: 90 },
    { type: "question", quizId: "q-rhy-slide-02-tech" },
    { type: "idee", titre: "Changer de position", texte: [
      "Un glissé déplace toute la main. En position 1, l'annulaire joue la corde 3, case 7. Glisse-le jusqu'à la case 9 : la main est en position 2, et l'annulaire y joue justement cette case 9.",
      "Au retour, 9\\7 te ramène en position 1.",
    ] },
    { type: "a-toi", titre: "D'une position à l'autre",
      consigne: "Monte en position 1, glisse de la case 7 à la case 9 sur la corde 3, finis en position 2, puis reviens par le même glissé. Au clic à 60, puis 70. La main suit le doigt sans à-coup.",
      bloc: TAB_CHANGEMENT, bpm: 60, minuteur: 120 },
    { type: "question", quizId: "q-rhy-slide-03-tech" },
    { type: "recap", points: [
      "/ glisse vers l'aigu, \\ vers le grave : pression constante, une seule attaque.",
      "La note d'arrivée tombe sur le temps ; le glissé de sortie s'éteint en descendant.",
      "Un glissé change de position : corde 3, case 7 vers 9, de la position 1 à la 2.",
    ] },
  ],
  quiz: ["q-rhy-slide-01-tech", "q-rhy-slide-02-tech", "q-rhy-slide-03-tech", "q-debut-49"],
};

export const quiz = [
  {id:"q-rhy-slide-01-tech",courseId:"rhythm",lessonId:"rhy-tech-04",lvl:1,q:"Pendant un glissé de la case 5 à la case 7, que fait le doigt ?",o:["Il garde la pression tout du long","Il se soulève à mi-chemin","Il relâche, puis réappuie en 7","Il frappe la case 7 en arrivant"],a:0,exp:"La pression reste constante : la corde continue de sonner pendant que le doigt glisse, et la note voyage sans nouvelle attaque.",xp:25},
  {id:"q-rhy-slide-02-tech",courseId:"rhythm",lessonId:"rhy-tech-04",lvl:2,q:"Au clic, tu joues 5/7 sur un temps. Quelle note doit tomber pile sur le temps ?",o:["La case 7, celle d'arrivée","La case 5, celle de départ","La case 6, au milieu","Aucune : le glissé est libre"],a:0,exp:"C'est la note d'arrivée qui porte la mélodie : elle tombe sur le temps, le départ du glissé se joue juste avant.",xp:30},
  {id:"q-rhy-slide-03-tech",courseId:"rhythm",lessonId:"rhy-tech-04",lvl:2,q:"En La pentatonique mineure, position 1, tu glisses sur la corde 3 de la case 7 à la case 9. Dans quelle position arrives-tu ?",o:["La position 2","La position 3","La position 5","Toujours la position 1"],a:0,exp:"La position 2 couvre les cases 7 à 10, et sa corde 3 se joue en cases 7 et 9 : le glissé te dépose dedans, l'annulaire sur le Mi de la case 9.",xp:35},
];
