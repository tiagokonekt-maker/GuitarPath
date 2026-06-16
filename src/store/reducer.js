// GuitarPath — store/reducer.js
// Reducer principal — toutes les actions de l'app

import { todayStr, weekStr, saveState } from "./state.js";
import { DAILY_CHALLENGES } from "./challenges.js";

function reducer(state, action) {
  let s = { ...state };
  const today = todayStr();
  switch (action.type) {
    case "ADD_XP":
      s.xp += action.xp;
      s.level = Math.floor(s.xp / 300) + 1;
      break;
    case "COMPLETE_LESSON":
      if (!s.completedLessons[action.id]) {
        s.completedLessons = { ...s.completedLessons, [action.id]: today };
        s.xp += 30; s.level = Math.floor(s.xp / 300) + 1;
        s.sessionHistory = [{ type: "lesson", id: action.id, title: action.title || "Leçon", xp: 30, date: today }, ...(s.sessionHistory || [])].slice(0, 10);
      }
      break;
    case "COMPLETE_EXERCISE":
      s.completedExercises = { ...s.completedExercises, [action.id]: { completedAt: today, count: (s.completedExercises[action.id]?.count || 0) + 1 } };
      delete s.exerciseProgress[action.id];
      s.xp += action.xp; s.level = Math.floor(s.xp / 300) + 1;
      s.sessionHistory = [{ type: "exercise", id: action.id, title: action.title || "Exercice", xp: action.xp, date: today }, ...(s.sessionHistory || [])].slice(0, 10);
      break;
    case "SAVE_EXERCISE_PROGRESS":
      s.exerciseProgress = { ...s.exerciseProgress, [action.id]: action.checkedSteps };
      break;
    case "QUIZ_ANSWER": {
      const prev = s.quizResults[action.id] || { correct: false, attempts: 0 };
      s.quizResults = { ...s.quizResults, [action.id]: { correct: action.correct, attempts: prev.attempts + 1, lastAttempt: today } };
      if (action.correct) {
        s.xp += action.xp;
        s.wrongQuiz = s.wrongQuiz.filter(id => id !== action.id);
      } else {
        if (!s.wrongQuiz.includes(action.id)) s.wrongQuiz = [...s.wrongQuiz, action.id];
      }
      s.level = Math.floor(s.xp / 300) + 1;
      break;
    }
    case "REVIEW_ANSWER": {
      // Mise a jour de l'historique de revision (SM-2)
      s.reviewHistory = action.history;
      if (action.correct && action.xp) {
        s.xp += action.xp;
        s.level = Math.floor(s.xp / 300) + 1;
      }
      break;
    }
    case "REVIEW_SESSION_DONE":
      s.xp += action.xp || 0;
      s.level = Math.floor(s.xp / 300) + 1;
      s.sessionHistory = [{
        type: "review", title: "Session de revision",
        xp: action.xp, score: action.score, date: today,
      }, ...(s.sessionHistory || [])].slice(0, 10);
      break;
    case "QUIZ_SESSION_DONE":
      s.sessionHistory = [{ type: "quiz", id: action.id || "session", title: action.title || "Quiz", xp: action.xp, date: today, score: action.score }, ...(s.sessionHistory || [])].slice(0, 10);
      break;
    case "MARK_STREAK":
      if (s.lastSessionDate !== today) {
        const yesterday = new Date(Date.now() - 86400000).toISOString().split("T")[0];
        s.streak = (s.lastSessionDate === yesterday) ? s.streak + 1 : 1;
        s.lastSessionDate = today;
      }
      break;
    case "DAILY_CHALLENGE_DONE":
      s.dailyChallengeDone = true;
      s.dailyChallengeDate = today;
      s.dailyChallengeCount = (s.dailyChallengeCount || 0) + 1;
      s.xp += 80;
      s.level = Math.floor(s.xp / 300) + 1;
      break;
    case "ROTATE_DAILY":
      if (s.dailyChallengeDate !== today) {
        s.dailyChallengeIdx = (s.dailyChallengeIdx + 1) % DAILY_CHALLENGES.length;
        s.dailyChallengeDone = false; s.dailyChallengeDate = "";
      }
      break;
    case "PRACTICE_DONE":
      s.practiceLibre = { count: (s.practiceLibre?.count || 0) + 1, totalMinutes: (s.practiceLibre?.totalMinutes || 0) + (action.minutes || 5) };
      s.xp += 50;
      s.level = Math.floor(s.xp / 300) + 1;
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
    case "DISMISS_GROPI_TIP":
      s.gropiTipDate = today;
      break;
    case "SET_THEME":
      s.theme = action.theme; // "auto" | "light" | "dark"
      break;
    case "RESET":
      s = defaultState();
      break;
    default: break;
  }
  saveState(s);
  return s;
}

// ═══════════════════════════════════════════════════════════════════════════
// COMPOSANTS UI primitifs
// ═══════════════════════════════════════════════════════════════════════════

export { reducer };
