// Leçon du module « rhythm » + les questions de quiz qui s'y rattachent.
// Format décrit dans src/content/README.md.

export default {
  id: "rhy-c6-02", level: 9,
  title: "Construire un riff rythmique personnel",
  duration: 11,
  content: [
    { type: "p", text: "Cette leçon de synthèse te donne les outils pour créer tes propres riffs rythmiques. Un riff rythmique personnel, c'est ta signature musicale — quelques notes ou accords organisés dans un pattern distinctif que tu as inventé. Tous les grands guitaristes ont leurs riffs caractéristiques.", img: "/mascotte-histoire.webp", imgAlt: "Gropi qui raconte une histoire, livre ouvert devant lui", imgSide: "right" },
    { type: "h", text: "Les ingrédients d'un bon riff" },
    { type: "p", text: "Un riff efficace combine 4 éléments : (1) Un motif rythmique fort (pas trop complexe, mémorisable). (2) Une idée harmonique simple (1-3 accords ou notes). (3) Une 'signature' distinctive (élément qui le rend reconnaissable : un bend, un mute spécifique, une note de passage). (4) La répétabilité (pouvoir le jouer 20 fois parfaitement identique)." },
    { type: "h", text: "Étape 1 : choisir le feel" },
    { type: "p", text: "Avant de trouver des notes, choisis le feel de ton riff. Blues shuffle ? Funk 16e ? Rock downstrokes ? Reggae skank ? Ce feel détermine le groove de base. Exemple : 'je veux un riff blues-rock avec palm mute et quelques accents ouverts'. Ce cadre te guide dans tes choix." },
    { type: "h", text: "Étape 2 : choisir la zone harmonique" },
    { type: "p", text: "Sur quoi ton riff est-il basé ? Power chord en Mi (rock)? Accord de Am7 (funk/blues)? Notes de la pentatonique Am (blues)? Riff de basse sur cordes graves (rock/métal)? La zone harmonique détermine la couleur et le registre du riff. La plupart des grands riffs sont très simples harmoniquement — leur force vient du rythme, pas des notes." },
    { type: "h", text: "Étape 3 : créer le motif" },
    { type: "p", text: "Commence par 1 mesure (4 temps). Place 4-8 éléments (coups de médiator, mutes, notes). Assure-toi qu'il y a un accent clair (souvent sur le temps 1 ou le 'et-de-2'). Teste-le en boucle 10 fois. S'il sonne naturellement après 3-4 répétitions = bon signe. Si tu dois chercher la prochaine note = trop complexe, simplifie." },
    { type: "h", text: "Étape 4 : variations" },
    { type: "p", text: "Un bon riff a une version A (la base) et une version B (variation). La version B peut : changer le dernier temps (turnaround), monter d'une corde à la fin, ajouter une note de passage. La version B intervient toutes les 4 mesures environ, créant de la variété sans tout changer." },
    { type: "h", text: "Les riffs les plus célèbres : analyse" },
    { type: "p", text: "'Smoke on the Water' (Deep Purple) : 4 notes en power chords, rythme de noires simples. Ultra simple, mais reconnaissable universellement. 'Johnny B. Goode' (Chuck Berry) : riff boogie en La, double-croches. Simple, groovy, répétable. 'Superstition' (Stevie Wonder) : riff clavinet = 8 notes en doubles-croches syncopées. Plus complexe mais toujours répétable. La complexité n'est pas la clé du succès d'un riff." },
    { type: "h", text: "Documenter et développer" },
    { type: "p", text: "Quand tu trouves un riff qui 'sonne', enregistre-le immédiatement. Les bonnes idées disparaissent. Utilise ton téléphone. Ensuite, note le en tablature (même approximative). Puis travaille-le : est-ce qu'il supporte d'être joué 2 minutes en boucle sans ennuyer ? C'est le test ultime. Les grands riffs sont faits pour être répétés." },
    { type: "ref", text: "Keith Richards (Rolling Stones) dit qu'il enregistre toutes ses idées de riffs la nuit avec un petit dictaphone. Beaucoup de ses riffs célèbres sont nés à 3h du matin. 'Satisfaction' est venu dans son sommeil — il s'est réveillé, a mis le dictaphone en marche, a joué le riff, puis s'est rendormi. Le lendemain, l'enregistrement était là." },
    { type: "tip", text: "Projet riff : crée 1 riff par semaine. Chaque lundi, tu as un nouveau riff à créer sur la base du style étudié (blues la semaine 1, reggae la semaine 2, funk la semaine 3, etc.). En 10 semaines, tu as 10 riffs personnels. C'est le début de ton vocabulaire musical propre." },
  ],
  quiz: ["q-rhy-41","q-rhy-10"],
};

export const quiz = [
  {id:"q-rhy-41",courseId:"rhythm",lessonId:"rhy-c6-02",lvl:3,q:"Qu'est-ce qui rend un riff rythmique mémorable ?",o:["Le nombre de notes qu'il contient au total", "La vitesse à laquelle il est exécuté", "Une cellule courte, répétée puis variée", "L'usage de nombreux accords différents"],a:2,exp:"Répétition pour ancrer, variation pour relancer. Cette structure — trois fois pareil, la quatrième différente — porte l'immense majorité des riffs célèbres, et elle est directement applicable à l'improvisation.",xp:40},
];
