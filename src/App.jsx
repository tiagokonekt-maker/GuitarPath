import { useState } from "react";

const C = {
  purple: "#7F77DD", purpleL: "#EEEDFE", purpleD: "#3C3489",
  teal: "#1D9E75", tealL: "#E1F5EE",
  amber: "#BA7517", amberL: "#FAEEDA",
  coral: "#D85A30", coralL: "#FAECE7",
  blue: "#185FA5", blueL: "#E6F1FB",
  gray: "#888780", grayL: "#F1EFE8",
  text: "var(--color-text-primary)", muted: "var(--color-text-secondary)",
  bg: "var(--color-background-primary)", bgS: "var(--color-background-secondary)",
  border: "var(--color-border-tertiary)",
};

const WEEKS = [
  {
    week: 1, title: "Les fondations", theme: "Pentatonique Am & intervalles",
    objective: "Maîtriser la position 1 de la pentatonique Am et comprendre les intervalles de base.",
    color: C.teal, colorL: C.tealL,
    challenge: "Improvise 2 minutes sans t'arrêter sur une backing track en Am 70bpm. Autorise toutes les notes — l'objectif est la continuité, pas la perfection.",
    checkpoint: "Tu peux jouer des phrases courtes avec silences sur la pentatonique Am pos. 1.",
    days: [
      {
        day: 1, title: "Bienvenue dans la pentatonique",
        theory: { title: "La gamme pentatonique mineure", content: "5 notes issues de la gamme mineure naturelle, en retirant les 2 demi-tons 'tendus' (2e et 6e degrés). Résultat : une gamme qui sonne juste presque quoi que tu joues. Am penta = La Do Ré Mi Sol. Mémorise l'ordre : 1-b3-4-5-b7.", xp: 20 },
        practical: { title: "Position 1 — cartographie", duration: 12, bpm: null, steps: ["Pose la main gauche : index case 5, annulaire case 7, auriculaire case 8.", "Joue chaque note de la corde 6 à la corde 1, lentement, en montant puis en descendant.", "Répète 5 fois en remontant. Ne t'arrête pas sur les erreurs.", "Joue en appuyant sur chaque note 2 secondes — ressens la vibration."], tip: "Avant de jouer vite, joue juste. La vitesse vient seule.", xp: 50 },
        impro: { title: "Exploration libre pos. 1", duration: 10, backing: "Am blues 70bpm", steps: ["Lance une backing track Am 70bpm (YouTube : 'blues backing track A minor 70bpm').", "Joue uniquement 3 notes : La (corde 5, case 7), Do (corde 4, case 5), Ré (corde 4, case 7).", "Répète ces 3 notes dans n'importe quel ordre pendant 5 minutes.", "Les 5 dernières minutes : ajoute Mi (corde 3, case 7) et Sol (corde 3, case 5)."], tip: "Moins de notes = plus de musicalité. Les grands joueurs font beaucoup avec peu.", xp: 60 },
        quiz: { question: "Combien de notes contient la gamme pentatonique ?", options: ["4", "5", "6", "7"], correct: 1, explication: "Penta = 5 en grec. 5 notes, 0 demi-ton, 100% blues.", xp: 30 },
      },
      {
        day: 2, title: "Les intervalles — voir les distances",
        theory: { title: "Demi-ton et ton", content: "Le demi-ton = 1 case sur le manche. Le ton = 2 cases. Tout intervalle se mesure en demi-tons depuis la fondamentale. Tierce mineure = 3 demi-tons, Quinte = 7. Connaître les intervalles, c'est voir les accords et gammes comme des formules.", xp: 20 },
        practical: { title: "Demi-tons et tons sur une corde", duration: 10, bpm: 60, steps: ["Sur la corde de Sol (3e), joue case 0 à 12 en nommant chaque note.", "Sol → Sol# → La → La# → Si → Do → Do# → Ré → Ré# → Mi → Fa → Fa# → Sol.", "Repère les demi-tons naturels : Mi-Fa (cases 4-5) et Si-Do (cases 11-12).", "Joue uniquement ces 2 demi-tons plusieurs fois pour les mémoriser."], tip: "Mi–Fa et Si–Do sont les seuls demi-tons sans dièse. Ancre-les dans ta mémoire.", xp: 40 },
        impro: { title: "Phrase 4 notes, 1 rythme", duration: 10, backing: "Am drone 75bpm", steps: ["Choisis 4 notes de la pentatonique Am pos. 1.", "Joue-les dans cet ordre rythmique : 1-2-et-3 (noire, noire, croche, noire).", "Répète cette phrase 8 fois. Exactement pareil.", "Change l'ordre des 4 notes et recommence."], tip: "La répétition d'une phrase crée une identité musicale. C'est ça, un motif.", xp: 50 },
        quiz: { question: "Combien de demi-tons séparent Do et Ré ?", options: ["1", "2", "3", "4"], correct: 1, explication: "Do → Do# → Ré = 2 demi-tons = 1 ton entier.", xp: 30 },
      },
      {
        day: 3, title: "Le bend — l'émotion du blues",
        theory: { title: "Le bend (tiré)", content: "Le bend consiste à pousser ou tirer une corde pour monter sa hauteur d'un demi-ton (half bend) ou d'un ton (full bend). C'est la technique la plus expressive du rock et du blues. Un bend réussi fait 'chanter' ta guitare.", xp: 20 },
        practical: { title: "Bend sur Sol (corde 3, case 7)", duration: 12, bpm: null, steps: ["Place l'annulaire case 7, corde 3 (Sol). Soutiens avec l'index case 5 et le majeur case 6.", "Pousse vers le bas (vers toi) jusqu'à hausser d'un ton = La. Vérifie : ça doit sonner comme la note à la case 9.", "Fais 20 bends lents. Sens la résistance des cordes.", "Maintenant : joue Mi (case 9), puis bend de Sol à La — même hauteur ? Entraîne l'oreille."], tip: "Le soutien des doigts est crucial. Sans soutien, tu te blesses et le bend sonne faux.", xp: 60 },
        impro: { title: "Phrase avec bend final", duration: 10, backing: "Am slow blues 65bpm", steps: ["Joue la phrase : La (c5 c7) → Mi (c3 c7) → Do (c4 c5).", "Ajoute un bend sur le dernier Do : pousse vers le haut d'un demi-ton.", "Joue cette phrase en boucle 10 fois en changeant le rythme.", "Essaie : vite-vite-lent, puis lent-lent-vite."], tip: "Un bend en fin de phrase, c'est le point d'exclamation de la guitare.", xp: 60 },
        quiz: { question: "Un 'full bend' hausse la note de combien ?", options: ["1 demi-ton", "1 ton", "1 tierce", "1 quinte"], correct: 1, explication: "Full bend = 1 ton entier = 2 demi-tons = 2 cases sur le manche.", xp: 30 },
      },
      {
        day: 4, title: "La gamme mineure naturelle",
        theory: { title: "Mineure naturelle vs pentatonique", content: "La gamme mineure naturelle de La = La Si Do Ré Mi Fa Sol. Elle contient 7 notes. La pentatonique en retire Si et Fa (les plus 'tendus'). Comprendre cette relation te permet de passer de l'une à l'autre en toute fluidité.", xp: 25 },
        practical: { title: "Gamme mineure naturelle Am pos. 1", duration: 12, bpm: 65, steps: ["Position de base : index case 5, extensions en case 6, 7, 8.", "Corde 6 : La(5) Si(7) — Corde 5 : Do(5) Ré(7) — Corde 4 : Mi(5) Fa(6) Sol(7) — Corde 3 : La(5) Si(7) — Corde 2 : Do(5) Ré(6) Mi(8) — Corde 1 : Fa(6) Sol(8) La(8).", "Joue 5 fois montant + descendant au métronome (50bpm).", "Compare avec la pentatonique : trouve Si et Fa, les 2 notes ajoutées."], tip: "Si et Fa créent de la tension. À utiliser avec intention, pas par hasard.", xp: 50 },
        impro: { title: "Pentatonique + 2 notes bonus", duration: 10, backing: "Am rock 80bpm", steps: ["Joue d'abord 2 minutes uniquement pentatonique.", "Ajoute Si (corde 6, case 7 — non, corde 5 case 9) comme note de passage entre La et Do.", "Ajoute Fa (corde 4, case 6) comme note de passage entre Mi et Sol.", "Mélange les deux gammes : penta pour les phrases, Si et Fa pour les transitions."], tip: "Les notes de passage créent du mouvement. Passe dessus vite, ne t'y attarde pas.", xp: 60 },
        quiz: { question: "Quelle note est dans la mineure naturelle de La mais PAS dans la pentatonique ?", options: ["Ré", "Mi", "Si", "Sol"], correct: 2, explication: "Am naturelle = La Si Do Ré Mi Fa Sol. Penta Am = La Do Ré Mi Sol. Si et Fa sont absents de la penta.", xp: 35 },
      },
      {
        day: 5, title: "Le vibrato — ta signature sonore",
        theory: { title: "Le vibrato", content: "Le vibrato consiste à osciller rapidement autour d'une note en variant légèrement sa hauteur. C'est l'une des techniques les plus personnelles de la guitare — chaque joueur a son vibrato unique. Un bon vibrato transforme une note plate en note vivante.", xp: 20 },
        practical: { title: "Développer ton vibrato", duration: 12, bpm: null, steps: ["Sur La (corde 1, case 5) : maintiens la note appuyée.", "Secoue le poignet (pas juste les doigts) en faisant osciller la corde perpendiculairement.", "Commencer LENTEMENT : 1 oscillation par seconde. Écoute la variation de hauteur.", "Accélère progressivement. Objectif : vibrato régulier et expressif en 2 semaines."], tip: "Le vibrato vient du poignet, pas des doigts. Imagine tourner une poignée de porte.", xp: 55 },
        impro: { title: "Tenue de note avec vibrato", duration: 10, backing: "Am slow 60bpm", steps: ["Joue une note et tiens-la 4 temps avec vibrato.", "Change de note toutes les 4 mesures, toujours avec vibrato.", "Essaie de 'dire quelque chose' avec une seule note. Oui, c'est possible.", "Ajoute un bend avant le vibrato : bend d'un demi-ton → vibrato → release."], tip: "BB King dit qu'il peut exprimer une émotion complète avec une seule note bien vibrée.", xp: 60 },
        quiz: { question: "Le vibrato modifie principalement quelle caractéristique du son ?", options: ["Le volume", "La hauteur (pitch)", "Le timbre", "La durée"], correct: 1, explication: "Le vibrato crée une oscillation rapide de la hauteur autour de la note cible.", xp: 30 },
      },
      {
        day: 6, title: "Révision semaine 1 + construction d'accords",
        theory: { title: "Les triades majeures et mineures", content: "Une triade = 3 notes empilées par tierces. Majeure : fondamentale + tierce majeure (4 demi-tons) + quinte (7 demi-tons). Mineure : fondamentale + tierce mineure (3 demi-tons) + quinte (7 demi-tons). La différence majeur/mineur tient à 1 seul demi-ton.", xp: 25 },
        practical: { title: "Révision pentatonique Am — vitesse progressive", duration: 15, bpm: 80, steps: ["Joue la pentatonique Am pos. 1 à 60bpm. Parfaitement propre.", "Monte à 70, puis 80bpm. Arrête si tu perds la propreté.", "Joue maintenant en CROCHES : 8 notes par mesure à 80bpm.", "Termine par 5 minutes d'impro libre — applique bend et vibrato."], tip: "La propreté avant la vitesse. Un bon guitariste lent devient vite un bon guitariste rapide.", xp: 60 },
        impro: { title: "Impro totale — tout ce que tu sais", duration: 10, backing: "Am blues 75bpm", steps: ["10 minutes non-stop sur la backing track.", "Utilise tout : pentatonique, mineure naturelle, bends, vibrato, silences.", "Enregistre-toi (téléphone) — écoute après.", "Note mentalement : qu'est-ce qui sonnait bien ? Qu'est-ce qui manquait ?"], tip: "S'enregistrer est la meilleure forme de feedback. Fais-le au moins 1 fois par semaine.", xp: 70 },
        quiz: { question: "Quelle est la différence entre accord majeur et mineur ?", options: ["La quinte est différente", "La tierce est 1 demi-ton plus bas en mineur", "Le rythme change", "La fondamentale change"], correct: 1, explication: "Majeur : 4 demi-tons jusqu'à la tierce. Mineur : 3 demi-tons. C'est tout — et ça change tout.", xp: 35 },
      },
      {
        day: 7, title: "Défi hebdomadaire + bilan",
        theory: { title: "Les degrés de la gamme", content: "Dans toute gamme, chaque note a un numéro : 1, 2, 3, 4, 5, 6, 7. Ces degrés sont universels — ils fonctionnent dans toutes les tonalités. Am : 1=La, b3=Do, 4=Ré, 5=Mi, b7=Sol. Penser en degrés plutôt qu'en notes te rendra indépendant de la tonalité.", xp: 25 },
        practical: { title: "Mini défi : 2 minutes non-stop", duration: 15, bpm: 70, steps: ["Backing track Am 70bpm. Lance-la.", "Improvise 2 MINUTES ENTIÈRES sans t'arrêter, jamais.", "Si tu te perds : répète la dernière note en vibrato le temps de retrouver une idée.", "Écoute l'enregistrement et identifie ta meilleure phrase de la semaine."], tip: "L'objectif n'est pas d'être parfait mais de ne jamais s'arrêter. Un joueur de blues ne s'arrête jamais.", xp: 80 },
        impro: { title: "Bilan improvisation S1", duration: 10, backing: "Am 70bpm", steps: ["Joue uniquement des phrases courtes (2-4 notes) séparées par des silences.", "Essaie de 'raconter une histoire' en 3 parties : intro calme, montée en tension, résolution.", "Termine toujours sur La (la tonique) — ressens la résolution.", "Comparaison mentale : as-tu progressé depuis le jour 1 ?"], tip: "Une bonne improvisation a une forme narrative. Début, développement, fin.", xp: 70 },
        quiz: { question: "Dans la gamme de La mineur, quel est le 5e degré ?", options: ["Sol", "Mi", "Ré", "Do"], correct: 1, explication: "La(1) Si(2) Do(3) Ré(4) Mi(5). Le 5e degré de Am = Mi. C'est la note la plus stable après la tonique.", xp: 35 },
      },
    ],
  },
  {
    week: 2, title: "L'harmonie en action", theme: "Accords, progressions & pentatonique pos. 2",
    objective: "Comprendre les progressions d'accords et connecter la théorie aux sons que tu joues déjà.",
    color: C.purple, colorL: C.purpleL,
    challenge: "Joue la progression Am–F–C–G en boucle et improvise par-dessus en Am penta. 3 minutes non-stop.",
    checkpoint: "Tu connais les accords diatoniques de Am et tu peux improviser sur une grille I-VII-III-VII.",
    days: [
      { day: 1, title: "La gamme diatonique et ses accords", theory: { title: "Accords diatoniques de Am", content: "Chaque degré d'une gamme génère un accord. En La mineur naturel : Im=Am, IIdiim=Bdim, bIII=C, IVm=Dm, Vm=Em, bVI=F, bVII=G. La progression I-bVII-bVI-bVII (Am-G-F-G) est l'une des plus utilisées en rock.", xp: 25 }, practical: { title: "Balayage des accords diatoniques", duration: 12, bpm: 70, steps: ["Joue Am – Dm – Em en accords barrés ou ouverts.", "Transition Am→Dm : tiens l'annulaire sur La (corde 4, case 7), déplace les autres.", "Joue la progression Am–F–C–G en ronde (4 temps chacun) à 70bpm.", "Répète 10 fois en maintenant un tempo régulier."], tip: "Les transitions fluides viennent de la recherche du mouvement minimal entre accords.", xp: 55 }, impro: { title: "Impro sur Am-F-C-G", duration: 10, backing: "Am F C G pop rock 80bpm", steps: ["Backing track : Am-F-C-G à 80bpm.", "Improvise en Am penta pos. 1. Essaie d'atterrir sur La à chaque retour de Am.", "Fois 2 : atterris sur Do à chaque retour de C.", "Connecter ses phrases aux accords = jouer 'dans' la grille."], tip: "Quand tu cibles la note de l'accord courant, tu passes de 'joueur' à 'musicien'.", xp: 65 }, quiz: { question: "Quel accord est sur le IVe degré de La mineur naturel ?", options: ["Em", "Dm", "F", "G"], correct: 1, explication: "La(I) Si(II) Do(III) Ré(IV). L'accord sur Ré en mineur = Dm.", xp: 35 } },
      { day: 2, title: "Position 2 de la pentatonique Am", theory: { title: "Les 5 positions de la pentatonique", content: "La pentatonique Am a 5 positions qui couvrent tout le manche. Chaque position partage des notes avec les voisines — elles sont connectées. Position 2 commence case 8 (avec l'index). Mémoriser les 5 positions = liberté totale sur le manche.", xp: 25 }, practical: { title: "Position 2 — apprentissage", duration: 15, bpm: 60, steps: ["Position 2 : Index case 8, majeur case 9, auriculaire case 10.", "C6: La(8)Do(10) — C5: Ré(8)Mi(10) — C4: Sol(9)La(10) — C3: Do(10) Ré(12) — C2: Mi(8) Sol(10) — C1: La(8)Do(10).", "Joue 10 fois montant/descendant à 50bpm. Attention à la corde 4 (2 notes décalées).", "Alterner pos. 1 et pos. 2 : monter en pos. 1, descendre en pos. 2."], tip: "La case 8 en pos. 2 = case 5 en pos. 1. Ce sont les mêmes notes, juste dans une autre région du manche.", xp: 65 }, impro: { title: "Navette pos. 1 → pos. 2", duration: 10, backing: "Am 75bpm", steps: ["2 phrases en pos. 1 (cases 5-8), puis slide ou saut vers pos. 2 (cases 8-12).", "La case 8 est le pivot : elle appartient aux deux positions.", "Joue une phrase qui monte de pos. 1 à pos. 2 et redescend.", "Enregistre : sonne-t-il plus ouvert en pos. haute ?"], tip: "Monter dans les positions = monter en tension. Descendre = résoudre. C'est de la dramaturgie musicale.", xp: 65 }, quiz: { question: "Quelle case est le point de jonction entre pos. 1 et pos. 2 en Am penta ?", options: ["Case 5", "Case 7", "Case 8", "Case 10"], correct: 2, explication: "Case 8 = La, la tonique. Elle appartient aux deux positions et sert de pivot naturel.", xp: 35 } },
      { day: 3, title: "Le hammer-on et le pull-off", theory: { title: "Legato : hammer-on et pull-off", content: "Le hammer-on : tu picks une note et 'marteaux' la suivante avec un autre doigt sans repicker. Pull-off : l'inverse — tu 'tires' le doigt pour faire sonner la note inférieure. Ces deux techniques créent le son 'legato' (lié), fluide et rapide.", xp: 20 }, practical: { title: "HO/PO sur la pentatonique", duration: 12, bpm: 65, steps: ["HO : corde 3, case 5 (pick) → case 7 (hammer sans pick). Répète 20x.", "PO : corde 3, cases 5 et 7 posées, pick case 7 → pull vers case 5. Répète 20x.", "Combine : pick case 5, HO case 7, PO retour case 5. En boucle.", "Applique à toutes les cordes de la pentatonique pos. 1."], tip: "Le hammer-on doit sonner aussi fort que la note pickée. Frappe, ne pose pas.", xp: 60 }, impro: { title: "Phrases legato en pentatonique", duration: 10, backing: "Am funk 85bpm", steps: ["Joue uniquement des paires HO/PO en Am penta. Pas de notes isolées.", "Résultat : son fluide et rapide même à tempo modéré.", "Construis une phrase de 8 notes avec 3 HO et 2 PO.", "Alterne : 1 phrase legato, 1 phrase picking. Entends la différence."], tip: "Le legato crée de la fluidité. Le picking crée de l'attaque. Les deux ensemble = expression complète.", xp: 60 }, quiz: { question: "Le 'pull-off' produit quel type de son ?", options: ["Plus d'attaque qu'un picking", "Un son lié sans repicking", "Un effet de distorsion", "Une note plus haute"], correct: 1, explication: "Pull-off = pas de picking, son produit par le retrait du doigt. Résultat : son lié, legato.", xp: 30 } },
      { day: 4, title: "La progression ii-V-I", theory: { title: "Le ii-V-I : pivot de la musique tonale", content: "La progression ii-V-I est la plus importante du jazz et d'une bonne partie de la musique occidentale. En Do majeur : Dm7 – G7 – Cmaj7. Le V crée une tension maximale vers le I. Comprendre ii-V-I, c'est comprendre le mouvement harmonique.", xp: 30 }, practical: { title: "Arpeggios Am Dm Em", duration: 12, bpm: 70, steps: ["Arpège Am (case 5) : La(c6)-Do(c5)-Mi(c4)-La(c3)-Do(c2)-Mi(c1).", "Arpège Dm (case 5) : Ré(c4)-Fa(c3)-La(c2)-Ré(c1).", "Arpège Em (case 7) : Mi(c6)-Si(c5)-Mi(c4)-Sol(c3)-Si(c2)-Mi(c1).", "Joue Am → Dm → Em → Am en arpèges à 70bpm. Sens les tensions."], tip: "Un arpège = les notes d'un accord jouées une par une. C'est le pont entre accord et mélodie.", xp: 55 }, impro: { title: "Cibler les notes d'accord", duration: 10, backing: "Am Dm Em progression 75bpm", steps: ["Sur Am : commence et termine tes phrases sur La.", "Sur Dm : vise Ré ou Fa comme note d'appui.", "Sur Em : vise Mi ou Sol.", "Ne force pas — commence par les temps forts (temps 1 et 3)."], tip: "Cibler 1 note par accord suffit pour commencer. La note cible peut être n'importe où dans la phrase.", xp: 65 }, quiz: { question: "Dans ii-V-I en Do majeur, quel est le accord V ?", options: ["Dm", "Em", "G", "Am"], correct: 2, explication: "Do majeur : I=Do, II=Ré, III=Mi, IV=Fa, V=Sol, VI=La, VII=Si. L'accord sur Sol = G (majeur, car c'est la gamme majeure).", xp: 35 } },
      { day: 5, title: "Rythme : syncopes et groove", theory: { title: "La syncope", content: "Une syncope = une note accentuée sur un temps faible (les 'et' entre les temps). Au lieu de jouer 1-2-3-4, tu joues sur 1-et-3-et. C'est ce qui donne le groove au blues, au funk et au rock. Sentir la syncope, c'est sentir le swing.", xp: 25 }, practical: { title: "Rhythm guitar : riff syncopé", duration: 12, bpm: 80, steps: ["Joue Am en accords étouffés (palm mute) sur chaque temps : 1-2-3-4.", "Maintenant, joue sur : 1 — et-de-2 — 3 — et-de-4 (syncopes sur les 'et').", "Strumming pattern : down-down up-down-up down.", "Répète avec F, C, G. La progression Am-F-C-G avec ce rythme."], tip: "Mets une pression légère de la paume sur les cordes près du chevalet pour l'effet palm mute.", xp: 60 }, impro: { title: "Improvisation syncopée", duration: 10, backing: "Am groove 85bpm", steps: ["Joue des phrases qui commencent sur le 'et' du temps 2 (pas sur le temps 1).", "Résultat : tes phrases sonnent 'en avance', créent de la tension.", "Alterne : phrase sur le temps → phrase sur le contretemps.", "Écoute si tu sens le groove différemment."], tip: "Un solo qui commence toujours sur le temps 1 sonne 'carré'. Décale et tu swingues.", xp: 65 }, quiz: { question: "Une syncope place l'accent sur...", options: ["Le temps fort (1, 2, 3, 4)", "Le temps faible (les 'et')", "La dernière note", "Le silence"], correct: 1, explication: "Syncope = accent déplacé sur les contretemps. C'est la source du groove en blues, jazz et funk.", xp: 30 } },
      { day: 6, title: "Révision S2 + gamme blues", theory: { title: "La gamme blues", content: "Pentatonique mineure + 1 note : la b5 (quinte diminuée, appelée 'blue note'). En Am : La Do Ré Ré# Mi Sol. Le Ré# (entre Ré et Mi) crée une tension caractéristique du blues. Utilise-le comme note de passage, jamais comme point d'arrivée.", xp: 25 }, practical: { title: "Intégrer la blue note", duration: 12, bpm: 70, steps: ["Pentatonique Am pos. 1. Ajoute Ré# (corde 4, case 6) entre Ré(5) et Mi(7).", "Joue : Ré(5) → Ré#(6) → Mi(7) sur la corde 4. Sens la tension.", "Descends : Mi(7) → Ré#(6) → Ré(5). La dissonance résout.", "Intègre dans des phrases : n'y reste jamais, passe dessus."], tip: "La blue note sonne 'fausse' tenue, mais 'parfaite' de passage. C'est toute la magie du blues.", xp: 60 }, impro: { title: "Blues complet : penta + blue note", duration: 10, backing: "Slow blues Am 65bpm", steps: ["10 minutes de blues. Utilise librement : penta pos. 1 et 2, blue note, bends, vibrato, HO/PO.", "Objectif : 3 phrases avec la blue note en passage.", "Enregistre et écoute.", "Identifie la phrase qui sonnait le plus 'blues'."], tip: "Le blues est une conversation. Question (montée de tension) → réponse (résolution).", xp: 70 }, quiz: { question: "La 'blue note' en Am est...", options: ["Ré", "Mi♭", "Ré# / Mi♭", "Fa"], correct: 2, explication: "La blue note en Am = Ré# ou Mi♭ (même note, deux noms). C'est la quinte diminuée ou quarte augmentée.", xp: 35 } },
      { day: 7, title: "Défi S2 + checkpoint progression", theory: { title: "Récap harmonique S1-S2", content: "Tu connais maintenant : pentatonique Am (pos. 1 et 2), gamme mineure naturelle, gamme blues, construction des accords, degrés, HO/PO, bend, vibrato, syncope. C'est une base solide. La semaine 3 va tout connecter avec les modes.", xp: 20 }, practical: { title: "Défi : Am-F-C-G 3 minutes", duration: 15, bpm: 80, steps: ["Lance la backing Am-F-C-G 80bpm.", "Improvise 3 MINUTES ENTIÈRES. Ne t'arrête jamais.", "Règle : 1 phrase par accord. Quand l'accord change, ta phrase change.", "Enregistre. Écoute et note tes 3 meilleures idées."], tip: "3 minutes c'est long. C'est normal de se perdre. Reviens toujours à La comme ancre.", xp: 90 }, impro: { title: "Bilan S2 : joue ce que tu ressens", duration: 10, backing: "Am 70bpm", steps: ["Joue en pensant à une émotion : colère, mélancolie, joie, etc.", "Laisse cette émotion guider tes choix : notes hautes ou basses, rapide ou lent.", "Pas de règles cette fois — juste toi et la musique.", "Question finale : comment sonne ta guitare par rapport à la semaine 1 ?"], tip: "La technique est au service de l'expression. Pas l'inverse.", xp: 70 }, quiz: { question: "Laquelle de ces progressions est I-bVI-bVII en Am ?", options: ["Am-F-G", "Am-Dm-Em", "Am-G-F", "Dm-G-Am"], correct: 0, explication: "En Am : I=Am(La), bVI=F(Fa), bVII=G(Sol). Am-F-G = I-bVI-bVII. Progression iconique du rock.", xp: 40 } },
    ],
  },
  {
    week: 3, title: "Les modes — ouvrir l'horizon", theme: "Dorien, Mixolydien & positions du manche",
    objective: "Comprendre et utiliser les modes dorien et mixolydien pour enrichir l'improvisation.",
    color: C.blue, colorL: C.blueL,
    challenge: "Improvise 4 minutes sur un drone Ré en mode dorien (gamme de Do, en commençant par Ré). Reste sur les notes du mode.",
    checkpoint: "Tu peux identifier et jouer les modes dorien et mixolydien et tu connais les notes sur les 3 premières cordes.",
    days: [
      { day: 1, title: "Introduction aux modes", theory: { title: "C'est quoi un mode ?", content: "Un mode = jouer une gamme en partant d'un degré différent. Gamme de Do : C D E F G A B. Si tu joues les mêmes notes mais en partant de Ré → Ré Mi Fa Sol La Si Do Ré = mode Dorien. Même notes, autre fondamentale, autre couleur sonore.", xp: 30 }, practical: { title: "Gamme de Do en 7 modes", duration: 12, bpm: 60, steps: ["Joue Do majeur pos. ouverte ou case 8 (corde 6).", "Maintenant joue les mêmes notes en partant de Ré (case 10). Écoute le changement.", "Répète en partant de Mi, Fa, Sol, La, Si.", "Compare Do ionien (joyeux) vs La éolien (triste) — même notes, effet opposé !"], tip: "Les modes ne sont pas de nouvelles gammes à mémoriser — ce sont de nouveaux points d'écoute.", xp: 55 }, impro: { title: "Drone Do vs Drone Ré", duration: 10, backing: "Do drone + Ré drone", steps: ["5 min sur drone Do : joue gamme Do majeur. Son = ionien, lumineux.", "5 min sur drone Ré : mêmes notes mais tout part de Ré. Son = dorien, plus sombre.", "La différence de son vient uniquement du drone, pas des notes jouées.", "Laquelle tu préfères ?"], tip: "Le drone révèle la couleur d'un mode. C'est l'outil de travail des modes par excellence.", xp: 60 }, quiz: { question: "Le mode dorien se construit à partir de quel degré de la gamme majeure ?", options: ["1er", "2e", "4e", "5e"], correct: 1, explication: "Ionien=1, Dorien=2, Phrygien=3, Lydien=4, Mixolydien=5, Éolien=6, Locrien=7.", xp: 40 } },
      { day: 2, title: "Le mode dorien en profondeur", theory: { title: "Couleur du dorien", content: "Dorien = mineur avec une 6te majeure. Ré dorien : Ré Mi Fa Sol La Si Do. La Si est la note caractéristique (sixte maj). Son : blues-jazz-funk. Utilisé dans : 'So What' (Miles Davis), 'Oye Como Va' (Santana), 'Smoke on the Water' (Deep Purple).", xp: 30 }, practical: { title: "Ré dorien sur le manche", duration: 15, bpm: 65, steps: ["Ré dorien case 10 (même shape que Am naturel à case 5, décalé de 5 cases).", "Ou joue-le en position ouverte : Ré(c4-0) Mi(c4-2) Fa(c4-3) Sol(c3-0) La(c3-2) Si(c3-4) Do(c2-1).", "Identifie Si, la 6te majeure caractéristique. Note : si tu joues Am naturel case 5, c'est La dorien.", "Joue la gamme 10x à 60bpm en écoutant chaque intervalle."], tip: "La forme de la gamme dorien sur le manche est identique à la mineure naturelle. Seule la tonique change.", xp: 60 }, impro: { title: "Impro dorien sur groove funk", duration: 10, backing: "D dorien funk 90bpm", steps: ["Backing track : accord Dm7 en boucle (son dorien).", "Joue Ré dorien. Mets en valeur Si (la note caractéristique).", "Construis une phrase qui monte vers Si puis redescend vers Ré.", "Essaie des phrases courtes, syncopées (tu as travaillé ça la semaine passée !)."], tip: "Dorien sur Dm7 = son Santana. Dorien sur accord 7 = son jazz-blues. C'est un mode très polyvalent.", xp: 65 }, quiz: { question: "Quelle note rend le mode dorien différent du mode éolien (mineur naturel) ?", options: ["La quarte augmentée", "La sixte majeure", "La tierce majeure", "La septième majeure"], correct: 1, explication: "Éolien : 1 2 b3 4 5 b6 b7. Dorien : 1 2 b3 4 5 6 b7. La différence = la 6te : majeure en dorien, mineure en éolien.", xp: 40 } },
      { day: 3, title: "Le mixolydien — son du rock", theory: { title: "Mixolydien : majeur avec la b7", content: "Mixolydien = gamme majeure avec la 7e abaissée d'un demi-ton. Sol mixolydien : Sol La Si Do Ré Mi Fa (pas Fa#). Son : rock, blues, country. Utilisé partout : 'Sweet Home Chicago', riffs de Led Zeppelin, Hendrix. C'est le son des dominantes en jazz.", xp: 30 }, practical: { title: "Sol mixolydien", duration: 12, bpm: 65, steps: ["Sol mixolydien case 3 (corde 6) : Sol(3) La(5) Si(7) Do(8) Ré(5) Mi(7) Fa(8) Sol(5).", "Différence avec Sol majeur : Fa naturel au lieu de Fa#. Trouve ce Fa.", "Joue montant/descendant 8x à 60bpm. Écoute le Fa qui 'descend' vers Sol.", "Compare avec Sol majeur : joue Fa# (case 9 corde 4) puis Fa (case 8). Entends la différence ?"], tip: "Le Fa naturel dans un contexte de Sol donne ce son 'bluesy' caractéristique. C'est la tension de la dominante.", xp: 55 }, impro: { title: "Impro mixolydien sur accord G7", duration: 10, backing: "G7 rock 80bpm", steps: ["Backing track G7 (ou une grille de blues en Sol).", "Joue Sol mixolydien. Mets en valeur Fa (la note caractéristique).", "Essaie de descendre chromatiquement : La → Sol# → Sol. Son très blues.", "Mixe penta Sol majeure (même cases que Am penta à -3 cases) et mixolydien."], tip: "Sur un accord de dominante (X7), le mixolydien est toujours une bonne option.", xp: 65 }, quiz: { question: "Le mixolydien se forme à partir de quel degré de la gamme majeure ?", options: ["3e", "4e", "5e", "6e"], correct: 2, explication: "Mixolydien = 5e mode. Sol majeur → si on commence sur Sol (5e degré de Do), on obtient Sol mixolydien.", xp: 40 } },
      { day: 4, title: "Notes sur le manche — cordes 6, 5, 4", theory: { title: "Repères du manche", content: "Pour naviguer librement, mémorise les notes naturelles sur les cordes basses. Corde 6 (Mi) : Mi Fa Sol La Si Do Ré Mi. Corde 5 (La) : La Si Do Ré Mi Fa Sol La. Astuce : case 12 = même note que corde à vide, une octave plus haut. Repères visuels : points sur le manche aux cases 3, 5, 7, 9, 12.", xp: 25 }, practical: { title: "Dictée visuelle du manche", duration: 12, bpm: null, steps: ["Corde 6 : nomme à voix haute chaque note de case 0 à 12 en jouant.", "Corde 5 : pareil. Prends 3 minutes par corde.", "Test : sans regarder — joue tous les Sol sur cordes 6 et 5. (Sol = case 3 sur c6, case 10 sur c5).", "Test 2 : tous les La sur cordes 6 et 5. (La = case 5 sur c6, case 0 sur c5)."], tip: "Mémorise 3 notes repères sur chaque corde : La corde à vide, sa tierce, et son octave (case 12).", xp: 55 }, impro: { title: "Octaves sur le manche", duration: 10, backing: "Am 75bpm", steps: ["Les octaves : même note, register différent. De La(c6 case 5), l'octave est à La(c4 case 7).", "Joue une phrase en position basse, puis la même phrase une octave plus haut.", "Alterne bas/haut dans ton impro pour créer des dynamiques.", "Le grave = sombre/puissant. L'aigu = lumineux/intense."], tip: "Jouer une même phrase à différentes octaves est une technique professionnelle facile à maîtriser.", xp: 60 }, quiz: { question: "Sur la corde de La (5e corde), quelle note se trouve à la case 7 ?", options: ["Mi", "Ré", "Si", "Do"], correct: 1, explication: "La(0) Si(2) Do(3) Ré(5) Mi(7). La case 7 de la corde de La = Mi.", xp: 35 } },
      { day: 5, title: "Phrasing avancé — question/réponse", theory: { title: "Le phrasing musical", content: "Le phrasing = l'art de construire des phrases musicales. Une bonne phrase a une tension et une résolution. Technique Q&A (question/réponse) : la phrase 'question' monte et se termine en suspension. La phrase 'réponse' descend et résout sur la tonique.", xp: 25 }, practical: { title: "Construction de phrases Q&A", duration: 12, bpm: 75, steps: ["Phrase question : commence sur Do (c4, case 5), monte vers Sol (c3, case 5), termine sur Mi (c3, case 7) — laisse en suspension.", "Phrase réponse : commence sur Mi, descends vers Do puis La (tonique). Stop sur La.", "Joue ces 2 phrases en boucle à 75bpm. Sens la tension/résolution.", "Invente 3 nouvelles paires Q&A avec les notes de la penta Am."], tip: "La résolution sur La crée une sensation d'arrivée. La résolution sur Mi ou Do crée une demi-résolution, plus sophistiquée.", xp: 60 }, impro: { title: "Dialogue musical", duration: 10, backing: "Am 80bpm", steps: ["Toute l'impro en Q&A strictement : question (4 temps) → réponse (4 temps).", "Les réponses ne doivent jamais répéter les mêmes notes dans le même ordre.", "Laisse des silences entre Q et A. La respiration, c'est le silence.", "Enregistre et écoute : entends-tu la conversation ?"], tip: "Miles Davis disait que les notes que tu ne joues pas sont aussi importantes que celles que tu joues.", xp: 65 }, quiz: { question: "Dans une phrase musicale 'question', la mélodie doit typiquement...", options: ["Descendre vers la tonique", "Monter ou finir en suspension", "Répéter la même note", "Rester dans les graves"], correct: 1, explication: "Question = tension = mélodie montante ou finissant sur une note instable (tierce, septième). Réponse = résolution sur tonique.", xp: 35 } },
      { day: 6, title: "Le système CAGED — introduction", theory: { title: "CAGED : 5 formes d'accords", content: "CAGED = C A G E D, les 5 formes d'accords ouverts. Chaque forme peut glisser sur le manche sous forme de barre pour jouer n'importe quel accord. Forme C → glisse case 3 = accord Ré. Comprendre CAGED = voir les accords partout sur le manche.", xp: 30 }, practical: { title: "Formes CAGED en Am", duration: 15, bpm: 60, steps: ["Forme E (case 5) = Am barré classique. Mémorisée ✓", "Forme A (case 5) : Am sur cordes 2-3-4 (mini-barre case 7 sur cordes 1-2).", "Forme C (case 8) : forme complexe, commence par l'index case 8, corde 5.", "Joue Am sous ses 3 formes. Ce sont les mêmes notes, juste réparties différemment."], tip: "CAGED n'est pas une technique de plus — c'est une carte du manche. Ça change tout.", xp: 70 }, impro: { title: "Impro autour d'une forme d'accord", duration: 10, backing: "Am 75bpm", steps: ["Installe-toi dans la forme E de Am (case 5). Improvise dans les notes autour.", "Déplace vers la forme A (case 7-8). Improvise dans cette zone.", "Le concept : improviser 'autour' de la forme de l'accord = trouver les notes naturellement.", "Avantage : tu n'as plus besoin de mémoriser des positions séparément."], tip: "Chaque position de la pentatonique correspond à une forme CAGED. Le manche est un tout cohérent.", xp: 65 }, quiz: { question: "Le système CAGED décrit...", options: ["5 techniques de picking", "5 positions d'accords ouverts transposables", "5 gammes différentes", "5 modes"], correct: 1, explication: "CAGED = C, A, G, E, D : les 5 formes d'accords ouverts. En les décalant sur le manche, tu couvres tout.", xp: 40 } },
      { day: 7, title: "Checkpoint S3 + défi modes", theory: { title: "Bilan modes et phrasing", content: "Tu connais maintenant dorien (mineur jazz/funk), mixolydien (rock/blues), et le concept de mode. Tu comprends que le son change selon la tonique, pas les notes. Tu as les outils pour colorer ton jeu selon l'accord courant.", xp: 25 }, practical: { title: "Défi : drone Ré en dorien", duration: 15, bpm: null, steps: ["Drone Ré (application métronome avec bourdon, ou YouTube 'D drone').", "Joue Ré dorien (= gamme de Do, en partant de Ré). 4 MINUTES non-stop.", "Utilise : phrasing Q&A, bends, vibrato, octaves, blue note si inspiration.", "Enregistre les 4 minutes et écoute."], tip: "4 minutes, c'est un morceau complet. Tu es en train de composer, pas seulement d'improviser.", xp: 90 }, impro: { title: "Mode vs blues : compare les couleurs", duration: 10, backing: "Am 75bpm", steps: ["2 min : improvise en Am pentatonique pur (son blues classique).", "2 min : improvise en La dorien (ajoute Si = 9e/6te). Son jazz/funk.", "2 min : improvise en La mixolydien (même notes, ajoute Sol# supprimé). Son rock/country.", "Quelle couleur préfères-tu ?"], tip: "Maintenant tu peux CHOISIR ta couleur sonore. C'est la vraie maîtrise musicale.", xp: 70 }, quiz: { question: "Quel mode sonne 'rock/blues' et se construit sur le 5e degré ?", options: ["Dorien", "Phrygien", "Mixolydien", "Lydien"], correct: 2, explication: "Mixolydien = 5e mode. Majeur avec b7. Son de Hendrix, Zeppelin, Stones. Le mode du rock.", xp: 40 } },
    ],
  },
  {
    week: 4, title: "Harmonie avancée", theme: "Accords de 7e, substitutions & improvisation sur accords",
    objective: "Comprendre et jouer des accords de 7e, utiliser les arpeggios dans l'improvisation.",
    color: C.coral, colorL: C.coralL,
    challenge: "Joue un ii-V-I en La mineur (Bm7b5 – E7 – Am7) en arpèges et improvise par-dessus.",
    checkpoint: "Tu construis les 4 types d'accords de 7e et tu improvises en ciblant les notes de l'accord courant.",
    days: [
      { day: 1, title: "Accords de 7e : les 4 types", theory: { title: "Maj7, m7, 7, m7b5", content: "4 types fondamentaux : Maj7 = majeur + 7e majeure (son jazz lumineux). m7 = mineur + 7e mineure (son funky). 7 (dominante) = majeur + 7e mineure (tension). m7b5 = mineur + quinte diminuée + 7e mineure (son instable, utilisé sur le IIe degré mineur).", xp: 35 }, practical: { title: "Voicings de 7e en position fermée", duration: 15, bpm: 60, steps: ["Amaj7 (case 5) : shape Em avec majeur sur case 6 corde 2 (note Fa → Fa#→ Sol# → La).", "Am7 (case 5) : enlève le Si de la forme Em — index barré case 5, majeur c4 case 7, auriculaire c3 case 7.", "E7 (case 7) : forme A7 barrée case 7.", "Joue Am7 → Dm7 → E7 → Am7. Sens la tension du E7 qui résout sur Am7."], tip: "Les accords de 7e donnent immédiatement un son plus sophistiqué. 1 note supplémentaire, tout change.", xp: 65 }, impro: { title: "Arpeggios Am7 Dm7 E7", duration: 10, backing: "Am7 Dm7 E7 jazz 70bpm", steps: ["Am7 arpège : La Do Mi Sol. Dm7 : Ré Fa La Do. E7 : Mi Sol# Si Ré.", "Sur chaque accord, joue uniquement ses 4 notes en arpège.", "Puis mélange : penta + arpège de l'accord courant.", "Sol# (note caractéristique de E7) crée une tension magnifique qui résout sur La."], tip: "L'arpège de l'accord courant = improvisation parfaitement en harmonie. C'est le secret du jazz.", xp: 70 }, quiz: { question: "Quelles notes composent un accord Maj7 sur Do ?", options: ["Do Mi Sol Si", "Do Mi Sol Si♭", "Do Mi♭ Sol Si", "Do Ré Mi Sol"], correct: 0, explication: "Cmaj7 = Do(1) + Mi(3) + Sol(5) + Si(7). La 7e majeure de Do = Si naturel (11 demi-tons de Do).", xp: 40 } },
      { day: 2, title: "Le ii-V-I mineur", theory: { title: "Cadence mineure", content: "En La mineur : IIe = Bm7b5 (Si-Ré-Fa-La), Ve = E7 (Mi-Sol#-Si-Ré), Ie = Am7. E7 → Am7 est la résolution la plus forte en mineur. Le Sol# de E7 monte d'un demi-ton vers La. C'est une 'note de guidage' (guide tone).", xp: 35 }, practical: { title: "ii-V-I en Am sur le manche", duration: 12, bpm: 65, steps: ["Bm7b5 : forme de Bm7 avec la quinte (Fa#) baissée d'un demi-ton → Fa naturel.", "E7 : forme classique case 7 (barre) ou position ouverte.", "Am7 : forme case 5.", "Joue la cadence Bm7b5 → E7 → Am7 × 10. Écoute Sol# → La sur E7→Am."], tip: "Le Sol# est la 'leading note' qui veut absolument monter vers La. Sens cette attraction.", xp: 60 }, impro: { title: "Improviser sur ii-V-I mineur", duration: 10, backing: "ii-V-I Am jazz 70bpm", steps: ["Sur Bm7b5 : joue Ré ou Fa (notes caractéristiques de l'accord).", "Sur E7 : joue Sol# (3e de E7, note de tension par excellence).", "Sur Am7 : résous sur La ou Do.", "Construis des lignes qui 'guident' d'un accord à l'autre."], tip: "Guide tones = 3e et 7e de chaque accord. Ce sont les notes qui définissent la qualité de l'accord.", xp: 70 }, quiz: { question: "Dans Am, quel accord joue-t-on sur le 5e degré pour créer la plus forte tension ?", options: ["Em (mineur)", "E7 (dominante)", "Esus4", "Emaj7"], correct: 1, explication: "E7 contient Sol# qui 'veut' monter vers La. Cette attraction d'un demi-ton crée la tension maximale.", xp: 40 } },
      { day: 3, title: "Substitution tritonique — introduction", theory: { title: "Substitution tritonique", content: "Le triton = intervalle de quarte augmentée (6 demi-tons). Deux accords de dominante à distance de triton partagent les mêmes guide tones (3e et 7e interverties). E7 peut être substitué par Bb7. Cette substitution crée des lignes chromatiques élégantes.", xp: 40 }, practical: { title: "Mouvement chromatique", duration: 12, bpm: 65, steps: ["Sur Am, joue une ligne descendante : La – Sol# – Sol – Fa# – Fa – Mi – Mi♭ – Ré – Do#– Do – Si – La.", "Ce mouvement chromatique descend par demi-tons = effet sophistiqué.", "Joue-le sur 2 octaves à 60bpm.", "Intègre ce mouvement dans une phrase : phrase pentatonique → ligne chroma finale."], tip: "Le chromatisme est l'outil du jazz. Quelques notes de passage chromatiques transforment n'importe quelle phrase.", xp: 65 }, impro: { title: "Chromatisme et résolution", duration: 10, backing: "Am jazz 75bpm", steps: ["Approche par demi-ton : avant de jouer La, joue Si♭ juste avant (demi-ton du dessus).", "Avant Do, joue Do# (demi-ton du dessous).", "Ces 'chromatic approaches' donnent immédiatement un son jazz.", "Règle : la note d'approche dure moins d'un temps, la note cible doit tomber sur un temps fort."], tip: "L'approche chromatique = 1 demi-ton au-dessus ou en dessous de la note cible. Classique du bebop.", xp: 70 }, quiz: { question: "Le triton divise l'octave en...", options: ["Deux quintes", "Deux quartes égales", "Deux tierces", "Deux tons entiers"], correct: 1, explication: "Triton = 6 demi-tons. Une octave = 12 demi-tons. 12/2 = 6. Le triton divise l'octave exactement en deux.", xp: 40 } },
      { day: 4, title: "Arpèges sur tout le manche", theory: { title: "Cartographie des arpèges", content: "Chaque accord peut s'arpeggier dans toutes les positions du manche, comme une gamme. Am7 sur tout le manche : trouve toutes les combinaisons La-Do-Mi-Sol dans toutes les positions. Un arpège = une gamme à 4 notes. Pense 'arpège' pour les solos sur accords de jazz.", xp: 30 }, practical: { title: "Am7 dans 3 positions", duration: 15, bpm: 60, steps: ["Position 1 (case 5) : La(c6-5) Do(c5-5) Mi(c4-7) Sol(c3-5) La(c2-5) Do(c1-8).", "Position 2 (case 8) : Do(c6-8) Mi(c5-7) Sol(c4-9) La(c3-9) Do(c2-8).", "Position 3 (case 12) : La(c6-12) Do(c5-12) Mi(c4-14) Sol(c3-12).", "Connecte les 3 positions en jouant un arpège continu de case 5 à case 14."], tip: "Voir un accord en arpège sur tout le manche = tu ne joues plus 'dans une position', tu joues sur le manche entier.", xp: 70 }, impro: { title: "Solo arpèges Am7 Dm7 G7", duration: 10, backing: "Am7 Dm7 G7 Cmaj7 jazz 70bpm", steps: ["Backing track jazz (Am7-Dm7-G7-Cmaj7 = progression i-iv-VII-III en La mineur).", "Sur chaque accord, joue uniquement l'arpège de cet accord.", "Connecte les arpèges : la dernière note d'un arpège doit être proche de la première du suivant.", "Après 5 min : mélange arpèges + gamme Am naturelle + penta."], tip: "Les arpèges créent des lignes mélodiques qui 'suivent' l'harmonie. C'est le fondement du bop.", xp: 70 }, quiz: { question: "Quelles sont les notes de l'arpège Am7 ?", options: ["La Do Mi Sol", "La Si Mi Sol", "La Do Mi Sol#", "La Do Ré Mi"], correct: 0, explication: "Am7 = La(1) + Do(b3) + Mi(5) + Sol(b7). Accord de La mineur avec la septième mineure.", xp: 40 } },
      { day: 5, title: "Pentatonique sur accords complexes", theory: { title: "Pentatoniques superposées", content: "Technique avancée : jouer la pentatonique d'une autre tonalité sur un accord. Sur Am7 : joue Do majeur penta (Do Ré Mi Sol La) = son jazzé. Sur E7 : joue Si majeur penta (Si Ré# Fa# La Si) = toutes les tensions de E7. C'est le secret du 'son jazz' avec des formes familières.", xp: 40 }, practical: { title: "Pentatonique de la tierce sur Am7", duration: 12, bpm: 70, steps: ["Do majeur pentatonique : Do Ré Mi Sol La (position case 8-10).", "Joue Do maj penta sur un accord Am7 en backing. Ça sonne jazzé !", "Ces notes sont : Do(b3), Ré(11), Mi(5), Sol(b7), La(1). Toutes des belles tensions de Am7.", "Alterne Am penta (son blues) et Do penta (son jazz). Sens la différence."], tip: "La penta de la bIIIe sur un accord mineur 7 = sons jazz instantanément. Garder en mémoire.", xp: 65 }, impro: { title: "Blues → jazz en temps réel", duration: 10, backing: "Am7 70bpm", steps: ["2 minutes : Am penta classique (son blues direct).", "2 minutes : Do penta (son jazz sophistiqué).", "2 minutes : mélange des deux selon ton humeur.", "Maîtriser les 2 sons sur le même accord = liberté d'expression totale."], tip: "La transition blues → jazz se fait en changeant de pentatonique. Simple mais puissant.", xp: 70 }, quiz: { question: "Jouer la pentatonique majeure de la bIII d'un accord mineur 7 produit quel son ?", options: ["Un son très blues direct", "Un son jazz sophistiqué avec tensions", "Un son atonale", "Un son modal phrygien"], correct: 1, explication: "Les notes de la penta bIII sur Im7 = b3, 11, 5, b7, 1. Des extensions et couleurs jazz.", xp: 45 } },
      { day: 6, title: "Composition : construire un morceau", theory: { title: "Structure d'un morceau", content: "Intro – A – A – B – A – Outro. La section A = le thème principal. B = le pont/chorus (contraste). Même principe pour un solo : intro (calme), développement (montée en tension), climax (note haute, bend), résolution (descente vers tonique). Pense en sections.", xp: 30 }, practical: { title: "Riff blues personnel", duration: 15, bpm: 75, steps: ["Invente un riff de 2 mesures en Am. 6-8 notes maximum. Répétable.", "Ce riff doit avoir une identité : un rythme reconnaissable.", "Joue-le 20 fois exactement pareil. C'est ta section A.", "Crée une variation légère (section B) : même rythme, notes légèrement différentes."], tip: "Un grand morceau se construit sur une idée simple bien développée, pas sur de la complexité.", xp: 65 }, impro: { title: "Solo structuré en 3 parties", duration: 10, backing: "Am 80bpm", steps: ["Partie 1 (2 min) : phrases courtes, notes graves, dynamic piano. Introduction.", "Partie 2 (5 min) : monte en intensité, utilise les positions hautes, bends, vitesse croissante.", "Partie 3 (3 min) : climax (note haute tenue avec vibrato), puis résolution calme sur La.", "C'est un arc narratif complet. Raconte une histoire."], tip: "Chaque grand solo a un arc. Écoute 'Comfortably Numb' (Gilmour) : intro calme → explosion finale.", xp: 70 }, quiz: { question: "Dans un solo structuré, le climax se place généralement...", options: ["Au début", "À la fin", "Aux 2/3 du solo", "En alternance avec le thème"], correct: 2, explication: "La règle des 2/3 : le climax aux 2/3 permet une montée naturelle et une résolution satisfaisante après.", xp: 35 } },
      { day: 7, title: "Défi S4 : ii-V-I complet + bilan mi-parcours", theory: { title: "Bilan 4 semaines", content: "En 4 semaines tu as acquis : pentatonique Am (5 positions en cours), gamme blues, gamme mineure naturelle, modes dorien et mixolydien, accords de 7e, arpèges, CAGED, phrasing Q&A, chromatisme. Tu es bien au-delà d'un guitariste intermédiaire moyen. La V2 va assembler tout ça.", xp: 30 }, practical: { title: "Défi ii-V-I en Am", duration: 15, bpm: 70, steps: ["Progression : Bm7b5 (2 mesures) → E7 (2 mesures) → Am7 (4 mesures). En boucle.", "Solo : arpège Bm7b5 → Sol# de E7 (tension max) → résolution La de Am7.", "Joue 5 fois la progression avec ce plan.", "La 6e fois : improvise librement sans plan, laisse l'oreille guider."], tip: "Le plan (arpège → guide tone → résolution) est une formule. Après 5 fois, oublie-la et joue.", xp: 90 }, impro: { title: "Bilan : enregistrement libre 10 min", duration: 10, backing: "Am 75bpm", steps: ["10 minutes. Enregistre tout.", "Utilise tout ce que tu veux de ces 4 semaines.", "Écoute après et note : 3 choses qui ont bien sonné. 1 chose à améliorer.", "C'est ton point de référence pour la seconde moitié du programme."], tip: "Conserver ses enregistrements est la meilleure façon de mesurer le progrès. Tu ne t'en rends pas compte en jouant.", xp: 80 }, quiz: { question: "Lequel de ces éléments appartient au vocabulaire appris en S1-S4 ?", options: ["Gamme par tons", "Pentatonique + bends + modes + arpeggios + ii-V-I", "Gamme octatonique", "Technique 8 doigts"], correct: 1, explication: "En 4 semaines : pentatonique, blues, mineure, modes, CAGED, arpeggios, ii-V-I, phrasing. Solide fondation.", xp: 40 } },
    ],
  },
];

