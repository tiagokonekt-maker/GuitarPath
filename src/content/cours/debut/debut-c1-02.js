// Leçon du module « debut » + les questions de quiz qui s'y rattachent.
// Format décrit dans src/content/README.md.

export default {
  id: "debut-c1-02", level: 0, unite: 1,
  title: "La main gauche : pouce, doigts, frettes",
  duration: 7,
  content: [
    { type: "p", text: "Ta main gauche choisit les notes : elle appuie les cordes contre le manche pour en changer la hauteur. Bien placée, elle travaille sans effort et chaque note sonne claire. Mal placée, elle se fatigue vite et les notes frisent. Trois réglages suffisent pour bien démarrer." },
    { type: "h", text: "Les doigts ont un numéro" },
    { type: "p", text: "Sur tous les diagrammes et toutes les méthodes, les doigts de la main gauche sont numérotés : 1 = index, 2 = majeur, 3 = annulaire, 4 = auriculaire (le petit doigt). Le pouce ne compte pas, il reste derrière le manche. Retiens ces numéros dès maintenant, tu vas les croiser dans chaque accord." },
    { type: "h", text: "Réglage 1 : le pouce derrière le manche" },
    { type: "p", text: "Pose la pulpe du pouce au dos du manche, à peu près en face de ton majeur, vers le milieu de la largeur du manche. Le pouce ne serre pas : il sert d'appui pour que les doigts puissent presser les cordes. Si ta paume colle au manche, éloigne-la : il doit y avoir un petit espace entre le manche et le creux de ta main." },
    { type: "h", text: "Réglage 2 : des doigts arrondis, le bout sur la corde" },
    { type: "p", text: "Appuie avec le bout du doigt, pas avec la pulpe à plat. Tes doigts forment un petit pont arrondi, comme si tu tenais une balle de tennis. C'est ce qui évite de toucher les cordes voisines par accident et d'étouffer leur son. Pour ça, il faut des ongles courts côté main gauche : un ongle qui dépasse t'empêche d'appuyer avec le bout." },
    { type: "h", text: "Réglage 3 : juste derrière la frette" },
    { type: "p", text: "Les frettes sont les barrettes de métal du manche. La case 1 est l'espace entre le sillet (la pièce blanche en haut du manche) et la première frette, la case 2 l'espace suivant, etc. Pour jouer une case, pose le doigt tout près de la frette qui la ferme, du côté de la case. Au milieu de la case, il faut appuyer beaucoup plus fort ; posé sur la frette elle-même, le son est étouffé." },
    {
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
    },
    { type: "h", text: "Combien appuyer ?" },
    { type: "p", text: "Moins que tu ne le crois. Essaie : pose l'index sur la corde 1, case 1, et joue la corde. Relâche petit à petit la pression jusqu'à ce que la note se mette à friser, puis rajoute juste un peu de pression pour qu'elle sonne nette. C'est ça, la bonne dose. Serrer plus ne rend pas la note plus juste, ça te fatigue et ça peut même la faire monter légèrement." },
    { type: "tip", text: "Le bout des doigts qui chauffe les deux ou trois premières semaines, c'est normal : la peau s'endurcit et forme de la corne. En revanche, une douleur au poignet, au pouce ou dans l'avant-bras n'est pas normale. Arrête-toi, secoue la main, et vérifie ta posture : souvent, le pouce serre trop fort." },
  ],
  quiz: ["q-debut-04", "q-debut-05", "q-debut-06", "q-debut-07"],
};

export const quiz = [
  {id:"q-debut-04",courseId:"debut",lessonId:"debut-c1-02",lvl:1,q:"Sur un diagramme d'accord, quel doigt porte le numéro 3 ?",o:["L'index","Le majeur","L'annulaire","L'auriculaire"],a:2,exp:"1 = index, 2 = majeur, 3 = annulaire, 4 = auriculaire. Le pouce, lui, reste derrière le manche et n'a pas de numéro.",xp:25},
  {id:"q-debut-05",courseId:"debut",lessonId:"debut-c1-02",lvl:1,q:"Pour jouer la case 3, où poses-tu le doigt ?",o:["Pile sur la troisième frette","Au milieu exact de la case","Tout près de la frette qui ferme la case, côté case","Tout près du sillet, en haut du manche"],a:2,exp:"Juste derrière la frette, côté case : c'est là qu'il faut le moins de force pour une note nette. Au milieu, il faut appuyer bien plus fort ; sur la frette, le son est étouffé.",xp:25},
  {id:"q-debut-06",courseId:"debut",lessonId:"debut-c1-02",lvl:1,q:"Ton doigt touche la corde voisine et l'étouffe. Que corriger d'abord ?",o:["Appuyer beaucoup plus fort","Arrondir le doigt pour appuyer avec le bout","Coller la paume contre le manche","Jouer plus doucement de la main droite"],a:1,exp:"Un doigt arrondi, posé sur le bout, laisse passer les cordes voisines. À plat, la pulpe déborde et les étouffe. Pense aussi à couper tes ongles de main gauche.",xp:25},
  {id:"q-debut-07",courseId:"debut",lessonId:"debut-c1-02",lvl:2,q:"Après dix minutes de jeu, ton poignet gauche te fait mal. Quelle est la bonne réaction ?",o:["Continuer, c'est la corne qui se forme","Faire une pause et vérifier posture et pression du pouce","Serrer plus fort pour finir plus vite","Changer de médiator"],a:1,exp:"La corne concerne le bout des doigts, pas le poignet. Une douleur au poignet signale une tension : guitare mal placée, pouce qui serre trop. On s'arrête et on corrige.",xp:30},
];
