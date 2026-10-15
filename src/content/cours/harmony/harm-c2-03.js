// Leçon du module « harmony » + les questions de quiz qui s'y rattachent.
// Format décrit dans src/content/README.md.

export default {
  id: "harm-c2-03", level: 6,
  title: "Les 12 triades majeures — mémorisation",
  duration: 9,
  gropiTip: "Retiens par familles : Do, Fa et Sol ont leurs trois notes naturelles ; Ré, Mi et La n'ont que leur tierce diésée (Fa#, Sol#, Do#). Six triades en une seule phrase.",
  content: [
    { type: "p", text: "Il y a 12 notes dans la gamme chromatique, donc 12 triades majeures. Les mémoriser toutes paraît intimidant, mais avec la bonne méthode, c'est accessible en quelques semaines. Cette leçon te donne la stratégie la plus efficace." },
    { type: "h", text: "Groupe 1 : les triades sans altérations ou 1 altération" },
    { type: "p", text: "Do : Do-Mi-Sol (0 altération). Sol : Sol-Si-Ré (1 dièse). Fa : Fa-La-Do (1 bémol). Ces 3 triades sont les plus faciles à mémoriser — peu d'altérations, notes souvent jouées en position ouverte." },
    { type: "h", text: "Groupe 2 : les triades courantes (2-3 altérations)" },
    { type: "p", text: "Ré : Ré-Fa#-La. La : La-Do#-Mi. Mi : Mi-Sol#-Si. Sib : Sib-Ré-Fa. Mib : Mib-Sol-Sib. Ce groupe couvre les tonalités les plus utilisées en pop/rock." },
    { type: "h", text: "Groupe 3 : les triades riches en altérations" },
    { type: "p", text: "Si : Si-Ré#-Fa#. Fa# : Fa#-La#-Do#. Do# : Do#-Mi#-Sol# (Mi# sonne comme Fa). Sol# : Sol#-Si#-Ré# (Si# sonne comme Do). La tierce d'une triade porte toujours le nom de la note située deux lettres plus loin : d'où Mi# et Si#, pas Fa et Do. Moins fréquentes, mais importantes pour le jazz et la musique classique." },
    {
      type: "degree_chart",
      caption: "Les 12 triades majeures — vert : groupe 1, ambre : groupe 2, corail : groupe 3",
      data: {
        boxes: [
          { top: "Do",  label: "Do – Mi – Sol",     sub: "0 alt.", tint: "green" },
          { top: "Sol", label: "Sol – Si – Ré",      sub: "1#",     tint: "green" },
          { top: "Fa",  label: "Fa – La – Do",       sub: "1♭",     tint: "green" },
          { top: "Ré",  label: "Ré – Fa# – La",      sub: "2#",     tint: "amber" },
          { top: "La",  label: "La – Do# – Mi",      sub: "3#",     tint: "amber" },
          { top: "Mi",  label: "Mi – Sol# – Si",     sub: "4#",     tint: "amber" },
          { top: "Sib", label: "Sib – Ré – Fa",      sub: "2♭",     tint: "amber" },
          { top: "Mib", label: "Mib – Sol – Sib",    sub: "3♭",     tint: "amber" },
          { top: "Si",  label: "Si – Ré# – Fa#",     sub: "5#",     tint: "coral" },
          { top: "Fa#", label: "Fa# – La# – Do#",    sub: "6#",     tint: "coral" },
          { top: "Do#", label: "Do# – Fa – Sol#",    sub: "7#",     tint: "coral" },
          { top: "Sol#",label: "Sol# – Do – Ré#",    sub: "4♭",     tint: "coral" },
        ],
      },
    },
    { type: "h", text: "Méthode de mémorisation par groupes" },
    { type: "p", text: "Semaine 1 : mémorise le groupe 1 (Do, Sol, Fa). Semaine 2 : ajoute Ré et La. Semaine 3 : ajoute Mi et Sib. Semaine 4 : ajoute Mib et Si. Semaine 5 : finalise avec Fa#, Do#, Sol#. 5 semaines pour les 12 triades majeures. Au lieu de tout apprendre d'un coup, tu construis progressivement." },
    { type: "h", text: "Pattern mnémotechnique : le cycle des quintes" },
    { type: "p", text: "Les 12 tonalités suivent le cycle des quintes (vu dans le module Gammes). Si tu mémorises l'ordre du cycle (Do-Sol-Ré-La-Mi-Si-Fa#-Do# ; Fa-Sib-Mib-Lab-Réb-Solb), les altérations des triades correspondantes suivent une logique : chaque quinte ajoute 1 altération. Comprendre le cycle simplifie l'apprentissage des 12 triades." },
    { type: "h", text: "Sur la guitare : les formes CAGED comme aide" },
    { type: "p", text: "Les formes CAGED (vues dans le module Manche) sont ta béquille pour mémoriser les triades. Si tu sais que la forme E barrée donne un accord majeur dont la fondamentale est sur c6, alors la triade de cet accord = les 3 notes principales de la forme E. Tu n'as pas à calculer : la forme te donne les notes." },
    { type: "ref", text: "Jeu pratique : prends une radio ou une playlist et écoute les premières secondes de chaque chanson. Essaie d'identifier le premier accord joué. Est-ce majeur ou mineur ? Puis essaie de trouver de quelle tonalité il s'agit. Cet exercice d'écoute active développe l'oreille harmonique plus vite que n'importe quelle mémorisation théorique." },
    { type: "tip", text: "Mémo visuel : écris les 12 triades majeures sur une feuille, avec fondamentale / tierce / quinte en colonnes. Colle-la dans ta chambre. Regarde-la chaque jour. En 3 semaines de simple exposition visuelle, tu les mémoriseras sans effort conscient." },
  ],
  quiz: ["q-harm-26", "q-harm-27"],
};

export const quiz = [
  {id:"q-harm-26",courseId:"harmony",lessonId:"harm-c2-03",lvl:1,q:"Quelles sont les notes de la triade de Ré majeur ?",o:["Ré-Fa-La", "Ré-Fa#-La", "Ré-Fa#-La#", "Ré-Sol-La"],a:1,exp:"Triade majeure = fondamentale, tierce majeure, quinte juste : Ré, Fa#, La.",xp:30},
  {id:"q-harm-27",courseId:"harmony",lessonId:"harm-c2-03",lvl:2,q:"Pourquoi la tierce de Do# majeur s'écrit-elle Mi# et non Fa ?",o:["Parce que Fa n'existe pas en Do#", "Pour éviter d'écrire un bémol dans l'accord", "Parce qu'une tierce est deux lettres plus loin", "Parce que Mi# sonne plus aigu que Fa"],a:2,exp:"Une tierce est deux lettres plus loin : Do → Mi. Élevé d'un demi-ton, c'est Mi#, qui sonne comme Fa.",xp:40},
];
