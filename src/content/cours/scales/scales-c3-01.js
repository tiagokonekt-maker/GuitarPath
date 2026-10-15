// Leçon du module « scales » + les questions de quiz qui s'y rattachent.
// Format décrit dans src/content/README.md.

export default {
  id: "scales-c3-01", level: 6,
  title: "La pentatonique mineure : la gamme universelle",
  duration: 11,
  content: [
    { type: "p", text: "Si la gamme majeure est la matrice théorique de la musique occidentale, la pentatonique mineure est sa version 'simplifiée et radioactive'. C'est la gamme la plus utilisée dans le monde entier : blues, rock, pop, soul, funk, et même musique chinoise traditionnelle. 5 notes, et une efficacité redoutable." },
    { type: "h", text: "Pourquoi 'pentatonique' ?" },
    { type: "p", text: "'Penta' vient du grec 'cinq'. 'Tonique' fait référence aux tons. La pentatonique = gamme à 5 notes. À comparer avec les gammes 'normales' qui en ont 7 (heptatoniques). Moins de notes = plus de simplicité = moins de risques de fausse note." },
    { type: "h", text: "Comment elle est construite" },
    { type: "p", text: "La pentatonique mineure se construit en prenant 5 notes de la gamme mineure naturelle (qu'on verra bientôt). Sa formule en degrés est : 1 - ♭3 - 4 - 5 - ♭7. Soit la fondamentale, la tierce mineure, la quarte juste, la quinte juste, et la septième mineure. En La : La-Do-Ré-Mi-Sol." },
    { type: "h", text: "Pourquoi elle sonne toujours juste" },
    { type: "p", text: "La pentatonique a été conçue pour éliminer les notes les plus 'tendues' de la gamme. La gamme mineure naturelle contient 7 notes dont 2 (le 2e et le 6e degrés) qui créent des frottements. La pentatonique enlève ces 2 notes 'à risque'. Résultat : 5 notes qui s'accordent pratiquement avec n'importe quel accord mineur ou progression blues." },
    { type: "h", text: "La position 1 — celle à apprendre en premier" },
    { type: "p", text: "Pour La pentatonique mineure, position 1 (case 5) : Corde 6 → La(5)-Do(8). Corde 5 → Ré(5)-Mi(7). Corde 4 → Sol(5)-La(7). Corde 3 → Do(5)-Ré(7). Corde 2 → Mi(5)-Sol(8). Corde 1 → La(5)-Do(8). Tu utilises uniquement deux doigts par corde (index et auriculaire). Cette forme est l'une des plus mémorables de toute la guitare — beaucoup de guitaristes la connaissent de mémoire après leur première leçon." },
    {
      type: "scale_pattern",
      caption: "La pentatonique mineure — Position 1 (case 5), la plus utilisée",
      data: {
        startFret: 4, endFret: 9,
        rootColor: "amber", noteColor: "primary", accentColor: "coral",
        strings: [
          { frets: [5, 8], root: [5] },
          { frets: [5, 7], root: [] },
          { frets: [5, 7], root: [7] },
          { frets: [5, 7], root: [] },
          { frets: [5, 8], root: [] },
          { frets: [5, 8], root: [5] },
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
    { type: "h", text: "Sur quoi l'utiliser" },
    { type: "p", text: "1) Tout blues (les 12 mesures classiques). 2) Toute progression en mineur. 3) La plupart des solos rock (riffs Hendrix, Page, Clapton, Slash). 4) Improvisation 'safe' sur n'importe quelle chanson en mineur. C'est ton outil de survie en improvisation." },
    { type: "ref", text: "L'intro du solo de 'Stairway to Heaven' (Led Zeppelin) est en La pentatonique mineure. Le solo de 'Sweet Child O' Mine' (Guns N' Roses) aussi. Le riff de 'Smoke on the Water' (Deep Purple) utilise la même gamme. Une fois que tu la connais, tu reconnaîtras la pentatonique mineure dans une grande partie des solos rock que tu écoutes." },
    { type: "tip", text: "Programme intensif : pendant 7 jours, fais 10 minutes par jour de pentatonique mineure de La position 1, à 60 BPM en montant et en descendant. Au bout d'une semaine, c'est sous tes doigts à vie." },
  ],
  quiz: ["q-scales-05","q-logic-10","q-fret-scales-02","q-impro-16","q-impro-17","q-impro-20"],
};

export const quiz = [
  {id:"q-scales-05",courseId:"scales",lessonId:"scales-c3-01",lvl:1,q:"La pentatonique mineure suit la formule…",o:["1-2-3-5-6","1-♭3-4-5-♭7","1-2-♭3-4-5-♭6-♭7","1-3-5-7"],a:1,exp:"Penta mineure = 1-♭3-4-5-♭7. 5 notes seulement. Elle retire le 2 et le ♭6 de la mineure naturelle (les notes qui créent les demi-tons les plus tendus).",xp:30},
  {id:"q-logic-10",courseId:"scales",lessonId:"scales-c3-01",lvl:3,q:"Pourquoi la pentatonique 'sonne juste' sur tant de progressions différentes ?",o:["Elle a un pouvoir presque magique", "Elle retire les notes à risque (2 et ♭6)", "Elle est plus simple à jouer vite", "Une convention culturelle occidentale, rien de plus"],a:1,exp:"Penta mineure = 1-♭3-4-5-♭7. Elle évite le 2 (forme demi-ton avec ♭3) et ♭6 (forme demi-ton avec 5). Sans ces 2 demi-tons tendus, elle 'pose' sur quasi tous les accords mineurs et blues.",xp:65},
  {id:"q-fret-scales-02",type:"fretboard",courseId:"scales",lessonId:"scales-c3-01",lvl:1,q:"Sélectionne les notes de la pentatonique mineure de La (cases 5-8)",concept:{type:"find_scale",root:"A",quality:"pentatonic_minor"},selectionRules:{mode:"all"},fretRange:[4,9],display:{showNotes:false},hint:"Position 1 classique autour de la case 5.",xp:50,exp:"Pentatonique mineure de La position 1 : La-Do-Ré-Mi-Sol."},
  {id:"q-impro-16",courseId:"impro",lessonId:"scales-c3-01",lvl:1,q:"Improviser, c'est d'abord…",o:["Jouer le plus de notes possible","Jouer sans réfléchir du tout","Reproduire un solo appris par cœur","Faire des choix dans un cadre connu"],a:3,exp:"On n'improvise jamais à partir de rien : on choisit, en temps réel, parmi des possibilités qu'on connaît. Plus le cadre est maîtrisé, plus les choix sont libres — c'est exactement l'inverse de l'intuition courante.",xp:25},
  {id:"q-impro-17",courseId:"impro",lessonId:"scales-c3-01",lvl:1,q:"Sur un morceau en La mineur, par quelle gamme commencer pour improviser ?",o:["La pentatonique mineure de La","La gamme chromatique complète","Mi phrygien","Do majeur"],a:0,exp:"La pentatonique mineure de La ne contient aucune note qui puisse sonner franchement fausse sur cette tonalité. C'est ce qui en fait le point de départ universel : on peut se concentrer sur le rythme et le phrasé avant de penser aux notes.",xp:25},
  {id:"q-impro-20",courseId:"impro",lessonId:"scales-c3-01",lvl:2,q:"Un débutant en impro joue sans jamais s'arrêter. Quel est le premier conseil ?",o:["Apprendre davantage de gammes avant de jouer", "Monter progressivement en vitesse à chaque tour", "Changer de position sur le manche", "Laisser des silences entre des phrases courtes"],a:3,exp:"Un flux ininterrompu ne s'entend pas comme de la musique mais comme un exercice. Jouer quatre notes puis se taire deux temps transforme immédiatement le résultat, sans rien apprendre de nouveau.",xp:30},
];
