// Leçon du module « impro » + les questions de quiz qui s'y rattachent.
// Format décrit dans src/content/README.md.

export default {
  id: "impro-05", level: 9,
  title: "Construire un solo",
  duration: 15,
  content: [
    { type: "p", text: "Un solo n'est pas une collection de licks bout à bout — c'est une narration musicale avec un début, un développement et une conclusion. Les meilleurs solos de l'histoire suivent tous une structure narrative claire." },
    { type: "h", text: "La structure en 3 actes" },
    { type: "p", text: "Acte 1 (25%) : pose le contexte. Jeu épuré, notes longues, peu de notes. Acte 2 (50%) : monte progressivement. Augmente la densité, monte dans les aigus, augmente l'intensité. Acte 3 (25%) : climax aux 2/3 puis descente satisfaisante vers la tonique." },
    { type: "h", text: "La règle du climax aux 2/3" },
    { type: "p", text: "Ton moment le plus intense arrive aux 2/3 du solo, pas à la fin. Sur 32 mesures, le climax est mesure 21-22. Le tiers restant permet une résolution progressive — plus satisfaisante qu'un solo qui monte jusqu'au bout et s'arrête brutalement. C'est la structure narrative naturelle." },
    { type: "h", text: "Gérer l'espace de registre" },
    { type: "p", text: "Commence en registre médium (cases 5-9), développe vers les aigus (cases 12-17) pour le climax, puis redescends. Ce voyage physique sur le manche crée une progression émotionnelle naturelle. Les notes aiguës ont plus d'énergie — utilise-les au moment clé." },
    { type: "fretboard_interactive", mode: "scale", root: "A", scale: "pentatonic_minor", caption: "Pentatonique mineure de La — registre complet pour ton voyage", displayMode: "notes", lang: "fr", compact: true },
    { type: "tip", text: "Enregistre-toi sur un backing Am de 32 mesures. Réécoute. Dessine une courbe d'intensité (1 à 10) mesure par mesure. Le climax est-il aux 2/3 ? Si non, recommence en t'imposant cette contrainte." },
  ],
  quiz: ["q-rhy-12","q-impro-13","q-impro-29"],
};

export const quiz = [
  {id:"q-rhy-12",courseId:"rhythm",lessonId:"impro-05",lvl:3,q:"Un 'motif' musical est…",o:["Une phrase courte, répétée et transformée", "Un thème complet de plusieurs mesures", "Un solo entier, du début à la fin", "Un riff de 16 mesures qui tourne en boucle"],a:0,exp:"Motif = cellule mélodique courte (3-6 notes), répétée et développée. Outils : transposition, augmentation, inversion, séquence. Base de la composition.",xp:50},
  {id:"q-impro-13",courseId:"impro",lessonId:"impro-05",lvl:2,q:"Le 'climax' d'un solo se place idéalement…",o:["Au début","Aux 2/3","À la fin","Au milieu exact"],a:1,exp:"Règle des 2/3 : climax aux 2/3 → montée naturelle puis résolution satisfaisante. C'est la structure narrative classique. 'Comfortably Numb' (Gilmour) en est l'archétype.",xp:50},
  {id:"q-impro-29",courseId:"impro",lessonId:"impro-05",lvl:3,q:"Comment construire l'intensité d'un solo dans la durée ?",o:["En faisant monter registre, densité et tension", "En répétant la même phrase du début à la fin", "En jouant fort et vite dès la première note", "En alternant au hasard les nuances et les tempos"],a:0,exp:"Un solo est une courbe, pas un plateau. Commencer bas et clairsemé laisse de la place pour monter — commencer au maximum ne laisse nulle part où aller, et l'oreille s'habitue en quelques secondes.",xp:40},
];
