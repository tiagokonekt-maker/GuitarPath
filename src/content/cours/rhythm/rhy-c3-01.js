// Leçon du module « rhythm » + les questions de quiz qui s'y rattachent.
// Format décrit dans src/content/README.md.

export default {
  id: "rhy-c3-01", level: 5,
  title: "La syncope : décaler l'accent",
  duration: 11,
  gropiTip: "Tape du pied sur 1-2-3-4 et frappe dans tes mains uniquement sur les « et ». Si ton pied se met à suivre tes mains, ralentis à 60 BPM : c'est lui qui doit tenir la pulsation.",
  content: [
    { type: "p", text: "La syncope est l'un des concepts rythmiques les plus importants en musique populaire. C'est elle qui fait qu'un rythme 'groove', qu'il te donne envie de bouger. Sans syncope, la musique sonne 'carrée' et monotone. Avec elle, elle prend vie. Comprendre la syncope, c'est comprendre le secret du funk, du jazz, du reggae et du R&B." },
    { type: "h", text: "Définition" },
    { type: "p", text: "Une syncope (ou note syncopée) = une note accentuée sur un temps faible (les 'et' ou les 'e/a' des subdivisions) plutôt que sur un temps fort (1, 2, 3, 4). L'oreille humaine 'attend' les accents sur les temps forts. Quand l'accent tombe ailleurs, elle est surprise — et cette surprise crée le groove." },
    { type: "h", text: "Syncope simple : jouer sur les 'et'" },
    { type: "p", text: "Exemple basique : au lieu de jouer sur les temps 1-2-3-4, joue sur les 'et' : 'et-de-1, et-de-2, et-de-3, et-de-4'. Résultat : l'accent est décalé d'une croche. La basse (ou le batteur) marque les temps, toi tu joues entre. C'est le principe du reggae 'skank' et de beaucoup de patterns funk." },
    { type: "h", text: "Syncope par 'tenue'" },
    { type: "p", text: "Autre type de syncope : tu joues une note sur un temps faible et tu la TIENS sur le temps fort suivant (au lieu de rejouer une note au temps fort). La note jointe deux temps = l'accent du temps fort est 'volé' par la note précédente. Ce type de syncope est très utilisé en bossa nova et en jazz." },
    { type: "h", text: "Le backbeat : la syncope fondamentale du rock" },
    { type: "p", text: "Dans le rock et le pop, la caisse claire frappe sur les temps 2 et 4 (les 'temps faibles'). C'est le 'backbeat'. Cette inversion des accents (fort sur les faibles) est la signature rythmique du rock'n'roll depuis les années 50. Quand tu joues de la guitare avec un batteur, tu dois sentir ce backbeat et jouer avec lui." },
    { type: "h", text: "La syncope en guitare rythmique" },
    { type: "p", text: "Pattern syncopé classique en guitare : joue un accord sur le temps 1, silence au 2, accord sur le 'et-de-2', accord au temps 3, silence au 4, accord sur le 'et-de-4'. Notation : 1 - (2) - et - 3 - (4) - et. Ce pattern simple crée immédiatement du groove. C'est la base de nombreux riffs pop et funk." },
    {
      type: "rhythm_grid",
      caption: "Syncope classique — accents sur 1, 'et-du-2' et 3, 'et-du-4'",
      data: {
        beats: 4, subdivision: 8,
        highlights: [0, 3, 4, 7],
        muted: [1, 2, 5, 6],
        label: "1 · – · [et] · – · 3 · – · [et] · –",
      },
    },
    { type: "h", text: "Compter les syncopes" },
    { type: "p", text: "Pour jouer avec précision des patterns syncopés, il faut compter à voix haute au début. '1 et 2 et 3 et 4 et' pendant que tu joues le pattern. Avec le temps, l'intégration dans le corps se fait et tu n'as plus besoin de compter. Mais au début, le comptage verbal est indispensable pour placer les accents correctement." },
    { type: "h", text: "La syncope et l'irrégularité" },
    { type: "p", text: "La syncope ne veut pas dire 'jouer n'importe où'. Ça veut dire 'déplacer les accents de façon délibérée et contrôlée'. Une syncope bien placée crée du groove. Une note mal placée crée de la confusion. La différence : la précision du placement et la cohérence du pattern. Un groove syncopé est régulier dans son irrégularité." },
    { type: "ref", text: "'Superstition' (Stevie Wonder, 1972) : le riff principal est entièrement construit sur des accents syncopés. Les notes importantes tombent sur les contretemps. C'est pour ça que ce riff 'danse'. 'Papa's Got a Brand New Bag' (James Brown, 1965) : le hit qui a lancé le funk, construit sur la syncope 'sur le 1' (l'accent est sur le premier temps, mais les notes précédentes créent l'anticipation)." },
    { type: "tip", text: "Drill syncope (10 min) : sur Am, joue un accord sur chaque 'et' (contretemps) pendant 2 minutes. Puis alterne : accord sur le temps 1, accord sur le 'et-de-2', accord sur le temps 3, accord sur le 'et-de-4'. 2 minutes. Puis crée ton propre pattern syncopé. Enregistre-toi et écoute : sonne-t-il groovy ?" },
  ],
  quiz: ["q-rhy-05"],
};

export const quiz = [
  {id:"q-rhy-05",courseId:"rhythm",lessonId:"rhy-c3-01",lvl:2,q:"Une 'syncope' place l'accent sur…",o:["Le temps fort de chaque mesure", "Le contretemps (les « et »)", "La toute fin de la mesure", "Le silence entre deux notes"],a:1,exp:"Syncope = accent sur les temps faibles (les 'et' ou les 'e/a'). Source du groove en funk, jazz, reggae, R&B.",xp:30},
];
