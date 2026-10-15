// Leçon du module « neck » + les questions de quiz qui s'y rattachent.
// Format décrit dans src/content/README.md.

export default {
  id: "neck-c2-05", level: 4,
  title: "Les notes des cordes Si et Mi aigu (cordes 2 et 1)",
  duration: 9,
  content: [
    { type: "p", text: "On termine la cartographie avec les cordes 2 (Si) et 1 (Mi aigu). Ces deux cordes sont les plus utilisées pour les mélodies, les solos aigus, et les triades. Leur connaissance est essentielle pour tout jeu mélodique." },
    { type: "h", text: "Corde 2 (Si) — case par case" },
    { type: "p", text: "Case 0 = Si. Case 1 = Do. Case 2 = Do#. Case 3 = Ré. Case 4 = Ré#. Case 5 = Mi. Case 6 = Fa. Case 7 = Fa#. Case 8 = Sol. Case 9 = Sol#. Case 10 = La. Case 11 = La#. Case 12 = Si (octave)." },
    { type: "h", text: "Demi-tons naturels sur c2" },
    { type: "p", text: "Si-Do : entre cases 0 et 1 (immédiatement !). Mi-Fa : entre cases 5 et 6. Sur la corde 2, le demi-ton Si-Do est presque collé à la corde à vide. C'est facile à mémoriser." },
    { type: "h", text: "Corde 1 (Mi aigu) — case par case" },
    { type: "p", text: "Case 0 = Mi. Case 1 = Fa. Case 2 = Fa#. Case 3 = Sol. Case 4 = Sol#. Case 5 = La. Case 6 = La#. Case 7 = Si. Case 8 = Do. Case 9 = Do#. Case 10 = Ré. Case 11 = Ré#. Case 12 = Mi (octave)." },
    { type: "h", text: "Le secret : c1 et c6 = même configuration" },
    { type: "p", text: "Tu vois ? La corde 1 (Mi aigu) a EXACTEMENT les mêmes notes que la corde 6 (Mi grave), mais 2 octaves plus haut. Ce que tu apprends sur la corde 6 est gratuit sur la corde 1. C'est l'une des meilleures nouvelles de la guitare en accordage standard." },
    {
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
    },
    {
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
    },
    { type: "h", text: "L'usage des cordes aiguës" },
    { type: "p", text: "Les cordes 2 et 1 sont LES cordes mélodiques par excellence. Elles portent la majorité des mélodies vocales transposées sur la guitare, des solos aigus, et des notes 'qui chantent'. Quand tu fais un solo dans la zone aiguë (cases 8-15 sur cordes 1 et 2), tu es dans le territoire des grands solistes." },
    { type: "h", text: "Triades sur cordes 1-2-3" },
    { type: "p", text: "Les triades sur les 3 cordes aiguës sont la 'signature' du jeu moderne. Pour Do majeur en position fondamentale : Sol(corde 3 case 12 ou case 0), Do(corde 2 case 1 ou 13), Mi(corde 1 case 12 ou 0). Cette forme triangulaire est utilisée dans toute la pop, le R&B, le funk." },
    { type: "h", text: "Bilan : tu connais le manche !" },
    { type: "p", text: "Si tu as suivi les 5 dernières leçons, tu as maintenant cartographié les 6 cordes. C'est un travail de plusieurs semaines pour automatiser, mais la théorie est en place. Continue les drills, joue tous les jours, et dans 1-2 mois, tu connaîtras le manche aussi naturellement que ton alphabet." },
    { type: "ref", text: "Le solo final de 'Hotel California' (Eagles) utilise massivement les cordes 1 et 2 dans les zones aiguës. Si tu apprends ce solo, tu vas naturellement intégrer la position des notes sur ces cordes." },
    { type: "tip", text: "Drill spécifique aux cordes aiguës : joue une note simple sur la corde 1 (ex : Sol case 3). Trouve immédiatement le même Sol sur la corde 6 case 3. Comprends que c'est la même note, à 2 octaves d'écart. Refais avec La, Si, Do, Ré." },
  ],
  quiz: ["q-neck-06","q-neck-24","q-neck-25","q-neck-26","q-fret-neck-01","q-fret-neck-02","q-fret-neck-03","q-fret-neck-04"],
};

