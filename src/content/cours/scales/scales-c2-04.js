// Leçon du module « scales » + les questions de quiz qui s'y rattachent.
// Format « leçon en cartes » décrit dans src/content/README.md.

const CYCLE = {
  type: "circle_of_fifths",
  caption: "Cercle des quintes — Do, Sol, Ré, La, Fa en évidence (les 5 tonalités les plus courantes)",
  data: {
    highlight: ["Do", "Sol", "Ré", "La", "Fa"],
    showMinors: true,
  },
};

export default {
  id: "scales-c2-04", level: 6,
  title: "Le cycle des quintes : la carte des tonalités",
  duration: 8,
  gropiTip: "Pour lire une armure en dièses, prends le dernier dièse et monte d'un demi-ton : Fa#, Do#, Sol# → le dernier est Sol#, donc La majeur.",
  cartes: [
    { type: "idee", titre: "Une horloge des tonalités", texte: [
      "Le cycle des quintes range les 12 tonalités majeures comme une horloge. À midi, Do, sans altération.",
      "En tournant d'un cran, on avance d'une quinte et on gagne une altération. Une carte mentale pour transposer, moduler et lire une armure.",
    ], bloc: CYCLE },
    { type: "idee", titre: "Vers la droite : les dièses", texte: [
      "Monte d'une quinte depuis Do : Sol majeur, 1 dièse (Fa#). Encore une : Ré, 2 dièses. Puis La (3), Mi (4), Si (5), Fa# (6), Do# (7).",
      "Chaque quinte garde les dièses précédents et en ajoute un.",
    ] },
    { type: "question", quizId: "q-logic-02" },
    { type: "idee", titre: "Vers la gauche : les bémols", texte: [
      "Descends d'une quinte depuis Do : Fa majeur, 1 bémol (Si♭). Puis Si♭ (2), Mi♭ (3), La♭ (4), Ré♭ (5), Sol♭ (6), Do♭ (7).",
      "En bas de l'horloge, Fa# et Sol♭ se rejoignent : même son, deux écritures.",
    ] },
    { type: "idee", titre: "L'ordre des altérations", texte: [
      "Les dièses arrivent toujours dans le même ordre : Fa, Do, Sol, Ré, La, Mi, Si. Les bémols, dans l'ordre inverse : Si, Mi, La, Ré, Sol, Do, Fa.",
      "Astuce côté bémols : l'avant-dernier bémol de l'armure donne la tonalité. Si♭, Mi♭ → Si♭ majeur.",
    ] },
    { type: "question", quizId: "q-scales-03" },
    { type: "idee", titre: "Les relatives mineures", texte: [
      "Chaque tonalité majeure a une relative mineure, sur son 6e degré : mêmes notes, même armure, autre fondamentale.",
      "Do majeur et La mineur, Sol majeur et Mi mineur. Sur le cercle, elles occupent la même case.",
    ] },
    { type: "a-toi", titre: "Fais le tour à la guitare",
      consigne: "Joue les accords ouverts dans l'ordre du cycle : Do, Sol, Ré, La, Mi. Quatre coups chacun, au clic. Sur chaque accord, dis à voix haute son nombre de dièses. Puis repars de Do vers Fa.",
      bloc: CYCLE, bpm: 60 },
    { type: "question", quizId: "q-scales-02" },
    { type: "recap", points: [
      "Une quinte de plus = un dièse de plus ; une quinte de moins = un bémol de plus.",
      "Ordre des dièses : Fa Do Sol Ré La Mi Si ; des bémols : Si Mi La Ré Sol Do Fa.",
      "La relative mineure, sur le 6e degré, partage l'armure de la majeure.",
    ] },
  ],
  quiz: ["q-scales-02","q-scales-03","q-logic-01","q-logic-02","q-scales-30","q-scales-31"],
};

export const quiz = [
  {id:"q-scales-02",courseId:"scales",lessonId:"scales-c2-04",lvl:2,q:"La gamme de Mi majeur contient combien de dièses ?",o:["2","3","4","5"],a:2,exp:"Mi majeur = Mi-Fa#-Sol#-La-Si-Do#-Ré#. Soit 4 dièses : Fa#, Sol#, Do#, Ré#. C'est l'armure de Mi majeur (et de Do# mineur, son relatif).",xp:40},
  {id:"q-scales-03",courseId:"scales",lessonId:"scales-c2-04",lvl:3,q:"Quelle gamme majeure contient exactement 3 bémols ?",o:["Sib majeur","Lab majeur","Réb majeur","Mib majeur"],a:3,exp:"Mib majeur = Mib-Fa-Sol-Lab-Sib-Do-Ré. 3 bémols : Mib, Lab, Sib. Sib maj = 2b. Lab maj = 4b. Réb maj = 5b. Cycle des quintes.",xp:45},
  {id:"q-logic-01",courseId:"scales",lessonId:"scales-c2-04",lvl:2,q:"Combien de tonalités majeures sonnent réellement différemment ?",o:["12","7","10","24"],a:0,exp:"Une par note de la gamme chromatique : 12. Certaines s'écrivent de deux façons (Fa# = Sol♭, Si = Do♭, Do# = Ré♭), d'où 15 armures sur le papier, de 0 à 7 dièses ou 7 bémols.",xp:35},
  {id:"q-logic-02",courseId:"scales",lessonId:"scales-c2-04",lvl:2,q:"En passant de Sol majeur à Ré majeur sur le cycle des quintes, quel dièse s'ajoute ?",o:["Do#","Fa#","Sol#","Ré#"],a:0,exp:"Sol majeur a déjà Fa#. Ré majeur, une quinte plus haut, le garde et ajoute Do#. Les dièses arrivent toujours dans le même ordre : Fa#, Do#, Sol#, Ré#, La#, Mi#, Si#.",xp:55},
  {id:"q-scales-30",courseId:"scales",lessonId:"scales-c2-04",lvl:1,q:"Combien de bémols compte la tonalité de Fa majeur ?",o:["1","2","0","3"],a:0,exp:"Fa majeur = Fa Sol La Si♭ Do Ré Mi : un seul bémol, Si♭. C'est le premier pas du cycle des quintes côté bémols, une quinte sous Do.",xp:30},
  {id:"q-scales-31",courseId:"scales",lessonId:"scales-c2-04",lvl:2,q:"Quelle est la relative mineure de Sol majeur ?",o:["Mi mineur", "Ré mineur", "Si mineur", "La mineur"],a:0,exp:"La relative mineure est sur le 6e degré : Sol-La-Si-Do-Ré-Mi → Mi mineur, mêmes notes que Sol majeur.",xp:40},
];
