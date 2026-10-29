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
  {id:"ex-harm-acc-01",mod:"harmony",lvl:1,title:"Changements La, Mi, Ré mineur",dur:8,bpm:60,unlockedBy:["harm-acc-01"],courseLink:"harm-acc-01",steps:["Une minute La ↔ Ré : quatre coups vers le bas par accord, au clic à 60.","Une minute Mi ↔ La mineur : la forme se décale d'une corde, les trois doigts bougent ensemble.","Une minute Ré mineur ↔ La mineur : l'index passe de la corde 1 à la corde 2, toujours en case 1.","Rejoue la paire qui accroche le plus, puis enchaîne La, Ré, Mi, La mineur, une mesure chacun."],tip:"Enchaîne les changements pendant une minute, le plus proprement possible ; refais-le demain, tu sentiras la différence.",xp:50},

  {id:"ex-harm-acc-02",mod:"harmony",lvl:1,title:"Blues en La en septièmes",dur:10,bpm:70,unlockedBy:["harm-acc-02"],courseLink:"harm-acc-02",steps:["Plaque E7, A7, D7 et B7 l'un après l'autre et joue chaque corde séparément : tout doit sonner.","Grille de 12 mesures en La : A7 (4 mesures), D7 (2), A7 (2), E7, D7, A7, E7.","Quatre coups vers le bas par mesure, au clic à 70, trois tours sans t'arrêter.","Refais un tour en balançant « long-court » sur chaque temps : le son du shuffle."],tip:"Sur le dernier E7 de la grille, appuie un peu plus : c'est lui qui relance le tour suivant.",xp:55},

  {id:"ex-harm-acc-03",mod:"harmony",lvl:2,title:"Do – petit Fa sans pause",dur:10,bpm:60,unlockedBy:["harm-acc-03"],courseLink:"harm-acc-03",steps:["Petit Fa (xx3211) : joue les quatre cordes une par une, corrige celle qui frise.","Do ↔ petit Fa, quatre coups chacun, au clic à 60, pendant deux minutes.","Grille Do, La mineur, Fa, Sol : une mesure chacun, quatre tours.","Essaie une fois le Fa à cinq cordes (x33211), puis le Fa complet (133211)."],tip:"Annulaire et majeur se déplacent ensemble d'une corde : pense à une seule forme qui glisse, pas à deux doigts.",xp:60},

  {id:"ex-harm-acc-04",mod:"harmony",lvl:2,title:"Routine barré forme Mi",dur:5,bpm:60,unlockedBy:["harm-acc-04"],courseLink:"harm-acc-04",steps:["1 min : index seul en barré case 5, joue les six cordes une par une.","1 min : La barré (577655), pose la forme, gratte, relâche, recommence.","2 min : Sol barré (case 3) ↔ La barré (case 5), quatre coups chacun, au clic à 60.","1 min : Fa barré (case 1), sans forcer : cherche la pression minimale."],tip:"Cinq minutes chaque jour valent mieux qu'une demi-heure le week-end : le barré est une affaire de main qui s'habitue.",xp:60},

  {id:"ex-harm-acc-05",mod:"harmony",lvl:2,title:"Barré forme La : Bm, Do, Ré",dur:8,bpm:60,unlockedBy:["harm-acc-05"],courseLink:"harm-acc-05",steps:["Bm (x24432) : vérifie corde par corde, la corde 6 étouffée du bout de l'index.","Ré ouvert ↔ Bm, quatre coups chacun, au clic à 60, deux minutes.","Do barré (case 3) ↔ Ré barré (case 5) : la forme glisse de deux cases sans relâcher la main.","Grille Sol, Ré, Bm, Do : une mesure chacun, Bm et Do en barré."],tip:"Si l'auriculaire n'atteint pas la case 4 sur Bm, avance un peu le coude : le poignet s'ouvre et la main s'allonge.",xp:65},

  {id:"ex-harm-capo-01",mod:"harmony",lvl:2,title:"Transposer avec le capodastre",dur:10,bpm:70,unlockedBy:["harm-capo-01"],courseLink:"harm-capo-01",steps:["Sans capo : Sol, Ré, Mi mineur, Do, quatre coups par accord au clic à 70.","Capo en case 2 : même grille, et nomme à voix haute ce qui sonne : La, Mi, Fa# mineur, Ré.","Capo en case 3, puis en case 5 : trouve et dis les quatre accords entendus avant de jouer (Sib, Fa, Sol mineur, Mib ; puis Do, Sol, La mineur, Fa).","Chante une mélodie que tu connais sur la grille et déplace le capo jusqu'à la case où ta voix est le plus à l'aise."],tip:"Pour transposer de tête, pars toujours de l'accord de départ : Sol + 2 demi-tons = La, et la grille suit.",xp:50},

  // ═══ UN EXERCICE PAR LEÇON (paliers 1 à 9) ═══
  {id:"ex-harm-c1-01-01",mod:"harmony",lvl:1,title:"Mélodie, harmonie, et la maison",dur:6,bpm:60,unlockedBy:["harm-c1-01"],courseLink:"harm-c1-01",steps:["Plaque Do, puis joue ses cordes une à une de la 5 à la 1, une note par clic à 60 : la mélodie. Gratte-les ensemble : l'harmonie.","Même chose avec Sol (320003) puis Ré (xx0232).","Sol, Do, Ré, Sol, quatre coups par accord : deux tours sans t'arrêter.","Rejoue la boucle en t'arrêtant une fois sur Do, une fois sur Ré, une fois sur Sol. Dis à voix haute lequel des trois sonne comme une arrivée."],tip:"La tonique, c'est l'accord sur lequel tu pourrais poser la guitare et partir : ton oreille le sait avant toi.",xp:40},

  {
    id:"ex-harm-c1-02-01", type:"fretboard_exercise", mod:"harmony", lvl:1,
    title:"Consonances et triton depuis Do", dur:8, xp:50,
    unlockedBy:["harm-c1-02"],
    courseLink:"harm-c1-02",
    stages:[
      {
        instruction:"Cases 0 à 5 : trouve toutes les quintes justes de Do",
        concept:{type:"find_interval",root:"C",interval:7},
        selectionRules:{mode:"all"},
        fretRange:[0,5], stringRange:[1,6],
        display:{showNotes:false},
        hint:"Quinte juste = 7 demi-tons au-dessus de la fondamentale. Compte depuis Do.",
        exp:"La quinte de Do est Sol : corde 6 case 3, corde 4 case 5, corde 3 à vide, corde 1 case 3. Joue-la avec Do (corde 5, case 3) : stable, presque vide.",
        xp:15
      },
      {
        instruction:"Cases 0 à 5 : trouve toutes les tierces majeures de Do",
        concept:{type:"find_interval",root:"C",interval:4},
        selectionRules:{mode:"all"},
        fretRange:[0,5], stringRange:[1,6],
        display:{showNotes:false},
        hint:"Tierce majeure = 4 demi-tons, deux tons entiers.",
        exp:"La tierce majeure de Do est Mi : cordes 6 et 1 à vide, corde 4 case 2, corde 2 case 5. Consonance douce, plus chaude que la quinte.",
        xp:15
      },
      {
        instruction:"Cases 0 à 5 : trouve tous les tritons de Do",
        concept:{type:"find_interval",root:"C",interval:6},
        selectionRules:{mode:"all"},
        fretRange:[0,5], stringRange:[1,6],
        display:{showNotes:false},
        hint:"Triton = 6 demi-tons, exactement la moitié de l'octave.",
        exp:"Le triton de Do est Fa# : corde 6 case 2, corde 4 case 4, corde 1 case 2. Gratte-le avec Do : ça grince, ça veut bouger.",
        xp:20
      }
    ],
    tip:"Après chaque étape, joue la paire sur ta guitare : le nom de l'intervalle ne vaut rien sans son."
  },

  {
    id:"ex-harm-c2-01-01", type:"fretboard_exercise", mod:"harmony", lvl:2,
    title:"Les 4 triades sur les cordes aiguës", dur:12, xp:70,
    unlockedBy:["harm-c2-01"],
    courseLink:"harm-c2-01",
    stages:[
      {
        instruction:"Cordes 1 à 4, cases 0 à 5 : trouve toutes les notes de Ré majeur",
        concept:{type:"find_chord",root:"D",quality:"maj"},
        selectionRules:{mode:"all"},
        fretRange:[0,5], stringRange:[1,4],
        display:{showNotes:false},
        hint:"Majeure : tierce majeure (4 demi-tons) puis tierce mineure (3).",
        exp:"Ré majeur = Ré, Fa#, La. Tu retrouves les notes de ton accord de Ré ouvert.",
        xp:15
      },
      {
        instruction:"Même zone : trouve toutes les notes de Ré mineur",
        concept:{type:"find_chord",root:"D",quality:"min"},
        selectionRules:{mode:"all"},
        fretRange:[0,5], stringRange:[1,4],
        display:{showNotes:false},
        hint:"Une seule note change par rapport à Ré majeur.",
        exp:"Ré mineur = Ré, Fa, La. Seule la tierce descend d'un demi-ton : Fa# devient Fa.",
        xp:15
      },
      {
        instruction:"Même zone : trouve toutes les notes de Si diminué",
        concept:{type:"find_chord",root:"B",quality:"dim"},
        selectionRules:{mode:"all"},
        fretRange:[0,5], stringRange:[1,4],
        display:{showNotes:false},
        hint:"Diminuée : deux tierces mineures empilées, 3 + 3 demi-tons.",
        exp:"Si diminué = Si, Ré, Fa : le 7e degré de Do majeur. Quinte diminuée entre Si et Fa.",
        xp:20
      },
      {
        instruction:"Même zone : trouve toutes les notes de Do augmenté",
        concept:{type:"find_chord",root:"C",quality:"aug"},
        selectionRules:{mode:"all"},
        fretRange:[0,5], stringRange:[1,4],
        display:{showNotes:false},
        hint:"Augmentée : deux tierces majeures empilées, 4 + 4 demi-tons.",
        exp:"Do augmenté = Do, Mi, Sol#. Les mêmes trois notes forment aussi Mi augmenté et Sol# augmenté.",
        xp:20
      }
    ],
    tip:"Joue chaque triade trouvée en arpège : la couleur s'entend mieux qu'elle ne se lit."
  },

  {
    id:"ex-harm-c2-03-01", type:"fretboard_exercise", mod:"harmony", lvl:2,
    title:"Triades majeures des groupes 2 et 3", dur:10, xp:65,
    unlockedBy:["harm-c2-03"],
    courseLink:"harm-c2-03",
    stages:[
      {
        instruction:"Cases 0 à 5 : trouve toutes les notes de Mi majeur",
        concept:{type:"find_chord",root:"E",quality:"maj"},
        selectionRules:{mode:"all"},
        fretRange:[0,5], stringRange:[1,6],
        display:{showNotes:false},
        hint:"Une tierce porte le nom situé deux lettres plus loin. Pense à son altération.",
        exp:"Mi majeur = Mi, Sol#, Si. Seule la tierce est diésée.",
        xp:20
      },
      {
        instruction:"Cases 0 à 5 : trouve toutes les notes de Si♭ majeur",
        concept:{type:"find_chord",root:"A#",quality:"maj"},
        selectionRules:{mode:"all"},
        fretRange:[0,5], stringRange:[1,6],
        display:{showNotes:false},
        hint:"Fondamentale bémolisée : la tierce et la quinte sont deux lettres plus loin à chaque fois.",
        exp:"Si♭ majeur = Si♭, Ré, Fa (le manche l'affiche La#, la même touche).",
        xp:20
      },
      {
        instruction:"Cases 0 à 5 : trouve toutes les notes de Si majeur",
        concept:{type:"find_chord",root:"B",quality:"maj"},
        selectionRules:{mode:"all"},
        fretRange:[0,5], stringRange:[1,6],
        display:{showNotes:false},
        hint:"Groupe 3 : la tierce et la quinte sont toutes les deux altérées.",
        exp:"Si majeur = Si, Ré#, Fa#. Compare avec Si♭ : chaque note a monté d'un demi-ton.",
        xp:25
      }
    ],
    tip:"Dis les trois notes à voix haute avant de toucher le manche : c'est la triade qui se mémorise, pas les cases."
  },

  {id:"ex-harm-c2-04-01",mod:"harmony",lvl:2,title:"Inversions : la basse et les trois cordes",dur:10,bpm:60,unlockedBy:["harm-c2-04"],courseLink:"harm-c2-04",steps:["Do (x32010), Do/Mi (032010), Do/Sol (332010) : quatre coups chacun au clic à 60. Écoute la basse changer, le reste ne bouge pas.","Do, Sol/Si (x20003), La mineur, Fmaj7 (xx3210), une mesure chacun : la basse descend pas à pas. Deux tours.","Sol sur les cordes 3, 2 et 1, état fondamental : Sol (corde 3 case 12), Si (corde 2 case 12), Ré (corde 1 case 10).","1re inversion : Si (corde 3 case 4), Ré (corde 2 case 3), Sol (corde 1 case 3). 2e inversion : Ré (corde 3 case 7), Sol (corde 2 case 8), Si (corde 1 case 7).","Enchaîne les trois positions en montant puis en descendant, quatre temps chacune, et nomme la note de basse à chaque arrêt."],tip:"Avant de changer de position, regarde quelle note reste commune : c'est ton point d'appui sur le manche.",xp:60},

  {id:"ex-harm-c3-01-01",mod:"harmony",lvl:3,title:"Un doigt, une septième",dur:8,bpm:60,unlockedBy:["harm-c3-01"],courseLink:"harm-c3-01",steps:["Do (x32010) puis Cmaj7 (x32000), quatre temps chacun au clic à 60 : un seul doigt se lève. Nomme la note qui apparaît.","La mineur (x02210) puis Am7 (x02010) : même travail.","Sol (320003) puis G7 (320001), puis Fa (xx3211) et Fmaj7 (xx3210).","Boucle Cmaj7, G7, Am7, Fmaj7, une mesure chacun, deux tours. Puis la même boucle en triades, et compare."],tip:"Si tu hésites sur la note ajoutée, compte depuis la fondamentale : 10 demi-tons, 7e mineure ; 11, 7e majeure.",xp:55},

  {
    id:"ex-harm-c3-02-01", type:"fretboard_exercise", mod:"harmony", lvl:3,
    title:"Les cinq septièmes en forme de La", dur:12, xp:80,
    unlockedBy:["harm-c3-02"],
    courseLink:"harm-c3-02",
    stages:[
      {
        instruction:"Pose Cmaj7, forme de La barrée, fondamentale en corde 5 case 3",
        concept:{type:"find_shape",positions:[{string:5,fret:3},{string:4,fret:5},{string:3,fret:4},{string:2,fret:5},{string:1,fret:3}]},
        selectionRules:{mode:"all"},
        fretRange:[0,7], stringRange:[1,6],
        display:{showNotes:false},
        hint:"Pars du barré de Do majeur dans cette forme, puis cherche la 7e majeure.",
        exp:"Cmaj7 = x35453 : Do, Sol, Si, Mi, Sol.",
        xp:15
      },
      {
        instruction:"Même fondamentale : pose C7",
        concept:{type:"find_shape",positions:[{string:5,fret:3},{string:4,fret:5},{string:3,fret:3},{string:2,fret:5},{string:1,fret:3}]},
        selectionRules:{mode:"all"},
        fretRange:[0,7], stringRange:[1,6],
        display:{showNotes:false},
        hint:"Une seule note bouge depuis Cmaj7.",
        exp:"C7 = x35353 : la 7e descend d'un demi-ton, Si devient Si♭.",
        xp:15
      },
      {
        instruction:"Même fondamentale : pose Cm7",
        concept:{type:"find_shape",positions:[{string:5,fret:3},{string:4,fret:5},{string:3,fret:3},{string:2,fret:4},{string:1,fret:3}]},
        selectionRules:{mode:"all"},
        fretRange:[0,7], stringRange:[1,6],
        display:{showNotes:false},
        hint:"Une seule note bouge depuis C7.",
        exp:"Cm7 = x35343 : la tierce descend, Mi devient Mi♭.",
        xp:15
      },
      {
        instruction:"Même fondamentale, cordes 5 à 2 : pose Cm7♭5",
        concept:{type:"find_shape",positions:[{string:5,fret:3},{string:4,fret:4},{string:3,fret:3},{string:2,fret:4}]},
        selectionRules:{mode:"all"},
        fretRange:[0,7], stringRange:[1,6],
        display:{showNotes:false},
        hint:"Pars de Cm7 sur les cordes 5 à 2 : une seule note bouge.",
        exp:"Cm7♭5 = x3434x : la quinte descend, Sol devient Sol♭.",
        xp:15
      },
      {
        instruction:"Même fondamentale, cordes 5 à 2 : pose Cdim7",
        concept:{type:"find_shape",positions:[{string:5,fret:3},{string:4,fret:4},{string:3,fret:2},{string:2,fret:4}]},
        selectionRules:{mode:"all"},
        fretRange:[0,7], stringRange:[1,6],
        display:{showNotes:false},
        hint:"Une seule note bouge depuis Cm7♭5.",
        exp:"Cdim7 = x3424x : la 7e descend encore, Si♭ devient Si𝄫 (qui sonne La).",
        xp:20
      }
    ],
    tip:"Après chaque étape, plaque l'accord sur ta guitare et dis son type à voix haute."
  },

  {id:"ex-harm-c3-03-01",mod:"harmony",lvl:3,title:"Shells ii-V-I en Sol",dur:10,bpm:60,unlockedBy:["harm-c3-03"],courseLink:"harm-c3-03",steps:["Am7 en shell : La (corde 6 case 5), Sol (corde 4 case 5), Do (corde 3 case 5). Étouffe les autres cordes.","D7 en shell : Ré (corde 5 case 5), Fa# (corde 4 case 4), Do (corde 3 case 5).","Gmaj7 en shell : Sol (corde 6 case 3), Fa# (corde 4 case 4), Si (corde 3 case 4).","Enchaîne Am7, D7, Gmaj7, une mesure chacun au clic à 60. Sur chaque changement, nomme la voix qui bouge et celle qui reste.","Joue seulement les cordes 4 et 3 de la grille : la ligne intérieure, deux notes par accord."],tip:"Les guide tones bougent d'un demi-ton ou restent en place : si ta main saute, tu as pris le mauvais shell.",xp:70},

  {id:"ex-harm-c4-01-01",mod:"harmony",lvl:3,title:"Entendre la 9e",dur:10,bpm:70,unlockedBy:["harm-c4-01"],courseLink:"harm-c4-01",steps:["Am7 (x02010) puis Am9 (x05500), quatre temps chacun au clic à 70. Nomme la note qui s'ajoute.","C7 (x32310) puis C9 (x32333) : même travail.","Sol (320003) puis Gmaj9 (300002) : deux notes changent, trouve lesquelles.","Boucle Am9, C9, Gmaj9, Gmaj9, une mesure chacun, trois tours."],tip:"La 9e, c'est la 2e une octave plus haut : depuis la fondamentale, compte un ton.",xp:70},

  {id:"ex-harm-c4-02-01",mod:"harmony",lvl:3,title:"La note qui frotte sur Cmaj7",dur:10,bpm:60,unlockedBy:["harm-c4-02"],courseLink:"harm-c4-02",steps:["Gratte Cmaj7 (x32000) et laisse sonner. Sur la corde 2, tiens quatre temps chacune : Do (corde 2 case 1), Ré (corde 2 case 3), Mi (corde 2 case 5), Fa (corde 2 case 6).","Continue : Sol (corde 2 case 8), La (corde 2 case 10), Si (corde 2 case 12). Repère la seule qui frotte nettement.","Rejoue cette note-là brève, en passage vers la note du dessous, au clic à 60 : elle ne gêne plus.","Résolution : G7 (320001), tiens Si (corde 3 case 4) et Fa (corde 2 case 6), puis glisse d'un demi-ton vers Do (corde 3 case 5) et Mi (corde 2 case 5) en plaquant Cmaj7."],tip:"Une tension se juge à sa durée : courte, elle colore ; tenue, elle demande à être résolue.",xp:70},

  {
    id:"ex-harm-c5-01-01", type:"fretboard_exercise", mod:"harmony", lvl:3,
    title:"Du degré à l'accord", dur:12, xp:75,
    unlockedBy:["harm-c5-01"],
    courseLink:"harm-c5-01",
    stages:[
      {
        instruction:"Cases 0 à 5 : trouve toutes les notes de l'accord du ii en Sol majeur",
        concept:{type:"find_chord",root:"A",quality:"min"},
        selectionRules:{mode:"all"},
        fretRange:[0,5], stringRange:[1,6],
        display:{showNotes:false},
        hint:"Compte les degrés de la gamme de Sol, puis empile des tierces de la gamme.",
        exp:"Le ii de Sol est La mineur : La, Do, Mi.",
        xp:20
      },
      {
        instruction:"Cases 0 à 5 : trouve toutes les notes de l'accord du vi en Ré majeur",
        concept:{type:"find_chord",root:"B",quality:"min"},
        selectionRules:{mode:"all"},
        fretRange:[0,5], stringRange:[1,6],
        display:{showNotes:false},
        hint:"Le motif des qualités est le même dans toutes les tonalités.",
        exp:"Le vi de Ré est Si mineur : Si, Ré, Fa#.",
        xp:25
      },
      {
        instruction:"Cases 0 à 5 : trouve toutes les notes du V7 de Fa majeur",
        concept:{type:"find_chord",root:"C",quality:"dom7"},
        selectionRules:{mode:"all"},
        fretRange:[0,5], stringRange:[1,6],
        display:{showNotes:false},
        hint:"Fa majeur a un bémol : pense-y en ajoutant la 7e.",
        exp:"Le V7 de Fa est C7 : Do, Mi, Sol, Si♭ (affiché La#).",
        xp:30
      }
    ],
    tip:"Plaque chaque accord trouvé, puis enchaîne-le avec le I de sa tonalité : l'oreille confirme le degré."
  },

  {id:"ex-harm-c5-03-01",mod:"harmony",lvl:3,title:"Les familles en Ré",dur:10,bpm:70,unlockedBy:["harm-c5-03"],courseLink:"harm-c5-03",steps:["Ré, Sol, A7 (x02020), Ré : quatre temps par accord au clic à 70. Dis T, SD, D, T en jouant.","Remplace Sol par Mi mineur : même phrase, nouvelle couleur. Dis la famille de chaque accord.","Remplace aussi le premier Ré par Si mineur (x24432).","Invente ta propre phrase de quatre accords en Ré qui suit tonique, sous-dominante, dominante, tonique, et joue-la trois tours."],tip:"Quand tu substitues, garde le même chemin : c'est la fonction qui fait la phrase, pas l'accord précis.",xp:65},

  {id:"ex-harm-c6-01-01",mod:"harmony",lvl:2,title:"Blues en Mi : quick change et turnaround",dur:12,bpm:70,unlockedBy:["harm-c6-01"],courseLink:"harm-c6-01",steps:["Plaque E7 (020100), A7 (x02020) et B7 (x21202) : joue chaque corde une à une, tout doit sonner.","Grille de 12 mesures en Mi : E7 ×4, A7 ×2, E7 ×2, B7, A7, E7 ×2. Quatre coups par mesure au clic à 70, en comptant les mesures.","Quick change : A7 en mesure 2, puis retour sur E7. Deux tours.","Turnaround : B7 en mesure 12 pour relancer la grille. Enchaîne trois tours sans t'arrêter et nomme le degré à chaque changement."],tip:"Compte les mesures à voix basse : le blues ne pardonne pas une mesure de trop, mais il pardonne un accord imparfait.",xp:60},

  {id:"ex-harm-c6-02-01",mod:"harmony",lvl:3,title:"I-V-vi-IV en La, dans tous les ordres",dur:10,bpm:75,unlockedBy:["harm-c6-02"],courseLink:"harm-c6-02",steps:["En La : La (x02220), Mi (022100), Fa# mineur (244222), Ré (xx0232). Une mesure par accord au clic à 75, en disant le chiffre de chaque accord.","Même palette dans l'ordre vi-IV-I-V : écoute la couleur s'assombrir.","Puis IV-I-V-vi : la boucle reste en suspens.","Choisis l'ordre que tu préfères et joue-le trois tours, une fois gratté, une fois arpégé."],tip:"Le barré de Fa# mineur te ralentit ? Prépare-le pendant le dernier temps de Mi : le reste de la main suit.",xp:65},

  {
    id:"ex-harm-c6-04-01", type:"fretboard_exercise", mod:"harmony", lvl:3,
    title:"Les notes caractéristiques des vamps", dur:10, xp:70,
    unlockedBy:["harm-c6-04"],
    courseLink:"harm-c6-04",
    stages:[
      {
        instruction:"Vamp Dm7 - G7 (Ré dorien) : cases 0 à 7, trouve toutes les sixtes majeures de Ré",
        concept:{type:"find_interval",root:"D",interval:9},
        selectionRules:{mode:"all"},
        fretRange:[0,7], stringRange:[1,6],
        display:{showNotes:false},
        hint:"Sixte majeure = 9 demi-tons au-dessus de la tonique.",
        exp:"Si : corde 6 case 7, corde 5 case 2, corde 3 case 4, corde 2 à vide, corde 1 case 7. La note qui fait dorien, et la 3e de G7.",
        xp:20
      },
      {
        instruction:"Vamp Ré - Do (Ré mixolydien) : cases 0 à 7, trouve toutes les septièmes mineures de Ré",
        concept:{type:"find_interval",root:"D",interval:10},
        selectionRules:{mode:"all"},
        fretRange:[0,7], stringRange:[1,6],
        display:{showNotes:false},
        hint:"Septième mineure = 10 demi-tons, un ton sous l'octave.",
        exp:"Do : corde 5 case 3, corde 3 case 5, corde 2 case 1. La fondamentale de l'accord ♭VII.",
        xp:20
      },
      {
        instruction:"Vamp Mim - Fa (Mi phrygien) : cases 0 à 7, trouve toutes les secondes mineures de Mi",
        concept:{type:"find_interval",root:"E",interval:1},
        selectionRules:{mode:"all"},
        fretRange:[0,7], stringRange:[1,6],
        display:{showNotes:false},
        hint:"Seconde mineure = 1 demi-ton au-dessus de la tonique.",
        exp:"Fa : corde 6 case 1, corde 4 case 3, corde 2 case 6, corde 1 case 1. Le demi-ton qui sonne espagnol.",
        xp:25
      }
    ],
    tip:"Fais tourner chaque vamp et pose la note trouvée sur un temps fort : c'est elle qui dit le mode."
  },

  {id:"ex-harm-c7-01-01",mod:"harmony",lvl:3,title:"Emprunts en Sol",dur:12,bpm:70,unlockedBy:["harm-c7-01"],courseLink:"harm-c7-01",steps:["Référence : Sol, Do, Ré, Sol, quatre temps par accord au clic à 70.","Tour 1 : Sol, Do, Do mineur (x35543), Sol. Dis le degré de l'accord emprunté.","Tour 2 : Sol, Mi♭ (x68886), Fa (133211), Sol. Nomme les deux emprunts en chiffres romains.","Tour 3, dominantes secondaires : Sol, E7 (020100), La mineur, D7 (xx0212), Sol. Écoute E7 tirer vers La mineur."],tip:"Un emprunt se repère à une note étrangère à la gamme : cherche-la dans l'accord, c'est elle qui donne la couleur.",xp:75},

  {
    id:"ex-harm-c7-02-01", type:"fretboard_exercise", mod:"harmony", lvl:3,
    title:"Shells et substitution tritonique", dur:10, xp:75,
    unlockedBy:["harm-c7-02"],
    courseLink:"harm-c7-02",
    stages:[
      {
        instruction:"Pose le shell de G7, fondamentale sur la corde 6",
        concept:{type:"find_shape",positions:[{string:6,fret:3},{string:4,fret:3},{string:3,fret:4}]},
        selectionRules:{mode:"all"},
        fretRange:[0,7], stringRange:[1,6],
        display:{showNotes:false},
        hint:"Fondamentale, 7e et 3e : trois notes, cordes 6, 4 et 3.",
        exp:"G7 shell = 3x34xx : Sol, Fa, Si.",
        xp:15
      },
      {
        instruction:"Pose le shell de sa substitution tritonique, fondamentale sur la corde 5",
        concept:{type:"find_shape",positions:[{string:5,fret:4},{string:4,fret:3},{string:3,fret:4}]},
        selectionRules:{mode:"all"},
        fretRange:[0,7], stringRange:[1,6],
        display:{showNotes:false},
        hint:"Cherche l'accord 7 situé 6 demi-tons plus loin. Les deux notes du haut ne bougent pas.",
        exp:"Db7 shell = x434xx : Ré♭, Fa, Si (= Do♭). Mêmes guide tones que G7, seule la basse change.",
        xp:20
      },
      {
        instruction:"Pose le shell de D7, fondamentale sur la corde 5",
        concept:{type:"find_shape",positions:[{string:5,fret:5},{string:4,fret:4},{string:3,fret:5}]},
        selectionRules:{mode:"all"},
        fretRange:[0,7], stringRange:[1,6],
        display:{showNotes:false},
        hint:"Fondamentale, 3e et 7e : cordes 5, 4 et 3.",
        exp:"D7 shell = x545xx : Ré, Fa#, Do.",
        xp:15
      },
      {
        instruction:"Pose le shell de sa substitution tritonique, fondamentale sur la corde 6",
        concept:{type:"find_shape",positions:[{string:6,fret:4},{string:4,fret:4},{string:3,fret:5}]},
        selectionRules:{mode:"all"},
        fretRange:[0,7], stringRange:[1,6],
        display:{showNotes:false},
        hint:"Même principe : les deux notes du haut restent en place.",
        exp:"Ab7 shell = 4x45xx : La♭, Sol♭ (= Fa#), Do. Am7 - Ab7 - Gmaj7 : la basse descend par demi-tons.",
        xp:25
      }
    ],
    tip:"Joue chaque paire de shells à la suite : si seule la basse bouge, tu as trouvé la bonne substitution."
  },

  {id:"ex-harm-c7-03-01",mod:"harmony",lvl:3,title:"Trois façons de moduler",dur:12,bpm:70,unlockedBy:["harm-c7-03"],courseLink:"harm-c7-03",steps:["Par accord pivot, de Do vers Fa : Do, Ré mineur, C7, Fa, Si♭ (x13331), C7, Fa. Quatre temps par accord au clic à 70. Dis à voix haute où la tonique a changé.","Par la dominante, de Do vers Mi mineur : Do, Fa, Sol, Do, B7 (x21202), Mi mineur, La mineur, B7, Mi mineur.","Directe, d'un ton : Sol, Ré, Mi mineur, Do, puis tout de suite La, Mi, Fa# mineur (244222), Ré.","Enchaîne les trois exemples sans t'arrêter et nomme chaque type de modulation au moment où elle arrive."],tip:"Pour sentir une modulation, chante la tonique avant et après : si ta note de repos a changé, la tonalité aussi.",xp:75},

  {
    id:"ex-harm-c8-02-01", type:"fretboard_exercise", mod:"harmony", lvl:3,
    title:"Le squelette du ii-V-I en position V", dur:12, xp:85,
    unlockedBy:["harm-c8-02"],
    courseLink:"harm-c8-02",
    stages:[
      {
        instruction:"Cases 5 à 8 : trouve toutes les notes de Dm7",
        concept:{type:"find_chord",root:"D",quality:"min7"},
        selectionRules:{mode:"all"},
        fretRange:[5,8], stringRange:[1,6],
        display:{showNotes:false},
        hint:"Une position, quatre notes : commence par les fondamentales.",
        exp:"Dm7 = Ré, Fa, La, Do. Ton arpège de ii sans bouger la main.",
        xp:25
      },
      {
        instruction:"Même position : trouve toutes les notes de G7",
        concept:{type:"find_chord",root:"G",quality:"dom7"},
        selectionRules:{mode:"all"},
        fretRange:[5,8], stringRange:[1,6],
        display:{showNotes:false},
        hint:"Repère d'abord les notes communes avec Dm7.",
        exp:"G7 = Sol, Si, Ré, Fa. Ré et Fa sont déjà dans Dm7.",
        xp:25
      },
      {
        instruction:"Même position : trouve toutes les notes de Cmaj7",
        concept:{type:"find_chord",root:"C",quality:"maj7"},
        selectionRules:{mode:"all"},
        fretRange:[5,8], stringRange:[1,6],
        display:{showNotes:false},
        hint:"Cherche les notes à un demi-ton des guide tones de G7.",
        exp:"Cmaj7 = Do, Mi, Sol, Si. Le Fa de G7 descend sur Mi, le Si reste.",
        xp:30
      }
    ],
    tip:"Ensuite, boucle Dm7, G7, Cmaj7 au clic et improvise en posant une note de l'accord en cours sur chaque temps 1."
  },
];
