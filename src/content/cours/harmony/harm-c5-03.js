// Leçon du module « harmony » + les questions de quiz qui s'y rattachent.
// Format « leçon en cartes » décrit dans src/content/README.md.

export default {
  id: "harm-c5-03", level: 8,
  title: "Les familles fonctionnelles",
  duration: 9,
  gropiTip: "Deux accords qui partagent deux notes ont souvent la même fonction : Do et Lam partagent Do et Mi, Fa et Rém partagent Fa et La. Pratique pour deviner une substitution.",
  cartes: [
    { type: "idee", titre: "Trois familles", texte: [
      "Les 7 accords d'une tonalité se rangent en 3 familles, selon l'effet qu'ils produisent : le repos (tonique), le mouvement (sous-dominante), la tension (dominante).",
      "C'est la grammaire de l'harmonie tonale : elle explique pourquoi un enchaînement sonne logique.",
    ], bloc: {
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
    } },
    { type: "idee", titre: "Repos et mouvement", texte: [
      "Tonique : I, vi, iii. Do est le repos absolu, Lam un repos plus doux, Mim le plus instable des trois.",
      "Sous-dominante : IV et ii. Fa et Rém donnent envie d'avancer, sans la tension de la dominante. Le ii sert souvent à préparer le V.",
    ] },
    { type: "idee", titre: "La tension", texte: [
      "Dominante : V et vii°. G7 et Si diminué partagent Si et Fa, deux notes qui tirent vers Do et Mi.",
      "V → I est la résolution la plus forte de la musique tonale.",
    ] },
    { type: "question", quizId: "q-logic-07" },
    { type: "idee", titre: "La phrase complète", texte: [
      "Le schéma de base : T → SD → D → T. Do, Fa, Sol, Do. Ou Do, Rém, G7, Do.",
      "Les boucles qu'on répète sans fin suivent presque toutes ce chemin, ou une variante comme I-V-vi-IV.",
    ] },
    { type: "idee", titre: "Remplacer dans la famille", texte: [
      "Deux accords de la même famille s'échangent sans casser la phrase : le I peut devenir vi, le V peut devenir vii°.",
      "Le chemin reste le même, seule la couleur change. C'est la base de la réharmonisation.",
    ] },
    { type: "question", quizId: "q-harm-p89-c503-01" },
    { type: "a-toi", titre: "Une phrase, trois couleurs",
      consigne: "Quatre temps par accord au clic. Tour 1 : Do, Fa, Sol7, Do. Tour 2 : remplace Fa par Rém. Tour 3 : remplace aussi le premier Do par Lam. Écoute : la phrase garde le même chemin, repos, mouvement, tension, repos.",
      bloc: { type: "chord_diagram", caption: "Rém (× × 0 2 3 1) : il remplace Fa dans la famille sous-dominante", data: { name: "Dm", frets: [-1,-1,0,2,3,1], fingers: [0,0,0,2,3,1], startFret: 1 } },
      bpm: 70, minuteur: 180 },
    { type: "question", quizId: "q-harm-p89-c503-02" },
    { type: "recap", points: [
      "Tonique (I, iii, vi) = repos ; sous-dominante (IV, ii) = mouvement ; dominante (V, vii°) = tension.",
      "La phrase type : T → SD → D → T.",
      "Dans une même famille, les accords se remplacent : IV par ii, I par vi.",
    ] },
  ],
  quiz: ["q-harm-15","q-logic-07","q-harm-08","q-harm-10","q-harm-11","q-harm-p89-c503-01","q-harm-p89-c503-02"],
};

export const quiz = [
  {id:"q-harm-15",courseId:"harmony",lessonId:"harm-c5-03",lvl:3,q:"Quelle famille fonctionnelle regroupe les accords ii et IV ?",o:["Tonique", "Dominante secondaire", "Sous-dominante", "Aucune, ils sont indépendants"],a:2,exp:"Tonique = I, iii, vi (stable). Sous-dominante = IV, ii (mouvement, tension douce). Dominante = V, vii° (tension forte). ii et IV sont substituables fonctionnellement.",xp:50},
  {id:"q-logic-07",courseId:"harmony",lessonId:"harm-c5-03",lvl:3,q:"Pourquoi la cadence V-I est-elle plus 'forte' que IV-I ?",o:["La sensible du V monte sur la tonique","Le V contient la tonique, le IV non","Le V est un accord mineur, plus tendu","Le IV n'appartient pas à la tonalité"],a:0,exp:"Le V contient la sensible (le 7e degré, Si en Do majeur), à un demi-ton sous la tonique : elle monte sur Do et crée une attraction forte. Le IV n'a pas de sensible (il contient même la tonique), d'où une résolution plus douce.",xp:60},
  {id:"q-harm-p89-c503-01",courseId:"harmony",lessonId:"harm-c5-03",lvl:2,q:"En Do majeur, par quel accord remplacer Fa sans changer la fonction de la phrase ?",o:["Ré mineur","Mi mineur","Sol majeur","Si diminué"],a:0,exp:"Fa (IV) et Ré mineur (ii) forment la famille sous-dominante : ils partagent Fa et La. Mi mineur est une tonique, Sol et Si diminué des dominantes.",xp:40},
  {id:"q-harm-p89-c503-02",courseId:"harmony",lessonId:"harm-c5-03",lvl:3,q:"En Do majeur, quelle suite de fonctions donne Lam - Rém - Sol7 - Do ?",o:["T - SD - D - T","T - D - SD - T","SD - SD - D - T","T - SD - SD - T"],a:0,exp:"Lam (vi) est une tonique, Rém (ii) une sous-dominante, Sol7 (V7) la dominante, Do (I) le repos : la phrase type T → SD → D → T.",xp:50},
];