export const quiz = [
  {id:"q-neck-06",courseId:"neck",lessonId:"neck-c2-05",lvl:3,q:"Combien y a-t-il de Do sur les 12 premières cases d'une guitare 6 cordes en accordage standard ?",o:["5","3","4","6"],a:0,exp:"Do est présent sur : corde 5 case 3, corde 4 case 10, corde 3 case 5, corde 2 case 1, corde 2 case 13. Total = 5 occurrences sur les 12 premières cases. Bonus : corde 1 case 8 (Do en aigu) ferait 6 si on étend.",xp:50},
  {id:"q-neck-24",courseId:"neck",lessonId:"neck-c2-05",lvl:2,q:"Sur la corde 2 (Si), entre quelles cases trouve-t-on le demi-ton Si-Do ?",o:["Case 4 et 5","Case 9 et 10","Case 0 et 1","Case 7 et 8"],a:2,exp:"Sur la corde 2, Si (à vide) et Do (case 1) sont immédiatement adjacents — le demi-ton naturel tombe dès le début du manche.",xp:35},
  {id:"q-neck-25",courseId:"neck",lessonId:"neck-c2-05",lvl:2,q:"La corde 1 (Mi aigu) porte exactement les mêmes notes qu'une autre corde, mais 2 octaves plus haut. Laquelle ?",o:["La corde 5","La corde 4","La corde 2","La corde 6"],a:3,exp:"Cordes 1 et 6 sont toutes deux accordées en Mi, à 2 octaves d'écart. Ce que tu apprends sur la corde 6 est donc gratuit sur la corde 1.",xp:40},
  {id:"q-neck-26",courseId:"neck",lessonId:"neck-c2-05",lvl:3,q:"Sur la corde 1 (Mi aigu), quelle note trouve-t-on à la case 8 ?",o:["Do","Si","Ré","La"],a:0,exp:"0 Mi, 1 Fa, 3 Sol, 5 La, 7 Si, 8 Do — identique à la corde 6, simplement 2 octaves plus haut.",xp:45},
  {id:"q-fret-neck-01",type:"fretboard",courseId:"neck",lessonId:"neck-c2-05",lvl:1,q:"Trouve toutes les notes Do (C) sur le manche",concept:{type:"find_note",root:"C"},selectionRules:{mode:"all"},display:{showNotes:false},hint:"Case 8 corde 6, case 3 corde 5.",xp:40,exp:"Do se trouve en corde 6 case 8, corde 5 case 3, corde 4 case 10, corde 3 case 5, corde 2 case 1, corde 1 case 8."},
  {id:"q-fret-neck-02",type:"fretboard",courseId:"neck",lessonId:"neck-c2-05",lvl:1,q:"Trouve toutes les notes Sol (G) sur le manche",concept:{type:"find_note",root:"G"},selectionRules:{mode:"all"},display:{showNotes:false},hint:"Sol est la corde 3 à vide.",xp:40,exp:"Sol en : corde 6 case 3, corde 5 case 10, corde 4 case 5, corde 3 à vide, corde 2 case 3, corde 1 case 3."},
  {id:"q-fret-neck-03",type:"fretboard",courseId:"neck",lessonId:"neck-c2-05",lvl:1,q:"Trouve toutes les notes Mi (E) sur le manche",concept:{type:"find_note",root:"E"},selectionRules:{mode:"all"},display:{showNotes:false},hint:"Mi est à vide sur les cordes 6 et 1.",xp:40,exp:"Mi en : corde 6 à vide, corde 5 case 7, corde 4 case 2, corde 3 case 9, corde 2 case 5, corde 1 à vide."},
  {id:"q-fret-neck-04",type:"fretboard",courseId:"neck",lessonId:"neck-c2-05",lvl:1,q:"Trouve toutes les notes Ré (D) sur le manche",concept:{type:"find_note",root:"D"},selectionRules:{mode:"all"},display:{showNotes:false},hint:"Ré est à vide sur la corde 4.",xp:40,exp:"Ré en : corde 6 case 10, corde 5 case 5, corde 4 à vide, corde 3 case 7, corde 2 case 3, corde 1 case 10."},
];
