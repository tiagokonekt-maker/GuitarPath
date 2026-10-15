// Leçon du module « rhythm » + les questions de quiz qui s'y rattachent.
// Format décrit dans src/content/README.md.

export default {
  id: "rhy-c2-02", level: 4,
  title: "Croches et doubles-croches",
  duration: 10,
  gropiTip: "Dis les syllabes à voix haute avant de jouer : « 1 e et a » à 60 BPM. Ta main descend sur le chiffre et le « et », remonte sur le « e » et le « a ». Toujours dans cet ordre.",
  content: [
    { type: "p", text: "Les croches et doubles-croches sont les valeurs les plus utilisées en musique populaire. Elles permettent de créer le groove, les riffs, les fills rythmiques. Maîtriser leur placement et leur comptage, c'est débloquer l'accès à la quasi-totalité des patterns rythmiques de la guitare pop, rock et blues." },
    { type: "h", text: "La croche : 1/2 temps" },
    { type: "p", text: "La croche vaut la moitié d'une noire. Dans une mesure de 4/4, il y a 8 croches. On les compte : '1 et 2 et 3 et 4 et'. Les chiffres (1, 2, 3, 4) tombent sur les temps forts. Les 'et' tombent entre les temps, sur les contretemps. Cette façon de compter est universelle chez les musiciens anglophones ('one and two and three and four and')." },
    {
      type: "rhythm_grid",
      caption: "1 mesure de croches en 4/4",
      data: {
        beats: 4, subdivision: 8,
        accents: [0, 2, 4, 6],
        label: "1 · et · 2 · et · 3 · et · 4 · et",
      },
    },
    { type: "h", text: "La double-croche : 1/4 temps" },
    { type: "p", text: "La double-croche vaut la moitié d'une croche. Dans une mesure de 4/4, il y a 16 doubles-croches. On les compte : '1 e et a 2 e et a 3 e et a 4 e et a'. Soit '1-ee-and-a' (en anglais 'one-e-and-a'). Les chiffres tombent sur les temps, les 'e' et 'a' subdivisent encore plus finement." },
    {
      type: "rhythm_grid",
      caption: "1 mesure de doubles-croches en 4/4",
      data: {
        beats: 4, subdivision: 16,
        accents: [0, 4, 8, 12],
        label: "1 e et a · 2 e et a · 3 e et a · 4 e et a",
      },
    },
    { type: "h", text: "La main droite continue" },
    { type: "p", text: "Secret fondamental pour jouer les croches et doubles-croches : la main droite (celle qui joue) doit continuer son mouvement pendulaire (bas-haut) même quand elle ne touche pas les cordes. C'est comme un essuie-glace qui bouge en permanence. Les notes sonnent quand la main touche les cordes, mais le mouvement ne s'arrête jamais. Cette continuité est la clé du groove." },
    { type: "h", text: "Le strumming en croches" },
    { type: "p", text: "En 4/4, strumming en croches : bas sur chaque chiffre (1, 2, 3, 4), haut sur chaque 'et'. Bas-haut-bas-haut-bas-haut-bas-haut. La main ne s'arrête jamais. Les coups 'haut' sont aussi importants que les coups 'bas'. Pratique ça lentement (60 BPM) avec un accord simple (Am) jusqu'à ce que la régularité soit parfaite." },
    { type: "h", text: "Le strumming en doubles-croches" },
    { type: "p", text: "Base du funk : 16 coups par mesure (8 bas, 8 haut alternés). '1 e et a 2 e et a...' On ne joue pas forcément tous les coups — on 'ouvre' et 'ferme' la main selon le rythme voulu. La main continue son mouvement pendulaire mais ne touche les cordes qu'aux moments sélectionnés. C'est le fondement du strumming funk." },
    { type: "h", text: "Croches vs doubles-croches : entendre la différence" },
    { type: "p", text: "À 100 BPM : 8 croches par mesure sonnent comme un tempo modéré, fluide. 16 doubles-croches par mesure sonnent comme un flux rapide, dense. Le même accord joué dans les deux rythmes crée des ambiances très différentes. Le rock classique utilise souvent les croches (puissance). Le funk utilise les doubles-croches (groove, légèreté)." },
    { type: "ref", text: "'Superstition' (Stevie Wonder, 1972) : le riff de clavicorde joue des doubles-croches syncopées. La batterie aussi. C'est le pattern de doubles-croches qui crée le groove irrésistible. Sur guitare, pour reproduire ce son funk, tu dois penser en doubles-croches : main droite qui bouge en permanence à 16 coups par mesure." },
    { type: "tip", text: "Drill progression : à 70 BPM, joue 2 mesures de noires, 2 de croches, 2 de doubles-croches, puis reviens (doubles-croches → croches → noires). Sans t'arrêter. La transition entre les valeurs doit être fluide. C'est le drill de base de tout professeur de rythme." },
  ],
  quiz: ["q-rhy-01","q-rhy-02","q-rhy-16","q-rhy-17","q-rhy-18"],
};

export const quiz = [
  {id:"q-rhy-01",courseId:"rhythm",lessonId:"rhy-c2-02",lvl:1,q:"Une mesure à 4/4 contient combien de croches ?",o:["4","8","6","16"],a:1,exp:"4/4 = 4 noires par mesure. 1 noire = 2 croches. Donc 8 croches par mesure de 4/4.",xp:25},
  {id:"q-rhy-02",courseId:"rhythm",lessonId:"rhy-c2-02",lvl:2,q:"Combien de doubles-croches dans une mesure de 4/4 ?",o:["8","12","16","24"],a:2,exp:"4/4 = 4 noires. 1 noire = 4 doubles-croches. Donc 16 doubles-croches par mesure.",xp:30},
  {id:"q-rhy-16",courseId:"rhythm",lessonId:"rhy-c2-02",lvl:1,q:"Une croche dure combien par rapport à une noire ?",o:["Le double","La moitié","Le quart","La même chose"],a:1,exp:"Chaque valeur vaut la moitié de la précédente : ronde, blanche, noire, croche, double-croche. Deux croches remplissent exactement un temps en 4/4.",xp:25},
  {id:"q-rhy-17",courseId:"rhythm",lessonId:"rhy-c2-02",lvl:2,q:"Comment compte-t-on à voix haute une mesure de doubles-croches ?",o:["1-et, 2-et, 3-et, 4-et", "1-2-3-4, en accélérant", "1-e-et-a, 2-e-et-a…", "1-2-3, 1-2-3, 1-2-3"],a:2,exp:"Quatre syllabes par temps, une par double-croche. Ce comptage n'est pas décoratif : il donne un nom à chaque emplacement, et c'est ce qui permet de placer une note exactement où tu veux.",xp:30},
  {id:"q-rhy-18",courseId:"rhythm",lessonId:"rhy-c2-02",lvl:3,q:"Une croche pointée suivie d'une double-croche occupe…",o:["Deux temps, soit la moitié d'une mesure","Un temps et demi, comme la blanche pointée","Un demi-temps, comme deux doubles-croches","Un temps, découpé en trois quarts puis un quart"],a:3,exp:"Le point ajoute la moitié de la valeur : la croche pointée vaut trois doubles-croches, la double qui suit en vaut une. Total : un temps. C'est le rythme de base du rock des années 50 et de quantité de riffs.",xp:40},
];
