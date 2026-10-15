// Leçon du module « debut » + les questions de quiz qui s'y rattachent.
// Format décrit dans src/content/README.md.

export default {
  id: "debut-c1-04", level: 0, unite: 1,
  title: "S'échauffer et jouer détendu",
  duration: 6,
  gropiTip: "Variante : fais l'exercice à l'envers, cases 4-3-2-1, en remontant de la corde 1 à la corde 6. Garde l'auriculaire tout près des cordes au lieu de le laisser s'envoler.",
  content: [
    { type: "p", text: "La guitare est une activité physique, à petite échelle : des petits muscles, des tendons, des gestes répétés. Deux minutes d'échauffement et un peu d'attention à la détente, et tu joues plus longtemps, plus proprement, sans douleur. C'est une habitude à prendre dès le premier jour." },
    { type: "h", text: "Avant de jouer : 1 minute sans guitare" },
    { type: "p", text: "Ouvre grand les mains puis ferme les poings, dix fois, lentement. Fais tourner doucement les poignets dans un sens puis dans l'autre. Laisse tomber les épaules et roule-les vers l'arrière trois ou quatre fois. Rien de sportif : le but est de réveiller la circulation, pas de t'étirer au maximum." },
    { type: "h", text: "L'exercice 1-2-3-4" },
    { type: "p", text: "Sur la corde 6 (Mi grave), pose l'index en case 1 et joue la note. Puis le majeur en case 2, l'annulaire en case 3, l'auriculaire en case 4 : un doigt par case, toujours juste derrière la frette. Passe ensuite à la corde 5 et recommence, jusqu'à la corde 1. Lentement, avec une note bien nette à chaque fois." },
    {
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
    },
    { type: "p", text: "Cet exercice fait tout en même temps : il réveille les doigts, apprend à chaque doigt sa case, muscle l'auriculaire (le plus paresseux de la bande) et synchronise les deux mains. Garde-le comme rituel de début de séance." },
    { type: "h", text: "Repérer la crispation" },
    { type: "p", text: "La tension s'installe sans prévenir. Toutes les quelques minutes, fais un rapide tour du propriétaire : les épaules sont-elles remontées ? La mâchoire serrée ? Retiens-tu ta respiration sur les passages difficiles ? Le pouce gauche écrase-t-il le manche ? Chaque fois que tu repères une tension, relâche-la avant de continuer." },
    { type: "tip", text: "Plusieurs petites séances valent mieux qu'une longue. Au début, 15 à 20 minutes par jour te feront progresser plus vite qu'une heure et demie le dimanche, et tes doigts auront le temps de s'endurcir sans souffrir." },
  ],
  quiz: ["q-debut-11", "q-debut-12", "q-debut-13"],
};

export const quiz = [
  {id:"q-debut-11",courseId:"debut",lessonId:"debut-c1-04",lvl:1,q:"Dans l'exercice 1-2-3-4, quel doigt joue la case 4 ?",o:["L'index","L'annulaire","L'auriculaire","Le pouce"],a:2,exp:"Un doigt par case : index en case 1, majeur en 2, annulaire en 3, auriculaire en 4. C'est justement ce qui fait travailler le petit doigt.",xp:25},
  {id:"q-debut-12",courseId:"debut",lessonId:"debut-c1-04",lvl:1,q:"Pour progresser au début, qu'est-ce qui marche le mieux ?",o:["Une longue séance par semaine","15 à 20 minutes presque tous les jours","Jouer seulement quand on a de l'inspiration","Jouer jusqu'à avoir mal aux doigts"],a:1,exp:"La régularité bat la durée : de courtes séances fréquentes ancrent mieux les gestes et laissent à la peau des doigts le temps de s'endurcir.",xp:25},
  {id:"q-debut-13",courseId:"debut",lessonId:"debut-c1-04",lvl:2,q:"Lequel de ces signes trahit une crispation pendant que tu joues ?",o:["Les épaules qui remontent vers les oreilles","Le bout des doigts qui chauffe","Une note qui sonne bien nette","Le pied qui bat la mesure"],a:0,exp:"Épaules remontées, mâchoire serrée, respiration bloquée, pouce qui écrase le manche : autant de tensions à relâcher. Le bout des doigts qui chauffe, lui, est normal au début.",xp:30},
];
