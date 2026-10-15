// Leçon du module « scales » + les questions de quiz qui s'y rattachent.
// Format décrit dans src/content/README.md.

export default {
  id: "scales-c1-05", level: 3,
  title: "Les intervalles simples : seconde, tierce, quarte, quinte",
  duration: 11,
  gropiTip: "Erreur fréquente : oublier de compter la note de départ. Do→Sol, c'est Do-Ré-Mi-Fa-Sol : 5 notes, donc une quinte, même s'il n'y a que 4 pas entre elles.",
  content: [
    { type: "p", text: "Un intervalle, c'est la distance entre deux notes. Tu sais déjà mesurer cette distance en demi-tons. Maintenant on va lui donner un nom 'musical' : seconde, tierce, quarte, quinte... Ces noms sont essentiels parce que toute la musique en parle." },
    { type: "h", text: "Comment compter un intervalle" },
    { type: "p", text: "Pour nommer un intervalle entre 2 notes, on compte les notes elles-mêmes (en incluant la première et la dernière). De Do à Mi, on compte : Do(1) - Ré(2) - Mi(3). Donc Do→Mi est une 'tierce'. De Sol à Do : Sol(1) - La(2) - Si(3) - Do(4). Donc Sol→Do est une 'quarte'." },
    { type: "h", text: "Les 5 intervalles courants" },
    { type: "p", text: "Seconde : 2 notes d'écart (Do→Ré). Tierce : 3 notes (Do→Mi). Quarte : 4 notes (Do→Fa). Quinte : 5 notes (Do→Sol). Sixte : 6 notes (Do→La). Plus l'intervalle est grand, plus on monte dans l'aigu." },
    {
      type: "interval_chart",
      caption: "Les intervalles — focus sur seconde, tierce, quarte, quinte",
      data: { highlight: ["M2", "m3", "M3", "P4", "P5", "M6"] },
    },
    { type: "h", text: "Mais attention : majeur ou mineur ?" },
    { type: "p", text: "Chaque intervalle peut exister en version 'majeure' (plus grand) ou 'mineure' (plus petit). C'est là que les demi-tons reviennent. Une tierce majeure = 4 demi-tons (ex: Do→Mi). Une tierce mineure = 3 demi-tons (ex: Do→Mi♭). Même nom 'tierce', mais 1 demi-ton de différence — et ce demi-ton change tout ! C'est lui qui fait la différence entre un accord majeur (joyeux) et un accord mineur (triste)." },
    { type: "h", text: "Tableau des intervalles et leurs demi-tons" },
    { type: "p", text: "Seconde mineure = 1 demi-ton. Seconde majeure = 2. Tierce mineure = 3. Tierce majeure = 4. Quarte juste = 5. Triton (quarte aug./quinte dim.) = 6. Quinte juste = 7. Sixte mineure = 8. Sixte majeure = 9. Septième mineure = 10. Septième majeure = 11. Octave = 12. Mémoriser ces 12 valeurs est l'investissement le plus rentable de ta vie de musicien." },
    { type: "h", text: "Sur la guitare : la mesure visuelle" },
    { type: "p", text: "Une chose magique : sur une seule corde, l'intervalle EN DEMI-TONS = nombre de cases d'écart. Tierce majeure = 4 cases. Quinte = 7 cases. Octave = 12 cases. Tu as littéralement la théorie musicale sous les doigts." },
    { type: "ref", text: "Reconnaître une quinte juste à l'oreille : les 2 premières notes du générique de Star Wars, c'est une quinte. Les premières notes de 'Twinkle Twinkle Little Star' (Au clair de la lune en France), c'est aussi une quinte ascendante. Une fois que ton oreille les a, tu les entendras partout." },
    { type: "tip", text: "Apprends d'abord les 5 intervalles 'piliers' : seconde majeure (1 ton), tierce majeure (2 tons), quarte juste (5 demi-tons), quinte juste (7 demi-tons), octave. Tout le reste se déduit." },
  ],
  quiz: ["q-scales-22","q-scales-23","q-scales-24"],
};

export const quiz = [
  {id:"q-scales-22",courseId:"scales",lessonId:"scales-c1-05",lvl:2,q:"Quel est l'intervalle entre Sol et Do (Sol, La, Si, Do) ?",o:["Tierce","Quinte","Quarte","Seconde"],a:2,exp:"Sol(1)-La(2)-Si(3)-Do(4) : quatre notes en comptant les deux bornes, donc une quarte.",xp:35},
  {id:"q-scales-23",courseId:"scales",lessonId:"scales-c1-05",lvl:2,q:"Une tierce majeure correspond à combien de demi-tons ?",o:["3","5","2","4"],a:3,exp:"Tierce majeure = 4 demi-tons (Do→Mi). Tierce mineure = 3 demi-tons (Do→Mib) — ce seul demi-ton distingue un accord majeur d'un accord mineur.",xp:35},
  {id:"q-scales-24",courseId:"scales",lessonId:"scales-c1-05",lvl:3,q:"Sur une seule corde de guitare, comment mesure-t-on visuellement un intervalle ?",o:["Le nombre de cases d'écart = le nombre de demi-tons","Le nombre de cases divisé par 2","Toujours 12 cases quel que soit l'intervalle","Ça dépend de la corde utilisée"],a:0,exp:"Sur une seule corde, l'intervalle en demi-tons correspond exactement au nombre de cases d'écart — tierce majeure = 4 cases, quinte = 7 cases.",xp:45},
];
