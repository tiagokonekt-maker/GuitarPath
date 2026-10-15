// Leçon du module « harmony » + les questions de quiz qui s'y rattachent.
// Format décrit dans src/content/README.md.

export default {
  id: "harm-c4-01", level: 9,
  title: "La 9e, la 11e, la 13e : les extensions",
  duration: 10,
  content: [
    { type: "p", text: "On a vu les triades (1-3-5) et les accords de 7e (1-3-5-7). Mais on peut aller plus loin : ajouter une 9e, une 11e, ou une 13e. Ces notes supplémentaires s'appellent des 'extensions' — elles enrichissent la couleur de l'accord sans en changer la fonction fondamentale. C'est le territoire du jazz avancé, de la bossa nova et de la soul moderne." },
    { type: "h", text: "Comment compter les extensions" },
    { type: "p", text: "Les extensions continuent la série des tierces au-delà de la 7e. 9e = 2e une octave plus haut. 11e = 4e une octave plus haut. 13e = 6e une octave plus haut. Concrètement : Cmaj9 = Do-Mi-Sol-Si-Ré. C11 = Do-Mi-Sol-Sib-Ré-Fa. C13 = Do-Mi-Sol-Sib-Ré-Fa-La. En théorie, tu empiles jusqu'à 7 notes. En pratique, on en choisit 3 à 5 selon la couleur voulue." },
    { type: "h", text: "La 9e : l'extension la plus utilisée" },
    { type: "p", text: "Maj9 (1-3-5-7-9) : Cmaj9 = Do-Mi-Sol-Si-Ré. Couleur : encore plus lumineux que Maj7. m9 (1-♭3-5-♭7-9) : Dm9 = Ré-Fa-La-Do-Mi. Couleur : doux, chaud. 9 (dominante, 1-3-5-♭7-9) : G9 = Sol-Si-Ré-Fa-La. Couleur : blues sophistiqué. La 9e est souvent 'libre' — tu peux l'ajouter à presque n'importe quel accord pour le sophistiquer légèrement." },
    { type: "h", text: "La 11e : la quarte à l'octave" },
    { type: "p", text: "La 11e est délicate : sur un accord Maj7, le 11 naturel (= quarte juste) crée une dissonance avec la 3e (1 demi-ton d'écart). On utilise plutôt le #11 (quarte augmentée = lydien !) sur les Maj7 : Cmaj7#11 = Do-Mi-Sol-Si-Fa#. Couleur : lydienne, mystérieuse. Sur les accords m7, le 11 naturel passe sans problème : Dm11 = Ré-Fa-La-Do-Mi-Sol." },
    { type: "h", text: "La 13e : la sixte à l'octave" },
    { type: "p", text: "G13 = Sol-Si-Ré-Fa-La-Do-Mi (7 notes en théorie). En pratique, on joue fondamentale + 3e + 7e + 13e (4 notes). G13 voicing pratique = Sol-Si-Fa-Mi (en omettant quinte, 9e, 11e). Couleur : dominante très riche, jazz. La 13e (= 6e) est présente dans beaucoup d'accords jazz-funk." },
    { type: "h", text: "Les altérations de tensions" },
    { type: "p", text: "On peut aussi altérer les extensions : ♭9 (9e bémolisée), #9 (9e augmentée = 'Hendrix chord'), #11 (11e augmentée = lydien), ♭13 (13e bémolisée). Ces extensions altérées donnent des couleurs encore plus sophistiquées. L'accord 7#9 (1-3-5-♭7-#9) est l'accord de 'Purple Haze' : il combine tierce majeure ET tierce mineure (enharmonique de #9), créant une ambiguïté majeur/mineur explosive." },
    { type: "h", text: "Sur la guitare : jouer les extensions" },
    { type: "p", text: "Les extensions sont souvent ajoutées en remplaçant une note existante par l'extension (ex : remplacer la quinte par la 9e). Sur la guitare, avec 4-5 doigts, on choisit les notes les plus importantes de l'accord : fondamentale + 3e + 7e + extension principale. Les 4 meilleures notes selon l'effet voulu." },
    {
      type: "chord_diagram",
      caption: "Am9 — Am7 + 9e (Si) : × 0 5 5 0 0 = La Sol Do Si Mi. Doux, chaleureux, néo-soul",
      data: { name: "Am9", frets: [-1,0,5,5,0,0], fingers: [0,0,1,2,0,0], startFret: 4 },
    },
    {
      type: "chord_diagram",
      caption: "Gmaj9 — Gmaj7 + 9e (La) : lumineux, jazz/bossa",
      data: { name: "Gmaj9", frets: [3,0,0,0,0,2], fingers: [2,0,0,0,0,1], startFret: 1 },
    },
    { type: "ref", text: "'Purple Haze' (Jimi Hendrix, 1967) : le riff utilise un accord E7#9 (Mi7 avec 9e augmentée). Le Sol# (3e majeure) et le Sol naturel (#9 = enharmonique de lab ≈ sol) coexistent, créant l'ambiguïté majeur/mineur si caractéristique du son psychédélique Hendrix. Un seul accord, un son reconnaissable en 1 seconde." },
    { type: "tip", text: "Commence avec une seule extension : ajoute une 9e à tes accords habituels. Dm → Dm9 (ajouter Mi). Gmaj7 → Gmaj9 (ajouter La). Am7 → Am9 (ajouter Si). Ces petites modifications raffinent immédiatement ton son sans complexifier ton jeu." },
  ],
  quiz: ["q-harm-23","q-harm-13","q-harm-16"],
};

export const quiz = [
  {id:"q-harm-23",courseId:"harmony",lessonId:"harm-c4-01",lvl:3,q:"L'accord G13 contient combien de notes différentes ?",o:["4","5","6","7"],a:2,exp:"G13 = 1-3-5-♭7-9-11-13 = Sol-Si-Ré-Fa-La-Do-Mi. 7 notes en théorie. En pratique on omet souvent la 5 et la 11. Voicing usuel = 6 notes : Sol-Si-Fa-La-Do-Mi.",xp:60},
];
