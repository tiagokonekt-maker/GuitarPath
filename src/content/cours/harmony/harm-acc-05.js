// Leçon du module « harmony » + les questions de quiz qui s'y rattachent.
// Format « leçon en cartes » décrit dans src/content/README.md.
// Le barré forme La, fondamentale sur la corde 5 : Si mineur (case 2),
// Do (case 3), Ré (case 5). Suite du barré forme Mi (harm-acc-04).

const SIM = { type: "chord_diagram", caption: "Si mineur (Bm) — x24432 : La mineur décalé, index en barré case 2", data: { name: "Bm", frets: [-1, 2, 4, 4, 3, 2], fingers: [0, 1, 3, 4, 2, 1], startFret: 2, barre: { fret: 2, from: 1, to: 5 } } };
const DO = { type: "chord_diagram", caption: "Do (C) barré, case 3 — x35553", data: { name: "C", frets: [-1, 3, 5, 5, 5, 3], fingers: [0, 1, 2, 3, 4, 1], startFret: 3, barre: { fret: 3, from: 1, to: 5 } } };
const RE = { type: "chord_diagram", caption: "Ré (D) barré, case 5 — x57775", data: { name: "D", frets: [-1, 5, 7, 7, 7, 5], fingers: [0, 1, 2, 3, 4, 1], startFret: 5, barre: { fret: 5, from: 1, to: 5 } } };

export default {
  id: "harm-acc-05", level: 4,
  title: "Le barré forme La : Si mineur, Do et Ré",
  duration: 9,
  gropiTip: "Ré ouvert puis Si mineur, c'est un enchaînement qu'on croise partout en folk. Garde l'index prêt au-dessus de la case 2 pendant le Ré : il n'aura plus qu'à se coucher.",
  cartes: [
    { type: "idee", titre: "Fondamentale sur la corde 5", texte: [
      "Le barré forme La reprend les accords de La et La mineur ouverts, l'index faisant le sillet. La corde 6 ne joue pas.",
      "C'est la note de l'index sur la corde 5 qui donne le nom : Si (corde 5, case 2), Do (corde 5, case 3), Ré (corde 5, case 5).",
    ] },
    { type: "idee", titre: "Si mineur (Bm), case 2", texte: [
      "La mineur décalé de deux cases : index en barré sur les cordes 5 à 1, case 2. Majeur sur la corde 2 case 3, annulaire sur la corde 4 et auriculaire sur la corde 3, case 4.",
      "Bm est le barré qu'on rencontre le plus vite dans les chansons en Ré et en Sol.",
    ], bloc: SIM },
    { type: "question", quizId: "q-harm-barla-new-01" },
    { type: "idee", titre: "Do et Ré : la forme majeure", texte: [
      "Pour le majeur, trois doigts s'alignent sur les cordes 4, 3 et 2, deux cases après l'index. Case 3 : Do. Case 5 : Ré.",
      "C'est serré : beaucoup de guitaristes barrent ces trois cordes avec l'annulaire seul et laissent la corde 1 se taire.",
    ], bloc: DO },
    { type: "idee", titre: "Les pièges de la forme La", texte: [
      "La corde 6 ne doit pas sonner : effleure-la du bout de l'index pour l'étouffer.",
      "La corde 1 étouffée par les autres doigts ? Cambre-les bien, ou laisse-la de côté au début : l'accord reste juste.",
    ] },
    { type: "question", quizId: "q-harm-barla-new-02" },
    { type: "a-toi", titre: "Ré ↔ Si mineur, puis Do ↔ Ré",
      consigne: "Ré ouvert, quatre coups, puis Bm, quatre coups. Ensuite Do barré (case 3) ↔ Ré barré (case 5) : la même forme glisse de deux cases, sans relâcher la main. Trois minutes au clic.",
      bloc: RE, bpm: 60, minuteur: 180 },
    { type: "idee", titre: "Forme Mi ou forme La ?", texte: [
      "Un même accord a deux places : Do en forme La (case 3) ou en forme Mi (case 8).",
      "Choisis celle qui demande le moins de chemin depuis l'accord d'avant : souvent, la main ne bouge presque plus.",
    ] },
    { type: "question", quizId: "q-harm-barla-new-03" },
    { type: "recap", points: [
      "Forme La : l'index barre en partant de la corde 5, dont la note donne le nom.",
      "Bm en case 2 (x24432) ; Do en case 3 et Ré en case 5 avec la forme majeure.",
      "La corde 6 se tait ; entre forme Mi et forme La, prends la plus proche.",
    ] },
  ],
  quiz: ["q-harm-barla-new-01", "q-harm-barla-new-02", "q-harm-barla-new-03"],
};

export const quiz = [
  {id:"q-harm-barla-new-01",courseId:"harmony",lessonId:"harm-acc-05",lvl:2,q:"Barré forme La mineur, index sur la corde 5 en case 2 : quel accord ?",o:["Si mineur","Do mineur","Ré mineur","Mi mineur"],a:0,exp:"La corde 5 en case 2 donne Si : la forme de La mineur barrée en case 2 est Si mineur (x24432).",xp:30},
  {id:"q-harm-barla-new-02",courseId:"harmony",lessonId:"harm-acc-05",lvl:2,q:"Dans un barré forme La, quelle corde ne doit pas sonner ?",o:["La corde 6","La corde 5","La corde 3","La corde 1"],a:0,exp:"La fondamentale est sur la corde 5 : la corde 6 n'appartient pas à la forme, on l'étouffe du bout de l'index.",xp:30},
  {id:"q-harm-barla-new-03",courseId:"harmony",lessonId:"harm-acc-05",lvl:3,q:"Forme La majeure, index en case 5 : quel accord joues-tu ?",o:["Ré","Mi","Do","La"],a:0,exp:"La corde 5 en case 5 donne Ré : x57775 est un Ré majeur.",xp:35},
];