export default function App() {
  const [view, setView] = useState("overview");
  const [selectedWeek, setSelectedWeek] = useState(null);
  const [selectedDay, setSelectedDay] = useState(null);
  const [activeTab, setActiveTab] = useState("practical");
  const [completedDays, setCompletedDays] = useState({});
  const [expandedSection, setExpandedSection] = useState(null);

  const totalDays = WEEKS.reduce((a, w) => a + w.days.length, 0);
  const completedCount = Object.keys(completedDays).length;
  const progress = Math.round((completedCount / totalDays) * 100);

  const markDone = (wk, dy) => {
    const key = `w${wk}d${dy}`;
    setCompletedDays(prev => ({ ...prev, [key]: true }));
  };
  const isDone = (wk, dy) => !!completedDays[`w${wk}d${dy}`];

  if (view === "day" && selectedWeek !== null && selectedDay !== null) {
    const week = WEEKS[selectedWeek];
    const day = week.days[selectedDay];
    const done = isDone(week.week, day.day);
    const tabs = [
      { id: "theory", label: "Théorie", icon: "🧠" },
      { id: "practical", label: "Pratique", icon: "🎸" },
      { id: "impro", label: "Impro", icon: "🎵" },
      { id: "quiz", label: "Quiz", icon: "❓" },
    ];
    return (
      <div style={{ fontFamily: "var(--font-sans)", color: C.text, maxWidth: 480, margin: "0 auto", paddingBottom: 20 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "1rem", borderBottom: `1px solid ${C.border}` }}>
          <button onClick={() => { setView("week"); }} style={{ background: "none", border: "none", cursor: "pointer", color: C.gray, fontSize: 14, padding: 0 }}>‹ S{week.week}</button>
          <div style={{ flex: 1 }}>
            <div style={{ fontWeight: 500, fontSize: 15 }}>Jour {day.day} — {day.title}</div>
            <div style={{ fontSize: 12, color: C.gray }}>Semaine {week.week} · {week.theme}</div>
          </div>
          {done && <span style={{ fontSize: 11, background: C.tealL, color: C.teal, padding: "3px 10px", borderRadius: 10, fontWeight: 500 }}>✓ Complété</span>}
        </div>
        <div style={{ display: "flex", borderBottom: `1px solid ${C.border}` }}>
          {tabs.map(t => (
            <button key={t.id} onClick={() => setActiveTab(t.id)} style={{ flex: 1, padding: "10px 4px", background: "none", border: "none", cursor: "pointer", fontSize: 11, color: activeTab === t.id ? week.color : C.gray, fontWeight: activeTab === t.id ? 500 : 400, borderBottom: activeTab === t.id ? `2px solid ${week.color}` : "2px solid transparent" }}>
              <div style={{ fontSize: 16 }}>{t.icon}</div>{t.label}
            </button>
          ))}
        </div>
        <div style={{ padding: "1rem" }}>
          {activeTab === "theory" && (
            <div>
              <div style={{ ...s.card, background: week.colorL, border: `1px solid ${week.color}30`, marginBottom: 12 }}>
                <div style={{ fontWeight: 500, marginBottom: 6, color: week.color }}>{day.theory.title}</div>
                <p style={{ margin: 0, fontSize: 14, lineHeight: 1.7 }}>{day.theory.content}</p>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", ...s.card, background: week.colorL }}>
                <span style={{ fontSize: 13, color: C.gray }}>Lire et comprendre</span>
                <span style={{ fontSize: 13, fontWeight: 500, color: week.color }}>+{day.theory.xp} XP</span>
              </div>
            </div>
          )}
          {activeTab === "practical" && (
            <div>
              <div style={{ display: "flex", gap: 10, marginBottom: 12 }}>
                <span style={{ ...s.card, padding: "6px 12px", fontSize: 12, color: C.gray, flex: 1, textAlign: "center" }}>⏱ {day.practical.duration} min</span>
                {day.practical.bpm && <span style={{ ...s.card, padding: "6px 12px", fontSize: 12, color: C.gray, flex: 1, textAlign: "center" }}>♩ {day.practical.bpm} bpm</span>}
                <span style={{ ...s.card, padding: "6px 12px", fontSize: 12, color: week.color, flex: 1, textAlign: "center" }}>+{day.practical.xp} XP</span>
              </div>
              <h3 style={{ margin: "0 0 12px", fontSize: 15, fontWeight: 500 }}>{day.practical.title}</h3>
              {day.practical.steps.map((step, i) => (
                <div key={i} style={{ display: "flex", gap: 10, marginBottom: 10 }}>
                  <div style={{ width: 24, height: 24, borderRadius: "50%", background: week.colorL, color: week.color, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 500, flexShrink: 0 }}>{i + 1}</div>
                  <p style={{ margin: 0, fontSize: 14, lineHeight: 1.6, paddingTop: 2 }}>{step}</p>
                </div>
              ))}
              <div style={{ ...s.card, background: C.amberL, border: `1px solid ${C.amber}20`, marginTop: 12 }}>
                <p style={{ margin: 0, fontSize: 13, color: "#633806" }}>💡 {day.practical.tip}</p>
              </div>
            </div>
          )}
          {activeTab === "impro" && (
            <div>
              <div style={{ ...s.card, marginBottom: 12 }}>
                <div style={{ fontWeight: 500, marginBottom: 4 }}>{day.impro.title}</div>
                {day.impro.backing && <div style={{ fontSize: 12, color: C.gray, marginBottom: 8 }}>🎧 Backing track : {day.impro.backing}</div>}
                <div style={{ fontSize: 12, color: week.color }}>+{day.impro.xp} XP</div>
              </div>
              {day.impro.steps.map((step, i) => (
                <div key={i} style={{ display: "flex", gap: 10, marginBottom: 10 }}>
                  <div style={{ width: 24, height: 24, borderRadius: "50%", background: week.colorL, color: week.color, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 500, flexShrink: 0 }}>{i + 1}</div>
                  <p style={{ margin: 0, fontSize: 14, lineHeight: 1.6, paddingTop: 2 }}>{step}</p>
                </div>
              ))}
              <div style={{ ...s.card, background: C.purpleL, border: `1px solid ${C.purple}20`, marginTop: 12 }}>
                <p style={{ margin: 0, fontSize: 13, color: C.purpleD }}>🎸 {day.impro.tip}</p>
              </div>
            </div>
          )}
          {activeTab === "quiz" && <QuizView q={day.quiz} color={week.color} colorL={week.colorL} />}
          {!done && (
            <button onClick={() => { markDone(week.week, day.day); }} style={{ ...s.btn, background: week.color, color: "#fff", width: "100%", marginTop: 20 }}>
              Marquer comme complété ✓
            </button>
          )}
        </div>
      </div>
    );
  }

  if (view === "week" && selectedWeek !== null) {
    const week = WEEKS[selectedWeek];
    const weekCompleted = week.days.filter(d => isDone(week.week, d.day)).length;
    return (
      <div style={{ fontFamily: "var(--font-sans)", color: C.text, maxWidth: 480, margin: "0 auto", paddingBottom: 20 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "1rem", borderBottom: `1px solid ${C.border}` }}>
          <button onClick={() => setView("overview")} style={{ background: "none", border: "none", cursor: "pointer", color: C.gray, fontSize: 14, padding: 0 }}>‹ Programme</button>
          <div style={{ flex: 1 }}>
            <div style={{ fontWeight: 500 }}>Semaine {week.week} — {week.title}</div>
            <div style={{ fontSize: 12, color: C.gray }}>{week.theme}</div>
          </div>
          <span style={{ fontSize: 12, color: week.color, fontWeight: 500 }}>{weekCompleted}/7</span>
        </div>
        <div style={{ padding: "1rem" }}>
          <div style={{ ...s.card, background: week.colorL, border: `1px solid ${week.color}30`, marginBottom: 16 }}>
            <div style={{ fontSize: 12, color: week.color, fontWeight: 500, marginBottom: 4 }}>OBJECTIF DE LA SEMAINE</div>
            <p style={{ margin: "0 0 8px", fontSize: 14, lineHeight: 1.5 }}>{week.objective}</p>
            <div style={{ fontSize: 12, color: C.gray, borderTop: `1px solid ${week.color}20`, paddingTop: 8, marginTop: 4 }}>
              <strong style={{ color: week.color }}>Checkpoint :</strong> {week.checkpoint}
            </div>
          </div>
          <div style={{ ...s.card, marginBottom: 16, borderLeft: `3px solid ${C.amber}` }}>
            <div style={{ fontSize: 12, color: C.amber, fontWeight: 500, marginBottom: 4 }}>DÉFI HEBDOMADAIRE</div>
            <p style={{ margin: 0, fontSize: 13, lineHeight: 1.5 }}>{week.challenge}</p>
          </div>
          <h3 style={{ margin: "0 0 10px", fontSize: 15, fontWeight: 500 }}>Sessions journalières</h3>
          {week.days.map((day, di) => {
            const done = isDone(week.week, day.day);
            return (
              <button key={day.day} onClick={() => { setSelectedDay(di); setActiveTab("practical"); setView("day"); }} style={{ ...s.card, width: "100%", textAlign: "left", cursor: "pointer", marginBottom: 8, display: "flex", alignItems: "center", gap: 12, opacity: done ? 0.75 : 1 }}>
                <div style={{ width: 32, height: 32, borderRadius: "50%", background: done ? C.tealL : week.colorL, color: done ? C.teal : week.color, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: 500, flexShrink: 0 }}>{done ? "✓" : day.day}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 500, fontSize: 14 }}>{day.title}</div>
                  <div style={{ fontSize: 12, color: C.gray }}>Pratique · Impro · Quiz · Théorie</div>
                </div>
                <span style={{ color: C.gray }}>›</span>
              </button>
            );
          })}
        </div>
      </div>
    );
  }

  return (
    <div style={{ fontFamily: "var(--font-sans)", color: C.text, maxWidth: 480, margin: "0 auto", paddingBottom: 20 }}>
      <div style={{ padding: "1rem", borderBottom: `1px solid ${C.border}` }}>
        <h1 style={{ margin: "0 0 4px", fontSize: 22, fontWeight: 500 }}>Programme 8 semaines</h1>
        <p style={{ margin: 0, fontSize: 14, color: C.gray }}>Improvisation · Théorie · Manche</p>
      </div>
      <div style={{ padding: "1rem" }}>
        <div style={{ ...s.card, background: C.purpleL, border: `1px solid ${C.purple}30`, marginBottom: 16 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
            <span style={{ fontSize: 14, fontWeight: 500 }}>Progression globale</span>
            <span style={{ fontSize: 14, fontWeight: 500, color: C.purple }}>{completedCount}/{totalDays} sessions</span>
          </div>
          <div style={{ height: 8, background: `${C.purple}20`, borderRadius: 4, overflow: "hidden" }}>
            <div style={{ height: "100%", width: `${progress}%`, background: C.purple, borderRadius: 4, transition: "width 0.5s" }} />
          </div>
          <p style={{ margin: "6px 0 0", fontSize: 12, color: C.gray }}>{progress}% du programme complété · ~30 min/jour</p>
        </div>
        <div style={{ display: "grid", gap: 12 }}>
          {WEEKS.map((week, wi) => {
            const weekDone = week.days.filter(d => isDone(week.week, d.day)).length;
            const isLocked = wi > 1 && WEEKS[wi - 1].days.filter(d => isDone(WEEKS[wi-1].week, d.day)).length < 4;
            return (
              <button key={week.week} onClick={() => { if (!isLocked) { setSelectedWeek(wi); setView("week"); } }} disabled={isLocked}
                style={{ ...s.card, textAlign: "left", cursor: isLocked ? "not-allowed" : "pointer", opacity: isLocked ? 0.45 : 1, borderLeft: `3px solid ${week.color}` }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                  <div>
                    <div style={{ fontSize: 12, color: week.color, fontWeight: 500, marginBottom: 2 }}>SEMAINE {week.week}{isLocked ? " 🔒" : ""}</div>
                    <div style={{ fontWeight: 500, fontSize: 15 }}>{week.title}</div>
                    <div style={{ fontSize: 13, color: C.gray, marginTop: 2 }}>{week.theme}</div>
                  </div>
                  <div style={{ textAlign: "right", flexShrink: 0 }}>
                    <div style={{ fontSize: 13, fontWeight: 500, color: weekDone === 7 ? C.teal : week.color }}>{weekDone}/7</div>
                    <div style={{ fontSize: 11, color: C.gray }}>jours</div>
                  </div>
                </div>
                <div style={{ height: 4, background: `${week.color}20`, borderRadius: 2, overflow: "hidden", marginTop: 10 }}>
                  <div style={{ height: "100%", width: `${(weekDone / 7) * 100}%`, background: week.color, borderRadius: 2 }} />
                </div>
              </button>
            );
          })}
          <div style={{ ...s.card, opacity: 0.45, borderLeft: `3px solid ${C.gray}`, cursor: "not-allowed" }}>
            <div style={{ fontSize: 12, color: C.gray, fontWeight: 500, marginBottom: 2 }}>SEMAINES 5-8 🔒</div>
            <div style={{ fontWeight: 500, fontSize: 15, color: C.gray }}>Avancé : modes complets, jazz, composition</div>
            <div style={{ fontSize: 13, color: C.gray, marginTop: 2 }}>Débloquées après complétion des semaines 1-4</div>
          </div>
        </div>
        <div style={{ ...s.card, marginTop: 16, background: C.tealL, border: `1px solid ${C.teal}30` }}>
          <div style={{ fontSize: 12, color: C.teal, fontWeight: 500, marginBottom: 6 }}>CONTENU DU PROGRAMME</div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 6, fontSize: 13 }}>
            {[["56 sessions", "8 semaines × 7 jours"], ["224 exercices", "4 par session"], ["56 quiz", "1 par jour"], ["8 défis", "1 par semaine"]].map(([val, lab]) => (
              <div key={val} style={{ background: C.bg, borderRadius: 8, padding: "8px 10px" }}>
                <div style={{ fontWeight: 500, color: C.teal }}>{val}</div>
                <div style={{ color: C.gray, fontSize: 11 }}>{lab}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function QuizView({ q, color, colorL }) {
  const [selected, setSelected] = useState(null);
  const answered = selected !== null;
  const qs = { card: { background: C.bg, border: `1px solid ${C.border}`, borderRadius: 12, padding: "1rem 1.25rem" } };
  return (
    <div>
      <div style={{ ...qs.card, marginBottom: 14, borderLeft: `3px solid ${color}` }}>
        <p style={{ margin: 0, fontSize: 15, fontWeight: 500, lineHeight: 1.5 }}>{q.question}</p>
      </div>
      <div style={{ display: "grid", gap: 8, marginBottom: 12 }}>
        {q.options.map((opt, i) => {
          let bg = C.bg, border = `1px solid ${C.border}`, col = C.text;
          if (answered) {
            if (i === q.correct) { bg = C.tealL; border = `1px solid ${C.teal}`; col = C.teal; }
            else if (i === selected) { bg = C.coralL; border = `1px solid ${C.coral}`; col = C.coral; }
          }
          return (
            <button key={i} disabled={answered} onClick={() => setSelected(i)}
              style={{ padding: "11px 14px", borderRadius: 10, border, background: bg, color: col, textAlign: "left", cursor: answered ? "default" : "pointer", fontSize: 14, fontWeight: answered && i === q.correct ? 500 : 400 }}>
              <span style={{ opacity: 0.5, marginRight: 8 }}>{["A", "B", "C", "D"][i]}.</span>{opt}
            </button>
          );
        })}
      </div>
      {answered && (
        <div style={{ ...qs.card, background: selected === q.correct ? C.tealL : C.coralL }}>
          <p style={{ margin: "0 0 4px", fontWeight: 500, fontSize: 14, color: selected === q.correct ? C.teal : C.coral }}>
            {selected === q.correct ? `Correct ! +${q.xp} XP` : "Pas tout à fait..."}
          </p>
          <p style={{ margin: 0, fontSize: 13 }}>{q.explication}</p>
        </div>
      )}
    </div>
  );
}

const s = {
  card: { background: C.bg, border: `1px solid ${C.border}`, borderRadius: 12, padding: "1rem 1.25rem" },
  btn: { padding: "9px 18px", borderRadius: 8, border: "none", cursor: "pointer", fontWeight: 500, fontSize: 14 },
};