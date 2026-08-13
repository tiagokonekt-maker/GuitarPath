// Groply — store/state.js
// État initial, persistance localStorage, migration des anciennes clés,
// merge multi-appareils et merge des packs de contenu.

import { levelFromXp, sanitizeXp } from "./leveling.js";
import { defaultDailyXp } from "./xp.js";
// Les dates vivent maintenant dans dates.js (heure LOCALE, pas UTC).
// Réexportées ici pour ne casser aucun import existant.
import { todayStr, weekStr, dayStr, daysAgoStr, daysBetween, normalizeWeek, compareWeeks } from "./dates.js";
export { todayStr, weekStr, dayStr, daysAgoStr, daysBetween, normalizeWeek, compareWeeks };

// ── Clés de stockage ───────────────────────────────────────────────────────
export const STATE_KEY   = "groply_state";
export const CONTENT_KEY = "groply_content";

const LEGACY_STATE_KEYS   = ["guitarpath_v4_state", "guitarpath_v3_state"];
const LEGACY_CONTENT_KEYS = ["guitarpath_v3_content"];

/** Version du schéma d'état — sert aux migrations idempotentes. */
export const STATE_VERSION = 5;

export const defaultState = () => ({
  version: STATE_VERSION,
  xp: 0, level: 1, streak: 0, lastSessionDate: "",
  streakFreezes: 1,
  theme: "auto",
  completedExercises: {}, exerciseProgress: {}, exerciseHistory: {},
  quizResults: {}, wrongQuiz: [],
  completedLessons: {},
  reviewHistory: {},
  dailyChallengeIdx: 0, dailyChallengeDone: false, dailyChallengeDate: "",
  dailyChallengeCount: 0,
  unlockedBadges: [],
  claimedUnits: {},
  unitChecks: {},
  weeklyGoals: { sessions: 0, exercises: 0, quizzes: 0, week: "" },
  practiceLibre: { count: 0, totalMinutes: 0 },
  sessionHistory: [],
  gropiTipDate: "",

  // Compteur quotidien d'XP d'entretien (plafonne le farming — voir xp.js)
  dailyXp: defaultDailyXp(),

  // Horodatage du dernier RESET volontaire. Sert de départage au merge :
  // sans lui, un reset était systématiquement annulé par n'importe quel
  // autre appareil encore porteur de l'ancienne progression (audit §2.3).
  resetAt: "",

  // Dernier crédit d'XP réellement accordé — permet aux écrans d'afficher
  // le vrai montant plutôt qu'une valeur nominale.
  lastGain: { xp: 0, kind: "", at: "" },

  onboarding: {
    done: false,
    goal: null,
    preferredModule: null,
    timePerWeek: null,
    skillLevels: { neck: null, scales: null, harmony: null, rhythm: null, impro: null },
    overallTier: null,
    weakestModule: null,
    startXp: 0,
    startLevel: 1,
    skipped: false,
    completedAt: "",
  },
});

// ── Migrations ─────────────────────────────────────────────────────────────
// Chaque migration doit être IDEMPOTENTE : appliquée deux fois, elle donne
// le même résultat. C'est ce qui permet de les rejouer sans risque quand un
// état revient du cloud dans un format ancien.
function migrate(parsed) {
  const s = { ...defaultState(), ...parsed };

  // v4 → v5 : les clés de semaine n'étaient pas paddées ("2026-W9"), ce qui
  // les rendait incomparables comme chaînes. On normalise en lecture.
  if (s.weeklyGoals?.week) {
    s.weeklyGoals = { ...s.weeklyGoals, week: normalizeWeek(s.weeklyGoals.week) };
  }

  // Le niveau est TOUJOURS dérivé de l'XP (source de vérité unique), et
  // l'XP est assainie (NaN, négatif, Infinity venant d'un import bricolé).
  s.xp = sanitizeXp(s.xp);
  s.level = levelFromXp(s.xp);

  // Champs ajoutés après coup : on garantit leur forme.
  if (!s.dailyXp || typeof s.dailyXp !== "object") s.dailyXp = defaultDailyXp();
  if (!Array.isArray(s.wrongQuiz)) s.wrongQuiz = [];
  if (!Array.isArray(s.unlockedBadges)) s.unlockedBadges = [];
  if (!Array.isArray(s.sessionHistory)) s.sessionHistory = [];
  if (typeof s.resetAt !== "string") s.resetAt = "";
  s.onboarding = { ...defaultState().onboarding, ...(s.onboarding || {}) };

  // Les comptes déjà actifs avant l'introduction de l'onboarding ne doivent
  // pas se le voir imposer rétroactivement.
  if (!parsed?.onboarding && Object.keys(parsed?.completedLessons || {}).length > 0) {
    s.onboarding = { ...s.onboarding, done: true, skipped: true };
  }

  s.version = STATE_VERSION;
  return s;
}

