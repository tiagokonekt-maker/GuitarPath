// Leçon du module « scales » + les questions de quiz qui s'y rattachent.
// Format décrit dans src/content/README.md.

export default {
  id: "scales-c3-03", level: 6,
  title: "Pentatonique majeure et son lien avec la mineure",
  duration: 9,
  gropiTip: "Raccourci : pour une pentatonique majeure, place la forme mineure position 1 trois cases plus bas. Ré majeur (case 10 corde 6) ? Forme mineure case 7, et pose tes phrases sur Ré.",
  content: [
    { type: "p", text: "Il existe aussi une pentatonique majeure, sœur lumineuse de la pentatonique mineure. Et le secret le plus utile de la guitare : ces deux gammes partagent les mêmes notes. Comprendre ce lien double instantanément tes outils d'improvisation." },
    { type: "h", text: "La pentatonique majeure : formule" },
    { type: "p", text: "Formule en degrés : 1 - 2 - 3 - 5 - 6. Soit la fondamentale, la seconde majeure, la tierce majeure, la quinte juste, la sixte majeure. En Do : Do-Ré-Mi-Sol-La. C'est la gamme majeure dont on a retiré le 4 et le 7 (les notes les plus 'tendues' en majeur)." },
    { type: "h", text: "Son sonore typique" },
    { type: "p", text: "Joyeux, lumineux, 'champêtre'. Très utilisée en country, gospel, folk, pop des années 60. C'est la gamme des chansons 'qui sentent bon'." },
    { type: "h", text: "Le secret : Do penta MAJ = La penta MIN" },
    { type: "p", text: "Compare : Do penta majeure = Do-Ré-Mi-Sol-La. La penta mineure = La-Do-Ré-Mi-Sol. Mêmes 5 notes ! Seul l'ordre — et donc la fondamentale — change. Cette équivalence s'appelle la 'pentatonique relative'. Toute pentatonique majeure a une équivalente mineure 1,5 ton plus bas (3 demi-tons en dessous)." },
    {
      type: "scale_pattern",
      caption: "Do pentatonique majeure = La pentatonique mineure — même forme, fondamentale différente",
      data: {
        startFret: 4, endFret: 9,
        rootColor: "green", noteColor: "primary", accentColor: "coral",
        strings: [
          { frets: [5, 8], root: [8] },
          { frets: [5, 7], root: [] },
          { frets: [5, 7], root: [] },
          { frets: [5, 7], root: [5] },
          { frets: [5, 8], root: [] },
          { frets: [5, 8], root: [8] },
        ],
        noteMap: {
          "5,0":"La","8,0":"Do",
          "5,1":"Ré","7,1":"Mi",
          "5,2":"Sol","7,2":"La",
          "5,3":"Do","7,3":"Ré",
          "5,4":"Mi","8,4":"Sol",
          "5,5":"La","8,5":"Do",
        },
      },
    },
    { type: "h", text: "Les paires relatives à mémoriser" },
    { type: "p", text: "Do maj ↔ La min. Sol maj ↔ Mi min. Ré maj ↔ Si min. La maj ↔ Fa# min. Mi maj ↔ Do# min. Si maj ↔ Sol# min. Fa maj ↔ Ré min. Si♭ maj ↔ Sol min. Mi♭ maj ↔ Do min. La♭ maj ↔ Fa min. Ré♭ maj ↔ Si♭ min. Sol♭ maj ↔ Mi♭ min. Mêmes notes, deux fondamentales possibles." },
    { type: "h", text: "Pourquoi c'est révolutionnaire" },
    { type: "p", text: "Si tu connais la pentatonique mineure de La (la position 1 que tu as apprise), tu connais aussi la pentatonique majeure de Do — c'est exactement la même position sur le manche. Sur une chanson en Do majeur : joue la position 'La penta min' à la case 5, mais commence et finis tes phrases sur Do (case 8 corde 6). Magie : ça sonne joyeux/majeur." },
    { type: "ref", text: "Reconnaître une pentatonique majeure : 'My Girl' (The Temptations) commence par une mélodie pure pentatonique majeure de Do. 'Stand By Me' (Ben E. King) utilise la pentatonique majeure de La. Le riff principal de 'Sweet Home Alabama' (Lynyrd Skynyrd) est en pentatonique majeure. Country, soul, classic rock — partout." },
    { type: "tip", text: "Astuce d'impro : pour passer de 'son blues' à 'son country' sans changer de position, garde la même forme sur le manche mais commence/termine tes phrases sur une note différente (la fondamentale majeure au lieu de la mineure). Ta tonalité change, mais pas ton effort technique." },
  ],
  quiz: ["q-scales-06","q-scales-07","q-impro-04","q-impro-05","q-impro-21"],
};

