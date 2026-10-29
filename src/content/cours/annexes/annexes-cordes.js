// Leçon d'annexe (module « annexes ») + les questions de quiz qui s'y
// rattachent. Format « leçon en cartes » (src/content/README.md).
// Facultative : pas de palier, jamais bloquante (pathEngine.estModuleAnnexe).

export default {
  id: "annexes-cordes", annexe: true,
  title: "Changer ses cordes",
  duration: 8,
  gropiTip: "Garde ton ancien jeu de cordes dans l'étui : si une corde casse un soir de répétition, tu la remplaces en deux minutes au lieu de t'arrêter.",
  cartes: [
    { type: "idee", titre: "Quand les changer ?", texte: [
      "Des cordes neuves sonnent brillant et tiennent l'accord. La sueur et l'usure les rendent peu à peu ternes : son mat, accord qui bouge, toucher rugueux, traces de rouille.",
      "Si tu joues souvent, compte un changement tous les un à trois mois ; plus tôt si tes mains transpirent beaucoup.",
    ] },
    { type: "question", quizId: "q-cordes-1-annexe" },
    { type: "idee", titre: "Une à une ou toutes ensemble ?", texte: [
      "Sur la plupart des guitares, tu peux tout retirer d'un coup : c'est l'occasion d'essuyer la touche.",
      "Exception : le vibrato flottant, ce chevalet qui bascule, retenu par des ressorts. Là, change-les une à une pour garder l'équilibre entre ressorts et cordes.",
    ] },
    { type: "idee", titre: "Poser la nouvelle corde", texte: [
      "Fixe le bout à boule au chevalet (sur une folk, la cheville le bloque). Passe l'autre bout dans le trou de la mécanique, tends-le, puis laisse environ 5 cm de mou.",
      "Enroule vers le bas, la corde partant de l'intérieur de la tête : deux à trois tours pour une corde filée, un peu plus pour une corde lisse.",
    ] },
    { type: "question", quizId: "q-cordes-4-annexe" },
    { type: "idee", titre: "Pourquoi elle se désaccorde", texte: [
      "Une corde neuve s'allonge pendant ses premières heures : elle descend sans cesse vers le grave.",
      "Pour gagner du temps : accorde, tire doucement chaque corde vers le haut à quelques endroits du manche, puis réaccorde. Deux ou trois passages suffisent.",
      "Coupe l'excédent à quelques millimètres une fois l'accord stable.",
    ] },
    { type: "question", quizId: "q-cordes-2-annexe" },
    { type: "a-toi", titre: "Tends, réaccorde, recommence",
      consigne: "Cordes neuves posées : accorde avec l'accordeur, puis tire doucement chaque corde vers le haut, au milieu du manche. Réaccorde. Refais-le deux fois. Joue ensuite Mi mineur et Sol pendant une minute et contrôle l'accord : il doit à peine bouger.",
      minuteur: 300 },
    { type: "question", quizId: "q-cordes-3-annexe" },
    { type: "recap", points: [
      "Son mat, accord qui bouge, toucher rugueux : il est temps de changer (souvent tous les un à trois mois).",
      "Quelques tours vers le bas sur la mécanique, la corde partant de l'intérieur de la tête ; une à une sur un vibrato flottant.",
      "Une corde neuve s'allonge : tends-la doucement et réaccorde deux ou trois fois.",
    ] },
  ],
  quiz: ["q-cordes-1-annexe", "q-cordes-2-annexe", "q-cordes-3-annexe", "q-cordes-4-annexe"],
};

export const quiz = [
  {id:"q-cordes-1-annexe",courseId:"annexes",lessonId:"annexes-cordes",lvl:1,q:"Ta guitare sonne mat et se désaccorde en plein morceau ; tes cordes ont quatre mois. Premier réflexe ?",o:["Changer le jeu de cordes","Changer de médiator","Resserrer la vis du chevalet","Monter les aigus de l'ampli"],a:0,exp:"Son terne et accord instable sont les signes classiques de cordes usées. Le médiator ou l'égaliseur ne rendront pas leur brillance à des cordes fatiguées.",xp:20},
  {id:"q-cordes-2-annexe",courseId:"annexes",lessonId:"annexes-cordes",lvl:1,q:"À quoi servent les quelques tours de corde enroulés sur la mécanique ?",o:["À empêcher la corde de glisser","À rendre la corde plus aiguë","À protéger la touche de l'usure","À étouffer les harmoniques"],a:0,exp:"Les tours serrés les uns sur les autres bloquent la corde par friction : sans eux, elle glisse dans la mécanique et l'accord ne tient pas.",xp:20},
  {id:"q-cordes-3-annexe",courseId:"annexes",lessonId:"annexes-cordes",lvl:2,q:"Tes cordes neuves redescendent vers le grave toutes les cinq minutes. Que fais-tu ?",o:["Les tendre doucement, puis réaccorder","Les remplacer par un autre jeu","Resserrer les vis des mécaniques","Accorder un demi-ton plus haut"],a:0,exp:"Une corde neuve s'allonge pendant ses premières heures. La tendre doucement à la main accélère cette phase : deux ou trois passages, puis l'accord tient.",xp:25},
  {id:"q-cordes-4-annexe",courseId:"annexes",lessonId:"annexes-cordes",lvl:2,q:"Ta guitare a un vibrato flottant. Comment changes-tu ses cordes ?",o:["Une à une, pour garder l'équilibre","Toutes d'un coup, c'est plus rapide","Les graves d'abord, toutes ensemble","Sans les détendre, à la pince"],a:0,exp:"Un vibrato flottant est tenu en équilibre entre la tension des cordes et celle des ressorts. Tout retirer d'un coup le fait basculer, et il faut ensuite tout rerégler.",xp:25},
];
