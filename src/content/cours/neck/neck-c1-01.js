// Leçon du module « neck » + les questions de quiz qui s'y rattachent.
// Format « leçon en cartes » décrit dans src/content/README.md.

export default {
  id: "neck-c1-01", level: 1,
  title: "Architecture du manche",
  duration: 7,
  gropiTip: "La case 12 est pile au milieu de la corde : mesure du sillet à la 12e frette, puis de la 12e frette au chevalet, c'est (presque) la même longueur. Moitié de corde = une octave.",
  cartes: [
    { type: "idee", titre: "1 case = 1 demi-ton", texte: [
      "Tu connais les cordes, Mi La Ré Sol Si Mi. Voyons comment le manche est construit : ce n'est pas un labyrinthe.",
      "Chaque case monte d'un demi-ton, la plus petite distance de notre musique. Deux cases = un ton. Sur la corde 6, la case 12, marquée d'un double point, ramène Mi une octave plus haut.",
    ], bloc: {
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
    } },
    { type: "question", quizId: "q-base-02" },
    { type: "idee", titre: "Des cordes espacées d'une quarte", texte: [
      "Entre deux cordes voisines, il y a presque toujours une quarte juste : 5 demi-tons.",
      "C'est le principe que tu utilises pour t'accorder : la case 5 d'une corde sonne comme la corde plus aiguë voisine, à vide. Avec une exception, on y vient.",
    ] },
    { type: "question", quizId: "q-base-01" },
    { type: "idee", titre: "L'unique cassure : Sol → Si", texte: [
      "Entre les cordes 3 (Sol) et 2 (Si), l'écart n'est que d'une tierce majeure : 4 demi-tons. Il rend Do, Sol et Ré plus faciles à doigter.",
      "Conséquence : pour déplacer une forme d'une corde à la voisine, on décale de 5 cases… sauf entre les cordes 3 et 2, où l'on décale de 4.",
    ], bloc: { type: "fretboard_interactive", mode: "quiz", quizTarget: "A", instructions: "Trouve toutes les positions de la note La sur le manche (indice : tu en connais déjà une, c'est une corde à vide)." } },
    { type: "question", quizId: "q-neck-01-app" },
    { type: "idee", titre: "Une même note, six places", texte: [
      "Do existe sur chaque corde, à une case différente. Sur les cordes 6 et 1, toutes deux en Mi, il tombe à la même case, la 8.",
      "Sur la corde 2, il arrive dès la case 1 : c'est la cassure qui produit ce décalage.",
    ], bloc: { type: "fretboard", caption: "Toutes les positions de la note Do sur le manche", data: { frets: 12, startFret: 0, showStringNames: true, showFretNumbers: true, markerFrets: [3,5,7,9,12], notes: [{ string: 6, fret: 8, label: "Do", color: "primary", root: true },{ string: 5, fret: 3, label: "Do", color: "primary", root: true },{ string: 4, fret: 10, label: "Do", color: "primary", root: true },{ string: 3, fret: 5, label: "Do", color: "primary", root: true },{ string: 2, fret: 1, label: "Do", color: "primary", root: true },{ string: 1, fret: 8, label: "Do", color: "primary", root: true }] } } },
    { type: "a-toi", titre: "Entends la cassure", consigne: "Joue chaque paire : case 5, puis la corde suivante à vide. Les deux notes sont identiques… sauf entre les cordes 3 et 2, où il faut la case 4. Écoute d'abord, puis joue-le lentement au clic.", bloc: {
      type: "tab",
      caption: "Les cordes deux par deux : case 5, puis corde à vide — case 4 sur la corde 3",
      text: "Tab — corde 6 case 5, corde 5 à vide ; corde 5 case 5, corde 4 à vide ; corde 4 case 5, corde 3 à vide ; corde 3 case 4, corde 2 à vide ; corde 2 case 5, corde 1 à vide.",
      data: { lines: [
        "e|----------------------------0--|",
        "B|----------------------0--5-----|",
        "G|----------------0--4-----------|",
        "D|----------0--5-----------------|",
        "A|----0--5-----------------------|",
        "E|-5-----------------------------|",
      ] },
    }, bpm: 60 },
    { type: "question", quizId: "q-neck-03" },
    { type: "recap", points: [
      "1 case = 1 demi-ton, 2 cases = 1 ton, 12 cases = l'octave.",
      "Cordes voisines à une quarte (5 cases), sauf Sol → Si : une tierce majeure (4 cases).",
      "Chaque note existe à plusieurs endroits du manche, sur presque chaque corde.",
    ] },
  ],
  quiz: ["q-base-01","q-base-02","q-neck-01","q-neck-02","q-neck-03","q-neck-04", "q-neck-01-app"],
};