// ── Chargement + migration ────────────────────────────────────────────────
export const loadState = () => {
  try {
    let raw = localStorage.getItem(STATE_KEY);

    if (!raw) {
      for (const key of LEGACY_STATE_KEYS) {
        const legacy = localStorage.getItem(key);
        if (legacy) { raw = legacy; break; }
      }
      if (raw) { try { localStorage.setItem(STATE_KEY, raw); } catch { /* quota */ } }
    }

    const parsed = raw ? JSON.parse(raw) : {};
    return migrate(parsed);
  } catch { return defaultState(); }
};

/**
 * Écrit l'état. Renvoie true/false plutôt que d'échouer en silence : le
 * quota localStorage (~5 Mo) peut être atteint si un gros pack de contenu a
 * été importé, et perdre la progression sans le dire est le pire scénario.
 */
export const saveState = (s) => {
  try {
    localStorage.setItem(STATE_KEY, JSON.stringify(s));
    return true;
  } catch (e) {
    // Dernier recours : on tente de libérer le pack de contenu importé,
    // qui est reconstructible, plutôt que de perdre la progression, qui ne
    // l'est pas.
    try {
      localStorage.removeItem(CONTENT_KEY);
      localStorage.setItem(STATE_KEY, JSON.stringify(s));
      return true;
    } catch {
      console.error("Groply — impossible de sauvegarder la progression :", e);
      return false;
    }
  }
};

// ── Merge multi-appareils ─────────────────────────────────────────────────
// Fusionne l'état local et l'état cloud champ par champ. Règle générale :
// on garde le « plus avancé » des deux (max, union, plus récent).
const maxStr = (a = "", b = "") => (a > b ? a : b);
const maxNum = (a, b) => Math.max(Number(a) || 0, Number(b) || 0);

/**
 * Un RESET volontaire doit gagner contre un état plus « avancé ».
 * On considère qu'un côté a été réinitialisé APRÈS l'autre si son `resetAt`
 * est postérieur à la dernière activité connue de l'autre côté. Dans ce
 * cas, la progression de l'autre côté est écartée au lieu d'être fusionnée.
 */
function resetWins(a, b) {
  if (!a?.resetAt) return false;
  const otherActivity = maxStr(b?.lastSessionDate || "", (b?.resetAt || "").slice(0, 10));
  return a.resetAt.slice(0, 10) >= otherActivity;
}

