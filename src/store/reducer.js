// Groply — store/reducer.js
// Reducer principal — toutes les actions de l'app.
//
// Deux changements structurels par rapport à la version précédente :
//   1. Le crédit d'XP passe TOUJOURS par xpPreview() (store/xp.js), qui
//      rend l'XP idempotente pour une première réussite et réduite/plafonnée
//      pour les répétitions. Avant, refaire un exercice ou re-répondre à un
//      quiz créditait l'XP nominale à l'infini.
//   2. Le reducer ne persiste plus lui-même. L'écriture localStorage est
//      faite une seule fois, dans un effet, côté App.jsx — avant, elle avait
//      lieu deux fois par action (ici + dans le dispatch), et depuis
//      l'intérieur d'un updater React, que React se réserve le droit
//      d'appeler deux fois.

import { todayStr, weekStr, daysBetween, defaultState } from "./state.js";
import { levelFromXp, sanitizeXp } from "./leveling.js";
import { xpPreview, rollDaily, LESSON_XP, DAILY_PRACTICE_CAP } from "./xp.js";
import { DAILY_CHALLENGES } from "./challenges.js";

// ── Helpers ────────────────────────────────────────────────────────────────
const MAX_FREEZES = 2;
const HISTORY_MAX = 10;

/**
 * Point d'entrée UNIQUE pour gagner de l'XP.
 * `kind` + `id` permettent d'appliquer les règles d'idempotence et de
 * plafond. Le niveau est toujours recalculé depuis la courbe.
 */
function gainXp(s, kind, id, nominal) {
  const today = todayStr();
  const preview = xpPreview(s, kind, id, nominal);
  const granted = preview.xp;

  if (granted > 0) {
    s.xp = sanitizeXp(s.xp + granted);
    s.level = levelFromXp(s.xp);
    // Comptabilisation dans les plafonds du jour
    const daily = rollDaily(s.dailyXp, today);
    if (!preview.first && (kind === "quiz" || kind === "exercise" || kind === "review")) {
      daily.repeat += granted;
    }
    if (kind === "practice") daily.practice += 1;
    s.dailyXp = daily;
  } else if (kind === "practice") {
    // Session non créditée mais on garde le compteur du jour à jour
    s.dailyXp = rollDaily(s.dailyXp, today);
  }

  s.lastGain = { xp: granted, kind, at: today, first: preview.first, reason: preview.reason };
  return granted;
}

const pushHistory = (s, entry) => {
  s.sessionHistory = [entry, ...(s.sessionHistory || [])].slice(0, HISTORY_MAX);
};

