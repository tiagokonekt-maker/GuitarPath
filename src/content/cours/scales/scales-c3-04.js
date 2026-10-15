// Leçon du module « scales » + les questions de quiz qui s'y rattachent.
// Format décrit dans src/content/README.md.

export default {
  id: "scales-c3-04", level: 6,
  title: "La gamme blues : l'ajout de la blue note",
  duration: 10,
  content: [
    { type: "p", text: "La gamme blues, c'est la pentatonique mineure avec un 'plus' qui change tout : une note supplémentaire, la fameuse 'blue note', qui crée la couleur dramatique du blues. 6 notes, et tu as accès à la palette sonore d'un siècle entier de musique afro-américaine." },
    { type: "h", text: "La formule" },
    { type: "p", text: "Pentatonique mineure (1 - ♭3 - 4 - 5 - ♭7) + ♭5 = Gamme blues (1 - ♭3 - 4 - ♭5 - 5 - ♭7). En La : La - Do - Ré - Ré# - Mi - Sol. La nouvelle note (Ré#, ou Mi♭ enharmonique) se glisse entre la 4 et la 5 de la pentatonique." },
    { type: "h", text: "Pourquoi 'blue note'" },
    { type: "p", text: "Cette note (la ♭5) sonne extrêmement tendue par rapport à la fondamentale. Elle crée un demi-ton avec la quinte juste, ce qui produit une dissonance expressive caractéristique de la voix humaine en souffrance. Les chants de travail des esclaves dans les plantations américaines du XIXe siècle utilisaient déjà ces inflexions tendues. La 'blue note' est le pont entre la voix et la guitare blues." },
    { type: "h", text: "Histoire courte du blues" },
    { type: "p", text: "La gamme blues est née au début du XXe siècle dans le sud des États-Unis. Elle mélange les modes africains (qui privilégient la 5e diminuée) et les gammes occidentales. Robert Johnson, B.B. King, Muddy Waters, Albert King, Stevie Ray Vaughan — tous ces géants ont construit leurs solos sur cette gamme. Le blues a ensuite donné naissance au rock'n'roll, au R&B, à la soul, au funk, et au rap. Pas mal pour 6 notes." },
    { type: "h", text: "Comment l'utiliser : la règle d'or" },
    { type: "p", text: "La blue note (♭5) est une note de PASSAGE, jamais une note de RÉSOLUTION. Tu y passes brièvement, tu ne t'y attardes pas. Phrasé typique : tu joues Ré (4), tu glisses sur Ré# (♭5), tu arrives sur Mi (5). La ♭5 est un 'pont' qui amène à la quinte. Si tu tiens trop longtemps une blue note, ça sonne faux. Si tu y passes vite, ça sonne 'blues parfait'." },
    { type: "h", text: "Position blues sur le manche" },
    { type: "p", text: "Reprends la position 1 de La pentatonique mineure (case 5). Ajoute Ré# (la note bleue) sur la corde 5, case 6, entre le Ré (case 5) et le Mi (case 7). C'est tout : tu joues la gamme blues. Phrasé classique : Ré → Ré# → Mi sur la corde 5 (cases 5, 6, 7), en glissé ou en hammer-on. Tu retrouves aussi la note bleue sur la corde 3, case 8." },
    {
      type: "scale_pattern",
      caption: "Gamme blues de La — penta mineure + note bleue Ré# (case 6 c5, case 8 c3)",
      data: {
        startFret: 4, endFret: 9,
        rootColor: "amber", noteColor: "primary", accentColor: "coral", accentLabel: "note bleue",
        strings: [
          { frets: [5, 8], root: [5] },
          { frets: [5, 6, 7], root: [], accent: [6] },
          { frets: [5, 7], root: [7] },
          { frets: [5, 7, 8], root: [], accent: [8] },
          { frets: [5, 8], root: [] },
          { frets: [5, 8], root: [5] },
        ],
        noteMap: {
          "5,0":"La","8,0":"Do",
          "5,1":"Ré","6,1":"Ré#","7,1":"Mi",
          "5,2":"Sol","7,2":"La",
          "5,3":"Do","7,3":"Ré","8,3":"Ré#",
          "5,4":"Mi","8,4":"Sol",
          "5,5":"La","8,5":"Do",
        },
      },
    },
    { type: "ref", text: "Pour entendre la blue note 'pure' : 'The Thrill is Gone' (B.B. King) regorge de blue notes. Le solo final de 'Crossroads' (Cream/Eric Clapton) utilise massivement la gamme blues. 'Texas Flood' (Stevie Ray Vaughan) est un cours magistral sur la gamme blues complète." },
    { type: "tip", text: "Pratique du soir : sur une backing track de blues en La (12 mesures), improvise pendant 10 minutes en utilisant exclusivement la gamme blues. Force-toi à utiliser la ♭5 au moins 5 fois — toujours en passage, jamais en résolution. Tu vas développer un vrai feel blues en quelques semaines." },
  ],
  quiz: ["q-scales-08","q-impro-01","q-fret-scales-03","q-impro-19"],
};

export const quiz = [
  {id:"q-scales-08",courseId:"scales",lessonId:"scales-c3-04",lvl:3,q:"La 'gamme blues' ajoute quelle note à la pentatonique mineure ?",o:["La ♭5","La 2","La 6","La 7"],a:0,exp:"Gamme blues = penta mineure + ♭5 ('blue note'). En La : ajoute Ré# entre Ré (4) et Mi (5). 6 notes au total. La ♭5 crée la tension blues caractéristique.",xp:40},
  {id:"q-impro-01",courseId:"impro",lessonId:"scales-c3-04",lvl:1,q:"Sur un blues en La majeur, quelle gamme commencer ?",o:["La gamme majeure de La", "La pentatonique mineure", "Do majeur, la relative", "Mi pentatonique mineure"],a:1,exp:"La pentatonique mineure de La sonne juste sur tout blues en La (A7-D7-E7). Le ♭3 et la ♭7 de la penta s'accordent avec les dominantes.",xp:30},
  {id:"q-fret-scales-03",type:"fretboard",courseId:"scales",lessonId:"scales-c3-04",lvl:2,q:"Trouve toutes les notes de la gamme blues de La sur le manche",concept:{type:"find_scale",root:"A",quality:"blues"},selectionRules:{mode:"all"},display:{showNotes:false},hint:"Blues = pentatonique mineure + note bleue (♭5 = Ré#).",xp:55,exp:"Blues de La : La-Do-Ré-Ré#-Mi-Sol. La note bleue Ré# est la caracteristique."},
  {id:"q-impro-19",courseId:"impro",lessonId:"scales-c3-04",lvl:1,q:"La « blue note » ajoutée à la pentatonique mineure est…",o:["La seconde majeure","La sixte majeure","La quinte diminuée","La septième majeure"],a:2,exp:"La quinte diminuée, entre la quarte et la quinte. Elle ne se tient pas : c'est une note de passage, à traverser plutôt qu'à poser, et c'est cette tension fugace qui donne sa couleur au blues.",xp:30},
];
