// Exercices du module « impro ». Format décrit dans src/content/README.md.

export default [
  // ═══ IMPRO ═══
  {id:"ex-impro-01",mod:"impro",lvl:1,title:"Impro 3 notes Am",dur:10,bpm:70,courseLink:"scales-c3-01",steps:["Backing Am 70 BPM. Joue UNIQUEMENT 3 notes : La (corde 4 case 7), Do (corde 3 case 5), Mi (corde 2 case 5).","5 minutes : varie le rythme et l'ordre, jamais les notes.","Ajoute 2 notes : Ré (corde 3 case 7), Sol (corde 2 case 8).","5 min avec ces 5 notes = penta complète pos. 1."],tip:"Contrainte = créativité. Plus de notes ≠ plus de musicalité.",xp:55},

  {id:"ex-impro-02",mod:"impro",lvl:2,title:"Cibler les guide tones",dur:12,bpm:80,courseLink:"harm-c8-01",steps:["Backing Dm7-G7-Cmaj7 80 BPM.","Sur Dm7 : termine ta phrase sur Fa (3) ou Do (♭7).","Sur G7 : cible Si (3) ou Fa (♭7).","Sur Cmaj7 : cible Mi (3) ou Si (M7)."],tip:"Cibler les guide tones = sonner immédiatement 'sur l'accord'. Truc n°1 du jazz.",xp:80},

  {id:"ex-impro-03",mod:"impro",lvl:3,title:"Impro modale dorien 10 min",dur:15,bpm:90,courseLink: "scales-c5-02",steps:["Drone Ré (corde 5 vide ou app drone).","Joue uniquement Ré dorien : Ré-Mi-Fa-Sol-La-Si-Do.","Construis des phrases de 4-8 notes contenant TOUTES Si.","10 min non-stop. Enregistre. Écoute après."],tip:"Sans Si, dorien sonne mineur générique. Avec Si, c'est une autre couleur.",xp:90},

  {id:"ex-impro-04",mod:"impro",lvl:3,title:"Approche chromatique",dur:12,bpm:70,courseLink:"harm-c8-01",steps:["Backing Cmaj7 70 BPM. Cible Mi (3 de Cmaj7).","Avant chaque Mi, joue Fa (1/2 ton au-dessus). Phrase : Fa→Mi.","Ou : joue Mib (1/2 ton en dessous). Phrase : Mib→Mi.","Mélange les 2 approches dans une impro de 5 min."],tip:"Chromatisme = note tendue → note cible. Source du son bebop.",xp:75},

  {id:"ex-impro-05",mod:"impro",lvl:3,title:"Enclosure de Sol sur Cmaj7",dur:10,bpm:75,courseLink:"harm-c8-01",steps:["Cible : Sol (5 de Cmaj7).","Encadre Sol par : Lab (chrome au-dessus) et Fa# (chrome en dessous).","Lick : Lab-Fa#-Sol. Joue cette enclosure 10 fois.","Intègre dans une impro libre sur Cmaj7."],tip:"Enclosure = arrivée 'parfaite' sur la cible. Très utilisé en bebop.",xp:80},

  {
    id:"ex-fret-08", type:"fretboard_exercise", mod:"impro", lvl:3,
    title:"Cibler les guide tones en impro", dur:12, xp:95,
    unlockedBy:["harm-c8-01","scales-c3-01"],
    courseLink:"harm-c8-01",
    stages:[
      {
        instruction:"Sur G7 : repère toutes les notes Si (3e — guide tone)",
        concept:{type:"find_note",root:"B"},
        selectionRules:{mode:"all"},
        fretRange:[0,12], stringRange:[1,6],
        display:{showNotes:false},
        hint:"Si est à vide sur la corde 2. Ce sont tes notes d'arrivée sur G7.",
        exp:"Si en corde 6 case 7, corde 5 case 2, corde 4 case 9, corde 3 case 4, corde 2 à vide, corde 1 case 7. Cibles d'arrivée sur G7.",
        xp:25
      },
      {
        instruction:"Sur G7 : repère toutes les notes Fa (7e — tension à résoudre)",
        concept:{type:"find_note",root:"F"},
        selectionRules:{mode:"all"},
        fretRange:[0,12], stringRange:[1,6],
        display:{showNotes:false},
        hint:"Fa est case 1 corde 1. Cette note veut descendre vers Mi (résolution).",
        exp:"Fa en corde 6 case 1, corde 5 case 8, corde 4 case 3, corde 3 case 10, corde 2 case 6, corde 1 case 1. Tension → résolution vers Mi de Cmaj7.",
        xp:25
      },
      {
        instruction:"Sur Cmaj7 : repère toutes les notes Mi (3e — couleur majeure)",
        concept:{type:"find_note",root:"E"},
        selectionRules:{mode:"all"},
        fretRange:[0,12], stringRange:[1,6],
        display:{showNotes:false},
        hint:"Mi est à vide sur les cordes 6 et 1. Note de repos de Cmaj7.",
        exp:"Mi en corde 6 à vide, corde 5 case 7, corde 4 case 2, corde 3 case 9, corde 2 case 5, corde 1 à vide. Résolution naturelle depuis Fa de G7.",
        xp:25
      }
    ],
    tip:"Cibler les guide tones (3e + 7e) de chaque accord = la différence entre 'sonner sur l'accord' et 'jouer des notes au hasard'."
  },

  // Lot 4 : exercices des secondes moitiés des leçons d'impro scindées.
  {id:"ex-impro-cadence-01",mod:"impro",lvl:3,title:"G7 → Cmaj7 : résoudre les guide tones",dur:10,bpm:70,unlockedBy:["impro-03b"],courseLink:"impro-03b",steps:["Boucle G7 et Cmaj7, une mesure chacun, au clic à 70.","Sur G7, pose Si (corde 3 case 4) et Fa (corde 2 case 6) ensemble ; sur Cmaj7, Do (corde 3 case 5) et Mi (corde 2 case 5).","Sur G7, ajoute Lab (corde 1 case 4) en fin de mesure, puis pose Sol (corde 1 case 3) sur Cmaj7.","Trois minutes d'impro en Do majeur : chaque Cmaj7 commence sur Mi ou Do, jamais sur Fa tenu."],tip:"Si une phrase sonne fausse sur Cmaj7, cherche le Fa tenu : c'est presque toujours lui.",xp:75},

  {id:"ex-impro-couleurs-01",mod:"impro",lvl:3,title:"Am7 : La penta, puis Mi penta",dur:10,bpm:70,unlockedBy:["impro-06b"],courseLink:"impro-06b",steps:["Fais tourner Am7 (en boucle ou dans la Jam).","Deux minutes en La pentatonique mineure, position 1 (case 5).","Deux minutes en Mi pentatonique mineure autour de la case 7 : finis tes phrases sur Si (corde 1 case 7) ou Ré (corde 1 case 10).","Deux minutes en alternant : une phrase dans chaque gamme."],tip:"La 9e (Si) flotte, la tonique (La) conclut : choisis selon que la phrase doit relancer ou finir.",xp:75},

  {id:"ex-impro-enjambe-01",mod:"impro",lvl:3,title:"Enjamber le changement",dur:12,bpm:70,unlockedBy:["impro-04b"],courseLink:"impro-04b",steps:["ii-V-I en Do (Dm7, G7, Cmaj7) au clic à 70, ou la Jam en Jazz ii-V-I.","Fin de chaque mesure de Dm7 : Do (corde 3 case 5), puis Si (corde 3 case 4) au temps 1 de G7.","Fin de chaque mesure de G7 : Fa (corde 2 case 6), puis Mi (corde 2 case 5) au temps 1 de Cmaj7.","Improvise librement entre ces arrivées : seules les fins de mesure sont imposées."],tip:"Pense la phrase depuis sa cible : choisis d'abord où tu arrives, puis remonte vers le début.",xp:80},

  {id:"ex-impro-sommet-01",mod:"impro",lvl:3,title:"Un solo de 12 mesures, un sommet",dur:15,bpm:80,unlockedBy:["impro-05b"],courseLink:"impro-05b",steps:["Blues 12 mesures en La (la Jam, ou un La7 en boucle), et enregistre-toi.","Mesures 1 à 4 : peu de notes, longues, en position 1 (case 5).","Mesures 5 à 8 : monte vers la case 12, plus dense ; sommet vers la mesure 8.","Mesures 9 à 12 : redescends et finis sur La, note longue. Réécoute l'enregistrement, repère la mesure où se trouve ton sommet et, s'il arrive trop tôt ou trop tard, rejoue le solo en le plaçant vers les deux tiers (mesure 8)."],tip:"Si ta courbe est plate, rejoue en t'interdisant l'aigu avant la mesure 7.",xp:85},

  // ═══ UN EXERCICE PAR LEÇON ═══
  {id:"ex-impro-intro-01-01",mod:"impro",lvl:1,title:"Trois notes, quatre contraintes de rythme",dur:8,bpm:70,unlockedBy:["impro-intro-01"],courseLink:"impro-intro-01",steps:["Main en place : La (corde 6 case 5) à l'index, Do (corde 6 case 8) à l'auriculaire, Mi (corde 5 case 7) à l'annulaire. Clic à 70.","Une minute : une seule note par mesure, toujours sur le temps 1. Choisis laquelle à chaque fois.","Une minute : le motif de la leçon (1, « et » du 2, 4), en changeant l'ordre des trois notes à chaque mesure.","Une minute : joue seulement sur les « et », jamais sur les temps.","Deux minutes libres : mélange ces rythmes, avec une mesure de silence de temps en temps, et termine sur La."],tip:"Si tu t'ennuies avec trois notes, c'est que le rythme ne bouge pas assez : change d'abord quand tu joues.",xp:50},

  {id:"ex-impro-01-01",mod:"impro",lvl:2,title:"Questions en suspens, réponses posées",dur:10,bpm:70,unlockedBy:["impro-01"],courseLink:"impro-01",steps:["Clic à 70, La pentatonique mineure en position 1 (case 5). Joue la question de la leçon et tiens la dernière note : elle reste en l'air.","Deux mesures de silence, puis la réponse, qui se pose sur La.","Garde la même question et invente trois réponses différentes, chacune finie sur La, Do ou Mi.","Inverse : invente trois questions de quatre notes au plus, finies sur Sol ou Ré, et réponds à chacune.","Deux minutes : alterne question, silence, réponse, sans jamais remplir les deux mesures de silence."],tip:"Compte le silence à voix basse : « 1, 2, 3, 4 » deux fois. Il fait partie de la phrase autant que les notes.",xp:65},

  {
    id:"ex-impro-02-01", type:"fretboard_exercise", mod:"impro", lvl:3,
    title:"Les cibles de Am7, A7 et D7", dur:10, xp:85,
    unlockedBy:["impro-02"],
    courseLink:"impro-02",
    stages:[
      {
        instruction:"Position 1 (cases 5 à 8) : sélectionne toutes les notes de l'accord Am7",
        concept:{type:"find_chord",root:"A",quality:"min7"},
        selectionRules:{mode:"all"},
        fretRange:[5,8], stringRange:[1,6],
        display:{showNotes:false},
        hint:"Quatre notes : la fondamentale, la tierce mineure, la quinte et la septième mineure. Toutes sont dans la pentatonique.",
        exp:"Am7 = La, Do, Mi, Sol. Dans la position 1, ce sont les notes où tes phrases sonnent posées.",
        xp:25
      },
      {
        instruction:"Sur A7, la note qui fait entendre l'accord est sa tierce majeure : trouve-la entre les cases 4 et 9",
        concept:{type:"find_interval",root:"A",interval:4},
        selectionRules:{mode:"all"},
        fretRange:[4,9], stringRange:[1,6],
        display:{showNotes:false},
        hint:"Quatre demi-tons au-dessus de La. Elle n'est pas dans la pentatonique mineure de La.",
        exp:"La tierce de A7 est Do# : corde 6 case 9, corde 5 case 4, corde 3 case 6 et corde 1 case 9. Sur A7, elle remplace le Do de la pentatonique.",
        xp:30
      },
      {
        instruction:"Sur D7, trouve sa tierce majeure entre les cases 0 et 12",
        concept:{type:"find_interval",root:"D",interval:4},
        selectionRules:{mode:"all"},
        fretRange:[0,12], stringRange:[1,6],
        display:{showNotes:false},
        hint:"Quatre demi-tons au-dessus de Ré.",
        exp:"La tierce de D7 est Fa# : corde 6 case 2, corde 5 case 9, corde 4 case 4, corde 3 case 11, corde 2 case 7, corde 1 case 2.",
        xp:30
      }
    ],
    tip:"Ensuite, guitare en main : alterne A7 et D7 au clic, et pose sur le 1 de chaque accord la tierce que tu viens de trouver."
  },

  {id:"ex-impro-03-01",mod:"impro",lvl:3,title:"Approches vers Mi et vers La",dur:10,bpm:70,unlockedBy:["impro-03"],courseLink:"impro-03",steps:["Lam en boucle (ou la Jam en Blues mineur, tonalité La), clic à 70. Rejoue d'abord la tab de la leçon : trois arrivées sur Do.","Cible Mi (corde 2 case 5) : approche par en dessous depuis Ré# (corde 2 case 4), puis par au-dessus depuis Fa (corde 2 case 6). La cible tombe sur le temps fort.","Enclosure de Mi : Fa, Ré#, puis Mi sur le temps 1. Quatre fois.","Même travail vers La (corde 1 case 5), depuis Sol# (corde 1 case 4) et La# (corde 1 case 6).","Deux minutes d'impro dans la pentatonique : chaque fin de phrase arrive sur Do, Mi ou La par une approche."],tip:"La note d'approche ne se tient jamais : elle passe vite, sur un temps faible, et c'est la cible qu'on fait durer.",xp:75},

  {id:"ex-impro-04-01",mod:"impro",lvl:3,title:"La case qui bouge, en Sol",dur:12,bpm:60,unlockedBy:["impro-04"],courseLink:"impro-04",steps:["Rejoue la tab de la leçon sur Dm7, G7, Cmaj7, deux notes au temps 1 de chaque accord.","Transpose en Sol : Am7, D7, Gmaj7. Sur Am7, pose la 3e et la 7e sur les cordes 3 et 2, autour de la case 5.","Pour D7, puis Gmaj7, cherche la 3e et la 7e en ne bougeant qu'une case à la fois, comme en Do.","Vérifie à l'oreille et au manche : d'un accord à l'autre, une note reste en place et l'autre descend d'un demi-ton. Si deux notes bougent, reprends la recherche.","Boucle Am7, D7, Gmaj7 au clic à 60 : une seule de ces notes par accord, puis brode autour."],tip:"La 7e d'un accord descend d'un demi-ton vers la 3e du suivant ; l'autre note ne bouge pas. Cherche ce glissement, pas une nouvelle forme.",xp:85},

  {id:"ex-impro-05-01",mod:"impro",lvl:3,title:"Un motif, quatre transformations",dur:12,bpm:70,unlockedBy:["impro-05"],courseLink:"impro-05",steps:["Lam en boucle (ou la Jam en Blues mineur, tonalité La), clic à 70. Motif : Do (corde 3 case 5), Ré (corde 3 case 7), Mi (corde 2 case 5). Joue-le quatre fois, toujours au même endroit de la mesure.","Déplace-le : même motif, mais commence sur le temps 2, puis sur le « et » du 3.","Étire-le : chaque note dure deux fois plus longtemps.","Monte-le d'un cran dans la pentatonique : Ré, Mi, Sol (corde 2 case 8), même rythme.","Enchaîne les quatre versions comme un petit solo de huit mesures, et finis sur La (corde 4 case 7)."],tip:"Une seule chose change à la fois : l'oreille reconnaît le motif et suit son évolution.",xp:80},

  {id:"ex-impro-06-01",mod:"impro",lvl:3,title:"Le lick blues en Ré",dur:12,bpm:70,unlockedBy:["impro-06"],courseLink:"impro-06",steps:["Rejoue le lick de la leçon en La, au clic à 70 : bend, descente, approche chromatique, vibrato.","Transpose-le en Ré, cinq cases plus haut : bend de Sol (corde 3 case 12) jusqu'à la hauteur de La (corde 3 case 14), puis Do (corde 2 case 13) et La (corde 2 case 10).","Approche chromatique : Sol (corde 5 case 10), Sol# (corde 5 case 11), La (corde 5 case 12), puis Ré (corde 4 case 12) avec vibrato.","Ré7 en boucle (ou la Jam en Blues 12 mesures, tonalité Ré) : place le lick au début de chaque grille, puis transforme-le (un autre rythme, une note de moins, une autre fin)."],tip:"Vérifie ton bend avant de le tirer : joue d'abord la note cible, puis pousse la corde jusqu'à l'entendre.",xp:85},
];
