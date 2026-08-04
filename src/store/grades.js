// Groply — store/grades.js
// Grades de profil : titres affichés à la place de tout système de niveau
// façon langues (A1-B2). Indexés sur le niveau réel (leveling.js), pas sur
// une estimation séparée — un seul niveau de vérité, réutilisé par
// badges.js et par les écrans qui affichent le grade (Progress, Settings,
// futur écran de résultat du test de placement).

export const GRADES = [
  {
    id: "bebe_rockeur",
    minLevel: 1,
    label: "Bébé rockeur",
    blurb: "Tu poses les bases, un accord à la fois.",
    rarity: "commun",
    tint: "amber",
    icon: "ti-baby-carriage",
  },
  {
    id: "gratteur_dimanche",
    minLevel: 5,
    label: "Gratteur du dimanche",
    blurb: "Tu tiens un rythme de pratique régulier.",
    rarity: "commun",
    tint: "green",
    icon: "ti-guitar-pick",
  },
  {
    id: "campeur_feu_camp",
    minLevel: 10,
    label: "Guitariste de feu de camp",
    blurb: "Assez solide pour animer un moment autour d'un feu de camp.",
    rarity: "rare",
    tint: "coral",
    icon: "ti-campfire",
  },
  {
    id: "chevalier_riffs",
    minLevel: 15,
    label: "Chevalier des riffs",
    blurb: "La technique tient la route, riffs compris.",
    rarity: "rare",
    tint: "primary",
    icon: "ti-sword",
  },
  {
    id: "seigneur_solo",
    minLevel: 20,
    label: "Seigneur du solo",
    blurb: "Tu improvises avec de vraies intentions musicales.",
    rarity: "epique",
    tint: "pink",
    icon: "ti-crown",
  },
  {
    id: "star_legendaire",
    minLevel: 30,
    label: "Star légendaire",
    blurb: "Niveau de jeu et d'oreille au sommet du Parcours.",
    rarity: "legend",
    tint: "primary",
    icon: "ti-trophy",
  },
];

/** Grade correspondant à un niveau donné : le plus haut grade déjà atteint. */
export function gradeForLevel(level) {
  let current = GRADES[0];
  for (const g of GRADES) {
    if (level >= g.minLevel) current = g;
  }
  return current;
}

/** Grade suivant à débloquer (null si le niveau max de la liste est déjà atteint). */
export function nextGrade(level) {
  return GRADES.find(g => g.minLevel > level) || null;
}

/** Niveaux restants avant le prochain grade (null si déjà au grade maximum). */
export function levelsToNextGrade(level) {
  const next = nextGrade(level);
  return next ? next.minLevel - level : null;
}
