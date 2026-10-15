// Leçon du module « rhythm » + les questions de quiz qui s'y rattachent.
// Format décrit dans src/content/README.md.

export default {
  id: "rhy-c6-01", level: 9,
  title: "Jouer laid-back, on-top, in-the-pocket",
  duration: 10,
  gropiTip: "Enregistre une minute de noires sur un clic à 60 BPM, puis réécoute. Si le clic disparaît presque, c'est que tu es pile dessus : ta note le masque. S'il ressort, tu es devant ou derrière.",
  content: [
    { type: "p", text: "Le micro-timing est la dimension la plus subtile de la rythmique. Deux musiciens peuvent jouer exactement les mêmes notes au même tempo, et pourtant sonner complètement différemment. La raison : l'un joue laid-back, l'autre on-top, le troisième in-the-pocket. Ces nuances de placement infinitésimal par rapport au temps définissent le 'feel' d'un musicien.", img: "/mascotte-zen.webp", imgAlt: "Gropi les yeux fermés, à l'écoute", imgSide: "left" },
    { type: "h", text: "In-the-pocket : le 'temps parfait'" },
    { type: "p", text: "Jouer 'in-the-pocket' = jouer exactement sur le temps, ni avant ni après. Son : solide, ancré, confortable. L'auditeur se sent en sécurité rythmiquement. C'est le feel idéal pour l'accompagnement funk, le R&B, et tout ce qui doit créer un groove stable. La caisse claire de John Bonham (Led Zeppelin) est 'in-the-pocket' avec une précision quasi métronomique." },
    { type: "rhythm_grid", caption: "In-the-pocket : l'attaque tombe pile sur le temps. Laid-back la glisse un rien vers la droite, on-top un rien vers la gauche", data: {beats: 4, subdivision: 16, highlights: [0,4,8,12], muted: [1,2,3,5,6,7,9,10,11,13,14,15], label: "1 · e · et · a · 2 · e · et · a · 3 · e · et · a · 4 · e · et · a"} },
    { type: "h", text: "Laid-back : derrière le temps" },
    { type: "p", text: "Jouer 'laid-back' = jouer légèrement après le clic du métronome. La note arrive microscopiquement en retard par rapport au temps exact. Son : décontracté, cool, 'qui se pose'. Évoque la chaleur, la décontraction. Très utilisé en blues (B.B. King joue très laid-back), en soul (les musiciens de Motown jouaient souvent laid-back), et en certains styles de jazz (Lester Young, Miles Davis période 'cool jazz')." },
    { type: "h", text: "On-top : devant le temps" },
    { type: "p", text: "Jouer 'on-top' = jouer légèrement avant le clic. La note arrive microscopiquement en avance. Son : urgent, énergique, 'qui pousse'. Crée une sensation de tension et d'excitation. Utilisé dans le bebop rapide (Charlie Parker jouait on-top), le hard rock énergique, et le jazz fusion (John McLaughlin)." },
    { type: "h", text: "Ce sont des choix artistiques, pas des erreurs" },
    { type: "p", text: "Crucial à comprendre : laid-back et on-top ne sont pas des erreurs de tempo. Ce sont des décisions artistiques délibérées qui définissent le feel. Un musicien qui joue constamment laid-back par accident est en retard. Un musicien qui CHOISIT de jouer laid-back contrôle son expression. La différence = cohérence et intention." },
    { type: "h", text: "Comment développer le micro-timing" },
    { type: "p", text: "1) Écoute active : écoute tes artistes préférés en te concentrant sur leur placement rythmique. Est-ce qu'ils sont devant ou derrière ? 2) Enregistre-toi et analyse : joue avec un métronome, enregistre. Écoute si tu es en avance ou en retard sur le clic. 3) Imite consciemment : essaie délibérément de jouer 'laid-back' pendant 5 minutes. Puis 'on-top'. Sens la différence physique." },
    { type: "h", text: "Le feel de groupe" },
    { type: "p", text: "En groupe, le micro-timing collectif crée une ambiance unique. Un groupe qui joue tous 'in-the-pocket' sonne solide. Un groupe laid-back collectivement sonne décontracté et chaud. Mélanger laid-back (basse) et on-top (batterie lead) crée une tension créative intéressante. Les grands groupes (Meters, JB's) ont développé un micro-timing collectif reconnaissable en quelques secondes." },
    { type: "ref", text: "Écoute comparative : 'Freddie King Is a Blues Master' (Freddie King) = laid-back extrême, les notes traînent. 'Bireli Lagrene joue Minor Swing' = on-top, chaque note pousse. 'James Brown - Super Bad' = in-the-pocket parfait, les musiciens 'lockés' comme des machines. Trois feels, trois émotions complètement différentes." },
    { type: "tip", text: "Exercice de micro-timing : joue une gamme de Do avec un métronome à 60 BPM. D'abord in-the-pocket (pile sur le clic). Puis essaie de jouer chaque note 20% plus tard (laid-back). Puis 20% plus tôt (on-top). Tu vas probablement avoir du mal à contrôler ces variations — c'est normal. Ce contrôle se développe sur des années de pratique consciente." },
    { type: "tab", caption: "La gamme de Do de l'exercice : joue-la pile sur le clic, puis derrière, puis devant", text: "Tab : Do (corde 5 case 3), Ré (corde 4 à vide), Mi (corde 4 case 2), Fa (corde 4 case 3), Sol (corde 3 à vide), La (corde 3 case 2), Si (corde 2 à vide), Do (corde 2 case 1).", data: { lines: ["e|------------------|","B|-------------0-1--|","G|---------0-2------|","D|---0-2-3----------|","A|-3----------------|","E|------------------|"] } },
  ],
  quiz: ["q-rhy-35","q-rhy-40","q-rhy-07","q-rhy-09"],
};

export const quiz = [
  {id:"q-rhy-35",courseId:"rhythm",lessonId:"rhy-c6-01",lvl:3,q:"Jouer « laid-back » signifie placer les notes…",o:["Très légèrement après le temps", "Juste avant le temps, en avance", "Exactement sur le temps", "En dehors de la mesure"],a:0,exp:"Un placement très légèrement en retard, sans perdre le tempo — d'où l'impression de détente du jazz et de la soul. Jouer « on top » (juste devant) produit l'effet inverse : urgence, poussée, et c'est le placement du rock.",xp:40},
  {id:"q-rhy-40",courseId:"rhythm",lessonId:"rhy-c6-01",lvl:3,q:"Jouer « in the pocket », c'est…",o:["Jouer le plus vite possible sans perdre la justesse","S'aligner précisément sur le placement de la section rythmique","Jouer systématiquement en avance sur le temps","Jouer très fort pour dominer le reste du groupe"],a:1,exp:"Le « pocket » est le placement collectif du groupe. Être dedans, ce n'est pas être mathématiquement sur le clic : c'est être au même endroit que la basse et la batterie, quel que soit cet endroit.",xp:40},
];
