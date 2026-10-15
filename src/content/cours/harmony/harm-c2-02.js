// Leçon du module « harmony » + les questions de quiz qui s'y rattachent.
// Format décrit dans src/content/README.md.

export default {
  id: "harm-c2-02", level: 5,
  title: "Construire une triade depuis n'importe quelle note",
  duration: 10,
  content: [
    { type: "p", text: "Maintenant que tu connais les 4 types de triades et leurs formules, on va apprendre à les construire depuis n'importe quelle note. C'est la compétence qui te rend vraiment libre : plus besoin de mémoriser chaque accord comme un cas isolé, tu les construis à la demande." },
    { type: "h", text: "La méthode : formule + demi-tons" },
    { type: "p", text: "Pour construire une triade majeure depuis n'importe quelle note : (1) Prends la fondamentale. (2) Ajoute 4 demi-tons = tierce majeure. (3) Ajoute 7 demi-tons depuis la fondamentale = quinte juste. Exemple : Fa majeur. Fa + 4 demi-tons = La. Fa + 7 demi-tons = Do. Fa majeur = Fa-La-Do." },
    { type: "h", text: "Construire depuis Mi (E)" },
    { type: "p", text: "Mi majeur : Mi + 4dt = Sol#. Mi + 7dt = Si. Mi majeur = Mi-Sol#-Si. Mi mineur : Mi + 3dt = Sol. Mi + 7dt = Si. Mi mineur = Mi-Sol-Si. Mi diminué : Mi + 3dt = Sol. Mi + 6dt = Sib. Mi diminué = Mi-Sol-Sib. Mi augmenté : Mi + 4dt = Sol#. Mi + 8dt = Do. Mi augmenté = Mi-Sol#-Do." },
    { type: "h", text: "Construire depuis Si♭" },
    { type: "p", text: "Sib majeur : Sib + 4dt = Ré. Sib + 7dt = Fa. Sib majeur = Sib-Ré-Fa. Sib mineur : Sib + 3dt = Réb. Sib + 7dt = Fa. Sib mineur = Sib-Réb-Fa. Quelques exemples avec des bémols : les formules restent identiques, seuls les noms des notes changent." },
    { type: "h", text: "Les 12 triades majeures — une par une" },
    { type: "p", text: "Do : Do-Mi-Sol. Do# : Do#-Fa-Sol#. Ré : Ré-Fa#-La. Ré# : Ré#-Sol-La#. Mi : Mi-Sol#-Si. Fa : Fa-La-Do. Fa# : Fa#-La#-Do#. Sol : Sol-Si-Ré. Sol# : Sol#-Do-Ré#. La : La-Do#-Mi. La# : La#-Ré-Fa. Si : Si-Ré#-Fa#. Mémorise-les progressivement — pas toutes en même temps." },
    { type: "h", text: "Sur le manche : appliquer la formule" },
    { type: "p", text: "Sur le manche, construire une triade depuis une note est visuel. Depuis Do sur c5 case 3 : tierce majeure = +4 cases sur la même corde = c5 case 7 = Mi. Quinte juste = +7 cases = c5 case 10 = Sol. Ou en utilisant les patterns d'intervalles entre cordes vus dans le module Manche." },
    {
      type: "fretboard",
      caption: "Triade de Do majeur sur la corde 5 — fondamentale, +4 cases, +7 cases",
      data: {
        frets: 8, startFret: 2,
        showStringNames: true, showFretNumbers: true,
        notes: [
          { string: 5, fret: 3,  label: "Do", color: "primary", root: true },
          { string: 5, fret: 7,  label: "Mi", color: "green" },
          { string: 5, fret: 10, label: "Sol", color: "amber" },
        ],
      },
    },
    { type: "h", text: "L'enharmonie dans les triades" },
    { type: "p", text: "Attention aux enharmonies quand tu construis une triade. La triade de Do# majeur = Do#-Fa-Sol#. Mais on écrira souvent Ré♭ majeur = Réb-Fa-Lab (enharmonique de Do# majeur). Même son, écriture différente. En pratique, sur la guitare, ce n'est pas un problème : tu joues les mêmes cases." },
    { type: "ref", text: "Test pratique : la chanson 'La Bamba' (traditionnelle mexicaine) utilise les accords La-Ré-Mi. Si tu transposes en Do, tu joues Do-Fa-Sol. Même structure harmonique (I-IV-V), notes différentes. Tu viens d'appliquer la construction de triades à la transposition." },
    { type: "tip", text: "Drill quotidien (3 min) : tire une note au hasard (nomme-en une). Construis sa triade majeure en 5 secondes. Puis sa triade mineure. Puis diminuée. Au bout de 2 semaines, c'est instantané. C'est l'investissement le plus rentable en théorie musicale." },
  ],
  quiz: ["q-fret-harm-01","q-fret-harm-02","q-harm-02","q-harm-03"],
};

export const quiz = [
  {id:"q-fret-harm-01",type:"fretboard",courseId:"harmony",lessonId:"harm-c2-02",lvl:1,q:"Trouve toutes les notes de Do majeur (Do Mi Sol) sur le manche",concept:{type:"find_chord",root:"C",quality:"maj"},selectionRules:{mode:"all"},display:{showNotes:false},hint:"Do majeur = Do + Mi (3ce M) + Sol (5te).",xp:45,exp:"Triade Do majeur : 3 notes distinctes, nombreuses positions sur le manche."},
  {id:"q-fret-harm-02",type:"fretboard",courseId:"harmony",lessonId:"harm-c2-02",lvl:2,q:"Trouve toutes les notes de La mineur (La Do Mi)",concept:{type:"find_chord",root:"A",quality:"min"},selectionRules:{mode:"all"},display:{showNotes:false},hint:"La mineur = La + Do (3ce m) + Mi (5te). Compare avec La majeur (Do#).",xp:45,exp:"Am : La-Do-Mi. La tierce mineure (Do vs Do#) fait toute la différence."},
];
