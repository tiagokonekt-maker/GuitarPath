// Leçon du module « debut » + les questions de quiz qui s'y rattachent.
// Format « leçon en cartes » décrit dans src/content/README.md.
//
// Bloc `tab` : `data.lines` = les 6 lignes ASCII (corde 1 en haut), pour un
// rendu en police à chasse fixe ; `text` = la même tab dite en mots, lue par
// les lecteurs d'écran (TabBlock, src/diagrams.jsx).

export default {
  id: "debut-c3-01", level: 0, unite: 3,
  title: "Lire une tablature",
  duration: 7,
  gropiTip: "Méfie-toi des nombres à deux chiffres : « 12 » sur une ligne veut dire case 12, pas case 1 puis case 2. Un nombre collé se lit toujours d'un bloc.",
  cartes: [
    { type: "idee", titre: "La tab : une corde, une case", texte: [
      "La tablature (ou « tab ») est la façon la plus répandue d'écrire la guitare. Pas besoin de solfège : elle dit sur quelle corde et quelle case poser le doigt.",
    ] },
    { type: "idee", titre: "Six lignes = six cordes", texte: [
      "Une ligne par corde. En HAUT, la corde la plus fine (corde 1, Mi aigu) ; en BAS, la plus grosse (corde 6, Mi grave).",
      "C'est l'inverse de ce que tu vois en baissant les yeux : retiens « en haut = aigu ». Les lettres e B G D A E nomment les cordes.",
    ] },
    { type: "question", quizId: "q-debut-42" },
    { type: "idee", titre: "Les chiffres = les cases", texte: [
      "Un chiffre sur une ligne = la case à jouer sur cette corde : 0 = à vide, 3 = case 3, 12 = case 12. On lit de gauche à droite.",
      "La tab ne dit pas quel doigt utiliser : en général, un doigt par case.",
    ] },
    { type: "question", quizId: "q-debut-43" },
    { type: "a-toi", titre: "Ta première tab", consigne: "Corde 1 à vide (Mi), case 1 (Fa), case 3 (Sol), case 1, à vide. Écoute-la avec le bouton, puis joue-la lentement : tu viens de lire ta première tablature.", bloc: {
      type: "tab",
      caption: "Trois notes sur la corde 1 : Mi, Fa, Sol, puis retour",
      text: "Tab — corde 1 (ligne du haut) : 0, 1, 3, 1, 0. Soit Mi à vide, Fa en case 1, Sol en case 3, Fa, Mi.",
      data: { lines: [
        "e|-0---1---3---1---0---|",
        "B|---------------------|",
        "G|---------------------|",
        "D|---------------------|",
        "A|---------------------|",
        "E|---------------------|",
      ] },
    } },
    { type: "idee", titre: "Chiffres empilés = accord", texte: [
      "Des chiffres alignés verticalement se jouent en même temps : c'est un accord.",
      "Ici, tu reconnais Mi mineur : cordes 5 et 4 en case 2, toutes les autres à vide.",
    ], bloc: {
      type: "tab",
      caption: "Mi mineur écrit en tablature : les chiffres empilés se jouent ensemble",
      text: "Tab — de la corde 1 à la corde 6 : 0, 0, 0, 2, 2, 0, joués en même temps. C'est Mi mineur (022000 lu de la corde 6 à la corde 1).",
      data: { lines: [
        "e|--0--|",
        "B|--0--|",
        "G|--0--|",
        "D|--2--|",
        "A|--2--|",
        "E|--0--|",
      ] },
    } },
    { type: "question", quizId: "q-debut-44" },
    { type: "idee", titre: "Et le rythme ?", texte: [
      "La tab donne les notes, pas leur durée exacte. L'espacement en donne une idée ; les barres « | » séparent les mesures.",
      "Écoute d'abord le morceau, lis ensuite. Outils → Tablature joue une tab au tempo de ton choix.",
    ] },
    { type: "recap", points: [
      "Ligne du haut = corde 1 (aigu), ligne du bas = corde 6 (grave).",
      "Un chiffre = une case, 0 = corde à vide ; des chiffres empilés = un accord.",
      "La tab ne donne pas les durées : écoute le morceau.",
    ] },
  ],
  quiz: ["q-debut-42", "q-debut-43", "q-debut-44", "q-debut-45"],
};

export const quiz = [
  {id:"q-debut-42",courseId:"debut",lessonId:"debut-c3-01",lvl:1,q:"Dans une tablature, que représente la ligne du haut ?",o:["La corde de Mi grave (corde 6)","La corde de Mi aigu (corde 1)","Le rythme du morceau","La corde de Sol"],a:1,exp:"En haut = aigu : la ligne du haut est la corde 1 (Mi aigu), celle du bas la corde 6 (Mi grave). C'est l'inverse de ce qu'on voit en regardant son manche.",xp:25},
  {id:"q-debut-43",courseId:"debut",lessonId:"debut-c3-01",lvl:1,q:"Un 0 sur une ligne de tablature signifie…",o:["Une pause","Jouer la corde à vide","Ne pas jouer la corde","Jouer la case 10"],a:1,exp:"0 = corde à vide, sans poser de doigt. Les autres chiffres indiquent la case à jouer sur cette corde.",xp:25},
  {id:"q-debut-44",courseId:"debut",lessonId:"debut-c3-01",lvl:1,q:"Plusieurs chiffres sont alignés verticalement. Comment les joue-t-on ?",o:["Un par un, de haut en bas","En même temps, comme un accord","Un par un, de bas en haut","On choisit l'un d'eux"],a:1,exp:"Des chiffres empilés se jouent ensemble : c'est la façon d'écrire un accord en tablature.",xp:25},
  {id:"q-debut-45",courseId:"debut",lessonId:"debut-c3-01",lvl:2,q:"Quelle information une tablature classique ne donne-t-elle PAS précisément ?",o:["La corde à jouer","La case à jouer","La durée exacte des notes","L'ordre des notes"],a:2,exp:"La tab donne la corde, la case et l'ordre. Le rythme n'est suggéré que par l'espacement : pour la durée exacte, il faut écouter le morceau.",xp:30},
];
