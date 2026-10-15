// Leçon du module « neck » + les questions de quiz qui s'y rattachent.
// Format décrit dans src/content/README.md.

export default {
  id: "neck-c2-01", level: 3,
  title: "Les notes de la corde de Mi grave (corde 6)",
  duration: 10,
  content: [
    { type: "p", text: "On commence l'apprentissage des notes par la corde 6 (Mi grave), qui est ton ancre principale. Cette corde porte la fondamentale de la plupart des accords barrés que tu joues : Sol, La, Si, etc. La maîtriser, c'est déjà avoir une bonne partie du manche en tête." },
    { type: "h", text: "Les notes case par case (0 à 12)" },
    { type: "p", text: "Voici la suite chromatique complète sur la corde 6, de la corde à vide jusqu'à l'octave : Case 0 = Mi. Case 1 = Fa. Case 2 = Fa#. Case 3 = Sol. Case 4 = Sol#. Case 5 = La. Case 6 = La#. Case 7 = Si. Case 8 = Do. Case 9 = Do#. Case 10 = Ré. Case 11 = Ré#. Case 12 = Mi (octave)." },
    { type: "h", text: "Repère les 2 demi-tons naturels" },
    { type: "p", text: "Tu te souviens de la leçon sur les demi-tons naturels ? Ils sont visibles sur le manche : entre Mi (case 0) et Fa (case 1), il n'y a qu'1 case d'écart (1 demi-ton). Et entre Si (case 7) et Do (case 8), même chose. Ailleurs, tu as 2 cases d'écart (1 ton entier) entre les notes naturelles. Cette asymétrie est cohérente sur tout le manche." },
    { type: "h", text: "Méthode 1 : les 4 notes-ancres" },
    { type: "p", text: "Plutôt que de mémoriser les 12 cases par cœur, mémorise d'abord 4 notes-ancres : Mi (0), Sol (3), La (5), Si (7), Do (8), Mi (12). Avec ces points fixes, tu peux déduire les autres notes par voisinage : Fa = juste avant Sol (case 2 → c'est Fa#, et case 1 = Fa). Ré = entre Do (8) et Mi (12), donc case 10." },
    { type: "h", text: "Méthode 2 : les notes naturelles seulement" },
    { type: "p", text: "Apprends d'abord les 7 notes naturelles (sans dièse/bémol) : Mi(0), Fa(1), Sol(3), La(5), Si(7), Do(8), Ré(10), Mi(12). Tu remarques le pattern ? Cases 0, 1, 3, 5, 7, 8, 10, 12. Les écarts sont : 1, 2, 2, 2, 1, 2, 2 — c'est exactement la formule de la gamme majeure (en demi-tons)." },
    {
      type: "note_grid",
      caption: "Corde 6 complète — notes naturelles (colorées) et demi-tons (gris)",
      data: {
        string: 6, stringName: "Mi grave", maxFret: 12,
        highlights: [
          { fret: 0,  label: "Mi",  color: "amber" },
          { fret: 1,  label: "Fa",  color: "green" },
          { fret: 3,  label: "Sol", color: "green" },
          { fret: 5,  label: "La",  color: "amber" },
          { fret: 7,  label: "Si",  color: "green" },
          { fret: 8,  label: "Do",  color: "primary" },
          { fret: 10, label: "Ré",  color: "green" },
          { fret: 12, label: "Mi",  color: "amber" },
        ],
      },
    },
    { type: "h", text: "Application : trouver une note rapidement" },
    { type: "p", text: "Tu cherches La sur la corde 6 ? Case 5 (note-ancre). Tu cherches Do ? Juste après Si (qui est en case 7), donc case 8. Tu cherches Fa# ? Juste après Fa (case 1), donc case 2. Avec les ancres et les voisins, tu peux localiser n'importe quelle note en moins de 2 secondes." },
    { type: "h", text: "Pourquoi cette corde est si importante" },
    { type: "p", text: "La corde 6 porte la fondamentale (= la note qui donne son nom) de la plupart des accords barrés en 'forme E'. Quand tu joues un La barré (forme E barrée case 5), c'est parce que la case 5 corde 6 = La. Quand tu joues un Si barré (forme E barrée case 7), c'est parce que case 7 corde 6 = Si. Bref, connaître cette corde = pouvoir transposer instantanément n'importe quel accord barré." },
    { type: "ref", text: "Pratique immédiate : prends une chanson avec des accords barrés (la plupart des chansons rock/pop). Identifie la fondamentale de chaque accord sur la corde 6. Si tu joues La majeur en barré case 5, dis-toi : 'Je joue La parce que case 5 corde 6 = La'. Cette habitude grave les notes dans ta tête en moins d'une semaine." },
    { type: "tip", text: "Drill du soir (3 min) : sur la corde 6, joue case par case en nommant la note à voix haute. Mi-Fa-Fa#-Sol-Sol#-La-La#-Si-Do-Do#-Ré-Ré#-Mi. Refais en descendant. Cet exercice 'parlé' connecte ton cerveau au manche en quelques jours." },
  ],
  quiz: ["q-base-16","q-neck-03"],
};

export const quiz = [
  {id:"q-base-16",courseId:"neck",lessonId:"neck-c2-01",lvl:2,q:"Sur la corde de Mi grave (corde 6), quelle note trouve-t-on case 3 ?",o:["Fa","La","Fa#","Sol"],a:3,exp:"Depuis Mi à vide : case 1 Fa, case 2 Fa#, case 3 Sol. C'est cette corde qui porte la fondamentale des accords barrés en forme de Mi.",xp:35},
];
