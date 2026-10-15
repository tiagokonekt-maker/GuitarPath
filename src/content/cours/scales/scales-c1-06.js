// Leçon du module « scales » + les questions de quiz qui s'y rattachent.
// Format décrit dans src/content/README.md.

export default {
  id: "scales-c1-06", level: 4,
  title: "Les intervalles complets : sixtes, septièmes, octave",
  duration: 9,
  content: [
    { type: "p", text: "On termine le tour des intervalles avec les plus grands. Ces intervalles peuvent sembler abstraits au début, mais tu vas voir qu'ils apparaissent partout dès que tu te mets à improviser ou à harmoniser." },
    { type: "h", text: "Sixtes : la couleur vocale" },
    { type: "p", text: "Sixte majeure = 9 demi-tons (Do→La). Sixte mineure = 8 demi-tons (Do→La♭). Les sixtes sonnent 'romantiques', 'chantantes'. Elles sont très utilisées dans les ballades pop, le R&B, la bossa nova. Beaucoup de mélodies vocales qui te touchent contiennent des sixtes." },
    { type: "h", text: "Septièmes : la tension qui résout" },
    { type: "p", text: "Septième majeure = 11 demi-tons (Do→Si). Septième mineure = 10 demi-tons (Do→Si♭). La septième majeure sonne 'sophistiquée', 'jazz'. La septième mineure sonne 'tendue', 'qui veut bouger' — c'est l'âme de la musique blues et jazz. Tous les accords '7' que tu joues (G7, A7, etc.) contiennent une septième mineure." },
    { type: "h", text: "Octave : le retour à la maison" },
    { type: "p", text: "Octave = 12 demi-tons. Même note, plus aigu (ou plus grave). C'est l'intervalle le plus 'consonant' : ton oreille entend les deux notes presque comme étant la même note. Sur la guitare, l'octave de toute note est à +12 cases sur la même corde." },
    { type: "h", text: "Le triton : l'intervalle interdit" },
    { type: "p", text: "Entre la quarte juste (5 demi-tons) et la quinte juste (7 demi-tons), il y a un intervalle de 6 demi-tons. On l'appelle 'triton' (3 tons entiers). Cet intervalle sonne extrêmement dissonant, instable. Au Moyen-Âge, on l'appelait 'diabolus in musica' (le diable en musique) et il était évité. Aujourd'hui, c'est l'intervalle clé du blues, du jazz, et de la musique heavy metal." },
    {
      type: "interval_chart",
      caption: "Les 12 intervalles — triton (TT) et septièmes en surbrillance",
      data: { highlight: ["TT", "m7", "M7", "P8"] },
    },
    { type: "h", text: "Récap visuel sur la guitare" },
    { type: "p", text: "Sur une corde, depuis une note de référence : +1 case = seconde mineure. +2 = seconde majeure. +3 = tierce mineure. +4 = tierce majeure. +5 = quarte juste. +6 = triton. +7 = quinte juste. +8 = sixte mineure. +9 = sixte majeure. +10 = septième mineure. +11 = septième majeure. +12 = octave." },
    { type: "ref", text: "Reconnaître un triton à l'oreille : le célèbre riff d'intro de 'Black Sabbath' (le morceau, 1970) est un triton. La sonnerie 'Maria' de West Side Story commence aussi par un triton (puis se résout sur la quinte). Une fois que tu l'as entendu, tu ne l'oublieras plus." },
    { type: "tip", text: "Drill quotidien (2 min) : sur la corde de La (5e), choisis une case au hasard. Joue cette note puis trouve sa quinte juste (+7 cases) sans regarder. Refais avec sa tierce majeure (+4 cases). Cet exercice cale les intervalles dans tes doigts." },
  ],
  quiz: ["q-scales-25","q-scales-26","q-scales-27"],
};

export const quiz = [
  {id:"q-scales-25",courseId:"scales",lessonId:"scales-c1-06",lvl:2,q:"Combien de demi-tons contient une septième mineure ?",o:["9","10","11","12"],a:1,exp:"Septième mineure = 10 demi-tons (Do→Sib). C'est elle qui donne leur couleur à tous les accords '7' (G7, A7...) : l'âme du blues et du jazz.",xp:35},
  {id:"q-scales-26",courseId:"scales",lessonId:"scales-c1-06",lvl:3,q:"Le triton se situe exactement entre quels deux intervalles ?",o:["Tierce majeure et quarte juste", "Quinte juste et sixte mineure", "Quarte juste et quinte juste", "Sixte majeure et septième"],a:2,exp:"Le triton (6 demi-tons) tombe entre la quarte juste (5) et la quinte juste (7) — surnommé 'diabolus in musica' au Moyen-Âge, aujourd'hui central dans le blues, le jazz et le metal.",xp:45},
  {id:"q-scales-27",courseId:"scales",lessonId:"scales-c1-06",lvl:2,q:"Une octave représente combien de demi-tons ?",o:["10","7","14","12"],a:3,exp:"Octave = 12 demi-tons = 12 cases sur une même corde. Même note, mais deux fois plus aiguë (ou grave).",xp:35},
];
