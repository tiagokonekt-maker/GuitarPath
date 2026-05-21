// GuitarPath -- store/reviewEngine.js
// Moteur de revision intelligente base sur SM-2 simplifie
// Filtre strict : uniquement les questions dont la lecon est completee

// ─────────────────────────────────────────────────────────────────────────
// CALCUL DU SCORE DE PRIORITE
// Plus le score est eleve, plus la question doit etre revue
// ─────────────────────────────────────────────────────────────────────────
export function getPriorityScore(questionId, reviewHistory, completedLessons, today) {
  const h = reviewHistory?.[questionId];

  // Jamais vue = priorite maximale
  if (!h) return 80;

  const { attempts = 0, successes = 0, lastSeen = "", streak = 0 } = h;
  const daysSince = lastSeen
    ? Math.floor((new Date(today) - new Date(lastSeen)) / 86400000)
    : 999;

  // Succes consecutifs -> reduction de priorite (spaced repetition)
  // streak 0 = echouee recemment -> priorite haute
  // streak 1 = 1 succes -> revoir dans 1 jour
  // streak 2 = 2 succes -> revoir dans 4 jours
  // streak 3 = 3 succes -> revoir dans 10 jours
  // streak 4+ = maitrisee -> revoir dans 30 jours
  const reviewInterval = [0, 1, 4, 10, 30][Math.min(streak, 4)];

  // Si pas encore le moment de revoir
  if (daysSince < reviewInterval && streak > 0) return 0;

  // Score de base selon le taux de reussite
  const successRate = attempts > 0 ? successes / attempts : 0;
  const failurePriority = (1 - successRate) * 50;

  // Bonus selon le temps ecoule (max 30 points)
  const freshnessPriority = Math.min(daysSince * 2, 30);

  // Bonus si jamais reussie
  const neverSucceeded = successes === 0 && attempts > 0 ? 20 : 0;

  return Math.round(failurePriority + freshnessPriority + neverSucceeded);
}

// ─────────────────────────────────────────────────────────────────────────
// FILTRE D'ELIGIBILITE
// Une question est eligible seulement si sa lecon est completee
// ─────────────────────────────────────────────────────────────────────────
export function isEligible(question, completedLessons) {
  // Si la question a une lecon associee, elle doit etre completee
  if (question.lessonId && !completedLessons[question.lessonId]) return false;
  // Si pas de lecon mais un cours, au moins 1 lecon du cours doit etre completee
  if (!question.lessonId && question.courseId) {
    const coursePrefix = question.courseId + "-";
    const hasCourseLesson = Object.keys(completedLessons).some(id => id.startsWith(coursePrefix));
    if (!hasCourseLesson) return false;
  }
  return true;
}

// ─────────────────────────────────────────────────────────────────────────
// CONSTRUCTION DE LA SESSION
// Selectionne 10-15 questions selon les priorites
// ─────────────────────────────────────────────────────────────────────────
export function buildReviewSession(allQuestions, reviewHistory, completedLessons, options = {}) {
  const {
    targetCount = 12,
    maxFretboard = 5,
    today = new Date().toISOString().split("T")[0],
  } = options;

  // 1. Filtrer les questions eligibles
  const eligible = allQuestions.filter(q => isEligible(q, completedLessons));

  if (eligible.length === 0) return { questions: [], reason: "no_lessons_completed" };

  // 2. Calculer les scores de priorite
  const scored = eligible
    .map(q => ({
      question: q,
      score: getPriorityScore(q.id, reviewHistory, completedLessons, today),
    }))
    .filter(({ score }) => score > 0) // exclure les questions "trop recentes"
    .sort((a, b) => b.score - a.score);

  if (scored.length === 0) {
    // Tout a ete vu recemment -- prendre les plus anciennes
    const oldest = eligible
      .map(q => {
        const h = reviewHistory?.[q.id];
        return { question: q, lastSeen: h?.lastSeen || "2000-01-01" };
      })
      .sort((a, b) => a.lastSeen.localeCompare(b.lastSeen))
      .slice(0, targetCount);
    return { questions: oldest.map(x => x.question), reason: "all_recent" };
  }

  // 3. Composer la session avec un bon mix
  const session = [];
  let fretboardCount = 0;

  // 40% priorite haute (ratees/jamais vues)
  const highPriority = scored.filter(x => x.score >= 50).slice(0, Math.ceil(targetCount * 0.4));
  // 30% priorite moyenne (vues il y a longtemps)
  const medPriority = scored.filter(x => x.score >= 20 && x.score < 50).slice(0, Math.ceil(targetCount * 0.3));
  // 30% priorite basse (renforcement)
  const lowPriority = scored.filter(x => x.score > 0 && x.score < 20).slice(0, Math.ceil(targetCount * 0.3));

  const pool = [...highPriority, ...medPriority, ...lowPriority];

  // Melanger avec contrainte fretboard
  for (const { question } of pool) {
    if (session.length >= targetCount) break;
    const isFret = question.type === "fretboard";

    // Limiter les fretboard consecutifs
    const lastTwo = session.slice(-2);
    const consecutiveFret = lastTwo.filter(q => q.type === "fretboard").length;
    if (isFret && consecutiveFret >= 2) continue;

    // Limiter le total fretboard
    if (isFret && fretboardCount >= maxFretboard) continue;

    session.push(question);
    if (isFret) fretboardCount++;
  }

  // Completer si pas assez
  if (session.length < Math.min(targetCount, scored.length)) {
    for (const { question } of scored) {
      if (session.length >= targetCount) break;
      if (!session.find(q => q.id === question.id)) session.push(question);
    }
  }

  return {
    questions: session,
    reason: "normal",
    stats: {
      total: session.length,
      fretboard: fretboardCount,
      mcq: session.length - fretboardCount,
      highPriority: session.filter(q => (reviewHistory?.[q.id]?.successes || 0) === 0).length,
    },
  };
}

// ─────────────────────────────────────────────────────────────────────────
// MISE A JOUR DE L'HISTORIQUE apres une reponse
// ─────────────────────────────────────────────────────────────────────────
export function updateReviewHistory(history, questionId, correct, today) {
  const prev = history?.[questionId] || { attempts: 0, successes: 0, streak: 0, lastSeen: "" };
  return {
    ...history,
    [questionId]: {
      attempts:  prev.attempts + 1,
      successes: prev.successes + (correct ? 1 : 0),
      streak:    correct ? prev.streak + 1 : 0,
      lastSeen:  today,
    },
  };
}

// ─────────────────────────────────────────────────────────────────────────
// STATS POUR L'AFFICHAGE HOME
// ─────────────────────────────────────────────────────────────────────────
export function getReviewStats(allQuestions, reviewHistory, completedLessons) {
  const today = new Date().toISOString().split("T")[0];
  const eligible = allQuestions.filter(q => isEligible(q, completedLessons));
  const toReview = eligible.filter(q =>
    getPriorityScore(q.id, reviewHistory, completedLessons, today) > 0
  );
  const neverSeen = eligible.filter(q => !reviewHistory?.[q.id]);
  const mastered = eligible.filter(q => (reviewHistory?.[q.id]?.streak || 0) >= 4);

  return {
    eligible: eligible.length,
    toReview: Math.min(toReview.length, 99),
    neverSeen: neverSeen.length,
    mastered: mastered.length,
    pctMastered: eligible.length > 0 ? Math.round((mastered.length / eligible.length) * 100) : 0,
  };
}
