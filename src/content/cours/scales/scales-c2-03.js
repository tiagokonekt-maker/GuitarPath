// Leçon du module « scales » + les questions de quiz qui s'y rattachent.
// Format décrit dans src/content/README.md.

export default {
  id: "scales-c2-03", level: 5,
  title: "Les degrés et leurs noms",
  duration: 10,
  content: [
    { type: "p", text: "Dans une gamme, chaque note a un numéro et un nom. Ces numéros (les degrés) sont l'outil le plus puissant pour analyser la musique. Avec eux, tu pourras parler de musique sans même mentionner les notes : c'est universel et ça marche dans toutes les tonalités." },
    { type: "h", text: "Les 7 degrés numérotés" },
    { type: "p", text: "Dans une gamme, on numérote les notes de 1 à 7 (en chiffres romains : I, II, III, IV, V, VI, VII). En Do majeur : I=Do, II=Ré, III=Mi, IV=Fa, V=Sol, VI=La, VII=Si. En Sol majeur : I=Sol, II=La, III=Si, IV=Do, V=Ré, VI=Mi, VII=Fa#. Les degrés restent les mêmes — seul le contenu change." },
    { type: "h", text: "Les noms des degrés" },
    { type: "p", text: "Chaque degré a un nom 'fonctionnel'. I = Tonique (la maison, le repos absolu). II = Sus-tonique. III = Médiante. IV = Sous-dominante. V = Dominante (la note de tension qui appelle la résolution). VI = Sus-dominante. VII = Sensible (la note qui 'attire' vers la tonique, à un demi-ton près)." },
    {
      type: "degree_chart",
      caption: "Les 7 degrés de Do majeur — I, IV, V en couleur (les piliers)",
      data: {
        boxes: [
          { top: "I",   label: "Tonique — Do",       tint: "green" },
          { top: "II",  label: "Sus-tonique — Ré",    tint: "neutral" },
          { top: "III", label: "Médiante — Mi",       tint: "neutral" },
          { top: "IV",  label: "Sous-dominante — Fa", tint: "amber" },
          { top: "V",   label: "Dominante — Sol",     tint: "coral" },
          { top: "VI",  label: "Sus-dominante — La",  tint: "neutral" },
          { top: "VII", label: "Sensible — Si",       tint: "neutral" },
        ],
      },
    },
    { type: "h", text: "Les 3 degrés piliers : I, IV, V" },
    { type: "p", text: "Sur les 7 degrés, trois sont absolument fondamentaux : la Tonique (I), la Sous-dominante (IV) et la Dominante (V). Leur trio organise la quasi-totalité de la musique tonale. Une 'cadence' typique = mouvement entre ces 3 piliers. Le 'blues 12 mesures' classique = uniquement I, IV, V. Beaucoup de chansons pop utilisent juste ces 3 accords (la fameuse progression I-IV-V)." },
    { type: "h", text: "Pourquoi le V crée tant de tension" },
    { type: "p", text: "Le degré V contient la note 'Sensible' (le degré VII de la gamme), qui est à un demi-ton de la tonique. Cette proximité fait que ton oreille 'entend' le V comme un déséquilibre qui DEMANDE à se résoudre vers le I. C'est physique, presque animal. La cadence V → I est la résolution la plus puissante de la musique occidentale." },
    { type: "h", text: "Le langage universel des degrés" },
    { type: "p", text: "Quand un musicien dit 'la chanson est en I-V-vi-IV', il décrit une progression d'accords dans n'importe quelle tonalité. En Do majeur ça donne Do-Sol-Lam-Fa. En Sol majeur ça donne Sol-Ré-Mim-Do. Mêmes degrés, mêmes émotions, contenu différent. C'est le langage standard des musiciens en studio (système Nashville)." },
    { type: "ref", text: "Test toi : la chanson 'Let It Be' (Beatles) suit la progression I-V-vi-IV en Do majeur (Do-Sol-Lam-Fa). 'No Woman No Cry' (Bob Marley) suit la même progression en Do majeur. 'With Or Without You' (U2) suit la même en Ré majeur (Ré-La-Sim-Sol). Une fois que tu entends 'I-V-vi-IV', tu l'entendras dans 30% de la pop mondiale." },
    { type: "tip", text: "Apprends à PENSER en degrés plutôt qu'en notes. Au lieu de te dire 'je vais jouer un Sol', dis-toi 'je vais jouer le V de Do majeur'. Cette habitude transforme ton cerveau musical." },
  ],
  quiz: ["q-scales-04"],
};

export const quiz = [
  {id:"q-scales-04",courseId:"scales",lessonId:"scales-c2-03",lvl:3,q:"Quelle est la fonction du 7e degré dans une gamme majeure ?",o:["Sensible","Tonique","Dominante","Sus-dominante"],a:0,exp:"VII = sensible. Note distante d'1 demi-ton de la tonique, qui crée une attraction forte vers I. En Do : Si attire vers Do. Source de la cadence dominante.",xp:40},
];
