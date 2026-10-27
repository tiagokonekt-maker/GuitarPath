// Leçon du module « harmony » + les questions de quiz qui s'y rattachent.
// Format « leçon en cartes » décrit dans src/content/README.md.

export default {
  id: "harm-c7-01", level: 9,
  title: "Les accords empruntés",
  duration: 9,
  gropiTip: "En Do majeur, un accord qui contient Mib, Lab ou Sib vient en général de Do mineur : Fam (Lab), Sib (Sib), Lab (Lab, Mib). Écoute comme ces notes assombrissent la couleur.",
  cartes: [
    { type: "idee", titre: "Le mineur parallèle", texte: [
      "Do majeur : Do Ré Mi Fa Sol La Si. Do mineur : Do Ré Mi♭ Fa Sol La♭ Si♭. Même tonique, trois notes différentes.",
      "Un morceau en Do majeur peut emprunter un accord à Do mineur le temps d'une mesure : c'est l'emprunt.",
    ] },
    { type: "question", quizId: "q-harm-45" },
    { type: "idee", titre: "Le iv mineur", texte: [
      "Fa devient Fam : son La♭ apporte une couleur soul, mélancolique, même dans un morceau majeur.",
      "Do - Fa - Fam - Do : le La de Fa descend sur La♭, puis sur Sol dans l'accord de Do.",
    ], bloc: {
      type: "chord_diagram",
      caption: "Fm — sous-dominante mineure empruntée (1 3 3 1 1 1, barré case 1)",
      data: { name: "Fm (iv)", frets: [1,3,3,1,1,1], fingers: [1,3,4,1,1,1], startFret: 1, barre: { fret: 1, from: 0, to: 5 } },
    } },
    { type: "idee", titre: "Le ♭VI", texte: [
      "Sur le 6e degré de Do mineur, La♭ : La♭ Do Mi♭, un accord majeur absent de Do majeur.",
      "Placé avant un retour à Do, il donne une touche dramatique, épique.",
    ] },
    { type: "question", quizId: "q-harm-44" },
    { type: "idee", titre: "Le ♭VII", texte: [
      "Si♭ - Ré - Fa en Do majeur : un emprunt très fréquent. Do - Si♭ - Fa - Do sonne rock, brut, presque modal.",
      "Associé au ♭VI, il forme une montée qui revient à la tonique : Do - La♭ - Si♭ - Do.",
    ], bloc: {
      type: "chord_diagram",
      caption: "Bb — ♭VII emprunté (× 1 3 3 3 1 barré case 1)",
      data: { name: "Bb (♭VII)", frets: [-1,1,3,3,3,1], fingers: [0,1,2,3,4,1], startFret: 1, barre: { fret: 1, from: 1, to: 5 } },
    } },
    { type: "a-toi", titre: "Deux emprunts au clic",
      consigne: "Quatre temps par accord. Tour 1 : Do, Fa, Fam, Do. Tour 2 : Do, La♭, Si♭, Do. Les barrés sont dans la tab. Puis rejoue Do, Fa, Sol, Do : entends ce que chaque emprunt change à la couleur.",
      bloc: {
        type: "tab",
        caption: "Do (x32010), Fa (133211), Fam (133111), Do ; puis Do, La♭ (466544), Si♭ (x13331), Do",
        text: "Tab — huit accords de la corde 6 à la corde 1 : Do x-3-2-0-1-0 ; Fa 1-3-3-2-1-1 ; Fam 1-3-3-1-1-1 ; Do ; Do ; La♭ 4-6-6-5-4-4 ; Si♭ x-1-3-3-3-1 ; Do.",
        data: { lines: [
          "e|-0---1---1---0---0---4---1---0---|",
          "B|-1---1---1---1---1---4---3---1---|",
          "G|-0---2---1---0---0---5---3---0---|",
          "D|-2---3---3---2---2---6---3---2---|",
          "A|-3---3---3---3---3---6---1---3---|",
          "E|-----1---1-----------4-----------|",
        ] },
      }, bpm: 70, minuteur: 180 },
    { type: "idee", titre: "Dominantes secondaires", texte: [
      "Autre façon de sortir de la gamme : faire précéder un accord de sa propre dominante. D7 → Sol : le Fa# de D7 tire vers Sol comme une sensible.",
      "E7 → Lam marche de même. L'accord visé sonne un instant comme une tonique.",
    ] },
    { type: "question", quizId: "q-harm-46" },
    { type: "recap", points: [
      "Emprunter = prendre un accord au mineur parallèle (Do mineur pour Do majeur).",
      "Les classiques : iv (Fam), ♭VI (La♭), ♭VII (Si♭).",
      "Une dominante secondaire prépare un accord de la tonalité comme une mini-tonique.",
    ] },
  ],
  quiz: ["q-harm-44", "q-harm-45", "q-harm-46", "q-impro-03"],
};

export const quiz = [
  {id:"q-harm-44",courseId:"harmony",lessonId:"harm-c7-01",lvl:1,q:"En Do majeur, quel est l'accord ♭VII emprunté à Do mineur ?",o:["Si diminué","Si mineur","Si♭ majeur","La♭ majeur"],a:2,exp:"Le VII de Do majeur est Si diminué ; emprunté à Do mineur, le ♭VII devient Si♭ majeur (Si♭-Ré-Fa).",xp:30},
  {id:"q-harm-45",courseId:"harmony",lessonId:"harm-c7-01",lvl:2,q:"D'où vient l'accord Fa mineur dans une chanson en Do majeur ?",o:["De La mineur, la relative de Do","De Fa majeur, la sous-dominante","D'une simple erreur de transcription","De Do mineur, la tonalité parallèle"],a:3,exp:"Fa mineur est le iv de Do mineur, la tonalité parallèle (même tonique) : c'est un accord emprunté.",xp:40},
  {id:"q-harm-46",courseId:"harmony",lessonId:"harm-c7-01",lvl:2,q:"En Do majeur, quel accord prépare Dm comme une dominante ?",o:["A7","G7","E7","D7"],a:0,exp:"A7 est la dominante de Ré : une dominante secondaire, qui fait de Dm une mini-résolution.",xp:40},
];
