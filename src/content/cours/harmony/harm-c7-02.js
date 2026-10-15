// Leçon du module « harmony » + les questions de quiz qui s'y rattachent.
// Format décrit dans src/content/README.md.

export default {
  id: "harm-c7-02", level: 9,
  title: "La substitution tritonique",
  duration: 9,
  gropiTip: "Moyen mnémotechnique : la substitution tritonique a sa fondamentale un demi-ton au-dessus de l'accord visé. Vers Do : Réb7. Vers Sol : Lab7. Vers Fa : Solb7.",
  content: [
    { type: "p", text: "La substitution tritonique est l'une des techniques harmoniques les plus sophistiquées et les plus utilisées du jazz moderne. Elle permet de remplacer un accord de dominante par un autre accord de dominante situé un triton plus loin — créant ainsi des lignes de basse chromatiques élégantes et une couleur harmonique inattendue." },
    { type: "h", text: "Le principe" },
    { type: "p", text: "N'importe quel accord V7 peut être remplacé par un autre accord V7 situé 6 demi-tons (1 triton) plus haut. G7 (dominante de Do) peut être remplacé par Db7 (= Ré♭7). Pourquoi ? Parce que G7 et Db7 partagent les mêmes guide tones (3e et 7e), juste interverties." },
    { type: "h", text: "La preuve par les guide tones" },
    { type: "p", text: "G7 : guide tones = Si (3e) et Fa (7e). Db7 : guide tones = Fa (3e) et Do♭ = Si (enharmonique) (7e). G7 a Si et Fa. Db7 a Fa et Si. Les mêmes 2 notes, inversées dans leur rôle (3e et 7e). Comme ces notes définissent la qualité de l'accord, les deux accords 'résolvent' de la même façon vers Cmaj7." },
    { type: "h", text: "La ligne de basse chromatique" },
    { type: "p", text: "L'avantage majeur de la substitution tritonique : la ligne de basse chromatique. Dm7 (Ré) → G7 (Sol) → Cmaj7 (Do) = saut de quarte, puis quarte. Dm7 (Ré) → Db7 (Réb) → Cmaj7 (Do) = descente chromatique : Ré → Réb → Do. Cette descente d'un demi-ton à chaque accord est beaucoup plus élégante et 'jazz'." },
    { type: "h", text: "Substitution tritonique vs substitution ordinaire" },
    { type: "p", text: "Substitution ordinaire : remplacer un accord par un autre de la même famille (ex : IV par ii, V par vii°). Substitution tritonique : remplacer un V7 par le V7 opposé (à 6 demi-tons). La tritonique est plus avancée et crée un effet harmonique plus surprenant." },
    { type: "h", text: "Utilisation pratique" },
    { type: "p", text: "Dans une grille de jazz, tu peux appliquer la substitution tritonique sur n'importe quel V7. Am7-D7-Gmaj7 (ii-V-I en Sol) → Am7-Ab7-Gmaj7 (La♭7 au lieu de Ré7). La basse descend La → Lab → Sol. On peut aller encore plus loin : varier d'une répétition à l'autre (D7 la première fois, Ab7 la deuxième) pour éviter la répétition." },
    { type: "h", text: "Extensions altérées sur la sub tri" },
    { type: "p", text: "L'accord de substitution tritonique (Db7 à la place de G7) peut être enrichi d'extensions altérées (♭9, #9, ♭13) pour un son encore plus complexe. Db7alt (Réb avec extensions altérées) résout sur Cmaj7 avec une tension maximale. C'est le vocabulaire harmonique du jazz post-bebop." },
    { type: "ref", text: "Charlie Parker, Dizzy Gillespie et les autres fondateurs du bebop (années 1940) ont codifié la substitution tritonique comme outil standard. Écoute 'Donna Lee' ou 'Anthropology' de Parker : les reharmonisations rapides que tu entends utilisent massivement les substitutions tritoniques." },
    { type: "tip", text: "Exercice simple : joue Am7-G7-Cmaj7 en boucle. Maintenant remplace G7 par Db7 : Am7-Db7-Cmaj7. Entends la différence ? La ligne de basse La-Réb-Do contre La-Sol-Do. La substitution crée une descente chromatique. C'est élégant et ça ne coûte qu'1 note de changement." },
  ],
  quiz: ["q-harm-47", "q-harm-48", "q-harm-49", "q-impro-05", "q-impro-06"],
};

export const quiz = [
  {id:"q-harm-47",courseId:"harmony",lessonId:"harm-c7-02",lvl:1,q:"Avec la substitution tritonique, par quel accord remplace-t-on G7 ?",o:["D7","Db7","C7","Ab7"],a:1,exp:"Un triton (6 demi-tons) au-dessus de Sol : Réb. G7 devient Db7.",xp:30},
  {id:"q-harm-48",courseId:"harmony",lessonId:"harm-c7-02",lvl:2,q:"Pourquoi G7 et Db7 sont-ils interchangeables ?",o:["Ils ont la même fondamentale","Ils ont le même nombre de notes","Ils partagent les mêmes guide tones","Ils sont dans la même gamme majeure"],a:2,exp:"G7 a Si et Fa ; Db7 a Fa et Do♭ (= Si). Mêmes guide tones, rôles inversés : ils résolvent de la même façon.",xp:40},
  {id:"q-harm-49",courseId:"harmony",lessonId:"harm-c7-02",lvl:1,q:"Dm7 - Db7 - Cmaj7 : que fait la basse ?",o:["Elle saute de quarte en quarte","Elle reste sur Do","Elle monte par tons","Elle descend par demi-tons"],a:3,exp:"Ré → Réb → Do : une descente chromatique, au lieu des sauts Ré → Sol → Do.",xp:30},
];
