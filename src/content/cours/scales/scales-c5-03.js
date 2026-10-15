// Leçon du module « scales » + les questions de quiz qui s'y rattachent.
// Format décrit dans src/content/README.md.

export default {
  id: "scales-c5-03", level: 8,
  title: "Phrygien — l'âme andalouse",
  duration: 11,
  content: [
    { type: "p", text: "Le phrygien est le mode qui sonne le plus 'exotique' à une oreille occidentale. Espagnol, oriental, dramatique, parfois inquiétant. Il porte en lui des siècles de musique flamenco, des modes arabes, et l'imaginaire de la péninsule ibérique sous influence maure. C'est aussi le mode favori des guitaristes metal/néo-classique." },
    { type: "h", text: "Construction" },
    { type: "p", text: "Le phrygien est le 3e mode de la gamme majeure. Si tu joues Do majeur en commençant sur Mi, tu obtiens Mi phrygien : Mi-Fa-Sol-La-Si-Do-Ré. Mêmes notes que Do majeur, fondamentale = Mi." },
    { type: "h", text: "Formule" },
    { type: "p", text: "1 - ♭2 - ♭3 - 4 - 5 - ♭6 - ♭7. Comparé à la gamme mineure naturelle (1-2-♭3-4-5-♭6-♭7), le phrygien a une SECONDE MINEURE au lieu d'une seconde majeure. La ♭2 est sa note caractéristique." },
    { type: "h", text: "La note caractéristique : la ♭2" },
    { type: "p", text: "En Mi phrygien, c'est Fa (la ♭2). Cette note est à un demi-ton de la fondamentale, ce qui crée une tension extrême. C'est cette dissonance contrôlée qui donne au phrygien son côté 'oriental' ou 'flamenco'. Quand tu improvises en phrygien, fais-le entendre — sur le premier temps d'une mesure, c'est dévastateur." },
    { type: "h", text: "Couleur sonore" },
    { type: "p", text: "Sombre, mystérieux, oriental, dramatique. Il évoque le désert, le danger, l'exotisme méditerranéen. Pour beaucoup de musiciens, c'est le mode 'le plus différent' parmi les sept — celui qui, instantanément, crée une ambiance. Tu ne joues pas du phrygien par hasard." },
    { type: "h", text: "Phrygien dominant : la variante essentielle" },
    { type: "p", text: "Il existe une variante très utilisée : le phrygien dominant. Formule : 1-♭2-3-4-5-♭6-♭7 (la tierce devient majeure). En Mi : Mi-Fa-Sol#-La-Si-Do-Ré. Cette gamme n'est PAS un mode de la gamme majeure, mais un mode de la gamme mineure harmonique (qu'on verra plus tard). C'est le mode du flamenco authentique, du klezmer juif, et de la musique du Moyen-Orient. Ultra-caractérisé." },
    { type: "h", text: "Sur quels accords l'utiliser" },
    { type: "p", text: "Sur des accords Im (mineur simple) dans un contexte espagnol ou modal sombre. La cadence flamenco classique : Am-G-F-E (en La phrygien). Très utilisé dans les solos métal néoclassique (Yngwie Malmsteen, Steve Vai). Pour le rock, fonctionne sur des riffs en mineur où tu veux ajouter une touche 'sombre' et 'orientale'." },
    {
      type: "scale_pattern",
      caption: "Mi phrygien — case 0. Note caractéristique : Fa, la seconde mineure (case 1 c6, case 1 c1)",
      data: {
        startFret: 0, endFret: 4,
        rootColor: "coral", noteColor: "primary",
        strings: [
          { frets: [0, 1, 3], root: [0], accent: [1] },
          { frets: [0, 2, 3], root: [] },
          { frets: [0, 2], root: [] },
          { frets: [0, 2, 4], root: [] },
          { frets: [0, 1], root: [] },
          { frets: [0, 1, 3], root: [0], accent: [1] },
        ],
        noteMap: {
          "0,0":"Mi","1,0":"Fa","3,0":"Sol",
          "0,1":"La","2,1":"Si","3,1":"Do",
          "0,2":"Ré","2,2":"Mi",
          "0,3":"Sol","2,3":"La","4,3":"Si",
          "0,4":"Si","1,4":"Do",
          "0,5":"Mi","1,5":"Fa","3,5":"Sol",
        }
      },
    },
    { type: "h", text: "Histoire" },
    { type: "p", text: "Le phrygien doit son nom aux Phrygiens (Anatolie, actuelle Turquie). Au Moyen-Âge, l'Église l'utilisait pour des chants grégoriens introspectifs. Il a connu un grand renouveau avec le flamenco moderne (Paco de Lucía) et le metal néoclassique des années 80." },
    { type: "ref", text: "Exemples emblématiques : 'Spain' (Chick Corea) en Ré phrygien dominant. 'Smoke on the Water' utilise des inflexions phrygiennes dans son intro. 'War' (Yngwie Malmsteen) en Mi phrygien dominant. Toute la musique flamenco traditionnelle 'soleá' et 'siguiriya' est en phrygien. Si tu écoutes 'Concierto de Aranjuez' (Joaquín Rodrigo, 1939), tu entends la quintessence du phrygien espagnol." },
    { type: "tip", text: "Pour goûter au phrygien : joue le riff suivant en boucle sur la corde de Mi grave : Mi(0) - Fa(1) - Sol(3) - Mi(0). Tu viens d'esquisser l'âme du phrygien. Reproduis ça avec la ♭2 toujours en évidence et tu sentiras l'Andalousie venir à toi." },
  ],
  quiz: ["q-scales-18","q-impro-07"],
};

export const quiz = [
  {id:"q-scales-18",courseId:"scales",lessonId:"scales-c5-03",lvl:3,q:"Le mode phrygien dominant a quelle formule ?",o:["1-♭2-♭3-4-5-♭6-♭7","1-2-♭3-4-5-6-7","1-♭2-3-4-5-♭6-♭7","1-♭2-♭3-4-♭5-♭6-♭7"],a:2,exp:"Phrygien dominant = phrygien avec 3 majeure (au lieu de ♭3). Formule 1-♭2-3-4-5-♭6-♭7. Mode du flamenco authentique, du klezmer juif, et du Moyen-Orient.",xp:55},
];
