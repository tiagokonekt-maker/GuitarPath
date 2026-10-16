// Leçon du module « rhythm » + les questions de quiz qui s'y rattachent.
// Format « leçon en cartes » décrit dans src/content/README.md.
// Méthode de travail : une routine de 15 minutes et la façon de travailler
// un morceau dans Outils › Morceaux (lent, boucle A–B, puis tempo).
// Placée au palier 2, après le métronome (rhy-c1-03).

const LAM = { type: "chord_diagram", caption: "La mineur (Am) — x02210", data: { name: "Am", frets: [-1, 0, 2, 2, 1, 0], fingers: [0, 0, 2, 3, 1, 0], startFret: 1 } };

export default {
  id: "rhy-routine-01", level: 2,
  title: "Ta routine de 15 minutes et comment travailler un morceau",
  duration: 7,
  gropiTip: "Laisse ta guitare sortie, sur un stand, plutôt que dans sa housse : moins il y a d'obstacles entre toi et elle, plus tes 15 minutes deviennent une habitude.",
  cartes: [
    { type: "idee", titre: "Un peu chaque jour", texte: [
      "Tes doigts et ton oreille progressent aussi pendant le repos qui suit la pratique. Quinze minutes chaque jour valent mieux qu'une longue séance par semaine.",
      "Le plus dur n'est pas de jouer longtemps : c'est de prendre la guitare.",
    ] },
    { type: "idee", titre: "La routine en quatre temps", texte: [
      "3 min : échauffement, doigts et poignets. 4 min : changements d'accords à la minute. 5 min : ta leçon ou ton morceau du moment. 3 min : joue pour le plaisir, sans t'arrêter.",
    ] },
    { type: "question", quizId: "q-rhy-routine-new-01" },
    { type: "a-toi", titre: "La minute de changements",
      consigne: "Choisis deux accords qui te résistent, par exemple Do et La mineur. Une minute de changements au clic, un coup par accord, et note ton score : c'est le deuxième temps de ta routine, à refaire chaque jour.",
      bloc: LAM, bpm: 60, minuteur: 60 },
    { type: "idee", titre: "Un morceau : lent d'abord", texte: [
      "Dans Outils › Morceaux, baisse la vitesse jusqu'à jouer sans une seule erreur, même à 50 %.",
      "Lent et juste, c'est le chemin le plus court vers rapide et juste.",
    ] },
    { type: "idee", titre: "La boucle A–B", texte: [
      "Repère le passage qui coince : deux à quatre mesures, pas plus. Choisis-le en A–B et active « En boucle » : rejoue-le jusqu'à ce qu'il roule.",
      "Puis recolle-le au reste du morceau.",
    ] },
    { type: "question", quizId: "q-rhy-routine-new-02" },
    { type: "idee", titre: "Puis remonte le tempo", texte: [
      "Trois passages propres d'affilée ? Monte la vitesse de 5 à 10 %. Une erreur ? Redescends d'un cran.",
      "Au fil des jours, tu atteins 100 % presque sans t'en rendre compte.",
    ] },
    { type: "question", quizId: "q-rhy-routine-new-03" },
    { type: "recap", points: [
      "15 minutes par jour : échauffement, changements, leçon ou morceau, jeu libre.",
      "Un morceau se travaille lent et juste, le passage difficile en boucle A–B.",
      "Trois fois propre : +5 à 10 % de vitesse ; une erreur : on redescend.",
    ] },
  ],
  quiz: ["q-rhy-routine-new-01", "q-rhy-routine-new-02", "q-rhy-routine-new-03"],
};

export const quiz = [
  {id:"q-rhy-routine-new-01",courseId:"rhythm",lessonId:"rhy-routine-01",lvl:1,q:"Quelle façon de pratiquer fait le plus progresser ?",o:["15 minutes chaque jour","Une heure le dimanche","Deux heures une fois par mois","Seulement quand l'envie vient"],a:0,exp:"Des séances courtes et régulières : la main et l'oreille consolident entre deux séances, et l'habitude s'installe.",xp:25},
  {id:"q-rhy-routine-new-02",courseId:"rhythm",lessonId:"rhy-routine-01",lvl:1,q:"Deux mesures d'un morceau te font trébucher à chaque fois. Que fais-tu ?",o:["Tu les boucles en A–B, plus lentement","Tu rejoues tout le morceau du début","Tu les joues plus vite pour les passer","Tu les sautes et tu continues"],a:0,exp:"On isole le passage difficile, on le ralentit et on le boucle jusqu'à ce qu'il roule, puis on le recolle au reste.",xp:25},
  {id:"q-rhy-routine-new-03",courseId:"rhythm",lessonId:"rhy-routine-01",lvl:2,q:"Tu joues ton passage trois fois sans faute à 70 % de la vitesse. Étape suivante ?",o:["Passer à 75 ou 80 %","Passer directement à 100 %","Rester à 70 % une semaine","Revenir à 50 %"],a:0,exp:"On monte par petits paliers de 5 à 10 % : assez pour progresser, pas assez pour perdre la propreté.",xp:30},
];
