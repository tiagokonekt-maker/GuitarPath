// Leçon du module « harmony » + les questions de quiz qui s'y rattachent.
// Format décrit dans src/content/README.md.

export default {
  id: "harm-c2-04", level: 6,
  title: "Les inversions de triades et leur usage",
  duration: 10,
  gropiTip: "Joue Do, puis Sol/Si (x20003), puis Lam : grâce à la 1re inversion de Sol, la basse descend Do-Si-La par degrés conjoints. Un enchaînement très courant à garder sous les doigts.",
  content: [
    { type: "p", text: "Tu connais maintenant les triades en 'état fondamental' (1-3-5, fondamentale à la basse). Mais une triade peut aussi être jouée dans 2 autres configurations : 1ère inversion (3-5-1) et 2e inversion (5-1-3). Ces inversions sont des outils essentiels pour la composition, le voice-leading et les transitions fluides entre accords." },
    { type: "h", text: "État fondamental : 1 à la basse" },
    { type: "p", text: "C'est la position 'normale' d'un accord. La note la plus grave est la fondamentale. Exemple : Do majeur = Do (basse) - Mi - Sol. L'accord sonne stable, affirmé, 'ancré'. C'est la position que tu utilises le plus souvent quand tu plaques des accords." },
    { type: "h", text: "1ère inversion : 3 à la basse" },
    { type: "p", text: "La tierce devient la note la plus grave. Exemple : Do majeur 1ère inversion = Mi (basse) - Sol - Do. L'accord sonne légèrement plus 'ouvert', moins 'affirmé'. En notation symbolique, on l'écrit Do/Mi (Do avec Mi à la basse). Très utilisée pour créer des lignes de basse mélodiques (au lieu de descendre par saut, la basse se déplace par degrés conjoints)." },
    { type: "h", text: "2e inversion : 5 à la basse" },
    { type: "p", text: "La quinte devient la note la plus grave. Exemple : Do majeur 2e inversion = Sol (basse) - Do - Mi. Cet accord sonne le moins 'stable' des trois — la quinte en basse crée une légère tension. Très utilisé comme 'accord de passage' entre 2 accords (ex : I → I/5 → IV crée une descente fluide dans la basse)." },
    { type: "h", text: "Voice-leading : l'art des transitions fluides" },
    { type: "p", text: "Le 'voice-leading' est l'art de passer d'un accord à l'autre en minimisant les sauts. Au lieu de changer brusquement toutes les notes, tu gardes certaines notes communes et déplaces les autres par demi-tons ou tons. Les inversions sont l'outil principal du voice-leading : elles permettent d'utiliser des voicings 'proches' entre accords successifs." },
    { type: "h", text: "Exemple de voice-leading avec inversions" },
    { type: "p", text: "Progression Do - Sol - La mineur - Fa (I-V-vi-IV). En état fondamental, la basse saute : Do → Sol → La → Fa. Joue plutôt Sol en 1ère inversion (Sol/Si, Si à la basse) : la basse descend alors par degrés, Do → Si → La, avant de rejoindre Fa. Cette ligne Do-Si-La est bien plus chantante que les sauts d'origine : les inversions créent une ligne de basse mélodique." },
    { type: "h", text: "Sur la guitare : inversions pratiques" },
    { type: "p", text: "Les inversions de triades s'utilisent surtout sur les cordes 1-2-3 et 2-3-4 (comme vu dans le module Manche). Sur un accord barré à 6 cordes, tu 'contiens' implicitement des inversions : certaines cordes jouent la tierce ou la quinte en position basse. Mais pour travailler les inversions explicitement, les triades à 3 cordes sont l'outil parfait." },
    {
      type: "chord_diagram",
      caption: "Do maj — état fondamental (Do en basse, corde 5 case 3)",
      data: { name: "C", frets: [-1,3,2,0,1,0], fingers: [0,3,2,0,1,0], startFret: 1 },
    },
    {
      type: "chord_diagram",
      caption: "Do/Mi — 1ère inversion (Mi en basse, corde 6 à vide)",
      data: { name: "C/E", frets: [0,3,2,0,1,0], fingers: [0,3,2,0,1,0], startFret: 1 },
    },
    {
      type: "chord_diagram",
      caption: "Do/Sol — 2e inversion (Sol en basse, corde 6 case 3 ou corde 4 à vide)",
      data: { name: "C/G", frets: [3,3,2,0,1,0], fingers: [3,4,2,0,1,0], startFret: 1 },
    },
    { type: "ref", text: "'And I Love Her' (Beatles) : la ligne de basse utilise des inversions d'accords pour créer un mouvement descendant mélodique. La basse ne suit pas toujours la fondamentale — elle passe par des tierces et quintes. Résultat : la ligne de basse est aussi une mélodie. C'est le pouvoir des inversions." },
    { type: "tip", text: "Drill inversions : prends Do majeur. Joue-le en état fondamental (corde 5 case 3, corde 4 case 2, corde 3 à vide). Puis 1ère inversion (corde 4 case 2, corde 3 à vide, corde 2 case 1 — Mi en basse). Puis 2e inversion (corde 3 à vide, corde 2 case 1, corde 1 à vide — Sol en basse). 3 positions, 3 couleurs. Mémorise les 3 formes de Do majeur. Refais avec Sol, La mineur." },
  ],
  quiz: ["q-harm-28", "q-harm-29", "q-harm-58"],
};

export const quiz = [
  {id:"q-harm-28",courseId:"harmony",lessonId:"harm-c2-04",lvl:1,q:"Dans une 1ère inversion, quelle note de l'accord est à la basse ?",o:["La fondamentale", "La quinte", "La septième", "La tierce"],a:3,exp:"1ère inversion = tierce à la basse. Do majeur : Mi - Sol - Do, noté Do/Mi.",xp:30},
  {id:"q-harm-29",courseId:"harmony",lessonId:"harm-c2-04",lvl:2,q:"À quoi servent surtout les inversions dans un enchaînement d'accords ?",o:["À réduire les sauts entre les accords", "À changer la tonalité du morceau", "À rendre chaque accord plus fort et plus riche", "À remplacer les accords mineurs"],a:0,exp:"C'est le voice-leading : on garde les notes communes et on déplace les autres au plus court.",xp:40},
  {id:"q-harm-58",courseId:"harmony",lessonId:"harm-c2-04",lvl:2,q:"Dans Do - Sol - Lam - Fa, quel Sol fait descendre la basse Do → Si → La ?",o:["Sol/Si, 1re inversion","Sol/Ré, 2e inversion","Sol à l'état fondamental","Sol/La, avec la 9e en basse"],a:0,exp:"En 1re inversion, la tierce de Sol (Si) passe à la basse : Do (Do) → Si (Sol/Si) → La (Lam). La basse descend par degrés au lieu de sauter Do → Sol → La.",xp:40},
];
