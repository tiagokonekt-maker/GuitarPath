// Leçon du module « impro » + les questions de quiz qui s'y rattachent.
// Format « leçon en cartes » décrit dans src/content/README.md.

export default {
  id: "impro-01", level: 6,
  title: "Penser en phrases musicales",
  duration: 8,
  gropiTip: "Pour savoir où finit ta phrase, respire avec elle : commence à jouer en expirant et arrête-toi quand tu dois reprendre ton souffle. Ton solo se met à respirer comme un chanteur.",
  cartes: [
    { type: "idee", titre: "Une conversation", texte: [
      "Improviser, ce n'est pas aligner des notes au hasard : c'est parler. Comme une phrase dite, une phrase musicale a un début, un développement et une fin.",
      "On pense en phrases, pas en gammes.",
    ] },
    { type: "idee", titre: "La règle du silence", texte: [
      "Une note seule, bien placée après un silence, porte plus qu'une cascade de doubles-croches.",
      "Le débutant remplit tout. Le silence est une note à part entière : c'est lui qui donne du sens à ce qui suit.",
    ] },
    { type: "question", quizId: "q-rhy-36" },
    { type: "idee", titre: "Question, puis réponse", texte: [
      "Une bonne phrase dure 2 à 4 mesures. La question finit sur une note instable, la 2e ou la 7e ; la réponse se pose sur une note stable.",
      "En La mineur, tes cibles de repos : La, Do et Mi, les notes de l'accord.",
    ], bloc: { type: "fretboard_interactive", mode: "highlight", notes: ["A", "C", "E"], caption: "Notes stables de Am — cibles de résolution idéales", displayMode: "notes", lang: "fr", compact: true } },
    { type: "question", quizId: "q-impro-23" },
    { type: "idee", titre: "Call & response", texte: [
      "Joue 2 mesures, puis tais-toi 2 mesures. Pendant le silence, écoute ce que tu viens de jouer et prépare ta réponse.",
      "Cette alternance est au cœur du blues, du jazz et du rock.",
    ] },
    { type: "a-toi", titre: "Une question, une réponse",
      consigne: "Au clic, joue la question et tiens le Sol : ça reste en suspens. Deux mesures de silence. Puis la réponse, qui se pose sur La. Ensuite, invente tes propres questions et réponses dans la pentatonique, pendant deux minutes.",
      bloc: {
        type: "tab",
        caption: "Question qui finit sur Sol (♭7), réponse qui se pose sur La (tonique) — La pentatonique mineure, position 1",
        text: "Tab — question : corde 3 cases 5 et 7, corde 2 cases 5 et 8 (Do, Ré, Mi, Sol), tenue. Silence. Réponse : corde 2 cases 8 et 5, corde 3 cases 7 et 5, corde 4 case 7 (Sol, Mi, Ré, Do, La).",
        data: { lines: [
          "e|-----------------------------------|",
          "B|-------5--8--------8--5------------|",
          "G|-5--7--------------------7--5------|",
          "D|-------------------------------7---|",
          "A|-----------------------------------|",
          "E|-----------------------------------|",
        ] },
      }, bpm: 70, minuteur: 120 },
    { type: "idee", titre: "Varie le rythme, pas les notes", texte: [
      "Le débutant change de notes en gardant le même rythme. Fais l'inverse : prends La, Do, Mi et joue-les en blanches, en croches, en syncopes, en triolets.",
      "Trois notes, dix phrases. Cinq notes de pentatonique suffisent pour des heures.",
    ], bloc: { type: "fretboard_interactive", mode: "scale", root: "A", scale: "pentatonic_minor", caption: "Pentatonique de La — 5 notes suffisent pour des heures d'impro", displayMode: "notes", lang: "fr", compact: true } },
    { type: "question", quizId: "q-impro-24" },
    { type: "recap", points: [
      "Le silence fait la phrase : joue, puis laisse respirer.",
      "Question sur une note instable, réponse sur une note stable (La, Do, Mi en Am).",
      "Varie le rythme sur peu de notes avant d'en ajouter.",
    ] },
  ],
  quiz: ["q-rhy-36","q-impro-23","q-impro-24","q-impro-01"],
};

export const quiz = [
  {id:"q-rhy-36",courseId:"rhythm",lessonId:"impro-01",lvl:2,q:"À quoi sert un silence après quelques notes de solo ?",o:["À masquer une hésitation sur la suite","À donner le temps d'entendre ce qui vient d'être joué","À marquer la fin d'un morceau lent","À rien : cela casse l'élan et fait retomber l'énergie"],a:1,exp:"Sans silence, les phrases se fondent en un flux continu que l'oreille ne peut plus découper. Le silence est ce qui transforme une suite de notes en phrase — c'est la ponctuation.",xp:30},
  {id:"q-impro-23",courseId:"impro",lessonId:"impro-01",lvl:2,q:"Une phrase de solo qui se termine sur la tonique donne une impression de…",o:["Question laissée ouverte","Tension portée à son maximum","Conclusion","Fausse note"],a:2,exp:"La tonique est le point d'arrivée de la tonalité : y finir ferme la phrase. Finir sur la seconde ou la septième laisse l'oreille en attente — c'est comme cela qu'on construit un dialogue question-réponse.",xp:30},
  {id:"q-impro-24",courseId:"impro",lessonId:"impro-01",lvl:2,q:"Tu viens de jouer une phrase de quatre notes. Quelle suite construit le mieux un solo ?",o:["Une phrase entièrement différente","Un trait rapide d'une dizaine de notes","La même phrase à l'identique, dix fois","La même phrase déplacée ou légèrement modifiée"],a:3,exp:"Répéter en transformant : l'oreille reconnaît le motif et suit son évolution. Tout changer à chaque phrase donne du décousu, ne rien changer donne de la monotonie. C'est la même logique que pour un riff.",xp:30},
];
