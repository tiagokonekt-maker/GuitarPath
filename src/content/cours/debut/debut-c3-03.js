// Leçon du module « debut » + les questions de quiz qui s'y rattachent.
// Format décrit dans src/content/README.md.
//
// Bloc `tab` : voir debut-c3-01.js. Mélodies choisies dans le domaine
// public (airs traditionnels, Beethoven) : notes seules, sans paroles.

export default {
  id: "debut-c3-03", level: 0, unite: 3,
  title: "Premières mélodies en tablature",
  duration: 8,
  content: [
    { type: "p", text: "Place à la pratique ! Trois airs que tout le monde connaît, tous du domaine public, écrits en tablature sur les deux cordes aiguës. Cinq notes suffisent : Do (corde 2, case 1), Ré (corde 2, case 3), Mi (corde 1 à vide), Fa (corde 1, case 1) et Sol (corde 1, case 3)." },
    {
      type: "fretboard",
      caption: "Les 5 notes des mélodies, sur les cordes 2 et 1 (plus Mi, corde 1 à vide)",
      data: {
        frets: 4, startFret: 0, showStringNames: true, showFretNumbers: true,
        notes: [
          { string: 2, fret: 1, label: "Do",  color: "primary", root: true },
          { string: 2, fret: 3, label: "Ré",  color: "green" },
          { string: 1, fret: 1, label: "Fa",  color: "amber" },
          { string: 1, fret: 3, label: "Sol", color: "pink" },
        ],
      },
    },
    { type: "p", text: "Doigté conseillé : index pour la case 1, annulaire pour la case 3. Ta main reste en place, seuls les doigts bougent." },
    { type: "h", text: "1. Frère Jacques (air traditionnel)" },
    {
      type: "tab",
      caption: "Frère Jacques — début de l'air",
      text: "Tab — Do Ré Mi Do, deux fois (corde 2 : 1, 3 ; corde 1 : 0 ; corde 2 : 1), puis Mi Fa Sol, deux fois (corde 1 : 0, 1, 3).",
      data: { lines: [
        "e|-------0-----|-------0-----|-0--1--3--|-0--1--3--|",
        "B|-1--3-----1--|-1--3-----1--|----------|----------|",
        "G|-------------|-------------|----------|----------|",
        "D|-------------|-------------|----------|----------|",
        "A|-------------|-------------|----------|----------|",
        "E|-------------|-------------|----------|----------|",
      ] },
    },
    { type: "h", text: "2. Au clair de la lune (air traditionnel)" },
    {
      type: "tab",
      caption: "Au clair de la lune — première phrase",
      text: "Tab — Do Do Do Ré (corde 2 : 1, 1, 1, 3), Mi Ré (corde 1 : 0 ; corde 2 : 3), Do Mi Ré Ré (corde 2 : 1 ; corde 1 : 0 ; corde 2 : 3, 3), Do (corde 2 : 1).",
      data: { lines: [
        "e|-------------|-0-----|----0--------|----|",
        "B|-1--1--1--3--|----3--|-1-----3--3--|-1--|",
        "G|-------------|-------|-------------|----|",
        "D|-------------|-------|-------------|----|",
        "A|-------------|-------|-------------|----|",
        "E|-------------|-------|-------------|----|",
      ] },
    },
    { type: "p", text: "Ici, la tab montre bien sa limite : dans la deuxième et la dernière mesure, les notes sont longues, mais rien ne l'indique précisément. Chante l'air dans ta tête en jouant : c'est ta mémoire qui donne le rythme." },
    { type: "h", text: "3. L'Ode à la joie (Beethoven)" },
    {
      type: "tab",
      caption: "Ode à la joie — première phrase",
      text: "Tab — Mi Mi Fa Sol, Sol Fa Mi Ré, Do Do Ré Mi, Mi Ré Ré. Corde 1 : 0, 0, 1, 3, 3, 1, 0 ; corde 2 : 3, 1, 1, 3 ; corde 1 : 0, 0 ; corde 2 : 3, 3.",
      data: { lines: [
        "e|-0--0--1--3--|-3--1--0-----|----------0--|-0--------|",
        "B|-------------|----------3--|-1--1--3-----|----3--3--|",
        "G|-------------|-------------|-------------|----------|",
        "D|-------------|-------------|-------------|----------|",
        "A|-------------|-------------|-------------|----------|",
        "E|-------------|-------------|-------------|----------|",
      ] },
    },
    { type: "h", text: "Et ensuite ?" },
    { type: "p", text: "Tu sais maintenant tenir ta guitare, l'accorder, jouer cinq accords, enchaîner une progression avec une vraie rythmique et lire une tablature. C'est exactement le bagage qu'il faut pour attaquer des morceaux. Dans Outils → Morceaux, tu trouveras des morceaux à jouer avec tout ça. Et la suite du parcours t'emmène découvrir le manche, les gammes, l'harmonie et le rythme en profondeur." },
    { type: "tip", text: "Pour chaque mélodie : d'abord lentement, en disant le nom des notes à voix haute. Puis sans t'arrêter, même avec une erreur. Enfin, joue-la de mémoire, sans regarder la tab. Trois étapes, et l'air est à toi." },
  ],
  quiz: ["q-debut-50", "q-debut-51", "q-debut-52"],
};

export const quiz = [
  {id:"q-debut-50",courseId:"debut",lessonId:"debut-c3-03",lvl:1,q:"Quelle note obtiens-tu sur la corde 2, case 1 ?",o:["Si","Do","Ré","Mi"],a:1,exp:"La corde 2 à vide donne Si ; une case plus haut (un demi-ton), on obtient Do.",xp:25},
  {id:"q-debut-51",courseId:"debut",lessonId:"debut-c3-03",lvl:1,q:"Sur la ligne du haut d'une tab, tu lis 0 puis 3. Quelles notes joues-tu ?",o:["Mi puis Sol","Si puis Ré","Mi puis Fa","La puis Do"],a:0,exp:"Ligne du haut = corde 1 (Mi aigu). À vide : Mi ; case 3 : Sol.",xp:25},
  {id:"q-debut-52",courseId:"debut",lessonId:"debut-c3-03",lvl:2,q:"Comment savoir qu'une note est longue quand la tab ne le précise pas ?",o:["Le chiffre est écrit en plus gros","En connaissant ou en écoutant le morceau","Le chiffre est toujours suivi d'un ~","Une note longue est toujours jouée à vide"],a:1,exp:"La tab classique ne note pas les durées avec précision. C'est l'écoute (ou la mémoire de l'air) qui donne le rythme exact.",xp:30},
];
