// Leçon du module « rhythm » + les questions de quiz qui s'y rattachent.
// Format « leçon en cartes » décrit dans src/content/README.md.

const AM6 = { type: "chord_diagram", caption: "Am6 — accord compact de pompe, corde 5 étouffée (5 × 4 5 5 ×)", data: { name: "Am6", frets: [5, -1, 4, 5, 5, -1], fingers: [2, 0, 1, 3, 4, 0], startFret: 4 } };
const DM6 = { type: "chord_diagram", caption: "Dm6 — la même idée, fondamentale sur la corde 5 (× 5 × 4 6 5)", data: { name: "Dm6", frets: [-1, 5, -1, 4, 6, 5], fingers: [0, 2, 0, 1, 4, 3], startFret: 4 } };

export default {
  id: "rhy-c5-05", level: 9,
  title: "Gypsy jazz : la pompe Django",
  duration: 9,
  gropiTip: "Tape du pied sur chaque temps et dis « boum, tchac, boum, tchac » en jouant : le boum un peu plus grave et plus long, le tchac court. Si ta voix swingue, ta main suivra.",
  cartes: [
    { type: "idee", titre: "Le swing manouche", texte: [
      "Paris, années 1930 : Django Reinhardt et le Quintette du Hot Club de France inventent un jazz joué aux cordes, sans batterie.",
      "Derrière le soliste, une ou deux guitares tiennent la pompe : c'est elle, le moteur rythmique.",
    ] },
    { type: "idee", titre: "Quatre coups vers le bas", texte: [
      "Un coup par temps, tous vers le bas, jamais vers le haut.",
      "Temps 1 et 3 : un peu plus graves et plus longs. Temps 2 et 4 : accentués et très courts, coupés aussitôt.",
    ], bloc: { type: "rhythm_grid", caption: "La pompe : quatre coups bas, les temps 2 et 4 accentués et courts", data: { beats: 4, subdivision: 4, accents: [1, 3], label: "1 · 2 · 3 · 4" } } },
    { type: "question", quizId: "q-rhy-09" },
    { type: "idee", titre: "Le coup court", texte: [
      "Pour couper l'accord sur 2 et 4, la main gauche relâche sa pression juste après le coup, sans quitter les cordes.",
      "D'où des accords compacts, sans corde à vide : rien ne doit continuer à sonner.",
    ], bloc: AM6 },
    { type: "question", quizId: "q-rhy-pompe-lot4" },
    { type: "a-toi", titre: "Pompe sur Am6 et Dm6",
      consigne: "Deux mesures d'Am6, deux de Dm6, en boucle au clic. Quatre coups bas par mesure, 2 et 4 courts et accentués. Cinq minutes au plus : la pompe fatigue l'avant-bras, garde-le relâché.",
      bloc: DM6, bpm: 100, minuteur: 180 },
    { type: "idee", titre: "Monter le tempo", texte: [
      "Les morceaux rapides du répertoire dépassent souvent 200 BPM. On y arrive par paliers : +5 BPM quand la pompe est propre deux fois de suite.",
      "Un son net à 120 vaut mieux qu'une bouillie à 180.",
    ] },
    { type: "question", quizId: "q-rhy-chunk-lot4" },
    { type: "recap", points: [
      "Quatre coups bas par mesure, jamais de coup vers le haut.",
      "1 et 3 plus longs, 2 et 4 courts et accentués : la main gauche relâche aussitôt.",
      "Accords compacts sans corde à vide ; le tempo monte par paliers de 5 BPM.",
    ] },
  ],
  quiz: ["q-rhy-09","q-rhy-pompe-lot4","q-rhy-chunk-lot4"],
};

export const quiz = [
  {id:"q-rhy-09",courseId:"rhythm",lessonId:"rhy-c5-05",lvl:3,q:"La 'pompe' gypsy jazz utilise…",o:["Un aller-retour bas-haut continu", "Des coups bas, secs puis étouffés", "Des triolets joués en continu", "Des doubles-croches alternées bas-haut"],a:1,exp:"Pompe gypsy = down strokes sur chaque temps, alternant 'sec' (note tenue) et 'étouffé' (chuck). Style Django Reinhardt. Effet percussif.",xp:50},
  {id:"q-rhy-pompe-lot4",courseId:"rhythm",lessonId:"rhy-c5-05",lvl:3,q:"Dans la pompe manouche, quels temps sont joués courts et accentués ?",o:["Les temps 2 et 4","Les temps 1 et 3","Le temps 1 seulement","Les quatre temps, à égalité"],a:0,exp:"Les temps 1 et 3, un peu plus graves, sonnent plus longtemps ; les temps 2 et 4 sont accentués et coupés aussitôt. C'est ce contraste qui fait swinguer la pompe, comme la caisse claire d'une batterie sur 2 et 4.",xp:40},
  {id:"q-rhy-chunk-lot4",courseId:"rhythm",lessonId:"rhy-c5-05",lvl:3,q:"Ta pompe sonne brouillonne : les accords des temps 2 et 4 traînent. Que corriger ?",o:["Relâcher la main gauche juste après le coup","Gratter plus fort sur les temps 2 et 4","Ajouter un coup vers le haut entre les temps","Choisir des accords avec des cordes à vide"],a:0,exp:"Le coup court vient de la main gauche : elle relâche sa pression sans quitter les cordes, et l'accord s'arrête net. Gratter plus fort ou ajouter des cordes à vide fait encore plus traîner le son.",xp:40},
];
