// Leçon du module « rhythm » + les questions de quiz qui s'y rattachent.
// Format « leçon en cartes » décrit dans src/content/README.md.
// Changer de corde en gardant le médiator alterné (suite de rhy-med-01) :
// passage par l'extérieur ou par l'intérieur de la paire de cordes.

const TAB_EXTERIEUR = {
  type: "tab",
  caption: "Cordes 3 et 2 à vide : aller sur la corde 3, retour sur la corde 2",
  text: "Tab — en croches : corde 3 à vide (Sol), corde 2 à vide (Si), quatre fois. Aller sur la corde 3, retour sur la corde 2.",
  data: { lines: [
    "e|----------------|",
    "B|--0---0---0---0-|",
    "G|0---0---0---0---|",
    "D|----------------|",
    "A|----------------|",
    "E|----------------|",
  ] },
};
const TAB_TROIS_CORDES = {
  type: "tab",
  caption: "Trois cordes en croches : Sol, Si, Mi, Si… puis Sol, Do, Mi, Do",
  text: "Tab — mesure 1 : corde 3 à vide, corde 2 à vide, corde 1 à vide, corde 2 à vide, deux fois. Mesure 2 : pareil avec la corde 2 en case 1 (Do). Médiator toujours alterné.",
  data: { lines: [
    "e|----0-------0---|----0-------0---|",
    "B|--0---0---0---0-|--1---1---1---1-|",
    "G|0-------0-------|0-------0-------|",
    "D|----------------|----------------|",
    "A|----------------|----------------|",
    "E|----------------|----------------|",
  ] },
};

export default {
  id: "rhy-med-02", level: 4,
  title: "Changer de corde au médiator",
  duration: 8,
  gropiTip: "Filme ta main droite au ralenti avec ton téléphone : tu verras tout de suite si le médiator fait un grand détour pour enjamber une corde. Le bon geste ressemble à un petit arc, pas à un saut.",
  cartes: [
    { type: "idee", titre: "Le vrai piège : changer de corde", texte: [
      "Sur une seule corde, l'aller-retour roule tout seul. Dès que la mélodie change de corde, le médiator doit enjamber une corde ou se glisser entre deux.",
      "Garde l'alternance quoi qu'il arrive : c'est la trajectoire qui s'adapte, pas le sens du coup.",
    ] },
    { type: "idee", titre: "Par l'extérieur", texte: [
      "Aller sur la corde 3, retour sur la corde 2 : chaque corde est attaquée depuis l'extérieur de la paire. Le médiator enjambe une corde à chaque changement.",
    ], bloc: TAB_EXTERIEUR },
    { type: "idee", titre: "Par l'intérieur", texte: [
      "Commence maintenant par un retour sur la corde 3, puis un aller sur la corde 2. Le médiator attaque depuis l'espace entre les deux cordes : il reste « coincé » au milieu.",
      "Les deux sensations sont différentes : travaille les deux, la mélodie ne te laissera pas choisir.",
    ] },
    { type: "question", quizId: "q-rhy-corde-new-01" },
    { type: "idee", titre: "Des gestes petits", texte: [
      "Moins la pointe du médiator dépasse de la corde, moins elle a de chemin pour l'enjamber. Garde le poignet souple et le geste court.",
      "Quand tu passes vers les cordes aiguës, l'avant-bras glisse un peu avec la main : ne l'étire pas.",
    ] },
    { type: "a-toi", titre: "Trois cordes, sans casser l'alternance",
      consigne: "Sol, Si, Mi, Si… puis Sol, Do, Mi, Do. Aller, retour, sans jamais deux coups dans le même sens : tu passes tour à tour par l'extérieur et par l'intérieur. Au clic à 60.",
      bloc: TAB_TROIS_CORDES, bpm: 60, minuteur: 120 },
    { type: "question", quizId: "q-rhy-corde-new-02" },
    { type: "idee", titre: "Quand ça accroche", texte: [
      "Repère les deux notes qui coincent, souvent un changement de corde précis. Joue-les seules, en boucle, dix fois, plus lentement.",
      "Puis remets-les dans la phrase complète.",
    ] },
    { type: "question", quizId: "q-rhy-corde-new-03" },
    { type: "recap", points: [
      "L'alternance ne s'arrête jamais : le médiator adapte sa trajectoire, pas son sens.",
      "Par l'extérieur : il enjambe une corde ; par l'intérieur : il attaque depuis l'espace entre les deux.",
      "Un changement qui coince se travaille seul, lentement, en boucle.",
    ] },
  ],
  quiz: ["q-rhy-corde-new-01", "q-rhy-corde-new-02", "q-rhy-corde-new-03"],
};

export const quiz = [
  {id:"q-rhy-corde-new-01",courseId:"rhythm",lessonId:"rhy-med-02",lvl:2,q:"Retour sur la corde 3, puis aller sur la corde 2 : comment passe le médiator ?",o:["Par l'intérieur","Par l'extérieur","En balayage","En aller simple"],a:0,exp:"Les deux attaques partent de l'espace entre les cordes 3 et 2 : c'est le passage par l'intérieur.",xp:30},
  {id:"q-rhy-corde-new-02",courseId:"rhythm",lessonId:"rhy-med-02",lvl:2,q:"En croches, ta mélodie change de corde sur un « et ». Quel coup joues-tu ?",o:["Un retour, comme prévu","Un aller, pour la corde neuve","Deux allers d'affilée","Celui qui te paraît facile"],a:0,exp:"Le « et » est toujours un retour : on garde l'alternance, même au changement de corde.",xp:30},
  {id:"q-rhy-corde-new-03",courseId:"rhythm",lessonId:"rhy-med-02",lvl:1,q:"À 70 BPM, ton passage de la corde 3 à la corde 2 accroche. Que travailles-tu ?",o:["Ces deux notes en boucle, plus lentement","Tout l'exercice, un peu plus vite","Le passage, mais tout vers le bas","Un autre exercice, pour oublier"],a:0,exp:"On isole le changement qui coince et on le répète lentement, puis on le remet dans la phrase.",xp:25},
];
