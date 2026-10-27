// Leçon du module « scales » + les questions de quiz qui s'y rattachent.
// Format « leçon en cartes » décrit dans src/content/README.md.

export default {
  id: "scales-c6-01", level: 9,
  title: "La gamme mineure harmonique",
  duration: 9,
  gropiTip: "Joue Mi-Fa-Sol#-La sur la corde 2 (cases 5, 6, 9) puis La case 5 corde 1. Le saut de 3 cases entre Fa et Sol# te donne tout de suite la couleur orientale de la gamme.",
  cartes: [
    { type: "idee", titre: "Un V trop mou", texte: [
      "En La mineur naturel, l'accord du 5e degré est Em. Sa cadence vers Am manque de force : aucune note ne tire vers La à un demi-ton.",
      "La solution : monter la 7e note d'un demi-ton. Sol devient Sol#, Em devient E (ou E7), et la cadence V – I retrouve son élan.",
    ] },
    { type: "idee", titre: "Formule", texte: [
      "1-2-♭3-4-5-♭6-7. En La : La, Si, Do, Ré, Mi, Fa, Sol#.",
      "Entre Fa et Sol#, un écart d'un ton et demi : ce saut donne sa couleur orientale et dramatique, celle de la musique classique en mineur comme du metal néoclassique.",
    ], bloc: {
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
    } },
    { type: "question", quizId: "q-scales-p89-c601-01" },
    { type: "idee", titre: "Sur le V7", texte: [
      "Son terrain principal : le V7 d'une cadence mineure. Sur E7 → Am, joue La mineure harmonique.",
      "Son Sol# est la tierce de E7, et il monte d'un demi-ton sur le La de Am : la résolution se fait toute seule.",
    ] },
    { type: "idee", titre: "Vue depuis Mi", texte: [
      "Joue La mineure harmonique en partant de Mi : Mi, Fa, Sol#, La, Si, Do, Ré. Tu retrouves le phrygien dominant, croisé au palier précédent : c'est le 5e mode de cette gamme.",
      "Une même gamme, deux façons de la penser sur E7.",
    ] },
    { type: "question", quizId: "q-scales-20" },
    { type: "a-toi", titre: "Un blues mineur",
      consigne: "Fais tourner Am, Dm, E7, Am, une mesure chacun, au clic à 60. Penta mineure de La sur Am et Dm ; sur E7, joue la tab, qui passe deux fois par Sol#, et finis sur La (corde 4 case 7) quand Am revient.",
      bloc: {
        type: "tab",
        caption: "La mineure harmonique sur E7, position case 5 : Sol# qui monte sur La",
        text: "Tab — mesure E7 : corde 1 cases 8 et 7 (Do, Si), corde 2 cases 9, 6, 5 (Sol#, Fa, Mi), corde 3 cases 7 et 4 (Ré, Si), corde 4 case 6 (Sol#). Mesure Am : corde 4 case 7 (La).",
        data: { lines: [
          "e|-8--7--------------------|----|",
          "B|-------9--6--5-----------|----|",
          "G|----------------7--4-----|----|",
          "D|----------------------6--|-7--|",
          "A|-------------------------|----|",
          "E|-------------------------|----|",
        ] },
      }, bpm: 60, minuteur: 150 },
    { type: "question", quizId: "q-impro-09" },
    { type: "recap", points: [
      "Mineure harmonique = 1-2-♭3-4-5-♭6-7 : la mineure naturelle avec une 7e majeure.",
      "Sa sensible rend au V sa force : E7 → Am en La mineur.",
      "Jouée depuis le 5e degré, elle donne le phrygien dominant.",
    ] },
  ],
  quiz: ["q-scales-20","q-impro-09","q-scales-11","q-scales-12","q-scales-p89-c601-01"],
};

export const quiz = [
  {id:"q-scales-20",courseId:"scales",lessonId:"scales-c6-01",lvl:2,q:"La gamme mineure harmonique se distingue de la mineure naturelle par…",o:["Une 7e majeure","Une 6e majeure","Une 4e augmentée","Une 2e mineure"],a:0,exp:"Mineure harmonique = mineure naturelle avec 7 majeure. La harmonique = La-Si-Do-Ré-Mi-Fa-Sol#. Le Sol# permet la cadence V-I forte en mineur.",xp:50},
  {id:"q-impro-09",courseId:"impro",lessonId:"scales-c6-01",lvl:3,q:"Sur E7 qui résout vers Am, tu joues La mineure harmonique. Vue depuis Mi, quel nom porte cette gamme ?",o:["Mi phrygien dominant","Mi mixolydien","Mi phrygien","Mi locrien"],a:0,exp:"La mineure harmonique (La Si Do Ré Mi Fa Sol#) jouée depuis Mi donne Mi Fa Sol# La Si Do Ré : 1-♭2-3-4-5-♭6-♭7, le phrygien dominant. Le Sol# est la tierce de E7 ; avec un Sol naturel, ce serait Mi phrygien.",xp:70},
  {id:"q-scales-p89-c601-01",courseId:"scales",lessonId:"scales-c6-01",lvl:2,q:"En Mi mineur harmonique, quelle note remplace le Ré de Mi mineur naturel ?",o:["Ré#","Do#","Ré♭","Do"],a:0,exp:"On monte la 7e d'un demi-ton : Ré devient Ré#, la sensible qui tire vers Mi. Mi mineur harmonique = Mi Fa# Sol La Si Do Ré#, et l'accord du V devient B7.",xp:40},
];
