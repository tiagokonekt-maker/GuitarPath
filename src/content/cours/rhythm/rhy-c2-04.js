// Leçon du module « rhythm » + les questions de quiz qui s'y rattachent.
// Format décrit dans src/content/README.md.

export default {
  id: "rhy-c2-04", level: 4,
  title: "Les silences : la musique dans le vide",
  duration: 8,
  gropiTip: "Un silence se joue aussi précisément qu'une note : sur le pattern du cours, étouffe l'accord pile sur le « et » du 2, et relance pile sur le 3. Compte le silence à voix basse.",
  content: [
    { type: "p", text: "En musique, les silences ne sont pas l'absence de musique. Ils SONT de la musique. Un silence bien placé a autant d'impact qu'une note bien placée. C'est ce qu'on appelle 'l'espace' en jazz — la capacité à ne pas jouer est aussi importante que la capacité à jouer. Une idée souvent attribuée à Miles Davis : les notes qu'on ne joue pas comptent autant que celles qu'on joue." },
    { type: "h", text: "Les symboles de silence" },
    { type: "p", text: "Chaque valeur rythmique a son équivalent en silence. Soupir = silence d'1 noire. Demi-soupir = silence d'1 croche. Quart de soupir = silence d'1 double-croche. Demi-pause = silence de 2 temps. Pause = silence de 4 temps (mesure entière). Sur la guitare, produire un silence = étouffer les cordes (avec la paume ou les doigts) au bon moment." },
    { type: "h", text: "Comment produire un silence sur la guitare" },
    { type: "p", text: "Deux techniques. Palm mute de fin : après avoir joué une note, pose délicatement la paume de ta main droite sur les cordes pour les étouffer. Doigt gauche qui relâche : sans déplacer le doigt, relâche légèrement la pression — la note s'éteint. La deuxième technique est plus rapide et précise pour les silences courts dans un riff." },
    { type: "h", text: "Silences rythmiques vs silences expressifs" },
    { type: "p", text: "Silences rythmiques : prévus dans le riff ou la mélodie (ex : le silence sur le 'et' du 2 dans un pattern syncopé). Silences expressifs : improvisés, pour créer de l'espace dans un solo. Ces derniers sont artistiques — tu décides de te taire pour que la note suivante ait plus d'impact. L'oreille de l'auditeur 'attend' dans le silence, ce qui amplifie la surprise de la note suivante." },
    {
      type: "rhythm_grid",
      caption: "Silence rythmique sur le 'et' du 2 — la case grise ne sonne pas",
      data: {
        beats: 4, subdivision: 8,
        accents: [0, 2, 4, 6],
        muted: [3],
        label: "1 · et · 2 · [silence] · 3 · et · 4 · et",
      },
    },
    { type: "h", text: "Le silence comme outil de tension" },
    { type: "p", text: "Un silence après une phrase intense crée une tension magnétique. L'auditeur 'veut' que tu continues. Quand tu joues ensuite, l'impact est démultiplié. C'est la technique du stand-up comedian qui laisse un silence avant sa chute. En musique, les meilleurs solistes gèrent les silences comme les comédiens gèrent les pauses." },
    { type: "h", text: "Rythme dans le silence : le ghost strum" },
    { type: "p", text: "Pour maintenir le groove même dans les silences, le guitariste fait des 'ghost strums' : des mouvements de main droite qui ne touchent pas les cordes (ou les effleurent sans les faire sonner). Ce mouvement continu maintient le feel rythmique même pendant les silences. C'est la différence entre un guitariste qui 'joue' et un guitariste qui 'groove'." },
    { type: "ref", text: "Chet Atkins (guitare country/fingerstyle, l'un des plus grands guitaristes du XXe siècle) était célèbre pour ses silences expressifs. Dans ses solos, des mesures entières pouvaient ne contenir que 2-3 notes avec beaucoup d'espace. L'effet était hypnotique — chaque note semblait plus importante parce qu'elle était entourée de silence." },
    { type: "tip", text: "Drill silence conscient : improvise 4 minutes sur Am. Règle : tu dois laisser au moins 1 mesure entière de silence toutes les 8 mesures. Compte les silences à voix basse. Résultat : ton improvisation va immédiatement sonner plus 'musicale' et moins 'brouillonne'." },
  ],
  quiz: ["q-rhy-49", "q-rhy-50", "q-rhy-51", "q-rhy-02"],
};

export const quiz = [
  {id:"q-rhy-49",courseId:"rhythm",lessonId:"rhy-c2-04",lvl:1,q:"Quelle durée vaut un soupir ?",o:["Une croche","Une blanche","Une ronde","Une noire"],a:3,exp:"Soupir = silence d'une noire. Demi-soupir = une croche, demi-pause = 2 temps, pause = une mesure entière.",xp:30},
  {id:"q-rhy-50",courseId:"rhythm",lessonId:"rhy-c2-04",lvl:1,q:"Comment couper une note proprement, sans bouger la main gauche ?",o:["Relâcher la pression du doigt","Gratter plus fort la corde suivante","Appuyer plus fort sur la case","Changer de position sur le manche"],a:0,exp:"Sans déplacer le doigt, relâche légèrement la pression : la note s'éteint aussitôt. L'autre technique : poser la paume droite sur les cordes.",xp:30},
  {id:"q-rhy-51",courseId:"rhythm",lessonId:"rhy-c2-04",lvl:2,q:"À quoi sert le ghost strum pendant un silence ?",o:["À faire sonner les cordes à vide","À garder le mouvement et le groove","À accorder la guitare entre deux phrases","À marquer la fin du morceau"],a:1,exp:"La main droite continue son mouvement sans toucher les cordes : le groove reste vivant, même quand rien ne sonne.",xp:40},
];
