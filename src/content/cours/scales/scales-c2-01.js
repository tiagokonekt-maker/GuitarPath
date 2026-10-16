// Leçon du module « scales » + les questions de quiz qui s'y rattachent.
// Format décrit dans src/content/README.md.

export default {
  id: "scales-c2-01", level: 5,
  title: "Qu'est-ce qu'une gamme (vraiment) ?",
  duration: 8,
  gropiTip: "Applique la formule T-T-DT-T-T-T-DT sur la seule corde 5 depuis La à vide : cases 0, 2, 4, 5, 7, 9, 11, 12. Tu viens de construire La majeur sans connaître ses notes.",
  content: [
    { type: "p", text: "Tu entends parler de gammes depuis que tu joues : gamme majeure, mineure, blues, pentatonique... Mais qu'est-ce qu'une gamme, au fond ? La réponse est simple, et une fois que tu l'as comprise, tout devient lumineux.", img: "/illus-escalier-notes.webp", imgAlt: "Escalier avec les 7 notes Do Ré Mi Fa Sol La Si sur chaque marche", imgSide: "right" },
    { type: "h", text: "Définition" },
    { type: "p", text: "Une gamme est une SÉLECTION ORDONNÉE de notes choisies parmi les 12 sons disponibles. C'est un menu. Au lieu d'avoir accès aux 12 notes (la gamme chromatique complète), une gamme te donne 5, 6, 7 ou 8 notes spécifiques qui sonnent bien ensemble dans un certain contexte." },
    { type: "h", text: "Pourquoi limiter le choix ?" },
    { type: "p", text: "Parce qu'avec 12 notes disponibles, tout 'fonctionne' techniquement, mais pas tout sonne 'juste' ensemble. Une gamme te garantit une cohérence sonore. Quand tu improvises dans une gamme donnée, chacune des notes que tu joues 'colle' avec la tonalité du morceau. C'est une assurance contre la fausse note." },
    { type: "h", text: "Les ingrédients d'une gamme" },
    { type: "p", text: "Une gamme est définie par 3 choses : (1) une fondamentale (la note de départ, qui donne son nom à la gamme), (2) un nombre de notes (5 = pentatonique, 7 = heptatonique = 'normale', 8 = octatonique...), (3) une formule d'intervalles (ex: T-T-DT-T-T-T-DT pour la gamme majeure)." },
    { type: "h", text: "Exemple concret" },
    { type: "p", text: "La gamme de Do majeur a : (1) fondamentale = Do, (2) 7 notes, (3) formule T-T-DT-T-T-T-DT. En appliquant la formule depuis Do, tu obtiens Do-Ré-Mi-Fa-Sol-La-Si. C'est ta gamme. Toutes ces 7 notes sonneront 'naturelles' dans un morceau en Do majeur." },
    { type: "note_grid", caption: "Do majeur sur la seule corde 5 : la formule T-T-DT-T-T-T-DT se lit dans les écarts (2-2-1-2-2-2-1 cases)", data: {string: 5, stringName: "La", maxFret: 15, highlights: [{fret: 3, label: "Do", color: "amber"}, {fret: 5, label: "Ré", color: "primary"}, {fret: 7, label: "Mi", color: "primary"}, {fret: 8, label: "Fa", color: "primary"}, {fret: 10, label: "Sol", color: "primary"}, {fret: 12, label: "La", color: "primary"}, {fret: 14, label: "Si", color: "primary"}, {fret: 15, label: "Do", color: "amber"}]} },
    { type: "scale_pattern", caption: "Gamme de Do majeur — position ouverte : les mêmes 7 notes, réparties sur les 6 cordes", data: {startFret: 0, endFret: 3, rootColor: "amber", noteColor: "primary", strings: [{frets: [0,1,3], root: []}, {frets: [0,2,3], root: [3]}, {frets: [0,2,3], root: []}, {frets: [0,2], root: []}, {frets: [0,1,3], root: [1]}, {frets: [0,1,3], root: []}], noteMap: {"0,0":"Mi", "1,0":"Fa", "3,0":"Sol", "0,1":"La", "2,1":"Si", "3,1":"Do", "0,2":"Ré", "2,2":"Mi", "3,2":"Fa", "0,3":"Sol", "2,3":"La", "0,4":"Si", "1,4":"Do", "3,4":"Ré", "0,5":"Mi", "1,5":"Fa", "3,5":"Sol"}} },
    { type: "h", text: "Et il existe combien de gammes ?" },
    { type: "p", text: "Théoriquement, des centaines. En pratique, on utilise quelques familles principales : majeure, mineure (3 variantes), pentatoniques (mineure et majeure), blues, modes (7), gammes 'exotiques' (diminuée, par tons, hongroise...). On va se concentrer sur les essentielles." },
    { type: "ref", text: "Comparaison utile : une gamme, c'est comme une palette de couleurs pour un peintre. La gamme majeure = palette joyeuse et lumineuse. La gamme mineure = palette mélancolique. La gamme blues = palette urbaine, dramatique. Le choix de la gamme = le choix de l'ambiance." },
    { type: "tip", text: "Ne mémorise pas une gamme comme une suite de notes (Do-Ré-Mi...). Mémorise-la comme une formule d'intervalles (T-T-DT-T-T-T-DT). Ainsi tu peux la reconstruire dans n'importe quelle tonalité." },
  ],
  quiz: ["q-scales-28", "q-scales-29", "q-scales-54"],
};

export const quiz = [
  {id:"q-scales-28",courseId:"scales",lessonId:"scales-c2-01",lvl:2,q:"Deux gammes partent de La et ont 7 notes chacune, mais ne sonnent pas pareil. Qu'est-ce qui les distingue ?",o:["Leur formule d'intervalles","Leur note fondamentale","Leur nombre de notes","Le tempo auquel on les joue"],a:0,exp:"Une gamme se définit par sa fondamentale, son nombre de notes et sa formule d'intervalles. Ici les deux premiers sont identiques : seule la formule (T-T-DT… ou T-DT-T…) change, et avec elle la couleur.",xp:40},
  {id:"q-scales-29",courseId:"scales",lessonId:"scales-c2-01",lvl:1,q:"Pourquoi mémoriser une gamme sous forme de formule (T-T-DT…) plutôt que de notes ?",o:["Pour la jouer plus vite", "Pour éviter d'avoir à lire les dièses", "Pour la reconstruire dans toute tonalité", "Pour ne jouer que sur une corde"],a:2,exp:"La formule ne dépend pas de la note de départ : appliquée depuis n'importe quelle fondamentale, elle redonne la gamme.",xp:30},
  {id:"q-scales-54",courseId:"scales",lessonId:"scales-c2-01",lvl:2,q:"Tu appliques la formule T-T-DT-T-T-T-DT en partant de Ré. Quelle est la troisième note ?",o:["Fa#","Fa","Sol","Mi"],a:0,exp:"Ré + un ton = Mi, Mi + un ton = Fa#. La formule impose un ton entier après Mi : Fa naturel ne serait qu'à un demi-ton. D'où Ré majeur : Ré Mi Fa# Sol La Si Do#.",xp:40},
];
