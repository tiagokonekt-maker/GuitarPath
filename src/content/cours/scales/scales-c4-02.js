// Leçon du module « scales » + les questions de quiz qui s'y rattachent.
// Format « leçon en cartes » décrit dans src/content/README.md.

export default {
  id: "scales-c4-02", level: 8,
  title: "Qu'est-ce qu'un mode (la grande révélation)",
  duration: 9,
  gropiTip: "Pour trouver la gamme parente d'un mode, remonte jusqu'au degré I : La dorien est le IIe degré, donc la gamme parente commence un ton plus bas, sur Sol. La dorien = notes de Sol majeur.",
  cartes: [
    { type: "idee", titre: "Une gamme, un autre départ", texte: [
      "Un mode, c'est la gamme majeure jouée à partir d'un autre degré que sa tonique.",
      "Prends Do majeur et pars de Ré : Ré, Mi, Fa, Sol, La, Si, Do, Ré. Mêmes notes, mais Ré devient la fondamentale, et les écarts changent de place. Ce mode s'appelle Ré dorien.",
    ], bloc: { type: "note_grid", caption: "Ré dorien sur la corde 5 : les notes de Do majeur, mais de Ré à Ré — les écarts deviennent T-DT-T-T-T-DT-T", data: {string: 5, stringName: "La", maxFret: 17, highlights: [{fret: 5, label: "Ré", color: "amber"}, {fret: 7, label: "Mi", color: "primary"}, {fret: 8, label: "Fa", color: "primary"}, {fret: 10, label: "Sol", color: "primary"}, {fret: 12, label: "La", color: "primary"}, {fret: 14, label: "Si", color: "primary"}, {fret: 15, label: "Do", color: "primary"}, {fret: 17, label: "Ré", color: "amber"}]} } },
    { type: "idee", titre: "Sept degrés, sept modes", texte: [
      "I ionien (le majeur), II dorien, III phrygien, IV lydien, V mixolydien, VI éolien (le mineur naturel), VII locrien.",
      "Leurs noms sont empruntés à des peuples et régions de la Grèce antique.",
    ] },
    { type: "question", quizId: "q-scales-12" },
    { type: "idee", titre: "Mêmes notes, autre ambiance", texte: [
      "Les sept modes de Do majeur se partagent un seul réservoir de notes. Ce qui change, c'est la note sur laquelle l'oreille se pose.",
      "Posé sur Mi, ça sonne espagnol et tendu. Sur Fa, flottant. Sur Sol, rock.",
    ], bloc: { type: "scale_pattern", caption: "Ré dorien — le même réservoir que la gamme parente, mais la fondamentale est Ré (case 5 corde 5, case 7 corde 3)", data: {startFret: 4, endFret: 8, rootColor: "amber", noteColor: "primary", strings: [{frets: [5,7,8], root: []}, {frets: [5,7,8], root: [5]}, {frets: [5,7], root: []}, {frets: [4,5,7], root: [7]}, {frets: [5,6,8], root: []}, {frets: [5,7,8], root: []}], noteMap: {"5,0":"La", "7,0":"Si", "8,0":"Do", "5,1":"Ré", "7,1":"Mi", "8,1":"Fa", "5,2":"Sol", "7,2":"La", "4,3":"Si", "5,3":"Do", "7,3":"Ré", "5,4":"Mi", "6,4":"Fa", "8,4":"Sol", "5,5":"La", "7,5":"Si", "8,5":"Do"}} } },
    { type: "question", quizId: "q-scales-13" },
    { type: "idee", titre: "Modes majeurs, modes mineurs", texte: [
      "La tierce donne la couleur de base. Tierce majeure, à 4 demi-tons : ionien, lydien, mixolydien.",
      "Tierce mineure, à 3 demi-tons : dorien, phrygien, éolien, locrien. Les leçons suivantes les prennent un par un.",
    ] },
    { type: "a-toi", titre: "Deux drones, mêmes notes",
      consigne: "Laisse sonner la corde 4 à vide et joue la première mesure : Do majeur de Ré à Ré, c'est du dorien. Puis corde 6 à vide, seconde mesure : les mêmes notes depuis Mi, c'est du phrygien. Au clic à 60, en laissant résonner le drone. Écoute l'ambiance basculer.",
      bloc: {
        type: "tab",
        caption: "Mesure 1 : Ré dorien sur le drone de Ré. Mesure 2 : Mi phrygien sur le drone de Mi",
        text: "Tab — mesure 1 : corde 4 cases 0, 2, 3, corde 3 cases 0, 2, 4, corde 2 cases 1 et 3 (Ré à Ré). Mesure 2 : corde 6 cases 0, 1, 3, corde 5 cases 0, 2, 3, corde 4 cases 0 et 2 (Mi à Mi).",
        data: { lines: [
          "e|-------------------------|-------------------------|",
          "B|-------------------1--3--|-------------------------|",
          "G|----------0--2--4--------|-------------------------|",
          "D|-0--2--3-----------------|-------------------0--2--|",
          "A|-------------------------|----------0--2--3--------|",
          "E|-------------------------|-0--1--3-----------------|",
        ] },
      }, bpm: 60, minuteur: 120 },
    { type: "question", quizId: "q-logic-08" },
    { type: "recap", points: [
      "Un mode = la gamme majeure jouée depuis un autre degré : 7 degrés, 7 modes.",
      "Les modes d'une même gamme ont les mêmes notes ; la fondamentale change l'ambiance.",
      "Tierce majeure : ionien, lydien, mixolydien. Tierce mineure : les quatre autres.",
    ] },
  ],
  quiz: ["q-scales-09","q-scales-12","q-scales-13","q-logic-03","q-logic-08","q-scales-03","q-scales-04","q-scales-08"],
};

