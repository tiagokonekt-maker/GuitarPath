// Leçon du module « scales » + les questions de quiz qui s'y rattachent.
// Format décrit dans src/content/README.md.

export default {
  id: "scales-c6-03", level: 9,
  title: "Comment choisir une gamme en improvisation",
  duration: 12,
  gropiTip: "Mini-routine : sur une vamp Am7, joue 2 tours en pentatonique mineure, 2 en éolien, puis 2 en dorien. Note la couleur que ton oreille préfère : c'est comme ça que l'instinct se construit.",
  content: [
    { type: "p", text: "Tu connais maintenant beaucoup de gammes. La question pratique : quelle gamme choisir face à une chanson, une grille d'accords, une situation d'improvisation ? C'est le sujet de cette leçon de synthèse, et c'est là que tu transformes la théorie en pratique.", img: "/mascotte-choix.webp", imgAlt: "Gropi qui réfléchit, boussole à la main", imgSide: "left" },
    { type: "h", text: "Étape 1 : identifier la tonalité" },
    { type: "p", text: "Avant tout, repère la tonalité de la chanson. Comment ? Regarde l'accord le plus présent et le dernier accord (généralement la tonalité). Si la chanson revient toujours sur Do et finit sur Do, elle est probablement en Do majeur. Si elle revient sur Am et finit sur Am, elle est en La mineur (éolien). Avec ça, tu as déjà ta 'gamme par défaut' : la majeure ou la mineure naturelle correspondante." },
    { type: "h", text: "Étape 2 : analyser le contexte" },
    { type: "p", text: "Ensuite, regarde le STYLE de la chanson : Pop/folk classique → ionien (majeur) ou éolien (mineur). Blues → pentatonique mineure ou gamme blues + mixolydien. Rock → mixolydien, pentatonique mineure. Jazz → modes selon les accords. Folk celtique / morceaux traditionnels → souvent dorien. Flamenco / musique espagnole → phrygien dominant. Cinéma 'magique' → lydien. Le style guide le choix." },
    { type: "h", text: "Étape 3 : repérer les vamps modales" },
    { type: "p", text: "Si la chanson tient un seul accord pendant longtemps (ex : 8 mesures de Dm7), c'est une 'vamp modale' — utilise le mode correspondant à cet accord. Vamp Dm7 = Ré dorien. Vamp Cmaj7 = Do ionien (mais possibilité de lydien). Vamp G7 = Sol mixolydien." },
    { type: "h", text: "Étape 4 : changer de gamme par accord (jazz)" },
    { type: "p", text: "Si les accords changent vite et que la chanson est jazz/sophistiquée, tu peux changer de gamme par accord. Sur Dm7 → Ré dorien. Sur G7 → Sol mixolydien. Sur Cmaj7 → Do ionien. Mais comme ces 3 modes ont les mêmes notes (Do majeur), tu peux aussi simplement jouer Do majeur tout du long en visant les notes-clés de chaque accord. Beaucoup plus simple." },
    { type: "h", text: "Le principe de cohérence" },
    { type: "p", text: "Une règle qui simplifie tout : tant que les accords appartiennent à une seule tonalité (ex : tous les accords sont diatoniques de Do majeur), tu peux improviser dans la gamme parente (Do majeur) et toutes tes notes sonneront 'justes'. Tu n'as pas besoin de changer de gamme à chaque accord. Cette règle marche très souvent en pop, en folk et en rock simple." },
    { type: "h", text: "Cas particuliers" },
    { type: "p", text: "Sur un V7 résolvant en mineur (E7 → Am) : utilise la mineure harmonique du I (La harmonique sur E7). Sur un blues majeur : utilise le mixolydien sur tout, ou la pentatonique mineure pour le côté blues, ou un mix des deux. Sur une vamp m7b5-V7-Im : utilise le locrien sur le ii, mineure harmonique sur le V, mineure naturelle sur le I." },
    { type: "h", text: "Le conseil pratique : commence simple" },
    { type: "p", text: "Si tu hésites toujours, voici la règle de survie : pentatonique mineure de la fondamentale de la chanson. Sur une chanson en La mineur → La pentatonique mineure. Sur une chanson en Do majeur → La pentatonique mineure (pentatonique relative). Sur un blues → pentatonique mineure de la tonique. Cette 'gamme universelle' marchera dans la plupart des cas. Tu pourras affiner avec l'expérience." },
    { type: "ref", text: "Test pratique : prends 3 chansons de styles différents (une pop type Beatles, un blues, un standard de jazz). Identifie leur tonalité, leur style, et choisis la gamme la plus appropriée pour improviser. Avec 10 chansons analysées comme ça, tu vas développer un instinct musical solide." },
    { type: "tip", text: "L'improvisation, c'est un peu de théorie et beaucoup d'oreille. La théorie te donne les options, mais c'est ton oreille qui choisit la bonne au moment juste. Plus tu joues, plus tu écoutes, plus ton instinct devient précis. Le but n'est pas de calculer, c'est d'entendre — et de réagir." },
  ],
  quiz: ["q-scales-46", "q-scales-47", "q-scales-48", "q-scales-17", "q-scales-18"],
};

export const quiz = [
  {id:"q-scales-46",courseId:"scales",lessonId:"scales-c6-03",lvl:1,q:"Une chanson tient Dm7 pendant 8 mesures. Quel mode privilégier ?",o:["Ré dorien","Ré éolien","Ré phrygien","Ré mixolydien"],a:0,exp:"Une vamp sur un accord m7 appelle le dorien, avec sa sixte majeure : vamp Dm7 = Ré dorien.",xp:30},
  {id:"q-scales-47",courseId:"scales",lessonId:"scales-c6-03",lvl:2,q:"Sur Dm7 - G7 - Cmaj7 (tous diatoniques de Do), quelle gamme suffit ?",o:["Une gamme différente par accord, obligatoirement","Do majeur sur toute la grille","La pentatonique de Ré seulement","La gamme blues de Sol"],a:1,exp:"Tant que tous les accords appartiennent à une seule tonalité, la gamme parente (Do majeur) fonctionne sur toute la grille.",xp:40},
  {id:"q-scales-48",courseId:"scales",lessonId:"scales-c6-03",lvl:2,q:"Sur E7 qui résout vers Am, quelle gamme utiliser ?",o:["Mi mixolydien","La pentatonique majeure","La mineure harmonique","Mi majeur"],a:2,exp:"Sur un V7 qui résout en mineur, on prend la mineure harmonique du I : La harmonique, avec son Sol# (la tierce de E7).",xp:40},
];
