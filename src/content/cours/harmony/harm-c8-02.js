// Leçon du module « harmony » + les questions de quiz qui s'y rattachent.
// Format décrit dans src/content/README.md.

export default {
  id: "harm-c8-02", level: 9,
  title: "Construire un solo qui suit les accords",
  duration: 11,
  gropiTip: "Enregistre-toi 2 minutes sur une boucle ii-V-I, puis réécoute en notant deux choses : où sont tes silences, et as-tu répété un motif ? Corrige l'un des deux à la prise suivante.",
  content: [
    { type: "p", text: "Cette leçon de synthèse réunit tout ce que tu as appris en harmonie et l'applique à l'improvisation. Construire un solo qui 'suit les accords', ce n'est pas jouer toutes les notes d'accord à la suite — c'est faire des choix mélodiques qui reflètent l'harmonie de façon naturelle et musicale.", img: "/mascotte-choix.webp", imgAlt: "Gropi qui réfléchit, boussole à la main", imgSide: "right" },
    { type: "h", text: "Les 3 niveaux d'un bon solo" },
    { type: "p", text: "Niveau 1 (débutant) : jouer dans la gamme de la tonalité sans cibler. Ça sonne 'correct' mais générique. Niveau 2 (intermédiaire) : cibler les guide tones aux moments clés. Ça sonne 'musical' et 'sur les accords'. Niveau 3 (avancé) : avoir un discours mélodique cohérent (motifs, développement, arc narratif) ET suivre l'harmonie. Ça sonne 'musical ET expressif'." },
    { type: "h", text: "L'arpège comme structure de base" },
    { type: "p", text: "La technique la plus directe pour suivre les accords : baser tes phrases sur les arpèges de l'accord courant. Sur Dm7 : joue des fragments de Ré-Fa-La-Do. Sur G7 : Sol-Si-Ré-Fa. Sur Cmaj7 : Do-Mi-Sol-Si. Les arpèges sont ton 'squelette' — tu habilles ensuite avec gamme, chromatismes, ornements. C'est la base du jazz et du bop." },
    { type: "degree_chart", caption: "Le squelette du ii-V-I en Do : les arpèges de Dm7, G7 et Cmaj7", data: {boxes: [{top: "Dm7", label: "Ré – Fa – La – Do", sub: "ii", tint: "neutral"}, {top: "G7", label: "Sol – Si – Ré – Fa", sub: "V", tint: "coral"}, {top: "Cmaj7", label: "Do – Mi – Sol – Si", sub: "I", tint: "green"}]} },
    { type: "h", text: "La gamme + les notes cibles" },
    { type: "p", text: "Approche plus fluide que les arpèges purs : utilise la gamme de la tonalité (Do majeur sur ii-V-I en Do) mais en 'visant' les notes cibles aux moments importants. La gamme te donne la 'couleur de fond', les notes cibles donnent les 'repères harmoniques'. Les notes non-cibles sont des 'de passage' qui ne s'attardent pas." },
    { type: "h", text: "Le motif mélodique : donner une identité au solo" },
    { type: "p", text: "Un motif = une phrase courte (3-6 notes) répétée et transformée. Joue un motif de 4 notes. Rejoue-le 1 ton plus haut (séquence). Rejoue-le en rythme différent. Rejoue-le en miroir (inversion). Ces 4 techniques de développement motivique transforment 4 notes en un solo complet. C'est ce que font tous les grands improvisateurs." },
    { type: "tab", caption: "Un motif de 4 notes (Do-Ré-Mi-Sol), puis sa séquence un degré plus haut (Ré-Mi-Fa-La)", text: "Tab : Do (corde 3 case 5), Ré (corde 3 case 7), Mi (corde 2 case 5), Sol (corde 2 case 8) ; puis Ré (corde 3 case 7), Mi (corde 3 case 9), Fa (corde 2 case 6), La (corde 2 case 10).", data: { lines: ["e|---------------------|","B|-----5-8-------6-10--|","G|-5-7-------7-9-------|","D|---------------------|","A|---------------------|","E|---------------------|"] } },
    { type: "h", text: "L'arc narratif : début, développement, climax, résolution" },
    { type: "p", text: "Un grand solo a une forme : intro calme (établit le caractère). Développement (monte en intensité, densité, hauteur). Climax (point haut, note tenue, bend, maximum d'expression). Résolution (descente vers la tonique, calme, fin). Même pour un solo de 16 mesures. Pense à 'Comfortably Numb' (Gilmour) : il suit exactement cet arc en 4 parties." },
    { type: "h", text: "Les silences : l'autre moitié de la musique" },
    { type: "p", text: "Une idée souvent attribuée à Miles Davis : ce que tu ne joues pas compte autant que ce que tu joues. Les silences ne sont pas l'absence de musique — ils sont de la musique. Un silence après une phrase tendue crée de l'espace et met en valeur ce qui suit. Les meilleurs solistes utilisent les silences pour 'respirer' et pour créer du contraste avec les phrases denses." },
    { type: "h", text: "Le placement des phrases sur la grille" },
    { type: "p", text: "Les phrases qui commencent toujours sur le temps 1 sonnent carrées. Les phrases qui commencent sur un contretemps ('et' du 4 de la mesure précédente) sonnent plus fluides, syncopées, 'jazz'. Les phrases qui commencent sur le temps 3 d'une mesure créent un effet de décalage agréable. Varie les placements de début de phrase pour casser la monotonie." },
    { type: "ref", text: "Analyse du solo de David Gilmour sur 'Comfortably Numb' (Pink Floyd, 1979) : il commence par des phrases courtes et espacées (intro calme), développe progressivement (densité augmente), atteint un climax sur des bends expressifs dans l'aigu, et résout avec des phrases descendantes. 3 minutes de solo parfaitement structuré. Écoute en te concentrant uniquement sur la forme, pas les notes." },
    { type: "tip", text: "Plan de travail pour improviser sur ii-V-I : Semaine 1 : joue uniquement les arpèges. Semaine 2 : ajoute la gamme entre les notes d'arpège. Semaine 3 : ajoute des chromatismes d'approche. Semaine 4 : développe un motif sur 8 mesures. Semaine 5 : applique l'arc narratif (intro-développement-climax-résolution). En 5 semaines, tu improvises musicalement sur une grille jazz." },
  ],
  quiz: ["q-harm-50", "q-harm-51", "q-harm-52", "q-logic-02", "q-logic-05"],
};

