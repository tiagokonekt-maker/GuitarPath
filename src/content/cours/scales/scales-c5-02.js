// Leçon du module « scales » + les questions de quiz qui s'y rattachent.
// Format décrit dans src/content/README.md.

export default {
  id: "scales-c5-02", level: 8,
  title: "Dorien — le mode caméléon",
  duration: 12,
  gropiTip: "Raccourci : ta gamme mineure naturelle avec la 6 montée d'un demi-ton, c'est le dorien. La mineur devient La dorien en changeant juste Fa en Fa# (case 7 corde 2, position case 5).",
  content: [
    { type: "p", text: "Le dorien est le mode mineur le plus polyvalent et le plus utilisé après l'éolien (mineur naturel). Il a une couleur mineure de base, mais avec une touche de lumière qui le rend unique. C'est le mode du jazz modal, du funk, du rock progressif, et de beaucoup de musiques traditionnelles européennes." },
    { type: "h", text: "Construction" },
    { type: "p", text: "Le dorien est le 2e mode de la gamme majeure. Si tu joues Do majeur en commençant sur Ré, tu obtiens Ré dorien : Ré-Mi-Fa-Sol-La-Si-Do. Mêmes notes que Do majeur, fondamentale = Ré." },
    { type: "h", text: "Formule" },
    { type: "p", text: "1 - 2 - ♭3 - 4 - 5 - 6 - ♭7. Comparé à la gamme mineure naturelle (1-2-♭3-4-5-♭6-♭7), le dorien a une SIXTE MAJEURE au lieu d'une sixte mineure. C'est cette 6 majeure qui crée la spécificité du dorien." },
    { type: "h", text: "La note caractéristique : la 6 majeure" },
    { type: "p", text: "Voilà LA note à mettre en valeur quand tu improvises en dorien. En Ré dorien, c'est Si (la 6 majeure). Sans ce Si, tes phrases sonneront 'mineur naturel ordinaire'. Avec ce Si en évidence (sur les temps forts, en notes longues), le dorien s'affirme. Cette note est ce qui donne au dorien son côté 'lumineux dans la mélancolie'." },
    { type: "h", text: "Couleur sonore" },
    { type: "p", text: "Mineur, mais pas triste. Sophistiqué, jazzy, parfois funky. Il y a quelque chose d'optimiste dans le dorien, malgré sa tierce mineure. C'est un mode 'adulte' : ni naïf comme le ionien, ni dramatique comme le phrygien, ni lugubre comme l'éolien." },
    { type: "h", text: "Sur quels accords l'utiliser" },
    { type: "p", text: "1) Tout accord m7 en vamp modale (un seul accord tenu pendant plusieurs mesures). Ex : Dm7 en boucle = Ré dorien. 2) Sur le ii d'un ii-V modal qui ne résout pas (Em7-A7 sans aller vers Dmaj7 = Mi dorien). 3) Sur des progressions Im-IV typiques du folk/rock (Dm-G ou Am-D)." },
    {
      type: "scale_pattern",
      caption: "La dorien — case 5. Note caractéristique : Fa#, la sixte majeure (case 4 c4, case 7 c2, case 9 c5)",
      data: {
        startFret: 4, endFret: 9,
        rootColor: "primary", noteColor: "green", accentColor: "coral", accentLabel: "Fa#, sixte majeure",
        strings: [
          { frets: [5, 7, 8], root: [5] },
          { frets: [5, 7, 9], root: [], accent: [9] },
          { frets: [4, 5, 7], root: [7], accent: [4] },
          { frets: [4, 5, 7], root: [] },
          { frets: [5, 7, 8], root: [], accent: [7] },
          { frets: [5, 7, 8], root: [5] },
        ],
        noteMap: {
          "5,0":"La","7,0":"Si","8,0":"Do",
          "5,1":"Ré","7,1":"Mi","9,1":"Fa#",
          "4,2":"Fa#","5,2":"Sol","7,2":"La",
          "4,3":"Si","5,3":"Do","7,3":"Ré",
          "5,4":"Mi","7,4":"Fa#","8,4":"Sol",
          "5,5":"La","7,5":"Si","8,5":"Do",
        },
      },
    },
    { type: "h", text: "Histoire" },
    { type: "p", text: "Le dorien était l'un des modes préférés de l'Église médiévale. Beaucoup de chants grégoriens sont en dorien. Au XXe siècle, il a été redécouvert par les jazzmen modaux (Miles Davis, John Coltrane). Il est aussi présent dans la musique celtique traditionnelle et le folk progressif." },
    { type: "ref", text: "Exemples emblématiques : 'So What' (Miles Davis, 1959) — 16 mesures de Dm7 en Ré dorien, puis 8 mesures de Mi♭m7 en Mi♭ dorien, puis retour. C'est le manifeste du jazz modal. 'Oye Como Va' (Santana) : vamp Am7-D7 = La dorien. 'Light My Fire' (The Doors) : Am-F#m = La dorien. 'Smoke on the Water' (Deep Purple) : riff principal en Sol dorien." },
    { type: "tip", text: "Drill dorien efficace : drone Ré (corde 5 vide ou app drone). Joue Ré dorien (= notes de Do majeur en partant de Ré) pendant 5 minutes en plaçant un Si appuyé toutes les 2 mesures. Tu sentiras la couleur 'dorien pur' s'installer dans tes oreilles. Refais ça 7 jours de suite : c'est gravé." },
  ],
  quiz: ["q-scales-14","q-scales-15","q-impro-07","q-fret-scales-04"],
};

