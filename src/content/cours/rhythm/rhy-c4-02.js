// Leçon du module « rhythm » + les questions de quiz qui s'y rattachent.
// Format décrit dans src/content/README.md.

export default {
  id: "rhy-c4-02", level: 4,
  title: "Patterns de strumming : folk, pop, rock",
  duration: 12,
  gropiTip: "Chante le pattern pop avant de le jouer : « bas, bas-haut, haut-bas-haut ». Le piège : sur le 3, ta main doit quand même descendre dans le vide, sinon le haut qui suit tombe à côté.",
  content: [
    { type: "p", text: "Dans Premiers pas, tu as joué tes premières rythmiques ; ici, on va plus loin avec les patterns de chaque style et leur notation. Un pattern de strumming, c'est une séquence organisée de coups bas (B) et hauts (H) qui se répète sur plusieurs mesures. Chaque genre musical a ses patterns caractéristiques. En apprendre quelques-uns te donne un vocabulaire rythmique immédiatement utilisable." },
    { type: "h", text: "Notation des patterns" },
    { type: "p", text: "On notera les patterns ainsi : B = coup bas (downstroke), H = coup haut (upstroke), - = silence (mouvement de main sans contact avec les cordes), x = accord étouffé (contact avec les cordes mais cordes étouffées, son 'click'). Les temps sont séparés par une virgule. Ex : BH, BH, BH, BH = 1 mesure de croches (bas-haut sur chaque temps)." },
    { type: "h", text: "Pattern folk basique (le plus universel)" },
    { type: "p", text: "Séquence : BH, BH, BH, BH. Sur une mesure de 4/4 en croches : Bas (1) - Haut (et-1) - Bas (2) - Haut (et-2) - Bas (3) - Haut (et-3) - Bas (4) - Haut (et-4). Tout le monde joue, tous les coups sonnent. Son équilibré. Utilisé dans 'Knockin' on Heaven's Door' (Dylan), '500 Miles' (The Proclaimers), la majorité des chansons folk acoustiques." },
    {
      type: "strum_pattern",
      caption: "Pattern folk — B H B H B H B H (8 croches uniformes)",
      data: { pattern: ["B","H","B","H","B","H","B","H"], beats: 4, style: "folk", bpm: 90 },
    },
    { type: "h", text: "Pattern pop (down-up accents syncopés)" },
    { type: "p", text: "Séquence : B-, BH, -H, BH. En 4/4 : Bas(1) - silence(et-1) - Bas(2) - Haut(et-2) - silence(3) - Haut(et-3) - Bas(4) - Haut(et-4). Le « et » du 1 et le 3 manqués (la main passe dans le vide) créent la syncope caractéristique. Très répandu en pop. Un peu plus complexe que le folk basique." },
    {
      type: "strum_pattern",
      caption: "Pattern pop syncopé — silence sur le 3, accents contretemps",
      data: { pattern: ["B","-","B","H","-","H","B","H"], beats: 4, style: "pop", bpm: 90 },
    },
    { type: "h", text: "Pattern rock power chords (tous bas)" },
    { type: "p", text: "Séquence : B B B B (4 coups bas par mesure). Tous des downstrokes. Son puissant, agressif, direct. Souvent avec palm mute sur certains coups. C'est la base du rock AC/DC, Ramones, Green Day. La régularité des downstrokes crée une énergie compacte impossible à obtenir avec des coups hauts." },
    {
      type: "strum_pattern",
      caption: "Pattern rock — 4 downstrokes, toute l'énergie vers le bas",
      data: { pattern: ["B","B","B","B"], beats: 4, style: "rock", bpm: 120 },
    },
    { type: "h", text: "Pattern rock syncopé (intermédiaire)" },
    { type: "p", text: "Séquence : B-, BH, -H, BH — le même mouvement que le pop, mais joué en power chords, avec du palm mute sur les coups bas et un accent franc sur le 2 et le 4. Ce n'est pas le motif qui change, c'est l'attaque : plus groovy que 4 downstrokes, plus « rock » que le pop acoustique." },
    {
      type: "strum_pattern",
      caption: "Pattern rock syncopé — B-, BH, -H, BH (même geste que le pop, en power chords)",
      data: { pattern: ["B", "-", "B", "H", "-", "H", "B", "H"], beats: 4, style: "rock", bpm: 110 },
    },
    { type: "h", text: "Pattern ballade lente" },
    { type: "p", text: "Pour les tempos très lents (60-75 BPM) : arpège les cordes une par une au lieu de strummer. Pouce sur c6 (temps 1), index sur c3 (et), majeur sur c2 (2), annulaire sur c1 (et-2), répète. Ce 'finger-picking ballade' est utilisé dans les ballades acoustiques (John Denver, early Coldplay)." },
    { type: "h", text: "Comment choisir un pattern" },
    { type: "p", text: "Règle pratique : écoute la chanson et imite ce que tu entends. Le pattern doit correspondre à l'émotion de la chanson. Lent et triste → ballade arpégée ou noires. Energique et puissant → downstrokes rock. Léger et joyeux → folk ou pop syncopé. En doute ? Le pattern folk basique (B-BH-BH-BH) fonctionne dans la plupart des contextes." },
    { type: "ref", text: "Noel Gallagher (Oasis) utilise principalement 2 patterns : un pattern pop syncopé pour les ballades ('Wonderwall', 'Don't Look Back in Anger') et des downstrokes rock pour les morceaux énergiques. Écoute ces deux chansons en te concentrant uniquement sur sa main droite." },
    { type: "tip", text: "Apprentissage des patterns : prends le pattern pop syncopé. Joue-le d'abord sur UNE SEULE corde à 60 BPM. Quand c'est fluide, joue sur 2 cordes. Puis sur l'accord complet. Cette progression évite de gérer trop de variables en même temps." },
  ],
  quiz: ["q-rhy-22", "q-rhy-23", "q-rhy-24"],
};

