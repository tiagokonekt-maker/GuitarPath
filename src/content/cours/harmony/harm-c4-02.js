// Leçon du module « harmony » + les questions de quiz qui s'y rattachent.
// Format « leçon en cartes » décrit dans src/content/README.md.

export default {
  id: "harm-c4-02", level: 9,
  title: "Tensions et résolutions : comment les extensions fonctionnent",
  duration: 9,
  gropiTip: "Tiens un accord de Do et fais sonner un Fa par-dessus pendant 4 temps, puis un Ré. Le Fa frotte avec le Mi, le Ré se fond dans l'accord : note évitée contre extension libre.",
  cartes: [
    { type: "idee", titre: "Libres ou tendues", texte: [
      "Une extension n'est pas une décoration au hasard. Certaines notes sont libres : tenues sur l'accord, elles se fondent dedans.",
      "D'autres sont tendues : elles frottent et demandent à bouger. Savoir lesquelles, c'est doser la tension de tes accords et de tes phrases.",
    ] },
    { type: "idee", titre: "Le test sur Cmaj7", texte: [
      "Laisse sonner Cmaj7 et joue par-dessus chaque note de Do majeur, en la tenant quatre temps.",
      "Six notes sur sept se fondent dans l'accord. Une seule frotte nettement : la note évitée, l'« avoid note ».",
    ] },
    { type: "question", quizId: "q-harm-41" },
    { type: "idee", titre: "Collé à la tierce", texte: [
      "Le Fa est un demi-ton au-dessus du Mi, la tierce de Cmaj7. Tenu, ce frottement sonne faux.",
      "Joué court, en passage vers Mi ou Sol, il passe très bien. C'est la durée qui décide si une tension est agréable.",
    ], bloc: { type: "fretboard", caption: "Cmaj7 autour de la case 8 : notes de l'accord (violet) et Fa, la note évitée (corail), collée au Mi", data: {frets: 6, startFret: 5, showStringNames: true, showFretNumbers: true, markerFrets: [7,9], notes: [{string: 6, fret: 8, label: "Do", color: "primary", root: true}, {string: 5, fret: 7, label: "Mi", color: "primary"}, {string: 5, fret: 8, label: "Fa", color: "coral"}, {string: 5, fret: 10, label: "Sol", color: "primary"}, {string: 4, fret: 9, label: "Si", color: "primary"}, {string: 4, fret: 10, label: "Do", color: "primary", root: true}, {string: 3, fret: 9, label: "Mi", color: "primary"}, {string: 3, fret: 10, label: "Fa", color: "coral"}]} } },
    { type: "question", quizId: "q-harm-p89-c402-01" },
    { type: "idee", titre: "Résoudre par demi-ton", texte: [
      "La résolution la plus forte avance d'un demi-ton. Dans G7 → Cmaj7, Si monte sur Do et Fa descend sur Mi.",
      "Une dominante peut porter des tensions en plus : chacune glisse à son tour d'un demi-ton vers une note de l'accord suivant. Plus la tension monte, plus l'arrivée satisfait.",
    ] },
    { type: "question", quizId: "q-impro-06" },
    { type: "a-toi", titre: "Le Fa en passage",
      consigne: "Gratte Cmaj7 (x32000) et laisse sonner. Joue la tab au clic, une note par temps : Sol, Fa, Mi, puis Mi, Fa, Sol, le Fa toujours bref. Pour finir, tiens le Fa quatre temps sur l'accord : entends le frottement. Puis reprends en sortant du Fa tout de suite.",
      bloc: {
        type: "tab",
        caption: "Sur Cmaj7 : le Fa en passage (vers Mi, vers Sol), puis le Fa tenu",
        text: "Tab, corde 1 : Sol (case 3), Fa (case 1), Mi (à vide) ; puis Mi (à vide), Fa (case 1), Sol (case 3) ; enfin Fa (case 1) tenu.",
        data: { lines: [
          "e|-3-1-0---0-1-3---1-------|",
          "B|-------------------------|",
          "G|-------------------------|",
          "D|-------------------------|",
          "A|-------------------------|",
          "E|-------------------------|",
        ] },
      }, bpm: 60, minuteur: 120 },
    { type: "question", quizId: "q-harm-43" },
    { type: "recap", points: [
      "Sur Cmaj7, tout Do majeur sonne tenu, sauf le Fa : la note évitée.",
      "Une note tendue passe très bien en passage ; c'est la durée qui décide.",
      "Les tensions se résolvent par demi-ton vers l'accord suivant.",
    ] },
  ],
  quiz: ["q-harm-41", "q-harm-42", "q-harm-43", "q-harm-24", "q-impro-02", "q-impro-06", "q-harm-p89-c402-01"],
};

export const quiz = [
  {id:"q-harm-41",courseId:"harmony",lessonId:"harm-c4-02",lvl:1,q:"Sur Cmaj7, quelle est l'« avoid note » ?",o:["Ré (9e)","La (13e)","Si (7e)","Fa (11e)"],a:3,exp:"Fa est à un demi-ton au-dessus de Mi, la tierce de Cmaj7 : tenue, cette friction sonne dissonante.",xp:30},
  {id:"q-harm-42",courseId:"harmony",lessonId:"harm-c4-02",lvl:2,q:"Pourquoi le Fa frotte-t-il sur Cmaj7 ?",o:["Il touche le Mi, à un demi-ton","Il est à une quinte juste de Mi","Il n'appartient pas à Do majeur","Il double la fondamentale"],a:0,exp:"Fa est collé au Mi (3e de l'accord), un demi-ton au-dessus : c'est cette friction qui en fait l'avoid note.",xp:40},
  {id:"q-harm-43",courseId:"harmony",lessonId:"harm-c4-02",lvl:1,q:"Comment utiliser le Fa sur Cmaj7 ?",o:["En note tenue sur le temps fort","En passage, vers Mi ou Sol","Jamais, c'est une note interdite","En fin de phrase, pour conclure"],a:1,exp:"En note de passage, courte, qui ressort aussitôt sur Mi ou Sol : la tension se crée puis se résout.",xp:30},
  {id:"q-harm-p89-c402-01",courseId:"harmony",lessonId:"harm-c4-02",lvl:3,q:"Sur Gmaj7 (Sol Si Ré Fa#), quelle note de Sol majeur frotte tenue, comme le Fa sur Cmaj7 ?",o:["Do","La","Mi","Ré"],a:0,exp:"Do est un demi-ton au-dessus de Si, la tierce de Gmaj7 : même friction que Fa contre Mi sur Cmaj7. La (9e) et Mi (13e) sont libres, Ré est la quinte.",xp:50},
];
