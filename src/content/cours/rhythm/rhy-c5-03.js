// Leçon du module « rhythm » + les questions de quiz qui s'y rattachent.
// Format « leçon en cartes » décrit dans src/content/README.md.

export default {
  id: "rhy-c5-03", level: 8,
  title: "Funk : les 16e notes et les ghost notes",
  duration: 10,
  gropiTip: "Commence ta séance funk sans accord : étouffe toutes les cordes de la main gauche et joue 16 doubles-croches par mesure à 70 BPM. Quand le flux est régulier, ajoute un seul accent sur le 1.",
  cartes: [
    { type: "idee", titre: "La guitare-batterie", texte: [
      "En funk, la guitare rythmique joue presque comme une batterie : chaque coup, chaque silence est une pièce du groove.",
      "L'harmonie compte moins que le placement. Des accords courts, sur deux à quatre cordes, suffisent.",
    ] },
    { type: "idee", titre: "Le flux de 16e", texte: [
      "Chaque temps se découpe en quatre : « 1 e et a, 2 e et a… ». La main droite descend sur le chiffre et le « et », remonte sur le « e » et le « a ».",
      "Ce va-et-vient ne s'arrête jamais, même quand rien ne doit sonner.",
    ] },
    { type: "question", quizId: "q-rhy-10" },
    { type: "idee", titre: "Les ghost notes", texte: [
      "La main gauche reste posée sur l'accord sans appuyer : le médiator ne tire qu'un « tchk » sourd, sans hauteur.",
      "Ces ghost notes ne sont pas là pour l'harmonie. Elles tiennent le flux et donnent sa texture au groove.",
    ] },
    { type: "idee", titre: "Accents et ghosts", texte: [
      "Le groove naît du choix : sur les 16 cases, quelques-unes sonnent (main gauche qui appuie), les autres restent étouffées.",
      "Le 1 est presque toujours marqué : c'est l'ancre autour de laquelle tout le reste se syncope.",
    ], bloc: {
      type: "rhythm_grid",
      caption: "Pattern funk 16e — accents (orange) vs ghost notes (gris) sur 1 mesure",
      data: {
        beats: 4, subdivision: 16,
        highlights: [0, 2, 6, 8, 14],
        muted: [1, 3, 4, 5, 7, 9, 10, 11, 12, 13, 15],
        label: "1 · e · et · a · 2 · e · et · a · 3 · e · et · a · 4 · e · et · a",
      },
    } },
    { type: "question", quizId: "q-rhy-p89-c503-02" },
    { type: "a-toi", titre: "Le pattern au clic",
      consigne: "Prends Am7 en barré case 5, sur les quatre cordes aiguës. Étape 1 : main gauche posée sans appuyer, quatre coups par clic, bas-haut sans arrêt. Étape 2 : appuie seulement sur les flèches du schéma, ghost notes partout ailleurs. Monte le tempo quand la main droite ne s'arrête plus.",
      bloc: {
        type: "strum_pattern",
        caption: "Le même pattern à la main droite — accents sur 1, et-1, et-2, 3, et-4 (tous en bas), ghost notes (×) ailleurs",
        data: { pattern: ["B", "x", "B", "x", "x", "x", "B", "x", "B", "x", "x", "x", "x", "x", "B", "x"], beats: 4, style: "funk", bpm: 95 },
      }, bpm: 70, minuteur: 180 },
    { type: "idee", titre: "Le son funk", texte: [
      "Un son clair, un peu de compression, pas de distorsion : elle gomme les ghost notes et noie le groove.",
      "Des accords de 7e et de 9e (m7, 7, 9) dans l'aigu du manche, sur peu de cordes. Une pédale wah, ouverte sur les accents, est une couleur classique mais pas obligatoire.",
    ] },
    { type: "question", quizId: "q-rhy-38" },
    { type: "recap", points: [
      "Main droite en 16e continues : bas sur le chiffre et le « et », haut sur « e » et « a ».",
      "Ghost note = main gauche posée sans appuyer ; accent = main gauche qui appuie.",
      "Le 1 marqué, des accents choisis, un son clair et court : c'est le groove.",
    ] },
  ],
  quiz: ["q-rhy-10","q-rhy-38","q-rhy-07","q-rhy-p89-c503-01","q-rhy-p89-c503-02"],
};

export const quiz = [
  {id:"q-rhy-10",courseId:"rhythm",lessonId:"rhy-c5-03",lvl:3,q:"En funk, la main droite reste continue en doubles-croches même quand on ne 'joue' pas. Pourquoi ?",o:["Pour pouvoir jouer plus vite", "Pour économiser son énergie sur la durée", "Pour garder le groove et le timing", "Par simple convention historique du funk"],a:2,exp:"Main droite continue D-U-D-U... = ghost notes étouffées entre les accents. Maintient le 'pulse' rythmique régulier, crée le groove.",xp:55},
  {id:"q-rhy-38",courseId:"rhythm",lessonId:"rhy-c5-03",lvl:3,q:"En funk, le temps 1 est le plus souvent…",o:["Purement et simplement ignoré","Systématiquement joué en ghost note","Joué deux fois de suite pour l'appuyer","Le point d'ancrage le plus marqué de la mesure"],a:3,exp:"Le funk repose sur un temps 1 très affirmé — « the One » — autour duquel tout le reste peut se syncoper. Sans ce point fixe, la syncope n'a plus de référence et le groove se dissout.",xp:40},
  {id:"q-rhy-p89-c503-01",courseId:"rhythm",lessonId:"rhy-c5-03",lvl:2,q:"Sur une ghost note funk, que fait la main gauche ?",o:["Elle reste posée sans appuyer","Elle appuie l'accord à fond","Elle quitte complètement le manche","Elle glisse d'une case vers l'aigu"],a:0,exp:"Posée sur les cordes sans les enfoncer, la main gauche les étouffe : le médiator ne tire qu'un « tchk » sans hauteur. Lâcher le manche ferait sonner les cordes à vide.",xp:35},
  {id:"q-rhy-p89-c503-02",courseId:"rhythm",lessonId:"rhy-c5-03",lvl:3,q:"En 16e continues, dans quel sens joues-tu un accent placé sur le « a » du 2 ?",o:["Vers le haut","Vers le bas","Vers le bas, puis vers le haut","Au choix, selon le confort"],a:0,exp:"La main descend sur le chiffre et le « et », remonte sur le « e » et le « a ». Le « a » est donc toujours un coup vers le haut : garder ce va-et-vient fixe place chaque accent sans réfléchir.",xp:45},
];
