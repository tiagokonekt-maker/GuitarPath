// Leçon du module « debut » + les questions de quiz qui s'y rattachent.
// Format « leçon en cartes » décrit dans src/content/README.md.
//
// Bloc `tab` : voir debut-c3-01.js.

export default {
  id: "debut-c3-02", level: 0, unite: 3,
  title: "Les symboles de la tablature",
  duration: 7,
  gropiTip: "Rejoue le riff de la leçon en remplaçant le 2h3 par un glissé 2/3 : mêmes notes, autre couleur. Tu entends tout de suite la différence entre frapper la note et la faire glisser.",
  cartes: [
    { type: "idee", titre: "Les signes disent COMMENT jouer", texte: [
      "Au-delà des chiffres, une tab utilise quelques signes. Pas besoin de maîtriser ces techniques tout de suite : sache les reconnaître.",
    ] },
    { type: "idee", titre: "h et p : les liaisons", texte: [
      "h = hammer-on. 2h4 : joue la case 2, puis frappe la case 4 avec un autre doigt, sans regratter la corde.",
      "p = pull-off. 4p2 : deux doigts posés, joue la case 4, puis retire ce doigt en accrochant un peu la corde : la case 2 sonne, sans regratter.",
    ] },
    { type: "question", quizId: "q-debut-46" },
    { type: "idee", titre: "/ et \\ : les glissés", texte: [
      "/ = glissé montant. 2/4 : joue la case 2 et glisse jusqu'à la case 4 sans décoller le doigt ni relâcher la pression.",
      "\\ = glissé descendant : 4\\2, même geste en redescendant. On entend la note voyager.",
    ] },
    { type: "idee", titre: "b et r : les tirés", texte: [
      "b = bend (tiré). 7b9 : joue la case 7 et pousse la corde vers le plafond jusqu'à ce qu'elle sonne comme la case 9.",
      "r = release (relâché). 7b9r7 : après le tiré, ramène doucement la corde. Surtout sur les cordes fines, plusieurs doigts poussant ensemble.",
    ] },
    { type: "question", quizId: "q-debut-48" },
    { type: "idee", titre: "~ et x : vibrato et notes étouffées", texte: [
      "~ = vibrato : de petits tirés répétés font « vivre » la note.",
      "x = note étouffée : la main gauche touche la corde sans l'appuyer, d'où un « tchk » percussif. Et PM (palm mute) : la tranche de la main droite étouffe les cordes près du chevalet.",
    ] },
    { type: "question", quizId: "q-debut-47" },
    { type: "a-toi", titre: "Un riff avec un hammer-on", consigne: "La (corde 5 à vide), Do, Ré (corde 4 à vide), puis Mi avec un hammer-on vers Fa, et on redescend : Mi, Ré, Do, La. Écoute-le, puis joue-le lentement, en ne grattant qu'une fois pour le 2h3.", bloc: {
      type: "tab",
      caption: "Un petit riff original en La mineur, avec un hammer-on",
      text: "Tab — corde 5 : 0 puis 3 ; corde 4 : 0, puis 2h3 (case 2 et hammer-on sur la case 3) ; puis corde 4 : 2, 0 ; corde 5 : 3, 0.",
      data: { lines: [
        "e|---------------------|---------------------|",
        "B|---------------------|---------------------|",
        "G|---------------------|---------------------|",
        "D|-----------0----2h3--|-2----0--------------|",
        "A|-0----3--------------|-----------3----0----|",
        "E|---------------------|---------------------|",
      ] },
    } },
    { type: "recap", points: [
      "h = hammer-on, p = pull-off : la seconde note sonne sans regratter.",
      "/ glisse vers l'aigu, \\ vers le grave ; b tire la corde, r la relâche.",
      "~ = vibrato, x = note étouffée, PM = palm mute.",
    ] },
  ],
  quiz: ["q-debut-46", "q-debut-47", "q-debut-48", "q-debut-49"],
};

export const quiz = [
  {id:"q-debut-46",courseId:"debut",lessonId:"debut-c3-02",lvl:1,q:"Dans une tab, que signifie 5h7 ?",o:["Glisser de la case 5 à la case 7","Jouer la case 5, puis frapper la case 7 sans regratter","Tirer la corde de la case 5 jusqu'à la hauteur de la case 7","Jouer la case 5 et la case 7 en même temps"],a:1,exp:"h = hammer-on : la seconde note est obtenue en frappant la corde avec un doigt de la main gauche, sans nouvelle attaque de la main droite.",xp:25},
  {id:"q-debut-47",courseId:"debut",lessonId:"debut-c3-02",lvl:1,q:"Que veut dire le symbole x dans une tablature ?",o:["Ne rien jouer pendant une mesure","Une note étouffée, percussive","Jouer la case 10","Répéter la mesure précédente"],a:1,exp:"x = note étouffée (ou « morte ») : la corde est touchée sans être appuyée jusqu'à la frette, ce qui donne un son percussif, sans hauteur.",xp:25},
  {id:"q-debut-48",courseId:"debut",lessonId:"debut-c3-02",lvl:2,q:"Comment lire 7b9r7 ?",o:["Glisser de 7 à 9 puis revenir à 7","Tirer la corde jusqu'à la hauteur de la case 9, puis la relâcher vers la case 7","Jouer 7, 9 et 7 en trois attaques","Faire un vibrato entre les cases 7 et 9"],a:1,exp:"b = bend (tiré), r = release (relâché). On joue la case 7, on pousse la corde jusqu'à la hauteur de la case 9, puis on la ramène, sans nouvelle attaque.",xp:30},
  {id:"q-debut-49",courseId:"debut",lessonId:"debut-c3-02",lvl:2,q:"Quelle est la différence entre 3/5 et 5\\3 ?",o:["Aucune, ce sont deux notations du même geste","Le premier glisse vers l'aigu, le second vers le grave","Le premier est un hammer-on, le second un pull-off","Le premier se joue sur la corde 3, le second sur la corde 5"],a:1,exp:"/ = glissé montant (vers les cases plus hautes, donc plus aigu), \\ = glissé descendant (vers le grave).",xp:30},
];
