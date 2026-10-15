// Leçon du module « rhythm » + les questions de quiz qui s'y rattachent.
// Format décrit dans src/content/README.md.

export default {
  id: "rhy-c5-04", level: 9,
  title: "Bossa nova : le pattern classique",
  duration: 10,
  content: [
    { type: "p", text: "La bossa nova est un genre musical brésilien né à la fin des années 50 à Rio de Janeiro, créé par João Gilberto, Tom Jobim et Vinicius de Moraes. Son rythme caractéristique est l'un des plus sophistiqués et des plus difficiles à maîtriser en guitare. Mais quand c'est réussi, il est d'une élégance absolue." },
    { type: "h", text: "Origines et contexte" },
    { type: "p", text: "La bossa nova est née du samba brésilien (rythme ternaire complexe) mélangé au jazz américain (harmonies sophistiquées, voicings 7e et 9e). João Gilberto a simplifié le samba pour le jouer seul à la guitare, en chantant par-dessus. Cette simplification 'à l'essentiel' crée le son bossa : épuré, intime, profondément groovy malgré sa légèreté apparente." },
    { type: "h", text: "Le pattern de base (pouce + doigts)" },
    { type: "p", text: "La bossa se joue en fingerstyle (sans médiator). Le pouce joue la basse (alternant fondamentale et quinte) sur les cordes graves. Les doigts (index, majeur, annulaire) jouent les accords sur les cordes aiguës. Le pattern rythmique global crée une anticipation systématique des accords — caractéristique vue dans la leçon sur l'anticipation." },
    { type: "h", text: "Le pattern bossa (simplifié)" },
    { type: "p", text: "Sur 1 mesure de 4/4 : Pouce basse(1) - Doigts accord(et-1) - Pouce basse(2) - Doigts accord(et-2) - Pouce basse(3) - Doigts accord(2et) anticipé - Pouce basse(4) - Doigts accord(et-4). La mesure suivante repart identique. Ce pattern peut varier selon les guitaristes, mais l'alternance pouce-doigts avec anticipation est la base." },
    { type: "h", text: "Les accords bossa" },
    { type: "p", text: "La bossa n'utilise presque jamais de triades simples. Ce sont des accords 7, 9, 11, 13, avec des voicings spécifiques qui ont peu de notes mais beaucoup de couleur. Maj7, m7, 7b9, maj9, m11... La combinaison du rythme syncopé et de ces harmonies riches crée l'identité sonore de la bossa. Gmaj7, Fmaj7, E7, Am7 sont des accords emblématiques du genre." },
    { type: "h", text: "La difficulté : indépendance main droite" },
    { type: "p", text: "La vraie difficulté de la bossa : coordonner un pouce (basse régulière) et des doigts (accords syncopés) de façon indépendante. C'est comme faire deux choses différentes en même temps. La solution : apprendre d'abord la ligne de basse seule. Puis les accords seuls. Puis combiner très lentement. Cette indépendance s'acquiert progressivement, jamais en forçant." },
    { type: "h", text: "Simplifier pour débutants bossa" },
    { type: "p", text: "Si le pattern complet est trop complexe au début : joue simplement les accords sur les contretemps (les 'et') sans la basse. Tu obtiens un 'half bossa' immédiatement reconnaissable. Ajoute la basse au pouce quand le rythme des accords est automatique." },
    {
      type: "strum_pattern",
      caption: "Bossa nova simplifiée — accords sur les contretemps, basse sur les temps",
      data: { pattern: ["B","-H","B","-H","B","-H","-","H"], beats: 4, style: "bossa", bpm: 70 },
    },
    { type: "ref", text: "'The Girl from Ipanema' (Tom Jobim / Vinicius de Moraes, 1962 créée par João Gilberto) : la version originale fingerstyle de João Gilberto est la référence. 'Corcovado' (Quiet Nights) et 'Desafinado' sont aussi des exemples emblématiques. Pour la guitare seule, cherche les arrangements de Baden Powell ou de João Bosco." },
    { type: "tip", text: "Plan bossa sur 2 semaines : Semaine 1 - joue uniquement les accords sur les contretemps à 65 BPM (pattern simplifié). Semaine 2 - ajoute le pouce sur les temps forts. L'indépendance viendra progressivement. Ne force pas — la bossa demande de la patience mais récompense magnifiquement." },
  ],
  quiz: ["q-rhy-39","q-rhy-10"],
};

export const quiz = [
  {id:"q-rhy-39",courseId:"rhythm",lessonId:"rhy-c5-04",lvl:3,q:"Dans la bossa nova, que fait le pouce pendant que les doigts jouent le motif syncopé ?",o:["Il tient une pulsation régulière sur les cordes graves","Il double exactement le motif joué par les doigts","Il reste immobile pendant toute la mesure","Il étouffe les cordes entre chaque accord"],a:0,exp:"Le pouce maintient une base régulière, les doigts syncopent au-dessus : deux couches indépendantes jouées par une seule main. C'est ce qui rend la bossa difficile — et c'est l'exercice d'indépendance le plus payant qui soit.",xp:40},
];
