// Leçon du module « harmony » + les questions de quiz qui s'y rattachent.
// Format « leçon en cartes » décrit dans src/content/README.md.
// Les accords ouverts qui manquent après Premiers pas (Em, Am, C, G, D) :
// La, Mi et Ré mineur, et les trois changements qui les relient.

const LA = { type: "chord_diagram", caption: "La (A) — x02220 : trois doigts serrés en case 2", data: { name: "A", frets: [-1, 0, 2, 2, 2, 0], fingers: [0, 0, 1, 2, 3, 0], startFret: 1 } };
const MI = { type: "chord_diagram", caption: "Mi (E) — 022100 : les six cordes sonnent", data: { name: "E", frets: [0, 2, 2, 1, 0, 0], fingers: [0, 2, 3, 1, 0, 0], startFret: 1 } };
const REM = { type: "chord_diagram", caption: "Ré mineur (Dm) — xx0231 : quatre cordes, de la corde 4 à la corde 1", data: { name: "Dm", frets: [-1, -1, 0, 2, 3, 1], fingers: [0, 0, 0, 2, 3, 1], startFret: 1 } };
const LAM = { type: "chord_diagram", caption: "La mineur (Am) — x02210 : la forme de Mi, une corde plus loin", data: { name: "Am", frets: [-1, 0, 2, 2, 1, 0], fingers: [0, 0, 2, 3, 1, 0], startFret: 1 } };

export default {
  id: "harm-acc-01", level: 2,
  title: "Trois accords ouverts de plus : La, Mi et Ré mineur",
  duration: 8,
  gropiTip: "Pour La, essaie aussi l'index sur la corde 3, le majeur sur la corde 4 et l'annulaire sur la corde 2 : selon la taille de tes doigts, l'une des deux façons laissera mieux sonner la corde 1.",
  cartes: [
    { type: "idee", titre: "Ta boîte à accords s'agrandit", texte: [
      "Tu connais déjà Mi mineur, La mineur, Do, Sol et Ré. Avec La, Mi et Ré mineur, tu as les huit accords ouverts les plus joués.",
      "De quoi accompagner des centaines de chansons, sans un seul barré.",
    ] },
    { type: "idee", titre: "La (A)", texte: [
      "Index, majeur et annulaire en case 2, sur les cordes 4, 3 et 2. La corde 6 ne joue pas : gratte à partir de la corde 5, à vide.",
      "Les trois doigts sont serrés : arrondis-les pour que la corde 1, à vide, sonne aussi.",
    ], bloc: LA },
    { type: "question", quizId: "q-harm-acc-new-01" },
    { type: "idee", titre: "Mi (E)", texte: [
      "Mi mineur plus un doigt : majeur et annulaire en case 2 sur les cordes 5 et 4, et l'index sur la corde 3, case 1.",
      "Ce Sol# (corde 3, case 1) change tout : la couleur passe de sombre à lumineuse. Les six cordes sonnent.",
    ], bloc: MI },
    { type: "idee", titre: "Ré mineur (Dm)", texte: [
      "Quatre cordes, de la corde 4 à vide à la corde 1. Majeur sur la corde 3 case 2, annulaire sur la corde 2 case 3, index sur la corde 1 case 1.",
      "Compare avec Ré : seule la note de la corde 1 change. Fa# devient Fa (corde 1, case 1), et l'accord devient mineur.",
    ], bloc: REM },
    { type: "question", quizId: "q-harm-acc-new-02" },
    { type: "idee", titre: "Trois changements à travailler", texte: [
      "La ↔ Ré : la main reste autour de la case 2, les doigts bougent d'un bloc.",
      "Mi ↔ La mineur : c'est la même forme ! Les trois doigts se décalent ensemble d'une corde vers l'aigu.",
      "Ré mineur ↔ La mineur : l'index reste en case 1 et passe de la corde 1 à la corde 2.",
    ], bloc: LAM },
    { type: "question", quizId: "q-harm-acc-new-03" },
    { type: "a-toi", titre: "Trois paires, une minute chacune",
      consigne: "Une minute par paire : La ↔ Ré, puis Mi ↔ La mineur, puis Ré mineur ↔ La mineur. Quatre coups vers le bas par accord, au clic. Si une paire accroche, offre-lui une minute de plus.",
      bloc: REM, bpm: 60, minuteur: 180 },
    { type: "recap", points: [
      "La (x02220) : trois doigts serrés en case 2, on gratte depuis la corde 5.",
      "Mi (022100) : Mi mineur plus l'index sur la corde 3, case 1.",
      "Ré mineur (xx0231) : seule la corde 1 diffère de Ré ; Mi et La mineur ont la même forme.",
    ] },
  ],
  quiz: ["q-harm-acc-new-01", "q-harm-acc-new-02", "q-harm-acc-new-03"],
};

export const quiz = [
  {id:"q-harm-acc-new-01",courseId:"harmony",lessonId:"harm-acc-01",lvl:1,q:"Sur l'accord de La (x02220), à partir de quelle corde grattes-tu ?",o:["Corde 5","Corde 6","Corde 4","Corde 3"],a:0,exp:"Le « x » de la corde 6 indique qu'elle ne joue pas : on gratte de la corde 5 (La à vide) à la corde 1.",xp:25},
  {id:"q-harm-acc-new-02",courseId:"harmony",lessonId:"harm-acc-01",lvl:1,q:"Entre Ré (xx0232) et Ré mineur (xx0231), quelle note change ?",o:["Fa# devient Fa","La devient Sol","Ré devient Do","Mi devient Ré"],a:0,exp:"Sur la corde 1, la case 2 (Fa#) passe à la case 1 (Fa) : la tierce majeure devient mineure, le reste ne bouge pas.",xp:25},
  {id:"q-harm-acc-new-03",courseId:"harmony",lessonId:"harm-acc-01",lvl:2,q:"De Mi à La mineur, comment bouge la main gauche ?",o:["Toute la forme se décale d'une corde","Seul l'index change de case","Les trois doigts montent d'une case","Seul le majeur change de corde"],a:0,exp:"Mi (022100) et La mineur (x02210) ont la même forme : les trois doigts se décalent ensemble d'une corde vers l'aigu.",xp:30},
];
