// Leçon du module « debut » + les questions de quiz qui s'y rattachent.
// Format « leçon en cartes » décrit dans src/content/README.md.

const PASSE_PARTOUT = { type: "strum_pattern", caption: "Bas, bas-haut, haut-bas-haut — la main ne s'arrête jamais", data: { pattern: ["B", "-", "B", "H", "-", "H", "B", "H"], beats: 4, style: "folk", bpm: 70 } };

export default {
  id: "debut-c2-05", level: 0, unite: 2,
  title: "Tes premières rythmiques",
  duration: 7,
  gropiTip: "Exercice muet : pose la main gauche à plat sur les cordes, sans appuyer, et joue la rythmique passe-partout. Sans les notes, tu n'entends plus que le rythme : idéal pour vérifier ton balancier.",
  cartes: [
    { type: "idee", titre: "Faire danser les accords", texte: [
      "Un accord, c'est une couleur ; la rythmique le fait danser.",
      "On reste sur un seul accord, Mi mineur, pour que la main gauche se fasse oublier.",
    ] },
    { type: "a-toi", titre: "Rythmique 1 : quatre coups vers le bas", consigne: "Un coup vers le bas sur chaque temps, en disant « 1, 2, 3, 4 » à voix haute. Lance le clic et reste régulier, sans accélérer. Simple, mais c'est la base de tout.", bloc: { type: "strum_pattern", caption: "4 noires vers le bas — compte « 1, 2, 3, 4 »", data: { pattern: ["B", "B", "B", "B"], beats: 4, style: "folk", bpm: 60 } }, bpm: 60 },
    { type: "idee", titre: "Rythmique 2 : bas-haut", texte: [
      "On ajoute un coup vers le haut entre les temps. Compte « 1 et 2 et 3 et 4 et » : vers le bas sur les chiffres, vers le haut sur les « et ».",
      "Le coup vers le haut peut ne toucher que les cordes aiguës : c'est normal.",
    ], bloc: { type: "strum_pattern", caption: "8 croches — bas sur les temps, haut sur les « et »", data: { pattern: ["B", "H", "B", "H", "B", "H", "B", "H"], beats: 4, style: "folk", bpm: 60 } } },
    { type: "question", quizId: "q-debut-36-app" },
    { type: "idee", titre: "La rythmique passe-partout", texte: [
      "Bas, bas-haut, haut-bas-haut : une des rythmiques les plus utilisées en pop et en folk.",
      "Le secret : ta main garde le balancier de la rythmique 2, mais passe dans le vide sur le « et » du 1 et sur le temps 3.",
    ], bloc: PASSE_PARTOUT },
    { type: "question", quizId: "q-debut-37" },
    { type: "idee", titre: "Le balancier ne s'arrête jamais", texte: [
      "Ta main droite est un pendule : elle descend sur les temps et remonte sur les « et », qu'elle touche les cordes ou non.",
      "Si elle s'arrête pour « attendre », tu perds le rythme.",
    ] },
    { type: "a-toi", titre: "La passe-partout au clic", consigne: "Joue la passe-partout sur Mi mineur pendant une minute, sans t'arrêter, avec le clic à 60 BPM. Quand c'est fluide, essaie à 70. Ensuite, change d'accord toutes les deux mesures.", bloc: PASSE_PARTOUT, bpm: 60, minuteur: 60 },
    { type: "question", quizId: "q-debut-38" },
    { type: "recap", points: [
      "Bas sur les temps, haut sur les « et ».",
      "La passe-partout : bas, bas-haut, haut-bas-haut.",
      "Le balancier ne s'arrête jamais : on rate les cordes, on ne s'arrête pas.",
    ] },
  ],
  quiz: ["q-debut-36", "q-debut-37", "q-debut-38", "q-debut-36-app"],
};

export const quiz = [
  {id:"q-debut-36",courseId:"debut",lessonId:"debut-c2-05",lvl:1,q:"En comptant « 1 et 2 et 3 et 4 et », quand grattes-tu vers le haut ?",o:["Sur les chiffres","Sur les « et »","Seulement sur le 1","Jamais, on gratte toujours vers le bas"],a:1,exp:"Bas sur les temps (les chiffres), haut sur les « et ». C'est le mouvement de balancier de base de la main droite.",xp:25},
  {id:"q-debut-36-app",courseId:"debut",lessonId:"debut-c2-05",lvl:1,q:"En bas-haut, tu comptes « 1 et 2 et 3 et 4 et ». Combien de coups vers le haut joues-tu par mesure ?",o:["Quatre","Huit","Deux","Un seul"],a:0,exp:"Un coup vers le haut sur chaque « et », et la mesure compte quatre « et » : quatre coups vers le haut, glissés entre les quatre coups vers le bas.",xp:25},
  {id:"q-debut-37",courseId:"debut",lessonId:"debut-c2-05",lvl:2,q:"Dans la rythmique bas, bas-haut, haut-bas-haut, que fait la main sur le temps 3 ?",o:["Elle s'arrête et attend","Elle descend sans toucher les cordes","Elle gratte deux fois","Elle étouffe les cordes avec la paume"],a:1,exp:"Le balancier continue : la main descend sur le 3 comme d'habitude, mais passe dans le vide. C'est ce qui garde le rythme régulier.",xp:30},
  {id:"q-debut-38",courseId:"debut",lessonId:"debut-c2-05",lvl:1,q:"À quel tempo travailler une nouvelle rythmique ?",o:["Le plus vite possible","Lentement, vers 60 à 70 BPM, puis accélérer","Au tempo de la chanson originale, tout de suite","Sans métronome, au feeling"],a:1,exp:"Lentement et régulièrement d'abord. La vitesse vient toute seule quand le geste est fluide ; l'inverse ne marche pas.",xp:25},
];
