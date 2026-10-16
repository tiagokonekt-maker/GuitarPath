// Leçon du module « rhythm » + les questions de quiz qui s'y rattachent.
// Format « leçon en cartes » décrit dans src/content/README.md.

const RIFF_SHUFFLE = {
  type: "tab",
  caption: "Riff shuffle en La : corde 5 à vide + corde 4 case 2, puis case 4 — joué long-court",
  text: "Tab — corde 5 à vide jouée avec la corde 4, case 2 deux fois, puis case 4 deux fois ; deux fois de suite. Chaque paire de coups se joue long-court.",
  data: { lines: [
    "e|-------------------------|",
    "B|-------------------------|",
    "G|-------------------------|",
    "D|-2--2--4--4--2--2--4--4--|",
    "A|-0--0--0--0--0--0--0--0--|",
    "E|-------------------------|",
  ] },
};

export default {
  id: "rhy-c5-01", level: 6,
  title: "Blues shuffle : le feel ternaire appliqué",
  duration: 8,
  gropiTip: "Erreur fréquente : un shuffle trop sautillant. La note courte tombe sur la 3e note du triolet, pas sur la dernière double-croche du temps : compte « 1-trip-let » et joue sur « 1 » et « let ».",
  cartes: [
    { type: "idee", titre: "Long-court", texte: [
      "Rappel : le shuffle découpe chaque temps en triolet et ne joue que la 1re et la 3e note. On obtient une paire longue-courte : « DAH-dah, DAH-dah ».",
      "Sur la partition, souvent de simples croches, avec « shuffle » en tête.",
    ], bloc: {
      type: "rhythm_grid",
      caption: "Blues shuffle — feel longue-courte par temps (triolets : 1er + 3e seulement)",
      data: {
        beats: 4, subdivision: 12,
        highlights: [0, 2, 3, 5, 6, 8, 9, 11],
        muted: [1, 4, 7, 10],
        label: "DAH (1 + trip) · dah (let) — la note du milieu du triolet ne sonne pas",
      },
    } },
    { type: "question", quizId: "q-rhy-07" },
    { type: "idee", titre: "Le riff shuffle", texte: [
      "Le riff le plus joué du blues : la corde 5 à vide sonne en continu, et la corde 4 alterne Mi (corde 4 case 2) et Fa# (corde 4 case 4).",
      "Quinte, puis sixte, au-dessus de La : deux doigts suffisent.",
    ], bloc: RIFF_SHUFFLE },
    { type: "a-toi", titre: "Le riff au clic",
      consigne: "Joue le riff en coups vers le bas, chaque paire en long-court : « DAH-dah ». Lance le clic à 70 BPM, un temps par paire. Garde le poignet souple et laisse un léger palm mute. Deux minutes sans t'arrêter.",
      bloc: RIFF_SHUFFLE, bpm: 70, minuteur: 120 },
    { type: "idee", titre: "La grille de 12 mesures", texte: [
      "4 mesures de I (A7), 2 de IV (D7), 2 de I, puis V (E7), IV, et 2 mesures de I.",
      "Le même riff se transpose : sur Ré, pars de la corde 4 à vide ; sur Mi, de la corde 6 à vide.",
    ] },
    { type: "idee", titre: "Quick change", texte: [
      "Variante très courante : on passe au IV dès la mesure 2, puis on revient au I.",
      "A7, D7, A7, A7, D7, D7, A7, A7, E7, D7, A7, E7. La dernière mesure sur E7 relance la grille.",
    ] },
    { type: "question", quizId: "q-rhy-45" },
    { type: "idee", titre: "Le shuffle aux doigts", texte: [
      "Sur une acoustique, le pouce peut tenir le shuffle sur les cordes graves pendant que les doigts jouent la mélodie sur les aiguës.",
      "Basse, rythme et mélodie à la fois : un seul guitariste fait tout l'orchestre.",
    ] },
    { type: "question", quizId: "q-rhy-44" },
    { type: "recap", points: [
      "Shuffle = 1re et 3e note du triolet : long-court sur chaque temps.",
      "Le riff : corde à vide + quinte, puis sixte, sur I, IV et V.",
      "Blues 12 mesures : I ×4, IV ×2, I ×2, V, IV, I ×2 ; quick change : IV dès la mesure 2.",
    ] },
  ],
  quiz: ["q-rhy-07","q-rhy-44","q-rhy-45"],
};

export const quiz = [
  {id:"q-rhy-07",courseId:"rhythm",lessonId:"rhy-c5-01",lvl:3,q:"Le 'shuffle' blues subdivise le temps en…",o:["2 croches égales, jouées droites", "4 doubles-croches, toutes jouées", "3 notes égales, toutes les trois jouées", "Un triolet : on joue la 1re et la 3e"],a:3,exp:"Shuffle = chaque temps en triolet, on joue uniquement la 1ère et la 3e note. 'Long-court'. Feel ternaire du blues classique.",xp:50},
  {id:"q-rhy-44",courseId:"rhythm",lessonId:"rhy-c5-01",lvl:2,q:"En shuffle, quelle part du temps dure la première note de chaque paire ?",o:["Les deux tiers","La moitié","Le tiers","Les trois quarts"],a:0,exp:"Le temps est découpé en triolet : la première note couvre les deux premières parts (2/3), la seconde la dernière (1/3). D'où le balancement long-court. Avec la moitié, on retombe sur des croches droites.",xp:30},
  {id:"q-rhy-45",courseId:"rhythm",lessonId:"rhy-c5-01",lvl:2,q:"Dans un blues 12 mesures en « quick change », que se passe-t-il à la mesure 2 ?",o:["On reste sur l'accord I", "On joue déjà l'accord V, la dominante", "On passe au IV, puis on revient", "On s'arrête une mesure"],a:2,exp:"Quick change : IV dès la mesure 2 (A7-D7-A7-A7…), au lieu de 4 mesures de I en slow change.",xp:40},
];
