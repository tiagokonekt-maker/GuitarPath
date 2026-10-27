// Leçon du module « scales » + les questions de quiz qui s'y rattachent.
// Format « leçon en cartes » décrit dans src/content/README.md.

export default {
  id: "scales-c5-06", level: 8,
  title: "Éolien — la mélancolie naturelle",
  duration: 8,
  gropiTip: "Écoute la ♭6 : dans la position case 5, joue Fa (case 6 corde 2) puis redescends sur Mi (case 5). Ce demi-ton qui retombe sur la quinte, c'est le soupir typique de l'éolien.",
  cartes: [
    { type: "idee", titre: "Le 6e mode", texte: [
      "Do majeur joué depuis La : La, Si, Do, Ré, Mi, Fa, Sol. C'est La éolien.",
      "Tu le connais déjà sous un autre nom : c'est exactement la mineure naturelle, le « son mineur » de la plupart des ballades.",
    ] },
    { type: "idee", titre: "Depuis la penta", texte: [
      "La penta mineure de La, position 1, contient déjà cinq de ses notes. Ajoute Si et Fa dans la même position et tu as l'éolien complet.",
      "Pas de nouvelle forme à apprendre : deux notes de plus dans des doigts familiers.",
    ], bloc: {
      type: "scale_pattern",
      caption: "La éolien (mineur naturel) — case 5. Même forme que Am pentatonique + 2 notes (Si, Fa)",
      data: {
        startFret: 4, endFret: 9,
        rootColor: "primary", noteColor: "green",
        strings: [
          { frets: [5, 7, 8], root: [5] },
          { frets: [5, 7, 8], root: [] },
          { frets: [5, 7], root: [] },
          { frets: [5, 7], root: [] },
          { frets: [5, 6, 8], root: [] },
          { frets: [5, 7, 8], root: [5] },
        ],
        noteMap: {
          "5,0":"La","7,0":"Si","8,0":"Do",
          "5,1":"Ré","7,1":"Mi","8,1":"Fa",
          "5,2":"Sol","7,2":"La",
          "5,3":"Do","7,3":"Ré",
          "5,4":"Mi","6,4":"Fa","8,4":"Sol",
          "5,5":"La","7,5":"Si","8,5":"Do",
        }
      },
    } },
    { type: "question", quizId: "q-scales-42" },
    { type: "idee", titre: "L'étalon du mineur", texte: [
      "Formule : 1-2-♭3-4-5-♭6-♭7. L'éolien n'a pas de note caractéristique : c'est la référence.",
      "Les autres modes mineurs se définissent par rapport à lui : le dorien remonte une note, le phrygien en baisse une, le locrien en baisse deux.",
    ] },
    { type: "idee", titre: "Sur quels accords", texte: [
      "Son terrain : tout morceau tonal en mineur, et les grilles dont chaque accord vient de la gamme, comme Am – F – G ou Am – Dm – Em.",
      "Couleur : mélancolique, introspective. Son Fa aime retomber d'un demi-ton sur Mi, la quinte.",
    ] },
    { type: "question", quizId: "q-scales-41" },
    { type: "a-toi", titre: "La éolien sur Am – F – G",
      consigne: "Fais tourner Am, F, G, Am, une mesure chacun, au clic à 70 : enregistre-toi ou utilise une boucle. Joue la tab, qui fait deux fois retomber Fa sur Mi, puis improvise dans la position case 5 en finissant tes phrases sur La (corde 4 case 7).",
      bloc: {
        type: "tab",
        caption: "La éolien, position case 5 : la sixte mineure Fa qui retombe sur Mi, puis retour au La",
        text: "Tab — mesure 1 : corde 1 cases 8, 7, 5 (Do, Si, La), corde 2 cases 6 et 5 (Fa, Mi). Mesure 2 : corde 2 cases 8, 6, 5 (Sol, Fa, Mi), corde 3 cases 7 et 5 (Ré, Do), corde 4 case 7 (La).",
        data: { lines: [
          "e|-8--7--5--------|-------------------|",
          "B|----------6--5--|-8--6--5-----------|",
          "G|----------------|----------7--5-----|",
          "D|----------------|----------------7--|",
          "A|----------------|-------------------|",
          "E|----------------|-------------------|",
        ] },
      }, bpm: 70, minuteur: 150 },
    { type: "question", quizId: "q-scales-40" },
    { type: "recap", points: [
      "Éolien = mineure naturelle : 1-2-♭3-4-5-♭6-♭7.",
      "Penta mineure + la 2 et la ♭6 = l'éolien complet, dans la même position.",
      "Les autres modes mineurs se mesurent à lui : dorien (6), phrygien (♭2), locrien (♭2, ♭5).",
    ] },
  ],
  quiz: ["q-scales-40", "q-scales-41", "q-scales-42", "q-logic-10", "q-scales-03"],
};

export const quiz = [
  {id:"q-scales-40",courseId:"scales",lessonId:"scales-c5-06",lvl:1,q:"À quelle gamme correspond le mode éolien ?",o:["La gamme mineure harmonique","La pentatonique mineure","La gamme blues","La gamme mineure naturelle"],a:3,exp:"Éolien = 1 - 2 - ♭3 - 4 - 5 - ♭6 - ♭7 : la gamme mineure naturelle.",xp:30},
  {id:"q-scales-41",courseId:"scales",lessonId:"scales-c5-06",lvl:2,q:"Quelle note distingue l'éolien du dorien ?",o:["La sixte mineure (♭6)","La septième mineure (♭7)","La tierce mineure (♭3)","La seconde majeure (2)"],a:0,exp:"Le dorien a une sixte majeure, l'éolien une sixte mineure (♭6) : c'est la seule différence.",xp:40},
  {id:"q-scales-42",courseId:"scales",lessonId:"scales-c5-06",lvl:1,q:"Pour passer de la penta mineure à l'éolien, quelles notes ajoute-t-on ?",o:["La 3 et la 7","La 2 et la ♭6","La ♭2 et la ♭5","La 6 et la 7"],a:1,exp:"Penta mineure = 1 - ♭3 - 4 - 5 - ♭7. On ajoute la seconde (2) et la sixte mineure (♭6) : on obtient l'éolien complet.",xp:30},
];
