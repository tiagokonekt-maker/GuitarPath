// Leçon du module « scales » + les questions de quiz qui s'y rattachent.
// Format décrit dans src/content/README.md.

export default {
  id: "scales-c5-07", level: 8,
  title: "Locrien — le mode interdit",
  duration: 9,
  gropiTip: "Pour l'entendre sans te perdre : joue l'accord Bm7♭5 (Si-Ré-Fa-La), puis promène-toi dans les notes de Do majeur en partant de Si. Tu sentiras vite que le Fa empêche de se poser.",
  content: [
    { type: "p", text: "Voici le 7e mode, et le plus mystérieux : le locrien. C'est le seul mode dont la fondamentale est diminuée (la quinte est diminuée). Conséquence : il sonne extrêmement instable. Pendant des siècles, il a été considéré comme 'inutilisable'. Aujourd'hui, il existe — mais reste rarement employé. À connaître par culture, à utiliser avec parcimonie.", img: "/mascotte-mystere.webp", imgAlt: "Gropi qui jette un œil, curieux et espiègle", imgSide: "right" },
    { type: "h", text: "Construction" },
    { type: "p", text: "Le locrien est le 7e mode de la gamme majeure. Si tu joues Do majeur en commençant sur Si, tu obtiens Si locrien : Si-Do-Ré-Mi-Fa-Sol-La. Mêmes notes que Do majeur, fondamentale = Si." },
    { type: "h", text: "Formule" },
    { type: "p", text: "1 - ♭2 - ♭3 - 4 - ♭5 - ♭6 - ♭7. C'est le mode le plus 'sombre' avec ses 5 altérations (♭2, ♭3, ♭5, ♭6, ♭7). Et surtout, sa quinte est diminuée — ce qui le rend instable." },
    { type: "scale_pattern", caption: "Si locrien — note clé : Fa, la quinte diminuée (case 8 c5, case 10 c3)", data: {startFret: 7, endFret: 10, rootColor: "amber", noteColor: "primary", accentColor: "coral", accentLabel: "Fa, quinte diminuée", strings: [{frets: [7,8,10], root: [7]}, {frets: [7,8,10], root: [], accent: [8]}, {frets: [7,9,10], root: [9]}, {frets: [7,9,10], root: [], accent: [10]}, {frets: [8,10], root: []}, {frets: [7,8,10], root: [7]}], noteMap: {"7,0":"Si", "8,0":"Do", "10,0":"Ré", "7,1":"Mi", "8,1":"Fa", "10,1":"Sol", "7,2":"La", "9,2":"Si", "10,2":"Do", "7,3":"Ré", "9,3":"Mi", "10,3":"Fa", "8,4":"Sol", "10,4":"La", "7,5":"Si", "8,5":"Do", "10,5":"Ré"}} },
    { type: "h", text: "La note caractéristique (et le problème) : la ♭5" },
    { type: "p", text: "La ♭5 (en Si locrien, c'est Fa) crée une tension extrême avec la fondamentale. Pire : la quinte juste, qui dans tous les autres modes ancre la fondamentale comme 'point stable', est ici absente. Résultat : ton oreille ne sait plus où se reposer. Le locrien sonne perpétuellement instable, comme un accord qui ne résout jamais." },
    { type: "h", text: "Couleur sonore" },
    { type: "p", text: "Instable, anxiogène, dissonant, intriguant. Pas vraiment 'beau' au sens classique — plutôt 'inconfortable'. C'est précisément cette inconfort qui le rend utile dans certains contextes : musique de tension, jazz avancé, métal extrême." },
    { type: "h", text: "Sur quels accords l'utiliser" },
    { type: "p", text: "Sur des accords m7b5 (demi-diminués) en jazz. Ex : Bm7b5 = Si locrien. Très utilisé sur le ii d'un ii-V-i mineur (en La mineur : Bm7b5-E7-Am7). En métal extrême et certaines musiques de film d'horreur, on l'utilise pour créer une atmosphère angoissante." },
    { type: "chord_diagram", caption: "Bm7b5 (x2323x) — l'accord demi-diminué, terrain naturel du Si locrien", data: {name: "Bm7b5", frets: [-1,2,3,2,3,-1], fingers: [0,1,3,2,4,0], startFret: 1} },
    { type: "h", text: "Pourquoi le locrien était 'interdit'" },
    { type: "p", text: "Le triton (intervalle ♭5) a longtemps été évité dans la musique savante, au point d'être surnommé 'diabolus in musica' (le diable en musique). Le locrien, dont la quinte est précisément un triton, est donc resté pratiquement inutilisé. Cette réputation a perduré jusqu'au XXe siècle. Ce n'est qu'avec le jazz moderne et le métal que le locrien a trouvé sa place." },
    { type: "ref", text: "Exemples (rares) : 'Army of Me' (Björk) utilise des couleurs locriennes. Certains passages de 'YYZ' (Rush) jouent avec le locrien. Black Sabbath et Slayer ont des riffs locriens dans leurs morceaux les plus sombres. Mais honnêtement, peu de morceaux sont 'entièrement' en locrien — il est souvent utilisé en passage." },
    { type: "tip", text: "Le locrien n'est pas une priorité pour ton apprentissage. Connais son existence, comprends pourquoi il est rare, et passe à autre chose. À ce stade, te concentrer sur le dorien, mixolydien et lydien sera infiniment plus rentable musicalement." },
  ],
  quiz: ["q-scales-43", "q-scales-44", "q-scales-45", "q-scales-04", "q-scales-08"],
};

export const quiz = [
  {id:"q-scales-43",courseId:"scales",lessonId:"scales-c5-07",lvl:1,q:"Quelle est la particularité du locrien ?",o:["Sa tierce est majeure","Il n'a que 5 notes","Sa quinte est diminuée","Sa septième est majeure"],a:2,exp:"C'est le seul mode dont la quinte est diminuée (♭5) : sans quinte juste, l'oreille ne trouve pas où se poser.",xp:30},
  {id:"q-scales-44",courseId:"scales",lessonId:"scales-c5-07",lvl:2,q:"Sur quel accord le locrien s'utilise-t-il surtout ?",o:["Un accord maj7 de tonique","Un accord de dominante 7","Un accord mineur 7 de repos","Un accord m7♭5"],a:3,exp:"Sur le demi-diminué (m7♭5), par exemple le ii d'un ii-V-i mineur : Bm7♭5 - E7 - Am7.",xp:40},
  {id:"q-scales-45",courseId:"scales",lessonId:"scales-c5-07",lvl:1,q:"Si locrien a les mêmes notes que quelle gamme ?",o:["Do majeur","Si mineur","Sol majeur","Fa majeur"],a:0,exp:"Le locrien est le 7e mode de la gamme majeure : Si locrien = Do majeur, joué depuis Si.",xp:30},
];
