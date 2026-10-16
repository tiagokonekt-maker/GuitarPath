// Leçon du module « scales » + les questions de quiz qui s'y rattachent.
// Format décrit dans src/content/README.md.

export default {
  id: "scales-c6-02", level: 9,
  title: "La gamme mineure mélodique",
  duration: 9,
  gropiTip: "Pour la retenir : c'est la gamme majeure avec la tierce abaissée. La majeur (La-Si-Do#-Ré-Mi-Fa#-Sol#) devient La mineur mélodique dès que Do# redevient Do.",
  content: [
    { type: "p", text: "Encore une variante de la mineure : la mineure mélodique. Cette gamme a une histoire particulière (deux versions selon le contexte) et un usage essentiel en jazz moderne." },
    { type: "h", text: "Formule (version 'jazz moderne')" },
    { type: "p", text: "1 - 2 - ♭3 - 4 - 5 - 6 - 7 (la 6 ET la 7 sont majeures). En La : La-Si-Do-Ré-Mi-Fa#-Sol#. C'est presque une gamme majeure, avec juste la tierce mineure (♭3) qui la rend mineure." },
    { type: "h", text: "La double version (classique vs jazz)" },
    { type: "p", text: "En musique classique traditionnelle, la mineure mélodique a deux formes : montante (1-2-♭3-4-5-6-7) et descendante (1-2-♭3-4-5-♭6-♭7 = éolien). Elle 'rehausse' la 6 et la 7 quand on monte, et les 'redescend' quand on descend. Cette double forme servait à éviter le saut bizarre de la mineure harmonique. En jazz moderne, on utilise la même formule (montante) à la montée ET à la descente. C'est plus simple et plus moderne." },
    { type: "h", text: "Couleur sonore" },
    { type: "p", text: "Mineure mais lumineuse, presque ambiguë. Le caractère mineur est subtil (juste la ♭3). Le reste de la gamme est 'majeur'. Très utilisé en jazz moderne pour les solos sur accords mineurs maj7 (Im(maj7)) — un accord rare et sophistiqué qui contient à la fois la ♭3 et la 7 majeure." },
    { type: "h", text: "Les modes de la mélodique : un univers à part" },
    { type: "p", text: "Comme la gamme majeure a 7 modes, la mineure mélodique en a 7 aussi. Et plusieurs sont essentiels en jazz moderne. Le 4e mode (lydien ♭7, ou « lydien dominant ») s'utilise sur les dominantes 7 qui ne résolvent pas vers une tonique : le IV7 d'un blues, le substitut tritonique ♭II7, les accords 7(#11). Le 7e mode (mode 'altéré') est LA gamme à utiliser sur les V7 qui résolvent (ex : G7alt → Cmaj7). Le 6e mode (Locrien #2) est utilisé sur les m7b5. Tout un monde." },
    { type: "h", text: "Quand utiliser la mélodique" },
    { type: "p", text: "1) Sur un Im(maj7) — accord rare mais 'jazz moderne'. 2) Pour le mode altéré (sur les V7 résolvants). 3) Pour le lydien ♭7 (sur les V7 non résolvants). 4) Pour le locrien #2 (sur les m7b5). Si tu n'as pas encore intégré la mineure harmonique, mets la mélodique de côté pour l'instant." },
    {
      type: "scale_pattern",
      caption: "La mineure mélodique (jazz) — note clé : Fa# (6M) et Sol# (7M) vs éolien",
      data: {
        startFret: 4, endFret: 9,
        rootColor: "amber", noteColor: "primary",
        strings: [
          { frets: [5, 7, 8], root: [5] },
          { frets: [5, 7, 9], root: [] },
          { frets: [6, 7, 9], root: [7] },
          { frets: [5, 7, 9], root: [] },
          { frets: [5, 7, 9], root: [] },
          { frets: [5, 7, 8], root: [5] },
        ],
        noteMap: {
          "5,0":"La","7,0":"Si","8,0":"Do",
          "5,1":"Ré","7,1":"Mi","9,1":"Fa#",
          "6,2":"Sol#","7,2":"La","9,2":"Si",
          "5,3":"Do","7,3":"Ré","9,3":"Mi",
          "5,4":"Mi","7,4":"Fa#","9,4":"Sol#",
          "5,5":"La","7,5":"Si","8,5":"Do",
        }
      },
    },
    { type: "h", text: "Histoire" },
    { type: "p", text: "La forme classique (montante/descendante) date du XVIIIe siècle. La forme 'jazz' (montante uniquement) a été codifiée au XXe siècle, notamment par les musiciens de bebop (Charlie Parker, Dizzy Gillespie) et les théoriciens du jazz moderne (George Russell). Aujourd'hui, c'est l'une des gammes les plus importantes du jazz contemporain." },
    { type: "ref", text: "Exemples : 'Beautiful Love' (standard de jazz) utilise la mineure mélodique. La plupart des solos de jazz fusion (Pat Metheny, John Scofield, Mike Stern) regorgent de mélodique. Allan Holdsworth en a fait un art." },
    { type: "tip", text: "La mineure mélodique est une gamme 'avancée'. Si tu débutes en théorie, garde-la pour plus tard. Concentre-toi d'abord sur la maîtrise de la majeure, des modes courants (dorien, mixolydien) et de la mineure harmonique." },
  ],
  quiz: ["q-scales-21","q-impro-12","q-scales-13","q-scales-15"],
};

export const quiz = [
  {id:"q-scales-21",courseId:"scales",lessonId:"scales-c6-02",lvl:3,q:"La gamme mineure mélodique 'jazz' a quelle formule ?",o:["1-2-♭3-4-5-♭6-♭7","1-2-♭3-4-5-6-7","1-♭2-♭3-4-5-♭6-7","1-2-3-4-5-6-♭7"],a:1,exp:"Mélodique jazz = 1-2-♭3-4-5-6-7. Mineure naturelle avec 6 ET 7 majeures. La mélodique jazz = La-Si-Do-Ré-Mi-Fa#-Sol#. Presque une majeure avec juste ♭3.",xp:55},
  {id:"q-impro-12",courseId:"impro",lessonId:"scales-c6-02",lvl:3,q:"Sur un accord altéré G7alt (V7 vers Cm), quelle gamme ?",o:["Sol altéré","Sol mixolydien","Sol lydien","Sol majeur"],a:0,exp:"La gamme altérée est le 7e mode de la mineure mélodique : Lab mélodique = Lab Sib Do♭ Réb Mib Fa Sol, donc Sol altéré = Sol Lab Sib Do♭ Réb Mib Fa, avec toutes les altérations possibles de G7 (♭9, #9, ♭5, ♭13). Mixolydien, lydien et majeur ignorent ces altérations.",xp:75},
];
