// Leçon du module « debut » + les questions de quiz qui s'y rattachent.
// Format décrit dans src/content/README.md.

export default {
  id: "debut-c2-04", level: 0, unite: 2,
  title: "Changer d'accord sans s'arrêter",
  duration: 7,
  gropiTip: "Pendant que tu grattes un accord, dis déjà dans ta tête le nom du suivant : ton cerveau prépare le trajet des doigts avant même que ta main bouge.",
  content: [
    { type: "p", text: "Savoir poser un accord, c'est la moitié du chemin. L'autre moitié, la plus difficile au début, c'est de passer d'un accord à l'autre sans casser le rythme. Bonne nouvelle : ça se travaille, avec quelques astuces et un exercice redoutablement efficace." },
    { type: "h", text: "Astuce 1 : les doigts pivots" },
    { type: "p", text: "Entre deux accords, certains doigts restent exactement au même endroit. Ne les soulève pas ! Entre Do et La mineur, par exemple, l'index (corde 2, case 1) et le majeur (corde 4, case 2) ne bougent pas : seul l'annulaire se déplace, de la corde 5 case 3 à la corde 3 case 2. Avant chaque changement, cherche ce qui peut rester en place." },
    { type: "chord_diagram", caption: "Do (C) — index et majeur restent en place…", data: { name: "C", frets: [-1, 3, 2, 0, 1, 0], fingers: [0, 3, 2, 0, 1, 0], startFret: 1 } },
    { type: "chord_diagram", caption: "…La mineur (Am) — seul l'annulaire a bougé", data: { name: "Am", frets: [-1, 0, 2, 2, 1, 0], fingers: [0, 0, 2, 3, 1, 0], startFret: 1 } },
    { type: "h", text: "Astuce 2 : les doigts guides" },
    { type: "p", text: "Parfois un doigt change de case mais reste sur la même corde : fais-le glisser le long de la corde au lieu de le soulever, il guide toute la main. Et quand rien ne reste en commun, comme entre Mi mineur et Sol, déplace tous les doigts ensemble, d'un bloc, comme un tampon qu'on pose : pas un doigt après l'autre." },
    { type: "h", text: "Astuce 3 : partir un peu en avance" },
    { type: "p", text: "Le changement ne doit pas tomber sur le temps fort suivant, il doit être DÉJÀ fait. Quitte l'accord sur le dernier coup de la mesure : ce coup-là peut tomber sur les cordes à vide, personne ne l'entendra vraiment, alors qu'un trou dans le rythme s'entend tout de suite." },
    { type: "h", text: "L'exercice « une minute de changements »" },
    { type: "p", text: "Choisis deux accords, par exemple Mi mineur et La mineur. Lance un minuteur d'une minute. Alterne entre les deux le plus de fois possible, en grattant une fois chaque accord, et compte les changements. Note ton score. Refais l'exercice chaque jour avec la même paire : le chiffre va grimper très vite. Puis passe à d'autres paires : Do et La mineur, Sol et Ré, Ré et Mi mineur, Mi mineur et Do." },
    { type: "tip", text: "Un changement compte seulement si l'accord sonne bien. Mieux vaut 20 changements propres que 40 approximatifs. Et pendant l'exercice, regarde tes doigts : où perdent-ils du temps ? Lequel arrive en dernier ? C'est souvent toujours le même." },
  ],
  quiz: ["q-debut-33", "q-debut-34", "q-debut-35"],
};

export const quiz = [
  {id:"q-debut-33",courseId:"debut",lessonId:"debut-c2-04",lvl:1,q:"Entre Do et La mineur, combien de doigts doivent vraiment bouger ?",o:["Aucun","Un seul, l'annulaire","Deux","Les trois"],a:1,exp:"L'index (corde 2, case 1) et le majeur (corde 4, case 2) sont communs aux deux accords. Seul l'annulaire passe de la corde 5 case 3 à la corde 3 case 2.",xp:25},
  {id:"q-debut-34",courseId:"debut",lessonId:"debut-c2-04",lvl:1,q:"Quand aucun doigt n'est commun entre deux accords, comment les déplacer ?",o:["Un doigt après l'autre, en commençant par l'index","Tous ensemble, d'un bloc","En regardant chaque doigt se poser un par un","En s'arrêtant de jouer une mesure"],a:1,exp:"Déplacer la forme d'un bloc, comme un tampon, est bien plus rapide que de reconstruire l'accord doigt par doigt.",xp:25},
  {id:"q-debut-35",courseId:"debut",lessonId:"debut-c2-04",lvl:2,q:"Pourquoi quitter un accord un peu avant le temps suivant ?",o:["Pour que le nouvel accord soit en place pile sur le temps","Parce que le dernier coup doit toujours être silencieux","Pour reposer la main gauche","Pour jouer plus vite que le métronome"],a:0,exp:"Le changement doit être terminé quand le temps fort arrive. Un coup sur les cordes à vide juste avant passe inaperçu ; un trou dans le rythme, non.",xp:30},
];
