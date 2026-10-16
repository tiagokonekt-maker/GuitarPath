// Leçon du module « scales » + les questions de quiz qui s'y rattachent.
// Format décrit dans src/content/README.md.

export default {
  id: "scales-c1-04", level: 3,
  title: "Les enharmonies : pourquoi Do# = Réb ?",
  duration: 7,
  gropiTip: "Repère les 5 cases altérées de la corde 6 (2, 4, 6, 9, 11) et donne à chacune ses deux noms : Fa#/Sol♭, Sol#/La♭, La#/Si♭, Do#/Ré♭, Ré#/Mi♭.",
  content: [
    { type: "p", text: "Petite leçon courte mais utile. Tu as peut-être remarqué quelque chose de bizarre : la note entre Do et Ré peut s'appeler 'Do#' (Do dièse) OU 'Ré♭' (Ré bémol). C'est exactement le même son, la même touche du piano, la même case de ta guitare. Pourquoi deux noms ?", img: "/illus-prisme-lumiere.webp", imgAlt: "Un prisme qui décompose un rayon de lumière blanche en plusieurs couleurs", imgSide: "left" },
    { type: "h", text: "Le concept d'enharmonie" },
    { type: "p", text: "Deux notes qui sonnent pareil mais s'écrivent différemment sont dites 'enharmoniques'. Do# et Ré♭ sont enharmoniques. Mi# et Fa sont enharmoniques. La# et Si♭ sont enharmoniques. Ce n'est pas une coquetterie : le choix entre les deux dépend du contexte musical." },
    { type: "note_grid", caption: "Corde 5, de La à La : les 5 notes altérées écrites en dièses", data: {string: 5, stringName: "La", maxFret: 12, highlights: [{fret: 0, label: "La", color: "neutral"}, {fret: 1, label: "La#", color: "coral"}, {fret: 2, label: "Si", color: "neutral"}, {fret: 3, label: "Do", color: "neutral"}, {fret: 4, label: "Do#", color: "coral"}, {fret: 5, label: "Ré", color: "neutral"}, {fret: 6, label: "Ré#", color: "coral"}, {fret: 7, label: "Mi", color: "neutral"}, {fret: 8, label: "Fa", color: "neutral"}, {fret: 9, label: "Fa#", color: "coral"}, {fret: 10, label: "Sol", color: "neutral"}, {fret: 11, label: "Sol#", color: "coral"}, {fret: 12, label: "La", color: "neutral"}]} },
    { type: "note_grid", caption: "Les mêmes cases écrites en bémols : La# = Sib, Do# = Réb, Ré# = Mib, Fa# = Solb, Sol# = Lab", data: {string: 5, stringName: "La", maxFret: 12, highlights: [{fret: 0, label: "La", color: "neutral"}, {fret: 1, label: "Sib", color: "primary"}, {fret: 2, label: "Si", color: "neutral"}, {fret: 3, label: "Do", color: "neutral"}, {fret: 4, label: "Réb", color: "primary"}, {fret: 5, label: "Ré", color: "neutral"}, {fret: 6, label: "Mib", color: "primary"}, {fret: 7, label: "Mi", color: "neutral"}, {fret: 8, label: "Fa", color: "neutral"}, {fret: 9, label: "Solb", color: "primary"}, {fret: 10, label: "Sol", color: "neutral"}, {fret: 11, label: "Lab", color: "primary"}, {fret: 12, label: "La", color: "neutral"}]} },
    { type: "h", text: "Quand utiliser un dièse vs un bémol" },
    { type: "p", text: "Règle simple : on garde les noms de notes consécutifs dans une gamme. Dans Sol majeur (Sol-La-Si-Do-Ré-Mi-Fa#-Sol), on écrit 'Fa#' parce qu'on a déjà un 'Sol' juste après. Dans Mi♭ majeur (Mi♭-Fa-Sol-La♭-Si♭-Do-Ré-Mi♭), on écrit 'La♭' (et pas Sol#) parce qu'il faut une note 'La' dans la gamme. C'est de la cohérence d'orthographe musicale." },
    { type: "h", text: "Pourquoi ça importe" },
    { type: "p", text: "Sur ta guitare, c'est exactement la même case, donc tu peux ignorer la nuance au début. Mais quand tu liras une partition, tu verras des Sol bémol et des Fa dièse selon les morceaux. Comprendre l'enharmonie t'évitera des moments de panique." },
    { type: "ref", text: "Anecdote : la chanson 'Yesterday' (The Beatles) est en Fa majeur. Elle contient des Si bémol, jamais des La dièse — pourtant ce serait la même note. C'est juste une question d'orthographe musicale cohérente avec la tonalité." },
    { type: "tip", text: "Au début, accepte simplement qu'une même case puisse avoir deux noms. Ce sera plus clair quand on parlera de tonalités, dans les prochaines leçons." },
  ],
  quiz: ["q-base-18","q-scales-52","q-scales-53"],
};

export const quiz = [
  {id:"q-base-18",courseId:"scales",lessonId:"scales-c1-04",lvl:2,q:"Deux notes qui sonnent identiques mais portent deux noms différents sont dites…",o:["Dissonantes","Enharmoniques","Chromatiques","Diatoniques"],a:1,exp:"Do# et Réb sont enharmoniques : même case sur la guitare, même son, deux écritures selon le contexte tonal.",xp:35},
  {id:"q-scales-52",courseId:"scales",lessonId:"scales-c1-04",lvl:1,q:"Quel est l'autre nom de La# ?",o:["Si♭","La♭","Si","Do♭"],a:0,exp:"La# est un demi-ton au-dessus de La, Si♭ un demi-ton sous Si : c'est la même case, deux noms enharmoniques du même son.",xp:30},
  {id:"q-scales-53",courseId:"scales",lessonId:"scales-c1-04",lvl:2,q:"Dans Sol majeur, pourquoi écrit-on Fa# plutôt que Sol♭ ?",o:["Pour garder une note par lettre","Parce que Sol♭ sonne plus grave","Parce que les bémols sont interdits","Parce que Fa# se joue plus facilement"],a:0,exp:"Une gamme utilise chaque lettre une fois : Sol La Si Do Ré Mi Fa#. Écrire Sol♭ donnerait deux « Sol » et aucun « Fa ». Fa# et Sol♭ sonnent pareil : c'est une question d'orthographe.",xp:40},
];
