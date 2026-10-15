// Leçon du module « neck » + les questions de quiz qui s'y rattachent.
// Format décrit dans src/content/README.md.

export default {
  id: "neck-03", level: 4,
  title: "Intervalles : entendre les distances",
  duration: 14,
  gropiTip: "Entends la tierce changer de couleur : joue Mi mineur (022000), puis pose l'index corde 3 case 1 pour obtenir Mi majeur. Sol devient Sol# : de m3 à M3, de mélancolique à joyeux.",
  content: [
    { type: "p", text: "Un intervalle = la distance entre deux notes. C'est la brique fondamentale de la musique. Tout — accords, gammes, modes, mélodies — est une combinaison d'intervalles." },
    { type: "h", text: "Les 12 intervalles dans l'octave" },
    { type: "p", text: "1dt = seconde mineure (m2). 2dt = seconde majeure (M2 / ton). 3dt = tierce mineure (m3). 4dt = tierce majeure (M3). 5dt = quarte juste (P4). 6dt = triton (TT, ♭5/#4). 7dt = quinte juste (P5). 8dt = sixte mineure (m6). 9dt = sixte majeure (M6). 10dt = septième mineure (m7). 11dt = septième majeure (M7). 12dt = octave (P8)." },
    {
      type: "interval_chart",
      caption: "Les 12 intervalles — caractère sonore et couleur",
      data: {
        highlight: ["m3", "M3", "P5", "P4", "TT", "m7"],
        showOnGuitar: true,
      },
    },
    { type: "h", text: "Caractère sonore de chaque intervalle" },
    { type: "p", text: "Les intervalles ont des couleurs psychoacoustiques. m2/M7 = dissonance maximale. m3/m6 = mélancolie. M3/M6 = joie. P4/P5 = stabilité, vide, force. TT = tension extrême ('diabolus in musica'). m7 = tension douce, dominante. M7 = couleur jazz, lumineuse." },
    { type: "h", text: "Voir les intervalles sur 1 corde" },
    { type: "p", text: "Sur une seule corde, l'intervalle = nombre de cases d'écart. Tierce majeure = 4 cases. Quinte = 7 cases. Octave = 12 cases. C'est arithmétique — pas de mystère." },
    {
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
    },
    { type: "h", text: "Voir les intervalles entre 2 cordes" },
    { type: "p", text: "Une note sur la corde adjacente plus aiguë, même case = quarte juste au-dessus (sauf c3→c2 où c'est tierce majeure). Une corde plus aiguë, 2 cases en arrière = quinte juste au-dessus. Mémorise ces 2 patterns, tu vois les intervalles partout." },
    { type: "h", text: "Inversion d'intervalle" },
    { type: "p", text: "Tout intervalle a son 'inverse' qui complète à l'octave. P4 + P5 = octave. m3 + M6 = octave. M2 + m7 = octave. Cette symétrie est utile pour les accords (ex: l'inversion d'une triade fait apparaître les intervalles inversés)." },
    { type: "tip", text: "Drill quotidien : choisis 2 cases au hasard sur le manche. Calcule l'intervalle entre elles en demi-tons puis nomme-le. Au bout de 2 semaines c'est instantané." },
    { type: "fretboard_interactive", mode: "scale", root: "A", scale: "major", caption: "Intervalles de La majeur sur le manche", displayMode: "intervals", lang: "fr", compact: true },
  ],
  quiz: ["q-neck-07", "q-neck-08", "q-neck-09", "q-neck-10"],
};

export const quiz = [
  {id:"q-neck-07",courseId:"neck",lessonId:"neck-03",lvl:1,q:"Combien de demi-tons fait une tierce mineure ?",o:["2","3","4","5"],a:1,exp:"Tierce mineure = 3 demi-tons. C'est cette tierce qui donne le caractère 'mineur' (sombre) à un accord ou une gamme.",xp:25},
  {id:"q-neck-08",courseId:"neck",lessonId:"neck-03",lvl:2,q:"L'intervalle Mi → Si♭ est…",o:["Quinte juste","Septième mineure","Quarte augmentée","Sixte majeure"],a:2,exp:"Mi→Si = quinte juste (7dt). Mi→Si♭ = quinte diminuée = quarte augmentée = triton (6dt). L'intervalle 'diabolus in musica' qui divise l'octave en deux.",xp:45},
  {id:"q-neck-09",courseId:"neck",lessonId:"neck-03",lvl:3,q:"Quel est l'intervalle inverse d'une tierce majeure ?",o:["Tierce mineure","Sixte majeure","Quarte juste","Sixte mineure"],a:3,exp:"Inversion d'intervalle : la somme avec son inverse = octave (12dt). Tierce maj = 4dt. Inverse = 12-4 = 8dt = sixte mineure. Règle : maj→min, juste→juste.",xp:50},
  {id:"q-neck-10",courseId:"neck",lessonId:"neck-03",lvl:3,q:"Tu joues Do (corde 5 case 3) et Mi (corde 4 case 2). Quel intervalle sépare ces 2 notes ?",o:["Tierce majeure","Tierce mineure","Quarte juste","Sixte majeure"],a:0,exp:"Do→Mi = 4 demi-tons = tierce majeure. C'est la tierce de l'accord de Do majeur. Vérification facile sur le manche : 4 demi-tons = 4 cases d'écart sur la même corde.",xp:45},
];
