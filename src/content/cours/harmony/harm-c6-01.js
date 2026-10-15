// Leçon du module « harmony » + les questions de quiz qui s'y rattachent.
// Format décrit dans src/content/README.md.

export default {
  id: "harm-c6-01", level: 7,
  title: "I-IV-V : le blues et le rock",
  duration: 10,
  gropiTip: "Astuce de manche : I = barré avec la fondamentale sur la corde 6, IV = même case mais fondamentale sur la corde 5, V = deux cases plus loin sur la corde 5. En La : cases 5, 5 et 7.",
  content: [
    { type: "p", text: "I-IV-V est la progression la plus ancienne, la plus universelle, et la plus jouée dans l'histoire de la musique populaire. Blues, rock'n'roll, country, folk, R&B — ils reposent tous sur cette fondation à 3 accords. La comprendre, c'est comprendre l'ADN de la musique populaire depuis 100 ans." },
    { type: "h", text: "La formule" },
    { type: "p", text: "I = tonique (repos). IV = sous-dominante (mouvement). V = dominante (tension). Enchaîné : I → IV (ça part) → V (ça tend) → I (ça résout). Ce cycle éternel de départ-tension-retour est la base du storytelling musical. En La : La (I) - Ré (IV) - Mi (V)." },
    { type: "h", text: "Le blues 12 mesures" },
    { type: "p", text: "La forme la plus emblématique de I-IV-V : le blues à 12 mesures. Structure standard en La : 4 mesures de I (La7), 2 mesures de IV (Ré7), 2 mesures de I (La7), 1 mesure de V (Mi7), 1 mesure de IV (Ré7), 2 mesures de I (La7). Cette grille de 12 mesures est la base de milliers de chansons blues, rock'n'roll, et jazz." },
    { type: "h", text: "Pourquoi des accords 7 dans le blues" },
    { type: "p", text: "Dans un blues standard, le I, IV et V sont souvent des accords de dominante (X7) même si ce n'est pas 'justifié' harmoniquement (en Do majeur, le I devrait être Imaj7, pas I7). C'est une licence harmonique du blues : utiliser des accords 7 sur tous les degrés donne ce son 'rough', tendu, expressif. C'est la signature sonore du blues." },
    {
      type: "chord_diagram",
      caption: "A7 — I7 du blues en La (0 0 2 0 2 0)",
      data: { name: "A7 (I)", frets: [0,0,2,0,2,0], fingers: [0,0,2,0,3,0], startFret: 1 },
    },
    {
      type: "chord_diagram",
      caption: "D7 — IV7 du blues en La (× × 0 2 1 2)",
      data: { name: "D7 (IV)", frets: [-1,-1,0,2,1,2], fingers: [0,0,0,2,1,3], startFret: 1 },
    },
    {
      type: "chord_diagram",
      caption: "E7 — V7 du blues en La (0 2 0 1 0 0)",
      data: { name: "E7 (V)", frets: [0,2,0,1,0,0], fingers: [0,2,0,1,0,0], startFret: 1 },
    },
    { type: "h", text: "I-IV-V en rock'n'roll" },
    { type: "p", text: "'Johnny B. Goode' (Chuck Berry), 'Rock Around the Clock' (Bill Haley), 'Hound Dog' (Elvis), 'La Bamba' (Ritchie Valens) — toutes ces chansons iconiques = I-IV-V. La progression est si puissante qu'elle a lancé une révolution musicale dans les années 50. Avec 3 accords appris en 10 minutes, tu peux jouer des centaines de classiques." },
    { type: "h", text: "I-IV-V en country et folk" },
    { type: "p", text: "La country et le folk américain reposent massivement sur I-IV-V. Beaucoup de chansons s'y limitent, d'autres l'enrichissent d'un accord vi (relatif mineur). La guitare acoustique, la voix, 3 accords : c'est la définition du folk." },
    { type: "h", text: "Variations de I-IV-V" },
    { type: "p", text: "La progression évolue selon les genres. Blues rapide : I-IV-V-IV en boucle (au lieu de revenir au I). Quick change : passage rapide par IV en mesure 2 (I-IV-I-I-IV-IV-I-I-V-IV-I-I). Turnaround : fin de grille qui revient au début via V-IV-I ou ii-V-I. Ces variations enrichissent le blues classique." },
    { type: "ref", text: "'Sweet Home Chicago' (Robert Johnson, 1936) est le blues I-IV-V par excellence en Mi. 80 ans plus tard, 'Pride and Joy' (Stevie Ray Vaughan) utilise exactement la même structure harmonique en Mi. L'ossature harmonique n'a pas changé, mais l'expression musicale a évolué. C'est ça la transmission musicale." },
    { type: "tip", text: "Drill I-IV-V : dans 5 tonalités différentes (La, Mi, Ré, Sol, Do), trouve les 3 accords I-IV-V et joue-les en boucle à un tempo de blues (80 BPM). Improvise par-dessus avec la pentatonique de la tonalité. En 30 minutes, tu joues un blues convaincant dans 5 tonalités." },
  ],
  quiz: ["q-harm-35", "q-harm-36", "q-harm-37", "q-harm-14"],
};

export const quiz = [
  {id:"q-harm-35",courseId:"harmony",lessonId:"harm-c6-01",lvl:1,q:"En La, quels sont les accords I, IV et V ?",o:["La - Ré - Mi","La - Do - Mi","La - Ré - Fa#","La - Sol - Ré"],a:0,exp:"Gamme de La majeur : La (I), Si, Do#, Ré (IV), Mi (V)… Donc La - Ré - Mi.",xp:30},
  {id:"q-harm-36",courseId:"harmony",lessonId:"harm-c6-01",lvl:1,q:"Dans un blues 12 mesures standard, combien de mesures de I au début ?",o:["2","4","1","8"],a:1,exp:"4 mesures de I, 2 de IV, 2 de I, 1 de V, 1 de IV, 2 de I.",xp:30},
  {id:"q-harm-37",courseId:"harmony",lessonId:"harm-c6-01",lvl:2,q:"Pourquoi I, IV et V sont-ils souvent des accords 7 dans un blues ?",o:["C'est la règle de la gamme majeure","Pour éviter les accords barrés","C'est une licence propre au blues","Parce que la basse joue la 7e"],a:2,exp:"En Do majeur, le I « devrait » être Cmaj7 : jouer des accords 7 sur tous les degrés est une licence du blues, qui fait toute sa couleur.",xp:40},
];
