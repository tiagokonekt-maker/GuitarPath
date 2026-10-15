// Leçon du module « rhythm » + les questions de quiz qui s'y rattachent.
// Format décrit dans src/content/README.md.

export default {
  id: "rhy-c5-05", level: 9,
  title: "Gypsy jazz : la pompe Django",
  duration: 10,
  gropiTip: "Pour le « chunk » de la pompe, relâche la pression de la main gauche juste après le coup, sans lever les doigts des cordes : l'accord se coupe net, sans bruit de corde à vide.",
  content: [
    { type: "p", text: "Le gypsy jazz est un style musical créé dans les années 30 par le guitariste manouche Django Reinhardt à Paris. Sa guitare rythmique caractéristique — la 'pompe' — est l'une des plus distinctives et des plus exigeantes de toute la guitare. La pompe n'est pas juste un pattern : c'est une philosophie du rythme entier." },
    { type: "h", text: "Origines et Django" },
    { type: "p", text: "Django Reinhardt (1910-1953) était un guitariste Romani (manouche) qui jouait dans les cafés et dancings parisiens. Malgré 2 doigts paralysés à la main gauche suite à un incendie, il a développé un style guitaristique révolutionnaire. Son groupe, le Quintette du Hot Club de France (avec le violoniste Stéphane Grappelli), a créé le seul grand style de jazz vraiment européen." },
    { type: "h", text: "La pompe : définition et feel" },
    { type: "p", text: "La pompe gypsy = strumming 4 downstrokes par mesure, tous des coups bas, en alternant note tenue (ouverte) et note étouffée (chunk). Pattern : BAS sec(1) - BAS chunk(2) - BAS sec(3) - BAS chunk(4). Ou parfois : BAS sec(1) - BAS sec(2) - BAS chunk(3) - BAS chunk(4). Les coups 'secs' sonnent l'accord. Les coups 'chunk' étouffent aussitôt." },
    { type: "h", text: "Pourquoi exclusivement des downstrokes" },
    { type: "p", text: "Contrairement au strumming folk ou pop (alternance haut-bas), la pompe gypsy n'utilise QUE des coups bas. Cela crée un son percussif et une énergie particulière impossible à obtenir avec des coups hauts. L'effort physique est plus grand (pas de 'récupération' avec les coups hauts), mais le résultat est un groove compact et puissant." },
    { type: "h", text: "Le tempo gypsy" },
    { type: "p", text: "Le gypsy jazz se joue vite — souvent 180-240 BPM pour les morceaux rapides (the 'swings'). La pompe à ces tempos est physiquement exigeante. Commence à 100 BPM et augmente progressivement. 1 mois de pratique quotidienne est nécessaire avant d'approcher les tempos 'gypsy réels'." },
    { type: "h", text: "L'harmonie gypsy" },
    { type: "p", text: "Le gypsy jazz utilise beaucoup d'accords dim7, de substitutions tritoniques, et de dominantes secondaires. Les voicings sont souvent compacts (3-4 notes sur cordes 1-2-3-4). La progression ii-V-I est omniprésente, souvent dans plusieurs tonalités enchaînées rapidement. Les standards joués incluent 'Minor Swing', 'Djangology', 'Les Yeux Noirs'." },
    { type: "h", text: "Comment pratiquer la pompe" },
    { type: "p", text: "Commence avec 1 accord seulement (Dm ou Am). 4 downstrokes par mesure à 90 BPM. Alternance sec/chunk à chaque coup. Ne jamais utiliser de coup haut. Augmente le tempo de 5 BPM par semaine. La pompe 'sonne gypsy' quand elle atteint environ 150 BPM avec un son défini et énergique." },
    {
      type: "strum_pattern",
      caption: "Pompe Django — 4 downstrokes alternant sec (B) et étouffé (×)",
      data: { pattern: ["B","x","B","x"], beats: 4, style: "folk", bpm: 160 },
    },
    { type: "ref", text: "'Minor Swing' (Django Reinhardt & Stéphane Grappelli, 1937) : LE standard gypsy jazz par excellence. La pompe de Rhythm Guitar Sec (le second guitariste du Quintette) sur ce morceau = exemple parfait. Écoute 'La Mer' (Charles Trenet) dans une version jazz pour la pompe appliquée à une chanson française." },
    { type: "tip", text: "La pompe gypsy est physique. Commence par 5 minutes maximum par session pour éviter les tendinites. Après 2 semaines, augmente à 10 minutes. La pompe gypsy est un marathon, pas un sprint." },
  ],
  quiz: ["q-rhy-09","q-rhy-04","q-rhy-06"],
};

export const quiz = [
  {id:"q-rhy-09",courseId:"rhythm",lessonId:"rhy-c5-05",lvl:3,q:"La 'pompe' gypsy jazz utilise…",o:["Un aller-retour bas-haut continu", "Des coups bas, secs puis étouffés", "Des triolets joués en continu", "Des doubles-croches alternées bas-haut"],a:1,exp:"Pompe gypsy = down strokes sur chaque temps, alternant 'sec' (note tenue) et 'étouffé' (chuck). Style Django Reinhardt. Effet percussif.",xp:50},
];
