// Leçon du module « debut » + les questions de quiz qui s'y rattachent.
// Format décrit dans src/content/README.md.
//
// Bloc `tab` : `data.lines` = les 6 lignes ASCII (corde 1 en haut), pour un
// rendu en police à chasse fixe ; `text` = la même tab dite en mots, affichée
// comme un paragraphe tant que l'écran de leçon ne sait pas rendre ce bloc.

export default {
  id: "debut-c3-01", level: 0, unite: 3,
  title: "Lire une tablature",
  duration: 7,
  content: [
    { type: "p", text: "La tablature (ou « tab ») est la façon la plus répandue d'écrire de la musique pour guitare. Pas besoin de lire le solfège : elle te dit simplement sur quelle corde et sur quelle case poser le doigt. En cinq minutes, tu sauras la lire." },
    { type: "h", text: "Six lignes = six cordes" },
    { type: "p", text: "Une tab, ce sont six lignes horizontales, une par corde. La ligne du HAUT est la corde la plus fine (corde 1, Mi aigu) ; la ligne du BAS est la plus grosse (corde 6, Mi grave). Attention, c'est l'inverse de ce que tu vois quand tu baisses les yeux sur ton manche : retiens « en haut = aigu ». Les lettres au début des lignes rappellent le nom des cordes : e B G D A E." },
    { type: "h", text: "Les chiffres = les cases" },
    { type: "p", text: "Un chiffre posé sur une ligne indique la case à jouer sur cette corde. 0 veut dire corde à vide, 3 veut dire case 3, 12 veut dire case 12. On lit de gauche à droite, comme un texte. La tab ne dit pas quel doigt utiliser : c'est à toi de choisir, en général un doigt par case dans la zone où tu joues." },
    {
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
    },
    { type: "p", text: "Lis cette tab : corde 1 à vide (Mi), puis case 1 (Fa), case 3 (Sol), case 1, et à vide. Joue-la : tu viens de lire ta première tablature." },
    { type: "h", text: "Des chiffres empilés = un accord" },
    { type: "p", text: "Quand plusieurs chiffres sont alignés verticalement, on les joue en même temps : c'est un accord. Ci-dessous, tu reconnais Mi mineur : cordes 5 et 4 en case 2, toutes les autres à vide." },
    {
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
    },
    { type: "h", text: "Et le rythme ?" },
    { type: "p", text: "C'est la grande limite de la tab : elle donne les notes, pas vraiment leur durée. L'espacement entre les chiffres donne une idée (des chiffres serrés = des notes rapprochées), mais ce n'est qu'approximatif. Les barres verticales « | » séparent les mesures. Pour le rythme exact, rien ne remplace l'écoute du morceau : écoute d'abord, lis ensuite." },
    { type: "tip", text: "Tu veux entendre une tab ? Dans Outils → Tablature, tu peux saisir les notes case par case, ou coller une tab texte (menu « ⋯ », « Importer une tab texte »), puis l'écouter au tempo de ton choix." },
  ],
  quiz: ["q-debut-42", "q-debut-43", "q-debut-44", "q-debut-45"],
};

export const quiz = [
  {id:"q-debut-42",courseId:"debut",lessonId:"debut-c3-01",lvl:1,q:"Dans une tablature, que représente la ligne du haut ?",o:["La corde de Mi grave (corde 6)","La corde de Mi aigu (corde 1)","Le rythme du morceau","La corde de Sol"],a:1,exp:"En haut = aigu : la ligne du haut est la corde 1 (Mi aigu), celle du bas la corde 6 (Mi grave). C'est l'inverse de ce qu'on voit en regardant son manche.",xp:25},
  {id:"q-debut-43",courseId:"debut",lessonId:"debut-c3-01",lvl:1,q:"Un 0 sur une ligne de tablature signifie…",o:["Une pause","Jouer la corde à vide","Ne pas jouer la corde","Jouer la case 10"],a:1,exp:"0 = corde à vide, sans poser de doigt. Les autres chiffres indiquent la case à jouer sur cette corde.",xp:25},
  {id:"q-debut-44",courseId:"debut",lessonId:"debut-c3-01",lvl:1,q:"Plusieurs chiffres sont alignés verticalement. Comment les joue-t-on ?",o:["Un par un, de haut en bas","En même temps, comme un accord","Un par un, de bas en haut","On choisit l'un d'eux"],a:1,exp:"Des chiffres empilés se jouent ensemble : c'est la façon d'écrire un accord en tablature.",xp:25},
  {id:"q-debut-45",courseId:"debut",lessonId:"debut-c3-01",lvl:2,q:"Quelle information une tablature classique ne donne-t-elle PAS précisément ?",o:["La corde à jouer","La case à jouer","La durée exacte des notes","L'ordre des notes"],a:2,exp:"La tab donne la corde, la case et l'ordre. Le rythme n'est suggéré que par l'espacement : pour la durée exacte, il faut écouter le morceau.",xp:30},
];
