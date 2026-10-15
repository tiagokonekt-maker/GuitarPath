// Leçon du module « neck » + les questions de quiz qui s'y rattachent.
// Format décrit dans src/content/README.md.

export default {
  id: "neck-c2-02", level: 3,
  title: "Les notes de la corde de La (corde 5)",
  duration: 9,
  content: [
    { type: "p", text: "La corde 5 (La) est ta deuxième ancre principale. Elle porte la fondamentale des accords barrés en 'forme A' (comme Ré barré case 5, Mi barré case 7). La maîtriser après la corde 6 te donne l'essentiel du manche en tête." },
    { type: "h", text: "Les notes case par case" },
    { type: "p", text: "Voici la suite chromatique sur la corde 5 : Case 0 = La. Case 1 = La#. Case 2 = Si. Case 3 = Do. Case 4 = Do#. Case 5 = Ré. Case 6 = Ré#. Case 7 = Mi. Case 8 = Fa. Case 9 = Fa#. Case 10 = Sol. Case 11 = Sol#. Case 12 = La (octave)." },
    { type: "h", text: "Mêmes demi-tons naturels, autres positions" },
    { type: "p", text: "Les 2 demi-tons naturels (Si-Do et Mi-Fa) apparaissent aussi sur la corde 5, mais à des cases différentes. Si-Do : entre cases 2 et 3. Mi-Fa : entre cases 7 et 8. Repère ces collages — ils t'aident à mémoriser le pattern." },
    { type: "h", text: "Notes-ancres à mémoriser" },
    { type: "p", text: "La (0), Do (3), Ré (5), Mi (7), Sol (10), La (12). Ces 6 notes ancrent toute la corde 5. Comme sur la corde 6, tu déduis les autres par voisinage." },
    {
      type: "note_grid",
      caption: "Corde 5 (La) — notes naturelles à mémoriser",
      data: {
        string: 5, stringName: "La", maxFret: 12,
        highlights: [
          { fret: 0,  label: "La",  color: "amber" },
          { fret: 2,  label: "Si",  color: "green" },
          { fret: 3,  label: "Do",  color: "primary" },
          { fret: 5,  label: "Ré",  color: "amber" },
          { fret: 7,  label: "Mi",  color: "green" },
          { fret: 8,  label: "Fa",  color: "green" },
          { fret: 10, label: "Sol", color: "green" },
          { fret: 12, label: "La",  color: "amber" },
        ],
      },
    },
    {
      type: "fretboard",
      caption: "Même note La — corde 6 case 5 et corde 5 case 0 (une octave d'écart)",
      data: {
        frets: 7, startFret: 0,
        showStringNames: true, showFretNumbers: true,
        markerFrets: [3, 5],
        notes: [
          { string: 6, fret: 5, label: "La", color: "amber", root: true },
          { string: 5, fret: 0, label: "La", color: "amber", root: true },
        ],
      },
    },
    { type: "h", text: "L'astuce du décalage" },
    { type: "p", text: "Voici une astuce magique : la corde 5 est 'décalée' de 2 cases par rapport à la corde 6 pour les mêmes notes. Si Do est en case 8 sur la corde 6, alors Do est en case 3 sur la corde 5 (8 - 5 = 3 ; le décalage est de 5 cases entre cordes adjacentes pour la même note, mais on garde la même 'position' visuelle). Plus simple à exprimer ainsi : la corde 5 donne accès aux mêmes notes que la corde 6, mais 5 demi-tons plus haut depuis la corde à vide." },
    { type: "h", text: "Pourquoi cette corde est si importante" },
    { type: "p", text: "La corde 5 porte la fondamentale des accords barrés en 'forme A'. Quand tu joues Ré barré case 5 (forme A barrée), c'est parce que case 5 corde 5 = Ré. Quand tu joues Do barré case 3 (forme A barrée), c'est parce que case 3 corde 5 = Do. Combinée à la corde 6, ça te donne le pouvoir de jouer n'importe quel accord majeur ou mineur dans n'importe quelle tonalité, en barré." },
    { type: "h", text: "Le lien octave avec la corde 6" },
    { type: "p", text: "Une astuce mémoire : la corde 5 case 12 = La. La corde 6 case 5 = La aussi. Ces deux La sont à une octave d'écart. Plus généralement : la corde 5 case X = même note que la corde 6 case (X+5). Cette équivalence permet de déduire instantanément les notes d'une corde si tu connais l'autre." },
    { type: "ref", text: "Pratique : joue Ré barré case 5 (corde 5). Identifie la fondamentale (Ré) sur la corde 5 case 5. Maintenant joue La barré case 5 (corde 6). Identifie la fondamentale (La) sur la corde 6 case 5. Ces deux accords se forment de la même façon, mais sur des cordes différentes. La logique du barré devient claire." },
    { type: "tip", text: "Drill connecté : joue la même note sur c6 et c5 en décalage. Ex : Mi (c6 case 0) puis Mi (c5 case 7). Do (c6 case 8) puis Do (c5 case 3). Ce drill développe ta vision globale du manche." },
  ],
  quiz: ["q-base-17"],
};

export const quiz = [
  {id:"q-base-17",courseId:"neck",lessonId:"neck-c2-02",lvl:2,q:"Sur la corde de La (corde 5), quelle note trouve-t-on case 3 ?",o:["Do","Si","Ré","Do#"],a:0,exp:"Depuis La à vide : case 1 La#, case 2 Si, case 3 Do. Cette corde porte la fondamentale des accords barrés en forme de La.",xp:35},
];
