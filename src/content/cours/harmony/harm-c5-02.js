// Leçon du module « harmony » + les questions de quiz qui s'y rattachent.
// Format décrit dans src/content/README.md.

export default {
  id: "harm-c5-02", level: 7,
  title: "Le chiffrage romain et le système Nashville",
  duration: 9,
  content: [
    { type: "p", text: "Le chiffrage romain est le langage universel des musiciens pour parler d'harmonie sans mentionner de tonalité spécifique. Le système Nashville (NNS) est sa version simplifiée, utilisée par les musiciens de studio à Nashville depuis les années 50. Comprendre ces deux systèmes te rend capable de communiquer musicalement avec n'importe quel musicien." },
    { type: "h", text: "Le chiffrage romain : rappel" },
    { type: "p", text: "I = tonique (accord majeur). ii = sus-tonique (accord mineur). iii = médiante (accord mineur). IV = sous-dominante (accord majeur). V = dominante (accord majeur). vi = sus-dominante (accord mineur). vii° = sensible (accord diminué). MAJUSCULE = majeur. minuscule = mineur. ° = diminué." },
    {
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
    },
    { type: "h", text: "Le système Nashville (NNS)" },
    { type: "p", text: "À Nashville dans les années 1950, les musiciens de session devaient jouer des dizaines de chansons par jour dans des tonalités différentes. Au lieu d'écrire les noms d'accords, ils ont développé un système de chiffres arabes. 1 = tonique. 2m = sus-tonique (mineur). 4 = sous-dominante. 5 = dominante. 6m = relatif mineur. Ex : I-V-vi-IV en chiffrage romain = 1-5-6m-4 en Nashville." },
    { type: "h", text: "Avantages du système Nashville" },
    { type: "p", text: "Transposition instantanée : si le chanteur monte d'un ton, tu joues les mêmes chiffres dans une nouvelle tonalité sans réapprendre la chanson. Communication ultra-rapide : 'on joue un 1-4-5-1' est compris en 1 seconde. Lecture en live : une 'Nashville chart' (feuille de chiffres) permet de jouer une chanson sans répétition." },
    { type: "h", text: "Exemples de progressions en chiffrage" },
    { type: "p", text: "I-V-vi-IV (1-5-6m-4) : 'Let It Be', 'No Woman No Cry', 'With Or Without You'. I-IV-V (1-4-5) : blues classique, rock'n'roll, country. ii-V-I (2m-5-1) : standard jazz. I-vi-IV-V (1-6m-4-5) : doo-wop, années 50. Ces 4 progressions couvrent une immense partie du répertoire pop." },
    { type: "h", text: "Tonalités majeures vs mineures en chiffrage" },
    { type: "p", text: "En tonalité mineure, le chiffrage change légèrement. Le 'i' (mineur) est la tonique. Le '♭III' est le relatif majeur (ex : Do dans Am). Le 'iv' est la sous-dominante mineure. Le 'v' ou 'V' est la dominante. Ex : la progression Am-F-C-G s'analyse comme i-♭VI-♭III-♭VII en La mineur. Le '♭' se mesure par rapport à la gamme majeure de même tonique (La majeur ici) : ♭III, ♭VI et ♭VII sont simplement les degrés naturels de la gamme mineure, un demi-ton plus bas qu'en majeur. Rien n'est emprunté." },
    { type: "ref", text: "Anecdote : à Nashville, les musiciens de session (bassiste, guitariste, pianiste) peuvent jouer une session d'enregistrement entière à la vue d'une 'Nashville chart' qu'ils n'ont jamais vue avant. Une feuille A4 avec des chiffres leur suffit pour jouer un arrangement complet. C'est la preuve ultime de l'efficacité de ce système." },
    { type: "tip", text: "Adopte le chiffrage romain dès aujourd'hui. À chaque chanson que tu joues, traduis les accords en chiffres. En 1 mois, tu penseras directement en degrés — et tu pourras transposer n'importe quelle chanson instantanément." },
  ],
  quiz: ["q-harm-14","q-harm-04","q-harm-07"],
};

export const quiz = [
  {id:"q-harm-14",courseId:"harmony",lessonId:"harm-c5-02",lvl:3,q:"En chiffrage Nashville, la progression '1-6-4-5' en Sol donne…",o:["Sol-La-Do-Ré","Sol-Mim-Do-Ré","Sol-Mim-Lam-Ré","Sol-Si-Do-Ré"],a:1,exp:"En Sol : 1=Sol(maj), 6=Mim, 4=Do(maj), 5=Ré(maj). Donc Sol-Mim-Do-Ré. Le doo-wop classique des années 50.",xp:50},
];
