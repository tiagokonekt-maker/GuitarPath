// Leçon du module « harmony » + les questions de quiz qui s'y rattachent.
// Format décrit dans src/content/README.md.

export default {
  id: "harm-c8-01", level: 7,
  title: "Cibler les notes d'accord en temps réel",
  duration: 11,
  content: [
    { type: "p", text: "On arrive au cœur de l'application pratique de l'harmonie : improviser en 'suivant' les accords. Cette technique, appelée 'ciblage harmonique', transforme un solo générique en solo musical, connecté à l'harmonie. C'est la différence entre un guitariste qui 'joue des notes' et un musicien qui 'parle avec son instrument'.", img: "/mascotte-choix.webp", imgAlt: "Gropi qui réfléchit, boussole à la main", imgSide: "left" },
    { type: "h", text: "Le problème du solo générique" },
    { type: "p", text: "Quand tu improvises uniquement avec la gamme de la tonalité sans cibler les notes d'accord, ton solo 'flotte' au-dessus de la progression — ça sonne correct mais peu musical. Tes phrases ne semblent pas réagir aux changements d'accords. Un solo musical, lui, 'tombe' sur les bonnes notes aux bons moments." },
    { type: "h", text: "Le principe du ciblage" },
    { type: "p", text: "Sur chaque accord, identifie 1-2 notes 'cibles' qui définissent fortement cet accord. Tes phrases doivent arriver sur ces notes aux moments importants (temps forts, fins de phrases). La note cible peut arriver n'importe où dans la phrase, mais son placement sur un temps fort la met en valeur." },
    { type: "h", text: "Hiérarchie des notes cibles" },
    { type: "p", text: "1ère priorité : 3e et 7e (guide tones, définissent la qualité de l'accord). 2e priorité : fondamentale (la plus stable, mais moins 'colorée'). 3e priorité : 5e (générique, peu informative). 4e priorité : extensions (9, 11, 13 — ajoutent de la couleur sophistiquée). En commençant, concentre-toi sur les guide tones uniquement." },
    { type: "h", text: "L'approche chromatique" },
    { type: "p", text: "Pour 'tomber' sur une note cible de façon élégante, approche-la par chromatisme : joue la note 1 demi-ton au-dessus ou en dessous juste avant la cible. Sur G7, cible Si : joue Do → Si (depuis au-dessus) ou Si♭ → Si (depuis en dessous). Cette technique vient du bebop et donne immédiatement un son jazz." },
    { type: "h", text: "L'enclosure" },
    { type: "p", text: "Version plus élaborée du chromatisme : 'encadrer' la note cible par 2 notes (1 au-dessus, 1 en dessous). Pour cibler Si sur G7 : joue Do (1/2 ton au-dessus) → Si♭ (1/2 ton en dessous) → Si (cible). Ou l'inverse. Cette 'enclosure' crée une petite suspension avant la note cible, encore plus expressive." },
    { type: "h", text: "Placement rythmique des cibles" },
    { type: "p", text: "Les notes cibles tombent idéalement sur les temps forts (temps 1 et 3 d'une mesure de 4/4). Les notes 'de passage' (gamme, chromatismes, ornements) tombent sur les temps faibles (temps 2 et 4) ou les contretemps. Ce placement crée le 'swing' rythmique-harmonique : chaque temps fort 'confirme' l'accord en cours." },
    { type: "h", text: "Exemple pratique : solo sur ii-V-I" },
    { type: "p", text: "Sur Dm7-G7-Cmaj7 (4 temps chacun) : Dm7 → arrive sur Fa (3e de Dm7) ou Do (7e) au temps 1. G7 → arrive sur Si (3e de G7) au temps 1 de la mesure G7. Cmaj7 → arrive sur Mi (3e de Cmaj7) ou Si (7e). Les 'couloirs' entre ces notes cibles sont libres : tu peux y jouer n'importe quelle gamme ou chromatisme, tant que tu atterris sur la cible au bon moment." },
    { type: "ref", text: "Joe Pass (guitare jazz, 1929-1994) est le maître absolu du ciblage harmonique. Regarde ses vidéos de guitare solo (particulièrement 'Virtuoso', 1973) : chaque note d'accord est mise en valeur au bon moment, la gamme et les chromatismes comblent l'espace entre les cibles. C'est la définition du solo harmoniquement connecté." },
    { type: "tip", text: "Drill ciblage (10 min) : sur Dm7-G7-Cmaj7 à 60 BPM. Jeu 1 : improvise librement sans chercher à cibler. Jeu 2 : joue UNIQUEMENT les guide tones de chaque accord (Fa-Do sur Dm7, Si-Fa sur G7, Mi-Si sur Cmaj7). Jeu 3 : mélange librement, en arrivant sur les guide tones au temps 1 de chaque nouvel accord. Entends la différence entre les 3 modes." },
  ],
  quiz: ["q-harm-19","q-harm-20","q-harm-25","q-impro-06","q-impro-10","q-impro-15"],
};

