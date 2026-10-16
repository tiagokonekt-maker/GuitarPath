// Leçon du module « harmony » + les questions de quiz qui s'y rattachent.
// Format décrit dans src/content/README.md.

export default {
  id: "harm-c1-02", level: 2,
  title: "Consonance et dissonance",
  duration: 9,
  gropiTip: "Joue le triton Si-Fa : Si (corde 5 case 2) et Fa (corde 4 case 3). Glisse ensuite vers Do (corde 5 case 3) et Mi (corde 4 case 2). Deux doigts bougent d'une case, et toute la tension se pose.",
  content: [
    { type: "p", text: "Pourquoi certains accords sonnent 'bien' et d'autres sonnent 'tendus' ou même 'faux' ? La réponse est dans deux concepts fondamentaux : la consonance (les sons qui s'accordent naturellement) et la dissonance (les sons qui créent une tension). Comprendre cette dualité, c'est comprendre comment la musique crée des émotions." },
    { type: "h", text: "La consonance : quand les sons s'accordent" },
    { type: "p", text: "Deux notes sont consonantes quand leurs fréquences vibrent dans des rapports simples. L'octave (rapport 2:1) est la consonance absolue. La quinte juste (rapport 3:2) est la deuxième plus consonante. La tierce majeure (5:4) est consonante mais avec une légère douceur. Plus le rapport est simple, plus les notes 'sonnent bien' ensemble." },
    { type: "h", text: "La dissonance : quand les sons créent de la tension" },
    { type: "p", text: "Deux notes sont dissonantes quand leurs fréquences vibrent dans des rapports complexes, créant des battements acoustiques perceptibles. La seconde majeure (Do-Ré jouées simultanément) crée une légère tension. La septième mineure est dissonante mais 'douce'. Le triton (quarte augmentée/quinte diminuée) est très dissonant — c'est 'le diable en musique'." },
    { type: "h", text: "La tension-résolution : le moteur de la musique" },
    { type: "p", text: "La musique se construit sur un cycle éternel : tension → résolution. Un accord dissonant (V7) crée une tension qui 'demande' à se résoudre vers un accord consonant (I). Cette alternance est le moteur émotionnel de toute la musique tonale. Sans dissonance, pas de tension. Sans tension, pas d'émotion. Le but n'est pas d'éviter la dissonance, mais de la gérer." },
    {
      type: "interval_chart",
      caption: "Consonance vs dissonance — les intervalles les plus consonants (quinte, octave) vs les plus dissonants (triton, 7e)",
      data: { highlight: ["P5", "P8", "TT", "m7", "m2"] },
    },
    { type: "h", text: "Consonance et dissonance sont relatives" },
    { type: "p", text: "Attention : consonance et dissonance ne sont pas des valeurs absolues. Elles dépendent du contexte. Un accord de septième (dissonant en théorie) sonne 'doux' en jazz. Une quinte à vide (consonante) sonne 'agressive' en métal grunge. L'oreille s'habitue et réinterprète les sons selon le contexte. Ce qui sonnait 'faux' au Moyen-Âge (le triton) est aujourd'hui ordinaire en blues." },
    { type: "h", text: "Dissonances 'acceptées' en musique moderne" },
    { type: "p", text: "La musique classique baroque (Bach, Vivaldi) utilisait très peu de dissonances non résolues. Le blues et le jazz ont popularisé des dissonances que l'époque baroque aurait jugées 'fausses' (la septième mineure, la blue note). Le rock a rendu le triton ordinaire. Le jazz moderne (post-Coltrane) pousse encore plus loin. L'histoire de la musique, c'est aussi l'histoire de l'expansion des dissonances tolérées." },
    { type: "ref", text: "'Black Sabbath' (Black Sabbath, 1970) : le riff d'intro est construit sur un triton (Mi-Si♭), l'intervalle le plus dissonant. En 1970, c'était délibérément provocateur et 'satanique'. Aujourd'hui, ce riff est étudié dans les conservatoires. La perception de la dissonance évolue avec le temps et la culture." },
    { type: "tip", text: "Drill auditif : joue ces 3 intervalles sur ta guitare (depuis Do c5 case 3) : Do+Mi (tierce majeure, consonant), Do+Fa# (triton, très dissonant), Do+Sol (quinte, très consonant). Écoute la différence de 'tension' entre les 3. Ton oreille apprend à reconnaître consonance/dissonance." },
  ],
  quiz: ["q-base-13","q-harm-55","q-harm-56"],
};

export const quiz = [
  {id:"q-base-13",courseId:"harmony",lessonId:"harm-c1-02",lvl:1,q:"Deux notes qui sonnent tendues ensemble, sans stabilité, sont dites…",o:["Dissonantes","Consonantes","Enharmoniques","Chromatiques"],a:0,exp:"La dissonance crée la tension, la consonance la stabilité. Aucune n'est un défaut : c'est leur alternance qui donne vie à la musique.",xp:30},
  {id:"q-harm-55",courseId:"harmony",lessonId:"harm-c1-02",lvl:1,q:"Lequel de ces intervalles sonne le plus consonant ?",o:["L'octave","La seconde majeure","Le triton","La septième mineure"],a:0,exp:"L'octave (rapport 2:1) est la consonance absolue : les deux notes se fondent presque en une. Seconde, triton et septième produisent des battements, donc de la tension.",xp:30},
  {id:"q-harm-56",courseId:"harmony",lessonId:"harm-c1-02",lvl:2,q:"Un accord tendu (V7) laisse place à un accord stable (I). Comment appelle-t-on ce mouvement ?",o:["Une résolution","Une modulation","Une syncope","Une inversion"],a:0,exp:"La tension créée par la dissonance se résout sur un accord consonant : c'est la résolution. Ce va-et-vient tension → détente est le moteur de la musique tonale.",xp:40},
];
