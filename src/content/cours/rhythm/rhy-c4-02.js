// Leçon du module « rhythm » + les questions de quiz qui s'y rattachent.
// Format « leçon en cartes » décrit dans src/content/README.md.

const POP = {
  type: "strum_pattern",
  caption: "Pattern pop syncopé — silence sur le 3, accents contretemps",
  data: { pattern: ["B","-","B","H","-","H","B","H"], beats: 4, style: "pop", bpm: 90 },
};

export default {
  id: "rhy-c4-02", level: 4,
  title: "Patterns de strumming : folk, pop, rock",
  duration: 9,
  gropiTip: "Chante le pattern pop avant de le jouer : « bas, bas-haut, haut-bas-haut ». Le piège : sur le 3, ta main doit quand même descendre dans le vide, sinon le haut qui suit tombe à côté.",
  cartes: [
    { type: "idee", titre: "Écrire un pattern", texte: [
      "Dans Premiers pas, tu as joué la passe-partout. Ici, on écrit les patterns et on les range par style.",
      "B = coup bas, H = coup haut, - = la main passe dans le vide, x = accord étouffé, un « tchk ». Une virgule sépare les temps.",
    ] },
    { type: "question", quizId: "q-rhy-p34-02" },
    { type: "idee", titre: "Folk : tout sonne", texte: [
      "BH, BH, BH, BH : huit croches, et tous les coups touchent les cordes.",
      "Un son équilibré, régulier : la base d'innombrables chansons folk acoustiques.",
    ], bloc: {
      type: "strum_pattern",
      caption: "Pattern folk — B H B H B H B H (8 croches uniformes)",
      data: { pattern: ["B","H","B","H","B","H","B","H"], beats: 4, style: "folk", bpm: 90 },
    } },
    { type: "idee", titre: "Pop : deux trous", texte: [
      "B-, BH, -H, BH : c'est ta passe-partout, écrite.",
      "Le « et » du 1 et le temps 3 passent dans le vide, sans que la main s'arrête : ces deux trous créent la syncope.",
    ], bloc: POP },
    { type: "question", quizId: "q-rhy-23" },
    { type: "idee", titre: "Rock : tout vers le bas", texte: [
      "B, B, B, B : quatre coups bas par mesure, souvent en power chords, avec du palm mute. Un son compact et direct.",
      "Version plus groovy : le geste pop, en power chords, palm mute sur les coups bas et accent sur le 2 et le 4.",
    ], bloc: {
      type: "strum_pattern",
      caption: "Pattern rock — 4 downstrokes, toute l'énergie vers le bas",
      data: { pattern: ["B","B","B","B"], beats: 4, style: "rock", bpm: 120 },
    } },
    { type: "question", quizId: "q-rhy-24" },
    { type: "idee", titre: "Choisir son pattern", texte: [
      "Écoute la chanson et imite ce que tu entends. Lent et intime : arpège ou noires. Énergique : coups bas rock. Léger : folk ou pop.",
      "Dans le doute, le folk BH, BH, BH, BH passe presque partout.",
    ] },
    { type: "a-toi", titre: "Trois styles, un accord",
      consigne: "Sur Sol, au clic : 4 mesures de folk, 4 de pop, 4 de rock tout en coups bas. Puis rejoue le pop en power chord Sol5, palm mute sur les coups bas : même geste, autre style.",
      bloc: POP, bpm: 80 },
    { type: "recap", points: [
      "B bas, H haut, - dans le vide, x étouffé : un pattern s'écrit temps par temps.",
      "Folk BH ×4, pop B-, BH, -H, BH, rock B B B B.",
      "Un même geste change de style par les accents et l'étouffement.",
    ] },
  ],
  quiz: ["q-rhy-22", "q-rhy-23", "q-rhy-24", "q-rhy-p34-02"],
};

export const quiz = [
  {id:"q-rhy-22",courseId:"rhythm",lessonId:"rhy-c4-02",lvl:1,q:"Le pattern de strumming le plus répandu en pop tient en combien de temps ?",o:["Un seul temps, répété","Deux temps, répétés deux fois","Quatre mesures complètes","Une mesure de quatre temps"],a:3,exp:"La quasi-totalité des patterns pop se bouclent sur une mesure de 4/4 et se répètent. En apprendre un solide t'ouvre des centaines de morceaux — c'est le meilleur rapport effort/répertoire de la guitare.",xp:25},
  {id:"q-rhy-23",courseId:"rhythm",lessonId:"rhy-c4-02",lvl:2,q:"Dans le pattern pop B-, BH, -H, BH, quand la main passe-t-elle dans le vide ?",o:["Sur le « et » du 1 et le temps 3","Sur le temps 1 et le « et » du 3","Sur les temps 2 et 4","Jamais, tous les coups sonnent"],a:0,exp:"B- : le 1 sonne, le « et » du 1 est manqué. BH : le 2 et son « et » sonnent. -H : le 3 est manqué, son « et » sonne. Le bras ne s'arrête jamais : il passe au-dessus des cordes sur ces deux trous, ce qui crée la syncope du pattern.",xp:30},
  {id:"q-rhy-24",courseId:"rhythm",lessonId:"rhy-c4-02",lvl:3,q:"Pourquoi un même pattern sonne folk sur une guitare et rock sur une autre ?",o:["Parce que le tempo employé n'est pas le même", "Les accents, l'étouffement, les cordes jouées", "Parce que les accords choisis sont complètement différents", "À cause du nombre de cordes de l'instrument"],a:1,exp:"Le squelette rythmique est identique ; ce qui change est l'interprétation — accents plus marqués, palm mute, attaque limitée aux cordes graves. Un pattern n'est pas un genre, c'est une grille qu'on habille.",xp:40},
  {id:"q-rhy-p34-02",courseId:"rhythm",lessonId:"rhy-c4-02",lvl:1,q:"Dans un pattern noté B-, BH, -H, BH, que demande le tiret ?",o:["Un passage de la main dans le vide","Un accord étouffé, un « tchk »","Un coup bas plus appuyé","Une pause d'une mesure entière"],a:0,exp:"Le tiret marque un coup manqué : la main continue son balancier mais ne touche pas les cordes. L'accord étouffé, lui, s'écrit x : on touche les cordes, sans les laisser sonner.",xp:25},
];
