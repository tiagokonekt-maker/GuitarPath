// Groply — store/state.js
// État initial, persistance localStorage, migration des anciennes clés,
// merge multi-appareils et merge des packs de contenu.

import { levelFromXp } from "./leveling.js";

// ── Clés de stockage ───────────────────────────────────────────────────────
// Nom définitif : Groply. Les anciennes clés GuitarPath sont migrées
// automatiquement au premier chargement (aucune perte de progression).
export const STATE_KEY   = "groply_state";
export const CONTENT_KEY = "groply_content";

const LEGACY_STATE_KEYS   = ["guitarpath_v4_state", "guitarpath_v3_state"];
const LEGACY_CONTENT_KEYS = ["guitarpath_v3_content"];

export const defaultState = () => ({
  xp: 0, level: 1, streak: 0, lastSessionDate: "",
  streakFreezes: 1,          // gels de série — protègent 1 jour manqué
  theme: "auto",             // "auto" | "light" | "dark"
  completedExercises: {}, exerciseProgress: {},
  quizResults: {}, wrongQuiz: [],
  completedLessons: {},
  reviewHistory: {},
  dailyChallengeIdx: 0, dailyChallengeDone: false, dailyChallengeDate: "",
  dailyChallengeCount: 0,
  unlockedBadges: [],
  claimedUnits: {},          // coffres d'unités du Parcours déjà réclamés
  unitChecks: {},            // { [unitId]: { passed, score, attempts, lastAttemptAt } }
  weeklyGoals: { sessions: 0, exercises: 0, quizzes: 0, week: "" },
  practiceLibre: { count: 0, totalMinutes: 0 },
  sessionHistory: [],
  gropiTipDate: "",

  // ── Onboarding ──────────────────────────────────────────────────────────
  // Rempli une seule fois à la première ouverture, via un vrai test de
  // placement adaptatif (pas d'auto-évaluation) + objectif + temps dispo.
  // Sert à réordonner le Parcours et adapter le ton de Gropi — ne coche
  // jamais de leçon comme acquise à la place de l'utilisateur.
  onboarding: {
    done: false,
    goal: null,            // "impro" | "theorie" | "manche" | "global"
    preferredModule: null, // "impro" | "harmony" | "neck" | null (issu de l'objectif)
    timePerWeek: null,     // "short" | "medium" | "long"
    skillLevels: { neck: null, scales: null, harmony: null, rhythm: null, impro: null }, // "A1"|"A2"|"B1"|"B2"
    overallTier: null,     // "A1" | "A2" | "B1" | "B2"
    weakestModule: null,   // module à mettre en priorité (issu du test réel)
    startXp: 0,             // XP de départ crédité selon le résultat du test
    skipped: false,        // conservé pour compat historique / cas de secours
    completedAt: "",
  },
});

// ── Chargement + migration ────────────────────────────────────────────────
export const loadState = () => {
  try {
    let raw = localStorage.getItem(STATE_KEY);

    // Migration : reprendre l'ancienne clé la plus récente disponible
    if (!raw) {
      for (const key of LEGACY_STATE_KEYS) {
        const legacy = localStorage.getItem(key);
        if (legacy) { raw = legacy; break; }
      }
      if (raw) localStorage.setItem(STATE_KEY, raw); // écrire sous la nouvelle clé
    }

    const parsed = raw ? JSON.parse(raw) : {};
    const s = { ...defaultState(), ...parsed };
    // Le niveau est TOUJOURS dérivé de l'XP (source de vérité unique).
    // Corrige aussi les états créés avec l'ancienne formule linéaire.
    s.level = levelFromXp(s.xp);

    // Les comptes déjà actifs avant l'introduction de l'onboarding ne
    // doivent pas se le voir imposer rétroactivement (ils ont déjà de la
    // progression = ils n'ont pas besoin d'être "accueillis").
    if (!parsed.onboarding && Object.keys(parsed.completedLessons || {}).length > 0) {
      s.onboarding = { ...s.onboarding, done: true, skipped: true };
    }

    return s;
  } catch { return defaultState(); }
};

export const saveState = (s) => {
  try { localStorage.setItem(STATE_KEY, JSON.stringify(s)); } catch {}
};

// ── Dates ─────────────────────────────────────────────────────────────────
export const todayStr = () => new Date().toISOString().split("T")[0];

// Semaine ISO 8601 (lundi = premier jour, semaine 1 = celle du premier jeudi).
// L'ancienne formule approximative pouvait décaler la semaine en début d'année.
export const weekStr = (date = new Date()) => {
  const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  const dayNum = d.getUTCDay() || 7;              // dimanche → 7
  d.setUTCDate(d.getUTCDate() + 4 - dayNum);      // jeudi de la semaine courante
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  const week = Math.ceil(((d - yearStart) / 86400000 + 1) / 7);
  return `${d.getUTCFullYear()}-W${week}`;
};

