// Leçon du module « rhythm » (Rythme & phrasing) + ses questions de quiz.
// Format « leçon en cartes » décrit dans src/content/README.md.
// Technique, 3 sur 4 : hammer-on (h), pull-off (p) et trille, dans la
// position 1 de la pentatonique (scales-c3-02).
// Le lecteur de tab ne lit pas les liaisons enchaînées (5h7p5) : le trille
// est écrit en paires 5h7, la consigne dit de les enchaîner.

const TAB_PAIRES = {
  type: "tab",
  caption: "Hammer-ons en montant, pull-offs en descendant, dans la position 1",
  text: "Tab — corde 3 : 5h7 puis 7p5 ; corde 2 : 5h8 puis 8p5 ; corde 1 : 5h8 puis 8p5 ; on redescend par 8p5 sur la corde 2 et 7p5 sur la corde 3. Une attaque par paire.",
  data: { lines: [
    "e|----------------|5h8-8p5---------|",
    "B|--------5h8-8p5-|--------8p5-----|",
    "G|5h7-7p5---------|------------7p5-|",
    "D|----------------|----------------|",
    "A|----------------|----------------|",
    "E|----------------|----------------|",
  ] },
};

const TAB_TRILLE = {
  type: "tab",
  caption: "Vers le trille : des paires liées, de plus en plus serrées",
  text: "Tab — corde 3 : quatre fois 5h7 ; corde 2 : quatre fois 5h8. Une attaque par paire ; quand c'est régulier, enchaîne hammer-on et pull-off sans regratter.",
  data: { lines: [
    "e|----------------|----------------|",
    "B|----------------|5h8-5h8-5h8-5h8-|",
    "G|5h7-5h7-5h7-5h7-|----------------|",
    "D|----------------|----------------|",
    "A|----------------|----------------|",
    "E|----------------|----------------|",
  ] },
};

export default {
  id: "rhy-tech-03", level: 6,
  title: "Hammer-on et pull-off : le legato",
  duration: 8,
  gropiTip: "Mesure ton legato à l'oreille : la note liée doit sonner aussi fort que la note attaquée. Si elle s'éteint, frappe plus près de la frette plutôt que plus fort.",
  cartes: [
    { type: "idee", titre: "Jouer sans regratter", texte: [
      "Legato veut dire « lié ». La main droite attaque une fois, la main gauche fait sonner les notes suivantes : h pour hammer-on, p pour pull-off.",
      "Le son devient plus fluide, et les traits plus rapides demandent moins d'effort au médiator.",
    ] },
    { type: "idee", titre: "Le hammer-on", texte: [
      "5h7 sur la corde 3 : attaque la case 5 à l'index, puis frappe la case 7 avec l'annulaire, du bout du doigt, juste derrière la frette.",
      "C'est la vitesse du doigt qui fait sonner la note, pas la force : un petit coup sec, d'un ou deux centimètres de haut.",
    ] },
    { type: "question", quizId: "q-rhy-legato-01-tech-app" },
    { type: "idee", titre: "Le pull-off", texte: [
      "7p5 : les deux doigts sont posés, cases 5 et 7. Attaque, puis retire l'annulaire en accrochant légèrement la corde vers le sol.",
      "Ce petit pincement de la main gauche fait sonner la case 5. Lever le doigt tout droit ne laisserait qu'un son mou.",
    ] },
    { type: "question", quizId: "q-rhy-legato-02-tech" },
    { type: "a-toi", titre: "Paires liées",
      consigne: "Joue la tab au clic à 60, une paire par temps : une seule attaque par paire. Les deux notes de chaque paire doivent sonner au même volume.",
      bloc: TAB_PAIRES, bpm: 60, minuteur: 120 },
    { type: "idee", titre: "Le trille", texte: [
      "Un trille, c'est un hammer-on et un pull-off enchaînés très vite sur deux cases, sans regratter : 5h7p5h7… Il fait vibrer une note de façon spectaculaire.",
      "Commence par des paires bien régulières, puis serre le mouvement.",
    ] },
    { type: "a-toi", titre: "Une minute de trille",
      consigne: "Joue les paires de la tab au clic à 70. Quand elles sont régulières, enchaîne hammer-on et pull-off sur la corde 3, cases 5 et 7, sans regratter, aussi longtemps que la note tient.",
      bloc: TAB_TRILLE, bpm: 70, minuteur: 60 },
    { type: "question", quizId: "q-rhy-legato-03-tech" },
    { type: "recap", points: [
      "Hammer-on (h) : frappe sèche du bout du doigt, juste derrière la frette.",
      "Pull-off (p) : les deux doigts posés, on retire en accrochant la corde vers le sol.",
      "Trille : hammer-on et pull-off enchaînés, sans regratter.",
    ] },
  ],
  quiz: ["q-rhy-legato-01-tech", "q-rhy-legato-02-tech", "q-rhy-legato-03-tech", "q-debut-46", "q-rhy-legato-01-tech-app"],
};

export const quiz = [
  {id:"q-rhy-legato-01-tech",courseId:"rhythm",lessonId:"rhy-tech-03",lvl:1,q:"Pour qu'un hammer-on sonne bien, où le doigt frappe-t-il la corde ?",o:["Juste derrière la frette","Au milieu de la case","Sur la frette elle-même","Loin derrière, vers la tête"],a:0,exp:"Juste derrière la frette, la corde se plaque net et la note sonne fort. Plus loin, il faut beaucoup plus de force pour un son plus faible.",xp:25},
  {id:"q-rhy-legato-01-tech-app",courseId:"rhythm",lessonId:"rhy-tech-03",lvl:2,q:"Ton hammer-on sonne faible : l'annulaire frappe lentement, au milieu de la case. Que changes-tu ?",o:["Frapper plus vite, près de la frette","Appuyer plus fort, au même endroit","Regratter la seconde note au médiator","Frapper avec l'index, plus solide"],a:0,exp:"C'est la vitesse du doigt qui fait sonner la note, et la corde se plaque net juste derrière la frette. Appuyer plus fort au milieu de la case ne fait que fatiguer la main.",xp:30},
  {id:"q-rhy-legato-02-tech",courseId:"rhythm",lessonId:"rhy-tech-03",lvl:2,q:"Pull-off de la case 7 vers la case 5 : comment retires-tu le doigt de la case 7 ?",o:["En accrochant la corde vers le sol","En le levant tout droit, vers le haut","En glissant jusqu'à la case 5","En étouffant la corde avec la paume"],a:0,exp:"Le doigt pince légèrement la corde en partant, vers le sol : c'est cette petite attaque de la main gauche qui fait sonner la case 5.",xp:30},
  {id:"q-rhy-legato-03-tech",courseId:"rhythm",lessonId:"rhy-tech-03",lvl:2,q:"Que joues-tu dans un trille entre les cases 5 et 7 ?",o:["Les deux notes en alternance rapide, liées","La case 5 tirée jusqu'à la hauteur de la 7","Un glissé aller-retour entre les deux cases","Les deux notes ensemble, comme un accord"],a:0,exp:"Un trille enchaîne hammer-on et pull-off entre deux cases, très vite, avec une seule attaque de la main droite.",xp:30},
];
