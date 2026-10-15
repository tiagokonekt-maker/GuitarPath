// Leçon du module « debut » + les questions de quiz qui s'y rattachent.
// Format décrit dans src/content/README.md.

export default {
  id: "debut-c2-03", level: 0, unite: 2,
  title: "Trois accords majeurs : Do, Sol et Ré",
  duration: 8,
  content: [
    { type: "p", text: "Avec Mi mineur et La mineur, tu as deux accords mineurs, à la couleur plutôt douce ou mélancolique. Voici trois accords majeurs, plus lumineux. Avec ces cinq accords, tu peux accompagner un nombre énorme de chansons." },
    { type: "h", text: "Do (C)" },
    { type: "chord_diagram", caption: "Do majeur (C) — x32010, cordes 5 à 1", data: { name: "C", frets: [-1, 3, 2, 0, 1, 0], fingers: [0, 3, 2, 0, 1, 0], startFret: 1 } },
    { type: "p", text: "Annulaire (3) sur la corde 5, case 3. Majeur (2) sur la corde 4, case 2. Index (1) sur la corde 2, case 1. La corde 3 reste à vide : c'est souvent elle qui est étouffée par un doigt trop à plat, surveille-la. On ne joue pas la corde 6. Notes de l'accord : Do, Mi, Sol." },
    { type: "h", text: "Sol (G)" },
    { type: "chord_diagram", caption: "Sol majeur (G) — 320003, les 6 cordes", data: { name: "G", frets: [3, 2, 0, 0, 0, 3], fingers: [2, 1, 0, 0, 0, 3], startFret: 1 } },
    { type: "p", text: "Majeur (2) sur la corde 6, case 3. Index (1) sur la corde 5, case 2. Annulaire (3) sur la corde 1, case 3. Les cordes 4, 3 et 2 sont à vide. On gratte les six cordes. Notes de l'accord : Sol, Si, Ré." },
    { type: "p", text: "Il existe une variante très courante : 320033, avec l'annulaire sur la corde 2 case 3 et l'auriculaire sur la corde 1 case 3. Un peu plus difficile au début, elle sonne plus pleine et facilite le passage vers Ré. Commence par la version à trois doigts, tu essaieras l'autre plus tard." },
    { type: "h", text: "Ré (D)" },
    { type: "chord_diagram", caption: "Ré majeur (D) — xx0232, cordes 4 à 1", data: { name: "D", frets: [-1, -1, 0, 2, 3, 2], fingers: [0, 0, 0, 1, 3, 2], startFret: 1 } },
    { type: "p", text: "Index (1) sur la corde 3, case 2. Majeur (2) sur la corde 1, case 2. Annulaire (3) sur la corde 2, case 3. Les trois doigts dessinent un petit triangle. On gratte seulement les quatre cordes aiguës, à partir de la corde 4 à vide. Notes de l'accord : Ré, Fa#, La." },
    { type: "h", text: "Ne gratter que les bonnes cordes" },
    { type: "p", text: "Do se joue sur 5 cordes, Ré sur 4, Sol sur 6. Repère la corde de départ de chaque accord : c'est sa note la plus grave, et le plus souvent la note qui donne son nom à l'accord (le Do de la corde 5 case 3, le Ré de la corde 4 à vide, le Sol de la corde 6 case 3). Commence ton geste de main droite sur cette corde-là." },
    { type: "tip", text: "Ré est souvent le plus délicat : le majeur sur la corde 1 a tendance à toucher la corde 2, et l'annulaire à étouffer la corde 1. Arrondis bien les doigts et vérifie chaque corde une par une. Ça viendra en quelques jours, c'est normal de buter dessus au début." },
  ],
  quiz: ["q-debut-29", "q-debut-30", "q-debut-31", "q-debut-32"],
};

export const quiz = [
  {id:"q-debut-29",courseId:"debut",lessonId:"debut-c2-03",lvl:1,q:"Combien de cordes gratte-t-on pour l'accord de Ré (xx0232) ?",o:["6","5","4","3"],a:2,exp:"Les deux x indiquent que les cordes 6 et 5 ne sont pas jouées : on gratte les cordes 4 à 1, en partant du Ré de la corde 4 à vide.",xp:25},
  {id:"q-debut-30",courseId:"debut",lessonId:"debut-c2-03",lvl:1,q:"Dans l'accord de Do (x32010), quelle corde reste à vide entre deux doigts posés ?",o:["La corde 3","La corde 5","La corde 6","La corde 4"],a:0,exp:"Corde 4 case 2, corde 3 à vide, corde 2 case 1 : la corde 3 doit sonner entre deux doigts, d'où l'importance de bien les arrondir.",xp:25},
  {id:"q-debut-31",courseId:"debut",lessonId:"debut-c2-03",lvl:2,q:"Quelles sont les notes de l'accord de Sol majeur ?",o:["Sol, Si, Ré","Sol, Si♭, Ré","Sol, Do, Mi","Sol, La, Si"],a:0,exp:"Sol majeur = Sol, Si, Ré. Sur la guitare (320003) : Sol, Si, Ré, Sol, Si, Sol, de la corde 6 à la corde 1.",xp:30},
  {id:"q-debut-32",courseId:"debut",lessonId:"debut-c2-03",lvl:2,q:"L'accord de Ré majeur contient Ré, La et…",o:["Fa","Fa#","Sol","Si"],a:1,exp:"Ré majeur = Ré, Fa#, La. C'est la corde 1 case 2 qui donne le Fa#. Avec un Fa naturel, ce serait Ré mineur.",xp:30},
];
