// Leçon du module « rhythm » + les questions de quiz qui s'y rattachent.
// Format décrit dans src/content/README.md.

export default {
  id: "rhy-c5-03", level: 8,
  title: "Funk : les 16e notes et les ghost notes",
  duration: 12,
  content: [
    { type: "p", text: "Le funk est le genre qui pousse la guitare rythmique à son point de perfectionnement maximal. La guitare funk n'est pas un instrument harmonique — c'est un instrument de percussion. Chaque note, chaque silence, chaque ghost note est une pièce d'un puzzle rythmique précis. Comprendre le funk, c'est comprendre comment la guitare peut 'drummer'." },
    { type: "h", text: "Les 16e notes : la matière première du funk" },
    { type: "p", text: "En funk, la main droite joue un flux continu de 16 doubles-croches par mesure. Ce flux ne s'arrête jamais. On compte : '1-e-et-a-2-e-et-a-3-e-et-a-4-e-et-a'. La main bouge en permanence (bas-haut-bas-haut × 4 par temps). Sur ces 16 positions possibles, le musicien choisit quelles notes sonnent et lesquelles sont étouffées (ghost notes)." },
    { type: "h", text: "Les ghost notes en funk" },
    { type: "p", text: "Une ghost note funk = un coup de médiator sur des cordes étouffées. La main gauche plaque un accord mais sans appuyer — les cordes ne sonnent pas clairement, juste un 'click' ou 'chuck' percussif. Ces clicks sont les ghost notes. Elles ne sont pas là pour être entendues harmoniquement — elles maintiennent le flux rythmique et créent la texture du groove funk." },
    { type: "h", text: "Accents et ghost notes : le pattern funk" },
    { type: "p", text: "Dans un pattern funk, certaines 16e sont 'accents' (cordes sonnantes avec harmonie) et d'autres sont 'ghost notes' (cordes étouffées). La combinaison des deux crée le groove. Pattern typique : accents sur le 1, le « et » du 1, le « et » du 2, le 3 et le « et » du 4, ghost notes partout ailleurs (voir la grille ci-dessous). La distribution des accents varie selon le groove voulu." },
    {
      type: "rhythm_grid",
      caption: "Pattern funk 16e — accents (orange) vs ghost notes (gris) sur 1 mesure",
      data: {
        beats: 4, subdivision: 16,
        highlights: [0, 2, 6, 8, 14],
        muted: [1, 3, 4, 5, 7, 9, 10, 11, 12, 13, 15],
        label: "1 · e · et · a · 2 · e · et · a · 3 · e · et · a · 4 · e · et · a",
      },
    },
    {
      type: "strum_pattern",
      caption: "Le même pattern à la main droite — accents sur 1, et-1, et-2, 3, et-4 (tous en bas), ghost notes (×) ailleurs",
      data: { pattern: ["B", "x", "B", "x", "x", "x", "B", "x", "B", "x", "x", "x", "x", "x", "B", "x"], beats: 4, style: "funk", bpm: 95 },
    },
    { type: "h", text: "Le son funk : comment l'obtenir" },
    { type: "p", text: "Son funk optimal : guitare propre (clean) avec un peu de compression. Souvent accordée avec un capo ou jouée en position ouverte. Accords 7 (m7, 7, 9) avec des voicings courts (2-3 cordes). Main gauche qui maîtrise l'étouffement (effleurement des cordes pour les ghost notes vs pression complète pour les accents). La distorsion tue le groove funk — il faut du clean." },
    { type: "h", text: "Le wah-wah : l'outil funk par excellence" },
    { type: "p", text: "La pédale wah-wah est associée au funk depuis Jimi Hendrix et Isaac Hayes. Ouverte sur les accents, fermée sur les ghost notes, la wah imite le spectre de la voix humaine. Ce n'est pas indispensable pour jouer funk, mais c'est une couleur sonore inimitable. Nile Rodgers (CHIC), Chic Murray, et le jeune Prince utilisaient le wah comme extension de leur vocabulaire rythmique." },
    { type: "h", text: "L'approche Nile Rodgers" },
    { type: "p", text: "Nile Rodgers (CHIC, David Bowie, Daft Punk) est la référence absolue de la guitare funk rythmique. Son approche : des accords 'chucked' (étouffés) et secs, des voicings minimalistes (souvent juste 3-4 cordes), un groove implacable basé sur les 16e notes syncopées. Ses riffs semblent simples, mais leur précision rythmique est extraordinaire." },
    { type: "ref", text: "'Le Freak' (CHIC, 1978) : le riff de guitare de Nile Rodgers = parfait exemple de ghost notes + accents en 16e. 'Get Up (I Feel Like Being a) Sex Machine' (James Brown, 1970) : riff de guitare en 16e avec ghost notes omniprésents. 'Give It Away' (Red Hot Chili Peppers, 1991) : John Frusciante adapte le funk au rock en maintenant les 16e continues." },
    { type: "tip", text: "Drill funk (15 min) : sur Am9 (Am7 + 9e = La-Do-Mi-Sol-Si), joue un flux continu de 16e notes à 85 BPM. Main gauche : alterne pression complète (son) et relâchement (ghost). Main droite : bas-haut permanent. Commence avec un accent sur le 1 et sur le 'et-2', ghost partout ailleurs. Augmente progressivement la complexité rythmique." },
  ],
  quiz: ["q-rhy-10","q-rhy-38","q-rhy-07"],
};

export const quiz = [
  {id:"q-rhy-10",courseId:"rhythm",lessonId:"rhy-c5-03",lvl:3,q:"En funk, la main droite reste continue en doubles-croches même quand on ne 'joue' pas. Pourquoi ?",o:["Pour pouvoir jouer plus vite", "Pour économiser son énergie sur la durée", "Pour garder le groove et le timing", "Par simple convention historique du funk"],a:2,exp:"Main droite continue D-U-D-U... = ghost notes étouffées entre les accents. Maintient le 'pulse' rythmique régulier, crée le groove.",xp:55},
  {id:"q-rhy-38",courseId:"rhythm",lessonId:"rhy-c5-03",lvl:3,q:"En funk, le temps 1 est le plus souvent…",o:["Purement et simplement ignoré","Systématiquement joué en ghost note","Joué deux fois de suite pour l'appuyer","Le point d'ancrage le plus marqué de la mesure"],a:3,exp:"Le funk repose sur un temps 1 très affirmé — « the One » — autour duquel tout le reste peut se syncoper. Sans ce point fixe, la syncope n'a plus de référence et le groove se dissout.",xp:40},
];
