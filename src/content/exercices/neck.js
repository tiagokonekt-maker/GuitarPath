// Exercices du module « neck ». Format décrit dans src/content/README.md.

export default [
  // ═══ MANCHE ═══
  {id:"ex-neck-01",mod:"neck",lvl:1,title:"Ancres corde 6 (4 notes)",dur:8,bpm:null,courseLink:"neck-c2-01",steps:["Sur la corde 6, joue successivement : Mi (0), La (5), Si (7), Mi (12).","Nomme chaque note à voix haute en la jouant.","Test : ferme les yeux, je dis 'Si' → ta main va case 7 sans hésiter.","Refais 5 cycles complets."],tip:"4 notes par corde suffisent à 'ancrer' tout le manche. Le reste se déduit.",xp:40},

  {id:"ex-neck-02",mod:"neck",lvl:1,title:"Notes naturelles corde 6",dur:10,bpm:60,courseLink:"neck-c2-01",steps:["À 60 BPM, joue corde 6 : Mi-Fa (0-1), Sol-La (3-5), Si-Do (7-8), Ré-Mi (10-12).","Nomme chaque note à voix haute.","Concentre-toi sur les 2 demi-tons : Mi-Fa et Si-Do.","Refais en descendant : Mi-Ré-Do-Si-La-Sol-Fa-Mi."],tip:"Mi-Fa et Si-Do = seuls demi-tons sans dièse. Ancre-les visuellement.",xp:45},

  {id:"ex-neck-03",mod:"neck",lvl:2,title:"Pattern octaves c6→c4",dur:10,bpm:null,courseLink:"neck-03",steps:["Joue Do (corde 6 case 8), puis son octave Do (corde 4 case 10). Pattern c6→c4 = +2 cases.","Refais avec Ré (corde 6 case 10 → corde 4 case 12).","Refais avec La (corde 6 case 5 → corde 4 case 7).","Joue ce pattern sur 5 fondamentales différentes."],tip:"Pattern c6→c4 = +2 cases. C'est ton réflexe principal.",xp:55},

  {id:"ex-neck-04",mod:"neck",lvl:2,title:"Octaves 4 patterns",dur:12,bpm:null,courseLink:"neck-03",steps:["Pattern 1 (c6→c4) : +2 cases","Pattern 2 (c5→c3) : +2 cases","Pattern 3 (c4→c2) : +3 cases (à cause de la tierce maj entre c3-c2)","Pattern 4 (c3→c1) : +3 cases","Pour chaque pattern, joue 5 fondamentales différentes."],tip:"Mémorise : +2 / +2 / +3 / +3. Cette asymétrie = la 'cassure' guitare.",xp:65},

  {id:"ex-neck-05",mod:"neck",lvl:2,title:"CAGED Am — 5 formes",dur:15,bpm:null,courseLink:"neck-04",steps:["Forme E barrée case 5 = Am (forme classique).","Forme D barrée case 7 (cordes 1-2-3-4) = Am.","Forme C barrée case 12 = Am (aigu).","Forme A en position ouverte case 0 = Am.","Forme G barrée case 2 = Am (difficile mais existe). Joue les 5 formes en remontant le manche."],tip:"Toutes les formes ne sont pas confortables, mais les connaître = liberté totale.",xp:75},

  {id:"ex-neck-06",mod:"neck",lvl:3,title:"Triades Do majeur — 3 inversions",dur:12,bpm:65,courseLink:"neck-05",steps:["Cordes 3-2-1, état fondamental (Do à la basse) : corde 3 case 5 (Do), corde 2 case 5 (Mi), corde 1 case 3 (Sol).","1ère inversion (Mi à la basse) : corde 3 case 9 (Mi), corde 2 case 8 (Sol), corde 1 case 8 (Do).","2e inversion (Sol à la basse) : corde 3 case 12 (Sol), corde 2 case 13 (Do), corde 1 case 12 (Mi).","Joue les 3 positions en boucle à 65 BPM, en montant puis en redescendant le manche."],tip:"Triades = unité minimale d'harmonie. 3 voicings par accord = 9 manières d'enrichir une chanson.",xp:65},

  {id:"ex-neck-07",mod:"neck",lvl:3,title:"Connexion accord-arpège-gamme",dur:15,bpm:60,courseLink:"neck-06",steps:["Plaque Cmaj7 forme E case 8.","Identifie ses 4 notes : Do (corde 6 case 8 / corde 1 case 8), Mi (corde 3 case 9), Sol (corde 5 case 10 / corde 2 case 8), Si (corde 4 case 9).","Joue l'arpège Cmaj7 ascendant (Do-Mi-Sol-Si-Do).","Joue Do majeur position 5 (c6 case 8) : 7 notes incluant l'arpège."],tip:"Voir l'accord, l'arpège et la gamme dans la même région = vision unifiée.",xp:80},

  // ═══ EXERCICES FRETBOARD INTERACTIFS ═══
  // type: "fretboard_exercise" → rendu par FretboardExercise dans ExerciseDetail

    {
      id:"ex-fret-01", type:"fretboard_exercise", mod:"neck", lvl:1,
      title:"Cartographie : notes naturelles", dur:12, xp:70,
      unlockedBy:["neck-c2-05"],
      courseLink:"neck-c2-05",
      stages:[
        {
          instruction:"Trouve tous les Do sur le manche",
          concept:{type:"find_note",root:"C"},
          selectionRules:{mode:"all"},
          fretRange:[0,12], stringRange:[1,6],
          display:{showNotes:false},
          hint:"Commence par la corde 6 (Mi grave). Do est case 8.",
          exp:"Do en corde 6 case 8, corde 5 case 3, corde 4 case 10, corde 3 case 5, corde 2 case 1, corde 1 case 8.",
          xp:15
        },
        {
          instruction:"Trouve tous les Sol sur le manche",
          concept:{type:"find_note",root:"G"},
          selectionRules:{mode:"all"},
          fretRange:[0,12], stringRange:[1,6],
          display:{showNotes:false},
          hint:"Sol est à vide sur la corde 3.",
          exp:"Sol en corde 6 case 3, corde 5 case 10, corde 4 case 5, corde 3 à vide, corde 2 case 3, corde 1 case 3.",
          xp:15
        },
        {
          instruction:"Trouve tous les Ré sur le manche",
          concept:{type:"find_note",root:"D"},
          selectionRules:{mode:"all"},
          fretRange:[0,12], stringRange:[1,6],
          display:{showNotes:false},
          hint:"Ré est à vide sur la corde 4.",
          exp:"Ré en corde 6 case 10, corde 5 case 5, corde 4 à vide, corde 3 case 7, corde 2 case 3, corde 1 case 10.",
          xp:15
        },
        {
          instruction:"Trouve tous les La sur le manche (fondamentales CAGED)",
          concept:{type:"find_note",root:"A"},
          selectionRules:{mode:"all"},
          fretRange:[0,12], stringRange:[1,6],
          display:{showNotes:false},
          hint:"La est à vide sur la corde 5.",
          exp:"La en corde 6 case 5, corde 5 à vide, corde 4 case 7, corde 3 case 2, corde 2 case 10, corde 1 case 5. Ce sont tes ancres CAGED.",
          xp:25
        }
      ],
      tip:"Ces 4 notes (Do Sol Ré La) forment un cycle de quintes. Les mémoriser c'est déjà cartographier le manche."
    },

  {
    id:"ex-fret-02", type:"fretboard_exercise", mod:"neck", lvl:2,
    title:"Intervalles : quintes et quartes sur le manche", dur:12, xp:80,
    unlockedBy:["neck-03"],
    courseLink:"neck-03",
    stages:[
      {
        instruction:"Trouve toutes les quintes de Mi (Si) sur le manche",
        concept:{type:"find_note",root:"B"},
        selectionRules:{mode:"all"},
        fretRange:[0,12], stringRange:[1,6],
        display:{showNotes:false},
        hint:"La quinte de Mi est Si. Si est à vide sur la corde 2.",
        exp:"Si en corde 6 case 7, corde 5 case 2, corde 4 case 9, corde 3 case 4, corde 2 à vide, corde 1 case 7.",
        xp:20
      },
      {
        instruction:"Trouve toutes les quintes de La (Mi) sur le manche",
        concept:{type:"find_note",root:"E"},
        selectionRules:{mode:"all"},
        fretRange:[0,12], stringRange:[1,6],
        display:{showNotes:false},
        hint:"La quinte de La est Mi. Mi est à vide sur cordes 6 et 1.",
        exp:"Mi en corde 6 à vide, corde 5 case 7, corde 4 case 2, corde 3 case 9, corde 2 case 5, corde 1 à vide.",
        xp:20
      },
      {
        instruction:"Trouve toutes les tierces majeures de Do (Mi) sur le manche",
        concept:{type:"find_note",root:"E"},
        selectionRules:{mode:"all"},
        fretRange:[0,12], stringRange:[1,6],
        display:{showNotes:false},
        hint:"La tierce majeure de Do est Mi (4 demi-tons au-dessus).",
        exp:"Mi en corde 6 à vide, corde 5 case 7, corde 4 case 2, corde 3 case 9, corde 2 case 5, corde 1 à vide. Même note que la quinte de La !",
        xp:20
      },
      {
        instruction:"Trouve toutes les tierces mineures de La (Do)",
        concept:{type:"find_note",root:"C"},
        selectionRules:{mode:"all"},
        fretRange:[0,12], stringRange:[1,6],
        display:{showNotes:false},
        hint:"La tierce mineure de La est Do (3 demi-tons). Do = case 8 corde 6.",
        exp:"Do en corde 6 case 8, corde 5 case 3, corde 4 case 10, corde 3 case 5, corde 2 case 1, corde 1 case 8.",
        xp:20
      }
    ],
    tip:"Un intervalle = une distance en demi-tons. Quinte (7dt) = la relation la plus forte en musique."
  },

  {
    id:"ex-fret-03", type:"fretboard_exercise", mod:"neck", lvl:2,
    title:"CAGED : ancres et fondamentales", dur:15, xp:90,
    unlockedBy:["neck-04"],
    courseLink:"neck-04",
    stages:[
      {
        instruction:"Trouve toutes les fondamentales Sol (ancres forme G-CAGED)",
        concept:{type:"find_note",root:"G"},
        selectionRules:{mode:"all"},
        fretRange:[0,12], stringRange:[1,6],
        display:{showNotes:false},
        hint:"Sol est à vide corde 3. C'est la fondamentale de la forme G.",
        exp:"Sol en corde 6 case 3, corde 5 case 10, corde 4 case 5, corde 3 à vide, corde 2 case 3, corde 1 case 3.",
        xp:20
      },
      {
        instruction:"Trouve toutes les notes de Am (La Do Mi) sur le manche",
        concept:{type:"find_chord",root:"A",quality:"min"},
        selectionRules:{mode:"all"},
        fretRange:[0,12], stringRange:[1,6],
        display:{showNotes:false},
        hint:"Am = La + Do (3ce mineure) + Mi (quinte). Compare avec Am7 (+ Sol).",
        exp:"Am : La (corde 6 case 5, corde 5 à vide, corde 4 case 7, corde 3 case 2, corde 2 case 10, corde 1 case 5), Do, Mi — tout le manche.",
        xp:25
      },
      {
        instruction:"Quiz CAGED : trouve les 5 zones en trouvant toutes les fondamentales La",
        concept:{type:"find_note",root:"A"},
        selectionRules:{mode:"all"},
        fretRange:[0,12], stringRange:[1,6],
        display:{showNotes:false},
        hint:"Chaque La est le centre d'une des 5 formes CAGED.",
        exp:"La en : corde 6 case 5 (forme E), corde 5 à vide (forme A), corde 4 case 7 (forme D ?), corde 3 case 2, corde 2 case 10, corde 1 case 5.",
        xp:30
      }
    ],
    tip:"Les fondamentales = tes ancres visuelles. Avant de voir les accords, vois les fondamentales."
  },

  {id:"ex-neck-pow-01",mod:"neck",lvl:1,title:"Power chords qui voyagent",dur:8,bpm:70,unlockedBy:["neck-pow-01"],courseLink:"neck-pow-01",steps:["E5 (022xxx) puis A5 (x022xx) : trois cordes seulement, les autres muettes.","Forme mobile sur la corde 6 : Sol (corde 6 case 3) pour G5, La (corde 6 case 5) pour A5.","Sur la corde 5 : Do (corde 5 case 3) pour C5, Ré (corde 5 case 5) pour D5.","Riff au clic à 70 : E5, E5, G5, E5, A5, E5, G5, E5, en croches, coups vers le bas et palm mute léger."],tip:"Garde la forme figée en te déplaçant : seul le bras bouge, les doigts ne changent pas d'écart.",xp:50},
];
