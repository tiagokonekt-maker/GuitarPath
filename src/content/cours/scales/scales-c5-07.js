// Leçon du module « scales » + les questions de quiz qui s'y rattachent.
// Format « leçon en cartes » décrit dans src/content/README.md.

export default {
  id: "scales-c5-07", level: 8,
  title: "Locrien — le mode interdit",
  duration: 7,
  gropiTip: "Pour l'entendre sans te perdre : joue l'accord Bm7♭5 (Si-Ré-Fa-La), puis promène-toi dans les notes de Do majeur en partant de Si. Tu sentiras vite que le Fa empêche de se poser.",
  cartes: [
    { type: "idee", titre: "Le 7e mode", texte: [
      "Do majeur joué depuis Si : Si, Do, Ré, Mi, Fa, Sol, La. C'est Si locrien.",
      "Formule : 1-♭2-♭3-4-♭5-♭6-♭7. Cinq notes abaissées : le plus sombre des sept modes.",
    ] },
    { type: "idee", titre: "Pas de quinte juste", texte: [
      "Entre Si et Fa, pas de quinte juste mais un triton. Or la quinte est ce qui ancre la fondamentale dans tous les autres modes.",
      "Sans elle, l'oreille ne sait pas où se poser : le locrien sonne toujours instable. Le triton, surnommé diabolus in musica, a longtemps été évité.",
    ], bloc: { type: "scale_pattern", caption: "Si locrien — note clé : Fa, la quinte diminuée (case 8 c5, case 10 c3)", data: {startFret: 7, endFret: 10, rootColor: "amber", noteColor: "primary", accentColor: "coral", accentLabel: "Fa, quinte diminuée", strings: [{frets: [7,8,10], root: [7]}, {frets: [7,8,10], root: [], accent: [8]}, {frets: [7,9,10], root: [9]}, {frets: [7,9,10], root: [], accent: [10]}, {frets: [8,10], root: []}, {frets: [7,8,10], root: [7]}], noteMap: {"7,0":"Si", "8,0":"Do", "10,0":"Ré", "7,1":"Mi", "8,1":"Fa", "10,1":"Sol", "7,2":"La", "9,2":"Si", "10,2":"Do", "7,3":"Ré", "9,3":"Mi", "10,3":"Fa", "8,4":"Sol", "10,4":"La", "7,5":"Si", "8,5":"Do", "10,5":"Ré"}} } },
    { type: "question", quizId: "q-scales-p89-c507-01" },
    { type: "idee", titre: "Le demi-diminué", texte: [
      "Son terrain : l'accord m7♭5, Bm7♭5 pour Si locrien. On le croise surtout comme ii d'un ii-V-i mineur : Bm7♭5 – E7 – Am.",
      "Là, le locrien ne dure qu'une mesure, en passage. Des morceaux entiers en locrien, il y en a très peu.",
    ], bloc: { type: "chord_diagram", caption: "Bm7b5 (x2323x) — l'accord demi-diminué, terrain naturel du Si locrien", data: {name: "Bm7b5", frets: [-1,2,3,2,3,-1], fingers: [0,1,3,2,4,0], startFret: 1} } },
    { type: "question", quizId: "q-scales-43" },
    { type: "a-toi", titre: "Un ii-V-i mineur",
      consigne: "Enchaîne Bm7♭5, E7 et Am, une mesure chacun, au clic à 60. Sur Bm7♭5, joue la tab : elle grimpe dans les notes de l'accord, de Si jusqu'au Fa (corde 3 case 10). Laisse sonner E7 puis Am. Écoute comme Am soulage la tension.",
      bloc: {
        type: "tab",
        caption: "Si locrien, position case 7 : l'arpège de Bm7♭5 (Si, Ré, Fa, La) jusqu'à la quinte diminuée",
        text: "Tab — corde 6 cases 7 et 10 (Si, Ré), corde 5 case 8 (Fa), corde 4 cases 7 et 9 (La, Si), corde 3 cases 7 et 10 (Ré, Fa).",
        data: { lines: [
          "e|------------------------|",
          "B|------------------------|",
          "G|-----------------7--10--|",
          "D|-----------7--9---------|",
          "A|--------8---------------|",
          "E|-7--10------------------|",
        ] },
      }, bpm: 60, minuteur: 120 },
    { type: "question", quizId: "q-scales-44" },
    { type: "recap", points: [
      "Locrien = 1-♭2-♭3-4-♭5-♭6-♭7 ; Si locrien = notes de Do majeur depuis Si.",
      "Sa quinte diminuée lui retire tout point de repos : il sonne instable.",
      "Usage réel : sur un m7♭5, souvent le ii d'un ii-V-i mineur.",
    ] },
  ],
  quiz: ["q-scales-43", "q-scales-44", "q-scales-45", "q-scales-04", "q-scales-08", "q-scales-p89-c507-01"],
};

export const quiz = [
  {id:"q-scales-43",courseId:"scales",lessonId:"scales-c5-07",lvl:1,q:"Quelle est la particularité du locrien ?",o:["Sa tierce est majeure","Il n'a que 5 notes","Sa quinte est diminuée","Sa septième est majeure"],a:2,exp:"C'est le seul mode dont la quinte est diminuée (♭5) : sans quinte juste, l'oreille ne trouve pas où se poser.",xp:30},
  {id:"q-scales-44",courseId:"scales",lessonId:"scales-c5-07",lvl:2,q:"Sur quel accord le locrien s'utilise-t-il surtout ?",o:["Un accord maj7 de tonique","Un accord de dominante 7","Un accord mineur 7 de repos","Un accord m7♭5"],a:3,exp:"Sur le demi-diminué (m7♭5), par exemple le ii d'un ii-V-i mineur : Bm7♭5 - E7 - Am7.",xp:40},
  {id:"q-scales-45",courseId:"scales",lessonId:"scales-c5-07",lvl:1,q:"Si locrien a les mêmes notes que quelle gamme ?",o:["Do majeur","Si mineur","Sol majeur","Fa majeur"],a:0,exp:"Le locrien est le 7e mode de la gamme majeure : Si locrien = Do majeur, joué depuis Si.",xp:30},
  {id:"q-scales-p89-c507-01",courseId:"scales",lessonId:"scales-c5-07",lvl:3,q:"Mi locrien a les mêmes notes que quelle gamme majeure ?",o:["Fa majeur","Mi majeur","La majeur","Sol majeur"],a:0,exp:"Le locrien est le 7e mode : sa gamme parente commence un demi-ton au-dessus. Mi locrien = Fa majeur joué depuis Mi (Mi Fa Sol La Si♭ Do Ré).",xp:45},
];
