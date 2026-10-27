// Leçon du module « neck » + les questions de quiz qui s'y rattachent.
// Format « leçon en cartes » décrit dans src/content/README.md.
// CAGED appliqué à un seul accord : Do sous ses cinq formes, du sillet à la
// case 13. Placée au palier 7 : elle ne demande que les accords ouverts et
// les barrés formes Mi et La (harm-acc-04/05, palier 4).

const FORME_C = { type: "chord_diagram", caption: "Forme C : le Do ouvert (x32010), fondamentale Do (corde 5 case 3)", data: { name: "C", frets: [-1, 3, 2, 0, 1, 0], fingers: [0, 3, 2, 0, 1, 0], startFret: 1 } };
const FORME_A = { type: "chord_diagram", caption: "Forme A : barré case 3 (x35553), fondamentale Do (corde 5 case 3)", data: { name: "C", frets: [-1, 3, 5, 5, 5, 3], fingers: [0, 1, 2, 3, 4, 1], startFret: 3, barre: { fret: 3, from: 1, to: 5 } } };
const FORME_G = { type: "chord_diagram", caption: "Forme G : 875558, fondamentales Do (corde 6 case 8) et Do (corde 3 case 5)", data: { name: "C", frets: [8, 7, 5, 5, 5, 8], fingers: [3, 2, 1, 1, 1, 4], startFret: 5, barre: { fret: 5, from: 2, to: 4 } } };
const FORME_E = {
  type: "caged_form",
  caption: "Forme E : barré case 8 (8-10-10-9-8-8), fondamentale Do (corde 6 case 8)",
  data: {
    form: "E", root: "Do", rootFret: 8,
    startFret: 7, frets: 5,
    notes: [
      { string: 6, fret: 8,  label: "Do",  color: "amber",   root: true },
      { string: 5, fret: 10, label: "Sol", color: "primary" },
      { string: 4, fret: 10, label: "Do",  color: "amber",   root: true },
      { string: 3, fret: 9,  label: "Mi",  color: "primary" },
      { string: 2, fret: 8,  label: "Sol", color: "primary" },
      { string: 1, fret: 8,  label: "Do",  color: "amber",   root: true },
    ],
  },
};
const FORME_D = { type: "chord_diagram", caption: "Forme D : x-x-10-12-13-12, fondamentale Do (corde 4 case 10)", data: { name: "C", frets: [-1, -1, 10, 12, 13, 12], fingers: [0, 0, 1, 2, 4, 3], startFret: 10 } };

export default {
  id: "neck-04", level: 7,
  title: "Le système CAGED : un accord, cinq formes",
  duration: 12,
  gropiTip: "Après la forme D de Do (case 10), la forme C revient en case 12, pile une octave au-dessus de la position ouverte. Le cycle C-A-G-E-D se répète toutes les 12 cases.",
  cartes: [
    { type: "idee", titre: "Cinq accords ouverts, cinq formes", texte: [
      "Do, La, Sol, Mi, Ré : tu connais ces cinq accords ouverts. Leurs noms anglais donnent C-A-G-E-D.",
      "Chaque forme se déplace comme un barré. Le même Do existe ainsi à cinq endroits du manche, du sillet à la case 13. On part du Do ouvert : la forme C.",
    ], bloc: FORME_C },
    { type: "idee", titre: "Forme A : le barré case 3", texte: [
      "Tu la connais déjà : c'est le barré forme La, index en case 3.",
      "La fondamentale est sur la corde 5, sous l'index : Do (corde 5 case 3). La forme de La est simplement remontée de trois cases.",
    ], bloc: FORME_A },
    { type: "question", quizId: "q-neck-14" },
    { type: "idee", titre: "Forme G : la plus étirée", texte: [
      "Le Sol ouvert (320003) remonté de cinq cases : 8-7-5-5-5-8. Do est à la basse, Do (corde 6 case 8), et au milieu, Do (corde 3 case 5).",
      "Trop étirée ? Joue seulement les quatre cordes aiguës : index en barré case 5 sur les cordes 4, 3 et 2, auriculaire en case 8 sur la corde 1.",
    ], bloc: FORME_G },
    { type: "idee", titre: "Forme E : le barré case 8", texte: [
      "Le barré forme Mi, index en case 8. Fondamentale sur la corde 6 : Do (corde 6 case 8), comme pour Fa, Sol et La.",
      "Remarque : la forme G et la forme E partagent ce Do grave. Deux formes voisines se touchent toujours, c'est ce qui les relie.",
    ], bloc: FORME_E },
    { type: "idee", titre: "Forme D : sur les quatre cordes aiguës", texte: [
      "Le Ré ouvert (xx0232) remonté de dix cases. La fondamentale est sur la corde 4 : Do (corde 4 case 10).",
      "Index case 10 sur la corde 4, majeur case 12 sur la corde 3, auriculaire case 13 sur la corde 2, annulaire case 12 sur la corde 1.",
    ], bloc: FORME_D },
    { type: "question", quizId: "q-neck-11" },
    { type: "a-toi", titre: "Do en cinq formes, en montant",
      consigne: "Forme C ouverte, forme A case 3, forme G case 5, forme E case 8, forme D case 10 : quatre coups par forme au clic à 60, puis redescends. Avant chaque forme, pose d'abord le doigt de la fondamentale.",
      bloc: { type: "fretboard_interactive", mode: "chord", root: "C", chord: "maj", caption: "Do majeur : Do, Mi et Sol sur tout le manche, les cinq formes s'y emboîtent", displayMode: "notes", lang: "fr", compact: true },
      bpm: 60, minuteur: 180 },
    { type: "question", quizId: "q-neck-12" },
    { type: "recap", points: [
      "C-A-G-E-D : cinq formes d'accords ouverts, déplacées sur le manche, donnent cinq fois le même accord.",
      "Pour Do : C ouvert, A case 3, G case 5, E case 8, D case 10, puis C revient en case 12.",
      "La fondamentale guide chaque forme : corde 5 pour C et A, corde 6 pour G et E, corde 4 pour D.",
    ] },
  ],
  quiz: ["q-neck-11","q-neck-12","q-neck-13","q-neck-14","q-fret-neck-05"],
};

