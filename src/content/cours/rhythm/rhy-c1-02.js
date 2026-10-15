// Leçon du module « rhythm » + les questions de quiz qui s'y rattachent.
// Format décrit dans src/content/README.md.

export default {
  id: "rhy-c1-02", level: 2,
  title: "La mesure à 4/4 : le temps de référence",
  duration: 9,
  gropiTip: "Quand tu grattes en 4/4, appuie un peu plus le coup du temps 1 que les trois autres. Ton oreille apprend à repérer le début de chaque mesure, et tu ne te perds plus dans la grille.",
  content: [
    { type: "p", text: "La mesure est la façon dont on organise la pulsation en groupes réguliers. La mesure la plus courante en musique populaire est le 4/4 : 4 temps par mesure, la noire comme unité de temps. Comprendre le 4/4, c'est comprendre le cadre rythmique de la majeure partie de la musique que tu écoutes." },
    { type: "h", text: "Lire une signature rythmique" },
    { type: "p", text: "La signature rythmique (ou 'chiffrage de mesure') s'écrit sous forme de fraction. Le chiffre du HAUT indique le nombre de temps par mesure. Le chiffre du BAS indique quelle valeur de note représente 1 temps. 4/4 = 4 temps par mesure, 1 noire = 1 temps. 3/4 = 3 temps par mesure (valse). 6/8 = 6 croches par mesure (2 groupes de 3)." },
    { type: "h", text: "Le 4/4 : pourquoi cette domination ?" },
    { type: "p", text: "Le 4/4 est la signature la plus 'naturelle' pour le corps humain : elle correspond à la marche (gauche-droite-gauche-droite = 4 temps), aux battements du cœur en repos, et à la façon dont notre cerveau groupe instinctivement les pulsations par 4. La quasi-totalité du rock, du pop, du blues, du jazz, du R&B est en 4/4." },
    { type: "h", text: "Les temps forts et faibles" },
    { type: "p", text: "Dans une mesure de 4/4, les 4 temps n'ont pas le même poids. Les temps 1 et 3 sont des 'temps forts' : ils portent naturellement l'accent. Les temps 2 et 4 sont des 'temps faibles'. En rock et pop, la caisse claire frappe souvent sur les temps 2 et 4 (ce qui 'renverse' les accents et crée le groove moderne). En jazz, le pied de grosse caisse marque souvent le 1." },
    {
      type: "rhythm_grid",
      caption: "4/4 en noires — temps forts (1+3) vs temps faibles (2+4)",
      data: {
        beats: 4, subdivision: 4,
        accents: [0, 2],
        label: "1 fort · 2 faible · 3 fort · 4 faible",
      },
    },
    {
      type: "rhythm_grid",
      caption: "4/4 en croches — 1 et 2 et 3 et 4 et",
      data: {
        beats: 4, subdivision: 8,
        accents: [0, 2, 4, 6],
        label: "1 · et · 2 · et · 3 · et · 4 · et",
      },
    },
    { type: "h", text: "Compter les mesures" },
    { type: "p", text: "Pour s'y retrouver dans une chanson, on compte les temps et les mesures. 'Un-deux-trois-quatre | Un-deux-trois-quatre | ...' Chaque groupe de 4 = une mesure. Les chansons pop sont généralement organisées en multiples de 4 mesures : intro de 4 ou 8 mesures, couplet de 8 ou 16 mesures, refrain de 4 ou 8, etc. Cette régularité de 4 facilite l'apprentissage et la mémorisation." },
    { type: "h", text: "Les autres mesures importantes" },
    { type: "p", text: "3/4 (valse) : 3 temps par mesure. Accent sur le 1. Son 'tourbillonnant'. 'My Favorite Things' (Coltrane), les valses de Chopin. 6/8 : 6 croches par mesure, souvent ressenti en 2 groupes de 3. Folk irlandais, certaines ballades. 12/8 : 12 croches par mesure, ressenti en 4 groupes de 3. Slow blues (SRV), gospel. 5/4 : 5 temps par mesure. 'Take Five' (Dave Brubeck), 'Money' (Pink Floyd)." },
    { type: "h", text: "La 'grille' : structure d'une chanson" },
    { type: "p", text: "En musique jazz et blues, on parle de 'grille' pour désigner la structure harmonique et rythmique complète d'un morceau (nombre de mesures, accords par mesure). Le blues à 12 mesures = une grille de 12 mesures en 4/4. Un couplet pop de 8 mesures = une grille de 8 mesures. Connaître la grille = savoir où on est dans le morceau à tout moment." },
    { type: "ref", text: "'Money' (Pink Floyd, 1973) est en 7/4 — 7 temps par mesure. La ligne de basse iconique (7 notes) est la signature de la mesure. En live, les musiciens doivent compter constamment pour ne pas se perdre. C'est le contraste avec le 4/4 habituel qui rend ce morceau si particulier. Écoute-le en comptant 1-2-3-4-5-6-7 : tu sentiras l'asymétrie." },
    { type: "tip", text: "Drill : mets un métronome à 80 BPM et compte les mesures à voix haute pendant 2 minutes. '1-2-3-4, 2-2-3-4, 3-2-3-4...' (numéro de mesure + numéro de temps). Simple mais révélateur : combien de mesures perdent leur numéro ? Développe ce comptage instinctif." },
  ],
  quiz: ["q-base-14","q-rhy-29","q-rhy-30"],
};

export const quiz = [
  {id:"q-base-14",courseId:"rhythm",lessonId:"rhy-c1-02",lvl:1,q:"Dans une signature en 4/4, que représente le chiffre du haut ?",o:["La durée de chaque note dans la mesure", "Le nombre de temps par mesure", "Le tempo, en battements par minute", "Le nombre de mesures du morceau"],a:1,exp:"Le chiffre du haut donne le nombre de temps par mesure, celui du bas l'unité de temps (4 = la noire).",xp:30},
  {id:"q-rhy-29",courseId:"rhythm",lessonId:"rhy-c1-02",lvl:2,q:"Dans une signature 4/4, que signifie le chiffre du bas ?",o:["Le nombre de mesures du morceau","Le tempo auquel jouer","L'unité de temps : la noire","Le nombre de cordes à gratter"],a:2,exp:"Le haut dit combien de temps par mesure, le bas dit quelle valeur vaut un temps — 4 désigne la noire. En 6/8, le 8 désigne la croche, et tout le comptage change.",xp:30},
  {id:"q-rhy-30",courseId:"rhythm",lessonId:"rhy-c1-02",lvl:3,q:"Pourquoi le 4/4 est-il parfois noté d'un simple C ?",o:["Pour « croche », qui serait l'unité de temps","Pour l'accord de Do, tonalité de référence","Pour « continu », car le tempo ne varie pas","Pour « commun » : c'est la mesure la plus répandue"],a:3,exp:"C signifie tempus commune, la mesure commune. Le C barré désigne le 2/2 (alla breve), où l'on compte deux temps à la blanche — utile à reconnaître sur les partitions de jazz rapides.",xp:40},
];
