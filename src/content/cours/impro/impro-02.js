// Leçon du module « impro » + les questions de quiz qui s'y rattachent.
// Format décrit dans src/content/README.md.

export default {
  id: "impro-02", level: 7,
  title: "Cibler les notes d'accord",
  duration: 15,
  gropiTip: "Avant d'improviser sur Am7, égrène La, Do, Mi, Sol en noires à 60 BPM, en montant puis en descendant, dans une seule position. Ces 4 notes dans les doigts, tes atterrissages deviennent réflexes.",
  content: [
    { type: "p", text: "La différence entre 'jouer sur un accord' et 'jouer à côté' tient à une chose : est-ce que tu cibles les notes de l'accord sur les temps forts ? Ce concept — le chord tone targeting — est le secret n°1 des improvisateurs professionnels." },
    { type: "h", text: "Les chord tones" },
    { type: "p", text: "Les chord tones sont les notes de la triade ou de la tétrade. Sur Am7 : La, Do, Mi, Sol. Sur G7 : Sol, Si, Ré, Fa. Ces notes sonnent 'dedans' à coup sûr car elles font partie de l'accord lui-même. Arriver sur une chord tone sur le temps 1 d'une mesure = phrasing professionnel instantané." },
    { type: "h", text: "Les guide tones (3e et 7e)" },
    { type: "p", text: "Parmi les chord tones, la 3e et la 7e sont les plus importantes — ce sont les 'guide tones'. La 3e définit si l'accord est majeur ou mineur. La 7e définit si c'est un accord de 7e majeure, mineure ou dominante. Sur Am7 : Do (♭3) + Sol (♭7). Sur G7 : Si (3) + Fa (♭7). Ces 2 notes résument l'accord." },
    { type: "fretboard_interactive", mode: "quiz", quizTarget: "C", caption: "Quiz : trouve tous les Do — tierce mineure de Am7", lang: "fr", compact: true },
    { type: "fretboard_interactive", mode: "chord", root: "A", chord: "min7", caption: "Am7 — toutes les chord tones sur le manche", displayMode: "notes", lang: "fr", compact: true },
    { type: "h", text: "La technique du ciblage" },
    { type: "p", text: "Principe : tu peux jouer n'importe quelle note de la gamme tant que tu arrives sur une chord tone sur les temps forts. Les notes 'de passage' entre deux chord tones peuvent être non diatoniques — elles ne choquent pas car elles passent vite. C'est la base du bebop." },
    { type: "fretboard_interactive", mode: "chord", root: "G", chord: "dom7", caption: "G7 — guide tones : Si (3e) et Fa (7e mineure)", displayMode: "intervals", lang: "fr", compact: true },
    { type: "tip", text: "Exercice quotidien : sur un accord tenu (Am pendant 4 mesures), joue des phrases qui finissent TOUJOURS sur La, Do, Mi ou Sol. Force-toi à atterrir sur ces notes. Au bout de 10 minutes, tu entends la différence." },
  ],
  quiz: ["q-impro-25","q-impro-26","q-impro-04","q-impro-05"],
};

export const quiz = [
  {id:"q-impro-25",courseId:"impro",lessonId:"impro-02",lvl:2,q:"Sur un blues en La, on peut jouer La pentatonique mineure sur les trois accords. Pourquoi ?",o:["Parce que la gamme sert la tonalité entière", "Parce que le blues ne suit aucune règle", "Parce que les trois accords sont mineurs", "Parce que le tempo d'un blues reste toujours lent"],a:0,exp:"On improvise sur la tonalité, pas sur chaque accord. C'est ce qui rend le blues abordable — et suivre les accords un par un, en ciblant leurs notes, est justement l'étape suivante.",xp:30},
  {id:"q-impro-26",courseId:"impro",lessonId:"impro-02",lvl:3,q:"Que sont les « guide tones » d'un accord ?",o:["Les notes jouées à vide","La tierce et la septième","La fondamentale et la quinte","Les notes les plus aiguës du voicing"],a:1,exp:"Tierce et septième portent l'identité de l'accord : la tierce dit majeur ou mineur, la septième dit la fonction. Fondamentale et quinte, elles, ne distinguent presque rien — d'où l'intérêt de viser les premières quand la grille bouge.",xp:40},
];
