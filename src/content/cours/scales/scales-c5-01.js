// Leçon du module « scales » + les questions de quiz qui s'y rattachent.
// Format décrit dans src/content/README.md.

export default {
  id: "scales-c5-01", level: 7,
  title: "Ionien — la lumière pure (= majeur)",
  duration: 8,
  gropiTip: "Improvise en Do ionien sur une boucle Do-Fa-Sol et termine chaque phrase sur une note de l'accord de Do (Do, Mi ou Sol). C'est ce repos qui donne à l'ionien sa stabilité.",
  content: [
    { type: "p", text: "Le mode ionien, c'est tout simplement... la gamme majeure que tu connais déjà. Pas de surprise, pas de note caractéristique exotique. Mais l'aborder en tant que 'mode' permet de bien le situer dans la famille des 7 modes, et de comprendre ce qui le rend unique.", img: "/illus-lever-soleil.webp", imgAlt: "Un lever de soleil stylisé", imgSide: "left" },
    { type: "h", text: "Formule" },
    { type: "p", text: "1 - 2 - 3 - 4 - 5 - 6 - 7. Aucune altération par rapport à la 'gamme parente' (puisque c'est elle-même). En Do : Do-Ré-Mi-Fa-Sol-La-Si." },
    { type: "h", text: "Couleur sonore" },
    { type: "p", text: "Joyeux, lumineux, stable, ouvert. C'est le mode 'par défaut' de la musique pop occidentale depuis plusieurs siècles. Quand tu entends une chanson 'qui sent l'été', il y a de bonnes chances qu'elle soit en ionien." },
    { type: "h", text: "Pourquoi 'mode brillant'" },
    { type: "p", text: "Sur une échelle imaginaire qui classe les modes du plus lumineux au plus sombre, le Ionien est en deuxième position (juste derrière le Lydien, plus brillant encore). Ses 2 demi-tons (entre 3-4 et 7-8) créent des résolutions qui satisfont l'oreille occidentale par habitude millénaire." },
    { type: "h", text: "Sur quels accords l'utiliser" },
    { type: "p", text: "Tout accord majeur 7 (Cmaj7, Gmaj7, etc.) en contexte 'tonal classique' (chanson en Do majeur, par exemple). C'est la valeur sûre. Si tu hésites sur un solo, joue en ionien : c'est la valeur sûre (évite seulement de tenir longtemps la quarte sur un accord majeur 7)." },
    { type: "h", text: "Histoire" },
    { type: "p", text: "Le mode ionien est un « nouveau venu » dans la théorie des modes : il n'y a été ajouté officiellement qu'au XVIe siècle, par le théoricien Glarean (Dodecachordon, 1547), alors que les modes plus anciens, comme le dorien, structuraient déjà le chant liturgique." },
    { type: "ref", text: "Exemples emblématiques : 'Let It Be' (Beatles) en Do ionien. 'Twist and Shout' (Beatles), 'Can't Help Falling in Love' (Elvis), 'Imagine' (John Lennon) — tous en mode ionien. C'est le langage par défaut de la pop." },
    { type: "tip", text: "Si tu sais déjà improviser en gamme majeure, tu sais improviser en ionien. Le seul changement, c'est ta façon de penser : au lieu de te dire 'je joue la gamme majeure', dis-toi 'je joue le mode ionien'. Cette nuance prépare ton cerveau aux 6 autres modes." },
  ],
  quiz: ["q-scales-38", "q-scales-39"],
};

export const quiz = [
  {id:"q-scales-38",courseId:"scales",lessonId:"scales-c5-01",lvl:1,q:"À quoi correspond le mode ionien ?",o:["À la gamme mineure naturelle", "À la pentatonique majeure", "À la gamme blues", "À la gamme majeure"],a:3,exp:"Ionien = gamme majeure : 1-2-3-4-5-6-7. En Do : Do-Ré-Mi-Fa-Sol-La-Si.",xp:30},
  {id:"q-scales-39",courseId:"scales",lessonId:"scales-c5-01",lvl:2,q:"Du plus lumineux au plus sombre, quel mode est juste devant l'ionien ?",o:["Le lydien", "Le mixolydien", "Le dorien", "Le phrygien"],a:0,exp:"Le lydien, avec sa quarte augmentée, est encore plus brillant que l'ionien.",xp:40},
];
