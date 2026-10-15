// Leçon du module « debut » + les questions de quiz qui s'y rattachent.
// Format « leçon en cartes » décrit dans src/content/README.md.

export default {
  id: "debut-c1-02", level: 0, unite: 1,
  title: "La main gauche : pouce, doigts, frettes",
  duration: 7,
  gropiTip: "Mini-exercice : joue la case 1 de la corde 1 avec chaque doigt tour à tour (1, 2, 3 puis 4), en cherchant à chaque fois la pression minimale qui donne une note nette.",
  cartes: [
    { type: "idee", titre: "Les doigts ont un numéro", texte: [
      "Ta main gauche choisit les notes. Partout, ses doigts sont numérotés : 1 = index, 2 = majeur, 3 = annulaire, 4 = auriculaire.",
      "Le pouce n'a pas de numéro : il reste derrière le manche.",
    ] },
    { type: "question", quizId: "q-debut-04" },
    { type: "idee", titre: "Pouce derrière, doigts arrondis", texte: [
      "Pouce au dos du manche, en face du majeur : il sert d'appui, il ne serre pas. La paume ne colle pas au manche.",
      "Appuie avec le bout des doigts, arrondis comme autour d'une balle : ils épargnent les cordes voisines. D'où des ongles courts à gauche.",
    ] },
    { type: "idee", titre: "Juste derrière la frette", texte: [
      "Les frettes sont les barrettes de métal. La case 1 est entre le sillet (la pièce blanche en haut du manche) et la première frette.",
      "Pose le doigt tout près de la frette qui ferme la case. Au milieu, il faut appuyer plus fort ; sur la frette, le son est étouffé.",
    ], bloc: {
      type: "note_grid",
      caption: "Corde 1 (Mi aigu) : case 1 = Fa, case 3 = Sol — appuie tout près de la frette, côté case",
      data: {
        string: 1, stringName: "Mi aigu", maxFret: 5,
        highlights: [
          { fret: 0, label: "Mi", color: "neutral" },
          { fret: 1, label: "Fa", color: "primary" },
          { fret: 3, label: "Sol", color: "green" },
        ],
      },
    } },
    { type: "question", quizId: "q-debut-05" },
    { type: "a-toi", titre: "Trouve la pression minimale", consigne: "Index sur la corde 1, case 1 : joue la note. Relâche peu à peu jusqu'à ce qu'elle frise, puis rajoute juste assez de pression pour qu'elle sonne nette. C'est la bonne dose : serrer plus ne fait que fatiguer. Refais-le avec les doigts 2, 3 et 4." },
    { type: "idee", titre: "Bout des doigts ou poignet ?", texte: [
      "Le bout des doigts qui chauffe les premières semaines, c'est normal : la corne se forme.",
      "Une douleur au poignet, au pouce ou dans l'avant-bras, non. Arrête-toi, secoue la main et vérifie ta posture : souvent, le pouce serre trop.",
    ] },
    { type: "question", quizId: "q-debut-07" },
    { type: "recap", points: [
      "1 index, 2 majeur, 3 annulaire, 4 auriculaire ; le pouce reste derrière le manche.",
      "Le bout des doigts, arrondis, tout près de la frette, côté case.",
      "Juste assez de pression pour une note nette. Mal au poignet : pause et correction.",
    ] },
  ],
  quiz: ["q-debut-04", "q-debut-05", "q-debut-06", "q-debut-07"],
};

export const quiz = [
  {id:"q-debut-04",courseId:"debut",lessonId:"debut-c1-02",lvl:1,q:"Sur un diagramme d'accord, quel doigt porte le numéro 3 ?",o:["L'index","Le majeur","L'annulaire","L'auriculaire"],a:2,exp:"1 = index, 2 = majeur, 3 = annulaire, 4 = auriculaire. Le pouce, lui, reste derrière le manche et n'a pas de numéro.",xp:25},
  {id:"q-debut-05",courseId:"debut",lessonId:"debut-c1-02",lvl:1,q:"Pour jouer la case 3, où poses-tu le doigt ?",o:["Pile sur la troisième frette","Au milieu exact de la case","Tout près de la frette qui ferme la case, côté case","Tout près du sillet, en haut du manche"],a:2,exp:"Juste derrière la frette, côté case : c'est là qu'il faut le moins de force pour une note nette. Au milieu, il faut appuyer bien plus fort ; sur la frette, le son est étouffé.",xp:25},
  {id:"q-debut-06",courseId:"debut",lessonId:"debut-c1-02",lvl:1,q:"Ton doigt touche la corde voisine et l'étouffe. Que corriger d'abord ?",o:["Appuyer beaucoup plus fort","Arrondir le doigt pour appuyer avec le bout","Coller la paume contre le manche","Jouer plus doucement de la main droite"],a:1,exp:"Un doigt arrondi, posé sur le bout, laisse passer les cordes voisines. À plat, la pulpe déborde et les étouffe. Pense aussi à couper tes ongles de main gauche.",xp:25},
  {id:"q-debut-07",courseId:"debut",lessonId:"debut-c1-02",lvl:2,q:"Après dix minutes de jeu, ton poignet gauche te fait mal. Quelle est la bonne réaction ?",o:["Continuer, c'est la corne qui se forme","Faire une pause et vérifier posture et pression du pouce","Serrer plus fort pour finir plus vite","Changer de médiator"],a:1,exp:"La corne concerne le bout des doigts, pas le poignet. Une douleur au poignet signale une tension : guitare mal placée, pouce qui serre trop. On s'arrête et on corrige.",xp:30},
];
