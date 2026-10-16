// Leçon du module « neck » + les questions de quiz qui s'y rattachent.
// Format décrit dans src/content/README.md.

export default {
  id: "neck-c3-03", level: 5,
  title: "Patterns octaves 3 et 4 : l'asymétrie corde 2-3",
  duration: 9,
  gropiTip: "Le pattern 3 se cache dans Ré ouvert (xx0232) : corde 4 à vide = Ré, corde 2 case 3 = Ré, une octave pile à +3 cases. Et dans Sol (320003), corde 3 à vide et corde 1 case 3 font le pattern 4.",
  content: [
    { type: "p", text: "Les deux derniers patterns d'octaves utilisent les cordes les plus aiguës (c3, c2, c1). Mais ATTENTION : ici, l'asymétrie de l'accordage (la fameuse 'cassure' entre c3 et c2) change la règle. Tu dois ajouter +3 cases au lieu de +2. Comprendre pourquoi te fait gagner du temps." },
    { type: "h", text: "Le pattern 3 : c4 → c2, +3 cases" },
    { type: "p", text: "Si tu joues une note sur la corde 4, son octave sur la corde 2 se trouve à +3 cases (et non +2). Exemple : Ré case 0 corde 4 → Ré case 3 corde 2 (octave). Sol case 5 corde 4 → Sol case 8 corde 2 (octave). La case 7 corde 4 → La case 10 corde 2 (octave)." },
    { type: "h", text: "Pourquoi +3 cases au lieu de +2 ?" },
    { type: "p", text: "Souviens-toi : entre c3 et c2, l'écart est seulement de 4 demi-tons (tierce majeure), au lieu de 5 demi-tons (quarte juste) entre les autres cordes. Cette 'case manquante' fait que pour aller de c4 à c2 (en sautant c3), tu dois compenser : 5 (c4→c3) + 4 (c3→c2) = 9 demi-tons. Pour atteindre l'octave (12 demi-tons), il manque 3 demi-tons. Donc +3 cases." },
    { type: "h", text: "Le pattern 4 : c3 → c1, +3 cases" },
    { type: "p", text: "Même logique pour le passage de c3 à c1. Sol case 0 c3 → Sol case 3 c1 (octave). Do case 5 c3 → Do case 8 c1 (octave). Mi case 9 c3 → Mi case 12 c1 (octave)." },
    { type: "h", text: "Mémoriser les 4 patterns ensemble" },
    { type: "p", text: "Récapitulatif des 4 patterns d'octaves : Pattern 1 (c6→c4) : +2 cases. Pattern 2 (c5→c3) : +2 cases. Pattern 3 (c4→c2) : +3 cases. Pattern 4 (c3→c1) : +3 cases. La règle simple : +2 quand l'octave ne traverse pas la cassure (c6→c4, c5→c3), +3 quand elle la traverse (c4→c2, c3→c1 : la cassure est entre c3 et c2). Plus simple : '+2 dans le grave, +3 dans l'aigu'." },
    {
      type: "fretboard",
      caption: "4 patterns d'octaves — +2 cases (grave) vs +3 cases (aigu, cassure c3→c2)",
      data: {
        frets: 8, startFret: 4,
        showStringNames: true, showFretNumbers: true,
        markerFrets: [5, 7, 9],
        notes: [
          { string: 6, fret: 5,  label: "La",  color: "amber", root: true },
          { string: 4, fret: 7,  label: "La",  color: "amber", root: true },
          { string: 5, fret: 5,  label: "Ré",  color: "green", root: true },
          { string: 3, fret: 7,  label: "Ré",  color: "green", root: true },
          { string: 4, fret: 7,  label: "La",  color: "coral", root: false },
          { string: 2, fret: 10, label: "La",  color: "coral", root: false },
          { string: 3, fret: 7,  label: "Ré",  color: "primary",root: false },
          { string: 1, fret: 10, label: "Ré",  color: "primary",root: false },
        ],
      },
    },
    { type: "h", text: "Application : trouver une note partout" },
    { type: "p", text: "Avec ces 4 patterns, tu peux maintenant trouver toute note dans 4-6 zones du manche en quelques secondes. Choisis une note (ex Do). Localise-la sur c5 case 3. Octave sur c3 case 5 (pattern 2). Puis octave sur c1 case 8 (pattern 4). Tu as 3 Do à 3 octaves d'écart sans avoir mémorisé séparément chaque corde." },
    { type: "h", text: "Le secret : le manche entier en 4 patterns" },
    { type: "p", text: "Voici la révolution : grâce aux 4 patterns d'octaves, tu n'as PAS BESOIN de mémoriser les notes des 6 cordes séparément. Tu peux mémoriser uniquement la corde 6 (la plus utilisée), et déduire toutes les autres positions par patterns d'octaves. Bien sûr, mémoriser les 6 cordes reste utile pour la fluidité, mais ce n'est pas obligatoire." },
    { type: "ref", text: "Cette méthode des patterns d'octaves est enseignée par tous les grands pédagogues de la guitare moderne (Tomo Fujita, Frank Gambale, Tom Hess). Elle est la base de la 'visualisation harmonique' qui distingue les guitaristes débutants des intermédiaires." },
    { type: "tip", text: "Drill final : prends une note (ex La). Trouve-la dans les 6 zones disponibles sur le manche (avec patterns). Compte à voix haute 'La 1, La 2, La 3...'. Tu auras visualisé 6 La. Refais avec Do, Sol, Ré, Mi. En 2 semaines, tu navigues le manche les yeux fermés." },
  ],
  quiz: ["q-neck-35", "q-neck-36", "q-neck-37", "q-neck-06", "q-neck-09"],
};

export const quiz = [
  {id:"q-neck-35",courseId:"neck",lessonId:"neck-c3-03",lvl:1,q:"Ré, corde 4 à vide. Où est son octave sur la corde 2 ?",o:["Case 2","Case 3","Case 4","Case 5"],a:1,exp:"Pattern c4 → c2 : +3 cases (et non +2). Corde 2 case 3 = Ré.",xp:30},
  {id:"q-neck-36",courseId:"neck",lessonId:"neck-c3-03",lvl:2,q:"Pourquoi faut-il +3 cases, et non +2, de la corde 4 à la corde 2 ?",o:["La corde 2 est plus fine que la 4","Les cordes aiguës sont plus tendues","L'écart c3-c2 n'est que d'une tierce","Par convention d'écriture des tablatures"],a:2,exp:"Entre c3 et c2, l'accordage fait une tierce (4 demi-tons) au lieu d'une quarte (5) : il manque une case, qu'on compense en allant +3.",xp:40},
  {id:"q-neck-37",courseId:"neck",lessonId:"neck-c3-03",lvl:1,q:"Lequel de ces sauts d'octave demande +2 cases ?",o:["Corde 4 → corde 2","Corde 3 → corde 1","Aucun, c'est toujours +3","Corde 5 → corde 3"],a:3,exp:"+2 dans le grave (c6 → c4, c5 → c3), +3 dans l'aigu (c4 → c2, c3 → c1), à cause de la cassure entre c3 et c2.",xp:30},
];
