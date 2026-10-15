// Leçon du module « debut » + les questions de quiz qui s'y rattachent.
// Format décrit dans src/content/README.md.

export default {
  id: "debut-c1-06", level: 0, unite: 1,
  title: "Accorder à l'oreille : la méthode de la 5e case",
  duration: 8,
  content: [
    { type: "p", text: "Pas d'accordeur sous la main, pas de batterie, pas de réseau ? Tu peux accorder ta guitare avec elle-même. Le principe : sur une corde, une case précise donne exactement la même note que la corde suivante jouée à vide. Il suffit de comparer les deux sons et d'ajuster. En prime, c'est un excellent entraînement pour l'oreille." },
    { type: "h", text: "Le principe" },
    { type: "p", text: "On part d'une corde qu'on considère comme juste : en général la corde 6, accordée avec l'accordeur ou une référence (un piano, une autre guitare). Ensuite, chaque corde sert à accorder la suivante. Ta guitare sera juste avec elle-même, ce qui suffit largement pour jouer seul." },
    { type: "h", text: "Les cinq comparaisons" },
    { type: "p", text: "1. La (corde 6, case 5) doit sonner comme la corde 5 à vide : ajuste la corde 5. 2. Ré (corde 5, case 5) doit sonner comme la corde 4 à vide : ajuste la corde 4. 3. Sol (corde 4, case 5) doit sonner comme la corde 3 à vide : ajuste la corde 3. 4. Attention, exception : Si (corde 3, case 4) doit sonner comme la corde 2 à vide. 5. Mi (corde 2, case 5) doit sonner comme la corde 1 à vide." },
    {
      type: "fretboard",
      caption: "Les repères d'accordage : case 5 partout, sauf case 4 sur la corde de Sol",
      data: {
        frets: 6, startFret: 0, showStringNames: true, showFretNumbers: true,
        notes: [
          { string: 6, fret: 5, label: "La",  color: "primary" },
          { string: 5, fret: 5, label: "Ré",  color: "primary" },
          { string: 4, fret: 5, label: "Sol", color: "primary" },
          { string: 3, fret: 4, label: "Si",  color: "coral" },
          { string: 2, fret: 5, label: "Mi",  color: "primary" },
        ],
      },
    },
    { type: "p", text: "Pourquoi la case 4 entre Sol et Si ? Entre toutes les autres cordes voisines, l'écart est de 5 demi-tons (une case = un demi-ton), d'où la case 5. Entre Sol et Si, l'écart n'est que de 4 demi-tons. C'est la seule irrégularité de l'accordage standard, et tu la retrouveras souvent plus tard." },
    { type: "h", text: "Entendre les « battements »" },
    { type: "p", text: "Joue les deux notes ensemble et laisse-les sonner. Quand elles sont presque identiques, tu entends une ondulation, une sorte de « wa-wa-wa » : ce sont les battements. Plus les notes se rapprochent, plus l'ondulation ralentit. Quand elle disparaît et que les deux notes fusionnent en un seul son stable, c'est juste." },
    { type: "tip", text: "Si tu n'entends pas si la corde est trop haute ou trop basse, détends-la franchement (elle sera clairement trop basse), puis remonte doucement en écoutant les battements ralentir. Comme avec l'accordeur : on arrive à la note par en dessous." },
    { type: "ref", text: "Ta guitare peut être juste avec elle-même mais pas au « vrai » diapason (La = 440 Hz). Seul, ça ne gêne pas. Pour jouer avec d'autres musiciens ou sur un enregistrement, repasse par l'accordeur (Outils → Accordeur) pour que tout le monde soit accordé pareil." },
  ],
  quiz: ["q-debut-18", "q-debut-19", "q-debut-20", "q-debut-21"],
};

export const quiz = [
  {id:"q-debut-18",courseId:"debut",lessonId:"debut-c1-06",lvl:1,q:"Pour accorder la corde 5 (La) à l'oreille, quelle note de la corde 6 sers-tu de référence ?",o:["La case 3","La case 4","La case 5","La case 7"],a:2,exp:"Corde 6, case 5 = La, la même note que la corde 5 à vide. On compare les deux et on ajuste la corde 5.",xp:25},
  {id:"q-debut-19",courseId:"debut",lessonId:"debut-c1-06",lvl:1,q:"Quelle comparaison fait exception à la règle de la 5e case ?",o:["Corde 6 vers corde 5","Corde 5 vers corde 4","Corde 3 vers corde 2, à la case 4","Corde 2 vers corde 1"],a:2,exp:"Entre Sol (corde 3) et Si (corde 2), l'écart est de 4 demi-tons au lieu de 5 : on prend la case 4 de la corde 3.",xp:25},
  {id:"q-debut-20",courseId:"debut",lessonId:"debut-c1-06",lvl:2,q:"En comparant deux notes, tu entends une ondulation qui ralentit. Qu'est-ce que ça signifie ?",o:["Les deux notes se rapprochent de l'unisson","La corde va casser","Tu as pris la mauvaise case","La guitare a besoin de cordes neuves"],a:0,exp:"Ce sont les battements : plus deux notes sont proches, plus l'ondulation est lente. Quand elle disparaît, les notes sont à l'unisson.",xp:30},
  {id:"q-debut-21",courseId:"debut",lessonId:"debut-c1-06",lvl:2,q:"Combien de demi-tons séparent deux cordes voisines, hors du duo Sol–Si ?",o:["3","4","5","7"],a:2,exp:"5 demi-tons (une quarte juste), d'où la case 5. Entre Sol et Si, seulement 4 demi-tons (une tierce majeure), d'où la case 4.",xp:30},
];
