// Leçon du module « harmony » + les questions de quiz qui s'y rattachent.
// Format « leçon en cartes » décrit dans src/content/README.md.

export default {
  id: "harm-c2-04", level: 6,
  title: "Les inversions de triades et leur usage",
  duration: 8,
  gropiTip: "Joue Do, puis Sol/Si (x20003), puis Lam : grâce à la 1re inversion de Sol, la basse descend Do-Si-La par degrés conjoints. Un enchaînement très courant à garder sous les doigts.",
  cartes: [
    { type: "idee", titre: "État fondamental : 1 à la basse", texte: [
      "Une triade peut se ranger de trois façons. La position « normale » met la fondamentale au grave : Do, Mi, Sol.",
      "L'accord sonne stable, ancré. C'est celle que tu plaques le plus souvent.",
    ], bloc: {
      type: "chord_diagram",
      caption: "Do maj — état fondamental (Do en basse, corde 5 case 3)",
      data: { name: "C", frets: [-1,3,2,0,1,0], fingers: [0,3,2,0,1,0], startFret: 1 },
    } },
    { type: "idee", titre: "1re inversion : 3 à la basse", texte: [
      "La tierce passe au grave : Mi, Sol, Do. On l'écrit Do/Mi, « Do avec Mi à la basse ».",
      "Le son est plus ouvert, moins affirmé. Sur ton Do ouvert, il suffit de laisser sonner la corde 6 à vide.",
    ], bloc: {
      type: "chord_diagram",
      caption: "Do/Mi — 1ère inversion (Mi en basse, corde 6 à vide)",
      data: { name: "C/E", frets: [0,3,2,0,1,0], fingers: [0,3,2,0,1,0], startFret: 1 },
    } },
    { type: "question", quizId: "q-harm-28" },
    { type: "idee", titre: "2e inversion : 5 à la basse", texte: [
      "La quinte passe au grave : Sol, Do, Mi, noté Do/Sol.",
      "C'est la moins stable des trois : la quinte à la basse crée une légère tension. On l'emploie surtout comme accord de passage.",
    ], bloc: {
      type: "chord_diagram",
      caption: "Do/Sol — 2e inversion (Sol en basse, corde 6 case 3 ou corde 4 à vide)",
      data: { name: "C/G", frets: [3,3,2,0,1,0], fingers: [3,4,2,0,1,0], startFret: 1 },
    } },
    { type: "question", quizId: "q-harm-p6-c204-01" },
    { type: "idee", titre: "Le voice-leading", texte: [
      "Passer d'un accord à l'autre en bougeant le moins possible : on garde les notes communes, on déplace les autres d'un ton ou d'un demi-ton.",
      "Dans Do - Sol - Lam - Fa, la basse saute Do → Sol → La. Avec Sol/Si, elle descend Do → Si → La : une vraie ligne mélodique.",
    ] },
    { type: "idee", titre: "Trois cordes suffisent", texte: [
      "Pour travailler les inversions, les triades sur trois cordes aiguës sont l'outil idéal.",
      "Do sur les cordes 3, 2 et 1 : corde 3 à vide, corde 2 case 1, corde 1 à vide donnent Sol, Do, Mi. Sol à la basse : 2e inversion.",
    ] },
    { type: "a-toi", titre: "La basse qui descend",
      consigne: "Enchaîne Do, Sol/Si, Lam, puis Fa (ou Fmaj7, xx3210), une mesure chacun, quatre coups au clic. Écoute la basse : Do, Si, La. Rejoue ensuite avec un Sol normal et compare.",
      bloc: { type: "chord_diagram", caption: "Sol/Si — x20003 : Sol en 1re inversion, Si à la basse", data: { name: "G/B", frets: [-1,2,0,0,0,3], fingers: [0,2,0,0,0,3], startFret: 1 } },
      bpm: 60 },
    { type: "question", quizId: "q-harm-58" },
    { type: "recap", points: [
      "État fondamental : 1 à la basse ; 1re inversion : 3 ; 2e inversion : 5.",
      "Do/Mi se lit « Do avec Mi à la basse ».",
      "Les inversions servent le voice-leading : Do → Sol/Si → Lam fait descendre la basse.",
    ] },
  ],
  quiz: ["q-harm-28", "q-harm-29", "q-harm-58", "q-harm-p6-c204-01"],
};

export const quiz = [
  {id:"q-harm-28",courseId:"harmony",lessonId:"harm-c2-04",lvl:1,q:"Dans une 1ère inversion, quelle note de l'accord est à la basse ?",o:["La fondamentale", "La quinte", "La septième", "La tierce"],a:3,exp:"1ère inversion = tierce à la basse. Do majeur : Mi - Sol - Do, noté Do/Mi.",xp:30},
  {id:"q-harm-29",courseId:"harmony",lessonId:"harm-c2-04",lvl:2,q:"À quoi servent surtout les inversions dans un enchaînement d'accords ?",o:["À réduire les sauts entre les accords", "À changer la tonalité du morceau", "À rendre chaque accord plus fort et plus riche", "À remplacer les accords mineurs"],a:0,exp:"C'est le voice-leading : on garde les notes communes et on déplace les autres au plus court.",xp:40},
  {id:"q-harm-58",courseId:"harmony",lessonId:"harm-c2-04",lvl:2,q:"Dans Do - Sol - Lam - Fa, quel Sol fait descendre la basse Do → Si → La ?",o:["Sol/Si, 1re inversion","Sol/Ré, 2e inversion","Sol à l'état fondamental","Sol/La, avec la 9e en basse"],a:0,exp:"En 1re inversion, la tierce de Sol (Si) passe à la basse : Do (Do) → Si (Sol/Si) → La (Lam). La basse descend par degrés au lieu de sauter Do → Sol → La.",xp:40},
  {id:"q-harm-p6-c204-01",courseId:"harmony",lessonId:"harm-c2-04",lvl:2,q:"Tu lis l'accord Do/Sol. Que joues-tu ?",o:["Do, en 2e inversion","Do, en 1re inversion","Sol, en 2e inversion","Sol, en 1re inversion"],a:0,exp:"Do/Sol = l'accord de Do avec Sol à la basse. Sol est la quinte de Do : quinte à la basse, c'est la 2e inversion.",xp:35},
];
