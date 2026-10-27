// Leçon du module « harmony » + les questions de quiz qui s'y rattachent.
// Format « leçon en cartes » décrit dans src/content/README.md.

const MOTIF = { type: "tab", caption: "Un motif de 4 notes (Do-Ré-Mi-Sol), puis sa séquence un degré plus haut (Ré-Mi-Fa-La)", text: "Tab : Do (corde 3 case 5), Ré (corde 3 case 7), Mi (corde 2 case 5), Sol (corde 2 case 8) ; puis Ré (corde 3 case 7), Mi (corde 3 case 9), Fa (corde 2 case 6), La (corde 2 case 10).", data: { lines: ["e|---------------------|","B|-----5-8-------6-10--|","G|-5-7-------7-9-------|","D|---------------------|","A|---------------------|","E|---------------------|"] } };

export default {
  id: "harm-c8-02", level: 9,
  title: "Construire un solo qui suit les accords",
  duration: 10,
  gropiTip: "Enregistre-toi 2 minutes sur une boucle ii-V-I, puis réécoute en notant deux choses : où sont tes silences, et as-tu répété un motif ? Corrige l'un des deux à la prise suivante.",
  cartes: [
    { type: "idee", titre: "Suivre la grille", texte: [
      "Rester dans la gamme de la tonalité, c'est correct, mais générique : le solo flotte au-dessus des accords.",
      "Un solo qui suit la grille fait entendre chaque changement d'accord dans la mélodie elle-même. Puis il raconte quelque chose : des motifs, une forme.",
    ] },
    { type: "question", quizId: "q-harm-50" },
    { type: "idee", titre: "Le squelette : les arpèges", texte: [
      "Sur chaque accord, ses propres notes : Ré Fa La Do sur Dm7, Sol Si Ré Fa sur G7, Do Mi Sol Si sur Cmaj7.",
      "Les arpèges sont la charpente. On l'habille ensuite de notes de gamme et de chromatismes.",
    ], bloc: { type: "degree_chart", caption: "Le squelette du ii-V-I en Do : les arpèges de Dm7, G7 et Cmaj7", data: {boxes: [{top: "Dm7", label: "Ré – Fa – La – Do", sub: "ii", tint: "neutral"}, {top: "G7", label: "Sol – Si – Ré – Fa", sub: "V", tint: "coral"}, {top: "Cmaj7", label: "Do – Mi – Sol – Si", sub: "I", tint: "green"}]} } },
    { type: "idee", titre: "Gamme et cibles", texte: [
      "Plus fluide : joue la gamme de Do majeur, mais pose une note de l'accord en cours sur les temps forts.",
      "La gamme donne la couleur de fond, les cibles donnent les repères. Les autres notes passent sans s'attarder.",
    ] },
    { type: "question", quizId: "q-harm-11" },
    { type: "idee", titre: "Le motif", texte: [
      "Une courte phrase de 3 à 6 notes, répétée puis transformée : décalée d'un degré (séquence), avec un autre rythme, ou en miroir.",
      "Quatre notes suffisent pour bâtir un solo entier, et l'auditeur suit ton idée.",
    ], bloc: MOTIF },
    { type: "a-toi", titre: "Un motif sur le ii-V-I",
      consigne: "Boucle Dm7, G7, Cmaj7, Cmaj7 au clic, une mesure chacun. Tour 1 : joue le motif, puis sa séquence. Tour 2 : invente ton propre motif et transforme-le. Tour 3 : commence tes phrases sur le « et » du 4 de la mesure d'avant, et laisse une mesure de silence entre deux phrases.",
      bloc: MOTIF, bpm: 70, minuteur: 240 },
    { type: "idee", titre: "La forme du solo", texte: [
      "Un solo a un début, un milieu et une fin : intro calme, développement, climax, résolution vers la tonique.",
      "Les silences en font partie. Après une phrase tendue, un temps de pause met en valeur ce qui suit.",
    ] },
    { type: "question", quizId: "q-impro-29" },
    { type: "recap", points: [
      "Arpèges et cibles sur les temps forts : la grille s'entend dans ton solo.",
      "Un motif répété et transformé donne une identité au solo.",
      "Une forme qui monte puis se résout, des silences, des départs variés.",
    ] },
  ],
  quiz: ["q-harm-50", "q-harm-51", "q-harm-52", "q-harm-11", "q-impro-29"],
};

export const quiz = [
  {id:"q-harm-50",courseId:"harmony",lessonId:"harm-c8-02",lvl:2,q:"Sur Dm7 - G7 - Cmaj7, tu restes en Do majeur mais ton solo sonne générique. Quel changement le fait « suivre » la grille ?",o:["Viser 3e et 7e aux changements","Jouer deux fois plus de notes","Monter d'une octave à chaque accord","Finir chaque phrase sur Do"],a:0,exp:"La gamme seule « flotte » sur la grille. En atterrissant sur les guide tones de chaque accord au moment où il arrive (Fa ou Do sur Dm7, Si ou Fa sur G7, Mi ou Si sur Cmaj7), l'oreille entend les changements. Finir toujours sur Do ignore justement les accords.",xp:30},
  {id:"q-harm-51",courseId:"harmony",lessonId:"harm-c8-02",lvl:1,q:"Quelles sont les 4 parties de l'arc narratif d'un solo ?",o:["Couplet, refrain, pont, puis refrain final","Intro, développement, climax, résolution","Lent, puis rapide, puis lent, puis rapide","Grave, aigu, grave, aigu"],a:1,exp:"Une intro calme, un développement qui monte, un climax, puis une résolution vers la tonique.",xp:30},
  {id:"q-harm-52",courseId:"harmony",lessonId:"harm-c8-02",lvl:2,q:"Une phrase qui commence sur le « et » du 4 de la mesure d'avant sonne…",o:["Plus carrée et plus rigide qu'avant","Toujours fausse rythmiquement","Plus fluide, plus syncopée","Plus lente que le tempo"],a:2,exp:"Commencer avant le temps 1 donne une phrase plus fluide et syncopée ; commencer toujours sur le 1 sonne carré.",xp:40},
];
