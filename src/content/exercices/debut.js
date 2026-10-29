// Exercices du module « debut » (Premiers pas). Format décrit dans src/content/README.md.

export default [
  // ═══ PREMIERS PAS ═══
  {id:"ex-debut-01",mod:"debut",lvl:1,title:"Posture et détente",dur:5,courseLink:"debut-c1-01",steps:["Installe-toi assis, guitare sur la cuisse, dos droit, pieds à plat.","Lâche le manche : la guitare doit tenir seule. Sinon, rapproche-la de toi.","Pose la main gauche, pouce derrière le manche, doigts arrondis.","Gratte les cordes à vide 4 fois vers le bas, puis vérifie : épaules basses, mâchoire détendue, respiration libre.","Recommence 3 fois en te relevant entre chaque essai, pour retrouver la position de mémoire."],tip:"Une posture se mémorise comme un geste : la retrouver vite et sans réfléchir, c'est déjà la moitié du travail.",xp:40},

  {id:"ex-debut-02",mod:"debut",lvl:1,title:"Échauffement 1-2-3-4",dur:6,bpm:60,courseLink:"debut-c1-04",steps:["Métronome à 60 BPM, une note par clic.","Corde 6 : index case 1, majeur case 2, annulaire case 3, auriculaire case 4.","Passe à la corde 5, puis à la 4, et ainsi de suite jusqu'à la corde 1.","Redescends de la corde 1 à la corde 6, en jouant 4-3-2-1.","Chaque note doit sonner nette : si une note frise, rapproche le doigt de la frette."],tip:"Laisse les doigts posés derrière celui qui joue quand c'est possible : ça économise des mouvements et ça muscle l'indépendance.",xp:40},

  {id:"ex-debut-03",mod:"debut",lvl:1,title:"Accorder sans accordeur",dur:8,courseLink:"debut-c1-06",steps:["Accorde la corde 6 avec l'accordeur (Outils → Accordeur), puis ferme-le.","Désaccorde légèrement la corde 5 (un petit quart de tour vers le grave).","Joue la corde 6 case 5 et la corde 5 à vide ensemble : écoute les battements et réaccorde la corde 5 en montant.","Fais pareil pour les cordes 4, 3 (case 5) et 2 (case 4 de la corde 3), puis 1 (case 5 de la corde 2).","Vérifie le résultat avec l'accordeur : à quel point étais-tu proche ?"],tip:"Plus l'ondulation ralentit, plus tu approches. Quand elle disparaît, c'est juste.",xp:50},

  {id:"ex-debut-04",mod:"debut",lvl:1,title:"Une minute de changements",dur:8,courseLink:"debut-c2-04",steps:["Lance un minuteur d'une minute.","Alterne Mi mineur et La mineur : un coup par accord, le plus de changements propres possible.","Puis recommence avec Do et La mineur.","Puis avec Sol et Ré, et avec Mi mineur et Do.","Refais l'exercice demain : tu enchaîneras naturellement plus vite."],tip:"Mieux vaut un changement lent qui sonne qu'un rapide qui frise. Cherche les doigts qui peuvent rester en place.",xp:50},

  {id:"ex-debut-05",mod:"debut",lvl:1,title:"Sol, Ré, Mi mineur, Do au métronome",dur:10,bpm:60,courseLink:"debut-c2-06",steps:["Métronome à 60 BPM. Une mesure par accord, 4 coups vers le bas : Sol, Ré, Mi mineur, Do.","Fais tourner la boucle 2 minutes sans t'arrêter, même si un accord n'est pas parfait.","Remplace les 4 coups par la rythmique bas, bas-haut, haut-bas-haut (deux mesures par accord si besoin).","Quand c'est fluide, monte à 70 BPM.","Termine en démarrant la boucle sur Mi mineur : Mi mineur, Do, Sol, Ré."],tip:"Le rythme ne s'arrête jamais : c'est la main droite qui commande, la main gauche suit.",xp:60},

  {id:"ex-debut-06",mod:"debut",lvl:1,title:"Lire et jouer une tab",dur:8,courseLink:"debut-c3-03",steps:["Ouvre la leçon « Premières mélodies en tablature ».","Joue l'Ode à la joie très lentement, en disant le nom de chaque note.","Rejoue-la sans t'arrêter, même en cas d'erreur.","Joue-la de mémoire, sans regarder la tab.","Bonus : saisis-la dans Outils → Tablature et écoute-la pour vérifier."],tip:"Index pour la case 1, annulaire pour la case 3 : la main ne bouge pas, seuls les doigts se déplacent.",xp:50},

  // ═══ UN EXERCICE PAR LEÇON ═══
  {id:"ex-debut-c1-02-01",mod:"debut",lvl:1,title:"Juste assez de pression",dur:6,bpm:60,unlockedBy:["debut-c1-02"],courseLink:"debut-c1-02",steps:["Index sur Fa (corde 1 case 1) : joue la note doigt au milieu de la case, puis tout près de la frette. Écoute laquelle sonne nette avec le moins d'effort.","Relâche jusqu'à ce que la note frise, puis rajoute juste assez de pression pour qu'elle sonne. Fais-le avec les doigts 1, 2, 3 et 4 (cases 1 à 4).","Annulaire sur Sol (corde 1 case 3) : décolle le pouce du manche et rejoue la note. Si elle sonne encore, ta main ne serre pas trop.","Au clic à 60, une note par temps sur la corde 2 : cases 1, 2, 3, 4 avec les doigts 1, 2, 3, 4, bout des doigts arrondis.","Secoue la main gauche et vérifie : pouce derrière le manche, paume décollée, poignet souple."],tip:"Le bout des doigts chauffe les premières semaines, c'est normal. Le poignet ou le pouce qui tire, non : pause, puis moins de pression.",xp:40},

  {id:"ex-debut-c1-03-01",mod:"debut",lvl:1,title:"Médiator au poignet, puis aux doigts",dur:6,bpm:60,unlockedBy:["debut-c1-03"],courseLink:"debut-c1-03",steps:["Prends le médiator : à plat sur la dernière phalange de l'index, pouce par-dessus, seule la pointe dépasse.","Cordes à vide, au clic à 60 : quatre coups vers le bas par mesure, en comptant « 1, 2, 3, 4 ». Avant-bras posé, le geste vient du poignet.","Même chose en ne grattant que les cordes 3, 2 et 1, puis que les cordes 6, 5 et 4 : vise une seule zone de cordes.","Pose le médiator. Pouce sur la corde 6, puis i, m, a sur les cordes 3, 2, 1, une note par clic, quatre tours.","Termine par une minute de coups vers le bas au médiator, en secouant la main droite toutes les quatre mesures."],tip:"Si le médiator tourne entre tes doigts, serre un tout petit peu plus, mais jamais au point de crisper le poignet.",xp:40},

  {id:"ex-debut-c1-05-01",mod:"debut",lvl:1,title:"Le nom de tes six cordes",dur:5,bpm:null,unlockedBy:["debut-c1-05"],courseLink:"debut-c1-05",steps:["Joue les six cordes à vide de la 6 à la 1 en disant leur nom à voix haute, puis de la 1 à la 6.","Recommence avec les lettres anglaises de l'accordeur.","Les yeux fermés, joue une corde au hasard et dis son numéro et son nom, puis ouvre les yeux pour vérifier. Dix fois.","Détends la corde 1 d'un quart de tour : écoute le son descendre. Retends-la en arrivant par en dessous, jusqu'au même son que Mi (corde 2 case 5).","Vérifie ton accordage avec ton accordeur avant de jouer."],tip:"Repère la mécanique de la corde avant de tourner : sur la tête du manche, on se trompe facilement de clé.",xp:40},

  {id:"ex-debut-c2-01-01",mod:"debut",lvl:1,title:"Du diagramme aux doigts",dur:6,bpm:null,unlockedBy:["debut-c2-01"],courseLink:"debut-c2-01",steps:["Regarde le diagramme de Mi mineur de la leçon dix secondes, puis cache-le.","Pose l'accord de mémoire : pour chaque doigt, dis tout haut son numéro, sa corde et sa case. Gratte les six cordes.","Ressors le diagramme et compare avec ce que tu as posé.","Écris l'accord en six caractères sur une feuille, de la corde 6 à la corde 1, puis compare avec le récap de la leçon.","Lis à voix haute x02210, corde par corde (« corde 6 muette, corde 5 à vide… »), et pose ce que ça donne, sans chercher son nom."],tip:"Pour ne plus confondre les côtés : sur un diagramme, la corde 6, la plus grave, est à gauche, comme sur ta guitare posée debout devant toi.",xp:40},

  {
    id:"ex-debut-c2-02-01", type:"fretboard_exercise", mod:"debut", lvl:1,
    title:"Mi mineur et La mineur sur le manche", dur:5, xp:45,
    unlockedBy:["debut-c2-02"],
    courseLink:"debut-c2-02",
    stages:[
      {
        instruction:"Montre Mi mineur : sélectionne seulement les cases à presser",
        concept:{type:"find_shape",positions:[{string:5,fret:2},{string:4,fret:2}],neutralPositions:[{string:6,fret:0},{string:3,fret:0},{string:2,fret:0},{string:1,fret:0}]},
        selectionRules:{mode:"all"},
        fretRange:[0,4], stringRange:[1,6],
        display:{showNotes:false},
        hint:"Deux doigts côte à côte, dans la même case. Les cordes à vide n'ont rien à sélectionner.",
        exp:"Mi mineur : corde 5 case 2 (majeur) et corde 4 case 2 (annulaire), les autres cordes à vide.",
        xp:20
      },
      {
        instruction:"Montre La mineur : sélectionne seulement les cases à presser",
        concept:{type:"find_shape",positions:[{string:4,fret:2},{string:3,fret:2},{string:2,fret:1}],neutralPositions:[{string:5,fret:0},{string:1,fret:0}]},
        selectionRules:{mode:"all"},
        fretRange:[0,4], stringRange:[1,6],
        display:{showNotes:false},
        hint:"Le duo de Mi mineur se décale d'une corde vers les aigus, et l'index s'ajoute.",
        exp:"La mineur : corde 4 case 2, corde 3 case 2, corde 2 case 1 ; corde 5 et corde 1 à vide, corde 6 muette.",
        xp:25
      }
    ],
    tip:"Après l'exercice, pose les deux accords sur ta guitare, dix fois chacun, d'un seul geste."
  },

  {id:"ex-debut-c2-03-01",mod:"debut",lvl:1,title:"Do, Sol, Ré : la bonne corde de départ",dur:8,bpm:60,unlockedBy:["debut-c2-03"],courseLink:"debut-c2-03",steps:["Pose Do et joue ses cordes une par une depuis sa corde de départ : la corde 3 à vide doit sonner. Pareil avec Sol, puis Ré.","Au clic à 60, quatre coups vers le bas sur chaque accord, en commençant ton geste sur sa corde de départ.","Une minute Sol ↔ Do, puis une minute Do ↔ Ré : quatre coups chacun, sans t'arrêter au changement.","Enchaîne Sol, Do, Ré, Sol, une mesure chacun, quatre tours."],tip:"Ré résiste ? Arrondis le majeur : il ne doit pas effleurer la corde 2.",xp:50},

  {id:"ex-debut-c2-05-01",mod:"debut",lvl:1,title:"Trois rythmiques sans s'arrêter",dur:8,bpm:60,unlockedBy:["debut-c2-05"],courseLink:"debut-c2-05",steps:["Mi mineur, clic à 60 : quatre mesures de coups vers le bas, un par temps, en comptant tout haut.","Sans t'arrêter, passe à quatre mesures de bas-haut : bas sur les chiffres, haut sur les « et ».","Garde ce balancier et enchaîne la passe-partout : bas, bas-haut, haut-bas-haut, en passant dans le vide là où il faut.","Boucle les trois rythmiques, quatre mesures chacune, deux minutes. Puis monte à 70."],tip:"Le balancier ne s'arrête jamais : rate les cordes plutôt que de figer la main.",xp:45},

  {id:"ex-debut-c3-01-01",mod:"debut",lvl:1,title:"Lire une tab à vue",dur:6,bpm:60,unlockedBy:["debut-c3-01"],courseLink:"debut-c3-01",steps:["Joue la première tab de la leçon (corde 1 : 0, 1, 3, 1, 0) au clic à 60, une note par clic.","Même suite de chiffres sur la ligne du dessous, la corde 2 : dis le nom de chaque note.","Puis sur la ligne G et la ligne D, en disant chaque fois le numéro de la corde avant de jouer.","Joue l'accord empilé de la leçon, puis invente une tab de cinq notes sur une feuille et joue-la."],tip:"Avant de jouer une tab, repère sur quelle ligne elle commence : en haut = aigu, en bas = grave.",xp:45},

  {id:"ex-debut-c3-02-01",mod:"debut",lvl:1,title:"Le riff au hammer-on",dur:8,bpm:60,unlockedBy:["debut-c3-02"],courseLink:"debut-c3-02",steps:["Hammer-on seul : Mi (corde 4 case 2), puis frappe Fa (corde 4 case 3) sans regratter. Dix fois, au clic à 60.","Pull-off inverse : deux doigts posés, joue Fa (corde 4 case 3) et retire l'annulaire en accrochant la corde pour faire sonner Mi.","Joue le riff de la leçon lentement : La (corde 5 case 0), Do (corde 5 case 3), Ré (corde 4 case 0), puis le 2h3 et la redescente.","Remplace le hammer-on par un glissé (2/3), puis rejoue la version d'origine : écoute la différence entre les deux signes."],tip:"Frappe la case avec le bout du doigt, tout près de la frette : c'est la précision qui fait sonner la note, pas la force.",xp:50},
];
