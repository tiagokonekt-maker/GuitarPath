// Leçon du module « neck » + les questions de quiz qui s'y rattachent.
// Format décrit dans src/content/README.md.

export default {
  id: "neck-c2-04", level: 4,
  title: "Les notes de la corde de Sol (corde 3)",
  duration: 8,
  gropiTip: "Le Si de la case 4 est le repère « bizarre » de la corde 3 : c'est le même Si que la corde 2 à vide, celui qui sert à accorder à l'oreille. Joue les deux ensemble pour les entendre fusionner.",
  content: [
    { type: "p", text: "La corde 3 (Sol) est la dernière des cordes 'basses-médium'. Elle est très utilisée pour les solos blues/rock (le bend de Sol case 7 est iconique chez B.B. King) et pour les triades sur cordes 3-2-1." },
    { type: "h", text: "Les notes case par case" },
    { type: "p", text: "Case 0 = Sol. Case 1 = Sol#. Case 2 = La. Case 3 = La#. Case 4 = Si. Case 5 = Do. Case 6 = Do#. Case 7 = Ré. Case 8 = Ré#. Case 9 = Mi. Case 10 = Fa. Case 11 = Fa#. Case 12 = Sol (octave)." },
    { type: "h", text: "Demi-tons naturels" },
    { type: "p", text: "Si-Do : entre cases 4 et 5. Mi-Fa : entre cases 9 et 10. Le pattern reste cohérent." },
    { type: "h", text: "Notes-ancres" },
    { type: "p", text: "Sol (0), La (2), Si (4), Do (5), Ré (7), Mi (9), Sol (12). 7 notes-clés. La corde 3 a une particularité : la note Si arrive case 4 (et non case 7 comme sur c6) — le décalage de 4 cases entre c4 et c3 vient de la 'cassure' entre c3 et c2 qu'on a vue dans la première leçon." },
    {
      type: "note_grid",
      caption: "Corde 3 (Sol) — attention : Si arrive case 4 (cassure d'accordage)",
      data: {
        string: 3, stringName: "Sol", maxFret: 12,
        highlights: [
          { fret: 0,  label: "Sol", color: "amber" },
          { fret: 2,  label: "La",  color: "green" },
          { fret: 4,  label: "Si",  color: "green" },
          { fret: 5,  label: "Do",  color: "primary" },
          { fret: 7,  label: "Ré",  color: "amber" },
          { fret: 9,  label: "Mi",  color: "green" },
          { fret: 10, label: "Fa",  color: "green" },
          { fret: 12, label: "Sol", color: "amber" },
        ],
      },
    },
    { type: "h", text: "L'usage en solo" },
    { type: "p", text: "La corde 3 est l'une des cordes préférées des solistes blues/rock parce qu'elle se trouve dans la zone médium-aiguë idéale pour le bending. Le Sol case 7 (corde 3) bendé d'un ton vers La est probablement le bend le plus utilisé de toute l'histoire de la guitare blues. B.B. King, Eric Clapton, David Gilmour : tous l'utilisent." },
    { type: "h", text: "Triades sur cordes 3-2-1" },
    { type: "p", text: "Les triades majeures et mineures sur les 3 cordes aiguës (3-2-1) sont une mine d'or pour la guitare moderne (funk, R&B, jazz, pop indé). Connaître les notes de la corde 3 = pouvoir trouver instantanément la fondamentale, la tierce, ou la quinte d'une triade." },
    { type: "h", text: "Le lien avec la corde 6" },
    { type: "p", text: "La corde 3 case 12 = Sol, qui est aussi la corde 6 case 3 (Sol). Décalage : 9 cases. Plus généralement, c3 case X = c6 case (X-9) modulo 12. Si c'est un peu abstrait, retiens juste : Sol case 3 c6 = Sol case 0 c3 = Sol case 12 c3 (tous des Sol à différentes octaves)." },
    { type: "ref", text: "Dans la position 1 de La pentatonique, le bend le plus naturel se joue sur la corde 3, case 7 : un Ré tiré d'un ton, jusqu'au Mi. Les deux notes appartiennent à la gamme, le bend sonne donc « juste » à coup sûr. C'est un geste de base du blues et du rock." },
    { type: "tip", text: "Drill rapide : joue Sol c6 case 3, puis Sol c4 case 5, puis Sol c3 case 0. Trois Sol à différentes octaves. Identifie chaque note. Tu commences à 'voir' le manche en 3D." },
  ],
  quiz: ["q-neck-21","q-neck-22","q-neck-23"],
};

export const quiz = [
  {id:"q-neck-21",courseId:"neck",lessonId:"neck-c2-04",lvl:2,q:"Sur la corde 3 (Sol), à quelle case trouve-t-on la note Si ?",o:["Case 7","Case 5","Case 2","Case 4"],a:3,exp:"Contrairement au schéma habituel (Si souvent case 7 sur d'autres cordes), la corde 3 a une cassure : Si arrive dès la case 4.",xp:35},
  {id:"q-neck-22",courseId:"neck",lessonId:"neck-c2-04",lvl:2,q:"Sur la corde 3 (Sol), quelle note trouve-t-on à la case 5 ?",o:["Do","Ré","La","Si"],a:0,exp:"Case 0 Sol, 2 La, 4 Si, 5 Do : le demi-ton Si-Do tombe entre les cases 4 et 5, exactement comme sur les autres cordes.",xp:35},
  {id:"q-neck-23",courseId:"neck",lessonId:"neck-c2-04",lvl:3,q:"Dans la position 1 de La pentatonique mineure, le bend le plus naturel se joue sur la corde 3, à quelle case ?",o:["Case 5","Case 7","Case 9","Case 3"],a:1,exp:"Ré (corde 3 case 7), tiré d'un ton jusqu'au Mi : les deux notes sont dans la gamme, le bend sonne juste.",xp:45},
];
