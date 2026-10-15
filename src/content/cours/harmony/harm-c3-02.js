// Leçon du module « harmony » + les questions de quiz qui s'y rattachent.
// Format décrit dans src/content/README.md.

export default {
  id: "harm-c3-02", level: 7,
  title: "Les 5 types d'accords de septième",
  duration: 12,
  gropiTip: "Pars de Cmaj7 et baisse une note d'un demi-ton à chaque fois : la 7e (C7), puis la tierce (Cm7), puis la quinte (Cm7b5), puis encore la 7e (Cdim7). Les 5 types en un seul chemin.",
  content: [
    { type: "p", text: "Il existe 5 types fondamentaux d'accords de septième. Chacun a une couleur unique et un usage spécifique en harmonie. Maîtriser ces 5 types, c'est avoir accès à la grande majorité des accords que tu rencontreras en pop, rock, jazz, bossa et soul." },
    { type: "h", text: "1. Accord Maj7 — le rêveur" },
    { type: "p", text: "Formule : 1-3-5-7 (majeur + 7e majeure). Cmaj7 = Do-Mi-Sol-Si. Couleur : lumineux, romantique, jazzy, bossa. 'Rêveur'. Utilisation : sur le I (tonique) et le IV en tonalité majeure. C'est l'accord qui commence beaucoup de ballades jazz et bossa nova." },
    { type: "h", text: "2. Accord m7 — le méditatif" },
    { type: "p", text: "Formule : 1-♭3-5-♭7 (mineur + 7e mineure). Am7 = La-Do-Mi-Sol. Couleur : doux, modal, funky, méditatif. 'Groove décontracté'. Utilisation : sur le ii et le vi en tonalité majeure, sur le I en tonalité modale. Base du jazz, du funk, de la bossa." },
    { type: "h", text: "3. Accord 7 (dominante) — le moteur" },
    { type: "p", text: "Formule : 1-3-5-♭7 (majeur + 7e mineure). G7 = Sol-Si-Ré-Fa. Couleur : tendu, blues, 'qui veut avancer'. 'Motoriste'. Utilisation : sur le V en tonalité majeure ou mineure. C'est l'accord de tension par excellence : il contient un triton et veut se résoudre vers le I." },
    { type: "h", text: "4. Accord m7b5 — le demi-diminué" },
    { type: "p", text: "Formule : 1-♭3-♭5-♭7 (mineur + quinte diminuée + 7e mineure). Bm7b5 = Si-Ré-Fa-La. Couleur : instable, sophistiqué, 'jazzy sombre'. Aussi appelé 'half-diminished'. Utilisation : sur le ii d'une cadence en tonalité mineure (ii-V-i). Très présent dans les standards de jazz." },
    { type: "h", text: "5. Accord dim7 — le passeur" },
    { type: "p", text: "Formule : 1-♭3-♭5-𝄫7 (triade diminuée + 7e doublement bémolisée, qui sonne comme une 6te). Cdim7 = Do-Mib-Solb-Si𝄫 (enharmonique de La : on le joue sur la case du La). Couleur : ultra-tendu, dramatique, 'qui passe'. Utilisation : comme accord de transition, jamais comme point de repos. Sa symétrie (toutes les notes à 3 demi-tons d'écart) le rend transposable à lui-même tous les 3 demi-tons." },
    { type: "h", text: "Tableau récapitulatif" },
    { type: "p", text: "Maj7 (1-3-5-7) : lumineux, tonique/IV en majeur. m7 (1-♭3-5-♭7) : doux, ii/vi en majeur ou I modal. 7 dom (1-3-5-♭7) : tendu, V partout. m7b5 (1-♭3-♭5-♭7) : instable, ii en mineur. dim7 (1-♭3-♭5-bb7) : ultra-tendu, transition. Ces 5 types couvrent toute l'harmonie tonale classique et jazz." },
    { type: "h", text: "Le triton dans la dominante" },
    { type: "p", text: "Ce qui rend l'accord de dominante (X7) si puissant : il contient toujours un triton entre sa 3e et sa 7e. Dans G7 : Si (3e) → Fa (7e) = 6 demi-tons = triton. Ce triton est l'intervalle le plus dissonant. Il crée une tension irrésistible vers la résolution. Si → Do (monte d'un demi-ton). Fa → Mi (descend d'un demi-ton). Ces 2 mouvements de demi-ton vers le I est ce qui rend V7→I si satisfaisant." },
    {
      type: "chord_diagram",
      caption: "Fmaj7 — accord Maj7 (× × 3 2 1 0)",
      data: { name: "Fmaj7", frets: [-1,-1,3,2,1,0], fingers: [0,0,3,2,1,0], startFret: 1 },
    },
    {
      type: "chord_diagram",
      caption: "Em7 — accord m7 (0 2 2 0 3 0)",
      data: { name: "Em7", frets: [0,2,2,0,3,0], fingers: [0,2,3,0,4,0], startFret: 1 },
    },
    {
      type: "chord_diagram",
      caption: "D7 — accord dominante (× × 0 2 1 2)",
      data: { name: "D7", frets: [-1,-1,0,2,1,2], fingers: [0,0,0,2,1,3], startFret: 1 },
    },
    { type: "ref", text: "Pour entendre les 5 types dans un standard : 'All The Things You Are' (Jerome Kern, 1939) contient les 5 types d'accords de 7e dans ses 36 premières mesures. C'est pourquoi ce morceau est considéré comme l'un des meilleurs 'exercices' d'harmonie pour les jazzmen. Écoute une version piano solo pour entendre clairement chaque couleur." },
    { type: "tip", text: "Drill 'reconnaissance' : joue successivement Cmaj7 (Do-Mi-Sol-Si), Cm7 (Do-Mib-Sol-Sib), C7 (Do-Mi-Sol-Sib), Cm7b5 (Do-Mib-Solb-Sib), Cdim7 (Do-Mib-Solb-Si𝄫, qui sonne La). Nomme chaque type à voix haute en le jouant. Puis joue-les les yeux fermés et identifie-les par l'oreille. En 2 semaines, tu les distingues à l'écoute." },
  ],
  quiz: ["q-harm-05","q-harm-06","q-harm-08","q-logic-09","q-fret-harm-03","q-fret-harm-04","q-fret-harm-05","q-logic-04","q-harm-02"],
};

