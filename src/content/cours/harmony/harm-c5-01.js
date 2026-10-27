// Leçon du module « harmony » + les questions de quiz qui s'y rattachent.
// Format « leçon en cartes » décrit dans src/content/README.md.

export default {
  id: "harm-c5-01", level: 7,
  title: "Harmoniser la gamme majeure",
  duration: 9,
  gropiTip: "Chaque accord majeur de la gamme a son relatif mineur dans la même gamme : I et vi, IV et ii, V et iii. En Do : Do/Lam, Fa/Rém, Sol/Mim. Seul le vii° reste à part.",
  cartes: [
    { type: "idee", titre: "Un accord sur chaque note", texte: [
      "Harmoniser une gamme : sur chaque note, empiler des tierces en n'utilisant que les notes de la gamme.",
      "En Do : Do + Mi + Sol = Do majeur. Ré + Fa + La = Ré mineur, car la tierce de Ré dans la gamme de Do est Fa, pas Fa#.",
    ], bloc: {
      type: "chord_diagram",
      caption: "ii — Ré mineur (× × 0 2 3 1)",
      data: { name: "Dm (ii)", frets: [-1,-1,0,2,3,1], fingers: [0,0,0,1,3,2], startFret: 1 },
    } },
    { type: "idee", titre: "Les 7 triades de Do", texte: [
      "I Do, ii Rém, iii Mim, IV Fa, V Sol, vi Lam, vii° Si diminué (Si Ré Fa).",
      "Le motif des qualités : majeur, mineur, mineur, majeur, majeur, mineur, diminué. Majuscule = majeur, minuscule = mineur, ° = diminué.",
    ] },
    { type: "question", quizId: "q-harm-12" },
    { type: "idee", titre: "Le même motif partout", texte: [
      "Ce motif vient de la place des tons et demi-tons de la gamme majeure : il est identique dans toutes les tonalités.",
      "En Sol : Sol, Lam, Sim, Do, Ré, Mim, Fa#dim. Dire « I-V-vi-IV » décrit donc une grille dans n'importe quelle tonalité.",
    ] },
    { type: "question", quizId: "q-harm-13" },
    { type: "idee", titre: "Avec la 7e", texte: [
      "Ajoute la 7e de la gamme sur chaque degré : Cmaj7, Dm7, Em7, Fmaj7, G7, Am7, Bm7♭5.",
      "Seul le V porte un accord de dominante. C'est lui qui crée la tension principale, celle qui ramène au I.",
    ], bloc: {
      type: "chord_diagram",
      caption: "V7 — Sol 7 (3 2 0 0 0 1) — dominante avec ♭7, attraction maximale vers I",
      data: { name: "G7 (V7)", frets: [3,2,0,0,0,1], fingers: [3,2,0,0,0,1], startFret: 1 },
    } },
    { type: "question", quizId: "q-harm-21" },
    { type: "a-toi", titre: "Les degrés dans trois tonalités",
      consigne: "Une mesure par accord, au clic. I-IV-V-I puis I-V-vi-IV en Do (Do Fa Sol / Do Sol Lam Fa), en Sol (Sol Do Ré / Sol Ré Mim Do), en Ré (Ré Sol La / Ré La Sim Sol). Dis les chiffres en jouant. Bonus : capo case 2 sur la version en Do, tu sonnes en Ré.",
      bloc: {
        type: "chord_diagram",
        caption: "I — Do majeur (× 3 2 0 1 0)",
        data: { name: "C (I)", frets: [-1,3,2,0,1,0], fingers: [0,3,2,0,1,0], startFret: 1 },
      }, bpm: 70, minuteur: 180 },
    { type: "question", quizId: "q-harm-24" },
    { type: "recap", points: [
      "Harmoniser = empiler des tierces avec les seules notes de la gamme.",
      "En majeur : I, ii, iii, IV, V, vi, vii° — majeur, mineur, mineur, majeur, majeur, mineur, diminué.",
      "Avec les 7e : Maj7, m7, m7, Maj7, 7, m7, m7♭5 ; seul le V est une dominante.",
    ] },
  ],
  quiz: ["q-harm-12","q-harm-13","q-harm-21","q-harm-24","q-fret-harm-10","q-logic-04","q-harm-02","q-harm-03"],
};

export const quiz = [
  {id:"q-harm-12",courseId:"harmony",lessonId:"harm-c5-01",lvl:2,q:"En harmonisant la gamme majeure, le pattern de qualités est…",o:["Maj-Maj-min-min-Maj-Maj-dim","min-Maj-min-Maj-min-Maj-min","Maj-min-Maj-min-Maj-min-Maj","Maj-min-min-Maj-Maj-min-dim"],a:3,exp:"Pattern invariant : I=Maj, ii=min, iii=min, IV=Maj, V=Maj, vi=min, vii°=dim. Vrai dans toute tonalité majeure.",xp:40},
  {id:"q-harm-13",courseId:"harmony",lessonId:"harm-c5-01",lvl:2,q:"En Sol majeur, le ii est…",o:["La mineur","La majeur","Si mineur","Mi mineur"],a:0,exp:"Sol majeur : Sol(I)-La(ii)-Si(iii)-Do(IV)-Ré(V)-Mi(vi)-Fa#(vii°). Le ii = sur La. Pattern : ii = mineur. Donc La mineur (Am).",xp:40},
  {id:"q-harm-21",courseId:"harmony",lessonId:"harm-c5-01",lvl:3,q:"Tu es en Mi♭ majeur. Quel accord pour le V7 ?",o:["Sib7","Si7","La7","Sol7"],a:0,exp:"Mi♭ majeur : Mi♭(I)-Fa(ii)-Sol(iii)-Lab(IV)-Sib(V)-Do(vi)-Ré(vii°). V7 = Sib7 (= La#7 enharmonique).",xp:55},
  {id:"q-harm-24",courseId:"harmony",lessonId:"harm-c5-01",lvl:2,q:"La progression I-vi-IV-V en Do majeur donne…",o:["Do-Mim-Fa-Sol","Do-Lam-Sol-Fa","Do-Mim-Lam-Fa","Do-Lam-Fa-Sol"],a:3,exp:"I=Do, vi=Lam, IV=Fa, V=Sol. Do-Lam-Fa-Sol = doo-wop classique des années 50 ('Stand By Me', 'Earth Angel').",xp:40},
  {id:"q-fret-harm-10",type:"fretboard",courseId:"harmony",lessonId:"harm-c5-01",lvl:2,q:"Harmonisation Do majeur : trouve toutes les notes Mi (3e du I)",concept:{type:"find_note",root:"E"},selectionRules:{mode:"all"},display:{showNotes:false},hint:"Mi à vide sur cordes 6 et 1. Tierce de Do majeur.",xp:50,exp:"Mi en : corde 6 à vide, corde 5 case 7, corde 4 case 2, corde 3 case 9, corde 2 case 5, corde 1 à vide. La tierce majeure de Cmaj7."},
];
