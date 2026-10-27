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

  {id:"ex-impro-sommet-01",mod:"impro",lvl:3,title:"Un solo de 12 mesures, un sommet",dur:15,bpm:80,unlockedBy:["impro-05b"],courseLink:"impro-05b",steps:["Blues 12 mesures en La (la Jam, ou un La7 en boucle), et enregistre-toi.","Mesures 1 à 4 : peu de notes, longues, en position 1 (case 5).","Mesures 5 à 8 : monte vers la case 12, plus dense ; sommet vers la mesure 8.","Mesures 9 à 12 : redescends et finis sur La, note longue. Réécoute et note chaque mesure de 1 à 10."],tip:"Si ta courbe est plate, rejoue en t'interdisant l'aigu avant la mesure 7.",xp:85},
];
