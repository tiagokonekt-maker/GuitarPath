// Leçon du module « scales » + les questions de quiz qui s'y rattachent.
// Format « leçon en cartes » décrit dans src/content/README.md.

export default {
  id: "scales-c6-03", level: 9,
  title: "Comment choisir une gamme en improvisation",
  duration: 10,
  gropiTip: "Mini-routine : sur une vamp Am7, joue 2 tours en pentatonique mineure, 2 en éolien, puis 2 en dorien. Note la couleur que ton oreille préfère : c'est comme ça que l'instinct se construit.",
  cartes: [
    { type: "idee", titre: "1. La tonalité", texte: [
      "Repère l'accord sur lequel la grille revient et se termine. Do ? Tu es sans doute en Do majeur. Am ? En La mineur.",
      "Tu tiens ta gamme par défaut : la majeure ou la mineure naturelle de cette tonique.",
    ] },
    { type: "idee", titre: "2. Une tonalité, une gamme", texte: [
      "Si tous les accords viennent de la même tonalité, inutile de changer de gamme à chaque accord. La gamme parente fonctionne sur toute la grille.",
      "Vise simplement les notes de l'accord du moment, surtout sa tierce. Ça marche très souvent en pop, en folk et en rock.",
    ] },
    { type: "idee", titre: "3. Le style oriente", texte: [
      "Pop, folk : majeur ou mineur naturel. Blues, rock : penta mineure, gamme blues, mixolydien. Musiques celtiques : souvent le dorien. Flamenco : phrygien dominant.",
      "Le style ne décide pas à ta place, mais il te donne une piste.",
    ] },
    { type: "question", quizId: "q-scales-47" },
    { type: "idee", titre: "4. Vamps et cas particuliers", texte: [
      "Un seul accord tenu longtemps ? Prends son mode : Dm7 → Ré dorien, G7 → Sol mixolydien, Cmaj7 → ionien ou lydien.",
      "Un V7 qui résout vers un accord mineur ? La mineure harmonique de l'accord d'arrivée.",
    ] },
    { type: "question", quizId: "q-scales-46" },
    { type: "idee", titre: "La règle de survie", texte: [
      "Dans le doute, la penta mineure de la tonique passe presque partout. En majeur, prends celle de la relative : La penta mineure sur un morceau en Do.",
      "Puis affine à l'oreille : la théorie te donne les options, ton oreille choisit.",
    ], bloc: { type: "scale_pattern", caption: "La pentatonique mineure, case 5 — la gamme de survie, en La mineur comme en Do majeur", data: {startFret: 4, endFret: 9, rootColor: "amber", noteColor: "primary", strings: [{frets: [5,8], root: [5]}, {frets: [5,7], root: []}, {frets: [5,7], root: [7]}, {frets: [5,7], root: []}, {frets: [5,8], root: []}, {frets: [5,8], root: [5]}], noteMap: {"5,0":"La", "8,0":"Do", "5,1":"Ré", "7,1":"Mi", "5,2":"Sol", "7,2":"La", "5,3":"Do", "7,3":"Ré", "5,4":"Mi", "8,4":"Sol", "5,5":"La", "8,5":"Do"}} } },
    { type: "a-toi", titre: "Une gamme, trois accords",
      consigne: "Fais tourner Dm7, G7, Cmaj7, Cmaj7, une mesure chacun, au clic à 70. Reste en Do majeur tout du long et vise la tierce de chaque accord : Fa, Si, puis Mi. La tab te montre le chemin ; ensuite, improvise en gardant ces trois cibles.",
      bloc: {
        type: "tab",
        caption: "Do majeur sur Dm7 – G7 – Cmaj7 : chaque phrase se pose sur la tierce de l'accord (Fa, Si, Mi)",
        text: "Tab — Dm7 : corde 2 cases 5 et 6 (Mi, Fa). G7 : corde 1 cases 5 et 7 (La, Si). Cmaj7 : corde 1 cases 8, 7, 5 (Do, Si, La), corde 2 case 5 (Mi).",
        data: { lines: [
          "e|-------|-5--7--|-8--7--5-----|",
          "B|-5--6--|-------|----------5--|",
          "G|-------|-------|-------------|",
          "D|-------|-------|-------------|",
          "A|-------|-------|-------------|",
          "E|-------|-------|-------------|",
        ] },
      }, bpm: 70, minuteur: 150 },
    { type: "question", quizId: "q-scales-48" },
    { type: "recap", points: [
      "Trouve la tonalité : l'accord de retour et de fin donne ta gamme par défaut.",
      "Accords d'une même tonalité : une seule gamme, en visant les notes de chaque accord.",
      "Vamp : le mode de l'accord ; V7 vers un mineur : mineure harmonique.",
    ] },
  ],
  quiz: ["q-scales-46", "q-scales-47", "q-scales-48", "q-scales-17", "q-scales-18"],
};

export const quiz = [
  {id:"q-scales-46",courseId:"scales",lessonId:"scales-c6-03",lvl:3,q:"Une vamp tourne sur Am7 - D7. Quel mode choisir sur La ?",o:["La dorien","La éolien","La phrygien","La mineure harmonique"],a:0,exp:"D7 contient Fa#, la sixte majeure de La : c'est la note du dorien. Am7 - D7 = ii-V de Sol majeur, dont La dorien est le 2e mode. Avec La éolien (Fa naturel), le D7 frotterait. C'est la grille d'« Oye Como Va » (Santana).",xp:50},
  {id:"q-scales-47",courseId:"scales",lessonId:"scales-c6-03",lvl:2,q:"Sur Dm7 - G7 - Cmaj7 (tous diatoniques de Do), quelle gamme suffit ?",o:["Une gamme différente par accord, obligatoirement","Do majeur sur toute la grille","La pentatonique de Ré seulement","La gamme blues de Sol"],a:1,exp:"Tant que tous les accords appartiennent à une seule tonalité, la gamme parente (Do majeur) fonctionne sur toute la grille.",xp:40},
  {id:"q-scales-48",courseId:"scales",lessonId:"scales-c6-03",lvl:2,q:"Sur E7 qui résout vers Am, quelle gamme utiliser ?",o:["Mi mixolydien","La pentatonique majeure","La mineure harmonique","Mi majeur"],a:2,exp:"Sur un V7 qui résout en mineur, on prend la mineure harmonique du I : La harmonique, avec son Sol# (la tierce de E7).",xp:40},
];
