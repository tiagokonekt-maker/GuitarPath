// Leçon du module « neck » + les questions de quiz qui s'y rattachent.
// Format « leçon en cartes » décrit dans src/content/README.md.

export default {
  id: "neck-c2-05", level: 4,
  title: "Les notes des cordes Si et Mi aigu (cordes 2 et 1)",
  duration: 8,
  gropiTip: "Pour la corde 2, retranche 7 aux cases de la corde 6 : Do (case 8) → case 1, Ré (10) → case 3, Mi (12) → case 5. Même nom de note, à une autre octave.",
  cartes: [
    { type: "idee", titre: "Les cordes qui chantent", texte: [
      "Les cordes 2 et 1 portent les mélodies et les solos aigus. On termine la carte du manche avec elles.",
      "Corde 2 : Si (0), Do (1), Ré (3), Mi (5), Fa (6), Sol (8), La (10), Si (12).",
    ], bloc: {
      type: "note_grid",
      caption: "Corde 2 (Si) — Si-Do collé dès la case 0-1",
      data: {
        string: 2, stringName: "Si", maxFret: 12,
        highlights: [
          { fret: 0,  label: "Si",  color: "amber" },
          { fret: 1,  label: "Do",  color: "primary" },
          { fret: 3,  label: "Ré",  color: "green" },
          { fret: 5,  label: "Mi",  color: "amber" },
          { fret: 6,  label: "Fa",  color: "green" },
          { fret: 8,  label: "Sol", color: "green" },
          { fret: 10, label: "La",  color: "green" },
          { fret: 12, label: "Si",  color: "amber" },
        ],
      },
    } },
    { type: "question", quizId: "q-neck-24" },
    { type: "idee", titre: "La corde 1, tu la connais déjà", texte: [
      "La corde 1 porte exactement les mêmes notes que la corde 6, deux octaves plus haut.",
      "Mi (0), Fa (1), Sol (3), La (5), Si (7), Do (8), Ré (10), Mi (12) : tout ce que tu as appris sur la corde 6 est gratuit ici.",
    ], bloc: {
      type: "note_grid",
      caption: "Corde 1 (Mi aigu) — identique à la corde 6, 2 octaves plus haut",
      data: {
        string: 1, stringName: "Mi aigu", maxFret: 12,
        highlights: [
          { fret: 0,  label: "Mi",  color: "amber" },
          { fret: 1,  label: "Fa",  color: "green" },
          { fret: 3,  label: "Sol", color: "green" },
          { fret: 5,  label: "La",  color: "green" },
          { fret: 7,  label: "Si",  color: "green" },
          { fret: 8,  label: "Do",  color: "primary" },
          { fret: 10, label: "Ré",  color: "green" },
          { fret: 12, label: "Mi",  color: "amber" },
        ],
      },
    } },
    { type: "question", quizId: "q-neck-25" },
    { type: "idee", titre: "Une triade sur les cordes aiguës", texte: [
      "Sol (corde 3, case 0), Do (corde 2, case 1), Mi (corde 1, case 0) : les trois notes de Do majeur, sur les trois cordes aiguës.",
      "Ces petites formes à trois cordes sont partout en pop, en funk et en R&B.",
    ] },
    { type: "question", quizId: "q-neck-26" },
    { type: "idee", titre: "Les six cordes sont cartographiées", texte: [
      "Tu as maintenant les notes des six cordes. Il faudra quelques semaines de jeu quotidien pour les automatiser.",
      "Le meilleur exercice : chercher une même note sur toutes les cordes.",
    ] },
    { type: "a-toi", titre: "Tous les Do en 60 secondes",
      consigne: "Trouve les six Do des 12 premières cases, un par corde, de la corde 6 à la corde 1, puis redescends en les nommant. Essaie sans regarder, puis vérifie sur le schéma. Recommence avec Sol, Mi et Ré.",
      bloc: {
        type: "fretboard",
        caption: "Les six Do des cases 0 à 12, un par corde",
        data: {
          frets: 12, startFret: 0,
          showStringNames: true, showFretNumbers: true,
          markerFrets: [3, 5, 7, 9, 12],
          notes: [
            { string: 6, fret: 8,  label: "Do", color: "primary", root: true },
            { string: 5, fret: 3,  label: "Do", color: "primary", root: true },
            { string: 4, fret: 10, label: "Do", color: "primary", root: true },
            { string: 3, fret: 5,  label: "Do", color: "primary", root: true },
            { string: 2, fret: 1,  label: "Do", color: "primary", root: true },
            { string: 1, fret: 8,  label: "Do", color: "primary", root: true },
          ],
        },
      }, minuteur: 60 },
    { type: "question", quizId: "q-neck-06" },
    { type: "recap", points: [
      "Corde 2 : Si 0, Do 1, Ré 3, Mi 5, Fa 6, Sol 8, La 10, Si 12.",
      "Corde 1 = corde 6, deux octaves plus haut.",
      "Chaque note apparaît une fois par corde entre les cases 0 et 11.",
    ] },
  ],
  quiz: ["q-neck-06","q-neck-24","q-neck-25","q-neck-26","q-fret-neck-01","q-fret-neck-02","q-fret-neck-03","q-fret-neck-04"],
};

