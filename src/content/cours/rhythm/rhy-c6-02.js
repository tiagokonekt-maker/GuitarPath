// Leçon du module « rhythm » + les questions de quiz qui s'y rattachent.
// Format « leçon en cartes » décrit dans src/content/README.md.

const RIFF_MI = { type: "tab", caption: "Un riff d'une mesure en Mi : la corde grave à vide comme pivot, deux notes de la pentatonique pour la signature", text: "Tab : corde 6 à vide, à vide, case 3 (Sol), à vide, case 5 (La), à vide, case 3 (Sol), puis corde 5 case 2 (Si) pour relancer la boucle.", data: { lines: ["e|------------------|","B|------------------|","G|------------------|","D|------------------|","A|---------------2--|","E|-0-0-3-0-5-0-3----|"] } };

export default {
  id: "rhy-c6-02", level: 9,
  title: "Construire un riff rythmique personnel",
  duration: 9,
  gropiTip: "Pour ton premier riff, impose-toi une contrainte : une seule corde, trois notes maximum. Sans pouvoir te cacher derrière les notes, c'est le rythme qui fait tout le travail.",
  cartes: [
    { type: "idee", titre: "Ta signature", texte: [
      "Un riff, c'est une cellule courte qu'on reconnaît en deux secondes et qu'on rejoue en boucle.",
      "Sa force vient d'abord du rythme, rarement du nombre de notes.",
    ] },
    { type: "idee", titre: "Quatre ingrédients", texte: [
      "Un rythme qu'on retient. Une idée harmonique simple : une à trois notes ou accords. Un détail signature : un accent, un mute, une note de passage.",
      "Et la répétabilité : pouvoir le jouer vingt fois à l'identique.",
    ] },
    { type: "question", quizId: "q-rhy-41" },
    { type: "idee", titre: "Le feel, puis la zone", texte: [
      "Choisis d'abord le feel : shuffle, funk en doubles-croches, rock en croches, skank reggae.",
      "Puis la zone : une corde grave à vide, un power chord, quelques notes de pentatonique. Ce cadre guide tous tes choix.",
    ] },
    { type: "idee", titre: "Une mesure, en boucle", texte: [
      "Quatre à huit coups sur une mesure, avec un accent clair. Joue-la dix fois de suite.",
      "Si elle tourne seule après trois ou quatre passages, c'est bon signe. Si tu cherches la note suivante, simplifie.",
    ], bloc: RIFF_MI },
    { type: "question", quizId: "q-rhy-55" },
    { type: "a-toi", titre: "Le riff en Mi",
      consigne: "Joue le riff au clic à 80, en palm mute sur la corde à vide. Laisse sonner le Sol et le La. Quand il tourne seul, change une seule chose (un accent, une note, un silence) et garde tout le reste.",
      bloc: RIFF_MI, bpm: 80, minuteur: 120 },
    { type: "idee", titre: "Version A, version B", texte: [
      "Trois fois la version A, la quatrième fois une version B : une fin différente, une note qui monte d'une corde, une note de passage.",
      "La répétition ancre le riff, la variation relance l'écoute.",
    ] },
    { type: "a-toi", titre: "Ton riff",
      consigne: "Une corde, trois notes au plus, une mesure : invente ton riff au clic. Joue A, A, A, puis B. Dès qu'il sonne, enregistre-le avec ton téléphone : les bonnes idées s'oublient vite.",
      bpm: 80, minuteur: 300 },
    { type: "recap", points: [
      "Un riff tient sur une cellule courte : le rythme avant les notes.",
      "Choisis le feel et la zone, puis une mesure qui tourne seule en boucle.",
      "Trois fois A, une fois B ; enregistre tout de suite ce qui sonne.",
    ] },
  ],
  quiz: ["q-rhy-41","q-rhy-10","q-rhy-55"],
};

export const quiz = [
  {id:"q-rhy-41",courseId:"rhythm",lessonId:"rhy-c6-02",lvl:3,q:"Qu'est-ce qui rend un riff rythmique mémorable ?",o:["Le nombre de notes qu'il contient au total", "La vitesse à laquelle il est exécuté", "Une cellule courte, répétée puis variée", "L'usage de nombreux accords différents"],a:2,exp:"Répétition pour ancrer, variation pour relancer. Cette structure — trois fois pareil, la quatrième différente — porte l'immense majorité des riffs célèbres, et elle est directement applicable à l'improvisation.",xp:40},
  {id:"q-rhy-55",courseId:"rhythm",lessonId:"rhy-c6-02",lvl:2,q:"En jouant ton riff, tu dois chercher la note suivante à chaque passage. Que faire ?",o:["Le simplifier jusqu'à ce qu'il tourne","L'accélérer pour qu'il paraisse fluide","Lui ajouter des notes de passage","Changer d'accordage pour le jouer"],a:0,exp:"Un bon riff se joue en boucle sans y penser. S'il faut chercher, il est trop complexe : on retire des éléments jusqu'à ce qu'il sonne naturellement après 3 ou 4 répétitions.",xp:40},
];
