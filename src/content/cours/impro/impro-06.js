// Leçon du module « impro » + les questions de quiz qui s'y rattachent.
// Format décrit dans src/content/README.md.

export default {
  id: "impro-06", level: 8,
  title: "Vocabulaire blues et jazz",
  duration: 18,
  gropiTip: "La note bleue Ré# se joue surtout en passage : glisse Ré→Ré#→Mi plutôt que de t'arrêter dessus. Elle sonne alors blues, et non fausse, sur la grille en La.",
  content: [
    { type: "p", text: "Le vocabulaire musical, c'est comme le vocabulaire d'une langue. Un bon improvisateur a un répertoire de licks, patterns et gestes musicaux qu'il déploie et adapte. Tu n'inventes pas — tu empruntes, transformes, combines." },
    { type: "h", text: "Les licks blues essentiels" },
    { type: "p", text: "Un lick blues efficace combine 3 éléments : (1) un bend sur une note, (2) une approche chromatique vers une chord tone, (3) un vibrato sur la note finale. La pentatonique mineure + la note bleue (♭5) + ces 3 techniques = une grande partie du vocabulaire blues." },
    { type: "fretboard_interactive", mode: "scale", root: "A", scale: "blues", caption: "Gamme blues de La — la ♭5 (Ré#) est ta note bleue caractéristique", displayMode: "notes", lang: "fr", compact: true },
    { type: "h", text: "La substitution de pentatonique" },
    { type: "p", text: "Technique avancée : joue la pentatonique majeure de la ♭III sur un accord mineur 7. Exemple : pentatonique majeure de Do sur Am7. Notes : Do-Ré-Mi-Sol-La = ♭3, 4, 5, ♭7, 1 de Am7. Son jazz sophistiqué. Utilisé par Miles Davis, Wes Montgomery, Pat Metheny." },
    { type: "fretboard_interactive", mode: "scale", root: "C", scale: "pentatonic_major", caption: "Pentatonique majeure de Do sur Am7 — substitution jazz élégante", displayMode: "notes", lang: "fr", compact: true },
    { type: "h", text: "La substitution tritonique" },
    { type: "p", text: "Sur G7 (V dans Do), tu peux substituer Db7. G7 et Db7 partagent les mêmes guide tones (Si/Do et Fa) — l'oreille accepte. Sur Dm7-G7-Cmaj7 : Dm7-Db7-Cmaj7. La basse descend chromatiquement Ré→Réb→Do. Mouvement luxueux du jazz moderne." },
    { type: "tip", text: "Apprends 1 lick par semaine dans toutes les tonalités (12 semaines = 12 licks). Au bout de 3 mois : 12 licks × 12 tonalités = vocabulaire suffisant pour improviser sur n'importe quel standard." },
  ],
  quiz: ["q-impro-30","q-impro-08","q-impro-11","q-impro-14","q-impro-15"],
};

export const quiz = [
  {id:"q-impro-30",courseId:"impro",lessonId:"impro-06",lvl:2,q:"Apprendre des licks par cœur, c'est…",o:["Inutile : l'improvisation doit rester spontanée","Se constituer un vocabulaire à réutiliser et transformer","Suffisant pour savoir improviser","Une étape réservée aux tout débutants"],a:1,exp:"Personne n'improvise sans vocabulaire, pas plus qu'on ne parle une langue sans mots. Le lick n'est pas là pour être replacé tel quel : il est là pour être découpé, transposé et recombiné.",xp:30},
];
