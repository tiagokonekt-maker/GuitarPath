// Leçon du module « harmony » + les questions de quiz qui s'y rattachent.
// Format décrit dans src/content/README.md.

export default {
  id: "harmony-03", level: 7,
  title: "Arpèges — l'accord en mélodie",
  duration: 12,
  content: [
    { type: "p", text: "Un arpège = les notes d'un accord jouées une par une, en succession mélodique. C'est le pont entre harmonie (vertical) et mélodie (horizontal). En impro, les arpèges te font 'sonner sur l'accord' à coup sûr." },
    { type: "h", text: "Pourquoi les arpèges sont essentiels" },
    { type: "p", text: "Un solo basé uniquement sur la gamme peut 'flotter' au-dessus des accords sans s'y connecter. Un solo qui contient des fragments d'arpèges 'tombe' sur les accords aux moments-clés (temps forts, fins de phrases). C'est la différence entre un solo générique et un solo qui suit l'harmonie." },
    { type: "h", text: "Arpèges des 4 types de triades" },
    { type: "p", text: "Majeur : 1-3-5 (Do-Mi-Sol). Mineur : 1-♭3-5 (Do-Mib-Sol). Diminué : 1-♭3-♭5 (Do-Mib-Solb). Augmenté : 1-3-#5 (Do-Mi-Sol#). 3 notes par triade, simple mais essentiel." },
    { type: "h", text: "Arpèges des accords de 7e" },
    { type: "p", text: "Maj7 : 1-3-5-7. m7 : 1-♭3-5-♭7. 7 : 1-3-5-♭7. m7b5 : 1-♭3-♭5-♭7. dim7 : 1-♭3-♭5-bb7. 4 notes, qui définissent intégralement l'accord. Apprendre ces 5 arpèges = avoir les 5 types d'accords sous les doigts en mélodie." },
    { type: "h", text: "Patterns d'arpèges sur le manche" },
    { type: "p", text: "Pour Cmaj7 forme E (case 8) : Do(corde 6 case 8), Mi(corde 5 case 7), Sol(corde 5 case 10), Si(corde 4 case 9), Do(corde 3 case 5)... non, plutôt Do(corde 1 case 8), Mi(corde 1 case 12). Apprends chaque arpège dans 2-3 positions le long du manche." },
    { type: "h", text: "Connecter arpèges et gamme" },
    { type: "p", text: "Pendant un solo : commence ta phrase par 2-3 notes d'arpège (les notes de l'accord), puis enrichis avec les notes de la gamme entre les notes d'arpège. Tu obtiens un solo qui suit l'harmonie et reste mélodique." },
    { type: "h", text: "Changer d'arpège sur changement d'accord" },
    { type: "p", text: "Sur Dm7-G7-Cmaj7 : 1ère mesure → notes de Dm7 (Ré-Fa-La-Do). 2e mesure → notes de G7 (Sol-Si-Ré-Fa). 3e mesure → notes de Cmaj7 (Do-Mi-Sol-Si). Tes phrases bougent avec l'harmonie. C'est ce qui sonne 'jazz'." },
    { type: "tip", text: "Drill 'arpège-gamme-arpège' : 1 mesure d'arpège, 1 mesure de gamme, 1 mesure d'arpège. Boucle sur Am7. Tu apprends à alterner les deux mondes." },
    { type: "fretboard_interactive", mode: "chord", root: "C", chord: "maj7", caption: "Arpège Cmaj7 — Do Mi Sol Si sur tout le manche", displayMode: "notes", lang: "fr", compact: true },
    { type: "fretboard_interactive", mode: "chord", root: "D", chord: "min7", caption: "Arpège Dm7 — Ré Fa La Do sur tout le manche", displayMode: "notes", lang: "fr", compact: true },
  ],
  quiz: ["q-harm-09","q-harm-10","q-harm-11","q-fret-harm-06"],
};

export const quiz = [
  {id:"q-harm-09",courseId:"harmony",lessonId:"harmony-03",lvl:2,q:"L'arpège d'un accord Cmaj7 contient quelles notes ?",o:["Do-Mi-Sol-Si","Do-Mi-Sol","Do-Mi-Sol-Sib","Do-Mib-Sol-Si"],a:0,exp:"Cmaj7 = Do(1)-Mi(3)-Sol(5)-Si(7). L'arpège = ces 4 notes jouées en mélodie. Tu peux les jouer dans n'importe quel ordre, sur plusieurs octaves.",xp:35},
  {id:"q-harm-10",courseId:"harmony",lessonId:"harmony-03",lvl:3,q:"Pourquoi les arpèges sont-ils essentiels en improvisation jazz ?",o:["Pour montrer sa technique au public", "Pour sonner « sur l'accord » à coup sûr", "Pour pouvoir jouer plus vite qu'avec une gamme", "Pour transposer plus facilement"],a:1,exp:"Les notes d'un arpège = les notes de l'accord = celles qui sonnent immédiatement 'juste' sur cet accord. Construire ses phrases autour des arpèges = solo qui suit l'harmonie.",xp:45},
  {id:"q-harm-11",courseId:"harmony",lessonId:"harmony-03",lvl:3,q:"Sur la progression Dm7-G7-Cmaj7, quelle stratégie d'arpèges fonctionne ?",o:["Arpège Dm7 sur les trois accords", "Pentatonique de Do sur toute la grille", "Arpège Dm7, puis G7, puis Cmaj7", "Arpège Cmaj7 sur les trois accords"],a:2,exp:"Changer d'arpège à chaque accord = solo qui suit l'harmonie. C'est la base du jazz. Sur Dm7 : Ré-Fa-La-Do. Sur G7 : Sol-Si-Ré-Fa. Sur Cmaj7 : Do-Mi-Sol-Si.",xp:55},
  {id:"q-fret-harm-06",type:"fretboard",courseId:"harmony",lessonId:"harmony-03",lvl:3,q:"Trouve toutes les notes de l'arpège Dm7 (Ré Fa La Do)",concept:{type:"find_chord",root:"D",quality:"min7"},selectionRules:{mode:"all"},display:{showNotes:false},hint:"Dm7 = ii de Do majeur. Guide tones : Fa (3e) + Do (7e).",xp:55,exp:"Dm7 : Ré-Fa-La-Do. C'est le ii du ii-V-I en Do."},
];
