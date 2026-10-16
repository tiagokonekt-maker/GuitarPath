// Leçon du module « rhythm » + les questions de quiz qui s'y rattachent.
// Format décrit dans src/content/README.md.

export default {
  id: "rhy-c3-03", level: 6,
  title: "Le groove : qu'est-ce qui fait qu'un rythme 'sent bon' ?",
  duration: 11,
  gropiTip: "Joue des croches sur Am en ne faisant vraiment sonner que les temps 2 et 4, comme la caisse claire, et effleure à peine les autres coups. Le flux reste continu et le groove apparaît.",
  content: [
    { type: "p", text: "Le groove, c'est ce qui fait qu'une musique te donne envie de bouger. C'est difficile à définir avec des mots, mais immédiatement reconnaissable à l'oreille. Il n'existe pas de recette magique pour créer du groove, mais plusieurs composantes y contribuent systématiquement. Cette leçon les analyse.", img: "/mascotte-zen.webp", imgAlt: "Gropi les yeux fermés, à l'écoute", imgSide: "right" },
    { type: "h", text: "Définition" },
    { type: "p", text: "Le groove = la sensation physique de mouvement créée par un motif rythmique récurrent et précis. Quand tu entends du funk et que ton pied tape tout seul, c'est le groove qui parle à ton corps. Il combine 3 ingrédients : précision rythmique (les notes sont placées exactement où il faut), syncope (les accents sont déplacés stratégiquement), et régularité (le motif se répète de façon prévisible)." },
    { type: "rhythm_grid", caption: "Le backbeat — 8 croches régulières, accent sur 2 et 4 : le squelette de la plupart des grooves", data: {beats: 4, subdivision: 8, accents: [2,6], label: "1 · et · 2 · et · 3 · et · 4 · et"} },
    { type: "h", text: "La précision : sans elle, pas de groove" },
    { type: "p", text: "La première condition du groove est la précision absolue du placement des notes. Pas 'à peu près sur le temps' — exactement sur le temps (ou exactement sur le contretemps, selon le style). Cette précision n'est pas de la rigidité : c'est une ancre qui donne à l'oreille un repère stable. Paradoxalement, c'est cette stabilité qui 'libère' le groove." },
    { type: "h", text: "La répétition : le groove comme hypnose" },
    { type: "p", text: "Le groove fonctionne par répétition. Un motif rythmique joué 1 fois est intéressant. Joué 8 fois, il commence à 'groover'. Joué 16 fois, il hypnotise. C'est pourquoi le funk et le hip-hop utilisent des boucles courtes répétées indéfiniment. La répétition installe le motif dans le corps de l'auditeur, qui commence à l'anticiper et à le ressentir physiquement." },
    { type: "h", text: "Le micro-timing : jouer 'dans' le temps" },
    { type: "p", text: "Au-delà de la précision, il y a le 'micro-timing' : la façon infinitésimale dont les notes se placent juste avant, sur, ou après le temps exact. Un batteur qui joue 'laid-back' place ses notes légèrement après le clic du métronome — ça crée une sensation de décontraction. Un batteur qui joue 'on top' place ses notes légèrement avant — ça crée de l'urgence. Ce micro-timing ne se programme pas : il vient des années de pratique et d'écoute." },
    { type: "h", text: "Les ghost notes : la texture du groove" },
    { type: "p", text: "Les ghost notes sont des notes très légères, presque inaudibles, qui remplissent l'espace entre les notes 'principales'. Sur la batterie, elles sont jouées très doucement sur la caisse claire. Sur la guitare funk, ce sont des coups de mediator sur des cordes étouffées qui ne font 'click' qu'à peine. Elles ne sont pas là pour être entendues — elles sont là pour maintenir la continuité du flux rythmique." },
    { type: "strum_pattern", caption: "Groove funk — quelques coups francs (B/H), des ghost notes (×) partout ailleurs : la main ne s'arrête jamais", data: {pattern: ["B", "x", "x", "H", "x", "x", "B", "x", "x", "x", "B", "x", "B", "x", "x", "x"], beats: 4, style: "funk", bpm: 90} },
    { type: "h", text: "Le lock avec la basse" },
    { type: "p", text: "En musique de groupe, le groove vient du verrouillage ('locking') entre la basse et la grosse caisse. Quand ces deux instruments jouent exactement en même temps, le groove est solide. Quand ils se décalent légèrement, le groove s'affaiblit. En tant que guitariste, tu dois 'locker' avec la basse — écouter le grave et t'y accrocher rythmiquement." },
    { type: "h", text: "Développer son groove" },
    { type: "p", text: "3 exercices clés. 1) Joue avec un métronome tous les jours (améliore la précision). 2) Écoute beaucoup de funk, blues et groove music en te concentrant sur la percussion et la basse (intériorise le feel). 3) Joue avec d'autres musiciens — le vrai groove se développe dans le contexte du jeu en groupe." },
    { type: "ref", text: "Clyde Stubblefield, le batteur de James Brown sur 'Funky Drummer' (1970), joue un break de batterie qui a été samplé des centaines de fois par des rappeurs et des producteurs. Ce beat 'groovy' est construit sur des ghost notes, des syncopes précises, et une régularité métronomique. C'est l'exemple parfait de tout ce qui crée le groove." },
    { type: "tip", text: "Test groove personnel : enregistre 2 minutes de guitare rythmique sur un accord de Am avec métronome à 90 BPM. Joue le pattern le plus simple possible (une croche par temps, alternance bas-haut). Écoute l'enregistrement : est-ce que ça groove ? Si non, identifie les moments où le temps 'coule' : c'est là que tu travailles." },
  ],
  quiz: ["q-rhy-33","q-rhy-34","q-rhy-56"],
};

export const quiz = [
  {id:"q-rhy-33",courseId:"rhythm",lessonId:"rhy-c3-03",lvl:2,q:"Deux guitaristes jouent les mêmes notes au même tempo, et un seul « groove ». Qu'est-ce qui change ?",o:["Le choix des positions d'accords sur le manche", "Le volume général de l'instrument", "Le placement et le dosage des accents", "Le type de cordes installées"],a:2,exp:"Le groove tient à des écarts de quelques millisecondes et à la hiérarchie des accents. C'est mesurable, et c'est travaillable — contrairement à ce que laisse croire le mot « feeling ».",xp:30},
  {id:"q-rhy-34",courseId:"rhythm",lessonId:"rhy-c3-03",lvl:3,q:"Les ghost notes servent à…",o:["Remplir les silences avec des notes bien audibles", "Marquer plus nettement les temps forts", "Atteindre des tempos plus rapides", "Garder le mouvement avec des attaques étouffées"],a:3,exp:"Ce sont des attaques étouffées par la main gauche : on entend la percussion, pas la hauteur. Elles remplissent la grille rythmique sans encombrer l'harmonie, et c'est le cœur du jeu funk.",xp:40},
  {id:"q-rhy-56",courseId:"rhythm",lessonId:"rhy-c3-03",lvl:1,q:"En groupe, avec quels instruments le guitariste rythmique doit-il d'abord se caler ?",o:["La basse et la grosse caisse","Le chant et les chœurs","Le clavier et les nappes","Les cymbales et la cloche"],a:0,exp:"Le groove d'un groupe repose sur le verrouillage entre la basse et la grosse caisse. Le guitariste s'accroche à ce grave pour que tout le monde tombe au même endroit.",xp:30},
];
