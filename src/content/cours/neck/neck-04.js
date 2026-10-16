// Leçon du module « neck » + les questions de quiz qui s'y rattachent.
// Format décrit dans src/content/README.md.

export default {
  id: "neck-04", level: 9,
  title: "Le système CAGED — théorie complète",
  duration: 16,
  gropiTip: "Après la forme D de Do (case 10), la forme C revient en case 12, pile une octave au-dessus de la position ouverte. Le cycle C-A-G-E-D se répète toutes les 12 cases.",
  content: [
    { type: "p", text: "CAGED est la grille de lecture du manche. 5 lettres pour 5 formes d'accords ouverts (C, A, G, E, D) qui, transposées et enchaînées, couvrent l'intégralité du manche pour n'importe quel accord." },
    { type: "h", text: "Pourquoi exactement 5 formes ?" },
    { type: "p", text: "Parce qu'il existe 5 manières uniques de jouer un accord majeur en utilisant cordes à vide ET frettes. Chaque forme contient la fondamentale sur une corde différente : C (c5), A (c5), G (c6), E (c6), D (c4). Ces 5 positions se relaient le long du manche pour former un cycle complet." },
    { type: "h", text: "L'ordre est immuable : C-A-G-E-D" },
    { type: "p", text: "Quand tu remontes le manche pour un accord donné, les formes apparaissent toujours dans cet ordre : C → A → G → E → D, puis on revient à C une octave plus haut. Cycliquement." },
    { type: "h", text: "Exemple concret : les 5 formes de Do majeur" },
    { type: "p", text: "Forme C : position ouverte (case 0-3). Forme A : barré case 3 (forme A décalée, fondamentale c5 case 3 = Do). Forme G : barré case 5 (forme G décalée, fondamentale c6 case 8 = Do). Forme E : barré case 8 (forme E décalée, fondamentale c6 case 8 = Do). Forme D : barré case 10 (forme D décalée, fondamentale c4 case 10 = Do)." },
    {
      type: "caged_form",
      caption: "Forme E — Am (barré case 5, fondamentale corde 6)",
      data: {
        form: "E", root: "La", rootFret: 5,
        startFret: 4, frets: 5,
        notes: [
          { string: 6, fret: 5, label: "La", color: "amber",   root: true },
          { string: 5, fret: 7, label: "Mi", color: "primary" },
          { string: 4, fret: 7, label: "La", color: "amber",   root: true },
          { string: 3, fret: 5, label: "Do", color: "primary" },
          { string: 2, fret: 5, label: "Mi", color: "primary" },
          { string: 1, fret: 5, label: "La", color: "amber",   root: true },
        ],
      },
    },
    {
      type: "caged_form",
      caption: "Forme A — Am (position ouverte, fondamentale corde 5)",
      data: {
        form: "A", root: "La", rootFret: 0,
        startFret: 0, frets: 5,
        notes: [
          { string: 5, fret: 0, label: "La", color: "amber",   root: true },
          { string: 4, fret: 2, label: "Mi", color: "primary" },
          { string: 3, fret: 2, label: "La", color: "amber",   root: true },
          { string: 2, fret: 1, label: "Do", color: "primary" },
          { string: 1, fret: 0, label: "Mi", color: "primary" },
        ],
      },
    },
    {
      type: "caged_form",
      caption: "Forme D — Am (barré case 7, fondamentale corde 4)",
      data: {
        form: "D", root: "La", rootFret: 7,
        startFret: 6, frets: 5,
        notes: [
          { string: 4, fret: 7, label: "La", color: "amber",   root: true },
          { string: 3, fret: 9, label: "Mi", color: "primary" },
          { string: 2, fret: 10,label: "La", color: "amber",   root: true },
          { string: 1, fret: 8, label: "Do", color: "primary" },
        ],
      },
    },
    { type: "h", text: "La connexion accord-gamme-arpège" },
    { type: "p", text: "Chaque forme CAGED 'cohabite' avec une zone de gamme et un arpège dans la même région du manche. Forme E de Do = position 1 de Do majeur en gamme + arpège Do dans la même zone. Maîtriser CAGED = unifier ta vision : tu vois l'accord, la gamme, l'arpège simultanément." },
    { type: "h", text: "CAGED en mineur" },
    { type: "p", text: "Le système fonctionne identique en mineur. Am s'organise en 5 formes : forme Em barré, forme Am barré, forme Dm, forme Cm (rare), forme Gm (rare). En pratique, les 3 premières (E, A, D) couvrent l'essentiel des besoins." },
    { type: "tip", text: "Programme de 5 jours : chaque jour, joue Am sous une forme CAGED. Lundi forme E. Mardi forme A. Mercredi forme G. Jeudi forme C. Vendredi forme D. Le manche s'éclaircit en une semaine." },
    { type: "fretboard_interactive", mode: "quiz", quizTarget: "A", caption: "Quiz CAGED : repère toutes les fondamentales La", lang: "fr", compact: true },
    { type: "fretboard_interactive", mode: "chord", root: "A", chord: "min", caption: "Am — toutes les notes La Do Mi sur tout le manche", displayMode: "notes", lang: "fr", compact: true },
  ],
  quiz: ["q-neck-11","q-neck-12","q-neck-13","q-neck-14","q-fret-neck-05"],
};

