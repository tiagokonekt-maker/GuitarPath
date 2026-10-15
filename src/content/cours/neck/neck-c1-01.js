// Leçon du module « neck » + les questions de quiz qui s'y rattachent.
// Format décrit dans src/content/README.md.

export default {
  id: "neck-c1-01", level: 1,
  title: "Architecture du manche",
  duration: 8,
  gropiTip: "La case 12 est pile au milieu de la corde : mesure du sillet à la 12e frette, puis de la 12e frette au chevalet, c'est (presque) la même longueur. Moitié de corde = une octave.",
  content: [
    { type: "p", text: "Avant de mémoriser quoi que ce soit, il faut comprendre comment le manche de la guitare est construit. Cette compréhension va te faire gagner des semaines d'apprentissage : tu vas voir que le manche n'est pas un labyrinthe, mais une structure logique qui obéit à quelques règles simples." },
    { type: "h", text: "Les cordes et leur accordage standard" },
    { type: "p", text: "Une guitare classique a 6 cordes. De la plus grave (la plus épaisse) à la plus aiguë (la plus fine), elles sont accordées en : Mi - La - Ré - Sol - Si - Mi. On les numérote de 6 (la plus grave) à 1 (la plus aiguë). Cet accordage 'standard' est de loin le plus répandu." },
    { type: "h", text: "Pourquoi cet accordage ?" },
    { type: "p", text: "Cinq des six cordes sont espacées d'une quarte juste (5 demi-tons). Mais entre les cordes 3 (Sol) et 2 (Si), l'écart est seulement d'une tierce majeure (4 demi-tons). C'est l'unique 'cassure' de l'accordage standard, héritée de la guitare baroque. Cette anomalie facilite les accords ouverts comme Do, Sol, Ré (plus jouables avec les doigts), au prix d'une légère asymétrie de visualisation." },
    { type: "h", text: "Conséquence pratique" },
    { type: "p", text: "Quand tu déplaces une forme d'accord ou de gamme entre des cordes adjacentes, tu décales de +5 cases (quarte). Mais entre la corde 3 et la corde 2, tu dois décaler de +4 cases (tierce majeure). C'est la 'règle de la cassure'. Elle explique la plupart des bizarreries que tu rencontres en jouant." },
    { type: "h", text: "Les frettes : comment ça marche" },
    { type: "p", text: "Les barres métalliques perpendiculaires aux cordes s'appellent des 'frettes'. Quand tu appuies sur une corde entre deux frettes, tu réduis la longueur vibrante de la corde, ce qui produit une note plus aiguë. Chaque case (= espace entre deux frettes) représente exactement un demi-ton (la plus petite distance possible en musique occidentale)." },
    { type: "h", text: "Récap : 1 case = 1 demi-ton" },
    { type: "p", text: "Cette équivalence est ta meilleure amie. Monter d'une case sur la même corde = +1 demi-ton. Monter de deux cases = +1 ton (= 2 demi-tons). Toute la théorie musicale se traduit directement en cases sur le manche. Une fois que tu intègres ça, tu peux 'voir' n'importe quelle gamme ou accord sur la guitare." },
    {
      type: "note_grid",
      caption: "Corde 6 — 1 case = 1 demi-ton. Mi grave → Mi aigu en 12 cases",
      data: {
        string: 6, stringName: "Mi grave", maxFret: 12,
        highlights: [
          { fret: 0,  label: "Mi",  color: "amber" },
          { fret: 1,  label: "Fa",  color: "neutral" },
          { fret: 3,  label: "Sol", color: "neutral" },
          { fret: 5,  label: "La",  color: "green" },
          { fret: 7,  label: "Si",  color: "neutral" },
          { fret: 8,  label: "Do",  color: "primary" },
          { fret: 10, label: "Ré",  color: "neutral" },
          { fret: 12, label: "Mi",  color: "amber" },
        ],
      },
    },
    { type: "tip", text: "Mnémonique pour retenir l'accordage standard : 'Mi La Ré Sol Si Mi' (du grave à l'aigu). En anglais : 'E A D G B E' (Eddie Ate Dynamite Good Bye Eddie). Cette base est non-négociable." },{ type: "h", text: "Une même note, partout sur le manche" },
          { type: "p", text: "Voici la conséquence directe de tout ce qu'on vient de voir : la note Do, par exemple, n'existe pas qu'à un seul endroit. Elle apparaît sur chaque corde, à une case différente selon l'accordage de cette corde. Regarde où elle se trouve sur les 6 cordes — ce sont exactement les mêmes cases-demi-tons qu'on vient d'expliquer, juste appliquées 6 fois." },
          { type: "fretboard", caption: "Toutes les positions de la note Do sur le manche", data: { frets: 12, startFret: 0, showStringNames: true, showFretNumbers: true, markerFrets: [3,5,7,9,12], notes: [{ string: 6, fret: 8, label: "Do", color: "primary", root: true },{ string: 5, fret: 3, label: "Do", color: "primary", root: true },{ string: 4, fret: 10, label: "Do", color: "primary", root: true },{ string: 3, fret: 5, label: "Do", color: "primary", root: true },{ string: 2, fret: 1, label: "Do", color: "primary", root: true },{ string: 1, fret: 8, label: "Do", color: "primary", root: true }] } },
          { type: "p", text: "Remarque : sur les cordes 6 et 1 (toutes les deux accordées en Mi), le Do tombe à la même case, case 8. Logique, elles ont le même accordage. Mais regarde la corde 2 (Si) : le Do y tombe case 1, beaucoup plus tôt que sur les autres cordes. C'est exactement la cassure dont on vient de parler qui produit ce décalage." },
          { type: "h", text: "À toi de jouer" },
          { type: "p", text: "Avant de continuer, un rapide test pour vérifier que la notion case=demi-ton est bien passée. Pas besoin d'aller vite, prends le temps de calculer plutôt que de deviner." },
          { type: "fretboard_interactive", mode: "quiz", quizTarget: "A", instructions: "Trouve toutes les positions de la note La sur le manche (indice : tu en connais déjà une, c'est une corde à vide)." },
          
  ],
  quiz: ["q-base-01","q-base-02","q-neck-01","q-neck-02","q-neck-03","q-neck-04"],
};

