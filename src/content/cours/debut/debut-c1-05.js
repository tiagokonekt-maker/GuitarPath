// Leçon du module « debut » + les questions de quiz qui s'y rattachent.
// Format décrit dans src/content/README.md.

export default {
  id: "debut-c1-05", level: 0, unite: 1,
  title: "Les cordes et l'accordeur",
  duration: 7,
  content: [
    { type: "p", text: "Une guitare désaccordée sonne faux même si tes doigts sont parfaitement placés. C'est frustrant, et c'est la cause n°1 des « je n'y arrive pas » des débutants. Bonne nouvelle : accorder prend une minute, et l'app a un accordeur intégré. Mais d'abord, il faut connaître le nom de tes cordes." },
    { type: "h", text: "Mi, La, Ré, Sol, Si, Mi" },
    { type: "p", text: "Les cordes sont numérotées de la plus fine à la plus grosse. La corde 1 est la plus fine (la plus aiguë), la plus proche du sol quand tu joues. La corde 6 est la plus grosse (la plus grave), la plus proche de ton visage. En partant de la plus grosse, elles s'appellent : Mi (corde 6), La (corde 5), Ré (corde 4), Sol (corde 3), Si (corde 2), Mi (corde 1). Il y a donc deux Mi : le Mi grave et le Mi aigu, à deux octaves d'écart." },
    { type: "p", text: "Une phrase pour s'en souvenir, de la plus grosse à la plus fine : « Mon Lapin Ronge Sept Salades Mûres ». Et comme beaucoup d'accordeurs utilisent la notation anglaise, retiens aussi la correspondance : Mi = E, La = A, Ré = D, Sol = G, Si = B. Les cordes à vide donnent donc E A D G B E." },
    { type: "h", text: "Accorder avec l'accordeur de l'app" },
    { type: "p", text: "Ouvre Outils, puis Accordeur, et autorise le micro. Joue une seule corde à vide et laisse-la sonner. L'accordeur affiche la note qu'il entend et te dit si elle est trop basse ou trop haute. Trop basse : tourne la mécanique (la clé de la tête du manche) pour tendre la corde. Trop haute : détends-la. Va doucement, un petit quart de tour change déjà beaucoup la note." },
    { type: "p", text: "Vérifie toujours que l'accordeur affiche la BONNE note pour la corde : si tu accordes la corde 5 et qu'il affiche Si (B) ou Sol (G), tu es loin du compte. Ne tends jamais une corde au hasard en espérant tomber juste : une corde trop tendue peut casser." },
    { type: "tip", text: "Astuce de pro : approche toujours la note par en dessous. Si tu dépasses, redescends un peu en dessous puis remonte jusqu'à la note. Une corde accordée en montant tient mieux l'accord qu'une corde accordée en descendant." },
    { type: "h", text: "Quand réaccorder ?" },
    { type: "p", text: "Au début de chaque séance, systématiquement. Après un changement de cordes : des cordes neuves se détendent pendant plusieurs jours, il faut les réaccorder souvent. Après un changement de température ou d'humidité (la guitare rapportée du froid, une pièce surchauffée). Et dès que tes accords sonnent faux alors que tes doigts sont bien placés : vérifie l'accordage avant de douter de toi." },
  ],
  quiz: ["q-debut-14", "q-debut-15", "q-debut-16", "q-debut-17"],
};

export const quiz = [
  {id:"q-debut-14",courseId:"debut",lessonId:"debut-c1-05",lvl:1,q:"De la plus grosse corde à la plus fine, quels sont les noms des cordes à vide ?",o:["Mi La Ré Sol Si Mi","Mi Si Sol Ré La Mi","Do Ré Mi Fa Sol La","Mi La Ré Sol Do Mi"],a:0,exp:"Mi (6), La (5), Ré (4), Sol (3), Si (2), Mi (1). Moyen mnémotechnique : « Mon Lapin Ronge Sept Salades Mûres ».",xp:25},
  {id:"q-debut-15",courseId:"debut",lessonId:"debut-c1-05",lvl:1,q:"Laquelle est la corde 1 ?",o:["La plus grosse, la plus grave","La plus fine, la plus aiguë","Celle du milieu, accordée en Sol","Celle accordée en La"],a:1,exp:"La numérotation part de la corde la plus fine : la corde 1 est le Mi aigu, la corde 6 le Mi grave.",xp:25},
  {id:"q-debut-16",courseId:"debut",lessonId:"debut-c1-05",lvl:1,q:"L'accordeur indique que ta corde est trop basse. Que fais-tu ?",o:["Tu tends la corde avec la mécanique","Tu détends la corde avec la mécanique","Tu appuies plus fort avec la main gauche","Tu changes de corde"],a:0,exp:"Plus une corde est tendue, plus elle sonne aigu. Trop basse : on la tend, doucement, en surveillant l'accordeur.",xp:25},
  {id:"q-debut-17",courseId:"debut",lessonId:"debut-c1-05",lvl:2,q:"En notation anglaise, que donnent les six cordes à vide, de la corde 6 à la corde 1 ?",o:["A B C D E F","E A D G B E","E B G D A E","C D E F G A"],a:1,exp:"Mi = E, La = A, Ré = D, Sol = G, Si = B : E A D G B E. Beaucoup d'accordeurs affichent ces lettres.",xp:30},
];
