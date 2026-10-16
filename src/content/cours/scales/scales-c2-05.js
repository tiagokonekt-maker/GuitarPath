// Leçon du module « scales » + les questions de quiz qui s'y rattachent.
// Format décrit dans src/content/README.md.

export default {
  id: "scales-c2-05", level: 5,
  title: "Jouer la gamme majeure sur le manche",
  duration: 12,
  gropiTip: "Piège fréquent : jouer Fa au lieu de Fa# en Sol majeur. Dans la position 1, le Fa# est case 4 corde 4 et case 2 corde 1 : vise-les exprès en montant et en descendant.",
  content: [
    { type: "p", text: "Maintenant qu'on connaît la théorie, mettons-la dans nos doigts. Jouer la gamme majeure sur la guitare, c'est la première vraie compétence pratique. On va voir 3 positions essentielles, à mémoriser dans cet ordre." },
    { type: "h", text: "Position 1 : fondamentale sur la corde 6" },
    { type: "p", text: "C'est la position la plus utilisée. La fondamentale (le 1er degré) est sur la corde 6 (Mi grave). Tu joues ensuite le pattern T-T-DT-T-T-T-DT en montant. Pour Sol majeur (fondamentale case 3 corde 6) : Corde 6 → Sol(3)-La(5). Corde 5 → Si(2)-Do(3)-Ré(5). Corde 4 → Mi(2)-Fa#(4)-Sol(5). Corde 3 → La(2)-Si(4). Corde 2 → Do(1)-Ré(3)-Mi(5). Corde 1 → Fa#(2)-Sol(3)." },
    {
      type: "scale_pattern",
      caption: "Sol majeur — Position 1 (fondamentale case 3, corde 6)",
      data: {
        startFret: 1, endFret: 5,
        rootColor: "green", noteColor: "primary",
        strings: [
          { frets: [3, 5],    root: [3] },
          { frets: [2, 3, 5], root: [] },
          { frets: [2, 4, 5], root: [] },
          { frets: [2, 4],    root: [] },
          { frets: [1, 3, 5], root: [] },
          { frets: [2, 3],    root: [3] },
        ],
        noteMap: {
          "3,0": "Sol","5,0": "La",
          "2,1": "Si", "3,1": "Do","5,1": "Ré",
          "2,2": "Mi", "4,2": "Fa#","5,2": "Sol",
          "2,3": "La", "4,3": "Si",
          "1,4": "Do", "3,4": "Ré","5,4": "Mi",
          "2,5": "Fa#","3,5": "Sol",
        },
      },
    },
    { type: "h", text: "Comment retenir la position" },
    { type: "p", text: "Cette position couvre 5 cases sur le manche (cases 1 à 5 dans l'exemple Sol majeur). Tu utilises 4 doigts (index sur case 2, majeur sur case 3, annulaire sur case 4, auriculaire sur case 5). Quand tu glisses cette position le long du manche, tu obtiens d'autres tonalités majeures sans changer la forme. Forme glissée case 5 → La majeur. Case 7 → Si majeur. Etc." },
    { type: "h", text: "Position 2 : fondamentale sur la corde 5" },
    { type: "p", text: "Plus aiguë, utile pour explorer la zone médium du manche. Pour Do majeur (fondamentale case 3 corde 5) : Corde 5 → Do(3)-Ré(5). Corde 4 → Mi(2)-Fa(3)-Sol(5). Corde 3 → La(2)-Si(4). Corde 2 → Do(1)-Ré(3)-Mi(5). Corde 1 → Fa(1)-Sol(3). Cette position offre un timbre plus 'vocal', dans le médium." },
    {
      type: "scale_pattern",
      caption: "Do majeur — Position 2 (fondamentale case 3, corde 5)",
      data: {
        startFret: 0, endFret: 5,
        rootColor: "primary", noteColor: "green",
        strings: [
          { frets: [], root: [] },
          { frets: [3, 5], root: [3] },
          { frets: [2, 3, 5], root: [] },
          { frets: [2, 4], root: [] },
          { frets: [1, 3, 5], root: [1] },
          { frets: [1, 3], root: [] },
        ],
        noteMap: {
          "3,1":"Do","5,1":"Ré",
          "2,2":"Mi","3,2":"Fa","5,2":"Sol",
          "2,3":"La","4,3":"Si",
          "1,4":"Do","3,4":"Ré","5,4":"Mi",
          "1,5":"Fa","3,5":"Sol",
        }
      },
    },
    { type: "h", text: "Position 3 : extension aiguë" },
    { type: "p", text: "Pour Sol majeur en haut du manche : on retrouve Sol case 15 corde 6 (l'octave de la case 3), et tu rejoues le même pattern 12 cases plus haut. Cette zone aiguë est idéale pour les solos et les phrases mélodiques 'qui chantent'." },
    { type: "h", text: "Les 3 mots d'ordre pour bien apprendre une position" },
    { type: "p", text: "1) Va lentement. 60 BPM au métronome, chaque note doit sonner claire. 2) Nomme les notes à voix haute pendant que tu les joues (Sol-La-Si-Do-Ré...). Ça connecte tes doigts à ton cerveau. 3) Identifie la fondamentale dans chaque corde. Avec le temps, tu verras les degrés (1, 2, 3, 4...) à la place des notes." },
    { type: "h", text: "Connecter les positions" },
    { type: "p", text: "Une fois les 3 positions mémorisées, l'étape suivante est de les connecter. Tu commences en position 1, glisses vers la position 2, puis vers la position 3. C'est ce qui te donnera la liberté totale sur le manche. Mais ne te précipite pas : maîtrise UNE position d'abord, à fond, avant d'en ajouter d'autres." },
    { type: "ref", text: "Pour mettre tes nouvelles positions en pratique : la chanson 'Wonderwall' (Oasis) est en Sol majeur. Tu peux improviser un solo simple par-dessus en utilisant uniquement les notes de la gamme de Sol majeur en position 1. Toutes les notes que tu joueras sonneront 'justes'." },
    { type: "tip", text: "Méthode anti-frustration : pendant les 7 premiers jours, ne joue QUE la position 1 dans UNE seule tonalité (Sol majeur). Pas de précipitation. Une vraie maîtrise = 100 répétitions, pas 5. Ta position deviendra automatique." },
  ],
  quiz: ["q-fret-scales-01","q-scales-32","q-scales-33"],
};

