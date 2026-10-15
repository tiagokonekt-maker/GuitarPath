// Exercices du module « scales ». Format décrit dans src/content/README.md.

export default [
  // ═══ GAMMES ═══
  {id:"ex-scales-01",mod:"scales",lvl:1,title:"Penta Am pos. 1 propre",dur:12,bpm:60,courseLink:"scales-c3-01",steps:["Index case 5, annulaire case 7, auriculaire case 8.","Joue corde 6 → 1 montant à 60 BPM. Chaque note doit sonner claire.","Redescends c1 → c6 même tempo.","Augmente progressivement : 70, 80, 90 BPM."],tip:"Lenteur = propreté. Propreté = vélocité future.",xp:50},

  {id:"ex-scales-02",mod:"scales",lvl:2,title:"Penta Am 5 positions enchaînées",dur:20,bpm:60,courseLink:"scales-c3-02",steps:["Position 5 (case 3) → 1 (case 5) → 2 (case 8) → 3 (case 10) → 4 (case 12).","Boucle 3 fois à 60 BPM en montant.","Boucle 3 fois en descendant.","Identifie les notes-pivot (case 5, 8, 10, 12)."],tip:"4-6 semaines de pratique pour automatiser. C'est le boss de la pentatonique.",xp:90},

  {id:"ex-scales-03",mod:"scales",lvl:2,title:"Sol majeur 2 octaves",dur:12,bpm:65,courseLink:"scales-c2-05",steps:["Sol(corde 6 case 3)-La(corde 6 case 5)-Si(corde 5 case 2)-Do(corde 5 case 3)-Ré(corde 5 case 5)-Mi(corde 4 case 2)-Fa#(corde 4 case 4)-Sol(corde 4 case 5).","Continue : La(corde 3 case 2)-Si(corde 3 case 4)-Do(corde 2 case 1)-Ré(corde 2 case 3)-Mi(corde 2 case 5)-Fa#(corde 1 case 2)-Sol(corde 1 case 3).","Descends pareil. 5 cycles complets.","Identifie Sol et Si comme repères visuels."],tip:"Cette position couvre 2 octaves. Mémorise-la, c'est ta base en Sol.",xp:70},

  {id:"ex-scales-04",mod:"scales",lvl:3,title:"Ré dorien sur drone",dur:15,bpm:80,courseLink: "scales-c5-02",steps:["Lance backing 'Dm7 vamp 80 BPM' (YouTube) ou drone Ré.","Joue Ré dorien : Ré-Mi-Fa-Sol-La-Si-Do.","Mets en valeur Si (la sixte caractéristique) toutes les 2 mesures.","10 minutes non-stop. Enregistre-toi."],tip:"Sans le Si, ça sonnera mineur générique. Le Si fait toute la différence.",xp:85},

  {id:"ex-scales-05",mod:"scales",lvl:3,title:"Sol mixolydien sur G7",dur:12,bpm:75,courseLink: "scales-c5-05",steps:["Backing G7 75 BPM ou blues en Sol.","Joue Sol mixolydien : Sol-La-Si-Do-Ré-Mi-Fa.","Mets en avant le Fa naturel (♭7 caractéristique).","Compare 5 min avec Sol majeur (Fa#) — entends la différence."],tip:"Le Fa naturel = LA note mixolydienne. C'est la 7e de l'accord.",xp:80},

  {id:"ex-scales-06",mod:"scales",lvl:3,title:"Mineure harmonique sur V7",dur:12,bpm:80,courseLink:"scales-c6-01",steps:["Sur la cadence E7→Am, joue La mineure harmonique sur le E7.","La harmonique = La-Si-Do-Ré-Mi-Fa-Sol#.","Le Sol# crée la tension parfaite vers Am.","Compare avec La éolien (Sol naturel) — moins de tension."],tip:"Sol# de l'harmonique = la 3 de E7. Match parfait pour la résolution.",xp:80},

  {
    id:"ex-fret-04", type:"fretboard_exercise", mod:"scales", lvl:1,
    title:"Pentatonique mineure de La — 3 positions", dur:15, xp:85,
    unlockedBy:["scales-c3-02"],
    courseLink:"scales-c3-02",
    stages:[
      {
        instruction:"Position 1 (cases 5-8) : sélectionne toutes les notes de La pentatonique mineure",
        concept:{type:"find_scale",root:"A",quality:"pentatonic_minor"},
        selectionRules:{mode:"all"},
        fretRange:[4,9], stringRange:[1,6],
        display:{showNotes:false},
        hint:"La-Do-Ré-Mi-Sol. La boîte classique autour de la case 5.",
        exp:"Position 1 = la plus utilisée en rock/blues. Commence ici avant les autres.",
        xp:25
      },
      {
        instruction:"Position 2 (cases 7-10) : sélectionne toutes les notes",
        concept:{type:"find_scale",root:"A",quality:"pentatonic_minor"},
        selectionRules:{mode:"all"},
        fretRange:[6,11], stringRange:[1,6],
        display:{showNotes:false},
        hint:"Même 5 notes, zone différente. Commence par repérer les La (fondamentales).",
        exp:"Position 2 = la continuité naturelle de la position 1 vers les aigus.",
        xp:25
      },
      {
        instruction:"Maintenant le manche complet (cases 0-12) : toutes les notes",
        concept:{type:"find_scale",root:"A",quality:"pentatonic_minor"},
        selectionRules:{mode:"all"},
        fretRange:[0,12], stringRange:[1,6],
        display:{showNotes:false},
        hint:"C'est beaucoup ! Commence par la corde 6 et descends corde par corde.",
        exp:"La pentatonique mineure de La : 5 notes × 6 cordes = ~30 positions sur le manche entier.",
        xp:35
      }
    ],
    tip:"La pentatonique n'a pas de mauvaises notes sur un accord Am. C'est ta zone de confort pour l'impro."
  },

  {
    id:"ex-fret-05", type:"fretboard_exercise", mod:"scales", lvl:2,
    title:"Gammes et modes — exploration", dur:15, xp:90,
    unlockedBy:["scales-c5-02","scales-c5-05"],
    courseLink: "scales-c5-02",
    stages:[
      {
        instruction:"Trouve toutes les notes de Do majeur sur le manche",
        concept:{type:"find_scale",root:"C",quality:"major"},
        selectionRules:{mode:"all"},
        fretRange:[0,12], stringRange:[1,6],
        display:{showNotes:false},
        hint:"Do-Ré-Mi-Fa-Sol-La-Si. 7 notes naturelles.",
        exp:"Do majeur = les 7 notes naturelles. Mémorise ce pattern comme référence.",
        xp:20
      },
      {
        instruction:"Mêmes notes, autre tonique : Ré dorien (Ré Mi Fa Sol La Si Do)",
        concept:{type:"find_scale",root:"D",quality:"dorian"},
        selectionRules:{mode:"all"},
        fretRange:[0,12], stringRange:[1,6],
        display:{showNotes:false},
        hint:"Ré dorien = mêmes notes que Do majeur, mais depuis Ré. Entends la différence.",
        exp:"Ré dorien = Do majeur joué depuis Ré. Même notes, couleur différente.",
        xp:25
      },
      {
        instruction:"Sol mixolydien (Sol La Si Do Ré Mi Fa) — repère le Fa naturel",
        concept:{type:"find_scale",root:"G",quality:"mixolydian"},
        selectionRules:{mode:"all"},
        fretRange:[0,12], stringRange:[1,6],
        display:{showNotes:false},
        hint:"Mixolydien = majeure avec ♭7. Sol-La-Si-Do-Ré-Mi-Fa (pas Fa#).",
        exp:"Sol mixolydien = son rock/blues. Le Fa naturel (vs Fa# de Sol majeur) fait la couleur.",
        xp:25
      }
    ],
    tip:"Les modes ne sont pas des gammes différentes — ils sont des perspectives différentes sur les mêmes notes."
  },
];
