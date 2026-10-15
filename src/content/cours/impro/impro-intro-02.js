// Leçon du module « impro » + les questions de quiz qui s'y rattachent.
// Format décrit dans src/content/README.md.

export default {
  id: "impro-intro-02", level: 6,
  title: "Question et réponse : ta première vraie phrase",
  duration: 9,
  content: [
    { type: "p", text: "Tu sais maintenant placer 3 notes rythmiquement. L'étape suivante, c'est le phrasé : traiter ton improvisation comme une conversation — une courte 'question' musicale, suivie d'une 'réponse' qui lui répond." },
    { type: "h", text: "Le principe du 'question-réponse'" },
    { type: "p", text: "C'est l'une des structures les plus anciennes de la musique — présente dans le blues, le gospel et les chants de travail, bien avant d'être théorisée par le jazz. Une phrase est jouée (la question), suivie d'une phrase qui la complète ou la résout (la réponse)." },
    { type: "h", text: "Comment construire ta première question-réponse" },
    { type: "p", text: "Avec tes 3 notes de la leçon précédente : joue une courte idée rythmique (la question), laisse un SILENCE, puis réponds avec une idée légèrement différente, en utilisant les mêmes notes." },
    { type: "h", text: "Le silence est une note" },
    { type: "p", text: "Un débutant a souvent peur du silence et remplit chaque interstice de notes. Pourtant, l'espace est ce qui rend une phrase lisible — exactement comme la ponctuation dans une phrase parlée. Une question a besoin d'un temps de pause avant sa réponse." },
    { type: "ref", text: "Le blues du delta du Mississippi repose largement sur ce principe : la voix chante une ligne, la guitare 'répond' immédiatement après, comme un second personnage dans le dialogue. B.B. King appelait sa guitare Lucille — elle 'parlait' littéralement en écho à sa voix." },
    { type: "tip", text: "Drill (2 min) : joue une phrase de 2 secondes (question) avec tes 3 notes, reste silencieux 1 seconde, puis joue une phrase différente de 2 secondes (réponse) avec les mêmes notes. Répète 5 fois, en changeant le rythme à chaque fois." },
  ],
  quiz: ["q-rhy-11","q-impro-34","q-impro-35"],
};

export const quiz = [
  {id:"q-rhy-11",courseId:"rhythm",lessonId:"impro-intro-02",lvl:2,q:"Dans une phrase musicale type 'question-réponse', la phrase 'question' finit typiquement sur…",o:["La tonique, pour bien conclure", "Une note stable et reposante", "Un silence de toute une mesure", "Une note instable (suspendue)"],a:3,exp:"Question = tension = fin sur note instable (3, 6, 7). Réponse = résolution = fin sur tonique ou note stable. Structure universelle.",xp:40},
  {id:"q-impro-34",courseId:"impro",lessonId:"impro-intro-02",lvl:1,q:"Le principe « question-réponse » en improvisation vient d'abord de quelle tradition ?",o:["Le jazz be-bop des années 1940", "Le blues et les chants de travail", "La musique classique baroque", "Le rock progressif des années 1970"],a:1,exp:"Le call-and-response est une structure ancestrale, présente dans le blues, le gospel et les chants de travail bien avant sa formalisation dans le jazz.",xp:25},
  {id:"q-impro-35",courseId:"impro",lessonId:"impro-intro-02",lvl:2,q:"Dans une phrase de question-réponse, le silence entre les deux sert à…",o:["Rien, c'est un vide à éviter", "Économiser de l'énergie entre deux phrases", "Ponctuer, comme dans une phrase parlée", "Attendre que le rythme reparte"],a:2,exp:"Le silence fonctionne comme la ponctuation d'une phrase parlée — sans lui, la question et la réponse se mélangent en un flux confus.",xp:30},
];
