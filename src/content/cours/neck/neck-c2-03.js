// Leçon du module « neck » + les questions de quiz qui s'y rattachent.
// Format décrit dans src/content/README.md.

export default {
  id: "neck-c2-03", level: 4,
  title: "Les notes de la corde de Ré (corde 4)",
  duration: 8,
  gropiTip: "Tu connais déjà la case 5 de la corde 4 : c'est le Sol qui sert à accorder la corde 3 à l'oreille. Pars de là pour remonter : La en case 7, Si en 9, Do en 10.",
  content: [
    { type: "p", text: "La corde 4 (Ré) est moins utilisée comme ancre que les cordes 6 et 5, mais elle est essentielle pour les accords ouverts (Ré, Sol, Do) et pour certaines fondamentales d'accords avancés. La connaître complète ta cartographie." },
    { type: "h", text: "Les notes case par case" },
    { type: "p", text: "Case 0 = Ré. Case 1 = Ré#. Case 2 = Mi. Case 3 = Fa. Case 4 = Fa#. Case 5 = Sol. Case 6 = Sol#. Case 7 = La. Case 8 = La#. Case 9 = Si. Case 10 = Do. Case 11 = Do#. Case 12 = Ré (octave)." },
    { type: "h", text: "Demi-tons naturels" },
    { type: "p", text: "Mi-Fa : entre cases 2 et 3. Si-Do : entre cases 9 et 10. Toujours les mêmes deux 'collages' à repérer." },
    { type: "h", text: "Notes-ancres" },
    { type: "p", text: "Ré (0), Mi (2), Sol (5), La (7), Do (10), Ré (12). 6 notes-clés. Avec elles, tout se déduit." },
    {
      type: "note_grid",
      caption: "Corde 4 (Ré) — notes naturelles",
      data: {
        string: 4, stringName: "Ré", maxFret: 12,
        highlights: [
          { fret: 0,  label: "Ré",  color: "amber" },
          { fret: 2,  label: "Mi",  color: "green" },
          { fret: 3,  label: "Fa",  color: "green" },
          { fret: 5,  label: "Sol", color: "amber" },
          { fret: 7,  label: "La",  color: "green" },
          { fret: 9,  label: "Si",  color: "green" },
          { fret: 10, label: "Do",  color: "primary" },
          { fret: 12, label: "Ré",  color: "amber" },
        ],
      },
    },
    { type: "h", text: "Le lien avec la corde 6" },
    { type: "p", text: "La corde 4 à vide = Ré : exactement la même note, à la même hauteur, que la corde 6 case 10. Plus généralement, corde 4 case X = corde 6 case X+10. La raison : chaque corde sonne une quarte (5 demi-tons) au-dessus de la précédente, donc deux cordes plus haut = 10 cases d'avance. Pour l'octave au-dessus, reprends la règle des octaves : corde 6 case X → corde 4 case X+2." },
    { type: "h", text: "Application aux accords ouverts" },
    { type: "p", text: "L'accord Ré majeur ouvert utilise la corde 4 à vide comme fondamentale. L'accord Sol majeur ouvert utilise la corde 4 case 0 (Ré) comme quinte. L'accord Do majeur ouvert utilise la corde 4 case 2 (Mi) comme tierce. Connaître les notes de cette corde aide à comprendre la structure des accords ouverts." },
    { type: "h", text: "Pourquoi peu d'accords barrés sur c4" },
    { type: "p", text: "Tu n'utiliseras presque jamais la corde 4 comme fondamentale d'un accord barré (les fondamentales restent généralement sur c6 ou c5). Mais elle est cruciale pour : 1) les power chords sur cordes 4-3, 2) les triades sur cordes 4-3-2, 3) les fondamentales d'accords spéciaux comme Ré barré case 5 (forme E)." },
    { type: "ref", text: "Le riff principal de 'Smoke on the Water' (Deep Purple) se joue sur la corde 4 (en open tuning à l'origine, mais transposable en standard). Apprendre les notes de la corde 4 te permet de déchiffrer beaucoup de tablatures rock classiques." },
    { type: "tip", text: "Drill 'cordes basses' : joue la même note sur c6, c5, c4 successivement. Ex : trouve Sol sur les 3 cordes basses (c6 case 3, c5 case 10, c4 case 5). Cette triple localisation grave les correspondances dans ta mémoire." },
  ],
  quiz: ["q-neck-29", "q-neck-30", "q-neck-31", "q-neck-09"],
};

export const quiz = [
  {id:"q-neck-29",courseId:"neck",lessonId:"neck-c2-03",lvl:1,q:"Sur la corde 4 (Ré), quelle note est à la case 5 ?",o:["Sol","Fa#","La","Mi"],a:0,exp:"Corde 4 à vide = Ré, puis Mi (2), Fa (3), Sol (5).",xp:30},
  {id:"q-neck-30",courseId:"neck",lessonId:"neck-c2-03",lvl:1,q:"Sur la corde 4, où sont les deux demi-tons naturels (Mi-Fa et Si-Do) ?",o:["Cases 3-4 et 10-11","Cases 2-3 et 9-10","Cases 4-5 et 11-12","Cases 1-2 et 8-9"],a:1,exp:"Mi est case 2 et Fa case 3 ; Si est case 9 et Do case 10.",xp:30},
  {id:"q-neck-31",courseId:"neck",lessonId:"neck-c2-03",lvl:2,q:"La corde 4 à vide sonne exactement comme…",o:["La corde 6, case 5","La corde 5, case 7","La corde 6, case 10","La corde 6, case 12"],a:2,exp:"Corde 4 case X = corde 6 case X+10 : la corde 4 à vide (Ré) est la même note, à la même hauteur, que la corde 6 case 10.",xp:40},
];
