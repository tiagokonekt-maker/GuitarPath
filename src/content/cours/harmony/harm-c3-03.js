// Leçon du module « harmony » + les questions de quiz qui s'y rattachent.
// Format décrit dans src/content/README.md.

export default {
  id: "harm-c3-03", level: 7,
  title: "Les guide tones : 3e et 7e",
  duration: 10,
  content: [
    { type: "p", text: "Dans un accord de septième, toutes les notes ne jouent pas le même rôle. La fondamentale et la quinte sont 'génériques' — elles définissent la hauteur et l'ancrage. Mais la 3e et la 7e sont les notes qui définissent la QUALITÉ de l'accord (majeur, mineur, dominante, etc.). On les appelle les 'guide tones', et ce sont elles que tu cibles en improvisation pour 'sonner sur l'accord'." },
    { type: "h", text: "Pourquoi la 3e et la 7e ?" },
    { type: "p", text: "Parce qu'elles portent le maximum d'information harmonique avec le minimum de notes. Joue uniquement Do et Sol (fondamentale + quinte) : tu ne sais pas si c'est Do majeur, Do mineur, Do7, ou Do diminué. Ajoute Mi (3e) : maintenant tu sais que c'est un accord de Do majeur (Mi = tierce majeure). Ajoute Si (7e) : tu sais que c'est Cmaj7. Les guide tones 'racontent' l'accord." },
    { type: "h", text: "Les guide tones des 5 types d'accords de 7e" },
    { type: "p", text: "Cmaj7 : guide tones = Mi (3e maj) + Si (7e maj). Cm7 : Do-guide tones = Mib (3e min) + Sib (7e min). C7 : guide tones = Mi (3e maj) + Sib (7e min). Cm7b5 : guide tones = Mib (3e min) + Sib (7e min) — même que Cm7, mais la quinte diminuée change la couleur. Cdim7 : guide tones = Mib (3e min) + Si𝄫 (7e dim, enharmonique de La)." },
    { type: "h", text: "Les guide tones en improvisation" },
    { type: "p", text: "Voici le secret du jazz : quand tu improvises sur une progression d'accords, si tu fais tomber tes phrases sur les guide tones aux moments importants (temps forts, fins de phrases), tu sonnes 'sur l'accord' immédiatement. Même si le reste de ta phrase est 'neutre', les guide tones ancrent l'oreille de l'auditeur sur l'harmonie." },
    {
      type: "fretboard",
      caption: "Guide tones G7 — Si (3e, vert) et Fa (7e, violet) : les 2 notes qui définissent l'accord",
      data: {
        frets: 6, startFret: 3,
        showStringNames: true, showFretNumbers: true,
        markerFrets: [5, 7],
        notes: [
          { string: 6, fret: 5,  label: "La",  color: "neutral" },
          { string: 5, fret: 5,  label: "Ré",  color: "neutral" },
          { string: 4, fret: 9,  label: "Si",  color: "neutral" },
          { string: 3, fret: 4,  label: "Si",  color: "green",  root: false },
          { string: 2, fret: 6,  label: "Fa",  color: "primary",root: false },
          { string: 1, fret: 5,  label: "La",  color: "neutral" },
          { string: 6, fret: 7,  label: "Si",  color: "primary",root: false },
          { string: 5, fret: 8,  label: "Fa",  color: "green",  root: false },
        ],
      },
    },
    { type: "h", text: "Le mouvement chromatique des guide tones" },
    { type: "p", text: "Dans une progression Dm7-G7-Cmaj7 (ii-V-I), les guide tones se déplacent par demi-tons d'un accord à l'autre. 7e de Dm7 = Do → 3e de G7 = Si (descend d'un demi-ton). 3e de Dm7 = Fa → 7e de G7 = Fa (reste !). 3e de G7 = Si → 7e de Cmaj7 = Si (reste !). 7e de G7 = Fa → 3e de Cmaj7 = Mi (descend d'un demi-ton). Ce mouvement minimal est le 'fil rouge' qui relie les accords entre eux." },
    { type: "h", text: "Voicings 'shell' : jouer économe" },
    { type: "p", text: "En jazz, on joue souvent des 'shell voicings' : fondamentale + 3e + 7e (sans quinte). 3 notes seulement, mais elles définissent parfaitement l'accord. Avantage : moins de doigts, son plus 'ouvert', laisse de la place pour d'autres musiciens (basse, piano). G7 shell : Sol (corde 6 case 3) + Si (corde 5 case 2) + Fa (corde 4 case 3). 3 notes, son immédiatement reconnaissable." },
    { type: "ref", text: "Les pianistes de jazz (Bill Evans, Herbie Hancock, Keith Jarrett) jouent presque exclusivement des shell voicings main gauche + lignes mélodiques main droite. Cette économie de notes, loin d'appauvrir le son, le rend plus clair et plus musical. Sur la guitare, c'est le même principe." },
    { type: "tip", text: "Drill guide tones : sur la progression Dm7-G7-Cmaj7, joue uniquement les guide tones de chaque accord (3e et 7e). Dm7 : Fa-Do. G7 : Si-Fa. Cmaj7 : Mi-Si. Joue-les lentement, 1 accord par mesure. Tu entendras la 'ligne intérieure' de l'harmonie — c'est ce que les pros entendent en permanence." },
  ],
  quiz: ["q-harm-07","q-fret-harm-08","q-fret-harm-09","q-harm-03","q-harm-06"],
};

export const quiz = [
  {id:"q-harm-07",courseId:"harmony",lessonId:"harm-c3-03",lvl:3,q:"Sur un accord Cmaj7, les 'guide tones' sont…",o:["Do et Sol","Do et Si","Mi et Si","Mi et Sol"],a:2,exp:"Guide tones = 3e + 7e. Sur Cmaj7 : 3e = Mi, 7e = Si. Ces 2 notes définissent que c'est un Maj7 (et pas un m7 ou un 7 dominante).",xp:50},
  {id:"q-fret-harm-08",type:"fretboard",courseId:"harmony",lessonId:"harm-c3-03",lvl:3,q:"Sur G7 : trouve toutes les notes Si (3e — guide tone principal)",concept:{type:"find_note",root:"B"},selectionRules:{mode:"all"},display:{showNotes:false},hint:"Si est à vide sur la corde 2. C'est ta note cible d'arrivée sur G7.",xp:60,exp:"Si en : corde 6 case 7, corde 5 case 2, corde 4 case 9, corde 3 case 4, corde 2 à vide, corde 1 case 7. Cibles d'arrivée sur G7."},
  {id:"q-fret-harm-09",type:"fretboard",courseId:"harmony",lessonId:"harm-c3-03",lvl:3,q:"Sur G7 : trouve toutes les notes Fa (7e — tension à résoudre)",concept:{type:"find_note",root:"F"},selectionRules:{mode:"all"},display:{showNotes:false},hint:"Fa est case 1 corde 1. La 7e de G7 veut se résoudre vers Mi (Cmaj7).",xp:60,exp:"Fa en : corde 6 case 1, corde 5 case 8, corde 4 case 3, corde 3 case 10, corde 2 case 6, corde 1 case 1. La résolution Fa→Mi est le mouvement fondamental du ii-V-I."},
];
