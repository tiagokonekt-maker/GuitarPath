// Leçon du module « harmony » + les questions de quiz qui s'y rattachent.
// Format décrit dans src/content/README.md.

export default {
  id: "harm-c3-01", level: 7,
  title: "Pourquoi ajouter une 7e ?",
  duration: 9,
  gropiTip: "Pour trouver la 7e mineure sans calcul, descends d'un ton depuis la fondamentale à l'octave : depuis Do, ça donne Sib. Un demi-ton seulement sous l'octave, c'est la 7e majeure (Si).",
  content: [
    { type: "p", text: "Une triade a 3 notes (1-3-5). Un accord de septième a 4 notes (1-3-5-7). Cette 4e note transforme radicalement la couleur de l'accord : il devient plus riche, plus sophistiqué, plus 'coloré'. Les accords de 7e sont la base du jazz, de la bossa nova, de la soul et de la pop moderne. Ils sont partout dès qu'on cherche un son un peu plus élaboré." },
    { type: "h", text: "La 7e note : laquelle ?" },
    { type: "p", text: "La '7e note' d'un accord est la note à 10 ou 11 demi-tons de la fondamentale (selon qu'elle est mineure ou majeure). Depuis Do : 7e mineure = Sib (10 demi-tons). 7e majeure = Si (11 demi-tons). Cette différence d'un seul demi-ton crée des couleurs très différentes." },
    { type: "h", text: "La 7e majeure : couleur lumineuse et jazz" },
    { type: "p", text: "Cmaj7 = Do-Mi-Sol-Si. La 7e majeure (Si) est à seulement 1 demi-ton de la fondamentale (Do). Cette proximité crée une tension douce, 'romantique', qui résout vers l'octave. Son : lumineux, sophistiqué, jazz, bossa nova. Entendre : la vamp de bossa nova ('Girl from Ipanema' commence sur Fmaj7)." },
    { type: "h", text: "La 7e mineure sur accord mineur : couleur funky" },
    { type: "p", text: "Am7 = La-Do-Mi-Sol. La 7e mineure (Sol) ajoute de la 'douceur' à l'accord mineur. Son : funky, modal, soul, R&B. Entendre : la vamp de 'So What' (Miles Davis) = Dm7 en boucle. Les accords de Am7 sont partout en néo-soul (D'Angelo, Erykah Badu, John Mayer)." },
    { type: "h", text: "La 7e mineure sur accord majeur : la dominante" },
    { type: "p", text: "G7 = Sol-Si-Ré-Fa. C'est l'accord de 'dominante' : majeur + 7e mineure. Il contient un triton (entre Si et Fa = 6 demi-tons), qui crée une forte tension demandant à se résoudre vers Do majeur. Son : tendu, blues, jazz. C'est LE son qui fait avancer la musique tonale." },
    {
      type: "chord_diagram",
      caption: "Cmaj7 — majeur + 7e maj = lumineux, jazz, stable",
      data: { name: "Cmaj7", frets: [-1,3,2,0,0,0], fingers: [0,3,2,0,0,0], startFret: 1 },
    },
    {
      type: "chord_diagram",
      caption: "Am7 — mineur + 7e min = doux, funky, modal",
      data: { name: "Am7", frets: [0,0,2,0,1,0], fingers: [0,0,2,0,1,0], startFret: 1 },
    },
    {
      type: "chord_diagram",
      caption: "G7 — majeur + 7e min = tendu, blues, dominant",
      data: { name: "G7", frets: [3,2,0,0,0,1], fingers: [3,2,0,0,0,1], startFret: 1 },
    },
    { type: "h", text: "Pourquoi les accords de 7e sonnent 'plus riches'" },
    { type: "p", text: "Deux raisons. D'abord acoustique : ajouter une 4e harmonique enrichit le spectre sonore (plus de 'couleur'). Ensuite fonctionnel : la 7e ajoute une tension directionnelle à l'accord. L'accord sait 'où il veut aller'. Un Do majeur simple est stable, fermé. Un Cmaj7 est stable mais avec une légère invitation à continuer." },
    { type: "ref", text: "'Autumn Leaves' (standard de jazz, 1945) : toute la progression utilise des accords de 7e (Am7-D7-Gmaj7-Cmaj7...). Sans les 7e, le morceau sonnerait 'enfantin'. Avec les 7e, il sonne adulte, sophistiqué, musical. Le même principe s'applique à n'importe quelle chanson pop : remplace les triades par des 7e et tu obtiens instantanément un son plus moderne." },
    { type: "tip", text: "Test simple : prends une chanson pop (par ex I-V-vi-IV en Do). Joue-la d'abord avec des triades simples (C-G-Am-F). Puis joue-la avec des 7e (Cmaj7-G7-Am7-Fmaj7). Entends la différence de sophistication. Les 7e te coûtent souvent juste 1 doigt supplémentaire, mais la différence sonore est énorme." },
  ],
  quiz: ["q-harm-32", "q-harm-33", "q-harm-34"],
};

export const quiz = [
  {id:"q-harm-32",courseId:"harmony",lessonId:"harm-c3-01",lvl:1,q:"Depuis Do, combien de demi-tons séparent la fondamentale de sa 7e mineure (Sib) ?",o:["9", "10", "11", "12"],a:1,exp:"7e mineure = 10 demi-tons (Do → Sib). La 7e majeure en fait 11 (Do → Si) : un seul demi-ton d'écart, deux couleurs très différentes.",xp:30},
  {id:"q-harm-33",courseId:"harmony",lessonId:"harm-c3-01",lvl:2,q:"Qu'est-ce qui définit un accord de dominante, comme G7 ?",o:["Triade mineure + 7e mineure", "Triade majeure + 7e majeure", "Triade majeure + 7e mineure", "Triade diminuée + 7e mineure"],a:2,exp:"Dominante = triade majeure + 7e mineure : G7 = Sol-Si-Ré-Fa.",xp:40},
  {id:"q-harm-34",courseId:"harmony",lessonId:"harm-c3-01",lvl:2,q:"Pourquoi G7 appelle-t-il une résolution vers Do ?",o:["Il n'a pas de quinte juste", "Sa fondamentale est plus grave", "Il contient une 7e majeure", "Il contient un triton (Si-Fa)"],a:3,exp:"Si et Fa sont séparés de 6 demi-tons : un triton, l'intervalle le plus instable. Il se résout naturellement vers Do-Mi.",xp:40},
];
