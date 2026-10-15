// Leçon du module « scales » + les questions de quiz qui s'y rattachent.
// Format décrit dans src/content/README.md.

export default {
  id: "scales-c1-02", level: 2,
  title: "Les altérations : dièses et bémols",
  duration: 9,
  content: [
    { type: "p", text: "7 notes, c'est bien. Mais entre certaines de ces notes, il existe des notes 'intermédiaires' : ce sont les altérations. Au total, la musique occidentale compte donc 12 sons différents avant que la boucle ne recommence à l'octave. Tu vois ces 12 sons à chaque case de ta guitare." },
    { type: "h", text: "Le dièse (#) — augmenter d'un cran" },
    { type: "p", text: "Un dièse devant une note signifie 'cette note, mais un cran plus haut'. Exemple : Fa# (Fa dièse) est juste après Fa, vers l'aigu. Sur ta guitare, c'est une case plus à droite. Si Fa est sur la case 1 de la corde de Mi grave, alors Fa# est sur la case 2." },
    { type: "h", text: "Le bémol (♭) — diminuer d'un cran" },
    { type: "p", text: "Un bémol fait l'inverse : il abaisse la note d'un cran. Si♭ (Si bémol) est juste avant Si, vers le grave. Si Si est case 7 de la corde de Mi, Si♭ est case 6." },
    { type: "h", text: "Les deux exceptions importantes" },
    { type: "p", text: "Entre certaines paires de notes, il n'y a PAS d'altération. C'est le cas entre Mi et Fa (Mi-Fa sont déjà collés), et entre Si et Do (Si-Do sont collés aussi). Donc il n'existe pas de Mi# (= ce serait Fa) ni de Fa♭ (= ce serait Mi). Ces deux 'collages' sont les fameux 'demi-tons naturels'. Tu y reviendras dans la leçon suivante." },
    { type: "h", text: "Les 12 sons en ordre" },
    { type: "p", text: "Voici la suite complète, du plus grave au plus aigu : Do - Do# - Ré - Ré# - Mi - Fa - Fa# - Sol - Sol# - La - La# - Si - et on revient à Do (octave). 12 sons en tout. Cette suite s'appelle la 'gamme chromatique'. Sur ta guitare, c'est exactement ce que tu joues si tu remontes case après case sur une seule corde." },
    {
      type: "note_grid",
      caption: "Gamme chromatique sur corde 5 — 12 sons, case par case",
      data: {
        string: 5, stringName: "La", maxFret: 12,
        highlights: [
          { fret: 0,  label: "La",  color: "amber" },
          { fret: 1,  label: "La#", color: "neutral" },
          { fret: 2,  label: "Si",  color: "green" },
          { fret: 3,  label: "Do",  color: "primary" },
          { fret: 4,  label: "Do#", color: "neutral" },
          { fret: 5,  label: "Ré",  color: "amber" },
          { fret: 6,  label: "Ré#", color: "neutral" },
          { fret: 7,  label: "Mi",  color: "green" },
          { fret: 8,  label: "Fa",  color: "green" },
          { fret: 9,  label: "Fa#", color: "neutral" },
          { fret: 10, label: "Sol", color: "green" },
          { fret: 11, label: "Sol#",color: "neutral" },
          { fret: 12, label: "La",  color: "amber" },
        ],
      },
    },
    { type: "ref", text: "Pour visualiser : sur la corde de Mi grave (corde 6), joue case 0 (Mi), case 1 (Fa), case 2 (Fa#), case 3 (Sol)... jusqu'à case 12 où tu retombes sur Mi (1 octave plus haut). Tu viens de jouer la gamme chromatique." },
    { type: "tip", text: "Sur le manche : 1 case = 1 cran d'altération. Monter d'une case = +1 dièse. Descendre = +1 bémol. Cette équivalence est ta meilleure amie pour comprendre la guitare." },
  ],
  quiz: ["q-base-09","q-base-10"],
};

export const quiz = [
  {id:"q-base-09",courseId:"scales",lessonId:"scales-c1-02",lvl:1,q:"Combien de sons différents existe-t-il avant que la boucle recommence à l'octave ?",o:["12","7","5","24"],a:0,exp:"7 notes naturelles plus 5 altérations donnent 12 sons — exactement les 12 cases d'une corde avant l'octave.",xp:30},
  {id:"q-base-10",courseId:"scales",lessonId:"scales-c1-02",lvl:1,q:"Un dièse (#) placé devant une note signifie…",o:["Un demi-ton plus bas","Un demi-ton plus haut","Un ton plus haut","Une octave plus haut"],a:1,exp:"Le dièse monte la note d'un demi-ton, le bémol la descend d'un demi-ton. Sur la guitare : une case dans un sens ou dans l'autre.",xp:30},
];
