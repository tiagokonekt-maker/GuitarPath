// Leçon du module « neck » + les questions de quiz qui s'y rattachent.
// Format décrit dans src/content/README.md.

export default {
  id: "neck-c3-02", level: 5,
  title: "Pattern octave 2 : corde 5 → corde 3",
  duration: 8,
  gropiTip: "Tu utilises déjà ce pattern sans le savoir : dans La mineur (x02210), la corde 5 à vide et la corde 3 case 2 sont deux La à une octave d'écart.",
  content: [
    { type: "p", text: "Le deuxième pattern d'octaves fonctionne de la même façon que le premier : corde 5 vers corde 3, +2 cases. C'est le miroir du pattern précédent, mais une corde plus haut." },
    { type: "h", text: "Le pattern : c5 → c3, +2 cases" },
    { type: "p", text: "Si tu joues une note sur la corde 5, son octave la plus proche se trouve sur la corde 3, deux cases plus haut. Exemple : La case 0 corde 5 → La case 2 corde 3 (octave). Do case 3 corde 5 → Do case 5 corde 3 (octave). Ré case 5 corde 5 → Ré case 7 corde 3 (octave)." },
    { type: "h", text: "Pourquoi le même décalage ?" },
    { type: "p", text: "Comme entre c6 et c4, l'écart entre c5 et c3 est aussi de 2 quartes consécutives = 10 demi-tons. L'octave étant 12 demi-tons, on a besoin de +2 cases pour compléter. Cette logique est universelle pour les cordes 'similaires' : c6→c4 et c5→c3 obéissent à la même règle." },
    { type: "h", text: "Visualisation : la forme 'L' miroir" },
    { type: "p", text: "Comme pour le pattern c6→c4, le pattern c5→c3 dessine un 'L' inversé sur le manche : une note en bas-gauche (c5), une en haut-droite (c3 +2 cases). Cette forme se déplace partout, tu la reconnais d'un coup d'œil." },
    {
      type: "fretboard",
      caption: "Pattern octave c5→c3 (+2 cases) — même logique que c6→c4",
      data: {
        frets: 8, startFret: 2,
        showStringNames: true, showFretNumbers: true,
        markerFrets: [3, 5, 7],
        notes: [
          { string: 5, fret: 3,  label: "Do",  color: "primary", root: true },
          { string: 3, fret: 5,  label: "Do",  color: "primary", root: true },
          { string: 5, fret: 5,  label: "Ré",  color: "amber",   root: true },
          { string: 3, fret: 7,  label: "Ré",  color: "amber",   root: true },
          { string: 5, fret: 7,  label: "Mi",  color: "green",   root: true },
          { string: 3, fret: 9,  label: "Mi",  color: "green",   root: true },
        ],
      },
    },
    { type: "h", text: "Application : compléter ta vision" },
    { type: "p", text: "Avec les 2 patterns (c6→c4 et c5→c3), tu as déjà 4 cordes 'connectées' par octaves. Tu peux jouer une note basse sur c6 ou c5, et trouver instantanément son octave dans les cordes médium (c4 ou c3). C'est la base de tout jeu en octaves doublées." },
    { type: "h", text: "Combo : pattern 1 + pattern 2" },
    { type: "p", text: "Tu peux enchaîner les patterns. Si tu joues Sol sur c6 case 3, son octave est sur c4 case 5 (pattern 1). À partir du Sol c4, son octave SUIVANTE est sur c2 case 8 (c4→c2 : +3 cases, car la corde de Si décale tout d'une case). Tu obtiens 3 Sol, chacun une octave au-dessus du précédent, sur 3 cordes différentes. Ça te donne 3 timbres pour la même note." },
    { type: "ref", text: "Wes Montgomery, le légendaire guitariste de jazz, utilisait massivement ces patterns d'octaves. Son style 'octaves' est instantanément reconnaissable. Écoute son album 'The Incredible Jazz Guitar' (1960) : de nombreux thèmes y sont joués en octaves." },
    { type: "tip", text: "Drill combiné : choisis une note, trouve-la sur c5, son octave sur c3 (pattern 2). Puis trouve-la sur c6, son octave sur c4 (pattern 1). 4 positions de la même note. Refais avec 5 notes. Tu commences à 'voir' le manche en 3D." },
  ],
  quiz: ["q-neck-05","q-neck-27","q-neck-28"],
};

export const quiz = [
  {id:"q-neck-05",courseId:"neck",lessonId:"neck-c3-02",lvl:2,q:"Tu joues Do (case 3, corde 5). Où se trouve son octave la plus proche, sur la corde 3 ?",o:["Case 3","Case 7","Case 10","Case 5"],a:3,exp:"Corde 5 vers corde 3 : le motif est +2 cases. Do en case 3 sur la corde 5 devient donc Do en case 5 sur la corde 3.",xp:40},
  {id:"q-neck-27",courseId:"neck",lessonId:"neck-c3-02",lvl:1,q:"Tu joues Do sur la corde 5, case 3. Où est son octave la plus proche, sur la corde 3 ?",o:["Case 5", "Case 3", "Case 1", "Case 7"],a:0,exp:"Pattern c5 → c3 : deux cases plus haut. Do case 3 corde 5 → Do case 5 corde 3.",xp:30},
  {id:"q-neck-28",courseId:"neck",lessonId:"neck-c3-02",lvl:2,q:"Pourquoi faut-il +2 cases pour trouver l'octave de la corde 5 sur la corde 3 ?",o:["Les cordes sont écartées de 12 demi-tons", "L'écart entre c5 et c3 vaut 10 demi-tons", "La corde 3 est accordée plus bas", "C'est une simple convention d'écriture"],a:1,exp:"Deux quartes consécutives = 10 demi-tons. L'octave en faisant 12, il manque 2 demi-tons, donc 2 cases.",xp:40},
];
