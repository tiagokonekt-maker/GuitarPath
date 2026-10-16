// Leçon du module « harmony » + les questions de quiz qui s'y rattachent.
// Format décrit dans src/content/README.md.

export default {
  id: "harm-c1-01", level: 1,
  title: "Qu'est-ce que l'harmonie ?",
  duration: 8,
  gropiTip: "Fredonne un La pendant que tu grattes Lam, puis Fa, puis Ré : la même note change de couleur selon l'accord en dessous. C'est exactement ça, l'harmonie.",
  content: [
    { type: "p", text: "La mélodie, tu connais : c'est la ligne musicale que tu chantes ou que tu joues seul. Le rythme, tu connais aussi : c'est la pulsation, le groove. Mais l'harmonie ? C'est le troisième pilier de la musique, et souvent le moins bien compris. Cette leçon va t'en donner une définition claire, et te montrer pourquoi la maîtriser transforme ta façon de jouer." },
    { type: "h", text: "Définition simple" },
    { type: "p", text: "L'harmonie, c'est l'art de combiner plusieurs notes jouées simultanément (ou perçues comme telles) pour créer un effet musical cohérent. Quand tu plaques un accord de guitare, tu joues de l'harmonie : plusieurs notes ensemble qui créent une couleur sonore. Quand une chanteuse chante par-dessus une guitare, les deux voix forment une harmonie." },
    { type: "chord_diagram", caption: "Do (C) — x32010 : cinq notes jouées ensemble, c'est déjà de l'harmonie", data: {name: "C", frets: [-1,3,2,0,1,0], fingers: [0,3,2,0,1,0], startFret: 1} },
    { type: "h", text: "Harmonie vs mélodie vs rythme" },
    { type: "p", text: "Mélodie = les notes jouées une par une (horizontal). Rythme = la durée et le placement des notes dans le temps. Harmonie = les notes jouées ensemble (vertical). En musique, ces trois dimensions coexistent en permanence. Une chanson pop a : une mélodie (le chant), un rythme (la batterie et le picking), et une harmonie (les accords de guitare, le piano, la basse)." },
    { type: "tab", caption: "Horizontal puis vertical : les notes de Do une par une (mélodie), puis toutes ensemble (harmonie)", text: "Tab : Do (corde 5 case 3), Mi (corde 4 case 2), Sol (corde 3 à vide), Do (corde 2 case 1), Mi (corde 1 à vide) l'une après l'autre, puis les cinq en même temps.", data: { lines: ["e|---------0---0--|","B|-------1-----1--|","G|-----0-------0--|","D|---2---------2--|","A|-3-----------3--|","E|----------------|"] } },
    { type: "h", text: "Pourquoi comprendre l'harmonie ?" },
    { type: "p", text: "Sans connaissance harmonique, tu joues 'dans le vide' : tu mémorises des suites d'accords comme des recettes, sans comprendre pourquoi elles fonctionnent. Avec la compréhension harmonique, tu peux : (1) analyser n'importe quelle chanson en quelques secondes, (2) improviser intelligemment sur des grilles d'accords, (3) composer des progressions originales, (4) transposer n'importe quel morceau instantanément." },
    { type: "h", text: "L'harmonie tonale : le système dominant" },
    { type: "p", text: "La grande majorité de la musique populaire occidentale (pop, rock, jazz, folk, country, R&B, blues) utilise ce qu'on appelle le système 'tonal'. Ce système est organisé autour d'une note centrale (la tonique) vers laquelle toutes les autres notes et accords gravitent. Comprendre ce système, c'est comprendre l'essentiel de la musique que tu écoutes." },
    { type: "h", text: "L'harmonie comme grammaire" },
    { type: "p", text: "Imagine la musique comme un langage. La mélodie, c'est les mots. Le rythme, c'est la ponctuation. L'harmonie, c'est la grammaire — les règles qui font que les mots s'enchaînent de façon compréhensible. Tu peux parler sans connaître la grammaire (comme un enfant), mais quand tu la maîtrises, ton expression devient infiniment plus riche et précise." },
    { type: "ref", text: "Pour entendre l'harmonie 'en action' : écoute 'What a Wonderful World' (Louis Armstrong). La mélodie que tu fredonneras est simple. Mais écoute les accords en dessous : ils changent constamment, créant des émotions différentes sous la même mélodie. C'est l'harmonie qui fait que certains passages te touchent plus que d'autres." },
    { type: "tip", text: "Exercice d'écoute : prends une chanson que tu connais bien. Écoute-la en te concentrant uniquement sur les accords (pas la mélodie, pas la batterie). Combien y a-t-il d'accords différents ? À quel moment changent-ils ? C'est ton premier pas vers l'analyse harmonique." },
  ],
  quiz: ["q-base-05","q-harm-53","q-harm-54"],
};

export const quiz = [
  {id:"q-base-05",courseId:"harmony",lessonId:"harm-c1-01",lvl:1,q:"L'harmonie, en musique, désigne avant tout…",o:["Plusieurs sons joués simultanément","Une suite de notes jouées seule","La vitesse d'un morceau","Le placement des accents"],a:0,exp:"L'harmonie naît de la superposition des sons. La mélodie est horizontale (une note après l'autre), l'harmonie verticale (plusieurs notes ensemble).",xp:25},
  {id:"q-harm-53",courseId:"harmony",lessonId:"harm-c1-01",lvl:1,q:"Tu joues Do, Mi et Sol l'une après l'autre, puis les trois ensemble. Quand fais-tu de l'harmonie ?",o:["Quand les trois sonnent ensemble","Quand tu les joues l'une après l'autre","Dans les deux cas, de la même façon","Dans aucun des deux cas"],a:0,exp:"Une note après l'autre, c'est une ligne mélodique (l'horizontal). Plusieurs notes ensemble, c'est de l'harmonie (le vertical) : ici, l'accord de Do.",xp:30},
  {id:"q-harm-54",courseId:"harmony",lessonId:"harm-c1-01",lvl:2,q:"Dans le système tonal de la pop, du rock ou du blues, autour de quoi la musique s'organise-t-elle ?",o:["Une note centrale, la tonique","Un tempo fixe, toujours le même","Une seule corde de la guitare","Un accord unique, joué en boucle"],a:0,exp:"Le système tonal gravite autour d'une note de repos, la tonique. Notes et accords s'en éloignent puis y reviennent : c'est ce qui donne à une chanson son sentiment de « maison ».",xp:40},
];
