// Leçon du module « scales » + les questions de quiz qui s'y rattachent.
// Format « leçon en cartes » décrit dans src/content/README.md.

export default {
  id: "scales-c4-03", level: 8,
  title: "Comment l'oreille perçoit un mode (le rôle du drone)",
  duration: 8,
  gropiTip: "Drone gratuit : pour Mi phrygien, laisse sonner la corde 6 à vide et joue les notes de Do majeur sur les cordes aiguës. Insiste sur le Fa (case 1 corde 1) pour entendre la ♭2.",
  cartes: [
    { type: "idee", titre: "Sans ancre, pas de mode", texte: [
      "Un mode n'existe que si l'oreille perçoit une fondamentale stable.",
      "Joue les notes de Ré dorien sans rien autour : ton oreille retombe vite sur la gamme parente, le motif qu'elle connaît le mieux. Le dorien s'évanouit.",
    ] },
    { type: "idee", titre: "Le drone", texte: [
      "Un drone, c'est une note grave tenue sous la mélodie. Avec un Ré qui sonne en continu, l'oreille prend Ré comme fondamentale : le mode s'installe.",
      "Une app de drone, une boucle enregistrée, ou ta guitare : laisse résonner la corde 4 à vide entre tes phrases.",
    ] },
    { type: "question", quizId: "q-scales-36" },
    { type: "idee", titre: "Ou un accord en boucle", texte: [
      "Autre ancre : un accord du mode tenu en boucle, une vamp. Dm7 pour Ré dorien, G7 pour Sol mixolydien, Em pour Mi phrygien.",
      "L'accord fixe la fondamentale, et ses notes colorent déjà le mode.",
    ], bloc: { type: "chord_diagram", caption: "Dm7 (xx0211) — la vamp qui ancre l'oreille en Ré dorien", data: {name: "Dm7", frets: [-1,-1,0,2,1,1], fingers: [0,0,0,2,1,1], startFret: 1} } },
    { type: "idee", titre: "La note caractéristique", texte: [
      "Chaque mode a une note qui le distingue du majeur ou du mineur : la ♭2 du phrygien, la #4 du lydien, la ♭7 du mixolydien…",
      "Pose-la sur les temps forts, en notes longues : c'est elle qui affirme le mode. Sans elle, l'oreille glisse vers le majeur ou le mineur ordinaire.",
    ] },
    { type: "question", quizId: "q-scales-37" },
    { type: "a-toi", titre: "Ré dorien sur son drone",
      consigne: "Joue la tab au clic à 60 : la corde 4 à vide revient sous chaque petite phrase. Puis improvise avec Ré, Mi, Fa, Sol, La, Si, Do sur les cordes 3 à 1, en laissant sonner le Ré grave et en revenant souvent sur Si (corde 3 case 4).",
      bloc: { type: "tab", caption: "La corde de Ré à vide sert de drone : elle revient sous chaque petite phrase de Ré dorien (La, Si, Do)", text: "Tab : corde 4 à vide (Ré), puis corde 3 cases 2 et 4 (La, Si), corde 2 case 1 (Do), Ré à vide, puis Si, La et Ré à vide pour finir. Le Si, sixte majeure, donne la couleur dorienne.", data: { lines: ["e|------------------|","B|-------1----------|","G|---2-4-----4-2----|","D|-0-------0-----0--|","A|------------------|","E|------------------|"] } },
      bpm: 60, minuteur: 120 },
    { type: "question", quizId: "q-scales-59" },
    { type: "recap", points: [
      "Sans ancre, l'oreille entend la gamme parente : le mode disparaît.",
      "Un drone ou un accord tenu en boucle fixe la fondamentale du mode.",
      "Mets en valeur la note caractéristique pour affirmer le mode.",
    ] },
  ],
  quiz: ["q-scales-36", "q-scales-37", "q-scales-59"],
};

export const quiz = [
  {id:"q-scales-36",courseId:"scales",lessonId:"scales-c4-03",lvl:2,q:"Sans drone ni accord de soutien, les notes de Ré dorien jouées seules sonnent souvent comme…",o:["Ré mineur harmonique", "Do majeur", "La mineur", "Sol mixolydien"],a:1,exp:"Sans ancre, l'oreille retombe sur la gamme parente qu'elle connaît le mieux : Do majeur. Le mode dorien s'évanouit.",xp:40},
  {id:"q-scales-37",courseId:"scales",lessonId:"scales-c4-03",lvl:2,q:"Quelle est la note caractéristique du mode dorien ?",o:["La seconde mineure", "La quarte augmentée", "La sixte majeure", "La septième majeure"],a:2,exp:"Dorien = mineur avec une sixte majeure. C'est la note à mettre en valeur pour que le mode s'entende.",xp:40},
  {id:"q-scales-59",courseId:"scales",lessonId:"scales-c4-03",lvl:2,q:"Tu veux faire entendre La dorien. Quel accord tenir en boucle sous ton impro ?",o:["Am7","Cmaj7","G7","Fmaj7"],a:0,exp:"Un mode n'existe que si l'oreille entend sa fondamentale. Am7 ancre La ; les notes de La dorien (celles de Sol majeur) prennent alors leur couleur dorienne. Sur Cmaj7, l'oreille se poserait sur Do.",xp:40},
];