export const quiz = [
  {id:"q-fret-scales-01",type:"fretboard",courseId:"scales",lessonId:"scales-c2-05",lvl:1,q:"Sélectionne les notes de Do majeur sur les cases 0-3",concept:{type:"find_scale",root:"C",quality:"major"},selectionRules:{mode:"all"},fretRange:[0,3],display:{showNotes:false},hint:"Do majeur = Do Ré Mi Fa Sol La Si.",xp:45,exp:"Do majeur en position ouverte : 7 notes naturelles cases 0-3."},
  {id:"q-scales-32",courseId:"scales",lessonId:"scales-c2-05",lvl:1,q:"Dans la position 1 de Sol majeur, où se trouve la fondamentale ?",o:["Corde 5, case 3", "Corde 6, case 3", "Corde 4, case 5", "Corde 6, case 5"],a:1,exp:"Position 1 = fondamentale sur la corde 6. Sol est à la case 3 de la corde 6.",xp:30},
  {id:"q-scales-33",courseId:"scales",lessonId:"scales-c2-05",lvl:1,q:"Dans la position 1 de Sol majeur, où se trouve le Sol situé une octave au-dessus de la fondamentale ?",o:["Corde 4, case 5","Corde 5, case 5","Corde 3, case 5","Corde 4, case 3"],a:0,exp:"Motif d'octave corde 6 → corde 4 : deux cordes plus loin, deux cases plus haut. Sol (corde 6 case 3) → Sol (corde 4 case 5). Repérer les fondamentales donne les points d'appui de la position.",xp:30},
];
