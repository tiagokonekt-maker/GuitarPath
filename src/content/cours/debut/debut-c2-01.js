// Leçon du module « debut » + les questions de quiz qui s'y rattachent.
// Format décrit dans src/content/README.md.

export default {
  id: "debut-c2-01", level: 0, unite: 2,
  title: "Lire un diagramme d'accord",
  duration: 5,
  gropiTip: "Mini-défi : écris Mi mineur en chiffres sans regarder (022000), puis devine ce que donne 000000. Réponse : les six cordes à vide, Mi La Ré Sol Si Mi !",
  content: [
    { type: "p", text: "Un accord, c'est plusieurs notes jouées en même temps. Pour savoir où poser les doigts, les guitaristes utilisent un petit schéma : le diagramme d'accord. Tu en verras partout, dans cette app, dans les recueils de chansons, sur les sites de partitions. Une fois qu'on sait le lire, c'est une affaire de secondes." },
    { type: "h", text: "Le manche vu de face" },
    { type: "p", text: "Imagine ta guitare posée debout devant toi, cordes face à toi. Les lignes verticales sont les 6 cordes : la corde 6 (Mi grave) à gauche, la corde 1 (Mi aigu) à droite. Les lignes horizontales sont les frettes. Le trait épais tout en haut, c'est le sillet : la case 1 est juste en dessous, puis la case 2, et ainsi de suite." },
    { type: "chord_diagram", caption: "Mi mineur (Em) — exemple de diagramme", data: { name: "Em", frets: [0, 2, 2, 0, 0, 0], fingers: [0, 2, 3, 0, 0, 0], startFret: 1 } },
    { type: "h", text: "Les symboles" },
    { type: "p", text: "Un rond plein sur une corde = un doigt à poser à cet endroit. Le chiffre dans le rond = le doigt à utiliser (1 index, 2 majeur, 3 annulaire, 4 auriculaire). Un petit cercle vide au-dessus du sillet = la corde se joue à vide, sans doigt, et doit sonner. Une croix au-dessus d'une corde = cette corde ne doit pas être jouée." },
    { type: "p", text: "Lis le diagramme de Mi mineur ci-dessus : majeur (2) sur la corde 5, case 2 ; annulaire (3) sur la corde 4, case 2 ; les quatre autres cordes à vide. On gratte les six cordes." },
    { type: "h", text: "La notation en chiffres" },
    { type: "p", text: "On écrit souvent un accord en une ligne de six caractères, de la corde 6 à la corde 1 : un chiffre = la case, 0 = corde à vide, x = corde non jouée. Mi mineur s'écrit donc 022000. Pratique pour noter un accord sans dessin." },
    { type: "tip", text: "Les noms d'accords existent en français et en anglais : Do = C, Ré = D, Mi = E, Fa = F, Sol = G, La = A, Si = B. Un petit « m » après le nom signifie mineur : Em = Mi mineur, Am = La mineur. Tu peux écouter n'importe quel accord dans Outils → Accords avant de le jouer." },
  ],
  quiz: ["q-debut-22", "q-debut-23", "q-debut-24"],
};

export const quiz = [
  {id:"q-debut-22",courseId:"debut",lessonId:"debut-c2-01",lvl:1,q:"Sur un diagramme d'accord, que signifie une croix au-dessus d'une corde ?",o:["La corde se joue à vide","Cette corde ne doit pas être jouée","Il faut poser l'index sur cette corde","La corde doit être jouée plus fort"],a:1,exp:"Une croix = corde non jouée (on l'évite avec le médiator, ou on l'étouffe). Un petit cercle vide = corde jouée à vide.",xp:25},
  {id:"q-debut-23",courseId:"debut",lessonId:"debut-c2-01",lvl:1,q:"Sur un diagramme d'accord vertical, où se trouve la corde de Mi grave ?",o:["Tout à gauche","Tout à droite","En haut","Au milieu"],a:0,exp:"Le diagramme montre le manche debout, vu de face : corde 6 (Mi grave) à gauche, corde 1 (Mi aigu) à droite, sillet en haut.",xp:25},
  {id:"q-debut-24",courseId:"debut",lessonId:"debut-c2-01",lvl:2,q:"Que signifie la notation x32010 ?",o:["Corde 6 non jouée, corde 5 case 3, corde 4 case 2, corde 3 à vide, corde 2 case 1, corde 1 à vide","Les doigts à utiliser, de l'index à l'auriculaire","Corde 1 non jouée, corde 2 case 3, corde 3 case 2, corde 4 à vide, corde 5 case 1, corde 6 à vide","Un rythme : un silence puis cinq coups"],a:0,exp:"On lit de la corde 6 à la corde 1 : x = non jouée, chiffre = case, 0 = à vide. x32010, c'est l'accord de Do que tu apprendras bientôt.",xp:30},
];
