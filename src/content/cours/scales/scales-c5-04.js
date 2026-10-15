// Leçon du module « scales » + les questions de quiz qui s'y rattachent.
// Format décrit dans src/content/README.md.

export default {
  id: "scales-c5-04", level: 8,
  title: "Lydien — l'évasion onirique",
  duration: 10,
  gropiTip: "Trouve la #4 en une seconde : c'est un triton (6 cases) au-dessus de la fondamentale sur la même corde. Fa case 1 corde 6 → Si case 7 corde 6. Le diabolus in musica, en version féerique !",
  content: [
    { type: "p", text: "Le lydien, c'est le mode du rêve, de l'espace ouvert, du mystère bienveillant. Il est utilisé par les compositeurs de musiques de film pour évoquer la magie, le voyage, l'évasion. Visuellement, le lydien c'est un grand ciel bleu, une lumière dorée. C'est le mode le plus brillant des sept." },
    { type: "h", text: "Construction" },
    { type: "p", text: "Le lydien est le 4e mode de la gamme majeure. Si tu joues Do majeur en commençant sur Fa, tu obtiens Fa lydien : Fa-Sol-La-Si-Do-Ré-Mi. Mêmes notes que Do majeur, fondamentale = Fa." },
    { type: "h", text: "Formule" },
    { type: "p", text: "1 - 2 - 3 - #4 - 5 - 6 - 7. Comparé à la gamme majeure (Ionien), le lydien a une QUARTE AUGMENTÉE au lieu d'une quarte juste. C'est cette #4 qui crée la magie." },
    { type: "h", text: "La note caractéristique : la #4 (quarte augmentée)" },
    { type: "p", text: "En Fa lydien, c'est Si (la #4 par rapport à Fa). Cette note est à un demi-ton de la quinte (Do), ce qui crée une tension non résolue, 'flottante'. Au lieu de descendre vers la quinte (résolution attendue), tu peux la laisser en suspension. Cette suspension perpétuelle = effet lydien. C'est ce qui rend le mode magique et mystérieux." },
    { type: "h", text: "Couleur sonore" },
    { type: "p", text: "Brillant, flottant, magique, ouvert, parfois mystérieux. Si le ionien est 'lumineux et stable', le lydien est 'lumineux et flottant'. Il évoque l'envol, la rêverie. C'est le mode de Steven Spielberg, de John Williams, des bandes-son de fantasy." },
    { type: "h", text: "Sur quels accords l'utiliser" },
    { type: "p", text: "Sur tout accord Maj7 dans un contexte non-tonal classique (pas de résolution V-I). Particulièrement sur des vamps Maj7-Maj7 distantes d'un ton (ex : Do-Ré en accords majeurs = Do lydien, le Fa# du Ré venant colorer le Do). Très utilisé en jazz fusion (Pat Metheny adore le lydien) et en composition cinématographique." },
    {
      type: "scale_pattern",
      caption: "Fa lydien — fondamentale case 8 c5. Note clé : Si naturel, la quarte augmentée (case 7 c6, case 9 c4, case 7 c1)",
      data: {
        startFret: 7, endFret: 11,
        rootColor: "pink", noteColor: "primary", accentColor: "coral", accentLabel: "Si, quarte augmentée",
        strings: [
          { frets: [7, 8, 10], root: [], accent: [7] },
          { frets: [7, 8, 10], root: [8] },
          { frets: [7, 9, 10], root: [], accent: [9] },
          { frets: [7, 9, 10], root: [10] },
          { frets: [8, 10], root: [] },
          { frets: [7, 8, 10], root: [], accent: [7] },
        ],
        noteMap: {
          "7,0":"Si","8,0":"Do","10,0":"Ré",
          "7,1":"Mi","8,1":"Fa","10,1":"Sol",
          "7,2":"La","9,2":"Si","10,2":"Do",
          "7,3":"Ré","9,3":"Mi","10,3":"Fa",
          "8,4":"Sol","10,4":"La",
          "7,5":"Si","8,5":"Do","10,5":"Ré",
        },
      },
    },
    { type: "h", text: "Histoire" },
    { type: "p", text: "Le lydien doit son nom au royaume antique de Lydie (actuelle Turquie occidentale). C'était un mode 'sacré' dans la Grèce antique. Au XXe siècle, il a été massivement adopté par le jazz (George Russell, 'The Lydian Chromatic Concept', 1953). John Williams en a fait sa marque de fabrique pour Star Wars, E.T., Indiana Jones." },
    { type: "ref", text: "Exemples emblématiques : Le thème de 'E.T.' (John Williams, 1982) commence sur la #4 en Fa lydien — c'est cette note qui donne instantanément l'effet 'magie'. La musique de 'Princesse Mononoké' (Joe Hisaishi) utilise le lydien. 'Joy' (Bach, BWV 147 — 'Jésus que ma joie demeure') a des passages en lydien. 'Flying in a Blue Dream' (Joe Satriani) est en mi lydien. Le morceau 'Dreams' de Fleetwood Mac est en La lydien." },
    { type: "tip", text: "Pour expérimenter le lydien : enregistre (ou fais tourner) un accord Fmaj7 en boucle. Par-dessus, joue Fa, puis Si naturel, et laisse le Si sonner longtemps sans le résoudre. Tu entends cette lumière suspendue ? C'est la #4, la signature du lydien." },
  ],
  quiz: ["q-scales-10","q-scales-11","q-scales-19","q-impro-11"],
};

export const quiz = [
  {id:"q-scales-10",courseId:"scales",lessonId:"scales-c5-04",lvl:2,q:"Quel est le mode 'le plus brillant' dans l'ordre des modes ?",o:["Ionien","Mixolydien","Lydien","Phrygien"],a:2,exp:"Lydien (#4) > Ionien > Mixolydien (♭7) > Dorien (♭3) > Éolien (♭6) > Phrygien (♭2) > Locrien (♭5). Plus on descend, plus le mode est sombre.",xp:45},
  {id:"q-scales-11",courseId:"scales",lessonId:"scales-c5-04",lvl:3,q:"Quelle note caractérise le mode lydien par rapport à l'ionien ?",o:["♭7","#5","♭3","#4"],a:3,exp:"Lydien = ionien (majeur) avec #4. Do lydien = Do-Ré-Mi-Fa#-Sol-La-Si. Le Fa# crée une couleur 'flottante', filmique (Star Wars, E.T.).",xp:45},
  {id:"q-scales-19",courseId:"scales",lessonId:"scales-c5-04",lvl:3,q:"Le mode lydien évoque typiquement quelle ambiance ?",o:["Tristesse","Tension dramatique","Énergie blues","Espace, rêve, magie"],a:3,exp:"Lydien (#4) crée une couleur 'flottante', non-résolue. Son utilisé par John Williams (Star Wars, E.T.), Spielberg. Ambiance ouverte, magique, filmique.",xp:45},
  {id:"q-impro-11",courseId:"impro",lessonId:"scales-c5-04",lvl:3,q:"Quelle gamme jouer sur un accord Cmaj7#11 ?",o:["Do majeure","Do mixolydien","Do dorien","Do lydien"],a:3,exp:"Maj7#11 contient un #4. Le mode lydien (1-2-3-#4-5-6-7) correspond exactement. Do lydien sur Cmaj7#11 = match parfait.",xp:65},
];