export const quiz = [
  {id:"q-harm-05",courseId:"harmony",lessonId:"harm-c3-02",lvl:1,q:"Un accord m7 (mineur 7) contient les degrés…",o:["1-♭3-5-♭7","1-3-5-7","1-3-5-♭7","1-♭3-5-7"],a:0,exp:"m7 = mineur + septième mineure = 1-♭3-5-♭7. Son funk, modal, jazz. Ex : Am7 = La-Do-Mi-Sol.",xp:30},
  {id:"q-harm-06",courseId:"harmony",lessonId:"harm-c3-02",lvl:2,q:"Quel accord contient Sol-Si-Ré-Fa ?",o:["Gmaj7","G7","Gm7","Gm7b5"],a:1,exp:"Sol-Si-Ré-Fa = 1-3-5-♭7 (Fa = 7e mineure de Sol). Donc G7 (dominante). Si c'était Fa#, ce serait Gmaj7.",xp:40},
  {id:"q-harm-08",courseId:"harmony",lessonId:"harm-c3-02",lvl:3,q:"Quelle est la différence entre m7b5 et dim7 ?",o:["Aucune, ce sont deux noms du même accord", "La quinte : juste pour l'un, diminuée pour l'autre", "La fondamentale, un demi-ton plus haut", "La 7e : mineure pour m7♭5, diminuée pour dim7"],a:3,exp:"m7b5 = 1-♭3-♭5-♭7. dim7 = 1-♭3-♭5-bb7 (= 6 enharmonique). Sur Si : Bm7b5 = Si-Ré-Fa-La. Bdim7 = Si-Ré-Fa-Lab.",xp:55},
  {id:"q-logic-09",courseId:"harmony",lessonId:"harm-c3-02",lvl:3,q:"Pourquoi un accord 7 dominante crée-t-il plus de tension qu'un accord majeur simple ?",o:["Le triton entre sa 3e et sa ♭7", "Le hasard de la construction", "Il contient plus de notes qu'un maj7", "Il se joue plus fort"],a:0,exp:"G7 = Sol-Si-Ré-Fa. Si→Fa = 6 demi-tons = TRITON. Cet intervalle dissonant 'demande' à résoudre. C'est la source de la tension dominante.",xp:65},
  {id:"q-fret-harm-03",type:"fretboard",courseId:"harmony",lessonId:"harm-c3-02",lvl:3,q:"Trouve toutes les notes de Am7 (La Do Mi Sol)",concept:{type:"find_chord",root:"A",quality:"min7"},selectionRules:{mode:"all"},display:{showNotes:false},hint:"Am7 = Am + Sol (7e mineure). 4 notes sur tout le manche.",xp:55,exp:"Am7 : La-Do-Mi-Sol. La 7e mineure Sol est la couleur funk/jazz."},
  {id:"q-fret-harm-04",type:"fretboard",courseId:"harmony",lessonId:"harm-c3-02",lvl:3,q:"Trouve toutes les notes de G7 (Sol Si Ré Fa)",concept:{type:"find_chord",root:"G",quality:"dom7"},selectionRules:{mode:"all"},display:{showNotes:false},hint:"G7 : guide tones = Si (3e) et Fa (7e mineure).",xp:55,exp:"G7 : Sol-Si-Ré-Fa. Si et Fa sont les guide tones qui définissent la tension dominante."},
  {id:"q-fret-harm-05",type:"fretboard",courseId:"harmony",lessonId:"harm-c3-02",lvl:3,q:"Trouve toutes les notes de Cmaj7 (Do Mi Sol Si)",concept:{type:"find_chord",root:"C",quality:"maj7"},selectionRules:{mode:"all"},display:{showNotes:false},hint:"Cmaj7 : guide tones = Mi (3e) et Si (7e majeure).",xp:60,exp:"Cmaj7 : Do-Mi-Sol-Si. La 7e majeure Si (vs Sib de C7) donne la couleur douce."},
];
