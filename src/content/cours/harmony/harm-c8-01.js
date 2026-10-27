// Leçon du module « harmony » + les questions de quiz qui s'y rattachent.
// Format « leçon en cartes » décrit dans src/content/README.md.

export default {
  id: "harm-c8-01", level: 7,
  title: "Cibler les notes d'accord en temps réel",
  duration: 9,
  gropiTip: "Sur un blues en La, passe du Do# (3e de La7) au Do (7e de Ré7) pile au changement d'accord. Un seul demi-ton, et tout le monde entend que l'harmonie a bougé.",
  cartes: [
    { type: "idee", titre: "Suivre les accords", texte: [
      "Improviser avec la seule gamme de la tonalité, ça sonne correct, mais le solo flotte : il ne réagit pas aux changements d'accords.",
      "Le ciblage consiste à choisir, sur chaque accord, une ou deux notes qui le définissent, et à faire arriver tes phrases dessus.",
    ] },
    { type: "idee", titre: "Quelles cibles ?", texte: [
      "D'abord la 3e et la 7e, les guide tones : elles disent la qualité de l'accord. Ensuite la fondamentale, stable mais moins colorée. Puis la quinte, assez neutre.",
      "Les extensions (9, 11, 13) viendront plus tard. Pour commencer, vise les guide tones.",
    ] },
    { type: "idee", titre: "Sur les temps forts", texte: [
      "Une cible porte le plus sur un temps fort, le 1 ou le 3 en 4/4. Les notes de passage vont sur les temps faibles et les contretemps.",
      "Chaque temps fort confirme alors l'accord en cours. Entre deux cibles, le couloir est libre.",
    ] },
    { type: "question", quizId: "q-harm-19" },
    { type: "idee", titre: "Approche et enclosure", texte: [
      "Pour arriver en douceur, joue juste avant la cible la note un demi-ton au-dessus ou en dessous. Sur G7, vers le Si : Do puis Si, ou Si♭ puis Si.",
      "L'enclosure encadre la cible : au-dessus, en dessous, puis la cible. Do, Si♭, Si : une petite suspension, une arrivée plus nette. Un son typique du bebop.",
    ], bloc: { type: "fretboard", caption: "Enclosure sur G7 : Do (au-dessus), Sib (en dessous), puis Si, la cible — corde 3", data: {frets: 4, startFret: 2, showStringNames: true, showFretNumbers: true, markerFrets: [3,5], notes: [{string: 3, fret: 5, label: "Do", color: "neutral"}, {string: 3, fret: 3, label: "Sib", color: "neutral"}, {string: 3, fret: 4, label: "Si", color: "primary", root: true}]} } },
    { type: "question", quizId: "q-impro-10" },
    { type: "a-toi", titre: "Atterrir sur le ii-V-I",
      consigne: "Boucle Dm7, G7, Cmaj7, une mesure chacun au clic. Tour 1 : joue seulement les guide tones de la tab, une note par temps. Tour 2 : improvise librement, mais pose une guide tone au temps 1 de chaque accord. Tour 3 : arrive-y par une enclosure.",
      bloc: { type: "tab", caption: "Guide tones sur Dm7 – G7 – Cmaj7 : Fa/Do, puis Fa/Si, puis Mi/Si — une seule note bouge à chaque accord", text: "Tab : Dm7 = Fa (corde 2 case 6) et Do (corde 3 case 5) ; G7 = Fa (corde 2 case 6) et Si (corde 3 case 4) ; Cmaj7 = Mi (corde 2 case 5) et Si (corde 3 case 4).", data: { lines: ["e|---------------------|","B|-6-------6-------5---|","G|-5-------4-------4---|","D|---------------------|","A|---------------------|","E|---------------------|"] } },
      bpm: 60, minuteur: 180 },
    { type: "question", quizId: "q-harm-20" },
    { type: "recap", points: [
      "Sur chaque accord, vise d'abord la 3e et la 7e.",
      "Les cibles sur les temps forts, les notes de passage entre elles.",
      "Arrive sur la cible par un demi-ton, ou encadre-la : enclosure.",
    ] },
  ],
  quiz: ["q-harm-19","q-harm-20","q-impro-06","q-impro-10","q-impro-15"],
};

export const quiz = [
  {id:"q-harm-19",courseId:"harmony",lessonId:"harm-c8-01",lvl:3,q:"Sur un solo, où placer idéalement les 'notes cibles' (3e/7e) ?",o:["N'importe où, le placement ne compte pas", "Sur les contretemps (les « et »)", "Sur les temps forts (1 et 3)", "Uniquement sur le 4e temps"],a:2,exp:"Notes cibles sur les temps forts (1 et 3) = solo qui 'tombe' sur l'harmonie. Notes de passage sur les temps faibles. Cette répartition crée le swing rythmique-harmonique.",xp:50},
  {id:"q-harm-20",courseId:"harmony",lessonId:"harm-c8-01",lvl:3,q:"Sur G7, jouer un Lab juste avant un Sol crée…",o:["Une dissonance qui reste sans résolution", "Un changement d'accord implicite", "Une modulation vers une autre tonalité", "Une approche chromatique vers Sol"],a:3,exp:"Approche chromatique = note 1 demi-ton au-dessus ou en dessous de la cible. Lab→Sol crée une 'arrivée' élégante sur Sol. Technique de bebop classique.",xp:55},
  {id:"q-impro-06",courseId:"impro",lessonId:"harm-c8-01",lvl:3,q:"Sur G7 qui va vers Cmaj7, laquelle de ces notes apporte le plus de tension ?",o:["Lab, la ♭9","La, la 9e","Mi, la 13e","Ré, la quinte"],a:0,exp:"Le Lab (♭9) frotte un demi-ton au-dessus de la fondamentale Sol : c'est l'extension la plus tendue d'un accord de dominante. Il se résout en descendant sur Sol, la quinte de Cmaj7. La 9e et la 13e colorent sans cette friction, et Ré est une note stable de l'accord.",xp:65},
  {id:"q-impro-10",courseId:"impro",lessonId:"harm-c8-01",lvl:3,q:"L''enclosure' (encadrement chromatique) consiste à…",o:["Jouer un accord enrichi à la place", "Rester dans une seule position du manche", "Entourer la note cible de ses voisines", "Jouer la note cible plus fort que les autres"],a:2,exp:"Enclosure = note cible Si encadrée par Do (chrome au-dessus) et Sib (chrome en dessous). Joue Do-Sib-Si. Crée une 'arrivée' élégante sur la cible.",xp:65},
  {id:"q-impro-15",courseId:"impro",lessonId:"harm-c8-01",lvl:3,q:"Tu finis ta phrase sur la 9e d'un accord Maj7 (ex: Ré sur Cmaj7). Effet ?",o:["Dissonant","Identique à finir sur la tonique","Mauvaise note","Couleur jazz sophistiquée, 'flottante'"],a:3,exp:"Finir sur la 9 (Ré sur Cmaj7) crée une couleur 'colored' = pas de résolution complète, tension douce qui invite à continuer. Très utilisé en jazz/bossa.",xp:65},
];
