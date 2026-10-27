// Leçon du module « harmony » + les questions de quiz qui s'y rattachent.
// Format « leçon en cartes » décrit dans src/content/README.md.
// Le capodastre : un sillet mobile. Mêmes formes, autre tonalité ;
// transposer une grille (Sol – Ré – Mim – Do, capo 2 = La – Mi – Fa#m – Ré),
// et choisir une tonalité pour une voix. S'appuie sur les notes du manche
// (paliers 3-4) et sur les accords ouverts.

const SOL_CAPO_2 = { type: "chord_diagram", caption: "Forme de Sol, capo en case 2 : sonne La (A)", data: { name: "A", frets: [5, 4, 2, 2, 2, 5], fingers: [2, 1, 0, 0, 0, 3], startFret: 2, barre: { fret: 2, from: 0, to: 5 } } };
const RE_CAPO_2 = { type: "chord_diagram", caption: "Forme de Ré, capo en case 2 : sonne Mi (E)", data: { name: "E", frets: [-1, -1, 2, 4, 5, 4], fingers: [0, 0, 0, 1, 3, 2], startFret: 2, barre: { fret: 2, from: 2, to: 5 } } };

export default {
  id: "harm-capo-01", level: 5,
  title: "Le capodastre et la transposition",
  duration: 9,
  gropiTip: "Pose le capo juste derrière la frette, pas au milieu de la case, puis vérifie l'accordage : la pince tire souvent les cordes un peu vers l'aigu.",
  cartes: [
    { type: "idee", titre: "Un sillet que tu déplaces", texte: [
      "Le capodastre, ou capo, pince toutes les cordes sur une même case : il remplace le sillet, plus haut sur le manche.",
      "Capo en case 2, ta forme de Sol sonne deux demi-tons plus haut : La. Tes doigts ne changent pas, la tonalité si.",
    ], bloc: SOL_CAPO_2 },
    { type: "idee", titre: "Compter en demi-tons", texte: [
      "Chaque case de capo monte tout d'un demi-ton. Pour savoir ce qui sonne, avance chaque accord d'autant de demi-tons : Do, Do#, Ré, Ré#, Mi, Fa, Fa#, Sol, Sol#, La, La#, Si.",
      "Attention aux deux paires sans dièse : de Mi à Fa et de Si à Do, un seul demi-ton. La couleur, majeure ou mineure, ne change jamais.",
    ] },
    { type: "question", quizId: "q-harm-capo-01-lot3" },
    { type: "idee", titre: "Une grille transposée", texte: [
      "Sol – Ré – Mim – Do avec le capo en case 2 : chaque accord monte d'un ton.",
      "Sol devient La, Ré devient Mi, Mim devient Fa#m, Do devient Ré. Tes doigts jouent toujours Sol – Ré – Mim – Do, l'oreille entend La – Mi – Fa#m – Ré.",
    ], bloc: RE_CAPO_2 },
    { type: "a-toi", titre: "La grille, avec et sans capo",
      consigne: "Sol – Ré – Mim – Do, quatre coups par accord au clic à 70, sans capo. Pose le capo en case 2 et rejoue : même doigté, un ton plus haut. Pas de capo sous la main ? Joue la grille et nomme à voix haute ce qu'elle donnerait.",
      bloc: SOL_CAPO_2, bpm: 70, minuteur: 120 },
    { type: "question", quizId: "q-harm-capo-02-lot3" },
    { type: "idee", titre: "Le chemin inverse", texte: [
      "Une grille écrite La – Mi – Fa#m – Ré demande un barré pour Fa#m. Cherche le capo qui la ramène à des formes ouvertes.",
      "Retire à chaque accord autant de demi-tons qu'il y a de cases de capo : en case 2, tu joues Sol – Ré – Mim – Do.",
    ] },
    { type: "idee", titre: "Choisir la tonalité d'une voix", texte: [
      "Une chanson trop grave pour ta voix ? Monte le capo case par case en chantant le refrain, jusqu'à trouver le confort.",
      "Trop aiguë même sans capo ? Change de formes : la même grille jouée à partir de Ré au lieu de Mi descend d'un ton.",
    ] },
    { type: "question", quizId: "q-harm-capo-03-lot3" },
    { type: "recap", points: [
      "Le capo est un sillet mobile : chaque case monte tous les accords d'un demi-ton.",
      "Transposer, c'est avancer chaque accord d'autant de demi-tons ; mineur reste mineur.",
      "Pour une voix ou pour éviter un barré, choisis la case de capo et les formes qui vont avec.",
    ] },
  ],
  quiz: ["q-harm-capo-01-lot3", "q-harm-capo-02-lot3", "q-harm-capo-03-lot3"],
};

export const quiz = [
  {id:"q-harm-capo-01-lot3",courseId:"harmony",lessonId:"harm-capo-01",lvl:2,q:"Capo en case 3, tu joues une forme de Mi mineur. Quel accord entend-on ?",o:["Sol mineur","Fa# mineur","La mineur","Sol# mineur"],a:0,exp:"Trois demi-tons au-dessus de Mi : Fa, Fa#, Sol. La forme reste mineure : Sol mineur.",xp:30},
  {id:"q-harm-capo-02-lot3",courseId:"harmony",lessonId:"harm-capo-01",lvl:2,q:"Capo en case 2, tu joues les formes de Sol, Do et Ré. Dans quelle tonalité sonne le morceau ?",o:["La majeur","Sol majeur","Si majeur","Ré majeur"],a:0,exp:"Les formes sont celles de Sol majeur ; deux demi-tons plus haut, elles sonnent La, Ré et Mi : tonalité de La majeur.",xp:30},
  {id:"q-harm-capo-03-lot3",courseId:"harmony",lessonId:"harm-capo-01",lvl:3,q:"Une grille Sib – Fa – Solm – Mib à jouer sans aucun barré : quel capo et quelles formes ?",o:["Capo 3 : Sol – Ré – Mim – Do","Capo 1 : Sol – Ré – Mim – Do","Capo 3 : La – Mi – Fa#m – Ré","Capo 2 : Sol – Ré – Mim – Do"],a:0,exp:"Trois demi-tons sous Sib, Fa, Solm et Mib, on trouve Sol, Ré, Mim et Do : quatre formes ouvertes. Capo en case 3, elles sonnent dans la tonalité d'origine.",xp:40},
];
