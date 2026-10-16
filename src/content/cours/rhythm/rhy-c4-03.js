// Leçon du module « rhythm » + les questions de quiz qui s'y rattachent.
// Format « leçon en cartes » décrit dans src/content/README.md.

export default {
  id: "rhy-c4-03", level: 6,
  title: "Le palm mute : étouffer pour créer du groove",
  duration: 7,
  gropiTip: "Si ton palm mute tue complètement la note, recule un peu la paume vers le chevalet. Tu dois encore entendre la hauteur de la note, juste raccourcie, pas un simple « tchk ».",
  cartes: [
    { type: "idee", titre: "La paume sur le chevalet", texte: [
      "Pose le tranchant de la paume droite, la partie charnue côté petit doigt, sur les cordes, juste devant le chevalet. Pression légère.",
      "Trop près du chevalet, le son reste ouvert. Trop loin vers le manche, il s'éteint. Cherche l'endroit où la note sonne courte, mais sonne.",
    ] },
    { type: "idee", titre: "Le son « chunk »", texte: [
      "Palm mute = notes courtes, percussives, peu de sustain. Avec de la distorsion, c'est le riff rock ou metal compact ; en son clair, une rythmique country ou funk.",
      "Alterner notes étouffées et notes ouvertes crée un contraste puissant.",
    ] },
    { type: "question", quizId: "q-rhy-46" },
    { type: "idee", titre: "Doser l'étouffement", texte: [
      "Plus de pression ou une paume plus avancée : le son raccourcit. PM léger, la note garde un peu de sustain ; PM fort, ce n'est presque plus qu'un clic.",
      "Tu peux ainsi nuancer un même riff : léger au couplet, ouvert au refrain.",
    ] },
    { type: "idee", titre: "Lire un palm mute", texte: [
      "En tablature : « PM » ou « P.M. », avec une ligne pointillée sous les notes concernées.",
      "Le schéma de base du rock : étouffé sur 1, 2, 3, puis une note ouverte sur le 4 pour l'accent.",
    ], bloc: {
      type: "strum_pattern",
      caption: "Drill palm mute — PM (×) sur 1, 2, 3, note ouverte (B) sur le 4",
      data: { pattern: ["x","x","x","B"], beats: 4, style: "rock", bpm: 80 },
    } },
    { type: "question", quizId: "q-rhy-47" },
    { type: "a-toi", titre: "Ton riff en palm mute",
      consigne: "Tout en coups vers le bas, à 80 BPM : six Mi graves étouffés, en croches, puis E5 ouvert, laissé sonner. Boucle deux minutes. Vérifie que chaque Mi étouffé garde sa hauteur.",
      bloc: {
        type: "tab",
        caption: "PM sur les six Mi graves, puis E5 ouvert (corde 6 à vide + corde 5 case 2)",
        text: "Tab — corde 6 à vide six fois en palm mute, puis E5 sans palm mute : corde 6 à vide et corde 5 case 2 ensemble.",
        data: { lines: [
          "e|-------------------------|",
          "B|-------------------------|",
          "G|-------------------------|",
          "D|-------------------------|",
          "A|-------------------2-----|",
          "E|-0--0--0--0--0--0--0-----|",
        ] },
      }, bpm: 80, minuteur: 120 },
    { type: "idee", titre: "Chug et scratch", texte: [
      "En metal, le « chug » : des coups très rapprochés sur des cordes graves fortement étouffées, presque une caisse claire.",
      "En funk, autre geste : c'est la main gauche qui étouffe toutes les cordes, et le médiator frappe un « scratch » court. Même effet, autre technique.",
    ] },
    { type: "question", quizId: "q-rhy-48" },
    { type: "recap", points: [
      "Tranchant de la paume juste devant le chevalet, pression légère.",
      "Plus ou moins de pression : la note s'écourte, mais garde sa hauteur.",
      "En tab : « PM » et une ligne pointillée ; le scratch funk étouffe à la main gauche.",
    ] },
  ],
  quiz: ["q-rhy-46", "q-rhy-47", "q-rhy-48"],
};

export const quiz = [
  {id:"q-rhy-46",courseId:"rhythm",lessonId:"rhy-c4-03",lvl:1,q:"Où pose-t-on la paume pour un palm mute ?",o:["Sur les cordes, au milieu du manche, en appuyant", "Sur les cordes, juste avant le chevalet", "Sur les frettes, près de la tête", "Sous les cordes, contre la rosace"],a:1,exp:"Le bord de la paume se pose juste avant le chevalet, avec une pression légère : assez pour étouffer, pas assez pour tuer tout le sustain.",xp:30},
  {id:"q-rhy-47",courseId:"rhythm",lessonId:"rhy-c4-03",lvl:1,q:"Comment le palm mute se note-t-il dans une tablature ?",o:["Un « x » à la place du numéro de case", "Un « h » entre deux notes", "Une flèche vers le haut", "« PM » avec une ligne pointillée"],a:3,exp:"« PM » (ou « P.M. »), avec une ligne pointillée sous les notes concernées. Le « x » note une note étouffée, ce n'est pas la même chose.",xp:30},
  {id:"q-rhy-48",courseId:"rhythm",lessonId:"rhy-c4-03",lvl:2,q:"En funk, avec quoi étouffe-t-on surtout les cordes pour le « scratch » ?",o:["La paume droite, posée près du chevalet", "Le pouce, sur la corde grave", "La main gauche, posée sur les cordes", "Un chiffon glissé sous les cordes"],a:2,exp:"En funk, c'est la main gauche (souvent l'index) qui étouffe toutes les cordes ; le médiator frappe ces cordes étouffées : un « scratch » court et percussif.",xp:40},
];
