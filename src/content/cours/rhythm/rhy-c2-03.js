// Leçon du module « rhythm » + les questions de quiz qui s'y rattachent.
// Format décrit dans src/content/README.md.

export default {
  id: "rhy-c2-03", level: 6,
  title: "Les triolets : le feel ternaire",
  duration: 10,
  gropiTip: "Pour sentir le triolet, dis « cho-co-lat » sur chaque clic du métronome à 60 BPM : trois syllabes égales par temps, l'appui sur « cho ». Dès qu'une syllabe traîne, ce n'est plus un triolet.",
  content: [
    { type: "p", text: "Un triolet, c'est 3 notes égales jouées dans le temps d'une valeur binaire (2 notes). En d'autres termes : diviser un temps en 3 au lieu de 2. Ce 'feel ternaire' est à la base du blues, du jazz swing, du shuffle, et de la bossa nova. Sans comprendre les triolets, impossible de vraiment swinguer." },
    { type: "h", text: "Définition visuelle" },
    { type: "p", text: "Un triolet de croches = 3 croches dans le temps d'une noire (au lieu de 2 croches normales). On les compte : '1-trip-let, 2-trip-let, 3-trip-let, 4-trip-let'. Ou encore : 'tri-o-let, tri-o-let, tri-o-let, tri-o-let'. Chaque syllabe = 1 note du triolet. Sur 1 mesure de 4/4, il y a 4 triolets de croches = 12 notes." },
    {
      type: "rhythm_grid",
      caption: "1 mesure en triolets de croches — 4 groupes de 3 notes égales",
      data: {
        beats: 4, subdivision: 12,
        accents: [0, 3, 6, 9],
        counters: ["1","trip","let","2","trip","let","3","trip","let","4","trip","let"],
        label: "1-trip-let · 2-trip-let · 3-trip-let · 4-trip-let",
      },
    },
    { type: "h", text: "Le feel ternaire vs binaire" },
    { type: "p", text: "Feel binaire (normal) : chaque temps divisé en 2 parties égales. Croche-croche-croche-croche. Son régulier, 'carré'. Feel ternaire : chaque temps divisé en 3 parties. Son 'oscillant', 'qui balance'. La différence est subtile mais fondamentale pour le style. Le jazz swing et le blues sont ternaires. Le rock et le pop sont généralement binaires." },
    { type: "h", text: "Le shuffle : triolets appliqués" },
    { type: "p", text: "Le shuffle est le rythme ternaire le plus répandu en blues. Principe : dans un triolet (1-2-3), on joue uniquement la 1ère et la 3ème note (1-et-3). Résultat : une paire 'longue-courte' répétée. 'Dah-dah, dah-dah, dah-dah, dah-dah'. C'est le feel de Robert Johnson, Muddy Waters, B.B. King. Quand tu entends 'ça swingue', c'est souvent le shuffle." },
    { type: "h", text: "Le swing jazz : le triolet subtil" },
    { type: "p", text: "Le swing jazz utilise aussi les triolets, mais de façon plus subtile. Au lieu de jouer strictement 1ère et 3ème note du triolet, les jazzmen 'infléchissent' les croches vers un feel ternaire sans être complètement shuffle. En shuffle strict, la 1re croche dure 2/3 du temps et la 2e 1/3 (le rapport du triolet) ; en swing jazz, ce rapport varie selon le tempo et le musicien. Cela ne se calcule pas — ça s'imite en écoutant." },
    { type: "h", text: "Triolets dans les solos" },
    { type: "p", text: "Dans un solo, alterner des passages binaires (croches régulières) et ternaires (triolets) crée une richesse rythmique immédiate. Exemple : joue une gamme en croches normales (binaire) pendant 2 temps, puis la même gamme en triolets (ternaire) pendant 2 temps. Le contraste est saisissant." },
    { type: "h", text: "Feel ternaire sans triolets écrits" },
    { type: "p", text: "Attention : dans beaucoup de musiques blues et shuffle, les triolets ne sont PAS notés — ils sont 'sous-entendus'. Une chanson peut être notée en croches normales mais jouée avec un feel shuffle. On écrit 'shuffle feel' ou 'swing feel' au début de la partition. C'est au musicien d'interpréter correctement." },
    { type: "ref", text: "Pour entendre le triolet pur : 'My Favorite Things' (Coltrane version, 1960) est en 3/4 avec des triolets omniprésents. 'Hit the Road Jack' (Ray Charles) a un riff de piano en triolets de croches. Le générique de 'Star Wars' (John Williams) commence sur un triolet. Une fois que tu l'entends, il est partout." },
    { type: "tip", text: "Drill triolets : à 60 BPM, alterne 2 mesures de croches normales (1-et-2-et-3-et-4-et) et 2 mesures de triolets (1-trip-let-2-trip-let). Sans t'arrêter entre les transitions. L'objectif : que ton corps sente la différence binaire/ternaire sans avoir à calculer." },
  
    { type: "h", text: "Subdivisions composées (3/4, 6/8, 9/8, 12/8)" },
    { type: "p", text: "Toutes les mesures ne sont pas en 4/4. 3/4 (valse). 6/8 (folk celtique, ballades). 9/8 (rare, certains airs balkaniques). 12/8 (slow blues, gospel). En 6/8, on compte 2 groupes de 3 croches : '1-2-3 4-5-6' avec accents sur 1 et 4." },
    { type: "h", text: "Polyrythme et polymètre" },
    { type: "p", text: "Quand 2 subdivisions différentes coexistent : '3 contre 2' (triolets contre croches), '4 contre 3'. On le retrouve dans de nombreuses musiques africaines, en jazz fusion et en rock progressif." },
    { type: "p", text: "Polymètre : différentes signatures rythmiques jouées simultanément (ex: une partie en 4/4, une autre en 3/4 — utilisé en jazz fusion, math rock). Polyrythme : différentes subdivisions du même tempo (ex: 3 contre 2). Différent mais souvent confondu." },
    { type: "tip", text: "Drill métronome 60bpm : 4 mesures de noires, 4 de croches, 4 de doubles, 4 de triolets, sans interruption. Si tu te perds, ralentis. Précision avant tout." },
  ],
  quiz: ["q-rhy-03","q-rhy-04","q-logic-06","q-rhy-31","q-rhy-32"],
};

