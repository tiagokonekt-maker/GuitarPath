// Leçon du module « harmony » + les questions de quiz qui s'y rattachent.
// Format « leçon en cartes » décrit dans src/content/README.md.

export default {
  id: "harm-c3-03", level: 7,
  title: "Les guide tones : 3e et 7e",
  duration: 8,
  gropiTip: "Dans un accord 7 (dominante), la 3e et la 7e sont toujours à un triton d'écart. Sur G7 : Si et Fa. Sur C7 : Mi et Sib. Sur D7 : Fa# et Do. Trouve l'une, l'autre est à 6 demi-tons.",
  cartes: [
    { type: "idee", titre: "Les notes qui parlent", texte: [
      "Dans un accord de 7e, la fondamentale et la quinte posent la hauteur, sans plus. Joue Do et Sol : majeur, mineur, Do7 ? Impossible à dire.",
      "Ajoute Mi : c'est majeur. Ajoute Si : c'est Cmaj7. La 3e et la 7e disent la qualité de l'accord. On les appelle les guide tones.",
    ] },
    { type: "idee", titre: "Les guide tones des 7e", texte: [
      "Cmaj7 : Mi et Si. Cm7 : Mi♭ et Si♭. C7 : Mi et Si♭.",
      "Dans un accord de dominante, les deux sont toujours à un triton l'une de l'autre. Sur G7 : Si et Fa.",
    ] },
    { type: "question", quizId: "q-harm-07-app" },
    { type: "idee", titre: "Le shell voicing", texte: [
      "En jazz, on joue souvent la fondamentale, la 3e et la 7e, sans la quinte. Trois notes, l'accord est parfaitement défini et le son reste aéré.",
      "G7 : Sol (corde 6 case 3), Fa (corde 4 case 3), Si (corde 3 case 4). Étouffe la corde 5 avec le doigt de la corde 6.",
    ], bloc: {
      type: "chord_diagram",
      caption: "G7 en shell : fondamentale, 7e, 3e (Sol, Fa, Si) — 3 x 3 4 x x",
      data: { name: "G7", frets: [3,-1,3,4,-1,-1], fingers: [2,0,3,4,0,0], startFret: 1 },
    } },
    { type: "idee", titre: "Le fil rouge du ii-V-I", texte: [
      "Dans Dm7 - G7 - Cmaj7, les guide tones bougent au plus court. Le Do, 7e de Dm7, descend sur Si, 3e de G7 ; le Fa reste et devient la 7e de G7.",
      "Puis le Fa descend sur Mi, 3e de Cmaj7, et le Si reste : il devient la 7e.",
    ] },
    { type: "question", quizId: "q-harm-p7-c303-01" },
    { type: "a-toi", titre: "Trois shells, deux voix",
      consigne: "Enchaîne Dm7, G7 et Cmaj7 en shells, une mesure chacun au clic. Écoute les cordes 4 et 3 : Fa reste puis descend sur Mi, Do descend sur Si puis reste. Ensuite, joue seulement ces deux notes : la ligne intérieure de l'harmonie.",
      bloc: {
        type: "tab",
        caption: "Shells Dm7 (x535xx), G7 (3x34xx), Cmaj7 (x324xx) : les guide tones sur les cordes 4 et 3",
        text: "Tab — Dm7 : corde 5 case 5, corde 4 case 3, corde 3 case 5 (Ré, Fa, Do). G7 : corde 6 case 3, corde 4 case 3, corde 3 case 4 (Sol, Fa, Si). Cmaj7 : corde 5 case 3, corde 4 case 2, corde 3 case 4 (Do, Mi, Si).",
        data: { lines: [
          "e|----------------|",
          "B|----------------|",
          "G|-5----4----4----|",
          "D|-3----3----2----|",
          "A|-5---------3----|",
          "E|------3---------|",
        ] },
      }, bpm: 60, minuteur: 120 },
    { type: "question", quizId: "q-harm-06" },
    { type: "recap", points: [
      "Les guide tones, 3e et 7e, disent la qualité de l'accord ; la quinte peut partir.",
      "Shell voicing = fondamentale + 3e + 7e : G7 = 3x34xx.",
      "Dans un ii-V-I, une guide tone reste, l'autre descend d'un demi-ton.",
    ] },
  ],
  quiz: ["q-harm-07","q-fret-harm-08","q-fret-harm-09","q-harm-03","q-harm-06","q-harm-p7-c303-01", "q-harm-07-app"],
};

export const quiz = [
  {id:"q-harm-07",courseId:"harmony",lessonId:"harm-c3-03",lvl:3,q:"Sur un accord Cmaj7, les 'guide tones' sont…",o:["Do et Sol","Do et Si","Mi et Si","Mi et Sol"],a:2,exp:"Guide tones = 3e + 7e. Sur Cmaj7 : 3e = Mi, 7e = Si. Ces 2 notes définissent que c'est un Maj7 (et pas un m7 ou un 7 dominante).",xp:50},
  {id:"q-harm-07-app",courseId:"harmony",lessonId:"harm-c3-03",lvl:3,q:"Sur un accord Fmaj7, les 'guide tones' sont…",o:["Fa et Do","Fa et Mi","La et Mi","La et Do"],a:2,exp:"Guide tones = 3e + 7e. Fmaj7 = Fa La Do Mi : 3e = La, 7e = Mi.",xp:40},
  {id:"q-fret-harm-08",type:"fretboard",courseId:"harmony",lessonId:"harm-c3-03",lvl:3,q:"Sur G7 : trouve toutes les notes Si (3e — guide tone principal)",concept:{type:"find_note",root:"B"},selectionRules:{mode:"all"},display:{showNotes:false},hint:"Si est à vide sur la corde 2. C'est ta note cible d'arrivée sur G7.",xp:60,exp:"Si en : corde 6 case 7, corde 5 case 2, corde 4 case 9, corde 3 case 4, corde 2 à vide, corde 1 case 7. Cibles d'arrivée sur G7."},
  {id:"q-fret-harm-09",type:"fretboard",courseId:"harmony",lessonId:"harm-c3-03",lvl:3,q:"Sur G7 : trouve toutes les notes Fa (7e — tension à résoudre)",concept:{type:"find_note",root:"F"},selectionRules:{mode:"all"},display:{showNotes:false},hint:"Fa est case 1 corde 1. La 7e de G7 veut se résoudre vers Mi (Cmaj7).",xp:60,exp:"Fa en : corde 6 case 1, corde 5 case 8, corde 4 case 3, corde 3 case 10, corde 2 case 6, corde 1 case 1. La résolution Fa→Mi est le mouvement fondamental du ii-V-I."},
  {id:"q-harm-p7-c303-01",courseId:"harmony",lessonId:"harm-c3-03",lvl:3,q:"Dans Dm7 → G7, où va le Do, 7e de Dm7, par le chemin le plus court ?",o:["Il descend sur Si, la 3e de G7","Il monte sur Ré, la 5e de G7","Il descend sur Sol, la fondamentale","Il monte sur Fa, la 7e de G7"],a:0,exp:"Do → Si : un demi-ton. Pendant ce temps, le Fa (3e de Dm7) reste et devient la 7e de G7. Les guide tones avancent au plus court.",xp:50},
];
