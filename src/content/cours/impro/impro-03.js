// Leçon du module « impro » + les questions de quiz qui s'y rattachent.
// Format décrit dans src/content/README.md.

export default {
  id: "impro-03", level: 8,
  title: "Tension et résolution",
  duration: 15,
  gropiTip: "Une note d'approche ne se tient pas : joue Si ou Do# sur le contretemps, puis pose Do sur le temps fort. Si tu t'attardes sur l'approche, la tension sonne comme une fausse note.",
  content: [
    { type: "p", text: "La musique est une manipulation de la tension et de la résolution. Tu crées de la tension (dissonance, instabilité) puis tu la résous (consonance, repos). Plus la tension est grande avant la résolution, plus la résolution est satisfaisante. C'est le moteur de toute musique tonale." },
    { type: "h", text: "Les approach notes" },
    { type: "p", text: "Une approach note est une note à 1 demi-ton au-dessus ou en dessous d'une note cible. Elle crée une tension momentanée qui se résout immédiatement. Exemple : si tu vises Do (3e de Am), joue Do# juste avant (approche par le haut) ou Si (approche par le bas). L'oreille anticipe la résolution et la ressent comme une 'arrivée'." },
    { type: "fretboard_interactive", mode: "highlight", notes: ["C", "C#", "B"], caption: "Approches chromatiques de Do — Si (bas) et Do# (haut)", displayMode: "notes", lang: "fr", compact: true },
    { type: "h", text: "L'enclosure" },
    { type: "p", text: "L'enclosure combine les deux approaches : tu encadres la note cible par ses deux voisines chromatiques. Pour cibler Do : Do#→Si→Do. L'effet est plus fort — l'oreille est 'capturée' dans un mouvement circulaire avant l'arrivée. C'est la signature du bebop, utilisée par Charlie Parker à chaque mesure." },
    { type: "h", text: "Les avoid notes" },
    { type: "p", text: "Certaines notes de la gamme créent une dissonance trop forte sur certains accords — les 'avoid notes'. Sur Cmaj7, la 4e (Fa) crée une 2e mineure avec la 3e (Mi). Ces notes ne sont pas interdites — elles passent vite, en notes de passage, mais ne se tiennent pas sur les temps forts." },
    { type: "fretboard_interactive", mode: "scale", root: "C", scale: "major", caption: "Do majeur sur Cmaj7 — Fa (4e, degré 4) est l'avoid note", displayMode: "degrees", lang: "fr", compact: true },
    { type: "tip", text: "Exercice enclosure : cible Mi (3e de Cmaj7). Avant Mi, joue Fa→Mib→Mi. Répète 20 fois. Intègre dans une phrase. Tu viens d'apprendre un lick bebop." },
  ],
  quiz: ["q-impro-27","q-impro-28","q-impro-06","q-impro-10"],
};

export const quiz = [
  {id:"q-impro-27",courseId:"impro",lessonId:"impro-03",lvl:2,q:"Une note qui n'appartient pas à l'accord en cours est…",o:["Toujours une faute à éviter", "Réservée au répertoire jazz", "Utilisable si elle se résout ensuite", "À placer uniquement en toute fin de phrase"],a:2,exp:"Ce qui rend une note « fausse » n'est pas son choix mais son traitement. Posée et tenue, elle heurte ; traversée vers une note stable, elle crée le mouvement dont la phrase a besoin.",xp:30},
  {id:"q-impro-28",courseId:"impro",lessonId:"impro-03",lvl:3,q:"Sur Sol7 qui résout vers Do, vers quelle note le Si (tierce de Sol7) a-t-il tendance à monter ?",o:["Do","Ré","Si♭","La"],a:0,exp:"Le Si est la sensible de Do : un demi-ton sous la tonique, il monte naturellement sur Do. Avec le Fa (7e de Sol7) qui descend sur Mi, c'est ce double mouvement par demi-tons qui donne à la dominante sa force d'appel.",xp:40},
];
