// Leçon du module « scales » + les questions de quiz qui s'y rattachent.
// Format décrit dans src/content/README.md.

export default {
  id: "scales-c4-03", level: 8,
  title: "Comment l'oreille perçoit un mode (le rôle du drone)",
  duration: 8,
  gropiTip: "Drone gratuit : pour Mi phrygien, laisse sonner la corde 6 à vide et joue les notes de Do majeur sur les cordes aiguës. Insiste sur le Fa (case 1 corde 1) pour entendre la ♭2.",
  content: [
    { type: "p", text: "Un mode existe seulement si l'oreille perçoit une fondamentale stable. Sans cette ancre, ton cerveau retombe sur la fondamentale par défaut (la tonique de la gamme majeure parente). Comprendre ce phénomène, c'est comprendre comment 'faire sonner' un mode quand on improvise.", img: "/mascotte-zen.webp", imgAlt: "Gropi les yeux fermés, à l'écoute", imgSide: "right" },
    { type: "h", text: "Le piège : sans ancre, pas de mode" },
    { type: "p", text: "Si tu joues simplement les notes de Ré dorien (Ré-Mi-Fa-Sol-La-Si-Do) sans rien d'autre, ton oreille va naturellement entendre 'Do majeur' parce que c'est le pattern qu'elle reconnaît le mieux. Le mode dorien va s'évanouir. Pour qu'un mode 'sonne' vraiment, il faut un dispositif qui ancre l'oreille sur la nouvelle fondamentale." },
    { type: "h", text: "Le drone : ton meilleur ami" },
    { type: "p", text: "Un drone, c'est une note grave tenue en continu sous la mélodie. Quand un drone Ré joue en boucle pendant que tu improvises Ré dorien, ton oreille entend le Ré comme la fondamentale. Le mode s'installe. Cette technique vient de la musique indienne classique (les tamboura), de la musique traditionnelle écossaise (les cornemuses), du blues primitif (la corde grave qui résonne)." },
    { type: "tab", caption: "La corde de Ré à vide sert de drone : elle revient sous chaque petite phrase de Ré dorien (La, Si, Do)", text: "Tab : corde 4 à vide (Ré), puis corde 3 cases 2 et 4 (La, Si), corde 2 case 1 (Do), Ré à vide, puis Si, La et Ré à vide pour finir. Le Si, sixte majeure, donne la couleur dorienne.", data: { lines: ["e|------------------|","B|-------1----------|","G|---2-4-----4-2----|","D|-0-------0-----0--|","A|------------------|","E|------------------|"] } },
    { type: "h", text: "Comment générer un drone" },
    { type: "p", text: "Trois solutions. (1) Une app de drone (il en existe plusieurs, gratuites) ou une vidéo « drone Ré » sur YouTube. (2) Une boucle d'accord modal : par exemple, jouer Dm7 en boucle pour ancrer l'oreille en Ré. (3) Ta propre guitare : laisse résonner la corde de Ré (corde 4 vide ou corde 5 case 5) entre tes phrases." },
    { type: "h", text: "Les accords modaux : alternative au drone" },
    { type: "p", text: "Au lieu d'un drone fixe, tu peux jouer un accord 'caractéristique' du mode en boucle. Pour le dorien : Dm7 (ou Am7). Pour le mixolydien : G7. Pour le lydien : Cmaj7 avec un Fa# en accent. Pour le phrygien : Em (avec un Fa naturel en passage). Chaque mode a ses accords 'maison'." },
    { type: "chord_diagram", caption: "Dm7 (xx0211) — la vamp qui ancre l'oreille en Ré dorien", data: {name: "Dm7", frets: [-1,-1,0,2,1,1], fingers: [0,0,0,2,1,1], startFret: 1} },
    { type: "h", text: "Mettre en valeur la 'note caractéristique'" },
    { type: "p", text: "Chaque mode a une note qui le différencie de son cousin majeur ou mineur. C'est sa 'note caractéristique'. En dorien, c'est la 6e majeure. En phrygien, c'est la ♭2. En lydien, c'est la #4. En mixolydien, c'est la ♭7. Quand tu improvises, mets cette note en valeur (notes longues, temps forts) pour 'affirmer' que tu joues ce mode et pas un autre. Sinon, ton oreille glissera vers la gamme majeure ou mineure standard." },
    { type: "ref", text: "Démonstration : 'So What' (Miles Davis, 1959) est joué sur une vamp Dm7 (qui agit comme un drone harmonique). Toute la pièce reste en Ré dorien pendant 16 mesures. Aucune ambiguïté : l'oreille s'installe dans le dorien et y reste. Sans le drone harmonique de Dm7, le morceau aurait sonné comme du Do majeur ordinaire." },
    { type: "tip", text: "Quand tu pratiques un mode, lance toujours un drone ou une vamp d'accord modal. Sans support harmonique, tu travailles dans le vide — ton oreille ne perçoit pas la couleur du mode." },
  ],
  quiz: ["q-scales-36", "q-scales-37", "q-scales-59"],
};

export const quiz = [
  {id:"q-scales-36",courseId:"scales",lessonId:"scales-c4-03",lvl:2,q:"Sans drone ni accord de soutien, les notes de Ré dorien jouées seules sonnent souvent comme…",o:["Ré mineur harmonique", "Do majeur", "La mineur", "Sol mixolydien"],a:1,exp:"Sans ancre, l'oreille retombe sur la gamme parente qu'elle connaît le mieux : Do majeur. Le mode dorien s'évanouit.",xp:40},
  {id:"q-scales-37",courseId:"scales",lessonId:"scales-c4-03",lvl:2,q:"Quelle est la note caractéristique du mode dorien ?",o:["La seconde mineure", "La quarte augmentée", "La sixte majeure", "La septième majeure"],a:2,exp:"Dorien = mineur avec une sixte majeure. C'est la note à mettre en valeur pour que le mode s'entende.",xp:40},
  {id:"q-scales-59",courseId:"scales",lessonId:"scales-c4-03",lvl:2,q:"Tu veux faire entendre La dorien. Quel accord tenir en boucle sous ton impro ?",o:["Am7","Cmaj7","G7","Fmaj7"],a:0,exp:"Un mode n'existe que si l'oreille entend sa fondamentale. Am7 ancre La ; les notes de La dorien (celles de Sol majeur) prennent alors leur couleur dorienne. Sur Cmaj7, l'oreille se poserait sur Do.",xp:40},
];
