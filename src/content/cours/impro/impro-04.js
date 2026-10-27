// Leçon du module « impro » + les questions de quiz qui s'y rattachent.
// Format « leçon en cartes » décrit dans src/content/README.md.
// Jouer les changements, 1 sur 2 : le ii-V-I et ses guide tones.
// Suite : impro-04b (des phrases qui enjambent le changement).

const GUIDE_TONES = {
  type: "tab",
  caption: "Les guide tones du ii-V-I en Do : une seule note bouge à chaque accord",
  text: "Tab — Dm7 : Do (corde 3 case 5) et Fa (corde 2 case 6). G7 : Si (corde 3 case 4) et Fa. Cmaj7 : Si et Mi (corde 2 case 5), deux mesures.",
  data: { lines: [
    "e|--------|--------|--------|--------|",
    "B|6-------|6-------|5-------|5-------|",
    "G|5-------|4-------|4-------|4-------|",
    "D|--------|--------|--------|--------|",
    "A|--------|--------|--------|--------|",
    "E|--------|--------|--------|--------|",
  ] },
};

export default {
  id: "impro-04", level: 9,
  title: "Jouer les changements : le ii-V-I",
  duration: 8,
  gropiTip: "Fredonne l'autre ligne de guide tones du ii-V-I : Fa sur Dm7, Fa sur G7, Mi sur Cmaj7. Une seule note qui descend d'un demi-ton : si tu l'entends, tu entends le changement.",
  cartes: [
    { type: "idee", titre: "Entendre l'accord changer", texte: [
      "La pentatonique de La sur tout un blues, ça marche. L'étape suivante : entendre chaque changement d'accord et adapter tes cibles.",
      "Même sans changer de gamme, tes phrases reflètent alors l'harmonie.",
    ] },
    { type: "question", quizId: "q-impro-31" },
    { type: "idee", titre: "Le ii-V-I", texte: [
      "En Do : Dm7, G7, Cmaj7. Tension douce, tension forte, repos.",
      "Dm7 = Ré Fa La Do ; G7 = Sol Si Ré Fa ; Cmaj7 = Do Mi Sol Si. C'est la cadence centrale du jazz.",
    ], bloc: { type: "fretboard_interactive", mode: "chord", root: "G", chord: "dom7", caption: "V — G7 : Sol Si Ré Fa (tension maximale)", displayMode: "notes", lang: "fr", compact: true } },
    { type: "idee", titre: "Deux lignes qui glissent", texte: [
      "Fa, 3e de Dm7, reste et devient la 7e de G7, puis descend sur Mi, 3e de Cmaj7.",
      "Do, 7e de Dm7, descend sur Si, 3e de G7, qui reste et devient la 7e de Cmaj7. Ces demi-tons sont le moteur de la progression.",
    ], bloc: { type: "fretboard_interactive", mode: "quiz", quizTarget: "F", caption: "Quiz : trouve tous les Fa — guide tone pivot du ii-V-I", lang: "fr", compact: true } },
    { type: "question", quizId: "q-impro-guide-lot4" },
    { type: "a-toi", titre: "Une case bouge",
      consigne: "Boucle Dm7, G7, Cmaj7 (ou la Jam en Jazz ii-V-I, tonalité Do). Joue les deux notes de la tab sur le 1 de chaque accord : une seule case bouge à chaque fois. Puis garde une seule note par accord et brode autour.",
      bloc: GUIDE_TONES, bpm: 60, minuteur: 180 },
    { type: "question", quizId: "q-impro-03" },
    { type: "recap", points: [
      "ii-V-I en Do : Dm7, G7, Cmaj7, tension douce, tension forte, repos.",
      "Fa reste puis descend sur Mi ; Do descend sur Si, qui reste.",
      "Une note par accord bien choisie suffit à faire entendre le changement.",
    ] },
  ],
  quiz: ["q-impro-31","q-impro-guide-lot4","q-impro-03"],
};

export const quiz = [
  {id:"q-impro-31",courseId:"impro",lessonId:"impro-04",lvl:3,q:"Sur une grille où les accords changent toutes les deux mesures, quelle approche donne le plus de relief ?",o:["Rester sur la même gamme sans rien ajuster", "Accélérer le débit à chaque changement", "Viser une note de l'accord au changement", "S'arrêter de jouer à chaque changement"],a:2,exp:"Ce qui rend un solo « dedans », c'est de tomber sur une note de l'accord au moment précis où il arrive. Une seule note bien placée au changement s'entend davantage que quinze notes entre deux changements.",xp:40},
  {id:"q-impro-guide-lot4",courseId:"impro",lessonId:"impro-04",lvl:3,q:"Dans Dm7 - G7 - Cmaj7, lequel des guide tones de Dm7 (sa tierce ou sa septième) se retrouve tel quel dans G7 ?",o:["Fa","Do","Si","Mi"],a:0,exp:"Fa, la tierce de Dm7, devient la 7e de G7 sans bouger. Do, la 7e de Dm7, descend d'un demi-ton sur Si. Si et Mi ne sont pas dans Dm7 : ce sont les guide tones d'arrivée de G7 et de Cmaj7.",xp:40},
];
