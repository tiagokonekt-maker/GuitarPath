// Leçon du module « neck » + les questions de quiz qui s'y rattachent.
// Format décrit dans src/content/README.md.

export default {
  id: "neck-c3-01", level: 5,
  title: "Pattern octave 1 : corde 6 → corde 4",
  duration: 9,
  gropiTip: "Pour des octaves doublées propres : index sur la corde 6, annulaire sur la corde 4, et laisse l'index effleurer la corde 5 pour l'étouffer. Tu peux alors gratter sans faire sonner celle du milieu.",
  content: [
    { type: "p", text: "Tu connais maintenant les notes des 6 cordes. Mais mémoriser les positions une par une est lent et inefficace. Heureusement, il existe des 'patterns d'octaves' qui te permettent de trouver la même note dans plusieurs zones du manche, instantanément. Ces patterns sont la clé de la navigation rapide." },
    { type: "h", text: "Le pattern numéro 1 : c6 → c4, +2 cases" },
    { type: "p", text: "Voici le pattern le plus utilisé. Si tu joues une note sur la corde 6, son octave la plus proche se trouve sur la corde 4, deux cases plus haut (vers l'aigu). Exemple : Mi case 0 corde 6 → Mi case 2 corde 4 (octave). Sol case 3 corde 6 → Sol case 5 corde 4 (octave). La case 5 corde 6 → La case 7 corde 4 (octave)." },
    { type: "h", text: "Visualisation : la forme 'L'" },
    { type: "p", text: "Le pattern c6 → c4 +2 dessine une forme de 'L' à l'envers sur le manche. Tu peux le visualiser comme deux notes diagonales : une en bas-gauche (c6), une en haut-droite (c4 +2 cases). Cette forme se déplace partout sur le manche en gardant la même structure : 1 corde sautée, 2 cases plus haut." },
    {
      type: "fretboard",
      caption: "Pattern octave c6→c4 (+2 cases) — La, Do, Sol et leurs octaves",
      data: {
        frets: 8, startFret: 2,
        showStringNames: true, showFretNumbers: true,
        markerFrets: [3, 5, 7],
        notes: [
          { string: 6, fret: 3,  label: "Sol", color: "amber",   root: true },
          { string: 4, fret: 5,  label: "Sol", color: "amber",   root: true },
          { string: 6, fret: 5,  label: "La",  color: "green",   root: true },
          { string: 4, fret: 7,  label: "La",  color: "green",   root: true },
          { string: 6, fret: 8,  label: "Do",  color: "primary", root: true },
          { string: 4, fret: 10, label: "Do",  color: "primary", root: true },
        ],
      },
    },
    { type: "h", text: "Application : trouver une note rapidement" },
    { type: "p", text: "Tu cherches Do sur la corde 4 ? Tu sais que Do est case 8 sur c6. Donc, c4 case 10 = Do (8+2). Tu cherches La sur la corde 4 ? La est case 5 sur c6, donc c4 case 7 = La. Plus besoin de mémoriser les notes de la corde 4 séparément : tu les déduis depuis c6." },
    { type: "h", text: "L'usage en jeu" },
    { type: "p", text: "Ce pattern est utilisé constamment en solo et en accord. Quand tu joues un riff sur la corde 6, tu peux l'enrichir en jouant les octaves correspondantes sur c4. Quand tu cherches une triade en position basse, la fondamentale + son octave c6→c4 te donne déjà 2 notes." },
    { type: "h", text: "Octaves doublées : la signature funk" },
    { type: "p", text: "Jouer une mélodie en octaves doublées (deux notes simultanément, à 1 octave d'écart) est une technique classique du funk et du jazz. Wes Montgomery l'a popularisée à la guitare. Sur la guitare, le pattern c6→c4 +2 te permet de jouer en octaves sans effort." },
    { type: "ref", text: "Le riff de 'Smoke On The Water' joué en octaves doublées sonne comme un riff funky. Essaie : joue le riff sur la corde 6, et simultanément les mêmes notes sur la corde 4 +2 cases. Effet immédiat." },
    { type: "tip", text: "Drill 'octaves c6→c4' : choisis une note (ex Sol). Trouve-la sur c6 (case 3), puis joue son octave c4 (case 5). Refais avec 5 notes différentes. En 5 minutes par jour pendant une semaine, ce pattern devient instinctif." },
  ],
  quiz: ["q-neck-32", "q-neck-33", "q-neck-34", "q-neck-16", "q-neck-17"],
};

export const quiz = [
  {id:"q-neck-32",courseId:"neck",lessonId:"neck-c3-01",lvl:1,q:"Tu cherches La sur la corde 4. Il est case 5 sur la corde 6 : où le trouves-tu ?",o:["Case 5","Case 9","Case 7","Case 3"],a:2,exp:"Pattern c6 → c4 : deux cases plus loin. La, corde 6 case 5 → corde 4 case 7.",xp:30},
  {id:"q-neck-33",courseId:"neck",lessonId:"neck-c3-01",lvl:1,q:"Quelle forme dessine le pattern d'octave c6 → c4 sur le manche ?",o:["Une ligne droite verticale","Un carré de quatre cases","Une diagonale de trois cordes","Un « L » à l'envers"],a:3,exp:"Une corde sautée, deux cases plus loin : une forme en « L » à l'envers, qui se déplace telle quelle sur tout le manche.",xp:30},
  {id:"q-neck-34",courseId:"neck",lessonId:"neck-c3-01",lvl:2,q:"À quoi ce pattern sert-il souvent en jeu ?",o:["Jouer une mélodie en octaves doublées","Accorder la corde 4 à l'oreille","Trouver rapidement les accords barrés en La","Éviter les notes à vide dans un riff"],a:0,exp:"Deux notes à une octave d'écart, jouées ensemble : la technique des octaves, popularisée à la guitare par Wes Montgomery.",xp:40},
];
