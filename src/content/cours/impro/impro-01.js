// Leçon du module « impro » + les questions de quiz qui s'y rattachent.
// Format décrit dans src/content/README.md.

export default {
  id: "impro-01", level: 6,
  title: "Penser en phrases musicales",
  duration: 12,
  content: [
    { type: "p", text: "L'improvisation n'est pas une suite de notes aléatoires — c'est une conversation musicale. Comme une phrase parlée, une phrase musicale a un début, un développement et une fin. Les grands improvisateurs (Miles Davis, Jimi Hendrix, Django Reinhardt) pensent tous en phrases, pas en gammes." },
    { type: "h", text: "La règle du silence" },
    { type: "p", text: "Le silence est ta meilleure arme. Une note seule, bien placée après un silence, a plus d'impact qu'une cascade de doubles-croches. Les débutants ont peur du silence et remplissent tout. Les pros utilisent le silence comme une note à part entière — c'est lui qui donne du sens aux notes qui suivent." },
    { type: "h", text: "Structure d'une phrase efficace" },
    { type: "p", text: "Une bonne phrase musicale fait 2 à 4 mesures. Elle monte vers un point culminant (souvent la 3e mesure), puis descend vers une note de résolution. Pense à une question (tension) suivie d'une réponse (résolution). La question finit souvent sur une note instable (2e, 7e). La réponse arrive sur une note stable (fondamentale, 3e, 5e)." },
    { type: "fretboard_interactive", mode: "highlight", notes: ["A", "C", "E"], caption: "Notes stables de Am — cibles de résolution idéales", displayMode: "notes", lang: "fr", compact: true },
    { type: "h", text: "Le principe call & response" },
    { type: "p", text: "Joue une phrase de 2 mesures (question), puis silence 2 mesures (réponse imaginaire). Répète. Cette alternance question/réponse est la base du blues, du jazz et du rock. B.B. King en est le maître absolu — il joue 3 notes, attend, répond à lui-même. Chaque phrase est une mini-conversation." },
    { type: "tip", text: "Exercice : sur un backing Am 70 BPM, joue 2 mesures, silence 2 mesures. Pendant le silence, écoute ce que tu viens de jouer et prépare ta réponse. Fais ça 10 minutes. Tu viens d'apprendre à phraser." },
    { type: "h", text: "Varier le rythme, pas que les notes" },
    { type: "p", text: "Beaucoup de débutants varient les notes mais jouent toujours le même rythme. Les pros font l'inverse : ils varient le rythme sur peu de notes. Prends juste La-Do-Mi (3 notes d'Am) et joue-les en blanches, puis en croches, puis avec des syncopes, puis avec des triolets. Tu viens d'obtenir 10 phrases différentes avec 3 notes." },
    { type: "fretboard_interactive", mode: "scale", root: "A", scale: "pentatonic_minor", caption: "Pentatonique de La — 5 notes suffisent pour des heures d'impro", displayMode: "notes", lang: "fr", compact: true },
  ],
  quiz: ["q-rhy-36","q-impro-23","q-impro-24","q-impro-01"],
};

export const quiz = [
  {id:"q-rhy-36",courseId:"rhythm",lessonId:"impro-01",lvl:2,q:"À quoi sert un silence après quelques notes de solo ?",o:["À masquer une hésitation sur la suite","À donner le temps d'entendre ce qui vient d'être joué","À marquer la fin d'un morceau lent","À rien : cela casse l'élan et fait retomber l'énergie"],a:1,exp:"Sans silence, les phrases se fondent en un flux continu que l'oreille ne peut plus découper. Le silence est ce qui transforme une suite de notes en phrase — c'est la ponctuation.",xp:30},
  {id:"q-impro-23",courseId:"impro",lessonId:"impro-01",lvl:2,q:"Une phrase de solo qui se termine sur la tonique donne une impression de…",o:["Question laissée ouverte","Tension portée à son maximum","Conclusion","Fausse note"],a:2,exp:"La tonique est le point d'arrivée de la tonalité : y finir ferme la phrase. Finir sur la seconde ou la septième laisse l'oreille en attente — c'est comme cela qu'on construit un dialogue question-réponse.",xp:30},
  {id:"q-impro-24",courseId:"impro",lessonId:"impro-01",lvl:2,q:"Tu viens de jouer une phrase de quatre notes. Quelle suite construit le mieux un solo ?",o:["Une phrase entièrement différente","Un trait rapide d'une dizaine de notes","La même phrase à l'identique, dix fois","La même phrase déplacée ou légèrement modifiée"],a:3,exp:"Répéter en transformant : l'oreille reconnaît le motif et suit son évolution. Tout changer à chaque phrase donne du décousu, ne rien changer donne de la monotonie. C'est la même logique que pour un riff.",xp:30},
];
