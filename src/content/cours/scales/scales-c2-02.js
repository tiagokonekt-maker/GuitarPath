// Leçon du module « scales » + les questions de quiz qui s'y rattachent.
// Format décrit dans src/content/README.md.

export default {
  id: "scales-c2-02", level: 5,
  title: "La gamme majeure : la matrice de tout",
  duration: 12,
  content: [
    { type: "p", text: "Si tu ne devais retenir qu'une seule gamme dans ta vie de musicien, ce serait celle-ci. La gamme majeure n'est pas qu'une gamme parmi d'autres : c'est la matrice à partir de laquelle se déduisent les modes, l'harmonie tonale, et une grande partie de la musique populaire occidentale. La maîtriser, c'est avoir la clé de tout." },
    { type: "h", text: "La formule magique" },
    { type: "p", text: "Ton — Ton — Demi-ton — Ton — Ton — Ton — Demi-ton. Soit en abrégé : T-T-DT-T-T-T-DT. C'est la séquence d'intervalles qui définit la gamme majeure. Peu importe la note de départ : applique cette formule, et tu obtiens une gamme majeure." },
    { type: "h", text: "Construction de Do majeur" },
    { type: "p", text: "Partons de Do. T → Ré. T → Mi. DT → Fa. T → Sol. T → La. T → Si. DT → Do. On retombe sur Do à l'octave. Résultat : Do-Ré-Mi-Fa-Sol-La-Si-Do. Aucune altération ! C'est pour ça que Do majeur est la 'gamme de référence' : elle utilise uniquement les 7 notes naturelles, pas un seul dièse ni bémol." },
    { type: "h", text: "Construction de Sol majeur" },
    { type: "p", text: "Partons de Sol. T → La. T → Si. DT → Do. T → Ré. T → Mi. T → ? Si on monte d'un ton depuis Mi, on arrive à Fa#. (Mi+1 ton = Fa#, car Mi-Fa est déjà un demi-ton naturel). DT → Sol. Résultat : Sol-La-Si-Do-Ré-Mi-Fa#-Sol. Sol majeur a un seul dièse : Fa#. C'est sa 'signature'." },
    { type: "h", text: "Pourquoi cette formule produit du 'majeur'" },
    { type: "p", text: "C'est l'asymétrie des intervalles qui crée le caractère 'lumineux' de la gamme majeure. Les deux demi-tons (entre 3-4 et 7-8) créent des points de tension qui se résolvent vers les notes voisines. Ton oreille perçoit ces résolutions comme une marche logique, satisfaisante. C'est ce qui rend les mélodies majeures 'positives'." },
    { type: "h", text: "Les 12 gammes majeures (cycle des quintes)" },
    { type: "p", text: "Il existe 12 gammes majeures (une par note de la gamme chromatique). Plus la fondamentale est 'éloignée' de Do, plus il y a d'altérations : Do (0), Sol (1#), Ré (2#), La (3#), Mi (4#), Si (5#), Fa# (6#), Do# (7#). Côté bémols : Fa (1♭), Si♭ (2♭), Mi♭ (3♭), La♭ (4♭), Ré♭ (5♭), Sol♭ (6♭). Ce schéma, on l'appelle le 'cycle des quintes'." },
    {
      type: "scale_pattern",
      caption: "Sol majeur pos. 1 — fondamentale case 3, corde 6. Formule T-T-DT-T-T-T-DT",
      data: {
        startFret: 1, endFret: 5,
        rootColor: "green", noteColor: "primary",
        strings: [
          { frets: [3, 5], root: [3] },
          { frets: [2, 3, 5], root: [] },
          { frets: [2, 4, 5], root: [] },
          { frets: [2, 4], root: [] },
          { frets: [1, 3, 5], root: [] },
          { frets: [3, 5], root: [3] },
        ],
        noteMap: {
          "3,0":"Sol","5,0":"La",
          "2,1":"Si","3,1":"Do","5,1":"Ré",
          "2,2":"Mi","4,2":"Fa#","5,2":"Sol",
          "2,3":"La","4,3":"Si",
          "1,4":"Do","3,4":"Ré","5,4":"Mi",
          "3,5":"Sol","5,5":"La",
        }
      },
    },
    { type: "ref", text: "Pour entendre la gamme majeure 'pure' : la mélodie de 'Joy to the World' (chant de Noël) descend toute la gamme majeure du degré 8 au degré 1. C'est un exercice d'écoute parfait. Ou encore, l'intro de 'Let It Be' (The Beatles) est en Do majeur — toutes les notes des couplets viennent de cette gamme." },
    { type: "tip", text: "Sur la guitare, la position la plus pratique pour jouer une gamme majeure se trouve avec la fondamentale sur la corde 6. Ex: Sol majeur, fondamentale case 3 corde 6. Apprends cette 'forme' et tu peux la transposer en glissant le long du manche pour avoir n'importe quelle gamme majeure." },
  ],
  quiz: ["q-scales-01"],
};

export const quiz = [
  {id:"q-scales-01",courseId:"scales",lessonId:"scales-c2-02",lvl:1,q:"La formule en tons et demi-tons de la gamme majeure est…",o:["T-DT-T-T-DT-T-T","T-T-DT-T-T-T-DT","T-T-T-DT-T-T-DT","DT-T-T-T-DT-T-T"],a:1,exp:"T-T-DT-T-T-T-DT. Demi-tons entre 3-4 et 7-8. Cette structure asymétrique crée le 'son majeur' (sensation de luminosité, attraction du Si vers le Do).",xp:30},
];
