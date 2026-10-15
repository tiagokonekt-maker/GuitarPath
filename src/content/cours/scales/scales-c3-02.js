// Leçon du module « scales » + les questions de quiz qui s'y rattachent.
// Format décrit dans src/content/README.md.

export default {
  id: "scales-c3-02", level: 6,
  title: "Les 5 positions de la pentatonique",
  duration: 14,
  gropiTip: "La position 5 (case 3) se rejoue 12 cases plus haut, case 15, juste après la position 4 ; puis la position 1 revient case 17. Les 5 formes tournent en boucle toutes les 12 cases.",
  content: [
    { type: "p", text: "La pentatonique a 5 notes, donc 5 positions différentes sur le manche. Chaque position démarre sur une note différente de la gamme. Une fois les 5 connectées, tu peux jouer la pentatonique partout sur la guitare, du grave à l'aigu." },
    { type: "h", text: "Pourquoi 5 positions" },
    { type: "p", text: "Logique simple : la gamme a 5 notes, donc tu peux commencer la position sur chacune de ces 5 notes. Position 1 commence sur la fondamentale (1). Position 2 commence sur la ♭3. Position 3 sur la 4. Position 4 sur la 5. Position 5 sur la ♭7. Ensemble, elles couvrent tout le manche." },
    { type: "h", text: "Position 1 (déjà vue)" },
    { type: "p", text: "Pour La pentatonique mineure, démarre sur La (case 5 corde 6). C'est la position la plus utilisée. Tu connais déjà." },
    { type: "h", text: "Position 2 : démarre sur la ♭3" },
    { type: "p", text: "Pour La penta min : commence sur Do (case 8 corde 6). Forme : Corde 6 Do(8)-Ré(10). Corde 5 Mi(7)-Sol(10). Corde 4 La(7)-Do(10). Corde 3 Ré(7)-Mi(9). Corde 2 Sol(8)-La(10). Corde 1 Do(8)-Ré(10). Note pivot avec position 1 : la case 8 (où le Do existe dans les 2 positions)." },
    {
      type: "scale_pattern",
      caption: "Am pentatonique — Position 2 (case 8)",
      data: {
        startFret: 7, endFret: 11,
        rootColor: "amber", noteColor: "primary",
        strings: [
          { frets: [8, 10], root: [] },
          { frets: [7, 10], root: [] },
          { frets: [7, 10], root: [7] },
          { frets: [7, 9], root: [] },
          { frets: [8, 10], root: [10] },
          { frets: [8, 10], root: [] },
        ],
        noteMap: {
          "8,0":"Do","10,0":"Ré",
          "7,1":"Mi","10,1":"Sol",
          "7,2":"La","10,2":"Do",
          "7,3":"Ré","9,3":"Mi",
          "8,4":"Sol","10,4":"La",
          "8,5":"Do","10,5":"Ré",
        }
      },
    },
    { type: "h", text: "Position 3 : démarre sur la 4" },
    { type: "p", text: "Pour La penta min : commence sur Ré (case 10 corde 6). Position centrale, idéale pour les phrases 'qui chantent'. Très utilisée dans les solos blues style B.B. King." },
    {
      type: "scale_pattern",
      caption: "Am pentatonique — Position 3 (case 10)",
      data: {
        startFret: 9, endFret: 13,
        rootColor: "amber", noteColor: "primary",
        strings: [
          { frets: [10, 12], root: [] },
          { frets: [10, 12], root: [12] },
          { frets: [10, 12], root: [] },
          { frets: [9, 12], root: [] },
          { frets: [10, 13], root: [10] },
          { frets: [10, 12], root: [] },
        ],
        noteMap: {
          "10,0":"Ré","12,0":"Mi",
          "10,1":"Sol","12,1":"La",
          "10,2":"Do","12,2":"Ré",
          "9,3":"Mi","12,3":"Sol",
          "10,4":"La","13,4":"Do",
          "10,5":"Ré","12,5":"Mi",
        }
      },
    },
    { type: "h", text: "Position 4 : démarre sur la 5" },
    { type: "p", text: "Pour La penta min : commence sur Mi (case 12 corde 6). Position aiguë, parfaite pour les solos qui montent en intensité. C'est une forme à part entière : elle se glisse entre la position 3 et la position 5 (qu'on retrouve une octave plus haut, case 15). La position 1 une octave plus haut, elle, n'arrive qu'à la case 17." },
    { type: "h", text: "Position 5 : démarre sur la ♭7" },
    { type: "p", text: "Pour La penta min : commence sur Sol (case 3 corde 6). Position grave, le 'sous-sol' du manche. Utilisée pour les riffs blues style Muddy Waters, et pour les fins de solos qui redescendent." },
    { type: "h", text: "Connecter les positions" },
    { type: "p", text: "Les positions partagent toujours 1-2 notes 'pivot' qui appartiennent aux deux. En glissant ton index sur ces notes, tu passes d'une position à l'autre sans interruption. Position 1 ↔ Position 2 partagent la case 8 (Do). Position 2 ↔ Position 3 partagent la case 10 (Ré, Sol, Do, La) et le Mi case 9 corde 3. Identifier ces pivots = clé pour fluidifier le jeu sur tout le manche." },
    { type: "ref", text: "Pour visualiser : David Gilmour (Pink Floyd) utilise les 5 positions dans le solo de 'Comfortably Numb'. Il commence en position 1, monte en position 2, atteint un climax en position 4 (aigu), puis redescend en position 5. C'est une démonstration parfaite de l'utilisation pédagogique des 5 positions." },
    { type: "tip", text: "Plan d'apprentissage 5 semaines : 1 semaine par position. Chaque jour : 10 min de la position du moment. À la fin de la semaine 5, tu connais les 5 positions. À la fin de la semaine 7, tu les connectes fluide. C'est l'investissement le plus rentable pour un guitariste rock/blues." },
  ],
  quiz: ["q-impro-18","q-logic-01","q-scales-02"],
};

export const quiz = [
  {id:"q-impro-18",courseId:"impro",lessonId:"scales-c3-02",lvl:1,q:"Pourquoi la pentatonique est-elle plus facile à improviser que la gamme majeure ?",o:["Elle se joue à une vitesse plus élevée","Elle retire les deux notes les plus instables","Elle ne possède qu'une seule position","Elle n'a pas de tonique définie"],a:1,exp:"Cinq notes au lieu de sept : on a retiré la quarte et la septième, celles qui demandent une résolution. Moins de notes à surveiller, donc plus d'attention disponible pour le placement rythmique.",xp:25},
];
