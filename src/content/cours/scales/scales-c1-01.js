// Leçon du module « scales » + les questions de quiz qui s'y rattachent.
// Format décrit dans src/content/README.md.

export default {
  id: "scales-c1-01", level: 1,
  title: "L'alphabet musical : les 7 notes naturelles",
  duration: 8,
  content: [
    { type: "p", text: "Avant d'aborder les gammes, les modes ou l'harmonie, il faut faire connaissance avec la matière première de la musique : les notes. Et bonne nouvelle, il n'y en a pas autant qu'on le croit. La musique occidentale repose sur seulement 7 notes naturelles, qui se répètent à l'infini sur ton instrument.", img: "/illus-escalier-notes.webp", imgAlt: "Escalier avec les 7 notes Do Ré Mi Fa Sol La Si sur chaque marche", imgSide: "right" },
    { type: "h", text: "Les 7 notes" },
    { type: "p", text: "Do, Ré, Mi, Fa, Sol, La, Si. Voilà. C'est tout. Tu les connais peut-être aussi en notation anglo-saxonne : C, D, E, F, G, A, B. Les deux notations désignent exactement les mêmes notes. Sur les partitions et tablatures internationales, c'est la notation anglaise qui domine. Sur la guitare, en France, on mélange souvent les deux." },
    { type: "h", text: "Pourquoi Do = C et pas A ?" },
    { type: "p", text: "Question légitime. Historiquement, l'alphabet musical anglais a démarré sur LA (= A), qui correspondait à la note de référence (le diapason). Mais l'oreille occidentale s'est progressivement orientée vers DO (= C) comme note 'centrale' parce que la gamme majeure de Do est la plus simple à analyser (aucune altération). C'est pour ça qu'on dit 'Do, Ré, Mi...' et pas 'La, Si, Do...' quand on liste les notes." },
    { type: "h", text: "Les notes se répètent par octaves" },
    { type: "p", text: "Quand tu joues les 7 notes en montant (Do-Ré-Mi-Fa-Sol-La-Si), la 8e note est à nouveau un Do, mais plus aigu. C'est ce qu'on appelle une octave. Sur ta guitare, la case 12 d'une corde sonne exactement comme la corde à vide, mais une octave plus haut. Cette répétition est universelle dans toute la musique tonale." },
    { type: "ref", text: "Écoute les premières notes de 'Do-Ré-Mi' (chanson tirée de 'La Mélodie du bonheur', 1965) : c'est littéralement la gamme majeure de Do chantée note par note. Une oreille qui connaît cette mélodie connaît déjà l'ordre des 7 notes." },
    { type: "tip", text: "Avant d'aller plus loin, mémorise cet ordre dans les deux notations : Do=C, Ré=D, Mi=E, Fa=F, Sol=G, La=A, Si=B. C'est le b.a.-ba." },
  ],
  quiz: ["q-base-03","q-base-04"],
};

export const quiz = [
  {id:"q-base-03",courseId:"scales",lessonId:"scales-c1-01",lvl:1,q:"Combien de notes naturelles (sans dièse ni bémol) la musique occidentale utilise-t-elle ?",o:["5","8","7","12"],a:2,exp:"Do, Ré, Mi, Fa, Sol, La, Si : 7 notes naturelles, qui se répètent ensuite à l'octave.",xp:25},
  {id:"q-base-04",courseId:"scales",lessonId:"scales-c1-01",lvl:1,q:"Quelle note vient juste après Si quand on monte la gamme naturelle ?",o:["Ré","La","Mi","Do"],a:3,exp:"Après Si, la suite recommence sur Do. L'alphabet musical boucle en permanence : Do Ré Mi Fa Sol La Si Do…",xp:25},
];
