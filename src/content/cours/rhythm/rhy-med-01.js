// Leçon du module « rhythm » + les questions de quiz qui s'y rattachent.
// Format « leçon en cartes » décrit dans src/content/README.md.
// Le médiator alterné sur une corde : le pendule de rhy-c4-01, note à note,
// au clic de 60 à 90 BPM.

const PENDULE = { type: "strum_pattern", caption: "8 croches : aller sur les chiffres, retour sur les « et »", data: { pattern: ["B", "H", "B", "H", "B", "H", "B", "H"], beats: 4, style: "folk", bpm: 60 } };
const TAB_CORDE_1 = {
  type: "tab",
  caption: "Une corde, huit croches par mesure : aller, retour, aller, retour…",
  text: "Tab — corde 1 : huit fois 0 (Mi à vide), puis quatre fois case 1 et quatre fois case 3. Aller sur chaque temps, retour sur chaque « et ».",
  data: { lines: [
    "e|0-0-0-0-0-0-0-0-|1-1-1-1-3-3-3-3-|",
    "B|----------------|----------------|",
    "G|----------------|----------------|",
    "D|----------------|----------------|",
    "A|----------------|----------------|",
    "E|----------------|----------------|",
  ] },
};

export default {
  id: "rhy-med-01", level: 3,
  title: "Le médiator alterné : aller, retour",
  duration: 8,
  gropiTip: "Pose l'auriculaire droit ou le tranchant de la main près du chevalet pendant l'exercice, sans t'appuyer : ce petit repère garde le médiator à la même hauteur au-dessus de la corde.",
  cartes: [
    { type: "idee", titre: "Une note en bas, la suivante en haut", texte: [
      "Le médiator alterné, c'est le pendule du grattage appliqué à une seule corde : un aller vers le sol, un retour vers le plafond.",
      "Aucun geste perdu : c'est ce qui permet de jouer vite et régulier.",
    ] },
    { type: "idee", titre: "Le geste", texte: [
      "Tiens le médiator entre le pouce et le côté de l'index, avec 2 à 3 mm de pointe qui dépassent.",
      "Le mouvement vient du poignet, petit et souple, pas du coude. Après l'attaque, le médiator ne s'éloigne que de quelques millimètres de la corde.",
    ] },
    { type: "question", quizId: "q-rhy-med-new-01" },
    { type: "idee", titre: "Le rythme décide du sens", texte: [
      "Au clic, deux notes par temps : aller sur « 1, 2, 3, 4 », retour sur chaque « et ».",
      "Même quand la note se répète ou change de case, le sens du médiator suit le rythme, jamais la mélodie.",
    ], bloc: PENDULE },
    { type: "a-toi", titre: "Corde 1, au clic à 60",
      consigne: "Huit croches sur la corde 1 à vide, puis quatre en case 1 et quatre en case 3, toujours aller-retour. Quand c'est propre quatre fois de suite, passe à la carte suivante.",
      bloc: TAB_CORDE_1, bpm: 60 },
    { type: "question", quizId: "q-rhy-med-new-02" },
    { type: "idee", titre: "De 60 à 90, sans tricher", texte: [
      "Monte le tempo par paliers de 5 BPM, avec le Métronome des Outils. Un palier est validé quand tu le joues propre quatre fois de suite, sans te crisper.",
      "Ça accroche ? Redescends d'un cran : la vitesse vient de la régularité, pas de l'effort.",
    ] },
    { type: "a-toi", titre: "Le défi des 90",
      consigne: "Même tab, à 90. Deux minutes : tiens le plus longtemps possible sans casser l'alternance. Trop rapide aujourd'hui ? Note ton meilleur tempo propre : c'est ton point de départ de demain.",
      bloc: TAB_CORDE_1, bpm: 90, minuteur: 120 },
    { type: "question", quizId: "q-rhy-med-new-03" },
    { type: "recap", points: [
      "Aller sur les temps, retour sur les « et » : le rythme décide du sens du médiator.",
      "Petit geste du poignet, pointe courte, médiator toujours près de la corde.",
      "On monte de 5 BPM après quatre passages propres, et on redescend si ça accroche.",
    ] },
  ],
  quiz: ["q-rhy-med-new-01", "q-rhy-med-new-02", "q-rhy-med-new-03"],
};

export const quiz = [
  {id:"q-rhy-med-new-01",courseId:"rhythm",lessonId:"rhy-med-01",lvl:1,q:"En médiator alterné, d'où vient surtout le mouvement ?",o:["Du poignet","Du coude","De l'épaule","Des doigts"],a:0,exp:"Un petit mouvement souple du poignet : le coude et l'épaule donnent un geste trop ample et trop lent.",xp:25},
  {id:"q-rhy-med-new-02",courseId:"rhythm",lessonId:"rhy-med-01",lvl:1,q:"Tu joues huit croches par mesure au clic. Sur quels comptes vas-tu vers le haut ?",o:["Sur les « et »","Sur les chiffres","Sur les temps 2 et 4","Sur les temps 1 et 3"],a:0,exp:"L'aller tombe sur chaque temps (1, 2, 3, 4), le retour sur chaque « et » entre les temps.",xp:25},
  {id:"q-rhy-med-new-03",courseId:"rhythm",lessonId:"rhy-med-01",lvl:2,q:"À 80 BPM, tes croches deviennent brouillonnes. Que fais-tu ?",o:["Tu redescends à 75","Tu montes à 90","Tu joues tout vers le bas","Tu serres le médiator"],a:0,exp:"On redescend d'un cran jusqu'au tempo où tout est propre. Serrer ou forcer ne fait que crisper la main.",xp:30},
];