export const quiz = [
  {id:"q-scales-14",courseId:"scales",lessonId:"scales-c5-02",lvl:2,q:"Sur un accord Dm7 tenu (vamp modale), quel mode privilégier ?",o:["Ré phrygien","Ré locrien","Ré dorien","Ré mixolydien"],a:2,exp:"Sur tout accord m7 dans un contexte modal, le dorien est le mode 'naturel'. Ré dorien sur Dm7 = 'So What' (Miles Davis). Son polyvalent jazz/funk/rock.",xp:45},
  {id:"q-scales-15",courseId:"scales",lessonId:"scales-c5-02",lvl:3,q:"Quelle note de Ré dorien faut-il mettre en valeur pour 'affirmer' le mode ?",o:["Fa (tierce mineure)", "La (quinte juste)", "Ré (fondamentale)", "Si (sixte majeure)"],a:3,exp:"Ré dorien = Ré-Mi-Fa-Sol-La-Si-Do. Le Si (6 majeure) distingue dorien d'éolien. Mets-le en valeur (temps forts, notes longues) pour affirmer la couleur dorien.",xp:50},
  {id:"q-impro-07",courseId:"impro",lessonId:"scales-c5-02",lvl:3,q:"Sur la vamp Dm7 - G7, tu restes en Ré dorien. Quelle note mettre en avant sur G7 pour faire entendre le changement ?",o:["Si","Ré","La","Do"],a:0,exp:"Si est la sixte majeure de Ré dorien et la tierce de G7 : sur Dm7 il colore, sur G7 il définit l'accord. Ré (quinte de G7) et La (9e) ne marquent pas le passage, et Do, la quarte de G7, frotte contre son Si.",xp:65},
  {id:"q-fret-scales-04",type:"fretboard",courseId:"scales",lessonId: "scales-c5-02",lvl:2,q:"Trouve toutes les notes du dorien de Ré sur le manche",concept:{type:"find_scale",root:"D",quality:"dorian"},selectionRules:{mode:"all"},display:{showNotes:false},hint:"Dorien = mineur avec 6te majeure. Ré dorien = Ré Mi Fa Sol La Si Do.",xp:55,exp:"Ré dorien = notes de Do majeur depuis Ré. Le Si (6te M) est la note caractéristique."},
];