export const quiz = [
  {id:"q-base-01",courseId:"neck",lessonId:"neck-c1-01",lvl:1,q:"En accordage standard, quelle est la corde la plus grave (la plus épaisse) ?",o:["La corde de Mi","La corde de La","La corde de Sol","La corde de Si"],a:0,exp:"La corde 6, la plus épaisse, est accordée en Mi. De la plus grave à la plus aiguë : Mi, La, Ré, Sol, Si, Mi.",xp:25},
  {id:"q-base-02",courseId:"neck",lessonId:"neck-c1-01",lvl:1,q:"Sur une guitare, avancer d'une case vers le corps de l'instrument fait…",o:["Monter d'un ton entier","Monter d'un demi-ton","Descendre d'un demi-ton","Monter d'une quinte"],a:1,exp:"Chaque case représente exactement un demi-ton. C'est la règle de base qui rend le manche entièrement prévisible.",xp:25},
  {id:"q-neck-01",courseId:"neck",lessonId:"neck-c1-01",lvl:1,q:"Quel intervalle sépare les cordes 3 et 2 (Sol et Si) sur une guitare en accordage standard ?",o:["Quarte juste","Quinte juste","Tierce mineure","Tierce majeure"],a:3,exp:"Sol→Si = 4 demi-tons = tierce majeure. C'est l'unique 'cassure' de l'accordage standard, toutes les autres cordes consécutives étant en quartes (5 demi-tons).",xp:30},
  {id:"q-neck-02",courseId:"neck",lessonId:"neck-c1-01",lvl:1,q:"Pourquoi les cases 12, 24 sont-elles marquées d'un double point ?",o:["Elles marquent les octaves de la corde à vide","Convention esthétique","Elles indiquent les notes naturelles","Elles séparent les zones graves/aiguës"],a:0,exp:"Le double point marque l'octave (case 12 = même note que corde à vide, +1 octave). Case 24 = +2 octaves. Repères de navigation cruciaux.",xp:25},
  {id:"q-neck-03",courseId:"neck",lessonId:"neck-c1-01",lvl:2,q:"Sur la corde 6, où se trouve la note Si ?",o:["Case 5","Case 7","Case 9","Case 11"],a:1,exp:"Mi(0)-Fa(1)-Sol(3)-La(5)-Si(7). Le Si est case 7 sur la corde 6. C'est l'une des 4 notes-repères principales (avec Sol-3, La-5, Do-8).",xp:30},
  {id:"q-neck-04",courseId:"neck",lessonId:"neck-c1-01",lvl:2,q:"Quel est l'intervalle entre une note sur la corde 6 et la même case sur la corde 5 ?",o:["Tierce majeure","Quinte juste","Quarte juste","Octave"],a:2,exp:"Cordes 6 et 5 : accordage en quarte juste (5 demi-tons). Mi→La = quarte juste. C'est l'intervalle standard entre cordes adjacentes (sauf c3-c2 = tierce maj).",xp:35},
];
