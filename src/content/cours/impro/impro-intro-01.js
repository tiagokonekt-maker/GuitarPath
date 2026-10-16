// Leçon du module « impro » + les questions de quiz qui s'y rattachent.
// Format « leçon en cartes » décrit dans src/content/README.md.

const TROIS_NOTES = { type: "fretboard", caption: "Tes 3 notes en La mineur : La (fondamentale), Do (tierce mineure), Mi (quinte)", data: {frets: 5, startFret: 4, showStringNames: true, showFretNumbers: true, markerFrets: [5,7,9], notes: [{string: 6, fret: 5, label: "La", color: "amber", root: true}, {string: 6, fret: 8, label: "Do", color: "primary"}, {string: 5, fret: 7, label: "Mi", color: "primary"}]} };

export default {
  id: "impro-intro-01", level: 2,
  title: "Ta première improvisation : 3 notes, en rythme",
  duration: 7,
  gropiTip: "Choisis un motif noire-noire-blanche et place La, Do et Mi une fois chacun : il existe 6 ordres possibles, donc déjà 6 phrases différentes sur le même rythme.",
  cartes: [
    { type: "idee", titre: "Improviser, c'est choisir", texte: [
      "Improviser, ce n'est ni connaître toute la pentatonique, ni jouer vite : c'est faire des choix, même avec très peu de matière.",
      "Trois notes bien placées, c'est déjà improviser.",
    ] },
    { type: "idee", titre: "Trois notes que tu joues déjà", texte: [
      "Tes trois notes : La, Do et Mi. Tu les joues déjà ensemble, dans un des accords de Premiers pas. Plus tard, tu les retrouveras dans la pentatonique mineure.",
    ] },
    { type: "question", quizId: "q-impro-33" },
    { type: "idee", titre: "Sous la main, case 5", texte: [
      "Pour improviser, on les prend sur les cordes graves, groupées : La (corde 6, case 5), Mi (corde 5, case 7).",
      "Et Do ? Sur la corde 6 lui aussi, trois demi-tons au-dessus de La. La main ne bouge pas.",
    ] },
    { type: "question", quizId: "q-impro-36" },
    { type: "idee", titre: "Le rythme d'abord", texte: [
      "Ta seule variable : QUAND tu joues, pas QUOI. Une note bien placée vaut mieux qu'une gamme jouée sans intention : B.B. King l'a prouvé toute sa carrière, avec peu de notes.",
    ], bloc: { type: "rhythm_grid", caption: "Une idée rythmique pour tes 3 notes : une attaque sur le 1, le « et de 2 » et le 4, du silence ailleurs", data: {beats: 4, subdivision: 8, highlights: [0,3,6], muted: [1,2,4,5,7], label: "1 · – · – · [et] · – · – · 4 · –"} } },
    { type: "a-toi", titre: "Deux minutes, trois notes", consigne: "Index sur La, auriculaire sur Do, annulaire sur Mi. Au clic, varie le rythme et les silences, jamais les notes. Pars du motif 1, « et » du 2, 4, puis invente les tiens.", bloc: TROIS_NOTES, bpm: 70, minuteur: 120 },
    { type: "question", quizId: "q-impro-32" },
    { type: "recap", points: [
      "Improviser = faire des choix, même avec trois notes.",
      "La, Do, Mi : les notes de La mineur, case 5 sur les cordes 6 et 5.",
      "Le rythme d'abord : varie quand tu joues, pas quoi.",
    ] },
  ],
  quiz: ["q-impro-32","q-impro-33","q-impro-36"],
};

export const quiz = [
  {id:"q-impro-32",courseId:"impro",lessonId:"impro-intro-01",lvl:1,q:"Dans l'exercice des 3 notes, sur quoi porte l'attention principale ?",o:["Jouer le plus de notes possible","La vitesse d'exécution","Utiliser toute la gamme pentatonique","Le rythme et le placement des notes"],a:3,exp:"L'exercice isole volontairement le choix des notes (3 seulement) pour que toute l'attention se porte sur QUAND elles sont jouées, pas lesquelles.",xp:25},
  {id:"q-impro-33",courseId:"impro",lessonId:"impro-intro-01",lvl:1,q:"Tes trois notes La, Do et Mi sont les notes de quel accord ?",o:["La mineur","Do majeur","Mi mineur","La majeur"],a:0,exp:"La, Do, Mi = La mineur (Am), l'accord vu dans Premiers pas. C'est pour ça qu'elles sonnent juste sur un fond en La mineur : ce sont les notes mêmes de l'accord. La majeur aurait Do# à la place de Do.",xp:25},
  {id:"q-impro-36",courseId:"impro",lessonId:"impro-intro-01",lvl:1,q:"La est à la case 5 de la corde 6. Sur cette même corde, où trouves-tu Do ?",o:["Case 8","Case 7","Case 9","Case 3"],a:0,exp:"Do est 3 demi-tons au-dessus de La : 5 + 3 = 8. Tes trois notes tiennent sous la main : La (corde 6, case 5), Do (corde 6, case 8), Mi (corde 5, case 7).",xp:30},
];