export const quiz = [
  {id:"q-harm-50",courseId:"harmony",lessonId:"harm-c8-02",lvl:1,q:"Selon la leçon, que fait-on au niveau 2 d'un bon solo ?",o:["Viser les guide tones aux moments clés","Jouer dans la gamme sans viser de note","Enchaîner le plus de notes possible","Développer un vrai discours mélodique"],a:0,exp:"Niveau 1 : la gamme sans cibler. Niveau 2 : viser les guide tones aux moments clés. Niveau 3 : un discours mélodique cohérent.",xp:30},
  {id:"q-harm-51",courseId:"harmony",lessonId:"harm-c8-02",lvl:1,q:"Quelles sont les 4 parties de l'arc narratif d'un solo ?",o:["Couplet, refrain, pont, puis refrain final","Intro, développement, climax, résolution","Lent, puis rapide, puis lent, puis rapide","Grave, aigu, grave, aigu"],a:1,exp:"Une intro calme, un développement qui monte, un climax, puis une résolution vers la tonique.",xp:30},
  {id:"q-harm-52",courseId:"harmony",lessonId:"harm-c8-02",lvl:2,q:"Une phrase qui commence sur le « et » du 4 de la mesure d'avant sonne…",o:["Plus carrée et plus rigide qu'avant","Toujours fausse rythmiquement","Plus fluide, plus syncopée","Plus lente que le tempo"],a:2,exp:"Commencer avant le temps 1 donne une phrase plus fluide et syncopée ; commencer toujours sur le 1 sonne carré.",xp:40},
];
