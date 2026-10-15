// Leçon du module « harmony » + les questions de quiz qui s'y rattachent.
// Format décrit dans src/content/README.md.

export default {
  id: "harm-c5-01", level: 7,
  title: "Harmoniser la gamme majeure",
  duration: 12,
  content: [
    { type: "p", text: "Harmoniser une gamme, c'est construire un accord sur chaque note de cette gamme en utilisant uniquement les notes appartenant à la gamme. Le résultat : 7 accords 'diatoniques' qui forment la palette harmonique de la tonalité. C'est la base de toute l'harmonie tonale, et la clé pour comprendre pourquoi tel accord 'va' avec tel autre." },
    { type: "h", text: "Le principe : empiler des tierces diatoniques" },
    { type: "p", text: "Pour construire un accord sur le degré I de Do majeur : commence sur Do, empile des tierces en utilisant uniquement les notes de Do majeur. Do + Mi (3e) + Sol (5e) = Do majeur. Pour le degré II : Ré + Fa (3e) + La (5e) = Ré mineur. La tierce de Ré dans la gamme de Do est Fa (et non Fa# comme dans Ré majeur). Donc Ré mineur, pas majeur." },
    { type: "h", text: "Les 7 triades diatoniques de Do majeur" },
    { type: "p", text: "I = Do majeur (Do-Mi-Sol). ii = Ré mineur (Ré-Fa-La). iii = Mi mineur (Mi-Sol-Si). IV = Fa majeur (Fa-La-Do). V = Sol majeur (Sol-Si-Ré). vi = La mineur (La-Do-Mi). vii° = Si diminué (Si-Ré-Fa). Le pattern de qualités : Maj-min-min-Maj-Maj-min-dim. Ce pattern est UNIVERSEL — il est identique dans toute tonalité majeure." },
    {
      type: "chord_diagram",
      caption: "I — Do majeur (× 3 2 0 1 0)",
      data: { name: "C (I)", frets: [-1,3,2,0,1,0], fingers: [0,3,2,0,1,0], startFret: 1 },
    },
    {
      type: "chord_diagram",
      caption: "ii — Ré mineur (× × 0 2 3 1)",
      data: { name: "Dm (ii)", frets: [-1,-1,0,2,3,1], fingers: [0,0,0,1,3,2], startFret: 1 },
    },
    {
      type: "chord_diagram",
      caption: "V — Sol majeur (3 2 0 0 0 3) — tension principale",
      data: { name: "G (V)", frets: [3,2,0,0,0,3], fingers: [2,1,0,0,0,4], startFret: 1 },
    },
    {
      type: "chord_diagram",
      caption: "V7 — Sol 7 (3 2 0 0 0 1) — dominante avec ♭7, attraction maximale vers I",
      data: { name: "G7 (V7)", frets: [3,2,0,0,0,1], fingers: [3,2,0,0,0,1], startFret: 1 },
    },
    { type: "h", text: "Les 7 accords de 7e diatoniques" },
    { type: "p", text: "En ajoutant la 7e à chaque degré : Imaj7 = Cmaj7. iim7 = Dm7. iiim7 = Em7. IVmaj7 = Fmaj7. V7 = G7. vim7 = Am7. viim7b5 = Bm7b5. Pattern : Maj7-m7-m7-Maj7-7-m7-m7b5. Remarque : le V porte un accord de dominante (7, pas Maj7). C'est lui qui crée la tension harmonique principale." },
    { type: "h", text: "Pourquoi ce pattern est universel" },
    { type: "p", text: "Ce pattern (Maj-min-min-Maj-Maj-min-dim) est déterminé par la structure de la gamme majeure (ses tons et demi-tons). Toute gamme majeure génère exactement ce même pattern, peu importe la tonalité. En Sol majeur : I=Sol, ii=Lam, iii=Sim, IV=Do, V=Ré, vi=Mim, vii°=Fa#dim. Toujours Maj-min-min-Maj-Maj-min-dim." },
    { type: "h", text: "Le chiffrage romain : majuscule vs minuscule" },
    { type: "p", text: "Convention universelle : chiffres romains MAJUSCULES (I, IV, V) = accords majeurs. Minuscules (ii, iii, vi) = accords mineurs. 'vii°' = diminué. C'est le système le plus utilisé pour analyser la musique. Quand un musicien dit 'la chanson est en I-V-vi-IV', tu sais exactement de quoi il parle, dans n'importe quelle tonalité." },
    { type: "ref", text: "Analyse pratique : 'Let It Be' (Beatles) en Do majeur = C-G-Am-F = I-V-vi-IV. 'Stairway to Heaven' (Led Zeppelin) commence sur Am (vi de Do majeur). 'House of the Rising Sun' (The Animals) en La mineur = Am-C-D-F-Am = i-III-IV-VI-i (en mineur, les chiffres changent légèrement). L'harmonisation de la gamme est partout." },
    { type: "tip", text: "Exercice : prends 5 chansons pop que tu connais. Trouve leur tonalité. Identifie les accords. Traduis en chiffrage romain (I, ii, iii...). Tu vas découvrir qu'un grand nombre de chansons pop reposent sur quelques progressions identiques. C'est illuminant." },
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
