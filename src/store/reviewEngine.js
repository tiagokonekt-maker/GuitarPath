// Groply — store/reviewEngine.js
// Moteur de revision intelligente base sur SM-2 simplifie.
//
// Historique de cette generalisation : le quiz avait deja ce moteur, les
// exercices n'avaient qu'un booleen fait/pas fait. Plutot que de fusionner
// les deux dans UNE seule structure avec des cles prefixees ("quiz:id" /
// "exercise:id"), ce qui aurait renomme les cles de state.reviewHistory
// deja accumulees par les utilisateurs et fait apparaitre tout leur
// historique de quiz comme "jamais vu" — on garde DEUX historiques
// paralleles (reviewHistory pour le quiz, inchange ; exerciseHistory,
// nouveau, pour les exercices), qui partagent le meme algorithme. Zero
// risque sur les donnees deja existantes, meme resultat pedagogique.

// ─────────────────────────────────────────────────────────────────────────
// CALCUL DU SCORE DE PRIORITE
// Generique par construction : ne depend que d'une cle et d'un objet
// d'historique, jamais du type d'item (quiz ou exercice). Plus le score
// est eleve, plus l'item doit etre revu.
// ─────────────────────────────────────────────────────────────────────────
export function getPriorityScore(itemId, history, completedLessons, today) {
  const h = history?.[itemId];

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
// Une question de quiz porte lessonId/courseId ; un exercice porte
// courseLink/mod (noms de champs differents, meme role). On accepte les
// deux conventions pour que la meme fonction serve aux deux types sans
// jamais avoir a renommer les champs de content.js.
// ─────────────────────────────────────────────────────────────────────────
export function isEligible(item, completedLessons) {
  const lessonId = item.lessonId ?? item.courseLink ?? null;
  const courseId = item.courseId ?? item.mod ?? null;

  if (lessonId && !completedLessons[lessonId]) return false;
  if (!lessonId && courseId) {
    const coursePrefix = courseId + "-";
    const hasCourseLesson = Object.keys(completedLessons).some(id => id.startsWith(coursePrefix));
    if (!hasCourseLesson) return false;
  }
  return true;
}

// ─────────────────────────────────────────────────────────────────────────
// CONSTRUCTION DE LA SESSION (quiz uniquement)
// Inchangee : c'est la fonction deja utilisee par QuizScreen.jsx pour les
// sessions par module et la revision. On ne la touche pas — tout ce qui
// en depend aujourd'hui continue de fonctionner a l'identique.
// ─────────────────────────────────────────────────────────────────────────
export function buildReviewSession(allQuestions, reviewHistory, completedLessons, options = {}) {
  const {
    targetCount = 12,
    maxFretboard = 5,
    today = new Date().toISOString().split("T")[0],
    // Pool de secours : questions dont la leçon n'est pas encore terminée,
    // utilisées SEULEMENT si les questions légitimement dues ne suffisent
    // pas à remplir la session. Sans ça, quelqu'un qui a tout maîtrisé au
    // palier 1 reboucle indéfiniment sur les 2 mêmes questions.
    lookaheadQuestions = null,
  } = options;

  const eligible = allQuestions.filter(q => isEligible(q, completedLessons));

  if (eligible.length === 0) return { questions: [], reason: "no_lessons_completed" };

  const scored = eligible
    .map(q => ({
      question: q,
      score: getPriorityScore(q.id, reviewHistory, completedLessons, today),
    }))
    .filter(({ score }) => score > 0)
    // Tri par priorité, mais ordre ALÉATOIRE entre items de score égal.
    // Sans ce départage, deux sessions consécutives servent exactement la
    // même suite dans le même ordre — ce qui donne l'impression de tourner
    // en boucle même quand le contenu est légitimement dû.
    .sort((a, b) => (b.score - a.score) || (Math.random() - 0.5));

  const session = [];
  let fretboardCount = 0;

  const highPriority = scored.filter(x => x.score >= 50).slice(0, Math.ceil(targetCount * 0.4));
  const medPriority = scored.filter(x => x.score >= 20 && x.score < 50).slice(0, Math.ceil(targetCount * 0.3));
  const lowPriority = scored.filter(x => x.score > 0 && x.score < 20).slice(0, Math.ceil(targetCount * 0.3));

  const pool = [...highPriority, ...medPriority, ...lowPriority];

  for (const { question } of pool) {
    if (session.length >= targetCount) break;
    const isFret = question.type === "fretboard";

    const lastTwo = session.slice(-2);
    const consecutiveFret = lastTwo.filter(q => q.type === "fretboard").length;
    if (isFret && consecutiveFret >= 2) continue;

    if (isFret && fretboardCount >= maxFretboard) continue;

    session.push(question);
    if (isFret) fretboardCount++;
  }

  // Remplissage 1 — reste du pool scoré, sans la contrainte de répartition.
  for (const { question } of scored) {
    if (session.length >= targetCount) break;
    if (!session.find(q => q.id === question.id)) session.push(question);
  }

  // Remplissage 2 — questions éligibles mais PAS encore dues (revues
  // récemment). Les reposer un peu tôt vaut mieux que de servir deux fois
  // la même question dans la session.
  if (session.length < targetCount) {
    const notDue = eligible
      .filter(q => !session.find(s => s.id === q.id))
      .map(q => ({ q, lastSeen: reviewHistory?.[q.id]?.lastSeen || "2000-01-01" }))
      .sort((a, b) => a.lastSeen.localeCompare(b.lastSeen));
    for (const { q } of notDue) {
      if (session.length >= targetCount) break;
      session.push(q);
    }
  }

  // Remplissage 3 — contenu légèrement en avance (leçon pas encore faite).
  // C'est volontaire et borné : plutôt que de tourner en rond sur ce qui
  // est déjà maîtrisé, on donne un aperçu de la suite. L'appelant décide
  // quelles questions sont acceptables ici (niveau similaire ou juste
  // au-dessus), on ne va jamais chercher n'importe quoi tout seul.
  if (session.length < targetCount && Array.isArray(lookaheadQuestions)) {
    for (const q of lookaheadQuestions) {
      if (session.length >= targetCount) break;
      if (session.find(s => s.id === q.id)) continue;
      session.push(q);
    }
  }

  return {
    questions: session,
    reason: scored.length === 0 ? "all_recent" : "normal",
    stats: {
      total: session.length,
      fretboard: fretboardCount,
      mcq: session.length - fretboardCount,
      dueCount: scored.length,
      highPriority: session.filter(q => (reviewHistory?.[q.id]?.successes || 0) === 0).length,
    },
  };
}

// ─────────────────────────────────────────────────────────────────────────
// SESSION UNIFIEE (quiz + exercices)
// Pioche dans plusieurs pools typés, chacun scoré contre SON PROPRE
// historique (reviewHistory pour le quiz, exerciseHistory pour les
// exercices), fusionnés et triés par priorité commune. Empêche
// d'enchaîner trop d'items du même type d'affilée — sans ça, une session
// pourrait aligner 8 exercices manche avant le premier quiz.
// ─────────────────────────────────────────────────────────────────────────
export function buildMasterySession(pools, completedLessons, options = {}) {
  // pools: [{ type: "quiz"|"exercise", items: [...], history: {...} }]
  const {
    targetCount = 8,
    maxSameTypeConsecutive = 2,
    today = new Date().toISOString().split("T")[0],
  } = options;

  const eligible = [];
  for (const { type, items, history } of pools) {
    for (const item of items) {
      if (isEligible(item, completedLessons)) {
        eligible.push({ type, item, history });
      }
    }
  }
  if (eligible.length === 0) return { session: [], reason: "no_lessons_completed" };

  const scored = eligible
    .map(x => ({ ...x, score: getPriorityScore(x.item.id, x.history, completedLessons, today) }))
    .filter(x => x.score > 0)
    .sort((a, b) => b.score - a.score);

  if (scored.length === 0) {
    const oldest = eligible
      .map(x => ({ ...x, lastSeen: x.history?.[x.item.id]?.lastSeen || "2000-01-01" }))
      .sort((a, b) => a.lastSeen.localeCompare(b.lastSeen))
      .slice(0, targetCount);
    return { session: oldest.map(({ type, item }) => ({ type, item })), reason: "all_recent" };
  }

  const session = [];
  for (const x of scored) {
    if (session.length >= targetCount) break;
    const lastFew = session.slice(-maxSameTypeConsecutive);
    const allSameType = lastFew.length === maxSameTypeConsecutive && lastFew.every(s => s.type === x.type);
    if (allSameType) continue;
    session.push({ type: x.type, item: x.item });
  }
  if (session.length < Math.min(targetCount, scored.length)) {
    for (const x of scored) {
      if (session.length >= targetCount) break;
      if (!session.find(s => s.item.id === x.item.id && s.type === x.type)) {
        session.push({ type: x.type, item: x.item });
      }
    }
  }

  return { session, reason: "normal" };
}

// ─────────────────────────────────────────────────────────────────────────
// MISE A JOUR DE L'HISTORIQUE apres une reponse
// Inchangee dans son comportement — c'est la fonction deja utilisee pour
// le quiz. Fonctionne aussi bien pour les exercices : on l'appelle juste
// avec exerciseHistory au lieu de reviewHistory depuis l'appelant.
// ─────────────────────────────────────────────────────────────────────────
export function updateReviewHistory(history, itemId, correct, today) {
  const prev = history?.[itemId] || { attempts: 0, successes: 0, streak: 0, lastSeen: "" };
  return {
    ...history,
    [itemId]: {
      attempts:  prev.attempts + 1,
      successes: prev.successes + (correct ? 1 : 0),
      streak:    correct ? prev.streak + 1 : 0,
      lastSeen:  today,
    },
  };
}

// ─────────────────────────────────────────────────────────────────────────
// STATS POUR L'AFFICHAGE HOME (quiz uniquement — inchangee)
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

// ─────────────────────────────────────────────────────────────────────────
// STATS COMBINEES (quiz + exercices) — pour "X items à revoir" côté Home
// une fois la session du jour fusionnée.
// ─────────────────────────────────────────────────────────────────────────
export function getMasteryStats(pools, completedLessons) {
  const today = new Date().toISOString().split("T")[0];
  let eligible = 0, toReview = 0, neverSeen = 0, mastered = 0;

  for (const { items, history } of pools) {
    const elig = items.filter(it => isEligible(it, completedLessons));
    eligible += elig.length;
    toReview += elig.filter(it => getPriorityScore(it.id, history, completedLessons, today) > 0).length;
    neverSeen += elig.filter(it => !history?.[it.id]).length;
    mastered += elig.filter(it => (history?.[it.id]?.streak || 0) >= 4).length;
  }

  return {
    eligible, neverSeen, mastered,
    toReview: Math.min(toReview, 99),
    pctMastered: eligible > 0 ? Math.round((mastered / eligible) * 100) : 0,
  };
}
