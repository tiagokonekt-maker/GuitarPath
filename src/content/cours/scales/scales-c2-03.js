// Leçon du module « scales » + les questions de quiz qui s'y rattachent.
// Format « leçon en cartes » décrit dans src/content/README.md.

const DEGRES_DO = {
  type: "degree_chart",
  caption: "Les 7 degrés de Do majeur — I, IV, V en couleur (les piliers)",
  data: {
    boxes: [
      { top: "I",   label: "Tonique — Do",       tint: "green" },
      { top: "II",  label: "Sus-tonique — Ré",    tint: "neutral" },
      { top: "III", label: "Médiante — Mi",       tint: "neutral" },
      { top: "IV",  label: "Sous-dominante — Fa", tint: "amber" },
      { top: "V",   label: "Dominante — Sol",     tint: "coral" },
      { top: "VI",  label: "Sus-dominante — La",  tint: "neutral" },
      { top: "VII", label: "Sensible — Si",       tint: "neutral" },
    ],
  },
};

export default {
  id: "scales-c2-03", level: 5,
  title: "Les degrés et leurs noms",
  duration: 7,
  gropiTip: "Chante Do-Ré-Mi-Fa-Sol-La-Si et arrête-toi net sur le Si. Tu sens l'envie d'entendre Do ? C'est la Sensible (VII) qui tire vers la Tonique.",
  cartes: [
    { type: "idee", titre: "Des numéros plutôt que des notes", texte: [
      "Chaque note d'une gamme porte un numéro, son degré, de I à VII. En Do majeur, I = Do et V = Sol. En La majeur, I = La et V = Mi.",
      "Le numéro reste, le contenu change : les degrés marchent dans toutes les tonalités.",
    ] },
    { type: "idee", titre: "Leurs noms", texte: [
      "I tonique, II sus-tonique, III médiante, IV sous-dominante, V dominante, VI sus-dominante, VII sensible.",
      "La tonique, c'est la maison. La sensible, un demi-ton sous elle, y ramène.",
    ], bloc: DEGRES_DO },
    { type: "question", quizId: "q-scales-04" },
    { type: "idee", titre: "Trois piliers : I, IV, V", texte: [
      "Tonique, sous-dominante et dominante organisent l'essentiel de la musique tonale.",
      "Le blues 12 mesures n'utilise qu'eux, et bien des chansons aussi.",
    ] },
    { type: "question", quizId: "q-scales-57" },
    { type: "idee", titre: "La tension du V", texte: [
      "L'accord bâti sur le V contient la sensible, à un demi-ton de la tonique. En Do, Sol contient Si.",
      "L'oreille l'entend comme un déséquilibre qui demande à se résoudre : V → I est la cadence la plus forte.",
    ] },
    { type: "idee", titre: "Parler en degrés", texte: [
      "« I-V-vi-IV » décrit une suite d'accords dans toutes les tonalités (en minuscules, l'accord est mineur). En Do : Do, Sol, Lam, Fa. En Sol : Sol, Ré, Mim, Do.",
      "Entre musiciens, c'est le moyen le plus rapide de se comprendre.",
    ] },
    { type: "a-toi", titre: "Entends la dominante",
      consigne: "Enchaîne Do, Fa, Sol, Do — I, IV, V, I —, quatre coups vers le bas par accord, au clic. Écoute la tension sur Sol et le soulagement au retour sur Do. Puis joue I-V-vi-IV : Do, Sol, Lam, Fa.",
      bloc: { type: "chord_diagram", caption: "Sol — le V de Do majeur, la dominante", data: { name: "G", frets: [3,2,0,0,0,3], fingers: [2,1,0,0,0,3], startFret: 1 } },
      bpm: 60, minuteur: 120 },
    { type: "question", quizId: "q-scales-58" },
    { type: "recap", points: [
      "Degrés I à VII : le numéro reste, la note change avec la tonalité.",
      "I tonique, IV sous-dominante, V dominante : les trois piliers.",
      "VII, la sensible, est à un demi-ton sous la tonique et y ramène.",
    ] },
  ],
  quiz: ["q-scales-04","q-scales-57","q-scales-58"],
};

export const quiz = [
  {id:"q-scales-04",courseId:"scales",lessonId:"scales-c2-03",lvl:3,q:"Quelle est la fonction du 7e degré dans une gamme majeure ?",o:["Sensible","Tonique","Dominante","Sus-dominante"],a:0,exp:"VII = sensible. Note distante d'1 demi-ton de la tonique, qui crée une attraction forte vers I. En Do : Si attire vers Do. Source de la cadence dominante.",xp:40},
  {id:"q-scales-57",courseId:"scales",lessonId:"scales-c2-03",lvl:2,q:"En Sol majeur, quels sont les trois degrés piliers I, IV et V ?",o:["Sol, Do, Ré","Sol, Si, Ré","Sol, Do, Mi","Sol, La, Ré"],a:0,exp:"Sol majeur : Sol (I), La (II), Si (III), Do (IV), Ré (V), Mi (VI), Fa# (VII). Tonique Sol, sous-dominante Do, dominante Ré.",xp:40},
  {id:"q-scales-58",courseId:"scales",lessonId:"scales-c2-03",lvl:2,q:"En Fa majeur, quelle note est la sensible ?",o:["Mi","Mi♭","Si♭","Do"],a:0,exp:"Fa majeur : Fa Sol La Si♭ Do Ré Mi. Le VIIe degré, Mi, est à un demi-ton sous la tonique : c'est la sensible, qui « tire » vers Fa. Mi♭ serait un ton entier en dessous.",xp:40},
];
