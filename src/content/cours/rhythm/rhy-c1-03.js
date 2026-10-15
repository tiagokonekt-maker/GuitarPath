// Leçon du module « rhythm » + les questions de quiz qui s'y rattachent.
// Format décrit dans src/content/README.md.

export default {
  id: "rhy-c1-03", level: 2,
  title: "Le métronome : ton meilleur ennemi",
  duration: 9,
  content: [
    { type: "p", text: "Tout le monde sait qu'il faut s'entraîner au métronome. Beaucoup le font mal ou pas assez. Cette leçon te donne les techniques avancées d'utilisation du métronome — celles que les pros utilisent — pour développer un sens du temps interne solide comme un roc." },
    { type: "h", text: "Pourquoi le métronome est indispensable" },
    { type: "p", text: "Sans feedback externe, le cerveau humain a tendance à accélérer quand la musique est facile et à ralentir quand elle est difficile. C'est naturel et universel. Le métronome révèle ces irrégularités implacablement. Les utiliser pour t'améliorer — au lieu de les cacher — est la définition du travail sérieux." },
    { type: "h", text: "Technique 1 : commencer lentement" },
    { type: "p", text: "Règle absolue : joue toujours au tempo où tu peux jouer PARFAITEMENT. Si tu fais des erreurs, ralentis. Un tempo lent et propre vaut infiniment mieux qu'un tempo rapide et sloppy. La vitesse vient avec la répétition propre, pas en forçant. Commence un exercice à 50-60% du tempo cible, maîtrise-le, augmente de 5-10 BPM, recommence." },
    { type: "h", text: "Technique 2 : le métronome sur les 2 et 4" },
    { type: "p", text: "Au lieu de mettre le métronome sur tous les temps (1-2-3-4), mets-le uniquement sur les temps 2 et 4 (en réglant le BPM à moitié). Ex : tu veux jouer à 100 BPM. Règle le métronome à 50 BPM et traite ces clics comme les temps 2 et 4. Tu dois imaginer les temps 1 et 3. Cet exercice développe le sens du backbeat (groove naturel) et te prépare au jeu avec un batteur." },
    {
      type: "rhythm_grid",
      caption: "Métronome sur 2 et 4 — les temps 1 et 3 sont à imaginer",
      data: {
        beats: 4, subdivision: 4,
        accents: [1, 3],
        muted: [0, 2],
        label: "(1) · CLIC · (3) · CLIC — le clic ne marque que 2 et 4",
      },
    },
    { type: "h", text: "Technique 3 : le métronome sur le temps 1 seulement" },
    { type: "p", text: "Encore plus difficile : un clic toutes les 4 temps (= 1 mesure). Ex : tempo cible 120 BPM, clic à 30 BPM (1 clic = 4 temps). Tu dois compter 1-2-3-4 dans ta tête entre chaque clic. Si tu arrives pile sur le clic au temps 1 de chaque mesure, ton sens rythmique est solide. Exercice avancé, réservé aux musiciens déjà à l'aise avec le métronome standard." },
    { type: "h", text: "Technique 4 : le clic en contretemps" },
    { type: "p", text: "Mets le métronome à moitié du tempo, et traite les clics comme les 'et' (contretemps) au lieu des temps. Ex : tempo cible 100 BPM. Métronome à 50 BPM. Les clics tombent sur le 'et de 1', le 'et de 2', etc. Tu dois jouer les temps forts dans ta tête. Exercice extrêmement efficace pour développer le sens du groove syncopé." },
    { type: "h", text: "Les applications métronome recommandées" },
    { type: "p", text: "Plusieurs bonnes options gratuites : 'Pro Metronome' (iOS/Android, excellent pour les subdivisions), 'Tempo' (simple et efficace), 'GuitarTuna' (inclut métronome). Pour le travail avancé, un métronome physique (comme le Korg MA-2) est plus pratique qu'une app. L'important : avoir un clic propre et fiable." },
    { type: "ref", text: "Jeff Porcaro (batteur de Toto, l'un des grands batteurs de studio des années 80) s'entraînait au métronome tous les matins pendant 30 minutes avant toute session. Sa précision légendaire ('Rosanna groove') venait directement de cette discipline quotidienne. Les musiciens de studio les plus demandés sont ceux dont le 'time' est impeccable." },
    { type: "tip", text: "Défi du mois : chaque jour de pratique, commence par 5 minutes de métronome pur. Pas de mélodie, pas d'accords — juste frapper sur chaque temps (ou chaque contretemps) avec une seule note. 5 minutes par jour × 30 jours = un sens du temps transformé." },
  ],
  quiz: ["q-rhy-13", "q-rhy-14", "q-rhy-15"],
};

export const quiz = [
  {id:"q-rhy-13",courseId:"rhythm",lessonId:"rhy-c1-03",lvl:1,q:"À quoi sert d'abord un métronome quand on travaille ?",o:["À rendre le jeu plus mécanique","À compter les mesures d'un morceau","À révéler où on accélère ou on ralentit","À jouer plus vite qu'on ne le pourrait"],a:2,exp:"Le métronome ne te fait pas jouer plus vite : il te montre où tu décales. On accélère presque toujours dans les passages faciles et on ralentit dans les difficiles — sans référence extérieure, on ne l'entend pas.",xp:25},
  {id:"q-rhy-14",courseId:"rhythm",lessonId:"rhy-c1-03",lvl:2,q:"Un passage ne passe pas à 100 bpm. Que fais-tu ?",o:["Tu sautes le passage pour y revenir plus tard","Tu répètes à 100 jusqu'à ce que ça finisse par passer","Tu joues plus fort pour te donner de l'élan","Tu descends au tempo où c'est propre, puis tu montes par paliers"],a:3,exp:"Répéter à un tempo où c'est raté, c'est mémoriser l'erreur. On descend jusqu'au tempo où les notes sont justes et régulières, puis on monte de 5 en 5. Plus lent sur une séance, bien plus rapide sur un mois.",xp:30},
  {id:"q-rhy-15",courseId:"rhythm",lessonId:"rhy-c1-03",lvl:3,q:"Mettre le métronome sur les temps 2 et 4 seulement, ça sert à…",o:["Renforcer sa pulsation intérieure", "Réduire le bruit pendant le travail", "Simplifier le comptage des mesures", "Pouvoir jouer deux fois plus vite"],a:0,exp:"Avec un clic seulement sur 2 et 4, c'est toi qui portes les temps 1 et 3. C'est l'exercice de tempo le plus révélateur qui soit — et c'est aussi la place du clic dans le jazz et la soul.",xp:40},
];
