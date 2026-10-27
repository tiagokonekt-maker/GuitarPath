// Leçon du module « harmony » + les questions de quiz qui s'y rattachent.
// Format « leçon en cartes » décrit dans src/content/README.md.

export default {
  id: "harm-c5-02", level: 7,
  title: "Le chiffrage romain et le système Nashville",
  duration: 8,
  gropiTip: "Joue 1-5-6m-4 en Sol (Sol-Ré-Mim-Do), puis enchaîne les mêmes chiffres en La : La-Mi-Fa#m-Ré. Quand ça vient sans réfléchir, tu penses déjà en Nashville.",
  cartes: [
    { type: "idee", titre: "Parler en degrés", texte: [
      "Le chiffrage romain décrit une grille sans nommer la tonalité : I tonique, IV sous-dominante, V dominante.",
      "Majuscule = majeur, minuscule = mineur, ° = diminué. « I-V-vi-IV » se comprend dans n'importe quelle tonalité.",
    ], bloc: {
      type: "degree_chart",
      caption: "Chiffrage romain (gauche) ↔ système Nashville (droite)",
      data: {
        boxes: [
          { top: "I",    label: "Tonique — majeur",       sub: "1",  tint: "green" },
          { top: "ii",   label: "Sus-tonique — mineur",    sub: "2m", tint: "neutral" },
          { top: "iii",  label: "Médiante — mineur",       sub: "3m", tint: "neutral" },
          { top: "IV",   label: "Sous-dominante — majeur", sub: "4",  tint: "amber" },
          { top: "V",    label: "Dominante — majeur",      sub: "5",  tint: "coral" },
          { top: "vi",   label: "Sus-dominante — mineur",  sub: "6m", tint: "neutral" },
          { top: "vii°", label: "Sensible — diminué",      sub: "7°", tint: "neutral" },
        ],
      },
    } },
    { type: "idee", titre: "Le système Nashville", texte: [
      "Les musiciens de studio de Nashville ont simplifié l'idée avec des chiffres arabes : 1, 2m, 3m, 4, 5, 6m, 7°.",
      "I-V-vi-IV s'écrit 1-5-6m-4. Une feuille de chiffres suffit pour jouer une chanson dans n'importe quelle tonalité.",
    ] },
    { type: "question", quizId: "q-harm-14" },
    { type: "idee", titre: "Transposer sans effort", texte: [
      "Le chanteur veut monter d'un ton ? Les chiffres ne changent pas : seule la tonalité de départ bouge.",
      "1-5-6m-4 en Sol : Sol, Ré, Mim, Do. Un ton plus haut, en La : La, Mi, Fa#m, Ré.",
    ] },
    { type: "question", quizId: "q-harm-p7-c502-01" },
    { type: "idee", titre: "Quatre grilles à connaître", texte: [
      "1-4-5 : blues, rock'n'roll, country. 1-5-6m-4 : la pop. 2m-5-1 : le jazz. 1-6m-4-5 : les ballades des années 50.",
      "Elles couvrent une immense partie du répertoire.",
    ] },
    { type: "question", quizId: "q-harm-p7-c502-02" },
    { type: "idee", titre: "Et en mineur ?", texte: [
      "La tonique devient i. Am-F-C-G en La mineur s'analyse i-♭VI-♭III-♭VII.",
      "Les ♭ se mesurent par rapport à La majeur : ce sont simplement les degrés naturels de la gamme mineure, rien n'est emprunté.",
    ] },
    { type: "a-toi", titre: "Une grille, trois tonalités",
      consigne: "Joue 1-5-6m-4 en Sol (Sol Ré Mim Do), puis en La (La Mi Fa#m Ré), puis en Ré (Ré La Sim Sol), une mesure par accord au clic. Dis les chiffres en jouant. Puis capo case 2 sur la version en Sol : mêmes doigtés, tu sonnes en La.",
      bloc: {
        type: "chord_diagram",
        caption: "Fa#m — barré forme de Mi mineur, case 2 (le 6m de La)",
        data: { name: "F#m", frets: [2,4,4,2,2,2], fingers: [1,3,4,1,1,1], startFret: 1 },
      }, bpm: 70, minuteur: 180 },
    { type: "recap", points: [
      "Chiffrage romain : majuscule majeur, minuscule mineur, ° diminué.",
      "Nashville : 1, 2m, 3m, 4, 5, 6m, 7° ; I-V-vi-IV = 1-5-6m-4.",
      "Pour transposer, garde les chiffres et change seulement la tonique.",
    ] },
  ],
  quiz: ["q-harm-14","q-harm-04","q-harm-07","q-harm-p7-c502-01","q-harm-p7-c502-02"],
};

export const quiz = [
  {id:"q-harm-14",courseId:"harmony",lessonId:"harm-c5-02",lvl:3,q:"En chiffrage Nashville, la progression '1-6-4-5' en Sol donne…",o:["Sol-La-Do-Ré","Sol-Mim-Do-Ré","Sol-Mim-Lam-Ré","Sol-Si-Do-Ré"],a:1,exp:"En Sol : 1=Sol(maj), 6=Mim, 4=Do(maj), 5=Ré(maj). Donc Sol-Mim-Do-Ré. Le doo-wop classique des années 50.",xp:50},
  {id:"q-harm-p7-c502-01",courseId:"harmony",lessonId:"harm-c5-02",lvl:2,q:"Ta grille 1-5-6m-4 est en Do. Le chanteur demande un ton plus haut : que joues-tu ?",o:["Ré-La-Sim-Sol","Ré-Sol-Sim-La","Do#-Sol#-La#m-Fa#","Mi-Si-Do#m-La"],a:0,exp:"Un ton au-dessus de Do : Ré. En Ré, 1 = Ré, 5 = La, 6m = Sim, 4 = Sol. Les chiffres restent, seule la tonique change.",xp:45},
  {id:"q-harm-p7-c502-02",courseId:"harmony",lessonId:"harm-c5-02",lvl:2,q:"En La majeur, que donne la grille Nashville 1-4-5 ?",o:["La-Ré-Mi","La-Do#m-Mi","La-Sim-Mi","La-Ré-Fa#m"],a:0,exp:"En La majeur : 1 = La, 4 = Ré, 5 = Mi. La grille du blues et du rock’n’roll.",xp:40},
];
