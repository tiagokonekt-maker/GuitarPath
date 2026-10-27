// Leçon du module « impro » + les questions de quiz qui s'y rattachent.
// Format « leçon en cartes » décrit dans src/content/README.md.
// Vocabulaire, 1 sur 2 : les licks blues. Suite : impro-06b (couleurs jazz).

const LICK_BLUES = {
  type: "tab",
  caption: "Un lick blues en La : bend, approche chromatique, vibrato",
  text: "Tab — Ré (corde 3 case 7) tiré d'un ton jusqu'à Mi ; Sol (corde 2 case 8), Mi (corde 2 case 5) ; puis Ré (corde 5 case 5), Ré# (corde 5 case 6), Mi (corde 5 case 7) qui montent vers La (corde 4 case 7), tenu avec vibrato.",
  data: { lines: [
    "e|----------------|----------------|",
    "B|------8-5-------|----------------|",
    "G|7b9-------------|----------------|",
    "D|----------------|----7~~~--------|",
    "A|--------------5-|6-7-------------|",
    "E|----------------|----------------|",
  ] },
};

export default {
  id: "impro-06", level: 8,
  title: "Vocabulaire blues : les licks",
  duration: 8,
  gropiTip: "La note bleue Ré# se joue surtout en passage : glisse Ré→Ré#→Mi plutôt que de t'arrêter dessus. Elle sonne alors blues, et non fausse, sur la grille en La.",
  cartes: [
    { type: "idee", titre: "Un vocabulaire", texte: [
      "Improviser, c'est parler avec des mots déjà appris. Un lick est un mot : on l'emprunte, on le transforme, on le combine avec d'autres.",
    ] },
    { type: "question", quizId: "q-impro-30" },
    { type: "idee", titre: "Trois gestes blues", texte: [
      "Un bend qui monte vers une note de la gamme. Une approche chromatique vers une note de l'accord. Un vibrato sur la note finale.",
      "Avec la pentatonique mineure, ces trois gestes font déjà un langage.",
    ] },
    { type: "idee", titre: "La note bleue", texte: [
      "Ajoute Ré#, la ♭5, à La pentatonique mineure : c'est la gamme blues.",
      "Ré# se traverse : Ré, Ré#, Mi. Tenu, il frotte ; en passage, il sonne blues.",
    ], bloc: { type: "fretboard_interactive", mode: "scale", root: "A", scale: "blues", caption: "Gamme blues de La — la ♭5 (Ré#) est ta note bleue caractéristique", displayMode: "notes", lang: "fr", compact: true } },
    { type: "question", quizId: "q-impro-blues-lot4" },
    { type: "a-toi", titre: "Un lick, trois gestes",
      consigne: "Lance la Jam en Blues 12 mesures, tonalité La (ou un La7 en boucle). Joue le lick : bend de Ré à Mi, Sol, Mi, puis Ré, Ré#, Mi qui montent vers La, avec vibrato. Puis transforme-le : un autre rythme, une note de moins, une autre fin.",
      bloc: LICK_BLUES, bpm: 70, minuteur: 180 },
    { type: "idee", titre: "Un lick, partout", texte: [
      "Apprendre un lick, c'est savoir le jouer ailleurs : dans une autre tonalité, sur un autre rythme, avec une autre fin.",
      "Le même lick en Ré : tout se joue cinq cases plus haut, à partir de la case 10.",
    ] },
    { type: "question", quizId: "q-impro-transpo-lot4" },
    { type: "recap", points: [
      "Un lick est un mot : on l'apprend pour le transformer.",
      "Bend, approche chromatique, vibrato : trois gestes du blues.",
      "La note bleue (Ré# en La) se traverse, elle ne se tient pas.",
    ] },
  ],
  quiz: ["q-impro-30","q-impro-blues-lot4","q-impro-transpo-lot4","q-impro-14"],
};

export const quiz = [
  {id:"q-impro-30",courseId:"impro",lessonId:"impro-06",lvl:2,q:"Apprendre des licks par cœur, c'est…",o:["Inutile : l'improvisation doit rester spontanée","Se constituer un vocabulaire à réutiliser et transformer","Suffisant pour savoir improviser","Une étape réservée aux tout débutants"],a:1,exp:"Personne n'improvise sans vocabulaire, pas plus qu'on ne parle une langue sans mots. Le lick n'est pas là pour être replacé tel quel : il est là pour être découpé, transposé et recombiné.",xp:30},
  {id:"q-impro-blues-lot4",courseId:"impro",lessonId:"impro-06",lvl:2,q:"Dans un lick en La, comment placer Ré#, la note bleue ?",o:["En passage, entre Ré et Mi","Tenu, sur le temps 1","En note finale de la phrase","Répété sur chaque temps"],a:0,exp:"La ♭5 est une note de couleur fugace : glissée entre Ré et Mi, elle sonne blues. Tenue sur un temps fort ou en fin de phrase, elle frotte contre l'accord et sonne fausse.",xp:30},
  {id:"q-impro-transpo-lot4",courseId:"impro",lessonId:"impro-06",lvl:2,q:"Ton lick en La se joue autour de la case 5. Pour le jouer en Ré, tu le déplaces…",o:["De cinq cases vers l'aigu","De deux cases vers l'aigu","D'une corde vers l'aigu","De cinq cases vers le grave"],a:0,exp:"De La à Ré, il y a cinq demi-tons en montant : cinq cases. Le lick garde la même forme, à partir de la case 10. Cinq cases vers le grave mènerait à Mi.",xp:30},
];
