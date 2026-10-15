// Leçon du module « scales » + les questions de quiz qui s'y rattachent.
// Format décrit dans src/content/README.md.

export default {
  id: "scales-c5-05", level: 8,
  title: "Mixolydien — le roi du rock",
  duration: 11,
  gropiTip: "Repère la ♭7 vite : elle est un ton (2 cases) sous l'octave de la fondamentale. Dans la position Sol case 3, le Sol de la corde 4 est case 5, et le Fa juste en dessous, case 3.",
  content: [
    { type: "p", text: "Le mixolydien est le mode du rock, du blues, du country, du funk. C'est le mode des guitaristes par excellence. Si tu écoutes Hendrix, les Stones, Zeppelin, AC/DC, ZZ Top — beaucoup de leurs riffs et solos sont en mixolydien. Ce mode est fait pour la guitare." },
    { type: "h", text: "Construction" },
    { type: "p", text: "Le mixolydien est le 5e mode de la gamme majeure. Si tu joues Do majeur en commençant sur Sol, tu obtiens Sol mixolydien : Sol-La-Si-Do-Ré-Mi-Fa. Mêmes notes que Do majeur, fondamentale = Sol." },
    { type: "h", text: "Formule" },
    { type: "p", text: "1 - 2 - 3 - 4 - 5 - 6 - ♭7. Comparé à la gamme majeure (Ionien), le mixolydien a une SEPTIÈME MINEURE au lieu d'une septième majeure. Ce simple changement transforme tout." },
    { type: "h", text: "La note caractéristique : la ♭7" },
    { type: "p", text: "En Sol mixolydien, c'est Fa (la ♭7). Cette note est à un ton de la fondamentale (Sol), au lieu du demi-ton de la sensible classique. Du coup, la résolution 'sensible → tonique' du majeur disparaît : Fa ne 'tire' pas vers Sol comme Si tirerait vers Do. Le mixolydien sonne 'décontracté', 'flottant' — comme une dominante qui ne résout jamais. C'est exactement ce qu'on veut en blues et en rock." },
    { type: "h", text: "Couleur sonore" },
    { type: "p", text: "Lumineux mais décontracté. Bluesy. Rock'n'roll. Il a la luminosité du majeur, mais sans la 'demande de résolution' du ionien. C'est pour ça que ça sonne plus 'sale', plus 'libre'." },
    { type: "h", text: "Sur quels accords l'utiliser" },
    { type: "p", text: "1) Tout accord 7 (dominante) dans un contexte non-résolu : sur G7 → Sol mixolydien. 2) Tous les blues majeurs : sur un blues en La (A7-D7-E7), tu peux jouer La mixolydien sur tout. 3) Vamps I-♭VII typiques du rock : Ré-Do-Ré-Do = Ré mixolydien. 4) Riffs de hard rock (Whole Lotta Love, Smoke on the Water utilisent mixolydien)." },
    {
      type: "scale_pattern",
      caption: "Sol mixolydien — case 3. Note clé : Fa naturel, la septième mineure (case 3 c4)",
      data: {
        startFret: 1, endFret: 6,
        rootColor: "coral", noteColor: "primary",
        strings: [
          { frets: [3, 5], root: [3] },
          { frets: [2, 3, 5], root: [] },
          { frets: [2, 3, 5], root: [], accent: [3] },
          { frets: [2, 4], root: [] },
          { frets: [1, 3, 5], root: [] },
          { frets: [3, 5], root: [3] },
        ],
        noteMap: {
          "3,0":"Sol","5,0":"La",
          "2,1":"Si","3,1":"Do","5,1":"Ré",
          "2,2":"Mi","3,2":"Fa","5,2":"Sol",
          "2,3":"La","4,3":"Si",
          "1,4":"Do","3,4":"Ré","5,4":"Mi",
          "3,5":"Sol","5,5":"La",
        }
      },
    },
    { type: "p", text: "Sur un accord G7 (Sol-Si-Ré-Fa), tu pourrais être tenté de jouer Sol majeur. Mais Sol majeur contient Fa#, alors que G7 contient Fa naturel. Le Fa# de Sol majeur entre en conflit avec le Fa de l'accord. Le mixolydien (avec Fa naturel) est en revanche en parfaite cohérence avec G7. Match parfait." },
    { type: "h", text: "Histoire" },
    { type: "p", text: "Le mixolydien doit son nom à la 'mixture lydienne' antique. Au Moyen-Âge, c'était un mode majeur très utilisé en chant grégorien. Mais c'est au XXe siècle qu'il a explosé : le blues afro-américain, qui mélange gamme majeure et 'blue notes', sonne presque toujours mixolydien. Les Beatles l'ont popularisé en pop ('Norwegian Wood', 'Tomorrow Never Knows'). Hendrix en a fait l'âme du rock psychédélique ('Hey Joe', 'Voodoo Child'). Aujourd'hui, c'est le mode du rock, point." },
    { type: "ref", text: "Exemples emblématiques : 'Sweet Home Chicago' (Robert Johnson) en Mi mixolydien. 'Norwegian Wood' (Beatles) en Mi mixolydien. 'Whole Lotta Love' (Led Zeppelin) en Mi mixolydien. 'Sweet Home Alabama' (Lynyrd Skynyrd) en Sol mixolydien. 'Free Falling' (Tom Petty) en Fa mixolydien. La grande majorité des solos d'Eric Clapton, Hendrix, Stevie Ray Vaughan dans un contexte rock-blues sont en mixolydien." },
    { type: "tip", text: "Astuce mixolydien : sur un blues en La, tu connais probablement déjà la pentatonique mineure de La. Pour 'colorer' ton solo en mixolydien, ajoute la 3 majeure (Do#) et la 6 (Fa#) à ta penta. Ça te donnera les notes de La mixolydien sans tout réapprendre. Le truc des bluesmen depuis 100 ans." },
  ],
  quiz: ["q-scales-16","q-scales-17","q-impro-14","q-fret-scales-05","q-logic-03","q-logic-08"],
};