export const quiz = [
  {id:"q-neck-06",courseId:"neck",lessonId:"neck-c2-05",lvl:3,q:"Combien y a-t-il de Do sur les 12 premières cases d'une guitare 6 cordes en accordage standard ?",o:["5","3","4","6"],a:3,exp:"Un Do par corde entre les cases 0 et 12 : corde 6 case 8, corde 5 case 3, corde 4 case 10, corde 3 case 5, corde 2 case 1, corde 1 case 8. Soit 6 en tout.",xp:50},
  {id:"q-neck-24",courseId:"neck",lessonId:"neck-c2-05",lvl:2,q:"Sur la corde 2 (Si), entre quelles cases trouve-t-on le demi-ton Si-Do ?",o:["Case 4 et 5","Case 9 et 10","Case 0 et 1","Case 7 et 8"],a:2,exp:"Sur la corde 2, Si (à vide) et Do (case 1) sont immédiatement adjacents — le demi-ton naturel tombe dès le début du manche.",xp:35},
  {id:"q-neck-25",courseId:"neck",lessonId:"neck-c2-05",lvl:2,q:"La corde 1 (Mi aigu) porte exactement les mêmes notes qu'une autre corde, mais 2 octaves plus haut. Laquelle ?",o:["La corde 5","La corde 4","La corde 2","La corde 6"],a:3,exp:"Cordes 1 et 6 sont toutes deux accordées en Mi, à 2 octaves d'écart. Ce que tu apprends sur la corde 6 est donc gratuit sur la corde 1.",xp:40},
  {id:"q-neck-26",courseId:"neck",lessonId:"neck-c2-05",lvl:3,q:"Sur la corde 1 (Mi aigu), quelle note trouve-t-on à la case 8 ?",o:["Do","Si","Ré","La"],a:0,exp:"0 Mi, 1 Fa, 3 Sol, 5 La, 7 Si, 8 Do — identique à la corde 6, simplement 2 octaves plus haut.",xp:45},
  {id:"q-fret-neck-01",type:"fretboard",courseId:"neck",lessonId:"neck-c2-05",lvl:1,q:"Trouve toutes les notes Do (C) sur le manche",concept:{type:"find_note",root:"C"},selectionRules:{mode:"all"},display:{showNotes:false},hint:"Case 8 corde 6, case 3 corde 5.",xp:40,exp:"Do se trouve en corde 6 case 8, corde 5 case 3, corde 4 case 10, corde 3 case 5, corde 2 case 1, corde 1 case 8."},
  {id:"q-fret-neck-02",type:"fretboard",courseId:"neck",lessonId:"neck-c2-05",lvl:1,q:"Trouve toutes les notes Sol (G) sur le manche",concept:{type:"find_note",root:"G"},selectionRules:{mode:"all"},display:{showNotes:false},hint:"Sol est la corde 3 à vide.",xp:40,exp:"Sol en : corde 6 case 3, corde 5 case 10, corde 4 case 5, corde 3 à vide, corde 2 case 3, corde 1 case 3."},
  {id:"q-fret-neck-03",type:"fretboard",courseId:"neck",lessonId:"neck-c2-05",lvl:1,q:"Trouve toutes les notes Mi (E) sur le manche",concept:{type:"find_note",root:"E"},selectionRules:{mode:"all"},display:{showNotes:false},hint:"Mi est à vide sur les cordes 6 et 1.",xp:40,exp:"Mi en : corde 6 à vide, corde 5 case 7, corde 4 case 2, corde 3 case 9, corde 2 case 5, corde 1 à vide."},
  {id:"q-fret-neck-04",type:"fretboard",courseId:"neck",lessonId:"neck-c2-05",lvl:1,q:"Trouve toutes les notes Ré (D) sur le manche",concept:{type:"find_note",root:"D"},selectionRules:{mode:"all"},display:{showNotes:false},hint:"Ré est à vide sur la corde 4.",xp:40,exp:"Ré en : corde 6 case 10, corde 5 case 5, corde 4 à vide, corde 3 case 7, corde 2 case 3, corde 1 case 10."},
];
