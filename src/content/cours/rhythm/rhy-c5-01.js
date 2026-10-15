// Leçon du module « rhythm » + les questions de quiz qui s'y rattachent.
// Format décrit dans src/content/README.md.

export default {
  id: "rhy-c5-01", level: 6,
  title: "Blues shuffle : le feel ternaire appliqué",
  duration: 11,
  content: [
    { type: "p", text: "Le shuffle blues est le feel rythmique fondamental du blues. Quand tu entends B.B. King, Stevie Ray Vaughan, Eric Clapton dans leur répertoire blues, c'est le shuffle que tu entends. Ce feel ternaire transforme un rythme 'carré' en quelque chose qui 'swingue' et qui 'danse'. Comprendre et jouer le shuffle est une étape incontournable pour tout guitariste rock/blues." },
    { type: "h", text: "Rappel : le feel shuffle" },
    { type: "p", text: "On divise chaque temps en 3 (triolet), mais on ne joue que la 1ère et la 3ème note du triolet. Résultat : une paire 'longue-courte' par temps. Compté : 'DAH-dah, DAH-dah, DAH-dah, DAH-dah'. En notation écrite, les croches sont normales, mais indiqué 'shuffle feel' en tête de partition." },
    {
      type: "rhythm_grid",
      caption: "Blues shuffle — feel longue-courte par temps (triolets : 1er + 3e seulement)",
      data: {
        beats: 4, subdivision: 12,
        highlights: [0, 2, 3, 5, 6, 8, 9, 11],
        muted: [1, 4, 7, 10],
        label: "DAH (1 + trip) · dah (let) — la note du milieu du triolet ne sonne pas",
      },
    },
    { type: "h", text: "Le riff boogie-woogie" },
    { type: "p", text: "La forme la plus emblématique du shuffle blues à la guitare : le riff boogie-woogie. Sur la corde 6 (Mi) avec Am7 en tête : joue Mi(0) suivi de La(5) en alternance sur un feel shuffle. Ou la version '3-4-5' : Mi(0)-Sol(3)-La(5) en triolets avec retour. Ce riff est la base de dizaines de classiques blues." },
    { type: "h", text: "Le shuffle à 12 mesures" },
    { type: "p", text: "Jouer un blues à 12 mesures en shuffle : 4 mesures de I (A7 ou riff sur La), 2 mesures de IV (D7 ou riff sur Ré), 2 mesures de I, 1 mesure de V (E7), 1 mesure de IV, 2 mesures de I. Le tout avec le feel shuffle (longue-courte sur chaque temps). C'est la grille de référence pour pratiquer le blues." },
    { type: "h", text: "Quick change vs slow change" },
    { type: "p", text: "Deux versions du blues 12 mesures. Slow change (classique) : 4 mesures complètes sur I avant d'aller au IV. Quick change (moderne) : on passe au IV dès la mesure 2 avant de revenir au I. Ex : A7(1)-D7(2)-A7(3)-A7(4)-D7(5)-D7(6)-A7(7)-A7(8)-E7(9)-D7(10)-A7(11)-E7(12). Les deux versions coexistent dans le répertoire blues." },
    { type: "h", text: "Texas shuffle vs Chicago shuffle" },
    { type: "p", text: "Texas shuffle (Stevie Ray Vaughan) : plus chargé, plus de notes, feel presque double-croches. Très physique. Chicago shuffle (Muddy Waters, Willie Dixon) : plus épuré, groove implacable, espace entre les notes. Less is more. Savoir lequel tu préfères te guide vers ton style personnel de blues." },
    { type: "h", text: "Le shuffle acoustique" },
    { type: "p", text: "Sur guitare acoustique, le shuffle prend une autre forme. Souvent joué en fingerpicking : le pouce fait le shuffle sur les cordes graves (basse alternée), les doigts jouent la mélodie sur les cordes aiguës. Robert Johnson jouait ainsi. Lightnin' Hopkins aussi. Ce style 'solo blues acoustique' combine basse, rythme et mélodie en même temps." },
    { type: "ref", text: "'Pride and Joy' (Stevie Ray Vaughan, 1983) : le riff d'intro est un Texas shuffle parfait en Mi. Écoute le feel 'longue-courte' sur chaque temps. 'Everyday I Have the Blues' (B.B. King) : Chicago shuffle épuré en Fa. 'Hound Dog' (Elvis, version Big Mama Thornton originale) : shuffle en Mi. Ces 3 morceaux = 3 déclinaisons du même feel." },
    { type: "tip", text: "Drill shuffle 20 min : mets un backing track de blues shuffle en La à 80 BPM (YouTube). Joue le riff boogie-woogie sur la corde 6 pendant 5 min. Puis improvise en pentatonique Am avec le feel shuffle (fais sonner tes phrases en longue-courte). Enregistre-toi. Tu entendras directement si le feel est là ou non." },
  ],
  quiz: ["q-rhy-07","q-rhy-44","q-rhy-45"],
};

export const quiz = [
  {id:"q-rhy-07",courseId:"rhythm",lessonId:"rhy-c5-01",lvl:3,q:"Le 'shuffle' blues subdivise le temps en…",o:["2 croches égales, jouées droites", "4 doubles-croches, toutes jouées", "3 notes égales, toutes les trois jouées", "Un triolet : on joue la 1re et la 3e"],a:3,exp:"Shuffle = chaque temps en triolet, on joue uniquement la 1ère et la 3e note. 'Long-court'. Feel ternaire du blues classique.",xp:50},
  {id:"q-rhy-44",courseId:"rhythm",lessonId:"rhy-c5-01",lvl:1,q:"Dans le feel shuffle, quelles notes du triolet joue-t-on sur chaque temps ?",o:["Les trois notes", "La 1re et la 3e", "Seulement la 2e", "La 2e et la 3e"],a:1,exp:"On divise le temps en triolet et on joue la 1re et la 3e note : une paire longue-courte.",xp:30},
  {id:"q-rhy-45",courseId:"rhythm",lessonId:"rhy-c5-01",lvl:2,q:"Dans un blues 12 mesures en « quick change », que se passe-t-il à la mesure 2 ?",o:["On reste sur l'accord I", "On joue déjà l'accord V, la dominante", "On passe au IV, puis on revient", "On s'arrête une mesure"],a:2,exp:"Quick change : IV dès la mesure 2 (A7-D7-A7-A7…), au lieu de 4 mesures de I en slow change.",xp:40},
];
