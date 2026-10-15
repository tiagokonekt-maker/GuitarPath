// Leçon du module « neck » + les questions de quiz qui s'y rattachent.
// Format décrit dans src/content/README.md.

export default {
  id: "neck-06", level: 9,
  title: "Connexions accords-gammes-arpèges",
  duration: 14,
  gropiTip: "Teste les guide tones sur Rém7 → Sol7 : la 7e de Rém7 (Do) descend d'un demi-ton vers Si, tierce de Sol7, et le Fa reste en place. Deux notes suffisent pour entendre l'enchaînement.",
  content: [
    { type: "p", text: "Voir uniquement la gamme isolée, c'est jouer 'à côté' de l'harmonie. Voir l'accord, sa gamme et son arpège ensemble, c'est jouer 'dans' l'harmonie. C'est la différence entre un guitariste correct et un musicien." },
    { type: "h", text: "Le triangle accord-arpège-gamme" },
    { type: "p", text: "L'accord (4 notes), l'arpège (les mêmes 4 notes jouées en mélodie) et la gamme (les 3 notes 'de remplissage' qui complètent les 7 de la tonalité). Sur le manche, ces 3 entités occupent toujours la même région." },
    { type: "h", text: "Exemple : Cmaj7 dans la zone case 8" },
    { type: "p", text: "Accord Cmaj7 forme E barré case 8 : Do(corde 6 case 8), Sol(corde 5 case 10), Si(corde 4 case 9), Mi(corde 3 case 9), Sol(corde 2 case 8), Do(corde 1 case 8). Arpège Cmaj7 dans cette zone : mêmes notes en mélodie. Gamme de Do majeur en position correspondante : ajoute Ré, Fa, La aux notes de l'arpège. Tout cohabite." },
    {
      type: "fretboard",
      caption: "Cmaj7 zone case 8 — notes d'accord (violet) + gamme de Do majeur (vert)",
      data: {
        frets: 6, startFret: 7,
        showStringNames: true, showFretNumbers: true,
        markerFrets: [9, 12],
        notes: [
          { string: 6, fret: 8,  label: "Do",  color: "primary", root: true  },
          { string: 6, fret: 10, label: "Ré",  color: "green"  },
          { string: 5, fret: 10, label: "Sol",  color: "primary" },
          { string: 4, fret: 9, label: "Si",   color: "green"   },
          { string: 4, fret: 9,  label: "Si",  color: "primary" },
          { string: 4, fret: 10, label: "Do",  color: "primary", root: true  },
          { string: 3, fret: 9,  label: "Mi",  color: "primary" },
          { string: 3, fret: 10, label: "Fa",  color: "green"  },
          { string: 2, fret: 8,  label: "Sol",  color: "primary" },
          { string: 2, fret: 10, label: "La",  color: "green"  },
          { string: 1, fret: 8,  label: "Do",  color: "primary", root: true  },
          { string: 1, fret: 10, label: "Ré",  color: "green"  },
        ],
      },
    },
    { type: "h", text: "Cibler les notes d'accord en improvisation" },
    { type: "p", text: "Quand tu improvises, tes phrases qui tombent sur les notes de l'accord courant (1, 3, 5, 7) sonnent 'résolues'. Celles qui tombent sur les autres notes de la gamme (2, 4, 6) sonnent 'en mouvement'. Alterner les deux crée tension/résolution." },
    { type: "h", text: "Le 'guide-tone' approach" },
    { type: "p", text: "Sur une progression d'accords, suis uniquement les 3e et 7e des accords (les 'guide tones'). Ces 2 notes définissent la qualité (Maj/min, dominante/Maj7) et créent une ligne mélodique chromatique élégante. C'est la base du jazz." },
    { type: "h", text: "Méthode pratique pour lier" },
    { type: "p", text: "Quand tu joues un accord, identifie immédiatement après : (1) sa fondamentale, (2) sa tierce, (3) sa quinte, (4) sa septième sur le manche. Joue-les en arpège lent. Puis improvise dans cette zone en visant ces 4 notes." },
    { type: "tip", text: "Drill : 1 accord = 1 minute. Plaque l'accord, identifie ses 4 notes sur le manche, arpèges-les, improvise 1 min en les ciblant. Refais sur 5 accords différents." },
    { type: "fretboard_interactive", mode: "scale", root: "G", scale: "major", caption: "Sol majeur — gamme, accord et arpège dans la même zone", displayMode: "degrees", lang: "fr", compact: true },
  ],
  quiz: ["q-neck-18", "q-neck-19", "q-neck-20"],
};

export const quiz = [
  {id:"q-neck-18",courseId:"neck",lessonId:"neck-06",lvl:2,q:"En improvisation, les notes 'cibles' à viser sur un accord sont prioritairement…",o:["La 3e et la 7e","La fondamentale et la quinte","Toutes les notes de la gamme","Les notes en dehors de l'accord"],a:0,exp:"3e et 7e = 'guide tones' qui définissent la qualité de l'accord (Maj/min, dominante). Les viser = sonner immédiatement 'sur l'accord'.",xp:40},
  {id:"q-neck-19",courseId:"neck",lessonId:"neck-06",lvl:3,q:"Sur Cmaj7, quelle note évite-t-on en général de tenir longtemps ?",o:["Do","Fa","Mi","Sol"],a:1,exp:"Sur Cmaj7 (Do-Mi-Sol-Si), le Fa (4e) est 'note évitée' classique. Elle crée un demi-ton avec la 3e (Mi) et sonne dissonante tenue. À utiliser en passage uniquement.",xp:55},
  {id:"q-neck-20",courseId:"neck",lessonId:"neck-06",lvl:3,q:"Sur G7, quelles notes sont les guide tones ?",o:["Sol et Ré","Sol et Si","Si et Fa","Ré et Fa"],a:2,exp:"G7 = Sol-Si-Ré-Fa. Guide tones = 3e (Si) + 7e (Fa). Ces 2 notes définissent que c'est G7 (et pas Gm7 ou Gmaj7).",xp:50},
];
