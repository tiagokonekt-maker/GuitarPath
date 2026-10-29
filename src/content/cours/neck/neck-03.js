// Leçon du module « neck » + les questions de quiz qui s'y rattachent.
// Format « leçon en cartes » décrit dans src/content/README.md.

const DEPUIS_DO = {
  type: "fretboard",
  caption: "Intervalles depuis Do (c6 case 8) — lecture sur 2 cordes",
  data: {
    frets: 7, startFret: 7,
    showStringNames: true, showFretNumbers: true,
    markerFrets: [9, 12],
    notes: [
      { string: 6, fret: 8,  label: "R",   color: "amber",   root: true },
      { string: 6, fret: 9,  label: "m2",  color: "coral" },
      { string: 6, fret: 10, label: "M2",  color: "neutral" },
      { string: 6, fret: 11, label: "m3",  color: "primary" },
      { string: 6, fret: 12, label: "M3",  color: "green" },
      { string: 6, fret: 13, label: "P4",  color: "neutral" },
      { string: 5, fret: 8,  label: "P4",  color: "neutral" },
      { string: 5, fret: 9,  label: "TT",  color: "coral" },
      { string: 5, fret: 10, label: "P5",  color: "amber" },
      { string: 5, fret: 11, label: "m6",  color: "primary" },
      { string: 5, fret: 12, label: "M6",  color: "green" },
      { string: 5, fret: 13, label: "m7",  color: "amber" },
    ],
  },
};

export default {
  id: "neck-03", level: 4,
  title: "Intervalles : entendre les distances",
  duration: 9,
  gropiTip: "Entends la tierce changer de couleur : joue Mi mineur (022000), puis pose l'index corde 3 case 1 pour obtenir Mi majeur. Sol devient Sol# : de m3 à M3, de mélancolique à joyeux.",
  cartes: [
    { type: "idee", titre: "Douze distances", texte: [
      "Un intervalle est la distance entre deux notes ; accords, gammes et mélodies en sont faits. Il y en a douze dans l'octave.",
      "Tu les as comptés : maintenant, on les entend et on les voit sur le manche.",
    ], bloc: {
      type: "interval_chart",
      caption: "Les 12 intervalles — caractère sonore et couleur",
      data: {
        highlight: ["m3", "M3", "P5", "P4", "TT", "m7"],
        showOnGuitar: true,
      },
    } },
    { type: "idee", titre: "Chaque intervalle a sa couleur", texte: [
      "Tierce et sixte mineures : mélancolie. Majeures : joie. Quarte et quinte justes : stabilité.",
      "Triton : tension extrême. Septième mineure : tension douce ; majeure : couleur jazz.",
    ], bloc: { type: "fretboard_interactive", mode: "scale", root: "A", scale: "major", caption: "Intervalles de La majeur sur le manche", displayMode: "intervals", lang: "fr", compact: true } },
    { type: "question", quizId: "q-neck-07" },
    { type: "idee", titre: "Sur une corde, puis sur deux", texte: [
      "Depuis Do (corde 6, case 8), compte les cases : tierce mineure en 11, majeure en 12.",
      "Sur la corde 5, même case : la quarte ; deux cases plus loin : la quinte.",
    ], bloc: DEPUIS_DO },
    { type: "idee", titre: "Deux raccourcis entre cordes", texte: [
      "Corde voisine plus aiguë, même case : quarte juste. Deux cases plus loin : quinte juste.",
      "Exception, des cordes 3 à 2 : même case = tierce majeure, et la quinte est trois cases plus loin.",
    ] },
    { type: "question", quizId: "q-neck-10-app" },
    { type: "idee", titre: "Le renversement", texte: [
      "Un intervalle et son renversement font 12 demi-tons : quarte + quinte, tierce mineure + sixte majeure.",
      "Le majeur devient mineur, le juste reste juste.",
    ] },
    { type: "question", quizId: "q-neck-09" },
    { type: "a-toi", titre: "Quarte, quinte, octave depuis Do",
      consigne: "Pose Do (corde 6, case 8). Joue la quarte (corde 5, même case), la quinte (deux cases plus loin), puis l'octave (corde 4, case 10). Annonce chaque intervalle avant de le jouer, puis chante-le.",
      bloc: DEPUIS_DO, minuteur: 90 },
    { type: "recap", points: [
      "Douze intervalles dans l'octave, chacun avec sa couleur.",
      "Corde voisine, même case : quarte ; deux cases plus loin : quinte (sauf cordes 3-2).",
      "Un intervalle et son renversement font 12 demi-tons.",
    ] },
  ],
  quiz: ["q-neck-07", "q-neck-08", "q-neck-09", "q-neck-10", "q-neck-10-app"],
};

export const quiz = [
  {id:"q-neck-07",courseId:"neck",lessonId:"neck-03",lvl:1,q:"Combien de demi-tons fait une tierce mineure ?",o:["2","3","4","5"],a:1,exp:"Tierce mineure = 3 demi-tons. C'est cette tierce qui donne le caractère 'mineur' (sombre) à un accord ou une gamme.",xp:25},
  {id:"q-neck-08",courseId:"neck",lessonId:"neck-03",lvl:2,q:"L'intervalle Mi → Si♭ s'écrit…",o:["Quinte juste","Quinte diminuée","Quarte juste","Sixte mineure"],a:1,exp:"Mi → Si = quinte juste (7 demi-tons). Si♭ est un demi-ton plus bas : quinte diminuée (6 demi-tons), le triton. On parle de quinte parce que Mi → Si s'étend sur cinq lettres (Mi Fa Sol La Si). La quarte augmentée sonne pareil mais s'écrit sur quatre lettres : Mi → La#.",xp:45},
  {id:"q-neck-09",courseId:"neck",lessonId:"neck-03",lvl:3,q:"Quel est l'intervalle inverse d'une tierce majeure ?",o:["Tierce mineure","Sixte majeure","Quarte juste","Sixte mineure"],a:3,exp:"Inversion d'intervalle : la somme avec son inverse = octave (12dt). Tierce maj = 4dt. Inverse = 12-4 = 8dt = sixte mineure. Règle : maj→min, juste→juste.",xp:50},
  {id:"q-neck-10",courseId:"neck",lessonId:"neck-03",lvl:3,q:"Tu joues Do (corde 5 case 3) et Mi (corde 4 case 2). Quel intervalle sépare ces 2 notes ?",o:["Tierce majeure","Tierce mineure","Quarte juste","Sixte majeure"],a:0,exp:"Do→Mi = 4 demi-tons = tierce majeure. C'est la tierce de l'accord de Do majeur. Vérification facile sur le manche : 4 demi-tons = 4 cases d'écart sur la même corde.",xp:45},
  {id:"q-neck-10-app",courseId:"neck",lessonId:"neck-03",lvl:3,q:"Tu joues Sol (corde 6 case 3) puis Si♭ (corde 5 case 1). Quel intervalle sépare ces 2 notes ?",o:["Tierce mineure","Tierce majeure","Quarte juste","Seconde majeure"],a:0,exp:"Corde voisine, même case : quarte juste, 5 demi-tons. Deux cases en arrière, il en reste 3 : une tierce mineure. Sol → Si♭, c'est la tierce de Sol mineur.",xp:35},
];
