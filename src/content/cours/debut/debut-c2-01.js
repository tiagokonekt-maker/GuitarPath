// Leçon du module « debut » + les questions de quiz qui s'y rattachent.
// Format « leçon en cartes » décrit dans src/content/README.md.

const EM = { type: "chord_diagram", caption: "Mi mineur (Em) — exemple de diagramme", data: { name: "Em", frets: [0, 2, 2, 0, 0, 0], fingers: [0, 2, 3, 0, 0, 0], startFret: 1 } };

export default {
  id: "debut-c2-01", level: 0, unite: 2,
  title: "Lire un diagramme d'accord",
  duration: 5,
  gropiTip: "Mini-défi : écris Mi mineur en chiffres sans regarder (022000), puis devine ce que donne 000000. Réponse : les six cordes à vide, Mi La Ré Sol Si Mi !",
  cartes: [
    { type: "idee", titre: "Un accord, un schéma", texte: [
      "Un accord, c'est plusieurs notes jouées ensemble. Le diagramme d'accord montre où poser les doigts.",
      "C'est ta guitare debout devant toi, cordes face à toi.",
    ] },
    { type: "idee", titre: "Cordes et frettes", texte: [
      "Les lignes verticales sont les 6 cordes : la 6 (Mi grave) à gauche, la 1 (Mi aigu) à droite. Les lignes horizontales sont les frettes.",
      "Le trait épais en haut, c'est le sillet : la case 1 est juste en dessous.",
    ], bloc: EM },
    { type: "question", quizId: "q-debut-23" },
    { type: "idee", titre: "Ronds, cercles et croix", texte: [
      "Un rond plein = un doigt à poser ; le chiffre dedans = le doigt à utiliser (1 index, 2 majeur, 3 annulaire, 4 auriculaire).",
      "Un petit cercle au-dessus du sillet = corde jouée à vide. Une croix = corde à ne pas jouer.",
    ] },
    { type: "question", quizId: "q-debut-22" },
    { type: "idee", titre: "L'accord en chiffres", texte: [
      "On écrit aussi un accord en six caractères, de la corde 6 à la corde 1 : un chiffre = la case, 0 = à vide, x = corde non jouée. Mi mineur s'écrit 022000.",
      "Noms anglais : Do = C, Ré = D, Mi = E, Fa = F, Sol = G, La = A, Si = B. Un « m » = mineur : Em = Mi mineur.",
    ] },
    { type: "question", quizId: "q-debut-24" },
    { type: "a-toi", titre: "Lis et pose Mi mineur", consigne: "Majeur (2) sur la corde 5 en case 2, annulaire (3) sur la corde 4 en case 2, le reste à vide. Écoute-le avec le bouton, puis pose l'accord et gratte les six cordes.", bloc: EM },
    { type: "recap", points: [
      "Le diagramme montre le manche debout, vu de face : corde 6 à gauche, sillet en haut.",
      "Rond = doigt (avec son numéro), cercle = corde à vide, croix = corde muette.",
      "En chiffres, de la corde 6 à la 1 : Mi mineur = 022000.",
    ] },
  ],
  quiz: ["q-debut-22", "q-debut-23", "q-debut-24"],
};

export const quiz = [
  {id:"q-debut-22",courseId:"debut",lessonId:"debut-c2-01",lvl:1,q:"Sur un diagramme d'accord, que signifie une croix au-dessus d'une corde ?",o:["La corde se joue à vide","Cette corde ne doit pas être jouée","Il faut poser l'index sur cette corde","La corde doit être jouée plus fort"],a:1,exp:"Une croix = corde non jouée (on l'évite avec le médiator, ou on l'étouffe). Un petit cercle vide = corde jouée à vide.",xp:25},
  {id:"q-debut-23",courseId:"debut",lessonId:"debut-c2-01",lvl:1,q:"Sur un diagramme d'accord vertical, où se trouve la corde de Mi grave ?",o:["Tout à gauche","Tout à droite","En haut","Au milieu"],a:0,exp:"Le diagramme montre le manche debout, vu de face : corde 6 (Mi grave) à gauche, corde 1 (Mi aigu) à droite, sillet en haut.",xp:25},
  {id:"q-debut-24",courseId:"debut",lessonId:"debut-c2-01",lvl:2,q:"Que signifie la notation x32010 ?",o:["Corde 6 non jouée, corde 5 case 3, corde 4 case 2, corde 3 à vide, corde 2 case 1, corde 1 à vide","Les doigts à utiliser, de l'index à l'auriculaire","Corde 1 non jouée, corde 2 case 3, corde 3 case 2, corde 4 à vide, corde 5 case 1, corde 6 à vide","Un rythme : un silence puis cinq coups"],a:0,exp:"On lit de la corde 6 à la corde 1 : x = non jouée, chiffre = case, 0 = à vide. x32010, c'est l'accord de Do que tu apprendras bientôt.",xp:30},
];
