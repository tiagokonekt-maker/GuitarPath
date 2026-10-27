// Leçon du module « harmony » + les questions de quiz qui s'y rattachent.
// Format « leçon en cartes » décrit dans src/content/README.md.

export default {
  id: "harmony-03", level: 7,
  title: "Arpèges — l'accord en mélodie",
  duration: 8,
  gropiTip: "Sur Cmaj7, joue l'arpège de Mim (Mi-Sol-Si) : tu obtiens la 3e, la 5e et la 7e de l'accord, sans la fondamentale. Un son plus moderne, parfait quand la basse joue déjà le Do.",
  cartes: [
    { type: "idee", titre: "L'accord, note par note", texte: [
      "Un arpège, ce sont les notes d'un accord jouées une à une. C'est le pont entre l'harmonie, verticale, et la mélodie, horizontale.",
      "Un solo fait seulement de gamme peut flotter au-dessus des accords. Des fragments d'arpège le font tomber dessus aux moments clés.",
    ] },
    { type: "idee", titre: "Les formules, tu les as", texte: [
      "Triades : majeure 1-3-5, mineure 1-♭3-5, diminuée 1-♭3-♭5, augmentée 1-3-#5.",
      "Accords de 7e : Maj7, m7, 7, m7♭5, dim7. Leur arpège en donne les quatre notes, qui définissent tout l'accord. Cmaj7 : Do, Mi, Sol, Si.",
    ], bloc: { type: "fretboard_interactive", mode: "chord", root: "C", chord: "maj7", caption: "Arpège Cmaj7 — Do Mi Sol Si sur tout le manche", displayMode: "notes", lang: "fr", compact: true } },
    { type: "question", quizId: "q-harm-09" },
    { type: "idee", titre: "Un arpège dans une position", texte: [
      "Cmaj7 entre les cases 7 et 10, sur deux octaves : Do (corde 6 case 8), Mi (corde 5 case 7), Sol (corde 5 case 10), Si (corde 4 case 9), Do (corde 4 case 10), Mi (corde 3 case 9), Sol (corde 2 case 8), Si (corde 1 case 7), Do (corde 1 case 8).",
      "Un doigt par case, la main ne bouge pas.",
    ] },
    { type: "a-toi", titre: "Monte et descends Cmaj7",
      consigne: "Joue l'arpège en noires au clic, en montant puis en descendant. Nomme les Do à voix haute. Quand c'est fluide, commence sur le Mi ou le Sol plutôt que sur le Do.",
      bloc: {
        type: "tab",
        caption: "Arpège de Cmaj7, cases 7 à 10, deux octaves en montant",
        text: "Tab — corde 6 case 8, corde 5 cases 7 et 10, corde 4 cases 9 et 10, corde 3 case 9, corde 2 case 8, corde 1 cases 7 et 8 (Do, Mi, Sol, Si, Do, Mi, Sol, Si, Do).",
        data: { lines: [
          "e|----------------------7--8--|",
          "B|-------------------8--------|",
          "G|----------------9-----------|",
          "D|----------9--10-------------|",
          "A|----7--10-------------------|",
          "E|-8--------------------------|",
        ] },
      }, bpm: 60, minuteur: 90 },
    { type: "idee", titre: "Arpège et gamme ensemble", texte: [
      "En solo, ouvre ta phrase par deux ou trois notes d'arpège, puis remplis avec la gamme entre elles.",
      "Pose la fin sur une note de l'accord, sur un temps fort. Le solo suit l'harmonie et reste chantant.",
    ] },
    { type: "question", quizId: "q-harm-10" },
    { type: "idee", titre: "Un arpège par accord", texte: [
      "Sur Dm7 - G7 - Cmaj7, change d'arpège à chaque mesure : Ré Fa La Do, puis Sol Si Ré Fa, puis Do Mi Sol Si.",
      "Tes phrases bougent avec l'harmonie : c'est ce qui sonne jazz.",
    ], bloc: { type: "fretboard_interactive", mode: "chord", root: "D", chord: "min7", caption: "Arpège Dm7 — Ré Fa La Do sur tout le manche", displayMode: "notes", lang: "fr", compact: true } },
    { type: "question", quizId: "q-harm-11" },
    { type: "recap", points: [
      "Un arpège = les notes de l'accord une à une ; il sonne sur l'accord à coup sûr.",
      "Cmaj7 en case 7 : Do Mi Sol Si sur deux octaves, un doigt par case.",
      "Change d'arpège avec l'accord, et comble avec la gamme entre les notes cibles.",
    ] },
  ],
  quiz: ["q-harm-09","q-harm-10","q-harm-11","q-fret-harm-06"],
};

export const quiz = [
  {id:"q-harm-09",courseId:"harmony",lessonId:"harmony-03",lvl:2,q:"L'arpège d'un accord Cmaj7 contient quelles notes ?",o:["Do-Mi-Sol-Si","Do-Mi-Sol","Do-Mi-Sol-Sib","Do-Mib-Sol-Si"],a:0,exp:"Cmaj7 = Do(1)-Mi(3)-Sol(5)-Si(7). L'arpège = ces 4 notes jouées en mélodie. Tu peux les jouer dans n'importe quel ordre, sur plusieurs octaves.",xp:35},
  {id:"q-harm-10",courseId:"harmony",lessonId:"harmony-03",lvl:3,q:"Pourquoi les arpèges sont-ils essentiels en improvisation jazz ?",o:["Pour montrer sa technique au public", "Pour sonner « sur l'accord » à coup sûr", "Pour pouvoir jouer plus vite qu'avec une gamme", "Pour transposer plus facilement"],a:1,exp:"Les notes d'un arpège = les notes de l'accord = celles qui sonnent immédiatement 'juste' sur cet accord. Construire ses phrases autour des arpèges = solo qui suit l'harmonie.",xp:45},
  {id:"q-harm-11",courseId:"harmony",lessonId:"harmony-03",lvl:3,q:"Sur la progression Dm7-G7-Cmaj7, quelle stratégie d'arpèges fonctionne ?",o:["Arpège Dm7 sur les trois accords", "Pentatonique de Do sur toute la grille", "Arpège Dm7, puis G7, puis Cmaj7", "Arpège Cmaj7 sur les trois accords"],a:2,exp:"Changer d'arpège à chaque accord = solo qui suit l'harmonie. C'est la base du jazz. Sur Dm7 : Ré-Fa-La-Do. Sur G7 : Sol-Si-Ré-Fa. Sur Cmaj7 : Do-Mi-Sol-Si.",xp:55},
  {id:"q-fret-harm-06",type:"fretboard",courseId:"harmony",lessonId:"harmony-03",lvl:3,q:"Trouve toutes les notes de l'arpège Dm7 (Ré Fa La Do)",concept:{type:"find_chord",root:"D",quality:"min7"},selectionRules:{mode:"all"},display:{showNotes:false},hint:"Dm7 = ii de Do majeur. Guide tones : Fa (3e) + Do (7e).",xp:55,exp:"Dm7 : Ré-Fa-La-Do. C'est le ii du ii-V-I en Do."},
];
