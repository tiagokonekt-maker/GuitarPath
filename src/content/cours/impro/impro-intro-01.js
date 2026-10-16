// Leçon du module « impro » + les questions de quiz qui s'y rattachent.
// Format décrit dans src/content/README.md.

export default {
  id: "impro-intro-01", level: 2,
  title: "Ta première improvisation : 3 notes, en rythme",
  duration: 8,
  gropiTip: "Choisis un motif noire-noire-blanche et place La, Do et Mi une fois chacun : il existe 6 ordres possibles, donc déjà 6 phrases différentes sur le même rythme.",
  content: [
    { type: "p", text: "Improviser ne veut pas dire connaître toute la pentatonique par cœur, ni jouer vite. Ça veut dire faire des choix — même avec très peu de matière — et les assumer. Cette leçon te donne ta toute première impro, avec seulement 3 notes." },
    { type: "h", text: "Le piège du débutant" },
    { type: "p", text: "Beaucoup pensent qu'il faut d'abord maîtriser les 5 positions de la pentatonique avant de pouvoir improviser 'pour de vrai'. C'est faux, et ça retarde inutilement le plaisir de jouer. Avec 3 notes bien placées rythmiquement, tu improvises déjà — au sens plein du terme." },
    { type: "h", text: "L'exercice : 3 notes, une pulsation" },
    { type: "p", text: "Prends juste 3 notes : La, Do et Mi, les notes de l'accord de La mineur que tu connais depuis Premiers pas (plus tard, tu les retrouveras comme fondamentale, tierce mineure et quinte de la pentatonique mineure). Sur un backing ou un métronome, joue UNIQUEMENT ces 3 notes pendant 2 minutes. Ta seule variable : QUAND tu les joues, pas lesquelles." },
    { type: "fretboard", caption: "Tes 3 notes en La mineur : La (fondamentale), Do (tierce mineure), Mi (quinte)", data: {frets: 5, startFret: 4, showStringNames: true, showFretNumbers: true, markerFrets: [5,7,9], notes: [{string: 6, fret: 5, label: "La", color: "amber", root: true}, {string: 6, fret: 8, label: "Do", color: "primary"}, {string: 5, fret: 7, label: "Mi", color: "primary"}]} },
    { type: "rhythm_grid", caption: "Une idée rythmique pour tes 3 notes : une attaque sur le 1, le « et de 2 » et le 4, du silence ailleurs", data: {beats: 4, subdivision: 8, highlights: [0,3,6], muted: [1,2,4,5,7], label: "1 · – · – · [et] · – · – · 4 · –"} },
    { type: "h", text: "Pourquoi le rythme d'abord" },
    { type: "p", text: "Une seule note bien placée dans le temps vaut mieux qu'une gamme entière jouée sans intention. Le rythme est le langage principal de l'expression musicale ; le choix des notes vient après, une fois que tu as un petit stock 'sûr' dans les doigts." },
    { type: "ref", text: "B.B. King est resté toute sa carrière l'un des guitaristes les plus reconnaissables, avec un vocabulaire de notes volontairement restreint. Ce qui rend son jeu inoubliable, ce n'est pas la quantité de notes : c'est leur placement et leur intention." },
    { type: "tip", text: "Drill (2 min) : en La mineur, prends La (corde 6, case 5), Do (corde 6, case 8), Mi (corde 5, case 7). Lance un métronome à 70 BPM. Joue seulement ces 3 notes, en variant le rythme et les silences — jamais les notes elles-mêmes." },
  ],
  quiz: ["q-impro-32","q-impro-33","q-impro-36"],
};

export const quiz = [
  {id:"q-impro-32",courseId:"impro",lessonId:"impro-intro-01",lvl:1,q:"Dans l'exercice des 3 notes, sur quoi porte l'attention principale ?",o:["Jouer le plus de notes possible","La vitesse d'exécution","Utiliser toute la gamme pentatonique","Le rythme et le placement des notes"],a:3,exp:"L'exercice isole volontairement le choix des notes (3 seulement) pour que toute l'attention se porte sur QUAND elles sont jouées, pas lesquelles.",xp:25},
  {id:"q-impro-33",courseId:"impro",lessonId:"impro-intro-01",lvl:1,q:"Tes trois notes La, Do et Mi sont les notes de quel accord ?",o:["La mineur","Do majeur","Mi mineur","La majeur"],a:0,exp:"La, Do, Mi = La mineur (Am), l'accord vu dans Premiers pas. C'est pour ça qu'elles sonnent juste sur un fond en La mineur : ce sont les notes mêmes de l'accord. La majeur aurait Do# à la place de Do.",xp:25},
  {id:"q-impro-36",courseId:"impro",lessonId:"impro-intro-01",lvl:1,q:"La est à la case 5 de la corde 6. Sur cette même corde, où trouves-tu Do ?",o:["Case 8","Case 7","Case 9","Case 3"],a:0,exp:"Do est 3 demi-tons au-dessus de La : 5 + 3 = 8. Tes trois notes tiennent sous la main : La (corde 6, case 5), Do (corde 6, case 8), Mi (corde 5, case 7).",xp:30},
];
