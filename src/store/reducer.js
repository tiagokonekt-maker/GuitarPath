// Groply — store/reducer.js
// Reducer principal — toutes les actions de l'app.

import { todayStr, weekStr, saveState, defaultState } from "./state.js";
import { levelFromXp } from "./leveling.js";
import { DAILY_CHALLENGES } from "./challenges.js";

// ── Helpers ────────────────────────────────────────────────────────────────
// Point d'entrée UNIQUE pour gagner de l'XP : le niveau est toujours recalculé
// depuis la courbe (leveling.js), jamais à la main.
const gainXp = (s, amount) => {
  s.xp += amount;
  s.level = levelFromXp(s.xp);
};

const pushHistory = (s, entry) => {
  s.sessionHistory = [entry, ...(s.sessionHistory || [])].slice(0, 10);
};

const daysAgoStr = (n) =>
  new Date(Date.now() - n * 86400000).toISOString().split("T")[0];

const MAX_FREEZES = 2;

function reducer(state, action) {
  let s = { ...state };
  const today = todayStr();
  switch (action.type) {

    case "ADD_XP":
      gainXp(s, action.xp);
      break;

    case "COMPLETE_LESSON":
      if (!s.completedLessons[action.id]) {
        s.completedLessons = { ...s.completedLessons, [action.id]: today };
        gainXp(s, 30);
        pushHistory(s, { type: "lesson", id: action.id, title: action.title || "Leçon", xp: 30, date: today });
      }
      break;

    case "COMPLETE_EXERCISE":
      s.completedExercises = { ...s.completedExercises, [action.id]: { completedAt: today, count: (s.completedExercises[action.id]?.count || 0) + 1 } };
      delete s.exerciseProgress[action.id];
      gainXp(s, action.xp);
      pushHistory(s, { type: "exercise", id: action.id, title: action.title || "Exercice", xp: action.xp, date: today });
      break;

    case "SAVE_EXERCISE_PROGRESS":
      s.exerciseProgress = { ...s.exerciseProgress, [action.id]: action.checkedSteps };
      break;

    case "QUIZ_ANSWER": {
      const prev = s.quizResults[action.id] || { correct: false, attempts: 0 };
      s.quizResults = { ...s.quizResults, [action.id]: { correct: action.correct, attempts: prev.attempts + 1, lastAttempt: today } };
      if (action.correct) {
        gainXp(s, action.xp);
        s.wrongQuiz = s.wrongQuiz.filter(id => id !== action.id);
      } else {
        if (!s.wrongQuiz.includes(action.id)) s.wrongQuiz = [...s.wrongQuiz, action.id];
      }
      break;
    }

    case "REVIEW_ANSWER": {
      // Mise à jour de l'historique de révision (SM-2)
      s.reviewHistory = action.history;
      if (action.correct && action.xp) gainXp(s, action.xp);
      break;
    }

    case "EXERCISE_MASTERY_ANSWER": {
      // Même principe que REVIEW_ANSWER, appliqué à l'historique des
      // exercices : l'appelant a déjà recalculé l'historique via
      // updateReviewHistory(state.exerciseHistory, ...) et le transmet
      // ici tout fait — le reducer ne fait qu'enregistrer.
      s.exerciseHistory = action.history;
      break;
    }

    case "REVIEW_SESSION_DONE":
      gainXp(s, action.xp || 0);
      pushHistory(s, { type: "review", title: "Session de révision", xp: action.xp, score: action.score, date: today });
      break;

    case "QUIZ_SESSION_DONE":
      pushHistory(s, { type: "quiz", id: action.id || "session", title: action.title || "Quiz", xp: action.xp, date: today, score: action.score });
      break;

    case "MARK_STREAK": {
      if (s.lastSessionDate === today) break;
      const yesterday = daysAgoStr(1);
      const dayBefore = daysAgoStr(2);

      if (s.lastSessionDate === yesterday) {
        // Série continue normalement
        s.streak = s.streak + 1;
      } else if (s.lastSessionDate === dayBefore && (s.streakFreezes || 0) > 0) {
        // 1 jour manqué + un gel disponible → la série est sauvée ❄️
        s.streakFreezes = s.streakFreezes - 1;
        s.streak = s.streak + 1;
        pushHistory(s, { type: "freeze", title: "Série sauvée par un gel", xp: 0, date: today });
      } else {
        // Plus d'un jour manqué (ou pas de gel) → la série repart
        s.streak = 1;
      }
      s.lastSessionDate = today;

      // Récompense de régularité : +1 gel tous les 7 jours de série (max 2)
      if (s.streak > 0 && s.streak % 7 === 0) {
        s.streakFreezes = Math.min(MAX_FREEZES, (s.streakFreezes || 0) + 1);
      }
      break;
    }

    case "DAILY_CHALLENGE_DONE":
      s.dailyChallengeDone = true;
      s.dailyChallengeDate = today;
      s.dailyChallengeCount = (s.dailyChallengeCount || 0) + 1;
      gainXp(s, 80);
      break;

    case "ROTATE_DAILY":
      if (s.dailyChallengeDate !== today) {
        s.dailyChallengeIdx = (s.dailyChallengeIdx + 1) % DAILY_CHALLENGES.length;
        s.dailyChallengeDone = false; s.dailyChallengeDate = "";
      }
      break;

    case "PRACTICE_DONE":
      s.practiceLibre = { count: (s.practiceLibre?.count || 0) + 1, totalMinutes: (s.practiceLibre?.totalMinutes || 0) + (action.minutes || 5) };
      gainXp(s, 50);
      break;

    case "UPDATE_WEEKLY": {
      const w = weekStr();
      if (s.weeklyGoals.week !== w) s.weeklyGoals = { sessions: 0, exercises: 0, quizzes: 0, week: w };
      s.weeklyGoals = { ...s.weeklyGoals, [action.field]: s.weeklyGoals[action.field] + 1 };
      break;
    }

    case "UNLOCK_BADGES":
      s.unlockedBadges = [...new Set([...s.unlockedBadges, ...action.badgeIds])];
      break;

    case "SUBMIT_UNIT_CHECK": {
      // Vérification de fin d'unité : tentatives illimitées, on garde le
      // meilleur score et le statut passed dès qu'il est atteint une fois.
      // Les questions ratées rejoignent wrongQuiz (révision espacée), sans
      // toucher l'XP ni quizResults — ce n'est pas une session de quiz normale.
      const prev = s.unitChecks?.[action.unitId];
      const passed = action.pct >= (action.passPct ?? 70);
      s.unitChecks = {
        ...(s.unitChecks || {}),
        [action.unitId]: {
          passed: !!(prev?.passed || passed),
          score: Math.max(prev?.score || 0, action.pct),
          attempts: (prev?.attempts || 0) + 1,
          lastAttemptAt: today,
        },
      };
      if (action.wrongIds?.length) {
        s.wrongQuiz = [...new Set([...s.wrongQuiz, ...action.wrongIds])];
      }
      break;
    }

    case "CLAIM_UNIT_BONUS":
      // Coffre de fin d'unité du Parcours — réclamable une seule fois
      if (!s.claimedUnits?.[action.unitId]) {
        s.claimedUnits = { ...(s.claimedUnits || {}), [action.unitId]: today };
        gainXp(s, action.xp || 40);
        pushHistory(s, { type: "bonus", id: action.unitId, title: action.title || "Coffre d'unité ouvert", xp: action.xp || 40, date: today });
      }
      break;

    case "DISMISS_GROPI_TIP":
      s.gropiTipDate = today;
      break;

    case "SET_THEME":
      s.theme = action.theme; // "auto" | "light" | "dark"
      break;

    case "COMPLETE_ONBOARDING":
      // Rempli une seule fois à la première ouverture, via le test de
      // placement adaptatif. Réordonne le Parcours (weakestModule +
      // preferredModule) et adapte le ton de Gropi, ne coche aucune leçon.
      // startXp (issu de startFromOverallTier) crédite un point de départ
      // cohérent avec la vraie courbe de niveaux : un joueur qui teste bien
      // démarre au bon grade, pas toujours à "Bébé rockeur".
      // Garde-fou : si jamais dispatché deux fois (double-clic sur
      // "terminer" avant le re-rendu), on ne crédite pas le XP une 2e fois.
      if (s.onboarding?.done) break;
      if (action.startXp) gainXp(s, action.startXp);
      s.onboarding = {
        done: true,
        goal: action.goal || null,
        preferredModule: action.preferredModule || null,
        timePerWeek: action.timePerWeek || null,
        skillLevels: action.skillLevels || { neck: null, scales: null, harmony: null, rhythm: null, impro: null },
        overallTier: action.overallTier || null,
        weakestModule: action.weakestModule || null,
        startXp: action.startXp || 0,
        skipped: !!action.skipped,
        completedAt: action.completedAt || today,
      };
      break;

    case "RESET":
      // On repart de zéro mais on garde la préférence de thème
      s = { ...defaultState(), theme: s.theme };
      break;

    default: break;
  }
  saveState(s);
  return s;
}

export { reducer };
