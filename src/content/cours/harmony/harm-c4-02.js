// Leçon du module « harmony » + les questions de quiz qui s'y rattachent.
// Format décrit dans src/content/README.md.

export default {
  id: "harm-c4-02", level: 9,
  title: "Tensions et résolutions : comment les extensions fonctionnent",
  duration: 9,
  content: [
    { type: "p", text: "Les extensions ne sont pas juste des 'décorations'. Elles obéissent à une logique précise de tensions et résolutions. Comprendre cette logique te permet d'utiliser les extensions intelligemment : pas au hasard, mais avec une intention harmonique claire." },
    { type: "h", text: "Le principe de tension-résolution" },
    { type: "p", text: "En harmonie tonale, le mouvement de base est : tension → résolution. Une dissonance (tension) attire vers une consonance (résolution). L'accord de dominante (V7) est la tension. L'accord de tonique (I) est la résolution. Les extensions enrichissent ce mouvement en ajoutant des couches de tension supplémentaires." },
    { type: "h", text: "Extensions 'libres' vs extensions 'tendues'" },
    { type: "p", text: "Certaines extensions sont 'disponibles' (free tones) : elles s'ajoutent à n'importe quel accord sans créer de tension spécifique. La 9e naturelle est souvent libre sur les accords Maj7 et m7. D'autres extensions sont 'tendues' (avoid tones ou chromatic approach tones) : elles créent une friction qui demande à se résoudre. La 11e naturelle sur un Maj7 est une tension (forme un demi-ton avec la 3e)." },
    { type: "h", text: "Note évitée : le Fa sur Cmaj7" },
    { type: "p", text: "La note la plus 'évitée' en harmonie tonale classique : le Fa (11e) sur Cmaj7. Fa est à 1 demi-ton de Mi (3e de Cmaj7). Cette friction est perçue comme dissonante. On dit que Fa est l'avoid note de Cmaj7. En pratique : si tu joues le Fa en note de passage (courte), ça passe. Si tu le tiens longtemps sur Cmaj7, ça sonne 'faux'. La durée détermine si une note tendue est agréable ou désagréable." },
    { type: "h", text: "Les tensions dans la gamme sur l'accord" },
    { type: "p", text: "Pour chaque accord, certaines notes de la gamme parente sont 'libres' (sonnent bien tenues) et d'autres sont 'tendues' (sonnent bien en passage mais pas tenues). Sur Cmaj7 en Do majeur : 1 (Do) = libre. 2/9 (Ré) = libre. 3 (Mi) = libre. 4/11 (Fa) = tendue (avoid). 5 (Sol) = libre. 6/13 (La) = libre. 7 (Si) = libre. Seul le Fa est tendu sur Cmaj7." },
    { type: "h", text: "Résolution par demi-ton" },
    { type: "p", text: "La résolution la plus forte = mouvement de demi-ton. C'est pourquoi V7 → I est si puissant (Si descend vers Do, Fa descend vers Mi, 2 mouvements de demi-ton). Les extensions créent des tensions supplémentaires qui se résolvent aussi par demi-tons. ♭9 de G7 (Lab) → Sol (fondamentale de C). #11 de G7alt (Do#) → Do (fondamentale de C). Plus tu ajoutes d'extensions tendues, plus la résolution sera satisfaisante." },
    { type: "h", text: "L'équilibre tension-résolution dans un solo" },
    { type: "p", text: "En improvisation, la gestion de la tension est un art. Trop peu de tension = solo plat, ennuyeux. Trop de tension sans résolution = chaos sonore. La formule idéale : build tension progressivement → release sur un point fort. Les extensions te donnent des outils pour 'doser' la tension de tes phrases." },
    { type: "ref", text: "John Coltrane ('A Love Supreme', 1964) est le maître de la gestion tension-résolution. Il pousse la dissonance très loin (extensions altérées, superpositions modales) avant de résoudre. L'effet est cathartique — la résolution est d'autant plus satisfaisante que la tension était intense." },
    { type: "tip", text: "Drill tension-résolution : sur Cmaj7, improvise en utilisant le Fa (avoid note) comme note de passage vers Mi ou Sol, jamais comme note tenue. Pratique ce geste jusqu'à ce qu'il devienne naturel : entrer sur Fa, ressortir immédiatement sur Mi ou Sol. Tu viens d'apprendre à gérer une tension harmonique." },
  ],
  quiz: ["q-harm-41", "q-harm-42", "q-harm-43", "q-harm-24", "q-impro-02"],
};

export const quiz = [
  {id:"q-harm-41",courseId:"harmony",lessonId:"harm-c4-02",lvl:1,q:"Sur Cmaj7, quelle est l'« avoid note » ?",o:["Ré (9e)","La (13e)","Si (7e)","Fa (11e)"],a:3,exp:"Fa est à un demi-ton au-dessus de Mi, la tierce de Cmaj7 : tenue, cette friction sonne dissonante.",xp:30},
  {id:"q-harm-42",courseId:"harmony",lessonId:"harm-c4-02",lvl:2,q:"Pourquoi le Fa frotte-t-il sur Cmaj7 ?",o:["Il touche le Mi, à un demi-ton","Il est à une quinte juste de Mi","Il n'appartient pas à Do majeur","Il double la fondamentale"],a:0,exp:"Fa est collé au Mi (3e de l'accord), un demi-ton au-dessus : c'est cette friction qui en fait l'avoid note.",xp:40},
  {id:"q-harm-43",courseId:"harmony",lessonId:"harm-c4-02",lvl:1,q:"Comment utiliser le Fa sur Cmaj7 ?",o:["En note tenue sur le temps fort","En passage, vers Mi ou Sol","Jamais, c'est une note interdite","En fin de phrase, pour conclure"],a:1,exp:"En note de passage, courte, qui ressort aussitôt sur Mi ou Sol : la tension se crée puis se résout.",xp:30},
];