export const quiz = [
  {id:"q-rhy-03",courseId:"rhythm",lessonId:"rhy-c2-03",lvl:2,q:"Un triolet de croches contient combien de notes par temps ?",o:["2","4","6","3"],a:3,exp:"Triolet de croches = 3 notes égales sur 1 temps. Subdivision impaire. Base du shuffle blues, du swing, du feel ternaire.",xp:30},
  {id:"q-rhy-04",courseId:"rhythm",lessonId:"rhy-c2-03",lvl:3,q:"En 6/8, on compte typiquement…",o:["2 groupes de 3 croches", "6 temps égaux, comme en 6/4", "3 noires par mesure", "6 noires par mesure"],a:0,exp:"6/8 se compte en 2 grands temps de 3 croches : '1-2-3 4-5-6' avec accents sur 1 et 4. Feel ternaire. Folk celtique, ballades.",xp:45},
  {id:"q-logic-06",courseId:"rhythm",lessonId:"rhy-c2-03",lvl:2,q:"Combien de subdivisions différentes peut contenir 1 mesure de 4/4 ?",o:["3 (noires, croches, doubles)","Infiniment","4","Cela dépend du genre"],a:1,exp:"Théoriquement infini : noires, croches, doubles, triolets, quintuplets, septuplets, etc. En pratique on s'arrête souvent aux doubles + triolets.",xp:50},
  {id:"q-rhy-31",courseId:"rhythm",lessonId:"rhy-c2-03",lvl:2,q:"Comment compte-t-on un triolet de croches à voix haute ?",o:["1-o-let, 2-o-let", "1-et, 2-et, 3-et", "1-e-et-a, 2-e-et-a", "1-2-3-4"],a:0,exp:"« Tri-o-let » ou « 1-o-let » : trois syllabes régulières par temps. Prononcer le découpage est le moyen le plus fiable de sentir un ternaire quand on vient d'un binaire.",xp:30},
  {id:"q-rhy-32",courseId:"rhythm",lessonId:"rhy-c2-03",lvl:3,q:"Quelle est la différence entre jouer en 12/8 et jouer des triolets en 4/4 ?",o:["Le 12/8 se joue nécessairement plus vite","Aucune à l'oreille : seule l'écriture change","Le 12/8 compte quatre temps de moins","Le 12/8 se joue aux doigts, sans médiator"],a:1,exp:"Les deux donnent quatre temps subdivisés en trois. La différence est d'écriture et d'intention : on note en 12/8 quand le ternaire est la norme du morceau, et en triolets quand c'est un écart ponctuel dans un contexte binaire.",xp:40},
];
