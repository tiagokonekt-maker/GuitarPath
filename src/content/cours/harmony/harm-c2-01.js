// Leçon du module « harmony » + les questions de quiz qui s'y rattachent.
// Format décrit dans src/content/README.md.

export default {
  id: "harm-c2-01", level: 5,
  title: "Les 4 types de triades",
  duration: 11,
  content: [
    { type: "p", text: "Une triade, c'est 3 notes empilées par tierces (1-3-5). C'est l'unité de base de l'harmonie tonale. Il existe 4 types de triades, chacun avec sa couleur sonore unique. Les maîtriser, c'est comprendre la structure de tous les accords que tu joueras dans ta vie." },
    { type: "h", text: "Triade majeure (1-3-5)" },
    { type: "p", text: "Tierce majeure (4 demi-tons) + quinte juste (7 demi-tons depuis la fondamentale). Couleur : brillante, joyeuse, stable, affirmative. C'est l'accord 'par défaut' de la musique populaire occidentale. Exemples sur guitare : Do (Do-Mi-Sol), Sol (Sol-Si-Ré), La (La-Do#-Mi)." },
    { type: "h", text: "Triade mineure (1-♭3-5)" },
    { type: "p", text: "Tierce mineure (3 demi-tons) + quinte juste (7 demi-tons). Couleur : mélancolique, introspective, douce-amère. Différence avec le majeur : 1 seul demi-ton d'écart sur la tierce. Et pourtant, l'effet émotionnel est radicalement différent. Exemples : Lam (La-Do-Mi), Rém (Ré-Fa-La), Mim (Mi-Sol-Si)." },
    { type: "h", text: "Triade diminuée (1-♭3-♭5)" },
    { type: "p", text: "Tierce mineure (3 demi-tons) + quinte diminuée (6 demi-tons). Couleur : instable, tendue, 'diabolique'. La quinte est diminuée (d'un demi-ton par rapport à la quinte juste), ce qui crée une forte dissonance. Cette triade n'est pas agréable tenue longtemps — elle 'demande' à se résoudre. Elle apparaît naturellement sur le 7e degré de la gamme majeure." },
    { type: "h", text: "Triade augmentée (1-3-#5)" },
    { type: "p", text: "Tierce majeure (4 demi-tons) + quinte augmentée (8 demi-tons). Couleur : flottante, mystérieuse, ambiguë. La quinte est augmentée d'un demi-ton. Cet accord est 'symétrique' : tu peux l'empiler à l'infini par tierces majeures et revenir à la même structure. Très utilisée dans la musique impressionniste (Debussy, Ravel) et le jazz moderne." },
    { type: "h", text: "Comment les reconnaître à l'oreille" },
    { type: "p", text: "Majeure : brillant, stable. 'Joyeux'. Mineure : doux, mélancolique. 'Triste'. Diminuée : tendu, instable. 'Anxieux'. Augmentée : flottant, ambigu. 'Mystérieux'. Ces qualificatifs sont des raccourcis — en réalité, la perception dépend toujours du contexte. Mais ils sont utiles pour commencer à identifier les qualités d'accord." },
    { type: "h", text: "Récapitulatif des formules" },
    { type: "p", text: "Majeure : 1-3-5 (4+3 demi-tons entre les tierces). Mineure : 1-♭3-5 (3+4 demi-tons). Diminuée : 1-♭3-♭5 (3+3 demi-tons). Augmentée : 1-3-#5 (4+4 demi-tons). Le pattern de demi-tons entre les tierces résume tout : 4+3 = maj, 3+4 = min, 3+3 = dim, 4+4 = aug." },
    {
      type: "chord_diagram",
      caption: "La majeur — triade majeure ouverte (1-3-5)",
      data: { name: "A", frets: [-1,0,2,2,2,0], fingers: [0,0,1,2,3,0], startFret: 1 },
    },
    {
      type: "chord_diagram",
      caption: "La mineur — triade mineure ouverte (1-♭3-5)",
      data: { name: "Am", frets: [0,0,2,2,1,0], fingers: [0,0,2,3,1,0], startFret: 1 },
    },
    {
      type: "chord_diagram",
      caption: "Si diminué — triade diminuée (1-♭3-♭5)",
      data: { name: "Bdim", frets: [-1,2,3,4,3,-1], fingers: [0,1,2,4,3,0], startFret: 1 },
    },
    { type: "ref", text: "Pour entendre chaque type dans un contexte réel : 'Happy Birthday' (majeur), 'Scarborough Fair' (mineur), le passage entre les accords dans 'Hark the Herald Angels Sing' (diminué en transition), 'Oh ! You Pretty Things' de David Bowie commence sur un accord augmenté. Écoute ces passages et identifie la couleur." },
    { type: "tip", text: "Drill des 4 types : depuis Do (c5 case 3), joue successivement : Do majeur (Do-Mi-Sol), Do mineur (Do-Mib-Sol), Do diminué (Do-Mib-Solb), Do augmenté (Do-Mi-Sol#). Écoute la progression de couleur : de brillant à sombre à tendu à flottant. 4 accords, 4 univers." },
  ],
  quiz: ["q-harm-01","q-harm-02","q-harm-03","q-harm-04","q-impro-22"],
};

