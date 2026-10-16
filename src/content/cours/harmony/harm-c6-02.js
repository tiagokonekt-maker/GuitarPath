// Leçon du module « harmony » + les questions de quiz qui s'y rattachent.
// Format décrit dans src/content/README.md.

export default {
  id: "harm-c6-02", level: 7,
  title: "I-V-vi-IV : la progression pop",
  duration: 9,
  gropiTip: "Joue la boucle en Sol (Sol-Ré-Mim-Do) avec un capodaste en case 2 : mêmes doigtés, mais tu sonnes en La (La-Mi-Fa#m-Ré). Le réflexe idéal pour s'adapter à la voix d'un chanteur.",
  content: [
    { type: "p", text: "Si I-IV-V est l'ADN du blues, I-V-vi-IV est l'ADN de la pop moderne. Cette progression simple mais redoutablement efficace est présente dans des centaines de chansons parmi les plus écoutées des 40 dernières années. Connaître I-V-vi-IV, c'est tenir la clé d'une immense partie du répertoire pop." },
    { type: "h", text: "La formule" },
    { type: "p", text: "I (tonique majeur) → V (dominante) → vi (relatif mineur = tonique douce) → IV (sous-dominante). En Do majeur : Do-Sol-La mineur-Fa. En Sol majeur : Sol-Ré-Mi mineur-Do. La particularité : cette progression commence et finit par des accords de la famille tonique (I et vi), ce qui lui donne un caractère stable et 'ronronnant'." },
    {
      type: "degree_chart",
      caption: "I-V-vi-IV en Do majeur",
      data: {
        boxes: [
          { top: "I",  label: "Do — Tonique",         sub: "T",  tint: "green" },
          { top: "V",  label: "Sol — Dominante",       sub: "D",  tint: "coral" },
          { top: "vi", label: "La mineur — Tonique",   sub: "T",  tint: "green" },
          { top: "IV", label: "Fa — Sous-dominante",   sub: "SD", tint: "amber" },
        ],
      },
    },
    { type: "h", text: "Le catalogue" },
    { type: "p", text: "'Let It Be' (Beatles, 1970) en Do. 'No Woman No Cry' (Bob Marley, 1975) en Do. 'With Or Without You' (U2, 1987) en Ré. 'Don't Stop Believin'' (Journey, 1981) en Mi. 'Someone Like You' (Adele, 2011) en La. 'Pompeii' (Bastille) en Mi. Ces chansons ont des styles, des époques, des continents différents. Un seul dénominateur commun : I-V-vi-IV." },
    { type: "h", text: "Pourquoi ça marche si bien ?" },
    { type: "p", text: "Plusieurs raisons. Le vi (relatif mineur) apporte une touche de mélancolie sans rompre l'ambiance positive globale — c'est l'équilibre parfait entre joie et émotion. La progression est circulaire : elle peut tourner indéfiniment sans résoudre définitivement, ce qui la rend idéale pour les couplets et refrains. Et elle est prévisible juste assez pour être confortable, mais avec le vi qui apporte une surprise légère." },
    { type: "h", text: "Variantes" },
    { type: "p", text: "vi-IV-I-V (commence sur le mineur) : 'Apologize' (OneRepublic), 'Numb' (Linkin Park). Même 4 accords, ordre différent. IV-I-V-vi : variante ascendante. I-V-IV-vi : variante descendante. Ces réarrangements créent des émotions différentes avec les mêmes matériaux. C'est l'universalité de cette palette de 4 accords." },
    { type: "h", text: "Le piège : l'originalité dans le banal" },
    { type: "p", text: "La progression I-V-vi-IV est si utilisée qu'elle peut sembler 'paresseuse'. Mais les grands compositeurs savent qu'une progression simple laisse toute la place à la mélodie, aux paroles, à l'arrangement et à la production. Paul McCartney a dit que 'Let It Be' n'avait rien d'original harmoniquement — c'est tout le reste qui la rend unique. La progression est le support, pas la star." },
    { type: "ref", text: "YouTube : cherche 'Axis of Awesome 4 chords'. C'est une vidéo culte où le groupe joue des dizaines de chansons différentes sur la même progression I-V-vi-IV sans s'arrêter. Écouter ça en entier est à la fois comique et profondément éclairant sur la nature de la pop music." },
    { type: "tip", text: "Exercice de composition : utilise I-V-vi-IV comme base. Mais au lieu de plaquer les accords bêtement, essaie différentes rythmiques (arpèges, strumming, picking), différents registres (graves, medium, aigus), différentes vitesses (lente et mélancolique, rapide et énergique). Même progression, 10 morceaux différents possibles." },
  ],
  quiz: ["q-harm-30", "q-harm-31", "q-harm-59"],
};

export const quiz = [
  {id:"q-harm-30",courseId:"harmony",lessonId:"harm-c6-02",lvl:1,q:"En Do majeur, que donne la progression I-V-vi-IV ?",o:["Do-Fa-Sol-La m", "Do-Sol-La m-Fa", "Do-La m-Fa-Sol", "Do-Sol-Fa-Mi m"],a:1,exp:"I = Do, V = Sol, vi = La mineur, IV = Fa.",xp:30},
  {id:"q-harm-31",courseId:"harmony",lessonId:"harm-c6-02",lvl:2,q:"Dans I-V-vi-IV, quel rôle joue l'accord vi ?",o:["Il crée la tension principale", "Il change de tonalité", "Il apporte une touche mélancolique", "Il remplace la tonique à la fin de la grille"],a:2,exp:"Le vi, relatif mineur, ajoute une couleur mélancolique sans casser l'ambiance majeure du morceau.",xp:40},
  {id:"q-harm-59",courseId:"harmony",lessonId:"harm-c6-02",lvl:2,q:"En Ré majeur, que donne la progression I-V-vi-IV ?",o:["Ré - La - Si m - Sol","Ré - Sol - Si m - La","Ré - La - Fa# m - Sol","Ré - Mi m - Si m - Sol"],a:0,exp:"Ré majeur : I = Ré, V = La, vi = Si mineur, IV = Sol. C'est la grille de « With Or Without You » (U2).",xp:40},
];
