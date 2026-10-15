// Leçon du module « harmony » + les questions de quiz qui s'y rattachent.
// Format décrit dans src/content/README.md.

export default {
  id: "harm-c6-03", level: 8,
  title: "ii-V-I : le moteur du jazz",
  duration: 12,
  content: [
    { type: "p", text: "La progression ii-V-I est à la musique jazz ce que I-IV-V est au blues : une fondation absolue. Une grande partie des standards de jazz repose sur des enchaînements ii-V-I, dans différentes tonalités. Maîtriser ii-V-I, c'est avoir accès à un immense répertoire et comprendre le langage harmonique le plus sophistiqué de la musique populaire." },
    { type: "h", text: "La formule en majeur" },
    { type: "p", text: "En Do majeur : Dm7 (ii) → G7 (V) → Cmaj7 (I). Le ii prépare. Le V crée la tension. Le I résout. Ces 3 accords forment la cellule harmonique fondamentale du jazz. Le mouvement de basse Ré → Sol → Do (deux fois une quarte descendante) crée une gravité irrésistible." },
    { type: "h", text: "La formule en mineur" },
    { type: "p", text: "En La mineur : Bm7b5 (ii°) → E7 (V) → Am7 (i). En mineur, le ii devient demi-diminué (m7b5). Le V est presque toujours transformé en dominante (E7 au lieu de Em7) pour créer une résolution forte — c'est pourquoi on utilise la gamme mineure harmonique sur ce V7." },
    { type: "h", text: "Pourquoi la résolution est si forte" },
    { type: "p", text: "Dans G7→Cmaj7 : la 3e de G7 (Si) monte chromatiquement d'un demi-ton vers Do (fondamentale du I). La 7e de G7 (Fa) descend chromatiquement d'un demi-ton vers Mi (3e du I). Ces 2 mouvements de demi-ton simultanés créent une 'attraction physique' dans l'oreille. La résolution ii-V-I est la plus satisfaisante de toute la musique tonale." },
    { type: "h", text: "Le cycle de quartes : enchaîner les ii-V-I" },
    { type: "p", text: "En jazz, les morceaux modulent souvent par cycle de quartes. Après ii-V-I en Do, on passe à ii-V-I en Fa (Gm7-C7-Fmaj7), puis en Si♭ (Cm7-F7-B♭maj7), etc. Chaque I devient le point de départ du ii suivant. Maîtriser ii-V-I dans les 12 tonalités = pouvoir jouer n'importe quel standard jazz." },
    { type: "h", text: "La substitution tritonique" },
    { type: "p", text: "Une technique harmonique avancée : remplacer le V7 par l'accord 7 situé un triton (6 demi-tons) plus haut. G7 → Db7. Pourquoi ? G7 (Sol-Si-Ré-Fa) et Db7 (Réb-Fa-Lab-Dob) partagent les mêmes guide tones, inversés : la 3e de G7 (Si) est la 7e de Db7 (Dob, enharmonique de Si), et la 7e de G7 (Fa) est la 3e de Db7. Cette substitution crée une descente chromatique élégante dans la basse : Ré (ii) → Réb (V substitué) → Do (I)." },
    { type: "h", text: "Improviser sur ii-V-I" },
    { type: "p", text: "Approche simple : sur ii (Dm7) → Ré dorien. Sur V (G7) → Sol mixolydien. Sur I (Cmaj7) → Do ionien. Mais comme ces 3 modes ont exactement les mêmes notes (Do majeur), tu peux jouer Do majeur tout du long en visant simplement les guide tones de chaque accord (vu dans la leçon Guide Tones)." },
    {
      type: "chord_diagram",
      caption: "Dm7 — ii de Do majeur (× × 0 2 1 1)",
      data: { name: "Dm7 (ii)", frets: [-1,-1,0,2,1,1], fingers: [0,0,0,2,1,1], startFret: 1 },
    },
    {
      type: "chord_diagram",
      caption: "G7 — V de Do majeur, tension (3 2 0 0 0 1)",
      data: { name: "G7 (V)", frets: [3,2,0,0,0,1], fingers: [3,2,0,0,0,1], startFret: 1 },
    },
    {
      type: "chord_diagram",
      caption: "Cmaj7 — I, résolution (× 3 2 0 0 0)",
      data: { name: "Cmaj7 (I)", frets: [-1,3,2,0,0,0], fingers: [0,3,2,0,0,0], startFret: 1 },
    },
    { type: "h", text: "ii-V-I dans les standards célèbres" },
    { type: "p", text: "'Autumn Leaves' : ii-V-I en Sol majeur et en Mi mineur alternent. 'Fly Me to the Moon' : ii-V-I en Do majeur. 'All The Things You Are' : cascade de ii-V-I dans plusieurs tonalités. 'Blue Bossa' : ii-V-I en Do mineur et en Réb majeur. Si tu apprends à reconnaître et jouer ii-V-I, ces morceaux deviennent accessibles." },
    { type: "ref", text: "Miles Davis et son quintet (1955-1960) ont développé un langage harmonique basé entièrement sur des ii-V-I sophistiqués. Écoute 'Autumn Leaves' ou 'Walkin'' : chaque phrase du solo de Davis vise les guide tones des ii-V-I. C'est un cours de musique appliqué à l'improvisation jazz." },
    { type: "tip", text: "Drill ii-V-I : apprends la progression Dm7-G7-Cmaj7 en shell voicings (vu précédemment). Joue-la en boucle à 70 BPM. Improvise par-dessus en Do majeur en visant Mi (guide tone de Dm7), Si (guide tone de G7), Mi (guide tone de Cmaj7) comme fins de phrases. En 2 semaines, tu maîtrises le principe du ii-V-I." },
  ],
  quiz: ["q-harm-16","q-harm-17","q-harm-18","q-impro-03","q-impro-08","q-logic-05","q-fret-harm-07","q-harm-19","q-harm-20","q-harm-21"],
};

