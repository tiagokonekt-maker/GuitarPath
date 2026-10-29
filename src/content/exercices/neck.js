// Exercices du module « neck ». Format décrit dans src/content/README.md.

export default [
  // ═══ MANCHE ═══
  {id:"ex-neck-01",mod:"neck",lvl:1,title:"Ancres corde 6 (4 notes)",dur:8,bpm:null,courseLink:"neck-c2-01",steps:["Sur la corde 6, joue successivement : Mi (0), La (5), Si (7), Mi (12).","Nomme chaque note à voix haute en la jouant.","Test : ferme les yeux, je dis 'Si' → ta main va case 7 sans hésiter.","Refais 5 cycles complets."],tip:"4 notes par corde suffisent à 'ancrer' tout le manche. Le reste se déduit.",xp:40},

  {id:"ex-neck-02",mod:"neck",lvl:1,title:"Notes naturelles corde 6",dur:10,bpm:60,courseLink:"neck-c2-01",steps:["À 60 BPM, joue corde 6 : Mi-Fa (0-1), Sol-La (3-5), Si-Do (7-8), Ré-Mi (10-12).","Nomme chaque note à voix haute.","Concentre-toi sur les 2 demi-tons : Mi-Fa et Si-Do.","Refais en descendant : Mi-Ré-Do-Si-La-Sol-Fa-Mi."],tip:"Mi-Fa et Si-Do = seuls demi-tons sans dièse. Ancre-les visuellement.",xp:45},

  {id:"ex-neck-03",mod:"neck",lvl:2,title:"Pattern octaves c6→c4",dur:10,bpm:null,courseLink:"neck-03",steps:["Joue Do (corde 6 case 8), puis son octave Do (corde 4 case 10). Pattern c6→c4 = +2 cases.","Refais avec Ré (corde 6 case 10 → corde 4 case 12).","Refais avec La (corde 6 case 5 → corde 4 case 7).","Joue ce pattern sur 5 fondamentales différentes."],tip:"Pattern c6→c4 = +2 cases. C'est ton réflexe principal.",xp:55},

  {id:"ex-neck-04",mod:"neck",lvl:2,title:"Octaves 4 patterns",dur:12,bpm:null,courseLink:"neck-03",steps:["Pattern 1 (c6→c4) : +2 cases","Pattern 2 (c5→c3) : +2 cases","Pattern 3 (c4→c2) : +3 cases (à cause de la tierce maj entre c3-c2)","Pattern 4 (c3→c1) : +3 cases","Pour chaque pattern, joue 5 fondamentales différentes."],tip:"Mémorise : +2 / +2 / +3 / +3. Cette asymétrie = la 'cassure' guitare.",xp:65},

  {id:"ex-neck-05",mod:"neck",lvl:2,title:"CAGED Do — 5 formes",dur:15,bpm:60,courseLink:"neck-04",steps:["Forme C : le Do ouvert (x32010), fondamentale Do (corde 5 case 3).","Forme A : barré case 3 (x35553), même fondamentale sous l'index.","Forme G : 8-7-5-5-5-8, fondamentales Do (corde 6 case 8) et Do (corde 3 case 5) ; trop étirée, garde seulement les quatre cordes aiguës (5-5-5-8).","Forme E : barré case 8 (8-10-10-9-8-8), puis forme D : x-x-10-12-13-12, fondamentale Do (corde 4 case 10).","Enchaîne les cinq formes en montant puis en redescendant, quatre coups chacune au clic à 60."],tip:"Avant de plaquer une forme, pose d'abord le doigt de la fondamentale : c'est lui qui te dit où tu es sur le manche.",xp:75},

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
        exp:"La en : corde 6 case 5 (formes G et E), corde 5 à vide et case 12 (formes A et C), corde 4 case 7 (forme D), corde 3 case 2 (formes A et G), corde 2 case 10 (forme D), corde 1 case 5 (formes G et E).",
        xp:30
      }
    ],
    tip:"Les fondamentales = tes ancres visuelles. Avant de voir les accords, vois les fondamentales."
  },

  {id:"ex-neck-pow-01",mod:"neck",lvl:1,title:"Power chords qui voyagent",dur:8,bpm:70,unlockedBy:["neck-pow-01"],courseLink:"neck-pow-01",steps:["E5 (022xxx) puis A5 (x022xx) : trois cordes seulement, les autres muettes.","Forme mobile sur la corde 6 : Sol (corde 6 case 3) pour G5, La (corde 6 case 5) pour A5.","Sur la corde 5 : Do (corde 5 case 3) pour C5, Ré (corde 5 case 5) pour D5.","Riff au clic à 70 : E5, E5, G5, E5, A5, E5, G5, E5, en croches, coups vers le bas et palm mute léger."],tip:"Garde la forme figée en te déplaçant : seul le bras bouge, les doigts ne changent pas d'écart.",xp:50},

  // ═══ UN EXERCICE PAR LEÇON (paliers 1 à 5) ═══
  {id:"ex-neck-c1-01-01",mod:"neck",lvl:1,title:"Quartes, demi-tons et la cassure",dur:8,bpm:60,unlockedBy:["neck-c1-01"],courseLink:"neck-c1-01",steps:["Au clic à 60 : corde 6 case 5, puis corde 5 à vide. Même chose entre les cordes 5 et 4, puis 4 et 3 : chaque paire sonne à l'unisson.","Corde 3 : monte case par case depuis la case 2 jusqu'à trouver celle qui sonne comme la corde 2 à vide. Note-la.","Corde 2 case 5, puis corde 1 à vide : retour à la règle des 5 cases.","Corde 1, de la case 0 à la case 12, une case par clic en comptant les demi-tons : à 12, tu retrouves Mi une octave plus haut.","Joue Do (corde 5 case 3), puis le même Do sur la corde 6 (case 8) ; enfin Mi (corde 2 case 5), puis le même Mi sur la corde 3 (case 9). Compte l'écart de cases à chaque fois."],tip:"Retiens deux nombres : 5 cases entre cordes voisines, 4 seulement entre Sol et Si.",xp:40},

  {
    id:"ex-neck-c1-02-01", type:"fretboard_exercise", mod:"neck", lvl:1,
    title:"Octaves : une note, plusieurs places", dur:10, xp:60,
    unlockedBy:["neck-c1-02"],
    courseLink:"neck-c1-02",
    stages:[
      {
        instruction:"Trouve tous les Mi, de la corde à vide à la case 12, sur les six cordes",
        concept:{type:"find_note",root:"E"},
        selectionRules:{mode:"all"},
        fretRange:[0,12], stringRange:[1,6],
        display:{showNotes:false},
        hint:"Pars des cordes à vide : +12 cases redonne la même note. Pense aussi aux trois Mi de ton accord de Mi mineur.",
        exp:"Mi : corde 6 à vide et case 12, corde 5 case 7, corde 4 case 2, corde 3 case 9, corde 2 case 5, corde 1 à vide et case 12. Six places, trois hauteurs (plus l'octave de la case 12).",
        xp:20
      },
      {
        instruction:"Cordes 6 et 5 seulement : trouve tous les La jusqu'à la case 12",
        concept:{type:"find_note",root:"A"},
        selectionRules:{mode:"all"},
        fretRange:[0,12], stringRange:[5,6],
        display:{showNotes:false},
        hint:"Une corde à vide et son octave, plus un point de repère sur la corde 6.",
        exp:"La : corde 5 à vide, corde 5 case 12 (l'octave), corde 6 case 5.",
        xp:20
      },
      {
        instruction:"Trouve tous les Sol du manche, de la corde à vide à la case 12",
        concept:{type:"find_note",root:"G"},
        selectionRules:{mode:"all"},
        fretRange:[0,12], stringRange:[1,6],
        display:{showNotes:false},
        hint:"Une corde à vide porte ce nom : n'oublie pas son octave.",
        exp:"Sol : corde 6 case 3, corde 5 case 10, corde 4 case 5, corde 3 à vide et case 12, corde 2 case 8, corde 1 case 3.",
        xp:20
      }
    ],
    tip:"Pour chaque note trouvée, joue-la sur ta guitare : même nom, autre hauteur, autre timbre."
  },

  {
    id:"ex-neck-c1-03-01", type:"fretboard_exercise", mod:"neck", lvl:1,
    title:"Les points du manche comme GPS", dur:8, xp:55,
    unlockedBy:["neck-c1-03"],
    courseLink:"neck-c1-03",
    stages:[
      {
        instruction:"Cordes 6 et 5 : trouve tous les Ré",
        concept:{type:"find_note",root:"D"},
        selectionRules:{mode:"all"},
        fretRange:[0,12], stringRange:[5,6],
        display:{showNotes:false},
        hint:"Pars du point le plus proche et compte : une case = un demi-ton.",
        exp:"Ré : corde 5 case 5 (sous le point), corde 6 case 10 (un ton au-dessus du point de la case 9… ou deux cases sous l'octave).",
        xp:10
      },
      {
        instruction:"Cordes 6 et 5 : trouve tous les Do",
        concept:{type:"find_note",root:"C"},
        selectionRules:{mode:"all"},
        fretRange:[0,12], stringRange:[5,6],
        display:{showNotes:false},
        hint:"Sur l'une des deux cordes, il est pile sous un point.",
        exp:"Do : corde 5 case 3 (sous le point), corde 6 case 8 (Si sous le point de la case 7, plus un demi-ton).",
        xp:15
      },
      {
        instruction:"Cordes 6 et 5 : trouve tous les Fa",
        concept:{type:"find_note",root:"F"},
        selectionRules:{mode:"all"},
        fretRange:[0,12], stringRange:[5,6],
        display:{showNotes:false},
        hint:"Aucun n'est sous un point : pars du repère voisin.",
        exp:"Fa : corde 6 case 1 (Mi à vide + un demi-ton), corde 5 case 8 (Mi du point de la case 7 + un demi-ton).",
        xp:15
      },
      {
        instruction:"Cordes 6 et 5 : trouve tous les Do#",
        concept:{type:"find_note",root:"C#"},
        selectionRules:{mode:"all"},
        fretRange:[0,12], stringRange:[5,6],
        display:{showNotes:false},
        hint:"Pars des Do que tu viens de trouver.",
        exp:"Do# : corde 6 case 9 (sous le point), corde 5 case 4 (Do du point de la case 3 + un demi-ton).",
        xp:15
      }
    ],
    tip:"Ancre d'abord les notes sous les points, puis déduis le reste par voisinage."
  },

  {
    id:"ex-neck-c2-02-01", type:"fretboard_exercise", mod:"neck", lvl:1,
    title:"Corde 5 : les notes et leurs paires", dur:10, xp:65,
    unlockedBy:["neck-c2-02"],
    courseLink:"neck-c2-02",
    stages:[
      {
        instruction:"Corde 5 seulement : sélectionne toutes les notes naturelles (sans dièse ni bémol), de la corde à vide à la case 12",
        concept:{type:"find_scale",root:"C",quality:"major"},
        selectionRules:{mode:"all"},
        fretRange:[0,12], stringRange:[5,5],
        display:{showNotes:false},
        hint:"Deux cases entre deux notes naturelles, sauf entre Si et Do et entre Mi et Fa.",
        exp:"Corde 5 : La 0, Si 2, Do 3, Ré 5, Mi 7, Fa 8, Sol 10, La 12.",
        xp:25
      },
      {
        instruction:"Cordes 6 et 5 : trouve tous les Sol",
        concept:{type:"find_note",root:"G"},
        selectionRules:{mode:"all"},
        fretRange:[0,12], stringRange:[5,6],
        display:{showNotes:false},
        hint:"Même hauteur : 5 cases plus tôt sur la corde 5 que sur la corde 6… quand c'est possible.",
        exp:"Sol : corde 6 case 3, corde 5 case 10 (une octave plus haut que celui de la corde 6).",
        xp:15
      },
      {
        instruction:"Cordes 6 et 5 : trouve tous les Si",
        concept:{type:"find_note",root:"B"},
        selectionRules:{mode:"all"},
        fretRange:[0,12], stringRange:[5,6],
        display:{showNotes:false},
        hint:"Pense à la paire : trouve-le sur une corde, déduis l'autre.",
        exp:"Si : corde 6 case 7, corde 5 case 2. Même hauteur : 5 cases d'écart.",
        xp:15
      }
    ],
    tip:"Un barré en forme de La porte le nom de sa note sur la corde 5 : chaque note trouvée ici est un accord que tu sais nommer."
  },

  {
    id:"ex-neck-c2-03-01", type:"fretboard_exercise", mod:"neck", lvl:2,
    title:"Corde 4 : notes naturelles et octaves", dur:10, xp:70,
    unlockedBy:["neck-c2-03"],
    courseLink:"neck-c2-03",
    stages:[
      {
        instruction:"Corde 4 seulement : sélectionne toutes les notes naturelles, de la corde à vide à la case 12",
        concept:{type:"find_scale",root:"C",quality:"major"},
        selectionRules:{mode:"all"},
        fretRange:[0,12], stringRange:[4,4],
        display:{showNotes:false},
        hint:"La corde sonne Ré à vide. Repère où tombent les deux demi-tons Mi-Fa et Si-Do.",
        exp:"Corde 4 : Ré 0, Mi 2, Fa 3, Sol 5, La 7, Si 9, Do 10, Ré 12.",
        xp:25
      },
      {
        instruction:"Cordes 6, 5 et 4 : trouve tous les La",
        concept:{type:"find_note",root:"A"},
        selectionRules:{mode:"all"},
        fretRange:[0,12], stringRange:[4,6],
        display:{showNotes:false},
        hint:"De la corde 6 à la corde 4, l'octave est deux cases plus loin.",
        exp:"La : corde 6 case 5, corde 5 à vide et case 12, corde 4 case 7.",
        xp:20
      },
      {
        instruction:"Cordes 6, 5 et 4 : trouve tous les Do",
        concept:{type:"find_note",root:"C"},
        selectionRules:{mode:"all"},
        fretRange:[0,12], stringRange:[4,6],
        display:{showNotes:false},
        hint:"Pars du Do de la corde 6, puis applique les deux règles : 5 cases plus tôt, ou deux cases plus loin deux cordes plus haut.",
        exp:"Do : corde 6 case 8, corde 5 case 3, corde 4 case 10.",
        xp:20
      }
    ],
    tip:"Corde 4 à vide = corde 6 case 10 : retiens ce Ré, il relie les deux cordes."
  },

  {
    id:"ex-neck-c2-04-01", type:"fretboard_exercise", mod:"neck", lvl:2,
    title:"Corde 3 : notes naturelles et cassure", dur:10, xp:70,
    unlockedBy:["neck-c2-04"],
    courseLink:"neck-c2-04",
    stages:[
      {
        instruction:"Corde 3 seulement : sélectionne toutes les notes naturelles, de la corde à vide à la case 12",
        concept:{type:"find_scale",root:"C",quality:"major"},
        selectionRules:{mode:"all"},
        fretRange:[0,12], stringRange:[3,3],
        display:{showNotes:false},
        hint:"La corde sonne Sol à vide. De Sol à Si, il y a deux tons.",
        exp:"Corde 3 : Sol 0, La 2, Si 4, Do 5, Ré 7, Mi 9, Fa 10, Sol 12.",
        xp:25
      },
      {
        instruction:"Cordes 3 et 2 : trouve tous les Si",
        concept:{type:"find_note",root:"B"},
        selectionRules:{mode:"all"},
        fretRange:[0,12], stringRange:[2,3],
        display:{showNotes:false},
        hint:"Entre ces deux cordes, l'écart n'est pas une quarte.",
        exp:"Si : corde 3 case 4, corde 2 à vide et case 12. Le Si de la corde 3 sonne comme la corde 2 à vide : une tierce majeure les sépare.",
        xp:20
      },
      {
        instruction:"Cordes 3, 2 et 1 : trouve tous les Ré",
        concept:{type:"find_note",root:"D"},
        selectionRules:{mode:"all"},
        fretRange:[0,12], stringRange:[1,3],
        display:{showNotes:false},
        hint:"Celui de la corde 3 est la note de départ du bend de base du blues.",
        exp:"Ré : corde 3 case 7, corde 2 case 3, corde 1 case 10.",
        xp:20
      }
    ],
    tip:"Joue chaque Ré trouvé : celui de la corde 3, tiré d'un ton, doit rejoindre le Mi de la case 9."
  },

  {id:"ex-neck-c3-01-01",mod:"neck",lvl:2,title:"Un riff en octaves doublées",dur:10,bpm:70,unlockedBy:["neck-c3-01"],courseLink:"neck-c3-01",steps:["Index sur Sol (corde 6 case 3), annulaire sur Sol (corde 4 case 5) ; le dessous de l'index étouffe la corde 5. Gratte les trois cordes : seules deux notes doivent sonner.","Fais glisser la forme sur La (corde 6 case 5), Do (corde 6 case 8) et Ré (corde 6 case 10) : avant chaque attaque, dis à voix haute la case de la corde 4.","Riff au clic à 70, une paire par temps : Sol, Sol, La, Do, puis Sol, Sol, Ré, Do. Quatre tours sans t'arrêter.","Termine par le Mi de la corde 6 à vide et son octave sur la corde 4, puis rejoue le riff en partant de ce Mi."],tip:"Garde la forme figée : c'est le bras qui voyage, les doigts ne changent pas d'écart.",xp:60},

  {
    id:"ex-neck-c3-02-01", type:"fretboard_exercise", mod:"neck", lvl:2,
    title:"Octaves corde 5 → corde 3", dur:8, xp:60,
    unlockedBy:["neck-c3-02"],
    courseLink:"neck-c3-02",
    stages:[
      {
        instruction:"Cordes 5 à 3, entre les cases 3 et 5 : trouve tous les Do",
        concept:{type:"find_note",root:"C"},
        selectionRules:{mode:"all"},
        fretRange:[3,5], stringRange:[3,5],
        display:{showNotes:false},
        hint:"Pars de la corde 5, puis applique la forme d'octave.",
        exp:"Do : corde 5 case 3 et son octave corde 3 case 5. Une corde sautée, deux cases plus haut.",
        xp:15
      },
      {
        instruction:"Cordes 5 à 3, entre les cases 5 et 7 : trouve tous les Ré",
        concept:{type:"find_note",root:"D"},
        selectionRules:{mode:"all"},
        fretRange:[5,7], stringRange:[3,5],
        display:{showNotes:false},
        hint:"Même forme que pour Do, deux cases plus haut.",
        exp:"Ré : corde 5 case 5 et corde 3 case 7.",
        xp:15
      },
      {
        instruction:"Cordes 5 à 3, entre les cases 2 et 4 : trouve tous les Si",
        concept:{type:"find_note",root:"B"},
        selectionRules:{mode:"all"},
        fretRange:[2,4], stringRange:[3,5],
        display:{showNotes:false},
        hint:"Commence par la corde 5 : deux cases au-dessus de La à vide.",
        exp:"Si : corde 5 case 2 et corde 3 case 4.",
        xp:15
      },
      {
        instruction:"Cordes 5 à 3, entre les cases 7 et 9 : trouve tous les Mi",
        concept:{type:"find_note",root:"E"},
        selectionRules:{mode:"all"},
        fretRange:[7,9], stringRange:[3,5],
        display:{showNotes:false},
        hint:"Lis la forme à l'envers si tu préfères partir de la corde 3.",
        exp:"Mi : corde 5 case 7 et corde 3 case 9.",
        xp:15
      }
    ],
    tip:"Deux quartes font 10 demi-tons : il manque 2 cases pour l'octave, d'où la forme en « L »."
  },

  {
    id:"ex-neck-c3-03-01", type:"fretboard_exercise", mod:"neck", lvl:2,
    title:"Octaves dans l'aigu : la case en plus", dur:10, xp:70,
    unlockedBy:["neck-c3-03"],
    courseLink:"neck-c3-03",
    stages:[
      {
        instruction:"Cordes 4 à 2, entre les cases 2 et 5 : trouve tous les Mi",
        concept:{type:"find_note",root:"E"},
        selectionRules:{mode:"all"},
        fretRange:[2,5], stringRange:[2,4],
        display:{showNotes:false},
        hint:"Pars de la corde 4. L'octave traverse la cassure Sol-Si.",
        exp:"Mi : corde 4 case 2 et corde 2 case 5. Trois cases, pas deux : la cassure ajoute une case.",
        xp:15
      },
      {
        instruction:"Cordes 4 à 2, entre les cases 5 et 8 : trouve tous les Sol",
        concept:{type:"find_note",root:"G"},
        selectionRules:{mode:"all"},
        fretRange:[5,8], stringRange:[2,4],
        display:{showNotes:false},
        hint:"Même forme que pour Mi, trois cases plus haut.",
        exp:"Sol : corde 4 case 5 et corde 2 case 8.",
        xp:15
      },
      {
        instruction:"Cordes 3 à 1, entre les cases 2 et 5 : trouve tous les La",
        concept:{type:"find_note",root:"A"},
        selectionRules:{mode:"all"},
        fretRange:[2,5], stringRange:[1,3],
        display:{showNotes:false},
        hint:"Pars de la corde 3 : un ton au-dessus de Sol à vide.",
        exp:"La : corde 3 case 2 et corde 1 case 5.",
        xp:20
      },
      {
        instruction:"Cordes 3 à 1, entre les cases 5 et 8 : trouve tous les Do",
        concept:{type:"find_note",root:"C"},
        selectionRules:{mode:"all"},
        fretRange:[5,8], stringRange:[1,3],
        display:{showNotes:false},
        hint:"Même forme que pour La, trois cases plus haut.",
        exp:"Do : corde 3 case 5 et corde 1 case 8.",
        xp:20
      }
    ],
    tip:"+2 cases dans le grave, +3 dans l'aigu : la cassure Sol-Si explique toute l'asymétrie."
  },
];
