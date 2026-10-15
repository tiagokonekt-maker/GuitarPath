// Leçon du module « harmony » + les questions de quiz qui s'y rattachent.
// Format décrit dans src/content/README.md.

export default {
  id: "harm-c5-03", level: 8,
  title: "Les familles fonctionnelles",
  duration: 10,
  gropiTip: "Deux accords qui partagent deux notes ont souvent la même fonction : Do et Lam partagent Do et Mi, Fa et Rém partagent Fa et La. Pratique pour deviner une substitution.",
  content: [
    { type: "p", text: "Les 7 accords diatoniques ne sont pas tous égaux. Ils se regroupent en 3 familles selon leur 'fonction' harmonique : ce qu'ils 'font' dans la musique, l'effet qu'ils créent. Comprendre ces 3 familles, c'est comprendre la grammaire de la musique tonale — pourquoi certains enchaînements sonnent 'logiques' et d'autres non." },
    { type: "h", text: "Famille Tonique (T) : le repos" },
    { type: "p", text: "Accords : I, iii, vi. Ces accords créent une sensation de repos, de stabilité, d'arrivée. Le I est le repos absolu. Le vi (relatif mineur) est un repos plus doux, légèrement ambigu. Le iii est le repos le plus instable des trois — il est rarement utilisé seul. En Do majeur : Do (I), Mi mineur (iii), La mineur (vi)." },
    { type: "h", text: "Famille Sous-Dominante (SD) : le mouvement doux" },
    { type: "p", text: "Accords : IV, ii. Ces accords créent un mouvement, une envie d'aller quelque part, mais sans la tension forte de la dominante. Le IV est ouvert, 'gospel'. Le ii est plus sophistiqué, utilisé comme 'préparation' avant la dominante. En Do majeur : Fa (IV), Ré mineur (ii)." },
    { type: "h", text: "Famille Dominante (D) : la tension" },
    { type: "p", text: "Accords : V, vii°. Ces accords créent la tension maximale qui 'demande' à se résoudre vers la tonique. Le V est la dominante classique. Le vii° (diminué) est encore plus instable. En Do majeur : Sol (V) ou G7 (V7), Si diminué (vii°). La progression V→I est la résolution harmonique la plus puissante de la musique tonale." },
    {
      type: "degree_chart",
      caption: "Les 3 familles en Do majeur — T (vert) / SD (ambre) / D (corail)",
      data: {
        boxes: [
          { top: "I",    label: "Do — Tonique",          sub: "T",  tint: "green" },
          { top: "ii",   label: "Ré mineur — Sous-Dom.", sub: "SD", tint: "amber" },
          { top: "iii",  label: "Mi mineur — Tonique",   sub: "T",  tint: "green" },
          { top: "IV",   label: "Fa — Sous-Dominante",   sub: "SD", tint: "amber" },
          { top: "V",    label: "Sol — Dominante",       sub: "D",  tint: "coral" },
          { top: "vi",   label: "La mineur — Tonique",   sub: "T",  tint: "green" },
          { top: "vii°", label: "Si diminué — Dominante",sub: "D",  tint: "coral" },
        ],
      },
    },
    { type: "h", text: "La phrase harmonique typique" },
    { type: "p", text: "La 'grammaire' de l'harmonie tonale suit généralement ce schéma : Tonique → Sous-Dominante → Dominante → Tonique. T → SD → D → T. C'est une 'phrase musicale complète'. Exemple : Do (I) → Fa (IV) → Sol (V) → Do (I). Ou plus sophistiqué : Do (I) → Ré mineur (ii) → Sol 7 (V7) → Do (I). Toutes les variations respectent cette logique de base." },
    { type: "h", text: "Substitutions au sein d'une famille" },
    { type: "p", text: "Les accords d'une même famille sont interchangeables. Tu peux remplacer IV par ii (même famille SD) : au lieu de I-IV-V-I, jouer I-ii-V-I. Au lieu de V-I (dominante directe), jouer vii°-I. Ces substitutions créent des progressions plus sophistiquées tout en respectant la logique fonctionnelle. C'est la base de l'harmonie 'élargie'." },
    { type: "h", text: "Progressions circulaires" },
    { type: "p", text: "Les progressions 'en boucle' (celles qu'on peut répéter indéfiniment) sont presque toujours T-SD-D-T ou une variation. I-IV-V-I boucle parfaitement. I-V-vi-IV boucle aussi (T-D-T-SD, un peu différent). ii-V-I boucle en jazz. Ces structures circulaires permettent l'improvisation longue durée — elles ne finissent jamais vraiment." },
    { type: "ref", text: "'The Beatles' sont des maîtres des fonctions harmoniques. 'Twist and Shout' : I-IV-V sans sophistication, maximum d'énergie. 'Yesterday' : harmonisation bien plus complexe, toujours respectant les fonctions. 'Penny Lane' mélange les 3 familles de façon surprenante. Écouter les Beatles en analysant les fonctions T-SD-D est un cours de théorie musicale à lui seul." },
    { type: "tip", text: "Drill : dans une chanson, identifie chaque accord et classe-le dans sa famille (T, SD ou D). Puis identifie les moments de 'tension' (D) et de 'repos' (T). Tu vas comprendre pourquoi certains moments t'émeuvent plus que d'autres : c'est souvent à la résolution D→T." },
  ],
  quiz: ["q-harm-15","q-logic-07","q-harm-08","q-harm-10","q-harm-11"],
};

export const quiz = [
  {id:"q-harm-15",courseId:"harmony",lessonId:"harm-c5-03",lvl:3,q:"Quelle famille fonctionnelle regroupe les accords ii et IV ?",o:["Tonique", "Dominante secondaire", "Sous-dominante", "Aucune, ils sont indépendants"],a:2,exp:"Tonique = I, iii, vi (stable). Sous-dominante = IV, ii (mouvement, tension douce). Dominante = V, vii° (tension forte). ii et IV sont substituables fonctionnellement.",xp:50},
  {id:"q-logic-07",courseId:"harmony",lessonId:"harm-c5-03",lvl:3,q:"Pourquoi la cadence V-I est-elle plus 'forte' que IV-I ?",o:["Une simple convention, sans raison acoustique", "Le tempo est meilleur sur la cadence V-I", "La sensible (7e degré) monte sur la tonique", "Une tradition purement européenne"],a:2,exp:"V contient la sensible (7e degré, ex Si en Do majeur) qui crée une attraction d'1/2 ton vers la tonique. IV n'a pas cette attraction, donc résolution moins puissante.",xp:60},
];