export const quiz = [
  {id:"q-base-01",courseId:"neck",lessonId:"neck-c1-01",lvl:1,q:"La corde 6, case 5, sonne exactement comme quelle autre position ?",o:["Corde 5 à vide","Corde 4 à vide","Corde 5, case 5","Corde 6, case 7"],a:0,exp:"Les cordes 6 et 5 sont à une quarte (5 demi-tons) : la case 5 de la corde 6 donne La, comme la corde 5 à vide. C'est le principe de l'accordage à la 5e case vu dans Premiers pas, et la clé de toute la carte du manche.",xp:25},
  {id:"q-base-02",courseId:"neck",lessonId:"neck-c1-01",lvl:1,q:"Sur une guitare, avancer d'une case vers le corps de l'instrument fait…",o:["Monter d'un ton entier","Monter d'un demi-ton","Descendre d'un demi-ton","Monter d'une quinte"],a:1,exp:"Chaque case représente exactement un demi-ton. C'est la règle de base qui rend le manche entièrement prévisible.",xp:25},
  {id:"q-neck-01",courseId:"neck",lessonId:"neck-c1-01",lvl:1,q:"Quel intervalle sépare les cordes 3 et 2 (Sol et Si) sur une guitare en accordage standard ?",o:["Quarte juste","Quinte juste","Tierce mineure","Tierce majeure"],a:3,exp:"Sol→Si = 4 demi-tons = tierce majeure. C'est l'unique 'cassure' de l'accordage standard, toutes les autres cordes consécutives étant en quartes (5 demi-tons).",xp:30},
  {id:"q-neck-01-app",courseId:"neck",lessonId:"neck-c1-01",lvl:2,q:"Tu joues Ré sur la corde 3, case 7. Où retrouves-tu ce même Ré, à la même hauteur, sur la corde 2 ?",o:["Case 3","Case 2","Case 4","Case 12"],a:0,exp:"Entre les cordes 3 et 2, l'écart n'est que de 4 demi-tons : la même note est 4 cases plus bas sur la corde 2, pas 5. Ré (corde 3 case 7) = Ré (corde 2 case 3).",xp:30},
  {id:"q-neck-02",courseId:"neck",lessonId:"neck-c1-01",lvl:1,q:"Pourquoi les cases 12, 24 sont-elles marquées d'un double point ?",o:["Elles marquent les octaves de la corde à vide","Convention esthétique","Elles indiquent les notes naturelles","Elles séparent les zones graves/aiguës"],a:0,exp:"Le double point marque l'octave (case 12 = même note que corde à vide, +1 octave). Case 24 = +2 octaves. Repères de navigation cruciaux.",xp:25},
  {id:"q-neck-03",courseId:"neck",lessonId:"neck-c1-01",lvl:2,q:"Sur la corde 6, où se trouve la note Si ?",o:["Case 5","Case 7","Case 9","Case 11"],a:1,exp:"Mi(0)-Fa(1)-Sol(3)-La(5)-Si(7). Le Si est case 7 sur la corde 6. C'est l'une des 4 notes-repères principales (avec Sol-3, La-5, Do-8).",xp:30},
  {id:"q-neck-04",courseId:"neck",lessonId:"neck-c1-01",lvl:2,q:"Quel est l'intervalle entre une note sur la corde 6 et la même case sur la corde 5 ?",o:["Tierce majeure","Quinte juste","Quarte juste","Octave"],a:2,exp:"Cordes 6 et 5 : accordage en quarte juste (5 demi-tons). Mi→La = quarte juste. C'est l'intervalle standard entre cordes adjacentes (sauf c3-c2 = tierce maj).",xp:35},
];
