// Leçon d'annexe (module « annexes ») + les questions de quiz qui s'y
// rattachent. Format « leçon en cartes » (src/content/README.md).
// Facultative : pas de palier, jamais bloquante (pathEngine.estModuleAnnexe).
// Aucune marque citée : on parle de types de réglages et d'effets.

export default {
  id: "annexes-ampli", annexe: true,
  title: "Régler son ampli et ses effets",
  duration: 9,
  gropiTip: "Baisse toujours le volume de l'ampli avant de brancher ou de débrancher ton câble : tu évites un gros « pop » dans le haut-parleur, et dans tes oreilles.",
  cartes: [
    { type: "idee", titre: "Gain et volume, deux rôles", texte: [
      "Le gain règle combien le signal sature à l'entrée de l'ampli : peu de gain, son clair ; beaucoup, son saturé.",
      "Le volume (ou master) ne règle que la puissance. Pour saturer sans réveiller les voisins : gain haut, volume bas.",
    ] },
    { type: "idee", titre: "Clair, crunch, saturé", texte: [
      "Clair : gain bas, chaque note de l'accord se détache. Crunch : gain moyen, le son grogne quand tu attaques fort et s'éclaircit quand tu joues doux.",
      "Saturé : gain élevé, son épais qui tient longtemps. Piège classique : trop de gain brouille les accords et ajoute du souffle. Mets-en moins que tu ne crois.",
    ] },
    { type: "question", quizId: "q-ampli-1-annexe" },
    { type: "idee", titre: "L'égaliseur : basses, médiums, aigus", texte: [
      "Pars de tous les boutons à midi, puis corrige à l'oreille. Basses : le corps du son ; trop, et c'est boueux. Aigus : la brillance ; trop, et ça agresse.",
      "Médiums : la présence. Les creuser donne un son impressionnant seul, qui disparaît dès que le groupe joue.",
    ] },
    { type: "a-toi", titre: "Ton clair, puis ton crunch",
      consigne: "Volume bas, égaliseur à midi, gain au minimum : joue Mi mineur, Do, Sol, Ré, quatre coups par accord. Monte le gain peu à peu jusqu'à ce que les accords grognent quand tu grattes fort. Alterne gratté doux et gratté fort pour entendre le crunch réagir.",
      bpm: 70, minuteur: 300 },
    { type: "question", quizId: "q-ampli-4-annexe" },
    { type: "idee", titre: "Overdrive ou distorsion ?", texte: [
      "Deux pédales de saturation. L'overdrive imite un ampli à lampes poussé : saturation douce, qui s'éclaircit quand tu baisses le volume de ta guitare.",
      "La distorsion sature davantage : son plus épais et plus compressé, taillé pour les riffs rock et metal.",
    ] },
    { type: "idee", titre: "Les effets et leur ordre", texte: [
      "La reverb place ton son dans une pièce ou une salle. Le delay répète ta note, comme un écho. Le chorus le double avec une légère ondulation, effet large et miroitant.",
      "Ordre courant, de la guitare vers l'ampli : accordeur, compresseur, saturations, modulations, delay, et la reverb en dernier. Ce n'est pas une loi : ton oreille tranche.",
    ] },
    { type: "question", quizId: "q-ampli-2-annexe" },
    { type: "recap", points: [
      "Le gain règle la saturation, le volume la puissance : ce sont deux boutons différents.",
      "Égaliseur à midi pour commencer ; garde des médiums pour exister dans un groupe.",
      "Ordre courant : saturations, puis modulations, puis delay, la reverb en dernier.",
    ] },
  ],
  quiz: ["q-ampli-1-annexe", "q-ampli-2-annexe", "q-ampli-3-annexe", "q-ampli-4-annexe"],
};

export const quiz = [
  {id:"q-ampli-1-annexe",courseId:"annexes",lessonId:"annexes-ampli",lvl:1,q:"Tu veux un son plus saturé sans jouer plus fort. Quel bouton montes-tu ?",o:["Le gain","Le master","Les aigus","La reverb"],a:0,exp:"Le gain pousse l'entrée de l'ampli jusqu'à la saturation ; le master (volume général) ne change que la puissance. Gain plus haut, master inchangé : plus de grain, même volume.",xp:20},
  {id:"q-ampli-2-annexe",courseId:"annexes",lessonId:"annexes-ampli",lvl:2,q:"Tu as une overdrive, un chorus et une reverb. Dans quel ordre les branches-tu, de la guitare vers l'ampli ?",o:["Overdrive, chorus, reverb","Reverb, chorus, overdrive","Chorus, reverb, overdrive","Reverb, overdrive, chorus"],a:0,exp:"Saturation d'abord, puis modulation (le chorus), puis l'espace (la reverb) en dernier. Une reverb placée avant l'overdrive serait saturée à son tour, et le son deviendrait brouillon.",xp:25},
  {id:"q-ampli-3-annexe",courseId:"annexes",lessonId:"annexes-ampli",lvl:1,q:"Quel effet répète ta note plusieurs fois, comme un écho dans la montagne ?",o:["Le delay","Le chorus","Le compresseur","L'overdrive"],a:0,exp:"Le delay enregistre ce que tu joues et le rejoue après un court instant, une ou plusieurs fois. La reverb, elle, simule un espace sans répétitions distinctes.",xp:20},
  {id:"q-ampli-4-annexe",courseId:"annexes",lessonId:"annexes-ampli",lvl:2,q:"Ton son est superbe seul, mais disparaît dès que le groupe joue. Quel réglage d'égaliseur essaies-tu d'abord ?",o:["Remonter les médiums","Couper les médiums","Monter les basses à fond","Baisser les aigus à zéro"],a:0,exp:"Les médiums portent la présence de la guitare. Les creuser flatte le son seul, mais la guitare se noie alors entre la basse et la batterie.",xp:25},
];