export const quiz = [
  {id:"q-scales-09",courseId:"scales",lessonId:"scales-c4-02",lvl:2,q:"Le mode dorien correspond à quel degré de la gamme majeure ?",o:["1er","2e","3e","4e"],a:1,exp:"Dorien = 2e mode. Ré dorien = jouer Do majeur en partant de Ré. I=Ionien, II=Dorien, III=Phrygien, IV=Lydien, V=Mixolydien, VI=Éolien, VII=Locrien.",xp:35},
  {id:"q-scales-12",courseId:"scales",lessonId:"scales-c4-02",lvl:3,q:"En La majeur, quel est le mode joué en partant de Do# ?",o:["Do# phrygien","Do# dorien","Do# lydien","Do# locrien"],a:0,exp:"En La majeur, Do# est le 3e degré. Le 3e mode = phrygien. Do# phrygien = La majeur en partant de Do#. Notes : Do#-Ré-Mi-Fa#-Sol#-La-Si.",xp:55},
  {id:"q-scales-13",courseId:"scales",lessonId:"scales-c4-02",lvl:3,q:"Quelle paire de modes a EXACTEMENT les mêmes notes que Do majeur ?",o:["Mi dorien et Fa lydien","Ré dorien et Sol mixolydien","Sol dorien et La éolien","Si phrygien et Do# locrien"],a:1,exp:"Tous les modes de Do majeur partagent les mêmes 7 notes. Ré dorien (II) et Sol mixolydien (V) sont 2 modes de Do majeur. Aussi : Mi phrygien, Fa lydien, La éolien, Si locrien.",xp:55},
  {id:"q-logic-03",courseId:"scales",lessonId:"scales-c4-02",lvl:3,q:"Tous les modes de Do majeur (Ionien, Dorien, etc.) partagent…",o:["La même fondamentale","Le même tempo","Les mêmes 7 notes","La même couleur"],a:2,exp:"7 modes de Do majeur = 7 fondamentales différentes mais MÊMES NOTES (Do-Ré-Mi-Fa-Sol-La-Si). C'est la fondamentale qui change la couleur ressentie.",xp:50},
  {id:"q-logic-08",courseId:"scales",lessonId:"scales-c4-02",lvl:2,q:"Quel mode de Do majeur obtiens-tu en partant de Fa ?",o:["Fa lydien","Fa ionien","Fa mixolydien","Fa dorien"],a:0,exp:"Fa est le 4e degré de Do majeur ; le 4e mode est le lydien. Fa Sol La Si Do Ré Mi : le Si (quarte augmentée) est sa note caractéristique.",xp:55},
];
