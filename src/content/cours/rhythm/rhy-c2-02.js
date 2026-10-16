// Leçon du module « rhythm » + les questions de quiz qui s'y rattachent.
// Format « leçon en cartes » décrit dans src/content/README.md.

const DOUBLES = {
  type: "strum_pattern",
  caption: "Balancier en doubles-croches — bas sur le chiffre et le « et », haut sur le « e » et le « a »",
  data: { pattern: ["B","H","B","H","B","H","B","H","B","H","B","H","B","H","B","H"], beats: 4, style: "funk", bpm: 60 },
};

export default {
  id: "rhy-c2-02", level: 4,
  title: "Croches et doubles-croches",
  duration: 8,
  gropiTip: "Dis les syllabes à voix haute avant de jouer : « 1 e et a » à 60 BPM. Ta main descend sur le chiffre et le « et », remonte sur le « e » et le « a ». Toujours dans cet ordre.",
  cartes: [
    { type: "idee", titre: "La croche : un demi-temps", texte: [
      "La croche vaut la moitié d'une noire : 8 par mesure de 4/4.",
      "On compte « 1 et 2 et 3 et 4 et » : les chiffres tombent sur les temps, les « et » entre eux, sur les contretemps.",
    ], bloc: {
      type: "rhythm_grid",
      caption: "1 mesure de croches en 4/4",
      data: {
        beats: 4, subdivision: 8,
        accents: [0, 2, 4, 6],
        label: "1 · et · 2 · et · 3 · et · 4 · et",
      },
    } },
    { type: "question", quizId: "q-rhy-01" },
    { type: "idee", titre: "La double-croche : un quart de temps", texte: [
      "La moitié d'une croche : 16 par mesure. On compte « 1 e et a, 2 e et a… ».",
      "Chaque syllabe nomme un emplacement : c'est ce qui permet de placer une note exactement où tu veux.",
    ], bloc: {
      type: "rhythm_grid",
      caption: "1 mesure de doubles-croches en 4/4",
      data: {
        beats: 4, subdivision: 16,
        accents: [0, 4, 8, 12],
        label: "1 e et a · 2 e et a · 3 e et a · 4 e et a",
      },
    } },
    { type: "question", quizId: "q-rhy-17" },
    { type: "idee", titre: "Le balancier en croches", texte: [
      "Bas sur chaque chiffre, haut sur chaque « et ». Les coups hauts comptent autant que les bas.",
      "Travaille-le à 60 BPM sur La mineur jusqu'à une régularité parfaite : c'est la base du rock et de la pop.",
    ] },
    { type: "idee", titre: "Le balancier en doubles-croches", texte: [
      "Base du funk : 16 allers-retours par mesure, un balancier deux fois plus rapide.",
      "On ne touche les cordes qu'aux coups choisis ; le mouvement, lui, ne s'arrête jamais, comme un essuie-glace.",
    ], bloc: DOUBLES },
    { type: "question", quizId: "q-rhy-02" },
    { type: "a-toi", titre: "Noires, croches, doubles",
      consigne: "Sur La mineur, au clic : 2 mesures de noires, 2 de croches, 2 de doubles-croches, puis le chemin inverse, sans t'arrêter. Compte à voix haute : « 1, 2… », « 1 et… », « 1 e et a… ».",
      bloc: DOUBLES, bpm: 70 },
    { type: "question", quizId: "q-rhy-18" },
    { type: "recap", points: [
      "Croche = un demi-temps (8 par mesure), double-croche = un quart (16).",
      "On compte « 1 et » en croches, « 1 e et a » en doubles.",
      "Le balancier ne s'arrête jamais : on choisit seulement quand toucher.",
    ] },
  ],
  quiz: ["q-rhy-01","q-rhy-02","q-rhy-16","q-rhy-17","q-rhy-18"],
};

export const quiz = [
  {id:"q-rhy-01",courseId:"rhythm",lessonId:"rhy-c2-02",lvl:1,q:"Une mesure à 4/4 contient combien de croches ?",o:["4","8","6","16"],a:1,exp:"4/4 = 4 noires par mesure. 1 noire = 2 croches. Donc 8 croches par mesure de 4/4.",xp:25},
  {id:"q-rhy-02",courseId:"rhythm",lessonId:"rhy-c2-02",lvl:2,q:"Combien de doubles-croches dans une mesure de 4/4 ?",o:["8","12","16","24"],a:2,exp:"4/4 = 4 noires. 1 noire = 4 doubles-croches. Donc 16 doubles-croches par mesure.",xp:30},
  {id:"q-rhy-16",courseId:"rhythm",lessonId:"rhy-c2-02",lvl:1,q:"Une croche dure combien par rapport à une noire ?",o:["Le double","La moitié","Le quart","La même chose"],a:1,exp:"Chaque valeur vaut la moitié de la précédente : ronde, blanche, noire, croche, double-croche. Deux croches remplissent exactement un temps en 4/4.",xp:25},
  {id:"q-rhy-17",courseId:"rhythm",lessonId:"rhy-c2-02",lvl:2,q:"Comment compte-t-on à voix haute une mesure de doubles-croches ?",o:["1-et, 2-et, 3-et, 4-et", "1-2-3-4, en accélérant", "1-e-et-a, 2-e-et-a…", "1-2-3, 1-2-3, 1-2-3"],a:2,exp:"Quatre syllabes par temps, une par double-croche. Ce comptage n'est pas décoratif : il donne un nom à chaque emplacement, et c'est ce qui permet de placer une note exactement où tu veux.",xp:30},
  {id:"q-rhy-18",courseId:"rhythm",lessonId:"rhy-c2-02",lvl:3,q:"Une croche pointée suivie d'une double-croche occupe…",o:["Deux temps, soit la moitié d'une mesure","Un temps et demi, comme la blanche pointée","Un demi-temps, comme deux doubles-croches","Un temps, découpé en trois quarts puis un quart"],a:3,exp:"Le point ajoute la moitié de la valeur : la croche pointée vaut trois doubles-croches, la double qui suit en vaut une. Total : un temps. C'est le rythme de base du rock des années 50 et de quantité de riffs.",xp:40},
];
