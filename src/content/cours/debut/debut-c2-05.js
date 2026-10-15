// Leçon du module « debut » + les questions de quiz qui s'y rattachent.
// Format décrit dans src/content/README.md.

export default {
  id: "debut-c2-05", level: 0, unite: 2,
  title: "Tes premières rythmiques",
  duration: 7,
  content: [
    { type: "p", text: "Un accord, c'est une couleur. La rythmique, c'est ce qui le fait danser. Avec trois rythmiques simples, tes accords vont commencer à ressembler à de la vraie musique. On travaille sur un seul accord (Mi mineur, par exemple) pour que la main gauche se fasse oublier." },
    { type: "h", text: "Rythmique 1 : quatre coups vers le bas" },
    { type: "strum_pattern", caption: "4 noires vers le bas — compte « 1, 2, 3, 4 »", data: { pattern: ["B", "B", "B", "B"], beats: 4, style: "folk", bpm: 60 } },
    { type: "p", text: "Un coup vers le bas sur chaque temps. Compte à voix haute « 1, 2, 3, 4 » et gratte en même temps que tu dis chaque chiffre. Simple, mais c'est la base de tout : un rythme régulier, sans accélérer." },
    { type: "h", text: "Rythmique 2 : bas-haut en continu" },
    { type: "strum_pattern", caption: "8 croches — bas sur les temps, haut sur les « et »", data: { pattern: ["B", "H", "B", "H", "B", "H", "B", "H"], beats: 4, style: "folk", bpm: 60 } },
    { type: "p", text: "On ajoute un coup vers le haut entre chaque temps. Compte « 1 et 2 et 3 et 4 et » : vers le bas sur les chiffres, vers le haut sur les « et ». Le coup vers le haut peut être plus léger et ne toucher que les cordes aiguës, c'est normal et ça sonne bien." },
    { type: "h", text: "Rythmique 3 : la rythmique « passe-partout »" },
    { type: "strum_pattern", caption: "Bas, bas-haut, haut-bas-haut — la main ne s'arrête jamais", data: { pattern: ["B", "-", "B", "H", "-", "H", "B", "H"], beats: 4, style: "folk", bpm: 70 } },
    { type: "p", text: "Bas, bas-haut, haut-bas-haut. Le secret : ta main continue exactement le même mouvement de balancier que dans la rythmique 2, bas sur les temps, haut sur les « et ». Simplement, elle ne touche pas les cordes à deux endroits : sur le « et » du 1 et sur le temps 3, elle passe dans le vide. C'est ce qui crée le petit balancement, et c'est une des rythmiques les plus utilisées en pop et en folk." },
    { type: "h", text: "La règle d'or : le balancier ne s'arrête jamais" },
    { type: "p", text: "Ta main droite est un pendule : elle descend sur les temps et remonte sur les « et », que tu touches les cordes ou non. Si tu t'arrêtes pour « attendre » le prochain coup, tu perds le rythme. Garde le mouvement régulier et contente-toi de rater les cordes quand il le faut." },
    { type: "tip", text: "Utilise le métronome (Outils → Métronome), réglé lentement : 60 à 70 BPM. Joue chaque rythmique pendant une minute sans t'arrêter avant d'accélérer. Quand c'est fluide sur un accord, essaie en changeant d'accord toutes les deux mesures." },
  ],
  quiz: ["q-debut-36", "q-debut-37", "q-debut-38"],
};

export const quiz = [
  {id:"q-debut-36",courseId:"debut",lessonId:"debut-c2-05",lvl:1,q:"En comptant « 1 et 2 et 3 et 4 et », quand grattes-tu vers le haut ?",o:["Sur les chiffres","Sur les « et »","Seulement sur le 1","Jamais, on gratte toujours vers le bas"],a:1,exp:"Bas sur les temps (les chiffres), haut sur les « et ». C'est le mouvement de balancier de base de la main droite.",xp:25},
  {id:"q-debut-37",courseId:"debut",lessonId:"debut-c2-05",lvl:2,q:"Dans la rythmique bas, bas-haut, haut-bas-haut, que fait la main sur le temps 3 ?",o:["Elle s'arrête et attend","Elle descend sans toucher les cordes","Elle gratte deux fois","Elle étouffe les cordes avec la paume"],a:1,exp:"Le balancier continue : la main descend sur le 3 comme d'habitude, mais passe dans le vide. C'est ce qui garde le rythme régulier.",xp:30},
  {id:"q-debut-38",courseId:"debut",lessonId:"debut-c2-05",lvl:1,q:"À quel tempo travailler une nouvelle rythmique ?",o:["Le plus vite possible","Lentement, vers 60 à 70 BPM, puis accélérer","Au tempo de la chanson originale, tout de suite","Sans métronome, au feeling"],a:1,exp:"Lentement et régulièrement d'abord. La vitesse vient toute seule quand le geste est fluide ; l'inverse ne marche pas.",xp:25},
];
