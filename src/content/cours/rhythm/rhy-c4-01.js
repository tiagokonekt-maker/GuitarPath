// Leçon du module « rhythm » + les questions de quiz qui s'y rattachent.
// Format décrit dans src/content/README.md.

export default {
  id: "rhy-c4-01", level: 3,
  title: "La main droite : mouvement pendulaire et continuité",
  duration: 10,
  gropiTip: "Ne laisse pas ta main droite s'arrêter quand la gauche change d'accord : mieux vaut un coup dans le vide ou sur des cordes à vide qu'un trou dans le rythme.",
  content: [
    { type: "p", text: "Tout le rythme de la guitare passe par la main droite. C'est elle qui donne vie aux accords et aux riffs. Pourtant, c'est souvent la main la plus négligée dans l'apprentissage — on se concentre sur les doigts de la main gauche (les notes) en oubliant que sans une main droite solide et régulière, rien ne groove. Cette leçon remet la main droite au centre." },
    { type: "h", text: "Le mouvement pendulaire : la base absolue" },
    { type: "p", text: "La main droite doit se déplacer comme un pendule : bas-haut-bas-haut, de façon régulière et continue. Ce mouvement ne s'arrête JAMAIS, même quand tu ne touches pas les cordes. Les notes sonnent quand la main touche les cordes, les silences se créent quand la main passe dans le vide ou sur des cordes étouffées. Mais le mouvement, lui, continue toujours." },
    { type: "h", text: "Pourquoi la continuité est cruciale" },
    { type: "p", text: "Si tu arrêtes le mouvement de ta main droite entre les notes, tu dois le 'redémarrer' à chaque fois. Ce redémarrage crée inévitablement des micro-irrégularités de timing. Avec un mouvement continu, ta main droite devient un métronome physique — elle maintient le tempo dans ton corps, indépendamment de ce que joue ta main gauche." },
    { type: "h", text: "Coups bas et coups hauts" },
    { type: "p", text: "Coup bas (downstroke) : la main descend, le médiator attaque les cordes du grave à l'aigu. Son plus 'épais', plus puissant. Coup haut (upstroke) : la main monte, le médiator attaque les cordes de l'aigu au grave. Son plus 'fin', plus léger. Alterner les deux crée naturellement un accent sur les bas (temps forts) et une légèreté sur les hauts (temps faibles). C'est le groove de base." },
    {
      type: "strum_pattern",
      caption: "Mouvement pendulaire de base — bas-haut sur chaque temps, sans s'arrêter",
      data: { pattern: ["B","H","B","H","B","H","B","H"], beats: 4, style: "folk", bpm: 80 },
    },
    { type: "h", text: "Le médium : pression et angle" },
    { type: "p", text: "Tiens le médiator entre le pouce et l'index avec juste assez de pression pour qu'il ne tombe pas, mais sans crisper. Un médiator tenu trop fort crée un son dur et mécanique. Tenu trop lâche, il tourne et tu perds le contrôle. L'angle idéal : légèrement incliné par rapport aux cordes (pas perpendiculaire) pour un son fluide et une résistance minimale." },
    { type: "h", text: "Le poignet vs le bras" },
    { type: "p", text: "Pour le strumming, le mouvement doit venir principalement du poignet, pas du bras entier. Un strumming 'de bras' fatigue vite et manque de précision. Un strumming 'de poignet' permet de jouer longtemps avec des patterns complexes. Imagine que ton poignet est la charnière d'une porte : le bas de la porte (la main) se balance, la charnière (poignet) reste souple." },
    { type: "h", text: "Commencer par une seule corde" },
    { type: "p", text: "Pour développer le mouvement pendulaire sans complexité harmonique : joue un accord de Am, mais joue uniquement la corde de La (c5) à vide. Fais le mouvement pendulaire bas-haut-bas-haut à 60 BPM sans t'arrêter pendant 2 minutes. Concentre-toi UNIQUEMENT sur la régularité du mouvement. C'est l'exercice de base de tout professeur de guitare sérieux." },
    { type: "ref", text: "Tommy Emmanuel (guitariste australien virtuose de fingerstyle et flatpicking) passe les premières 10 minutes de chaque session à travailler uniquement le mouvement pendulaire de la main droite sur une corde. Il dit que c'est cet exercice quotidien qui lui a permis de développer le groove qu'il a aujourd'hui après 50 ans de guitare." },
    { type: "tip", text: "Drill main droite (5 min) : pas d'accords. Une seule corde (c5 vide). Mouvement pendulaire continu à 80 BPM. Accent légèrement plus fort sur les coups bas. Ne t'arrête pas, ne regarde pas ta main. Si tu dévies du métronome, c'est là où tu travailles." },
  ],
  quiz: ["q-rhy-19", "q-rhy-20", "q-rhy-21"],
};

export const quiz = [
  {id:"q-rhy-19",courseId:"rhythm",lessonId:"rhy-c4-01",lvl:1,q:"En strumming, pourquoi garder la main droite en mouvement continu ?",o:["Pour garder la pulsation, même sans toucher", "Pour user moins vite le médiator et les cordes", "Pour jouer plus fort et mieux projeter le son", "Pour économiser son énergie sur les longs morceaux"],a:0,exp:"Le bras devient le métronome. Si le mouvement s'arrête entre deux accords, le tempo s'arrête avec lui. On continue le balancier et on ne touche les cordes qu'aux moments voulus.",xp:25},
  {id:"q-rhy-20",courseId:"rhythm",lessonId:"rhy-c4-01",lvl:2,q:"Dans un mouvement pendulaire en croches, le coup vers le haut tombe sur…",o:["Les fins de mesure uniquement","Les « et », entre les temps","Les temps eux-mêmes","Le premier temps seulement"],a:1,exp:"Descente sur les temps, remontée sur les « et ». Cette correspondance est constante : elle te dit instantanément quel coup employer pour n'importe quelle figure écrite en croches.",xp:30},
  {id:"q-rhy-21",courseId:"rhythm",lessonId:"rhy-c4-01",lvl:3,q:"Pour jouer un rythme en doubles-croches à tempo rapide, la main droite doit…",o:["Accélérer progressivement ses allers-retours en croches", "Ne faire que des coups vers le bas, plus rapprochés", "Doubler la vitesse du balancier", "Réduire son amplitude de moitié à chaque note"],a:2,exp:"On ne joue pas des doubles-croches en accélérant un mouvement de croches : on installe un balancier deux fois plus rapide dès le départ. Le repère reste le temps, jamais la note.",xp:40},
];