export const quiz = [
  {id:"q-scales-16",courseId:"scales",lessonId:"scales-c5-05",lvl:2,q:"Sur un accord G7 (dominante non-résolue), quel mode utiliser ?",o:["Sol mixolydien", "Sol ionien (majeur)", "Sol dorien", "Sol lydien"],a:0,exp:"Sur tout accord 7 (dominante), le mixolydien correspond. Sol mixolydien = Sol-La-Si-Do-Ré-Mi-Fa. Le Fa naturel (♭7) = la 7e de l'accord G7.",xp:40},
  {id:"q-scales-17",courseId:"scales",lessonId:"scales-c5-05",lvl:3,q:"Que se passe-t-il si tu joues Sol majeur (au lieu de Sol mixolydien) sur un accord G7 ?",o:["Rien, les deux gammes sont identiques", "Le Fa# frotte contre le Fa de l'accord", "Ça sonne plus joyeux, sans aucun frottement", "Ça sonne plus mineur et plus sombre qu'avant"],a:1,exp:"Sol majeur contient Fa#. G7 contient Fa naturel (la ♭7). Le Fa# entre en conflit avec le Fa de l'accord. Mixolydien (Fa naturel) = match parfait avec G7.",xp:55},
  {id:"q-impro-14",courseId:"impro",lessonId:"scales-c5-05",lvl:3,q:"Sur un blues en La (A7-D7-E7), tu joues La mixolydien sur les trois accords. Où ça frotte ?",o:["Nulle part, la gamme contient les 3 accords", "Sur A7 seulement, à cause de son Sol", "Sur D7 et E7 (Do# / Do, Sol / Sol#)", "Sur les trois accords, sans exception"],a:2,exp:"La mixolydien = La-Si-Do#-Ré-Mi-Fa#-Sol : parfait sur A7 (La-Do#-Mi-Sol). Mais D7 contient Do, qui frotte contre le Do#, et E7 contient Sol#, qui frotte contre le Sol. On adapte : Ré mixolydien sur D7, Mi mixolydien sur E7 — ou la penta mineure de La, qui sonne blues sur les trois.",xp:70},
  {id:"q-fret-scales-05",type:"fretboard",courseId:"scales",lessonId: "scales-c5-05",lvl:2,q:"Trouve les notes du mixolydien de Sol (cases 0-5)",concept:{type:"find_scale",root:"G",quality:"mixolydian"},selectionRules:{mode:"all"},fretRange:[0,5],display:{showNotes:false},hint:"Mixolydien = majeure avec 7e mineure. Sol-La-Si-Do-Ré-Mi-Fa.",xp:55,exp:"Sol mixolydien : le Fa naturel (pas Fa#) est la note caractéristique."},
];
