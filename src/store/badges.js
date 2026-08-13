// Groply — store/badges.js
// Système de badges, conditions de déverrouillage.
//
// ── Ce qui change (audit §4.5) ────────────────────────────────────────────
// `BADGE_TINTS` et `BADGE_RARITIES` étaient construits depuis LIGHT
// uniquement : en thème sombre, les badges affichaient des couleurs pensées
// pour un fond clair. Les builders `buildBadgeTints(C)` existaient déjà — il
// suffisait que les écrans les utilisent avec le thème courant. Un hook
// `useBadgeTints()` est exposé pour ça, et les alias figés sont conservés
// pour les appelants non encore migrés.

import { LIGHT } from "../design/tokens.js";
import { GRADES } from "./grades.js";

// Toutes les valeurs viennent du thème : plus aucune couleur codée en dur,
// qui restait figée au thème clair (le rose et le violet l'étaient).
const buildBadgeTints = (C) => ({
  primary: { bg: C.primaryL, border: C.primaryBorder, icon: C.primary, text: C.primaryD },
  green:   { bg: C.greenL,   border: C.greenBorder,   icon: C.green,   text: C.greenD },
  amber:   { bg: C.amberL,   border: C.amberBorder,   icon: C.amber,   text: C.amberD },
  coral:   { bg: C.coralL,   border: C.coralBorder,   icon: C.coral,   text: C.coralD },
  pink:    { bg: C.pinkL,    border: C.pinkBorder,    icon: C.pink,    text: C.pinkD },
  purple:  { bg: C.purpleL,  border: C.purpleBorder,  icon: C.purple,  text: C.purpleD },
  blue:    { bg: C.blueL,    border: C.blueBorder,    icon: C.blue,    text: C.blueD },
  teal:    { bg: C.tealL,    border: C.tealBorder,    icon: C.teal,    text: C.tealD },
});
const buildBadgeRarities = (C) => ({
  commun: { label: "commun",  bg: C.surface2,    fg: C.text2 },
  rare:   { label: "rare",    bg: C.blueL,       fg: C.blueD },
  epique: { label: "épique",  bg: C.coralL,      fg: C.coralD },
  legend: { label: "légend.", bg: C.primaryBtn,  fg: "#FFFFFF" },
});

// Alias figés sur le thème clair — conservés pour les appelants non migrés.
// À remplacer par useBadgeTints() partout où le thème compte.
const BADGE_TINTS = buildBadgeTints(LIGHT);
const BADGE_RARITIES = buildBadgeRarities(LIGHT);

const skillMastery = (state, content, courseId) => {
  const exs = content.exercises.filter(e => e.mod === courseId);
  const qzs = content.quiz.filter(q => q.courseId === courseId);
  if (exs.length === 0 && qzs.length === 0) return 0;
  const exDone = exs.length > 0 ? exs.filter(e => state.completedExercises[e.id]).length / exs.length : null;
  const qzOk = qzs.length > 0 ? qzs.filter(q => state.quizResults[q.id]?.correct).length / qzs.length : null;
  // Pondération 60/40 quand exercices ET quiz existent ; sinon on s'appuie
  // entièrement sur celui qui existe — évite qu'un module sans quiz (Impro)
  // plafonne structurellement à 60% même à 100% des exercices complétés.
  if (exDone !== null && qzOk !== null) return Math.round((exDone * 0.6 + qzOk * 0.4) * 100);
  return Math.round((exDone ?? qzOk) * 100);
};
const allModulesMastered = (state, content) =>
  content.courses.every(c => {
    const total = c.lessons.length;
    const done = c.lessons.filter(l => state.completedLessons[l.id]).length;
    return total > 0 && done === total;
  });
const perfectQuizCount = (state) =>
  Object.values(state.quizResults).filter(r => r.correct && r.attempts === 1).length;

// Un badge par grade, généré depuis grades.js — le seuil et le libellé ne
// vivent qu'à un seul endroit (grades.js), pas dupliqués ici.
const GRADE_BADGES = GRADES.map(g => ({
  id: `grade_${g.id}`,
  cat: "Grade",
  tint: g.tint,
  rarity: g.rarity,
  icon: g.icon,
  label: g.label,
  cond: s => s.level >= g.minLevel,
}));

