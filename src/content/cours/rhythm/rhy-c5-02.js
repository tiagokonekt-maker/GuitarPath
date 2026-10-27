// Leçon du module « rhythm » + les questions de quiz qui s'y rattachent.
// Format « leçon en cartes » décrit dans src/content/README.md.

const SKANK = {
  type: "strum_pattern",
  caption: "Reggae skank — uniquement sur les contretemps (les 'et')",
  data: { pattern: ["-","H","-","H","-","H","-","H"], beats: 4, style: "reggae", bpm: 80 },
};

export default {
  id: "rhy-c5-02", level: 8,
  title: "Reggae et ska : jouer sur les contretemps",
  duration: 9,
  gropiTip: "Tape du pied sur 1-2-3-4 et dis « pied-tchk » à chaque temps : ton accord ne sonne que sur le « tchk », jamais en même temps que ton pied. Si les deux se rejoignent, ralentis.",
  cartes: [
    { type: "idee", titre: "Le skank", texte: [
      "Compte « 1 et 2 et 3 et 4 et ». La guitare reggae se tait sur les chiffres et joue un accord bref sur chaque « et » : c'est le skank.",
      "Elle joue en négatif, là où les autres ne jouent pas.",
    ], bloc: SKANK },
    { type: "idee", titre: "Chacun sa fenêtre", texte: [
      "La basse, très présente, et la grosse caisse occupent les temps. La guitare et le clavier laissent ces places vides.",
      "Personne ne double son voisin : c'est cet espace qui donne au reggae son balancement.",
    ] },
    { type: "question", quizId: "q-rhy-08" },
    { type: "idee", titre: "Court et net", texte: [
      "Un skank qui traîne ne sonne pas reggae. Joue l'accord, puis relâche aussitôt la pression de la main gauche : les cordes restent posées sous les doigts mais ne sonnent plus.",
      "La netteté vient de ce relâchement, pas de la main droite.",
    ] },
    { type: "a-toi", titre: "Skank au clic",
      consigne: "Sur Am, joue le skank du schéma : un coup vers le haut, bref, sur chaque « et ». Le clic tombe sur les chiffres : ta guitare ne doit jamais sonner avec lui. Quand c'est stable, alterne Am et Dm, deux mesures chacun.",
      bloc: SKANK, bpm: 70, minuteur: 120 },
    { type: "question", quizId: "q-rhy-p89-c502-01" },
    { type: "idee", titre: "Le ska", texte: [
      "Né en Jamaïque avant le reggae, le ska place lui aussi l'accord sur les contretemps.",
      "Mais le tempo est bien plus rapide, autour de 120 à 160 BPM, contre 70 à 90 pour le reggae, et les accords sont encore plus courts, presque percussifs.",
    ] },
    { type: "idee", titre: "Une école du contretemps", texte: [
      "Le skank est une syncope extrême : toutes les notes tombent hors des temps.",
      "Quelques séances suffisent pour que le « et » devienne un repère naturel. Les syncopes du funk ou du jazz deviennent alors bien plus faciles.",
    ] },
    { type: "question", quizId: "q-rhy-37" },
    { type: "recap", points: [
      "Skank : un accord bref sur chaque « et », rien sur les temps.",
      "Relâche la main gauche juste après le coup : le son doit être court.",
      "Ska : même placement, tempo bien plus rapide (120-160 BPM).",
    ] },
  ],
  quiz: ["q-rhy-08","q-rhy-37","q-rhy-04","q-rhy-06","q-rhy-p89-c502-01"],
};

export const quiz = [
  {id:"q-rhy-08",courseId:"rhythm",lessonId:"rhy-c5-02",lvl:2,q:"Le pattern reggae 'skank' joue…",o:["Uniquement sur les contretemps","Sur tous les temps","Uniquement sur les temps 2 et 4","Sur le 1 et le 3"],a:0,exp:"Skank reggae = guitare uniquement sur les contretemps (les 'et'). Le 1 et le 3 sont silence côté guitare. La basse marque les temps.",xp:35},
  {id:"q-rhy-37",courseId:"rhythm",lessonId:"rhy-c5-02",lvl:2,q:"Pourquoi la guitare reggae sonne-t-elle « en l'air » ?",o:["Elle joue dans un registre très aigu, au-dessus du chant","Elle utilise un accordage volontairement plus haut","Elle joue sur les contretemps, laissant les temps aux autres","Elle se place systématiquement en retard sur le tempo"],a:2,exp:"La guitare occupe les espaces que les autres laissent vides. Ce partage est la définition même d'un arrangement : chacun sa place dans la mesure, personne ne double le voisin.",xp:30},
  {id:"q-rhy-p89-c502-01",courseId:"rhythm",lessonId:"rhy-c5-02",lvl:2,q:"Ton skank sonne baveux, les accords se touchent. Que corriger en premier ?",o:["Relâcher la main gauche après chaque coup","Gratter plus fort de la main droite","Ajouter les temps 1 et 3 à la guitare","Ralentir le clic de moitié"],a:0,exp:"La longueur de l'accord se règle à la main gauche : on relâche la pression juste après le coup, les doigts restent posés et coupent le son. Ajouter les temps casserait le skank ; ralentir aide, mais ne raccourcit pas le son.",xp:40},
];
