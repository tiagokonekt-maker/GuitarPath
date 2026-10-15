// Leçon du module « debut » + les questions de quiz qui s'y rattachent.
// Format « leçon en cartes » décrit dans src/content/README.md.

const RE = { type: "chord_diagram", caption: "Ré majeur (D) — xx0232, cordes 4 à 1", data: { name: "D", frets: [-1, -1, 0, 2, 3, 2], fingers: [0, 0, 0, 1, 3, 2], startFret: 1 } };

export default {
  id: "debut-c2-03", level: 0, unite: 2,
  title: "Trois accords majeurs : Do, Sol et Ré",
  duration: 8,
  gropiTip: "Dans Ré, ton majeur (corde 1, case 2) joue Fa#, la note qui rend l'accord majeur. Recule-le en case 1 : il joue Fa, et tu obtiens Ré mineur (xx0231).",
  cartes: [
    { type: "idee", titre: "Trois accords lumineux", texte: [
      "Après deux accords mineurs, plutôt mélancoliques, voici trois accords majeurs, plus lumineux.",
      "Avec ces cinq accords, tu accompagnes énormément de chansons.",
    ] },
    { type: "idee", titre: "Do (C) : x32010", texte: [
      "Annulaire (3) sur la corde 5 en case 3, majeur (2) sur la corde 4 en case 2, index (1) sur la corde 2 en case 1. On ne joue pas la corde 6.",
      "Surveille la corde 3, à vide : un doigt trop à plat l'étouffe. Notes : Do, Mi, Sol.",
    ], bloc: { type: "chord_diagram", caption: "Do majeur (C) — x32010, cordes 5 à 1", data: { name: "C", frets: [-1, 3, 2, 0, 1, 0], fingers: [0, 3, 2, 0, 1, 0], startFret: 1 } } },
    { type: "question", quizId: "q-debut-30" },
    { type: "idee", titre: "Sol (G) : 320003", texte: [
      "Majeur (2) sur la corde 6 en case 3, index (1) sur la corde 5 en case 2, annulaire (3) sur la corde 1 en case 3. On gratte les six cordes. Notes : Sol, Si, Ré.",
      "Variante plus pleine, pour plus tard : 320033.",
    ], bloc: { type: "chord_diagram", caption: "Sol majeur (G) — 320003, les 6 cordes", data: { name: "G", frets: [3, 2, 0, 0, 0, 3], fingers: [2, 1, 0, 0, 0, 3], startFret: 1 } } },
    { type: "idee", titre: "Ré (D) : xx0232", texte: [
      "Index (1) sur la corde 3 en case 2, majeur (2) sur la corde 1 en case 2, annulaire (3) sur la corde 2 en case 3 : un petit triangle. On gratte depuis la corde 4 à vide.",
      "Notes : Ré, Fa#, La. Le plus délicat : arrondis bien les doigts.",
    ], bloc: RE },
    { type: "question", quizId: "q-debut-29" },
    { type: "idee", titre: "Pars de la bonne corde", texte: [
      "Do se joue sur 5 cordes, Ré sur 4, Sol sur 6. La corde de départ porte la note la plus grave, souvent celle qui nomme l'accord.",
      "Commence ton geste de main droite sur cette corde-là.",
    ] },
    { type: "a-toi", titre: "Do, Sol, Ré, corde par corde", consigne: "Pose chaque accord, joue ses cordes une par une depuis sa corde de départ, puis gratte-le quatre fois au clic. Ré bute ? C'est normal : vérifie que ton majeur ne touche pas la corde 2.", bloc: RE, bpm: 60 },
    { type: "question", quizId: "q-debut-32" },
    { type: "recap", points: [
      "Do = x32010, Sol = 320003, Ré = xx0232.",
      "Gratte depuis la corde de départ : la 5 pour Do, la 6 pour Sol, la 4 pour Ré.",
      "Doigts arrondis : la corde 3 de Do et la corde 1 de Ré doivent sonner.",
    ] },
  ],
  quiz: ["q-debut-29", "q-debut-30", "q-debut-31", "q-debut-32"],
};

export const quiz = [
  {id:"q-debut-29",courseId:"debut",lessonId:"debut-c2-03",lvl:1,q:"Combien de cordes gratte-t-on pour l'accord de Ré (xx0232) ?",o:["6","5","4","3"],a:2,exp:"Les deux x indiquent que les cordes 6 et 5 ne sont pas jouées : on gratte les cordes 4 à 1, en partant du Ré de la corde 4 à vide.",xp:25},
  {id:"q-debut-30",courseId:"debut",lessonId:"debut-c2-03",lvl:1,q:"Dans l'accord de Do (x32010), quelle corde reste à vide entre deux doigts posés ?",o:["La corde 3","La corde 5","La corde 6","La corde 4"],a:0,exp:"Corde 4 case 2, corde 3 à vide, corde 2 case 1 : la corde 3 doit sonner entre deux doigts, d'où l'importance de bien les arrondir.",xp:25},
  {id:"q-debut-31",courseId:"debut",lessonId:"debut-c2-03",lvl:2,q:"Quelles sont les notes de l'accord de Sol majeur ?",o:["Sol, Si, Ré","Sol, Si♭, Ré","Sol, Do, Mi","Sol, La, Si"],a:0,exp:"Sol majeur = Sol, Si, Ré. Sur la guitare (320003) : Sol, Si, Ré, Sol, Si, Sol, de la corde 6 à la corde 1.",xp:30},
  {id:"q-debut-32",courseId:"debut",lessonId:"debut-c2-03",lvl:2,q:"L'accord de Ré majeur contient Ré, La et…",o:["Fa","Fa#","Sol","Si"],a:1,exp:"Ré majeur = Ré, Fa#, La. C'est la corde 1 case 2 qui donne le Fa#. Avec un Fa naturel, ce serait Ré mineur.",xp:30},
];
