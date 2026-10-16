// Exercices du module « harmony ». Format décrit dans src/content/README.md.

export default [
  // ═══ HARMONIE ═══
  {id:"ex-harm-01",mod:"harmony",lvl:1,title:"Construire 7 triades majeures",dur:10,bpm:null,courseLink:"harm-c2-02",steps:["Sans guitare : écris les notes de Do, Ré, Mi, Fa, Sol, La, Si majeur.","Vérifie : Do=Do-Mi-Sol, Ré=Ré-Fa#-La, Mi=Mi-Sol#-Si, Fa=Fa-La-Do, Sol=Sol-Si-Ré, La=La-Do#-Mi, Si=Si-Ré#-Fa#.","Trouve chaque triade en position fondamentale sur cordes 1-2-3.","Joue les 7 triades en arpège montant."],tip:"Formule : 1 + 4dt + 7dt. Quand tu sais le faire de tête, tu connais l'harmonie.",xp:55},

  {id:"ex-harm-02",mod:"harmony",lvl:2,title:"Voicings 7e shell",dur:12,bpm:60,courseLink:"harm-c3-04",steps:["Cmaj7 shell : Do(corde 6 case 8) + Mi(corde 5 case 7) + Si(corde 4 case 9). Pas de Sol (5e omise).","Dm7 shell : Ré(corde 6 case 10) + Fa(corde 5 case 8) + Do(corde 4 case 10).","G7 shell : Sol(corde 6 case 3) + Si(corde 5 case 2) + Fa(corde 4 case 3).","Joue ii-V-I (Dm7-G7-Cmaj7) en shell, 4 mesures par accord."],tip:"Shells = 3 notes seulement. Sonnent étonnamment 'complets'. Base du jazz pratique.",xp:75},

  {id:"ex-harm-03",mod:"harmony",lvl:2,title:"ii-V-I dans 3 tonalités",dur:15,bpm:70,courseLink:"harm-c6-03",steps:["En Do : Dm7 (case 5) - G7 (case 3) - Cmaj7 (case 8). 4 mesures par accord.","En Sol : Am7 - D7 - Gmaj7. Mêmes formes décalées.","En Ré : Em7 - A7 - Dmaj7.","Boucle les 3 progressions à 70 BPM."],tip:"Le ii-V-I est universel. 3 tonalités d'entraînement → applicable aux 12.",xp:75},

  {id:"ex-harm-04",mod:"harmony",lvl:3,title:"Arpèges Cmaj7 dans 3 positions",dur:15,bpm:60,courseLink:"harmony-03",steps:["Position 1 (case 8 forme E) : Do(corde 6 case 8)-Mi(corde 5 case 7)-Sol(corde 5 case 10)-Si(corde 4 case 9).","Position 2 (case 3 forme C) : Do(corde 5 case 3)-Mi(corde 4 case 2)-Sol(corde 3 à vide)-Si(corde 3 case 4).","Position 3 (case 12 aigu) : Do(corde 1 case 8)-Mi(corde 1 case 12)-Sol(corde 1 case 15)-Si... ajuste.","Connecte les 3 positions en arpège continu."],tip:"3 positions par arpège = couverture complète du manche.",xp:80},

  {id:"ex-harm-05",mod:"harmony",lvl:3,title:"Harmoniser Sol majeur",dur:12,bpm:null,courseLink:"harm-c5-02",steps:["Construis les 7 accords diatoniques de Sol : Gmaj7, Am7, Bm7, Cmaj7, D7, Em7, F#m7b5.","Joue chaque accord en arpège montant.","Joue la progression complète I-ii-iii-IV-V-vi-vii°-I à 60 BPM.","Test : nomme chaque accord en chiffrage Nashville (1 à 7)."],tip:"Si tu connais l'harmonisation de Sol, tu connais celle des 12 majeures par transposition.",xp:80},

  {
    id:"ex-fret-06", type:"fretboard_exercise", mod:"harmony", lvl:2,
    title:"Construction de triades sur le manche", dur:12, xp:80,
    unlockedBy:["harm-c2-02"],
    courseLink:"harm-c2-02",
    stages:[
      {
        instruction:"Trouve toutes les notes de Do majeur (Do Mi Sol)",
        concept:{type:"find_chord",root:"C",quality:"maj"},
        selectionRules:{mode:"all"},
        fretRange:[0,12], stringRange:[1,6],
        display:{showNotes:false},
        hint:"Do majeur = Do + Mi (4dt) + Sol (7dt). 3 notes, partout sur le manche.",
        exp:"Triade majeure : 1-3-5. Do-Mi-Sol partout sur le manche.",
        xp:20
      },
      {
        instruction:"Trouve toutes les notes de La mineur (La Do Mi)",
        concept:{type:"find_chord",root:"A",quality:"min"},
        selectionRules:{mode:"all"},
        fretRange:[0,12], stringRange:[1,6],
        display:{showNotes:false},
        hint:"La mineur = La + Do (3dt) + Mi (7dt). La tierce mineure fait la différence.",
        exp:"Am : 1-♭3-5 = La-Do-Mi. Le Do (vs Do# de Am → A) crée la couleur mineure.",
        xp:20
      },
      {
        instruction:"Trouve toutes les notes de Sol7 (Sol Si Ré Fa)",
        concept:{type:"find_chord",root:"G",quality:"dom7"},
        selectionRules:{mode:"all"},
        fretRange:[0,12], stringRange:[1,6],
        display:{showNotes:false},
        hint:"G7 = Sol + Si (3ce M) + Ré (5te) + Fa (7e m). Accord de tension.",
        exp:"G7 : Si et Fa sont les guide tones — la tension veux se résoudre vers Cmaj7.",
        xp:40
      }
    ],
    tip:"Un accord = des notes, pas une forme de main. Voir les notes sur le manche = liberté totale."
  },

  {
    id:"ex-fret-07", type:"fretboard_exercise", mod:"harmony", lvl:3,
    title:"ii-V-I : cartographier la progression", dur:15, xp:100,
    unlockedBy:["harm-c6-03"],
    courseLink:"harm-c6-03",
    stages:[
      {
        instruction:"ii — Dm7 : trouve toutes les notes Ré Fa La Do sur le manche",
        concept:{type:"find_chord",root:"D",quality:"min7"},
        selectionRules:{mode:"all"},
        fretRange:[0,12], stringRange:[1,6],
        display:{showNotes:false},
        hint:"Dm7 = ii de Do majeur. Guide tones = Fa (3e) et Do (7e).",
        exp:"Dm7 : Ré-Fa-La-Do. C'est l'accord de tension douce du ii-V-I.",
        xp:25
      },
      {
        instruction:"V — G7 : trouve toutes les notes Sol Si Ré Fa sur le manche",
        concept:{type:"find_chord",root:"G",quality:"dom7"},
        selectionRules:{mode:"all"},
        fretRange:[0,12], stringRange:[1,6],
        display:{showNotes:false},
        hint:"G7 = V de Do majeur. Guide tones = Si (3e) et Fa (7e) = tension maximale.",
        exp:"G7 : Sol-Si-Ré-Fa. Le Fa veut descendre vers Mi, le Si monte vers Do.",
        xp:25
      },
      {
        instruction:"I — Cmaj7 : trouve toutes les notes Do Mi Sol Si sur le manche",
        concept:{type:"find_chord",root:"C",quality:"maj7"},
        selectionRules:{mode:"all"},
        fretRange:[0,12], stringRange:[1,6],
        display:{showNotes:false},
        hint:"Cmaj7 = résolution. Guide tones = Mi (3e) et Si (7e M) = repos.",
        exp:"Cmaj7 : Do-Mi-Sol-Si. La résolution parfaite après G7.",
        xp:30
      }
    ],
    tip:"Le ii-V-I est le moteur de tout le jazz. Cartographier ces 3 accords sur le manche = voir l'harmonie visuellement."
  },

  // ═══ ACCORDS OUVERTS ET BARRÉS (paliers 2 à 4) ═══
  {id:"ex-harm-acc-01",mod:"harmony",lvl:1,title:"Changements La, Mi, Ré mineur",dur:8,bpm:60,unlockedBy:["harm-acc-01"],courseLink:"harm-acc-01",steps:["Une minute La ↔ Ré : quatre coups vers le bas par accord, au clic à 60.","Une minute Mi ↔ La mineur : la forme se décale d'une corde, les trois doigts bougent ensemble.","Une minute Ré mineur ↔ La mineur : l'index passe de la corde 1 à la corde 2, toujours en case 1.","Rejoue la paire qui accroche le plus, puis enchaîne La, Ré, Mi, La mineur, une mesure chacun."],tip:"Compte tes changements propres en une minute et note le score : il doit grimper d'un jour à l'autre.",xp:50},

  {id:"ex-harm-acc-02",mod:"harmony",lvl:1,title:"Blues en La en septièmes",dur:10,bpm:70,unlockedBy:["harm-acc-02"],courseLink:"harm-acc-02",steps:["Plaque E7, A7, D7 et B7 l'un après l'autre et joue chaque corde séparément : tout doit sonner.","Grille de 12 mesures en La : A7 (4 mesures), D7 (2), A7 (2), E7, D7, A7, E7.","Quatre coups vers le bas par mesure, au clic à 70, trois tours sans t'arrêter.","Refais un tour en balançant « long-court » sur chaque temps : le son du shuffle."],tip:"Sur le dernier E7 de la grille, appuie un peu plus : c'est lui qui relance le tour suivant.",xp:55},

  {id:"ex-harm-acc-03",mod:"harmony",lvl:2,title:"Do – petit Fa sans pause",dur:10,bpm:60,unlockedBy:["harm-acc-03"],courseLink:"harm-acc-03",steps:["Petit Fa (xx3211) : joue les quatre cordes une par une, corrige celle qui frise.","Do ↔ petit Fa, quatre coups chacun, au clic à 60, pendant deux minutes.","Grille Do, La mineur, Fa, Sol : une mesure chacun, quatre tours.","Essaie une fois le Fa à cinq cordes (x33211), puis le Fa complet (133211)."],tip:"Annulaire et majeur se déplacent ensemble d'une corde : pense à une seule forme qui glisse, pas à deux doigts.",xp:60},

  {id:"ex-harm-acc-04",mod:"harmony",lvl:2,title:"Routine barré forme Mi",dur:5,bpm:60,unlockedBy:["harm-acc-04"],courseLink:"harm-acc-04",steps:["1 min : index seul en barré case 5, joue les six cordes une par une.","1 min : La barré (577655), pose la forme, gratte, relâche, recommence.","2 min : Sol barré (case 3) ↔ La barré (case 5), quatre coups chacun, au clic à 60.","1 min : Fa barré (case 1), sans forcer : cherche la pression minimale."],tip:"Cinq minutes chaque jour valent mieux qu'une demi-heure le week-end : le barré est une affaire de main qui s'habitue.",xp:60},

  {id:"ex-harm-acc-05",mod:"harmony",lvl:2,title:"Barré forme La : Bm, Do, Ré",dur:8,bpm:60,unlockedBy:["harm-acc-05"],courseLink:"harm-acc-05",steps:["Bm (x24432) : vérifie corde par corde, la corde 6 étouffée du bout de l'index.","Ré ouvert ↔ Bm, quatre coups chacun, au clic à 60, deux minutes.","Do barré (case 3) ↔ Ré barré (case 5) : la forme glisse de deux cases sans relâcher la main.","Grille Sol, Ré, Bm, Do : une mesure chacun, Bm et Do en barré."],tip:"Si l'auriculaire n'atteint pas la case 4 sur Bm, avance un peu le coude : le poignet s'ouvre et la main s'allonge.",xp:65},
];
