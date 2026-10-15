// Leçon du module « impro » + les questions de quiz qui s'y rattachent.
// Format décrit dans src/content/README.md.

export default {
  id: "impro-intro-01", level: 6,
  title: "Ta première improvisation : 3 notes, en rythme",
  duration: 8,
  content: [
    { type: "p", text: "Improviser ne veut pas dire connaître toute la pentatonique par cœur, ni jouer vite. Ça veut dire faire des choix — même avec très peu de matière — et les assumer. Cette leçon te donne ta toute première impro, avec seulement 3 notes." },
    { type: "h", text: "Le piège du débutant" },
    { type: "p", text: "Beaucoup pensent qu'il faut d'abord maîtriser les 5 positions de la pentatonique avant de pouvoir improviser 'pour de vrai'. C'est faux, et ça retarde inutilement le plaisir de jouer. Avec 3 notes bien placées rythmiquement, tu improvises déjà — au sens plein du terme." },
    { type: "h", text: "L'exercice : 3 notes, une pulsation" },
    { type: "p", text: "Prends juste 3 notes de la pentatonique mineure que tu viens de voir : la fondamentale, la tierce mineure, la quinte. Sur un backing ou un métronome, joue UNIQUEMENT ces 3 notes pendant 2 minutes. Ta seule variable : QUAND tu les joues, pas lesquelles." },
    { type: "h", text: "Pourquoi le rythme d'abord" },
    { type: "p", text: "Une seule note bien placée dans le temps vaut mieux qu'une gamme entière jouée sans intention. Le rythme est le langage principal de l'expression musicale ; le choix des notes vient après, une fois que tu as un petit stock 'sûr' dans les doigts." },
    { type: "ref", text: "B.B. King est resté toute sa carrière l'un des guitaristes les plus reconnaissables, avec un vocabulaire de notes volontairement restreint. Ce qui rend son jeu inoubliable, ce n'est pas la quantité de notes : c'est leur placement et leur intention." },
    { type: "tip", text: "Drill (2 min) : en La mineur, prends La (corde 6, case 5), Do (corde 6, case 8), Mi (corde 5, case 7). Lance un métronome à 70 BPM. Joue seulement ces 3 notes, en variant le rythme et les silences — jamais les notes elles-mêmes." },
  ],
  quiz: ["q-impro-32","q-impro-33"],
};

export const quiz = [
  {id:"q-impro-32",courseId:"impro",lessonId:"impro-intro-01",lvl:1,q:"Dans l'exercice des 3 notes, sur quoi porte l'attention principale ?",o:["Jouer le plus de notes possible","La vitesse d'exécution","Utiliser toute la gamme pentatonique","Le rythme et le placement des notes"],a:3,exp:"L'exercice isole volontairement le choix des notes (3 seulement) pour que toute l'attention se porte sur QUAND elles sont jouées, pas lesquelles.",xp:25},
  {id:"q-impro-33",courseId:"impro",lessonId:"impro-intro-01",lvl:1,q:"Le style de B.B. King est reconnu comme un jeu…",o:["Peu de notes, mais un placement très travaillé", "Très rapide et très technique, avec beaucoup de notes", "Uniquement basé sur des accords plaqués", "Sans intention rythmique particulière"],a:0,exp:"B.B. King est célèbre pour l'inverse de la virtuosité rapide : un nombre de notes volontairement réduit, mais un placement et une expressivité incomparables.",xp:25},
];
