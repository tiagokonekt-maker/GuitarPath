// Leçon du module « scales » + les questions de quiz qui s'y rattachent.
// Format décrit dans src/content/README.md.

export default {
  id: "scales-c6-01", level: 9,
  title: "La gamme mineure harmonique",
  duration: 10,
  gropiTip: "Joue Mi-Fa-Sol#-La sur la corde 2 (cases 5, 6, 9) puis La case 5 corde 1. Le saut de 3 cases entre Fa et Sol# te donne tout de suite la couleur orientale de la gamme.",
  content: [
    { type: "p", text: "Au-delà des 7 modes de la gamme majeure, il existe d'autres familles de gammes. La plus importante est la gamme mineure harmonique, créée pour résoudre un problème spécifique de l'harmonie tonale. Elle est utilisée en classique, en jazz, en métal néoclassique, et dans la musique gitane." },
    { type: "h", text: "Le problème à résoudre" },
    { type: "p", text: "Dans une tonalité mineure (éolien), le 5e degré est mineur (en La : V = Em). Or, pour créer une cadence 'forte' V-I, il faut une dominante majeure ou 7 (E ou E7). Avec un Em, la résolution vers Am est faible. Solution : on rehausse la 7e note de la gamme mineure (Sol → Sol#), ce qui transforme Em en E, et permet une cadence mineure forte." },
    { type: "h", text: "Formule" },
    { type: "p", text: "1 - 2 - ♭3 - 4 - 5 - ♭6 - 7 (la 7 est majeure, contrairement à l'éolien qui a une ♭7). En La : La-Si-Do-Ré-Mi-Fa-Sol#. Une seule différence avec l'éolien : Sol# au lieu de Sol naturel." },
    { type: "h", text: "Couleur sonore" },
    { type: "p", text: "L'écart de tierce mineure (3 demi-tons) entre la ♭6 (Fa) et la 7 (Sol#) crée un saut caractéristique 'oriental' / 'espagnol classique'. C'est le son de la musique gitane, du flamenco classique, du métal néoclassique. Plus dramatique et 'classique' que l'éolien standard." },
    { type: "h", text: "Sur quels accords l'utiliser" },
    { type: "p", text: "Principalement sur le V7 d'une cadence mineure (E7 → Am en La mineur). Sur le E7, joue La mineure harmonique — qui contient le Sol# (la 3 de E7) qui résout magnifiquement vers le La de Am. Cette technique est la base du jazz mineur et du métal néoclassique." },
    {
      type: "scale_pattern",
      caption: "La mineure harmonique — case 5. Note clé : Sol#, la septième majeure (case 6 c4, case 9 c2)",
      data: {
        startFret: 4, endFret: 9,
        rootColor: "amber", noteColor: "primary",
        strings: [
          { frets: [5, 7, 8], root: [5] },
          { frets: [5, 7], root: [] },
          { frets: [6, 7], root: [], accent: [6] },
          { frets: [4, 5, 7], root: [] },
          { frets: [5, 6, 9], root: [], accent: [9] },
          { frets: [5, 7, 8], root: [5] },
        ],
        noteMap: {
          "5,0":"La","7,0":"Si","8,0":"Do",
          "5,1":"Ré","7,1":"Mi",
          "6,2":"Sol#","7,2":"La",
          "4,3":"Si","5,3":"Do","7,3":"Ré",
          "5,4":"Mi","6,4":"Fa","9,4":"Sol#",
          "5,5":"La","7,5":"Si","8,5":"Do",
        }
      },
    },
    { type: "p", text: "Comme la gamme majeure a 7 modes, la gamme mineure harmonique en a 7 aussi. Le plus utilisé est son 5e mode : le 'phrygien dominant' (qu'on a évoqué dans la leçon sur le phrygien). En Mi : Mi-Fa-Sol#-La-Si-Do-Ré. C'est exactement le mode du flamenco authentique. Tu peux l'utiliser sur un E7 dans un contexte espagnol/oriental." },
    { type: "h", text: "Histoire" },
    { type: "p", text: "La mineure harmonique a été 'inventée' au XVIIIe siècle pour permettre la cadence parfaite en mineur. Bach, Mozart, Beethoven l'utilisent abondamment. Au XIXe siècle, elle devient le langage de la musique romantique mineure. Au XXe siècle, Yngwie Malmsteen et le métal néoclassique en font leur langage signature. Aujourd'hui, c'est aussi un outil essentiel du jazz." },
    { type: "ref", text: "Exemples emblématiques : 'Sonate au clair de lune' (Beethoven, mouvement 1) utilise la mineure harmonique. 'Hava Nagila' (chant traditionnel juif) en Ré mineur harmonique. Toute la musique de Yngwie Malmsteen ('Black Star', 'Far Beyond the Sun'). Le solo d'intro de 'Sweet Child O' Mine' (Guns N' Roses) utilise la mineure harmonique de Ré." },
    { type: "tip", text: "Pour intégrer la mineure harmonique : sur un blues mineur en La (Am-Dm-E7), joue La pentatonique sur Am et Dm, mais switch vers La mineure harmonique sur le E7. Tu obtiens immédiatement le son 'minor blues sophistiqué' typique de B.B. King ou de Carlos Santana." },
  ],
  quiz: ["q-scales-20","q-impro-09","q-scales-11","q-scales-12"],
};

export const quiz = [
  {id:"q-scales-20",courseId:"scales",lessonId:"scales-c6-01",lvl:2,q:"La gamme mineure harmonique se distingue de la mineure naturelle par…",o:["Une 7e majeure","Une 6e majeure","Une 4e augmentée","Une 2e mineure"],a:0,exp:"Mineure harmonique = mineure naturelle avec 7 majeure. La harmonique = La-Si-Do-Ré-Mi-Fa-Sol#. Le Sol# permet la cadence V-I forte en mineur.",xp:50},
  {id:"q-impro-09",courseId:"impro",lessonId:"scales-c6-01",lvl:3,q:"Sur E7 qui résout vers Am, tu joues La mineure harmonique. Vue depuis Mi, quel nom porte cette gamme ?",o:["Mi phrygien dominant","Mi mixolydien","Mi phrygien","Mi locrien"],a:0,exp:"La mineure harmonique (La Si Do Ré Mi Fa Sol#) jouée depuis Mi donne Mi Fa Sol# La Si Do Ré : 1-♭2-3-4-5-♭6-♭7, le phrygien dominant. Le Sol# est la tierce de E7 ; avec un Sol naturel, ce serait Mi phrygien.",xp:70},
];
