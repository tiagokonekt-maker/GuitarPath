// Leçon du module « rhythm » + les questions de quiz qui s'y rattachent.
// Format décrit dans src/content/README.md.

export default {
  id: "rhy-c2-01", level: 3,
  title: "Rondes, blanches, noires : les valeurs de base",
  duration: 9,
  gropiTip: "Retiens la blanche pointée : 2 temps + la moitié (1 temps) = 3 temps, soit une mesure entière de 3/4. Tiens-en une en comptant « 1-2-3 » à voix haute pour la sentir.",
  content: [
    { type: "p", text: "Avant de pouvoir lire un rythme ou en composer un, il faut connaître les 'valeurs rythmiques' : les unités qui servent à mesurer la durée des sons. Comme un cuisiner a besoin de mesures (grammes, litres, cuillères), un musicien a besoin de valeurs rythmiques pour organiser le temps." },
    { type: "h", text: "La noire : l'unité de référence" },
    { type: "p", text: "En 4/4, la noire = 1 temps. C'est l'unité de base. À 60 BPM, une noire dure 1 seconde. À 120 BPM, elle dure 0.5 seconde. Quand le métronome clique, chaque clic = 1 noire. Sur la guitare, jouer une note noire = la jouer et la tenir pendant exactement 1 temps avant la suivante." },
    { type: "h", text: "La blanche : 2 temps" },
    { type: "p", text: "La blanche vaut 2 noires = 2 temps. Quand tu joues une note blanche, tu la tiens pendant 2 temps avant de jouer la suivante. Dans une mesure de 4/4, tu peux jouer 2 blanches maximum (2 × 2 temps = 4 temps). Tiens la note bien pendant les 2 temps — relâche-la proprement au moment de jouer la suivante." },
    { type: "h", text: "La ronde : 4 temps" },
    { type: "p", text: "La ronde vaut 4 noires = 4 temps = 1 mesure entière. Une seule note par mesure. À 60 BPM, une ronde dure 4 secondes. Très utilisée dans les solos expressifs où on veut tenir une note longtemps avec du vibrato ou du bend. Jouer des rondes développe la conscience des mesures et du temps." },
    { type: "h", text: "Le lien entre les valeurs" },
    { type: "p", text: "Chaque valeur est exactement la moitié de la suivante : Ronde = 2 blanches = 4 noires = 8 croches = 16 doubles-croches. C'est un système de subdivision binaire : tu peux toujours diviser une valeur en 2. Cette logique est facile à visualiser comme une 'arbre' de subdivisions." },
    {
      type: "rhythm_grid",
      caption: "Noire — 1 attaque par temps",
      data: {
        beats: 4, subdivision: 4,
        highlights: [0, 1, 2, 3],
        label: "4 attaques sur 4 temps",
      },
    },
    {
      type: "rhythm_grid",
      caption: "Blanche — 1 attaque toutes les 2 cases, la case grise reste tenue",
      data: {
        beats: 4, subdivision: 4,
        highlights: [0, 2],
        muted: [1, 3],
        label: "2 attaques, chacune tenue 2 temps",
      },
    },
    {
      type: "rhythm_grid",
      caption: "Ronde — 1 seule attaque, tenue toute la mesure",
      data: {
        beats: 4, subdivision: 4,
        highlights: [0],
        muted: [1, 2, 3],
        label: "1 attaque, tenue 4 temps",
      },
    },
    { type: "h", text: "Les points d'augmentation" },
    { type: "p", text: "Un point après une note augmente sa durée de moitié. Noire pointée = noire + croche = 1.5 temps. Blanche pointée = blanche + noire = 3 temps. Le rythme 'pointé' (noire pointée + croche) est la base du swing et du shuffle : longue-courte, longue-courte." },
    { type: "h", text: "Sur la guitare : entendre les valeurs" },
    { type: "p", text: "Exercice révélateur : joue La (c5 à vide) à 60 BPM. D'abord en rondes (1 La toutes les 4 temps). Puis en blanches (1 La tous les 2 temps). Puis en noires (1 La par temps). La densité de notes triple à chaque étape, mais la pulsation reste identique. Tu viens de 'subdiviser' le temps." },
    { type: "ref", text: "'With or Without You' (U2) : la ligne de basse et la guitare d'Adam Clayton/The Edge jouent principalement des rondes et blanches pendant les couplets. Cette lenteur délibérée crée l'espace émotionnel de la chanson. Les notes longues ont autant de puissance expressive que les notes rapides." },
    { type: "tip", text: "Drill des valeurs : à 60 BPM, joue 4 mesures en rondes, 4 en blanches, 4 en noires sur un accord de Am. Puis redescends (noires → blanches → rondes). Entends comment la densité change sans que le tempo ne bouge. C'est le premier exercice de subdivisions." },
  ],
  quiz: ["q-base-19", "q-rhy-25", "q-rhy-26"],
};

export const quiz = [
  {id:"q-base-19",courseId:"rhythm",lessonId:"rhy-c2-01",lvl:2,q:"En 4/4, combien de temps dure une ronde ?",o:["2","1","4","8"],a:2,exp:"La ronde vaut 4 temps, la blanche 2, la noire 1. Chaque valeur vaut la moitié de la précédente.",xp:35},
  {id:"q-rhy-25",courseId:"rhythm",lessonId:"rhy-c2-01",lvl:1,q:"Une mesure de 4/4 contient une blanche et une noire. Que manque-t-il pour la compléter ?",o:["Encore une noire","Encore une blanche","Une ronde entière","Rien, elle est pleine"],a:0,exp:"Blanche (2 temps) + noire (1 temps) = 3 temps. Il en manque un : une noire.",xp:25},
  {id:"q-rhy-26",courseId:"rhythm",lessonId:"rhy-c2-01",lvl:2,q:"En 3/4, une blanche pointée occupe…",o:["La moitié de la mesure","Deux mesures complètes","Un temps et demi seulement","La mesure entière"],a:3,exp:"La blanche vaut 2 temps, le point en ajoute 1 : 3 temps, soit toute la mesure en 3/4. C'est l'accord tenu typique de la valse.",xp:30},
];