export const quiz = [
  {id:"q-neck-11",courseId:"neck",lessonId:"neck-04",lvl:2,q:"En partant de la forme de Do et en montant le manche, quelle forme vient juste après ?",o:["La forme de Sol","La forme de La","La forme de Mi","La forme de Ré"],a:1,exp:"Ordre fixe et cyclique : C → A → G → E → D, puis retour à C une octave plus haut. Cet ordre est valable pour TOUS les accords majeurs.",xp:30},
  {id:"q-neck-12",courseId:"neck",lessonId:"neck-04",lvl:3,q:"La forme E barrée case 7 donne quel accord majeur ?",o:["La majeur","Sol majeur","Si majeur","Mi majeur"],a:2,exp:"Forme E = E majeur. Décalée case 7, on monte de 7 demi-tons : Mi + 7dt = Si. Donc Si majeur. Vérification : la fondamentale est sur corde 6 case 7 = Si.",xp:45},
  {id:"q-neck-13",courseId:"neck",lessonId:"neck-04",lvl:3,q:"Pour Ré majeur, quelle est la forme CAGED en position ouverte (case 0) ?",o:["Forme C","Forme A","Forme G","Forme D"],a:3,exp:"Ré majeur en position ouverte (xx0232) est la forme D. En montant le manche, l'ordre CAGED continue : forme C, puis forme A (barré case 5), forme G, puis forme E (barré case 10).",xp:50},
  {id:"q-neck-14",courseId:"neck",lessonId:"neck-04",lvl:3,q:"Tu joues un Do majeur en forme de La barrée. À quelle case se trouve le barré ?",o:["Case 3","Case 5","Case 8","Case 10"],a:0,exp:"En forme de La, la fondamentale est sur la corde 5, sous le barré. Do est à la case 3 de la corde 5 : barré case 3. La case 8 donnerait Do en forme de Mi, fondamentale sur la corde 6.",xp:55},
  {id:"q-fret-neck-05",type:"fretboard",courseId:"neck",lessonId:"neck-04",lvl:3,q:"CAGED : trouve toutes les fondamentales La (ancres des 5 formes)",concept:{type:"find_note",root:"A"},selectionRules:{mode:"all"},display:{showNotes:false},hint:"La est à vide sur la corde 5. Cherche les octaves.",xp:50,exp:"La en : corde 6 case 5, corde 5 à vide, corde 4 case 7, corde 3 case 2, corde 2 case 10, corde 1 case 5. Ce sont tes ancres CAGED."},
];
