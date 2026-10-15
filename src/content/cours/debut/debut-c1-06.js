// Leçon du module « debut » + les questions de quiz qui s'y rattachent.
// Format « leçon en cartes » décrit dans src/content/README.md.

const REPERES = {
  type: "fretboard",
  caption: "Les repères d'accordage : case 5 partout, sauf case 4 sur la corde de Sol",
  data: {
    frets: 6, startFret: 0, showStringNames: true, showFretNumbers: true,
    notes: [
      { string: 6, fret: 5, label: "La",  color: "primary" },
      { string: 5, fret: 5, label: "Ré",  color: "primary" },
      { string: 4, fret: 5, label: "Sol", color: "primary" },
      { string: 3, fret: 4, label: "Si",  color: "coral" },
      { string: 2, fret: 5, label: "Mi",  color: "primary" },
    ],
  },
};

export default {
  id: "debut-c1-06", level: 0, unite: 1,
  title: "Accorder à l'oreille : la méthode de la 5e case",
  duration: 8,
  gropiTip: "Le La de ta corde 5 à vide vibre à 110 Hz, deux octaves sous le La 440 du diapason. La corde 6 en case 5 donne exactement ce même La : c'est pour ça que la méthode marche.",
  cartes: [
    { type: "idee", titre: "Ta guitare s'accorde avec elle-même", texte: [
      "Pas d'accordeur ? Sur une corde, une case précise donne la même note que la corde suivante à vide. Compare les deux sons et ajuste.",
      "On part d'une corde jugée juste, en général la 6.",
    ] },
    { type: "idee", titre: "La règle de la case 5", texte: [
      "Corde 6 case 5 = corde 5 à vide (La). Corde 5 case 5 = corde 4 à vide (Ré). Corde 4 case 5 = corde 3 à vide (Sol).",
      "Exception : corde 3 case 4 = corde 2 à vide (Si). Enfin, corde 2 case 5 = corde 1 à vide (Mi).",
    ], bloc: REPERES },
    { type: "question", quizId: "q-debut-19" },
    { type: "idee", titre: "Pourquoi la case 4 ?", texte: [
      "Une case = un demi-ton. Entre deux cordes voisines, l'écart est de 5 demi-tons, d'où la case 5.",
      "Entre Sol et Si, il n'est que de 4 demi-tons : la seule irrégularité de l'accordage standard.",
    ] },
    { type: "question", quizId: "q-debut-21" },
    { type: "idee", titre: "Écoute les battements", texte: [
      "Joue les deux notes ensemble. Presque identiques, elles ondulent : « wa-wa-wa ». Ce sont les battements.",
      "Plus les notes se rapprochent, plus l'ondulation ralentit. Quand elle disparaît et que tout fusionne en un son stable, c'est juste.",
    ] },
    { type: "question", quizId: "q-debut-20" },
    { type: "a-toi", titre: "Accorde à l'oreille", consigne: "Désaccorde un peu ta corde 5, puis accorde-la sur la case 5 de la corde 6 en écoutant les battements ralentir. Perdu ? Détends franchement, puis remonte doucement. Enchaîne les quatre autres comparaisons.", bloc: REPERES },
    { type: "idee", titre: "Juste entre vous, pas forcément au diapason", texte: [
      "Ta guitare peut être juste avec elle-même sans être au diapason (La = 440 Hz). Seul, aucun souci.",
      "Pour jouer avec d'autres ou sur un enregistrement, repasse par Outils → Accordeur.",
    ] },
    { type: "recap", points: [
      "Case 5 d'une corde = corde suivante à vide, sauf de la corde 3 à la corde 2 : case 4.",
      "Cordes voisines : 5 demi-tons d'écart ; entre Sol et Si, seulement 4.",
      "Battements qui ralentissent puis disparaissent : les deux notes sont à l'unisson.",
    ] },
  ],
  quiz: ["q-debut-18", "q-debut-19", "q-debut-20", "q-debut-21"],
};

export const quiz = [
  {id:"q-debut-18",courseId:"debut",lessonId:"debut-c1-06",lvl:1,q:"Pour accorder la corde 5 (La) à l'oreille, quelle note de la corde 6 sers-tu de référence ?",o:["La case 3","La case 4","La case 5","La case 7"],a:2,exp:"Corde 6, case 5 = La, la même note que la corde 5 à vide. On compare les deux et on ajuste la corde 5.",xp:25},
  {id:"q-debut-19",courseId:"debut",lessonId:"debut-c1-06",lvl:1,q:"Quelle comparaison fait exception à la règle de la 5e case ?",o:["Corde 6 vers corde 5","Corde 5 vers corde 4","Corde 3 vers corde 2, à la case 4","Corde 2 vers corde 1"],a:2,exp:"Entre Sol (corde 3) et Si (corde 2), l'écart est de 4 demi-tons au lieu de 5 : on prend la case 4 de la corde 3.",xp:25},
  {id:"q-debut-20",courseId:"debut",lessonId:"debut-c1-06",lvl:2,q:"En comparant deux notes, tu entends une ondulation qui ralentit. Qu'est-ce que ça signifie ?",o:["Les deux notes se rapprochent de l'unisson","La corde va casser","Tu as pris la mauvaise case","La guitare a besoin de cordes neuves"],a:0,exp:"Ce sont les battements : plus deux notes sont proches, plus l'ondulation est lente. Quand elle disparaît, les notes sont à l'unisson.",xp:30},
  {id:"q-debut-21",courseId:"debut",lessonId:"debut-c1-06",lvl:2,q:"Combien de demi-tons séparent deux cordes voisines, hors du duo Sol–Si ?",o:["3","4","5","7"],a:2,exp:"5 demi-tons (une quarte juste), d'où la case 5. Entre Sol et Si, seulement 4 demi-tons (une tierce majeure), d'où la case 4.",xp:30},
];
