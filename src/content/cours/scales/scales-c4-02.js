// Leçon du module « scales » + les questions de quiz qui s'y rattachent.
// Format décrit dans src/content/README.md.

export default {
  id: "scales-c4-02", level: 7,
  title: "Qu'est-ce qu'un mode (la grande révélation)",
  duration: 12,
  gropiTip: "Pour trouver la gamme parente d'un mode, remonte jusqu'au degré I : La dorien est le IIe degré, donc la gamme parente commence un ton plus bas, sur Sol. La dorien = notes de Sol majeur.",
  content: [
    { type: "p", text: "Voilà. Tu y es. Tu as toutes les briques nécessaires pour comprendre les modes — ce concept qui terrorise tant de guitaristes intermédiaires. Mais en réalité, après ce que tu viens d'apprendre dans la leçon précédente, les modes vont te paraître évidents. Promis." },
    { type: "h", text: "La définition simple" },
    { type: "p", text: "Un mode = la gamme majeure jouée en partant d'un degré différent de la tonique. C'est tout. Si tu prends Do majeur (Do-Ré-Mi-Fa-Sol-La-Si) et que tu commences la gamme sur Ré au lieu de Do, tu obtiens : Ré-Mi-Fa-Sol-La-Si-Do-Ré. Ce sont les MÊMES notes que Do majeur, mais avec Ré comme fondamentale. Ce 'mode' s'appelle le mode dorien.", img: "/illus-prisme-lumiere.webp", imgAlt: "Un prisme qui décompose un rayon de lumière blanche en plusieurs couleurs", imgSide: "left" },
    { type: "h", text: "7 modes pour 7 degrés" },
    { type: "p", text: "Comme la gamme majeure a 7 degrés, on peut commencer la gamme sur 7 fondamentales différentes. Donc 7 modes existent. Voici leurs noms et leurs degrés de départ : I = Ionien (= majeur). II = Dorien. III = Phrygien. IV = Lydien. V = Mixolydien. VI = Éolien (= mineur naturel). VII = Locrien. Dans l'ordre, on a IDPLMEL. Mnémonique anglais : 'I Don't Particularly Like Modes A Lot' (I D P L M A L)." },
    { type: "h", text: "Pourquoi des noms grecs ?" },
    { type: "p", text: "Les noms viennent de la Grèce antique. Chaque mode portait le nom d'une région ou peuple grec : les Doriens (région du Péloponnèse), les Phrygiens (Asie Mineure), les Lydiens (royaume d'Anatolie), les Mixolydiens, les Éoliens (îles éoliennes), les Locriens (peuple grec ancien). Les Grecs avaient théorisé ces modes 500 ans avant notre ère. Ils ont été formalisés par l'Église médiévale, puis redécouverts par les jazzmen au XXe siècle. Histoire de plus de 2500 ans." },
    { type: "h", text: "Mêmes notes, ambiances opposées" },
    { type: "p", text: "Voici la chose magique : les 7 modes de Do majeur partagent EXACTEMENT les mêmes 7 notes (Do-Ré-Mi-Fa-Sol-La-Si). Mais selon la fondamentale choisie, l'ambiance change radicalement. Mi phrygien (mêmes notes que Do majeur, fondamentale Mi) sonne espagnol. Lydien (fondamentale Fa) sonne flottant et magique. Mixolydien (fondamentale Sol) sonne rock'n'roll. C'est le pouvoir de la fondamentale ressentie." },
    { type: "h", text: "Modes 'majeurs' et modes 'mineurs'" },
    { type: "p", text: "Tous les modes ne sonnent pas pareil. Si la tierce est majeure (à 4 demi-tons de la fondamentale), le mode est dit 'majeur' : Ionien, Lydien, Mixolydien. Si la tierce est mineure (3 demi-tons), le mode est dit 'mineur' : Dorien, Phrygien, Éolien, Locrien. La tierce est ce qui détermine la couleur de base." },
    { type: "h", text: "Pourquoi utiliser des modes en 2026 ?" },
    { type: "p", text: "Parce qu'ils élargissent la palette sonore disponible. La gamme majeure et la gamme mineure suffisent pour une grande partie de la musique pop. Mais si tu veux faire du blues-jazz (dorien), du rock énergique (mixolydien), de la musique mystérieuse (lydien), du flamenco/oriental (phrygien), tu as besoin des modes. Ils sont les outils des compositeurs modernes." },
    { type: "ref", text: "Pour entendre la différence : prends un drone (note tenue) en Ré sur ta basse ou via une app. Joue Do majeur (Do-Ré-Mi-Fa-Sol-La-Si). Tu entendras du dorien : couleur mineure mais lumineuse. Maintenant change de drone vers Mi et joue les MÊMES notes : tu entendras du phrygien, espagnol et tendu. Mêmes notes, ambiances opposées. C'est ça, les modes." },
    { type: "tip", text: "Ne te décourage pas si les modes paraissent complexes. Ils ne le sont pas — ils sont juste nouveaux. Dans les 7 prochaines leçons, on va prendre chaque mode un par un et tu vas le maîtriser." },
  ],
  quiz: ["q-scales-09","q-scales-12","q-scales-13","q-logic-03","q-logic-08","q-scales-03","q-scales-04","q-scales-08"],
};

