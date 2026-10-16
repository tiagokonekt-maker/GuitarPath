// Leçon du module « harmony » + les questions de quiz qui s'y rattachent.
// Format décrit dans src/content/README.md.

export default {
  id: "harm-c7-03", level: 9,
  title: "Les modulations : changer de tonalité",
  duration: 10,
  gropiTip: "Pour moduler vers une tonalité, glisse son accord V7 juste avant : de Do vers Mi, passe par Si7 ; de Do vers Fa, par Do7. Un seul accord, et l'oreille suit.",
  content: [
    { type: "p", text: "Une modulation, c'est le changement de tonalité pendant un morceau. C'est l'une des techniques les plus expressives en composition : elle peut créer une montée d'énergie, une surprise, ou un changement d'ambiance radical. Les modulations sont présentes dans presque toute la musique, du classique à la pop en passant par le jazz." },
    { type: "h", text: "Pourquoi moduler ?" },
    { type: "p", text: "Plusieurs raisons. Monter d'un ton au refrain : technique pop classique pour créer une montée d'énergie ('And I Will Always Love You' de Whitney Houston monte d'un ton pour le dernier refrain). Changer d'ambiance : passer du majeur au mineur parallèle (ou vice versa). Développement harmonique : le jazz module constamment pour explorer différentes tonalités." },
    { type: "h", text: "Modulation diatonique (par pivot)" },
    { type: "p", text: "La modulation la plus douce : trouver un accord commun aux 2 tonalités ('accord pivot') et l'utiliser comme charnière. Ex : passer de Do majeur à Sol majeur. L'accord Am (vi de Do = ii de Sol) sert de pivot. Do-Am-D7-G : le Am est en Do majeur, mais le D7 prépare Sol. L'oreille accepte la modulation sans choc." },
    {
      type: "circle_of_fifths",
      caption: "Do et Sol sont voisins sur le cercle — elles partagent presque toutes leurs notes",
      data: {
        highlight: ["Do", "Sol"],
        showMinors: true,
      },
    },
    { type: "h", text: "Modulation directe (abrupte)" },
    { type: "p", text: "Parfois, on module sans préparation — juste en sautant directement à la nouvelle tonalité. L'effet peut être surprenant ou même choquant. Très utilisé dans la pop pour les 'key changes' spectaculaires (dernier refrain plus haut). 'I Will Survive' (Gloria Gaynor) monte d'un demi-ton de façon assez abrupte sur le dernier refrain." },
    { type: "h", text: "Modulation par dominante secondaire" },
    { type: "p", text: "On prépare la nouvelle tonalité avec un accord de dominante (V7) qui résout vers elle. Ex : passage de Do majeur vers Ré majeur. A7 (dominante de Ré) prépare l'arrivée en Ré. Progression : ...Cmaj7-A7-Dmaj7... L'A7 'annonce' la nouvelle tonalité. C'est la modulation la plus fréquente en jazz." },
    { type: "h", text: "Modulation relative (majeur ↔ mineur)" },
    { type: "p", text: "Passer d'une tonalité majeure à sa relative mineure (ou vice versa) est très courant. Do majeur ↔ La mineur. Mêmes notes, changement de fondamentale ressentie. Beaucoup de ballades commencent au majeur et glissent vers le mineur pour les couplets (ou inversement). 'Hotel California' (Eagles) commence en Si mineur et résout sur Ré majeur (relatif)." },
    { type: "h", text: "Modulation par cycle de quartes (jazz)" },
    { type: "p", text: "Le jazz module souvent en suivant le cycle des quintes : après un ii-V-I en Do, on passe à ii-V-I en Fa (quarte plus bas), puis en Sib, etc. 'Autumn Leaves' suit ce principe. Chaque ii-V-I est 'résolu' et sert de 'do' pour la modulation suivante. C'est la modulation la plus fluide et la plus naturelle à l'oreille." },
    { type: "ref", text: "'Modulation magique' la plus célèbre de la pop : 'Man in the Mirror' (Michael Jackson). Après le refrain, la musique monte d'un demi-ton. Puis encore un demi-ton. L'effet d'élévation émotionnelle est spectaculaire. C'est une modulation directe répétée — simple mais efficace. En live, ça 'soulève' littéralement le public." },
    { type: "tip", text: "Compose une modulation simple : joue I-IV-V-I en Do majeur. Puis joue immédiatement I-IV-V-I en Ré majeur (juste 1 ton plus haut). Le contraste est frappant. Maintenant essaie une transition plus douce : Do-A7-Ré majeur (la A7 prépare Ré). Entends la différence entre modulation abrupte et préparée." },
  ],
  quiz: ["q-harm-22","q-impro-08","q-impro-10"],
};

export const quiz = [
  {id:"q-harm-22",courseId:"harmony",lessonId:"harm-c7-03",lvl:3,q:"Pour moduler de Do majeur à Sol majeur, lequel de ces accords peut servir de pivot ?",o:["La mineur","Fa majeur","Ré majeur","Si mineur"],a:0,exp:"Un pivot appartient aux deux tonalités. La mineur est le vi de Do et le ii de Sol : Do - Lam - D7 - Sol module sans choc. Fa majeur (Fa naturel) n'existe qu'en Do ; Ré majeur et Si mineur (avec Fa#) n'existent qu'en Sol.",xp:55},
];
