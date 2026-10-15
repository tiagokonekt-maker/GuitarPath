// Leçon du module « impro » + les questions de quiz qui s'y rattachent.
// Format décrit dans src/content/README.md.

export default {
  id: "impro-04", level: 9,
  title: "Jouer sur les changements d'accords",
  duration: 18,
  gropiTip: "Fredonne l'autre ligne de guide tones du ii-V-I : Fa sur Dm7, Fa sur G7, Mi sur Cmaj7. Une seule note qui descend d'un demi-ton : si tu l'entends, tu entends le changement.",
  content: [
    { type: "p", text: "La vraie improvisation commence quand tu joues SUR les accords. La différence : le guitariste amateur joue La pentatonique sur tout un blues. Le pro entend chaque accord changer et adapte ses cibles — même s'il reste dans la même gamme, ses phrases reflètent les changements harmoniques." },
    { type: "h", text: "Le ii-V-I : la progression universelle" },
    { type: "p", text: "Dm7-G7-Cmaj7 (ii-V-I en Do) est la progression la plus importante du jazz, du pop et du funk. Elle crée un mouvement de tension (ii) → tension maximale (V) → résolution (I). Ton boulot : refléter ce voyage harmonique dans tes phrases." },
    { type: "fretboard_interactive", mode: "quiz", quizTarget: "F", caption: "Quiz : trouve tous les Fa — guide tone pivot du ii-V-I", lang: "fr", compact: true },
    { type: "fretboard_interactive", mode: "chord", root: "D", chord: "min7", caption: "ii — Dm7 : Ré Fa La Do (tension douce)", displayMode: "notes", lang: "fr", compact: true },
    { type: "fretboard_interactive", mode: "chord", root: "G", chord: "dom7", caption: "V — G7 : Sol Si Ré Fa (tension maximale)", displayMode: "notes", lang: "fr", compact: true },
    { type: "fretboard_interactive", mode: "chord", root: "C", chord: "maj7", caption: "I — Cmaj7 : Do Mi Sol Si (résolution)", displayMode: "notes", lang: "fr", compact: true },
    { type: "h", text: "Le mouvement des guide tones" },
    { type: "p", text: "Sur Dm7→G7→Cmaj7 : Fa (3 de Dm7) reste sur G7 (devient ♭7), puis descend vers Mi (3 de Cmaj7). Do (♭7 de Dm7) descend vers Si (3 de G7), reste Si (♭7 de Cmaj7). Ces mouvements chromatiques sont le moteur de la progression. Les entendre et les cibler = jouer le changement." },
    { type: "tip", text: "Exercice : sur ii-V-I en Do (60 BPM), joue une seule note par accord : Fa sur Dm7, Si sur G7, Mi sur Cmaj7. Tu viens de 'jouer le changement' avec 3 notes. Construis des phrases autour de ces cibles." },
  ],
  quiz: ["q-impro-31","q-impro-02","q-impro-03","q-impro-07"],
};

export const quiz = [
  {id:"q-impro-31",courseId:"impro",lessonId:"impro-04",lvl:3,q:"Sur une grille où les accords changent toutes les deux mesures, quelle approche donne le plus de relief ?",o:["Rester sur la même gamme sans rien ajuster", "Accélérer le débit à chaque changement", "Viser une note de l'accord au changement", "S'arrêter de jouer à chaque changement"],a:2,exp:"Ce qui rend un solo « dedans », c'est de tomber sur une note de l'accord au moment précis où il arrive. Une seule note bien placée au changement s'entend davantage que quinze notes entre deux changements.",xp:40},
];
