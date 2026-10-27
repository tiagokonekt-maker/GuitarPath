// Leçon du module « scales » + les questions de quiz qui s'y rattachent.
// Format « leçon en cartes » décrit dans src/content/README.md.

export default {
  id: "scales-c5-05", level: 8,
  title: "Mixolydien — le roi du rock",
  duration: 9,
  gropiTip: "Repère la ♭7 vite : elle est un ton (2 cases) sous l'octave de la fondamentale. Dans la position Sol case 3, le Sol de la corde 4 est case 5, et le Fa juste en dessous, case 3.",
  cartes: [
    { type: "idee", titre: "Le 5e mode", texte: [
      "Do majeur joué depuis Sol : Sol, La, Si, Do, Ré, Mi, Fa. C'est Sol mixolydien.",
      "Formule : 1-2-3-4-5-6-♭7. Le mode du rock, du blues, du country et du funk : fait pour la guitare.",
    ] },
    { type: "idee", titre: "La septième mineure", texte: [
      "Une seule note change par rapport au majeur : la 7e est mineure. En Sol, Fa remplace Fa#.",
      "Fa est à un ton de Sol : il ne tire plus vers la tonique comme une sensible. Résultat : lumineux, mais décontracté, comme une dominante qui ne résout jamais.",
    ], bloc: {
      type: "scale_pattern",
      caption: "Sol mixolydien — case 3. Note clé : Fa naturel, la septième mineure (case 3 c4)",
      data: {
        startFret: 1, endFret: 6,
        rootColor: "coral", noteColor: "primary",
        strings: [
          { frets: [3, 5], root: [3] },
          { frets: [2, 3, 5], root: [] },
          { frets: [2, 3, 5], root: [], accent: [3] },
          { frets: [2, 4], root: [] },
          { frets: [1, 3, 5], root: [] },
          { frets: [3, 5], root: [3] },
        ],
        noteMap: {
          "3,0":"Sol","5,0":"La",
          "2,1":"Si","3,1":"Do","5,1":"Ré",
          "2,2":"Mi","3,2":"Fa","5,2":"Sol",
          "2,3":"La","4,3":"Si",
          "1,4":"Do","3,4":"Ré","5,4":"Mi",
          "3,5":"Sol","5,5":"La",
        }
      },
    } },
    { type: "question", quizId: "q-scales-16" },
    { type: "idee", titre: "Collé à l'accord 7", texte: [
      "G7 contient Sol, Si, Ré et Fa. Sol majeur, avec son Fa#, frotterait contre ce Fa ; le mixolydien épouse l'accord.",
      "Autre terrain : les vamps I – ♭VII du rock, comme Sol – Fa ou Ré – Do.",
    ] },
    { type: "a-toi", titre: "Sol mixolydien sur Sol – Fa",
      consigne: "Fais tourner Sol et Fa majeurs, deux mesures chacun, au clic à 70 : enregistre-toi ou utilise une boucle. Joue la tab, qui descend jusqu'au Fa (corde 4 case 3) et remonte sur Sol, puis improvise dans la position case 3 en appuyant Fa sur l'accord de Fa.",
      bloc: {
        type: "tab",
        caption: "Sol mixolydien, position case 3 : une descente qui passe par la septième mineure Fa",
        text: "Tab — corde 2 cases 3 et 1 (Ré, Do), corde 3 cases 4 et 2 (Si, La), corde 4 cases 5, 3, 5 (Sol, Fa, Sol).",
        data: { lines: [
          "e|----------------------|",
          "B|-3--1-----------------|",
          "G|-------4--2-----------|",
          "D|-------------5--3--5--|",
          "A|----------------------|",
          "E|----------------------|",
        ] },
      }, bpm: 70, minuteur: 150 },
    { type: "question", quizId: "q-scales-17" },
    { type: "idee", titre: "Le raccourci des bluesmen", texte: [
      "Tu connais la penta mineure de La. Ajoute-lui la tierce majeure Do# et la sixte Fa# : tu tiens les notes de La mixolydien, sans tout réapprendre.",
      "Le mélange des deux couleurs, mineure et majeure, est au cœur du son blues.",
    ] },
    { type: "question", quizId: "q-impro-14" },
    { type: "recap", points: [
      "Mixolydien = 1-2-3-4-5-6-♭7 ; Sol mixolydien = notes de Do majeur depuis Sol.",
      "Sa ♭7 colle à l'accord 7 : sur G7, Sol mixolydien plutôt que Sol majeur.",
      "Terrain : accords 7 qui ne résolvent pas, vamps I – ♭VII, blues.",
    ] },
  ],
  quiz: ["q-scales-16","q-scales-17","q-impro-14","q-fret-scales-05","q-logic-03","q-logic-08"],
};

export const quiz = [
  {id:"q-scales-16",courseId:"scales",lessonId:"scales-c5-05",lvl:2,q:"Sur un accord G7 (dominante non-résolue), quel mode utiliser ?",o:["Sol mixolydien", "Sol ionien (majeur)", "Sol dorien", "Sol lydien"],a:0,exp:"Sur tout accord 7 (dominante), le mixolydien correspond. Sol mixolydien = Sol-La-Si-Do-Ré-Mi-Fa. Le Fa naturel (♭7) = la 7e de l'accord G7.",xp:40},
  {id:"q-scales-17",courseId:"scales",lessonId:"scales-c5-05",lvl:3,q:"Que se passe-t-il si tu joues Sol majeur (au lieu de Sol mixolydien) sur un accord G7 ?",o:["Rien, les deux gammes sont identiques", "Le Fa# frotte contre le Fa de l'accord", "Ça sonne plus joyeux, sans aucun frottement", "Ça sonne plus mineur et plus sombre qu'avant"],a:1,exp:"Sol majeur contient Fa#. G7 contient Fa naturel (la ♭7). Le Fa# entre en conflit avec le Fa de l'accord. Mixolydien (Fa naturel) = match parfait avec G7.",xp:55},
  {id:"q-impro-14",courseId:"impro",lessonId:"scales-c5-05",lvl:3,q:"Sur un blues en La (A7-D7-E7), tu joues La mixolydien sur les trois accords. Où ça frotte ?",o:["Sur aucun des trois accords","Sur A7 seulement","Sur D7 et E7","Sur E7 seulement"],a:2,exp:"La mixolydien = La-Si-Do#-Ré-Mi-Fa#-Sol : parfait sur A7 (La-Do#-Mi-Sol). Mais D7 contient Do, qui frotte contre le Do#, et E7 contient Sol#, qui frotte contre le Sol. On adapte : Ré mixolydien sur D7, Mi mixolydien sur E7 — ou la penta mineure de La, qui sonne blues sur les trois.",xp:70},
  {id:"q-fret-scales-05",type:"fretboard",courseId:"scales",lessonId: "scales-c5-05",lvl:2,q:"Trouve les notes du mixolydien de Sol (cases 0-5)",concept:{type:"find_scale",root:"G",quality:"mixolydian"},selectionRules:{mode:"all"},fretRange:[0,5],display:{showNotes:false},hint:"Mixolydien = majeure avec 7e mineure. Sol-La-Si-Do-Ré-Mi-Fa.",xp:55,exp:"Sol mixolydien : le Fa naturel (pas Fa#) est la note caractéristique."},
];
