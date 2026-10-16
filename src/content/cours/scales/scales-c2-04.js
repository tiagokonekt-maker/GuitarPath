// Leçon du module « scales » + les questions de quiz qui s'y rattachent.
// Format décrit dans src/content/README.md.

export default {
  id: "scales-c2-04", level: 6,
  title: "Le cycle des quintes : la carte des tonalités",
  duration: 10,
  gropiTip: "Pour lire une armure en dièses, prends le dernier dièse et monte d'un demi-ton : Fa#, Do#, Sol# → le dernier est Sol#, donc La majeur.",
  content: [
    { type: "p", text: "Le cycle des quintes est un schéma qui organise les 12 tonalités majeures (et leurs équivalents mineurs) dans un ordre logique. Comprendre ce cycle = avoir une carte mentale de toute la musique tonale, qui te permet de moduler, transposer, et naviguer entre tonalités." },
    { type: "h", text: "Le principe : monter de quinte en quinte" },
    { type: "p", text: "Pars de Do majeur (0 altération). Monte d'une quinte juste : tu arrives à Sol majeur (1 dièse : Fa#). Encore une quinte : Ré majeur (2 dièses). Encore : La majeur (3 dièses). Mi (4#), Si (5#), Fa# (6#), Do# (7#). À chaque quinte ajoutée, on ajoute un dièse à l'armure de la tonalité." },
    { type: "h", text: "Le sens inverse : descendre par quintes" },
    { type: "p", text: "Depuis Do majeur, descends d'une quinte : Fa majeur (1 bémol : Si♭). Encore : Si♭ majeur (2 bémols). Mi♭ (3), La♭ (4), Ré♭ (5), Sol♭ (6), Do♭ (7). Côté bémols, on en ajoute un à chaque descente de quinte." },
    { type: "h", text: "Pourquoi c'est utile" },
    { type: "p", text: "1) Pour savoir l'armure d'une tonalité instantanément (ex: 'Mi majeur c'est combien de dièses ?' → Mi est à 4 quintes de Do, donc 4 dièses). 2) Pour moduler proprement entre tonalités voisines (les tonalités voisines dans le cycle partagent presque toutes leurs notes). 3) Pour comprendre les progressions d'accords (beaucoup de progressions jazz suivent le cycle : Cm7-F7-Bb7-Eb...)." },
    { type: "h", text: "L'ordre des dièses et bémols" },
    { type: "p", text: "Les dièses apparaissent toujours dans le même ordre quand tu montes le cycle : Fa# - Do# - Sol# - Ré# - La# - Mi# - Si#. Tu peux le mémoriser comme 'Fa Do Sol Ré La Mi Si'. Les bémols apparaissent dans l'ordre inverse : Si♭ - Mi♭ - La♭ - Ré♭ - Sol♭ - Do♭ - Fa♭. Soit 'Si Mi La Ré Sol Do Fa'." },
    { type: "h", text: "Tonalités relatives mineures" },
    { type: "p", text: "Chaque tonalité majeure a une tonalité mineure 'relative' qui partage exactement les mêmes notes. La relative mineure se trouve sur le 6e degré de la majeure. Do majeur ↔ La mineur (mêmes notes). Sol majeur ↔ Mi mineur. Etc. Ces deux tonalités ont la même armure mais des fondamentales différentes." },
    {
      type: "circle_of_fifths",
      caption: "Cercle des quintes — Do, Sol, Ré, La, Fa en évidence (les 5 tonalités les plus courantes)",
      data: {
        highlight: ["Do", "Sol", "Ré", "La", "Fa"],
        showMinors: true,
      },
    },
    { type: "ref", text: "Pour visualiser le cycle des quintes : représente-le comme une horloge. À midi : Do (0 altération). En tournant à droite (heures 1, 2, 3...) on monte par quintes et on ajoute des dièses : Sol, Ré, La, Mi, Si... À 6h : Fa# (6 altérations, milieu du cycle). Continue à droite : Ré♭, La♭, Mi♭, Si♭, Fa, et retour à Do à midi. C'est une boucle complète." },
    { type: "tip", text: "Apprends d'abord les 5 tonalités les plus courantes : Do (0), Sol (1#), Ré (2#), La (3#), Fa (1♭). Ces 5 tonalités reviennent sans cesse dans les chansons jouées à la guitare." },
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