export const quiz = [
  {id:"q-neck-11",courseId:"neck",lessonId:"neck-04",lvl:2,q:"En partant de la forme de Do et en montant le manche, quelle forme vient juste après ?",o:["La forme de Sol","La forme de La","La forme de Mi","La forme de Ré"],a:1,exp:"Ordre fixe et cyclique : C → A → G → E → D, puis retour à C une octave plus haut. Cet ordre est valable pour TOUS les accords majeurs.",xp:30},
  {id:"q-neck-12",courseId:"neck",lessonId:"neck-04",lvl:3,q:"La forme E barrée case 7 donne quel accord majeur ?",o:["La majeur","Sol majeur","Si majeur","Mi majeur"],a:2,exp:"Forme E = E majeur. Décalée case 7, on monte de 7 demi-tons : Mi + 7dt = Si. Donc Si majeur. Vérification : la fondamentale est sur corde 6 case 7 = Si.",xp:45},
  {id:"q-neck-13",courseId:"neck",lessonId:"neck-04",lvl:2,q:"Quelle forme du CAGED a sa fondamentale la plus grave sur la corde 4 ?",o:["La forme D","La forme A","La forme E","La forme G"],a:0,exp:"Comme le Ré ouvert (xx0232), la forme D part de la corde 4. Les formes C et A ont leur fondamentale grave sur la corde 5, les formes G et E sur la corde 6.",xp:40},
  {id:"q-neck-14",courseId:"neck",lessonId:"neck-04",lvl:3,q:"Tu joues un Do majeur en forme de La barrée. À quelle case se trouve le barré ?",o:["Case 3","Case 5","Case 8","Case 10"],a:0,exp:"En forme de La, la fondamentale est sur la corde 5, sous le barré. Do est à la case 3 de la corde 5 : barré case 3. La case 8 donnerait Do en forme de Mi, fondamentale sur la corde 6.",xp:55},
  {id:"q-fret-neck-05",type:"fretboard",courseId:"neck",lessonId:"neck-04",lvl:3,q:"CAGED : trouve tous les Do du manche, les fondamentales des cinq formes de Do",concept:{type:"find_note",root:"C"},selectionRules:{mode:"all"},display:{showNotes:false},hint:"Do est en case 3 sur la corde 5 et en case 8 sur la corde 6 : cherche ensuite leurs octaves.",xp:50,exp:"Do en : corde 6 case 8, corde 5 case 3, corde 4 case 10, corde 3 case 5, corde 2 case 1, corde 1 case 8. Chaque forme du CAGED s'accroche à l'un d'eux."},
];
