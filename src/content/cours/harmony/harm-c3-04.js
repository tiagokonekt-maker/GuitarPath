// Leçon du module « harmony » + les questions de quiz qui s'y rattachent.
// Format décrit dans src/content/README.md.

export default {
  id: "harm-c3-04", level: 8,
  title: "Les voicings shell : économe et efficace",
  duration: 8,
  content: [
    { type: "p", text: "Un 'voicing' c'est une manière spécifique de disposer les notes d'un accord sur le manche. Les voicings shell (de l'anglais 'coque, squelette') sont des voicings minimalistes : seulement 2 ou 3 notes, mais les bonnes. Sur la guitare, ces voicings sont la base du jeu jazz et du comping moderne." },
    { type: "h", text: "Définition d'un shell voicing" },
    { type: "p", text: "Un shell voicing = fondamentale + 3e + 7e (la quinte est omise). Ces 3 notes définissent complètement la qualité de l'accord (vu dans la leçon précédente). L'omission de la quinte n'est pas un manque — c'est un choix esthétique qui rend le son plus 'ouvert'." },
    { type: "h", text: "Les voicings shell sur la guitare (cordes 6-5-4)" },
    { type: "p", text: "La disposition la plus pratique : fondamentale sur c6, 3e sur c5 (ou c4), 7e sur c4 (ou c3). Exemple Cmaj7 shell : Do (corde 6 case 8) + Mi (corde 5 case 7) + Si (corde 4 case 9). 3 doigts, 3 cordes, accord parfait. G7 shell : Sol (corde 6 case 3) + Si (corde 5 case 2) + Fa (corde 4 case 3). Dm7 shell : Ré (corde 6 case 10) + Fa (corde 5 case 8) + Do (corde 4 case 10)." },
    { type: "h", text: "Les voicings shell sur cordes 5-4-3" },
    { type: "p", text: "Quand la fondamentale est sur c5 : Cmaj7 shell : Do (corde 5 case 3) + Mi (corde 4 case 2) + Si (corde 3 case 4). G7 shell : Sol (corde 5 case 10) + Si (corde 4 case 9) + Fa (corde 3 case 10). Cette position est plus aiguë, utile pour les progressions dans le médium du manche." },
    { type: "h", text: "Pourquoi omettre la quinte ne pose pas problème" },
    { type: "p", text: "La quinte (une octave plus haut) est le 3e harmonique naturel de n'importe quelle note, le premier après l'octave. Autrement dit, quand tu joues une fondamentale, la quinte est déjà présente dans le son de la corde. Ton oreille 'l'entend' même quand tu ne la joues pas. La quinte est implicite dans toute note fondamentale. C'est pourquoi l'omettre ne change pas la perception de l'accord." },
    { type: "h", text: "Application : comper sur ii-V-I en jazz" },
    { type: "p", text: "Sur la progression Dm7-G7-Cmaj7 (ii-V-I en Do) en shell voicings : Dm7 (corde 6 case 10, corde 5 case 8, corde 4 case 10) → G7 (corde 6 case 3, corde 5 case 2, corde 4 case 3) → Cmaj7 (corde 6 case 8, corde 5 case 7, corde 4 case 9). Si tu joues ça à 80 BPM avec du rythme, tu sonnes jazz immédiatement. Les shell voicings sont le premier pas vers le son jazz sur la guitare." },
    {
      type: "chord_diagram",
      caption: "Cmaj7 shell — fondamentale c6 case 8 (Do-Mi-Si)",
      data: { name: "Cmaj7", frets: [8,7,9,-1,-1,-1], fingers: [2,1,4,0,0,0], startFret: 7 },
    },
    {
      type: "chord_diagram",
      caption: "Dm7 shell — fondamentale c6 case 10 (Ré-Fa-Do)",
      data: { name: "Dm7", frets: [10,8,10,-1,-1,-1], fingers: [2,1,3,0,0,0], startFret: 7 },
    },
    {
      type: "chord_diagram",
      caption: "G7 shell — fondamentale c6 case 3 (Sol-Si-Fa)",
      data: { name: "G7", frets: [3,2,3,-1,-1,-1], fingers: [2,1,3,0,0,0], startFret: 1 },
    },
    { type: "ref", text: "Freddie Green (guitariste du Count Basie Orchestra, 1937-1987) a joué des shell voicings pendant toute sa carrière — 50 ans à comper des accords de 2-3 notes à 4 temps par mesure, à tempo swing. C'est l'utilisation ultime du shell voicing : économe, précis, rythmique, musical." },
    { type: "tip", text: "Apprends ces 4 shell voicings 'par cœur' : Cmaj7 (corde 6 case 8, corde 5 case 7, corde 4 case 9), Dm7 (corde 6 case 10, corde 5 case 8, corde 4 case 10), G7 (corde 6 case 3, corde 5 case 2, corde 4 case 3), Am7 (corde 6 case 5, corde 5 case 3, corde 4 case 5). Ces 4 voicings te donnent la progression I-ii-V-vi en Do majeur en version jazz instantanée." },
  ],
  quiz: ["q-harm-38", "q-harm-39", "q-harm-40", "q-harm-09", "q-harm-12"],
};

export const quiz = [
  {id:"q-harm-38",courseId:"harmony",lessonId:"harm-c3-04",lvl:1,q:"Quelles notes contient un voicing shell ?",o:["Fondamentale, 3e et 5e","Fondamentale, 3e et 7e","3e, 5e et 7e","Fondamentale, 5e et octave"],a:1,exp:"Fondamentale + 3e + 7e : les notes qui définissent la qualité de l'accord. La quinte est omise.",xp:30},
  {id:"q-harm-39",courseId:"harmony",lessonId:"harm-c3-04",lvl:2,q:"Pourquoi peut-on omettre la quinte ?",o:["Elle sonne faux sur tous les accords de 7e","Elle est trop difficile à doigter ici","Elle résonne déjà dans la fondamentale","Elle masque la tierce et la septième"],a:2,exp:"La quinte est le 3e harmonique naturel de la fondamentale : elle est déjà présente dans le son de la corde.",xp:40},
  {id:"q-harm-40",courseId:"harmony",lessonId:"harm-c3-04",lvl:2,q:"Cmaj7 shell, fondamentale corde 6 case 8 : où placer la 3e (Mi) ?",o:["Corde 5, case 8","Corde 4, case 10","Corde 5, case 10","Corde 5, case 7"],a:3,exp:"Corde 5 case 7 = Mi. Le shell complet : Do (c6 case 8), Mi (c5 case 7), Si (c4 case 9).",xp:40},
];
