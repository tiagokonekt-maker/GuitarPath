// Leçon du module « debut » + les questions de quiz qui s'y rattachent.
// Format décrit dans src/content/README.md.

export default {
  id: "debut-c2-02", level: 0, unite: 2,
  title: "Tes deux premiers accords : Mi mineur et La mineur",
  duration: 7,
  content: [
    { type: "p", text: "On commence par les deux accords les plus faciles de la guitare. Deux doigts pour le premier, trois pour le second, et une forme presque identique. À la fin de cette leçon, tu sauras déjà jouer de la musique." },
    { type: "h", text: "Mi mineur (Em)" },
    { type: "chord_diagram", caption: "Mi mineur (Em) — 022000, les 6 cordes", data: { name: "Em", frets: [0, 2, 2, 0, 0, 0], fingers: [0, 2, 3, 0, 0, 0], startFret: 1 } },
    { type: "p", text: "Majeur (2) sur la corde 5, case 2. Annulaire (3) sur la corde 4, case 2. Les deux doigts sont côte à côte, dans la même case. Gratte les six cordes, de la plus grave à la plus aiguë. Mi mineur contient trois notes : Mi, Sol et Si, réparties sur les six cordes." },
    { type: "h", text: "La mineur (Am)" },
    { type: "chord_diagram", caption: "La mineur (Am) — x02210, cordes 5 à 1", data: { name: "Am", frets: [-1, 0, 2, 2, 1, 0], fingers: [0, 0, 2, 3, 1, 0], startFret: 1 } },
    { type: "p", text: "Index (1) sur la corde 2, case 1. Majeur (2) sur la corde 4, case 2. Annulaire (3) sur la corde 3, case 2. Gratte à partir de la corde 5 : la corde 6 ne se joue pas. La mineur contient les notes La, Do et Mi." },
    { type: "h", text: "Le lien entre les deux" },
    { type: "p", text: "Regarde bien : le duo majeur + annulaire de Mi mineur se retrouve dans La mineur, décalé d'une corde vers les aigus (cordes 4 et 3 au lieu de 5 et 4). Pour passer de l'un à l'autre, déplace ce duo d'un bloc, sans le démonter, et ajoute ou retire l'index." },
    { type: "h", text: "Vérifier que tout sonne" },
    { type: "p", text: "Pose l'accord, puis joue les cordes une par une, lentement, de la plus grave à la plus aiguë. Chaque corde doit sonner clairement. Une corde muette ou qui frise ? Trouve le coupable : un doigt trop à plat qui touche la corde voisine, un doigt trop loin de la frette, ou pas assez de pression. Corrige, puis recommence." },
    { type: "tip", text: "Exercice : pose Mi mineur, gratte une fois, retire la main gauche complètement, et repose l'accord. Dix fois. Puis pareil avec La mineur. Le but n'est pas la vitesse : c'est que tes doigts retrouvent la forme tout seuls, d'un seul geste." },
  ],
  quiz: ["q-debut-25", "q-debut-26", "q-debut-27", "q-debut-28"],
};

export const quiz = [
  {id:"q-debut-25",courseId:"debut",lessonId:"debut-c2-02",lvl:1,q:"Dans l'accord de Mi mineur, sur quelles cordes se posent les doigts ?",o:["Cordes 5 et 4, case 2","Cordes 3 et 2, case 1","Cordes 6 et 5, case 3","Cordes 2 et 1, case 2"],a:0,exp:"Em = 022000 : majeur sur la corde 5 case 2, annulaire sur la corde 4 case 2, tout le reste à vide.",xp:25},
  {id:"q-debut-26",courseId:"debut",lessonId:"debut-c2-02",lvl:1,q:"Quelle corde ne doit pas être jouée dans l'accord de La mineur ?",o:["La corde 1 (Mi aigu)","La corde 6 (Mi grave)","La corde 5 (La)","La corde 3 (Sol)"],a:1,exp:"Am = x02210 : on gratte à partir de la corde 5, qui donne justement la note La, la fondamentale de l'accord.",xp:25},
  {id:"q-debut-27",courseId:"debut",lessonId:"debut-c2-02",lvl:2,q:"Quelles sont les trois notes de l'accord de Mi mineur ?",o:["Mi, Sol#, Si","Mi, Sol, Si","Mi, La, Do","Mi, Sol, Do"],a:1,exp:"Mi mineur = Mi, Sol, Si. Avec Sol# à la place de Sol, ce serait Mi majeur : c'est cette seule note qui change la couleur de l'accord.",xp:30},
  {id:"q-debut-28",courseId:"debut",lessonId:"debut-c2-02",lvl:1,q:"Une corde frise quand tu joues ton accord. Que vérifies-tu en premier ?",o:["Que tu grattes assez fort","Le placement et la pression du doigt sur cette corde","Que le médiator est assez épais","Que tu comptes bien les temps"],a:1,exp:"Une corde qui frise vient presque toujours de la main gauche : doigt trop loin de la frette, pas assez appuyé, ou un doigt voisin qui la touche.",xp:25},
];
