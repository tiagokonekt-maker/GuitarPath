// Leçon du module « rhythm » + les questions de quiz qui s'y rattachent.
// Format « leçon en cartes » décrit dans src/content/README.md.

const BALANCIER = {
  type: "strum_pattern",
  caption: "Mouvement pendulaire de base — bas-haut sur chaque temps, sans s'arrêter",
  data: { pattern: ["B","H","B","H","B","H","B","H"], beats: 4, style: "folk", bpm: 80 },
};

export default {
  id: "rhy-c4-01", level: 3,
  title: "La main droite : mouvement pendulaire et continuité",
  duration: 8,
  gropiTip: "Ne laisse pas ta main droite s'arrêter quand la gauche change d'accord : mieux vaut un coup dans le vide ou sur des cordes à vide qu'un trou dans le rythme.",
  cartes: [
    { type: "idee", titre: "Plus loin que le balancier", texte: [
      "Dans Premiers pas, tu as découvert le balancier bas-haut. On l'affine ici : régularité, son des coups bas et hauts, tenue du médiator.",
      "Le but : un geste solide, qui tiendra jusqu'aux doubles-croches.",
    ] },
    { type: "idee", titre: "Chaque position a sa place", texte: [
      "Bas sur les temps, haut sur les « et » : chaque position de la main correspond à un emplacement précis de la mesure.",
      "Un silence, c'est la main qui passe dans le vide ; jamais la main qui s'arrête.",
    ], bloc: BALANCIER },
    { type: "question", quizId: "q-rhy-20" },
    { type: "idee", titre: "Ta main, ton métronome", texte: [
      "Une main qui s'arrête doit redémarrer, et chaque redémarrage décale un peu le temps.",
      "En mouvement continu, elle garde le tempo dans ton corps, quoi que fasse la main gauche.",
    ] },
    { type: "question", quizId: "q-rhy-19" },
    { type: "idee", titre: "Bas épais, haut léger", texte: [
      "Le coup bas attaque du grave vers l'aigu : un son plein, qui marque les temps. Le coup haut part de l'aigu et touche souvent les cordes fines : un son léger.",
      "Cette différence crée d'elle-même un accent sur les temps : c'est le groove de base.",
    ] },
    { type: "idee", titre: "Poignet souple, médiator tenu juste", texte: [
      "Le geste vient du poignet, comme une charnière de porte, pas du bras entier qui fatigue et manque de précision.",
      "Tiens le médiator juste assez pour qu'il ne tourne pas, sans crisper, légèrement incliné par rapport aux cordes.",
    ] },
    { type: "a-toi", titre: "Une corde, deux minutes",
      consigne: "Corde 5 à vide seulement. Balancier bas-haut continu au clic, coups bas un peu plus appuyés, sans regarder ta main. Après une minute, passe en doubles-croches : quatre coups par clic, bas-haut-bas-haut, toujours du poignet.",
      bloc: BALANCIER, bpm: 60, minuteur: 120 },
    { type: "question", quizId: "q-rhy-21" },
    { type: "recap", points: [
      "La main droite ne s'arrête jamais : un silence, c'est un passage dans le vide.",
      "Bas sur les temps, haut sur les « et » : le geste te dit le coup.",
      "Le mouvement vient du poignet, médiator tenu sans crispation.",
    ] },
  ],
  quiz: ["q-rhy-19", "q-rhy-20", "q-rhy-21"],
};

export const quiz = [
  {id:"q-rhy-19",courseId:"rhythm",lessonId:"rhy-c4-01",lvl:1,q:"En strumming, pourquoi garder la main droite en mouvement continu ?",o:["Pour garder la pulsation, même sans toucher", "Pour user moins vite le médiator et les cordes", "Pour jouer plus fort et mieux projeter le son", "Pour économiser son énergie sur les longs morceaux"],a:0,exp:"Le bras devient le métronome. Si le mouvement s'arrête entre deux accords, le tempo s'arrête avec lui. On continue le balancier et on ne touche les cordes qu'aux moments voulus.",xp:25},
  {id:"q-rhy-20",courseId:"rhythm",lessonId:"rhy-c4-01",lvl:2,q:"Une figure en croches commence sur le « et » du 2. Avec quel coup l'attaques-tu ?",o:["Un coup vers le haut","Un coup vers le bas","Un coup bas puis un haut","Peu importe, au choix"],a:0,exp:"Dans le balancier en croches, la main descend sur les temps et remonte sur les « et », sans exception. Une note sur le « et » du 2 se joue donc vers le haut : la correspondance te dit le coup de n'importe quelle figure écrite.",xp:30},
  {id:"q-rhy-21",courseId:"rhythm",lessonId:"rhy-c4-01",lvl:3,q:"Pour jouer un rythme en doubles-croches à tempo rapide, la main droite doit…",o:["Accélérer progressivement ses allers-retours en croches", "Ne faire que des coups vers le bas, plus rapprochés", "Doubler la vitesse du balancier", "Réduire son amplitude de moitié à chaque note"],a:2,exp:"On ne joue pas des doubles-croches en accélérant un mouvement de croches : on installe un balancier deux fois plus rapide dès le départ. Le repère reste le temps, jamais la note.",xp:40},
];
