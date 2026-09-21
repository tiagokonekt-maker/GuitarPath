#!/usr/bin/env node
// Groply — scripts/ajouter-questions.mjs
//
// Ajoute 45 questions de quiz (29 rythme, 16 improvisation) à src/content.js,
// et les rattache aux leçons concernées.
//
// ── Pourquoi un script et non un content.js de remplacement ───────────────
// Ton content.js contient déjà des modifications qui ne sont pas dans mon
// instantané — le retag des questions q-impro-* vers courseId "impro",
// notamment. Te livrer un fichier complet écraserait ce travail. Ce script
// modifie TON fichier, en place, sans toucher au reste.
//
// Il est IDEMPOTENT : lancé deux fois, il ne duplique rien. On peut donc le
// relancer sans crainte après un git pull ou une fusion de branches.
//
// Usage :
//     node scripts/ajouter-questions.mjs            aperçu, n'écrit rien
//     node scripts/ajouter-questions.mjs --write    applique (sauvegarde .bak)

import { readFileSync, writeFileSync, copyFileSync, existsSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

// fileURLToPath et non .pathname : sous Windows, .pathname renvoie
// "/C:/Users/Mon%20Dossier/..." — chemin inutilisable tel quel.
const ICI = dirname(fileURLToPath(import.meta.url));
const CIBLE = resolve(ICI, "..", "src", "content.js");
const ECRIRE = process.argv.includes("--write");

if (!existsSync(CIBLE)) {
  console.error(`content.js introuvable : ${CIBLE}`);
  console.error("Lance ce script depuis la racine du projet.");
  process.exit(1);
}

// ═══════════════════════════════════════════════════════════════════════════
// LES QUESTIONS
//
// Règles de rédaction reprises du contenu existant :
//   • la bonne réponse n'apparaît jamais dans l'énoncé ;
//   • les distracteurs ont une longueur comparable — sinon on répond à la
//     longueur plutôt qu'au sens ;
//   • les distracteurs sont des erreurs PLAUSIBLES, pas des absurdités : c'est
//     ce qui fait qu'une question enseigne au lieu de simplement trier ;
//   • l'explication dit POURQUOI et donne un repère utilisable à la guitare ;
//   • la position de la bonne réponse est répartie sur les quatre rangs.
// ═══════════════════════════════════════════════════════════════════════════

const QUESTIONS = [
  // ═════ RYTHME ═════════════════════════════════════════════════════════
  // rhy-c1-03 · Le métronome (palier 2) — n'avait aucune question
  { id: "q-rhy-13", courseId: "rhythm", lessonId: "rhy-c1-03", lvl: 1,
    q: "À quoi sert d'abord un métronome quand on travaille ?",
    o: ["À révéler où on accélère ou on ralentit", "À rendre le jeu plus mécanique", "À compter les mesures d'un morceau", "À jouer plus vite qu'on ne le pourrait"],
    a: 0,
    exp: "Le métronome ne te fait pas jouer plus vite : il te montre où tu décales. On accélère presque toujours dans les passages faciles et on ralentit dans les difficiles — sans référence extérieure, on ne l'entend pas.",
    xp: 25 },
  { id: "q-rhy-14", courseId: "rhythm", lessonId: "rhy-c1-03", lvl: 2,
    q: "Un passage ne passe pas à 100 bpm. Que fais-tu ?",
    o: ["Tu sautes le passage pour y revenir plus tard", "Tu descends au tempo où c'est propre, puis tu montes par paliers", "Tu répètes à 100 jusqu'à ce que ça finisse par passer", "Tu joues plus fort pour te donner de l'élan"],
    a: 1,
    exp: "Répéter à un tempo où c'est raté, c'est mémoriser l'erreur. On descend jusqu'au tempo où les notes sont justes et régulières, puis on monte de 5 en 5. Plus lent sur une séance, bien plus rapide sur un mois.",
    xp: 30 },
  { id: "q-rhy-15", courseId: "rhythm", lessonId: "rhy-c1-03", lvl: 3,
    q: "Mettre le métronome sur les temps 2 et 4 seulement, ça sert à…",
    o: ["Réduire le bruit pendant le travail", "Simplifier le comptage des mesures", "Se reposer sur une pulsation intérieure plus solide", "Pouvoir jouer deux fois plus vite"],
    a: 2,
    exp: "Avec un clic seulement sur 2 et 4, c'est toi qui portes les temps 1 et 3. C'est l'exercice de tempo le plus révélateur qui soit — et c'est aussi la place du clic dans le jazz et la soul.",
    xp: 40 },

  // rhy-c2-02 · Croches et doubles-croches (palier 4) — aucune question
  { id: "q-rhy-16", courseId: "rhythm", lessonId: "rhy-c2-02", lvl: 1,
    q: "Une croche dure combien par rapport à une noire ?",
    o: ["Le double", "Le quart", "La même chose", "La moitié"],
    a: 3,
    exp: "Chaque valeur vaut la moitié de la précédente : ronde, blanche, noire, croche, double-croche. Deux croches remplissent exactement un temps en 4/4.",
    xp: 25 },
  { id: "q-rhy-17", courseId: "rhythm", lessonId: "rhy-c2-02", lvl: 2,
    q: "Comment compte-t-on à voix haute une mesure de doubles-croches ?",
    o: ["1-e-et-a, 2-e-et-a, 3-e-et-a, 4-e-et-a", "1-et-2-et-3-et-4-et", "1-2-3-4 en accélérant", "1-2-3, 1-2-3, 1-2-3"],
    a: 0,
    exp: "Quatre syllabes par temps, une par double-croche. Ce comptage n'est pas décoratif : il donne un nom à chaque emplacement, et c'est ce qui permet de placer une note exactement où tu veux.",
    xp: 30 },
  { id: "q-rhy-18", courseId: "rhythm", lessonId: "rhy-c2-02", lvl: 3,
    q: "Une croche pointée suivie d'une double-croche occupe…",
    o: ["Deux temps, soit la moitié d'une mesure", "Un temps, découpé en trois quarts puis un quart", "Un temps et demi, comme la blanche pointée", "Un demi-temps, comme deux doubles-croches"],
    a: 1,
    exp: "Le point ajoute la moitié de la valeur : la croche pointée vaut trois doubles-croches, la double qui suit en vaut une. Total : un temps. C'est le rythme de base du rock des années 50 et de quantité de riffs.",
    xp: 40 },

  // rhy-c4-01 · La main droite (palier 3) — aucune question
  { id: "q-rhy-19", courseId: "rhythm", lessonId: "rhy-c4-01", lvl: 1,
    q: "En strumming, pourquoi garder la main droite en mouvement continu ?",
    o: ["Pour user moins vite le médiator et les cordes", "Pour jouer plus fort et mieux projeter le son", "Pour que le bras garde la pulsation, même sans toucher les cordes", "Pour économiser son énergie sur les longs morceaux"],
    a: 2,
    exp: "Le bras devient le métronome. Si le mouvement s'arrête entre deux accords, le tempo s'arrête avec lui. On continue le balancier et on ne touche les cordes qu'aux moments voulus.",
    xp: 25 },
  { id: "q-rhy-20", courseId: "rhythm", lessonId: "rhy-c4-01", lvl: 2,
    q: "Dans un mouvement pendulaire en croches, le coup vers le haut tombe sur…",
    o: ["Les fins de mesure uniquement", "Les temps eux-mêmes", "Le premier temps seulement", "Les « et », entre les temps"],
    a: 3,
    exp: "Descente sur les temps, remontée sur les « et ». Cette correspondance est constante : elle te dit instantanément quel coup employer pour n'importe quelle figure écrite en croches.",
    xp: 30 },
  { id: "q-rhy-21", courseId: "rhythm", lessonId: "rhy-c4-01", lvl: 3,
    q: "Pour jouer un rythme en doubles-croches à tempo rapide, la main droite doit…",
    o: ["Accélérer progressivement ses allers-retours en croches", "Doubler la vitesse du balancier, en gardant la même amplitude par temps", "Ne faire que des coups vers le bas, plus rapprochés", "Réduire son amplitude de moitié à chaque note"],
    a: 1,
    exp: "On ne joue pas des doubles-croches en accélérant un mouvement de croches : on installe un balancier deux fois plus rapide dès le départ. Le repère reste le temps, jamais la note.",
    xp: 40 },

  // rhy-c4-02 · Patterns folk, pop, rock (palier 4) — aucune question
  { id: "q-rhy-22", courseId: "rhythm", lessonId: "rhy-c4-02", lvl: 1,
    q: "Le pattern de strumming le plus répandu en pop tient en combien de temps ?",
    o: ["Un seul temps, répété", "Deux temps, répétés deux fois", "Une mesure de quatre temps", "Quatre mesures complètes"],
    a: 2,
    exp: "La quasi-totalité des patterns pop se bouclent sur une mesure de 4/4 et se répètent. En apprendre un solide t'ouvre des centaines de morceaux — c'est le meilleur rapport effort/répertoire de la guitare.",
    xp: 25 },
  { id: "q-rhy-23", courseId: "rhythm", lessonId: "rhy-c4-02", lvl: 2,
    q: "Dans un pattern, sauter un coup vers le bas signifie…",
    o: ["Qu'on immobilise le bras un instant", "Que le bras descend sans toucher les cordes", "Qu'on étouffe les cordes de la main gauche", "Qu'on profite du vide pour changer d'accord"],
    a: 1,
    exp: "Le mouvement ne s'interrompt jamais, on lève simplement le médiator au-dessus des cordes. C'est ce qui fait qu'un pattern à trous garde son assise, au lieu de sonner haché.",
    xp: 30 },
  { id: "q-rhy-24", courseId: "rhythm", lessonId: "rhy-c4-02", lvl: 3,
    q: "Pourquoi un même pattern sonne folk sur une guitare et rock sur une autre ?",
    o: ["Parce que le tempo employé n'est pas le même", "Parce que les accords choisis sont différents", "À cause des accents, de l'étouffement et des cordes touchées", "À cause du nombre de cordes de l'instrument"],
    a: 2,
    exp: "Le squelette rythmique est identique ; ce qui change est l'interprétation — accents plus marqués, palm mute, attaque limitée aux cordes graves. Un pattern n'est pas un genre, c'est une grille qu'on habille.",
    xp: 40 },

  // rhy-c2-01 · Valeurs de base (palier 3)
  { id: "q-rhy-25", courseId: "rhythm", lessonId: "rhy-c2-01", lvl: 1,
    q: "Combien de noires dans une ronde ?",
    o: ["2", "3", "4", "8"],
    a: 2,
    exp: "Ronde = 2 blanches = 4 noires = 8 croches. Cette pyramide est la base de toute lecture rythmique : chaque étage vaut le double du suivant.",
    xp: 25 },
  { id: "q-rhy-26", courseId: "rhythm", lessonId: "rhy-c2-01", lvl: 2,
    q: "En 3/4, une blanche pointée occupe…",
    o: ["La mesure entière", "La moitié de la mesure", "Deux mesures complètes", "Un temps et demi seulement"],
    a: 0,
    exp: "La blanche vaut 2 temps, le point en ajoute 1 : 3 temps, soit toute la mesure en 3/4. C'est l'accord tenu typique de la valse.",
    xp: 30 },

  // rhy-c1-01 · Qu'est-ce que le rythme (palier 1)
  { id: "q-rhy-27", courseId: "rhythm", lessonId: "rhy-c1-01", lvl: 1,
    q: "Entre un guitariste qui joue des notes savantes mal placées et un autre qui joue des notes simples bien placées…",
    o: ["Les deux sonnent équivalents", "Le premier sonne nettement mieux", "Le second sonne nettement mieux", "Tout dépend de l'accordage employé"],
    a: 2,
    exp: "Une note juste au mauvais moment s'entend comme une erreur ; une note simple bien placée s'entend comme de la musique. C'est le rythme, pas le vocabulaire, qui sépare le plus nettement l'amateur du professionnel.",
    xp: 25 },
  { id: "q-rhy-28", courseId: "rhythm", lessonId: "rhy-c1-01", lvl: 2,
    q: "La pulsation d'un morceau, c'est…",
    o: ["Le dessin rythmique de la mélodie", "La vitesse des notes les plus rapides", "L'accentuation des temps forts", "La régularité sous-jacente sur laquelle on taperait du pied"],
    a: 3,
    exp: "La pulsation est la grille régulière ; le rythme est ce qu'on pose dessus. On peut jouer beaucoup de notes sur une pulsation lente, et peu sur une rapide — ce sont deux choses distinctes.",
    xp: 30 },

  // rhy-c1-02 · La mesure à 4/4 (palier 2)
  { id: "q-rhy-29", courseId: "rhythm", lessonId: "rhy-c1-02", lvl: 2,
    q: "Dans une signature 4/4, que signifie le chiffre du bas ?",
    o: ["L'unité de temps : la noire", "Le nombre de mesures du morceau", "Le tempo auquel jouer", "Le nombre de cordes à gratter"],
    a: 0,
    exp: "Le haut dit combien de temps par mesure, le bas dit quelle valeur vaut un temps — 4 désigne la noire. En 6/8, le 8 désigne la croche, et tout le comptage change.",
    xp: 30 },
  { id: "q-rhy-30", courseId: "rhythm", lessonId: "rhy-c1-02", lvl: 3,
    q: "Pourquoi le 4/4 est-il parfois noté d'un simple C ?",
    o: ["Pour « croche », qui serait l'unité de temps", "Pour « commun » : c'est la mesure la plus répandue", "Pour l'accord de Do, tonalité de référence", "Pour « continu », car le tempo ne varie pas"],
    a: 1,
    exp: "C signifie tempus commune, la mesure commune. Le C barré désigne le 2/2 (alla breve), où l'on compte deux temps à la blanche — utile à reconnaître sur les partitions de jazz rapides.",
    xp: 40 },

  // rhy-c2-03 · Triolets (palier 6)
  { id: "q-rhy-31", courseId: "rhythm", lessonId: "rhy-c2-03", lvl: 2,
    q: "Comment compte-t-on un triolet de croches à voix haute ?",
    o: ["1-et-2-et", "1-e-et-a", "1-o-let, 2-o-let", "1-2-3-4"],
    a: 2,
    exp: "« Tri-o-let » ou « 1-o-let » : trois syllabes régulières par temps. Prononcer le découpage est le moyen le plus fiable de sentir un ternaire quand on vient d'un binaire.",
    xp: 30 },
  { id: "q-rhy-32", courseId: "rhythm", lessonId: "rhy-c2-03", lvl: 3,
    q: "Quelle est la différence entre jouer en 12/8 et jouer des triolets en 4/4 ?",
    o: ["Le 12/8 se joue nécessairement plus vite", "Le 12/8 compte quatre temps de moins", "Le 12/8 se joue aux doigts, sans médiator", "Aucune à l'oreille : seule l'écriture change"],
    a: 3,
    exp: "Les deux donnent quatre temps subdivisés en trois. La différence est d'écriture et d'intention : on note en 12/8 quand le ternaire est la norme du morceau, et en triolets quand c'est un écart ponctuel dans un contexte binaire.",
    xp: 40 },

  // rhy-c3-03 · Le groove (palier 6)
  { id: "q-rhy-33", courseId: "rhythm", lessonId: "rhy-c3-03", lvl: 2,
    q: "Deux guitaristes jouent les mêmes notes au même tempo, et un seul « groove ». Qu'est-ce qui change ?",
    o: ["Le placement précis et le dosage des accents", "Le choix des positions d'accords", "Le volume général de l'instrument", "Le type de cordes installées"],
    a: 0,
    exp: "Le groove tient à des écarts de quelques millisecondes et à la hiérarchie des accents. C'est mesurable, et c'est travaillable — contrairement à ce que laisse croire le mot « feeling ».",
    xp: 30 },
  { id: "q-rhy-34", courseId: "rhythm", lessonId: "rhy-c3-03", lvl: 3,
    q: "Les ghost notes servent à…",
    o: ["Remplir les silences avec des notes bien audibles", "Marquer plus nettement les temps forts", "Maintenir le mouvement par des attaques étouffées, presque inaudibles", "Atteindre des tempos plus rapides"],
    a: 2,
    exp: "Ce sont des attaques étouffées par la main gauche : on entend la percussion, pas la hauteur. Elles remplissent la grille rythmique sans encombrer l'harmonie, et c'est le cœur du jeu funk.",
    xp: 40 },

  // rhythm-04 · Phrasing (palier 9)
  { id: "q-rhy-35", courseId: "rhythm", lessonId: "rhythm-04", lvl: 3,
    q: "Jouer « laid-back » signifie placer les notes…",
    o: ["Juste avant le temps", "Très légèrement après le temps", "Exactement sur le temps", "En dehors de la mesure"],
    a: 1,
    exp: "Un placement très légèrement en retard, sans perdre le tempo — d'où l'impression de détente du jazz et de la soul. Jouer « on top » (juste devant) produit l'effet inverse : urgence, poussée, et c'est le placement du rock.",
    xp: 40 },
  { id: "q-rhy-36", courseId: "rhythm", lessonId: "rhythm-04", lvl: 2,
    q: "À quoi sert un silence après quelques notes de solo ?",
    o: ["À masquer une hésitation sur la suite", "À marquer la fin d'un morceau lent", "À rien : cela casse l'élan et fait retomber l'énergie", "À donner le temps d'entendre ce qui vient d'être joué"],
    a: 3,
    exp: "Sans silence, les phrases se fondent en un flux continu que l'oreille ne peut plus découper. Le silence est ce qui transforme une suite de notes en phrase — c'est la ponctuation.",
    xp: 30 },

  // rhy-c5-02 · Reggae et ska (palier 8)
  { id: "q-rhy-37", courseId: "rhythm", lessonId: "rhy-c5-02", lvl: 2,
    q: "Pourquoi la guitare reggae sonne-t-elle « en l'air » ?",
    o: ["Elle joue sur les contretemps, laissant les temps aux autres", "Elle joue dans un registre très aigu, au-dessus du chant", "Elle utilise un accordage volontairement plus haut", "Elle se place systématiquement en retard sur le tempo"],
    a: 0,
    exp: "La guitare occupe les espaces que les autres laissent vides. Ce partage est la définition même d'un arrangement : chacun sa place dans la mesure, personne ne double le voisin.",
    xp: 30 },

  // rhy-c5-03 · Funk (palier 8)
  { id: "q-rhy-38", courseId: "rhythm", lessonId: "rhy-c5-03", lvl: 3,
    q: "En funk, le temps 1 est le plus souvent…",
    o: ["Purement et simplement ignoré", "Le point d'ancrage le plus marqué de la mesure", "Systématiquement joué en ghost note", "Joué deux fois de suite pour l'appuyer"],
    a: 1,
    exp: "Le funk repose sur un temps 1 très affirmé — « the One » — autour duquel tout le reste peut se syncoper. Sans ce point fixe, la syncope n'a plus de référence et le groove se dissout.",
    xp: 40 },

  // rhy-c5-04 · Bossa nova (palier 9)
  { id: "q-rhy-39", courseId: "rhythm", lessonId: "rhy-c5-04", lvl: 3,
    q: "Dans la bossa nova, que fait le pouce pendant que les doigts jouent le motif syncopé ?",
    o: ["Il double exactement le motif joué par les doigts", "Il reste immobile pendant toute la mesure", "Il tient une pulsation régulière sur les cordes graves", "Il étouffe les cordes entre chaque accord"],
    a: 2,
    exp: "Le pouce maintient une base régulière, les doigts syncopent au-dessus : deux couches indépendantes jouées par une seule main. C'est ce qui rend la bossa difficile — et c'est l'exercice d'indépendance le plus payant qui soit.",
    xp: 40 },

  // rhy-c6-01 · Placement (palier 9)
  { id: "q-rhy-40", courseId: "rhythm", lessonId: "rhy-c6-01", lvl: 3,
    q: "Jouer « in the pocket », c'est…",
    o: ["Jouer le plus vite possible sans perdre la justesse", "Jouer systématiquement en avance sur le temps", "Jouer très fort pour dominer le reste du groupe", "S'aligner précisément sur le placement de la section rythmique"],
    a: 3,
    exp: "Le « pocket » est le placement collectif du groupe. Être dedans, ce n'est pas être mathématiquement sur le clic : c'est être au même endroit que la basse et la batterie, quel que soit cet endroit.",
    xp: 40 },

  // rhy-c6-02 · Construire un riff (palier 9)
  { id: "q-rhy-41", courseId: "rhythm", lessonId: "rhy-c6-02", lvl: 3,
    q: "Qu'est-ce qui rend un riff rythmique mémorable ?",
    o: ["Une cellule courte, répétée, avec une variation à la fin", "Le nombre de notes qu'il contient", "La vitesse à laquelle il est exécuté", "L'usage de nombreux accords différents"],
    a: 0,
    exp: "Répétition pour ancrer, variation pour relancer. Cette structure — trois fois pareil, la quatrième différente — porte l'immense majorité des riffs célèbres, et elle est directement applicable à l'improvisation.",
    xp: 40 },

  // ═════ IMPROVISATION ═══════════════════════════════════════════════════
  // Rattachées à des leçons de gammes et d'harmonie des paliers 5-6 : on ne
  // peut pas évaluer l'improvisation avant d'avoir de quoi improviser, mais
  // elle n'a pas à attendre le palier 6 pour commencer à être pensée.
  { id: "q-impro-16", courseId: "impro", lessonId: "scales-c3-01", lvl: 1,
    q: "Improviser, c'est d'abord…",
    o: ["Jouer le plus de notes possible", "Faire des choix dans un cadre connu", "Jouer sans réfléchir du tout", "Reproduire un solo appris par cœur"],
    a: 1,
    exp: "On n'improvise jamais à partir de rien : on choisit, en temps réel, parmi des possibilités qu'on connaît. Plus le cadre est maîtrisé, plus les choix sont libres — c'est exactement l'inverse de l'intuition courante.",
    xp: 25 },
  { id: "q-impro-17", courseId: "impro", lessonId: "scales-c3-01", lvl: 1,
    q: "Sur un morceau en La mineur, par quelle gamme commencer pour improviser ?",
    o: ["La gamme chromatique complète", "Mi phrygien", "La pentatonique mineure de La", "Do majeur"],
    a: 2,
    exp: "La pentatonique mineure de La ne contient aucune note qui puisse sonner franchement fausse sur cette tonalité. C'est ce qui en fait le point de départ universel : on peut se concentrer sur le rythme et le phrasé avant de penser aux notes.",
    xp: 25 },
  { id: "q-impro-18", courseId: "impro", lessonId: "scales-c3-02", lvl: 1,
    q: "Pourquoi la pentatonique est-elle plus facile à improviser que la gamme majeure ?",
    o: ["Elle retire les deux notes les plus instables", "Elle se joue à une vitesse plus élevée", "Elle ne possède qu'une seule position", "Elle n'a pas de tonique définie"],
    a: 0,
    exp: "Cinq notes au lieu de sept : on a retiré la quarte et la septième, celles qui demandent une résolution. Moins de notes à surveiller, donc plus d'attention disponible pour le placement rythmique.",
    xp: 25 },
  { id: "q-impro-19", courseId: "impro", lessonId: "scales-c3-04", lvl: 1,
    q: "La « blue note » ajoutée à la pentatonique mineure est…",
    o: ["La seconde majeure", "La sixte majeure", "La septième majeure", "La quinte diminuée"],
    a: 3,
    exp: "La quinte diminuée, entre la quarte et la quinte. Elle ne se tient pas : c'est une note de passage, à traverser plutôt qu'à poser, et c'est cette tension fugace qui donne sa couleur au blues.",
    xp: 30 },
  { id: "q-impro-20", courseId: "impro", lessonId: "scales-c3-01", lvl: 2,
    q: "Un débutant en impro joue sans jamais s'arrêter. Quel est le premier conseil ?",
    o: ["Laisser des silences et jouer des phrases courtes", "Apprendre davantage de gammes", "Monter progressivement en vitesse", "Changer de position sur le manche"],
    a: 0,
    exp: "Un flux ininterrompu ne s'entend pas comme de la musique mais comme un exercice. Jouer quatre notes puis se taire deux temps transforme immédiatement le résultat, sans rien apprendre de nouveau.",
    xp: 30 },
  { id: "q-impro-21", courseId: "impro", lessonId: "scales-c3-03", lvl: 2,
    q: "La pentatonique majeure de Do contient les mêmes notes que…",
    o: ["La pentatonique mineure de Mi", "La pentatonique majeure de Sol", "La gamme blues de Do", "La pentatonique mineure de La"],
    a: 3,
    exp: "Même réservoir de notes, tonique différente — La est la relative mineure de Do. En pratique : tu connais déjà deux gammes pour le prix d'une, et seule change la note sur laquelle tu te reposes.",
    xp: 30 },
  { id: "q-impro-22", courseId: "impro", lessonId: "harm-c2-01", lvl: 2,
    q: "Pendant un solo, poser une note de l'accord en cours produit…",
    o: ["Une sensation de stabilité", "Une tension à résoudre", "Une dissonance marquée", "Un effet de surprise"],
    a: 0,
    exp: "Les notes de l'accord sont les points de repos. Celles qui n'en font pas partie créent du mouvement. Savoir alterner les deux est la mécanique de base du phrasé, bien avant tout vocabulaire.",
    xp: 30 },
  { id: "q-impro-23", courseId: "impro", lessonId: "impro-01", lvl: 2,
    q: "Une phrase de solo qui se termine sur la tonique donne une impression de…",
    o: ["Question laissée ouverte", "Tension portée à son maximum", "Conclusion", "Fausse note"],
    a: 2,
    exp: "La tonique est le point d'arrivée de la tonalité : y finir ferme la phrase. Finir sur la seconde ou la septième laisse l'oreille en attente — c'est comme cela qu'on construit un dialogue question-réponse.",
    xp: 30 },
  { id: "q-impro-24", courseId: "impro", lessonId: "impro-01", lvl: 2,
    q: "Tu viens de jouer une phrase de quatre notes. Quelle suite construit le mieux un solo ?",
    o: ["Une phrase entièrement différente", "Un trait rapide d'une dizaine de notes", "La même phrase à l'identique, dix fois", "La même phrase déplacée ou légèrement modifiée"],
    a: 3,
    exp: "Répéter en transformant : l'oreille reconnaît le motif et suit son évolution. Tout changer à chaque phrase donne du décousu, ne rien changer donne de la monotonie. C'est la même logique que pour un riff.",
    xp: 30 },
  { id: "q-impro-25", courseId: "impro", lessonId: "impro-02", lvl: 2,
    q: "Sur un blues en La, on peut jouer La pentatonique mineure sur les trois accords. Pourquoi ?",
    o: ["Parce que le blues ne suit aucune règle", "Parce que la tonalité prime et que la gamme fonctionne sur l'ensemble", "Parce que les trois accords sont mineurs", "Parce que le tempo reste lent"],
    a: 1,
    exp: "On improvise sur la tonalité, pas sur chaque accord. C'est ce qui rend le blues abordable — et suivre les accords un par un, en ciblant leurs notes, est justement l'étape suivante.",
    xp: 30 },
  { id: "q-impro-26", courseId: "impro", lessonId: "impro-02", lvl: 3,
    q: "Que sont les « guide tones » d'un accord ?",
    o: ["Les notes jouées à vide", "La fondamentale et la quinte", "La tierce et la septième", "Les notes les plus aiguës du voicing"],
    a: 2,
    exp: "Tierce et septième portent l'identité de l'accord : la tierce dit majeur ou mineur, la septième dit la fonction. Fondamentale et quinte, elles, ne distinguent presque rien — d'où l'intérêt de viser les premières quand la grille bouge.",
    xp: 40 },
  { id: "q-impro-27", courseId: "impro", lessonId: "impro-03", lvl: 2,
    q: "Une note qui n'appartient pas à l'accord en cours est…",
    o: ["Toujours une faute à éviter", "Réservée au répertoire jazz", "À placer uniquement en fin de phrase", "Utilisable si elle se résout sur une note de l'accord"],
    a: 3,
    exp: "Ce qui rend une note « fausse » n'est pas son choix mais son traitement. Posée et tenue, elle heurte ; traversée vers une note stable, elle crée le mouvement dont la phrase a besoin.",
    xp: 30 },
  { id: "q-impro-28", courseId: "impro", lessonId: "impro-03", lvl: 3,
    q: "Sur un accord de Sol7 qui résout vers Do, quelle note crée le plus d'attente ?",
    o: ["Sol, la fondamentale", "Fa, la septième", "Ré, la quinte de l'accord", "Do, la tonique d'arrivée"],
    a: 1,
    exp: "Le Fa est à un demi-ton du Mi de l'accord de Do : il « tire » vers la résolution. C'est ce frottement, avec le Si qui monte vers Do, qui donne à l'accord de dominante sa fonction d'appel.",
    xp: 40 },
  { id: "q-impro-29", courseId: "impro", lessonId: "impro-05", lvl: 3,
    q: "Comment construire l'intensité d'un solo dans la durée ?",
    o: ["En répétant la même phrase du début à la fin", "En jouant fort et vite dès la première note", "En montant progressivement en registre, en densité et en tension", "En alternant au hasard les nuances"],
    a: 2,
    exp: "Un solo est une courbe, pas un plateau. Commencer bas et clairsemé laisse de la place pour monter — commencer au maximum ne laisse nulle part où aller, et l'oreille s'habitue en quelques secondes.",
    xp: 40 },
  { id: "q-impro-30", courseId: "impro", lessonId: "impro-06", lvl: 2,
    q: "Apprendre des licks par cœur, c'est…",
    o: ["Inutile : l'improvisation doit rester spontanée", "Se constituer un vocabulaire à réutiliser et transformer", "Suffisant pour savoir improviser", "Une étape réservée aux tout débutants"],
    a: 1,
    exp: "Personne n'improvise sans vocabulaire, pas plus qu'on ne parle une langue sans mots. Le lick n'est pas là pour être replacé tel quel : il est là pour être découpé, transposé et recombiné.",
    xp: 30 },
  { id: "q-impro-31", courseId: "impro", lessonId: "impro-04", lvl: 3,
    q: "Sur une grille où les accords changent toutes les deux mesures, quelle approche donne le plus de relief ?",
    o: ["Rester sur la même gamme sans rien ajuster", "Accélérer le débit à chaque changement", "S'arrêter de jouer à chaque changement", "Viser une note de chaque accord au moment du changement"],
    a: 3,
    exp: "Ce qui rend un solo « dedans », c'est de tomber sur une note de l'accord au moment précis où il arrive. Une seule note bien placée au changement s'entend davantage que quinze notes entre deux changements.",
    xp: 40 },
];

// ═══════════════════════════════════════════════════════════════════════════
// INTÉGRATION
// ═══════════════════════════════════════════════════════════════════════════

let src = readFileSync(CIBLE, "utf8");

/**
 * Fin de la structure ouverte à `depuis` (index de son [ ou {).
 * Indispensable : on ne peut PAS délimiter une leçon à l'expression
 * régulière. Son tableau `content` fait souvent plusieurs milliers de
 * caractères et contient lui-même des crochets — un motif du genre
 * `quiz:\s*\[[^\]]*\]` sort alors au mauvais endroit.
 */
function finDeBloc(texte, depuis) {
  const ouvrant = texte[depuis];
  const fermant = ouvrant === "[" ? "]" : "}";
  let profondeur = 0, chaine = null, echap = false;
  for (let i = depuis; i < texte.length; i++) {
    const c = texte[i];
    if (echap) { echap = false; continue; }
    if (c === "\\") { echap = true; continue; }
    if (chaine) { if (c === chaine) chaine = null; continue; }
    if (c === '"' || c === "'" || c === "`") { chaine = c; continue; }
    if (c === ouvrant) profondeur++;
    else if (c === fermant) { profondeur--; if (profondeur === 0) return i; }
  }
  return -1;
}

const serialiser = (q) =>
  `{id:${JSON.stringify(q.id)},courseId:${JSON.stringify(q.courseId)},` +
  `lessonId:${JSON.stringify(q.lessonId)},lvl:${q.lvl},q:${JSON.stringify(q.q)},` +
  `o:[${q.o.map(o => JSON.stringify(o)).join(",")}],a:${q.a},` +
  `exp:${JSON.stringify(q.exp)},xp:${q.xp}}`;

// ── Idempotence : on ne traite que ce qui manque ─────────────────────────
const aAjouter = QUESTIONS.filter(q => !src.includes(`"${q.id}"`) && !src.includes(`'${q.id}'`));
const deja = QUESTIONS.length - aAjouter.length;

console.log(`${QUESTIONS.length} questions au catalogue`);
console.log(`  déjà présentes : ${deja}`);
console.log(`  à ajouter      : ${aAjouter.length}`);

if (aAjouter.length === 0) {
  console.log("\nRien à faire : content.js est déjà à jour.");
  process.exit(0);
}

const parModule = {};
for (const q of aAjouter) parModule[q.courseId] = (parModule[q.courseId] || 0) + 1;
console.log(`  répartition    : ${Object.entries(parModule).map(([m, n]) => `${m} ${n}`).join(", ")}`);

// ── 1. Ajout dans le tableau QUIZ ────────────────────────────────────────
const mQuiz = src.match(/export const QUIZ\s*=\s*\[/);
if (!mQuiz) { console.error("Tableau QUIZ introuvable dans content.js"); process.exit(1); }
const finQuiz = finDeBloc(src, mQuiz.index + mQuiz[0].length - 1);
if (finQuiz < 0) { console.error("Fin du tableau QUIZ introuvable"); process.exit(1); }

const bloc =
  "\n\n  // ── Rééquilibrage rythme et improvisation ────────────────────────────\n" +
  "  // Le module rythme comptait 17 questions pour 24 leçons, dont quatre sans\n" +
  "  // aucune question propre. Le module impro n'avait qu'une question facile.\n" +
  aAjouter.map(q => "  " + serialiser(q)).join(",\n") + ",\n";

src = src.slice(0, finQuiz) + bloc + src.slice(finQuiz);

// ── 2. Rattachement aux leçons ───────────────────────────────────────────
// Une question n'est éligible en révision que si sa leçon d'origine est
// complétée (reviewEngine.isEligible). Sans rattachement, elle serait
// invisible.
const parLecon = {};
for (const q of aAjouter) (parLecon[q.lessonId] ??= []).push(q.id);

let rattaches = 0, crees = 0;
const echecs = [];

for (const [lessonId, ids] of Object.entries(parLecon)) {
  const ancre = src.indexOf(`id: "${lessonId}"`);
  if (ancre < 0) { echecs.push(`${lessonId} (leçon introuvable)`); continue; }

  const ouv = src.lastIndexOf("{", ancre);
  const fin = finDeBloc(src, ouv);
  if (fin < 0) { echecs.push(`${lessonId} (bloc non délimité)`); continue; }

  const objet = src.slice(ouv, fin + 1);
  const mQ = objet.match(/quiz:\s*\[/);
  let nouvelObjet;

  if (mQ) {
    const dq = mQ.index + mQ[0].length - 1;
    const fq = finDeBloc(objet, dq);
    const contenu = objet.slice(dq + 1, fq).trim();
    const ajout = ids.map(x => `"${x}"`).join(", ");
    nouvelObjet = objet.slice(0, dq + 1) + (contenu ? `${contenu}, ${ajout}` : ajout) + objet.slice(fq);
    rattaches += ids.length;
  } else {
    const insertion = `\n        quiz: [${ids.map(x => `"${x}"`).join(", ")}],`;
    const mDur = objet.match(/duration:\s*\d+,/);
    const mT = objet.match(/title:\s*"(?:[^"\\]|\\.)*",/);
    const pos = mDur ? mDur.index + mDur[0].length : (mT ? mT.index + mT[0].length : -1);
    if (pos < 0) { echecs.push(`${lessonId} (point d'insertion introuvable)`); continue; }
    nouvelObjet = objet.slice(0, pos) + insertion + objet.slice(pos);
    crees++; rattaches += ids.length;
  }

  src = src.slice(0, ouv) + nouvelObjet + src.slice(fin + 1);
}

console.log(`\n${rattaches} rattachements de leçon (${crees} tableaux quiz créés)`);
if (echecs.length) console.log(`ÉCHECS : ${echecs.join(", ")}`);

if (!ECRIRE) {
  console.log("\nAperçu seulement. Relance avec --write pour appliquer.");
  process.exit(0);
}

copyFileSync(CIBLE, CIBLE + ".bak");
writeFileSync(CIBLE, src, "utf8");
console.log(`\nÉcrit. Sauvegarde : src/content.js.bak`);
console.log("Étape suivante : npm run check");
