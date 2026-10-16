// Leçon du module « neck » + les questions de quiz qui s'y rattachent.
// Format « leçon en cartes » décrit dans src/content/README.md.
// Power chords : une forme mobile, fondamentale sur la corde 6 ou 5 — elle
// s'appuie sur les notes des cordes 6 et 5 (neck-c2-01, neck-c2-02).

const E5 = { type: "chord_diagram", caption: "E5 — 022xxx : corde 6 à vide, cordes 5 et 4 en case 2", data: { name: "E5", frets: [0, 2, 2, -1, -1, -1], fingers: [0, 1, 2, 0, 0, 0], startFret: 1 } };
const G5 = { type: "chord_diagram", caption: "G5 — 355xxx : la forme mobile, fondamentale sur la corde 6", data: { name: "G5", frets: [3, 5, 5, -1, -1, -1], fingers: [1, 3, 4, 0, 0, 0], startFret: 3 } };
const D5 = { type: "chord_diagram", caption: "D5 — x577xx : la même forme, fondamentale sur la corde 5", data: { name: "D5", frets: [-1, 5, 7, 7, -1, -1], fingers: [0, 1, 3, 4, 0, 0], startFret: 5 } };

export default {
  id: "neck-pow-01", level: 3,
  title: "Power chords et premier riff rock",
  duration: 8,
  gropiTip: "Sur un power chord de la corde 5, laisse le bout de l'index effleurer la corde 6 sans appuyer : elle reste muette même si ta main droite déborde. Le dessous de l'index fait pareil pour les cordes aiguës.",
  cartes: [
    { type: "idee", titre: "Deux notes, un gros son", texte: [
      "Un power chord, c'est une fondamentale et sa quinte, souvent doublée à l'octave. Pas de tierce : il n'est ni majeur ni mineur.",
      "Il sonne bien partout, surtout avec de la saturation. On l'écrit avec un 5 : E5 se dit « Mi cinq ».",
    ] },
    { type: "idee", titre: "E5 et A5, à vide", texte: [
      "E5 : la corde 6 à vide, plus les cordes 5 et 4 en case 2. Ne gratte que ces trois cordes.",
      "A5 : la même forme décalée d'une corde vers l'aigu. Corde 5 à vide, cordes 4 et 3 en case 2.",
    ], bloc: E5 },
    { type: "question", quizId: "q-neck-pow-new-01" },
    { type: "idee", titre: "Une forme qui voyage", texte: [
      "Index sur la corde 6, annulaire et auriculaire deux cases plus loin, sur les cordes 5 et 4. Cette forme se déplace telle quelle.",
      "La note de l'index donne le nom : Sol (corde 6, case 3) donne G5, La (corde 6, case 5) donne A5.",
    ], bloc: G5 },
    { type: "idee", titre: "Fondamentale sur la corde 5", texte: [
      "La même forme part aussi de la corde 5 : Do (corde 5, case 3) donne C5, Ré (corde 5, case 5) donne D5.",
      "Les notes des cordes 6 et 5 que tu as apprises deviennent ta carte des power chords.",
    ], bloc: D5 },
    { type: "question", quizId: "q-neck-pow-new-02" },
    { type: "idee", titre: "Le palm mute, en bref", texte: [
      "Pose le tranchant de la main droite sur les cordes, juste devant le chevalet, et gratte vers le bas. Le son devient sourd et percutant : le « tchouk » du rock.",
      "Tout est étouffé ? Recule la paume vers le chevalet.",
    ] },
    { type: "a-toi", titre: "Ton premier riff rock",
      consigne: "Tout en coups vers le bas, avec un palm mute léger. Deux power chords par temps, au clic. Tu reconnais le motif ? C'est le « Riff rock en Mi » des Morceaux, joué en power chords.",
      bloc: {
        type: "tab",
        caption: "Riff en power chords : E5, G5 et A5, en croches",
        text: "Tab — croches en power chords : E5, E5, G5, E5, A5, E5, G5, E5, deux fois. Corde 6 : 0, 0, 3, 0, 5, 0, 3, 0 ; cordes 5 et 4 deux cases plus loin à chaque fois.",
        data: { lines: [
          "e|----------------|----------------|",
          "B|----------------|----------------|",
          "G|----------------|----------------|",
          "D|2-2-5-2-7-2-5-2-|2-2-5-2-7-2-5-2-|",
          "A|2-2-5-2-7-2-5-2-|2-2-5-2-7-2-5-2-|",
          "E|0-0-3-0-5-0-3-0-|0-0-3-0-5-0-3-0-|",
        ] },
      },
      bpm: 70 },
    { type: "question", quizId: "q-neck-pow-new-03" },
    { type: "recap", points: [
      "Power chord = fondamentale + quinte (+ octave) : ni majeur ni mineur.",
      "Une seule forme mobile : la note de l'index, sur la corde 6 ou 5, donne le nom.",
      "Coups vers le bas et palm mute devant le chevalet : le son du riff rock.",
    ] },
  ],
  quiz: ["q-neck-pow-new-01", "q-neck-pow-new-02", "q-neck-pow-new-03"],
};

export const quiz = [
  {id:"q-neck-pow-new-01",courseId:"neck",lessonId:"neck-pow-01",lvl:1,q:"Quelles notes joues-tu dans le power chord E5 (022xxx) ?",o:["Mi, Si et Mi","Mi, Sol# et Si","Mi, Sol et Si","Mi, La et Mi"],a:0,exp:"Corde 6 à vide : Mi ; corde 5 case 2 : Si (la quinte) ; corde 4 case 2 : Mi (l'octave). Aucune tierce.",xp:25},
  {id:"q-neck-pow-new-02",courseId:"neck",lessonId:"neck-pow-01",lvl:1,q:"Power chord mobile, index sur la corde 6 en case 5 : quel accord joues-tu ?",o:["A5","G5","D5","C5"],a:0,exp:"La corde 6 en case 5 donne La : c'est la fondamentale, donc A5.",xp:25},
  {id:"q-neck-pow-new-03",courseId:"neck",lessonId:"neck-pow-01",lvl:2,q:"Pourquoi un power chord convient-il aussi bien à un morceau majeur qu'à un morceau mineur ?",o:["Il n'a pas de tierce","Il n'a pas de quinte","Il n'a que des cordes graves","Il se joue toujours étouffé"],a:0,exp:"C'est la tierce qui rend un accord majeur ou mineur. Le power chord n'a que la fondamentale et la quinte : il s'adapte aux deux.",xp:30},
];
