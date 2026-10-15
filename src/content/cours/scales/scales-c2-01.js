// Leçon du module « scales » + les questions de quiz qui s'y rattachent.
// Format décrit dans src/content/README.md.

export default {
  id: "scales-c2-01", level: 5,
  title: "Qu'est-ce qu'une gamme (vraiment) ?",
  duration: 8,
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
    { type: "h", text: "Et il existe combien de gammes ?" },
    { type: "p", text: "Théoriquement, des centaines. En pratique, on utilise quelques familles principales : majeure, mineure (3 variantes), pentatoniques (mineure et majeure), blues, modes (7), gammes 'exotiques' (diminuée, par tons, hongroise...). On va se concentrer sur les essentielles." },
    { type: "ref", text: "Comparaison utile : une gamme, c'est comme une palette de couleurs pour un peintre. La gamme majeure = palette joyeuse et lumineuse. La gamme mineure = palette mélancolique. La gamme blues = palette urbaine, dramatique. Le choix de la gamme = le choix de l'ambiance." },
    { type: "tip", text: "Ne mémorise pas une gamme comme une suite de notes (Do-Ré-Mi...). Mémorise-la comme une formule d'intervalles (T-T-DT-T-T-T-DT). Ainsi tu peux la reconstruire dans n'importe quelle tonalité." },
  ],
  quiz: ["q-scales-28", "q-scales-29"],
};

export const quiz = [
  {id:"q-scales-28",courseId:"scales",lessonId:"scales-c2-01",lvl:1,q:"Quels sont les 3 ingrédients qui définissent une gamme ?",o:["Une tonalité, un tempo et un rythme", "Une fondamentale, un nombre de notes, une formule", "Un accord de départ, une mesure et une nuance", "Une corde, une position et un doigté"],a:1,exp:"Une gamme = une fondamentale (qui la nomme), un nombre de notes et une formule d'intervalles.",xp:30},
  {id:"q-scales-29",courseId:"scales",lessonId:"scales-c2-01",lvl:1,q:"Pourquoi mémoriser une gamme sous forme de formule (T-T-DT…) plutôt que de notes ?",o:["Pour la jouer plus vite", "Pour éviter d'avoir à lire les dièses", "Pour la reconstruire dans toute tonalité", "Pour ne jouer que sur une corde"],a:2,exp:"La formule ne dépend pas de la note de départ : appliquée depuis n'importe quelle fondamentale, elle redonne la gamme.",xp:30},
];
