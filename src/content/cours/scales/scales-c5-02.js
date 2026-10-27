// Leçon du module « scales » + les questions de quiz qui s'y rattachent.
// Format « leçon en cartes » décrit dans src/content/README.md.

export default {
  id: "scales-c5-02", level: 8,
  title: "Dorien — le mode caméléon",
  duration: 9,
  gropiTip: "Raccourci : ta gamme mineure naturelle avec la 6 montée d'un demi-ton, c'est le dorien. La mineur devient La dorien en changeant juste Fa en Fa# (case 7 corde 2, position case 5).",
  cartes: [
    { type: "idee", titre: "Le 2e mode", texte: [
      "Do majeur joué depuis Ré : Ré, Mi, Fa, Sol, La, Si, Do. C'est Ré dorien.",
      "Après l'éolien, c'est le mode mineur le plus utilisé : jazz modal, funk, rock, musiques traditionnelles.",
    ] },
    { type: "idee", titre: "Une seule note change", texte: [
      "Formule : 1-2-♭3-4-5-6-♭7. Face à la mineure naturelle, seule la sixte diffère : elle est majeure.",
      "En La dorien, Fa devient Fa#. Même position que La mineur, une case plus haut pour chaque Fa.",
    ], bloc: {
      type: "scale_pattern",
      caption: "La dorien — case 5. Note caractéristique : Fa#, la sixte majeure (case 4 c4, case 7 c2, case 9 c5)",
      data: {
        startFret: 4, endFret: 9,
        rootColor: "primary", noteColor: "green", accentColor: "coral", accentLabel: "Fa#, sixte majeure",
        strings: [
          { frets: [5, 7, 8], root: [5] },
          { frets: [5, 7, 9], root: [], accent: [9] },
          { frets: [4, 5, 7], root: [7], accent: [4] },
          { frets: [4, 5, 7], root: [] },
          { frets: [5, 7, 8], root: [], accent: [7] },
          { frets: [5, 7, 8], root: [5] },
        ],
        noteMap: {
          "5,0":"La","7,0":"Si","8,0":"Do",
          "5,1":"Ré","7,1":"Mi","9,1":"Fa#",
          "4,2":"Fa#","5,2":"Sol","7,2":"La",
          "4,3":"Si","5,3":"Do","7,3":"Ré",
          "5,4":"Mi","7,4":"Fa#","8,4":"Sol",
          "5,5":"La","7,5":"Si","8,5":"Do",
        },
      },
    } },
    { type: "question", quizId: "q-scales-15" },
    { type: "idee", titre: "Mineur, pas triste", texte: [
      "La sixte majeure apporte une touche de lumière dans le mineur : sophistiqué, jazzy, parfois funky.",
      "Pour l'affirmer, pose-la sur les temps forts, en notes longues. Sans elle, tu sonnes mineur naturel. « So What » (Miles Davis, 1959) tient seize mesures de Dm7 : du Ré dorien pur.",
    ] },
    { type: "idee", titre: "Sur quels accords", texte: [
      "Un accord m7 tenu longtemps, ou une vamp Im – IV où le IV est majeur.",
      "Am7 – D7, par exemple : le Fa# de D7 est la sixte majeure de La. C'est la grille d'« Oye Como Va » (Santana).",
    ] },
    { type: "question", quizId: "q-impro-07" },
    { type: "a-toi", titre: "La dorien sur Am7 – D7",
      consigne: "Fais tourner Am7 (x02010) et D7 (xx0212), deux mesures chacun, au clic à 70 : enregistre-toi ou utilise une boucle. Joue la tab, qui appuie le Fa# (corde 2 case 7), puis improvise dans la position case 5 en posant Fa# sur les temps forts du D7.",
      bloc: {
        type: "tab",
        caption: "La dorien, position case 5 : une phrase qui met en avant Fa#, la sixte majeure",
        text: "Tab — corde 2 cases 5 et 7 (Mi, Fa#), corde 1 cases 5, 7, 8, 7, 5 (La, Si, Do, Si, La), corde 2 case 7 (Fa#), puis corde 1 case 5 tenue (La).",
        data: { lines: [
          "e|-------5--7--8--7--5-----|-5--|",
          "B|-5--7-----------------7--|----|",
          "G|-------------------------|----|",
          "D|-------------------------|----|",
          "A|-------------------------|----|",
          "E|-------------------------|----|",
        ] },
      }, bpm: 70, minuteur: 150 },
    { type: "question", quizId: "q-scales-14" },
    { type: "recap", points: [
      "Dorien = 1-2-♭3-4-5-6-♭7 : la mineure naturelle avec une sixte majeure.",
      "Cette sixte est sa note caractéristique : mets-la en valeur.",
      "Terrain : un m7 tenu, ou une vamp Im – IV majeur comme Am7 – D7.",
    ] },
  ],
  quiz: ["q-scales-14","q-scales-15","q-impro-07","q-fret-scales-04"],
};

export const quiz = [
  {id:"q-scales-14",courseId:"scales",lessonId:"scales-c5-02",lvl:2,q:"Sur un accord Dm7 tenu (vamp modale), quel mode privilégier ?",o:["Ré phrygien","Ré locrien","Ré dorien","Ré mixolydien"],a:2,exp:"Sur tout accord m7 dans un contexte modal, le dorien est le mode 'naturel'. Ré dorien sur Dm7 = 'So What' (Miles Davis). Son polyvalent jazz/funk/rock.",xp:45},
  {id:"q-scales-15",courseId:"scales",lessonId:"scales-c5-02",lvl:3,q:"Quelle note de Ré dorien faut-il mettre en valeur pour 'affirmer' le mode ?",o:["Fa (tierce mineure)", "La (quinte juste)", "Ré (fondamentale)", "Si (sixte majeure)"],a:3,exp:"Ré dorien = Ré-Mi-Fa-Sol-La-Si-Do. Le Si (6 majeure) distingue dorien d'éolien. Mets-le en valeur (temps forts, notes longues) pour affirmer la couleur dorien.",xp:50},
  {id:"q-impro-07",courseId:"impro",lessonId:"scales-c5-02",lvl:3,q:"Sur la vamp Dm7 - G7, tu restes en Ré dorien. Quelle note mettre en avant sur G7 pour faire entendre le changement ?",o:["Si","Ré","La","Do"],a:0,exp:"Si est la sixte majeure de Ré dorien et la tierce de G7 : sur Dm7 il colore, sur G7 il définit l'accord. Ré (quinte de G7) et La (9e) ne marquent pas le passage, et Do, la quarte de G7, frotte contre son Si.",xp:65},
  {id:"q-fret-scales-04",type:"fretboard",courseId:"scales",lessonId: "scales-c5-02",lvl:2,q:"Trouve toutes les notes du dorien de Ré sur le manche",concept:{type:"find_scale",root:"D",quality:"dorian"},selectionRules:{mode:"all"},display:{showNotes:false},hint:"Dorien = mineur avec 6te majeure. Ré dorien = Ré Mi Fa Sol La Si Do.",xp:55,exp:"Ré dorien = notes de Do majeur depuis Ré. Le Si (6te M) est la note caractéristique."},
];
