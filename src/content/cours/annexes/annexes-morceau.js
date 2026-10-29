// Leçon d'annexe (module « annexes ») + les questions de quiz qui s'y
// rattachent. Format « leçon en cartes » (src/content/README.md).
// Facultative : pas de palier, jamais bloquante (pathEngine.estModuleAnnexe).
// Le mémo vocal sert d'aide-mémoire : rien n'est écouté ni évalué par l'app.

const MOTIF = {
  type: "tab",
  caption: "Un motif en Mi mineur pentatonique, puis sa variation",
  text: "Tab — mesure 1 : Mi (corde 6 à vide), Sol (corde 6 case 3), La (corde 5 à vide), Si (corde 5 case 2). Mesure 2 : même début, puis la fin change : La (corde 5 à vide), Ré (corde 4 à vide).",
  data: { lines: [
    "e|---------------|---------------|",
    "B|---------------|---------------|",
    "G|---------------|---------------|",
    "D|---------------|-----------0---|",
    "A|-------0---2---|-------0-------|",
    "E|-0---3---------|-0---3---------|",
  ] },
};

export default {
  id: "annexes-morceau", annexe: true,
  title: "Écrire ton premier morceau",
  duration: 10,
  gropiTip: "Une idée qui te paraît banale aujourd'hui sonnera peut-être très bien dans une semaine : garde tous tes mémos, même ceux que tu n'aimes pas sur le moment.",
  cartes: [
    { type: "idee", titre: "Tu as déjà de quoi écrire", texte: [
      "Quatre accords suffisent. Une suite très courante : I–V–vi–IV. En Do majeur, elle donne Do, Sol, La mineur, Fa.",
      "Les chiffres romains te permettent de la transposer. En Sol majeur, les degrés valent : I Sol, ii La mineur, iii Si mineur, IV Do, V Ré, vi Mi mineur.",
    ] },
    { type: "question", quizId: "q-morceau-2-annexe" },
    { type: "a-toi", titre: "Ta suite, en boucle",
      consigne: "Joue ta suite en Sol majeur, quatre coups vers le bas par accord, un par clic. Fais tourner la boucle sans t'arrêter : c'est le socle de ton morceau. Si un autre ordre des quatre accords te plaît davantage, garde-le.",
      bpm: 80, minuteur: 120 },
    { type: "idee", titre: "Un motif, puis sa variation", texte: [
      "Sur ta suite, invente un motif de trois ou quatre notes dans la pentatonique de Mi mineur, en position ouverte : Mi, Sol, La, Si, Ré.",
      "Joue-le deux fois à l'identique, puis change seulement sa fin. La répétition installe l'idée, la variation la rend vivante.",
    ], bloc: MOTIF },
    { type: "idee", titre: "Couplet et refrain", texte: [
      "Le couplet raconte : sa musique revient, ses paroles changent. Le refrain résume : il revient à l'identique, souvent plus fort ou plus aigu.",
      "Pour les distinguer, change un élément : l'ordre des accords (Mi mineur, Do, Sol, Ré au couplet), le rythme ou l'énergie du gratté.",
      "Structure simple : couplet, refrain, couplet, refrain.",
    ] },
    { type: "question", quizId: "q-morceau-3-annexe" },
    { type: "idee", titre: "Garde une trace", texte: [
      "Une idée s'oublie vite. Enregistre-la sur ton téléphone, en mémo vocal : quelques secondes suffisent, même imparfaites.",
      "Nomme le fichier avec la tonalité, le tempo et la partie (« Sol 80 couplet »). Ce n'est pas un examen : c'est ton carnet de notes sonore, pour reprendre demain.",
    ] },
    { type: "a-toi", titre: "Ton premier mémo",
      consigne: "Enchaîne tes deux parties, avec ton motif sur l'une d'elles. Enregistre une seule prise en mémo vocal, sans viser la perfection, puis range le téléphone. Réécoute-la demain avant de continuer ton morceau.",
      minuteur: 600 },
    { type: "question", quizId: "q-morceau-1-annexe" },
    { type: "recap", points: [
      "Une suite de quatre accords (I–V–vi–IV par exemple) suffit pour poser un morceau.",
      "Un motif court, répété puis varié, donne une phrase dont on se souvient.",
      "Couplet qui change, refrain qui revient ; un mémo vocal pour ne rien perdre.",
    ] },
  ],
  quiz: ["q-morceau-1-annexe", "q-morceau-2-annexe", "q-morceau-3-annexe", "q-morceau-4-annexe"],
};

export const quiz = [
  {id:"q-morceau-1-annexe",courseId:"annexes",lessonId:"annexes-morceau",lvl:1,q:"Dans une chanson, quelle partie revient à l'identique, paroles comprises ?",o:["Le refrain","Le couplet","L'introduction","Le solo"],a:0,exp:"Le refrain revient tel quel et résume la chanson ; les couplets gardent leur musique, mais leurs paroles changent à chaque fois.",xp:20},
  {id:"q-morceau-2-annexe",courseId:"annexes",lessonId:"annexes-morceau",lvl:2,q:"En Sol majeur, quels accords donne la suite I–V–vi–IV ?",o:["Sol, Ré, Mi mineur, Do","Sol, Do, Ré, Mi mineur","Sol, Ré, La mineur, Do","Do, Sol, La mineur, Fa"],a:0,exp:"En Sol majeur : I = Sol, V = Ré, vi = Mi mineur, IV = Do. « Do, Sol, La mineur, Fa » est la même suite, mais en Do majeur.",xp:25},
  {id:"q-morceau-3-annexe",courseId:"annexes",lessonId:"annexes-morceau",lvl:2,q:"Ton motif de quatre notes te plaît. Comment en faire une phrase qui accroche ?",o:["Le rejouer, puis modifier sa fin","Changer toutes ses notes à chaque mesure","Le jouer une fois, puis passer à autre chose","L'allonger jusqu'à douze notes différentes"],a:0,exp:"La répétition installe l'idée dans l'oreille ; une fin modifiée crée la surprise. Changer tout, tout le temps, empêche l'auditeur de s'accrocher à quoi que ce soit.",xp:25},
  {id:"q-morceau-4-annexe",courseId:"annexes",lessonId:"annexes-morceau",lvl:1,q:"Pourquoi enregistrer une idée en mémo vocal dès qu'elle te vient ?",o:["Pour ne pas l'oublier avant de la retravailler","Pour qu'elle soit déjà prête à être publiée","Pour pouvoir te passer du métronome","Pour vérifier l'accordage de ta guitare"],a:0,exp:"Une idée musicale s'efface vite. Le mémo est un aide-mémoire, pas une version finale : tu la retravailleras plus tard, à tête reposée.",xp:20},
];
