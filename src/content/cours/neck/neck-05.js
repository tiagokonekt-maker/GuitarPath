// Leçon du module « neck » + les questions de quiz qui s'y rattachent.
// Format décrit dans src/content/README.md.

export default {
  id: "neck-05", level: 5,
  title: "Triades — l'unité minimale d'harmonie",
  duration: 14,
  content: [
    { type: "p", text: "Une triade = 3 notes empilées par tierces (1-3-5). C'est la plus petite cellule harmonique 'complète'. Sur la guitare, jouer des triades sur 3 cordes adjacentes ouvre un monde de voicings funk, R&B, jazz, pop indé." },
    { type: "h", text: "Les 4 types de triades" },
    { type: "p", text: "Majeure (1-3-5) : tierce maj + quinte juste. Mineure (1-♭3-5) : tierce min + quinte juste. Diminuée (1-♭3-♭5) : tierce min + quinte diminuée. Augmentée (1-3-#5) : tierce maj + quinte augmentée." },
    { type: "h", text: "Triades sur cordes 1-2-3 (set 1)" },
    { type: "p", text: "Le set le plus utilisé. Aigu, brillant. État fondamental (Do à la basse) : Do(corde 3 case 5), Mi(corde 2 case 5), Sol(corde 1 case 3). 1ère inversion (Mi à la basse) : Mi(corde 3 case 9), Sol(corde 2 case 8), Do(corde 1 case 8). 2e inversion (Sol à la basse) : Sol(corde 3 case 12), Do(corde 2 case 13), Mi(corde 1 case 12). C'est la note la plus grave qui nomme la position." },
    {
      type: "chord_diagram",
      caption: "Do majeur — triade en 2e inversion, Sol à la basse (cordes 1-2-3, case 12)",
      data: {
        name: "Do", frets: [-1,-1,-1,12,13,12],
        fingers: [0,0,0,1,3,2], startFret: 11,
      },
    },
    {
      type: "chord_diagram",
      caption: "La mineur ouvert — accord de référence (Mi La Mi La Do Mi)",
      data: {
        name: "Am", frets: [0,0,2,2,1,0],
        fingers: [0,0,2,3,1,0], startFret: 1,
      },
    },
    {
      type: "chord_diagram",
      caption: "Sol majeur ouvert — (Sol Si Ré Sol Ré Sol)",
      data: {
        name: "Sol", frets: [3,2,0,0,3,3],
        fingers: [2,1,0,0,3,4], startFret: 1,
      },
    },
    { type: "h", text: "Triades sur cordes 2-3-4 (set 2)" },
    { type: "p", text: "Son médium. Plus rond. Position fondamentale Do : Do(corde 4 case 10), Mi(corde 3 case 9), Sol(corde 2 case 8). Très utilisé en R&B et néo-soul." },
    { type: "h", text: "Triades sur cordes 3-4-5 (set 3)" },
    { type: "p", text: "Son médium-grave. Idéal pour les vamps funk et le rock indé. Position fondamentale Do : Do(corde 5 case 3), Mi(corde 4 case 2), Sol(corde 3 à vide)." },
    { type: "h", text: "Inversions = mouvement" },
    { type: "p", text: "Au lieu de sauter de Do à Sol par un grand mouvement, utilise une inversion proche. Do (état fondamental) → Sol (1ère inversion une case plus loin). Le mouvement devient fluide, mélodique. C'est le voice-leading appliqué à la guitare." },
    { type: "tip", text: "Mini-projet : prends 4 accords d'une chanson pop. Joue-les uniquement en triades sur cordes 1-2-3. Tu obtiens un son moderne et sophistiqué instantanément." },
    { type: "fretboard_interactive", mode: "chord", root: "C", chord: "maj", caption: "Do majeur — visualise Do Mi Sol sur tout le manche", displayMode: "notes", lang: "fr", compact: true },
  ],
  quiz: ["q-neck-15", "q-neck-16", "q-neck-17"],
};

export const quiz = [
  {id:"q-neck-15",courseId:"neck",lessonId:"neck-05",lvl:2,q:"Une triade en 'première inversion' a quelle note à la basse ?",o:["La fondamentale","La tierce","La quinte","La septième"],a:1,exp:"État fondamental : basse = 1. 1ère inversion : basse = 3. 2e inversion : basse = 5. La 1ère inversion crée souvent du mouvement mélodique.",xp:35},
  {id:"q-neck-16",courseId:"neck",lessonId:"neck-05",lvl:3,q:"Quelle triade contient les notes Mi-Sol-Si ?",o:["Mi majeur","Sol majeur","Mi mineur","Si diminué"],a:2,exp:"Mi-Sol-Si : intervalle Mi→Sol = 3dt (tierce mineure), Mi→Si = 7dt (quinte juste). Triade mineure = 1-♭3-5. Donc Em (Mi mineur).",xp:45},
  {id:"q-neck-17",courseId:"neck",lessonId:"neck-05",lvl:3,q:"Tu joues une triade Sol-Do-Mi. Quel accord et quelle inversion ?",o:["Do majeur, état fondamental","Sol majeur, 1ère inversion","Mi mineur, 2e inversion","Do majeur, 2e inversion"],a:3,exp:"Notes Sol-Do-Mi = Do-Mi-Sol réordonné. C'est Do majeur. Basse = Sol (la 5e), donc 2e inversion. Indication 'Do/Sol' en symbole.",xp:55},
];
