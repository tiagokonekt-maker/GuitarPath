// Leçon du module « scales » + les questions de quiz qui s'y rattachent.
// Format décrit dans src/content/README.md.

export default {
  id: "scales-c1-03", level: 2,
  title: "Tons et demi-tons : la mesure des distances",
  duration: 10,
  gropiTip: "Vérifie les demi-tons naturels sur la corde 2 : Si à vide, Do case 1, puis Mi case 5, Fa case 6. Une seule case d'écart à chaque fois, alors que Do→Ré en demande deux.",
  content: [
    { type: "p", text: "Maintenant qu'on connaît les 12 sons, il faut apprendre à mesurer les distances entre eux. C'est ici que naissent les concepts de 'ton' et 'demi-ton' — les deux unités fondamentales de toute la théorie musicale. Sans eux, impossible de comprendre une seule gamme." },
    { type: "h", text: "Le demi-ton : la plus petite distance" },
    { type: "p", text: "Un demi-ton, c'est l'écart entre deux notes consécutives de la gamme chromatique. Sur la guitare, c'est exactement une case d'écart sur la même corde. Exemples : Do → Do# = 1 demi-ton. Mi → Fa = 1 demi-ton (rappel : entre Mi et Fa il n'y a pas d'altération). Si → Do = 1 demi-ton aussi." },
    { type: "h", text: "Le ton : deux demi-tons" },
    { type: "p", text: "Un ton, c'est tout simplement deux demi-tons collés. Sur la guitare, ça correspond à deux cases d'écart. Exemples : Do → Ré = 1 ton (parce que Do → Do# → Ré, soit 2 demi-tons). Sol → La = 1 ton. Fa → Sol = 1 ton." },
    { type: "h", text: "Les demi-tons naturels (à mémoriser) " },
    { type: "p", text: "Reprends mentalement les 7 notes naturelles : Do-Ré-Mi-Fa-Sol-La-Si. Entre la plupart des notes, l'écart est d'un ton. SAUF entre Mi et Fa (1 demi-ton), et entre Si et Do (1 demi-ton). Ces deux endroits sont les 'demi-tons naturels' de la gamme. Ils sont au cœur de tout ce qui suit." },
    {
      type: "note_grid",
      caption: "Demi-tons naturels — Mi→Fa (cases 0-1) et Si→Do (cases 7-8) collés sur corde 6",
      data: {
        string: 6, stringName: "Mi grave", maxFret: 12,
        highlights: [
          { fret: 0,  label: "Mi",  color: "amber" },
          { fret: 1,  label: "Fa",  color: "coral" },
          { fret: 3,  label: "Sol", color: "neutral" },
          { fret: 5,  label: "La",  color: "neutral" },
          { fret: 7,  label: "Si",  color: "amber" },
          { fret: 8,  label: "Do",  color: "coral" },
          { fret: 10, label: "Ré",  color: "neutral" },
          { fret: 12, label: "Mi",  color: "amber" },
        ],
      },
    },
    { type: "h", text: "Pourquoi cette asymétrie est cruciale" },
    { type: "p", text: "Si tu pars de Do et que tu montes en respectant cette suite ton-ton-demi-ton-ton-ton-ton-demi-ton, tu obtiens automatiquement la gamme majeure de Do. Ce 'pattern' de tons et demi-tons est ce qui crée la sonorité 'majeure'. Si tu changes le pattern, tu obtiens un autre type de gamme (mineure, modale, etc.). Toute la théorie occidentale repose sur ces patterns d'écarts." },
    { type: "ref", text: "Exercice immédiat : sur la corde de Mi grave, monte case par case en disant à voix haute : 'Mi (case 0) - Fa (case 1, +1/2 ton) - Sol (case 3, +1 ton) - La (case 5, +1 ton) - Si (case 7, +1 ton) - Do (case 8, +1/2 ton) - Ré (case 10, +1 ton) - Mi (case 12, +1 ton)'. Tu viens de jouer la gamme majeure de Mi en parlant à haute voix le pattern T-T-DT-T-T-T-DT." },
    { type: "tip", text: "Mnémonique pour ne jamais oublier les demi-tons naturels : 'Mi-Fa Si-Do, ce sont eux qui se collent'. Cette phrase pourrait sauver ta vie de musicien." },
  ],
  quiz: ["q-base-11","q-base-12"],
};

export const quiz = [
  {id:"q-base-11",courseId:"scales",lessonId:"scales-c1-03",lvl:1,q:"Un ton entier représente combien de demi-tons ?",o:["1","3","2","4"],a:2,exp:"Un ton = 2 demi-tons = 2 cases sur la guitare. Le demi-ton reste la plus petite unité du système occidental.",xp:30},
  {id:"q-base-12",courseId:"scales",lessonId:"scales-c1-03",lvl:1,q:"Entre lesquelles de ces paires de notes naturelles n'y a-t-il qu'un demi-ton ?",o:["Do et Ré","Sol et La","La et Si","Mi et Fa"],a:3,exp:"Mi-Fa et Si-Do sont les deux seules paires naturelles séparées d'un simple demi-ton. Toutes les autres sont à un ton entier.",xp:30},
];