export const quiz = [
  {id:"q-rhy-22",courseId:"rhythm",lessonId:"rhy-c4-02",lvl:1,q:"Le pattern de strumming le plus répandu en pop tient en combien de temps ?",o:["Un seul temps, répété","Deux temps, répétés deux fois","Quatre mesures complètes","Une mesure de quatre temps"],a:3,exp:"La quasi-totalité des patterns pop se bouclent sur une mesure de 4/4 et se répètent. En apprendre un solide t'ouvre des centaines de morceaux — c'est le meilleur rapport effort/répertoire de la guitare.",xp:25},
  {id:"q-rhy-23",courseId:"rhythm",lessonId:"rhy-c4-02",lvl:2,q:"Dans le pattern pop B-, BH, -H, BH, quand la main passe-t-elle dans le vide ?",o:["Sur le « et » du 1 et le temps 3","Sur le temps 1 et le « et » du 3","Sur les temps 2 et 4","Jamais, tous les coups sonnent"],a:0,exp:"B- : le 1 sonne, le « et » du 1 est manqué. BH : le 2 et son « et » sonnent. -H : le 3 est manqué, son « et » sonne. Le bras ne s'arrête jamais : il passe au-dessus des cordes sur ces deux trous, ce qui crée la syncope du pattern.",xp:30},
  {id:"q-rhy-24",courseId:"rhythm",lessonId:"rhy-c4-02",lvl:3,q:"Pourquoi un même pattern sonne folk sur une guitare et rock sur une autre ?",o:["Parce que le tempo employé n'est pas le même", "Les accents, l'étouffement, les cordes jouées", "Parce que les accords choisis sont complètement différents", "À cause du nombre de cordes de l'instrument"],a:1,exp:"Le squelette rythmique est identique ; ce qui change est l'interprétation — accents plus marqués, palm mute, attaque limitée aux cordes graves. Un pattern n'est pas un genre, c'est une grille qu'on habille.",xp:40},
];