export const quiz = [
  {id:"q-harm-16",courseId:"harmony",lessonId:"harm-c6-03",lvl:2,q:"En La majeur, le ii-V-I est…",o:["Bm-E-A","Cm7-F7-Bbmaj7","Em7-A7-Dmaj7","Bm7-E7-Amaj7"],a:3,exp:"En La majeur : ii=Si mineur, V=Mi (majeur), I=La. En accords 7 : Bm7-E7-Amaj7. Cellule fondamentale du jazz dans cette tonalité.",xp:45},
  {id:"q-harm-17",courseId:"harmony",lessonId:"harm-c6-03",lvl:3,q:"Pourquoi le ii-V-I sonne 'résolu' ?",o:["La basse descend par quintes (Ré, Sol, Do)", "Une coïncidence historique, rien de plus", "Le tempo accélère juste avant l'accord final", "Les notes montent de plus en plus aigu"],a:0,exp:"La basse descend de quinte en quinte (Ré → Sol → Do, soit une quarte vers le haut à chaque fois), et les guide tones avancent par demi-tons : Do → Si et Fa reste (ii → V), puis Fa → Mi et Si reste (V → I). Double mouvement, résolution très forte.",xp:55},
  {id:"q-harm-18",courseId:"harmony",lessonId:"harm-c6-03",lvl:3,q:"La 'substitution tritonique' de G7 est…",o:["F#7","Db7","Ab7","C7"],a:1,exp:"Substitution tritonique : remplacer V7 par X7 distant d'un triton (6 demi-tons). Sol+6dt = Do# = Réb. Donc Db7. Ils partagent les guide tones (Si/Fa).",xp:60},
  {id:"q-impro-03",courseId:"impro",lessonId:"harm-c6-03",lvl:3,q:"Sur le ii-V-I en Do (Dm7-G7-Cmaj7), quelle gamme couvre les 3 accords ?",o:["Do majeur, et lui seul", "Ré dorien, et lui seul", "Sol mixolydien, et seulement lui", "N'importe laquelle des trois"],a:3,exp:"Do majeur, Ré dorien, Sol mixolydien = mêmes 7 notes. Seules les fondamentales diffèrent. Tu peux jouer Do majeur tout du long en visant les guide tones.",xp:60},
  {id:"q-impro-08",courseId:"impro",lessonId:"harm-c6-03",lvl:3,q:"Substitution tritonique appliquée à Dm7-G7-Cmaj7 donne…",o:["Dm7-Db7-Cmaj7","Dm7-G7-C#maj7","D#m7-G7-Cmaj7","Dm7-Bb7-Cmaj7"],a:0,exp:"Sub trito du V (G7) = Db7. Donc Dm7-Db7-Cmaj7. La basse descend chromatiquement Ré→Réb→Do. Mouvement très élégant.",xp:65},
  {id:"q-logic-05",courseId:"harmony",lessonId:"harm-c6-03",lvl:3,q:"Pourquoi 'Autumn Leaves' (standard de jazz) a-t-il un schéma harmonique simple ?",o:["Des ii-V-I en majeur et en mineur relatif", "Il a été composé pour les débutants", "Il reste dans une seule tonalité du début à la fin", "Il a été entièrement improvisé"],a:0,exp:"Autumn Leaves alterne ii-V-I en Sol majeur (Am7-D7-Gmaj7) et ii-V-i en Mi mineur (F#m7b5-B7-Em7). Démontre que le jazz repose sur des cellules ii-V-I répétées.",xp:65},
  {id:"q-fret-harm-07",type:"fretboard",courseId:"harmony",lessonId:"harm-c6-03",lvl:3,q:"ii-V-I : trouve toutes les fondamentales Ré (ancres du ii)",concept:{type:"find_note",root:"D"},selectionRules:{mode:"all"},display:{showNotes:false},hint:"Ré est à vide sur la corde 4.",xp:50,exp:"Ré en : corde 6 case 10, corde 5 case 5, corde 4 à vide, corde 3 case 7, corde 2 case 3, corde 1 case 10. Ancres du ii dans le ii-V-I."},
];
