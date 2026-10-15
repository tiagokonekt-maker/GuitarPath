// Leçon du module « neck » + les questions de quiz qui s'y rattachent.
// Format décrit dans src/content/README.md.

export default {
  id: "neck-c1-02", level: 2,
  title: "La logique des octaves",
  duration: 8,
  content: [
    { type: "p", text: "Le manche de la guitare est organisé autour des octaves. Comprendre cette logique te donne instantanément accès à toutes les notes du manche, sans avoir à toutes les mémoriser une par une. C'est l'une des révélations les plus puissantes pour un guitariste." },
    { type: "h", text: "Le principe : une octave = 12 cases" },
    { type: "p", text: "Sur n'importe quelle corde, ajouter 12 cases = monter d'une octave. La note reste la même, juste une octave plus aiguë. Si tu joues Mi sur la corde 6 à vide (case 0), le Mi suivant sur cette même corde se trouve à la case 12. Le Mi encore au-dessus serait à la case 24 (sur les guitares qui ont autant de frettes)." },
    { type: "h", text: "Le double point case 12" },
    { type: "p", text: "C'est pour ça que la case 12 est marquée d'un double point sur le manche. Ce repère te dit visuellement : 'tu es exactement une octave au-dessus de la corde à vide'. Sur certaines guitares, la case 24 a aussi un double point — pour la deuxième octave." },
    { type: "h", text: "Les octaves entre cordes" },
    { type: "p", text: "Mais l'octave, ce n'est pas seulement +12 cases sur la même corde. Tu peux aussi trouver l'octave d'une note sur une corde différente, sans avoir à monter aussi haut. Ces 'patterns d'octaves' entre cordes sont la clé de la navigation rapide sur le manche. On les verra en détail dans le chapitre 3." },
    {
      type: "fretboard",
      caption: "Mi à 3 octaves — même note, 3 timbres différents (grave → aigu)",
      data: {
        frets: 13, startFret: 0,
        showStringNames: true, showFretNumbers: true,
        markerFrets: [3, 5, 7, 9, 12],
        notes: [
          { string: 6, fret: 0,  label: "Mi", color: "amber", root: true },
          { string: 5, fret: 7,  label: "Mi", color: "amber", root: true },
          { string: 4, fret: 2,  label: "Mi", color: "amber", root: true },
          { string: 3, fret: 9, label: "Mi", color: "amber", root: true },
          { string: 2, fret: 5,  label: "Mi", color: "amber", root: true },
          { string: 1, fret: 0,  label: "Mi", color: "amber", root: true },
        ],
      },
    },
    { type: "h", text: "Application concrète" },
    { type: "p", text: "Ce qui est cool : tu peux jouer la même note dans plusieurs zones du manche, ce qui te donne le choix du timbre. La note Mi peut être jouée sur la corde 6 case 0 (très grave, sourd), corde 5 case 7 (médium-grave), corde 4 case 14 (médium), corde 3 case 9 (médium-aigu), corde 2 case 5 (aigu), ou corde 1 case 0 (très aigu). Six 'Mi' différents, six couleurs différentes." },
    { type: "h", text: "Pourquoi c'est si utile" },
    { type: "p", text: "1) Pour les solos : pouvoir jouer la même phrase dans plusieurs régions du manche varie le timbre et l'intensité. 2) Pour les accords : un même accord (Do par exemple) peut être joué dans plusieurs zones, avec des sonorités différentes. 3) Pour comprendre la guitare : voir le manche comme un ensemble cohérent au lieu d'un labyrinthe aléatoire." },
    { type: "ref", text: "David Gilmour (Pink Floyd) est un maître de l'utilisation des octaves. Dans le solo de 'Comfortably Numb', il joue la même phrase mélodique d'abord dans le médium, puis une octave plus haut pour le climax. C'est le contraste d'octaves qui crée la montée émotionnelle." },
    { type: "tip", text: "Test simple : sur la corde de Mi grave, joue case 0, puis case 12, puis case 24 (si tu as 24 frettes). Tu joues 3 fois la même note (Mi), à 3 octaves différentes. Écoute la transformation du timbre : grave et puissant → médium et présent → aigu et brillant." },
  ],
  quiz: ["q-base-08"],
};

export const quiz = [
  {id:"q-base-08",courseId:"neck",lessonId:"neck-c1-02",lvl:1,q:"Sur une même corde, combien de cases faut-il monter pour retrouver la même note à l'octave ?",o:["7","8","10","12"],a:3,exp:"12 cases = 12 demi-tons = une octave complète. La note porte le même nom, une octave plus haut.",xp:30},
];
