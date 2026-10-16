// Leçon du module « scales » + les questions de quiz qui s'y rattachent.
// Format « leçon en cartes » décrit dans src/content/README.md.

export default {
  id: "scales-c1-01", level: 1,
  title: "L'alphabet musical : les 7 notes naturelles",
  duration: 6,
  gropiTip: "Sur la corde 5, joue La à vide puis les cases 2, 3, 5, 7, 8 et 10 : Si, Do, Ré, Mi, Fa, Sol. Nomme chaque note à voix haute, et la case 12 te ramène sur La.",
  cartes: [
    { type: "idee", titre: "Sept notes, c'est tout", texte: [
      "La musique occidentale repose sur 7 notes naturelles : Do, Ré, Mi, Fa, Sol, La, Si. Elles se répètent ensuite sur tout le manche.",
    ] },
    { type: "question", quizId: "q-base-03" },
    { type: "idee", titre: "Deux noms pour chaque note", texte: [
      "En notation anglaise : C, D, E, F, G, A, B. Do = C, Ré = D, Mi = E, Fa = F, Sol = G, La = A, Si = B.",
      "L'alphabet anglais démarre sur La (A). Tu le pratiques déjà : Em, Am, C, G et D, ce sont Mi mineur, La mineur, Do, Sol et Ré.",
    ] },
    { type: "question", quizId: "q-scales-49" },
    { type: "idee", titre: "La suite boucle", texte: [
      "Une fois les sept notes jouées, l'alphabet repart du début, une octave plus haut. Il boucle sans fin.",
      "Sur la corde 5, à partir de La à vide, les notes naturelles se suivent jusqu'à la case 12, qui redonne La une octave plus haut.",
    ], bloc: { type: "note_grid", caption: "Corde 5 (La) : les notes naturelles à la suite, et la case 12 ramène La une octave plus haut", data: {string: 5, stringName: "La", maxFret: 12, highlights: [{fret: 0, label: "La", color: "amber"}, {fret: 2, label: "Si", color: "neutral"}, {fret: 3, label: "Do", color: "primary"}, {fret: 5, label: "Ré", color: "neutral"}, {fret: 7, label: "Mi", color: "neutral"}, {fret: 8, label: "Fa", color: "neutral"}, {fret: 10, label: "Sol", color: "neutral"}, {fret: 12, label: "La", color: "amber"}]} } },
    { type: "question", quizId: "q-base-04" },
    { type: "a-toi", titre: "Do-Ré-Mi en position ouverte", consigne: "Écoute, puis joue la gamme au clic, une note par temps, en disant son nom à voix haute. Monte jusqu'au Do aigu, redescends. Les deux Do et le Mi, ce sont trois doigts de ton accord de Do.", bloc: { type: "fretboard", caption: "Do-Ré-Mi-Fa-Sol-La-Si-Do en position ouverte : les 7 notes naturelles, puis Do à l'octave", data: {frets: 4, startFret: 0, showStringNames: true, showFretNumbers: true, markerFrets: [3], notes: [{string: 5, fret: 3, label: "Do", color: "amber", root: true}, {string: 4, fret: 0, label: "Ré", color: "primary"}, {string: 4, fret: 2, label: "Mi", color: "primary"}, {string: 4, fret: 3, label: "Fa", color: "primary"}, {string: 3, fret: 0, label: "Sol", color: "primary"}, {string: 3, fret: 2, label: "La", color: "primary"}, {string: 2, fret: 0, label: "Si", color: "primary"}, {string: 2, fret: 1, label: "Do", color: "amber", root: true}]} }, bpm: 60 },
    { type: "recap", points: [
      "7 notes naturelles : Do, Ré, Mi, Fa, Sol, La, Si.",
      "En anglais : C, D, E, F, G, A, B — les noms de tes accords.",
      "Après Si revient Do : la suite boucle à l'octave.",
    ] },
  ],
  quiz: ["q-base-03","q-base-04","q-scales-49"],
};

export const quiz = [
  {id:"q-base-03",courseId:"scales",lessonId:"scales-c1-01",lvl:1,q:"Combien de notes naturelles (sans dièse ni bémol) la musique occidentale utilise-t-elle ?",o:["5","8","7","12"],a:2,exp:"Do, Ré, Mi, Fa, Sol, La, Si : 7 notes naturelles, qui se répètent ensuite à l'octave.",xp:25},
  {id:"q-base-04",courseId:"scales",lessonId:"scales-c1-01",lvl:1,q:"Quelle note vient juste après Si quand on monte la gamme naturelle ?",o:["Ré","La","Mi","Do"],a:3,exp:"Après Si, la suite recommence sur Do. L'alphabet musical boucle en permanence : Do Ré Mi Fa Sol La Si Do…",xp:25},
  {id:"q-scales-49",courseId:"scales",lessonId:"scales-c1-01",lvl:1,q:"En notation anglaise, quelle lettre désigne Sol ?",o:["G","A","F","D"],a:0,exp:"Do = C, Ré = D, Mi = E, Fa = F, Sol = G, La = A, Si = B. L'alphabet anglais commence sur La (A), d'où ce décalage.",xp:30},
];
