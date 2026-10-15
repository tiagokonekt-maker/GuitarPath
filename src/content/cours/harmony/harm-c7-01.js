// Leçon du module « harmony » + les questions de quiz qui s'y rattachent.
// Format décrit dans src/content/README.md.

export default {
  id: "harm-c7-01", level: 9,
  title: "Les accords empruntés",
  duration: 10,
  gropiTip: "En Do majeur, un accord qui contient Mib, Lab ou Sib vient en général de Do mineur : Fam (Lab), Sib (Sib), Lab (Lab, Mib). Écoute comme ces notes assombrissent la couleur.",
  content: [
    { type: "p", text: "Jusqu'ici, on a joué avec les 7 accords diatoniques d'une tonalité. Mais les compositeurs ne se limitent pas à ces 7 accords — ils 'empruntent' des accords venant d'autres tonalités pour enrichir leurs progressions. Cette technique, appelée 'modal mixture' ou 'emprunt au mineur parallèle', est l'une des plus utilisées en pop, rock et jazz." },
    { type: "h", text: "Le principe de l'emprunt" },
    { type: "p", text: "Une chanson en Do majeur peut temporairement emprunter un accord de Do mineur (sa 'tonalité parallèle'). Do majeur = Do-Ré-Mi-Fa-Sol-La-Si. Do mineur = Do-Ré-Mib-Fa-Sol-Lab-Sib. Les accords exclusifs à Do mineur (qui n'existent pas en Do majeur) peuvent être 'empruntés' pour créer de la couleur." },
    { type: "h", text: "L'accord ♭VII : le plus emprunté" },
    { type: "p", text: "En Do majeur, le VII est Si diminué. En empruntant de Do mineur, tu obtiens le ♭VII = Si♭ majeur. Cet accord (Si♭-Ré-Fa) n'appartient pas à Do majeur, mais il est souvent utilisé. Exemple : Do-Si♭-Fa-Do (I-♭VII-IV-I). Rock classique, Beatles ('Hey Jude'). Le ♭VII apporte une couleur 'brute', presque modale." },
    { type: "h", text: "L'accord ♭VI : la couleur dramatique" },
    { type: "p", text: "En empruntant à Do mineur, tu obtiens le ♭VI = La♭ majeur. Très utilisé pour une touche dramatique ou 'épique'. Progression : I-♭VI-♭VII-I (Do-Lab-Sib-Do). Utilisée dans beaucoup de chansons rock 'épiques' et de musiques de film d'action." },
    { type: "h", text: "L'accord iv (sous-dominante mineure)" },
    { type: "p", text: "En Do majeur, le IV est Fa majeur. En empruntant à Do mineur, tu obtiens iv = Fa mineur. Cet accord crée une couleur 'soul', mélancolique même dans un contexte majeur. Progression classique : I-IV-iv-I (Do-Fa-Fa mineur-Do). Très présente dans les ballades soul." },
    {
      type: "chord_diagram",
      caption: "Fm — sous-dominante mineure empruntée (1 3 3 1 1 1, barré case 1)",
      data: { name: "Fm (iv)", frets: [1,3,3,1,1,1], fingers: [1,3,4,1,1,1], startFret: 1, barre: { fret: 1, from: 0, to: 5 } },
    },
    {
      type: "chord_diagram",
      caption: "Bb — ♭VII emprunté (× 1 3 3 3 1 barré case 1)",
      data: { name: "Bb (♭VII)", frets: [-1,1,3,3,3,1], fingers: [0,1,2,3,4,1], startFret: 1, barre: { fret: 1, from: 1, to: 5 } },
    },
    { type: "h", text: "L'accord V/V : dominante de la dominante" },
    { type: "p", text: "Autre type d'emprunt : les 'dominantes secondaires'. Tu peux construire un accord de dominante (X7) qui résout vers n'importe quel accord diatonique. Ex : A7 → Dm (dans Do majeur). A7 n'est pas diatonique en Do, mais il 'prépare' Dm (ii de Do) comme une mini-résolution V→I. Résultat : la progression sonne plus 'jazz' et 'orientée'." },
    { type: "h", text: "Le ♭II (accord napolitain)" },
    { type: "p", text: "Emprunt classique de la musique classique : le 'accord napolitain' = ♭II majeur en position fondamentale (ou 1ère inversion). En Do : ♭II = Réb majeur. Utilisé avant le V pour créer une tension supérieure. Très dramatique. Présent dans Beethoven, Mozart, et même dans du rock moderne (Radiohead utilise des accords 'napolitains')." },
    { type: "ref", text: "'Creep' (Radiohead, 1992) utilise la progression I-III-IV-iv (en Sol : Sol-Si-Do-Do mineur). Le Do mineur (iv) est emprunté à Sol mineur. Ce passage entre Do majeur et Do mineur est le moment émotionnellement le plus fort de la chanson — l'emprunt crée la surprise harmonique qui accompagne le pivot textuel 'I'm a creep'." },
    { type: "tip", text: "Expérimente l'emprunt : prends I-IV-V-I en Do (Do-Fa-Sol-Do). Remplace le IV par iv (Do-Fa mineur-Sol-Do). Entends la différence. C'est ça, l'emprunt : 1 accord différent, tout l'effet change. Essaie aussi de remplacer le V par ♭VII (Do-Fa-Sib-Do) pour un effet rock." },
  ],
  quiz: ["q-harm-44", "q-harm-45", "q-harm-46", "q-harm-25", "q-impro-03"],
};

export const quiz = [
  {id:"q-harm-44",courseId:"harmony",lessonId:"harm-c7-01",lvl:1,q:"En Do majeur, quel est l'accord ♭VII emprunté à Do mineur ?",o:["Si diminué","Si mineur","Si♭ majeur","La♭ majeur"],a:2,exp:"Le VII de Do majeur est Si diminué ; emprunté à Do mineur, le ♭VII devient Si♭ majeur (Si♭-Ré-Fa).",xp:30},
  {id:"q-harm-45",courseId:"harmony",lessonId:"harm-c7-01",lvl:2,q:"D'où vient l'accord Fa mineur dans une chanson en Do majeur ?",o:["De La mineur, la relative de Do","De Fa majeur, la sous-dominante","D'une simple erreur de transcription","De Do mineur (tonalité parallèle)"],a:3,exp:"Fa mineur est le iv de Do mineur, la tonalité parallèle (même tonique) : c'est un accord emprunté.",xp:40},
  {id:"q-harm-46",courseId:"harmony",lessonId:"harm-c7-01",lvl:2,q:"En Do majeur, quel accord prépare Dm comme une dominante ?",o:["A7","G7","E7","D7"],a:0,exp:"A7 est la dominante de Ré : une dominante secondaire, qui fait de Dm une mini-résolution.",xp:40},
];