export const quiz = [
  {id:"q-harm-01",courseId:"harmony",lessonId:"harm-c2-01",lvl:1,q:"Une triade majeure se compose de…",o:["1-3-5","1-♭3-5","1-3-♭5","1-2-5"],a:0,exp:"Triade majeure : fondamentale + tierce majeure (4dt) + quinte juste (7dt). Formule 1-3-5. C'est la triade de référence.",xp:25},
  {id:"q-harm-02",courseId:"harmony",lessonId:"harm-c2-01",lvl:2,q:"Une triade diminuée se compose de…",o:["1-3-5","1-♭3-♭5","1-♭3-5","1-3-#5"],a:1,exp:"Diminuée = 1-♭3-♭5. Tierce mineure (3dt) + quinte diminuée (6dt). Très instable. Trouvée sur le 7e degré de la gamme majeure.",xp:35},
  {id:"q-harm-03",courseId:"harmony",lessonId:"harm-c2-01",lvl:2,q:"Quelles notes forment l'accord de Si majeur ?",o:["Si-Ré-Fa#","Si-Ré-Fa","Si-Ré#-Fa#","Si-Ré#-Fa"],a:2,exp:"Si majeur = Si + (Si+4dt = Ré#) + (Si+7dt = Fa#). Notes : Si-Ré#-Fa#. Triade majeure classique.",xp:40},
  {id:"q-harm-04",courseId:"harmony",lessonId:"harm-c2-01",lvl:3,q:"Une triade augmentée a quelle particularité ?",o:["Sa fondamentale est doublée à l'octave", "Elle contient 4 notes au lieu de 3", "Sa tierce est mineure au lieu de majeure", "Sa quinte est augmentée d'un demi-ton"],a:3,exp:"Augmentée = 1-3-#5. Quinte augmentée (8dt au lieu de 7dt). Symétrique : on peut empiler des tierces majeures à l'infini. Aug = Caug = Eaug = Lab aug (mêmes notes, fondamentales différentes).",xp:50},
  {id:"q-impro-22",courseId:"impro",lessonId:"harm-c2-01",lvl:2,q:"Pendant un solo, poser une note de l'accord en cours produit…",o:["Une tension à résoudre","Une sensation de stabilité","Une dissonance marquée","Un effet de surprise"],a:1,exp:"Les notes de l'accord sont les points de repos. Celles qui n'en font pas partie créent du mouvement. Savoir alterner les deux est la mécanique de base du phrasé, bien avant tout vocabulaire.",xp:30},
];