// ── Merge multi-appareils ─────────────────────────────────────────────────
// Fusionne l'état local et l'état cloud champ par champ, au lieu d'écraser.
// Règle générale : on garde le "plus avancé" des deux (max, union, plus récent).
const maxStr = (a = "", b = "") => (a > b ? a : b);
const maxNum = (a, b) => Math.max(Number(a) || 0, Number(b) || 0);

export const mergeStates = (local, cloud) => {
  if (!cloud) return local;
  if (!local) return { ...defaultState(), ...cloud };
  const L = local, C = cloud;
  const m = { ...L };

  // Progression globale
  m.xp = maxNum(L.xp, C.xp);
  m.level = levelFromXp(m.xp);
  m.streak = maxNum(L.streak, C.streak);
  m.lastSessionDate = maxStr(L.lastSessionDate, C.lastSessionDate);
  m.streakFreezes = maxNum(L.streakFreezes, C.streakFreezes);

  // Leçons : union, on conserve la date la plus ancienne (première complétion)
  m.completedLessons = { ...C.completedLessons, ...L.completedLessons };
  for (const id of Object.keys(C.completedLessons || {})) {
    if (L.completedLessons?.[id] && C.completedLessons[id] < L.completedLessons[id])
      m.completedLessons[id] = C.completedLessons[id];
  }

  // Exercices : union, count max, première date de complétion
  m.completedExercises = { ...(C.completedExercises || {}) };
  for (const [id, le] of Object.entries(L.completedExercises || {})) {
    const ce = m.completedExercises[id];
    m.completedExercises[id] = ce
      ? { completedAt: ce.completedAt < le.completedAt ? ce.completedAt : le.completedAt,
          count: maxNum(ce.count, le.count) }
      : le;
  }
  m.exerciseProgress = { ...(C.exerciseProgress || {}), ...(L.exerciseProgress || {}) };

  // Quiz : attempts max, correct si réussi sur l'un des deux appareils
  m.quizResults = { ...(C.quizResults || {}) };
  for (const [id, lr] of Object.entries(L.quizResults || {})) {
    const cr = m.quizResults[id];
    m.quizResults[id] = cr
      ? { correct: !!(cr.correct || lr.correct),
          attempts: maxNum(cr.attempts, lr.attempts),
          lastAttempt: maxStr(cr.lastAttempt, lr.lastAttempt) }
      : lr;
  }
  m.wrongQuiz = [...new Set([...(L.wrongQuiz || []), ...(C.wrongQuiz || [])])]
    .filter(id => !m.quizResults[id]?.correct);

  // Révision espacée : on garde l'entrée la plus travaillée (puis la plus récente)
  m.reviewHistory = { ...(C.reviewHistory || {}) };
  for (const [id, lh] of Object.entries(L.reviewHistory || {})) {
    const ch = m.reviewHistory[id];
    if (!ch) { m.reviewHistory[id] = lh; continue; }
    const pickLocal =
      (lh.attempts || 0) > (ch.attempts || 0) ||
      ((lh.attempts || 0) === (ch.attempts || 0) && (lh.lastSeen || "") >= (ch.lastSeen || ""));
    m.reviewHistory[id] = pickLocal ? lh : ch;
  }

  // Badges : union
  m.unlockedBadges = [...new Set([...(L.unlockedBadges || []), ...(C.unlockedBadges || [])])];

  // Coffres d'unités : union (réclamé quelque part = réclamé partout)
  m.claimedUnits = { ...(C.claimedUnits || {}), ...(L.claimedUnits || {}) };

  // Vérifications d'unité : une réussite sur un appareil reste une réussite partout
  const allCheckIds = new Set([...Object.keys(L.unitChecks || {}), ...Object.keys(C.unitChecks || {})]);
  m.unitChecks = {};
  for (const id of allCheckIds) {
    const a = L.unitChecks?.[id], b = C.unitChecks?.[id];
    m.unitChecks[id] = {
      passed: !!(a?.passed || b?.passed),
      score: Math.max(a?.score || 0, b?.score || 0),
      attempts: Math.max(a?.attempts || 0, b?.attempts || 0),
      lastAttemptAt: (a?.lastAttemptAt || "") >= (b?.lastAttemptAt || "") ? (a?.lastAttemptAt || b?.lastAttemptAt) : (b?.lastAttemptAt || a?.lastAttemptAt),
    };
  }

  // Défi du jour : l'appareil le plus récent fait foi, le compteur prend le max
  const localDailyNewer = (L.dailyChallengeDate || "") >= (C.dailyChallengeDate || "");
  const dailySrc = localDailyNewer ? L : C;
  m.dailyChallengeIdx  = dailySrc.dailyChallengeIdx ?? 0;
  m.dailyChallengeDone = dailySrc.dailyChallengeDone ?? false;
  m.dailyChallengeDate = dailySrc.dailyChallengeDate ?? "";
  m.dailyChallengeCount = maxNum(L.dailyChallengeCount, C.dailyChallengeCount);

  // Objectifs hebdo : même semaine → max champ par champ, sinon la plus récente
  const lw = L.weeklyGoals || {}, cw = C.weeklyGoals || {};
  m.weeklyGoals = lw.week === cw.week
    ? { week: lw.week || "",
        sessions:  maxNum(lw.sessions,  cw.sessions),
        exercises: maxNum(lw.exercises, cw.exercises),
        quizzes:   maxNum(lw.quizzes,   cw.quizzes) }
    : ((lw.week || "") >= (cw.week || "") ? { ...defaultState().weeklyGoals, ...lw }
                                           : { ...defaultState().weeklyGoals, ...cw });

  // Pratique libre
  m.practiceLibre = {
    count:        maxNum(L.practiceLibre?.count,        C.practiceLibre?.count),
    totalMinutes: maxNum(L.practiceLibre?.totalMinutes, C.practiceLibre?.totalMinutes),
  };

  // Historique : concat dédupliqué, tri par date décroissante, 10 max
  const seen = new Set();
  m.sessionHistory = [...(L.sessionHistory || []), ...(C.sessionHistory || [])]
    .filter(e => {
      const key = `${e.type}|${e.id || ""}|${e.date}|${e.xp}|${e.title || ""}`;
      if (seen.has(key)) return false;
      seen.add(key); return true;
    })
    .sort((a, b) => (b.date || "").localeCompare(a.date || ""))
    .slice(0, 10);

  // Préférences : le local gagne (c'est l'appareil qu'on a en main)
  m.theme = L.theme || C.theme || "auto";
  m.gropiTipDate = maxStr(L.gropiTipDate, C.gropiTipDate);

  // Onboarding : fait quelque part = fait partout (pas de re-proposition
  // sur un 2e appareil une fois qu'il a été rempli sur le premier).
  m.onboarding = (L.onboarding?.done || C.onboarding?.done)
    ? (L.onboarding?.done ? L.onboarding : C.onboarding)
    : (L.onboarding || C.onboarding || defaultState().onboarding);

  return m;
};

