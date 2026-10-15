// Leçon du module « debut » + les questions de quiz qui s'y rattachent.
// Format « leçon en cartes » décrit dans src/content/README.md.

export default {
  id: "debut-c2-02", level: 0, unite: 2,
  title: "Tes deux premiers accords : Mi mineur et La mineur",
  duration: 7,
  gropiTip: "Ton La mineur grogne dans le grave ? C'est sûrement la corde 6 qui sonne. Démarre ton coup de médiator sur la corde 5, à vide : c'est le La qui donne son nom à l'accord.",
  cartes: [
    { type: "idee", titre: "Deux accords pour commencer", texte: [
      "Les deux accords les plus faciles : deux doigts, puis trois, et presque la même forme. À la fin de cette leçon, tu joues déjà de la musique.",
    ] },
    { type: "idee", titre: "Mi mineur (Em)", texte: [
      "Majeur (2) sur la corde 5, case 2 ; annulaire (3) sur la corde 4, case 2, côte à côte. Gratte les six cordes.",
      "Ses trois notes : Mi, Sol et Si.",
    ], bloc: { type: "chord_diagram", caption: "Mi mineur (Em) — 022000, les 6 cordes", data: { name: "Em", frets: [0, 2, 2, 0, 0, 0], fingers: [0, 2, 3, 0, 0, 0], startFret: 1 } } },
    { type: "question", quizId: "q-debut-25" },
    { type: "idee", titre: "La mineur (Am)", texte: [
      "Index (1) sur la corde 2, case 1 ; majeur (2) sur la corde 4, case 2 ; annulaire (3) sur la corde 3, case 2.",
      "Gratte à partir de la corde 5 : la corde 6 ne se joue pas. Ses notes : La, Do et Mi.",
    ], bloc: { type: "chord_diagram", caption: "La mineur (Am) — x02210, cordes 5 à 1", data: { name: "Am", frets: [-1, 0, 2, 2, 1, 0], fingers: [0, 0, 2, 3, 1, 0], startFret: 1 } } },
    { type: "question", quizId: "q-debut-26" },
    { type: "idee", titre: "Le même duo, une corde plus loin", texte: [
      "Le duo majeur + annulaire de Mi mineur se retrouve dans La mineur, une corde vers les aigus : cordes 4 et 3 au lieu de 5 et 4.",
      "Pour passer de l'un à l'autre, déplace ce duo d'un bloc, sans le démonter, et ajoute ou retire l'index.",
    ] },
    { type: "a-toi", titre: "Chaque corde doit sonner", consigne: "Pose Mi mineur et joue les cordes une par une. Une corde muette ou qui frise ? Doigt trop à plat, trop loin de la frette ou pas assez appuyé : corrige. Puis retire la main et repose l'accord d'un geste, dix fois. Pareil avec La mineur." },
    { type: "question", quizId: "q-debut-28" },
    { type: "recap", points: [
      "Mi mineur = 022000 : majeur et annulaire en case 2, sur les cordes 5 et 4.",
      "La mineur = x02210 : on gratte à partir de la corde 5.",
      "Vérifie corde par corde, puis repose l'accord d'un seul geste.",
    ] },
  ],
  quiz: ["q-debut-25", "q-debut-26", "q-debut-27", "q-debut-28"],
};

export const quiz = [
  {id:"q-debut-25",courseId:"debut",lessonId:"debut-c2-02",lvl:1,q:"Dans l'accord de Mi mineur, sur quelles cordes se posent les doigts ?",o:["Cordes 5 et 4, case 2","Cordes 3 et 2, case 1","Cordes 6 et 5, case 3","Cordes 2 et 1, case 2"],a:0,exp:"Em = 022000 : majeur sur la corde 5 case 2, annulaire sur la corde 4 case 2, tout le reste à vide.",xp:25},
  {id:"q-debut-26",courseId:"debut",lessonId:"debut-c2-02",lvl:1,q:"Quelle corde ne doit pas être jouée dans l'accord de La mineur ?",o:["La corde 1 (Mi aigu)","La corde 6 (Mi grave)","La corde 5 (La)","La corde 3 (Sol)"],a:1,exp:"Am = x02210 : on gratte à partir de la corde 5, qui donne justement la note La, la fondamentale de l'accord.",xp:25},
  {id:"q-debut-27",courseId:"debut",lessonId:"debut-c2-02",lvl:2,q:"Quelles sont les trois notes de l'accord de Mi mineur ?",o:["Mi, Sol#, Si","Mi, Sol, Si","Mi, La, Do","Mi, Sol, Do"],a:1,exp:"Mi mineur = Mi, Sol, Si. Avec Sol# à la place de Sol, ce serait Mi majeur : c'est cette seule note qui change la couleur de l'accord.",xp:30},
  {id:"q-debut-28",courseId:"debut",lessonId:"debut-c2-02",lvl:1,q:"Une corde frise quand tu joues ton accord. Que vérifies-tu en premier ?",o:["Que tu grattes assez fort","Le placement et la pression du doigt sur cette corde","Que le médiator est assez épais","Que tu comptes bien les temps"],a:1,exp:"Une corde qui frise vient presque toujours de la main gauche : doigt trop loin de la frette, pas assez appuyé, ou un doigt voisin qui la touche.",xp:25},
];