export const quiz = [
  {id:"q-harm-19",courseId:"harmony",lessonId:"harm-c8-01",lvl:3,q:"Sur un solo, où placer idéalement les 'notes cibles' (3e/7e) ?",o:["N'importe où, le placement ne compte pas", "Sur les contretemps (les « et »)", "Sur les temps forts (1 et 3)", "Uniquement sur le 4e temps"],a:2,exp:"Notes cibles sur les temps forts (1 et 3) = solo qui 'tombe' sur l'harmonie. Notes de passage sur les temps faibles. Cette répartition crée le swing rythmique-harmonique.",xp:50},
  {id:"q-harm-20",courseId:"harmony",lessonId:"harm-c8-01",lvl:3,q:"Sur G7, jouer un Lab juste avant un Sol crée…",o:["Une dissonance qui reste sans résolution", "Un changement d'accord implicite", "Une modulation vers une autre tonalité", "Une approche chromatique vers Sol"],a:3,exp:"Approche chromatique = note 1 demi-ton au-dessus ou en dessous de la cible. Lab→Sol crée une 'arrivée' élégante sur Sol. Technique de bebop classique.",xp:55},
  {id:"q-harm-25",courseId:"harmony",lessonId:"harm-c8-01",lvl:3,q:"Sur Cmaj7, la note Fa est considérée comme…",o:["Note évitée (avoid note)","Note cible (3e ou 7e)","Tonique","Quinte"],a:0,exp:"Sur Cmaj7 (Do-Mi-Sol-Si), le Fa (4e) est 'avoid note' classique. Demi-ton avec la 3e (Mi) crée dissonance tenue. À utiliser uniquement en passage.",xp:60},
  {id:"q-impro-06",courseId:"impro",lessonId:"harm-c8-01",lvl:3,q:"Tu joues sur G7. Quelle note crée le plus de tension à résoudre vers Cmaj7 ?",o:["Sol","Si","Lab","Fa"],a:2,exp:"G7 + Lab = G7(♭9). Cette note (♭9) crée une tension extrême qui résout magnifiquement vers Sol (1 de Cmaj7) ou Mi (3 de Cmaj7). Classique du jazz.",xp:65},
  {id:"q-impro-10",courseId:"impro",lessonId:"harm-c8-01",lvl:3,q:"L''enclosure' (encadrement chromatique) consiste à…",o:["Jouer un accord enrichi à la place", "Rester dans une seule position du manche", "Entourer la note cible de ses voisines", "Jouer la note cible plus fort que les autres"],a:2,exp:"Enclosure = note cible Si encadrée par Do (chrome au-dessus) et Sib (chrome en dessous). Joue Do-Sib-Si. Crée une 'arrivée' élégante sur la cible.",xp:65},
  {id:"q-impro-15",courseId:"impro",lessonId:"harm-c8-01",lvl:3,q:"Tu finis ta phrase sur la 9e d'un accord Maj7 (ex: Ré sur Cmaj7). Effet ?",o:["Dissonant","Identique à finir sur la tonique","Mauvaise note","Couleur jazz sophistiquée, 'flottante'"],a:3,exp:"Finir sur la 9 (Ré sur Cmaj7) crée une couleur 'colored' = pas de résolution complète, tension douce qui invite à continuer. Très utilisé en jazz/bossa.",xp:65},
];