export const quiz = [
  {id:"q-scales-06",courseId:"scales",lessonId:"scales-c3-03",lvl:2,q:"La pentatonique majeure de Sol contient quelles notes ?",o:["Sol-La-Do-Ré-Mi","Sol-Si-Do-Ré-Fa","Sol-La-Si-Ré-Mi","Sol-La-Si-Do-Ré"],a:2,exp:"Penta majeure = 1-2-3-5-6. Sol majeure = Sol-La-Si-Do-Ré-Mi-Fa#. Penta = retire 4 (Do) et 7 (Fa#). Donc Sol-La-Si-Ré-Mi.",xp:40},
  {id:"q-scales-07",courseId:"scales",lessonId:"scales-c3-03",lvl:2,q:"La pentatonique majeure de Do contient les MÊMES NOTES que la pentatonique mineure de…",o:["Mi","Sol","Ré","La"],a:3,exp:"Do penta maj = Do-Ré-Mi-Sol-La. La penta min = La-Do-Ré-Mi-Sol. Mêmes notes ! Relation de pentatoniques 'relatives' (la min = 6e degré de maj).",xp:50},
  {id:"q-impro-04",courseId:"impro",lessonId:"scales-c3-03",lvl:2,q:"En jouant La pentatonique mineure sur un Cmaj7, ça sonne…",o:["Juste : toutes ses notes vont","Faux : la plupart des notes frottent","Sombre : l'accord devient mineur","Vide : il manque la tierce"],a:0,exp:"La pentatonique mineure de La (La Do Ré Mi Sol) contient exactement les notes de Do pentatonique majeure. Sur Cmaj7, tout sonne juste, et le Fa, la note à éviter sur cet accord, en est absent.",xp:55},
  {id:"q-impro-05",courseId:"impro",lessonId:"scales-c3-03",lvl:3,q:"Une chanson country en Sol majeur. Quelle pentatonique mineure, déjà connue, te donne les notes de Sol pentatonique majeure ?",o:["Mi pentatonique mineure","Sol pentatonique mineure","Si pentatonique mineure","Ré pentatonique mineure"],a:0,exp:"Sol penta majeure = Sol La Si Ré Mi. Mi penta mineure = Mi Sol La Si Ré : les mêmes notes, car Mi est la relative mineure de Sol. Tu reprends la forme de Mi mineure et tu te poses sur Sol.",xp:60},
  {id:"q-impro-21",courseId:"impro",lessonId:"scales-c3-03",lvl:2,q:"Tu connais La pentatonique mineure en position 1 (case 5). Pour jouer Do pentatonique majeure, que fais-tu ?",o:["Même forme, repos sur Do","Même forme, 3 cases plus haut","Même forme, avec la ♭5 en plus","Nouvelle forme, 2 cases plus bas"],a:0,exp:"Do pentatonique majeure et La pentatonique mineure ont les mêmes cinq notes. Sous les doigts, rien ne change : c'est la note sur laquelle tu te poses (Do au lieu de La) qui fait entendre le majeur. Décaler la forme de 3 cases donnerait Do pentatonique mineure.",xp:30},
];
