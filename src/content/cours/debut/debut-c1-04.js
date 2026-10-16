// Leçon du module « debut » + les questions de quiz qui s'y rattachent.
// Format « leçon en cartes » décrit dans src/content/README.md.

export default {
  id: "debut-c1-04", level: 0, unite: 1,
  title: "S'échauffer et jouer détendu",
  duration: 6,
  gropiTip: "Variante : fais l'exercice à l'envers, cases 4-3-2-1, en remontant de la corde 1 à la corde 6. Garde l'auriculaire tout près des cordes au lieu de le laisser s'envoler.",
  cartes: [
    { type: "idee", titre: "Deux minutes qui changent tout", texte: [
      "La guitare sollicite de petits muscles et des tendons, avec des gestes répétés. Deux minutes d'échauffement et un peu d'attention à la détente : tu joues plus longtemps, plus proprement, sans douleur.",
    ] },
    { type: "a-toi", titre: "Une minute sans guitare", consigne: "Ouvre grand les mains puis ferme les poings, dix fois, lentement. Fais tourner les poignets dans les deux sens. Laisse tomber les épaules et roule-les vers l'arrière trois ou quatre fois. Rien de sportif : on réveille la circulation.", minuteur: 60 },
    { type: "idee", titre: "L'exercice 1-2-3-4", texte: [
      "Corde 6 : index en case 1, majeur en case 2, annulaire en case 3, auriculaire en case 4. Un doigt par case, juste derrière la frette, une note nette à chaque fois.",
      "Puis la corde 5, et ainsi de suite jusqu'à la corde 1.",
    ], bloc: {
      type: "fretboard",
      caption: "L'exercice 1-2-3-4 : un doigt par case, ici sur la corde 6 (chiffres = doigts)",
      data: {
        frets: 5, startFret: 0, showStringNames: true, showFretNumbers: true,
        notes: [
          { string: 6, fret: 1, label: "1", color: "primary" },
          { string: 6, fret: 2, label: "2", color: "green" },
          { string: 6, fret: 3, label: "3", color: "amber" },
          { string: 6, fret: 4, label: "4", color: "coral" },
        ],
      },
    } },
    { type: "question", quizId: "q-debut-11" },
    { type: "a-toi", titre: "1-2-3-4 au clic", consigne: "Une note par clic, de la corde 6 à la corde 1, l'auriculaire près des cordes. Lent et net plutôt que rapide et brouillon. Fais-en ton rituel de début de séance : il muscle aussi le petit doigt.", bpm: 60 },
    { type: "idee", titre: "Repère la crispation", texte: [
      "La tension s'installe sans prévenir. Toutes les quelques minutes, fais le tour : épaules remontées ? Mâchoire serrée ? Respiration bloquée ? Pouce qui écrase le manche ?",
      "Chaque tension repérée, relâche-la avant de continuer.",
    ] },
    { type: "question", quizId: "q-debut-13" },
    { type: "idee", titre: "Court, mais souvent", texte: [
      "Au début, 15 à 20 minutes par jour te font progresser plus vite qu'une heure et demie le dimanche. Et tes doigts ont le temps de s'endurcir sans souffrir.",
    ] },
    { type: "recap", points: [
      "Une minute d'échauffement sans guitare avant de jouer.",
      "1-2-3-4 : un doigt par case, sur chaque corde, lentement.",
      "Traque la crispation (épaules, mâchoire, souffle, pouce) et joue un peu chaque jour.",
    ] },
  ],
  quiz: ["q-debut-11", "q-debut-12", "q-debut-13"],
};

export const quiz = [
  {id:"q-debut-11",courseId:"debut",lessonId:"debut-c1-04",lvl:1,q:"Dans l'exercice 1-2-3-4, quel doigt joue la case 4 ?",o:["L'index","L'annulaire","L'auriculaire","Le pouce"],a:2,exp:"Un doigt par case : index en case 1, majeur en 2, annulaire en 3, auriculaire en 4. C'est justement ce qui fait travailler le petit doigt.",xp:25},
  {id:"q-debut-12",courseId:"debut",lessonId:"debut-c1-04",lvl:1,q:"Pour progresser au début, qu'est-ce qui marche le mieux ?",o:["Une longue séance par semaine","15 à 20 minutes presque tous les jours","Jouer seulement quand on a de l'inspiration","Jouer jusqu'à avoir mal aux doigts"],a:1,exp:"La régularité bat la durée : de courtes séances fréquentes ancrent mieux les gestes et laissent à la peau des doigts le temps de s'endurcir.",xp:25},
  {id:"q-debut-13",courseId:"debut",lessonId:"debut-c1-04",lvl:2,q:"Lequel de ces signes trahit une crispation pendant que tu joues ?",o:["Les épaules qui remontent","Le bout des doigts qui chauffe","Une note qui sonne bien nette","Le pied qui bat la mesure"],a:0,exp:"Épaules remontées, mâchoire serrée, respiration bloquée, pouce qui écrase le manche : autant de tensions à relâcher. Le bout des doigts qui chauffe, lui, est normal au début.",xp:30},
];
