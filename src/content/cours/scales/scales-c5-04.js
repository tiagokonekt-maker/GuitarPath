// Leçon du module « scales » + les questions de quiz qui s'y rattachent.
// Format « leçon en cartes » décrit dans src/content/README.md.

export default {
  id: "scales-c5-04", level: 8,
  title: "Lydien — l'évasion onirique",
  duration: 8,
  gropiTip: "Trouve la #4 en une seconde : c'est un triton (6 cases) au-dessus de la fondamentale sur la même corde. Fa case 1 corde 6 → Si case 7 corde 6. Le diabolus in musica, en version féerique !",
  cartes: [
    { type: "idee", titre: "Le 4e mode", texte: [
      "Do majeur joué depuis Fa : Fa, Sol, La, Si, Do, Ré, Mi. C'est Fa lydien.",
      "Formule : 1-2-3-#4-5-6-7. C'est un mode majeur, avec une seule différence face à l'ionien : sa quarte est augmentée.",
    ] },
    { type: "idee", titre: "La note qui flotte", texte: [
      "En Fa lydien, cette quarte augmentée est Si. Elle est à un demi-ton de la quinte, Do, mais rien ne l'oblige à y descendre.",
      "Laisse-la suspendue, en note longue : c'est tout l'effet lydien, brillant et flottant.",
    ], bloc: {
      type: "scale_pattern",
      caption: "Fa lydien — fondamentale case 8 c5. Note clé : Si naturel, la quarte augmentée (case 7 c6, case 9 c4, case 7 c1)",
      data: {
        startFret: 7, endFret: 11,
        rootColor: "pink", noteColor: "primary", accentColor: "coral", accentLabel: "Si, quarte augmentée",
        strings: [
          { frets: [7, 8, 10], root: [], accent: [7] },
          { frets: [7, 8, 10], root: [8] },
          { frets: [7, 9, 10], root: [], accent: [9] },
          { frets: [7, 9, 10], root: [10] },
          { frets: [8, 10], root: [] },
          { frets: [7, 8, 10], root: [], accent: [7] },
        ],
        noteMap: {
          "7,0":"Si","8,0":"Do","10,0":"Ré",
          "7,1":"Mi","8,1":"Fa","10,1":"Sol",
          "7,2":"La","9,2":"Si","10,2":"Do",
          "7,3":"Ré","9,3":"Mi","10,3":"Fa",
          "8,4":"Sol","10,4":"La",
          "7,5":"Si","8,5":"Do","10,5":"Ré",
        },
      },
    } },
    { type: "question", quizId: "q-impro-11" },
    { type: "idee", titre: "Rêve et espace", texte: [
      "Du plus lumineux au plus sombre, il ouvre la liste : c'est le plus brillant des sept. Les musiques de film y puisent souvent le merveilleux, le jazz fusion aussi.",
      "Son terrain : un accord maj7 qui ne résout pas, ou deux accords majeurs à un ton d'écart. Sur Fa – Sol, le Si de Sol colore le Fa.",
    ] },
    { type: "a-toi", titre: "Fa lydien sur Fa – Sol",
      consigne: "Fais tourner Fa et Sol majeurs, deux mesures chacun, au clic à 70 : enregistre-toi ou utilise une boucle. Joue la tab, qui finit suspendue sur Si (corde 4 case 9), puis improvise dans la position case 8 en laissant sonner ce Si sans le résoudre.",
      bloc: {
        type: "tab",
        caption: "Fa lydien, position case 8 : une montée qui reste suspendue sur Si, la quarte augmentée",
        text: "Tab — corde 5 cases 8 et 10 (Fa, Sol), corde 4 cases 7, 9, 10, puis 9 tenue (La, Si, Do, Si).",
        data: { lines: [
          "e|---------------------|",
          "B|---------------------|",
          "G|---------------------|",
          "D|--------7--9--10--9--|",
          "A|-8--10---------------|",
          "E|---------------------|",
        ] },
      }, bpm: 70, minuteur: 150 },
    { type: "question", quizId: "q-scales-11" },
    { type: "recap", points: [
      "Lydien = 1-2-3-#4-5-6-7 ; Fa lydien = notes de Do majeur depuis Fa.",
      "Sa #4, laissée en suspension, donne la couleur flottante et brillante.",
      "Terrain : un maj7 qui ne résout pas, ou deux accords majeurs à un ton.",
    ] },
  ],
  quiz: ["q-scales-10","q-scales-11","q-scales-19","q-impro-11"],
};

export const quiz = [
  {id:"q-scales-10",courseId:"scales",lessonId:"scales-c5-04",lvl:2,q:"Quel est le mode 'le plus brillant' dans l'ordre des modes ?",o:["Ionien","Mixolydien","Lydien","Phrygien"],a:2,exp:"Lydien (#4) > Ionien > Mixolydien (♭7) > Dorien (♭3) > Éolien (♭6) > Phrygien (♭2) > Locrien (♭5). Plus on descend, plus le mode est sombre.",xp:45},
  {id:"q-scales-11",courseId:"scales",lessonId:"scales-c5-04",lvl:3,q:"Quelle note caractérise le mode lydien par rapport à l'ionien ?",o:["♭7","#5","♭3","#4"],a:3,exp:"Lydien = ionien (majeur) avec #4. Do lydien = Do-Ré-Mi-Fa#-Sol-La-Si. Le Fa# crée une couleur flottante, souvent entendue dans les musiques de film.",xp:45},
  {id:"q-scales-19",courseId:"scales",lessonId:"scales-c5-04",lvl:3,q:"Le mode lydien évoque typiquement quelle ambiance ?",o:["Tristesse","Tension dramatique","Énergie blues","Espace, rêve, magie"],a:3,exp:"Lydien (#4) crée une couleur flottante, non résolue : ambiance ouverte, rêveuse, souvent utilisée dans les musiques de film pour le merveilleux.",xp:45},
  {id:"q-impro-11",courseId:"impro",lessonId:"scales-c5-04",lvl:3,q:"Quelle gamme jouer sur un accord Cmaj7#11 ?",o:["Do majeure","Do mixolydien","Do dorien","Do lydien"],a:3,exp:"Maj7#11 contient un #4. Le mode lydien (1-2-3-#4-5-6-7) correspond exactement. Do lydien sur Cmaj7#11 = match parfait.",xp:65},
];