function reducer(state, action) {
  const s = { ...state };
  const today = todayStr();

  // Le compteur quotidien se réinitialise dès la première action du jour :
  // sans ça, le plafond d'XP d'entretien de la veille restait actif.
  s.dailyXp = rollDaily(s.dailyXp, today);
  // Chaque action repart d'un lastGain neutre, pour qu'un écran ne réaffiche
  // pas le gain de l'action précédente.
  s.lastGain = { xp: 0, kind: "", at: today, first: false, reason: "none" };

  switch (action.type) {

    case "ADD_XP":
      // Action générique (bonus divers). Bornée, non répétable à l'infini
      // via un id facultatif — sans id, elle reste un crédit direct.
      s.xp = sanitizeXp(s.xp + Math.max(0, Math.round(Number(action.xp) || 0)));
      s.level = levelFromXp(s.xp);
      s.lastGain = { xp: Number(action.xp) || 0, kind: "bonus", at: today, first: true, reason: "first" };
      break;

    case "COMPLETE_LESSON": {
      if (s.completedLessons[action.id]) break;   // déjà lu : rien à créditer
      // L'ordre compte : gainXp() consulte l'état pour décider s'il s'agit
      // d'une première fois. On crédite AVANT de marquer la leçon comme
      // faite, sinon elle apparaît déjà acquise à ses propres yeux.
      const g = gainXp(s, "lesson", action.id, LESSON_XP);
      s.completedLessons = { ...s.completedLessons, [action.id]: today };
      pushHistory(s, { type: "lesson", id: action.id, title: action.title || "Leçon", xp: g, date: today });
      break;
    }

    case "COMPLETE_EXERCISE": {
      // CORRECTIF : l'XP dépend maintenant du fait que ce soit la première
      // complétion ou une répétition (XP d'entretien réduite et plafonnée).
      const g = gainXp(s, "exercise", action.id, action.xp);
      const prev = s.completedExercises[action.id];
      s.completedExercises = {
        ...s.completedExercises,
        [action.id]: {
          completedAt: prev?.completedAt || today,   // on garde la 1re date
          lastAt: today,
          count: (prev?.count || 0) + 1,
        },
      };
      const nextProgress = { ...s.exerciseProgress };
      delete nextProgress[action.id];
      s.exerciseProgress = nextProgress;
      pushHistory(s, { type: "exercise", id: action.id, title: action.title || "Exercice", xp: g, date: today });
      break;
    }

    case "SAVE_EXERCISE_PROGRESS":
      s.exerciseProgress = { ...s.exerciseProgress, [action.id]: action.checkedSteps };
      break;

    case "QUIZ_ANSWER": {
      const prev = s.quizResults[action.id] || { correct: false, attempts: 0 };
      // CORRECTIF : plus d'XP pleine à chaque bonne réponse répétée.
      if (action.correct) {
        gainXp(s, "quiz", action.id, action.xp);
        s.wrongQuiz = s.wrongQuiz.filter(id => id !== action.id);
      } else if (!s.wrongQuiz.includes(action.id)) {
        s.wrongQuiz = [...s.wrongQuiz, action.id];
      }
      s.quizResults = {
        ...s.quizResults,
        [action.id]: {
          // Une réussite acquise reste acquise : une erreur ultérieure la
          // renvoie en révision (wrongQuiz) mais ne la « dé-valide » pas,
          // sinon l'XP de première réussite serait re-créditable.
          correct: !!(prev.correct || action.correct),
          attempts: prev.attempts + 1,
          lastAttempt: today,
        },
      };
      break;
    }

    case "REVIEW_ANSWER":
      s.reviewHistory = action.history;
      if (action.correct && action.xp) gainXp(s, "review", action.id || "review", action.xp);
      break;

    case "EXERCISE_MASTERY_ANSWER":
      s.exerciseHistory = action.history;
      break;

    case "REVIEW_SESSION_DONE": {
      const g = gainXp(s, "review", "review-session", action.xp || 0);
      pushHistory(s, { type: "review", title: "Session de révision", xp: g, score: action.score, date: today });
      break;
    }

    case "QUIZ_SESSION_DONE":
      pushHistory(s, { type: "quiz", id: action.id || "session", title: action.title || "Quiz", xp: action.xp, date: today, score: action.score });
      break;

    case "MARK_STREAK": {
      if (s.lastSessionDate === today) break;

      // On raisonne en écart de jours calendaires plutôt qu'en comparaison
      // de chaînes construites à l'avance : plus lisible, et robuste aux
      // changements d'heure (l'écart passe par Date.UTC dans dates.js).
      const gap = daysBetween(s.lastSessionDate, today);

      if (gap === 1) {
        s.streak = (s.streak || 0) + 1;
      } else if (gap === 2 && (s.streakFreezes || 0) > 0) {
        s.streakFreezes = s.streakFreezes - 1;
        s.streak = (s.streak || 0) + 1;
        pushHistory(s, { type: "freeze", title: "Série sauvée par un gel", xp: 0, date: today });
      } else {
        s.streak = 1;
      }
      s.lastSessionDate = today;

      // +1 gel tous les 7 jours de série (max 2)
      if (s.streak > 0 && s.streak % 7 === 0) {
        s.streakFreezes = Math.min(MAX_FREEZES, (s.streakFreezes || 0) + 1);
      }
      break;
    }

    case "DAILY_CHALLENGE_DONE": {
      // CORRECTIF : garde-fou d'idempotence — le défi ne peut être validé
      // qu'une fois par jour, même en cas de double dispatch.
      if (s.dailyChallengeDone && s.dailyChallengeDate === today) break;
      gainXp(s, "daily", "daily", 80);          // avant de marquer : cf. COMPLETE_LESSON
      s.dailyChallengeDone = true;
      s.dailyChallengeDate = today;
      s.dailyChallengeCount = (s.dailyChallengeCount || 0) + 1;
      break;
    }

    case "ROTATE_DAILY":
      if (s.dailyChallengeDate !== today) {
        s.dailyChallengeIdx = ((s.dailyChallengeIdx || 0) + 1) % DAILY_CHALLENGES.length;
        s.dailyChallengeDone = false;
        s.dailyChallengeDate = "";
      }
      break;

    case "PRACTICE_DONE": {
      // CORRECTIF : plafonné à DAILY_PRACTICE_CAP sessions créditées/jour.
      const g = gainXp(s, "practice", "practice", 50);
      s.practiceLibre = {
        count: (s.practiceLibre?.count || 0) + 1,
        totalMinutes: (s.practiceLibre?.totalMinutes || 0) + (action.minutes || 5),
      };
      if (g > 0) {
        pushHistory(s, { type: "practice", title: "Pratique libre", xp: g, date: today });
      }
      break;
    }

    case "UPDATE_WEEKLY": {
      const w = weekStr();
      const base = s.weeklyGoals?.week === w
        ? s.weeklyGoals
        : { sessions: 0, exercises: 0, quizzes: 0, week: w };
      const field = action.field;
      if (!["sessions", "exercises", "quizzes"].includes(field)) { s.weeklyGoals = base; break; }
      s.weeklyGoals = { ...base, week: w, [field]: (base[field] || 0) + 1 };
      break;
    }

    case "UNLOCK_BADGES":
      s.unlockedBadges = [...new Set([...s.unlockedBadges, ...(action.badgeIds || [])])];
      break;

    case "SUBMIT_UNIT_CHECK": {
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

    case "CLAIM_UNIT_BONUS": {
      if (s.claimedUnits?.[action.unitId]) break;
      const g = gainXp(s, "unit", action.unitId, action.xp || 40);   // avant de marquer
      s.claimedUnits = { ...(s.claimedUnits || {}), [action.unitId]: today };
      pushHistory(s, { type: "bonus", id: action.unitId, title: action.title || "Coffre d'unité ouvert", xp: g, date: today });
      break;
    }

    case "DISMISS_GROPI_TIP":
      s.gropiTipDate = today;
      break;

    case "SET_THEME":
      if (["auto", "light", "dark"].includes(action.theme)) s.theme = action.theme;
      break;

    case "COMPLETE_ONBOARDING":
      // Garde-fou : si dispatché deux fois (double-clic avant le re-rendu),
      // on ne crédite pas l'XP de départ une seconde fois.
      if (s.onboarding?.done) break;
      if (action.startXp) {
        s.xp = sanitizeXp(s.xp + Math.max(0, Math.round(Number(action.startXp) || 0)));
        s.level = levelFromXp(s.xp);
      }
      s.onboarding = {
        done: true,
        goal: action.goal || null,
        preferredModule: action.preferredModule || null,
        timePerWeek: action.timePerWeek || null,
        skillLevels: action.skillLevels || defaultState().onboarding.skillLevels,
        overallTier: action.overallTier || null,
        weakestModule: action.weakestModule || null,
        startXp: action.startXp || 0,
        startLevel: action.startLevel || levelFromXp(s.xp),
        skipped: !!action.skipped,
        completedAt: action.completedAt || today,
      };
      break;

    case "RESET":
      // On repart complètement de zéro, y compris sur l'onboarding : la
      // prochaine ouverture de l'app redemande le test de placement.
      //
      // C'est un choix qui a changé. La version précédente gardait
      // `onboarding.done = true` avec l'objectif et le temps disponible
      // conservés — l'idée était qu'un utilisateur qui reset sa
      // progression après des mois d'usage connaît déjà l'app, et que
      // réimposer 12 questions serait de la friction gratuite.
      //
      // Ce raisonnement suppose un reset "je veux repartir proprement dans
      // ma pratique" — mais il en existe un autre, tout aussi légitime :
      // "je veux un compte neuf pour tout retester depuis le départ",
      // notamment pendant le développement. Dans ce second cas, sauter le
      // placement est franchement gênant : ça laisse le parcours au
      // niveau 1 sans jamais pouvoir vérifier que le test fonctionne, et
      // ça ne correspond pas à ce que "repartir de zéro" veut dire.
      //
      // On garde uniquement la préférence de thème, qui n'a rien à voir
      // avec la progression pédagogique. Tout le reste — y compris
      // l'onboarding — repart de `defaultState()`.
      //
      // On continue d'HORODATER le reset : c'est ce qui permet à
      // mergeStates de ne pas le laisser annuler par un autre appareil
      // (state.js/resetWins).
      return {
        ...defaultState(),
        theme: s.theme,
        resetAt: new Date().toISOString(),
      };

    default:
      return state;   // action inconnue : aucun nouvel objet, pas de rendu inutile
  }

  return s;
}

export { reducer, gainXp };
