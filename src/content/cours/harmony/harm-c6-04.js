// Leçon du module « harmony » + les questions de quiz qui s'y rattachent.
// Format « leçon en cartes » décrit dans src/content/README.md.

const DM7 = { type: "chord_diagram", caption: "Vamp dorienne en Ré (1/2) — Dm7, xx0211", data: {name: "Dm7", frets: [-1,-1,0,2,1,1], fingers: [0,0,0,2,1,1], startFret: 1} };

export default {
  id: "harm-c6-04", level: 8,
  title: "Les progressions modales",
  duration: 9,
  gropiTip: "Sur une vamp Lam7-Ré7 (La dorien), insiste sur le Fa# : c'est la note qui distingue le dorien du La mineur naturel. Sans elle, ton impro perd la couleur dorienne.",
  cartes: [
    { type: "idee", titre: "Tourner plutôt que voyager", texte: [
      "Une progression tonale voyage : tension, résolution, retour à la tonique. Une progression modale tourne : deux accords en boucle autour d'un centre, sans cadence V-I qui ramènerait ailleurs.",
      "L'accord qui revient devient la tonique, et la gamme s'entend depuis lui. Ambiance statique, hypnotique.",
    ] },
    { type: "question", quizId: "q-harm-60" },
    { type: "idee", titre: "La vamp dorienne", texte: [
      "Im7 - IV7 : Dm7 - G7 en boucle. Le Si de G7 est la sixte majeure de Ré, la note qui fait dorien.",
      "On peut même rester sur un seul accord : dans « So What » de Miles Davis, Dm7 tient des sections entières.",
    ], bloc: { type: "chord_diagram", caption: "Vamp dorienne en Ré (2/2) — G7, 320001 : son Si est la sixte majeure de Ré", data: {name: "G7", frets: [3,2,0,0,0,1], fingers: [3,2,0,0,0,1], startFret: 1} } },
    { type: "idee", titre: "Mixolydien et phrygien", texte: [
      "Mixolydien : I - ♭VII, un accord majeur et celui un ton plus bas. Ré - Do, La - Sol : son rock, ouvert.",
      "Phrygien : Im - ♭II, le demi-ton au-dessus de la tonique. Am - Si♭ sonne tout de suite espagnol.",
    ] },
    { type: "idee", titre: "La cadence andalouse", texte: [
      "Am - G - F - E : on la croit en La mineur, mais elle se pose sur Mi. C'est du Mi phrygien : iv - ♭III - ♭II - I.",
      "Le demi-ton entre le ♭II et la tonique, dans la basse, signe le phrygien. Flamenco, musique latine, métal : on l'entend partout.",
    ] },
    { type: "question", quizId: "q-harm-61" },
    { type: "idee", titre: "La vamp lydienne", texte: [
      "Imaj7 - II : Cmaj7 - D en boucle. Le Fa# de l'accord de Ré est la quarte augmentée de Do, la couleur du lydien.",
      "Un son suspendu, lumineux, souvent entendu dans les musiques de film.",
    ] },
    { type: "a-toi", titre: "Trois vamps, trois couleurs",
      consigne: "Deux mesures par accord au clic. Vamp 1 : Dm7 - G7, improvise en Ré dorien et appuie le Si. Vamp 2 : D - C, Ré mixolydien, appuie le Do. Vamp 3 : Em - F, Mi phrygien, appuie le Fa. Même idée : la note caractéristique sur un temps fort.",
      bloc: DM7, bpm: 80, minuteur: 240 },
    { type: "question", quizId: "q-impro-02" },
    { type: "recap", points: [
      "Modal : une boucle qui tourne autour d'un centre, sans cadence V-I.",
      "Dorien Im7-IV7, mixolydien I-♭VII, phrygien Im-♭II, lydien Imaj7-II.",
      "Fais entendre la note caractéristique du mode sur les temps forts.",
    ] },
  ],
  quiz: ["q-impro-02","q-harm-60","q-harm-61"],
};

export const quiz = [
  {id:"q-impro-02",courseId:"impro",lessonId:"harm-c6-04",lvl:2,q:"Sur une vamp Em7-A7 modale (= ii-V sans résolution), quel mode utiliser ?",o:["Mi phrygien","Mi locrien","Mi dorien","Mi ionien"],a:2,exp:"Em7-A7 = ii-V en Ré majeur sans résolution sur Dmaj7. Sur le ii d'un ii-V modal = dorien du ii. Donc Mi dorien (= Ré majeur en partant de Mi).",xp:50},
  {id:"q-harm-60",courseId:"harmony",lessonId:"harm-c6-04",lvl:2,q:"Une vamp tourne sur Dm7 - G7 sans jamais aller vers Cmaj7. Où l'oreille se pose-t-elle ?",o:["Sur Ré : Ré dorien","Sur Do : Do majeur","Sur Sol : Sol mixolydien","Sur La : La éolien"],a:0,exp:"Sans résolution vers Do, c'est Dm7, l'accord qui revient, qui devient le centre. Les notes de Do majeur s'entendent alors depuis Ré : Ré dorien. C'est le principe d'une progression modale.",xp:40},
  {id:"q-harm-61",courseId:"harmony",lessonId:"harm-c6-04",lvl:2,q:"Quelle vamp évoque immédiatement le phrygien ?",o:["Em - F en boucle","Em - D en boucle","Em - A en boucle","Em - B7 en boucle"],a:0,exp:"F est le ♭II de Mi : le demi-ton Mi-Fa, signature du phrygien, s'entend dans la basse. Em - D sonne éolien ou dorien, Em - A dorien, Em - B7 mineur harmonique.",xp:40},
];
