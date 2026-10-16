// Leçon du module « rhythm » (Rythme & phrasing) + ses questions de quiz.
// Format « leçon en cartes » décrit dans src/content/README.md.
// Technique, 2 sur 4 : le vibrato (poignet ou doigt, largeur, vitesse),
// noté ~ dans une tab. Suite directe du bend (rhy-tech-01) : le vibrato du
// poignet est un tout petit bend répété.

const TAB_VIBRATO = {
  type: "tab",
  caption: "Trois notes tenues avec vibrato, puis un bend avec vibrato",
  text: "Tab — chaque note tenue deux temps avec vibrato : corde 1 case 5 (La), corde 2 case 8 (Sol), corde 3 case 7 (Ré), puis corde 3 case 7 tirée d'un ton jusqu'à la hauteur de la case 9, avec vibrato.",
  data: { lines: [
    "e|5~~~~~----------|----------------|",
    "B|--------8~~~~~--|----------------|",
    "G|----------------|7~~~~~--7b9~~~~-|",
    "D|----------------|----------------|",
    "A|----------------|----------------|",
    "E|----------------|----------------|",
  ] },
};

export default {
  id: "rhy-tech-02", level: 6,
  title: "Le vibrato : faire chanter une note",
  duration: 8,
  gropiTip: "Laisse la note se poser une fraction de seconde avant de lancer le vibrato : attaque nette, puis la note se met à chanter. Le contraste rend le vibrato plus expressif.",
  cartes: [
    { type: "idee", titre: "Une note qui vit", texte: [
      "Le vibrato, c'est une petite variation régulière de la hauteur d'une note tenue. Dans une tab, il s'écrit avec un ou plusieurs ~ après la case : 5~~~.",
      "On le met surtout sur les notes longues et les fins de phrase.",
    ] },
    { type: "idee", titre: "Le vibrato du poignet", texte: [
      "C'est un tout petit bend répété : pouce accroché au-dessus du manche, doigt ferme sur la case, le poignet tourne et revient.",
      "La note monte un peu, puis retombe sur sa hauteur exacte. Elle ne descend jamais en dessous.",
    ] },
    { type: "question", quizId: "q-rhy-vib-01-tech" },
    { type: "idee", titre: "Le vibrato du doigt", texte: [
      "Plus discret : le pouce reste derrière le manche et seul le doigt pousse et relâche la corde, de très peu.",
      "Utile sur les cordes graves, dans un accord ou quand la main ne peut pas pivoter.",
    ] },
    { type: "idee", titre: "Largeur et vitesse", texte: [
      "La largeur, c'est jusqu'où monte la note : d'un soupçon à presque un demi-ton. La vitesse, c'est le nombre d'oscillations.",
      "Cale-la sur le tempo : deux oscillations par temps, puis trois. Lent et large sur une ballade, plus serré sur un rock rapide.",
    ] },
    { type: "question", quizId: "q-rhy-vib-02-tech" },
    { type: "idee", titre: "Sur un bend", texte: [
      "Après un bend, tiens la note visée et relâche-la un tout petit peu, puis repousse-la, en rythme.",
      "La note oscille juste sous la cible et y revient : c'est le son des fins de solos de blues.",
    ], bloc: TAB_VIBRATO },
    { type: "a-toi", titre: "Vibrato au clic",
      consigne: "Chaque note de la tab deux temps au clic à 60 : deux oscillations par clic, au poignet. Recommence avec un vibrato du doigt, puis à trois oscillations par clic. Termine par le bend avec vibrato.",
      bloc: TAB_VIBRATO, bpm: 60, minuteur: 120 },
    { type: "question", quizId: "q-rhy-vib-03-tech" },
    { type: "recap", points: [
      "Vibrato du poignet : pouce au-dessus du manche, la note monte un peu et revient.",
      "Vibrato du doigt : pouce derrière le manche, mouvement plus petit et plus discret.",
      "Largeur et vitesse se règlent sur le tempo et le style ; ~ dans une tab.",
    ] },
  ],
  quiz: ["q-rhy-vib-01-tech", "q-rhy-vib-02-tech", "q-rhy-vib-03-tech"],
};

export const quiz = [
  {id:"q-rhy-vib-01-tech",courseId:"rhythm",lessonId:"rhy-tech-02",lvl:1,q:"Vibrato du poignet : sur quoi la main prend-elle appui pour pivoter ?",o:["Le pouce, au-dessus du manche","Le coude, sur la caisse","L'auriculaire, sur la touche","Le médiator, sur la corde"],a:0,exp:"Comme pour un bend, le pouce accroché au-dessus du manche sert de pivot : le poignet tourne autour de lui.",xp:25},
  {id:"q-rhy-vib-02-tech",courseId:"rhythm",lessonId:"rhy-tech-02",lvl:2,q:"Ton vibrato sonne nerveux sur une ballade lente. Que changes-tu d'abord ?",o:["Tu le ralentis, calé sur le tempo","Tu l'élargis jusqu'à un ton","Tu appuies plus fort sur la case","Tu le lances dès l'attaque"],a:0,exp:"Un vibrato trop rapide pour le tempo sonne crispé. On le cale sur la pulsation (deux oscillations par temps, par exemple) ; la largeur se règle ensuite.",xp:30},
  {id:"q-rhy-vib-03-tech",courseId:"rhythm",lessonId:"rhy-tech-02",lvl:2,q:"Vibrato du poignet sur une note frettée : comment bouge sa hauteur ?",o:["Elle monte un peu, puis revient","Elle descend un peu, puis revient","Elle monte, puis passe en dessous","Elle reste fixe, seul le volume varie"],a:0,exp:"Pousser la corde ne peut que la tendre : la note monte, puis retombe sur sa hauteur de départ, jamais en dessous.",xp:30},
];
