// Leçon du module « scales » + les questions de quiz qui s'y rattachent.
// Format décrit dans src/content/README.md.

export default {
  id: "scales-c1-04", level: 3,
  title: "Les enharmonies : pourquoi Do# = Réb ?",
  duration: 7,
  content: [
    { type: "p", text: "Petite leçon courte mais utile. Tu as peut-être remarqué quelque chose de bizarre : la note entre Do et Ré peut s'appeler 'Do#' (Do dièse) OU 'Ré♭' (Ré bémol). C'est exactement le même son, la même touche du piano, la même case de ta guitare. Pourquoi deux noms ?", img: "/illus-prisme-lumiere.webp", imgAlt: "Un prisme qui décompose un rayon de lumière blanche en plusieurs couleurs", imgSide: "left" },
    { type: "h", text: "Le concept d'enharmonie" },
    { type: "p", text: "Deux notes qui sonnent pareil mais s'écrivent différemment sont dites 'enharmoniques'. Do# et Ré♭ sont enharmoniques. Mi# et Fa sont enharmoniques. La# et Si♭ sont enharmoniques. Ce n'est pas une coquetterie : le choix entre les deux dépend du contexte musical." },
    { type: "h", text: "Quand utiliser un dièse vs un bémol" },
    { type: "p", text: "Règle simple : on garde les noms de notes consécutifs dans une gamme. Dans Sol majeur (Sol-La-Si-Do-Ré-Mi-Fa#-Sol), on écrit 'Fa#' parce qu'on a déjà un 'Sol' juste après. Dans Mi♭ majeur (Mi♭-Fa-Sol-La♭-Si♭-Do-Ré-Mi♭), on écrit 'La♭' (et pas Sol#) parce qu'il faut une note 'La' dans la gamme. C'est de la cohérence d'orthographe musicale." },
    { type: "h", text: "Pourquoi ça importe" },
    { type: "p", text: "Sur ta guitare, c'est exactement la même case, donc tu peux ignorer la nuance au début. Mais quand tu liras une partition, tu verras des Sol bémol et des Fa dièse selon les morceaux. Comprendre l'enharmonie t'évitera des moments de panique." },
    { type: "ref", text: "Anecdote : la chanson 'Yesterday' (The Beatles) est en Fa majeur. Elle contient des Si bémol, jamais des La dièse — pourtant ce serait la même note. C'est juste une question d'orthographe musicale cohérente avec la tonalité." },
    { type: "tip", text: "Au début, accepte simplement qu'une même case puisse avoir deux noms. Ce sera plus clair quand on parlera de tonalités, dans les prochaines leçons." },
  ],
  quiz: ["q-base-18"],
};

export const quiz = [
  {id:"q-base-18",courseId:"scales",lessonId:"scales-c1-04",lvl:2,q:"Deux notes qui sonnent identiques mais portent deux noms différents sont dites…",o:["Dissonantes","Enharmoniques","Chromatiques","Diatoniques"],a:1,exp:"Do# et Réb sont enharmoniques : même case sur la guitare, même son, deux écritures selon le contexte tonal.",xp:35},
];
