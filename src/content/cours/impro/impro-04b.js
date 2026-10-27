// Leçon du module « impro » + les questions de quiz qui s'y rattachent.
// Format « leçon en cartes » décrit dans src/content/README.md.
// Jouer les changements, 2 sur 2 : viser la cible à travers la barre de
// mesure, ii-V modaux. Suite d'impro-04, scindée en deux au lot 4.

const ENJAMBER = {
  type: "tab",
  caption: "Dm7 → G7 → Cmaj7 : Do glisse sur Si au changement, Fa sur Mi au suivant",
  text: "Tab — mesure 1 (Dm7) : Fa (corde 2 case 6), Mi (corde 2 case 5), Ré (corde 2 case 3), puis Do (corde 3 case 5) en fin de mesure. Mesure 2 (G7) : Si (corde 3 case 4) sur le 1, Ré, puis Fa (corde 2 case 6). Mesure 3 (Cmaj7) : Mi (corde 2 case 5) sur le 1, tenu.",
  data: { lines: [
    "e|----------------|----------------|----------------|",
    "B|6---5---3-------|----3---6-------|5---------------|",
    "G|--------------5-|4---------------|----------------|",
    "D|----------------|----------------|----------------|",
    "A|----------------|----------------|----------------|",
    "E|----------------|----------------|----------------|",
  ] },
};

export default {
  id: "impro-04b", level: 9,
  title: "Jouer les changements : des phrases qui atterrissent",
  duration: 8,
  gropiTip: "Chante la cible avant de la jouer : sur la fin de Dm7, fredonne déjà le Si de G7. Si ta voix la trouve avant le changement, tes doigts sauront où aller.",
  cartes: [
    { type: "idee", titre: "Arriver au bon moment", texte: [
      "La cible compte surtout au temps 1 du nouvel accord. Entre deux cibles, les notes de passage sont libres.",
      "Un bon repère : une phrase qui arrive, pas une phrase qui s'arrête.",
    ] },
    { type: "idee", titre: "Enjamber la barre de mesure", texte: [
      "Termine la mesure de Dm7 sur une note à un demi-ton de la cible de G7 : Do, puis Si au temps 1.",
      "La phrase traverse le changement au lieu de s'arrêter devant. L'oreille entend l'accord arriver avant même la basse.",
    ], bloc: ENJAMBER },
    { type: "question", quizId: "q-impro-ciblage-lot4" },
    { type: "idee", titre: "Quand le V ne résout pas", texte: [
      "Une vamp Em7 - A7 ne va jamais sur Dmaj7 : c'est un ii-V modal, qui tourne sur lui-même.",
      "On reste en Mi dorien, et on fait entendre A7 par sa tierce, Do#.",
    ] },
    { type: "question", quizId: "q-impro-02" },
    { type: "idee", titre: "Même idée sur Dm7 - G7", texte: [
      "En Ré dorien sur Dm7 - G7, le Si colore Dm7 et définit G7.",
      "Mets-le en avant au moment où G7 arrive : une seule gamme, et pourtant le changement s'entend.",
    ] },
    { type: "question", quizId: "q-impro-07" },
    { type: "a-toi", titre: "Des phrases qui enjambent",
      consigne: "Boucle Dm7, G7, Cmaj7 (ou la Jam en Jazz ii-V-I, tonalité Do). Joue la tab : Do glisse sur Si au changement, Fa sur Mi au suivant. Puis improvise : chaque fin de mesure prépare, à un demi-ton, la cible de l'accord suivant.",
      bloc: ENJAMBER, bpm: 70, minuteur: 180 },
    { type: "recap", points: [
      "La cible tombe au temps 1 du nouvel accord ; entre deux cibles, tout est permis.",
      "Prépare la cible à un demi-ton en fin de mesure : la phrase enjambe le changement.",
      "Sur un ii-V modal, une seule gamme, mais la tierce du V mise en avant.",
    ] },
  ],
  quiz: ["q-impro-ciblage-lot4","q-impro-02","q-impro-07"],
};

export const quiz = [
  {id:"q-impro-ciblage-lot4",courseId:"impro",lessonId:"impro-04b",lvl:3,q:"Fin de mesure sur Dm7 : ta phrase doit tomber sur Si au temps 1 de G7. Quelle note de Dm7 est à un demi-ton de cette cible ?",o:["Do","Ré","La","Fa"],a:0,exp:"Do, la 7e de Dm7, est un demi-ton au-dessus de Si : joué en fin de mesure, il glisse sur la cible au changement. Ré et La sont à un ton entier de Si, Fa à trois tons.",xp:40},
];
