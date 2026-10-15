// Leçon du module « rhythm » + les questions de quiz qui s'y rattachent.
// Format décrit dans src/content/README.md.

export default {
  id: "rhy-c4-03", level: 6,
  title: "Le palm mute : étouffer pour créer du groove",
  duration: 9,
  gropiTip: "Si ton palm mute tue complètement la note, recule un peu la paume vers le chevalet. Tu dois encore entendre la hauteur de la note, juste raccourcie, pas un simple « tchk ».",
  content: [
    { type: "p", text: "Le palm mute est l'une des techniques rythmiques les plus importantes de la guitare électrique et acoustique. Il consiste à étouffer partiellement les cordes avec la paume de la main droite, créant un son 'percussif', 'étouffé', qu'on associe immédiatement au rock, au metal et au funk. Maîtriser le palm mute, c'est ajouter une couleur rythmique essentielle à ton jeu." },
    { type: "h", text: "La technique" },
    { type: "p", text: "Pose le bord de la paume droite (la partie charnue entre le poignet et le petit doigt) sur les cordes, juste avant le chevalet. La pression doit être légère : assez pour étouffer le son, pas assez pour tuer le sustain complètement. Trop près du chevalet = son trop ouvert (pas assez de mute). Trop loin = son trop étouffé, presque inaudible. Trouve le sweet spot." },
    { type: "h", text: "Son et effet" },
    { type: "p", text: "Avec le palm mute, le son de guitare devient 'chunk', percussif, court. Les notes ont peu de sustain. À la distorsion, c'est le son du riff de metal compact et agressif. Clean, c'est le son du riff funk ou du strumming roots/country. Alterner palm mute (PM) et notes ouvertes (sans PM) crée un contraste dynamique puissant." },
    { type: "h", text: "Palm mute partiel : graduation du son" },
    { type: "p", text: "Tu peux varier l'intensité du palm mute en ajustant la pression ou la position. PM léger = son légèrement amorti avec du sustain. PM fort = son très court, presque 'click'. Cette graduation te permet de jouer des nuances dynamiques sur un même riff : PM léger pour les couplets, PM fort pour les bridges, notes ouvertes pour le refrain." },
    { type: "h", text: "Notation et application" },
    { type: "p", text: "En tablature, le palm mute se note 'PM' ou 'P.M.' avec une ligne pointillée sous les notes concernées. Dans un riff typique rock/metal : riff PM PM PM - ouvert PM PM ouvert. L'alternance crée la dynamique. Ex : E5 barré avec PM sur les temps 1-2-3, puis E5 ouvert sur le temps 4 pour l'accent." },
    { type: "h", text: "Palm mute rythmique : le 'chug'" },
    { type: "p", text: "En metal, le 'chug' est une technique de palm mute rythmique où tu joues des coups de médiator très rapprochés sur des cordes complètement étouffées (ou quasi-étouffées). Le résultat est presque percussif — comme une caisse claire jouée sur la guitare. Très utilisé en metal pour les parties rythmiques de 'groove metal' ou 'djent'." },
    { type: "h", text: "Palm mute funk : le 'scratch'" },
    { type: "p", text: "En funk, le palm mute n'est pas utilisé comme en metal. On utilise plutôt l'index de la main gauche pour étouffer toutes les cordes, et on joue des coups de médiator sur ces cordes étouffées. Résultat : un 'scratch' rythmique très court et percussif. C'est différent du palm mute classique mais produit un effet similaire." },
    { type: "ref", text: "'Enter Sandman' (Metallica, 1991) : l'intro est un exemple classique d'alternance PM/ouvert. Le riff commence entièrement en PM, puis les accents tombent sur des notes ouvertes. Cette alternance crée la dynamique qui rend le riff si reconnaissable. Écoute et identifie les moments PM vs ouvert." },
    {
      type: "strum_pattern",
      caption: "Drill palm mute — PM (×) sur 1, 2, 3, note ouverte (B) sur le 4",
      data: { pattern: ["x","x","x","B"], beats: 4, style: "rock", bpm: 80 },
    },
    { type: "tip", text: "Drill palm mute : sur la corde de Mi grave (c6), joue en downstrokes à 80 BPM avec PM sur les temps 1, 2, 3 et note ouverte sur le temps 4. Boucle 2 minutes. Quand c'est fluide, ajoute la corde de La (c5) pour former un E5 power chord. Tu joues le riff de base du rock." },
  ],
  quiz: ["q-rhy-46", "q-rhy-47", "q-rhy-48"],
};

export const quiz = [
  {id:"q-rhy-46",courseId:"rhythm",lessonId:"rhy-c4-03",lvl:1,q:"Où pose-t-on la paume pour un palm mute ?",o:["Sur les cordes, au milieu du manche, en appuyant", "Sur les cordes, juste avant le chevalet", "Sur les frettes, près de la tête", "Sous les cordes, contre la rosace"],a:1,exp:"Le bord de la paume se pose juste avant le chevalet, avec une pression légère : assez pour étouffer, pas assez pour tuer tout le sustain.",xp:30},
  {id:"q-rhy-47",courseId:"rhythm",lessonId:"rhy-c4-03",lvl:1,q:"Comment le palm mute se note-t-il dans une tablature ?",o:["Un « x » à la place du numéro de case", "Un « h » entre deux notes", "Une flèche vers le haut", "« PM » avec une ligne pointillée"],a:3,exp:"« PM » (ou « P.M. »), avec une ligne pointillée sous les notes concernées. Le « x » note une note étouffée, ce n'est pas la même chose.",xp:30},
  {id:"q-rhy-48",courseId:"rhythm",lessonId:"rhy-c4-03",lvl:2,q:"En funk, avec quoi étouffe-t-on surtout les cordes pour le « scratch » ?",o:["La paume droite, posée près du chevalet", "Le pouce, sur la corde grave", "La main gauche, posée sur les cordes", "Un chiffon glissé sous les cordes"],a:2,exp:"En funk, c'est la main gauche (souvent l'index) qui étouffe toutes les cordes ; le médiator frappe ces cordes étouffées : un « scratch » court et percussif.",xp:40},
];
