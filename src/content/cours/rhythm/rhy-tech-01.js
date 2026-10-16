// Leçon du module « rhythm » (Rythme & phrasing) + ses questions de quiz.
// Format « leçon en cartes » décrit dans src/content/README.md.
// Technique, 1 sur 4 : le bend juste (demi-ton, ton, relâché), dans la
// position 1 de la pentatonique (scales-c3-02, juste avant dans le palier).
// Rangée en rythme et non en impro : l'impro est gardée en fin de palier
// (MODULES_APPLICATION), ce qui la placerait après toutes les positions.

const TAB_VERIFIER = {
  type: "tab",
  caption: "La cible d'abord, puis le bend : case 9, puis case 7 tirée jusqu'à la 9",
  text: "Tab — corde 3 : case 9 (Mi), tenue deux temps ; puis case 7 tirée d'un ton jusqu'à la hauteur de la case 9, tenue deux temps. Deux fois.",
  data: { lines: [
    "e|----------------|----------------|",
    "B|----------------|----------------|",
    "G|9-------7b9-----|9-------7b9-----|",
    "D|----------------|----------------|",
    "A|----------------|----------------|",
    "E|----------------|----------------|",
  ] },
};

const TAB_RELACHE = {
  type: "tab",
  caption: "Demi-ton, ton, puis tiré-relâché sur les cordes 3 et 2",
  text: "Tab — corde 3 : case 7 tirée d'un demi-ton (hauteur de la case 8) ; case 7 tirée d'un ton jusqu'à la 9 puis relâchée vers la 7. Corde 2 : case 8 tirée jusqu'à la 10 puis relâchée vers la 8 ; enfin case 8 tirée jusqu'à la 10, tenue.",
  data: { lines: [
    "e|----------------|----------------|",
    "B|----------------|8b10r8--8b10----|",
    "G|7b8-----7b9r7---|----------------|",
    "D|----------------|----------------|",
    "A|----------------|----------------|",
    "E|----------------|----------------|",
  ] },
};

export default {
  id: "rhy-tech-01", level: 6,
  title: "Le bend juste",
  duration: 8,
  gropiTip: "Enregistre-toi : la case 9, puis ton bend depuis la case 7. À la réécoute, un bend un peu trop bas s'entend bien mieux que pendant que tu joues.",
  cartes: [
    { type: "idee", titre: "Tirer pour monter", texte: [
      "Un bend, c'est pousser la corde sur le côté pendant qu'elle sonne : elle se tend, la note monte.",
      "Un demi-ton monte à la hauteur de la case suivante, un ton à celle de deux cases plus loin. Dans une tab : 7b8 et 7b9.",
    ] },
    { type: "idee", titre: "Trois doigts pour un", texte: [
      "L'annulaire tire, le majeur et l'index sont posés derrière lui sur la même corde et poussent avec lui.",
      "Le pouce s'accroche au-dessus du manche ; la force vient du poignet qui tourne, comme une clé dans une serrure, pas des doigts seuls.",
    ] },
    { type: "question", quizId: "q-rhy-bend-02-tech" },
    { type: "idee", titre: "Vérifier la cible", texte: [
      "Un bend trop court sonne faux. Joue d'abord la note visée, la case 9 de la corde 3 : c'est Mi.",
      "Puis tire depuis la case 7 jusqu'à entendre exactement ce Mi. Ni moins, ni plus.",
    ], bloc: TAB_VERIFIER },
    { type: "a-toi", titre: "Le ton, vérifié",
      consigne: "Case 9, puis case 7 tirée jusqu'à la même hauteur, chacune deux temps au clic à 60. Compare les deux Mi à l'oreille. Deux minutes, en relâchant la main entre chaque bend.",
      bloc: TAB_VERIFIER, bpm: 60, minuteur: 120 },
    { type: "question", quizId: "q-rhy-bend-01-tech" },
    { type: "idee", titre: "Le demi-ton et le relâché", texte: [
      "7b8 sur la corde 3 monte de Ré à Ré# : la blue note, à peine tirée.",
      "7b9r7 : tu tires, tu tiens, puis tu ramènes la corde doucement en gardant la pression. La note redescend en sonnant, sans nouvelle attaque.",
    ], bloc: TAB_RELACHE },
    { type: "a-toi", titre: "Bend et relâché",
      consigne: "Joue la tab au clic à 60 : demi-ton, ton relâché, puis le même geste sur la corde 2, case 8. Vérifie de temps en temps la cible en jouant la case 10.",
      bloc: TAB_RELACHE, bpm: 60, minuteur: 90 },
    { type: "question", quizId: "q-rhy-bend-03-tech" },
    { type: "recap", points: [
      "Demi-ton = hauteur de la case suivante, ton = deux cases plus loin.",
      "Trois doigts sur la corde, pouce au-dessus du manche, rotation du poignet.",
      "Joue la cible avant de tirer ; au relâché, garde la pression jusqu'en bas.",
    ] },
  ],
  quiz: ["q-rhy-bend-01-tech", "q-rhy-bend-02-tech", "q-rhy-bend-03-tech", "q-debut-48"],
};

export const quiz = [
  {id:"q-rhy-bend-01-tech",courseId:"rhythm",lessonId:"rhy-tech-01",lvl:2,q:"Tu veux tirer la corde 3 de la case 7 jusqu'à la hauteur de la case 9. Comment vérifier que ton bend est juste ?",o:["Jouer la case 9, puis tirer jusqu'à ce son","Tirer jusqu'à ce que la corde résiste","Regarder la corde arriver sur la case 9","Tirer très vite pour cacher l'écart"],a:0,exp:"La note visée (Mi, case 9) sert de repère à l'oreille : on la joue, puis on tire depuis la case 7 jusqu'à l'entendre exactement.",xp:30},
  {id:"q-rhy-bend-02-tech",courseId:"rhythm",lessonId:"rhy-tech-01",lvl:1,q:"Bend d'un ton à l'annulaire : que font l'index et le majeur ?",o:["Ils poussent avec lui, sur la même corde","Ils étouffent les cordes plus graves","Ils restent levés, loin du manche","Ils tiennent une note sur la corde voisine"],a:0,exp:"Trois doigts sur la même corde poussent plus fort et plus juste qu'un seul. Le pouce, accroché au-dessus du manche, sert de pivot.",xp:25},
  {id:"q-rhy-bend-03-tech",courseId:"rhythm",lessonId:"rhy-tech-01",lvl:1,q:"Dans une tab, 7b8 sur la corde 3 te demande de monter de…",o:["Un demi-ton","Un ton","Un ton et demi","Deux tons"],a:0,exp:"Une case d'écart = un demi-ton : la case 7 (Ré) tirée jusqu'à la hauteur de la case 8 (Ré#).",xp:25},
];