// ── Merge des packs de contenu (inchangé) ─────────────────────────────────
export const mergeById = (defaults, imported) => {
  const map = new Map(defaults.map(item => [item.id, item]));
  imported.forEach(item => map.set(item.id, item));
  return Array.from(map.values());
};

export const mergeCourses = (defaults, imported) => {
  const map = new Map(defaults.map(c => [c.id, c]));
  imported.forEach(c => {
    if (map.has(c.id)) {
      const existing = map.get(c.id);
      // L'importé doit gagner sur le défaut pour les leçons en commun (c'est
      // le sens même d'un import : personnaliser/mettre à jour le contenu de
      // base) — pas l'inverse, sinon toute personnalisation est silencieusement
      // écrasée par les valeurs par défaut à chaque rechargement de l'app.
      const lessonMap = new Map((existing.lessons || []).map(l => [l.id, l]));
      (c.lessons || []).forEach(l => lessonMap.set(l.id, l));
      map.set(c.id, { ...existing, ...c, lessons: Array.from(lessonMap.values()) });
    } else {
      map.set(c.id, c);
    }
  });
  return Array.from(map.values());
};

export const loadContent = (defaults, CONTENT_KEY_PARAM) => {
  const key = CONTENT_KEY_PARAM || CONTENT_KEY;
  try {
    let raw = localStorage.getItem(key);
    // Migration du pack de contenu importé (ancienne clé GuitarPath)
    if (!raw && key === CONTENT_KEY) {
      for (const legacy of LEGACY_CONTENT_KEYS) {
        const old = localStorage.getItem(legacy);
        if (old) { raw = old; localStorage.setItem(CONTENT_KEY, old); break; }
      }
    }
    if (!raw) return defaults;
    const imported = JSON.parse(raw);
    return {
      courses:   mergeCourses(defaults.courses,   imported.courses   || []),
      quiz:      mergeById(defaults.quiz,          imported.quiz      || []),
      exercises: mergeById(defaults.exercises,     imported.exercises || []),
    };
  } catch { return defaults; }
};
