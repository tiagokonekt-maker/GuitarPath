// Leçon du module « scales » + les questions de quiz qui s'y rattachent.
// Format « leçon en cartes » décrit dans src/content/README.md.

const EN_DIESES = { type: "note_grid", caption: "Corde 5, de La à La : les 5 notes altérées écrites en dièses", data: {string: 5, stringName: "La", maxFret: 12, highlights: [{fret: 0, label: "La", color: "neutral"}, {fret: 1, label: "La#", color: "coral"}, {fret: 2, label: "Si", color: "neutral"}, {fret: 3, label: "Do", color: "neutral"}, {fret: 4, label: "Do#", color: "coral"}, {fret: 5, label: "Ré", color: "neutral"}, {fret: 6, label: "Ré#", color: "coral"}, {fret: 7, label: "Mi", color: "neutral"}, {fret: 8, label: "Fa", color: "neutral"}, {fret: 9, label: "Fa#", color: "coral"}, {fret: 10, label: "Sol", color: "neutral"}, {fret: 11, label: "Sol#", color: "coral"}, {fret: 12, label: "La", color: "neutral"}]} };

const EN_BEMOLS = { type: "note_grid", caption: "Les mêmes cases écrites en bémols : La# = Sib, Do# = Réb, Ré# = Mib, Fa# = Solb, Sol# = Lab", data: {string: 5, stringName: "La", maxFret: 12, highlights: [{fret: 0, label: "La", color: "neutral"}, {fret: 1, label: "Sib", color: "primary"}, {fret: 2, label: "Si", color: "neutral"}, {fret: 3, label: "Do", color: "neutral"}, {fret: 4, label: "Réb", color: "primary"}, {fret: 5, label: "Ré", color: "neutral"}, {fret: 6, label: "Mib", color: "primary"}, {fret: 7, label: "Mi", color: "neutral"}, {fret: 8, label: "Fa", color: "neutral"}, {fret: 9, label: "Solb", color: "primary"}, {fret: 10, label: "Sol", color: "neutral"}, {fret: 11, label: "Lab", color: "primary"}, {fret: 12, label: "La", color: "neutral"}]} };

export default {
  id: "scales-c1-04", level: 3,
  title: "Les enharmonies : pourquoi Do# = Réb ?",
  duration: 6,
  gropiTip: "Repère les 5 cases altérées de la corde 6 (2, 4, 6, 9, 11) et donne à chacune ses deux noms : Fa#/Sol♭, Sol#/La♭, La#/Si♭, Do#/Ré♭, Ré#/Mi♭.",
  cartes: [
    { type: "idee", titre: "Deux noms, un seul son", texte: [
      "La note entre Do et Ré s'appelle Do# ou Ré♭ : même son, même case.",
      "Deux noms pour un son : on dit qu'ils sont enharmoniques.",
    ] },
    { type: "idee", titre: "En montant : des dièses", texte: [
      "Sur la corde 5, cinq cases sont altérées. Vues depuis la note du dessous, elles prennent un dièse : La#, Do#, Ré#, Fa#, Sol#.",
    ], bloc: EN_DIESES },
    { type: "question", quizId: "q-base-18" },
    { type: "idee", titre: "En descendant : des bémols", texte: [
      "Vues depuis la note du dessus, les mêmes cases prennent un bémol : Si♭, Ré♭, Mi♭, Sol♭, La♭.",
    ], bloc: EN_BEMOLS },
    { type: "question", quizId: "q-scales-52" },
    { type: "idee", titre: "Une lettre par note", texte: [
      "Dans une gamme, chaque lettre sert une fois. Sol majeur : Sol, La, Si, Do, Ré, Mi, Fa#.",
      "Avec Sol♭, il y aurait deux Sol et aucun Fa.",
    ] },
    { type: "idee", titre: "Et les bémols ?", texte: [
      "Mi♭ majeur : Mi♭, Fa, Sol, La♭, Si♭, Do, Ré. La♭ plutôt que Sol#, car il faut un La.",
      "Sur la guitare, même case : la nuance compte pour lire, pas pour jouer.",
    ] },
    { type: "question", quizId: "q-scales-53" },
    { type: "a-toi", titre: "Deux noms par case",
      consigne: "Joue la corde 5 de la case 0 à la case 12. Sur chaque case altérée, dis ses deux noms : « La dièse, Si bémol ». Puis redescends, bémol d'abord.",
      bloc: EN_DIESES, minuteur: 60 },
    { type: "recap", points: [
      "Enharmoniques : deux noms pour un même son, une même case.",
      "Dièse vu d'en dessous, bémol vu d'au-dessus : La# = Si♭.",
      "Dans une gamme, une lettre par note : le contexte choisit le nom.",
    ] },
  ],
  quiz: ["q-base-18","q-scales-52","q-scales-53"],
};

export const quiz = [
  {id:"q-base-18",courseId:"scales",lessonId:"scales-c1-04",lvl:2,q:"Deux notes qui sonnent identiques mais portent deux noms différents sont dites…",o:["Dissonantes","Enharmoniques","Chromatiques","Diatoniques"],a:1,exp:"Do# et Réb sont enharmoniques : même case sur la guitare, même son, deux écritures selon le contexte tonal.",xp:35},
  {id:"q-scales-52",courseId:"scales",lessonId:"scales-c1-04",lvl:1,q:"Quel est l'autre nom de La# ?",o:["Si♭","La♭","Si","Do♭"],a:0,exp:"La# est un demi-ton au-dessus de La, Si♭ un demi-ton sous Si : c'est la même case, deux noms enharmoniques du même son.",xp:30},
  {id:"q-scales-53",courseId:"scales",lessonId:"scales-c1-04",lvl:2,q:"Dans Sol majeur, pourquoi écrit-on Fa# plutôt que Sol♭ ?",o:["Pour garder une note par lettre","Parce que Sol♭ sonne plus grave","Parce que les bémols sont interdits","Parce que Fa# se joue plus facilement"],a:0,exp:"Une gamme utilise chaque lettre une fois : Sol La Si Do Ré Mi Fa#. Écrire Sol♭ donnerait deux « Sol » et aucun « Fa ». Fa# et Sol♭ sonnent pareil : c'est une question d'orthographe.",xp:40},
];
