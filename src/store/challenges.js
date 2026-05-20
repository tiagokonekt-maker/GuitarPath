// GuitarPath — store/challenges.js
// Données pour la pratique libre et les défis quotidiens

// ═══════════════════════════════════════════════════════════════════════════
// CHALLENGES & PRACTICE DATA
// ═══════════════════════════════════════════════════════════════════════════
const KEYS = ["A","B","C","D","E","F","G"];
const MODES = ["majeur","mineur","dorien","mixolydien","phrygien","lydien"];
const TEMPOS = [60,70,80,90,100,110,120];
const CONSTRAINTS = [
  "uniquement 3 notes au choix",
  "uniquement notes longues (rondes/blanches)",
  "phrases qui finissent toutes sur la tonique",
  "phrases qui contiennent au moins 1 bend",
  "uniquement sur cordes 1 et 2",
  "uniquement sur 1 seule corde",
  "alternance jeu / silence toutes les 2 mesures",
  "phrases de 4 notes maximum",
  "uniquement legato (HO/PO, pas de picking)",
  "phrases qui montent puis descendent",
  "yeux fermés (pas de visuel manche)",
  "1 nouvelle phrase à chaque mesure",
];
const DAILY_CHALLENGES = [
  "Improvise 3 minutes non-stop sur Am 70 BPM. Ne t'arrête JAMAIS.",
  "Joue la pentatonique Am dans les 5 positions enchaînées sans erreur.",
  "Compose un riff de 4 mesures et joue-le 10 fois parfaitement.",
  "Enregistre-toi 5 minutes. Écoute. Note ta meilleure phrase.",
  "Joue Am-F-C-G en arpèges pendant 10 minutes sans t'arrêter.",
  "Improvise les yeux fermés pendant 5 minutes en Am.",
  "Joue uniquement des notes longues (blanches) pendant 5 minutes.",
  "Construis un solo qui monte progressivement d'intensité sur 4 minutes.",
  "Joue le même riff dans 3 tonalités différentes (Am, Dm, Em).",
  "Improvise en alternant 1 mesure jeu / 1 mesure silence pendant 5 minutes.",
];

// ═══════════════════════════════════════════════════════════════════════════
// BADGES — 24 badges, 8 catégories, 4 raretés
// ═══════════════════════════════════════════════════════════════════════════

export { KEYS, MODES, TEMPOS, CONSTRAINTS, DAILY_CHALLENGES };
