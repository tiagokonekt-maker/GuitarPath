// Leçon du module « scales » + les questions de quiz qui s'y rattachent.
// Format décrit dans src/content/README.md.

export default {
  id: "scales-c4-01", level: 7,
  title: "Mineur naturel et majeur : deux faces d'une même pièce",
  duration: 10,
  gropiTip: "Pour comparer les deux formules : la mineure naturelle, c'est la majeure avec la 3, la 6 et la 7 abaissées d'un demi-ton. Do majeur devient Do mineur avec Mi♭, La♭ et Si♭.",
  content: [
    { type: "p", text: "Avant d'attaquer les modes, on fait une étape essentielle : comprendre la relation entre majeur et mineur. Cette relation est plus profonde que tu ne le penses, et elle est la clé pour saisir ce qui se passera dans les leçons suivantes. Spoiler : majeur et mineur ne sont pas opposés. Ce sont deux manières d'écouter les MÊMES notes." },
    { type: "h", text: "La gamme mineure naturelle" },
    { type: "p", text: "Si la gamme majeure suit la formule T-T-DT-T-T-T-DT, la gamme mineure naturelle suit T-DT-T-T-DT-T-T. Les demi-tons ne sont plus aux mêmes endroits. Résultat : un caractère sonore radicalement différent. Le mineur sonne mélancolique, introspectif, parfois dramatique. Le majeur sonne lumineux, ouvert, optimiste." },
    { type: "h", text: "Construction de La mineur naturel" },
    { type: "p", text: "Partons de La. T → Si. DT → Do. T → Ré. T → Mi. DT → Fa. T → Sol. T → La (octave). Résultat : La-Si-Do-Ré-Mi-Fa-Sol-La. Aucune altération ! Comme Do majeur, mais en partant de La." },
    {
      type: "scale_pattern",
      caption: "La mineur naturel (= éolien) — position case 5. Même notes que Do majeur",
      data: {
        startFret: 4, endFret: 8,
        rootColor: "primary", noteColor: "green", accentColor: "coral", accentLabel: "Fa, sixte mineure (couleur de l'éolien)",
        strings: [
          { frets: [5, 7, 8], root: [5] },
          { frets: [5, 7, 8], root: [], accent: [8] },
          { frets: [5, 7], root: [7] },
          { frets: [4, 5, 7], root: [] },
          { frets: [5, 6, 8], root: [], accent: [6] },
          { frets: [5, 7, 8], root: [5] },
        ],
        noteMap: {
          "5,0":"La","7,0":"Si","8,0":"Do",
          "5,1":"Ré","7,1":"Mi","8,1":"Fa",
          "5,2":"Sol","7,2":"La",
          "4,3":"Si","5,3":"Do","7,3":"Ré",
          "5,4":"Mi","6,4":"Fa","8,4":"Sol",
          "5,5":"La","7,5":"Si","8,5":"Do",
        },
      },
    },
    { type: "h", text: "Le secret : Do majeur et La mineur partagent les mêmes notes" },
    { type: "p", text: "Compare. Do majeur = Do-Ré-Mi-Fa-Sol-La-Si. La mineur naturel = La-Si-Do-Ré-Mi-Fa-Sol. EXACTEMENT les mêmes 7 notes. La seule différence : la note de départ (la fondamentale). Cette équivalence s'appelle la 'tonalité relative'. Toute gamme majeure a sa relative mineure, située 1 ton et demi en dessous." },
    { type: "h", text: "Pourquoi la fondamentale change tout" },
    { type: "p", text: "Joue Do-Ré-Mi-Fa-Sol-La-Si en revenant souvent sur Do, en commençant et finissant tes phrases sur Do. Tu entendras du majeur, du joyeux. Joue les MÊMES notes, mais reviens toujours sur La, commence et finis sur La. Tu entendras du mineur, du mélancolique. Tes oreilles 'recentrent' la gamme autour de la fondamentale qu'elles entendent le plus souvent. C'est ce phénomène qui rend les modes possibles." },
    { type: "h", text: "Les paires de tonalités relatives" },
    { type: "p", text: "Do maj ↔ La min. Sol maj ↔ Mi min. Ré maj ↔ Si min. La maj ↔ Fa# min. Mi maj ↔ Do# min. Si maj ↔ Sol# min. Fa maj ↔ Ré min. Si♭ maj ↔ Sol min. Mi♭ maj ↔ Do min. Mêmes notes, deux ambiances possibles. Le compositeur choisit l'une ou l'autre selon ce qu'il veut raconter." },
    { type: "ref", text: "Test sonore : 'Greensleeves' (chanson traditionnelle anglaise du XVIe siècle) est en La mineur. 'Stairway to Heaven' (Led Zeppelin) commence en La mineur. À l'inverse, 'Joy to the World' (chant de Noël) est en Do majeur. Tu peux jouer les deux mélodies avec exactement les mêmes 7 notes (Do-Ré-Mi-Fa-Sol-La-Si), mais l'une sonnera triste, l'autre joyeuse. La fondamentale ressentie fait toute la différence." },
    { type: "tip", text: "Cette leçon est la pierre angulaire de tout ce qui suit. Si tu comprends que 'mêmes notes + fondamentale différente = ambiance différente', tu es prêt pour les modes. Si pas encore, relis cette leçon avant d'avancer." },
  ],
  quiz: ["q-logic-04","q-scales-34","q-scales-35"],
};

export const quiz = [
  {id:"q-logic-04",courseId:"harmony",lessonId:"scales-c4-01",lvl:2,q:"Le 'relatif mineur' d'une tonalité majeure est sur quel degré ?",o:["3e","4e","7e","6e"],a:3,exp:"Relatif mineur = 6e degré. Do majeur → La mineur (6e degré = La). Mêmes notes, fondamentale différente, couleur opposée.",xp:45},
  {id:"q-scales-34",courseId:"scales",lessonId:"scales-c4-01",lvl:1,q:"Quelle est la formule de la gamme mineure naturelle ?",o:["T-T-DT-T-T-T-DT", "T-DT-T-T-T-T-DT", "DT-T-T-T-DT-T-T", "T-DT-T-T-DT-T-T"],a:3,exp:"Mineure naturelle : T-DT-T-T-DT-T-T. Depuis La : La-Si-Do-Ré-Mi-Fa-Sol, sans altération.",xp:30},
  {id:"q-scales-35",courseId:"scales",lessonId:"scales-c4-01",lvl:2,q:"Do majeur et La mineur naturel ont les mêmes notes. Qu'est-ce qui change l'ambiance ?",o:["La note sur laquelle on se pose", "Le nombre de notes jouées dans la gamme", "Le tempo du morceau", "L'accordage de la guitare"],a:0,exp:"Mêmes 7 notes, fondamentale différente : on entend du majeur en se posant sur Do, du mineur en se posant sur La.",xp:40},
];
