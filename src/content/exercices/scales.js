// Exercices du module « scales ». Format décrit dans src/content/README.md.

export default [
  // ═══ GAMMES ═══
  {id:"ex-scales-01",mod:"scales",lvl:1,title:"Penta Am pos. 1 propre",dur:12,bpm:60,courseLink:"scales-c3-01",steps:["Index case 5, annulaire case 7, auriculaire case 8.","Joue corde 6 → 1 montant à 60 BPM. Chaque note doit sonner claire.","Redescends c1 → c6 même tempo.","Augmente progressivement : 70, 80, 90 BPM."],tip:"Lenteur = propreté. Propreté = vélocité future.",xp:50},

  {id:"ex-scales-02",mod:"scales",lvl:2,title:"Penta Am 5 positions enchaînées",dur:20,bpm:60,unlockedBy:["scales-c3-07"],courseLink:"scales-c3-07",steps:["Position 1 (case 5) → 2 (case 8) → 3 (case 10) → 4 (case 12) → 5 (case 15) → 1 à l'octave (case 17), une note par temps.","Boucle 3 fois à 60 BPM en montant.","Boucle 3 fois en descendant.","Change de position sur les notes communes (cases 7-8, 9-10, 12-13, 14-15)."],tip:"4 à 6 semaines de pratique pour automatiser. C'est le boss de la pentatonique.",xp:90},

  {id:"ex-scales-pos2-01",mod:"scales",lvl:2,title:"Le raccord position 1 → position 2",dur:10,bpm:60,unlockedBy:["scales-c3-05"],courseLink:"scales-c3-05",steps:["Position 2 seule (cases 7 à 10), en montant et en descendant, au clic à 60.","Monte les cordes 6 à 4 en position 1, change de doigt sur La (corde 4 case 7) et finis en position 2.","Fais le chemin inverse : redescends de la position 2 vers la position 1.","Improvise une minute en passant d'une position à l'autre ; termine sur un La."],tip:"Les cases 7 et 8 appartiennent aux deux positions : vise-les pour changer.",xp:55},

  {id:"ex-scales-pos345-01",mod:"scales",lvl:2,title:"Positions 3, 4 et 5 au clic",dur:15,bpm:60,unlockedBy:["scales-c3-06"],courseLink:"scales-c3-06",steps:["Position 3 (case 10) en montant et en descendant, deux minutes au clic à 60.","Position 4 (case 12), même chose.","Position 5 (case 15), puis la même forme douze cases plus bas, entre les cases 2 et 5.","Dans chaque position, joue uniquement les La en montant : trouve-les sans regarder."],tip:"Une position par jour suffit : demain, reprends la précédente avant d'attaquer la suivante.",xp:65},

  // Lot 4 : formes en 3 notes par corde (scales-3nps-01).
  {id:"ex-scales-3nps-01",mod:"scales",lvl:3,title:"Sol majeur en 3NPS, de 60 à 90",dur:12,bpm:60,unlockedBy:["scales-3nps-01"],courseLink:"scales-3nps-01",steps:["Forme 1 de Sol majeur, de Sol (corde 6 case 3) à Do (corde 1 case 8) : trois notes par temps au clic à 60, médiator alterné strict, en montant puis en descendant.","Deux passages propres de suite : +10 BPM. Arrête-toi à 90, ou au premier accroc.","Même travail en legato : une attaque par corde, les deux autres notes en hammer-on (en descendant, en pull-off).","Forme 2, départ sur La (corde 6 case 5) : joue-la à 60 en tournant autour de La, pour entendre La dorien."],tip:"Si la vitesse coince, ralentis au lieu de forcer : la propreté à 70 prépare mieux 90 que dix passages brouillons.",xp:70},

  {id:"ex-scales-03",mod:"scales",lvl:2,title:"Sol majeur 2 octaves",dur:12,bpm:65,courseLink:"scales-c2-05",steps:["Sol(corde 6 case 3)-La(corde 6 case 5)-Si(corde 5 case 2)-Do(corde 5 case 3)-Ré(corde 5 case 5)-Mi(corde 4 case 2)-Fa#(corde 4 case 4)-Sol(corde 4 case 5).","Continue : La(corde 3 case 2)-Si(corde 3 case 4)-Do(corde 2 case 1)-Ré(corde 2 case 3)-Mi(corde 2 case 5)-Fa#(corde 1 case 2)-Sol(corde 1 case 3).","Descends pareil. 5 cycles complets.","Identifie Sol et Si comme repères visuels."],tip:"Cette position couvre 2 octaves. Mémorise-la, c'est ta base en Sol.",xp:70},

  {id:"ex-scales-04",mod:"scales",lvl:3,title:"Ré dorien sur drone",dur:15,bpm:80,courseLink: "scales-c5-02",steps:["Lance backing 'Dm7 vamp 80 BPM' (YouTube) ou drone Ré.","Joue Ré dorien : Ré-Mi-Fa-Sol-La-Si-Do.","Mets en valeur Si (la sixte caractéristique) toutes les 2 mesures.","10 minutes non-stop. Enregistre-toi."],tip:"Sans le Si, ça sonnera mineur générique. Le Si fait toute la différence.",xp:85},

  {id:"ex-scales-05",mod:"scales",lvl:3,title:"Sol mixolydien sur G7",dur:12,bpm:75,courseLink: "scales-c5-05",steps:["Backing G7 75 BPM ou blues en Sol.","Joue Sol mixolydien : Sol-La-Si-Do-Ré-Mi-Fa.","Mets en avant le Fa naturel (♭7 caractéristique).","Compare 5 min avec Sol majeur (Fa#) — entends la différence."],tip:"Le Fa naturel = LA note mixolydienne. C'est la 7e de l'accord.",xp:80},

  {id:"ex-scales-06",mod:"scales",lvl:3,title:"Mineure harmonique sur V7",dur:12,bpm:80,courseLink:"scales-c6-01",steps:["Sur la cadence E7→Am, joue La mineure harmonique sur le E7.","La harmonique = La-Si-Do-Ré-Mi-Fa-Sol#.","Le Sol# crée la tension parfaite vers Am.","Compare avec La éolien (Sol naturel) — moins de tension."],tip:"Sol# de l'harmonique = la 3 de E7. Match parfait pour la résolution.",xp:80},

  {
    id:"ex-fret-04", type:"fretboard_exercise", mod:"scales", lvl:1,
    title:"Pentatonique mineure de La — 3 positions", dur:15, xp:85,
    unlockedBy:["scales-c3-05"],
    courseLink:"scales-c3-05",
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

  // ═══ UN EXERCICE PAR LEÇON (paliers 1 à 9) ═══
  // Notes, altérations, intervalles (paliers 1 à 3)
  {
    id:"ex-scales-c1-01-01", type:"fretboard_exercise", mod:"scales", lvl:1,
    title:"Les notes naturelles, corde par corde", dur:8, xp:50,
    unlockedBy:["scales-c1-01"], courseLink:"scales-c1-01",
    stages:[
      {instruction:"Corde 5 : sélectionne toutes les notes naturelles, de la corde à vide à la case 12", concept:{type:"find_scale",root:"C",quality:"major"}, selectionRules:{mode:"all"}, fretRange:[0,12], stringRange:[5,5], display:{showNotes:false}, hint:"Pars de La à vide et récite l'alphabet : La, Si, Do… Deux paires de notes sont collées, les autres sont à deux cases.", exp:"La (0), Si (2), Do (3), Ré (5), Mi (7), Fa (8), Sol (10), La (12). Les paires collées : Si-Do et Mi-Fa.", xp:15},
      {instruction:"Corde 6 : même chose, de Mi à vide à la case 12", concept:{type:"find_scale",root:"C",quality:"major"}, selectionRules:{mode:"all"}, fretRange:[0,12], stringRange:[6,6], display:{showNotes:false}, hint:"Mi à vide, et la note suivante de l'alphabet est tout de suite collée.", exp:"Mi (0), Fa (1), Sol (3), La (5), Si (7), Do (8), Ré (10), Mi (12).", xp:15},
      {instruction:"Corde 4 : de Ré à vide à la case 12", concept:{type:"find_scale",root:"C",quality:"major"}, selectionRules:{mode:"all"}, fretRange:[0,12], stringRange:[4,4], display:{showNotes:false}, hint:"Ré à vide. Cherche où tombent Mi-Fa et Si-Do.", exp:"Ré (0), Mi (2), Fa (3), Sol (5), La (7), Si (9), Do (10), Ré (12).", xp:20},
    ],
    tip:"Sur chaque corde, le même alphabet se déroule : seules changent les cases de départ. Repère toujours Mi-Fa et Si-Do d'abord."
  },

  {
    id:"ex-scales-c1-02-01", type:"fretboard_exercise", mod:"scales", lvl:1,
    title:"Dièses et bémols sur le manche", dur:10, xp:55,
    unlockedBy:["scales-c1-02"], courseLink:"scales-c1-02",
    stages:[
      {instruction:"Trouve tous les Fa# entre la case 0 et la case 12", concept:{type:"find_note",root:"F#"}, selectionRules:{mode:"all"}, fretRange:[0,12], stringRange:[1,6], display:{showNotes:false}, hint:"Trouve d'abord chaque Fa, puis monte d'une case.", exp:"Fa# en corde 6 case 2, corde 5 case 9, corde 4 case 4, corde 3 case 11, corde 2 case 7, corde 1 case 2.", xp:15},
      {instruction:"Trouve tous les Si♭ entre la case 0 et la case 12", concept:{type:"find_note",root:"Bb"}, selectionRules:{mode:"all"}, fretRange:[0,12], stringRange:[1,6], display:{showNotes:false}, hint:"Un bémol descend d'une case : pars de chaque Si.", exp:"Si♭ en corde 6 case 6, corde 5 case 1, corde 4 case 8, corde 3 case 3, corde 2 case 11, corde 1 case 6.", xp:20},
      {instruction:"Trouve tous les Do# entre la case 0 et la case 12", concept:{type:"find_note",root:"C#"}, selectionRules:{mode:"all"}, fretRange:[0,12], stringRange:[1,6], display:{showNotes:false}, hint:"Do + une case. Sur la corde 2, Do est en case 1.", exp:"Do# en corde 6 case 9, corde 5 case 4, corde 4 case 11, corde 3 case 6, corde 2 case 2, corde 1 case 9.", xp:20},
    ],
    tip:"Ne cherche jamais une altération « de nulle part » : trouve la note naturelle voisine, puis une case vers l'aigu (#) ou vers le grave (♭)."
  },

  {id:"ex-scales-c1-03-01",mod:"scales",lvl:1,title:"Mesurer les écarts sur une corde",dur:8,bpm:60,unlockedBy:["scales-c1-03"],courseLink:"scales-c1-03",steps:["Corde 4 : joue Ré à vide, puis avance d'un ton (deux cases). Nomme la note d'arrivée.","Depuis cette note, avance encore d'un ton, puis d'un demi-ton : nomme chaque note, au clic à 60.","Corde 6, depuis Fa (corde 6 case 1) : un ton, un ton, un ton. Nomme les quatre notes ; la dernière porte une altération.","Corde 3, depuis Sol à vide : avance de note naturelle en note naturelle jusqu'au Sol de la case 12, en disant « ton » ou « demi » à chaque pas."],tip:"Dis l'écart avant de jouer la note : c'est l'écart que tu apprends, pas la case.",xp:45},

  {
    id:"ex-scales-c1-04-01", type:"fretboard_exercise", mod:"scales", lvl:1,
    title:"Une case, deux noms", dur:10, xp:55,
    unlockedBy:["scales-c1-04"], courseLink:"scales-c1-04",
    stages:[
      {instruction:"Trouve tous les Ré♭ entre la case 0 et la case 5", concept:{type:"find_note",root:"Db"}, selectionRules:{mode:"all"}, fretRange:[0,5], stringRange:[1,6], display:{showNotes:false}, hint:"Ré♭ partage sa case avec une note en dièse : cherche-la depuis le Do voisin.", exp:"Ré♭ = Do# : corde 5 case 4, corde 2 case 2.", xp:15},
      {instruction:"Trouve tous les La♭ entre la case 0 et la case 5", concept:{type:"find_note",root:"Ab"}, selectionRules:{mode:"all"}, fretRange:[0,5], stringRange:[1,6], display:{showNotes:false}, hint:"Une case sous chaque La.", exp:"La♭ = Sol# : corde 6 case 4, corde 3 case 1, corde 1 case 4.", xp:20},
      {instruction:"Trouve tous les Mi♭ entre la case 0 et la case 5", concept:{type:"find_note",root:"Eb"}, selectionRules:{mode:"all"}, fretRange:[0,5], stringRange:[1,6], display:{showNotes:false}, hint:"Mi♭ s'écrit aussi avec un dièse sur la note du dessous.", exp:"Mi♭ = Ré# : corde 4 case 1, corde 2 case 4.", xp:20},
    ],
    tip:"Pour chaque case trouvée, dis ses deux noms à voix haute : le dièse depuis la note du dessous, le bémol depuis celle du dessus."
  },

  {
    id:"ex-scales-c1-05-01", type:"fretboard_exercise", mod:"scales", lvl:1,
    title:"Tierces, quartes, quintes à trouver", dur:12, xp:65,
    unlockedBy:["scales-c1-05"], courseLink:"scales-c1-05",
    stages:[
      {instruction:"Trouve toutes les tierces majeures au-dessus de La, entre la case 0 et la case 5", concept:{type:"find_interval",root:"A",interval:4}, selectionRules:{mode:"all"}, fretRange:[0,5], stringRange:[1,6], display:{showNotes:false}, hint:"Tierce majeure : 4 demi-tons. Compte quatre cases depuis La, nomme la note, puis cherche-la partout.", exp:"Do# : corde 5 case 4, corde 2 case 2.", xp:15},
      {instruction:"Trouve toutes les quartes justes au-dessus de Ré, entre la case 0 et la case 5", concept:{type:"find_interval",root:"D",interval:5}, selectionRules:{mode:"all"}, fretRange:[0,5], stringRange:[1,6], display:{showNotes:false}, hint:"Quarte juste : 5 demi-tons. Compte les noms : Ré (1), Mi (2), …", exp:"Sol : corde 6 case 3, corde 4 case 5, corde 3 à vide, corde 1 case 3.", xp:15},
      {instruction:"Trouve toutes les quintes justes au-dessus de Mi, entre la case 0 et la case 5", concept:{type:"find_interval",root:"E",interval:7}, selectionRules:{mode:"all"}, fretRange:[0,5], stringRange:[1,6], display:{showNotes:false}, hint:"Quinte juste : 7 demi-tons, cinq noms de notes depuis Mi.", exp:"Si : corde 5 case 2, corde 3 case 4, corde 2 à vide.", xp:15},
      {instruction:"Trouve toutes les tierces mineures au-dessus de Sol, entre la case 0 et la case 5", concept:{type:"find_interval",root:"G",interval:3}, selectionRules:{mode:"all"}, fretRange:[0,5], stringRange:[1,6], display:{showNotes:false}, hint:"Tierce mineure : 3 demi-tons. Le nom compte trois lettres, et une altération apparaît.", exp:"Si♭ : corde 5 case 1, corde 3 case 3.", xp:20},
    ],
    tip:"Deux étapes à chaque fois : compte les noms pour savoir quel intervalle, compte les demi-tons pour savoir quelle altération."
  },

  {id:"ex-scales-c1-06-01",mod:"scales",lvl:1,title:"Les grands intervalles depuis Mi et Ré",dur:10,bpm:60,unlockedBy:["scales-c1-06"],courseLink:"scales-c1-06",steps:["Corde 6 : Mi à vide, puis la case 9. Nomme l'intervalle et la note d'arrivée, puis chante les deux notes.","Mi à vide, puis la case 10, puis la case 11 : deux septièmes. Dis laquelle sonne comme dans un accord E7.","Mi à vide, puis la case 6 : laisse sonner le triton, puis monte d'une case et écoute la tension tomber.","Corde 4, depuis Ré à vide : joue les cases 8, 9, 10, 11 et 12 en revenant à vide entre chaque, et nomme chaque intervalle et chaque note, au clic à 60."],tip:"Les nombres de cases ne bougent pas d'une corde à l'autre : +9 donne toujours une sixte majeure, +10 une septième mineure.",xp:50},

  // Gammes, degrés, cycle des quintes (paliers 5 et 6)
  {id:"ex-scales-c2-01-01",mod:"scales",lvl:2,title:"Trois gammes majeures sur une corde",dur:10,bpm:60,unlockedBy:["scales-c2-01"],courseLink:"scales-c2-01",steps:["Corde 4, depuis Ré à vide : applique la formule 2-2-1-2-2-2-1 cases, en nommant chaque note au clic à 60. Combien de dièses as-tu rencontrés ?","Corde 6, depuis Fa (corde 6 case 1) : même formule jusqu'au Fa de la case 13. Une note altérée apparaît : nomme-la avec la bonne écriture (une lettre par note).","Corde 5, depuis La à vide : même formule jusqu'à la case 12, et compte les altérations.","Écris les trois gammes de tête, puis rejoue-les en descendant pour vérifier."],tip:"La formule ne change jamais : seule la case de départ bouge. Si tu doutes d'une note, recompte les cases depuis la précédente.",xp:55},

  {
    id:"ex-scales-c2-02-01", type:"fretboard_exercise", mod:"scales", lvl:2,
    title:"Gammes majeures en position", dur:12, xp:70,
    unlockedBy:["scales-c2-02"], courseLink:"scales-c2-02",
    stages:[
      {instruction:"Sol majeur entre la case 2 et la case 5 : sélectionne toutes ses notes", concept:{type:"find_scale",root:"G",quality:"major"}, selectionRules:{mode:"all"}, fretRange:[2,5], stringRange:[1,6], display:{showNotes:false}, hint:"Pars de Sol, corde 6 case 3, et applique T-T-DT-T-T-T-DT.", exp:"Sol, La, Si, Do, Ré, Mi, Fa# : une seule altération, le Fa#.", xp:20},
      {instruction:"Ré majeur entre la case 2 et la case 5", concept:{type:"find_scale",root:"D",quality:"major"}, selectionRules:{mode:"all"}, fretRange:[2,5], stringRange:[1,6], display:{showNotes:false}, hint:"Ré est sur la corde 5, case 5. Même formule.", exp:"Ré, Mi, Fa#, Sol, La, Si, Do# : deux dièses.", xp:25},
      {instruction:"Fa majeur entre la case 1 et la case 5", concept:{type:"find_scale",root:"F",quality:"major"}, selectionRules:{mode:"all"}, fretRange:[1,5], stringRange:[1,6], display:{showNotes:false}, hint:"Fa : corde 6 case 1. Attention à la quatrième note, une lettre par note.", exp:"Fa, Sol, La, Si♭, Do, Ré, Mi : un bémol.", xp:25},
    ],
    tip:"Une gamme majeure, c'est une formule et une fondamentale : trouve la fondamentale d'abord, la forme suit."
  },

  {id:"ex-scales-c2-03-01",mod:"scales",lvl:2,title:"Parler en degrés dans trois tonalités",dur:10,bpm:60,unlockedBy:["scales-c2-03"],courseLink:"scales-c2-03",steps:["En Sol majeur : Sol, Do, Ré, Sol, quatre coups par accord au clic à 60. Dis le degré à voix haute sur chaque accord.","En Ré majeur : trouve toi-même les accords des degrés I, IV et V, puis joue I-IV-V-I en disant les degrés.","En La majeur : même travail. Puis tiens le V deux mesures avant de revenir au I, et écoute la tension.","Joue I-V-vi-IV en Sol, puis en Ré : trouve chaque accord à partir de sa place dans la gamme."],tip:"Pour trouver le V d'une tonalité, compte cinq notes depuis la tonique, bornes comprises.",xp:55},

  {id:"ex-scales-c2-04-01",mod:"scales",lvl:2,title:"Vérifier le cycle des quintes à la guitare",dur:12,bpm:null,unlockedBy:["scales-c2-04"],courseLink:"scales-c2-04",steps:["Sans guitare : depuis Do, récite le cycle vers la droite jusqu'à Mi ; pour chaque tonalité, dis combien de dièses et lesquels.","Vérifie : joue Ré majeur sur la seule corde 4, de la corde à vide à la case 12, et nomme chaque note altérée.","Même chose pour La majeur sur la corde 5, depuis la corde à vide. Les dièses arrivent-ils dans l'ordre Fa, Do, Sol ?","Vers la gauche : Fa majeur sur la corde 6 depuis la case 1, puis Si♭ majeur sur la corde 6 depuis la case 6. Quels bémols apparaissent ?"],tip:"Chaque tonalité garde les altérations de la précédente et en ajoute une : tu n'as qu'une note nouvelle à chercher.",xp:60},

  // Pentatoniques et blues (palier 6)
  {id:"ex-scales-c3-02-01",mod:"scales",lvl:2,title:"Position 1 dans tous les sens",dur:12,bpm:60,unlockedBy:["scales-c3-02"],courseLink:"scales-c3-02",steps:["Position 1 de La pentatonique mineure (case 5) en groupes de quatre notes, en montant puis en descendant, au clic à 60.","En sautant une note : La-Ré, Do-Mi, Ré-Sol… jusqu'en haut, puis redescends de la même façon.","Relie les trois La de la position : La (corde 6 case 5), La (corde 4 case 7), La (corde 1 case 5), en jouant toutes les notes entre eux.","Une minute d'impro dans la position, chaque phrase finit sur un La différent. Puis monte à 70."],tip:"Si un enchaînement accroche, isole les deux notes concernées et répète-les dix fois avant de reprendre.",xp:60},

  {
    id:"ex-scales-c3-03-01", type:"fretboard_exercise", mod:"scales", lvl:2,
    title:"Pentatoniques majeures et relatives", dur:12, xp:70,
    unlockedBy:["scales-c3-03"], courseLink:"scales-c3-03",
    stages:[
      {instruction:"Do pentatonique majeure entre la case 5 et la case 8", concept:{type:"find_scale",root:"C",quality:"pentatonic_major"}, selectionRules:{mode:"all"}, fretRange:[5,8], stringRange:[1,6], display:{showNotes:false}, hint:"Pense à sa relative mineure : tu connais déjà cette forme.", exp:"Do, Ré, Mi, Sol, La : la position 1 de La pentatonique mineure, rien ne change.", xp:20},
      {instruction:"Sol pentatonique majeure entre la case 0 et la case 3", concept:{type:"find_scale",root:"G",quality:"pentatonic_major"}, selectionRules:{mode:"all"}, fretRange:[0,3], stringRange:[1,6], display:{showNotes:false}, hint:"1-2-3-5-6 depuis Sol. Ou : sa relative mineure, trois demi-tons plus bas.", exp:"Sol, La, Si, Ré, Mi = Mi pentatonique mineure.", xp:25},
      {instruction:"Ré pentatonique majeure entre la case 2 et la case 5", concept:{type:"find_scale",root:"D",quality:"pentatonic_major"}, selectionRules:{mode:"all"}, fretRange:[2,5], stringRange:[1,6], display:{showNotes:false}, hint:"1-2-3-5-6 depuis Ré ; une note porte un dièse.", exp:"Ré, Mi, Fa#, La, Si = Si pentatonique mineure.", xp:25},
    ],
    tip:"Une forme, deux gammes : la pentatonique majeure et sa relative mineure ne diffèrent que par la note où tu te poses."
  },

  {
    id:"ex-scales-c3-04-01", type:"fretboard_exercise", mod:"scales", lvl:2,
    title:"Gamme blues : placer la blue note", dur:12, xp:70,
    unlockedBy:["scales-c3-04"], courseLink:"scales-c3-04",
    stages:[
      {instruction:"Gamme blues de La entre la case 5 et la case 8 : toutes ses notes", concept:{type:"find_scale",root:"A",quality:"blues"}, selectionRules:{mode:"all"}, fretRange:[5,8], stringRange:[1,6], display:{showNotes:false}, hint:"La position 1 de la penta mineure, plus une note entre la quarte et la quinte.", exp:"La, Do, Ré, Ré#, Mi, Sol : la blue note s'ajoute sur la corde 5 et sur la corde 3.", xp:20},
      {instruction:"Trouve toutes les blue notes de la gamme blues de La, entre la case 0 et la case 12", concept:{type:"find_interval",root:"A",interval:6}, selectionRules:{mode:"all"}, fretRange:[0,12], stringRange:[1,6], display:{showNotes:false}, hint:"La ♭5 : trois tons au-dessus de la fondamentale.", exp:"Ré# (ou Mi♭) : corde 6 case 11, corde 5 case 6, corde 4 case 1, corde 3 case 8, corde 2 case 4, corde 1 case 11.", xp:25},
      {instruction:"Gamme blues de Mi entre la case 0 et la case 3", concept:{type:"find_scale",root:"E",quality:"blues"}, selectionRules:{mode:"all"}, fretRange:[0,3], stringRange:[1,6], display:{showNotes:false}, hint:"1-♭3-4-♭5-5-♭7 depuis Mi.", exp:"Mi, Sol, La, Si♭, Si, Ré : la gamme blues des riffs en Mi, cordes à vide comprises.", xp:25},
    ],
    tip:"Sur le manche, la blue note est toujours collée à la quinte : quand tu la vises, prévois la case suivante pour retomber."
  },

  // Majeur, mineur et modes (paliers 7 et 8)
  {id:"ex-scales-c4-01-01",mod:"scales",lvl:3,title:"Sol majeur ou Mi mineur ?",dur:10,bpm:60,unlockedBy:["scales-c4-01"],courseLink:"scales-c4-01",steps:["Plaque Em, puis monte et descends la gamme de Sol majeur en position ouverte, en commençant et en finissant sur un Mi, au clic à 60.","Plaque Sol, puis rejoue exactement les mêmes notes en commençant et en finissant sur un Sol.","Trouve seul la relative mineure de Ré majeur, puis celle de Fa majeur : plaque chaque paire d'accords l'un après l'autre.","Une minute d'impro sur Em, une minute sur Sol, avec les mêmes notes : seule ta note de repos change."],tip:"La relative mineure est sur le 6e degré : compte six notes depuis la tonique majeure, ou descends d'un ton et demi.",xp:65},

  {id:"ex-scales-c4-02-01",mod:"scales",lvl:3,title:"Un réservoir, trois drones",dur:12,bpm:60,unlockedBy:["scales-c4-02"],courseLink:"scales-c4-02",steps:["Laisse sonner la corde 4 à vide et joue les notes de Do majeur de Ré à Ré sur la corde 2, de la case 3 à la case 15, au clic à 60.","Laisse sonner la corde 6 à vide et joue les mêmes notes de Mi à Mi sur la corde 1, de la corde à vide à la case 12.","Laisse sonner la corde 5 à vide et joue-les de La à La sur la corde 3, de la case 2 à la case 14.","Pour chaque drone, nomme le mode (le degré de départ dans Do majeur) et dis si sa tierce est majeure ou mineure."],tip:"Garde le drone fort et la mélodie douce : c'est la note grave qui dit à l'oreille où est la maison.",xp:70},

  {id:"ex-scales-c4-03-01",mod:"scales",lvl:3,title:"La dorien : poser la note caractéristique",dur:12,bpm:60,unlockedBy:["scales-c4-03"],courseLink:"scales-c4-03",steps:["Laisse sonner la corde 5 à vide comme drone et joue La éolien sur les cordes 3 à 1 (La, Si, Do, Ré, Mi, Fa, Sol), au clic à 60 : pose-toi souvent sur La.","Remplace chaque Fa par un Fa# : c'est La dorien. Pose Fa# (corde 1 case 2) sur les temps forts, en notes longues.","Coupe le drone et joue les mêmes notes sans rien dessous : écoute vers quelle note ton oreille glisse.","Remets une ancre, cette fois une vamp Am7 (x02010) en boucle, et improvise deux minutes en La dorien."],tip:"Une note caractéristique entendue en passant ne suffit pas : tiens-la, sur le temps, pour que le mode s'installe.",xp:75},

  {
    id:"ex-scales-c5-01-01", type:"fretboard_exercise", mod:"scales", lvl:3,
    title:"Ionien : la gamme et sa sensible", dur:12, xp:75,
    unlockedBy:["scales-c5-01"], courseLink:"scales-c5-01",
    stages:[
      {instruction:"Do ionien entre la case 7 et la case 10 : toutes ses notes", concept:{type:"find_scale",root:"C",quality:"major"}, selectionRules:{mode:"all"}, fretRange:[7,10], stringRange:[1,6], display:{showNotes:false}, hint:"Fondamentale : corde 6 case 8. Formule 1-2-3-4-5-6-7.", exp:"Do, Ré, Mi, Fa, Sol, La, Si : aucune altération, en position case 8.", xp:20},
      {instruction:"Trouve toutes les sensibles de Do, entre la case 0 et la case 12", concept:{type:"find_interval",root:"C",interval:11}, selectionRules:{mode:"all"}, fretRange:[0,12], stringRange:[1,6], display:{showNotes:false}, hint:"La sensible : le 7e degré, un demi-ton sous la tonique.", exp:"Si : corde 6 case 7, corde 5 case 2, corde 4 case 9, corde 3 case 4, corde 2 à vide et case 12, corde 1 case 7.", xp:25},
      {instruction:"Ré ionien entre la case 2 et la case 5", concept:{type:"find_scale",root:"D",quality:"major"}, selectionRules:{mode:"all"}, fretRange:[2,5], stringRange:[1,6], display:{showNotes:false}, hint:"Fondamentale : corde 5 case 5. Même formule que Do ionien.", exp:"Ré, Mi, Fa#, Sol, La, Si, Do#.", xp:30},
    ],
    tip:"Dans chaque position, repère la sensible à côté de la fondamentale : c'est la note qui fait conclure tes phrases."
  },

  {
    id:"ex-scales-c5-03-01", type:"fretboard_exercise", mod:"scales", lvl:3,
    title:"Phrygien : la seconde mineure", dur:12, xp:75,
    unlockedBy:["scales-c5-03"], courseLink:"scales-c5-03",
    stages:[
      {instruction:"Mi phrygien entre la case 0 et la case 3 : toutes ses notes", concept:{type:"find_scale",root:"E",quality:"phrygian"}, selectionRules:{mode:"all"}, fretRange:[0,3], stringRange:[1,6], display:{showNotes:false}, hint:"Le 3e mode de Do majeur : pas une seule altération.", exp:"Mi, Fa, Sol, La, Si, Do, Ré : les notes de Do majeur, posées sur Mi.", xp:20},
      {instruction:"La phrygien entre la case 5 et la case 8", concept:{type:"find_scale",root:"A",quality:"phrygian"}, selectionRules:{mode:"all"}, fretRange:[5,8], stringRange:[1,6], display:{showNotes:false}, hint:"1-♭2-♭3-4-5-♭6-♭7 depuis La : la mineure naturelle avec une seconde abaissée.", exp:"La, Si♭, Do, Ré, Mi, Fa, Sol : le Si♭ remplace le Si de La mineur.", xp:25},
      {instruction:"Trouve toutes les secondes mineures au-dessus de La, entre la case 0 et la case 12", concept:{type:"find_interval",root:"A",interval:1}, selectionRules:{mode:"all"}, fretRange:[0,12], stringRange:[1,6], display:{showNotes:false}, hint:"Un demi-ton au-dessus de la fondamentale.", exp:"Si♭ : corde 6 case 6, corde 5 case 1, corde 4 case 8, corde 3 case 3, corde 2 case 11, corde 1 case 6.", xp:30},
    ],
    tip:"La note caractéristique se vise depuis la fondamentale : une case au-dessus, sur la même corde."
  },

  {id:"ex-scales-c5-04-01",mod:"scales",lvl:3,title:"Do lydien sur Do – Ré",dur:12,bpm:70,unlockedBy:["scales-c5-04"],courseLink:"scales-c5-04",steps:["Enregistre une boucle Do (x32010) et Ré (xx0232), deux mesures chacun, au clic à 70.","Sur la boucle, joue Do majeur en position ouverte, puis remplace chaque Fa par un Fa# : c'est Do lydien.","Pose Fa# (corde 4 case 4) en note longue pendant l'accord de Do, sans le résoudre.","Improvise deux minutes en Do lydien ; finis tes phrases sur Do, Mi ou Fa#, jamais sur Fa."],tip:"Le Fa# n'a pas besoin d'aller quelque part : laisse-le flotter, c'est lui qui fait le lydien.",xp:75},

  {
    id:"ex-scales-c5-06-01", type:"fretboard_exercise", mod:"scales", lvl:3,
    title:"Éolien : deux notes de plus que la penta", dur:12, xp:75,
    unlockedBy:["scales-c5-06"], courseLink:"scales-c5-06",
    stages:[
      {instruction:"La éolien entre la case 5 et la case 8 : toutes ses notes", concept:{type:"find_scale",root:"A",quality:"natural_minor"}, selectionRules:{mode:"all"}, fretRange:[5,8], stringRange:[1,6], display:{showNotes:false}, hint:"Pars de la position 1 de la penta mineure et ajoute les deux notes qui manquent.", exp:"La, Si, Do, Ré, Mi, Fa, Sol : la penta plus Si et Fa.", xp:20},
      {instruction:"Mi éolien entre la case 7 et la case 10", concept:{type:"find_scale",root:"E",quality:"natural_minor"}, selectionRules:{mode:"all"}, fretRange:[7,10], stringRange:[1,6], display:{showNotes:false}, hint:"Fondamentale : corde 5 case 7. Formule 1-2-♭3-4-5-♭6-♭7.", exp:"Mi, Fa#, Sol, La, Si, Do, Ré : les notes de Sol majeur, posées sur Mi.", xp:25},
      {instruction:"Trouve toutes les sixtes mineures au-dessus de La, entre la case 0 et la case 12", concept:{type:"find_interval",root:"A",interval:8}, selectionRules:{mode:"all"}, fretRange:[0,12], stringRange:[1,6], display:{showNotes:false}, hint:"La ♭6 : un demi-ton au-dessus de la quinte.", exp:"Fa : corde 6 case 1, corde 5 case 8, corde 4 case 3, corde 3 case 10, corde 2 case 6, corde 1 case 1. Elle aime retomber sur Mi.", xp:30},
    ],
    tip:"Éolien = penta mineure + 2 et ♭6. Ajoute-les sans changer de position : les doigts restent où ils sont."
  },

  {id:"ex-scales-c5-07-01",mod:"scales",lvl:3,title:"Locrien en passage : ii-V-i en Mi mineur",dur:12,bpm:60,unlockedBy:["scales-c5-07"],courseLink:"scales-c5-07",steps:["Plaque Bm7♭5 (x2323x) et joue ses quatre notes une par une : nomme-les et repère la quinte diminuée.","Joue Si locrien sur la seule corde 2, de la corde à vide à la case 12, au clic à 60, en nommant chaque note.","Transpose le ii-V-i en Mi mineur : trouve l'accord demi-diminué de départ et la dominante, puis joue-les une mesure chacun avant Em.","Sur l'accord demi-diminué, joue son arpège en montant ; sur la dominante, laisse sonner ; sur Em, pose un Mi."],tip:"Le locrien ne vit qu'une mesure : traverse-le, ne t'y installe pas.",xp:75},

  // Mineure mélodique et choix de gamme (palier 9)
  {
    id:"ex-scales-c6-02-01", type:"fretboard_exercise", mod:"scales", lvl:3,
    title:"Mineure mélodique sur le manche", dur:12, xp:80,
    unlockedBy:["scales-c6-02"], courseLink:"scales-c6-02",
    stages:[
      {instruction:"La mineur mélodique entre la case 4 et la case 8 : toutes ses notes", concept:{type:"find_scale",root:"A",quality:"melodic_minor"}, selectionRules:{mode:"all"}, fretRange:[4,8], stringRange:[1,6], display:{showNotes:false}, hint:"Pars de La mineur naturel et monte la 6e et la 7e d'un demi-ton.", exp:"La, Si, Do, Ré, Mi, Fa#, Sol# : seule la tierce Do reste mineure.", xp:25},
      {instruction:"Mi mineur mélodique entre la case 7 et la case 10", concept:{type:"find_scale",root:"E",quality:"melodic_minor"}, selectionRules:{mode:"all"}, fretRange:[7,10], stringRange:[1,6], display:{showNotes:false}, hint:"Fondamentale : corde 5 case 7. Même méthode : mineur naturel, puis 6 et 7 remontées.", exp:"Mi, Fa#, Sol, La, Si, Do#, Ré#.", xp:25},
      {instruction:"Toutes les notes de Am(maj7), entre la case 0 et la case 12", concept:{type:"find_chord",root:"A",quality:"minMaj7"}, selectionRules:{mode:"all"}, fretRange:[0,12], stringRange:[1,6], display:{showNotes:false}, hint:"Fondamentale, tierce mineure, quinte, et une septième majeure.", exp:"La, Do, Mi, Sol# : l'accord qui réunit la ♭3 et la 7 majeure de la mélodique.", xp:30},
    ],
    tip:"La mélodique, c'est une gamme majeure avec la tierce abaissée : pense « majeur sauf la 3 » pour la trouver vite."
  },

  {id:"ex-scales-c6-03-01",mod:"scales",lvl:3,title:"Choisir sa gamme sur trois grilles",dur:15,bpm:70,unlockedBy:["scales-c6-03"],courseLink:"scales-c6-03",steps:["Grille 1 : Em, C, G, D, une mesure chacun, en boucle au clic à 70. Trouve la tonalité, choisis ta gamme, et improvise deux minutes en visant la tierce de chaque accord.","Grille 2 : A7 seul, tenu en boucle. Choisis le mode qui colle à cet accord, et fais entendre sa note caractéristique en notes longues.","Grille 3 : Bm7♭5, E7, Am. Choisis une gamme pour E7 qui prépare l'arrivée sur Am, et pose-toi sur La à la fin.","Rejoue chaque grille avec la gamme de survie : la penta mineure de la tonique. Écoute ce que tu gagnes et ce que tu perds."],tip:"Commence toujours par la tonalité : l'accord sur lequel la grille revient et se repose te donne ta gamme par défaut.",xp:85},
];
