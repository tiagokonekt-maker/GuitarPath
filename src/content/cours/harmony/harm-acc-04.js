// Leçon du module « harmony » + les questions de quiz qui s'y rattachent.
// Format « leçon en cartes » décrit dans src/content/README.md.
// Le barré forme Mi, mobile : Fa (case 1), Sol (case 3), La (case 5).
// Suite du Fa complet (harm-acc-03) ; les noms viennent des notes de la
// corde 6 (neck-c2-01).

const FA = { type: "chord_diagram", caption: "Fa (F) barré, case 1 — 133211", data: { name: "F", frets: [1, 3, 3, 2, 1, 1], fingers: [1, 3, 4, 2, 1, 1], startFret: 1, barre: { fret: 1, from: 0, to: 5 } } };
const SOL = { type: "chord_diagram", caption: "Sol (G) barré, case 3 — 355433", data: { name: "G", frets: [3, 5, 5, 4, 3, 3], fingers: [1, 3, 4, 2, 1, 1], startFret: 3, barre: { fret: 3, from: 0, to: 5 } } };
const LA = { type: "chord_diagram", caption: "La (A) barré, case 5 — 577655", data: { name: "A", frets: [5, 7, 7, 6, 5, 5], fingers: [1, 3, 4, 2, 1, 1], startFret: 5, barre: { fret: 5, from: 0, to: 5 } } };

export default {
  id: "harm-acc-04", level: 4,
  title: "Le barré forme Mi : Fa, Sol et La",
  duration: 9,
  gropiTip: "Plaque le barré, puis relâche la pression jusqu'à ce que ça frise, et remonte juste ce qu'il faut : tu découvres la force minimale. Elle est bien plus faible que celle que tu mettais.",
  cartes: [
    { type: "idee", titre: "Une forme, douze accords", texte: [
      "Le barré forme Mi, c'est l'accord de Mi joué avec le majeur, l'annulaire et l'auriculaire, l'index faisant le sillet.",
      "Déplace la forme : la case de l'index sur la corde 6 donne le nom. Case 1 : Fa. Case 3 : Sol. Case 5 : La.",
    ], bloc: SOL },
    { type: "idee", titre: "La méthode en deux temps", texte: [
      "Plaque d'abord Mi avec le majeur, l'annulaire et l'auriculaire, en laissant l'index libre.",
      "Glisse la forme d'une case vers le corps de la guitare, puis couche l'index sur les six cordes, en case 1 : tu tiens Fa.",
    ], bloc: FA },
    { type: "question", quizId: "q-harm-barmi-new-01" },
    { type: "idee", titre: "Le bon appui", texte: [
      "L'index se pose tout près de la frette, légèrement roulé sur le côté. Le pouce, derrière le manche, à peu près face au majeur.",
      "Le bras tire un peu le manche vers toi : c'est son poids qui appuie, pas la pince entre pouce et index.",
    ] },
    { type: "idee", titre: "Les défauts courants", texte: [
      "Une corde étouffée, souvent la 3 ou la 2 ? Elle tombe dans un pli de l'index : décale-le un peu vers la tête ou vers le chevalet.",
      "Une corde qui frise : rapproche le doigt de la frette. Mal au pouce : tu serres trop, relâche.",
    ] },
    { type: "question", quizId: "q-harm-barmi-new-02" },
    { type: "idee", titre: "Commence plus haut", texte: [
      "Près du sillet, la corde est plus raide à enfoncer : le Fa en case 1 est le barré le plus dur.",
      "En case 5, le même geste demande moins de force. Commence par La, puis descends vers Sol et Fa au fil des jours.",
    ], bloc: LA },
    { type: "a-toi", titre: "Ta routine barré de 5 minutes",
      consigne: "1 min : index seul en barré case 5, joue les cordes une par une. 1 min : La barré, pose et relâche. 2 min : Sol (case 3) ↔ La (case 5), quatre coups chacun, au clic. 1 min : Fa (case 1).",
      bloc: LA, bpm: 60, minuteur: 300 },
    { type: "question", quizId: "q-harm-barmi-new-03" },
    { type: "recap", points: [
      "Forme Mi + index en sillet : la case de l'index sur la corde 6 donne le nom (Fa 1, Sol 3, La 5).",
      "Index près de la frette, roulé sur le côté ; c'est le poids du bras qui appuie.",
      "Corde étouffée : décale l'index. Commence en case 5, descends vers la case 1.",
    ] },
  ],
  quiz: ["q-harm-barmi-new-01", "q-harm-barmi-new-02", "q-harm-barmi-new-03"],
};

export const quiz = [
  {id:"q-harm-barmi-new-01",courseId:"harmony",lessonId:"harm-acc-04",lvl:2,q:"Barré forme Mi, index en case 3 : quel accord joues-tu ?",o:["Sol","La","Fa","Si"],a:0,exp:"La corde 6 en case 3 donne Sol : la forme de Mi barrée en case 3 est un Sol majeur (355433).",xp:30},
  {id:"q-harm-barmi-new-02",courseId:"harmony",lessonId:"harm-acc-04",lvl:2,q:"Dans ton barré, la corde 3 reste étouffée. Quel est le premier réflexe ?",o:["Décaler un peu l'index","Serrer plus fort avec le pouce","Monter le pouce sur la touche","Lever l'auriculaire"],a:0,exp:"La corde tombe sans doute dans un pli de l'index : un léger décalage vers la tête ou le chevalet la remet sous la partie dure du doigt.",xp:30},
  {id:"q-harm-barmi-new-03",courseId:"harmony",lessonId:"harm-acc-04",lvl:3,q:"Pourquoi le Fa barré en case 1 est-il le plus dur à faire sonner ?",o:["La corde est plus raide près du sillet","Les cordes y sont plus fines","Il compte plus de notes que les autres","L'index y barre moins de cordes"],a:0,exp:"Près du sillet, la longueur libre de corde entre le sillet et le doigt est courte : il faut plus de force pour l'enfoncer.",xp:35},
];
