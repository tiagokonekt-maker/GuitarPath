// Leçon du module « rhythm » + les questions de quiz qui s'y rattachent.
// Format décrit dans src/content/README.md.

export default {
  id: "rhy-c1-01", level: 1,
  title: "Qu'est-ce que le rythme ?",
  duration: 8,
  content: [
    { type: "p", text: "Le rythme est le premier langage musical de l'être humain. Bien avant les notes, bien avant les gammes, il y avait le battement du cœur, les pas de marche, les mains qui frappent. Le rythme précède la mélodie de plusieurs millénaires dans l'histoire de l'humanité. Et pourtant, c'est souvent la dimension la plus négligée par les guitaristes qui se concentrent sur les notes." },
    { type: "h", text: "Définition : 3 concepts à distinguer" },
    { type: "p", text: "Le rythme désigne 3 choses souvent confondues. La pulsation (ou 'pulse') = le battement régulier et constant qui sous-tend la musique. C'est ce que le métronome produit, ce que tu ressens quand tu tapes du pied. Le tempo = la vitesse de cette pulsation, mesurée en BPM (Battements Par Minute). 60 BPM = 1 battement par seconde. 120 BPM = 2 battements par seconde. Le rythme musical = la façon dont les notes s'organisent PAR RAPPORT à la pulsation. Court, long, entre les temps, sur les temps." },
    { type: "h", text: "La pulsation : l'ancre de tout" },
    { type: "p", text: "La pulsation est le fondement absolu de la musique rythmique. Sans pulsation stable, pas de groove, pas d'ensemble, pas de communication entre musiciens. C'est pour ça que le métronome est l'outil n°1 de tout musicien qui se prend au sérieux. Jouer 'en mesure' signifie jouer en cohérence avec une pulsation régulière." },
    {
      type: "rhythm_grid",
      caption: "La pulsation — 4 battements strictement égaux",
      data: {
        beats: 4, subdivision: 4,
        accents: [],
        label: "1 · 2 · 3 · 4 — même durée, sans exception",
      },
    },
    { type: "h", text: "Le tempo : plus qu'une vitesse" },
    { type: "p", text: "Le tempo ne définit pas seulement la vitesse d'une chanson — il en définit aussi l'ambiance. Un même morceau joué à 60 BPM (très lent) n'évoque pas la même chose qu'à 160 BPM (rapide). Les ballades tristes tournent autour de 60-80 BPM. Le rock énergique : 120-160 BPM. Le funk : souvent 90-110 BPM (plus lent qu'on ne le pense). Le bebop jazz : parfois 240-300 BPM (vertigineux)." },
    { type: "h", text: "Le rythme musical : l'organisation des notes" },
    { type: "p", text: "Sur la base d'une pulsation stable, les notes peuvent être placées de mille façons différentes. Longues ou courtes. Sur le temps ou entre les temps. Régulières ou irrégulières. Cette organisation constitue le rythme musical proprement dit. Deux mélodies identiques (mêmes notes) jouées avec des rythmes différents donnent des morceaux complètement différents." },
    { type: "h", text: "Rythme interne vs rythme externe" },
    { type: "p", text: "Les grands musiciens ont un 'rythme interne' : une pulsation intégrée qui ne dépend pas d'une source externe (métronome, batteur). Ce sens du temps intérieur s'appelle le 'inner time' ou 'pocket'. Il se développe par années de pratique au métronome. L'objectif ultime : que ton corps soit le métronome." },
    { type: "ref", text: "James Brown, le 'Godfather of Soul', avait un sens du rythme si précis qu'il pouvait arrêter et reprendre une chanson n'importe où en claquant des doigts, et l'orchestre entier le suivait sans décalage. Ce n'est pas un don — c'est le résultat de milliers d'heures de pratique rythmique. Son secret : il faisait autant attention au rythme qu'aux notes." },
    { type: "tip", text: "Exercice fondamental : tape le pied sur les temps (1-2-3-4) en gardant un tempo parfaitement régulier pendant 1 minute. Facile ? Maintenant fais-le à 60 BPM en regardant une montre. Sans accélérer, sans ralentir. Si tu dévies, recommence. Ce simple exercice révèle la qualité de ton sens rythmique interne." },
  ],
  quiz: ["q-base-06","q-base-07","q-rhy-27","q-rhy-28"],
};

export const quiz = [
  {id:"q-base-06",courseId:"rhythm",lessonId:"rhy-c1-01",lvl:1,q:"Dans l'histoire de l'humanité, qu'est-ce qui est apparu en premier ?",o:["La mélodie","Le rythme","L'harmonie","Les gammes"],a:1,exp:"Le rythme précède tout le reste de plusieurs millénaires : battements, pas, mains qui frappent. C'est le premier langage musical humain.",xp:25},
  {id:"q-base-07",courseId:"rhythm",lessonId:"rhy-c1-01",lvl:1,q:"La 'pulsation' d'un morceau correspond à…",o:["La hauteur des notes jouées","Le nombre de cordes utilisées","Le battement régulier de fond","La durée totale du morceau"],a:2,exp:"La pulsation est ce battement régulier qu'on tape du pied naturellement. Tout le rythme s'organise autour d'elle.",xp:25},
  {id:"q-rhy-27",courseId:"rhythm",lessonId:"rhy-c1-01",lvl:1,q:"Entre un guitariste qui joue des notes savantes mal placées et un autre qui joue des notes simples bien placées…",o:["Le second sonne nettement mieux","Les deux sonnent équivalents","Le premier sonne nettement mieux","Tout dépend de l'accordage employé"],a:0,exp:"Une note juste au mauvais moment s'entend comme une erreur ; une note simple bien placée s'entend comme de la musique. C'est le rythme, pas le vocabulaire, qui sépare le plus nettement l'amateur du professionnel.",xp:25},
  {id:"q-rhy-28",courseId:"rhythm",lessonId:"rhy-c1-01",lvl:2,q:"La pulsation d'un morceau, c'est…",o:["Le dessin rythmique de la mélodie", "La régularité sur laquelle on tape du pied", "La vitesse des notes les plus rapides du morceau", "L'accentuation des temps forts"],a:1,exp:"La pulsation est la grille régulière ; le rythme est ce qu'on pose dessus. On peut jouer beaucoup de notes sur une pulsation lente, et peu sur une rapide — ce sont deux choses distinctes.",xp:30},
];
