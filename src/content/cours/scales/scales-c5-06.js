// Leçon du module « scales » + les questions de quiz qui s'y rattachent.
// Format décrit dans src/content/README.md.

export default {
  id: "scales-c5-06", level: 8,
  title: "Éolien — la mélancolie naturelle",
  duration: 9,
  content: [
    { type: "p", text: "L'éolien est le mode mineur 'standard' — la gamme mineure naturelle que tu connais déjà sans le savoir. C'est le mode des ballades tristes, des chansons mélancoliques, des morceaux introspectifs. Il porte en lui plus de mille ans de musique européenne." },
    { type: "h", text: "Construction" },
    { type: "p", text: "L'éolien est le 6e mode de la gamme majeure. Si tu joues Do majeur en commençant sur La, tu obtiens La éolien : La-Si-Do-Ré-Mi-Fa-Sol. Mêmes notes que Do majeur, fondamentale = La. C'est exactement la gamme mineure naturelle de La." },
    { type: "h", text: "Formule" },
    { type: "p", text: "1 - 2 - ♭3 - 4 - 5 - ♭6 - ♭7. C'est la gamme mineure naturelle. Pas de note 'caractéristique' qui le distinguerait — c'est lui-même la référence du 'son mineur'." },
    { type: "h", text: "Pourquoi pas de note caractéristique ?" },
    { type: "p", text: "Comme le ionien (= majeur), l'éolien est trop 'standard' pour avoir une note qui le ferait sortir du lot. C'est par rapport à lui qu'on définit les autres modes mineurs : le dorien a la 6 majeure (vs ♭6 de l'éolien). Le phrygien a la ♭2 (vs 2 de l'éolien). Le locrien a la ♭5 (vs 5 de l'éolien). L'éolien est la base mineure, le mineur 'pur'." },
    { type: "h", text: "Couleur sonore" },
    { type: "p", text: "Mélancolique, triste, introspectif, dramatique. Le 'son mineur' classique. Quand quelqu'un dit 'cette chanson est en mineur', il parle généralement de l'éolien. C'est le mode de la majorité des ballades, des chansons d'amour torturé, des introspections musicales." },
    { type: "h", text: "Sur quels accords l'utiliser" },
    { type: "p", text: "Tout accord mineur dans un contexte 'tonal' classique (chanson en La mineur, par exemple). Toute progression Im-IVm-Vm typique du folk, de la pop mélancolique, du rock tristoune. C'est la valeur sûre du mineur." },
    {
      type: "scale_pattern",
      caption: "La éolien (mineur naturel) — case 5. Même forme que Am pentatonique + 2 notes (Si, Fa)",
      data: {
        startFret: 4, endFret: 9,
        rootColor: "primary", noteColor: "green",
        strings: [
          { frets: [5, 7, 8], root: [5] },
          { frets: [5, 7, 8], root: [] },
          { frets: [5, 7], root: [] },
          { frets: [5, 7], root: [] },
          { frets: [5, 6, 8], root: [] },
          { frets: [5, 7, 8], root: [5] },
        ],
        noteMap: {
          "5,0":"La","7,0":"Si","8,0":"Do",
          "5,1":"Ré","7,1":"Mi","8,1":"Fa",
          "5,2":"Sol","7,2":"La",
          "5,3":"Do","7,3":"Ré",
          "5,4":"Mi","6,4":"Fa","8,4":"Sol",
          "5,5":"La","7,5":"Si","8,5":"Do",
        }
      },
    },
    { type: "h", text: "Histoire" },
    { type: "p", text: "L'éolien tient son nom de l'Éolide, une région de la Grèce antique. Comme l'ionien, il n'est entré officiellement dans la théorie des modes qu'au XVIe siècle, avec le théoricien Glarean (Dodecachordon, 1547), avant de devenir la base de la gamme mineure de la musique tonale." },
    { type: "ref", text: "Exemples emblématiques : 'Stairway to Heaven' (Led Zeppelin) en La éolien. 'House of the Rising Sun' (The Animals) en La éolien. 'Mad World' (Tears for Fears / Gary Jules) en Mi éolien. La quasi-totalité des chansons traditionnelles celtiques, des ballades folk russes, et de la musique 'gypsy' moderne. Quand tu entends une chanson 'qui sent l'automne', il y a de bonnes chances qu'elle soit en éolien." },
    { type: "tip", text: "Tu connais déjà l'éolien si tu as travaillé la pentatonique mineure (qui en est extraite). Pour passer de la penta à l'éolien complet, ajoute simplement le 2 (la seconde majeure) et la ♭6 (la sixte mineure). Tu as la gamme complète." },
  ],
  quiz: ["q-scales-40", "q-scales-41", "q-scales-42", "q-logic-10", "q-scales-03"],
};

export const quiz = [
  {id:"q-scales-40",courseId:"scales",lessonId:"scales-c5-06",lvl:1,q:"À quelle gamme correspond le mode éolien ?",o:["La gamme mineure harmonique","La pentatonique mineure","La gamme blues","La gamme mineure naturelle"],a:3,exp:"Éolien = 1 - 2 - ♭3 - 4 - 5 - ♭6 - ♭7 : la gamme mineure naturelle.",xp:30},
  {id:"q-scales-41",courseId:"scales",lessonId:"scales-c5-06",lvl:2,q:"Quelle note distingue l'éolien du dorien ?",o:["La sixte mineure (♭6)","La septième mineure (♭7)","La tierce mineure (♭3)","La seconde majeure (2)"],a:0,exp:"Le dorien a une sixte majeure, l'éolien une sixte mineure (♭6) : c'est la seule différence.",xp:40},
  {id:"q-scales-42",courseId:"scales",lessonId:"scales-c5-06",lvl:1,q:"Pour passer de la penta mineure à l'éolien, quelles notes ajoute-t-on ?",o:["La 3 et la 7","La 2 et la ♭6","La ♭2 et la ♭5","La 6 et la 7"],a:1,exp:"Penta mineure = 1 - ♭3 - 4 - 5 - ♭7. On ajoute la seconde (2) et la sixte mineure (♭6) : on obtient l'éolien complet.",xp:30},
];