export const mergeStates = (local, cloud) => {
  if (!cloud) return local;
  if (!local) return migrate(cloud);

  const L = migrate(local), C = migrate(cloud);

  // ── Départage par RESET ────────────────────────────────────────────────
  // Avant ce garde-fou, la confirmation « action irréversible » mentait :
  // Math.max(0, 4200) rendait 4200 dès que le second appareil se
  // resynchronisait, et la progression ressuscitait.
  if (resetWins(L, C) && !resetWins(C, L)) {
    return { ...L, resetAt: L.resetAt };
  }
  if (resetWins(C, L) && !resetWins(L, C)) {
    return { ...C, theme: L.theme || C.theme, resetAt: C.resetAt };
  }

  const m = { ...L };
  m.resetAt = maxStr(L.resetAt, C.resetAt);

  // Progression globale
  m.xp = sanitizeXp(maxNum(L.xp, C.xp));
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

  // Révision espacée : on garde l'entrée la plus travaillée, puis la plus récente
  const mergeHistories = (a = {}, b = {}) => {
    const out = { ...b };
    for (const [id, lh] of Object.entries(a)) {
      const ch = out[id];
      if (!ch) { out[id] = lh; continue; }
      const pickLocal =
        (lh.attempts || 0) > (ch.attempts || 0) ||
        ((lh.attempts || 0) === (ch.attempts || 0) && (lh.lastSeen || "") >= (ch.lastSeen || ""));
      out[id] = pickLocal ? lh : ch;
    }
    return out;
  };
  m.reviewHistory   = mergeHistories(L.reviewHistory,   C.reviewHistory);
  m.exerciseHistory = mergeHistories(L.exerciseHistory, C.exerciseHistory);

  // Badges : union
  m.unlockedBadges = [...new Set([...(L.unlockedBadges || []), ...(C.unlockedBadges || [])])];

  // Coffres d'unités : union (réclamé quelque part = réclamé partout)
  m.claimedUnits = { ...(C.claimedUnits || {}), ...(L.claimedUnits || {}) };

  // Vérifications d'unité : une réussite reste une réussite partout
  const allCheckIds = new Set([...Object.keys(L.unitChecks || {}), ...Object.keys(C.unitChecks || {})]);
  m.unitChecks = {};
  for (const id of allCheckIds) {
    const a = L.unitChecks?.[id], b = C.unitChecks?.[id];
    m.unitChecks[id] = {
      passed: !!(a?.passed || b?.passed),
      score: Math.max(a?.score || 0, b?.score || 0),
      attempts: Math.max(a?.attempts || 0, b?.attempts || 0),
      lastAttemptAt: (a?.lastAttemptAt || "") >= (b?.lastAttemptAt || "")
        ? (a?.lastAttemptAt || b?.lastAttemptAt)
        : (b?.lastAttemptAt || a?.lastAttemptAt),
    };
  }

  // Défi du jour : l'appareil le plus récent fait foi, le compteur prend le max
  const localDailyNewer = (L.dailyChallengeDate || "") >= (C.dailyChallengeDate || "");
  const dailySrc = localDailyNewer ? L : C;
  m.dailyChallengeIdx   = dailySrc.dailyChallengeIdx ?? 0;
  m.dailyChallengeDone  = dailySrc.dailyChallengeDone ?? false;
  m.dailyChallengeDate  = dailySrc.dailyChallengeDate ?? "";
  m.dailyChallengeCount = maxNum(L.dailyChallengeCount, C.dailyChallengeCount);

  // Compteur d'XP d'entretien : on garde le plus élevé du jour courant,
  // sinon celui du jour le plus récent (sinon on offrirait un second
  // plafond quotidien en changeant d'appareil).
  const ld = L.dailyXp || {}, cd = C.dailyXp || {};
  m.dailyXp = ld.date === cd.date
    ? { date: ld.date || "", repeat: maxNum(ld.repeat, cd.repeat), practice: maxNum(ld.practice, cd.practice) }
    : ((ld.date || "") >= (cd.date || "") ? { ...defaultDailyXp(), ...ld } : { ...defaultDailyXp(), ...cd });

  // Objectifs hebdo : même semaine → max champ par champ, sinon la PLUS
  // RÉCENTE. La comparaison passe par compareWeeks(), qui normalise le
  // padding : "2026-W9" vs "2026-W12" était comparé comme une chaîne et
  // faisait gagner la semaine 9 (audit §2.2).
  const lw = { ...(L.weeklyGoals || {}) }, cw = { ...(C.weeklyGoals || {}) };
  lw.week = normalizeWeek(lw.week); cw.week = normalizeWeek(cw.week);
  m.weeklyGoals = lw.week === cw.week
    ? { week: lw.week || "",
        sessions:  maxNum(lw.sessions,  cw.sessions),
        exercises: maxNum(lw.exercises, cw.exercises),
        quizzes:   maxNum(lw.quizzes,   cw.quizzes) }
    : (compareWeeks(lw.week, cw.week) >= 0
        ? { ...defaultState().weeklyGoals, ...lw }
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

  // Onboarding : fait quelque part = fait partout
  m.onboarding = (L.onboarding?.done || C.onboarding?.done)
    ? (L.onboarding?.done ? L.onboarding : C.onboarding)
    : (L.onboarding || C.onboarding || defaultState().onboarding);

  return m;
};

// ── Merge des packs de contenu ────────────────────────────────────────────
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
    if (!raw && key === CONTENT_KEY) {
      for (const legacy of LEGACY_CONTENT_KEYS) {
        const old = localStorage.getItem(legacy);
        if (old) { raw = old; try { localStorage.setItem(CONTENT_KEY, old); } catch {} break; }
      }
    }
    if (!raw) return defaults;
    const imported = JSON.parse(raw);
    return {
      courses:   mergeCourses(defaults.courses, imported.courses   || []),
      quiz:      mergeById(defaults.quiz,       imported.quiz      || []),
      exercises: mergeById(defaults.exercises,  imported.exercises || []),
    };
  } catch { return defaults; }
};
