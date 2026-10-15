// Leçon du module « neck » + les questions de quiz qui s'y rattachent.
// Format décrit dans src/content/README.md.

export default {
  id: "neck-c1-03", level: 3,
  title: "Les amers visuels du manche",
  duration: 7,
  gropiTip: "Bonne nouvelle : la corde 1 porte exactement les mêmes notes que la corde 6, deux octaves plus haut. Tes repères Sol (3), La (5), Si (7) et Mi (12) valent pour les deux cordes de Mi.",
  content: [
    { type: "p", text: "Tu as sûrement remarqué que ta guitare a des points (ou parfois des incrustations plus élaborées) à certaines cases du manche. Ce ne sont pas des décorations : ce sont tes amers de navigation. Sans eux, tu serais perdu sur un manche de 22 cases. Avec eux, tu navigues à l'aise." },
    { type: "h", text: "Les positions des points" },
    { type: "p", text: "Sur la quasi-totalité des guitares, les points sont aux cases 3, 5, 7, 9, et 12 (avec un double point pour la 12). Puis le cycle reprend : 15, 17, 19, 21, 24. Ces emplacements ne sont pas aléatoires. Ils correspondent à des notes-clés et à des intervalles importants depuis la corde à vide." },
    { type: "h", text: "Pourquoi ces cases précisément ?" },
    { type: "p", text: "Les cases 3, 5, 7, 9 sont les 'demi-tons piliers' : ils marquent des intervalles importants depuis la corde à vide. Sur la corde de Mi : case 3 = Sol (tierce mineure), case 5 = La (quarte juste), case 7 = Si (quinte juste), case 9 = Do# (sixte majeure), case 12 = Mi (octave). Ces cases sont des références harmoniques que les fabricants ont choisies pour faciliter ta navigation." },
    { type: "h", text: "Les notes-repères principales" },
    { type: "p", text: "Mémorise dès maintenant ces 4 'notes-repères' qui sont à la base de toute navigation sur la corde 6 : case 3 = Sol, case 5 = La, case 7 = Si, case 12 = Mi (octave). Avec ces 4 notes, tu peux déduire toutes les autres en remontant ou descendant d'1-2 cases. C'est ton GPS." },
    {
      type: "fretboard",
      caption: "Amers du manche — points aux cases 3, 5, 7, 9 et double-point case 12",
      data: {
        frets: 12, startFret: 0,
        showStringNames: false, showFretNumbers: true,
        markerFrets: [3, 5, 7, 9, 12],
        notes: [
          { string: 6, fret: 3,  label: "Sol", color: "amber" },
          { string: 6, fret: 5,  label: "La",  color: "green" },
          { string: 6, fret: 7,  label: "Si",  color: "neutral" },
          { string: 6, fret: 9, label: "Do#", color: "neutral" },
          { string: 6, fret: 12, label: "Mi",  color: "amber", root: true },
        ],
      },
    },
    { type: "h", text: "Sur la corde de La (5e)" },
    { type: "p", text: "Mêmes amers visuels (cases 3, 5, 7, 9, 12), mais notes différentes. Case 3 = Do, case 5 = Ré, case 7 = Mi, case 12 = La (octave). Mémorise ces 4 notes aussi : ce sont les fondamentales des accords majeurs ouverts les plus utilisés." },
    { type: "h", text: "Méthode pédagogique : ancrer 4 notes par corde" },
    { type: "p", text: "Au lieu d'essayer de mémoriser les 12 notes de chaque corde d'un coup (impossible), apprends 4 notes par corde aux cases 0, 5, 7 et 12. Ces 4 notes par corde × 6 cordes = 24 notes ancrées. À partir de ces ancres, tu déduis le reste par voisinage (case d'à côté = +1 ou -1 demi-ton). C'est la méthode la plus efficace." },
    { type: "ref", text: "Sur la plupart des guitares de qualité (Gibson, Fender, Martin, Taylor...), les amers ont des designs spécifiques selon le luthier. Les Les Paul ont des trapèzes de nacre, les Stratocaster des points blancs, les Telecaster aussi. Mais dans tous les cas, leur emplacement est identique : cases 3, 5, 7, 9, 12, 15, 17, 19, 21." },
    { type: "tip", text: "Drill quotidien (1 minute) : ferme les yeux, mets ton index sur une case au hasard. Ouvre les yeux et nomme la note instantanément. Refais 10 fois. En 2 semaines, ton cerveau aura cartographié le manche." },
  ],
  quiz: ["q-base-15"],
};

export const quiz = [
  {id:"q-base-15",courseId:"neck",lessonId:"neck-c1-03",lvl:2,q:"Quelle case porte traditionnellement un repère double sur le manche ?",o:["La 7e","La 9e","La 12e","La 5e"],a:2,exp:"Les repères simples sont aux cases 3, 5, 7 et 9 ; la case 12 porte un repère double car elle marque l'octave complète.",xp:35},
];
