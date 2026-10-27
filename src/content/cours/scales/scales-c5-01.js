// Leçon du module « scales » + les questions de quiz qui s'y rattachent.
// Format « leçon en cartes » décrit dans src/content/README.md.

export default {
  id: "scales-c5-01", level: 8,
  title: "Ionien — la lumière pure (= majeur)",
  duration: 7,
  gropiTip: "Improvise en Do ionien sur une boucle Do-Fa-Sol et termine chaque phrase sur une note de l'accord de Do (Do, Mi ou Sol). C'est ce repos qui donne à l'ionien sa stabilité.",
  cartes: [
    { type: "idee", titre: "Le premier mode", texte: [
      "L'ionien, c'est la gamme que tu connais depuis longtemps : 1-2-3-4-5-6-7, en Do : Do, Ré, Mi, Fa, Sol, La, Si. Aucune note altérée.",
      "C'est la référence à laquelle on compare les six autres modes.",
    ], bloc: { type: "scale_pattern", caption: "Do ionien (= Do majeur) — fondamentale case 3 sur la corde 5, aucune note altérée", data: {startFret: 2, endFret: 5, rootColor: "amber", noteColor: "primary", strings: [{frets: [3,5], root: []}, {frets: [2,3,5], root: [3]}, {frets: [2,3,5], root: []}, {frets: [2,4,5], root: [5]}, {frets: [3,5], root: []}, {frets: [3,5], root: []}], noteMap: {"3,0":"Sol", "5,0":"La", "2,1":"Si", "3,1":"Do", "5,1":"Ré", "2,2":"Mi", "3,2":"Fa", "5,2":"Sol", "2,3":"La", "4,3":"Si", "5,3":"Do", "3,4":"Ré", "5,4":"Mi", "3,5":"Sol", "5,5":"La"}} } },
    { type: "idee", titre: "Lumineux et stable", texte: [
      "Ses demi-tons tombent entre 3 et 4, puis entre 7 et l'octave. La 7e, la sensible, tire vers la tonique : chaque phrase s'y pose avec une vraie sensation de repos.",
      "Seul le lydien est plus lumineux.",
    ] },
    { type: "question", quizId: "q-scales-38" },
    { type: "idee", titre: "Sur quels accords", texte: [
      "Son terrain : l'accord bâti sur ses 1, 3, 5 et 7 (Cmaj7 pour Do ionien), et toute chanson tonale en majeur.",
      "Un seul piège : la quarte (Fa sur Cmaj7) frotte contre la tierce Mi. Passe dessus, ne la tiens pas.",
    ], bloc: { type: "chord_diagram", caption: "Cmaj7 (x32000) — l'accord type sur lequel jouer Do ionien", data: {name: "Cmaj7", frets: [-1,3,2,0,0,0], fingers: [0,3,2,0,0,0], startFret: 1} } },
    { type: "a-toi", titre: "La sensible qui se pose",
      consigne: "Plaque Cmaj7, puis joue la tab quatre fois au clic à 70 : Si finit par se poser sur Do. Ensuite, improvise dans la position en finissant chaque phrase sur Do (corde 5 case 3).",
      bloc: {
        type: "tab",
        caption: "Do ionien : de Mi à Do, puis la sensible Si qui se résout sur Do",
        text: "Tab — corde 4 cases 2, 3, 5 (Mi, Fa, Sol), corde 3 cases 2, 4, 5 (La, Si, Do), puis corde 3 cases 4 et 5 (Si, Do).",
        data: { lines: [
          "e|-------------------------|",
          "B|-------------------------|",
          "G|----------2--4--5--4--5--|",
          "D|-2--3--5-----------------|",
          "A|-------------------------|",
          "E|-------------------------|",
        ] },
      }, bpm: 70, minuteur: 150 },
    { type: "question", quizId: "q-scales-60" },
    { type: "idee", titre: "Penser « mode »", texte: [
      "Si tu improvises en majeur, tu sais jouer l'ionien : pense simplement « Do ionien ».",
      "Il n'est entré dans la théorie des modes qu'en 1547, avec le Dodecachordon de Glarean.",
    ] },
    { type: "recap", points: [
      "Ionien = gamme majeure : 1-2-3-4-5-6-7, sans altération.",
      "Sa sensible tire vers la tonique : le plus stable des modes.",
      "Terrain naturel : l'accord maj7 et les chansons tonales en majeur.",
    ] },
  ],
  quiz: ["q-scales-38", "q-scales-39", "q-scales-60"],
};

export const quiz = [
  {id:"q-scales-38",courseId:"scales",lessonId:"scales-c5-01",lvl:1,q:"À quoi correspond le mode ionien ?",o:["À la gamme mineure naturelle", "À la pentatonique majeure", "À la gamme blues", "À la gamme majeure"],a:3,exp:"Ionien = gamme majeure : 1-2-3-4-5-6-7. En Do : Do-Ré-Mi-Fa-Sol-La-Si.",xp:30},
  {id:"q-scales-39",courseId:"scales",lessonId:"scales-c5-01",lvl:2,q:"Du plus lumineux au plus sombre, quel mode vient juste après l'ionien ?",o:["Le mixolydien","Le lydien","Le dorien","L'éolien"],a:0,exp:"Lydien (#4) > ionien > mixolydien (♭7) > dorien (♭3) > éolien (♭6) > phrygien (♭2) > locrien (♭5). Le mixolydien ne diffère de l'ionien que par sa 7e mineure.",xp:40},
  {id:"q-scales-60",courseId:"scales",lessonId:"scales-c5-01",lvl:1,q:"Sur quel type d'accord le mode ionien est-il le choix naturel ?",o:["Un accord maj7","Un accord m7","Un accord 7","Un accord m7♭5"],a:0,exp:"Ionien = gamme majeure, avec tierce majeure et 7e majeure : il épouse un accord maj7 (Cmaj7 pour Do ionien). Sur un accord 7 de dominante, sa 7e majeure frotterait : c'est le terrain du mixolydien.",xp:30},
];