export const quiz = [
  {id:"q-scales-09",courseId:"scales",lessonId:"scales-c4-02",lvl:2,q:"Le mode dorien correspond à quel degré de la gamme majeure ?",o:["1er","2e","3e","4e"],a:1,exp:"Dorien = 2e mode. Ré dorien = jouer Do majeur en partant de Ré. I=Ionien, II=Dorien, III=Phrygien, IV=Lydien, V=Mixolydien, VI=Éolien, VII=Locrien.",xp:35},
  {id:"q-scales-12",courseId:"scales",lessonId:"scales-c4-02",lvl:3,q:"En La majeur, quel est le mode joué en partant de Do# ?",o:["Do# phrygien","Do# dorien","Do# lydien","Do# locrien"],a:0,exp:"En La majeur, Do# est le 3e degré. Le 3e mode = phrygien. Do# phrygien = La majeur en partant de Do#. Notes : Do#-Ré-Mi-Fa#-Sol#-La-Si.",xp:55},
  {id:"q-scales-13",courseId:"scales",lessonId:"scales-c4-02",lvl:3,q:"Quelle paire de modes a EXACTEMENT les mêmes notes que Do majeur ?",o:["Mi dorien et Fa lydien","Ré dorien et Sol mixolydien","Sol dorien et La éolien","Si phrygien et Do# locrien"],a:1,exp:"Tous les modes de Do majeur partagent les mêmes 7 notes. Ré dorien (II) et Sol mixolydien (V) sont 2 modes de Do majeur. Aussi : Mi phrygien, Fa lydien, La éolien, Si locrien.",xp:55},
  {id:"q-logic-03",courseId:"scales",lessonId:"scales-c4-02",lvl:3,q:"Tous les modes de Do majeur (Ionien, Dorien, etc.) partagent…",o:["La même fondamentale","Le même tempo","Les mêmes 7 notes","La même couleur"],a:2,exp:"7 modes de Do majeur = 7 fondamentales différentes mais MÊMES NOTES (Do-Ré-Mi-Fa-Sol-La-Si). C'est la fondamentale qui change la couleur ressentie.",xp:50},
  {id:"q-logic-08",courseId:"scales",lessonId:"scales-c4-02",lvl:3,q:"Si tu joues les 7 modes de Do majeur (Do ionien, Ré dorien...), tu joues toujours…",o:["7 gammes aux notes toutes différentes", "La gamme chromatique complète, 12 notes", "Des gammes pentatoniques de 5 notes chacune", "Les mêmes 7 notes, depuis 7 fondamentales"],a:3,exp:"Mêmes notes Do-Ré-Mi-Fa-Sol-La-Si dans tous les modes. Seule la fondamentale change. C'est ce changement de centre qui crée la 'couleur' modale.",xp:55},
];