const BADGES = [
  // ── Premiers pas
  { id: "first_lesson",   cat: "Premiers pas", tint: "primary", rarity: "commun", icon: "ti-flag",          label: "Première leçon",   cond: s => Object.keys(s.completedLessons).length >= 1 },
  { id: "first_exercise", cat: "Premiers pas", tint: "green",   rarity: "commun", icon: "ti-guitar-pick",   label: "Premier exercice", cond: s => Object.keys(s.completedExercises).length >= 1 },
  { id: "first_quiz",     cat: "Premiers pas", tint: "amber",   rarity: "commun", icon: "ti-help-circle",   label: "Premier quiz",     cond: s => Object.keys(s.quizResults).length >= 1 },

  // ── Streak
  { id: "streak_3",  cat: "Streak", tint: "amber", rarity: "commun", icon: "ti-flame", label: "3 jours",  cond: s => s.streak >= 3 },
  { id: "streak_7",  cat: "Streak", tint: "coral", rarity: "rare",   icon: "ti-flame", label: "7 jours",  cond: s => s.streak >= 7 },
  { id: "streak_30", cat: "Streak", tint: "coral", rarity: "epique", icon: "ti-flame", label: "30 jours", cond: s => s.streak >= 30 },

  // ── Expérience
  { id: "xp_500",  cat: "Expérience", tint: "primary", rarity: "commun", icon: "ti-star",   label: "500 XP",   cond: s => s.xp >= 500 },
  { id: "xp_2000", cat: "Expérience", tint: "primary", rarity: "rare",   icon: "ti-bolt",   label: "2 000 XP", cond: s => s.xp >= 2000 },
  { id: "xp_5000", cat: "Expérience", tint: "primary", rarity: "legend", icon: "ti-trophy", label: "5 000 XP", cond: s => s.xp >= 5000 },

  // ── Maîtrise exercices
  { id: "ex_10",  cat: "Maîtrise", tint: "green", rarity: "commun", icon: "ti-circle-check",  label: "10 exercices",  cond: s => Object.keys(s.completedExercises).length >= 10 },
  { id: "ex_25",  cat: "Maîtrise", tint: "green", rarity: "rare",   icon: "ti-target-arrow",  label: "25 exercices",  cond: s => Object.keys(s.completedExercises).length >= 25 },
  { id: "ex_100", cat: "Maîtrise", tint: "green", rarity: "legend", icon: "ti-medal",         label: "100 exercices", cond: s => Object.keys(s.completedExercises).length >= 100 },

  // ── Skill (par module)
  { id: "skill_neck",    cat: "Skill", tint: "amber",   rarity: "rare", icon: "ti-map-2",   label: "Manche maîtrisé",   cond: (s, ctx) => skillMastery(s, ctx, "neck")    >= 80 },
  { id: "skill_scales",  cat: "Skill", tint: "green",   rarity: "rare", icon: "ti-music",   label: "Modes maîtrisés",   cond: (s, ctx) => skillMastery(s, ctx, "scales")  >= 80 },
  { id: "skill_harmony", cat: "Skill", tint: "primary", rarity: "rare", icon: "ti-stack-2", label: "Harmonie pro",       cond: (s, ctx) => skillMastery(s, ctx, "harmony") >= 80 },
  { id: "skill_rhythm",  cat: "Skill", tint: "blue",    rarity: "rare", icon: "ti-metronome", label: "Rythme solide",    cond: (s, ctx) => skillMastery(s, ctx, "rhythm")  >= 80 },
  { id: "skill_impro",   cat: "Skill", tint: "pink",    rarity: "rare", icon: "ti-wand",    label: "Improvisateur",     cond: (s, ctx) => skillMastery(s, ctx, "impro")   >= 80 },

  // ── Quiz
  { id: "quiz_perfect", cat: "Quiz", tint: "amber", rarity: "commun", icon: "ti-circle-check", label: "Quiz parfait",      cond: s => perfectQuizCount(s) >= 1 },
  { id: "quiz_50",      cat: "Quiz", tint: "amber", rarity: "rare",   icon: "ti-target",       label: "50 quiz réussis",   cond: s => Object.values(s.quizResults).filter(r => r.correct).length >= 50 },
  { id: "quiz_100",     cat: "Quiz", tint: "amber", rarity: "epique", icon: "ti-crown",        label: "100 quiz réussis",  cond: s => Object.values(s.quizResults).filter(r => r.correct).length >= 100 },

  // ── Leçons
  { id: "lessons_25", cat: "Leçons", tint: "primary", rarity: "commun", icon: "ti-book-2",      label: "25 leçons", cond: s => Object.keys(s.completedLessons).length >= 25 },
  { id: "lessons_50", cat: "Leçons", tint: "primary", rarity: "rare",   icon: "ti-books",       label: "50 leçons", cond: s => Object.keys(s.completedLessons).length >= 50 },

  // ── Pratique
  { id: "practice_10",   cat: "Pratique", tint: "coral", rarity: "rare",   icon: "ti-dice-5",   label: "10 défis libres",   cond: s => (s.practiceLibre?.count || 0) >= 10 },
  { id: "daily_30",      cat: "Pratique", tint: "coral", rarity: "epique", icon: "ti-bolt",     label: "30 défis du jour",  cond: s => (s.dailyChallengeCount || 0) >= 30 },
  { id: "all_modules",   cat: "Pratique", tint: "green", rarity: "legend", icon: "ti-mountain", label: "5 modules finis",   cond: (s, ctx) => allModulesMastered(s, ctx) },

  // ── Régularité
  { id: "full_week", cat: "Régularité", tint: "pink", rarity: "rare", icon: "ti-calendar-check", label: "Semaine pleine", cond: s => s.streak >= 7 && (s.weeklyGoals?.sessions || 0) >= 7 },

  // ── Grade (généré depuis grades.js)
  ...GRADE_BADGES,
];

const computeNewBadges = (state, content) => {
  return BADGES
    .filter(b => !state.unlockedBadges.includes(b.id))
    .filter(b => {
      try { return b.cond(state, content); } catch { return false; }
    })
    .map(b => b.id);
};

export { buildBadgeTints, buildBadgeRarities, BADGE_TINTS, BADGE_RARITIES, BADGES, computeNewBadges, skillMastery };
