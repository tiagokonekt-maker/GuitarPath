// Leçon du module « debut » + les questions de quiz qui s'y rattachent.
// Format décrit dans src/content/README.md.
//
// Bloc `tab` : voir debut-c3-01.js.

export default {
  id: "debut-c3-02", level: 0, unite: 3,
  title: "Les symboles de la tablature",
  duration: 7,
  content: [
    { type: "p", text: "Au-delà des chiffres, une tab utilise quelques lettres et signes pour dire COMMENT jouer une note. Tu n'as pas besoin de maîtriser ces techniques tout de suite, mais tu dois savoir les reconnaître pour lire n'importe quelle tab sans être perdu." },
    { type: "h", text: "Les liaisons : h et p" },
    { type: "p", text: "h = hammer-on (« marteler »). 2h4 : joue la case 2, puis frappe la case 4 avec un autre doigt, sans regratter la corde. La deuxième note naît du seul impact du doigt. p = pull-off (« tirer »). 4p2 : les deux doigts sont posés, tu joues la case 4 puis tu retires ce doigt en accrochant légèrement la corde vers le bas, et la case 2 sonne sans regratter." },
    { type: "h", text: "Les glissés : / et \\" },
    { type: "p", text: "/ = glissé montant. 2/4 : joue la case 2 et fais glisser le doigt jusqu'à la case 4 sans le décoller, en gardant la pression. \\ = glissé descendant. 4\\2 : même chose en redescendant. On entend la note voyager d'une case à l'autre." },
    { type: "h", text: "Les tirés : b et r" },
    { type: "p", text: "b = bend (tiré). 7b9 : joue la case 7 et pousse la corde vers le haut (vers le plafond) jusqu'à ce qu'elle sonne comme la case 9. r = release (relâché). 7b9r7 : après le tiré, ramène doucement la corde à sa position, la note redescend à la case 7. Le tiré se fait surtout sur les cordes fines, avec plusieurs doigts qui poussent ensemble." },
    { type: "h", text: "Le vibrato et les notes étouffées : ~ et x" },
    { type: "p", text: "~ = vibrato : une fois la note jouée, fais osciller légèrement la corde (petits tirés répétés) pour faire « vivre » la note. x = note étouffée : la main gauche touche la corde sans l'appuyer jusqu'à la frette, le son devient un « tchk » percussif sans hauteur. On en trouve beaucoup dans les rythmiques." },
    {
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
    },
    { type: "p", text: "Lis-le : corde 5 à vide (La), case 3 (Do), corde 4 à vide (Ré), case 2 (Mi) avec un hammer-on vers la case 3 (Fa). Puis on redescend : Mi, Ré, Do, La. Joue-le lentement, en ne grattant qu'une fois pour le 2h3." },
    { type: "tip", text: "Récapitulatif à garder sous la main : h = hammer-on, p = pull-off, / = glissé montant, \\ = glissé descendant, b = tiré, r = relâché, ~ = vibrato, x = note étouffée. Tu verras parfois aussi PM (palm mute : la tranche de la main droite étouffe légèrement les cordes près du chevalet)." },
  ],
  quiz: ["q-debut-46", "q-debut-47", "q-debut-48", "q-debut-49"],
};

export const quiz = [
  {id:"q-debut-46",courseId:"debut",lessonId:"debut-c3-02",lvl:1,q:"Dans une tab, que signifie 5h7 ?",o:["Glisser de la case 5 à la case 7","Jouer la case 5, puis frapper la case 7 sans regratter","Tirer la corde de la case 5 jusqu'à la hauteur de la case 7","Jouer la case 5 et la case 7 en même temps"],a:1,exp:"h = hammer-on : la seconde note est obtenue en frappant la corde avec un doigt de la main gauche, sans nouvelle attaque de la main droite.",xp:25},
  {id:"q-debut-47",courseId:"debut",lessonId:"debut-c3-02",lvl:1,q:"Que veut dire le symbole x dans une tablature ?",o:["Ne rien jouer pendant une mesure","Une note étouffée, percussive","Jouer la case 10","Répéter la mesure précédente"],a:1,exp:"x = note étouffée (ou « morte ») : la corde est touchée sans être appuyée jusqu'à la frette, ce qui donne un son percussif, sans hauteur.",xp:25},
  {id:"q-debut-48",courseId:"debut",lessonId:"debut-c3-02",lvl:2,q:"Comment lire 7b9r7 ?",o:["Glisser de 7 à 9 puis revenir à 7","Tirer la corde jusqu'à la hauteur de la case 9, puis la relâcher vers la case 7","Jouer 7, 9 et 7 en trois attaques","Faire un vibrato entre les cases 7 et 9"],a:1,exp:"b = bend (tiré), r = release (relâché). On joue la case 7, on pousse la corde jusqu'à la hauteur de la case 9, puis on la ramène, sans nouvelle attaque.",xp:30},
  {id:"q-debut-49",courseId:"debut",lessonId:"debut-c3-02",lvl:2,q:"Quelle est la différence entre 3/5 et 5\\3 ?",o:["Aucune, ce sont deux notations du même geste","Le premier glisse vers l'aigu, le second vers le grave","Le premier est un hammer-on, le second un pull-off","Le premier se joue sur la corde 3, le second sur la corde 5"],a:1,exp:"/ = glissé montant (vers les cases plus hautes, donc plus aigu), \\ = glissé descendant (vers le grave).",xp:30},
];
