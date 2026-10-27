// Leçon du module « harmony » + les questions de quiz qui s'y rattachent.
// Format « leçon en cartes » décrit dans src/content/README.md.

const DO_SUR_CORDE_5 = {
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
};

const TAB_CORDE_5 = {
  type: "tab",
  caption: "Do majeur puis Do mineur sur la seule corde 5 : seule la tierce bouge",
  text: "Tab — corde 5 : cases 3, 7, 10 (Do majeur), puis cases 3, 6, 10 (Do mineur).",
  data: { lines: [
    "e|---------------------|",
    "B|---------------------|",
    "G|---------------------|",
    "D|---------------------|",
    "A|-3--7--10--3--6--10--|",
    "E|---------------------|",
  ] },
};

export default {
  id: "harm-c2-02", level: 5,
  title: "Construire une triade depuis n'importe quelle note",
  duration: 7,
  gropiTip: "Repère la quinte sans compter : depuis une fondamentale sur la corde 6 ou 5, elle est sur la corde voisine plus aiguë, deux cases plus loin (la forme du power chord). Il ne reste qu'à placer la tierce.",
  cartes: [
    { type: "idee", titre: "La méthode", texte: [
      "Plus besoin d'apprendre chaque accord à part : tu le construis. Pour une triade majeure, la fondamentale, puis +4 demi-tons (la tierce), puis +7 depuis la fondamentale (la quinte).",
      "Ré majeur : Ré + 4 = Fa#, Ré + 7 = La. Donc Ré, Fa#, La.",
    ] },
    { type: "question", quizId: "q-harm-p5-c202-01" },
    { type: "idee", titre: "Les quatre types depuis Mi", texte: [
      "Majeur (+4, +7) : Mi, Sol#, Si. Mineur (+3, +7) : Mi, Sol, Si.",
      "Diminué (+3, +6) : Mi, Sol, Si♭. Augmenté (+4, +8) : Mi, Sol#, Do.",
    ] },
    { type: "idee", titre: "Dièses, bémols, même son", texte: [
      "Avec des bémols, les formules ne changent pas, seuls les noms : Si♭ majeur = Si♭, Ré, Fa.",
      "Ré♭ majeur (Ré♭, Fa, La♭) et Do# majeur sonnent pareil : autre écriture, mêmes cases sur la guitare.",
    ] },
    { type: "question", quizId: "q-harm-p5-c202-02" },
    { type: "idee", titre: "Compter en cases", texte: [
      "Sur une même corde, un demi-ton = une case. Depuis Do (corde 5 case 3) : la tierce majeure à +4 cases, la quinte à +7.",
    ], bloc: DO_SUR_CORDE_5 },
    { type: "question", quizId: "q-harm-p5-c202-03" },
    { type: "a-toi", titre: "Construis, puis joue",
      consigne: "Joue la tab au clic : Do majeur puis Do mineur, note par note. Ensuite, choisis une autre note sur la corde 5 et construis sa triade majeure (+4, +7), puis mineure (+3, +7). Refais avec trois notes.",
      bloc: TAB_CORDE_5, bpm: 60, minuteur: 180 },
    { type: "recap", points: [
      "En demi-tons depuis la fondamentale : majeure +4 +7, mineure +3 +7.",
      "Diminuée +3 +6, augmentée +4 +8.",
      "Sur une même corde, un demi-ton = une case.",
    ] },
  ],
  quiz: ["q-fret-harm-01","q-fret-harm-02","q-harm-02","q-harm-03","q-harm-p5-c202-01","q-harm-p5-c202-02","q-harm-p5-c202-03"],
};

export const quiz = [
  {id:"q-fret-harm-01",type:"fretboard",courseId:"harmony",lessonId:"harm-c2-02",lvl:1,q:"Trouve toutes les notes de Do majeur (Do Mi Sol) sur le manche",concept:{type:"find_chord",root:"C",quality:"maj"},selectionRules:{mode:"all"},display:{showNotes:false},hint:"Do majeur = Do + Mi (3ce M) + Sol (5te).",xp:45,exp:"Triade Do majeur : 3 notes distinctes, nombreuses positions sur le manche."},
  {id:"q-fret-harm-02",type:"fretboard",courseId:"harmony",lessonId:"harm-c2-02",lvl:2,q:"Trouve toutes les notes de La mineur (La Do Mi)",concept:{type:"find_chord",root:"A",quality:"min"},selectionRules:{mode:"all"},display:{showNotes:false},hint:"La mineur = La + Do (3ce m) + Mi (5te). Compare avec La majeur (Do#).",xp:45,exp:"Am : La-Do-Mi. La tierce mineure (Do vs Do#) fait toute la différence."},
  {id:"q-harm-p5-c202-01",courseId:"harmony",lessonId:"harm-c2-02",lvl:1,q:"Quelles notes forment l'accord de Fa majeur ?",o:["Fa-La-Do","Fa-La♭-Do","Fa-La-Do#","Fa-Sol-Do"],a:0,exp:"Fa + 4 demi-tons = La (tierce majeure), Fa + 7 = Do (quinte juste). La♭ donnerait Fa mineur.",xp:30},
  {id:"q-harm-p5-c202-02",courseId:"harmony",lessonId:"harm-c2-02",lvl:2,q:"Quelles notes forment l'accord de La augmenté ?",o:["La-Do#-Fa","La-Do#-Mi","La-Do-Mi♭","La-Do-Fa"],a:0,exp:"Augmenté = +4 et +8 demi-tons : La + 4 = Do#, La + 8 = Fa (écrit Mi# en notation stricte). La-Do#-Mi est La majeur, La-Do-Mi♭ La diminué.",xp:40},
  {id:"q-harm-p5-c202-03",courseId:"harmony",lessonId:"harm-c2-02",lvl:2,q:"Ré est en case 5 de la corde 5. Sur la même corde, à quelle case est sa tierce majeure, Fa# ?",o:["Case 9","Case 8","Case 10","Case 7"],a:0,exp:"Tierce majeure = 4 demi-tons = 4 cases : 5 + 4 = 9. La case 8 donne Fa, la tierce mineure (Ré mineur) ; la case 12, la quinte La.",xp:40},
];
