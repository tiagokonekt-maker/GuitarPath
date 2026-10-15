// Leçon du module « rhythm » + les questions de quiz qui s'y rattachent.
// Format décrit dans src/content/README.md.

export default {
  id: "rhy-c3-02", level: 6,
  title: "L'anticipation : jouer avant le temps",
  duration: 9,
  gropiTip: "Piège classique : jouer le nouvel accord sur le « et » du 4, puis le rejouer sur le 1. Laisse-le sonner sans rien rejouer sur le 1 : c'est cette tenue qui fait l'anticipation.",
  content: [
    { type: "p", text: "L'anticipation est une forme spécifique de syncope : jouer une note 'avant' le temps où elle serait attendue, et la tenir sur ce temps. C'est l'une des techniques rythmiques les plus utilisées en jazz, en bossa nova, et en pop moderne. Elle crée une sensation de 'fluidité', comme si la musique 'glissait' par-dessus les barres de mesure." },
    { type: "h", text: "Définition" },
    { type: "p", text: "Au lieu de jouer Do sur le temps 1 d'une mesure, tu le joues sur le 'et du 4' de la mesure précédente, et tu le TIENS jusqu'au temps 1 (et au-delà). Le temps 1 est 'anticipé' d'une croche. La note semble 'arriver avant l'heure' — d'où le nom d'anticipation." },
    {
      type: "rhythm_grid",
      caption: "L'accord change sur le 'et du 4', une croche avant le prochain temps 1",
      data: {
        beats: 4, subdivision: 8,
        highlights: [7],
        label: "1 · et · 2 · et · 3 · et · 4 · et ← nouvel accord ici, tenu sur le 1 suivant",
      },
    },
    { type: "h", text: "L'effet sur l'oreille" },
    { type: "p", text: "L'anticipation crée une sensation de mouvement vers l'avant, d'élan. La phrase musicale semble 'se pencher' vers ce qui vient. En comparaison, jouer exactement sur le temps sonne 'solide mais statique'. L'anticipation ajoute du mouvement sans pour autant désorganiser le tempo." },
    { type: "h", text: "En bossa nova : l'anticipation systématique" },
    { type: "p", text: "João Gilberto, l'un des créateurs de la bossa nova (fin des années 50), a construit son style sur l'anticipation systématique des accords. Dans 'The Girl from Ipanema', les accords changent souvent un 'et' avant le temps attendu, créant la légèreté flottante caractéristique du style. Cette anticipation est si intégrée dans la bossa qu'elle en est le trait stylistique fondamental." },
    { type: "h", text: "En jazz : le 'front phrasing'" },
    { type: "p", text: "En jazz, jouer 'en avant' du temps (slightly ahead of the beat) s'appelle 'front phrasing' ou 'playing on top'. Cela crée une sensation d'urgence, d'énergie. À l'opposé, jouer 'derrière' le temps (laid-back) crée une sensation de décontraction. Les grands jazzmen choisissent leur placement délibérément selon l'effet voulu." },
    { type: "h", text: "Comment pratiquer l'anticipation" },
    { type: "p", text: "Exercice : joue une progression Am-F-C-G en strumming noires normales. Maintenant anticipe le changement d'accord de 1 croche : joue le nouvel accord sur le 'et-du-4' de la mesure précédente au lieu du temps 1. La progression sonne immédiatement plus fluide et 'professionnelle'." },
    { type: "h", text: "Anticipation vs erreur de timing" },
    { type: "p", text: "Attention : une anticipation doit être délibérée et précise. Si tu arrives 'à peu près' avant le temps sans contrôle, ça sonne comme une erreur. L'anticipation bien faite arrive exactement sur le 'et-du-4' (ou le 'a-du-4' pour une double-croche d'anticipation). La précision distingue l'anticipation musicale de la sloppiness rythmique." },
    { type: "ref", text: "'Fly Me to the Moon' (chanté par Sinatra, arrangé par Count Basie) : la phrase vocale 'Fly me to the moon' anticipe chaque nouveau mot d'une croche. Cette anticipation constante donne à la mélodie son caractère coulant et naturel. L'équivalent guitare serait de changer d'accord une croche en avance." },
    { type: "tip", text: "Exercice d'anticipation : joue I-V-vi-IV en Do. D'abord, change d'accord exactement sur le temps 1 de chaque mesure (normal). Ensuite, anticipe chaque changement d'une croche : change sur le 'et-du-4' de la mesure précédente. Compare les deux versions. La deuxième sonne plus 'professionnelle' et 'moderne'." },
  ],
  quiz: ["q-rhy-06","q-rhy-42","q-rhy-43"],
};

export const quiz = [
  {id:"q-rhy-06",courseId:"rhythm",lessonId:"rhy-c3-02",lvl:3,q:"L''anticipation harmonique' en jazz/bossa consiste à…",o:["Ralentir légèrement le tempo avant chaque accord", "Ajouter un silence juste avant le temps 1", "Jouer la note du 1 sur le « et » du 4 précédent", "Jouer plus fort sur le premier temps"],a:2,exp:"Anticipation = jouer la note/accord cible un demi-temps avant le temps fort. Crée fluidité, 'glisse' rythmique. Très utilisé en bossa nova.",xp:50},
  {id:"q-rhy-42",courseId:"rhythm",lessonId:"rhy-c3-02",lvl:1,q:"Anticiper le temps 1, concrètement, c'est…",o:["Jouer le 1 plus fort que les autres", "Ralentir légèrement juste avant le temps 1", "Sauter le temps 1 de la mesure", "Jouer sur le « et » du 4, puis tenir"],a:3,exp:"On joue la note sur le « et » du 4 de la mesure précédente et on la tient sur le 1 : elle arrive une croche en avance.",xp:30},
  {id:"q-rhy-43",courseId:"rhythm",lessonId:"rhy-c3-02",lvl:2,q:"Qu'est-ce qui distingue une anticipation d'une erreur de timing ?",o:["Elle tombe précisément sur le « et »", "Elle est jouée plus doucement", "Elle n'arrive qu'à la toute fin du morceau", "Elle se joue sans médiator"],a:0,exp:"L'anticipation est délibérée et précise : exactement sur le « et » du 4. Approximative, elle sonne comme une erreur.",xp:40},
];
